# Navbar (Frontend)

## Objetivo

Documentar el estado actual del `navbar`, identificar duplicaciones y acoplamientos innecesarios, y proponer una refactorización que deje una separación más clara entre:

- orquestación de datos y navegación
- estado interactivo del navbar
- vistas presentacionales reutilizables

La meta es acercar las vistas a un modelo más presentacional y SSR-friendly, reduciendo lógica repetida entre `desktop`, `tablet` y `mobile`.

## Estructura actual

Hoy el módulo está dividido en:

- [NavbarContainer.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/NavbarContainer.tsx)
- [NavbarDesktopView.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/NavbarDesktopView/NavbarDesktopView.tsx)
- [NavbarTabletView.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/NavbarTabletView/NavbarTabletView.tsx)
- [NavbarMobileView.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/NavbarMobileView/NavbarMobileView.tsx)
- [navbar.shared.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/navbar.shared.ts)
- [navbar.types.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/navbar.types.ts)

## Estado actual detectado

### 1. `NavbarContainer` sigue siendo la capa de orquestación principal

En [NavbarContainer.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/NavbarContainer.tsx:14):

- consume `profile`, `auth`, `texts`, `router` y `lang`
- resuelve el breakpoint responsive
- resuelve navegación con `router.push(href(lang, path))`
- construye el `navbar model`
- calcula `mainNavigationLabel`

Estado actualizado:

- ya no mantiene `menuOpen`
- ya no pasa `theme`
- el problema de arrancar en `desktop` ya fue corregido con un hook basado en `matchMedia`
- hoy el container ya resuelve el modelo una sola vez antes de pasar props a la vista
- hoy el container también resuelve el placeholder y selecciona directamente `desktop/tablet/mobile`

Pendiente real:

- sigue siendo una capa importante de composición, pero eso ya es consistente con su responsabilidad actual

### 2. La selección de variante ya vive en `NavbarContainer`

Estado actualizado:

- `NavbarView` fue eliminado del flujo y del módulo
- el `Container` renderiza directamente la variante correcta según `deviceSize`
- el placeholder del navbar también quedó centralizado ahí

Conclusión:

- se eliminó una capa intermedia que ya no aportaba valor real

### 3. Las vistas no son realmente presentacionales

Estado actualizado:

- las vistas ya no consumen `useI18n`, `useAuth`, `useProfile` ni `useRouter`
- las vistas ya no llaman `getNavbarContent()` por su cuenta
- la lógica repetida de dismiss ya se centralizó en `useDismissibleLayer`
- siguen manteniendo estado interactivo local por variante

Conclusión:

- ya son mucho más presentacionales que al inicio
- todavía no son componentes completamente server-safe ni puramente estáticos, pero el acoplamiento principal ya se redujo bastante

### 4. Hay repetición visible de lógica de interacción

Se repite el patrón de:

- abrir/cerrar panel
- cerrar por click fuera
- cerrar con `Escape`

Ejemplos:

- desktop: [NavbarDesktopView.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/NavbarDesktopView/NavbarDesktopView.tsx:49)
- tablet: [NavbarTabletView.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/NavbarTabletView/NavbarTabletView.tsx:62)
- mobile: [NavbarMobileView.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/NavbarMobileView/NavbarMobileView.tsx:70)

Problema:

- la misma responsabilidad de interacción está distribuida en varias vistas con pequeñas variaciones
- esto hace más difícil mantener accesibilidad, comportamiento y tests de forma uniforme

### 5. Hay repetición de bloques de UI

Se repiten piezas que podrían ser componentes compartidos:

- logo principal desktop/tablet:
  - [NavbarDesktopView.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/NavbarDesktopView/NavbarDesktopView.tsx:76)
  - [NavbarTabletView.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/NavbarTabletView/NavbarTabletView.tsx:121)
- acciones de preferencias (`ThemeToggler` + `LanguageSwitcher`):
  - [NavbarDesktopView.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/NavbarDesktopView/NavbarDesktopView.tsx:99)
  - [NavbarTabletView.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/NavbarTabletView/NavbarTabletView.tsx:132)
  - [NavbarMobileView.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/NavbarMobileView/NavbarMobileView.tsx:232)
