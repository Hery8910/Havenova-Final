# Auth Domain

## Status

This file is now a historical backend-facing snapshot kept inside the frontend repo for reference only.

It is not the canonical frontend integration strategy anymore.

Current closed frontend-side decision:

- browser auth should converge toward `browser -> frontend BFF -> backend`
- direct browser-to-backend auth should be treated as transitional/historical

Use this file for:

- backend domain concepts
- response and route reference
- historical comparison against earlier frontend assumptions

Do not use this file alone as the target frontend architecture source.

For the current platform decision, see:

- [docs/FRONTEND_BFF_STRATEGY.md](/home/heriberto/Escritorio/Havenova/havenova/docs/FRONTEND_BFF_STRATEGY.md:1)

## Purpose

The `auth` domain is the global authentication and session layer.

It owns:

- global credentials in `Auth`
- tenant membership and role through `UserClient`
- login and register flows
- email verification and magic login
- password recovery and password update
- email change request and confirmation
- cookie-based session renewal and invalidation

Canonical route prefix:

- `/api/auth`

## Domain Model

### `Auth`

Global account record.

Fields used by the auth API:

- `_id`
- `email`
- `password`
- `isVerified`
- `status`: `active | invited | blocked`

Notes:

- `email` is unique globally
- `password` is stored with `select: false`
- verification is global, not tenant-specific

### `UserClient`

Tenant-scoped account relation.

Fields used by the auth API:

- `_id`
- `authId`
- `clientId`
- `role`: `user | worker | admin | superAdmin`
- `status`: `active | invited | blocked`
- `tokenVersion`
- `tosAccepted`
- `tosAcceptedAt`
- `tosVersion`
- `cookieConsent`

Notes:

- the active session identity is `authId + userClientId + clientId`
- uniqueness is enforced on `authId + clientId`
- logout-all invalidates refresh sessions by incrementing `tokenVersion`

## Middleware Contract

Route behavior is composed in this order:

1. `validate(schema)` checks the request shape.
2. `protect` resolves the authenticated user from the `accessToken` cookie.
3. `csrfProtect` validates double-submit CSRF state for state-changing cookie routes.
4. Controllers enforce business state only.

What controllers still validate:

- client existence
- auth existence
- tenant linkage
- blocked state
- token semantics
- current password correctness
- conflict rules such as duplicate email

## Response Envelope

Successful responses use:

```json
{
  "success": true,
  "code": "SOME_SUCCESS_CODE"
}
```

Successful responses with payload use:

```json
{
  "success": true,
  "code": "SOME_SUCCESS_CODE",
  "user": {}
}
```

Errors use:

```json
{
  "success": false,
  "code": "SOME_ERROR_CODE",
  "message": "Human readable message"
}
```

Unexpected errors use:

```json
{
  "success": false,
  "code": "GLOBAL_INTERNAL_ERROR",
  "message": "An unexpected error occurred"
}
```

## Session And CSRF

Historical note:

- the cookie and CSRF details below describe the backend contract shape directly
- the target frontend architecture should consume that contract through a BFF layer
- frontend browser code should not be treated as the permanent direct consumer of these backend cookies

The auth domain is cookie-based.

Cookies issued by login-style flows:

- `accessToken`
  - `httpOnly`
  - `sameSite: lax`
  - `maxAge: 15m`
- `refreshToken`
  - `httpOnly`
  - `sameSite: lax`
  - `maxAge: 30d` for `user`
  - `maxAge: 16h` for `worker` and `admin`
- `x-csrf-token`
  - emitted as response header
  - readable by frontend
  - required in `x-csrf-token` header for protected state-changing routes

CSRF-protected routes in this domain:

- `POST /logout`
- `POST /refresh-token`
- `POST /update-password`
- `POST /logout-all-sessions`
- `POST /change-email`

## Closed Frontend Decision Pending Backend Implementation

The frontend-side decision is now closed:

- losing the in-memory `x-csrf-token` must not be treated as terminal session expiry by default
- the auth contract needs a dedicated CSRF bootstrap/reissue endpoint before `POST /refresh-token`

Expected backend contract:

- expose a dedicated CSRF reissue route such as `GET /api/auth/csrf` or `POST /api/auth/csrf/reissue`
- validate that the session is still recoverable through the refresh-token path
- emit a fresh `x-csrf-token` response header
- do not replace `POST /api/auth/refresh-token` as the actual session renewal step

Expected purpose:

- allow the frontend to recover a fresh readable CSRF token after full reload, mobile tab suspension, or runtime memory loss
- let the frontend/BFF execute the recovery sequence `GET /me -> csrf reissue -> POST /refresh-token -> GET /me`

