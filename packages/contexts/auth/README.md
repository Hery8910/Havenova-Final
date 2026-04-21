# Auth Context (Frontend)

## Objetivo

El `AuthContext` es la capa de sesión del frontend.

Su responsabilidad real debería ser:

- bootstrap de sesión autenticada
- persistencia local mínima de sesión
- refresh/logout
- estado de autenticación y permisos básicos

No debería ser la fuente principal de datos de perfil del usuario.

## Contrato backend relevante

Según el dominio backend `auth`:

- `POST /api/auth/login` y `POST /api/auth/magic-login` devuelven un payload de sesión
- `GET /api/auth/me` devuelve el payload autenticado actual
- el payload documentado contiene:
  - `authId`
  - `userClientId`
  - `clientId`
  - `email`
  - `role`
  - `status`
  - `isVerified`
  - `isNewUser` en endpoints tipo login

Conclusión:

- `auth.email` sigue existiendo en backend como parte del payload de sesión
- su función es de identidad/autenticación
- no debería ser la fuente que consumen los componentes de perfil/contacto del usuario en UI

## Estado actual en frontend

### Alineado

- `AuthProvider` ya concentra sesión, refresh y logout
- `auth` se persiste localmente en `hv-auth`
- el contexto depende de `client._id` para operar por tenant

### Inconsistencias detectadas

1. Contrato de identidad frontend sin decisión explícita cerrada
- El backend documenta `authId` y `userClientId`
- El frontend sigue modelando [authTypes.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/types/auth/authTypes.ts) con `userId`
- `getAuthUser()` en [authService.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/auth/authService.ts) tipa la respuesta directamente como `AuthUser`, sin adaptar formalmente la decisión de frontend
- según la decisión actual de dominio, `auth` debe quedar desacoplado del perfil y representar solo la sesión
- eso implica que la identidad expuesta por `auth` debe elegirse por semántica de autenticación, no por conveniencia para el perfil

2. `auth` mezcla sesión y datos de usuario
- `email` hoy se consume como dato de perfil en UI
- ejemplo: [profile page](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/profile/page.tsx:183)
- esto contradice el objetivo actual del dominio `profile`, donde `contactEmail` existe precisamente para lectura de perfil

3. Nomenclatura frontend antigua propagada
- `AuthUser.userId` se usa como identidad del usuario en múltiples contextos y servicios
- pero el backend ya distingue `authId` de `userClientId`
- con la decisión actual, el frontend debe evitar reutilizar identidad de `auth` para resolver ownership del perfil

4. `AuthContext` alimenta otros contextos con campos conceptualmente incorrectos
- `ProfileContext` usa `auth.userId` como identidad base
- `WorkerContext` usa `auth.email` para defaults locales
- estos acoplamientos hacen que cambios de contrato en auth impacten perfil/worker

5. Los formularios de autenticación comparten infraestructura con formularios de perfil
- hoy el proyecto reutiliza `FormWrapper` y validators bajo `userForm` tanto para auth como para profile
- esto ya funciona, pero la separación conceptual no está bien definida
- auth y profile necesitan contratos/form-state/validaciones claramente diferenciados

## Decisión de diseño propuesta

Mantener `auth` y `profile` como responsabilidades separadas:

- `auth` conserva `email` porque el backend lo incluye en el payload de sesión
- pero `auth.email` pasa a considerarse un dato de sesión, no de presentación de perfil
- toda UI que muestre contacto del usuario debe leer desde `profile.contactEmail`
- `auth` no debe usarse para vincular ni reconstruir identidad de perfil
- el hecho de que backend documente `userClientId` no obliga a que `profile` dependa de `auth` como owner semántico

Esto permite:

- mantener alineación con el backend
- no romper flujos de auth que aún necesitan `email`
- reducir acoplamiento entre sesión y perfil

## Cambios necesarios en Auth

### Fase 1. Documentación y tipado

