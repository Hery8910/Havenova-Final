# Auth Audit

## Proposito

Este documento registra el estado actual de la ruta `apps/client/app/[lang]/(auth)` y la compara contra el estándar que ya se viene aplicando en el resto del frontend.

Estado:

- refleja el estado real de la ruta hoy
- separa deuda estructural, de UX, i18n y contrato backend
- trata `(auth)` como un surface único con varias páginas, no como páginas aisladas

## Fuentes revisadas

Ruta y testing:

- [layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/layout.tsx:1)
- [README.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/README.md:1)
- [TESTING.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/TESTING.md:1)

Páginas:

- [user/login/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/login/page.tsx:1)
- [user/register/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/register/page.tsx:1)
- [user/forgot-password/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/forgot-password/page.tsx:1)
- [user/set-password/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/set-password/page.tsx:1)
- [user/verify-email/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/verify-email/page.tsx:1)
- [user/userAuth.module.css](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/userAuth.module.css:1)
- [user/login/LOGIN_FLOW.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/login/LOGIN_FLOW.md:1)
- [user/register/REGISTER_FLOW.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/register/REGISTER_FLOW.md:1)
- [user/forgot-password/FORGOT_PASSWORD_FLOW.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/forgot-password/FORGOT_PASSWORD_FLOW.md:1)
- [user/set-password/SET_PASSWORD_FLOW.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/set-password/SET_PASSWORD_FLOW.md:1)
- [user/verify-email/VERIFY_EMAIL_FLOW.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/verify-email/VERIFY_EMAIL_FLOW.md:1)

Metadata por subruta:

- [user/login/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/login/layout.tsx:1)
- [user/register/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/register/layout.tsx:1)
- [user/forgot-password/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/forgot-password/layout.tsx:1)
- [user/set-password/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/set-password/layout.tsx:1)
- [user/verify-email/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/verify-email/layout.tsx:1)

Dominio compartido:

- [authService.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/auth/authService.ts:1)
- [packages/contexts/auth/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/README.md:1)
- [FormWrapper.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/userForm/formWrapper/FormWrapper.tsx:1)
- [Form.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/userForm/form/Form.tsx:1)

Contrato backend de referencia:

- [/home/heriberto/Escritorio/Backend/havenova-backend/src/core/auth/FRONTEND_INTEGRATION.md](/home/heriberto/Escritorio/Backend/havenova-backend/src/core/auth/FRONTEND_INTEGRATION.md:1)

## Diagnostico ejecutivo

La ruta `(auth)` ya tiene una base reutilizable razonable:

- existe un layout compartido
- existe ahora un shell presentacional compartido para la estructura visible de las páginas auth
- todas las páginas responden al mismo shell visual
- la metadata por subruta ya está resuelta
- los formularios comparten infraestructura mediante `FormWrapper`
- el dominio `auth` ya fue parcialmente alineado al backend cookie-based

La deuda actual no es rehacer la ruta, sino cerrar coherencia en tres capas:

- ownership del feature completo y reducción de duplicación entre páginas
- alineación final del frontend con el contrato backend vigente
- cierre estructural/documental equivalente al resto de rutas ya auditadas

Actualización del bloque shared:

- el shell auth ya usa una pieza autocontenida más adecuada (`article`) para cada card/flujo
- el layout dejó de forzar `overflow: hidden` y `height: 100dvh`, reduciendo el riesgo de recorte o bloqueo de scroll en mobile
- el logo/home link del shell ya tiene foco visible explícito
- en mobile pequeño la card ya no se pega completamente a los bordes del viewport
- el formulario shared ya usa ids accesibles estables por instancia en lugar de ids fijos repetibles
- el formulario shared ya expone resumen de error accesible y ahora prioriza foco en el primer campo inválido cuando falla la validación
- el bloque legal/TOS ya usa una semántica más limpia con `fieldset` y `legend` assistive
- el blur del checkbox `tosAccepted` ya valida correctamente el estado booleano real
- los textos shared de auth ya quedaron más orientados al usuario en CTAs de recuperación, verificación y resumen de errores
- el fallback genérico de validación del formulario shared ya salió del hardcode y quedó en i18n
- el footer shared auth ya expone navegación auxiliar con `aria-label` traducido
- los placeholders shared ya quedaron más coherentes entre idiomas
- el patrón `success + autoRedirect + cleanup de timeout` ya quedó consolidado en una utilidad shared del feature en lugar de repetirse por página
- las acciones compartidas de alerts auth ya dejaron de rearmarse manualmente en cada flujo base y ahora salen de una utilidad shared del feature
- `set-password` ya quedó alineada con esa capa shared y la advertencia de dependencias del efecto quedó cerrada
- `forgot-password` ya quedó alineada con esa misma capa shared y mantiene su lógica local de códigos solo donde todavía aporta claridad

