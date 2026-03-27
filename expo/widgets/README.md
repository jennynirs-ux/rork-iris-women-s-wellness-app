# IRIS iOS Home Screen Widget

This directory contains the implementation for B-009: iOS home screen widget support. The widget allows users to see their current cycle phase, cycle day, and today's recommended focus directly on their home screen without opening the app.

## Architecture

### Components

1. **`lib/widgetData.ts`** - Data layer for widget communication
   - Manages widget data storage in AsyncStorage and app group defaults
   - Provides `updateWidgetData()` function called after phase changes, scans, and check-ins
   - Handles data formatting and serialization

2. **`widgets/IrisWidget.tsx`** - React Native widget component
   - Renders the widget UI in small and medium sizes
   - Displays phase name with color indicator
   - Shows cycle day (e.g., "Day 14 of 28")
   - Displays today's recommended focus from coaching engine
   - Shows IRIS branding and last update timestamp

3. **`widgets/IrisWidgetExtension.swift`** - iOS native widget implementation
   - Swift/SwiftUI implementation for WidgetKit (iOS 16+)
   - Two widget sizes: small (2x2) and medium (4x4)
   - Reads data from app group UserDefaults
   - Updates on hourly schedule or when app updates data

4. **`widgets/widgetConfig.ts`** - Configuration and documentation
   - Widget configuration for EAS Build
   - App group identifier setup
   - Native implementation notes
   - Build and testing instructions

## Data Flow

```
User Action (scan/check-in/phase change)
    ↓
AppContext.tsx
    ↓
updateWidgetData() in lib/widgetData.ts
    ↓
AsyncStorage + App Group UserDefaults
    ↓
iOS Widget Extension reads from UserDefaults
    ↓
Widget displays on home screen/lock screen
```

## Integration

### In AppContext.tsx

The widget data is automatically updated whenever:
- Phase changes
- Cycle day changes
- Recommended focus changes
- After user completes onboarding

```typescript
// Added to AppContext.tsx
useEffect(() => {
  if (userProfile.hasCompletedOnboarding && enrichedPhaseInfo) {
    void updateWidgetData(
      currentPhase,
      enrichedPhaseInfo.cycleDay,
      enrichedPhaseInfo.totalCycleDays,
      todaySummary.recommendedFocus
    );
  }
}, [currentPhase, enrichedPhaseInfo, todaySummary.recommendedFocus, userProfile.hasCompletedOnboarding]);
```

## Shared Data Format

The widget reads/writes data in this JSON format stored in app group UserDefaults with key `iris_widget_data`:

```json
{
  "phaseName": "Follicular",
  "phaseColor": "#FFB627",
  "cycleDay": 14,
  "totalCycleDays": 28,
  "todaysFocus": "Focus on building energy and momentum",
  "lastUpdated": 1705324800000,
  "hasData": true
}
```

### Phase Colors

- **Menstrual**: `#EF6461` (Red)
- **Follicular**: `#FFB627` (Orange/Yellow)
- **Ovulation**: `#E89BA4` (Pink)
- **Luteal**: `#6366F1` (Indigo)

## Building the App with Widget Support

### Using EAS Build

```bash
eas build --platform ios
```

The build process will:
1. Detect the widget extension code
2. Create a new WidgetKit target
3. Configure app group entitlements
4. Sign both the app and widget extension
5. Create an iOS build with widget support

### Manual Setup (without EAS)

If building locally:

1. **Create Widget Target in Xcode**
   - File > New > Target
   - Choose "Widget Extension"
   - Name: `IrisWidgetExtension`
   - Bundle ID: `se.mojjo.iris-wellness.widgets`
   - Deployment Target: iOS 16.0+

2. **Add App Group Capability**
   - Both app and widget targets need the same app group identifier
   - Add capability: `group.se.mojjo.iris`

3. **Replace Widget Code**
   - Copy `IrisWidgetExtension.swift` into the widget target
   - Remove auto-generated placeholder code

4. **Configure Build Settings**
   - Ensure both targets have `SWIFT_VERSION` set to 5.0+
   - Verify `IPHONEOS_DEPLOYMENT_TARGET` is 16.0+

