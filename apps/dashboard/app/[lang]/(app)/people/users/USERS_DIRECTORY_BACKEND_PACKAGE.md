# Users Directory Backend Package — manifiesto local

## Estado

Backend V2 está implementado y su documentación canónica existe. Este archivo ya
no es una solicitud de implementación: registra dónde está la fuente y qué parte
se replica localmente.

Auditoría: `2026-07-10`.

## Ubicación canónica

Repositorio hermano, no incluido en este repo frontend:

```text
/home/heriberto/Escritorio/Backend/backend/src/modules/home-services/tenant-users/
```

Orden de lectura backend:

1. `docs/directory/README.md`;
2. `docs/directory/01-product-and-domain-decisions.md`;
3. `docs/directory/02-people-directory-backend-standard.md`;
4. `docs/directory/03-tenant-users-backend-contract.md`;
5. `docs/directory/04-implementation-plan.md`;
6. `docs/directory/05-related-domains-contract.md`;
7. `FRONTEND_INTEGRATION.md`.

También existe la implementación real: routes, schemas, policy, projection,
services, controllers y tests del módulo.

## Documentación local

- `USERS_DIRECTORY_BACKEND_DECISIONS.md`: resumen actualizado del contrato V2;
- `PAGE_REQUIREMENTS.md`: requisitos del consumidor frontend;
- `USERS_DIRECTORY_GAP_ANALYSIS.md`: correspondencia código/contrato y deuda;
- `USERS_DIRECTORY_FRONTEND_IMPLEMENTATION_PLAN.md`: trabajo restante.

Los archivos `users-directory-prototype(2)/*` conservan contexto de producto y
referencia visual, pero no son fuente de verdad del contrato implementado.

## Qué está cerrado

- summary global;
- directorio unificado `user | invitation`;
- búsqueda, filtros y cursor;
- `entryId` estable;
- política única de atención;
- read projection sin N+1 por row;
- detail discriminado;
- ciclo persistido invite/resend/revoke;
- onboarding público con token `tui_`;
- relaciones MVP con service requests;
- evolución futura de work orders, appointments y otros dominios.

## Regla para otro entorno o modelo

No asumir que las rutas absolutas anteriores estarán disponibles. Si sólo se
entrega este repositorio, el resumen local permite continuar el cierre frontend,
pero cualquier cambio de DTO, endpoint o regla de negocio requiere adjuntar o
consultar el paquete backend canónico.
