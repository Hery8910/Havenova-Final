# AppInstallSection Migration

## Objetivo

Migrar `AppInstallSection` desde una implementacion unica con logica y UI acopladas a una arquitectura basada en:

- Un `wrapper` responsable de validaciones, contexto, deteccion de instalacion, auth, textos y seleccion de variante.
- Componentes separados por caso de uso, enfocados solo en representacion.
- Un contrato de estados claro, facil de mantener y ampliar.

La deteccion de instalacion PWA seguira siendo client-side porque depende del navegador. Aun asi, las variantes visuales deben quedar desacopladas de esa logica y ser componentes puros, reutilizables y predecibles.

## Estado actual

El componente actual:

- Detecta si la app esta instalada usando `display-mode`, `navigator.standalone`, `document.referrer`, `beforeinstallprompt`, `appinstalled`, `visibilitychange`, `pageshow` y `getInstalledRelatedApps()`.
- Muestra una unica tarjeta con pequenas variaciones de copy y CTA.
- Mantiene el caso iOS dentro del mismo flujo, incluyendo un boton que no instala realmente la app.
- Considera instalada la app si existe `pwa-installed` en `localStorage` o cookie, lo que puede producir falsos positivos si el usuario desinstala fuera del navegador.

## Estado objetivo

La seccion debe resolverse en un `wrapper` que derive un estado de vista y renderice una variante concreta.

### Casos funcionales

1. `installed + logged`
   - Mostrar variante orientada a perfil.
   - CTA principal a `/profile`.

2. `installed + guest`
   - Mostrar variante orientada a acceso de cuenta.
   - Mostrar ambos CTAs: login y registro.
   - No asumir que instalacion implica sesion activa.

3. `not-installed + android/installable`
   - Mantener boton de instalar.
   - Mantener mensaje de apoyo.
   - Si `beforeinstallprompt` no esta disponible, pasar al caso `unavailable`.

4. `not-installed + ios-manual`
   - No mostrar boton de instalar.
   - Mostrar solo mensaje/instruccion manual.

5. `not-installed + unavailable`
   - Caso explicito para navegadores o escenarios sin instalacion disponible.
   - Mostrar bloque alternativo con CTA a `/how-it-work`.

## Arquitectura propuesta

### 1. Wrapper contenedor

Responsabilidades:

- Resolver `lang`, `texts` y `auth`.
- Escuchar eventos del navegador relacionados con la instalacion.
- Derivar el estado de instalacion real.
- Aplicar mitigacion de falsos positivos.
- Elegir la variante correcta.
- Pasar a cada variante solo props de presentacion y callbacks concretos.

Posible nombre:

- `AppInstallSection`
- o `AppInstallSectionContainer`

### 2. Componentes de presentacion

Responsabilidades:

- Recibir props serializables y renderizar UI.
- No leer `window`, `document`, `localStorage` ni contexto.
- No decidir estados de negocio.

Decision adoptada:

- Habra solo dos componentes representacionales principales.
- Cada uno manejara variantes visuales leves mediante textos y props de estado.

Componentes:

- `AppNotInstalledCard`
  - Maneja `installable`, `ios-manual` y `unavailable`.
  - La estructura visual base debe ser la misma.
  - Cambian copy, CTA, hint y presencia/ausencia del boton.

- `AppInstalledCard`
  - Maneja `logged-in` y `guest`.
  - La estructura visual base debe ser la misma.
  - Cambian copy y CTAs.

## Contrato de estado recomendado

Separar estado de instalacion y estado de sesion:

- `installState: 'installed' | 'installable' | 'ios-manual' | 'unavailable'`
- `authState: 'logged-in' | 'guest'`

Y derivar un `viewState` final solo en el wrapper:

- `installed-profile`
- `installed-guest`
- `installable`
- `ios-manual`
- `unavailable`

### Mapeo hacia componentes

