# Auditoria Del Dominio Auth En Frontend

## Proposito

Este documento consolida el estado actual real del dominio `auth` en este proyecto frontend, lo compara contra el contrato backend vigente y deja un plan de trabajo cerrado para rectificar el dominio antes del despliegue controlado/restringido.

Su objetivo es:

- fijar el contrato frontend operativo de `auth`
- fijar `auth` como dominio reusable y reproducible entre proyectos multi-client
- identificar desalineaciones reales frente al backend y frente al estado esperado del propio frontend
- separar lo ya alineado de lo que sigue en transicion
- documentar los flujos esperados y su comportamiento visual/funcional
- definir un plan de trabajo ejecutable y ordenado

## Requisito Estructural De Migracion

El dominio `auth` no debe seguir tratandose como una implementacion acoplada a este proyecto concreto.

Decision cerrada para la migracion:

- todo lo referido a autenticacion, autorizacion base y estado de sesion debe tratarse como una entidad separada
- esa entidad debe poder reutilizarse en futuros proyectos multi-client con cambios minimos
- la personalizacion por proyecto debe quedar limitada, idealmente, a configuracion, textos, branding, rutas externas o adaptadores del dominio consumidor

Esto aplica a:

- contexto de sesion
- tipos
- servicios
- helpers
- componentes de flujo auth
- manejo de errores y mensajes
- contratos de permisos basicos
- documentacion de flujos

Implicacion de arquitectura:

- `auth` debe converger hacia un modulo de plataforma, no hacia una capa ad hoc de una sola app
- las dependencias a `profile`, `worker`, formularios de negocio o convenciones visuales especificas del proyecto deben reducirse o encapsularse

## Criterios De Reutilizacion Que Debe Cumplir El Dominio

Para considerar `auth` reusable en proximos proyectos, la migracion debe dejar cerrados estos criterios:

### 1. Separacion de responsabilidades

- `auth` resuelve sesion, identidad autenticada, rol y estado de verificacion
- `auth` no debe asumir ownership del perfil de negocio
- `auth` no debe depender conceptualmente de `profile`, `worker` u otros dominios verticales

### 2. Contrato estable y portable

- el modelo de sesion debe estar cerrado y tipado
- los flujos canonicos deben estar documentados con inputs, outputs y side effects frontend
- la semantica de errores y estados intermedios debe ser consistente

### 3. Personalizacion acotada

- textos y copy via i18n
- branding y layout via shell visual desacoplado
- rutas de continuacion via configuracion o adaptadores
- comportamiento base de flujo sin forks por proyecto

### 4. Comportamiento visual reproducible

- los flujos auth deben tener reglas comunes de loading, success, error y confirm
- el `AlertContext` no debe producir transiciones visuales erraticas en flujos compuestos
- los estados visuales deben modelarse por flujo, no por llamada HTTP aislada

## Fuentes Revisadas

Contrato backend y referencia previa:

- [FRONTEND_INTEGRATION.md](/home/heriberto/Escritorio/Backend/havenova-backend/src/core/auth/FRONTEND_INTEGRATION.md:1)
- [AUTH_DOMAIN_AUDIT.md](/home/heriberto/Escritorio/Backend/havenova-backend/src/core/auth/AUTH_DOMAIN_AUDIT.md:1)
- [BACKEND.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/BACKEND.md:1)

Implementacion frontend auditada:

- [authContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/authContext.tsx:1)
- [authTypes.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/types/auth/authTypes.ts:1)
- [authService.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/auth/authService.ts:1)
- [api.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/api/api.ts:1)
- [README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/README.md:1)
- [apps/client/(auth) README](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/README.md:1)
- [apps/client login](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/login/page.tsx:1)
- [apps/client register](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/register/page.tsx:1)
- [apps/client verify-email](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/verify-email/page.tsx:1)
- [apps/dashboard login](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/user/login/page.tsx:1)
- [userHandler.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/user/userHandler.ts:1)
- [ProfileContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/profile/ProfileContext.tsx:1)
- [WorkerContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/worker/WorkerContext.tsx:1)
- [ContactForm.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/ContactForm/ContactForm.tsx:1)
- [ProfileOverviewPage.client.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileOverview/ProfileOverviewPage.client.tsx:1)
- [ServiceRequestAddressStep.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/shared/serviceRequest/ServiceRequestAddressStep/ServiceRequestAddressStep.tsx:1)

