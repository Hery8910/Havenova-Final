# Home Service Style Inventory

## Purpose

This document records the real style dependencies of the `home-service` page.

It exists to decide:

- what already sits on the canonical shared style system
- what remains page-local by design
- where the next cleanup pass should focus without mixing style and form logic

## Scope

Relevant surfaces:

- [apps/client/app/[lang]/(app)/home-service/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/home-service/page.tsx:1)
- [packages/components/client/pages/home-service/HomeServicePage.client.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home-service/HomeServicePage.client.tsx:1)
- [packages/components/client/pages/home-service/HomeServicePage.view.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home-service/HomeServicePage.view.tsx:1)
- [packages/components/client/pages/home-service/HomeServiceRequestForm/HomeServiceRequestForm.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home-service/HomeServiceRequestForm/HomeServiceRequestForm.tsx:1)
- [packages/components/client/pages/hero/PageHero.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/hero/PageHero.tsx:1)
- [packages/components/client/faqSection/FAQSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/faqSection/FAQSection.tsx:1)
- [packages/components/client/pages/shared/ServiceCrossCtaSection/ServiceCrossCtaSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/ServiceCrossCtaSection/ServiceCrossCtaSection.tsx:1)
- [packages/components/client/pages/shared/serviceRequest/ServiceRequestPageLayout/ServiceRequestPageLayout.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/ServiceRequestPageLayout/ServiceRequestPageLayout.tsx:1)
- [packages/components/client/pages/shared/serviceRequest/ServiceRequestPageLayout/ServiceRequestPageLayout.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/ServiceRequestPageLayout/ServiceRequestPageLayout.module.css:1)
- [packages/components/client/pages/shared/serviceRequest/AuthRequiredAlert/AuthRequiredAlert.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/AuthRequiredAlert/AuthRequiredAlert.tsx:1)
- [packages/components/client/pages/shared/serviceRequest/RequestQuantityStepper/RequestQuantityStepper.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/RequestQuantityStepper/RequestQuantityStepper.tsx:1)
- [packages/components/client/pages/shared/serviceRequest/RequestStepIntro/RequestStepIntro.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/RequestStepIntro/RequestStepIntro.tsx:1)
- [packages/components/client/pages/shared/serviceRequest/ServiceRequestShell/ServiceRequestShell.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/ServiceRequestShell/ServiceRequestShell.tsx:1)
- [packages/components/client/pages/shared/serviceRequest/ServiceRequestShell/ServiceRequestShell.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/ServiceRequestShell/ServiceRequestShell.module.css:1)
- [packages/components/client/pages/shared/serviceRequest/AvailabilityCalendar/AvailabilityCalendar.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/AvailabilityCalendar/AvailabilityCalendar.tsx:1)
- [packages/components/client/pages/shared/serviceRequest/WorkAddressSelector/WorkAddressSelector.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/WorkAddressSelector/WorkAddressSelector.tsx:1)

## Current Global Style Dependencies

Imported through:

- [apps/client/app/global.css](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/global.css:1)

Current global layers affecting the page:

- `tokens.css`
- `base.css`
- `typography.css`
- `buttons.css`
- `cards.css`
- `motion.css`
- `helpers.css`

Interpretation:

- the route no longer depends on a separate migration runtime layer
- page shell layout is now shared with `cleaning-service`
- hero, FAQ context, shared CTA, cards, buttons, and spacing now resolve through the canonical shared foundation
- the form shell is now shared with `cleaning-service`
- the remaining complexity is concentrated inside the request form step content rather than route-level style indirection

## Global Base Rules Affecting The Page

Confirmed dependencies:

- universal `box-sizing: border-box`
- `html { scroll-behavior: smooth; }`
- `body` typography defaults
- `body` background color and `body::after` overlay
- anchor reset
- image responsive defaults

Source:

- [packages/styles/base.css](/home/heriberto/Escritorio/Havenova/havenova/packages/styles/base.css:1)

Classification:

- active global dependency

## Global Background And Decorative Layers Affecting The Page

Confirmed global background dependency:

- `body::after` page atmosphere layer

Confirmed shared/page-local decorative dependencies:

- `PageHero` media frame and image mask treatment
- `ServiceRequestPageLayout.formSurface` glass/card surface lift above the hero
- `ServiceCrossCtaSection` shared surface gradients and CTA framing
- `AvailabilityCalendar` slot-panel and calendar-stage composition
- `AuthRequiredAlert` fixed floating dialog surface

Interpretation:

