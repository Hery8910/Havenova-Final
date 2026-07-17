# Migración del shell Dashboard a foundation operacional

- Estado: `IMPLEMENTED_EVIDENCE` — CI remota verde; gate visual del workspace bloqueado por acceso.
- Fecha: `2026-07-17`.
- Product Design: `b9c5a6c27ca5824199faca41a96f01c7705a8caf`.
- Alcance: sólo workspace Dashboard autenticado.

## Componentes migrados

- `DashboardWorkspaceShell`: frame, columnas, workspace continuo, topbar móvil, overlay, drawer y
  host local limitado de `LanguageSwitcher`.
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
`LanguageSwitcher` es el único consumidor del host local
`#dashboard-language-switcher-overlay-host`, propiedad de `DashboardWorkspaceShell`. Conserva su
coordinación compartida y el fallback a `document.body` para Client y Worker; el drawer móvil queda
inline y excluido. El host no es una plataforma general: otro consumidor requerirá auditoría propia.
`AlertViewport`, `Loading`, Dashboard Auth y Users siguen pendientes. Client y Worker no importan
CSS operacional.

La composición Dashboard conserva el ownership vigente: bootstrap antes de hidratar y complemento
Admin después; el control local sólo solicita el siguiente valor `light|dark`. No se promovió una
abstracción compartida especulativa ni se cambió Client, Worker o `LanguageSwitcher`.

La diferencia visual intencional es un plano de workspace continuo, sin el frame de tarjetas y
gradientes anterior. La navegación Dashboard ya forma parte de esa composición. La siguiente
frontera elegible es otra isla compartida del shell auditada independientemente; no incluye Users.

## Gate visual y estado de shell

El gate visual de `LanguageSwitcher` se intentó con Chrome headless y Dashboard local el
`2026-07-17`, pero el guard server-side redirigió `/en/people/users` a `/en/user/login` sin una
sesión autorizada. No se registra una revisión visual del workspace que no ocurrió. Se requieren una
sesión Dashboard de prueba o una fixture existente para completar desktop/mobile, `de/en/es`, ambos
temas disponibles, foco, stacking, clipping, scroll y zoom.

El shell queda técnicamente cerrado para esta frontera: drawer móvil `READY`, selector técnicamente
`READY` con gate visual bloqueado por acceso, y desktop colapsado `PARTIALLY_READY` por deuda visual
y de teclado no bloqueante. Esta deuda no bloquea la siguiente auditoría/convergencia de Users, pero
sí impide clasificar desktop colapsado como `READY`.

## Validación de formato conocida

Los archivos modificados por este corte pasan Prettier y `git diff --check`. No obstante,
`prettier --check .` no es verde: identifica Markdown legacy no relacionado en
`apps/client/app/[lang]/(app)/cleaning-service/README.md` y en
`apps/client/app/[lang]/(app)/docs/` (`ABOUT_AUDIT.md`, `ABOUT_PLAN.md`,
`ABOUT_RENDER_TREE.md`, `ABOUT_STYLE_INVENTORY.md`, `CLEANING_SERVICE_AUDIT.md`,
`CLEANING_SERVICE_RENDER_TREE.md`, `CLEANING_SERVICE_STYLE_INVENTORY.md`,
`CONTACT_AUDIT.md`, `CONTACT_FORM_PLAN.md`, `CONTACT_PLAN.md`, `CONTACT_RENDER_TREE.md`,
`CONTACT_STYLE_INVENTORY.md`, `HOME_PAGE_AUDIT.md`, `HOME_PAGE_RENDER_TREE.md`,
`HOME_SERVICE_AUDIT.md`, `HOME_SERVICE_RENDER_TREE.md`, `HOME_SERVICE_STYLE_INVENTORY.md` y
`HOME_STYLE_INVENTORY.md`). Son preexistentes y quedan fuera del corte; no se añaden exclusiones
globales ni se presenta el comando global como validación exitosa.