## Diagnostico Ejecutivo

El dominio `auth` en frontend no esta roto a nivel de superficie principal, pero tampoco esta cerrado para despliegue controlado.

Estado real:

- el contrato HTTP base esta bastante alineado con backend
- el `AuthContext` ya fue movido hacia un modelo de sesion mas correcto
- la identidad principal ya quedo cerrada en `userClientId`
- la deuda activa ya no esta en compatibilidad legacy, sino en consumidores residuales, politicas de entorno y flujos compuestos
- `auth` ya corre sobre rutas same-origin del frontend y la capa BFF canonica ya existe en el workspace

Conclusion cerrada:

- `auth` puede seguir usandose para desarrollo y para integracion incremental
- `auth` no deberia considerarse listo para despliegue restringido hasta cerrar consumidores residuales, politicas de fallback por entorno y contratos visuales de flujo

## Decision Cerrada De Integracion

La estrategia de producto para este dominio ya no debe ser:

- endurecer indefinidamente la integracion browser-direct cross-origin

La decision cerrada es:

- el navegador debe hablar con el frontend
- el frontend debe hablar con el backend central
- `auth` sera el primer dominio migrado a esa capa
- otros servicios deberan migrar progresivamente despues

Consecuencia documental:

- toda referencia a `cross-origin directo` debe tratarse como estado transicional o evidencia historica
- no como arquitectura objetivo

## Contrato Canonico Backend Que El Frontend Debe Respetar

Segun el backend:

- la autenticacion es `cookie-based`
- la fuente de verdad de sesion posterior al login es `GET /api/auth/me`
- la identidad de sesion tenant-aware es `authId + userClientId + clientId`
- `verify-email` no crea sesion
- `magic-login` si crea sesion
- `refresh-token` requiere `x-csrf-token`
- `register`, `forgot-password`, `resend-verification`, `change-email` y el caso especial de `login` deben soportar `x-frontend-origin`

Payload de sesion documentado:

- `authId`
- `userClientId`
- `clientId`
- `email`
- `role`
- `status`
- `isVerified`
- `isNewUser` en respuestas tipo login

## Estado Actual Que Ya Esta Alineado

### 1. Cliente HTTP y headers

El cliente HTTP ya centraliza correctamente los headers relevantes:

- `x-csrf-token` para:
  - `/api/auth/refresh-token`
  - `/api/auth/update-password`
  - `/api/auth/change-email`
  - `/api/auth/logout`
  - `/api/auth/logout-all-sessions`
- `x-frontend-origin` para:
  - `/api/auth/register`
  - `/api/auth/login`
  - `/api/auth/forgot-password`
  - `/api/auth/resend-verification`
  - `/api/auth/change-email`

Referencia:

- [api.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/api/api.ts:1)

### 2. Superficie de servicios auth

La capa de servicios ya habla con las rutas canonicas actuales del backend:

- `register`
- `login`
- `me`
- `refresh-token`
- `verify-email`
- `magic-login`
- `forgot-password`
- `reset-password-confirm`
- `change-email`
- `change-email/confirm`
- `logout`
- `logout-all-sessions`

Referencia:

- [authService.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/auth/authService.ts:1)

### 3. Modelo de sesion frontend mejorado respecto al estado antiguo

El frontend ya introdujo:

- `authId`
- `userClientId`
- `clientId`

Y el servicio ya normaliza payload backend hacia `AuthUser`.

Referencia:

- [authTypes.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/types/auth/authTypes.ts:1)
- [authService.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/auth/authService.ts:1)

### 4. Bootstrap y persistencia local de sesion

`AuthContext` ya implementa:

- bootstrap desde `GET /me`
- intento de `refresh-token` ante `401/403`
- persistencia local en `hv-auth`
- limpieza coordinada de `hv-auth`, `hv-worker-profile` y `hv-profile:*`

Referencia:

- [authContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/authContext.tsx:1)

### 5. Flujo `verify-email -> magic-login`

