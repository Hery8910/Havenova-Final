# Admin Context (Frontend)

## Objetivo

El `AdminContext` es el complemento de identidad operativa de `apps/dashboard`.

Su responsabilidad real debería ser:

- bootstrap del perfil operativo autenticado
- datos visibles de cuenta del admin
- preferencias de idioma, tema y avatar
- continuidad local de UX del complemento admin

No debería reemplazar a `AuthContext`.

`auth` sigue siendo responsable de:

- sesión
- rol
- verificación
- refresh/logout
- acceso protegido

Estado:

- describe la implementación actual
- sirve como guía de revisión operativa del complemento `admin`

## Alcance

`AdminContext` es el complemento canónico de `dashboard`.

La composición cerrada del workspace queda así:

- `client` = `AuthProvider + ProfileProvider`
- `dashboard` = `AuthProvider + AdminProvider`
- `worker` = `AuthProvider + WorkerProvider`

Regla:

- `admin` consume `auth` como dependencia de sesión
- no debe asumir ownership de sesión ni refresh
- no debe reintroducir `ProfileContext` como complemento del dashboard

## Contrato Relevante

`AdminContext` trabaja sobre:

- `auth.userClientId`
- `auth.clientId`
- `auth.email`
- `auth.role`
- `auth.isLogged`

Persistencia local:

- `hv-admin:{clientId}:{userClientId}`

Bootstrap remoto:

- `getAdminProfile()`
- `updateAdminProfile()`

Base reusable compartida:

- [useSessionComplement.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/sessionComplement/useSessionComplement.ts:1)

## Flujo Operativo Del Contexto

### Primer acceso útil

1. `AuthProvider` resuelve o recupera sesión.
2. El árbol protegido del dashboard monta `AdminProvider`.
3. `AdminProvider` usa `auth.userClientId + clientId` para resolver el perfil operativo.
4. Si existe dato remoto, lo normaliza y persiste.
5. Si no existe dato remoto, mantiene defaults locales controlados y deja el error en la capa de alertas del complemento.

### Recuperación y continuidad

1. Si la sesión sigue viva pero el complemento falla por red o `5xx`, el contexto puede conservar estado local para continuidad.
2. Si la sesión cambia o se cierra, el complemento debe vaciar identidad operativa y volver a estado logged-out local.
3. Idioma, tema y avatar se editan en el complemento, no en `auth`.

### Cierre de sesión

1. `auth` resuelve logout.
2. `AdminContext` deja de tener una identidad operativa válida.
3. El storage del complemento deja de representar un admin autenticado.

## Mensajes, Errores Y Salidas

El contexto no es una página pública, pero sí afecta la UX:

- usa la capa global de alerts para errores de carga/actualización
- trata `ADMIN_NOT_FOUND` como ausencia de complemento, no como fallo de sesión por sí mismo
- depende de `auth` para saber si debe reintentar recuperación de sesión o degradar la superficie protegida

## Estado Actual

### Alineado

- el complemento usa `useSessionComplement`
- el storage está separado por `clientId + userClientId`
- el email visible ya usa dato propio primero y fallback de sesión solo como continuidad mínima
- `dashboard` ya dejó de usar `ProfileContext` como complemento canónico

### Pendiente

- seguir cerrando la frontera exacta entre defaults locales y dato operativo definitivo
- revisar consumidores secundarios de presentación donde aún pueda filtrarse semántica de sesión
- seguir validando que el dashboard trate `admin` y `super_admin` como única superficie autorizada

## Pack De Revisión

1. [docs/AUTH_IMPLEMENTATION_OVERVIEW.md](/home/heriberto/Escritorio/Havenova/havenova/docs/AUTH_IMPLEMENTATION_OVERVIEW.md:1)
2. [packages/contexts/auth/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/README.md:1)
3. [apps/dashboard/app/[lang]/(auth)/README.md](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/README.md:1)
4. [apps/dashboard/app/[lang]/(auth)/AUTH_FLOW_CONTRACT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/AUTH_FLOW_CONTRACT.md:1)
