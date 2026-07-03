# Auth Shared Boundary Audit

## Objective

This document defines what should be shared once across the monorepo and what should remain app-level composition.

The goal is not to force a single physical auth route for every app.

The goal is to make `auth` reproducible by sharing the stable base while keeping route-level variants readable and maintainable.

## Decision

Do not collapse all auth pages into one monolithic shared route tree.

Do:

- share the auth domain
- share stable auth flow helpers
- share shared form primitives
- share route contracts
- share variant contracts
- keep each app as a thin composition layer

Reason:

- `client` uses public self-registration
- `dashboard` and `worker` use invitation-first activation
- the base is shared, but the journey is not identical
- a single implementation full of `if app === ...` branches would be harder to maintain than thin app-level pages on top of shared primitives

## Recommended Boundary

### Must Be Shared

- `AuthProvider`
- auth service layer
- auth types
- auth/session helpers
- CSRF/session recovery rules
- route constants for auth
- alert and redirect helpers for auth flows
- shared auth form primitives
- shared auth flow documentation model

### Should Become Shared Next

- `AuthPageShell` or an equivalent shared shell primitive
- auth layout primitive used by all app `(auth)` route groups
- small flow-specific helpers where behavior is already identical across apps

### Must Stay App-Level

- which auth routes each app mounts
- route-level flow orchestration where the journey differs
- app-specific copy choices
- app-specific redirect intent after success/failure
- which complement owns the authenticated account layer after auth

## Current State Audit

### Already Shared

- `FormWrapper` and auth form primitives live in `packages/components/client/user/auth`
- auth domain services live in `packages/services/auth`
- auth context/session logic lives in `packages/contexts/auth`
- auth route constants now live in `packages/utils/navigation/sessionRoutes.ts`

### Recently Identified As Shared

- `useAuthAlertActions`
- `useAuthAutoRedirect`

These were app-level utilities under `apps/client`, but their behavior is not client-specific.

They now belong in:

- [packages/hooks/useAuthAlertActions.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/hooks/useAuthAlertActions.ts:1)
- [packages/hooks/useAuthAutoRedirect.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/hooks/useAuthAutoRedirect.ts:1)

This is a good example of the intended boundary:

- route pages stay app-local
- stable flow helpers move to `packages`

### Still Duplicated

- `AuthPageShell.tsx` exists once in `client` and once in `dashboard`
- `(auth)/layout.tsx` is effectively the same in `client` and `dashboard`

Interpretation:

- these are strong candidates for extraction
- but they should be extracted as shell primitives, not as a single all-app auth page system

## Extraction Waves

### Wave 1. Shared flow helpers

Completed in this phase:

- move stable auth route helpers out of `apps/client`
- consume them from both `client` and `dashboard`

### Wave 2. Shared shell primitives

Completed in this phase:

- shared `AuthPageShell`
- shared auth layout primitive for `(auth)` route groups

- [AuthPageShell.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/authShell/AuthPageShell.tsx:1)
- [AuthRouteLayout.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/authShell/AuthRouteLayout.tsx:1)
- [authShell.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/authShell/authShell.module.css:1)

Applied rule:

- shell and layout primitives are shared
- app pages still own route-specific flow orchestration

Still important:

- only after the component contract is stable enough to avoid app-specific branching

### Wave 3. Shared flow modules

Possible later extraction:

- page-level controllers for flows that are truly identical across apps

Warning:

- do not extract route-level controllers if the only way to share them is by injecting many app-variant flags

## Rule For Ongoing Work

When extending `apps/worker` or the next auth surface:

1. start from the shared auth base in `packages`
2. keep route pages thin and app-local
3. extract only the parts that are already stable in at least two apps
4. prefer explicit composition over hidden branching

## Completion Criterion

This boundary is considered healthy when:

1. all auth business logic lives in `packages`
2. app routes mostly compose shared primitives instead of reimplementing them
3. app pages still remain readable as app-specific journeys
4. no shared auth module depends on a single app's route tree assumptions
