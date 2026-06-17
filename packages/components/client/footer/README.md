# Footer

## Estado

Este componente sigue pendiente de revisión y migración específica dentro del proceso de consolidación del frontend.

Se realizó una primera auditoría centrada en:

- semántica y landmarks
- accesibilidad general
- navegación por teclado
- consistencia con los patrones ya aplicados al resto de componentes de página

Los estilos visuales no forman parte todavía de esta fase.

## Hallazgos actuales

### 1. CTA de desarrollador con destino incorrecto

El bloque final del footer renderiza un enlace con etiqueta accesible orientada a visitar el sitio de `Maped Solutions`, pero actualmente apunta a `/#`.

Impacto:

- el destino no coincide con la intención semántica del enlace
- la navegación por teclado llega a un control que no cumple la acción prometida
- genera desconfianza y ruido en validación manual

Tarea:

- sustituir `href="/#"` por una URL real, o degradarlo a texto no interactivo si todavía no existe un destino válido
- si el destino es externo, añadir el tratamiento consistente para enlaces externos

Estado:

- pendiente por decisión explícita de producto; se mantiene temporalmente en `/#`

### 2. Superficie `support` sin nombre accesible explícito

El bloque `aside` del footer no tiene un nombre accesible propio. Si la página acumula otros landmarks complementarios, este bloque queda ambiguo en lectores de pantalla.

Impacto:

- landmark complementario sin identificación clara
- navegación por regiones menos precisa

Tarea:

- decidir si el bloque debe seguir siendo `aside`
- si se mantiene, añadir `aria-labelledby` o `aria-label`
- si realmente es solo cierre informativo, valorar convertirlo en `div` semánticamente neutro

Estado:

- resuelto: el bloque ahora debe mantenerse identificado con nombre accesible propio

### 3. Variante global `button--link` usada sin implementación visible en `buttons.css`

Los enlaces internos de los grupos del footer usan `button button--link`, pero la variante `button--link` no está definida en la hoja global actual.

Impacto:

- dependencia implícita de estilos base no diseñados para enlaces textuales
- posible inconsistencia de foco, padding y estados entre superficies
- desacoplamiento incompleto respecto al estándar actual de links interactivos

Tarea:

- decidir si estos enlaces deben usar una variante global real de botón-link
- o migrarlos a la clase reutilizable de enlace textual ya introducida para otros componentes
- documentar el patrón definitivo para links de navegación secundaria

Estado:

- resuelto: la estrategia elegida es reutilizar el patrón textual `button-link`

### 4. Datos `social` presentes en i18n pero sin render en el componente

El `Footer` sigue declarando `social` en tipos e i18n, pero el componente no lo usa.

Impacto:

- API más grande de lo necesario
- contenido huérfano en traducciones
- ruido durante mantenimiento y auditoría

Tarea:

- decidir si el footer debe exponer redes sociales
- si no se van a mostrar, eliminar `social` del contrato y de i18n
- si sí se van a mostrar, definir su semántica, orden de foco y copy accesible

Estado:

- resuelto: `social` debe salir del contrato actual mientras no exista render real

### 5. Revisión pendiente del botón de horario como control compuesto

`BusinessHoursStatus` está bastante mejor encaminado que otras superficies legacy, pero todavía requiere una validación específica como control compuesto con contenido dinámico.

Aspectos concretos a revisar:

- nombre accesible final del botón al combinar `aria-label`, `aria-describedby` y estado visible
- robustez cuando falte `copy.heading`
- comportamiento de anuncio del estado dinámico (`role="status"` + `aria-live`)
- secuencia real de foco cuando el panel expandido entra en el flujo

Estado:

- parcialmente resuelto en código: el bloque ya no depende de que `copy.heading` o `ariaWeeklyHours` existan
- sigue pendiente validación manual del comportamiento final con lector de pantalla y teclado

### 6. Revisión estructural pendiente del header del footer

El `header` interno mezcla:

- enlace al home
- datos de contacto
- horario comercial

La estructura no es incorrecta por sí sola, pero conviene confirmar que este agrupamiento sigue siendo el más claro para navegación semántica y lectura lineal.

Tarea:

- confirmar si el bloque superior debe seguir siendo `header`
- o si conviene un contenedor neutro con subgrupos más explícitos
- revisar lectura lineal en mobile y desktop

## Navegación por teclado

Estado actual observado a nivel estructural:

- el orden DOM es razonable: logo -> contacto -> horario -> grupos de links -> CTA final
- no se aprecian controles claramente no enfocables donde deberían serlo
- la secuencia general parece coherente, pero sigue faltando validación manual del recorrido completo

Validaciones pendientes:

- confirmar foco visible real en todos los enlaces del footer
- comprobar que el botón de cookies mantiene el mismo patrón de foco que el resto
- validar expansión/colapso de `BusinessHoursStatus` solo con teclado
- revisar si el CTA final de soporte merece aparecer en la secuencia de foco como enlace real o como contenido informativo

## Checklist de corrección

- corregir el destino e intención semántica del enlace de `Maped Solutions`
- nombrar explícitamente el landmark `support` o neutralizarlo
- resolver la estrategia definitiva para enlaces tipo `button--link`
- auditar manualmente el flujo completo de foco en desktop y mobile
- revisar `BusinessHoursStatus` como disclosure accesible
- decidir si `social` se elimina o se implementa
- cerrar el contrato de datos del footer para que no exponga contenido no usado

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
