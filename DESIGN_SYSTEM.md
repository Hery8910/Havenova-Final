# Manifiesto del Sistema de Diseño (Havenova)

## Objetivo

Este documento establece las bases fundamentales de UI/UX, arquitectura CSS, accesibilidad (a11y) y semántica para el ecosistema Havenova. Al ser una plataforma multitenant, el objetivo principal es separar la **estructura semántica** de la **capa de presentación visual (Brand)**.

Esta plantilla está diseñada para ser agnóstica al cliente, permitiendo que la inyección de unas cuantas variables CSS transforme completamente la apariencia de la aplicación sin alterar su comportamiento ni accesibilidad.

---

## 1. Cuestionario de Definición de Brand (Plantilla para Tenants)

Para definir correctamente la identidad visual de un nuevo cliente/tenant y mapearla a nuestro sistema de diseño, es necesario responder las siguientes preguntas:

### Colores y Temática

1. **Color Principal (Primary):** ¿Cuál es el color predominante de la marca (usado en botones principales, enlaces activos, elementos destacados)?
2. **Color Secundario (Secondary):** ¿Existe un color secundario para acciones de menor peso o elementos de soporte?
3. **Fondo y Superficies (Surfaces):** ¿La aplicación requiere un fondo puramente blanco, o utiliza tonos sutiles (ej. grises muy claros, tonos crema) para diferenciar secciones (tarjetas, modales, barras laterales)?
4. **Modo Oscuro (Dark Mode):** ¿El brand requiere soporte para modo oscuro nativo? Si es así, ¿cuáles son los colores de fondo y acento invertidos?

### Tipografía

5. **Fuente Principal (Sans-serif/Serif):** ¿Qué familia tipográfica define la marca? (Recomendación: Elegir fuentes de Google Fonts o fuentes de sistema para optimizar la carga).
6. **Escala Tipográfica:** ¿La marca prefiere una estética compacta (textos pequeños y densos, estilo dashboard técnico) o espaciosa (textos grandes, mucho respiro, estilo landing page/comercio)?

### Formas y Bordes (Geometría)

7. **Border Radius:** ¿Cómo son las formas de la marca?
   - _Cuadradas/Rígidas_ (0px)
   - _Suavizadas_ (4px - 8px)
   - _Redondeadas/Amigables_ (16px - 9999px)
8. **Sombras y Profundidad (Shadows):** ¿La marca prefiere un diseño plano (Flat design con bordes) o con profundidad (Elevación mediante sombras suaves)?

---

## 2. Brand Específico: Havenova (Decisiones Actuales)

Esta sección documenta las decisiones de diseño tomadas para el brand principal de Havenova, basadas en las respuestas al cuestionario.

### 2.1. Paleta de Colores

- **Color Principal (Primary):** Azul brillante y enérgico.
  - `valor: #0980f6`
- **Color Secundario (Secondary):** Púrpura/Violeta para contraste y acciones complementarias.
  - `valor: hsl(262, 85%, 50%)`
- **Color de Acento (Accent):** Naranja/Dorado para alertas, notificaciones o elementos que requieren atención inmediata.
  - `valor: #edab12`

### 2.2. Temática y Modos

- **Modo Claro (Light Mode):** El fondo principal será un blanco suave, no puro, para reducir la fatiga visual. Se usarán degradados muy sutiles derivados de los colores del brand en superficies grandes para dar un toque moderno y de profundidad.
- **Modo Oscuro (Dark Mode):** Los fondos serán grises muy oscuros con un tinte azulado. Los colores primarios y secundarios se mantendrán vibrantes. Los degradados jugarán un papel más importante para definir las superficies y los contenedores.

### 2.3. Tipografía

- **Encabezados (Headings):** `Trebuchet MS` y fallbacks. Busca un balance entre modernidad y legibilidad.
  - `valor: 'Trebuchet MS', 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, 'Noto Sans', sans-serif`
- **Cuerpo de Texto (Body):** `Segoe UI` y fallbacks. Prioriza la claridad y legibilidad en párrafos largos.
  - `valor: 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, 'Noto Sans', 'Liberation Sans', sans-serif`
- **Escala:** Se busca un equilibrio entre densidad de información y espaciado generoso. Se usará una escala modular que permita jerarquías claras sin sentirse apretada.

