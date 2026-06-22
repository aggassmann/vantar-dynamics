# VANTAR Dynamics — Design System & Brand Handoff

> **Propósito:** documento autocontenido para trasladar la identidad **V-Telemetry**
> (estética técnica oscura + acento mostaza industrial) a **cualquier otro proyecto**.
> Es framework-agnóstico: todo son **CSS custom properties + CSS plano + SVG**.
> Al final hay notas para adaptarlo a **Tailwind** o **React**.

Podés entregar este archivo directamente a otro desarrollador o agente de IA.

---

## 0. Esencia de marca

- **Concepto:** instrumentación de ingeniería. "La estructura mecánica + los datos del sensor."
- **Tono visual:** técnico, sobrio, premium. Fondo casi negro, grilla blueprint sutil, **un solo acento** (mostaza industrial). Sin gradientes flúor, sin saturación.
- **Tipografía:** una sola familia geométrica técnica (**Space Grotesk**) para todo.
- **Regla de oro:** mucho negro, blanco para jerarquía, **mostaza solo para acentos** (1 dato clave por pantalla, botón primario, estado activo, nodos del logo).

---

## 1. Tokens de color (copiá tal cual)

```css
:root {
  /* Superficies oscuras */
  --cream:      #0d0d0f;   /* fondo de la página */
  --cream-2:    #151518;   /* base de tarjetas glass */
  --cream-3:    #1f1f23;   /* botones secundarios / bordes */
  --paper:      #0d0d0f;

  /* Texto y grises */
  --ink:        #ffffff;   /* títulos y texto primario */
  --ink-soft:   #a1a1a6;   /* texto secundario */
  --ink-faint:  #6e6e73;   /* texto apagado / bordes internos */
  --hairline:   rgba(255, 255, 255, 0.08);
  --hairline-2: rgba(255, 255, 255, 0.15);

  /* Acento mostaza industrial (ÚNICO color de marca) */
  --yellow:      #D49A17;
  --orange-warm: #E5A93C;  /* hover/realce del mostaza */
  --amber:       #FFCC00;  /* énfasis puntual */
  --yellow-deep: #9b6c0b;  /* sombras del mostaza */
  --yellow-hover:#b88310;  /* hover del botón primario */

  /* Funcionales */
  --good: #2f9e6f;
  --warn: #e8a33d;
  --bad:  #e2553b;

  /* Ejes de gráficos (datos) */
  --axis-x: #ffffff;
  --axis-y: #a1a1a6;
  --axis-z: #D49A17;

  /* Glassmorphism oscuro */
  --glass-bg:     rgba(21, 21, 24, 0.7);
  --glass-bg-2:   rgba(21, 21, 24, 0.85);
  --glass-brd:    rgba(255, 255, 255, 0.08);
  --glass-shadow: 0 12px 40px -10px rgba(0, 0, 0, 0.6),
                  0 2px 8px -4px rgba(0, 0, 0, 0.3);
}
```

| Rol | HEX | Uso |
|---|---|---|
| Fondo | `#0D0D0F` | Página entera |
| Superficie | `#151518` | Tarjetas, paneles |
| Borde/btn 2º | `#1F1F23` | Botones soft, divisores |
| Texto primario | `#FFFFFF` | Títulos, valores |
| Texto 2º | `#A1A1A6` | Párrafos, labels |
| Texto apagado | `#6E6E73` | Hints, captions |
| **Acento** | **`#D49A17`** | Botón primario, activo, 1 dato clave, nodos del logo |

---

## 2. Tipografía

**Única familia:** `Space Grotesk` (Google Fonts). Pesos: 400, 500, 600, 700.

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

```css
:root {
  --font-sans:  "Space Grotesk", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  --font-mono:  "Space Grotesk", ui-monospace, "SF Mono", "Roboto Mono", monospace;
  /* En este sistema serif === sans (identidad unificada) */
  --font-serif: var(--font-sans);
}
```

**Escala (mobile-first, fluida):**

