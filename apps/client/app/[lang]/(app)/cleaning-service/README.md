# Cleaning Service Page

## Objetivo

La página de `cleaning-service` es una landing transaccional.

Debe cumplir dos funciones al mismo tiempo:

1. presentar el servicio con suficiente claridad y confianza;
2. convertir esa intención en una solicitud completa a través del formulario multi-step.

Esto significa que la página no puede tratarse solo como “una página con formulario”.
Necesita una jerarquía visual clara entre:

- contexto del servicio
- requisito de autenticación
- flujo de solicitud
- soporte para dudas
- continuidad hacia otros servicios

## Composición actual

Ruta principal:

- [page.tsx](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/cleaning-service/page.tsx:1)

Estilos de página:

- [CleaningServicePageView.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/cleaning-service/CleaningServicePageView.module.css:1)

Bloques renderizados hoy:

1. `AuthRequiredAlert`
2. `PageHero`
3. `CleaningRequestForm`
4. `FAQSection`
5. `ServiceCrossCtaSection`

## Estado actual

### Lógica

La estructura lógica de la página está bien encaminada.

Estado actual:

- el flujo de autenticación ya está conectado con `AuthRequiredAlert`
- el formulario ya resuelve persistencia de draft, perfil embebido y envío
- la página ya orquesta submit, guardado de direcciones nuevas y feedback global
- la composición es simple y comprensible
- la ruta ya fue reducida a entrypoint y ahora delega en `CleaningServicePageClient` y `CleaningServicePageView`

Conclusión:

- no hace falta replantear la arquitectura principal de la página antes del trabajo visual

### Layout general

El layout de página está subdefinido.

Observación principal:

- [CleaningServicePageView.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/cleaning-service/CleaningServicePageView.module.css:1) ya concentra el layout principal de la página y el bloque del formulario

Implicaciones:

- no hay sistema propio de separación vertical entre secciones
- no hay control visual del ritmo entre hero, alerta, formulario y CTA final
- la atmósfera global de página depende casi por completo de los estilos internos de cada bloque
- la página no tiene todavía una identidad visual unificada; hoy es una suma de componentes

### Header / Hero

Estado:

- el hero es el bloque más cercano a “terminado”
- ya tiene una estructura semántica correcta
- la relación entre imagen, copy y CTA es razonable

Observaciones:

- visualmente marca una dirección bastante clara
- sirve como referencia para el tono que deberían seguir los demás bloques
- aun así, el margen inferior es muy grande y luego no conversa del todo con el formulario

Conclusión:

- no debería ser el primer bloque a rediseñar
- sí conviene usarlo como baseline visual para el resto

### AuthRequiredAlert

Estado:

- cumple su función de bloqueo/aviso
- semánticamente está razonablemente bien resuelto

Problemas visibles:

- se percibe como una capa pegada encima de la página, no integrada al flujo
- el gradiente y el anclaje inferior pueden competir con el contenido principal
- en mobile ocupa toda la altura y cambia de comportamiento de forma abrupta

Conclusión:

- probablemente necesite un refinamiento de presencia, prioridad y relación con el hero
- no parece ser el mejor punto de inicio, pero sí una pieza que debe alinearse después

### CleaningRequestForm

Estado:

- es el bloque con más peso funcional y el que hoy determina la experiencia central

Problemas visuales detectados:

- el contenedor principal en [CleaningRequestForm.module.css](/home/heriberto/Escritorio/Havenova/havenova/packages/components/client/pages/cleaning-service/CleaningRequestForm/CleaningRequestForm.module.css:1) usa `overflow: scroll` a nivel de sección, lo que sugiere una solución de layout poco controlada
- el card/form usa alturas muy rígidas (`height: 760px`, `max-height: 80dvh`)
- la experiencia se siente más cercana a un widget encerrado que a una sección protagonista de la página
- la relación visual entre `ProcessStepsHeader` y el card del formulario todavía es débil
- el fondo decorativo del bloque existe, pero no organiza suficientemente la composición

Conclusión:

- este es el punto principal de trabajo visual
- aquí probablemente se concentra el mayor retorno de mejora

### ProcessStepsHeader

Estado:

- el componente está ordenado y legible
- la estructura del timeline es correcta

Problemas:

- funciona más como apoyo textual que como pieza de navegación visual fuerte
- le falta más carácter y mejor integración con el card del formulario
- hoy parece un bloque lateral correcto, pero no una parte orgánica del sistema visual del flujo

