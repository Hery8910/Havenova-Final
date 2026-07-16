# Dashboard Auth Session Architecture

## Objetivo

Dejar por escrito el contrato real de autenticacion del dashboard, los errores que aparecieron durante la integracion y las decisiones tecnicas que quedan fijadas para evitar nuevos parches aislados.

Este documento debe leerse antes de tocar:

- `apps/dashboard/middleware.ts`
- `apps/dashboard/app/[lang]/(app)/layout.tsx`
- `packages/contexts/auth/authContext.tsx`
- rutas BFF bajo `/api/auth/*`

## Problemas Reales Que Detectamos

### 1. El CSRF vive en memoria del browser

Contrato backend actual:

- `x-csrf-token` se emite en `login`, `me`, `magic-login` y `refresh-token`
- frontend debe capturarlo y reenviarlo en `refresh-token`, `logout` y otras rutas CSRF-protected
- el token no debe depender de `document.cookie` como fuente principal

Consecuencia:

- cuando Fast Refresh hace full reload o el browser recarga por completo, el token en memoria puede perderse
- si además `GET /api/auth/me` ya no puede validar el `accessToken`, el refresh puede quedar bloqueado por falta de header

### 2. El dashboard estaba abortando refresh demasiado pronto

Error anterior:

- `AuthContext` cancelaba `refresh-token` si `getCsrfToken()` en memoria venia vacio

Por que era incorrecto como solucion final:

- el dashboard ya opera sobre un BFF same-origin
- el contrato real de backend ya no entrega `csrfToken` como cookie de frontend
- por tanto, perder memoria del browser no siempre implica que la sesion sea irrecuperable
- la via correcta es reemitir `x-csrf-token` desde backend y luego refrescar

Decision:

- `AuthContext` debe seguir intentando `refresh-token` aun sin CSRF en memoria
- el fallo terminal solo ocurre si la secuencia completa de recuperacion realmente falla
- la politica final ya no debe depender de reconstruir CSRF desde cookies
- la recuperacion correcta pasa por `GET /api/auth/csrf` antes de `refresh-token`

### 3. El guard SSR del layout no podia rescatar la sesion

Error estructural:

- `apps/dashboard/app/[lang]/(app)/layout.tsx` consultaba `getServerAuthUser()`
- `getServerAuthUser()` hacia solo `GET /api/auth/me`
- si `accessToken` habia expirado, el layout redirigia al login antes de que el cliente pudiera recuperarse

Por que no bastaba arreglar el layout:

- un server component puede leer cookies, pero no es la mejor capa para rotarlas y reemitirlas al navegador
- si el refresh ocurre ahi sin propagar `Set-Cookie`, el SSR de ese request puede mejorar, pero el browser seguiria desalineado

Decision:

- el refresh preventivo para rutas protegidas del dashboard vive en middleware
- el layout conserva su responsabilidad de autorizacion SSR, pero ya recibe un request saneado cuando la sesion era recuperable

## Arquitectura Fijada

## Capas Y Responsabilidades

### 1. Middleware

Archivo:

- `apps/dashboard/middleware.ts`

Responsabilidad:

- resolver idioma cuando falta el prefijo locale
- detectar rutas protegidas del dashboard
- consultar `GET /api/auth/me` antes de entrar al arbol SSR protegido
- si `me` responde `401/403` y existe `refreshToken`, pedir `GET /api/auth/csrf`
- con ese header, intentar `POST /api/auth/refresh-token`
- aplicar los `Set-Cookie` de backend a la respuesta del navegador
- reenviar el request interno con cookies actualizadas y `x-csrf-token` vigente para que el layout SSR vea la sesion ya restaurada

Regla:

- el middleware no decide permisos de negocio finos
- solo intenta rescatar sesion antes del render protegido

### 2. Layout protegido del dashboard

Archivo:

- `apps/dashboard/app/[lang]/(app)/layout.tsx`

Responsabilidad:

- cargar `auth` del lado servidor
- comprobar acceso con `hasDashboardAccess(auth)`
- redirigir a login cuando no hay una sesion valida ya resuelta

Regla:

- el layout no debe convertirse en una segunda implementacion de refresh de cookies

### 3. AuthProvider del cliente

Archivo:

- `packages/contexts/auth/authContext.tsx`

Responsabilidad:

- mantener auth local
- sincronizar `GET /api/auth/me`
- ejecutar `refresh-token` cuando una llamada autenticada falla por `401/403`
- degradar a guest solo ante fallo terminal real

Decisiones fijadas:

- si falta CSRF en memoria, primero debe intentarse `GET /api/auth/csrf`
- cuando `disableUnauthenticatedBootstrap` esta activo, no se debe revalidar agresivamente una sesion solo desde storage en cada remount
- se usan cooldowns para evitar tormentas de bootstrap despues de fallos `401` consecutivos

## Flujo Correcto En Desarrollo

### Caso A. Fast Refresh menor

- no hay full reload
- el estado del browser puede mantenerse
- no deberia haber redireccion al login

### Caso B. Fast Refresh con full reload