| Rol | CSS | Notas |
|---|---|---|
| Display / Hero | `clamp(2.7rem, 13vw, 4.1rem)` · 600 · `letter-spacing:-0.02em` · `line-height:1.02` | desktop sube a `clamp(3rem,5vw,4.6rem)` |
| H2 | `clamp(1.7rem, 6.5vw, 2.2rem)` · 600 | |
| H3 | `1.18rem` · 600 | |
| Eyebrow | `0.72rem` · 600 · `letter-spacing:0.22em` · `text-transform:uppercase` · color `--ink-faint` | |
| Body / lead | `1rem`–`1.02rem` · 400 · `line-height:1.6` · color `--ink-soft` | |
| Lecturas numéricas | `--font-mono` · `font-variant-numeric: tabular-nums` | gauges, valores |

---

## 3. Sistema de logo

El isotipo es una **"V" de telemetría**: pierna izquierda = barra estructural blanca sólida; pierna derecha = trazo fino con 3 **nodos mostaza** (datos); vértice inferior = **anillo hueco** (pivote). Usa `currentColor` en los trazos → cambia con el color del contenedor.

### 3.1 Isotipo aislado (`isotype.svg`)
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <line x1="22" y1="22" x2="44" y2="64" stroke="currentColor" stroke-width="7" stroke-linecap="round" />
  <line x1="78" y1="22" x2="56" y2="64" stroke="currentColor" stroke-width="2.5" />
  <circle cx="50" cy="75" r="9" fill="none" stroke="currentColor" stroke-width="2.5" />
  <circle cx="78" cy="22" r="5" fill="#D49A17" stroke="currentColor" stroke-width="1.5" />
  <circle cx="67" cy="43" r="5" fill="#D49A17" stroke="currentColor" stroke-width="1.5" />
  <circle cx="56" cy="64" r="5" fill="#D49A17" stroke="currentColor" stroke-width="1.5" />
</svg>
```

### 3.2 Logo completo, fondo oscuro (`logo-dark.svg`)
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

### 3.3 Logo completo, fondo claro (`logo-light.svg`)
Igual al anterior pero `stroke="#121214"`, texto `VANTAR` en `#121214` y `DYNAMICS` en `#6e6e73`. Los nodos siguen mostaza `#D49A17`.

### 3.4 Favicon / PWA (`favicon.svg`)
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

### 3.5 Logo **animado** (entrada de trazado → pulso sutil)

Concepto: al cargar, el logo **se dibuja solo**; luego entra en **pulso lento**. La barra izquierda + el anillo laten **sincronizados** (un solo cuerpo estructural); los 3 nodos mostaza **fluyen en secuencia** hacia el pivote. Respeta `prefers-reduced-motion`.

**Markup** (clases en cada parte):
```html
<div class="iso" aria-hidden="true">
  <svg viewBox="0 0 100 100" stroke="#ffffff" fill="none">
    <g class="vd-structure">
      <line x1="22" y1="22" x2="44" y2="64" stroke-width="7" stroke-linecap="round" />
      <circle cx="50" cy="75" r="9" stroke-width="2.5" />
    </g>
    <line class="vd-line" x1="78" y1="22" x2="56" y2="64" stroke-width="2.5" />
    <circle class="vd-node vd-n1" cx="78" cy="22" r="5" fill="#D49A17" stroke="none" />
    <circle class="vd-node vd-n2" cx="67" cy="43" r="5" fill="#D49A17" stroke="none" />
    <circle class="vd-node vd-n3" cx="56" cy="64" r="5" fill="#D49A17" stroke="none" />
  </svg>
</div>
```

