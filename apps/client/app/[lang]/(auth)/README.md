# Auditoría de la Ruta `(auth)` en `apps/client`

Este documento resume el estado actual de `apps/client/app/[lang]/(auth)` con foco en:

- consistencia visual y responsive
- semántica y accesibilidad
- contratos funcionales de auth
- errores, popups y estados de loading
- i18n y metadata
- riesgos para despliegue

Archivos revisados:

- [layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/layout.tsx)
- [user/login/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/login/page.tsx)
- [user/register/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/register/page.tsx)
- [user/forgot-password/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/forgot-password/page.tsx)
- [user/set-password/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/set-password/page.tsx)
- [user/verify-email/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/verify-email/page.tsx)
- [user/userAuth.module.css](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/userAuth.module.css)
- [TESTING.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/TESTING.md)
- [FormWrapper.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/userForm/formWrapper/FormWrapper.tsx)
- [Form.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/userForm/form/Form.tsx)
- [Form.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/userForm/form/Form.module.css)
- [userHandler.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/user/userHandler.ts)
- [authService.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/auth/authService.ts)
- [metadata.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/metadata/metadata.ts)
- [packages/i18n/metadata.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/metadata.ts)
- [FRONTEND_INTEGRATION.md](/home/heriberto/Escritorio/Backend/havenova-backend/src/core/auth/FRONTEND_INTEGRATION.md)
- `packages/i18n/{de,en,es}/{pages,popups,loadings}.json`

## Estado General

La ruta `(auth)` ya no está en un estado inicial. Tiene un shell compartido, un patrón visual bastante consistente y formularios reutilizables que cubren los casos principales:

- `login`
- `register`
- `forgot-password`
- `set-password`
- `verify-email`

Lo que falta ahora no es rehacer la ruta desde cero, sino cerrar deuda concreta en cuatro frentes:

1. endurecer el contrato funcional de errores y transiciones
2. alinear el frontend con el contrato real del backend auth
3. limpiar deuda de accesibilidad y semántica del formulario compartido
4. estabilizar el layout responsive y el consumo de i18n para despliegue

## Flujos Esperados

### Register

1. El usuario completa email, password, language y TOS.
2. El frontend envía `POST /api/auth/register`.
3. Si responde `USER_REGISTER_SUCCESS`, no se crea sesión.
4. El frontend guarda el email necesario para continuidad del flujo.
5. Se muestra success y la continuación lleva a `/user/verify-email`.

Notas:

- no se debe asumir login automático
- el objetivo del success es empujar al usuario al flujo de verificación

### Login

1. El usuario completa email y password.
2. El frontend envía `POST /api/auth/login`.
3. Si responde `USER_LOGIN_SUCCESS`, el backend crea cookies de sesión.
4. El frontend persiste el estado derivado del payload `user`.
5. Se muestra success con lectura corta y luego redirección automática a home.

Caso especial:

- si responde `USER_LOGIN_EMAIL_NOT_VERIFIED`, el frontend deriva a `/user/verify-email`

### Verify Email

1. La página recibe `token` desde la URL.
2. El frontend envía `POST /api/auth/verify-email`.
3. Si responde success con `magicToken`, continúa automáticamente con `POST /api/auth/magic-login`.
4. Después refresca auth state.
5. Muestra success final con timeout corto y redirección automática a home.

Fallback defensivo actual:

- si `verify-email` responde success sin `magicToken`, el frontend trata el caso como verify success y deriva a login manual
- este fallback existe para robustez, pero no debe ser el camino normal del contrato

### Forgot Password

1. El usuario envía email, language y clientId.
2. El frontend llama `POST /api/auth/forgot-password`.
3. Si responde `USER_FORGOT_PASSWORD_EMAIL_SENT`, se muestra success.
4. La continuación esperada lleva a `/user/login`.

Nota:

- la respuesta es ambigua por diseño y no debe exponer si el usuario existe o no

### Set Password

1. La página recibe `token` desde la URL.
2. El usuario define nueva contraseña.
3. El frontend envía `POST /api/auth/reset-password-confirm`.
4. Si responde `USER_RESET_PASSWORD_SUCCESS`, se muestra success.
5. La continuación esperada lleva a `/user/login`.

