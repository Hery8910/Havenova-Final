# Users Directory — plan de cierre frontend

## Estado

El contrato V2 ya está integrado. Este documento ya no es un plan de migración
desde V1: sólo contiene el trabajo restante para cerrar la experiencia definida.

Fecha de actualización: `2026-07-10`.

Leer antes:

1. `README.md` — mapa y autoridad documental;
2. `PAGE_REQUIREMENTS.md` — requisitos normativos;
3. `USERS_DIRECTORY_GAP_ANALYSIS.md` — auditoría contra código real;
4. backend `tenant-users/FRONTEND_INTEGRATION.md` — contrato HTTP canónico.

## Decisiones cerradas

No rediseñar:

- directorio unificado `user | invitation`;
- `entryId` como selección estable;
- `summary / directory / detail` separados;
- filtros `all | active | inactive | invitations | attention`;
- cursor opaco y orden backend;
- razones de atención calculadas por backend;
- invitaciones persistidas y onboarding `tui_`;
- ausencia de fallbacks V1.

## Base implementada

- [x] tipos V2 compartidos;
- [x] BFF V2 de summary, directory, entry, invite, resend y revoke;
- [x] servicios V2;
- [x] summary remoto y KPIs clicables;
- [x] directory `user | invitation`;
- [x] cursor, acumulación y deduplicación por `entryId`;
- [x] búsqueda remota con 300 ms, mínimo 2 caracteres y cancelación de la primera página;
- [x] filtros canónicos;
- [x] URL state `selected`, `mode`, `search`, `status`;
- [x] detail por `entryId` para user e invitation;
- [x] panel invite real;
- [x] resend/revoke por `invitationId`;
- [x] onboarding público V2 para tokens `tui_`;
- [x] `workOrders=null` no se presenta como cero;
- [x] TypeScript sin errores.
- [x] rutas BFF V1 eliminadas;
- [x] contract test actualizado a `entryId`;
- [x] guard contra load-more de una query obsoleta.
- [x] códigos estables preservados para mutaciones de invitación;
- [x] feedback de invite, resend y revoke sin parsear mensajes de error.
- [x] cache local de páginas y cursor por búsqueda/filtro.

## Fase 1 — completada: limpiar residuos V1 y tests

### Objetivo

Que repositorio, tests y rutas expresen un único contrato.

### Resultado

- test actualizado con aserciones para `entryId`, endpoints V2 y protección de
  carga incremental;
- routes BFF V1 eliminadas;
- no quedan consumidores de servicios V1 de tenant users;
- load-more compara la query solicitada con la vigente antes de actualizar state.

## Fase 2 — en curso: conservar códigos de respuesta y errores

### Problema actual

Los servicios de mutación devuelven sólo `data.data`. Invite pierde la diferencia
entre `TENANT_USER_INVITED` y `TENANT_USER_INVITATION_RENEWED`. La UI recibe
errores como mensaje genérico y no puede aplicar las decisiones de dominio.

### Cambios

Completado:

1. Invite, resend y revoke exponen `{ code, data }`.
2. El servicio extrae únicamente códigos de dominio conocidos desde la respuesta Axios.
3. Invite distingue nueva invitación, renovación y los casos:
   - `TENANT_USER_ALREADY_EXISTS`;
   - `TENANT_USER_INVITATION_ALREADY_PENDING`;
   - `TENANT_USER_INVITATION_DELIVERY_FAILED`;
4. En delivery failure se refresca el directorio y no se repite invite.
5. El detalle recibe feedback visible tras invite o resend; resend/revoke ya no dejan promesas rechazadas sin feedback.
6. Resend/revoke bloquean doble submit y revoke requiere confirmación inline accesible.

Pendiente:

1. convertir los mensajes de already-exists/already-pending en acciones navegables si el diseño lo confirma;
2. completar manejo específico de `TENANT_USER_INVITATION_ACCEPTED` y `TENANT_USER_INVITATION_REVOKED` en acciones del panel.

### Criterio de salida

- ninguna decisión se toma parseando `message`;
- invite permanece recuperable tras conflicto/error;
- resend/revoke muestran pending, éxito y error accesible.

## Fase 3 — cache y restauración semántica

### Objetivo

