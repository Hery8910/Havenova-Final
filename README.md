# Havenova Frontend Workspace

Monorepo frontend de Havenova basado en `Next.js` con dos aplicaciones principales:

- `apps/client`: experiencia pública y área de cliente
- `apps/dashboard`: panel operativo interno

El workspace está organizado en paquetes compartidos para:

- `components`
- `contexts`
- `hooks`
- `i18n`
- `services`
- `types`
- `utils`

## Estado actual

El proyecto está funcional, pero atraviesa una fase de consolidación arquitectónica.

Prioridades activas:

1. preparar una base sólida para despliegue controlado
2. cerrar separaciones de responsabilidad incompletas
3. documentar un patrón estable de arquitectura y documentación
4. convertir dominios clave como `auth` en piezas reutilizables para futuros proyectos multi-client

## Documentación clave

Arquitectura y organización general:

- [docs/FRONTEND_ARCHITECTURE_AUDIT.md](/home/heriberto/Escritorio/Havenova/havenova/docs/FRONTEND_ARCHITECTURE_AUDIT.md:1)
- [docs/DOCUMENTATION_STANDARD.md](/home/heriberto/Escritorio/Havenova/havenova/docs/DOCUMENTATION_STANDARD.md:1)
- [docs/FRONTEND_TARGET_ARCHITECTURE.md](/home/heriberto/Escritorio/Havenova/havenova/docs/FRONTEND_TARGET_ARCHITECTURE.md:1)
- [docs/PHASE2_EXECUTION_PROPOSAL.md](/home/heriberto/Escritorio/Havenova/havenova/docs/PHASE2_EXECUTION_PROPOSAL.md:1)
- [docs/LEGACY_INVENTORY.md](/home/heriberto/Escritorio/Havenova/havenova/docs/LEGACY_INVENTORY.md:1)

Dominio `auth`:

- [packages/contexts/auth/AUTH_FRONTEND_AUDIT.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/AUTH_FRONTEND_AUDIT.md:1)
- [packages/contexts/auth/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/README.md:1)
- [apps/client/app/[lang]/(auth)/README.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/README.md:1)

Otros dominios y contextos:

- [packages/contexts/client/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/client/README.md:1)
- [packages/contexts/profile/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/profile/README.md:1)
- [packages/contexts/alert/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/alert/README.md:1)

Rutas cliente actualmente auditadas:

- [apps/client/app/[lang]/(app)/HOME_PAGE_AUDIT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/HOME_PAGE_AUDIT.md:1)
- [apps/client/app/[lang]/(app)/HOW_IT_WORK_AUDIT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/HOW_IT_WORK_AUDIT.md:1)
- [apps/client/app/[lang]/(app)/HOW_IT_WORK_PLAN.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/HOW_IT_WORK_PLAN.md:1)

## Estructura de alto nivel

```text
apps/
  client/
  dashboard/

packages/
  components/
  contexts/
  hooks/
  i18n/
  services/
  types/
  utils/

docs/
tests/
```

## Scripts principales

```bash
pnpm dev
pnpm dev:client
pnpm dev:dashboard
pnpm build
pnpm lint
pnpm check:types
pnpm test:client-context
pnpm test:contexts:ui
```

## Dirección arquitectónica

La dirección acordada para esta base es:

- rutas `app/` server-first por defecto
- lógica interactiva concentrada en contenedores cliente por feature cuando haga falta
- dominios compartidos desacoplados de apps concretas
- documentación con patrón repetible por contexto, ruta y feature
- flujos importantes documentados con comportamiento funcional y visual

## Nota

Este `README` deja de ser el template por defecto de Next.js y pasa a actuar como índice operativo del workspace.
