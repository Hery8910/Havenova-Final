# Auditoría — primitivas globales necesarias para Users Directory v1

- Estado: `ACTIVE` — inventario y decisión de preparación; no autoriza Users v1.
- Fecha: `2026-07-17`.
- Alcance: sólo primitives que el Slice A de Users v1 necesita realmente en Dashboard.
- Autoridad de producto: Product Design Users v1, commit `b9c5a6c`.
- Evidencia local: `USERS_CONVERGENCE_AUDIT.md`, código y tests actuales.

## Necesidad concreta

El único candidato de implementación futuro es Slice A: directorio tenant-scoped, All/Invitations,
búsqueda, cursor, summary de total/pending invitations, selección, contexto responsive y Overview
mínimo. Invite (B), acceptance (C), resend/renew/revoke (D) y Service Requests (E) siguen fuera de
este corte o bloqueados por contrato.

| Necesidad Slice A                                  | Componente real actual                                             | Decisión                                                                                         |
| -------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| CTA de invitación                                  | `<button class="button button--primary">` local en `UsersPageView` | `BLOCKED` para uso v1: pertenece a Slice B bloqueado.                                            |
| Acciones secundarias de retry/load more/back       | Botones nativos locales con `button--outline`                      | `PARTIALLY_READY`: preservables para Slice A, sin primitive público.                             |
| Búsqueda y All/Invitations                         | `DirectoryFilters` Dashboard-local                                 | `PARTIALLY_READY`: el contrato v1 debe restringir las opciones antes de usarlo.                  |
| Selección de persona/invitación                    | `TenantUserDirectoryItem`                                          | `PARTIALLY_READY`: botón nativo, pero expone datos/status fuera de v1.                           |
| Loading, refresh, empty, no-results, error, cursor | `DirectoryList` Dashboard-local                                    | `PARTIALLY_READY`: concentra los estados necesarios, con gaps accesibles.                        |
| Confirmación destructiva                           | `AlertViewport` / `AlertWrapper`                                   | `NOT_REQUIRED_FOR_USERS_V1` en Slice A; revoke es Slice D bloqueado.                             |
| Campos invite/edición                              | `UsersInvitePanel` y `<input>` locales                             | `BLOCKED`: Slice B no puede continuar.                                                           |
| Feedback posterior a mutación                      | Alert global y texto local de panel                                | `NOT_REQUIRED_FOR_USERS_V1` en Slice A; las mutaciones están bloqueadas.                         |
| Popover/dropdown/drawer adicional                  | Ninguno                                                            | `NOT_REQUIRED_FOR_USERS_V1`: el filtro es `<select>` nativo y el mobile detail ya es page-owned. |

## Inventario y clasificación

| Primitiva                                                            | API / owner / consumidores runtime                                                                                                                            | SSR, teclado, foco, estilos y portal                                                                                                                                                                                                                                                        | Adecuación Users v1                                                                                                                                                                |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clases `button button--primary                                       | outline`                                                                                                                                                      | No hay componente `Button` ni API pública. Son CSS legacy usados por Dashboard, Client y Worker; en Users aparecen en CTA, retry, load-more, back e invite.                                                                                                                                 | Elementos nativos conservan teclado y `disabled` si el consumidor lo declara; loading/error/success no forman parte de una API. Sin SSR state ni portal. Dependen de `legacy.css`. | `PARTIALLY_READY` como bridge local, `BLOCKED` como primer primitive compartido: extraerlo alteraría tres apps y requeriría contrato visual/accesible explícito. |
| `DirectoryFilters`                                                   | Props controladas para búsqueda y un select (`ariaLabel`, labels, values, options, callbacks). Owner Dashboard, consumidor runtime actual Users.              | SSR-safe hasta hidratar; input/search y select nativos. No debounce, loading, error, `disabled` ni foco restaurado: los posee el controlador/página. Sin portal; CSS Module Dashboard-local.                                                                                                | `PARTIALLY_READY`: el select actual admite valores V2 fuera de v1; sólo All/Invitations podrán pasar al corte Slice A.                                                             |
| `DirectoryList`                                                      | Generic por `renderItem`; props para carga inicial/refresh/error/empty/retry/cursor. Owner Dashboard, consumidor runtime Users.                               | Guarda `IntersectionObserver` tras hidratar; fallback botón load-more. Retry/load-more son botones nativos. Refresh/load-more anuncian texto, pero carga inicial/error/empty no tienen contrato completo de live region ni skeleton. Sin portal; combina CSS Module con card/button legacy. | `PARTIALLY_READY`: es el primitive más cercano al Slice A, pero debe rectificar estados y copy aprobados antes de promoverlo.                                                      |
| `DirectorySummary`                                                   | Items de valor/tone y selección opcional. Owner Dashboard, consumidor Users.                                                                                  | Summary seleccionable usa botón con `aria-pressed`; no loading/error propios. Sin portal; CSS Module Dashboard-local.                                                                                                                                                                       | `PARTIALLY_READY`: sólo total people y pending invitations son v1; no promover attention ni otros KPIs.                                                                            |
| `TenantUserDirectoryItem` + `PersonStatusBadge`                      | Row Users-specific, `entryId`, selección y status. Sólo Dashboard Users.                                                                                      | Row es botón nativo y conserva teclado. Sin portal; CSS Module. Implementa active/inactive/locked/attention y relaciones de Requests no autorizadas por v1.                                                                                                                                 | `PARTIALLY_READY` para selección, `BLOCKED` para su contenido actual: no reutilizar badges/status/relaciones en Slice A sin rectificación.                                         |
| `packages/components/dashboard/{filters,pagination,statusBadge,...}` | `DashboardSearchInput`, `DashboardStatusFilters`, `DashboardLoadMore`, `StatusBadge`, `AreaBadge`, `RecurrenceBadge`; no se encontraron consumidores runtime. | Variantes client/legacy aisladas; no hay evidencia de foco, loading/error integral o SSR de uso Dashboard real. Sin portal.                                                                                                                                                                 | `NOT_REQUIRED_FOR_USERS_V1`: no adoptar ni reparar por coincidencia de nombre.                                                                                                     |
| `Loading`                                                            | Pantalla completa con `theme` requerido; la usan layouts de Client/Dashboard/Worker y algunos fallbacks.                                                      | Server-compatible, `role=status`, pero branding Havenova y sin estados de directorio. Sin portal; asset/estilos legacy.                                                                                                                                                                     | `NOT_REQUIRED_FOR_USERS_V1`: Slice A necesita estados inline, no un bloqueo global.                                                                                                |
| `AlertViewport` / `AlertWrapper` / `AlertPopup`                      | `AlertProvider` global; consumidores en layouts y contexts de las tres apps. API `showLoading                                                                 | showError                                                                                                                                                                                                                                                                                   | showSuccess                                                                                                                                                                        | showConfirm`.                                                                                                                                                    | Cliente: porta a `document.body`. Dialog enfoca el contenedor para acciones no-loading y Escape/backdrop sólo si cancelable; no usa host Dashboard, trap ni restauración de foco explícita. Estilos/acciones legacy. | `NOT_REQUIRED_FOR_USERS_V1` en Slice A; `PARTIALLY_READY` sólo como infraestructura futura de confirmación D, que sigue bloqueada y requerirá auditoría propia. |
| `UsersInvitePanel` y controles nativos                               | Form local de email/name/phone/language; único consumidor Users.                                                                                              | Form nativo e `isSubmitting`, pero sin errores por campo, address propuesta, outcomes de entrega ni foco/feedback contractual. Sin portal; CSS Module + inputs/buttons legacy.                                                                                                              | `BLOCKED`: Slice B requiere contrato backend y decisiones de producto.                                                                                                             |

