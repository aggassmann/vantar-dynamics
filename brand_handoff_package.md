# Paquete de Entrega de Marca (Brand Handoff): VANTAR Dynamics

Este documento contiene todos los activos, especificaciones, códigos vectoriales (SVG) y prompts de inteligencia artificial necesarios para implementar la nueva identidad visual de **VANTAR Dynamics** (estilo **V-Telemetry** minimalista en color amarillo mostaza industrial sobre fondo oscuro). 

Puedes entregar este archivo directamente a Claude o cualquier otro agente de desarrollo para que realice los cambios en tu código de forma 100% fiel.

---

## 🖼️ 1. Mockups e Imágenes de Referencia

Las imágenes de diseño y composición han sido generadas y se encuentran guardadas localmente en tu sistema en las siguientes rutas:

*   **Mockup de Brand Board Principal (V-Telemetry):**
    `file:///C:/Users/Alejandro Guillermo/.gemini/antigravity/brain/20df98fd-ddda-44bb-83e2-bbe5d9d35314/vantar_minimal_brand_board_1781638699257.png`
*   **Placa Comparativa de Variantes:**
    `file:///C:/Users/Alejandro Guillermo/.gemini/antigravity/brain/20df98fd-ddda-44bb-83e2-bbe5d9d35314/vantar_logo_variants_1781638828818.png`
*   **Variante Sobria Estilo Apple:**
    `file:///C:/Users/Alejandro Guillermo/.gemini/antigravity/brain/20df98fd-ddda-44bb-83e2-bbe5d9d35314/vantar_sober_apple_style_1781638959857.png`

### 🤖 Prompts de Generación Utilizados:
> **Prompt del Brand Board (Principal):**
> *`A minimalist, premium brand board presentation for 'Vantar Dynamics'. The background is dark charcoal with a very faint, subtle mustard-yellow kinetic glow and a technical blueprint grid. The layout showcases: 1) A highly minimal isotype that is a geometric 'V' shape (evolving from their original favicon): the left diagonal is a thick, solid white bar; the right diagonal is a thin white line with three warm mustard-yellow circular data nodes; they meet at the bottom at a hollow circular ring (negative space pivot). 2) The full logo text 'Vantar Dynamics' in a robust, technical sans-serif font. 3) Applications of the logo on a dark glassmorphism card (white text, mustard nodes) and a light card (charcoal text, mustard nodes). 4) A clean color swatch block showing dark gray, white, and mustard yellow. Flat geometry, no heavy shadows.`*

---

## 📐 2. Códigos Vectoriales (SVG) de Marca
*Nota: Estos archivos ya han sido creados físicamente en tu carpeta `/assets`.*

### A. Isotipo Aislado (`/assets/isotype.svg`)
El símbolo minimalista de la V de telemetría (izquierda mecánica, derecha sensores, pivote central).
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <!-- Left leg: Solid structural bar -->
  <line x1="22" y1="22" x2="44" y2="64" stroke="currentColor" stroke-width="7" stroke-linecap="round" />
  <!-- Right leg: Telemetry path -->
  <line x1="78" y1="22" x2="56" y2="64" stroke="currentColor" stroke-width="2.5" />
  <!-- Bottom vertex: Hollow circular pivot ring -->
  <circle cx="50" cy="75" r="9" fill="none" stroke="currentColor" stroke-width="2.5" />
  <!-- Telemetry nodes (Mustard Yellow) -->
  <circle cx="78" cy="22" r="5" fill="#D49A17" stroke="currentColor" stroke-width="1.5" />
  <circle cx="67" cy="43" r="5" fill="#D49A17" stroke="currentColor" stroke-width="1.5" />
  <circle cx="56" cy="64" r="5" fill="#D49A17" stroke="currentColor" stroke-width="1.5" />
