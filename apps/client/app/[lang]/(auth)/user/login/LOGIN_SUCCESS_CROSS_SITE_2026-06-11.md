# Evidencia: Login, Sesión, Refresh Y Logout Cross-Site

## Fecha

- `2026-06-11`

## Objetivo

Registrar la evidencia positiva del flujo cross-site después de los cambios coordinados en backend y frontend para sesión y CSRF.

## Contexto

Entorno validado:

- frontend local: `http://localhost:3000`
- backend remoto: `https://maped-solutions-backend.onrender.com`

Contexto funcional del primer caso:

- usuario válido
- sesión inicial sin cookies útiles previas
- perfil de usuario todavía no creado en backend

## Caso 1. Login + sesión + creación inicial de perfil

Resultado manual reportado:

- `login: ok 200`
- `me: ok 200`
- `profile: ok 404`
- `profile: ok 201 Creado correctamente`

Interpretación:

1. `POST /api/auth/login` estableció sesión correctamente
2. `GET /api/auth/me` confirmó que las cookies emitidas por login ya podían reutilizarse en cross-origin
3. `GET /api/home-services/profile` devolvió `404` porque todavía no existía perfil
4. `POST /api/home-services/profile` creó el perfil correctamente

## Secuencia Observada En Render

### 1. Login exitoso

```json
{"at":"2026-06-11T11:05:07.577Z","event":"AUTH_LOGIN_SUCCESS","route":"/api/auth/login","method":"POST","outcome":"success"}
```

### 2. Confirmación de sesión con `GET /me`

```json
{"at":"2026-06-11T11:05:07.756Z","event":"AUTH_ME_FETCHED","route":"/api/auth/me","method":"GET","outcome":"success"}
```

### 3. Perfil aún no existente

```json
{"at":"2026-06-11T11:05:07.917Z","event":"PROFILE_FETCH_MISSING","reasonCode":"USER_CLIENT_PROFILE_NOT_FOUND","route":"/api/home-services/profile","method":"GET","outcome":"attempt"}
```

### 4. Creación automática del perfil

```json
{"at":"2026-06-11T11:05:08.148Z","event":"PROFILE_CREATED","route":"/api/home-services/profile","method":"POST","outcome":"success"}
```

## Caso 2. Login + sesión + logout

Resultado manual validado:

- `login: ok 200`
- `me: ok 200`
- `logout: ok 200`

Interpretación:

1. el login establece la sesión correctamente
2. `GET /api/auth/me` confirma la sesión real desde servidor
3. frontend conserva el `x-csrf-token` emitido por backend
4. `POST /api/auth/logout` reenvía correctamente el token y backend acepta el cierre de sesión

## Caso 3. Refresh forzado por expiración de access token

Resultado manual validado:

- `login: ok 200`
- `me: ok 200`
- access token expirado manualmente para la prueba
- request protegida inicial falla por expiración
- `refresh-token: ok 200`
- request protegida posterior vuelve a resolver correctamente

Interpretación:

1. el frontend detecta correctamente el fallo por token expirado
2. `POST /api/auth/refresh-token` reenvía `x-csrf-token` correcto
3. backend rota la sesión y devuelve nuevo `x-csrf-token`
4. frontend reemplaza el token en memoria
5. la request protegida se repite correctamente con la sesión restaurada

## Conclusión

El problema principal observado previamente quedó resuelto en esta corrida:

- el login ya no termina en una sesión no reutilizable
- `GET /api/auth/me` funciona inmediatamente después del login
- no aparece `AUTH_ACCESS_TOKEN_MISSING` en la primera request protegida posterior
- no fue necesario recuperar sesión con `POST /api/auth/refresh-token` en el primer caso
- `logout` ya funciona correctamente con el contrato nuevo de CSRF por header
- `refresh-token` ya funciona correctamente cuando el `accessToken` expira

Esta evidencia valida que:

- la nueva configuración de cookies cross-site en backend está funcionando para este escenario
- la confirmación de sesión agregada en frontend está alineada con el contrato real
- el contrato nuevo de `x-csrf-token` emitido por header ya funciona para `logout`
- el contrato nuevo de `x-csrf-token` emitido por header ya funciona para `refresh-token`
- los flujos `login -> me -> profile`, `login -> me -> refresh` y `login -> me -> logout` ya cuentan la historia correcta en frontend y backend

## Qué Falta Validar

Este caso no cierra todavía toda la matriz de auth. Aún conviene validar:

- segundo login del mismo usuario con perfil ya existente
- recarga de página con sesión ya creada
- `logout-all-sessions`
- `update-password`
- `change-email`
- comportamiento en otros tenants/clientes externos

## Referencias

- [page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/login/page.tsx:1)
- [LOGIN_FLOW.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/login/LOGIN_FLOW.md:1)
- [BACKEND_SESSION_REPORT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/login/BACKEND_SESSION_REPORT.md:1)
- [logs.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/login/logs.md:1)
