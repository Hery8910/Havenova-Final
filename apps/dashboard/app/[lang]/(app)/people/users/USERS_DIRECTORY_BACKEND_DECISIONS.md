# Users Directory — decisiones backend consumidas por frontend

## Estado y autoridad

Este archivo es un resumen local, no la especificación ejecutable del backend.

La fuente canónica vive en el repositorio hermano:

```text
/home/heriberto/Escritorio/Backend/backend/src/modules/home-services/tenant-users/
```

Orden de autoridad:

1. `docs/directory/01-product-and-domain-decisions.md` — negocio;
2. `docs/directory/02-people-directory-backend-standard.md` — patrón reusable;
3. `docs/directory/03-tenant-users-backend-contract.md` — HTTP y DTOs;
4. `docs/directory/05-related-domains-contract.md` — agregados y evolución;
5. `FRONTEND_INTEGRATION.md` — contrato público para frontend.

Esos archivos existen y fueron revisados el `2026-07-10`, pero no están
versionados dentro de este repositorio frontend. Si el trabajo se ejecuta en un
workspace que no incluye el repositorio backend, debe obtenerse una copia o un
enlace versionado antes de cambiar el contrato.

## Contrato V2 implementado

Base dashboard:

```text
/api/home-services/dashboard/users
```

Endpoints únicos:

```text
GET  /summary
GET  /directory
GET  /entries/:entryId
POST /invite
POST /invitations/:invitationId/resend
POST /invitations/:invitationId/revoke
```

Onboarding público:

```text
POST /api/home-services/user-invitations/resolve
POST /api/home-services/user-invitations/accept
```

Los endpoints V1 `GET /`, `GET /:userClientId` y `POST /resend-invite` fueron
retirados en backend. No se deben crear adapters o fallbacks.

## Dominio

- `user` representa una cuenta aceptada del tenant.
- `invitation` representa onboarding iniciado y aún no aceptado.
- Una persona no aparece simultáneamente en ambas formas.
- Invitaciones accepted/revoked no aparecen como rows.
- `UserClientProfile` es opcional.
- Perfil incompleto, teléfono ausente y cero requests no generan atención.

## Estados canónicos

```ts
type TenantUsersDirectoryFilter =
  | 'all'
  | 'active'
  | 'inactive'
  | 'invitations'
  | 'attention';

type TenantUserAttentionReason =
  | 'INVITATION_EXPIRED'
  | 'EMAIL_UNVERIFIED_STALE'
  | 'ACCOUNT_LOCKED';

type AccountStatus = 'active' | 'inactive' | 'locked';
type VerificationStatus = 'verified' | 'unverified';
type InvitationStatus = 'pending' | 'expired';
```

`expired` es derivado de una invitación lifecycle `pending`; no es un estado
persistido terminal. Summary, filtros y rows usan la misma policy backend y el
mismo instante `now` por request.

## Summary

```ts
interface TenantUsersDirectorySummary {
  totalUsers: number;
  pendingInvites: number;
  needsAttention: number;
}
```

- `totalUsers`: sólo entries `kind=user`;
- `pendingInvites`: invitaciones pending no expiradas;
- `needsAttention`: entries únicas con al menos una razón.

El summary es global: no cambia por `q`, filtro o páginas cargadas.

## Directory

Query:

```ts
interface TenantUsersDirectoryQuery {
  q?: string;
  status?: TenantUsersDirectoryFilter;
  cursor?: string;
  limit?: number;
}
```

Reglas:

- búsqueda prefix-based normalizada por nombre, email y teléfono;
- `q` vacío omite búsqueda;
- `q` de un carácter devuelve `DIRECTORY_QUERY_TOO_SHORT`;
- `q` válido tiene de 2 a 100 caracteres;
- `limit` default 25, máximo 50;
- orden fijo `businessActivityAt DESC, entryId DESC`;
- cursor opaco ligado a búsqueda y filtro;
- respuesta sin `page`, `limit` ni `total`.

```ts
interface TenantUsersDirectoryPage {
  items: TenantUserDirectoryEntry[];
  nextCursor: string | null;
  hasNextPage: boolean;
}
```

`entryId` tiene formato backend `user:<userClientId>` o
`invitation:<invitationId>`, pero frontend no debe parsearlo.

## Relación comercial MVP

```ts
interface TenantUserRelationshipSummary {
  requests: { total: number; active: number };
  workOrders: { total: number; active: number } | null;
  nextAppointmentAt: string | null;
  lastCompletedServiceAt: string | null;
}
```

- requests activas: `submitted`, `under_review`, `visit_scheduled`;
- próxima cita: siguiente `preferredVisitSlot.start` confirmado en una request
  `visit_scheduled`;
- `workOrders` y `lastCompletedServiceAt` son `null` durante el MVP;
- `businessActivityAt` de user usa la request no anonimizada más reciente o
  `UserClient.createdAt`;
- `businessActivityAt` de invitation usa `lastSentAt`.

## Detail

`GET /entries/:entryId` devuelve una forma discriminada con:

- `identity` siempre;
- `access` y `profile` sólo para user;
- `invitation` sólo para invitation;
- `relationshipSummary`, `businessActivityAt`, `createdAt` y
  `availableActions` siempre.

`entryId` debe enviarse con `encodeURIComponent`.

## Invitaciones

Invite body estricto:

```ts
interface InviteTenantUserPayload {
  email: string;
  name: string;
  phone?: string;
  language: 'de' | 'en' | 'es';
}
```

Nunca incluye `clientId`; backend obtiene el tenant de la sesión.

Resultados relevantes:

- `201 TENANT_USER_INVITED`;
- `200 TENANT_USER_INVITATION_RENEWED` para invitación expirada;
- `409 TENANT_USER_ALREADY_EXISTS`;
- `409 TENANT_USER_INVITATION_ALREADY_PENDING`;
- `502 TENANT_USER_INVITATION_DELIVERY_FAILED`.

Resend usa `invitationId`, rota token y renueva 24 horas. Revoke elimina la
proyección del directorio. Ninguna operación dashboard devuelve el token.

## Onboarding

- token dedicado `tui_`, opaco, de un solo uso;
- resolve y accept usan endpoints públicos del dominio;
- accept establece password, verifica/activa Auth y membership, crea profile
  mínimo si falta y cambia la proyección invitation por user;
- backend no crea sesión; el flujo continúa en login.

## Persistencia y rendimiento

Backend implementa un read model `TenantUserDirectoryEntry` local al dominio.
Las rows no se construyen con N+1. La proyección se sincroniza desde Auth,
UserClient, profile, requests e invitaciones, y dispone de rebuild.

Frontend no debe duplicar estas políticas ni reconstruir agregados.

## Correspondencia con la implementación frontend

Los tipos de `packages/types/tenantUsers.ts`, los servicios de
`packages/services/tenantUsers.ts` y las BFF routes V2 coinciden con este
contrato. Las desviaciones restantes están descritas en
`USERS_DIRECTORY_GAP_ANALYSIS.md` y no requieren cambiar el backend.
