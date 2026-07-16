# Users Directory — auditoría de dominio e implementación

## Estado del documento

Auditoría realizada el `2026-07-10` contra:

- la documentación canónica V2 del backend;
- la implementación backend del módulo `tenant-users`;
- los tipos, servicios y BFF routes del frontend;
- la implementación actual de `/people/users`;
- los contract tests locales.

Este documento sustituye el gap analysis anterior, que comparaba la página V1 con
un backend V2 todavía no integrado. Ya no debe afirmarse que el frontend consume
`TenantUserListItem`, `page/limit` o un summary calculado desde rows.

## Veredicto

La implementación actual corresponde con el núcleo del dominio V2. El contrato
de datos ya está integrado de extremo a extremo y no necesita un rediseño:

- `summary`, `directory` y `detail` están separados;
- el directorio combina `user | invitation`;
- `entryId` es la identidad de selección;
- la paginación usa cursor opaco;
- filtros, estados y `attentionReasons` coinciden con backend;
- invite, resend, revoke y onboarding público usan las rutas V2.

La funcionalidad todavía no cumple todo el cierre UX definido. La deuda está en
orquestación, recuperación de contexto, tratamiento de errores y validación, no
en el modelo de dominio.

## Matriz de cumplimiento

| Área | Estado | Evidencia actual | Trabajo pendiente |
|---|---|---|---|
| Tipos V2 | Cumple | `packages/types/tenantUsers.ts` modela summary, entries, detail, acciones y códigos canónicos | Mantenerlos sincronizados con backend |
| BFF dashboard | Cumple | Sólo existen routes para `/summary`, `/directory`, `/entries/:entryId`, invite, resend y revoke | Ninguna |
| Summary | Cumple | Se consulta `/summary`; los KPIs no se calculan desde rows, son filtros clicables y distinguen loading/error de un valor real `0` | Validación manual contra backend desplegado |
| Directorio unificado | Cumple | Rows discriminadas por `kind=user|invitation` | Ningún cambio de contrato |
| Filtros | Cumple | `all|active|inactive|invitations|attention` | Validación visual/manual |
| Búsqueda | Cumple parcialmente | Debounce de 300 ms, umbral de 2 caracteres, server-side y `AbortSignal` en primera página | Mostrar ayuda para 1 carácter; un error de refresh hoy vacía las rows previas |
| Cursor y deduplicación | Cumple | Acumula páginas, usa cursor, deduplica por `entryId`, ignora respuestas obsoletas y carga mediante sentinel `IntersectionObserver` | Validación manual de scroll interno en navegador real |
| Detail por entry | Cumple contrato | Consulta `/entries/:entryId` y renderiza user/invitation | Renderizar dirección y actividad si se consideran parte del detalle final; revisar feedback de acciones |
| Invite | Cumple parcialmente | Formulario real, payload estricto sin `clientId`, éxito por código y conflictos `ALREADY_EXISTS`, `ALREADY_PENDING` y `DELIVERY_FAILED` resueltos sin parsear mensajes | Convertir las orientaciones de conflicto en acciones navegables si el diseño lo requiere |
| Resend/revoke | Cumple | Usa `invitationId`, refresca summary/list/detail, muestra feedback, bloquea doble submit y exige confirmación inline antes de revoke | Validación manual del flujo contra backend desplegado |
| Onboarding `tui_` | Cumple | Resolve/accept usan las rutas públicas V2 y el flujo compartido de set-password | Validación end-to-end en entorno desplegado |
| URL state | Cumple | Conserva `selected`, `mode`, `search`, `status`; migra `userClientId` legacy a `entryId`, cachea páginas y busca hasta ocho cursores una selección ausente | Validación manual de deep links profundos |
| Mobile | Cumple | La misma ruta muestra detail/invite como vista enfocada; volver conserva selección, cache, scroll y foco, incluso tras carga defensiva acotada | Validación manual responsive |
| i18n | Cumple | Summary, filtros, filas, paneles, estados y razones de atención proceden del catálogo `pages.dashboard.usersDirectory` por locale | Validación visual de longitudes en los tres idiomas |
| Accesibilidad | Parcial | Labels visibles, botones reales, foco CSS y `aria-current` | Revisar semántica de colección, anuncios de estados, foco tras navegación y restore |
| Validación automatizada | Parcial | `pnpm check:types` y `dashboard-directory-contracts.test.mjs` pasan | Añadir pruebas de interacción y validar el flujo en un entorno desplegado |

## Correspondencia exacta con el dominio

### Identidad

Correcto:

- la URL y la selección principal usan `entryId`;
- `userClientId` sólo se conserva en el DTO y como compatibilidad de deep link;
- frontend trata cursor y `entryId` como strings opacos al consumirlos.

La construcción `user:<legacyUserClientId>` sólo aparece en el adaptador local
de una URL antigua y en la ruta legacy. No debe generalizarse como parsing del
contrato V2.

### Estado y atención

Correcto:

- cuenta: `active | inactive | locked`;
- verificación separada: `verified | unverified`;
- invitación: `pending | expired`;
- razones: `INVITATION_EXPIRED`, `EMAIL_UNVERIFIED_STALE`, `ACCOUNT_LOCKED`;
- `workOrders=null` se presenta como dominio no disponible, no como cero.

Frontend sólo traduce códigos. No calcula reglas de atención ni mezcla
verificación con el estado principal.

### Summary y filtros

Correcto:

- `totalUsers` activa `all`;
- `pendingInvites` activa `invitations`;
- `needsAttention` activa `attention`;
- la búsqueda se conserva al cambiar el filtro mediante KPI;
- summary es global e independiente de la consulta del directorio.

### Invitaciones

El transporte y los payloads son correctos. La desviación está en que
`packages/services/tenantUsers.ts` devuelve sólo `data.data`, descartando el
`code` HTTP de éxito. Por eso la UI no puede distinguir una invitación nueva de
una renovación expirada, aunque el tipo de response sí declara ambos códigos.

La capa de error actual también reduce cualquier fallo a `Error.message`. El
contrato exige decisiones por `code`; no debe hacerse parsing de mensajes.

## Deuda de implementación priorizada

### P0 — completado

- contract test actualizado a `initialSelectedEntryId` y `entryId`;
- BFF V1 eliminado;
- guard de query aplicado a load-more para ignorar resultados obsoletos.

El siguiente cambio de prioridad es preservar `code` en resultados/errores de
invite y manejar los códigos estables sin interpretar `message`.

### P1 — cierre funcional

1. Feedback robusto y estados pending para invite/resend/revoke; el éxito de
   invite debe seguir visible después de navegar automáticamente a detail.

### P2 — calidad de superficie

1. i18n del copy y de las razones de atención.
2. Estado propio de summary loading/error.
3. Completar la presentación de `primaryAddress` y `businessActivityAt` si el
   diseño final los mantiene.
4. Tests de interacción para búsqueda, cursor, acciones y restore.

## Fuera de alcance

No deben reabrirse durante estos trabajos:

- reglas de `Needs attention`;
- forma de `entryId`;
- filtros principales;
- separación cuenta/invitación;
- semántica de `inactive`;
- orden `businessActivityAt DESC, entryId DESC`;
- `workOrders=null` durante el MVP;
- endpoints V2 y ausencia de compatibilidad V1.

## Validación ejecutada en esta auditoría

- `pnpm check:types`: pasa.
- `node tests/client-context/dashboard-directory-contracts.test.mjs`: pasa 7/7.

No se ejecutó una prueba manual contra un backend desplegado. La disponibilidad
por entorno sigue dependiendo del despliegue del repositorio backend.
