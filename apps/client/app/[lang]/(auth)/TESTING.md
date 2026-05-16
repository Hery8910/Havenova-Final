# Manual de Testing para `apps/client/app/[lang]/(auth)`

Este documento define la base operativa para las pruebas manuales de la ruta `apps/client/app/[lang]/(auth)` en `apps/client`.

Su propósito no es solo comprobar que “funciona”, sino dejar un proceso reutilizable para futuras revisiones previas a despliegue, con foco en:

- funcionamiento normal de los flujos críticos
- seguridad esencial del sistema
- consistencia de alerts, redirects y estados de sesión
- correlación entre UI, red y logs del backend
- documentación basada en evidencia

Archivos relacionados:

- [README.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/README.md)
- [packages/contexts/alert/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/alert/README.md)
- [packages/contexts/auth/README.md](/home/heriberto/Escritorio/Havenova/havenova/packages/contexts/auth/README.md)
- [packages/services/auth/authService.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/services/auth/authService.ts)
- [packages/utils/user/userHandler.ts](/home/heriberto/Escritorio/Havenova/havenova/packages/utils/user/userHandler.ts)

## Objetivo

Antes de un despliegue, esta batería debe permitir responder con evidencia a estas preguntas:

- los flujos de auth funcionan de forma estable en condiciones normales
- el sistema responde de forma segura ante datos faltantes, corruptos o manipulados
- los alerts muestran la acción correcta y no exponen CTAs innecesarios
- la primera conexión y el bootstrap del cliente no rompen la experiencia
- el frontend, la red y el backend cuentan la misma historia

## Alcance

Este manual se divide en dos suites principales:

1. `Pruebas funcionales`
2. `Pruebas de seguridad esenciales`

Incluye:

- carga inicial de páginas auth
- register
- login
- verify email
- resend verification email
- forgot password
- reset password
- estados de bootstrap
- alerts del flujo
- redirects
- lectura de logs backend
- documentación de evidencia

No cubre todavía:

- pentesting profundo
- auditoría de infraestructura
- revisión de cabeceras HTTP a nivel de hardening completo
- pruebas de carga
- automatización visual completa

## Principios de ejecución

### 1. Estado inicial declarado

No todas las pruebas deben comenzar desde cero.

En vez de imponer un único punto de partida, cada caso debe declarar explícitamente su estado inicial:

- `cold`: navegador limpio, sin cookies, sin local storage, sin session storage
- `warm-anonymous`: hay datos locales, pero sin sesión válida
- `warm-authenticated`: existe sesión previa válida
- `expired-session`: existen cookies o tokens vencidos
- `corrupted-client-state`: storage o cookies inconsistentes o corruptos
- `tampered-state`: parámetros, tokens o valores manipulados manualmente

Regla:

- si el caso no declara su estado inicial, el caso no está bien especificado

### 2. Evidencia antes que memoria

Cada resultado debe apoyarse en:

- captura visual o nota precisa
- secuencia de requests en DevTools
- eventos backend relevantes
- conclusión final del caso

### 3. Correlación temporal

Toda observación importante debe poder correlacionarse por tiempo entre:

- acción del usuario
- cambio en UI
- request en frontend
- evento en backend

### 4. Datos sensibles

Al documentar resultados:

- no copiar tokens completos
- no copiar cookies completas
- no pegar passwords
- no registrar emails reales de usuarios externos

Usar:

- cuentas de prueba controladas
- hashes o valores truncados cuando haga falta

## Preparación del entorno

Antes de cualquier sesión de testing:

1. Confirmar rama actual y commit.
2. Confirmar entorno backend y frontend.
3. Abrir DevTools.
4. En `Network`, activar `Preserve log`.
5. Abrir logs del backend y dejarlos visibles.
6. Preparar carpeta o documento de evidencia de la corrida.

Datos de prueba recomendados:

- un usuario nuevo
- un usuario no verificado
- un usuario verificado
- un usuario con password recién cambiada
- un usuario bloqueado, si el entorno de prueba lo permite

Patrón sugerido:

- `auth.test+register.001@example.com`
- `auth.test+verify.001@example.com`
- `auth.test+reset.001@example.com`
- `auth.test+blocked.001@example.com`

## Estados iniciales del navegador

### Estado `cold`

Usar cuando se quiera validar:

- bootstrap inicial
- primera conexión
- register desde cero
- login desde cero
- visual inicial de una página auth

Acciones:

1. borrar cookies
2. borrar local storage
3. borrar session storage
4. verificar que ya no existan claves de auth

Claves relevantes a revisar:

- `hv-auth`
- `hv-worker-profile`
- cualquier clave que empiece por `hv-profile:`

### Estado `warm-authenticated`

Usar cuando se quiera validar:

- refresh token
- recuperación de sesión
- comportamiento de `/api/auth/me`
- redirects o bootstrap con sesión existente

### Estado `corrupted-client-state`

Usar cuando se quiera validar:

- resistencia a storage inconsistente
- recuperación ante datos inválidos
- ausencia de bloqueos del cliente por estado local roto

Ejemplos:

- `hv-auth` incompleto
- `hv-auth` con role incoherente
- `hv-profile:*` de otro usuario
- storage válido para un cliente, cookies válidas para otro

## Cómo leer y documentar logs del backend

### Objetivo

Los logs no se revisan “por si acaso”. Se revisan para verificar que el backend responde al caso que se está ejecutando y que la UI reacciona de forma coherente.

### Qué registrar de cada evento

De cada evento relevante, documentar:

- `at`
- `event`
- `level`
- `domain`
- `outcome`
- `reasonCode`, si existe
- `route`
- `method`
- `requestId`
- `metadata` relevante

No hace falta copiar el JSON entero en todos los casos. Lo importante es resumir la secuencia útil.

### Regla de interpretación

Un log solo es útil si coincide con:

- el momento de la acción
- la ruta evaluada
- el estado inicial declarado
- el cambio visible en UI

### Ejemplo de análisis

Ejemplo recibido:

```json
{"at":"2026-05-16T10:04:56.502Z","event":"CLIENT_PUBLIC_FETCH_SUCCESS","route":"/api/clients/tenant/tnk_demo_havenova","method":"GET","outcome":"success"}
{"at":"2026-05-16T10:05:02.018Z","event":"AUTH_ACCESS_DENIED","reasonCode":"AUTH_ACCESS_TOKEN_MISSING","route":"/api/auth/me","method":"GET","outcome":"failure"}
{"at":"2026-05-16T10:05:02.143Z","event":"AUTH_REFRESH_SUCCEEDED","route":"/api/auth/refresh-token","method":"POST","outcome":"success"}
{"at":"2026-05-16T10:05:02.211Z","event":"AUTH_ME_FETCHED","route":"/api/auth/me","method":"GET","outcome":"success"}
{"at":"2026-05-16T10:05:02.317Z","event":"PROFILE_FETCH_SUCCESS","route":"/api/home-services/profile","method":"GET","outcome":"success"}
```

Lectura correcta:

1. el tenant bootstrap fue correcto
2. el primer `GET /api/auth/me` no tenía access token válido
3. el sistema recuperó sesión mediante refresh token
4. el segundo `GET /api/auth/me` ya devolvió identidad válida
5. después se pudo cargar el perfil

Conclusión:

- esto no corresponde a un caso `cold`
- corresponde a un caso `warm-authenticated` o `expired-session`
- el comportamiento es sano si la UI no mostró error bloqueante y terminó autenticada

Cómo documentarlo:

```md
Estado inicial: warm-authenticated
Secuencia backend:
1. CLIENT_PUBLIC_FETCH_SUCCESS
2. AUTH_ACCESS_DENIED reasonCode=AUTH_ACCESS_TOKEN_MISSING
3. AUTH_REFRESH_SUCCEEDED
4. AUTH_ME_FETCHED
5. PROFILE_FETCH_SUCCESS
Conclusión:
- el bootstrap recuperó sesión correctamente
- no se considera fallo
```

### Señales backend base a esperar

En pruebas normales pueden aparecer:

- `CLIENT_PUBLIC_FETCH_SUCCESS`
- `AUTH_ACCESS_DENIED`
- `AUTH_REFRESH_SUCCEEDED`
- `AUTH_ME_FETCHED`
- `PROFILE_FETCH_SUCCESS`
- eventos de register, login, verify, forgot y reset

Interpretación:

- `AUTH_ACCESS_DENIED` no siempre es un fallo del caso
- puede formar parte de un flujo esperado de bootstrap o refresh
- siempre debe leerse en secuencia, no de forma aislada

## Cómo documentar cada caso

Cada caso debe registrarse con esta plantilla:

```md
Caso ID:
Fecha y hora:
Entorno:
Branch / commit:
Ruta inicial:
Idioma:
Browser:
Viewport:
Estado inicial:
Datos de prueba:

Objetivo:

Pasos ejecutados:
1.
2.
3.

Resultado esperado:

Resultado observado:

Alert observada:

Redirect observado:

Red / requests relevantes:

Logs backend relevantes:
1.
2.
3.

Evidencia:
- screenshot:
- network:
- notas:

Resultado final:
- pass
- pass with notes
- fail

Observaciones / follow-up:
```

