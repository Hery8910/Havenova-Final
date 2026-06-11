# Auth Plan

## Objetivo

Definir una secuencia de trabajo única para cerrar la ruta `apps/client/app/[lang]/(auth)` como feature compartido, corrigiendo a la vez la deuda estructural y la alineación con el backend `auth`.

Estado del documento:

- plan de trabajo activo
- baseline documental inicial de la ruta `(auth)` como bloque único

## Alcance

Este plan cubre:

- la ruta [apps/client/app/[lang]/(auth)](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth):1)
- sus cinco páginas principales: `login`, `register`, `forgot-password`, `set-password`, `verify-email`
- el layout compartido de la ruta
- el dominio frontend compartido de `auth` que impacta estos flujos
- la documentación operativa necesaria para continuar sin redescubrir contexto

No cubre en esta primera pasada:

- screenshots finales
- evidencia manual final posterior a implementación
- automatización E2E nueva
- revisión de flujos privados de dashboard o worker auth

## Resultado esperado

Al terminar esta línea de trabajo, `(auth)` debe cumplir como mínimo:

- auditoría y plan unificados para toda la ruta
- ownership claro entre layout, páginas y componentes compartidos
- contrato frontend `auth` alineado con el backend vigente
- reducción explícita de duplicación entre páginas
- criterio claro de separación entre lógica de flujo y presentación
- pendientes manuales finales documentados

## Fases

### Fase 1. Baseline documental

Entregables:

- [AUTH_AUDIT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/AUTH_AUDIT.md:1)
- este plan de trabajo

Objetivo:

- congelar el estado real de `(auth)` como feature único

### Fase 2. Inventario estructural y ownership del feature

Tareas:

- inventariar qué parte del shell pertenece al layout de ruta y qué parte sigue siendo repetición por página
- revisar `FormWrapper`, `Form` y demás piezas compartidas del dominio auth
- decidir la superficie canónica del feature para composición visual y estructural

Criterio de cierre:

- queda claro qué ownership vive en layout, qué vive en wrapper compartido y qué pertenece a cada flujo

Estado actual:

- iniciada y resuelta en su primera pasada práctica
- la ruta ya cuenta con un shell presentacional compartido para la estructura base de las páginas auth
- la lógica de cada flujo sigue separada por página

### Fase 3. Alineación del dominio frontend `auth` con backend

Tareas:

- revisar [FRONTEND_INTEGRATION.md](/home/heriberto/Escritorio/Backend/havenova-backend/src/core/auth/FRONTEND_INTEGRATION.md:1) contra `services`, `types`, `contexts` y páginas
- validar rutas que requieren `credentials`, `x-csrf-token` y `x-frontend-origin`
- revisar shape de `login`, `magic-login`, `verify-email`, `forgot-password`, `reset-password`, `logout` y `refresh`
- confirmar que `GET /me` siga siendo la fuente de verdad posterior al login

Criterio de cierre:

- el dominio frontend de `auth` queda consistente con el backend actual

Estado actual:

- iniciada en su primera pasada
- la normalización de sesión ya fue centralizada para servicio, contexto y escrituras manuales principales de `setAuth(...)`
- `userId` ya fue retirado del contrato de sesión `auth`; la identidad de sesión queda en `userClientId`

### Fase 4. Orquestación compartida de flujos

Tareas:

- detectar lógica repetida de redirects, popups, status mapping y payload composition
- documentar por página los estados visibles de `Alert`, success, error y salidas de usuario
- decidir qué hooks/helpers/adapters conviene extraer sin mezclar todos los flujos en un controller único
- mantener la separación por responsabilidad y no por página cuando la lógica ya es transversal

Criterio de cierre:

- cada página expresa su flujo propio sobre piezas compartidas estables

Estado actual:

- iniciada en su baseline documental
- cada página auth ya tiene un documento de flujo propio para revisar `Alert`, CTA y navegación caso por caso

### Fase 5. Presentación, i18n y layout

Tareas:

- consolidar la estructura base de las páginas auth
- revisar copy, fallbacks y consistencia i18n del feature
- inventariar los riesgos responsive del shell común
- documentar el patrón visual reusable de la ruta

Criterio de cierre:

