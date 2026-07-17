# Auditoría de compatibility island — LanguageSwitcher

## Alcance y estado

- Estado: `PARTIALLY_READY`.
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

El panel usa `createPortal(..., document.body)`. En Dashboard esto sale de
`[data-ui-foundation='operational']`, por lo que un panel que dependa de `--op-*` no resolvería sus
tokens en `body`. El portal actual evita clipping y conserva posicionamiento fixed respecto al
trigger mediante listeners de resize/scroll, pero también crea un stacking context global y comparte
el espacio de overlays con alertas. SSR evita portal hasta `isMounted`, a costa de que el panel no
exista antes de hidratación.

Dirección recomendada para una futura migración Dashboard: un host de overlay **local al workspace**
dentro del boundary operational, suministrado al control Dashboard-owned. Conserva portal, evita
clipping y hereda tokens. Renderizar dentro del header arriesga clipping/stacking; un host global
ampliaría arquitectura sin consumidores demostrados; un contrato opcional de container en el
primitive propagaría complejidad a Client/Worker. No se implementa ninguno en este corte.

## Dependencias legacy

`LanguageSwitcher` depende de `button`, `button--ghost`, `card`, `card--neutral`, `type-label`,
`type-body-sm`, `NavbarShared.module.css`, `NavbarLinkList.module.css`, tokens `--radius-*`,
`--button-*`, `--navbar-*`, animaciones globales `navbarFadeIn*`, backdrop y portal a `body`. No
contiene `--op-*`; Client y Worker no cargan estilos operational. Dashboard aún consume el
primitive, por lo que una futura migración no debe modificar su CSS compartido.

## Cobertura añadida

La suite caracteriza dropdown, modal/backdrop, segundo click, exterior, Escape y retorno de foco,
opción actual, cookie, Profile, prioridad Admin/Profile/Worker, rutas localizada/raíz/anidada y la
ruta sin prefijo. Los guards fijan los consumidores, los tres contexts, cookie, pathname/router,
portal a `document.body`, CSS legacy y ausencia de `--op-*`.

## Gaps y riesgos obligatorios

1. Separar coordinación de cookie/complemento/navegación de la vista Dashboard sin crear provider
   global ni cambiar Client/Worker.
2. Definir host operational Dashboard para portal y convivencia con overlays.
3. Decidir manejo de fallos de cookie y rechazo remoto; hoy pueden dejar preferencia/URL divergentes.
4. Definir preservación de query/hash y ruta sin locale antes de reutilizar la operación.
5. Validar visualmente foco, posicionamiento, scroll, resize, stacking, móvil y los tres idiomas.
6. Confirmar si `I18nInitializer` y `havenova_lang` se retiran o integran en un corte separado.
7. Definir retorno de foco coherente para cierre por trigger, exterior y backdrop.

## Decisión y readiness

La evidencia respalda URL localizada como fuente del idioma renderizado, cookie como preferencia de
entrada, complemento como preferencia persistida de identidad y middleware como resolver de rutas
sin locale. La futura vista Dashboard debe recibir idioma, acción y labels resueltos; no debe elegir
contexts ni portar CSS legacy. El control actual sigue siendo un bridge para Client y Worker.

Readiness final: `PARTIALLY_READY`. Existe evidencia suficiente para diseñar la frontera, pero no
para iniciar la composición Dashboard hasta resolver explícitamente los gaps de operación y host
operational. No se modificó producción ni se migró visualmente ningún consumidor.
