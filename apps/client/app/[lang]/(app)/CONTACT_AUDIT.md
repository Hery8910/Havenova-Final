# Contact Audit

## Proposito

Este documento registra el estado actual de la ruta `contact` y la compara contra el estándar definido en [docs/PAGE_COMPLETION_STANDARD.md](/home/heriberto/Escritorio/Havenova/havenova/docs/PAGE_COMPLETION_STANDARD.md:1).

Estado:

- refleja el estado actual real
- identifica deuda estructural, de i18n, accesibilidad, estilos e integración
- separa explícitamente la deuda del formulario del resto de la página

## Fuentes revisadas

Ruta y metadata:

- [apps/client/app/[lang]/(app)/contact/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/contact/page.tsx:1)
- [apps/client/app/[lang]/(app)/contact/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/contact/layout.tsx:1)

Features consumidas:

- [packages/components/client/pages/contact/index.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/index.ts:1)
- [packages/components/client/pages/contact/ContactPage.view.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/ContactPage.view.tsx:1)
- [packages/components/client/pages/contact/ContactPageView.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/ContactPageView.module.css:1)
- [packages/components/client/pages/contact/contact.types.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/contact.types.ts:1)
- [packages/components/client/pages/contact/contact.fallbacks.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/contact.fallbacks.ts:1)
- [packages/components/client/pages/contact/ContactForm/ContactForm.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/ContactForm/ContactForm.tsx:1)
- [packages/components/client/pages/contact/ContactForm/ContactForm.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/ContactForm/ContactForm.module.css:1)
- [packages/components/client/pages/contact/InfoSection/InfoSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/InfoSection/InfoSection.tsx:1)
- [packages/components/client/pages/contact/InfoSection/InfoSection.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/InfoSection/InfoSection.module.css:1)
- [packages/components/client/faqSection/FAQSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/faqSection/FAQSection.tsx:1)
- [packages/components/client/pages/hero/PageHero.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/hero/PageHero.tsx:1)

Contenido, metadata e integración:

- [packages/i18n/de/pages.json](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/de/pages.json:707)
- [packages/i18n/en/pages.json](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/en/pages.json:707)
- [packages/i18n/es/pages.json](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/es/pages.json:707)
- [packages/i18n/de/components.json](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/de/components.json:160)
- [packages/i18n/en/components.json](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/en/components.json:160)
- [packages/i18n/es/components.json](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/es/components.json:160)
- [packages/i18n/metadata.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/metadata.ts:145)
- [packages/services/contact/contactService.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/contact/contactService.ts:1)
- [packages/types/contact/contactTypes.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/types/contact/contactTypes.ts:1)

Contrato backend de referencia para la fase del formulario:

- [/home/heriberto/Escritorio/Backend/havenova-backend/src/core/contact-message/FRONTEND_INTEGRATION.md](/home/heriberto/Escritorio/Backend/havenova-backend/src/core/contact-message/FRONTEND_INTEGRATION.md:1)
- [/home/heriberto/Escritorio/Backend/havenova-backend/src/core/contact-message/contactMessage.model.ts](/home/heriberto/Escritorio/Backend/havenova-backend/src/core/contact-message/contactMessage.model.ts:1)

Documentación derivada:

- [apps/client/app/[lang]/(app)/CONTACT_RENDER_TREE.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/CONTACT_RENDER_TREE.md:1)
- [apps/client/app/[lang]/(app)/CONTACT_STYLE_INVENTORY.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/CONTACT_STYLE_INVENTORY.md:1)
- [apps/client/app/[lang]/(app)/TESTING.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/TESTING.md:1)

Referencias del patrón ya aplicado:

- [apps/client/app/[lang]/(app)/HOME_PAGE_AUDIT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/HOME_PAGE_AUDIT.md:1)
- [apps/client/app/[lang]/(app)/ABOUT_AUDIT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/ABOUT_AUDIT.md:1)
- [apps/client/app/[lang]/(app)/HOW_IT_WORK_AUDIT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/HOW_IT_WORK_AUDIT.md:1)

## Diagnostico ejecutivo

Sí, tu lectura es correcta.

`Home`, `About` y `How it works` ya tienen baseline documental y una rectificación estructural visible. `Contact` ya inició esa misma rectificación, pero todavía no está cerrada.

Lo que ya está bien:

- la ruta ya tiene metadata por `layout.tsx`
- la composición funcional es acotada y entendible: hero, bloque central, información de contacto y FAQ
- el hero ya consume el shared `PageHero`
- `InfoSection` y `FAQSection` ya existen como piezas separadas
- hay copy en `de`, `en` y `es` para el surface visible de la página
- la ruta ya fue reducida a entrypoint y resuelve copy desde servidor
- la composición principal ya vive en `ContactPageView`
- los tipos page-local ya fueron extraídos a `contact.types.ts`

Lo que todavía no cumple el estándar:

- la evidencia manual real y los screenshots finales siguen pendientes
- la validación funcional manual del formulario sigue pendiente
- la validación visual final sigue diferida
- el dominio frontend de `contact` ya fue alineado en su base, pero aún queda el cierre de integración manual

Conclusión:

- `Contact` es la siguiente página pendiente del mismo proceso
- conviene dividir el trabajo en dos etapas: primero la página informativa y su arquitectura; al final el formulario y su contrato backend

## Hallazgos

### 1. La ruta sigue en el patrón anterior a la rectificación

Estado actual:

- [page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/contact/page.tsx:1) ya quedó reducido a entrypoint
- la ruta ya resuelve `contact`, `footer` y `faq` desde `@havenova/i18n` en servidor
- la composición principal vive en [ContactPage.view.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/ContactPage.view.tsx:1)
- los contratos page-local viven en [contact.types.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/contact.types.ts:1)

Problema:

- la separación base ya existe y mejoró el carril SSR, pero todavía falta cerrar formalmente la estrategia SSR/CSR del surface restante

Objetivo:

- consolidar el patrón `page(server) -> ContactPageView`
- completar los fallbacks y el baseline documental del feature

### 2. La estrategia de fallback ya quedó resuelta en la base

Estado actual:

- `ContactPageView` ya resuelve hero e información de contacto mediante [contact.fallbacks.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/contact.fallbacks.ts:1)
- [FAQSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/faqSection/FAQSection.tsx:1) ya acepta `texts` opcionales y resuelve fallback visible en vez de devolver `null`
- `InfoSection` ya recibe fallbacks completos de aria y quick actions resueltos por idioma
- `ContactFormSection` ya consume fallbacks propios del feature desde `contactForm.fallbacks.ts`

Lectura actual:

- el surface no-form ya no desaparece por ausencia de i18n
- hero, info, quick actions, FAQ y formulario ya tienen fallback editorial por idioma como baseline local del feature

Objetivo:

- mantener el ownership del copy local dentro del feature
- dejar la validación manual del render real para el cierre final

### 3. La ownership está mezclada entre surface informativa y formulario

Estado actual:

- `InfoSection` es una pieza relativamente presentacional
- `ContactFormSection` ya no concentra todo el dominio: el submit y la validación fueron extraídos a hooks dedicados
- el submit depende de [contactService.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/contact/contactService.ts:1)
- `useContactFormSubmission.ts` ya concentra payload, submit y alerts
- `useContactFormValidation.ts` ya concentra reglas de validación
- `InfoSection` ya no lee `useI18n()` y recibe su copy desde la ruta

Problema:

- la separación base ya quedó definida con hooks especializados, pero la integración manual completa sigue pendiente
- todavía faltan validación funcional real, validación visual y evidencia final

Decisión:

- separar el formulario como última tarea
- concentrar la primera rectificación en hero, layout, info section, FAQ, fallbacks, render tree y estilo

### 3.1. El dominio frontend de contacto quedó desfasado respecto al backend

Estado actual:

- el backend expone `POST /api/contact`, `GET /api/contact`, `PATCH /api/contact/:id/respond`, `DELETE /api/contact` y `DELETE /api/contact/:id`
- el frontend hoy declara `createContactMessage`, `listContactMessages`, `respondContactMessage`, `deleteContactMessage` y `deleteContactMessages`
- el backend persiste un modelo estructurado con `source`, `sender`, `content`, `response`, `configurationSnapshot`, `status` y `anonymizedAt`
- los tipos frontend ya fueron migrados a ese shape estructurado como contrato canónico

Problema:

- el dominio ya quedó alineado en payloads, tipos y servicios base
- el formulario ya no depende de `auth.clientId`, pero sigue pendiente la limpieza final de ownership entre UI, copy y orchestration

Objetivo:

- congelar primero el inventario completo del dominio frontend de `contact`
- alinear payloads, respuestas y tipos con el backend real antes de tocar integración visual o de componentes

### 4. La ruta todavía no tiene justificación SSR/CSR ni scope cliente minimizado

Estado actual:

- la ruta ya quedó reducida a entrypoint server-driven y resuelve copy vía `@havenova/i18n`
- `InfoSection` sólo mantiene dependencia cliente por `useClient()` para `schedule`
- `ContactFormSection` necesita cliente por interacción y submit
- `FAQSection` y `BusinessHoursStatus` ya no leen contexto i18n y permanecen como islas cliente sólo por interacción/estado interno

Problema:

- la página ya no quedó client-only en su capa de datos, pero todavía conviven varias islas cliente dentro del mismo surface
- el scope cliente ya fue reducido en su segunda pasada razonable; una reducción adicional tendría rendimiento marginal y costo estructural mayor

Objetivo:

- justificar explícitamente el split SSR/CSR
- dejar documentado qué islas cliente permanecen por necesidad real y cuáles ya fueron reducidas al mínimo práctico

### 5. La metadata está mejor que la arquitectura

Estado actual:

- [layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/contact/layout.tsx:1) ya usa `getPageMetadata(params.lang, 'contact')`
- [packages/i18n/metadata.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/metadata.ts:145) ya cubre `en`, `de` y `es`

Hallazgo:

- metadata no es hoy el principal problema de `contact`
- la deuda real está en arquitectura, fallbacks, documentación y ownership

Riesgo residual:

- metadata ya no es la deuda principal; lo pendiente real es validar manualmente el surface ya migrado

### 6. La superficie visual todavía no tiene baseline `v2`

Estado actual:

- [page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/contact/page.tsx:1) ya importa `../../migration-styles/index.css`
- [ContactPageView.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/ContactPageView.module.css:1) ahora concentra el layout de la página
- `InfoSection.module.css` ya recibió una primera migración a `v2`
- `ContactForm.module.css` y `FAQSection` siguen fuera de la migración de esta fase

Problema:

- la ruta ya entra al carril `v2`, pero todavía convive con superficies legacy por decisión explícita de alcance

Objetivo:

- congelar primero un style inventory real
- decidir después la migración visual del surface no-form antes de tocar el formulario

## Resultado preliminar del audit de i18n

### Scope visible de página identificado

Surface detectada:

- `pages.client.contact.hero.*`
- `components.client.footer.contact.*`
- `components.client.footer.hoursStatus.*`
- `components.client.contact.aria.*`
- `components.client.contact.quickActions.*`
- `components.client.faq.*`
- metadata de la ruta

Scope diferido para la fase de formulario:

- `components.client.form.labels.*`
- `components.client.form.placeholders.*`
- `components.client.form.error.*`
- `components.client.form.subjects.contact`
- `components.client.form.button.contact`
- `texts.popups.*` usados por submit y errores

Interpretacion:

- el audit de i18n de `contact` debe ejecutarse en dos capas
- primero el surface informativo de la página
- después el contrato textual completo del formulario

## Riesgos

- si se toca el formulario antes de aislar la página informativa, se mezcla rectificación de arquitectura con migración de contrato backend
- si se conserva el payload viejo del formulario, el frontend seguirá enviando campos de identidad que el backend ya no espera como fuente de verdad
- si se modela el listado interno con el shape aplanado actual, dashboard y respuestas del tenant quedarán sobre tipos incorrectos
- si se migra a `v2` sin inventario previo, se repetirá el crecimiento difuso de estilos que ya se intentó corregir en las páginas anteriores

## Decisiones cerradas

- `Contact` es la siguiente página pendiente del flujo de rectificación
- `Home`, `About` y `How it works` se toman como referencia válida del estándar actual
- el formulario queda fuera del primer bloque de rectificación y se trata como última tarea
- `Footer` sigue fuera de alcance, salvo el consumo puntual de su copy de contacto por `InfoSection`

## Estado al cierre de hoy

Para esta fase:

- baseline documental: iniciado con este audit
- arquitectura: resuelta en la base
- fallbacks visibles del surface no-form: resueltos en la base
- i18n del surface informativo: resuelto en la base con fallback editorial por idioma
- render y testing: baseline documental resuelta
- inventario de estilos: baseline documental resuelta
- migración visual no-form: iniciada en código para `InfoSection`
- formulario e integración backend: diferidos a la última fase
- contrato backend del formulario: ya revisado y traducido a su dominio frontend base
- dominio frontend del formulario: alineado en su base con hooks de submit y validación ya extraídos
- legacy propio del dominio `contact`: retirado en servicios, tipos y consumidores principales
- ownership del copy del formulario: resuelto dentro del feature mediante fallbacks locales

## Plan de trabajo

La ejecución detallada queda en:

- [CONTACT_PLAN.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/CONTACT_PLAN.md:1)
- [CONTACT_FORM_PLAN.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/CONTACT_FORM_PLAN.md:1)
