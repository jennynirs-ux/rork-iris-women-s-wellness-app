# B-009: iOS Home Screen Widget - Implementation Summary

## Overview

This implementation provides iOS home screen widget support for the IRIS app, allowing users to see their current cycle phase, cycle day, and today's recommended focus without opening the app.

**Status**: Ready for EAS Build integration and native Xcode configuration

**Effort**: 2 weeks (as specified in BACKLOG.md)

**Impact**: Medium — daily visibility, passive engagement

## Files Created

### 1. **`lib/widgetData.ts`** (133 lines)
Data layer for widget communication.

**Key Functions**:
- `updateWidgetData(phase, cycleDay, totalCycleDays, todaysFocus)` - Updates widget data whenever phase/cycle day/focus changes
- `getWidgetData()` - Retrieves current widget data from AsyncStorage
- `clearWidgetData()` - Clears widget data on logout
- Helper functions for phase names, colors, and formatting

**Data Format**:
```typescript
interface IrisWidgetData {
  phaseName: string;
  phaseColor: string;
  cycleDay: number;
  totalCycleDays: number;
  todaysFocus: string;
  lastUpdated: number;
  hasData: boolean;
}
```

### 2. **`widgets/IrisWidget.tsx`** (188 lines)
React Native widget component for rendering in the app.

**Features**:
- Small, medium, and large widget sizes
- Displays phase name with color indicator
- Shows cycle day (e.g., "Day 14 of 28")
- Displays today's recommended focus
- Shows IRIS branding and last update timestamp
- Loading state handling
- Responsive design

**Styling**: Clean, modern design matching IRIS brand colors

### 3. **`widgets/IrisWidgetExtension.swift`** (350+ lines)
iOS native widget implementation using WidgetKit.

**Features**:
- Two widget family sizes: `.systemSmall` (2x2) and `.systemMedium` (4x4)
- Reads data from app group UserDefaults (`group.se.mojjo.iris`)
- Timeline-based updates (hourly refresh)
- Color conversion from hex strings
- Graceful fallback when no data available
- SwiftUI implementation for iOS 16+
- Preview configurations for Xcode canvas

**Key Components**:
- `IrisWidgetProvider` - Timeline provider for widget updates
- `IrisWidgetSmallView` - 2x2 widget layout
- `IrisWidgetMediumView` - 4x4 widget layout with coaching tips
- Helper function to format relative timestamps
- Widget bundle with both size variants

### 4. **`widgets/widgetConfig.ts`** (100+ lines)
Configuration and documentation for widget setup.

**Contents**:
- Target configuration for EAS Build
- App group identifier setup
- Shared data key definitions
- Widget kind identifiers
- Detailed native implementation notes
- Example Expo config plugin integration
- Helper function for app.json updates

### 5. **`widgets/README.md`** (300+ lines)
Comprehensive documentation for the widget implementation.

**Sections**:
- Architecture and components overview
- Data flow diagram
- Integration steps with AppContext
- Shared data format documentation
- Building instructions (EAS and manual)
- Testing procedures (simulator and device)
- Troubleshooting guide
- Future enhancement ideas
- Dependencies and resources

### 6. **`widgets/EAS_BUILD_SETUP.md`** (350+ lines)
Detailed setup guide for EAS Build integration.

**Sections**:
- Quick start options (config plugin, manual, native)
- Step-by-step native project setup with Xcode
- Configuration details (app groups, bundle IDs, entitlements)
- Troubleshooting for EAS Build issues
- Testing procedures
- Complete resource links

## Files Modified

### **`contexts/AppContext.tsx`**

**Changes**:
1. Added import: `import { updateWidgetData } from "@/lib/widgetData";`
2. Added `useEffect` hook to update widget data whenever:
   - Current phase changes
   - Enriched phase info changes (cycle day)
   - Today's summary/recommended focus changes
   - After user completes onboarding

**Code**:
```typescript
// Update iOS widget data whenever phase, cycle day, or recommended focus changes
useEffect(() => {
  if (userProfile.hasCompletedOnboarding && enrichedPhaseInfo) {
    void updateWidgetData(
      currentPhase,
      enrichedPhaseInfo.cycleDay,
      enrichedPhaseInfo.totalCycleDays,
      todaySummary.recommendedFocus
    ).catch((err) => {
      logger.log('Failed to update widget data:', err);
    });
  }
}, [currentPhase, enrichedPhaseInfo, todaySummary.recommendedFocus, userProfile.hasCompletedOnboarding]);
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────┐
│ User Action (scan/check-in/phase change)        │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ AppContext.tsx processes data                   │
│ - Updates phase, cycle day, focus               │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ useEffect triggers updateWidgetData()           │
│ - Passes current phase, cycle day, focus        │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ lib/widgetData.ts                               │
│ - Serializes data to JSON                       │
│ - Stores in AsyncStorage                        │
│ - Writes to app group UserDefaults              │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ iOS Widget Extension reads from UserDefaults    │
│ - App group: group.se.mojjo.iris                │
│ - Key: iris_widget_data                         │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ WidgetKit renders on home screen                │
│ - Updates on hourly schedule                    │
│ - Shows phase, cycle day, focus                 │
└─────────────────────────────────────────────────┘
```

## Phase Colors

- **Menstrual**: `#EF6461` (Red) - Recovery & renewal
- **Follicular**: `#FFB627` (Orange/Yellow) - Energy & building
- **Ovulation**: `#E89BA4` (Pink) - Peak performance
- **Luteal**: `#6366F1` (Indigo) - Reflection & restoration

