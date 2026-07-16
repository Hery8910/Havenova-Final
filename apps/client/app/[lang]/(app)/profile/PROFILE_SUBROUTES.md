# Profile Secondary Routes

## Proposito

Registrar el estado real de las subrutas secundarias de `profile/*` para que `orders`,
`requests` y `notifications` no sigan mezcladas con la madurez del overview ni con la de
`settings`.

Documento relacionado:

- [PROFILE_AUDIT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/PROFILE_AUDIT.md:1)

## Estado actual

Estas subrutas cumplen hoy una sola función fiable:

- mantener activo el contrato de navegación del workspace privado
- exponer metadata y un surface mínimo sin inventar datos falsos
- dejar trazado explícito cuál es la siguiente fuente documental para su evolución

No deben considerarse páginas funcionalmente maduras.

## `profile/orders`

Ruta:

- [orders/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/orders/page.tsx:1)

Estado:

- placeholder explícito
- sin integración de datos reales
- sin tabla, filtros ni timeline

Regla:

- no reintroducir listas mock ni historiales inventados
- el siguiente paso válido es documentar el dominio de órdenes del cliente antes de diseñar UI

## `profile/requests`

Ruta:

- [requests/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/requests/page.tsx:1)

Estado:

- placeholder explícito
- el viejo scaffold con comments mock fue retirado
- la ruta permanece visible como deuda controlada

Regla:

- cualquier trabajo futuro debe empezar por baseline documental y contrato
- no volver a usar comentarios con sample data como punto de partida

## `profile/notifications`

Ruta:

- [notifications/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/notifications/page.tsx:1)

Estado:

- placeholder explícito
- metadata ya conectada
- la evolución real depende de [docs/notification-client-plan.md](/home/heriberto/Escritorio/Havenova/havenova/docs/notification-client-plan.md:1)

Regla:

- no construir UI del centro de notificaciones antes de cerrar el dominio compartido
- mantener la ruta pequeña hasta que existan tipos, servicios y utilidades estables

## Primitive local usada

Las tres subrutas convergen ahora en:

- [ProfileSubroutePlaceholder.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/ProfileSubroutePlaceholder.tsx:1)

Sentido de esta decisión:

- evitar tres placeholders divergentes
- mantener consistencia visual y semántica dentro del namespace
- impedir que el estado incompleto vuelva a ocultarse detrás de comments o markup mínimo sin contexto
