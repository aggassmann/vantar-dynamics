// VANTAR Dynamics — estadísticas de visitas (Cloudflare Web Analytics + Microsoft Clarity)
// Cada servicio se activa solo cuando su código está cargado en datos.js (vacío = apagado).

// Import de espacio de nombres: si el navegador tiene un datos.js viejo en caché, no rompe el arranque.
import * as datos from "./datos.js";

function cargarScript(src, attrs = {}) {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
  document.head.appendChild(s);
}

export function initEstadisticas() {
  const { cloudflare, clarity } = datos.ESTADISTICAS || {};
  if (cloudflare) {
    cargarScript("https://static.cloudflareinsights.com/beacon.min.js", {
      defer: "",
      "data-cf-beacon": JSON.stringify({ token: cloudflare }),
    });
  }
  if (clarity) {
    window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
    cargarScript(`https://www.clarity.ms/tag/${clarity}`);
  }
}

// Marca un momento importante del recorrido (ej. «toolbox-vibraciones», «consulta-enviada»).
export function evento(nombre) {
  try { if (window.clarity) window.clarity("event", nombre); } catch { /* sin estadísticas */ }
}
