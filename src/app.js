// VANTAR Dynamics — Application orchestrator
// Tab router, toolbox registry/mounting, modal wiring, PWA registration.

import { renderPortfolio, initModal } from "./ui/portfolio.js";
import { renderContact } from "./ui/contact.js";
import { renderDiagnostics } from "./ui/diagnostics.js";
import { initBrandTab } from "./ui/brand.js";
import { detectCapabilities, toolAvailable } from "./lib/capabilities.js";

import accelerometer from "./tools/accelerometer.js";
import vibration from "./tools/vibration.js";
import magnetometer from "./tools/magnetometer.js";
import luxmeter from "./tools/luxmeter.js";
import soundmeter from "./tools/soundmeter.js";
import inclinometer from "./tools/inclinometer.js";

const TOOLS = [accelerometer, vibration, magnetometer, luxmeter, soundmeter, inclinometer];
const $ = (s, r = document) => r.querySelector(s);
const CAPS = detectCapabilities();

/* ----------------------------- Tab routing ----------------------------- */
const VIEWS = { home: "#view-home", tools: "#view-tools", brand: "#view-brand", contact: "#view-contact" };

function showTab(tab) {
  Object.entries(VIEWS).forEach(([k, sel]) =>
    $(sel).classList.toggle("is-active", k === tab)
  );
  document.querySelectorAll("[data-tab]").forEach((b) =>
    b.classList.toggle("is-active", b.dataset.tab === tab)
  );
  if (tab === "tools") unmountTool(); // always land on the toolbox grid
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

function initNav() {
  // Covers both the bottom nav (.navbtn) and the desktop top nav buttons.
  document.querySelectorAll("[data-tab]").forEach((b) =>
    b.addEventListener("click", () => showTab(b.dataset.tab))
  );
  // Hero CTA buttons
  document.querySelectorAll("[data-go]").forEach((b) =>
    b.addEventListener("click", () => showTab(b.dataset.go))
  );
}

/* --------------------------- Toolbox registry -------------------------- */
let activeCleanup = null;

function renderToolGrid() {
  const grid = $("#tool-grid");
  grid.innerHTML = TOOLS.map((t) => {
    const ok = toolAvailable(t.id, CAPS);
    const badge = ok ? "" :
      `<span class="tc-badge">${CAPS.likelyMobile ? "No disponible" : "Mejor en celular"}</span>`;
    return `
    <button class="card toolcard${ok ? "" : " unavail"}" data-tool="${t.id}" aria-label="${t.name}">
      <div class="ic">${t.icon}</div>
      <div class="tc-title">${t.name}</div>
      <div class="tc-sub">${t.sub}</div>
      ${badge}
    </button>`;
  }).join("");
  grid.querySelectorAll("[data-tool]").forEach((btn) =>
    btn.addEventListener("click", () => mountTool(btn.dataset.tool))
  );
  renderMobileHint();
}

// On a desktop/non-touch device most motion sensors aren't usable — invite the
// user to open the site on their phone for the full instrument set.
function renderMobileHint() {
  if (CAPS.likelyMobile) return;
  const grid = $("#tool-grid");
  if (!grid || grid.parentElement.querySelector(".mobile-hint")) return;
  const url = location.origin + location.pathname;
  const hint = document.createElement("div");
  hint.className = "card card-pad mobile-hint";
  hint.innerHTML = `
    <span class="mh-ico" aria-hidden="true">
      <svg viewBox="0 0 100 100" stroke="#fff" fill="none">
        <line x1="22" y1="22" x2="44" y2="64" stroke-width="7" stroke-linecap="round"/>
        <line x1="78" y1="22" x2="56" y2="64" stroke-width="2.5"/>
        <circle cx="50" cy="75" r="9" stroke-width="2.5"/>
        <circle cx="78" cy="22" r="5" fill="#D49A17"/><circle cx="67" cy="43" r="5" fill="#D49A17"/><circle cx="56" cy="64" r="5" fill="#D49A17"/>
      </svg>
    </span>
    <div>
      <h3>Mejor desde tu celular</h3>
      <p>Los instrumentos usan los sensores del teléfono (acelerómetro, giroscopio, magnetómetro, luz). En esta PC algunos no están disponibles — el sonómetro sí funciona con tu micrófono.</p>
      <button class="mh-url" type="button" title="Copiar enlace">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
        ${url.replace(/^https?:\/\//, "")}
      </button>
    </div>`;
  grid.parentElement.insertBefore(hint, grid);
  const btn = hint.querySelector(".mh-url");
  btn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(url); btn.lastChild.textContent = " ¡Enlace copiado!"; }
    catch { btn.lastChild.textContent = " " + url.replace(/^https?:\/\//, ""); }
  });
}

function mountTool(id) {
  const tool = TOOLS.find((t) => t.id === id);
  if (!tool) return;
  unmountTool();
  $("#tools-home").classList.add("hidden");
  const stage = $("#tool-stage");
  activeCleanup = tool.render(stage) || null;
  // Wire the back button rendered by the tool shell.
  const back = stage.querySelector("[data-tool-back]");
  if (back) back.addEventListener("click", unmountTool);
  window.scrollTo({ top: 0 });
}

function unmountTool() {
  if (activeCleanup) { try { activeCleanup(); } catch {} activeCleanup = null; }
  const stage = $("#tool-stage");
  if (stage) stage.innerHTML = "";
  const home = $("#tools-home");
  if (home) home.classList.remove("hidden");
}

/* ------------------------------ PWA / SW ------------------------------- */
function registerSW() {
  if (!("serviceWorker" in navigator)) return;
  // Auto-heal stale installs: when a new service worker takes control, reload
  // once so the page runs the freshest code (fixes the "old cached JS" trap).
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    location.reload();
  });
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").then((reg) => {
      reg.update();
      reg.addEventListener("updatefound", () => {
        const sw = reg.installing;
        if (sw) sw.addEventListener("statechange", () => {
          if (sw.state === "installed" && navigator.serviceWorker.controller) sw.postMessage("skip");
        });
      });
    }).catch(() => {/* offline is best-effort */});
  });
}

/* -------------------------------- Boot --------------------------------- */
// Each step is isolated: a failure in any optional render must never take down
// navigation. Navigation + modal are wired FIRST so the tabs always work.
function step(label, fn) {
  try { fn(); } catch (err) { console.error(`[boot] ${label} failed:`, err); }
}
function boot() {
  step("initNav", initNav);
  step("initModal", initModal);
  step("portfolio", renderPortfolio);
  step("contact", renderContact);
  step("toolGrid", renderToolGrid);
  step("diagnostics", renderDiagnostics);
  step("brandTab", initBrandTab);
  step("serviceWorker", registerSW);
}

document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", boot)
  : boot();
