# Invitation Auth Shared Page Flows

## Objective

This document defines the shared visible behavior for the invitation-only auth pages reused by `apps/dashboard` and `apps/worker`.

Shared implementation sources:

- [InvitationLoginPage.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/invitationLogin/InvitationLoginPage.tsx:1)
- [InvitationForgotPasswordPage.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/invitationForgotPassword/InvitationForgotPasswordPage.tsx:1)
- [InvitationSetPasswordPage.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/invitationSetPassword/InvitationSetPasswordPage.tsx:1)
- [authShell.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/authShell/authShell.module.css:1)

Rule:

- `apps/dashboard` and `apps/worker` should document only actor/app-specific differences on top of this contract
- route wrappers in each app should stay thin
- visual changes to these public pages should be declared against the shared auth shell first
- popup/message review for these flows is governed by [AUTH_POPUP_COPY_CONTRACT.md](/home/heriberto/Escritorio/Havenova/havenova/docs/AUTH_POPUP_COPY_CONTRACT.md:1)
- fallback copy for these shared pages must resolve through `getI18nFallbacks(language)` so the same behavior remains aligned across `en`, `es`, and `de`

## Visible Intent Rule

For every shared invitation auth message or exit, document:

- trigger
- intended user understanding
- primary CTA
- cancel behavior
- final destination or stay-on-page outcome

Expected intent by shared route:

- `login`: confirm invited access, not public signup
- `forgot-password`: offer neutral recovery without exposing account existence
- `set-password`: confirm invite activation or password replacement, then move to `login`

## Login

### Base Sequence

1. The user submits `email`, `password`, and `clientId`.
2. The page shows loading.
3. The frontend calls `loginUser(payload)`.
4. On success, the frontend retries `getAuthUser()` to synchronize the real server session.
5. The page shows success and redirects to `/`.

### Cases

#### 1. Missing required input

- Alert: `showError`
- Visible HTTP status: `400`
- CTA:
  - `cancelLabel = close`
- Exit:
  - closes the alert
  - remains on the page

#### 2. `USER_LOGIN_EMAIL_NOT_VERIFIED`

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

- this route does not redirect to a public email-verification screen
- that is intentional only because this variant assumes invitation-first activation, not public registration

#### 3. Backend success without `user`

- Alert: `showError`
- Visible HTTP status: `500`
- CTA:
  - `cancelLabel = close`
- Exit:
  - closes the alert
  - remains on the page

#### 4. `USER_LOGIN_SUCCESS`

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

#### 5. Technical or functional error in `catch`

- Alert: `showError`
- Visible HTTP status:
  - backend status when available
  - or `500`
- CTA:
  - `cancelLabel = close`
- Exit:
  - closes the alert
  - remains on the page

### UX Notes

- the page must communicate controlled access, not self-registration
- success should feel like access confirmation
- failure should keep the user in a safe retry state
- recovery is mounted separately under `forgot-password`

### Visible Intent Summary

- loading: validate invited access credentials
- not verified: explain activation is incomplete, but keep the user in safe retry state
- success: confirm access was granted and redirect automatically
- technical failure: avoid signup language and keep the retry or close decision explicit

## Forgot Password

### Base Sequence

1. The user submits `email`, `language`, and `clientId`.
2. If `clientId` is missing, the flow fails immediately.
3. The page shows loading.
4. The frontend calls `forgotPassword(payload)`.
5. On success, the page shows an intentionally neutral confirmation and offers continuity to `login`.

### Cases

#### 1. `CLIENT_MISSING_CLIENT_ID`

- Alert: `showError`
- Visible HTTP status: `400`
- CTA:
  - `close`
- Exit:
  - closes the alert
  - remains on the page

#### 2. `USER_FORGOT_PASSWORD_EMAIL_SENT`

- Alert: `showSuccess`
- Visible HTTP status: `200`
- CTA:
  - `goToLogin`
  - `close`
- Exit:
  - `confirm` navigates to `login`
  - `cancel` closes the alert and remains on the page

