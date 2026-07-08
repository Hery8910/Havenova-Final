# Page Construction Pattern

## Purpose

This document defines the canonical construction pattern for frontend pages in this workspace.

It exists to stop the project from continuing with multiple parallel page architectures that reflect different historical stages of the codebase.

The goal is reproducibility:

- new pages should be built from one explicit pattern
- existing pages should be migrated toward that pattern
- page review status should be visible without re-auditing the repository from zero

This is the operational bridge between:

- [PAGE_COMPLETION_STANDARD.md](/home/heriberto/Escritorio/Havenova/havenova/docs/PAGE_COMPLETION_STANDARD.md:1)
- [FRONTEND_TARGET_ARCHITECTURE.md](/home/heriberto/Escritorio/Havenova/havenova/docs/FRONTEND_TARGET_ARCHITECTURE.md:1)

## Scope

This baseline currently focuses on public pages under:

- `apps/client/app/[lang]/(app)/*`

Current exclusion inside that tree:

- protected account/profile routes under `apps/client/app/[lang]/(app)/profile/*`
- nested account complements that still need their own audit lane once the public-page baseline is stable
- current baseline for that lane now starts in
  [apps/client/app/[lang]/(app)/profile/PROFILE_AUDIT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/PROFILE_AUDIT.md:1)

It can later be extended to:

- `apps/dashboard`
- `apps/worker`
- auth flows
- tenant app-shell surfaces

## Canonical Route Pattern

### 1. Route entry

Location:

- `apps/*/app/.../page.tsx`

Responsibilities:

- server-first composition by default
- read route-local i18n/content
- pass stable data into the feature surface
- avoid feature-owned styling, helpers, and long inline transformations

Rule:

- a route file is an entry point, not a feature bucket

### 2. Feature surface

Location:

- `packages/components/client/pages/<feature>/`

Minimum shape:

```text
<Feature>Page.client.tsx    optional
<Feature>Page.view.tsx
<feature>.types.ts
<feature>.fallbacks.ts
index.ts
```

Optional shape when complexity justifies it:

```text
sections/
hooks/
adapters/
helpers/
README.md
```

Rules:

- `*.view.tsx` renders page composition
- `*.client.tsx` exists only when client orchestration is genuinely needed
- page-local types stay with the feature until they have real shared ownership
- fallback resolution is explicit and visible

### 3. Shared page primitives

Shared surfaces such as:

- `PageHero`
- `ServiceCrossCtaSection`
- `FAQSection`
- `ServiceRequestShell`

must expose a stable contract and avoid route-specific behavior leaking back into the primitive.

Rule:

- shared primitives own reusable structure
- route-specific layout or visual exceptions stay local until a second real consumer proves promotion

## Canonical Page Families

### A. Informational content page

Reference examples:

- `about`
- `how-it-work`
- `contact` informational shell

Target structure:

```text
page.tsx (server)
  -> <Feature>PageClient optional
    -> <Feature>PageView
      -> PageHero
      -> page-flow main
      -> feature sections
```

Expected properties:

- server-first route composition
- narrow client islands only when required
- `main#app-main-content`
- render tree documented
- style inventory documented
- SSR/CSR split justified

### B. Marketing home page

Reference example:

- `home`

Difference from ordinary informational pages:

- may use a different main-flow layout than `page-flow`
- may include install/status branches and stronger shell coupling

Rule:

- special layout is allowed
- architecture pattern is not allowed to drift just because layout differs

### C. Interactive service page

Reference examples:

- `cleaning-service`
- `home-service`

Target structure:

```text
page.tsx server if possible
  -> feature client container only where interaction/browser APIs require it
    -> feature view
      -> shared hero
      -> form sections
      -> FAQ
      -> shared CTA closure
```

Rules:

- route-level full client rendering is transitional, not target architecture
- domain submit logic must live outside the page body
- form state, validation, payload mapping, and backend integration must not stay mixed in the route entry indefinitely

Current service-form ownership split:

- feature contracts stay in the feature folder, typically in `cleaningRequest.types.ts` or
  `homeServiceRequest.types.ts`
- repeated shell and request widgets converge in `shared/serviceRequest`
- embedded profile completion orchestration stays in the profile domain controller layer until
  more than one service flow proves the same wrapper surface
- feature components such as `CleaningRequestForm.tsx` and `HomeServiceRequestForm.tsx` should
  mostly compose the flow, not redefine their full request contract inline

Current shared request primitives:

- `ServiceRequestShell` in [packages/components/client/pages/shared/serviceRequest/ServiceRequestShell/ServiceRequestShell.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/ServiceRequestShell/ServiceRequestShell.tsx:1)
- `ServiceRequestPageLayout` in [packages/components/client/pages/shared/serviceRequest/ServiceRequestPageLayout/ServiceRequestPageLayout.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/ServiceRequestPageLayout/ServiceRequestPageLayout.tsx:1)
- `AvailabilityCalendar` in [packages/components/client/pages/shared/serviceRequest/AvailabilityCalendar/AvailabilityCalendar.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/AvailabilityCalendar/AvailabilityCalendar.tsx:1)
- `WorkAddressSelector` in [packages/components/client/pages/shared/serviceRequest/WorkAddressSelector/WorkAddressSelector.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/WorkAddressSelector/WorkAddressSelector.tsx:1)
- `ProcessStepsHeader` in [packages/components/client/pages/shared/serviceRequest/ProcessStepsHeader/ProcessStepsHeader.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/ProcessStepsHeader/ProcessStepsHeader.tsx:1)
- `AuthRequiredAlert` in [packages/components/client/pages/shared/serviceRequest/AuthRequiredAlert/AuthRequiredAlert.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/AuthRequiredAlert/AuthRequiredAlert.tsx:1)
- `RequestQuantityStepper` in [packages/components/client/pages/shared/serviceRequest/RequestQuantityStepper/RequestQuantityStepper.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/RequestQuantityStepper/RequestQuantityStepper.tsx:1)
- `RequestField` in [packages/components/client/pages/shared/serviceRequest/RequestField/RequestField.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/RequestField/RequestField.tsx:1)
- `RequestStepIntro` in [packages/components/client/pages/shared/serviceRequest/RequestStepIntro/RequestStepIntro.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/RequestStepIntro/RequestStepIntro.tsx:1)
- `ChoiceButtonField` in [packages/components/client/pages/shared/serviceRequest/ChoiceButtonField/ChoiceButtonField.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/ChoiceButtonField/ChoiceButtonField.tsx:1)

Current meaning:

- shared shell and layout for multi-step service request forms
- centralizes repeated request widgets, structural headers, and button-choice states

Rule:

- request-form shell structure should converge here when at least two service pages share the same shape
- feature-specific step content and business rules must remain local
- feature-owned request contracts should be defined once per feature and imported into the main
  request component instead of being re-authored inside the component file

## Shared Layout Baseline

Current shared helper:

- `page-flow` in [packages/styles/helpers.css](/home/heriberto/Escritorio/Havenova/havenova/packages/styles/helpers.css:1)

Current meaning:

- standard vertical flow for content pages following `PageHero`
- reusable top offset and section spacing

Rule:

- generic content-page vertical rhythm should converge here
- one-off route wrappers should not be recreated when the same flow already exists

## Required Documentation Per Page

Every page that is considered active work should have, at minimum:

- audit document
- render tree
- style inventory
- testing baseline

Optional but recommended:

- feature README when the page owns complex orchestration

Current project rule:

- manual keyboard/evidence closure is being deferred to a final transversal validation pass once
  the shared frontend base stops moving
- intermediate page work should still leave technical closure traceable, but must not claim full
  completion without that final evidence

## Review Registry

Status meanings:

- `complete`: baseline and validation evidence are closed
- `in-progress`: baseline exists but closure gates are still open
- `not-started`: no usable baseline yet

Current client public-page registry:

Scope note:

- this registry tracks the public-page baseline only
- protected profile/account routes are intentionally excluded from this table until their own audit pass starts
- the current private baseline for `profile/*` lives in
  [apps/client/app/[lang]/(app)/profile/PROFILE_AUDIT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/PROFILE_AUDIT.md:1)

| Page | Architecture baseline | SSR/CSR documented | Semantics/a11y audit | Render tree | Style inventory | Testing baseline | Manual evidence | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `home` | yes | yes | yes | yes | yes | yes | partial | in-progress |
| `about` | yes | yes | baseline only | yes | yes | yes | no | in-progress |
| `how-it-work` | yes | yes | baseline only | yes | yes | yes | no | in-progress |
| `contact` | yes | yes | baseline only | yes | yes | yes | no | in-progress |
| `cleaning-service` | yes | yes | baseline only | yes | yes | yes | no | in-progress |
| `home-service` | yes | yes | baseline only | yes | yes | yes | no | in-progress |

Interpretation:

- the first audited family already exists
- the pattern now exists in both service pages, but the audit/documentation baseline is still incomplete
- semantic/accessibility review is not closed merely because a page renders and has labels

## Closure Gates

A page cannot be treated as reproducible until:

- its route shape matches the canonical pattern or an approved exception
- its SSR/CSR split is explicitly justified
- its semantic/accessibility review is documented
- its render and style baselines exist
- its manual validation status is visible

## Immediate Migration Priority

The next architectural targets should be:

1. finish closing the audited public page family (`about`, `how-it-work`, `contact`)
2. apply the same page pattern to `cleaning-service` and `home-service`
3. define the equivalent canonical pattern for dashboard directory/detail pages
4. connect this registry to a broader workspace audit once public pages stop drifting
