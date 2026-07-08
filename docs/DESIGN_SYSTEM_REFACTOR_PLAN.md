# Design System Refactor Plan

## Purpose

This document defines the global refactor plan for the Havenova visual system.

It exists because the current style foundation has accumulated too many token aliases, overlapping responsibilities, and component-specific overrides. That drift is now making small visual adjustments disproportionately expensive and unpredictable.

This plan is intentionally broader than a button fix or a sidebar fix.

The objective is to rebuild a simpler, more explicit base for:

- tokens
- visual primitives
- component states
- light and dark theme behavior

The refactor is allowed to break parts of `apps/client` or other consumers during migration.

That breakage is an accepted transition risk.

## Problem Statement

The current visual system has three structural problems.

### 1. Mixed token layers

Current style files mix:

- foundation values
- semantic values
- component variant values
- compatibility aliases
- local component derivations

That means a visible color or state often depends on multiple translation layers before it reaches the final UI.

### 2. Global state behavior is too broad

Some base classes define generic visual behavior for states like:

- `:hover`
- `:active`
- `[aria-pressed='true']`
- `[aria-expanded='true']`

Those rules are then partially neutralized by variant-specific overrides.

That is the wrong dependency direction.

Base primitives should be predictable. Variants should opt into behavior, not fight inherited behavior they do not want.

### 3. Local component token families keep reappearing

Modules such as sidebar styles introduce local token families like `--side-nav-*`, derived again from already-derived global values.

This multiplies indirection and makes inspection difficult:

- where does the final value come from
- which layer owns the decision
- what can be changed safely

## Current Magnitude

The current system already shows enough scale to justify a reset:

- `packages/styles/tokens.css` contains several hundred custom property references
- button styling alone is spread across token definitions and base component rules
- some component modules redefine visual semantics instead of only consuming them

The cost is now visible in daily work:

- small hover or active changes require multiple patches
- light and dark mode parity is hard to maintain
- visual regressions appear in seemingly unrelated components

## Closed Principles

### 1. No new alias chains without ownership

We should not rename a token only to pass the same value deeper into the system.

A new token is allowed only if it represents a new responsibility.

### 2. No component-local semantic systems unless strictly necessary

Feature modules may define local layout variables.

They should not define parallel color or state systems unless the component is becoming a reusable primitive with explicit ownership.

### 3. No global active-state assumptions

`aria-pressed`, `aria-expanded`, selected-route state, and temporary interaction state do not always mean the same visual thing.

They must not share one generic active treatment by default.

### 4. Variants own their states

If two controls have different meaning, they should not rely on the same visual state contract.

Examples:

- navigational link
- expandable section header
- persistent collapse control
- destructive action

### 5. Migration over patching

From this point forward, the system should be improved by controlled replacement, not by further stacking exceptions on top of legacy behavior.

## Target Style Architecture

The target system should be organized in three explicit layers.

### 1. Foundation tokens

Responsibility:

- raw brand values
- neutrals
- spacing
- radii
- shadows
- typography scale
- motion

Examples:

- `--brand-primary`
- `--neutral-0`
- `--neutral-900`
- `--space-2`
- `--radius-md`
- `--shadow-sm`
- `--motion-base`

Rule:

These tokens should not mention components.

### 2. Semantic tokens

Responsibility:

- map foundation tokens into UI intent

Examples:

- `--surface-page`
- `--surface-panel`
- `--surface-card`
- `--surface-card-strong`
- `--border-subtle`
- `--border-strong`
- `--text-primary`
- `--text-secondary`
- `--text-muted`
- `--focus-ring`

Rule:

These tokens should describe visual purpose, not a specific route or feature.

### 3. Component tokens

Responsibility:

- define reusable component-level contracts when needed

Examples:

- `--button-ghost-bg-hover`
- `--button-ghost-bg-active`
- `--card-secondary-surface`
- `--card-secondary-border`

Rule:

These tokens exist only when a reusable primitive genuinely needs its own contract.

They must not become a hidden compatibility bucket.

## Proposed Primitive Set

The system should start with a short, controlled set of primitives.

### Buttons

Base:

- `.button`

Variants:

- `.button--primary`
- `.button--secondary`
- `.button--outline`
- `.button--ghost`
- `.button--danger`
- `.button--utility`

