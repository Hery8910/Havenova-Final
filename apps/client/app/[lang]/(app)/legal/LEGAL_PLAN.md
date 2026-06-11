# Legal Plan

## Objetivo

Definir la secuencia de trabajo para migrar `apps/client/app/[lang]/(app)/legal` al estandar actual del proyecto sin perder auditabilidad ni claridad juridica.

Estado del documento:

- plan activo de fase 1
- orientado a migracion progresiva
- alineado con la decision de dejar tests y revision manual final para el cierre global del trabajo

## Alcance

Este plan cubre:

- la ruta [apps/client/app/[lang]/(app)/legal](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/legal:1)
- `imprint`
- `privacy-policy`
- `cookie-policy`
- `terms-of-service`
- el modelo `ClientLegal`
- metadata, i18n y dependencias de runtime relacionadas con cookies y disclosures

No cubre en esta primera pasada:

- aprobacion juridica final externa
- screenshots finales
- evidencia manual de cierre
- automatizacion de tests especifica de la ruta

## Resultado esperado

Al terminar la migracion, la ruta debe cumplir como minimo:

- documentacion operativa separada en `README`, auditoria y plan
- identificacion clara del responsable del servicio y del operador tecnico
- responsable del tratamiento y contactos legales visibles donde corresponda
- inventario de terceros y cookies alineado con el runtime real
- modelado tenant-aware suficiente para datos legales obligatorios
- i18n y metadata coherentes en `de`, `en` y `es`

## Decision de modelado recomendada

Recomendacion:

- no arrancar con paginas legales totalmente libres por tenant
- no mantener tampoco copy juridico fijo hardcodeado si el actor legal cambia por tenant
- los datos juridicos del negocio cliente deben recuperarse del modelo del cliente y tratarse como fuente de verdad
- los fallbacks en pagina, si existen, deben ser solo red de seguridad temporal y nunca sustituir el dato tenant real
- no se va a soportar Google Analytics ni ningun servicio equivalente de tracking o analitica de terceros en este proyecto

Opcion recomendada para esta migracion:

- modelo estructurado para hechos juridicos obligatorios
- copy narrativo compartido en i18n
- overrides por tenant solo cuando exista un caso real que no pueda cubrirse con el modelo base

Motivo:

- es la opcion mas facil de auditar
- evita meter una capa de mapeo innecesaria antes de conocer el modelo real
- deja claro que los hechos juridicos son datos y no solo texto

Decision ya aclarada para nombres:

- `businessName` cubre la marca o nombre comercial visible al usuario
- `legalName` cubre la persona fisica o nombre legal real que esta detras de esa actividad cuando no existe una entidad separada
- esto responde a casos como `Maped Solutions` -> `Heriberto Santana` y `Havenova` -> persona autonoma responsable del negocio

## Propuesta de modelado minimo

Bloques minimos recomendados dentro de `ClientLegal` o en un submodelo equivalente:

- `serviceProvider`
- `technicalOperator`
- `privacyController`
- `dpo`
- `consumerDisputeResolution`
- `documentUpdates`
- `thirdPartyProviders`

Campos minimos por bloque:

- `serviceProvider`: `businessName`, `legalName`, `representedBy`, `address`, `email`, `phone`, `vatId`, `register`
- `technicalOperator`: `businessName`, `representedBy`, `address`, `email`, `phone`
- `privacyController`: `name`, `address`, `email`, `phone`, `sameAs`
- `dpo`: `name`, `email`, `address`
- `consumerDisputeResolution`: `participates`, `statement`
- `documentUpdates`: `imprint`, `privacy`, `cookies`, `terms`
- `thirdPartyProviders`: `name`, `purpose`, `region`, `privacyUrl`, `categories`

Regla de presencia de campos opcionales:

- `vatId` y `register` no deben inventarse ni mostrarse vacios sin contexto
- si un dato no aplica o no existe para la forma legal real del negocio, la UI debe poder reflejarlo de forma explicita y limpia
- la decision exacta de copy debe cerrarse cuando se confirme para cada tipo de empresa que dato puede no existir de forma legitima

Estado actual del contrato:

- esta base minima ya fue introducida en [packages/types/client/clientTypes.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/types/client/clientTypes.ts:1)
- la fase pendiente ya no es definir la forma general, sino poblarla con datos reales y conectarla a las paginas

Regla de alcance para esta migracion:

- el contrato se amplia para servir a las paginas legales
- la correccion completa del contexto `client` y de sus datos reales se tratara como una tarea separada
- en esta linea de trabajo se adaptan las paginas al contrato objetivo y no al reves

## Fases

### Fase 1. Baseline documental

Entregables:

- [Readme.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/legal/Readme.md:1)
- [LEGAL_AUDIT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/legal/LEGAL_AUDIT.md:1)
- este plan

Objetivo:

- congelar el estado real de la ruta antes de tocar implementacion

Estado actual:

- completada en esta pasada

### Fase 2. Inventario factual y validacion de negocio

Tareas:

- confirmar quien presta realmente los servicios al usuario final
- confirmar si `Havenova` es marca, razon social o ambas cosas
- confirmar representante legal, direccion, emails y telefonos oficiales
- confirmar para cada forma legal que campos pueden faltar legitimamente, en particular `VAT ID` y datos registrales
- confirmar si existe una obligacion real de publicar un canal de `DPO` o si no aplica
- confirmar posicion real sobre arbitraje o juntas de consumo
- confirmar stack real de produccion y terceros por tenant
- confirmar que no debe existir ninguna integracion de analitica o tracking en cliente

Criterio de cierre:

- existe una ficha factual cerrada para la ruta legal

Dependencia:

- esta fase requiere validacion del negocio y, idealmente, revision legal externa

Nota:

- `DPO` significa `Data Protection Officer`, es decir, delegado o responsable formal de proteccion de datos cuando la organizacion esta obligada a designarlo o decide publicarlo
- `privacyController` no debe cerrarse solo por quien opera la infraestructura; puede variar segun el contexto del tratamiento
- como regla de trabajo, conviene distinguir entre tratamiento de plataforma (`auth`, seguridad, logs, abuso) y tratamiento del servicio prestado al usuario final

### Fase 3. Contrato de datos y ownership tecnico

Tareas:

- consolidar [packages/types/client/clientTypes.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/types/client/clientTypes.ts:1) como contrato legal minimo compartido
- mantener `client.legal.pages.*` solo como override transicional o soporte de contenido libre, no como fuente principal de hechos legales obligatorios
- separar datos obligatorios de copy narrativo
- definir donde vive la verdad de `documentUpdates`
- definir como representar en el contrato que un dato legal no aplica o no existe sin degradar la claridad del `imprint`

Criterio de cierre:

- el frontend dispone de un contrato estable para representar hechos legales sin hardcodes ad hoc

Estado actual:

- iniciada
- el contrato ya soporta partes legales separadas y campos con estado explicito para ausencias legitimas
- `client.legal.pages.*` queda, por ahora, como superficie heredada compatible, pero la migracion debe apoyarse en los nuevos bloques estructurados
- sigue pendiente poblar datos reales y conectar el modelo a la UI

Nota de separacion:

- la tarea de poblar y consolidar el contexto `client` no debe bloquear la migracion de las paginas legales
- si aparecen decisiones de negocio abiertas en esa capa, se documentan y se difieren a su propia tarea

### Fase 4. Reescritura documental por pagina

#### Bloque A. `imprint`

Objetivo:

- separar responsable del servicio y operador tecnico

Tareas:

- introducir `serviceProviderSection`
- introducir `technicalOperatorSection`
- introducir `contactGuidanceSection` si aporta claridad real
- revisar subtitulo del hero y discurso general

Criterio de cierre:

- el usuario entiende rapidamente a quien contactar segun el tipo de asunto

#### Bloque B. `privacy-policy`

Objetivo:

- pasar de una explicacion generica de roles a una declaracion identificable y factual

Tareas:

- renderizar bloque explicito del responsable del tratamiento
- renderizar bloque de `DPO` si aplica
- revisar CTA para ejercicio de derechos
- verificar que lista de terceros y transferencias coincidan con el entorno real
- corregir localizacion de fechas

Criterio de cierre:

- la pagina identifica claramente al responsable y su canal de contacto

Nota de interpretacion:

- si `Maped Solutions` controla tratamientos tecnicos globales de plataforma, eso no implica automaticamente que tambien sea el responsable del tratamiento del servicio que presta `Havenova`
- la pagina debe poder reflejar esa separacion si ambos contextos existen

Estado actual:

- iniciada
- la pagina ya muestra una seccion factual para `controller`, `technicalOperator`, `dpo` y terceros basada en `client.legal.*`
- la separacion conceptual entre negocio responsable y operador tecnico ya quedo reflejada tambien en el copy general del documento
- sigue pendiente poblar esos bloques con datos tenant reales y cerrar los ultimos matices del copy segun el negocio concreto