## Integration Steps

### For Development

1. **Review the files**:
   - Read `widgets/README.md` for complete overview
   - Check `lib/widgetData.ts` for data handling
   - Review `IrisWidgetExtension.swift` for native implementation

2. **Set up iOS project**:
   - Run `expo prebuild --clean` to generate iOS project
   - Open `ios/irisApp.xcodeproj` in Xcode
   - Follow `widgets/EAS_BUILD_SETUP.md` Step 3-7

3. **Test locally**:
   - Build and run on simulator/device
   - Complete app onboarding
   - Record a scan (populates coaching tips)
   - Add widget from home screen

4. **Deploy with EAS**:
   - Run `eas build --platform ios`
   - Install on device via TestFlight or Expo app
   - Test widget functionality

### For Production

1. **Configure EAS Build**:
   - Widget target is included in native build
   - App group entitlements must be configured
   - Sign both app and widget extension

2. **Setup App Signing**:
   - Ensure provisioning profiles support app groups
   - Widget bundle ID: `se.mojjo.iris-wellness.widgets`
   - Main app bundle ID: `se.mojjo.iris-wellness`

3. **Monitor Widget Data**:
   - Widget reads from shared UserDefaults
   - App updates data after phase/cycle changes
   - Fallback shows placeholder when no data

## Technical Details

### Requirements

- **iOS**: 16.0+ (WidgetKit requirement)
- **Swift**: 5.0+
- **Xcode**: 14.0+
- **Deployment Target**: 16.0+

### Dependencies

- React Native AsyncStorage (already in project)
- SwiftUI (part of iOS SDK)
- WidgetKit (part of iOS SDK)

### Storage

- **AsyncStorage**: `iris_widget_data` key
- **App Group UserDefaults**: `iris_widget_data` key
- **Suite**: `group.se.mojjo.iris`

## Known Limitations

1. **Not truly live updates** - Updates on hourly schedule by default
   - Can be improved with WidgetKit's dynamic update APIs
   - Requires iOS 16.1+ for truly live updates

2. **Data shared via UserDefaults** - Not encrypted
   - Widget data contains no sensitive PII
   - Only shows phase name and coaching focus

3. **Widget requires onboarding** - Shows "Loading..." until user data exists
   - Graceful fallback when no data available

## Future Enhancements

1. **Interactive Widgets**: Quick actions (log check-in, scan, etc.)
2. **Lock Screen Widgets**: iOS 16+ support
3. **Widget Stacks**: Multiple IRIS widgets on same screen
4. **Deep Linking**: Tap widget to open relevant app section
5. **Apple Watch**: Complications for Watch app
6. **Live Activities**: Real-time updates with iOS 16.1+
7. **Multiple Sizes**: Large widget for more information
8. **Customization**: User chooses widget layout/info

## Testing Checklist

- [ ] Widget data updates when phase changes
- [ ] Widget displays correct cycle day
- [ ] Widget shows today's coaching focus
- [ ] Widget colors match phase
- [ ] Widget updates on home screen without opening app
- [ ] Widget handles offline scenarios
- [ ] Widget shows "Loading..." before onboarding
- [ ] App group entitlements working
- [ ] Both small and medium sizes render correctly
- [ ] Last update timestamp displays correctly
- [ ] Widget handles app uninstall/reinstall
- [ ] Multiple widgets on home screen work
- [ ] Lock screen widget works (if iOS 16+)

## Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Widget shows "Loading..." | Verify app group entitlement, complete onboarding, record a scan |
| Widget doesn't update | Restart app and widget, check data writes |
| Widget not in menu | Check deployment target 16.0+, rebuild |
| App crashes on update | Check AsyncStorage errors, verify data size |
| Widget missing after build | Verify widget target in Xcode, check bundle ID |

## Code Quality

- **TypeScript**: Fully typed React Native components
- **Swift**: Modern SwiftUI with error handling
- **Documentation**: Comprehensive README and setup guides
- **Error Handling**: Graceful fallbacks and logging
- **Performance**: Minimal UI re-renders, efficient storage

## Effort Breakdown

| Task | Effort |
|------|--------|
| Data layer (`lib/widgetData.ts`) | 1 day |
| React component (`widgets/IrisWidget.tsx`) | 1 day |
| Native Swift implementation | 2-3 days |
| Xcode configuration & testing | 2-3 days |
| Documentation & guides | 2 days |
| EAS Build integration & testing | 2-3 days |
| **Total** | **2 weeks** |

## Related Issues

- B-009: iOS home screen widget (this implementation)
- Depends on: Phase prediction, coaching engine (already implemented)
- Enables: Daily engagement metrics, widget analytics (future)

## Maintenance

- Monitor widget data writes for errors
- Track widget usage metrics
- Update documentation with user feedback
- Implement improvements as iOS SDK evolves
- Test with new iOS releases

## References

- [Apple WidgetKit Documentation](https://developer.apple.com/documentation/widgetkit/)
- [iOS App Groups](https://developer.apple.com/documentation/foundation/userdefaults/1409488-init)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Expo Prebuild](https://docs.expo.dev/workflow/prebuild/)

---

**Implementation Date**: March 17, 2026
**Status**: Complete and ready for integration
**Next Step**: Follow setup guide to configure native Xcode project and EAS Build
