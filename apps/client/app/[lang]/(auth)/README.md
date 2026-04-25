# Auditoria de la Ruta `(auth)` en `apps/client`

Este documento registra la revisión del estado actual de la ruta `apps/client/app/[lang]/(auth)` con foco en:

- semántica HTML
- accesibilidad
- metadata
- manejo de códigos y errores
- consistencia de i18n
- acoplamiento entre UI, contexto y servicios

La revisión cubre:

- [layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/layout.tsx)
- [user/login/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/login/page.tsx)
- [user/register/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/register/page.tsx)
- [user/forgot-password/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/forgot-password/page.tsx)
- [user/set-password/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/set-password/page.tsx)
- [user/verify-email/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/verify-email/page.tsx)
- [user/userAuth.module.css](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/userAuth.module.css)
- [packages/components/client/user/auth/userForm/formWrapper/FormWrapper.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/userForm/formWrapper/FormWrapper.tsx)
- [packages/components/client/user/auth/userForm/form/Form.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/userForm/form/Form.tsx)
- [packages/utils/user/userHandler.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/user/userHandler.ts)
- [packages/services/auth/authService.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/auth/authService.ts)
- [packages/utils/metadata/metadata.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/metadata/metadata.ts)
- `packages/i18n/{de,en}/{pages,popups,loadings}.json`

## Resumen Ejecutivo

La ruta `(auth)` funciona, pero hoy mezcla tres problemas:

1. La semántica y accesibilidad son inconsistentes entre páginas.
2. El flujo de errores/success depende demasiado de popups genéricos y de helpers con contratos ambiguos.
3. Hay deuda de i18n y de metadata: algunas claves parecen duplicadas o en desuso y parte del contenido de página no está conectado con los textos correctos.

El caso más delicado detectado en la revisión es `verify-email`: el backend puede devolver éxito en la verificación y aun así el frontend terminar mostrando un error inesperado si falla el paso siguiente de `magic login`, o si el helper considera inválido un éxito sin `magicToken`.

## Estado Actual vs Auditoria Anterior

Desde la auditoría inicial ya hubo avances reales en la ruta:

- `/(auth)/layout.tsx` ya no es pasivo y ahora aporta un shell visual compartido.
- `login`, `register`, `forgot-password`, `set-password` y `verify-email` ya migraron parcialmente a una estructura más consistente con `section/header/footer`.
- varios `aria-labelledby` rotos se corrigieron usando ids estáticos.
- `verify-email/page.tsx` ya contempla el caso "verify success sin magicToken" y redirige a login manual.

Aun así, siguen abiertos estos problemas:

- el flujo `register -> verify-email -> magicLogin` no está estabilizado del todo
- `useVerifyEmailActions()` sigue tratando éxitos y fallos con demasiada ambigüedad
- los `loadings` y algunos popups usan fuentes distintas (`loadings.json` vs `popups.json`) sin un contrato claro
- el README original quedó parcialmente desactualizado en los hallazgos de layout/semántica ya corregidos

Conclusión:
- la prioridad ya no es "crear estructura auth desde cero"
- la prioridad actual es "cerrar el contrato funcional y de mensajes del flujo auth"

## Hallazgos

### 1. Layout de `(auth)` ya mejoró, pero sigue siendo visual y no semántico

Archivo:
- [layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/layout.tsx)

Estado actual:
- el layout ya define un shell compartido con fondo, centrado y panel visual
- sigue siendo un layout visual, no un layout semántico completo de auth
- el `<main>` vive en el layout, lo cual está bien
- pero cada página sigue decidiendo por separado intro, landmarks secundarios y estructura interna

Impacto:
- se redujo la duplicación del shell general
- la semántica fina sigue repartida entre páginas
- la accesibilidad sigue dependiendo de convenciones no totalmente unificadas

Sugerencia:
- mantener el shell actual
- extraer del layout o de un componente compartido auth:
  - branding
  - bloque introductorio opcional
  - zona de formulario
  - pie de CTA secundario

### 2. Metadata configurada, pero el layout no aprovecha una estructura común

