# Alert Context

## Objetivo

El dominio `alert` centraliza la comunicación transitoria con el usuario cuando una acción de UI:

- inicia una llamada al backend
- termina con éxito
- falla
- requiere confirmación explícita antes de continuar

Hoy actúa como un modal global de feedback y confirmación. El objetivo funcional no es solo “mostrar popups”, sino definir un patrón único para:

- estados de carga
- mensajes de error y éxito
- decisiones con `onConfirm` y `onCancel`
- redirecciones o reintentos disparados desde la alerta

Este README documenta el contrato actual del contexto y deja una base para revisar después los flujos de autenticación con el mismo criterio.

## Arquitectura actual

Archivos principales:

- [AlertContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/alert/AlertContext.tsx)
- [useAlert.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/alert/useAlert.ts)
- [alert.types.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/alert/alert.types.ts)
- [AlertWrapper.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/alert/alertWrapper/AlertWrapper.tsx)
- [AlertPopup.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/alert/alertPopup/AlertPopup.tsx)
- [getAlertType.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/alertType/getAlertType.ts)
- [getPopup.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/alertType/getPopup.ts)

Flujo de render:

1. `useAlertBase()` mantiene un único estado `alert`.
2. `AlertProvider` expone ese estado por contexto.
3. Si existe una alerta activa, `AlertProvider` monta `AlertWrapper` en `document.body` mediante portal.
4. `AlertWrapper` decide el tipo visual desde `status`.
5. `AlertPopup` renderiza overlay, icono/spinner, contenido y acciones.

Conclusión importante:

- el sistema actual solo soporta **una alerta global a la vez**
- no existe cola de alertas
- una nueva alerta reemplaza inmediatamente a la anterior

## API pública del contexto

`useGlobalAlert()` expone:

- `alert`
- `showLoading({ response })`
- `showError({ response, onCancel?, onConfirm? })`
- `showSuccess({ response, onCancel?, onConfirm? })`
- `showConfirm({ response, onConfirm, onCancel? })`
- `closeAlert()`

### Shape base

El payload que consume el contexto es:

```ts
type AlertPayload = {
  status: number;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
};
```

Handlers:

- `onCancel`: acción secundaria o cierre
- `onConfirm`: acción principal

## Estados funcionales soportados

### 1. Loading

Se usa para bloquear el flujo mientras hay una operación en curso.

Comportamiento actual:

- fuerza `loading: true`
- no renderiza acciones
- no permite cerrar con overlay
- no permite cerrar con `Escape`
- hoy usa `onCancel: () => {}` internamente

Ejemplo:

```ts
showLoading({
  response: {
    status: 102,
    title: 'Processing your registration…',
    description: 'Please wait a moment.',
  },
});
```

### 2. Error

Se usa cuando el usuario necesita entender qué salió mal y, a veces, decidir el siguiente paso.

Comportamiento actual:

- si no recibe `cancelLabel`, usa `'Close'`
- puede aceptar `onConfirm`, aunque semánticamente no siempre se usa
- si no recibe `onCancel`, usa `closeAlert`

Ejemplo:

```ts
showError({
  response: {
    status: 400,
    title: popupData.title,
    description: popupData.description,
    cancelLabel: popupData.close,
  },
  onCancel: closeAlert,
});
```

### 3. Success

Se usa cuando la acción terminó correctamente y el usuario necesita cerrar o continuar.

Comportamiento actual:

- si no recibe `cancelLabel`, usa `'Close'`
- puede tener `confirmLabel` y `onConfirm`
- puede cerrar o navegar desde `onCancel`

Ejemplo:

```ts
showSuccess({
  response: {
    status: 200,
    title: popupData.title,
    description: popupData.description,
    confirmLabel: popupData.confirm,
    cancelLabel: popupData.close,
  },
  onConfirm: () => {
    router.push('/user/login');
    closeAlert();
  },
  onCancel: closeAlert,
});
```

### 4. Confirm

Se usa cuando la UI necesita aprobación explícita antes de ejecutar una acción destructiva o sensible.

Comportamiento actual:

- requiere `onConfirm`
- si no recibe `cancelLabel`, usa `'Cancel'`
- si no recibe `confirmLabel`, usa `'Confirm'`

Ejemplo:

```ts
showConfirm({
  response: {
    status: 200,
    title: 'Delete address?',
    description: 'This action cannot be undone.',
    confirmLabel: 'Delete',
    cancelLabel: 'Keep',
  },
  onConfirm: handleDelete,
  onCancel: closeAlert,
});
```

## Resolución del tipo visual

El componente no recibe `type` directamente desde la página. Lo deriva desde `status`.

Regla actual en [getAlertType.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/alertType/getAlertType.ts):

- `200-299` -> `success`
- `300-399` -> `info`
- `400-499` -> `warning`
- `500+` -> `error`
- cualquier otro -> `info`

