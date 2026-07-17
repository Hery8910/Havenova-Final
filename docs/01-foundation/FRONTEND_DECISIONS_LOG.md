# Frontend Decisions Log

## Propósito

Registrar decisiones técnicas consecuenciales del frontend. Las decisiones de producto
permanecen en Product Design.

Estados: `Accepted`, `Provisional`, `Superseded`, `Rejected`.

## Plantilla

```text
## FE-XXX — Título

- Status:
- Documented:
- Scope:

Context
Decision
Rationale
Consequences
Revisit when
```

## FE-001 — Product Design es autoridad; implementación es evidencia

- Status: `Accepted`
- Documented: `2026-07-16`
- Scope: repository-wide

El frontend contiene flujos avanzados y placeholders que fueron creados en distintos
momentos. El código, los tests y las auditorías se utilizarán como evidencia. Sólo Product
Design puede autorizar comportamiento de producto.

Consecuencia: una feature implementada puede conservarse, diferirse o retirarse después
de la convergencia.

## FE-002 — Migración incremental, no reescritura total

- Status: `Accepted`
- Documented: `2026-07-16`
- Scope: migration

Cada área se clasificará antes de modificarla. Se conservarán BFF, patrones server-first,
contratos útiles y comportamiento validado. Las eliminaciones y reemplazos tendrán PRs
acotadas y evidencia de consumidores.

## FE-003 — Dashboard y worker forman el core compartido

- Status: `Accepted`
- Documented: `2026-07-16`
- Scope: product architecture

Havenova, Perfect Service y futuros tenants utilizarán el mismo dashboard y worker. Marca,
locale, dominio y capacidades aprobadas se resolverán mediante tenant configuration.

No se permiten branches específicos de Havenova dentro del core.

## FE-004 — El client puede ser específico del tenant

- Status: `Accepted`
- Documented: `2026-07-16`
- Scope: `apps/client`

La web pública y las capacidades de cliente pueden variar por empresa. Perfect Service
podrá tener una web presentacional con formulario de contacto sin duplicar dashboard o
worker.

## FE-005 — Browser, BFF y backend son fronteras separadas

- Status: `Accepted`
- Documented: `2026-07-16`
- Scope: integration/security

El navegador consume rutas same-origin. El BFF adapta transporte y seguridad. Backend
posee reglas de negocio y aislamiento tenant.

Los servicios browser-direct existentes son legacy y no deben ampliarse.

## FE-006 — Assets requieren registro y una fuente canónica

- Status: `Accepted`
- Documented: `2026-07-16`
- Scope: assets/branding

No se añadirá ni duplicará un asset sin propietario, superficie, origen, estado y
consumidores. Las copias generadas no se versionarán.

## FE-007 — Los correos comparten HTML y reciben branding del tenant

- Status: `Accepted`
- Documented: `2026-07-16`
- Scope: email

El header de correo no será un banner rasterizado con texto. El backend renderiza y envía;
el contrato visual usa HTML, copy real y assets registrados mediante URLs estables.

## FE-008 — La documentación tiene niveles de autoridad

- Status: `Accepted`
- Documented: `2026-07-16`
- Scope: documentation

Los documentos se clasifican como normativos, contratos, estado vivo, evidencia o
históricos. Una auditoría nunca sustituye arquitectura o Product Design.

## FE-009 — Users se reconciliará por slices

- Status: `Accepted`
- Documented: `2026-07-16`
- Scope: Users

La implementación V2 actual no se acepta o rechaza como un bloque. Directory/cursor/search
pueden verificarse; summary/filtros/relationships se difieren; invite/acceptance permanecen
bloqueados; token lifecycle se verifica de manera independiente.

## FE-010 — Next/React no se actualizan durante la estabilización inicial

- Status: `Provisional`
- Documented: `2026-07-16`
- Scope: toolchain

Primero se recuperará CI reproducible y se parchearán dependencias directas compatibles.
La migración mayor de Next/React tendrá plan y PR propios.

Revisar cuando la Fase 1 esté cerrada y exista una suite de comportamiento confiable.

## FE-011 — Los avatares externos conservan img nativo hasta definir su contrato de hosts

- Status: `Provisional`
- Documented: `2026-07-16`
- Scope: dashboard avatars/assets

