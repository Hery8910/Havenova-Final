# Session Route Contract

## Objective

This document defines the repeatable route contract for apps that compose:

- `AuthProvider`
- one session complement: `ProfileProvider`, `AdminProvider`, or `WorkerProvider`

The purpose is to keep auth/account flows structurally consistent across apps while allowing each app to expose only the routes it actually needs.

Current execution phase and completion criteria:

- [SESSION_FOUNDATION_PHASE_PLAN.md](/home/heriberto/Escritorio/Havenova/havenova/docs/SESSION_FOUNDATION_PHASE_PLAN.md:1)

## Shared Route Source

The canonical frontend route catalog now lives in:

- [sessionRoutes.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/navigation/sessionRoutes.ts:1)

This file is the shared base to reuse when a new app is added.

## Shared Auth Routes

Canonical auth route names:

- `login` -> `/user/login`
- `register` -> `/user/register`
- `forgotPassword` -> `/user/forgot-password`
- `verifyEmail` -> `/user/verify-email`
- `setPassword` -> `/user/set-password`

Rule:

- every app reuses the same auth route paths
- each app only mounts the subset it needs
- `dashboard` and `worker` currently require `login`, `forgotPassword`, and `setPassword`
- `client` mounts the full public auth set

## Session Complement Routes

### `client` with `ProfileProvider`

- `overview` -> `/profile`
- `settings` -> `/profile/settings`
- `notifications` -> `/profile/notifications`
- `orders` -> `/profile/orders`
- `requests` -> `/profile/requests`

### `dashboard` with `AdminProvider`

- `overview` -> `/account`
- `profile` -> `/account/profile`
- `preferences` -> `/account/preferences`
- `security` -> `/account/security`
- `notifications` -> `/account/notifications`

### `worker` with `WorkerProvider`

- `overview` -> `/profile`
- `edit` -> `/profile/edit`
- `notifications` -> `/profile/notifications`
- `requests` -> `/profile/requests`

## Structure Rules

- auth pages live under `app/[lang]/(auth)/user/*`
- account/complement pages live under an app-specific protected namespace:
  - `client` -> `app/[lang]/(app)/profile/*`
  - `dashboard` -> `app/[lang]/(app)/account/*`
  - `worker` -> `app/[lang]/(app)/profile/*`
- auth routes mount `AuthProvider` only
- protected app routes mount `AuthProvider + role complement`
- route labels may differ by app copy, but route names and tree shape should stay predictable

## Visual Rule

The visual system may change per app, but the route shell pattern should remain consistent:

- auth pages use `AuthPageShell`
- complement/account routes should keep one canonical namespace per app:
  - `client` and `worker` currently use `/profile`
  - `dashboard` uses `/account`
- the route tree should make it obvious which pages belong to session bootstrap and which belong to the complement domain

## Maintenance Rule

When creating the next app:

1. reuse the shared route constants
2. mount only the auth subset needed by that app
3. define the complement routes under the canonical namespace of that app
4. keep `AuthProvider` and the role complement separated by route group
5. add a contract test for the new app route tree