</svg>
```

### B. Logo Completo para Fondo Oscuro (`/assets/logo-dark.svg`)
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" width="320" height="80">
  <g transform="translate(10, 10) scale(0.6)" stroke="#ffffff" fill="none">
    <line x1="22" y1="22" x2="44" y2="64" stroke-width="7" stroke-linecap="round" />
    <line x1="78" y1="22" x2="56" y2="64" stroke-width="2.5" />
    <circle cx="50" cy="75" r="9" stroke-width="2.5" />
    <circle cx="78" cy="22" r="5" fill="#D49A17" stroke-width="1.5" />
    <circle cx="67" cy="43" r="5" fill="#D49A17" stroke-width="1.5" />
    <circle cx="56" cy="64" r="5" fill="#D49A17" stroke-width="1.5" />
  </g>
  <text x="85" y="38" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="20" fill="#ffffff" letter-spacing="0.05em">VANTAR</text>
  <text x="85" y="58" font-family="'Space Grotesk', sans-serif" font-weight="400" font-size="14" fill="#a1a1a6" letter-spacing="0.18em">DYNAMICS</text>
</svg>
```

### C. Logo Completo para Fondo Claro (`/assets/logo-light.svg`)
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" width="320" height="80">
  <g transform="translate(10, 10) scale(0.6)" stroke="#121214" fill="none">
    <line x1="22" y1="22" x2="44" y2="64" stroke-width="7" stroke-linecap="round" />
    <line x1="78" y1="22" x2="56" y2="64" stroke-width="2.5" />
    <circle cx="50" cy="75" r="9" stroke-width="2.5" />
    <circle cx="78" cy="22" r="5" fill="#D49A17" stroke-width="1.5" />
    <circle cx="67" cy="43" r="5" fill="#D49A17" stroke-width="1.5" />
    <circle cx="56" cy="64" r="5" fill="#D49A17" stroke-width="1.5" />
  </g>
  <text x="85" y="38" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="20" fill="#121214" letter-spacing="0.05em">VANTAR</text>
  <text x="85" y="58" font-family="'Space Grotesk', sans-serif" font-weight="400" font-size="14" fill="#6e6e73" letter-spacing="0.18em">DYNAMICS</text>
</svg>
```

### D. Icono de Aplicación / PWA / Favicon (`/assets/favicon.svg`)
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="64" height="64">
  <rect width="100" height="100" rx="22" fill="#0d0d0f"/>
  <g stroke="#ffffff" fill="none">
    <line x1="22" y1="22" x2="44" y2="64" stroke-width="7" stroke-linecap="round" />
    <line x1="78" y1="22" x2="56" y2="64" stroke-width="2.5" />
    <circle cx="50" cy="75" r="9" stroke-width="2.5" />
    <circle cx="78" cy="22" r="5" fill="#D49A17" stroke-width="1.5" />
    <circle cx="67" cy="43" r="5" fill="#D49A17" stroke-width="1.5" />
    <circle cx="56" cy="64" r="5" fill="#D49A17" stroke-width="1.5" />
  </g>
</svg>
```

---

## 🎨 3. Cambios en la Hoja de Estilos (CSS)

