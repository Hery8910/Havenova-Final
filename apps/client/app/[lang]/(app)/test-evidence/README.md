# Evidencia de Testing de `(app)`

Esta carpeta contiene evidencia de validaciones manuales para `apps/client/app/[lang]/(app)`.

## Regla de organización

Cada corrida debe crear una carpeta con este formato:

- `YYYY-MM-DD-run-01`
- `YYYY-MM-DD-run-02`

## Estructura mínima recomendada

- `README.md`
  Resumen ejecutivo de la corrida.
- `session-context.md`
  Contexto operativo: fecha, ruta, viewport, variante de shell y alcance.
- `cases/`
  Resultado detallado de los casos ejecutados.
- `summaries/technical-summary.md`
  Resumen técnico final.

## Nota

Para `(app)`, las corridas iniciales deben priorizar:

- navegación por teclado
- `skip link`
- orden de foco
- foco visible
- comportamiento de paneles del shell
