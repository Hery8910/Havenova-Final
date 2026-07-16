# Set Password Flow

## Objetivo

Registrar los estados visibles del flujo de `set-password`, con foco en `Alert`, salidas de usuario y navegación.

Fuente:

- [page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/set-password/page.tsx:1)

## Secuencia base

1. La ruta lee `token`, `status`, `code` y `http` desde query string.
2. Hay dos entradas de error previas al submit:
   - no hay `token`
   - `status=error` viene ya serializado en la URL
3. Si el usuario envía password válida, se abre `showLoading`.
4. Se ejecuta `resetPassword({ token, newPassword })`.
5. El flujo termina en success o error final.

## Casos

### 1. Ruta abierta sin `token`

- Alerta: `showError`
- Estado HTTP visible: `400`
- CTA:
  - `cancelLabel = goToHome`
- Salida:
  - `cancel` navega a `/`
- Render:
  - no se muestra el formulario de nueva contraseña

### 2. Ruta abierta con `status=error`

- Alerta: `showError`
- Estado HTTP visible:
  - `http`
  - o `400`
- CTA:
  - `confirmLabel = requestNewLink`
  - `cancelLabel = goToHome`
- Salida:
  - `confirm` navega a `/user/forgot-password`
  - `cancel` navega a `/`
- Render:
  - no se muestra el formulario de nueva contraseña
- Copy:
  - el mensaje de enlace inválido o caducado ya sale de `pages.client.user.resetPasswordText.linkErrors.invalidOrExpired`

### 3. Submit sin `token`

- Alerta: `showError`
- Estado HTTP visible: `400`
- CTA:
  - `confirmLabel = requestNewLink`
  - `cancelLabel = goToHome`
- Salida:
  - `confirm` navega a `/user/forgot-password`
  - `cancel` navega a `/`
- Copy:
  - el mensaje de enlace incompleto ya sale de `pages.client.user.resetPasswordText.linkErrors.missingToken`

### 4. `USER_RESET_PASSWORD_SUCCESS`

- Alerta: `showSuccess`
- Estado HTTP visible: `200`
- CTA:
  - `confirmLabel = goToLogin`
- Salida:
  - `confirm` navega a `/user/login`

### 5. `USER_RESET_PASSWORD_INVALID_TOKEN`

- Alerta: `showError`
- Estado HTTP visible: `400`
- CTA:
  - `confirmLabel = requestNewLink`
  - `cancelLabel = close`
- Salida:
  - `confirm` navega a `/user/forgot-password`
  - `cancel` cierra el alert

### 6. `USER_RESET_PASSWORD_TOKEN_EXPIRED`

- Alerta: `showError`
- Estado HTTP visible: `400`
- CTA:
  - `confirmLabel = requestNewLink`
  - `cancelLabel = close`
- Salida:
  - `confirm` navega a `/user/forgot-password`
  - `cancel` cierra el alert

### 7. `AUTH_BLOCKED` o `USER_CLIENT_BLOCKED`

- Alerta: `showError`
- Estado HTTP visible: `403`
- CTA:
  - `cancelLabel = close`
- Salida:
  - cierra el alert

### 8. `AUTH_USER_NOT_FOUND` o `USER_CLIENT_NOT_FOUND`

- Alerta: `showError`
- Estado HTTP visible: `404`
- CTA:
  - `cancelLabel = close`
- Salida:
  - cierra el alert

### 9. `VALIDATION_ERROR`

- Alerta: `showError`
- Estado HTTP visible: `400`
- CTA:
  - `cancelLabel = close`
- Salida:
  - cierra el alert

### 10. Error técnico (`catch`, sin código o `>= 500`)

- Alerta: `showError`
- Estado HTTP visible:
  - `err.response.status`
  - o `500`
- CTA:
  - `confirmLabel = reload`
  - `cancelLabel = close`
- Salida:
  - `confirm` reintenta `handleResetPassword(data)`
  - `cancel` cierra el alert

## Observaciones

- Esta página tiene entradas de error antes de cualquier submit real.
- A diferencia de `register` o `login`, aquí el token de URL condiciona completamente el flujo.
- la navegación de CTAs (`requestNewLink`, `goToHome`, `goToLogin`, `reload`) ya quedó alineada con la utilidad shared de acciones auth, sin cambiar el comportamiento visible del flujo

## Intención visible de las salidas

- error de enlace (`sin token`, `status=error`, `invalid token`, `expired token`): explicar que el enlace ya no sirve y empujar a pedir uno nuevo o salir a ruta segura
- `loading`: comunicar actualización de credencial, no creación de sesión
- `USER_RESET_PASSWORD_SUCCESS`: confirmar cambio de contraseña y enviar a `login` como siguiente paso único
- `blocked`, `not found` y `validation`: frenar el flujo sin prometer recuperación automática
- error técnico: permitir retry sin exponer detalle de backend
