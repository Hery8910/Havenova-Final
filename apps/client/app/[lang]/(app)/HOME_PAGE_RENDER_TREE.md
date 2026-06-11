# Home Page Render Tree

## Purpose

This document simulates the current rendered element tree of the Home page based on the source structure.

It is not a byte-perfect DOM dump.

It is a practical visualization of what the page currently renders and where conditional branches exist.

Scope:

- client app shell
- route shell
- Home route
- Home feature sections

## Shell Context

The Home route is wrapped by:

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
                        <h1 id="{heroTitleId}" class="type-display-lg v2-page-heading">
                          {home.hero.title}
                        </h1>

                        <div id="{heroDescriptionId?}" class="PageHero.heroDescriptions">
                          <p class="type-body-lg v2-page-copy">{home.hero.descriptions[0]}</p>
                          <p class="type-body-lg v2-page-copy">{home.hero.descriptions[1]?}</p>
                          <p class="type-body-lg v2-page-copy">{home.hero.descriptions[n]?}</p>
                        </div>

                        <nav class="PageHero.heroCtas" aria-label="{home.hero.a11y.actionsLabel?}">
                          <a class="v2-button v2-button--primary">{primary cta}</a>
                          <a class="v2-button v2-button--secondary">{secondary cta?}</a>
                        </nav>
                      </div>
                    </div>
                  </div>
                </header>

                <main id="app-main-content" tabindex="-1" class="HomePageView.main v2-home-page" data-page="home">
                  <section class="AppInstallSection.appInstall" aria-labelledby="home-app-title">
                    {branch depends on PWA state and auth state}
                  </section>

                  <section class="ServicesSection.services" aria-labelledby="home-services-title">
                    <div class="ServicesSection.container">
                      <header class="ServicesSection.sectionHeader">
                        <h2 id="home-services-title" class="type-title-xl v2-page-heading">
                          {home.services.title}
                        </h2>
                        <p class="type-body-lg v2-page-copy">{home.services.subtitle}</p>
                      </header>

                      <div class="ServicesSection.cardGrid">
                        <article class="v2-card v2-card--primary|secondary ServicesSection.card">
                          <header class="ServicesSection.cardIcon">
                            <h3 class="type-title-md v2-page-heading">{service.title}</h3>
                            <span class="v2-card v2-card--neutral ServicesSection.iconSurface" aria-hidden="true">
                              <img class="ServicesSection.icon" alt="" />
                            </span>
                          </header>

                          <aside class="ServicesSection.cardAside">
                            <p class="type-body-sm v2-page-copy">{service.description}</p>
                            <ul class="ServicesSection.serviceList">
                              <li class="type-body-sm">{highlight}</li>
                            </ul>
                            <a class="v2-button v2-button--primary|secondary">
                              {service.ctaLabel}
                            </a>
                          </aside>
                        </article>

                        {repeated for each service}
                      </div>
                    </div>
                  </section>

                  <section class="BenefitsSection.benefits" aria-labelledby="home-benefits-title">
                    <div class="BenefitsSection.container">
                      <header class="BenefitsSection.benefitsCopy">
                        <h2 id="home-benefits-title" class="type-display-md v2-page-heading">
                          {home.benefits.title}
                        </h2>
                        <p class="type-body-lg v2-page-copy">{home.benefits.description}</p>
                      </header>

                      <ul class="BenefitsSection.benefitsCards">
                        <li class="BenefitsSection.benefitItem">
                          <article class="BenefitsSection.benefitCard">
                            <span class="BenefitsSection.benefitIcon" aria-hidden="true">
                              {icon}
                            </span>
                            <div class="BenefitsSection.benefitHeading">
                              <h3 class="type-title-sm v2-page-heading">{item.title}</h3>
                              <p class="type-body-sm v2-page-copy">{item.description}</p>
                            </div>
                          </article>
                        </li>

                        {repeated for each benefit}
                      </ul>
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

## App Install Branches

## 1. Unresolved state

Before install state is resolved:

```html
<section class="AppInstallSection.appInstall" aria-hidden="true">
  <div class="AppInstallSection.appCard AppInstallSection.appSkeleton">
    <div class="AppInstallSection.titleBlock">
      <span class="AppInstallSection.skeletonTitle"></span>
      <span class="AppInstallSection.skeletonTitleShort"></span>
    </div>
    <div class="AppInstallSection.copyBlock">
      <span class="AppInstallSection.skeletonLine"></span>
      <span class="AppInstallSection.skeletonLineShort"></span>
      <div class="AppInstallSection.skeletonActions">
        <span class="AppInstallSection.skeletonButton"></span>
        <span class="AppInstallSection.skeletonButtonAlt"></span>
      </div>
    </div>
  </div>
</section>
```

## 2. Installed state

```html
<section class="AppInstallSection.appInstall" aria-labelledby="home-app-title">
  <div class="AppInstallSection.appCard AppInstallSection.appInstalledCard" data-state="installed">
    <header class="AppInstallSection.titleBlock">
      <h2 id="home-app-title" class="type-display-md v2-page-heading">{installed.title}</h2>
    </header>

    <div class="AppInstallSection.copyBlock">
      <p class="type-body-lg v2-page-copy">{installed.description}</p>
      <div class="AppInstallSection.appCtas">
        <a class="v2-button v2-button--accent">{cta}</a>
        <a class="v2-button v2-button--accent">{cta?}</a>
      </div>
    </div>
  </div>
</section>
```

Installed content branch:

- guest variant if the user is not logged in
- logged-in variant if the user is authenticated

## 3. Not installed state

```html
<section class="AppInstallSection.appInstall" aria-labelledby="home-app-title">
  <div
    class="AppInstallSection.appCard AppInstallSection.appInstalledCard AppInstallSection.appNotInstalledCard"
    data-state="installable|ios-manual|unavailable"
  >
    <header class="AppInstallSection.titleBlock">
      <h2 id="home-app-title" class="type-display-md v2-page-heading">{notInstalled.title}</h2>
    </header>

    <div class="AppInstallSection.copyBlock">
      <p class="type-body-lg v2-page-copy">{notInstalled.description}</p>

      {state === "unavailable" ? (
        <div class="AppInstallSection.appCtas">
          <a class="v2-button v2-button--outline">{fallback cta}</a>
        </div>
      ) : null}
    </div>

    {state === "installable" || state === "ios-manual" ? (
      <div class="v2-card v2-card--neutral AppInstallSection.supportBar">
        <p class="type-body-sm v2-page-copy">{support info}</p>
        {state === "installable" ? (
          <button class="v2-button v2-button--outline">{install cta}</button>
        ) : null}
      </div>
    ) : null}
  </div>
</section>
```

## Render Notes

### 1. Home can currently disappear completely if i18n content is missing

Current source behavior:

- if `texts?.pages?.client?.home` is falsy, `HomePage.view.tsx` renders feature-level fallback copy instead of returning `null`

Status:

- resolved in the current Home rectification pass

### 2. The shell adds non-page content that still affects Home

Rendered around Home:

- `NavbarContainer`
- `Footer`
- `CookieBannerContainer`
- global alert viewport

So Home visual and semantic auditing must account for page content plus shell content.

### 3. Shell semantics now include a shared skip link

Current shell interpretation:

- `NavbarContainer` contributes the primary `nav` landmark
- Home still owns the page `main`
- `Footer` contributes the page footer landmark plus nested footer navigation
- `CookieBannerContainer` behaves as an out-of-flow dialog surface
- `AppLayoutShell` now contributes a skip link to `#app-main-content`

Remaining accessibility debt:

- keyboard behavior and visible focus order still need manual verification across desktop and mobile navigation variants

### 4. Metadata is not represented in this tree

Home now has route-specific metadata through:

- [apps/client/app/[lang]/(app)/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/page.tsx:1)
- [packages/utils/metadata/metadata.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/metadata/metadata.ts:1)

It still must be tracked separately in:

- [HOME_PAGE_AUDIT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/HOME_PAGE_AUDIT.md:1)

### 4. The simulated tree does not show every global style dependency

Not represented directly here:

- global reset/base rules
- `body::after` page background overlay
- shared typography/button/card utility styling
- reduced-motion coverage or gaps

These are tracked separately in:

- [HOME_STYLE_INVENTORY.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/HOME_STYLE_INVENTORY.md:1)
