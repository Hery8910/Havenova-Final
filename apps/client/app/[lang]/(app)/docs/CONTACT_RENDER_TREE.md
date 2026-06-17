# Contact Render Tree

## Purpose

This document simulates the current rendered tree of the `contact` page based on the source structure.

It is not a byte-perfect DOM snapshot.

Its purpose is to document:

- shell content rendered around the page
- the actual landmark structure
- where translated copy, actions, and fallback surfaces appear
- which nodes belong to page validation and which belong to the deferred form audit

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
                          {contact.hero.title}
                        </h1>

                        <div id="{heroDescriptionId?}" class="PageHero.heroDescriptions">
                          <p class="type-body-lg">{contact.hero.descriptions[0]}</p>
                          <p class="type-body-lg">{contact.hero.descriptions[n]?}</p>
                        </div>

                        <nav class="PageHero.heroCtas" aria-label="{contact.hero.a11y.actionsLabel?}">
                          <a class="button button--primary" aria-label="{contact.hero.ctas.primary.ariaLabel}">
                            {contact.hero.ctas.primary.label}
                          </a>
                          <a class="button button--secondary" aria-label="{contact.hero.ctas.secondary.ariaLabel}">
                            {contact.hero.ctas.secondary.label}
                          </a>
                        </nav>
                      </div>
                    </div>
                  </div>
                </header>

                <main id="app-main-content" tabindex="-1" class="ContactPageView.main" data-page="contact">
                  <div class="ContactPageView.wrapper">
                    <section
                      class="ContactForm.section card card--secondary"
                      aria-labelledby="contact-form-title"
                    >
                      <article class="ContactForm.card">
                        <h2 id="contact-form-title" class="type-title-md">
                          {form.button.contact}
                        </h2>

                        <form class="ContactForm.form" aria-busy="{submitting}" novalidate>
                          <div class="ContactForm.row">
                            <label class="ContactForm.field" for="contact-name">
                              <span class="type-body-md">{form.labels.name}</span>
                              <input id="contact-name" class="input" type="text" />
                              <span id="contact-name-error" class="type-caption" aria-live="polite">
                                {nameError?}
                              </span>
                            </label>

                            <label class="ContactForm.field" for="contact-email">
                              <span class="type-body-md">{form.labels.email}</span>
                              <input id="contact-email" class="input" type="email" />
                              <span id="contact-email-error" class="type-caption" aria-live="polite">
                                {emailError?}
                              </span>
                            </label>
                          </div>

                          <label class="ContactForm.field" for="contact-subject">
                            <span class="type-body-md">{form.labels.subject}</span>
                            <select id="contact-subject" class="input">
                              <option value="" disabled>{form.placeholders.subject}</option>
                              <option>{form.subjects.contact[0]}</option>
                              <option>{form.subjects.contact[n]}</option>
                            </select>
                            <span id="contact-subject-error" class="type-caption" aria-live="polite">
                              {subjectError?}
                            </span>
                          </label>

                          <label class="ContactForm.field" for="contact-message">
                            <span class="type-body-md">{form.labels.message}</span>
                            <textarea id="contact-message" class="input" rows="6"></textarea>
                            <span id="contact-message-error" class="type-caption" aria-live="polite">
                              {messageError?}
                            </span>
                          </label>

                          <div class="ContactForm.actions">
                            <button class="button button--primary" type="submit">
                              {form.button.contact}
                            </button>
                          </div>
                        </form>
                      </article>
                    </section>

                    <section class="InfoSection.contactSection">
                      <div class="InfoSection.contactCard card card--secondary">
                        <CompanyContact
                          ariaLabel="{components.client.contact.aria.info?}"
                          emailAriaLabel="{components.client.contact.aria.email?}"
                          phoneAriaLabel="{components.client.contact.aria.call?}"
                          headingAs="h3"
                        />
                      </div>

                      <nav class="InfoSection.quickActions" aria-label="{components.client.contact.aria.quickActions?}">
                        <div class="InfoSection.actionList">
                          <a class="InfoSection.actionLink" href="tel:{normalizedPhone}" aria-label="{components.client.contact.aria.call?}">
                            <img class="InfoSection.actionImage" alt="" aria-hidden="true" />
                            <span class="InfoSection.srOnly">{components.client.contact.quickActions.call}</span>
                          </a>

                          <a class="InfoSection.actionLink" href="mailto:{email}" aria-label="{components.client.contact.aria.email?}">
                            <img class="InfoSection.actionImage" alt="" aria-hidden="true" />
                            <span class="InfoSection.srOnly">{components.client.contact.quickActions.email}</span>
                          </a>

                          <a
                            class="InfoSection.actionLink"
                            href="https://wa.me/{normalizedPhone}"
                            aria-label="{components.client.contact.aria.whatsapp?}"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img class="InfoSection.actionImage" alt="" aria-hidden="true" />
                            <span class="InfoSection.srOnly">{components.client.contact.quickActions.whatsapp}</span>
                          </a>
                        </div>
                      </nav>
                    </section>
                  </div>

                  <section
                    class="FAQSection.section"
                    aria-labelledby="{sectionTitleId}"
                    aria-label="{faq.a11y.sectionLabel?}"
                  >
                    <h2 id="{sectionTitleId}" class="type-title-lg">{faq.title}</h2>

                    <ul class="FAQSection.ul">
                      <li class="FAQSection.li">
                        <h3 class="FAQSection.heading">
                          <button
                            class="button button--ghost FAQSection.trigger"
                            type="button"
                            aria-expanded="{isOpen}"
                            aria-controls="{panelId}"
                            aria-labelledby="{headingId}"
                            aria-label="{faq.a11y.openItem|faq.a11y.closeItem}"
                          >
                            <span id="{headingId}" class="type-title-sm">{item.question}</span>
                          </button>
                        </h3>

                        <div id="{panelId}" role="region" aria-labelledby="{headingId}" hidden="{!isOpen}">
                          <p class="type-body-md">{item.answer}</p>
                        </div>
                      </li>

                      {repeated for each faq item}
                    </ul>
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

