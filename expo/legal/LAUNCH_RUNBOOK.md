# IRIS — TestFlight + Google Play Launch Runbook

The shortest path from where we are right now to **submitted for review on
both stores**. Follow top-to-bottom.

## Pre-flight checklist (already done ✅)

- [x] Backend deployed: https://iris-backend.fly.dev (Fly.io, Stockholm)
- [x] Database: Supabase Postgres, free tier, EU (Stockholm)
- [x] Mobile app env wired: `EXPO_PUBLIC_RORK_API_BASE_URL` in `.env` and
      `eas.json` for both `preview` and `production` profiles
- [x] iOS permission descriptions written (`app.json` infoPlist)
- [x] iOS privacy manifest declared (`app.json` privacyManifests)
- [x] Encryption flag set: `ITSAppUsesNonExemptEncryption: false`
- [x] App Store listing copy: `legal/APP_STORE_LISTING.md`
- [x] Google Play listing copy: `legal/GOOGLE_PLAY_LISTING.md`
- [x] Updated privacy + terms text: `legal/PRIVACY_AND_TERMS_TEXT.md`
- [x] Screenshot strategy: `legal/SCREENSHOTS.md`
- [x] Demo data plan: `legal/DEMO_DATA.md`
- [x] TS compile clean
- [x] Wellness wording softened (Inflammation → Irritation, etc.)

## What you need to do (in order)

### Block 1 — Apple Developer Portal (~30 min)

URL: https://developer.apple.com/account

- [ ] Create App ID
  - Bundle ID: `se.mojjo.iris-wellness` (must match `app.json`)
  - Capabilities: **HealthKit**, **Push Notifications**, **In-App Purchase**
- [ ] Accept Paid Apps Agreement (Business → Agreements, Tax, Banking)
  - Add Swedish tax info (W-8BEN)
  - Add bank info
- [ ] Wait up to 24h for Paid Apps to activate

### Block 2 — App Store Connect record (~15 min)

URL: https://appstoreconnect.apple.com

- [ ] My Apps → **+ New App**
  - Name: `IRIS: Period & Cycle Tracker`
  - Primary language: English (or Swedish)
  - Bundle ID: select the one you just made
  - SKU: `iris-wellness-ios-001`
  - User Access: Full Access
- [ ] App Information page:
  - Category Primary: **Health & Fitness**
  - Category Secondary: **Lifestyle**
  - Content Rights: Yes, you own it
  - Age Rating: complete questionnaire (expected: 12+)
- [ ] Pricing & Availability:
  - Free
  - Available in Sweden + EU + US to start
- [ ] Note the **App Apple ID (`ascAppId`)** — appears in URL after creation,
      e.g. `1234567890`. You'll need this for `eas.json`.

### Block 3 — Update `eas.json` with real IDs (~5 min)

In `expo/eas.json`, fill in the submit block:

```json
"submit": {
  "production": {
    "ios": {
      "appleId": "jenny.nirs@mojjo.se",
      "ascAppId": "1234567890",                    // from Block 2
      "appleTeamId": "ABCDEF1234"                  // from Apple Developer Portal → Membership
    },
    "android": {
      "serviceAccountKeyPath": "./play-service-account.json",
      "track": "internal"
    }
  }
}
```

Apple Team ID is at https://developer.apple.com/account → Membership.

### Block 4 — In-App Purchase setup (~30 min, optional for v1)

If you're launching with a paywall:

- [ ] App Store Connect → your app → Monetization → Subscriptions → +
  - Subscription Group: `IRIS Premium`
  - Add: `iris_monthly` ($9.99), `iris_annual` ($59.99)
  - Mirror the same in **Google Play Console → Monetize → Subscriptions**
- [ ] Verify the product IDs match RevenueCat's dashboard exactly
- [ ] Create a sandbox tester (see DEMO_DATA.md → Sandbox section)

If launching without paywall: skip Block 4 entirely. You can add paid
subscriptions in v1.1 without resubmitting the whole app.

### Block 5 — EAS first build & TestFlight (~1h, mostly waiting)

```bash
cd expo

# Login if needed
bunx eas login

# Configure credentials (generates iOS distribution cert + provisioning profile)
bunx eas credentials

# Build production-style binary for internal testing
bunx eas build --platform ios --profile preview

# This takes ~25 min on EAS. When done, the build appears in App Store
# Connect → TestFlight → iOS automatically. Process for export compliance
# is auto-answered because of `ITSAppUsesNonExemptEncryption: false`.

# Install on your device via TestFlight, smoke-test:
# - onboarding completes
# - daily check-in works
# - eye scan works (real device camera)
# - HealthKit permission prompt appears with the right wording
# - subscription IAP sandbox flow works (if paywall enabled)
# - notifications fire (schedule one ~1 min ahead)

# When happy, submit to App Store
bunx eas submit --platform ios --latest
```

`eas submit` uses the `ascAppId` and Apple ID from `eas.json` to upload the
already-built binary to App Store Connect.

### Block 6 — Listing & assets in App Store Connect (~2h)

