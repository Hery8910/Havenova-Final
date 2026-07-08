# About Audit

## Proposito

Este documento registra el estado actual de la ruta `about` y la compara contra el estándar definido en [docs/PAGE_COMPLETION_STANDARD.md](/home/heriberto/Escritorio/Havenova/havenova/docs/PAGE_COMPLETION_STANDARD.md:1).

Estado:

- refleja el estado actual real
- identifica deuda estructural, de i18n, accesibilidad y estilos
- define el punto de partida antes de aplicar el mismo hardening usado en `Home` y `how-it-work`

## Fuentes revisadas

Ruta y metadata:

- [apps/client/app/[lang]/(app)/about/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/about/page.tsx:1)
- [apps/client/app/[lang]/(app)/about/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/about/layout.tsx:1)

Features consumidas:

- [packages/components/client/pages/about/index.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/about/index.ts:1)
- [packages/components/client/pages/about/AboutPage.client.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/about/AboutPage.client.tsx:1)
- [packages/components/client/pages/about/AboutPage.view.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/about/AboutPage.view.tsx:1)
- [packages/styles/helpers.css](/home/heriberto/Escritorio/Havenova/havenova/packages/styles/helpers.css:1)
- [packages/components/client/pages/about/about.types.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/about/about.types.ts:1)
- [packages/components/client/pages/about/about.fallbacks.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/about/about.fallbacks.ts:1)
- [packages/components/client/pages/about/storySection/StorySection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/about/storySection/StorySection.tsx:1)
- [packages/components/client/pages/about/storySection/StorySection.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/about/storySection/StorySection.module.css:1)
- [packages/components/client/pages/about/ClientsSection/ClientsSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/about/ClientsSection/ClientsSection.tsx:1)
- [packages/components/client/pages/about/ClientsSection/ClientsSection.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/about/ClientsSection/ClientsSection.module.css:1)
- [packages/components/client/pages/shared/ServiceCrossCtaSection/ServiceCrossCtaSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/ServiceCrossCtaSection/ServiceCrossCtaSection.tsx:1)

Contenido y metadata:

- [packages/i18n/de/pages.json](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/de/pages.json:135)
- [packages/i18n/en/pages.json](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/en/pages.json:135)
- [packages/i18n/es/pages.json](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/es/pages.json:135)
- [packages/i18n/metadata.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/metadata.ts:83)

Documentación derivada:

- [apps/client/app/[lang]/(app)/ABOUT_RENDER_TREE.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/ABOUT_RENDER_TREE.md:1)
- [apps/client/app/[lang]/(app)/ABOUT_STYLE_INVENTORY.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/ABOUT_STYLE_INVENTORY.md:1)
- [apps/client/app/[lang]/(app)/TESTING.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/TESTING.md:1)

## Diagnostico ejecutivo

`about` ya salió del estado más crudo anterior al patrón aplicado en `Home` y `how-it-work`, pero todavía no está cerrada.

Lo que ya está bien:

- la página tiene metadata por `layout.tsx`
- la estructura conceptual es acotada: hero, historia, perfiles de cliente y CTA cruzado
- el contenido i18n parece relativamente bien desarrollado en los tres idiomas
- la ruta ya fue reducida a entrypoint
- la orquestación cliente y la composición ya viven en una superficie feature-owned
- la página ya no desaparece por ausencia del objeto `about`

Lo que todavía no cumple el estándar:

- el feature consume una mezcla clara de estilos legacy y shared surfaces que todavía no tiene una decisión de ownership cerrada
- no existe todavía evidencia manual propia ejecutada para esta ruta
- la migración visual ya fue iniciada en `StorySection` y `ClientsSection`, pero no está cerrada

Conclusión:

- `about` debe pasar por el mismo proceso de endurecimiento documental y estructural
- es una buena siguiente candidata porque combina contenido largo, `aria-*`, cards visuales y CTA compartida

## Hallazgos

### 1. La ruta ya fue reducida y la estrategia de render ya tiene baseline documental

Estado actual:

- [page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/about/page.tsx:1) ya actúa como server entry
- la orquestación cliente vive en [AboutPage.client.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/about/AboutPage.client.tsx:1)
- la composición visual vive en [AboutPage.view.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/about/AboutPage.view.tsx:1)

