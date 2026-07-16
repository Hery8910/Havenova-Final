# Contrato de entorno

## Propósito

Definir runtime, variables y validaciones necesarias para desarrollar y desplegar las tres
apps sin depender de configuración implícita.

- Propietario: frontend
- Aprobación compartida: backend/operations cuando cambie transporte, secretos o deploy
- Última revisión: `2026-07-16` (Fase 1, tarea 7)
- Estado del documento: `ACTIVE`

No incluir valores secretos reales en este repositorio.

## Runtime

| Campo                  | Valor canónico                           |
| ---------------------- | ---------------------------------------- |
| Node                   | `22.x`                                   |
| pnpm                   | `10.24.0`                                |
| Package manager source | campo `packageManager` de `package.json` |
| Install                | `pnpm install --frozen-lockfile`         |

Desarrollo y CI deben usar las mismas versiones mayores.

## Inventario confirmado e implementación

La validación tipada se separa en `packages/services/environment/publicEnvironment.ts` y
`packages/services/environment/serverEnvironment.ts`. Sus funciones puras reciben un objeto de
entorno explícito para que tests y herramientas no dependan del entorno personal. Los consumidores
runtime leen propiedades estáticas de `process.env`, compatibles con la sustitución build-time de
Next.js; el módulo público no exporta ni lee configuración backend. El BFF es el único consumidor
de `serverEnvironment.ts`. Los errores sólo incluyen el nombre de la variable y la razón, nunca su
valor.

| Variable                          | Consumidores                                 | Visibilidad               | Entornos/tiempo                            | Formato                             | Fallback/lifecycle                                   |
| --------------------------------- | -------------------------------------------- | ------------------------- | ------------------------------------------ | ----------------------------------- | ---------------------------------------------------- |
| `BACKEND_API_URL`                 | BFF `backendRequest` y middleware            | server-only               | production; runtime server                 | URL HTTP(S) base absoluta, sin path | Canónica; requerida en production                    |
| `NEXT_PUBLIC_TENANT_KEY`          | tenant resolver/bootstrap                    | pública                   | todos; build-time                          | tenant key estable                  | Canónica; requerida en production si no hay fallback |
| `NEXT_PUBLIC_TENANT_KEY_FALLBACK` | tenant resolver/bootstrap                    | pública                   | todos; build-time                          | tenant key estable                  | Transicional; alternativa a la key primaria          |
| `NEXT_PUBLIC_ALLOWED_HOSTS`       | host guard server-side                       | pública actual            | production; runtime server                 | CSV de hosts, sin esquema ni path   | Canónica actual; requerida en production             |
| `NEXT_PUBLIC_API_URL`             | cliente browser-direct legacy y fallback BFF | pública                   | todos; build-time/browser y runtime server | URL HTTP(S) base absoluta           | Legacy/transicional; sólo si falta `BACKEND_API_URL` |
| `NEXT_PUBLIC_API_BASE_URL`        | fallback BFF legacy                          | pública                   | todos; build-time/runtime server           | URL HTTP(S) base absoluta           | Legacy/transicional; sólo si faltan las anteriores   |
| `NODE_ENV`                        | Next, validator, fallbacks de contexto       | gestionada por plataforma | build-time y runtime                       | `development`, `test`, `production` | No configurar manualmente                            |

No se hallaron consumidores versionados adicionales en Next config, scripts, CI ni configuración de
deployment. Los valores hardcoded `tnk_demo_havenova` y hosts locales son fallbacks explícitos de
development/test; no habilitan producción.

## Ejemplos seguros

Cada app carga su entorno desde su propio root de deployment. Los ejemplos versionados son:

- `apps/client/.env.example`;
- `apps/dashboard/.env.example`;
- `apps/worker/.env.example`.

Contienen sólo dominios `.invalid` y tenant keys ficticias. `NEXT_PUBLIC_*` queda expuesto al
navegador y nunca debe contener secretos. `.gitignore` ignora `.env*` reales y permite
explícitamente `.env.example`.

## Variables observadas

### `BACKEND_API_URL`

- Visibilidad: server-only.
- Consumidor: BFF/backend request helpers.
- Requerida: sí para producción.
- Formato: URL base absoluta sin path de endpoint.
- Ejemplo no real: `https://api.example.invalid`.

Debe convertirse en la única base backend para BFF. El validador normaliza el origen y rechaza
paths, query, fragment, credenciales y protocolos distintos de HTTP(S). No exponerla como variable
pública si el navegador no necesita conocerla.

### `NEXT_PUBLIC_TENANT_KEY`

- Visibilidad: pública.
- Consumidor: tenant resolver/bootstrap.
- Requerida: sí para un deployment tenant-specific.
- Formato: identificador estable emitido por backend.

No utilizar nombres de empresa libres como sustituto del identificador canónico.

### `NEXT_PUBLIC_TENANT_KEY_FALLBACK`

- Visibilidad: pública.
- Estado: transicional.
- Uso: fallback después de `NEXT_PUBLIC_TENANT_KEY`.

No configurar ambas sin documentar por qué. El objetivo es retirar el fallback cuando la
configuración de deployments esté estabilizada.

