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
- `ServiceRequestPageLayout`
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

## Migration Note

When a service page duplicates the same shell structure, reuse this directory first.

If a future page needs a materially different request flow, keep the difference local until the pattern is proven reusable.

Profile-specific completion controllers are not owned here yet.

Current rule:

- request pages may reuse shared request primitives
- feature request contracts remain feature-owned even when both pages use the same shell
- embedded profile completion orchestration should live under the profile domain until a second
  service flow proves the full wrapper component shape