Reference:

- [AUTH_CSRF_SESSION_RECOVERY_DECISION.md](/home/heriberto/Escritorio/Havenova/havenova/docs/AUTH_CSRF_SESSION_RECOVERY_DECISION.md:1)

## Authenticated User Shapes

### Returned by login and magic login

```json
{
  "authId": "auth-id",
  "userClientId": "user-client-id",
  "clientId": "client-id",
  "email": "user@example.com",
  "role": "user",
  "isVerified": true,
  "isNewUser": false
}
```

### Returned by `GET /me`

```json
{
  "authId": "auth-id",
  "userClientId": "user-client-id",
  "clientId": "client-id",
  "email": "user@example.com",
  "role": "user",
  "status": "active",
  "isVerified": true
}
```

### Resolved into `req.user` by `protect`

```json
{
  "authId": "auth-id",
  "userClientId": "user-client-id",
  "email": "user@example.com",
  "clientId": "client-id",
  "role": "user",
  "status": "active"
}
```

## Routes

### `POST /api/auth/register`

Public.

Validation:

```json
{
  "email": "user@example.com",
  "password": "123456",
  "language": "de",
  "clientId": "67d1b6d94cc8bc3bb3f34e11",
  "tosAccepted": true,
  "cookiePrefs": {}
}
```

Rules:

- creates a new `Auth` and `UserClient` when the email does not exist
- if `Auth` exists but no `UserClient` exists for that tenant, the password must match before linking
- if `Auth` exists and is unverified, the flow still returns register success and resends verification
- `tosAccepted` must be literally `true`

Success `200`:

```json
{
  "success": true,
  "code": "USER_REGISTER_SUCCESS"
}
```

Documented business/validation errors:

- `400 VALIDATION_ERROR`
- `403 AUTH_BLOCKED`
- `403 USER_CLIENT_BLOCKED`
- `404 CLIENT_NOT_FOUND`
- `409 USER_REGISTER_NEEDS_CORRECT_PASSWORD`
- `409 USER_REGISTER_ALREADY_REGISTERED`

Notes for frontend:

- no user payload is returned
- this endpoint does not create cookies
- `cookiePrefs` is accepted and stored in `UserClient.cookieConsent`

### `POST /api/auth/login`

Public.

Validation:

```json
{
  "email": "user@example.com",
  "password": "123456",
  "clientId": "67d1b6d94cc8bc3bb3f34e11",
  "language": "de"
}
```

Success `200` when fully authenticated:

```json
{
  "success": true,
  "code": "USER_LOGIN_SUCCESS",
  "user": {
    "authId": "auth-id",
    "userClientId": "user-client-id",
    "clientId": "client-id",
    "email": "user@example.com",
    "role": "user",
    "isVerified": true,
    "isNewUser": false
  }
}
```

Special success `200` when email is still unverified:

```json
{
  "success": true,
  "code": "USER_LOGIN_EMAIL_NOT_VERIFIED"
}
```

Documented business/validation errors:

- `400 VALIDATION_ERROR`
- `401 AUTH_INVALID_CREDENTIALS`
- `403 AUTH_BLOCKED`
- `403 USER_CLIENT_BLOCKED`
- `404 CLIENT_NOT_FOUND`
- `404 USER_CLIENT_NOT_FOUND`

Notes for frontend:

- successful login sets `accessToken` and `refreshToken`, and emits `x-csrf-token`
- unverified login does not establish a session

### `POST /api/auth/verify-email`

Public.

Validation:

```json
{
  "token": "<email-verification-jwt>"
}
```

Success `200`:

```json
{
  "success": true,
  "code": "USER_VERIFY_EMAIL_SUCCESS",
  "magicToken": "<magic-jwt>",
  "language": "de"
}
```

Documented business/validation errors:

- `400 VALIDATION_ERROR`
- `400 AUTH_VERIFY_EMAIL_TOKEN_EXPIRED`
- `400 AUTH_VERIFY_EMAIL_TOKEN_INVALID`
- `403 AUTH_BLOCKED`
- `403 USER_CLIENT_BLOCKED`
- `404 AUTH_USER_NOT_FOUND`
- `404 USER_CLIENT_NOT_FOUND`

Notes for frontend:

- this endpoint does not create cookies
- frontend should usually continue with `POST /magic-login` using `magicToken`

### `POST /api/auth/resend-verification`

Public.

Validation:

```json
{
  "email": "user@example.com",
  "clientId": "67d1b6d94cc8bc3bb3f34e11",
  "language": "de"
}
```

Success `200`:

```json
{
  "success": true,
  "code": "USER_VERIFY_EMAIL_RESENT"
}
```

Documented business/validation errors:

- `400 VALIDATION_ERROR`
- `404 CLIENT_NOT_FOUND`

Notes for frontend:

- response is intentionally normalized
- the same success response is returned when the user does not exist, is blocked, is already verified, is not linked to the tenant, or the relation is blocked

### `POST /api/auth/forgot-password`

Public.

Validation:

```json
{
  "email": "user@example.com",
  "clientId": "67d1b6d94cc8bc3bb3f34e11",
  "language": "de"
}
```

Success `200`:

```json
{
  "success": true,
  "code": "USER_FORGOT_PASSWORD_EMAIL_SENT"
}
```

Documented business/validation errors:

- `400 VALIDATION_ERROR`
- `404 CLIENT_NOT_FOUND`

Notes for frontend:

- response is intentionally normalized
- the same success response is returned when the user does not exist, is blocked, is not linked to the tenant, or the relation is blocked

### `POST /api/auth/reset-password-confirm`

Public.

Legacy alias:

- `POST /api/auth/reset-password`

Validation:

```json
{
  "token": "<password-reset-jwt>",
  "inviteToken": "<password-reset-jwt>",
  "newPassword": "NEW_PASS"
}
```

Rules:

- either `token` or `inviteToken` is required
- `newPassword` must be at least 6 chars
- on success, password is updated
- on success, `Auth.isVerified` is forced to `true` if needed
- on success, blocked/invited `UserClient` is moved to `active` if needed

Success `200`:

```json
{
  "success": true,
  "code": "USER_RESET_PASSWORD_SUCCESS"
}
```

Documented business/validation errors:

- `400 VALIDATION_ERROR`
- `400 USER_RESET_PASSWORD_INVALID_TOKEN`
- `400 USER_RESET_PASSWORD_TOKEN_EXPIRED`
- `403 AUTH_BLOCKED`
- `403 USER_CLIENT_BLOCKED`
- `404 AUTH_USER_NOT_FOUND`
- `404 USER_CLIENT_NOT_FOUND`

### `POST /api/auth/magic-login`

Public.

Validation:

```json
{
  "token": "<magic-jwt>"
}
```

Success `200`:

```json
{
  "success": true,
  "code": "MAGIC_LOGIN_SUCCESS",
  "user": {
    "authId": "auth-id",
    "userClientId": "user-client-id",
    "clientId": "client-id",
    "email": "user@example.com",
    "role": "user",
    "isVerified": true,
    "isNewUser": true
  }
}
```

Documented business/validation errors:

- `400 VALIDATION_ERROR`
- `400 MAGIC_TOKEN_INVALID`
- `401 MAGIC_TOKEN_EXPIRED`
- `403 AUTH_BLOCKED`
- `403 USER_CLIENT_BLOCKED`
- `404 AUTH_USER_NOT_FOUND`
- `404 USER_CLIENT_NOT_FOUND`

Notes for frontend:

- successful magic login sets `accessToken` and `refreshToken`, and emits `x-csrf-token`

### `POST /api/auth/refresh-token`

Public cookie-auth route with CSRF protection.

Validation:

- request body may be omitted or empty

Success `200`:

```json
{
  "success": true,
  "code": "ACCESS_TOKEN_REFRESHED"
}
```

Documented business/validation errors:

- `401 REFRESH_TOKEN_MISSING`
- `401 REFRESH_TOKEN_INVALID`
- `401 REFRESH_TOKEN_EXPIRED`
- `401 REFRESH_TOKEN_INVALIDATED`
- `403 AUTH_BLOCKED`
- `403 USER_CLIENT_BLOCKED`
- `403 CSRF_TOKEN_INVALID`

Notes for frontend:

- requires `refreshToken` cookie
- also requires a valid `x-csrf-token` header
- success rotates the `accessToken` cookie, rotates `refreshToken`, and reissues `x-csrf-token`

### `GET /api/auth/me`

Protected route.

Requires:

- `protect`

Success `200`:

```json
{
  "success": true,
  "code": "AUTH_GET_SUCCESS",
  "user": {
    "authId": "auth-id",
    "userClientId": "user-client-id",
    "clientId": "client-id",
    "email": "user@example.com",
    "role": "user",
    "status": "active",
    "isVerified": true
  }
}
```

Documented business/auth errors:

- `401 AUTH_ACCESS_TOKEN_MISSING`
- `401 AUTH_ACCESS_TOKEN_EXPIRED`
- `401 AUTH_ACCESS_TOKEN_INVALID`
- `401 AUTH_USER_NOT_FOUND`
- `403 AUTH_BLOCKED`
- `403 USER_CLIENT_NOT_FOUND`
- `403 USER_CLIENT_BLOCKED`

