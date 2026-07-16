# Auditoría de producto del frontend de Havenova

> [!IMPORTANT]
> **Documento histórico de evidencia.** Esta auditoría refleja el estado observado el 10 de julio de 2026 y no incorpora la rectificación de Product Design del 12 de julio de 2026. No debe utilizarse como autoridad para alcance, aceptación o release. Para decisiones actuales, consultar la [matriz de autoridad](../01-foundation/IMPLEMENTATION_AUTHORITY_MATRIX.md), la [auditoría técnica vigente](../00-audit/FRONTEND_BASELINE_AUDIT_2026-07-16.md) y el [contrato con Product Design y backend](../02-contracts/PRODUCT_AUTHORITY_AND_INTEGRATION.md).

> Estado observado: 10 de julio de 2026. Alcance: código frontend, rutas, textos, componentes, estilos y documentación existente. Este documento describe **lo que la interfaz implementa hoy**, no el producto deseado. Las conclusiones no demostrables se marcan como inferencias.

## 1. Resumen ejecutivo: el producto que existe hoy

Havenova se presenta como una plataforma para solicitar y operar servicios para hogares y propiedades. La web pública permite descubrir servicios, configurar una solicitud y contactar a la empresa. La cuenta de cliente permite autenticarse y gestionar los datos personales necesarios para esa relación. El dashboard está concebido como el espacio operativo de una empresa/tenant para administrar solicitudes, propiedades, personas, catálogo y comunicaciones. Una tercera aplicación separa la sesión de trabajadores, aunque su dominio operativo todavía no existe.

El recorrido principal que sí tiene una realización funcional clara es:

```text
Visitante
  → descubre servicios
  → configura una solicitud de limpieza o home service
  → elige una franja y dirección
  → inicia sesión/registro si no puede enviar
  → se convierte en cliente autenticado y verificable

Admin de tenant
  → entra al dashboard
  → gestiona el directorio de clientes e invitaciones
  → consulta el detalle de una persona o reenvía/revoca su invitación
```

La plataforma no es todavía una suite operativa completa: varias áreas del dashboard son rutas navegables con un scaffold que expone su propósito y siguiente paso, no listas, calendarios o editores reales. Esto es una distinción central para cualquier guía futura.

### Actores observables

| Actor | Superficie | Capacidades observadas | Estado |
| --- | --- | --- | --- |
| Visitante | `apps/client` pública | Navegar, conocer la empresa, seleccionar servicios, empezar formularios y enviar contacto | IMPLEMENTED/PARTIAL |
| Cliente autenticado | `apps/client` y auth | Registrarse, iniciar/cerrar sesión, verificar email, recuperar/acordar contraseña, editar perfil y preferencias | IMPLEMENTED; subdominios de cuenta parciales |
| Cliente invitado | Flujos auth compartidos | Usar enlaces de invitación para login, set-password y recuperación | IMPLEMENTED según componentes y contratos de auth |
| Admin interno del tenant | `apps/dashboard` | Sesión admin, navegación por dominios y gestión real del directorio de usuarios/invitaciones | Users Directory IMPLEMENTED; resto mayormente PLACEHOLDER |
| Worker | `apps/worker` | Autenticarse, pasar bootstrap de sesión y abrir un perfil mínimo | PLACEHOLDER de producto, base auth IMPLEMENTED |

No se observa una experiencia pública de “proveedor/worker” ni una operación de agenda/asignaciones realmente terminada.

## 2. Mapa de navegación por dominios funcionales

### Web pública y adquisición

**Propósito.** Presentar Havenova, explicar los servicios y convertir una intención de servicio o contacto en una solicitud.

**Usuario.** Visitante; el mismo shell se adapta cuando hay sesión de cliente.

**Rutas relevantes.** `/{lang}/`, `/about`, `/how-it-work`, `/cleaning-service`, `/home-service`, `/contact`; legales bajo `/legal/*`.

La navegación se materializa en `packages/components/client/navbar/NavbarContainer.tsx`: contiene variantes desktop, tablet y móvil, selector de idioma, tema y controles de cuenta. No es sólo un menú de marketing: también muestra estado de autenticación y conduce a perfil o logout.

