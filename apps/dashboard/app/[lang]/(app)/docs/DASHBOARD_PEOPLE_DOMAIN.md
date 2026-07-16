# Dashboard People Domain

## Objetivo

Definir la regla compartida para las superficies de personas dentro del `dashboard`.

Esta decision baja a frontend la familia que ya se esta cerrando en backend:

- `auth + userClient + optional profile`
- `auth + userClient + worker`
- `auth + userClient + admin`
- `auth + userClient + manager`

## Regla Principal

`people` deja de significar un conjunto ambiguo de actores.

Dentro del dashboard significa:

- entidades basadas en `auth + userClient + complemento`
- gestionadas por un admin del tenant
- con patron comun de listado, detalle, invitacion y estados

No incluye:

- `profile` como `my profile`
- `property-manager` si no entra en este patron de onboarding
- entidades operativas que no dependan de `auth + userClient`

## Primera Decisión De Arquitectura

La capa visual compartida del dashboard se organiza alrededor de `people`.

Primera estructura local:

- `components/people/shared/*`
- `components/people/users/*`

La primera rama real implementada es:

- `/people/users`

Las siguientes ramas deben reutilizar la misma base:

- `/team/admins`
- `/team/workers`
- `/network/managers`

## Reglas De Reutilización

Compartir:

- shell de pagina
- filtros
- tabla
- badges de estado
- wiring de detalle
- patron de invitacion y reenvio

No compartir ciegamente:

- payloads de escritura
- validaciones especificas
- roles laborales
- secciones de detalle propias del complemento

## Relación Con La Arquitectura Anterior

La estructura anterior del dashboard separaba:

- `clients`
- `team/admins`
- `team/workers`
- `network/managers`

Esa estructura era util como placeholder, pero no refleja bien la familia real del backend.

Decision actual:

- `users` entra en `people`
- `admins`, `workers` y `managers` deben converger hacia la misma base UX
- `clients` deja de ser la referencia principal para esta familia

## Primera Superficie Activa

La primera pagina real del dominio es `tenant users`.

Base backend asociada:

- `GET /api/home-services/dashboard/users/summary`
- `GET /api/home-services/dashboard/users/directory`
- `GET /api/home-services/dashboard/users/entries/:entryId`
- `POST /api/home-services/dashboard/users/invite`
- `POST /api/home-services/dashboard/users/invitations/:invitationId/resend`
- `POST /api/home-services/dashboard/users/invitations/:invitationId/revoke`

Onboarding público asociado:

- `POST /api/home-services/user-invitations/resolve`
- `POST /api/home-services/user-invitations/accept`

## Estado Del Frontend

Implementado:

- tipos, servicios y BFF V2 de `tenant users`
- summary remoto y directorio unificado `user | invitation`
- cursor, filtros, búsqueda remota y detail por `entryId`
- invite, resend, revoke y onboarding público `tui_`
- base reusable `components/people/shared/*`
- primera página `people/users`

Pendiente para cierre de la primera superficie:

- cache y restauración semántica por `entryId`
- experiencia móvil lista/detail
- manejo de mutaciones por códigos estables
- i18n, accesibilidad y tests actualizados
- adopción del mismo patrón en `admin`, `worker` y `manager`
