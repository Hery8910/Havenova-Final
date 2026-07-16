# Home Service Request Form

## Objective

This feature collects and submits a client-side draft for a generic home-service request.

It follows the same multi-step request baseline used by other service pages, while keeping
service-specific payload mapping and step branching local to `home-service`.

## Current State

The form currently works in five sequential steps:

1. customer type and service type
2. service details
3. preferred first visit slot
4. service/work address
5. review before final submit

Current behavior:

- request step state is orchestrated by `HomeServiceRequestForm`
- feature state and text contracts now live in `homeServiceRequest.types.ts` instead of being
  redefined inside the main component
- feature validation, initial state, service-type ordering, and payload mapping now live in
  `homeServiceRequest.helpers.ts` instead of staying mixed into the main form component
- step headings, footer validation messaging, and step-2 state mutations now also converge on
  `homeServiceRequest.helpers.ts` instead of remaining inline in the form body
- repeated request shell, calendar, address, review, quantity, field, and step-intro structure
  already converges on shared request primitives
- customer type and service type choice states now compose `ChoiceButtonField` directly instead
  of redefining a feature-local button primitive
- step 1 composition now lives in a dedicated local `CustomerServiceTypeStep` instead of staying
  inline inside the main form component
- `ServiceDetailsRouter` keeps the branching between painting and non-painting flows local to
  the feature
- only `painting` currently has a fully defined nested detail flow; the other service types still
  use placeholder detail capture inside the shared step-2 shell
- `ServiceRequestAddressStep` now applies the same embedded profile-completion gate used by
  `cleaning-service`
- `ServiceRequestReviewStep` now frames the final review while keeping service-specific row
  mapping local to `home-service`
- payload mapping from local form state into canonical service request data remains feature-owned

## Ownership Rules

- keep service-type branching, request detail serialization, and submit mapping inside
  `home-service`
- reuse `shared/serviceRequest` for repeated request structure and generic interaction widgets
- keep embedded profile completion orchestration in the profile domain even though the shared
  address step now consumes it

## Current Cleanup Status

- request step headers and field framing already converge on shared primitives
- local wrappers that only re-map shared primitives should be removed instead of preserved
- a local step wrapper is still acceptable when it removes orchestration noise from the main form
  without introducing new domain behavior
- `ServiceDetailsRouter` remains intentionally local: it is only a branch switch between
  painting and non-painting detail views, while state ownership, validation, and payload
  serialization helpers still belong to the `home-service` feature
- `ServiceDetailsStep` for non-painting services is intentionally still a placeholder surface and
  should not be documented as a closed nested-service implementation
- step-2 mutations for `serviceType` and `paintingDetails` are now helper-owned so the main form
  stays focused on flow composition rather than nested object updates
- scheduling step rendering now converges on the shared `ServiceRequestSchedulingStep`
- address-step gating now converges on the shared `ServiceRequestAddressStep`
- final review layout now converges on the shared `ServiceRequestReviewStep`
- a dedicated step-2 controller is not justified yet because it would mostly forward parent
  state setters without isolating a second reusable behavior
- `HomeServiceRequestForm` is now primarily a flow-composition surface rather than a bucket for
  validation and submit mapping details
- the next cleanup target should be the service-detail branch and any remaining documentation
  drift, not more cosmetic component splitting
