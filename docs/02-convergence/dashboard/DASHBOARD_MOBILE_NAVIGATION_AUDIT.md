# Auditoría — navegación responsive Dashboard

- Sidebar desktop: `READY`.
- Sidebar desktop colapsado: `PARTIALLY_READY`.
- Drawer móvil: `READY`.

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

## Desktop colapsado — revisión acotada 2026-07-17

Permanece `PARTIALLY_READY`. La composición soportada es funcional: el workspace controla el ancho,
el botón de colapso es controlado, rutas y logout se conservan, los enlaces y grupos icon-only tienen
nombre accesible, `title`, `aria-current`, `aria-expanded` y `aria-controls`; no interviene en el
drawer móvil ni en Client `SideNav`.

| Gap exacto                                                                           | Clase                      | Estado                                                  | Decisión                                                                       |
| ------------------------------------------------------------------------------------ | -------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Foco visible real de enlaces y botones icon-only en claro/oscuro                     | Accesibilidad y visual     | No validado en navegador                                | Diferido: Jest sólo prueba nombre y semántica.                                 |
| Orden de tabulación, activación con teclado y tamaños de hit-area en columna de 84px | Accesibilidad y responsive | No validado en navegador                                | Diferido: requiere la misma sesión/capturas bloqueadas para el shell.          |
| Etiquetas largas en alemán, hover y títulos nativos sin clipping                     | Visual                     | No validado en navegador                                | Diferido: no se añaden tooltips ni se rediseña la columna sin evidencia.       |
| Convivencia a 1100px con la transición sidebar→drawer                                | Responsive                 | Caracterizada por media query y tests, sin smoke visual | Diferido: el drawer ya es `READY`; esta deuda no cambia su ownership.          |
| Estado expandido de la sección activa al colapsar                                    | Funcional y ownership      | Implementado y caracterizado                            | No es gap bloqueante: la sección activa permanece abierta de forma deliberada. |

No hay gap de rutas, autorización, modelo `DashboardShellNav`, ownership, sidebar expandido, drawer
móvil ni Client `SideNav`. La deuda es no bloqueante para el shell operacional actual y no bloquea la
convergencia de Users Directory; deberá resolverse antes de promover desktop colapsado a `READY` o
si un cambio de breakpoint, foco, labels o navegación altera esa columna. No recibe semántica modal,
trap ni scroll lock en este corte.

La revisión autenticada manual de Heriberto del `2026-07-17` aceptó el comportamiento funcional y
visual de la navegación, incluido el drawer móvil. No sustituye la evidencia específica aún ausente
para teclado, orden de tabulación, foco visible, etiquetas largas y el umbral exacto del desktop
colapsado. Los ajustes estéticos menores se difieren a Users Directory y no cambian esta
clasificación.
