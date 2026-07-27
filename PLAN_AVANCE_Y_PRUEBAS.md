# VANTAR Dynamics — Plan de avance & pruebas

> Hoja de ruta para seguir avanzando + checklist de QA para validar antes de
> considerar el sitio "listo para mostrar". Marcá los `[ ]` a medida que avances.
> **Sitio en vivo:** https://aggassmann.github.io/vantar-dynamics/

---

## 0. Estado actual (lo que YA está hecho ✅)

- [x] SPA mobile-first, zero-build (HTML + CSS + JS ES modules), desplegada en GitHub Pages (HTTPS).
- [x] Identidad **V-Telemetry** (oscuro + mostaza), logo animado, tipografía Space Grotesk.
- [x] 3 pestañas funcionales: Inicio (portafolio), Toolbox (6 instrumentos), Contacto + pestaña **Marca**.
- [x] 6 instrumentos de sensores con permisos, exportación CSV (acelerómetro) y FFT propia.
- [x] **Responsive** total (móvil/tablet/desktop) con nav inferior ↔ superior.
- [x] **Degradado por capacidad** + sugerencia "usar el celular" en PC.
- [x] PWA instalable + offline + auto-actualización (Service Worker v4).
- [x] Documento de diseño portátil (`VANTAR_DESIGN_SYSTEM.md`).

---

## 1. Lo que falta HACER (priorizado)

### 🔴 P0 — Necesario antes de difundir el sitio

- [ ] **Backend del formulario de contacto** (hoy abre `mailto:`). Pasos:
  - [ ] Elegir proveedor: **Formspree** (recomendado) / EmailJS / endpoint propio.
  - [ ] Crear la cuenta y obtener el ID/endpoint *(lo hacés vos; yo no creo cuentas)*.
  - [ ] Integrar el envío por `fetch` (queda en la misma página, con estado de éxito/error) + honeypot anti-spam + fallback a `mailto:`.
  - [ ] Probar que llega el mail.
- [ ] **Datos reales de contacto** (hoy son placeholders en `src/ui/contact.js`):
  - [ ] LinkedIn real (hoy `https://www.linkedin.com/`).
  - [ ] GitHub real (hoy `https://github.com/`).
  - [ ] WhatsApp real (hoy `https://wa.me/` sin número).
  - [ ] Email real (hoy `contacto@vantardynamics.com`, dominio placeholder).
- [ ] **Portafolio real**: revisar que los 6 proyectos de `src/data/projects.js` reflejen trabajos tuyos reales (títulos, descripciones, specs, años, stack). Hoy son ejemplos plausibles.

### 🟡 P1 — Mejora la calidad / credibilidad

- [ ] **Fotos / renders reales** en los proyectos (hoy son portadas SVG blueprint generativas). Reemplazar el campo `cover` por `<img>` o SVG real.
- [ ] **Texto del Hero / eslogan**: confirmar que el copy te representa.
- [ ] **Accesibilidad**: revisar contraste (mostaza sobre oscuro), foco visible, `aria-label` en íconos, navegación por teclado.
- [ ] **iOS**: probar el flujo de permiso de movimiento (requiere gesto) en un iPhone real.
- [ ] **Lighthouse** (Chrome DevTools): correr auditoría de Performance / Accessibility / Best Practices / SEO y corregir lo que baje de 90.

### 🟢 P2 — Opcionales / a futuro

- [ ] **Dominio propio** (ej. `vantardynamics.com`) apuntando a GitHub Pages (config CNAME).
- [ ] **Analítica** respetuosa de privacidad (Plausible/Umami) — opcional.
- [ ] **QR code** en la tarjeta "Mejor desde tu celular" (hoy solo enlace copiable).
- [ ] **Más idiomas** (ES/EN toggle) si apuntás a clientes internacionales.
- [ ] **Tools de PC** (cámara/Web Serial) — descartadas por ahora, retomables.

---

## 2. Plan de PRUEBAS (QA)

### 2.1 Matriz de dispositivos / navegadores
Probar al menos uno de cada fila:

| Dispositivo | Navegador | Foco principal |
|---|---|---|
| Android (celular) | Chrome | Sensores reales, permisos, CSV |
| iPhone | Safari | Permiso por gesto, sensores, layout |
| Tablet | Chrome/Safari | Breakpoint intermedio (2 col) |
| Notebook/PC | Chrome o Edge | Top nav, degradado, sonómetro por mic |
| PC | Firefox | Layout y fallbacks (sin Web Serial) |

### 2.2 Pruebas por instrumento (en celular)