- la ruta mantiene un patrón visual consistente y documentado sin dispersión estructural

## Organizacion de trabajo recomendada

La siguiente pasada ya no debe organizarse solo por páginas.

Conviene trabajar en dos niveles:

1. capas shared del feature
2. validación final por flujo/página

### Bloque A. Estructura shared de la ruta

Superficie:

- [layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/layout.tsx:1)
- [AuthPageShell.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/AuthPageShell.tsx:1)
- [userAuth.module.css](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/userAuth.module.css:1)

Objetivo:

- cerrar la semántica estructural de la ruta
- revisar landmarks, headings, footer, navegación auxiliar y comportamiento responsive
- decidir qué copy y qué accesibilidad deben vivir en shell y no repetirse por página

Criterio de cierre:

- el shell queda semánticamente correcto y reusable
- la ruta tiene patrón visual consistente en desktop y mobile

### Bloque B. Formulario shared auth

Superficie:

- [FormWrapper.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/userForm/formWrapper/FormWrapper.tsx:1)
- [Form.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/userForm/form/Form.tsx:1)
- [Form.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/userForm/form/Form.module.css:1)

Objetivo:

- revisar semántica del formulario
- revisar foco al error, `aria-*`, hints, `aria-live`, mensajes inline y estados disabled/loading
- revisar si los textos accesibles están traducidos y si faltan claves específicas para accessibility

Criterio de cierre:

- el formulario shared queda accesible y coherente antes de seguir página por página

### Bloque C. Textos e i18n del feature

Superficie:

- `packages/i18n/{en,es,de}/components.json`
- `packages/i18n/{en,es,de}/pages.json`
- `packages/i18n/{en,es,de}/popups.json`
- `packages/i18n/{en,es,de}/loadings.json`

Objetivo:

- revisar títulos, descripciones, labels, hints y CTAs
- revisar textos de `aria-label`, mensajes de error y success
- eliminar copy demasiado técnico o backend-facing
- asegurar consistencia entre idiomas y fallbacks

Criterio de cierre:

- los mensajes están orientados al usuario final
- los textos accesibles existen en los tres idiomas y no quedan hardcodeados sin justificación

### Bloque D. Revisión por página y flujo

Superficie:

- `login`
- `register`
- `forgot-password`
- `set-password`
- `verify-email`

Objetivo:

- revisar cada página ya sobre la base shared corregida
- validar layout propio, CTA, errores, success, salidas de usuario y copy contextual
- confirmar que cada flujo comunica con claridad qué puede hacer el usuario después

Criterio de cierre:

- cada página queda cerrada en semántica, accesibilidad, UX copy y salidas de error/success

### Bloque E. Cierre documental y validación

Objetivo:

- alinear `AUTH_AUDIT.md`, `README.md`, `TESTING.md` y los flow docs
- dejar checklist final para validación manual

Criterio de cierre:

- la ruta queda lista para pasada visual/manual sin deuda conceptual abierta

### Fase 6. Cierre y validación diferida

Tareas:

- actualizar la checklist viva del audit
- dejar explícito qué quedó resuelto y qué queda pendiente
- reservar para el final la validación manual funcional, visual y screenshots

Criterio de cierre:

- la ruta queda preparada para una pasada final de validación sin deuda conceptual abierta

## Orden recomendado

1. baseline documental
2. inventario estructural y ownership
3. alineación backend del dominio `auth`
4. bloque A: estructura shared de la ruta
5. bloque B: formulario shared auth
6. bloque C: textos e i18n del feature
7. bloque D: revisión por página y flujo
8. bloque E: cierre documental
9. validación manual/visual final

## Reglas de ejecución

Mientras `(auth)` siga abierta:

- no tratar cada página como un proyecto aislado
- no hacer retrabajo visual antes de revisar el contrato backend
- no fusionar toda la lógica en un único controller si la separación por responsabilidad sigue siendo más clara
- no cerrar la ruta sin dejar documentado qué validación manual queda pendiente

## Siguiente paso recomendado

1. ejecutar el bloque A sobre `layout`, `AuthPageShell` y CSS de la ruta
2. seguir con el bloque B sobre `FormWrapper` y `Form`
3. luego revisar i18n y accessibility copy antes de volver a auditar cada página
