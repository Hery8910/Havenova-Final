# Auditoría de readiness frontend — Customers Directory and Overview

**Estado:** `CURRENT_AUDIT` — evidencia de implementación; no autoriza runtime.
**Fecha:** 2026-07-19
**Frontend auditado:** `audit/phase-2-users-convergence` en
`40416eb29845299bb4fa2adcb4c16c8c789dac4b`
**Autoridad Product Design:** `product/customers-mvp-definition` en
`2c4357103086d31dfedd20409a039d449683ca92`
**Evidencia backend:** `audit/customers-directory-readiness` en
`2f496fe854c68f6ab016ccf0d7d6463eb5dfb2b1`

## Alcance y método

Esta auditoría contrasta el frontend actual de `/people/users` con Customers,
no con el contrato V2 histórico de Tenant Users. No modifica rutas, BFF, tipos,
componentes, mocks, estilos ni comportamiento. Product Design y su commit son
normativos; el código, contratos locales V2 y tests son evidencia.

Se inspeccionaron la ruta/controlador de Users, directory, filas, detail,
servicios/tipos/BFF, `UsersInvitePanel`, mocks, tests y la migración del shell
operacional. El backend auditado confirma que su V2 tampoco cierra lifecycle,
Profile, cursor, Invitation ni summaries de Customers; una adaptación frontend
no puede suplir esas garantías.

## Clasificación de unidades

| Unidad | Estado | Evidencia reutilizable | Incompatibilidades / dependencia | Criterio verificable de cierre |
| --- | --- | --- | --- | --- |
| Full Customers Directory and Overview | **NOT_READY** | BFF same-origin, selección por referencia, cursor visual y master-detail. | Ruta/DTO/BFF V2, dos filtros, summaries clicables, row/detail y backend no satisfacen el contrato Customers. | Consumir un contrato Customers verificado; mostrar sólo poblaciones/campos/resultados aprobados y pasar pruebas de aislamiento, estados y responsive. |
| Customer read UI foundation | **PARTIALLY_READY** | `page.tsx`, `page.controller.tsx`, `MasterDetailPage`, `DirectoryList`, cache/dedupe, cancelación y foco de retorno. | Sin DTO autorizado de Customer; filtros/summary/cursor/estados no tienen semántica Customers; Overview infiere Profile. | Con DTO/read outcomes verificados, la UI diferencia ready/stale/partial/restricted/unavailable/unknown y usa tres filtros sin falsos vacíos. |
| Invitations entry point and right-panel form | **BLOCKED** | `UsersInvitePanel.tsx` prueba composición de formulario local; panel derecho y mobile focused detail son reutilizables como estructura. | Componente no tiene entrada activa; solicita teléfono; no hay contrato Customer Invitation/delivery/identidad global seguro; backend no modela `delivery_failed`/recovery. | Invitations y backend definen payload, outcomes, validación/feedback y reconciliación; CTA izquierdo abre el panel derecho, con test de foco/errores/conservación. |
| Dashboard-local reusable primitives | **PARTIALLY_READY** | `DashboardWorkspaceShell`, `MasterDetailPage`, `DirectoryFilters`, `DirectoryList`, `DirectorySummary`, botones nativos locales. | Shell desktop colapsado conserva deuda; Summary convierte cards en filtros; DirectoryList no modela unknown/restricted; rows son Users-V2 específicos. | Mantener ownership Dashboard-local, validar estados/accesibilidad y adaptar sólo al contrato Customers; no promoverlos a primitives globales. |

## Mapa de evidencia actual

