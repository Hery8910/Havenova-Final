# Dashboard Information Architecture

## Objetivo

Definir la forma completa del producto `dashboard` antes de decidir:

- que entra en el MVP
- como se nombra la navegacion
- como se organiza el header
- como se estructura el arbol de carpetas y rutas

Este documento no intenta optimizar por alcance corto.
Su funcion es definir el producto final esperado para que el MVP sea un recorte coherente y no una suma de paginas aisladas.

## Reglas Base Del Producto

### 1. Actor principal del dashboard

El `dashboard` pertenece al actor operativo interno del cliente:

- `admin`

No pertenece a:

- `profile`
- `worker`
- `guest`

La separacion correcta del sistema sigue siendo:

- `client` = `auth + profile`
- `dashboard` = `auth + admin`
- `worker` = `auth + worker`

### 2. Separacion de dominios

El dashboard no debe mezclar en una misma capa:

- operacion del negocio
- configuracion de la empresa
- configuracion de la cuenta del admin

La regla final debe ser:

- `workspace`: operar el negocio
- `company`: configurar la empresa/tenant
- `account`: configurar la cuenta del admin autenticado

### 3. Navegacion

La navegacion principal debe mostrar dominios de trabajo, no formularios sueltos ni nombres tecnicos.

Evitar como top-level:

- nombres de CRUD
- nombres demasiado largos
- etiquetas ambiguas como `Objects`
- etiquetas internas como `Global Task Catalog`

La navegacion principal debe usar sustantivos cortos y estables.

## Vision Del Producto Final

El producto final del dashboard puede organizarse en 5 grandes bloques.

### A. Workspace

Superficies operativas que el admin usa cada dia.

Incluye:

- resumen ejecutivo del tenant
- solicitudes entrantes
- estado operativo
- vistas de trabajo pendientes
- accesos rapidos a incidencias, mensajes y actividad reciente

Rutas propuestas:

- `/`
- `/requests`
- `/requests/board`
- `/requests/calendar`
- `/requests/[requestId]`

### B. Portfolio / Operacion sobre propiedades

Dominio centrado en la estructura fisica o gestionada por el cliente.

Incluye:

- propiedades
- unidades o espacios si el producto los necesita mas adelante
- responsables asignados
- relacion con solicitudes y mantenimiento

Rutas propuestas:

- `/properties`
- `/properties/[propertyId]`
- `/properties/[propertyId]/requests`
- `/properties/[propertyId]/documents`

Nota:

- la ruta actual `objects` deberia migrar semanticamente a `properties`
- `property-manager` no deberia vivir como pagina principal aislada; debe quedar como parte del dominio de relaciones o asignaciones

### C. Relacion con personas

Dominio para gestionar actores relacionados con el tenant.

Debe separar claramente las ramas de la familia `auth + userClient + complemento`:

- usuarios del tenant
- admins internos
- workers
- managers

Rutas propuestas:

- `/people/users`
- `/people/users/[userClientId]`
- `/team/admins`
- `/team/admins/[adminId]`
- `/team/workers`
- `/team/workers/[workerId]`
- `/network/managers`
- `/network/managers/[managerId]`

Decision importante:

- `people` pasa a ser la familia reusable del dashboard para `user/admin/worker/manager`
- `team` y `network` siguen existiendo como ramas de navegacion, no como definicion del patron compartido
- `property-manager` solo debe compartir esta base si realmente entra en `auth + userClient + complemento`

### D. Catálogos y configuracion operativa

Dominio para definir reglas y recursos reutilizables del negocio.

Incluye:

- catalogo de servicios
- catalogo de tareas
- plantillas operativas
- automatizaciones futuras

Rutas propuestas:

- `/catalog/services`
- `/catalog/tasks`
- `/catalog/templates`
- `/catalog/automations`

Nota:

- la pagina actual `global-task-catalog` deberia pasar a un dominio `catalog`
- el nav no deberia mostrar `global task catalog` como etiqueta principal

### E. Comunicacion y seguimiento

Dominio para conversaciones, avisos y seguimiento de actividad.

Incluye:

- mensajes de contacto
- hilos
- centro de notificaciones
- actividad y alertas

Rutas propuestas:

- `/messages`
- `/messages/[threadId]`
- `/notifications`
- `/activity`

## Dominios No Operativos Pero Necesarios

### Empresa

Este bloque no pertenece al trabajo diario sobre solicitudes.
Pertenece a la configuracion del tenant o cliente.

Debe incluir:

- datos generales de la empresa
- branding
- datos fiscales/legales
- canales de contacto
- configuracion operativa
- integraciones
- billing futuro
- usuarios y permisos a nivel organizacion

Rutas propuestas:

- `/company`
- `/company/general`
- `/company/branding`
- `/company/contact`
- `/company/legal`
- `/company/operations`
- `/company/integrations`
- `/company/billing`
- `/company/security`

### Cuenta del admin

Este bloque pertenece al usuario autenticado, no al tenant como entidad.

Debe incluir:

- perfil personal
- avatar
- idioma
- tema
- preferencias personales
- seguridad de cuenta
- actividad de sesiones si se necesita

Rutas propuestas:

- `/account`
- `/account/profile`
- `/account/preferences`
- `/account/security`
- `/account/notifications`

Decision importante:

- el arbol actual `/profile/*` mezcla cuenta personal con configuracion operativa del dashboard
- para el producto final conviene mover el dominio personal a `/account/*`
- `profile` puede mantenerse como alias transitorio durante la migracion, pero no deberia ser la forma final

## Navegacion Principal Propuesta

La navegacion principal final deberia construirse alrededor de dominios cortos:

- `Resumen`
- `Solicitudes`
- `Propiedades`
- `Clientes`
- `Equipo`
- `Catalogo`
- `Mensajes`
- `Actividad`

La navegacion secundaria o de configuracion deberia separar:

- `Empresa`
- `Cuenta`

`Notificaciones` puede vivir en header o dentro de `Cuenta`, segun el peso real del centro de notificaciones.

## Header Final Esperado

El header no debe ser solo un titulo de pagina.
Debe responder a la arquitectura del producto.

## Patron Estructural De Paginas

Exceptuando superficies claramente resumen como `/`, la regla estructural del dashboard debe ser:

- `nav` global a la izquierda
- `header` global en la parte superior
- `children` de la ruta dentro del area principal

Dentro de ese `children`, la mayoria de dominios deben seguir un patron `master-detail`:

- bloque izquierdo: listas, filtros y acciones de descubrimiento
- bloque derecho: detalle estable del elemento seleccionado por ruta

Ejemplos:

- `/people/users` muestra la lista y un estado vacio o cargado en detalle dentro de la misma pagina
- `/people/users/[userClientId]` puede mantenerse como deep link que hidrata la misma superficie, no como pagina operativa separada
- el mismo patron debe aplicarse despues a `requests`, `properties`, `team`, `network` y otros dominios equivalentes

Decision importante:

- este patron debe resolverse con layouts y componentes reutilizables, dejando a cada `page.tsx` la orquestacion de textos, llamadas y props

Deberia integrar:

- titulo o breadcrumb del dominio actual
- cambio de tema
- cambio de idioma
- acceso rapido a notificaciones
- acceso a cuenta
- acciones contextuales por pagina cuando corresponda

No deberia mezclar:

- controles globales de cuenta
- navegacion estructural pesada
- formularios propios de pagina

## Estructura De Carpetas Propuesta

La estructura fisica deberia responder a dominios, no al orden accidental actual.

Propuesta:

```text
app/[lang]/(app)/
  docs/
  page.tsx
  requests/
    page.tsx
    board/page.tsx
    calendar/page.tsx
    [requestId]/page.tsx
  properties/
    page.tsx
    [propertyId]/page.tsx
    [propertyId]/requests/page.tsx
    [propertyId]/documents/page.tsx
  clients/
    page.tsx
    [clientId]/page.tsx
  team/
    admins/page.tsx
    admins/[adminId]/page.tsx
    workers/page.tsx
    workers/[workerId]/page.tsx
  network/
    managers/page.tsx
    managers/[managerId]/page.tsx
  catalog/
    services/page.tsx
    tasks/page.tsx
    templates/page.tsx
    automations/page.tsx
  messages/
    page.tsx
    [threadId]/page.tsx
  notifications/
    page.tsx
  activity/
    page.tsx
  company/
    page.tsx
    general/page.tsx
    branding/page.tsx
    contact/page.tsx
    legal/page.tsx
    operations/page.tsx
    integrations/page.tsx
    billing/page.tsx
    security/page.tsx
  account/
    page.tsx
    profile/page.tsx
    preferences/page.tsx
    security/page.tsx
    notifications/page.tsx
```

## Mapeo Entre Estado Actual Y Estado Deseado

Estado actual:

- `objects`
- `property-manager`
- `employees`
- `global-task-catalog`
- `profile/*`
- `support`

Estado deseado:

- `objects` -> `properties`
- `property-manager` -> `network/managers` o `team/managers`
- `employees` -> `team/workers` o `team/admins`, segun el actor real
- `global-task-catalog` -> `catalog/tasks`
- `profile/*` -> `account/*`
- `support` -> evaluar si debe ser `activity`, `company/contact` o una herramienta interna no visible en nav principal

## Reglas Para La Fase Siguiente

Cuando pasemos a definir MVP y navegacion:

1. no decidir el MVP por las paginas ya existentes
2. primero confirmar a que dominio pertenece cada pagina
3. despues definir si es top-level, secundaria o interna
4. separar explicitamente `empresa` de `cuenta`
5. no volver a mezclar `admin` con `worker` ni `profile`

## Resultado Esperado

Si esta arquitectura se respeta:

- el nav sera mas corto y mas claro
- el header podra responder al dominio activo
- la separacion `workspace / company / account` quedara limpia
- el arbol de carpetas sera escalable
- el MVP podra salir como un recorte ordenado del producto final

## Siguiente Documento Recomendado

Despues de este documento, la siguiente pieza deberia ser:

- `DASHBOARD_MVP_SCOPE.md`

Ese documento ya deberia decidir:

- que paginas entran en la primera pasada
- que labels usara el nav
- que rutas se crean ahora
- que rutas quedan documentadas pero fuera de implementacion inmediata
