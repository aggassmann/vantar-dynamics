// VANTAR Dynamics — Magnetometer (magnetic field, µT)
import { toolShell, fallback } from "./_shell.js";

const meta = {
  id: "magnetometer",
  name: "Magnetómetro",
  sub: "Intensidad del campo magnético en microteslas (µT)",
  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v8a6 6 0 0 0 12 0V3"/><path d="M6 7h4M14 7h4"/></svg>`,
};

export default {
  ...meta,
  render(root) {
    const supported = "Magnetometer" in window;
    root.innerHTML = toolShell(meta, `
      <div class="card card-pad">
        <span class="status" id="mg-status"><span class="dot"></span><span id="mg-state">En espera</span></span>
        <div class="center" style="margin:var(--s-5) 0 var(--s-2)">
          <div class="bigval mono" id="mg-mag">0.0<span class="unit">µT</span></div>
        </div>
        <div class="bar"><i id="mg-bar"></i></div>
        <div class="scale"><span>0</span><span>Tierra ≈ 25–65 µT</span><span>120+</span></div>
        <div class="readout-grid" style="margin-top:var(--s-5)">
          <div class="readout x"><div class="lbl">Bx</div><div class="val" id="mg-x">0.0</div></div>
          <div class="readout y"><div class="lbl">By</div><div class="val" id="mg-y">0.0</div></div>
          <div class="readout z"><div class="lbl">Bz</div><div class="val" id="mg-z">0.0</div></div>
        </div>
        <p class="note" id="mg-note" style="margin-top:var(--s-4)">Valores muy por encima del campo terrestre indican material ferroso o una fuente magnética cercana.</p>
        <div class="controls">
          <button class="btn btn-primary btn-sm" id="mg-start" ${supported ? "" : "disabled"}>Iniciar medición</button>
          <button class="btn btn-ghost btn-sm" id="mg-stop" disabled>Detener</button>
        </div>
        ${supported ? "" : fallback("La <b>Generic Magnetometer API</b> no está disponible en este navegador. En Chrome para Android suele requerir activar <i>chrome://flags/#enable-generic-sensor-extra-classes</i> y servir vía HTTPS.")}
      </div>
    `);

    const $ = (s) => root.querySelector(s);
    let sensor = null;
    const setStatus = (cls, t) => { $("#mg-status").className = "status " + cls; $("#mg-state").textContent = t; };

    function update(x, y, z) {
      const mag = Math.hypot(x, y, z);
      $("#mg-x").textContent = x.toFixed(1);
      $("#mg-y").textContent = y.toFixed(1);
      $("#mg-z").textContent = z.toFixed(1);
      $("#mg-mag").innerHTML = `${mag.toFixed(1)}<span class="unit">µT</span>`;
      $("#mg-bar").style.width = Math.min(100, (mag / 120) * 100) + "%";
      const anomaly = mag > 80 || mag < 10;
      $("#mg-note").textContent = anomaly
        ? "⚠️ Anomalía detectada: campo fuera del rango terrestre típico (posible material ferroso o distorsión)."
        : "Campo dentro del rango terrestre. Acercá el teléfono a un objeto metálico para detectar variaciones.";
    }

    async function start() {
      if (!("Magnetometer" in window)) return;
      try {
        if (navigator.permissions?.query) {
          try {
            const p = await navigator.permissions.query({ name: "magnetometer" });
            if (p.state === "denied") { setStatus("", "Permiso denegado"); return; }
          } catch { /* some browsers lack this descriptor */ }
        }
        sensor = new Magnetometer({ frequency: 30, referenceFrame: "device" });
        sensor.addEventListener("reading", () => update(sensor.x || 0, sensor.y || 0, sensor.z || 0));
        sensor.addEventListener("error", (e) => {
          setStatus("", e.error?.name === "NotAllowedError" ? "Permiso denegado" : "Sensor no disponible");
        });
        sensor.start();
        setStatus("live", "Midiendo");
        $("#mg-start").disabled = true; $("#mg-stop").disabled = false;
      } catch (err) {
        setStatus("", "No disponible");
      }
    }
    function stop() {
      if (sensor) { try { sensor.stop(); } catch {} sensor = null; }
      setStatus("ok", "Detenido");
      $("#mg-start").disabled = false; $("#mg-stop").disabled = true;
    }

    $("#mg-start").addEventListener("click", start);
    $("#mg-stop").addEventListener("click", stop);

    return function cleanup() { if (sensor) { try { sensor.stop(); } catch {} } };
  },
};
