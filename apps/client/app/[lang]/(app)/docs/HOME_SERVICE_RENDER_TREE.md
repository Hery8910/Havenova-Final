# Home Service Render Tree

## Purpose

This document simulates the current rendered tree of the `home-service` page based on the current source structure.

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

                <main id="app-main-content" tabindex="-1" class="ServiceRequestPageLayout.main" data-page="home-service">
                  {auth gate false && alert not closed ? (
                    <div class="AuthRequiredAlert.overlay">
                      <aside class="AuthRequiredAlert.alert card card--accent" role="dialog" aria-modal="true">
                        {close button, auth CTAs}
                      </aside>
                    </div>
                  ) : null}

                  <section class="ServiceRequestPageLayout.formSection">
                    <div class="ServiceRequestPageLayout.formSectionInner">
                      <div class="ServiceRequestPageLayout.formSurface">
                        <section class="HomeServiceRequestForm.section">
                          <form class="HomeServiceRequestForm.form" aria-labelledby="{sectionTitleId}">
                            {multi-step flow:
                              - shared ProcessStepsHeader
                              - customer/service type
                              - service detail branch
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
                        class="card card--primary ServiceCrossCtaSection.section"
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
- hero, form flow, FAQ and CTA closure are now explicitly grouped
- the page shell itself is now shared through `ServiceRequestPageLayout`

### 2. The service-detail branch remains the only major divergence from `cleaning-service`

Interpretation:

- page-level documentation should not assume the branch logic is final
- manual validation must explicitly record which service variant was tested
- only the `painting` branch currently has a fully defined nested detail flow
- the other service branches still render a placeholder detail capture surface, not a finished
  service-specific subflow
- steps 3, 4, and 5 now belong to the same shared request family used by `cleaning-service`

### 3. The auth alert still affects route-level focus behavior

Risk:

- keyboard validation must document focus order with and without the alert visible
