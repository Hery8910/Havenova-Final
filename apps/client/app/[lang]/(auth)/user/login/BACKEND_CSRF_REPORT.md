# Estado Actual: Contrato CSRF Cross-Origin

## Objetivo

Resumir el contrato CSRF vigente después de la corrección coordinada entre backend y frontend para escenario multicliente cross-origin.

## Contrato Vigente

Fuente backend:

- [FRONTEND_CSRF_HANDOFF.md](/home/heriberto/Escritorio/Backend/havenova-backend/src/core/auth/FRONTEND_CSRF_HANDOFF.md:1)

Reglas vigentes:

1. backend emite `x-csrf-token` en respuestas autenticadas clave
2. frontend lo guarda en memoria
3. frontend lo reenvía en rutas CSRF-protected
4. frontend no usa `document.cookie` como fuente de verdad del CSRF

## Respuestas Que Emiten `x-csrf-token`

- `POST /api/auth/login`
- `POST /api/auth/magic-login`
- `GET /api/auth/me`
- `POST /api/auth/refresh-token`

## Rutas Que Exigen `x-csrf-token`

- `POST /api/auth/refresh-token`
- `POST /api/auth/logout`
- `POST /api/auth/logout-all-sessions`
- `POST /api/auth/update-password`
- `POST /api/auth/change-email`

## Implementación Actual En Frontend

Fuente principal:

- [api.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/api/api.ts:1)

La lógica actual hace esto:

1. interceptor de respuesta:
   - lee `x-csrf-token`
   - reemplaza el valor en memoria

2. interceptor de request:
   - si la ruta es CSRF-protected, añade `x-csrf-token`
   - mantiene `withCredentials: true`

3. limpieza de sesión:
   - al limpiar auth local, también limpia el token CSRF en memoria

## Evidencia Positiva Actual

Resultado manual más reciente:

- `login: ok 200`
- `me: ok 200`
- `refresh-token: ok 200` tras expiración forzada de `accessToken`
- `logout: ok 200`

Eso valida que:

- frontend recibe el token desde header
- frontend lo conserva correctamente en memoria
- frontend lo reemplaza correctamente cuando backend rota el valor en `refresh-token`
- `POST /api/auth/logout` ya llega con el header esperado

## Qué Ya No Aplica

Estas ideas ya no representan el estado actual:

- “el frontend debe leer `csrfToken` desde cookie”
- “el `logout` cross-origin falla por no poder leer la cookie del backend”

Ese diagnóstico fue útil durante la transición, pero ya quedó superado por el contrato nuevo basado en header.

## Qué Conviene Validar Después

El siguiente foco de validación para CSRF debería ser:

- `logout-all-sessions`
- `update-password`
- `change-email`
- persistencia correcta del token tras reload y rehidratación vía `GET /api/auth/me`

## Conclusión

El contrato actual de CSRF ya no depende de cookies legibles por JS. El estado actual correcto es:

- CSRF emitido por backend en header
- token guardado en memoria por frontend
- token reenviado por frontend en rutas protegidas

Con esa base, `refresh-token` y `logout` ya quedaron validados correctamente.
