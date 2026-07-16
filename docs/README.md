# Índice documental

## Propósito

Este índice define qué documentos gobiernan el frontend, cuáles describen estado y cuáles
se conservan únicamente como evidencia.

La cantidad de documentación existente no implica autoridad. Cuando haya contradicción,
aplicar el orden definido en [`AGENTS.md`](../AGENTS.md).

## Documentos normativos

| Documento | Responsabilidad |
| --- | --- |
| [`AGENTS.md`](../AGENTS.md) | Reglas obligatorias de trabajo |
| [`ARCHITECTURE.md`](../ARCHITECTURE.md) | Límites y dirección arquitectónica |
| [`FRONTEND_DECISIONS_LOG.md`](01-foundation/FRONTEND_DECISIONS_LOG.md) | Decisiones técnicas vigentes |
| [`PRODUCT_AUTHORITY_AND_INTEGRATION.md`](02-contracts/PRODUCT_AUTHORITY_AND_INTEGRATION.md) | Relación Product Design, frontend y backend |
| [`ASSET_STRATEGY.md`](03-assets/ASSET_STRATEGY.md) | Gobierno de assets y branding |
| [`EMAIL_BRANDING_CONTRACT.md`](03-assets/EMAIL_BRANDING_CONTRACT.md) | Contrato visual/técnico de correos |

Los `AGENTS.md` locales añaden reglas para client, dashboard, worker y packages.

## Estado vivo

| Documento | Responsabilidad |
| --- | --- |
| [`FRONTEND_MIGRATION_PLAN.md`](01-foundation/FRONTEND_MIGRATION_PLAN.md) | Fases, estado y criterios de salida |
| [`IMPLEMENTATION_AUTHORITY_MATRIX.md`](01-foundation/IMPLEMENTATION_AUTHORITY_MATRIX.md) | Qué está aprobado, implementado, bloqueado o diferido |
| [`QUALITY_GATES.md`](01-foundation/QUALITY_GATES.md) | Gates locales, de PR y de release |
| [`SECURITY_EXCEPTIONS.md`](01-foundation/SECURITY_EXCEPTIONS.md) | Excepciones temporales, riesgos release-blocking y seguimiento de advisories |
| [`ENVIRONMENT_CONTRACT.md`](01-foundation/ENVIRONMENT_CONTRACT.md) | Runtime y variables de entorno |
| [`ASSET_REGISTRY.md`](03-assets/ASSET_REGISTRY.md) | Inventario y decisiones de assets |
| [`TENANT_ONBOARDING_RUNBOOK.md`](04-operations/TENANT_ONBOARDING_RUNBOOK.md) | Entradas y pasos para una empresa nueva |

Todo documento de estado vivo debe indicar fecha de revisión y no afirmar cumplimiento
sin evidencia reproducible.

## Auditorías

| Documento | Baseline |
| --- | --- |
| [`FRONTEND_BASELINE_AUDIT_2026-07-16.md`](00-audit/FRONTEND_BASELINE_AUDIT_2026-07-16.md) | Commit `19bf648` |
| [`product-audit/FRONTEND_PRODUCT_AUDIT.md`](product-audit/FRONTEND_PRODUCT_AUDIT.md) | Evidencia observada el 10 de julio de 2026 |
| [`02-convergence/users/USERS_CONVERGENCE_AUDIT.md`](02-convergence/users/USERS_CONVERGENCE_AUDIT.md) | Convergencia Users v1, Fase 2; no autoriza implementación |

Una auditoría explica lo que se observó. No autoriza producto ni sustituye un contrato.

## Documentación legacy existente

Los documentos históricos que aún viven directamente en `docs/` o junto a features deben
clasificarse antes de moverlos. Durante la migración pueden tener uno de estos estados:

- `CANONICAL`: se mantiene y se integra al índice;
- `TRANSITIONAL`: útil mientras se completa una migración;
- `EVIDENCE`: describe una implementación o decisión anterior;
- `SUPERSEDED`: sustituido por un documento canónico;
- `REMOVABLE`: sin consumidores ni valor histórico relevante.

No añadir más documentos raíz de feature hasta cerrar esta clasificación.

## Convenciones

- Markdown en español para gobernanza de este repositorio.
- Enlaces relativos dentro del repo.
- Referencias cross-repo mediante URL estable y commit/tag cuando sea posible.
- Sin rutas absolutas locales.
- Un documento, una responsabilidad.
- Fecha y baseline en auditorías.
- Estado y criterio de salida en planes.
- Contratos backend resumidos sólo cuando sea necesario para consumo; la fuente completa
  permanece en el backend.

## Estructura objetivo

```text
docs/
  00-audit/
  01-foundation/
  02-contracts/
  03-assets/
  04-operations/
  product-audit/          # evidencia existente pendiente de archivo definitivo
  99-archive/             # se creará cuando el inventario esté aprobado
```
