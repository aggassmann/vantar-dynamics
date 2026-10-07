// VANTAR Dynamics — Toolbox: gráficos en canvas (fondo oscuro de la marca)
// Los canvas tienen resolución fija (680 px de ancho) y se escalan por CSS: así se ven igual
// en la página y en la imagen que viaja en el informe por mail.

export const C = {
  fondo: "#161619", amarillo: "#D49A17", tinta: "#ffffff", z: "#6fa8dc",
  grilla: "rgba(255,255,255,.06)", tenue: "#8a8a90", relleno: "rgba(212,154,23,.35)",
};
const FUENTE = "'Space Grotesk', system-ui, sans-serif";
const fmt = (n, d = 1) => n.toLocaleString("es-AR", { minimumFractionDigits: d, maximumFractionDigits: d });

function preparar(c) {
  const x = c.getContext("2d");
  x.setLineDash([]);
  x.fillStyle = C.fondo;
  x.fillRect(0, 0, c.width, c.height);
  return { x, w: c.width, h: c.height };
}

function grilla(x, w, h, filas = 4, arriba = 0, abajo = h) {
  x.strokeStyle = C.grilla; x.lineWidth = 1;
  for (let i = 1; i < filas; i++) {
    const y = arriba + (i * (abajo - arriba)) / filas;
    x.beginPath(); x.moveTo(0, y); x.lineTo(w, y); x.stroke();
  }
}

function ejeFrecuencia(x, w, h, padL, padB, padT, maxF, marcas, rotulo) {
  x.font = `22px ${FUENTE}`; x.fillStyle = C.tenue; x.textAlign = "center";
  x.strokeStyle = C.grilla; x.lineWidth = 1;
  marcas.forEach((f) => {
    const px = padL + (f / maxF) * (w - 2 * padL);
    x.beginPath(); x.moveTo(px, padT); x.lineTo(px, h - padB); x.stroke();
    x.fillText(rotulo(f), Math.min(Math.max(px, 20), w - 48), h - 10);
  });
}

/** Marcas "lindas" para un eje de 0 a maxF. */
export function marcas(maxF, n = 4) {
  const bruto = maxF / n, p = 10 ** Math.floor(Math.log10(bruto));
  const paso = [1, 2, 2.5, 5, 10].map((m) => m * p).find((s) => s >= bruto) || bruto;
  const out = [];
  for (let f = 0; f <= maxF + 1e-9; f += paso) out.push(Math.round(f * 1000) / 1000);
  return out;
}

/** Espectro con relleno y el pico marcado. a = amplitudes (cualquier unidad), f = frecuencias. */
export function espectro(c, f, a, { maxF, rotulo = (v) => fmt(v, 0), unidad = " Hz", pico = null, desde = 0 } = {}) {
  const { x, w, h } = preparar(c), padL = 16, padB = 38, padT = 34;
  const tope = maxF || f[f.length - 1];
  const ticks = marcas(tope);
  ejeFrecuencia(x, w, h, padL, padB, padT, tope, ticks, (v) => rotulo(v) + (v === ticks[ticks.length - 1] ? unidad : ""));
  let amax = 0;
  for (let k = 0; k < a.length; k++) if (f[k] >= desde && f[k] <= tope) amax = Math.max(amax, a[k]);
  if (!amax) return;
  const px = (fr) => padL + (fr / tope) * (w - 2 * padL);
  const py = (v) => h - padB - Math.min(1, v / amax) * (h - padB - padT);
  const pts = [];
  for (let k = 0; k < a.length; k++) if (f[k] <= tope) pts.push([px(f[k]), py(f[k] < desde ? 0 : a[k])]);
  const g = x.createLinearGradient(0, padT, 0, h - padB);
  g.addColorStop(0, C.relleno); g.addColorStop(1, "rgba(212,154,23,0)");
  x.beginPath(); x.moveTo(pts[0][0], h - padB); pts.forEach(([u, v]) => x.lineTo(u, v)); x.lineTo(pts[pts.length - 1][0], h - padB); x.closePath();
  x.fillStyle = g; x.fill();
  x.beginPath(); pts.forEach(([u, v], i) => (i ? x.lineTo(u, v) : x.moveTo(u, v)));
  x.strokeStyle = C.amarillo; x.lineWidth = 3; x.lineJoin = "round"; x.stroke();
  if (pico && pico.f) {
    const u = px(pico.f), v = py(pico.a);
    x.fillStyle = C.tinta; x.beginPath(); x.arc(u, v, 6, 0, 7); x.fill();
    x.font = `600 22px ${FUENTE}`;
    const izq = u > w * 0.7;
    x.textAlign = izq ? "right" : "left";
    x.fillText(pico.rotulo, izq ? u - 14 : u + 14, Math.max(v + 8, padT));
  }
}