## Criterio de organizacion

La siguiente fase de trabajo no debe seguir avanzando solo por página.

Conviene cerrar en este orden:

1. estructura shared de la ruta
2. formulario shared auth
3. textos, `aria-*` e i18n del feature
4. revisión final por página y flujo

Motivo:

- muchos problemas de semántica, accesibilidad y copy no pertenecen a una página aislada
- si se corrigen tarde, obligan a reabrir las cinco páginas varias veces
- el orden correcto es shared primero y páginas después

## Evaluacion por pagina

### `login`

Estado:

- flujo simple y coherente
- errores principales tienen salida clara
- `USER_LOGIN_EMAIL_NOT_VERIFIED` deriva correctamente a `verify-email`
- la descripción de redirección posterior al success ya salió del hardcode local y quedó en i18n

Pendiente:

- ninguna incoherencia crítica abierta en este flujo base

### `register`

Estado:

- flujo coherente hacia `verify-email`
- ya ofrece salida correcta para `already registered`, `needs correct password` y `email already in use`
- la persistencia local posterior al success backend ya no bloquea la continuación
- la descripción de redirección posterior al success ya salió del hardcode local y quedó en i18n
- el fallback de loading ya dejó de depender de copy inline específico de esta página
- las acciones secundarias ya separan mejor la salida principal (`login`) de la navegación auxiliar (`home`)

Pendiente:

- sigue dependiendo de persistencia local best-effort para continuidad de `language`, pero ya no afecta la salida principal del usuario

### `forgot-password`

Estado:

- flujo simple y razonable
- success ambiguo correcto por seguridad
- errores dejan al usuario en la página con posibilidad de reintento

Pendiente:

- ninguna incoherencia crítica detectada

### `set-password`

Estado:

- errores de token inválido o estado serializado ya ofrecen salida a `forgot-password` o home
- la página ya no muestra formulario cuando el enlace es inválido desde la URL
- los mensajes de enlace inválido/incompleto y el CTA principal ya quedaron en i18n contextual de la página
- el flujo ya no conserva literales inline para errores de enlace

Pendiente:

- ninguna incoherencia crítica detectada tras ese cierre

### `verify-email`

Estado:

- el flujo compuesto principal ya mantiene la intención correcta: un único loading y success final
- el formulario de resend sirve como fallback público razonable
- los errores de verify token inválido o cuenta bloqueada ya no expulsan al usuario de esta pantalla de recuperación
- la fase final ya puede distinguir entre éxito completo y sesión no confirmada tras `refreshAuth()`
- la copia de redirección y del fallo final de sincronización ya salió del hardcode por idioma y quedó en i18n contextual de página
- el flujo ya no conserva literales inline para esos mensajes principales
- el footer ya prioriza `login` como salida principal y deja `register` como alternativa secundaria

Pendiente:

- sigue siendo la página con mayor complejidad UX del feature
- conviene seguir puliendo si la copia final diferencia con suficiente claridad fallo de verificación, fallo de `magic-login` y fallo de sincronización

## Hallazgos

### 1. La ruta ya funciona como un feature único, pero sigue modelada como páginas casi autónomas

Estado actual:

- [layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/layout.tsx:1) aporta un shell visual común
- el shell presentacional principal ya está consolidado en una pieza shared del feature
- el patrón de auto-redirect ya está consolidado en una utilidad shared
- las acciones principales de alerts auth ya están consolidadas en una utilidad shared
- cada página todavía resuelve por su cuenta copy, payloads y mapeos de error específicos del flujo

Problema:

- la estructura visual base y parte de la orquestación ya quedaron compartidas, pero la configuración del dominio todavía sigue bastante distribuida
- cualquier cambio transversal de auth obliga a tocar varias páginas a la vez

Objetivo:

- tratar `(auth)` como un feature único con páginas especializadas
- mantener shared solo donde la repetición ya demostró ser estable, sin ocultar reglas locales que todavía conviene leer por página

### 2. El contrato backend cambió y el frontend todavía necesita una pasada de consolidación

Estado actual:

- el backend define auth `cookie-based`
- `login` y `magic-login` crean sesión por cookies
- la fuente de verdad posterior al login debe ser `GET /api/auth/me`
- ciertas rutas requieren `x-frontend-origin`
- ciertas rutas protegidas requieren `x-csrf-token`

Problema:

- [authService.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/auth/authService.ts:1) ya refleja parte del contrato, pero la ruta aún mezcla decisiones antiguas y nuevas en páginas, contextos y utilidades
- la alineación del dominio debe revisarse como conjunto, no caso por caso

Objetivo:

- verificar el dominio completo de `auth` desde servicio, tipos, contexto y flujos UI
- cerrar la distancia entre contrato backend y comportamiento visible del frontend

### 3. El layout compartido existe, pero su patrón reusable no está documentado ni consolidado