Además:

- si `loading === true`, `AlertPopup` ignora el icono normal y renderiza spinner

Implicación de diseño:

- el diseño visual hoy depende de dos ejes:
  - estado `loading`
  - categoría derivada del `status`

## Resolución del contenido i18n

El helper [getPopup.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/alertType/getPopup.ts) resuelve el contenido textual con esta prioridad:

1. `popups[code]`
2. `popups[defaultKey]`
3. fallback hardcodeado

Para labels:

- `close` toma `raw.close`, o `popups.button.close`, o fallback
- `confirm` toma `raw.confirm`, o `popups.button.continue`, o fallback

Esto permite que la página haga:

```ts
const popupData = getPopup(
  popups,
  response.code,
  'USER_REGISTER_SUCCESS',
  fallbackRegisterSuccess
);
```

## Comportamiento UX actual del modal

En [AlertPopup.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/alert/alertPopup/AlertPopup.tsx) y [AlertWrapper.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/alert/alertWrapper/AlertWrapper.tsx):

- usa portal global sobre `document.body`
- el contenedor se comporta como `role="dialog"`
- el foco se mueve al diálogo cuando no está en loading
- `Escape` cierra solo si el popup es dismissible
- click en overlay cierra solo si existe `cancel`
- en loading no se renderizan botones
- en loading se expone `role="status"` para el spinner

Definición actual de “dismissible”:

- no está en loading
- tiene `cancelLabel`

## Patrón recomendado de uso

Para llamadas backend, el patrón actual más consistente es:

1. `showLoading(...)`
2. ejecutar request
3. `closeAlert()` si necesitas limpiar manualmente antes del siguiente estado
4. `showSuccess(...)` o `showError(...)`

Ejemplo mínimo:

```ts
showLoading({
  response: {
    status: 102,
    title: loading.title,
    description: loading.description,
  },
});

try {
  const response = await serviceCall(payload);

  showSuccess({
    response: {
      status: 200,
      title: success.title,
      description: success.description,
      cancelLabel: success.close,
    },
    onCancel: closeAlert,
  });
} catch (error) {
  const popup = getPopup(popups, code, 'GLOBAL_INTERNAL_ERROR', fallbackGlobalError);

  showError({
    response: {
      status: error.response?.status ?? 500,
      title: popup.title,
      description: popup.description,
      cancelLabel: popup.close,
    },
    onCancel: closeAlert,
  });
}
```

## Casos de uso reales en autenticación

### Registro

En [register/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/register/page.tsx):

- muestra loading al enviar
- muestra error por validación de TOS antes del request
- muestra success final con `confirm` y `cancel`
- en ciertos errores decide si quedarse en la página o redirigir

Patrón observado:

- loading -> request -> success/error

### Login

En [login/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/login/page.tsx):

- loading al iniciar
- errores de validación de email/password/clientId
- error especial para email no verificado
- success final con navegación

Patrón observado:

- loading -> ramas de validación -> request -> success/error

### Forgot password

En [forgot-password/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/forgot-password/page.tsx):

- primero valida `clientId` y `email`
- luego loading
- luego success o error simple con cierre

Patrón observado:

- validación previa -> loading -> request -> resultado

### Verify email

En [verify-email/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/user/verify-email/page.tsx):

- encadena varios loadings
- puede terminar en error recuperable o redirect
- usa success final de cierre del flujo

Patrón observado:

- loading de verificación
- loading de login mágico
- loading de refresh/bootstrap
- success o error final

Este es el flujo más exigente visualmente, porque requiere representar una secuencia de estados dentro del mismo sistema de alertas.

## Especificación funcional para diseño visual

Para diseñar el componente final conviene asumir estos estados visuales:

### Loading

Debe comunicar:

- operación en curso
- imposibilidad de interacción principal
- continuidad del proceso

Necesita:

- spinner o progreso indeterminado
- título corto
- descripción breve
- ausencia de acciones

### Success

Debe comunicar:

- acción completada
- siguiente paso claro

Necesita:

- iconografía positiva
- CTA principal opcional
- cierre secundario opcional

### Warning / Error de usuario

Corresponde hoy a muchos `4xx`.

Debe comunicar:

- qué salió mal
- si el usuario puede corregirlo
- si debe reintentar o volver

Necesita:

- lenguaje claro y accionable
- cierre
- opcionalmente CTA de corrección/reintento

### Error crítico

Corresponde hoy a `5xx`.

Debe comunicar:

- fallo del sistema o backend
- poca o nula responsabilidad del usuario

Necesita:

- tratamiento visual más severo
- sugerencia clara de reintento o salida segura

### Confirm

Debe comunicar:

- decisión reversible o destructiva
- cuál acción es primaria y cuál secundaria

Necesita:

