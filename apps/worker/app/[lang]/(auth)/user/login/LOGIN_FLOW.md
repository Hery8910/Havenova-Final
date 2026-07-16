# Worker Login Flow

## Objective

Declare only the worker-specific layer of the shared invitation-only `login` page.

Shared flow contract:

- [INVITATION_AUTH_SHARED_PAGE_FLOWS.md](/home/heriberto/Escritorio/Havenova/havenova/docs/INVITATION_AUTH_SHARED_PAGE_FLOWS.md:1)

Sources:

- [page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/worker/app/[lang]/(auth)/user/login/page.tsx:1)
- [InvitationLoginPage.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/invitationLogin/InvitationLoginPage.tsx:1)

## Worker-Specific Contract

- this page is for already invited and already activated worker users
- new worker accounts are created operationally outside this public route
- the page uses the shared login loading copy instead of a worker-specific override
- after `USER_LOGIN_SUCCESS`, the redirect to `/` only becomes useful if the synchronized session resolves to a worker-allowed actor
- this auth surface mounts `AuthProvider` with `initialAuth` from server and `disableUnauthenticatedBootstrap`, so cached local state is not enough to prove worker access
- the operational identity is loaded later by `WorkerProvider`, after session validation succeeds

## UX Notes

- the page should communicate worker access, not self-registration
- the route should not branch into public email verification; invitation-first activation remains the expected onboarding path
