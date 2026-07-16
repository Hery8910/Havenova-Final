# Users Directory — definición funcional, UI/UX y técnica

> Estado documental (`2026-07-10`): referencia original de producto y UX. El
> contrato backend exacto ya fue implementado y algunas recomendaciones de este
> archivo son conceptuales o históricas. No usar su checklist para determinar el
> estado del repo. Consultar `../README.md`, `../PAGE_REQUIREMENTS.md` y
> `../USERS_DIRECTORY_GAP_ANALYSIS.md`. La fuente HTTP canónica vive en el
> repositorio backend `tenant-users/FRONTEND_INTEGRATION.md`.

## 1. Propósito de la vista

La sección izquierda de **Users** funciona como un directorio operativo de clientes. Su objetivo no es reflejar todos los campos disponibles en la base de datos, sino permitir que la empresa:

- comprenda el volumen general de clientes y accesos pendientes;
- encuentre rápidamente a una persona por nombre, email o teléfono;
- detecte cuentas o invitaciones que requieren una acción concreta;
- entienda el contexto comercial mínimo antes de abrir el detalle;
- invite clientes que comenzaron su relación con la empresa fuera de la plataforma;
- seleccione un cliente y vuelva al mismo punto del directorio sin perder el contexto.

Antes de abrir el inspector derecho, cada elemento debe ayudar a responder cuatro preguntas:

1. ¿Quién es esta persona?
2. ¿Puede acceder normalmente a la plataforma?
3. ¿Qué relación comercial tiene con la empresa?
4. ¿Existe una acción pendiente relacionada con su cuenta o acceso?

La página **Users** representa clientes. Admins, managers y workers deben gestionarse en sus propios módulos, aunque técnicamente compartan una entidad o infraestructura común.

---

## 2. Principio de producto

La interfaz debe mostrar información por su valor operativo, no por su disponibilidad técnica.

No se mostrarán datos como `lastLogin`, `theme`, `updatedAt`, `role` u otros campos del modelo salvo que exista una tarea concreta del operador que los necesite.

El directorio no debe convertirse en:

- un reflejo del esquema de MongoDB;
- un sistema de auditoría;
- un cliente de correo;
- una cola de trabajo para solicitudes de servicio.

Las solicitudes y el calendario tendrán sus propias herramientas operativas. El directorio de usuarios debe ayudar a **encontrar, entender y actuar sobre la relación con el cliente**.

---

## 3. Estructura de la vista

La vista se divide en cuatro bloques:

1. **Summary + CTA area**
2. **Search + filters**
3. **Directory list**
4. **Estados operativos**: loading, loading more, empty, no results, error y end of results

La estructura superior se mantiene como patrón reutilizable para otras páginas del dashboard:

- métricas a la izquierda;
- área de acciones contextuales a la derecha;
- posibilidad de incluir uno o más CTA sin rediseñar el bloque completo.

El HTML del prototipo representa estructura, prioridad e interacción. El CSS representa composición y densidad. Ninguno debe interpretarse todavía como definición final del sistema visual.

---

## 4. Resumen: métricas definitivas para el MVP

### 4.1 Total users

Cantidad total de cuentas de cliente existentes.

No incluye invitaciones todavía no aceptadas.

Su función es dar contexto general al volumen de clientes registrados.

**Interacción:** al seleccionar esta métrica se limpia el filtro de estado y se muestra el directorio general. La búsqueda escrita puede mantenerse.

### 4.2 Pending invites

Cantidad de invitaciones válidas que todavía no han sido aceptadas y no han expirado ni sido revocadas.

Una invitación expirada no debe seguir aumentando este contador.

**Interacción:** al seleccionar esta métrica se aplica el filtro `Invitations`.

### 4.3 Needs attention

Cantidad de entradas únicas del directorio que requieren una acción concreta del operador.

El contador puede incluir cuentas de usuario e invitaciones. Una entrada con dos problemas cuenta una sola vez.

#### Criterios del MVP

Una entrada necesita atención cuando se cumple al menos una de estas condiciones:

1. **Invitación expirada** y todavía no aceptada.
2. **Email no verificado después de 48 horas** desde el registro o desde el último envío de verificación.
3. **Cuenta bloqueada por autenticación o seguridad**, únicamente si el backend implementa y expone realmente ese estado.

#### No se considera Needs attention por sí solo

- perfil incompleto;
- teléfono ausente;
- usuario sin solicitudes;
- usuario que lleva tiempo sin contratar un servicio;
- cuenta desactivada intencionalmente por un administrador;
- invitación todavía válida;
- problemas de una solicitud de servicio, presupuesto o cita.

