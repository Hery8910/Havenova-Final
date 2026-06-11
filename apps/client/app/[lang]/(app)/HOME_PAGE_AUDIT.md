# Home Page Audit

## Purpose

This document records the current state of the client home page and will be updated until the page satisfies the page completion standard.

Scope:

- route entry
- page composition
- home-specific feature components
- style dependencies
- metadata status
- legacy and ownership issues directly affecting Home

## Current Entry Points

Primary route:

- [apps/client/app/[lang]/(app)/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/page.tsx:1)

Route shell:

- [apps/client/app/[lang]/(app)/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/layout.tsx:1)
- [apps/client/app/[lang]/(app)/AppLayoutShell.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/AppLayoutShell.tsx:1)

Global app shell:

- [apps/client/app/[lang]/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/layout.tsx:1)

## Current Feature Surfaces

Home feature barrel:

- [packages/components/client/pages/home/index.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home/index.ts:1)

Consumed sections:

- [packages/components/client/pages/hero/PageHero.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/hero/PageHero.tsx:1)
- [packages/components/client/pages/home/AppInstallSection/AppInstallSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home/AppInstallSection/AppInstallSection.tsx:1)
- [packages/components/client/pages/home/ServicesSection/ServicesSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home/ServicesSection/ServicesSection.tsx:1)
- [packages/components/client/pages/home/BenefitsSection/BenefitsSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home/BenefitsSection/BenefitsSection.tsx:1)
- [packages/components/client/pages/home/home.fallbacks.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home/home.fallbacks.ts:1)

Interpretation:

- Home already has a feature folder
- the route no longer consumes `pages/hero` directly
- Home composition is now feature-owned

## Current Render Strategy

Current state:

- Home route is now a server entry
- route entry now delegates client orchestration to the Home feature surface
- route shell is also client because `AppLayoutShell` depends on `usePathname()`

Impact:

- Home now follows a server-first route entry pattern
- the route no longer owns page-level copy contracts
- the shell still keeps the app branch client-driven above the page itself

Current decision:

- the route-level correction is complete for this pass
- `AppLayoutShell` remains client because it owns pathname-dependent shell behavior
- Home feature composition no longer needs an extra hero adapter layer

## Current Ownership Problems

### 1. Route-level type declaration

Current state:

- [page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/page.tsx:1) no longer declares `HomePageTexts` inline
- Home-specific contracts now live in [home.types.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home/home.types.ts:1)

Status:

- resolved in this pass

Target:

- keep route-level contracts out of the route file

### 2. Home composition is split across unrelated ownership surfaces

Current state:

- the route imports only [HomePageClient](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home/HomePage.client.tsx:1)
- Home feature composition now lives in [HomePage.view.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home/HomePage.view.tsx:1)

Status:

- partially resolved in this pass

Target:

- continue consolidating Home around one canonical composition surface

### 3. Section components still declare inline prop shapes

Current state:

- [ServicesSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home/ServicesSection/ServicesSection.tsx:1) now consumes Home-local types
- [BenefitsSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home/BenefitsSection/BenefitsSection.tsx:1) now consumes Home-local types
- the page-level contract is now centralized in [home.types.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home/home.types.ts:1)

Why this is a problem:

- type ownership is improved
- fallback list content is still declared inline inside sections, so the feature is cleaner but not finished

Target:

- continue reducing inline fallback content where it improves readability and ownership

## Current i18n And Fallback State

Current state:

- Home resolves `const home = texts?.pages?.client?.home` inside [HomePage.client.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home/HomePage.client.tsx:1)
- the view now renders visible human-readable fallback copy when Home i18n content is missing
- the fallback copy is now expressed through visible `??` usage in render construction instead of grouped fallback objects at page level
- the fallback values now use the real German copy from `packages/i18n/de/pages.json` rather than placeholder text

Problem:

- the route-level null render problem is resolved
- the fallback strategy is now visible inside the Home feature surface
- the page now follows the intended direction better because the fallback copy is readable while scanning the JSX itself
- array-based sections still need explicit fallback structures, so consistency now depends on component-level discipline
- page completion now also requires an i18n audit of the real rendered key surface, not only fallback coverage

Current audit update:

- `benefits.kicker` existed in the three language files but was not rendered anywhere in Home
- that unused key has now been removed from `de`, `en`, and `es` to keep the page copy contract aligned with the real UI
- the Home page copy consumed by the route has now been compared across `de`, `en`, and `es`
- the German hero now uses a consistent informal tone (`Finde` / `Wähle`) instead of mixing formal and informal register
- English hero copy now follows the page sentence-case convention more closely
- Spanish hero CTAs and service titles were aligned to the actual user action and page taxonomy
- `aria-*` navigation copy for the hero was normalized to the same semantic meaning across the three languages
- metadata copy is now included in the Home-page i18n pass

Required target pattern:

```tsx
<h2>{texts?.title ?? 'Hier kommt der Titel'}</h2>
```

Decision:

- Home must be used as the first page to apply the new standardized page-copy fallback rule
- when the fallback belongs to a list structure, the section can resolve a real German fallback array locally as long as the copy remains visible and feature-owned
- Home now implements that convention through [home.fallbacks.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home/home.fallbacks.ts:1):
  scalar copy stays inline with `??`
  structured copy and array/list fallbacks live in one feature-owned fallback module

## Current Accessibility And Semantics Notes

### Positive signals

- `PageHero` uses `aria-labelledby` and conditional `aria-describedby`
- `ServicesSection` and `BenefitsSection` use section headings and list semantics
- decorative service icons use empty `alt`
- `PageHero` now keeps a visible fallback for the hero actions navigation label

### Findings to review

- `ServicesSection` previously hid the `h3` inside an `aria-hidden` wrapper; this has now been corrected by keeping the header semantic and hiding only the decorative icon surface
- `AppNotInstalledCard` and `AppInstalledCard` both render `h2#home-app-title`; the branch is exclusive, so this is not currently duplicated in the DOM, but the id ownership should be documented
- Home shell semantics should be reviewed together with `NavbarContainer` and `Footer`

## Current Style And Token Inventory

Supporting documents:

- [HOME_STYLE_INVENTORY.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/HOME_STYLE_INVENTORY.md:1)
- [HOME_STYLE_MIGRATION_PLAN.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/HOME_STYLE_MIGRATION_PLAN.md:1)
- [TESTING.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/TESTING.md:1)

## Global CSS layers affecting Home

Imported in app root:

- [apps/client/app/global.css](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/global.css:1)

Current global layers:

- `tokens.css`
- `base.css`
- `typography.css`
- `badges.css`
- `buttons.css`
- `forms.css`
- `cards.css`
- `motion.css`
- `helpers.css`

## Global utility classes currently consumed by Home

Observed in current Home surfaces:

- `type-display-lg`
- `type-display-md`
- `type-title-xl`
- `type-title-md`
- `type-title-sm`
- `type-body-lg`
- `type-body-sm`
- `v2-button`
- `v2-button--primary`
- `v2-button--secondary`
- `v2-button--accent`
- `v2-button--outline`
- `v2-card`
- `v2-card--primary`
- `v2-card--secondary`
- `v2-card--neutral`

Legacy or suspect classes to review:

- `button_invert`

Reason:

- this naming does not match the normalized `button--*` system and should be treated as legacy until proven otherwise

Current update:

- `button_invert` has now been removed from Home and replaced with canonical button variants
- `glass-panel--base` is no longer part of the active Home surface

## CSS variables currently consumed by Home

Observed directly in Home CSS modules:

- `--v2-page-text-primary`
- `--v2-page-text-secondary`
- `--space-2`
- `--space-4`
- `--v2-card-shadow`
- `--v2-radius-md`
- `--v2-radius-lg`
- `--v2-card-primary-bg1`
- `--v2-card-secondary-bg2`
- `--v2-card-neutral-bg1`
- `--v2-card-neutral-bg2`
- `--v2-card-neutral-bg3`
- `--v2-card-neutral-border`
- `--v2-feedback-info-bg-image`
- `--v2-list-marker-accent`
- `--v2-hero-mobile-min-block-offset`

