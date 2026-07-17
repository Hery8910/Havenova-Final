# Migración del shell Dashboard a foundation operacional

- Estado: `IMPLEMENTED_EVIDENCE` — requiere validación visual y CI tras push.
- Fecha: `2026-07-17`.
- Product Design: `b9c5a6c27ca5824199faca41a96f01c7705a8caf`.
- Alcance: sólo workspace Dashboard autenticado.

## Componentes migrados

- `DashboardWorkspaceShell`: frame, columnas, workspace continuo, topbar móvil, overlay y drawer.
- `DashboardShellHeader`: contexto, identidad, superficies propias y `DashboardThemeControl`, una
  composición app-owned que recibe `theme`, acción y labels ya resueltos por Admin.
- `DashboardShellNav`: composición de navegación Dashboard-owned para desktop y drawer, con un
  único modelo en `dashboardShell.ts`, estado activo, grupos expandibles, colapso controlado y
  labels accesibles icon-only.
- Trigger y cierre de navegación móvil, con foco visible y retorno al trigger al cerrar.

## Coexistencia legacy y siguiente frontera

El boundary `data-ui-foundation="operational"` activa tokens `--op-*` sin redefinir legacy. Las
reglas de `DashboardShellNav` residen en `packages/styles/operational/shell.css` y se limitan a ese
boundary; no usan clases legacy. `SideNav` permanece como primitive legacy sólo para `ProfileNav`
del Client. Dashboard ya no consume `ThemeToggler`: su control de tema local no descubre contexts ni
escribe DOM/storage. `ThemeToggler` continúa como compatibility island para Client y Worker.
`LanguageSwitcher` permanece como isla auditada `PARTIALLY_READY`: Dashboard no puede sustituirla
hasta separar la coordinación de idioma y resolver un host de portal operational. `AlertViewport`,
`Loading`, Dashboard Auth y Users siguen pendientes. Client y Worker no importan CSS operacional.

La composición Dashboard conserva el ownership vigente: bootstrap antes de hidratar y complemento
Admin después; el control local sólo solicita el siguiente valor `light|dark`. No se promovió una
abstracción compartida especulativa ni se cambió Client, Worker o `LanguageSwitcher`.

La diferencia visual intencional es un plano de workspace continuo, sin el frame de tarjetas y
gradientes anterior. La navegación Dashboard ya forma parte de esa composición. La siguiente
frontera elegible es otra isla compartida del shell auditada independientemente; no incluye Users.

## Gate visual pendiente

No se realizó revisión visual interactiva en esta ejecución: el entorno de validación no dispone de
un navegador fiable para comprobar el layout runtime. Antes del merge final de la fase, una revisión
humana debe comprobar tema claro/oscuro y recargas con ambos valores de `localStorage.theme`,
convergencia bootstrap/Admin, `de`, `en` y `es`, desktop, tablet, móvil, label alemán largo,
hover, foco, pressed, zoom 200 %, ausencia de overflow y ausencia de cambio de tamaño durante
hidratación. Por ello el gate visual y la confirmación total de FOUC siguen pendientes.
