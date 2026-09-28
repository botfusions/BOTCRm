-- =============================================================================
-- Satır sayısı karşılaştırması — taşıma (rfwwntmaktyunbbqdtkq → qlcbobvbircjhlglhfhr)
-- sonrasında HER İKİ projenin SQL Editor'ında çalıştırıp sonuçları karşılaştırın.
-- Salt okunur. Bir tablo yoksa hata vermez; o tablo listede görünmez.
-- =============================================================================
select
  t.table_name,
  (xpath('/row/c/text()',
         query_to_xml(format('select count(*) as c from public.%I', t.table_name),
                      false, true, '')))[1]::text::bigint as row_count
from information_schema.tables t
where t.table_schema = 'public'
  and t.table_type = 'BASE TABLE'
  and t.table_name in ('bots_leads','bots_tasks','bots_settings','bots_contacts',
                       'bots_companies','bots_team_members','bots_rate_limits')
order by t.table_name;

-- Tablolar kesin varsa daha basit alternatif:
-- select 'bots_leads' as t, count(*) from public.bots_leads
-- union all select 'bots_tasks', count(*) from public.bots_tasks
-- union all select 'bots_settings', count(*) from public.bots_settings
-- union all select 'bots_contacts', count(*) from public.bots_contacts
-- union all select 'bots_companies', count(*) from public.bots_companies;
