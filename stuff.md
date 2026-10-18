# System Architecture & Technical Master Blueprint: Multi-Vertical Enterprise Platform

> **Document Purpose:** This document is an end-to-end architectural brief and project specification for the `RN-Stuff` monorepo. It is designed to be shared directly with Principal Architects, Lead Mobile Engineers, or other AI systems to evaluate architectural integrity, identify gaps, critique design patterns, and recommend enterprise improvements.

---

## 1. Executive Summary & Project Purpose

### What Are We Doing Here?
We are building a **unified, multi-vertical enterprise mobile and backend platform** using a **True Monorepo Architecture**. The platform is engineered to support **12 distinct industry verticals** (Medical Care, E-Commerce, Streaming Media, Digital UPI Payments, Wealth Banking, Energy Grid Operations, Public Sector 311, Real-Time Encrypted Chat, 10-Minute Delivery, Cloud Storage & Quotas, Urban Mobility, and Short Video Reels) along with an **Anti-Swipe Social Feed** and a **Super-Admin Operational Command Console**.

### The Core Architectural Dilemma We Solved
Most multi-domain mobile applications become a **"Monolith in Disguise"**: developers dump domain folders (`features/medical`, `features/banking`, `features/ecommerce`) into a single mobile app repository. This causes:
1. Massive native bundle sizes and sluggish startup times.
2. Hard coupling between unrelated domain logic and UI.
3. Inability to reuse components across web portals, kiosks, or merchant tablets.
4. App Store review bottlenecks whenever a minor screen change is required.

**Our Architectural Solution:**
1. **Lightweight Universal Host Shell (`apps/mobile`):** The React Native app contains **zero hardcoded domain screens**. It is purely a host providing navigation (Drawer, Bottom Nav, Tabs), biometric hardware security gates, theme providers, error boundaries, and telemetry.
2. **Server-Driven UI (SDUI) Dynamic Component Engine (`@internal/ui-kit` & `@internal/contracts`):** Complete screens and domain layouts are described declaratively via typed JSON schemas (`DynamicPageDefinition`, `DynamicSectionDefinition`, `DynamicComponentDefinition`) rendered at runtime by `UniversalDynamicPage` and `DynamicComponentRegistry`.
3. **Decoupled Platform Packages (`packages/*`):** Reusable, headless, and strictly isolated packages handling accessibility (WCAG 2.1 AA/AAA), authentication state machines, offline outbox networking with full-jitter exponential backoff, hardware biometric locks, and environment configurations.
4. **Single-Server Multi-Domain BFF Gateway (`apps/bff-mobile`):** A centralized NestJS Backend-For-Frontend server that eliminates fragmented server sprawl while providing unified Swagger/OpenAPI 3.0 documentation, Postman collections, Redis caching, Firebase Realtime sync, and multi-stage environment configurations.

---

## 2. High-Level System Architecture Diagram

```
                              ┌─────────────────────────────────────────────────────────┐
                              │           React Native Host Shell (apps/mobile)         │
                              │  - MultiNavigator (Drawer + Bottom Nav + BackHandler)    │
                              │  - BiometricLockOverlay (FaceID / TouchID Keystore)     │
                              │  - GlobalErrorBoundary & Offline Banner Indicator       │
                              └────────────────────────────┬────────────────────────────┘
                                                           │
                                                           ▼
                              ┌─────────────────────────────────────────────────────────┐
                              │           Universal SDUI Runtime Engine (@internal/ui-kit)│
                              │  - UniversalDynamicPage (Zero hardcoded domain screens)  │
                              │  - DynamicComponentRegistry (MetricCards, Steppers, etc.)│
                              │  - OptimizedVirtualizedList (Windowed FlatList/Section) │
                              │  - Hardware BackHandler & 60/120 FPS Native Animations   │
                              └────────────────────────────┬────────────────────────────┘
                                                           │
                                 ┌─────────────────────────┴─────────────────────────┐
                                 ▼                                                   ▼
┌──────────────────────────────────────────────────┐        ┌──────────────────────────────────────────────────┐
│             Headless Client Packages             │        │          Single-Server BFF Gateway               │
│ - @internal/a11y (WCAG AAA, 48/64dp targets)     │        │          (apps/bff-mobile :4000)                 │
│ - @internal/auth (Biometrics + Auth Machine)     │        │ - NestJS Modular Gateway (12 Domains)            │
│ - @internal/network (Axios + Jittered Retries)   │◄──────►│ - Swagger UI (/api/docs) & Postman v2.1 Spec    │
│ - @internal/contracts (Zod Schemas + SDUI DTOs)  │        │ - Multi-Stage Configs (.env.dev/.qat/.prod)      │
│ - @internal/testing (Appium & BrowserStack)      │        │ - Dynamic Strategy: Mock | Redis | Firebase | PG │
└──────────────────────────────────────────────────┘        └─────────────────────────┬────────────────────────┘
                                                                                      │
                                                           ┌──────────────────────────┴──────────────────────────┐
                                                           ▼                                                     ▼
                                            ┌─────────────────────────────┐                       ┌─────────────────────────────┐
                                            │   In-Memory & Edge Layer    │                       │   Persistent Master Store   │
                                            │ - Redis 7.0 (Query Cache)   │                       │ - PostgreSQL 16 (Ledger)    │
                                            │ - Firebase Realtime DB      │                       │ - MongoDB (Social/Feed)     │
                                            │ - FCM Push Notifications    │                       │ - Local SQLite / MMKV Outbox│
                                            └─────────────────────────────┘                       └─────────────────────────────┘
```