**CSS:**
```css
.iso { width: 120px; height: 120px; }
.iso svg { width: 100%; height: 100%; }

@keyframes vd-draw   { from { stroke-dashoffset: 120; } to { stroke-dashoffset: 0; } }
@keyframes vd-struct { 0%, 100% { opacity: 1; } 50% { opacity: 0.72; } }
@keyframes vd-nodein { from { opacity: 0; } to { opacity: 1; } }
@keyframes vd-flow   { 0%, 100% { opacity: 0.5; r: 4.5; } 50% { opacity: 1; r: 5.5; } }

.iso .vd-structure {
  stroke-dasharray: 120;
  animation: vd-draw 1.5s ease-out forwards,
             vd-struct 3.4s ease-in-out 1.8s infinite;
}
.iso .vd-line { stroke-dasharray: 120; animation: vd-draw 1.5s ease-out forwards; }
.iso .vd-node { opacity: 0; }
.iso .vd-n1 { animation: vd-nodein .5s ease 1.2s forwards, vd-flow 3.4s ease-in-out 1.9s infinite; }
.iso .vd-n2 { animation: vd-nodein .5s ease 1.35s forwards, vd-flow 3.4s ease-in-out 2.2s infinite; }
.iso .vd-n3 { animation: vd-nodein .5s ease 1.5s forwards, vd-flow 3.4s ease-in-out 2.5s infinite; }

@media (prefers-reduced-motion: reduce) {
  .iso .vd-structure, .iso .vd-line, .iso .vd-node,
  .iso .vd-n1, .iso .vd-n2, .iso .vd-n3 {
    animation: none; stroke-dasharray: none; opacity: 1;
  }
}
```

### 3.6 Reglas de uso del logo
- **Área de protección:** dejar al menos el ancho de un nodo (≈ 5% del isotipo) alrededor.
- **Tamaño mínimo legible:** isotipo 24px; lockup completo 120px de ancho.
- **Nodos siempre mostaza** `#D49A17`, en cualquier fondo. Trazos = blanco (oscuro) o `#121214` (claro).
- No rotar, no rellenar el anillo, no recolorear los nodos.

---

## 4. Espaciado, radios y movimiento

```css
:root {
  /* Espaciado (escala ~8pt) */
  --s-1: 4px;  --s-2: 8px;  --s-3: 12px; --s-4: 16px;
  --s-5: 24px; --s-6: 32px; --s-7: 48px; --s-8: 64px; --s-9: 96px;

  /* Radios */
  --r-sm: 10px; --r-md: 16px; --r-lg: 22px; --r-xl: 30px; --r-pill: 999px;

  /* Movimiento */
  --ease:     cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in:  cubic-bezier(0.4, 0, 1, 1);
  --dur-fast: 160ms; --dur: 280ms; --dur-slow: 520ms;
}
@media (prefers-reduced-motion: reduce) {
  :root { --dur-fast: 0ms; --dur: 0ms; --dur-slow: 0ms; }
}
```

---

## 5. Fondo blueprint + glow (sello de la marca)

```css
.mesh {                       /* grilla técnica de ingeniería */
  position: absolute; inset: 0; z-index: -1;
  background-color: #0d0d0f;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 24px 24px;
}
.mesh::before {               /* glow mostaza flotante, muy tenue */
  content: ""; position: absolute; inset: 0;
  background: radial-gradient(circle at 50% 28%, rgba(212,154,23,0.06) 0%, transparent 62%);
  animation: pulseGlow 14s ease-in-out infinite alternate;
}
@keyframes pulseGlow { from { opacity: .7; transform: scale(1); } to { opacity: 1; transform: scale(1.1); } }
```
Para portadas/tarjetas, el mismo patrón con `<pattern>` SVG y líneas blancas + **una** línea de acento mostaza.

---

## 6. Componentes

### 6.1 Botones
```css
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--s-2);
  padding: 13px 22px; border-radius: var(--r-pill);
  font-weight: 600; font-size: 0.92rem; white-space: nowrap; user-select: none;
  transition: transform var(--dur-fast) var(--ease), background var(--dur) var(--ease);
}
.btn:active { transform: scale(0.96); }
.btn:disabled { opacity: 0.45; pointer-events: none; }

.btn-primary {                /* acento: fondo mostaza, texto negro */
  color: #0d0d0f; background: var(--yellow); border: 1px solid var(--yellow);
  box-shadow: 0 4px 14px -4px rgba(212,154,23,0.4);
}
.btn-primary:hover { background: #b88310; border-color: #b88310; }

.btn-ghost {                  /* secundario: glass */
  color: var(--ink); background: var(--glass-bg-2); border: 1px solid var(--hairline-2);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
}
.btn-soft  { color: var(--ink); background: var(--cream-3); border: 1px solid var(--hairline); }
.btn-sm    { padding: 9px 16px; font-size: 0.82rem; }
.btn-block { width: 100%; }
```