Un perfil incompleto puede convertirse en atención más adelante si falta información que bloquea una operación real, por ejemplo una visita ya programada. Esa regla deberá ser contextual y determinista, no una advertencia genérica.

**Interacción:** al seleccionar la métrica se aplica el filtro `Needs attention`.

### Regla técnica

La lógica de `Needs attention` debe resolverse de forma consistente en backend o en una capa de servicio compartida. El contador, el filtro y `attentionReasons` deben usar exactamente la misma definición.

---

## 5. Área de CTA

### Acción principal: Invite customer

La invitación de clientes es una funcionalidad de negocio válida porque permite transformar una interacción iniciada fuera de la plataforma en una relación digital con menor fricción.

### Flujo esperado

1. El cliente contacta por teléfono, WhatsApp, email u otro canal.
2. La empresa introduce el email en `Invite customer`.
3. El sistema valida si ya existe una cuenta o una invitación previa.
4. Si procede, se envía una invitación segura.
5. El cliente abre el enlace.
6. Define una contraseña.
7. Obtiene acceso a la plataforma.

### Casos que deben manejarse

#### Ya existe un usuario

No crear otra invitación.

La interfaz debe comunicar que el cliente ya tiene cuenta y ofrecer abrir o seleccionar su perfil.

#### Ya existe una invitación pendiente válida

No crear otra invitación idéntica.

La interfaz puede ofrecer:

- reenviar invitación;
- copiar enlace, si la política de seguridad lo permite;
- abrir el estado de la invitación.

#### La invitación anterior expiró

Permitir renovar o reenviar la invitación según la implementación elegida, evitando registros duplicados innecesarios.

#### Invitación aceptada

La entrada de invitación deja de mostrarse como invitación y el usuario aparece como cuenta normal.

### Requisitos de seguridad

La invitación debe utilizar un token de un solo uso, con expiración y validación en servidor. La documentación de esta vista no fija la duración exacta del token; esa configuración pertenece al flujo de autenticación.

---

## 6. Búsqueda

La búsqueda será **server-side** y debe cubrir, como mínimo:

- nombre;
- email;
- teléfono.

### Comportamiento definido

- búsqueda reactiva con `debounce` aproximado de **300 ms**;
- comenzar consulta remota a partir de **2 caracteres**;
- `Enter` puede forzar la consulta inmediatamente;
- limpiar el campo reinicia el directorio inmediatamente;
- una nueva búsqueda cancela la petición anterior si todavía está pendiente;
- cambiar búsqueda reinicia cursor y páginas acumuladas;
- la búsqueda debe respetar el filtro activo.

En frontend conviene usar `AbortController` o la cancelación nativa de la librería de fetching elegida.

La UI no debe quedar vacía mientras se escribe. Puede mantener los resultados anteriores hasta recibir la nueva respuesta, mostrando un estado de actualización discreto.

---

## 7. Filtros del MVP

El filtro de estado tendrá inicialmente:

- `All statuses`
- `Active`
- `Inactive`
- `Invitations`
- `Needs attention`

### Definiciones

#### Active

Cuenta de cliente habilitada para usar la plataforma.

#### Inactive

Cuenta desactivada explícitamente. No debe inferirse por falta de solicitudes o por tiempo sin usar el servicio.

#### Invitations

Muestra invitaciones todavía relevantes para operación: pendientes válidas y expiradas.

Las invitaciones revocadas o canceladas no necesitan aparecer en el directorio normal. Si más adelante se necesita auditoría, deben consultarse desde una vista histórica específica.

#### Needs attention

Aplica exactamente las reglas definidas en la sección 4.3.

### Relación entre filtros

Los filtros no representan necesariamente categorías excluyentes a nivel de datos. Por ejemplo, una invitación expirada pertenece tanto a `Invitations` como a `Needs attention`. La interfaz aplica un filtro principal cada vez.

---

## 8. Orden por defecto

### Decisión del MVP

El directorio se ordenará por **actividad comercial reciente**, descendente.

No se utilizará `lastLogin`.

### Definición inicial de businessActivityAt

Para una cuenta de cliente:

1. fecha de la actividad más reciente de una solicitud de servicio relevante;
2. si no existen solicitudes, `createdAt` de la cuenta.

Para una invitación:

1. fecha del último envío de invitación.

La definición puede ampliarse más adelante con comunicaciones o notas internas únicamente si realmente representan actividad de trabajo útil para el operador.

### Desempate estable

El orden debe tener una segunda clave estable, por ejemplo:

```text
businessActivityAt DESC
entryId DESC
```

Esto es necesario para paginación por cursor.

