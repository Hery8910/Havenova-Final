# Frontend Target Architecture

## Purpose

This document defines the target architecture for the Havenova frontend workspace.

It exists to stop the current pattern of incremental, partially-compatible growth and replace it with a controlled cleanup strategy.

This is not a greenfield rewrite plan.

It is a reorganization and cleanup plan for an existing project with substantial legacy, partial migrations, and compatibility residue.

## Context

The project has evolved for a long time and accumulated:

- mixed architectural styles
- partial refactors
- compatibility layers that were never fully retired
- repeated patterns with different ownership rules
- growing documentation without a single standard

The goal is not to restart from zero.

The goal is:

- organize the project as a reusable platform
- remove unnecessary legacy
- reduce ambiguous ownership
- make future work cheaper and safer
- prepare a solid baseline for controlled deployment

## Closed Principles

### 1. No infinite compatibility

Compatibility is allowed only as a transition tool.

It is not an architectural destination.

That means:

- compatibility aliases must be explicit
- every compatibility layer must have a cleanup destination
- no new feature should deepen old compatibility unless it is strictly required for migration safety

### 2. No silent legacy

Legacy code or structure must be one of these:

- canonical
- transitional
- deprecated
- removable

There should be no ambiguous “old but maybe still used” surface.

### 3. No feature work over unclear ownership

If ownership is unclear between:

- route
- feature
- domain
- shared UI
- platform layer

the ownership rule must be clarified before further expansion.

### 4. Platform before polish

For deployment, architecture quality matters more than continued local feature improvisation.

UI polish, additional feature growth, and isolated improvements should not outrun structural cleanup.

## Architecture Goals

The frontend should converge toward:

- clear dependency direction
- predictable file ownership
- server-first route composition
- reusable domain modules
- explicit documentation contracts
- bounded migrations

## Target Layer Model

## 1. Apps Layer

Location:

- `apps/client`
- `apps/dashboard`

Responsibility:

- route composition
- layouts
- app-specific shells
- metadata
- route-level SSR composition
- app-specific navigation wiring

Should contain:

- `page.tsx`
- `layout.tsx`
- route wrappers
- app-entry composition

Should not contain:

- reusable domain logic
- shared validation rules
- backend contract mapping logic
- cross-app platform behavior

## 2. Platform Domain Layer

Location candidates:

- `packages/contexts`
- `packages/services`
- `packages/types`
- parts of `packages/utils`

Examples:

- auth
- alert
- client/tenant bootstrap
- profile
- i18n

Responsibility:

- state orchestration
- domain contracts
- API integration
- runtime policies
- flow rules

This is the layer that must become reusable across future projects.

## 3. Feature UI Layer

Location:

- `packages/components/client/pages/*`
- `packages/components/dashboard/*`
- domain-specific feature folders

Responsibility:

- feature composition
- client-side interaction for concrete experiences
- feature view models when not globally shared

Examples:

- cleaning request form
- profile settings client surface
- dashboard requests page UI

Rule:

- feature UI can depend on platform domains
- platform domains should not broadly depend on feature UI

## 4. Shared UI Layer

Location:

- `packages/components/client/shared/*`
- lower-level reusable component surfaces

Responsibility:

- presentational or reusable UI blocks
- domain-neutral field groups
- low-level interactive primitives when not app-specific

Examples:

- shared address fields
- reusable selectors
- reusable popup primitives

Rule:

- shared UI must stay small and explicit
- “shared” must not become a dump for unclear ownership

### Shared UI Boundary Rule

The workspace uses two different shared surfaces on purpose:

- `packages/components/client/pages/shared/*`
- `packages/components/client/shared/*`

Ownership rule:

- `client/pages/shared/*` is only for UI shared by page-oriented client features
- `client/shared/*` is for domain-neutral reusable primitives that may be consumed by multiple feature families

Concrete rule:

- `client/pages/shared` must not re-export primitives from `client/shared`
- if a surface is reused across page features and user/profile flows, it belongs in `client/shared`

Current canonical example:

- `packages/components/client/shared/addressFormFields/*`

## 5. Pure Utility Layer

Location:

- `packages/types`
- `packages/utils`
- parts of `packages/hooks`

Responsibility:

- pure types
- pure helpers
- stateless validation
- reusable hooks without strong domain ownership

Rule:

- `types` should not depend on runtime layers
- pure utilities should remain framework-light whenever possible

## Target Dependency Direction

The target dependency direction is:

- `apps/*` -> any canonical shared package
- `components` -> `hooks`, `types`, `utils`, selected `contexts`
- `contexts` -> `services`, `types`, `utils`, selected `hooks`
- `services` -> `types`, low-level API utilities
- `hooks` -> `types`, `utils`, selected `contexts`
- `types` -> nothing

Forbidden or strongly discouraged direction:

- `contexts` -> broad `components`
- `types` -> `services` or `contexts`
- platform domain layers -> feature page UI

## Critical Structural Rule

The current cycle between `@havenova/components` and `@havenova/contexts` must be removed.

Target rule:

- contexts define behavior
- components render behavior

If a context needs a visual fallback or primitive:

- either move the primitive into a lower-level UI package
- or invert control so the app or component layer provides the UI

The default solution should not be “contexts import broad components”.

## Canonical Folder Ownership

## 1. Route files

Canonical owner:

- `apps/*/app/...`

Use for:

- page composition
- route metadata
- server-side wrappers
- route-specific shell decisions

## 2. Reusable domains

Canonical owner:

- `packages/contexts/*`
- `packages/services/*`
- `packages/types/*`
- `packages/utils/*`

Use for:

- auth
- profile
- alert
- tenant/client bootstrap
- notifications

## 3. App-specific feature UI

Canonical owner:

- `packages/components/client/pages/*`
- `packages/components/dashboard/*`

Use for:

- page feature blocks
- multi-step forms
- app-specific dashboard modules

Import rule:

- apps should import these surfaces through the nearest canonical barrel
- deep file-path imports are allowed only when a barrel does not exist yet
- when a deep import becomes necessary more than once, expose it through the canonical barrel instead of multiplying file-path imports

## 4. Shared primitives

Canonical owner:

- `packages/components/client/shared/*`
- small dedicated shared component folders

Use only when:

- the component is reused across domains
- the ownership is clearly not route-specific
- the API is stable enough to justify reuse

## Legacy Policy

The repo contains legacy or transitional surfaces that must be classified.

Known examples:

- `packages/components/dist`
- old compatibility shims such as `packages/components/user`
- compatibility aliases in domain models

Every such surface must be assigned one label:

### Canonical

Still active and should keep receiving changes.

### Transitional

Still needed temporarily, but new work should move elsewhere.

### Deprecated

Should not receive new work and should be scheduled for removal.

### Removable

Can be deleted once verified unused.

## Rendering Strategy

## Default Rule

Every route should be server-first by default.

That means:

- `page.tsx` should start as a server component
- client behavior should live in a dedicated client container when needed

## Client Containers

Use a client container when:

- the feature requires React state/effects
- the feature depends on browser-only APIs
- the feature integrates contexts that require client execution

Preferred pattern:

- server route file
- client feature container
- presentational subcomponents below that boundary

## Suspense Rule

Use `Suspense` only when:

- a route or subtree genuinely benefits from async boundary handling
- search params or nested async client behavior require it

Do not use `Suspense` as a decorative wrapper without boundary semantics.

## Skeleton Rule

Use skeletons when:

- a mounted client subtree is loading or refreshing local data

Do not use skeletons as a substitute for server/client architecture decisions.

## Wrapper Pattern Rule

The project currently mixes:

- server wrapper + client container
- page-level client component
- wrapper + view split
- direct feature rendering

Target rule:

- use wrapper + view split when logic is non-trivial
- do not force wrapper + view for tiny presentational pieces
- use server route + client container for route-level interactivity

The pattern should be applied intentionally, not stylistically.

## Documentation Model

## Root Rule

Documentation must become part of the architecture.

It should not be treated as optional historical commentary.

## Canonical document types

Use:

- `README.md`
- `*_AUDIT.md`
- `*_STANDARD.md`
- `TESTING.md`
- `test-evidence/*`

The detailed rules live in:

- [docs/DOCUMENTATION_STANDARD.md](/home/heriberto/Escritorio/Havenova/havenova/docs/DOCUMENTATION_STANDARD.md:1)

## Documentation ownership rule

Cross-cutting rules belong in `docs/`.

Examples:

- architecture rules
- rendering standard
- provider composition standard
- testing strategy

Feature-local behavior belongs in feature or domain docs.

## Migration Policy

This cleanup must happen incrementally, not by rewrite.

## Allowed migration tools

- temporary adapters
- compatibility aliases
- staged folder moves
- transitional exports

## Disallowed migration pattern

- introducing a temporary layer and then treating it as permanent

Every migration item should have:

- reason
- temporary scope
- target destination
- removal condition

## Execution Strategy

## Phase 1. Freeze the target model

Deliverables:

- architecture audit
- target architecture
- documentation standard
- root workspace README

Status:

- in progress

## Phase 2. Break structural blockers

Priority:

1. remove `components <-> contexts` cycle
2. classify legacy surfaces
3. define canonical folder destinations

This phase blocks reliable platform reuse.

## Phase 3. Standardize route rendering

Priority:

1. define server-first route policy
2. identify exceptions
3. progressively move heavy client pages to route-wrapper + client-container model

## Phase 4. Standardize documentation

Priority:

1. touched docs must follow the new standard
2. critical domains should be normalized first:
   - auth
   - client
   - profile
   - alert
3. major route groups should follow the same structure

## Phase 5. Domain cleanup on top of stable architecture

Only after the previous phases are materially advancing:

- continue auth cleanup
- continue profile cleanup
- continue feature form standardization

## What This Means For `auth`

`auth` remains a priority.

But from this point on, `auth` should be cleaned under these platform rules:

- reusable domain ownership
- bounded compatibility
- stable rendering and flow patterns
- documented contracts

That prevents `auth` from being “fixed” on top of architecture that is still shifting.

## Success Criteria

The target architecture can be considered materially adopted when:

- package dependency direction is clean
- legacy folders are classified and controlled
- route rendering strategy is explicit and mostly consistent
- new work follows canonical folder ownership
- documentation has a predictable model
- compatibility layers are bounded and shrinking, not expanding

## Final Decision

The project should not continue evolving through ad hoc compatibility and partial reorganizations.

The new baseline is:

- organize first
- classify legacy explicitly
- break structural cycles
- standardize architecture rules
- then continue domain cleanup and deployment hardening from a stable base
