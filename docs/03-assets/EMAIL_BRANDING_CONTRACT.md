# Contrato de branding para correos

## Propósito

Definir una base de correo reutilizable y tenant-aware para el MVP sin crear un header
diferente por template o acoplar frontend y backend mediante archivos locales.

## Ownership

| Área | Owner |
| --- | --- |
| Qué emails existen y cuándo se envían | Product Design |
| Trigger, destinatario, tokens y entrega | Backend/email service |
| Estructura visual y accesibilidad | Contrato compartido Product Design/frontend |
| Branding del tenant | Tenant configuration + asset registry |
| Render y envío productivo | Backend/email service |
| Preview opcional | Frontend/tooling |

## Principio

Todos los emails del producto comparten una estructura HTML base. El tenant aporta datos y
branding. No se crean banners rasterizados con título, traducción o CTA dentro de la
imagen.

## Header base

```text
preheader accesible
logo del tenant
nombre del producto/empresa cuando sea necesario
separador o superficie semántica
```

El título del email y su contexto viven como HTML real debajo del header.

## Asset requerido

ID lógico:

```text
tenant.<tenantKey>.email.logo
```

Baseline propuesta:

- PNG transparente;
- variante preparada para fondo claro;
- ancho visible aproximado máximo de 160 px;
- source de mayor densidad para pantallas HiDPI;
- peso objetivo inferior a 50 KB cuando sea razonable;
- URL HTTPS pública estable;
- alt text igual al nombre accesible del tenant;
- padding incluido sólo si forma parte deliberada del logo.

Dimensiones finales deben validarse con el diseño aprobado. La información esencial no
puede depender de dark mode, SVG o WebP.

## Tenant email config

Campos mínimos propuestos:

```ts
type TenantEmailBranding = {
  displayName: string;
  logoUrl: string;
  logoAlt: string;
  primaryColor: string;
  supportEmail: string;
  legalAddress: string;
  websiteUrl: string;
};
```

Este ejemplo define intención, no autoriza todavía un schema de backend. El contrato final
debe ser versionado por backend y no aceptar CSS arbitrario del tenant.

## Estructura del template

1. preheader;
2. header tenant;
3. heading y mensaje principal;
4. contexto/datos relevantes;
5. CTA HTML;
6. alternativa con URL visible cuando sea necesario;
7. ayuda/seguridad;
8. footer legal y de contacto.

## Accesibilidad y compatibilidad

- Tablas de layout cuando el proveedor/template engine lo requiera.
- CSS inline y subset compatible con clientes de correo.
- Texto real, no imágenes con copy.
- CTA con label descriptivo.
- Contraste suficiente aun sin imágenes.
- Alt text correcto.
- Layout legible a 320 px.
- No depender sólo de color.
- Locale y `lang` del documento correctos.

## Seguridad

- No incluir secretos o tokens en logs/previews.
- Links de token usan HTTPS y lifecycle backend.
- No revelar si una cuenta existe cuando el flow debe ser ambiguo.
- URLs de assets no incorporan tokens temporales con expiración corta.
- Dominios de links y sender se verifican antes de production.

## Catálogo MVP por verificar

La existencia de código no aprueba un email. Esta tabla debe converger con Product Design
y backend:

| Familia | Evidencia actual | Estado de autoridad |
| --- | --- | --- |
| Verificación de email | Auth público implementado | Verificar contrato |
| Recuperación de contraseña | Auth público/shared implementado | Verificar contrato |
| Assisted customer invitation | Código Users V2 implementado | Bloqueado por Product Design |
| Admin/worker invitation | Flows invitation-only observados | Verificar contrato |
| Confirmación de contacto | Formulario/BFF observados | `UNKNOWN` |
| Confirmación/estado de service request | Formularios observados | `UNKNOWN` |

No diseñar headers separados para cada fila. Se reutiliza la misma base y sólo cambia el
contenido aprobado.

## Preview y aprobación

Antes de activar una familia:

- fixture sin datos reales;
- render de `de`, `en`, `es` si aplica;
- desktop/mobile;
- imágenes bloqueadas;
- links y CTA;
- dark client como degradación, no como dependencia;
- verificación de sender/from/reply-to;
- backend contract revision registrada.

## Relación con assets

El logo se registra en `ASSET_REGISTRY.md`. Backend consume una URL estable o una
configuración resuelta; nunca una ruta local al frontend.
