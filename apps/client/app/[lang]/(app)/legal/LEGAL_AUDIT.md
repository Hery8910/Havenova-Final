# Legal Audit

## Proposito

Este documento registra el estado actual de la ruta `apps/client/app/[lang]/(app)/legal` y la compara contra el estado minimo esperable para una superficie sensible de despliegue.

Estado:

- refleja el estado real del worktree revisado el `2026-06-11`
- cubre auditoria tecnica, documental y de readiness legal del frontend
- no sustituye revision profesional de asesoria legal

Importante:

- este documento no afirma que la ruta sea compliant hoy
- este documento identifica riesgos, gaps factuales y deuda de implementacion
- la aprobacion final de textos y hechos juridicos debe pasar por validacion legal externa o por el responsable del negocio

## Fuentes revisadas

Ruta y documentacion local:

- [Readme.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/legal/Readme.md:1)
- [imprint/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/legal/imprint/page.tsx:1)
- [privacy-policy/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/legal/privacy-policy/page.tsx:1)
- [cookie-policy/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/legal/cookie-policy/page.tsx:1)
- [terms-of-service/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/legal/terms-of-service/page.tsx:1)
- [imprint/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/legal/imprint/layout.tsx:1)
- [privacy-policy/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/legal/privacy-policy/layout.tsx:1)
- [cookie-policy/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/legal/cookie-policy/layout.tsx:1)
- [terms-of-service/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/legal/terms-of-service/layout.tsx:1)

Contenido, metadata y contrato de datos:

- [packages/i18n/en/pages.json](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/en/pages.json:975)
- [packages/i18n/de/pages.json](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/de/pages.json:975)
- [packages/i18n/es/pages.json](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/es/pages.json:975)
- [packages/i18n/metadata.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/metadata.ts:620)
- [packages/types/client/clientTypes.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/types/client/clientTypes.ts:1)
- [packages/utils/metadata/metadata.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/metadata/metadata.ts:1)

Runtime relacionado con cookies y storage:

- [apps/client/app/[lang]/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/layout.tsx:1)
- [packages/components/cookieBanner/CookieBannerContainer.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/cookieBanner/CookieBannerContainer.tsx:1)
- [packages/contexts/cookies/CookiesContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/cookies/CookiesContext.tsx:1)
- [packages/utils/cookies/cookieStorage/cookieStorage.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/cookies/cookieStorage/cookieStorage.ts:1)
- [packages/types/cookies/cookiesTypes.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/types/cookies/cookiesTypes.ts:1)

Fuentes oficiales contrastadas:

- Directiva 2000/31/CE, articulo 5: <https://eur-lex.europa.eu/eli/dir/2000/31/oj/eng>
- Reglamento (UE) 2016/679, articulo 13: <https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng>
- Directiva 2002/58/CE, articulo 5(3): <https://eur-lex.europa.eu/eli/dir/2002/58/oj/eng>
- Reglamento (UE) 2024/3228: <https://eur-lex.europa.eu/eli/reg/2024/3228/oj/eng>

Nota metodologica:

- en esta sesion no pude contrastar directamente desde navegador el texto primario aleman de `DDG`, `TDDDG` y `VSBG`
- por eso el baseline normativo de esta auditoria se apoya en fuentes oficiales UE y en el propio contenido que ya cita `DDG` y `TDDDG`
- la traduccion exacta a obligaciones nacionales alemanas debe confirmarse en la revision legal final

## Diagnostico ejecutivo

La ruta `legal` ya tiene una base documental razonable en tono y estructura, pero no puede considerarse cerrada ni lista para despliegue definitivo.

Lo que ya esta bien encaminado:

- `privacy-policy` y `terms-of-service` ya intentan separar el rol del cliente del rol de `Maped Solutions`
- `cookie-policy` ya limita su discurso a cookies estrictamente necesarias y no enlaza a la antigua plataforma ODR
- las cuatro subrutas ya tienen metadata por `layout.tsx`

Lo que hoy impide darla por lista:

- el `imprint` no identifica con claridad al negocio responsable de los servicios ofrecidos
- `privacy-policy` explica roles pero no publica la identidad concreta y el contacto del responsable del tratamiento
- el frontend no dispone de un modelo tenant-aware suficiente para representar datos legales obligatorios
- varios textos legales siguen siendo genericos y no quedan amarrados a hechos verificables del tenant, de los proveedores y del runtime real

Conclusion operativa:

- desde una perspectiva de producto y cumplimiento, no puedo confirmar que la ruta actual sea apta para despliegue final sin una pasada adicional de hechos, copy y contrato de datos

## Contraste normativo base

Base minima contrastada contra fuentes oficiales:

- la Directiva 2000/31/CE, articulo 5, exige informacion general del prestador, incluyendo nombre, direccion geografica y datos de contacto efectivos
- el GDPR, articulo 13, exige al menos la identidad y los datos de contacto del responsable del tratamiento y, cuando aplique, del delegado de proteccion de datos
- la Directiva 2002/58/CE, articulo 5(3), distingue entre acceso/almacenamiento que requiere informacion clara y posibilidad de rechazo y la excepcion de lo estrictamente necesario
- el Reglamento (UE) 2024/3228 derogo el Reglamento (UE) 524/2013 con efectos desde el `20 de julio de 2025` y ordena la discontinuacion de la plataforma ODR

Consecuencia practica para esta ruta:

- no basta con un texto generico correcto en abstracto
- hace falta que la pagina identifique al actor juridico correcto y que las afirmaciones sobre cookies, terceros y responsabilidades coincidan con el sistema real

## Hallazgos

### 1. `imprint` es hoy la pagina con mayor riesgo de desalineacion factual

Estado actual:

- [imprint/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/legal/imprint/page.tsx:1) solo consume `texts.pages.client.legal.imprint`
- no usa `useClient()`
- renderiza una unica `providerSection` con datos fijos de `Maped Solutions`

Problema:

- si el negocio que ofrece los servicios al usuario final es `Havenova` o el tenant cliente, la pagina puede estar identificando al actor equivocado o, como minimo, dejando la relacion poco clara
- esto entra en tension directa con la separacion de roles que ya sugieren `privacy-policy` y `terms-of-service`

Impacto:

- alto riesgo de confusion para soporte, facturacion, reclamaciones y verificacion comercial
- alto riesgo de que la pagina no refleje correctamente quien es el responsable visible del servicio ofrecido

### 2. `privacy-policy` describe roles, pero no publica el responsable concreto

Estado original revisado:

- [privacy-policy/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/legal/privacy-policy/page.tsx:1) usa `useClient()`, pero en la practica solo consume `client.legal?.updates`
- la pagina explica que el cliente suele actuar como `controller`
- la CTA principal apunta a `/contact`

Problema:

- el texto no publica nombre, direccion y medio de contacto del responsable concreto del tratamiento para el tenant actual
- tampoco renderiza contacto del `DPO` si aplicara
- la CTA a `/contact` no sustituye por si sola la identificacion expresa exigible

Impacto:

- gap material frente al baseline del articulo 13 GDPR
- riesgo alto de que el usuario no pueda identificar rapidamente a quien debe dirigirse para ejercer derechos o reclamar informacion

Deuda secundaria:

- el formateo de fecha fuerza `de-DE` en una pagina multilenguaje
- existe `ContactTexts`, pero no se usa

Actualizacion:

- la pagina ya fue ampliada para mostrar una seccion factual con `controller`, `technicalOperator`, `dpo` y terceros desde `client.legal.*`
- si `privacyController` no esta poblado todavia, la pagina cae por ahora en `serviceProvider` como referencia visible del negocio responsable
- la tabla de terceros ya puede alimentarse desde `client.legal.thirdPartyProviders`, manteniendo fallback temporal al contenido i18n heredado
- el formateo de fecha ya usa la locale activa de la pagina en lugar de forzar `de-DE`

Pendiente real:

- poblar correctamente `privacyController` y `thirdPartyProviders` desde datos tenant reales
- revisar y completar la localizacion de `es` en el resto del cuerpo legal heredado

### 3. `cookie-policy` esta razonablemente alineada con el runtime de hoy, pero solo de forma parcial

Estado original revisado:

- [cookie-policy/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/legal/cookie-policy/page.tsx:1) afirma que solo se usan tecnologias estrictamente necesarias
- no reporta analitica activa
- la tabla de terceros esta vacia

Contraste con runtime:

- [apps/client/app/[lang]/layout.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/layout.tsx:1) monta `CookiesProvider` y `CookieBannerContainer`
- [CookiesContext.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/cookies/CookiesContext.tsx:1) actua hoy como capa de consentimiento para tecnologias necesarias y persistencia tecnica
- [CookieBannerContainer.tsx](/home/heriberto/Escritorio/Havenova/havenova/packages/components/cookieBanner/CookieBannerContainer.tsx:1) hoy se comporta mas como un aviso con acknowledge que como un gestor granular completo

Lectura prudente:

- el claim "solo tecnologias estrictamente necesarias" era compatible con el runtime visible
- pero el codigo seguia conteniendo capacidad latente para GA y consentimiento estadistico, por lo que la alineacion no estaba completamente cerrada

Impacto:

- el texto actual no es claramente falso hoy
- pero requeria cerrar esa capacidad latente y describir mejor terceros y storage real

Actualizacion:

- la capa de cookies ya fue simplificada para modelar solo tecnologias necesarias
- la referencia tecnica a `Google Analytics`, `gtag` y a la categoria `statistics` ya fue retirada del frontend
- `cookie-policy` ya puede poblar terceros desde `client.legal.thirdPartyProviders`, manteniendo fallback temporal al contenido heredado

Pendiente real:

- poblar la lista tenant real de terceros relevantes para esta pagina
- terminar de ajustar el copy heredado de `cookie-policy` alli donde todavia haya texto demasiado generico para el tenant concreto

### 4. `terms-of-service` separa mejor los roles, pero sigue siendo demasiado generico

Estado original revisado:

- [terms-of-service/page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/legal/terms-of-service/page.tsx:1) explica que `Maped Solutions` opera tecnicamente la plataforma
- tambien indica que los servicios al usuario final suelen ser prestados por el cliente respectivo

Problema:

- la pagina no identifica con precision la parte contractual concreta del tenant
- no queda resuelto si el usuario esta contratando con `Havenova`, con otro cliente, o con una estructura mas amplia de plataforma

Impacto:

- riesgo medio-alto de que los terminos no reflejen bien la parte contractual real del servicio ofrecido

Deuda secundaria:

- el formateo de fecha tambien esta fijado a `de-DE`
- existe `ContactTexts`, pero no se usa

Actualizacion:

- la pagina ya fue ampliada con una seccion factual de partes contractuales y roles de plataforma
- `terms-of-service` ya puede mostrar desde `client.legal.*` tanto el negocio responsable de los servicios como el operador tecnico
- el formateo de fecha ya usa la locale activa de la pagina
- la integracion actual no muestra fallos estructurales evidentes en el render del nuevo bloque de partes
- el copy base fue ajustado para no presentar al operador tecnico como contraparte automatica de pagos o servicios del usuario final
- `privacy-policy` y `terms-of-service` ya reflejan mejor el modelo de dos capas: negocio responsable de los servicios y operador tecnico de la plataforma

Pendiente real:

- seguir ajustando el copy contractual heredado para que la terminologia del documento quede completamente alineada con la contraparte real del tenant y con sus condiciones comerciales concretas
- revisar si algunas clausulas deben reformularse cuando el negocio no sea una entidad separada sino una actividad autonoma con marca comercial
- la localizacion `es` ya quedo alineada en estructura y lenguaje base, pero el documento sigue necesitando precision juridica especifica del negocio

### 5. El modelo `ClientLegal` original no alcanzaba para una migracion legal tenant-aware seria

Estado original revisado:

