# Home Service Plan

## Purpose

Definir una secuencia de trabajo controlada para llevar `home-service` al mismo baseline documental y estructural aplicado en el resto de páginas públicas, sin asumir que el formulario ya está completamente estable.

## Fase 1. Arquitectura base

Tareas:

- reducir `page.tsx` a entrypoint server
- mover la orquestación cliente a una superficie feature-owned
- mover la composición visual a `HomeServicePageView`
- extraer tipos page-local

Criterio de cierre:

- la ruta cumple el patrón `page(server) -> feature client -> feature view`

Estado actual:

- completada en esta pasada

## Fase 2. Baseline documental

Tareas:

- crear audit de la ruta
- crear render tree
- conectar la ruta con la guía de testing manual
- registrar explícitamente la posibilidad de inconsistencias en el formulario

Criterio de cierre:

- la página tiene baseline documental suficiente para seguir iterando sin perder contexto

Estado actual:

- completada

## Fase 3. SSR/CSR y scope cliente

Tareas:

- justificar el split SSR/CSR actual
- decidir si el scope cliente del feature ya es el mínimo razonable
- diferenciar deuda de página y deuda del flow de formulario

Criterio de cierre:

- la amplitud del surface cliente está documentada y defendida técnicamente

Estado actual:

- completada

## Fase 4. Semántica, accesibilidad y testing

Tareas:

- validar orden de foco con y sin alert visible
- validar la secuencia hero -> alert -> form -> FAQ -> CTA -> footer
- registrar caso manual específico
- anotar qué variante de servicio se usó en la validación

Criterio de cierre:

- la página tiene baseline semántico y de teclado documentado

Estado actual:

- en progreso

## Fase 5. Estilos e identidad visual

Tareas:

- crear inventario de estilos
- clasificar ownership entre layout de página, hero, form surface, FAQ y CTA cross-service
- distinguir deuda visual del formulario respecto a la deuda estructural de la página

Criterio de cierre:

- existe un mapa claro de responsabilidades visuales de la ruta

Estado actual:

- completada

## Fase 6. Formulario como tarea separada

Tareas:

- revisar branches por tipo de servicio
- revisar validación y payload mapping
- revisar estados de éxito/error
- revisar consistencia entre steps

Regla:

- esta fase no bloquea el baseline de arquitectura de la página
- cualquier inconsistencia actual del formulario debe documentarse como deuda separada

Estado actual:

- en progreso
- el formulario ya comparte primitives estructurales con `cleaning-service`
- la deuda restante se concentra en consistencia de flow, validación manual y comportamiento real de los steps
