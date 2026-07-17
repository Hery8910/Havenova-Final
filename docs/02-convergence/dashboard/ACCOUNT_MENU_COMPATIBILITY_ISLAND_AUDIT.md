# Auditoría de compatibility island — menú de cuenta autenticada

- Estado: `BLOCKED` para una futura composición Dashboard.
- Fecha: `2026-07-17`.
- Alcance: caracterización; no incluye cambios de producción ni migración visual.

La premisa de que Dashboard consume un account/profile dropdown es incorrecta. Su header sólo muestra
un resumen no interactivo de Admin; la navegación de cuenta/logout está en `DashboardShellNav`.
El menú desplegable auditado pertenece al navbar Client y no tiene consumidor runtime Dashboard o Worker.

## Ownership y consumidores runtime

| Superficie     | Owner                               | Implementación                               | Overlay                                             |
| -------------- | ----------------------------------- | -------------------------------------------- | --------------------------------------------------- |
| Client desktop | `packages/components/client/navbar` | `NavbarDesktopView` + `NavbarAccountContent` | Portal a `document.body`, dialog fixed.             |
| Client tablet  | Mismo paquete                       | `NavbarTabletView` + `NavbarAccountContent`  | Panel in-tree, `role="dialog"`.                     |
| Client mobile  | Mismo paquete                       | `NavbarMobileView` + `NavbarAccountContent`  | Panel in-tree fixed, `role="dialog"`, `aria-modal`. |
| Dashboard      | `apps/dashboard`                    | Header y `DashboardShellNav`                 | No dropdown; avatar no es trigger.                  |
| Worker         | `apps/worker`                       | Ningún menú equivalente encontrado           | Ninguno.                                            |

`NavbarContainer` resuelve `auth`, `logout`, Profile, i18n, locale y navegación y entrega callbacks
a cada vista. `getNavbarContent` deriva avatar, nombre y enlaces Client desde `AuthContext` y
`ProfileContext`. Client prefija enlaces con `href(lang, path)`; el menú no decide autorización ni tenant.

## Contrato existente

Los triggers son botones nativos con avatar decorativo/fallback de icono, nombre accesible,
`aria-expanded`, `aria-controls` y `aria-haspopup="dialog"`. Desktop y tablet usan diálogo sin
`aria-modal`; mobile usa diálogo modal. Los títulos se truncan mediante CSS y usan nombre o fallback.
Usuario guest muestra Register/Login y no Logout; avatar ausente usa icono con texto sólo para lectores.

`useNavbarPanelState` coordina apertura, segundo click y cambio entre secciones. `useDismissibleLayer`
cierra con click exterior/Escape y `useFocusTrap` devuelve foco tras Escape. Los enlaces delegan
navegación al contenedor y cierran el panel. Logout cierra antes de invocar `AuthContext.logout`; no
existe estado pending local, pero el cierre desmonta la acción y evita la repetición normal. Auth
loading no se representa específicamente.

## Seguridad, estilos y overlays

El menú recibe identidad resuelta por `AuthContext` y perfil del mismo árbol Client; no consulta
datos Dashboard/Admin/Worker ni introduce branches tenant. La presencia visual de un enlace no
autoriza backend: las rutas y mutaciones conservan guards BFF/servidor. Logout delega al callback
real de `AuthContext`; `NavbarAccountContent` no manipula tokens, CSRF, cookies ni storage.

Desktop porta el panel a `document.body`, usa `z-index: 20`, listeners de scroll/resize y estilos
legacy `card`, `card--neutral`, `button`, `button--ghost`, `NavbarShared.module.css`,
`NavbarLinkList.module.css`, tokens `--navbar-*`, `--color-card-*`, radios, sombras y animaciones.
Tablet/mobile renderizan in-tree; mobile no tiene backdrop dedicado. No hay `--op-*` ni CSS
operational en Client. Copiarlo al Dashboard repetiría el problema de boundary del portal global.

Un futuro host Dashboard podría alojar una composición Dashboard-owned, pero no reutiliza
automáticamente este menú Client: mezcla enlaces, perfil, copy, responsive y logout tenant-specific.
El inventario de consumidores de overlay debe terminar antes de crear ese host.

## Clasificación y gaps

| Dimensión        | Estado            | Evidencia                                                                                   |
| ---------------- | ----------------- | ------------------------------------------------------------------------------------------- |
| Funcional        | `PARTIALLY_READY` | Apertura, cierre, rutas y logout caracterizados; no hay estado pending explícito.           |
| Visual           | `BLOCKED`         | Depende de variantes y estilos Client legacy.                                               |
| Overlay futuro   | `BLOCKED`         | Desktop usa portal global y Dashboard no tiene consumidor equivalente.                      |
| Accesibilidad    | `PARTIALLY_READY` | Botones, diálogo, foco y Escape existen; faltan revisión visual y semántica desktop/tablet. |
| Seguridad/sesión | `PARTIALLY_READY` | Delega a AuthContext; requiere E2E de logout/CSRF y guards de rutas.                        |

Readiness final: `BLOCKED`. No existe menú Dashboard que migrar. Antes de UI se requiere decisión de
producto sobre cuenta Dashboard, inventario de overlays y, por separado, doble logout, loading y
validación visual/E2E. No se autoriza copiar el menú Client al core Dashboard.
