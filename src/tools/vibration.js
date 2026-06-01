// VANTAR Dynamics — Vibration frequency analyzer (FFT of motion signal)
import { toolShell } from "./_shell.js";
import { SpectrumChart } from "../lib/chart.js";
import { spectrum, prevPow2 } from "../lib/fft.js";
import { requestMotion } from "../ui/permissions.js";

const meta = {
  id: "vibration",
  name: "Analizador de vibraciones",
  sub: "Espectro de frecuencia (FFT) de la aceleración",
  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h2l2-7 3 16 3-12 2 8 2-5h6"/></svg>`,
};

export default {
  ...meta,
  render(root) {
    root.innerHTML = toolShell(meta, `
      <div class="card card-pad">
        <span class="status" id="vb-status"><span class="dot"></span><span id="vb-state">En espera</span></span>
        <div class="canvas-wrap"><canvas id="vb-canvas"></canvas></div>
        <div class="readout-grid" style="margin-top:var(--s-4)">
          <div class="readout"><div class="lbl">Frec. pico</div><div class="val" id="vb-peak">—</div></div>
          <div class="readout"><div class="lbl">RMS</div><div class="val" id="vb-rms">0.00</div></div>
          <div class="readout"><div class="lbl">fs estimada</div><div class="val" id="vb-fs">—</div></div>
        </div>
        <div class="controls">
          <button class="btn btn-primary btn-sm" id="vb-start">Iniciar análisis</button>
          <button class="btn btn-ghost btn-sm" id="vb-stop" disabled>Detener</button>
        </div>
        <p class="note" style="margin-top:var(--s-3)">La resolución espectral depende de la tasa de muestreo del navegador (típicamente 30–60 Hz). Ideal para detectar desbalances y resonancias de baja frecuencia.</p>
      </div>
    `);

    const $ = (s) => root.querySelector(s);
    const N = 256;
    const buf = new Float32Array(N);
    let w = 0, filled = 0;
    const times = [];
    const chart = new SpectrumChart($("#vb-canvas"), { height: 210, logY: true });
    const state = { running: false, raf: 0, listening: false, fs: 60 };

    const setStatus = (cls, t) => { $("#vb-status").className = "status " + cls; $("#vb-state").textContent = t; };

    const onMotion = (e) => {
      const g = e.accelerationIncludingGravity || e.acceleration || { x: 0, y: 0, z: 0 };
      const mag = Math.hypot(g.x || 0, g.y || 0, g.z || 0);
      buf[w] = mag; w = (w + 1) % N; filled = Math.min(filled + 1, N);
      const now = performance.now();
      times.push(now); if (times.length > 32) times.shift();
    };

    const ordered = () => {
      const out = new Float32Array(N);
      for (let i = 0; i < N; i++) out[i] = buf[(w + i) % N];
      // remove DC (mean)
      let mean = 0; for (let i = 0; i < N; i++) mean += out[i]; mean /= N;
      for (let i = 0; i < N; i++) out[i] -= mean;
      return out;
    };

    const loop = () => {
      if (times.length > 4) {
        const dt = (times[times.length - 1] - times[0]) / (times.length - 1);
        if (dt > 0) state.fs = 1000 / dt;
      }
      const sig = ordered();
      const len = prevPow2(filled);
      if (len >= 32) {
        const { mags, peakHz } = spectrum(sig.subarray(0, len), state.fs);
        chart.render(mags, { sampleRate: state.fs, peakHz });
        let rms = 0; for (let i = 0; i < len; i++) rms += sig[i] * sig[i];
        rms = Math.sqrt(rms / len);
        $("#vb-peak").textContent = peakHz ? peakHz.toFixed(1) + " Hz" : "—";
        $("#vb-rms").textContent = rms.toFixed(2);
        $("#vb-fs").textContent = state.fs.toFixed(0) + " Hz";
      }
      state.raf = requestAnimationFrame(loop);
    };

    async function start() {
      if (!state.listening) {
        const res = await requestMotion({
          kind: "motion",
          title: "Acceso a sensores de movimiento",
          message: "Para estimar el espectro de vibración, VANTAR procesa la señal del acelerómetro localmente en tu dispositivo.",
        });
        if (res !== "granted") {
          setStatus("", res === "insecure" ? "Requiere HTTPS" : res === "unsupported" ? "No soportado" : "Permiso denegado");
          return;
        }
        window.addEventListener("devicemotion", onMotion);
        state.listening = true;
      }
      state.running = true;
      setStatus("live", "Analizando");
      $("#vb-start").disabled = true; $("#vb-stop").disabled = false;
      cancelAnimationFrame(state.raf); state.raf = requestAnimationFrame(loop);
    }
    function stop() {
      state.running = false; cancelAnimationFrame(state.raf);
      setStatus("ok", "Detenido");
      $("#vb-start").disabled = false; $("#vb-stop").disabled = true;
    }

    $("#vb-start").addEventListener("click", start);
    $("#vb-stop").addEventListener("click", stop);

    return function cleanup() {
      cancelAnimationFrame(state.raf);
      if (state.listening) window.removeEventListener("devicemotion", onMotion);
      chart.destroy();
    };
  },
};
