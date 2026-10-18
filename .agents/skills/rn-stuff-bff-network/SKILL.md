---
name: rn-stuff-bff-and-network
description: Enforces NestJS BFF gateway conventions on port 4000, multi-datasource strategy switching, Swagger/Postman synchronization, and client Axios offline outbox retries. Triggers when editing apps/bff-mobile, @internal/network, @internal/config, or @internal/server-kit.
---

# Single-Server BFF Gateway & Network Middleware Rules

## 1. Single Unified Server (`apps/bff-mobile`)
- Do NOT spin up separate microservice servers; all 12 domain verticals live as modular NestJS modules inside `apps/bff-mobile` running on port `:4000`.
- Every domain service must respect the `ACTIVE_DATA_SOURCE` strategy pattern in `@internal/config` (`.env.development`, `.env.qat`, `.env.staging`, `.env.production`), switching cleanly between `mock`, `firebase` (Realtime DB with SQLite fallback), and `postgres` (PostgreSQL 16 + MongoDB + `RedisCacheService`).
- Tag all server logs with structured severity prefixes (`[INFO]`, `[WARN]`, `[ALERT]`) for the Super-Admin live stream.

## 2. Contract & API Documentation Synchronization
- Every new DTO or entity (`PatientSchedule`, `ProductItem`, `PaymentTxn`, etc.) must first be defined with Zod in `@internal/contracts`.
- Whenever a controller route or DTO changes in `apps/bff-mobile`, regenerate and update both the root `swagger-spec.json` (served at `/api/docs`) and `postman-collection.json` (v2.1).

## 3. Client Network & Offline Outbox (`@internal/network`)
- All client HTTP calls must pass through the `@internal/network` Axios pipeline:
  1. Request interceptor attaches bearer tokens, platform metadata, and `x-app-version` headers.
  2. Error interceptor traps HTTP `401` for single-flight token renewal via `@internal/auth` and HTTP `503` for the Super-Admin Maintenance Window screen.
  3. Idempotent requests use full-jitter exponential backoff, while offline mutations queue inside the local SQLite/MMKV outbox.