## Testing the Widget

### On Simulator

1. Run the IRIS app
2. Complete onboarding (or skip with test data)
3. Record at least one scan (to populate coaching tips)
4. Long press home screen → Add Widget
5. Search for "IRIS"
6. Add the widget (small or medium size)
7. Widget should display your current phase and cycle day

### On Device

Same steps as simulator. The widget will update automatically when you open the app and it updates the widget data.

## Widget Update Mechanism

The widget updates in two ways:

### 1. Automatic Update
- Scheduled timeline updates (every hour)
- Widget automatically refreshes when user views home screen
- Data is read from shared app group UserDefaults

### 2. App-Triggered Update
- When app updates data in UserDefaults, widget sees the new data
- Next time widget timeline is refreshed, it displays new data
- Not truly "live" but fast enough for typical use

### To Implement True Live Updates

Replace the `getTimeline` function in `IrisWidgetExtension.swift` with:

```swift
func getTimeline(in context: Context, completion: @escaping (Timeline<IrisWidgetEntry>) -> ()) {
    let currentDate = Date()
    let entry = loadWidgetData()

    // Update more frequently for live feel
    let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: currentDate) ?? currentDate.addingTimeInterval(900)

    let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
    completion(timeline)
}
```

Or use WidgetKit's `requestCacheReload()` from the app side (requires WidgetKit 2.0+).

## Troubleshooting

### Widget Shows "Loading..."

**Cause**: App group not configured or data not written yet

**Solution**:
1. Ensure app group entitlement is enabled in signing
2. Verify the app has completed onboarding
3. Check that at least one scan/check-in has been recorded
4. On simulator: restart the widget extension

### Widget Doesn't Update

**Cause**: Data not being written to shared app group UserDefaults

**Solution**:
1. Check `useEffect` in AppContext logs for errors
2. Verify `updateWidgetData()` is being called
3. On device: restart app and widget
4. Check app group identifier matches in all places: `group.se.mojjo.iris`

### Widget Doesn't Appear in Add Widget Menu

**Cause**: Widget extension not properly included in build

**Solution**:
1. Verify widget target is set to Deployment Target 16.0+
2. Ensure bundle ID is correct: `se.mojjo.iris-wellness.widgets`
3. Check WidgetKit is properly linked
4. Rebuild app from scratch

### App Crashes When Writing Widget Data

**Cause**: AsyncStorage or UserDefaults error

**Solution**:
1. Check device has enough free storage
2. Verify AsyncStorage is properly initialized
3. Check `lib/widgetData.ts` error logs
4. Ensure data being written is valid JSON and under size limits

## Future Enhancements

1. **Interactive Widgets**: Add buttons to log quick check-ins directly from widget
2. **Lock Screen Widgets**: iOS 16+ supports widgets on lock screen
3. **Widget Stacks**: Combine multiple IRIS widgets
4. **Deep Linking**: Tapping widget opens relevant app section
5. **Complications**: Add support for Apple Watch complications
6. **Live Activities**: Use iOS 16.1+ Live Activities for real-time updates

## Files Modified

- **`contexts/AppContext.tsx`**: Added import and `useEffect` to update widget data
- **`lib/widgetData.ts`**: New file - data layer for widget
- **`widgets/IrisWidget.tsx`**: New file - React widget component
- **`widgets/IrisWidgetExtension.swift`**: New file - iOS native widget
- **`widgets/widgetConfig.ts`**: New file - configuration and docs

## Dependencies

- iOS 16.0+ (for WidgetKit)
- React Native AsyncStorage (already in project)
- Swift 5.0+
- Xcode 14.0+

## Resources

- [Apple WidgetKit Documentation](https://developer.apple.com/documentation/widgetkit/)
- [iOS App Groups](https://developer.apple.com/documentation/foundation/userdefaults/1409488-init)
- [Expo Widget Package](https://github.com/gitn00b1337/expo-widgets)
- [EAS Build Documentation](https://docs.expo.dev/eas-update/introduction/)