- [packages/types/client/clientTypes.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/types/client/clientTypes.ts:175) solo modela `pages` y `updates`
- no encontre consumo real del bloque `client.legal.pages.*` en el frontend revisado

Faltantes estructurales:

- razon social y nombre comercial del prestador del servicio
- representante legal
- datos registrales
- VAT ID si aplica
- contacto del responsable del tratamiento
- contacto del `DPO` si aplica
- postura sobre arbitraje de consumo
- version y `updatedAt` del `imprint`
- inventario de terceros y finalidades por tenant

Impacto:

- sin este modelado, la migracion acabaria empujando copy fijo o logica ad hoc dentro de las paginas

Actualizacion:

- ya existe una primera ampliacion del contrato en [packages/types/client/clientTypes.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/types/client/clientTypes.ts:1)
- el modelo ahora soporta `serviceProvider`, `technicalOperator`, `privacyController`, `dpo`, `consumerDisputeResolution`, `thirdPartyProviders` y `updates.imprint`
- `vatId`, `register` y `dpo` ya pueden representarse con estado explicito (`available`, `not_applicable`, `not_available`) en lugar de depender de strings vacios
- `businessName` y `legalName` quedan justificados por casos reales de autonomos o negocios sin entidad separada, donde la marca visible y la persona legal responsable no coinciden textualmente
- esta ampliacion cierra la deuda de contrato minimo, pero no sustituye la validacion de los datos reales del tenant

Decision de alcance:

- esta ampliacion debe leerse como un contrato de frontend orientado a desbloquear la migracion de `legal`
- la normalizacion completa del contexto `client`, su estrategia de persistencia y las decisiones de negocio para poblar estos bloques quedan fuera de esta linea de trabajo y deben tratarse por separado

### 6. i18n y metadata ya quedaron alineadas, pero siguen siendo una superficie sensible

Estado actual:

- `packages/i18n/es/pages.json` ya no conserva bloques legales amplios en ingles
- [packages/i18n/metadata.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/metadata.ts:620) ya define metadata legal para `en`, `de` y `es`
- [packages/utils/metadata/metadata.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/metadata/metadata.ts:1) mantiene fallback de locale, pero la ruta legal ya no depende de el para `es`

Impacto:

- se reduce el riesgo de mezclar body legal y metadata en locales distintas
- aun asi, metadata y copy legal deben seguir revisandose como una sola superficie sensible antes del cierre final

### 7. La lista de terceros y las afirmaciones de infraestructura deben tratarse como hechos, no como copy

Estado actual:

- `privacy-policy` lista `Vercel`, `Cloudflare R2`, `Render`, `MongoDB Atlas` y `SendGrid`
- `cookie-policy` deja vacia la tabla de terceros

Inventario factual hoy confirmado desde backend:

- `MongoDB` como base de datos principal
- `SendGrid` para correo transaccional
- `Cloudflare R2` para almacenamiento de archivos e imagenes
- cookies tecnicas de `accessToken`, `refreshToken` y `csrfToken`
- `Render` asumido como plataforma de despliegue del backend
- `Cloudflare` delante del API para DNS, TLS, proxy y seguridad edge
- `Better Stack` previsto para centralizacion de logs, aunque sin SDK integrado en runtime actual

No visto como integracion activa en backend hoy:

- `Sentry`
- `Stripe`
- `PayPal`
- `Google Analytics`
- `Meta Pixel`
- `Auth0`
- `Firebase`
- `Supabase`
- `OpenAI`
- transporte SMTP real por `nodemailer`

Problema:

- desde el repo no puedo confirmar que esa lista siga siendo exactamente la del entorno de produccion actual
- tampoco puedo confirmar desde frontend si todos esos proveedores intervienen siempre en el tenant revisado

Impacto:

- cualquier divergencia entre texto y stack real se convierte en deuda de cumplimiento, no solo en deuda de documentacion

Actualizacion de criterio:

- aunque la intencion del proyecto es usar solo servicios estrictamente necesarios, sigue siendo necesario identificar cuales terceros intervienen realmente y si introducen almacenamiento, logs, proxies o recursos que deban quedar descritos
- para esta auditoria, el baseline mas solido hoy para futuras paginas legales es: `MongoDB`, `SendGrid`, `Cloudflare R2`, `Render`, `Cloudflare` y, segun despliegue real, `Better Stack`

### 8. La seccion de resolucion de conflictos esta mejor que una pagina con ODR antigua, pero sigue siendo una afirmacion factual

Estado actual:

- el `imprint` no enlaza a la plataforma ODR antigua
- mantiene la formula "no estamos obligados ni dispuestos a participar"

Lectura prudente:

- evitar enlaces o referencias operativas a la antigua ODR es correcto tras la derogacion efectiva del `20 de julio de 2025`
- la afirmacion sobre no obligacion o no disposicion a participar debe seguir confirmandose con el negocio real y con revision legal final

### 9. `privacyController` no debe simplificarse solo a quien hospeda la infraestructura

Hallazgo:

- el hecho de que `Maped Solutions` opere la infraestructura y seguridad de la plataforma no convierte automaticamente a esa parte en responsable unico de todos los tratamientos
- en terminos de modelado y de copy, conviene mantener separacion entre tratamientos tecnicos globales de plataforma y tratamientos ligados al servicio prestado al usuario final

Impacto:

- si esta distincion se pierde, `privacy-policy` puede terminar atribuyendo responsabilidades de forma demasiado amplia o demasiado estrecha

### 10. La gobernanza de versiones documentales es inconsistente

Estado actual:

- `privacy`, `cookies` y `terms` tienen `updates`
- `imprint` no tiene version ni `updatedAt`

Impacto:

- complica trazabilidad interna
- dificulta demostrar que el `imprint` y el resto de textos se revisaron como un bloque coherente

## Datos que deben confirmarse antes del despliegue

- quien es exactamente la entidad o persona responsable de los servicios ofrecidos al usuario final en este tenant
- si `Havenova` es marca, razon social o ambas cosas
- nombre legal completo, direccion y representante legal del prestador del servicio
- telefono y correo juridicamente validos para soporte y ejercicio de derechos
- VAT ID y datos registrales, si aplican
- si existe `DPO` o canal especifico de privacidad
- postura real sobre participacion en arbitraje o juntas de consumo
- stack real de produccion y terceros efectivos por tenant
- si el producto es mono-tenant con `Havenova` como unico prestador o multi-tenant con clientes que prestan el servicio

## Riesgos

- alto: identificar al actor juridico equivocado en `imprint`
- alto: no publicar de forma concreta el responsable del tratamiento en `privacy-policy`
- alto: afirmar proveedores, roles o bases legales sin confirmacion factual del entorno productivo
- medio: desalinear `cookie-policy` con el comportamiento real del banner y de futuras activaciones de analitica
- medio: mantener `es` con body en ingles y metadata de fallback a `de`
- medio: no versionar `imprint` ni tratarlo como documento controlado

## Decisiones cerradas

- esta primera fase se limita a auditoria, documentacion y plan; los tests y la pasada manual final quedan diferidos
- la ruta `legal` debe tratarse como superficie de despliegue sensible, no como pagina informativa ordinaria
- no conviene reescribir el copy final antes de cerrar el inventario factual del negocio y del tenant
- la recomendacion tecnica es modelar primero los hechos legales obligatorios de forma estructurada y dejar la narrativa compartida en i18n
- no recomiendo arrancar con overrides libres por tenant para documentos completos; primero hace falta una base estructurada y auditable

## Plan de trabajo

La secuencia de migracion propuesta queda en:

- [LEGAL_PLAN.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/legal/LEGAL_PLAN.md:1)

Resumen ejecutivo del siguiente paso:

1. cerrar inventario factual del negocio, del tenant y de terceros
2. ampliar el modelo `ClientLegal` para datos obligatorios
3. reescribir `imprint`, `privacy-policy`, `cookie-policy` y `terms-of-service` sobre ese modelo
4. dejar la validacion final juridica y la revision manual completa para el cierre global del proyecto
