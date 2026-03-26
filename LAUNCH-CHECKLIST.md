# IRIS Launch Checklist

## 1. Code Quality & Stability

### TypeScript & Lint
- [ ] `./node_modules/.bin/tsc --noEmit` passes with zero errors
- [ ] `bunx expo lint` passes clean
- [ ] No `any` types in critical paths (eyeAnalysis, phasePredictor, AppContext)
- [ ] All 9 language blocks have identical key sets in translations.ts

### Error Handling
- [ ] All tRPC calls wrapped in try/catch or error boundaries
- [ ] `ErrorBoundary` component wraps all tab screens
- [ ] Network failures show offline banner (useNetworkStatus hook)
- [ ] Camera permission denial handled gracefully in scan flow
- [ ] AsyncStorage read failures have fallback defaults

### Crash Prevention
- [ ] No `window.addEventListener` calls without typeof guard
- [ ] No unguarded `.length` on potentially undefined arrays
- [ ] All date parsing handles invalid/null dates
- [ ] Phase calculation never returns undefined
- [ ] Scan analysis handles camera errors without crash

### Performance
- [ ] Large lists use FlatList (not ScrollView with .map())
- [ ] Heavy computations (coaching engine, phase predictor) are memoized
- [ ] Images use expo-image (not React Native Image)
- [ ] No unnecessary re-renders in AppContext consumers

## 2. Testing

### Manual Flow Testing
- [ ] Fresh install → onboarding → first scan → results → home
- [ ] Daily scan flow (camera → analysis → results → insights update)
- [ ] Daily check-in flow (all symptom types including menopause)
- [ ] Calendar: period logging, phase display, prediction accuracy
- [ ] Profile: all settings toggles work (language, notifications, data consent, HealthKit)
- [ ] Paywall: subscription flow (sandbox testing with RevenueCat)
- [ ] Admin: login → dashboard → data views → CSV export
- [ ] Doctor PDF export generates and shares correctly
- [ ] Referral code: generate → share → redeem
- [ ] Phase override in calendar works and propagates to all tabs
- [ ] Offline mode: app functions without network, syncs when back online

### Edge Cases
- [ ] Brand new user with no data (no scans, no check-ins)
- [ ] User with 90+ days of scan history (chart performance)
- [ ] User who skips onboarding scan
- [ ] User who denies camera permission
- [ ] User who switches language mid-session
- [ ] User in menopause life stage (hot flash/VMS features visible)
- [ ] User who toggles data consent off then on
- [ ] App backgrounded during scan
- [ ] Rapid successive scans
- [ ] Very long cycle (45+ days) and very short cycle (21 days)

### Device Testing
- [ ] iPhone SE (small screen)
- [ ] iPhone 15 Pro Max (large screen)
- [ ] iPad (if supporting tablets)
- [ ] iOS 16 minimum
- [ ] iOS 17+
- [ ] Dark mode appearance

## 3. App Store Submission

### App Store Connect Setup
- [ ] App name: IRIS - Women's Wellness
- [ ] Bundle ID registered
- [ ] App icon (1024x1024) uploaded
- [ ] Screenshots for all required device sizes (6.7", 6.5", 5.5")
- [ ] App preview video (optional but recommended)

### Metadata
- [ ] App description (emphasize privacy, eye scanning, on-device processing)
- [ ] Keywords optimized (wellness, period tracker, cycle, women's health, privacy)
- [ ] Category: Health & Fitness
- [ ] Age rating: 12+ (health data)
- [ ] Copyright: © 2026 IRIS
- [ ] Support URL
- [ ] Marketing URL
- [ ] Privacy policy URL: https://iris-eye-insights.lovable.app

### App Review Compliance
- [ ] HealthKit usage description accurate and specific
- [ ] Camera usage description explains iris scanning purpose
- [ ] NSPhotoLibraryUsageDescription NOT requesting unnecessary photo access
- [ ] No references to "medical diagnosis" (iridology is wellness, not medical)
- [ ] Subscription terms clearly visible before purchase
- [ ] Restore purchases button accessible
- [ ] Account deletion option available (App Store requirement since 2022)
- [ ] Data consent toggle is opt-in (not pre-checked)
- [ ] Privacy nutrition labels accurately filled in App Store Connect
- [ ] No placeholder or test content in production build

### Privacy & Legal
- [ ] Privacy policy covers: data collected, on-device processing, optional server sync
- [ ] Terms of service accessible from app
- [ ] GDPR: data consent is opt-in, deletion possible
- [ ] No personal health data sent to server without consent
- [ ] Admin credentials not in client bundle (verified: T-001 done)
- [ ] No hardcoded API keys or secrets in source

### RevenueCat / Subscriptions
- [ ] Products created in App Store Connect
- [ ] Products configured in RevenueCat dashboard
- [ ] Sandbox testing passes (purchase → unlock → restore)
- [ ] Subscription management link works
- [ ] Free trial period configured correctly (if applicable)
- [ ] Paywall copy doesn't make medical claims

## 4. Build & Deploy

### EAS / Rork Build
- [ ] `bun install` succeeds without errors
- [ ] Production build compiles (EAS Build or Rork)
- [ ] app.json version and buildNumber incremented
- [ ] Splash screen displays correctly
- [ ] App icon renders on device
- [ ] No development-only code in production (console.logs stripped)
- [ ] Environment variables set for production (API URLs, RevenueCat keys)

### Backend
- [ ] Server deployed and accessible
- [ ] JSON persistence directory has write permissions on server
- [ ] Admin default credentials changed from defaults
- [ ] CORS configured for production domain
- [ ] Rate limiting active on community/analytics endpoints
- [ ] Data backup strategy for persistence files

### Post-Launch Monitoring
- [ ] Crash reporting enabled (Sentry or similar)
- [ ] Analytics events firing correctly
- [ ] Server health monitoring
- [ ] App Store review response plan ready
- [ ] Day-1 hotfix process defined (who can push, how fast)

## 5. Marketing & Launch

### App Store Optimization
- [ ] Screenshots highlight: eye scan, insights dashboard, phase tracking, privacy badge
- [ ] First screenshot should show the unique eye scan feature
- [ ] Description leads with privacy angle ("Your data never leaves your device")
- [ ] Localized metadata for Swedish market (primary) and English

### Launch Day
- [ ] Soft launch to TestFlight beta testers first
- [ ] Monitor crash reports for first 24 hours
- [ ] Check App Store review queue time (typically 24-48 hours)
- [ ] Social media posts prepared
- [ ] Press kit ready (if doing PR)
