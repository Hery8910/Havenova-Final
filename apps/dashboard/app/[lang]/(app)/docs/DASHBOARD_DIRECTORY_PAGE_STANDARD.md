# Dashboard Directory Page Standard

## Objetivo

Definir el patron tecnico, visual y arquitectonico para las paginas del dashboard que trabajan como:

- directorio a la izquierda
- panel estable a la derecha
- seleccion local sin navegar a una pagina operativa distinta

Este documento es la referencia que debe revisarse antes de crear o refactorizar paginas como:

- `/people/users`
- `/team/admins`
- `/team/workers`
- `/network/managers`
- `/requests`
- `/properties`

No es un documento exclusivo del dominio `people`.
Es el contrato base del patron reusable `directory + panel`.

## Principios Base

### 1. La pagina es el owner de la orquestacion

La ruta define:

- que datos se cargan
- que filtros existen
- que CTA viven en el header
- que modo se renderiza en el panel derecho
- que item esta seleccionado

La pagina no delega estas decisiones a componentes presentacionales.

### 2. Los componentes visuales no hacen fetch

Los componentes reutilizables o de dominio reciben todo por props.

Eso aplica a:

- header de pagina
- overview
- filtros
- lista
- item renderer
- panel derecho
- formularios de `create`
- formularios de `invite`
- estados vacios, loading y error

Si un componente necesita datos, la pagina o su controlador local debe resolverlos antes.

### 3. La navegacion operativa no depende de `/:id`

La seleccion principal ocurre dentro de la misma superficie.

Regla:

- el usuario selecciona un item en la lista
- la pagina actualiza el estado local y la URL si hace falta
- el panel derecho cambia sin recargar la pagina entera

Se permiten query params como:

- `selected`
- `mode`
- `status`
- `search`

Las rutas `/:id` solo pueden existir como deep links o redirecciones de compatibilidad.
No deben ser la forma principal de operar la pantalla.

### 4. El layout debe ser estable

La estructura general no cambia por dominio.

Solo cambian:

- copy
- payloads
- tipos
- item renderers
- paneles derechos
- CTAs

## Anatomia Obligatoria De La Pagina

## Bloque Izquierdo

Orden fijo:

1. `Page header`
2. `Overview`
3. `Filters`
4. `Directory list`

### 1. Page Header

Incluye:

- `h1` unico de la pagina
- descripcion corta
- grupo de CTA a la derecha

Reglas:

- el titulo describe el dominio, no una accion
- la descripcion explica el objetivo operativo de la pantalla
- el grupo de acciones debe soportar uno o varios CTA
- los CTA deben ser contextuales y estables

Ejemplos:

- `Invitar usuario`
- `Crear manager`
- `Nuevo request`

No mezclar aqui:

- filtros
- tabs secundarios
- acciones del item seleccionado

### 2. Overview

Muestra maximo 3 cards.

Cada card debe representar una señal operativa util.

Reglas:

- no mostrar contadores decorativos
- el backend debe enviar agregados pensados para la UI
- si no hay una terna clara de KPIs, mostrar menos cards

Ejemplos validos:

- total
- pendientes de activacion
- activos

Ejemplos debiles:

- page actual
- page size
- numero de items cargados localmente si no aporta valor operativo

### 3. Filters

Base minima:

- un buscador
- un select

Reglas:

- mantener la seccion simple
- evitar piling de selects
- no convertir la cabecera en un panel de filtros pesado
- cada filtro debe responder a una necesidad de decision real

Cuando un dominio necesite mas filtros:

- primero validar si realmente son parte del flujo primario
- si no lo son, moverlos a una capa secundaria posterior

### 4. Directory List

Debe ser una lista de seleccion clara y escaneable.

Cada item debe priorizar:

- identidad principal
- estado
- una o dos señales de apoyo

No debe intentar reemplazar el panel derecho.

Reglas:

