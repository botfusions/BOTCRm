-- =============================================================================
-- BOTCRM — Güvenlik sertleştirme (RLS + ekip üyeliği + hız sınırı tablosu)
-- Bağlayıcı sözleşme: supabase/SECURITY_CONTRACT.md
--
-- Bu dosya İDEMPOTENTTİR: birden fazla kez çalıştırılabilir.
-- Mevcut bots_* tablolarının şemasını DEĞİŞTİRMEZ; yalnızca RLS açar,
-- anon yetkilerini kaldırır ve bu dosyanın adlandırdığı policy'leri (botcrm_*) oluşturur.
-- Bir bots_* tablosu yoksa hata vermeden atlanır.
--
-- !!! ÖNEMLİ — ÖNCE AUDIT !!!
-- Postgres RLS'te PERMISSIVE policy'ler OR ile birleşir. Tablolarda önceden
-- "Enable read access for all users" gibi herkese açık bir policy varsa, bu
-- migration'dan sonra da açık sürer. Bu migration mevcut policy'leri SİLMEZ.
-- Çalıştırmadan önce ve sonra şu sorguyu çalıştırın (ayrıca: supabase/checks/01_policy_audit.sql):
--
--   select tablename, policyname, permissive, roles, cmd, qual, with_check
--   from pg_policies
--   where schemaname = 'public'
--     and tablename in ('bots_leads','bots_tasks','bots_settings','bots_contacts',
--                       'bots_companies','bots_team_members','bots_rate_limits')
--   order by tablename, policyname;
--
-- Adı 'botcrm_' ile BAŞLAMAYAN her satırı inceleyin; gereksizse SECURITY.md'deki
-- talimatla (drop policy ...) kendiniz kaldırın. Bu dosyanın sonunda da aynı
-- kontrol WARNING olarak yazdırılır.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1) Ekip üyeleri tablosu
-- -----------------------------------------------------------------------------
create table if not exists public.bots_team_members (
  email      text primary key,
  created_at timestamptz not null default now(),
  -- E-postalar küçük harfle saklanır; is_team_member() küçük harfle karşılaştırır.
  constraint bots_team_members_email_lower check (email = lower(email))
);

alter table public.bots_team_members enable row level security;
-- İstemci (anon/authenticated) bu tabloyu ne okuyabilir ne yazabilir.
-- Üyelik kontrolü yalnızca security definer fonksiyon üzerinden yapılır.
revoke all on table public.bots_team_members from anon, authenticated;

-- Örnek (ekip e-postalarını SQL Editor'dan, küçük harfle ekleyin):
-- insert into public.bots_team_members(email) values ('ornek@botfusions.com') on conflict do nothing;


-- -----------------------------------------------------------------------------
-- 2) is_team_member(): oturumdaki kullanıcının e-postası ekip listesinde mi?
-- -----------------------------------------------------------------------------
create or replace function public.is_team_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.bots_team_members m
    where m.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- Postgres fonksiyonlara varsayılan olarak PUBLIC'e EXECUTE verir; Supabase ayrıca
-- anon'a da verir. Yalnızca authenticated çalıştırabilsin.
revoke all on function public.is_team_member() from public;
revoke all on function public.is_team_member() from anon;
grant execute on function public.is_team_member() to authenticated;


-- -----------------------------------------------------------------------------
-- 3) CRM tablolarında RLS + policy + grant'lar
--    - anon: tüm yetkiler kaldırılır (REVOKE ALL)
--    - authenticated: yalnızca is_team_member() true ise erişir
--    - service_role: RLS'i zaten atlar (FORCE RLS kullanılmıyor)
--    - bots_settings: ek olarak kullanıcı yalnızca KENDİ satırını görür
--      (user_id kolonu varsa). Bu tabloda API anahtarları/token'lar bulunduğundan
--      ekip üyelerinin birbirinin ayarlarını okuması engellenir.
-- -----------------------------------------------------------------------------
do $$
declare
  t text;
  has_user_id boolean;
