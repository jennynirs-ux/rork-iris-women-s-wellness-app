# IRIS — Supabase Backend Setup

This folder contains the SQL migrations and setup notes for using
**Supabase Postgres** as the persistence layer for the Hono + tRPC backend.

## Architecture decision

We use **Supabase as the database only**. The existing Hono + tRPC backend
keeps its current shape — typed end-to-end tRPC routes, custom admin auth,
no rewrite of route handlers. Only the persistence layer (`backend/trpc/routes/persistence.ts`)
swaps from JSON files to Supabase queries.

Hono backend can be hosted anywhere (Vercel free tier recommended for
ease of pairing with Supabase).

## Step 1 — Run the migration

1. Go to your Supabase project dashboard
2. Open **SQL Editor** in the left sidebar
3. Click **+ New query**
4. Paste the contents of `migrations/001_kv_store.sql`
5. Click **Run**

This creates:

- `public.kv_store` — generic key-value table (one row per "JSON file")
- `public.v_user_snapshots` — decoded view of user snapshots
- `public.v_analytics_events` — decoded view of analytics events
- `public.v_scan_metrics` — flat per-scan rows (great for SQL aggregations)
- `public.v_checkin_entries` — flat per-check-in rows
- Auto `updated_at` trigger
- RLS enabled (only `service_role` key can read/write)

## Step 2 — Get your credentials

In Supabase dashboard → **Settings → API**:

| Field | Where to get it | Used for |
|---|---|---|
| `Project URL` | "Project URL" field | `SUPABASE_URL` env var |
| `service_role` key | Under "Project API keys" | `SUPABASE_SERVICE_ROLE_KEY` env var |

⚠️ **Never put the service_role key in the mobile app bundle.** It bypasses RLS.
Only use it from the Hono backend (Vercel/Fly/Railway), which the user never sees.

The `anon` key stays in the mobile app for the time being (currently unused
since we're going through tRPC, not direct Supabase).

## Step 3 — Set env vars on the backend host

For Vercel:
```bash
vercel env add SUPABASE_URL production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add ADMIN_HASH_SUPER production    # SHA-256 of admin password
```

For Fly.io:
```bash
flyctl secrets set SUPABASE_URL=https://xxx.supabase.co
flyctl secrets set SUPABASE_SERVICE_ROLE_KEY=eyJ...
flyctl secrets set ADMIN_HASH_SUPER=...
```

## Step 4 — Verify in Supabase

After the backend is deployed and the app sends a few events, you should see
data in the Supabase dashboard:

```sql
-- See all logged events
select * from public.v_analytics_events
order by occurred_at desc
limit 100;

-- Daily active users (last 30 days)
select
  date_trunc('day', occurred_at) as day,
  count(distinct user_id) as users
from public.v_analytics_events
where occurred_at > now() - interval '30 days'
group by 1
order by 1 desc;

-- Average energy score per phase, last 7 days
select
  c.cycle_phase,
  round(avg(s.energy_score)::numeric, 2) as avg_energy,
  count(*) as scans
from public.v_scan_metrics s
join public.v_checkin_entries c
  on s.user_id = c.user_id
  and date_trunc('day', s.scanned_at) = date_trunc('day', c.checked_in_at)
where s.scanned_at > now() - interval '7 days'
group by 1
order by avg_energy desc;
```

## Phase 2 — Future normalization (optional)

The current schema stores all snapshots as a single JSONB blob in `kv_store`.
This works for any app size up to ~10k users. When you scale further:

1. Promote `analytics_events` to its own append-only table
2. Promote `user_snapshots` to a row-per-user table with proper indexes
3. Move `scanMetrics[]` into a separate `scan_metrics` table
4. Drop the views, query the tables directly

This is a non-blocking improvement — do it when the JSONB-blob approach
starts hitting performance limits in the dashboard SQL editor.

## What the backend code change looks like

The `expo/backend/trpc/routes/persistence.ts` file's `load`/`save` functions
will be rewritten to call Supabase instead of `fs`. All callers
(`analytics/store.ts`, `referral/store.ts`, etc.) will need their
module-load synchronous reads converted to async.

That refactor is the next step — see `IMPLEMENTATION_PLAN.md` (to be added).
