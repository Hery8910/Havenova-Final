# About Render Tree

## Purpose

This document simulates the current rendered tree of the `about` page based on the source structure.

It is not a byte-perfect DOM snapshot.

Its purpose is to document:

- shell content rendered around the page
- the actual landmark structure
- where translated copy and `aria-*` surfaces appear
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
                          {about.hero.title}
                        </h1>

                        <div id="{heroDescriptionId?}" class="PageHero.heroDescriptions">
                          <p class="type-body-lg">{about.hero.descriptions[0]}</p>
                          <p class="type-body-lg">{about.hero.descriptions[n]?}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </header>

                <main id="app-main-content" tabindex="-1" class="page-flow" data-page="about">
                  <section class="StorySection.section" aria-labelledby="about-story-title">
                    <div class="StorySection.container">
                      <h2 id="about-story-title" class="type-title-lg">
                        {about.story.title}
                      </h2>

                      <div class="StorySection.paragraphs">
                        <p class="type-body-md">{about.story.paragraphs[0]}</p>
                        <p class="type-body-md">{about.story.paragraphs[1]?}</p>
                        <p class="type-body-md">{about.story.paragraphs[n]?}</p>
                      </div>
                    </div>
                  </section>

                  <section
                    class="ClientsSection.section"
                    aria-labelledby="{titleId}"
                    aria-describedby="{descriptionId} {closingId}"
                    aria-label="{about.clients.a11y.sectionLabel?}"
                  >
                    <div class="ClientsSection.container">
                      <h2 id="{titleId}" class="type-title-lg">{about.clients.title}</h2>
                      <p id="{descriptionId}" class="type-body-md">{about.clients.description}</p>

                      <ul class="ClientsSection.list" aria-label="{about.clients.a11y.listLabel?}">
                        <li class="ClientsSection.item">
                          <article
                            class="ClientsSection.card"
                            aria-labelledby="about-client-title-0"
                            aria-describedby="about-client-description-0"
                          >
                            <img class="ClientsSection.media" alt="{item.imageAlt}" />

                            <div class="ClientsSection.content">
                              <h3 id="about-client-title-0" class="type-title-sm">{item.title}</h3>
                              <p id="about-client-description-0" class="type-body-sm">
                                {item.description}
                              </p>
                            </div>
                          </article>
                        </li>

                        {repeated for each client card}
                      </ul>
                    </div>

                    <p id="{closingId}" class="type-body-md">{about.clients.closing}</p>
                  </section>

                  <section
                    class="ServiceCrossCtaSection.section"
                    aria-labelledby="{crossTitleId}"
                    aria-describedby="{crossDescriptionId}"
                    aria-label="{about.servicesCta.a11y.sectionLabel?}"
                  >
                    <header class="ServiceCrossCtaSection.header">
                      <p class="type-body-sm">{about.servicesCta.eyebrow?}</p>
                      <h2 id="{crossTitleId}" class="type-title-lg">{about.servicesCta.title}</h2>
                      <p id="{crossDescriptionId}" class="type-body-md">{about.servicesCta.description}</p>
                    </header>

                    <nav class="ServiceCrossCtaSection.actions" aria-label="{about.servicesCta.a11y.actionsLabel?}">
                      <ul class="ServiceCrossCtaSection.actionList">
                        <li class="ServiceCrossCtaSection.actionItem">
                          <a class="button button--primary" aria-label="{action.ariaLabel}">
                            {action.label}
                          </a>
                        </li>
                        <li class="ServiceCrossCtaSection.actionItem">
                          <a class="button button--secondary" aria-label="{action.ariaLabel}">
                            {action.label}
                          </a>
                        </li>
                      </ul>
                    </nav>
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

- [AboutPage.client.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/about/AboutPage.client.tsx:1) may receive `undefined` page copy
- [AboutPage.view.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/about/AboutPage.view.tsx:1) resolves visible fallbacks through `about.fallbacks.ts`

Status:

- the previous route-level `return null` behavior is resolved

### 2. The hero currently has no CTA branch

Current interpretation:

- `PageHero` is reused for heading, copy, and image only
- `about` does not currently resolve hero CTA actions
- first page-owned interactive content appears in `ServiceCrossCtaSection`

Implication:

- keyboard validation must not assume page-owned CTA buttons inside the hero

### 3. ClientsSection is semantically rich but not keyboard-interactive

Current interpretation:

- the client cards are informational articles, not links or buttons
- the horizontal list is scrollable visually, but the cards do not currently enter the focus sequence
- the section still carries meaningful translatable `aria-*` copy at container and list level

Implication:

- any future change that turns the cards into interactive items must trigger a keyboard-plan update

### 4. The page mixes simple copy sections with a heavier visual card section

Observed split:

- `StorySection` is a straightforward text block
- `ClientsSection` combines scroll behavior, image surfaces, overlay content, and card framing
- `ServiceCrossCtaSection` is shared UI with its own visual contract

Implication:

- migration and testing effort should prioritize `ClientsSection`
