// VANTAR Dynamics — Toolbox: Vibraciones (acelerómetro del celular)
// Nivel de vibración = RMS de velocidad (mm/s, unidad de las normas de máquinas), integrado en
// frecuencia desde 3 Hz hasta lo que ve el celular. Frecuencia dominante = pico del espectro
// de aceleración (desde 2 Hz). Todo orientativo: el sensor del celular no está calibrado.

import { fsMediana, cortes, remuestrear, welch, sumarEspectros, rmsVelocidad, rmsAceleracion, pico, sinTendencia } from "./senal.js";

const F_MIN_VEL = 3, F_MIN_PICO = 2, RUIDO_MIN = 0.02; // m/s² RMS: por debajo, el celular no distingue la vibración

/** Escucha el acelerómetro. Devuelve una función para dejar de escuchar. */
export function escuchar(datos, enVivo) {
  const h = (e) => {
    const g = e.accelerationIncludingGravity || e.acceleration;
    if (!g || g.x == null) return;
    datos.t.push(e.timeStamp || performance.now());
    datos.x.push(g.x); datos.y.push(g.y); datos.z.push(g.z);
    enVivo && enVivo(g);
  };
  window.addEventListener("devicemotion", h);
  return () => window.removeEventListener("devicemotion", h);
}

/** Ángulo máximo (grados) que se movió la dirección de la gravedad, en bloques de 1 s. */
function giroDelCelular(x, y, z, fs) {
  const b = Math.max(1, Math.round(fs)), dirs = [];
  for (let s = 0; s + b <= x.length; s += b) {
    let gx = 0, gy = 0, gz = 0;
    for (let i = s; i < s + b; i++) { gx += x[i]; gy += y[i]; gz += z[i]; }
    const n = Math.hypot(gx, gy, gz) || 1;
    dirs.push([gx / n, gy / n, gz / n]);
  }
  let max = 0;
  for (const d of dirs) {
    const c = Math.min(1, Math.abs(d[0] * dirs[0][0] + d[1] * dirs[0][1] + d[2] * dirs[0][2]));
    max = Math.max(max, (Math.acos(c) * 180) / Math.PI);
  }
  return max;
}

/** Analiza lo registrado. Devuelve la medición o un texto de error. */
export function analizar(d, { ctx, dur }) {
  const fs = fsMediana(d.t);
  if (fs < 10 || d.t.length < fs * 2) return { error: "El celular no entregó suficientes lecturas del sensor. Probá de nuevo, sin cambiar de app ni bloquear la pantalla." };
  const ejes = [d.x, d.y, d.z].map((v) => remuestrear(d.t, v, fs));
  const seg = fs <= 130 ? 256 : 512;
  const esp = sumarEspectros(ejes.map((v) => welch(v, fs, seg)));
  const fMax = (fs / 2) * 0.95;
  const nivel = rmsVelocidad(esp, F_MIN_VEL, fMax);
  const aRms = rmsAceleracion(esp, F_MIN_PICO, fMax);
  const amp = Array.from(esp.P, (p) => esp.kAmp * Math.sqrt(p));
  const p = pico(esp.f, amp, F_MIN_PICO, fMax);
  const lim = ejes.map((v) => sinTendencia(v, Math.round(fs / 2)));
  let aMax = 0;
  for (let i = 0; i < lim[0].length; i++) aMax = Math.max(aMax, Math.hypot(lim[0][i], lim[1][i], lim[2][i]));

  const giro = giroDelCelular(ejes[0], ejes[1], ejes[2], fs);
  const nCortes = cortes(d.t, fs);
  const movido = giro > 4, bajo = aRms < RUIDO_MIN, cortado = nCortes > 0;
  const items = [
    movido
      ? { ok: false, txt: "El celular se movió o giró durante la medición. Repetila con el celular firme." }
      : { ok: true, txt: "El celular estuvo quieto y apoyado durante toda la medición." },
    bajo
      ? { ok: false, txt: "La vibración es muy baja, cerca del límite que distingue el sensor del celular: el resultado puede ser solo ruido." }
      : { ok: true, txt: "Señal clara, por encima del ruido del sensor." },
  ];
  if (cortado) items.push({ ok: false, txt: "Hubo cortes en la lectura del sensor (por ejemplo, si se apagó la pantalla o cambiaste de app)." });
  items.push({ ok: false, info: true, txt: `Tu celular lee ${Math.round(fs)} veces por segundo: ve vibraciones de hasta ${Math.round(fs / 2)} Hz. Lo que pase más arriba no aparece.` });
  const problemas = [movido, bajo, cortado].filter(Boolean).length;
  const nota = problemas === 0 ? "buena" : problemas === 1 && !bajo ? "aceptable" : "dudosa";

  const f = [], a = [];
  for (let k = 0; k < esp.f.length; k++) if (esp.f[k] <= fs / 2) { f.push(+esp.f[k].toFixed(3)); a.push(+amp[k].toPrecision(4)); }
  return {
    tipo: "vib", fecha: Date.now(), ctx, dur, fs: Math.round(fs), fMax: Math.round(fs / 2), n: d.t.length,
    nivel, fDom: p.f, aDom: p.a, aMax,
    calidad: { nota, items }, esp: { f, a },
  };
}

