# Auditoría — navegación responsive Dashboard

- Sidebar desktop: `READY`.
- Sidebar desktop colapsado: `PARTIALLY_READY`.
- Drawer móvil temporal: `PARTIALLY_READY`.

`DashboardWorkspaceShell` es owner app-local de `isNavCollapsed` e `isMobileNavOpen`.
`DashboardShellNav` y `dashboardShell.ts` son Dashboard-owned y se montan en sidebar y drawer con
el mismo modelo localizado. Client Profile conserva `SideNav` legacy; Client y Worker no consumen
esta composición operational.

El drawer se renderiza inline, no mediante portal. `.mobileNavOverlay` es fija, usa `z-index:40` y
`--op-overlay`; está dentro de `[data-ui-foundation='operational']` y resuelve `--op-*`.
`DashboardWorkspaceShell` bloquea `document.body.style.overflow` mientras abre y lo restaura;
cierra por botón, selección de ruta o cambio de pathname y devuelve foco al trigger.

Gaps observados: no hay foco inicial ni trap, Escape ni cierre por backdrop; el trigger sólo abre,
no alterna. Son requisitos para validación futura, no comportamiento inventado. El drawer cubre la
ventana y no almacena tokens ni mezcla identidad Client/Worker. Rutas vienen de
`getDashboardNavSections`; autorización sigue siendo server/BFF, no visibilidad UI.

El patrón inline demuestra que un futuro host local podría heredar foundation sin el problema del
portal global de LanguageSwitcher, pero no se crea ni diseña aquí. No debe confundirse con dropdown
LanguageSwitcher ni account menu Client-owned.
