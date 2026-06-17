# How It Works Audit

## Proposito

Este documento registra el estado actual de la ruta `how-it-work` y la compara contra el estándar definido en [docs/PAGE_COMPLETION_STANDARD.md](/home/heriberto/Escritorio/Havenova/havenova/docs/PAGE_COMPLETION_STANDARD.md:1).

Estado:

- refleja el estado actual real
- identifica deuda estructural, de i18n, accesibilidad y estilos
- define las decisiones necesarias antes de cerrar esta página

## Fuentes revisadas

Ruta y metadata:

- [apps/client/app/[lang]/(app)/how-it-work/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/how-it-work/page.tsx:1)
- [apps/client/app/[lang]/(app)/how-it-work/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/how-it-work/layout.tsx:1)

Features consumidas:

- [packages/components/client/pages/howItWorks/index.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/howItWorks/index.ts:1)
- [packages/components/client/pages/howItWorks/HowItWorksPage.client.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/howItWorks/HowItWorksPage.client.tsx:1)
- [packages/components/client/pages/howItWorks/HowItWorksPage.view.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/howItWorks/HowItWorksPage.view.tsx:1)
- [packages/components/client/pages/howItWorks/howItWorks.types.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/howItWorks/howItWorks.types.ts:1)
- [packages/components/client/pages/howItWorks/howItWorks.fallbacks.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/howItWorks/howItWorks.fallbacks.ts:1)
- [packages/components/client/pages/howItWorks/WorkflowSection/WorkflowSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/howItWorks/WorkflowSection/WorkflowSection.tsx:1)
- [packages/components/client/pages/howItWorks/BenefitsSplitSection/BenefitsSplitSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/howItWorks/BenefitsSplitSection/BenefitsSplitSection.tsx:1)

Contenido y metadata:

- [packages/i18n/de/pages.json](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/de/pages.json:734)
- [packages/i18n/en/pages.json](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/en/pages.json:734)
- [packages/i18n/es/pages.json](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/es/pages.json:734)
- [packages/i18n/metadata.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/metadata.ts:167)

Documentación derivada:

- [apps/client/app/[lang]/(app)/HOW_IT_WORK_RENDER_TREE.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/HOW_IT_WORK_RENDER_TREE.md:1)
- [apps/client/app/[lang]/(app)/HOW_IT_WORK_STYLE_INVENTORY.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/HOW_IT_WORK_STYLE_INVENTORY.md:1)
- [apps/client/app/[lang]/(app)/TESTING.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/TESTING.md:1)

## Diagnostico ejecutivo

`how-it-work` ya salió del estado más crudo anterior a `Home`, pero todavía no está cerrada.

Lo que ya está bien:

- la ruta ya tiene metadata por `layout.tsx`
- la composición visual es relativamente pequeña y fácil de aislar
- la estructura semántica base no está rota: hero, `main`, dos secciones y CTAs claros
- la ruta ya fue reducida a entrypoint y delega en una superficie feature-owned
- los contratos de página ya no viven inline en el route file
- la página ya no desaparece por ausencia del objeto i18n

Lo que todavía no cumple el estándar:

- no existe todavía evidencia manual propia ejecutada para esta ruta
- la estrategia SSR/CSR todavía debe quedar justificada de forma explícita
- la composición visual del bloque de beneficios ya fue consolidada en código, pero todavía necesita validación visual real
- la adopción de `v2` quedó iniciada en la ruta, pero su cierre visual todavía no está consolidado

Conclusión:

- `how-it-work` debe pasar por el mismo hardening que `Home`
- es una candidata adecuada para reutilizar el patrón ya definido y validar una segunda página sobre la capa `v2`

## Hallazgos

### 1. La ruta ya fue reducida, pero la estrategia de render todavia debe cerrarse documentalmente

Estado actual:

- [page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/how-it-work/page.tsx:1) ya es server entry
- la orquestación cliente vive en [HowItWorksPage.client.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/howItWorks/HowItWorksPage.client.tsx:1)
- la composición visual vive en [HowItWorksPage.view.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/howItWorks/HowItWorksPage.view.tsx:1)

Problema:

- la separación ya existe, pero todavía falta registrar si el scope cliente actual es el mínimo necesario
- la página debe explicar por qué sigue leyendo `useI18n()` y `useLang()` desde una capa cliente

Objetivo:

- dejar documentada la justificación SSR/CSR igual que se hizo en `Home`

### 2. Los contratos ya fueron extraidos, pero la ownership aun necesita inventario completo

Estado actual:

- `HowItWorksPageTexts` ahora vive en [howItWorks.types.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/howItWorks/howItWorks.types.ts:1)
- `WorkflowSection` y `BenefitsSplitSection` ya consumen tipos feature-locales
- la página ya expone una superficie canónica desde el barrel de `howItWorks`

Deuda restante:

- el baseline de ownership ya existe, pero todavía no llega al mismo nivel de cierre que `Home`

Objetivo:

- completar la documentación de ownership ahora que la extracción base ya está hecha

### 3. La pagina ya no hace `return null`, pero el audit de i18n sigue pendiente

Estado actual:

- la página ya resuelve fallbacks visibles mediante [howItWorks.fallbacks.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/howItWorks/howItWorks.fallbacks.ts:1)
- `HowItWorksPage.view.tsx` ya no retorna `null` por ausencia del objeto `howItWorks`
- el scope actualmente renderizado fue comparado entre `de`, `en` y `es`
- el `aria-label` realmente renderizado en la página es `benefits.ctaAriaLabel`, y ya está presente en los tres idiomas
- `hero.a11y.actionsLabel` no forma parte del contrato renderizado actual porque esta ruta no define CTAs en el hero

Deuda restante:

- la metadata `es` estaba incompleta y ya fue corregida en [packages/i18n/metadata.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/metadata.ts:167)
- sigue pendiente la validación final de screenshots reales en fase 2
- algunas frases fallback siguen siendo una red de seguridad interna y no sustituyen la validación editorial final

Objetivo:

- tratar el audit de copy y traducciones del surface actual como resuelto para esta fase

### 4. La pagina tiene una mezcla de `v2` y legacy que aun no esta auditada

Estado actual:

- `WorkflowSection` ya usa `v2-card` y `v2-page-*`
- `BenefitsSplitSection` ya usa `v2-button` y tokens `v2` en su banda principal
- la ruta ya importa `migration-styles/index.css`
- el inventario actual en [HOW_IT_WORK_STYLE_INVENTORY.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/HOW_IT_WORK_STYLE_INVENTORY.md:1) muestra que la deuda legacy restante es mucho menor que al inicio

Problema:

- la ruta ya activó `v2` en varias superficies, pero todavía no hay decisión cerrada sobre su consolidación final
- la composición visual del bloque de beneficios ya fue estabilizada estructuralmente, pero sigue pendiente de revisión real en viewport

Objetivo:

- usar esta ruta como segundo consumidor auditado para decidir qué primitives `v2` ya pueden considerarse compartidos
- validar visualmente el bloque de beneficios antes de marcar la migración visual como cerrada

### 5. Ya existe baseline de render y testing, pero falta evidencia real

Estado actual:

- ya existe un documento de render tree equivalente en [HOW_IT_WORK_RENDER_TREE.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/HOW_IT_WORK_RENDER_TREE.md:1)
- [TESTING.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/TESTING.md:1) ya incluye el caso `K-07` específico para esta ruta
- los CTAs dependen del shell general para navegación por teclado, pero la página no documenta su propia secuencia esperada

Señales positivas:

- `main` ya tiene `id="app-main-content"` y `tabIndex={-1}`
- ambas secciones usan `aria-labelledby`
- la imagen decorativa del bloque de beneficios ya está marcada con `aria-hidden`

Objetivo:

- ejecutar la validación manual real y dejar evidencia propia de la ruta

### 6. Metadata sí está alineada, y el inventario de estilos ya tiene baseline

Estado actual:

- [layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/how-it-work/layout.tsx:1) ya usa `getPageMetadata(params.lang, 'howItWorks')`
- [packages/i18n/metadata.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/metadata.ts:167) ya tiene entradas `de`, `en` y `es`

Interpretación:

- metadata no es el problema principal de esta página
- la cobertura de locale para metadata ya quedó alineada con la ruta
- el screenshot `es` reutiliza por ahora el asset `en`, igual que en otros cierres parciales, y debe revisarse en fase 2
- el inventario visual ya quedó inicializado en [HOW_IT_WORK_STYLE_INVENTORY.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/HOW_IT_WORK_STYLE_INVENTORY.md:1)

## Resultado del audit de i18n

### Scope realmente renderizado

Surface revisada:

- `hero.title`
- `hero.descriptions`
- `hero.image.alt`
- `workflow.title`
- `workflow.subtitle`
- `workflow.steps[*].title`
- `workflow.steps[*].description`
- `workflow.note.title`
- `workflow.note.description`
- `benefits.title`
- `benefits.description`
- `benefits.ctaAriaLabel`
- `benefits.ctaCleaning.label`
- `benefits.ctaHomeServices.label`
- metadata de la ruta

### Hallazgos cerrados

- no se detectaron keys sobrantes dentro del scope realmente renderizado
- `benefits.ctaAriaLabel` mantiene el mismo significado semántico en `de`, `en` y `es`
- el hero no necesita hoy una key `aria-*` propia porque no renderiza CTAs en esta ruta
- el copy principal de hero, workflow y benefits está alineado con el mismo flujo conceptual en los tres idiomas
- metadata `es` fue completada para evitar una cobertura locale desigual

### Riesgos residuales

- la validación editorial final del tono todavía puede ajustarse durante la fase 2 si cambia el posicionamiento de la página
- los screenshots y sus textos alternativos siguen sujetos al cierre visual real

## Riesgos

- si se migra la página sin extraer antes sus contratos, se repetirá el patrón que ya se corrigió en `Home`
- si se activan estilos `v2` sin inventario previo, la capa de migración puede volver a crecer sin ownership claro
- si no se audita el contenido real, la ruta puede conservar keys no usadas o copy desalineado entre idiomas

## Decisiones cerradas

- `Home` se toma como referencia inmediata para el patrón de rectificación de páginas
- el `Footer` sigue fuera del alcance de cierre de esta ruta, igual que en `Home`
- el trabajo de `how-it-work` se documentará desde el inicio antes de continuar con implementación
- las validaciones visuales y manuales restantes se dejan explícitamente pendientes para no bloquear el avance hacia la siguiente página

## Estado actual de cierre

Para la fase actual:

- arquitectura base: rectificada
- fallbacks e i18n: auditados para el surface renderizado
- migración visual: avanzada y documentada

Pendientes diferidos:

- validación visual real en desktop y mobile
- ejecución manual de `K-07`
- evidencia de cierre final de fase 2

## Plan de trabajo

La ejecución detallada queda en:

- [HOW_IT_WORK_PLAN.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/HOW_IT_WORK_PLAN.md:1)

Resumen de fases:

1. extraer contratos y justificar estrategia de render
2. eliminar `return null` y adoptar fallbacks explícitos
3. documentar render tree, testing y style inventory
4. migrar la página a una composición feature-owned más cercana al patrón de `Home`
5. validar la adopción mínima de la capa `v2` donde tenga ownership real