- cada fila tiene una accion primaria de seleccion
- evitar meter demasiados botones por fila
- en movil la pieza debe seguir siendo legible con poca altura
- si hace falta mas contexto, ese contexto va en el panel derecho

## Bloque Derecho

El lado derecho no es solo "detalle".
Es un panel de modos.

Modos minimos esperados:

- `empty`
- `detail`
- `invite`
- `create`

Modos opcionales segun dominio:

- `edit`
- `activity`
- `danger`
- `success`

Regla principal:

- el bloque izquierdo decide que modo se muestra a la derecha

Ejemplos:

- CTA `Invitar usuario` -> `mode=invite`
- CTA `Crear manager` -> `mode=create`
- click en item -> `mode=detail`
- sin seleccion ni accion -> `mode=empty`

## Anatomia Recomendada Del Panel Derecho

Orden base:

1. `Panel header`
2. `Status / summary strip`
3. `Primary content`
4. `Secondary sections`
5. `Actions footer` si aplica

### 1. Panel Header

Incluye:

- eyebrow o label de contexto
- titulo del modo activo
- descripcion corta

### 2. Status / summary strip

Solo si aporta valor.

Ejemplos:

- badge de estado
- verificacion
- progreso de perfil
- tipo de actor

### 3. Primary content

Depende del modo:

- detalle
- formulario de invitacion
- formulario de creacion
- estado vacio guiado

### 4. Secondary sections

Reservado para:

- metadata
- actividad reciente
- informacion complementaria
- bloques de soporte

### 5. Actions footer

Solo cuando el modo lo necesite.

Ejemplos:

- guardar
- reenviar invitacion
- bloquear
- cancelar

## Arquitectura Tecnica

## Estructura De Carpeta Por Pagina

Cada pagina real debe agrupar su implementacion dentro de su carpeta de ruta.

Estructura objetivo:

```text
people/users/
  README.md
  PAGE_REQUIREMENTS.md
  page.tsx
  page.copy.ts
  page.types.ts
  page.controller.tsx
  components/
    UsersPageView.tsx
    UsersPageDetailRouter.tsx
    UsersInvitePanel.tsx
    UsersCreatePanel.tsx
    UsersEmptyPanel.tsx
    UsersDetailPanel.tsx
```

Notas:

- `page.tsx` es la entrada de ruta
- `page.controller.tsx` puede ser cliente si la seleccion/filtros necesitan estado interactivo
- `components/` dentro de la pagina contiene piezas exclusivas de esa ruta
- solo lo realmente reusable entre varias paginas debe vivir fuera

## Separacion De Responsabilidades

### Route entry

Responsabilidad:

- leer params y search params
- cargar datos iniciales
- componer el controlador o la vista raiz

### Local page controller

Responsabilidad:

- manejar seleccion
- manejar `mode`
- manejar filtros
- disparar recargas locales
- traducir eventos UI a acciones de pagina

### Presentational components

Responsabilidad:

- render puro por props
- semantica y accesibilidad
- cero fetch
- cero conocimiento del router salvo callbacks/links ya resueltos

## SSR Y CLIENT

Regla preferida:

- `page.tsx` como Server Component
- controlador local interactivo como Client Component
- componentes puramente visuales compatibles con SSR

La ruta no debe comenzar como un gran `use client` si eso obliga a mover toda la pantalla al browser.

Objetivo:

- obtener SSR para el primer render
- mantener la interaccion localizada
- evitar que el componente de pagina crezca sin control

## Contrato De Datos Con Backend

Cada pagina tipo directorio debe aspirar a un contrato que cubra:

### List endpoint

Debe devolver:

- `items`
- cursor o paginacion apropiada al dominio
- `filters` o metadata util si aplica

El overview puede venir en un endpoint `summary` independiente cuando deba ser
global y no variar con búsqueda, filtro o páginas cargadas. `people/users` usa
esta separación.

