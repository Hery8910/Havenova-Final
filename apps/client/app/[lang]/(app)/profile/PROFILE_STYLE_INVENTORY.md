# Profile Workspace Style Inventory

## Proposito

Mapear las capas visuales que hoy afectan a `profile/*` para separar:

- estilos del shell privado
- estilos del nav compartido
- estilos del overview
- estilos de `settings`

## 1. Shell del namespace

Archivos:

- [apps/client/app/[lang]/(app)/profile/layout.module.css](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/layout.module.css:1)
- [apps/client/app/[lang]/(app)/profile/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/layout.tsx:1)

Dependencias globales:

- `card`
- `card--secondary`

Responsabilidades:

- ancho máximo y centrado del workspace privado
- grid de dos columnas para nav + contenido
- altura fija/viewport del shell
- scroll interno del panel de contenido
- adaptación mobile sin columna lateral

Hotspots:

- altura fija del workspace frente a contenido variable
- relación entre `overflow: hidden` del contenedor y `overflow: auto` de la sección interna
- gradientes y glass surface del contenedor principal

## 2. Navegación privada

Archivos:

- [packages/components/client/user/profile/profileNav/ProfileNav.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileNav/ProfileNav.tsx:1)
- [packages/components/client/user/profile/profileNav/profileNav.helpers.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileNav/profileNav.helpers.tsx:1)
- [packages/components/sideNav/SideNav.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/sideNav/SideNav.tsx:1)

Dependencias globales:

- `button--ghost`
- sistema global de `card` y tokens de superficie

Responsabilidades:

- item states
- colapso/expansión
- relación visual entre rutas activas, headers y footer actions

Hotspots:

- estados `hover` y `active` de `button--ghost` dentro de `SideNav`
- diferencia entre links reales y acciones del footer
- consistencia visual dark/light del shell colapsado y expandido

## 3. Overview principal

Archivos:

- [packages/components/client/user/profile/profileOverview/ProfileOverviewClient.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileOverview/ProfileOverviewClient.module.css:1)
- [packages/components/client/user/profile/profileOverview/ProfileOverviewPage.client.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileOverview/ProfileOverviewPage.client.tsx:1)
- [packages/components/client/user/profile/profileOverview/ProfileOverviewPage.view.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileOverview/ProfileOverviewPage.view.tsx:1)

Dependencias globales:

- `button`
- `button--outline`
- `button--outline-small`
- tokens de texto, feedback, glass y motion

Responsabilidades:

- grid principal del overview
- cards de resumen
- progress bar
- pills, summary rows y CTA headers

Hotspots:

- mucho estilo local todavía ligado a copy inline
- cards locales que aún no pasan por una primitive clara del dominio `profile`
- la identidad comparte surface con `settings`, pero el resto del overview no

## 4. `settings`

Archivos:

- [packages/components/client/user/profile/profileSettings/ProfileSettingsClient.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileSettings/ProfileSettingsClient.module.css:1)
- [apps/client/app/[lang]/(app)/profile/settings/README.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/settings/README.md:1)

Dependencias derivadas:

- `UserProfileIdentityCard`
- `UserProfileDetailsSummary`
- `UserProfileDetailsForm`
- `UserPreferencesCard`
- `DeleteAccountSectionClient`

Lectura:

- `settings` usa menos layout local y delega más superficie en bloques internos
- visualmente sigue formando parte del mismo workspace, pero con una organización más modular que el overview

## 5. Legacy o deuda visible

Señales actuales:

- `userNav.module.css` sigue existiendo como capa separada del histórico del usuario
- `ProfileNav` ya usa `SideNav`, por lo que `userNav` no debe seguir considerándose referencia canónica del carril
- las subrutas secundarias ya convergen en `ProfileSubroutePlaceholder.module.css`
- el antiguo `requests/page.module.css` dejó de ser parte del baseline activo

## Conclusiones operativas

- el shell `profile/*` ya depende del sistema global nuevo de cards y nav surfaces
- la mayor deuda visual del carril no está hoy en `settings`, sino en el overview y en la validación del `SideNav` dentro del workspace privado
- antes de refinar estilos del overview conviene cerrar ownership entre shell, nav y cards del dominio `profile`
