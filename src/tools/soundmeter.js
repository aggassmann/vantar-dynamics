// VANTAR Dynamics — Sound level meter + audio spectrum (Web Audio API)
import { toolShell, fallback } from "./_shell.js";
import { SpectrumChart } from "../lib/chart.js";
import { requestMic } from "../ui/permissions.js";

const meta = {
  id: "soundmeter",
  name: "Sonómetro & espectro",
  sub: "Nivel relativo (dB) y análisis de frecuencias de audio",
  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/></svg>`,
};

export default {
  ...meta,
  render(root) {
    const supported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.AudioContext);
    root.innerHTML = toolShell(meta, `
      <div class="card card-pad">
        <span class="status" id="sd-status"><span class="dot"></span><span id="sd-state">En espera</span></span>
        <div class="center" style="margin:var(--s-5) 0 var(--s-2)">
          <div class="bigval mono" id="sd-db">−∞<span class="unit">dB</span></div>
        </div>
        <div class="bar"><i id="sd-bar"></i></div>
        <div class="scale"><span>silencio</span><span id="sd-peakhold" class="mono">pico —</span><span>fuerte</span></div>
        <div class="canvas-wrap"><canvas id="sd-canvas"></canvas></div>
        <p class="note" style="margin-top:var(--s-3)">Espectro de audio (FFT en vivo). Útil para localizar siseos de fuga (alta frecuencia) o ruidos mecánicos repetitivos. El nivel es <b>relativo (dBFS)</b>, no un dB SPL calibrado.</p>
        <div class="controls">
          <button class="btn btn-primary btn-sm" id="sd-start" ${supported ? "" : "disabled"}>Activar micrófono</button>
          <button class="btn btn-ghost btn-sm" id="sd-stop" disabled>Detener</button>
        </div>
        ${supported ? "" : fallback("Tu navegador no expone el micrófono vía <b>getUserMedia</b> o falta <b>AudioContext</b>. Requiere HTTPS y un gesto del usuario.")}
      </div>
    `);

    const $ = (s) => root.querySelector(s);
    const chart = new SpectrumChart($("#sd-canvas"), { height: 180, maxFreq: 8000, logY: true });
    const state = { ctx: null, stream: null, analyser: null, raf: 0, peak: -Infinity };
    const setStatus = (cls, t) => { $("#sd-status").className = "status " + cls; $("#sd-state").textContent = t; };

    async function start() {
      const stream = await requestMic({
        kind: "mic",
        title: "Acceso al micrófono",
        message: "VANTAR analiza el audio en tiempo real para medir niveles y frecuencias. El audio se procesa localmente y no se graba ni se envía a ningún servidor.",
      });
      if (stream === "insecure") { setStatus("", "Requiere HTTPS"); return; }
      if (!stream) { setStatus("", "Permiso denegado"); return; }

      state.stream = stream;
      const Ctx = window.AudioContext || window.webkitAudioContext;
      state.ctx = new Ctx();
      const src = state.ctx.createMediaStreamSource(stream);
      const analyser = state.ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.4;
      src.connect(analyser);
      state.analyser = analyser;

      const bins = analyser.frequencyBinCount;
      const freq = new Uint8Array(bins);
      const time = new Float32Array(analyser.fftSize);
      const mags = new Float32Array(bins);
      const sr = state.ctx.sampleRate;

      const loop = () => {
        analyser.getByteFrequencyData(freq);
        analyser.getFloatTimeDomainData(time);

        // RMS -> dBFS
        let sum = 0; for (let i = 0; i < time.length; i++) sum += time[i] * time[i];
        const rms = Math.sqrt(sum / time.length);
        const db = 20 * Math.log10(rms + 1e-8);
        $("#sd-db").innerHTML = `${db <= -80 ? "−∞" : db.toFixed(1)}<span class="unit">dBFS</span>`;
        $("#sd-bar").style.width = Math.max(0, Math.min(100, ((db + 80) / 80) * 100)) + "%";
        if (db > state.peak) { state.peak = db; $("#sd-peakhold").textContent = `pico ${db.toFixed(1)} dB`; }

        // Spectrum + peak frequency
        let peakBin = 0, peakV = 0;
        for (let i = 0; i < bins; i++) {
          mags[i] = freq[i] / 255;
          if (mags[i] > peakV && (i * sr) / analyser.fftSize < 8000) { peakV = mags[i]; peakBin = i; }
        }
        chart.render(mags, { sampleRate: sr, peakHz: (peakBin * sr) / analyser.fftSize });

        state.raf = requestAnimationFrame(loop);
      };

      setStatus("live", "Escuchando");
      $("#sd-start").disabled = true; $("#sd-stop").disabled = false;
      state.raf = requestAnimationFrame(loop);
    }

    function stop() {
      cancelAnimationFrame(state.raf);
      if (state.stream) state.stream.getTracks().forEach((t) => t.stop());
      if (state.ctx) { try { state.ctx.close(); } catch {} }
      state.stream = state.ctx = state.analyser = null; state.peak = -Infinity;
      setStatus("ok", "Detenido");
      $("#sd-start").disabled = false; $("#sd-stop").disabled = true;
    }

    $("#sd-start").addEventListener("click", start);
    $("#sd-stop").addEventListener("click", stop);

    return function cleanup() {
      cancelAnimationFrame(state.raf);
      if (state.stream) state.stream.getTracks().forEach((t) => t.stop());
      if (state.ctx) { try { state.ctx.close(); } catch {} }
      chart.destroy();
    };
  },
};
