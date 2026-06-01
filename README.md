<div align="center">

# VANTAR Dynamics

**Portafolio de ingeniería avanzada + Toolbox técnico de sensores web.**
Mobile-first · Zero-build · Web APIs nativas · Sin frameworks.

`Análisis dinámico` · `Mecatrónica` · `AgTech` · `Visión artificial`

</div>

---

## ✨ Qué es

VANTAR Dynamics es una **SPA mobile-first** que funciona a la vez como landing/portafolio de ingeniería y como un **toolbox de instrumentación** que aprovecha los sensores del celular mediante Web APIs nativas (`DeviceMotionEvent`, `DeviceOrientationEvent`, `AudioContext`, Generic Sensor API).

Está construida **sin build system**: HTML5 + CSS propio + JavaScript ES Modules. Se sirve como sitio estático y corre directo en el navegador, lo que garantiza la **máxima tasa de refresco** para la adquisición de sensores y un despliegue trivial en GitHub Pages (con el HTTPS que los sensores requieren).

## 🧭 Estructura (3 pestañas)

1. **Inicio / Showcase** — Hero con degradado mesh cinético, grid de proyectos reales y modales de detalle técnico.
2. **Toolbox de ingeniería** — 6 instrumentos en vivo:
   | Instrumento | API usada | Salida |
   |---|---|---|
   | Acelerómetro lineal | `DeviceMotionEvent` | Gráfico X/Y/Z + **export CSV** |
   | Analizador de vibraciones | `DeviceMotionEvent` + FFT propia | Espectro de frecuencia |
   | Magnetómetro | `Magnetometer` (Generic Sensor) | µT + detección de anomalías |
   | Luxómetro | `AmbientLightSensor` | lux + zona |
   | Sonómetro & espectro | `getUserMedia` + `AudioContext` | dBFS + FFT de audio |
   | Nivel / Inclinómetro | `DeviceOrientationEvent` | Burbuja + ángulos |
3. **Contacto** — Formulario premium (vía `mailto:`) + redes profesionales.

## 🎨 Diseño

- Base cremosa (`#faf8f5`), acentos naranja↔púrpura en degradado cinético difuminado.
- Tipografía **serif editorial** (Fraunces) para titulares + **sans geométrica** (Space Grotesk) para UI y lecturas numéricas.
- Tarjetas con glassmorphism sutil, bottom navigation flotante estilo app nativa, mucho espacio en blanco.
- 100% responsivo, optimizado para uso táctil y `prefers-reduced-motion`.

## 📁 Estructura de archivos

```
index.html              SPA shell + bottom nav
manifest.webmanifest    PWA (instalable)
sw.js                   Service worker (offline)
styles/                 tokens · base · hero · components
src/
  app.js                Router + registro de tools + SW
  data/projects.js      Datos del portafolio
  ui/                   portfolio · contact · permissions
  lib/                  chart (canvas) · fft (radix-2) · csv
  tools/                accelerometer · vibration · magnetometer
                        luxmeter · soundmeter · inclinometer
```

## 🚀 Ejecución local

Los sensores requieren un **contexto seguro** (HTTPS o `localhost`). Servir como estático:

```bash
# Python
python -m http.server 8080
# o Node
npx serve .
```

Luego abrir `http://localhost:8080`. Para probar sensores de movimiento en un celular, usá HTTPS (p. ej. GitHub Pages o un túnel tipo `ngrok`/`cloudflared`).

## 🌐 Despliegue en GitHub Pages

```bash
git push -u origin main
# En GitHub: Settings → Pages → Source: main / root
```

El sitio quedará en `https://<usuario>.github.io/vantar-dynamics/` con HTTPS — listo para que los sensores funcionen en el celular.

## 🔐 Permisos y privacidad

- En **iOS**, los sensores de movimiento exigen un gesto explícito del usuario; la app muestra un diálogo de intención antes de solicitarlos.
- El **micrófono** se procesa en tiempo real y **no se graba ni se transmite**.
- Todo el procesamiento (FFT, filtrado de gravedad, etc.) ocurre **localmente** en el dispositivo.

## 🧪 Compatibilidad

| API | Estado |
|---|---|
| DeviceMotion / Orientation | iOS (con gesto) · Android Chrome/Firefox |
| getUserMedia + AudioContext | Amplio (HTTPS) |
| Magnetometer / AmbientLight | Chrome Android (puede requerir flags); fallback elegante en el resto |

## 📄 Licencia

MIT © 2026 VANTAR Dynamics.
