# Auth Context (Frontend)

## Objetivo

El `AuthContext` es la capa de sesión del frontend.

Su responsabilidad real debería ser:

- bootstrap de sesión autenticada
- persistencia local mínima de sesión
- refresh/logout
- estado de autenticación y permisos básicos

No debería ser la fuente principal de datos de perfil del usuario.

## Requisito de reutilizacion

Este dominio no debe seguir leyendose solo como contexto interno de esta app.

Debe evolucionar hacia una base reusable para proyectos multi-client que compartan:

- autenticacion
- restauracion de sesion
- permisos basicos por rol
- flujos publicos de auth

Esto implica:

- minimizar dependencias a dominios de negocio de este proyecto
- dejar el contrato de sesion cerrado y portable
- documentar flujos y estados visibles de forma reproducible

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
- el contexto ya expone metadatos de origen de sesión para distinguir `server`, `storage`, `default` y `dev-fallback`

### Fallback temporal de desarrollo

Comportamiento activo en esta fase:

- si `GET /api/auth/me` o el ciclo `refreshToken() -> getAuthUser()` falla por timeout, red o `5xx`, `AuthContext` conserva la sesión local en vez de degradarla automáticamente a `guest`
- si no existe cache previa y el backend no está accesible en `development`, el contexto puede crear una sesión local `dev-fallback`
- el contexto expone:
  - `source`
  - `isOffline`
  - `lastSyncAt`

Objetivo de este fallback:

- permitir seguir usando navbar, guards blandos y flujo de perfil durante desarrollo sin backend levantado
- distinguir caída temporal del backend de expiración real de sesión

Restricción importante:

- este comportamiento es temporal y solo existe para desarrollo local
- antes del despliegue final debe revertirse o quedar desactivado fuera de desarrollo

### Estado actual de CSRF en frontend

Comportamiento activo:

- el frontend mantiene el CSRF en memoria para uso inmediato
- además persiste una copia de respaldo en `sessionStorage`
- cuando el token en memoria falta, el dominio `api` intenta rehidratarlo desde `sessionStorage` antes de enviar rutas protegidas como `POST /api/auth/refresh-token`

Motivo:

- navegadores móviles pueden suspender o reciclar pestañas y perder memoria JS mientras el `refreshToken` cookie sigue vigente
- ese escenario dejaba sesiones parcialmente vivas pero incapaces de renovar `accessToken` por falta de header `x-csrf-token`

Límite actual:

- si el CSRF ya no es válido, el frontend todavía no tiene una vía dedicada para pedir uno nuevo sin relogin
- eso requiere soporte backend explícito

### Inconsistencias detectadas

1. El contrato base de sesión ya fue corregido, pero quedan consumidores externos por consolidar
- [authTypes.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/types/auth/authTypes.ts) ya modela `authId` y `userClientId` como identidad de sesión
- [authService.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/auth/authService.ts) ya normaliza `login`, `magic-login` y `GET /me` hacia `AuthUser`
- el problema real ya no está en el contrato base de `auth`, sino en consumidores externos que todavía mezclan identidad de sesión con perfil

2. `auth.email` sigue teniendo usos de presentación fuera de auth
- el objetivo del dominio sigue siendo tratar `auth.email` como dato de sesión
- parte de la UI ya migró a `profile.contactEmail`, pero aún quedan consumidores secundarios y defaults locales que siguen leyendo `auth.email`
- esto mantiene un acoplamiento innecesario entre sesión y perfil

3. La identidad canónica ya quedó cerrada en `userClientId`
- `AuthUser` ya no expone `userId`
- `auth`, `profile` y `worker` ya usan `userClientId` como identidad principal
- el cierre pendiente es solo verificar superficies externas o tipos auxiliares que no formen parte del núcleo ya corregido

4. `AuthContext` sigue impactando otros dominios por dependencias de sesión
- `ProfileContext` y `WorkerContext` todavía consumen parte del estado de sesión para defaults, continuidad o bootstrap local
- esos acoplamientos ya no bloquean el runtime principal, pero sí bloquean el cierre limpio del dominio reusable

5. La separación de formularios avanzó, pero no está cerrada del todo
- la separación física inicial entre formularios de auth y profile ya existe
- `FormWrapper` auth ya no depende de `useProfile()` ni `useWorker()`
- siguen pendientes contratos tipados más específicos por flujo y algunas decisiones de inicialización

6. Los flujos compuestos ya mejoraron, pero su regla reusable todavía debe cerrarse
- `verify-email` ya fue corregido para comportarse más cerca de una operación compuesta única
- falta convertir esa decisión en regla documental estable para todo el dominio auth
- mientras eso no ocurra, cada página seguirá pudiendo reinventar su propia secuencia de alertas

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

Decisión adicional para flujos:

- un flujo auth debe modelarse como una unidad funcional y visual
- no se debe exponer un `success` intermedio si el flujo todavía no terminó
- en flujos compuestos exitosos el estado visible debe permanecer en `loading` hasta la confirmación final

## Cambios necesarios en Auth

### Fase 1. Documentación y tipado

