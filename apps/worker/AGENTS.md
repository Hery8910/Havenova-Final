# Reglas para `apps/worker`

## Responsabilidad

`apps/worker` es core operativo compartido para trabajadores. La baseline actual valida
sesión, aislamiento de app y perfil mínimo; no valida todavía agenda, disponibilidad,
asignaciones o ejecución de servicios.

## Reglas

- No convertir rutas o textos placeholder en requisitos de producto.
- No importar features desde client o dashboard.
- Compartir sólo primitivas neutrales y contratos verificados.
- Mantener auth invitation-only mientras ese contrato continúe vigente.
- Verificar autorización worker en servidor y backend.
- No confiar en perfil local para conceder acceso.
- No añadir branding de Havenova al core.
- Toda nueva operación worker necesita Product Design, contrato backend y pruebas de
  aislamiento tenant.