El flujo principal ya existe y esta implementado como recomienda backend:

- `verify-email`
- lectura de `magicToken`
- `magic-login`
- `refreshAuth()`

Referencias:

- [verify-email page](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/verify-email/page.tsx:1)
- [userHandler.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/user/userHandler.ts:1)

## Matriz De Flujos Que Debe Quedar Documentada

Cada flujo auth debe quedar documentado con el mismo esquema:

- objetivo del flujo
- entradas requeridas
- llamadas HTTP implicadas
- estados visuales permitidos
- errores esperados y mensajes
- side effects de sesion/storage
- criterio de fin del flujo

Flujos minimos obligatorios:

- register
- login
- verify-email
- magic-login
- resend-verification
- forgot-password
- reset-password-confirm
- refresh-session bootstrap
- logout
- logout-all-sessions
- change-email
- change-email/confirm

## Desalineaciones Reales Detectadas

### 0. La capa BFF canónica ya quedó introducida

Estado actual:

- `auth` ya usa rutas same-origin `/api/auth/*` desde el navegador
- la integración browser-direct quedó relegada a clientes transicionales o a documentación histórica
- la capa server-side ya reenvía `x-csrf-token`, `cookie` y `x-frontend-origin` según el contrato del backend

Impacto:

- la base reusable de `auth` ya no depende del contrato browser-direct para funcionar
- la deuda real se desplaza desde infraestructura de transporte hacia consumidores, guards y flujos compuestos

Pendiente real:

- recortar o reclasificar documentación que todavía describa el estado pre-BFF
- seguir migrando otros dominios al mismo patrón reusable

Pendiente adicional ya cerrado como decisión:

- la recuperación no debe depender de una cookie `csrfToken`
- el contrato correcto es reemitir CSRF por `GET /api/auth/csrf` antes de `refresh-token`
- ver [AUTH_CSRF_SESSION_RECOVERY_DECISION.md](/home/heriberto/Escritorio/Havenova/havenova/docs/AUTH_CSRF_SESSION_RECOVERY_DECISION.md:1)

### 1. La persistencia post-login principal ya fue corregida

Estado actual verificado:

- `loginUser()` devuelve un `user` normalizado con contrato de sesion coherente
- cliente y dashboard ya persisten `setAuth(user)` sin mezclar estado previo de sesion
- el problema ya no es la omision de `authId`, `userClientId` o `status` en el login principal

Referencias:

- [apps/client login](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/login/page.tsx:1)
- [apps/dashboard login](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/user/login/page.tsx:1)
- [authService.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/auth/authService.ts:1)

Pendiente real:

- verificar que todos los caminos secundarios que escriben sesion mantengan la misma coherencia
- mantener seeds explicitos para estados pre-auth como `register`, `email not verified` o borrado de cuenta
- concentrar la auditoria en consumidores residuales y no en el login base ya corregido

Estado actual de escrituras de sesion en runtime:

- `login` cliente y dashboard: `setAuth(user)`
- `verify-email -> magic-login`: `setAuth({ ...user, isNewUser: true })`
- `register`, `email not verified` y borrado de cuenta: seeds logged-out explicitos
- `ProfileContext`: limpieza puntual de `isNewUser`

Conclusion:

- ya no quedan escrituras de sesion que mezclen `...auth` previo con payloads de sesion exitosa

### 2. La identidad canónica ya quedó cerrada en `userClientId`

Estado actual:

- `auth` usa `userClientId` como identidad de sesion
- `profile` usa `userClientId` como identidad de perfil
- `worker` usa `userClientId` como identidad operativa

Esto aparece en:

- [authTypes.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/types/auth/authTypes.ts:1)
- [ProfileContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/profile/ProfileContext.tsx:1)
- [workerTypes.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/types/worker/workerTypes.ts:1)

Estado real:

- ya no existe compatibilidad activa con `userId` en `auth`, `profile` ni `worker`
- la deuda pendiente se limita a verificar consumidores o tipos auxiliares fuera de este nucleo
- la base actual puede tratar `userClientId` como unica identidad soportada

Decision:

- `userClientId` queda como unica identidad canonica soportada en frontend

### 3. El catalogo de roles ya acepta `super_admin`, pero falta cerrar su superficie operativa

