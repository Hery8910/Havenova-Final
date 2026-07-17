# Auditoría de compatibility island — SideNav

## Alcance y baseline

- Estado: `ACTIVE` — análisis y decisión; no autoriza migración.
- Fecha: `2026-07-17`.
- Baseline frontend: `a7c610df86ccb56a149e3888aa8daec3ba5eff19`.
- Product Design visual: `b9c5a6c27ca5824199faca41a96f01c7705a8caf`.

Esta auditoría analiza la primitive `SideNav` y sus dos consumidores runtime. No modifica rutas,
permisos, estilos ni markup de producción. El shell Dashboard ya está scoped a la foundation
operacional; SideNav permanece intencionalmente en legacy hasta cerrar su propia frontera.

## Inventario y mapa de consumidores

| Pieza                         | Ubicación                                                                | Owner observado        | Consumidor                          |
| ----------------------------- | ------------------------------------------------------------------------ | ---------------------- | ----------------------------------- |
| Primitive, estado y semántica | `packages/components/sideNav/SideNav.tsx`                                | `packages/components`  | Dashboard y Client Profile          |
| Estilos legacy                | `packages/components/sideNav/SideNav.module.css`                         | Mismo paquete          | Dashboard y Client Profile          |
| Export público                | `packages/components/{sideNav,index}.ts`                                 | Paquete                | Imports por subpath y barrel actual |
| Adapter Dashboard             | `apps/dashboard/app/[lang]/(app)/components/shell/DashboardShellNav.tsx` | Dashboard              | Desktop sidebar y drawer móvil      |
| Modelo Dashboard              | `apps/dashboard/app/[lang]/(app)/dashboardShell.ts`                      | Dashboard              | Rutas, copy, secciones e icon keys  |
| Adapter Client                | `packages/components/client/user/profile/profileNav/ProfileNav.tsx`      | Feature Profile Client | Carril `profile/*`                  |
| Modelo Client Profile         | `profileNav.helpers.tsx`, fallbacks y tipos vecinos                      | Feature Profile Client | Rutas, copy e iconos de perfil      |

No existen consumidores Worker, Dashboard Auth, Users, alertas, loading, ThemeToggler ni
LanguageSwitcher. `ProfileNav` se consume desde `apps/client/app/[lang]/(app)/profile/layout.tsx`;
esto prueba que mover la primitive al Dashboard rompería el límite entre apps.

## Dependencias actuales

### Directas y funcionales

- Next `Link` y `usePathname`: construye navegación y calcula activo `exact|prefix`.
- React state/effects: expansión de una sección, colapso controlado o no controlado y media query.
- `react-icons`: chevrons y logout; los iconos de dominio llegan como `JSX.Element` desde cada
  adapter.
- Dashboard: `useAuth().logout`, `useLang`, `getDashboardNavSections` y prefijo `/${lang}`.
- Client Profile: auth, i18n, locale y sus propios items/footer.
- Workspace Dashboard: estado `isNavCollapsed`, drawer, cierre al navegar, scroll lock y retorno de
  foco pertenecen a `DashboardWorkspaceShell`, no a SideNav.

No hay acceso directo a tenant configuration, capacidades, permisos o backend. La visibilidad de
rutas es estática en los modelos observados; la autorización real sigue siendo server/backend y no
debe inferirse desde SideNav.

### Legacy y estilos

`SideNav.tsx` usa `button`, `button--ghost`, `button--active`, `card` y `card--secondary`.
Su CSS Module depende de tokens legacy de radio, texto, superficies, bordes, sombra y de la familia
`--button-*`; también usa `color-mix`, backdrop blur y la regla global de foco del botón. No carga
CSS directamente: depende de que cada app cargue `legacy.css`.

El componente no consume `--op-*`; añadirlos ahora acoplaría Client Profile a la foundation
operacional y violaría el scope de la migración de shell.

## Responsabilidades y problemas de ownership

| Responsabilidad                                                 | Estado observado                                  | Owner decidido                                               |
| --------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------ |
| Lista/nav/links, sección expandible, activo, icon-only y logout | Primitive genérica actual                         | `packages/components/sideNav` mientras haya dos consumidores |
| Rutas, jerarquía, labels, iconos y match                        | Inyectados por adapters                           | Cada feature/app consumidora                                 |
| Locale                                                          | Dashboard y Profile resuelven antes de renderizar | Cada adapter, no primitive                                   |
| Drawer, overlay, scroll lock y foco de retorno                  | Dashboard workspace                               | `DashboardWorkspaceShell`                                    |
| Autorización, tenant y capabilities                             | Ausente de primitive                              | Layout/server/backend y futuro modelo Dashboard aprobado     |
| Estilos visuales de Dashboard                                   | Legacy compartido                                 | Compatibility bridge; futura variante Dashboard app-owned    |

La primitive mezcla hoy tres significados visuales que no son equivalentes: enlace de ruta
seleccionado, control de expansión y control persistente de colapso. También contiene el media
query de colapso aunque Dashboard controla el estado y presenta un drawer independiente. Son
deudas a descomponer, no autorización para convertir el componente entero en shell compartido.

