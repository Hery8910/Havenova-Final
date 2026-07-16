# Contrato de entorno

## Propósito

Definir runtime, variables y validaciones necesarias para desarrollar y desplegar las tres
apps sin depender de configuración implícita.

No incluir valores secretos reales en este repositorio.

## Runtime

| Campo | Valor canónico |
| --- | --- |
| Node | `22.x` |
| pnpm | `10.24.0` |
| Package manager source | campo `packageManager` de `package.json` |
| Install | `pnpm install --frozen-lockfile` |

Desarrollo y CI deben usar las mismas versiones mayores.

## Variables observadas

### `BACKEND_API_URL`

- Visibilidad: server-only.
- Consumidor: BFF/backend request helpers.
- Requerida: sí para producción.
- Formato: URL base absoluta sin path de endpoint.
- Ejemplo no real: `https://api.example.invalid`.

Debe convertirse en la única base backend para BFF. No exponerla como variable pública si
el navegador no necesita conocerla.

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

El host guard normaliza puerto y casing. Durante la migración debe evaluarse renombrar esta
variable como server-only porque su consumidor es una validación de servidor.

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

| Variable | Client | Dashboard | Worker |
| --- | --- | --- | --- |
| `BACKEND_API_URL` | BFF | BFF | BFF |
| `NEXT_PUBLIC_TENANT_KEY` | Sí | Sí | Sí |
| `NEXT_PUBLIC_ALLOWED_HOSTS` | Según dominio | Según dominio | Según dominio |
| `NEXT_PUBLIC_TENANT_KEY_FALLBACK` | Transicional | Transicional | Transicional |
| `NEXT_PUBLIC_API_URL` | Legacy | Legacy | Legacy |
| `NEXT_PUBLIC_API_BASE_URL` | Legacy | Legacy | Legacy |

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
