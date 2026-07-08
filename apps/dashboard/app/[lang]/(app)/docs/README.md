# Dashboard App Docs

Esta carpeta concentra la documentacion funcional y estructural del `dashboard`.

Objetivo:

- definir la arquitectura de informacion del producto
- separar claramente los dominios `workspace`, `empresa` y `cuenta`
- fijar la estructura de carpetas/rutas antes de cerrar el MVP
- fijar el shell base del dashboard antes de implementar paginas reales
- documentar despues cada pagina de forma individual

Documentos iniciales:

- [DASHBOARD_AUTH_SESSION_ARCHITECTURE.md](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/docs/DASHBOARD_AUTH_SESSION_ARCHITECTURE.md:1)
  - documenta el contrato real de sesion del dashboard
  - resume los loops, redirects y perdidas de CSRF detectadas en desarrollo
  - separa los incidentes reales de auth de los problemas de hidratacion visual del shell
  - fija la separacion entre `middleware`, `layout SSR`, `AuthProvider` y BFF
  - deja un checklist de debug para futuras incidencias

- [DASHBOARD_INFORMATION_ARCHITECTURE.md](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/docs/DASHBOARD_INFORMATION_ARCHITECTURE.md:1)
  - vision completa del producto final
  - dominios funcionales
  - propuesta de rutas
  - propuesta de carpetas
  - reglas para navegacion, header y permisos

- [DASHBOARD_RESET_BASELINE_2026-07-04.md](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/docs/DASHBOARD_RESET_BASELINE_2026-07-04.md:1)
  - deja constancia del reinicio estructural del dashboard
  - resume lo eliminado, lo creado y la deuda residual aceptada
  - documenta el shell nuevo basado en `dashboardShell.ts`

- [DASHBOARD_PEOPLE_DOMAIN.md](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/docs/DASHBOARD_PEOPLE_DOMAIN.md:1)
  - fija la familia compartida `auth + userClient + complemento`
  - define el dominio `people` como base reusable para `user/admin/worker/manager`
  - deja constancia de la migracion conceptual desde `clients/team/network`

- [TENANT_USERS_PAGE.md](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/docs/TENANT_USERS_PAGE.md:1)
  - documenta la primera superficie real de `people`
  - resume contrato backend, composicion por pagina, componentes locales y siguientes pasos

- [DASHBOARD_DIRECTORY_PAGE_STANDARD.md](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/docs/DASHBOARD_DIRECTORY_PAGE_STANDARD.md:1)
  - fija el patron reusable `directory + panel`
  - define anatomia, semantica, accesibilidad y arquitectura tecnica
  - actua como checklist previo para nuevas paginas del dashboard

Regla de trabajo:

1. primero se define la arquitectura completa
2. despues se recorta el MVP sobre esa arquitectura
3. luego se define el estandar reusable de pagina
4. despues se documenta cada pagina y su contrato por separado

Convencion local de componentes:

- `components/shell/*`: piezas exclusivas del layout estructural del dashboard
- `components/masterDetail/*`: base reusable para rutas tipo lista + detalle
- `components/directory/*`: piezas reutilizables para el bloque izquierdo de rutas tipo directorio
- `components/placeholders/*`: scaffolds temporales para rutas todavia no implementadas
- `components/people/shared/*`: piezas especificas del dominio people como badges de estado
- `components/people/<domain>/*`: implementaciones especificas por rama como `users`
- si una pieza deja de ser exclusiva de esta app, debe migrar a `packages/components`
