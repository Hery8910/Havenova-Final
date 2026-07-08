# Profile Route Family Audit

## Proposito

Este documento registra el estado actual de la familia de rutas `profile/*` del cliente y la
separa del carril de páginas públicas definido en
[docs/PAGE_CONSTRUCTION_PATTERN.md](/home/heriberto/Escritorio/Havenova/havenova/docs/PAGE_CONSTRUCTION_PATTERN.md:1).

Su objetivo no es declarar la familia como cerrada, sino:

- dejar visible el baseline real de arquitectura y madurez
- separar `profile/settings` del resto de superficies aún incompletas
- evitar que `profile/*` siga siendo una deuda implícita fuera del sistema documental

## Scope auditado

Rutas:

- [apps/client/app/[lang]/(app)/profile/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/layout.tsx:1)
- [apps/client/app/[lang]/(app)/profile/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/page.tsx:1)
- [apps/client/app/[lang]/(app)/profile/settings/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/settings/page.tsx:1)
- [apps/client/app/[lang]/(app)/profile/orders/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/orders/page.tsx:1)
- [apps/client/app/[lang]/(app)/profile/requests/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/requests/page.tsx:1)
- [apps/client/app/[lang]/(app)/profile/notifications/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/notifications/page.tsx:1)

Superficie feature principal:

- [packages/components/client/user/profile/profileOverview/ProfileOverviewPage.client.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileOverview/ProfileOverviewPage.client.tsx:1)
- [packages/components/client/user/profile/profileSettings/ProfileSettingsClient.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileSettings/ProfileSettingsClient.tsx:1)
- [packages/components/client/user/profile/profileNav/ProfileNav.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileNav/ProfileNav.tsx:1)
- [apps/client/app/[lang]/(app)/profile/settings/README.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/settings/README.md:1)

Documentación derivada:

- [PROFILE_RENDER_TREE.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/PROFILE_RENDER_TREE.md:1)
- [PROFILE_STYLE_INVENTORY.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/PROFILE_STYLE_INVENTORY.md:1)

## Diagnostico ejecutivo

La familia `profile/*` ya tiene un layout privado propio y una feature madura en `settings`, pero
no se comporta todavía como un sistema homogéneo de páginas reproducibles.

Lo que ya está bien:

- existe un `layout.tsx` dedicado para la familia con metadata y shell privado propios
- `profile/settings` ya tiene documentación técnica y una arquitectura bastante más madura
- `ProfileNav` ya unifica la navegación principal de la familia
- el split `auth + profile` sigue siendo una frontera reconocible dentro del cliente

Lo que todavía no cumple el estándar:

- `profile/page.tsx` sigue delegando directamente en un componente cliente grande y sin baseline documental propio
- `orders`, `requests` y `notifications` no tienen el mismo nivel de arquitectura ni documentación que `settings`
- la familia no tiene todavía render tree, inventario visual ni baseline de testing propios como conjunto
- parte del surface sigue en estado placeholder o de mock técnico

Conclusión:

- `profile/settings` ya no debe arrastrarse como deuda abierta genérica
- el mayor pendiente real de la familia hoy es `profile` overview y la normalización del resto de subrutas

## Hallazgos

### 1. La familia ya tiene shell privado estable, pero no baseline documental común

Estado actual:

- [layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/layout.tsx:1) ya define metadata de `profile` y compone un workspace privado con `ProfileNav`
- el layout usa una columna lateral persistente y una sección scrollable para el contenido
- mobile oculta la columna lateral y deja el contenido en flujo vertical

Lectura actual:

- el shell privado existe y ya es reutilizable a nivel de familia
- todavía falta inventariar semántica, scroll, foco y comportamiento responsive del shell como una unidad propia

### 2. `profile/settings` está claramente por delante del resto

Estado actual:

- `settings/page.tsx` ya es un wrapper server simple
- la superficie interactiva vive en `ProfileSettingsClient`
- la propia ruta ya tiene documentación técnica detallada en
  [README.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/settings/README.md:1)

Lectura actual:

- `settings` ya tiene un baseline técnico más cercano al patrón canónico
- no conviene mezclar su nivel de madurez con el overview ni con páginas placeholder del mismo árbol

### 3. `profile/page.tsx` sigue siendo la principal deuda estructural del carril

