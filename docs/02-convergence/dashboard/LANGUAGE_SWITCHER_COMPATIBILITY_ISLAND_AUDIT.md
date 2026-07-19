# Auditoría de compatibility island — LanguageSwitcher

## Alcance y estado

- Estado: `READY` para la composición Dashboard, con gate visual manual pendiente.
- Fecha: `2026-07-17`.
- Alcance: caracterización de `LanguageSwitcher`; no contiene migración visual ni cambios de producción.

El primitive compartido es un coordinador cliente: deriva el idioma visible de la URL, escribe la
cookie `lang`, llama opcionalmente al complemento de sesión y navega. No es sólo un control visual.
Dashboard continúa siendo consumidor legacy hasta separar ese contrato de la composición visual.

## Inventario de consumidores runtime

| Aplicación | Superficie          | Props observadas                                    | Panel            | Riesgo                                                            |
| ---------- | ------------------- | --------------------------------------------------- | ---------------- | ----------------------------------------------------------------- |
| Dashboard  | Header autenticado  | `icon`, `bottom`, labels locales                    | Dropdown default | Hereda CSS/navbar y portal legacy fuera del boundary operational. |
| Client     | Navbar desktop      | `dropdown`, `icon`, `navbar`, labels navbar         | Dropdown         | Parte de la composición pública Client.                           |
| Client     | Navbar tablet       | Igual desktop, dentro del cierre de panel activo    | Dropdown         | Coordinación con controles de navbar.                             |
| Client     | Navbar mobile       | `modal`, `icon-with-value`, `navbar`, labels navbar | Modal            | Backdrop, foco y panel móvil propios.                             |
| Client     | Profile/preferences | `icon-with-value`, `top`                            | Dropdown default | Preference tenant-specific.                                       |
| Worker     | Profile/preferences | `icon-with-value`, `bottom`                         | Dropdown default | Único consumidor Worker.                                          |

No hay consumidores runtime en Auth, Users, alertas o loading. Las importaciones en tests y
documentación no forman parte del inventario runtime.

## Modelo real de idioma y ownership

| Fuente                             | Papel observado                                                                                                                                                                    |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prefijo `[lang]` / `usePathname()` | Fuente del idioma actual del switcher y de la ruta de destino. `useLang` también cae a `de`.                                                                                       |
| `I18nProvider.initialLanguage`     | Inicializa textos por layout desde `params.lang`; el provider mantiene estado interno, pero el switcher no lo actualiza directamente. La navegación remonta/reinicializa el árbol. |
| Cookie `lang`                      | Preferencia para middleware en entradas no localizadas; se escribe antes de persistir/navegar.                                                                                     |
| Admin/Profile/Worker `language`    | Preferencia persistida de identidad mediante `setLanguage` del complemento; el primitive selecciona implícitamente Admin → Profile → Worker.                                       |
| `accept-language`                  | Fallback del middleware Client/Dashboard/Worker para entradas sin locale y sin cookie.                                                                                             |
| `de`                               | Fallback del switcher, `useLang`, complementos y middleware cuando no hay valor soportado.                                                                                         |
| `localStorage.havenova_lang`       | Sólo lo lee `I18nInitializer`; no tiene consumidores runtime encontrados, por lo que es legado/desconectado.                                                                       |

Cuando URL, cookie y complemento discrepan, los textos y la opción actual siguen la URL; la cookie
sólo decide una entrada sin prefijo; el complemento no redirige ni sincroniza `I18nContext` por sí
mismo. La URL localizada es, por tanto, la fuente efectiva del idioma renderizado actual.

## Secuencia de cambio observada

1. Deriva `currentLang` del primer segmento del pathname, con fallback `de`.
2. Una opción distinta escribe `Cookies.set('lang', nextLanguage, { path: '/', expires: 365 })`.
3. Si existe, espera el `setLanguage` del contexto con prioridad Admin → Profile → Worker.
4. Sustituye sólo el primer segmento si ya es soportado.
5. Cierra, devuelve foco y ejecuta `router.push`.
6. La navegación reinicializa el layout e i18n desde el nuevo `params.lang`.

El orden cookie → complemento → navegación es implementación actual, no contrato de producto
aprobado. Seleccionar el idioma actual sólo cierra y devuelve foco. Sin provider sigue cookie y
navegación. Un rechazo del complemento corta la navegación tras escribir la cookie; una excepción de
cookie tampoco está contenida. Las rutas sin locale conservan el pathname sin cambiarlo, aunque la
cookie sí se escribe. `usePathname()` no contiene query ni hash: el primitive no los preserva.
Clicks repetidos y navegación pendiente no tienen bloqueo explícito.

## Contrato funcional y accesible

