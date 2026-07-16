# Verify Email Flow

## Objetivo

Registrar los estados visibles del flujo de `verify-email`, con foco en `Alert`, salidas de usuario y navegación.

Fuente:

- [page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/verify-email/page.tsx:1)
- [userHandler.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/user/userHandler.ts:1)

## Estructura del flujo

Esta página soporta dos subflujos distintos:

1. verificación automática desde `?token=...`
2. reenvío manual del email de verificación

El caso importante es el primero: debe mantenerse como una operación visual única.

## Subflujo 1. Verificación automática con token

### Secuencia base

1. Si existe `token`, la página abre un único `showLoading`.
2. Ejecuta `handleVerifyEmail(popups, token)`.
3. Si hay `magicToken`, ejecuta `handleMagicLogin(popups, magicToken)`.
4. Si `magicToken` falta, la página trata el caso como fallback excepcional y deriva a `login` manual.
5. Si existe `magicToken`, `magic-login` responde `user` y se hace un `setAuth({...user, isNewUser: true})` transitorio.
6. Después ejecuta `refreshAuth()`.
7. Solo al final muestra el success definitivo de login.

Regla operativa:

- `handleVerifyEmail(...)` y `handleMagicLogin(...)` ya abren por sí mismos los alerts terminales de error
- cuando uno de esos pasos devuelve `ok: false`, la página corta la secuencia y no vuelve a abrir otro popup adicional

### Caso 1. `AUTH_VERIFY_EMAIL_TOKEN_EXPIRED`

- Alerta: `showError`
- Estado HTTP visible: `400`
- CTA:
  - `cancelLabel = close`
- Salida:
  - cierra el alert
  - permanece en la página

### Caso 2. `AUTH_VERIFY_EMAIL_TOKEN_INVALID`

Incluye también:

- `AUTH_USER_NOT_FOUND`
- `USER_CLIENT_NOT_FOUND`

- Alerta: `showError`
- Estado HTTP visible: `400`
- CTA:
  - `confirmLabel = continue`
  - `cancelLabel = close`
- Salida:
  - `confirm` cierra el alert
  - `cancel` cierra el alert
  - el usuario permanece en la página y puede usar el formulario de reenvío o los links públicos

### Caso 3. `AUTH_BLOCKED` o `USER_CLIENT_BLOCKED`

- Alerta: `showError`
- Estado HTTP visible: `403`
- CTA:
  - `confirmLabel = continue`
  - `cancelLabel = close`
- Salida:
  - `confirm` cierra el alert
  - `cancel` cierra el alert
  - permanece en la página

### Caso 4. Verify success sin `magicToken` (fallback excepcional)

- Alerta: `showSuccess`
- Estado HTTP visible: `200`
- Contexto:
  - la verificación del email sí terminó bien
  - el backend no devolvió el `magicToken` esperado para el camino normal
- CTA:
  - `confirmLabel = goToLogin`
  - `cancelLabel = close`
- Salida:
  - `confirm` navega a `/user/login`
  - `cancel` cierra el alert
- Copy:
  - usa `pages.client.user.verifyEmail.manualLoginFallback`

### Caso 5. `MAGIC_TOKEN_EXPIRED`

- Alerta: `showError`
- Estado HTTP visible: `401`
- CTA:
  - `confirmLabel = continue`
  - `cancelLabel = goToHome`
- Salida:
  - `confirm` navega a `/user/login`
  - `cancel` navega a `/`

### Caso 6. `MAGIC_TOKEN_INVALID`

Incluye también:

- `AUTH_USER_NOT_FOUND`
- `USER_CLIENT_NOT_FOUND`

- Alerta: `showError`
- Estado HTTP visible: `400`
- CTA:
  - `confirmLabel = continue`
  - `cancelLabel = goToHome`
- Salida:
  - `confirm` navega a `/user/login`
  - `cancel` navega a `/`

### Caso 7. Success final del flujo compuesto

- Alerta: `showSuccess`
- Estado HTTP visible: `200`
- Efecto previo:
  - `magic-login` crea sesión
  - la página deja un `setAuth(..., isNewUser: true)` transitorio antes de la confirmación final
  - `refreshAuth()` sincroniza el contexto con la sesión confirmada desde servidor