- `installed-profile` -> `AppInstalledCard`
- `installed-guest` -> `AppInstalledCard`
- `installable` -> `AppNotInstalledCard`
- `ios-manual` -> `AppNotInstalledCard`
- `unavailable` -> `AppNotInstalledCard`

## Requisitos de negocio

- Mantener la validacion actual de instalacion.
- Mantener la separacion iOS vs Android.
- En Android, conservar boton de instalar con mensaje.
- En iOS, no renderizar boton de instalar; solo mostrar mensaje.
- Cuando no se pueda instalar, mostrar bloque alternativo con CTA a `How it works`.
- Cuando la app este instalada y el usuario tenga sesion activa, mostrar CTA a perfil.
- Cuando la app este instalada y el usuario no este logeado, mostrar CTA a login y registro.
- Mantener una estructura visual consistente dentro de cada familia de casos para resolver diferencias solo con textos y props.

## Mitigacion de falsos positivos

Problema:

- El flag `pwa-installed` en `localStorage` o cookie puede quedar persistido aunque la app se haya desinstalado fuera del navegador.

Objetivo:

- No confiar ciegamente en el flag persistido.

Propuesta adoptada:

1. Tratar `standalone` como senal fuerte de instalacion real.
2. Tratar `getInstalledRelatedApps()` como senal fuerte cuando este disponible.
3. Tratar `localStorage/cookie` como senal debil o cache de optimizacion.
4. Si existe flag persistido pero no hay `standalone` ni `relatedApps`, marcar el caso como `installed-unverified`.
5. Ante `installed-unverified`, revalidar en eventos del ciclo de vida (`visibilitychange`, `pageshow`, `focus`) antes de confirmar la UI de instalado.
6. Si tras la revalidacion no hay evidencia fuerte, limpiar el flag persistido y pasar a un estado no instalado.

### Regla practica

El flag persistido puede acelerar la experiencia, pero no debe ser la unica fuente de verdad a medio plazo.

## Textos e i18n

Habra que redisenar el shape de textos para soportar variantes distintas. La estructura actual de `appInstall` y `appInstalled` es demasiado plana.

Direccion propuesta:

- `appInstall.installable`
- `appInstall.iosManual`
- `appInstall.unavailable`
- `appInstalled.loggedIn`
- `appInstalled.guest`

Cada variante deberia definir sus propios:

- `title`
- `description`
- `cta` o `ctas`
- `hint` si aplica

### Contrato propuesto para `appInstalled`

```ts
appInstalled: {
  loggedIn: {
    title: string;
    description: string;
    ctas: [{ label: string; href: string }];
  };
  guest: {
    title: string;
    description: string;
    ctas: [
      { label: string; href: string },
      { label: string; href: string }
    ];
  };
}
```

### Criterios para `appInstalled`

- `loggedIn` mostrara un unico CTA a `/profile`.
- `guest` mostrara dos CTAs: `/user/register` y `/user/login`.
- `title` y `description` deben tener longitudes similares en ambos casos.
- El objetivo de esta vista es dar acceso rapido a paginas relacionadas con el usuario.
- El padre decide el caso y el componente solo renderiza `title`, `description` y `ctas`.

### Contrato propuesto para `appInstall`

```ts
appInstall: {
  installable: {
    title: string;
    description: string;
    info: string;
    cta: { label: string };
  };
  iosManual: {
    title: string;
    description: string;
    info: string;
  };
  unavailable: {
    title: string;
    description: string;
    cta: { label: string; href: string };
  };
}
```

### Criterios para `appInstall`

- `installable` y `iosManual` compartiran la misma estructura base.
- Ambos mostraran `title` y `description` breves.
- Ambos usaran una pieza inferior de apoyo:
  - `installable`: mensaje informativo + CTA de instalacion.
  - `iosManual`: mensaje informativo sin CTA, explicando instalacion desde Safari.
- `unavailable` no mostrara badge o barra informativa.
- `unavailable` debe cambiar `title` y `description` para hablar del flujo de uso, no de instalar la app.
- `unavailable` mostrara un CTA a `/how-it-work`.
- `title` y `description` deben mantener longitudes consistentes entre variantes, pero sin contradecir el caso funcional.

