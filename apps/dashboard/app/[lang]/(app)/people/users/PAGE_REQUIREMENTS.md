# People Users Directory — Slice A y detalle read-only

## Estado y autoridad

La infraestructura read-only de Slice A está `READY`; Users Directory como experiencia completa sigue
`PARTIALLY_READY`. Ninguno sustituye el contrato de producto: la autoridad sigue siendo Product Design Users v1;
su contrato de integración está `PLANNED`. Este documento describe únicamente la superficie de
lectura implementada y no habilita Invitation (B), Acceptance (C) ni Lifecycle (D).

## Contrato técnico verificado

El Dashboard consume same-origin únicamente:

```text
GET /api/home-services/dashboard/users/summary
GET /api/home-services/dashboard/users/directory
GET /api/home-services/dashboard/users/entries/:entryId
```

El backend aplica sesión, client `homeServices` y rol admin. El tenant se deriva de sesión: nunca
se acepta `clientId` desde la UI. `q` se normaliza y requiere 2-100 caracteres; `limit` es 1-50;
el cursor es opaco y está ligado a `q/status`. Un 403, error de validación o cursor inválido se
presenta como error, no como directorio vacío.

## Alcance

- summary honesto: total people y pending invitations, sin derivarlo de la página cargada;
- búsqueda backend por los campos admitidos, con debounce y sin emitir búsquedas de un carácter;
- filtros exclusivos `all | invitations`;
- páginas de 25, dedupe por `entryId`, cancelación de request incompatible y protección contra
  respuesta cursor obsoleta;
- row y overview: identidad, email, teléfono si existe y lifecycle de una invitación;
- composición estable de directorio a la izquierda y panel read-only a la derecha; sin selección,
  el panel muestra un empty state;
- para una persona, `profile.exists=false` se comunica como Profile todavía no creado; si existe,
  idioma y dirección principal se muestran sólo cuando el endpoint los entrega;
- para una invitación, identidad propuesta, teléfono opcional, estado pending/expired y expiración.
  La propuesta se etiqueta explícitamente y no se presenta como Profile confirmado;
- carga inicial, refresh, empty, no-results, error/retry, cursor/load-more y fin de resultados;
- master-detail responsive, retorno mobile y foco lógico de la row seleccionada.

## Exclusiones obligatorias

- ningún POST, CTA Invite, resend, revoke ni confirmación destructiva;
- no active/inactive/locked, attention, Requests, activity, relationships, work orders, notas o
  comunicación;
- no total calculado desde una página parcial ni simulación de Invitations;
- no ruta browser-direct al backend ni parámetro tenant controlado por usuario.

## Validación

`tests/client-context/dashboard-directory-contracts.test.mjs` protege alcance read-only, filtros,
stale cursor, foco y estados inline. `tenant-user-detail-panel.test.jsx` usa fixtures tipados de
persona con Profile completo, parcial y ausente, e invitaciones pending/expired; el controlador
cubre además una respuesta de detail obsoleta. Quedan requeridos smoke manual contra backend y CI
remota; el estado no se eleva a `IMPLEMENTATION_READY` hasta que Product Design cierre su contrato.

## Incidente de ownership de query — 2026-07-17

La primera revisión autenticada falló: el texto de búsqueda se borraba y `Invitations` alternaba
requests con `All`. La causa no fue el backend: el controlador copiaba `routeSearchState` hacia
`search/status` tras cada interacción, mientras otro efecto escribía esos mismos estados a la URL.
Los tests de fuente anteriores no ejecutaban esa competencia.

La corrección deja `search` y `status` como autoridad local de la sesión: se inicializan desde la
ruta y sólo se sincronizan en dirección estado local → URL. Las respuestas de una consulta abortada
o superada ya no pueden aplicar su página. Los tests de comportamiento montan el controlador con
timers falsos y cubren: un carácter sin request, búsqueda de dos caracteres con una única consulta,
All/Invitations desde select y summary, y respuesta tardía ignorada.

La revisión autenticada posterior del propietario, tras reiniciar el servidor y hacer recarga dura,
cerró esta regresión: reportó valor escrito estable, peticiones esperadas de filtros y búsquedas,
reset correcto de filtros, selección correcta del único resultado disponible y ausencia del loop.
No se aportaron capturas ni se atribuyen estas comprobaciones a Codex. La infraestructura Slice A
queda `READY`; la página completa permanece `PARTIALLY_READY` por el alcance de detalle pendiente.

## Detalle read-only y composición — 2026-07-17

Product Design autoriza Directory + Overview, no un dump de Profile: `DOMAIN.md`, `FLOWS.md`,
`STATES_AND_ACTIONS.md`, `PRODUCT_NOTES.md` y `HANDOFF.md` restringen el corte a identidad,
contacto relevante, kind/lifecycle y contexto responsive. El prototipo sigue siendo evidencia menor.
`INTEGRATION_CONTRACT.md`, `IMPLEMENTATION_PLAN.md` y `VALIDATION_CHECKLIST.md` permanecen
`PLANNED`, por lo que esta composición no declara todo Users v1 terminado.

El endpoint `GET /entries/:entryId` usa el discriminador `user | invitation`, deriva tenant de la
sesión y devuelve `404 TENANT_USER_DIRECTORY_ENTRY_NOT_FOUND` también ante una entrada ajena. Para
un `user`, `profile.exists` proviene de la existencia real de `UserClientProfile`; locale y dirección
principal son opcionales. Para una `invitation`, `profile` es `null` y la identidad es propuesta;
el DTO actual no expone locale propuesto. No se amplió backend para rellenar esa ausencia.

La pantalla anterior no mostraba ningún campo `detail.profile`, aunque el DTO ya los exponía: el
Profile aparentemente vacío era una omisión de mapping/presentación frontend (caso 4), no evidencia
de que el único registro autenticado carezca de Profile. El nuevo panel separa los casos
`exists=false`, Profile existente con campos faltantes y valores disponibles. Determinar el estado
real de ese registro concreto requiere observar su respuesta autenticada; no se inventa aquí.

Desktop/tablet preserva lista y detalle con scroll interno independiente. En mobile el
`MasterDetailPage` existente muestra el detalle como destino, ofrece Back con nombre accesible y el
controlador conserva búsqueda, filtro, cursor, selección y restaura foco a la fila. No se cambiaron
shell, navegación, filtros, auth ni mutaciones.

## Siguiente corte

No iniciar automáticamente un corte posterior. Siguen pendientes Slice B y cualquier mutación,
validación con datos representativos autenticados, Profile/aceptación de Slice C y los contratos
`PLANNED` de integración.