- [ ] documentar contrato real de `AuthContext`
- [x] decidir si `AuthUser` expone `authId` y/o `userClientId` explícitos o si se adapta a un modelo frontend reducido de sesión
- [x] introducir `authId` y `userClientId` en el modelo frontend de sesión
- [ ] eliminar la ambigüedad actual de `userId`
- [ ] documentar explícitamente que `auth` no es owner del perfil

### Fase 2. Modelo frontend

- [x] actualizar [authTypes.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/types/auth/authTypes.ts) para reflejar el payload backend real
- [x] revisar [authService.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/auth/authService.ts) para tipar correctamente `GET /api/auth/me`
- [x] adaptar `login` y `magic login` a envelope tipado con normalización de sesión
- [ ] adaptar `refreshAuth` al contrato real
- [ ] decidir si `AuthUser.userId` se elimina o se reemplaza por una identidad de sesión explícita

### Fase 3. Responsabilidad del contexto

- [ ] mantener en `auth` solo:
  - identidad de sesión
  - estado de autenticación
  - rol
  - verificación
  - flags de sesión (`isLogged`, `isNewUser`)
- [ ] dejar de tratar `auth.email` como fuente de perfil en componentes de UI

### Fase 4. Consumidores

- [ ] revisar consumidores que hoy dependen de `auth.email`
- [ ] migrar los de presentación a `profile.contactEmail`
- [ ] dejar en `auth` solo los casos donde el email forma parte del flujo de autenticación

### Fase 5. Formularios de autenticación

- [ ] separar explícitamente la infraestructura/form-state de autenticación de la infraestructura/form-state de perfil
- [ ] revisar `FormWrapper` y `userForm` para definir qué piezas son realmente shared y cuáles deben pertenecer a auth
- [ ] corregir formularios actuales de login/register/forgot-password/set-password para que su contrato quede alineado con `auth`
- [ ] evitar que validaciones o tipos de perfil se mezclen en formularios de autenticación

## Riesgos

- renombrar `userId` sin estrategia de transición puede romper `profile`, `worker`, forms y páginas de login
- mover el consumo de email sin exponer primero `contactEmail` en `ProfileContext` deja vistas sin dato

## Sugerencia de ejecución

No conviene implementar `auth` aislado del `profile`.

Recomendación:

1. corregir primero el contrato tipado/documentado de `auth`
2. exponer `contactEmail` en `profile`
3. migrar consumidores de UI desde `auth.email` a `profile.contactEmail`
4. corregir la separación entre formularios de auth y formularios de perfil
5. dejar `auth.email` como compatibilidad interna hasta cerrar la migración

## Plan de Implementación Propuesto

### Paso 1. Cerrar el contrato frontend de sesión

Objetivo:

- decidir qué representa exactamente `AuthUser` en frontend

Decisión recomendada:

- tratar `AuthUser` como modelo de sesión frontend
- no usarlo para representar ownership de perfil
- mantener solo los campos de sesión necesarios para runtime

Cambios previstos:

- revisar [authTypes.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/types/auth/authTypes.ts)
- definir si el modelo final será:
  - `authId`
  - `userClientId`
  - `clientId`
  - `email`
  - `role`
  - `status`
  - `isVerified`
  - `isLogged`
  - `isNewUser`
- eliminar o deprecar `userId` si ya no representa el contrato actual

Resultado esperado:

- `AuthContext` deja de exponer una identidad ambigua que otros contextos interpretan como perfil

### Paso 2. Alinear servicios auth con el contrato elegido

Objetivo:

- que `authService` no tipa respuestas con un modelo viejo

Cambios previstos:

- revisar [authService.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/auth/authService.ts)
- tipar correctamente:
  - `loginUser`
  - `magicLoginRequest`
  - `getAuthUser`
- si hace falta, introducir un mapper de respuesta backend -> `AuthUser`

Resultado esperado:

- el servicio de auth entrega siempre un modelo coherente al contexto

### Paso 3. Corregir `AuthContext`

Objetivo:

- dejar `AuthContext` como capa pura de sesión

Cambios previstos:

