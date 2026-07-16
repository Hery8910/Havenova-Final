# Cleaning Service Render Tree

## Purpose

This document simulates the current rendered tree of the `cleaning-service` page based on the current source structure.

It is not a byte-perfect DOM snapshot.

Its purpose is to document:

- shell content rendered around the page
- the current page landmark structure
- where interactive surfaces appear
- which parts belong to page validation and which still belong to deferred form-specific review

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

                <section class="ServiceRequestPageLayout.heroSection">
                  <header class="PageHero.hero" aria-labelledby="{heroTitleId}" aria-describedby="{heroDescriptionId?}">
                    {hero image, h1, hero copy, optional hero CTA structure}
                  </header>
                </section>

                <main id="app-main-content" tabindex="-1" class="ServiceRequestPageLayout.main" data-page="cleaning-service">
                  {auth gate false && alert not closed ? (
                    <div class="AuthRequiredAlert.overlay">
                      <aside
                        class="AuthRequiredAlert.alert card card--accent"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cleaning-auth-alert-title"
                        aria-describedby="cleaning-auth-alert-description"
                      >
                        <button class="button button--close">{close}</button>
                        <nav aria-label="{authAlert.a11y.actionsLabel}">
                          <a class="button button--primary">{login}</a>
                          <a class="button button--secondary">{register}</a>
                        </nav>
                      </aside>
                    </div>
                  ) : null}

                  <section class="ServiceRequestPageLayout.formSection">
                    <div class="ServiceRequestPageLayout.formSectionInner">
                      <div class="ServiceRequestPageLayout.formSurface">
                        <section class="CleaningRequestForm.section">
                          <form class="CleaningRequestForm.form" aria-labelledby="{sectionTitleId}">
                            {multi-step flow:
                              - shared ProcessStepsHeader
                              - customer/frequency
                              - property details
                              - shared ServiceRequestSchedulingStep / AvailabilityCalendar
                              - shared ServiceRequestAddressStep / WorkAddressSelector
                              - shared ServiceRequestReviewStep
                              - shared ServiceRequestShell action row
                            }
                          </form>
                        </section>
                      </div>
                    </div>
                  </section>

                  <section class="FAQSection.section" aria-labelledby="{faqTitleId}">
                    {accordion items}
                  </section>

                  <section class="ServiceRequestPageLayout.relatedSection">
                    <div class="ServiceRequestPageLayout.relatedSectionInner">
                      <section
                        class="card card--secondary ServiceCrossCtaSection.section"
                        aria-labelledby="{crossTitleId}"
                        aria-describedby="{crossDescriptionId}"
                      >
                        {cross CTA copy, actions, decorative media}
                      </section>
                    </div>
                  </section>
                </main>

                <Footer />
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

### 1. The route now has a canonical page boundary

Interpretation:

- route entry is no longer the main render bucket
- hero, page flow, form surface, FAQ and CTA closure are now explicitly grouped
- the page shell itself is now shared through `ServiceRequestPageLayout`

### 2. The auth alert can appear before the form path

Risk:

- this route should explicitly verify keyboard order when the dialog is visible
- focus return after close remains part of the manual validation baseline

### 3. The form remains the dominant interactive surface

Interpretation:

- page-level validation must distinguish route structure from form-specific flow validation
- most interactive density still lives in `CleaningRequestForm`
- steps 3, 4, and 5 now belong to the same shared request family used by `home-service`
