# IRIS Backlog

> Last updated: 2026-03-17
> Source: Competitive analysis vs Flo, Clue, Natural Cycles, Stardust, Ovia, Apple Health

---

## P0 — Must-have before growth push

### B-000: Server-side data collection & admin analytics pipeline
**Why:** Right now, scan results and check-in data **stay on-device only**. The backend uses in-memory storage — all data is lost on server restart. The admin dashboard shows aggregated stats but has no persistent database behind it. We cannot improve the eye analysis algorithm, validate results, spot trends, or debug user issues because we literally have no access to user data. This blocks everything.
**Current state:**
- Analytics events → sent to server → stored in-memory Map → **lost on restart**
- Scan results → AsyncStorage only → **never reaches server**
- Check-in data → AsyncStorage only → **never reaches server**
- Manual sync exists → stores to in-memory Map → **lost on restart**
- Admin CSV export works but exports from volatile memory
**Scope:**
1. **Add persistent database** — Replace in-memory Maps in `backend/trpc/routes/analytics/store.ts` and `backend/trpc/routes/sync/store.ts` with a real database (Supabase/PostgreSQL, or SQLite at minimum). This is the foundation for everything else.
2. **Auto-sync scan + check-in data** — After each scan and check-in, automatically send anonymized results to the server (with user consent toggle in Profile). Currently requires user to manually call sync. Add background sync to `AppContext.tsx` after `addScanMutation` and `addCheckInMutation` succeed.
3. **Expand admin data views** — Admin dashboard already has Overview/Funnel/Users/Wellness/Revenue/Referral/Events tabs. Extend to show:
   - Individual user scan history (not just aggregates)
   - Raw eye analysis metrics per scan (pupil, sclera, tear film)
   - Check-in symptom frequency over time
   - Scan accuracy/consistency metrics across users
   - Exportable datasets (CSV/JSON) of all scans and check-ins for offline analysis
4. **User consent & GDPR** — Add a data sharing consent toggle in Profile/onboarding. Respect opt-out. Allow data deletion requests to propagate to server.
5. **Data retention policy** — Define how long raw data is kept vs. aggregated.
**Files:** `backend/trpc/routes/analytics/store.ts`, `backend/trpc/routes/sync/store.ts`, `contexts/AppContext.tsx`, `app/admin.tsx`, `app/(tabs)/profile.tsx`, `app/onboarding.tsx`
**Effort:** 2–3 weeks
**Impact:** Critical — blocks algorithm improvement, debugging, and validation of every feature

### B-001: Add trend charts to Insights tab
**Why:** Insights shows 20+ metrics as plain numbers and progress bars. Users can't see how their stress, energy, or recovery changes over time. Every competitor has charts. This is the single biggest UX gap.
**Scope:** Install `victory-native` or `react-native-chart-kit`. Add line charts for each metric category (physical, emotional, physiological) with 7/30/90-day toggles. Data already exists in AsyncStorage scan history — just needs visualization.
**Files:** `app/(tabs)/insights.tsx`, `package.json`
**Effort:** 1–2 weeks
**Impact:** High — makes scan data tangible, drives premium conversion

### B-002: First scan during onboarding
**Why:** Current onboarding is 4 screens of form-filling. Users never see what makes IRIS special until they finish. Competitors like Flo show a personalized insight within 60 seconds. Moving the first eye scan into onboarding (as step 3 of 5) gives users an immediate "wow" moment.
**Scope:** Add a scan step to `onboarding.tsx` after basic info collection. Show a simplified result ("Your stress level: moderate, energy: good"). Then complete onboarding. Camera permissions already requested in `app.json`.
**Files:** `app/onboarding.tsx`, `app/(tabs)/scan.tsx` (extract reusable scan logic)
**Effort:** 1 week
**Impact:** High — improves activation rate, reduces day-1 churn

### B-003: Scan result screen with actual data
**Why:** After scanning, users see "Scan Complete" for 1.5 seconds then auto-redirect to Insights. They never get a moment to absorb their results. This wastes the most engaging moment in the app.
**Scope:** Replace the auto-redirect in `scan-result.tsx` with a proper results screen showing the 6 wellness scores (energy, stress, recovery, hydration, fatigue, inflammation) with visual gauges, a brief interpretation sentence each, and a "View full insights" button.
**Files:** `app/scan-result.tsx`
**Effort:** 3–5 days
**Impact:** High — increases perceived value of each scan

---

## P1 — High value, build next

### B-004: AI coaching layer (phase-aware tips)
**Why:** Flo's #1 premium feature is an AI health chatbot. IRIS already computes cross-symptom correlations and phase-aware patterns — it just doesn't communicate them conversationally. Turning "inflammation: 7.2/10" into "Your inflammation has been elevated for 3 days during your luteal phase — try reducing sugar and adding anti-inflammatory foods" would be transformative.
**Scope:** Create a recommendation engine that generates 2–3 daily coaching messages based on scan trends, check-in patterns, and cycle phase. No LLM needed — use rule-based templates with the data IRIS already collects. Display as cards on Home tab.
**Files:** New `lib/coachingEngine.ts`, `app/(tabs)/index.tsx`
**Effort:** 2–3 weeks
**Impact:** High — Flo's top feature, drives premium conversion

