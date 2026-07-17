# Auditoría de compatibility island — ThemeToggler

## Alcance y estado

- Estado: `ACTIVE` — análisis y decisión; no autoriza una migración.
- Fecha: `2026-07-17`.
- Baseline de navegación Dashboard: `27f8d6e`.
- Alcance: estado de tema compartido, renderizado de `ThemeToggler` y sus consumidores runtime.

Esta auditoría no modifica `ThemeToggler`, los providers, el documento raíz, persistencia, estilos ni
tokens operational. El control no equivale al sistema de tema: es una vista cliente que consume un
complemento de sesión y duplica parte de sus efectos de documento.

## Inventario y consumidores runtime

| Pieza               | Ubicación                                                                   | Finalidad y variante                                               | Riesgo al modificarla                                         |
| ------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------- |
| Control compartido  | `packages/components/themeToggler/ThemeToggler.tsx`                         | Botón binario `icon` o `icon-with-value`; `ghost` o `surface`      | Afecta todas las superficies listadas                         |
| Estilos del control | `packages/components/themeToggler/ThemeToggler.module.css`                  | Iconos animados, pressed, foco y valor                             | Depende de tokens/clases legacy                               |
| Dashboard           | `apps/dashboard/app/[lang]/(app)/components/shell/DashboardShellHeader.tsx` | Icon-only `surface`, labels resueltos por locale                   | Puede alterar header operational y el único control Dashboard |
| Client navbar       | `NavbarDesktopView`, `NavbarTabletView`, `NavbarMobileView`                 | Icon-only en desktop/tablet; icono con valor en preferencias móvil | Puede afectar navegación pública/autenticada Client           |
| Client Profile      | `SettingsThemeControl.tsx`                                                  | Icono con valor dentro de preferencias                             | Puede alterar perfil tenant-specific                          |
| Worker              | `apps/worker/app/[lang]/(app)/profile/page.tsx`                             | Icono con valor `surface` en preferencias                          | Puede alterar la única superficie Worker que lo consume       |

No hay import runtime en Dashboard Auth, Client Auth, Worker Auth, Users, alertas, loading ni
LanguageSwitcher. Las búsquedas completas no muestran consumidores adicionales fuera de los
adapters anteriores y de los tests que lo mockean.

## Arquitectura actual y ownership

No existe `ThemeProvider` global. `ThemeMode` sólo admite `light | dark`; no hay estado `system` ni
un selector de tres opciones.

| Responsabilidad                     | Implementación observada                                                | Owner actual                                 |
| ----------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------- |
| Estado Dashboard                    | `AdminContext` sobre `useSessionComplement`                             | Complemento Admin                            |
| Estado Client                       | `ProfileContext`                                                        | Complemento Profile Client                   |
| Estado Worker                       | `WorkerContext` sobre `useSessionComplement`                            | Complemento Worker                           |
| Mutación/persistencia de entidad    | `setTheme` → `updateEntity`/`updateProfile`, cache local y servicio BFF | Cada complemento de sesión                   |
| Atributo DOM y clave global `theme` | efecto del complemento; también efecto duplicado de `ThemeToggler`      | Responsabilidad duplicada, no un owner único |
| FOUC inicial Dashboard/Client       | script inline de sus layouts `app/[lang]`                               | Cada layout de aplicación                    |
| Renderizado del control             | `ThemeToggler` compartido                                               | `packages/components`                        |

El control consulta opcionalmente los tres contextos y prioriza implícitamente `Admin → Profile →
Worker`; en los árboles runtime actuales sólo debe existir el contexto propio de cada aplicación.
No es una API de estado neutral: mezcla renderizado, selección de provider, actualización del
documento y persistencia global.

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
  sincronizar contra su BFF; el efecto de provider y el efecto del control escriben
  `document.documentElement[data-theme]` y la clave global `localStorage.theme`.
- Recargar puede recuperar el valor global para reducir el flash, incluso antes de que llegue la
  entidad remota. La entidad remota posterior puede reemplazarlo.
