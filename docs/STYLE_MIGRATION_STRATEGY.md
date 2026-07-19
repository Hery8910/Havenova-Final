# Estrategia de migración y ownership de estilos

## Propósito y estado

- Propietario: frontend.
- Última revisión: `2026-07-17`.
- Estado: `ACTIVE` — establece límites estructurales; no activa un rediseño.

Este documento evita que la futura migración del shell operativo afecte accidentalmente a la
superficie Client. Product Design define la dirección visual futura, pero su prototipo no se copia
ni se activa en producción por esta decisión.

## Fundaciones explícitas

### Baseline legacy congelado

[`packages/styles/legacy.css`](../packages/styles/legacy.css) es el único entrypoint de la base
visual actual. Importa, en el mismo orden histórico, tokens, base, tipografía, badges, botones,
formularios, cards, motion y helpers. Client, Dashboard y Worker lo cargan desde su propio
`app/global.css`.

La base legacy preserva las clases globales y los tokens actuales. No es una fuente de nuevos
patrones ni una prueba de que cada regla sea apropiada para el producto futuro. Toda sustitución
requiere un slice auditado y una migración acotada de consumidores.

### Foundation operacional

[`packages/styles/operational/`](../packages/styles/operational/) contiene la primera foundation
visual compartida de Dashboard y Worker. Dashboard importa `shell.css`, pero sus tokens `--op-*`
sólo resuelven dentro de `[data-ui-foundation='operational']` en el workspace autenticado. Client,
Worker y Dashboard Auth siguen cargando sólo legacy.

No puede importar la foundation legacy ni duplicar su sistema completo. No es un bucket de
utilidades genéricas, un lugar para CSS de página, ni un destino para el prototipo de Product
Design. Se poblará sólo cuando un slice de producto operativo esté aprobado y su consumo esté
auditado.

## Matriz de ownership

| Área                   | Owner actual                                    | Fuente de estilos activa                 | Regla de evolución                                                     |
| ---------------------- | ----------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------- |
| Client                 | `apps/client` (tenant-specific)                 | `apps/client/app/global.css` → legacy    | Mantener estable; migración independiente y aprobada.                  |
| Dashboard              | `apps/dashboard` (core operativo)               | `apps/dashboard/app/global.css` → legacy | El shell se migrará por slice; no adoptar operational aún.             |
| Worker                 | `apps/worker` (core operativo)                  | `apps/worker/app/global.css` → legacy    | No migrar visualmente hasta existir un dominio worker real y aprobado. |
| Shared legacy styles   | `packages/styles/legacy.css` y archivos vecinos | Legacy                                   | Congelados como bridge de compatibilidad.                              |
| Operational foundation | `packages/styles/operational/`                  | Dashboard autenticado, scoped            | Sólo tokens y reglas operativas validadas; Worker sigue inactivo.      |
| App shell styles       | La app propietaria                              | CSS Modules del shell                    | Dashboard y Worker conservan composición, layout y responsive propios. |
| Domain styles          | Feature propietaria                             | CSS Modules de dominio                   | No promover a global sin reutilización demostrada.                     |

## Puentes de compatibilidad conocidos

El frame, header, topbar móvil, overlay, drawer, controles propios del shell y la composición
`DashboardShellNav` usan `--op-*`; ya no montan `card`, `card--*`, `button`, `button--*` ni
helpers de animación legacy. La navegación Dashboard se implementa en su adapter app-owned y sus
reglas viven en `operational/shell.css`, limitadas al workspace autenticado. `SideNav` sigue sin
cambios como compatibility island para `ProfileNav` de Client. Dashboard sustituyó su consumo de
`ThemeToggler` por `DashboardThemeControl`, una composición local del header que consume sólo tokens
`--op-*` scoped y recibe estado/acción ya resueltos. El primitive compartido, `LanguageSwitcher`,
`AlertViewport`/`AlertPopup` y `Loading` permanecen legacy donde todavía tienen consumidores.
Dashboard Auth carga el mismo `global.css`, pero no contiene el boundary operacional.

La auditoría de `LanguageSwitcher` confirma que Dashboard todavía depende de un primitive que mezcla
vista, cookie, complemento opcional, pathname, router y portal a `body`. El siguiente corte no debe
copiar su CSS ni llevar `--op-*` al primitive: primero debe establecer una composición Dashboard-local
y un host de overlay dentro del boundary operational. Hasta entonces no se modifica ningún consumidor.

La auditoría de [ThemeToggler](02-convergence/dashboard/THEME_TOGGLER_COMPATIBILITY_ISLAND_AUDIT.md)
confirma que su renderizado compartido depende de providers de sesión, clases y tokens legacy de
Client. Dashboard lo sustituye sólo después de caracterizar sus efectos de documento/storage y de
separar un contrato resuelto; no se añaden tokens operational al control compartido ni se crea un
primitive nuevo sin otro consumidor demostrado.

Estos contratos son puentes temporales. No se eliminan, renombran ni se trasladan a la foundation
operacional durante una migración de shell. Cada consumidor debe migrarse explícitamente o seguir
en legacy hasta tener una compatibilidad validada.

## Secuencia de migración

1. Auditar un slice operativo aprobado y sus clases globales, tokens, estados, foco y CSS Modules.
2. Definir la mínima regla operacional con owner y consumidores demostrados.
3. Adoptarla sólo en el slice y mantener el bridge legacy para el resto.
4. Validar apariencia, teclado, temas y contenido largo antes de ampliar consumidores.
5. Retirar un bridge únicamente después de comprobar todos sus consumidores.

La auditoría de [SideNav](02-convergence/dashboard/SIDENAV_COMPATIBILITY_ISLAND_AUDIT.md) confirmó
que no es un shell Dashboard: Client Profile también la consume. Dashboard ya sustituyó sólo su
consumo runtime por una composición de navegación operational app-owned, sin incluir Users, rutas
placeholder, Client ni Worker. La siguiente frontera deberá ser otra compatibility island auditada,
no una extensión del primitive compartido.

## No objetivos

- No rediseñar páginas ni el shell Dashboard en esta fase.
- No activar estilos operacionales en producción.
- No limpiar Client ni rediseñar Worker.
- No crear un design system amplio, duplicar legacy o añadir utilidades sin owner.
- No retirar clases, tokens o CSS Modules existentes de forma implícita.