#### Bloque C. `cookie-policy`

Objetivo:

- alinear texto, banner y runtime real

Tareas:

- describir con precision el comportamiento actual del banner y del gestor
- confirmar si el sistema actual debe seguir presentandose como solo cookies estrictamente necesarias
- poblar terceros solo si realmente intervienen en esta capa
- revisar storage local relevante para la experiencia
- retirar referencias de implementacion latente a GA o tracking equivalente

Criterio de cierre:

- la pagina no promete menos ni mas de lo que hace el sistema

Estado actual:

- iniciada
- la pagina ya puede poblar terceros desde `client.legal.thirdPartyProviders`
- la capa tecnica de cookies ya fue simplificada para reflejar solo tecnologias necesarias
- la referencia latente a `Google Analytics` y a la categoria `statistics` ya fue retirada del frontend
- el copy ya describe mejor el estado real del banner, del almacenamiento local y de la ausencia de categorias opcionales
- sigue pendiente poblar terceros reales si efectivamente intervienen en esta capa para el tenant concreto

#### Bloque D. `terms-of-service`

Objetivo:

- identificar con claridad la parte contractual y el alcance del operador tecnico

Tareas:

- revisar quien es la contraparte real del usuario
- alinear con la separacion del `imprint`
- revisar clausulas que dependan de hechos del negocio y no solo del software
- corregir localizacion de fechas

Criterio de cierre:

- los terminos ya no dejan ambigua la identidad de la parte que presta el servicio

Estado actual:

- iniciada
- la pagina ya muestra una seccion factual para distinguir entre negocio responsable y operador tecnico
- la base estructural ya quedo estable para esta primera migracion
- la localizacion `es` ya fue normalizada para que no dependa del copy heredado en ingles
- el copy base ya evita atribuir pagos o la prestacion directa del servicio al operador tecnico por defecto
- `privacy-policy` y `terms-of-service` ya describen mejor la separacion entre responsabilidades de negocio y operacion tecnica
- sigue pendiente ajustar el resto del copy contractual heredado para que la terminologia quede completamente alineada con la contraparte real del tenant

### Fase 5. i18n, metadata y componentes minimos

Tareas:

- terminar de pulir el copy legal por locale donde todavia siga demasiado generico para el tenant
- revisar si conviene extraer helpers minimos compartidos para secciones de contacto legal
- revisar si conviene extraer helpers minimos compartidos para renderizado de updates/versiones
- revisar si conviene extraer helpers minimos compartidos para formateo de fechas locale-aware

Decision:

- extraer solo helpers pequenos y transparentes
- evitar una abstraccion legal compleja antes de estabilizar el contenido
- eliminar referencias de codigo, plan y documentacion a Google Analytics o futuras integraciones equivalentes de tracking

Criterio de cierre:

- la ruta mantiene claridad de lectura y no gana complejidad innecesaria

Estado actual:

- la metadata legal `es` ya fue creada en [packages/i18n/metadata.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/i18n/metadata.ts:620)
- no hay deuda abierta de i18n o metadata basica para las cuatro subrutas legales
- la deuda restante en esta fase es solo de precision juridica final y no de infraestructura editorial

### Fase 6. Cierre documental y validacion diferida

Tareas:

- alinear `Readme.md`, `LEGAL_AUDIT.md` y `LEGAL_PLAN.md` con la implementacion final
- dejar checklist de validacion manual final
- dejar puntos expresos para confirmacion juridica externa

Criterio de cierre:

- la ruta queda lista para la revision final global del sitio

## Orden recomendado

1. baseline documental
2. inventario factual del negocio y del tenant
3. ampliacion del modelo legal
4. reescritura de `imprint`
5. reescritura de `privacy-policy`
6. alineacion de `cookie-policy` con runtime
7. reescritura de `terms-of-service`
8. cierre de i18n y metadata
9. cierre documental final

## Riesgos de implementacion

- intentar cerrar el copy antes de tener hechos confirmados
- mezclar datos juridicos obligatorios con i18n narrativo y perder trazabilidad
- introducir overrides libres por tenant demasiado pronto
- asumir proveedores o bases legales por intuicion y no por inventario real
- dejar capacidad latente de tracking en el repo y olvidar alinearla con la politica de cookies y privacidad
