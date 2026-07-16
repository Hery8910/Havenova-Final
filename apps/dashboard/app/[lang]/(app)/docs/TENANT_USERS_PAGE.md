# Tenant Users Page

## Estado

Resumen de la primera superficie real de `people`. La documentación viva está en
`people/users/README.md`, `PAGE_REQUIREMENTS.md` y
`USERS_DIRECTORY_GAP_ANALYSIS.md`.

Auditoría: `2026-07-10`.

## Ruta y dominio

```text
/people/users
```

Representa clientes del tenant:

```text
Auth + UserClient(role=user) + optional UserClientProfile + relationship data
```

Cuenta e invitación abierta son entradas distintas del producto, normalizadas en
un mismo directorio.

## Contrato activo

```text
GET  /api/home-services/dashboard/users/summary
GET  /api/home-services/dashboard/users/directory
GET  /api/home-services/dashboard/users/entries/:entryId
POST /api/home-services/dashboard/users/invite
POST /api/home-services/dashboard/users/invitations/:invitationId/resend
POST /api/home-services/dashboard/users/invitations/:invitationId/revoke
```

Los endpoints V1 por list/page, detail por `userClientId` y resend por email ya
no forman parte del backend.

## Implementado

- master-detail desktop;
- summary remoto y accesos rápidos;
- búsqueda server-side y filtros canónicos;
- directorio `user | invitation`;
- cursor y deduplicación por `entryId`;
- modos `empty | detail | invite`;
- detail por entry;
- invite, resend y revoke;
- URL state `selected`, `mode`, `search`, `status`;
- onboarding público `tui_` en la app cliente.

## Pendiente

- i18n y feedback accesible;
- validación manual end-to-end.

## Componentes principales

- `components/masterDetail/*`;
- `components/directory/*`;
- `components/people/shared/*`;
- `components/people/users/TenantUserDirectoryItem`;
- `components/people/users/detail/TenantUserDetailPanel`;
- `people/users/page.tsx`;
- `people/users/page.controller.tsx`;
- `people/users/components/*`;
- `packages/types/tenantUsers.ts`;
- `packages/services/tenantUsers.ts`.

## Regla

No copiar payloads específicos de users a admins/workers/managers. Reutilizar la
forma `summary / directory / detail`, cursor, `entryId` y orquestación; cada actor
conserva sus políticas y agregados propios.
