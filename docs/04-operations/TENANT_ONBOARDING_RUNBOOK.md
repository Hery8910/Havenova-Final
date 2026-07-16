# Runbook de incorporación de un tenant

## Propósito

Documentar qué necesita una empresa nueva para utilizar el producto operativo compartido
y publicar su client. Este runbook será la prueba de que la base puede reutilizarse sin
rediseñar dashboard y worker.

## Modelo

```text
Core Product + Tenant Configuration + Specific Extensions
```

Una incorporación no empieza copiando Havenova. Empieza verificando producto, contrato,
configuración e identidad del nuevo tenant.

## Criterio de entrada

- Product Design identifica el tenant y el alcance inicial.
- Los dominios habilitados tienen readiness conocido.
- Backend puede crear/configurar el tenant.
- No se requieren branches de marca dentro del core.

## 1. Identidad operativa

- tenant legal name;
- tenant display name;
- tenant key emitido por backend;
- país/región operativa;
- locale por defecto y locales habilitados;
- zona horaria;
- moneda/unidades cuando el producto las requiera;
- contacto operativo y soporte;
- URLs legales.

## 2. Alcance de producto

Registrar por dominio:

- Product Design revision;
- status/readiness;
- capacidades habilitadas;
- capacidades diferidas;
- roles autorizados;
- dependencias backend/frontend;
- criterios de validación.

No activar navegación para dominios que sólo existan como placeholders.

## 3. Backend

- tenant provisionado;
- roles/memberships iniciales;
- admin bootstrap seguro;
- aislamiento tenant verificado;
- endpoints/codes versionados;
- CSRF/cookies/domains configurados;
- email sender y templates habilitados;
- observabilidad y request IDs;
- datos demo separados de producción;
- backup/rollback aplicable.

## 4. Dominios y entornos

Por `development`, `preview` y `production`:

- client domain;
- dashboard domain;
- worker domain;
- backend URL;
- tenant key;
- allowed hosts;
- CORS/cookie domains cuando backend lo requiera;
- deployment project;
- owner y rollback.

No guardar secretos en este documento.

## 5. Branding

Entradas mínimas propuestas:

- wordmark light;
- wordmark dark si aplica;
- symbol/compact mark;
- favicon master;
- email logo;
- primary/secondary semantic colors;
- accessible company name;
- soporte y website URLs.

Cada asset debe existir en `ASSET_REGISTRY.md` antes de consumo productivo.

## 6. Client público

Definir de forma tenant-specific:

- objetivo de la web;
- páginas necesarias;
- contenido y locales;
- formulario(s) y destino;
- fotografías/ilustraciones;
- SEO, Open Graph, sitemap y robots;
- analytics/consent aprobados;
- legal/imprint/privacy;
- PWA sólo si Product Design la aprueba.

Para Perfect Service, la hipótesis actual es una web presentacional con formulario de
contacto. No heredar automáticamente el portal o los service request forms de Havenova.

## 7. Dashboard

Debe desplegarse desde el core sin cambios fuente tenant-specific.

Validar:

- branding/config resueltos;
- admin login/session;
- roles y permisos;
- dominios habilitados;
- rutas diferidas no expuestas como funcionales;
- locale/theme;
- tenant isolation;
- error/empty/loading;
- responsive y accesibilidad.

## 8. Worker

Debe desplegarse desde el core sin cambios fuente tenant-specific.

Validar sólo capacidades aprobadas:

- worker invitation/session;
- perfil;
- roles/permissions;
- operaciones worker cuando estén implementation-ready;
- tenant isolation;
- locale/theme/branding.

## 9. Email

- dominio sender verificado;
- from/reply-to;
- support contact;
- tenant email logo URL;
- legal address/footer;
- locales activos;
- catálogo de emails aprobado;
- tokens/links apuntan a domains correctos;
- previews y delivery tests;
- bounce/suppression/observability.

Consultar `EMAIL_BRANDING_CONTRACT.md`.

## 10. Datos iniciales

- primer admin mediante flujo seguro;
- workers sólo si el dominio está activo;
- catálogos/config sólo si están aprobados;
- no migrar datos demo;
- no crear perfiles/clientes falsos para que la UI parezca completa.

## 11. Quality y release

- CI verde;
- builds client/dashboard/worker;
- dependency audit;
- smoke tests backend;
- accessibility/manual matrix;
- links/legal/content;
- asset validation;
- email delivery;
- observabilidad;
- rollback probado/documentado.

## 12. Evidencia de reutilización

Registrar:

- archivos de core modificados durante onboarding;
- nuevas tenant config entries;
- nuevos client-specific files;
- extensiones específicas aprobadas;
- tiempo y blockers.

Objetivo:

- cero cambios de marca en dashboard/worker core;
- cero copia de apps completas;
- client nuevo independiente;
- diferencias operativas expresadas como producto/config/extensión, no como ifs dispersos.

## Checklist Perfect Service

| Área | Estado inicial |
| --- | --- |
| Product scope | Pendiente |
| Tenant provision | Pendiente |
| Branding assets | Pendiente |
| Email sender/domain | Pendiente |
| Client presentation/content | Pendiente |
| Contact form contract | Pendiente |
| Dashboard reuse proof | Pendiente |
| Worker reuse proof | Pendiente |
| Release evidence | Pendiente |

No completar esta tabla hasta que Havenova haya validado la fase correspondiente del core.