---

## 3. Monorepo Structure & Package Hierarchy

```text
RN-Stuff/
├── apps/
│   ├── bff-mobile/               # NestJS Single-Server Gateway (Redis, Mongo, Swagger, Notifications, SDUI)
│   └── mobile/                   # Universal Native Host Shell (Zero hardcoded domain screens)
│       ├── src/
│       │   ├── navigation/       # Multi-Domain Drawer, Bottom Nav & Route Harness
│       │   ├── shell/            # Splash, GlobalErrorBoundary, BiometricLock, Settings, Reels
│       │   ├── features/admin/   # Super-Admin Support & Operational Command Console
│       │   ├── App.tsx           # Root Providers & Host Bootstrap
│       │   └── index.ts
├── packages/
│   ├── a11y/                     # Global Accessibility (WCAG 2.1 Contrast, Announcements, 48/64dp Touch Targets)
│   ├── auth/                     # Headless Auth State Machine & Secure Storage
│   ├── config/                   # Environment Variables & Multi-Stage Config (.env.dev, .qat, .staging, .prod)
│   ├── contracts/                # Zod Schemas, 12 Domain Contracts, SDUI Templates & Test Locators
│   ├── network/                  # Axios Client, Jittered Retries, Interceptors & Single-Flight Token Refresh
│   ├── server-kit/               # Backend Utilities, Geocoarsening, Deadlines & Scoring Pipelines
│   ├── testing/                  # Appium 2.x WebDriverIO Config, BrowserStack Matrix & Automation Flows
│   └── ui-kit/                   # Atoms, Virtualized Lists, RoleSelector, Native Animations, SDUI Engine
├── projects/                     # Deep Architectural Specs for 12 Industry Verticals
│   ├── 01_medical.md             # Medical Care & Chronic Medication Adherence
│   ├── 02_ecommerce.md           # E-Commerce & Inventory Lock Engine
│   ├── 03_streaming.md           # Adaptive Bitrate HLS & Studio Controls
│   ├── 04_payment.md             # UPI Sub-Second Payments & Soundbox Chime
│   ├── 05_banking.md             # Double-Entry Core Banking & AML Compliance
│   ├── 06_energy.md              # GIS Substation Grid & BLE Meter Probing
│   ├── 07_public_sector.md       # GovTech 311 Civic Grievance SLA Tracker
│   ├── 08_chat.md                # E2E Signal Double-Ratchet Messaging
│   ├── 09_delivery.md            # 10-Minute Dark Store Quick Commerce
│   ├── 10_subscription_storage.md# Cloud Storage Segments & Quota Pooling
│   ├── 11_mobility_logistics.md  # Spatial Driver Matching & RideCheck
│   ├── 12_short_video_reels.md   # Swipe Feed & Creator Studio
│   └── GLOBAL_ENTERPRISE_ARCHITECTURE.md
├── docs/
│   ├── ARCHITECTURE_AND_TESTING_GUIDE.md
│   └── MASTER_ARCHITECTURE_AND_DEVELOPER_GUIDE.md
├── .env.development              # Local dev environment profile (Mock mode, in-memory outbox)
├── .env.qat                      # Automated CI/CD integration testing profile
├── .env.staging                  # Staging profile (Live Firebase + PostgreSQL)
├── .env.production               # Production profile (High-Availability Redis + PostgreSQL)
├── swagger-spec.json             # Exported OpenAPI 3.0 specification
├── postman-collection.json       # Pre-configured Postman v2.1 collection
├── turbo.json                    # Turborepo task pipeline
└── package.json                  # Root monorepo workspace configuration
```

