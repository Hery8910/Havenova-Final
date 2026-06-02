# Profile Context (Frontend)

## Objetivo

El `ProfileContext` debe ser la fuente de verdad de los datos del usuario dentro del tenant.

Su responsabilidad real debería ser:

- bootstrap y persistencia del perfil por identidad propia de perfil dentro del tenant
- datos personales y de contacto del usuario
- preferencias de experiencia
- direcciones y metadatos de perfil

No debería delegar datos de presentación del usuario en `AuthContext`.

## Contrato backend relevante

Según el dominio backend `profile`:

- el perfil está scoped por `userClientId + clientId`
- el modelo persiste `contactEmail`
- `contactEmail` es denormalizado desde `auth.email`
- `contactEmail` no se envía en create/update
- create/get/update sincronizan ese valor desde la sesión autenticada

Conclusión:

- el frontend debería exponer `contactEmail` como parte de `UserClientProfile`
- para mostrar datos de contacto del usuario se debería consumir `profile.contactEmail`
- la relación semántica entre `profile` y `auth` debe mantenerse desacoplada en frontend
- el perfil no debe depender de que `auth` siga existiendo como owner lógico del dato

## Estado actual en frontend

### Alineado

- `ProfileContext` ya funciona como estado de perfil por tenant
- crea/lee/actualiza perfil con:
  - `createUserClientProfile`
  - `getUserClientProfile`
  - `updateUserClientProfile`
- ya existe estrategia de bootstrap automático para `isNewUser`
- el contexto ya expone metadatos de origen de perfil para distinguir `server`, `storage`, `default` y `dev-fallback`

### Fallback temporal de desarrollo

Comportamiento activo en esta fase:

- el perfil sigue funcionando con persistencia local aunque el backend falle por timeout, red o `5xx`
- el storage local ahora se separa por `clientId + userClientId` para no mezclar perfiles distintos dentro del mismo tenant
- si existe auth utilizable pero no existe perfil cacheado y el backend no está accesible en `development`, el contexto puede crear un perfil local `dev-fallback`
- el contexto expone:
  - `source`
  - `isOffline`
  - `lastSyncAt`

Objetivo de este fallback:

- poder editar y leer datos de perfil durante desarrollo con el backend apagado
- evitar que el perfil dependa de que la primera lectura remota funcione

Restricción importante:

- este comportamiento es temporal y solo existe para desarrollo local
- antes del despliegue final debe revertirse o quedar desactivado fuera de desarrollo

### Inconsistencias detectadas

1. El tipo frontend ya incluye `contactEmail`, pero faltaba cerrar su uso
- [profileTypes.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/types/profile/profileTypes.ts) ya declara `contactEmail`
- el trabajo pendiente real estaba en volverlo estable en servicio/contexto y migrar consumidores de UI

2. El servicio necesitaba preservar `contactEmail` de forma explícita
- [profileService.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/profile/profileService.ts) ya normaliza `contactEmail`
- eso evita que el dato se pierda en la normalización frontend

3. El contexto ya expone `contactEmail`
- [ProfileContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/profile/ProfileContext.tsx) ya lo incluye en `createEmptyProfile()` y `normalizeProfile()`
- faltaba fijarlo con tests y dejar de depender de `auth.email` en la UI de perfil

4. La identidad base del perfil debe reflejar la nueva decisión de dominio
- el frontend sigue usando `userId` como identidad interna del perfil
- pero la decisión actual es dejar de vincular perfil a `auth` como owner lógico
- hay que revisar qué identidad mínima necesita realmente el perfil en frontend para persistencia local, delete y responses
- el objetivo es que eliminar perfil no implique mantener una relación funcional con `auth`

5. La UI sigue leyendo el email desde `auth`
- ejemplo claro: [dashboard profile page](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(app)/profile/page.tsx:183)
- eso evita aprovechar el contrato nuevo del perfil

6. Los formularios de perfil comparten infraestructura con auth sin límites claros
- hoy el proyecto reutiliza `FormWrapper` y piezas de `userForm` tanto en auth como en profile
- eso ya funciona, pero falta separar correctamente qué parte pertenece a autenticación y cuál a edición de perfil
- esto complica validaciones, mantenimiento y tests
 
Estado actualizado:

- la separación física y funcional inicial ya se completó:
  - `packages/components/client/user/auth/userForm/*`
  - `packages/components/client/user/profile/profileForm/*`
- el formulario de profile ya no depende de `AuthContext`
- los validadores de profile ya viven en `packages/utils/validators/profileFormValidator/*`

## Decisión de diseño propuesta

Usar el campo backend `contactEmail` también en frontend, sin renombrarlo a `email`.

Razón:

- mantiene alineación 1:1 con el contrato backend
- deja claro que no es la fuente auth primaria
- evita mezclar semántica de sesión con semántica de perfil
- acompaña la decisión de no vincular el perfil a `auth` como owner lógico

Los componentes pueden mostrarlo como “email” en UI, pero el modelo debería seguir siendo `contactEmail`.

## Cambios necesarios en Profile

### Fase 1. Tipos y contrato

