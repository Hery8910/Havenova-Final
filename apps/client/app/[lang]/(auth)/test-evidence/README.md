# Evidencia de Testing de `(auth)`

Esta carpeta contiene la evidencia de cada corrida manual de testing previa a despliegue para `apps/client/app/[lang]/(auth)`.

## Regla de organización

Cada corrida debe crear una carpeta con este formato:

- `YYYY-MM-DD-run-01`
- `YYYY-MM-DD-run-02`

Ejemplo:

- `2026-05-16-run-01`

## Estructura mínima por corrida

Cada corrida debe incluir:

- `README.md`
  Resumen ejecutivo de la corrida.
- `session-context.md`
  Contexto operativo: rama, commit, entorno, navegador, viewport y alcance.
- `cases/`
  Resultado detallado de cada caso ejecutado.
- `logs/raw/`
  Fragmentos de logs backend guardados tal como se capturaron o resumidos por bloque.
- `logs/analysis/`
  Lectura e interpretación de los logs por caso o por secuencia.
- `network/`
  Notas o exports de red relevantes.
- `screenshots/`
  Evidencia visual.
- `summaries/technical-summary.md`
  Resumen técnico final de la corrida.

## Convención de nombres

Casos:

- `F-01-cold-load-register.md`
- `F-02-register-success.md`
- `S-01-missing-client-id.md`

Donde:

- `F` = funcional
- `S` = seguridad esencial

Logs:

- `bootstrap-cold-register.md`
- `login-success-sequence.md`
- `verify-email-expired-token.md`

Screenshots:

- `F-01-desktop-initial.png`
- `F-01-mobile-initial.png`
- `S-03-alert-invalid-token.png`

## Regla de contenido

No guardar en esta carpeta:

- passwords
- tokens completos
- cookies completas
- datos reales de usuarios externos

Sí guardar:

- hashes
- IDs de request
- códigos backend
- timestamps
- rutas
- resultados observados
