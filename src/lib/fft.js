// VANTAR Dynamics — Minimal radix-2 FFT (no dependencies)
// Used by the vibration analyzer (motion samples) and as a fallback path for
// audio. Operates in place on real/imag float arrays.

/** In-place iterative radix-2 Cooley–Tukey FFT. `re`/`im` length must be 2^k. */
export function fft(re, im) {
  const n = re.length;
  if (n <= 1) return;
  if ((n & (n - 1)) !== 0) throw new Error("FFT length must be a power of 2");

  // Bit-reversal permutation
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }

  // Butterflies
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wRe = Math.cos(ang), wIm = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let curRe = 1, curIm = 0;
      for (let k = 0; k < len / 2; k++) {
        const aRe = re[i + k], aIm = im[i + k];
        const bRe = re[i + k + len / 2], bIm = im[i + k + len / 2];
        const tRe = bRe * curRe - bIm * curIm;
        const tIm = bRe * curIm + bIm * curRe;
        re[i + k] = aRe + tRe; im[i + k] = aIm + tIm;
        re[i + k + len / 2] = aRe - tRe; im[i + k + len / 2] = aIm - tIm;
        const nRe = curRe * wRe - curIm * wIm;
        curIm = curRe * wIm + curIm * wRe;
        curRe = nRe;
      }
    }
  }
}

/** Largest power of two <= n. */
export function prevPow2(n) {
  let p = 1;
  while (p * 2 <= n) p *= 2;
  return p;
}

/** Hann window in place — reduces spectral leakage. */
export function hann(buf) {
  const n = buf.length;
  for (let i = 0; i < n; i++) {
    buf[i] *= 0.5 * (1 - Math.cos((2 * Math.PI * i) / (n - 1)));
  }
}

/**
 * Single-sided magnitude spectrum of a real signal.
 * @param {Float32Array|number[]} signal  Real samples (will be windowed/copied)
 * @param {number} sampleRate              Hz
 * @returns {{freqs:Float32Array, mags:Float32Array, peakHz:number}}
 */
export function spectrum(signal, sampleRate) {
  const n = prevPow2(signal.length);
  const re = new Float32Array(n);
  const im = new Float32Array(n);
  for (let i = 0; i < n; i++) re[i] = signal[i];
  hann(re);
  fft(re, im);

  const half = n >> 1;
  const mags = new Float32Array(half);
  const freqs = new Float32Array(half);
  let peakHz = 0, peakMag = -1;
  for (let i = 0; i < half; i++) {
    const m = Math.hypot(re[i], im[i]) / half;
    mags[i] = m;
    freqs[i] = (i * sampleRate) / n;
    if (i > 0 && m > peakMag) { peakMag = m; peakHz = freqs[i]; }
  }
  return { freqs, mags, peakHz };
}