No deberia obligar al frontend a inventar los overview cards desde datos tecnicos de paginacion.

### Detail endpoint

Debe devolver:

- identidad principal
- estado
- complemento suficiente para la vista derecha
- metadata operativa de apoyo

### Action endpoints

Segun dominio:

- invite
- resend invite
- create
- update
- block
- archive

La UI no debe modelar acciones sin contrato backend real.

## URL State

El estado de la pagina debe poder reflejarse en search params cuando aporte valor.

Convenciones sugeridas:

- `selected=<id>`
- `mode=detail|invite|create`
- `search=<term>`
- `status=<value>`

Beneficios:

- restaurar contexto tras reload
- compartir enlaces utiles
- evitar rutas operativas `/:id`

## Semantica

Reglas minimas:

- un solo `h1` por pagina; si el shell ya lo provee, la superficie de directorio
  no crea otro
- el overview usa `section` y `article`
- los filtros usan labels visibles
- la lista usa estructura semantica de lista cuando represente una coleccion
- el panel derecho usa headings descendentes estables

Evitar:

- varios `h1`
- cards sin rol semantico claro
- inputs sin label visible
- estados vacios sin encabezado explicativo

## Accesibilidad

Checklist minimo:

- labels visibles para search y select
- `aria-live` para feedback de loading/error cuando sea necesario
- foco claro en items seleccionables
- contraste suficiente en badges y estados
- CTA con texto explicito, no solo iconos
- el item seleccionado debe exponer estado visible y accesible

Para la lista:

- si el item selecciona el panel derecho, el patron debe comunicar `selected`
- si la lista actua como selector, considerar `aria-current`, `aria-pressed` o `aria-selected` segun el markup final

Para el panel derecho:

- el estado vacio debe orientar la siguiente accion
- los errores deben explicar que no pudo cargarse y como continuar

## Responsive

Desktop:

- dos columnas estables
- el directorio conserva el contexto de descubrimiento
- el panel derecho conserva el contexto del item o accion actual

Mobile:

- la columna izquierda aparece primero
- el panel derecho puede caer debajo o convertirse en una vista distinguible,
  según el contrato de la página
- no duplicar informacion entre lista y panel
- la fila debe seguir siendo compacta y legible
- si lista y detail se separan, volver debe restaurar selección, scroll y foco

Regla:

- en movil se simplifica el layout, no el contrato de informacion

## Criterios De Reutilizacion

Mover a una capa shared solo cuando al menos dos paginas necesiten:

- la misma anatomia
- el mismo contrato de props
- el mismo comportamiento visual

No mover a shared:

- copy local
- tipos de dominio local
- modos que solo existan en una pagina
- validaciones particulares del dominio

## Criterios De Revision Antes De Crear Una Nueva Pagina

Antes de implementar una nueva ruta tipo directorio confirmar:

1. cual es el actor y dominio real
2. cual es el list endpoint
3. cual es el detail endpoint
4. cuales son los CTA del header
5. cuales son los modos del panel derecho
6. cuales son los 3 KPIs maximos del overview
7. cuales filtros merecen vivir en la capa primaria
8. que partes seran page-local y que partes seran shared
9. si la seleccion vive en query params
10. si existe una ruta `/:id`, confirmar que solo actua como deep link

## Estado Actual Del Repo Frente A Este Estandar

El repo ya implementa la base principal en `people/users`:

- `components/masterDetail/*`
- `components/directory/*`
- `page.tsx` server-first con controlador cliente local
- summary operativo remoto
- modos `empty`, `detail` e `invite`
- URL state por `entryId`

La deuda actual no está en la anatomía base, sino en el cierre de interacción:

- cache y restore semántico de listas largas
- navegación lista/detail en móvil
- feedback robusto de mutaciones
- i18n, accesibilidad y tests de interacción

El estado exacto de esa página vive en
`people/users/USERS_DIRECTORY_GAP_ANALYSIS.md`.