### Por qué no ordenar Needs attention primero

`Needs attention` ya tiene métrica y filtro propios. Mezclar automáticamente los casos problemáticos con el orden general haría que la lista pudiera reorganizarse de forma inesperada mientras el operador trabaja.

### Orden manual

No se añadirá un selector de orden en el MVP.

La búsqueda cubre el caso de localizar una persona conocida y el orden por actividad reciente cubre la navegación operativa general. `Name A–Z` u otros criterios solo se añadirán si el uso real demuestra que aportan valor.

---

## 9. Contenido de cada elemento del directorio

Cada row/card debe ser compacto. Su objetivo es permitir una decisión rápida, no reemplazar el inspector derecho.

### Jerarquía fija

#### Nivel 1 — Identidad

- nombre completo;
- fallback claro si todavía no existe nombre.

Ejemplo de fallback: `Pending profile`.

#### Nivel 2 — Identificador

- email principal.

#### Nivel 3 — Estado principal

Mostrar un solo estado principal visible:

- `Active`
- `Inactive`
- `Invited`
- `Invite expired`
- `Locked`, si existe realmente ese estado

La verificación de email no necesita un badge permanente cuando todo está correcto. Solo debe destacar cuando genera una razón de atención.

#### Nivel 4 — Resumen operativo

Mostrar un máximo aproximado de **tres fragmentos** de metadata, priorizados así:

1. razón de atención, si existe;
2. próxima cita o servicio, si existe;
3. cantidad de solicitudes activas;
4. cantidad total de solicitudes;
5. último servicio;
6. `No requests yet` cuando no existe historial comercial.

Ejemplos:

```text
Anna Müller                          Active
anna@example.de
3 requests · 1 active · Next service Jul 18
```

```text
David Klein                         Active
david@example.de
2 requests · Email verification pending for 5 days
```

```text
Nora Fischer                        Invited
nora@example.de
No account access yet · Invite expires in 2 days
```

### Información excluida por defecto

No mostrar en la fila:

- `lastLogin`;
- tema visual;
- timestamps técnicos sin propósito operativo;
- rol, porque esta página ya representa clientes;
- fecha de creación, salvo necesidad futura concreta;
- identificadores internos;
- datos de auditoría.

---

## 10. Usuarios sin solicitudes

Los usuarios sin solicitudes permanecen en el directorio.

Pueden representar:

- clientes recién registrados;
- clientes invitados desde una interacción offline;
- cuentas creadas antes de una primera contratación;
- personas que todavía están evaluando un servicio.

`No requests yet` es un estado neutral, no una advertencia.

Un perfil incompleto sin una operación bloqueada tampoco debe generar automáticamente `Needs attention`.

---

## 11. Modelo de estados para UI

La UI no debe depender de un único enum que mezcle todas las situaciones posibles.

La respuesta del backend debe permitir distinguir ejes separados.

### Para cuentas

```text
kind: user
accountStatus: active | inactive | locked
verificationStatus: verified | unverified
attentionReasons: []
```

`locked` solo se implementará si existe en el sistema de autenticación. No debe simularse en frontend.

### Para invitaciones

```text
kind: invitation
invitationStatus: pending | expired
attentionReasons: []
```

Las invitaciones aceptadas pasan a representarse como usuario. Las revocadas no forman parte del directorio operativo normal.

### Attention reasons del MVP

Propuesta de códigos estables:

```text
INVITATION_EXPIRED
EMAIL_UNVERIFIED_STALE
ACCOUNT_LOCKED
```

Los textos visibles deben derivarse de i18n, no enviarse ya traducidos desde el backend.

---

## 12. Directorio unificado: usuarios e invitaciones

Las invitaciones pendientes deben poder encontrarse en el mismo directorio porque, desde el punto de vista del operador, se está buscando a una persona, no una colección técnica concreta.

La implementación interna puede mantener `User` e `Invitation` como modelos separados. La UI debe recibir una forma normalizada.

### DirectoryEntryDTO conceptual

```ts
interface DirectoryEntryDTO {
  entryId: string;
  kind: "user" | "invitation";

  userId?: string;
  invitationId?: string;

  displayName: string | null;
  email: string;
  phone?: string | null;

  accountStatus?: "active" | "inactive" | "locked";
  verificationStatus?: "verified" | "unverified";
  invitationStatus?: "pending" | "expired";

  attentionReasons: Array<
    | "INVITATION_EXPIRED"
    | "EMAIL_UNVERIFIED_STALE"
    | "ACCOUNT_LOCKED"
  >;

  requestSummary: {
    total: number;
    active: number;
    nextServiceAt?: string | null;
    lastServiceAt?: string | null;
  };

  businessActivityAt: string;
}
```

