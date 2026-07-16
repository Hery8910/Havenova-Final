# Dashboard Login Flow

## Objective

Declare only the dashboard-specific layer of the shared invitation-only `login` page.

Shared flow contract:

- [INVITATION_AUTH_SHARED_PAGE_FLOWS.md](/home/heriberto/Escritorio/Havenova/havenova/docs/INVITATION_AUTH_SHARED_PAGE_FLOWS.md:1)

Sources:

- [page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/user/login/page.tsx:1)
- [InvitationLoginPage.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/invitationLogin/InvitationLoginPage.tsx:1)

## Dashboard-Specific Contract

- this page is for already invited and already activated dashboard users
- new admin accounts are created operationally outside this public route
- when available, the page prefers dashboard-specific loading copy (`dashboardLogin`) over the generic shared loading text
- after `USER_LOGIN_SUCCESS`, the redirect to `/` only becomes useful if the synchronized session resolves to a dashboard-allowed actor (`admin` or `super_admin`)
- this auth surface mounts `AuthProvider` with `initialAuth` from server and `disableUnauthenticatedBootstrap`, so cached local state is not enough to prove dashboard access

## UX Notes

- the page should communicate staff/admin access, not self-registration
- the route should not branch into public email verification; invitation-first activation remains the expected onboarding path
