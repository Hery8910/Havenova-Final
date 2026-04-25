# Notification Client Plan

## Objetivo

Implementar en el frontend cliente el dominio `notification` listo para consumo real del backend:

- tipos compartidos
- servicios HTTP
- utilidades de normalización y presentación
- estado local por superficie de UI
- soporte de navegación y rutas
- base lista para conectar componentes de UI del cliente

Queda fuera de este alcance:

- implementación visual de componentes del dashboard
- ajustes backend fuera del contrato ya documentado
- política operativa de retención en backend

## Fuente de contrato

Referencia principal:

- `/home/heriberto/Escritorio/Backend/havenova-backend/src/core/notification/README.md`

Puntos que el frontend debe asumir como contrato base:

- prefijo canónico: `/api/notifications`
- bell dedicado: `GET /api/notifications/bell`
- marcar vistos en bell: `POST /api/notifications/bell/seen`
- listado completo: `GET /api/notifications`
- contador unread: `GET /api/notifications/count/unread`
- marcar todos como leídos: `POST /api/notifications/read-all`
- marcar uno como leído: `POST /api/notifications/:notificationId/read`
- marcar uno como visto: `POST /api/notifications/:notificationId/seen`
- filtros soportados: `category`, `type`, `unreadOnly`, `importantOnly`, `entityType`, `entityId`

## Estado actual del repo

### Base reutilizable ya existente

El proyecto ya tiene un patrón claro para dominios del cliente:

- tipos en [`packages/types/contact/contactTypes.ts`](/home/heriberto/Escritorio/Havenova/havenova/packages/types/contact/contactTypes.ts:1)
- servicios en [`packages/services/contact/contactService.ts`](/home/heriberto/Escritorio/Havenova/havenova/packages/services/contact/contactService.ts:1)
- normalización y persistencia local en [`packages/services/profile/profileService.ts`](/home/heriberto/Escritorio/Havenova/havenova/packages/services/profile/profileService.ts:1)
- contexto cliente en [`packages/contexts/profile/ProfileContext.tsx`](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/profile/ProfileContext.tsx:1)

### Huecos detectados

- no existe todavía un dominio `notification` en `packages/types`
- no existe todavía un dominio `notification` en `packages/services`
- la página cliente de notificaciones es solo placeholder en [`apps/client/app/[lang]/(app)/profile/notifications/page.tsx`](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/notifications/page.tsx:1)

### Inconsistencias que conviene corregir dentro del mismo trabajo

- `ProfileNav` apunta a `/profile/notifications`, que coincide con la página real: [`packages/components/client/user/profile/profileNav/ProfileNav.tsx`](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileNav/ProfileNav.tsx:14)
- `UserNav` apunta a `/profile/notification`, ruta distinta y potencialmente rota: [`packages/components/client/user/profile/userNav/userNav.tsx`](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/userNav/userNav.tsx:55)
- `navbar.shared` también apunta a `/profile/notification`: [`packages/components/client/navbar/navbar.shared.ts`](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/navbar.shared.ts:117)

## Decisiones técnicas propuestas

### 1. Mantener `notification` fuera de `ProfileContext`

Aunque el perfil ya contiene `notificationPreferences`, el feed de notificaciones es otro dominio:

- tiene ciclo de vida propio
- necesita refresco independiente
- requiere acciones remotas frecuentes
- puede necesitar sincronización entre superficies en el futuro

Decisión:

- mantener preferencias en `ProfileContext`
- no crear `NotificationContext` por ahora
- resolver cada superficie con estado local y servicios reutilizables
- reevaluar un store compartido solo si bell, center y otras vistas empiezan a duplicar lógica o necesitar sincronización fuerte

### 2. Crear un contrato tipado completo y estable

Necesitamos cubrir al menos:

- catálogos: `category`, `priority`, `actor.kind`, `entityType`, `type`
- item completo
- item resumido para bell
- resumen unread
- filtros de query
- respuestas de lista y mutaciones

### 3. Centralizar normalización y utilidades del dominio

Necesitaremos utilidades para:

- normalizar respuestas opcionales del backend
- resolver destino de navegación (`action.url` o fallback al centro)
- detectar prioridad alta
- agrupar por fecha para el notification center
- calcular etiquetas relativas de tiempo en UI

### 4. Preparar componentes de datos pequeños y locales

Antes de extender la UI conviene encapsular solo la lógica necesaria por superficie:

- carga temprana del bell desde el navbar
- listado paginado del centro dentro de su página
- mutaciones controladas para `seen` y `read`
- utilidades compartidas solo cuando eviten duplicación real

## Alcance funcional del lado cliente

### Fase base obligatoria

- contrato de tipos
- servicios HTTP
- utilidades del dominio
- exports en paquetes raíz
- componentes contenedor con estado local
- integración inicial en la página `/profile/notifications`

### Fase UI cliente incluida

No vamos a construir dashboard, pero sí debemos dejar lista la base para componentes cliente:

- bell en navegación con hasta 5 elementos
- contenedor de page state para `profile/notifications`
- datos preparados para una lista agrupada por fecha
- acciones de `mark as read`, `mark as seen`, `mark all as read`
- soporte para filtros principales

### Fase dashboard diferida

Se posterga expresamente:

- bell/dashboard UI de operador
- notification center del dashboard
- widgets operativos de resumen admin

La capa compartida que creemos debe servir también para esos componentes futuros.

## Estructura objetivo

### Tipos