- Inicio: hero, beneficios, servicios y una sección de instalación de app (`HomePage*`, `ServicesSection`, `BenefitsSection`, `AppInstallSection`). **IMPLEMENTED** como superficie de contenido y CTA.
- About y How it works: páginas de explicación de marca y proceso. **IMPLEMENTED** visualmente; su profundidad operativa no se deduce del código de páginas.
- Servicios: dos formularios guiados, no simples formularios de contacto. **IMPLEMENTED** en UI y composición; la entrega final depende de los callbacks de las páginas/servicios.
- Contacto: formulario con validación, precarga de nombre/correo del perfil y feedback global. **IMPLEMENTED**.
- Legal: privacidad, cookies, términos e imprint. **IMPLEMENTED** como contenido/rutas.

### Solicitud de servicios del cliente

**Propósito.** Recoger una petición suficientemente estructurada para cotizar, programar o iniciar una operación.

**Rutas.** `/cleaning-service`, `/home-service`.

Los dos recorridos comparten el patrón `ServiceRequestShell`: cabecera de pasos, contenido de una etapa, navegación atrás/siguiente, validación in situ, calendario de disponibilidad, dirección de trabajo y revisión. El modelo de producto observado prioriza recopilar contexto antes de enviar, no pedir una descripción libre como única entrada.

| Flujo | Etapas implementadas | Datos destacados | Estado |
| --- | --- | --- | --- |
| Limpieza | tipo de cliente/frecuencia → características de propiedad → franja → dirección → revisión | frecuencia, tamaño, habitaciones, balcón, escaleras, mascotas, detalles, slot y dirección | IMPLEMENTED; conserva borrador local versionado |
| Home service | tipo de cliente/servicio → detalle específico → franja → dirección → revisión | servicio canónico, detalle o especificación de pintura, slot y dirección | IMPLEMENTED en UI |

Fuentes: `CleaningRequestForm`, `HomeServiceRequestForm` y componentes compartidos bajo `packages/components/client/pages/shared/serviceRequest/`.

### Cuenta del cliente

**Propósito.** Mantener identidad, preferencias y datos de contacto de la persona que solicita servicios.

**Rutas.** `/profile`, `/profile/settings`, `/profile/orders`, `/profile/requests`, `/profile/notifications`.

- `/profile`: `ProfileOverviewPageClient`, edición/visualización de perfil, avatar, datos y preferencias. **IMPLEMENTED** en grado funcional visible.
- `/profile/settings`: configuración personal y controles de idioma/tema. **IMPLEMENTED/PARTIAL**, según secciones de `profileSettings`.
- `/profile/orders`, `/profile/requests`, `/profile/notifications`: no deben interpretarse como gestión real. `profileSubroutePlaceholders.ts` declara expresamente que son placeholders y prohíbe reintroducir listas mock. **PLACEHOLDER deliberado**.

### Autenticación, verificación e invitaciones

**Propósito.** Crear una identidad de cliente, verificar su email y recuperar o establecer acceso; compartir esa base con dashboard y worker.

**Rutas de cliente.** `/user/register`, `/user/login`, `/user/verify-email`, `/user/forgot-password`, `/user/set-password`.

Dashboard y worker tienen rutas paralelas de login, recuperación y set-password. Las variantes de invitación viven como componentes compartidos: `InvitationLoginPage`, `InvitationSetPasswordPage`, `InvitationForgotPasswordPage`.

La verificación no se limita a mostrar un éxito: cuando hay token intenta `verify-email → magic login → refreshAuth`; ante ausencia de token sirve como pantalla segura de reenvío. Registro crea una semilla de sesión logged-out, muestra feedback y redirige a verificación. **IMPLEMENTED** con numerosos códigos de error y alertas.

### Operación interna: dashboard

**Propósito declarado por el shell y documentación.** Operar el tenant, no configurar la cuenta personal del admin. La IA del dashboard distingue Workspace, People, Catalog, Tracking, Company y Account.

