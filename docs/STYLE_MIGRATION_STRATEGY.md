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

### Foundation operacional futura

[`packages/styles/operational/`](../packages/styles/operational/) está reservada para la
foundation visual compartida de Dashboard y Worker: tokens semánticos operativos, reglas base,
tipografía, foco y primitivas ya validadas. Actualmente sólo contiene documentación y ninguna app
la importa.

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
| Operational foundation | `packages/styles/operational/`                  | Inactiva                                 | Sólo reglas operativas compartidas tras validación.                    |
| App shell styles       | La app propietaria                              | CSS Modules del shell                    | Dashboard y Worker conservan composición, layout y responsive propios. |
| Domain styles          | Feature propietaria                             | CSS Modules de dominio                   | No promover a global sin reutilización demostrada.                     |

## Puentes de compatibilidad conocidos

Dashboard aún mezcla CSS Modules con clases y tokens legacy. El shell depende de `button`,
`button--ghost`, `button--active`, `card`, `card--secondary` y de variables de superficie,
tipografía, foco, sombra y botón. Los componentes shared montados por sus layouts —`SideNav`,
`ThemeToggler`, `LanguageSwitcher`, `AlertViewport`/`AlertPopup` y `Loading`— comparten esa
dependencia. Las superficies auth del dashboard también cargan el mismo `global.css` raíz y usan
alertas, loading y el auth shell compartido.

Estos contratos son puentes temporales. No se eliminan, renombran ni se trasladan a la foundation
operacional durante una migración de shell. Cada consumidor debe migrarse explícitamente o seguir
en legacy hasta tener una compatibilidad validada.

## Secuencia de migración

1. Auditar un slice operativo aprobado y sus clases globales, tokens, estados, foco y CSS Modules.
2. Definir la mínima regla operacional con owner y consumidores demostrados.
3. Adoptarla sólo en el slice y mantener el bridge legacy para el resto.
4. Validar apariencia, teclado, temas y contenido largo antes de ampliar consumidores.
5. Retirar un bridge únicamente después de comprobar todos sus consumidores.

La siguiente migración recomendada es un slice exclusivamente de **Dashboard shell**: inventariar
`DashboardWorkspaceShell`, `DashboardShellHeader`, `SideNav`, alertas, loading y auth; definir los
primeros tokens semánticos necesarios; y migrar un único conjunto de composición responsive. No
incluye Users, rutas placeholder, Client ni Worker.

## No objetivos

- No rediseñar páginas ni el shell Dashboard en esta fase.
- No activar estilos operacionales en producción.
- No limpiar Client ni rediseñar Worker.
- No crear un design system amplio, duplicar legacy o añadir utilidades sin owner.
- No retirar clases, tokens o CSS Modules existentes de forma implícita.