| Superficie | Archivos / símbolos | Comportamiento observado | Evaluación Customers |
| --- | --- | --- | --- |
| Ruta y URL | `people/users/page.tsx`, `page.copy.ts` `USERS_PAGE_QUERY_KEYS`, `[userClientId]/page.tsx` | Ruta actual `/people/users`; preserva `selected`, `search`, `status` y redirige el deep-link legacy a `user:<id>`. | **ADAPTABLE** como continuidad/selección; la futura ruta `/people/customers` y migración siguen abiertas. No renombrar aquí. |
| Orquestación | `page.controller.tsx` `PeopleUsersPageController` | GET same-origin, debounce, abort, cache por query, dedupe, load-more y detalle directo por `entryId`. | **ADAPTABLE**; depende de cursor/query/selection Customers seguro. `DIRECTORY_LIMIT=25`, debounce y ocho páginas son detalles V2, no decisiones de producto. |
| BFF y service | `packages/services/tenantUsers.ts`; `app/api/.../dashboard/users/*` | Proxy same-origin y service V2 `summary/directory/entries`; cookies quedan en BFF. | **PARTIALLY_READY** como frontera, pero endpoints/tipos V2 no son contrato Customers. No modificar ni reutilizar por nombre. |
| Directory/filter | `UsersPageView.tsx`, `DirectoryFilters.tsx`, `page.copy.ts` | Sólo expone `all` e `invitations`; cada cambio reinicia query y borra selección. | **INCOMPATIBLE**: producto exige Customers predeterminado, Invitations y Action required; no `all`. El mecanismo de reemplazo sí es reutilizable. |
| Summary | `buildUsersSummary`, `DirectorySummary.tsx` | Total users y pending invites; cada tarjeta es botón y cambia `status`. Error usa em dash. | **INCOMPATIBLE**: faltan Customers/Profiles complete/Action required; cards deben ser informativas, no filtros; em dash no expresa outcome autorizado. |
| Row | `TenantUserDirectoryItem.tsx`; `packages/types/tenantUsers.ts` | Botón selectable con nombre, email y teléfono; tipo también transporta seguridad, verification, attention y actividad. | **INCOMPATIBLE**: teléfono no pertenece a row, y los tipos V2 permiten datos de seguridad/Requests no aprobados. Reutilizable: semántica button/selected/ref. |
| Overview/detail | `TenantUserDetailPanel.tsx` | Muestra email, teléfono, Profile language/primary address y deduce parcial si falta language/address; distingue propuesta Invitation. | **INCOMPATIBLE**: no prueba confirmación customer; teléfono/profile/address no tienen outcome/freshness autorizado; usa sólo primary address, no todas; incomplete se calcula con address. Reutilizable: detail loading/error/back/focused mobile y etiqueta proposed. |
| Estados UI | `DirectoryList.tsx`, controlador, `UsersPageDetailRouter.tsx` | loading, refresh, load-more, end, empty/no-results, error/retry y detail error. | **PARTIALLY_READY**: initial error se reduce a mensaje; un refresh fallido limpia páginas; no hay `unknown`, `restricted`, `unavailable`, `partial` autorizado ni invalid/expired cursor explícito. |
| Invitación | `UsersInvitePanel.tsx`, `InviteTenantUserPayload`, BFF V2 | Form email/name/phone/language existe pero `UsersPageMode` sólo es `empty|detail`; no hay CTA ni ruta activa hacia él. | **BLOCKED**: phone está prohibido como input de tenant admin; faltan datos/outcomes de Invitations y validación local por campo. |
| Shell / responsive | `MasterDetailPage.tsx`, CSS; `DashboardWorkspaceShell.tsx` | Dos columnas desktop/tablet; a <=767px muestra navigation o detail, Back actualiza URL y controlador restaura foco/posición. Shell móvil tiene drawer/focus trap. | **PARTIALLY_READY**: patrón correcto candidato; faltan validaciones Customers de tablet, labels largos, lectura de estados y desktop colapsado. |

## Contraste explícito con Product Design

1. El producto es **Customers**, una relación operacional tenant-scoped, no
   Users genérico. La ruta, copy, `TenantUser*` nombres y documentación V2 son
   evidencia legacy; no se deben renombrar ni convertir en semántica mediante
   un mapper visual.
2. `TenantUserDirectoryItem` muestra `phone`; los tipos y fixtures incorporan
   `accountStatus`, `verificationStatus`, `attentionReasons`, Requests y
   actividad. La nueva fila sólo puede usar la proyección minimizada autorizada.
3. `attention` no aparece en la UI actual rectificada, pero sigue en
   `TenantUsersDirectoryFilter`, tipos/servicio y BFF V2. No puede ser alias de
   **Action required**, que sólo cubre Invitations recuperables
   `delivery_failed|expired`.
4. `UsersInvitePanel` ilustra un formulario de panel, pero no la entrada
   requerida: falta CTA en la columna izquierda, modo right-panel activo y
   comportamiento de mobile/focus. No se debe reactivar sin contrato.
5. `TenantUserDetailPanel` representa `profile.exists` y falta de dirección como
   Profile incomplete. Product Design exige confirmación de nombre+locale,
   `unknown` cuando no puede probarse y nunca infiere confirmación porque la
   invitación haya creado un Profile.
6. `DirectorySummary` usa las cards como controles y `buildUsersSummary` usa
   dos contadores V2. Customers requiere cuatro summaries independientes y
   cards informativas; disponibilidad de un contador no decide lista ni cero.

## Seguridad, accesibilidad y consistencia