El trigger es un `<button type="button">` con icono decorativo, `title`, `aria-controls` y
`aria-expanded`; cerrado anuncia idioma actual y abierto anuncia la acción de cerrar. La variante
`icon-with-value` muestra el idioma. El panel permanece montado tras el primer mount y usa
`aria-hidden`; en modal recibe `role="dialog"`, `aria-modal` y título relacionado. Las opciones son
botones con `aria-current="true"` en la actual; el foco inicial apunta a esa opción y el focus trap
maneja Escape y retorno al trigger. Click exterior cierra dropdown; el modal usa backdrop.
El segundo click del trigger cierra por inversión de estado, pero no devuelve explícitamente el foco;
es un gap observado, no un contrato a preservar.

El dropdown es una divulgación con lista de acciones de navegación, no un menú de comandos ni un
listbox seleccionable. No se recomienda imponer `menu` o `listbox` sin rediseñar teclas y semántica;
la futura composición debe conservar botones, título, foco, Escape y retorno de foco.

## Portal y boundary operacional

`DashboardWorkspaceShell` crea el host local estable
`#dashboard-language-switcher-overlay-host` dentro de
`[data-ui-foundation='operational']` y lo entrega explícitamente al header. El portal conserva
posicionamiento fixed, evita clipping y hereda los tokens `--op-*` del workspace sin escribir ni
buscar nodos en `document.body`. El host está por encima del contenido (`z-index:30`) y por debajo
del drawer inline (`z-index:40`); no crea un manager, provider, registro ni API pública de overlays.

`LanguageSwitcher` acepta `portalContainer?: HTMLElement | null`. Dashboard proporciona ese destino;
si falta, Client y Worker conservan el fallback compatible a `document.body`. El host se desmonta con
el shell, no lo usa el drawer móvil y `LanguageSwitcher` es su único consumidor actual. Cualquier
nuevo consumidor requiere una auditoría propia antes de reutilizarlo.

## Dependencias legacy

`LanguageSwitcher` depende de `button`, `button--ghost`, `card`, `card--neutral`, `type-label`,
`type-body-sm`, `NavbarShared.module.css`, `NavbarLinkList.module.css`, tokens `--radius-*`,
`--button-*`, `--navbar-*`, animaciones globales `navbarFadeIn*` y backdrop. No contiene estilos
`--op-*`; Dashboard los pone a disposición mediante el host local, mientras Client y Worker no
cargan estilos operational.

## Cobertura añadida

La suite caracteriza dropdown, modal/backdrop, segundo click con retorno explícito al trigger,
exterior, Escape y retorno de foco,
opción actual, cookie, Profile, prioridad Admin/Profile/Worker, rutas localizada/raíz/anidada y la
ruta sin prefijo. También prueba el destino local explícito, el fallback y que el host pertenece al
workspace, desaparece al desmontarlo y no participa en el drawer.

## Gaps y riesgos obligatorios

1. Decidir manejo de fallos de cookie y rechazo remoto; hoy pueden dejar preferencia/URL divergentes.
2. Definir preservación de query/hash y ruta sin locale antes de reutilizar la operación.
3. Validar visualmente foco, posicionamiento, scroll, resize, stacking, móvil y los tres idiomas.
4. Confirmar si `I18nInitializer` y `havenova_lang` se retiran o integran en un corte separado.

## Decisión y readiness

La evidencia respalda URL localizada como fuente del idioma renderizado, cookie como preferencia de
entrada, complemento como preferencia persistida de identidad y middleware como resolver de rutas
sin locale. Dashboard sólo cambia ownership del portal; no cambia la coordinación Admin → Profile →
Worker, navegación, cookies ni `havenova_lang`.

Readiness final: `READY` para compatibilidad funcional y visual, ownership del portal, foco,
navegación localizada, cookies/persistencia y compatibilidad Client/Worker. El host sigue limitado a
este consumidor; esta clasificación no autoriza reutilizarlo sin una auditoría independiente.

## Gate visual — evidencia manual del propietario, 2026-07-17

Tras el intento técnico descrito abajo, Heriberto realizó una revisión autenticada real del
Dashboard. Confirmó que `LanguageSwitcher` se comporta como se espera junto con la navegación y el
control de tema. Esta es evidencia manual del propietario del producto; Codex no ejecutó esa sesión,
no generó nuevas capturas ni la presenta como prueba automatizada. Los ajustes visuales menores se
difieren a la implementación de Users Directory, cuando exista el contexto visual definitivo, y no
bloquean la clasificación actual.

## Intento técnico previo de 2026-07-17

No existe framework E2E ni fixture navegable del workspace Dashboard en este repositorio. Se inició
el Dashboard local y se solicitó `/en/people/users` con Chrome headless a `1440×900`; el layout
server respondió `307` y la URL final fue `/en/user/login`. La captura resultante muestra el login,
no el workspace, y se conserva temporalmente como evidencia de bloqueo con SHA-256
`9f3dfaf47fd59a55338f7f380c21709bd4643c992feac418a25e3c6b69dbbc66`.

El intento no produjo evidencia del selector. Las pruebas JSDOM continúan cubriendo los contratos
observables, pero no sustituyen una sesión autenticada. La revisión manual posterior del propietario
cierra el gate visual; no se aplicó corrección de producción.