---

## 4. Traceability Matrix: 34 Platform Requirements (`stuff.txt`)

Below is the exact verification and implementation audit of all requirements originally listed in `stuff.txt`:

| # | Requirement | Architectural Implementation & Code Location |
|---|---|---|
| **01** | **Monorepo Reusability** | `@internal/*` shared packages (`ui-kit`, `contracts`, `a11y`, `network`, `auth`, `server-kit`, `testing`, `config`). Zero duplication. |
| **02** | **Multi-Stage Config Files** | Typed `.env.development`, `.env.qat`, `.env.staging`, `.env.production` managed via `@internal/config` using Zod validation. |
| **03** | **OpenAPI / Swagger Spec** | Live interactive Swagger UI at `http://localhost:4000/api/docs` and exported [`swagger-spec.json`](./swagger-spec.json). |
| **04** | **Dynamic Environment Switching** | Strategy pattern in BFF: `ACTIVE_DATA_SOURCE` switches seamlessly between `mock`, `firebase`, and `postgres`. |
| **05** | **Postman Direct Testing** | [`postman-collection.json`](./postman-collection.json) v2.1 with pre-configured headers, variables, and mock JWT auth. |
| **06** | **Comprehensive Documentation** | Detailed documentation in `docs/` and `projects/`, including testing guides, architectural blueprints, and cURL snippets. |
| **07** | **True BFF Architecture** | Dedicated `apps/bff-mobile` mediating downstream DBs/services and shaping tailored client-ready DTOs. |
| **08** | **Deterministic Entities & Schemas** | Zod schemas and strongly typed TypeScript entities (`PatientSchedule`, `ProductItem`, `PaymentTxn`, etc.) in `@internal/contracts`. |
| **09** | **Client-Side Caching & Stale-While-Revalidate** | Query caching with automatic cache invalidation and local optimistic UI updates. |
| **10** | **Redis Caching** | Integrated `RedisCacheService` in BFF (`apps/bff-mobile/src/services/redis-cache.service.ts`) for query acceleration. |
| **11** | **Firebase Integration** | Dual-mode Firebase Realtime DB adapter (`FirebaseMedicalService`) with local SQLite fallback. |
| **12** | **Database Configuration** | Configured connection pools for PostgreSQL (TypeORM/Prisma) and MongoDB in `.env.*` and `docker-compose.yml`. |
| **13** | **Push Notifications** | `PushNotificationService` supporting FCM payload dispatches, Soundbox voice broadcasts, and alarm channels. |
| **14** | **CI/CD Pipeline** | Turborepo pipeline (`turbo.json`) caching builds, test suites, and strict TypeScript verification across all packages. |
| **15** | **Monitoring & Logging** | Structured audit logging in BFF with severity tagging (`[INFO]`, `[WARN]`, `[ALERT]`) and live admin stream. |
| **16** | **Single Unified Server** | Single NestJS server (`apps/bff-mobile`) with distinct domain modules, avoiding fragile multi-server sprawl. |
| **17** | **Multi-Navigation Support** | `MultiNavigator.tsx` implementing Drawer Navigation, Bottom Tab Bar, and modal stack switching. |
| **18** | **Testing Suite (Unit, Integration, E2E)** | Automated tests (`pnpm test`), Appium 2.x WebDriverIO runner, and BrowserStack device matrix. |
| **19** | **Distinct Dual-Persona Domain UIs** | Dual-role UIs across all 12 domains (Patient/Caregiver, Shopper/Merchant, Citizen/Ward Engineer, etc.). |
| **20** | **I18n & Localization** | Universal translation hook (`useI18n`) supporting English, Marathi, Hindi, Spanish, French, German, Japanese, and Arabic. |
| **21** | **User Experience & Feedback** | Instant feedback with `ToastProvider`, haptic buzzes, slide-up bottom sheets, and status banners. |
| **22** | **Social Media (Reels / TikTok)** | Built-in vertical video swipe feed (`ReelsView.tsx`) with double-tap heart animations, audio marquee, and studio publisher. |
| **23** | **In-App Rating** | Rating dialog module with 5-star scoring and feedback dispatch. |
| **24** | **Application Settings** | Dedicated `SettingsScreen.tsx` with theme toggle, biometric switches, offline sync status, and language picker. |
| **25** | **Expo OTA Update Support** | OTA firmware/bundle rollout simulator (+25% increments) with staging rings in Super-Admin console. |
| **26** | **New Update Available Prompt** | Client version interceptor checking `x-app-version` header and presenting non-blocking or force-update modals. |
| **27** | **Maintenance Window Support** | Master maintenance switch in Admin Console that returns HTTP 503 and presents a friendly maintenance screen. |
| **28** | **Error Handling** | Uniform exception filters on server, typed error codes, and graceful fallback states on mobile. |
| **29** | **App Icon & Branding** | Curated branding tokens, adaptive icons, and splash asset configurations. |
| **30** | **Splash Screen & Micro-Animations** | Animated splash screen with spring-based logo transitions and loading indicators. |
| **31** | **Keyboard Management** | `KeyboardAvoidingView` wrappers and dismiss-on-tap handlers across input forms. |
| **32** | **Native SDK Management** | `nativeBridge` interface providing biometrics, camera, audio, and device vibration bindings. |
| **33** | **Dark Mode & Contrast** | HSL dark theme tokens (`tokens.ts`) with WCAG AAA 7:1 contrast ratio compliance. |
| **34** | **Global Error Boundary** | `GlobalErrorBoundary.tsx` catching native JS crashes with retry triggers and debug diagnostics. |

