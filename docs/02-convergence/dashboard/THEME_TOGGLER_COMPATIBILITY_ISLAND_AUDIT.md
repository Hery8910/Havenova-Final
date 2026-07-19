# Auditoría de compatibility island — ThemeToggler

## Alcance y estado

- Estado: Dashboard `READY` — Dashboard usa una composición operational local; Client y Worker conservan la isla legacy.
- Fecha: `2026-07-17`.
- Baseline de navegación Dashboard: `27f8d6e`.
- Alcance: estado de tema compartido, renderizado de `ThemeToggler` y sus consumidores runtime.

El control no equivale al sistema de tema: es una vista cliente que consume un complemento de
sesión. El bootstrap Dashboard aplica el tema antes de hidratar; los complements sincronizan el
documento después de hidratar; ThemeToggler no produce efectos externos.

## Inventario y consumidores runtime

| Pieza               | Ubicación                                                   | Finalidad y variante                                               | Riesgo al modificarla                                   |
| ------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------- |
| Control compartido  | `packages/components/themeToggler/ThemeToggler.tsx`         | Botón binario `icon` o `icon-with-value`; `ghost` o `surface`      | Afecta todas las superficies listadas                   |
| Estilos del control | `packages/components/themeToggler/ThemeToggler.module.css`  | Iconos animados, pressed, foco y valor                             | Depende de tokens/clases legacy                         |
| Dashboard           | `DashboardShellHeader.tsx` → `DashboardThemeControl.tsx`    | Composición app-owned, contrato Admin y labels por locale          | No propaga operational al primitive ni a otras apps     |
| Client navbar       | `NavbarDesktopView`, `NavbarTabletView`, `NavbarMobileView` | Icon-only en desktop/tablet; icono con valor en preferencias móvil | Puede afectar navegación pública/autenticada Client     |
| Client Profile      | `SettingsThemeControl.tsx`                                  | Icono con valor dentro de preferencias                             | Puede alterar perfil tenant-specific                    |
| Worker              | `apps/worker/app/[lang]/(app)/profile/page.tsx`             | Icono con valor `surface` en preferencias                          | Puede alterar la única superficie Worker que lo consume |

No hay import runtime en Dashboard Auth, Client Auth, Worker Auth, Users, alertas, loading ni
LanguageSwitcher. Las búsquedas completas no muestran consumidores adicionales fuera de los
adapters anteriores y de los tests que lo mockean.

## Arquitectura actual y ownership

No existe `ThemeProvider` global. `ThemeMode` sólo admite `light | dark`; no hay estado `system` ni
un selector de tres opciones.

| Responsabilidad                     | Implementación observada                                                | Owner actual                         |
| ----------------------------------- | ----------------------------------------------------------------------- | ------------------------------------ |
| Estado Dashboard                    | `AdminContext` sobre `useSessionComplement`                             | Complemento Admin                    |
| Estado Client                       | `ProfileContext`                                                        | Complemento Profile Client           |
| Estado Worker                       | `WorkerContext` sobre `useSessionComplement`                            | Complemento Worker                   |
| Mutación/persistencia de entidad    | `setTheme` → `updateEntity`/`updateProfile`, cache local y servicio BFF | Cada complemento de sesión           |
| Atributo DOM y clave global `theme` | `synchronizeDocumentTheme` del complemento de sesión                    | Complemento de sesión por aplicación |
| FOUC inicial Dashboard              | `createDashboardThemeBootstrapScript` antes de `<body>`                 | Bootstrap Dashboard                  |
| Renderizado Dashboard               | `DashboardThemeControl` local                                           | Header Dashboard                     |
| Renderizado Client y Worker         | `ThemeToggler` compartido                                               | `packages/components`                |

`ThemeToggler` consulta opcionalmente los tres contextos y prioriza implícitamente `Admin → Profile
→ Worker`; sólo permanece runtime en Client y Worker. Dashboard ya no lo consume: el header resuelve
`admin.theme`, `setTheme` y labels completos, y entrega el contrato mínimo al botón local. El nuevo
control no consulta contextos ni es owner de `document` o storage.

## Contrato funcional observado

