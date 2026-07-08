# Design System Phase 1 Inventory

## Purpose

This document captures the first operational inventory for the design-system refactor.

It converts the high-level refactor plan into a concrete map of:

- current style sources
- ownership conflicts
- duplicated layers
- token families
- primitive contracts
- first removal candidates

This is the baseline for the first code migration pass.

## Scope Reviewed

Primary files reviewed:

- [packages/styles/tokens.css](/home/heriberto/Escritorio/Havenova/havenova/packages/styles/tokens.css:1)
- [packages/styles/buttons.css](/home/heriberto/Escritorio/Havenova/havenova/packages/styles/buttons.css:1)
- [packages/styles/cards.css](/home/heriberto/Escritorio/Havenova/havenova/packages/styles/cards.css:1)
- [packages/components/sideNav/SideNav.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/sideNav/SideNav.module.css:1)
- [packages/components/sideNav/SideNav.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/sideNav/SideNav.tsx:1)
- [apps/client/app/global.css](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/global.css:1)
- [apps/dashboard/app/global.css](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/global.css:1)

Supporting files inspected:

- legacy `apps/*/app/styles/*` trees before removal
- button and card consumers across `apps/*` and `packages/components/*`

## Canonical Source Map

### Current canonical shared source

These files are the active shared foundation imported by app entrypoints:

- [packages/styles/tokens.css](/home/heriberto/Escritorio/Havenova/havenova/packages/styles/tokens.css:1)
- [packages/styles/base.css](/home/heriberto/Escritorio/Havenova/havenova/packages/styles/base.css:1)
- [packages/styles/buttons.css](/home/heriberto/Escritorio/Havenova/havenova/packages/styles/buttons.css:1)
- [packages/styles/cards.css](/home/heriberto/Escritorio/Havenova/havenova/packages/styles/cards.css:1)
- [packages/styles/forms.css](/home/heriberto/Escritorio/Havenova/havenova/packages/styles/forms.css:1)
- [packages/styles/badges.css](/home/heriberto/Escritorio/Havenova/havenova/packages/styles/badges.css:1)
- [packages/styles/typography.css](/home/heriberto/Escritorio/Havenova/havenova/packages/styles/typography.css:1)
- [packages/styles/motion.css](/home/heriberto/Escritorio/Havenova/havenova/packages/styles/motion.css:1)
- [packages/styles/helpers.css](/home/heriberto/Escritorio/Havenova/havenova/packages/styles/helpers.css:1)

Evidence:

- [apps/client/app/global.css](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/global.css:1) imports `packages/styles/*`
- [apps/dashboard/app/global.css](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/global.css:1) imports `packages/styles/*`

### Removed duplicated layers

The old `apps/*/app/styles/*` trees were confirmed as non-canonical legacy residue and removed from the active architecture.

Current classification:

- `status: removed legacy duplicate`
- `owner: none`
- `replacement: packages/styles/*`

## Main Findings

### 1. `tokens.css` mixes four different responsibilities

Current `packages/styles/tokens.css` contains all of these at once:

- foundation values
- semantic values
- component variant values
- compatibility aliases

Examples:

- `--brand-*` behaves like foundation
- `--page-*` behaves like semantic or semi-semantic
- `--button-*` and `--card-*` behave like component tokens
- `--color-page-*` and `--gradient-card-*` behave like compatibility aliases

Current classification:

- `--brand-*`: keep as foundation
- `--page-*`: rename into cleaner semantic ownership
- `--button-*` and `--card-*`: keep, but move into component token ownership
- `--color-page-*`, `--gradient-card-*`, `--glass-*`: compatibility bridge candidates

### 2. Several aliases do not add ownership

Examples from the removed compatibility layer:

- `page background alias -> semantic page surface`
- `page heading alias -> semantic primary text`
- `page body alias -> semantic secondary text`
- `gradient card alias -> card variant gradient`

These aliases are useful only as transition bridges.

They should not remain part of the final architecture.

Current classification:

- `status: transitional compatibility only`

### 3. Button state ownership is wrong

In [packages/styles/buttons.css](/home/heriberto/Escritorio/Havenova/havenova/packages/styles/buttons.css:277), the system applies one generic active treatment to:

- `.button--active`
- `.button[aria-pressed='true']`
- `.button[aria-expanded='true']`

This is the core cause of repeated overrides.

Consequences already visible:

- nav headers need escape hatches
- collapse controls need escape hatches
- theme toggles risk inheriting the wrong selected state
- selected route styling leaks into controls that are not route links

Current classification:

- global `aria-*` active mapping: remove from primitive base
- `.button--active`: keep only as explicit opt-in class if still needed

### 4. `buttons.css` currently contains primitive logic and component exceptions together

The file contains:

- real shared variants
- state mechanics
- sidebar-specific variants:
  - `.button--nav-header`
  - `.button--nav-collapse`

That means the shared primitive file is already absorbing local component exceptions.

Current classification:

- `.button--primary`: keep
- `.button--secondary`: keep
- `.button--outline`: keep
- `.button--ghost`: keep
- `.button--outline-danger`: keep
- `.button--close`: keep
- `.button--nav-header`: remove from shared primitives
- `.button--nav-collapse`: remove from shared primitives

Replacement direction:

