# IRIS — App Store & Google Play Screenshot Strategy

**Goal:** 5 screenshots per device size that tell the story of IRIS in 3 seconds
of swiping. Convert curiosity into installs.

## Required device sizes

### iOS (App Store Connect)

You need **at least one set**. Apple auto-resizes if you only provide the
biggest, but providing the largest two is best for sharpness.

| Display | Resolution | Devices | Required? |
|---|---|---|---|
| **6.9"** | 1320 × 2868 (portrait) | iPhone 17 Pro Max | Yes |
| **6.7"** | 1290 × 2796 | iPhone 14 Pro Max, 15 Plus | Yes (auto-resized from 6.9 if you skip) |
| **6.5"** | 1242 × 2688 or 1284 × 2778 | iPhone 11 Pro Max | Optional |
| **5.5"** | 1242 × 2208 | iPhone 8 Plus | Required only for "iPad" submissions or if you support older OS |

### Android (Google Play Console)

| Type | Resolution | Required? |
|---|---|---|
| **Phone** | 1080 × 1920 minimum, 16:9 or 9:16 | Yes (min 2, max 8) |
| **7" tablet** | optional | No (you set `supportsTablet: false`) |
| **Feature graphic** | 1024 × 500 | Yes (banner) |
| **App icon** | 512 × 512 | Yes |

You can produce all of the above from a single 1320×2868 master per slide,
then export resized variants.

## The 5 slides

Each slide has: a hero shot of the app + a short marketing line at top.
Marketing line max ~6 words, large readable font, IRIS-pink accent.

### Slide 1 — "Your wellness, day by day"

**Screen captured:** Home tab with today's phase card, daily check-in summary,
and one or two wellness scores visible.

**Why first:** establishes the daily-rhythm value prop in 1 second.

**Capture instructions:**
- Use a primed test account: cycle day 14 (follicular), 7-day check-in streak,
  one scan from this morning showing Energy 7/10
- Light mode (App Store reviewers default light)
- Status bar full battery, full signal, 9:41 (Apple's standard)

### Slide 2 — "A 5-second eye scan, on-device"

**Screen captured:** the QuickScanModal mid-countdown — eye oval visible,
"3" countdown big in the center, gentle pulse animation visible.

**Why second:** the scan is the differentiator. Show it before they swipe away.

**Capture instructions:**
- Open Profile → tap version 5x → admin not needed; trigger scan from Home
- Pause the countdown at "3" using simulator slow motion (Cmd+T) to capture
- Crop overlay text: **"On-device scan, photo never stored"**

### Slide 3 — "Patterns across your cycle"

**Screen captured:** Insights tab with the Wellness Aggregates chart
populated with 30 days of data.

**Why third:** shows depth without overwhelming. Insights = retention hook.

**Capture instructions:**
- Need 30 days of seeded scans (see DEMO_DATA.md for a script)
- Show the line chart for Energy with phase backgrounds visible
- Include the Top 5 Symptoms section if it fits

### Slide 4 — "All the phases, all the stages"

**Screen captured:** Calendar tab full month view with phase colors.

**Why fourth:** signals breadth. Visual proof IRIS supports the whole cycle
(menstrual / follicular / ovulation / luteal), not just period start.

**Capture instructions:**
- Calendar showing current month with at least 2 prior periods marked
- Phase legend at the bottom of frame

### Slide 5 — "Private by design"

**Screen captured:** A custom screen or a clean shot of the Privacy section
of Profile/Settings, with the line "Your data stays on your device" in
focus.

**Why fifth:** privacy is a real differentiator vs Flo / Clue post-Roe.
Closes the funnel with trust.

**Capture instructions:**
- Profile → scroll to Data & Privacy section
- Or build a simple text-only frame with: "Your cycle data stays on your
  device. We never sell it."

## Layout template per slide

```
┌─────────────────────────────────────┐
│   [Marketing line top, 80pt        │
│   IRIS-pink, max 2 lines]          │
│                                     │
│  ┌──────────────────────────┐      │
│  │                           │      │
│  │   App screenshot crop     │      │
│  │   (no status bar dupli-   │      │
│  │   cation, real iPhone     │      │
│  │   frame OR clean crop)    │      │
│  │                           │      │
│  └──────────────────────────┘      │
│                                     │
│       [Optional secondary line]     │
└─────────────────────────────────────┘
```

## Recommended tools

| Need | Tool |
|---|---|
| Capture from iOS Simulator | Xcode → Device → Save Screen |
| Add device frame + marketing text | **Mockuuups Studio** (~$20) or **Figma** (free) |
| Resize to all required sizes | **Fastlane snapshot** + frameit, or batch in Figma |
| Compose feature graphic (Play 1024×500) | Figma |

## Capture workflow (using Expo + simulator)

```bash
# 1. Build dev client targeted at deployed backend
cd expo
bunx eas build --platform ios --profile preview

# 2. Boot simulator with iPhone 15 Pro Max
xcrun simctl boot "iPhone 15 Pro Max"
open -a Simulator

# 3. Install the .ipa on the simulator (drag and drop)

# 4. Set status bar to clean state
xcrun simctl status_bar booted override \
  --time "9:41" --batteryState charged --batteryLevel 100 --cellularBars 4

# 5. Use the demo data setup (see DEMO_DATA.md)

# 6. Capture each frame
xcrun simctl io booted screenshot ~/Desktop/iris_slide1.png
# repeat for each frame

# 7. Compose in Figma using a 1320×2868 frame template
```

## Localization

Apple lets you upload **localized screenshots per language** for the App
Store. For Phase 1, ship English + Swedish only. Add other 7 languages
post-launch as the app picks up traction in those markets.

## Final checklist before upload

- [ ] No personal data visible (real names, real emails, real birthdays)
- [ ] No competitor logos / no "Flo / Clue" comparisons (Apple rejects)
- [ ] No medical claims in marketing copy ("track" not "diagnose")
- [ ] Status bar shows 9:41, full battery, full signal
- [ ] No notifications or alerts visible
- [ ] Files saved as PNG, sRGB color space, < 8 MB each
- [ ] All 5 frames feel like one consistent visual story