- Admin y Worker resuelven el valor inicial desde entidad previa/cache, después `localStorage` global
  (`theme`) si vale `light|dark`, y por último `light`. Profile resuelve primero su cache scoped
  `hv-profile:*` o su perfil vacío (`light`); el script temprano Client puede aplicar la clave global
  antes de que Profile hidrate, pero no convierte esa clave en default del provider.
- Dashboard y Client ejecutan antes de hidratar un script que aplica el mismo valor global al
  atributo `data-theme` de `<html>`; si no puede leer storage, aplica `light`. El layout autenticado
  Dashboard usa `suppressHydrationWarning`; el root Client no lo hace, por lo que ese árbol conserva
  riesgo de mismatch a caracterizar.
- Worker renderiza inicialmente `data-theme="light"`; no tiene script equivalente. Su provider o
  el control pueden cambiar el atributo después de hidratar.
- La acción es binaria: desde `dark` cambia a `light`; cualquier otro valor observado se trata como
  `light` y propone `dark`.
- El click llama al `setTheme` del contexto resuelto. La mutación actualiza la entidad/cache y puede
  sincronizar contra su BFF; sólo el efecto posthidratación del complemento escribe
  `document.documentElement[data-theme]` y la clave global `localStorage.theme`.
- Recargar puede recuperar el valor global para reducir el flash, incluso antes de que llegue la
  entidad remota. La entidad remota posterior puede reemplazarlo.
- No hay `prefers-color-scheme`, listener de `matchMedia`, `storage` listener ni sincronización
  explícita entre pestañas. Por tanto no existe contrato de sistema ni actualización cross-tab.
- `matchMedia` ausente no afecta directamente a ThemeToggler: no lo usa. Los helpers de sesión
  protegen evaluación SSR (`window`/`document` ausentes), lecturas, escrituras y eliminación de
  caches scoped. Un fallo de storage degrada a `light` cuando se resuelve el valor y no interrumpe
  estado React, mutación remota ni muestra alertas de producto.

## Semántica y accesibilidad

`ThemeToggler` renderiza un `<button type="button">` con `aria-pressed={theme === 'dark'}`. Su
nombre accesible y `title` dicen el tema actual y la acción siguiente; los iconos son decorativos y
el modo con valor muestra texto localizado. La activación de teclado es nativa de botón y existe
un foco visible específico.

El contrato accesible que debe preservarse es: botón alcanzable por teclado, nombre que comunique
estado y acción siguiente, `aria-pressed` coherente con el modo oscuro, iconos no únicos como fuente
de significado y foco visible tanto en claro como oscuro. Un futuro renderizado Dashboard debe usar
este contrato, no necesariamente el tooltip, animación ni markup actuales.

## Dependencias legacy

| Dependencia                                                              | Clasificación                                      | Evidencia / consecuencia                                                            |
| ------------------------------------------------------------------------ | -------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `button`, `button--ghost`                                                | Visual legacy directa                              | El control hereda la familia global de botones; `surface` sigue incluyendo `button` |
| `NavbarShared.module.css#iconButton`                                     | Visual compartida accidental para Dashboard/Worker | Acopla tamaños/radio de navbar Client al control compartido                         |
| `type-body-sm`                                                           | Tipografía legacy directa                          | Se usa al mostrar el valor actual                                                   |
| `--radius-sm`, `--button-*`, `--card-neutral-border`, `--text-secondary` | Tokens legacy directos                             | Definen radio, pressed, foco, borde y color                                         |
| Animación/blur y `prefers-reduced-motion` locales                        | Visual del control                                 | No cambian el contrato de estado, pero requieren revisión visual independiente      |
| `react-icons` (`LuSunMedium`, `IoMoonOutline`)                           | Renderizado compartido                             | No deben condicionar el icono Dashboard futuro                                      |

`LuMoon` está importado pero no se usa; es evidencia de higiene pendiente, no autorización para una
limpieza incidental. No hay `--op-*` en el control ni CSS operational cargado por Client o Worker.

## Cobertura existente y gaps

