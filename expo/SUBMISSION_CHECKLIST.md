# IRIS — iOS App Store Submission Checklist

Last updated: 2026-04-18

Follow this top-to-bottom. Don't skip ahead — later steps depend on earlier ones.

---

## Phase 1 — Apple Developer Portal (one-time, ~30 min)

**URL:** https://developer.apple.com/account

- [ ] **Create App ID** (Certificates, Identifiers & Profiles → Identifiers → +)
  - [ ] Platform: iOS
  - [ ] Bundle ID (explicit): `se.mojjo.iris-wellness`
  - [ ] Description: `IRIS Period & Cycle Tracker`
  - [ ] Capabilities to enable:
    - [x] HealthKit
    - [x] Push Notifications (for cycle/check-in reminders)
    - [x] In-App Purchase (for RevenueCat subscriptions)

- [ ] **Accept Paid Apps Agreement** (App Store Connect → Business → Agreements, Tax, Banking)
  - Required for any paid or subscription app — can take 24h to activate
  - Add tax info (W-8BEN for Sweden)
  - Add banking info

---

## Phase 2 — App Store Connect App Record (~20 min)

**URL:** https://appstoreconnect.apple.com

- [ ] **My Apps → + → New App**
  - Platform: iOS
  - Name: `IRIS: Period & Cycle Tracker` (matches app.json, max 30 chars visible)
  - Primary language: English (U.S.) or Swedish
  - Bundle ID: select `se.mojjo.iris-wellness`
  - SKU: `iris-wellness-ios-001` (internal, anything unique)
  - User Access: Full Access

- [ ] **App Information**
  - [ ] Category (primary): **Health & Fitness**
  - [ ] Category (secondary): **Lifestyle**
  - [ ] Content Rights: confirm you own all content (yes, you do)
  - [ ] Age Rating questionnaire (expect **12+** due to health/infrequent mature themes)

- [ ] **Pricing & Availability**
  - [ ] Price: Free (with IAP)
  - [ ] Countries: Start with Sweden + EU + US — expand later
  - [ ] Tax Category: select appropriate (usually default)

---

## Phase 3 — Required URLs (~1 hour)

You need these hosted publicly before submitting. They are **required fields**, Apple will reject without them.

- [ ] **Privacy Policy URL** — already have in-app text at `expo/constants/translations.ts`. Host it as a web page at e.g. `https://iris-wellness.mojjo.se/privacy`
- [ ] **Terms of Service URL** — same, host at `https://iris-wellness.mojjo.se/terms`
- [ ] **Support URL** — can be a page with email + FAQ, or just `mailto:` link on a page
- [ ] **Marketing URL** (optional) — landing page

Quick option: a single static HTML page per URL works fine.

---

## Phase 4 — In-App Purchase Setup (~30 min, needed only if launching with paywall)

- [ ] **App Store Connect → Your App → Monetization → Subscriptions**
- [ ] Create Subscription Group: `IRIS Premium`
- [ ] Create subscriptions (match RevenueCat product IDs):
  - [ ] `iris_monthly` — $9.99/mo
  - [ ] `iris_annual` — $59.99/yr
  - [ ] (optional) `iris_research` — $2.99/mo (data-sharing tier, per earlier discussion)
- [ ] For each: add display name, description, localizations, upload 1024x1024 screenshot
- [ ] **RevenueCat dashboard** — make sure product IDs match exactly
- [ ] **Sandbox tester** account (App Store Connect → Users and Access → Sandbox Testers)

---

## Phase 5 — Assets (~2–4 hours, can parallel with Phase 4)

### App Icon
- [x] `icon.png` (1024×1024, no transparency, no rounded corners — Apple rounds automatically) → already in `expo/assets/images/icon.png`
- [ ] Verify it's 1024×1024 exactly and < 1 MB

### Screenshots (required)
Need minimum **3 screenshots** per display size. Apple requires these sizes:

- [ ] **6.9"** (iPhone 17 Pro Max) — 1320×2868
- [ ] **6.7"** (iPhone 15 Plus / 14 Pro Max) — 1290×2796
- [ ] **6.5"** (iPhone 11 Pro Max) — 1284×2778 or 1242×2688
- [ ] **5.5"** (iPhone 8 Plus) — 1242×2208 *(still required for legacy)*

Suggested 5 shots:
1. Home screen showing today's phase + recommendations
2. Scan in progress (with eye oval)
3. Insights tab with charts
4. Calendar view
5. Chat / coach feature

Tools: use a simulator + Rork web preview, or Fastlane's `snapshot`

### App Preview Video (optional but boosts conversion)
- [ ] 15–30 second video per device size
- [ ] MP4, H.264, 30 fps

---

## Phase 6 — App Store Listing Copy

- [ ] **Name** (max 30 chars): `IRIS: Period & Cycle`
- [ ] **Subtitle** (max 30 chars): e.g. `Your wellness, day by day`
- [ ] **Promotional Text** (max 170 chars): updateable without resubmission
- [ ] **Description** (max 4000 chars):
  - What IRIS does (iris scan + daily check-in + personalized insights)
  - Key features (cycle tracking, wellness scores, chat, Apple Health)
  - Phases (menstrual/follicular/ovulation/luteal, pregnancy, perimenopause)
  - Privacy emphasis (on-device analysis, no data sold)
  - End with a call-to-action

- [ ] **Keywords** (max 100 chars, comma-separated): `cycle,period,tracker,pms,luteal,ovulation,fertility,wellness,women,pregnancy`
- [ ] **Support URL** — from Phase 3
- [ ] **Marketing URL** (optional)

---

## Phase 7 — App Privacy (answered based on your privacy manifest)

Your privacy manifest declares the answers. In App Store Connect → App Privacy:

- [ ] **Does your app collect data?** → Yes
- [ ] **Data types collected:**
  - **Other Diagnostic Data**: Not linked, Not tracking, Purposes: App Functionality, Analytics
  - **Product Interaction**: Not linked, Not tracking, Purposes: App Functionality, Analytics
- [ ] **Tracking:** No
- [ ] **Third-party partners:** None (your backend only)

---

## Phase 8 — EAS Build Setup (~15 min)

Fill out `expo/eas.json` submit block with your real IDs:

```json
"submit": {
  "production": {
    "ios": {
      "appleId": "your-apple-id@email.com",
      "ascAppId": "1234567890",   // from App Store Connect app page → App Info
      "appleTeamId": "ABCDEF1234"  // from Apple Developer Portal → Membership
    }
  }
}
```

Then:

- [ ] `cd expo && bunx eas login`
- [ ] `bunx eas credentials` — let EAS generate distribution cert + provisioning profile
- [ ] `bunx eas build:configure` — verify configuration

---

## Phase 9 — First TestFlight Build (~30 min build time)

- [ ] `bunx eas build --platform ios --profile preview`
- [ ] Wait for build, install on device via TestFlight
- [ ] **Smoke test on real device:**
  - [ ] Onboarding completes without errors
  - [ ] Camera permission prompt shows the updated description
  - [ ] First scan works end-to-end
  - [ ] HealthKit permission prompt appears when enabling Apple Health
  - [ ] IAP sandbox purchase flow works (with sandbox tester account)
  - [ ] Notifications fire (schedule one 1 min out)
  - [ ] Dark mode looks correct
  - [ ] Switch language (EN↔SV) — no missing strings
  - [ ] Delete account flow works

- [ ] **Fix any crashes** via EAS → Diagnostics or Xcode → Organizer → Crashes

---

## Phase 10 — Pre-submission Code Checks

- [ ] **Version bump** in `app.json` → `"version": "1.0.0"` (already set)
- [ ] **Bundle identifier** matches exactly: `se.mojjo.iris-wellness` (already set)
- [ ] **No dev/debug code paths** in production bundle
  - [ ] `logger` calls — currently using a wrapped logger, verify production mode silences them
  - [ ] No `console.log` of sensitive data
