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
- [ProfileOverviewPage.view.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileOverview/ProfileOverviewPage.view.tsx:1)
- [profileOverview.helpers.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileOverview/profileOverview.helpers.ts:1)
- [profileOverview.types.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileOverview/profileOverview.types.ts:1)
- [profileOverview.fallbacks.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileOverview/profileOverview.fallbacks.ts:1)

Avance ya aplicado:

- la composición visual principal ya salió del wrapper cliente
- la copy fallback ya no vive toda inline en el componente principal
- la derivación del view model ya quedó aislada en helpers propios del feature

Deuda restante:

- acceso a `auth`, `profile`, i18n y navegación
- guardia de sesión (`useRequireLogin`)
- resolución de estado y dependencias cliente en el wrapper principal
- persistencia de alias temporales para compatibilidad hacia atrás

## Lectura arquitectónica

Esto deja al overview en un estado distinto a `profile/settings` y distinto también al patrón ya
aplicado en páginas públicas:

```text
page.tsx
  -> ProfileOverviewPageClient
    -> ProfileOverviewPageView
```

en vez de algo más cercano a:

```text
page.tsx (server si es viable)
  -> ProfileOverviewPage.client.tsx
    -> ProfileOverviewPage.view.tsx
      -> cards / sections
```

## Siguiente dirección esperada

La siguiente pasada debería evaluar, como mínimo:

1. retirar el alias temporal `ProfileOverviewClient` cuando ya no queden consumidores históricos
2. decidir qué partes de las cards pueden convertirse en primitives propias del dominio `profile`
3. revisar si la ruta puede reducir su superficie cliente o si el beneficio real está solo en
   separar composición de lógica
4. evaluar una integración más real con i18n del overview cuando el surface deje de ser tan transicional

## Regla actual

Mientras este feature no se rectifique:

- no seguir añadiendo más copy inline
- no usar el alias `ProfileOverviewClient` como referencia de arquitectura para nuevas páginas
- tratarlo como deuda localizada del carril `profile/*`, no como patrón reutilizable
