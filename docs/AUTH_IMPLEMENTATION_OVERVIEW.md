# Auth Implementation Overview

## Objetivo

Este documento resume la implementación actual del sistema de `auth` en Havenova como un pack de revisión global.

Debe permitir responder, sin reconstruir el repo manualmente:

- qué se construyó
- por qué se construyó así
- cómo se compone entre apps
- cómo se protegen sesión, permisos y recuperación
- dónde revisar cada flujo puntual de usuario o cada contexto complementario

Estado:

- describe el estado actual implementado
- marca decisiones cerradas y deuda todavía abierta
- sirve como entrypoint general para la auditoría manual de `auth`

## Alcance

Este pack cubre:

- `apps/client`, `apps/dashboard` y `apps/worker` en sus superficies `(auth)`
- `AuthProvider`
- `ProfileProvider`
- `AdminProvider`
- `WorkerProvider`
- persistencia local de sesión y complementos
- contratos visibles de login, onboarding, verify, recovery y reset
- frontera de seguridad `browser -> frontend BFF -> backend`

No cubre en detalle:

- implementación interna completa de backend
- testing evidence histórica
- dominios de negocio fuera de sesión/complementos

## Decisiones Cerradas

### 1. La arquitectura objetivo ya no es browser-direct

La decisión cerrada es:

- navegador -> frontend same-origin
- frontend BFF -> backend central

`auth` es el primer dominio ya consolidado sobre esa frontera.

### 2. `auth` y los complementos de identidad siguen separados

La composición canónica del workspace es:

- `client` = `AuthProvider + ProfileProvider`
- `dashboard` = `AuthProvider + AdminProvider`
- `worker` = `AuthProvider + WorkerProvider`

Regla:

- `auth` posee sesión, rol, verificación, refresh y logout
- cada complemento posee identidad visible, preferencias y datos operativos de su app

### 3. Existen dos variantes canónicas de auth

- variante pública con registro y verificación para `client`
- variante invitation-only para `dashboard` y `worker`

Regla de implementación:

- la variante invitation-only ya usa páginas shared en `packages/components/client/user/auth`
- `apps/dashboard` y `apps/worker` mantienen rutas públicas mínimas que actúan como wrappers
- el shell visual y los estilos de esas páginas viven en el paquete shared, no en CSS locales por app

Fuente contractual:

- [AUTH_FLOW_VARIANTS_CONTRACT.md](/home/heriberto/Escritorio/Havenova/havenova/docs/AUTH_FLOW_VARIANTS_CONTRACT.md:1)

### 4. Los fallbacks visibles de auth ya se resuelven por locale activo

Regla de implementación:

- los textos principales viven en `packages/i18n/{en,es,de}`
- si falta una clave, auth cae en `getI18nFallbacks(language)`
- no debe asumirse un fallback fijo en alemán dentro de los flows auth

Impacto:

- `client`, `dashboard` y `worker` comparten el mismo contrato de mensajes de respaldo
- la revisión UX de copy puede hacerse por flujo sin perseguir archivos legacy paralelos
- los flows adyacentes que reutilizan la misma capa de alerts también deben resolver sus fallbacks por locale activo, no por exports fijos
- los success de edición de perfil o complementos no deben reutilizar códigos de sesión como `AUTH_GET_SUCCESS`; deben usar códigos que describan la acción visible (`USER_CLIENT_PROFILE_UPDATED`, `WORKER_UPDATED`, etc.)
- la auditoría de copy ya no se limita a auth público: también debe cubrir mensajes operativos de `worker`, administración, contacto y notificaciones cuando esos códigos se muestran al usuario final o a operadores reales

### 5. No todo código i18n del catálogo es copy visible activa

Regla de revisión:

- `popups.json` todavía contiene códigos de alineación con backend o catálogos más amplios
- algunos existen hoy como reserva tipada y no como popup realmente mostrado en runtime
- antes de pulir un código, hay que confirmar si la UI viva lo usa de verdad

Impacto:

- evita revisar como UX final mensajes que hoy no salen al usuario
- separa deuda de catálogo de deuda de experiencia visible

## Mapa De Superficies

### Global

- [AUTH_FLOW_VARIANTS_CONTRACT.md](/home/heriberto/Escritorio/Havenova/havenova/docs/AUTH_FLOW_VARIANTS_CONTRACT.md:1)
- [AUTH_CSRF_SESSION_RECOVERY_DECISION.md](/home/heriberto/Escritorio/Havenova/havenova/docs/AUTH_CSRF_SESSION_RECOVERY_DECISION.md:1)
- [INVITATION_AUTH_SHARED_PAGE_FLOWS.md](/home/heriberto/Escritorio/Havenova/havenova/docs/INVITATION_AUTH_SHARED_PAGE_FLOWS.md:1)
- [AUTH_POPUP_COPY_CONTRACT.md](/home/heriberto/Escritorio/Havenova/havenova/docs/AUTH_POPUP_COPY_CONTRACT.md:1)
- [SESSION_ROUTE_CONTRACT.md](/home/heriberto/Escritorio/Havenova/havenova/docs/SESSION_ROUTE_CONTRACT.md:1)
- [SESSION_COMPLEMENT_ARCHITECTURE.md](/home/heriberto/Escritorio/Havenova/havenova/docs/SESSION_COMPLEMENT_ARCHITECTURE.md:1)

