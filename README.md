# Resonance Monorepo

> Swipe-free, situation- and interest-driven dating platform engineered with a platform-first monorepo strategy.

---

## 1. Monorepo Architecture

```text
RN-Stuff/
├── packages/
│   ├── contracts/    # Shared Zod schemas & TypeScript types (User, Feed, Scenes, Quests, Auth)
│   ├── config/       # Shared tsconfig presets (base, node, react)
│   ├── a11y/         # Screen readers (VoiceOver/TalkBack), dynamic type, contrast assertions, WCAG rules
│   ├── network/      # Standardized BFF client with exponential full jitter, retries, and token refresh
│   ├── auth/         # Headless auth state machine, TokenProvider, and secure session management
│   ├── ui-kit/       # Accessible UI Kit (SlideUpPanel, Button, IconButton, Chip, Feed, Theme tokens)
│   ├── testing/      # Fixture factories (User, Feed, Scenes, Quests) and mock harnesses
│   └── server-kit/   # NestJS guards, CurrentUser decorator, MongoDB aggregation pipeline builders
└── apps/
    ├── bff-mobile/   # NestJS Backend-For-Frontend (Screen-oriented FeedOrchestrator, Scenes, Interactions)
    └── mobile/       # React Native New Architecture app consuming the proprietary platform libraries
```

---

## 2. Platform Packages

| Package | Purpose |
|---|---|
| **`@internal/contracts`** | Single source of truth for all API contracts between Mobile, BFF, and microservices. |
| **`@internal/a11y`** | Strict accessibility compliance (`a11y.button`, `a11y.heading`, `a11y.dialog`, `assertContrast`, `useAutoFocus`, `useFocusRestore`, `useModalIsolation`). |
| **`@internal/network`** | HTTP client wrapper pre-configured for the BFF with automatic request ID generation, idempotent retries with full jitter, and single-flight 401 token refresh. |
| **`@internal/auth`** | Headless authentication state machine implementing `@internal/network`'s `TokenProvider` interface. |
| **`@internal/ui-kit`** | Accessible design system in rich dark mode tokens, featuring `SlideUpPanel` bottom sheets, `Button`, `IconButton`, and `SectionRenderer`. |
| **`@internal/server-kit`** | NestJS decorators (`@CurrentUser()`), auth guards (`JwtAuthGuard`), timeout resilience (`withTimeout`), privacy coarsening (`coarsenLocation`), and MongoDB interest scoring pipeline builders. |
| **`@internal/testing`** | Test fixtures and factories (`createUserFixture`, `createHomeFeedResponseFixture`). |

---

## 3. Anti-Swipe Matchmaking Mechanics

1. **Scenes (Situational Co-Presence)**:
   - Users check in to live verified events and partner spaces (geofence + venue QR/NFC).
   - Raw GPS is never stored. Only Scene-level presence is shared during the event + 6-hour Afterglow.
   - Users interact by sending **Waves** to contextual prompts ("Song of the night?").

2. **Co-Op Quests (Collaborative Niche Missions)**:
   - Asynchronous 48–72h micro-challenges in crews of 4–6 based on the Niche Depth Graph.
   - Progressive photo reveal as collaboration occurs.
   - Private mutual Kudos promotes pairs into conversations with shared artifacts.

---

## 4. Verification & Running Commands

```bash
# Run automated tests across all internal packages and apps
pnpm test

# Run strict TypeScript typecheck across all workspaces
pnpm typecheck

# Build shared contracts and BFF
pnpm --filter @internal/contracts build
pnpm --filter @resonance/bff-mobile build

# Run NestJS BFF locally
pnpm --filter @resonance/bff-mobile dev

# Start React Native Mobile app
pnpm --filter @resonance/mobile start
```
