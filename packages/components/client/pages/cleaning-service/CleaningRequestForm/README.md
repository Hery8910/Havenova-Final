# Cleaning Request Form

## Objective

This feature collects and submits a client-side draft for a cleaning service request.

The current UI is already organized as a multi-step flow, but the next refactor will expand
its responsibility in one critical area: profile completion and address handling inside the
service flow itself.

This document records the agreed migration target so implementation can proceed without
losing context.

## Current State

The form currently works in five sequential steps:

1. customer type and recurrence
2. property details
3. preferred first visit slot
4. service/work address
5. review before final submit

Current behavior:

- request step state is orchestrated by `CleaningRequestForm`
- `ServiceProfileStep` decides whether the user must complete profile data before selecting
  the work address
- `WorkAddressSelector` handles address selection and manual address entry without absorbing
  higher-level profile orchestration
- the parent page handles final request submission
- if the user enters a new work address and marks it to be saved, the flow persists it into
  the profile before continuing
- request drafts are persisted in `localStorage` with versioning and owner invalidation

Main limitation:

- the main migration is already implemented; remaining work is centered on automated test
  coverage and later reuse by `home-service`

## Problem Statement

The address step is not only an address selection problem. It is also the last point where
we can safely guarantee that the user profile contains the minimum required information to
send a request.

The previous redirection-based approach was discarded for this flow.

Reasons:

- redirecting to `profile/settings` creates unnecessary friction
- redirecting breaks the user context inside the service funnel
- redirecting would require return logic that should not belong to `settings`
- the service flow still needs local draft persistence even without redirects

The agreed direction is to embed profile completion directly into the service flow and to
separate the reusable profile logic from the `settings` page implementation.

## Product Decisions

### Profile completion rules

The service flow will continue to rely on the shared profile completion rule, currently based
on:

- `name`
- `phone`
- `primaryAddress`

This rule must become more granular so the UI can know what is missing, not only whether the
profile is complete.

Expected shared helpers:

- `isProfileComplete(profile)`
- `getMissingProfileFields(profile)`
- `hasPrimaryAddress(profile)`
- `getSelectableProfileAddresses(profile)`

### Email handling

Email will be shown in service flows as a read-only profile datum.

It is part of the "these are the details we currently have" summary, but it is not part of
the embedded edit form.

Open follow-up task:

- `profile/settings` still needs a dedicated future surface for email and password changes

### Primary and secondary addresses

Primary address remains mandatory before secondary addresses become meaningful.

Agreed rule:

- if the user has no valid primary address, the UI must not expose secondary address flows
- once the primary address is complete, the user may add one or more secondary addresses

This applies to service flows and also motivates a UX change in `profile/settings`.

### Secondary address UX

The current settings form becomes difficult to read when several secondary addresses are
rendered as one long uninterrupted form.

Agreed direction:

- service pages will present a selectable address list
- `profile/settings` will also move toward a selectable list model
- in services, selecting an address means using it for the request
- in `settings`, selecting an address means opening the editor for that specific address

This removes the need for an always-expanded multi-address form.

### Draft persistence

Service request drafts will be persisted in `localStorage`.

Reason:

- we want recovery even if the user leaves the page accidentally or closes the tab

Minimum persistence scope:

- current step
- service form values
- embedded profile step state when applicable

Recommended safeguards:

- store a `version`
- store an `updatedAt`
- invalidate the draft when the authenticated user changes
- allow future expiration handling if old drafts become problematic

### Save timing for embedded profile updates

Embedded profile changes should be persisted when the user completes that subflow, before
continuing with the request.

Decision:

- profile save is handled by the embedded profile wrapper/controller
- the service request form should not absorb profile persistence side effects directly

## Target UX for Service Flows

The cleaning service flow will gain a profile-aware step/orchestrator with these states.

### 1. Incomplete profile

Show an embedded profile completion form.

Visible/editable fields:

- `name`
- `phone`
- `primaryAddress`

Visible/read-only fields:

- `email`

After a successful save:

- the step updates immediately to the completed-profile state
- the user continues without leaving the service page

### 2. Complete profile with no secondary addresses

Show a profile summary with:

- `name`
- `email`
- `phone`
- primary address

Address behavior:

- primary address appears as the default selectable work address
- a CTA allows adding a secondary address

### 3. Complete profile with one or more secondary addresses

Show a profile summary with:

- `name`
- `email`
- `phone`

Show a selectable address list including:

- primary address
- every saved secondary address

Default selection:

- primary address preselected

Service meaning:

- this list selects the address to use for the request

## Target UX for `profile/settings`

This migration also establishes a parallel direction for settings.

`profile/settings` should stop rendering all secondary addresses as one permanently expanded
long form.

Target model:

- show profile summary and address list
- selecting an address opens the specific address editor
- primary address remains the required base address
- secondary addresses become manageable items, not a giant stacked form

This is a structural UX change, not only a visual cleanup.

