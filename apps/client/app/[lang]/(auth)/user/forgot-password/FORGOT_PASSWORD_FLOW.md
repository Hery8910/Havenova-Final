# Forgot Password Flow

## Objetivo

Registrar los estados visibles del flujo de `forgot-password`, con foco en `Alert`, salidas de usuario y navegación.

Fuente:

- [page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/forgot-password/page.tsx:1)

## Secuencia base

1. El usuario envía `email`, `language` y `clientId`.
2. Si falta `clientId`, el flujo cae directamente en error.
3. Si el payload es válido, se abre `showLoading`.
4. Se ejecuta `forgotPassword(payload)`.
5. Según la respuesta, se muestra success neutro o error final.

## Casos

### 1. `CLIENT_MISSING_CLIENT_ID`

- Alerta: `showError`
- Estado HTTP visible: `400`
- CTA:
  - `cancelLabel = close`
- Salida:
  - cierra el alert
  - permanece en la página

### 2. `USER_FORGOT_PASSWORD_EMAIL_SENT`

- Alerta: `showSuccess`
- Estado HTTP visible: `200`
- CTA:
  - `confirmLabel = goToLogin`
  - `cancelLabel = close`
- Salida:
  - `confirm` navega a `/user/login`
  - `cancel` cierra el alert y permanece en la página

### 3. `CLIENT_NOT_FOUND`

- Alerta: `showError`
- Estado HTTP visible: `404`
- CTA:
  - `cancelLabel = close`
- Salida:
  - cierra el alert
  - permanece en la página

### 4. `VALIDATION_ERROR`

- Alerta: `showError`
- Estado HTTP visible: `400`
- CTA:
  - `cancelLabel = close`
- Salida:
  - cierra el alert
  - permanece en la página

### 5. Error técnico (`catch`, sin código o `>= 500`)

- Alerta: `showError`
- Estado HTTP visible:
  - `err.response.status`
  - o `500`
- CTA:
  - `confirmLabel = reload`
  - `cancelLabel = close`
- Salida:
  - `confirm` reintenta `handleForgotPassword(data)`
  - `cancel` cierra el alert

## Observaciones

- El backend mantiene respuesta ambigua por diseño.
- En success no se informa si el email existe; sólo se ofrece continuidad hacia login.
- la navegación de CTAs (`goToLogin`, `reload`, `close`) ya quedó alineada con la utilidad shared de acciones auth, sin cambiar el comportamiento visible del flujo

## Intención visible de las salidas

- `loading`: comunicar envío de ayuda de acceso, no validación de identidad
- `USER_FORGOT_PASSWORD_EMAIL_SENT`: confirmar de forma neutra que el siguiente paso ocurre en email, sin revelar existencia de cuenta
- `CLIENT_MISSING_CLIENT_ID`, `CLIENT_NOT_FOUND` y `VALIDATION_ERROR`: cortar el intento por contexto incompleto o inválido y dejar retry seguro
- error técnico: dejar claro que el envío no pudo completarse ahora y permitir reintento
