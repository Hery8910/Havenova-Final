# People Users Directory

## Estado actual

La evaluación vigente para la rectificación Customers es la
[auditoría frontend Customers Directory](../../../../../../../docs/02-convergence/users/CUSTOMERS_DIRECTORY_FRONTEND_READINESS_AUDIT.md).
Este README conserva documentación V2 histórica como evidencia; no sustituye
Product Design ni autoriza la superficie Customers.

`/people/users` es la primera superficie real del patrón `people directory`.

El núcleo del dominio V2 está implementado en frontend y backend. Ya no existe
una migración V1 pendiente. La deuda restante es de cierre UX, manejo de errores,
restore móvil, i18n y tests.

Última auditoría: `2026-07-10`.

## Orden de lectura

Para continuar trabajo con contexto mínimo, leer sólo:

1. [PAGE_REQUIREMENTS.md](./PAGE_REQUIREMENTS.md) — contrato funcional y técnico;
2. [USERS_DIRECTORY_GAP_ANALYSIS.md](./USERS_DIRECTORY_GAP_ANALYSIS.md) — qué cumple el código y qué falta;
3. [USERS_DIRECTORY_FRONTEND_IMPLEMENTATION_PLAN.md](./USERS_DIRECTORY_FRONTEND_IMPLEMENTATION_PLAN.md) — plan de cierre pendiente;
4. [USERS_DIRECTORY_BACKEND_DECISIONS.md](./USERS_DIRECTORY_BACKEND_DECISIONS.md) — resumen local del contrato backend.

Estándares globales:

- [DASHBOARD_PEOPLE_DOMAIN.md](../../docs/DASHBOARD_PEOPLE_DOMAIN.md);
- [DASHBOARD_PEOPLE_DIRECTORY_BACKEND_STANDARD.md](../../docs/DASHBOARD_PEOPLE_DIRECTORY_BACKEND_STANDARD.md);
- [DASHBOARD_DIRECTORY_PAGE_STANDARD.md](../../docs/DASHBOARD_DIRECTORY_PAGE_STANDARD.md).

## Fuentes de backend

La documentación canónica backend existe, pero está en un repositorio hermano y
no está incluida en este repo:

```text
/home/heriberto/Escritorio/Backend/backend/src/modules/home-services/tenant-users/
```

Fuentes normativas:

- `docs/directory/01-product-and-domain-decisions.md`;
- `docs/directory/02-people-directory-backend-standard.md`;
- `docs/directory/03-tenant-users-backend-contract.md`;
- `docs/directory/05-related-domains-contract.md`;
- `FRONTEND_INTEGRATION.md`.

Si esas rutas no están disponibles en otro entorno, solicitar el paquete backend
antes de modificar DTOs, endpoints o reglas de negocio. El resumen local permite
trabajar sobre UI, pero no sustituye la especificación backend completa.

## Documentos de referencia, no de estado

- `users-directory-prototype(2)/users-directory-notes.md`: decisión original de producto/UX;
- `users-directory-prototype(2)/*.html|css`: referencia visual e interactiva;
- `USERS_DIRECTORY_BACKEND_PACKAGE.md`: manifiesto del handoff backend.

No usar sus checklists antiguos para determinar qué está implementado. El estado
real vive en `USERS_DIRECTORY_GAP_ANALYSIS.md`.

## Regla de producto

La página representa:

```text
auth + userClient(role=user) + optional profile + commercial relationship
```

No representa:

- `my profile`;
- admins, workers o managers;
- una pantalla operativa independiente por `userClientId`;
- una auditoría de MongoDB o de login.

El admin puede descubrir, buscar, filtrar, seleccionar, invitar y gestionar el
onboarding de clientes dentro de la misma superficie.

## Contrato de navegación

Ruta principal:

```text
/people/users
```

Estado semántico:

```text
selected=<entryId>
mode=detail|invite
search=<term>
status=all|active|inactive|invitations|attention
```

`/people/users/[userClientId]` sólo es un deep link legacy que redirige a la
superficie principal con `selected=user:<userClientId>`. El código de consumo no
debe interpretar el formato de `entryId`.

## Implementación actual

Correcto y estable:

- `page.tsx` server-first y controlador interactivo local;
- summary remoto independiente;
- directorio `user | invitation`;
- filtros y búsqueda remota V2;
- cursor y deduplicación por `entryId`;
- detail por entry;
- invite, resend y revoke;
- onboarding público `tui_`;
- selección y filtros reflejados en URL.

Pendiente:

- i18n y feedback accesible;
- validación manual end-to-end.

## Mapa de código

- `page.tsx`: parseo inicial de URL;
- `page.controller.tsx`: orquestación y efectos;
- `page.copy.ts`: copy y mapping de filtros/summary;
- `page.types.ts`: props locales;
- `components/*`: modos de panel y vista de página;
- `../../components/directory/*`: primitives compartidas de directorio;
- `../../components/people/users/*`: row y detail del dominio;
- `packages/types/tenantUsers.ts`: tipos canónicos de consumo;
- `packages/services/tenantUsers.ts`: cliente V2;
- `app/api/home-services/dashboard/users/*`: BFF dashboard.

## Regla para cambios

Un cambio de UI no puede redefinir reglas de dominio. Si requiere modificar
filtros, estados, `attentionReasons`, orden, endpoints, DTOs o ciclo de
invitación, primero debe contrastarse con el paquete backend canónico y actualizar
ambos repositorios de forma coordinada.
