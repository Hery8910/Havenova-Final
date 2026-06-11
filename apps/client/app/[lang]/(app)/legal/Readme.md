# Legal Route README

## Objetivo

Este archivo deja el contexto operativo de la ruta `apps/client/app/[lang]/(app)/legal`.

Estado:

- refleja el estado real revisado el `2026-06-11`
- ya no actua como auditoria final
- el analisis preliminar del `imprint` se conserva, pero queda superado por una auditoria mas amplia

## Alcance

La ruta cubre:

- `imprint`
- `privacy-policy`
- `cookie-policy`
- `terms-of-service`

## Estado actual

La ruta ya no esta en estado preliminar.

Lo ya resuelto en esta fase:

- `imprint` separa negocio responsable de los servicios ofrecidos y operador tecnico de la plataforma
- `privacy-policy` ya publica estructura factual para `controller`, `technicalOperator`, `dpo` y terceros desde `client.legal.*`
- `cookie-policy` ya refleja un runtime limitado a tecnologias necesarias, sin referencias activas a analitica o tracking
- `terms-of-service` ya distingue mejor entre contraparte del servicio y operador tecnico
- la localizacion `es` y la metadata legal ya quedaron alineadas con `en` y `de`

Lo que sigue pendiente, pero ya fuera de esta linea de trabajo:

- poblar `client.legal.*` con datos reales y validados por tenant
- cerrar los ultimos matices de copy juridico segun el negocio concreto
- hacer revision legal externa o validacion final del responsable del negocio antes de despliegue definitivo

Decision de alcance:

- la ampliacion actual de `ClientLegal` se introduce solo como contrato necesario para migrar estas paginas legales
- la adaptacion completa del contexto `client`, su poblamiento real y cualquier decision de negocio asociada quedan como una tarea separada
- durante esta migracion, la prioridad es adaptar las paginas al contrato objetivo y no redisenar ahora el dominio completo del cliente

## Documentos activos

- auditoria formal: [LEGAL_AUDIT.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/legal/LEGAL_AUDIT.md:1)
- plan de migracion: [LEGAL_PLAN.md](/home/heriberto/Escritorio/Havenova/havenova/apps/client/app/[lang]/(app)/legal/LEGAL_PLAN.md:1)

## Tesis preliminar que se mantiene

La idea base del analisis inicial sigue siendo valida y ya quedo integrada en la ruta:

- el `imprint` debe separar, como minimo, al negocio responsable de los servicios ofrecidos y al operador tecnico de la plataforma
- esa misma separacion debe quedar coherente con `privacy-policy` y `terms-of-service`
- no conviene inventar copy juridico final hasta cerrar primero los hechos reales del negocio, del tenant y de los proveedores tecnicos
