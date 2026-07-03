# Admin Domain Backend Spec

## Goal

Introduce a dedicated `admin` domain for the dashboard actor without inventing a new resolution model.

This domain should deliberately reproduce the already proven pattern used by:

- `profile` in `client`
- `worker` in the worker-facing operational domain

The objective is not to create a second interpretation of the same account-complement logic.
The objective is to keep one reusable architectural rule and apply it to the correct actor.

This is a maintenance requirement as much as a product requirement:

- frontend and backend should resolve account-complement domains with the same conceptual contract
- `admin` and `worker` must not solve the same problem with different shapes, different bootstrap rules, or different permission semantics
- long-term cost must be reduced by reusing structure, lifecycle, and access rules wherever the actor model is equivalent

## Problem Summary

The current model mixes two different operational actors under the same `worker` complement:

- internal client staff who operate the dashboard
- external/subcontracted workers who should not access the dashboard

That creates ambiguity in:

- protected-route access
- onboarding/bootstrap
- invitation semantics
- identity complement loading after auth
- future maintenance of permissions and UI surfaces

The issue is not only role naming.
The issue is that two different domains are currently being treated as if they were the same account complement.

## Required Separation

The platform should close on three account-complement domains:

- `profile`
  - actor: final client/user
  - surface: `client`
  - stack: `auth + profile`

- `admin`
  - actor: internal client staff
  - surface: `dashboard`
  - stack: `auth + admin`

- `worker`
  - actor: external/subcontracted worker
  - surface: dedicated worker app/route
  - stack: `auth + worker`

## Architectural Rule

`auth` remains responsible only for session and base membership:

- authenticated identity
- `authId`
- `userClientId`
- `clientId`
- role
- verification
- refresh/logout/session continuity

Each app then loads its own account-complement domain:

- `client` loads `profile`
- `dashboard` loads `admin`
- worker app loads `worker`

Backend and frontend must preserve this same separation.

## Backend Requirement

Create an `admin` domain as a reproduction of the existing `worker` domain structure wherever possible.

This means:

- same general lifecycle shape
- same BFF/backend contract philosophy
- same bootstrap discipline
- same persistence/update semantics
- same role-based guarded access expectations

Do not create a bespoke domain if it only restates `worker` behavior with renamed fields.

## Domain Intent

### Admin

Represents the internal operator identity attached to a client tenant.

Expected usage:

- dashboard access
- dashboard-visible identity
- internal operational preferences
- account-complement data for client staff

Expected fields at minimum:

- `userClientId`
- `clientId`
- `email`
- `name`
- `phone`
- `address`
- `profileImage`
- `language`
- `theme`
- optional operational metadata in `extra`
- timestamps
- status / verification if needed

### Worker

Represents an external/subcontracted worker identity.

Expected usage:

- dedicated worker route/app
- limited operational scope
- worker-specific data and access

This domain should not grant dashboard shell access.

## Access Rules

### Dashboard

Dashboard access should resolve through `auth` role plus `admin` complement.

Allowed dashboard actors:

- `admin`
- optionally `super_admin` if the product keeps that role

Not allowed:

- `worker`
- `user`
- `guest`

### Worker Surface

Worker-only routes should resolve through `auth` role plus `worker` complement.

Allowed worker actors:

- `worker`

Not allowed:

- `admin`
- `user`
- `guest`

If product later wants cross-access, that should be an explicit rule, not an accidental byproduct of shared complements.

## Bootstrap Rules

### First Dashboard Operator

The first internal operator for a tenant must bootstrap as:

- `auth`
- `userClient`
- `admin`

This must not rely on the `worker` domain.

If the current backend bootstrap path only provisions `auth + userClient`, extend it so the initial dashboard operator is created with `admin` as part of the same provisioning story.

### Worker Bootstrap

Worker provisioning remains separate and should create:

- `auth`
- `userClient`
- `worker`

It must not be used to provision the first dashboard operator.

## Invitation Rules

Admin invitations and worker invitations must be treated as separate domain flows, even if they reuse common auth primitives.

Shared auth primitives may be reused:

- invite token resolution
- set-password flow
- login
- refresh
- `/me`

But the domain target must differ:

- admin invitation provisions or activates `admin`
- worker invitation provisions or activates `worker`

Do not hide this distinction behind one generic complement-creation path if the resulting permissions differ.

## Suggested Backend Shape

### Data Model

Add an `admin` entity analogous to `worker`.

Suggested baseline fields:

- `userClientId`
- `clientId`
- `email`
- `name`
- `phone`
- `address`
- `profileImage`
- `language`
- `theme`
- `extra`
- `createdAt`
- `updatedAt`
- optional `status`
- optional `isVerified`

This shape should stay intentionally close to `worker` unless product requirements force divergence.

### Routes

Mirror the worker-domain route structure where useful.

Suggested minimum:

- `GET /api/home-services/admin`
  - get admin complement for authenticated admin

- `POST /api/home-services/admin`
  - create admin complement where backend bootstrap rules allow it
  - normally for controlled provisioning flows, not arbitrary self-provisioning

- `PATCH /api/home-services/admin`
  - update own admin complement

- `DELETE /api/home-services/admin`
  - optional, if product needs it

Potential admin-management routes if needed later:

- `GET /api/home-services/admin/list`
- `GET /api/home-services/admin/:adminId`
- `POST /api/home-services/admin/resend-invite`

Do not add these unless product actually needs them, but keep the contract style aligned with `worker`.

## Session Contract

The auth session should continue to expose the canonical base identity:

- `authId`
- `userClientId`
- `clientId`
- `role`
- `status`
- `isVerified`

The session contract should not try to replace the admin/worker complement.

However, backend should make it unambiguous which complement must load next:

- `role=admin` -> load `admin`
- `role=worker` -> load `worker`
- `role=user` -> load `profile`

This mapping must remain stable and documented.

## Reuse Requirements

The backend implementation should reuse worker-domain logic wherever the behavior is the same:

- validation approach
- persistence helpers
- update rules
- route protection strategy
- response envelope shape
- audit/logging strategy
- invitation resolution flow

The frontend already has the same requirement.
This is not only a frontend concern.
Backend must also avoid creating two parallel domain implementations that solve the same complement-resolution problem in different ways.

If `admin` and `worker` diverge, they should diverge only where product rules actually differ:

- permissions
- route ownership
- provisioning/bootstrap rules
- actor-specific metadata

Not in:

- envelope shapes
- naming conventions without reason
- auth/complement handoff
- basic CRUD semantics
- error handling model

## Recommended Implementation Order

1. Define `admin` entity and contract by reproducing the `worker` baseline.
2. Define access rules so dashboard is backed by `admin`, not `worker`.
3. Define initial bootstrap flow for the first tenant operator as `auth + userClient + admin`.
4. Separate invitation semantics between `admin` and `worker`.
5. After backend is stable, reproduce `WorkerContext` in frontend as `AdminContext`.
6. Mount dashboard with `AuthProvider + AdminProvider`.
7. Reserve `WorkerContext` for the dedicated worker-only surface.

## Non-Goals

This change should not:

- reintroduce dashboard dependence on `profile`
- keep `worker` as a temporary dashboard identity complement
- encode permissions only in frontend guards
- create a one-off admin implementation unrelated to `worker`

## Final Rule

Optimize for maintenance first.

If two domains are resolving the same architectural problem, they should share the same model and lifecycle unless product requirements force a real difference.

The system should end with one repeated rule:

- auth resolves base session
- each surface loads its correct complement domain
- complements are separated by actor, not improvised by route
