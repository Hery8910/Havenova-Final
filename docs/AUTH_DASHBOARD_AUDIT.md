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

- [apps/dashboard/app/[lang]/(app)/profile/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/profile/page.tsx:1)
- [apps/dashboard/app/[lang]/(app)/profile/edit/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/profile/edit/page.tsx:1)
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
- dashboard still preserves `profile` naming on some routes such as `/profile`, even though the underlying runtime complement is now `admin`
- shared UI pieces such as the profile-form wrapper still come from the proven profile pattern:
  - [packages/components/client/user/profile/profileForm/formWrapper/FormWrapper.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileForm/formWrapper/FormWrapper.tsx:1)

Interpretation:

- the main runtime dependency on `ProfileContext` is already removed
- the remaining work is to keep replacing residual structure and naming assumptions with an explicit admin-first model
- this is now a cleanup and consolidation task, not the original blocking miscomposition

### 2. Guard behavior is fragmented across shared hooks and page-local redirects

Severity:

- high

Evidence:

- shared role guard exists:
  - [packages/contexts/auth/authContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/authContext.tsx:808)
- shared login guard exists:
  - [packages/hooks/useRequireLogin.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/hooks/useRequireLogin.ts:1)
- dashboard pages also perform their own redirects:
  - [apps/dashboard/app/[lang]/(app)/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/page.tsx:15)
  - [apps/dashboard/app/[lang]/(app)/objects/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/objects/page.tsx:110)
  - [apps/dashboard/app/[lang]/(app)/property-manager/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/property-manager/page.tsx:218)
  - [apps/dashboard/app/[lang]/(app)/messages/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/messages/page.tsx:342)

Interpretation:

- dashboard does reuse the shared auth guard base
- but it still layers app-specific redirect logic on top in an inconsistent way
- auth access is not yet a closed shell policy

### 3. Redirect targets are inconsistent inside dashboard

Severity:

- high

Evidence:

- canonical auth route in dashboard exists under `/user/login`:
  - [apps/dashboard/app/[lang]/(auth)/user/login/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/user/login/page.tsx:1)
- some surfaces redirect correctly to `/user/login`:
  - [apps/dashboard/app/[lang]/(app)/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/page.tsx:16)
  - [packages/contexts/auth/authContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/authContext.tsx:842)
- other surfaces redirect to `/login` instead:
  - [apps/dashboard/app/[lang]/(app)/objects/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/objects/page.tsx:111)
  - [apps/dashboard/app/[lang]/(app)/property-manager/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/property-manager/page.tsx:219)
  - [apps/dashboard/app/[lang]/(app)/messages/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/messages/page.tsx:342)

Interpretation:

- dashboard still has multiple assumptions about the auth entry route
- this is a direct violation of auth-domain independence
- route ownership is not yet centralized

### 4. Dashboard login flow duplicates the client login page instead of reusing the same feature shell

Severity:

- medium

Evidence:

- dashboard login page is largely a fork of client login:
  - [apps/dashboard/app/[lang]/(auth)/user/login/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/user/login/page.tsx:1)
  - [apps/client/app/[lang]/(auth)/user/login/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/login/page.tsx:1)
- the dashboard version reuses shared services and `FormWrapper`, but not the client auth shell/adapters

Interpretation:

- service reuse is good
- feature composition reuse is partial
- auth behavior can drift between apps because the page contract is duplicated

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
- profile pages use `admin`
- role checks use `auth`

Primary references:

- [packages/components/dashboard/dashboardHeader/DashboardHeader.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/dashboard/dashboardHeader/DashboardHeader.tsx:1)
- [packages/components/dashboard/sidebar/Sidebar.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/dashboard/sidebar/Sidebar.tsx:1)
- [apps/dashboard/app/[lang]/(app)/profile/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/profile/page.tsx:1)
- [packages/contexts/auth/authContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/authContext.tsx:1)

Interpretation:

- this split is not inherently wrong
- but it is not yet documented or enforced as a coherent account model
- under the new architecture, the target split should be `auth + admin`, not `auth + profile`
- until that boundary is frozen, dashboard remains a partial consumer rather than a clean reuse target

### 8. Dashboard access mode is not yet documented as invitation-only

Severity:

- medium

Evidence:

- dashboard exposes `login` and `set-password` pages:
  - [apps/dashboard/app/[lang]/(auth)/user/login/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/user/login/page.tsx:1)
  - [apps/dashboard/app/[lang]/(auth)/user/set-password/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/user/set-password/page.tsx:1)
- there is no dashboard `register` page, which matches the intended product rule
- backend auth contract already supports invitation semantics through `inviteToken` and `status: invited`:
  - [packages/types/auth/authTypes.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/types/auth/authTypes.ts:1)
  - [packages/contexts/auth/BACKEND.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/BACKEND.md:442)

Interpretation:

- the product rule exists implicitly in code and backend contract
- it is not yet frozen as a frontend auth rule for dashboard
- this must be documented before refactoring `set-password`

### 9. `set-password` must become a shared auth activation surface with dashboard-specific invitation handling

Severity:

- medium

Evidence:

- dashboard `set-password` already reads either `token` or `inviteToken` from the URL:
  - [apps/dashboard/app/[lang]/(auth)/user/set-password/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/user/set-password/page.tsx:49)
- dashboard now sends either `token` or `inviteToken` to the shared reset-password contract instead of collapsing both modes into one value
- shared auth types already tolerate `inviteToken`:
  - [packages/types/auth/authTypes.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/types/auth/authTypes.ts:123)
- current client documentation explicitly says `inviteToken` should not apply to the public client route:
  - [apps/client/app/[lang]/(auth)/README.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/README.md:481)

Interpretation:

- the reusable auth base should own the `set-password` contract
- `client` and `dashboard` should diverge by access mode, not by inventing separate auth semantics
- dashboard must extend the shared flow to support invitation activation cleanly

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

The main blockers are:

1. residual dashboard dependence on `profile` instead of closing on `admin`
2. fragmented guard policy
3. inconsistent redirect targets
4. duplicated login feature composition
5. missing documented invitation-only access model
6. unfinished `set-password` invitation handling as part of shared auth

## Recommended Next Work Order

1. Remove dashboard reliance on `profile` as the account complement and close the `auth -> admin` handoff.
2. Centralize dashboard protected-route behavior and remove page-local login redirects.
3. Normalize the canonical dashboard auth route targets to `/user/login`.
4. Freeze the invitation-only dashboard access model in frontend docs and route rules.
5. Adapt `set-password` as a shared auth surface with dashboard invitation activation support.
6. Refactor dashboard auth pages to reuse the shared auth feature composition where possible instead of maintaining a forked login flow.
