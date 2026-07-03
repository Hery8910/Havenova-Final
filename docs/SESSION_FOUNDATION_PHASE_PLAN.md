# Session Foundation Phase Plan

## Objective

This phase exists to close the shared frontend foundation for all session-based apps before building role-specific business pages.

The immediate objective is:

- define one stable base for `auth + account complement`
- apply it consistently to `client`, `dashboard`, and `worker`
- verify the result with contract, runtime, integration, and visual checks

The final objective is:

- make the next app with the same requirements cheap to create
- keep maintenance predictable by reusing the same architecture, route grammar, provider wiring, and test strategy

## Closed Decisions

Canonical app composition:

- `client` = `AuthProvider + ProfileProvider`
- `dashboard` = `AuthProvider + AdminProvider`
- `worker` = `AuthProvider + WorkerProvider`

Reference implementation:

- `auth + profile` is the richest reference layer
- `profile` is not just an example; it is the baseline to copy when the pattern is reusable

Rules:

- `auth` owns session, refresh, logout, guards, and CSRF recovery
- complements own only role/profile data and role-specific preferences
- complements do not implement an independent auth lifecycle
- route groups must keep auth surfaces separate from protected app surfaces
- all apps should reuse the same shared route catalog and shell patterns when possible

## Scope Of This Phase

Included:

- shared auth/account architecture
- app structure for `client`, `dashboard`, and `worker`
- route contracts for `/user/*` and `/profile/*`
- user-facing auth flow contracts for public registration and invitation-only activation
- explicit shared/app boundary for auth extraction in the monorepo
- provider wiring and complement lifecycle alignment
- tests for auth and all three complements
- visual validation of auth and account/profile pages
- implementation documentation and closure criteria

Explicitly out of scope until this phase is closed:

- role-specific business pages beyond the shared auth/account base
- deep feature work for admin workflows
- deep feature work for worker workflows
- extra client-only product pages unrelated to session/account architecture

## Implementation Plan

### Phase 1. Normalize the target architecture

- remove or update stale documentation that still describes `dashboard` as `auth + worker`
- keep one canonical statement of app composition across docs
- ensure current tests reflect the real target architecture

Done when:

- architecture docs no longer contradict each other
- route/context contract tests reflect the intended target

### Phase 2. Define the shared app blueprint

- declare the common route grammar for all apps
- standardize auth route structure under `app/[lang]/(auth)/user/*`
- standardize protected account routes under `app/[lang]/(app)/profile/*`
- standardize layout/provider boundaries
- standardize which shell components are shared

Done when:

- the blueprint is documented
- route constants exist in shared code
- existing apps clearly map to that blueprint

### Phase 3. Build `apps/worker`

- scaffold a dedicated worker app
- reuse the shared auth shell and route contract
- mount `AuthProvider + WorkerProvider`
- wire same-origin BFF routes and server guards
- define the initial `/user/*` and `/profile/*` surfaces

Done when:

- `apps/worker` exists and boots from the shared pattern
- worker auth and account routes are structurally aligned with the other apps

### Phase 4. Align the complement contexts

- keep `ProfileProvider` as the behavioral reference
- reuse shared helpers wherever domain behavior matches
- make the public context shape converge across `profile`, `admin`, and `worker`
- isolate only the real domain-specific differences

Done when:

- the three complements have the same base lifecycle surface where applicable
- differences are documented and justified

### Phase 5. Close automated testing

- contract tests for route trees, provider boundaries, and BFF mounting
- runtime tests for `AuthProvider`, `ProfileProvider`, `AdminProvider`, and `WorkerProvider`
- integration checks for each app-level `auth + complement` composition
- visual test coverage for shared auth/account surfaces where tooling allows it

Done when:

- all three apps are covered by route/wiring contract tests
- all four contexts have runtime coverage
- auth/account flows have no untested architectural branch left open

### Phase 6. Close visual validation

- verify auth shells are consistent across apps
- verify profile/account pages share the same structural grammar
- verify desktop and mobile behavior
- verify loading, error, empty, offline, and redirected states

Done when:

- visual differences are intentional, not accidental
- screenshots or equivalent evidence exist for the shared flows

## Required Deliverables

- shared route catalog
- architecture documentation
- phase plan and closure criteria
- `apps/worker` scaffold
- aligned context public surfaces
- documented user-facing auth variants and per-route flow contracts
- route and context tests
- visual validation evidence or documented checklist results

## Completion Criteria

This phase can be declared complete only when all of the following are true:

1. `client`, `dashboard`, and `worker` follow the same auth/account blueprint.
2. `auth`, `profile`, `admin`, and `worker` use the same base lifecycle pattern where the domain allows it.
3. Route trees and provider boundaries are enforced by automated contract tests.
4. Runtime tests exist for the four core session contexts.
5. Shared auth and account/profile surfaces have been visually validated in desktop and mobile.
6. Architecture, decisions, and remaining intentional differences are documented in-repo.
7. Public-registration and invitation-only auth flows are documented at both variant and route level.
8. The codebase is ready to start role-specific page work without reopening session architecture decisions.

## Exit Rule

No role-specific page work should be treated as the next primary milestone until this phase is closed.

Reason:

- if auth/account structure remains unstable, every role-specific page built on top of it becomes more expensive to change and harder to test.