Lectura actual:

- la separación base ya existe
- `AboutPage.client.tsx` permanece por dependencia real de contexto cliente para `useI18n()` y `useLang()`
- la reducción razonable del route shell ya quedó hecha: la ruta compone en servidor y el scope cliente queda encapsulado en el feature

Conclusión:

- la justificación SSR/CSR de `about` queda cerrada para esta fase
- una reducción adicional del scope cliente no ofrece hoy una ganancia estructural clara frente al costo de duplicar resolución de copy o wrappers

### 2. La ownership base ya fue extraida, pero todavía falta completar el baseline documental

Estado actual:

- `AboutPageTexts` ahora vive en [about.types.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/about/about.types.ts:1)
- `StorySection` y `ClientsSection` ya consumen tipos feature-locales
- los fallbacks base viven en [about.fallbacks.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/about/about.fallbacks.ts:1)

Deuda restante:

- la ownership está mejorada en código, pero aún no está documentada al nivel de las páginas anteriores
- el baseline documental ya existe, pero todavía no tiene cierre equivalente al de `Home`

Objetivo:

- completar la documentación de ownership ahora que la base ya está rectificada

### 3. La estrategia de fallback base ya fue aplicada, pero el audit de copy sigue abierto

Estado actual:

- la página ya no hace `return null`
- hero, story, clients y `servicesCta` ya tienen fallbacks visibles en [about.fallbacks.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/about/about.fallbacks.ts:1)
- el scope actualmente renderizado fue comparado entre `de`, `en` y `es`
- `clients.a11y.sectionLabel` y `clients.a11y.listLabel` están presentes y alineados en los tres idiomas
- `servicesCta.a11y.sectionLabel`, `servicesCta.a11y.actionsLabel` y `servicesCta.actions[*].ariaLabel` están presentes y alineados en los tres idiomas
- `hero.a11y.actionsLabel` no forma parte del contrato renderizado actual porque la página `about` no define CTAs en el hero

Deuda restante:

- metadata `es` estaba incompleta y ya fue corregida en [packages/i18n/metadata.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/metadata.ts:83)
- sigue pendiente la validación final de screenshots reales en la pasada manual transversal de cierre
- los fallbacks siguen siendo una red de seguridad interna y no sustituyen la validación editorial final

Objetivo:

- tratar el audit de i18n y `aria-*` del surface actual como resuelto para esta fase

### 4. La superficie de accesibilidad es más rica que en otras páginas

Estado actual:

- `ClientsSection` usa `aria-labelledby`, `aria-describedby`, `aria-label` y `aria-label` adicional en la lista
- `servicesCta` en i18n ya incluye `a11y.sectionLabel`, `a11y.actionsLabel` y `ariaLabel` por acción
- el review del surface actual confirma que esos textos existen en `de`, `en` y `es`

Problema:

- esta ruta sigue teniendo más copy translatable ligado a semántica que `how-it-work`
- por eso el baseline documental debe mantenerse más estricto en futuras iteraciones

Objetivo:

- mantener `about` como una página con auditoría de i18n y `aria-*` de primera clase

## Resultado del audit de i18n

### Scope realmente renderizado

Surface revisada:

- `hero.title`
- `hero.descriptions`
- `hero.image.alt`
- `story.title`
- `story.paragraphs[*]`
- `clients.title`
- `clients.description`
- `clients.a11y.sectionLabel`
- `clients.a11y.listLabel`
- `clients.items[*].title`
- `clients.items[*].description`
- `clients.items[*].imageAlt`
- `clients.closing`
- `servicesCta.eyebrow`
- `servicesCta.title`
- `servicesCta.description`
- `servicesCta.a11y.sectionLabel`
- `servicesCta.a11y.actionsLabel`
- `servicesCta.actions[*].label`
- `servicesCta.actions[*].ariaLabel`
- metadata de la ruta

### Hallazgos cerrados