| Dominio | Rutas | Estado real observado |
| --- | --- | --- |
| Resumen y solicitudes | `/`, `/requests`, `/requests/board`, `/requests/calendar`, `/requests/[requestId]` | PLACEHOLDER; las páginas usan `DashboardRoutePlaceholder` y describen futuras listas/estados/calendario |
| Propiedades | `/properties`, detalle, requests y documents | PLACEHOLDER |
| Personas | `/people/users`, `/people/users/[userClientId]` | IMPLEMENTED para Users Directory V2; detalle legacy redirige a la superficie principal |
| Clientes | `/clients`, detalle | PLACEHOLDER, potencialmente ambigua frente a `people/users` |
| Equipo y red | admins, workers, managers y detalles | PLACEHOLDER |
| Catálogo | services, tasks, templates, automations | PLACEHOLDER |
| Comunicación | messages/hilo, notifications, activity | PLACEHOLDER |
| Empresa | general, branding, contact, legal, operations, integrations, billing, security | PLACEHOLDER |
| Cuenta admin | overview, profile, preferences, security, notifications | PLACEHOLDER |

El shell sí dispone de navegación agrupada, títulos por ruta, avatar, rol, idioma y tema (`dashboardShell.ts`, `DashboardShellHeader`). Por tanto, la navegación y la taxonomía son visibles; no equivalen a funcionalidad de cada área.

### Aplicación worker

**Rutas.** `/` y `/profile`, con auth equivalente bajo `/user/*`.

La home declara explícitamente ser una base mínima para validar sesión worker, complement y aislamiento de app. No representa agenda, disponibilidad ni trabajo asignado. **PLACEHOLDER de dominio / IMPLEMENTED de infraestructura auth**.

## 3. Flujos funcionales reales

### Registro, verificación y acceso

1. Entrada: CTA o `/user/register`.
2. El formulario recoge email, contraseña, idioma, aceptación de términos y preferencias de cookies; usa el client/tenant activo.
3. La respuesta se traduce por código: cuenta existente lleva a login, contraseña/conflicto puede llevar a recuperación, bloqueos y errores de validación reciben alertas.
4. Éxito: la UI guarda una semilla de identidad no verificada y redirige a verify-email.
5. Con token de verificación: verifica, intenta magic login y sincroniza la sesión. Si el contrato no entrega magic token, ofrece login manual en lugar de afirmar una sesión creada.
6. Login, forgot-password y set-password utilizan shells compartidos y feedback de loading/success/error.

**Estados UX:** enviando, error por código, éxito con auto-redirección, usuario no verificado, token inválido/expirado, fallback a login manual. **Desktop/mobile:** los shells auth son compartidos; no se encontró una divergencia de negocio por dispositivo, sólo de layout.

### Solicitud de limpieza

1. Entrada: página de servicio.
2. El usuario selecciona tipo de cliente y frecuencia.
3. Describe la propiedad y condiciones que afectan la prestación.
4. Selecciona una franja disponible desde `AvailabilityCalendar`.
5. Selecciona/introduce dirección de trabajo.
6. Revisa y envía; si no tiene permiso para enviar, aparece `AuthRequiredAlert` mediante `onRequireAuth`.

Cada paso marca campos como touched, bloquea avance inválido, anuncia el mensaje de validación y permite volver. Se persiste un borrador en almacenamiento local, por owner y versión, y se borra sólo tras éxito. Esto es una decisión explícita contra la pérdida de contexto en un formulario largo.

### Solicitud de home service

El patrón es idéntico en cinco etapas, pero el segundo paso enruta el detalle por tipo de servicio (`ServiceDetailsRouter`), incluyendo una rama específica de pintura. La UI transforma el tipo elegido a un tipo canónico antes de enviar. **Comportamiento observado:** el formulario reconoce que distintos servicios exigen distinta información, no un formulario universal plano.

### Contacto

Entrada: `/contact`. Nombre y correo se prefieren desde perfil si existen; el usuario elige asunto y redacta mensaje. Validaciones locales abren alerta global de error; éxito limpia asunto/mensaje, conserva identidad. Depende de perfil, i18n, alertas y el hook de envío. **IMPLEMENTED**.

### Directorio de usuarios e invitaciones del tenant

