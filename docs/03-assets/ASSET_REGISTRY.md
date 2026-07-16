# Registro de assets

## Estado

- Propietario documental: frontend
- Aprobación de uso: Product Design
- Última revisión: `2026-07-16`
- Baseline: `19bf648`
- Inventario inicial: `2026-07-16`
- Estado global: `INVENTORY_REQUIRED`

Este registro empieza por grupos. Durante la Fase 4 cada asset aprobado recibirá una fila
individual y estable.

## Estados

| Estado | Significado |
| --- | --- |
| `PROPOSED` | Recurso solicitado, todavía no aprobado |
| `APPROVED` | Source y uso aprobados |
| `ACTIVE` | Tiene consumidores productivos verificados |
| `REVIEW_REQUIRED` | Existe en la baseline, autoridad/uso no cerrados |
| `LEGACY` | No debe recibir nuevos consumidores |
| `GENERATED` | Derivado, nunca source master |
| `REMOVABLE` | Puede eliminarse después de retirar consumidores |

## Campos requeridos por asset final

| Campo | Descripción |
| --- | --- |
| `assetId` | Identificador estable y semántico |
| `owner` | product, tenant, client, email o generated |
| `tenant` | tenant key o `global` |
| `sourcePath/sourceUrl` | Fuente canónica |
| `format` | SVG, PNG, WebP, etc. |
| `dimensions` | Intrinsic width/height cuando aplique |
| `variant` | light, dark, compact, etc. |
| `altTextRule` | Localizado, nombre tenant o decorativo |
| `origin/license` | Procedencia y derechos |
| `status` | Estado del lifecycle |
| `consumers` | Superficies verificadas |
| `replacement` | Asset ID sucesor si existe |

## Inventario inicial por grupo

| Grupo | Ubicación baseline | Cantidad/duplicación | Clasificación inicial | Estado | Acción |
| --- | --- | ---: | --- | --- | --- |
| Logos Havenova shared | `packages/assets/shared/logos` | 5 | tenant branding mal clasificado | `REVIEW_REQUIRED` | Definir source masters y sacar de product shared |
| Logos client | `apps/client/public/logos` | 6 | tenant/client branding | `LEGACY` | Comparar hashes y consumidores |
| Logos dashboard | `apps/dashboard/public/logos` | 7 | tenant branding copiado | `LEGACY` | Sustituir por tenant config |
| Logos worker | `apps/worker/public/logos` | 7 | tenant branding copiado | `LEGACY` | Sustituir por tenant config |
| Alert illustrations | `packages/assets/shared/alert` + tres apps | 4 sources, 16 files | candidato product UI | `REVIEW_REQUIRED` | Validar diseño y dejar una fuente |
| Avatar presets | `packages/assets/shared/avatars` + tres apps | 10 sources, 40 files | UI/tenant unknown | `REVIEW_REQUIRED` | Confirmar necesidad, licencia y privacidad |
| User background | `packages/assets/shared/svg` + tres apps | 1 source, 4 files | candidato product UI | `REVIEW_REQUIRED` | Validar uso y dejar una fuente |
| Client images | `apps/client/public/images` | 16 | client content | `REVIEW_REQUIRED` | Registrar propósito, derechos y consumidores |
| Client SVG | `apps/client/public/svg` | 12 | mezcla UI/content | `REVIEW_REQUIRED` | Clasificar individualmente |
| Client screenshots | `apps/client/public/screenshots` | 21 | PWA/store evidence | `LEGACY` | Retener sólo si PWA se aprueba |
| Dashboard screenshots | `apps/dashboard/public/screenshots` | 2 | PWA/store evidence | `LEGACY` | Revisar manifest y vigencia |
| Worker screenshots | `apps/worker/public/screenshots` | 2 | PWA/store evidence | `LEGACY` | Revisar manifest y vigencia |
| Favicons/app icons | roots de las tres apps | múltiples sets | generated tenant branding | `GENERATED` | Regenerar desde master, no mantener a mano |
| Dashboard `sw.js`/workbox | `apps/dashboard/public` | 2 | generated PWA output | `REMOVABLE` | Retirar si PWA no está activa/canónica |
| Sitemap XML | roots de apps | 6 | generated SEO output | `LEGACY` | Sustituir por generación correcta |

## Assets mínimos pendientes de aprobación

### Havenova

| Asset ID propuesto | Estado | Nota |
| --- | --- | --- |
| `tenant.havenova.brand.wordmark.light` | `PROPOSED` | Elegir source master |
| `tenant.havenova.brand.wordmark.dark` | `PROPOSED` | Confirmar necesidad dark |
| `tenant.havenova.brand.symbol` | `PROPOSED` | Resolver espacios compactos |
| `tenant.havenova.brand.favicon.master` | `PROPOSED` | Source para derivados |
| `tenant.havenova.email.logo` | `PROPOSED` | PNG optimizado y URL estable |

### Perfect Service

No crear assets todavía. El runbook debe solicitar los mismos slots una vez que Product
Design y la identidad de marca estén aprobados.

## Registro de decisiones

| Fecha | Decisión | Referencia |
| --- | --- | --- |
| 2026-07-16 | No añadir más copias durante la migración | `FE-006` |
| 2026-07-16 | Email usa asset dedicado y HTML shared | `FE-007` |
| 2026-07-16 | Assets existentes permanecen sin autoridad hasta inventario | Auditoría baseline |

## Próxima actualización

Fase 4, Wave 1: generar inventario individual con hash, peso, dimensiones y consumidores.
No eliminar binarios antes de completar ese mapa.