Nota:

- esta ruta pública usa `token`; `inviteToken` no aplica aquí

### Resend Verification

1. El usuario reenvía email, language y clientId desde `/user/verify-email`.
2. El frontend llama `POST /api/auth/resend-verification`.
3. Si responde `USER_VERIFY_EMAIL_RESENT`, se muestra success.

Nota:

- la respuesta es ambigua por diseño y no debe revelar estado interno del usuario

## Qué Ya Está Mejor Que En La Auditoría Anterior

- Existe un layout compartido en [`layout.tsx`](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/layout.tsx) con shell visual común.
- Todas las páginas auth principales usan `section`, `header` y `footer`.
- Los títulos visibles ya usan ids estáticos y evitamos depender del texto traducido como id.
- `register` ya toma su loading desde `texts.loadings`.
- el cliente HTTP ya envía `credentials: include`, `x-csrf-token` y `x-frontend-origin` para las rutas auth que lo requieren.
- Cada subruta auth tiene `generateMetadata(...)` conectado con `getPageMetadata(...)`.
- `register` ya continúa al flujo de verificación y dejó de cerrar en home como success genérico.
- `login` y `magic-login` ya usan success con redirección automática a home tras un timeout corto.
- `FormWrapper` ya no depende de `useAuth`, `useClient`, `useRouter` ni `useLang`.
- `verify-email`, `forgot-password` y `set-password` ya distinguen mejor varios códigos canónicos del backend y usan estados HTTP más coherentes.

Conclusión:

- el `README` anterior seguía reportando como abiertos varios problemas que ya fueron corregidos
- la deuda real actual es más específica y más cercana a producción

## Problemas Detectados

### 1. El shell auth está unificado, pero la estructura visual sigue incompleta

Archivos:

- [layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/layout.tsx)
- [userAuth.module.css](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/userAuth.module.css)

Estado actual:

- el layout sólo aporta `main` + wrapper visual
- el contenido introductorio sigue definido página por página
- existe `.logoImage` en CSS, pero ninguna página de la ruta la usa hoy

Riesgo:

- el diseño parece consistente, pero la intención del layout todavía no está codificada como patrón reusable
- es fácil que una página nueva rompa el sistema visual sin que el layout la contenga

### 2. Hay un problema responsive real en mobile pequeño

Archivo:

- [userAuth.module.css](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/userAuth.module.css)

Hallazgo:

- en `max-width: 425px`, `.authSection` pasa a `padding: 0` y `min-height: 100dvh`
- el `header` mantiene `padding-top: 64px`
- el wrapper externo también reduce padding

Riesgo:

- en pantallas chicas la card puede quedar demasiado pegada a bordes laterales e inferior
- la jerarquía visual depende demasiado del `header` y no del contenedor principal
- es un punto probable de regresión visual durante la refactorización de estilos

### 3. `FormWrapper` mejoró, pero aún falta endurecer su contrato presentacional

Archivo:

- [FormWrapper.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/userForm/formWrapper/FormWrapper.tsx)

Estado actual:

- ya no consume contexto de auth/client/router
- ya no resuelve navegación por sí mismo
- ya no completa automáticamente `email`, `clientId` y `language`
- recibe `initialValues` y callbacks desde cada página

Deuda restante:

- sigue mezclando manejo de estado, validación y render en una sola pieza
- el reseteo basado en `initialValues` aún depende de comparación por serialización
- todavía no existe una división clara entre `AuthFormView` y lógica de estado si quisiéramos testear granularmente

Riesgo de despliegue:

- bajo, pero sigue siendo una pieza central de formularios auth y conviene estabilizarla antes del testing manual final

### 4. Hay detalles concretos de accesibilidad pendientes en el formulario

Archivo:

- [Form.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/userForm/form/Form.tsx)

Problemas detectados:

- el toggle de contraseña ya declara `aria-controls` sobre `#password`
- los mensajes inline usan `role="status"` incluso cuando son errores de validación; conviene revisar si un patrón con `aria-live` más específico sería más claro
- el checkbox de TOS sólo enlaza `aria-describedby` al error y no tiene slot semántico para ayuda o contexto legal adicional
- la UI del checkbox oculta el input real con `opacity: 0` y `pointer-events: none`; funciona, pero merece prueba manual de foco y navegación por teclado

### 5. La ruta usa convenciones mezcladas para loadings y popups

Archivos:

- [user/login/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/login/page.tsx)
- [user/register/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/register/page.tsx)
- [user/forgot-password/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/forgot-password/page.tsx)
- [user/set-password/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/set-password/page.tsx)
- [user/verify-email/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/verify-email/page.tsx)
- [userHandler.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/user/userHandler.ts)

Estado actual:

- `register` usa `texts.loadings?.loading?.REGISTER_LOADING_SUBMIT`
- `login` y `verify-email` usan `texts.loadings?.message`
- `forgot-password`, `set-password` y partes de `userHandler.ts` siguen resolviendo `GLOBAL_LOADING` vía `popups`

Impacto:

- no hay una convención única para estados intermedios
- el mismo tipo de feedback visual se arma desde fuentes distintas
- eso complica el pulido visual y la coherencia de copy

### 6. El frontend está mucho más alineado con el contrato actual del backend, pero todavía no está completamente cerrado

Referencia principal:

- [FRONTEND_INTEGRATION.md](/home/heriberto/Escritorio/Backend/havenova-backend/src/core/auth/FRONTEND_INTEGRATION.md)

Desajustes detectados:

- `register` ya entra al flujo de verify-email, pero todavía convive con algunos fallbacks de error genéricos en respuestas no esperadas.
- `login` ya usa los códigos canónicos del backend como camino principal.
- `verify-email` ya distingue `AUTH_VERIFY_EMAIL_TOKEN_INVALID`, `AUTH_VERIFY_EMAIL_TOKEN_EXPIRED`, `MAGIC_TOKEN_INVALID` y `MAGIC_TOKEN_EXPIRED`, pero aún conserva compatibilidad defensiva con claves legacy de verify dentro del helper compartido.
- `set-password` queda explícitamente limitado a `token` en esta ruta pública de usuario; `inviteToken` no aplica aquí.
- `forgot-password` y `resend-verification` siguen siendo respuestas ambiguas por diseño y eso ya está más alineado con backend, pero debe comprobarse en testing con logs.

Impacto:

- el frontend puede dar una UX válida pero desalineada con el contrato oficial
- varios fallos actuales parecen de UI, pero en realidad son deuda de integración
- sin alinear códigos y paths de success, el testing manual produciría ruido innecesario

### 7. Sigue habiendo algo de fallback a `GLOBAL_INTERNAL_ERROR`, pero ya está más acotado

Archivos principales:

- [user/login/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/login/page.tsx)
- [user/register/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/register/page.tsx)
- [user/forgot-password/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/forgot-password/page.tsx)
- [user/set-password/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/set-password/page.tsx)
- [userHandler.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/user/userHandler.ts)

Problemas:

- ya se corrigieron varios casos locales y recuperables para usar `defaultKey` contextual
- todavía quedan algunos `catch` y ramas realmente no esperadas que caen en `GLOBAL_INTERNAL_ERROR`
- el criterio de cuándo reintentar, cuándo redirigir y cuándo cerrar ya es más coherente, pero aún no está completamente unificado entre páginas

Impacto:

- peor UX
- menor capacidad de diagnóstico
- más riesgo de enmascarar un problema real antes del despliegue

### 8. `verify-email` sigue siendo el flujo más frágil

Archivos:

- [user/verify-email/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/verify-email/page.tsx)
- [userHandler.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/user/userHandler.ts)

Estado actual:

- mejoró respecto a la versión anterior
- la contradicción principal entre página y helper ya fue corregida

Problemas que siguen:

- el flujo sigue encadenando `verify -> magic login -> refresh auth -> success`
- cada etapa usa popups y loadings propios
- si falla `magicLogin`, el usuario no ve con claridad en qué paso se rompió el proceso
- `didRunRef` evita dobles ejecuciones en dev, pero mantiene complejidad accidental en el efecto
- el success final ya se automatizó mejor, pero el flujo sigue mezclando automatización, fallback defensivo y formulario de resend dentro de la misma página
- según el contrato actual del backend, `success` debería incluir `magicToken`; el fallback sin token debe quedar como defensa excepcional, no como camino normal del flujo

Conclusión:

- ya no es un bug obvio de contrato como antes
- sigue siendo el flujo con mayor densidad de estados y con más riesgo de regresión
- además concentra el punto de mayor sensibilidad entre contrato backend, sesión y UX

### 9. Hay claves i18n duplicadas o legacy

Hallazgos:

- las claves legacy de auth ya fueron retiradas de la lógica activa y de `popups.json`
- las claves canónicas de verify quedaron consolidadas en `AUTH_VERIFY_EMAIL_TOKEN_EXPIRED` y `AUTH_VERIFY_EMAIL_TOKEN_INVALID`

Impacto:

- ruido en el contrato i18n
- mayor probabilidad de fallback incorrecto
- deuda innecesaria antes de despliegue

### 10. Metadata está conectada, pero sin validación

Archivos:

- [packages/utils/metadata/metadata.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/metadata/metadata.ts)
- [packages/i18n/metadata.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/metadata.ts)
- `user/*/layout.tsx`

Estado actual:

- todas las páginas auth revisadas tienen `generateMetadata(...)`
- `getPageMetadata(...)` devuelve fallback al idioma o `{}` si no encuentra la key

Riesgo:

- si una key desaparece o se renombra, la página no falla
- eso es cómodo en desarrollo, pero malo para detectar regresiones de SEO antes de producción

## Errores y Riesgos Prioritarios

Estos son los puntos que hoy sí deberían considerarse bloqueantes o casi bloqueantes para dejar la ruta lista para despliegue:

1. `verify-email` sigue siendo el flujo con mayor densidad técnica y mayor riesgo de regresión.
2. El sistema de errores todavía depende de `GLOBAL_INTERNAL_ERROR` en algunas ramas no esperadas.
3. La estrategia de loadings sigue fragmentada entre `loadings.json` y `popups.json`.
4. Aún queda limpieza de i18n/códigos legacy para cerrar la alineación total con backend.
5. Hay deuda responsive real en mobile pequeño que todavía no está cerrada.

## Estado de Preparación para Despliegue

Situación actual:

- la ruta está funcional
- visualmente ya tiene una base más consistente
- todavía no la consideraría cerrada para despliegue sin una pasada adicional de hardening

Lo mínimo razonable antes de marcarla como lista:

- cerrar la limpieza técnica residual de errores e i18n
- documentar el flujo final esperado de cada pantalla auth y sus transiciones
- cerrar el flujo `verify-email`
- normalizar errores, códigos y loading states
- hacer una validación manual visual en desktop y mobile
- limpiar claves i18n legacy que afecten esta ruta

## Plan de Trabajo Propuesto

### Fase 1. Alineación de contrato con backend

- [x] revisar `login`, `register`, `forgot-password`, `set-password` y `verify-email` contra [FRONTEND_INTEGRATION.md](/home/heriberto/Escritorio/Backend/havenova-backend/src/core/auth/FRONTEND_INTEGRATION.md)
- [x] sustituir ramas legacy por los códigos canónicos del backend en la lógica activa de la ruta:
  - `AUTH_INVALID_CREDENTIALS`
  - `CLIENT_NOT_FOUND`
  - `USER_CLIENT_NOT_FOUND`
  - `USER_EMAIL_ALREADY_IN_USE`
  - `AUTH_VERIFY_EMAIL_TOKEN_INVALID`
  - `AUTH_VERIFY_EMAIL_TOKEN_EXPIRED`
  - `MAGIC_TOKEN_INVALID`
  - `MAGIC_TOKEN_EXPIRED`
