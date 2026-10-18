---
name: rn-stuff-mobile-builds
description: >-
  Enforces mobile packaging, signing, and continuous integration rules for generating
  Android APK, Android App Bundle (AAB), iOS Simulator (.app.tar.gz), and iOS IPA binaries.
  Triggers when editing eas.json, GitHub Actions workflows in .github/workflows, build.gradle, or release scripts.
triggers:
  - "build apk"
  - "build aab"
  - "build ipa"
  - "build app"
  - "github action build"
  - "eas build"
  - "release pipeline"
---

# Mobile Binary Packaging & CI/CD Pipeline Standards

This skill governs native binary generation, code signing, and artifact lifecycle for `@resonance/mobile` across Android and iOS targets.

---

## 1. Binary Formats & Target Matrix

| Platform | Format | Purpose | Generator Toolchain | CI Artifact Name |
| :--- | :--- | :--- | :--- | :--- |
| **Android** | `.apk` | QA testing, device sideloading, BrowserStack matrix, Firebase App Distribution | Gradle `assembleRelease` / EAS Preview | `android-release-apk` |
| **Android** | `.aab` | Google Play Store publication with dynamic feature delivery | Gradle `bundleRelease` / EAS Production | `android-release-aab` |
| **iOS** | `.app` (`.tar.gz`) | Xcode Simulator testing & Appium automated runs (No Apple Developer signing required) | `xcodebuild -destination "generic/platform=iOS Simulator"` | `ios-simulator-app` |
| **iOS** | `.ipa` | TestFlight, Ad-Hoc internal enterprise distribution & App Store submission | `xcodebuild -exportArchive` / EAS Build | `ios-release-ipa` |

---

## 2. GitHub Actions Automation

Our primary automated build workflow is defined in `.github/workflows/mobile-builds.yml`:

### Triggering Manual Builds via GitHub CLI (`gh`):
```bash
# Build both Android (APK & AAB) and iOS (.app & .ipa)
gh workflow run mobile-builds.yml -f platform=all -f profile=preview

# Build only Android APK & AAB
gh workflow run mobile-builds.yml -f platform=android -f profile=preview

# Build only iOS Simulator .app & .ipa
gh workflow run mobile-builds.yml -f platform=ios -f profile=preview
```

### Downloading Artifacts from CI:
```bash
# Download latest built APK and AAB
gh run download --name android-release-apk
gh run download --name android-release-aab

# Download latest iOS Simulator bundle
gh run download --name ios-simulator-app
tar -xzf *.tar.gz
# Drag and drop the extracted .app directly into your running iOS Simulator!
```

---

## 3. Local Binary Compilation Commands

When compiling binaries on local macOS developer machines:

### Android APK & AAB:
```bash
cd apps/mobile
# 1. Clean prebuild native Android project
npx expo prebuild --platform android --clean --no-install

# 2. Build Release APK:
cd android && ./gradlew assembleRelease

# 3. Build Release AAB (App Bundle):
./gradlew bundleRelease
```
Outputs are generated in:
- APK: `apps/mobile/android/app/build/outputs/apk/release/app-release.apk`
- AAB: `apps/mobile/android/app/build/outputs/bundle/release/app-release.aab`

### iOS Simulator .app (Fast & No Apple Developer Account Needed):
```bash
cd apps/mobile
# 1. Clean prebuild native iOS workspace
npx expo prebuild --platform ios --clean --no-install

# 2. Build simulator executable:
cd ios && pod install
xcodebuild build \
  -workspace ResonanceHealthcarePlatformHub.xcworkspace \
  -scheme ResonanceHealthcarePlatformHub \
  -configuration Debug \
  -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath derived_data \
  CODE_SIGNING_ALLOWED=NO

# The compiled .app will be located at:
# derived_data/Build/Products/Debug-iphonesimulator/ResonanceHealthcarePlatformHub.app
```

---

## 4. EAS Cloud Build Integration (`eas.json`)

To build in Expo Application Services (EAS) cloud without managing local SDK toolchains:
```bash
# Android APK for QA:
eas build --platform android --profile preview

# Android AAB for Play Store:
eas build --platform android --profile production

# iOS Simulator .app:
eas build --platform ios --profile development

# iOS IPA for TestFlight:
eas build --platform ios --profile production
```
