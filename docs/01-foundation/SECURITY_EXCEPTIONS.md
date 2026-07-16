# Registro de excepciones de seguridad

## Propósito y evidencia

Registro canónico de decisiones temporales sobre advisories pendientes. No sustituye el
gate de release ni autoriza por sí solo desplegar Havenova.

- Propietario: frontend
- Última revisión: `2026-07-16` (Fase 1, tarea 10)
- Estado: `ACTIVE`
- Inventario: endpoint bulk oficial de npm sobre las versiones resueltas en `pnpm-lock.yaml`.

`pnpm audit` y `pnpm audit --prod` responden HTTP 410 porque npm retiró el endpoint que usa
pnpm 10.24.0. Es una limitación de tooling, no un audit verde ni una excepción de vulnerabilidad.

| Estado | Uso |
| --- | --- |
| `REMEDIATED` | Corregido y verificado; no es una aceptación vigente. |
| `NOT_APPLICABLE` | Requiere evidencia concreta de que la superficie no puede afectarse. |
| `TEMPORARY_EXCEPTION` | Riesgo limitado, con owner, issue, fecha y condición de salida. |
| `RELEASE_BLOCKING` | Permite desarrollo/CI, pero bloquea publicar Havenova. |
| `PENDING_ANALYSIS` | Falta evidencia; vence pronto y no puede convertirse en aceptación silenciosa. |

## Inventario confirmado

El endpoint bulk devuelve 54 entradas: 30 high, 19 moderate y 5 low. Una misma advisory puede
aparecer para varias versiones o rutas; se registra una sola vez por unidad de decisión, con sus
rutas compartidas descritas en cada grupo.

| Grupo | Paquetes/versiones afectados | Máxima | Advisory IDs | Padre que controla la remediación | Ejecución |
| --- | --- | --- | --- | --- | --- |
| SEC-EXC-001 | `next@14.2.35` | high | `GHSA-8h8q-6873-q5fj`, `GHSA-3g8h-86w9-wvmq`, `GHSA-ffhc-5mcf-pf4q`, `GHSA-vfv6-92ff-j949`, `GHSA-gx5p-jg67-6x7h`, `GHSA-h64f-5h5j-jqjh`, `GHSA-c4j6-fc7j-m34r`, `GHSA-wfc6-r584-vfw7`, `GHSA-36qx-fr4f-26g5`, `GHSA-9g9p-9gw9-jx7f`, `GHSA-h25m-26qc-wcjf`, `GHSA-ggv3-7p47-pfv8`, `GHSA-3x4c-7xq6-9pq8`, `GHSA-q4gf-8mx6-v5v3` | Next directo | server runtime, browser output y build |
| SEC-EXC-002 | `next-pwa@5.6.0` → Workbox 6.6 / Babel / Webpack / Rollup | high | `GHSA-4x5r-pxfx-6jf8`, `GHSA-fv7c-fp4j-7gwp`, `GHSA-7h2j-956f-4vf2`, `GHSA-2g4f-4pwh-qvx6`, `GHSA-f886-m6hf-6m8v`, `GHSA-v39h-62p7-jpjc`, `GHSA-q3j6-qgpj-74h6`, `GHSA-qx2v-qp2m-jg93`, `GHSA-mw96-cpmx-2vgc`, `GHSA-5c6j-r48x-rmvq`, `GHSA-8fgc-7cc6-rx7x`, `GHSA-38r7-794h-5758` | `next-pwa` directo | build-time; PWA output requiere revisión |
| SEC-EXC-003 | `eslint@8.57.1` → `flatted@3.3.3`, `glob`, `minimatch`, `lodash`, `js-yaml` | high | `GHSA-25h7-pfq9-p65f`, `GHSA-rf6f-7fwh-wjgh`, `GHSA-5j98-mcp5-4vw2`, `GHSA-3ppc-4f35-3m26`, `GHSA-7r86-cg39-jmmj`, `GHSA-23c5-xmqv-rm74`, `GHSA-xxjr-mmjv-4gpg`, `GHSA-r5fr-rjxr-66jc`, `GHSA-f23m-r3pf-42rh`, `GHSA-mh29-5h37-fv8m`, `GHSA-h67p-54hq-rp68` | ESLint/config/plugins directos | development lint |
| SEC-EXC-004 | `jest@30.3.0`, `jest-environment-jsdom@30.3.0` → `picomatch`, `ws` y rutas compartidas de glob/minimatch | high | `GHSA-3v7f-55p6-f55p`, `GHSA-c2c7-rcm5-vvqj`, `GHSA-58qx-3vcg-4xpx`, `GHSA-96hv-2xvq-fx4p` | Jest/JSDOM directos | development/test |

