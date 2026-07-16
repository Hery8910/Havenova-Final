# Auth CSRF Session Recovery Decision

## Objetivo

Dejar cerrada la decision de producto y de contrato tecnico para la recuperacion de sesion cuando:

- el `accessToken` ya no sirve
- el `refreshToken` todavia existe
- el frontend perdio el `x-csrf-token` que mantenia solo en memoria

Este documento debe servir como handoff directo para backend y como referencia para frontend/BFF.

## Problema Observado

El comportamiento real observado en desarrollo fue este:

1. `GET /api/auth/me` falla con `AUTH_ACCESS_TOKEN_MISSING`.
2. El frontend intenta `POST /api/auth/refresh-token`.
3. `refresh-token` falla con `CSRF_TOKEN_INVALID` porque falta `x-csrf-token`.
4. La app termina redirigiendo a login aunque el usuario todavia pudiera conservar una sesion recuperable por `refreshToken`.

Interpretacion:

- el problema no es la rotacion de `refreshToken`
- el problema tampoco es el BFF same-origin como arquitectura
- el hueco real del contrato es no tener una forma explicita de reemitir CSRF antes de `refresh-token`

## Decision Cerrada

No vamos a tratar la perdida del CSRF en memoria como expiracion terminal por defecto.

La politica cerrada pasa a ser:

- `GET /api/auth/me` sigue siendo la fuente de verdad para confirmar sesion
- `POST /api/auth/refresh-token` sigue siendo la unica via para renovar la sesion
- se agrega una via dedicada para reemitir CSRF cuando la sesion aun puede recuperarse pero el header ya no existe en memoria

No debemos seguir apoyando la recuperacion sobre una supuesta cookie `csrfToken`.

La decision de negocio y de contrato es:

- el CSRF se entrega por header `x-csrf-token`
- frontend lo mantiene en memoria
- si se pierde, debe reemitirse mediante `GET /api/auth/csrf`

## Contrato Backend Propuesto

### Nuevo endpoint

Backend debe exponer un endpoint dedicado para reemision de CSRF.

Forma sugerida:

- `GET /api/auth/csrf`

Alternativa aceptable si backend lo prefiere:

- `POST /api/auth/csrf/reissue`

La decision de verbo puede cerrarse en backend, pero el comportamiento esperado debe ser el mismo.

### Responsabilidad del endpoint

Este endpoint debe:

- validar que la sesion aun tenga una base recuperable por `refreshToken`
- volver a emitir `x-csrf-token` en el response header
- no marcar por si mismo la sesion como renovada
- no reemplazar `refresh-token`

Este endpoint no debe:

- devolver la sesion autenticada final como sustituto de `GET /me`
- convertirse en un login silencioso alternativo
- introducir persistencia local del CSRF fuera de cookies/header

## Secuencia Operativa Esperada

### Caso normal

1. Frontend o middleware ejecuta `GET /api/auth/me`.
2. Si responde `200`, la sesion queda confirmada.

### Caso recuperable

1. `GET /api/auth/me` responde `401/403`.
2. Si todavia existe una sesion potencialmente recuperable por `refreshToken`, frontend/BFF llama al endpoint de reemision de CSRF.
3. Backend devuelve nuevo `x-csrf-token`.
4. Frontend/BFF ejecuta `POST /api/auth/refresh-token` con ese header.
5. Si refresh responde `200`, backend rota `refreshToken`, reemite `accessToken`, `refreshToken` y un nuevo `x-csrf-token`.
6. Frontend vuelve a confirmar con `GET /api/auth/me`.

### Caso terminal

1. `GET /api/auth/me` falla.
2. La reemision de CSRF falla o `refresh-token` falla.
3. La sesion se considera cerrada.
4. La UI redirige a login sin loops ni reintentos agresivos.

## Criterio De Seguridad

La intencion de este ajuste es minima y especifica:

- recuperar el tramo CSRF del contrato actual
- no relajar la proteccion de rutas state-changing
- no mover el frontend hacia almacenamiento persistente de secretos

El backend debe seguir tratando `refresh-token` como ruta protegida por doble submit CSRF.

La diferencia es que ahora existira una forma explicita y controlada de reconstituir el header CSRF antes de pedir el refresh real.

## Impacto Esperado En Frontend

Con este contrato, frontend debe adoptar la secuencia:

- `me`
- si falla y la sesion parece recuperable: `csrf reissue`
- `refresh-token`
- `me`

No debe seguir dependiendo de:

- conservar el CSRF indefinidamente en memoria
- asumir que el CSRF pueda reconstruirse desde cookies
- forzar relogin inmediato solo porque el header ya no existe en el runtime actual

## Impacto Esperado En Middleware SSR

El middleware del dashboard ya puede rescatar la sesion a partir de `refreshToken` y una reemision dedicada de CSRF.

Con el nuevo endpoint deberia poder cubrir tambien el caso donde:

- el `accessToken` expiro
- el `refreshToken` sigue vivo
- el runtime servidor no tiene un `x-csrf-token` vigente para reenviar

Eso evita expulsiones innecesarias tras:

- full reload en desarrollo
- suspension de pestaña en mobile
- rehidratacion despues de reinicio parcial del runtime

## Criterios De Aceptacion

1. Un usuario con `refreshToken` valido no debe perder la sesion solo porque el runtime actual perdio el CSRF en memoria.
2. Un full reload en `dashboard` no debe forzar login si la sesion sigue siendo recuperable.
3. La app no debe entrar en loops `login -> dashboard -> login` por una perdida transitoria de CSRF.
4. Si `refreshToken` ya no sirve, la salida debe ser limpia y terminal hacia login.
5. Frontend no debe guardar CSRF en `localStorage` ni introducir secretos adicionales persistentes.

## Estado Actual

Decision cerrada:

- si conviene implementar esta politica ahora: si
- si el hueco real esta en backend: si
- si frontend necesita seguir agregando heuristicas locales para taparlo: no

Pendiente:

- implementacion backend del endpoint de reemision
- adaptacion posterior del BFF/frontend para usar la nueva secuencia contractual