### `POST /api/auth/update-password`

Protected route.

Requires:

- `protect`
- `csrfProtect`

Validation:

```json
{
  "currentPassword": "OLD_PASS",
  "newPassword": "NEW_PASS"
}
```

Success `200`:

```json
{
  "success": true,
  "code": "USER_UPDATE_PASSWORD_SUCCESS"
}
```

Documented business/auth errors:

- `400 VALIDATION_ERROR`
- `401 AUTH_ACCESS_TOKEN_MISSING`
- `401 AUTH_ACCESS_TOKEN_EXPIRED`
- `401 AUTH_ACCESS_TOKEN_INVALID`
- `401 AUTH_USER_NOT_FOUND`
- `401 AUTH_CURRENT_PASSWORD_INVALID`
- `403 AUTH_BLOCKED`
- `403 USER_CLIENT_NOT_FOUND`
- `403 USER_CLIENT_BLOCKED`
- `403 CSRF_TOKEN_INVALID`

### `POST /api/auth/change-email`

Protected route.

Requires:

- `protect`
- `csrfProtect`

Validation:

```json
{
  "newEmail": "new@example.com",
  "language": "de"
}
```

Success `200`:

```json
{
  "success": true,
  "code": "USER_CHANGE_EMAIL_REQUESTED"
}
```

Documented business/auth errors:

- `400 VALIDATION_ERROR`
- `401 AUTH_ACCESS_TOKEN_MISSING`
- `401 AUTH_ACCESS_TOKEN_EXPIRED`
- `401 AUTH_ACCESS_TOKEN_INVALID`
- `401 AUTH_USER_NOT_FOUND`
- `403 AUTH_BLOCKED`
- `403 USER_CLIENT_NOT_FOUND`
- `403 USER_CLIENT_BLOCKED`
- `403 CSRF_TOKEN_INVALID`
- `404 CLIENT_NOT_FOUND`
- `409 USER_CHANGE_EMAIL_SAME_EMAIL`
- `409 USER_EMAIL_ALREADY_IN_USE`

Notes for frontend:

- this sends the confirmation email and does not mutate the address immediately

### `POST /api/auth/change-email/confirm`

Public.

Validation:

```json
{
  "token": "<email-change-jwt>"
}
```

Success `200`:

```json
{
  "success": true,
  "code": "USER_CHANGE_EMAIL_CONFIRMED"
}
```

Documented business/validation errors:

- `400 VALIDATION_ERROR`
- `400 USER_CHANGE_EMAIL_INVALID_TOKEN`
- `400 USER_CHANGE_EMAIL_TOKEN_EXPIRED`
- `400 USER_CHANGE_EMAIL_STATE_MISMATCH`
- `403 AUTH_BLOCKED`
- `403 USER_CLIENT_BLOCKED`
- `404 AUTH_USER_NOT_FOUND`
- `404 USER_CLIENT_NOT_FOUND`
- `409 USER_EMAIL_ALREADY_IN_USE`

Notes for frontend:

- success sets `Auth.email` to the new normalized address
- success also forces `Auth.isVerified = true`

### `POST /api/auth/logout`

Public cookie-auth route with CSRF protection.

Validation:

- body must be an empty object

Success `200`:

```json
{
  "success": true,
  "code": "USER_LOGOUT_SUCCESS"
}
```

Documented business/validation errors:

- `400 VALIDATION_ERROR`
- `403 CSRF_TOKEN_INVALID`

Notes for frontend:

- clears `accessToken` and `refreshToken`
- no authenticated context is required

### `POST /api/auth/logout-all-sessions`

Protected route.

Requires:

- `protect`
- `csrfProtect`

Validation:

- body must be an empty object

Success `200`:

```json
{
  "success": true,
  "code": "USER_LOGOUT_ALL_SUCCESS"
}
```

Documented business/auth errors:

- `400 VALIDATION_ERROR`
- `401 AUTH_ACCESS_TOKEN_MISSING`
- `401 AUTH_ACCESS_TOKEN_EXPIRED`
- `401 AUTH_ACCESS_TOKEN_INVALID`
- `401 AUTH_USER_NOT_FOUND`
- `403 AUTH_BLOCKED`
- `403 USER_CLIENT_NOT_FOUND`
- `403 USER_CLIENT_BLOCKED`
- `403 CSRF_TOKEN_INVALID`

Notes for frontend:

- increments `UserClient.tokenVersion`
- clears `accessToken` and `refreshToken`

## Error Codes In Active Use

