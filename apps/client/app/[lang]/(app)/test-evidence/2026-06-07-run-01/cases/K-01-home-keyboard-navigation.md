# K-01 a K-06 Home Keyboard Validation

## Ruta

- `Home`

## Resultado general

- parcialmente satisfactorio

## K-01. Acceso inicial al contenido

Resultado observado:

- al primer `Tab`, aparece el `skip link`
- al pulsar `Enter`, el foco salta el hero y el siguiente foco observable queda en `main`
- la primera sección que recibe el foco dentro de `main` es `AppInstallSection`

Interpretación:

- el patrón es funcional
- el salto es intencional y coherente con el objetivo del `skip link`: omitir navegación y hero para entrar al contenido principal

## K-02. Orden de foco hacia adelante

Resultado observado:

1. logo / enlace a Home: correcto
2. links principales de navegación: correctos
3. toggle de tema: foco poco perceptible
4. selector de idioma:
   - el botón recibe foco
   - abre y cierra correctamente
   - los elementos internos no toman el foco con `Tab`
   - el foco salta fuera de la página hacia UI del navegador
5. lista de links del usuario:
   - el botón recibe foco
   - abre y cierra correctamente
   - los elementos internos no toman el foco con `Tab`
   - el foco salta a la página, al primer CTA del hero
6. CTA del hero: correcto
7. resto del `main`: correcto, sin saltos a elementos ocultos
8. footer:
   - salto al footer correcto
   - logo/link Home: correcto
   - contacto:
     - email: correcto
     - teléfono: correcto
     - dirección: no entra en foco
     - después salta al horario de empresa
   - links de páginas de la app: correctos
   - links legales: correctos
   - links de usuario: correctos

Interpretación:

- el orden general es coherente
- los defectos críticos están concentrados en los paneles del shell y en foco visible insuficiente

## K-03. Orden de foco hacia atrás

Resultado observado:

- correcto en general
- reproduce los mismos problemas derivados de K-02

## K-04. Foco visible

Resultado observado:

- `button--ghost` muestra foco de forma perceptible
- resto de variantes de botón: foco prácticamente imperceptible
- toggle de tema: foco insuficiente
- en contacto/footer, el foco se resuelve por cambio de color de texto, pero puede necesitar un indicador más fuerte

## K-05. Interacción básica del shell

Resultado observado:

- navegación del shell fluida con `Space` y `Enter`
- las listas abren y cierran correctamente
- el foco se mantiene en el botón al abrir/cerrar
- al cerrar el selector de idioma con `Esc`, el foco vuelve al estado inicial de la página, antes del `skip link`
- las listas internas del selector de idioma y del menú de usuario no participan correctamente en la secuencia de foco

Interpretación:

- apertura y cierre están resueltos
- la gestión del foco dentro y después de los paneles sigue incorrecta

## K-06. Home específico

Resultado observado:

- la secuencia general es lógica
- el retroceso mantiene el mismo orden estructural
- los problemas abiertos siguen siendo los ya detectados en shell y foco visible

## Hallazgos consolidados

1. `skip link` funcional.
2. El salto al `main` omite hero de forma coherente con el patrón esperado.
3. El foco visible del toggle de tema es insuficiente.
4. Las variantes de botón distintas de `button--ghost` no muestran foco con claridad.
5. El selector de idioma pierde la secuencia de foco y la envía fuera de la página.
6. El panel de usuario también rompe la secuencia de foco.
7. Al cerrar idioma con `Esc`, el retorno de foco no vuelve al trigger esperado.
8. La dirección del footer no entra en foco, lo cual es coherente si permanece como texto no interactivo, pero debe quedar validado como decisión semántica.

## Prioridad de rectificación

1. Corregir foco de paneles de idioma y usuario.
2. Corregir retorno de foco al cerrar paneles.
3. Reforzar estilos `:focus-visible` de theme toggle y variantes de botón.
4. Confirmar y documentar la decisión semántica de dejar la dirección del footer fuera del orden de foco.
