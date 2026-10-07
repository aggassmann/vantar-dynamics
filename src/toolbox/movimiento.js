// VANTAR Dynamics — Toolbox: Movimiento (aceleración y giro en 3 ejes, hasta 1 minuto)
// Antes de registrar: 3 s quieto para medir hacia dónde está la gravedad. Durante el registro
// se usa la aceleración sin gravedad que entrega el celular; si no la entrega, se resta la
// gravedad medida al alinear.

import { fsMediana, reducir } from "./senal.js";

export const MAX_S = 60;

/** Alineación: junta 3 s de lecturas; avisa si el celular se movió. */
export function alinear(alDato) {
  const h = (e) => {
    const g = e.accelerationIncludingGravity;
    const r = e.rotationRate;
    if (!g || g.x == null) return;
    alDato({ g: [g.x, g.y, g.z], giro: r && r.alpha != null ? Math.hypot(r.alpha, r.beta, r.gamma) : 0 });
  };
  window.addEventListener("devicemotion", h);
  return () => window.removeEventListener("devicemotion", h);
}

/** Con las lecturas de la alineación: gravedad promedio, si estuvo quieto y qué eje quedó vertical. */
export function resultadoAlineacion(lect) {
  const n = lect.length;
  const g = [0, 1, 2].map((i) => lect.reduce((s, l) => s + l.g[i], 0) / Math.max(1, n));
  const mod = lect.map((l) => Math.hypot(...l.g));
  const m = mod.reduce((s, v) => s + v, 0) / Math.max(1, n);
  const desv = Math.sqrt(mod.reduce((s, v) => s + (v - m) ** 2, 0) / Math.max(1, n));
  const giro = Math.max(0, ...lect.map((l) => l.giro));
  const quieto = n > 10 && desv < 0.35 && giro < 15;
  const eje = [0, 1, 2].reduce((a, b) => (Math.abs(g[b]) > Math.abs(g[a]) ? b : a), 0);
  const texto = [
    "el celular está de costado (eje X vertical)",
    "el celular está parado (eje Y vertical)",
    "el celular está acostado (eje Z vertical)",
  ][eje];
  return { g, quieto, eje, texto };
}

/** Registro: devuelve la función para dejar de escuchar. */
export function registrar(gravedad, d, enVivo) {
  const h = (e) => {
    let a = e.acceleration;
    if (!a || a.x == null) {
      const g = e.accelerationIncludingGravity;
      if (!g || g.x == null) return;
      a = { x: g.x - gravedad[0], y: g.y - gravedad[1], z: g.z - gravedad[2] };
    }
    const r = e.rotationRate;
    const t = e.timeStamp || performance.now();
    if (d.t0 == null) d.t0 = t;
    d.t.push((t - d.t0) / 1000);
    d.x.push(a.x); d.y.push(a.y); d.z.push(a.z);
    const hayGiro = r && r.alpha != null;
    if (hayGiro) d.conGiro = true;
    // rotationRate: alpha = giro alrededor de Z, beta = alrededor de X, gamma = alrededor de Y (°/s)
    d.gx.push(hayGiro ? r.beta : 0); d.gy.push(hayGiro ? r.gamma : 0); d.gz.push(hayGiro ? r.alpha : 0);
    enVivo && enVivo();
  };
  window.addEventListener("devicemotion", h);
  return () => window.removeEventListener("devicemotion", h);
}

const rms = (a) => Math.sqrt(a.reduce((s, v) => s + v * v, 0) / Math.max(1, a.length));
const maxAbs = (a) => a.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
const EJES = ["X", "Y", "Z"];

export function analizar(d, alin) {
  const n = d.t.length;
  if (n < 20) return { error: "El registro fue demasiado corto. Probá de nuevo y dejalo registrar al menos unos segundos." };
  const fs = fsMediana(d.t.map((s) => s * 1000));
  const dur = d.t[n - 1];
  const acc = [d.x, d.y, d.z], gir = [d.gx, d.gy, d.gz];
  const mayor = (series) => series.map((s, i) => [i, maxAbs(s)]).sort((a, b) => b[1] - a[1])[0];
  const [ea, va] = mayor(acc), [eg, vg] = mayor(gir);
  const total = (series) => Math.sqrt(series.reduce((s, v) => s + rms(v) ** 2, 0));
  const PUNTOS = 680; // un punto por píxel del gráfico
  return {
    tipo: "mov", fecha: Date.now(), dur, n, fs: Math.round(fs), conGiro: !!d.conGiro,
    alineacion: alin.texto,
    aMax: va, aEje: EJES[ea], aRms: total(acc),
    gMax: d.conGiro ? vg : null, gEje: EJES[eg], gRms: d.conGiro ? total(gir) : null,
    serie: {
      acc: acc.map((s) => reducir(s, PUNTOS).map((v) => +v.toFixed(3))),
      gir: d.conGiro ? gir.map((s) => reducir(s, PUNTOS).map((v) => +v.toFixed(2))) : null,
    },
    calidad: { nota: "buena", items: [] },
  };
}
