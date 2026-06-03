// VANTAR Dynamics — On-device sensor diagnostics
// Surfaces capability detection + a live motion test so issues are visible
// (and reportable) directly on the phone.
import { requestMotion, isSecure } from "./permissions.js";

const yes = `<span style="color:var(--good);font-weight:600">disponible</span>`;
const no = `<span style="color:var(--bad);font-weight:600">no</span>`;
const row = (k, v) => `<li><span class="k">${k}</span><span class="v">${v}</span></li>`;

export function renderDiagnostics() {
  const table = document.getElementById("diag-table");
  if (!table) return;

  const iosGesture =
    (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function");

  const caps = [
    ["Contexto seguro (HTTPS)", isSecure() ? yes : `${no} — los sensores no funcionarán`],
    ["DeviceMotion", typeof DeviceMotionEvent !== "undefined" ? yes : no],
    ["DeviceOrientation", typeof DeviceOrientationEvent !== "undefined" ? yes : no],
    ["Gesto de permiso (iOS)", iosGesture ? "requerido" : "no necesario"],
    ["Magnetometer", "Magnetometer" in window ? yes : no],
    ["AmbientLightSensor", "AmbientLightSensor" in window ? yes : no],
    ["Micrófono (getUserMedia)", navigator.mediaDevices?.getUserMedia ? yes : no],
    ["AudioContext", (window.AudioContext || window.webkitAudioContext) ? yes : no],
  ];
  table.innerHTML = `<ul class="spec-list">${caps.map(([k, v]) => row(k, v)).join("")}</ul>`;

  const btn = document.getElementById("diag-test");
  const live = document.getElementById("diag-live");
  const statusPill = document.getElementById("diag-status");
  if (!btn) return;

  let listening = false, count = 0, handler = null, timer = 0;

  btn.addEventListener("click", async () => {
    if (listening) return;
    btn.disabled = true;
    statusPill.className = "status";
    statusPill.querySelector("span:last-child").textContent = "solicitando…";

    const res = await requestMotion({
      kind: "motion",
      title: "Probar sensor de movimiento",
      message: "Vamos a leer el acelerómetro unos segundos para verificar que tu dispositivo entrega datos.",
    });
    if (res !== "granted") {
      statusPill.querySelector("span:last-child").textContent = res;
      live.innerHTML = `<b style="color:var(--bad)">No se pudo acceder (${res}).</b> En Chrome Android: candado/⋮ → Configuración del sitio → Sensores de movimiento → Permitir.`;
      btn.disabled = false;
      return;
    }

    count = 0; listening = true;
    statusPill.className = "status live";
    statusPill.querySelector("span:last-child").textContent = "leyendo";

    handler = (e) => {
      count++;
      const a = e.acceleration || {};
      const g = e.accelerationIncludingGravity || {};
      const f = (v) => (v == null ? "—" : (+v).toFixed(2));
      const accZero = a.x === 0 && a.y === 0 && a.z === 0;
      live.innerHTML =
        `eventos: <b>${count}</b> · intervalo: ${e.interval ? e.interval.toFixed(1) + "ms" : "—"}<br>` +
        `acceleration: [${f(a.x)}, ${f(a.y)}, ${f(a.z)}]${accZero ? " <b style='color:var(--warn)'>(en ceros)</b>" : ""}<br>` +
        `incl. gravedad: [${f(g.x)}, ${f(g.y)}, ${f(g.z)}]`;
    };
    window.addEventListener("devicemotion", handler);

    timer = setTimeout(() => {
      window.removeEventListener("devicemotion", handler);
      listening = false; btn.disabled = false;
      statusPill.className = count > 0 ? "status ok" : "status";
      statusPill.querySelector("span:last-child").textContent = count > 0 ? "OK" : "sin datos";
      if (count === 0) {
        live.innerHTML = `<b style="color:var(--bad)">No llegaron eventos de movimiento.</b> Probá en Chrome (no en un navegador in-app), movés el teléfono y revisá permisos del sitio.`;
      } else {
        live.innerHTML += `<br><b style="color:var(--good)">✓ Sensor activo (${count} eventos).</b> El acelerómetro debería funcionar.`;
      }
    }, 4000);
  });

  // expose a cleanup for safety (not strictly needed on the persistent home)
  renderDiagnostics._cleanup = () => {
    if (handler) window.removeEventListener("devicemotion", handler);
    clearTimeout(timer);
  };
}
