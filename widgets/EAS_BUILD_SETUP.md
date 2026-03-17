# EAS Build Setup for iOS Widget Extension

This guide explains how to configure EAS Build to include the iOS widget extension in your build.

## Quick Start

### Option 1: Using Expo Config Plugin (Recommended)

If you have access to create an Expo config plugin, use this approach for automated setup.

1. Create a new config plugin file at `plugins/withIrisWidget.ts`:

```typescript
import { withXcodeProject, ConfigPlugin, XcodeProject } from '@expo/config-plugins';
import path from 'path';
import fs from 'fs';

const withIrisWidget: ConfigPlugin = (config) => {
  return withXcodeProject(config, async (config) => {
    const project = config.modResults;
    const widgetExtensionPath = path.join(config.modRequest.projectRoot, 'widgets/IrisWidgetExtension.swift');

    // This is a simplified example - full implementation would:
    // 1. Create widget target
    // 2. Add app group entitlement
    // 3. Include Swift code

    return config;
  });
};

export default withIrisWidget;
```

2. Update `app.json`:

```json
{
  "expo": {
    "plugins": [
      "./plugins/withIrisWidget"
    ]
  }
}
```

3. Run:

```bash
eas build --platform ios
```

### Option 2: Manual Configuration for EAS Build

If not using a config plugin, you can create the widget target manually:

1. **Create `.eas/build/ios_widget_setup.sh`** in your project:

```bash
#!/bin/bash
set -e

# This script runs during the iOS build to set up the widget extension
# It's called by EAS Build via the pre-build hook

PROJECT_DIR="$1"
XCODEPROJ="${PROJECT_DIR}/ios/irisApp.xcodeproj"
WIDGET_SOURCE="${PROJECT_DIR}/widgets/IrisWidgetExtension.swift"

echo "Setting up iOS widget extension..."

# The actual implementation would:
# 1. Create the widget target using xcodebuild
# 2. Copy the Swift widget code
# 3. Configure entitlements
# 4. Link resources

# For now, this is a placeholder - full implementation requires
# xcodebuild or custom Xcode automation
```

2. **Configure in `app.json`** (if you have EAS CLI configured):

```json
{
  "expo": {
    "ios": {
      "buildNumber": "1"
    }
  },
  "eas": {
    "build": {
      "experimental": {
        "ios": {
          "useFrameworksScript": true
        }
      }
    }
  }
}
```

### Option 3: Native Project Setup (Recommended for Now)

For the most reliable approach right now, manually add the widget to your native iOS project:

#### Step 1: Generate iOS Project

```bash
expo prebuild --clean
```

This creates the `ios/` directory with your Xcode project.

#### Step 2: Open in Xcode

```bash
open ios/irisApp.xcodeproj
```

#### Step 3: Create Widget Extension Target

1. In Xcode, go to **File → New → Target**
2. Choose **Widget Extension** (under iOS)
3. Configure:
   - **Product Name**: `IrisWidgetExtension`
   - **Bundle Identifier**: `se.mojjo.iris-wellness.widgets`
   - **Language**: Swift
   - **Include Configuration Intent**: No (for now)
4. Click **Finish**
5. When prompted to activate, choose **Activate**

#### Step 4: Add App Group Capability

For both **irisApp** and **IrisWidgetExtension** targets:

1. Select the target
2. Go to **Signing & Capabilities**
3. Click **+ Capability**
4. Search for "App Groups"
5. Enter: `group.se.mojjo.iris`

#### Step 5: Replace Widget Code

1. In Xcode, find `IrisWidgetExtension.swift` (in the IrisWidgetExtension folder)
2. Delete the placeholder code
3. Copy the content from `widgets/IrisWidgetExtension.swift` in your React Native project
4. Paste it into the Xcode file

#### Step 6: Verify Build Settings

Select the **IrisWidgetExtension** target:
1. Go to **Build Settings**
2. Verify:
   - **iOS Deployment Target**: 16.0 or higher
   - **Swift Language Version**: 5.0 or higher
   - **Product Bundle Identifier**: `se.mojjo.iris-wellness.widgets`

#### Step 7: Build and Test

```bash
# Build via Xcode or CLI
xcodebuild -workspace ios/irisApp.xcworkspace -scheme irisApp -configuration Release

# Or use EAS
eas build --platform ios --local
```

## Configuration Details

### App Group Identifier

The app group must match in three places:

1. **Main App Target**: `Signing & Capabilities` → App Groups
2. **Widget Extension Target**: `Signing & Capabilities` → App Groups
3. **widgetData.ts**: (hardcoded as `group.se.mojjo.iris`)

```swift
// In IrisWidgetExtension.swift
let defaults = UserDefaults(suiteName: "group.se.mojjo.iris")
```

### Bundle Identifiers

```
Main App:      se.mojjo.iris-wellness
Widget:        se.mojjo.iris-wellness.widgets
```

### Entitlements

Both targets need `.entitlements` files with:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>com.apple.security.application-groups</key>
  <array>
    <string>group.se.mojjo.iris</string>
  </array>
</dict>
</plist>
```

## Troubleshooting EAS Build

### Widget Target Not Included

**Problem**: Built app works, but widget isn't available

**Solution**:
1. Verify `IrisWidgetExtension` target exists in Xcode
2. Check target dependencies (main app should list widget)
3. Verify bundle identifier matches expectations
4. Check build log for widget compilation errors

```bash
eas build --platform ios --local --verbose
```

### Code Signing Error

**Problem**: "Code signing error" during build

**Solution**:
1. Ensure app group entitlement is added to both targets
2. Verify provisioning profile includes the widget extension
3. Check bundle identifier matches signing certificate

```bash
eas credentials status
```

### Module Not Found

**Problem**: Build fails with "Cannot find module"

**Solution**:
1. Verify all files are committed to git
2. Check that `widgets/IrisWidgetExtension.swift` is in correct location
3. Ensure file paths are correct in build configuration

### App Group Not Accessible

**Problem**: Widget shows "Loading..." or errors accessing data

**Solution**:
1. Verify app group string matches everywhere (including in code)
2. Check that main app successfully writes to UserDefaults
3. On device: Force stop both app and widget, restart
4. Check device storage - may need to clear space

## Testing with EAS Build

### Local Build

Test locally before pushing to EAS:

```bash
eas build --platform ios --local
```

### EAS Builds

Once confident, push to EAS:

```bash
eas build --platform ios
```

Monitor build progress:

```bash
eas build --status
```

Install on device:

```bash
eas build:view
# Copy the build URL and use Expo app or TestFlight to install
```

## Next Steps

1. **Generate iOS project**: `expo prebuild --clean`
2. **Open in Xcode**: `open ios/irisApp.xcodeproj`
3. **Create widget extension target** (see Step 3 above)
4. **Add app group capability** to both targets
5. **Replace widget code** with `IrisWidgetExtension.swift` content
6. **Build locally**: `eas build --platform ios --local`
7. **Test on simulator/device**
8. **Push to EAS**: `eas build --platform ios`

## Resources

- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Expo Prebuild](https://docs.expo.dev/workflow/prebuild/)
- [Apple WidgetKit](https://developer.apple.com/documentation/widgetkit/)
- [App Groups](https://developer.apple.com/documentation/foundation/userdefaults/1409488-init)
- [Code Signing Guide](https://docs.expo.dev/build-reference/ios-builds/)

## Support

If you encounter issues:

1. Check Xcode build logs
2. Review `eas build logs` output
3. Verify all identifiers match
4. Check Apple Developer account has correct provisioning profiles
5. Consult Expo documentation and Apple Developer forums