### `NEXT_PUBLIC_ALLOWED_HOSTS`

- Visibilidad actual: pública.
- Consumidor: host guard.
- Requerida: sí en producción según la implementación actual.
- Formato: hosts separados por coma, sin esquema ni path.
- Ejemplo no real: `app.example.invalid,dashboard.example.invalid`.

El host guard normaliza puerto y casing. El validador rechaza esquemas, paths y hosts inválidos.
Durante la migración debe evaluarse renombrar esta variable como server-only porque su consumidor
es una validación de servidor.

### `NEXT_PUBLIC_API_URL`

- Visibilidad: pública.
- Estado: legacy/transicional.
- Consumidores: cliente browser-direct y fallback de BFF.

No utilizar en dominios nuevos. Debe desaparecer cuando se complete la migración BFF.

### `NEXT_PUBLIC_API_BASE_URL`

- Visibilidad: pública.
- Estado: legacy fallback de backend request.

No utilizar en código nuevo. Retirar junto con el fallback browser-direct.

### `NODE_ENV`

Gestionada por la plataforma/Next. No asignar manualmente valores no estándar.

## Variables por app

| Variable                          | Client        | Dashboard     | Worker        |
| --------------------------------- | ------------- | ------------- | ------------- |
| `BACKEND_API_URL`                 | BFF           | BFF           | BFF           |
| `NEXT_PUBLIC_TENANT_KEY`          | Sí            | Sí            | Sí            |
| `NEXT_PUBLIC_ALLOWED_HOSTS`       | Según dominio | Según dominio | Según dominio |
| `NEXT_PUBLIC_TENANT_KEY_FALLBACK` | Transicional  | Transicional  | Transicional  |
| `NEXT_PUBLIC_API_URL`             | Legacy        | Legacy        | Legacy        |
| `NEXT_PUBLIC_API_BASE_URL`        | Legacy        | Legacy        | Legacy        |

## Normalización y fallos

- production exige backend, tenant key (primaria o fallback) y allowlist de hosts;
- development y test conservan `tnk_demo_havenova` sólo como fallback explícito;
- preview conserva las validaciones de formato, pero no activa fallbacks de producción;
- los BFF conservan los fallbacks legacy `NEXT_PUBLIC_API_URL` y
  `NEXT_PUBLIC_API_BASE_URL` para compatibilidad, con prioridad para `BACKEND_API_URL`;
- el validator es puro y no registra valores ni emite logs propios durante prerender; sus mensajes
  son breves y consistentes para que el runtime no añada ruido por página estática.

## Development fallback

La baseline utiliza `tnk_demo_havenova` cuando falta tenant key fuera de producción. Este
fallback es evidencia local, no contrato final.

Objetivo de migración:

- `.env.example` sin secretos;
- tenant fixture explícito para desarrollo;
- ningún fallback silencioso en producción;
- tests que no dependan de una variable personal del desarrollador.

## Validación requerida

La Fase 1 debe añadir un validador tipado que:

- falle con mensaje corto si falta una variable obligatoria;
- diferencie build-time de runtime cuando sea necesario;
- no imprima secretos;
- evite repetir el mismo error durante cada página estática;
- exponga una configuración normalizada a los consumers.

Las pruebas en `tests/jest/services/environment-validation.test.jsx` cubren presencia obligatoria,
URL y allowlist inválidas, normalización, fallbacks development/test, aislamiento de `process.env`,
mensajes sin valores y compatibilidad legacy.

La comprobación local de bundles usa una URL sentinel server-only temporal y busca su cadena sólo
en `apps/client/.next/static`; el resultado debe ser cero coincidencias. No se inspeccionan chunks
server, donde la URL puede existir legítimamente.

### Evidencia local de la Tarea 7

- `publicEnvironment.ts` y `serverEnvironment.ts` mantienen validación lazy y específica por
  consumidor; tenant, host guard y BFF no exigen variables ajenas;
- 15 pruebas específicas de entorno cubren el contrato y el aislamiento server/public;
- lint y typecheck de client, dashboard y worker, los contract tests y Jest completo pasan;
- los builds de dashboard y worker pasan;
- el build local de client se interrumpió externamente durante el build optimizado, sin resultado
  fallido. El escaneo negativo de la URL sentinel sólo cubre los artefactos estáticos generados
  hasta esa interrupción; no prueba un bundle final completado;
- la validación autoritativa de los tres builds y su incorporación al gate remoto corresponde a la
  Tarea 8 / CI.

## Entornos

Cada tenant necesita, como mínimo:

- local/development;
- preview;
- production.

Cada entorno debe registrar:

- frontend domains por superficie;
- backend base URL;
- tenant key;
- allowlist de hosts;
- email sender/domain;
- observabilidad;
- responsables de deploy y rollback.

## Reglas

- No guardar `.env` reales en Git.
- No compartir secrets por documentación o screenshots.
- No depender de variables no declaradas aquí.
- Toda variable nueva requiere owner, visibilidad, formato y lifecycle.
- Una variable `NEXT_PUBLIC_*` se considera pública y no puede contener secretos.
