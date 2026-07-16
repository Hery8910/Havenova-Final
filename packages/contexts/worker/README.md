# Worker Context (Frontend)

## Objetivo

El `WorkerContext` es el complemento de identidad y preferencias de `apps/worker`.

Su responsabilidad real debería ser:

- bootstrap del perfil operativo del worker autenticado
- datos visibles de cuenta en dashboard
- preferencias locales y remotas del worker
- tema, idioma, avatar y datos de contacto del worker

No debería reemplazar a `AuthContext`.

`auth` sigue siendo responsable de:

- sesión
- rol
- verificación
- refresh/logout
- acceso protegido

## Regla cerrada de composición

La base reusable de autenticación del workspace queda compuesta así:

- `client` = `AuthProvider + ProfileProvider`
- `dashboard` = `AuthProvider + AdminProvider`
- `worker` = `AuthProvider + WorkerProvider`

Regla:

- `profile` es el complemento de identidad del usuario final en `client`
- `admin` es el complemento de identidad del usuario operativo del `dashboard`
- `worker` es el complemento de identidad del usuario operativo en `apps/worker`
- `worker` debe construirse tomando `profile` como patrón base reproducible
- la primera versión de `worker` debe replicar la estructura y el comportamiento estable ya validados en `profile`

Esto permite reutilizar la misma capa `auth` entre apps sin mezclar sus dominios de cuenta.
También permite que el mantenimiento parta de una misma base conceptual en lugar de dos implementaciones divergentes.

## Modelo de acceso de la app worker

La app `worker` no expone registro público.

Su modo de acceso es:

- login para cuentas ya activadas
- invitación para cuentas nuevas

Eso implica:

- no debe existir `register` como flujo público de la app worker
- la activación inicial del worker debe resolverse sobre la base shared de `auth`
- la ruta `set-password` debe aceptar el modo invitación cuando el backend entrega `inviteToken`

## Bootstrap inicial de la app worker

La regla anterior aplica al flujo normal del producto, pero no resuelve por sí sola el primer acceso del tenant.

Hecho importante:

- `POST /api/home-services/worker` requiere sesión autenticada
- por tanto, la creación/invitación de workers nace desde una superficie ya autenticada, no desde una UI pública de `apps/worker`

Decisión operativa:

- el primer operador del tenant se bootstrappea desde backend
- después de ese primer acceso, el resto del ciclo continúa desde las superficies operativas mediante invitaciones y `resend-invite`

Camino preferido hoy:

- usar el bootstrap backend de admin para el primer operador del tenant
- usar luego las superficies autenticadas para crear/invitar workers
- conservar el modelo canónico de invitación + `set-password`

Camino excepcional:

- usar bootstrap backend directo si se necesita entrar sin depender del correo
- debe considerarse solo una vía operativa, no el contrato normal del producto

Gap todavía abierto:

- si el producto exigiera que el primer acceso nazca ya con todos los complementos operativos enlazados, backend todavía necesitaría una vía explícita de provisionado integral
- hasta que ese bootstrap exista, el frontend no debe fingir que puede resolver el primer acceso por sí mismo

## Estado actual del repo

### Alineado

- `WorkerContext` ya usa la sesión `auth` como bootstrap de identidad mínima
- `WorkerContext` ya comparte con `AdminContext` la base reusable [useSessionComplement.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/sessionComplement/useSessionComplement.ts:1)
- el contexto ya persiste estado local para continuidad de UX
- el complemento ya expone un estado local controlado mientras resuelve o reintenta el remoto, en lugar de colapsar el árbol protegido

### Pendiente

- congelar la frontera exacta `auth -> worker`
- seguir cerrando `apps/worker` sobre su propia superficie sin reintroducir dependencias de `admin` o `profile`
- documentar `set-password` como activación por invitación además de reset
- revisar qué defaults de `worker` hoy siguen heredando demasiado desde `auth`
- mantener la misma forma pública que `admin` salvo diferencias reales de dominio

Hecho relevante ya alineado:

- la variante `set-password` con `inviteToken` ya comparte implementación base con `apps/dashboard`
- eso fija el onboarding por invitación como parte de la capa reusable de `auth`, no como dos páginas paralelas por app

## Flujo Operativo Del Contexto

### Primer acceso útil

1. El usuario entra a `apps/worker` por invitación o login ya activado.
2. `AuthProvider` resuelve sesión.
3. El árbol protegido monta `WorkerProvider`.
4. `WorkerContext` usa `auth.userClientId + clientId` para recuperar el complemento operativo.
5. Si existe dato remoto, lo persiste y lo expone a la UI.

### Recuperación y continuidad

1. Si la sesión sigue viva pero el complemento worker falla por red o `5xx`, el contexto puede mantener continuidad local.
2. Si la sesión cae, `WorkerContext` no debe fingir identidad operativa válida.
3. Idioma, tema y avatar se gestionan aquí, no en `auth`.
4. El árbol protegido no debería quedar vacío solo porque el complemento todavía esté resolviendo su copia remota si ya existe estado local controlado.

### Mensajes, errores y salidas

`WorkerContext` no es una página pública, pero condiciona la UX posterior al login:

- define qué identidad visible se muestra al worker
- usa alerts para errores de carga o actualización del complemento
- debe mantener separada la noción de error de sesión vs error de perfil operativo
- cuando una vista worker necesita fallback de popup o loading, debe resolverlo con `getI18nFallbacks(language)` para mantener paridad de copy entre `en`, `es` y `de`

## Regla de reproducción

La implementación de `worker` no debe comenzar como un dominio inventado desde cero.

Debe comenzar como una reproducción deliberada del patrón `profile`:

- mismo principio de separación respecto a `auth`
- misma responsabilidad como complemento de cuenta
- misma disciplina de bootstrap, persistencia y edición
- misma idea de contexto reusable por identidad dentro del tenant

La diferencia inicial no está en la arquitectura base.

La diferencia inicial está en el actor y en el modo de acceso:

- `profile` complementa al usuario final en `client`
- `admin` complementa al usuario operativo en `dashboard`
- `worker` complementa al usuario operativo en `apps/worker`

Después de reproducir esa base, `worker` puede divergir solo donde el producto realmente lo exija.

## Contrato esperado

`WorkerContext` debe consumir `auth` solo como dependencia de sesión:

- `auth.userClientId`
- `auth.clientId`
- `auth.email`
- `auth.role`
- `auth.isLogged`

Y debe exponer a `apps/worker` la identidad operativa necesaria:

- nombre
- avatar
- idioma
- tema
- email visible
- teléfono/datos operativos si aplican

La primera versión debería partir, como mínimo, de los mismos datos base ya consolidados en `profile`:

- nombre
- email/contacto visible
- teléfono
- avatar
- idioma
- tema

Luego se añaden campos operativos específicos de worker cuando realmente hagan falta.

## Riesgo principal

Si `apps/worker` reintroduce dependencias de `admin` o si `dashboard` vuelve a mezclar `worker` como complemento de cuenta, la base `auth` no será realmente reusable porque cada app quedará acoplada a un complemento de identidad ambiguo.