- introduce a generic control/utility button contract if needed
- keep sidebar-specific behavior inside sidebar styles unless the pattern proves globally reusable

### 5. `cards.css` is structurally simpler, but still tied to token duplication

`cards.css` is not the main architectural problem.

It already behaves closer to a proper primitive layer:

- `.card`
- `.card--neutral`
- `.card--primary`
- `.card--secondary`
- `.card--accent`

Current problems:

- cards depend on token families that still live in the mixed global token file
- alert-card variants are still bundled into the same primitive file

Current classification:

- core card variants: keep
- card token family: reorganize
- alert card helpers: evaluate whether they belong in alert-specific styles

### 6. `SideNav` currently redefines a parallel semantic layer

In [packages/components/sideNav/SideNav.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/sideNav/SideNav.module.css:1), the sidebar defines its own token family:

- `--side-nav-text-*`
- `--side-nav-section-*`
- `--side-nav-action-*`
- `--side-nav-toggle-*`

These values are derived from:

- `--page-text-*`
- `--color-page-*`
- `--button-*`
- raw hardcoded mixes in dark mode

This creates another semantic layer inside a feature component.

Current classification:

- `--side-nav-*`: remove as semantic family
- local layout-only variables: acceptable if needed later

### 7. `SideNav.tsx` currently mixes three different button meanings

Current controls in [packages/components/sideNav/SideNav.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/sideNav/SideNav.tsx:195):

- route links using `button--ghost` plus `button--active`
- expandable section headers using `button--nav-header`
- collapse control using `button--nav-collapse`

Those three controls do not share the same state meaning:

- route selected
- section expanded
- panel collapsed

Current classification:

- route links: should consume the canonical navigation-safe button contract
- section headers: should consume a separate control contract
- collapse control: should consume a separate persistent toggle/control contract

## Token Family Classification

### Foundation candidates to keep

- `--brand-*`
- typography scale
- spacing scale
- radius scale
- motion scale
- shadow scale

### Semantic family adopted

The legacy `--page-*` aliases were removed in favor of a single semantic family:

- `--surface-page`
- `--surface-panel`
- `--border-subtle`
- `--text-primary`
- `--text-secondary`

### Component token families to keep

- `--button-*`
- `--card-*`
- `--input-*`
- `--badge-*`

These should be isolated from the semantic layer instead of living mixed into the same broad token file.

### Compatibility aliases to retire

- `--color-page-*`
- `--gradient-card-*`
- `--glass-*`

These are acceptable only as temporary bridges while consumers are migrated.

### Component-local semantic families to remove

- `--side-nav-*`

## Primitive Inventory

### Buttons

Current shared primitive variants in active use:

- `button--primary`
- `button--secondary`
- `button--accent`
- `button--outline`
- `button--ghost`
- `button--outline-danger`
- `button--close`

Current special-purpose variants that should not remain in shared primitives:

- `button--nav-header`
- `button--nav-collapse`

Current active-state mechanism that should be dismantled:

- global `[aria-pressed='true']`
- global `[aria-expanded='true']`

### Cards

Current shared primitive variants in active use:

- `card--neutral`
- `card--primary`
- `card--secondary`
- `card--accent`

Current secondary concern:

- `card--alert-*` variants should be evaluated for relocation if they are only meaningful inside alert flows

## App-Level Override Inventory

### Shared imports plus app-local overrides

Both app entrypoints currently import shared styles and then add patch rules.

Examples:

- [apps/client/app/global.css](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/global.css:1)
- [apps/dashboard/app/global.css](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/global.css:1)

Observed override patterns:

- redefining `.card` shadow
- forcing transparent borders on card variants
- forcing transparent borders on button variants and active states

Current classification:

- `status: transitional patch layer`
- `owner: app shell`
- `future direction: shrink or remove after primitive rebuild`

## First Removal Candidates

These are the first candidates for controlled deletion or relocation:

1. app-local duplicated style copies under `apps/*/app/styles/*`
2. global active mapping for `.button[aria-pressed='true']`
3. global active mapping for `.button[aria-expanded='true']`
4. sidebar-specific button variants inside shared `buttons.css`
5. `--side-nav-*` semantic family
6. `--color-page-*` aliases once consumer migration begins

## First Keep Candidates

These are safe anchors for the rebuild:

1. `packages/styles` as the single shared source of truth
2. `.button` as primitive base, but with state logic simplified
3. `.card` plus the four main card variants
4. foundation scales for spacing, type, radius, motion, and shadows

## Phase 2 Execution Order

The next implementation pass should follow this order:

1. Split `packages/styles/tokens.css` into clearer ownership layers.
2. Introduce a temporary compatibility bridge for current consumers.
3. Rebuild button state ownership so generic `aria-*` states stop styling every control the same way.
4. Remove sidebar-specific variants from shared button primitives.
5. Rebuild sidebar to consume the new contracts.
6. After shared primitives stabilize, remove duplicated app-local style copies.

## Immediate Decisions Closed In Phase 1

- `packages/styles` is the only shared style source we should treat as canonical.
- `apps/*/app/styles/*` should be treated as removed legacy residue.
- `--side-nav-*` is not a valid final token family.
- generic `[aria-pressed]` and `[aria-expanded]` active styling in `.button` is architectural debt and must be removed.
- sidebar header and collapse controls should not continue as special cases inside shared `buttons.css`.
