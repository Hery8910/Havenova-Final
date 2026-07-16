# Auth End-to-End Plan

## Purpose

This document redefines the unit of work for the `auth` domain in the frontend workspace.

The goal is no longer:

- make isolated `client` auth flows work

The goal is now:

- close `auth` as a full product domain from first user contact to dashboard consumption

That means `auth` is only considered complete when the same domain is coherent across:

- `apps/client`
- `apps/dashboard`
- shared frontend domain layers
- frontend BFF integration
- the backend session contract already documented in the backend repo

It also means the reusable base must support two different app complements:

- `apps/client` consumes `auth + profile`
- `apps/dashboard` consumes `auth + admin`
- `apps/worker` consumes `auth + worker`

## Closed Decision

Work should now advance by complete domain slices, not by app-only partial migrations.

For `auth`, the canonical slice is:

1. public auth entrypoints in `client`
2. authenticated session bootstrap
3. protected dashboard access and guards
4. dashboard-visible user/account identity
5. complement handoff where auth stops and the app-specific identity domain begins
6. shared documentation, tests, and BFF rules

This order is stricter and more reusable than treating `client` and `dashboard` as separate efforts.

## Why This Changes The Work Model

The current repo already proves that isolated progress on `client` is not enough:

- login/register/reset flows exist
- BFF auth routing already exists
- profile bootstrap already exists
- dashboard already consumes `AuthProvider`

But the domain is still not closed because:

- `dashboard` still has some residual naming and ownership cleanup between historical `profile` language and the current `admin` complement
- some historical planning docs still lag behind the current guard and route contracts
- the visual and structural dashboard shell still needs more real business pages before the account/complement model can be considered fully exercised
- documentation and tests are now much closer, but secondary docs still need periodic pruning to avoid reporting already-closed debt

Conclusion:

- finishing `auth` requires full end-to-end ownership
- this should be the template for later domains such as `profile`, `contact`, and `service-request`

## Current State Summary

### Already in Place

- same-origin auth BFF routes exist in `client` and `dashboard`
- auth browser services already use `/api/auth/*`
- session normalization already aligns on `authId` and `userClientId`
- `AuthProvider` already centralizes bootstrap, refresh, logout, and local persistence
- `dashboard` already mounts `AuthProvider`
- `dashboard` already shows auth-derived session state in shared UI such as header and navigation

### Not Closed Yet

- some secondary docs still describe already-closed dashboard auth debt and need continued pruning
- dashboard account semantics are closed at contract level, but the `/account/*` domain is still mostly placeholder-based
- the auth base is reusable, but its reproducibility should still be proven by building the next real protected domain pages on top of `admin` and `worker`

## Scope Of This Plan

This plan covers:

- auth BFF routes and same-origin browser contract
- session bootstrap rules
- login/logout/refresh/reset/verify flows
- dashboard access rules
- dashboard account identity surfaces
- `auth/profile` boundary for `client`
- `auth/admin` boundary for `dashboard`
- `auth/worker` boundary for `worker`
- shared auth documentation and tests

This plan does not try to finish unrelated dashboard business domains yet:

- requests
- objects
- task catalog
- notifications domain details
- property manager

Those domains may depend on auth, but they are not the first closure target.

## End-to-End Target For Auth

`auth` is considered closed only when all of this is true:

1. a public user can enter through `client` auth pages and complete the intended auth flow
2. the session is restored consistently through the frontend BFF
3. protected dashboard routes enforce login and role rules coherently
4. dashboard shell can render the authenticated identity without ad hoc fallback logic
5. `client` uses `profile` as its account complement, `dashboard` uses `admin`, and `worker` uses `worker`
6. logout and session expiry produce predictable transitions in both apps
7. documentation and tests describe the whole slice, not only one app

## Closed App Model

The reusable auth base now has a closed app model:

### `client`

- public registration is allowed
- auth entrypoints include `login`, `register`, `forgot-password`, `verify-email`, `set-password`
- account complement is `ProfileProvider`
- `profile` is the user-facing identity domain after auth

Composition target:

- `ClientProvider -> AuthProvider -> ProfileProvider`

### `dashboard`

- public registration is not allowed
- access is invitation-only
- auth entrypoints include `login` and `set-password`
- `set-password` must support admin invitation activation in addition to password reset
- account complement is `AdminProvider`
- `admin` is the dashboard-facing identity domain after auth
- the admin baseline should reproduce the proven shared session-complement pattern before diverging for dashboard-specific needs

Initial bootstrap rule:

- the first dashboard operator for a tenant is not created from dashboard UI
- the normal invitation model starts only after an initial backend bootstrap exists
- current preferred bootstrap path is backend-driven tenant admin invitation
- frontend must treat this as an explicit platform dependency, not as a missing register page to reintroduce

