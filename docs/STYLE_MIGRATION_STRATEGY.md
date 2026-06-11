# Style Migration Strategy

## Purpose

This document defines the controlled migration strategy for frontend styles.

It exists to prevent the current global style system from being replaced by another uncontrolled global layer with the same problems:

- duplicated tokens
- duplicated helpers
- inconsistent naming
- legacy compatibility without ownership

The goal is to migrate page by page, using audited consumption as the only valid source of truth.

## Core Decision

We will not create a second generic `global.css`.

We will create a **controlled migration layer** that is only populated by styles justified through page audits.

Important clarification:

- the migration layer is **parallel**, but not **autonomous**
- it cannot become another anonymous utility bucket
- it only grows when a page audit proves a shared need
- until then, page CSS stays in CSS Modules and the current global system remains the baseline

Current global system:

- [apps/client/app/global.css](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/global.css:1)
- [apps/client/app/styles](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/styles)

Migration layer:

- `apps/client/app/migration-styles/*`

## Migration Principles

### 1. Audit-first

No token, helper, or utility enters the migration layer unless:

- a page audit identified the dependency
- the old behavior is understood
- the new ownership is intentional

### 2. Page-scoped adoption

The migration layer should be adopted first by audited pages only.

It is not a free-for-all global replacement.

It should also avoid introducing new “magic classes” that duplicate existing global utilities without a real ownership change.

### 3. Old visual behavior can be used as reference

Existing styles may be used as a visual baseline to avoid regressions.

But they must not be copied blindly.

Every migrated style should be classified as one of these:

- final system rule
- temporary compatibility rule
- duplicate to remove

### 4. System before patchwork

The migration layer should prefer:

- semantic tokens
- canonical button/card/typography utilities
- predictable naming

It should not collect one-off fixes that belong in CSS Modules.

## Migration Layer Structure

Suggested structure:

```text
apps/client/app/migration-styles/
  index.css
  tokens.v2.css
  base.v2.css
  motion.v2.css
  typography.v2.css
  buttons.v2.css
  cards.v2.css
  forms.v2.css
  page-home.css
```

## Meaning Of Each File

### `index.css`

Single entrypoint for the migration layer.

Used only where the migration layer is intentionally enabled.

### `tokens.v2.css`

Holds owned tokens that are confirmed by audited usage.

Examples:

- page background and text tokens
- spacing tokens with real page/layout responsibility
- card or feedback tokens when a page genuinely needs them
- controlled replacements for ambiguous legacy tokens

Current status:

- this file now stores owned `v2` values for the first Home migration pass
- tokens should be named by visual responsibility, not by alias chains
- it should continue growing only through audited page needs

### `typography.v2.css`

Only typography primitives that are repeatedly needed by audited pages.

### `base.v2.css`

Owns the reset and page-surface baseline for migrated routes.

It exists so migrated pages do not depend silently on undocumented base behavior from the old system.

### `motion.v2.css`

Owns global motion guardrails for migrated routes.

Its first responsibility is reduced-motion safety, before any new animation primitive is introduced.

### `buttons.v2.css`

Canonical button variants for migrated pages.

This is one of the first targets because button drift is already visible.

Current rule:

- do not define alias classes like `.v2-button-outline` unless the migration layer is truly taking ownership of the full button contract
- simple aliasing through invalid composition or blind duplication is not allowed

### `cards.v2.css`

Canonical card/surface variants for migrated pages.

Current rule:

- do not create wrapper aliases like `.v2-card-neutral` unless the new layer owns the surface semantics and visual contract explicitly

### `forms.v2.css`

Form-level primitives when audited pages actually need them.

### `page-home.css`

Page-scoped migration helpers only for `Home`, when a style must be shared across several `Home` feature sections but does not yet belong in the global final system.

This file is transitional by design.

This is the preferred place for first-pass extraction when:

- a rule is shared inside one audited page
- the rule is not yet justified as a cross-page primitive
- duplicating old global utilities would be misleading

## Classification Rule For New Styles

Every rule added to the migration layer must be tagged conceptually as:

### Final

The rule is clearly generic and should survive beyond the page.

### Transitional

The rule is only needed while migrating one or more pages.

### Legacy bridge

The rule exists only to avoid visual breakage while older consumers are still alive.

## Relationship With Existing Global Styles

The current system remains the production baseline until a migrated replacement is validated.

That means:

- we do not delete large pieces of the current style system blindly
- we only replace rules once a migrated page proves the new layer works
- the migration layer may import next to the current global system during transition, but only for explicitly audited routes

## Page-Level Style Audit Requirements

Before a page contributes to the migration layer, its audit must identify:

- global utility classes used
- typography helpers used
- button variants used
- card/surface helpers used
- token families used
- duplicated visual responsibilities
- legacy helpers still present
- whether the style belongs in:
  - CSS Module only
  - page migration CSS
  - migration system CSS

## Home As First Pilot

`Home` is the first page pilot for this strategy.

Why:

- it is already under active structural cleanup
- it exposes real issues:
  - legacy button usage
  - token family drift
  - card utility overreach
  - mixed ownership between page feature and global helpers

## Current Home Findings Already Confirmed

- `button_invert` was being used by Home while belonging to an older dashboard style system
- `ServicesSection` and `BenefitsSection` mixed `--text-*` with `--page-text-*`
- service icon styling depended on card semantics attached directly to an image element

These are exactly the kinds of cases the migration layer should absorb in a controlled way.

## Current Technical Constraint

The migration layer must remain valid plain CSS.

That means:

- no CSS Modules-only features such as `composes` inside global migration files
- no implicit dependency on build-time module semantics
- no helper class that only works when combined with undocumented legacy classes

If a rule cannot stand on its own, it should stay:

- in a page CSS Module, or
- as a documented dependency on the existing global layer until the replacement is real

## Initial Adoption Plan

### Phase 1. Documentation and structure

- create migration style docs
- create migration layer file structure
- create Home style inventory
- keep migration files technically valid even if mostly empty at first

### Phase 2. Home style pilot

- identify Home style rules that are:
  - already clean enough to remain
  - page-local only
  - candidates for v2 system primitives
- move only proven shared page rules into `page-home.css`
- keep typography/button/card primitives in the existing system unless ownership actually changes

### Phase 3. Controlled activation

- import the migration layer only when the owning page is ready for it
- compare for duplication and conflicts with the current global system

### Phase 4. Consolidation

- after several pages are migrated, decide which migration rules become the real new global system

## Non-Goals

This migration layer is not for:

- rebranding the whole app at once
- adding cosmetic experiments unrelated to audits
- storing random “temporary fixes” with no owner

## Success Criteria

The migration is working if:

- migrated pages depend less on legacy helpers
- token usage becomes more uniform
- duplicated global styles become visible and classifiable
- final system rules emerge from actual page usage instead of abstraction-first guesses
