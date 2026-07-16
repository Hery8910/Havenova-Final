# Matriz de autoridad e implementación

## Propósito

Impedir que una funcionalidad existente se trate como producto aprobado únicamente porque
compila o tiene documentación local.

- Baseline frontend: `19bf648`, `2026-07-16`.
- Rectificación Product Design considerada: `2026-07-12`.
- Este documento no sustituye el repositorio Product Design.

## Estados

| Estado | Significado | Acción permitida |
| --- | --- | --- |
| `CONTRACT_VERIFICATION_POSSIBLE` | Producto suficientemente definido y backend con evidencia verificable | Auditar y cerrar contrato; implementar sólo dentro del slice |
| `CONTRACT_VERIFICATION_BLOCKED` | Faltan decisiones que cambian el contrato | No continuar implementación funcional |
| `IMPLEMENTED_EVIDENCE` | Existe código útil, pero no crea autoridad | Conservar, probar y clasificar |
| `DEFERRED` | Fuera del slice o release actual | No invertir en implementación/polish |
| `LEGACY` | Compatibilidad o estructura anterior | No ampliar; preparar salida |
| `REMOVABLE` | Sin autoridad ni consumidor justificado | Eliminar en PR dedicada tras verificar referencias |
| `UNKNOWN` | Evidencia insuficiente | Investigar antes de decidir |

## Plataforma

| Área | Estado | Evidencia | Próxima acción |
| --- | --- | --- | --- |
| Monorepo client/dashboard/worker | `IMPLEMENTED_EVIDENCE` | Tres typechecks/builds pasan | Formalizar límites y CI |
| BFF auth | `IMPLEMENTED_EVIDENCE` | Rutas same-origin y cookies bridge | Verificar contrato auth vigente |
| Recuperación CSRF | `IMPLEMENTED_EVIDENCE` | `/auth/csrf -> refresh -> me` en frontend/middleware | Contrastar con backend y corregir test antiguo |
| BFF contact/profile/Users | `IMPLEMENTED_EVIDENCE` | Rutas y contract tests | Verificar permisos, CSRF e isolation |
| Browser-direct residual | `LEGACY` | calendar, notifications, object, manager, catalog, service | Migrar por dominio al BFF |
| Auth local/offline fallback | `IMPLEMENTED_EVIDENCE` | `AuthContext` conserva source/storage/dev fallback | Cerrar política de producción |
| PWA | `UNKNOWN` | Manifests/UI presentes; service worker no activo | Decisión Product Design antes de reparar |
| SEO/sitemap | `IMPLEMENTED_EVIDENCE` | Outputs estáticos y contradictorios | Redefinir cuando se cierre el client |

## Users v1 — Assisted Customer Onboarding

| Capacidad | Estado | Evidencia frontend | Regla actual |
| --- | --- | --- | --- |
| Listado tenant-isolated | `CONTRACT_VERIFICATION_POSSIBLE` | Directory V2/BFF | Verificar con backend auditado |
| Cursor opaco | `CONTRACT_VERIFICATION_POSSIBLE` | Transporte y controlador | Conservar sin parsear |
| Búsqueda | `CONTRACT_VERIFICATION_POSSIBLE` | Debounce y query remota | Verificar campos/longitud aprobados |
| Restore URL/mobile | `IMPLEMENTED_EVIDENCE` | Cache, selection y focus | Validar UX antes de promover patrón |
| Summary | `DEFERRED` | Endpoint/UI implementados | No tratar como requisito actual |
| Filtros avanzados | `DEFERRED` | active/inactive/invitations/attention | Reducir o retirar según Product Design |
| Attention reasons | `DEFERRED` | Tres códigos implementados | No ampliar |
| Relationship summary | `DEFERRED` | requests/workOrders/appointment | No presentar como integración cerrada |
| Formulario assisted invite | `CONTRACT_VERIFICATION_BLOCKED` | UI y payload implementados | Bloqueado por campos/locale/dirección/entrega |
| Resolve/accept público | `CONTRACT_VERIFICATION_BLOCKED` | BFF y páginas compartidas | Bloqueado por confirmación y concurrencia |
| Resend/revoke/expiry | `CONTRACT_VERIFICATION_POSSIBLE` | Mutations y token lifecycle | Verificar aislado; no libera onboarding completo |
| Materialización de perfil | `CONTRACT_VERIFICATION_BLOCKED` | Documentos locales afirman perfil mínimo | No asumir hasta decisión vigente |
| Prototipo HTML/CSS local | `LEGACY` | Carpeta dentro de la ruta | Mover a evidencia/archivo |

## Client

| Área | Estado | Evidencia | Próxima acción |
| --- | --- | --- | --- |
| Web pública Havenova | `IMPLEMENTED_EVIDENCE` | Home/about/services/contact/legal | Clasificar contenido y assets |
| Contact form | `IMPLEMENTED_EVIDENCE` | Validación y BFF | Verificar contrato/entrega |
| Cleaning request | `IMPLEMENTED_EVIDENCE` | Flujo multistep y draft | Converger con Product Design |
| Home service request | `IMPLEMENTED_EVIDENCE` | Flujo multistep | Converger con Product Design |
| Auth público | `IMPLEMENTED_EVIDENCE` | Register/login/verify/recovery | Verificar E2E y política de sesión |
| Profile/settings | `IMPLEMENTED_EVIDENCE` | Contexto y UI amplios | Clasificar core vs tenant-specific |
| Orders/requests/notifications | `DEFERRED` | Placeholders explícitos | No implementar por navegación |

## Dashboard

| Área | Estado | Evidencia | Próxima acción |
| --- | --- | --- | --- |
| Shell/navegación | `IMPLEMENTED_EVIDENCE` | IA amplia y componentes | Validar con Product Design; reducir exposición |
| Users | Mixto | Ver sección Users | Convergence audit por slice |
| Requests/properties/clients/team/catalog/messages/company/account | `DEFERRED` | 39 páginas placeholder | No usar como roadmap |
| Dashboard overview | `DEFERRED` | Placeholder | Esperar dominio operativo aprobado |

## Worker

| Área | Estado | Evidencia | Próxima acción |
| --- | --- | --- | --- |
| Auth invitation-only | `IMPLEMENTED_EVIDENCE` | Rutas shared y BFF | Verificar dependencia con onboarding |
| Session/profile | `IMPLEMENTED_EVIDENCE` | Provider y página profile | Validar aislamiento/contrato |
| Operación worker | `DEFERRED` | No existe producto real | Esperar Product Design |

## Assets y correo

| Área | Estado | Evidencia | Próxima acción |
| --- | --- | --- | --- |
| Assets actuales | `UNKNOWN` | 195 archivos, 88 copias duplicadas | Inventario y decisión por asset |
| Shared sync outputs | `LEGACY` | Copias versionadas en tres apps | Diseñar generación no versionada |
| Branding tenant | `CONTRACT_VERIFICATION_BLOCKED` | Tokens/manifest dispersos | Definir schema y assets mínimos |
| Headers de correo | `CONTRACT_VERIFICATION_BLOCKED` | Sin contrato canónico | Product Design + email branding contract |

## Regla de mantenimiento

Actualizar una fila sólo cuando exista evidencia enlazable. Registrar decisiones
consecuenciales en `FRONTEND_DECISIONS_LOG.md` y no cambiar estados para justificar código
ya escrito.