- [x] mantener `set-password` limitado a `token` en esta ruta pública de usuario; `inviteToken` no aplica aquí y debe resolverse en los flujos de workers/dashboard
- [x] documentar por flujo:
  - request esperado
  - success code esperado
  - error codes esperados
  - comportamiento ambiguo permitido
  - unexpected error path

### Fase 1.1. Documentación operativa de la ruta

- [x] documentar el flujo final esperado de cada pantalla auth dentro de este `README`:
  - `register`
  - `login`
  - `verify-email`
  - `forgot-password`
  - `set-password`
- [x] dejar explícitas las transiciones entre páginas:
  - `register -> verify-email`
  - `login(email not verified) -> verify-email`
  - `verify-email(success) -> home`
  - `forgot-password(success) -> login`
  - `set-password(success) -> login`
- [x] registrar qué partes del flujo son automáticas y cuáles requieren interacción del usuario
- [x] alinear esa documentación con el comportamiento real de alerts, redirects y loadings antes de empezar los ajustes visuales

### Fase 2. Corrección funcional de flujos auth

- [x] rehacer el post-success de `register` para que cierre en estado "revisa tu email" y no como navegación genérica a home
- [ ] simplificar `verify-email` para que trate `magicToken` como camino normal del success y deje el fallback sin token sólo como defensa excepcional
- [ ] diferenciar visual y funcionalmente:
  - verify success
  - magic login success
  - magic login failed
  - resend verification success
- [x] convertir el success final de `magic-login` en un cierre automático con timeout corto y redirección a home, evitando el patrón actual de dos CTAs
- [~] eliminar fallback a `GLOBAL_INTERNAL_ERROR` en validaciones locales y casos recuperables:
  - `login`, `register`, `forgot-password` y `set-password` ya usan más `defaultKey` contextuales
  - `verify-email` y `resend-verification` ya acotaron mejor sus `catch`
  - quedan sólo ramas realmente inesperadas y la futura limpieza de claves legacy en i18n
- [~] asegurar que `forgot-password` y `resend-verification` mantengan UX deliberadamente ambigua

### Fase 3. Refactor del formulario compartido

- [x] mover `email`, `clientId` y `language` al contenedor de cada página
- [x] sacar la navegación a `forgot-password` del wrapper o volverla completamente inyectable
- [~] dejar `FormWrapper` limitado a:
  - estado del formulario
  - validación
  - rendering

### Fase 4. Refactor de estilos auth

- ajustar spacing del shell para mobile pequeño
- revisar padding vertical del `header`
- convertir la nomenclatura CSS a intención de layout más explícita
- validar el comportamiento visual de footer y CTAs secundarias

### Fase 5. Accesibilidad

- revisar foco y lectura del checkbox TOS con teclado
- añadir `aria-controls` al toggle de contraseña
- revisar patrón de anuncios inline para errores y hints
- confirmar landmark y orden de lectura de todas las páginas auth

### Fase 6. i18n y metadata

- limpiar claves legacy duplicadas
- retirar o migrar códigos desalineados con el backend actual
- consolidar la fuente oficial de textos de loading auth
- validar que cada página auth tenga metadata existente y completa

### Fase 7. Verificación manual previa a despliegue

- ejecutar la batería descrita en [TESTING.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/TESTING.md)
- revisar logs del backend en paralelo a cada caso para confirmar que UI, redirecciones y códigos coinciden con el contrato real
- registrar evidencia de:
  - desktop
  - mobile
  - cold load
  - register
  - login
  - verify email
  - forgot password
  - reset password

## Orden Recomendado para la Próxima Iteración

1. Cerrar la limpieza técnica residual de `verify-email`, `resend-verification` e i18n legacy.
2. Ajustar estilos del shell auth y responsive.
3. Cerrar accesibilidad, metadata y detalles semánticos finales.
4. Ejecutar validación manual completa con revisión de logs backend.

## Decisión

La ruta `(auth)` ya está en una fase de consolidación, no de reconstrucción. Pero el siguiente paso ya no puede ser sólo visual: antes de entrar en tests manuales hay que cerrar la alineación con el contrato actual del backend, porque hoy los mayores riesgos de despliegue están en la frontera entre integración auth, UX de flujos públicos y manejo de errores.
