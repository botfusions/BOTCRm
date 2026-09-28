# BOTCRM — Güvenlik sertleştirme runbook'u

Bu belge, CRM verisinin anon anahtarla herkese açık olması ve Gemini anahtarının
tarayıcı paketine gömülmesi sorunlarını kapatmak için **sırayla** uygulanacak adımları
içerir. Hedef proje: **`https://qlcbobvbircjhlglhfhr.supabase.co`**.

> **ACİL — hemen, taşımayı beklemeden:** [Adım 1](#adım-1--sızan-gemini-anahtarını-iptal-edin)
> (Gemini anahtarını iptal edin). Anahtar derlenmiş JS paketine gömülü olduğundan siteyi
> açan herkes onu görebilir.

Repodaki dosyalar:

| Dosya | Ne işe yarar |
|---|---|
| `supabase/MIGRATION.md` | Adım 0: eski projeden yeni projeye taşıma |
| `supabase/migrations/20260928000001_security_hardening.sql` | RLS, ekip üyeliği, hız sınırı tablosu (idempotent) |
| `supabase/checks/01_policy_audit.sql` | Tablolardaki tüm policy'leri listeler (salt okunur) |
| `supabase/checks/02_anon_exposure_test.sql` | Anon yetkilerini SQL'den raporlar (salt okunur) |
| `supabase/checks/anon_exposure_test.sh` | Anon key ile REST üzerinden GET/POST dener, AÇIK/KAPALI raporlar |
| `supabase/checks/03_row_counts.sql` | Taşıma sonrası satır sayısı karşılaştırması |
| `supabase/functions/parse-lead` | Gemini ile metinden lead çıkarma (yalnızca ekip üyeleri) |
| `supabase/functions/submit-lead` | Landing page formu (herkese açık, doğrulama + hız sınırı) |
| `supabase/rollback/20260928000001_security_hardening_down.sql` | Geri alma (açığı yeniden açar!) |

Gereken araçlar: Supabase CLI (`supabase --version`), `curl`, `bash`; taşıma için `psql`/`pg_dump`.

---

## Adım 0 — Tek projeye taşıma (`rfwwnt…` → `qlcbob…`)

Ayrıntılı talimat: **[supabase/MIGRATION.md](supabase/MIGRATION.md)**. Özet:

1. ESKİ projeden `bots_*` şema ve veri yedeği (`pg_dump -t 'public.bots_*'` veya `supabase db dump`).
2. YENİ projeye önce `schema.sql`, sonra `data.sql`; ardından bu belgedeki Adım 2–9.
3. Ekip üyelerini YENİ projede *Authentication → Users → Invite* ile davet edin.
4. Storage: logo zaten YENİ'de; başka bucket varsa taşıyın.
5. Frontend `.env`/hosting: `VITE_SUPABASE_URL=https://qlcbobvbircjhlglhfhr.supabase.co` + YENİ anon key;
   sesli asistan: aynı `SUPABASE_URL` + YENİ service role key.
6. `supabase/checks/03_row_counts.sql` ile iki projede satır sayılarını karşılaştırın.
7. ESKİ projeyi 1–2 hafta duraklatılmış bırakın, sonra kendi kararınızla silin.

Aşağıdaki adımların tümü **YENİ projede** yapılır.

---

## Adım 1 — Sızan Gemini anahtarını iptal edin

`vite.config.ts` eskiden `GEMINI_API_KEY`'i `process.env.API_KEY` olarak pakete gömüyordu;
yayınlanmış her build'de anahtar açık metin olarak durur.

1. Anahtarı nereden oluşturduysanız oradan **silin/iptal edin**:
   - Google AI Studio → *Get API key* (aistudio.google.com/apikey) → ilgili anahtar → **Delete**, ya da
   - Google Cloud Console → *APIs & Services* → *Credentials* → anahtar → **Delete**.
2. **Yeni** bir anahtar oluşturun; Cloud Console'da *API restrictions* ile yalnızca
   *Generative Language API*'ye kısıtlayın.
3. Yeni anahtarı **hiçbir** `VITE_*` değişkenine, `.env`'e ya da hosting panelinin frontend
   ortamına koymayın. Yalnızca Adım 7'de Supabase secret olarak girilecek.
4. Google Cloud → *Billing* / AI Studio kullanım ekranından olağandışı kullanım var mı bakın.

## Adım 2 — Anon testi (ÖNCESİ)

Mevcut durumu kaydedin (sonra Adım 9'da karşılaştıracaksınız):

```bash
export SUPABASE_URL="https://qlcbobvbircjhlglhfhr.supabase.co"
read -rs SUPABASE_ANON_KEY && export SUPABASE_ANON_KEY   # anon key'i yapıştırın, Enter
bash supabase/checks/anon_exposure_test.sh | tee anon_oncesi.txt
```

Script anahtarı yazdırmaz. `POST` testi boş dizi (`[]`) gönderir, **veri yazmaz**.
SQL tarafı için ayrıca SQL Editor'da `supabase/checks/02_anon_exposure_test.sql`'i çalıştırabilirsiniz.

## Adım 3 — Policy audit

Supabase Dashboard → *SQL Editor* → `supabase/checks/01_policy_audit.sql` içeriğini yapıştırıp çalıştırın.

**Neden önemli:** RLS'te *permissive* policy'ler **VEYA (OR)** ile birleşir. Tabloda
"Enable read access for all users" (`roles = {public}`, `qual = true`) gibi bir policy
kaldıkça, bizim migration'ımız eklense bile o tablo **açık kalır**. Migration mevcut
policy'leri **otomatik silmez**; bu karar sizindir.

`not_ours = true` (adı `botcrm_` ile başlamayan) satırları inceleyin; `suspicious = true`
olanlar neredeyse kesin kaldırılmalıdır. Kaldırma komutlarını üretmek için:

```sql
select format('drop policy if exists %I on %I.%I;', policyname, schemaname, tablename) as komut
from pg_policies
where schemaname = 'public'
  and tablename in ('bots_leads','bots_tasks','bots_settings','bots_contacts',
                    'bots_companies','bots_team_members','bots_rate_limits')
  and policyname not like 'botcrm\_%';
```

Çıkan `drop policy ...` satırlarını gözden geçirip **tutmak istemediklerinizi** Adım 4'teki
migration'dan **hemen sonra** çalıştırın (önce çalıştırırsanız, migration'a kadar geçen
sürede uygulama veri göremeyebilir). Tek bir örnek:

```sql
drop policy if exists "Enable read access for all users" on public.bots_leads;
```

## Adım 4 — Migration'ı çalıştırın

SQL Editor'da `supabase/migrations/20260928000001_security_hardening.sql` dosyasının
**tamamını** yapıştırıp çalıştırın (ya da CLI ile: `supabase link --project-ref qlcbobvbircjhlglhfhr && supabase db push`).

- İdempotenttir; tekrar çalıştırmak güvenlidir. Olmayan `bots_*` tablosu atlanır.
- Sonunda `WARNING: Harici policy: ...` satırları görürseniz, bunlar Adım 3'te
  kaldırmanız gereken policy'lerdir. Kaldırdıktan sonra audit'i tekrar çalıştırın.
- Ne yapar: 5 CRM tablosunda RLS açar, **anon'un tüm yetkilerini kaldırır**, oturum açmış
  ve `bots_team_members` listesinde olan kullanıcılara erişim verir. `bots_settings`'te
  her kullanıcı yalnızca **kendi** satırını görür (tabloda `user_id` varsa).

Bu adımdan sonra, Adım 5 tamamlanana kadar **kimse** CRM verisini göremez — normaldir.

## Adım 5 — Ekip e-postalarını ekleyin

```sql
insert into public.bots_team_members(email) values
  ('ad.soyad@botfusions.com'),
  ('diger.kisi@botfusions.com')
on conflict do nothing;
```

- E-postalar **küçük harfle** yazılmalıdır (tablo büyük harfi reddeder).
- Kişinin Supabase Auth'taki e-postasıyla birebir aynı olmalıdır.
- Çıkarmak için: `delete from public.bots_team_members where email = 'kisi@botfusions.com';`

## Adım 6 — Yeni kayıtları (Sign ups) kapatın

Dashboard → *Authentication* → *Sign In / Providers* (eski arayüzde *Providers* / *Settings*)
→ **Allow new users to sign up** → **kapalı** → *Save*.

Ekibe yeni kişi eklemek için: *Authentication → Users → Invite user* + Adım 5'teki insert.
(Kayıt açık kalsa bile yeni kullanıcı `bots_team_members`'ta değilse veri göremez; ama
kapatmak saldırı yüzeyini küçültür.)

## Adım 7 — Edge Function secret'ları ve deploy

Secret'ları shell geçmişine yazmamak için repo **dışında** bir dosya kullanın:

```bash
# ~/botcrm-secrets.env  (repoya KOYMAYIN)
GEMINI_API_KEY=<Adım 1'deki yeni anahtar>
ALLOWED_ORIGINS=https://<crm-alan-adiniz>,https://<landing-alan-adiniz>
# İsteğe bağlı: GEMINI_MODEL=gemini-3.8-flash
```

```bash
supabase link --project-ref qlcbobvbircjhlglhfhr
supabase secrets set --env-file ~/botcrm-secrets.env
supabase functions deploy parse-lead submit-lead
supabase secrets list        # değerleri değil, yalnızca adları/özetleri gösterir
```

- `ALLOWED_ORIGINS` boş bırakılırsa yalnızca `http://localhost:3000` izinli olur (`*` kullanılmaz).
- `verify_jwt` ayarları `supabase/config.toml`'dan gelir (parse-lead: açık, submit-lead: kapalı).
  CLI'niz eskiyse submit-lead'i ayrıca `supabase functions deploy submit-lead --no-verify-jwt` ile deploy edin.
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` Edge Runtime'da otomatik tanımlıdır.

Hızlı deneme (test verisi ekler; sonra silebilirsiniz):

```bash
curl -sS -X POST "https://qlcbobvbircjhlglhfhr.supabase.co/functions/v1/submit-lead" \
  -H 'Content-Type: application/json' \
  -d '{"fullName":"Test Kisi","email":"test+botcrm@example.com","phone":"+90 555 000 00 00","website":""}'
# Beklenen: {"ok":true}   (aynı istek 5'ten fazla tekrarlanırsa 10 dk içinde 429)
```

## Adım 8 — `bots_settings`'teki gizli değerleri temizleyin ve anahtarları yenileyin

`bots_settings` şu ana kadar anon key ile herkese açıktı; içindeki her gizli değer
**ele geçirilmiş** kabul edilmelidir. Önce neyin dolu olduğuna bakın:

```sql
select user_id,
       (supabase_key       is not null and supabase_key       <> '') as supabase_key_dolu,
       (openai_key         is not null and openai_key         <> '') as openai_key_dolu,
       (telegram_bot_token is not null and telegram_bot_token <> '') as telegram_dolu,
       (instagram_token    is not null and instagram_token    <> '') as instagram_dolu,
       (n8n_webhook_url    is not null and n8n_webhook_url    <> '') as n8n_dolu
from public.bots_settings;
```

Boşaltılması önerilen kolonlar ve yenileme yerleri:

| Kolon | Yenileme (rotate) |
|---|---|
| `supabase_key` | Service role/secret key ise: Dashboard → *Project Settings* → *API Keys* → yeni secret key oluşturun, eskisini iptal edin. (Eski JWT tabanlı `service_role` anahtarında bu, JWT secret'ının yenilenmesi demektir ve **anon key'i de değiştirir** → frontend ortam değişkenini güncelleyin.) Sesli asistanın `.env`'ini de güncelleyin. |
| `openai_key` | platform.openai.com → *API keys* → eskisini **Revoke**, yenisini oluşturun. |
| `telegram_bot_token` | Telegram @BotFather → `/revoke` → yeni token. |
| `instagram_token` | Meta for Developers → uygulama → erişim token'ını yenileyin / oturumu kapatın. |
| `n8n_webhook_url` | n8n'de webhook yolunu değiştirin (URL biliniyorsa herkes tetikleyebilir). |

Temizleme örneği — **kendi kararınızla**, sonuçlarını anlayarak çalıştırın (kolon
`NOT NULL` ise `null` yerine `''` kullanın):

```sql
-- update public.bots_settings
--   set supabase_key = null, openai_key = null, telegram_bot_token = null,
--       instagram_token = null
-- where user_id = '<kendi user id'niz>';
```

Service role anahtarı bir daha **hiçbir** tabloya veya frontend'e yazılmamalıdır.

## Adım 9 — Anon testi (SONRASI)

```bash
bash supabase/checks/anon_exposure_test.sh | tee anon_sonrasi.txt
```

Beklenen: tüm satırlar `KAPALI`, çıkış kodu 0. Ayrıca Adım 3'teki audit'i tekrar
çalıştırın: yalnızca `botcrm_team_member_all` policy'leri kalmalı (ya da bilerek
tuttuklarınız). Frontend'de bir ekip üyesiyle giriş yapıp liste/ekleme/Gemini ile
ayrıştırma ve landing formunu deneyin.

## Adım 10 — Geri alma (rollback)

**Uyarı:** Geri alma, anon erişimini yeniden açar. Çoğu sorun geri alma gerektirmez:
veri görünmüyorsa e-posta `bots_team_members`'ta yoktur (Adım 5).

Gerekirse SQL Editor'da `supabase/rollback/20260928000001_security_hardening_down.sql`
dosyasını çalıştırın. İçeriği:

```sql
do $$
declare t text;
begin
  foreach t in array array['bots_leads','bots_tasks','bots_settings','bots_contacts','bots_companies']
  loop
    if to_regclass('public.' || t) is null then continue; end if;
    execute format('drop policy if exists %I on public.%I', 'botcrm_team_member_all', t);
    execute format('alter table public.%I disable row level security', t);
    execute format('grant select, insert, update, delete on table public.%I to anon', t);
  end loop;
end $$;
drop function if exists public.bots_rate_limit_hit(text, int);
drop function if exists public.bots_rate_limits_cleanup();
drop table if exists public.bots_rate_limits;
drop function if exists public.is_team_member();
drop table if exists public.bots_team_members;
```

Edge Function'ları kapatmak için: `supabase functions delete parse-lead` / `submit-lead`.
Adım 3'te sildiğiniz policy'ler geri gelmez; gerekirse audit çıktınızdaki tanımdan yeniden oluşturun.

---

## Bilinen sınırlar

- **Tek kiracılı model:** `bots_team_members`'taki herkes tüm lead/görev/kişi/şirket
  verisini görür ve düzenler. Rol/ekip bazlı ayrım yok. (İstisna: `bots_settings` kişiye özel.)
- **Hız sınırı IP tabanlıdır:** `x-forwarded-for` ilk değerinin SHA-256 özeti, 10 dakikalık
  sabit pencerede 5 gönderim. Aynı NAT arkasındaki kullanıcılar sınırı paylaşır; pencere
  sınırında kısa sürede ~10 gönderim mümkündür; başlığın ilk değeri istemci tarafından
  etkilenebiliyorsa sınır atlatılabilir. CAPTCHA yoktur (yalnızca honeypot).
- **`parse-lead` için hız sınırı yoktur;** yalnızca ekip üyeleri çağırabilir, ancak Gemini
  maliyeti ekip içi kötüye kullanıma açıktır. Google tarafında kota/bütçe uyarısı kurun.
- **E-posta gönderimi simülasyondur;** gerçek SMTP gönderimi yapılmıyor.
- Mükerrer kontrolü e-posta üzerinden, büyük/küçük harf duyarsız yapılır; veritabanında
  benzersizlik kısıtı eklenmedi (mevcut tablolar değiştirilmedi).
- `bots_rate_limits` eski kayıtları, `submit-lead` çağrılarının ~%2'sinde temizlenir
  (`bots_rate_limits_cleanup()`); istenirse pg_cron ile periyodik çalıştırılabilir.
