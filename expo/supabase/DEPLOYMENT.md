# IRIS Backend — Deployment Guide

Pairs the Hono + tRPC backend with the Supabase Postgres database.

## Architecture

```
┌──────────────┐      tRPC over HTTPS      ┌──────────────┐
│  Mobile app  │ ───────────────────────► │ Hono backend │
│  (iOS/iPad)  │                          │  (Fly.io)    │
└──────────────┘                          └──────┬───────┘
                                                 │
                                                 │ service_role
                                                 ▼
                                         ┌──────────────┐
                                         │   Supabase   │
                                         │   Postgres   │
                                         └──────────────┘
```

The mobile app never talks to Supabase directly. It always goes through the
Hono backend, which holds the service_role key.

## Prerequisites

- Supabase project created
- Migration `001_kv_store.sql` applied (see `README.md`)
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in hand

## Recommended host: Fly.io

**Why Fly.io:**
- Long-running container (analytics in-memory cache works correctly)
- Sub-200ms cold starts in the same region as Supabase (Frankfurt for EU users)
- ~$0–5/mo for our scale
- Native Hono support (Bun runtime)

### Step 1 — Install fly CLI

```bash
brew install flyctl
flyctl auth login
```

### Step 2 — Create the app

From the `expo/` directory:

```bash
flyctl launch --no-deploy
```

When prompted:
- App name: `iris-backend` (or any unique name)
- Region: `arn` (Stockholm) or `fra` (Frankfurt) — whichever matches your Supabase region
- Postgres: **No** (we use Supabase)
- Redis: No
- Don't deploy yet

This generates a `fly.toml` file. Edit it:

```toml
app = "iris-backend"
primary_region = "arn"

[build]
  builder = "paketobuildpacks/builder:base"

[env]
  PORT = "8081"

[http_service]
  internal_port = 8081
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
```

### Step 3 — Set secrets

```bash
flyctl secrets set \
  SUPABASE_URL=https://your-project-ref.supabase.co \
  SUPABASE_SERVICE_ROLE_KEY=eyJ... \
  ADMIN_HASH_SUPER=$(echo -n "your-admin-password" | shasum -a 256 | awk '{print $1}')
```

(Repeat for `ADMIN_HASH_ANALYST` / `ADMIN_HASH_VIEWER` if you want those roles.)

### Step 4 — Add a start script

Add this to `expo/package.json`:

```json
"scripts": {
  "start:backend": "bun run backend/hono.ts"
}
```

And a `Procfile` (Fly's start command):

```
web: bun run start:backend
```

### Step 5 — Deploy

```bash
flyctl deploy
```

Watch the build. When done you'll get a URL like `https://iris-backend.fly.dev`.

### Step 6 — Wire the mobile app

Set `EXPO_PUBLIC_RORK_API_BASE_URL` (or whatever the trpc client uses) in
`.env` for local dev, and for production builds via `eas.json`:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_RORK_API_BASE_URL": "https://iris-backend.fly.dev"
      }
    }
  }
}
```

Rebuild the app: `bunx eas build --platform ios --profile production`.

### Step 7 — Verify

In another terminal, hit a tRPC endpoint:

```bash
curl https://iris-backend.fly.dev/api/trpc/example.hi?input=%7B%7D
```

You should get a JSON response. If you see HTML, the route isn't mounted —
check `backend/hono.ts`.

Then in the Supabase SQL editor:

```sql
select count(*) from public.kv_store;
```

After the app sends a few events you should see rows accumulating.

## Alternative host: Vercel

Vercel works but each request is a fresh serverless invocation, so the
in-memory cache pattern in `analytics/store.ts` doesn't help (cold start
on each request). Use only if you can't run Fly.io.

```bash
npm install -g vercel
vercel link
vercel env add SUPABASE_URL production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add ADMIN_HASH_SUPER production
vercel deploy --prod
```

You'll need a `vercel.json` and `api/trpc/[trpc].ts` adapter — not included
yet. If you go this route, ping Claude to scaffold it.

## Verifying Supabase connectivity

Once deployed, the backend logs will tell you:

```
[Analytics] Hydrated: 0 events, 0 snapshots
```

If you see:

```
[Supabase] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set...
```

Re-check your secrets:

```bash
flyctl secrets list
```

## Rollback

`kv_store` table is the only durable state. Backups happen automatically on
the Supabase paid tier. To roll the backend code back:

```bash
flyctl releases
flyctl releases revert <version>
```

## Cost expectations (at 10k MAU)

| Item | Monthly |
|---|---|
| Fly.io shared-cpu-1x (1 machine, 256MB) | $0 (free tier) |
| Supabase Free | $0 (covers 500MB DB, ~50k MAU equivalent for our usage) |
| **Total** | **$0** |

Above 50k users, expect to upgrade to Supabase Pro ($25/mo) and possibly add
a second Fly machine ($5/mo).