### Contextos

- [packages/contexts/auth/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/README.md:1)
- [packages/contexts/profile/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/profile/README.md:1)
- [packages/contexts/admin/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/admin/README.md:1)
- [packages/contexts/worker/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/worker/README.md:1)

### Auth Por App

- [apps/client/app/[lang]/(auth)/README.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/README.md:1)
- [apps/client/app/[lang]/(auth)/AUTH_FLOW_CONTRACT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/AUTH_FLOW_CONTRACT.md:1)
- [apps/dashboard/app/[lang]/(auth)/README.md](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/README.md:1)
- [apps/dashboard/app/[lang]/(auth)/AUTH_FLOW_CONTRACT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/AUTH_FLOW_CONTRACT.md:1)
- [apps/worker/app/[lang]/(auth)/README.md](/home/heriberto/Escritorio/Havenova/havenova/apps/worker/app/[lang]/(auth)/README.md:1)
- [apps/worker/app/[lang]/(auth)/AUTH_FLOW_CONTRACT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/worker/app/[lang]/(auth)/AUTH_FLOW_CONTRACT.md:1)

### Namespace canónico del complemento protegido

- `client` mantiene `/profile/*` para el complemento `profile`
- `dashboard` usa `/account/*` para el complemento `admin`
- `worker` mantiene `/profile/*` para el complemento `worker`

Regla:

- el nombre de namespace debe seguir el dominio real del complemento
- en `dashboard`, `/profile/*` ya no es la superficie canónica del admin
- cualquier resto bajo `dashboard/(app)/profile` debe tratarse como compatibilidad residual, no como contrato vivo

## Seguridad Y Persistencia

### Sesión

`auth` trabaja con:

- cookies de sesión emitidas por backend/BFF
- `GET /api/auth/me` como fuente de verdad posterior al login
- `refresh-token` para recuperación de sesión
- `x-csrf-token` mantenido en memoria para rutas protegidas

Estado de esta parte del contrato:

- la arquitectura same-origin BFF ya quedó cerrada
- la recuperación de sesión por `refresh-token` también
- el hueco todavía pendiente de implementación está en la reemisión de CSRF cuando el runtime pierde el header en memoria
- esa decisión ya quedó formalizada en [AUTH_CSRF_SESSION_RECOVERY_DECISION.md](/home/heriberto/Escritorio/Havenova/havenova/docs/AUTH_CSRF_SESSION_RECOVERY_DECISION.md:1)

Persistencia local principal:

- `hv-auth`
- `hv-auth-recent-login-at`

### Complementos

Persistencia local por identidad/tenant:

- `profile` -> `hv-profile:{clientId}:{userClientId}`
- `admin` -> `hv-admin:{clientId}:{userClientId}`
- `worker` -> `hv-worker:{clientId}:{userClientId}`

Regla:

- la sesión se persiste separada del complemento
- el complemento nunca reemplaza a `auth` como owner de permisos o refresh
- `admin` y `worker` deben mantener continuidad local equivalente cuando el remoto todavía no está listo o entra en fallback offline controlado

### Permisos

Los permisos base siguen viniendo del payload autenticado:

- `role`
- `status`
- `isVerified`
- `isLogged`

Uso esperado por app:

- `client` acepta usuario final verificado
- `dashboard` acepta `admin` y `super_admin`
- `worker` acepta `worker`

## Flujo General Del Usuario

### `client`

1. El usuario puede registrarse públicamente.
2. `register` crea cuenta no verificada.
3. `verify-email` actúa como flujo compuesto:
   `verify-email -> magic-login -> refreshAuth`.
4. Solo después se consolida la sesión y entra `ProfileProvider`.
5. `forgot-password` y `set-password` manejan recuperación sin exponer existencia de cuenta.

### `dashboard`

1. La cuenta nace fuera de la UI pública.
2. El usuario recibe invitación con `inviteToken`.
3. `set-password` activa acceso inicial.
4. `login` establece sesión.
5. Después entra `AdminProvider`.

Nota de implementación:

- `dashboard` precarga `initialAuth` desde servidor y usa `disableUnauthenticatedBootstrap` en la superficie `(auth)` para no aceptar storage local como prueba suficiente de acceso

### `worker`

1. La cuenta también nace vía invitación.
2. `set-password` resuelve primer acceso.
3. `login` establece sesión.
4. Después entra `WorkerProvider`.

Nota de implementación:

- `worker` comparte las páginas públicas con `dashboard`, pero mantiene su propia validación posterior de rol y complemento operativo
- `worker` también precarga `initialAuth` desde servidor y usa `disableUnauthenticatedBootstrap` tanto en `(auth)` como en `(app)` para no aceptar storage local como prueba suficiente de acceso

## Qué Debe Revisarse Manualmente

### 0. Regla de intención visible

Cada mensaje, popup o salida de auth debe poder revisarse con esta matriz mínima:

- disparador real del estado
- intención UX del mensaje
- CTA principal esperada
- salida de `cancel`
- destino final o permanencia en página

La intención debe quedar dentro de una familia clara:

- `loading`: progreso real, sin prometer éxito antes de tiempo
- `success`: acción ya completada y siguiente paso seguro
- `error recoverable`: el usuario puede corregir, reintentar o tomar otra ruta pública
- `error terminal`: el camino actual ya no es válido y debe cerrarse
- `redirect automático`: el siguiente paso es inequívoco y no necesita otra decisión

### 1. UX visible

Revisar por flujo:

- loading permitido
- success final
- errores esperados
- CTA principal
- salida de cancel
- redirect automático o manual

### 2. Seguridad de flujo

Comprobar:

- que no haya enumeración accidental en recovery
- que `verify-email` no muestre success intermedio engañoso
- que `dashboard`/`worker` no expongan register público
- que los redirects no dependan solo de storage local cuando deberían depender de sesión confirmada

### 3. Persistencia y recuperación

Comprobar:

- bootstrap desde servidor
- fallback desde storage
- refresh tras expiración controlada
- cierre de sesión
- continuidad de idioma/tema/complemento

## Deuda Abierta Relevante

- todavía quedan consumidores secundarios donde `auth.email` debe seguir saliendo de UI de presentación
- el fallback dev/offline de `AuthContext` y algunos complementos sigue siendo una decisión de despliegue pendiente
- la separación final entre infraestructura de formularios auth y profile no está completamente cerrada
- aún hay que terminar de verificar que todos los flows compuestos tengan contrato visual estable

## Validación De Copy Ya Cerrada En Auth Público

Con el contrato actual ya debe cumplirse:

- `register` no implica acceso inmediato; su success empuja a verificar email
- `login` confirma acceso concedido, no bootstrap de perfil
- `verify-email` sólo confirma acceso completo cuando terminó toda la secuencia compuesta
- `resend-verification` y `forgot-password` mantienen respuesta ambigua
- `set-password` confirma cambio de credencial y entrega clara a `login`
- los helper texts de `pages.json` no deben reintroducir promesas más fuertes que los popups terminales

## Estado General Del Módulo

### Coherencia de flujos

- `client` ya tiene un recorrido público coherente: `register -> verify-email -> login -> recovery`
- `dashboard` y `worker` ya comparten una variante invitation-only coherente: `login`, `forgot-password` y `set-password`
- los flujos compuestos más delicados (`verify-email`, activación por invitación, refresh de sesión) ya tienen contrato visible y técnico explícito
- los redirects y salidas principales ya están alineados con una única ruta canónica de auth por app

### Coherencia de mensajes y salidas

- los popups visibles de auth ya siguen reglas comunes de intención, tono y CTA
- `en`, `es` y `de` ya están revisados en los mensajes principales y en los textos de apoyo de `pages.json`
- recovery y resend ya mantienen ambigüedad donde el contrato de seguridad lo exige
- success y error ya describen mejor la consecuencia visible y el siguiente paso seguro

### Coherencia estructural

- `auth` quedó mejor separado de `profile`, `admin` y `worker`
- `dashboard` ya cerró su complemento sobre `admin` y su namespace protegido sobre `/account/*`
- `worker` ya replica mejor la base reusable de `auth + complement` sin depender de `dashboard`
- `AuthProvider`, `AdminProvider` y `WorkerProvider` ya comparten más reglas de bootstrap, persistencia y fallback local

### Replicabilidad

- la capa shared de auth ya es bastante más práctica de reproducir en otra app que al inicio de este trabajo
- hoy existe una base reusable real para:
  - BFF same-origin
  - `AuthProvider`
  - páginas públicas invitation-only shared
  - contratos de copy y salidas
  - patrón reusable `auth + session complement`
- la replicabilidad ya no depende tanto de recordar decisiones implícitas del repo, porque esas decisiones quedaron repartidas entre tests, contratos por flujo y overview global

### Qué sigue siendo transicional

- varias superficies protegidas de `dashboard` y `worker` siguen siendo placeholders, así que parte de la validación todavía es arquitectónica más que de producto final
- todavía quedan documentos históricos o de planificación que no siempre reflejan el estado exacto del runtime
- la verdadera prueba final de replicabilidad será seguir montando dominios protegidos reales sin romper esta base

## Orden Recomendado De Auditoría Manual

1. Leer este overview.
2. Revisar la variante/app correspondiente:
   `client`, `dashboard` o `worker`.
3. Revisar el contexto complementario de esa app.
4. Bajar a los `*_FLOW.md` de cada página.
5. Ejecutar la validación manual con [apps/client/app/[lang]/(auth)/TESTING.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/TESTING.md:1) cuando aplique.

## Resultado Esperado De Esta Documentación

Este pack debería permitir:

- revisar la experiencia de usuario de auth paso a paso
- validar mensajes, salidas y recuperación de credenciales
- entender persistencia, permisos y composición de providers
- detectar rápidamente si un cambio rompe contrato funcional o solo detalle visual
