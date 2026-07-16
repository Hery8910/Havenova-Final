# Havenova Frontend Workspace

Monorepo frontend de Havenova y base de validación del producto operativo reutilizable de
Maped Solutions.

Este repositorio contiene tres superficies:

- `apps/client`: experiencia pública y experiencia de cliente específica del tenant;
- `apps/dashboard`: producto operativo compartido para administradores del tenant;
- `apps/worker`: producto operativo compartido para trabajadores.

La dirección de producto no se deduce del código existente. Product Design define el
comportamiento autorizado; este repositorio implementa ese comportamiento y conserva el
estado anterior únicamente como evidencia.

## Estado de la base

Baseline auditado: commit `19bf648` (`2026-07-16`).

| Área | Estado observado |
| --- | --- |
| TypeScript | Pasa en client, dashboard y worker |
| Build de producción | Pasa en las tres apps |
| Vercel | Client y dashboard en verde; worker sin check visible |
| Pruebas contractuales | 91/93; dos expectativas pendientes de rectificación |
| Pruebas UI | Bloqueadas por configuración Jest incompleta |
| CI propio | No existe todavía |
| Seguridad de dependencias | 36 altas, 27 moderadas y 6 bajas |
| Assets | 195 archivos; 88 copias duplicadas |
| Dashboard | Users es la única superficie operativa amplia; 39 rutas son placeholders |

Un build verde no significa que todo el producto esté aprobado. Consultar la
[matriz de autoridad](docs/01-foundation/IMPLEMENTATION_AUTHORITY_MATRIX.md) antes de
continuar una funcionalidad existente.

## Modelo reutilizable

```text
Core Product + Tenant Configuration + Specific Extensions
```

- Dashboard y worker pertenecen al core compartido.
- El client público puede variar por empresa.
- Branding, locale, dominios y remitentes son configuración del tenant.
- Las extensiones específicas deben permanecer aisladas y justificadas.
- Perfect Service debe poder adoptar dashboard y worker sin modificar su código fuente.

## Antes de modificar el repositorio

Leer, en este orden:

1. [`AGENTS.md`](AGENTS.md)
2. [`ARCHITECTURE.md`](ARCHITECTURE.md)
3. [`docs/README.md`](docs/README.md)
4. [`IMPLEMENTATION_AUTHORITY_MATRIX.md`](docs/01-foundation/IMPLEMENTATION_AUTHORITY_MATRIX.md)
5. [`FRONTEND_MIGRATION_PLAN.md`](docs/01-foundation/FRONTEND_MIGRATION_PLAN.md)
6. El `AGENTS.md` más cercano al área que se vaya a modificar.

## Workspace

```text
apps/
  client/
  dashboard/
  worker/

packages/
  assets/
  components/
  contexts/
  hooks/
  i18n/
  services/
  styles/
  types/
  utils/

docs/
tests/
```

La estructura actual es transicional. La dirección y las dependencias permitidas se
definen en [`ARCHITECTURE.md`](ARCHITECTURE.md).

## Toolchain

- Node.js `22.x`
- pnpm `10.24.0`
- Next.js `14.2.35` durante la estabilización
- React `18.3.1` durante la estabilización

No actualizar Next o React como parte incidental de otro cambio.

## Comandos principales

```bash
pnpm install --frozen-lockfile
pnpm dev:client
pnpm dev:dashboard
pnpm dev:worker
pnpm lint
pnpm test:client-context
pnpm test:contexts:ui
pnpm build
```

La lista completa de gates y las excepciones temporales están en
[`QUALITY_GATES.md`](docs/01-foundation/QUALITY_GATES.md).

## Documentación

El índice, los niveles de autoridad y la política de archivo están en
[`docs/README.md`](docs/README.md). No añadir enlaces absolutos a rutas locales ni crear
un documento nuevo si uno canónico ya posee esa responsabilidad.