La caracterización vive en `tests/jest/components/theme-toggler.test.jsx`,
`dashboard-theme-bootstrap.test.jsx`, `theme-effects.test.jsx` y las suites de `AdminProvider`,
`ProfileProvider` y `WorkerProvider`. El control se prueba como botón binario nombrado, con estado
`aria-pressed`, acción siguiente, foco nativo, callback, tolerancia sin provider y límites legacy.
Los contexts prueban inicialización, cambio directo, `data-theme` y clave global sin exigir número u
orden de escrituras. Admin cambia y persiste el tema sin montar ThemeToggler; los helpers toleran
fallos de lectura/escritura/eliminación de storage. El bootstrap Dashboard se ejecuta contra claro,
oscuro, ausencia, valor inválido y excepción, sin afirmar que JSDOM pruebe ausencia visual total de
FOUC. Los guards verifican consumidores Dashboard/Client/Worker, bootstrap Dashboard, ausencia de
`ThemeProvider`, `system`, `matchMedia` y `--op-*` compartidos.

| Prioridad | Gap antes de migrar                                                                              |
| --------- | ------------------------------------------------------------------------------------------------ |
| Deseable  | Persistencia tras reload y reconciliación cache/entidad remota                                   |
| Deseable  | Revisión visual de las variantes legacy del navbar Client durante la composición Dashboard       |
| Deseable  | Definir el bootstrap guest de Profile: la cache scoped puede ser reescrita por el perfil vacío   |
| Deseable  | Foco, contraste, reduced motion, zoom 200 % y tooltip en ambos temas                             |
| Diferido  | Política explícita de cambio de sistema y sincronización cross-tab; no existen hoy como contrato |

## Riesgos

1. El script inicial, cache local y entidad remota pueden discrepar, produciendo flash o un cambio
   tardío de tema tras hidratar.
2. Worker no tiene script anti-flash equivalente a Dashboard/Client.
3. La prioridad Admin/Profile/Worker es implícita y sería ambigua si más de un provider llegara a
   montarse por error.
4. Migrar las clases/tokens del control para Dashboard propagaría `--op-*` o un cambio visual a
   Client y Worker.
5. `aria-pressed` comunica estado binario, pero la apariencia dark usa el tratamiento pressed de
   button legacy; una migración visual no debe romper la relación entre semántica, foco y contraste.

## Decisión arquitectónica

El estado de tema y su contrato funcional permanecen temporalmente en los complementos de sesión
por aplicación; no se crea un provider global ni se modifica persistencia durante esta fase. La
fuente de verdad de cada superficie es su entidad/complemento, con el valor global `theme` como
continuidad de arranque transicional, no como autoridad independiente.

El renderizado Dashboard debe ser una composición app-owned futura dentro del header/shell
operational, que reciba un contrato mínimo ya resuelto (`theme`, acción de cambio y labels). No debe
importar el markup, CSS Module, clases legacy ni prioridad de contextos de `ThemeToggler`. El
primitive compartido permanece para Client y Worker hasta que sus consumidores se auditen por
separado. Esta decisión mantiene una sola fuente de verdad funcional por app sin forzar una nueva
abstracción compartida especulativa.

## Migración Dashboard y validación

Dashboard ya cumple el contrato binario accesible mediante `DashboardThemeControl`: botón nativo,
estado `aria-pressed`, nombre y `title` que comunican tema actual y acción siguiente, icono
decorativo, foco visible y callback del siguiente tema. Sus estilos sólo emplean `--op-*` dentro del
workspace operational y no copian markup, clases, blur ni animación del primitive legacy.

Heriberto realizó una revisión autenticada manual del Dashboard el `2026-07-17` y confirmó que el
control de tema se comporta como se espera junto con navegación y `LanguageSwitcher`. Codex no
ejecutó esa sesión ni la convierte en prueba automatizada. La composición Dashboard queda `READY`;
Client y Worker conservan la isla legacy. Se difieren los ajustes estéticos menores al contexto
visual de Users Directory. Persisten como deuda de plataforma, no bloqueo de esta composición:
ausencia total de FOUC bajo todas las condiciones, selector `system`, cross-tab, migración
Client/Worker, limpieza legacy, alertas, loading y Auth.
