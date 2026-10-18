---
name: rn-stuff-sdui-engine
description: Enforces Server-Driven UI (SDUI) schema rules, zero hardcoded domain screens in apps/mobile, DynamicComponentRegistry mappings, and 60/120 FPS native animations. Triggers when creating or modifying UI screens, components in @internal/ui-kit, or schemas in @internal/contracts.
---

# RN-Stuff SDUI & UI-Kit Architecture Rules

## 1. Zero Hardcoded Domain Screens in `apps/mobile`
- NEVER create domain-specific screens (Medical, E-Commerce, Streaming, UPI Payments, Banking, Energy, 311, Chat, Delivery, Cloud Storage, Mobility, Reels) inside `apps/mobile/src/`.
- `apps/mobile` is strictly a lightweight host shell providing `MultiNavigator`, `BiometricLockOverlay`, `GlobalErrorBoundary`, and root providers.
- All domain UIs and dual-persona layouts (e.g., Patient/Caregiver, Shopper/Merchant, Citizen/Ward Engineer) must be declared via `DynamicPageDefinition`, `DynamicSectionDefinition`, and `DynamicComponentDefinition` schemas in `@internal/contracts` and rendered at runtime by `UniversalDynamicPage`.

## 2. DynamicComponentRegistry & Virtualized List Standards
- Every new UI primitive in `@internal/ui-kit` must be registered with a typed token in `DynamicComponentRegistry` (alongside `METRIC_CARD`, `ENTITY_LIST`, `STATUS_BANNER`, `TOGGLE_ROW`, `ACTION_BUTTON`).
- Lists must use `OptimizedFlatList` or `OptimizedSectionList` with fixed or token-mapped `getItemLayout` offset precomputation, `initialNumToRender={10}`, `maxToRenderPerBatch={10}`, `windowSize={5}`, and `removeClippedSubviews={Platform.OS === 'android'}`.
- Wrap complex list filters and action handlers in `useMemo` and `useCallback`, and expose programmatic scroll controls (`scrollToIndex`, `scrollToOffset`) via `forwardRef`.

## 3. Animation & Hardware BackHandler Rules
- All animations (`useScalePressAnimation`, `useFadeAnimation`, `useSlideAnimation`) MUST set `useNativeDriver: true` to run at 60/120 FPS on the native UI thread.
- Any new modal sheet, drawer, or secondary persona view must integrate with `useHardwareBackHandler` following the 4-tier priority: (1) close modal/drawer, (2) revert secondary persona to primary persona, (3) navigate back to `DYNAMIC_SDUI`, (4) exit at root.
