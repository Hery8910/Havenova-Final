# Migración del shell Dashboard a foundation operacional

- Estado: `IMPLEMENTED_EVIDENCE` — requiere validación visual y CI tras push.
- Fecha: `2026-07-17`.
- Product Design: `b9c5a6c27ca5824199faca41a96f01c7705a8caf`.
- Alcance: sólo workspace Dashboard autenticado.

## Componentes migrados

- `DashboardWorkspaceShell`: frame, columnas, workspace continuo, topbar móvil, overlay y drawer.
- `DashboardShellHeader`: contexto, identidad y superficies propias.
- `DashboardShellNav`: composición de navegación Dashboard-owned para desktop y drawer, con un
  único modelo en `dashboardShell.ts`, estado activo, grupos expandibles, colapso controlado y
  labels accesibles icon-only.
- Trigger y cierre de navegación móvil, con foco visible y retorno al trigger al cerrar.

## Coexistencia legacy y siguiente frontera

El boundary `data-ui-foundation="operational"` activa tokens `--op-*` sin redefinir legacy. Las
reglas de `DashboardShellNav` residen en `packages/styles/operational/shell.css` y se limitan a ese
boundary; no usan clases legacy. `SideNav` permanece como primitive legacy sólo para `ProfileNav`
del Client. `ThemeToggler`, `LanguageSwitcher`, `AlertViewport`, `Loading`, Dashboard Auth y Users
siguen siendo compatibility islands. Client y Worker no importan CSS operacional.

La diferencia visual intencional es un plano de workspace continuo, sin el frame de tarjetas y
gradientes anterior. La navegación Dashboard ya forma parte de esa composición. La siguiente
frontera elegible es otra isla compartida del shell auditada independientemente; no incluye Users.

## Gate visual pendiente

No se realizó revisión visual interactiva en esta ejecución: el entorno de validación no dispone de
un navegador fiable para comprobar el layout runtime. Antes del merge final de la fase, una revisión
humana debe comprobar tema claro y oscuro; `de`, `en` y `es`; desktop expandido y colapsado;
tablet; móvil con drawer abierto y cerrado; el label alemán largo; hover, foco y activo; zoom al
200 %; ausencia de overflow; y la alineación con el workspace operational. También debe confirmar
que el cierre desde un enlace del drawer conserva el scroll lock y el retorno de foco que posee
`DashboardWorkspaceShell`.