1. Entrada: `/people/users` o deep link legacy `/people/users/[userClientId]`, reconducido a `selected=entryId`.
2. La vista carga summary, directorio cursor-paginado y opcionalmente detalle.
3. Filtros: todos, activos, inactivos, invitaciones y requieren atención; búsqueda server-side con debounce y mínimo dos caracteres.
4. Selección abre detalle sin perder query, filtros o páginas cargadas. En desktop es master-detail; en móvil la misma ruta muestra una vista enfocada y back restaura selección, scroll y foco.
5. Invite crea invitación; errores estables distinguen cuenta existente, invitación pendiente y fallo de entrega. Una invitación expirada puede renovarse.
6. En detalle, resend/revoke usan `invitationId`, bloquean doble submit y revoke exige confirmación inline.

**Estados relevantes:** summary loading/error vs cero real; directorio loading/refresh/error/load-more/end; usuario o invitación; active/inactive/locked/invited/expired; razones `INVITATION_EXPIRED`, `EMAIL_UNVERIFIED_STALE`, `ACCOUNT_LOCKED`; panel empty/detail/invite. Es el flujo administrativo más acabado del repositorio.

## 4. Decisiones de producto visibles

| Evidencia / decisión | Clasificación | Lectura de producto |
| --- | --- | --- |
| Los servicios piden tipo de cliente, detalle, horario y dirección antes de envío | Explícita en formularios | La solicitud se concibe como entrada operativa estructurada, no como lead genérico |
| Borrador persistente sólo para limpieza | Comportamiento observado | Se prioriza no perder progreso en el flujo que actualmente se considera más largo o sensible; no puede afirmarse por qué home service no lo tiene |
| Envío de solicitud requiere autenticación | Explícita (`canSubmit`, `AuthRequiredAlert`) | Se reduce fricción permitiendo explorar/llenar antes de pedir acceso, pero la creación final queda ligada a identidad |
| Verificación intenta login automático | Explícita | Email verificado es un umbral de acceso, y la UI evita un paso manual cuando el backend permite magic-login |
| Invitaciones se muestran junto con clientes | Explícita en V2 Users Directory | El directorio administra la relación de acceso completa, no sólo usuarios ya activados |
| Revoke exige confirmación y resend/revoke usan IDs de invitación | Explícita | Revocar se trata como acción destructiva y una invitación es entidad distinta de la persona |
| Summary no se deriva de filas | Explícita en código/docs V2 | Métricas operativas son fuente backend propia y filtros clicables, no cálculos cosméticos del cliente |
| Dashboard separa Company de Account | Explícita en `DASHBOARD_INFORMATION_ARCHITECTURE.md` y shell | Configuración del tenant no debe confundirse con preferencias del admin |
| `/clients` y `/people/users` coexisten | Inferencia basada en implementación actual | Puede haber dos conceptos de cliente (relación comercial vs identidad de plataforma), pero no hay UI terminada que cierre esa semántica |

## 5. Estados de producto y representación

### Identidad y acceso

- Logged out / logged in / rol de sesión: proveedores `Auth`, `Client`, `Admin`, `Worker` y navegación contextual.
- Verificado/no verificado: registro deja estado no verificado; verify-email resuelve token y sincronización.
- Bloqueado: códigos como `AUTH_BLOCKED` y `USER_CLIENT_BLOCKED` producen error y niegan continuidad.
- Recuperación / set password / invitación: rutas y layouts propios; la relación exacta con todos los roles es compartida por auth.

### Perfil del cliente

- Perfil con datos/imagen o fallback de avatar.
- Campos incompletos y errores de formulario; no debe suponerse que profile settings equivale a expediente de cliente completo.
- Subrutas de órdenes, solicitudes y notificaciones: placeholder explícito, no empty state de datos reales.

### Solicitudes de servicio

- Sin seleccionar / touched / inválido / válido por campo y por paso.
- Slot de calendario ausente/elegido; dirección ausente/elegida; revisión antes de submit.
- No autenticado: CTA de autenticación en lugar de submit efectivo.
- Loading de submit y éxito/fallo delegado a callback. El ciclo de vida de negocio posterior a crear solicitud no está visualizado en la cuenta cliente.

### Personas e invitaciones en dashboard

- `kind=user|invitation` determina la representación de fila y detalle.
- Status de cuenta: active, inactive, locked; de invitación: pending/expired.
- Razones de atención traducidas por código.
- Selected usa `aria-current`, badge y panel detail; loading/error/empty se representan como estados de superficie, no sólo texto.
- La carga incremental tiene sentinel y fallback accesible “load more”.

