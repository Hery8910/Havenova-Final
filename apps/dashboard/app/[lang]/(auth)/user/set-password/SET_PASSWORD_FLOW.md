# Dashboard Set Password Flow

## Objective

Register the visible states of the dashboard `set-password` flow, including the invitation variant.

Source:

- [page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/user/set-password/page.tsx:1)

## User Intent

This route supports two modes:

- standard password reset using `token`
- invitation activation using `inviteToken`

For dashboard onboarding, the invitation mode is the primary contract.

## Base Sequence

1. The page reads `token` and `inviteToken` from the URL.
2. If `inviteToken` exists, the page first calls `resolveInvite({ inviteToken })`.
3. The page updates the copy with invite-specific messaging when resolution succeeds.
4. The user submits `password` and `confirmPassword`.
5. The frontend sends `resetPassword({ token | inviteToken, newPassword })`.
6. On success, the page directs the user to `login`.

## Cases

### 1. Missing both `token` and `inviteToken`

- Alert: `showError`
- Visible HTTP status: `500` on initial effect, `400` on submit branch
- CTA:
  - initial effect: `goToHome`
  - submit branch: `goToLogin`
- Exit:
  - the user is moved to a safe route because the page cannot operate

### 2. Serialized `status=error` in URL

- Alert: `showError`
- Visible HTTP status:
  - `http` query param
  - or `400`
- CTA:
  - `goToHome`
- Exit:
  - closes the alert
  - redirects to `/`

### 3. Invitation preflight success

- Visible UI effect:
  - no success popup is shown
  - page description changes to invite-specific copy
  - if masked email is returned, the page shows contextual confirmation of the invited identity

UX purpose:

- reassure the user that they are activating the intended invite before choosing a password

### 4. Invitation preflight failure

- Alert: `showError`
- Visible HTTP status:
  - backend status
  - or `400`
- CTA:
  - `goToLogin`
- Exit:
  - closes the alert
  - redirects to `login`

### 5. Submit before invite resolution

- Alert: `showError`
- Visible HTTP status: `400`
- CTA:
  - `close`
- Exit:
  - closes the alert
  - remains on the page

Interpretation:

- the user should not be allowed to complete onboarding while the invite identity is still unresolved

### 6. Empty password

- Alert: `showError`
- Visible HTTP status: `400`
- CTA:
  - `close`
- Exit:
  - closes the alert
  - remains on the page

### 7. `USER_RESET_PASSWORD_SUCCESS`

- Alert: `showSuccess`
- Visible HTTP status: `200`
- CTA:
  - `goToLogin`
- Exit:
  - closing the alert redirects to `login`

Invitation interpretation:

- for invited users this success means access activation has been completed
- the next normal step is standard login, not repeating the invitation flow

### 8. Technical or functional failure on submit

- Alert: `showError`
- Visible HTTP status:
  - backend status
  - or `500`
- CTA:
  - `close`
- Exit:
  - closes the alert
  - remains on the page

## UX Notes

- invitation mode should feel like controlled onboarding, not generic password reset
- the page should distinguish invalid link, unresolved invite, and successful activation clearly
- the user should always understand the safe next step:
  - home when the link is unusable
  - login after successful activation
  - retry only when the page is still valid