### A. Modificaciones en `/styles/tokens.css`
Reemplazar el bloque de variables `:root` con las siguientes definiciones para establecer la paleta oscura y la tipografía técnica unificada:
```css
:root {
  /* --- Superficies Oscuras --- */
  --cream:        #0d0d0f;       /* Fondo de la web */
  --cream-2:      #151518;       /* Fondo de las tarjetas de cristal */
  --cream-3:      #1f1f23;       /* Botones secundarios y bordes */
  --paper:        #0d0d0f;

  /* --- Textos y Grises --- */
  --ink:          #ffffff;       /* Textos primarios y títulos */
  --ink-soft:     #a1a1a6;       /* Textos secundarios */
  --ink-faint:    #6e6e73;       /* Textos muy apagados o bordes internos */
  --hairline:     rgba(255, 255, 255, 0.08);
  --hairline-2:   rgba(255, 255, 255, 0.15);

  /* --- Acentos Amarillo Mostaza Industrial --- */
  --yellow:       #D49A17;
  --orange:       #D49A17;       /* Fallback para tags de proyectos */
  --orange-warm:  #E5A93C;
  --amber:        #FFCC00;

  /* --- Funcionales --- */
  --good:         #2f9e6f;
  --warn:         #e8a33d;
  --bad:          #e2553b;
  --axis-x:       #ffffff;       /* Ejes del gráfico */
  --axis-y:       #a1a1a6;
  --axis-z:       #D49A17;

  /* --- Glassmorphism --- */
  --glass-bg:     rgba(21, 21, 24, 0.7);
  --glass-bg-2:   rgba(21, 21, 24, 0.85);
  --glass-brd:    rgba(255, 255, 255, 0.08);
  --glass-shadow: 0 12px 40px -10px rgba(0, 0, 0, 0.6),
                  0 2px 8px -4px rgba(0, 0, 0, 0.3);

  /* --- Sin Gradientes Complejos ni Colores Flúor --- */
  --grad-accent:  var(--yellow);
  --grad-text:    #ffffff;

  /* --- Unificación de Tipografía --- */
  --font-serif:   "Space Grotesk", sans-serif; /* Se elimina Fraunces */
  --font-sans:    "Space Grotesk", sans-serif;
  --font-mono:    "Space Grotesk", monospace;
  
  /* Mantener el escalado de espaciado y radios original */
  --s-1: 4px;  --s-2: 8px;  --s-3: 12px; --s-4: 16px;
  --s-5: 24px; --s-6: 32px; --s-7: 48px; --s-8: 64px; --s-9: 96px;
  --r-sm: 10px; --r-md: 16px; --r-lg: 22px; --r-xl: 30px; --r-pill: 999px;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --dur: 280ms;
  --maxw: 560px;
  --nav-h: 72px;
}
```

### B. Modificaciones en `/styles/hero.css`
Reemplazar el bloque `.mesh` por una cuadrícula técnica e insertar la animación del resplandor de fondo mostaza:
```css
/* Rejilla de ingeniería en 2D */
.mesh {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-color: #0d0d0f;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.95;
  pointer-events: none;
}

/* Resplandor cinético mostaza flotante de baja intensidad (5% opacidad) */
.mesh::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 30%, rgba(212, 154, 23, 0.05) 0%, transparent 65%);
  animation: pulseGlow 14s ease-in-out infinite alternate;
}
@keyframes pulseGlow {
  from { opacity: 0.7; transform: scale(1); }
  to { opacity: 1; transform: scale(1.1); }
}
```

### C. Modificaciones en `/styles/components.css`
Alinear componentes interactivos a la nueva visual:
1.  **Botón Primario (`.btn-primary`):** Reemplazar fondo de gradiente por fondo plano amarillo mostaza con texto negro:
    ```css
    .btn-primary {
      color: #0d0d0f;
      background: var(--yellow);
      box-shadow: 0 4px 14px -4px rgba(212, 154, 23, 0.4);
      border: 1px solid var(--yellow);
    }
    .btn-primary:hover {
      background: #b88310;
      border-color: #b88310;
    }
    ```
2.  **Inclinómetro (`.level`):** Adaptar la burbuja para que sea mostaza con sombra amarilla y cambie a verde (`var(--good)`) al centrarse:
    ```css
    .level {
      background: radial-gradient(circle, var(--cream-2), #111113);
      border: 1px solid var(--hairline-2);
      box-shadow: inset 0 4px 18px rgba(0,0,0,0.5);
    }
    .level .bubble {
      background: radial-gradient(circle at 35% 30%, var(--yellow), #9b6c0b);
      box-shadow: 0 6px 16px -4px rgba(212, 154, 23, 0.4);
    }
    .level .bubble.centered {
      background: radial-gradient(circle at 35% 30%, #5fd39c, var(--good));
      box-shadow: 0 6px 16px -4px rgba(47, 158, 111, 0.4);
    }
    ```
3.  **Barra de Navegación Inferior (`.bottomnav`):** Los elementos activos deben pintarse en blanco y los acentos en amarillo mostaza (reemplazar `url(#vd-grad)`):
    ```css
    .navbtn.is-active svg { stroke: var(--yellow); }
    .navbtn.is-active span {
      background: none;
      -webkit-text-fill-color: initial;
      color: var(--ink);
    }
    ```