- [x] documentar contrato real de `AuthContext`
- [x] decidir si `AuthUser` expone `authId` y/o `userClientId` explícitos o si se adapta a un modelo frontend reducido de sesión
- [x] introducir `authId` y `userClientId` en el modelo frontend de sesión
- [x] eliminar `userId` del modelo operativo de sesión y dominios relacionados
- [x] documentar explícitamente que `auth` no es owner del perfil

### Fase 2. Modelo frontend

- [x] actualizar [authTypes.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/types/auth/authTypes.ts) para reflejar el payload backend real
- [x] revisar [authService.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/auth/authService.ts) para tipar correctamente `GET /api/auth/me`
- [x] adaptar `login` y `magic login` a envelope tipado con normalización de sesión
- [x] adaptar `refreshAuth` al contrato real
- [x] eliminar `userId` del contrato principal de `AuthUser`
- [ ] verificar superficies externas residuales para confirmar que ya no arrastran identidad antigua

### Fase 3. Responsabilidad del contexto

- [x] mantener en `auth` solo:
  - identidad de sesión
  - estado de autenticación
  - rol
  - verificación
  - flags de sesión (`isLogged`, `isNewUser`)
- [x] exponer metadatos de origen/offline para distinguir bootstrap desde backend, storage local y fallback dev
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

### Fase 6. Orquestación visual de flujos

- [ ] documentar los estados visibles permitidos por cada flujo auth
- [ ] evitar secuencias `loading -> success -> loading -> success` en flujos compuestos
- [ ] tratar `verify-email -> magic-login -> refreshAuth` como una sola operación visible
- [ ] revisar si `AlertContext` necesita una API específica para flujos compuestos o si basta una convención de uso

### Fase 7. Recuperación robusta de CSRF

- [x] persistir respaldo de CSRF en `sessionStorage`
- [x] rehidratar CSRF desde `sessionStorage` antes de rutas protegidas
- [ ] añadir endpoint backend para reemitir/bootstrapping de CSRF válido sin depender del valor previo en memoria
- [ ] definir cuándo el frontend debe intentar recuperar CSRF antes de degradar la sesión a login manual

## Riesgos

- mover el consumo de email sin exponer primero `contactEmail` en `ProfileContext` deja vistas sin dato

## Sugerencia de ejecución

No conviene implementar `auth` aislado del `profile`.

Recomendación:

1. corregir primero el contrato tipado/documentado de `auth`
2. exponer `contactEmail` en `profile`
3. migrar consumidores de UI desde `auth.email` a `profile.contactEmail`
4. corregir la separación entre formularios de auth y formularios de perfil
5. dejar `auth.email` solo como dato de sesión donde el flujo auth lo siga necesitando
6. cerrar la orquestación visual de flujos antes del pulido final

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
- mantener `userClientId` como única identidad de sesión soportada

Resultado esperado:

- `AuthContext` deja una identidad de sesión única y explícita

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

Estado temporal adicional en desarrollo:

- `auth` tolera caída de backend usando la última sesión persistida
- cuando no existe sesión persistida, puede crear una sesión local de desarrollo para no bloquear el resto del árbol
- esto no debe considerarse comportamiento final de producción

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
- `login` y `magic-login` ya persisten el payload normalizado completo en cliente y dashboard

Pendiente para la siguiente fase:

- eliminar dependencia activa de `userId`
- corregir formularios y consumidores de `auth.email`

Completado adicionalmente en esta iteración:

- [AuthContext](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/authContext.tsx) ya normaliza el modelo actual de sesión
- se añadieron tests de hidratación para guest y storage legado:
  - [auth-context.test.jsx](/home/heriberto/Escritorio/Havenova/havenova/tests/jest/contexts/auth-context.test.jsx)
- se completó la separación física inicial de componentes de usuario:
  - `packages/components/client/user/auth/*`
  - `packages/components/client/user/profile/*`
  - guía: [packages/components/client/user/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/README.md)

Pendiente real a partir del estado actual:

- siguen existiendo consumidores de `auth.email` como dato de presentación en fallbacks y defaults secundarios fuera del flujo auth
- la identidad principal ya quedó cerrada en `userClientId`; solo queda verificar superficies externas residuales

Actualización:

- la vista principal de perfil ya migró a `profile.contactEmail`
- `auth.email` sigue quedando pendiente solo en consumidores secundarios o donde el dato sigue siendo de sesión

Completado en la separación inicial de formularios:

- [FormWrapper.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/userForm/formWrapper/FormWrapper.tsx) ya recibe `initialValues` y callbacks desde cada página auth sin depender de `useProfile()` ni `useWorker()`
- [Form.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/userForm/form/Form.tsx) ya no renderiza `name`, `phone`, `address` ni otros campos de perfil
- se creó una variante de perfil separada en:
  - `packages/components/client/user/profile/profileForm/*`
- las pantallas de profile dejaron de importar el form desde la carpeta de auth

## Estado Actual Del Formulario Compartido

Componente afectado principal:

- [FormWrapper.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/userForm/formWrapper/FormWrapper.tsx)
- [Form.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/userForm/form/Form.tsx)
- [userFormValidator.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/validators/userFormValidator/userFormValidator.ts)

