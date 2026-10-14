// VANTAR Dynamics — Application orchestrator
// Tab router, toolbox registry/mounting, modal wiring, PWA registration.

import { initModal } from "./ui/portfolio.js";
import { renderContact } from "./ui/contact.js";
import { renderFooter } from "./ui/footer.js";
import { initEstela } from "./ui/estela.js";
import { initPreguntas } from "./ui/preguntas.js";
import { initEstadisticas, evento } from "./ui/estadisticas.js";
import { detectCapabilities } from "./lib/capabilities.js";
import { initToolbox, entrarToolbox, salirToolbox, abrirInstrumento } from "./toolbox/index.js";
const $ = (s, r = document) => r.querySelector(s);
const CAPS = detectCapabilities();

/* ----------------------------- Tab routing ----------------------------- */
const VIEWS = { home: "#view-home", about: "#view-about", services: "#view-services", products: "#view-products", tools: "#view-tools", contact: "#view-contact", privacy: "#view-privacy" };
// Cada sección tiene su dirección (vantardynamics.com/#servicios) y su título de pestaña, así el botón
// «Atrás» del celular vuelve a la sección anterior en vez de salir del sitio.
const RUTAS = { home: "", about: "nosotros", services: "servicios", products: "productos", tools: "toolbox", contact: "contacto", privacy: "privacidad" };
const TITULOS = { about: "Quiénes somos", services: "Servicios", products: "Productos", tools: "Toolbox", contact: "Contacto", privacy: "Privacidad" };
const TITULO_BASE = document.title;

const SALIDA_MS = 240; // la página actual se desvanece antes de que entre la nueva
let cambioPendiente = null;

/** historial: "push" (clic del visitante), "replace" (al abrir el sitio) o "none" (Atrás / Adelante). */
function showTab(tab, historial = "push", y = 0) {
  const nueva = $(VIEWS[tab]);
  if (!nueva) return;
  const anterior = document.body.dataset.vista;
  document.querySelectorAll("[data-tab]").forEach((b) =>
    b.classList.toggle("is-active", b.dataset.tab === tab)
  );
  document.body.dataset.vista = tab; // el logo de la barra inferior se oculta en la portada
  document.title = TITULOS[tab] ? `${TITULOS[tab]} — VANTAR Dynamics` : TITULO_BASE;
  const url = RUTAS[tab] ? `#${RUTAS[tab]}` : location.pathname + location.search;
  if (historial === "replace") history.replaceState({ vista: tab }, "", url);
  else if (historial === "push" && tab !== anterior) {
    // se guarda dónde estaba el visitante para devolverlo ahí con «Atrás»
    history.replaceState({ ...history.state, y: window.scrollY }, "");
    history.pushState({ vista: tab }, "", url);
  }

  const actual = document.querySelector(".view.is-active:not(.saliendo)");
  const entrar = () => {
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("is-active", "saliendo"));
    nueva.classList.add("is-active");
    if (tab === "tools") entrarToolbox(); // siempre arranca en la lista de instrumentos
    // salto directo (sin el desplazamiento suave del CSS): la vista nueva entra ya en su lugar
    window.scrollTo({ top: y, behavior: "instant" });
  };

  if (tab !== "tools") salirToolbox(); // apaga sensores y micrófono al salir
  clearTimeout(cambioPendiente);
  if (actual === nueva) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
  if (!actual || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { entrar(); return; }
  actual.classList.add("saliendo");
  cambioPendiente = setTimeout(entrar, SALIDA_MS);
}

