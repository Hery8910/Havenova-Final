# Auditoría de convergencia — Users v1

## Users Directory structural visual convergence — 2026-07-19

Este corte conserva el alcance read-only de Slice A y usa la captura vigente de Product Design
como referencia visual y estructural, no como ampliación funcional. El diagnóstico del Dashboard
mostraba una composición de dos cards equivalentes, summary apilado y sobredimensionado, controles
visualmente aislados, filas con aspecto de card y un detalle sin jerarquía suficiente: el resultado
desperdiciaba altura y diluía el directorio como superficie principal. En tablet, la proporción de
las columnas además favorecía incorrectamente el inspector; en mobile se debía conservar el patrón
de destinos separados existente.

La rectificación usa únicamente primitives Dashboard-local: `MasterDetailPage`, summary, filtros,
lista/row y panel read-only. Desktop pasa a priorizar directorio e inspector en proporción 3:2;
el inspector mantiene una superficie delimitada y scroll propio, mientras el directorio queda como
workspace continuo. El summary se compacta en dos métricas, búsqueda y selector forman una sola
franja de controles, las filas usan separadores y selección persistente, y el detalle separa
Identity, Profile e invitación mediante jerarquía tipográfica y divisores. Los estilos usan tokens
operacionales scoped y conservan contraste/foco visible en light y dark.

Se preservan exactamente summary read-only, búsqueda, filtros All/Invitations, cursor/load-more,
estados inline, selección, detalle mínimo, control de respuestas obsoletas y retorno/restauración de
foco mobile. No se introducen CTA Invite, tabs, Active/Needs attention, Requests, Activity, Notes,
Edit, acciones lifecycle ni cambios de BFF/DTO. El contenido visible del prototipo sigue sin crear
autoridad: Slice B/C/D, contrato de integración y MVP completo permanecen bloqueados o pendientes
de Product Design.

## Estado, propósito y alcance

### Composición read-only de detalle — 2026-07-17

Se implementó el corte autorizado `Users Directory read-only detail and Product Design composition`.
Product Design `DOMAIN`, `FLOWS`, `STATES_AND_ACTIONS`, `PRODUCT_NOTES` y `HANDOFF` (`CURRENT`)
autorizan Directory/Overview mínimo y el patrón responsive; `INTEGRATION_CONTRACT`,
`IMPLEMENTATION_PLAN` y `VALIDATION_CHECKLIST` siguen `PLANNED`. El prototipo se trató sólo como
evidencia visual, no como requisito.

El backend read-only confirma `GET /entries/:entryId` protegido por sesión, tenant `homeServices` y
rol admin; resuelve `{ clientId, entryId }`, por lo que una entrada inexistente o ajena devuelve
`TENANT_USER_DIRECTORY_ENTRY_NOT_FOUND`. El DTO discrimina `user | invitation`: identity contiene
nombre/email/teléfono opcional; para user, `profile.exists` representa la existencia real de
`UserClientProfile`, y locale/dirección principal pueden ser nulos; para invitation `profile=null`
y su identidad es propuesta. Pending/expired y expiración se exponen; locale propuesto no se expone
en el DTO actual y no se amplió backend.

El panel anterior no renderizaba `detail.profile`; por eso el Profile aparentemente vacío era una
omisión de presentación frontend, no prueba de ausencia real del registro autenticado. El nuevo panel
distingue `exists=false`, Profile existente con campos nulos y valores disponibles sin inventar datos.
La observación de ese registro concreto queda pendiente de respuesta autenticada representativa.

La composición conserva directorio/scroll a la izquierda y detalle/scroll a la derecha, empty state
sin selección y en mobile el destino detail con Back accesible y retorno de foco existente. Fixtures
tipados cubren Profile completo, parcial y ausente, invitaciones pending/expired, opcionales y texto
largo. Pruebas conductuales cubren empty, estados de Profile/invitation, error/retry, ausencia de
secciones fuera de alcance y respuesta de detail obsoleta. No se introdujeron Account, Permissions,
Activity, Requests, Notes, status de cuenta ni mutaciones.

