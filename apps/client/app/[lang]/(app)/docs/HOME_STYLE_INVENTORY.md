# Home Style Inventory

## Purpose

This document records the real style dependencies of the Home page.

It is the source document used to decide:

- what remains in CSS Modules
- what belongs in the migration style layer
- what should remain part of the current global system
- what is legacy and should be removed

## Scope

Relevant surfaces:

- [apps/client/app/[lang]/(app)/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/page.tsx:1)
- [packages/components/client/pages/home/HomePage.view.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home/HomePage.view.tsx:1)
- [packages/components/client/pages/home/home.fallbacks.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home/home.fallbacks.ts:1)
- [packages/components/client/pages/home/AppInstallSection/AppInstallSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home/AppInstallSection/AppInstallSection.tsx:1)
- [packages/components/client/pages/home/ServicesSection/ServicesSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home/ServicesSection/ServicesSection.tsx:1)
- [packages/components/client/pages/home/BenefitsSection/BenefitsSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home/BenefitsSection/BenefitsSection.tsx:1)
- [packages/components/client/pages/hero/PageHero.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/hero/PageHero.tsx:1)

## Current Global Style Dependencies

Imported through:

- [apps/client/app/global.css](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/global.css:1)

Current global layers used by Home:

- `tokens.css`
- `base.css`
- `typography.css`
- `buttons.css`
- `cards.css`
- `motion.css`
- `helpers.css`

Current status:

- the temporary migration layer used during the audit was removed
- Home now consumes the canonical shared system directly through `apps/client/app/global.css`
- the active visual contracts are now `button`, `card`, semantic page tokens, and CSS-module-owned page decoration

## Global Base Rules Affecting Home

Home also depends on global base behavior outside its feature CSS Modules.

Confirmed global base dependencies:

- universal `box-sizing: border-box`
- `html { scroll-behavior: smooth; }`
- `body` typography defaults
- `body` background color
- `body::after` fixed background layer
- default heading styles
- default paragraph color
- media display/max-width defaults
- anchor reset

Source:

- [packages/styles/base.css](/home/heriberto/Escritorio/Havenova/havenova/packages/styles/base.css:1)

Classification:

- active global dependency
- must be included in the migration scope

## Global Background And Decorative Layers Affecting Home

Confirmed global background dependency:

- `body::after` uses the shared page background color and gradient

Confirmed Home/local decorative dependencies:

- `PageHero.heroImage` opacity and mask gradients
- `ServicesSection::before` section background image
- `BenefitsSection::after` blurred radial gradients

Classification:

- active
- visually significant

Migration note:

- the future system must distinguish between global page atmosphere and page-owned decoration

## Responsive Behavior Affecting Home

Confirmed responsive dependencies:

- `PageHero` desktop/tablet/mobile layout changes
- `ServicesSection` grid collapse at `max-width: 800px`
- `AppInstallSection` grid and CTA restructuring below `768px`
- global `.section-padding` adjustment at `max-width: 1024px`
- Home now uses shared layout tokens from `packages/styles`, including page inline padding and content width

Classification:

- active
- currently split across global CSS and local CSS Modules

## Motion And Reduced-Motion Dependencies

Confirmed Home-local motion usage:

- `ServicesSection.card` transition
- `ServicesSection.cardLink` transition
- `BenefitsSection.benefitCard` transition
- `AppInstallSection` skeleton shimmer

Confirmed shell/global motion affecting Home context:

- navbar enter animations
- shared motion utilities in `motion.css`

Confirmed current accessibility gap:

- before this pass, global motion utilities respected `prefers-reduced-motion: reduce` but Home-local motion did not

Current update:

- global `base.css` now disables smooth scrolling and compresses animation/transition timing under `prefers-reduced-motion: reduce`
- `buttons.css` now disables button transition/hover movement for reduced-motion users
- Home section modules now disable their local transitions and skeleton shimmer under reduced motion

Classification:

- improved in this pass
- now owned by the shared base/motion system instead of a parallel `v2` layer

## Typography Classes Used By Home

Confirmed usage:

- `type-display-lg`
- `type-display-md`
- `type-title-xl`
- `type-title-md`
- `type-title-sm`
- `type-title-lg`
- `type-body-lg`
- `type-body-sm`

Current classification:

- active
- still part of the current canonical system

Migration note:

- do not duplicate these in the migration layer yet
- only migrate if multiple audited pages prove current typography helpers are insufficient or inconsistent

Current update:

- Home now relies on the shared semantic text tokens directly
- typography utility sizing remains on the canonical shared system

## Button Classes Used By Home

Confirmed usage:

- `button`
- `button--primary`
- `button--secondary`
- `button--accent`

Removed from Home:

- `button_invert`

Current classification:

- current active button system for Home now reuses the canonical shared `button` primitives
- `button_invert` was legacy and is now removed from this page

