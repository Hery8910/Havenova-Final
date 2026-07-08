# About Style Inventory

## Purpose

This document records the real style dependencies of the `about` page.

It exists to decide:

- what should remain in CSS Modules
- what now reuses the canonical shared system
- what remains legacy or shared without explicit ownership yet

## Scope

Relevant surfaces:

- [apps/client/app/[lang]/(app)/about/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/about/page.tsx:1)
- [packages/components/client/pages/about/AboutPage.view.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/about/AboutPage.view.tsx:1)
- [packages/components/client/pages/about/about.fallbacks.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/about/about.fallbacks.ts:1)
- [packages/components/client/pages/about/storySection/StorySection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/about/storySection/StorySection.tsx:1)
- [packages/components/client/pages/about/storySection/StorySection.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/about/storySection/StorySection.module.css:1)
- [packages/components/client/pages/about/ClientsSection/ClientsSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/about/ClientsSection/ClientsSection.tsx:1)
- [packages/components/client/pages/about/ClientsSection/ClientsSection.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/about/ClientsSection/ClientsSection.module.css:1)
- [packages/components/client/pages/shared/ServiceCrossCtaSection/ServiceCrossCtaSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/ServiceCrossCtaSection/ServiceCrossCtaSection.tsx:1)
- [packages/components/client/pages/shared/ServiceCrossCtaSection/ServiceCrossCtaSection.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/ServiceCrossCtaSection/ServiceCrossCtaSection.module.css:1)
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

- `about` no longer depends on a parallel migration layer
- `StorySection` and `ClientsSection` now reuse shared semantic tokens and canonical card primitives
- `ServiceCrossCtaSection` still depends on an older shared visual contract

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
- `ClientsSection.card` full-bleed image cards with dark overlay
- `ServiceCrossCtaSection.section` radial gradient and elevated surface

Classification:

- active
- visually significant

## Responsive Behavior Affecting The Page

Confirmed responsive dependencies:

- `PageHero` desktop/tablet/mobile layout changes
- `StorySection` keeps a narrow centered reading column
- `ClientsSection.list` is horizontally scrollable with snap behavior
- `ClientsSection.item` changes width only at a smaller breakpoint, but remains a horizontal card lane
- `ServiceCrossCtaSection` wraps actions vertically on mobile

Interpretation:

- the main responsive complexity is not in text sections, but in the horizontal client-card lane
- `ClientsSection` is the route area most likely to need structural migration decisions

## Motion And Reduced-Motion Dependencies

Confirmed page-local motion usage:

- no explicit transitions in `StorySection`
- no explicit transitions in `ClientsSection`, but scroll-snap and overlay composition still affect interaction feel
- `ServiceCrossCtaSection` relies on shared button behavior for interactive motion

Confirmed shell/global motion affecting page context:

- navbar panel transitions
- shared motion utilities
- `PageHero` visual behavior through the migrated layer

Current risk:

- reduced-motion behavior is still not explicitly documented for the horizontal lane in `ClientsSection`

## Typography Classes Used By The Page

Confirmed usage:

- `type-display-lg`
- `type-title-lg`
- `type-title-sm`
- `type-body-md`
- `type-body-sm`

Interpretation:

- `StorySection` and `ClientsSection` now use shared semantic page text helpers
- typography ownership remains mixed because `ServiceCrossCtaSection` still uses the older shared contract

## Button Classes Used By The Page

Confirmed usage:

- `button`
- `button--primary`
- `button--secondary`

Interpretation:

- hero would reuse the shared button contract if CTAs are introduced
- current page-owned CTA behavior comes from `ServiceCrossCtaSection`, which still depends on the shared button layer

## Card And Surface Classes Used By The Page

Confirmed usage:

- `card`
- `card--neutral`

Surface reality:

- `ClientsSection.card` is now a page-owned card implementation layered on top of `card--neutral`
- `ServiceCrossCtaSection.section` is a shared visual surface implemented entirely in its own CSS module

Interpretation:

- this route is beginning to reuse canonical card primitives, but shared CTA surface ownership remains unresolved

## Token Families Used By The Page

Confirmed legacy or older shared tokens:

- `--text-primary`
- `--text-secondary`
- `--container-max`
- `--space-2`
- `--space-3`
- `--space-4`
- `--space-8`
- `--radius-md`
- `--shadow-md`
- `--text-primary`
- `--text-secondary`
- `--border-subtle`
- `--surface-panel-subtle`
- `--text-light-fixed`

Confirmed shared semantic/page tokens through hero:

- semantic page text tokens
- shared page layout tokens
- shared radius, shadow and card surface tokens

Confirmed older shared or legacy tokens still active:

- `--container-max`
- `--space-2`
- `--space-3`
- `--space-4`
- `--space-8`
- `--shadow-md`
- `--text-primary`
- `--text-secondary`
- `--border-subtle`
- `--surface-panel-subtle`
- `--text-light-fixed`

Interpretation:

- `about` is now less legacy-bound than at the start of the audit, but still more mixed than `how-it-work`
- `ServiceCrossCtaSection` is now the clearest remaining non-migrated shared surface

## Current Findings

### 1. StorySection is easy to migrate and low-risk

Observed:

- narrow layout
- straightforward copy structure
- minimal styling responsibilities

Decision:

- this section should not drive further migration complexity and can be treated as structurally stabilized for now

### 2. ClientsSection is the main migration hotspot

Observed:

- horizontal scrolling lane
- large visual cards with full-image backgrounds
- overlay readability layer
- multiple `aria-*` surfaces tied to the same block
- it now also consumes migrated card/page primitives while keeping its local scroll/card composition

Decision:

- treat `ClientsSection` as the primary focus of visual and accessibility migration

### 3. ServiceCrossCtaSection introduces shared-surface ambiguity

Observed:

- it is already used as a reusable page block
- it still owns its own visual surface and older button contract

Decision:

- before migrating `about` fully, decide whether `ServiceCrossCtaSection` should stay visually self-owned or move toward `v2`
