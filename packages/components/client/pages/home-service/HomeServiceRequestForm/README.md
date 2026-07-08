# Home Service Request Form

## Objective

This feature collects and submits a client-side draft for a generic home-service request.

It follows the same multi-step request baseline used by other service pages, while keeping
service-specific payload mapping and step branching local to `home-service`.

## Current State

The form currently works in four sequential steps:

1. customer type and service type
2. service details
3. preferred first visit slot
4. service/work address

Current behavior:

- request step state is orchestrated by `HomeServiceRequestForm`
- feature state, text contracts, and request-detail typing now live in
  `homeServiceRequest.types.ts` instead of being redefined inside the main component
- repeated request shell, calendar, address, quantity, field, and step-intro structure already
  converges on shared request primitives
- customer type and service type choice states now compose `ChoiceButtonField` directly instead
  of maintaining a feature-local wrapper component
- `ServiceDetailsRouter` keeps the branching between painting and non-painting flows local to
  the feature
- payload mapping from local form state into canonical service request data remains feature-owned

## Ownership Rules

- keep service-type branching, request detail serialization, and submit mapping inside
  `home-service`
- reuse `shared/serviceRequest` for repeated request structure and generic interaction widgets
- keep embedded profile completion orchestration in the profile domain unless this feature gains
  the same profile gate as `cleaning-service`

## Current Cleanup Status

- request step headers and field framing already converge on shared primitives
- local wrappers that only re-map shared primitives should be removed instead of preserved
- `ServiceDetailsRouter` remains intentionally local: it is only a branch switch between
  painting and non-painting detail views, while state ownership, validation, and payload
  serialization still belong to `HomeServiceRequestForm`
- a dedicated step-2 controller is not justified yet because it would mostly forward parent
  state setters without isolating a second reusable behavior
- the next cleanup target should be architectural drift between `home-service` and
  `cleaning-service`, not more cosmetic component splitting
