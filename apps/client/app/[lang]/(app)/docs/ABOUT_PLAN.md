# About Plan

## Objetivo

Definir una secuencia de trabajo controlada para llevar `about` al mismo estándar de cierre aplicado en `Home` y `how-it-work`, sin mezclar arquitectura, i18n, accesibilidad, migración visual y testing en una sola pasada desordenada.

Estado del documento:

- plan de trabajo activo
- snapshot de seguimiento posterior a la rectificación estructural base

## Alcance

Este plan cubre:

- la ruta [apps/client/app/[lang]/(app)/about/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/about/page.tsx:1)
- el feature `packages/components/client/pages/about/*`
- la composición compartida que la ruta ya consume mediante `ServiceCrossCtaSection`

No cubre:

- cambios derivados del backend
- revisión específica del `Footer`
- screenshots reales y evidencia final de la pasada manual transversal final

## Resultado esperado

Al terminar esta fase, `about` debe cumplir como mínimo:

- ruta reducida a entrypoint claro
- contratos page-local fuera del route file
- fallbacks visibles en UI
- inventario real de estilos y dependencias
- auditoría explícita de `aria-*`
- documentación suficiente para cierre posterior sin redescubrir contexto

## Fases

### Fase 1. Baseline documental

Entregables:

- [ABOUT_AUDIT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/ABOUT_AUDIT.md:1)
- este plan de trabajo

Objetivo:

- congelar el estado de partida

### Fase 2. Arquitectura y ownership

Tareas:

- extraer `AboutPageTexts` a un archivo feature-local
- extraer tipos de `StorySection` y `ClientsSection`
- crear superficie canónica tipo `AboutPageClient` y `AboutPageView`
- revisar si la ruta puede pasar a server-first como las páginas anteriores

Criterio de cierre:

- `page.tsx` deja de contener tipos inline y composición detallada

Estado actual:

- fase iniciada y resuelta en la base
- la ruta ya delega en `AboutPageClient`
- la vista ya vive en `AboutPageView`
- los contratos ya fueron extraídos a `about.types.ts`

### Fase 3. i18n y fallbacks

Tareas:

- eliminar `return null`
- introducir fallbacks humanos visibles
- revisar `de`, `en` y `es` contra el surface renderizado real
- revisar `aria-*` de `clients` y `servicesCta`

Criterio de cierre:

- la página mantiene UI significativa y el surface semántico queda alineado entre idiomas

Estado actual:

- fase iniciada en su capa base
- el `return null` ya fue eliminado
- los fallbacks visibles ya viven en `about.fallbacks.ts`
- el scope renderizado ya fue auditado en `de`, `en` y `es`
- los `aria-*` activos de `clients` y `servicesCta` ya fueron revisados y alineados entre idiomas
- metadata `es` ya fue completada; los screenshots reales siguen diferidos a la pasada manual transversal final

### Fase 4. Render, accesibilidad y testing

Tareas:

- crear render tree de la página
- documentar landmarks, headings, foco esperado y scroll horizontal de `ClientsSection`
- extender `TESTING.md` con un caso específico para `about`

Criterio de cierre:

- la página tiene baseline semántico y plan de validación manual documentado

Estado actual:

- fase iniciada en su baseline documental
- el render tree ya existe
- `TESTING.md` ya incluye el caso `K-08`
- la revisión semántica por código ya quedó asentada en el audit
- la ejecución manual real queda diferida a la pasada transversal final

### Fase 5. Estilos y migración visual

Tareas:

- crear inventario de estilos de la ruta
- clasificar `StorySection`, `ClientsSection` y `ServiceCrossCtaSection`
- decidir qué puede migrar a `v2` y qué debe quedarse local
- tratar `ClientsSection` como principal foco de revisión visual

Criterio de cierre:

- cualquier promoción al sistema compartido queda respaldada por inventario real

Estado actual:

- fase iniciada a nivel documental
- el inventario de estilos ya existe
- `ClientsSection` ya quedó identificado como principal hotspot visual
- `StorySection` y `ClientsSection` ya recibieron una primera pasada de convergencia hacia el sistema compartido
- falta decidir qué hacer con `ServiceCrossCtaSection` y validar visualmente el comportamiento real

### Fase 6. Cierre de fase actual

Tareas:

- actualizar checklist viva
- dejar claro qué queda completo ahora y qué se difiere a la pasada manual transversal final

Pendientes explícitos de la pasada manual transversal final:

- screenshots reales
- evidencia manual final

## Orden recomendado

1. baseline documental
2. arquitectura y ownership
3. i18n y fallbacks
4. render, accesibilidad y testing
5. estilos y migración visual
6. cierre documental

## Regla de ejecución

Mientras esta página siga abierta:

- no introducir nuevos helpers globales sin inventario previo
- no mover tipos a `packages/types` sin segundo consumidor real
- no tratar metadata como sustituto de cierre estructural

## Bitacora de cierre

### Estado al terminar hoy

- Fase 2: resuelta en la base
- Fase 3: resuelta para el surface renderizado actual
- Fase 4: baseline documental y semántico resuelto, evidencia real pendiente
- Fase 5: iniciada en código para `StorySection` y `ClientsSection`

### Cambios ya aplicados

- `about` ya usa `AboutPageClient` y `AboutPageView`
- `about.types.ts` y `about.fallbacks.ts` ya existen
- metadata `es` ya fue añadida
- `StorySection` ya consume helpers semánticos de texto compartidos
- `ClientsSection` ya consume `card` y tokens de página compartidos
- `ServiceCrossCtaSection` se dejó sin migrar a propósito para decidir su ownership aparte

### Primer siguiente paso recomendado

1. revisar si `ServiceCrossCtaSection` debe converger al sistema compartido o mantenerse como superficie compartida auto-contenida
2. si se mantiene aparte, documentar esa decisión y pasar a validación visual/manual pendiente
3. si se migra, hacerlo antes de considerar `About` como casi cerrada para esta fase