| Instrumento | Cómo probar | Resultado esperado |
|---|---|---|
| **Acelerómetro** | Iniciar captura → agitar el teléfono | Curvas X/Y/Z se mueven; Hz > 0; "Exportar CSV" descarga archivo con timestamps |
| **Vibraciones** | Apoyar sobre algo que vibre (motor/parlante) | Espectro reacciona; muestra "pico ≈ X Hz" |
| **Magnetómetro** | Acercar un objeto metálico/imán | µT sube; marca "anomalía" fuera de 25–65 µT |
| **Luxómetro** | Tapar y luego iluminar el sensor | lx cambia; etiqueta de zona se actualiza (o fallback si no soportado) |
| **Sonómetro** | Activar micrófono → silbar/hablar | dB sube; espectro de audio se mueve; "pico" de frecuencia |
| **Inclinómetro** | Apoyar en mesa; inclinar; "Calibrar a 0" | Burbuja se mueve; verde al nivelar (±0.8°); ángulos correctos |
| **Diagnóstico** | "Probar movimiento" + mover | Contador de eventos sube; muestra valores crudos |

### 2.3 Permisos
- [ ] **Android Chrome**: al iniciar un sensor de movimiento, grafica sin trabarse.
- [ ] **iOS Safari**: aparece el diálogo de intención → permitir → funciona.
- [ ] **Permiso denegado**: muestra mensaje claro + cómo habilitarlo (Config. del sitio).
- [ ] **HTTP / inseguro**: muestra "Requiere HTTPS" (no rompe).
- [ ] **Navegador in-app** (abrir link desde Instagram/WhatsApp): el aviso sugiere abrir en Chrome.

### 2.4 Responsive (mismo contenido, distintos anchos)
Probar en ~360, 375, 414, 768, 1024, 1280, 1440 px:
- [ ] **< 1024px**: bottom nav visible, top nav oculta, hero 1 columna.
- [ ] **≥ 1024px**: top nav sticky visible, bottom nav oculta, hero 2 columnas, grillas 3 columnas, ancho ~1120px.
- [ ] **Modales**: hoja inferior en móvil, diálogo centrado en desktop.
- [ ] Sin scroll horizontal en ningún ancho.

### 2.5 Navegación
- [ ] Bottom nav: las 4 pestañas cambian de vista y marcan activo.
- [ ] Top nav (desktop): idem + estado activo en mostaza.
- [ ] Botones del Hero ("Abrir Toolbox" / "Contacto") navegan.
- [ ] Proyecto → modal abre con specs, cierra con ✕ / scrim / Escape.
- [ ] Herramienta → "Toolbox" (back) vuelve a la grilla y **detiene el sensor**.

### 2.6 Degradado por capacidad
- [ ] En **PC**: instrumentos de movimiento/magnetómetro/luz **atenuados** con "Mejor en celular"; aparece la tarjeta "Mejor desde tu celular" con enlace copiable.
- [ ] En **PC**: el **sonómetro NO** está atenuado (usa micrófono).
- [ ] En **celular**: nada atenuado, sin banner.

### 2.7 Pestaña Marca
- [ ] "Mostrar/Ocultar retícula técnica" alterna la grilla y las líneas guía.
- [ ] Tocar un color copia el HEX (muestra confirmación).
- [ ] "Descargar Isotipo" / "Descargar Logo Oscuro" bajan los SVG.

### 2.8 PWA / offline
- [ ] Se puede **instalar** (Agregar a pantalla de inicio).
- [ ] Con datos cargados una vez, **funciona offline** (modo avión).
- [ ] Al publicar una versión nueva, la PWA **se auto-actualiza** al reabrir.
- [ ] Barra del navegador toma el color oscuro (`theme-color #0d0d0f`).

### 2.9 Transversales
- [ ] **Consola sin errores** en cada pantalla (DevTools → Console).
- [ ] **Animaciones fluidas** (logo, gráficos) sin trabar la UI.
- [ ] **`prefers-reduced-motion`**: con animaciones reducidas en el SO, el logo queda estático.
- [ ] **Deploy**: todos los assets responden 200 (sin 404). El `.nojekyll` mantiene servible la carpeta `src/`.
- [ ] **Formulario** (hasta tener backend): abre el cliente de mail con el mensaje pre-cargado.

---

## 3. Definiciones pendientes (decisiones tuyas)
1. **Proveedor del formulario**: ¿Formspree, EmailJS o endpoint propio?
2. **Datos de contacto reales** (LinkedIn, GitHub, WhatsApp, email).
3. **¿Dominio propio** o seguimos con `aggassmann.github.io/vantar-dynamics`?
4. **¿Fotos reales** de proyectos disponibles, o seguimos con portadas blueprint?

---

## 4. Sugerencia de orden para avanzar
1. Cargar **datos reales** de contacto y portafolio (rápido, alto impacto).
2. **Backend del formulario** (P0).
3. Ronda de **pruebas** sección 2 en celular + PC.
4. **Lighthouse** + accesibilidad.
5. (Opcional) dominio propio, fotos reales, analítica.

---

*VANTAR Dynamics · Plan de avance & QA · actualizá los checks a medida que progreses.*
