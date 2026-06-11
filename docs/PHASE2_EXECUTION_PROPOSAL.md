# Phase 2 Execution Proposal

## Purpose

This document defines the concrete execution proposal for Phase 2 of the frontend consolidation:

- break structural blockers
- classify legacy surfaces
- prepare the repo for domain cleanup on stable rules

This is the first implementation-oriented step after:

- [docs/FRONTEND_ARCHITECTURE_AUDIT.md](/home/heriberto/Escritorio/Havenova/havenova/docs/FRONTEND_ARCHITECTURE_AUDIT.md:1)
- [docs/FRONTEND_TARGET_ARCHITECTURE.md](/home/heriberto/Escritorio/Havenova/havenova/docs/FRONTEND_TARGET_ARCHITECTURE.md:1)
- [docs/DOCUMENTATION_STANDARD.md](/home/heriberto/Escritorio/Havenova/havenova/docs/DOCUMENTATION_STANDARD.md:1)

## Scope

Phase 2 does not aim to clean every feature.

It aims to remove the structural blockers that keep every later cleanup expensive.

Priority scope:

1. break the `components <-> contexts` cycle
2. classify legacy surfaces
3. define canonical folder destinations
4. prepare the repository for rendering and domain cleanup

## Execution Status

This proposal is no longer only planned work.

The following Phase 2 items have already been executed in the current repository state.

### Completed structural changes

#### 1. `components <-> contexts` cycle broken at the verified points

Completed:

- alert rendering ownership moved out of `packages/contexts/alert`
- client bootstrap loading ownership moved out of `packages/contexts/client`
- `packages/contexts/package.json` no longer depends on `@havenova/components`

Concrete result:

- `contexts` now exposes behavior and state
- layouts mount UI companions such as the alert viewport and bootstrap loading fallback

#### 2. Legacy source surfaces removed

Completed:

- `packages/components/dist/*` removed from source control
- legacy shim under `packages/components/user/*` removed after confirming no active consumers

Concrete result:

- less search noise
- lower accidental import risk
- clearer canonical ownership

#### 3. Shared boundary between `client/pages/shared` and `client/shared` formalized

Completed:

- `packages/components/client/pages/shared/index.ts` no longer re-exports `client/shared`
- `addressFormFields` remains canonical in `packages/components/client/shared/addressFormFields`

Concrete result:

- `client/pages/shared` is now limited to page-feature shared UI
- `client/shared` is reserved for cross-domain reusable primitives

#### 4. App imports normalized to canonical barrels

Completed:

- `apps/client` imports for `client/pages/*` and `client/user/*` were normalized to barrel surfaces
- `apps/dashboard` imports for `dashboard/*` were normalized to barrel surfaces
- deep imports from `packages/contexts/*` and `packages/utils/*` were reduced where canonical barrels already exist

Concrete result:

- `apps` now consume clearer public APIs instead of file-path internals
- public component and context surfaces are more explicit and testable

#### 5. Canonical export surfaces expanded where needed

Completed:

- `packages/components/dashboard/index.ts` now exposes the consumed dashboard surfaces more completely
- `packages/components/dashboard/contactMessages/index.ts` was added
- `packages/components/dashboard/propertyManagers/index.ts` now exports `PropertyManagerFormValues`
- `packages/contexts/alert/index.ts` now exports `useAlert` and `alert.types`

Concrete result:

- missing public exports no longer force apps to bypass canonical barrels

#### 6. `services` and `types` canonical surfaces normalized

Completed:

- `apps` and shared packages were moved away from deep imports such as `packages/services/client/*` and `packages/types/*/*Types`
- `packages/types/index.ts` now exposes `./api` as part of the canonical root surface
- the `globalTaskCatalog` domain no longer exports a second conflicting `ApiResponse` under the generic name

Concrete result:

- root barrels in `packages/services` and `packages/types` are now usable as real public surfaces
- a type-name collision in the public API was removed by renaming the catalog-specific response type to `GlobalTaskCatalogApiResponse`
- deep imports that remain are limited to test fixtures that intentionally target concrete files

## Confirmed Blockers

## 1. `components <-> contexts` cycle

Confirmed sources:

- [packages/contexts/package.json](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/package.json:1)
- [packages/components/package.json](/home/heriberto/Escritorio/Havenova/havenova/packages/components/package.json:1)

Concrete imports already verified:

- [AlertContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/alert/AlertContext.tsx:1) imports `AlertWrapper` from `@havenova/components`
- [ClientContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/client/ClientContext.tsx:1) imports `Loading` from `@havenova/components`

Interpretation:

- the cycle is not abstract; it is caused by specific UI dependencies inside contexts

## 2. Legacy or ambiguous source surfaces

Confirmed examples:

- `packages/components/user/*`

Resolved during Phase 2:

- legacy compiled output under `packages/components/dist/*` was removed after confirming there were no active consumers

Interpretation:

- the codebase still exposes non-canonical surfaces inside source control
- this increases accidental imports and architectural ambiguity

## 3. App-level imports still bypass the future platform boundary

Example:

- [apps/client/app/[lang]/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/layout.tsx:1) imports `CookieBannerContainer` directly from `packages/components/cookieBanner`

Interpretation:

- not necessarily wrong, but it shows we still need clearer canonical import surfaces and ownership rules

## Execution Strategy

Phase 2 should be executed in three technical waves.

## Wave 1. Break the cycle with minimal risk

Objective:

- remove the direct dependency from `contexts` to broad `components`

### Proposed approach

#### A. Move alert rendering ownership out of `contexts`

Current state:

- `AlertContext` owns both alert state and direct rendering through `AlertWrapper`

Target:

- `AlertContext` owns state only
- a dedicated UI bridge in the component layer renders the active alert

Possible shape:

- `packages/contexts/alert` exposes state and actions
- `packages/components/alert` exposes a renderer/provider companion
- app layouts mount the renderer explicitly

Expected effect:

- `contexts` no longer needs `@havenova/components` for alert UI

#### B. Remove `Loading` UI dependency from `ClientContext`

Current state:

- `ClientContext` renders loading UI directly

Target:

- `ClientContext` exposes state
- the visual fallback/loading surface is provided by the app or by a narrow injected renderer

Options:

1. pass fallback components from app composition
2. create a lower-level minimal primitive package
3. keep a local context-owned fallback component and avoid `@havenova/components`

Recommended option:

- short term: keep fallback UI local to the context package if needed
- long term: move platform-neutral loading primitives to a lower-level UI surface

#### C. Re-check package manifests after import cleanup

Expected result:

- `@havenova/contexts` should no longer depend on `@havenova/components`

## Wave 2. Classify and freeze legacy surfaces

Objective:

- stop legacy from expanding while cleanup is in progress

### Proposed actions

#### A. Create a legacy inventory

At minimum classify:

- `packages/components/dist`
- malformed or outdated folders
- compatibility aliases still present in types and contexts

For each item assign:

- canonical
- transitional
- deprecated
- removable

#### B. Freeze deprecated paths

Rule:

- deprecated paths receive no new code
- transitional paths may receive only migration-oriented changes

#### C. Add canonical import guidance

We should define which barrel or folder is the official import surface for:

- alert
- cookie banner
- loading primitives
- user auth/profile form surfaces

## Wave 3. Prepare canonical destinations

Objective:

- make future cleanup predictable

### Proposed decisions to formalize

#### A. Platform UI vs feature UI

Separate:

- platform UI:
  - alert renderer
  - loading primitives
  - cookie banner shell if truly shared
- feature UI:
  - route or domain-specific components

#### B. User domain split

Current structure already trends this way:

- `client/user/auth`
- `client/user/profile`

We should preserve this split and continue removing mixed ownership.

#### C. Shared feature inputs

Things like address fields should live in explicit shared feature folders only if they are truly cross-domain.

## Proposed Order Of Work

This is the recommended sequence.

### Step 1. Alert cycle extraction

Why first:

- isolated surface
- clearly identified dependency
- high architectural value

Deliverable:

- `AlertContext` stops importing `AlertWrapper`

### Step 2. Client bootstrap UI extraction

Why second:

- same category of problem
- closes the second verified cycle point

Deliverable:

- `ClientContext` stops importing broad UI from `components`

### Step 3. Package manifest cleanup

Why third:

- validates that the real cycle is gone

Deliverable:

- `@havenova/contexts` manifest no longer depends on `@havenova/components`

### Step 4. Legacy inventory document

Why fourth:

- after the layer boundary is cleaner, legacy classification becomes easier and less noisy

Deliverable:

- a dedicated legacy inventory doc with status per surface

### Step 5. Canonical import surface proposal

Why fifth:

- ensures that later migrations don’t reopen ambiguity

Deliverable:

- a short standard or audit appendix with official import surfaces

## Remaining Phase 2 Work

Phase 2 is materially advanced but not fully complete.

Next remaining areas:

1. review canonical surfaces in `packages/services/*`
2. review canonical surfaces in `packages/types/*`
3. continue documenting the resulting public API rules

Updated status:

- items `1` and `2` are now materially advanced for current active consumers
- the next useful step is to continue documenting the resulting API rules and identify whether any remaining transitional domains should be renamed or reduced

## Risks

## 1. Hidden UI dependencies inside contexts

Risk:

- removing `components` dependency may reveal more context-owned rendering than expected

Mitigation:

- attack one context at a time
- validate imports before changing manifests

## 2. Over-designing a new platform layer too early

Risk:

- trying to invent a perfect new package taxonomy before removing the current blocker

Mitigation:

- keep Wave 1 minimal and surgical

## 3. Freezing legacy without an inventory

Risk:

- contributors keep using old paths because nothing says they are deprecated

Mitigation:

- create the legacy inventory immediately after the cycle is broken

## Decision On Integration Documents

From this phase onward, any service or domain that depends on a backend contract should plan to have a dedicated integration document.

This matters especially for:

- auth
- client bootstrap
- profile
- service request flows
- notifications

Reason:

- the repo needs a stable way to verify that frontend services remain aligned with domain contracts

## Recommendation

Do not start Phase 2 by moving many folders at once.

Start by removing the cycle through the two verified context/UI dependencies:

1. alert rendering
2. client bootstrap loading/fallback rendering

That gives the highest structural return with the lowest immediate migration blast radius.
