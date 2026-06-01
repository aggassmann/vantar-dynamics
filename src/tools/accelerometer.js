// VANTAR Dynamics — Linear accelerometer (gravity-filtered) + CSV export
import { toolShell } from "./_shell.js";
import { RollingChart } from "../lib/chart.js";
import { requestMotion } from "../ui/permissions.js";
import { toCSV, downloadText, stampedName } from "../lib/csv.js";

const meta = {
  id: "accelerometer",
  name: "Acelerómetro lineal",
  sub: "Aceleración X · Y · Z filtrando la gravedad (m/s²)",
  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l3-8 4 16 3-8h4"/></svg>`,
};

export default {
  ...meta,
  render(root) {
    root.innerHTML = toolShell(meta, `
      <div class="card card-pad">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:var(--s-3)">
          <span class="status" id="ac-status"><span class="dot"></span><span id="ac-state">En espera</span></span>
          <span class="mono muted" id="ac-rate" style="font-size:.78rem">— Hz</span>
        </div>
        <div class="canvas-wrap"><canvas id="ac-canvas"></canvas></div>
        <div class="legend">
          <span><i style="background:var(--axis-x)"></i>X</span>
          <span><i style="background:var(--axis-y)"></i>Y</span>
          <span><i style="background:var(--axis-z)"></i>Z</span>
        </div>
        <div class="readout-grid" style="margin-top:var(--s-4)">
          <div class="readout x"><div class="lbl">Eje X</div><div class="val" id="ac-x">0.00</div></div>
          <div class="readout y"><div class="lbl">Eje Y</div><div class="val" id="ac-y">0.00</div></div>
          <div class="readout z"><div class="lbl">Eje Z</div><div class="val" id="ac-z">0.00</div></div>
        </div>
        <div class="controls">
          <button class="btn btn-primary btn-sm" id="ac-start">Iniciar captura</button>
          <button class="btn btn-ghost btn-sm" id="ac-pause" disabled>Pausar</button>
          <button class="btn btn-soft btn-sm" id="ac-export" disabled>Exportar CSV</button>
        </div>
        <p class="note" style="margin-top:var(--s-3)">Muestras grabadas: <b id="ac-count" class="mono">0</b>. La captura almacena lecturas crudas por eje con timestamp para exportar a CSV.</p>
      </div>
    `);

    const $ = (s) => root.querySelector(s);
    const chart = new RollingChart($("#ac-canvas"), {
      height: 210, capacity: 260,
      series: [
        { key: "x", color: getCSS("--axis-x") },
        { key: "y", color: getCSS("--axis-y") },
        { key: "z", color: getCSS("--axis-z") },
      ],
    });

    const state = {
      running: false, raf: 0, last: { x: 0, y: 0, z: 0 },
      gravity: { x: 0, y: 0, z: 0 }, useLinear: false,
      records: [], rateCount: 0, rateT: performance.now(),
    };

    const setStatus = (cls, text) => {
      const s = $("#ac-status"); s.className = "status " + cls;
      $("#ac-state").textContent = text;
    };

    const onMotion = (e) => {
      const lin = e.acceleration;
      let x, y, z;
      if (lin && lin.x !== null) {
        state.useLinear = true;
        x = lin.x; y = lin.y; z = lin.z;
      } else {
        // Estimate & subtract gravity via low-pass high-pass split.
        const g = e.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };
        const a = 0.85;
        state.gravity.x = a * state.gravity.x + (1 - a) * (g.x || 0);
        state.gravity.y = a * state.gravity.y + (1 - a) * (g.y || 0);
        state.gravity.z = a * state.gravity.z + (1 - a) * (g.z || 0);
        x = (g.x || 0) - state.gravity.x;
        y = (g.y || 0) - state.gravity.y;
        z = (g.z || 0) - state.gravity.z;
      }
      state.last = { x, y, z };
      state.rateCount++;
      if (state.running) {
        const now = performance.now();
        state.records.push({ iso: new Date().toISOString(), t: now.toFixed(2), x, y, z });
        $("#ac-count").textContent = state.records.length;
      }
    };

    const loop = () => {
      const { x, y, z } = state.last;
      chart.push([x, y, z]);
      chart.render();
      $("#ac-x").textContent = x.toFixed(2);
      $("#ac-y").textContent = y.toFixed(2);
      $("#ac-z").textContent = z.toFixed(2);
      const now = performance.now();
      if (now - state.rateT > 500) {
        const hz = (state.rateCount * 1000) / (now - state.rateT);
        $("#ac-rate").textContent = `${hz.toFixed(0)} Hz${state.useLinear ? "" : " · g-filt"}`;
        state.rateCount = 0; state.rateT = now;
      }
      state.raf = requestAnimationFrame(loop);
    };

    let listening = false;
    async function start() {
      if (!listening) {
        const res = await requestMotion({
          kind: "motion",
          title: "Acceso al acelerómetro",
          message: "VANTAR usa los sensores de movimiento de tu dispositivo para graficar la aceleración en tiempo real. Los datos no salen de tu teléfono.",
        });
        if (res !== "granted") {
          setStatus("", res === "insecure" ? "Requiere HTTPS" : res === "unsupported" ? "No soportado" : "Permiso denegado");
          return;
        }
        window.addEventListener("devicemotion", onMotion);
        listening = true;
        state.raf = requestAnimationFrame(loop);
      }
      state.running = true;
      setStatus("live", "Capturando");
      $("#ac-start").disabled = true;
      $("#ac-pause").disabled = false;
      $("#ac-export").disabled = false;
    }
    function pause() {
      state.running = false;
      setStatus("ok", "En pausa");
      $("#ac-start").disabled = false;
      $("#ac-pause").disabled = true;
      $("#ac-start").textContent = "Reanudar";
    }
    function exportCSV() {
      if (!state.records.length) return;
      const header = ["timestamp_iso", "t_ms", "accel_x_ms2", "accel_y_ms2", "accel_z_ms2"];
      const rows = state.records.map((r) => [r.iso, r.t, r.x.toFixed(5), r.y.toFixed(5), r.z.toFixed(5)]);
      downloadText(stampedName("vantar_accel"), toCSV(header, rows));
    }

    $("#ac-start").addEventListener("click", start);
    $("#ac-pause").addEventListener("click", pause);
    $("#ac-export").addEventListener("click", exportCSV);

    return function cleanup() {
      cancelAnimationFrame(state.raf);
      if (listening) window.removeEventListener("devicemotion", onMotion);
      chart.destroy();
    };
  },
};

function getCSS(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }
