# IRIS — App Store & Google Play Submission Guide

## App Store Description

### App Name
**IRIS - Women's Wellness**

### Subtitle (30 chars max)
`Iris Scan Wellness Tracker`

### Promotional Text (170 chars, can be updated without review)
Your wellness, visible in your eyes. IRIS uses on-device iris analysis to track energy, stress, recovery and more. Your photos never leave your phone.

### Description

Your eyes reveal more than you think.

IRIS is a privacy-first wellness tracker that uses your phone camera to analyze your iris and deliver personalized health insights — all processed on your device. No photos are stored. No data leaves your phone unless you choose to share it.

WHAT MAKES IRIS DIFFERENT

Unlike traditional period trackers, IRIS combines optical biomarkers from your eyes with daily check-ins and Apple Health data to build a complete picture of your wellness across your entire cycle.

YOUR DAILY WELLNESS IN 10 SECONDS
Scan your eye. Get six key wellness scores: energy, stress, recovery, hydration, fatigue, and inflammation. Track trends over 7, 30, and 90 days.

CYCLE-AWARE COACHING
Smart coaching tips adapt to your current phase — menstrual, follicular, ovulation, or luteal. IRIS learns your patterns and suggests nutrition, movement, skincare, and recovery strategies tailored to you.

EVERY LIFE STAGE
Whether you have a regular cycle, are pregnant, postpartum, or navigating perimenopause and menopause — IRIS adapts symptom tracking, insights, and coaching to your stage of life.

DAILY CHECK-IN
Log mood, energy, sleep, symptoms, and lifestyle factors. IRIS cross-references your check-in with your scan data to surface patterns you might miss.

SHARE WITH YOUR DOCTOR
Generate a professional PDF wellness report with cycle summaries, 30-day averages, symptom patterns, and trend analysis to bring to your next appointment.

PRIVACY BY DESIGN
- Photos analyzed on-device and immediately discarded
- Only numerical wellness scores are stored
- Server sync is opt-in with explicit consent
- No ads. No third-party data sharing.

ALSO INCLUDES
- Apple Health integration (HRV, wrist temperature, sleep)
- Cycle calendar with phase predictions
- Partner mode for sharing phase info with loved ones
- Gamification: streaks, milestones, monthly progress
- Community tips from other women in your phase
- Available in 9 languages

IRIS is a wellness tool, not a medical device. Insights are for personal awareness and should not replace professional medical advice.

### Keywords (100 chars, comma-separated)
```
wellness,period tracker,cycle,women's health,privacy,iris,menstrual,menopause,fertility,self-care
```

### Category
Primary: **Health & Fitness**
Secondary: **Lifestyle**

### Age Rating
**12+** (Infrequent/Mild Medical/Treatment Information)

### Copyright
`© 2026 Mojjo AB`

### Support URL
`https://iris-wellness.mojjo.se/support`

### Marketing URL
`https://iris-wellness.mojjo.se`

### Privacy Policy URL
`https://iris-eye-insights.lovable.app`

---

## Screenshot Strategy

### Required Sizes
- 6.7" (iPhone 15 Pro Max) — **Required**
- 6.5" (iPhone 14 Plus / 11 Pro Max) — **Required**
- 5.5" (iPhone 8 Plus) — **Required if supporting older devices**

### Recommended Screenshot Order (5-8 screenshots)
1. **Eye Scan in Action** — Camera viewfinder with iris analysis overlay. Caption: *"Your wellness, visible in your eyes"*
2. **Six Wellness Gauges** — Scan result screen with energy, stress, recovery gauges. Caption: *"6 key metrics in 10 seconds"*
3. **Insights Dashboard** — Trend charts with 30-day view. Caption: *"Track trends. Spot patterns."*
4. **Cycle Calendar** — Phase-colored calendar view. Caption: *"Know your cycle. Plan your life."*
5. **Daily Check-In** — Symptom logging screen. Caption: *"Your daily wellness ritual"*
6. **Privacy Badge** — Profile privacy section. Caption: *"On-device only. Your data stays yours."*
7. **Coaching Tips** — Home screen with phase-aware tips. Caption: *"Smart tips for every phase"*
8. **Doctor Report** — PDF preview. Caption: *"Share with your doctor"*

---

## Privacy Nutrition Labels (App Store Connect)

### Data Not Collected
- Financial Info
- Sensitive Info
- Contacts
- Browsing History
- Search History
- Identifiers (no IDFA)

### Data Collected (if user opts in to server sync)
| Data Type | Purpose | Linked to Identity |
|-----------|---------|-------------------|
| Health & Fitness (wellness scores) | App Functionality | No |
| Usage Data (analytics) | Analytics | No |
| User Content (check-in notes) | App Functionality | No |

### Data NOT Collected Even With Consent
- Photos/Videos (analyzed on-device, never stored or uploaded)
- Precise Location
- Biometric Data (iris images are discarded after analysis)

---

## Step-by-Step: Apple App Store Submission

### Phase 1: Apple Developer Account Setup
- [ ] **1.1** Ensure Apple Developer Program membership is active ($99/year) at [developer.apple.com](https://developer.apple.com)
- [ ] **1.2** Register bundle ID `se.mojjo.iris-wellness` in Certificates, Identifiers & Profiles
- [ ] **1.3** Enable HealthKit capability for the App ID
- [ ] **1.4** Enable Push Notifications capability for the App ID

### Phase 2: App Store Connect Configuration
- [ ] **2.1** Create new app in App Store Connect with name "IRIS - Women's Wellness"
- [ ] **2.2** Select bundle ID `se.mojjo.iris-wellness`
- [ ] **2.3** Set primary language: English (or Swedish if targeting Sweden first)
- [ ] **2.4** Set category: Health & Fitness (primary), Lifestyle (secondary)
- [ ] **2.5** Paste the description text above
- [ ] **2.6** Add keywords: `wellness,period tracker,cycle,women's health,privacy,iris,menstrual,menopause,fertility,self-care`
- [ ] **2.7** Set age rating: 12+
- [ ] **2.8** Add support URL, marketing URL, privacy policy URL
- [ ] **2.9** Upload app icon (1024×1024 PNG, no alpha, no rounded corners)

### Phase 3: Subscription Setup (App Store Connect + RevenueCat)
- [ ] **3.1** In App Store Connect → Subscriptions, create a Subscription Group named "IRIS Premium"
- [ ] **3.2** Create subscription product: "IRIS Monthly" (e.g., $4.99/month)
- [ ] **3.3** Create subscription product: "IRIS Annual" (e.g., $29.99/year)
- [ ] **3.4** Fill in subscription display name, description for each
- [ ] **3.5** If offering free trial, configure trial period (e.g., 7-day free trial)
- [ ] **3.6** In RevenueCat dashboard → create project → add iOS app with bundle ID
- [ ] **3.7** Add App Store Connect Shared Secret to RevenueCat
- [ ] **3.8** Create Entitlement "premium" in RevenueCat
- [ ] **3.9** Create Offerings with both monthly and annual packages
- [ ] **3.10** Map App Store subscription products to RevenueCat offerings
- [ ] **3.11** Set `EXPO_PUBLIC_REVENUECAT_API_KEY` env var in build config
- [ ] **3.12** Sandbox test: purchase → verify unlock → restore purchases

### Phase 4: Screenshots & Media
- [ ] **4.1** Run app on iPhone 15 Pro Max simulator or device
- [ ] **4.2** Capture 5-8 screenshots following the strategy above
- [ ] **4.3** Add captions/marketing text to screenshots (use Figma, Canva, or similar)
- [ ] **4.4** Upload to App Store Connect for each required device size
- [ ] **4.5** (Optional) Record 15-30 second app preview video

### Phase 5: Build & Upload
- [ ] **5.1** Set production env vars:
  - `EXPO_PUBLIC_RORK_API_BASE_URL` = production server URL
  - `EXPO_PUBLIC_REVENUECAT_API_KEY` = RevenueCat iOS API key
- [ ] **5.2** Run `eas build --platform ios --profile production` (or Rork production build)
- [ ] **5.3** Wait for build to complete
- [ ] **5.4** Upload .ipa to App Store Connect via Transporter or EAS Submit
- [ ] **5.5** Select the build in App Store Connect → version → build

### Phase 6: App Review Preparation
- [ ] **6.1** Fill in App Review Information:
  - Contact: your name, email, phone
  - Demo account: not needed (no login required for core functionality)
  - Notes for reviewer: "This app uses the camera for on-device iris analysis (wellness, not medical diagnosis). Photos are analyzed locally and immediately discarded. No photos are stored or transmitted."
- [ ] **6.2** Fill in Privacy Nutrition Labels (see table above)
- [ ] **6.3** Double-check: no placeholder text, no "test" or "TODO" in production
- [ ] **6.4** Ensure "Restore Purchases" button is accessible on paywall
- [ ] **6.5** Ensure "Delete Account" option exists in profile
- [ ] **6.6** Submit for review

### Phase 7: Post-Submission
- [ ] **7.1** Monitor App Review status (typically 24-48 hours)
- [ ] **7.2** If rejected, read rejection notes carefully — most common:
  - Guideline 5.1.1: Data collection needs clearer purpose
  - Guideline 3.1.1: In-app purchase issues
  - Guideline 2.1: Performance issues / crashes
- [ ] **7.3** Once approved, set release to "Manual" or "Automatic" after approval

---

## Step-by-Step: Google Play Store Submission

### Phase 1: Google Play Console Setup
- [ ] **1.1** Ensure Google Play Developer account is active ($25 one-time) at [play.google.com/console](https://play.google.com/console)
- [ ] **1.2** Create new app in Play Console
- [ ] **1.3** Set app name: "IRIS - Women's Wellness"
- [ ] **1.4** Set default language: English
- [ ] **1.5** Select: App (not Game), Free (with in-app purchases)

### Phase 2: Store Listing
- [ ] **2.1** Short description (80 chars): "Privacy-first iris scanning wellness tracker for every life stage."
- [ ] **2.2** Full description: use the same description as App Store (above)
- [ ] **2.3** Upload app icon (512×512 PNG)
- [ ] **2.4** Upload feature graphic (1024×500 PNG)
- [ ] **2.5** Upload phone screenshots (minimum 2, recommended 5-8)
- [ ] **2.6** Set category: Health & Fitness
- [ ] **2.7** Add tags: wellness, period tracker, cycle tracking, women's health
- [ ] **2.8** Set content rating (fill out the questionnaire — likely "Everyone")

### Phase 3: Android Subscription Setup
- [ ] **3.1** In Play Console → Monetization → Products → Subscriptions
- [ ] **3.2** Create "iris-monthly" subscription ($4.99/month)
- [ ] **3.3** Create "iris-annual" subscription ($29.99/year)
- [ ] **3.4** In RevenueCat dashboard, add Android app with package name `se.mojjo.iris_wellness`
- [ ] **3.5** Add Google Play service account credentials to RevenueCat
- [ ] **3.6** Map Google Play products to same RevenueCat offerings

### Phase 4: Privacy & Compliance
- [ ] **4.1** Data Safety section:
  - Camera: used for on-device analysis, data not collected
  - Health data: collected optionally, not shared with third parties
  - App activity: analytics collected, not linked to identity
- [ ] **4.2** Set privacy policy URL
- [ ] **4.3** Set up app deletion instructions (or explain in-app deletion)
- [ ] **4.4** Declare no ads

### Phase 5: Build & Upload
- [ ] **5.1** Run `eas build --platform android --profile production`
- [ ] **5.2** Upload .aab (Android App Bundle) to Play Console
- [ ] **5.3** Create a release in Production track (or start with Internal Testing → Closed Testing → Open Testing → Production)

### Phase 6: Review & Launch
- [ ] **6.1** Submit for review (Google review typically 1-7 days for new apps)
- [ ] **6.2** Common rejection reasons:
  - Metadata policy: description doesn't match app functionality
  - Permission policy: camera permission not explained clearly enough
  - Payment policy: subscription terms not visible enough
- [ ] **6.3** Once approved, set rollout percentage (start with 20%, ramp to 100%)

---

## Backend Deployment Checklist

- [ ] Deploy tRPC + Hono server to production host (Fly.io, Railway, Render, or VPS)
- [ ] Set environment variables:
  - `CORS_ORIGIN` = your production domain (not `*`)
  - `ADMIN_HASH_SUPER` = SHA-256 of your super admin password
  - `ADMIN_HASH_ANALYST` = SHA-256 of your analyst password
  - `ADMIN_HASH_VIEWER` = SHA-256 of your viewer password
- [ ] Ensure JSON persistence directory has write permissions
- [ ] Set up SSL/TLS (HTTPS required)
- [ ] Configure rate limiting on public endpoints
- [ ] Set up automated backups for persistence files (daily)
- [ ] Set up health check endpoint monitoring (UptimeRobot, Better Uptime, etc.)

---

## Post-Launch Monitoring

- [ ] Integrate Sentry for crash reporting (`npx @sentry/wizard@latest -i reactNative`)
- [ ] Monitor App Store / Play Store crash reports for first 72 hours
- [ ] Track analytics events (daily active users, scan completion rate, check-in rate)
- [ ] Prepare day-1 hotfix process: who can push an emergency update, turnaround time
- [ ] Respond to any App Store reviewer questions within 24 hours
- [ ] Monitor user reviews and respond to feedback

---

## Swedish Localization (Priority Market)

Since the primary market is Sweden:
- [ ] Add Swedish App Store metadata (description, keywords, screenshots with Swedish captions)
- [ ] Swedish keywords: `hälsa,menskalender,cykel,kvinnohälsa,integritet,iris,menstruation,klimakteriet,fertilitet,egenvård`
- [ ] Consider Swedish subtitle: `Iris-skanning för din hälsa`
- [ ] App is already translated to Swedish (sv locale complete)
