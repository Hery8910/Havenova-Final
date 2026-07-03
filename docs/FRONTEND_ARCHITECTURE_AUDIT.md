# Frontend Architecture Audit

## Purpose

This document evaluates the current frontend workspace from the perspective of:

- deploy readiness
- separation of responsibilities
- reusability across future multi-client projects
- rendering strategy consistency
- documentation maturity

It is not a file-by-file review.

It is a structural audit intended to define the next technical baseline of the project.

## Scope Reviewed

- root workspace structure
- `apps/client`
- `apps/dashboard`
- `packages/components`
- `packages/contexts`
- `packages/services`
- `packages/types`
- `tests`
- existing README and docs surfaces

## Executive Diagnosis

The project already contains the seeds of a reusable platform:

- monorepo workspace
- shared packages
- context-driven state layers
- service/type separation
- increasing internal documentation
- partial server/client boundary work

But the architecture is still in a transitional state.

Current diagnosis:

- the platform direction exists
- the conventions are not yet closed
- the repository contains both current architecture and unresolved legacy structure
- documentation volume is high, but the documentation model is not standardized
- rendering strategy is partially reorganized, not consistently applied
- the canonical BFF boundary now exists, but migration is still incomplete across domains

Closed conclusion:

- deployment should not continue as a pure feature-push exercise
- the next phase should focus on architectural consolidation before adding more cross-cutting complexity
- backend integration should finish converging toward the frontend BFF model instead of keeping residual direct browser/backend exceptions

## Progress Since Audit

The repository has already moved materially since this audit was written.

Confirmed improvements already applied:

- the verified `components <-> contexts` cycle points were removed
- legacy compiled output in `packages/components/dist/*` was removed
- the residual legacy shim in `packages/components/user/*` was removed
- shared boundaries between `client/pages/shared` and `client/shared` were formalized in code
- app imports were normalized toward canonical barrels across client, dashboard, contexts, and utils
- service and type imports were normalized toward canonical root/domain barrels
- a public type collision around `ApiResponse` was removed from the root `types` surface

Current interpretation:

- the audit findings remain directionally valid
- but the repository is now in a stronger consolidation state than the original snapshot
- a new closed decision now also exists: auth should be implemented first on top of a workspace-wide BFF direction, not as an isolated browser-direct exception

## Closed Integration Update

Since the original audit, the workspace reached a clearer conclusion about backend integration:

- auth should not be solved as an isolated cross-origin browser contract
- the canonical browser integration model should be `browser -> frontend BFF -> backend`
- auth is the first domain to migrate, not the only one that should ever use that pattern

Architectural implication:

- frontend API integration is now a platform concern, not just a per-service convenience
- future reuse across projects depends on stabilizing that server-side integration boundary

## Current Structural Snapshot

Workspace:

- `apps/client`
- `apps/dashboard`
- `packages/components`
- `packages/contexts`
- `packages/hooks`
- `packages/i18n`
- `packages/services`
- `packages/types`
- `packages/utils`
- `docs`
- `tests`

Strong signals:

- package boundaries exist
- route grouping exists
- many domains already have dedicated README files
- tests already cover important contexts and shared UI

Weak signals:

- some docs still describe older snapshots of the architecture
- source and legacy output/residue have not been fully retired everywhere
- rendering and wrapper strategies are inconsistent across routes
- package boundaries are not fully respected

## Findings

### 1. Circular dependency between shared packages

Severity: critical

Verified in package manifests:

- [packages/components/package.json](/home/heriberto/Escritorio/Havenova/havenova/packages/components/package.json:1) depends on `@havenova/contexts`
- [packages/contexts/package.json](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/package.json:1) depends on `@havenova/components`

Impact:

- shared layers are not cleanly stratified
- reuse becomes fragile
- testability and future extraction are harder
- architectural ownership between state and presentation is blurred

Expected direction:

- `contexts` should not depend on broad UI packages
- if a context needs a UI primitive, that primitive should move to a lower-level package or the dependency should be inverted

### 2. Rendering strategy is not yet coherent

Severity: high

Measured state:

- `34` of `36` `page.tsx` route files are client pages
- `0` route `layout.tsx` files are client layouts

Interpretation:

- the project already benefits from server layouts
- but most pages still run as fully client-driven route entries
- the “server wrapper + client feature container” pattern exists only in selected features

Impact:

- weakens the value of App Router conventions
- increases route hydration surface
- makes future performance and data-loading cleanup harder
- reduces repeatability because two rendering styles coexist without a standard

Recommended baseline:

- server-first pages by default
- client containers only where interaction truly requires them
- `Suspense` used intentionally for async boundaries, not as an incidental wrapper
- skeletons used for in-place client refresh states, not as a substitute for route architecture

### 3. Provider composition is reusable in spirit, but duplicated in implementation

Severity: high

Observed in:

- [apps/client/app/[lang]/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/layout.tsx:1)
- [apps/dashboard/app/[lang]/(app)/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/layout.tsx:1)
- [apps/dashboard/app/[lang]/(auth)/user/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/user/layout.tsx:1)

State:

- provider stacking is conceptually aligned
- tenant bootstrap logic is very similar across apps
- fallback policies are repeated
- app composition differs slightly per surface

Impact:

- reuse exists, but not yet as a platform primitive
- bootstrap policies can diverge over time
- environment decisions may be applied inconsistently

Recommended direction:

- define explicit “app shell composition” rules
- extract repeatable bootstrap policy where possible
- keep app-specific differences declarative

### 4. Source tree still mixes active architecture with legacy residue

Severity: high

Examples:

- `packages/components/user/*`

Resolved since this audit:

- legacy compiled output under `packages/components/dist/*` has been removed from source control

Impact:

- ownership becomes unclear
- consumers may import from the wrong surface
- code search becomes noisy
- future contributors cannot easily distinguish canonical from deprecated structure

Decision needed:

- define which folders are canonical
- mark or isolate legacy surfaces
- remove or quarantine dead structure in a planned cleanup pass

### 5. Feature and shared boundaries are improving, but still inconsistent

Severity: medium-high

Observed structure mixes:

- app-route folders
- page-level components
- domain-level user components
- shared UI
- dashboard-specific UI
- feature-specific `shared` folders

Examples:

- `packages/components/client/pages/*`
- `packages/components/client/shared/*`
- `packages/components/client/user/*`
- `packages/components/dashboard/*`

Impact:

- there is no single predictable rule for “where a new thing should live”
- some components are organized by page, others by domain, others by reuse level
- this slows down future replication

Recommended direction:

- standardize ownership levels:
  - app route composition
  - feature/domain components
  - shared primitives
  - cross-domain platform components

### 6. Documentation is abundant but not standardized

Severity: high

Observed state:

- many features and contexts already have useful READMEs
- document depth varies heavily
- language varies between Spanish and English
- sections vary by author and by feature
- some files are migration notes, others are audits, others are closure notes

Examples:

- [packages/contexts/auth/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/README.md:1)
- [packages/contexts/client/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/client/README.md:1)
- [packages/components/client/pages/cleaning-service/CleaningRequestForm/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/cleaning-service/CleaningRequestForm/README.md:1)
- [apps/client/app/[lang]/(app)/profile/settings/README.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/settings/README.md:1)

Impact:

- documentation exists, but discovery cost is high
- readers cannot predict what kind of document they are opening
- cross-project reuse becomes harder because contracts are not documented consistently

### 7. Root project documentation was not functioning as an entry point

Severity: medium

The root [README.md](/home/heriberto/Escritorio/Havenova/havenova/README.md:1) was still the default Next.js template.

Impact:

- no operational index
- no architecture map
- no clear entry point for contributors

This has been rectified in this pass.

### 8. Testing exists, but it is not yet tied to an architectural quality model

Severity: medium

Good signals:

- contexts have direct tests
- shared UI has Jest/RTL coverage
- there are focused helper tests

Observed in:

- [tests/jest/contexts](/home/heriberto/Escritorio/Havenova/havenova/tests/jest/contexts)
- [tests/jest/components](/home/heriberto/Escritorio/Havenova/havenova/tests/jest/components)
- [tests/jest/utils](/home/heriberto/Escritorio/Havenova/havenova/tests/jest/utils)

Gap:

- there is no visible project-wide testing strategy document connecting test layers to architectural boundaries

Impact:

- tests prove local behavior
- they do not yet act as an explicit guardrail for platform rules

## Target Direction

## 1. Layer model

Recommended dependency direction:

- `apps/*` depend on shared packages
- `components` depend on lower-level utilities, types, hooks
- `contexts` depend on services, types, hooks, utils
- `contexts` should avoid depending on broad presentation packages
- `services` depend on `types` and low-level API helpers
- `types` depend on nothing

## 2. Rendering model

Default rule:

- route `page.tsx` should be server by default
- move interactive logic into explicit client feature containers

Use `Suspense` when:

- the route relies on async child boundaries
- search params or deferred client subtrees justify it

Use skeletons when:

- the route is already mounted
- a client subtree is refreshing local data

Avoid:

- full client pages by inertia
- mixing route architecture decisions with loading cosmetics

## 3. Documentation model

Every important surface should declare one document type only:

- audit
- standard
- feature README
- testing evidence

Do not mix all four in one file.

## 4. Reusability model

A shared domain is considered reusable only if:

- its contract is documented
- its dependencies are bounded
- its flows are documented
- its rendering rules are explicit
- it does not require project-specific rewrites to be reused

## Recommended Work Plan

### Phase 1. Freeze architecture rules

Output:

- architecture audit
- documentation standard
- root README as workspace index

Status:

- started in this pass

### Phase 2. Resolve structural blockers

Priority items:

1. break the `components <-> contexts` cycle
2. define canonical source folders and legacy quarantine
3. define rendering standard for route pages

### Phase 3. Standardize documentation

Priority items:

1. enforce one template for context docs
2. enforce one template for feature docs
3. enforce one template for route docs
4. add a project testing strategy document

### Phase 4. Align platform surfaces

Priority items:

1. normalize provider/bootstrap composition
2. standardize server wrapper + client container pattern
3. continue domain cleanup starting with `auth`

### Phase 5. Deployment readiness pass

Only after phases 1 to 4 are materially closed:

- tighten environment policies
- close high-risk feature audits
- verify test coverage against the new architectural baseline

## Deployment Readiness Conclusion

The project is not in a “bad” state.

It is in a partially reorganized state.

That means:

- deployment is possible
- but architecture debt is still active enough to create maintenance cost immediately after deployment

The correct move is not to stop feature work forever.

It is to define the platform rules now, fix the structural blockers early, and then continue feature/domain cleanup from a stable baseline.