Clasificación: la infraestructura read-only de Slice A sigue `READY`; Users Directory completo queda
`PARTIALLY_READY`. La composición no puede convertirse en `IMPLEMENTATION_READY` o producto completo
mientras contrato y validación de Product Design sigan `PLANNED` y B–E sigan fuera del corte.

### Gate manual fallido y corrección pendiente de revalidación — 2026-07-17

La revisión autenticada de Slice A encontró una regresión `BLOCKED`: el input revertía el texto y
el filtro `Invitations` alternaba requests con `All`. El backend devolvía `200`; la causa fue un
loop frontend entre el efecto URL → estado local y el efecto estado local → URL de
`page.controller.tsx`. Por tanto, la evidencia visual anterior no es válida como cierre.

La rectificación elimina la sincronización inversa durante la sesión. `search/status` son la
autoridad local, inicializada desde la ruta, y la URL recibe sólo el valor local estabilizado. Se
añadieron tests de comportamiento con router/servicios mockeados y timers falsos para carácter
único, búsqueda de dos caracteres, All/Invitations, summary y respuestas tardías. La clasificación
posterior a la corrección fue `PARTIALLY_READY` hasta repetir la validación autenticada.

### Cierre de gate manual — 2026-07-17

Heriberto reinició el servidor y efectuó una recarga dura. Su resultado reportado es: valor escrito
estable; búsquedas y filtros emiten las peticiones esperadas; reset de filtros correcto; selección
correcta del único resultado disponible; y ausencia de alternancia o loop de requests. No hay
capturas ni escenarios adicionales atribuidos a Codex. Esta evidencia cierra la regresión de
sincronización circular.

- Estabilidad del texto, ausencia de rollback y comportamiento ante escritura rápida: aceptados por
  el propietario.
- Umbral de un carácter, búsqueda desde dos caracteres y borrado: aceptados dentro de la revisión
  de búsquedas.
- Transición `All → Invitations`, `Invitations → All` y selección desde summary: aceptadas dentro
  de la revisión de filtros.
- Cursor, deduplicación, requests obsoletos, load more, estados inline, aislamiento tenant y foco
  móvil conservan la evidencia automatizada previa; no se declara una nueva prueba manual de ellos.

La infraestructura read-only de Slice A queda `READY`: All/Invitations, búsqueda mínima,
sincronización local → URL, cursor, dedupe, cancelación, load more, estados inline y navegación
móvil del corte actual. Users Directory completo sigue `PARTIALLY_READY`: faltan la composición
definitiva lista+detalle de Product Design, detail read-only completo, Profile, datos representativos,
jerarquía visual y refinamiento responsive. Slice B y mutaciones permanecen fuera de alcance.

El siguiente corte, sin iniciarlo aquí, es `Users Directory read-only detail and Product Design
composition`: auditar Product Design y el DTO de detail, distinguir perfil inexistente/incompleto/
mapping, y componer lista izquierda + detalle derecho con empty state, identidad/Profile aprobados,
fixtures y retorno móvil/foco; sin ampliar backend ni añadir mutaciones.

- Estado: `ACTIVE` — primera tarea de la Fase 2; no autoriza implementación.
- Fecha: `2026-07-16`.
- Base frontend: `05926152c19aa5585d98fcc91875d784b0c77e86`.
- Backend verificado: `b25384eaadb55a5dfb5334babed97038247e5f10` (`2026-07-16`).
- Product Design: `main` en commit `b9c5a6c27ca5824199faca41a96f01c7705a8caf`
  (`2026-07-17`); documentos Users revisados el `2026-07-12`.

Esta auditoría confronta Users v1 — Assisted Customer Onboarding — con el producto, backend
y frontend observables. Es canónica para clasificar la evidencia de este repositorio, pero no
sustituye Product Design ni el contrato backend. No modifica UI, BFF, servicios, tipos, rutas,
tests, configuración ni dependencias.

