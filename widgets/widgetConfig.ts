/**
 * Widget Configuration for Expo Build
 *
 * This file contains the configuration needed to set up the iOS widget extension
 * when building with EAS Build or Expo prebuild.
 *
 * To integrate:
 * 1. Add this configuration plugin to app.json
 * 2. Run: eas build --platform ios (or expo prebuild)
 *
 * The native Swift widget extension code (IrisWidgetExtension.swift) will be
 * included in the build and compiled as a separate target.
 */

export const irisWidgetConfig = {
  /**
   * Widget Target Configuration for EAS Build
   * This would be used in a custom Expo config plugin
   */
  targetConfig: {
    name: "IrisWidgetExtension",
    bundleIdentifier: "se.mojjo.iris-wellness.widgets",
    deploymentTarget: "16.0", // iOS 16+ for WidgetKit
    productType: "com.apple.product-type.app-extension",
    productName: "IrisWidgetExtension",
    infoPlist: {
      NSExtensionPointIdentifier: "com.apple.widgetkit-extension",
    },
  },

  /**
   * App Group Configuration
   * The app and widget must share an app group to exchange data
   */
  appGroupIdentifier: "group.se.mojjo.iris",

  /**
   * Widget Kinds
   * These match the kind strings in IrisWidgetExtension.swift
   */
  widgetKinds: [
    "se.mojjo.iris.widget.small",
    "se.mojjo.iris.widget.medium",
  ],

  /**
   * Shared Data Key
   * The app writes widget data to this key in UserDefaults (app group)
   * The widget reads from the same location
   */
  sharedDataKey: "iris_widget_data",

  /**
   * Documentation for native implementation
   */
  nativeImplementationNotes: `
# iOS Widget Implementation Notes

## Architecture
- The main app writes cycle data to UserDefaults with suite name "group.se.mojjo.iris"
- The widget extension reads from the same UserDefaults
- Data is updated whenever: phase changes, new scan recorded, new check-in recorded

## Data Structure
The widget data is stored as JSON in UserDefaults:
{
  "phaseName": "Follicular",
  "phaseColor": "#FFB627",
  "cycleDay": 14,
  "totalCycleDays": 28,
  "todaysFocus": "Focus on building energy and momentum",
  "lastUpdated": 1705324800000,
  "hasData": true
}

## Widget Targets
Two targets are created:
1. IrisSmallWidget (system.small size - 2x2 lock screen)
2. IrisMediumWidget (system.medium size - 4x4 home screen)

## Building with EAS
To build with widget support:
\`\`\`
eas build --platform ios
\`\`\`

The build process will:
1. Create a new widget extension target
2. Include IrisWidgetExtension.swift
3. Configure the app group entitlement
4. Code sign both the main app and widget

## Manual Setup (if not using EAS)
1. In Xcode, create a new WidgetKit Extension target
2. Set bundle ID to "se.mojjo.iris-wellness.widgets"
3. Add app group entitlement "group.se.mojjo.iris"
4. Replace the generated WidgetKit swift file with IrisWidgetExtension.swift
5. Configure the main app with the same app group entitlement

## Testing
To test the widget:
1. Run the app on a device/simulator
2. Enter some cycle data (go through onboarding)
3. Record a scan to populate coaching tips
4. Long press home screen > Add Widget
5. Search for "IRIS" and add the widget
6. Widget should show your current phase and cycle day

## Live Updates
Currently configured for hourly updates. To implement live updates:
1. Use WidgetKit's WidgetKit.requestCacheReload()
2. Or set a shorter timeline policy (e.g., 15 minutes)
3. User will see the widget update when they view the home screen

## Troubleshooting
- If widget shows "Loading...", check that app group entitlement is enabled
- Ensure the app has recorded at least one check-in or scan
- Check console logs for UserDefaults access errors
- On simulator, widget may take longer to load initially
  `,
};

/**
 * Expo Config Plugin Integration Example
 *
 * This would be used in app.json or app.config.ts to configure
 * the widget extension during prebuild:
 *
 * In app.json:
 * ```json
 * {
 *   "expo": {
 *     "plugins": [
 *       ["iris-widget-plugin"]
 *     ]
 *   }
 * }
 * ```
 *
 * Or with custom configuration:
 * ```json
 * {
 *   "expo": {
 *     "plugins": [
 *       [
 *         "iris-widget-plugin",
 *         {
 *           "appGroupIdentifier": "group.se.mojjo.iris",
 *           "deploymentTarget": "16.0"
 *         }
 *       ]
 *     ]
 *   }
 * }
 * ```
 */

/**
 * Helper function to update app.json programmatically
 * Usage:
 * ```typescript
 * import { updateAppJsonForWidget } from "@/widgets/widgetConfig";
 * updateAppJsonForWidget();
 * ```
 */
export async function updateAppJsonForWidget() {
  console.log("To enable the widget, add the following to app.json:");
  console.log(JSON.stringify(irisWidgetConfig, null, 2));
}
