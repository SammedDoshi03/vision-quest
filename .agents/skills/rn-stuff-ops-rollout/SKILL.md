---
name: rn-stuff-ops-rollout
description: >-
  Enforces Super-Admin Operational Console rules, circuit breakers, global feature killswitches,
  maintenance windows, and phased Expo/EAS OTA rollout rings (+25%/+50%/+100%).
  Triggers when editing admin console views, release automation, OTA update channels, or system health monitors.
triggers:
  - "killswitch"
  - "circuit breaker"
  - "OTA rollout"
  - "maintenance window"
  - "eas update"
  - "admin console"
---

# Super-Admin Operations, Circuit Breakers & Phased OTA Rollouts

This skill governs operational resilience, production killswitches, emergency maintenance modes, and phased Over-The-Air (OTA) updates across the 12 verticals in the `RN-Stuff` monorepo.

---

## 1. Phased Ring Rollouts (+25% / +50% / +100%)

To prevent regression blast radiuses when deploying Over-The-Air code pushes via EAS Update:
- **Never deploy directly to 100% of production users in a single push.**
- Follow the 4-phase rollout ring progression:
  1. **Internal Ring (0% Public):** Target channel `development` or `preview` for internal QA and automated Appium validation.
  2. **Canary Ring (10% - 25%):**
     ```bash
     eas update --channel production --branch canary-v1 --rollout 25
     ```
     Monitor error rates in `apps/bff-mobile` live logs and Sentry/Crashlytics for 4 hours.
  3. **Staged Ring (50%):**
     ```bash
     eas update --channel production --rollout 50
     ```
  4. **General Availability (100%):**
     ```bash
     eas update --channel production --rollout 100
     ```

---

## 2. Dynamic Feature Killswitches & Circuit Breakers

### Runtime Feature Gating (`@internal/config` & BFF)
Every third-party or high-load integration (e.g., UPI payments, HLS video streams, delivery dispatch, biometric sync) must be wrapped with a remote killswitch flag:
- In `apps/bff-mobile`, flags are evaluated with Redis sub-millisecond caching (`RedisCacheService`).
- If an upstream service latency exceeds `5000ms` or error rate exceeds `5%`, the circuit breaker trips from `CLOSED` to `OPEN`, immediately serving the fallback payload (e.g. cached catalog, offline schedule, or graceful degraded UI).

```typescript
// Example circuit breaker check pattern:
if (await this.featureFlagService.isKillswitchActive('UPI_PAYMENTS')) {
  return {
    status: 'DEGRADED',
    message: 'UPI Payments temporarily paused for maintenance. Net Banking and Cards available.',
    components: [/* SDUI Status Banner */],
  };
}
```

---

## 3. Emergency Maintenance Window (`HTTP 503`)

When scheduled DB migrations or critical infrastructure outages occur:
1. Super-Admin triggers `MAINTENANCE_MODE = true` in Redis.
2. `apps/bff-mobile` immediately responds to non-admin endpoints with `HTTP 503 Service Unavailable` with payload:
   ```json
   {
     "statusCode": 503,
     "error": "MaintenanceWindow",
     "message": "Platform upgrade in progress. Services resume shortly.",
     "estimatedEndTime": "2026-10-18T18:00:00Z"
   }
   ```
3. `@internal/network` error interceptor catches `503` and signals `UniversalDynamicPage` to render the localized `MaintenanceWindowView` without crashing the application shell.

---

## 4. Structured Telemetry & Audit Logs

All operational interventions (toggling killswitches, clearing Redis cache, initiating OTA pushes) must produce an audit trail:
- Log format: `[ALERT] [OPS_AUDIT] Admin: <user_id> Action: <action_type> Target: <vertical_name> Timestamp: <iso_time>`
- Logs stream into the Super-Admin Command Console live audit table.