- `packages/types/notification/notificationTypes.ts`
- `packages/types/notification/index.ts`
- export en `packages/types/index.ts`

### Servicios

- `packages/services/notification/notificationService.ts`
- `packages/services/notification/index.ts`
- export en `packages/services/index.ts`

### Contexto / hooks

No se crearán en esta fase.

El estado se resolverá de forma local:

- navbar bell con estado local o contenedor dedicado
- página `profile/notifications` con estado local
- hooks específicos solo si un componente puntual los necesita

### Utilidades

Opciones según volumen real:

- `packages/utils/notifications/*`
- o utilidades internas junto a cada componente si el alcance se mantiene pequeño

### Integración cliente

- `packages/components/client/navbar/*`
- `apps/client/app/[lang]/(app)/profile/notifications/page.tsx`
- rutas y links que hoy usan `/profile/notification`

## Tareas por fases

### Fase 1. Contrato y catálogo

- definir enums/string unions del dominio
- definir interfaces para `NotificationActor`, `NotificationEntity`, `NotificationAction`
- definir `NotificationItem`
- definir `NotificationBellItem`
- definir `NotificationUnreadSummary`
- definir queries y respuestas paginadas
- documentar diferencias entre item completo y bell item

### Fase 2. Servicios HTTP

- implementar `getNotificationBell`
- implementar `listNotifications`
- implementar `getUnreadNotificationCount`
- implementar `markNotificationsBellSeen`
- implementar `markNotificationSeen`
- implementar `markNotificationRead`
- implementar `markAllNotificationsRead`
- unificar shape de respuestas y manejo de `ApiResponse`

### Fase 3. Utilidades

- helper para `getNotificationHref`
- helper para `isHighPriorityNotification`
- helper para agrupar por fecha
- helper para deduplicar ids enviados al endpoint de bell seen
- helper para actualización local de items por id si realmente aparece duplicación

### Fase 4. Bell en navegación

- crear componente puntual para bell del cliente
- cargar `GET /api/notifications/bell` temprano desde el navbar
- exponer visualmente contador unread y estado de prioridad alta
- mostrar hasta 5 items en dropdown
- soportar navegación por `action.url` o fallback al centro
- dejar preparado `POST /api/notifications/bell/seen` al abrir el dropdown

### Fase 5. Integración en cliente

- reemplazar placeholder de `/profile/notifications`
- montar page container con estado local
- soportar filtros `all`, `unread`, `important`
- dejar preparada agrupación por fecha
- definir estados vacíos y de carga

### Fase 6. Navegación y consistencia

- unificar `/profile/notifications` como ruta canónica
- corregir links de `UserNav`
- corregir links de `navbar.shared`
- revisar cualquier CTA generado desde `action.url` que apunte a rutas inconsistentes

### Fase 7. Calidad

- validar exports públicos
- revisar SSR/client boundaries
- verificar tipos estrictos
- añadir tests donde el repo ya tenga patrón razonable
- validar manejo de errores y estados parciales

## Riesgos y puntos a validar durante implementación

### Riesgos de contrato

- el README documenta shapes objetivo, pero conviene validar si todas las respuestas backend usan `id` o `_id`
- hay que confirmar si la lista completa vendrá paginada con `page`, `limit`, `total`, `hasMore` o una variante propia
- el endpoint `count/unread` puede solaparse con el summary del bell; necesitamos decidir si ambos convivirán o si el bell será la fuente principal para header

### Riesgos de navegación

- `action.url` puede venir orientado a dashboard o a cliente según emisor del evento
- necesitaremos una estrategia para no navegar a rutas no disponibles para el rol actual

### Riesgos de UX técnica

- marcar `seen` al abrir dropdown requiere una capa de UI específica del bell
- hay que disparar la petición temprano sin cargar en exceso el render inicial

## Orden recomendado de ejecución

1. tipos y exports
2. servicios HTTP
3. utilidades puras
4. bell en navbar
5. integración de página cliente
6. corrección de rutas inconsistentes
7. pruebas y ajuste fino

## Checklist vivo

- [x] Crear `packages/types/notification`
- [x] Exportar `notification` desde `packages/types/index.ts`
- [x] Crear `packages/services/notification`
- [x] Exportar `notification` desde `packages/services/index.ts`
- [x] Implementar tipos del item completo, bell y summary
- [x] Implementar queries y respuestas del listado
- [x] Implementar servicios de lectura
- [x] Implementar servicios de mutación `seen/read`
- [ ] Crear utilidades de navegación y agrupación
- [ ] Implementar bell en navbar cliente
- [ ] Cargar bell temprano desde navegación
- [ ] Sustituir placeholder de `/profile/notifications`
- [ ] Preparar filtros `all/unread/important`
- [ ] Unificar ruta canónica `/profile/notifications`
- [ ] Revisar i18n para textos del centro de notificaciones
- [ ] Añadir pruebas mínimas útiles
- [ ] Verificar integración manual con backend

## Criterio de terminado para esta funcionalidad

La funcionalidad estará lista para continuar con componentes cuando:

- el frontend tenga contrato tipado estable para `notification`
- las llamadas al backend estén implementadas y exportadas
- exista estado local claro y mantenible para bell y center
- la página cliente de notificaciones deje de ser placeholder
- el bell del navbar consuma el endpoint resumido y muestre hasta 5 items
- la navegación interna apunte a una ruta canónica consistente
- la base compartida permita construir después el dashboard sin rehacer dominio
