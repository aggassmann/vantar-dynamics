// VANTAR Dynamics — Toolbox: Sonido (micrófono del celular, Web Audio)
// El micrófono no está calibrado: los dB son aproximados (dBFS + un ajuste típico de celular)
// y sirven para comparar. El audio no se graba: solo se calculan niveles y el espectro.

const AJUSTE_DB = 100;   // dBFS → dB aproximados de un celular común
const F_MAX = 8000, F_MIN = 50;

export async function abrir(stream) {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  const ac = new Ctx();
  if (ac.state === "suspended") { try { await ac.resume(); } catch { /* sigue */ } }
  const src = ac.createMediaStreamSource(stream);
  const an = ac.createAnalyser();
  an.fftSize = 4096;
  an.smoothingTimeConstant = 0;
  src.connect(an);
  const bins = an.frequencyBinCount, sr = ac.sampleRate;
  const kMax = Math.min(bins - 1, Math.floor((F_MAX * an.fftSize) / sr));
  const tiempo = new Float32Array(an.fftSize), frec = new Float32Array(bins);
  const reg = { t: [], db: [], potencia: new Float64Array(kMax + 1), cuadros: 0, saturados: 0, t0: performance.now() };

  /** Lee un cuadro: nivel actual (dB aprox.) y espectro actual (dB) para el gráfico en vivo. */
  function leer() {
    an.getFloatTimeDomainData(tiempo);
    let s = 0, pico = 0;
    for (let i = 0; i < tiempo.length; i++) { s += tiempo[i] * tiempo[i]; pico = Math.max(pico, Math.abs(tiempo[i])); }
    const db = 20 * Math.log10(Math.sqrt(s / tiempo.length) + 1e-9) + AJUSTE_DB;
    an.getFloatFrequencyData(frec);
    for (let k = 0; k <= kMax; k++) if (isFinite(frec[k])) reg.potencia[k] += 10 ** (frec[k] / 10);
    reg.cuadros++;
    if (pico > 0.98) reg.saturados++;
    reg.t.push((performance.now() - reg.t0) / 1000); reg.db.push(db);
    return { db, frec, kMax };
  }
  function cerrar() {
    stream.getTracks().forEach((t) => t.stop());
    try { ac.close(); } catch { /* ya cerrado */ }
  }
  return { leer, cerrar, reg, sr, fftSize: an.fftSize };
}

const mediana = (a) => { const s = [...a].sort((x, y) => x - y); return s[s.length >> 1] || 0; };

export function analizar(sesion, { ctx, dur }) {
  const { reg, sr, fftSize } = sesion;
  if (reg.cuadros < 10) return { error: "No llegó sonido del micrófono. Revisá que ninguna otra app lo esté usando y probá de nuevo." };
  const db = reg.db;
  const prom = 10 * Math.log10(db.reduce((s, v) => s + 10 ** (v / 10), 0) / db.length);
  const max = Math.max(...db);
  const df = sr / fftSize;
  const f = [], espDb = [];
  for (let k = 0; k < reg.potencia.length; k++) {
    f.push(k * df);
    espDb.push(10 * Math.log10(reg.potencia[k] / reg.cuadros + 1e-20));
  }
  const banda = espDb.filter((_, k) => f[k] >= F_MIN);
  const fondo = mediana(banda);
  let kp = -1;
  for (let k = 0; k < f.length; k++) if (f[k] >= F_MIN && (kp < 0 || espDb[k] > espDb[kp])) kp = k;
  const tono = kp > 0 ? f[kp] : 0;
  const marcado = kp > 0 && espDb[kp] - fondo > 15;

  // calidad
  const med = mediana(db);
  const desv = Math.sqrt(db.reduce((s, v) => s + (v - prom) ** 2, 0) / db.length);
  let golpe = -1;
  for (let i = 0; i < db.length; i++) if (db[i] > med + 12) { golpe = i; break; }
  const items = [];
  items.push(desv < 4 ? { ok: true, txt: "Sonido estable durante la medición." } : { ok: false, txt: "El nivel cambió bastante durante la medición: si el ruido no es parejo, el promedio puede variar de una medición a otra." });
  if (golpe >= 0) items.push({ ok: false, txt: `Hubo un ruido fuerte y corto a los ${Math.max(1, Math.round(reg.t[golpe]))} s (un golpe o una voz). Si podés, repetila.` });
  if (reg.saturados / reg.cuadros > 0.02) items.push({ ok: false, txt: "El sonido fue tan fuerte que saturó el micrófono: alejá un poco el celular y repetila." });
  if (prom - AJUSTE_DB < -80) items.push({ ok: false, txt: "El sonido es muy bajo para el micrófono del celular." });
  const problemas = items.filter((i) => !i.ok).length;
  const nota = problemas === 0 ? "buena" : problemas === 1 ? "aceptable" : "dudosa";

  // espectro para mostrar: dB por encima del fondo, reducido a ~340 líneas conservando picos
  const a = espDb.map((v, k) => (f[k] < F_MIN ? 0 : Math.max(0, v - (fondo - 10))));
  const paso = Math.max(1, Math.ceil(f.length / 340));
  const fr = [], ar = [];
  for (let i = 0; i < f.length; i += paso) {
    let m = 0, km = i;
    for (let k = i; k < Math.min(f.length, i + paso); k++) if (a[k] > m) { m = a[k]; km = k; }
    fr.push(+f[km].toFixed(1)); ar.push(+m.toFixed(2));
  }
  return {
    tipo: "snd", fecha: Date.now(), ctx, dur,
    prom, max, tono, marcado, aTono: kp > 0 ? a[kp] : 0,
    calidad: { nota, items }, esp: { f: fr, a: ar },
  };
}

