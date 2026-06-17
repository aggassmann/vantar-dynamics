// VANTAR Dynamics — Ultralight canvas charting (no dependencies)
// Two renderers tuned for high-refresh sensor data:
//   • RollingChart  — multi-series strip chart (accelerometer X/Y/Z)
//   • SpectrumChart — frequency-bin bar chart (vibration / audio FFT)
// Both share HiDPI handling. Tools own their requestAnimationFrame loop.

const INK = "#a1a1a6";
const HAIR = "rgba(255,255,255,0.12)";

class Base {
  constructor(canvas, cssHeight = 180) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.cssHeight = cssHeight;
    this.resize();
    this._ro = new ResizeObserver(() => this.resize());
    this._ro.observe(canvas.parentElement || canvas);
  }
  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const w = (this.canvas.parentElement || this.canvas).clientWidth || 320;
    const h = this.cssHeight;
    this.w = w; this.h = h; this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.canvas.style.height = h + "px";
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  clear() { this.ctx.clearRect(0, 0, this.w, this.h); }
  destroy() { this._ro && this._ro.disconnect(); }
}

export class RollingChart extends Base {
  /** @param {{series:{key:string,color:string}[], capacity?:number, height?:number}} opts */
  constructor(canvas, opts) {
    super(canvas, opts.height || 200);
    this.series = opts.series;
    this.capacity = opts.capacity || 240;
    this.buffers = opts.series.map(() => new Float32Array(this.capacity).fill(0));
    this.head = 0;
    this.count = 0;
  }
  push(values) {
    this.series.forEach((s, i) => { this.buffers[i][this.head] = values[i] ?? 0; });
    this.head = (this.head + 1) % this.capacity;
    this.count = Math.min(this.count + 1, this.capacity);
  }
  reset() { this.buffers.forEach((b) => b.fill(0)); this.head = 0; this.count = 0; }

  render() {
    const { ctx, w, h } = this;
    this.clear();

    // Auto vertical range (symmetric), min span for stability.
    let max = 0.5;
    for (const b of this.buffers) for (let i = 0; i < this.capacity; i++) max = Math.max(max, Math.abs(b[i]));
    max *= 1.15;
    const midY = h / 2, scale = (h / 2 - 8) / max;

    // Grid: zero line + quarter lines
    ctx.strokeStyle = HAIR; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(w, midY); ctx.stroke();
    ctx.setLineDash([3, 5]); ctx.strokeStyle = "rgba(255,255,255,0.06)";
    [0.5, -0.5].forEach((q) => {
      const y = midY - q * 2 * (h / 2 - 8);
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    });
    ctx.setLineDash([]);

    // Y label
    ctx.fillStyle = INK; ctx.font = "10px 'Space Grotesk', sans-serif";
    ctx.fillText(`±${max.toFixed(1)}`, 6, 14);

    // Series lines (oldest -> newest)
    const n = this.count;
    const stepX = w / (this.capacity - 1);
    this.series.forEach((s, si) => {
      const buf = this.buffers[si];
      ctx.strokeStyle = s.color; ctx.lineWidth = 1.8;
      ctx.lineJoin = "round"; ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const idx = (this.head - n + i + this.capacity * 2) % this.capacity;
        const x = i * stepX;
        const y = midY - buf[idx] * scale;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
  }
}

export class SpectrumChart extends Base {
  constructor(canvas, opts = {}) {
    super(canvas, opts.height || 200);
    this.color = opts.color || "#6d28d9";
    this.maxFreq = opts.maxFreq || null;   // Hz cap on x-axis
    this.logY = !!opts.logY;
    this.smooth = null;
  }
  /**
   * @param {Float32Array} mags
   * @param {{sampleRate:number, peakHz?:number}} info
   */
  render(mags, info) {
    const { ctx, w, h } = this;
    this.clear();
    const sr = info.sampleRate;
    const nyq = sr / 2;
    const cap = this.maxFreq ? Math.min(this.maxFreq, nyq) : nyq;
    const usableBins = Math.max(1, Math.floor((cap / nyq) * mags.length));

    // Temporal smoothing for readability
    if (!this.smooth || this.smooth.length !== mags.length) this.smooth = new Float32Array(mags.length);
    for (let i = 0; i < mags.length; i++) this.smooth[i] = this.smooth[i] * 0.6 + mags[i] * 0.4;

    let peak = 1e-9;
    for (let i = 1; i < usableBins; i++) peak = Math.max(peak, this.smooth[i]);

    const baseY = h - 16;
    const grad = ctx.createLinearGradient(0, 0, 0, baseY);
    grad.addColorStop(0, "#D49A17"); grad.addColorStop(1, "rgba(255, 255, 255, 0.1)");

    const bars = Math.min(usableBins - 1, Math.floor(w / 3));
    const bw = w / bars;
    ctx.fillStyle = grad;
    for (let b = 0; b < bars; b++) {
      const from = 1 + Math.floor((b / bars) * (usableBins - 1));
      const to = 1 + Math.floor(((b + 1) / bars) * (usableBins - 1));
      let v = 0; for (let i = from; i <= to; i++) v = Math.max(v, this.smooth[i] || 0);
      let norm = v / peak;
      if (this.logY) norm = Math.log10(1 + 9 * norm);
      const bh = Math.max(1, norm * (baseY - 6));
      ctx.fillRect(b * bw + 0.5, baseY - bh, bw - 1, bh);
    }

    // Axis + peak label
    ctx.strokeStyle = HAIR; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, baseY); ctx.lineTo(w, baseY); ctx.stroke();
    ctx.fillStyle = INK; ctx.font = "10px 'Space Grotesk', sans-serif";
    ctx.fillText("0", 2, h - 3);
    ctx.textAlign = "right"; ctx.fillText(`${cap >= 1000 ? (cap/1000).toFixed(1)+'k' : Math.round(cap)} Hz`, w - 2, h - 3);
    ctx.textAlign = "left";
    if (info.peakHz) {
      ctx.fillStyle = "#ffffff"; ctx.font = "600 11px 'Space Grotesk', sans-serif";
      ctx.fillText(`pico ≈ ${info.peakHz < 1000 ? Math.round(info.peakHz)+' Hz' : (info.peakHz/1000).toFixed(2)+' kHz'}`, 6, 14);
    }
  }
}