Estado actual:

- [page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/page.tsx:1) ya renderiza `ProfileOverviewPageClient`
- [ProfileOverviewPage.client.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileOverview/ProfileOverviewPage.client.tsx:1) mantiene:
  - `useAuth()`
  - `useProfile()`
  - `useI18n()`
  - `useRequireLogin()`
  - resolución principal de dependencias cliente
- `ProfileOverviewPage.view.tsx`, `profileOverview.helpers.ts`, `profileOverview.types.ts` y `profileOverview.fallbacks.ts` ya separan composición, contratos, view model y copy fallback

Problema:

- el overview ya recibió una primera extracción a `view + helpers + fallbacks + types`, pero el wrapper principal todavía concentra demasiado contexto cliente
- la ruta principal del área privada sigue cargando auth, profile, i18n y guardia de sesión en un único surface

Impacto:

- hoy es la peor candidata de la familia para clonar, mantener o auditar visualmente
- también complica separar deuda de arquitectura, deuda de copy y deuda de estilo

Avance ya aplicado:

- `page.tsx -> ProfileOverviewPageClient -> ProfileOverviewPageView` ya existe como baseline inicial
- la composición visual principal y la copy fallback ya salieron del componente monolítico original

### 4. `orders`, `requests` y `notifications` no están al mismo nivel de madurez

Estado actual:

- `orders/page.tsx` es una isla cliente pequeña, pero todavía muy mínima
- `notifications/page.tsx` es un placeholder explícito
- `requests/page.tsx` conserva mock comments y estructura casi vacía

Lectura actual:

- estas rutas existen como contrato de navegación, no como páginas cerradas
- deben documentarse como subrutas activas pero incompletas, no como surfaces equivalentes a `settings`

### 5. La estrategia SSR/CSR de la familia está mezclada por página

Estado actual:

- el `layout` es server
- `settings/page.tsx` ya es server wrapper
- `profile/page.tsx`, `orders`, `requests` y `notifications` siguen dependiendo de componentes cliente directos

Conclusión provisional:

- el problema no es que toda la familia sea CSR
- el problema es que todavía no hay una regla uniforme de composición por ruta dentro del mismo namespace

### 6. La navegación privada ya es una primitive real, pero todavía necesita su propio audit lane

Estado actual:

- `ProfileNav` ya centraliza labels, match rules y links del área
- el mismo nav participa en varias de las iteraciones visuales recientes del workspace privado
- `ProfileNav` convive con pendientes visuales abiertos en el README de `settings`
- la configuración base del nav ya fue extraída a `profileNav.types.ts`, `profileNav.fallbacks.ts` y `profileNav.helpers.tsx`

Lectura actual:

- ya no es un detalle local de una página
- debe tratarse como primitive compartida del carril `profile/*`, con validación propia posterior
- la deuda restante del nav ya no está en mezclar rutas, labels e iconos dentro del mismo componente, sino en su cierre visual y semántico dentro del shell

## Estado actual por ruta

### `profile`

- ruta existente
- arquitectura parcial
- overview cliente grande
- baseline documental pendiente

### `profile/settings`

- ruta existente
- arquitectura madura
- baseline técnico documentado
- aún pendiente de integrarse en un audit global del carril privado

### `profile/orders`

- ruta existente
- surface mínimo
- todavía sin baseline documental de página

### `profile/requests`

- ruta existente
- placeholder técnico con mock comments
- requiere rediseño antes de cualquier cierre documental serio

### `profile/notifications`

- ruta existente
- placeholder explícito
- depende de un plan separado ya abierto en `docs/notification-client-plan.md`

## Riesgos

- si `settings` se toma como representativa de toda la familia, se falsea el estado real de `profile/*`
- si el overview sigue creciendo en `ProfileOverviewPage.client.tsx`, la deuda estructural del carril privado aumentará
- si las subrutas placeholder no quedan separadas documentalmente, el registro de arquitectura perderá credibilidad

## Decisiones cerradas para esta fase

- `profile/*` queda fuera del registro de páginas públicas por decisión explícita, no por olvido
- `profile/settings` se reconoce como una subruta madura, pero no arrastra al resto de la familia a estado cerrado
- el siguiente foco técnico del carril privado debe ser `profile/page.tsx` y no `settings`