/** Rango que ve el celular frente al rango del instrumental VANTAR: dos barras sobre el mismo eje. */
export function comparativo(c, fCel, fVantar) {
  const { x, w, h } = preparar(c), padL = 16, padR = 16, padB = 38;
  const px = (fr) => padL + (fr / fVantar) * (w - padL - padR);
  ejeFrecuencia(x, w, h, padL, padB, 8, fVantar, marcas(fVantar), (v) => fmt(v, 0) + (v === fVantar ? " Hz" : ""));
  const fila = (y, color, hasta, txt) => {
    x.font = `600 22px ${FUENTE}`; x.textAlign = "left"; x.fillStyle = color;
    x.fillText(txt, padL, y - 12);
    x.fillStyle = "rgba(255,255,255,.06)"; x.fillRect(padL, y, w - padL - padR, 22);
    x.fillStyle = color; x.fillRect(padL, y, Math.max(6, px(hasta) - padL), 22);
  };
  fila(52, C.amarillo, fCel, `Tu celular: 0 a ${fmt(fCel, 0)} Hz`);
  fila(124, C.tinta, fVantar, `Instrumental VANTAR: 0 a ${fmt(fVantar, 0)} Hz`);
}

/** Señal en vivo (un trazo). */
export function onda(c, buf, escala) {
  const { x, w, h } = preparar(c);
  grilla(x, w, h);
  const e = escala || Math.max(0.05, ...buf.map(Math.abs));
  x.strokeStyle = C.amarillo; x.lineWidth = 3; x.lineJoin = "round"; x.beginPath();
  buf.forEach((b, i) => { const u = (i / Math.max(1, buf.length - 1)) * w, v = h / 2 - (b / e) * h * 0.42; i ? x.lineTo(u, v) : x.moveTo(u, v); });
  x.stroke();
}

/** Barras de espectro de sonido en vivo (niveles 0..1). */
export function barras(c, niveles, destacada = -1) {
  const { x, w, h } = preparar(c);
  grilla(x, w, h);
  const n = niveles.length, bw = w / n;
  for (let i = 0; i < n; i++) {
    const bh = Math.max(2, niveles[i] * (h - 20));
    x.fillStyle = i === destacada ? C.amarillo : "rgba(212,154,23,.45)";
    x.fillRect(i * bw + 2, h - bh, bw - 4, bh);
  }
}

/** Tres ejes (X amarillo, Y blanco, Z azul) sobre un eje de tiempo. series = [x[], y[], z[]]. */
export function tresEjes(c, series, { desde = 0, escala = 0, segundos = 0 } = {}) {
  const { x, w, h } = preparar(c);
  const padB = segundos ? 34 : 0, alto = h - padB;
  grilla(x, w, h, 6, 0, alto);
  x.strokeStyle = "rgba(255,255,255,.14)"; x.beginPath(); x.moveTo(0, alto / 2); x.lineTo(w, alto / 2); x.stroke();
  const n = series[0].length;
  let e = escala;
  if (!e) { e = 0.1; series.forEach((s) => { for (let i = desde; i < n; i++) e = Math.max(e, Math.abs(s[i])); }); }
  [C.amarillo, C.tinta, C.z].forEach((color, j) => {
    const s = series[j];
    x.strokeStyle = color; x.lineWidth = 2.5; x.lineJoin = "round"; x.beginPath();
    for (let i = desde; i < n; i++) {
      const u = ((i - desde) / Math.max(1, n - desde - 1)) * w, v = alto / 2 - (s[i] / e) * (alto / 2 - 10);
      i > desde ? x.lineTo(u, v) : x.moveTo(u, v);
    }
    x.stroke();
  });
  if (segundos) {
    x.font = `22px ${FUENTE}`; x.fillStyle = C.tenue;
    const paso = [1, 2, 5, 10, 15, 20, 30].find((p) => segundos / p <= 5) || 30;
    const ticks = [];
    for (let t = 0; t <= segundos; t += paso) ticks.push(t);
    ticks.forEach((s) => {
      const u = (s / segundos) * w;
      x.textAlign = s === 0 ? "left" : u > w - 30 ? "right" : "center";
      x.fillText(`${fmt(s, 0)} s`, u, h - 8);
    });
  }
  return e;
}
