# Cleaning Service Audit

## Proposito

Este documento registra el estado actual de la ruta `cleaning-service` frente al estándar definido en [docs/PAGE_COMPLETION_STANDARD.md](/home/heriberto/Escritorio/Havenova/havenova/docs/PAGE_COMPLETION_STANDARD.md:1) y al patrón de construcción definido en [docs/PAGE_CONSTRUCTION_PATTERN.md](/home/heriberto/Escritorio/Havenova/havenova/docs/PAGE_CONSTRUCTION_PATTERN.md:1).

Estado:

- refleja el estado actual real
- separa la corrección de arquitectura del cierre funcional/visual del formulario
- documenta qué ya entró al patrón canónico y qué sigue siendo deuda

## Fuentes revisadas

Ruta y metadata:

- [apps/client/app/[lang]/(app)/cleaning-service/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/cleaning-service/page.tsx:1)
- [apps/client/app/[lang]/(app)/cleaning-service/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/cleaning-service/layout.tsx:1)

Feature surface:

- [packages/components/client/pages/cleaning-service/index.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/cleaning-service/index.ts:1)
- [packages/components/client/pages/cleaning-service/CleaningServicePage.client.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/cleaning-service/CleaningServicePage.client.tsx:1)
- [packages/components/client/pages/cleaning-service/CleaningServicePage.view.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/cleaning-service/CleaningServicePage.view.tsx:1)
- [packages/components/client/pages/cleaning-service/cleaningService.types.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/cleaning-service/cleaningService.types.ts:1)
- [packages/components/client/pages/shared/serviceRequest/AuthRequiredAlert/AuthRequiredAlert.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/AuthRequiredAlert/AuthRequiredAlert.tsx:1)
- [packages/components/client/pages/cleaning-service/CleaningRequestForm/CleaningRequestForm.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/cleaning-service/CleaningRequestForm/CleaningRequestForm.tsx:1)
- [packages/components/client/pages/hero/PageHero.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/hero/PageHero.tsx:1)
- [packages/components/client/faqSection/FAQSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/faqSection/FAQSection.tsx:1)
- [packages/components/client/pages/shared/ServiceCrossCtaSection/ServiceCrossCtaSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/ServiceCrossCtaSection/ServiceCrossCtaSection.tsx:1)
- [packages/components/client/pages/shared/serviceRequest/ServiceRequestPageLayout/ServiceRequestPageLayout.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/ServiceRequestPageLayout/ServiceRequestPageLayout.tsx:1)
- [packages/components/client/pages/shared/serviceRequest/ServiceRequestShell/ServiceRequestShell.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/ServiceRequestShell/ServiceRequestShell.tsx:1)
- [packages/components/client/pages/shared/serviceRequest/AvailabilityCalendar/AvailabilityCalendar.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/AvailabilityCalendar/AvailabilityCalendar.tsx:1)
- [packages/components/client/pages/shared/serviceRequest/WorkAddressSelector/WorkAddressSelector.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/WorkAddressSelector/WorkAddressSelector.tsx:1)
- [packages/components/client/pages/shared/serviceRequest/serviceRequestProfile.helpers.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/serviceRequestProfile.helpers.ts:1)

## Diagnostico ejecutivo

`cleaning-service` ya entró al patrón canónico de construcción de páginas, pero todavía no puede tratarse como página cerrada.

Lo que ya está bien:

- la ruta ya no es un bucket cliente con tipos, submit, i18n y layout mezclados
- `page.tsx` ya actúa como entrypoint server-first
- la orquestación cliente vive en `CleaningServicePageClient`
- `CleaningServicePageView` compone la ruta usando shared request primitives
- `CleaningRequestForm` ya dejó de redefinir inline su contrato de feature; ese ownership vive en
  `cleaningRequest.types.ts`
- la orquestación de perfil embebido ya no vive en `cleaning-service`; ahora pertenece al dominio
  de perfil
- el render tree y el inventario de estilos ya existen como baseline documental de la ruta
- los tipos page-local ya salieron del route file
- metadata sigue resuelta en `layout.tsx`

