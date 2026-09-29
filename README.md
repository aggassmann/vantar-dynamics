# VANTAR Dynamics — sitio web

**Ingeniería del movimiento.** Sitio de VANTAR Dynamics: consultoría de ingeniería (instrumentación,
vibraciones, simulación CAE, ingeniería de producto), productos propios en desarrollo (BalanSense y
VibraSense) y un Toolbox que mide con los sensores del celular.

SPA sin build (HTML + CSS + JavaScript con módulos ES), PWA instalable y con modo offline. Identidad visual
V-Telemetry **v2.0 definitiva**: fuente de verdad en `../IdentidadVisual/`.

## Estructura

```
index.html              Portada, Quiénes somos, Servicios, Productos, Toolbox, Contacto
styles/                 tokens · base · hero · components · responsive
src/app.js              Router con transición de página, registro de instrumentos, service worker
src/ui/estela.js        Estela mostaza que sigue el scroll con inercia
src/ui/                 contacto, marca, permisos, modal
src/tools/              acelerómetro, vibraciones (FFT), magnetómetro, luxómetro, sonómetro, inclinómetro
src/lib/                gráficos en canvas, FFT, CSV, detección de capacidades
assets/                 logos v2.0 del kit, favicon, imagen para compartir
```

## Diseño

- Portada centrada: isotipo animado, nombre, eslogan, "Hecho en Argentina" e invitación a contactar.
- Navegación flotante: abajo en el celular (con íconos) y arriba en computadora. En las páginas internas
  suma el isotipo animado para volver al inicio.
- Fondo: retícula técnica limitada a la franja del contenido, con bordes difusos y grano anti-bandas;
  estela mostaza detrás del logo que acompaña el scroll.
- Cambio de página en dos tiempos (sale suave, entra frenando). Todo respeta `prefers-reduced-motion`.

## Ejecución local

Los sensores requieren HTTPS o `localhost`:

```bash
python -m http.server 8080
```

y abrir `http://localhost:8080`.

## Publicación

Se publica en GitHub Pages desde `main` (`git push`). **Todavía no se publica:** la decisión es lanzar
cuando estén listos 6 meses de contenido para redes. Dominio previsto: `vantardynamics.com`
(ver [`GUIA-DOMINIO.md`](GUIA-DOMINIO.md)).

Al publicar una versión nueva, subir el número de `CACHE` en `sw.js` para que la PWA se actualice sola.
