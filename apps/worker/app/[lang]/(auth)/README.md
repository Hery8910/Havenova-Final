# Worker Auth Route

## Objetivo

Este README documenta la superficie `(auth)` de `apps/worker` como entrypoint de revisión funcional.

Contrato de copy para mensajes y popups auth:

- [docs/AUTH_POPUP_COPY_CONTRACT.md](/home/heriberto/Escritorio/Havenova/havenova/docs/AUTH_POPUP_COPY_CONTRACT.md:1)

Debe servir para entender:

- cómo entra un worker nuevo por invitación
- cómo se recupera una cuenta ya activada
- qué providers existen antes del árbol protegido
- dónde revisar cada flujo puntual del usuario

Estado:

- describe la implementación actual
- enlaza la documentación puntual por página

## Composición Actual

La superficie pública de auth del worker monta:

- `I18nProvider`
- `AlertProvider`
- `ClientProvider`
- `AuthProvider`

Referencia:

- [user/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/worker/app/[lang]/(auth)/user/layout.tsx:1)

Regla:

- aquí se monta solo `AuthProvider`
- `WorkerProvider` entra después, dentro del árbol protegido `(app)`
- las páginas públicas `login`, `forgot-password` y `set-password` son wrappers mínimos sobre implementaciones shared en `packages/components/client/user/auth`
- el shell visual de esas páginas también vive en el paquete shared

## Flujos Disponibles

La app worker expone solo:

- `login`
- `forgot-password`
- `set-password`

No expone:

- `register`
- `verify-email`

Contrato base:

- [AUTH_FLOW_CONTRACT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/worker/app/[lang]/(auth)/AUTH_FLOW_CONTRACT.md:1)

## Primer Acceso

1. La cuenta del worker se crea o invita desde una superficie autenticada.
2. El backend envía `inviteToken`.
3. El usuario entra por `set-password?inviteToken=...`.
4. El success siempre cierra con continuidad hacia `login`.

Revisión puntual:

- [INVITATION_AUTH_SHARED_PAGE_FLOWS.md](/home/heriberto/Escritorio/Havenova/havenova/docs/INVITATION_AUTH_SHARED_PAGE_FLOWS.md:155)
- [user/set-password/SET_PASSWORD_FLOW.md](/home/heriberto/Escritorio/Havenova/havenova/apps/worker/app/[lang]/(auth)/user/set-password/SET_PASSWORD_FLOW.md:1)

## Acceso Recurrente

1. El worker abre `login`.
2. El backend crea cookies.
3. El frontend sincroniza sesión.
4. La UI solo entra al árbol protegido si el rol operativo es `worker`.

Revisión puntual:

- [INVITATION_AUTH_SHARED_PAGE_FLOWS.md](/home/heriberto/Escritorio/Havenova/havenova/docs/INVITATION_AUTH_SHARED_PAGE_FLOWS.md:1)
- [user/login/LOGIN_FLOW.md](/home/heriberto/Escritorio/Havenova/havenova/apps/worker/app/[lang]/(auth)/user/login/LOGIN_FLOW.md:1)

## Recuperación

1. El usuario activado usa `forgot-password`.
2. El backend envía email de reset de forma ambigua.
3. El usuario vuelve por `set-password?token=...`.
4. El flujo cierra con retorno claro a `login`.

Revisión puntual:

- [INVITATION_AUTH_SHARED_PAGE_FLOWS.md](/home/heriberto/Escritorio/Havenova/havenova/docs/INVITATION_AUTH_SHARED_PAGE_FLOWS.md:92)
- [user/forgot-password/FORGOT_PASSWORD_FLOW.md](/home/heriberto/Escritorio/Havenova/havenova/apps/worker/app/[lang]/(auth)/user/forgot-password/FORGOT_PASSWORD_FLOW.md:1)
- [user/set-password/SET_PASSWORD_FLOW.md](/home/heriberto/Escritorio/Havenova/havenova/apps/worker/app/[lang]/(auth)/user/set-password/SET_PASSWORD_FLOW.md:1)

## Seguridad, Persistencia Y Salidas

- la app worker usa auth same-origin sobre BFF
- la sesión se basa en cookies del backend
- `AuthProvider` recibe `initialAuth` de servidor y usa `disableUnauthenticatedBootstrap` en esta superficie para no tratar storage local como prueba suficiente de acceso
- el acceso protegido depende de sesión válida y rol `worker`
- la persistencia de cuenta operativa ocurre después en `WorkerProvider`, no en esta superficie pública

## Pack De Revisión

Orden recomendado:

1. [docs/AUTH_IMPLEMENTATION_OVERVIEW.md](/home/heriberto/Escritorio/Havenova/havenova/docs/AUTH_IMPLEMENTATION_OVERVIEW.md:1)
2. [AUTH_FLOW_CONTRACT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/worker/app/[lang]/(auth)/AUTH_FLOW_CONTRACT.md:1)
3. [packages/contexts/auth/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/README.md:1)
4. [packages/contexts/worker/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/worker/README.md:1)
5. flow docs por página
