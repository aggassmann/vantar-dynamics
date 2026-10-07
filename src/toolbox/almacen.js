// VANTAR Dynamics — Toolbox: lo que se guarda en ESTE celular (nunca en un servidor)
// - Límite de cortesía: 3 mediciones por instrumento cada 30 días (ventana móvil).
// - La última medición, hasta que se pide el informe (para no perderla si se recarga la página).
// - Un informe pedido sin señal, que sale solo cuando vuelve la conexión.

export const LIMITE = 3;
const VENTANA = 30 * 864e5;
const K_USOS = "vantar.toolbox.usos";
const K_ULTIMA = "vantar.toolbox.ultima";
const K_PENDIENTE = "vantar.toolbox.pendiente";

function leer(k, defecto) {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : defecto; } catch { return defecto; }
}
function escribir(k, v) {
  try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; }
}

/** Fechas (ms) de las mediciones de un instrumento que todavía cuentan, de la más vieja a la más nueva. */
export function vigentes(tipo) {
  const usos = leer(K_USOS, {});
  return (usos[tipo] || []).filter((t) => Date.now() - t < VENTANA).sort((a, b) => a - b);
}
export const quedan = (tipo) => Math.max(0, LIMITE - vigentes(tipo).length);
/** Cuándo se libera la próxima medición (ms), si no quedan. */
export const liberaEl = (tipo) => { const v = vigentes(tipo); return v.length ? v[0] + VENTANA : Date.now(); };

export function registrarUso(tipo) {
  const usos = leer(K_USOS, {});
  usos[tipo] = [...vigentes(tipo), Date.now()];
  escribir(K_USOS, usos);
}

export const ultima = () => leer(K_ULTIMA, null);
export const guardarUltima = (m) => escribir(K_ULTIMA, m);
export const borrarUltima = () => escribir(K_ULTIMA, null);

export const pendiente = () => leer(K_PENDIENTE, null);
export const guardarPendiente = (p) => escribir(K_PENDIENTE, p);
export const borrarPendiente = () => escribir(K_PENDIENTE, null);