## Architectural Direction

### Shared profile feature decomposition

The reusable profile feature must be split into independent layers.

Expected pieces:

1. shared profile completion helpers
2. reusable profile form state
3. reusable profile validation
4. reusable profile submit/persistence wrapper
5. context-specific UI wrappers for:
   - `profile/settings`
   - `cleaning-service`
   - later `home-service`

### Shared address building blocks

The following distinction should remain explicit:

- address field inputs
- address editor flows
- address selection flows

Concrete implication:

- `AddressFormFields` remains a shared primitive
- service flows need a profile-aware selector/orchestrator
- settings needs an address management surface, not an endlessly expanded editor

### Service orchestration

The service feature should not push more business orchestration into `WorkAddressSelector`.

Preferred direction:

- create a higher-level service profile step/orchestrator
- keep `WorkAddressSelector` focused on structured work-address selection behavior
- let the orchestration layer decide whether the profile must be completed before address
  selection is available

## Current Technical Baseline

Relevant current files:

- [CleaningRequestForm.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/cleaning-service/CleaningRequestForm/CleaningRequestForm.tsx:1)
- [WorkAddressSelector.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/cleaning-service/CleaningRequestForm/WorkAddressSelector/WorkAddressSelector.tsx:1)
- [AddressFormFields.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/shared/addressFormFields/AddressFormFields.tsx:1)
- [UserProfileDetailsForm.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileSettings/details/form/UserProfileDetailsForm.tsx:1)
- [useUserProfileDetailsController.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileSettings/details/controller/useUserProfileDetailsController.ts:1)
- [useProfileDetailsFormState.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileSettings/details/controller/useProfileDetailsFormState.ts:1)
- [profileDetails.validation.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileSettings/details/controller/profileDetails.validation.ts:1)
- [profileCompletion.helpers.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileCompletionBadge/profileCompletion.helpers.ts:1)

## Implementation Notes

The first migration target is `cleaning-service`.

`home-service` will adopt the same shared architecture later, but its page integration will
be handled in a separate pass.

This means:

- shared primitives must be designed from the start for both services
- page-specific migration can remain incremental

## Migration Checklist

### Phase 1. Shared profile domain extraction

- [x] Extend profile completion helpers with granular missing-field detection
- [x] Add helpers for primary-address presence and selectable profile addresses
- [x] Confirm the exact shared types to be consumed by services and settings

### Phase 2. Reusable profile form core

- [x] Extract reusable profile field state from the current settings controller
- [x] Keep validation reusable and UI-agnostic
- [x] Isolate profile submit/update behavior from `settings`-specific presentation
- [x] Define a reusable wrapper contract for embedded profile save flows

### Phase 3. Settings address UX refactor

- [x] Replace the always-expanded secondary-address form stack with a selectable list
- [x] Preserve primary-address editing as the required base flow
- [x] Open a focused editor for the selected saved address
- [x] Ensure the settings surface stays readable with many saved addresses

### Phase 4. Cleaning service profile-aware step

- [x] Introduce a service profile step/orchestrator before final address usage
- [x] Render the embedded completion form when the profile is incomplete
- [x] Render summary plus selectable addresses when the profile is complete
- [x] Preselect primary address when available
- [x] Allow adding a secondary address from the service flow only after primary address exists

### Phase 5. Draft persistence

- [x] Move service request draft state behind a reusable persistence-capable controller/hook
- [x] Persist the cleaning request draft in `localStorage`
- [x] Persist current step and embedded profile state
- [x] Invalidate persisted drafts when the authenticated user changes
- [x] Add versioning metadata for future migration safety

### Phase 6. Integration and cleanup

- [x] Remove outdated assumptions from `WorkAddressSelector`
- [x] Update parent-page orchestration to consume the new profile-aware flow
- [x] Update internal docs after implementation details settle
- [x] Verify that the resulting primitives are ready for later `home-service` adoption

### Phase 7. Test coverage

- [x] Add unit coverage for shared profile completion helpers and address-selection helpers
- [x] Add tests for reusable profile form validation and field-state transitions
- [x] Add integration coverage for the cleaning-service profile-aware step once implemented
- [x] Add draft-persistence tests for `localStorage` hydration and invalidation rules

## Explicitly Deferred Work

These items are acknowledged but are not part of the first migration pass:

- dedicated email change flow in `profile/settings`
- dedicated password change flow in `profile/settings`
- `home-service` page integration

## Success Criteria

This migration can be considered successful when all of the following are true:

- users never need to leave the service page to complete required profile data
- service drafts survive accidental navigation through persisted local state
- the profile logic is no longer trapped inside `profile/settings`
- `settings` no longer degrades into an unreadable multi-address mega-form
- shared building blocks are ready to be reused by `home-service`

## Current Closure Status

The agreed migration for `cleaning-service` is functionally implemented.

Remaining work for this feature:

- later adoption of the same shared primitives inside `home-service`
