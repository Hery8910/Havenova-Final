# Plan de migración del frontend

## Estado

- Propietario: frontend
- Última revisión: `2026-07-16` (Fase 1, tarea 2)
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

| Fase | Estado |
| --- | --- |
| 0. Fundación documental | `COMPLETED` |
| 1. Baseline reproducible | `IN_PROGRESS` |
| 2. Convergencia de producto | `PENDING` |
| 3. Límites estructurales | `PENDING` |
| 4. Assets, branding y correo | `PENDING` |
| 5. Implementación por slices | `PENDING` |
| 6. Release Havenova | `PENDING` |
| 7. Prueba Perfect Service | `PENDING` |

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
3. añadir CI Node 22/pnpm 10;
4. reparar las dos pruebas contractuales después de validar comportamiento;
5. restaurar una suite real de interacción o retirar la configuración Jest falsa —
   `COMPLETED`: resuelta mediante las 18 suites y 71 tests recuperados en PR #4;
6. eliminar warnings de lint/build;
7. añadir `.env.example` sin secretos y validación de entorno;
8. añadir worker al gate de build/deploy;
9. parchear dependencias directas vulnerables compatibles;
10. registrar excepciones de seguridad temporales.

### Criterio de salida

- instalación frozen verde en CI;
- lint sin warnings;
- typecheck verde en tres apps;
- tests contractuales 100%;
- suite de comportamiento mínima verde;
- tres builds verdes;
- ninguna variable obligatoria silenciosamente ausente;
- no hay `node_modules` versionado.

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
