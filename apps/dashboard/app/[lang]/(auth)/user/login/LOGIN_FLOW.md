# Dashboard Login Flow

## Objective

Register the visible states of the dashboard `login` flow, with focus on alerts, exits, and user messaging.

Source:

- [page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/user/login/page.tsx:1)

## User Intent

This page is for already invited and already activated dashboard users.

It is not the place where a new admin account is created.

## Base Sequence

1. The user submits `email`, `password`, and `clientId`.
2. The page shows loading using `dashboardLogin` copy when available.
3. The frontend calls `loginUser(payload)`.
4. On success, the frontend attempts `getAuthUser()` retries to synchronize the real session from the server.
5. The page shows success and redirects into the dashboard app.

## Cases

### 1. Missing required input

- Alert: `showError`
- Visible HTTP status: `400`
- CTA:
  - `cancelLabel = close`
- Exit:
  - closes the alert
  - remains on the page

### 2. `USER_LOGIN_EMAIL_NOT_VERIFIED`

- Alert: `showError`
- Visible HTTP status: `200` in the current UI handling
- Previous effect:
  - persists a logged-out auth seed with `email`, `clientId`, and `isVerified: false`
- CTA:
  - `cancelLabel = close`
- Exit:
  - closes the alert
  - remains on the page

Interpretation:

- this route does not currently redirect the dashboard user into a verification screen
- that is consistent only if dashboard users are expected to activate through invitation-first flows rather than public email verification

### 3. Backend success without `user`

- Alert: `showError`
- Visible HTTP status: `500`
- CTA:
  - `cancelLabel = close`
- Exit:
  - closes the alert
  - remains on the page

### 4. `USER_LOGIN_SUCCESS`

- Alert: `showSuccess`
- Visible HTTP status: `200`
- Previous effect:
  - syncs auth from `GET /api/auth/me` when possible
  - falls back to the login response payload if sync is not immediately available
- CTA:
  - no explicit confirm CTA
- Exit:
  - automatic redirect to `/`
  - timeout closes the alert after redirect

### 5. Technical or functional error in `catch`

- Alert: `showError`
- Visible HTTP status:
  - backend status when available
  - or `500`
- CTA:
  - `cancelLabel = close`
- Exit:
  - closes the alert
  - remains on the page

## UX Notes

- the page should communicate controlled access, not self-registration
- success should feel like account access confirmation
- failure should keep the user in a safe retry state unless a stronger route-specific exit is later defined
- if dashboard adds a true password recovery route, this page contract should be updated to document that branch explicitly
