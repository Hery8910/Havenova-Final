# Log Analysis

Caso o secuencia: F-01 bootstrap register
Fecha: 2026-05-16
Estado inicial declarado: `cold`

Fuente:
- backend logs
- network

Eventos observados:
1. `CLIENT_PUBLIC_FETCH_SUCCESS`
2. `REQUEST_VALIDATION_FAILED` sobre `/api/auth/register`

Correlación temporal:
- acción: abrir `/de/user/register`
- cambio UI: render inicial correcto, sin alert de auth
- request: bootstrap del tenant
- log: `CLIENT_PUBLIC_FETCH_SUCCESS`

Lectura:

El primer evento sí corresponde al caso F-01 y confirma que el bootstrap público del tenant fue correcto.

El segundo evento no corresponde al alcance del caso F-01. Ese log aparece varios minutos después y pertenece a un intento de registro posterior desde mobile. No debe usarse para evaluar la carga inicial.

Conclusión:
- esperado

Impacto:
- ninguno para F-01
- seguimiento funcional requerido para el submit de register por `language` vacía