### 6.2 Tarjeta glass
```css
.card {
  position: relative; background: var(--glass-bg);
  border: 1px solid var(--glass-brd); border-radius: var(--r-lg);
  box-shadow: var(--glass-shadow);
  backdrop-filter: blur(16px) saturate(120%); -webkit-backdrop-filter: blur(16px) saturate(120%);
  overflow: hidden;
}
.card-pad { padding: var(--s-5); }
```

### 6.3 Badge / chip
```css
.badge {                      /* pill glass */
  font-size: 0.72rem; font-weight: 500; padding: 6px 12px; border-radius: var(--r-pill);
  background: var(--glass-bg-2); border: 1px solid var(--glass-brd); color: var(--ink-soft);
}
.chip {                       /* sólido sutil */
  font-size: 0.72rem; padding: 5px 11px; border-radius: var(--r-pill);
  background: var(--cream-2); border: 1px solid var(--hairline); color: var(--ink-soft);
}
.badge-accent {               /* acento mostaza translúcido */
  background: rgba(212,154,23,0.14); color: var(--yellow); border: 1px solid rgba(212,154,23,0.3);
}
```

### 6.4 Status pill (con punto pulsante)
```css
.status { display:inline-flex; align-items:center; gap:7px; font-size:.74rem; font-weight:600;
  color: var(--ink-soft); padding:5px 12px; border-radius:999px;
  background: var(--cream-2); border:1px solid var(--hairline); }
.status .dot { width:8px; height:8px; border-radius:50%; background: var(--ink-faint); }
.status.live .dot { background: var(--bad); animation: pulse 1.2s ease-in-out infinite; }
.status.ok   .dot { background: var(--good); }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
```

### 6.5 Readout numérico (gauge)
```css
.readout { background: var(--cream-2); border:1px solid var(--hairline);
  border-radius: var(--r-md); padding: var(--s-3); text-align:center; }
.readout .lbl { font-size:.64rem; letter-spacing:.12em; text-transform:uppercase; color: var(--ink-faint); }
.readout .val { font-family: var(--font-mono); font-size:1.3rem; font-weight:600; font-variant-numeric: tabular-nums; }
/* Resaltar UN dato en mostaza: */
.readout.accent .val { color: var(--yellow); }
```

### 6.6 Iconografía
- Iconos **de trazo** (line), `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width` 1.7–1.8, `stroke-linecap/linejoin="round"`.
- Heredan color del contenedor; en estado activo, `stroke: var(--yellow)`.

---

## 7. Navegación responsive

Patrón **dual** según dispositivo:

- **Móvil/tablet (`< 1024px`):** barra inferior flotante (bottom nav) tipo app nativa.
- **Desktop (`≥ 1024px`):** barra superior sticky (top nav) con logo + links; la bottom nav se oculta.

```css
/* Bottom nav (móvil) */
.bottomnav { position: fixed; left:50%; bottom: calc(16px + env(safe-area-inset-bottom));
  transform: translateX(-50%); z-index:50; width: min(calc(100% - 32px), 536px); height:72px;
  display:grid; grid-auto-flow:column; align-items:center;
  background: var(--glass-bg-2); border:1px solid var(--glass-brd); border-radius:999px;
  box-shadow: var(--glass-shadow); backdrop-filter: blur(22px) saturate(130%); }
.navbtn { display:flex; flex-direction:column; align-items:center; gap:3px; color: var(--ink-faint); }
.navbtn.is-active { color: var(--ink); }
.navbtn.is-active svg { stroke: var(--yellow); }

/* Top nav (desktop) */
.topnav { display:none; }
@media (min-width:1024px){
  .bottomnav { display:none; }
  .topnav { display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:40;
    padding: 16px 32px; background: var(--glass-bg-2); border-bottom:1px solid var(--glass-brd);
    backdrop-filter: blur(18px) saturate(130%); }
  .topnav-links button { padding:9px 16px; border-radius:999px; font-weight:600; color: var(--ink-soft); }
  .topnav-links button:hover { color: var(--ink); background: var(--cream-3); }
  .topnav-links button.is-active { color:#0d0d0f; background: var(--yellow); }
}
```

