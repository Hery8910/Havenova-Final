# People Users Directory — requisitos

## Autoridad

Este documento define el comportamiento esperado de `/people/users` en
frontend. El contrato de negocio/HTTP pertenece al backend V2 y se resume en
`USERS_DIRECTORY_BACKEND_DECISIONS.md`.

El cumplimiento actual no se infiere de este archivo. Consultar
`USERS_DIRECTORY_GAP_ANALYSIS.md`.

## Objetivo

Permitir que un admin del tenant encuentre, entienda y gestione cuentas de
cliente e invitaciones abiertas sin abandonar la superficie principal.

## Alcance

Incluye:

- cuentas `user` activas, inactivas, bloqueadas o no verificadas;
- invitaciones pending vigentes o expiradas;
- summary global;
- búsqueda y filtro server-side;
- detail discriminado por entry;
- invite, resend y revoke.

No incluye:

- admins, workers o managers;
- invitaciones accepted/revoked como rows;
- historial de auditoría;
- gestión operativa completa de service requests;
- orden manual o filtros avanzados.

## Contrato de datos obligatorio

Frontend debe consumir exclusivamente:

```text
GET  /api/home-services/dashboard/users/summary
GET  /api/home-services/dashboard/users/directory
GET  /api/home-services/dashboard/users/entries/:entryId
POST /api/home-services/dashboard/users/invite
POST /api/home-services/dashboard/users/invitations/:invitationId/resend
POST /api/home-services/dashboard/users/invitations/:invitationId/revoke
```

No debe consumir ni mantener fallback para:

```text
GET  /api/home-services/dashboard/users
GET  /api/home-services/dashboard/users/:userClientId
POST /api/home-services/dashboard/users/resend-invite
```

## Summary

Máximo tres KPIs globales:

- `Total users` → filtro `all`;
- `Pending invites` → filtro `invitations`;
- `Needs attention` → filtro `attention`.

Reglas:

- no calcular desde rows;
- conservar búsqueda al activar un KPI;
- no presentar un fallo/loading como valor real `0`;
- cada KPI interactivo es un botón con estado activo accesible.

## Búsqueda y filtros

- búsqueda por nombre, email o teléfono;
- debounce aproximado de 300 ms;
- no enviar `q` de un carácter;
- cancelar la primera request incompatible anterior;
- filtro único: `all | active | inactive | invitations | attention`;
- un cambio de búsqueda/filtro descarta cursor y páginas incompatibles;
- summary no cambia con búsqueda o filtro.

## Directorio

Cada row debe comunicar:

1. identidad o fallback `Pending profile`;
2. email;
3. un estado principal;
4. contexto operativo corto;
5. atención sólo cuando exista una razón backend.

Estado principal:

- user: `active | inactive | locked`;
- invitation: `pending | expired`.

No mostrar `unverified` como badge permanente salvo que produzca
`EMAIL_UNVERIFIED_STALE`. No generar atención por perfil, teléfono o requests
ausentes.

La única acción primaria de la row es seleccionar por `entryId`.

## Carga incremental

- bloques de 25 por defecto;
- cursor opaco;
- deduplicación por `entryId`;
- no pedir otra página durante una carga activa;
- distinguir initial loading, refreshing y loading more;
- mantener rows previas durante refresh válido;
- mostrar empty, no results, error/retry y end of results.

La carga principal usa infinite scroll con `IntersectionObserver`. El botón
`Load more` se conserva sólo como fallback accesible si el observer no está
disponible o no se activa por el contexto de navegación.

## Panel derecho

Modos explícitos:

### Modo `empty`

- orienta a seleccionar o invitar;
- no simula datos.

### Modo `detail`

- carga siempre `/entries/:entryId`;
- renderiza por `kind`;
- muestra identidad, acceso/invitación y relación comercial;
- `profile` puede ser `null`;
- `workOrders=null` significa dominio no integrado;
- sólo ofrece acciones presentes en `availableActions`.

### Modo `invite`

- formulario real dentro del panel;
- body `{ email, name, phone?, language }`;
- nunca envía `clientId`;
- permite volver sin perder lista, búsqueda o filtro;
- distingue invitación creada y renovada;
- decide conflictos por `code`, no por `message`.

## Mutaciones

Después de éxito:

- invalidar/actualizar summary y directory;
- refrescar detail cuando corresponda;
- seleccionar el `entryId` devuelto si el flujo lo requiere.

Casos obligatorios:

- `TENANT_USER_ALREADY_EXISTS`;
- `TENANT_USER_INVITATION_ALREADY_PENDING`;
- `TENANT_USER_INVITATION_DELIVERY_FAILED`;
- `TENANT_USER_INVITATION_ACCEPTED`;
- `TENANT_USER_INVITATION_REVOKED`.

Delivery failure no reintenta invite automáticamente. Resend y revoke necesitan
estado pending, bloqueo de duplicados y feedback de éxito/error.

## URL y restore

Estado mínimo:

```text
selected=<entryId>
mode=detail|invite
search=<term>
status=<filter>
```

La implementación final debe:

- cachear páginas por búsqueda/filtro;
- restaurar por `selectedEntryId`;
- ubicar la row con `scrollIntoView`;
- devolver foco lógico;
- cargar páginas adicionales con límite defensivo si la entry no está cacheada;
- usar `scrollTop` sólo como apoyo.

## Responsive

Desktop:

- directorio y panel simultáneos;
- scroll independiente;
- selección estable.

Mobile:

- lista y detail se comportan como vistas distinguibles;
- abrir detail no pierde query state;
- volver restaura la row seleccionada, carga acumulada y foco.

Apilar ambos paneles verticalmente no cumple por sí solo el cierre mobile.

## Accesibilidad e i18n

- un solo `h1` provisto por el shell;
- labels visibles en filtros;
- navegación completa por teclado;
- foco visible;
- estado seleccionado semántico;
- loading/error/resultado de acciones anunciado sin ruido;
- estado nunca comunicado sólo por color;
- todo el copy visible, los estados y las razones de atención se resuelven por locale mediante `pages.dashboard.usersDirectory`; los componentes sólo reciben copy tipado.

## Separación técnica

- `page.tsx`: entrada server-first y parseo inicial;
- controlador local: fetch, cache, URL y acciones;
- vistas: presentacionales, sin fetch;
- servicios: transporte y preservación de códigos;
- tipos compartidos: contrato canónico;
- lógica de dominio: backend, nunca duplicada en UI.

## Criterios de aprobación

1. sólo existe integración V2;
2. summary, filtros y rows son coherentes con backend;
3. user e invitation funcionan de extremo a extremo;
4. errores de invitación se resuelven por código;
5. lista larga y retorno mobile preservan contexto;
6. todos los estados visuales tienen feedback accesible;
7. copy está internacionalizado;
8. TypeScript, contract tests y tests de interacción pasan;
9. el flujo se valida manualmente contra backend V2 desplegado.
