# Contact Style Inventory

## Purpose

This document records the real style dependencies of the `contact` page.

It exists to decide:

- what should remain in CSS Modules
- what already reuses the canonical shared system
- what remains legacy or shared without clear ownership yet
- what must stay deferred because it belongs to the form/backend task

## Scope

Relevant surfaces:

- [apps/client/app/[lang]/(app)/contact/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/contact/page.tsx:1)
- [packages/components/client/pages/contact/ContactPage.view.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/ContactPage.view.tsx:1)
- [packages/components/client/pages/contact/ContactPageView.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/ContactPageView.module.css:1)
- [packages/styles/helpers.css](/home/heriberto/Escritorio/Havenova/havenova/packages/styles/helpers.css:1)
- [packages/components/client/pages/contact/contact.fallbacks.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/contact.fallbacks.ts:1)
- [packages/components/client/pages/contact/InfoSection/InfoSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/InfoSection/InfoSection.tsx:1)
- [packages/components/client/pages/contact/InfoSection/InfoSection.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/InfoSection/InfoSection.module.css:1)
- [packages/components/client/faqSection/FAQSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/faqSection/FAQSection.tsx:1)
- [packages/components/client/faqSection/FAQSection.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/faqSection/FAQSection.module.css:1)
- [packages/components/client/pages/contact/ContactForm/ContactForm.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/ContactForm/ContactForm.tsx:1)
- [packages/components/client/pages/contact/ContactForm/ContactForm.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/ContactForm/ContactForm.module.css:1)
- [packages/components/client/pages/hero/PageHero.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/hero/PageHero.tsx:1)

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

Current interpretation:

- `contact` no longer depends on a parallel migration layer
- the route consumes shared page semantics through the canonical global foundation
- `InfoSection` now uses shared tokens and primitives directly
- `FAQSection` and `ContactForm` still remain on older shared styling contracts

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

- `PageHero` image mask and framing treatment
- `InfoSection.contactSection::before` rotated radial accent shape
- `InfoSection.actionImage` drop-shadow treatment

Classification:

- active
- visually significant

Interpretation:

- the page atmosphere is partly shared and partly local
- `InfoSection` is the clearest page-owned decorative surface outside the hero

## Responsive Behavior Affecting The Page

Confirmed responsive dependencies:

- `PageHero` desktop/tablet/mobile layout changes
- `ContactPageView.wrapper` wraps form and info column responsively
- `ContactForm.row` collapses through `auto-fit` grid behavior
- `ContactForm.actions` stretches submit CTA on small screens
- `InfoSection.quickActions` is hidden on desktop and becomes visible below `768px`
- `FAQSection` compresses internal spacing below `720px`

Interpretation:

- the page has a real breakpoint split between informational links and form emphasis
- `InfoSection.quickActions` is mobile-biased UI, so visual validation must include a small viewport

## Motion And Reduced-Motion Dependencies

Confirmed page-local motion usage:

- `InfoSection.actionLink` hover lift and box-shadow transition
- `FAQSection.icon` rotate/color transition
- `ContactForm.input` and `textarea` transitions on focus state

Confirmed shell/global motion affecting page context:

- navbar panel transitions
- shared motion utilities
- `PageHero` visual behavior through the migrated layer

Current risk:

- `InfoSection` now includes local reduced-motion handling for its quick actions
- `FAQSection` and `ContactForm` still lack route-local reduced-motion handling
- `Contact` remains behind `Home` and `how-it-work` until those remaining surfaces are addressed

## Typography Classes Used By The Page

Confirmed usage:

- `type-display-lg`
- `type-title-lg`
- `type-title-md`
- `type-title-sm`
- `type-body-lg`
- `type-body-md`
- `type-caption`

Mixed ownership:

- hero uses `PageHero` and therefore already depends on shared semantic page text helpers
- `InfoSection` now consumes shared page text tokens at its heading surface
- `FAQSection` and `ContactForm` still rely on older typography utility sizes plus legacy text-color tokens

Interpretation:

- typography ownership is split between migrated hero semantics and legacy body/form semantics

