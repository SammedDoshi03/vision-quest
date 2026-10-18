---
name: rn-stuff-a11y-and-biometrics
description: Enforces WCAG 2.1 AA/AAA touch targets (48dp/64dp), 7:1 contrast tokens, 8-language localization, and hardware biometric state machine locks. Triggers when building interactive components, forms, themes, or authentication/security flows in @internal/a11y and @internal/auth.
---

# Accessibility, Localization & Hardware Biometric Rules

## 1. WCAG 2.1 AA/AAA & Touch Target Enforcement (`@internal/a11y`)
- Standard AA mode components must enforce a minimum `48x48 dp` hit area; Elderly/Motor Impairment AAA mode (e.g., Medical Care "Aaji" persona) must enforce `64x64 dp` touch targets.
- All color pairings in dark and light mode (`tokens.ts`) must pass automated luminance validation for WCAG AAA `7:1` contrast compliance.
- Dynamic state changes, toast alerts, and form errors must invoke `announceAccessibility(message)` for VoiceOver and TalkBack.
- Wrap modal bottom sheets and blocking overlays in `A11yIsolationRoot` to hide background layers from screen reader focus.

## 2. Multi-Language Localization (`useI18n`)
- Never hardcode raw user-facing strings in components; always resolve copy via `useI18n` supporting English, Marathi, Hindi, Spanish, French, German, Japanese, and Arabic.

## 3. Hardware Biometrics & Privacy Gates (`@internal/auth`)
- When the app returns from the background or a session expires, `AuthMachine` must transition to `status: 'locked'` and mount `BiometricLockOverlay` over the viewport.
- Hardware keys must only unlock via `unlockWithBiometrics()` using `FaceID`, `TouchID`, or Android `BiometricPrompt` backed by `expo-secure-store` with `WHEN_UNLOCKED_THIS_DEVICE_ONLY`.
- Keep `PrivacyProtector` active to blur OS app-switcher snapshots and prevent visual leaks of medical schedules or financial balances.