Migration note:

- the temporary migration button layer was removed after converging back to the shared button contract
- Home remains one of the reference routes validating the shared button surface

## Card And Surface Classes Used By Home

Confirmed usage:

- `card`
- `card--primary`
- `card--secondary`
- `card--neutral`

Current use cases:

- service cards
- decorative icon surface inside service cards
- app install support bar

Classification:

- active
- migrated for Home in this pass

Migration note:

- `glass-panel--base` was replaced in the Home support bar
- `card--neutral` semantics were intentionally preserved on the shared card contract, including the service icon surface

## Radius Tokens Used By Home

Current shared radius convention:

- scale-based radius tokens from `packages/styles`

Decision:

- radii are now named by scale, not by component name
- avoid declarations such as component-owned radius aliases

## Token Families Used By Home

Confirmed current page text tokens:

- semantic `--page-text-*` tokens from the shared system

Other confirmed tokens:

- shared spacing tokens
- shared page layout tokens
- shared card surface tokens
- shared radius and shadow tokens
- shared accent/background tokens used by Home modules

Resolved issue:

- `ServicesSection` and `BenefitsSection` no longer rely on the older generic text aliases
- Home is now more consistently aligned to the page text token family

Migration note:

- this section is now historical context only
- the temporary `v2` baseline was removed after its values converged into `packages/styles`

Current update:

- `PageHero`, `ServicesSection`, `BenefitsSection`, and `AppInstallSection` now consume `v2` heading/body tokens
- `PageHero` also consumes `v2` page-surface/layout tokens such as navbar height, container max, and spacing primitives
- `BenefitsSection` now consumes `v2` decorative gradient tokens as well
- `ServicesSection` now consumes `v2` card-shadow and list-marker tokens
- `AppInstallSection` skeleton support surface now consumes the `v2` neutral-card tokens instead of legacy glass variables
- redundant `v2` aliases for page background/text consumption were removed in favor of direct responsibility-based tokens

## Consolidation Status

The temporary `v2` primitives described during the migration are no longer active.

Current interpretation:

- the surviving shared primitives now live in `packages/styles`
- what remained page-specific stayed in CSS Modules
- this document should be read as migration history, not as the current runtime dependency tree

### Home-specific or still transitional pieces

- `PageHero` image mask and opacity treatment
- `ServicesSection::before` background image
- `BenefitsSection::after` decorative gradient composition
- service icon surface as a neutral mini-card
- support-bar layout composition in `AppInstallSection`

Current interpretation:

- these pieces may continue to exist in `Home`
- they should not be treated as shared system primitives yet
- they need a second page or a stronger cross-page requirement before promotion

## Current Responsive/Layout Decisions For Home

Confirmed page-level layout rules:

- page shell max width: `1400px`
- content max width: `1200px`
- inline padding on smaller devices and general page edges: `5dvw`
- section vertical rhythm uses a shared `v2` section spacing token

Confirmed responsive balance fixes in this pass:

- `AppInstallSection` no longer carries a larger top gap than the surrounding sections
- `ServicesSection` icon surface and icon size now scale in closer proportion to the heading
- `BenefitsSection` icons now scale up more appropriately on mobile

Requirement:

- these layout and balance rules are now part of the Home completion criteria, not optional polish

## Home-Specific CSS Module Ownership

These currently remain correctly local:

- layout spacing and section structure
- service card layout
- benefits list layout
- install section grid behavior
- hero media layout and masking

Classification:

- keep local unless multiple pages need the exact same implementation rule

## Legacy Or Transitional Style Cases

### 1. Removed

- `button_invert`

### 2. Transitional

- decorative neutral icon surface in `ServicesSection`

Reason:

- it is cleaner than before, but still may deserve a narrower visual primitive later

### 3. Review later

- whether the neutral icon surface remains best expressed as a small card primitive after a second page validates it

## Suggested Shared-System Candidates From Home

Not to implement broadly yet, but good candidates to monitor:

- decorative neutral surface primitive if reused beyond Home

Explicit non-candidate for now:

- a duplicated outline button alias that only wraps the current `v2` button system

## Current Decision

For Home right now:

- keep using the existing global typography utilities
- do not duplicate stable global utilities into the migration layer yet
- use the migration layer only as a controlled staging area for rules that audited pages actually need to stabilize
- keep any first extraction page-scoped before promoting it to a cross-page primitive

## Next Style Tasks For Home

1. Compare Home against the next audited page to find genuine duplicate style needs before growing the shared system.
2. Decide whether the service icon surface should stay card-based or become a narrower primitive.
3. Extract a new shared helper only if more than one page needs the same rule and it belongs in `packages/styles`.
4. Review Home-local transitions and skeleton animation against a project-wide reduced-motion standard.
5. Confirm that the `v2` button/card contracts survive a second page without local exceptions.
