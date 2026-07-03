# Estado Actual: Contrato De Sesión Cross-Origin

## Estado documental

Este documento queda preservado como referencia histórica de la fase cross-origin directa.

No describe la arquitectura objetivo cerrada del producto.

La arquitectura objetivo ahora es:

- navegador -> frontend BFF -> backend

## Objetivo

Dejar documentado el estado actual de la integración de sesión `auth` después de los cambios coordinados entre backend y frontend para escenario cross-origin multicliente.

## Contexto

Escenario validado:

- frontend local: `http://localhost:3000`
- backend remoto: `https://maped-solutions-backend.onrender.com`
- autenticación por cookies `HttpOnly`
- confirmación de sesión mediante `GET /api/auth/me`

## Contrato Vigente

### Sesión

- `POST /api/auth/login` establece cookies de sesión utilizables en cross-origin
- `GET /api/auth/me` es la confirmación canónica de sesión activa
- frontend no da por exitoso el login sólo por el `200` del submit

### CSRF

- backend emite `x-csrf-token` en respuestas autenticadas clave
- frontend guarda ese valor en memoria dentro del cliente HTTP compartido
- frontend lo reenvía en rutas protegidas por CSRF

## Implementación Actual En Frontend

Puntos relevantes:

- [page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/login/page.tsx:1)
- [api.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/api/api.ts:1)
- [authContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/authContext.tsx:1)
- [ProfileContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/profile/ProfileContext.tsx:1)

Estado actual:

1. `login` ejecuta `POST /api/auth/login`
2. frontend captura `x-csrf-token` desde la respuesta
3. frontend confirma sesión con `GET /api/auth/me`
4. si `me` responde `200`, persiste auth local
5. requests CSRF-protected reutilizan el token guardado en memoria

## Evidencia Positiva Confirmada

### Caso 1. Login + sesión + creación inicial de perfil

Resultado validado:

- `login: ok 200`
- `me: ok 200`
- `profile: ok 404`
- `profile: ok 201`

Interpretación:

- sesión reutilizable correctamente en cross-origin
- primera carga protegida autenticada correctamente
- perfil inexistente tratado como caso funcional esperado

Referencia:

- [LOGIN_SUCCESS_CROSS_SITE_2026-06-11.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/login/LOGIN_SUCCESS_CROSS_SITE_2026-06-11.md:1)

### Caso 2. Login + sesión + logout

Resultado manual validado:

- `login: ok 200`
- `me: ok 200`
- `logout: ok 200`

Interpretación:

- frontend ya reenvía correctamente `x-csrf-token`
- backend acepta el token emitido por header y la sesión actual
- el flujo de cierre de sesión ya no depende de una cookie legible desde JS

### Caso 3. Expiración de access token + refresh exitoso

Resultado validado:

- login correcto
- `GET /api/auth/me` correcto
- expiración manual del `accessToken` para la prueba
- recuperación correcta vía `POST /api/auth/refresh-token`
- repetición exitosa de la request protegida

Interpretación:

- frontend ya rehidrata correctamente la sesión al expirar el access token
- backend acepta el `x-csrf-token` actual
- backend rota el token CSRF y frontend sigue operando con el valor nuevo

## Qué Ya No Describe El Sistema

Estas suposiciones ya no aplican al contrato actual:

- leer `csrfToken` desde `document.cookie` como fuente de verdad
- asumir que frontend y backend comparten origen
- dar por válido el login sin confirmación posterior por `GET /api/auth/me`

## Qué Falta Validar

La integración aún debería cubrir al menos:

- segundo login del mismo usuario con perfil ya existente
- recarga completa de la app con sesión válida
- rotación de `x-csrf-token` tras refresh
- `logout-all-sessions`
- `update-password`
- `change-email`

## Conclusión

El problema principal de sesión cross-origin quedó resuelto y el contrato actual ya está alineado entre backend y frontend para:

- `login`
- `me`
- `profile`
- `logout`
- `refresh-token`

El siguiente foco de validación ya no es “si la sesión funciona”, sino completar la matriz de rutas protegidas por CSRF y refresh.
