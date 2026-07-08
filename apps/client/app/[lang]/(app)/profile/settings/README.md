# Profile Settings

## Objetivo

La página de `profile/settings` funciona como centro de gestión de la cuenta del usuario cliente. Debe cubrir en una misma superficie:

1. identidad y estado de cuenta;
2. edición de datos principales;
3. preferencias rápidas;
4. acciones sensibles separadas del resto.

Contexto de namespace:

- esta ruta ya no se considera de forma aislada; el baseline de la familia privada `profile/*`
  ahora vive en
  [../PROFILE_AUDIT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/PROFILE_AUDIT.md:1)
  y su plan de normalización en
  [../PROFILE_PLAN.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/PROFILE_PLAN.md:1)

## Estado actual

La pantalla está funcionalmente madura y el refactor técnico acordado quedó aplicado.

Archivo de ruta:

- [page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/settings/page.tsx:1)

Contenedor cliente de la feature:

- [ProfileSettingsClient.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileSettings/ProfileSettingsClient.tsx:1)

Bloques principales:

- `UserProfileIdentityCard`
- `UserProfileDetailsSummary`
- `UserProfileDetailsForm`
- `UserPreferencesCard`
- `DeleteAccountSectionClient`

## Arquitectura final

### Página principal

Estado actual:

- `settings/page.tsx` ya no es cliente;
- la ruta actúa como wrapper server;
- la composición interactiva vive en `ProfileSettingsClient`.

Decisión:

- se acepta esta frontera SSR/CSR como suficiente para cerrar la página;
- no hace falta fragmentar más la ruta mientras la feature no crezca.

### Detalles de perfil

Archivos clave:

- [useUserProfileDetailsController.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileSettings/details/controller/useUserProfileDetailsController.ts:1)
- [useProfileDetailsFormState.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileSettings/details/controller/useProfileDetailsFormState.ts:1)
- [profileDetails.validation.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileSettings/details/controller/profileDetails.validation.ts:1)
- [profileDetails.view-model.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileSettings/details/controller/profileDetails.view-model.ts:1)

Estado actual:

- el controlador principal ya no concentra toda la lógica;
- el estado del formulario quedó separado;
- la validación quedó en helper puro;
- el view-model quedó aislado del resto del flujo;
- el controlador ahora orquesta dependencias y side effects.

Conclusión:

- el hook sigue siendo el punto de entrada principal de la feature;
- ya no es un mega-hook;
- la separación actual es suficiente para mantenimiento normal.

### Preferencias

Archivos clave:

- [UserPreferencesCard.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/userPreferencesCard/UserPreferencesCard.tsx:1)
- [UserPreferencesCardView.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/userPreferencesCard/UserPreferencesCardView.tsx:1)
- [SettingsLanguageControl.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/userPreferencesCard/SettingsLanguageControl.tsx:1)
- [SettingsThemeControl.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/userPreferencesCard/SettingsThemeControl.tsx:1)

Estado actual:

- `UserPreferencesCard` quedó como wrapper con lógica;
- la vista quedó separada en un componente representacional;
- idioma y tema usan controles específicos de contexto;
- la card dejó de cargar directamente con props de presentación pensadas para `settings`.

Conclusión:

- se mantiene el principio del proyecto de wrapper + vista cuando la lógica lo justifica;
- `LanguageSwitcher` y `ThemeToggler` siguen siendo primitivas reutilizables;
- si aparecen más contextos especiales, conviene seguir con wrappers y no engordar los componentes base.

### Direcciones compartidas

Archivos clave:

- [AddressFormFields.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/shared/addressFormFields/AddressFormFields.tsx:1)
- [WorkAddressSelector.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/cleaning-service/CleaningRequestForm/WorkAddressSelector/WorkAddressSelector.tsx:1)
- [UserProfileDetailsForm.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileSettings/details/form/UserProfileDetailsForm.tsx:1)

Estado actual:

- `AddressFormFields` ya no pertenece a `cleaning-service`;
- vive en una ubicación compartida;
- `cleaning-service` y `profile/settings` consumen la misma pieza desacoplada.

Conclusión:

- se eliminó el acoplamiento de dominio entre features;
- la pieza de direcciones ya puede evolucionar como bloque compartido real.

### Avatar selector

Archivo clave:

- [AvatarSelector.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/avatarSelector/AvatarSelector.tsx:1)

Estado actual:

- se corrigió el problema de tipado alrededor de `createPortal`;
- el chequeo global de TypeScript vuelve a pasar.

## Estado UX/UI

La página se considera estable a nivel funcional. Lo pendiente ya no es arquitectura ni bugs estructurales, sino refinamiento visual y densidad UX.

### Lo que ya está bien resuelto

- composición clara por bloques;
- navegación lateral estable;
- edición de perfil entendible;
- preferencias integradas en la página;
- danger zone separada correctamente.

### Lo que puede mejorarse sin tocar arquitectura

- jerarquía visual entre identidad, details, preferencias y danger zone;
- protagonismo del completion badge cuando el perfil está completo;
- densidad vertical en algunas cards;
- cercanía visual entre copy y toggles en preferencias;
- sensación general de “panel de gestión” frente a “panel de lectura”.

## Verificación técnica

Estado verificado al cierre de esta iteración:

- `pnpm exec tsc --noEmit --pretty false`: `ok`
- no quedaron errores de tipado introducidos por el refactor;
- `settings` ya no depende de componentes internos de `cleaning-service`;
- la ruta `settings` ya no requiere `'use client'`.

## Deuda técnica aceptada

La página puede cerrarse aceptando esta deuda residual:

- `useUserProfileDetailsController` sigue siendo el orquestador principal de details, aunque ya no mezcla todas las capas;
- `LanguageSwitcher` y `ThemeToggler` todavía soportan variantes visuales, pero ya no se siguió empujando esa complejidad dentro de `settings`;
- la página puede beneficiarse de una iteración final de polish visual, pero no necesita más refactor estructural para salir de estado “en progreso”;
- falta una sección dedicada para cambio de correo;
- falta una sección dedicada para cambio de password;
- falta cobertura de tests específica para la migración ya aplicada de `details` y direcciones.

## Criterio de cierre

La feature puede considerarse técnicamente cerrada si se mantiene este estado:

- typecheck limpio;
- composición SSR/CSR estable;
- wrappers y vistas separados en las secciones con lógica relevante;
- componentes compartidos desacoplados por dominio;
- sin regresiones funcionales en edición de perfil, preferencias y eliminación de cuenta.

## Recomendación final

No abrir más refactor técnico sobre `settings` salvo que cambie el alcance de la feature. La siguiente iteración, si se decide hacerla, debería ser exclusivamente de UX/UI y responsive fino.

Actualización de alcance:

- esta recomendación queda superada por la nueva migración de perfil compartido entre `settings` y páginas de servicio;
- `settings` volverá a recibir trabajo estructural en la gestión de direcciones y en la extracción de piezas reutilizables.

## Tareas pendientes de alcance

Estas tareas ya están aceptadas como parte de la siguiente fase de evolución de `settings`:

- crear una sección dedicada para cambio de correo
- crear una sección dedicada para cambio de password
- añadir tests unitarios para helpers, validación y estado del formulario de perfil
- añadir tests de integración para la UX de selección/edición de direcciones ya implementada
- añadir tests de accesibilidad para las superficies de details y gestión de direcciones

## Observaciones abiertas

Esta sección registra problemas detectados después del cierre del refactor estructural. No son bloqueos de arquitectura, pero sí temas relevantes para la siguiente iteración.

### 1. Tiempo de compilación inicial anormalmente alto

Contexto observado en desarrollo:

- `Compiled /[lang]/profile/settings in 133.2s (2454 modules)`
- `GET /en/profile/settings 200 in 138465ms`

Lectura inicial:

- esto ya no parece un problema específico de `settings` aislado, sino del peso acumulado de la ruta y de sus dependencias en primer render;
- el warning de `Browserslist: caniuse-lite is outdated` no explica por sí solo una compilación de más de dos minutos;
- la ruta de perfil carga varios providers, navegación privada, componentes cliente, i18n, alerts y piezas compartidas, por lo que conviene medir antes de optimizar a ciegas.

Hipótesis a revisar:

- exceso de módulos arrastrados por barrels amplios;
- dependencias cliente que podrían no necesitar formar parte del primer render de esta ruta;
- imports compartidos que terminan trayendo más superficie de la necesaria;
- coste de compilación general del workspace y no solo de esta pantalla.

Acción recomendada:

- hacer una pasada específica de profiling de compilación y carga de módulos antes de tocar código por intuición.

### 2. `ThemeToggler` en nav se percibe siempre activo en dark mode

Contexto:

- el toggle usa `button--ghost`;
- además aplica la clase `isDark` cuando el tema actual es oscuro;
- visualmente esto se confunde con un estado activo persistente.

Lectura inicial:

- no parece un bug funcional del toggle;
- sí parece un problema de semántica visual entre “estado actual del tema” y “estado activo del botón”.

Acción recomendada:

- revisar el diseño de `ThemeToggler` para que refleje el modo actual sin parecer un botón activo o presionado de forma permanente;
- probablemente convenga desacoplar el estilo de “tema actual” del lenguaje visual de `button--active`.

### 3. `ProfileNav` necesita revisión visual

Contexto:

- la navegación ya es estable a nivel técnico;
- sin embargo, su diseño todavía no termina de sentirse correcto dentro de la pantalla de usuario.

Lectura inicial:

- el problema parece más de proporción, densidad, contraste y relación entre icono, label y columna lateral que de arquitectura;
- también puede estar influyendo el alto fijo del workspace y la forma en que el nav convive con el contenido desplazable.

Acción recomendada:

- revisar el nav con capturas en sus estados reales:
  - desktop expandido;
  - desktop colapsado;
  - dark/light;
  - páginas activas distintas.

### 4. Scroll doble en layout privado de usuario

Contexto actual:

- el layout de perfil usa una card de alto fijo;
- el `children` hace scroll interno;
- la página general sigue teniendo footer;
- al llegar al final del scroll interno, aparece el scroll del documento y se revela el footer.

Lectura inicial:

- este es el problema UX más claro de la ruta privada en desktop;
- el comportamiento actual mezcla dos superficies de scroll con intenciones distintas;
- para volver hacia arriba, la interacción se vuelve torpe porque el usuario alterna entre scroll interno y scroll de página.

Pregunta de diseño abierta:

- si la ruta privada debe comportarse como “workspace app-like”, probablemente no conviene mantener footer global dentro de esta experiencia;
- si el footer desaparece en esta ruta, la preferencia o información de cookies tendría que reubicarse.

Dirección recomendada:

- evaluar quitar el footer en rutas privadas de usuario;
- mover la preferencia o información de cookies a `settings`;
- en ese caso, no haría falta un módulo de cookies complejo: bastaría una sección informativa y una acción mínima si solo se usan cookies esenciales.

### 5. Cookies dentro de `settings`

Lectura inicial:

- si las cookies en este cliente son solo esenciales, no hace falta sobredimensionar la UI;
- sí puede tener sentido exponer una sección informativa en `settings` para explicar su uso;
- eso también resolvería parcialmente la pérdida del acceso actual desde el footer si se decide ocultarlo en rutas privadas.

Acción recomendada:

- documentar una sección simple de cookies dentro de `settings`, orientada a transparencia, no a configuración compleja.

## Próxima iteración sugerida

Orden recomendado para tratar estas observaciones:

1. revisar el layout privado y decidir si el footer debe existir en rutas de usuario;
2. definir si cookies se integran en `settings`;
3. corregir la semántica visual de `ThemeToggler`;
4. auditar visualmente `ProfileNav` con capturas;
5. perfilar el tiempo de compilación de la ruta antes de optimizar imports o estructura.

## Cambios aplicados después de esta revisión

### Footer fuera de rutas privadas de usuario

Estado:

- el footer global ya no se renderiza en rutas bajo `/profile`;
- la decisión se implementó en el shell del grupo `(app)` para evitar el doble scroll en desktop dentro del workspace privado.

Resultado esperado:

- desaparece el conflicto entre scroll interno del panel derecho y scroll del documento causado por el footer al final de la página.

### Referencia de cookies integrada en `settings`

Estado:

- `UserPreferencesCard` ahora incluye una sección de cookies;
- la sección es informativa y reutiliza `openManager()` del contexto existente;
- no introduce un sistema paralelo de consentimiento.

Resultado esperado:

- el acceso a la información/gestión de cookies ya no depende del footer en la zona privada;
- `settings` se vuelve el lugar coherente para esta preferencia informativa.

### Revisión visual de `ThemeToggler`

Estado:

- `ThemeToggler` ahora soporta una variante visual específica para superficies de settings;
- el control en preferencias ya no usa el mismo lenguaje visual que hacía que en dark mode pareciera “activo permanente”.

Resultado esperado:

- el componente sigue expresando el tema actual;
- deja de confundirse con un estado activo de navegación o botón presionado permanente.

## Próximo paso inmediato