/* ------------------------------ Interpretación ----------------------------- */
// Zonas orientativas para una máquina mediana (criterio de severidad de las normas de vibración).
const ZONAS = [
  { hasta: 1.4, nombre: "Buena", color: "#3fb67f" },
  { hasta: 2.8, nombre: "Aceptable", color: "#9bbf3a" },
  { hasta: 7.1, nombre: "Revisar", color: "#e46a3c" },
  { hasta: 18, nombre: "Peligrosa", color: "#d8443a" },
];
const COLS = [1.1, 1.7, 2.3, 3];

function posicion(v) {
  const total = COLS.reduce((s, c) => s + c, 0);
  let base = 0, desde = 0;
  for (let i = 0; i < ZONAS.length; i++) {
    const z = ZONAS[i];
    if (v <= z.hasta || i === ZONAS.length - 1) {
      const r = Math.min(1, Math.max(0, (v - desde) / (z.hasta - desde)));
      return ((base + r * COLS[i]) / total) * 100;
    }
    base += COLS[i]; desde = z.hasta;
  }
  return 100;
}

const fmt = (n, d = 1) => n.toLocaleString("es-AR", { minimumFractionDigits: d, maximumFractionDigits: d });
export const rpm = (f) => Math.round(f * 60).toLocaleString("es-AR");

export function interpretar(m, ctx) {
  const nivel = `${fmt(m.nivel)} mm/s`;
  const dom = m.fDom ? `${fmt(m.fDom)} Hz` : null;
  if (ctx === "maq") {
    const i = ZONAS.findIndex((z) => m.nivel <= z.hasta);
    const z = ZONAS[i < 0 ? ZONAS.length - 1 : i];
    const chip = { Buena: ["Vibración baja", "ok"], Aceptable: ["Aceptable", "ok2"], Revisar: ["Conviene revisarla", "alerta"], Peligrosa: ["Revisala cuanto antes", "mal"] }[z.nombre];
    let txt = `Para una máquina mediana, ${nivel} cae en la zona <b>${z.nombre}</b>.`;
    if (dom) txt += ` La vibración se concentra en ${dom} (${rpm(m.fDom)} rpm)` + (z.nombre === "Revisar" || z.nombre === "Peligrosa"
      ? `: si coincide con la velocidad de giro, lo más común es un <b>desbalanceo</b>.`
      : `.`);
    return { chip: chip[0], clase: chip[1], escala: { cols: COLS, zonas: ZONAS, pct: posicion(m.nivel) }, txt };
  }
  if (ctx === "est") return { chip: "Para comparar", clase: "neutro", txt: `En estructuras no hay un límite único: depende del uso y de la norma que aplique.${dom ? ` Lo más útil es <b>la frecuencia dominante, ${dom}</b>: si coincide con la de una máquina cercana, la estructura podría estar en resonancia.` : ""} Medí en varios puntos y compará.` };
  if (ctx === "veh") return { chip: "Para comparar", clase: "neutro", txt: "Medí siempre a la misma velocidad y en el mismo lugar. Si la frecuencia sube con la velocidad, suele venir de <b>ruedas, cardán o motor</b>; si queda fija, de algo suelto o una resonancia." };
  return { chip: "Medición registrada", clase: "neutro", txt: `Nivel de ${nivel}${dom ? `, con la vibración concentrada en <b>${dom}</b>` : ""}. Para interpretarla hace falta saber qué es y cómo funciona: contanos y lo vemos.` };
}
