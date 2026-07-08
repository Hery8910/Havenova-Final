# Profile Workspace Render Tree

## Proposito

Registrar la estructura renderizada base del namespace `profile/*` para revisar semántica, foco,
scroll y ownership del shell privado antes de tocar más arquitectura.

## Shell del namespace

Ruta base:

- [apps/client/app/[lang]/(app)/profile/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/layout.tsx:1)

Render tree base:

```text
main.page
  section.workspace.card.card--secondary[aria-label="Profile workspace"]
    aside.navColumn[aria-label="Profile navigation"]
      ProfileNav
        SideNav
          nav / interactive navigation shell
    section.section
      child route content
```

Observaciones:

- `main` vive en el layout de familia, no en cada subruta
- el contenido de la subruta renderiza dentro de una región scrollable propia
- en mobile la columna lateral desaparece y el contenido pasa a flujo vertical

## `profile`

Ruta:

- [apps/client/app/[lang]/(app)/profile/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/page.tsx:1)

Feature surface:

- [packages/components/client/user/profile/profileOverview/ProfileOverviewPage.client.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileOverview/ProfileOverviewPage.client.tsx:1)
- [packages/components/client/user/profile/profileOverview/ProfileOverviewPage.view.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileOverview/ProfileOverviewPage.view.tsx:1)

Render tree aproximado:

```text
ProfileOverviewPageClient
  ProfileOverviewPageView
    section[aria-label="Profile overview"]
      div.topRow
        div.identitySlot
          UserProfileIdentityCard
        OverviewCard
          header
            h2
            Link CTA
          progress block
          completion list
      div.summaryGrid
        OverviewCard "Work orders"
        OverviewCard "Work requests"
        OverviewCard "Notifications"
        OverviewCard "Preferences"
```

Lectura:

- el overview ya tiene `client + view`
- el wrapper cliente todavía concentra auth, profile, i18n y guardia de sesión

## `profile/settings`

Ruta:

- [apps/client/app/[lang]/(app)/profile/settings/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/settings/page.tsx:1)

Feature surface:

- [packages/components/client/user/profile/profileSettings/ProfileSettingsClient.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileSettings/ProfileSettingsClient.tsx:1)

Render tree aproximado:

```text
section.section[aria-label="Profile settings"]
  div.wrapper
    UserProfileIdentityCard optional
    UserProfileDetailsSummary optional
    UserProfileDetailsForm optional
  UserPreferencesCard
  DeleteAccountSectionClient
```

Lectura:

- `settings` ya está más cerca de una composición por bloques
- sigue siendo cliente, pero con responsabilidades más claras que el overview

## `profile/orders`

```text
section[aria-labelledby="profile-orders-title"]
  h2#profile-orders-title
```

Lectura:

- subruta mínima, todavía sin estructura de página real

## `profile/requests`

```text
div.wrapper
  future request table / filters placeholder
```

Lectura:

- subruta en estado técnico transicional
- hoy no constituye una página auditada

## `profile/notifications`

```text
section
  h2 "Notifications"
```

Lectura:

- placeholder explícito
- el contrato documental relevante hoy vive en `docs/notification-client-plan.md`

## Riesgos semánticos a revisar después

- orden real de foco entre shell, nav colapsable y región scrollable del contenido
- posible scroll doble entre `main`, `workspace` y `section`
- ausencia de landmarks más específicos dentro del overview
- coherencia de headings entre subrutas maduras y placeholders
