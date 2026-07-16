# Shared Service Request Primitives

## Purpose

This directory owns shared UI primitives for interactive service-request pages.

It exists to keep repeated request-form structure out of route features such as:

- `cleaning-service`
- `home-service`
- future service pages with the same request flow shape

## Current Scope

Current shared ownership:

- `AvailabilityCalendar`
- `AuthRequiredAlert`
- `ChoiceButtonField`
- `mergeSavedAddressFromRequest`
- `ProcessStepsHeader`
- `RequestQuantityStepper`
- `RequestField`
- `RequestStepIntro`
- `ServiceRequestAddressStep`
- `ServiceRequestPageLayout`
- `ServiceRequestReviewStep`
- `ServiceRequestSchedulingStep`
- `ServiceRequestShell`
- `WorkAddressSelector`
- service-request shared UI types
  - work-address selection
  - scheduling copy contract
  - address-step copy contract

## Rules

- move only repeated request-form structure here
- keep domain-specific fields, validation rules, payload mapping, and submit logic inside each feature
- keep feature request contracts in feature-owned `*.types.ts` files instead of redefining them
  inline inside the main request component
- do not introduce route-specific visual exceptions into shared primitives
- do not promote a local pattern until at least a second real consumer validates it

## Proven Consumers

`ChoiceButtonField` is now validated by three real request-flow consumers:

- `CustomerTypeSelector`
- `ServiceTypeSelector`
- cleaning frequency selection in `CustomerFrequencyStep`

## ServiceRequestShell Contract

`ServiceRequestShell` owns:

- form shell layout
- step heading
- step counter
- validation message slot
- back/primary action row
- base shell spacing and surface rhythm

`ServiceRequestShell` does not own:

- step content
- domain validation
- step transition rules
- submit side effects
- feature-specific empty/error branches beyond generic shell framing

## ServiceRequestSchedulingStep Contract

`ServiceRequestSchedulingStep` owns:

- the shared step-pane wrapper around `AvailabilityCalendar`
- the missing-client-calendar fallback surface
- pass-through mapping from scheduling copy into the calendar primitive

`ServiceRequestSchedulingStep` does not own:

- step transition rules
- scheduling validation state
- request submit side effects
- feature-specific draft persistence

## ServiceRequestAddressStep Contract

`ServiceRequestAddressStep` owns:

- the shared profile-completion gate used before address selection
- the embedded profile summary shown once the required fields are complete
- the composition bridge into `WorkAddressSelector`

`ServiceRequestAddressStep` does not own:

- request submit logic
- feature-specific address validation rules beyond presence
- saved-address persistence side effects

## ServiceRequestReviewStep Contract

`ServiceRequestReviewStep` owns:

- the shared review-step card grid
- the repeated section and key/value row framing
- the shared heading and description wrapper

`ServiceRequestReviewStep` does not own:

- feature-specific review row mapping
- request payload serialization
- feature-specific submit side effects

## Migration Note

When a service page duplicates the same shell structure, reuse this directory first.

If a future page needs a materially different request flow, keep the difference local until the pattern is proven reusable.

The embedded profile completion controller still lives under the profile domain.

Current rule:

- request pages may reuse shared request primitives
- feature request contracts remain feature-owned even when both pages use the same shell
- the shared address step may compose the embedded profile controller, but profile persistence
  rules still belong to the profile domain