### Criterio visual

- `AppNotInstalledCard` debe compartir layout entre Android, iOS y `unavailable`.
- `AppInstalledCard` debe compartir layout entre usuario logeado y guest.
- Las diferencias entre casos deben resolverse primero por textos, y solo despues por pequenas variaciones de CTA o hint.

### Direccion de copy

- `appInstalled.loggedIn`: orientado a continuar gestionando perfil y actividad.
- `appInstalled.guest`: orientado a entrar o crear cuenta para acceder al area de usuario.
- `appInstall.installable`: orientado a instalar la app y tener acceso mas rapido.
- `appInstall.iosManual`: orientado a instalar la app manualmente desde Safari.
- `appInstall.unavailable`: orientado a entender el flujo de trabajo y visitar `How it works` si el usuario necesita mas contexto.

## Rutas y CTAs

Rutas previstas:

- Perfil: `/profile`
- Login: `/user/login`
- Registro: `/user/register`
- Fallback informativo: `/how-it-work` solo si el caso `unavailable` lo justifica

## Consideraciones tecnicas

- Evitar ternarios complejos dentro del JSX principal.
- Mantener la logica de deteccion encapsulada en el wrapper.
- No mezclar deteccion de plataforma con copy/render en los componentes visuales.
- Evitar acoplar la variante instalada a una unica hipotesis de autenticacion.
- Actualizar tipos de `HomePageTexts` para reflejar el nuevo contrato de i18n.
- Revisar el CSS para que cada variante tenga una estructura clara y no dependa de clases heredadas ambiguas.
- Diseñar primero dos layouts base solidos y flexibles antes de afinar cada copy.

## Checklist de migracion

- [ ] Documentar el contrato final de estados (`installState`, `authState`, `viewState`).
- [ ] Definir la estructura final de carpetas y archivos para wrapper y variantes.
- [ ] Redisenar el shape de textos en `HomePageTexts`.
- [ ] Actualizar `packages/i18n/es/pages.json`.
- [ ] Actualizar `packages/i18n/en/pages.json`.
- [ ] Actualizar `packages/i18n/de/pages.json`.
- [ ] Implementar el wrapper contenedor con la logica de deteccion actual.
- [ ] Integrar `useAuth()` en el wrapper.
- [ ] Derivar el caso `installed + logged`.
- [ ] Derivar el caso `installed + guest`.
- [ ] Derivar el caso `not-installed + installable`.
- [ ] Derivar el caso `not-installed + ios-manual`.
- [ ] Derivar el caso `not-installed + unavailable`.
- [ ] Implementar mitigacion de falsos positivos por desinstalacion externa.
- [ ] Limpiar flags persistidos cuando la revalidacion descarte instalacion real.
- [ ] Crear `AppNotInstalledCard` con soporte para `installable`, `ios-manual` y `unavailable`.
- [ ] Crear `AppInstalledCard` con soporte para `logged-in` y `guest`.
- [ ] Definir props minimas para `AppNotInstalledCard`.
- [ ] Definir props minimas para `AppInstalledCard`.
- [ ] Diseñar una estructura visual base reutilizable para estados no instalados.
- [ ] Diseñar una estructura visual base reutilizable para estados instalados.
- [ ] Reorganizar `AppInstallSection.module.css` para soportar variantes separadas.
- [ ] Actualizar la integracion en `apps/client/app/[lang]/(app)/page.tsx`.
- [ ] Verificar navegacion a `/profile`, `/user/login` y `/user/register`.
- [ ] Validar comportamiento en Android con `beforeinstallprompt`.
- [ ] Validar comportamiento en iOS Safari sin boton de instalacion.
- [ ] Validar comportamiento del bloque `unavailable` con CTA a `How it works`.
- [ ] Validar el caso de sesion expirada con app instalada.
- [ ] Validar el caso de falso positivo tras desinstalacion externa.