### Estados transversales

Los componentes usan loading, skeleton/placeholder de navegación, alertas globales, disabled, focus visible, success y error. La madurez no es homogénea: Users Directory diferencia explícitamente cero/loading/error; muchos scaffolds de dashboard no llegan a tener datos de negocio que puedan producir esos estados.

## 6. Patrones de página existentes

| Patrón | Uso real | Reutilización | Observación |
| --- | --- | --- | --- |
| Navbar responsivo con cuenta | Cliente público/cuenta | `NavbarContainer` + vistas Desktop/Tablet/Mobile | Patrón sólido, con render inicial placeholder para evitar salto de tamaño |
| Auth shell | client, dashboard, worker | `AuthPageShell`, `AuthRouteLayout`, shared layouts e invitation pages | Reutilizado, pero todavía existen páginas/contratos específicos por app |
| Formulario guiado de solicitud | limpieza y home service | `ServiceRequestShell`, pasos, calendario, dirección, review | El patrón es fuerte; algunos pasos siguen específicos a cada servicio |
| Perfil y preferencias | cliente | profile overview/settings, avatar, idioma/tema | Reutilizado dentro de cuenta cliente; no equivale aún a account admin |
| Directorio master-detail | Users Directory | `Directory*`, `MasterDetailPage`, `TenantUserDirectoryItem`, panel detail | Patrón más completo; documentado para expansión a People |
| Route scaffold | casi todo dashboard | `DashboardRoutePlaceholder` | Reutilizado de manera honesta para rutas planeadas; no es un patrón de operación real |
| Shell de dashboard | dashboard | navegación agrupada y header | Estructura reutilizable, con copy parcialmente hardcoded en shell |
| Alert/modal de feedback | client/auth/contact | contexts alert + alert components | Patrón transversal para errores y éxitos; no todos los dominios lo usan aún |

Duplicaciones/inconsistencias: los dos request forms comparten gran parte del flujo pero tienen controladores y state models separados; auth comparte piezas pero conserva variantes por app; status badges existen tanto en componentes dashboard generales como People. Son candidatos a análisis posterior, no recomendación de refactor en esta auditoría.

## 7. Sistema visual actual

### Lenguaje y tokens

`packages/styles/tokens.css` define una base relativamente rica:

- marca: azul `#0980f6`, violeta `#6313ec`, acento amarillo `#edab12`;
- superficies claras con gradientes radiales, paneles translúcidos y blur;
- texto primary/secondary/muted, bordes sutiles/focus y feedback info/success/error/warning;
- familias de cards neutral/primary/secondary/accent;
- estados completos de botón, motion y focus.

`buttons.css` normaliza variantes primary, secondary, accent, outline, ghost y danger; todos comparten padding base, peso 700, transición y focus de 2px. `cards.css` normaliza radio, sombra, superficie y backdrop blur.

**Valores consistentes.** La interfaz contemporánea privilegia superficies claras, elevación suave, esquinas redondeadas, azul como acción primaria, y estados de feedback por color más texto. El token de focus está explícito y los botones tienen disabled no interactivo.

**Variaciones y riesgo.** Hay tokens semánticos, tokens de card y tokens de botón solapados; además de clases `card`, `glass-panel--base` y módulos de página. Esto permite un lenguaje consistente, pero puede producir superficies casi idénticas por vías distintas. El dashboard reciente usa módulos locales con patrones propios, mientras client conserva componentes más heterogéneos. No es un juicio de calidad visual, sino una señal de que aún no hay una única capa de composición.

### Tipografía, espaciado y componentes

El sistema usa tokens de tipo (`--type-body-sm-size`, `--type-label-size`), espacio (`--space-2`), radios (`--radius-btn`, `--radius-card`, `--radius-sm`) y motion. Los componentes con mayor valor para un futuro sistema son: Button, Card, alertas, LanguageSwitcher, ThemeToggler, Navbar, ServiceRequestShell y la familia Directory/MasterDetail.

Badges de estado, botones y estados selected están presentes, pero hay más de una familia de badge (`dashboard/statusBadge`, People `PersonStatusBadge`, y badges de recurrencia/área), señal de una taxonomía visual aún fragmentada.

