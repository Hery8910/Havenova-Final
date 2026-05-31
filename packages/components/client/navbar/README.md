# Navbar (Client)

## Estado técnico

El navbar quedó separado en una capa de orquestación y tres vistas responsivas:

- [NavbarContainer.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/NavbarContainer.tsx) resuelve `auth`, i18n, navegación, `deviceSize` y el modelo `ResolvedNavbarContent`.
- [NavbarDesktopView.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/NavbarDesktopView/NavbarDesktopView.tsx), [NavbarTabletView.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/NavbarTabletView/NavbarTabletView.tsx) y [NavbarMobileView.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/NavbarMobileView/NavbarMobileView.tsx) manejan solo el estado interactivo propio de cada layout.
- [navbar.shared.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/navbar.shared.ts) concentra el contenido derivado, labels, accesibilidad y links por sesión.

## Estado de estilos

- `apps/client/app/global.css` es la fuente principal de tokens globales, `card`, `button` y animaciones compartidas del navbar.
- [NavbarShared.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/NavbarShared.module.css) quedó reducido a utilidades compartidas exclusivas del navbar:
  - icon buttons
  - `logoLink` y `logoImage`
  - `notificationSlot`
  - `profileButton`
  - `panelHeader`, `panelTitle`, `panelList`, `panelHandle`
  - `srOnly`
- Las vistas ya no dependen de clases eliminadas como `navLinkButton`.
- Las animaciones locales duplicadas fueron eliminadas; el navbar usa `navbarFadeInDown`, `navbarFadeInUp`, `navbarFadeInUpLarge`, `navbarFadeInDownLarge` y `navbarSkeletonShimmer` desde `global.css`.
- `desktop` y `tablet` entran de arriba hacia abajo.
- `mobile` conserva entrada desde abajo hacia arriba.

## Estado de interacción

- `desktop`, `tablet` y `mobile` ya comparten un contrato de estado interactivo mediante [useNavbarPanelState.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/hooks/useNavbarPanelState.ts).
- `desktop` usa portal para el dropdown de cuenta y calcula su posición en `useLayoutEffect` para evitar el primer paint incorrecto.
- `desktop`, `tablet` y el dropdown no modal de `LanguageSwitcher` abren con keyframes globales desde `global.css`.
- `mobile` mantiene el panel montado y conserva la sección visible durante la transición de cierre, evitando que el contenido desaparezca antes de que termine la animación.
- `LanguageSwitcher` usa el mismo patrón estable de portal; el dropdown no vuelve a montar/desmontar en cada apertura.
- `useDismissibleLayer` centraliza dismiss por click fuera y `Escape` para las variantes que abren capas superpuestas.

## Estado de accesibilidad

- Los toggles principales usan `button`, `aria-expanded` y `aria-controls`.
- Los paneles usan `aria-labelledby` cuando tienen título visible y `aria-hidden` cuando están cerrados.
- Los ids de panel y título son dinámicos, no hardcodeados.
- `ThemeToggler` y `LanguageSwitcher` reciben labels desde el modelo del navbar cuando se usan dentro del componente.

## Estado funcional

- `logout` está presente en `desktop`, `tablet` y `mobile`.
- `ThemeToggler` y `LanguageSwitcher` siguen el mismo contrato de props entre vistas.
- `mobile` muestra preferencias con `icon-with-value`; `desktop` y `tablet` usan solo icono.
- `LanguageSwitcher` ya no depende de estilos del navbar eliminados.
- En rutas `profile`, `desktop` y `tablet` mantienen la navegación principal general del sitio en el topbar.
- En rutas `profile`, `desktop` y `tablet` dejan de renderizar por completo los controles de cuenta del topbar.
- En rutas `profile`, `desktop` y `tablet` el topbar muestra solo utilidades globales, concretamente tema e idioma.
- En rutas `profile`, la identidad del usuario, logout y navegación interna viven en el sidebar.
- `mobile` mantiene la navegación dentro del navbar porque ahí no existe sidebar persistente.
- El trigger de cuenta ya usa avatar real y nombre del usuario cuando están disponibles.

## Estado de tests

- Hay cobertura del container en [navbar.test.jsx](/home/heriberto/Escritorio/Havenova/havenova/tests/jest/components/navbar.test.jsx).
- Hay cobertura directa por vista en [navbar-views.test.jsx](/home/heriberto/Escritorio/Havenova/havenova/tests/jest/components/navbar-views.test.jsx):
  - `desktop`
  - `tablet`
  - `mobile`
- Hay cobertura específica del selector de idioma en [language-switcher.test.jsx](/home/heriberto/Escritorio/Havenova/havenova/tests/jest/components/language-switcher.test.jsx).
- Estado actual de validación automatizada:
  - `15` tests pasando
  - `npm run check:types` pasando

## Riesgos abiertos antes de despliegue

- No se validó en esta pasada el comportamiento visual en navegador real para todos los breakpoints; la verificación hecha fue estática y por typecheck.

## Recomendaciones

1. Hacer una pasada manual en navegador sobre `desktop`, `tablet` y `mobile` validando:
   - apertura/cierre repetido
   - cambio rápido entre secciones
   - click fuera
   - `Escape`
   - scroll con panel abierto
2. Si se quiere más seguridad visual, añadir pruebas E2E por breakpoint para animaciones y posición de overlays, porque eso no queda cubierto por JSDOM.

## Criterio de salida

Estado actual: apto para despliegue condicionado a validación visual manual final.

Razón:

- no hay referencias de estilo rotas conocidas
- la estructura de estilos quedó más consistente
- las animaciones ya no presentan el flash inicial detectado en `desktop/tablet`
- la dirección de entrada ya quedó alineada con el criterio visual actual:
  - `desktop/tablet`: arriba hacia abajo
  - `mobile`: abajo hacia arriba
- `mobile` ya mantiene consistencia entre apertura y cierre
- `LanguageSwitcher` quedó alineado con el mismo patrón de overlay estable
- el estado interactivo del navbar ya no está disperso por variante; quedó centralizado en un hook compartido
- la duplicación de controles de cuenta en la zona `profile` quedó eliminada en `desktop/tablet`
- hay cobertura automatizada del container, las tres vistas y el selector de idioma
- `npm run check:types` pasa