Este contrato es conceptual. Puede adaptarse a los tipos reales del proyecto, pero debe conservar la separación entre estado de cuenta, verificación, invitación, atención y resumen comercial.

---

## 13. Scroll infinito

La lista usará carga incremental en lugar de paginación visible.

### Comportamiento esperado

1. cargar un primer bloque, recomendado inicialmente en torno a 20–25 entradas;
2. un `IntersectionObserver` detecta proximidad al final;
3. solicitar la siguiente página;
4. mostrar skeleton rows o un indicador discreto;
5. agregar resultados sin mover la posición actual;
6. evitar peticiones duplicadas mientras una carga está pendiente;
7. deduplicar resultados por `entryId`;
8. mostrar un final de resultados discreto cuando no existe siguiente cursor.

### Recomendación de backend

Preferir paginación por cursor sobre `offset/skip`.

Ejemplo conceptual:

```text
GET /dashboard/users/directory?limit=25
→ items
→ nextCursor
→ hasNextPage

GET /dashboard/users/directory?limit=25&cursor=...
```

### Al cambiar búsqueda o filtro

- cancelar request pendiente;
- descartar cursor anterior;
- limpiar páginas incompatibles;
- iniciar consulta desde el primer bloque;
- conservar selección solo si sigue perteneciendo al nuevo conjunto visible.

---

## 14. Restauración de contexto al volver del detalle en móvil

Este comportamiento se considera requisito de UX, no mejora opcional.

### Problema

En desktop, lista y detalle pueden coexistir. En móvil probablemente se navegue entre:

```text
/people/users
/people/users/:entryId
```

Si el operador ha recorrido una lista larga, abre un cliente y al volver aterriza al inicio, pierde contexto y tiempo.

### Estado mínimo a conservar

- `selectedEntryId`;
- búsqueda actual;
- filtro actual;
- posición de scroll como apoyo;
- páginas de infinite query en cache cuando sea posible.

### Estrategia recomendada

#### Camino normal

Usar la cache de la librería de fetching/infinite query para conservar las páginas ya cargadas al navegar al detalle y volver.

Al restaurar:

1. recuperar búsqueda y filtro;
2. reutilizar las páginas cacheadas;
3. localizar `selectedEntryId`;
4. hacer `scrollIntoView()` o restaurar la posición visual equivalente;
5. devolver foco lógico al elemento seleccionado cuando corresponda.

#### Cuando la cache ya no existe

1. restaurar búsqueda y filtro;
2. volver a cargar páginas;
3. continuar hasta encontrar `selectedEntryId` o hasta alcanzar un límite de seguridad razonable;
4. posicionar el directorio en el elemento;
5. usar `scrollTop` guardado solo como apoyo.

### Regla importante

No depender únicamente de `scrollTop` porque una lista dinámica puede cambiar entre navegaciones.

El ID de la entrada seleccionada es la referencia semántica principal.

---

## 15. Estados visuales obligatorios

Antes de considerar terminado el componente deben existir referencias para:

- normal;
- hover;
- selected;
- active;
- inactive;
- invitation pending;
- invitation expired;
- needs attention;
- loading initial;
- refreshing search/filter;
- loading more;
- empty directory;
- no search results;
- request error con acción `Retry`;
- end of results.

No todos necesitan el mismo peso visual.

`Needs attention` y errores deben ser perceptibles, pero el directorio no debe convertirse en una colección de badges y colores de alerta.

El estado no debe comunicarse únicamente mediante color.

---

## 16. Desktop y móvil

### Desktop

El directorio forma parte de un patrón Master–Detail:

- directorio a la izquierda;
- inspector a la derecha;
- selección persistente;
- scroll interno independiente cuando sea necesario;
- cambiar de usuario no debe obligar a recargar toda la página.

### Mobile

No se comprimirá el Master–Detail en dos columnas.

Comportamiento:

- directorio como pantalla principal;
- seleccionar una entrada abre detalle como pantalla o ruta independiente;
- volver restaura búsqueda, filtro, carga acumulada y posición relativa al elemento seleccionado.

---

## 17. Contratos API recomendados

Los nombres exactos pueden adaptarse a la arquitectura existente. La separación de responsabilidades es la parte importante.

### Summary

```text
GET /dashboard/users/summary
```

Respuesta conceptual:

```json
{
  "totalUsers": 128,
  "pendingInvites": 6,
  "needsAttention": 9
}
```

Los valores del summary son globales para el módulo y no cambian al escribir una búsqueda o aplicar un filtro local.

