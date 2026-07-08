# Contact Plan

## Objetivo

Definir una secuencia de trabajo controlada para llevar `contact` al mismo estándar de cierre aplicado en `Home`, `About` y `how-it-work`, separando de forma explícita la rectificación de la página del retrabajo del formulario.

Estado del documento:

- plan de trabajo activo
- baseline posterior a la rectificación estructural base

## Alcance

Este plan cubre:

- la ruta [apps/client/app/[lang]/(app)/contact/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/contact/page.tsx:1)
- el feature `packages/components/client/pages/contact/*`
- el surface visible no-form de la página: hero, info section, quick actions y FAQ
- la documentación necesaria para cerrar la página sin redescubrir contexto

No cubre en la primera pasada:

- actualización del contrato backend de contacto
- refactor de `packages/services/contact/*`
- redefinición de tipos compartidos del formulario
- screenshots reales y evidencia final de la pasada manual transversal final

## Resultado esperado

Al terminar esta fase, `contact` debe cumplir como mínimo:

- ruta reducida a entrypoint claro
- contratos page-local fuera del route file
- fallbacks visibles en el surface informativo
- inventario real de estilos y dependencias
- render tree y testing baseline documentados
- formulario separado como fase final con alcance propio

## Fases

### Fase 1. Baseline documental

Entregables:

- [CONTACT_AUDIT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/CONTACT_AUDIT.md:1)
- este plan de trabajo

Objetivo:

- congelar el estado de partida real y fijar la separación entre página y formulario

### Fase 2. Arquitectura y ownership de la página

Tareas:

- crear una superficie canónica para la ruta y `ContactPageView`
- extraer `ContactPageTexts`, `ContactInfoTexts` y tipos derivados a `contact.types.ts`
- crear `contact.fallbacks.ts` para hero, info section y FAQ
- reducir [page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/contact/page.tsx:1) a entrypoint

Criterio de cierre:

- `page.tsx` deja de contener tipos inline y composición detallada

Estado actual:

- fase iniciada y resuelta en la base
- la ruta ya resuelve copy desde servidor y delega la composición en `ContactPageView`
- la vista ya vive en `ContactPageView`
- los contratos page-local ya fueron extraídos a `contact.types.ts`
- `contact.fallbacks.ts` ya existe como punto de ownership para el surface informativo

### Fase 3. i18n y fallbacks del surface no-form

Tareas:

- eliminar `return null` en la ruta por ausencia de `contact` o `footer`
- auditar `de`, `en` y `es` sobre hero, info section, quick actions y FAQ
- introducir fallbacks humanos visibles en el surface informativo
- documentar qué parte del i18n queda diferida por pertenecer al formulario

Criterio de cierre:

- la página mantiene UI significativa aun si falta parte del contenido i18n no crítico

Estado actual:

- fase resuelta en su baseline actual
- hero, info section y FAQ ya resuelven fallbacks visibles mediante `contact.fallbacks.ts` y `FAQSection`
- el surface no-form ya no depende de `return null`
- los fallbacks editoriales de `de`, `en` y `es` ya quedaron declarados por idioma para hero, info y FAQ
- el formulario ya concentra su propio fallback multilenguaje en `contactForm.fallbacks.ts`

### Fase 4. Render, accesibilidad y testing

Tareas:

- crear `CONTACT_RENDER_TREE.md`
- registrar landmarks, headings, foco esperado y navegación entre hero, main, info y FAQ
- extender [TESTING.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/TESTING.md:1) con un caso específico para `contact`
- dejar explícito qué validación pertenece al formulario y cuál a la página

Criterio de cierre:

- `contact` tiene baseline semántico y plan manual de validación documentado

Estado actual:

- fase iniciada en su baseline documental
- `CONTACT_RENDER_TREE.md` ya existe
- `TESTING.md` ya incluye el caso `K-09`
- la revisión semántica por código ya quedó asentada en el audit
- la ejecución manual real y la evidencia final siguen pendientes para la pasada transversal final

### Fase 5. Estilos y migración visual del surface no-form

