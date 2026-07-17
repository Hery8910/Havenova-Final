# Migración del shell Dashboard a foundation operacional

- Estado: `IMPLEMENTED_EVIDENCE` — requiere validación visual y CI tras push.
- Fecha: `2026-07-17`.
- Product Design: `b9c5a6c27ca5824199faca41a96f01c7705a8caf`.
- Alcance: sólo workspace Dashboard autenticado.

## Componentes migrados

- `DashboardWorkspaceShell`: frame, columnas, workspace continuo, topbar móvil, overlay y drawer.
- `DashboardShellHeader`: contexto, identidad y superficies propias.
- Trigger y cierre de navegación móvil, con foco visible y retorno al trigger al cerrar.

## Coexistencia legacy y siguiente frontera

El boundary `data-ui-foundation="operational"` activa tokens `--op-*` sin redefinir legacy.
`SideNav`, `ThemeToggler`, `LanguageSwitcher`, `AlertViewport`, `Loading`, Dashboard Auth y Users
son compatibility islands. Client y Worker no importan CSS operacional.

La diferencia visual intencional es un plano de workspace continuo, sin el frame de tarjetas y
gradientes anterior. La siguiente frontera elegible es una isla compartida del shell, empezando por
la navegación tras auditar sus consumidores; no incluye Users.
