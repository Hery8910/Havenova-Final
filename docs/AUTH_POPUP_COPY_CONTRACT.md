# Auth Popup Copy Contract

## Objective

This document defines the message contract for auth-related popups and short response texts.

It exists to review the visible copy as part of the auth module itself, not as a later polish pass.

Review scope:

- public auth pages
- session continuity and refresh states
- logout and logout confirmation
- permission and access guards that redirect the user back into auth
- adjacent operational popups that can surface directly to operators or signed-in users

Primary sources:

- [packages/i18n/en/popups.json](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/en/popups.json:1)
- [packages/i18n/es/popups.json](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/es/popups.json:1)
- [packages/i18n/de/popups.json](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/de/popups.json:1)
- [packages/i18n/en/loadings.json](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/en/loadings.json:1)
- [packages/i18n/es/loadings.json](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/es/loadings.json:1)
- [packages/i18n/de/loadings.json](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/de/loadings.json:1)
- [packages/contexts/i18n/fallbackText.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/i18n/fallbackText.ts:1)
- [packages/i18n/{en,es,de}/pages.json](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/en/pages.json:1)

Fallback rule:

- `packages/contexts/i18n/fallbackText.ts` is the only maintained fallback source
- auth must resolve fallback copy through `getI18nFallbacks(language)`
- direct DE-only fallback exports are no longer part of the supported contract

## Copy Rules

### Tone

- messages should sound calm, direct, and non-technical
- the user should understand what happened and what to do next without reading backend terminology
- success copy should confirm the next step, not celebrate the implementation detail

### Brevity

- titles should stay short
- descriptions should explain only the visible consequence and the next action
- avoid overexplaining the cause when that does not help the user recover

### Security

- recovery and resend flows must stay ambiguous when account existence should not be revealed
- token, CSRF, refresh, or session internals should be translated into user-facing consequences instead of exposed verbatim
- messages must not promise an email was sent if the security contract is intentionally ambiguous

### Locale Quality

- `en`, `es`, and `de` must carry the same intent
- translations should be idiomatic, not literal
- Spanish should stay in neutral product language
- German should keep a consistent formal register for auth copy

### Consistency

- the popup title and description must match the real outcome
- a success message must not describe an error branch
- a recovery message must point to the correct next step
- the same auth code should keep the same meaning across pages and apps
- operational success copy should avoid raw CRUD wording when a more user-facing action is clearer
- loading copy should live in `loadings.json` for visible in-progress states
- `popups.json` should stay focused on success, error, confirmation, and recovery states
- page-specific overrides in `pages.json` should be reserved for flow-specific copy such as `manualLoginFallback`, `sessionSyncError`, or link-state explanations

## Audited Auth Families

### Registration and verification

Reviewed codes:

- `USER_REGISTER_SUCCESS`
- `USER_REGISTER_ALREADY_REGISTERED`
- `USER_REGISTER_NEEDS_CORRECT_PASSWORD`
- `USER_LOGIN_EMAIL_NOT_VERIFIED`
- `USER_VERIFY_EMAIL_SUCCESS`
- `USER_VERIFY_EMAIL_VERIFIED`
- `USER_EMAIL_ALREADY_IN_USE`

Expected behavior:

- registration success should push the user toward email verification, not imply direct access
- "already registered" branches should point to login without sounding like a backend conflict
- verification-required branches should sound like a next step, not like a technical failure
- resend-verification success must stay ambiguous and must not confirm that a new email was actually sent

### Login and session continuity

Reviewed codes:

- `USER_LOGIN_SUCCESS`
- `MAGIC_LOGIN_SUCCESS`
- `REFRESH_TOKEN_MISSING`
- `REFRESH_TOKEN_INVALIDATED`
- `REFRESH_TOKEN_EXPIRED`
- `ACCESS_TOKEN_REFRESHED`
- `CSRF_TOKEN_INVALID`

Expected behavior:

- login success should confirm that the session is ready
- refresh/session errors should ask the user to sign in again or reload, without exposing auth internals
- verify-email fallbacks should explain the next step without pretending the full automatic sign-in completed

### Loading states

Reviewed loading keys:

- `REGISTER_LOADING_SUBMIT`
- `login`
- `dashboardLogin`
- `verifyEmail`
- `resendVerification`
- `forgotPassword`
- `resetPassword`

Expected behavior:

- loading messages should describe the current visible operation in one short line
- they should avoid sounding like backend jobs or internal pipelines
- they should stay aligned across locales and avoid mixed sources between `popups` and `loadings`

### Recovery and reset

Reviewed codes:

- `USER_FORGOT_PASSWORD_EMAIL_SENT`
- `USER_RESET_PASSWORD_INVALID_TOKEN`
- `USER_RESET_PASSWORD_TOKEN_EXPIRED`
- `USER_RESET_PASSWORD_SUCCESS`
- `MAGIC_TOKEN_INVALID`
- `MAGIC_TOKEN_EXPIRED`

Expected behavior:

- forgot-password success must remain ambiguous
- forgot-password helper copy in `pages.json` should keep the same ambiguity as the terminal success state
- invalid or expired links should describe the link state and the safe next action
- reset success should hand off clearly to normal login

### Supporting validation and access states

Reviewed codes:

- `USER_LOGIN_MISSING_EMAIL`
- `USER_LOGIN_MISSING_PASSWORD`
- `VALIDATION_ERROR`
- `USER_NOT_FOUND`
- `USER_CLIENT_NOT_FOUND`
- `USER_CLIENT_BLOCKED`

Expected behavior:

- validation copy should tell the user what to fix, not expose an internal validator
- access-copy should describe availability or restriction, not backend object state

## Catalog-Only Codes

Some popup codes still exist in `popups.json` as catalog or backend-alignment entries, but are not part of the visible auth or adjacent runtime flows today.

Current examples:

- `NO_AUTH_USER`
- `CLIENT_CREATE_SUCCESS`
- `CLIENT_FETCH_FAILED`
- `CLIENT_UPDATE_SUCCESS`
- `COMPANY_CREATED`
- `COMPANY_EMAIL_EXISTS`
- `COMPANY_NAME_EXISTS`
- `CONTACT_CREATE_FAILED`
- `CONTACT_DELETE_FAILED`
- `CONTACT_LIST_FAILED`
- `CONTACT_MESSAGE_NOT_FOUND`
- `CONTACT_NOTIFICATION_FAILED`
- `CONTACT_RESPONSE_FAILED`
- `EMAIL_DELIVERY_FAILED`
- `NOTIFICATION_FORBIDDEN_TARGET`
- `NOTIFICATION_NOT_FOUND`
- `USER_CLIENT_PROFILE_EXISTS`

Review rule:

- do not spend UX-polish effort on these as if they were already surfaced
- if a new page or context starts showing one of these codes, it must be re-reviewed as visible copy and added to the relevant flow documentation

## Page And Context Review Rule

When reviewing an auth page or context, the copy review should confirm:

1. which popup codes that flow can surface
2. whether the wording matches the real visible outcome
3. whether the next action in the copy matches the CTA and redirect
4. whether the same intent is preserved across `en`, `es`, and `de`

Linked flow documents that depend on this contract:

- [apps/client/app/[lang]/(auth)/README.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/README.md:1)
- [docs/INVITATION_AUTH_SHARED_PAGE_FLOWS.md](/home/heriberto/Escritorio/Havenova/havenova/docs/INVITATION_AUTH_SHARED_PAGE_FLOWS.md:1)
- [packages/contexts/auth/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/README.md:1)
