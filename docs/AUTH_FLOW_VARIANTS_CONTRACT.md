# Auth Flow Variants Contract

## Objective

This document defines the two canonical auth variants supported by the project.

It exists to document not only the technical path, but also the user-facing contract:

- what kind of user enters each flow
- how the account is created
- what the frontend must communicate
- what the user should expect at each step
- how errors are surfaced and what exit the user receives

## Canonical Variants

### Variant A. Public self-registration

Applies to:

- `apps/client`

Characteristics:

- the user can create their own account from a public route
- the account starts in an unverified state
- email verification is mandatory before the user should be treated as fully activated
- registration does not imply immediate logged-in access

Expected flow family:

1. `register`
2. `verify-email`
3. `login`
4. optional recovery:
   - `forgot-password`
   - `set-password`

User experience rule:

- the primary message is account creation plus verification continuity
- the frontend should never imply that registration alone grants access
- the next expected action after registration is email verification

### Variant B. Invitation-only activation

Applies to:

- `apps/dashboard`
- `apps/worker`

Characteristics:

- the account is not created from a public registration form
- a privileged actor creates or invites the user
- the invited user receives an invitation link
- first access is completed through `set-password` using `inviteToken`

Expected flow family:

1. internal/admin-side invite creation
2. email with invite link
3. `set-password?inviteToken=...`
4. `login`
5. optional later recovery:
   - `forgot-password`
   - `set-password?token=...`

User experience rule:

- the primary message is account activation, not account creation
- the frontend should make clear that the invitation link is a one-time onboarding step
- after password creation, the user should understand that the next normal entry point is `login`
- `login` and `forgot-password` for this variant should stay shared between `dashboard` and `worker` unless the product contract actually diverges
- when `dashboard` and `worker` keep the same onboarding behavior, they should reuse the same shared invitation `set-password` implementation instead of drifting into parallel copies

Shared page-flow contract:

- [INVITATION_AUTH_SHARED_PAGE_FLOWS.md](/home/heriberto/Escritorio/Havenova/havenova/docs/INVITATION_AUTH_SHARED_PAGE_FLOWS.md:1)

## Shared Rules Across Variants

- `auth` owns session creation, refresh, logout, and session recovery
- visible flow states must be documented, not just HTTP calls
- each page must define:
  - happy path
  - expected loading behavior
  - expected success behavior
  - expected error handling
  - user exits and redirects
  - copy/message intent
- compound flows must behave as one visible user operation when successful
- ambiguous security-sensitive flows must not reveal account existence unnecessarily

## Per-App Contracts

### `apps/client`

Canonical auth model:

- public registration
- email verification required
- login only after verification

Contract entry point:

- [apps/client/app/[lang]/(auth)/AUTH_FLOW_CONTRACT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/AUTH_FLOW_CONTRACT.md:1)

### `apps/dashboard`

Canonical auth model:

- invitation-only activation
- no public register page
- onboarding starts from invite resolution in `set-password`

Contract entry point:

- [apps/dashboard/app/[lang]/(auth)/AUTH_FLOW_CONTRACT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/AUTH_FLOW_CONTRACT.md:1)

### `apps/worker`

Canonical auth model:

- same invitation-first base as `dashboard`
- route and UX structure should reuse the same auth contract family

Current expected base:

- the invitation-only variant documented here
- the shared session route contract
- the shared session foundation phase plan

## Completion Rule

The auth foundation cannot be considered closed until:

1. every auth route has a documented user-facing flow contract
2. the two auth variants are explicitly documented
3. user messages and exits are treated as part of the contract
4. implementation, tests, and visible behavior agree with the documented flow