Archivos:
- `user/*/layout.tsx`
- [packages/utils/metadata/metadata.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/metadata/metadata.ts)
- `packages/i18n/metadata.ts`

Estado actual:
- cada página auth genera metadata con `getPageMetadata(...)`
- eso está bien y es consistente
- pero la estructura visual no utiliza un layout común que refuerce el propósito de cada página

Observaciones:
- `forgotPassword`, `setPassword`, `login`, `register`, `verifyEmail` sí tienen metadata declarada
- el helper `getPageMetadata` devuelve un fallback vacío si la key no existe; no hay validación

Sugerencia:
- mantener el esquema actual de metadata
- añadir test o validación estática para asegurar que toda página auth tenga entrada en `pageMetadata`
- alinear los títulos/intro visibles con la metadata correspondiente para evitar divergencias

### 3. Semántica inconsistente entre páginas, aunque mejor que en la revisión anterior

Ejemplos:
- [user/login/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/login/page.tsx)
- [user/register/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/register/page.tsx)
- [user/forgot-password/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/forgot-password/page.tsx)
- [user/set-password/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/set-password/page.tsx)
- [user/verify-email/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/verify-email/page.tsx)

Problemas detectados:
- `login`, `register`, `forgot-password`, `set-password` y `verify-email` ya usan mejor `section/header/footer`
- `set-password` ya dejó de usar el texto traducido como id del `<h1>`
- el problema principal ya no es ids rotos masivos, sino consistencia entre páginas
- `verify-email` y `register` siguen teniendo una semántica más débil en el contenido visible, porque dependen demasiado del popup global y muy poco del contenido de página
- la jerarquía visual es más consistente, pero aún no existe un patrón común explícito para todas las variantes auth

Sugerencia:
- normalizar todas las páginas auth a una estructura como:
  - `<main>`
  - `<section>` contenedora
  - `<header>` con logo, `<h1>` y texto introductorio
  - `<form>`
  - `<footer>` o bloque secundario para CTA complementaria
- eliminar `role="form"` de contenedores no necesarios
- usar ids estáticos y predecibles, nunca derivados de texto i18n

### 4. Accesibilidad del formulario mejorable

Archivos:
- [Form.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/userForm/form/Form.tsx)
- [FormWrapper.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/userForm/formWrapper/FormWrapper.tsx)

Estado actual:
- el formulario ya tiene buenas bases:
  - `label` asociados
  - `aria-invalid`
  - `aria-describedby`
  - focus en primer campo inválido
  - `autocomplete` razonable para password
- hay summary de errores y feedback inline

Problemas detectados:
- el contenedor del error summary usa `<div>`; un `<section>` o `<aside>` con `aria-labelledby` sería más claro
- el botón de mostrar/ocultar contraseña no declara `aria-controls`
- en el checkbox de TOS, `aria-describedby` depende sólo de error; si hubiera texto de ayuda, hoy no hay slot semántico claro
- el formulario mezcla navegación (`forgotPassword`) y estado de auth/client dentro del wrapper, lo que lo vuelve menos presentacional

Sugerencia:
- mantener la base del componente, pero separar:
  - UI/formulario presentacional
  - hydration de valores iniciales
  - navegación auxiliar
- convertir `FormWrapper` en una pieza más delgada o partirlo en:
  - `AuthFormView`
  - `useAuthFormState`
  - página contenedora

### 5. Acoplamiento innecesario del `FormWrapper`

Archivo:
- [FormWrapper.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/userForm/formWrapper/FormWrapper.tsx)

Problemas:
- consume `useAuth()`, `useClient()`, `useRouter()`, `useLang()` e `useI18n()`
- además hace navegación a forgot-password
- completa automáticamente `clientId`, `language` y `email`

Impacto:
- la pieza ya no es un wrapper de formulario, sino una mezcla de UI, defaults de negocio y navegación
- complica pruebas unitarias
- hace más difícil reutilizar o endurecer la semántica de cada pantalla