- se pierde CSRF en memoria
- el middleware intenta `GET /api/auth/me`
- si `accessToken` sigue valido, el request entra normal
- si `accessToken` expiro y `refreshToken` sigue valido, el middleware pide `GET /api/auth/csrf`, refresca y reemite cookies
- el layout SSR ya no debe redirigir por ese motivo

### Caso C. Sesion realmente expirada

- `me` falla
- `refresh-token` falla
- el request sigue al layout sin sesion valida
- el layout redirige a login
- el cliente no debe entrar en loop de `/api/auth/me`

## Reglas Para Cambios Futuros

1. No volver a introducir guards basados solo en memoria del browser si el BFF ya tiene una fuente same-origin mas fiable.
2. No mover el refresh preventivo al layout SSR salvo que tambien exista una estrategia clara para propagar cookies al navegador.
3. No hacer fetch de auth desde componentes presentacionales del shell.
4. Cualquier cambio en auth debe validar el flujo completo:
   - carga en ruta protegida
   - login
   - full reload
   - access expirado con refresh valido
   - refresh expirado
5. Si reaparece una tormenta de `/api/auth/me`, revisar primero:
   - remounts de `AuthProvider`
   - efectos con `refreshAuth()`
   - providers de complemento como `AdminProvider`
   - redirects de login y shell

## Incidentes Que Ya Quedan Resueltos

### Loop `GET /api/auth/me` despues de login

Causa principal:

- bootstrap excesivo del `AuthProvider` en layouts que debian ser pasivos

Correccion:

- `disableUnauthenticatedBootstrap` ahora evita la revalidacion inmediata desde storage

### Redireccion al login tras full reload aun con refresh disponible

Causa principal:

- el layout SSR decidia demasiado pronto y no existia refresh preventivo server-side con propagacion de cookies

Correccion:

- middleware de dashboard intenta restaurar sesion antes del arbol SSR protegido

Resultado verificado:

- reload real en `/en/people/users` mantiene acceso
- navegacion interna del dashboard ya no dispara expulsion al login por ese motivo

### Fallo al refrescar tras perder el CSRF en memoria

Causa principal:

- `AuthContext` asumia que sin CSRF en memoria no existia forma valida de refrescar
- el contrato global tampoco tenia una reemision dedicada de CSRF para cubrir ese hueco

Correccion:

- se permite el refresh apoyandose en la reemision dedicada `GET /api/auth/csrf` antes de `refresh-token`

Estado final de esta linea:

- el ajuste frontend evita abortar demasiado pronto
- cierra la politica de recuperacion sobre el contrato real de header
- la referencia contractual esta en [AUTH_CSRF_SESSION_RECOVERY_DECISION.md](/home/heriberto/Escritorio/Havenova/havenova/docs/AUTH_CSRF_SESSION_RECOVERY_DECISION.md:1)

### Ping-pong `/en/user/login <-> /en`

Causa principal:

- la pagina de login redirigia a `/` solo porque `AuthProvider` traia una sesion local desde `storage`
- el layout SSR del dashboard no necesariamente aceptaba esa sesion local como sesion servidor vigente
- eso producia un redirect de ida y vuelta entre login y dashboard

Correccion:

- la pagina de login solo puede auto-redirigir al dashboard cuando `useAuth()` reporta `source === 'server'`
- el estado local por si solo ya no se considera suficiente para saltar fuera de login

### Flash de tema `dark -> light -> dark` tras reload

Causa principal:

- la sesion estaba bien
- el `AdminProvider` montaba primero un `createLocalDefault()` con `theme: 'light'`
- luego `GET /api/home-services/admin` recuperaba el admin real con `theme: 'dark'`
- ese desfase provocaba el flash visual aunque la autenticacion siguiera intacta

Correccion:

- `AdminProvider.createLocalDefault()` ahora toma `theme` y `language` persistidos del navegador cuando todavia no existe un complemento admin remoto hidratado
- con eso el primer render cliente queda alineado con el estado visual persistido del usuario

Interpretacion importante:

- este flash ya no se trata como incidente de auth
- pertenece a la capa de hidratacion visual del complemento de sesion

## Checklist De Debug

Si vuelve a aparecer un problema de auth, revisar en este orden:

1. `POST /api/auth/login`
   - debe devolver `200`
   - debe emitir `x-csrf-token`
   - debe setear `accessToken` y `refreshToken`

2. `GET /api/auth/me`
   - debe devolver `200` cuando la sesion esta viva
   - debe volver a emitir `x-csrf-token`

3. Middleware en ruta protegida
   - si `me` falla con `401/403`, debe pedir `GET /api/auth/csrf`
   - luego debe intentar `refresh-token`
   - debe propagar cookies al browser

4. `POST /api/auth/refresh-token`
   - debe recibir `x-csrf-token`
   - debe rotar `refreshToken`
   - debe emitir nuevo `x-csrf-token`

5. `AuthProvider`
   - no debe disparar rebootstrap infinito
   - no debe degradar a guest solo porque falte CSRF en memoria