- [x] añadir `contactEmail` a `UserClientProfile`
- [ ] revisar si `DeleteUserClientProfileResponse` y otros tipos siguen usando `userId` o deben cambiar a una identidad más coherente con la nueva decisión de dominio
- [ ] alinear el identity model de perfil con la decisión actual del proyecto y con el backend real donde aplique
- [ ] documentar explícitamente que el perfil no depende de `auth` como owner semántico

### Fase 2. Servicio

- [x] asegurar que [profileService.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/profile/profileService.ts) preserve `contactEmail`
- [ ] verificar que el create/get/update response contract se tipa con el payload real

### Fase 3. Contexto

- [x] incluir `contactEmail` en `createEmptyProfile()`
- [x] incluir `contactEmail` en `normalizeProfile()`
- [x] preservar `contactEmail` en `applyProfile()`
- [x] separar el storage local por identidad de usuario dentro del tenant
- [x] exponer metadatos de origen/offline para distinguir backend, storage y fallback dev
- [ ] asegurar que el perfil guest/local no invente un email si no existe sesión

### Fase 4. Consumidores

- [x] migrar la vista principal de perfil desde `auth.email` a `profile.contactEmail`
- [ ] migrar componentes de presentación restantes desde `auth.email` a `profile.contactEmail`
- [ ] revisar `WorkerContext` para decidir si debe seguir usando `auth.email` o si necesita su propia fuente de perfil de worker
- [ ] revisar formularios/contact/support donde hoy se mezcla `auth.email` con datos de perfil

### Fase 5. Formularios de perfil

- [x] separar explícitamente el formulario de perfil del formulario de autenticación
- [x] revisar `FormWrapper`, `userForm` y validators compartidos para decidir qué piezas se quedan como shared y cuáles pasan a profile
- [x] corregir formularios actuales de edición de perfil para que su contrato quede alineado con `ProfileContext`
- [x] evitar que reglas de auth condicionen la UX del formulario de perfil
- [x] suavizar validaciones de profile para nombres internacionales, teléfonos con formato flexible y direcciones más realistas

### Fase 6. Tests

- [x] tests de tipos/servicio para `contactEmail`
- [x] tests de `ProfileContext` para bootstrap, persistencia y exposición del email
- [ ] tests de integración `AuthProvider + ProfileProvider` para comprobar que el perfil no depende de renderizar `auth.email`
- [x] tests RTL del formulario de profile sin `AuthContext`
- [x] tests unitarios de validadores por dominio

## Riesgos

- si se migra la UI antes de exponer `contactEmail`, varias pantallas quedarán sin email visible
- si se cambia `userId` a `userClientId` sin estrategia coordinada con `auth`, el bootstrap del perfil puede romperse

## Sugerencia de ejecución

Conviene analizar `auth` y `profile` juntos, pero implementarlos en dos tareas coordinadas:

1. `Auth`: alinear contrato y tipo de identidad de sesión
2. `Profile`: exponer `contactEmail`, ajustar identidad de perfil y mover consumidores de UI
3. corregir separación de formularios auth/profile como parte del cierre de ambos dominios

Eso reduce riesgo porque el ownership del email depende de ambos dominios.

## Estado actual de implementación

Completado en esta fase:

- existe un formulario de profile dedicado en:
  - [packages/components/client/user/profile/profileForm](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileForm)
- el formulario de profile ya:
  - renderiza solo campos de profile
  - no depende de `AuthContext`
  - mueve el foco al primer error
  - expone resumen de errores accesible
- los validadores de profile están separados de auth/contact en:
  - [packages/utils/validators/profileFormValidator](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/validators/profileFormValidator)
- las reglas se flexibilizaron para:
  - nombres internacionales
  - teléfonos con separadores/formatos comunes
  - direcciones más largas y con caracteres Unicode
- hay cobertura de tests en:
  - [tests/jest/components/profile-form.test.jsx](/home/heriberto/Escritorio/Havenova/havenova/tests/jest/components/profile-form.test.jsx)
  - [tests/jest/validators/form-validators.test.jsx](/home/heriberto/Escritorio/Havenova/havenova/tests/jest/validators/form-validators.test.jsx)
  - [tests/jest/contexts/profile-context.test.jsx](/home/heriberto/Escritorio/Havenova/havenova/tests/jest/contexts/profile-context.test.jsx)
  - [tests/client-context/client-contracts.test.mjs](/home/heriberto/Escritorio/Havenova/havenova/tests/client-context/client-contracts.test.mjs)
- `contactEmail` ya quedó:
  - tipado como campo explícito del perfil
  - preservado por el servicio
  - expuesto por el contexto
  - consumido por la vista principal de perfil sin fallback a `auth.email`

Pendiente principal a partir de ahora:

1. migrar consumidores secundarios de UI desde `auth.email` a `profile.contactEmail`
2. revisar identidad de perfil (`userId`/`userClientId`) con la nueva decisión de dominio
3. decidir el contrato final de delete/responses del perfil

Pendiente adicional antes de despliegue:

1. revertir o desactivar el `dev-fallback` del perfil
2. revisar si `source/isOffline/lastSyncAt` deben mantenerse como API pública del contexto o volver a estado interno
