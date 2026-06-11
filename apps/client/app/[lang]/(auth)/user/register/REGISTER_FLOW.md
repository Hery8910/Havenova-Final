# Register Flow

## Objetivo

Registrar los estados visibles del flujo de `register`, con foco en `Alert`, salidas de usuario y navegación.

Fuente:

- [page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/register/page.tsx:1)

## Secuencia base

1. El usuario completa `email`, `password`, `language`, `clientId` y acepta TOS en el formulario.
2. Se abre `showLoading` con `REGISTER_LOADING_SUBMIT`.
3. Se construye `RegisterPayload` con `cookiePrefs`.
4. El payload envía el valor real de `tosAccepted` validado por el formulario.
5. Se ejecuta `registerUser(payload)`.
6. Si hay success, se persiste `profile.language` y después se abre success final con redirect a verify-email.

Nota operativa:

- la persistencia local de `profile.language` es best-effort
- si esa persistencia local falla, el flujo igualmente debe continuar a `verify-email` porque la cuenta ya fue creada en backend
- el success además deja un seed logged-out/pre-auth con `email`, `clientId` e `isVerified: false` para continuidad del siguiente paso

## Casos

### 1. `USER_REGISTER_SUCCESS`

- Alerta: `showSuccess`
- Estado HTTP visible: `200`
- Efecto previo:
  - persiste estado auth no autenticado con `email` y `clientId`
  - persiste `profile.language` mediante `updateProfile`
- CTA:
  - sin CTA explícito de confirmación
- Salida:
  - redirect automático a `/user/verify-email` tras `AUTO_REDIRECT_MS = 4000`
  - al expirar el timeout se cierra el alert
- Copy:
  - la descripción del auto-redirect ya sale de `pages.client.user.register.autoRedirectDescription`

### 2. `USER_REGISTER_ALREADY_REGISTERED`

- Alerta: `showError`
- Estado HTTP visible: `409`
- CTA:
  - `confirmLabel = goToLogin`
  - `cancelLabel = close`
- Salida:
  - `confirm` navega a `/user/login`
  - `cancel` cierra el alert

### 3. `USER_EMAIL_ALREADY_IN_USE`

- Alerta: `showError`
- Estado HTTP visible: `409`
- CTA:
  - `confirmLabel = goToLogin`
  - `cancelLabel = close`
- Salida:
  - `confirm` navega a `/user/login`
  - `cancel` cierra el alert y permanece en la página

### 4. `USER_REGISTER_NEEDS_CORRECT_PASSWORD`

- Alerta: `showError`
- Estado HTTP visible: `409`
- CTA:
  - `confirmLabel = resetPassword`
  - `cancelLabel = close`
- Salida:
  - `confirm` navega a `/user/forgot-password`
  - `cancel` cierra el alert

### 5. `AUTH_BLOCKED` o `USER_CLIENT_BLOCKED`

- Alerta: `showError`
- Estado HTTP visible: `403`
- CTA:
  - `cancelLabel = close`
- Salida:
  - cierra el alert
  - permanece en la página

### 6. `CLIENT_NOT_FOUND`

- Alerta: `showError`
- Estado HTTP visible: `404`
- CTA:
  - `cancelLabel = close`
- Salida:
  - en respuesta controlada: permanece en la página
  - en excepción no considerada `shouldStayOnPage`: `cancel` navega a `/`

### 7. `VALIDATION_ERROR`

- Alerta: `showError`
- Estado HTTP visible: `400`
- CTA:
  - `cancelLabel = close`
- Salida:
  - cierra el alert
  - permanece en la página

### 8. Error técnico (`catch`, normalmente `>= 500`)

- Alerta: `showError`
- Estado HTTP visible:
  - `err.response.status`
  - o `500`
- CTA:
  - `confirmLabel = reload`
  - `cancelLabel = close`
- Salida:
  - `confirm` reintenta `handleRegister(data)`
  - `cancel` navega a `/` cuando `shouldStayOnPage = false`

## Observaciones

- El flujo es lineal: `loading -> success final` o `loading -> error final`.
- No hay login automático tras registro.
- La salida funcional esperada del success es siempre `/user/verify-email`.
