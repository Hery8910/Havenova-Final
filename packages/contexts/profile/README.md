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

### Inconsistencias detectadas

1. El tipo frontend no incluye el email del perfil
- [profileTypes.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/types/profile/profileTypes.ts) no declara `contactEmail`
- esto desalineaa el contrato respecto al backend

2. El servicio normaliza un perfil incompleto respecto al backend
- [profileService.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/profile/profileService.ts) no preserva `contactEmail`
- aunque el backend lo devuelva, el frontend no lo modela explícitamente

3. El contexto no expone `contactEmail`
- [ProfileContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/profile/ProfileContext.tsx) construye `createEmptyProfile()` y `normalizeProfile()` sin campo de email
- el perfil local queda sin ese dato aunque backend ya lo soporte

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

- [ ] añadir `contactEmail` a `UserClientProfile`
- [ ] revisar si `DeleteUserClientProfileResponse` y otros tipos siguen usando `userId` o deben cambiar a una identidad más coherente con la nueva decisión de dominio
- [ ] alinear el identity model de perfil con la decisión actual del proyecto y con el backend real donde aplique
- [ ] documentar explícitamente que el perfil no depende de `auth` como owner semántico

### Fase 2. Servicio

- [ ] asegurar que [profileService.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/profile/profileService.ts) preserve `contactEmail`
- [ ] verificar que el create/get/update response contract se tipa con el payload real

### Fase 3. Contexto

- [ ] incluir `contactEmail` en `createEmptyProfile()`
- [ ] incluir `contactEmail` en `normalizeProfile()`
- [ ] preservar `contactEmail` en `applyProfile()`
- [ ] asegurar que el perfil guest/local no invente un email si no existe sesión

### Fase 4. Consumidores

- [ ] migrar componentes de presentación desde `auth.email` a `profile.contactEmail`
- [ ] revisar `WorkerContext` para decidir si debe seguir usando `auth.email` o si necesita su propia fuente de perfil de worker
- [ ] revisar formularios/contact/support donde hoy se mezcla `auth.email` con datos de perfil

### Fase 5. Formularios de perfil

- [ ] separar explícitamente el formulario de perfil del formulario de autenticación
- [ ] revisar `FormWrapper`, `userForm` y validators compartidos para decidir qué piezas se quedan como shared y cuáles pasan a profile
- [ ] corregir formularios actuales de edición de perfil para que su contrato quede alineado con `ProfileContext`
- [ ] evitar que reglas de auth condicionen la UX del formulario de perfil

### Fase 6. Tests

- [ ] tests de tipos/servicio para `contactEmail`
- [ ] tests de `ProfileContext` para bootstrap, persistencia y exposición del email
- [ ] tests de integración `AuthProvider + ProfileProvider` para comprobar que el perfil no depende de renderizar `auth.email`

## Riesgos

- si se migra la UI antes de exponer `contactEmail`, varias pantallas quedarán sin email visible
- si se cambia `userId` a `userClientId` sin estrategia coordinada con `auth`, el bootstrap del perfil puede romperse

## Sugerencia de ejecución

Conviene analizar `auth` y `profile` juntos, pero implementarlos en dos tareas coordinadas:

1. `Auth`: alinear contrato y tipo de identidad de sesión
2. `Profile`: exponer `contactEmail`, ajustar identidad de perfil y mover consumidores de UI
3. corregir separación de formularios auth/profile como parte del cierre de ambos dominios

Eso reduce riesgo porque el ownership del email depende de ambos dominios.
