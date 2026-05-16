# Case Result

Caso ID: F-01
Suite: funcional
Fecha y hora: 2026-05-16
Ruta inicial: `/de/user/register`
Idioma: alemán
Browser: Chrome 148
Viewport:
- desktop: 1440x900
- mobile: 430x932
Estado inicial: `cold`
Datos de prueba:
- no requiere usuario existente

Objetivo:

Validar que la primera carga de la ruta de registro, desde un navegador limpio, no rompe el bootstrap del cliente, no muestra alerts inesperadas y deja la UI lista para interacción.

Precondiciones:

- cookies borradas
- local storage borrado
- session storage borrado
- DevTools abierto
- `Network` con `Preserve log`
- logs backend visibles

Pasos ejecutados:

1. Borrar cookies, local storage y session storage del cliente.
2. Verificar que no existan `hv-auth`, `hv-worker-profile` ni claves `hv-profile:*`.
3. Abrir directamente `/{lang}/user/register`.
4. Esperar a que la página termine de cargar.
5. No enviar el formulario.
6. Revisar layout inicial en desktop.
7. Registrar requests relevantes del bootstrap.
8. Registrar logs backend relevantes del bootstrap.

Resultado esperado:

- la página renderiza sin alert modal inesperada
- título y descripción visibles
- formulario centrado y usable
- bloque TOS alineado
- footer visible
- el bootstrap del tenant es estable
- si hay bootstrap auth anónimo, no rompe la página

Resultado observado:
La página carga sin alert modal inesperada. El primer componente visible es el banner de cookies, lo que en este caso es coherente con un estado `cold`.
En desktop el formulario queda usable y centrado.
En mobile se observa un problema de layout: el header queda demasiado arriba y la composición general se percibe desbalanceada.

Alert observada:
No aparece ninguna alerta del sistema de auth.

Redirect observado:
No hay redirect.

Red / requests relevantes:
1. Bootstrap inicial de la ruta `/de/user/register`.
2. Carga del tenant correcta.
3. No se registra request de submit como parte válida de este caso.

Logs backend relevantes:
1. `CLIENT_PUBLIC_FETCH_SUCCESS` para `/api/clients/tenant/tnk_demo_havenova`.
2. No hay logs de error del bootstrap atribuibles a la carga inicial.
3. El `REQUEST_VALIDATION_FAILED` de registro no pertenece a este caso; debe analizarse en el caso funcional de submit.

Evidencia:
- screenshot: `F-01-desktop-initial.png`, `F-01-mobil-initial.png`
- network: `F-01-network.md`
- logs: `F-01_bootstrap-raw.md`

Resultado final:
pass with notes

Observaciones / follow-up:
- revisar layout mobile del header y balance vertical del bloque auth
- la incidencia de `language: ""` en register debe abrirse en el caso de submit, no en este bootstrap