**Breakpoints del sistema:**

| Nombre | Rango | Layout |
|---|---|---|
| Móvil | `< 700px` | columna `max-width: 560px`, bottom nav, grillas 1 col |
| Tablet | `700–1023px` | columna `720px`, grillas 2 col |
| Desktop | `≥ 1024px` | ancho `1120px`, top nav, hero 2 col, grillas 3 col, modales centrados |

---

## 8. Modal / bottom-sheet
- **Móvil:** hoja inferior (`border-radius` arriba, sube desde abajo, grip visible).
- **Desktop:** diálogo centrado (`max-width:640px`, `border-radius: var(--r-xl)`, sin grip).
- Scrim: `rgba(13,13,15,0.5)` + `backdrop-filter: blur(3px)`.

---

## 9. Patrón de degradación por capacidad (opcional, para apps con sensores)
Detectá **features reales**, no user-agent. Para sensores de movimiento, inferí "móvil real" por perfil de puntero (`(pointer: coarse)` / `maxTouchPoints`), porque `DeviceMotionEvent` existe igual en desktop. En dispositivos sin un sensor, mostrá la función **atenuada** con motivo y un camino alternativo (ej. "Mejor desde el celular").

---

## 10. Quick-start (otro proyecto, sin build)

`<head>` mínimo:
```html
<meta name="theme-color" content="#0d0d0f" />
<meta name="color-scheme" content="dark" />
<link rel="icon" type="image/svg+xml" href="./favicon.svg" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
```
`body` base:
```css
body { background: var(--cream); color: var(--ink); font-family: var(--font-sans);
  line-height: 1.5; -webkit-font-smoothing: antialiased; }
```
Orden de hojas: **tokens → base → componentes → responsive**.

---

## 11. Adaptación a otros stacks

**Tailwind** (`tailwind.config.js`):
```js
theme: {
  extend: {
    colors: {
      bg: '#0d0d0f', surface: '#151518', line: '#1f1f23',
      ink: '#ffffff', 'ink-soft': '#a1a1a6', 'ink-faint': '#6e6e73',
      mustard: { DEFAULT: '#D49A17', warm: '#E5A93C', deep: '#9b6c0b', hover: '#b88310' },
    },
    fontFamily: { sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'] },
    borderRadius: { sm:'10px', md:'16px', lg:'22px', xl:'30px' },
  }
}
```
Mantené el **fondo blueprint**, el **glow mostaza tenue** y el **logo animado** como utilidades/CSS plano (no hay equivalente directo en utilidades).

**React:** envolvé el SVG animado en un componente `<Isotype animated />` y las clases `vd-*` en un CSS module. Los tokens van como CSS variables en `:root` (no hardcodear HEX en JSX).

---

## 12. Checklist de fidelidad
- [ ] Fondo `#0D0D0F`, superficies `#151518`, **un solo** acento `#D49A17`.
- [ ] Space Grotesk en todo; números con `tabular-nums`.
- [ ] Grilla blueprint 24px + glow mostaza tenue en el hero.
- [ ] Logo: trazos blancos, **nodos mostaza**, anillo hueco; animación entrada+pulso con `prefers-reduced-motion`.
- [ ] Botón primario = mostaza con texto negro. Activo de nav = mostaza.
- [ ] Glassmorphism oscuro (blur + borde `rgba(255,255,255,0.08)`).
- [ ] Nav dual: bottom (móvil) ↔ top (desktop ≥1024px).
- [ ] Mostaza reservado para acentos (no fondos grandes, no texto largo).

---

*VANTAR Dynamics — V-Telemetry · © 2026. Documento de diseño portátil.*
