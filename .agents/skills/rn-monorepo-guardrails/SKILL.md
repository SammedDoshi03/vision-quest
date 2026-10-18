---
name: rn-monorepo-guardrails
description: >-
  Strict architectural guardrails, dependency management rules, Metro configuration protection,
  and native isolation standards for the Resonance React Native and TypeScript monorepo.
  Activate when adding/modifying dependencies, configuring Metro/Babel/TypeScript,
  importing shared packages across apps and packages, or modifying native mobile code.
triggers:
  - "install dependency"
  - "add package"
  - "metro.config.js"
  - "workspace import"
  - "native module"
  - "react-native upgrade"
  - "pnpm add"
---

# React Native Monorepo Guardrails: Resonance Monorepo

This workspace is a high-performance React Native and TypeScript monorepo orchestrated with **Turborepo** and powered by **pnpm@9.12.0** workspaces.

### Workspace Architecture Reference

- **Package Manager:** `pnpm@9.12.0`
- **Monorepo Orchestrator:** Turborepo (`turbo.json`)
- **Apps:**
  - `@resonance/mobile` (`apps/mobile`): React Native 0.76.1 (New Architecture enabled), React 18.3.1, Expo CNG/Managed (`app.json`, `eas.json`)
  - `@resonance/bff-mobile` (`apps/bff-mobile`): NestJS Mobile Backend-for-Frontend
- **Shared Packages Scope:** `@internal/*` (`packages/*`)
  - `@internal/a11y` (`packages/a11y`)
  - `@internal/auth` (`packages/auth`)
  - `@internal/config` (`packages/config`)
  - `@internal/contracts` (`packages/contracts`)
  - `@internal/network` (`packages/network`)
  - `@internal/server-kit` (`packages/server-kit`)
  - `@internal/testing` (`packages/testing`)
  - `@internal/ui-kit` (`packages/ui-kit`)

---

## 1. Workspace Dependency Commands

### ⛔ FORBIDDEN
- **NEVER** run bare `npm install`, `yarn add`, or `pnpm add` inside package subdirectories (`cd apps/mobile && pnpm add ...`). Doing so breaks workspace symlinks, corrupts `pnpm-lock.yaml`, and creates unhoisted or duplicate `node_modules`.
- **NEVER** use `npm` or `yarn` anywhere in this repository.

### ✅ MANDATORY ROOT COMMANDS
All dependency additions and updates must be executed from the monorepo root using `pnpm --filter`:

```bash
# Adding an external dependency to the mobile app (@resonance/mobile):
pnpm --filter @resonance/mobile add <package-name>
pnpm --filter @resonance/mobile add -D <package-name>

# Adding an internal shared package to mobile:
pnpm --filter @resonance/mobile add @internal/ui-kit@workspace:*

# Adding an internal package to another internal package:
pnpm --filter @internal/ui-kit add @internal/contracts@workspace:*

# Adding dependencies to shared packages (@internal/*):
pnpm --filter @internal/network add axios
pnpm --filter @internal/ui-kit add -D @types/react

# Adding a repo-wide tool to the workspace root:
pnpm add -w -D <tool-name>
```

---

## 2. Native vs. Pure JS Dependency Isolation

### Native Dependency Containment
Any library containing native iOS or Android code (e.g. TurboModules, Fabric components, C++ JSI bindings, Kotlin, Swift, or Objective-C) **MUST** be declared directly in `apps/mobile/package.json`.
- **Why:** Autolinking (Expo Config Plugins, React Native CLI autolinking, CocoaPods, and Gradle) discovers native modules by inspecting the mobile app target's dependency tree. Installing native libraries only inside `@internal/*` will cause link failures at build time.
- Examples of native packages that belong strictly in `apps/mobile/package.json`:
  - `react-native-reanimated`
  - `react-native-gesture-handler`
  - `react-native-safe-area-context`
  - `react-native-screens`
  - `expo-camera`, `expo-notifications`, `expo-local-authentication`

### Shared Packages Isolation (`packages/*`)
Shared packages (such as `@internal/ui-kit` and `@internal/a11y`) must remain purely JavaScript/TypeScript:
- `react` and `react-native` must **ONLY** be listed under `peerDependencies` and `devDependencies`.
- **NEVER** declare `react` or `react-native` under `dependencies` inside any `packages/*` package.

```json
// Correct packages/ui-kit/package.json pattern:
{
  "name": "@internal/ui-kit",
  "peerDependencies": {
    "react": "*",
    "react-native": "*"
  },
  "devDependencies": {
    "react": "^18.3.1",
    "react-native": "^0.76.1"
  }
}
```

---

## 3. Single Version Policy (Singleton Enforcement)

To prevent runtime crashes caused by duplicate React instances (such as `"Invalid hook call"` or `"Multiple instances of React Native detected"`), core singletons must have identical version constraints across all `package.json` files in the monorepo:

| Package | Workspace Version Standard |
| :--- | :--- |
| `react` | `^18.3.1` (or matching exact version) |
| `react-native` | `^0.76.1` |
| `react-native-reanimated` | Single unified version across monorepo |
| `react-native-gesture-handler` | Single unified version across monorepo |
| `react-native-safe-area-context`| Single unified version across monorepo |
| `typescript` | `^5.6.3` across all packages |

- When updating any of these singletons, update all occurrences across `apps/mobile/package.json` and all `packages/*/package.json` devDependencies simultaneously.

---

## 4. Metro Bundler & Symlink Protection

`apps/mobile/metro.config.js` is configured to resolve monorepo symlinks and hoisted root `node_modules`.

### Immutable Configuration Rules:
1. **Never remove `watchFolders`:**
   ```javascript
   const root = path.resolve(__dirname, '../..');
   watchFolders: [root]
   ```
   Removing `watchFolders` breaks Metro's ability to watch and bundle files in `packages/*`.

2. **Never strip `resolver.nodeModulesPaths`:**
   ```javascript
   resolver: {
     nodeModulesPaths: [
       path.resolve(__dirname, 'node_modules'),
       path.resolve(root, 'node_modules'),
     ],
   }
   ```
   Both the local `apps/mobile/node_modules` and monorepo root `node_modules` must be present.

3. **Hoisted Gradle & CocoaPods Paths:**
   If native builds or Expo Prebuild are triggered, ensure Gradle resolution in `android/settings.gradle` and `android/app/build.gradle` references hoisted node_modules (`../../node_modules` or `../../../node_modules` relative to the monorepo root).

---

## 5. Strict Workspace Imports

### ⛔ FORBIDDEN: Deep Relative Cross-Boundary Imports
```typescript
// NEVER DO THIS:
import { Button } from '../../../packages/ui-kit/src/Button';
import { theme } from '../../packages/config/src/theme';
```

### ✅ MANDATORY: Scoped Package Specifiers
Always import across package boundaries using the official workspace package name and configured exports:

```typescript
// ALWAYS DO THIS:
import { Button } from '@internal/ui-kit';
import { FeedCard } from '@internal/ui-kit/feed';
import { ApiResponse } from '@internal/contracts';
```

### TypeScript Project References & Aliases
- Ensure `tsconfig.json` in consuming packages references the base configuration (`../../packages/config/tsconfig.react.json` or `../../tsconfig.base.json`).
- Package entry points must be mapped through `exports` or `main`/`types` fields in the respective package's `package.json`.
