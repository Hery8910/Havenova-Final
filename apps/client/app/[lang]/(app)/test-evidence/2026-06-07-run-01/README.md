# Corrida 2026-06-07 Run 01

## Alcance

Validación manual de teclado para `Home` dentro del grupo `(app)`.

## Estado

- ejecutada
- con hallazgos

## Resultado ejecutivo

La página `Home` ya respeta el orden general de foco y el patrón de salto al `main`, pero la corrida encontró problemas de gestión de foco en paneles del shell y foco visible insuficiente en varios controles interactivos.

La siguiente pasada debe centrarse en:

- foco visible de toggles y variantes de botón
- trampa o secuencia de foco dentro de listas/paneles de navbar
- retorno de foco coherente al cerrar paneles
- revisión del footer para elementos semánticos no enfocables como dirección