- revisar [authContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/authContext.tsx)
- ajustar:
  - `createGuest()`
  - hidratación desde storage
  - `refreshAuth()`
  - `setAuth()`
  - logout/login bootstrap
- eliminar dependencias innecesarias de identidad usada por perfil
- mantener `email` solo como dato de autenticación/session display

Resultado esperado:

- `auth` conserva sesión, refresh y permisos, pero deja de actuar como base de perfil

### Paso 4. Inventario de consumidores de `auth`

Objetivo:

- separar consumidores válidos de auth de consumidores que deberían migrar a profile

Consumidores que deben quedarse en `auth`:

- páginas y flows de login/register/verify/resend/change-email
- guards y decisiones de sesión
- checks de rol/verificación

Consumidores que deben migrarse después a `profile`:

- vistas que muestran email del usuario como dato de contacto
- profile page
- cualquier resumen de cuenta orientado a perfil

Consumidores a revisar con cautela:

- `WorkerContext`
- páginas de support/contact
- componentes compartidos de navbar o formularios que autocompletan email

Resultado esperado:

- lista cerrada de cambios posteriores sin seguir propagando `auth.email`

### Paso 5. Separación de formularios de auth

Objetivo:

- dejar formularios de auth desacoplados del estado de perfil

Problema actual:

- [FormWrapper.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/userForm/formWrapper/FormWrapper.tsx) mezcla:
  - `useAuth()`
  - `useProfile()`
  - `useWorker()`
  - `useClient()`
- esto hace que un formulario de login herede defaults y dependencias propias de profile/worker

Cambios previstos:

- separar infraestructura shared de render/layout del formulario
- crear o extraer una variante específica para auth
- evitar que login/register/forgot-password/reset-password lean `profile` o `worker`
- dejar los formularios de perfil consumiendo solo `ProfileContext`

Resultado esperado:

- formularios de auth y formularios de profile quedan tipados y validados por dominio

### Paso 6. Preparar tests antes de tocar profile

Objetivo:

- asegurar que el refactor de auth no rompa bootstrap de sesión

Tests a añadir cuando se implemente:

- `AuthProvider` hidrata guest correctamente
- `AuthProvider` refresca sesión usando el contrato nuevo
- expiración de sesión muestra el popup correcto
- login/magic login persisten el modelo nuevo
- formularios de auth no dependen de `ProfileContext`

## Orden recomendado de implementación

1. tipos de `AuthUser`
2. servicios `authService`
3. `AuthContext`
4. tests de `AuthProvider`
5. separación de formularios auth
6. recién después, cambios coordinados en `ProfileContext`

## Criterio de corte

La tarea de `auth` se considera cerrada cuando:

- `AuthContext` no depende conceptualmente del perfil
- `AuthUser` ya no expone identidad ambigua
- los formularios de autenticación no leen estado de perfil
- la UI que aún use `auth.email` esté identificada y acotada como migración pendiente hacia `profile`

## Estado actual de implementación

Completado en esta fase:

- `AuthUser` ya expone `authId` y `userClientId`
- `authService` normaliza `login`, `magic login` y `GET /me` desde el payload backend documentado
- se mantiene `userId` como alias transitorio apuntando a `userClientId` para no romper consumidores actuales

Pendiente para la siguiente fase:

- propagar el modelo nuevo a `AuthContext`
- eliminar dependencia activa de `userId`
- corregir formularios y consumidores de `auth.email`

Completado adicionalmente en esta iteración:

- [AuthContext](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/authContext.tsx) ya normaliza storage legacy y el modelo nuevo de sesión
- el contexto mantiene `authId`, `userClientId` y `userId` aliasado de forma consistente
- se añadieron tests de hidratación para guest y storage legado:
  - [auth-context.test.jsx](/home/heriberto/Escritorio/Havenova/havenova/tests/jest/contexts/auth-context.test.jsx)
- se completó la separación física inicial de componentes de usuario:
  - `packages/components/client/user/auth/*`
  - `packages/components/client/user/profile/*`
  - guía: [packages/components/client/user/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/README.md)

## Estado Actual Del Formulario Compartido

