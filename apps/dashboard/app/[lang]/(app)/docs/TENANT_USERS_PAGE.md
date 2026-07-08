# Tenant Users Page

Nota:

- este documento queda como resumen corto del estado de la primera implementacion
- la referencia viva de la pagina ahora debe leerse en `people/users/README.md` y `people/users/PAGE_REQUIREMENTS.md`
- el patron global que rige esta pantalla vive en `DASHBOARD_DIRECTORY_PAGE_STANDARD.md`

## Objetivo

Abrir la primera superficie real del dominio `people` sobre el contrato estable de backend.

Ruta actual:

- `/people/users`

## Contrato Base

Se apoya en:

- `GET /api/home-services/dashboard/users`
- `GET /api/home-services/dashboard/users/:userClientId`

Las acciones de invitacion y reenvio ya tienen contrato, pero quedan para la siguiente pasada visual.

## Alcance De Esta Primera Implementación

Incluye:

- layout master-detail declarado en cada pagina
- filtros base
- lista compartida con item renderer por dominio
- badges de estado
- detalle estable en el panel derecho
- seleccion local sin navegacion obligatoria entre lista y detalle

No bloquea la salida de esta base:

- contadores cross-domain
- timeline
- ultima actividad
- agregados operativos

## Reglas De Datos

- `profile` sigue siendo opcional
- un usuario puede existir sin `UserClientProfile`
- `hasProfile` y `profileCompleteness` deben tratarse como metadata de UI, no como requisito de acceso

## Componentes Locales

- `components/masterDetail/MasterDetailPage`
- `components/directory/*`
- `components/people/shared/PersonStatusBadge`
- `components/people/users/TenantUserDirectoryItem`
- `components/people/users/detail/TenantUserDetailPanel`
- `people/users/page.tsx`
- `people/users/page.copy.ts`

## Siguientes Pasos

1. enriquecer el detalle real en el panel derecho
2. crear `InvitePersonDialog` y `ResendInviteDialog`
3. extraer config compartida para `admin`, `worker` y `manager`
