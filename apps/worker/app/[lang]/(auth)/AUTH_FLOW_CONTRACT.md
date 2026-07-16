# Worker Auth Flow Contract

## Objective

This document defines the canonical auth contract for `apps/worker`.

This app uses the invitation-only activation variant.

It should describe:

- how a worker account is provisioned operationally
- how invited workers activate access
- what routes are public versus protected
- what the UI communicates during onboarding, login, and recovery

Related documents:

- [AUTH_IMPLEMENTATION_OVERVIEW.md](/home/heriberto/Escritorio/Havenova/havenova/docs/AUTH_IMPLEMENTATION_OVERVIEW.md:1)
- [AUTH_FLOW_VARIANTS_CONTRACT.md](/home/heriberto/Escritorio/Havenova/havenova/docs/AUTH_FLOW_VARIANTS_CONTRACT.md:1)
- [INVITATION_AUTH_SHARED_PAGE_FLOWS.md](/home/heriberto/Escritorio/Havenova/havenova/docs/INVITATION_AUTH_SHARED_PAGE_FLOWS.md:1)
- [AUTH_POPUP_COPY_CONTRACT.md](/home/heriberto/Escritorio/Havenova/havenova/docs/AUTH_POPUP_COPY_CONTRACT.md:1)
- [SESSION_ROUTE_CONTRACT.md](/home/heriberto/Escritorio/Havenova/havenova/docs/SESSION_ROUTE_CONTRACT.md:1)
- [README.md](/home/heriberto/Escritorio/Havenova/havenova/apps/worker/app/[lang]/(auth)/README.md:1)

## User Model

The worker user is not a public self-registered user.

This means:

- there is no public `register` route in the worker app
- account creation begins outside the public auth UI
- first access is completed through an invitation flow
- the authenticated app continues through `AuthProvider + WorkerProvider`

## Canonical Entry Paths

### Invited worker, first access

1. A privileged actor creates or invites the worker user.
2. The backend sends an invitation link containing `inviteToken`.
3. The user opens `set-password?inviteToken=...`.
4. The frontend resolves the invitation before accepting the password.
5. The user defines the password.
6. On success, the frontend directs the user to `login`.

### Returning activated worker

1. The user opens `login`.
2. The user submits email and password.
3. The backend establishes session cookies.
4. The frontend synchronizes session state and enters the worker app tree.

### Recovery user

The worker auth route tree mounts:

- `login`
- `forgot-password`
- `set-password`

This means:

- invitation activation is implemented
- standard reset recovery is available for already activated workers
- public self-registration remains intentionally absent

## Route Contracts

- [INVITATION_AUTH_SHARED_PAGE_FLOWS.md](/home/heriberto/Escritorio/Havenova/havenova/docs/INVITATION_AUTH_SHARED_PAGE_FLOWS.md:1)
- [user/login/LOGIN_FLOW.md](/home/heriberto/Escritorio/Havenova/havenova/apps/worker/app/[lang]/(auth)/user/login/LOGIN_FLOW.md:1)
- [user/forgot-password/FORGOT_PASSWORD_FLOW.md](/home/heriberto/Escritorio/Havenova/havenova/apps/worker/app/[lang]/(auth)/user/forgot-password/FORGOT_PASSWORD_FLOW.md:1)
- [user/set-password/SET_PASSWORD_FLOW.md](/home/heriberto/Escritorio/Havenova/havenova/apps/worker/app/[lang]/(auth)/user/set-password/SET_PASSWORD_FLOW.md:1)

Implementation rule:

- `login` and `forgot-password` for the invitation-only variant are shared with `apps/dashboard`
- `set-password` for the invitation/reset variant is shared with `apps/dashboard`
- the route files in `apps/worker` should stay as thin wrappers over the shared implementation
- styling for those public pages belongs to the shared auth shell, not to worker-local page CSS
- worker-specific differences should appear only where the product really diverges after auth, not by duplicating the auth onboarding flow