### B-005: Privacy-first positioning
**Why:** IRIS processes everything on-device. Photos are never stored or sent. 71% of period apps share data with third parties. This is a massive competitive advantage being completely ignored in the UI and App Store listing.
**Scope:** Add an on-device processing badge to the scan screen. Add a "Your Privacy" section in Profile. Update App Store description and screenshots to lead with privacy. Add privacy certifications/badges to onboarding.
**Files:** `app/(tabs)/scan.tsx`, `app/(tabs)/profile.tsx`, App Store metadata
**Effort:** 2–3 days (code) + marketing effort
**Impact:** Medium-high — differentiation, builds trust

### B-006: Doctor export PDF
**Why:** Perimenopause/menopause users (the fastest-growing segment) need to communicate patterns to their gynecologist. A one-tap "Share with my doctor" PDF summarizing cycle history, symptom trends, and scan metrics would be genuinely useful. The profile tab has a generic export button but no structured report.
**Scope:** Generate a formatted PDF with: cycle summary, symptom frequency chart, wellness score trends, and notable patterns. Use the existing data in AsyncStorage. Add a "Share with Doctor" button to Profile.
**Files:** `app/(tabs)/profile.tsx`, new `lib/doctorReport.ts`
**Effort:** 1 week
**Impact:** Medium — practical utility, trust-building

---

## P2 — Competitive parity

### B-007: Apple Watch / wearable integration
**Why:** Clue integrates 8 wearable brands. Natural Cycles uses thermometer data. IRIS has HealthKit code but it's disabled (`// TODO: Re-enable Apple Health integration post-launch`). At minimum, pulling sleep stages, HRV, and wrist temperature from Apple Watch would improve phase prediction accuracy and wellness scoring.
**Scope:** Re-enable HealthKit integration. Add HRV, temperature, and sleep stage data pulls. Feed into phasePredictor and wellness score calculations.
**Files:** `lib/healthKit.ts` (if exists), `contexts/AppContext.tsx`, `app/(tabs)/profile.tsx`
**Effort:** 2–3 weeks
**Impact:** Medium — matches competitors, improves accuracy

### B-008: Guided programs and challenges
**Why:** The Programs tab is just a calendar timeline — no actual programs. Competitors offer structured multi-day programs ("7-day stress reset", "luteal nutrition plan"). These drive daily engagement.
**Scope:** Create a program data model with daily tasks/recommendations. Build 4–6 starter programs tied to cycle phases. Add program enrollment, daily task completion, and progress tracking to Programs tab.
**Files:** `app/(tabs)/programs.tsx`, new `lib/programs.ts`, new `constants/programs.ts`
**Effort:** 2–3 weeks
**Impact:** Medium — engagement driver, premium content

### B-009: iOS home screen widget
**Why:** Apple Health shows cycle info on the lock screen. An IRIS widget showing current phase, today's focus, and days until next phase would drive passive engagement without opening the app.
**Scope:** Build an iOS widget extension using `expo-widgets` or a custom native module. Display: phase name + color, cycle day, today's recommended focus.
**Files:** New native widget extension, `app.json` plugin config
**Effort:** 2 weeks
**Impact:** Medium — daily visibility, engagement

---

## P3 — Growth features

### B-010: Community feed (anonymous phase-based tips)
**Why:** Flo retains users with forums. Stardust's model is social syncing. IRIS has zero community features. Even anonymous "tips from women in your phase" would increase retention.
**Scope:** Requires backend work. Anonymous, phase-tagged tips/experiences. Moderation system. Read-only feed on Home tab, optional posting.
**Files:** Backend API, new `app/community.tsx`, `app/(tabs)/index.tsx`
**Effort:** 3–4 weeks
**Impact:** Medium — retention, but requires moderation infrastructure

### B-011: Partner mode
**Why:** Stardust lets friends/partners follow your cycle. Lightweight sharing drives word-of-mouth growth.
**Scope:** Share current phase + mood with a linked partner account. No raw data. Push notification when phase changes. Invite via link.
**Files:** Backend API, new `app/partner.tsx`, `lib/notifications.ts`
**Effort:** 2–3 weeks
**Impact:** Medium — viral growth driver

### B-012: Menopause deep-dive
**Why:** 1 billion women entering perimenopause/menopause by 2030. IRIS supports these life stages but doesn't go deep.
**Scope:** Hot flash frequency/severity tracker, night sweat pattern analysis, HRT medication tracking, menopause-specific insights and recommendations, VMS (vasomotor symptom) scoring.
**Files:** `app/check-in.tsx`, `constants/translations.ts`, `app/(tabs)/insights.tsx`
**Effort:** 2–3 weeks
**Impact:** Medium — fast-growing underserved market

### B-013: Gamification / streaks
**Why:** Light gamification maintains daily engagement. "30-day scan streak" or "wellness score improved 15% this month" gives users a reason to keep scanning.
**Scope:** Track scan/check-in streaks. Milestone badges. Monthly wellness score comparison. Display on Home tab or Profile.
**Files:** `contexts/AppContext.tsx`, `app/(tabs)/index.tsx`, `app/(tabs)/profile.tsx`
**Effort:** 1 week
**Impact:** Low-medium — engagement retention

---

## Tech debt

### T-001: Move admin credentials server-side
**Current:** Admin password is hardcoded in `app/admin.tsx` client bundle.
**Fix:** Implement server-side authentication via tRPC backend.
**Effort:** 1 week

### T-002: Re-enable HealthKit integration
**Current:** Commented out with `// TODO: Re-enable Apple Health integration post-launch`
**Fix:** Uncomment, test, and ship. Blocked on B-007 scope decision.

### T-003: Rename Programs tab
**Current:** Tab is called "Programs" but it's a calendar/timeline. Confusing.
**Fix:** Rename to "Calendar" (matches user mental model and what tester called it).
**Effort:** 30 minutes
