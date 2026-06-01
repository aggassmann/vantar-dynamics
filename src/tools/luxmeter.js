// VANTAR Dynamics — Ambient light meter (lux)
import { toolShell, fallback } from "./_shell.js";

const meta = {
  id: "luxmeter",
  name: "Luxómetro",
  sub: "Iluminancia ambiental en lux (lx)",
  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19"/></svg>`,
};

// Rough reference scale for human-friendly labeling.
const ZONES = [
  [0, 10, "Oscuridad"], [10, 50, "Penumbra"], [50, 200, "Interior tenue"],
  [200, 500, "Oficina"], [500, 1000, "Bien iluminado"], [1000, 10000, "Día nublado"],
  [10000, 1e9, "Luz solar directa"],
];

export default {
  ...meta,
  render(root) {
    const supported = "AmbientLightSensor" in window;
    root.innerHTML = toolShell(meta, `
      <div class="card card-pad">
        <span class="status" id="lx-status"><span class="dot"></span><span id="lx-state">En espera</span></span>
        <div class="center" style="margin:var(--s-6) 0 var(--s-2)">
          <div class="bigval mono" id="lx-val">0<span class="unit">lx</span></div>
          <p class="eyebrow" id="lx-zone" style="margin-top:var(--s-2)">—</p>
        </div>
        <div class="bar"><i id="lx-bar"></i></div>
        <div class="scale"><span>0</span><span>oficina</span><span>10k+</span></div>
        <div class="controls">
          <button class="btn btn-primary btn-sm" id="lx-start" ${supported ? "" : "disabled"}>Iniciar medición</button>
          <button class="btn btn-ghost btn-sm" id="lx-stop" disabled>Detener</button>
        </div>
        ${supported ? "" : fallback("La <b>AmbientLightSensor API</b> está restringida o no soportada en este navegador (por privacidad, muchos navegadores la deshabilitan). Probá en Chrome para Android sobre HTTPS. iOS Safari no expone este sensor.")}
      </div>
    `);

    const $ = (s) => root.querySelector(s);
    let sensor = null;
    const setStatus = (cls, t) => { $("#lx-status").className = "status " + cls; $("#lx-state").textContent = t; };

    function update(lux) {
      $("#lx-val").innerHTML = `${Math.round(lux)}<span class="unit">lx</span>`;
      const zone = ZONES.find(([a, b]) => lux >= a && lux < b);
      $("#lx-zone").textContent = zone ? zone[2] : "—";
      // log scale bar (1 .. 100k)
      const pct = Math.max(0, Math.min(100, (Math.log10(lux + 1) / 5) * 100));
      $("#lx-bar").style.width = pct + "%";
    }

    async function start() {
      if (!("AmbientLightSensor" in window)) return;
      try {
        if (navigator.permissions?.query) {
          try {
            const p = await navigator.permissions.query({ name: "ambient-light-sensor" });
            if (p.state === "denied") { setStatus("", "Permiso denegado"); return; }
          } catch {}
        }
        sensor = new AmbientLightSensor({ frequency: 5 });
        sensor.addEventListener("reading", () => update(sensor.illuminance || 0));
        sensor.addEventListener("error", (e) => setStatus("", e.error?.name === "NotAllowedError" ? "Permiso denegado" : "No disponible"));
        sensor.start();
        setStatus("live", "Midiendo");
        $("#lx-start").disabled = true; $("#lx-stop").disabled = false;
      } catch { setStatus("", "No disponible"); }
    }
    function stop() {
      if (sensor) { try { sensor.stop(); } catch {} sensor = null; }
      setStatus("ok", "Detenido");
      $("#lx-start").disabled = false; $("#lx-stop").disabled = true;
    }

    $("#lx-start").addEventListener("click", start);
    $("#lx-stop").addEventListener("click", stop);

    return function cleanup() { if (sensor) { try { sensor.stop(); } catch {} } };
  },
};
