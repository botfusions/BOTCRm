-- =============================================================================
-- Policy audit (salt okunur) — migration ÖNCESİ ve SONRASI çalıştırın.
-- Supabase Dashboard → SQL Editor'a yapıştırıp çalıştırın. Hiçbir şeyi değiştirmez.
--
-- Yorumlama:
--   * policyname 'botcrm_' ile başlamıyorsa bu policy bu projenin güvenlik
--     migration'ı tarafından oluşturulmamıştır. RLS'te permissive policy'ler OR ile
--     birleştiği için, ör. roles = {public} veya {anon} ve qual = 'true' olan bir
--     policy TÜM korumayı devre dışı bırakır.
--   * "suspicious" sütunu true olan satırlara öncelik verin.
--   * Kaldırma talimatı: SECURITY.md → Adım 2.
-- =============================================================================

-- 1) Tablolardaki tüm policy'ler
select
  p.tablename,
  p.policyname,
  p.permissive,
  p.roles,
  p.cmd,
  p.qual,
  p.with_check,
  (p.policyname not like 'botcrm\_%')                                    as not_ours,
  (p.policyname not like 'botcrm\_%'
    and (p.roles && array['public','anon']::name[]
         or coalesce(p.qual, '') in ('true', '(true)')
         or coalesce(p.with_check, '') in ('true', '(true)')))           as suspicious
from pg_policies p
where p.schemaname = 'public'
  and p.tablename in ('bots_leads','bots_tasks','bots_settings','bots_contacts',
                      'bots_companies','bots_team_members','bots_rate_limits')
order by suspicious desc, p.tablename, p.policyname;

-- 2) RLS durumu ve anon/authenticated tablo yetkileri
-- select
--   c.relname                                   as tablename,
--   c.relrowsecurity                            as rls_enabled,
--   c.relforcerowsecurity                       as rls_forced,
--   has_table_privilege('anon', c.oid, 'SELECT') as anon_select,
--   has_table_privilege('anon', c.oid, 'INSERT') as anon_insert,
--   has_table_privilege('authenticated', c.oid, 'SELECT') as auth_select
-- from pg_class c
-- join pg_namespace n on n.oid = c.relnamespace
-- where n.nspname = 'public' and c.relname like 'bots\_%'
-- order by c.relname;
