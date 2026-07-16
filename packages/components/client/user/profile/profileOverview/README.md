# Profile Overview

## Proposito

`ProfileOverviewPage.client.tsx` es hoy la superficie principal de `/profile` y también el mayor
hotspot estructural del carril privado de usuario.

Este directorio todavía no sigue el patrón canónico de página documentado para el resto del
frontend.

## Estado actual

La ruta [apps/client/app/[lang]/(app)/profile/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/page.tsx:1)
renderiza hoy:

- [ProfileOverviewPage.client.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileOverview/ProfileOverviewPage.client.tsx:1)
- [useProfileOverviewController.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileOverview/useProfileOverviewController.ts:1)
- [ProfileOverviewPage.view.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileOverview/ProfileOverviewPage.view.tsx:1)
- [profileOverview.helpers.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileOverview/profileOverview.helpers.ts:1)
- [profileOverview.types.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileOverview/profileOverview.types.ts:1)
- [profileOverview.fallbacks.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileOverview/profileOverview.fallbacks.ts:1)

Avance ya aplicado:

- la composición visual principal ya salió del wrapper cliente
- la copy fallback ya no vive toda inline en el componente principal
- la derivación del view model ya quedó aislada en helpers propios del feature
- la orquestación cliente (`auth`, `profile`, i18n, guard y hrefs) ya quedó separada en `useProfileOverviewController`
- el alias temporal `ProfileOverviewClient` ya fue retirado para no seguir propagando un nombre histórico
- el barrel público del feature ya volvió a exponer solo `ProfileOverviewPageClient`; `view`,
  `fallbacks`, `types` y controller quedan como piezas internas del overview

Deuda restante:

- la ruta sigue siendo cliente y todavía no aprovecha composición server-first
- el feature sigue dependiendo de fallbacks inline porque el i18n propio del overview no está auditado todavía
- las cards del overview siguen siendo locales del dominio `profile` y no primitives consolidadas

## Lectura arquitectónica

Esto deja al overview en un estado distinto a `profile/settings` y distinto también al patrón ya
aplicado en páginas públicas:

```text
page.tsx
  -> ProfileOverviewPageClient
    -> useProfileOverviewController
    -> ProfileOverviewPageView
```

## Frontera actual SSR/CSR

La ruta [apps/client/app/[lang]/(app)/profile/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/profile/page.tsx:1)
ya actúa como wrapper server simple, igual que `settings`.

Conclusión actual:

- mover más lógica fuera de `page.tsx` ya no aporta casi nada por sí solo
- el siguiente salto real hacia una arquitectura más server-first no depende de la ruta
- depende de que `auth`, `profile`, i18n y `useRequireLogin()` dejen de exigir composición cliente inmediata

Regla:

- no abrir más refactor artificial en `page.tsx` mientras esa base siga siendo cliente
- tratar el límite actual como una frontera explícita, no como trabajo olvidado

en vez de algo más cercano a:

```text
page.tsx (server si es viable)
  -> ProfileOverviewPage.client.tsx
    -> ProfileOverviewPage.view.tsx
      -> cards / sections
```

## Siguiente dirección esperada

La siguiente pasada debería evaluar, como mínimo:

1. decidir qué partes de las cards pueden convertirse en primitives propias del dominio `profile`
2. revisar si la ruta puede reducir su superficie cliente o si el beneficio real está solo en
   separar composición de lógica
3. evaluar una integración más real con i18n del overview cuando el surface deje de ser tan transicional

## Regla actual

Mientras este feature no se rectifique:

- no seguir añadiendo más copy inline
- no volver a mover auth/profile/i18n al componente visual
- no reexportar piezas internas del overview desde el barrel público sin un segundo consumidor real
- tratarlo como deuda localizada del carril `profile/*`, no como patrón reutilizable