#### 3. `CLIENT_NOT_FOUND`

- Alert: `showError`
- Visible HTTP status: `404`
- CTA:
  - `close`
- Exit:
  - closes the alert
  - remains on the page

#### 4. `VALIDATION_ERROR`

- Alert: `showError`
- Visible HTTP status: `400`
- CTA:
  - `close`
- Exit:
  - closes the alert
  - remains on the page

#### 5. Technical error (`catch`, missing code, or `>= 500`)

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

### UX Notes

- the success response must remain ambiguous and must not reveal whether the email exists
- the route should feel like controlled access recovery for invited users
- the next safe step after success is always normal login

### Visible Intent Summary

- loading: communicate recovery request processing
- success: confirm next steps will happen through email, without confirming account existence
- functional error: stop the attempt and keep the user on a safe public route
- technical error: allow retry without exposing system detail

## Set Password

### Base Sequence

1. The page reads `token` and `inviteToken` from the URL.
2. If `inviteToken` exists, the page first calls `resolveInvite({ inviteToken })`.
3. The page updates the copy with invite-specific messaging when resolution succeeds.
4. The user submits `password` and `confirmPassword`.
5. The frontend sends `resetPassword({ token | inviteToken, newPassword })`.
6. On success, the page directs the user to `login`.

### Cases

#### 1. Missing both `token` and `inviteToken`

- Alert: `showError`
- Visible HTTP status: `500` on initial effect, `400` on submit branch
- CTA:
  - initial effect: `goToHome`
  - submit branch: `goToLogin`
- Exit:
  - the user is moved to a safe route because the page cannot operate

#### 2. Serialized `status=error` in URL

- Alert: `showError`
- Visible HTTP status:
  - `http` query param
  - or `400`
- CTA:
  - `goToHome`
- Exit:
  - closes the alert
  - redirects to `/`

#### 3. Invitation preflight success

- Visible UI effect:
  - no success popup is shown
  - page description changes to invite-specific copy
  - if masked email is returned, the page shows contextual confirmation of the invited identity

UX purpose:

- reassure the user that they are activating the intended invite before choosing a password

#### 4. Invitation preflight failure

- Alert: `showError`
- Visible HTTP status:
  - backend status
  - or `400`
- CTA:
  - `goToLogin`
- Exit:
  - closes the alert
  - redirects to `login`

#### 5. Submit before invite resolution

- Alert: `showError`
- Visible HTTP status: `400`
- CTA:
  - `close`
- Exit:
  - closes the alert
  - remains on the page

Interpretation:

- the user should not be allowed to complete onboarding while the invite identity is still unresolved

#### 6. Empty password

- Alert: `showError`
- Visible HTTP status: `400`
- CTA:
  - `close`
- Exit:
  - closes the alert
  - remains on the page

#### 7. `USER_RESET_PASSWORD_SUCCESS`

- Alert: `showSuccess`
- Visible HTTP status: `200`
- CTA:
  - `goToLogin`
- Exit:
  - closing the alert redirects to `login`

Invitation interpretation:

- for invited users this success means access activation has been completed
- the next normal step is standard login, not repeating the invitation flow

#### 8. Technical or functional failure on submit

- Alert: `showError`
- Visible HTTP status:
  - backend status
  - or `500`
- CTA:
  - `close`
- Exit:
  - closes the alert
  - remains on the page

### UX Notes

- invitation mode should feel like controlled onboarding, not generic password reset
- the page should distinguish invalid link, unresolved invite, and successful activation clearly
- the user should always understand the safe next step:
  - home when the link is unusable
  - login after successful activation
  - retry only when the page is still valid

### Visible Intent Summary

- invalid link states: explain the route cannot operate and move to a safe public path
- invite preflight success: reassure identity before the password choice without showing a fake terminal success
- loading: communicate secure password setup or replacement
- reset success: confirm activation or password replacement is complete and push to `login`
- technical failure: keep retry, close, or safe-exit behavior explicit without exposing backend detail
