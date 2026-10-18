---
name: rn-stuff-e2e-testing
description: Enforces centralized testID locators, Appium 2.x WebDriverIO configurations, BrowserStack device matrix coverage, and dual-persona regression flows. Triggers when writing unit, integration, or E2E tests in @internal/testing or adding interactive elements in @internal/ui-kit.
---

# Mobile Automation & Testing Rules (`@internal/testing`)

## 1. Centralized Collision-Free Locators (`testLocators.ts`)
- Never invent ad-hoc `testID` strings inside UI components; register every navigation tab, action button, input, and persona switcher in `packages/contracts/src/testLocators.ts` (or `@internal/testing`).

## 2. Appium 2.x & BrowserStack Matrix Compliance
- E2E flows in `packages/testing/src/automation/automationFlows.ts` must support both Android `UiAutomator2` and iOS `XCUITest` in Portrait and Landscape orientations via `appium.config.ts`.
- Ensure layout and gesture tests account for the BrowserStack target matrix (`browserstack.config.ts`): standard phones (iPhone 15 Pro, Galaxy S24 Ultra), foldables (Pixel Fold, Galaxy Z Fold 5), and large tablets (iPad Pro 12.9", Galaxy Tab S9 Ultra).
- Every new vertical or shell change must pass the 3 core E2E regression flows: (1) Dual-persona role switching, (2) Dynamic SDUI template rendering, and (3) Biometric lock + hardware BackHandler verification.

## 3. Pre-Completion Validation
- Always execute and pass `pnpm test` and `pnpm typecheck` before completing any agent task in this repository.