Notes:

- navigational links should use the same owned navigation-safe variant
- expandable section headers should not inherit generic selected-route visuals
- collapse controls should not rely on generic `aria-pressed` active styling

### Cards

Base:

- `.card`

Variants:

- `.card--neutral`
- `.card--primary`
- `.card--secondary`
- `.card--accent`

Notes:

- the base card should own geometry, border, blur, and elevation rules
- variants should only change surface and contrast decisions

### Inputs

Base:

- `.input`

Variants:

- `.input--error`
- `.input--quiet` only if justified by repeated use

### Typography helpers

Only a minimal semantic set:

- `.text-primary`
- `.text-secondary`
- `.text-muted`

### Surface helpers

Only if reused broadly:

- `.surface-panel`
- `.surface-subtle`

## Component Ownership Rules

### Shared style layer owns

- global tokens
- button primitives
- card primitives
- input primitives
- theme parity rules
- focus and motion guardrails

### Feature modules own

- layout structure
- spacing specific to the feature
- local composition
- page-specific exceptions that do not belong globally

### Feature modules do not own

- a parallel state system for base buttons
- a parallel token family for shared surfaces
- shadow or active rules that should belong to a primitive

## Sidebar Implications

The sidebar is one of the first migration targets because it concentrates several anti-patterns:

- local semantic tokens
- mixed link and button responsibilities
- nested state meaning
- dark/light mode sensitivity

Target rule for sidebar migration:

- route links use the same canonical link-like button contract
- section headers use a separate utility/control contract
- collapse control uses its own explicit control contract
- nested routes do not create a second visual language unless there is a strong information architecture reason

## Migration Strategy

This should be executed in phases.

### Phase 1. Inventory and classification

Tasks:

- classify current tokens into foundation, semantic, component, compatibility, or removable
- identify alias chains that do not add responsibility
- identify base classes with overly broad state behavior
- identify local modules that redefine shared visual semantics

Deliverable:

- a keep / rename / remove inventory

### Phase 2. Rebuild the shared foundation

Tasks:

- split the current token system into cleaner layers
- define the minimal semantic contract for surfaces, text, borders, focus, and motion
- keep a temporary compatibility bridge only where migration safety requires it

Deliverable:

- a stable new token baseline in `packages/styles`

### Phase 3. Rebuild primitives

Tasks:

- refactor buttons
- refactor cards
- refactor inputs
- remove generic active-state behavior from primitives that should not own it

Deliverable:

- predictable base components with owned states

### Phase 4. Migrate high-friction consumers

Initial targets:

- sidebar
- theme toggler
- auth surfaces
- dashboard/profile shells

Deliverable:

- first real consumers using the new contracts without local semantic drift

### Phase 5. Expand and delete legacy

Tasks:

- migrate remaining app surfaces gradually
- remove legacy aliases once no consumer depends on them
- reduce module-local derivations where they no longer add value

Deliverable:

- smaller and more inspectable shared style system

## Acceptance Criteria

The refactor should be considered successful when these conditions are true:

- adjusting a button or card state requires changing one owned contract, not several overrides
- light and dark mode variants are controlled from the same semantic layer
- local CSS Modules consume shared semantics instead of translating them again
- route links, headers, and control buttons no longer fight over the same active styling
- developers can identify the owner of a visual value quickly

## Known Risks

This work carries deliberate risk.

Expected risks:

- visual regressions during migration
- temporary breakage in `apps/client`
- temporary mismatch between legacy consumers and new primitives
- partial dark mode regressions until all major consumers are migrated

These are accepted because the current system is already expensive to maintain and too fragile for continued incremental patching.

## Execution Rule

During this refactor:

- do not create new style aliases unless ownership is explicit
- do not patch component-local symptoms before checking whether the primitive contract is wrong
- do not preserve accidental legacy behavior only because it exists today
- prefer a smaller, sharper system even if the first pass is visually rougher

## First Recommended Slice

The first implementation slice should be limited to:

1. rebuilding the token layers in `packages/styles`
2. rebuilding `button` contracts
3. rebuilding `card` contracts
4. migrating the sidebar to consume those new primitives

That slice is large enough to validate the direction and small enough to keep the migration controlled.