### 1. The page-owned informational surface no longer disappears on missing i18n

Current source behavior:

- [ContactPage.client.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/ContactPage.client.tsx:1) may receive `undefined` page, footer, or faq copy
- [ContactPage.view.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/ContactPage.view.tsx:1) resolves visible fallbacks for hero, contact info, and faq

Status:

- the previous route-level `return null` behavior is resolved for the non-form surface

### 2. Contact differs from `about` and `how-it-work` because the hero has CTA actions

Current interpretation:

- `PageHero` renders heading, description, image, and CTA navigation on this route
- the first page-owned interactive elements after the shell are the hero CTAs

Implication:

- keyboard validation must include hero CTA focus order on this page

### 3. The central wrapper mixes deferred form audit and immediate page audit

Observed split:

- `ContactFormSection` is interactive and stateful
- `InfoSection` is mostly informational, with quick-action links
- both render side by side in the same wrapper

Implication:

- page-level accessibility and focus order must be documented now
- backend contract validation for the form remains deferred

### 4. InfoSection contains the first stable non-form interactive links inside `main`

Current interpretation:

- `CompanyContact` provides semantic contact information and hours
- quick actions produce `tel:`, `mailto:`, and `wa.me` links when data exists
- icons are decorative and text alternatives are provided through `aria-label` and sr-only labels

Implication:

- validation should confirm those links enter the focus order only when present

### 5. FAQ is interactive content owned by the page surface

Current interpretation:

- FAQ items are buttons controlling `region` panels
- the first item opens by default
- this section now resolves visible fallback copy instead of disappearing

Implication:

- keyboard validation must include expand/collapse behavior
- FAQ belongs to the page audit, not to the deferred form/backend task