function initNav() {
  // Menú desplegable en pantallas angostas
  const nav = document.querySelector(".topnav");
  const toggle = document.querySelector(".nav-toggle");
  if (nav && toggle) {
    const cerrar = () => { nav.classList.remove("menu-abierto"); toggle.setAttribute("aria-expanded", "false"); };
    toggle.addEventListener("click", () => {
      const abierto = nav.classList.toggle("menu-abierto");
      toggle.setAttribute("aria-expanded", String(abierto));
    });
    nav.querySelectorAll("[data-tab]").forEach((b) => b.addEventListener("click", cerrar));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrar(); });
  }
  // Covers both the bottom nav (.navbtn) and the desktop top nav buttons.
  document.querySelectorAll("[data-tab]").forEach((b) =>
    b.addEventListener("click", () => showTab(b.dataset.tab))
  );
  // Hero CTA buttons
  document.querySelectorAll("[data-go]").forEach((b) =>
    b.addEventListener("click", () => {
      showTab(b.dataset.go);
      // «Pedí una demostración»: Contacto abre con el motivo ya elegido
      const tipo = document.getElementById("cf-type");
      if (b.dataset.motivo && tipo) tipo.value = b.dataset.motivo;
      if (b.dataset.motivo) evento(`demo-${b.dataset.motivo.includes("BalanSense") ? "balansense" : "vibrasense"}`);
    })
  );
}

/* Enlaces directos (QR de calcos, mails, redes): vantardynamics.com/#vibrasense */
const ENLACES = {
  inicio: ["home"], nosotros: ["about"], servicios: ["services"], productos: ["products"],
  toolbox: ["tools"], contacto: ["contact"], privacidad: ["privacy"],
  balansense: ["products", "#prod-balansense"], vibrasense: ["products", "#prod-vibrasense"],
  // instrumentos del Toolbox (los QR de «Abrilo en tu celular» llevan acá)
  vibraciones: ["tools", null, "vibraciones"], sonido: ["tools", null, "sonido"],
  nivel: ["tools", null, "nivel"], movimiento: ["tools", null, "movimiento"],
};

function abrirEnlace() {
  const destino = ENLACES[decodeURIComponent(location.hash.slice(1)).toLowerCase()];
  if (!destino) { showTab("home", "replace"); return; }
  const [tab, ancla, instrumento] = destino;
  const original = location.hash;
  showTab(tab, "replace");
  if (ancla) history.replaceState(history.state, "", original); // #vibrasense sigue llevando a la tarjeta al recargar
  if (instrumento) { setTimeout(() => abrirInstrumento(instrumento), SALIDA_MS + 60); return; }
  if (!ancla) return;
  setTimeout(() => {
    const el = $(ancla);
    if (!el) return;
    // en computadora la barra de navegación flota arriba: dejar el título debajo
    const barra = $(".bottomnav")?.getBoundingClientRect();
    const tapa = barra && barra.top < innerHeight / 2 ? barra.bottom : 0;
    // offsetTop no se altera por la animación de entrada de la vista (transform)
    let y = 0;
    for (let n = el; n; n = n.offsetParent) y += n.offsetTop;
    window.scrollTo({ top: y - tapa - 16, behavior: "instant" });
  }, SALIDA_MS + 60);
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
  step("contact", renderContact);
  step("footer", renderFooter);
  step("toolbox", () => initToolbox({ irA: showTab, caps: CAPS }));
  step("estela", initEstela);
  step("preguntas", initPreguntas);
  step("serviceWorker", registerSW);
  step("enlace", abrirEnlace);
  step("estadisticas", initEstadisticas);
  // Enlaces internos a una sección (<a href="#privacidad">): misma transición e historial que los botones
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    const destino = a && ENLACES[a.getAttribute("href").slice(1)];
    if (!destino || destino[1] || destino[2]) return;
    e.preventDefault();
    showTab(destino[0]);
  });
  // Atrás / Adelante. Las pantallas internas del Toolbox guardan { tb } y las maneja el Toolbox.
  // Una dirección escrita a mano (sin estado) se abre como enlace directo.
  window.addEventListener("popstate", (e) => {
    const s = e.state || {};
    const vista = s.vista || (s.tb ? "tools" : null);
    if (!vista) { abrirEnlace(); return; }
    if (vista !== document.body.dataset.vista) showTab(vista, "none", s.y || 0);
  });
}

document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", boot)
  : boot();