This section lists response codes exposed by the API contract.

It does not list audit-only `reasonCode` values such as normalization branches or internal event names.

Validation and platform:

- `VALIDATION_ERROR`
- `CSRF_TOKEN_INVALID`
- `GLOBAL_INTERNAL_ERROR`

Session and token:

- `AUTH_ACCESS_TOKEN_MISSING`
- `AUTH_ACCESS_TOKEN_EXPIRED`
- `AUTH_ACCESS_TOKEN_INVALID`
- `REFRESH_TOKEN_MISSING`
- `REFRESH_TOKEN_INVALID`
- `REFRESH_TOKEN_EXPIRED`
- `REFRESH_TOKEN_INVALIDATED`
- `MAGIC_TOKEN_INVALID`
- `MAGIC_TOKEN_EXPIRED`
- `AUTH_VERIFY_EMAIL_TOKEN_INVALID`
- `AUTH_VERIFY_EMAIL_TOKEN_EXPIRED`
- `USER_RESET_PASSWORD_INVALID_TOKEN`
- `USER_RESET_PASSWORD_TOKEN_EXPIRED`
- `USER_CHANGE_EMAIL_INVALID_TOKEN`
- `USER_CHANGE_EMAIL_TOKEN_EXPIRED`

State and existence:

- `CLIENT_NOT_FOUND`
- `AUTH_USER_NOT_FOUND`
- `USER_CLIENT_NOT_FOUND`
- `AUTH_BLOCKED`
- `USER_CLIENT_BLOCKED`

Credentials and conflicts:

- `AUTH_INVALID_CREDENTIALS`
- `AUTH_CURRENT_PASSWORD_INVALID`
- `USER_REGISTER_NEEDS_CORRECT_PASSWORD`
- `USER_REGISTER_ALREADY_REGISTERED`
- `USER_EMAIL_ALREADY_IN_USE`
- `USER_CHANGE_EMAIL_SAME_EMAIL`
- `USER_CHANGE_EMAIL_STATE_MISMATCH`
- `USER_TOS_NOT_ACCEPTED`

Success codes:

- `USER_REGISTER_SUCCESS`
- `USER_LOGIN_SUCCESS`
- `USER_LOGIN_EMAIL_NOT_VERIFIED`
- `USER_VERIFY_EMAIL_SUCCESS`
- `USER_VERIFY_EMAIL_RESENT`
- `USER_FORGOT_PASSWORD_EMAIL_SENT`
- `USER_RESET_PASSWORD_SUCCESS`
- `MAGIC_LOGIN_SUCCESS`
- `ACCESS_TOKEN_REFRESHED`
- `AUTH_GET_SUCCESS`
- `USER_UPDATE_PASSWORD_SUCCESS`
- `USER_CHANGE_EMAIL_REQUESTED`
- `USER_CHANGE_EMAIL_CONFIRMED`
- `USER_LOGOUT_SUCCESS`
- `USER_LOGOUT_ALL_SUCCESS`

## Frontend Integration Notes

- Treat `/resend-verification` and `/forgot-password` as ambiguity-by-design flows.
- Treat `/verify-email` as a token exchange step, not as a session-establishing step.
- Treat `/magic-login` and `/login` as the flows that actually establish cookies.
- Always capture `x-csrf-token` from authenticated responses and replay it on CSRF-protected routes.
- `GET /me` is the canonical route for restoring current session identity from cookies.
- `status` in frontend session data comes from `UserClient.status`, not `Auth.status`.

## Source References

- Router: `src/core/auth/auth.routes.ts`
- Controllers: `src/core/auth/controllers/*.ts`
- Schemas: `src/core/auth/schemas/*.ts`
- Auth model: `src/core/auth/auth.model.ts`
- UserClient model: `src/core/userClient/userClient.model.ts`
- JWT helpers: `src/shared/utils/jwt.ts`
- CSRF helpers: `src/shared/utils/csrf.ts`
- Protect middleware: `src/shared/middlewares/auth/protect.ts`
- Validation middleware: `src/shared/middlewares/validate/validate.ts`
- Error handler: `src/shared/errors/errorHandler.ts`

## Verification Status

This README was reconciled against the current implementation on April 21, 2026 by checking:

- `auth.routes.ts`
- all auth controllers
- all auth schemas
- `Auth` and `UserClient` models
- `protect`, `csrfProtect`, `validate`, `errorHandler`, `jwt`, and `csrf` helpers
- the auth test suite files under `src/core/auth/tests`

Verification run on April 21, 2026:

- `npm test -- --runInBand src/core/auth/tests`
- result: `13/13` suites passed, `77/77` tests passed
