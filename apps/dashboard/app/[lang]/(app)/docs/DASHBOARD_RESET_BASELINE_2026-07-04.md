# Dashboard Reset Baseline 2026-07-04

## Objetivo

Dejar constancia del reinicio estructural del `dashboard` antes de empezar la nueva pasada sobre:

- navegacion
- header
- definicion de MVP
- implementacion real de paginas

## Decision Principal

El `dashboard` se reinicia como una app cerrada sobre:

- `auth + admin`

Queda explicitamente fuera de esta app:

- cualquier superficie propia de `profile`
- cualquier complemento `worker`
- cualquier superficie dedicada a `super_admin`

`super_admin` puede seguir existiendo como rol permitido a nivel de acceso si el backend lo emite, pero no se define una arquitectura de paginas separada para ese actor dentro de esta app.

## Lo Que Se Hizo

### 1. Arquitectura documentada

Se definio la arquitectura completa del producto en:

- [DASHBOARD_INFORMATION_ARCHITECTURE.md](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/docs/DASHBOARD_INFORMATION_ARCHITECTURE.md:1)

Con esa base quedaron definidos:

- dominios funcionales
- separacion `workspace / company / account`
- arbol final de rutas
- relacion entre estructura actual y estructura deseada

### 2. Arbol de paginas reiniciado

Se eliminaron las paginas heredadas de la estructura anterior:

- `objects`
- `property-manager`
- `employees`
- `global-task-catalog`
- `support`
- `profile/*`

Y se reemplazaron por una base nueva de rutas vacias pero navegables:

- `/`
- `/requests/*`
- `/properties/*`
- `/clients/*`
- `/team/*`
- `/network/*`
- `/catalog/*`
- `/messages/*`
- `/notifications`
- `/activity`
- `/company/*`
- `/account/*`

### 3. Placeholder comun

Se creo un scaffold uniforme para las rutas nuevas:

- [DashboardRoutePlaceholder.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/components/placeholders/DashboardRoutePlaceholder.tsx:1)

Esto permite:

- tener rutas funcionales desde ya
- mantener consistencia visual
- evitar duplicacion de markup mientras las paginas siguen en blanco

### 4. Cuenta admin alineada

La app ya no apunta a `profile/*` como destino de cuenta admin.

Se alinearon:

- `layout.tsx`
- `DashboardShellHeader.tsx`
- `adminSessionRoutes`

con el dominio:

- `/account/*`

### 5. BFFs heredados eliminados

Se eliminaron de `apps/dashboard/app/api/home-services` las rutas heredadas de:

- `profile`
- `worker`

La base del dashboard queda cerrada sobre:

- `admin`

### 6. Shell del dashboard redefinido

La app ya no reutiliza componentes pensados para otra semantica (`ProfileNav`) ni un header basado en la taxonomia vieja.

La base actual del shell se define en:

- [dashboardShell.ts](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/dashboardShell.ts:1)

Y se consume desde:

- [DashboardShellNav.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/components/shell/DashboardShellNav.tsx:1)
- [DashboardShellHeader.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/components/shell/DashboardShellHeader.tsx:1)

Con esto queda fijado:

- el arbol real del nav
- la separacion entre grupos principales y secundarios
- la resolucion de titulos del header desde rutas reales
- la base para seguir implementando paginas bloque a bloque

### 7. Barrel del dashboard reducido

Se limpio el barrel de `packages/components/dashboard/index.ts` para dejar de exponer por defecto superficies heredadas del dashboard viejo:

- `pages`
- `propertyManagers`
- `objects`
- `workers`
- `contactMessages`

### 8. Componentes legacy eliminados

Se eliminaron las superficies heredadas del dashboard viejo que ya no representaban la arquitectura actual:

- `dashboardHeader`
- `contactMessages`
- `createWorkerForm`
- `objects`
- `propertyManagers`
- `workers`
- `pages/*`
- `sidebar`

## Deuda Eliminada

La deuda que se considero cerrada en esta pasada es:

- mezcla entre `profile` y `admin` dentro de la app
- mezcla entre `worker` y `admin` dentro del dashboard
- coexistencia de rutas nuevas y rutas heredadas en `(app)`
- BFFs de complementos ajenos al dashboard
- barrel principal del dashboard exponiendo superficies viejas como si siguieran vigentes
- reutilizacion de `ProfileNav` como nav transitorio del dashboard
- header resolviendo titulos desde labels heredados
- componentes legacy del dashboard viejo permaneciendo como referencia activa del producto

## Deuda Residual Aceptada

Todavia pueden quedar textos heredados en i18n y piezas genericas del dashboard antiguo que no participan en el shell nuevo, pero ya no definen la estructura activa de la app.

No se profundizo mas en esta pasada porque primero convenia:

1. fijar la nueva arquitectura
2. fijar el nuevo arbol de rutas
3. fijar el shell definitivo
4. asegurar que el shell y las rutas nuevas compilan

## Estado Resultante

Al cerrar esta pasada:

- el dashboard tiene una arquitectura de producto documentada
- el arbol de paginas ya responde a esa arquitectura
- las rutas nuevas existen y renderizan correctamente
- el dominio de cuenta admin ya usa `account/*`
- el nav ya representa la estructura nueva con paginas secundarias
- el header ya responde a rutas reales del producto
- la app deja de mezclar los complementos equivocados

## Siguiente Paso

La siguiente iteracion debe centrarse en:

1. definir el `MVP scope`
2. comenzar la implementacion real de las primeras paginas por dominio
3. documentar cada pagina y su contrato con backend
4. decidir que acciones finales viviran en el header
5. iterar sobre responsive y estados reales de navegacion
