# Demo data seeding for App Review

App Store and Google Play reviewers spend ~5 minutes on each app. If they
open IRIS to an empty home screen with no scans or check-ins, they'll see a
shell, not a product. This guide gives you ways to make the app **feel
populated** for reviewers and screenshots.

## Approach 1 — Use a real seeded device (recommended)

Manually populate a test device or simulator with 30 days of data. This gives
the most realistic look and is what we'll use for screenshots anyway.

### Step-by-step seed script

1. **Reset the app**: delete and reinstall, or Profile → Settings → Delete Account
2. **Onboarding**:
   - Language: English
   - Life stage: Regular cycle
   - Name: `Sara`
   - Birthday: a date that makes age 28
   - Cycle length: 28 days
   - Last period: **30 days ago** (so Sara is just finishing her cycle)
   - Wellness focus: Energy + Hormonal balance
3. **Skip the onboarding scan** (we want to control which scans exist)

### Daily seed (run this on the simulator over 30 minutes)

For each of the 30 days, open the simulator with the date set to that day,
log a check-in, run a scan (optional), and save.

To set the simulator clock:

```bash
# kill simulator, set system date, restart simulator
xcrun simctl shutdown booted
sudo systemsetup -setdate $(date -v -29d +%m:%d:%Y)
xcrun simctl boot "iPhone 15 Pro Max"
```

Or use a date-mocking helper. Easier: run the app once a day for a week, then
let the data fill in naturally during testing.

### What each day's data should look like

| Cycle day | Phase | Notable |
|---|---|---|
| 1–4 | Menstrual | Bleeding=heavy first 2 days, then medium. Energy 3-4. Mood 4. Symptoms: cramps, fatigue. |
| 5–7 | Menstrual / late | Bleeding=light/spotting. Energy rising 5-6. |
| 8–13 | Follicular | No bleeding. Energy 7-8. Mood 7-8. Few symptoms. |
| 14 | Ovulation | Energy 8. Symptom: breast tenderness once. |
| 15–22 | Luteal | Energy 6-7. Mood 6. Symptoms appear: bloating, sugar cravings. |
| 23–28 | Late luteal / PMS | Energy 4-5. Mood 4-5. Symptoms: bloating, mood swings, sugar cravings, insomnia. |

This produces a realistic-looking 30-day pattern with clear phase trends —
exactly what makes Insights tab visually compelling.

## Approach 2 — Seeding script via Supabase SQL

For fast resets between tests, you can pre-load the kv_store table directly.

```sql
-- In Supabase SQL editor for project zgfcnfozmxymvrahnuek

-- Insert a seeded user snapshot
insert into public.kv_store (key, value)
values (
  'analytics-snapshots.json',
  $$ [
    ["usr_demoreviewer1", {
      "userId": "usr_demoreviewer1",
      "firstSeen": "2026-04-01T08:00:00Z",
      "lastSeen": "2026-04-30T20:00:00Z",
      "onboardingCompleted": true,
      "onboardingCompletedAt": "2026-04-01T08:05:00Z",
      "firstCheckinAt": "2026-04-01T08:10:00Z",
      "firstScanAt": "2026-04-01T08:15:00Z",
      "totalCheckins": 30,
      "totalScans": 28,
      "isPremium": false,
      "premiumStartedAt": null,
      "premiumCancelledAt": null,
      "lifeStage": "regular",
      "referralApplied": false,
      "referralCode": null,
      "healthConnected": false,
      "platform": "ios",
      "paywallViews": 2,
      "language": "en",
      "scanMetrics": [
        {"timestamp":"2026-04-01T08:15:00Z","stressScore":4,"energyScore":7,"recoveryScore":7,"hydrationLevel":7,"fatigueLevel":4,"inflammation":3,"scleraYellowness":0.05,"underEyeDarkness":0.2,"eyeOpenness":0.85,"tearFilmQuality":0.7}
        // ... add more
      ],
      "checkInEntries": [
        {"timestamp":"2026-04-01T08:10:00Z","energy":7,"sleep":8,"stressLevel":3,"mood":7,"symptoms":[],"cyclePhase":"follicular"}
        // ... add more
      ]
    }]
  ] $$::jsonb
)
on conflict (key) do update set value = excluded.value;
```

Copy this template, expand the arrays to ~30 entries each with the per-phase
profile from Approach 1, then run.

This populates the **admin dashboard** with realistic data so the per-user
drill-down (`Tap user row → modal`) shows Sara's full history. Useful for
screenshots that show the admin panel.

## Approach 3 — Reviewer demo account (no seed needed)

If reviewers won't get past onboarding, give them a path that doesn't require
seeded data:

1. In the **App Review notes** field, write:

   > IRIS works fully without an account. To test the experience as a
   > new user:
   > 1. Complete onboarding (you can skip the scan step)
   > 2. From Home, tap "Daily Check-in" and log how you're feeling
   > 3. Tap the camera icon to try a scan
   > 4. Browse Insights, Calendar, Profile
   >
   > For a populated experience, sign in with the demo data device:
   > Apple ID: appstorereview@mojjo.se
   > Password: IrisReview2026!
   > (For sandbox subscriptions only — IRIS itself doesn't require sign-in.)

This sets expectations and lets the reviewer pick their own depth of testing.

## Sandbox tester account for IAP testing

App Store Connect → **Users and Access → Sandbox Testers → +**

Create:
- Email: `appstorereview@mojjo.se` (or another that you control)
- Password: `IrisReview2026!`
- Region: United States (Apple's reviewers are US-based)
- Date of birth: any adult age

Use this account on the simulator/device when testing IAP flows.

**Important:** Sign out of the real Apple ID under iOS Settings → Media &
Purchases → Sign Out. Then when you trigger a subscription purchase IRIS,
iOS will prompt for the sandbox account. Don't sign in via Settings → Apple
ID — that flips the whole device to sandbox mode and confuses other apps.

## What NOT to include in demo data

- ❌ Real names of your test friends (use "Sara", "Anna", "Lena", etc.)
- ❌ Real birthdays
- ❌ Recognizable email addresses other than your support contact
- ❌ Anything that looks like medical advice or diagnosis
- ❌ Symptoms in a sequence that suggests a specific medical condition
