# Manual Testing Guide for `apps/client/app/[lang]/(auth)`

This document is the working guide for manual visual and functional testing of the auth route in `apps/client`.

Goal of this phase:

- validate the normal auth flows without forcing missing `clientId`, broken permissions, or tampered tokens
- confirm that the first connection to the client is stable on every run
- verify that the UI, texts, alerts, redirects, and backend logs all match the expected behavior
- register each case in a consistent way so the final review is based on evidence, not memory

Related files:

- [README.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/README.md)
- [packages/contexts/alert/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/alert/README.md)
- [packages/contexts/auth/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/README.md)
- [packages/services/auth/authService.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/auth/authService.ts)
- [packages/utils/user/userHandler.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/user/userHandler.ts)

## Scope of This Phase

This guide covers only normal scenarios:

- cold load of auth pages
- register with a new user
- login with expected states
- verify email with a valid flow
- resend verification email
- forgot password
- reset password with a valid token

This guide does not cover yet:

- forced missing `clientId`
- manual cookie corruption
- missing permissions
- invalid or tampered tokens
- backend shutdown / intentional 5xx simulations

## Test Philosophy

Every case starts from the first connection to the client again.

That means:

- open the page from a clean browser state
- let the initial tenant bootstrap happen again
- record the first backend requests again
- only then execute the specific auth action for the case

Important:

- the backend user created in previous cases may stay in the database
- the browser state must still be reset before each case
- if a case depends on an already-created user, keep the account but clear local browser state

## Environment Preparation

For every case:

1. Open backend logs and keep them visible.
2. Open browser DevTools.
3. In `Network`, enable `Preserve log`.
4. Clear browser state for the client app:
   - cookies
   - local storage
   - session storage
5. Confirm these auth-related keys are gone before starting:
   - `hv-auth`
   - `hv-worker-profile`
   - any key starting with `hv-profile:`
6. Start the case by directly opening the target auth route.

Recommended test data:

- one fresh user email for registration
- one unverified account
- one verified account
- one account with a recently changed password

Suggested naming pattern:

- `auth.test+register.001@example.com`
- `auth.test+verify.001@example.com`
- `auth.test+reset.001@example.com`

## What to Record in Every Case

Record all of this for each run:

- date and time
- environment and branch
- route used for the first load
- language used
- browser and viewport
- email used in the case
- whether the first client bootstrap succeeded cleanly
- whether the page layout looked correct before interaction
- whether the alert texts were concise and stable in height
- whether the redirects matched the expected route
- relevant backend events and codes
- final result: `pass`, `pass with notes`, or `fail`

## Common UI Checklist

Check these items in every auth page before submitting anything:

- logo is visible and centered
- title is visible
- description is visible and short
- form spacing is even
- no text overlaps or wrapping glitches
- inputs, labels, and helper text align correctly
- footer links are visible and ordered correctly
- mobile and desktop typography feel proportional
- no alert opens on initial render unless the route explicitly requires it

## Common Alert Checklist

For every alert shown during a case:

- title is short and understandable
- description is concise
- buttons fit without wrapping badly
- the component does not jump excessively in height between `loading` and `success/error`
- the primary CTA matches the expected user next step
- `close` only closes
- `continue` or `retry` does something meaningful

## Common Backend Signals

These are the main backend requests expected in normal auth testing:

- `GET /api/clients/tenant/:tenantKey`
- `GET /api/auth/me`
- `POST /api/auth/refresh-token`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/verify-email`
- `POST /api/auth/magic-login`
- `POST /api/auth/resend-verification`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password-confirm`

Examples of relevant log events you may see:

- `CLIENT_PUBLIC_FETCH_SUCCESS`
- `AUTH_ACCESS_DENIED`
- `AUTH_REFRESH_SUCCEEDED`
- `AUTH_ME_FETCHED`
- auth success/failure events for register, login, verify email, forgot password, reset password

Interpretation rule:

- always compare the log sequence with the route and the exact action performed
- a log is only useful if it matches the moment the UI changed

## Baseline for the First Connection

Before evaluating any auth form, confirm that the first connection itself is stable.

Expected baseline for a clean anonymous browser:

1. The client bootstrap succeeds.
2. The target page renders without broken layout.
3. If auth bootstrap runs, anonymous access may produce an auth denial or a guest fallback path.
4. No blocking error alert should appear on a normal auth page cold load.

Minimum expected backend stability signal:

- one successful public client fetch for the tenant

If the first load is already unstable, stop that case and mark it separately as:

- `bootstrap unstable`

## Test Cases

## Case 1. Cold Load on Register Page

Purpose:

- validate the first connection from a clean state
- validate the register page layout before any action

Route:

- `/{lang}/user/register`

Preconditions:

- no browser auth state
- backend account not required yet

Steps:

1. Clear browser state.
2. Open `/{lang}/user/register`.
3. Wait until the page is fully rendered.
4. Do not submit anything yet.
5. Inspect layout on desktop.
6. Inspect layout on mobile width.

Expected UI:

- page renders without modal alerts
- title and description are visible
- register form is centered
- TOS checkbox block is aligned
- footer shows login and home navigation clearly

Expected backend/network:

- `GET /api/clients/tenant/:tenantKey` succeeds
- auth bootstrap may call `GET /api/auth/me`
- if there is no valid session, anonymous auth handling must not break the page

Record:

- whether the first request chain was stable
- whether the page is visually ready without interaction

## Case 2. Successful Registration of a New User

Purpose:

- validate the standard register flow for a brand new user

Route:

- `/{lang}/user/register`

Preconditions:

- use a new email not registered before
- browser state must be clean before opening the page

Steps:

1. Clear browser state.
2. Open `/{lang}/user/register`.
3. Fill email.
4. Fill a valid password.
5. Accept TOS.
6. Submit the form.
7. Observe loading alert.
8. Observe success alert.
9. Continue with the CTA shown in the alert.

Expected UI:

- no local validation error if the form is valid
- one loading alert appears during submit
- one success alert appears after backend success
- texts are concise
- buttons are stable and visible
- final redirect matches the current frontend behavior

Expected backend/network:

- successful client bootstrap first
- `POST /api/auth/register`
- no fake or duplicated submit
- no unrelated auth error should interrupt the flow

Notes to capture:

- exact success message shown
- final route after confirm/cancel
- whether the created account is still unverified after registration

## Case 3. Login Attempt With an Unverified Account

Purpose:

- validate the normal business branch where the account exists but email is not verified yet

Route:

- `/{lang}/user/login`

Preconditions:

- account created in Case 2
- email not verified yet
- browser state cleared before the case

Steps:

1. Clear browser state.
2. Open `/{lang}/user/login`.
3. Enter the unverified account email and password.
4. Submit.
5. Observe the alert.
6. Use the primary CTA if shown.

Expected UI:

- loading alert during submit
- error alert indicating email verification is required
- alert CTA guides the user to the verify-email page
- no generic internal error message

Expected backend/network:

- successful client bootstrap first
- `POST /api/auth/login`
- backend should return the unverified-email branch, not a generic failure

Expected navigation:

- primary action should take the user to `/{lang}/user/verify-email`

## Case 4. Verify Email From a Valid Link

Purpose:

- validate the normal verify-email flow from a real token

Route:

- `/{lang}/user/verify-email?token=...`

Preconditions:

- unverified account exists
- valid verification email was received
- use a real token from the email
- clear browser state before opening the link

Steps:

1. Clear browser state.
2. Open the real verification link directly.
3. Do not interact immediately.
4. Let the page run the automatic flow.
5. Observe all alert transitions.
6. Confirm the final success state.

Expected UI:

- verify page loads correctly first
- automatic loading states appear in sequence
- final success alert is shown
- the user is redirected according to current frontend behavior
- no contradictory error after a successful verification

Expected backend/network:

- successful client bootstrap first
- `POST /api/auth/verify-email`
- if backend returns `magicToken`, then `POST /api/auth/magic-login`
- auth session refresh/bootstrap may also happen after magic login

Special observation:

- note whether the flow shows multiple loading states
- note whether the alert height stays visually controlled between transitions

## Case 5. Resend Verification Email

Purpose:

- validate the manual resend flow on the verify-email page

Route:

- `/{lang}/user/verify-email`

Preconditions:

- unverified account exists
- browser state cleared before the case

Steps:

1. Clear browser state.
2. Open `/{lang}/user/verify-email`.
3. Fill the email if it is not already present.
4. Submit resend.
5. Observe loading and success states.

Expected UI:

- page content is visible even before submitting
- resend action shows a loading alert
- success alert confirms the email was sent again
- CTA and close behavior are clear

Expected backend/network:

- successful client bootstrap first
- `POST /api/auth/resend-verification`

Notes to capture:

- whether the email field is prefilled or not
- whether the success message is concise

## Case 6. Successful Login With a Verified User

Purpose:

- validate the normal login flow for a verified account

Route:

- `/{lang}/user/login`

Preconditions:

- use a verified user account
- clear browser state before the case

Steps:

1. Clear browser state.
2. Open `/{lang}/user/login`.
3. Enter valid credentials.
4. Submit.
5. Observe loading.
6. Observe success.
7. Confirm final redirect.

