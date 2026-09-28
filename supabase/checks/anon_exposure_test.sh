#!/usr/bin/env bash
# =============================================================================
# Anon erişim testi (REST) — migration ÖNCESİ ve SONRASI çalıştırın.
#
# Kullanım:
#   export SUPABASE_URL="https://qlcbobvbircjhlglhfhr.supabase.co"
#   export SUPABASE_ANON_KEY="<anon key; Dashboard → Project Settings → API>"
#   bash supabase/checks/anon_exposure_test.sh
#
# Anahtar hiçbir yerde yazdırılmaz; yalnızca HTTP başlığında gönderilir.
#
# Her tablo için:
#   GET  : ?select=*&limit=1  → 200 + veri döndüyse AÇIK. 200 + boş dizi ise
#          "KAPALI?" (RLS satırları gizliyor olabilir ya da tablo boş olabilir).
#          401/403/404 → KAPALI.
#   POST : BOŞ DİZİ ([]) gönderilir → hiçbir satır YAZILMAZ, ama Postgres INSERT
#          yetkisini yine de denetler.
#          Yetki hatası (401/403, 42501) → KAPALI.
#          2xx → anon'un INSERT yetkisi (GRANT) var → AÇIK. (RLS policy'leri satır
#          bazında yine engelliyor olabilir; 0 satırda WITH CHECK çalışmaz. Bu
#          yüzden policy tarafını 01_policy_audit.sql ile doğrulayın.)
# =============================================================================
set -euo pipefail

: "${SUPABASE_URL:?SUPABASE_URL ortam değişkeni gerekli}"
: "${SUPABASE_ANON_KEY:?SUPABASE_ANON_KEY ortam değişkeni gerekli}"

BASE="${SUPABASE_URL%/}/rest/v1"
TABLES=(bots_leads bots_tasks bots_settings bots_contacts bots_companies bots_team_members bots_rate_limits)
TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

# Anahtarı komut satırında göstermemek için başlıkları curl'e stdin/config ile veriyoruz.
curl_anon() {
  # $1: method, $2: url, $3: (opsiyonel) body
  local method="$1" url="$2" body="${3:-}"
  {
    printf 'header = "apikey: %s"\n' "$SUPABASE_ANON_KEY"
    printf 'header = "Authorization: Bearer %s"\n' "$SUPABASE_ANON_KEY"
  } | if [[ -n "$body" ]]; then
    curl -sS -o "$TMP" -w '%{http_code}' -K - -X "$method" \
      -H 'Content-Type: application/json' -H 'Prefer: return=minimal' \
      --data "$body" "$url"
  else
    curl -sS -o "$TMP" -w '%{http_code}' -K - -X "$method" "$url"
  fi
}

open_count=0
printf '%-20s %-6s %-6s %s\n' "TABLO" "İŞLEM" "HTTP" "SONUÇ"
printf '%-20s %-6s %-6s %s\n' "-----" "-----" "----" "-----"

for t in "${TABLES[@]}"; do
  # --- GET ---
  code="$(curl_anon GET "$BASE/$t?select=*&limit=1" || echo 000)"
  body="$(head -c 400 "$TMP" 2>/dev/null || true)"
  if [[ "$code" == "200" ]]; then
    if [[ "$body" =~ ^\[[[:space:]]*\]$ ]]; then
      result="KAPALI? (200, boş dizi: RLS gizliyor ya da tablo boş)"
    else
      result="AÇIK (veri döndü)"; open_count=$((open_count+1))
    fi
  elif [[ "$code" =~ ^(401|403)$ ]] || [[ "$body" == *"42501"* ]]; then
    result="KAPALI"
  elif [[ "$code" == "404" ]]; then
    result="KAPALI (tablo yok/erişilemez)"
  else
    result="BELİRSİZ"
  fi
  printf '%-20s %-6s %-6s %s\n' "$t" "GET" "$code" "$result"

  # --- POST ---
  code="$(curl_anon POST "$BASE/$t" '[]' || echo 000)"
  body="$(head -c 400 "$TMP" 2>/dev/null || true)"
  if [[ "$code" =~ ^(401|403)$ ]] || [[ "$body" == *"42501"* ]] || [[ "$body" == *"row-level security"* ]]; then
    result="KAPALI"
  elif [[ "$code" == "404" ]]; then
    result="KAPALI (tablo yok/erişilemez)"
  elif [[ "$code" =~ ^2 ]]; then
    result="AÇIK (anon INSERT yetkisine sahip)"; open_count=$((open_count+1))
  else
    result="BELİRSİZ"
  fi
  printf '%-20s %-6s %-6s %s\n' "$t" "POST" "$code" "$result"
done

echo
if (( open_count > 0 )); then
  echo "SONUÇ: $open_count AÇIK erişim bulundu. SECURITY.md adımlarını uygulayın."
  exit 1
else
  echo "SONUÇ: Anon erişimi kapalı görünüyor."
fi
