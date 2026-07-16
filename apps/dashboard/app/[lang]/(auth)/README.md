# Dashboard Auth Route

## Objetivo

Este README documenta la superficie `(auth)` de `apps/dashboard` como entrypoint de revisión funcional.

Contrato de copy para mensajes y popups auth:

- [docs/AUTH_POPUP_COPY_CONTRACT.md](/home/heriberto/Escritorio/Havenova/havenova/docs/AUTH_POPUP_COPY_CONTRACT.md:1)

Debe servir para entender:

- cómo entra un usuario invitado al dashboard
- cómo se protege la sesión antes de llegar al árbol autenticado
- qué páginas públicas existen realmente
- dónde revisar cada flujo puntual del usuario

Estado:

- describe la implementación actual
- enlaza la documentación puntual por página

## Composición Actual

La superficie pública de auth del dashboard monta:

- `I18nProvider`
- `AlertProvider`
- `ClientProvider`
- `AuthProvider`

Referencia:

- [user/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/user/layout.tsx:1)

Regla:

- aquí se monta solo `AuthProvider`
- `AdminProvider` entra después, dentro del árbol protegido `(app)`
- las páginas públicas `login`, `forgot-password` y `set-password` son wrappers mínimos sobre implementaciones shared en `packages/components/client/user/auth`
- el shell visual de esas páginas también vive en el paquete shared

## Flujos Disponibles

El dashboard expone solo:

- `login`
- `forgot-password`
- `set-password`

No expone:

- `register`
- `verify-email`

Contrato base:

- [AUTH_FLOW_CONTRACT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/AUTH_FLOW_CONTRACT.md:1)

## Primer Acceso

1. Un actor privilegiado crea o invita al usuario.
2. El backend envía `inviteToken`.
3. El usuario entra por `set-password?inviteToken=...`.
4. La UI resuelve la invitación antes de aceptar contraseña.
5. El success siempre cierra derivando a `login`.

Revisión puntual:

- [INVITATION_AUTH_SHARED_PAGE_FLOWS.md](/home/heriberto/Escritorio/Havenova/havenova/docs/INVITATION_AUTH_SHARED_PAGE_FLOWS.md:155)
- [user/set-password/SET_PASSWORD_FLOW.md](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/user/set-password/SET_PASSWORD_FLOW.md:1)

## Acceso Recurrente

1. El usuario abre `login`.
2. El backend crea cookies.
3. El frontend sincroniza sesión.
4. Solo si la sesión confirmada tiene acceso de dashboard, la UI entra al árbol protegido.

Revisión puntual:

- [INVITATION_AUTH_SHARED_PAGE_FLOWS.md](/home/heriberto/Escritorio/Havenova/havenova/docs/INVITATION_AUTH_SHARED_PAGE_FLOWS.md:1)
- [user/login/LOGIN_FLOW.md](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/user/login/LOGIN_FLOW.md:1)

## Recuperación

1. El usuario activado usa `forgot-password`.
2. El backend envía email de reset sin exponer si la cuenta existe.
3. El usuario vuelve por `set-password?token=...`.
4. El flujo vuelve a entregar salida clara hacia `login`.

Revisión puntual:

- [INVITATION_AUTH_SHARED_PAGE_FLOWS.md](/home/heriberto/Escritorio/Havenova/havenova/docs/INVITATION_AUTH_SHARED_PAGE_FLOWS.md:92)
- [user/forgot-password/FORGOT_PASSWORD_FLOW.md](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/user/forgot-password/FORGOT_PASSWORD_FLOW.md:1)
- [user/set-password/SET_PASSWORD_FLOW.md](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/user/set-password/SET_PASSWORD_FLOW.md:1)

## Seguridad, Persistencia Y Salidas

- el dashboard usa auth same-origin sobre BFF
- la sesión se basa en cookies del backend
- `AuthProvider` recibe `initialAuth` de servidor y usa `disableUnauthenticatedBootstrap` en esta superficie para no tratar storage local como prueba suficiente de acceso
- el redirect correcto después de login depende de sesión confirmada y rol válido, no solo de cache local

## Pack De Revisión

Orden recomendado:

1. [docs/AUTH_IMPLEMENTATION_OVERVIEW.md](/home/heriberto/Escritorio/Havenova/havenova/docs/AUTH_IMPLEMENTATION_OVERVIEW.md:1)
2. [AUTH_FLOW_CONTRACT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/dashboard/app/[lang]/(auth)/AUTH_FLOW_CONTRACT.md:1)
3. [packages/contexts/auth/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/README.md:1)
4. [packages/contexts/admin/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/admin/README.md:1)
5. flow docs por página