Conclusión:

- no parece roto
- sí necesita una iteración de jerarquía, densidad y presencia

### Step UIs internas

Estado:

- los pasos ya están funcionalmente maduros

Lectura actual:

- su diseño no está todavía unificado al mismo nivel
- algunos pasos tienen mejor equilibrio que otros
- el paso de dirección/perfil ha mejorado estructuralmente, pero todavía necesita consolidación visual respecto al resto

Conclusión:

- antes de pulir paso por paso, conviene cerrar el contenedor principal del formulario

### ServiceCrossCtaSection

Estado:

- es una sección correcta como bloque reutilizable

Problemas en esta página:

- visualmente se siente más como un apéndice reutilizado que como un cierre natural del journey
- no hay un bloque previo de soporte o dudas que prepare esa transición

Conclusión:

- probablemente deba revisarse después de resolver FAQ y el ritmo general de la página

## FAQ como decisión de producto

La sección FAQ ya existe, pero todavía no está cerrada como bloque de soporte dentro del journey.

Razones:

- el flujo es transaccional y puede generar dudas justo antes o durante el formulario
- ahora existe un bloque de soporte intermedio, pero todavía falta validar si su contenido y presencia son suficientes
- una FAQ puede reducir fricción, reforzar confianza y absorber objeciones frecuentes

Preguntas a resolver antes de implementarla:

- si la FAQ debe ir antes o después de `ServiceCrossCtaSection`
- si será específica de `cleaning-service` o reutilizable con `home-service`
- si usará accordion simple o una variante más editorial

Recomendación actual:

- ubicarla después del formulario y antes del `ServiceCrossCtaSection`
- tratarla como bloque específico de la página en esta primera fase

## Diagnóstico general

La lógica de la página está suficientemente bien.

El problema principal no es de flujo ni de responsabilidad, sino de:

- layout de página todavía demasiado delgado
- protagonismo visual insuficiente del formulario
- lenguaje visual todavía desigual entre bloques
- falta de un cierre informativo tipo FAQ

## Orden recomendado de trabajo

### Fase 1. Documento y baseline de página

- [x] documentar el estado actual
- [ ] definir la dirección visual objetivo para la página completa
- [ ] decidir el papel exacto de FAQ dentro del journey

### Fase 2. Layout principal

- [x] reforzar `CleaningServicePageView.module.css` para que la página tenga ritmo y estructura propios
- [x] revisar separación entre hero, alerta, formulario y cierre
- [x] decidir si el hero y el formulario comparten un mismo eje/container visual o no

### Fase 3. Form section

- [ ] rediseñar el contenedor principal de `CleaningRequestForm`
- [ ] revisar la relación entre `ProcessStepsHeader` y el card del formulario
- [ ] eliminar señales de layout rígido o scroll accidental en el wrapper principal
- [ ] mejorar desktop y mobile antes de entrar a polish de pasos internos

### Fase 4. Step polish

- [ ] revisar consistencia visual entre pasos
- [ ] consolidar el paso de perfil/dirección dentro del nuevo sistema visual
- [ ] revisar estados vacíos, mensajes de error y acciones

### Fase 5. FAQ y cierre de página

- [ ] introducir una sección FAQ
- [ ] revisar si `ServiceCrossCtaSection` sigue siendo el mejor cierre o si necesita ajuste
- [ ] pulir la relación entre soporte, conversión y navegación a otros servicios

## Punto de inicio recomendado

No empezaría por FAQ.

El mejor punto de inicio es:

1. layout principal de página
2. contenedor visual de `CleaningRequestForm`
3. relación con `ProcessStepsHeader`

Razón:

- si el esqueleto principal no queda bien resuelto, cualquier FAQ o polish interno seguirá sintiéndose agregado encima de una base visual inestable

## Estado de avance actual

Después de esta iteración:

- la página ya tiene wrappers propios para hero, formulario y cierre
- el layout principal ya no depende solo de los márgenes internos de cada componente
- el formulario ya vive dentro de una superficie de página explícita

Siguiente foco recomendado:

- trabajar la sección interna de `CleaningRequestForm`
- revisar después `ProcessStepsHeader`

## Pendientes fuera de esta fase

Estos temas existen, pero no pertenecen al trabajo visual inmediato de esta página:

- tareas restantes de `profile/settings`
- adopción de esta misma lógica en `home-service`
- nuevas superficies de correo y password