Los IDs repetidos por varias versiones de `brace-expansion`, `minimatch`, `picomatch` y
`js-yaml` se contabilizan por el endpoint bulk, pero no se duplican como decisiones. No hay
elementos `NOT_APPLICABLE`: no se afirma falta de alcanzabilidad sin una prueba específica.

## Remediado en la Tarea 9

| Estado | Paquetes | Evidencia |
| --- | --- | --- |
| `REMEDIATED` | `axios` 1.11.0 → 1.18.1, `js-cookie` 3.0.5 → 3.0.8 y `uuid` 11.1.0 → 11.1.1; cierre de Axios en `follow-redirects` y `form-data` | 82 → 54 entradas bulk; PR #10 y matriz CI verde. |

## Decisiones vigentes

### SEC-EXC-001 — Next.js 14

- Estado: `RELEASE_BLOCKING`.
- Aprobación: `2026-07-16`; owner: frontend.
- Paquetes/advisories: los 14 IDs y `next@14.2.35` del inventario; máxima high.
- Dependencia responsable y rutas: Next directo en raíz, client, dashboard y worker; también
  peer de `next-pwa` y `next-sitemap`.
- Superficie: server runtime, middleware, rutas App/Pages y artefactos browser; producción.
- Alcanzabilidad y escenario: los advisories incluyen DoS de Server Components/Image API, SSRF
  por WebSocket upgrades y bypass/cache poisoning. No se declara ninguno no aplicable: varias
  superficies server están presentes y requieren revisión al migrar.
- Motivo y riesgo: la versión corregida exige migración mayor coordinada; mantener 14.x deja
  riesgo high en producción.
- Mitigaciones: BFF same-origin, allowlist de hosts, CI de build reproducible y variables
  ficticias reducen superficies concretas, pero no corrigen Next.
- Alcance aceptado: sólo desarrollo, CI y trabajo de migración.
- No autorizado: publicar/release de Havenova, introducir nuevas rutas expuestas o aceptar
  advisories críticos nuevos sin revisión inmediata.
