# Auth Dashboard Audit

## Purpose

This document inventories how `apps/dashboard` currently consumes the shared `auth` base.

The target of this audit is not “does dashboard have login screens”.

The target is:

- prove which parts of the shared auth base are already reused successfully
- identify which dashboard surfaces still break the idea of `auth` as an independent reusable domain

Closed dashboard model for this audit:

- dashboard does not expose public registration
- dashboard access is invitation-only for new admins
- dashboard consumes `auth` as the shared session layer
- dashboard consumes `admin` as the account-complement domain after auth
- `admin` should mirror the proven profile/worker lifecycle pattern without overloading worker semantics
- dashboard `set-password` must support invitation activation, not only password reset

This audit is the Phase 1 inventory referenced by:

- [docs/AUTH_END_TO_END_PLAN.md](/home/heriberto/Escritorio/Havenova/havenova/docs/AUTH_END_TO_END_PLAN.md:1)

## Reuse Already Achieved

The dashboard is already reusing important parts of the auth base correctly.

### 1. Same-origin auth BFF contract

Dashboard mounts the same auth BFF entrypoint model as client:

- [apps/dashboard/app/api/auth/[...auth]/route.ts](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/api/auth/[...auth]/route.ts:1)
- shared handler: [packages/services/bff/authBffRoute.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/bff/authBffRoute.ts:1)

Meaning:

- browser auth requests in dashboard already go through the frontend BFF
- dashboard is not inventing a separate backend auth contract

### 2. Shared auth browser service layer

Dashboard uses the same shared auth service layer as client:

- [packages/services/auth/authService.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/auth/authService.ts:1)
- [packages/services/api/authApi.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/api/authApi.ts:1)

Meaning:

- login
- refresh
- logout
- `GET /api/auth/me`
- password and email flows

already depend on the same browser contract in both apps.

### 3. Shared session model

Dashboard reuses the same normalized session shape:

- [packages/types/auth/authTypes.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/types/auth/authTypes.ts:1)
- [packages/utils/auth/authSession.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/auth/authSession.ts:1)
- [packages/contexts/auth/authContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/authContext.tsx:1)

Meaning:

- `authId`
- `userClientId`
- `clientId`
- `role`
- `status`
- `isVerified`

already behave as a shared platform model, not as dashboard-specific state.

### 4. Shared auth provider and session lifecycle

Dashboard mounts the same provider used by client:

- [apps/dashboard/app/[lang]/(app)/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/layout.tsx:1)
- [apps/dashboard/app/[lang]/(auth)/user/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/user/layout.tsx:1)
- provider: [packages/contexts/auth/authContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/authContext.tsx:1)

Meaning:

- bootstrap
- storage persistence
- refresh fallback
- logout policy
- role checks

already come from the shared auth domain.

### 5. Dashboard account pages now consume `admin` instead of `profile`

Dashboard account surfaces already moved to the intended complement domain:

- [apps/dashboard/app/[lang]/(app)/account/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/account/page.tsx:1)
- [apps/dashboard/app/[lang]/(app)/account/profile/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/account/profile/page.tsx:1)
- context: [packages/contexts/admin/AdminContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/admin/AdminContext.tsx:1)

Meaning:

- dashboard account rendering and editing no longer depend on `ProfileContext`
- the `auth -> admin` handoff is now the active runtime direction for account pages

### 6. Worker browser service layer now follows the same-origin BFF model

Dashboard worker flows now use the frontend BFF instead of browser-direct backend calls:

- service: [packages/services/worker.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/worker.ts:1)
- routes:
  - [apps/dashboard/app/api/home-services/worker/route.ts](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/api/home-services/worker/route.ts:1)
  - [apps/dashboard/app/api/home-services/worker/list/route.ts](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/api/home-services/worker/list/route.ts:1)
  - [apps/dashboard/app/api/home-services/worker/[workerId]/route.ts](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/api/home-services/worker/[workerId]/route.ts:1)

Meaning:

- `worker` now follows the same reusable browser -> frontend BFF -> backend rule as `auth` and `profile`

### 7. Shared auth form infrastructure

Dashboard auth pages already reuse the shared auth form components:

- [apps/dashboard/app/[lang]/(auth)/user/login/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/user/login/page.tsx:1)
- [apps/dashboard/app/[lang]/(auth)/user/set-password/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/user/set-password/page.tsx:1)
- shared form: [packages/components/client/user/auth/userForm/formWrapper/FormWrapper.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/userForm/formWrapper/FormWrapper.tsx:1)

Meaning:

- dashboard is already reusing auth UI infrastructure instead of building another form system

## Findings

### 1. Dashboard still has residual `profile` assumptions in historical structure, even though runtime account pages now use `admin`

Severity:

- high

Evidence:

- dashboard app layout mounts `AuthProvider` and `AdminProvider`, but not `ProfileProvider`:
  - [apps/dashboard/app/[lang]/(app)/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/layout.tsx:1)
- dashboard no longer uses `/profile/*` as the canonical admin route namespace; the live surface is `/account/*`
- shared UI pieces such as the profile-form wrapper still come from the proven profile pattern:
  - [packages/components/client/user/profile/profileForm/formWrapper/FormWrapper.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileForm/formWrapper/FormWrapper.tsx:1)

Interpretation:

- the main runtime dependency on `ProfileContext` is already removed
- the remaining work is to keep replacing residual structure and naming assumptions with an explicit admin-first model
- this is now a cleanup and consolidation task, not the original blocking miscomposition

