# Autoridad de producto e integración

## Propósito

Definir cómo Product Design, backend y frontend colaboran sin duplicar autoridad ni
implementar decisiones implícitas.

## Responsabilidades

### Product Design

Posee:

- problema y resultado del usuario;
- actores y permisos desde perspectiva de producto;
- flows, estados y acciones visibles;
- decisiones aceptadas, bloqueadas y diferidas;
- copy intent y requisitos de accesibilidad;
- readiness del dominio y de cada slice;
- integration contract funcional.

No define detalles internos de React, MongoDB o transporte que no afecten el producto.

### Backend

Posee:

- modelo de datos y consistencia;
- tenant isolation;
- autenticación, autorización y CSRF;
- endpoints, DTOs y error/success codes;
- invariantes, transacciones, concurrencia e idempotencia;
- token lifecycle y delivery state;
- observabilidad del servicio.

Backend no crea navegación o UX por conveniencia del modelo de datos.

### Frontend

Posee:

- routing y rendering;
- accesibilidad y responsive;
- composición visual;
- estado local y URL state;
- BFF/adaptación de transporte;
- feedback, loading, empty y error;
- i18n de la presentación;
- tests de interacción e integración;
- tenant branding en las superficies aprobadas.

Frontend no redefine reglas backend ni autoriza producto desde el código existente.

## Flujo de autoridad

```text
Product Design slice ready
        |
        v
Backend contract verified
        |
        v
Frontend integration contract verified
        |
        v
Implementation + automated evidence
        |
        v
Product validation
```

Un prototipo o una implementación pueden existir antes del primer paso, pero permanecen
como evidencia.

## Handoff mínimo por slice

Antes de implementación deben estar disponibles:

### Product

- domain/slice name;
- readiness status;
- actor y permission intent;
- preconditions;
- happy path;
- alternative/error paths;
- visible states/actions;
- deferred behavior;
- acceptance checklist.

### Backend

- source commit/tag;
- endpoints y methods;
- auth/role/tenant middleware;
- request DTO;
- response DTO;
- success/error codes;
- pagination/search semantics;
- mutation security/CSRF;
- idempotency/concurrency;
- delivery/token semantics cuando aplique.

### Frontend

- routes/surfaces;
- server/client boundary;
- BFF routes;
- query/URL state;
- loading/empty/error/success;
- accessibility/focus;
- locale keys;
- automated tests;
- manual validation matrix.

## Referencias cross-repo

No usar rutas locales. Toda referencia debe incluir:

- repository identifier;
- relative path;
- commit SHA, tag o versión;
- fecha de verificación.

Ejemplo:

```text
sourceRepository: Maped Solutions Product Design
sourcePath: docs/02-domains/users/INTEGRATION_CONTRACT.md
sourceRevision: <commit-or-tag>
verifiedAt: YYYY-MM-DD
```

La revisión concreta debe añadirse antes del primer PR funcional de la migración.

## Gestión de contradicciones

Si frontend, backend y Product Design discrepan:

1. detener la parte afectada;
2. registrar el conflicto en la matriz;
3. identificar qué decisión cambia comportamiento o contrato;
4. resolver primero en Product Design si es de producto;
5. actualizar backend contract si cambia transporte/invariante;
6. actualizar frontend después;
7. conservar documentación anterior como superseded/evidence.

No crear adapters permanentes para mantener dos contratos incompatibles sin decisión
explícita.

## Readiness y lifecycle

Estados de producto y estados técnicos no son equivalentes.

Ejemplos:

- `IMPLEMENTED_EVIDENCE` no significa `IMPLEMENTATION_READY`.
- Un endpoint existente no significa que el flow esté aprobado.
- Un prototipo validado no significa que seguridad/concurrencia estén cerradas.
- Un build verde no significa que el tenant pueda publicarse.

La matriz local traduce el estado vigente a acciones permitidas en este repositorio.

## Users actual

La baseline contiene un directorio e invitaciones más amplios que el slice actualmente
verificable.

- List/cursor/search/isolation pueden pasar a contract verification.
- Summary/filter/attention/relationships permanecen diferidos hasta decisión.
- Invite y accept permanecen bloqueados por campos, locale, dirección, delivery,
  confirmación y concurrencia.
- Resend/revoke/expiry se pueden verificar como lifecycle técnico separado.

La implementación se conserva para análisis; no se continúa como producto cerrado.

## Definition of integrated

Un slice está integrado cuando:

- Product Design source revision está registrada;
- backend contract revision está registrada;
- frontend no tiene fallback V1 silencioso;
- BFF/CSRF/tenant isolation están verificados;
- tests automáticos pasan;
- estados visuales están completos;
- validación manual se ejecutó en entorno desplegado;
- matriz y documentación reflejan el estado real.