Estado actual:

- `guest`
- `user`
- `worker`
- `admin`
- `super_admin`

Lo ya resuelto:

- `AuthRole` ya acepta `super_admin`
- `useRequireRole('admin')` ya permite acceso tambien a `super_admin`

Pendiente real:

- revisar si hay superficies de dashboard, notificaciones o permisos derivados que todavia asuman solo `admin`
- confirmar que el resto del frontend no codifique el catalogo de roles en unions parciales

Referencia:

- [authTypes.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/types/auth/authTypes.ts:1)
- [authContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/authContext.tsx:1)

Decision:

- el frontend debe seguir tratando `super_admin` como parte del catalogo canonico y no como excepcion temporal

### 4. `auth.email` sigue teniendo consumidores de presentacion

Aunque el objetivo documental ya dice que `auth.email` es dato de sesion y no de perfil, siguen existiendo consumidores de presentacion o defaults locales que dependen de el.

Casos verificados:

- fallback de nombre en [ProfileOverviewPage.client.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileOverview/ProfileOverviewPage.client.tsx:1)
- default local de worker en [WorkerContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/worker/WorkerContext.tsx:1)
- prefilling de contacto en [ContactForm.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/contact/ContactForm/ContactForm.tsx:1)

Estado real:

- `ContactForm` y `ProfileOverviewPageClient` ya priorizan `profile.contactEmail` sobre `auth.email`
- `WorkerContext` ya usa la misma convención compartida de resolución de email: dato local/propio primero y `auth.email` solo como fallback de sesión
- pero la migracion no esta cerrada

Decision:

- los consumidores de presentacion deben leer perfil
- `auth.email` debe quedar solo para autenticacion, continuidad de flujo y compatibilidad interna acotada

### 5. `register` ya no depende de `ProfileContext` antes de existir sesion

La página de registro ya no ejecuta persistencia local de `profile` antes del alta backend.

Estado actual:

- `register` construye solo el payload auth necesario
- el success deja continuidad mediante un seed logged-out/pre-auth en `auth`
- `ProfileContext` vuelve a entrar solo después de que exista sesión real y el árbol privado del usuario lo monte

Resultado:

- se elimina un acoplamiento conceptual innecesario entre onboarding auth y estado de profile
- el flujo público de registro queda más consistente con la regla de que `profile` no debe actuar como dependencia previa a la sesión

### 6. El fallback offline/dev del contexto auth sigue siendo una decision de despliegue pendiente

`AuthContext` mantiene este comportamiento:

- si backend cae por timeout/red/`5xx`, conserva sesion local
- si no hay cache y el entorno no es `production`, puede crear `dev-fallback`

Esto esta bien para desarrollo, pero necesita una decision cerrada antes de despliegue controlado.

Riesgo:

- si el despliegue restringido comparte condiciones que no sean estrictamente `production`, el fallback puede ocultar errores reales de integracion

Referencia:

- [authContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/authContext.tsx:1)

Decision:

- hay que dejar este comportamiento explicitamente prohibido fuera de local o protegido por flag dedicada

### 7. Los flujos no estan modelados aun como unidades visuales estables

Este hallazgo afecta directamente al objetivo de reutilizacion.

Estado actual:

- varias paginas disparan alertas por llamada HTTP individual
- el dominio `alert` soporta una sola alerta global activa
- cuando un flujo encadena varias llamadas exitosas, cada llamada reemplaza la alerta previa

Caso critico verificado:

- `verify-email` ejecuta:
  - loading de verificacion
  - success o continuidad
  - loading de magic-login
  - `refreshAuth()`
  - success final

Efecto visible:

- el usuario percibe cambios demasiado rapidos entre `loading`, `success`, `loading`, `success`
- el popup salta de estado varias veces en segundos
- el flujo se siente inestable aunque tecnicamente termine bien

Impacto de arquitectura:

- mientras el estado visual dependa de cada request por separado, el dominio no sera facilmente reusable
- un modulo reusable necesita modelar estados por flujo compuesto y no por request atomica

Decision cerrada:

- en flujos compuestos exitosos debe mantenerse un estado visual de `loading` continuo hasta la confirmacion final
- los `success` intermedios no deben renderizarse como alertas separadas
- las transiciones visuales permitidas deben declararse por flujo

### 8. La documentacion actual existe, pero esta fragmentada y mezcla estado actual con plan

Hoy hay documentacion util en:

- [packages/contexts/auth/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/README.md:1)
- [apps/client/(auth) README](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/README.md:1)

Problema:

- ambos documentos contienen mezcla de hallazgos historicos, decisiones parciales y tareas ya resueltas
- no funcionan como auditoria cerrada de rectificacion

Decision:

- este documento pasa a ser la referencia de auditoria del dominio frontend auth

## Acoplamientos Cruzados Que Deben Vigilarse

### `AuthContext` -> `ProfileContext`

El contrato de identidad ya quedó unificado en `userClientId`.

Estado:

- funcional
- pendiente solo de validacion final en consumidores secundarios y flujos de onboarding

### `AuthContext` -> `WorkerContext`

`WorkerContext` reutiliza el estado de sesion para completar defaults locales y continuidad de UI.

Estado:

- funcional
- con semantica acotada: dato propio primero y `auth.email` solo como fallback de sesion

### `AuthContext` -> formularios y pages auth

Cliente y dashboard login ya usan el payload normalizado completo de sesion.

Estado:

- funcional
- con deuda residual solo en caminos secundarios y en duplicacion de logica de flujo

### `AuthContext` -> formularios de negocio

Los formularios de negocio deben priorizar `profile.contactEmail` cuando el dato sea de presentacion y no reintroducir identidad derivada desde auth.

Estado:

- funcional
- pendiente de verificacion residual

### `Auth` -> `AlertContext`

Los flujos auth dependen hoy del sistema global de alertas, pero no existe aun un contrato de orquestacion por flujo compuesto.

Estado:

- funcional
- no reusable todavia como patron cerrado

## Riesgos De Despliegue

Riesgos prioritarios:

1. fallback dev/offline activo sin cierre de politica de entorno
2. consumidores secundarios que siguen tratando `auth.email` como dato de perfil
3. flujos compuestos con estados visuales inestables y comportamiento dificil de reutilizar
4. caminos secundarios de escritura de sesion que no esten inventariados formalmente

Riesgos secundarios:

1. superficies secundarias que todavia no contemplen `super_admin` de forma explicita
2. documentacion operativa dispersa
3. algunos flujos publicos todavia conservan wrappers o contratos duplicados entre apps
4. falta de contrato reusable de flujo y alertas

## Decisiones Cerradas Recomendadas

### 1. Que representa `AuthUser`

`AuthUser` debe representar exclusivamente la sesion frontend.

Debe incluir:

- `authId`
- `userClientId`
- `clientId`
- `email`
- `role`
- `status`
- `isVerified`
- `isLogged`
- `isNewUser`

`userClientId`:

- queda como unica identidad canonica soportada en frontend
- no deben reintroducirse aliases de identidad en nuevos consumidores

### 2. Fuente de verdad para email de presentacion

- `auth.email` queda como dato de sesion/auth
- `profile.contactEmail` queda como dato de presentacion y contacto del usuario

### 3. Politica de fallback

- conservar fallback offline y `dev-fallback` solo para desarrollo local
- no permitirlo implicitamente en staging o despliegue restringido

### 4. Politica de cierre de tipos

- el frontend ya acepta `super_admin` en el catalogo de roles
- cualquier surface que haga checks o unions parciales debe seguir esa misma decision

### 5. Politica de estados visuales por flujo

- el feedback visual debe modelarse por flujo de usuario, no por request individual
- en flujos compuestos exitosos se mantiene `loading` hasta el ultimo paso exitoso
- solo el error corta el loading intermedio
- solo el resultado final exitoso debe abrir el `success` final

### 6. Politica de reusabilidad multi-client

- los flujos auth deben quedar documentados como contratos portables
- cualquier logica dependiente de una app concreta debe quedar en adaptadores o configuracion
- la migracion no se cierra si el dominio sigue necesitando reescritura estructural para otro proyecto

## Plan De Trabajo Ejecutable

### Fase 1. Consolidacion de escrituras de sesion

Objetivo:

- inventariar y cerrar todos los caminos que escriben sesion fuera del bootstrap principal

Cambios:

- revisar login cliente y dashboard como baseline ya corregido
- revisar `magic-login`, seeds parciales y cualquier `setAuth(...)` manual de continuidad de flujo
- documentar que el login principal ya no es el problema abierto

Resultado esperado:

- todas las escrituras de sesion quedan auditadas contra el mismo contrato normalizado

### Fase 2. Cierre de tipos y catalogos canonicos

Objetivo:

- alinear tipado frontend con backend

Cambios:

- mantener `AuthRole` alineado con backend, incluyendo `super_admin`
- revisar unions relacionadas con permisos o guards
- verificar que no queden tipos auxiliares o guards parciales fuera del catalogo canonico

Resultado esperado:

- el frontend deja de rechazar parte del contrato backend por tipado incompleto

### Fase 3. Verificacion de identidad cerrada

Objetivo:

- confirmar que `userClientId` ya es la unica identidad soportada en runtime y tipos principales

Cambios:

- revisar consumers y responses secundarios
- confirmar que no reaparezcan aliases o mapeos de identidad fuera del nucleo ya corregido

### Fase 4. Desacoplar presentacion de `auth.email`

Objetivo:

- dejar de usar `auth.email` como dato de perfil en UI

Cambios:

- migrar fallbacks visuales a `profile.contactEmail` o a datos de profile equivalentes
- mantener en `WorkerContext` la misma regla compartida: dato propio primero, `auth.email` solo como fallback de sesion
- revisar formularios que hacen prefill desde auth

Resultado esperado:

- `auth` vuelve a ser una capa de sesion y no una fuente transversal de presentacion

### Fase 5. Cerrar politica de fallback para despliegue

Objetivo:

- evitar comportamiento ambiguo fuera de local

Cambios:

- proteger `dev-fallback` con flag explicita o endurecer condicion de entorno
- documentar si la sesion cacheada offline sigue permitida o no en despliegue restringido

Resultado esperado:

- el equipo sabe exactamente como se comporta auth ante backend caido en cada entorno

### Fase 6. Modelado de flujos reutilizables

Objetivo:

- convertir los flujos auth en unidades documentadas y reproducibles

Cambios:

- documentar cada flujo con contrato funcional y visual
- definir estados permitidos por flujo
- separar estados intermedios de red de estados visibles de UX
- introducir la regla de `loading continuo hasta success final` en flujos compuestos

Prioridad especial:

- `verify-email -> magic-login -> refreshAuth`

Resultado esperado:

- el dominio deja de depender de secuencias ad hoc de popups
- los flujos se vuelven portables a otros proyectos

### Fase 7. Testing y validacion final

Objetivo:

- validar el contrato corregido antes del despliegue

Minimo requerido:

1. login exitoso y verificacion de `hv-auth` con identidad completa
2. login con email no verificado
3. cold load con `GET /me`
4. `401 -> refresh-token -> GET /me`
5. logout y limpieza de storages
6. verify-email con `magicToken`
7. comportamiento con backend caido en `development`
8. comprobacion de que el fallback dev no se active fuera del entorno permitido
9. comprobacion visual de que `verify-email` no hace `loading -> success -> loading -> success`
10. comprobacion de que los mensajes finales y errores corresponden al estado final del flujo y no a pasos intermedios

## Estado Final De La Auditoria

Estado actual del dominio frontend `auth`:

- `V1` funcional para integracion
- no cerrado para despliegue restringido

Bloqueos reales a resolver antes de cerrarlo:

- cierre de consumidores residuales de `auth.email`
- politica definitiva de fallback/offline por entorno
- contrato reusable del dominio para futuros proyectos multi-client
- contrato visual estable de flujos compuestos, especialmente `verify-email`

Actualizacion de estado:

- el login principal de cliente y dashboard ya persiste el payload normalizado completo
- `userClientId` ya quedo como unica identidad soportada en `auth`, `profile` y `worker`
- la siguiente fase real ya no es corregir identidad base, sino consolidar consumidores residuales, fallback y flujos

Una vez cerrados esos puntos, el dominio puede pasar de transicion a estado operativo consistente para despliegue controlado.