## 8. Responsive y comportamiento por dispositivo

### Cliente

`NavbarContainer` selecciona explícitamente vistas desktop, tablet y mobile. Durante la detección inicial renderiza una carcasa visual para no mostrar una navegación inconsistente. En perfil se ocultan controles de cuenta redundantes en la nav. Esto evidencia una navegación móvil considerada como diseño propio, no sólo columnas comprimidas.

Los formularios de servicio comparten shell y usan controles de selección, calendario, dirección y footer de acción; su composición CSS debe revisarse visualmente en dispositivo, pero la lógica de pasos no cambia por breakpoint.

### Dashboard

Users Directory es el caso mejor resuelto: desktop conserva lista y detalle; mobile convierte detail/invite en vista enfocada de la misma ruta, y volver mantiene contexto. El sentinel de scroll se asocia al contenedor de lista y se conserva un fallback accionable. Es una decisión de producto con impacto de usabilidad positiva.

El resto del dashboard hereda shell y placeholders; no hay suficiente operación real para afirmar cómo se comportarían tablas, board o calendar en mobile. Cualquier guía debe evitar asumir que las rutas existentes ya resolvieron esa UX.

### Riesgos responsive observables

- La navegación cliente tiene tres implementaciones visuales; cambios de contenido pueden divergir si no se verifican juntas.
- Los textos localizados del nuevo Users Directory pueden cambiar densidad, especialmente alemán; los catálogos existen pero falta validación visual.
- Las rutas scaffold no prueban aún overflow, scroll interno, tablas ni acciones operativas en móvil.

## 9. Componentes base con valor para diseño de producto

No es un inventario completo; son las piezas que ya expresan relaciones de producto:

- `NavbarContainer` y sus vistas: navegación pública/cuenta con responsive, identidad, idioma y tema.
- `AuthPageShell`, `AuthRouteLayout` y shared auth layouts: entrada, recuperación, set-password e invitación.
- `ServiceRequestShell`, `ProcessStepsHeader`, `AvailabilityCalendar`, `WorkAddressSelector`, `ServiceRequestReviewStep`: patrón de proceso transaccional guiado.
- `ContactFormView`: formulario de comunicación con prefill de identidad y feedback.
- `ProfileOverviewPageClient`, profile form, avatar y preferencias: cuenta del cliente.
- `DirectorySummary`, `DirectoryFilters`, `DirectoryList`, `MasterDetailPage`, `TenantUserDirectoryItem`, `TenantUserDetailPanel`: base de directorio/inspector para People.
- `PersonStatusBadge`, `StatusBadge`, `AreaBadge`, `RecurrenceBadge`: candidatos a una posterior taxonomía común de estado, no equivalentes confirmados todavía.
- `DashboardRoutePlaceholder`: útil como patrón de transparencia de roadmap, pero no como componente de producto final.

## 10. Áreas incompletas o ambiguas

| Área | Clasificación | Evidencia y límite |
| --- | --- | --- |
| Users Directory V2 | IMPLEMENTED | API V2, resumen, filtros, cursor, invite/resend/revoke, mobile y catálogo i18n; faltan smoke tests desplegados y decisión de mostrar dirección/actividad |
| Formularios de servicios | IMPLEMENTED/PARTIAL | UI, validación, calendario, dirección y submit están presentes; ciclo de vida posterior, historial y operación no están visibles en cuenta cliente |
| Contacto | IMPLEMENTED | Validación y submit hook; no se audita aquí la recepción backend |
| Auth | IMPLEMENTED/PARTIAL | Flujos definidos y código de errores; requiere validación end-to-end de todos los roles e invitaciones |
| Perfil cliente | IMPLEMENTED/PARTIAL | Perfil y preferencias existen; no hay órdenes/requests/notificaciones reales |
| Perfil orders/requests/notifications | PLACEHOLDER | Texto lo declara explícitamente; no hay listas fake |
| Requests, properties, team, network, catalog, messages, company, account admin | PLACEHOLDER | Páginas de dashboard usan `DashboardRoutePlaceholder` y next steps |
| Dashboard overview | PLACEHOLDER | Tiene navegación y título, no métricas ni operación real |
| Worker app | PLACEHOLDER | La home dice explícitamente que es bootstrap de auth |
| `/clients` frente a `/people/users` | UNKNOWN | Ambas familias existen, pero sólo la segunda tiene contrato/UI de dominio realizados |
| Calendario operativo y asignación de workers | PLANNED/INFERRED | Existen rutas/scaffolds y campos de slot, no una experiencia operativa implementada |