## Exclusiones explícitas

- No se adopta el menú/popup de cuenta Client, `LanguageSwitcher`, `ThemeToggler`, navegación o
  host de overlays: sus decisiones están cerradas y no son requisito Slice A.
- No se usa Alert global para inventar confirmación, success o error de invitación/revoke: las
  mutaciones B/D no están autorizadas.
- No se migra `Loading` global ni los componentes Dashboard sin consumidores runtime.
- No se crea `Button`, sistema de formularios, modal, toast, skeleton o design system nuevo.
- No se incorporan active/inactive/locked, attention, Requests, Activity, Communication o Notes por
  disponibilidad técnica del renderer actual.

## Ownership y decisión de corte

Dashboard conserva ownership de `DirectoryFilters`, `DirectorySummary`, `DirectoryList`, row y
detail como composición app-local. Los contexts globales conservan alertas; los packages legacy
conservan botones/clases y loading. No se desplazan componentes Client a Dashboard ni se convierte
una necesidad de página en API global.

El primer grupo coherente futuro es **rectificación Slice A de primitives de directorio
Dashboard-local**: `DirectoryFilters`, `DirectorySummary`, `DirectoryList` y row/Overview mínimos,
junto con los botones nativos ya inseparables de retry/load-more/back. No es un cambio de este corte
y no incluye CTA Invite, formularios, dialogs, alertas ni lifecycle.

## Riesgos, deuda y siguiente corte

1. El contrato Users v1 sigue `PLANNED` para backend/frontend; antes de código hay que fijar lectura,
   permisos, cursor, summary, stale selection y aislamiento tenant.
2. Los primitives actuales contienen V2/legacy fuera de alcance: filtros/status/KPI attention,
   active/inactive/locked y relaciones Requests.
3. La accesibilidad de estados inline requiere definir anuncios de carga inicial, error, empty,
   no-results, refresh, cursor y retorno de foco en mobile real.
4. La revisión visual manual del shell no valida por sí sola los estados y contenido de Directory.
5. La excepción de `prettier --check .` global por Markdown legacy Client sigue vigente; no se
   modifica aquí.

Siguiente corte recomendado: con contrato Slice A verificado, rectificar exclusivamente los cuatro
primitives Dashboard-local y el copy `All|Invitations`/summary mínimo, añadiendo tests de estados,
teclado, foco y aislamiento. No iniciar invitation ni mutaciones.

## Cambios y validación de este corte

No hay cambios de producción. Esta auditoría se valida con el contract test de Users, formato de los
documentos modificados y `git diff --check`; la CI remota del commit documental es la evidencia de
publicación. `prettier --check .` no se presenta como verde mientras existan los Markdown legacy
documentados fuera de alcance.