- Seguimiento: [#11](https://github.com/Hery8910/Havenova-Final/issues/11).
- Expira: `2026-08-15` o antes de Fase 6, lo que ocurra primero.
- Condición de salida: Next soportado y corregido, tres builds y pruebas verdes, inventario bulk
  actualizado.
- Revisión anticipada: advisory crítico, explotación pública, cambio de middleware/Image/API o
  cambio de alcance de release.

### SEC-EXC-002 — next-pwa / Workbox

- Estado: `TEMPORARY_EXCEPTION`.
- Aprobación: `2026-07-16`; owner: frontend.
- Paquetes/advisories: `next-pwa@5.6.0`, `workbox-build@6.6.0`,
  `workbox-webpack-plugin@6.6.0`, `webpack@5.101.3`, `rollup@2.79.2` y la familia de 12 IDs
  del inventario; máxima high.
- Dependencia responsable y rutas: las tres apps → `next-pwa` → Workbox build → Babel,
  Webpack/Rollup y utilidades afectadas.
- Superficie: build-time; los paquetes vulnerables enumerados no se han demostrado en el browser
  runtime, pero la salida PWA necesita validación al cambiar la cadena.
- Escenario y riesgo: entrada o configuración de build maliciosa puede activar vulnerabilidades
  de parsing, path traversal, inyección o DoS en tooling.
- Motivo: retirar/reemplazar o modernizar PWA requiere validar service-worker generado y las tres
  apps; no se fuerza con overrides.
- Mitigaciones: builds CI aislados, configuración controlada en repositorio y outputs no
  versionados. No son una prueba de ausencia de alcanzabilidad.
- Alcance aceptado: desarrollo y CI de builds controlados.
- No autorizado: tratar esta excepción como aprobación de un release o aceptar entradas de build
  no revisadas.
- Seguimiento: [#12](https://github.com/Hery8910/Havenova-Final/issues/12).
- Expira: `2026-08-30`.
- Condición de salida: reemplazo/remoción o cadena PWA mantenida, builds/artefactos validados e
  inventario bulk reducido.
- Revisión anticipada: advisory crítico, cambio PWA/service-worker o incorporación de input de
  build no controlado.

### SEC-EXC-003 — ESLint 8

- Estado: `TEMPORARY_EXCEPTION`.
- Aprobación: `2026-07-16`; owner: frontend.
- Paquetes/advisories: `eslint@8.57.1`, configuraciones/plugins y las transitivas de la familia
  del inventario; máxima high.
- Dependencia responsable y rutas: raíz y tres apps → ESLint/config/plugins → `flat-cache`,
  `glob`, `minimatch`, `lodash` y `js-yaml`.
- Superficie: development lint; no se envía en bundles browser ni servidor de producción.
- Escenario y riesgo: procesar un repositorio/configuración o patrón hostil puede alcanzar parsing,
  cache o glob tooling durante lint.
- Motivo y mitigaciones: ESLint 8 está deprecado y su reemplazo requiere compatibilidad con
  `eslint-config-next` y plugins; CI ejecuta lint sobre checkout controlado.
- Alcance aceptado: desarrollo/CI de lint sobre fuentes confiables.
- No autorizado: ejecutar lint contra contenido no confiable ni usarlo como aceptación de riesgo
  de producción.
- Seguimiento: [#13](https://github.com/Hery8910/Havenova-Final/issues/13).
- Expira: `2026-10-14`.
- Condición de salida: toolchain ESLint soportado, cero warnings e inventario actualizado.
- Revisión anticipada: advisory crítico, nueva superficie de lint no confiable o incompatibilidad
  que bloquee CI.

### SEC-EXC-004 — Jest / JSDOM

- Estado: `TEMPORARY_EXCEPTION`.
- Aprobación: `2026-07-16`; owner: frontend.
- Paquetes/advisories: `jest@30.3.0`, `jest-environment-jsdom@30.3.0`, `ws@8.20.0`,
  `picomatch` y rutas compartidas; máxima high.
- Dependencia responsable y rutas: raíz → Jest/JSDOM → `jsdom`/Jest utilities → `ws`, glob y
  matching utilities.
- Superficie: development/test; no se incluye en bundles desplegados.
- Escenario y riesgo: fixtures, paths o datos de test hostiles podrían activar DoS o parsing en el
  runner; los fixtures versionados son controlados, sin afirmar seguridad absoluta.
- Motivo y mitigaciones: la suite recién recuperada necesita actualización coordinada; CI ejecuta
  tests en runner efímero y fuentes versionadas.
- Alcance aceptado: desarrollo/CI de la suite actual.
- No autorizado: ejecutar tests con fixtures no confiables ni convertirlo en aceptación para
  runtime de producción.
- Seguimiento: [#14](https://github.com/Hery8910/Havenova-Final/issues/14).
- Expira: `2026-10-14`.
- Condición de salida: familia Jest/JSDOM compatible actualizada y 19 suites verdes.
- Revisión anticipada: advisory crítico, nuevo input no confiable en test o fallo de CI.

### SEC-EXC-005 — Comando de audit retirado

- Estado: `PENDING_ANALYSIS`.
- Aprobación: `2026-07-16`; owner: frontend.
- Paquetes/advisories: no aplica; cubre el HTTP 410 de `pnpm audit` y `pnpm audit --prod`.
- Superficie: tooling de desarrollo/CI; no es una vulnerabilidad ni una aceptación de las 54
  entradas bulk.
- Riesgo y motivo: perder un comando estándar puede ocultar cambios en advisories; el endpoint
  bulk conserva evidencia temporal sin introducir herramienta nueva.
- Mitigaciones: inventario bulk documentado, lockfile congelado y revisión manual de cambios de
  dependencias.
- Alcance aceptado: sólo usar el inventario bulk hasta resolver el tooling.
- No autorizado: interpretar HTTP 410 como audit verde o omitir la revisión de advisories.
- Seguimiento: [#15](https://github.com/Hery8910/Havenova-Final/issues/15).
- Expira: `2026-08-15`.
- Condición de salida: comando soportado que produzca audit completo y productivo.
- Revisión anticipada: cambio de pnpm/npm, fallo del endpoint bulk o advisory crítico nuevo.

## Reglas operativas

- Una excepción vencida falla el gate correspondiente hasta renovarse o remediarse.
- Cualquier advisory critical nuevo exige revisión inmediata.
- `RELEASE_BLOCKING` permite desarrollo/CI, nunca publicación.
- Ninguna excepción autoriza cambiar dependencias, producto, infraestructura o alcance de release
  fuera del issue de seguimiento.
