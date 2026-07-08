# People Users Page Requirements

## Objetivo

Aterrizar los requisitos tecnicos y funcionales de `/people/users` como primera pagina real del patron de directorio del dashboard.

## Requisitos Funcionales

La pagina debe permitir:

- ver el listado de usuarios del tenant
- buscar por identidad util
- filtrar por estado principal
- seleccionar un usuario sin navegar a otra pagina operativa
- ver el detalle del usuario seleccionado
- iniciar el flujo de invitacion desde el header

No debe requerir:

- navegar a `/people/users/[userClientId]` para trabajar el detalle
- recargar toda la pagina para cambiar de seleccion

## Requisitos Del Header

Debe incluir:

- titulo del dominio
- descripcion corta
- CTA principal `Invitar usuario`

Puede admitir un segundo CTA mas adelante si aparece una necesidad real.
No debe empezar con multiples acciones de baja relevancia.

## Requisitos Del Overview

Debe mostrar maximo 3 indicadores.

Candidatos esperados:

- total de usuarios
- invitados pendientes
- usuarios activos

El contrato backend ideal debe enviar estos agregados ya preparados.
`page`, `limit` y similares no cuentan como overview final.

## Requisitos De Filtros

Base obligatoria:

- search
- status

La prioridad del buscador debe ser:

- nombre
- email
- telefono si existe

El select primario debe responder al estado operativo mas util para el admin.

## Requisitos De La Lista

Cada item debe comunicar:

- identidad principal
- email
- estado
- una senal temporal o de completitud

Cada item debe tener una unica accion primaria:

- seleccionar

La lista no debe intentar resolver:

- acciones destructivas inline
- formularios inline
- informacion de detalle completa

## Requisitos Del Panel Derecho

### Modo `empty`

Debe:

- explicar para que sirve el panel
- orientar hacia seleccionar o invitar

### Modo `detail`

Debe:

- mostrar identidad principal
- mostrar estado
- mostrar metadata esencial
- mostrar complemento `profile` sin asumir que siempre existe

### Modo `invite`

Debe:

- mantener la misma estructura base del panel
- alojar el formulario de invitacion
- permitir volver al estado anterior sin perder el contexto de la lista

## Requisitos De Datos

### List endpoint

Debe cubrir:

- items de directorio
- overview
- filtros compatibles
- paginacion si sigue siendo necesaria

### Detail endpoint

Debe cubrir:

- `auth`
- `userClient`
- `profile` opcional
- metadata de estado

### Invite endpoint

Debe existir como flujo propio del dominio.
El frontend no debe improvisar el payload final sin documentarlo.

## Requisitos Arquitectonicos

La carpeta de la pagina debe concentrar:

- docs
- copy
- tipos locales
- controlador local
- componentes propios de la ruta

Solo deben vivir fuera:

- primitives realmente shared
- servicios compartidos
- tipos canonicos del backend/frontend

## Requisitos De Estado

El estado minimo de la pagina debe cubrir:

- `mode`
- `selectedUserClientId`
- `search`
- `status`
- `list loading/error`
- `detail loading/error`

`mode` debe ser explicito.
No debe inferirse de forma fragil solo por presencia o ausencia de `detail`.

## Requisitos De URL

Se recomienda soportar:

- `selected`
- `mode`
- `search`
- `status`

La URL debe poder restaurar el contexto principal tras reload.

## Requisitos De Accesibilidad

La pagina debe cumplir como minimo:

- un `h1`
- labels visibles en filtros
- seleccion visible y accesible en lista
- estados vacios con heading y descripcion
- errores comprensibles
- foco claro para teclado

## Requisitos Responsive

Desktop:

- dos columnas
- lista y panel visibles a la vez

Mobile:

- lista primero
- panel despues
- densidad reducida
- jerarquia intacta

## Criterios De Aprobacion

La pagina puede considerarse base reusable cuando:

1. el overview ya no dependa de metadata tecnica
2. el panel derecho soporte al menos `empty`, `detail` e `invite`
3. la seleccion viva dentro de la misma pagina
4. la capa visual no haga fetch
5. la carpeta local concentre la mayoria del codigo especifico
6. la misma estructura pueda repetirse en `admins`, `workers` y `managers`