## Dónde guardar la evidencia

La evidencia de cada corrida debe quedar agrupada por fecha.

Convención sugerida:

- `apps/client/app/[lang]/(auth)/test-evidence/`

Estructura sugerida:

- `YYYY-MM-DD-run-01/notes.md`
- `YYYY-MM-DD-run-01/screenshots/`
- `YYYY-MM-DD-run-01/network/`

Si la evidencia se guarda fuera del repo, dejar la ruta exacta en el reporte final de la corrida.

Estructura base ya preparada en el repo:

- [test-evidence/README.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/test-evidence/README.md)
- [2026-05-16-run-01/README.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/test-evidence/2026-05-16-run-01/README.md)
- [2026-05-16-run-01/session-context.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/test-evidence/2026-05-16-run-01/session-context.md)
- [2026-05-16-run-01/summaries/technical-summary.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/test-evidence/2026-05-16-run-01/summaries/technical-summary.md)
- [test-evidence/_templates/](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(auth)/test-evidence/_templates/)

## Checklist común de UI

Antes de interactuar en cada página auth:

- logo visible y centrado
- título visible
- descripción visible
- spacing coherente
- sin solapamientos
- labels e inputs alineados
- footer visible
- tipografía proporcionada en desktop y mobile
- ningún alert inesperado al cargar, salvo que el caso lo requiera

## Checklist común del Alert

Para cada alert observada:

- título breve y entendible
- descripción clara
- altura estable
- CTA primaria alineada con el siguiente paso real
- no hay CTAs duplicadas con el mismo destino
- `close` solo cierra
- `continue` lleva a un paso lógico
- `retry` repite una acción útil
- overlay y `Escape` solo cierran cuando el estado es dismissible

## Suite 1. Pruebas funcionales

Objetivo:

- validar funcionamiento normal
- validar bootstrap estable
- validar continuidad del flujo de usuario

Casos mínimos:

1. cold load en register
2. registro exitoso de usuario nuevo
3. login exitoso de usuario verificado
4. login de usuario no verificado
5. verify-email con token válido
6. reenvío de email de verificación
7. forgot-password exitoso
8. reset-password con token válido
9. recuperación de sesión en `warm-authenticated`

Para cada caso funcional definir:

- estado inicial
- precondiciones
- pasos
- alert esperada
- redirect esperado
- secuencia backend esperada

## Suite 2. Pruebas de seguridad esenciales

Objetivo:

- validar que el sistema falle de forma controlada
- validar que la UI no exponga rutas o acciones incorrectas
- validar que el backend rechace estados inválidos sin romper el cliente

Casos mínimos a cubrir:

1. `clientId` ausente
2. `clientId` manipulado
3. token de verify-email inválido
4. token de verify-email expirado
5. token de reset-password inválido
6. token de reset-password expirado
7. `hv-auth` corrupto
8. storage cruzado entre usuarios
9. sesión expirada con refresh correcto
10. sesión expirada sin refresh válido
11. query params manipulados
12. submit repetido durante loading
13. respuesta 500 en login
14. respuesta 500 en register
15. respuesta 500 en reset-password
16. replay de enlace de verify/reset
17. usuario bloqueado
18. acceso con estado local incoherente entre cookies y storage

Qué debe verificarse especialmente:

- no hay crash del cliente
- no hay fuga innecesaria de detalles internos
- la alert muestra la acción correcta
- el redirect no deja al usuario en un estado ambiguo
- backend y frontend mantienen coherencia

## Criterio de cierre antes de despliegue

La revisión de auth no debería considerarse cerrada hasta cumplir esto:

1. suite funcional ejecutada
2. suite de seguridad esencial ejecutada
3. evidencia registrada
4. incidencias clasificadas
5. revisión del alert completada
6. validación visual pendiente identificada o cerrada

## Estado actual del plan

Con este documento, el siguiente orden de trabajo recomendado es:

1. convertir los casos funcionales actuales en casos numerados completos
2. añadir el detalle operativo de los casos de seguridad esencial
3. ejecutar una primera corrida manual con evidencia
4. revisar visualmente `(auth)`
5. añadir tests visuales de `(auth)`

## Próxima tarea

La siguiente implementación sobre este manual debe ser:

- detallar los casos funcionales uno por uno
- detallar los casos de seguridad esenciales uno por uno
- preparar la primera carpeta de evidencia de prueba