Los estados usados son `AUTHORITATIVE_ALIGNED`, `IMPLEMENTED_EVIDENCE`,
`PARTIALLY_ALIGNED`, `STALE_OR_LEGACY`, `PRODUCT_BLOCKED`, `BACKEND_BLOCKED`,
`SOURCE_MISSING`, `OUT_OF_SCOPE` y `REMOVE_CANDIDATE`. Ninguno equivale a implementación
aprobada o a release-ready.

## Fuentes y jerarquía de autoridad

1. Product Design, [Maped Operations Product Design](https://github.com/Hery8910/Maped-Operations-Product-Design/tree/b9c5a6c27ca5824199faca41a96f01c7705a8caf),
   commit `b9c5a6c27ca5824199faca41a96f01c7705a8caf` (`main`, consultado el
   `2026-07-17`),
   `docs/02-domains/users/{DOMAIN,FLOWS,STATES_AND_ACTIONS,PRODUCT_NOTES,INTEGRATION_CONTRACT,IMPLEMENTATION_PLAN,VALIDATION_CHECKLIST,HANDOFF}.md`.
   `DOMAIN`, `FLOWS`, `STATES_AND_ACTIONS`, `PRODUCT_NOTES` y `HANDOFF` están
   `CURRENT`; el contrato, los slices y la validación están `PLANNED`. La fuente
   ya es reproducible, pero no convierte los contratos pendientes en aprobados.
2. Backend, repositorio lógico `Backend`, commit
   `b25384eaadb55a5dfb5334babed97038247e5f10`,
   `docs/product-context/users-v1-assisted-customer-onboarding.md` y
   `src/modules/home-services/tenant-users/{README,FRONTEND_INTEGRATION}.md`.
3. Normativa local: [matriz de autoridad](../../01-foundation/IMPLEMENTATION_AUTHORITY_MATRIX.md),
   [integración Product/backend/frontend](../../02-contracts/PRODUCT_AUTHORITY_AND_INTEGRATION.md),
   [arquitectura](../../../ARCHITECTURE.md) y
   [plan de migración](../../01-foundation/FRONTEND_MIGRATION_PLAN.md).
4. Código, tests y documentación histórica: sólo evidencia de implementación.

La divergencia principal ya está declarada por el backend: `FRONTEND_INTEGRATION.md` es un
handoff V2 `PENDING_RECTIFICATION`; Users v1 excluye estados genéricos, CRM y contenido de
Requests. Los documentos locales de Users fechados el 10 de julio no pueden promocionarse a
contrato vigente.

### Confirmación de Product Design versionado

La revisión `b9c5a6c` confirma la frontera usada en esta auditoría: Users v1 es onboarding
asistido, no CRM ni administración genérica; Directory sólo autoriza All/Invitations, búsqueda,
cursor, total de personas e invitaciones pendientes; y Overview sólo identidad/contacto relevante,
kind, lifecycle y acciones legítimas. También precisa que super admin comparte la capacidad como
excepción de soporte, phone y proposed service address son prefills opcionales, y el lifecycle debe
distinguir pending, delivery failed y expired (con renew-and-resend) de accepted/revoked, que no
permanecen como filas operativas duplicadas. Active/inactive, attention, Requests, Activity,
Communication, Notes, permisos worker, sorting y page-size quedan diferidos.

Por tanto, esta fuente cierra `SOURCE_MISSING` exclusivamente para la definición de producto. No
altera `PARTIALLY_ALIGNED` ni los bloqueos backend: `INTEGRATION_CONTRACT.md` sigue `PLANNED` y
requiere verificar autorización, proyección, resultados de entrega, ownership de propuestas,
confirmación explícita, cooldown/historial y readiness de Service Requests.

## Inventario de implementación observado

| Elemento             | Archivos y consumidor                                                            | Comportamiento/estado/acción                                                                       | Cobertura y dependencia                                          | Estado              |
| -------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------- |
| Entrada y URL        | dashboard `people/users/{page.tsx,page.copy.ts,[userClientId]/page.tsx}`         | Lee `selected`, `mode`, `search`, `status`; migra deep link `userClientId` a `user:<id>`.          | Contract test de fuente; adaptación legacy local.                | `PARTIALLY_ALIGNED` |
| Directorio           | `page.controller.tsx`, `UsersPageView.tsx`, `TenantUserDirectoryItem.tsx`        | GET same-origin directory, `q`, estado, cursor, límite 25, debounce, cache y dedupe por `entryId`. | `dashboard-directory-contracts.test.mjs`; sin prueba desplegada. | `PARTIALLY_ALIGNED` |
| Summary              | controlador y `packages/services/tenantUsers.ts`                                 | GET summary; KPIs All, Invitations y Attention; loading/error separados.                           | Contract test estructural.                                       | `PARTIALLY_ALIGNED` |
| Detail/Overview      | `UsersPageDetailRouter.tsx`, `TenantUserDetailPanel.tsx`                         | GET entry; identidad, perfil, relaciones, requests/work orders/citas y acciones.                   | Contract test estructural.                                       | `PARTIALLY_ALIGNED` |
| Invitación dashboard | `UsersInvitePanel.tsx`, controlador, service/BFF invite                          | POST email/name/phone/language; códigos V2 y refresh.                                              | Contract test estructural.                                       | `PARTIALLY_ALIGNED` |
| Lifecycle dashboard  | controlador y BFF resend/revoke                                                  | POST resend/revoke, bloquea duplicados y confirma revoke.                                          | Contract test estructural.                                       | `PARTIALLY_ALIGNED` |
| Aceptación pública   | client BFF `user-invitations/{resolve,accept}` y `InvitationSetPasswordPage.tsx` | Token `tui_`, resolve/accept junto con contraseña; no review/corrección/save de propuestas.        | `worker-invite-contracts.test.mjs` y contratos auth de fuente.   | `BACKEND_BLOCKED`   |
| Worker               | worker auth y `resend-invite`                                                    | Invitación worker separada; no consume Users de clientes.                                          | Contract tests worker.                                           | `OUT_OF_SCOPE`      |
| Prototipo/notas V2   | `users-directory-prototype(2)/*`, README, planes y decisiones locales            | HTML/CSS y textos declaran V2 cerrado; no los consume runtime.                                     | Sin prueba de comportamiento.                                    | `STALE_OR_LEGACY`   |

Los BFF son same-origin. El backend protege el dashboard con sesión, tenant `homeServices`,
rol admin y CSRF en mutaciones. Es evidencia técnica de aislamiento, no una prueba desplegada
de acceso cruzado rechazado.

## Matriz de capacidades

| Capacidad                          | Producto v1 / backend                                                    | Frontend observado                                     | Clasificación y decisión                                                               |
| ---------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| List tenant-scoped                 | Slice A; backend proyecta por tenant, cursor e IDs estables              | Directory V2 vía BFF, sin `clientId`                   | `PARTIALLY_ALIGNED`: conservar para rectificación contractual y prueba de aislamiento. |
| Cursor y búsqueda                  | Slice A; backend documenta cursor y `q`                                  | Cursor opaco, debounce y cache                         | `PARTIALLY_ALIGNED`: preservable; confirmar semántica y revisión de fuente.            |
| All e Invitations                  | Únicos filtros autorizados                                               | También active, inactive y attention                   | `PARTIALLY_ALIGNED`: futura superficie sólo All/Invitations.                           |
| Summary                            | Total people y pending invitations                                       | Tercer KPI Attention                                   | `PARTIALLY_ALIGNED`: conservar dos KPIs; attention queda fuera.                        |
| Selección/restore/responsive       | Incluidos, con retorno y foco                                            | URL, cache, foco y mobile focalizado                   | `IMPLEMENTED_EVIDENCE`: candidato a conservar tras validación UX.                      |
| Overview mínimo                    | Identidad/contacto, kind, lifecycle y acción legítima                    | Añade perfil, requests, work orders, citas y actividad | `PARTIALLY_ALIGNED`: limitar campos a contrato.                                        |
| Active/inactive/locked             | Exclusión explícita                                                      | Badges y filtro                                        | `OUT_OF_SCOPE`: no ampliar; preparar retirada de UX.                                   |
| Attention                          | Exclusión explícita                                                      | KPI, filtro y badges                                   | `OUT_OF_SCOPE`: no ampliar; candidato a retirar.                                       |
| Relaciones/Requests/activity       | Exclusión explícita                                                      | Row y detail los renderizan                            | `OUT_OF_SCOPE`: no integrar más dominios.                                              |
| Crear invitación                   | Slice B planificado; faltan locale, address, delivery e identidad global | Name/email/phone/language V2                           | `BACKEND_BLOCKED`: no implementar.                                                     |
| Resend/renew/revoke                | Slice D; faltan cooldown, delivery/audit e historia                      | Resend/revoke y confirmación local                     | `BACKEND_BLOCKED`: no ampliar; verificar aislado después.                              |
| Aceptación/confirmación            | Slice C; exige review/save/resume                                        | Sólo set-password/accept                               | `BACKEND_BLOCKED`: no presentar como onboarding completo.                              |
| Materialización Profile/UserClient | Sólo tras guardado explícito                                             | Backend auto-crea Profile desde propuesta si falta     | `BACKEND_BLOCKED`: contradicción crítica.                                              |
| Service-request readiness          | Slice E; no existe contrato                                              | Sin consumo Users                                      | `BACKEND_BLOCKED`.                                                                     |
| Token/expiry/revoke                | Mecánica D disponible, reglas pendientes                                 | Sólo expone resend/revoke                              | `PARTIALLY_ALIGNED`: técnica verificable, no flujo listo.                              |

## Análisis por slice

### Rectificación implementada — Slice A (2026-07-17)

`IMPLEMENTED_EVIDENCE`. La superficie Dashboard usa únicamente los GET same-origin de summary,
directory y entry: tenant derivado de sesión, permiso dashboard, cursor ligado a filtro y búsqueda
de mínimo dos caracteres verificados en backend. La UI limita filtros a All/Invitations, resumen a
total people/pending invitations, y detalle a identidad/contacto/lifecycle. Conserva cancelación,
dedupe, cursor y restauración de foco móvil. No conecta POST invite/resend/revoke ni muestra
account status, attention, Requests, activity o relaciones.

La clasificación no pasa a `IMPLEMENTATION_READY`: Product Design sigue con
`INTEGRATION_CONTRACT.md` en `PLANNED`; la verificación es de capacidad técnica de lectura y no
desbloquea B-D.

### Slice A — Directorio y Overview

`PARTIALLY_ALIGNED`. Son preservables list/cursor/search/All/Invitations, selección con URL y
respuesta responsive. Falta prueba desplegada de aislamiento, cursor, permisos, error/stale
selection y origen/frescura de cada campo. Attention, active/inactive/locked, relación comercial
y datos de Requests contradicen la frontera v1. Product Design ya tiene revisión reproducible,
pero el contrato de lectura sigue `PLANNED`; por eso no alcanza `AUTHORITATIVE_ALIGNED` ni
`IMPLEMENTATION_READY`.

### Slice B — Invitación asistida

`BACKEND_BLOCKED`. La UI actual no distingue propuesta de dato confirmado ni contiene address
propuesta; el backend no cierra locale precedence, propuesta de address, delivery outcome
persistido/identificable ni identidad global existente. No iniciar cambios de formulario ni BFF.

### Slice C — Aceptación y onboarding

`BACKEND_BLOCKED`. La página pública acepta `tui_`, pero no ofrece review, corrección, explicit
save, elección para datos globales ni reanudación. El backend materializa Profile con datos de
invitación si falta; Product Design exige confirmación explícita y prohíbe sobrescritura
silenciosa. Tampoco existe readiness derivado ni contrato de Service Requests.

### Slice D — Lifecycle técnico

`PARTIALLY_ALIGNED`. Existen expiry, rotación/invalidez de token, lease de aceptación y revoke.
Faltan cooldown/rate-limit observable, delivery persistido, auditoría, CSRF verificado en
despliegue y regla de historial accepted/revoked. Puede verificarse por separado; no desbloquea
B/C.

## Contradicciones principales

1. `README.md`, `PAGE_REQUIREMENTS.md`, `USERS_DIRECTORY_GAP_ANALYSIS.md`,
   `USERS_DIRECTORY_FRONTEND_IMPLEMENTATION_PLAN.md`, `USERS_DIRECTORY_BACKEND_DECISIONS.md` y
   `USERS_DIRECTORY_BACKEND_PACKAGE.md` describen V2 cerrado o normativo: son
   `STALE_OR_LEGACY`/evidencia hasta tener referencias versionadas.
2. Active/inactive/attention, relationship summary, Requests, work orders, citas y actividad
   están expuestos en frontend/backend V2, pero excluidos de Users v1.
3. V2 presenta onboarding terminado tras set-password; backend evidencia materialización
   prematura de Profile y ausencia de confirmation/resume.
4. Los tests Users inspeccionan fuentes/rutas; no validan aislamiento tenant, lifecycle real,
   concurrencia, confirmación ni accesibilidad en backend desplegado.
5. Referencias locales históricas incluyen rutas locales externas y no son reproducibles.

## Código preservable, bloqueado y candidatos

| Grupo                     | Decisión                                                                                                                                            |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Preservar como evidencia  | BFF same-origin, tipos/service directory, cursor opaco, dedupe/cache, URL state, retorno mobile/foco, master-detail y confirmación local de revoke. |
| Rectificar tras contrato  | Copy, Overview y KPIs mínimos, All/Invitations, stale/error y pruebas de integración/aislamiento.                                                   |
| Bloqueado                 | Assisted invite, address propuesta, locale, aceptación/review/save, mapping Profile/UserClient, resume y readiness.                                 |
| `REMOVE_CANDIDATE` futuro | Attention, active/inactive/locked como UX Users, Requests/work orders/citas/activity y prototipo HTML/CSS. No eliminar aquí.                        |

## Riesgos y preguntas abiertas

- Contratar refresco/reconciliación de la proyección eventualmente consistente después de mutar.
- Probar autorización cruzada, CSRF y denegación sin datos parciales en despliegue.
- Decidir identidad global existente, ownership propuesta/confirmado, conflictos y resume.
- Service Requests debe poseer requisitos, readiness derivado y el único hard gate.
- Definir historial accepted/revoked, audit y cooldown de lifecycle.

## Primer slice implementable y criterios de entrada

El primer candidato es **Slice A — rectificación mínima de Directory y Overview**, no una nueva
feature: list/cursor/search/All/Invitations, selección, contexto responsive y Overview limitado.
No incluye invitation ni mutaciones.

No puede iniciarse hasta: (1) fijar la compatibilidad backend desde `b25384e`, permisos,
summary/cursor y stale selection contra la definición Product Design versionada; (2) decidir qué
UI V2 ocultar/retirar; (3) añadir pruebas de tenant correcto/rechazo cruzado, estados de lista y
restore/foco; y (4) validar tres locales, teclado, temas y contenido largo contra backend
desplegado.

## Acciones que no deben iniciarse todavía

- No implementar B, C, D o E ni modificar endpoints, BFF o DTOs.
- No añadir address, perfil, readiness, CTA onboarding, notes, activity, CRM, Requests o permisos worker.
- No reparar el formulario/filtros para hacerlos parecer aprobados ni eliminar candidatos/prototipo.
- No actualizar dependencias, seguridad #11–#15, workflows ni entorno.
- No declarar Users v1, Fase 2 o Havenova release-ready; `SEC-EXC-001` sigue bloqueando release.