---

## 5. React Native Performance Primitives & Ergonomics (`newstuff.txt`)

Below is the technical implementation addressing the questions in `newstuff.txt`:

### 1. Gesture Handling & Hardware BackHandler
- **Hardware BackHandler (`useHardwareBackHandler`):** Intercepts Android hardware back presses with tiered priority:
  1. Closes open modal bottom sheets or navigation drawers.
  2. If the user is on a secondary persona (e.g. Caregiver), returns to the primary persona (Patient).
  3. If on a sub-route, navigates back to `DYNAMIC_SDUI`.
  4. At root, exits the application smoothly.
- **Gesture Handling:** Integrated PanGesture and TapGesture handlers for swipe-to-dismiss sheets and double-tap reels likes.

### 2. Virtualized Lists (`OptimizedFlatList` & `OptimizedSectionList`)
- **`getItemLayout` Offset Precomputation:** Eliminates blank render flashes during rapid scrolling by computing fixed cell offsets:
  ```tsx
  getItemLayout={(data, index) => ({
    length: itemHeight,
    offset: itemHeight * index,
    index,
  })}
  ```
- **Windowed Rendering Budget:**
  - `initialNumToRender={10}`
  - `maxToRenderPerBatch={10}`
  - `windowSize={5}`
  - `removeClippedSubviews={Platform.OS === 'android'}`
- **Built-in Ergonomics:** ForwardRef scroll bindings (`scrollToIndex`, `scrollToOffset`), pull-to-refresh (`RefreshControl`), and paginated loading indicators.

### 3. Refs, Memoization & Animation Performance
- **Refs:** Programmatic viewport control via forwarded refs.
- **`useMemo` & `useCallback`:** All complex list filters and action handlers are memoized to avoid unwanted re-renders during high-frequency telemetry updates.
- **60/120 FPS Native Animations (`useNativeDriver: true`):**
  - `useScalePressAnimation`: Subtle scale compression (0.96) on touch down, spring rebound (1.0) on release.
  - `useFadeAnimation`: Smooth opacity transitions.
  - `useSlideAnimation`: Spring-driven modal translateY animations.
  - Completely offloaded to the native UI thread, bypassing JavaScript bridge frame drops.

