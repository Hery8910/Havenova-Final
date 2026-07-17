# People Users Directory — Slice A implementado

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
stale cursor, foco y estados inline. Quedan requeridos smoke manual contra backend y CI remota; el
estado no se eleva a `IMPLEMENTATION_READY` hasta que Product Design cierre su contrato.

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

## Próximo corte autorizado

`Users Directory read-only detail and Product Design composition`: contrastar la composición actual
con Product Design, verificar el DTO read-only de detail y distinguir perfil inexistente, incompleto
o fallo de mapping. Debe implementar lista izquierda + detalle derecho, empty state, identidad y
Profile aprobados, fixtures representativos y retorno móvil/foco. No incluye mutaciones, Requests,
actividad, permisos, nuevos filtros ni cambios de backend/auth.
