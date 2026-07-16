# Quality Gates

## Propósito

Definir evidencia mínima para aceptar cambios y para declarar una release. Los gates se
aplican en proporción al alcance, pero ningún PR puede omitir un fallo conocido sin
documentarlo.

- Propietario: frontend
- Última revisión: `2026-07-16` (Fase 1, tarea 8)
- Estado del documento: `ACTIVE`

## Toolchain canónica

- Node.js `22.x`
- pnpm `10.24.0`
- lockfile congelado

El resultado local con otra versión puede orientar, pero CI canónica decide.

## Baseline al iniciar la migración

| Gate | Estado en `19bf648` |
| --- | --- |
| Typecheck tres apps | Verde |
| Build tres apps | Verde |
| Contract tests | 91/93 |
| Jest UI | Bloqueado: setup inexistente |
| Lint client | Verde con 3 warnings |
| Lint dashboard | Verde con 4 warnings |
| Lint worker | Verde sin warnings |
| CI GitHub Actions | Inexistente |
| Dependency audit | 36 high, 27 moderate, 6 low |
| Vercel client/dashboard | Verde |
| Vercel worker | Sin check visible |

Esta tabla describe deuda inicial; no redefine el objetivo de los gates.

## Gate local antes de abrir PR

### Obligatorio para cualquier cambio de código

```bash
pnpm install --frozen-lockfile
pnpm --filter @havenova/client exec tsc --noEmit
pnpm --filter @havenova/dashboard exec tsc --noEmit
pnpm --filter @havenova/worker exec tsc --noEmit
pnpm test:client-context
```

Ejecutar además lint y build en toda app o paquete alcanzado por el cambio.

### Cambio en packages compartidos

Un cambio en `packages/*` debe validar las tres apps salvo que una comprobación de
dependencias demuestre que el paquete sólo tiene un consumidor.

### Cambio de documentación

- enlaces relativos válidos;
- sin rutas `/home/...` nuevas;
- headings y tablas renderizables;
- matriz/plan actualizados si cambia estado;
- afirmaciones de producto acompañadas de fuente vigente.

### Cambio de assets

- entrada en `ASSET_REGISTRY.md`;
- origen/licencia conocidos;
- dimensiones y peso verificados;
- alt text o marca de asset decorativo;
- sin duplicado versionado;
- consumidores documentados.

## Gate de PR

CI debe ejecutar:

1. instalación frozen;
2. validación de workspace/lockfile;
3. lint sin warnings;
4. typecheck de client, dashboard y worker;
5. contract tests;
6. tests unitarios/de interacción;
7. builds de las tres apps;
8. auditoría de dependencias;
9. validación de links/documentación;
10. comprobación de assets generados/no versionados.

Objetivo: un solo check agregado no debe ocultar qué app falló.

### Gate canónico de builds reproducibles

`Phase 1 CI` es el gate canónico para builds reproducibles. Conserva el job `verify` y, tras él,
ejecuta una matriz independiente para client, dashboard y worker. Cada resultado se identifica por
app, usa instalación congelada y valores ficticios `.invalid`, y comprueba que `BACKEND_API_URL`
no aparece en `.next/static` ni se modifican archivos versionados durante el build.

Los checks Vercel de client y dashboard aportan evidencia adicional de deployment, pero no
sustituyen los tres builds de GitHub Actions. Worker no tiene deployment check todavía; su futuro
deployment pertenece al gate de release y no bloquea el gate de PR de la Fase 1.

## Reglas de tests

- Un test debe proteger comportamiento o contrato, no sólo una regex sobre un archivo.
- Los source-contract tests pueden coexistir como guard estructural, pero no ser la única
  evidencia de un flujo.
- No actualizar una expectativa hasta decidir si cambió el comportamiento o sólo el texto.
- Mutaciones necesitan casos success, known error, network failure y duplicate submit.
- Multi-tenancy necesita casos de tenant correcto y acceso cruzado rechazado.
- Responsive state necesita al menos prueba de URL/restore y validación manual.
- i18n necesita paridad de claves y render de longitudes críticas.

## Política de warnings

Objetivo del gate: cero warnings de lint y build.

No silenciar una regla globalmente para cerrar un warning local. Si existe una excepción
válida:

- limitarla a la línea/componente;
- explicar el motivo;
- añadir una prueba cuando el riesgo lo requiera.

## Seguridad

### PR gate

- cero vulnerabilidades críticas nuevas;
- cero vulnerabilidades altas nuevas;
- dependencias directas afectadas requieren actualización o excepción documentada;
- no se introducen secretos o tokens en cliente, logs o fixtures.

### Release gate

- cero critical;
- cero high sin excepción aceptada y fecha de expiración;
- revisión de cookies, CSRF, headers, host allowlist y tenant isolation;
- dependency report adjunto a la evidencia de release.

## Gate de entorno

Cada app debe validar variables obligatorias al arrancar o construir. No se acepta un build
verde que produzca una aplicación incapaz de resolver tenant/backend en producción.

Consultar `ENVIRONMENT_CONTRACT.md`.

## Gate de accesibilidad

Para superficies nuevas o modificadas:

- landmarks y heading hierarchy;
- labels visibles;
- navegación completa por teclado;
- foco visible y restauración cuando cambie la vista;
- loading/error/success anunciables;
- estado no comunicado sólo por color;
- alt text correcto;
- contraste en light/dark si ambos themes aplican.

## Gate visual/manual

Cuando haya UI:

- mobile, tablet y desktop;
- `de`, `en`, `es`;
- light/dark cuando aplique;
- loading, empty, error, partial y success;
- zoom 200%;
- contenido largo y datos ausentes;
- sin consola inesperada.

La evidencia manual se registra una vez que el comportamiento automatizado esté verde.

## Gate de release

Además del PR gate:

- Vercel/deploy checks de client, dashboard y worker;
- smoke tests contra backend desplegado;
- variables y dominios verificados;
- migrations/config de tenant listas;
- email sender/domain y templates verificados;
- assets aprobados;
- observabilidad y request IDs;
- rollback documentado;
- checklist de `TENANT_ONBOARDING_RUNBOOK.md` completo.

## Excepciones

Toda excepción debe incluir:

- gate afectado;
- motivo;
- riesgo aceptado;
- owner;
- issue/PR de seguimiento;
- fecha o condición de expiración.

“Ya fallaba antes” no es una excepción suficiente.