- No hay `prefers-color-scheme`, listener de `matchMedia`, `storage` listener ni sincronización
  explícita entre pestañas. Por tanto no existe contrato de sistema ni actualización cross-tab.
- `matchMedia` ausente no afecta directamente a ThemeToggler: no lo usa. `localStorage` sólo tiene
  guards de entorno (`typeof window`) en providers; lecturas/escrituras no están protegidas contra
  excepciones del storage. Los scripts inline capturan su lectura, pero los efectos cliente no.

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

La caracterización vive en `tests/jest/components/theme-toggler.test.jsx` y en las suites de
`AdminProvider`, `ProfileProvider` y `WorkerProvider`. El control se prueba como botón binario
nombrado, con estado `aria-pressed`, acción siguiente, foco nativo, callback, tolerancia sin provider
y sus límites legacy. Los contexts prueban inicialización, cambio directo, `data-theme` y la clave
global sin exigir número u orden de escrituras. En particular, Admin cambia y persiste el tema sin
montar ThemeToggler. Los guards verifican consumidores Dashboard/Client/Worker, bootstrap Dashboard,
ausencia de `ThemeProvider`, `system`, `matchMedia` y `--op-*` compartidos.

| Prioridad   | Gap antes de migrar                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------ |
| Obligatorio | Falla controlada de storage, SSR sin `window` y hydration/Fouc de Dashboard                      |
| Obligatorio | Decidir un único owner de cada escritura de `data-theme`/`localStorage`                          |
| Obligatorio | Client Navbar completo conserva sus variantes legacy al extraer Dashboard                        |
| Deseable    | Persistencia tras reload y reconciliación cache/entidad remota                                   |
| Deseable    | Definir el bootstrap guest de Profile: la cache scoped puede ser reescrita por el perfil vacío   |
| Deseable    | Foco, contraste, reduced motion, zoom 200 % y tooltip en ambos temas                             |
| Diferido    | Política explícita de cambio de sistema y sincronización cross-tab; no existen hoy como contrato |

## Riesgos

1. El control y los providers escriben el mismo atributo y storage, creando dos fuentes de efecto.
2. `ThemeToggler` accede a `document` y `localStorage` sin `try/catch`; storage bloqueado puede
   convertir un ajuste visual en error de efecto.
3. El script inicial, cache local y entidad remota pueden discrepar, produciendo flash o un cambio
   tardío de tema tras hidratar.
4. Worker no tiene script anti-flash equivalente a Dashboard/Client.
5. La prioridad Admin/Profile/Worker es implícita y sería ambigua si más de un provider llegara a
   montarse por error.
6. Migrar las clases/tokens del control para Dashboard propagaría `--op-*` o un cambio visual a
   Client y Worker.
7. `aria-pressed` comunica estado binario, pero la apariencia dark usa el tratamiento pressed de
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

## Frontera futura y aceptación

Secuencia recomendada:

1. caracterizar el control y los efectos de provider con los gaps obligatorios;
2. decidir y aislar un único owner de la escritura DOM/storage antes de duplicar el renderizado;
3. crear el control visual Dashboard-local contra el contrato ya resuelto;
4. revisar visualmente claro/oscuro, `de/en/es`, teclado, foco, zoom y header responsive;
5. conservar Client y Worker legacy, y reevaluar el primitive sólo con un segundo consumidor
   operational validado.

Readiness: `PARTIALLY_READY`. El contrato visible, los tres contexts y el bootstrap Dashboard están
caracterizados, pero la composición Dashboard no debe implementarse hasta decidir el único owner de
los efectos DOM/storage y cubrir storage fallido e hidratación. La futura migración será aceptable
cuando Dashboard no renderice ThemeToggler legacy, mantenga el contrato funcional y accesible, no
añada operational a Client/Worker y la revisión visual/hidratación esté comprobada. Se difieren el
selector `system`, cross-tab, migración Client/Worker, limpieza de legacy, LanguageSwitcher, alertas,
loading, Auth y Users.
