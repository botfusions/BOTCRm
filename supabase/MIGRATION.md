# Adım 0 — Tek Supabase projesine taşıma (`rfwwntmaktyunbbqdtkq` → `qlcbobvbircjhlglhfhr`)

Hedef: CRM tabloları (`bots_*`), Auth ve Storage tek projede toplanır:
**`https://qlcbobvbircjhlglhfhr.supabase.co`** (logo storage'ı zaten burada).

> Bu adımlar sizin bilgisayarınızda çalıştırılır. Veritabanı şifresini/bağlantı
> dizesini **sohbete, repoya, commit mesajına veya ekran görüntüsüne yazmayın.**

Terimler:
- **ESKİ** = `rfwwntmaktyunbbqdtkq` · **YENİ** = `qlcbobvbircjhlglhfhr`
- Bağlantı dizesi: Dashboard → *Project Settings* → *Database* → *Connection string*
  (ya da üst menüdeki **Connect** düğmesi). IPv6 yoksa **Session pooler** (port 5432)
  dizesini kullanın. `[YOUR-PASSWORD]` yerine veritabanı şifrenizi koyun.

Bağlantı dizelerini geçmişe yazılmadan terminale almak için:

```bash
read -rs OLD_DB_URL && export OLD_DB_URL   # ESKİ dizeyi yapıştırın, Enter
read -rs NEW_DB_URL && export NEW_DB_URL   # YENİ dizeyi yapıştırın, Enter
```

---

## 0.1 Eski projeden yedek (şema + veri)

Önce ESKİ projede `auth.users`'a bağlı yabancı anahtar var mı bakın (SQL Editor):

```sql
select conrelid::regclass as tablo, conname, pg_get_constraintdef(oid) as tanim
from pg_constraint
where contype = 'f' and confrelid = 'auth.users'::regclass
  and conrelid::regclass::text like '%bots\_%';
```

Kullanıcı UUID'leri yeni projede **farklı** olacağı için bu tür tablolardaki veri
(özellikle `bots_settings.user_id`) yeni projeye birebir yüklenemez/eşleşmez. Öneri:
**`bots_settings` verisini taşımayın** — zaten gizli anahtarlar içeriyor ve
SECURITY.md Adım 7'de hepsi yenilenecek; girişten sonra Ayarlar ekranından yeniden girin.

**Seçenek A — pg_dump (önerilen: yalnızca `bots_*` tablolarını alır)**

`pg_dump` sürümü sunucu sürümüne eşit veya yüksek olmalıdır (`pg_dump --version`).

```bash
pg_dump "$OLD_DB_URL" --schema-only --no-owner --no-privileges \
  -t 'public.bots_*' -f schema.sql

pg_dump "$OLD_DB_URL" --data-only --no-owner --no-privileges \
  -t 'public.bots_*' --exclude-table-data='public.bots_settings' -f data.sql
```

**Seçenek B — Supabase CLI**

```bash
supabase db dump --db-url "$OLD_DB_URL" --schema public -f schema.sql
supabase db dump --db-url "$OLD_DB_URL" --schema public --data-only -f data.sql
```

CLI tablo filtresi desteklemez; ESKİ projenin `public` şemasında `bots_*` dışında
tablolar varsa onlar da gelir ve YENİ projedeki tablolarla çakışabilir. Bu durumda
Seçenek A'yı kullanın ya da `schema.sql`/`data.sql` içinden gereksiz kısımları silin.

`schema.sql`'i açıp göz atın: ESKİ projedeki **policy'ler** (`CREATE POLICY ...`) de
gelir. Herkese açık olanlar ("Enable read access for all users" vb.) YENİ projeye de
taşınır — SECURITY.md Adım 3'teki audit bunları yakalar.

Yedek dosyalarını repoya **eklemeyin** (müşteri verisi içerir); işiniz bitince silin.

## 0.2 Yeni projeye yükleme (sıra önemli)

```bash
psql "$NEW_DB_URL" -v ON_ERROR_STOP=1 -f schema.sql
psql "$NEW_DB_URL" -v ON_ERROR_STOP=1 -f data.sql
```

Ardından güvenlik migration'ını YENİ projede çalıştırın (SECURITY.md Adım 3–4):
`supabase/migrations/20260928000001_security_hardening.sql`.

## 0.3 Auth kullanıcıları

Şifreler projeler arasında taşınamaz. Ekip küçükse:

1. YENİ proje → *Authentication* → *Users* → **Invite user** ile her ekip üyesini davet edin.
2. E-postaları ekip listesine ekleyin (SQL Editor, küçük harfle):
   ```sql
   insert into public.bots_team_members(email) values
     ('ad.soyad@botfusions.com')
   on conflict do nothing;
   ```
3. Davetlerden sonra yeni kayıtları kapatın (SECURITY.md Adım 6).

## 0.4 Storage

Logo (`image` bucket) zaten YENİ projede. ESKİ projede başka bucket varsa
(*Storage* menüsünden kontrol edin) dosyaları indirip YENİ projeye yükleyin ve
bucket'ın public/private ayarını ve storage policy'lerini aynı şekilde kurun.

## 0.5 Ortam değişkenleri

- **Frontend** (`.env` ve hosting panelindeki ortam değişkenleri, ör. Netlify/Vercel):
  - `VITE_SUPABASE_URL=https://qlcbobvbircjhlglhfhr.supabase.co`
  - `VITE_SUPABASE_ANON_KEY=<YENİ projenin anon/publishable key'i>`
  - `GEMINI_API_KEY` frontend ortamından **kaldırılmalı** (artık yalnızca Edge Function secret'ı).
- **Sesli asistan** `.env`:
  - `SUPABASE_URL=https://qlcbobvbircjhlglhfhr.supabase.co`
  - `SUPABASE_SERVICE_ROLE_KEY=<YENİ projenin service role key'i>` — yalnızca sunucu tarafında.
- Değişiklikten sonra frontend'i yeniden build/deploy edin (Vite değerleri build sırasında gömer).

## 0.6 Doğrulama — satır sayıları

`supabase/checks/03_row_counts.sql` dosyasını **her iki** projenin SQL Editor'ında
çalıştırıp sonuçları karşılaştırın. `bots_settings` bilerek taşınmadıysa YENİ'de 0 (ya
da yeniden girilen kayıt sayısı) olması normaldir. `bots_team_members` ve
`bots_rate_limits` yalnızca YENİ projede bulunur.

## 0.7 Eski projeyi hemen SİLMEYİN

1–2 hafta boyunca ESKİ projeyi yedek olarak tutun:
- Hemen: ESKİ projede de anon erişimini kapatın (aynı güvenlik migration'ını orada da
  çalıştırmak en kolayı) ya da projeyi duraklatın: *Project Settings* → *General* →
  **Pause project**.
- Her şey YENİ projede sorunsuz çalıştıktan sonra, kendi kararınızla silin.