- [ ] **Remove BACKLOG.md and any internal docs** from the JS bundle (already gitignored?)
- [ ] **Hardcoded backend URLs** — should point to production tRPC
  - [ ] Check `expo/lib/trpc.ts` for `EXPO_PUBLIC_TRPC_URL` or similar
- [ ] **RevenueCat keys** — production keys set via `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY`
- [ ] **TypeScript compiles clean** — `bunx tsc --noEmit`
- [ ] **No uncommitted changes**: `git status`

---

## Phase 11 — Submit for Review

- [ ] **App Store Connect → Your App → App Store tab → + Version or Platform → iOS**
- [ ] Fill out **What's New in This Version** (first submission: a brief 2–3 sentence description)
- [ ] **Build** section → attach the TestFlight build you validated
- [ ] **App Review Information:**
  - [ ] Contact first name, last name, phone, email
  - [ ] **Demo account** (CRITICAL — reviewers need this)
    - Create a test email: e.g. `appstorereview@mojjo.se`
    - Pre-populate it with: completed onboarding, 2 weeks of check-ins, some scans
    - Provide credentials in the notes field
    - Or: mark "Sign-in is not required" if app works without account (IRIS does — data is local)
  - [ ] **Notes to reviewer** — suggested text:
    ```
    IRIS is a wellness companion that uses brief on-device iris scans
    combined with self-reported check-ins to estimate daily wellness
    signals (energy, hydration, recovery). No medical claims.

    - No account required — all data is stored locally on device
    - Camera is used only for eye scans; photos never leave the device
    - HealthKit is read-only (sleep, menstrual flow, heart rate) and
      helps personalize insights
    - Subscriptions: RevenueCat-managed IAPs, tested in sandbox

    Please test:
    1. Complete onboarding (skipping the scan step is allowed)
    2. Try a scan on step 7 of onboarding
    3. Explore Home / Insights / Calendar
    ```

- [ ] **Version Release** → "Manual release after approval" (safer for first submit)
- [ ] **Export Compliance** → "No, does not use encryption beyond standard iOS APIs" (already pre-answered via `ITSAppUsesNonExemptEncryption: false`)
- [ ] **Content Rights** → confirm all content is yours
- [ ] **Advertising Identifier (IDFA)** → "No, my app does not use IDFA"
- [ ] **Submit for Review** button → 🚀

---

## Common rejection causes to preempt

| Risk | Your status |
|---|---|
| Generic permission descriptions | ✅ Fixed — specific wording applied |
| Missing privacy manifest | ✅ Fixed |
| Medical claims / diagnosis language | ✅ Softened (Inflammation → Irritation, etc.) |
| IAP without subscription info | ⏳ Phase 4 |
| Broken demo account | ⏳ Phase 11 — don't skip this |
| HealthKit without reason | ✅ Usage description written |
| Crashes on launch | ⏳ Test on multiple devices/iOS versions before submit |
| Missing privacy policy URL | ⏳ Phase 3 |
| Using private APIs | ✅ Expo managed workflow doesn't use private APIs |
| Push without reason | ✅ Reminders are declared-use |

---

## Timing estimate

| Phase | Time |
|---|---|
| 1–2 | 1 hour |
| 3 | 1 hour (if you already have a domain) |
| 4 | 30 min |
| 5 | 2–4 hours (screenshots are the bottleneck) |
| 6 | 1–2 hours (writing copy) |
| 7 | 10 min |
| 8 | 15 min |
| 9 | 1 hour + build wait time |
| 10 | 1 hour |
| 11 | 30 min |
| **Apple review** | **24h–7 days** typically |

**Total prep before review:** ~8–12 hours of focused work.

---

## After approval

- [ ] Flip release toggle to release
- [ ] Monitor App Store Connect → Analytics for install/crash rates
- [ ] Set up deep-link testing from App Store page
- [ ] Share TestFlight link with friends/family for reviews
- [ ] Prepare v1.1 — gather user feedback from the first week