- CTA:
  - sin CTA explícito de confirmación
- Salida:
  - redirect automático a `/` tras `AUTO_REDIRECT_MS = 4000`
- Copy:
  - la descripción del auto-redirect ya sale de `pages.client.user.verifyEmail.autoRedirectDescription`

### Caso 8. Fallo de sincronización final de sesión

- Alerta: `showError`
- Estado HTTP visible:
  - `503` si la sesión solo pudo resolverse en modo offline/storage
  - `500` si la sesión no quedó confirmada desde servidor
- Contexto:
  - `verify-email` y `magic-login` ya terminaron
  - el fallo está en `refreshAuth()` o en la confirmación final de la sesión
- CTA:
  - `confirmLabel = reload`
  - `cancelLabel = goToLogin`
- Salida:
  - `confirm` recarga la página para reintentar la sincronización
  - `cancel` navega a `/user/login`
- Copy:
  - ya no depende de condicionales inline por idioma
  - usa `pages.client.user.verifyEmail.sessionSyncError`

### Caso 9. Error técnico del flujo compuesto

- Alerta: `showError`
- Estado HTTP visible:
  - `err.response.status`
  - o `500`
- CTA:
  - `confirmLabel = reload`
  - `cancelLabel = goToHome`
- Salida:
  - `confirm` ejecuta `router.refresh()`
  - `cancel` navega a `/`

## Subflujo 2. Reenvío manual de verificación

### Secuencia base

1. El usuario envía `email`, `language`, `clientId`.
2. Se abre `showLoading`.
3. Se ejecuta `handleResendEmail`.
4. El flujo termina en success o error final.

### Caso 1. `USER_VERIFY_EMAIL_RESENT`

- Alerta: `showSuccess`
- Estado HTTP visible: `200`
- CTA:
  - `cancelLabel = close`
- Salida:
  - cierra el alert
  - permanece en la página

### Caso 2. `CLIENT_NOT_FOUND`

- Alerta: `showError`
- Estado HTTP visible: `404`
- CTA:
  - `cancelLabel = close`
- Salida:
  - cierra el alert

### Caso 3. `VALIDATION_ERROR`

- Alerta: `showError`
- Estado HTTP visible: `400`
- CTA:
  - `cancelLabel = close`
- Salida:
  - cierra el alert

### Caso 4. `AUTH_BLOCKED` o `USER_CLIENT_BLOCKED`

- Alerta: `showError`
- Estado HTTP visible: `403`
- CTA:
  - `cancelLabel = close`
- Salida:
  - cierra el alert

### Caso 5. Error técnico (`>= 500` o sin código)

- Alerta: `showError`
- Estado HTTP visible:
  - `errorConfig.status`
- CTA:
  - `confirmLabel = reload`
  - `cancelLabel = close`
- Salida:
  - `confirm` repite `handleResendEmail(popups, data)`
  - `cancel` cierra el alert

## Observaciones

- Esta es la página más importante para documentar porque combina varios pasos técnicos bajo un único estado visible.
- La regla actual correcta es:
  - no mostrar success intermedio
  - mantener `loading` hasta terminar `verify-email -> magic-login -> refreshAuth`
- existe un fallback explícito cuando `verify-email` termina bien pero no devuelve `magicToken`: el usuario recibe success y salida manual a `/user/login`
- ese fallback debe leerse como defensa excepcional del contrato, no como camino normal del happy path

## Intención visible de las salidas

- `loading` del flujo compuesto: comunicar activación en progreso sin ir revelando pasos internos
- token inválido, expirado o usuario no resoluble: explicar que el enlace no sirve o no puede completarse y mantener salidas públicas seguras
- `blocked`: explicar que el acceso no puede activarse ahora, no que el enlace esté roto
- verify success sin `magicToken`: confirmar que el email sí quedó verificado, pero empujar a `login` manual porque la sesión automática no pudo cerrarse
- success final del flujo compuesto: comunicar activación completada y acceso concedido; el redirect automático evita una pantalla final redundante
- fallo de sincronización final: explicar que la activación avanzó pero la sesión no quedó confirmada y ofrecer retry o `login`
- resend success: confirmar de forma neutra que el siguiente paso está en el email, sin revelar estado interno de la cuenta
