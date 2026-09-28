-- =============================================================================
-- GERİ ALMA (rollback) — 20260928000001_security_hardening.sql
--
-- !!! UYARI: Bu dosya güvenlik açığını YENİDEN AÇAR. Anon anahtarına sahip herkes
-- (anon key tarayıcı paketinde herkese açıktır) CRM verisini okuyup yazabilir.
-- Yalnızca acil durumda, kısa süreliğine ve bilerek çalıştırın.
--
-- Çoğu sorun rollback gerektirmez:
--   * "Giriş yaptım ama veri görünmüyor" → e-postanız bots_team_members'ta yok:
--       insert into public.bots_team_members(email) values (lower('siz@alanadi.com'));
--   * Landing formu çalışmıyor → submit-lead deploy edildi mi, ALLOWED_ORIGINS doğru mu?
--
-- Bu dosya supabase/migrations/ dışında tutulur; `supabase db push` uygulamaz.
-- SQL Editor'da elle çalıştırın. İdempotenttir.
-- =============================================================================

-- 1) Bizim policy'lerimizi kaldır, RLS'i kapat, anon yetkilerini geri ver
do $$
declare
  t text;
begin
  foreach t in array array['bots_leads','bots_tasks','bots_settings','bots_contacts','bots_companies']
  loop
    if to_regclass('public.' || t) is null then
      continue;
    end if;
    execute format('drop policy if exists %I on public.%I', 'botcrm_team_member_all', t);
    execute format('alter table public.%I disable row level security', t);
    execute format('grant select, insert, update, delete on table public.%I to anon', t);
  end loop;
end
$$;

-- 2) Yardımcı fonksiyonlar ve tablolar
--    (bots_team_members silinirse ekip listesi kaybolur; tekrar uygulamada yeniden
--     eklemeniz gerekir. Saklamak isterseniz bu iki satırı yorum yapın.)
drop function if exists public.bots_rate_limit_hit(text, int);
drop function if exists public.bots_rate_limits_cleanup();
drop table if exists public.bots_rate_limits;
drop function if exists public.is_team_member();
drop table if exists public.bots_team_members;