Tareas:

- crear `CONTACT_STYLE_INVENTORY.md`
- clasificar estilos del route shell, `InfoSection` y `FAQSection`
- decidir qué parte de `contact` debe converger al sistema compartido
- migrar solo lo justificado por inventario real

Criterio de cierre:

- cualquier promoción al sistema compartido queda respaldada por inventario y ownership claros

Estado actual:

- fase iniciada en su baseline documental
- `CONTACT_STYLE_INVENTORY.md` ya existe
- la ruta ya no activa una capa paralela de migración
- `InfoSection` quedó identificado como principal hotspot visual no-form
- `InfoSection` ya recibió la primera pasada real de convergencia hacia el sistema compartido
- `FAQSection` quedó identificado como segundo candidato de migración
- `ContactForm` sigue excluido a propósito de la decisión visual de esta fase

### Fase 6. Formulario como tarea separada

Tareas:

- auditar el contrato actual de `ContactFormSection`
- revisar dependencias con auth, profile, alerts, i18n y `contactService`
- actualizar tipos, servicios y payloads según el nuevo contrato backend
- decidir si el formulario queda en el mismo feature folder o necesita una separación más clara de dominio
- inventariar todos los servicios del dominio `contact`, no sólo el submit público
- decidir el tratamiento de aliases legacy y del endpoint de borrado masivo

Criterio de cierre:

- el formulario deja de depender de supuestos viejos del backend y queda alineado con los contratos vigentes
- el dominio frontend de `contact` queda declarado de forma completa antes de integrar componentes

Regla:

- esta fase no debe empezar hasta que la página informativa ya tenga baseline documental y arquitectura separada

Documento activo para esta fase:

- [CONTACT_FORM_PLAN.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/CONTACT_FORM_PLAN.md:1)

Estado actual:

- iniciada
- tipos y servicios base ya fueron alineados con backend
- el legacy propio del dominio `contact` ya fue retirado
- `ContactFormSection` ya delega submit y validación a hooks especializados
- la orquestación final queda cerrada por hooks separados y vista presentacional
- los textos y fallbacks del formulario ya quedaron aislados por idioma dentro del feature

### Fase 6.1. Reducción del scope cliente de la página

Tareas:

- mover la resolución de copy de la ruta a servidor cuando sea estable y serializable
- evitar lecturas redundantes de contexto cliente en piezas informativas
- documentar qué islas cliente quedan por necesidad real

Estado actual:

- iniciada en su primera pasada
- la ruta `contact` ya resuelve copy desde servidor
- `InfoSection` ya dejó de leer `useI18n()`
- `FAQSection` y `BusinessHoursStatus` ya dejaron de leer `useI18n()`
- la reducción del scope cliente no-form queda resuelta en su nivel práctico actual
- la justificación SSR/CSR correspondiente ya quedó documentada en el audit principal

### Fase 7. Cierre de la fase actual

Tareas:

- actualizar checklist viva del audit
- dejar claro qué quedó resuelto ahora y qué sigue diferido

Pendientes explícitos de la pasada manual transversal final:

- screenshots reales
- evidencia manual final
- validación funcional manual del flujo público y autenticado

## Orden recomendado

1. baseline documental
2. arquitectura y ownership de la página
3. i18n y fallbacks del surface no-form
4. render, accesibilidad y testing
5. estilos y migración visual del surface no-form
6. formulario e integración backend
7. cierre documental

## Regla de ejecución

Mientras `contact` siga abierta:

- no mover tipos a `packages/types` sin segundo consumidor real
- no mezclar el retrabajo del formulario con la rectificación base de la página
- no activar `v2` sin inventario previo
- no tratar metadata como sustituto de cierre estructural

## Primer siguiente paso recomendado

1. actualizar el audit y el plan principal para reflejar el estado real ya alcanzado
2. congelar el plan propio del formulario con base en el contrato backend vigente
3. inventariar servicios y tipos del dominio `contact` antes de tocar integración de componentes
4. dejar la implementación del formulario para una pasada dedicada
