# Client Context (Frontend)

## Objetivo

El `ClientContext` es la fuente de verdad del tenant en frontend para aplicaciones `client` y `dashboard`.

Su objetivo actual es:

- cargar configuración base de tenant por `tenantKey`
- exponer `client` y `loading` a todo el árbol React
- habilitar inicialización de `auth`, `profile`, `workers` y formularios dependientes del tenant

## Alcance

### Incluye

- bootstrap público del tenant vía `GET /api/clients/tenant/:tenantKey`
- estado global en memoria de `client` dentro de `ClientProvider`
- fallback de error visual cuando no hay cliente cargado

### No incluye

- lógica de autorización por rol (`admin`, `superAdmin`)
- carga automática de la vista protegida dashboard dentro de `ClientContext`
- cualquier flujo `admin`/`superAdmin` de plataforma
- resolución dinámica de tenant por host/subdominio

## Fuente de datos

### Endpoint usado actualmente

- `GET /api/clients/tenant/:tenantKey`
- `GET /api/clients/dashboard/:clientId` para configuración protegida del dashboard
- Servicio: `packages/services/client/clientServices.ts`

### Contrato esperado del backend

Formato estándar:

```json
{
  "success": true,
  "code": "CLIENT_PUBLIC_FETCH_SUCCESS",
  "data": {
    "_id": "...",
    "identity": {},
    "operations": {},
    "modules": {}
  }
}
```

## Datos disponibles en contexto

Tipo principal expuesto por contexto:

- `ClientBootstrapConfig`

Tipos disponibles para servicios de cliente:

- `ClientBootstrapConfig`
- `ClientDashboardView`
- `ClientBootstrapResponse`
- `ClientDashboardResponse`

Campos disponibles de forma garantizada:

- `_id`
- `identity`
- `operations`
- `modules`

Campos opcionales por compatibilidad:

- `publicProfile`
- `legal`

## Flujo actual

1. Layout (`apps/client` y `apps/dashboard`) resuelve `tenantKey` con helper compartido:
   `resolveTenantKey()`.
2. Layout llama `getClient(tenantKey)` en servidor para bootstrap público.
3. Layout inyecta `initialClient` en `ClientProvider`.
4. `ClientProvider` hidrata estado local y expone `client`.
5. Si `client` es `null`, muestra popup según `code/status` del backend y no renderiza hijos.

## Dependencias directas

- `AuthProvider`: usa `client._id` para completar `auth.clientId`
- `ProfileProvider`: depende de `auth.clientId`
- `WorkerProvider` y formularios de dashboard: dependen de `client._id`
- calendarios/formularios de servicios: dependen de `operations.schedule` y `modules.homeServices.config`

## Estado actual detectado

### Alineado

- Uso de ruta canónica `/api/clients/...` (no `/api/client`)
- Bootstrap público por `tenantKey`
- Tipos de bootstrap alineados con vista mínima del backend

### Inconsistencias abiertas

- Falta resolver estrategia de subdominios custom por tenant (hoy se valida allowlist fija por app)
- El dashboard todavía no consume `getClientDashboard(clientId)` como bootstrap específico de settings
- El contexto ya clasifica errores de bootstrap por `code/status` y aplica CTA según recuperabilidad
- Fallback i18n compartido ya resuelve EN/DE por `locale` mediante `getI18nFallbacks(language)`

## Checklist de cambios

### Fase 1: Tipos y códigos

- [x] Actualizar i18n `popups` EN/DE con catálogo de códigos backend vigente
- [x] Tipar `getClient` con `ApiResponse<ClientBootstrapConfig>`
- [x] Validar `success/data` en `getClient` y propagar error estructurado
- [x] Ampliar `PopupsTexts` para incluir códigos nuevos de auth/client/notificaciones/contact
- [x] Documentar códigos legacy tolerados durante la migración

### Fase 2: Comportamiento del contexto

- [x] Propagar `code/status` reales de fallo de bootstrap hasta `ClientProvider`
- [x] Reemplazar fallback único `CLIENT_FETCH_FAILED` por mapa de códigos (`CLIENT_NOT_FOUND`, `VALIDATION_ERROR`, `GLOBAL_INTERNAL_ERROR`)
- [x] Definir UX por error recuperable vs no recuperable (reload vs navegación)

### Fase 3: Resolución de tenant

- [x] Centralizar resolución de `tenantKey` (helper compartido)
- [x] Eliminar fallback demo en entornos productivos
- [x] Definir jerarquía de resolución por entorno:
  `NEXT_PUBLIC_TENANT_KEY` -> `NEXT_PUBLIC_TENANT_KEY_FALLBACK` -> demo solo no-producción
