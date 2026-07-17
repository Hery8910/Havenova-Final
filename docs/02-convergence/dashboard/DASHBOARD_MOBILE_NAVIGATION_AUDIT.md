# Auditoría — navegación responsive Dashboard

- Sidebar desktop: `READY`.
- Sidebar desktop colapsado: `PARTIALLY_READY`.
- Drawer móvil temporal: `READY`.

`DashboardWorkspaceShell` es owner app-local de `isNavCollapsed` e `isMobileNavOpen`.
`DashboardShellNav` y `dashboardShell.ts` son Dashboard-owned y se montan en sidebar y drawer con
el mismo modelo localizado. Client Profile conserva `SideNav` legacy; Client y Worker no consumen
esta composición operational.

El drawer se renderiza inline, no mediante portal. `.mobileNavOverlay` es fija, usa `z-index:40` y
`--op-overlay`; está dentro de `[data-ui-foundation='operational']` y resuelve `--op-*`.
`DashboardWorkspaceShell` bloquea `document.body.style.overflow` mientras abre y lo restaura;
cierra por trigger, botón, Escape, backdrop, selección de ruta, pathname o paso a desktop. El foco
inicial va al cierre y `Tab` queda contenido; al cerrar localmente restaura el trigger.

El drawer cubre la ventana y no almacena tokens ni mezcla identidad Client/Worker. Rutas vienen de
`getDashboardNavSections`; autorización sigue siendo server/BFF, no visibilidad UI.

El drawer continúa inline y excluido del host local de `LanguageSwitcher`; no porta su contenido ni
cambia su scroll lock. El host es propiedad del workspace sólo para ese selector y no debe
confundirse con el drawer ni con un account menu Client-owned.

Desktop colapsado conserva `PARTIALLY_READY` por revisión visual y foco pendientes; no recibe
semántica modal, trap ni scroll lock en este corte.