### Directory

```text
GET /dashboard/users/directory
```

Parámetros conceptuales:

```text
q
status=all|active|inactive|invitations|attention
cursor
limit
```

Respuesta conceptual:

```json
{
  "items": [],
  "nextCursor": "...",
  "hasNextPage": true
}
```

No es necesario devolver `totalMatches` para el MVP. El texto `8 loaded` o similar es un dato técnico y no aporta valor al operador.

### Invitación

El endpoint de invitación debe devolver errores de dominio distinguibles, por ejemplo:

```text
USER_ALREADY_EXISTS
INVITATION_ALREADY_PENDING
INVITATION_EXPIRED
```

Esto permite que la UI ofrezca la acción adecuada en lugar de mostrar un error genérico.

---

## 18. Consideraciones de implementación

### Cálculos agregados

El directorio necesita datos derivados de cuentas, invitaciones y solicitudes.

La UI no debe hacer una petición individual por usuario para calcular:

- cantidad de requests;
- requests activas;
- próxima cita;
- último servicio;
- actividad comercial reciente.

Estos datos deben llegar preparados desde backend mediante agregación, proyección optimizada o campos denormalizados, según lo que resulte más adecuado para el volumen real.

### Evitar N+1

Una página de 25 entradas no debe provocar 25 consultas independientes adicionales para construir el resumen comercial.

### Consistencia

Summary, filtros y filas deben usar las mismas reglas de dominio para:

- invitaciones pendientes;
- invitaciones expiradas;
- verificación atrasada;
- bloqueo de cuenta;
- Needs attention.

### Cache

Conviene cachear la infinite query por combinación de:

```text
search + status + order
```

La navegación al detalle y regreso debe reutilizar esa cache siempre que siga vigente.

---

## 19. Accesibilidad e interacción

- cada row debe poder seleccionarse con teclado;
- debe existir foco visible;
- el estado seleccionado debe exponerse semánticamente;
- los accesos rápidos de métricas deben ser botones reales si son interactivos;
- loading y errores deben anunciarse de manera no intrusiva;
- el estado no puede depender exclusivamente de color;
- el área táctil de cada fila debe ser suficientemente amplia en móvil.

---

## 20. Decisiones deliberadamente fuera del MVP

No se implementarán por ahora:

- orden manual por múltiples columnas;
- estadísticas de login;
- filtros avanzados combinables;
- historial de invitaciones revocadas dentro del directorio principal;
- puntuación automática de valor del cliente;
- segmentación comercial compleja;
- comunicación por email completa desde el directorio;
- actividad detallada del usuario como feed de auditoría.

Estas funcionalidades no están descartadas permanentemente. Se posponen hasta que exista una necesidad real y datos de uso que justifiquen su complejidad.

---

## 21. Checklist de implementación

### Negocio

- [ ] `Users` devuelve solo clientes.
- [ ] `Needs attention` usa reglas deterministas.
- [ ] `Pending invites` excluye expiradas y revocadas.
- [ ] invitación detecta usuario o invitación previa.
- [ ] usuarios sin requests permanecen visibles y no generan alerta por defecto.

### Backend

- [ ] endpoint de summary.
- [ ] endpoint de directory unificado o normalizado.
- [ ] búsqueda por nombre, email y teléfono.
- [ ] filtro por estado.
- [ ] cursor estable por `businessActivityAt + entryId`.
- [ ] DTO con resumen comercial sin N+1.
- [ ] `attentionReasons` calculado con la misma lógica que summary y filtros.

### Frontend

- [ ] debounce y cancelación de búsqueda.
- [ ] infinite query con deduplicación.
- [ ] skeleton inicial y loading more.
- [ ] error con retry.
- [ ] empty state y no-results state diferenciados.
- [ ] selección persistente en desktop.
- [ ] navegación a detalle en móvil.
- [ ] restauración por `selectedEntryId` al volver.
- [ ] cache por search/filter.
- [ ] métricas como accesos rápidos a filtros.

---

## 22. Criterio de cierre de esta funcionalidad

El directorio se considera bien resuelto cuando un operador puede:

1. entender el volumen general de clientes y accesos pendientes;
2. encontrar una persona rápidamente;
3. distinguir una cuenta normal de una que requiere acción;
4. comprender su contexto comercial mínimo sin abrir el detalle;
5. invitar un cliente sin crear duplicados;
6. recorrer una lista larga y volver desde móvil al mismo contexto;
7. continuar trabajando sin enfrentarse a información técnica que no necesita.

La regla final es simple: **cada elemento visible debe ayudar a encontrar, priorizar, entender o actuar**.