Estado actual:

- `layout.tsx` sólo define `main` y wrapper
- la identidad visual real vive repartida entre `userAuth.module.css` y cada `page.tsx`
- los sublayouts sólo aportan metadata y devuelven `children`

Problema:

- el patrón visual ya tiene una superficie canónica razonable a nivel de página auth
- lo que falta no es tanto crear otra capa visual sino dejar mejor documentado su ownership y sus límites

Objetivo:

- mantener la independencia de cada flujo sin reabrir duplicación visual ya resuelta
- documentar mejor qué pertenece al shell shared y qué debe seguir en cada página

### 4. Los flujos comparten demasiada lógica de alerts, redirects y mapeo de errores

Estado actual:

- `login`, `register`, `forgot-password`, `set-password` y `verify-email` repiten patrones similares
- `confirm/cancel` y redirects principales ya salieron en buena parte a utilidades shared
- varias páginas todavía calculan `PopupCode`, estados HTTP y ramas de dominio con lógica local
- `verify-email` ya recibió una mejora importante al tratarse como flujo compuesto único
- cada flujo ya tiene ahora un documento propio para inspeccionar `Alert`, CTA y salidas sin releer todo el componente

Problema:

- la lógica está bastante más ordenada que antes, pero todavía dispersa en la parte de reglas específicas por código
- el riesgo principal ya no es funcional puro, sino deriva y mantenimiento

Objetivo:

- separar mejor presentación, composición de payload y reglas compartidas reales
- evitar extraer demasiado pronto los mapeos de códigos mientras sigan siendo más legibles dentro de cada flujo

### 5. El sistema de metadata está bien; la deuda real está en arquitectura y cierre del feature

Estado actual:

- cada subruta ya usa `getPageMetadata(...)`
- la capa metadata no parece el cuello de botella actual

Lectura:

- metadata no es hoy el problema de `(auth)`
- la deuda real está en repetición estructural, contrato backend, i18n operativo y testing de flujos

### 6. El baseline visual está razonablemente unificado, pero sigue habiendo riesgos de responsive y de ownership CSS

Estado actual:

- [userAuth.module.css](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/userAuth.module.css:1) centraliza casi todo el shell visual
- el comportamiento mobile ya fue trabajado, pero sigue siendo una zona sensible por altura disponible, safe areas y card full-height

Riesgo residual:

- cualquier cambio en header, footer o spacing puede romper varias páginas a la vez
- falta inventario explícito del patrón visual para tocarlo sin redescubrirlo

## Resultado preliminar del audit

Ya está resuelto en la base:

- shell compartido de la ruta
- shell presentacional compartido de página auth para marca, header y contenedor
- metadata por subruta
- testing manual base ya documentado
- flujo de `verify-email` más coherente como proceso compuesto
- alineación parcial del servicio `auth` con backend cookie-based
- normalización de sesión ya centralizada para `authService`, `AuthContext` y los `setAuth(...)` más sensibles
- `login` cliente/dashboard ya escriben `setAuth(user)` y los estados pre-auth usan seeds explícitos en lugar de mezclar `...auth`
- `AuthUser` ya usa `userClientId` como identidad de sesión sin alias `userId`
- en runtime solo quedan como `setAuth(...)` intencionales: `verify-email` con `isNewUser: true`, limpieza de ese flag en `ProfileContext` y seeds logged-out/pre-auth

Sigue abierto:

- auditoría estructural del feature como conjunto
- consolidación del contrato frontend `auth` contra el backend actual
- reducción de duplicación residual entre páginas donde todavía aporte claridad real
- cierre documental comparable con las demás rutas
- validación manual/visual final tras los cambios futuros

Siguiente tramo real de continuación:

- actualizar y tomar como referencia la auditoría transversal de `packages/contexts/auth`
- cerrar los consumidores residuales de `auth.email` y validar que no reaparezcan aliases de identidad fuera del contrato principal de sesión
- revisar caminos secundarios de `setAuth(...)` y consolidar la orquestación compartida de flujos
- acotar los `setAuth(...)` restantes a casos intencionales: `verify-email` con `isNewUser`, limpieza de ese flag y seeds logged-out

## Riesgos

- si se corrige cada página por separado, se consolidará aún más la divergencia interna del feature
- si se toca UI sin revisar antes el contrato backend, pueden quedar redirects, alerts o payloads incoherentes
- si no se declara ownership de la estructura compartida, el layout seguirá siendo sólo un contenedor y no un patrón real del dominio

## Decisiones de trabajo propuestas

- `(auth)` debe tratarse como un único bloque de trabajo
- la auditoría y el plan deben cubrir toda la ruta, no una página aislada
- la integración backend de `auth` debe revisarse antes de una pasada visual final
- la validación manual y screenshots quedan para el cierre, no para esta primera fase documental
