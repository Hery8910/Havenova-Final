# Reglas de trabajo para agentes

## Alcance

Estas reglas aplican a todo el repositorio. Un `AGENTS.md` más cercano puede añadir
restricciones locales, pero no contradecir este archivo.

## Lectura obligatoria

Antes de proponer o implementar cambios:

1. leer `README.md` y `ARCHITECTURE.md`;
2. leer `docs/README.md`;
3. consultar `docs/01-foundation/IMPLEMENTATION_AUTHORITY_MATRIX.md`;
4. consultar `docs/01-foundation/FRONTEND_MIGRATION_PLAN.md`;
5. leer el `AGENTS.md` del área afectada;
6. localizar el dominio correspondiente en Product Design;
7. verificar el contrato backend versionado cuando haya transporte o mutaciones.

Si la fuente Product Design o el contrato backend requerido no están disponibles, no
inventar el comportamiento: documentar el bloqueo.

## Orden de autoridad

Cuando dos fuentes discrepen, aplicar este orden:

1. decisiones vigentes del repositorio Product Design de Maped Solutions;
2. contratos de integración aprobados de Product Design;
3. contrato backend versionado y verificado;
4. arquitectura y decisiones vigentes de este repositorio;
5. código y tests actuales como evidencia;
6. auditorías, prototipos, placeholders y documentos históricos.

El código existente nunca convierte por sí solo una funcionalidad en requisito de
producto.

## Regla de readiness

No comenzar una funcionalidad nueva ni ampliar una existente si su estado es `BLOCKED`,
`DEFERRED`, `LEGACY` o `IMPLEMENTED_EVIDENCE` sin aprobación adicional.

La matriz local no sustituye Product Design. Sirve para impedir que una implementación
adelantada se trate como autoridad.

## Modelo de producto

La arquitectura debe preservar:

```text
Core Product + Tenant Configuration + Specific Extensions
```

- `apps/dashboard` y `apps/worker` forman parte del core reutilizable.
- `apps/client` puede ser específico de una empresa.
- No introducir condiciones como `tenant === 'havenova'` en el core.
- Una diferencia visual de marca no justifica duplicar lógica operativa.
- Una extensión de negocio específica debe estar aislada, documentada y aprobada.

## Forma de trabajo

- Trabajar por slices verticales definidos y verificables.
- Mantener cada PR pequeña, con una sola responsabilidad principal.
- Separar documentación, estabilización, migración estructural y cambios de producto.
- Preferir cambios incrementales sobre reescrituras amplias.
- Conservar comportamiento que tenga evidencia útil hasta clasificarlo.
- No desarrollar sobre rutas placeholder como si fueran roadmap aprobado.
- Registrar decisiones consecuenciales en `FRONTEND_DECISIONS_LOG.md`.
- Actualizar la matriz de autoridad cuando cambie el estado real de un dominio.

## Arquitectura técnica

- Las rutas `app/` son server-first por defecto.
- Añadir `'use client'` sólo en la frontera interactiva mínima.
- El navegador consume rutas same-origin del frontend.
- El frontend BFF es la frontera hacia el backend.
- No crear nuevas llamadas browser-direct a `NEXT_PUBLIC_API_URL`.
- No duplicar reglas de negocio backend en componentes o hooks.
- No importar código de una app desde otra app.
- Los paquetes compartidos no importan desde `apps/*`.
- Evitar imports desde barrels globales; usar una superficie explícita y acotada.
- Declarar dependencias internas reales en cada `package.json`.
- No introducir aliases adicionales durante la migración sin decisión documentada.

## Seguridad y multi-tenancy

- Toda lectura o mutación autenticada debe conservar aislamiento tenant.
- Las mutaciones autenticadas deben respetar cookies same-origin y CSRF.
- No persistir access tokens, refresh tokens o CSRF en `localStorage`.
- No confiar en estado local para autorizar acceso.
- No exponer tokens de invitación en respuestas de administración.
- No debilitar validaciones por conveniencia del frontend.
- Mantener mensajes sensibles deliberadamente ambiguos cuando el contrato lo exija.

## Assets y branding

- Consultar `docs/03-assets/ASSET_STRATEGY.md` y `ASSET_REGISTRY.md`.
- No añadir un asset sin propietario, superficie, origen y estado.
- No copiar manualmente el mismo asset a varias apps.
- No versionar salidas generadas por sincronización.
- No colocar branding de Havenova dentro de dashboard o worker core.
- Los headers de correo se construyen con HTML y recursos registrados; no con banners de
  texto rasterizado.

## Calidad

Antes de declarar terminado un cambio:

- ejecutar los gates aplicables de `QUALITY_GATES.md`;
- comprobar que no se añadieron warnings;
- validar los tres idiomas cuando haya copy visible;
- revisar accesibilidad y navegación por teclado;
- añadir o actualizar pruebas de comportamiento, no sólo tests de texto fuente;
- documentar cualquier gate que no pueda ejecutarse y por qué.

No modificar tests sólo para obtener verde sin confirmar primero el comportamiento que
deben proteger.

## Documentación

- Usar enlaces relativos dentro del repositorio.
- Para referencias externas, usar URLs estables y, cuando sea posible, un commit o tag.
- No usar rutas absolutas como `/home/...`.
- Una auditoría describe evidencia; no crea autoridad de producto.
- Un plan vivo debe indicar estado, propietario y criterio de salida.
- No duplicar contratos backend completos dentro del frontend.
- Archivar documentos superados en lugar de mantener dos fuentes canónicas.

## Higiene del repositorio

- No versionar `node_modules`, `.next`, logs, coverage ni artefactos temporales.
- No usar `*.js` globalmente en `.gitignore`; ignorar sólo outputs conocidos.
- No eliminar archivos ajenos o legacy sin registrar evidencia y consumidores.
- No mezclar limpieza masiva con cambios funcionales.
- Respetar cambios no relacionados presentes en el worktree del usuario.

## Estado especial de Users

La implementación actual de Users es evidencia avanzada pero anterior a la rectificación
vigente de Product Design.

- Directorio, cursor, búsqueda y aislamiento pueden pasar a verificación de contrato.
- Summary, filtros, attention y relación comercial requieren revisión de producto.
- Invite y aceptación permanecen bloqueados mientras sus decisiones estén abiertas.
- Resend/revoke/expiry pueden verificarse técnicamente, pero no implican release del flujo
  completo.

No continuar Users sin consultar la matriz de autoridad.
