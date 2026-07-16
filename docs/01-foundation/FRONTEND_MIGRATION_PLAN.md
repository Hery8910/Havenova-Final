# Plan de migración del frontend

## Estado

- Propietario: frontend
- Última revisión: `2026-07-16` (Fase 1, tarea 10)
- Estado del documento: `ACTIVE`
- Baseline: `19bf648`
- Inicio: `2026-07-16`
- Objetivo: base reutilizable para Havenova, Perfect Service y futuros tenants.
- Estrategia: migración incremental; no reescritura total.
- Evidencia de la Fase 0: [PR #2](https://github.com/Hery8910/Havenova-Final/pull/2)
- Evidencia de la Fase 1:
  - [PR #3](https://github.com/Hery8910/Havenova-Final/pull/3) — higiene del repositorio.
  - [PR #4](https://github.com/Hery8910/Havenova-Final/pull/4) — recuperación de Jest.

## Principios

1. Product Design crea autoridad de producto.
2. Código y auditorías son evidencia.
3. Backend y frontend convergen mediante contratos versionados.
4. Dashboard y worker pertenecen al core compartido.
5. El client puede variar por tenant.
6. No se implementa un slice bloqueado.
7. Cada fase termina con evidencia reproducible.

## Estado global

| Fase                         | Estado        |
| ---------------------------- | ------------- |
| 0. Fundación documental      | `COMPLETED`   |
| 1. Baseline reproducible     | `COMPLETED`   |
| 2. Convergencia de producto  | `PENDING`     |
| 3. Límites estructurales     | `PENDING`     |
| 4. Assets, branding y correo | `PENDING`     |
| 5. Implementación por slices | `PENDING`     |
| 6. Release Havenova          | `PENDING`     |
| 7. Prueba Perfect Service    | `PENDING`     |

## Fase 0 — Fundación documental

### Objetivo

Crear una fuente local clara para que humanos y Codex sepan qué leer, qué está aprobado y
qué no deben continuar.

### Entregables

- root y scoped `AGENTS.md`;
- `ARCHITECTURE.md`;
- índice documental;
- auditoría fijada a commit;
- matriz de autoridad;
- decisions log;
- quality gates;
- contrato de entorno;
- contratos de assets/correo;
- runbook de tenants.

### Criterio de salida

- enlaces relativos válidos;
- ninguna afirmación de producto derivada sólo del código;
- baseline y limitaciones explícitas;
- PR sólo documental revisada, validada y lista para merge.

## Fase 1 — Baseline reproducible

### Objetivo

Transformar el verde observado en un contrato verificable por CI.

### Trabajo

1. corregir `.gitignore` y desversionar `node_modules` y outputs generados — `COMPLETED`.
   Evidencia local: `node v22.22.2`, `pnpm 10.24.0` y
   `pnpm install --frozen-lockfile` ejecutado en esta rama; se retiran del índice las
   93 entradas heredadas bajo `node_modules` y los outputs PWA
   `apps/dashboard/public/sw.js` y `workbox-4754cb34.js`, sin borrar sus archivos locales.
   `.gitignore` preserva los fuentes JavaScript y las declaraciones TypeScript; no contiene
   reglas globales para `*.js`, `*.jsx`, `*.d.ts` ni `*.map`.
   No queda ningún artefacto versionado identificado que no se haya podido retirar; el
   backup local `.next.bak-profile-settings/` se ignora como output no versionado.
   La corrección reveló 27 archivos locales nunca versionados: 23 pertenecen a la suite
   Jest referenciada por `jest.config.mjs` (setup, mocks y tests), 2 son declaraciones
   `css.d.ts`, 1 es un `not-found.js` legacy aparentemente sustituido y 1 es un archivo
   vacío sin propósito identificado. Ninguno se eliminará ni incorporará al índice sin
   verificación; no ejecutar `git clean` sobre este worktree.
2. recuperar y validar estas fuentes ocultas antes de decidir si se incorporan, difieren o
   retiran — `COMPLETED`.
   Después de sincronizar la limpieza, ejecutar `pnpm install --frozen-lockfile` para
   regenerar los enlaces workspace; con ellos regenerados, los typechecks de client,
   dashboard y worker vuelven a verde.
   El resultado inicial de Jest fue 11/19 suites y 44/45 tests. Se recuperan setup, mocks,
   test-providers y las suites restantes; se reparan el soporte local de `Request`/`Response`
   para Jest/JSDOM, los imports de WorkAddressSelector hacia `pages/shared/serviceRequest`,
   el mock de CSRF de auth y el harness de navbar, sin cambiar código productivo.
   `service-profile-step.test.jsx` protegía la edición de perfil incompleto (nombre,
   teléfono y dirección, con reload/alertas) y el resumen de perfil completo. El componente
   probado ya no existe; se retira este test local y no se recreará el componente sin Product
   Design. `apps/client/not-found.js` está sustituido por `app/not-found.tsx` y no se migra
   su diseño; los dos `css.d.ts` son redundantes y no resuelven diagnósticos; y
   `docs/frontend-foundation` está vacío. Esos cuatro archivos locales se retiran.
   Resultado final: Jest 18/18 suites y 71/71 tests verdes. Se preparan para versionado
   `tests/jest.setup.js`, los mocks, `test-providers` y las 18 suites restantes; se retiran
   `service-profile-step.test.jsx`, los dos `css.d.ts`, `not-found.js` y el archivo vacío.
   La recreación de ServiceProfileStep permanece bloqueada hasta decisión de Product Design.
3. añadir CI Node 22/pnpm 10 — `COMPLETED`: se añade
   `.github/workflows/phase-1-ci.yml` para pull requests y pushes a `main`, con Node 22,
   pnpm 10.24.0, caché oficial de pnpm mediante `actions/setup-node`, instalación
   congelada, la suite Jest recuperada y typecheck explícito de client, dashboard y worker.
   La validación local confirma `pnpm install --frozen-lockfile`, 18/18 suites y 71/71
   tests Jest, y los tres typechecks verdes; `pnpm-lock.yaml` no cambia. La apertura del
   primer pull request aportará la evidencia real de GitHub Actions: el workflow no se
   considera confirmado remotamente hasta que esa ejecución pase.
4. reparar las dos pruebas contractuales después de validar comportamiento — `COMPLETED`:
   93/93 pruebas declaradas pasan. La ruta `/account/profile` continúa declarada y navegable
   desde el catálogo y el shell canónicos; se retira sólo la expectativa de que el resumen del
   header sea un enlace. La recuperación CSRF protege `me → csrf reissue → refresh-token → me`,
   con token sólo en memoria y sin dependencia de cookie `csrfToken`.
   El gate contractual se añade al workflow después de Jest; la confirmación remota depende del
   pull request.
5. restaurar una suite real de interacción o retirar la configuración Jest falsa —
   `COMPLETED`: resuelta mediante las 18 suites y 71 tests recuperados en PR #4;
6. eliminar warnings de lint/build — `COMPLETED`: se resuelven 7 warnings propios: 6 mediante
   dependencias correctas de hooks y 1 con una excepción local y provisional para el avatar.
   El lint raíz usa salida streaming y client, dashboard y worker terminan sin warnings. Los builds
   de dashboard y worker pasan sin warnings; el build local de client fue inconcluso por una
   interrupción externa del ejecutor, sin evidencia de OOM, dependencia del backend ni regresión.
   La validación remota de los tres builds y del gate de lint corresponde a la Tarea 8 / CI.
7. añadir `.env.example` sin secretos y validación de entorno — `COMPLETED`: inventario y ejemplos
   por app confirmados; `publicEnvironment.ts` y `serverEnvironment.ts` validan de forma lazy y
   específica por consumidor, preservando sólo los fallbacks transicionales documentados. Se añaden
   15 pruebas de entorno; lint, typecheck, contratos y Jest pasan, y dashboard/worker construyen.
   El build local de client fue inconcluso por interrupción externa, no fallido; el escaneo negativo
   de la URL sentinel cubre sólo artefactos estáticos parciales. La validación autoritativa de los
   tres builds y su gate remoto se incorporarán en la Tarea 8 / CI.
8. añadir worker al gate de build/deploy — `COMPLETED`: `Phase 1 CI` conserva `verify` y
   ejecuta después una matriz independiente de builds para client, dashboard y worker, con
   `fail-fast: false`, configuración ficticia explícita bajo `.invalid`, límite de 20 minutos y
   resultados identificables por app. Los tres builds completan, verifican que el sentinel de
   `BACKEND_API_URL` no está en `.next/static` y confirman que no modifican archivos versionados.
   Worker tiene build reproducible en GitHub Actions, pero no deployment Vercel: ese deployment
   pertenece a un futuro gate de release y no bloquea la Fase 1. Vercel client/dashboard sigue
   siendo evidencia adicional de deployment, no un sustituto del gate de CI. La Fase 1 permanece
   `IN_PROGRESS` hasta completar las tareas 9 y 10.
9. parchear dependencias directas vulnerables compatibles — `COMPLETED`: se actualizan las
   dependencias de producción directas `axios` (1.11.0 → 1.18.1, dentro del rango declarado
   `^1.16.0`), `js-cookie` (3.0.5 → 3.0.8) y `uuid` (11.1.0 → 11.1.1) en raíz y las tres apps.
   El cierre transitivo de axios actualiza `follow-redirects` y `form-data`; no se usan overrides.
   El endpoint usado por `pnpm audit` fue retirado por npm y responde HTTP 410, por lo que la
   evidencia se obtuvo del endpoint bulk oficial de advisories contra `pnpm-lock.yaml`: 82
   advisories iniciales (44 high, 32 moderate, 6 low) se reducen a 54 (30 high, 19 moderate,
   5 low). Los checks remotos de pruebas, lint, tipos y builds de las tres apps pasan. Siguen
   `next@14.2.35` y cadenas transitivas de Next/Workbox, ESLint y Jest; su corrección requiere
   actualizar padres o valorar excepciones, y no queda aprobada en esta tarea.
10. registrar excepciones de seguridad temporales — `COMPLETED`: el registro canónico
    [SECURITY_EXCEPTIONS.md](SECURITY_EXCEPTIONS.md) clasifica las 54 entradas bulk restantes,
    documenta owners, fechas de expiración, mitigaciones, condiciones de salida e issues de
    seguimiento. `SEC-EXC-001` mantiene Next.js 14 como `RELEASE_BLOCKING`; las cadenas de
    next-pwa/Workbox, ESLint y Jest/JSDOM son excepciones temporales, y el HTTP 410 de `pnpm
    audit` queda como análisis pendiente de tooling. La instalación frozen y los checks remotos
    de lint, tipos, contratos, Jest y builds de client, dashboard y worker pasan; esta evidencia
    completa la baseline, sin aprobar una publicación mientras siga vigente `SEC-EXC-001`.

### Criterio de salida

- instalación frozen verde en CI;
- lint sin warnings;
- typecheck verde en tres apps;
- tests contractuales 100%;
- suite de comportamiento mínima verde;
- tres builds verdes;
- ninguna variable obligatoria silenciosamente ausente;
- no hay `node_modules` versionado.

La Fase 1 queda `COMPLETED` por cumplir estos criterios verificables. No equivale a
release-ready: `SEC-EXC-001` bloquea publicar Havenova hasta migrar Next.js a una versión
soportada y corregida. La siguiente etapa es la Fase 2; no habilita cambios de producto sin la
autoridad de Product Design y los contratos aplicables.

## Fase 2 — Convergencia de producto

### Objetivo

Clasificar el código existente respecto a Product Design y backend vigentes.

### Primer dominio: Users

- verificar Slice A: list, cursor, search y tenant isolation;
- decidir qué se conserva del responsive/restore;
- diferir summary/filter/attention/relationships si Product Design no los autoriza;
- bloquear invite/acceptance hasta cerrar sus contratos;
- verificar resend/revoke/expiry de forma independiente;
- reemplazar documentos locales que declaran backend cerrado por referencias versionadas;
- crear tests de integración contra el contrato realmente aprobado.

### Otros dominios

- auth y CSRF;
- formularios de servicios;
- perfil cliente;
- contacto;
- worker foundation;
- navegación/placeholder dashboard.

### Criterio de salida

- cada área tiene estado en la matriz;
- ningún `IMPLEMENTED_EVIDENCE` se presenta como release-ready;
- contratos cross-repo tienen versión o commit;
- backlog de eliminación no contiene decisiones implícitas de producto.

## Fase 3 — Límites estructurales

### Objetivo

Separar core, tenant configuration, client específico y extensiones.

### Trabajo

- normalizar imports y aliases;
- declarar dependencias internas;
- eliminar ciclos y barrels globales;
- dividir contextos/controladores sobredimensionados;
- migrar browser-direct al BFF;
- corregir layouts de documento;
- consolidar config por app;
- retirar prototipos del árbol productivo;
- definir resolver tipado de tenant y capabilities.

### Criterio de salida

- dependency direction verificable;
- apps no se importan entre sí;
- paquetes no dependen de apps;
- BFF es la única frontera browser/backend;
- no existen branches específicos de Havenova en core.

## Fase 4 — Assets, branding y correo

### Objetivo

Establecer una fuente canónica y definir los recursos mínimos por tenant.

### Trabajo

- completar `ASSET_REGISTRY.md`;
- clasificar 195 assets;
- identificar consumidores reales;
- decidir keep/replace/remove para cada grupo;
- dejar de versionar copias sincronizadas;
- definir branding config y variantes;
- definir header y assets de correo;
- decidir PWA y derivados requeridos;
- validar licencias, alt text, formatos y presupuestos de peso.

### Criterio de salida

- cero duplicados versionados sin justificación;
- un asset, una fuente;
- dashboard/worker sin branding hardcoded;
- client y email consumen assets registrados;
- checklist de nuevos tenants completo.

## Fase 5 — Implementación por slices

### Regla de entrada

Un slice entra sólo si Product Design lo marca listo y backend/frontend tienen contrato
verificable.

### Secuencia inicial

1. Users Slice A.
2. Validación producto/backend/frontend.
3. Siguiente slice aprobado.

No se utilizará la navegación placeholder como secuencia de roadmap.

## Fase 6 — Release Havenova

### Criterios

- gates de release verdes;
- dominios release-ready explícitos;
- seguridad revisada;
- observabilidad y rollback;
- entornos y dominios documentados;
- assets finales aprobados;
- emails validados;
- accesibilidad y responsive verificadas;
- contenido/legal/SEO cerrados para el client.

## Fase 7 — Prueba Perfect Service

### Objetivo

Demostrar que la base es producto reutilizable y no una app de Havenova copiada.

### Prueba

- crear tenant config de Perfect Service;
- aplicar branding diferente;
- desplegar dashboard y worker sin modificar core;
- configurar remitentes/email assets;
- construir client presentacional con formulario de contacto;
- documentar sólo los inputs adicionales requeridos.

### Criterio final

Si añadir Perfect Service exige branches de código por marca dentro de dashboard o worker,
la arquitectura todavía no está validada.

## Regla de actualización

Actualizar este plan al cerrar una fase o cambiar un blocker. No convertirlo en changelog;
las decisiones van al decisions log y la evidencia detallada a auditorías/PRs.