### 4. Client & Network Middleware Pipeline
- **Request Interceptor:** Injects bearer tokens, platform metadata, and client version headers.
- **Error Interceptor:** Traps HTTP 401s, dispatches single-flight refresh token renewal via `@internal/auth`, and transparently replays failed requests.
- **Exponential Jitter Retry:** Automatically retries idempotent operations (GET/PUT) with randomized backoff.

### 5. Global Accessibility (A11y) Engine
- **Touch Target Enforcement:** Standard AA mode guarantees minimum **48x48 dp** touch targets; Elderly/Motor Impairment AAA mode enforces **64x64 dp** targets.
- **Screen Reader Speech Announcements:** Programmatic `announceAccessibility(message)` triggers for VoiceOver and TalkBack.
- **Contrast Ratios:** Automated luminance checking guaranteeing WCAG 2.1 AAA (7:1) compliance.
- **Focus Isolation:** `A11yIsolationRoot` hides background layers when modal sheets or dialogs are active.

### 6. Universal Server-Driven UI (SDUI) & Dynamic Components
- **Zero Hardcoded Domain Pages:** Screens are declared via `DynamicPageDefinition` schemas.
- **Dynamic Component Registry:** Maps generic component tokens (`METRIC_CARD`, `ENTITY_LIST`, `STATUS_BANNER`, `TOGGLE_ROW`, `ACTION_BUTTON`) to fully styled, accessible native components.
- **Runtime Adaptability:** The BFF can reorder sections, push flash banners, or modify field attributes without requiring an App Store binary release.

---

## 6. The 12 Enterprise Industry Verticals & Dual-Persona Matrix

| # | Domain | Primary Persona | Secondary Persona | Key Interactive Capabilities |
|---|---|---|---|---|
| **01** | **Medical Care** | Patient (Aaji) | Caregiver | 64dp touch targets, Marathi bilingual voice prompts, medication adherence tracker, SOS beacon |
| **02** | **E-Commerce** | Shopper | Store Merchant | Scarcity counters, 1-tap checkout, inventory stepper, 15m cart reservation hold |
| **03** | **Streaming** | Viewer | Studio Admin | HLS adaptive bitrate (Auto/1080p/4K), PiP toggle, Widevine DRM status, geoblock switch |
| **04** | **Payments & UPI** | Consumer (P2P) | Merchant | Contact UPI pay, camera QR scan simulator, Soundbox voice chime broadcast, daily settlements |
| **05** | **Wealth Banking** | Retail Customer | Compliance Officer | 3D card preview, reveal CVV, instant freeze toggle, video KYC queue, AML flag reviewer |
| **06** | **Energy Grid** | Field Lineman | Grid Dispatcher | Substation work orders, BLE optical meter probe, PPE checklist, breaker trip controls |
| **07** | **Public Sector 311** | Citizen | Ward Engineer | Civic grievance reports with auto-GPS, 48h SLA countdown, status progression desk |
| **08** | **Chat Collaboration** | Chat User | Community Moderator | E2E Signal protocol messaging, voice notes, anti-spam slow mode (30s), channel purge |
| **09** | **10m Quick Commerce** | Customer | Delivery Rider | Live dark store tracking, OTP delivery handover (4921), rider dispatch radar, route navigation |
| **10** | **Cloud Storage** | Account User | Quota Admin | Segmented storage gauge (Photos/Videos/Docs), 1-tap duplicate cleaner, member quota sliders |
| **11** | **Urban Mobility** | Rider | Driver Partner | Ride tier picker (Auto/Moto/Sedan), upfront fare estimation, driver duty switch, dispatch radar |
| **12** | **Short Video Reels** | Viewer | Creator Studio | Swipe feed, double-tap heart like, sound sync marquee, draft video publisher, retention analytics |
| **--** | **Resonance Feed** | Match Candidate | Curator | Anti-swipe situational check-ins, waves, co-op quests, afterglow interaction window |
| **--** | **Super-Admin Console** | System Operator | Security Auditor | Live platform KPIs, killswitches, circuit breakers, OTA bundle rollouts, security audit logs |

---

## 7. Hardware Biometrics & Security Architecture

1. **Hardware Biometrics Integration (`useBiometrics` & `nativeBridge`):**
   - Supports `FaceID` (iOS), `TouchID` (iOS), and `BiometricPrompt` (Android StrongBox / Keymaster).
   - Configured with native permissions in `app.json`.