Sugerencia:
- mover la resolución de `email`, `clientId` y `language` a cada página
- dejar `FormWrapper` como wrapper puramente de validación y render
- o reemplazarlo por un componente de formulario auth explícito por caso de uso

### 6. Manejo de errores: sigue habiendo uso excesivo de `GLOBAL_INTERNAL_ERROR`

Páginas afectadas:
- login
- register
- forgot-password
- set-password
- verify-email

Problemas:
- varios guard clauses locales muestran `GLOBAL_INTERNAL_ERROR` para errores que en realidad son de validación o precondición local
- `register` ya propaga `err.response?.status`, pero sigue dependiendo de fallback genérico para varios casos de negocio
- `register` todavía no trata explícitamente `USER_REGISTER_NEEDS_CORRECT_PASSWORD` como caso de UX diferenciado
- en `login`, si faltan `email/password/clientId`, el popup es genérico aunque existen códigos específicos de validación
- en `set-password`, la ruta de `status=error` usa fallback genérico incluso cuando el query param `code` apunta a un caso tipado
- `verify-email` y `magic-login` todavía mezclan errores de contrato, errores de backend y fallos inesperados

Sugerencia:
- distinguir:
  - validación local
  - errores de backend esperados
  - fallos internos inesperados
- no mapear precondiciones locales a `GLOBAL_INTERNAL_ERROR`
- propagar `status` y `code` reales del backend en todos los catches

### 7. `verify-email` sigue siendo el flujo más frágil

Archivos:
- [user/verify-email/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/verify-email/page.tsx)
- [packages/utils/user/userHandler.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/user/userHandler.ts)
- [packages/types/auth/authTypes.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/types/auth/authTypes.ts)

Hallazgo principal:
- el backend ya confirmó `AUTH_VERIFY_EMAIL_SUCCEEDED`
- `verify-email/page.tsx` ya contempla el caso sin `magicToken`
- pero `handleVerifyEmail()` dentro de `useVerifyEmailActions()` todavía trata `success` sin `magicToken` como error interno antes de que la página pueda decidir otra cosa
- hay una contradicción entre la página y el helper: la página quiere tolerar ese caso, el helper no

Esto es importante:
- esa decisión de frontend puede ser válida o inválida según el contrato real del backend
- si el backend considera que verificar email con éxito no siempre requiere `magicToken`, el frontend está mal
- si el backend garantiza que todo éxito trae `magicToken`, entonces el contrato está bien pero falta observabilidad para saber cuándo se rompe

Problemas adicionales:
- `catch` en `handleVerifyEmail` ignora `code` y `status` reales del backend
- `catch` en `handleResendEmail` también cae siempre en genérico
- `handleMagicLogin()` sólo devuelve `boolean`, lo que dificulta saber si falló por token inválido, expirado o ausencia de `user`
- la página `verify-email` muestra tres loadings secuenciales y luego un success genérico; falta un contrato explícito de transiciones de estado
- `didRunRef` evita doble ejecución en dev, pero también complica el razonamiento del flujo y tapa posibles efectos dependientes del token

Sugerencia:
- definir explícitamente el contrato de `VerifyEmailResponse`
- decidir una sola semántica:
  - `success` siempre trae `magicToken`
  - o `success` puede no traerlo y el frontend debe tratarlo como verify-success sin auto-login
- registrar en frontend el `code` real cuando falle verify/magic-login
- cambiar `handleMagicLogin()` para que devuelva un resultado estructurado y no sólo `boolean`
- separar visualmente:
  - verificación automática del token
  - auto-login mágico
  - formulario para reenviar email

### 7.1. Problema actual de mensajes y loading

Estado actual:
- `register` usa `REGISTER_LOADING_SUBMIT` desde `popups + fallback`, mientras que otros flujos toman textos desde `loadings.message`
- `verify-email` encadena `verifyEmail`, `login` y `createUser` usando `loadings.message`
- `forgot-password` usa `GLOBAL_LOADING` con fallback específico

Problema:
- no hay una única convención para textos de loading
- el flujo visual depende de helpers distintos según la página
- cuando algo falla en medio del loading, el usuario ve un popup genérico sin saber en qué paso ocurrió