## Button Classes Used By The Page

Confirmed usage:

- `button`
- `button--primary`
- `button--secondary`
- `button--ghost`

Interpretation:

- hero CTA styling still comes from the current shared button system through `PageHero`
- form submit uses the legacy/shared primary button contract
- FAQ triggers rely on the ghost variant and therefore remain tied to the older button layer
- `InfoSection` quick actions now use page-local shared token styling, but not the canonical button primitive

Decision:

- do not migrate buttons for this route in isolation yet
- button migration should wait until the non-form surface is either explicitly moved to `v2` or kept on the old shared contract on purpose

## Card And Surface Classes Used By The Page

Confirmed usage:

- `card`
- `card--secondary`
- `card`
- `card--neutral`

Current use cases:

- form container
- contact information container

Interpretation:

- `ContactForm` still depends on the current shared card system
- `InfoSection` now validates shared card usage on this route
- the route now mixes card systems intentionally while the form stays deferred

## Token Families Used By The Page

Confirmed shared tokens through hero and info surfaces:

- shared navbar and page layout tokens
- shared page text tokens
- shared spacing tokens
- shared card surface, shadow and radius tokens
- shared motion timing and button state tokens

Confirmed older shared or legacy tokens:

- `--text-primary`
- `--text-secondary`
- `--surface-border`
- `--surface-1`
- `--surface-3`
- `--brand-primary`
- `--border-subtle`
- `--color-error`
- `--container-max`
- `--font-family-body`
- `--radius-sm`
- `--radius-md`
- `--radius-lg`
- `--shadow-md`
- `--space-3`
- `--space-4`
- `--space-5`
- `--space-6`
- `--space-8`
- `--space-10`
- `--motion-base`
- `--ease-standard`

Interpretation:

- `contact` currently spans two style systems on the same route
- hero and `InfoSection` are now on the migrated path, while `FAQSection` and `ContactForm` still live on older shared tokens
- the largest token concentration outside the hero is in `ContactForm`, which is intentionally deferred

## Current Findings

### 1. Contact is not yet a route-level `v2` consumer

Previous state:

 - this was true before the first non-form migration pass

Current state:

- the temporary migration layer has been removed from runtime
- `ContactPageView` no longer declares a `v2` page wrapper
- `InfoSection` now consumes shared tokens and primitives directly

Decision:

- `contact` is now a partial route-level `v2` consumer
- do not treat the route as fully migrated until `FAQSection` and the final route-level ownership decision are resolved

### 2. InfoSection is the main non-form visual hotspot

Observed:

- decorative radial accent
- mobile-only quick actions
- local hover/focus styling
- mix of semantic contact content and decorative action icons

Decision:

- `InfoSection` was the correct first non-form migration target
- the next review should validate it visually in desktop and mobile before promoting any of its patterns further

### 3. FAQSection is structurally simple but still tied to the old shared system

Observed:

- simple accordion layout
- old button ghost styling
- legacy page color tokens
- local icon motion

Decision:

- `FAQSection` can likely migrate cleanly after `InfoSection`
- it should stay in CSS Module ownership, even if it begins consuming `v2` tokens later

### 4. ContactForm should not drive this visual migration phase

Observed:

- the form has the heaviest style surface in the route outside the hero
- it mixes layout, input styling, validation affordances, transitions, and service-integration concerns

Decision:

- keep `ContactForm` out of the current migration decision
- treat form styling as part of the deferred form/backend pass so architecture and integration changes can happen together

### 5. The route needs a split visual strategy, not a blanket migration

Recommended immediate path:

- keep hero as-is on the migrated shared surface
- validate the current `InfoSection` migration visually
- evaluate `FAQSection` second
- leave `ContactForm` on the current shared/legacy stack until the form task begins

## Closure Recommendation For This Phase

At the end of the current non-form phase, `contact` should be treated as complete only if:

- `InfoSection` and `FAQSection` have an explicit ownership decision
- the route-level ownership decision is documented
- reduced-motion gaps are either fixed or explicitly deferred
- the form remains clearly excluded from the page-style closure decision
