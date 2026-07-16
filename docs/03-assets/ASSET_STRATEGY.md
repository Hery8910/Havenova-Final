# Estrategia de assets y branding

## Propósito

Definir qué assets necesita el producto, dónde vive su fuente y cómo evitar que branding,
contenido y outputs generados vuelvan a mezclarse.

## Problema de baseline

En `19bf648` existen:

- 195 assets visuales;
- 107 contenidos únicos;
- 54 grupos duplicados;
- 88 copias duplicadas;
- logos de Havenova bajo `packages/assets/shared`;
- avatares y alertas copiados en client, dashboard y worker;
- derivados PWA y screenshots sin una decisión PWA vigente;
- outputs `sw.js`/workbox versionados en dashboard.

La carpeta o el script actual no crean una fuente canónica si las copias también se
versionan.

## Clasificación obligatoria

### Product asset

Recurso neutral y reutilizable en el core: icono/ilustración/estado que no contiene marca,
copy o reglas específicas del tenant.

### Tenant branding asset

Identidad de una empresa: wordmark, símbolo, favicon master y logo de correo.

### Client content asset

Contenido comercial o editorial de una web pública: hero, servicios, equipo, testimonios,
Open Graph y fotografías.

### Email asset

Recurso optimizado para clientes de correo y publicado en URL HTTPS estable.

### Generated derivative

Salida reproducible desde una fuente aprobada: favicons, app icons, tamaños responsive,
service worker, sitemap o screenshots de store.

Los generated derivatives no son fuentes y no deben versionarse salvo decisión técnica
documentada.

## Ownership por superficie

| Superficie | Assets permitidos |
| --- | --- |
| Client público | Branding tenant + client content + product UI neutral |
| Dashboard core | Product UI neutral + branding resuelto por tenant config |
| Worker core | Product UI neutral + branding resuelto por tenant config |
| Email | Email assets registrados + estructura HTML shared |
| Prototype/docs | Evidencia claramente separada del runtime |

## Regla de fuente única

Un asset aprobado tiene:

- un identificador estable;
- un archivo/source master;
- cero o más derivados generados;
- propietarios y consumidores conocidos.

No copiar manualmente un source master a `apps/*/public`. El build o resolver consume la
fuente/URL canónica.

## Branding mínimo de un tenant

No todos los slots son obligatorios hasta que Product Design los apruebe. El conjunto base
propuesto es:

| Slot | Uso | Obligación propuesta |
| --- | --- | --- |
| `brand.wordmark.light` | Header sobre superficie clara | Requerido |
| `brand.wordmark.dark` | Header sobre superficie oscura | Requerido si existe dark theme |
| `brand.symbol` | Espacios compactos | Requerido para core responsive |
| `brand.favicon.master` | Derivados favicon | Requerido |
| `brand.email.logo` | Header de correo | Requerido si hay emails activos |
| `brand.social.default` | Open Graph client | Client-specific, según SEO |
| `brand.pwa.icon` | App icons | Sólo si PWA se aprueba |

No reutilizar automáticamente el logo web dentro de email; sus requisitos de formato,
peso y contraste son distintos.

## Formatos

### Logos web

- Preferir SVG cuando el origen y la seguridad lo permitan.
- Mantener PNG/WebP sólo cuando exista razón de compatibilidad o raster source.
- Conservar viewBox/padding consistente.
- Evitar texto convertido en una imagen si debe localizarse.

### Fotografías

- Conservar source original fuera del bundle productivo cuando sea necesario.
- Publicar derivados dimensionados y optimizados.
- Registrar derechos/licencia y focal point.
- No usar fotografías decorativas en dashboard/worker sin necesidad de producto.

### Iconos UI

- Preferir el sistema de iconos elegido por el producto.
- No añadir SVG casi idénticos por cada feature.
- Estado nunca comunicado sólo mediante icono/color.

### Email

- HTTPS público estable.
- PNG transparente como baseline conservadora para logos.
- Alt text obligatorio.
- Peso reducido y dimensiones conocidas.
- No depender de SVG, WebP o dark-mode media queries para información esencial.

## Accesibilidad

Cada entrada debe indicar:

- `altText` localizado o regla para generarlo;
- `decorative=true` cuando corresponda;
- contraste/variant;
- si contiene texto;
- comportamiento cuando no carga.

Logos usan el nombre de la empresa como alt text. Imágenes decorativas usan alt vacío.

## Pipeline objetivo

1. Product Design define propósito y variante.
2. Se registra el asset como `PROPOSED`.
3. Se valida origen/licencia/formato.
4. Se aprueba el source master.
5. El pipeline genera derivados necesarios.
6. Tests verifican dimensiones/peso/nombres.
7. Consumidores usan ID/config, no rutas hardcoded dispersas.
8. Retiro cambia estado y elimina consumidores antes del binario.

## Migración de la baseline

### Wave 1 — Inventario

- completar el registro inicial;
- localizar imports/referencias;
- agrupar hashes duplicados;
- identificar assets no usados;
- separar outputs generados.

### Wave 2 — Branding

- sacar logos Havenova de la categoría `shared product`;
- definir tenant branding schema;
- resolver logos de dashboard/worker por tenant;
- definir source y variantes de email.

### Wave 3 — Shared UI

- decidir alert illustrations, avatares y background;
- reemplazar copias por una fuente;
- retirar presets sin necesidad aprobada.

### Wave 4 — Client content/PWA

- inventariar fotografías/screenshots;
- cerrar decisión PWA;
- regenerar favicons/app icons sólo desde masters aprobados;
- retirar service workers/screenshots obsoletos.

## Gate

Ningún PR añade assets sin actualizar `ASSET_REGISTRY.md` y pasar los gates definidos en
`QUALITY_GATES.md`.
