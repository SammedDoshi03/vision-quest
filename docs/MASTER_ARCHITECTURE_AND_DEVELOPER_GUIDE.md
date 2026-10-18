# Master Enterprise Platform Architecture & Developer Guide

## Table of Contents
1. [Monorepo Architecture & Package Hierarchy](#1-monorepo-architecture--package-hierarchy)
2. [React Native Core Ergonomics & Performance Primitives](#2-react-native-core-ergonomics--performance-primitives)
   - [Hardware BackHandler & Gesture Handling](#hardware-backhandler--gesture-handling)
   - [Virtualized Lists: OptimizedFlatList & OptimizedSectionList](#virtualized-lists-optimizedflatlist--optimizedsectionlist)
   - [Refs, Hooks (useMemo, useCallback) & Profiling](#refs-hooks-usememo-usecallback--profiling)
   - [60/120 FPS Native-Driven Animations](#60120-fps-native-driven-animations)
   - [Client & Network Middleware Pipeline](#client--network-middleware-pipeline)
3. [Global Styling & Design System](#3-global-styling--design-system)
   - [Theme Tokens Hierarchy](#theme-tokens-hierarchy)
   - [Dynamic useGlobalStyles Hook](#dynamic-useglobalstyles-hook)
4. [Global Accessibility (A11y) Engine](#4-global-accessibility-a11y-engine)
   - [WCAG 2.1 AA/AAA Contrast Compliance](#wcag-21-aaaaa-contrast-compliance)
   - [Touch Target Standards (48dp AA / 64dp AAA)](#touch-target-standards-48dp-aa--64dp-aaa)
   - [Screen Reader Announcements & Focus Isolation](#screen-reader-announcements--focus-isolation)
5. [Universal Server-Driven UI (SDUI) & Dynamic Component Engine](#5-universal-server-driven-ui-sdui--dynamic-component-engine)
   - [Why Zero-Hardcode Pages?](#why-zero-hardcode-pages)
   - [Dynamic Component Registry](#dynamic-component-registry)
   - [Dynamic Page & Section Schemas](#dynamic-page--section-schemas)
   - [UniversalDynamicPage Architecture](#universaldynamicpage-architecture)
6. [The 12 Enterprise Industry Verticals & Dual-Persona Matrix](#6-the-12-enterprise-industry-verticals--dual-persona-matrix)
7. [Super-Admin Support & Operational Command Console](#7-super-admin-support--operational-command-console)
8. [Mobile Automation Strategy (Appium & BrowserStack)](#8-mobile-automation-strategy-appium--browserstack)
9. [BFF Gateway, OpenAPI Swagger, Postman & Environments](#9-bff-gateway-openapi-swagger-postman--environments)

---

## 1. Monorepo Architecture & Package Hierarchy

### Why a Monorepo? Eliminating the "Monolith in Disguise" Anti-Pattern
If 12 distinct multi-billion dollar domains (Medical, E-Commerce, Banking, Streaming, Energy, etc.) are simply hardcoded as subfolders inside `apps/mobile/src/features/`, **the monorepo's architectural value is completely defeated**. That structure is merely a monolith masquerading as a monorepo, creating:
- Bloated native client bundle sizes.
- Hard coupling between unrelated business domains.
- Inability for Web, Kiosk, or Admin client apps to reuse domain screens or logic.
- Costly regression risks when touching shared native code.

### The True Monorepo Architecture: Decoupled Domain Packages & Universal Shell
In our true monorepo design:
1. **Zero Hardcoded Domain Features in `apps/mobile`**: `apps/mobile` contains **no domain folders** (`features/medical`, `features/banking`, etc.). It is strictly a **Lightweight Universal Host Shell** providing navigation, native bridges, splash screens, error boundaries, and telemetry.
2. **Domain Contracts & SDUI Schemas in `@internal/contracts`**: All 12 domain data structures, Zod validators, and Server-Driven UI (SDUI) templates reside in `@internal/contracts`, shared bidirectionally between the mobile client and the NestJS BFF gateway.
3. **Pluggable SDUI Runtime in `@internal/ui-kit`**: The `UniversalDynamicPage` and `DynamicComponentRegistry` parse declarative JSON schemas at runtime. Any domain screen is rendered dynamically without writing a single line of hardcoded JSX in the client.
4. **Multi-App Multi-Target Capability**: Because the core engine is decoupled, any new app target (e.g. `apps/medical-kiosk`, `apps/doctor-portal-web`, `apps/merchant-tablet`) can be added to `apps/` in under an hour, consuming the exact same design system, contracts, auth, and network packages.

```
RN-Stuff/
├── apps/
│   ├── bff-mobile/           # NestJS Single-Server Gateway (Redis, Mongo, Swagger, Notifications, SDUI Endpoints)
│   └── mobile/               # Universal Native Host Shell (Zero hardcoded domain screens)
│       ├── src/
│       │   ├── navigation/   # Multi-Domain Drawer & Route Harness
│       │   ├── shell/        # Splash, ErrorBoundary, Settings, Reels Container
│       │   ├── App.tsx       # Root Providers & Host Bootstrap
│       │   └── index.ts
├── packages/
│   ├── a11y/                 # Global Accessibility (WCAG 2.1 Contrast, Announcements, 48/64dp Touch Targets)
│   ├── auth/                 # Headless Auth State Machine & Secure Storage
│   ├── config/               # Environment Variables & Multi-Stage Config
│   ├── contracts/            # Zod Schemas, 12 Domain Contracts, SDUI Templates & Test Locators
│   ├── network/              # Axios Client, Jittered Retries, Interceptors & Refresh
│   ├── server-kit/           # Backend Utilities, Geocoarsening, Deadlines & Scoring Pipelines
│   ├── testing/              # Appium, BrowserStack Locators & Test Fixtures
│   └── ui-kit/               # Atoms, Virtualized Lists, RoleSelector, Native Animations, SDUI Engine
├── projects/                 # Comprehensive Domain Architecture Specs (12 Industry Verticals)
├── docs/                     # Master Architectural, Testing & Automation Documentation
```

---

## 2. React Native Core Ergonomics & Performance Primitives

### Hardware BackHandler & Gesture Handling
To avoid unhandled Android hardware back presses crashing or unexpectedly closing the app:
- Handled through [`useHardwareBackHandler`](../packages/ui-kit/src/components/useHardwareBackHandler.ts).
- Priority order:
  1. If navigation drawer or modal sheet is open: closes the sheet/drawer (`return true`).
  2. If the user is on a secondary persona or drilldown: reverts to the primary persona (`return true`).
  3. If on a sub-route: returns to the default home screen (`return true`).
  4. At root: passes through to OS default exit (`return false`).

### Virtualized Lists: `OptimizedFlatList` & `OptimizedSectionList`
Located in [`packages/ui-kit/src/components/OptimizedVirtualizedList.tsx`](../packages/ui-kit/src/components/OptimizedVirtualizedList.tsx):
- **Predictable Scrolling (`getItemLayout`):** Precomputes item offsets to eliminate blank render jumps when scrolling at high velocities.
- **Windowed Rendering:**
  ```tsx
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={Platform.OS === 'android'}
  ```
- **Integrated Ergonomics:** Built-in pull-to-refresh (`RefreshControl`), empty component fallback, and pagination spinner footer.

### Refs, Hooks (`useMemo`, `useCallback`) & Profiling
- Components accept forwarded refs (`ref={flatListRef}`) to allow programmatic scrolling via `scrollToIndex` or `scrollToOffset`.
- Stable callbacks wrapped in `useCallback` prevent child recreation.
- Dynamic data transformations (e.g. filtering sections by active role) are memoized with `useMemo`.

### 60/120 FPS Native-Driven Animations
Located in [`packages/ui-kit/src/components/useNativeAnimations.ts`](../packages/ui-kit/src/components/useNativeAnimations.ts):
- [`useScalePressAnimation`](../packages/ui-kit/src/components/useNativeAnimations.ts): Bounces buttons subtly (scale `0.96` on touch down, spring back to `1.0` on release).
- [`useFadeAnimation`](../packages/ui-kit/src/components/useNativeAnimations.ts): Smooth opacity transitions for content panels.
- [`useSlideAnimation`](../packages/ui-kit/src/components/useNativeAnimations.ts): Spring-driven translateY movements for slide-up modals.
- **Always uses `useNativeDriver: true`** to offload transforms directly to the UI thread, bypassing JavaScript bridge frame drops.

### Client & Network Middleware Pipeline
Located in [`packages/network/src/client.ts`](../packages/network/src/client.ts):
- **Request Interceptor:** Injects bearer tokens and client metadata headers (`x-app-version`, `x-client-platform`).
- **Response Error Interceptor:** Intercepts HTTP 401s, dispatches single-flight refresh token exchange via `@internal/auth`, and replays failed in-flight requests.
- **Exponential Backoff & Jitter:** Automatically retries idempotent operations (GET/PUT) with randomized exponential jitter.

---

## 3. Global Styling & Design System

### Theme Tokens Hierarchy
Defined in [`packages/ui-kit/src/theme/tokens.ts`](../packages/ui-kit/src/theme/tokens.ts):
- **Color Palettes:** Curated dark mode (`#0B0C10`), elevated surfaces (`#1F202B`), borders, semantic alerts, and primary accents.
- **Spacing Scale:** Modular powers: `xs: 4`, `sm: 8`, `md: 16`, `lg: 24`, `xl: 32`, `xxl: 48`.
- **Border Radii:** `sm: 8`, `md: 14`, `lg: 24`, `full: 9999`.
- **Typography:** Strictly defined font sizes and line heights (`title1: 28/34`, `body: 15/22`, `callout: 14/20`).

### Dynamic `useGlobalStyles` Hook
Located in [`packages/ui-kit/src/theme/globalStyles.ts`](../packages/ui-kit/src/theme/globalStyles.ts):
- Provides ready-to-use style tokens (`rootContainer`, `cardContainer`, `elevatedCard`, `spaceBetweenRow`, `responsiveContent`, `h1`, `h2`, `badge`).
- Automatically adapts to the active device class (`phone`, `tablet`, `desktop`) and current theme.

---

## 4. Global Accessibility (A11y) Engine

Located in [`packages/a11y/src/globalA11y.ts`](../packages/a11y/src/globalA11y.ts):
1. **Screen Reader Speech Announcements:** [`announceAccessibility(message)`](../packages/a11y/src/globalA11y.ts) dynamically informs VoiceOver/TalkBack users of state changes (e.g., *"Dose taken"*, *"Cart item added"*).
2. **Minimum Touch Target Standards:**
   - Standard Mode (AA): **48x48 dp** minimum target.
   - Elderly & Motor Impairment Mode (AAA): **64x64 dp** target enforced via [`checkMinimumTouchTarget`](../packages/a11y/src/globalA11y.ts).
3. **Contrast Ratio Validator:** [`contrastRatio`](../packages/a11y/src/contrast.ts) tests foreground and background luminance to guarantee WCAG compliance.
4. **Modal Focus Traps:** [`A11yIsolationRoot`](../packages/a11y/src/provider.tsx) hides background elements from accessibility focus trees when modals are active.

---

## 5. Universal Server-Driven UI (SDUI) & Dynamic Component Engine

### Why Zero-Hardcode Pages?
In high-scale enterprise ecosystems, hardcoding individual screen files for every single industry vertical creates code bloat and requires app store updates for minor layout changes.
Our **Server-Driven UI (SDUI)** engine allows the BFF or local JSON configuration to drive complete screens dynamically!

### Architecture & Components
1. **Contracts ([`packages/contracts/src/dynamic-ui.ts`](../packages/contracts/src/dynamic-ui.ts)):**
   - Defines `DynamicComponentDefinition`, `DynamicSectionDefinition`, and `DynamicPageDefinition`.
2. **Component Registry ([`packages/ui-kit/src/dynamic/DynamicComponentRegistry.tsx`](../packages/ui-kit/src/dynamic/DynamicComponentRegistry.tsx)):**
   - Maps atomic component types (`METRIC_CARD`, `ENTITY_LIST`, `STATUS_BANNER`, `TOGGLE_ROW`, `ACTION_BUTTON`) to fully accessible, styled React Native atoms.
3. **Universal Dynamic Page ([`packages/ui-kit/src/dynamic/UniversalDynamicPage.tsx`](../packages/ui-kit/src/dynamic/UniversalDynamicPage.tsx)):**
   - Orchestrates dynamic pages with role switching, responsive split layouts, BackHandler integration, and action dispatching.
4. **Pre-Built Dynamic Templates ([`packages/contracts/src/dynamic-templates.ts`](../packages/contracts/src/dynamic-templates.ts)):**
   - Contains ready-to-render templates (`DYNAMIC_ECOMMERCE_TEMPLATE`, `DYNAMIC_MEDICAL_TEMPLATE`).

---

## 6. The 12 Enterprise Industry Verticals & Dual-Persona Matrix

| # | Domain | Primary Role | Secondary Role | Key Dynamic Interactive Capabilities |
|---|---|---|---|---|
| 01 | **Medical Care** | Patient (Aaji) | Caregiver | 64dp touch targets, Marathi prompts, medication adherence tracker, emergency SOS beacon |
| 02 | **E-Commerce** | Shopper | Store Merchant | Scarcity counters, 1-tap checkout, inventory stepper, 15m cart reservation hold |
| 03 | **Streaming** | Viewer | Studio Admin | HLS adaptive bitrate (Auto/1080p/4K), PiP toggle, Widevine DRM status, geoblock switch |
| 04 | **Payments & UPI** | Consumer (P2P) | Merchant | Contact UPI pay, camera QR scan simulator, Soundbox voice chime broadcast, daily settlements |
| 05 | **Wealth Banking** | Retail Customer | Compliance Officer | 3D card preview, reveal CVV, instant freeze toggle, video KYC queue, AML flag reviewer |
| 06 | **Energy Grid** | Field Lineman | Grid Dispatcher | Substation work orders, BLE optical meter probe, PPE checklist, breaker trip controls |
| 07 | **Public Sector 311** | Citizen | Ward Engineer | Civic grievance reports with auto-GPS, 48h SLA countdown, status progression desk |
| 08 | **Chat Collaboration** | Chat User | Community Moderator | E2E Signal protocol messaging, voice notes, anti-spam slow mode (30s), channel purge |
| 09 | **10m Quick Commerce** | Customer | Delivery Rider | Live dark store tracking, OTP delivery handover (4921), rider dispatch radar, route navigation |
| 10 | **Cloud Storage** | Account User | Quota Admin | Segmented storage gauge (Photos/Videos/Docs), 1-tap duplicate cleaner, member quota sliders |
| 11 | **Urban Mobility** | Rider | Driver Partner | Ride tier picker (Auto/Moto/Sedan), upfront fare estimation, driver duty switch, dispatch radar |
| 12 | **Short Video Reels** | Viewer | Creator Studio | Swipe feed, double-tap heart like, sound sync marquee, draft video publisher, retention analytics |

---

## 7. Super-Admin Support & Operational Command Console

Implemented in [`apps/mobile/src/features/admin/AdminDashboardView.tsx`](../apps/mobile/src/features/admin/AdminDashboardView.tsx):
- **Live Platform KPIs:** Active Users (24,891), Total GMV (₹2.48 Cr), Public 311 SLA (94.2%), Fleet Count (1,420).
- **Master Killswitches:** UPI Gateway rail status, Express Surge pricing toggle, Scheduled Maintenance window.
- **Expo OTA Rollout:** Staged firmware/app bundle rollout simulation (+25% increments).
- **Infrastructure Circuit Breakers:** Real-time health gauges for Redis L2, MongoDB replica sets, and FCM push queues.
- **Live Audit Feed:** Timestamped security logs with severity tags (`[INFO]`, `[WARN]`, `[ALERT]`).

---

## 8. Mobile Automation Strategy (Appium & BrowserStack)

Located in [`packages/testing/src/automation/`](../packages/testing/src/automation/):
1. **Central Locators Registry ([`testLocators.ts`](../packages/testing/src/automation/testLocators.ts)):** Standardized `testID`s across all UI elements.
2. **Appium 2.x WebDriverIO Config ([`appium.config.ts`](../packages/testing/src/automation/appium.config.ts)):** Android UiAutomator2 and iOS XCUITest runner capabilities with dual-orientation testing.
3. **BrowserStack Device Matrix ([`browserstack.config.ts`](../packages/testing/src/automation/browserstack.config.ts)):**
   - Standard Phones (19.5:9): iPhone 15 Pro, Samsung S24 Ultra.
   - Foldables (~8:7.1): Google Pixel Fold, Galaxy Z Fold 5.
   - Tablets (4:3 & 16:10): iPad Pro 12.9", Galaxy Tab S9 Ultra.
4. **E2E Automation Flows ([`automationFlows.ts`](../packages/testing/src/automation/automationFlows.ts)):** Automated test suites verifying role transitions, screen rotation, and admin telemetry.

---

## 9. BFF Gateway, OpenAPI Swagger, Postman & Environments

Located in [`apps/bff-mobile/`](../apps/bff-mobile/):
- **Single-Server Architecture:** Centralized NestJS gateway managing all domain modules (`MedicalModule`, `ReelsModule`, `SystemModule`, `RedisCacheService`, `PushNotificationService`).
- **Interactive Swagger UI:** Accessible at `http://localhost:4000/api/docs`.
- **Exported Specs:**
  - OpenAPI Specification: [`swagger-spec.json`](../swagger-spec.json).
  - Postman v2.1 Collection: [`postman-collection.json`](../postman-collection.json).
- **Environment Profiles:** Typed by `@internal/config` across `.env.development`, `.env.qat`, `.env.staging`, and `.env.production`.

## 10. Hardware Biometrics & Security Architecture

Located in [`packages/ui-kit/src/components/useBiometrics.ts`](../packages/ui-kit/src/components/useBiometrics.ts) and [`apps/mobile/src/shell/BiometricLockOverlay.tsx`](../apps/mobile/src/shell/BiometricLockOverlay.tsx):

1. **Native Hardware Integration:**
   - Evaluates hardware availability and enrollment for `FaceID` (iOS), `TouchID` (iOS), and `BiometricPrompt` (Android StrongBox / Keymaster).
   - Configured via Android `USE_BIOMETRIC`, `USE_FINGERPRINT` permissions and iOS `NSFaceIDUsageDescription` in [`app.json`](../apps/mobile/app.json).
2. **State Machine Lock & Key Protection:**
   - Seamlessly integrated into [`AuthMachine`](../packages/auth/src/machine.ts): when the app returns from background or when a secure session expires, the app enters `status: 'locked'`.
   - Hardware keys can only be unlocked through `unlockWithBiometrics()` backed by Secure Keystore (`expo-secure-store` with `WHEN_UNLOCKED_THIS_DEVICE_ONLY`).
3. **UX Security Gate:**
   - [`BiometricLockOverlay`](../apps/mobile/src/shell/BiometricLockOverlay.tsx) mounts over the entire screen when `auth.status === 'locked'`, preventing unauthorized visual access to financial or patient health data.
   - Fallback to device PIN/passcode is supported when biometric attempts fail.

---

## 11. Verification Commands

```bash
# Execute test suites across all 10 packages
pnpm turbo run test

# Run strict TypeScript typecheck across all 11 packages and apps
pnpm turbo run typecheck
```
