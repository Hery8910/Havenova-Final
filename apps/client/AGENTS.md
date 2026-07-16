# Reglas para `apps/client`

## Responsabilidad

`apps/client` es la superficie tenant-specific para web pública y capacidades de cliente
aprobadas. No es la fuente de componentes del dashboard o worker.

## Antes de cambiar una ruta

- Confirmar su estado en la matriz de autoridad.
- Identificar si es marketing, adquisición, auth, portal o flujo transaccional.
- Verificar el contrato Product Design correspondiente.
- Verificar BFF y backend si envía o recupera datos.

## Reglas

- Mantener rutas server-first.
- No llamar al backend directamente desde el navegador.
- No importar desde `apps/dashboard` ni `apps/worker`.
- No exportar features client-specific como UI universal.
- Mantener branding, contenido, SEO y fotografías dentro de la responsabilidad del client.
- Registrar cada asset antes de añadirlo.
- No presentar PWA/install hasta que la app tenga un contrato PWA operativo aprobado.
- No convertir placeholders de perfil en dominios reales sin Product Design.
- Los formularios públicos no definen por sí solos el ciclo operativo posterior.

## Perfect Service

El client de Perfect Service podrá ser una web presentacional con formulario de contacto.
No debe requerir duplicar dashboard o worker ni arrastrar features de Havenova que Product
Design no haya clasificado como necesarias.
