# Home Style Migration Plan

## Purpose

This document splits the Home style migration into ordered work packages.

It exists to prevent token cleanup, page visuals, motion accessibility, and global style ownership from being mixed into one uncontrolled refactor.

## Scope

This plan covers:

- Home page feature styles
- global style layers that materially affect Home
- migration layer activation for Home

Relevant references:

- [HOME_PAGE_AUDIT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/HOME_PAGE_AUDIT.md:1)
- [HOME_STYLE_INVENTORY.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/HOME_STYLE_INVENTORY.md:1)
- [docs/STYLE_MIGRATION_STRATEGY.md](/home/heriberto/Escritorio/Havenova/havenova/docs/STYLE_MIGRATION_STRATEGY.md:1)

## Work Packages

### 1. Foundation Tokens

Goal:

- replace transitional `v2 -> v1` aliases with real owned values where Home already has a stable dependency

Includes:

- page text colors
- page background color
- page gradient/background primitives
- radius primitives used by Home
- shadow primitives used by Home
- container and spacing primitives if they are truly part of the target system

Output:

- `tokens.v2.css` becomes a real token source, not a mirror

Current status:

- partially completed
- `tokens.v2.css` now owns the first Home baseline values instead of referencing `v1`
- light and dark mode values are now declared for the migrated Home token subset

### 2. Base And Page Surface

Goal:

- define which global base/page rules are part of the new system and which remain legacy

Includes:

- reset expectations
- body color and typography defaults
- page background overlay strategy
- whether `scroll-behavior: smooth` remains global

Output:

- clear ownership between future global base system and Home-specific atmosphere

Current status:

- started
- `base.v2.css` now defines the first migrated base/page-surface contract

### 3. Motion And Reduced-Motion Accessibility

Goal:

- make Home motion behavior explicitly accessible

Includes:

- Home-local transitions
- Home-local skeleton animation
- interaction feedback motion
- alignment with `prefers-reduced-motion: reduce`

Output:

- global and page-level motion rules behave consistently for users who reduce motion

Current status:

- started
- reduced-motion coverage was improved in the current global base, global buttons, and Home-local CSS Modules

### 4. Typography Primitives

Goal:

- confirm which text sizes/colors used by Home belong to the system

Includes:

- title/display/body utility usage
- color ownership for headings and body copy
- any Home-specific typography overrides that should remain local

Output:

- typography stays system-owned where generic
- page-specific text layout stays local

Current status:

- started
- Home now consumes `v2-page-heading` and `v2-page-copy` together with the existing type-size utilities

### 5. Button Primitives

Goal:

- formalize the button variants that Home actually depends on

Includes:

- primary
- secondary
- accent
- outline
- focus and hover behavior

Output:

- button ownership can move intentionally instead of relying on inherited legacy behavior

Current status:

- started
- Home now consumes `v2-button` primitives for the button variants it actually uses

### 6. Card And Surface Primitives

Goal:

- separate real system surfaces from page-owned decoration

Includes:

- service cards
- decorative icon surface
- support bar surface
- glass/neutral/primary/secondary surface roles

Output:

- clear distinction between reusable card primitives and Home-only decoration

Current status:

- started
- Home now consumes `v2-card` primitives for service cards, neutral icon surface, and support bar

### 7. Responsive Consolidation

Goal:

- document and normalize the responsive behavior that defines Home

Includes:

- hero breakpoints
- services grid collapse
- app install layout shifts
- global responsive helpers affecting Home

Output:

- responsive behavior becomes part of the migration contract

### 8. Controlled Activation

Goal:

- adopt the migration layer in Home only after the owned primitives are real

Includes:

- import strategy
- duplication review against current global styles
- verification that no fallback dependency on old tokens remains accidental

Output:

- Home becomes the first page that consumes the migration layer intentionally

Current status:

- started
- `Home` already imports and consumes `v2` for page surface, typography, buttons, and core card variants
- consolidation is still pending because these primitives only have one validated page consumer so far

## Recommended Execution Order

1. Foundation Tokens
2. Base And Page Surface
3. Motion And Reduced-Motion Accessibility
4. Typography Primitives
5. Button Primitives
6. Card And Surface Primitives
7. Responsive Consolidation
8. Controlled Activation

## Why This Order

- tokens and page surface define the visual foundation
- motion accessibility must be solved before polishing component primitives
- typography and buttons are more stable than card semantics
- cards are the most visually rich and semantically ambiguous part of the page
- activation should happen last, once ownership is real

## Immediate Next Step

The next implementation pass should focus only on:

- button ownership
- card/surface ownership
- responsive consolidation after the current `v2` activation is validated

The current first migration pass already covered:

- `tokens.v2.css`
- global page/base dependencies that Home actually needs
- reduced-motion gaps that were already visible in Home
- first route-level `v2` activation for page surface and typography
- first route-level `v2` activation for buttons and card surfaces in `Home`

## Consolidation Decision After Home

Current reusable candidates:

- `tokens.v2.css`
- `base.v2.css`
- `motion.v2.css`
- `typography.v2.css`
- `buttons.v2.css`
- `cards.v2.css`

Current Home-only layer:

- `page-home.css`
- section-specific decorative treatments
- page-specific layout composition details

Rule for the next page:

- reuse `v2` primitives first
- only extend `v2` when the next page reveals a real new responsibility
- if the next page needs a one-off treatment, keep it page-local instead of polluting the shared layer