Lo que todavía no cumple el estándar:

- no existe evidencia manual real específica de la ruta
- el formulario sigue siendo el principal foco de deuda funcional y visual

Conclusión:

- la arquitectura base ya está en progreso real
- el siguiente trabajo ya no es “mover archivos”, sino validar semántica, estilo y comportamiento del flow

## Hallazgos

### 1. La ruta ya fue rectificada al patrón canónico

Estado actual:

- la ruta ya resuelve copy desde servidor
- `CleaningServicePageClient` concentra auth, alerts, submit y draft ownership
- `CleaningServicePageView` concentra la composición feature
- `ServiceRequestPageLayout` ya owns el shell visual repetido de la ruta

Interpretación:

- la ruta ya cumple el patrón `page(server) -> feature client -> feature view`
- este cambio reduce significativamente la deuda estructural del route file

### 2. El split SSR/CSR ya está justificado para esta fase

Estado actual:

- el route entry ya es server
- el surface principal sigue necesitando cliente por:
  - auth gate
  - draft persistence
  - submit
  - embedded profile completion submit/update
  - global alerts

Justificación:

- `page.tsx` ya conserva en servidor la lectura de contenido, metadata y composición inicial
- el surface cliente no se mantiene por conveniencia visual, sino por dependencias reales de
  navegador y sesión
- el formulario concentra persistencia de draft, branching multi-step y side effects de submit
  que hoy no pueden migrarse a server sin rediseñar el flow
- la actualización embebida de perfil también depende de auth, estado cliente y alerts globales

Decisión de cierre para esta fase:

- el split actual se considera defendible y suficientemente acotado
- no se justifica una reducción adicional de CSR mientras el formulario siga siendo el principal
  surface interactivo y no exista una estrategia distinta para draft persistence y alerts
- cualquier futura reducción de CSR debe venir desde una refactorización del flow, no desde mover
  superficialmente componentes entre server y client

### 3. La semántica general ya es revisable, pero no está cerrada

Estado actual:

- `PageHero` ya aporta landmark, heading y copy estructurados
- `main#app-main-content` ya existe
- `AuthRequiredAlert` ya usa `role="dialog"` y relaciones `aria-*`
- `FAQSection` ya entra como bloque interactivo real
- `ServiceCrossCtaSection` ya expone heading propio, descripción asociada y navegación de acciones
- `ServiceRequestPageLayout` ya mantiene una secuencia estable `hero -> main -> alert -> form -> faq -> related`

Riesgo:

- la ruta todavía no tiene una revisión documentada de orden de foco, relación entre alerta y formulario, ni secuencia real de teclado

Baseline semántica cerrable por código:

- existe landmark principal único (`main#app-main-content`)
- el hero, FAQ y CTA related exponen headings explícitos
- el alerta de auth ya se presenta como diálogo modal con título, descripción y acciones nombradas
- FAQ usa `button`, `aria-expanded`, `aria-controls` y región asociada por item
- la sección related usa `nav` para las acciones de salida

Pendiente solo por evidencia manual final:

- confirmar orden de foco real con y sin `AuthRequiredAlert`
- confirmar retorno/captura de foco en el alert visible
- confirmar navegación por teclado a través del flow multi-step sin inconsistencias del formulario

### 4. El formulario sigue siendo deuda separada

Estado actual:

- el formulario funciona como bloque principal de conversión
- sigue siendo un surface grande, interactivo y con varias ramas
- todavía puede contener inconsistencias funcionales o de modelado

Regla para esta fase:

- no bloquear la rectificación de la página por inconsistencias internas no cerradas del formulario
- registrar explícitamente esa deuda en vez de mezclarla con la arquitectura de página

## Estado al cierre de esta pasada

Completado ahora:

- route entry reducido a composición server
- `CleaningServicePageClient`
- `CleaningServicePageView`
- `cleaningService.types.ts`
- layout de página movido al feature y luego promovido a `ServiceRequestPageLayout`
- baseline documental de auditoría y render

Pendiente:

- evidencia manual real
- revisión semántica y de foco de la ruta
- auditoría funcional específica del formulario
