// VANTAR Dynamics — Clinical level / inclinometer (pitch & roll)
import { toolShell } from "./_shell.js";
import { requestMotion } from "../ui/permissions.js";

const meta = {
  id: "inclinometer",
  name: "Nivel / Inclinómetro",
  sub: "Ángulos de inclinación con burbuja de nivel",
  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><circle cx="12" cy="12" r="2.5"/></svg>`,
};

export default {
  ...meta,
  render(root) {
    root.innerHTML = toolShell(meta, `
      <div class="card card-pad">
        <span class="status" id="in-status"><span class="dot"></span><span id="in-state">En espera</span></span>
        <div class="level" id="in-level">
          <div class="ring" style="width:76%;height:76%"></div>
          <div class="ring" style="width:50%;height:50%"></div>
          <div class="target"></div>
          <div class="cross-h"></div><div class="cross-v"></div>
          <div class="bubble" id="in-bubble"></div>
        </div>
        <div class="readout-grid">
          <div class="readout x"><div class="lbl">Pitch</div><div class="val" id="in-pitch">0.0°</div></div>
          <div class="readout y"><div class="lbl">Roll</div><div class="val" id="in-roll">0.0°</div></div>
          <div class="readout z"><div class="lbl">Inclin.</div><div class="val" id="in-tilt">0.0°</div></div>
        </div>
        <div class="controls">
          <button class="btn btn-primary btn-sm" id="in-start">Iniciar nivel</button>
          <button class="btn btn-ghost btn-sm" id="in-zero" disabled>Calibrar a 0</button>
          <button class="btn btn-soft btn-sm" id="in-stop" disabled>Detener</button>
        </div>
        <p class="note" style="margin-top:var(--s-3)">La burbuja se vuelve verde cuando la superficie está nivelada (±0.8°). Usá "Calibrar a 0" para fijar una referencia relativa.</p>
      </div>
    `);

    const $ = (s) => root.querySelector(s);
    const state = { running: false, raf: 0, listening: false, beta: 0, gamma: 0, offB: 0, offG: 0 };
    const setStatus = (cls, t) => { $("#in-status").className = "status " + cls; $("#in-state").textContent = t; };

    const onOrient = (e) => {
      if (e.beta === null) return;
      state.beta = e.beta;   // front-back tilt
      state.gamma = e.gamma; // left-right tilt
    };

    const render = () => {
      const pitch = clampAngle(state.beta - state.offB);
      const roll = clampAngle(state.gamma - state.offG);
      const tilt = Math.min(90, Math.hypot(pitch, roll));
      $("#in-pitch").textContent = pitch.toFixed(1) + "°";
      $("#in-roll").textContent = roll.toFixed(1) + "°";
      $("#in-tilt").textContent = tilt.toFixed(1) + "°";

      const level = $("#in-level");
      const R = level.clientWidth / 2 - 30;
      const nx = Math.max(-1, Math.min(1, roll / 45));
      const ny = Math.max(-1, Math.min(1, pitch / 45));
      const bubble = $("#in-bubble");
      bubble.style.left = `calc(50% + ${nx * R}px)`;
      bubble.style.top = `calc(50% + ${ny * R}px)`;
      const centered = tilt < 0.8;
      bubble.classList.toggle("centered", centered);

      state.raf = requestAnimationFrame(render);
    };

    async function start() {
      if (!state.listening) {
        const res = await requestMotion({
          kind: "motion",
          title: "Acceso a orientación",
          message: "El inclinómetro usa el giroscopio/orientación del dispositivo para medir ángulos. Todo se procesa localmente.",
        });
        if (res !== "granted") {
          setStatus("", res === "insecure" ? "Requiere HTTPS" : res === "unsupported" ? "No soportado" : "Permiso denegado");
          return;
        }
        window.addEventListener("deviceorientation", onOrient);
        state.listening = true;
      }
      state.running = true;
      setStatus("live", "Nivelando");
      cancelAnimationFrame(state.raf); state.raf = requestAnimationFrame(render);
      $("#in-start").disabled = true; $("#in-zero").disabled = false; $("#in-stop").disabled = false;
    }
    function zero() { state.offB = state.beta; state.offG = state.gamma; }
    function stop() {
      state.running = false; cancelAnimationFrame(state.raf);
      setStatus("ok", "Detenido");
      $("#in-start").disabled = false; $("#in-zero").disabled = true; $("#in-stop").disabled = true;
    }

    $("#in-start").addEventListener("click", start);
    $("#in-zero").addEventListener("click", zero);
    $("#in-stop").addEventListener("click", stop);

    return function cleanup() {
      cancelAnimationFrame(state.raf);
      if (state.listening) window.removeEventListener("deviceorientation", onOrient);
    };
  },
};

function clampAngle(a) { while (a > 180) a -= 360; while (a < -180) a += 360; return a; }
