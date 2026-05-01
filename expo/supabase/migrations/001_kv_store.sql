-- ============================================================================
-- IRIS — Initial Supabase migration
-- Drop-in replacement for the file-based persistence layer.
-- Each "filename" in the existing code maps to a row keyed by `key`.
-- value is JSONB, mirroring the JSON files.
-- ============================================================================

-- Generic KV store. Used by analytics, admin sessions, referrals, partners,
-- community, sync — anything that previously read/wrote a JSON file under /data.
create table if not exists public.kv_store (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists idx_kv_store_updated_at
  on public.kv_store(updated_at);

-- Auto-update updated_at on every write.
create or replace function public.kv_store_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_kv_store_updated_at on public.kv_store;
create trigger trg_kv_store_updated_at
  before update on public.kv_store
  for each row execute function public.kv_store_touch_updated_at();

-- ============================================================================
-- Row Level Security
-- The Hono backend connects with the SERVICE_ROLE_KEY (bypasses RLS).
-- We still enable RLS so that no client (with anon key) can read/write directly.
-- ============================================================================

alter table public.kv_store enable row level security;

-- No policies = no access for anon/authenticated roles. Only service_role works.

-- ============================================================================
-- Helpful views for the Supabase SQL editor
-- ============================================================================

-- Decoded user snapshots view — flatten the analytics-snapshots.json blob
-- into queryable rows. Use this in the SQL editor for ad-hoc admin queries.
create or replace view public.v_user_snapshots as
with snapshots as (
  select value as data
  from public.kv_store
  where key = 'analytics-snapshots.json'
)
select
  (entry ->> 1)::jsonb ->> 'userId'                               as user_id,
  (entry ->> 1)::jsonb ->> 'firstSeen'                            as first_seen,
  (entry ->> 1)::jsonb ->> 'lastSeen'                             as last_seen,
  ((entry ->> 1)::jsonb ->> 'onboardingCompleted')::boolean       as onboarding_completed,
  ((entry ->> 1)::jsonb ->> 'totalCheckins')::int                 as total_checkins,
  ((entry ->> 1)::jsonb ->> 'totalScans')::int                    as total_scans,
  ((entry ->> 1)::jsonb ->> 'isPremium')::boolean                 as is_premium,
  (entry ->> 1)::jsonb ->> 'lifeStage'                            as life_stage,
  (entry ->> 1)::jsonb ->> 'platform'                             as platform,
  (entry ->> 1)::jsonb ->> 'language'                             as language,
  ((entry ->> 1)::jsonb ->> 'healthConnected')::boolean           as health_connected,
  ((entry ->> 1)::jsonb ->> 'paywallViews')::int                  as paywall_views,
  jsonb_array_length(coalesce((entry ->> 1)::jsonb -> 'scanMetrics', '[]'::jsonb)) as scan_count,
  jsonb_array_length(coalesce((entry ->> 1)::jsonb -> 'checkInEntries', '[]'::jsonb)) as checkin_count,
  (entry ->> 1)::jsonb -> 'scanMetrics'                           as scan_metrics,
  (entry ->> 1)::jsonb -> 'checkInEntries'                        as checkin_entries
from snapshots, jsonb_array_elements_text(snapshots.data) entry;

-- Decoded analytics events
create or replace view public.v_analytics_events as
with events as (
  select value as data
  from public.kv_store
  where key = 'analytics-events.json'
)
select
  evt ->> 'userId'                  as user_id,
  evt ->> 'event'                   as event_name,
  (evt ->> 'timestamp')::timestamptz as occurred_at,
  evt -> 'properties'               as properties
from events, jsonb_array_elements(events.data) evt;

-- Per-scan flat view for SQL aggregations in the Supabase dashboard
create or replace view public.v_scan_metrics as
select
  user_id,
  (scan ->> 'timestamp')::timestamptz as scanned_at,
  (scan ->> 'energyScore')::numeric    as energy_score,
  (scan ->> 'stressScore')::numeric    as stress_score,
  (scan ->> 'recoveryScore')::numeric  as recovery_score,
  (scan ->> 'hydrationLevel')::numeric as hydration_level,
  (scan ->> 'fatigueLevel')::numeric   as fatigue_level,
  (scan ->> 'inflammation')::numeric   as irritation,
  (scan ->> 'scleraYellowness')::numeric as sclera_yellowness,
  (scan ->> 'underEyeDarkness')::numeric as under_eye_darkness,
  (scan ->> 'eyeOpenness')::numeric    as eye_openness,
  (scan ->> 'tearFilmQuality')::numeric as tear_film_quality
from public.v_user_snapshots,
     jsonb_array_elements(scan_metrics) scan;

-- Per-check-in flat view
create or replace view public.v_checkin_entries as
select
  user_id,
  (entry ->> 'timestamp')::timestamptz  as checked_in_at,
  (entry ->> 'energy')::numeric          as energy,
  (entry ->> 'sleep')::numeric           as sleep,
  (entry ->> 'stressLevel')::numeric     as stress_level,
  (entry ->> 'mood')::numeric            as mood,
  entry ->> 'cyclePhase'                 as cycle_phase,
  entry -> 'symptoms'                    as symptoms
from public.v_user_snapshots,
     jsonb_array_elements(checkin_entries) entry;
