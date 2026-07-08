# Profile Route Family Plan

## Objetivo

Definir una secuencia de trabajo controlada para normalizar la familia `profile/*` sin mezclar:

- el overview principal
- la subruta madura `settings`
- las subrutas placeholder `orders`, `requests` y `notifications`
- el shell privado compartido

## Alcance

Este plan cubre:

- `apps/client/app/[lang]/(app)/profile/*`
- `packages/components/client/user/profile/*`
- el shell privado, overview, navegación y subrutas inmediatas del namespace

No cubre todavía:

- dashboard/admin account surfaces
- worker account surfaces
- validación manual final del shell privado
- rework funcional completo de notificaciones, requests u orders

## Resultado esperado

Al terminar esta fase, la familia `profile/*` debe cumplir como mínimo:

- baseline documental explícito del namespace
- separación entre rutas maduras y rutas placeholder
- ownership claro del shell privado y de `ProfileNav`
- estrategia inicial para migrar `profile/page.tsx` al patrón canónico

## Fases

### Fase 1. Baseline documental del namespace

Tareas:

- crear audit de la familia
- registrar estado por ruta
- enlazar `settings` como subruta ya documentada
- crear render tree e inventario visual inicial del shell privado

Criterio de cierre:

- `profile/*` deja de ser una zona implícita fuera del sistema documental

Estado actual:

- resuelta
- el baseline inicial ya queda asentado en `PROFILE_AUDIT.md`
- `PROFILE_RENDER_TREE.md` y `PROFILE_STYLE_INVENTORY.md` ya documentan el shell privado y sus dependencias iniciales

### Fase 2. Arquitectura del overview principal

Tareas:

- revisar `profile/page.tsx`
- decidir split `page(server) -> feature client -> feature view`
- seguir reduciendo dependencias del wrapper `ProfileOverviewPage.client.tsx`

Criterio de cierre:

- el overview deja de depender de un componente cliente monolítico

Estado actual:

- iniciada en su primera pasada
- el overview sigue siendo el principal hotspot estructural de la familia
- ya existe una extracción base a `view + helpers + types + fallbacks`, pero el wrapper cliente todavía concentra demasiadas dependencias

### Fase 3. Shell privado y navegación

Tareas:

- auditar `profile/layout.tsx` y `ProfileNav`
- documentar scroll, landmarks, foco y responsive del workspace privado
- separar deuda de estilos del nav respecto a deuda de cada página

Criterio de cierre:

- el shell privado tiene ownership claro y baseline semántico propio

Estado actual:

- iniciada en su baseline documental
- la primitive existe, pero todavía depende de revisiones dispersas en otros documentos
- shell y nav ya tienen inventario inicial, pero no validación semántica/manual propia
- `ProfileNav` ya separa wrapper, fallbacks, tipos y rutas por defecto

### Fase 4. Subrutas secundarias

Tareas:

- clasificar `orders`, `requests` y `notifications`
- decidir cuáles permanecen placeholder y cuáles necesitan baseline mínima inmediata
- enlazar `notifications` con `docs/notification-client-plan.md`

Criterio de cierre:

- las subrutas incompletas quedan documentadas como tales y no contaminan el estado del namespace

Estado actual:

- iniciada solo a nivel de inventario
- `requests` y `notifications` siguen claramente incompletas

### Fase 5. Integración de `settings` en el carril privado

Tareas:

- tratar `settings` como referencia madura dentro del namespace
- decidir qué piezas de `settings` son locales y cuáles ya son shared profile primitives
- evitar que el trabajo futuro de overview o subrutas reabra deuda ya cerrada en `settings`

Criterio de cierre:

- `settings` queda incorporada al sistema documental del carril sin perder su independencia técnica

Estado actual:

- parcialmente resuelta
- `settings` ya tiene README técnico propio, pero todavía no un cierre contextual dentro del namespace

## Orden recomendado

1. baseline documental
2. overview principal
3. shell privado y navegación
4. subrutas secundarias
5. integración documental de `settings`

## Regla de ejecución

Mientras `profile/*` siga abierta:

- no asumir que todo el namespace tiene la madurez de `settings`
- no cerrar `profile/page.tsx` solo porque el shell privado se vea estable
- no mezclar placeholders de subrutas con deuda real del overview