- listas de navegación con `button + icon/image + label`
- cabeceras de panel con `title`
- panel de cuenta y panel de navegación

Conclusión:

- hoy las vistas están reescribiendo variaciones de las mismas piezas, en vez de componer componentes menores

### 6. `navbar.shared.ts` centraliza contenido, pero sigue demasiado acoplado

En [navbar.shared.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/navbar.shared.ts:133):

- combina defaults
- mezcla `texts`, `navbarConfig` y `auth`
- resuelve labels de i18n
- arma links de usuario
- arma accesibilidad

Lo positivo:

- ya existe una base útil para centralizar contenido

Estado actualizado:

- `texts` ya no está tipado como `any`
- el modelo ya incorpora `branding`, `preferences`, `session` y `a11y`
- las vistas ya no construyen ese modelo

Pendiente:

- todavía mezcla resolución de contenido estático con lógica de sesión (`auth.isLogged`)
- esa mezcla es tolerable en esta fase, pero puede separarse más si más adelante se quiere un modelo todavía más puro

### 7. Hay inconsistencias funcionales entre vistas

Estado actualizado:

- `logout` ya está presente en desktop, tablet y mobile
- el código muerto inmediato de mobile ya fue limpiado
- las preferencias de tema e idioma ya se renderizan con un contrato consistente entre variantes:
  - desktop/tablet muestran solo icono
  - mobile muestra icono + valor actual de forma discreta

Pendiente real:

- todavía hay diferencias estructurales entre variantes porque cada una mantiene su propio estado interactivo y su propio layout
- el contrato funcional ya está más alineado, pero la composición aún no está totalmente consolidada

### 8. Faltan tests específicos del navbar

No se encontraron tests dirigidos al módulo `packages/components/client/navbar/*`.

Riesgo:

- cualquier refactor de interacción, accesibilidad o render responsive hoy depende demasiado de verificación manual

### 9. El sourcing de i18n del navbar ya tiene una fuente principal, pero la migración no está completamente cerrada

Estado anterior:

- `components.client.navbar`
- `components.client.avatar`
- `pages.client.user.profileNav`
- `pages.client.user.edit.theme`
- `components.dashboard.sidebar.logout`

Estado actualizado:

- `components.client.navbar.*` ya define:
  - `session.logoutLabel`
  - `preferences.*`
  - `preferences.themeToggle.*`
  - `languageSwitcher.*`
  - `accountLinks.*`
- `navbar.shared.ts` ya prioriza ese árbol para resolver el componente
- `navbar.shared.ts` ya resuelve y entrega por props los labels completos de `ThemeToggler` y `LanguageSwitcher`
- el navbar ya absorbió también `profile`, `register` y `login` como labels propios de sesión
- el navbar ya no depende funcionalmente de `pages.client.user.profileNav`, `pages.client.user.edit.theme` ni `components.dashboard.sidebar.logout` para su UI principal
- el navbar ya no usa `components.client.avatar` como fallback para resolver su UI

Decisión de trabajo:

- mantener la organización de i18n por responsabilidad
- no eliminar textos ya existentes en `pages.*`
- pero definir en `components.client.navbar.*` el contrato correcto del navbar
- `LanguageSwitcher` y `ThemeToggler` deben considerarse parte del scope del navbar cuando se renderizan dentro del nav

Estado de esta decisión:

- resuelta
- `components.client.avatar` ya no participa en el contrato del navbar

### 10. Español ya quedó mucho más alineado al navbar, pero la revisión no está completamente cerrada

Estado actualizado:

- `components.client.navbar.*` en español ya tiene:
  - sesión
  - preferencias
  - theme toggle
  - account links
  - headers
  - links
  - services
  - accessibility
- eso ya permite usar español como referencia mucho más clara del componente

Pendientes:

- `pages.*` puede seguir teniendo textos en inglés, pero ya no bloquea cerrar el navbar
- todavía conviene una pasada final de consistencia lingüística sobre términos como `configuración`, `perfil`, `servicio para el hogar`, etc.

Conclusión:

- español no falta por completo
- lo que falta es cerrar un bloque de referencias coherente y completo para el navbar

### 11. La accesibilidad mejoró, pero todavía hay puntos a revisar

Estado actual:

- la mayoría de `aria-*` del navbar ya salen del modelo `a11y`
- los toggles principales usan `button`, `aria-expanded` y `aria-controls`
- los paneles usan `aria-labelledby`
- mobile ya no depende de ids hardcodeados para panel/títulos; ahora usa ids dinámicos
- desktop ya relaciona el toggle de cuenta con el `nav` real del panel
- tablet ya eliminó wrappers semánticos redundantes alrededor del panel activo
- `LanguageSwitcher` y `ThemeToggler` ya reciben desde el navbar los labels/presentación que usan dentro del nav

Pendientes razonables:

- la deuda técnica de hooks en `ThemeToggler` y `LanguageSwitcher` ya fue corregida
- todavía conviene una pasada final de consistencia de landmarks y naming accesible si se extraen más subcomponentes

Esto no implica un problema crítico inmediato, pero sí debe quedar en el plan antes de considerar cerrada la refactorización del navbar.

## Diagnóstico resumido

El problema principal no es solo la repetición visual.

El problema real es que la separación actual de capas no representa una separación de responsabilidades estable:

- el `Container` orquesta datos y parte del estado UI
- las vistas resuelven su estado interactivo local por variante

Resultado:

- hay duplicación
- hay inconsistencias entre variantes
- las vistas no son completamente presentacionales
- el SSR queda limitado porque demasiada lógica vive dentro de componentes cliente por variante

## Sugerencia de diseño

### Objetivo de la refactorización

Llegar a una estructura con estas responsabilidades:

1. Capa de composición/orquestación
- consume contextos
- resuelve navegación
- construye un `navbar model`
- decide qué variante interactiva montar

2. Capa de control interactivo
- maneja estado de paneles abiertos
- maneja `click outside`, `Escape`, toggles y cierre cruzado entre paneles
- no renderiza contenido duplicado

3. Capa presentacional
- recibe props serializables y callbacks
- renderiza logo, listas, paneles y acciones
- no consume contextos
- no conoce `useRouter`, `useAuth`, `useI18n` ni `useProfile`

### Propuesta concreta

#### A. Mantener un solo punto de construcción del modelo

Mover la resolución de contenido a una sola capa:

- `buildNavbarModel({ texts, navbarConfig, auth })`

Ese modelo debería entregar:

- `branding`
- `menuLinks`
- `serviceLinks`
- `primaryLinks`
- `userLinks`
- `preferenceLabels`
- `accessibility`
- `sessionActions`
- `i18nSources`

Las vistas no deberían volver a construir ese modelo.

#### A.1. Mantener i18n organizado por responsabilidad

Decisión:

- no mover todo a `pages.*`
- no borrar textos existentes de `pages.*`
- no mezclar todo en una sola bolsa genérica

Dirección correcta:

- `components.client.navbar.*` debe convertirse en la fuente del navbar
- `pages.*` puede seguir existiendo para páginas que reutilicen conceptos parecidos
- si `ThemeToggler` y `LanguageSwitcher` se usan como parte del nav, sus textos relevantes deben existir también en el árbol del navbar

Objetivo:

- que el navbar pueda resolverse completo desde su propio dominio de i18n, sin depender semánticamente de textos de perfil o sidebar

#### B. Extraer componentes reutilizables

Componentes candidatos:

- `NavbarBrand`
- `NavbarLinkList`
- `NavbarPanel`
- `NavbarPanelHeader`
- `NavbarAccountLinks`
- `NavbarPreferencesPanel`
- `NavbarIconAction`
- `NavbarUtilityActions`

Estos componentes pueden ser server-safe o presentacionales puros si reciben datos ya resueltos.

#### C. Sacar la lógica repetida de interacción a hooks/controladores

Hooks candidatos:

- `useDismissibleLayer`
- `useNavbarDesktopController`
- `useNavbarTabletController`
- `useNavbarMobileController`

O, si se quiere una solución más simple:

- un único `useNavbarOverlay` reutilizable para cerrar por `pointerdown` externo y `Escape`

#### D. Mantener la selección responsive en la capa de composición

Estado actualizado:

- este punto ya se resolvió moviendo la selección de variante al `NavbarContainer`
- `NavbarView` ya no existe

#### E. Hacer las vistas más SSR-friendly