- dos acciones claras
- jerarquía visual fuerte entre confirmar/cancelar

## Inconsistencias actuales

Estas son las principales inconsistencias que conviene tener presentes antes de revisar auth:

### 1. Un único modal mezcla feedback y decisión

El mismo componente hoy resuelve:

- loading
- error
- success
- confirm

Eso es válido, pero exige reglas muy claras de diseño y copy para que no se sienta como el mismo popup en todos los casos.

### 2. `status` HTTP decide la semántica visual

Hoy `400-499` cae en `warning`, no en `error`.

Esto puede ser correcto para errores corregibles, pero mezcla:

- validación de usuario
- sesión expirada
- recursos faltantes
- permisos

No todos esos casos deberían verse igual.

### 3. `showError` y `showSuccess` aceptan `onConfirm`

Eso permite flexibilidad, pero semánticamente difumina los límites entre:

- feedback
- confirmación
- decisión posterior al éxito

Para diseño conviene distinguir:

- popup informativo con una sola salida
- popup de decisión con acción principal

### 4. Loading no tiene transición explícita

El flujo normal reemplaza directamente una alerta por otra.

No existe:

- cola
- transición declarativa
- máquina de estados

Por eso algunas páginas llaman `closeAlert()` antes de mostrar el estado siguiente y otras no.

### 5. No hay contrato explícito de “reintento”

El contexto sí soporta reintentos porque acepta `onConfirm`, pero no existe una convención común tipo:

- `confirmLabel: "Retry"`
- `onConfirm: retryAction`

Hoy eso queda a criterio de cada página.

### 6. Loading usa `onCancel: () => {}`

Funciona para bloquear el cierre, pero expresa una intención implícita. Sería más limpio que el estado loading estuviera tipado como no cancelable sin handler dummy.

## Convenciones recomendadas para la próxima revisión

Antes de revisar todas las páginas de auth, conviene fijar estas reglas:

### Regla 1

Usar `showLoading` solo para operaciones en curso reales, no para validaciones locales.

### Regla 2

Usar `showError` para feedback de fallo y reservar `showConfirm` para decisiones previas a la acción.

### Regla 3

Si el popup tiene una acción primaria visible, esa acción debe tener una razón clara:

- continuar
- reintentar
- ir al login
- volver al inicio

### Regla 4

Toda alerta de auth debería responder estas tres preguntas:

- qué ocurrió
- qué puede hacer ahora el usuario
- qué ocurre si cierra el popup

### Regla 5

Cuando el flujo redirige, `onCancel` y `onConfirm` no deberían divergir sin motivo. Si ambas rutas hacen lo mismo, el diseño puede simplificarse.

## Ejemplos de referencia para diseño

### Loading simple

```ts
showLoading({
  response: {
    status: 102,
    title: 'Signing you in…',
    description: 'We are validating your credentials.',
  },
});
```

### Error corregible

```ts
showError({
  response: {
    status: 400,
    title: 'Email is missing',
    description: 'Enter your email address to continue.',
    cancelLabel: 'Close',
  },
  onCancel: closeAlert,
});
```

### Error con salida segura

```ts
showError({
  response: {
    status: 500,
    title: 'Something went wrong',
    description: 'Please try again later.',
    cancelLabel: 'Back to home',
  },
  onCancel: () => {
    router.push('/');
    closeAlert();
  },
});
```

### Success con continuación

```ts
showSuccess({
  response: {
    status: 200,
    title: 'Account created',
    description: 'Your email has been registered successfully.',
    confirmLabel: 'Continue',
    cancelLabel: 'Close',
  },
  onConfirm: () => {
    router.push('/user/login');
    closeAlert();
  },
  onCancel: closeAlert,
});
```

### Confirm destructivo

```ts
showConfirm({
  response: {
    status: 200,
    title: 'Delete this address?',
    description: 'This action cannot be undone.',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
  },
  onConfirm: handleDeleteAddress,
  onCancel: closeAlert,
});
```

## Alcance de la próxima revisión

Con este documento como base, la siguiente revisión del dominio `auth` debería comprobar:

- qué páginas usan el patrón completo `loading -> resultado`
- dónde hay errores que deberían ser inline y no modal
- dónde `success` y `confirm` están semánticamente mezclados
- dónde la navegación está acoplada al cierre del popup
- qué casos necesitan patrón explícito de reintento
- si el diseño visual final necesita separar “feedback modal” de “confirm modal”

## Resumen operativo

Hoy `alert` ya funciona como infraestructura global de feedback, pero todavía no tiene un contrato de diseño completamente cerrado. La decisión clave pendiente no es técnica sino de producto/UI:

- mantener un solo componente para todos los estados
- o separar visualmente loading, feedback y confirmación

Mientras esa decisión no se cierre, este README debería usarse como criterio de consistencia para cualquier página nueva o refactor de autenticación.
