# Cleaning Service Plan

## Purpose

Definir una secuencia de trabajo controlada para llevar `cleaning-service` al mismo baseline documental y estructural ya aplicado a otras páginas públicas, sin mezclar arquitectura, estilo, accesibilidad y retrabajo del formulario en una sola pasada.

## Fase 1. Arquitectura base

Tareas:

- reducir `page.tsx` a entrypoint server
- mover la orquestación cliente a una superficie feature-owned
- mover la composición visual a `CleaningServicePageView`
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
- registrar explícitamente la deuda del formulario

Criterio de cierre:

- la página tiene baseline documental suficiente para seguir iterando sin perder contexto

Estado actual:

- completada

## Fase 3. SSR/CSR y scope cliente

Tareas:

- justificar el split SSR/CSR actual
- decidir si el scope cliente del feature ya es el mínimo razonable
- distinguir deuda de página contra deuda del formulario

Criterio de cierre:

- la amplitud del surface cliente está documentada y defendida técnicamente

Estado actual:

- completada

## Fase 4. Semántica, accesibilidad y testing

Tareas:

- validar orden de foco
- revisar el comportamiento de `AuthRequiredAlert`
- validar la secuencia hero -> alert -> form -> FAQ -> CTA -> footer
- registrar caso manual específico

Criterio de cierre:

- la página tiene baseline semántico y de teclado documentado

Estado actual:

- en progreso
- la revisión semántica por código ya quedó asentada en el audit
- la evidencia manual real queda diferida a la pasada transversal final

## Fase 5. Estilos e identidad visual

Tareas:

- crear inventario de estilos
- clasificar ownership entre layout de página, hero, form surface, FAQ y CTA cross-service
- separar deuda estructural de deuda puramente visual

Criterio de cierre:

- existe un mapa claro de responsabilidades visuales de la ruta

Estado actual:

- completada

## Fase 6. Formulario como tarea separada

Tareas:

- revisar inconsistencias funcionales del flow
- revisar persistencia de draft
- revisar validación y payload mapping
- revisar estados de éxito/error

Regla:

- esta fase no bloquea el baseline de arquitectura de la página
- cualquier inconsistencia actual del formulario debe documentarse como deuda separada

Estado actual:

- en progreso
- el formulario ya comparte primitives estructurales con `home-service`
- la deuda restante se concentra en validación real del flow y comportamiento manual final
