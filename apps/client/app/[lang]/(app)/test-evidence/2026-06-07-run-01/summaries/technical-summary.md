# Resumen técnico

## Hallazgos principales

- `skip link` implementado y funcional
- orden general de foco correcto en Home
- fallos concentrados en shell interactivo
- foco visible insuficiente en varios controles

## Bloqueos antes de la siguiente validación

1. Panel de idioma: secuencia de foco rota
2. Panel de usuario: secuencia de foco rota
3. Retorno de foco con `Esc` incorrecto en selector de idioma
4. `focus-visible` insuficiente en theme toggle
5. `focus-visible` insuficiente en variantes de botón fuera de `button--ghost`

## Siguiente objetivo

Rectificar shell y foco visible antes de ejecutar una nueva corrida manual.

## Estado actual de implementación

- rectificación de foco del shell implementada
- retorno de foco con `Esc` implementado para selector de idioma y paneles de navbar
- `focus-visible` reforzado en `ThemeToggler`
- `focus-visible` reforzado en botones globales
- falta únicamente revalidación manual controlada
