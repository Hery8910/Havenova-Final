# Contact Form Plan

## Objetivo

Definir una fase específica para alinear el dominio frontend de `contact` con el backend vigente antes de integrar o reescribir los componentes del formulario.

Estado del documento:

- plan de trabajo activo
- actualizado tras la primera pasada real de dominio, submit y validación

## Fuentes de verdad

Backend:

- [/home/heriberto/Escritorio/Backend/havenova-backend/src/core/contact-message/FRONTEND_INTEGRATION.md](/home/heriberto/Escritorio/Backend/havenova-backend/src/core/contact-message/FRONTEND_INTEGRATION.md:1)
- [/home/heriberto/Escritorio/Backend/havenova-backend/src/core/contact-message/contactMessage.model.ts](/home/heriberto/Escritorio/Backend/havenova-backend/src/core/contact-message/contactMessage.model.ts:1)

Frontend actual:

- [packages/components/client/pages/contact/ContactForm/ContactForm.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/ContactForm/ContactForm.tsx:1)
- [packages/components/client/pages/contact/ContactForm/ContactForm.view.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/ContactForm/ContactForm.view.tsx:1)
- [packages/components/client/pages/contact/ContactForm/useContactFormSubmission.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/ContactForm/useContactFormSubmission.ts:1)
- [packages/components/client/pages/contact/ContactForm/useContactFormValidation.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/ContactForm/useContactFormValidation.ts:1)
- [packages/components/client/pages/contact/ContactForm/contactForm.fallbacks.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/ContactForm/contactForm.fallbacks.ts:1)
- [packages/components/client/pages/contact/ContactForm/contactForm.types.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/ContactForm/contactForm.types.ts:1)
- [packages/services/contact/contactService.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/contact/contactService.ts:1)
- [packages/services/contact/index.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/contact/index.ts:1)
- [packages/types/contact/contactTypes.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/types/contact/contactTypes.ts:1)
- [packages/types/contact/index.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/types/contact/index.ts:1)
- [packages/components/client/pages/contact/index.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/index.ts:1)

## Alcance

Esta fase cubre:

- la definición del dominio frontend de `contact`
- el inventario de todos los servicios del dominio
- la alineación de payloads y respuestas con el backend
- la separación entre contratos públicos del formulario y contratos internos de dashboard
- la estrategia de ownership entre servicios, tipos y componentes

Esta fase no cubre todavía:

- integración final del formulario con nuevos componentes
- rework visual del `ContactFormSection`
- wiring final con dashboard o notificaciones
- ejecución manual final de la interacción completa

## Contrato backend que condiciona el diseño frontend

Reglas ya confirmadas:

- `POST /api/contact` es público
- el frontend no debe enviar identidad autenticada como fuente de verdad
- si hay sesión, el backend deriva `userClientId` desde `req.user`
- `language` es opcional y soporta `de | en | es`
- la respuesta de creación devuelve `data.id`
- el modelo persistido ya no es plano: usa `source`, `sender`, `content`, `response`, `configurationSnapshot`, `status` y `anonymizedAt`

Consecuencia:

- el formulario público y las vistas internas no deben compartir ciegamente el mismo shape viejo
- el dominio frontend necesita separar contratos de create, list, respond y delete

## Inventario actual del dominio frontend

Servicios declarados hoy:

- `createContactMessage`
- `listContactMessages`
- `respondContactMessage`
- `deleteContactMessage`
- `deleteContactMessages`

Servicios del backend que aún no están declarados de forma explícita:

- `DELETE /api/contact` para borrado masivo

Desalineaciones detectadas:

- la validación manual del flujo sigue pendiente
- la validación visual y los screenshots finales siguen fuera de esta pasada

Avance ya realizado:

- `ContactMessageCreatePayload` ya no incluye `userId`
- el payload público ya declara `language`
- los tipos de listado y respuesta ya fueron alineados con el shape estructurado del backend
- `contactService` ya normaliza `list` y `respond` al contrato frontend nuevo
- los aliases legacy `sendContactMessage` y `getContactMessages` ya fueron retirados
- `ContactMessageFormData` ya fue eliminado del dominio `contact`
- el formulario público ya no depende de `auth.clientId` para enviar
- `ContactFormSection` ya separa submit y validación mediante hooks dedicados
- `ContactFormSection` ya actúa como wrapper del feature y delega el markup a `ContactFormView`
- el ownership del copy/fallback del formulario ya quedó dentro del feature mediante `contactForm.fallbacks.ts`
- los fallbacks editoriales del formulario ya quedaron resueltos por idioma (`de`, `en`, `es`)
- la estrategia final de orquestación ya quedó cerrada a favor de hooks separados por responsabilidad

## Resultado esperado

Al terminar esta fase, el dominio frontend de `contact` debe cumplir como mínimo:

- tipos separados para create, list, respond y delete
- payload público de create alineado con el backend real
- shape de lectura alineado con el modelo actual del backend
- inventario completo de servicios disponibles en el dominio
- plan explícito para integrar el formulario sin mezclar contrato e interfaz
- decisión cerrada sobre la forma final de orquestación

## Fases

### Fase 1. Baseline documental del dominio

Tareas:

- congelar el estado actual de `ContactFormSection`
- registrar el inventario real de servicios frontend y endpoints backend
- documentar la diferencia entre flujo público y flujo autenticado

Criterio de cierre:

- existe una base documental que evita redescubrir el contrato en cada cambio

Estado actual:

- resuelta
- el contrato backend y el inventario frontend ya quedaron registrados

### Fase 2. Inventario y ownership de servicios

Tareas:

- declarar el alcance completo del dominio `packages/services/contact/*`
- decidir qué funciones siguen siendo públicas del dominio y cuáles son aliases legacy a retirar
- documentar si el borrado masivo debe exponerse ahora o reservarse para dashboard

Criterio de cierre:

- el dominio de servicios tiene ownership claro y cubre todos los endpoints que el frontend realmente necesita declarar

Estado actual:

- resuelta en su capa base
- el dominio ya declara create, list, respond, delete simple y delete masivo
- ya no quedan aliases legacy dentro del dominio `contact`

### Fase 3. Alineación de tipos con backend

Tareas:

- redefinir `ContactMessageCreatePayload` según el contrato vigente
- separar tipos de surface pública y de vistas internas
- modelar el shape estructurado del mensaje: `source`, `sender`, `content`, `response`, `status`, `anonymizedAt`
- revisar respuestas `create`, `list`, `respond`, `delete` y borrado masivo

Criterio de cierre:

- los tipos frontend ya no describen el contrato viejo

Estado actual:

- resuelta en la base
- `packages/types/contact/contactTypes.ts` ya refleja payload público, shape estructurado y respuestas principales del dominio

### Fase 4. Estrategia de integración con componentes

Tareas:

- decidir qué parte del submit permanece en `ContactFormSection` y qué parte debe salir a un adapter o hook
- definir el mínimo contrato que consumirán los componentes
- separar validación visual, copy, submit y side effects de alertas

Criterio de cierre:

- existe un punto de integración claro para reescribir el formulario sin volver a mezclar dominio e interfaz

Regla:

- esta fase sólo define la estrategia; la integración real vendrá después

Estado actual:

- iniciada y parcialmente resuelta
- `useContactFormSubmission` ya concentra submit, payload y alerts
- `useContactFormValidation` ya concentra reglas de validación
- `resolveContactFormTexts` ya concentra textos y fallbacks del formulario
- `contactForm.types.ts` ya concentra contratos page-local del formulario
- `ContactFormSection` quedó reducido a estado de UI y composición de hooks/views
- la decisión de arquitectura queda cerrada: mantener hooks separados por responsabilidad

### Fase 5. Ejecución diferida

Tareas:

- implementar servicios, tipos y adaptación de componentes
- validar flujos con y sin sesión
- validar errores y estados de éxito

Criterio de cierre:

- el formulario opera sobre el contrato vigente del backend y la UI queda alineada con ese dominio

Estado actual:

- iniciada parcialmente
- ya se ejecutó la alineación base de tipos, servicios y separación de responsabilidades
- faltan validación manual, validación visual/screenshot y cierre final de la página

## Estado actual resumido

Ya quedó resuelto:

- alineación base del dominio `contact` con backend
- eliminación de `userId` del payload público
- adopción de `language` en submit
- soporte frontend para delete masivo
- eliminación de aliases y tipos legacy propios del dominio `contact`
- separación de validación y submit fuera de `ContactFormSection`
- separación del markup presentacional en `ContactFormView`

Sigue abierto:

- validar manualmente el flujo público y autenticado
  pendiente de forma explícita para una pasada posterior
- ejecutar validación visual y screenshots al final

## Riesgos

- si se actualiza el componente antes que el dominio, se consolidarán tipos erróneos en la UI
- si se mantiene `userId` en el payload público, el frontend seguirá declarando una fuente de identidad incorrecta
- si no se separan vistas públicas e internas, el listado del dashboard quedará atado a un shape incompleto
- si no se inventaria el dominio completo, el frontend seguirá teniendo servicios parciales y aliases ambiguos

## Orden recomendado

1. baseline documental del dominio
2. inventario completo de servicios
3. alineación de tipos
4. estrategia de integración con componentes
5. implementación real

## Relación con la documentación principal

Este plan complementa, no reemplaza:

- [CONTACT_AUDIT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/CONTACT_AUDIT.md:1)
- [CONTACT_PLAN.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/CONTACT_PLAN.md:1)
