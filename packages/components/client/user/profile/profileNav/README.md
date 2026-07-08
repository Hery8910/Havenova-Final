# Profile Nav

## Proposito

`ProfileNav` es la primitive de navegación compartida del carril privado `profile/*`.

No debe volver a crecer como un único componente que mezcle:

- iconografía
- labels fallback
- resolución de i18n
- definición de rutas
- render final de `SideNav`

## Estado actual

La superficie ya quedó separada en:

- [ProfileNav.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileNav/ProfileNav.tsx:1)
- [profileNav.types.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileNav/profileNav.types.ts:1)
- [profileNav.fallbacks.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileNav/profileNav.fallbacks.ts:1)
- [profileNav.helpers.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/user/profile/profileNav/profileNav.helpers.tsx:1)

## Regla actual

`ProfileNav.tsx` debe quedar como wrapper del feature:

- resuelve contexto (`auth`, i18n, lang)
- arma items finales
- delega el render a `SideNav`

La definición de labels, iconos y rutas por defecto debe permanecer fuera del wrapper.

## Siguiente dirección esperada

- evaluar si el shell privado necesita una variante propia de `SideNav` o si la deuda sigue siendo solo visual
- auditar con más precisión el ownership entre `ProfileNav` y `SideNav`
- retirar `userNav` como referencia histórica una vez que ya no aporte nada al carril privado
