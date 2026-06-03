// VANTAR Dynamics — Application orchestrator
// Tab router, toolbox registry/mounting, modal wiring, PWA registration.

import { renderPortfolio, initModal } from "./ui/portfolio.js";
import { renderContact } from "./ui/contact.js";
import { renderDiagnostics } from "./ui/diagnostics.js";

import accelerometer from "./tools/accelerometer.js";
import vibration from "./tools/vibration.js";
import magnetometer from "./tools/magnetometer.js";
import luxmeter from "./tools/luxmeter.js";
import soundmeter from "./tools/soundmeter.js";
import inclinometer from "./tools/inclinometer.js";

const TOOLS = [accelerometer, vibration, magnetometer, luxmeter, soundmeter, inclinometer];
const $ = (s, r = document) => r.querySelector(s);

/* ----------------------------- Tab routing ----------------------------- */
const VIEWS = { home: "#view-home", tools: "#view-tools", contact: "#view-contact" };

function showTab(tab) {
  Object.entries(VIEWS).forEach(([k, sel]) =>
    $(sel).classList.toggle("is-active", k === tab)
  );
  document.querySelectorAll(".navbtn").forEach((b) =>
    b.classList.toggle("is-active", b.dataset.tab === tab)
  );
  if (tab === "tools") unmountTool(); // always land on the toolbox grid
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

function initNav() {
  document.querySelectorAll(".navbtn").forEach((b) =>
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
  grid.innerHTML = TOOLS.map((t) => `
    <button class="card toolcard" data-tool="${t.id}" aria-label="${t.name}">
      <div class="ic">${t.icon}</div>
      <div class="tc-title">${t.name}</div>
      <div class="tc-sub">${t.sub}</div>
    </button>`).join("");
  grid.querySelectorAll("[data-tool]").forEach((btn) =>
    btn.addEventListener("click", () => mountTool(btn.dataset.tool))
  );
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
  step("serviceWorker", registerSW);
}

document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", boot)
  : boot();