## 11. Mapa conceptual de relaciones

```text
Tenant / empresa
  ├─ Admin account (dashboard account settings)                 [placeholder UI]
  ├─ Customer identity / User Client
  │    ├─ profile, language, theme, contact data
  │    ├─ email verification and auth
  │    ├─ invitation lifecycle (dashboard)
  │    └─ service requests
  │         ├─ service type and service-specific details
  │         ├─ preferred availability slot
  │         └─ work address
  ├─ Properties                                                   [planned UI relation]
  ├─ Workers / managers / admins                                  [planned UI relation]
  ├─ Service/task/template catalog                                [planned UI relation]
  └─ Messages, notifications and activity                         [planned UI relation]
```

La fuente principal visible de la relación “persona ↔ acceso” es Users Directory. La fuente principal de “cliente ↔ intención de servicio” son los formularios públicos. No hay todavía una superficie cliente implementada que conecte una solicitud enviada con una cita, worker, orden o historial; esa relación es una inferencia de la arquitectura prevista, no una funcionalidad confirmada.

## 12. Riesgos actuales de coherencia de producto y diseño

1. **La amplitud de navegación puede parecer funcionalidad.** El dashboard ofrece muchas rutas y títulos profesionales, pero casi todas muestran un scaffold. Sin etiquetado de disponibilidad en producto, un stakeholder puede asumir que requests, properties o calendar ya están operativos.
2. **Dos conceptos de cliente sin contrato visible común.** `/clients` y `/people/users` aparecen como dominios vecinos. El último gestiona identidad e invitaciones; el primero es placeholder. Es necesario decidir si son vistas de la misma entidad o roles distintos antes de diseñar ambos.
3. **El ciclo de vida de una solicitud está cortado entre adquisición y operación.** La web captura necesidad, horario y dirección; no existe UI cliente de seguimiento ni UI dashboard de gestión real. Por tanto no debe diseñarse una timeline como existente.
4. **Madurez desigual entre personas y el resto del dashboard.** Users Directory es una referencia de loading, error, selección, mobile e i18n; los demás dominios no aportan evidencia comparable. Copiar su patrón sin validar cada dominio sería una inferencia, aunque es una buena base candidata.
5. **Variantes visuales solapadas.** Tokens semánticos, cards, glass panels y módulos locales conviven; badges múltiples resuelven estados similares. El riesgo no es la falta de estilos, sino que futuras páginas elijan familias distintas para la misma relación visual.
6. **Responsive no verificable en dominios aún ficticios.** El navbar y Users Directory resuelven casos reales; tablas, pipeline, asignación y calendario no. Las decisiones de responsive deben esperar prototipos y no deducirse de placeholders.
7. **I18n no está uniformemente consolidado.** Users Directory ya tiene catálogo completo por locale; el shell dashboard conserva copy por idioma en TypeScript y existen fallbacks en client/auth. Esto puede producir divergencia de tono y textos en futuras superficies.
8. **La separación de account, company y workspace es correcta como intención, no como experiencia terminada.** Está explícita en documentación y navegación, pero no validada por flujos reales de configuración. Debe tratarse como una decisión de IA a probar con prototipos.

## Cierre para la siguiente etapa

La base de producto demostrable de Havenova es: descubrimiento de servicios, conversión mediante formularios estructurados, identidad/verificación, perfil de cliente y administración de usuarios/invitaciones por tenant. Los demás dominios sirven hoy sobre todo como mapa de información, intención y contratos de navegación.

Antes de crear una guía global o refactors, los prototipos deberían comenzar por tres conexiones que aún no están resueltas visualmente: (1) solicitud enviada → seguimiento del cliente; (2) solicitud entrante → operación interna; y (3) persona/invitación → relación comercial/propiedad/servicio. Cada propuesta debe declarar si se apoya en un flujo implementado, en una ruta placeholder o en una inferencia de producto.