- no se detectaron keys sobrantes dentro del scope realmente renderizado
- `clients` y `servicesCta` mantienen la misma intención semántica entre `de`, `en` y `es`
- los `aria-*` activos de la ruta ya están cubiertos en los tres idiomas
- el hero no necesita hoy una key `aria-*` propia porque no renderiza CTAs en esta ruta
- metadata `es` fue completada para evitar una cobertura locale desigual

### Riesgos residuales

- la validación editorial final del tono puede ajustarse en la pasada manual transversal final si cambia el posicionamiento comercial de la página
- los screenshots y sus textos alternativos siguen sujetos al cierre visual real

### 5. Ya existe baseline de render, estilos y testing, pero falta evidencia real

Estado actual:

- ya existe un render tree equivalente en [ABOUT_RENDER_TREE.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/ABOUT_RENDER_TREE.md:1)
- el inventario de estilos ya vive en [ABOUT_STYLE_INVENTORY.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/ABOUT_STYLE_INVENTORY.md:1)
- [TESTING.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/TESTING.md:1) ya incluye el caso `K-08` específico para esta ruta

Objetivo:

- dejar preparada la ruta para la validación manual transversal final y registrar ahí la evidencia real

### 6. Los estilos muestran dos zonas distintas de riesgo

Estado actual:

- `StorySection` ya fue alineada a los helpers semánticos de texto y tokens de página compartidos
- `ClientsSection` ya usa `card` y tokens de página compartidos, pero mantiene su propia composición de carrusel horizontal, imagen full-bleed y overlay blur
- el CTA final depende de un componente compartido que probablemente ya tenga otro contrato visual

Problema:

- `ServiceCrossCtaSection` sigue sin una decisión de ownership visual cerrada
- `ClientsSection` sigue combinando layout, surface, scroll y overlay en una sola pieza con más complejidad que `StorySection`

Objetivo:

- documentar dependencias reales antes de promover más reglas al sistema compartido
- revisar especialmente `ClientsSection` como foco de deuda visual

## Riesgos

- si se toca `ClientsSection` sin inventario previo, es fácil introducir regresiones visuales o de accesibilidad en el carrusel horizontal
- si no se auditan los `aria-*`, la ruta puede quedar aparentemente traducida pero semánticamente inconsistente
- si la ruta sigue siendo client-only por costumbre, se repite deuda ya eliminada en las otras páginas

## Decisiones cerradas

- `about` entra al mismo flujo de auditoría incremental que `Home` y `how-it-work`
- las validaciones visuales/manuales pendientes de `how-it-work` no bloquean iniciar esta ruta
- la revisión de `Footer` sigue fuera de alcance

## Estado al cierre de hoy

Lo completado hoy:

- la ruta ya fue rectificada al patrón `page -> client -> view`
- los contratos page-local ya viven en `about.types.ts`
- los fallbacks visibles ya viven en `about.fallbacks.ts`
- el audit de i18n y `aria-*` del surface actualmente renderizado ya quedó resuelto para esta fase
- metadata `es` ya fue completada
- `ABOUT_RENDER_TREE.md`, `ABOUT_STYLE_INVENTORY.md` y el caso `K-08` en `TESTING.md` ya existen
- `StorySection` ya recibió una primera pasada visual con tokens y helpers semánticos compartidos
- `ClientsSection` ya recibió una primera pasada visual con `card` y tokens de página compartidos

Lo que sigue abierto:

- decidir el ownership visual de `ServiceCrossCtaSection`
- validar visualmente la nueva composición de `ClientsSection`
- ejecutar la validación manual real de `K-08` en la pasada transversal final

Punto exacto de reanudación:

- continuar desde la migración visual pendiente de `ServiceCrossCtaSection`
- después revisar si `ClientsSection` necesita una segunda pasada de layout/scroll antes de considerar la página estable para esta fase

## Plan de trabajo

La ejecución detallada queda en:

- [ABOUT_PLAN.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/ABOUT_PLAN.md:1)

Resumen de fases:

1. extraer contratos y rectificar la estrategia de render
2. eliminar `return null` y adoptar fallbacks visibles
3. documentar render tree, inventario de estilos y testing
4. auditar y alinear i18n incluyendo `aria-*`
5. migrar visualmente con foco especial en `ClientsSection`
