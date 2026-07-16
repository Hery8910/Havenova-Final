# Session Complement Architecture

## Objective

This document defines the repeatable frontend pattern for session-aware identity complements layered on top of `AuthProvider`.

The goal is to keep the next apps easy to build and easy to maintain by reusing the same base architecture.

Related route contract:

- [SESSION_ROUTE_CONTRACT.md](/home/heriberto/Escritorio/Havenova/havenova/docs/SESSION_ROUTE_CONTRACT.md:1)

Execution plan for the current consolidation phase:

- [SESSION_FOUNDATION_PHASE_PLAN.md](/home/heriberto/Escritorio/Havenova/havenova/docs/SESSION_FOUNDATION_PHASE_PLAN.md:1)

## Canonical Composition

- `client` = `AuthProvider + ProfileProvider`
- `dashboard` = `AuthProvider + AdminProvider`
- `worker` = `AuthProvider + WorkerProvider`

Rule:

- `auth` owns session, bootstrap, refresh, logout, and access control
- each complement owns only role-specific identity/profile data and preferences
- complements must not implement their own session lifecycle outside `refreshAuth()`

## Reference Layer

`auth + profile` is the reference implementation.

Why:

- it already defines the richest public state
- it already distinguishes `source`, `isOffline`, and `lastSyncAt`
- it already resolves bootstrap, storage hydration, optimistic local updates, and server resync
- it already centralizes auth recovery through `refreshAuth()`

## Shared Complement Pattern

`admin` and `worker` now share a common base hook:

- [useSessionComplement.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/sessionComplement/useSessionComplement.ts:1)

This shared base gives both contexts the same lifecycle shape:

- local storage scoped by `clientId + userClientId`
- initial local default bootstrap
- logout fallback reset
- remote reload
- optimistic local update
- retry after `401/403` using `refreshAuth()`
- offline degradation to `source = storage`
- shared metadata:
  - `loading`
  - `source`
  - `isOffline`
  - `lastSyncAt`

## Current Roles Of Each Complement

### `ProfileProvider`

- reference implementation
- supports richer domain bootstrap
- can create the backend profile after `404 USER_CLIENT_PROFILE_NOT_FOUND`
- keeps the most complete normalization logic

### `AdminProvider`

- dashboard complement for admin identity and preferences
- now follows the same base lifecycle shape as `worker`
- mounted only inside the authenticated dashboard app tree
- uses `/account/*` as the canonical protected namespace for admin-facing account surfaces

### `WorkerProvider`

- worker complement for the dedicated `apps/worker` surface
- still provides worker-specific data and preferences
- follows the same base lifecycle shape as `admin`
- is no longer the dashboard account complement

## CSRF Contract

The auth/session layer now follows the backend contract documented in:

- [FRONTEND_CSRF_HANDOFF.md](/home/heriberto/Escritorio/Backend/backend/src/core/auth/FRONTEND_CSRF_HANDOFF.md:1)

Applied rule:

- `x-csrf-token` lives in memory only
- frontend rehydrates CSRF by reading authenticated responses such as `GET /api/auth/me`
- complements never infer CSRF state from readable cookies

## Testing Strategy

Testing is split into two levels:

- contract tests:
  - verify app wiring, BFF mounting, and architectural boundaries
- context behavior tests:
  - verify runtime lifecycle of `AuthProvider`, `ProfileProvider`, `AdminProvider`, and `WorkerProvider`

Current intent:

- keep `auth` tests focused on session recovery and source state
- keep `profile` tests focused on bootstrap richness and profile creation behavior
- keep `admin` and `worker` tests focused on the shared session-complement lifecycle

## Maintenance Rule

When a new app needs `auth + role-complement`, the implementation should start from this pattern:

1. reuse `AuthProvider`
2. decide whether the new complement matches the shared `sessionComplement` base
3. expose the same public shape when possible:
   - entity
   - loading
   - source
   - isOffline
   - lastSyncAt
   - reload
   - update
   - `setLanguage`
   - `setTheme`
   - `setProfileImage`
4. only add role-specific behavior where the domain really differs

That keeps the architecture stable without forcing every domain to be identical in business behavior.