### Diagnóstico actual

1. La separación de dominios ya avanzó, pero faltan contratos más cerrados por flujo

- `FormWrapper` auth ya no consume `useProfile()` ni `useWorker()`
- la deuda principal dejó de ser el acoplamiento runtime y pasó a ser la precisión del contrato por flujo
- siguen faltando tipos más específicos para login, register, forgot-password y reset-password

2. Persisten decisiones de inicialización que conviene cerrar explícitamente

- auth ya recibe `initialValues` desde cada página
- todavía conviene decidir con más rigor qué campos deben inyectarse desde contenedor, especialmente `clientId`, `language` y ciertos defaults de continuidad de flujo

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

6. El acoplamiento visual residual ya no está en `profile`, sino en la reutilización excesiva del mismo wrapper

- `Form.tsx` auth ya no depende de `profile` para renderizar campos de perfil
- el riesgo actual es seguir usando una superficie demasiado genérica para flujos auth con necesidades distintas

## Cambios Propuestos Para El Formulario

### Fase A. Separación de ownership

- [x] crear una separación física inicial para formularios/componentes de autenticación
- [x] crear una separación física inicial para componentes de perfil
- [x] crear una variante o capa específica para formularios de autenticación
- [x] crear una variante o capa específica para formularios de perfil
- [x] dividir el formulario por dominio para evitar que auth siga compartiendo markup y estado con profile

### Fase B. Contratos tipados por dominio

- [ ] definir tipos específicos:
  - `AuthLoginFormData`
  - `AuthRegisterFormData`
  - `AuthForgotPasswordFormData`
  - `AuthResetPasswordFormData`
  - `ProfileFormData`
- [ ] dejar de usar un `FormData` genérico mezclado para todos los casos

### Fase C. Estado e inicialización

- [x] eliminar de formularios auth la dependencia de `useProfile()` y `useWorker()`
- [ ] pasar `initialValues` explícitos desde cada página/container
- [ ] decidir si `clientId` se inyecta desde container o si sigue siendo un hidden/runtime field de auth

### Fase D. Validadores

- [x] separar validadores por dominio:
  - `authFormValidator`
  - `profileFormValidator`
  - `contactFormValidator`
- [ ] revisar reglas de nombre/teléfono para no imponer restricciones innecesarias
- [x] evitar reutilizar el validador de password fuerte en login
- [ ] deduplicar address/serviceAddress

### Fase E. Accesibilidad

- [x] internacionalizar labels accesibles del toggle de password
- [x] revisar `autocomplete` por caso:
  - login: `current-password`
  - register/reset: `new-password`
- [x] mover foco al primer error de validación
- [x] añadir un error summary o patrón de anuncio más robusto cuando haya varios errores
- [x] revisar asociación `aria-describedby` y mensajes de ayuda/error

### Fase F. Tests

- [ ] tests de validadores separados por dominio
- [x] tests RTL para formularios auth sin `ProfileContext`
- [ ] tests RTL para formularios de profile sin `AuthContext` como fuente de datos de presentación

## Próximo Paso Recomendado

El siguiente paso de trabajo debería ser cerrar el ownership del formulario de auth:

1. recortar [FormWrapper.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/userForm/formWrapper/FormWrapper.tsx) para que dependa solo de `useAuth()` y `useClient()`
2. sacar de [Form.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/auth/userForm/form/Form.tsx) los campos de perfil (`name`, `phone`, `address`)
3. dejar el contrato de auth limitado a:
   - `email`
   - `password`
   - `clientId`
   - `language`
   - `tosAccepted`
4. después separar validadores de auth vs profile, y recién ahí entrar en accesibilidad y tests del form

Razón:

- hoy el mayor acoplamiento ya no está en `AuthContext`
- está en el formulario compartido y en cómo hidrata datos de `profile`/`worker` durante flows de auth

Estado tras este paso:

- ese acoplamiento principal ya quedó eliminado del formulario de auth
- el siguiente bloque de trabajo debe centrarse en:
  1. revisar restricciones de validación por dominio
  2. extender tests a validadores y formularios de profile
  3. reducir compatibilidad transitoria donde ya no haga falta

Completado adicionalmente en esta iteración:

- se añadieron módulos separados:
  - `packages/utils/validators/authFormValidator/*`
  - `packages/utils/validators/profileFormValidator/*`
  - `packages/utils/validators/contactFormValidator/*`
- `userFormValidator` queda como capa de compatibilidad transitoria
- se añadieron tests RTL del formulario auth en:
  - [tests/jest/components/auth-form.test.jsx](/home/heriberto/Escritorio/Havenova/havenova/tests/jest/components/auth-form.test.jsx)
- el formulario auth ahora:
  - mueve foco al primer campo inválido
  - muestra un resumen de errores accesible
  - usa `aria-describedby` coherente entre hint y error de password
  - expone labels accesibles localizados para mostrar/ocultar contraseña
- la suite actual pasa:
  - `npm run -s test:contexts:ui`
  - `npm run -s test:client-context`
