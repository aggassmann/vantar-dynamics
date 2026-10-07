// VANTAR Dynamics — Toolbox: procesamiento de señal (sin dependencias)
// Los sensores del navegador llegan con intervalos irregulares: se remuestrean a paso fijo
// antes de calcular espectros. Espectro por Welch (ventana de Hann, 50 % de solapamiento).

import { fft } from "../lib/fft.js";

/** Frecuencia de muestreo real, por la mediana de los intervalos entre lecturas (ms). */
export function fsMediana(t) {
  if (t.length < 3) return 0;
  const d = [];
  for (let i = 1; i < t.length; i++) d.push(t[i] - t[i - 1]);
  d.sort((a, b) => a - b);
  const m = d[d.length >> 1];
  return m > 0 ? 1000 / m : 0;
}

/** Cantidad de cortes: intervalos de más de 3 lecturas sin datos. */
export function cortes(t, fs) {
  if (!fs) return 0;
  const lim = (3 * 1000) / fs;
  let n = 0;
  for (let i = 1; i < t.length; i++) if (t[i] - t[i - 1] > lim) n++;
  return n;
}

/** Remuestreo lineal a paso fijo 1/fs desde t[0]. */
export function remuestrear(t, v, fs) {
  const n = Math.floor(((t[t.length - 1] - t[0]) / 1000) * fs) + 1;
  const out = new Float64Array(Math.max(0, n));
  let j = 0;
  for (let i = 0; i < n; i++) {
    const ti = t[0] + (i * 1000) / fs;
    while (j < t.length - 2 && t[j + 1] < ti) j++;
    const dt = t[j + 1] - t[j];
    const r = dt > 0 ? (ti - t[j]) / dt : 0;
    out[i] = v[j] + (v[j + 1] - v[j]) * Math.min(1, Math.max(0, r));
  }
  return out;
}

const potencia2 = (n) => { let p = 1; while (p * 2 <= n) p *= 2; return p; };

/**
 * Espectro de potencia promediado (Welch) de una señal real.
 * Devuelve las frecuencias, la potencia por línea y la escala para pasar a RMS y a amplitud.
 */
export function welch(x, fs, segMax = 512) {
  const N = Math.min(segMax, potencia2(x.length));
  const w = new Float64Array(N);
  let sw = 0, sw2 = 0;
  for (let i = 0; i < N; i++) { w[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (N - 1))); sw += w[i]; sw2 += w[i] * w[i]; }
  const half = N >> 1;
  const P = new Float64Array(half);
  const paso = N >> 1;
  let segs = 0;
  const re = new Float32Array(N), im = new Float32Array(N);
  for (let s = 0; s + N <= x.length; s += paso) {
    let m = 0;
    for (let i = 0; i < N; i++) m += x[s + i];
    m /= N;
    for (let i = 0; i < N; i++) { re[i] = (x[s + i] - m) * w[i]; im[i] = 0; }
    fft(re, im);
    for (let k = 0; k < half; k++) P[k] += re[k] * re[k] + im[k] * im[k];
    segs++;
  }
  for (let k = 0; k < half; k++) P[k] /= Math.max(1, segs);
  const f = new Float64Array(half);
  for (let k = 0; k < half; k++) f[k] = (k * fs) / N;
  // RMS² = (2 / (N·Σw²)) · Σ P_k   ·   amplitud de pico de un tono = 2·√P_k / Σw
  return { f, P, kRms: 2 / (N * sw2), kAmp: 2 / sw, N, segs };
}

/** Suma de los espectros de potencia de varios ejes (vibración total). */
export function sumarEspectros(lista) {
  const base = lista[0];
  const P = new Float64Array(base.P.length);
  lista.forEach((e) => { for (let k = 0; k < P.length; k++) P[k] += e.P[k]; });
  return { ...base, P };
}

/** RMS de aceleración (m/s²) entre fMin y fMax. */
export function rmsAceleracion(e, fMin, fMax) {
  let s = 0;
  for (let k = 1; k < e.P.length; k++) if (e.f[k] >= fMin && e.f[k] <= fMax) s += e.P[k];
  return Math.sqrt(e.kRms * s);
}

/** RMS de velocidad (mm/s) entre fMin y fMax: se integra en frecuencia, a/(2πf). */
export function rmsVelocidad(e, fMin, fMax) {
  let s = 0;
  for (let k = 1; k < e.P.length; k++) {
    const f = e.f[k];
    if (f < fMin || f > fMax) continue;
    s += e.P[k] / (2 * Math.PI * f) ** 2;
  }
  return Math.sqrt(e.kRms * s) * 1000;
}

/** Espectro de amplitud de velocidad (mm/s de pico) para graficar. */
export function amplitudVelocidad(e, fMin) {
  const a = new Float64Array(e.P.length);
  for (let k = 1; k < a.length; k++) {
    const f = e.f[k];
    a[k] = f < fMin ? 0 : ((e.kAmp * Math.sqrt(e.P[k])) / (2 * Math.PI * f)) * 1000;
  }
  return a;
}

/** Línea de mayor valor entre fMin y fMax, con interpolación parabólica de la frecuencia. */
export function pico(f, a, fMin, fMax) {
  let kb = -1;
  for (let k = 1; k < a.length - 1; k++) {
    if (f[k] < fMin || f[k] > fMax) continue;
    if (kb < 0 || a[k] > a[kb]) kb = k;
  }
  if (kb < 1) return { f: 0, a: 0 };
  const y0 = a[kb - 1], y1 = a[kb], y2 = a[kb + 1];
  const den = y0 - 2 * y1 + y2;
  const d = den !== 0 ? (0.5 * (y0 - y2)) / den : 0;
  const df = f[1] - f[0];
  return { f: f[kb] + Math.max(-0.5, Math.min(0.5, d)) * df, a: y1 };
}

/** Quita la tendencia lenta (media móvil de ~ventana muestras): deja solo la vibración. */
export function sinTendencia(x, ventana) {
  const n = x.length, out = new Float64Array(n), h = Math.max(1, ventana >> 1);
  let s = 0, a = 0, b = -1;
  for (let i = 0; i < n; i++) {
    const lo = Math.max(0, i - h), hi = Math.min(n - 1, i + h);
    while (b < hi) s += x[++b];
    while (a < lo) s -= x[a++];
    out[i] = x[i] - s / (b - a + 1);
  }
  return out;
}

export const rms = (x) => { let s = 0; for (let i = 0; i < x.length; i++) s += x[i] * x[i]; return Math.sqrt(s / Math.max(1, x.length)); };
export const maxAbs = (x) => { let m = 0; for (let i = 0; i < x.length; i++) m = Math.max(m, Math.abs(x[i])); return m; };

/** Reduce una serie a como mucho n puntos (para graficar y guardar). */
export function reducir(x, n) {
  if (x.length <= n) return Array.from(x);
  const out = [], paso = x.length / n;
  for (let i = 0; i < n; i++) {
    // conserva el extremo de cada tramo para no perder picos
    let m = 0;
    for (let j = Math.floor(i * paso); j < Math.floor((i + 1) * paso); j++) if (Math.abs(x[j]) > Math.abs(m)) m = x[j];
    out.push(m);
  }
  return out;
}
