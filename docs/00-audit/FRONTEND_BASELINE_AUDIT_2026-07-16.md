# Auditoría de baseline frontend — 2026-07-16

## Identificación

- Repositorio: `Hery8910/Havenova-Final`
- Rama observada: `main`
- Commit: `19bf648834cf04f99f97c5286bc8ef7424210ef6`
- Commit anterior comparado: `9ea33e36f9c77fe358ad6174693bbc945d5310c2`
- Alcance: inventario, arquitectura, builds, tests, seguridad, integración, documentación,
  assets, i18n, PWA, SEO y alineación de Users.

Este documento es evidencia inmutable de la baseline. Las decisiones vigentes viven en la
matriz de autoridad, la arquitectura y el plan de migración.

## Veredicto

La baseline es técnicamente compilable, pero todavía no constituye una plantilla de
producto gobernada ni una release completa.

La principal diferencia respecto a la auditoría del commit anterior es que los tres
typechecks y los tres builds pasan. El principal riesgo actual es la divergencia entre una
implementación amplia de Users y la rectificación posterior de Product Design.

## Delta observado

Entre `9ea33e3` y `19bf648`:

- 243 archivos cambiados;
- 13.252 inserciones;
- 7.267 eliminaciones;
- 53 archivos nuevos;
- 12 eliminados;
- 3 renombrados.

Áreas principales:

- Users Directory V2;
- invite, resend, revoke, resolve y accept;
- auth compartido de dashboard/worker;
- recuperación CSRF;
- perfil del cliente;
- formularios de cleaning/home services;
- BFF de contacto;
- i18n y documentación.

## Inventario

| Métrica | Resultado |
| --- | ---: |
| Archivos versionados | 1.179 |
| Markdown | 139 |
| Páginas Next | 69 |
| API routes | 28 |
| Páginas client | 20 |
| Páginas dashboard | 44 |
| Páginas worker | 5 |
| Placeholders dashboard | 39 |
| AGENTS.md | 0 en la baseline |
| Workflows GitHub Actions | 0 |
| Entradas `node_modules` versionadas | 93 |
| Assets visuales | 195 |

## Validación ejecutada

### TypeScript

| App | Resultado |
| --- | --- |
| Client | Pasa |
| Dashboard | Pasa |
| Worker | Pasa |

### Builds

| App | Resultado | Observaciones |
| --- | --- | --- |
| Client | Pasa | Tres warnings de hooks; tenant key ausente no falla el build |
| Dashboard | Pasa | Tres warnings de hooks y un `<img>` no optimizado |
| Worker | Pasa | Sin warnings de lint |

Los estados GitHub/Vercel del commit auditado son verdes para client y dashboard. No hay
un check visible para worker.

### Pruebas

- Contract tests: 93 total, 91 pasan, 2 fallan.
- Fallo 1: expectativa textual antigua sobre enlace `/account/profile` en el header.
- Fallo 2: expectativa antigua de recuperación CSRF mediante cookie.
- Jest UI: no inicia porque falta `tests/jest.setup.js`.
- No se encontraron pruebas Jest compatibles con el `testMatch` configurado.

Los contract tests actuales verifican principalmente texto fuente. Son útiles para
regresiones estructurales, pero no sustituyen pruebas de comportamiento.

### Limitaciones de entorno

- El repositorio requiere Node `22.x`; la auditoría local se ejecutó con Node `24.14.0`.
- Una instalación online limpia encontró errores `502` del registro npm.
- Manifests y lockfile no cambiaron respecto al árbol de dependencias previamente
  instalado.
- Los builds se ejecutaron con ese árbol idéntico y se contrastaron con Vercel verde.

CI con Node 22/pnpm 10 debe convertirse en la evidencia canónica.

## Seguridad de dependencias

Auditoría de producción:

| Severidad | Cantidad |
| --- | ---: |
| Critical | 0 |
| High | 36 |
| Moderate | 27 |
| Low | 6 |

Paquetes afectados incluyen Next, Axios, js-cookie, uuid, Babel, webpack, rollup,
postcss, lodash y dependencias transitivas.

El lockfile no cambió en el commit nuevo; este riesgo permanece.

## Arquitectura

### Fortalezas