2. **State Machine Lock & Key Protection:**
   - Integrated into `AuthMachine`: when the mobile client returns from the background or a secure session expires, the app enters `status: 'locked'`.
   - Hardware keys can only be unlocked through `unlockWithBiometrics()` backed by Secure Keystore (`expo-secure-store` with `WHEN_UNLOCKED_THIS_DEVICE_ONLY`).
3. **UX Security Gate (`BiometricLockOverlay`):**
   - Mounts over the viewport when locked, preventing visual exposure of sensitive medical schedules or financial balances.
   - Fallback to device PIN is supported.
4. **Privacy Protection (`PrivacyProtector`):**
   - Automatically blurs the application snapshot in the OS app switcher to prevent visual data leaks.

---

## 8. Mobile Automation Strategy (Appium & BrowserStack)

Located in `packages/testing/src/automation/`:
1. **Central Test Locators (`testLocators.ts`):** Standardized, collision-free `testID`s across all navigation tabs, action buttons, inputs, and persona switchers.
2. **Appium 2.x WebDriverIO Configuration (`appium.config.ts`):**
   - Android UiAutomator2 and iOS XCUITest runner configurations.
   - Dual-orientation support (Portrait and Landscape).
3. **BrowserStack Device Matrix (`browserstack.config.ts`):**
   - Standard Smart Phones: iPhone 15 Pro, Samsung Galaxy S24 Ultra.
   - Foldable Devices: Google Pixel Fold, Samsung Galaxy Z Fold 5.
   - Large Tablets: iPad Pro 12.9", Samsung Galaxy Tab S9 Ultra.
4. **E2E Automation Flows (`automationFlows.ts`):**
   - Role switching regression test.
   - Dynamic SDUI template rendering test.
   - Biometric lock and hardware BackHandler validation test.

---

## 9. Verification & Running Commands

```bash
# 1. Run automated test suites across all internal packages and apps
pnpm test

# 2. Run strict TypeScript compiler verification across all packages
pnpm typecheck

# 3. Build shared contracts and BFF gateway
pnpm --filter @internal/contracts build
pnpm --filter @resonance/bff-mobile build

# 4. Start NestJS BFF locally in development mode (with Swagger on :4000)
NODE_ENV=development pnpm --filter @resonance/bff-mobile dev

# 5. Start React Native Mobile App
pnpm --filter @resonance/mobile start
```

---

## 10. Questions for External AI & Architectural Reviewers

When sharing this blueprint with other AI models, Senior Software Architects, or Engineering Directors, use the following prompts and review questions to obtain critical feedback:

```markdown
### Reviewer Assessment Questions:

1. **Server-Driven UI (SDUI) vs Native Feature Modules:**
   - In our architecture, domain screens are driven by declarative JSON templates (`DynamicPageDefinition`) rendered by `UniversalDynamicPage`. What are the potential trade-offs regarding schema versioning, backward compatibility with older client versions, and complex client-side validation logic?
   - How can we implement a formal JSON schema validation pipeline (e.g. JSON-Schema / Zod RPC) for client-server contract synchronization?

2. **State Management & Offline Outbox:**
   - We currently handle offline actions via an Outbox Pattern backed by local SQLite/MMKV and TanStack Query cache invalidations. In a high-concurrency offline scenario (e.g. multiple offline actions before reconnection), how should outbox conflict resolution (LWW vs CRDTs vs Server Rejection) be structured?

3. **Monorepo Scaling & Micro-Frontends:**
   - As more teams contribute to the 12 verticals, how should we structure code ownership (CODEOWNERS), independent package versioning (Changesets / Turborepo remote caching), and boundary enforcement to prevent developers from bypassing `@internal/contracts`?

4. **Multi-Tenant / Multi-App Deployment:**
   - If an enterprise client wants to compile only the "Medical App" without bundling the "E-Commerce" or "Banking" SDUI templates into the native binary, what tree-shaking, dynamic import, or build-flavor strategies should be applied to `apps/mobile`?

5. **Security, Compliance & Regional Regulations:**
   - For Medical (HIPAA / DISHA), Payments (PCI-DSS / RBI UPI mandates), and Public Sector (data residency), what additional cryptographic layers or tokenization proxies should be inserted between the BFF gateway and downstream microservices?
```