Sugerencia:
- normalizar los loadings auth en una sola fuente
- decidir si `loadings.json` o `popups.json` es el contrato oficial para estados intermedios
- para `verify-email`, incluir mensajes de fallo diferenciados por etapa:
  - verify step failed
  - magic login failed
  - resend failed

### 8. Inconsistencias de i18n y claves aparentemente en desuso

Hallazgos en `popups.json`:
- `USER_FORGOT_PASSWORD_EMAIL_SENDED` existe, pero la app usa `USER_FORGOT_PASSWORD_EMAIL_SENT`
- `USER_VERIFY_EMAIL_RESENDED` existe, pero la app usa `USER_VERIFY_EMAIL_RESENT`
- `USER_EMAIL_ALREADY_REGISTERED` existe, pero no aparece usado en la ruta auth
- `USER_LOGIN_INVALID_CREDENTIALS` existe, pero el frontend no la referencia explícitamente en auth

Esto sugiere:
- hubo renombrados de códigos sin limpieza posterior
- el i18n acumula claves legacy

Hallazgos en `pages.json`:
- existe `resetPasswordText`, pero `set-password/page.tsx` no la usa
- `forgotPasswordText` y `verifyEmail` sí están siendo consumidos
- `login` y `register` consumen sólo partes de sus textos; no todo el contenido declarado parece estar aprovechado

Impacto:
- aumenta la probabilidad de fallback equivocado
- hace más difícil saber qué textos son de verdad parte del contrato vigente

Sugerencia:
- auditar y clasificar claves i18n en:
  - activas
  - legacy
  - duplicadas
- eliminar o migrar claves con naming inconsistente:
  - `SENDED` -> `SENT`
  - `RESENDED` -> `RESENT`
- alinear nombres de códigos frontend/backend/i18n

### 9. CTA y navegación secundaria podrían ser más semánticas

Ejemplos:
- `login` y `register` usan `<aside>` para una CTA textual
- `forgot-password` y `set-password` no siguen el mismo patrón

Sugerencia:
- si la CTA es parte del flujo principal, usar `<footer>` dentro del card auth
- reservar `<aside>` para contenido realmente complementario

### 10. CSS compartido pero con semántica visual poco explícita

Archivo:
- [userAuth.module.css](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/userAuth.module.css)

Observaciones:
- la hoja sirve como estilo compartido, pero la nomenclatura (`section`, `article`, `aside`, `header_p`) depende mucho de cómo cada página la interprete
- aparece `.wrapper` sólo en media query, pero no como bloque base consistente para todas las páginas

Sugerencia:
- renombrar estilos hacia intención de layout:
  - `shell`
  - `card`
  - `intro`
  - `actions`
  - `supportingCta`
- alinear CSS con una estructura semántica única para toda la ruta auth

## Lectura del Incidente de Verificación

Con los logs revisados:

1. `AUTH_REGISTER_REJECTED` con `USER_REGISTER_NEEDS_CORRECT_PASSWORD`
2. luego `AUTH_REGISTER_SUCCEEDED`
3. luego `AUTH_VERIFY_EMAIL_SUCCEEDED`

Conclusión:
- backend registró éxito en la verificación de email
- el error inesperado que viste no queda explicado por esos logs del backend
- el candidato principal está en el frontend, concretamente en:
  - `handleVerifyEmail`
  - `handleMagicLogin`
  - el fallback a `GLOBAL_INTERNAL_ERROR`

## Prioridad de Cambios Sugeridos

### Prioridad Alta

- Rediseñar el contrato de `verify-email` entre frontend y backend.
- Corregir ids y relaciones `aria-*` rotas en `login`, `register` y `set-password`.
- Crear un layout auth real y único.
- Propagar `status` y `code` reales del backend en todos los catches.
- Eliminar uso de `GLOBAL_INTERNAL_ERROR` para validaciones locales.

## Avances Implementados en Esta Iteracion