### 2.4. Geometría y Profundidad

- **Radios de Borde (Border Radius):** Se opta por un estilo moderno y suavizado, pero no completamente redondeado. Un radio base de `8px` para elementos principales como tarjetas y botones, con variaciones para elementos más pequeños.
- **Sombras (Shadows):** Se usarán sombras suaves y difusas para crear una sensación de profundidad discreta, evitando contornos duros. Se definirán múltiples niveles de elevación.

### 2.5. Componentes y Estrategia de Layout

- **Tarjetas (Cards):** El elemento visual central será la "tarjeta de cristal" (glassmorphism).
  - **Uso General:** Tendrá un fondo con un degradado suave y translúcido, usando tonos neutros o muy desaturados del brand.
  - **Servicios Específicos:** Las tarjetas relacionadas con los dos servicios principales de la empresa usarán degradados más prominentes basados en los colores `--brand-primary` y `--brand-secondary` respectivamente, para diferenciarlos visualmente.
- **Estrategia Mobile First:** El diseño y la implementación de CSS deben priorizar la experiencia en dispositivos móviles. Las vistas en `desktop` serán una mejora progresiva, reorganizando elementos y añadiendo detalles complementarios donde el espacio lo permita.

---

## 3. Arquitectura de Estilos Globales (`global.css`)

Para lograr la reutilización de la lógica sin romper el diseño, utilizaremos un sistema estrictamente basado en **Variables CSS (Custom Properties)** inyectadas en el `:root`.

No se deben utilizar colores "hardcodeados" (ej. `#FF0000`) en los archivos CSS de los componentes (CSS Modules). Todo debe hacer referencia a la paleta del Tenant.

### 3.1. Esqueleto de Variables Core (Modo Claro)

```css
:root {
  /* ==========================================
     1. PALETA DE COLORES (Brand)
     ========================================== */
  --brand-primary: #0980f6;
  --brand-secondary: hsl(262, 85%, 50%);
  --brand-accent: #edab12;

  /* Derivaciones para estados (hover, active) */
  --brand-primary-light: #3a99f7;
  --brand-primary-dark: #0768c5;

  /* ==========================================
     2. SEMÁNTICA DE ESTADOS (Alertas, Feedback)
     ========================================== */
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: var(--brand-accent); /* Reutilizamos el acento para warnings */
  --color-info: #3b82f6;

  /* ==========================================
     3. SUPERFICIES Y FONDOS
     ========================================== */
  --bg-base: #f8fafc; /* Fondo principal del body (blanco suave) */
  --surface-1: #ffffff; /* Tarjetas, modales (base) */
  --surface-2: #f1f5f9; /* Fondos secundarios, hovers */
  --surface-glass: rgba(255, 255, 255, 0.6); /* Color base para efecto cristal */

  /* ==========================================
     4. TEXTOS E ICONOS
     ========================================== */
  --text-main: #0f172a; /* Títulos y texto de alto contraste */
  --text-muted: #64748b; /* Párrafos secundarios, placeholders */
  --text-inverse: #ffffff; /* Texto sobre botones con color primario */

  /* ==========================================
     5. TIPOGRAFÍA
     ========================================== */
  --font-family-body:
    'Segoe UI', 'Helvetica Neue', Helvetica, Arial, 'Noto Sans', 'Liberation Sans', sans-serif;
  --font-family-heading:
    'Trebuchet MS', 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, 'Noto Sans', sans-serif;
  /* TODO: Definir escala tipográfica modular (ej. --font-size-sm, --font-size-md, etc.) */

  /* ==========================================
     6. GEOMETRÍA Y ESPACIADOS
     ========================================== */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Escala de espaciado base (múltiplos de 4px) */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-4: 16px;
  --spacing-6: 24px;
  --spacing-8: 32px;

  /* ==========================================
     7. SOMBRAS Y ELEVACIÓN
     ========================================== */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);

  /* ==========================================
     8. GRADIENTES (Efecto Glass)
     ========================================== */
  --gradient-glass-general: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0)
  );
  /* TODO: Definir gradientes para servicios 1 y 2 */
}
```

---

## 3. Semántica HTML y Accesibilidad (A11y)