- [x] Validar host por app en servidor con allowlist (`NEXT_PUBLIC_ALLOWED_HOSTS`)
- [ ] Evaluar estrategia por subdominio/host dinámico por tenant (si se requiere multi-tenant por dominio)

## Configuración de entorno por app

Variables usadas por el bootstrap de cliente:

- `NEXT_PUBLIC_ALLOWED_HOSTS`: lista CSV de hosts permitidos para esa app
- `NEXT_PUBLIC_TENANT_KEY`: tenant principal
- `NEXT_PUBLIC_TENANT_KEY_FALLBACK`: tenant de respaldo (opcional)

Reglas:

- En producción, `NEXT_PUBLIC_ALLOWED_HOSTS` debe estar configurado.
- En desarrollo, `localhost`/`127.0.0.1` se permiten automáticamente.
- El fallback demo `tnk_demo_havenova` solo se usa fuera de producción cuando faltan tenant keys.

Ejemplo `apps/client/.env`:

```env
NEXT_PUBLIC_ALLOWED_HOSTS=havenova.de
NEXT_PUBLIC_TENANT_KEY=tnk_havenova_prod
NEXT_PUBLIC_TENANT_KEY_FALLBACK=tnk_havenova_backup
```

Ejemplo `apps/dashboard/.env`:

```env
NEXT_PUBLIC_ALLOWED_HOSTS=dashboard.havenova.de
NEXT_PUBLIC_TENANT_KEY=tnk_havenova_prod
NEXT_PUBLIC_TENANT_KEY_FALLBACK=tnk_havenova_backup
```

### Fase 4: Endpoints protegidos de cliente

- [x] Decidir alcance del frontend: solo `/api/clients/dashboard/:clientId`, sin `admin`
- [ ] Definir si dashboard debe bootstrapear por `/api/clients/dashboard/:clientId`
- [x] Ajustar servicios/tipos para vistas `ClientBootstrapConfig` y `ClientDashboardView`

### Fase 5: Limpieza y hardening

- [x] Reducir dependencia de códigos legacy en handlers/contextos
- [x] Añadir tests de contrato para bootstrap: resolución de tenant, host allowlist, endpoints y manejo de error estructurado
- [x] Añadir tests de mapeo de popups por código en EN/DE
- [x] Corregir fallback i18n compartido para respetar `en` y `de` según idioma activo

## Legacy Soportado

Durante la migración seguimos tolerando aliases legacy solo en recursos `i18n/*.json` para no romper flujos ya desplegados.

Códigos legacy aún presentes en recursos i18n:

- `ACCESS_TOKEN_EXPIRED`
- `NO_ACCESS_TOKEN`
- `CLIENT_CREATE_SUCCESS`
- `CLIENT_FETCH_FAILED`
- `CLIENT_UPDATE_SUCCESS`
- `USER_EMAIL_ALREADY_REGISTERED`
- `USER_FORGOT_PASSWORD_EMAIL_SENDED`
- `USER_LOGIN_INVALID_CREDENTIALS`
- `USER_VERIFY_EMAIL_RESENDED`

Objetivo:

- mantener compatibilidad pasiva mientras se corrigen llamadas antiguas
- evitar dependencia activa de estos aliases en contextos, handlers y fallbacks
- eliminar estos aliases cuando los consumidores queden alineados con los códigos backend actuales

## Tests

Script disponible:

```bash
npm run test:client-context
npm run test:contexts:ui
```

Cobertura actual:

- contrato de `resolveTenantKey()` y `assertAllowedAppHost()` sobre código fuente
- contrato de `getClient()` y `getClientDashboard()` sobre endpoints, validación y manejo de error estructurado
- paridad de claves popup entre EN/DE
- presencia de CTA dobles donde son requeridos
- conservación explícita de aliases legacy en i18n, sin dependencia activa en contextos/fallbacks
- integración UI con `Jest` + `React Testing Library` para `ClientProvider` y `AlertContext`
- wrapper compartido de tests en `tests/jest/utils/test-providers.jsx` para componer `I18nProvider`, `AlertProvider` y `ClientProvider`

Matriz UX actual de bootstrap:

- `CLIENT_NOT_FOUND` y `AUTH_FORBIDDEN`: navegación a inicio o cierre
- `GLOBAL_INTERNAL_ERROR`, red o `5xx`: reintento o cierre
- `VALIDATION_ERROR` y errores no recuperables: cierre simple

## Referencias

- Contexto: `packages/contexts/client/ClientContext.tsx`
- Servicio: `packages/services/client/clientServices.ts`
- Tipos cliente: `packages/types/client/clientTypes.ts`
- Tipos popup: `packages/contexts/alert/alert.types.ts`
- Contrato backend: `src/core/client/README.md` (backend)
