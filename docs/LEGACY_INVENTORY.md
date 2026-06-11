# Legacy Inventory And Canonical Surfaces

## Purpose

This document classifies the currently confirmed legacy or ambiguous frontend surfaces and defines the canonical destinations that should receive future work.

It exists to stop the repo from continuing to grow across unclear or duplicated structures.

## Classification Model

Every non-trivial surface should be treated as one of these:

### Canonical

Current official surface.

New work is allowed here.

### Transitional

Still needed for migration compatibility.

New work is allowed only when it directly reduces migration risk or moves consumers toward the canonical surface.

### Deprecated

No new work should be added.

The surface remains only until its consumers are removed.

### Removable

No remaining legitimate reason to keep it after usage is confirmed absent.

## Confirmed Canonical Surfaces

### 1. Shared platform domains

Canonical:

- `packages/contexts/*`
- `packages/services/*`
- `packages/types/*`
- `packages/utils/*`

Rule:

- shared domain behavior belongs here, not in route files

### 2. Client and dashboard feature UI

Canonical:

- `packages/components/client/pages/*`
- `packages/components/dashboard/*`
- `packages/components/client/user/auth/*`
- `packages/components/client/user/profile/*`

Rule:

- page and feature UI should continue to move toward these domain-based surfaces

### 3. Shared address fields

Canonical:

- `packages/components/client/shared/addressFormFields`

Reason:

- this already reflects the intended extraction from feature-specific ownership

### 4. Profile form validation

Canonical:

- `packages/utils/validators/profileFormValidator`

Reason:

- active consumers already point here
- this is the real semantic owner of the current validator surface

## Transitional Surfaces

### 1. `packages/types/userForm`

Status:

- transitional

Reason:

- the name is old and ambiguous
- it does not communicate ownership well now that auth and profile have been separated more clearly

Current recommendation:

- do not expand this surface
- migrate consumers toward domain-specific types where possible

### 2. `packages/utils/validators/userFormValidator`

Status:

- transitional

Confirmed state:

- [userFormValidator.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/validators/userFormValidator/userFormValidator.ts:1) already acts as a compatibility bridge to `profileFormValidator`

Reason:

- this is explicit compatibility, not a canonical validator domain

Rule:

- do not add new validator logic here
- only keep it while old imports still exist

### 3. `packages/components/client/pages/shared`

Status:

- transitional

Confirmed state:

- it contains feature-shared pieces such as `CustomerTypeSelector` and `ServiceCrossCtaSection`
- the previous re-export bridge to `client/shared/addressFormFields` has been removed

Reason:

- the folder name is still broad enough to invite uncontrolled growth if not governed by a strict rule

Rule:

- no uncontrolled expansion
- future shared pieces must decide explicitly between:
  - page-feature shared
  - domain-neutral shared
- `client/pages/shared` must not re-export `client/shared`

## Deprecated Surfaces

### 1. `packages/components/dist`

Status:

- removable

Observed state:

- it was present in source control as a large parallel build-output tree
- no active runtime imports were found in the current code scan
- it has now been removed from the repository

Risk:

- accidental imports
- search noise
- architectural ambiguity

Rule:

- do not reintroduce compiled output into source control
- keep package builds out of canonical source surfaces

### 2. `packages/components/user`

Status:

- removable

Reason:

- it was a leftover shim outside the canonical `client/user/*` split
- no active runtime consumers were found in the latest scan
- it has now been removed from the repository

Rule:

- do not recreate this compatibility surface

## Removable Candidates

These should become removable once final import verification is complete.

### Candidate A. `packages/components/dist`

Condition for removal:

- no imports
- no build or publish process depends on it
- no test fixture depends on it

Current state:

- removed after repository scan confirmed no active consumers

### Candidate B. `packages/components/user`

Condition for removal:

- no imports
- no direct file-path consumers remain

Current state:

- removed after import verification

## Canonical Surface Rules By Area

## 1. Auth UI

Canonical:

- `packages/components/client/user/auth/*`
- `apps/client/app/[lang]/(auth)/*` only for route composition

Not canonical:

- generic `userForm` naming outside the auth/profile ownership model

## 2. Profile UI

Canonical:

- `packages/components/client/user/profile/*`
- `packages/utils/validators/profileFormValidator`

Not canonical:

- old `userForm` naming when it really means profile behavior

## 3. Shared reusable UI

Canonical:

- `packages/components/client/shared/*`

Use only if:

- the component is not tied to one route feature
- the ownership is genuinely cross-domain

## 4. Page-feature shared UI

Canonical:

- `packages/components/client/pages/shared/*`

Use only if:

- the component belongs to multiple page-level client features
- but is still conceptually tied to that page-feature layer

## Cleanup Recommendations

## Phase A. Freeze legacy immediately

Immediate rule:

- no new code in `packages/components/dist`
- no new code in removed legacy shims such as `packages/components/user`
- no new logic in `userFormValidator`

## Phase B. Remove compatibility gradually

Priority order:

1. validators compatibility aliases
2. ambiguous type buckets like `types/userForm`
3. deprecated component trees

## Phase C. Reduce folder duplication

Next structural clarification to perform:

- define a sharp rule between:
  - `packages/components/client/pages/shared`
  - `packages/components/client/shared`

Without that rule, new shared code will keep landing in both places.

## Current Decisions

Closed decisions from this inventory:

- `packages/components/dist` is deprecated and should not receive new work
- `packages/components/user` was legacy and has been removed
- `packages/utils/validators/userFormValidator` is transitional compatibility only
- `packages/types/userForm` is transitional and should not expand
- `packages/components/client/shared/addressFormFields` is canonical
- `packages/components/client/user/auth` and `packages/components/client/user/profile` remain the canonical user-domain split

## Next Action

After this inventory, the next cleanup step should be:

1. verify whether deprecated surfaces still have live imports
2. if not, remove the smallest deprecated surface first
3. then continue with canonical import guidance for shared folders
