# Arquitectura del frontend

## Propósito

Este documento define la dirección arquitectónica canónica del workspace durante la
migración. Describe responsabilidades y límites; no pretende afirmar que la estructura
actual ya los cumple.

## Objetivo

Producir una base operativa multi-tenant que permita:

- validar Havenova como primer tenant real;
- reutilizar dashboard y worker en Perfect Service;
- sustituir o adaptar el client público sin duplicar el producto operativo;
- incorporar futuros tenants mediante configuración y no mediante forks del core.

## Modelo

```text
Product Design
      |
      v
Core Product + Tenant Configuration + Specific Extensions
      |
      +-- dashboard compartido
      +-- worker compartido
      +-- contratos de correo compartidos
      +-- client específico del tenant
```

Product Design define el producto. Backend y frontend implementan contratos coordinados.
La implementación existente se utiliza como evidencia, no como autoridad.

## Superficies

### `apps/client`

Superficie específica del tenant para adquisición, contenido público y, cuando Product
Design lo apruebe, experiencia de cliente autenticado.

Puede variar por empresa en:

- estructura de marketing;
- contenido, fotografías y SEO;
- servicios presentados;
- formularios públicos aprobados;
- capacidades de portal de cliente aprobadas.

No debe exportar componentes de negocio hacia dashboard o worker.

### `apps/dashboard`

Producto operativo compartido para administradores de un tenant.

Debe variar únicamente mediante:

- configuración tenant;
- permisos y capacidades aprobadas;
- datos del backend;
- branding semántico registrado.

No admite condiciones o copy específico de Havenova dentro del core.

### `apps/worker`

Producto operativo compartido para trabajadores. Actualmente existe una base de sesión y
perfil; las operaciones de trabajo siguen sujetas a Product Design.

No debe inferir agenda, asignaciones o estados de servicio desde rutas placeholder.

## Capas lógicas

```text
Routes / layouts
        |
App features
        |
Domain adapters and BFF clients
        |
Shared UI and platform services
        |
Pure types, utilities and tokens
```

Dirección permitida: de arriba hacia abajo. Las capas inferiores no importan desde apps o
features concretas.

## Rutas y rendering

- `page.tsx` y layouts son server-first por defecto.
- Una ruta traduce URL, locale y autorización en props de entrada.
- La interactividad vive en un controlador cliente local y acotado.
- Las vistas reciben datos y callbacks; no poseen transporte.
- Los componentes compartidos no conocen query params de una página concreta.
- No se renderizan `<html>` o `<body>` dentro de layouts anidados.

## Frontera de integración

Flujo canónico:

```text
Browser -> frontend same-origin route -> BFF adapter -> backend
```

Responsabilidades del BFF:

- reenviar cookies autorizadas;
- preservar `x-csrf-token` cuando corresponda;
- añadir request ID y locale;
- construir upstreams desde configuración server-only;
- no introducir reglas de negocio;
- no devolver secretos que backend no expone al navegador.

`BACKEND_API_URL` es server-only. Las variables públicas de backend existentes son
transicionales y no deben extenderse.

## Sesión y complementos

Composición prevista:

- client: auth + complemento de perfil de cliente;
- dashboard: auth + complemento admin;
- worker: auth + complemento worker.

Auth posee sesión, refresh, logout, rol y verificación. Cada complemento posee identidad
visible, preferencias y datos operativos de su superficie.

El servidor confirma autorización. El estado local sólo ofrece continuidad visual.

## Tenant configuration

La configuración del tenant debe ser tipada y resolver, como mínimo:

- `tenantKey` estable;
- locales habilitados y locale por defecto;
- zona horaria;
- dominios permitidos;
- información de contacto y legal;
- tokens de marca permitidos;
- referencias de logos e iconos;
- remitentes de correo;
- capacidades del producto aprobadas.

La configuración no debe convertirse en un sistema ilimitado de flags. Una diferencia que
cambia reglas de negocio requiere análisis de Product Design y puede ser una extensión
específica.

## Assets

Clasificación obligatoria:

1. product asset neutral;
2. tenant branding asset;
3. client content asset;
4. email asset;
5. generated derivative.

Los binarios tienen una sola fuente canónica. Las apps no versionan copias generadas. El
registro de assets define propietarios y consumidores.

## Email

El frontend mantiene el contrato visual y, si es útil, una vista de preview. El backend o
el servicio de correo mantiene render y entrega.

Los templates comparten estructura HTML y consumen branding del tenant mediante URLs
públicas estables. No se comparte código runtime entre frontend y backend sólo para
acceder a un archivo de imagen.

## Paquetes compartidos

Durante la migración se mantienen los paquetes existentes, pero se aplican estas reglas:

- un paquete declara sus dependencias internas;
- no existen ciclos;
- no hay self-imports mediante el barrel raíz;
- cada export público tiene propietario claro;
- UI compartida contiene primitivas o patrones validados por más de un consumidor;
- una feature específica permanece en su app hasta demostrar reutilización;
- tipos de transporte no se mezclan con view models de una página.

## i18n

- Los locales activos actuales son `de`, `en` y `es`.
- Todo copy visible debe existir en los tres catálogos aprobados.
- No mantener fallbacks de una sola lengua en runtime.
- Copy de marca del client puede ser tenant-specific.
- Copy operativo de dashboard y worker pertenece al core y debe ser neutro respecto al
  tenant.

## Observabilidad y errores

- Preservar códigos backend estables.
- La UI decide por código, nunca parseando `message`.
- Los errores técnicos se registran sin exponer secretos.
- Estados loading, empty, failure y retry son explícitos.
- Correlation/request IDs deben cruzar BFF y backend cuando estén disponibles.

## Estado transicional conocido

La baseline `19bf648` todavía presenta:

- imports por aliases y rutas relativas incompatibles;
- barrels globales que expanden dependencias;
- servicios browser-direct;
- contextos y controladores sobredimensionados;
- layouts anidados con elementos de documento;
- rutas placeholder que no representan producto aprobado;
- assets duplicados por sincronización y versionado;
- configuración PWA raíz que no aplican las apps;
- tests de fuente que no sustituyen pruebas de comportamiento.

Estos puntos son deuda registrada, no patrones autorizados.

## Estrategia de migración

No se realizará una reescritura total. Cada área se clasificará como:

- conservar;
- corregir;
- extraer;
- reemplazar;
- diferir;
- eliminar.

La migración seguirá los gates y fases de
[`FRONTEND_MIGRATION_PLAN.md`](docs/01-foundation/FRONTEND_MIGRATION_PLAN.md).

## Prueba final de reutilización

La arquitectura se considerará validada cuando Perfect Service pueda:

- registrar una configuración tenant y un branding diferente;
- desplegar el mismo dashboard;
- desplegar la misma worker app;
- utilizar contratos de correo compartidos;
- construir un client público independiente;
- hacerlo sin modificar código fuente del core por diferencias de marca.
