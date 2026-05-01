# IRIS — Google Play Store Listing

Google Play has its own format and limits. Here's the listing copy ready to
paste into Play Console → Store presence → Main store listing.

---

## App name (max 30 chars)

**`IRIS: Period & Cycle Tracker`** (28 chars)

## Short description (max 80 chars)

**`Track your cycle, mood & wellness with a private on-device eye scan.`**
(70 chars)

## Full description (max 4000 chars)

```
IRIS is a gentle wellness companion that helps you understand your body's
patterns over time — across cycle, mood, sleep, energy, and recovery.

Most cycle apps only track when your period starts. IRIS combines period
tracking with daily check-ins and an optional 5-second eye scan that runs
entirely on your device, so you can see how your body is actually doing
day by day — not just where you are in the calendar.

🌙 WHAT YOU GET

• Cycle tracking — log your period, see your phase, and get a clear view
  of menstrual, follicular, ovulatory, and luteal patterns

• Daily check-in — sleep, energy, mood, stress, symptoms, and bleeding,
  in under 30 seconds

• Wellness scan — a brief, on-device eye scan that estimates energy,
  hydration, recovery, fatigue, and irritation. Your photo is never
  stored or sent anywhere

• Insights — daily and weekly trends across phases, with patterns that
  actually mean something to you

• 9 languages — English, Swedish, German, French, Spanish, Italian, Dutch,
  Polish, Portuguese

• Multi-life-stage — designed for regular cycles, hormonal contraception,
  pregnancy, postpartum, perimenopause, and menopause

🔒 PRIVACY-FIRST BY DESIGN

Your cycle, mood, symptoms, and scan results live on your device. We do
not sell or share your data with anyone. The eye-scan photo is discarded
immediately after analysis — only the resulting wellness scores are kept.

🌸 WELLNESS, NOT MEDICINE

IRIS is a wellness tool. It helps you notice patterns and feel more in
sync with your body. It is not a medical device, and the wellness scores
are not a medical diagnosis. Always consult a healthcare professional for
medical concerns.

⭐ PREMIUM (optional)

IRIS is free to use. IRIS Premium unlocks the full daily check-in, deeper
insights, the wellness chat, and unlimited scans. Subscriptions are
managed through Google Play and auto-renew unless cancelled.

—

Made with care by a small team in Sweden.
Questions or feedback? jenny.nirs@mojjo.se

By using IRIS you agree to our Terms of Service and Privacy Policy.
```

(~2400 chars — well under the 4000 limit. Emoji bullets work well in Play
descriptions but break iOS App Store layout, so this version is Android-
specific.)

---

## Category

| | |
|---|---|
| Category | **Health & Fitness** |
| Tag | Lifestyle |

---

## Tags (Play Store, max 5)

`Cycle tracking`, `Period`, `Wellness`, `Women's health`, `Mood tracking`

---

## Content rating questionnaire

Run the rating questionnaire on Play Console → Policy → App content. Expected
result: **PEGI 3 / Everyone** (no objectionable content). The medical/treatment
question may bump iOS to 12+ but Play tends to keep wellness apps at Everyone.

---

## Target audience

- Age: **13+** (matches iOS)
- Note: Play asks if your app appeals to children. Answer **No** —
  IRIS is designed for adults tracking their cycle.

---

## Data safety form (Google's privacy disclosure)

This is the Play Store equivalent of Apple's "App Privacy" page.

| Section | Answer |
|---|---|
| Does your app collect or share any user data? | **Yes** (anonymous analytics) |
| Encryption in transit? | **Yes** (HTTPS to backend) |
| Can users request data deletion? | **Yes** (in-app: Settings → Delete Account) |

### Data types collected

| Data type | Collected? | Shared? | Optional? | Purpose | Linked to user? |
|---|---|---|---|---|---|
| **App interactions** | Yes | No | Yes (offline mode works) | Analytics, App functionality | No |
| **Crash logs** | Yes (if you enable Sentry/Crashlytics later) | No | No | Analytics | No |
| **Health & fitness** | **No** (stored on-device only) | — | — | — | — |
| **Photos** | **No** (scan photos discarded immediately) | — | — | — | — |

---

## Required assets

### Visual assets

| Asset | Spec | Where to upload |
|---|---|---|
| **App icon** | 512 × 512 PNG, no alpha, no rounded corners (Play rounds for you) | Already at `expo/assets/images/icon.png` (1024 × 1024) — resize for Play |
| **Feature graphic** | 1024 × 500 JPG/PNG | Need to create |
| **Phone screenshots** | min 320 px / max 3840 px on shorter side, 2-8 images | Same shots as iOS, no need for device frame |

### Privacy + Support URLs (already covered)

- Privacy Policy: `https://iris-eye-insights.lovable.app/privacy`
- Support: `mailto:jenny.nirs@mojjo.se` works as the support contact

---

## Pricing & distribution

| Setting | Value |
|---|---|
| Price | **Free** (with in-app purchases for Premium) |
| Countries | Start with EU + US — expand later |
| Devices | Phone (you set `supportsTablet: false` in app.json) |
| Family Library | **Off** (subscriptions don't share well via Family Library) |

---

## In-app products / subscriptions

You'll need to mirror the Apple IAP product IDs in Play Console → Monetize →
Subscriptions:

| Product ID | Type | Price | Trial |
|---|---|---|---|
| `iris_monthly` | Monthly subscription | $9.99 (or local equivalent) | 7-day free |
| `iris_annual` | Annual subscription | $59.99 | 14-day free |
| `iris_research` (optional) | Monthly, data-sharing tier | $2.99 | None |

Make sure the **product IDs match exactly** what's configured in RevenueCat
and Apple App Store Connect — otherwise users can't be migrated cross-platform.

---

## What's new (each release)

```
First release of IRIS! Track your cycle, log a quick daily check-in,
and get on-device wellness insights — privately, gently, in your
language.

Looking forward to your feedback.
```

(Play allows up to 500 chars in "What's new". iOS has the same field.)

---

## Submission checklist (Google Play side)

Run through these in Play Console:

- [ ] **Set up your developer account** (already done if you have World Food
      Journey published)
- [ ] **Create app** in Play Console — bundle ID `se.mojjo.iris_wellness`
- [ ] **Upload AAB** built via `bunx eas build --platform android --profile production`
- [ ] **Internal testing track** — test with sandbox testers (cheaper than
      external before submitting)
- [ ] **Closed testing track** (optional) — share with friends/family
- [ ] **Production track** — submit for review
- [ ] **Privacy Policy URL** in Store listing
- [ ] **App content** questionnaire — Data safety, Content rating, Target
      audience, News, COVID-19 contact tracing (No), Government, Financial
      features (No), Health (Yes — wellness disclaimer)
- [ ] **Pricing & distribution**
- [ ] **Wear OS / TV / Auto** opt-in: **No** for all
- [ ] **Subscriptions** created with same product IDs as iOS

Google Play review usually takes 24–72h for first submissions.
