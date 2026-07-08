# Manual de Validación de Teclado para `(app)`

## Objetivo

Este documento define una validación manual mínima y reutilizable para revisar navegación por teclado, orden de foco y visibilidad del estado `focus` en las páginas del grupo `apps/client/app/[lang]/(app)`.

Su propósito no es solo “probar con Tab”, sino dejar una evidencia clara de:

- si el shell permite llegar rápido al contenido principal
- si el orden de foco sigue la jerarquía visual y semántica
- si los componentes interactivos muestran foco visible
- si los paneles, CTAs y navegación responden de forma predecible sin ratón

## Alcance

Esta guía cubre:

- `skip link`
- `NavbarContainer`
- `main`
- CTAs y enlaces de la página
- footer
- paneles o menús interactivos del shell

No cubre todavía:

- lectores de pantalla
- contraste de color medido con tooling
- automatización E2E de accesibilidad
- auditoría completa de ARIA con tooling especializado

## Estado inicial recomendado

Antes de ejecutar la validación:

1. Cargar la página desde un estado normal del navegador.
2. No usar el ratón durante la prueba.
3. Tener visible la página completa o usar un viewport conocido.
4. Repetir al menos en:
   - desktop
   - mobile o tablet si la navbar cambia de variante

## Casos base

### K-01. Acceso inicial al contenido

Objetivo:

- comprobar que el shell permite saltar al contenido principal sin recorrer toda la navbar

Pasos:

1. Cargar la página.
2. Pulsar `Tab` una vez.
3. Confirmar que aparece el `skip link`.
4. Pulsar `Enter`.
5. Confirmar que el foco salta a `#app-main-content`.

Resultado esperado:

- el `skip link` es visible al recibir foco
- el salto no rompe el layout
- el foco termina en el `main` correcto

### K-02. Orden de foco hacia adelante

Objetivo:

- comprobar que el orden de navegación con `Tab` sigue una secuencia lógica

Pasos:

1. Empezar desde el inicio de la página.
2. Pulsar `Tab` de forma continua hasta llegar al footer.
3. Anotar el orden observado.

Resultado esperado:

- el foco recorre primero shell y hero
- después entra al `main`
- después recorre CTAs, enlaces y botones en el mismo orden que se presentan visualmente
- finalmente entra al footer
- no hay saltos inesperados hacia elementos ocultos o fuera de contexto

### K-03. Orden de foco hacia atrás

Objetivo:

- comprobar que la navegación con `Shift + Tab` también es coherente

Pasos:

1. Llevar el foco a una zona media o final de la página.
2. Pulsar `Shift + Tab` varias veces.

Resultado esperado:

- el foco retrocede en orden lógico
- no se pierde en overlays, elementos invisibles o contenedores no interactivos

### K-04. Foco visible

Objetivo:

- comprobar que todos los elementos interactivos muestran un estado visible de foco

Pasos:

1. Recorrer la página con `Tab`.
2. En cada foco, observar si el estado activo se distingue con claridad.

Resultado esperado:

- botones, enlaces y toggles muestran foco visible
- el estado no depende solo de hover
- el foco no queda tapado por overlays, gradientes o backgrounds

### K-05. Interacción básica del shell

Objetivo:

- comprobar que la navegación del shell puede operarse sin ratón

Pasos:

1. Navegar hasta los controles de la navbar.
2. Abrir menús o paneles con `Enter` o `Space` cuando corresponda.
3. Cerrar con `Esc` si el patrón lo soporta.
4. Confirmar que el foco no se pierde.

Resultado esperado:

- los controles del shell son alcanzables
- abrir o cerrar paneles no deja el foco “muerto”
- el foco vuelve a un elemento razonable al cerrar

### K-06. Home específico

Objetivo:

- validar el orden de foco real de la `Home`

Secuencia esperada aproximada:

1. `skip link`
2. navegación principal
3. CTAs del hero
4. CTA o acción del bloque de instalación, según estado
5. enlaces de cards de servicios
6. enlaces o acciones restantes del contenido
7. footer

Nota:

- el bloque `AppInstallSection` cambia según estado (`installed`, `installable`, `ios-manual`, `unavailable`)
- la evidencia debe indicar en qué estado se validó

### K-07. How It Work específico

Objetivo:

- validar el orden de foco real de `how-it-work`

Secuencia esperada aproximada:

1. `skip link`
2. navegación principal
3. contenido no interactivo del hero
4. salto a `main`
5. CTAs del bloque `BenefitsSplitSection`
6. footer

Notas:

- `WorkflowSection` actualmente es solo informativa y no debería añadir elementos al orden de foco
- si una futura iteración vuelve interactivos los cards o el bloque de nota, este caso debe actualizarse
- la evidencia debe confirmar que no existe salto extraño causado por la imagen flotante del bloque de beneficios

### K-08. About específico

Objetivo:

- validar el orden de foco real de `about`

Secuencia esperada aproximada:

1. `skip link`
2. navegación principal
3. contenido no interactivo del hero
4. salto a `main`
5. contenido no interactivo de `StorySection`
6. cards informativas de `ClientsSection` sin entrar al foco
7. CTAs del bloque `ServiceCrossCtaSection`
8. footer

Notas:

- `ClientsSection` usa scroll horizontal visual, pero sus cards no deberían entrar al orden de foco mientras sigan siendo informativas
- la evidencia debe confirmar que los `aria-*` de `ClientsSection` no dependen de interacción no accesible
- si en el futuro las cards se convierten en enlaces o acciones, este caso debe actualizarse

### K-09. Contact específico

Objetivo:

- validar el orden de foco real de `contact`
- separar la validación de la página del retrabajo pendiente del formulario

Secuencia esperada aproximada:

1. `skip link`
2. navegación principal
3. CTAs del hero
4. salto a `main`
5. controles del `ContactFormSection`
6. quick actions de `InfoSection` cuando existan
7. triggers del `FAQSection`
8. footer

Notas:

- el formulario sí entra al foco y debe validarse como surface interactiva, pero su contrato backend y sus payloads siguen fuera de esta fase
- `InfoSection` mezcla contenido informativo con enlaces rápidos; la evidencia debe confirmar si esos enlaces aparecen o no según los datos disponibles
- `FAQSection` debe responder a `Enter` o `Space` y mantener foco visible en sus triggers
- la evidencia debe dejar claro qué observaciones pertenecen a UX/teclado de la página y cuáles se difieren al audit específico del formulario

### K-10. Cleaning Service específico

Objetivo:

- validar el orden de foco real de `cleaning-service`
- separar la validación de la página del retrabajo pendiente del formulario multi-step

Secuencia esperada aproximada:

1. `skip link`
2. navegación principal
3. posibles CTAs del hero
4. salto a `main`
5. `AuthRequiredAlert` si está visible
6. controles del `CleaningRequestForm`
7. triggers del `FAQSection`
8. CTAs del `ServiceCrossCtaSection`
9. footer

Notas:

- la evidencia debe indicar si la validación se hizo con sesión activa o con el alert de auth visible
- el formulario entra completo al orden de foco, pero su validación funcional profunda sigue siendo deuda separada
- si existe draft previo, debe anotarse porque cambia el punto de entrada del flow

### K-11. Home Service específico

Objetivo:

- validar el orden de foco real de `home-service`
- registrar qué variante del formulario se probó

Secuencia esperada aproximada:

1. `skip link`
2. navegación principal
3. posibles CTAs del hero
4. salto a `main`
5. `AuthRequiredAlert` si está visible
6. controles del `HomeServiceRequestForm`
7. triggers del `FAQSection`
8. CTAs del `ServiceCrossCtaSection`
9. footer

Notas:

- la evidencia debe indicar si la validación se hizo con sesión activa o con el alert de auth visible
- la evidencia debe indicar qué tipo de servicio se seleccionó dentro del formulario
- cualquier inconsistencia del branch de formulario debe registrarse como hallazgo del flow, no como fallo del shell de página

## Qué registrar

En cada validación guardar:

- fecha
- ruta validada
- viewport
- variante del shell validada
- estado observado del bloque dinámico, si aplica
- resultado por caso
- problemas encontrados

## Plantilla de evidencia mínima

```md
# Validación de Teclado

- Fecha:
- Ruta:
- Viewport:
- Variante shell:
- Estado dinámico relevante:

## Casos

- K-01:
- K-02:
- K-03:
- K-04:
- K-05:
- K-06:
- K-07:
- K-08:
- K-09:
- K-10:
- K-11:

## Hallazgos

- Ninguno

## Pendientes

- Ninguno
```

## Regla de cierre

Una página del grupo `(app)` no debe marcarse como terminada mientras:

- el `skip link` no funcione
- el foco visible no sea consistente
- el orden de foco no haya sido validado manualmente
- existan dudas no resueltas sobre paneles o navegación del shell

## Evidencia actual

- [Corrida 2026-06-07 Run 01](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/test-evidence/2026-06-07-run-01/README.md)

## Estado posterior a la primera corrida

A partir de la evidencia manual de `2026-06-07`, el shell recibió una rectificación específica antes de ejecutar la siguiente validación:

- `LanguageSwitcher` ahora mantiene el foco dentro del panel abierto y devuelve el foco al trigger al cerrar con `Esc`
- los paneles interactivos de navbar en desktop, tablet y mobile ahora comparten la misma convención de foco
- `ThemeToggler` recibió un `:focus-visible` explícito para no depender del estado activo del modo oscuro
- los botones globales ahora muestran un contorno explícito de foco además del borde y la sombra

Esto cambia el estado de los hallazgos así:

- los defectos de shell/foco siguen pendientes de validación manual
- ya no son tareas abiertas de implementación
- la siguiente corrida debe confirmar el comportamiento real en desktop y mobile antes de cerrar Home

## Cierre de hoy

Última observación manual registrada hoy:

- la navegación por teclado en `Home` parece ya resuelta en la práctica para `skip link`, shell, paneles del navbar y foco visible de botones
- no se detectaron nuevamente los problemas anteriores del selector de idioma, panel de usuario o toggle de tema
- el `footer` mantiene su revisión propia pendiente y no debe darse por cerrado desde esta validación de página

Pendiente para mañana:

- ejecutar una última validación manual completa de la página
- usar esta guía como checklist final de cierre
- dejar constancia explícita del resultado final antes de marcar `Home` como terminada
