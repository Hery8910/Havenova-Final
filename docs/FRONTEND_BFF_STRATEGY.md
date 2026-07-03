# Frontend BFF Strategy

## Purpose

This document closes the integration decision for backend communication in the frontend workspace.

It exists to avoid a split architecture where:

- auth uses one integration model
- business domains use another
- each new project re-discovers cookie, CSRF, CORS, and browser-behavior problems

## Closed Decision

The canonical browser-facing integration model is:

- `browser -> frontend BFF -> central backend`

This is now the target platform rule for the workspace.

It is not an auth-only patch.

It is the base integration architecture the platform should reuse across future multi-client projects.

## Why This Decision Is Closed

The auth problem exposed a broader platform issue:

- browser-to-backend direct calls create cross-origin and cross-site fragility
- auth suffers first because cookies and CSRF are highly sensitive to browser behavior
- other protected domains will eventually need the same server-side integration control

If auth alone moves behind a BFF while the rest of the app stays browser-to-backend direct, the platform keeps two competing contracts:

- same-origin for auth
- direct cross-origin for business endpoints

That is not a stable base for product replication.

## Platform Rule

Target rule:

- the browser should call frontend routes only
- frontend server routes are responsible for communicating with the central backend
- backend-domain concerns such as cookies, CSRF forwarding, origin forwarding, error propagation, and request shaping belong to the BFF layer

Corollary:

- `NEXT_PUBLIC_API_URL` should not remain the canonical runtime path for browser auth calls
- frontend domains should converge toward relative browser calls such as `/api/...`

## BFF Scope Model

The BFF is not a single implementation style for every endpoint.

Two layers are expected:

### 1. Auth Adapter

Used for:

- login
- session bootstrap
- refresh
- logout
- password update
- change email
- magic login

Responsibilities:

- server-to-server backend calls
- cookie bridging/re-issuing
- `x-csrf-token` forwarding
- controlled forwarding of `x-frontend-origin`
- preservation of backend status and error codes

### 2. Domain Gateway / Proxy

Used for:

- protected business routes
- tenant-aware frontend API access
- selected public routes when centralization is beneficial

Responsibilities:

- controlled server-side forwarding
- shared request/response policy
- observability hooks
- header normalization
- optional auth/session context integration

Important rule:

- auth should use an explicit adapter, not a blind proxy
- business routes may use lighter forwarding when explicit adaptation is not needed

## Implementation Order

This workspace will not migrate every route at once.

Closed order:

1. establish the BFF base infrastructure
2. implement auth on top of that infrastructure
3. validate auth as the first fully migrated domain
4. migrate other services progressively onto the same BFF model

This means:

- auth is the first migrated domain
- auth is not the final boundary of the BFF

## Reuse Requirement

The reusable platform output should not be “some auth pages that happen to work”.

It should be:

- a stable BFF integration pattern
- a reusable auth domain contract
- a predictable migration recipe for future projects

Minimum reusable assets expected from this line of work:

- BFF route conventions
- backend client helpers
- auth cookie bridge policy
- CSRF forwarding policy
- auth service contract for frontend consumers
- testing checklist for browser, network, and backend correlation
- documentation that clearly separates:
  - current transitional state
  - canonical target state
  - historical evidence

## Current Repository Interpretation

Current state in the repository:

- browser auth now uses same-origin frontend routes
- auth BFF routes exist in `client`, `dashboard`, and `worker`
- reusable server-side BFF helpers exist for backend requests, response shaping, and auth cookie bridging
- a transitional browser-direct axios client still exists for domains that have not been migrated yet

Interpretation:

- the repo is no longer in a pre-BFF state
- the BFF foundation already exists and is now the canonical direction
- the remaining work is to finish migrating residual browser-direct domains onto the same base

## Initial Implementation Status

The first implementation phase now exists in the repository:

- auth browser services already use same-origin frontend routes
- auth BFF routes exist in both `client` and `dashboard`
- auth BFF routes also exist in `worker`
- profile browser services already use same-origin frontend routes
- profile BFF routes exist in both `client` and `dashboard`
- client bootstrap retries now use same-origin frontend routes in the browser
- tenant bootstrap BFF routes exist in both `client` and `dashboard`
- client service-request flows now use same-origin frontend routes in `client`
- contact browser services now use same-origin frontend routes
- contact BFF routes exist in both `client` and `dashboard`
- dashboard admin flows now use same-origin frontend routes
- dashboard and worker worker-domain flows now use same-origin frontend routes
- reusable server-side helpers now exist for:
  - backend requests
  - proxy response shaping
  - auth cookie bridging
  - server-side auth bootstrap access checks

Current interpretation:

- auth is now migrated onto the BFF model across the mounted apps
- profile is now the second protected domain migrated onto the same BFF base
- client bootstrap, service-request, and contact now also follow the same-origin BFF model
- dashboard admin and worker-management flows now also follow the same-origin BFF model
- the rest of the workspace still contains transitional browser-direct services such as notifications and several lower-priority dashboard domains
- the next domains should reuse the same BFF base instead of creating new direct-call exceptions

## Documentation Rule From Now On

Documentation in this workspace must classify auth and backend integration notes as one of:

- canonical target
- transitional current state
- historical evidence

Cross-origin direct auth notes may still be preserved as historical evidence, but they must not be described as the platform target architecture anymore.