La plantilla multitenant debe cumplir con los estándares WCAG. Esto asegura que la UI sea robusta independientemente de los estilos aplicados.

### Reglas de Oro Semánticas

1. **Landmarks:** Toda página debe tener un (y solo un) `<main>`. Los bloques secundarios deben usar `<aside>`, `<section>` o `<article>` según corresponda.
2. **Jerarquía de Encabezados:** No saltar niveles de `<h1>` a `<h6>`. Cada página tiene un único `<h1>`, incluso si está oculto visualmente (`sr-only`) para lectores de pantalla.
3. **Botones vs Enlaces:**
   - Si navega a otra URL: `<a href="...">` (o `<Link>` en Next.js).
   - Si ejecuta una acción en la misma vista (abrir modal, enviar form): `<button type="button">` o `<button type="submit">`.

### Reglas de Accesibilidad

1. **Atributos ARIA Controlados:** Usar `aria-describedby` para asociar textos de ayuda y mensajes de error con sus inputs correspondientes.
2. **Manejo de Foco:** Al abrir modales o mostrar resúmenes de errores (ej. formularios de auth/profile), el foco debe trasladarse automáticamente al elemento relevante.
3. **Contraste Visual:** Las variables de colores (ej. `--brand-primary` vs `--text-inverse`) deben respetar un ratio de contraste mínimo de 4.5:1.

---

## 4. Guía de Internacionalización (i18n) e Idioma

Dado que los textos varían entre clientes y contextos, los archivos JSON de i18n (`en`, `de`, etc.) deben tratarse como parte del **Brand / Voz del cliente**.

### Mejores Prácticas para el Diccionario

1. **No mezclar dominios:** Separar los JSON por contexto (`auth.json`, `profile.json`, `dashboard.json`, `errors.json`).
2. **Nombres de claves descriptivos (Path-based):**
   - ❌ `MAL: "login_button": "Entrar"`
   - ✅ `BIEN: "auth.login.form.submit_button": "Entrar"`
3. **Eliminar variables muertas:** Como se vio en auditorías previas, realizar limpiezas periódicas para evitar tener keys "legacy" (`USER_VERIFY_EMAIL_RESENDED` vs `RESENT`).

---

## 5. Implementación de Componentes

Para que los componentes sean 100% reutilizables en múltiples proyectos:

1. **Separación Contenedor / Presentación:**
   - **Smart Components (Contenedores):** Manejan estado, llaman al contexto (ej. `useAuth`), y hacen fetch de datos.
   - **Dumb Components (Presentación):** Solo reciben `props` (ej. `email`, `onSubmit`, `isLoading`) y devuelven UI. _El CSS pertenece a esta capa._
2. **Clases Utilitarias Limitadas:** Se permite el uso de clases utilitarias (ej. estilos globales o Tailwind si se decide usar) para espaciado (`gap`, `margin`, `padding`), pero la lógica visual compleja debe vivir en archivos `.module.css` usando las variables globales de tenant.

---

## Próximos Pasos Recomendados

1. **Definir la paleta base y variables geométricas** en tu archivo `global.css`.
2. **Refactorizar un componente base** (como `AlertPopup` o los botones de `Auth`) para que dependa 100% de estas variables en lugar de colores o medidas estáticas.
3. **Crear el componente `<Layout>`** general para Auth y Dashboard que defina la estructura de Landmarks (`main`, `header`, `footer`). - **Dumb Components (Presentación):** Solo reciben `props` (ej. `email`, `onSubmit`, `isLoading`) y devuelven UI. _El CSS pertenece a esta capa._
4. **Clases Utilitarias Limitadas:** Se permite el uso de clases utilitarias (ej. estilos globales o Tailwind si se decide usar) para espaciado (`gap`, `margin`, `padding`), pero la lógica visual compleja debe vivir en archivos `.module.css` usando las variables globales de tenant.

---

## Próximos Pasos Recomendados

1. **Definir la paleta base y variables geométricas** en tu archivo `global.css`.
2. **Refactorizar un componente base** (como `AlertPopup` o los botones de `Auth`) para que dependa 100% de estas variables en lugar de colores o medidas estáticas.
3. **Crear el componente `<Layout>`** general para Auth y Dashboard que defina la estructura de Landmarks (`main`, `header`, `footer`).
