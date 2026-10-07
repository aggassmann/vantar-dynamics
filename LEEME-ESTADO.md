# Estado del sitio (7 de octubre de 2026)

**Publicado** en https://vantardynamics.com (GitHub Pages, rama `main`; cada `git push` publica en 1–2 minutos).
**Lanzamiento oficial:** domingo 1 de noviembre de 2026 (plan en `C:\Desarrollo\Vantar\Proyectos\Lanzamiento`).

## Hecho
- Portada, Quiénes somos, Servicios, Productos (BalanSense y VibraSense, con «Pedí una demostración»), Toolbox y Contacto.
- Dominio propio con HTTPS, mail contacto@vantardynamics.com, formulario por Formspree, WhatsApp, redes.
- Para Google: dirección canónica, imagen al compartir, datos de la empresa, `robots.txt` y `sitemap.xml`.
- Estadísticas listas para activar en `src/ui/datos.js` (`ESTADISTICAS`): Cloudflare Web Analytics y Microsoft Clarity,
  con eventos `toolbox-<herramienta>`, `demo-balansense`, `demo-vibrasense` y `consulta-enviada`.

- Toolbox v5 (7/10): Vibraciones (mm/s y espectro), Sonido, Nivel e inclinación y Movimiento (1 min, giróscopo),
  con calidad de la medición, límite de 3 por instrumento cada 30 días (en el navegador), informe por mail y
  «Consultar con un especialista» que abre Contacto con la medición escrita. Código en `src/toolbox/`.
  Informe por mail: script de Google en `C:\Desarrollo\Vantar\Proyectos\Lanzamiento\informe-toolbox`
  (dirección en `src/ui/datos.js` → `TOOLBOX.informeUrl`). Sin script, el pedido llega por Formspree.
- Política de seguridad (CSP) en `index.html`: si se suma un servicio externo, agregarlo ahí.

## Falta para el 1/11
1. Códigos de las estadísticas (los pasa Alejandro; guía en Proyectos/Lanzamiento/GUIA-ESTADISTICAS.md).
2. Activar el script del informe por mail (guía GUIA-INFORME-MAIL.md) y pegar la dirección en `TOOLBOX.informeUrl`.
3. Fotos reales de BalanSense y VibraSense.
4. Número de WhatsApp Business definitivo.

Al cambiar archivos, subir la versión de `CACHE` en `sw.js` para que los visitantes reciban lo nuevo.