- La BFF same-origin y el detalle por `entryId` codificado son mecanismos
  preservables; el frontend no puede inferir autorización de cache, URL o row.
  Debe limpiar contenido/selección tras un outcome de autorización del nuevo
  contrato.
- Hoy el error se convierte en texto desde `Error.message` en el controlador.
  Los outcomes Customers necesitan códigos/resultados semánticos, especialmente
  forbidden/unknown/restricted/cursor-invalid, no copy técnico ni array vacío.
- `DirectoryList` tiene live region para carga/refresh y `role=alert` para
  error; sus estados empty/no-results no distinguen fuente unavailable ni query
  short de una clasificación desconocida. El error de refresh reemplaza páginas
  por vacío, lo que rompe el contexto autorizado retenible.
- Row es un `button`, la selección usa `aria-current`, y Back/restauración de
  foco tienen evidencia de tests. Faltan pruebas de teclado de lista/detail,
  foco tras cambio de filtro/query, detalle fuera de vista, estados de fuente y
  retorno móvil con el contrato Customers.
- El shell operativo está aislado bajo `data-ui-foundation="operational"` y su
  drawer móvil tiene foco atrapado; su revisión registrada mantiene el desktop
  colapsado parcialmente listo por foco, labels largos y breakpoint. No expandir
  primitives/globales para resolver la página.

## Tests y cobertura aprovechable

| Evidencia | Cubre | Gaps imprescindibles |
| --- | --- | --- |
| `tests/jest/components/people-users-page-controller.test.jsx` | debounce de dos caracteres, query estable, All/Invitations, respuesta tardía y detail stale | los tres filtros Customers, cursor mismatch/expiry, no-query versus no-results, unknown/unavailable/restricted, reset/reconciliación y mobile real |
| `tests/jest/components/tenant-user-detail-panel.test.jsx` | empty/detail/error/Back y propuesta Invitation | DTO autorizado, confirmación/completeness `complete|incomplete|unknown`, redacción de row/detail, todas las direcciones y estados block-level |
| `tests/client-context/dashboard-directory-contracts.test.mjs` | BFF read-only, dos filtros V2 rectificados, cache/focus y exclusión de mutaciones | es inspección de fuente; no valida contrato backend desplegado, tenant isolation, accesibilidad ni Customers |
| `tests/jest/components/dashboard-workspace-shell.test.jsx` y `dashboard-shell-header.test.jsx` | drawer, foco, scroll lock, host local e i18n theme | master-detail Customers en tablet/mobile, copy largo y desktop colapsado |

## Dependencias y archivos de un futuro corte

| Dependencia | Necesidad frontend | Owner | Archivos probablemente afectados después de autorización |
| --- | --- | --- | --- |
| Customers read contract | DTO minimizado, resultados/freshness, filtros, cursor y summary | Customers backend + Product Design | `packages/types/tenantUsers.ts`, `packages/services/tenantUsers.ts`, BFF y Users controller/copy/row/detail |
| Profile read authorization | confirmación, completeness, locale, teléfono/direcciones autorizadas | Profile + Customers backend | detail fixtures/tests y bloque Overview |
| Invitations | kind customer_access, delivery failure/recovery, create outcomes/reconciliation | Invitations + backend | form, controller mode, BFF/service/types and invitation detail tests |
| Route decision | transición `/people/users` → `/people/customers` | Product Design + frontend migration | route/page, shell nav and URL-state tests |
| Dashboard local primitives | state semantics y responsive/accessibility sin promoción global | Dashboard frontend | `Directory*`, `MasterDetailPage`, local CSS and interaction tests |

## Secuencia segura y criterios de cierre

1. **Esperar el mapping backend Customers:** no iniciar UI mientras Full slice y
   Customer read foundation del audit backend estén `NOT_READY`.
2. **Rectificar read UI como unidad separada:** tras DTO y outcomes aprobados,
   adaptar BFF/types/controller/row/detail y tests. Cierra sólo cuando no se
   exponga PII/seguridad/actividad extra, summaries sean independientes y todos
   los estados de lectura tengan significado verificable.
3. **Validar responsive y accesibilidad:** desktop/tablet/mobile, foco de
   selección/Back, teclado, tres idiomas y contenido largo. Cierra con pruebas
   conductuales más revisión autenticada, no sólo source tests.
4. **Abrir Invitations como unidad distinta:** sólo después del owner contract;
   CTA izquierdo, right-panel form, field errors, pending/success/conflict/
   delivery failure y reconciliación deben verificarse contra outcomes backend.

No se aprueba endpoint, ruta, tipo, copy, componente, primitive, cache,
estrategia de migración ni cambio runtime mediante esta auditoría.