---

## 🛠️ 4. Cambios en Datos de Portafolio e Interfaces

### A. Modificar las portadas de proyectos en `/src/data/projects.js`
Reemplazar la función `cover` y sus variables para pasar a diagramas blueprint planos en 2D:
```javascript
const cover = (paths) => `
<svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="#151518"/>
  <defs>
    <pattern id="cover-grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.015)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="400" height="200" fill="url(#cover-grid)"/>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">${paths}</g>
</svg>`;
```
Y en el array `PROJECTS`, actualizar cada propiedad `cover`:
1.  **daq-vibration:**
    ```javascript
    cover(`<polyline points="20,150 60,90 100,130 140,60 180,110 220,40 260,120 300,70 340,140 380,100" stroke="#D49A17" stroke-width="2.5"/><line x1="20" y1="170" x2="380" y2="170" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>`)
    ```
2.  **agri-vision:**
    ```javascript
    cover(`<circle cx="120" cy="90" r="26" stroke="#ffffff" stroke-width="2"/><circle cx="200" cy="120" r="20" stroke="#ffffff" stroke-width="2"/><circle cx="270" cy="70" r="30" stroke="#D49A17" stroke-width="2.5"/><rect x="40" y="40" width="320" height="120" rx="10" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>`)
    ```
3.  **cae-harvester:**
    ```javascript
    cover(`<path d="M40,150 L120,60 L200,60 L280,150 Z" stroke="#ffffff" stroke-width="2"/><line x1="120" y1="60" x2="200" y2="150" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/><line x1="200" y1="60" x2="120" y2="150" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/><line x1="40" y1="150" x2="280" y2="150" stroke="#D49A17" stroke-width="2.5"/>`)
    ```
4.  **automation-cell:**
    ```javascript
    cover(`<rect x="40" y="120" width="320" height="20" rx="4" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/><circle cx="90" cy="160" r="14" stroke="#ffffff" stroke-width="2"/><circle cx="170" cy="160" r="14" stroke="#ffffff" stroke-width="2"/><circle cx="250" cy="160" r="14" stroke="#ffffff" stroke-width="2"/><circle cx="330" cy="160" r="14" stroke="#ffffff" stroke-width="2"/><rect x="150" y="50" width="100" height="50" rx="6" stroke="#D49A17" stroke-width="2.5"/>`)
    ```
5.  **telemetry-fleet:**
    ```javascript
    cover(`<circle cx="200" cy="100" r="10" stroke="#D49A17" stroke-width="2.5"/><circle cx="200" cy="100" r="40" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-dasharray="3 3"/><circle cx="200" cy="100" r="70" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/><line x1="200" y1="100" x2="300" y2="50" stroke="#ffffff" stroke-width="2"/><line x1="200" y1="100" x2="120" y2="150" stroke="#ffffff" stroke-width="2"/>`)
    ```
6.  **dynamic-testbench:**
    ```javascript
    cover(`<path d="M20,100 C60,40 100,160 140,100 S220,40 260,100 S340,160 380,100" stroke="#D49A17" stroke-width="2.5"/><line x1="20" y1="100" x2="380" y2="100" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>`)
    ```

### B. Modificar renderizado de gráficos en `/src/lib/chart.js`
Actualizar las constantes de color y sombreado en JS:
*   Línea 9: `const HAIR = "rgba(255,255,255,0.12)";`
*   Línea 64 (líneas del grid): `ctx.strokeStyle = "rgba(255,255,255,0.06)";`
*   Línea 72 (Labels en canvas): `ctx.fillStyle = "#a1a1a6";`
*   Línea 122 (FFT audio/vibración): Reemplazar degradado naranja-púrpura por degradado amarillo mostaza a blanco:
    ```javascript
    grad.addColorStop(0, "#D49A17");
    grad.addColorStop(1, "rgba(255, 255, 255, 0.1)");
    ```
*   Línea 145 (Texto de pico): `ctx.fillStyle = "#ffffff";`

---

## 🧭 5. Integración del "Brand Board" en la App (HTML + JS)

### A. Modificar `/index.html`
1.  **Pestaña de Navegación (Bottom Nav):** Añadir el botón "Marca" en medio de la barra inferior:
    ```html
    <button class="navbtn" data-tab="brand" aria-label="Marca">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="1.8"/>
        <path d="M9 3v18M15 3v18M3 9h18M3 15h18" stroke-dasharray="2 2" stroke-opacity="0.3"/>
        <circle cx="12" cy="12" r="3" fill="currentColor"/>
      </svg>
      <span>Marca</span>
    </button>
    ```
2.  **Sección de Contenido (Views):** Insertar la vista `#view-brand` antes de la sección `#view-contact`:
    ```html
    <!-- ============================ TAB: BRAND BOARD =========================== -->
    <section id="view-brand" class="view" aria-label="Identidad de marca">
      <div class="section" style="margin-top:var(--s-7)">
        <div class="sec-head">
          <span class="eyebrow">Identidad Visual</span>
          <h2>Brand Board Técnico</h2>
          <p class="lead">Manual de identidad interactivo de VANTAR Dynamics.</p>
        </div>

        <!-- Isotipo Interactivo con Retícula conmutable -->
        <div class="card card-pad stack" style="margin-bottom:var(--s-4)">
          <h3>El Isotipo</h3>
          <p class="note">Evolución de la "V" original. Unifica la precisión mecánica (bloque blanco) con los datos del sensor (nodos mostaza) sobre un pivote central.</p>
          
          <div style="position:relative; width:180px; height:180px; margin:var(--s-4) auto; background:#151518; border-radius:var(--r-md); border:1px solid var(--hairline); display:grid; place-items:center;">
            <!-- Grid de fondo conmutable -->
            <div id="brand-grid-lines" class="hidden" style="position:absolute; inset:0; background-image:linear-gradient(rgba(212,154,23,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,154,23,0.1) 1px, transparent 1px); background-size:10px 10px; border-radius:var(--r-md); pointer-events:none;"></div>
            
            <!-- SVG Isotipo en vivo -->
            <div style="width:120px; height:120px;" id="live-isotype-svg">
              <svg viewBox="0 0 100 100" stroke="#ffffff" fill="none">
                <!-- Líneas auxiliares geométricas (Grid conmutable) -->
                <g class="brand-aux hidden" stroke="rgba(212,154,23,0.4)" stroke-width="0.8" stroke-dasharray="2 2">
                  <line x1="50" y1="0" x2="50" y2="100" />
                  <line x1="0" y1="75" x2="100" y2="75" />
                  <circle cx="50" cy="75" r="35" />
                  <circle cx="50" cy="75" r="54" />
                </g>
                <line x1="22" y1="22" x2="44" y2="64" stroke-width="7" stroke-linecap="round" />
                <line x1="78" y1="22" x2="56" y2="64" stroke-width="2.5" />
                <circle cx="50" cy="75" r="9" stroke-width="2.5" />
                <circle cx="78" cy="22" r="5" fill="#D49A17" stroke-width="1.5" />
                <circle cx="67" cy="43" r="5" fill="#D49A17" stroke-width="1.5" />
                <circle cx="56" cy="64" r="5" fill="#D49A17" stroke-width="1.5" />
              </svg>
            </div>
          </div>
          <button class="btn btn-soft btn-sm btn-block" id="btn-toggle-grid">Mostrar retícula técnica</button>
        </div>

        <!-- Paleta de colores interactiva -->
        <div class="card card-pad stack" style="margin-bottom:var(--s-4)">
          <h3>Paleta de Colores</h3>
          <p class="note">Haz clic en cualquier bloque para copiar su código de color al portapapeles.</p>
          <div class="stack" style="gap:var(--s-2)">
            <button class="btn btn-block" data-copy="#0D0D0F" style="background:#0D0D0F; color:#fff; border:1px solid var(--hairline); justify-content:space-between; padding:12px 16px;">
              <span>Fondo (Near Black)</span> <code>#0D0D0F</code>
            </button>
            <button class="btn btn-block" data-copy="#D49A17" style="background:#D49A17; color:#0d0d0f; justify-content:space-between; padding:12px 16px;">
              <span>Mostaza Industrial</span> <code>#D49A17</code>
            </button>
            <button class="btn btn-block" data-copy="#FFFFFF" style="background:#FFFFFF; color:#000; justify-content:space-between; padding:12px 16px;">
              <span>Texto Primario</span> <code>#FFFFFF</code>
            </button>
            <button class="btn btn-block" data-copy="#A1A1A6" style="background:#A1A1A6; color:#000; justify-content:space-between; padding:12px 16px;">
              <span>Gris Secundario</span> <code>#A1A1A6</code>
            </button>
          </div>
          <p class="note center hidden" id="copy-toast" style="color:var(--good); font-weight:600;">¡Código copiado al portapapeles!</p>
        </div>

        <!-- Descarga de Activos -->
        <div class="card card-pad stack">
          <h3>Descargar Activos Vectoriales</h3>
          <p class="note">Exporta los logotipos oficiales en formato SVG directamente desde el navegador.</p>
          <div class="controls">
            <button class="btn btn-primary btn-sm btn-block" id="dl-isotype">Descargar Isotipo</button>
            <button class="btn btn-ghost btn-sm btn-block" id="dl-logo-dark">Descargar Logo Oscuro</button>
          </div>
        </div>
      </div>
    </section>
    ```

### B. Registrar la vista en el router (`/src/app.js`)
1.  Importar el inicializador del manual de marca:
    ```javascript
    import { initBrandTab } from "./ui/brand.js";
    ```
2.  Añadir `brand: "#view-brand"` en el mapeo de vistas `VIEWS`:
    ```javascript
    const VIEWS = { home: "#view-home", tools: "#view-tools", brand: "#view-brand", contact: "#view-contact" };
    ```
3.  Llamar al inicializador en la función `boot()`:
    ```javascript
    step("brandTab", initBrandTab);
    ```

### C. Crear el controlador de interacciones (`/src/ui/brand.js`)
```javascript
// Controlador interactivo de la pestaña Brand Board
export function initBrandTab() {
  const $ = (s) => document.querySelector(s);
  if (!$("#view-brand")) return;

  // 1. Toggle de la retícula técnica del isotipo
  $("#btn-toggle-grid").addEventListener("click", () => {
    const lines = $("#brand-grid-lines");
    const aux = document.querySelectorAll(".brand-aux");
    const isHidden = lines.classList.toggle("hidden");
    
    aux.forEach(el => el.classList.toggle("hidden", isHidden));
    $("#btn-toggle-grid").textContent = isHidden ? "Mostrar retícula técnica" : "Ocultar retícula técnica";
    $("#btn-toggle-grid").classList.toggle("btn-primary", !isHidden);
  });

  // 2. Copiado de colores al portapapeles
  const toast = $("#copy-toast");
  let toastTimer;
  document.querySelectorAll("[data-copy]").forEach(btn => {
    btn.addEventListener("click", () => {
      const color = btn.dataset.copy;
      navigator.clipboard.writeText(color).then(() => {
        toast.textContent = `¡Código ${color} copiado!`;
        toast.classList.remove("hidden");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.add("hidden"), 2000);
      });
    });
  });

  // 3. Descarga dinámica de SVGs
  const triggerDownload = (filename, svgContent) => {
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  $("#dl-isotype").addEventListener("click", () => {
    fetch("./assets/isotype.svg")
      .then(r => r.text())
      .then(svg => triggerDownload("vantar_isotype.svg", svg))
      .catch(() => console.error("Error al descargar isotipo"));
  });

  $("#dl-logo-dark").addEventListener("click", () => {
    fetch("./assets/logo-dark.svg")
      .then(r => r.text())
      .then(svg => triggerDownload("vantar_logo_dark.svg", svg))
      .catch(() => console.error("Error al descargar logotipo"));
  });
}
```