El valor de avatar puede resolverse como ruta local o URL externa, y el dashboard todavía no
tiene una política canónica de hosts externos. Se mantiene `<img>` con una excepción ESLint local
y explícita; no se añadirá una allowlist amplia sólo para eliminar un warning.

La consecuencia temporal es no utilizar la optimización de imágenes de Next.js en este punto.
Revisar en la Fase 4, cuando se definan la fuente canónica, el almacenamiento y la allowlist de
avatares. Esta no es una política final de assets.

## FE-012 — La base visual legacy se congela antes de la migración operativa

- Status: `Accepted`
- Documented: `2026-07-17`
- Scope: global style ownership

Las tres aplicaciones resuelven la base visual actual mediante
`packages/styles/legacy.css`. Este entrypoint conserva el orden y las reglas existentes para no
alterar apariencias durante la migración. La futura foundation operacional se reserva en
`packages/styles/operational/`, sin carga de runtime ni dependencia de la base legacy.

Dashboard y Worker podrán adoptar una foundation operacional compartida sólo tras un slice
auditado. Sus shells siguen siendo responsabilidad de cada app y los estilos de dominio continúan
en CSS Modules. Client conserva el baseline legacy hasta que su propia migración tenga autoridad y
alcance aprobados.

Revisar cuando un slice operacional aprobado necesite tokens semánticos, reglas base, tipografía,
focus o primitivas validadas. No trasladar componentes ni copiar el prototipo de Product Design
por anticipado.

## FE-013 — La foundation operacional se activa sólo dentro del workspace Dashboard autenticado

- Status: `Accepted`
- Documented: `2026-07-17`
- Scope: Dashboard shell

`packages/styles/operational/shell.css` declara exclusivamente tokens `--op-*` bajo
`[data-ui-foundation='operational']` y su variante dark bajo el contrato document-level existente
`[data-theme='dark']`. La frontera se monta en `DashboardWorkspaceShell`; no se aplica a Auth,
Client, Worker ni al viewport global de alertas.

El shell propio deja de usar las clases globales legacy de card/button. `SideNav`, selector de
idioma, selector de tema, alertas y loading se conservan sin cambios como compatibility islands.
Revisar cuando una migración validada de cada isla permita sustituir legacy sin forzar una
abstracción compartida prematura. Worker no adopta la foundation hasta disponer de un slice de
dominio real aprobado.

## FE-014 — SideNav conserva una primitive neutral; la navegación operacional pertenece a Dashboard

- Status: `Accepted`
- Documented: `2026-07-17`
- Scope: navigation ownership

La auditoría de SideNav confirma dos consumidores runtime: el adapter Dashboard y `ProfileNav` del
Client. El paquete conserva temporalmente markup estructural y contratos neutrales; Dashboard es
owner de su modelo, rutas, copy, iconos, drawer y composición responsive. No se mueve SideNav al
Dashboard ni se introduce una variante operacional compartida.

Revisar sólo tras cubrir activo, expansión, colapso y accesibilidad en ambos consumidores. Una
migración futura será Dashboard-local y no propagará `--op-*` hacia Client Profile.

## FE-015 — El estado de tema permanece por aplicación; el control operational será Dashboard-local

- Status: `Accepted`
- Documented: `2026-07-17`
- Scope: theme ownership and Dashboard shell

`ThemeToggler` confirma que no existe un provider global de tema: Admin, Profile y Worker poseen
complementos de sesión separados, y el control actual resuelve uno por prioridad mientras duplica
las escrituras de documento y storage. La fuente de verdad funcional permanece temporalmente en el
complemento de cada aplicación; la clave global `theme` es continuidad de arranque y no una nueva
autoridad.

Una futura sustitución Dashboard recibirá un contrato de tema ya resuelto y será una composición
visual local del shell operational. No se trasladan sus tokens o markup al primitive compartido, ni
se cambia Client/Worker para justificar esa composición. Antes se deben caracterizar la hidratación,
persistencia, accesibilidad y un único owner de los efectos de documento/storage.

Revisar cuando esas pruebas estén cubiertas y exista una decisión para eliminar la duplicación de
efectos sin cambiar el contrato de las tres aplicaciones.
