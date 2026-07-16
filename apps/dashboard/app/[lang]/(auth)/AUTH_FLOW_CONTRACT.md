# Dashboard Auth Flow Contract

## Objective

This document defines the canonical auth contract for `apps/dashboard`.

This app uses the invitation-only activation variant.

It should describe:

- how an admin account is created operationally
- how invited users activate access
- what routes are public versus protected
- what the UI communicates during onboarding and login

Related documents:

- [AUTH_IMPLEMENTATION_OVERVIEW.md](/home/heriberto/Escritorio/Havenova/havenova/docs/AUTH_IMPLEMENTATION_OVERVIEW.md:1)
- [AUTH_FLOW_VARIANTS_CONTRACT.md](/home/heriberto/Escritorio/Havenova/havenova/docs/AUTH_FLOW_VARIANTS_CONTRACT.md:1)
- [INVITATION_AUTH_SHARED_PAGE_FLOWS.md](/home/heriberto/Escritorio/Havenova/havenova/docs/INVITATION_AUTH_SHARED_PAGE_FLOWS.md:1)
- [AUTH_POPUP_COPY_CONTRACT.md](/home/heriberto/Escritorio/Havenova/havenova/docs/AUTH_POPUP_COPY_CONTRACT.md:1)
- [SESSION_ROUTE_CONTRACT.md](/home/heriberto/Escritorio/Havenova/havenova/docs/SESSION_ROUTE_CONTRACT.md:1)
- [README.md](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/README.md:1)

## User Model

The dashboard user is not a public self-registered user.

This means:

- there is no public `register` route in the dashboard app
- account creation begins outside the public auth UI
- first access is completed through an invitation flow
- the authenticated app continues through `AuthProvider + AdminProvider`

## Canonical Entry Paths

### Invited user, first access

1. A privileged actor creates or invites the admin user.
2. The backend sends an invitation link containing `inviteToken`.
3. The user opens `set-password?inviteToken=...`.
4. The frontend resolves the invitation before accepting the password.
5. The page explains whose invite is being activated when the backend provides masked email data.
6. The user defines the password.
7. On success, the frontend directs the user to `login`.

### Returning activated user

1. The user opens `login`.
2. The user submits email and password.
3. The backend establishes session cookies.
4. The frontend synchronizes session state and enters the dashboard app tree.

### Recovery user

Today the dashboard auth route tree only mounts:

- `login`
- `forgot-password`
- `set-password`

This means:

- invitation activation is implemented
- standard reset recovery is available for already activated users
- public self-registration remains intentionally absent

## UX Contract

- the dashboard auth UI must communicate activation, not public signup
- the invitation path must reassure the user that they are completing access setup, not creating a random account
- invalid or expired invite links must have a clear safe exit
- successful activation must end with a clear handoff to normal login
- the login screen should behave like an access screen for invited staff/admin users, not like a consumer registration surface

## Route Contracts

- [INVITATION_AUTH_SHARED_PAGE_FLOWS.md](/home/heriberto/Escritorio/Havenova/havenova/docs/INVITATION_AUTH_SHARED_PAGE_FLOWS.md:1)
- [user/login/LOGIN_FLOW.md](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/user/login/LOGIN_FLOW.md:1)
- [user/forgot-password/FORGOT_PASSWORD_FLOW.md](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/user/forgot-password/FORGOT_PASSWORD_FLOW.md:1)
- [user/set-password/SET_PASSWORD_FLOW.md](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/user/set-password/SET_PASSWORD_FLOW.md:1)

Implementation rule:

- `login` and `forgot-password` for the invitation-only variant are shared with `apps/worker`
- `set-password` for the invitation/reset variant is shared with `apps/worker`
- the route files in `apps/dashboard` should stay as thin wrappers over the shared implementation
- styling for those public pages belongs to the shared auth shell, not to dashboard-local page CSS
- differences between both apps should stay in copy or downstream complement behavior, not in duplicated auth flow logic

## Completion Rule

This auth variant is only considered stable when:

1. invitation activation and normal login are fully documented
2. the mounted route tree matches the documented UX
3. onboarding and recovery exits are intentional and testable