- [ ] Open **App Store** tab in your app's page
- [ ] Click **+ Version or Platform → iOS** (creates the 1.0 version)
- [ ] Paste copy from `legal/APP_STORE_LISTING.md`:
  - Subtitle, Promotional Text, Description, Keywords
- [ ] Upload screenshots (see `legal/SCREENSHOTS.md`)
- [ ] App Privacy → use answers from `legal/APP_STORE_LISTING.md`
- [ ] App Review Information:
  - Contact info: jenny.nirs@mojjo.se
  - Demo account section: paste reviewer notes from
    `legal/DEMO_DATA.md` Approach 3
- [ ] Version Release: **Manually release this version** (safest)
- [ ] Build → attach the TestFlight build you validated
- [ ] Submit for Review

### Block 7 — Google Play Console setup (~1h)

URL: https://play.google.com/console

- [ ] **Create app**
  - App name: `IRIS: Period & Cycle Tracker`
  - Default language: English
  - App or game: **App**
  - Free or paid: **Free**
- [ ] **Set up your app** (left sidebar, run all questionnaires)
  - App access (no special access required)
  - Ads (No ads)
  - **Content rating** — fill out
  - **Target audience** — 13+
  - **News app** — No
  - **COVID-19** — No
  - **Data safety** — fill from `legal/GOOGLE_PLAY_LISTING.md`
  - **Government apps** — No
  - **Financial features** — No
  - **Health** — Yes (wellness, not medical claims)
- [ ] **Store listing** — paste copy from `legal/GOOGLE_PLAY_LISTING.md`
- [ ] **Store presence → Main store listing** — upload assets:
  - App icon (512×512)
  - Feature graphic (1024×500) — needs creating (Figma)
  - Phone screenshots (same shots as iOS, 1080×1920)

### Block 8 — Build & upload Android (~30 min)

```bash
cd expo

# Build production AAB
bunx eas build --platform android --profile production

# Wait for build (~15 min). EAS will give you a download link.
# Download the .aab.

# Set up Play Console service account for automated submissions:
# https://console.cloud.google.com/iam-admin/serviceaccounts
# Create service account, give it "Service Account User" role,
# generate JSON key, save to expo/play-service-account.json
# (DON'T commit this file — it's in .gitignore)

# Submit
bunx eas submit --platform android --latest
```

OR upload the AAB manually:
- Play Console → **Internal testing track → Create new release**
- Upload the AAB
- Add release notes (from "What's new" in `legal/GOOGLE_PLAY_LISTING.md`)
- Save → Review → Submit

### Block 9 — Internal testing (Both stores, ~24h)

- [ ] **iOS TestFlight**: invite 5–10 friends/family via TestFlight
- [ ] **Android internal track**: invite same testers via email
- [ ] Smoke-test for 24h. Watch for:
  - Crashes (use Fly.io logs + EAS Diagnostics)
  - Login / IAP sandbox flow
  - Real device camera (the simulator doesn't accurately capture eye color)
- [ ] Iterate via `bunx eas update --branch preview` (no full rebuild needed)

### Block 10 — Submit for production review

- [ ] iOS: App Store Connect → your app → 1.0 version → Submit for Review
- [ ] Android: Play Console → Production track → promote internal release →
  Send for review
- [ ] Apple review: ~24h–7 days. Google: ~24–72h.

---

## Common rejection pitfalls (already addressed for IRIS)

| Risk | Mitigated by |
|---|---|
| Generic permission descriptions | ✅ Specific iris-scan wording in `app.json` |
| Missing privacy manifest | ✅ `privacyManifests` block in `app.json` |
| Medical device claims | ✅ Wording sweep, "wellness" framing |
| Crashes on first launch | Mitigate with TestFlight smoke test |
| Wrong demo account | ✅ DEMO_DATA.md → Approach 3 ready |
| HealthKit without explanation | ✅ `NSHealthShareUsageDescription` written |
| Spend cap nag from Supabase | ✅ Free tier downgrade complete |
| Backend offline during review | Fly.io auto-stops idle but auto-starts on first request |

---

## Post-launch monitoring

- **Fly.io logs**: `flyctl logs --app iris-backend`
- **Supabase usage**: https://supabase.com/dashboard/project/zgfcnfozmxymvrahnuek
- **App Store Connect Analytics**: install / crash / retention
- **Play Console Statistics**: same
- **Admin dashboard** (in-app): Profile → tap version 5x → real user data

## When things go wrong

| Symptom | Likely cause | Fix |
|---|---|---|
| Apple rejects on "guideline 2.1" | Crash or unresponsive app | Re-test on real device, send updated build |
| Apple rejects on "guideline 5.1.1" | Privacy issue | Review privacy text vs app behavior |
| Apple rejects on "guideline 1.4.1" | Medical claims | Search remaining text for "diagnose", "cure", "treat" |
| Google rejects on Data safety | Form mismatch with manifest | Reconcile form vs `app.json` privacyManifests |
| Backend returns 5xx | Fly machine asleep too long | `flyctl machine start` from CLI or open URL once to wake |

---

**You've got this. Estimated total time from now to "Submitted":**
~6–10 hours of focused work spread over 2–3 days (Apple Paid Apps activation
takes 24h regardless).
