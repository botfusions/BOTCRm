-- =============================================================================
-- Anon erişim testi (SQL tarafı) — migration ÖNCESİ ve SONRASI çalıştırın.
-- Supabase SQL Editor'da çalıştırın; hiçbir veriyi değiştirmez (yalnızca yetki
-- kataloğunu okur). REST üzerinden gerçek deneme için: anon_exposure_test.sh
--
-- Sonuç: status = 'AÇIK' olan her satır, anon anahtarına sahip herkesin (anon key
-- tarayıcı paketinde herkese açıktır) o tabloya o işlemle erişebileceği anlamına
-- gelir. Beklenen (migration sonrası): tüm satırlar 'KAPALI'.
--
-- Mantık: anon'un tabloda ilgili yetkisi (GRANT) yoksa → KAPALI.
--         Yetki var ve RLS kapalıysa → AÇIK.
--         Yetki var, RLS açık ve anon/public'e uygulanan bir policy varsa → AÇIK (olası).
-- =============================================================================
with t as (
  select c.oid, c.relname, c.relrowsecurity
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relkind in ('r', 'p', 'v')
    and c.relname in ('bots_leads','bots_tasks','bots_settings','bots_contacts',
                      'bots_companies','bots_team_members','bots_rate_limits')
),
ops as (
  select * from (values ('SELECT','SELECT'), ('INSERT','INSERT'),
                        ('UPDATE','UPDATE'), ('DELETE','DELETE')) v(priv, cmd)
)
select
  t.relname  as tablename,
  ops.priv   as operation,
  has_table_privilege('anon', t.oid, ops.priv) as anon_has_grant,
  t.relrowsecurity as rls_enabled,
  exists (
    select 1 from pg_policies p
    where p.schemaname = 'public' and p.tablename = t.relname
      and p.roles && array['public','anon']::name[]
      and (p.cmd = 'ALL' or p.cmd = ops.cmd)
  ) as anon_policy_exists,
  case
    when not has_table_privilege('anon', t.oid, ops.priv) then 'KAPALI'
    when not t.relrowsecurity then 'AÇIK'
    when exists (
      select 1 from pg_policies p
      where p.schemaname = 'public' and p.tablename = t.relname
        and p.roles && array['public','anon']::name[]
        and (p.cmd = 'ALL' or p.cmd = ops.cmd)
    ) then 'AÇIK'
    else 'KAPALI'
  end as status
from t cross join ops
order by status, t.relname, ops.priv;
