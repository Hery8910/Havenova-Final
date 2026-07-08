# How It Work Plan

## Objetivo

Definir una secuencia de trabajo controlada para llevar `how-it-work` al mismo estándar de cierre aplicado en `Home`, sin mezclar arquitectura, i18n, accesibilidad y migración visual en una sola pasada difusa.

Estado del documento:

- plan de trabajo activo
- orientado a la fase actual de consolidación frontend

## Alcance

Este plan cubre:

- la ruta [apps/client/app/[lang]/(app)/how-it-work/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/how-it-work/page.tsx:1)
- el feature `packages/components/client/pages/howItWorks/*`
- la documentación de auditoría, testing y estilos necesaria para cerrar la página

No cubre:

- cambios derivados del backend
- revisión específica del `Footer`
- screenshots reales y evidencia final de la pasada manual transversal final

## Resultado esperado

Al terminar esta fase, `how-it-work` debe cumplir como mínimo:

- ruta reducida a entrypoint claro
- contratos page-local fuera del route file
- fallbacks visibles en UI
- inventario real de estilos y dependencias
- documentación suficiente para cierre posterior sin redescubrir contexto

## Fases

### Fase 1. Baseline documental

Entregables:

- [HOW_IT_WORK_AUDIT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/HOW_IT_WORK_AUDIT.md:1)
- este plan de trabajo

Objetivo:

- congelar el estado de partida y evitar refactor a ciegas

### Fase 2. Arquitectura y ownership

Tareas:

- extraer `HowItWorksPageTexts` a un archivo feature-local
- extraer tipos de secciones a contratos compartidos por la página
- introducir una superficie canónica tipo `HowItWorksPageClient` y `HowItWorksPageView` si la ruta sigue necesitando cliente
- revisar si la ruta puede pasar a server-first como `Home`

Criterio de cierre:

- `page.tsx` deja de ser bucket de tipos y composición detallada

Estado actual:

- fase iniciada y resuelta en la base
- la ruta ya delega en `HowItWorksPageClient`
- la vista ya vive en `HowItWorksPageView`
- los contratos ya fueron extraídos a `howItWorks.types.ts`
- la justificación SSR/CSR de la ruta ya quedó documentada en el audit

### Fase 3. i18n y fallbacks

Tareas:

- eliminar `return null` por ausencia de copy
- introducir fallbacks humanos explícitos
- revisar `de`, `en` y `es` contra el scope real que la página renderiza
- corregir keys sobrantes o inconsistentes si aparecen

Criterio de cierre:

- la página mantiene UI significativa aun si falta parte del contenido i18n

Estado actual:

- fase iniciada en su capa base
- el `return null` ya fue eliminado
- los fallbacks visibles ya viven en `howItWorks.fallbacks.ts`
- el scope renderizado ya fue auditado en `de`, `en` y `es`
- el `aria-label` activo de la página ya fue revisado y alineado entre idiomas
- metadata `es` ya fue completada; los screenshots reales siguen diferidos a la pasada manual transversal final

### Fase 4. Render, accesibilidad y testing

Tareas:

- crear documento de render tree de la página
- registrar landmarks, headings y flujo de foco esperado
- ampliar la guía/testing manual para la secuencia propia de `how-it-work`
- dejar explícitos los pendientes que pertenecen a la pasada manual transversal final

Criterio de cierre:

- la página tiene cierre semántico y plan de validación manual documentado

Estado actual:

- fase resuelta en su baseline técnico
- el render tree ya existe
- `TESTING.md` ya incluye el caso `K-07`
- la revisión semántica por código ya quedó asentada en el audit
- la evidencia manual real queda diferida a la pasada transversal final

### Fase 5. Estilos y migración visual

Tareas:

- crear inventario de dependencias de estilo
- clasificar botones, cards, tokens y helpers actuales
- decidir si la página reutiliza los primitivos compartidos ya activados por `Home`
- mantener en CSS Modules lo que siga siendo page-local

Criterio de cierre:

- cualquier promoción al sistema compartido queda justificada por auditoría real

Estado actual:

- fase claramente iniciada
- la ruta ya reutiliza primitivos compartidos en hero, workflow y CTAs de benefits
- `BenefitsSplitSection` ya fue estabilizada estructuralmente para eliminar la composición basada en posicionamiento absoluto y márgenes de compensación
- falta validación visual real y decisión final sobre qué primitives pasan a considerarse compartidas

### Fase 6. Cierre de fase actual

Tareas:

- actualizar checklist viva de la auditoría
- dejar claro qué queda completado ahora y qué se difiere a la pasada manual transversal final

Pendientes explícitos de la pasada manual transversal final:

- screenshots reales
- verificación final manual de teclado registrada como evidencia de cierre

## Orden recomendado

1. baseline documental
2. arquitectura y ownership
3. i18n y fallbacks
4. render y testing
5. estilos y migración visual
6. cierre documental

## Regla de ejecución

Mientras esta página siga abierta:

- no introducir nuevos helpers globales sin inventario previo
- no mover tipos a `packages/types` sin segundo consumidor real
- no tratar metadata como sustituto de cierre estructural