- the route atmosphere is mostly shared
- page-local decoration is limited to section spacing and the lifted form surface

## Responsive Behavior Affecting The Page

Confirmed responsive dependencies:

- `PageHero` desktop/tablet/mobile layout changes
- `ServiceRequestPageLayout.main` and `formSection` adjust spacing and overlap across breakpoints
- `ServiceRequestPageLayout.formSurface` reduces padding and radius below `768px`
- `HomeServiceRequestForm.section` remains centered and single-column within the surface
- `HomeServiceRequestForm.form` keeps a viewport-aware minimum height
- shared `AvailabilityCalendar` and `WorkAddressSelector` own their own internal responsive behavior

Interpretation:

- route-level responsiveness is structurally simple
- the main interactive validation surface for small viewports is the form module, not the surrounding page shell

## Motion And Reduced-Motion Dependencies

Confirmed page-level motion dependencies:

- shared navbar and shell transitions
- `PageHero` shared visual motion treatment
- `FAQSection` shared icon/state transitions
- button hover/press behavior from the global button layer
- shared `AvailabilityCalendar` day/slot interaction states

Current status:

- the route depends mostly on shared motion contracts
- route-local reduced-motion work is minimal because the page wrapper itself does not introduce custom animation

## Typography Classes Used By The Page

Confirmed usage through shared primitives:

- `type-display-lg`
- `type-title-lg`
- `type-title-sm`
- `type-body-lg`
- `type-body-md`
- `type-caption`

Ownership:

- hero text uses shared semantic page text helpers
- FAQ and CTA sections consume shared typography contracts
- the form still owns some local typographic assembly for step header and validation copy

## Button Classes Used By The Page

Confirmed usage:

- `button`
- `button--primary`
- `button--secondary`
- `button--ghost`

Current use cases:

- hero CTA
- form step actions and submit actions
- FAQ disclosure triggers
- shared cross-CTA actions

Interpretation:

- this route is now a real consumer of the canonical shared button system
- button-state cleanup should happen in the shared layer, not via route-specific overrides

## Card And Surface Classes Used By The Page

Confirmed usage:

- `card`
- `card--secondary`
- `card--neutral`

Current use cases:

- shared form shell
- FAQ surface
- shared cross-CTA cards

Interpretation:

- route-level card ownership is now intentionally thin
- the custom `formSurface` wrapper is the page-local bridge between hero overlap and the shared card/form internals
- the request shell card rhythm no longer belongs to the feature-local form module

## Token Families Used By The Page

Confirmed shared token families:

- semantic page text tokens
- spacing scale
- card surface, border, radius, and shadow tokens
- feedback tokens
- motion timing and easing tokens
- shared container/layout tokens

Confirmed local/module consumption hotspots:

- `ServiceRequestPageLayout.module.css` owns the repeated page shell for both service routes
- `ServiceRequestShell.module.css` owns the repeated shell tokens for both service forms
- `AvailabilityCalendar` and `WorkAddressSelector` are shared request primitives instead of home-specific modules
- `AuthRequiredAlert` is now a shared request primitive instead of a cleaning-owned dependency
- saved-address merge behavior is now shared through `serviceRequestProfile.helpers.ts`
- quantity-stepper UI is now shared through `RequestQuantityStepper`
- step intro header is now shared through `RequestStepIntro`

Interpretation:

- the route is no longer suffering from token alias chains at page level
- the remaining density is inside the form module, which is the correct place to simplify next

## Current Findings

### 1. The route architecture is cleaner than the form internals

Observed:

- route entry is server-first
- page composition is split cleanly between client container and view
- visual shell ownership is limited to one page module

Decision:

- treat route architecture as baseline-complete
- focus future cleanup on the form implementation, not on route wrappers

### 2. The lifted form shell is the only page-owned visual exception

Observed:

- `formSurface` adds overlap, blur, border, and shadow treatment
- all other major sections are delegated to shared primitives

Decision:

- keep this surface local unless another service page requires a materially identical shell

### 3. The request form remains the primary style hotspot

Observed:

- route shell duplication has already been extracted into `ServiceRequestPageLayout`
- shell duplication has already been extracted into `ServiceRequestShell`
- shared request widgets (`AvailabilityCalendar`, `WorkAddressSelector`) now come from `shared/serviceRequest`
- local step layout and domain-specific visual behavior still remain inside the feature tree
- this is also where functional inconsistencies may still exist

Decision:

- separate visual cleanup from form behavior refactors
- do not treat remaining form complexity as a reason to reintroduce route-level style aliases
