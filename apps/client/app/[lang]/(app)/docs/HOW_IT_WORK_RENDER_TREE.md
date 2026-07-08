# How It Work Render Tree

## Purpose

This document simulates the current rendered tree of the `how-it-work` page based on the source structure.

It is not a byte-perfect DOM snapshot.

Its purpose is to document:

- shell content rendered around the page
- the actual landmark structure
- where translated copy and CTA surfaces appear
- which nodes influence semantic and keyboard review

## Shell Context

The route is wrapped by:

- [apps/client/app/[lang]/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/layout.tsx:1)
- [apps/client/app/[lang]/(app)/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/layout.tsx:1)
- [apps/client/app/[lang]/(app)/AppLayoutShell.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/AppLayoutShell.tsx:1)

## Current Simulated Tree

```html
<html lang="{params.lang}" data-theme="{resolvedTheme}">
  <body>
    <I18nProvider>
      <AlertProvider>
        <AlertViewport />
        <ClientProvider>
          <AuthProvider>
            <ProfileProvider>
              <CookiesProvider>
                <a class="AppLayoutShell.skipLink" href="#app-main-content">
                  {navbar.accessibility.skipToContent}
                </a>

                <NavbarContainer />

                <header class="PageHero.hero" aria-labelledby="{heroTitleId}" aria-describedby="{heroDescriptionId?}">
                  <div class="PageHero.container">
                    <div class="PageHero.heroMedia">
                      <div class="PageHero.heroMediaFrame">
                        <img class="PageHero.heroImage" />
                      </div>
                    </div>

                    <div class="PageHero.heroContent">
                      <div class="PageHero.heroCopy">
                        <h1 id="{heroTitleId}" class="type-display-lg">
                          {howItWorks.hero.title}
                        </h1>

                        <div id="{heroDescriptionId?}" class="PageHero.heroDescriptions">
                          <p class="type-body-lg">{howItWorks.hero.descriptions[0]}</p>
                          <p class="type-body-lg">{howItWorks.hero.descriptions[n]?}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </header>

                <main
                  id="app-main-content"
                  tabindex="-1"
                  class="page-flow"
                  data-page="how-it-work"
                >
                  <section class="WorkflowSection.workflow" aria-labelledby="how-it-works-workflow-title">
                    <div class="WorkflowSection.container">
                      <header class="WorkflowSection.header">
                        <h2 id="how-it-works-workflow-title" class="type-title-lg">
                          {howItWorks.workflow.title}
                        </h2>
                        <p class="type-body-lg">{howItWorks.workflow.subtitle}</p>
                      </header>

                      <ol class="WorkflowSection.stepsGrid">
                        <li class="WorkflowSection.stepItem">
                          <article class="WorkflowSection.stepCard card card--neutral">
                            <aside class="WorkflowSection.stepAside">
                              <span class="WorkflowSection.badge type-label card card--accent">
                                {stepNumber}
                              </span>
                              <h3 class="type-title-sm">{step.title}</h3>
                            </aside>
                            <p class="type-body-sm">{step.description}</p>
                          </article>
                        </li>

                        {repeated for each workflow step}
                      </ol>

                      <aside class="WorkflowSection.note card card--accent">
                        <h3 class="type-title-sm">{howItWorks.workflow.note.title}</h3>
                        <p class="type-body-sm">{howItWorks.workflow.note.description}</p>
                      </aside>
                    </div>
                  </section>

                  <section class="BenefitsSplitSection.benefits" aria-labelledby="how-it-works-benefits-title">
                    <div class="BenefitsSplitSection.container">
                      <header class="BenefitsSplitSection.header">
                        <h2 id="how-it-works-benefits-title" class="type-title-lg">
                          {howItWorks.benefits.title}
                        </h2>
                        <p class="type-body-lg">{howItWorks.benefits.description}</p>

                        <nav class="BenefitsSplitSection.heroCtas" aria-label="{howItWorks.benefits.ctaAriaLabel}">
                          <a class="button button--primary">{ctaCleaning.label}</a>
                          <a class="button button--secondary">{ctaHomeServices.label}</a>
                        </nav>
                      </header>

                      <figure class="BenefitsSplitSection.imageWrapper" aria-hidden="true">
                        <img class="BenefitsSplitSection.image" alt="" />
                      </figure>
                    </div>
                  </section>
                </main>

                <Footer />
                <CookieBannerContainer />
              </CookiesProvider>
            </ProfileProvider>
          </AuthProvider>
        </ClientProvider>
      </AlertProvider>
    </I18nProvider>
  </body>
</html>
```

## Render Notes

### 1. The page no longer disappears when i18n content is missing

Current source behavior:

- [HowItWorksPage.client.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/howItWorks/HowItWorksPage.client.tsx:1) may receive `undefined` page copy
- [HowItWorksPage.view.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/howItWorks/HowItWorksPage.view.tsx:1) resolves visible fallbacks through `howItWorks.fallbacks.ts`

Status:

- the previous route-level `return null` behavior is resolved

### 2. The page has no hero CTA branch

Current interpretation:

- `PageHero` is reused for image, heading, and description
- `how-it-work` currently resolves no hero CTA actions in its fallback path
- the first page-owned interactive content after the shell is inside `BenefitsSplitSection`

Implication:

- keyboard validation must not assume hero buttons on this route

### 3. Workflow cards are semantic content, not interactive controls

Current interpretation:

- the workflow step cards and note card are informational only
- they should not appear in the keyboard sequence
- their hover motion is visual, not interactive

Implication:

- if future iterations turn them into links or expandable surfaces, the keyboard plan must be updated

### 4. The page still mixes migrated and legacy visual systems

Observed split:

- hero relies on `v2` page/button/typography contracts through `PageHero`
- workflow and benefits sections still consume legacy typography/button/card/token usage

Implication:

- semantic review is acceptable now
- style ownership is still transitional and requires dedicated inventory
