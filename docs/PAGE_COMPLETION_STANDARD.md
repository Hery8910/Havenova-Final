# Page Completion Standard

## Purpose

This document defines the technical requirements a page must satisfy before it can be treated as complete.

It exists to stop page work from being closed on visual or feature criteria alone while architecture, accessibility, styling, metadata, and ownership remain inconsistent.

This standard is meant to be reused across the whole frontend workspace.

## Closure Rule

A page is not complete when:

- it only looks correct
- it only passes manual navigation
- it only has the required feature behavior

A page is complete only when:

- its architecture is aligned with the target platform rules
- its render strategy is justified
- its contracts, helpers, and styles have clear ownership
- its fallbacks, metadata, accessibility, and legacy cleanup are documented

## Required Page Architecture

The route file must remain an entry point, not a logic bucket.

### Route layer

Canonical location:

- `apps/*/app/.../page.tsx`
- `apps/*/app/.../layout.tsx`

Allowed responsibilities:

- route composition
- route-level server loading
- route metadata
- app-shell integration

Not allowed as ongoing pattern:

- inline feature-specific types
- long transformation helpers
- validation logic
- domain payload mapping
- styling decisions spread across the page body

## Recommended Feature Folder Shape

When a page has enough complexity, the reusable feature surface should follow a structure like this:

```text
packages/components/client/pages/home/
  index.ts
  HomePage.client.tsx
  HomePage.view.tsx
  home.types.ts
  home.helpers.ts
  home.a11y.ts
  home.constants.ts
  home.tokens.ts
  sections/
    hero/
    services/
    benefits/
    appInstall/
  hooks/
    useHomePageState.ts
  adapters/
    homeContent.adapter.ts
```

Interpretation:

- `*.view.tsx` renders
- `*.client.tsx` orchestrates client state only when needed
- `*.types.ts` owns page-local types
- `*.helpers.ts` owns pure helpers
- `*.a11y.ts` owns reusable accessibility strings/ids/rules
- `*.tokens.ts` records real style dependencies and expected system tokens
- `sections/*` owns scoped UI blocks
- `adapters/*` transforms external contracts into internal view data

## Type Ownership Rule

### 1. Route files

Route files should not declare non-trivial page or domain types inline.

### 2. Feature/page types

If a type is only used by one page or one feature family, it should live with that feature.

Examples:

- `home.types.ts`
- `cleaningRequest.types.ts`
- `profileSettings.types.ts`

### 3. Shared domain types

If a type is shared across domains or packages with stable ownership, it should live in `packages/types`.

### 4. Promotion rule

Do not move a type to `packages/types` just because it might become shared later.

Promote it only when:

- it has more than one real consumer
- the ownership is clearly cross-feature or cross-domain

## Function Ownership Rule

Pages and presentational components should not keep non-trivial helpers inline.

Move logic out when it is:

- a data adapter
- a payload mapper
- a reusable formatter
- a validation helper
- a semantic or accessibility helper
- a stateful client orchestration concern

Preferred destinations:

- `*.helpers.ts`
- `adapters/*`
- `hooks/*`
- `packages/utils/*`
- `packages/services/*`

## i18n Fallback Standard

This is now a required project-wide pattern.

### Standard rule

For page and component copy:

1. try to read from i18n
2. if the key is unavailable, use one explicit inline human-readable fallback string

Example:

```tsx
const title = texts?.title ?? 'Hier kommt der Titel';
const description = texts?.description ?? 'Hier kommt die Beschreibung';
const ctaLabel = texts?.cta?.label ?? 'Hier kommt der Button-Text';
```

### Why this is the standard

- it keeps runtime behavior resilient
- it avoids silent empty UI
- it makes the intended meaning visible in the source code
- it reduces the need to jump into the i18n file just to understand a key

### Not recommended for ordinary page UI

- triple fallback chains
- a second language-specific intermediate fallback inside the component
- returning `null` only because a copy object is missing

### Allowed exception

System-level fallback registries can still exist for domain-wide fallback maps, such as alerts, if they are explicitly documented and justified.

But page UI should still end in one visible human-readable fallback string.

## Page i18n Audit Rule

No page can be treated as complete until its i18n surface has been audited.