Componente afectado principal:

- [FormWrapper.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/userForm/formWrapper/FormWrapper.tsx)
- [Form.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/userForm/form/Form.tsx)
- [userFormValidator.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/validators/userFormValidator/userFormValidator.ts)

### Diagnóstico actual

1. Mezcla de dominios en tiempo de ejecución

- `FormWrapper` consume simultáneamente:
  - `useAuth()`
  - `useProfile()`
  - `useWorker()`
  - `useClient()`
- eso hace que un formulario de login/register herede defaults de perfil o worker aunque no corresponda

2. Hidratación implícita de campos

- el wrapper sobreescribe `initialValues` con:
  - `auth.email`
  - `profile.name`
  - `profile.phone`
  - `profile.language`
  - `client._id`
- esto impide separar claramente formularios de auth de formularios de profile

3. Tipado de formulario demasiado genérico y poco preciso

- `FormField` y `FormData` mezclan campos de:
  - auth
  - profile
  - contact
  - address
- no existe un contrato por dominio

4. Validadores rígidos y acoplados a un único flujo

- `validateName` exige mayúscula inicial y patrón muy restrictivo
- `validatePhone` está centrado en formato alemán fijo
- `validateAddress` y `validateServiceAddress` duplican lógica
- `validatePassword` devuelve reglas pensadas para registro/reset, pero el mismo wrapper también lo usa en login

5. Problemas de accesibilidad a revisar

- el botón de mostrar contraseña usa un `aria-label` fijo en inglés
- `autoComplete=\"off\"` en password no es ideal para login
- `aria-describedby` de password siempre apunta a `password-hint`, incluso cuando el contenido semántico cambia entre error e hint
- links de términos/política no están contextualizados por idioma/ruta
- el formulario no expone una capa de error resumen o foco al primer error

6. Acoplamiento de presentación y estado

- `Form.tsx` sigue dependiendo de `profile` para resolver valores renderizados como `address` o `phone`
- eso complica reutilizar la vista del formulario como puro componente presentacional

## Cambios Propuestos Para El Formulario

### Fase A. Separación de ownership

- [ ] crear una variante o capa específica para formularios de autenticación
- [ ] crear una variante o capa específica para formularios de perfil
- [ ] dejar `Form` como componente presentacional puro o dividirlo por dominio si no compensa seguir compartiendo markup

### Fase B. Contratos tipados por dominio

- [ ] definir tipos específicos:
  - `AuthLoginFormData`
  - `AuthRegisterFormData`
  - `AuthForgotPasswordFormData`
  - `AuthResetPasswordFormData`
  - `ProfileFormData`
- [ ] dejar de usar un `FormData` genérico mezclado para todos los casos

### Fase C. Estado e inicialización

- [ ] eliminar de formularios auth la dependencia de `useProfile()` y `useWorker()`
- [ ] pasar `initialValues` explícitos desde cada página/container
- [ ] decidir si `clientId` se inyecta desde container o si sigue siendo un hidden/runtime field de auth

### Fase D. Validadores

- [ ] separar validadores por dominio:
  - `authFormValidator`
  - `profileFormValidator`
  - `contactFormValidator`
- [ ] revisar reglas de nombre/teléfono para no imponer restricciones innecesarias
- [ ] evitar reutilizar el validador de password fuerte en login
- [ ] deduplicar address/serviceAddress

### Fase E. Accesibilidad

- [ ] internacionalizar labels accesibles del toggle de password
- [ ] revisar `autocomplete` por caso:
  - login: `current-password`
  - register/reset: `new-password`
- [ ] mover foco al primer error de validación
- [ ] añadir un error summary o patrón de anuncio más robusto cuando haya varios errores
- [ ] revisar asociación `aria-describedby` y mensajes de ayuda/error

### Fase F. Tests

- [ ] tests de validadores separados por dominio
- [ ] tests RTL para formularios auth sin `ProfileContext`
- [ ] tests RTL para formularios de profile sin `AuthContext` como fuente de datos de presentación