- `register/page.tsx` ya no usa `getPopup('REGISTER_LOADING_SUBMIT')` para el loading.
- `register/page.tsx` ahora toma el loading desde `texts.loadings.loading.REGISTER_LOADING_SUBMIT`.
- `register/page.tsx` ahora respeta mejor códigos de negocio de backend y evita redirigir a home en errores recuperables como:
  - `USER_REGISTER_NEEDS_CORRECT_PASSWORD`
  - `USER_REGISTER_ALREADY_REGISTERED`
  - `USER_EMAIL_ALREADY_REGISTERED`
- `useVerifyEmailActions().handleVerifyEmail()` ya no fuerza error interno cuando el backend responde `success` sin `magicToken`.
- `useVerifyEmailActions().handleMagicLogin()` ya no devuelve sólo `boolean`; ahora devuelve un resultado estructurado.
- `verify-email/page.tsx` ya usa el popup de `USER_VERIFY_EMAIL_SUCCESS` cuando hay verify success sin auto-login.

Esto reduce la contradicción entre la página y el helper, pero no cierra todavía todo el flujo.

Pendiente crítico:
- revisar en runtime si el backend realmente devuelve `magicToken` en el caso esperado y qué `code/status` vuelve cuando `magicLogin` falla.

### Prioridad Media

- Desacoplar `FormWrapper` de `auth/client/router`.
- Unificar estructura semántica de todas las páginas auth.
- Revisar el uso correcto de `resetPasswordText`.
- Normalizar CTA secundaria dentro de `<footer>` del card auth.

### Prioridad Media/Baja

- Limpiar claves legacy de i18n.
- Añadir tests de contrato para metadata auth.
- Añadir tests de accesibilidad por página.

## Propuesta de Plan de Trabajo

### Fase 1. Contrato y errores

- Documentar contrato de:
  - register
  - login
  - verify-email
  - magic-login
  - resend-verification
- Ajustar frontend para usar `code` y `status` reales.

### Fase 1.1. Correcciones inmediatas del flujo auth

- [x] Reconciliar `verify-email/page.tsx` con `useVerifyEmailActions()`.
- [x] Hacer que `handleVerifyEmail()` no fuerce error interno si la página quiere manejar `success` sin `magicToken`.
- [x] Hacer que `handleMagicLogin()` devuelva resultado estructurado con `code/status`.
- [x] Corregir `register/page.tsx` para mostrar el mensaje real de backend en códigos como `USER_REGISTER_NEEDS_CORRECT_PASSWORD`.
- [x] Corregir el loading de `register`.
- [ ] Revisar qué loading usa cada flujo y unificar la semántica visual del resto de páginas auth.

### Fase 2. Layout y semántica

- Implementar `/(auth)/layout.tsx` con estructura compartida.
- Homogeneizar `main/header/form/footer`.
- Corregir ids, `aria-labelledby`, `aria-describedby`.

### Fase 3. Formularios y accesibilidad

- Separar `FormWrapper` en capa presentacional y capa de estado.
- Revisar foco, summary de errores, mensajes de ayuda y checkbox legal.

### Fase 4. i18n y metadata

- Eliminar claves duplicadas/legacy.
- Verificar que cada texto declarado tenga consumidor real o sea eliminado.
- Validar metadata por página auth.

## Cambios Concretos Recomendados en la Próxima Iteración

- Rehacer `verify-email/page.tsx` para soportar explícitamente:
  - verify success + magic login success
  - verify success sin magic login
  - token expirado
  - token inválido
  - reenvío de email
- Corregir `login/page.tsx`, `register/page.tsx` y `set-password/page.tsx` para que sus ids ARIA existan realmente.
- Hacer que `register/page.tsx` muestre el `code` real del backend, en particular `USER_REGISTER_NEEDS_CORRECT_PASSWORD`.
- Incorporar `resetPasswordText` o eliminarlo del i18n si no se usará.
- Limpiar claves legacy:
  - `USER_FORGOT_PASSWORD_EMAIL_SENDED`
  - `USER_VERIFY_EMAIL_RESENDED`
