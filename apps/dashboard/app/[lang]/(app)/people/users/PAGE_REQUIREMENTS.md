# People Users Directory — Slice A implementado

## Estado y autoridad

`IMPLEMENTED_EVIDENCE`, no contrato de producto. La autoridad sigue siendo Product Design Users v1;
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
