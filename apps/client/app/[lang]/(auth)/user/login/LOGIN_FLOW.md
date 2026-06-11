# Login Flow

## Objetivo

Registrar los estados visibles del flujo de `login`, con foco en `Alert`, salidas de usuario y navegación.

Fuente:

- [page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/login/page.tsx:1)

## Secuencia base

1. El usuario envía `email`, `password` y `clientId`.
2. Se abre `showLoading` con `loadingText.login`.
3. Se ejecuta `loginUser(payload)`.
4. Según la respuesta, el flujo cae en success, error funcional o error técnico.

## Casos

### 1. `CLIENT_MISSING_CLIENT_ID`

- Alerta: `showError`
- Estado HTTP visible: `400`
- CTA:
  - `cancelLabel = close`
- Salida:
  - cierra el alert
  - permanece en la página

### 2. `USER_LOGIN_EMAIL_NOT_VERIFIED`

- Alerta: `showError`
- Estado HTTP visible: `403`
- Efecto previo:
  - persiste estado auth no autenticado con `email` y `clientId`
- CTA:
  - `confirmLabel = openVerification`
  - `cancelLabel = close`
- Salida:
  - `confirm` navega a `/user/verify-email`
  - `cancel` cierra el alert y permanece en la página

### 3. `USER_CLIENT_NOT_FOUND`

- Alerta: `showError`
- Estado HTTP visible: `404`
- CTA:
  - `confirmLabel = goToRegister`
  - `cancelLabel = close`
- Salida:
  - `confirm` navega a `/user/register`
  - `cancel` cierra el alert

### 4. `CLIENT_NOT_FOUND`

- Alerta: `showError`
- Estado HTTP visible: `404`
- CTA:
  - `confirmLabel = goToHome`
  - `cancelLabel = close`
- Salida:
  - `confirm` navega a `/`
  - `cancel` cierra el alert

### 5. Error funcional sin `user`

Códigos previstos:

- `AUTH_INVALID_CREDENTIALS`
- `AUTH_BLOCKED`
- `USER_CLIENT_BLOCKED`
- cualquier otro mapeado por `getLoginPopupDefaultKey`

- Alerta: `showError`
- Estado HTTP visible:
  - `400` por defecto
  - `failureAction.status` si aplica
- CTA:
  - normalmente solo `cancelLabel = close`
  - si no hay código y se considera retry técnico, `confirmLabel = reload`
- Salida:
  - retry técnico vuelve a ejecutar `handleLogin(payload)`
  - en el resto de casos, cerrar alert y permanecer en la página

### 6. Success `USER_LOGIN_SUCCESS`

- Alerta: `showSuccess`
- Estado HTTP visible: `200`
- Efecto previo:
  - persiste sesión con `setAuth`
- CTA:
  - sin CTA explícito de confirmación
- Salida:
  - redirect automático a `/` tras `AUTO_REDIRECT_MS = 4000`
  - al expirar el timeout se cierra el alert
- Copy:
  - la descripción del auto-redirect ya sale de `pages.client.user.login.autoRedirectDescription`

### 7. Error técnico en `catch`

- Alerta: `showError`
- Estado HTTP visible:
  - `err.response.status`
  - o `500`
- CTA:
  - `goToRegister` si `USER_CLIENT_NOT_FOUND`
  - `goToHome` si `CLIENT_NOT_FOUND`
  - `reload` si no hay código o si el status es `>= 500`
  - `close` como cancel
- Salida:
  - retry vuelve a ejecutar `handleLogin(payload)`
  - register/home navegan según el caso
  - cancel cierra el alert

## Observaciones

- El flujo es simple: `loading -> success final` o `loading -> error final`.
- No hay success intermedio.
- El caso más sensible de continuidad es `USER_LOGIN_EMAIL_NOT_VERIFIED`, porque deriva a otro flujo público.
- la navegación de CTAs (`openVerification`, `goToRegister`, `goToHome`, `reload`, `close`) ya quedó alineada con las utilidades shared de acciones auth y auto-redirect, sin mover el mapeo local de códigos que sigue ayudando a leer este flujo
