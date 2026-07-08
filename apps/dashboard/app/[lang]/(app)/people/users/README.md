# People Users Page

## Objetivo

Definir la primera pagina real del patron `directory + panel` dentro del dashboard.

Ruta principal:

- `/people/users`

Esta pagina es la referencia inicial para:

- `team/admins`
- `team/workers`
- `network/managers`

Debe servir como ejemplo de composicion, no como excepcion local.

## Documentos Relacionados

- [Dashboard Directory Page Standard](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/docs/DASHBOARD_DIRECTORY_PAGE_STANDARD.md:1)
- [Dashboard People Domain](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/docs/DASHBOARD_PEOPLE_DOMAIN.md:1)
- [Page Requirements](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/people/users/PAGE_REQUIREMENTS.md:1)

## Regla De Producto

La pagina representa la rama:

- `auth + userClient + optional profile`

No representa:

- `my profile`
- un perfil publico del cliente
- una pagina operativa separada por cada `userClientId`

El admin debe poder:

- descubrir usuarios
- filtrar usuarios
- seleccionar usuarios
- invitar usuarios
- revisar el estado de activacion y perfil

Todo eso dentro de la misma superficie.

## Patron Estructural Esperado

### Izquierda

- header del dominio
- overview con maximo 3 KPIs
- filtros simples
- lista seleccionable

### Derecha

Modos previstos:

- `empty`
- `detail`
- `invite`

Modo posible en una iteracion posterior:

- `activity`

## Contrato De Navegacion

La ruta principal sigue siendo:

- `/people/users`

El estado operativo puede vivir en search params:

- `selected=<userClientId>`
- `mode=detail|invite`
- `search=<term>`
- `status=<value>`

La ruta:

- `/people/users/[userClientId]`

no debe crecer como pagina operativa independiente.
Si se mantiene, solo debe redirigir o hidratar la misma superficie.

## Estado Actual

La implementacion actual ya valida varias decisiones correctas:

- la pagina orquesta lista y detalle
- la seleccion no obliga a navegar a otra pagina operativa
- existen primitives compartidos para intro, overview, filtros y lista
- el detalle es presentacional

Pero todavia hay desalineaciones con la arquitectura objetivo:

- `page.tsx` es un Client Component grande
- el overview muestra paginacion, no resumen operativo real
- el panel derecho no resuelve `invite`
- la carpeta de la pagina aun no concentra suficientes archivos propios

## Direccion De La Siguiente Iteracion

### 1. Reestructurar la pagina por capas

Objetivo:

- `page.tsx` server-first
- controlador cliente local
- vistas presentacionales por modo

### 2. Formalizar el modo del panel derecho

Objetivo:

- `empty`
- `detail`
- `invite`

sin condicionales dispersos por toda la pagina.

### 3. Sustituir overview tecnico por overview operativo

Objetivo:

- total users
- invited pending
- active users

o la terna que realmente cierre mejor con backend.

### 4. Preparar el patron reusable para otras ramas

Objetivo:

- extraer lo shared de verdad
- mantener local lo especifico de `users`

## Regla De Implementacion

Antes de tocar esta pagina:

1. revisar el estandar global
2. revisar este README
3. confirmar que el cambio mejora el patron reusable y no solo `users`