begin
  foreach t in array array['bots_leads','bots_tasks','bots_settings','bots_contacts','bots_companies']
  loop
    if to_regclass('public.' || t) is null then
      raise notice 'Tablo bulunamadı, atlanıyor: public.%', t;
      continue;
    end if;

    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on table public.%I from anon', t);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', t);

    -- Yalnızca bu migration'ın adlandırdığı policy yeniden oluşturulur.
    execute format('drop policy if exists %I on public.%I', 'botcrm_team_member_all', t);

    select exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = t and column_name = 'user_id'
    ) into has_user_id;

    if t = 'bots_settings' and has_user_id then
      -- user_id tipi bilinmediği için (uuid/text) metin olarak karşılaştırılır.
      execute format(
        'create policy %I on public.%I as permissive for all to authenticated '
        'using (public.is_team_member() and user_id::text = auth.uid()::text) '
        'with check (public.is_team_member() and user_id::text = auth.uid()::text)',
        'botcrm_team_member_all', t);
    else
      if t = 'bots_settings' then
        raise warning 'bots_settings tablosunda user_id kolonu yok; ekip genelinde erişim policy''si uygulanıyor.';
      end if;
      execute format(
        'create policy %I on public.%I as permissive for all to authenticated '
        'using (public.is_team_member()) '
        'with check (public.is_team_member())',
        'botcrm_team_member_all', t);
    end if;
  end loop;
end
$$;


-- -----------------------------------------------------------------------------
-- 4) Hız sınırı tablosu (yalnızca service role; submit-lead Edge Function kullanır)
-- -----------------------------------------------------------------------------
create table if not exists public.bots_rate_limits (
  key          text        not null,   -- ör. 'submit-lead:<ip sha256>'
  window_start timestamptz not null,   -- sabit pencere başlangıcı
  count        int         not null default 0,
  primary key (key, window_start)
);

alter table public.bots_rate_limits enable row level security;
-- Hiçbir istemci rolü için policy YOK → yalnızca service_role (RLS'i atlar) erişir.
revoke all on table public.bots_rate_limits from anon, authenticated;

-- Atomik sayaç: (key, pencere) satırını 1 artırır ve yeni sayacı döndürür.
-- supabase-js upsert'ü tek başına atomik artış yapamadığı için RPC olarak sunulur.
create or replace function public.bots_rate_limit_hit(p_key text, p_window_seconds int)
returns int
language sql
volatile
security invoker
set search_path = public
as $$
  insert into public.bots_rate_limits as r (key, window_start, count)
  values (
    p_key,
    to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds),
    1
  )
  on conflict (key, window_start) do update set count = r.count + 1
  returning r.count;
$$;

-- Eski pencereleri temizler (1 günden eski). Silinen satır sayısını döndürür.
create or replace function public.bots_rate_limits_cleanup()
returns int
language plpgsql
volatile
security invoker
set search_path = public
as $$
declare
  n int;
begin
  delete from public.bots_rate_limits where window_start < now() - interval '1 day';
  get diagnostics n = row_count;
  return n;
end;
$$;

revoke all on function public.bots_rate_limit_hit(text, int) from public;
revoke all on function public.bots_rate_limit_hit(text, int) from anon, authenticated;
revoke all on function public.bots_rate_limits_cleanup() from public;
revoke all on function public.bots_rate_limits_cleanup() from anon, authenticated;
do $$
begin
  -- service_role Supabase'de her zaman vardır; yerel testlerde olmayabilir.
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant select, insert, update, delete on table public.bots_rate_limits to service_role;
    grant execute on function public.bots_rate_limit_hit(text, int) to service_role;
    grant execute on function public.bots_rate_limits_cleanup() to service_role;
  end if;
end
$$;


-- -----------------------------------------------------------------------------
-- 5) Audit: bu migration'ın oluşturmadığı policy'leri UYARI olarak listele.
--    Hiçbir şey silinmez.
-- -----------------------------------------------------------------------------
do $$
declare
  r record;
  n int := 0;
begin
  for r in
    select tablename, policyname, permissive, roles::text as roles, cmd, qual
    from pg_policies
    where schemaname = 'public'
      and tablename in ('bots_leads','bots_tasks','bots_settings','bots_contacts',
                        'bots_companies','bots_team_members','bots_rate_limits')
      and policyname not like 'botcrm\_%'
    order by tablename, policyname
  loop
    n := n + 1;
    raise warning 'Harici policy: %.% (permissive=%, roles=%, cmd=%, using=%)',
      r.tablename, r.policyname, r.permissive, r.roles, r.cmd, r.qual;
  end loop;
  if n > 0 then
    raise warning '% harici policy bulundu. Açık kalabilir! SECURITY.md adım 2''ye bakın.', n;
  else
    raise notice 'Harici policy yok. Yalnızca botcrm_* policy''leri etkin.';
  end if;
end
$$;