/* ------------------------------ Interpretación ----------------------------- */
export const claseTono = (f) => (f < 300 ? "grave" : f < 2000 ? "medio" : "agudo");
const ZONAS = [
  { hasta: 40, nombre: "Silencioso", color: "#3fb67f" },
  { hasta: 65, nombre: "Conversación", color: "#9bbf3a" },
  { hasta: 85, nombre: "Ruidoso", color: "#e0a526" },
  { hasta: 110, nombre: "Dañino", color: "#d8443a" },
];
const COLS = [1, 1.25, 1.25, 1.5];
const fmt0 = (n) => Math.round(n).toLocaleString("es-AR");

function posicion(v) {
  const total = COLS.reduce((s, c) => s + c, 0);
  let base = 0, desde = 20;
  for (let i = 0; i < ZONAS.length; i++) {
    const z = ZONAS[i];
    if (v <= z.hasta || i === ZONAS.length - 1) return ((base + Math.min(1, Math.max(0, (v - desde) / (z.hasta - desde))) * COLS[i]) / total) * 100;
    base += COLS[i]; desde = z.hasta;
  }
  return 100;
}

export function interpretar(m, ctx) {
  const tono = `${fmt0(m.tono)} Hz`;
  if (ctx === "maq") {
    if (!m.marcado) return { chip: "Sin un tono dominante", clase: "neutro", txt: "El sonido está repartido en muchas frecuencias, sin un tono que se destaque. Compará con una máquina igual que funcione bien: si una suena distinto, ahí hay algo para revisar." };
    const c = claseTono(m.tono);
    const causa = {
      grave: "del giro de la máquina, de algo desbalanceado o flojo, o del zumbido eléctrico de un motor",
      medio: "de engranajes, ventiladores, bombas o correas",
      agudo: "de <b>rodamientos gastados, una correa que patina o una fuga de aire</b>",
    }[c];
    return { chip: `Tono ${c} marcado`, clase: "alerta", txt: `El sonido se concentra en <b>${tono}</b>. Un tono ${c} y estable en una máquina suele venir ${causa}. Compará con una máquina igual que funcione bien.` };
  }
  if (ctx === "amb") {
    const z = ZONAS.find((zz) => m.prom <= zz.hasta) || ZONAS[ZONAS.length - 1];
    const txt = {
      Silencioso: `${fmt0(m.prom)} dB aprox. es un ambiente tranquilo, como una biblioteca o una oficina sin gente.`,
      Conversación: `${fmt0(m.prom)} dB aprox. es como una conversación o una oficina con actividad.`,
      Ruidoso: `${fmt0(m.prom)} dB aprox. es como una calle con tránsito. No es dañino de a ratos; por encima de 85 dB durante horas, se recomienda protección auditiva.`,
      Dañino: `${fmt0(m.prom)} dB aprox. es un nivel alto: estar muchas horas expuesto puede dañar el oído. Se recomienda protección auditiva.`,
    }[z.nombre];
    return { chip: z.nombre === "Silencioso" ? "Ambiente tranquilo" : z.nombre === "Conversación" ? "Ambiente normal" : z.nombre === "Ruidoso" ? "Ambiente ruidoso" : "Ruido alto", clase: z.nombre === "Dañino" ? "mal" : "neutro", escala: { cols: COLS, zonas: ZONAS, pct: posicion(m.prom) }, txt };
  }
  return { chip: "Medición registrada", clase: "neutro", txt: `Nivel promedio de ${fmt0(m.prom)} dB aprox.${m.marcado ? `, con el tono dominante en <b>${tono}</b>` : ""}. Contanos qué es y lo vemos.` };
}