Expected UI:

- clean loading alert
- success alert with concise message
- no unexpected intermediate error
- redirect to the expected post-login route

Expected backend/network:

- successful client bootstrap first
- `POST /api/auth/login`
- authenticated bootstrap may follow with `GET /api/auth/me`

Notes to capture:

- whether the first authenticated page after login renders correctly
- whether any profile-related fetch fails after login

## Case 7. Forgot Password Request

Purpose:

- validate the normal request-reset-link flow

Route:

- `/{lang}/user/forgot-password`

Preconditions:

- use an existing account email
- clear browser state before the case

Steps:

1. Clear browser state.
2. Open `/{lang}/user/forgot-password`.
3. Enter the account email.
4. Submit.
5. Observe loading.
6. Observe success.
7. Use the CTA if present.

Expected UI:

- page layout is stable before submit
- one loading alert
- one success alert
- CTA should make sense for the next user step

Expected backend/network:

- successful client bootstrap first
- `POST /api/auth/forgot-password`

Notes to capture:

- exact success copy
- whether the user is guided back to login

## Case 8. Reset Password With a Valid Token

Purpose:

- validate the normal password reset completion flow

Route:

- `/{lang}/user/set-password?token=...`

Preconditions:

- a valid reset email exists
- use a real reset token
- clear browser state before opening the link

Steps:

1. Clear browser state.
2. Open the real reset link directly.
3. Confirm the page renders correctly.
4. Enter a valid new password.
5. Submit.
6. Observe loading.
7. Observe success.
8. Follow the alert CTA.

Expected UI:

- page renders without error if the token is valid
- no local validation error for a valid password
- loading alert during submit
- success alert after backend confirmation
- redirect to login after success

Expected backend/network:

- successful client bootstrap first
- `POST /api/auth/reset-password-confirm`

## Case 9. Login With the New Password

Purpose:

- confirm that the password reset is effective and the account can log in normally

Route:

- `/{lang}/user/login`

Preconditions:

- password was changed successfully in Case 8
- browser state cleared before the case

Steps:

1. Clear browser state.
2. Open `/{lang}/user/login`.
3. Enter the account email.
4. Enter the new password.
5. Submit.
6. Observe loading and success.

Expected UI:

- normal login success path
- no message related to the old password
- redirect works

Expected backend/network:

- successful client bootstrap first
- `POST /api/auth/login`
- optional authenticated bootstrap after login

## Per-Case Record Template

Copy this block for every run:

```md
### Case:

- Date:
- Environment:
- Branch/commit:
- Language:
- Browser:
- Viewport:
- Start route:
- Test email:

#### First connection

- Client bootstrap stable: yes / no
- First backend events:
- Notes:

#### UI before action

- Layout correct: yes / no
- Texts concise: yes / no
- Responsive correct: yes / no
- Notes:

#### Action result

- Requests triggered:
- Alerts shown:
- Final route:
- Expected behavior matched: yes / no
- Notes:

#### Backend logs

- Main events:
- Any mismatch with UI:

#### Final status

- Result: pass / pass with notes / fail
- Follow-up needed:
```

## Final Analysis Template

When all cases are finished, summarize with this matrix:

| Case | First connection stable | UI correct | Alert copy correct | Redirect correct | Backend logs aligned | Result |
| --- | --- | --- | --- | --- | --- | --- |
| 1 |  |  |  |  |  |  |
| 2 |  |  |  |  |  |  |
| 3 |  |  |  |  |  |  |
| 4 |  |  |  |  |  |  |
| 5 |  |  |  |  |  |  |
| 6 |  |  |  |  |  |  |
| 7 |  |  |  |  |  |  |
| 8 |  |  |  |  |  |  |
| 9 |  |  |  |  |  |  |

Questions to answer after the matrix is filled:

1. Is the first tenant bootstrap stable in every case?
2. Do the auth pages remain visually consistent across desktop and mobile?
3. Are alert messages short enough to avoid disruptive UI jumps?
4. Does every normal failure or branch guide the user to the next correct route?
5. Do backend logs confirm the same story that the UI is telling?
6. Which mismatches are visual only, and which are functional?

## Suggested Order of Execution

Run the cases in this order:

1. Case 1
2. Case 2
3. Case 3
4. Case 5
5. Case 4
6. Case 6
7. Case 7
8. Case 8
9. Case 9

Why this order:

- it starts from a truly new user
- it keeps the unverified and verified states separate
- it avoids mixing the password reset flow too early
- it makes backend log review easier because the account history is more understandable