### 2. Historical guard fragmentation is now largely closed at the protected-shell level

Severity:

- resolved

Interpretation:

- the old page-local login redirects that motivated this finding are no longer present in the protected dashboard tree
- protected access now closes at the SSR layout with `hasDashboardAccess(auth)` plus the shared `AuthProvider` lifecycle
- the remaining auth work in dashboard is no longer "remove scattered login redirects", but keep the current shell policy from drifting again

### 3. Historical redirect-target inconsistency is now closed on `/user/login`

Severity:

- resolved

Interpretation:

- the canonical dashboard auth entry route is now `/user/login`
- current runtime redirects in the protected dashboard tree no longer point to `/login`
- route ownership is effectively centralized through `userAuthRoutes.login` and shared auth navigation helpers

### 4. Historical dashboard login duplication is now closed through the shared invitation auth page

Severity:

- resolved

Interpretation:

- `dashboard` login is now a thin wrapper over the shared [InvitationLoginPage.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/invitationLogin/InvitationLoginPage.tsx:1)
- drift risk between `dashboard` and `worker` on invitation-only login has been reduced to the wrapper contract and downstream access checks
- the relevant open distinction is now between the public `client` login variant and the invitation-only shared variant, not between duplicated dashboard pages

### 4.1 The first dashboard access still depends on backend bootstrap, not on the dashboard UI flow

Severity:

- medium

Evidence:

- dashboard does not expose public registration by design
- worker creation routes require an authenticated session before a worker can be created or invited:
  - [apps/dashboard/app/api/home-services/worker/route.ts](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/api/home-services/worker/route.ts:1)
- current frontend already supports only the post-bootstrap cycle:
  - create worker
  - resend invite
  - activate invited account through `set-password`

Interpretation:

- this is not a frontend defect by itself
- it is a platform rule: the first dashboard operator must be provisioned from backend
- frontend should preserve that rule and continue from the first authenticated operator onward
- if product wants that first operator to also start with a fully provisioned `admin` complement, backend still needs a dedicated bootstrap path for that combined operation

### 5. Dashboard auth presentation already depends on `AdminContext`, which confirms the intended complement but exposes an unfinished ownership model

Severity:

- medium

Evidence:

- dashboard header renders name and avatar from `admin`, while role comes from `auth`:
  - [packages/components/dashboard/dashboardHeader/DashboardHeader.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/dashboard/dashboardHeader/DashboardHeader.tsx:1)
- dashboard login page also reads theme/language from `admin`:
  - [apps/dashboard/app/[lang]/(auth)/user/login/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/user/login/page.tsx:1)
- `AdminContext` itself uses `auth` as bootstrap input and follows the shared session-complement base:
  - [packages/contexts/admin/AdminContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/admin/AdminContext.tsx:1)

Interpretation:

- dashboard already points toward `admin` as its identity complement
- auth is not supposed to replace admin presentation fields, so this direction is correct
- what is missing is an explicit documented boundary, the removal of residual `profile` usage, and a clean reproduction of the shared session-complement pattern as the admin baseline

### 6. Dashboard account surfaces are split between auth, admin, and profile without a closed ownership rule

Severity:

- medium

Evidence:

- header uses `admin`
- sidebar uses `logout()` from `auth`
- account pages use `admin`
- role checks use `auth`

Primary references:

- [packages/components/dashboard/dashboardHeader/DashboardHeader.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/dashboard/dashboardHeader/DashboardHeader.tsx:1)
- [packages/components/dashboard/sidebar/Sidebar.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/dashboard/sidebar/Sidebar.tsx:1)
- [apps/dashboard/app/[lang]/(app)/account/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/account/page.tsx:1)
- [packages/contexts/auth/authContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/authContext.tsx:1)

Interpretation:

- this split is not inherently wrong
- but it is not yet documented or enforced as a coherent account model
- under the new architecture, the target split should be `auth + admin`, not `auth + profile`
- until that boundary is frozen, dashboard remains a partial consumer rather than a clean reuse target

### 8. Dashboard access mode is now documented as invitation-only

Severity:

- resolved

Interpretation:

- the invitation-only rule is now frozen in the dashboard auth contracts and shared invitation-flow docs
- the remaining work is not to declare the mode, but to preserve it while dashboard grows new protected surfaces

### 9. `set-password` is now a shared auth activation surface with invitation handling

Severity:

- resolved

Interpretation:

- the shared invitation-only `set-password` base now covers both dashboard and worker
- divergence from `client` is now correctly expressed as access mode and route subset, not as a separate auth contract

## Conclusion

The dashboard already reuses the foundational auth base at the correct technical layers:

- BFF
- auth service contract
- session model
- auth provider
- shared auth form infrastructure

So the base platform decision is working.

What is still missing is not “auth from zero”.

What is missing is the closure of dashboard as a disciplined consumer of that shared base.

The main remaining blockers are narrower than in the original audit:

1. residual dashboard dependence on `profile` naming and structure instead of closing cleanly on `admin`
2. finishing the explicit session-vs-admin ownership rule across visible account surfaces
3. preserving the closed guard shell and canonical auth-entry policy as dashboard grows

## Recommended Next Work Order

1. Remove dashboard reliance on `profile` as the account complement and close the `auth -> admin` handoff.
2. Keep the current protected-shell guard policy under test so page-local redirects do not return.
3. Continue replacing residual `profile` assumptions in route naming, account surfaces, and docs with the explicit `admin` complement model.