Volver desde detail al mismo contexto de una lista larga.

### Estado mínimo

```text
selected=<entryId>
mode=detail|invite
search=<normalizedQ>
status=<filter>
```

### Cambios

Completado:

1. cache local de páginas, cursor y estado de fin por `search + status`;
2. reutilización inmediata de páginas cacheadas seguida de refresh de primera página;
3. invalidación completa tras invite, resend, revoke o delivery failure.
4. refs de rows por `entryId`, `scrollIntoView` y foco lógico cuando la row está disponible.
5. carga defensiva por cursor, limitada a ocho páginas, para una `selectedEntryId` no cacheada.

Pendiente:

1. Usar `scrollTop` sólo como apoyo si la validación manual revela diferencias
   entre navegadores o dispositivos.

### Criterio de salida

- cambiar filtro/búsqueda no mezcla cursores incompatibles;
- abrir y cerrar detail no pierde páginas;
- reload restaura los parámetros semánticos;
- retorno móvil vuelve a la row seleccionada.

## Fase 4 — completada: comportamiento mobile

Se implementó la primera opción sin crear un workflow paralelo:

- misma ruta con `mode=detail|invite` y sólo el panel activo visible en viewport móvil;
- botón de retorno sólo visible en móvil para detail;
- retorno con `mode=empty` que conserva `selected`, búsqueda, filtro y cache;
- scroll y foco lógico restaurados en la row seleccionada.

Pendiente únicamente validar el flujo en dispositivos reales y resolver la carga
defensiva de una selección no presente en cache.

## Fase 5 — completada: carga incremental final

- `IntersectionObserver` observa un sentinel próximo al final de la lista;
- cursor carga páginas automáticamente con margen previo de 240 px;
- un guard inmediato evita cargas duplicadas entre observer, fallback y restore;
- las respuestas incompatibles se ignoran por query key;
- `Load more` permanece como fallback accesible;
- loading more y end of results se anuncian de forma discreta.

## Fase 6 — i18n, detalle y accesibilidad

Completado:

1. summary con loading/error/retry propio y `—` en vez de cero falso;
2. labels y feedback de summary en el catálogo `pages.dashboard.usersDirectory.summary`;
3. filtros, filas, paneles, estados y razones de atención reciben copy tipado, sin literales de UI en los componentes compartidos.
4. catálogo completo `pages.dashboard.usersDirectory.copy` en `en`, `es` y `de`; el controlador lo consume según el locale activo, incluidos status y `attentionReasons` por código.

Pendiente:

1. decidir y documentar si se muestran `primaryAddress` y `businessActivityAt`;
2. revisar:
   - semántica de lista/selector;
   - `aria-live` de refresh y acciones;
   - foco al abrir/cerrar panel;
   - estado seleccionado;
   - navegación completa por teclado.

## Validación requerida

Automática:

```text
pnpm check:types
node tests/client-context/dashboard-directory-contracts.test.mjs
git diff --check
```

Añadir tests de comportamiento para:

- un carácter no hace request;
- dos caracteres hacen debounce y cancelan la request anterior;
- cambio de filtro descarta cursor;
- páginas se deduplican por `entryId`;
- invited/renewed producen feedback distinto;
- delivery failure no reintenta invite;
- revoke limpia selección;
- restore localiza la row seleccionada.

Validación manual con backend V2 desplegado:

1. summary y los tres accesos rápidos;
2. búsqueda por nombre, email y teléfono;
3. filtros `invitations` y `attention`;
4. varias páginas de cursor;
5. detail de user y invitation;
6. invite nuevo, renew expirado y conflictos;
7. resend y revoke;
8. onboarding completo desde token `tui_`;
9. mobile y restore al volver.

## Definition of Done

- [x] rutas y tests V1 eliminados/actualizados;
- [ ] mutaciones preservan y usan códigos estables;
- [ ] cache por query key y restore por `entryId`;
- [ ] experiencia móvil lista/detail cerrada;
- [x] decisión de `Load more` vs sentinel aplicada;
- [ ] copy i18n;
- [ ] feedback robusto para summary y acciones;
- [ ] checks automáticos pasan;
- [ ] flujo manual V2 validado en un entorno desplegado.
