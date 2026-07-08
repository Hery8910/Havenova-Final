# How It Work Style Inventory

## Purpose

This document records the real style dependencies of the `how-it-work` page.

It exists to decide:

- what should remain in CSS Modules
- what already reuses the canonical shared system
- what remains legacy and should not be promoted blindly

## Scope

Relevant surfaces:

- [apps/client/app/[lang]/(app)/how-it-work/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/how-it-work/page.tsx:1)
- [packages/components/client/pages/howItWorks/HowItWorksPage.view.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/howItWorks/HowItWorksPage.view.tsx:1)
- [packages/components/client/pages/howItWorks/howItWorks.fallbacks.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/howItWorks/howItWorks.fallbacks.ts:1)
- [packages/components/client/pages/howItWorks/WorkflowSection/WorkflowSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/howItWorks/WorkflowSection/WorkflowSection.tsx:1)
- [packages/components/client/pages/howItWorks/WorkflowSection/WorkflowSection.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/howItWorks/WorkflowSection/WorkflowSection.module.css:1)
- [packages/components/client/pages/howItWorks/BenefitsSplitSection/BenefitsSplitSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/howItWorks/BenefitsSplitSection/BenefitsSplitSection.tsx:1)
- [packages/components/client/pages/howItWorks/BenefitsSplitSection/BenefitsSplitSection.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/howItWorks/BenefitsSplitSection/BenefitsSplitSection.module.css:1)
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

- `how-it-work` no longer depends on a parallel migration layer
- the page now reuses shared page semantics, canonical cards, and canonical buttons directly
- the remaining debt is local module ownership and documentation drift, not an active `v2` runtime layer

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

Confirmed page/local decorative dependencies:

- `PageHero` image mask and framing treatment
- `BenefitsSplitSection.container` colored band surface
- `BenefitsSplitSection.imageWrapper` framed media surface
- `BenefitsSplitSection.image` shadowed product/illustration composition

Classification:

- active
- visually significant

## Responsive Behavior Affecting The Page

Confirmed responsive dependencies:

- `PageHero` desktop/tablet/mobile layout changes
- `WorkflowSection` uses shared `5dvw` inline padding and centered stacked layout
- `BenefitsSplitSection` now uses a stable two-column grid that collapses to one column below `1000px`
- `BenefitsSplitSection.imageWrapper` keeps a controlled media height on large screens and releases it naturally on smaller screens

Interpretation:

- responsive behavior is not only about stacking
- the image treatment in benefits is now structurally cleaner, but still needs visual verification in real viewports

## Motion And Reduced-Motion Dependencies

Confirmed page-local motion usage:

- `WorkflowSection.stepCard` hover lift and shadow transition
- `BenefitsSplitSection.image` positioning changes across breakpoints, but no explicit animation

Confirmed shell/global motion affecting page context:

- navbar panel transitions
- shared motion utilities
- `PageHero` visual behavior through the migrated layer

Current status:

- `WorkflowSection` now includes local reduced-motion handling
- route-level manual verification is still pending

## Typography Classes Used By The Page

Confirmed usage:

- `type-display-lg`
- `type-title-lg`
- `type-title-sm`
- `type-body-lg`
- `type-body-sm`
- `type-label`

Mixed ownership:

- hero combines type-size utilities with shared semantic page text helpers
- workflow and benefits sections now also use shared semantic page text helpers
- the remaining legacy dependency here is primarily utility sizing, not text-color ownership

## Button Classes Used By The Page

Confirmed usage:

- `button`
- `button--primary`
- `button--secondary`

Interpretation:

- the route button layer is now aligned between hero and benefits
- `how-it-work` is another audited route consuming the shared button contract

Migration note:

- the next visual pass should verify whether the current shared button primitives are sufficient without route-specific exceptions

## Card And Surface Classes Used By The Page

Confirmed usage:

- `card`
- `card--neutral`
- `card--accent`

Current use cases:

- workflow step cards
- workflow numeric badge
- workflow note card

Interpretation:

- workflow now validates the shared card path beyond `Home`
- the badge still acts as a decorative/utility consumer of the same surface system and should remain under review

## Token Families Used By The Page

Confirmed legacy tokens:

- `--type-body-md-size`

Confirmed shared tokens through route and sections:

- semantic page text tokens
- shared layout tokens
- shared radius and shadow tokens
- shared card surface tokens
- shared motion timing tokens

Interpretation:

- the route still spans two token families, but the legacy surface is now much smaller
- the remaining obvious legacy token is `--type-body-md-size` inside the workflow badge

## Current Findings

### 1. The hero is already on the migrated path, but the page body is not

Interpretation:

- this was true at the start of the audit, but it is no longer the full picture
- workflow and benefits now also consume migrated primitives, so the route has progressed from hero-only adoption to partial page adoption

### 2. Workflow remains a self-contained legacy island

Observed:

- workflow now uses migrated cards and page text colors
- the remaining debt is the badge sizing token and the fact that hover semantics are still local to the module

Decision:

- keep the remaining local behavior in the module until another page proves a reusable need

### 3. Benefits has the strongest visual cleanup need

Observed:

- CTA classes are already migrated
- the section now uses a more stable grid/media composition instead of margin compensation plus absolute positioning
- the remaining work is visual validation, not structural rescue

Decision:

- the benefits band should be the first target of final visual verification on desktop and mobile

### 4. The page already justifies a second audited consumer for the shared system cleanup

Interpretation:

- the route is no longer dependent on a parallel migration layer
- the next pass should document exactly which shared primitives are stable enough to reuse without aliases