La siguiente revisión ya no debería ser de arquitectura ni de wiring técnico. Corresponde una auditoría visual con capturas de pantalla de:

- desktop `settings` completo;
- desktop con nav expandido y colapsado;
- estado light y dark;
- estado con profile completo e incompleto;
- mobile;
- interacción del bloque de preferencias y del `ThemeToggler`.

## Bloque 1. Navbar principal

Esta sección documenta el siguiente bloque de trabajo acordado. Aunque no pertenece directamente a `settings`, se registra aquí para conservar continuidad del contexto visual y técnico de la zona privada del usuario.

### Diagnóstico

Las capturas actuales muestran que el navbar principal funciona razonablemente bien en estructura, pero los paneles desplegables no comparten una gramática visual consistente.

Problemas detectados:

- la lista de idioma usa una composición propia con badges `DE / EN / ES`;
- la lista de cuenta usa otra jerarquía visual;
- mobile separa `menu`, `services`, `account` y `preferences` con un lenguaje visual todavía desigual;
- el botón de perfil sigue usando un icono genérico aunque el usuario ya tenga avatar definido;
- el panel de cuenta no aprovecha el nombre real del usuario como referencia de identidad.

### Lectura técnica

Archivos implicados:

- [NavbarContainer.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/NavbarContainer.tsx:1)
- [NavbarDesktopView.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/NavbarDesktopView/NavbarDesktopView.tsx:1)
- [NavbarTabletView.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/NavbarTabletView/NavbarTabletView.tsx:1)
- [NavbarMobileView.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/NavbarMobileView/NavbarMobileView.tsx:1)
- [NavbarAccountContent.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/components/NavbarAccountContent.tsx:1)
- [NavbarLinkList.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/components/NavbarLinkList.tsx:1)
- [LanguageSwitcher.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/languageSwitcher/LanguageSwitcher.tsx:1)

Conclusiones:

- el punto de ruptura principal de coherencia visual es `LanguageSwitcher`;
- el navbar hoy solo consume `auth`, no `profile`, por eso no puede usar avatar ni nombre reales;
- la infraestructura de paneles ya existe, pero el panel de idioma no sigue la misma gramática visual que cuenta/menu/services.

### Decisiones acordadas

- usar la imagen real del usuario como trigger de cuenta cuando exista;
- mantener fallback al icono actual si no hay avatar;
- usar el nombre real del usuario como título del panel de cuenta cuando esté logeado;
- no repetir avatar dentro del panel de cuenta si ya está presente en el trigger;
- alinear el panel de idioma con la misma gramática visual de las otras listas del navbar;
- evitar que el badge corto del idioma sea el protagonista visual de la lista.

### Plan de implementación

#### Paso 1. Conectar identidad real al navbar

Tareas:

- conectar `NavbarContainer` con `useProfile`;
- pasar nombre y avatar al modelo de contenido del navbar;
- crear un trigger reutilizable para el botón de cuenta.

Resultado esperado:

- desktop, tablet y mobile usarán la misma lógica de identidad;
- el usuario verá su avatar real cuando exista.

#### Paso 2. Mejorar el panel de cuenta

Tareas:

- usar el nombre real del usuario como título del panel cuando esté logeado;
- mantener fallback a título genérico si falta el nombre;
- conservar la lista de enlaces y logout dentro del mismo sistema actual.

Resultado esperado:

- el panel se sentirá más personal;
- la identidad del usuario quedará mejor integrada sin duplicar avatar.

#### Paso 3. Unificar el panel de idioma

Tareas:

- revisar la API de `LanguageSwitcher` para soportar un render de panel coherente con navbar;
- reutilizar la gramática visual de `NavbarLinkList` o una equivalente;
- mantener accesibilidad y soporte para desktop/tablet/mobile.

Resultado esperado:

- lenguaje, cuenta, menú y servicios compartirán una misma familia visual;
- desaparecerá la ruptura visual entre listas.

#### Paso 4. Pasada final cross-view

Tareas:

- revisar desktop light/dark;
- revisar tablet;
- revisar mobile;
- verificar estados abiertos/cerrados de cuenta, idioma, menú y servicios.

Resultado esperado:

- coherencia visual transversal;
- mismo principio de identidad y paneles en todas las vistas.

### Estado de implementación

Avance aplicado en esta iteración:

- `NavbarContainer` ya consume `profile` además de `auth`;
- el modelo compartido del navbar ya resuelve `displayName`, `avatarSrc` y `avatarAlt`;
- desktop, tablet y mobile ya usan el mismo trigger reutilizable de perfil;
- el trigger de cuenta ya muestra el avatar real cuando existe y mantiene fallback al icono si no existe;
- el panel de cuenta ya usa el nombre real del usuario como título cuando está disponible;
- `LanguageSwitcher` ya soporta `panelVariant='navbar'`;
- las variantes de navbar de idioma ya usan la misma jerarquía de header, espaciado y estructura de item que el resto de paneles.

Pendiente deliberado para la siguiente pasada:

- evaluación visual fina con capturas reales en desktop/tablet/mobile;
- decidir si el meta corto del idioma (`DE`, `EN`, `ES`) debe quedarse como detalle secundario o reducirse aún más;
- revisar si el avatar del trigger necesita ajuste fino de tamaño, borde o contraste según tema.

### Segunda revisión visual

Observaciones añadidas después de la primera implementación:

- algunos títulos de panel seguían usando gramáticas distintas entre vistas;
- el título del panel de cuenta rompía a dos líneas con nombres largos;
- el color percibido de algunos links no se sentía idéntico entre listas equivalentes;
- en mobile, el bloque final de las listas se sentía demasiado pegado al borde inferior;
- el header de los paneles mobile todavía tenía más aire del necesario frente al contenido.

Decisiones aplicadas:

- mantener títulos genéricos de panel como labels de sección con una sola gramática;
- tratar el nombre del usuario como título de identidad, no como label genérico;
- forzar truncado con ellipsis para nombres largos en el panel de cuenta;
- unificar el color base e interacción de los links mediante la misma regla compartida;
- reducir el protagonismo visual del header en mobile y dar más respiración al final de la lista.

Resultado de esta pasada:

- los títulos genéricos del navbar ahora comparten el mismo tratamiento visual;
- el nombre del usuario ya no rompe layout en tablet/mobile/desktop cuando es demasiado largo;
- los links de panel usan una referencia de color más consistente entre vistas;
- los paneles mobile cierran con mejor espacio vertical y un header menos dominante.

### Tercera revisión de estructura

Hallazgo confirmado con la revisión de desktop y tablet:

- `menu` y `account` ya reutilizaban la misma base real de renderizado mediante `NavbarLinkList` y `NavbarAccountContent`;
- `language` todavía resolvía su propia lista dentro de `LanguageSwitcher`, aunque visualmente intentara parecer parte de la misma familia;
- esa diferencia estructural explicaba parte de las variaciones de color, spacing y estado activo entre paneles equivalentes.

Corrección aplicada:

- la variante `panelVariant='navbar'` de `LanguageSwitcher` ahora reutiliza la misma base visual de items del navbar;
- el color de texto y el comportamiento hover/focus ya no salen de reglas paralelas;
- el idioma actual dejó de depender de una sombra sutil y ahora usa una marca de selección con más contraste, borde y presencia tanto en light como en dark.

### Cuarta revisión de color

Decisión aplicada:

- las listas del navbar pasan a usar `--text-secondary` como color base;
- los estados enfatizados, hover y selección pasan a usar `--text-primary`;
- se evita seguir mezclando `card-text-*` con `page-text-*` dentro de los links del navbar.

Alcance:

- links inline del nav principal;
- links de panel en desktop, tablet y mobile;
- títulos de panel dentro del navbar;
- variante navbar de `LanguageSwitcher`.

Conclusión:

- la divergencia principal ya no está en `account` vs `menu`;
- estaba en `language`, y quedó reducida a lo estrictamente necesario por semántica propia del selector.

## Bloque 2. Nav lateral de perfil

Primer ajuste aplicado en esta iteración:

- se corrigió el contenedor general de la ruta `profile` para centrar mejor el workspace en desktop/tablet y reducir el aire sobrante inferior;
- `navColumn` dejó de depender visualmente del gradiente de la card contenedora;
- `SideNav` recibió una primera pasada de integración visual: más padding superior, fondo más estable en expandido/colapsado, mejor jerarquía de navegación y footer más uniforme;
- el botón de colapsar dejó de romper la continuidad visual con los demás actions.

Problemas que motivaron esta pasada:

- el fondo lateral se sentía ajeno al resto de la página;
- en colapsado el gradiente se deformaba y se veía arbitrario;
- arriba faltaba respiración y la navegación no se leía como sistema;
- abajo el toggle de colapso no respetaba el mismo ritmo ni color que el resto.
