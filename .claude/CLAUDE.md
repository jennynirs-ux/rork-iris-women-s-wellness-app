# IRIS Women's Wellness App

## What This Is
A React Native / Expo (SDK 54) women's wellness app that uses eye scanning (iridology-inspired) to track wellness metrics. The unique differentiator is on-device iris analysis — photos never leave the device.

## Tech Stack
- **Frontend:** React Native 0.81 + Expo SDK 54 + Expo Router (file-based routing)
- **Language:** TypeScript (strict mode)
- **State:** React Context (`contexts/AppContext.tsx` is the main brain) + AsyncStorage for persistence
- **Data fetching:** @tanstack/react-query + tRPC client
- **Backend:** tRPC + Hono server with JSON file persistence (`backend/trpc/`)
- **Subscriptions:** RevenueCat (`react-native-purchases`)
- **i18n:** Custom 9-language system in `constants/translations.ts` (en, sv, de, fr, es, it, nl, pl, pt)
- **Icons:** lucide-react-native
- **Charts:** react-native-chart-kit
- **Build:** Rork platform (uses bun, NOT npm)

## Project Structure
```
app/                    # Expo Router pages
  (tabs)/               # Tab navigator
    index.tsx           # Home tab
    scan.tsx            # Eye scan tab
    insights.tsx        # Wellness insights + trend charts
    calendar.tsx        # Cycle calendar (was programs.tsx)
    profile.tsx         # Profile + settings
    _layout.tsx         # Tab bar config
  onboarding.tsx        # 5-step onboarding (includes first scan at step 3)
  scan-result.tsx       # Post-scan results with 6 wellness gauges
  check-in.tsx          # Daily check-in (menopause-aware)
  admin.tsx             # Admin dashboard
  admin-login.tsx       # Admin auth (server-side)
  paywall.tsx           # RevenueCat paywall
  referral.tsx          # Referral system
backend/trpc/
  app-router.ts         # Main tRPC router
  routes/
    analytics/          # Event tracking + persistent storage
    sync/               # User data sync
    referral/           # Referral codes
    community/          # Community tips feed
    partner/            # Partner mode (phase sharing)
    admin/              # Admin auth (server-side sessions)
    persistence.ts      # JSON file persistence layer
contexts/
  AppContext.tsx         # Main app state (phase, scans, check-ins, habits)
  AdminContext.tsx       # Admin auth state
  SyncContext.tsx        # Server sync
  ReferralContext.tsx    # Referral state
lib/
  eyeAnalysis.ts        # On-device iris analysis algorithm
  phasePredictor.ts     # Bayesian + calendar-math phase prediction
  coachingEngine.ts     # 17-rule coaching tip generator
  doctorReport.ts       # PDF export via expo-print
  gamification.ts       # Streaks + milestones
  healthKit.ts          # Apple Health (HRV, temperature, sleep)
  widgetData.ts         # iOS widget data sync
  trpc.ts               # tRPC client setup
  analytics.ts          # Analytics tracking
constants/
  translations.ts       # All i18n strings (9 languages, typed)
  adminData.ts          # Admin role permissions
types/
  index.ts              # Core TypeScript types
  admin.ts              # Admin types
```

## Critical Rules
1. **All translation keys must exist in ALL 9 languages** — add to type definition AND all language blocks
2. **Use `trpcClient` (vanilla client) for imperative calls**, not `trpc` (React hooks proxy)
3. **Phase calculation uses `getPhaseForCycleDay()` calendar math** — NOT the Bayesian predictor
4. **No `window.addEventListener` in React Native** — guard with `typeof` check
5. **app.json plugins array:** Only packages that export actual Expo config plugins (currently just expo-splash-screen)
6. **Bun, not npm:** Rork uses bun for installs. Peer dep mismatches that npm ignores will crash bun
7. **File paths with parentheses** (like `app/(tabs)/`) must be quoted in git/bash commands

## Common Gotchas
- `AppContext.tsx` is ~1200 lines — variables must be declared before useEffect references them
- The coaching engine, gamification, and community features are all hidden when empty (no "0-day streak" etc.)
- HealthKit is imported via dynamic `require()` with try/catch (graceful fallback)
- Admin credentials are server-side only — never in the client bundle
- Data consent toggle gates server sync (GDPR)

## Build & Run
```bash
bun install                           # Install deps (NOT npm)
bunx rork start -p z2umen4jrrc01e58d1ib1 --tunnel   # Start dev
bunx expo lint                        # Lint
./node_modules/.bin/tsc --noEmit      # Type check
```

## Git
- Remote: github.com/jennynirs-ux/rork-iris-women-s-wellness-app
- Branch: main
- Always commit with: `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`

## Current Status
See BACKLOG.md — 15/16 items shipped. Only B-008 (Guided programs) remains.
See LAUNCH-CHECKLIST.md for launch readiness tasks.
