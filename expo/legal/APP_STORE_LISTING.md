# IRIS — App Store Listing Copy

Drafts for App Store Connect → App Information. Char limits enforced.

---

## App name (max 30 chars)

**`IRIS: Period & Cycle Tracker`** (28 chars)

Alternatives:
- `IRIS — Cycle & Wellness` (24 chars)
- `IRIS Cycle Tracker` (18 chars)

---

## Subtitle (max 30 chars)

**`Your wellness, day by day`** (25 chars)

Alternatives:
- `Cycle, mood & wellness` (22 chars)
- `Track your cycle & energy` (25 chars)
- `Daily wellness check-in` (23 chars)

---

## Promotional Text (max 170 chars, updateable without resubmit)

```
New: track your cycle, daily mood, and wellness with a quick eye scan
that runs entirely on your device. Your body, your data, your phone.
```
(154 chars)

---

## Description (max 4000 chars)

```
IRIS is a gentle wellness companion that helps you understand your body's
patterns over time — across cycle, mood, sleep, energy, and recovery.

Most cycle apps only track when your period starts. IRIS combines period
tracking with daily check-ins and an optional 5-second eye scan that runs
entirely on your device, so you can see how your body is actually doing
day by day — not just where you are in the calendar.

——————————————————————

WHAT YOU GET

• Cycle tracking — log your period, see your phase, and get a clear view
  of menstrual, follicular, ovulatory, and luteal patterns

• Daily check-in — sleep, energy, mood, stress, symptoms, and bleeding,
  in under 30 seconds

• Wellness scan — a brief, on-device eye scan that estimates energy,
  hydration, recovery, fatigue, and irritation. Your photo is never
  stored or sent anywhere

• Insights — daily and weekly trends across phases, with patterns that
  actually mean something to you

• Apple Health (read-only) — pull in your sleep, heart rate, and activity
  to enrich your insights, with full control over what you share

• 9 languages — English, Swedish, German, French, Spanish, Italian, Dutch,
  Polish, Portuguese

• Multi-life-stage — designed for regular cycles, hormonal contraception,
  pregnancy, postpartum, perimenopause, and menopause

——————————————————————

PRIVACY-FIRST BY DESIGN

Your cycle, mood, symptoms, and scan results live on your device. We do
not sell or share your data with anyone. The eye-scan photo is discarded
immediately after analysis — only the resulting wellness scores are kept.

——————————————————————

WELLNESS, NOT MEDICINE

IRIS is a wellness tool. It helps you notice patterns and feel more in
sync with your body. It is not a medical device, and the wellness scores
are not a medical diagnosis. Always consult a healthcare professional for
medical concerns.

——————————————————————

PREMIUM (optional)

IRIS is free to use. IRIS Premium unlocks the full daily check-in, deeper
insights, the wellness chat, and unlimited scans. Subscriptions are
managed through the Apple App Store and auto-renew unless cancelled.

——————————————————————

Made with care by a small team in Sweden.
Questions or feedback? jenny.nirs@mojjo.se

By using IRIS you agree to our Terms of Service and Privacy Policy.
```

(~2500 chars — well under the 4000 limit)

---

## Keywords (max 100 chars, comma-separated, no spaces after commas)

```
period,cycle,tracker,pms,luteal,ovulation,fertility,wellness,women,pregnancy,perimenopause,mood,scan
```
(99 chars)

Reasoning:
- High-volume cycle/period keywords lead
- Each phase name (luteal, ovulation, perimenopause) catches phase-specific search
- "scan" differentiates from competitors

---

## What's New in This Version (initial submission)

```
First release of IRIS! Track your cycle, log a quick daily check-in, and
get on-device wellness insights — privately, gently, in your language.

Looking forward to your feedback.
```

---

## Categories

| | |
|---|---|
| Primary | **Health & Fitness** |
| Secondary | **Lifestyle** |

---

## URLs (for App Store Connect)

| Field | URL |
|---|---|
| Marketing URL (optional) | https://iris-eye-insights.lovable.app |
| Support URL (required) | https://iris-eye-insights.lovable.app (or a /support page if/when you add one) |
| Privacy Policy URL (required) | https://iris-eye-insights.lovable.app/privacy |
| Terms of Service URL | https://iris-eye-insights.lovable.app/terms |

---

## Age Rating questionnaire — expected answers

| Question | Answer |
|---|---|
| Cartoon or fantasy violence | None |
| Realistic violence | None |
| Sexual content or nudity | None |
| Profanity or crude humor | None |
| Alcohol, tobacco, drug use | None |
| Mature/suggestive themes | None |
| Horror/fear themes | None |
| Prolonged graphic or sadistic violence | None |
| Gambling | None |
| Unrestricted web access | No |
| Medical/treatment information | **Infrequent/Mild** (wellness disclaimers, not medical) |

Expected rating: **12+** (because of "medical/treatment information").

---

## App Store Connect — App Privacy answers

Aligned with the Privacy Manifest already in `app.json`:

| Question | Answer |
|---|---|
| Do you collect data from this app? | **Yes** |
| Data type: Other Diagnostic Data | Not linked, Not tracking, Purposes: Analytics + App Functionality |
| Data type: Product Interaction | Not linked, Not tracking, Purposes: Analytics + App Functionality |
| Health & Fitness data collected? | **No** (stored on-device only) |
| Tracking | **No** |
| Third-party partners | **None** (you have your own backend on Fly.io + Supabase) |

---

## Demo account for App Review

IRIS works fully without an account, so you can leave the demo account
fields empty and write in the notes:

> No account required. All data is stored locally on the device. To test:
> complete onboarding (skipping the scan step is allowed), log a check-in,
> then optionally try a scan from the camera prompt. The wellness scan
> processes the image entirely on-device and never uploads photos.
>
> If you want to test premium features, here's a sandbox tester account:
> appstorereview@mojjo.se / IrisReview2026!
> (Make sure your device is signed in with this Apple ID in Settings →
> App Store → Sandbox Account.)

---

## Notes for the reviewer

```
IRIS is a wellness companion that uses brief on-device eye scans combined
with self-reported daily check-ins to estimate everyday wellness signals
(energy, hydration, recovery). It is not a medical device and makes no
medical claims.

— No account required. All health data is stored locally on the device.
— Camera is used only for the eye scan; photos never leave the device.
— HealthKit access is read-only (sleep, menstrual flow, heart rate) and
  helps personalize wellness insights.
— Subscriptions are RevenueCat-managed IAPs, tested in sandbox.

Suggested test flow:
  1. Complete onboarding (the scan step on screen 7 can be skipped).
  2. From the Home tab, tap "Daily Check-in" and log how you're feeling.
  3. Tap "Scan" to try the on-device eye scan.
  4. Explore Insights, Calendar, and Profile.
  5. To test premium: Profile → Settings → IRIS Premium.

Thank you for your time. Reach us anytime at jenny.nirs@mojjo.se.
```