Every page audit must verify:

- only the keys that the page really renders are present in the page scope
- unused copy keys are removed or explicitly documented as intentional debt
- the three supported languages are reviewed together, not independently
- labels, CTAs, helper copy, `aria-*` copy, and metadata are idiomatically aligned across languages
- inline fallback strings still match the intended German source copy after any i18n changes

This is a closure gate, not optional cleanup.

## Render Strategy Rule

Every page must explicitly justify its SSR/CSR split.

### Default

- server-first route composition

### Client pages/components are allowed when:

- they need browser APIs
- they need immediate interaction state
- they depend on client-only contexts

### Every audit must record:

- why the page is client or server
- whether hydration scope is larger than necessary
- whether wrappers can be reduced

## Accessibility And Semantics Rule

Every page must be reviewed for:

- heading hierarchy
- landmark usage
- semantic sectioning
- unnecessary `div` wrappers
- translated `aria-*` copy
- keyboard access
- visible focus behavior
- image alt strategy
- reduced-motion accessibility behavior when animations or transitions are present

Every `aria-label`, `aria-describedby`, `aria-labelledby`, button label, and navigation label must be treated as translatable UI.

This is also a closure gate: a page is not complete until this review is documented against the real rendered structure.

## Style And Token Rule

Page completion requires a style dependency inventory.

Each page audit must identify:

- root global layers that affect the page
- reset/base rules that affect the page
- global background and decorative layers affecting the page
- global utility classes used
- typography classes used
- button/card/form helpers used
- CSS variables consumed
- responsive breakpoints that materially alter the page behavior
- motion and animation dependencies
- reduced-motion behavior coverage
- legacy class names still in use
- duplicated or overlapping style responsibilities

### Required principle

- global CSS should provide system primitives
- CSS Modules should provide page/component implementation
- reduced-motion preferences must be respected consistently across global and page-level motion

### Not allowed as steady-state

- hardcoded visual values when a system token already exists
- legacy helper classes retained without documentation
- component-specific visual hacks leaking into global classes

## Metadata And Manifest Rule

Each page must explicitly review:

- route metadata declaration
- title
- description
- social image requirements if applicable
- whether the page follows the route metadata pattern used elsewhere

Each audit must also record whether manifest images or screenshots related to that page:

- already exist
- are outdated
- are missing
- need controlled regeneration

## Legacy Rule

Each page audit must classify related residues as:

- active
- transitional
- removable

This includes:

- unused wrappers
- stale exports
- abandoned helper paths
- duplicated components
- style shims kept only to avoid breaking old UI

## Required Audit Outputs Per Page

At minimum, each page should have:

- a current state summary
- a live checklist
- a render tree or render map
- metadata review notes
- style/token inventory
- migration or rectification tasks

## Completion Checklist

The page cannot be closed until every item is either complete or explicitly waived with justification.

### 1. Ownership

- route file is only an entry/composition surface
- feature ownership is clear
- no domain logic is stranded in the route

### 2. Render strategy

- SSR/CSR split documented
- client boundaries justified
- wrappers reduced to necessary ones

### 3. Types

- no non-trivial inline types in route files
- local feature types grouped
- shared types promoted only when justified

### 4. Helpers and logic

- no long inline mappers or adapters
- reusable logic extracted
- services and payload shaping separated from view code

### 5. i18n

- i18n lookup present
- inline visible fallback string present
- translated `aria-*` copy present
- no null-render only because copy object is missing unless explicitly intended

### 6. Components

- no dead wrappers
- no deep imports bypassing canonical surfaces
- public surfaces are used consistently

### 7. Accessibility and semantics

- landmark structure reviewed
- heading hierarchy reviewed
- unnecessary `div` usage reviewed
- images and interactive controls reviewed

### 8. Styles

- page style inventory documented
- token usage reviewed
- legacy classes documented
- duplication candidates recorded

### 9. Metadata and manifest

- metadata strategy reviewed
- missing metadata tasks recorded
- manifest/screenshot/image tasks recorded

### 10. Legacy

- related dead code or compatibility residue identified
- removals or transitional decisions documented

### 11. Documentation

- current state summary exists
- render tree exists
- migration tasks exist
- closure decision is traceable