Review note:

- Home previously mixed `--text-*` and `--page-text-*`
- `ServicesSection` and `BenefitsSection` have now been aligned to `--page-text-*`
- this reduces token ambiguity, but the broader page token policy still needs to be formalized

## Current Style Findings

### 1. Home still has transitional visual primitives to validate across a second page

Examples:

- decorative neutral card styling around the service icon surface

Interpretation:

- one explicit decorative card surface still exists in ServicesSection, but it is now attached to a real wrapper element instead of the image node itself

### 2. Token families are clearer now, but still need cross-page validation

Observed:

- Home now uses a substantially more explicit `v2` page token set, but that set is still only validated against Home

Interpretation:

- the page should document what text/color token family it really depends on before global cleanup continues

### 3. The page needs a real style dependency summary before global pruning

Decision:

- Home should be used as one of the first pages to produce an exact token/class inventory that can later support safe cleanup of `global.css`

### 4. Responsive rhythm and visual balance must be treated as completion criteria

Current update:

- Home now uses a shared page max width and content max width in the migrated layout tokens
- main sections now align to a common `5dvw` inline padding rule
- section vertical spacing is more consistent across `Services`, `Benefits`, and `AppInstall`
- service card icon sizing was rebalanced against heading size
- benefits icons were increased for small screens to avoid becoming visually weak

Interpretation:

- responsive behavior for Home is no longer only about breakpoint collapse
- spacing rhythm, edge padding, max widths, and icon/text proportion are now explicit responsive requirements

### 5. Home now has a controlled parallel migration layer with active button/card adoption

Current state:

- the migration strategy is documented in [docs/STYLE_MIGRATION_STRATEGY.md](/home/heriberto/Escritorio/Havenova/havenova/docs/STYLE_MIGRATION_STRATEGY.md:1)
- the file structure exists under [apps/client/app/migration-styles](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/migration-styles/index.css:1)
- the Home-specific style inventory lives in [HOME_STYLE_INVENTORY.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/HOME_STYLE_INVENTORY.md:1)

Interpretation:

- this gives us a real place to move audited style ownership later
- the layer now owns first-pass `v2` tokens plus base/motion files
- Home now imports that layer at route level for page surface and typography ownership
- the migrated token subset now includes light and dark theme values
- button semantics are now owned by `v2` for the Home surface
- card semantics are now owned by `v2` for the Home surface
- this avoids creating a second undocumented global layer

Current consolidation view:

- `tokens.v2.css`, `base.v2.css`, `motion.v2.css`, `typography.v2.css`, `buttons.v2.css`, and `cards.v2.css` are now candidate shared layers
- `page-home.css` and the decorative page treatments remain Home-owned
- the next audited page should reuse the shared candidates before creating any new primitive

## Current Metadata Status

Current state:

- Home route now exports `generateMetadata(...)`
- it already uses [getPageMetadata](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/metadata/metadata.ts:1) like the rest of the app
- `pageMetadata.home` now declares `de`, `en`, and `es` explicitly in [packages/i18n/metadata.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/metadata.ts:1)

Evidence:

- [about/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/about/layout.tsx:1)
- [home route](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/page.tsx:1)
- [home metadata source](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/metadata.ts:1)

Interpretation:

- Home is no longer off-pattern relative to the established metadata approach
- the previous Spanish fallback-to-German metadata issue for Home is resolved
- metadata copy is now closer to the real Home value proposition and no longer uses the older "handyman" framing for the English surface
- the Spanish metadata entry currently reuses the existing English Home screenshot until a dedicated Spanish asset is produced

Required task:

- verify the real existence and final quality of the screenshot assets referenced by metadata after visual stabilization

## Manifest And Image Review Status

Current manifest:

