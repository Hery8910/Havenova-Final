# Dashboard People Directory Backend Standard

## Objetivo

Definir el patron reusable de backend para superficies `people` del dashboard que funcionan como:

- summary superior;
- filtros simples;
- directorio seleccionable;
- panel derecho por modos;
- búsqueda remota;
- carga incremental;
- restauración de contexto.

Este documento no describe solo `users`.
Describe la base que deben poder reutilizar:

- `/people/users`
- `/team/admins`
- `/team/workers`
- `/network/managers`

## Relación Con Otros Documentos

Este estándar complementa:

- [DASHBOARD_DIRECTORY_PAGE_STANDARD.md](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/docs/DASHBOARD_DIRECTORY_PAGE_STANDARD.md:1)
- [DASHBOARD_PEOPLE_DOMAIN.md](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/docs/DASHBOARD_PEOPLE_DOMAIN.md:1)

Regla:

- `DASHBOARD_DIRECTORY_PAGE_STANDARD.md` fija el patrón de página;
- `DASHBOARD_PEOPLE_DOMAIN.md` fija la familia funcional;
- este documento fija el contrato reusable esperado entre frontend y backend para esa familia.

## Principio Base

Las páginas `people` no deben consumir DTOs crudos de entidades técnicas.

Backend debe exponer contratos orientados a operación para soportar:

- resumen superior coherente;
- lista escaneable;
- filtros útiles;
- selección estable;
- navegación móvil con restore de contexto.

## Contrato Reusable De Cada Superficie `People`

Cada rama del dominio `people` debería poder ofrecer, con nombres adaptados al actor, estas tres piezas:

1. `summary endpoint`
2. `directory endpoint`
3. `detail endpoint`

Acciones opcionales según dominio:

- `invite`
- `resend-invite`
- `create`
- `update status`

## 1. Summary Endpoint

## Objetivo

Entregar hasta 3 métricas operativas listas para UI.

## Reglas

- no derivar métricas desde la página actual de la lista;
- no usar metadata técnica como `page`, `limit` o `loaded count`;
- compartir exactamente la misma lógica que usa el filtro y la lista.

## Forma Recomendada

La forma exacta puede variar por dominio, pero debe seguir este patrón:

```ts
interface PeopleDirectorySummaryDTO {
  total: number;
  pending: number;
  needsAttention: number;
}
```

`pending` puede cambiar de semántica según dominio:

- users: invitaciones pendientes;
- workers: onboarding pendiente;
- managers: activación pendiente;

La idea reusable es la estructura, no el label final.

## 2. Directory Endpoint

## Objetivo

Entregar la lista operativa ya normalizada para el bloque izquierdo.

## Reglas

- respuesta pensada para UI, no para reflejar tablas;
- soportar búsqueda remota;
- soportar filtro principal;
- soportar infinite scroll;
- soportar orden estable;
- soportar restauración semántica por `entryId`.

## Query Base Recomendada

```ts
interface PeopleDirectoryQuery {
  q?: string;
  status?: string;
  cursor?: string;
  limit?: number;
}
```

## Respuesta Base Recomendada

```ts
interface PeopleDirectoryResponseDTO<TEntry> {
  items: TEntry[];
  nextCursor: string | null;
  hasNextPage: boolean;
}
```

## 3. Detail Endpoint

## Objetivo

Resolver el panel derecho del item seleccionado sin obligar al frontend a reconstruir la entidad completa desde la row.

## Reglas

- el detalle puede ser más rico que la row;
- la row no debe depender de este endpoint para mostrarse;
- el directorio y el detalle pueden tener DTOs distintos;
- el `entryId` o el id operativo debe mapear de forma determinista al detalle.

## Contrato Reusable Del Item De Directorio

Cada actor puede tener payload propio, pero la estructura base debería conservar:

```ts
interface PeopleDirectoryEntryBaseDTO {
  entryId: string;
  kind: string;

  displayName: string | null;
  primaryEmail?: string | null;
  primaryPhone?: string | null;

  status: string;
  attentionReasons: string[];

  activityAt: string;
}
```

Campos de dominio pueden extenderla, por ejemplo:

- `requestSummary` en users;
- `assignedJobsSummary` en workers;
- `managedPropertiesSummary` en managers.

## Regla De `entryId`

`entryId` es obligatorio como identidad estable de la entrada seleccionable.

Debe:

- ser único dentro del directorio;
- mantenerse estable entre recargas;
- servir como referencia semántica para restore;
- no depender del índice visual de la lista.

## Regla De Orden

Cada directorio `people` debe definir un orden operativo principal.

Ese orden debe ser:

- útil para trabajo real;
- estable;
- compatible con cursor pagination.

Siempre debe existir un desempate estable.

Patrón recomendado:

```ts
primarySort DESC,
entryId DESC
```

## Regla De Cursor Pagination

Las superficies `people` con lista larga e infinite scroll deben preferir `cursor + limit` sobre `page + limit`.

## Motivo

La combinación:

- dataset dinámico;
- orden operativo;
- selección persistente;
- restore en móvil;
- carga incremental;

se resuelve mejor con cursor que con paginación por página.

## Regla

El cursor:

- representa la última posición entregada;
- debe tratarse como opaco para frontend;
- debe construirse con las claves del orden real.

## Regla De Búsqueda

La búsqueda en superficies `people` debe ser:

- server-side;
- reactiva;
- compatible con cancelación;
- respetuosa del filtro activo.

El backend debe tolerar:

- cambios rápidos de término;
- consultas incompletas;
- alto número de requests pequeños.

## Regla De Atención

Si un dominio expone `needs attention`, debe cerrar tres cosas juntas:

1. definición de negocio;
2. códigos estables de razón;
3. reutilización de esa definición en summary, filtro y rows.

Frontend no debe inventar estas reglas.

## Regla De Agregación

La row nunca debe exigir N+1 queries.

Toda metadata visible en el directorio debe venir ya preparada o resolverse en una estrategia backend equivalente.

Ejemplos:

- conteos;
- señales de actividad;
- próximo evento;
- última acción;
- razones de atención.

## Regla De Reutilización Entre Dominios

Lo reusable entre `users`, `admins`, `workers` y `managers` no es un payload idéntico.

Lo reusable es:

- separación `summary / directory / detail`;
- búsqueda server-side;
- `cursor + limit`;
- `entryId` estable;
- filtros deterministas;
- `attentionReasons` como códigos;
- orden operativo + desempate estable;
- DTOs orientados a operación y no al storage.

## Regla De Implementación

Antes de cerrar un backend para una nueva rama de `people`, validar:

1. si existe `summary` independiente;
2. si la lista soporta `cursor`;
3. si la row ya recibe metadata operativa sin N+1;
4. si el estado seleccionado puede restaurarse por `entryId`;
5. si los filtros responden a negocio real;
6. si el contrato mejora el patrón común y no introduce una excepción innecesaria.