- Monorepo con client, dashboard y worker.
- BFF same-origin consolidado en auth y varios dominios.
- Cookies/CSRF y protección SSR con una dirección correcta.
- Separación auth + complementos de sesión.
- Rutas server-first en Users.
- Directorio con cursor, búsqueda, URL state y responsive considerado.
- Formularios de servicio con pasos compartidos.

### Deuda

- `AuthContext`: 1.005 líneas.
- `Users page.controller`: 759 líneas, 24 estados y 11 efectos.
- `ProfileContext`: 752 líneas.
- Imports mezclados entre aliases y rutas profundas.
- Dos consumers importan desde barrels globales de componentes.
- Seis familias de servicios todavía usan el cliente browser-direct.
- Dependencias internas incompletas en manifests.
- Layouts dashboard/worker anidan `<html>` y `<body>`.
- Configuración Next/PWA raíz no utilizada por las apps.

## Users y autoridad de producto

La implementación actual contiene:

- summary remoto;
- filtros avanzados;
- attention reasons;
- directory `user | invitation`;
- relación comercial;
- invite/resend/revoke;
- onboarding público `resolve/accept`;
- restauración mobile y URL.

Sus documentos locales fueron auditados el `2026-07-10` y declaran el contrato V2 como
cerrado. Product Design fue rectificado después y actualmente mantiene parte de este
alcance bloqueado o diferido.

Clasificación de auditoría:

- directory/cursor/search/isolation: evidencia reutilizable y verificable;
- summary/filter/attention/relationships: requieren decisión de producto;
- invite/acceptance: implementados como evidencia, no release-ready;
- token lifecycle: verificable por separado del flujo completo;
- responsive/restore: candidato a patrón, no plantilla automática.

## Documentación

- 139 archivos Markdown.
- 93 contienen enlaces absolutos `/home/heriberto/...`.
- README de baseline sólo documenta dos apps.
- Múltiples documentos mezclan estado, decisión, auditoría y plan.
- El frontend duplica resúmenes de contratos backend sin enlaces versionados.
- El nuevo product audit es útil como evidencia del código del 10 de julio, pero no
  refleja por sí solo la autoridad Product Design del 12 de julio.

## Assets

| Métrica | Resultado |
| --- | ---: |
| Archivos | 195 |
| Contenidos únicos | 107 |
| Grupos duplicados | 54 |
| Copias duplicadas | 88 |

Avatares, iconos de alertas y fondos se encuentran en `packages/assets` y copiados en las
tres apps. El script de sincronización y el versionado simultáneo impiden tener una sola
fuente real.

No existe clasificación estable entre product asset, tenant branding, client content,
email asset y output generado.

## i18n

Locales: `de`, `en`, `es`.

- `common.json` y `components.json`: claves alineadas.
- `loadings.json`: claves alineadas.
- `pages.json`: faltan 4 claves en alemán.
- `popups.json`: faltan 8 claves en español.
- `example.json`: sólo existe en alemán y no forma parte del resource activo.

El shell dashboard todavía contiene copy por idioma en TypeScript.

## PWA y SEO

- `next-pwa` se declara en las apps, pero sólo la configuración raíz no utilizada lo
  activa.
- No se observó registro operativo de service worker.
- La UI presenta instalación de app sin baseline PWA completa.
- Sitemap y robots son estáticos, obsoletos y contradictorios.
- La configuración sitemap raíz sobrescribe una exportación con otra.

Debe decidirse si PWA pertenece al producto antes de repararla.

## Riesgos prioritarios

1. Tratar código adelantado como autoridad de producto.
2. Mantener una base verde sin CI reproducible.
3. Continuar añadiendo documentación contradictoria.
4. Ampliar paquetes compartidos sin límites.
5. Duplicar branding/assets en cada app.
6. Liberar con dependencias vulnerables.
7. Confundir placeholders con roadmap.

## Dirección recomendada

No reescribir todo. Clasificar y migrar por slices:

1. fundación documental;
2. baseline reproducible y seguridad directa;
3. convergencia Product Design/backend/frontend;
4. límites core/tenant/client;
5. assets y branding;
6. implementación por readiness;
7. prueba Perfect Service y runbook de release.