Si la meta es que las vistas sean presentacionales y reutilizables:

- las piezas de markup deben quedar separadas de hooks cliente
- la lógica de sesión, navegación y i18n debe resolverse antes de llegar a esas piezas

Importante:

- la variante responsive basada en `window.innerWidth` no es SSR real
- mientras `deviceSize` dependa de un `useEffect`, el primer render seguirá siendo una aproximación cliente

Para mejorar esto hay dos caminos:

1. mantener selección de variante en cliente, pero con vistas internas puramente presentacionales
2. rediseñar la estrategia responsive para depender más de CSS/layout y menos de selección condicional por JS

La primera opción es la más pragmática para una primera fase.

## Arquitectura sugerida

Una estructura más clara podría quedar así:

- `NavbarContainer`
  - consume `auth`, `profile`, `texts`, `lang`, `router`
  - construye `navbarModel`
  - decide `desktop/tablet/mobile`
  - monta la variante correcta

- `NavbarDesktopController`
- `NavbarTabletController`
- `NavbarMobileController`
  - mantienen solo el estado interactivo propio de cada variante

- `NavbarDesktop`
- `NavbarTablet`
- `NavbarMobile`
  - componentes presentacionales

- `components/`
  - `NavbarBrand`
  - `NavbarPanel`
  - `NavbarLinkList`
  - `NavbarUtilityActions`
  - `NavbarAccountMenuContent`
  - `NavbarPreferencesContent`

## Sugerencia de ejecución

No conviene intentar “hacer SSR puro” y “eliminar duplicación” en un solo paso grande.

La secuencia más segura es:

1. estabilizar contrato y responsabilidades
2. extraer componentes repetidos sin cambiar comportamiento
3. mover lógica interactiva repetida a hooks/controladores
4. dejar las vistas como presentacionales
5. cerrar sourcing i18n y accesibilidad del navbar
6. recién después decidir si conviene introducir controllers por variante o mantener el estado local actual

## Plan de trabajo propuesto

### Fase 1. Cerrar el contrato actual

Objetivo:

- definir qué capa resuelve datos y qué capa solo renderiza

Cambios propuestos:

- eliminar props sin uso como `theme`
- definir un `NavbarModel` explícito
- tipar `texts` en vez de usar `any` en [navbar.shared.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/navbar/navbar.shared.ts:138)
- mover la llamada a `getNavbarContent()` fuera de las vistas

Resultado esperado:

- una sola fuente de verdad para el contenido del navbar

Estado:

- parcialmente completado
- el modelo ya centraliza branding, sesión, preferencias y accesibilidad

### Fase 2. Normalizar inconsistencias funcionales

Objetivo:

- alinear comportamiento entre variantes antes del refactor mayor

Cambios propuestos:

- agregar `logout` a mobile
- eliminar código muerto como `currentSectionTitle`
- eliminar imports no usados
- revisar si `menuOpen` debe seguir en container o bajar a tablet

Resultado esperado:

- mismas capacidades funcionales en desktop, tablet y mobile

Estado:

- mayormente completado

### Fase 3. Extraer componentes reutilizables

Objetivo:

- reducir markup duplicado

Cambios propuestos:

- extraer `NavbarBrand`
- extraer `NavbarPanel`
- extraer `NavbarLinkList`
- extraer `NavbarUtilityActions`
- extraer contenido de cuenta y preferencias

Resultado esperado:

- menos JSX repetido y menor costo de mantenimiento

Estado:

- parcialmente completado
- ya existen `NavbarBrand`, `NavbarLinkList` y `NavbarPanelSection`

### Fase 4. Extraer lógica interactiva repetida

Objetivo:

- unificar apertura/cierre de overlays y paneles

Cambios propuestos:

- crear `useDismissibleLayer` o equivalente
- mover listeners globales fuera de las vistas presentacionales
- centralizar reglas de cierre por click externo y `Escape`

Resultado esperado:

- comportamiento consistente y más fácil de testear

Estado:

- parcialmente completado
- ya existe `useDismissibleLayer`

### Fase 5. Convertir vistas en presentacionales

Objetivo:

- que `Desktop`, `Tablet` y `Mobile` reciban datos y callbacks, sin consumir contextos

Cambios propuestos:

- remover `useAuth`, `useI18n`, `useProfile`, `useRouter` de las vistas
- recibir `logoutLabel`, `accountTitle`, `links`, `a11y`, `branding` y callbacks por props
- dejar hooks solo en `Container` o controllers

Resultado esperado:

- vistas reutilizables, más fáciles de portar y más cercanas a SSR

Estado:

- parcialmente completado
- las vistas ya no consumen `useI18n`, `useAuth`, `useProfile` ni `useRouter`
- todavía mantienen estado interactivo local según variante

### Fase 6. Cerrar i18n del navbar por responsabilidad

Objetivo:

- definir `components.client.navbar.*` como fuente correcta del navbar

Decisión explícita:

- mantener `pages.*` y otros árboles existentes
- no eliminar textos ya declarados en otros dominios
- pero dejar de depender semánticamente de ellos para resolver el navbar

Cambios propuestos:

- definir dentro de `components.client.navbar.*`:
  - headers
  - links
  - services
  - accessibility
  - account menu
  - logout
  - preferences
  - labels de theme/language del nav
- textos de `languageSwitcher`
- textos del toggle de theme si aplica
- completar el bloque español solo para el navbar
- adaptar `navbar.shared.ts` para leer prioritariamente desde `components.client.navbar.*`

Resultado esperado:

- el navbar puede resolverse completo desde su propio dominio de i18n
- español queda como referencia clara del componente

Estado:

- parcialmente completado
- `components.client.navbar.*` ya es la fuente principal del navbar
- `ThemeToggler` y `LanguageSwitcher` ya reciben sus labels desde el modelo resuelto del navbar
- los labels de sesión del navbar ya salen de su propio dominio

### Fase 7. Revisar accesibilidad y semántica final

Objetivo:

- cerrar los detalles de accesibilidad antes de dar por finalizada la refactorización

Cambios propuestos:

- revisar ids hardcodeados en mobile
- normalizar `aria-label` y `aria-labelledby` en overlays y paneles
- revisar si `LanguageSwitcher` y `ThemeToggler` deben recibir textos ya resueltos desde el nav
- validar que el árbol semántico de `nav`, `header`, `section`, `aside` y paneles siga siendo consistente

Resultado esperado:

- accesibilidad más consistente
- menos dependencias implícitas entre subcomponentes del nav y otros dominios

Estado:

- parcialmente completado
- mobile ya usa ids dinámicos y relación consistente entre toggles, panel y títulos
- desktop y tablet ya tienen una semántica de panel más limpia
- `LanguageSwitcher` y `ThemeToggler` ya reciben contrato de presentación y labels desde el navbar
- queda una pasada final de landmarks y naming accesible si se siguen extrayendo subcomponentes

### Fase 8. Añadir cobertura de tests

Objetivo:

- proteger el refactor

Tests recomendados:

- render por variante
- apertura/cierre de paneles
- cierre con `Escape`
- cierre por click fuera
- presencia de `logout` según sesión
- accesibilidad básica (`aria-expanded`, `aria-controls`, labels)

Resultado esperado:

- refactor con menor riesgo de regresión

## Pendientes reales

Lo que falta por revisar o cambiar ya es bastante más acotado:

- hacer una pasada final de consistencia lingüística en `es` para términos del navbar
- valorar si todavía compensa extraer un bloque reutilizable de acciones de preferencias
- evaluar si vale la pena separar controllers por variante o si el estado local actual ya es suficiente
- añadir tests básicos del navbar antes de dar el refactor por cerrado

## Riesgos a vigilar

- romper navegación al mover `onNavigate`
- introducir diferencias visuales al extraer componentes comunes
- perder atributos de accesibilidad al unificar paneles
- empeorar la UX responsive si se cambia demasiado pronto la estrategia de selección por breakpoint

## Recomendación final

La refactorización sí tiene sentido, pero conviene orientarla a una meta concreta:

- una sola capa resuelve datos
- una sola capa controla interacción
- las vistas solo presentan
- el navbar resuelve sus textos desde su propio dominio de i18n
- español queda completo como referencia del componente

Si esa decisión se mantiene firme, entonces el módulo actual sí puede simplificarse bastante y ganar consistencia sin necesidad de reescribirlo completo de una vez.
