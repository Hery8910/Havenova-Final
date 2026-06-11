# Footer

## Estado

Este componente sigue pendiente de revisión y migración específica dentro del proceso de consolidación del frontend.

## Pendientes de revisión

### Navegación por teclado

La última validación manual de Home confirmó que los problemas del `nav` principal y de los botones globales fueron corregidos, pero el `footer` todavía mantiene aspectos pendientes en navegación por teclado y foco visible.

Esto debe revisarse de forma explícita cuando se audite y migre esta superficie, para evitar que quede fuera del cierre de la página.

Aspectos a validar:

- orden real de foco dentro del bloque de contacto
- tratamiento del foco visible en enlaces y CTAs del footer
- decisión semántica sobre qué elementos del bloque de contacto deben ser enfocables
- comportamiento del bloque de horario (`BusinessHoursStatus`) dentro de la secuencia de teclado
- consistencia entre desktop y mobile

### Migración

Antes de marcar el `footer` como terminado, esta superficie debe pasar por la misma checklist base del resto del proyecto:

- separación clara de responsabilidades
- semántica y landmarks
- accesibilidad por teclado
- foco visible consistente
- revisión de i18n y textos
- revisión de estilos, tokens y clases legacy

## Relación con auditorías activas

- El hallazgo apareció durante la validación manual de Home.
- La corrección no debe hacerse de forma aislada desde la página.
- Debe resolverse en la futura auditoría/migración del componente `Footer`.
