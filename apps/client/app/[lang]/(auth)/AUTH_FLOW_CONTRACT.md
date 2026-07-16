# Client Auth Flow Contract

## Objective

This document defines the canonical auth contract for `apps/client`.

This app uses the public self-registration variant.

It should describe:

- how a user creates an account
- how the user verifies ownership of the email
- how login becomes available
- how recovery flows behave
- what the UI communicates at each step

Related documents:

- [AUTH_IMPLEMENTATION_OVERVIEW.md](/home/heriberto/Escritorio/Havenova/havenova/docs/AUTH_IMPLEMENTATION_OVERVIEW.md:1)
- [AUTH_FLOW_VARIANTS_CONTRACT.md](/home/heriberto/Escritorio/Havenova/havenova/docs/AUTH_FLOW_VARIANTS_CONTRACT.md:1)
- [README.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/README.md:1)

## User Model

The client user is a public user.

This means:

- they may arrive without prior account creation
- they may create an account themselves
- their email must be verified
- their first authenticated profile lifecycle continues through `AuthProvider + ProfileProvider`

## Canonical Entry Paths

### New user

1. The user opens `register`.
2. The user submits personal access data.
3. The backend creates an unverified account.
4. The frontend communicates that registration succeeded but access is not complete.
5. The user continues to `verify-email`.
6. Verification confirms the email and can continue into authenticated session bootstrap.

### Returning verified user

1. The user opens `login`.
2. The user submits email and password.
3. On success, the backend establishes the session cookies.
4. The frontend syncs session state and redirects to the app.

### Returning unverified user

1. The user tries `login`.
2. The backend rejects the session because the email is not verified.
3. The frontend explains the account is not yet verified.
4. The user is directed to continue through `verify-email`.

### Recovery user

1. The user opens `forgot-password`.
2. The frontend requests a reset email without exposing account existence.
3. The user follows `set-password?token=...`.
4. The user defines a new password.
5. The user returns to `login`.

## UX Contract

- `register` must communicate account creation plus the need for verification
- `verify-email` must behave as a composed activation flow, not as disconnected HTTP steps
- `login` must communicate access recovery, not profile setup
- recovery flows must be safe and non-enumerating where required
- each page must give the user a clear next step on both success and failure

## Visible Intent Contract

Every visible auth state in `apps/client` should declare:

- what triggered it
- what the user should understand from it
- what the primary CTA should encourage
- what `cancel` should do
- whether the route stays in place or exits to another safe path

Expected intent by route:

- `register`: success means "your account exists, but access is not finished"; the next step is `verify-email`
- `login`: success means "you now have access"; errors should either keep a safe retry state or move the user to `verify-email` or `register`
- `verify-email`: success means "activation is complete"; intermediate technical steps must stay hidden behind one continuous loading state
- `forgot-password`: success means "if the account can recover, the email is on its way"; it must not confirm account existence
- `set-password`: success means "the credential was replaced"; the next safe step is always `login`

## Route Contracts

- [user/register/REGISTER_FLOW.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/register/REGISTER_FLOW.md:1)
- [user/verify-email/VERIFY_EMAIL_FLOW.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/verify-email/VERIFY_EMAIL_FLOW.md:1)
- [user/login/LOGIN_FLOW.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/login/LOGIN_FLOW.md:1)
- [user/forgot-password/FORGOT_PASSWORD_FLOW.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/forgot-password/FORGOT_PASSWORD_FLOW.md:1)
- [user/set-password/SET_PASSWORD_FLOW.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/set-password/SET_PASSWORD_FLOW.md:1)

## Completion Rule

This auth variant is only considered stable when:

1. the route-level docs reflect the real implementation
2. success, error, and redirect messaging are intentional and documented
3. registration, verification, login, and recovery behave as one coherent user journey
