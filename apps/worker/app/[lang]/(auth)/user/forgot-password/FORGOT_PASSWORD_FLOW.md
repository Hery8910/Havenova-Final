# Worker Forgot Password Flow

## Objective

Register the visible states of the worker `forgot-password` flow, with focus on alerts, exits, and user messaging.

Source:

- [page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/worker/app/[lang]/(auth)/user/forgot-password/page.tsx:1)

## User Intent

This page is for already activated worker users who need to recover access.

It is not part of invitation onboarding.

## Base Sequence

1. The user submits `email`, `language`, and `clientId`.
2. If `clientId` is missing, the flow fails immediately.
3. The page shows loading.
4. The frontend calls `forgotPassword(payload)`.
5. On success, the page shows an intentionally neutral confirmation and offers continuity to `login`.

## Cases

### 1. `CLIENT_MISSING_CLIENT_ID`

- Alert: `showError`
- Visible HTTP status: `400`
- CTA:
  - `close`
- Exit:
  - closes the alert
  - remains on the page

### 2. `USER_FORGOT_PASSWORD_EMAIL_SENT`

- Alert: `showSuccess`
- Visible HTTP status: `200`
- CTA:
  - `goToLogin`
  - `close`
- Exit:
  - `confirm` navigates to `login`
  - `cancel` closes the alert and remains on the page

### 3. `CLIENT_NOT_FOUND`

- Alert: `showError`
- Visible HTTP status: `404`
- CTA:
  - `close`
- Exit:
  - closes the alert
  - remains on the page

### 4. `VALIDATION_ERROR`

- Alert: `showError`
- Visible HTTP status: `400`
- CTA:
  - `close`
- Exit:
  - closes the alert
  - remains on the page

### 5. Technical error (`catch`, missing code, or `>= 500`)

- Alert: `showError`
- Visible HTTP status:
  - backend status
  - or `500`
- CTA:
  - `reload`
  - `close`
- Exit:
  - `confirm` retries submission
  - `cancel` closes the alert

## UX Notes

- the success response must remain ambiguous and must not reveal whether the email exists
- the route should feel like controlled access recovery for invited worker users
- the next safe step after success is always normal login
