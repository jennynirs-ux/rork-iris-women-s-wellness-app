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

---

## Scan engine v1.1 — Real measurements (in progress)

> Goal: replace the synthesized "advanced optical signals" (pupilContractionSpeed, microSaccadeFrequency, etc.) with values genuinely measured from pixel data, so we can keep field names with integrity.

### ✅ B-014: Burst capture pipeline
**Status:** SHIPPED to scan.tsx (this commit)
**What shipped:**
- New `lib/burstCapture.ts`: captures 8 photos at 250 ms intervals (~2 s burst), runs per-frame analysis on each, aggregates via median for noise resilience.
- New `lib/advancedAnalysis.ts`: 3 single-frame measured signals (pupilToIrisRatio, limbalRingClarity, vesselDensity) with both native (base64-bytes) and web (canvas) implementations.
- `scan.tsx` rewired: replaces the single `takePictureAsync` + `validateEyeImage` + `analyzeEyeImage` chain with `captureAndAnalyzeBurst`. Falls back to `invalid_image` UX if zero frames pass validation.
- `ScanResult.measuredOpticalSignals` (optional, additive) now populated on every burst-mode scan: `pupilToIrisRatio`, `limbalRingClarity`, `vesselDensity`, `realBlinkRate`, `tearFilmStability`, `frameStability`, `burstFramesAnalyzed`, `burstDurationMs`.
- `rawOpticalSignals.blinkFrequency` and `tearFilmReflectivity` now blend the real cross-frame measurements with the legacy synthesized estimate when burst data is present (preserves the phase predictor's baseline-tracking math).

**Files:** `expo/lib/burstCapture.ts`, `expo/lib/advancedAnalysis.ts`, `expo/types/index.ts`, `expo/app/(tabs)/scan.tsx`

**Acceptance criteria for QA on real device:**
- [ ] Scan UX: capture phase visibly takes ~2 s (was ~0.3 s). Loading animation runs through it.
- [ ] No regression in score values for a steady scan — basic 6 wellness scores within ±1 point of v1.0 baseline.
- [ ] `ScanResult.measuredOpticalSignals.burstFramesAnalyzed` is 6–8 on a steady scan, 3–5 on a wobbly scan, 0 on a face-not-visible scan.
- [ ] `realBlinkRate` is 0 if user holds eyes open the whole burst, > 0.3 if user blinks during it.
- [ ] `tearFilmStability` is > 0.6 on a calm scan, < 0.4 on a tearing scan.
- [ ] Memory: 8 frames at q=0.6 ≈ 600 KB resident — verify no OOM on iPhone SE.
- [ ] Persisted scans from before v1.1 still load correctly (`measuredOpticalSignals` is optional).

**Calibration TODO (after first device QA):**
- Tune `BLINK_OPENNESS_THRESHOLD` (currently 0.35) based on real blink readings.
- Tune `VESSEL_NORMALIZER` (currently 0.15) — likely needs adjustment per skin tone and lighting.
- Tune `LIMBAL_GRADIENT_NORMALIZER` (currently 80) — may differ between bright and dim scenes.

### ⏭️ B-015: Refactor phase predictor off synthesized signals
**Status:** PLANNED (v1.2)
**Why:** `phasePredictor.ts:823-846` currently uses `pupilContractionSpeed`, `pupilLatency`, `blinkFrequency`, `microSaccadeFrequency` for `PersonalBaseline` tracking. Since these are deterministic functions of the wellness scores, the predictor is effectively double-counting the same signals. Should read scores directly OR switch to the new measured signals (`pupilToIrisRatio`, `limbalRingClarity`, `vesselDensity`, `realBlinkRate`, `tearFilmStability`).
**Scope:** Update `PersonalBaseline` type in `types/index.ts:159`, rewrite `updateBaseline` and `predictPhaseFromBaseline` in `phasePredictor.ts`. ~1 day.

### ⏭️ B-016: Refactor cognitive wellness off synthesized gazeStability
**Status:** PLANNED (v1.2)
**Why:** `cognitiveWellness.ts:160-168` reads `rawOpticalSignals.gazeStability`, which is computed from focusLevel (a derivative of scores). Should read `measuredOpticalSignals.frameStability` when available (real metric).
**Scope:** Update one function, fall back to existing logic when measured signals absent. ~½ day.

### ⏭️ B-017: Vessel density calibration on real images
**Status:** PLANNED (v1.2, requires device QA from B-014)
**Why:** Vessel detection thresholds are theory-based; need calibration from actual eye photos under typical user lighting.
**Scope:** Collect 20+ test scans, sweep `VESSEL_REDNESS_THRESHOLD` (30 default) and `VESSEL_NORMALIZER` (0.15 default) for best signal-to-noise. ~½ day.

### ⏭️ B-018: Iris-pattern anti-spoofing (consent-gated)
**Status:** DEFERRED (v1.3+)
**Blocker:** Iris pattern features count as **biometric data** under Apple/GDPR rules. Requires:
- Explicit opt-in consent flow with clear "biometric data" wording
- Update Apple Privacy Nutrition Labels (add Sensitive Info → Biometric Data)
- Update Google Play Data Safety (similarly)
- Legal review of EU implications (special category under GDPR)
- In-memory only — never persisted, never transmitted (anti-spoofing only, not identification)

**Scope:** ~5 days code + 1–2 weeks legal/UX. Defer until product proven.

### ⏭️ B-019: True video-based eye tracking (v2 strategic feature)
**Status:** DEFERRED (v2)
**Why:** A 1–2 second 60 fps video clip + flash event would let us measure pupil light reflex, true micro-saccades, and saccadic velocity. Major differentiator vs. competing wellness apps but requires migration from `expo-camera` to `react-native-vision-camera` + frame processors. ~5–7 days work + custom Expo dev client setup.