Composition target:

- `ClientProvider -> AuthProvider -> AdminProvider`

Important rule:

- `dashboard` should not depend on `ProfileProvider` as its canonical account complement
- admin invitation and activation should be built on the shared auth base, not as a parallel auth system
- `admin` should begin as a reproducible counterpart of `profile`, not as a bespoke one-off model

## Execution Phases

### Phase 0. Freeze The Domain Contract

Goal:

- define the canonical auth slice before more UI changes

Tasks:

- confirm the backend-auth session contract used by frontend
- confirm BFF auth routes as the only browser entrypoint
- document where `auth` ends and `profile` begins in `client`
- document where `auth` ends and `admin` begins in `dashboard`
- document where `auth` ends and `worker` begins in `worker`
- define the minimal role/access model required for dashboard
- freeze the access-mode split:
  - public self-registration in `client`
  - invitation-only activation in `dashboard`

Outputs:

- updated auth architecture docs
- explicit auth/profile boundary notes

### Phase 1. Audit Dashboard Auth Surfaces

Goal:

- identify every place where dashboard depends on session state

Tasks:

- audit `apps/dashboard` layouts, login page, root page, header, sidebar, and profile/account pages
- audit `apps/dashboard` layouts, login page, set-password page, root page, header, sidebar, and account pages
- classify each auth dependency as one of:
  - bootstrap
  - guard
  - display identity
  - role access
  - logout/session recovery
- identify which surfaces belong to auth and which belong to worker

Outputs:

- dashboard auth inventory
- ownership map per surface

Status:

- initial audit completed in
  [docs/AUTH_DASHBOARD_AUDIT.md](/home/heriberto/Escritorio/Havenova/havenova/docs/AUTH_DASHBOARD_AUDIT.md:1)

### Phase 2. Close Access Architecture

Goal:

- stop treating route protection as page-by-page incidental logic

Tasks:

- define the canonical dashboard protected shell behavior
- centralize login-required and role-required behavior where possible
- define expected transitions for:
  - guest trying to enter dashboard
  - expired session
  - authenticated user without required role
  - successful login returning to dashboard
  - invited worker activating account through `set-password`

Outputs:

- dashboard auth guard policy
- reduced guard duplication

### Phase 3. Close Account Identity Surfaces

Goal:

- make dashboard visibly reflect the authenticated user consistently

Tasks:

- review `DashboardHeader`, `Sidebar`, dashboard profile pages, and related account UI
- define which fields come from `auth`
- define which fields come from `worker`
- define the minimum worker baseline by mirroring the already-stable profile pattern
- remove presentation defaults that still depend on the wrong domain when possible

Outputs:

- clear session-vs-profile rendering rules
- stable account identity surface in dashboard

### Phase 4. Refactor Dashboard Auth UX Structure

Goal:

- fix the structural/auth UX base of dashboard without trying to redesign every business page first

Tasks:

- adjust dashboard layout/auth shell to represent real auth lifecycle states
- correct navigation/auth affordances where architecture is currently weak
- align the dashboard login flow with the same reusable auth domain rules already used in `client`
- adapt dashboard `set-password` to the invitation flow already supported by backend

Outputs:

- dashboard auth shell aligned with the domain contract
- less ad hoc auth behavior across dashboard routes

### Phase 5. Validate Flow End-to-End

Goal:

- test auth as a single domain, not as disconnected pages

Core scenarios:

- register in `client`
- login in `client`
- restore session on reload
- enter protected dashboard as authenticated user
- activate invited worker through `dashboard` `set-password`
- see worker identity in dashboard
- logout from dashboard
- recover from expired session
- verify email / magic login / set-password paths where applicable

Outputs:

- updated test checklist
- new or updated contract tests where shared logic is involved
- manual validation matrix for both apps

### Phase 6. Freeze The Reusable Auth Base

Goal:

- leave behind a reproducible auth foundation for future projects

Tasks:

- update README/audit/strategy documents
- classify remaining auth debt as:
  - blocking
  - transitional
  - deferred
- document the migration recipe for later domains that must plug into the same BFF/session base

Outputs:

- stable auth baseline
- reusable implementation notes for future projects

## Immediate Next Work Order

The next implementation pass should not start with random auth pages.

It should start in this order:

1. audit dashboard auth surfaces and ownership
2. define dashboard guard model and protected shell behavior
3. normalize dashboard `auth -> admin` identity surfaces
4. adapt `set-password` to reset + invitation activation
5. then adjust UI/architecture where the audit proves it is necessary

## Success Criteria

This plan is successful when:

- auth is described and implemented as one domain across `client` and `dashboard`
- session lifecycle rules are explicit and testable
- dashboard no longer behaves like a separate improvised auth consumer
- future domains can reuse the same BFF/session/access foundation
