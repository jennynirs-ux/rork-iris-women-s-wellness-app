# IRIS Backlog

> Last updated: 2026-03-17
> Source: Competitive analysis vs Flo, Clue, Natural Cycles, Stardust, Ovia, Apple Health

---

## P0 — Must-have before growth push

### ✅ B-000: Server-side data collection & admin analytics pipeline
**Status:** DONE (commit `f2cf3f6`)
**What shipped:** JSON file persistence layer replacing in-memory Maps, auto-sync of scan + check-in data to server, GDPR data consent toggle in Profile and onboarding.

### ✅ B-001: Add trend charts to Insights tab
**Status:** DONE (commit `3969f23`)
**What shipped:** Line charts for physical metrics, hydration/inflammation, and fatigue with 7/30/90-day toggles using react-native-chart-kit.

### ✅ B-002: First scan during onboarding
**Status:** DONE (commit `3969f23`)
**What shipped:** Eye scan added as step 3 of 5 in onboarding with preparation modal and simplified results display.

### ✅ B-003: Scan result screen with actual data
**Status:** DONE (commit `3969f23`)
**What shipped:** Full results screen with 6 circular SVG wellness gauges, contextual interpretations, and "View full insights" button replacing the 1.5s auto-redirect.

---

## P1 — High value, build next

### ✅ B-004: AI coaching layer (phase-aware tips)
**Status:** DONE (commit `7cf1a77`)
**What shipped:** Rule-based coaching engine with 17 rules across 8 categories (stress, energy, recovery, hydration, inflammation, sleep, phase, trends). Generates 2-4 personalized daily tips displayed as dismissible cards on Home tab.

### ✅ B-005: Privacy-first positioning
**Status:** DONE (commit `7cf1a77`)
**What shipped:** "On-device only · Photos never stored" badge on scan screen. "Your Privacy" card in Profile with 4 privacy guarantees.

### ✅ B-006: Doctor export PDF
**Status:** DONE (commit `7cf1a77`)
**What shipped:** Professional medical report PDF via expo-print with cycle summary, 30-day wellness averages, symptom frequency, and auto-detected patterns. "Share with Doctor" button in Profile.

---

## P2 — Competitive parity

### ✅ B-007: Apple Watch / wearable integration
**Status:** DONE (commit `d3bbce7`)
**What shipped:** HealthKit re-enabled with HRV and wrist temperature data. HRV/temperature fed into Bayesian phase predictor as evidence sources. Toggle controls in Profile.

### B-008: Guided programs and challenges
**Why:** Competitors offer structured multi-day programs ("7-day stress reset", "luteal nutrition plan"). These drive daily engagement.
**Scope:** Create a program data model with daily tasks/recommendations. Build 4–6 starter programs tied to cycle phases. Add program enrollment, daily task completion, and progress tracking.
**Files:** `app/(tabs)/calendar.tsx`, new `lib/programs.ts`, new `constants/programs.ts`
**Effort:** 2–3 weeks
**Impact:** Medium — engagement driver, premium content

### ✅ B-009: iOS home screen widget
**Status:** DONE (commit `d3bbce7`)
**What shipped:** Widget data layer syncing phase/cycle info to App Group UserDefaults. Swift WidgetKit implementation files. Requires EAS native build to activate.

---

## P3 — Growth features

### ✅ B-010: Community feed (anonymous phase-based tips)
**Status:** DONE (commit `5b138e9`)
**What shipped:** Backend routes for community tips with rate limiting (3/user/day) and auto-hide moderation (3 reports). Feed section on Home tab with phase-tagged tips, likes, and reporting.

### ✅ B-011: Partner mode
**Status:** DONE (commit `5b138e9`)
**What shipped:** Backend routes for partner linking with IRIS-XXXXXX invite codes. Bidirectional phase/mood sharing. Partner section in Profile with link/unlink controls.

### ✅ B-012: Menopause deep-dive
**Status:** DONE (commit `5b138e9`)
**What shipped:** Hot flash counter/severity, night sweat severity, and HRT toggle in check-in for perimenopause/menopause users. VMS scoring card in Insights. Full i18n across all 9 languages.

### ✅ B-013: Gamification / streaks
**Status:** DONE (commit `5b138e9`)
**What shipped:** Streak tracking for scans and check-ins. 10 milestone badges. Monthly wellness comparison. Streak card on Home tab. Achievements grid and monthly progress on Profile.

---

## Tech debt

### ✅ T-001: Move admin credentials server-side
**Status:** DONE (commit `5b138e9`)
**What shipped:** Server-side admin auth with login/verify tRPC routes and 24h session tokens. Removed password hashes from client bundle.

### ✅ T-002: Re-enable HealthKit integration
**Status:** DONE (covered by B-007)

### ✅ T-003: Rename Programs tab
**Status:** DONE (commit `d3bbce7`)
**What shipped:** Renamed from "Programs" to "Calendar" in route and tab bar.

---

## Remaining

Only **B-008** (Guided programs and challenges) remains unbuilt.
