# Home Service Audit

## Proposito

Este documento registra el estado actual de la ruta `home-service` frente al estándar definido en [docs/PAGE_COMPLETION_STANDARD.md](/home/heriberto/Escritorio/Havenova/havenova/docs/PAGE_COMPLETION_STANDARD.md:1) y al patrón de construcción definido en [docs/PAGE_CONSTRUCTION_PATTERN.md](/home/heriberto/Escritorio/Havenova/havenova/docs/PAGE_CONSTRUCTION_PATTERN.md:1).

Estado:

- refleja el estado actual real
- separa la corrección de arquitectura del cierre funcional del formulario
- reconoce explícitamente que el flow todavía puede contener inconsistencias

## Fuentes revisadas

Ruta y metadata:

- [apps/client/app/[lang]/(app)/home-service/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/home-service/page.tsx:1)
- [apps/client/app/[lang]/(app)/home-service/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/home-service/layout.tsx:1)

Feature surface:

- [packages/components/client/pages/home-service/index.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home-service/index.ts:1)
- [packages/components/client/pages/home-service/HomeServicePage.client.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home-service/HomeServicePage.client.tsx:1)
- [packages/components/client/pages/home-service/HomeServicePage.view.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home-service/HomeServicePage.view.tsx:1)
- [packages/components/client/pages/home-service/homeServicePage.types.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home-service/homeServicePage.types.ts:1)
- [packages/components/client/pages/home-service/HomeServiceRequestForm/HomeServiceRequestForm.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/home-service/HomeServiceRequestForm/HomeServiceRequestForm.tsx:1)
- [packages/components/client/pages/hero/PageHero.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/hero/PageHero.tsx:1)
- [packages/components/client/faqSection/FAQSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/faqSection/FAQSection.tsx:1)
- [packages/components/client/pages/shared/ServiceCrossCtaSection/ServiceCrossCtaSection.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/ServiceCrossCtaSection/ServiceCrossCtaSection.tsx:1)
- [packages/components/client/pages/shared/serviceRequest/AuthRequiredAlert/AuthRequiredAlert.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/AuthRequiredAlert/AuthRequiredAlert.tsx:1)
- [packages/components/client/pages/shared/serviceRequest/ServiceRequestPageLayout/ServiceRequestPageLayout.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/ServiceRequestPageLayout/ServiceRequestPageLayout.tsx:1)
- [packages/components/client/pages/shared/serviceRequest/ServiceRequestShell/ServiceRequestShell.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/ServiceRequestShell/ServiceRequestShell.tsx:1)
- [packages/components/client/pages/shared/serviceRequest/AvailabilityCalendar/AvailabilityCalendar.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/AvailabilityCalendar/AvailabilityCalendar.tsx:1)
- [packages/components/client/pages/shared/serviceRequest/WorkAddressSelector/WorkAddressSelector.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/WorkAddressSelector/WorkAddressSelector.tsx:1)
- [packages/components/client/pages/shared/serviceRequest/serviceRequestProfile.helpers.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/serviceRequestProfile.helpers.ts:1)

## Diagnostico ejecutivo

`home-service` ya entró al patrón canónico de construcción de páginas, pero todavía no está lista para considerarse estable ni reproducible.

Lo que ya está bien:

- la ruta ya no concentra types, submit, i18n y layout en `page.tsx`
- `page.tsx` ya actúa como entrypoint server-first
- `HomeServicePageClient` concentra la orquestación cliente
- `HomeServicePageView` compone la ruta usando shared request primitives
- `HomeServiceRequestForm` ya dejó de redefinir inline su contrato de feature; ese ownership vive
  en `homeServiceRequest.types.ts`
- el render tree y el inventario de estilos ya existen como baseline documental de la ruta
- metadata sigue resuelta en `layout.tsx`

Lo que todavía no cumple el estándar:

- el formulario todavía puede contener inconsistencias no resueltas

Conclusión:

- la arquitectura base ya está en progreso real
- el mayor riesgo ya no está en el route file, sino en el surface interactivo central

## Hallazgos

### 1. La ruta ya fue rectificada al patrón canónico

Estado actual:

- la ruta resuelve copy desde servidor
- la orquestación cliente ya no vive en el route entry
- el layout principal ya pertenece al feature
- el shell visual repetido ya fue promovido a `ServiceRequestPageLayout`

Interpretación:

- el patrón `page(server) -> feature client -> feature view` ya existe
- esto facilita migrar o clonar la página con menos acoplamiento al app route

### 2. El formulario sigue siendo deuda separada

Estado actual:

- `HomeServiceRequestForm` sigue siendo el principal surface interactivo
- el flow todavía puede contener inconsistencias funcionales o de modelado
- la rectificación de arquitectura no debe confundirse con cierre funcional del formulario

Regla:

- no considerar estable el formulario solo porque la página ya fue extraída correctamente
- mantener deuda del flow documentada por separado

### 3. La semántica general ya es revisable, pero no está cerrada

Estado actual:

- `PageHero` ya aporta landmark y heading de entrada
- `main#app-main-content` ya existe dentro de `ServiceRequestPageLayout`
- `AuthRequiredAlert` ya usa `role="dialog"` y relaciones `aria-*`
- `FAQSection` y `ServiceCrossCtaSection` ya exponen estructura interactiva nominalmente correcta
- la secuencia visual principal ya está estabilizada como `hero -> alert -> form -> faq -> related`

Baseline semántica cerrable por código:

- existe landmark principal único para la ruta
- FAQ usa triggers `button` con expansión controlada y panel asociado
- la CTA cross-service usa navegación y acciones nombradas
- el alert de auth ya declara título, descripción y grupo de acciones

Pendiente solo por evidencia manual final:

- confirmar orden de foco real con y sin alerta visible
- confirmar la variante probada del branch de formulario dentro del flujo
- confirmar que el shell mantiene foco visible y navegación consistente alrededor del formulario

### 4. El split SSR/CSR ya está justificado para esta fase

Estado actual:

- el route entry ya es server
- el feature sigue necesitando cliente por auth gate, alerts, submit y branching del formulario

Justificación:

- `page.tsx` ya retiene en servidor la carga de copy, metadata y composición inicial de la ruta
- el surface cliente actual responde al comportamiento real del flow: selección de tipo de
  servicio, branching de steps, validación local y submit interactivo
- `home-service` ya reutiliza primitives compartidos, por lo que la amplitud cliente no viene de
  duplicación estructural sino del propio comportamiento del formulario
- a diferencia de `cleaning-service`, esta ruta todavía no necesita profile gate embebido, por lo
  que su scope cliente ya es algo más acotado dentro del mismo patrón general

Decisión de cierre para esta fase:

- el split actual se considera suficientemente defendido para seguir con el cierre de página
- no se justifica crear más capas solo para reducir CSR sin cambiar el modelo interactivo del
  formulario
- cualquier reducción futura de CSR debe venir de simplificar el flow o de separar side effects,
  no de mover composición inerte

## Estado al cierre de esta pasada

Completado ahora:

- route entry reducido a composición server
- `HomeServicePageClient`
- `HomeServicePageView`
- `homeServicePage.types.ts`
- layout de página movido al feature y luego promovido a `ServiceRequestPageLayout`
- baseline documental de auditoría y render

Pendiente:

- evidencia manual real
- revisión semántica y de foco de la ruta
- auditoría funcional específica del formulario
