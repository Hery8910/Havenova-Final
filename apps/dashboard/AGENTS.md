# Reglas para `apps/dashboard`

## Responsabilidad

`apps/dashboard` es core operativo compartido. Debe funcionar para Havenova, Perfect
Service y futuros tenants mediante configuración y datos, no mediante forks.

## Reglas

- No añadir branding, copy o branches específicos de Havenova al core.
- No implementar una ruta placeholder sin readiness de Product Design.
- No inferir módulos futuros desde la navegación existente.
- Mantener autorización server-side y BFF same-origin.
- Preservar aislamiento tenant en queries, mutations, cache y URL state.
- Mantener routes delgadas y features locales a su dominio.
- No importar desde `apps/client`; promover una primitiva sólo después de demostrar su
  neutralidad y reutilización.
- No usar el barrel global de `packages/components` para incorporar una feature completa.

## Users

Antes de modificar `/people/users`, leer la matriz de autoridad.

- Conservar directorio, cursor, búsqueda y aislamiento como evidencia verificable.
- No tratar summary, filtros, attention o relationship summary como producto cerrado.
- No ampliar invite/accept mientras sigan bloqueados.
- Verificar resend/revoke/expiry por separado del flujo completo de onboarding.
- No copiar el controlador actual como patrón; debe dividirse durante la migración.
- El prototipo dentro de la ruta es referencia histórica, no código productivo.