- [apps/client/public/site.webmanifest](/home/heriberto/Escritorio/Havenova/havenova/apps/client/public/site.webmanifest:1)

Current relevant entries:

- `screenshots/home-desktop-de.png`
- `screenshots/home-mobile.png`
- standard app icons

Required tasks:

- review whether Home needs language-aligned screenshot coverage beyond the current entries
- verify whether manifest screenshots reflect the intended final UI
- create or regenerate manifest-linked images under controlled tasks when the page is visually stabilized

## Shell Semantics Review

Reviewed shell surfaces:

- [AppLayoutShell.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/AppLayoutShell.tsx:1)
- [NavbarContainer.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/NavbarContainer.tsx:1)
- [Footer.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/footer/Footer.tsx:1)
- [CompanyContact.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/companyContact/CompanyContact.tsx:1)
- [CookieBannerContainer.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/cookieBanner/CookieBannerContainer.tsx:1)

Positive findings:

- the shell provides a primary `nav` landmark through `NavbarContainer`
- `Home` still owns the page `main`, so there is no duplicate `main` introduced by the shell
- the shell footer uses a real `footer` landmark and contains a nested navigation area plus structured contact information
- the contact block uses `address` semantics and preserves heading ownership through `CompanyContact`
- the cookie banner is outside the page flow and behaves as a dialog surface rather than pretending to be page content
- the shell now exposes a keyboard-accessible skip link that targets the shared `main` anchor used by the current `(app)` routes

Current semantic update:

- Home now renders the page hero before `main`, so the page header is no longer nested inside the main content landmark
- the shared skip-link target is `#app-main-content`, applied to the current routes inside `(app)`

Decision:

- landmark composition for Home is acceptable for this pass
- the project now has a baseline skip-link pattern in the app shell
- remaining keyboard validation is now a manual verification task, not a missing implementation task
- the execution guide for that validation now lives in [TESTING.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/TESTING.md:1)
- the first manual evidence run is documented under [test-evidence/2026-06-07-run-01](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/test-evidence/2026-06-07-run-01/README.md)

## Keyboard Validation Findings

Evidence source:

- [K-01-home-keyboard-navigation.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/test-evidence/2026-06-07-run-01/cases/K-01-home-keyboard-navigation.md:1)

Validated facts:

- the `skip link` appears and works
- the jump to `main` intentionally skips the hero and lands on the main-content sequence
- the overall focus order across Home is coherent in both directions
- the main remaining defects are concentrated in shell panels and focus visibility

Open keyboard defects:

- theme toggle focus is too weak
- button variants outside `button--ghost` do not show focus clearly enough
- language selector opens correctly but its internal items do not join the page focus sequence
- user/account panel shows the same focus-sequence problem
- closing the language selector with `Esc` returns focus to an incorrect starting point

Footer-specific note:

- the address in the footer is currently non-focusable text
- this is semantically acceptable if kept as static contact content, but it must remain an explicit decision
- footer keyboard behavior remains tracked as a separate pending review in [packages/components/client/footer/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/footer/README.md:1)

## Keyboard Rectification Status

Implemented in code:

1. `LanguageSwitcher` now traps focus inside the open panel, sends initial focus to the current language option, and restores focus to the trigger on `Esc`.
2. Desktop, tablet, and mobile navbar panels now use the same shell focus-trap rule:
   open panel => focus first interactive control
   `Tab` / `Shift + Tab` stay inside the active panel
   `Esc` closes the panel and restores focus to the trigger that opened it
3. Interactive shell panels now expose `tabIndex={-1}` on the container so the panel itself can safely receive fallback focus if a future panel renders with no interactive items.
4. Global button `:focus-visible` now uses an explicit outline in addition to the existing border/shadow treatment, improving visibility outside `button--ghost`.
5. `ThemeToggler` now has its own explicit `:focus-visible` treatment so dark-mode active styling no longer suppresses the focus state visually.

Pending before closure:

1. Re-run the full manual keyboard validation after the shell/focus patch.
2. Confirm visually that the theme toggle focus state is now clear in both light and dark themes.
3. Confirm visually that language and account panels no longer leak focus to browser UI or to the hero CTA.
4. Confirm and document the footer address as intentionally non-focusable static content.

## End-Of-Day Status

Latest manual update:

- a final keyboard pass performed today indicates that the previously reported navbar and button focus defects now appear resolved in practice
- no new keyboard issues were observed in the shell during that final pass
- the footer still remains outside the Home closure scope and keeps its own pending keyboard review

Current closure decision:

- Home is now treated as complete for the current page-hardening phase
- the pending footer review is explicitly out of Home scope and remains tracked in the footer documentation
- keyboard navigation should now be treated as functionally rectified, with a final explicit verification still reserved for phase 2 evidence closure

## Current Legacy And Cleanup Notes

### Confirmed residue

- decorative neutral card surface around service icons

### Classification

- decorative neutral icon surface: acceptable for now, but should be reviewed as part of final visual-system cleanup

## Proposed Target Architecture For Home

Suggested direction:

```text
apps/client/app/[lang]/(app)/
  page.tsx
  HOME_PAGE_AUDIT.md
  HOME_PAGE_RENDER_TREE.md

packages/components/client/pages/home/
  index.ts
  HomePage.client.tsx
  HomePage.view.tsx
  home.types.ts
  home.helpers.ts
  home.a11y.ts
  home.tokens.ts
  sections/
    hero/
    appInstall/
    services/
    benefits/
```

Interpretation:

- route stays minimal
- Home feature owns Home contracts and composition
- style and a11y requirements become discoverable and reviewable

## Live Checklist

### Architecture

- [x] Route file reduced to entry/composition only
- [x] Home contracts extracted from `page.tsx`
- [x] Canonical Home composition surface defined at route level

### Render strategy

- [x] Home SSR/CSR strategy explicitly reviewed at route-entry level
- [x] Client shell usage justified or reduced

### i18n and fallbacks

- [x] Home adopts visible human-readable fallback content
- [x] No `return null` only because Home copy object is missing
- [x] Home moved away from grouped page-level fallback objects toward visible `??` usage in render construction
- [x] Unused Home page i18n keys identified and removed when not rendered
- [x] Idiomatic alignment reviewed across `de`, `en`, and `es` for the Home page copy surface
- [x] Metadata and `aria-*` copy included in the Home i18n review for the Home route surface

### Accessibility and semantics

- [x] Landmark and heading structure reviewed against the full rendered shell
- [x] `aria-*` copy reviewed for translation fallback compliance inside the Home feature surface
- [x] Wrapper and `div` usage reviewed inside Home sections
- [x] Shell focus-management rule implemented for interactive navbar panels
- [x] Final keyboard sign-off intentionally deferred to phase 2 evidence closure
- [x] Keyboard/focus behavior treated as operationally resolved for the current page pass

### Styles

- [x] Home style dependency inventory completed
- [x] Legacy classes reviewed
- [x] Token family usage reviewed
- [x] Global style dependencies documented

### Metadata and manifest

- [x] Home metadata strategy aligned with the rest of the app
- [x] Home metadata locale coverage reviewed
- [x] Manifest screenshot and image tasks explicitly deferred to phase 2

### Legacy

- [x] `HeroSection` ownership decided
- [x] Transitional inline contracts removed
- [x] Legacy style residues classified

## Current Summary

Home is a good candidate for the first page-level hardening pass because:

- it is relatively small
- it already has a partial feature folder
- it exposes the current problems clearly:
  - shell-level keyboard access required shared shell fixes and now has a reusable validation guide
  - transitional style primitives still need validation against a second page
  - manifest/image closure was intentionally deferred to phase 2 together with real screenshots and final keyboard evidence

Closure note:

- Home should now be treated as complete for the current page-completion pass
- phase 2 still owns:
  - real screenshot generation and manifest image verification
  - final explicit keyboard-validation evidence refresh after broader page work continues

This page remains the pilot for the page-completion workflow.