## Contratos que una migración debe preservar

- Desktop y drawer consumen el mismo modelo Dashboard, con los mismos href localizados y estado
  activo; el drawer sólo cambia `presentation`, elimina el control de colapso y llama
  `onItemSelect` para cerrarse.
- `aria-current="page"` marca sólo la ruta activa; enlaces icon-only conservan `aria-label` y
  `title` con el label localizado.
- Secciones usan botón, `aria-expanded` y `aria-controls`; rutas usan enlaces; logout es botón.
- El nav tiene nombre accesible, las secciones nombran sus listas y todos los iconos son decorativos.
- La sección activa se abre al cargar/cambiar pathname; el estado de expansión conserva una sección
  existente cuando cambian los datos. En la implementación actual, intentar cerrar la sección que
  contiene la ruta activa la reabre durante la sincronización; es un contrato observado que una
  futura migración debe decidir explícitamente, no alterar de forma incidental.
- Colapso controlado, breakpoint, navegación por teclado, foco visible, texto largo y ambos temas
  requieren pruebas de comportamiento y revisión visual humana antes de sustituir legacy.

La caracterización en `tests/jest/components/sidenav.test.jsx` cubre el activo y los nombres
accesibles en modo icon-only, los controles nativos de sección (`type="button"`, `aria-expanded` y
`aria-controls`), el colapso controlado y no controlado, la delegación de `onItemSelect`, los
listeners de `matchMedia` y su cleanup, además de la ausencia segura de esa API. También preserva
los modelos localizados de Dashboard y ProfileNav y verifica que la isla compartida no adopte tokens
`--op-*`. Los guards estructurales siguen siendo complementarios, no sustitutos de estas pruebas.

## Accesibilidad y riesgos

La semántica base es adecuada (nav, links, botones, `aria-current`, labels). Riesgos pendientes:

1. El foco visible depende del botón legacy y no está probado para enlaces ni dark theme.
2. El `title` de icon-only no sustituye una revisión de nombre accesible, orden de tabulación o
   etiquetas largas en alemán.
3. El drawer no transfiere foco al interior; esta responsabilidad es del workspace y debe evaluarse
   junto con la primitive, sin cambiar Users.
4. El efecto interno `matchMedia` puede competir con el estado controlado del Dashboard en el umbral
   responsive; debe cubrirse antes de cambiarlo.
5. Cambiar los tokens/classes compartidos puede afectar Client Profile aunque sólo se pruebe
   Dashboard.
6. La expansión de una sección activa no puede permanecer cerrada con el efecto actual; queda
   caracterizada, pero no evaluada todavía como decisión de UX.
7. Jest puede probar la semántica nativa de botón y la delegación de callbacks, pero la activación
   real con teclado, foco visible de enlaces y transferencia de foco dentro del drawer requieren la
   revisión manual/browser indicada antes de una migración visual.

## Decisión arquitectónica y frontera propuesta

`packages/components/sideNav` conserva temporalmente **markup estructural y contratos de
accesibilidad neutrales**, no un shell ni un modelo de producto. Dashboard es owner exclusivo de
`DashboardShellNav`, `dashboardShell.ts`, sus rutas, copy, iconos, estado de drawer y composición
responsive. Client Profile conserva su adapter y modelo. No se crea un layout global, ni se mueve
la primitive a Dashboard, ni se crea una variante operacional dentro de `packages`.

La futura migración es una frontera Dashboard-local: crear una composición/estilos de navegación
operacional en `apps/dashboard` que reciba el modelo ya resuelto. Antes, debe decidirse si la
primitive puede reducirse a semántica sin estilos legacy o si Dashboard necesita markup propio.
Client Profile permanece en legacy y no debe recibir estilos operacionales.

## Secuencia, aceptación y diferidos

1. Añadir pruebas de comportamiento para activo, expansión, colapso controlado, drawer e
   icon-only en ambos consumidores.
2. Auditar por separado el comportamiento de foco del drawer Dashboard.
3. Definir el mínimo adapter/markup Dashboard-local y validar visualmente desktop, tablet, móvil,
   `de/en/es` y ambos temas.
4. Migrar sólo Dashboard; conservar SideNav legacy para Client Profile.
5. Revisar extracción posterior únicamente si un segundo consumidor operacional valida el mismo
   contrato.

Criterio de aceptación: sin cambio de rutas, permisos, modelo ni Client Profile; navegación y
logout conservan semántica; no hay `--op-*` fuera del boundary Dashboard; la caracterización de la
primitive y los dos modelos consumidores está verde, y la revisión manual documenta foco,
responsive y locales antes de cualquier migración.

Diferido explícitamente: migración CSS/markup, SideNav de Client Profile, Worker, Auth, Users,
ThemeToggler, LanguageSwitcher, alertas, loading, permisos/capabilities y limpieza de legacy.
