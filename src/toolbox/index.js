// VANTAR Dynamics — Toolbox: navegación entre pantallas y medición con los sensores del celular

import { HTML, IC } from "./vistas.js";
import * as G from "./graficos.js";
import * as Vib from "./vibraciones.js";
import * as Snd from "./sonido.js";
import * as Mov from "./movimiento.js";
import * as A from "./almacen.js";
import { enviar, vigilarPendiente } from "./informe.js";
import { requestMotion, requestMic } from "../ui/permissions.js";
import { evento } from "../ui/estadisticas.js";
import * as datos from "../ui/datos.js";

const NOMBRE = { vib: "Vibraciones", snd: "Sonido", mov: "Movimiento", lvl: "Nivel e inclinación" };
const CTX = { maq: "Máquina", est: "Estructura", veh: "Vehículo", otro: "Otro", amb: "Ambiente" };
const CTX_SND = { maq: "Una máquina", amb: "El ambiente", otro: "Otro" };
const RES_VISTAS = ["vib-res", "snd-res", "mov-res", "tb-mail", "tb-enviado"];
const fmt = (n, d = 1) => (n == null || !isFinite(n) ? "—" : n.toLocaleString("es-AR", { minimumFractionDigits: d, maximumFractionDigits: d }));
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const fechaLarga = (t) => { const d = new Date(t); return `${d.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}, ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };
const fechaCorta = (t) => new Date(t).toLocaleDateString("es-AR", { day: "numeric", month: "long" });
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

let raiz, $, $$, irA, caps;
const estado = { vibctx: "maq", vibdur: "10", sndctx: "maq", snddur: "10", lvlmodo: "sup", graf: "acc", medicion: null, actual: "tb-inicio", mailDesde: 0 };
let limpiar = [];
let candado = null;

/* ------------------------------- utilidades ------------------------------- */
function alSalir(f) { limpiar.push(f); }
function detener() {
  limpiar.forEach((f) => { try { f(); } catch { /* ya detenido */ } });
  limpiar = [];
  if (candado) { candado.release().catch(() => {}); candado = null; }
}
async function pantallaEncendida() {
  try { if ("wakeLock" in navigator) candado = await navigator.wakeLock.request("screen"); } catch { /* no disponible */ }
}
const vibrar = (ms) => { try { navigator.vibrate && navigator.vibrate(ms); } catch { /* sin vibración */ } };
function cuentaRegresiva(vista, seg, alTerminar) {
  const v = $(`#${vista}`), arco = v.querySelector(".arco");
  let quedan = seg;
  v.querySelectorAll(".seg").forEach((s) => (s.textContent = quedan));
  if (arco) {
    arco.style.transition = "none"; arco.style.strokeDashoffset = 276.5;
    requestAnimationFrame(() => requestAnimationFrame(() => { arco.style.transition = `stroke-dashoffset ${seg}s linear`; arco.style.strokeDashoffset = 0; }));
  }
  const id = setInterval(() => {
    quedan--;
    v.querySelectorAll(".seg").forEach((s) => (s.textContent = Math.max(0, quedan)));
    if (quedan <= 0) { clearInterval(id); alTerminar(); }
  }, 1000);
  alSalir(() => clearInterval(id));
}
function bucle(f) {
  let id = 0, vivo = true;
  const paso = (t) => { f(t); if (vivo) id = requestAnimationFrame(paso); };
  id = requestAnimationFrame(paso);
  alSalir(() => { vivo = false; cancelAnimationFrame(id); });
}
function error(vista, txt) {
  const e = $(`#${vista} [data-error]`);
  if (!e) return;
  e.textContent = txt || "";
  e.hidden = !txt;
}
const textoPermiso = (r) => (r === "insecure" ? "Los sensores solo funcionan en la página segura (https://vantardynamics.com)." : r === "unsupported" ? "Este navegador no permite usar los sensores de movimiento. Probá con Chrome o Safari actualizados." : "Sin permiso no podemos medir. Si lo rechazaste, habilitalo en la configuración del navegador para este sitio y probá de nuevo.");

/* -------------------------------- pantallas ------------------------------- */
function mostrar(id, historial = "push") {
  detener();
  if (!$(`#${id}`)) id = "tb-inicio";
  $$(".tb-vista").forEach((v) => { if (v.tagName === "SECTION") v.classList.toggle("on", v.id === id); });
  estado.actual = id;
  if (historial === "push") history.pushState({ tb: id }, "", "#toolbox");
  else if (historial === "replace") history.replaceState({ tb: id }, "", "#toolbox");
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  if (id === "tb-inicio") refrescarInicio();
  if (id === "lvl") iniciarNivel();
  const prep = id.match(/^(vib|snd|mov)-prep$/);
  if (prep) refrescarCupo(prep[1]);
}

function refrescarCupo(k) {
  const q = A.quedan(k), usados = A.LIMITE - q;
  const em = $(`[data-quedan="${k}"]`);
  if (em && !caps.motion && USA_SENSORES.includes(k)) { em.textContent = "en el celular"; em.classList.remove("agotado"); }
  else if (em) {
    em.textContent = q > 0 ? (q === A.LIMITE ? "3 gratis" : `quedan ${q}`) : `vuelve el ${fechaCorta(A.liberaEl(k))}`;
    em.classList.toggle("agotado", q <= 0);
  }
  const c = $(`[data-cupo="${k}"]`);
  if (c) c.innerHTML = q > 0 ? `Medición <b>${usados + 1}</b> de ${A.LIMITE} gratis · se renuevan cada 30 días` : "";
}

function refrescarInicio() {
  ["vib", "snd", "mov"].forEach(refrescarCupo);
  const u = A.ultima(), r = $("#tb-retomar");
  r.hidden = !u;
  if (u) {
    const t = $("#tb-retomar-txt");
    t.replaceChildren("Tenés una medición sin enviar: ");
    const b = document.createElement("b"); b.textContent = NOMBRE[u.tipo];
    t.append(b, ` (${fechaLarga(u.fecha)}).`);
  }
}

// Enlace directo de cada instrumento (los QR de la pantalla «Abrilo en tu celular» llevan acá)
export const ENLACE = { vib: "vibraciones", snd: "sonido", lvl: "nivel", mov: "movimiento" };
const USA_SENSORES = ["vib", "lvl", "mov"];
const TXT_CELULAR = {
  vib: "Vibraciones usa el sensor de movimiento del teléfono, que la computadora no tiene. Escaneá el código y se abre directo en el instrumento.",
  lvl: "Nivel e inclinación usa los sensores de orientación del teléfono, que la computadora no tiene. Escaneá el código y se abre directo en el instrumento.",
  mov: "Movimiento usa el acelerómetro y el giróscopo del teléfono, que la computadora no tiene. Escaneá el código y se abre directo en el instrumento.",
};

/** En computadora: en vez del instrumento, el QR que lo abre en el celular. */
function pasarAlCelular(k) {
  const url = `https://vantardynamics.com/#${ENLACE[k]}`;
  $("#cel-ic").innerHTML = IC[k];
  $("#cel-nombre").textContent = NOMBRE[k];
  $("#cel-txt").textContent = TXT_CELULAR[k];
  const img = $("#cel-qr");
  img.src = `./assets/qr-${ENLACE[k]}.svg`;
  img.alt = `Código QR para abrir ${NOMBRE[k]} en el celular`;
  $("#cel-url").textContent = url.replace("https://", "");
  $("#cel-copiar").dataset.url = url;
  $("#cel-copiar").textContent = "Copiar el enlace";
  mostrar("tb-celular");
}

function abrir(k) {
  evento(`toolbox-${k}`);
  if (!caps.motion && USA_SENSORES.includes(k)) { pasarAlCelular(k); return; }
  if (k === "lvl") { mostrar("lvl"); return; }
  if (A.quedan(k) <= 0) {
    $("#tope-titulo").textContent = `Usaste tus 3 mediciones de ${NOMBRE[k]}`;
    $("#tope-txt").textContent = `Se libera una el ${fechaCorta(A.liberaEl(k))}. Si necesitás medir antes, escribinos y lo vemos.`;
    estado.tope = k;
    mostrar("tb-tope");
    return;
  }
  error(`${k}-prep`, "");
  mostrar(`${k}-prep`);
}

function elegir(grupo, v) {
  estado[grupo] = v;
  $$(`[data-grupo="${grupo}"] button`).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === v)));
  if (grupo === "vibdur") $('[data-medir="vib"]').textContent = `Medir ${v} segundos`;
  if (grupo === "snddur") $('[data-medir="snd"]').textContent = `Medir ${v} segundos`;
  if (grupo === "lvlmodo") cambiarModoNivel();
  const m = estado.medicion;
  if (m && ((grupo === "vibctx" && m.tipo === "vib") || (grupo === "sndctx" && m.tipo === "snd"))) {
    m.ctx = v;
    if (A.ultima()?.fecha === m.fecha) A.guardarUltima(m);
    pintarInterpretacion(m);
  }
}

/* ------------------------------- resultados ------------------------------- */
function pintarCalidad(vista, cal) {
  const caja = $(`#${vista} [data-calidad]`);
  if (!caja) return;
  caja.innerHTML = `<h3>Calidad de la medición: ${cal.nota}</h3><ul>${cal.items.map((i) => `<li>${i.ok ? IC.si : IC.aviso}<span></span></li>`).join("")}</ul>`;
  caja.querySelectorAll("li span").forEach((s, i) => (s.textContent = cal.items[i].txt));
}

function interpretacion(m) { return m.tipo === "vib" ? Vib.interpretar(m, m.ctx) : Snd.interpretar(m, m.ctx); }

function pintarInterpretacion(m) {
  const it = interpretacion(m);
  let esc = "";
  if (it.escala) {
    const cols = it.escala.cols.map((c) => `${c}fr`).join(" ");
    esc = `<div class="tb-escala"><div class="pista" style="grid-template-columns:${cols}">${it.escala.zonas.map((z) => `<i style="background:${z.color}"></i>`).join("")}<span class="marca" style="left:calc(${it.escala.pct.toFixed(1)}% - 2px)"></span></div><div class="rotulos" style="grid-template-columns:${cols}">${it.escala.zonas.map((z) => `<span>${z.nombre}</span>`).join("")}</div></div>`;
  }
  $(`#${m.tipo}-res [data-interp]`).innerHTML = `<span class="tb-chip ${it.clase}">${it.chip}</span>${esc}<p class="tb-por">${it.txt}</p>`;
}

function dibujarVib(m, cEsp, cVs) {
  const pico = m.fDom ? { f: m.fDom, a: m.aDom, rotulo: `${fmt(m.fDom)} Hz` } : null;
  G.espectro(cEsp, m.esp.f, m.esp.a, { maxF: m.fMax, pico, desde: 2 });
  if (cVs) G.comparativo(cVs, m.fMax, 800);
}
function dibujarSnd(m, c) {
  G.espectro(c, m.esp.f, m.esp.a, { maxF: 8000, rotulo: (v) => (v >= 1000 ? `${fmt(v / 1000, v % 1000 ? 1 : 0)}k` : fmt(v, 0)), unidad: "", desde: 50, pico: m.marcado ? { f: m.tono, a: m.aTono, rotulo: `${Math.round(m.tono).toLocaleString("es-AR")} Hz` } : null });
}
function dibujarMov(m, c, cual) {
  const s = cual === "gir" && m.serie.gir ? m.serie.gir : m.serie.acc;
  G.tresEjes(c, s, { segundos: m.dur });
}

function mostrarResultado(m, historial = "push") {
  estado.medicion = m;
  mostrar(`${m.tipo}-res`, historial);
  const v = $(`#${m.tipo}-res`);
  const listo = v.querySelector("[data-listo]");
  if (listo) listo.innerHTML = `<i></i>Listo · ${m.dur} s`;
  if (m.tipo === "vib") {
    $("#vib-nivel").textContent = fmt(m.nivel);
    $("#vib-fdom").textContent = m.fDom ? fmt(m.fDom) : "—";
    $("#vib-rpm").textContent = m.fDom ? `Hz · ${Vib.rpm(m.fDom)} rpm` : "Hz";
    $("#vib-amax").textContent = fmt(m.aMax, 2);
    $("#vib-vs-txt").innerHTML = `Tu celular ve hasta ${fmt(m.fMax, 0)} Hz${m.fDom ? ` y encontró el pico de <b>${fmt(m.fDom)} Hz</b>` : ""}. El instrumental VANTAR mide hasta 800 Hz: en esa zona aparecen vibraciones que el celular no puede detectar.`;
    elegir("vibctx", m.ctx);
    dibujarVib(m, $("#vib-esp"), $("#vib-vs"));
  } else if (m.tipo === "snd") {
    $("#snd-prom").textContent = fmt(m.prom, 0);
    $("#snd-max").textContent = fmt(m.max, 0);
    $("#snd-tono").textContent = m.marcado ? Math.round(m.tono).toLocaleString("es-AR") : "—";
    $("#snd-clase").textContent = m.marcado ? `Hz · ${Snd.claseTono(m.tono)}` : "sin tono marcado";
    elegir("sndctx", m.ctx);
    dibujarSnd(m, $("#snd-esp"));
  } else {
    $("#mov-dur").textContent = mmss(m.dur);
    $("#mov-amax").textContent = fmt(m.aMax, 2);
    $("#mov-aeje").textContent = `m/s² · eje ${m.aEje}`;
    $("#mov-arms").textContent = fmt(m.aRms, 2);
    $("#mov-n").textContent = m.n.toLocaleString("es-AR");
    $("#mov-fs").textContent = `a ${m.fs} por segundo`;
    $("#mov-gmax").textContent = m.conGiro ? fmt(m.gMax, 0) : "—";
    $("#mov-geje").textContent = m.conGiro ? `°/s · eje ${m.gEje}` : "sin giróscopo";
    $("#mov-grms").textContent = m.conGiro ? fmt(m.gRms, 0) : "—";
    $('[data-graf="gir"]').disabled = !m.conGiro;
    $("#mov-fino").textContent = `Alineado con la gravedad al empezar (${m.alineacion}): la aceleración muestra solo el movimiento. Medición orientativa con los sensores del celular.`;
    estado.graf = "acc";
    $$("[data-graf]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.graf === "acc")));
    dibujarMov(m, $("#mov-graf"), "acc");
  }
  if (m.calidad.items.length) pintarCalidad(`${m.tipo}-res`, m.calidad);
  if (m.tipo !== "mov") pintarInterpretacion(m);
}

function terminar(m) {
  A.registrarUso(m.tipo);
  A.guardarUltima(m);
  vibrar([80, 60, 120]);
  evento(`toolbox-medicion-${m.tipo}`);
  mostrarResultado(m, "replace");
}

/* ------------------------------- Vibraciones ------------------------------ */
async function medirVibraciones() {
  error("vib-prep", "");
  const r = await requestMotion({ kind: "motion", title: "Sensor de movimiento", message: "Para medir la vibración usamos el acelerómetro del celular. Todo se procesa en tu celular." });
  if (r !== "granted") { error("vib-prep", textoPermiso(r)); return; }
  const dur = +estado.vibdur;
  const d = { t: [], x: [], y: [], z: [] };
  const onda = new Array(170).fill(0);
  let media = null;
  mostrar("vib-run", "none");
  pantallaEncendida();
  alSalir(Vib.escuchar(d, (g) => {
    const mag = Math.hypot(g.x, g.y, g.z);
    media = media == null ? mag : media * 0.97 + mag * 0.03;
    onda.shift(); onda.push(mag - media);
  }));
  const lienzo = $("#vib-onda");
  bucle(() => G.onda(lienzo, onda, Math.max(0.15, ...onda.map(Math.abs))));
  const sinDatos = setTimeout(() => {
    if (d.t.length) return;
    mostrar("vib-prep", "none");
    error("vib-prep", "No llegan datos del sensor de movimiento. Si estás en una computadora, abrí esta página en tu celular.");
  }, 2000);
  alSalir(() => clearTimeout(sinDatos));
  cuentaRegresiva("vib-run", dur, () => {
    detener();
    const m = Vib.analizar(d, { ctx: estado.vibctx, dur });
    if (m.error) { mostrar("vib-prep", "none"); error("vib-prep", m.error); return; }
    terminar(m);
  });
}

/* --------------------------------- Sonido --------------------------------- */
async function medirSonido() {
  error("snd-prep", "");
  const stream = await requestMic({ kind: "mic", title: "Micrófono", message: "Para medir el sonido usamos el micrófono. El audio se procesa en tu celular: no se graba ni se envía." });
  if (stream === "insecure") { error("snd-prep", textoPermiso("insecure")); return; }
  if (!stream) { error("snd-prep", "Sin permiso para el micrófono no podemos medir. Si lo rechazaste, habilitalo en la configuración del navegador para este sitio y probá de nuevo."); return; }
  let s;
  try { s = await Snd.abrir(stream); } catch { stream.getTracks().forEach((t) => t.stop()); error("snd-prep", "No se pudo abrir el micrófono. Probá de nuevo."); return; }
  const dur = +estado.snddur;
  mostrar("snd-run", "none");
  pantallaEncendida();
  alSalir(() => s.cerrar());
  const lienzo = $("#snd-vivo"), num = $("#snd-db"), barra = $("#snd-barra");
  bucle(() => {
    const { db, frec, kMax } = s.leer();
    num.textContent = Math.round(db);
    barra.style.width = Math.max(0, Math.min(100, ((db - 30) / 80) * 100)) + "%";
    const n = 48, niv = new Array(n).fill(0);
    let mejor = 0;
    for (let i = 0; i < n; i++) {
      const k0 = Math.floor((i * kMax) / n) + 1, k1 = Math.floor(((i + 1) * kMax) / n);
      let m = -140;
      for (let k = k0; k <= k1; k++) m = Math.max(m, frec[k]);
      niv[i] = Math.max(0, Math.min(1, (m + 100) / 75));
      if (niv[i] > niv[mejor]) mejor = i;
    }
    G.barras(lienzo, niv, mejor);
  });
  cuentaRegresiva("snd-run", dur, () => {
    detener(); // cierra el micrófono; lo registrado queda en s.reg
    const m = Snd.analizar(s, { ctx: estado.sndctx, dur });
    if (m.error) { mostrar("snd-prep", "none"); error("snd-prep", m.error); return; }
    terminar(m);
  });
}

/* --------------------------------- Nivel ---------------------------------- */
const nivel = { b: 0, g: 0, gx: 0, gy: 0, cero: { b: 0, g: 0, c: 0 }, ok: false, lecturas: 0, hay: false };
const normal90 = (a) => { while (a > 90) a -= 180; while (a < -90) a += 180; return a; };

function cambiarModoNivel() {
  const canto = estado.lvlmodo === "canto";
  $("#lvl-sup").hidden = canto;
  $("#lvl-canto").hidden = !canto;
  $("#lvl-r1").textContent = canto ? "Ángulo" : "Adelante / atrás";
  $("#lvl-r2").textContent = canto ? "Respecto de" : "Izquierda / derecha";
}

async function iniciarNivel() {
  cambiarModoNivel();
  error("lvl", "");
  const r = await requestMotion({ kind: "motion", title: "Sensor de orientación", message: "El nivel usa los sensores de orientación del celular. Todo se procesa en tu celular." });
  if (estado.actual !== "lvl") return;
  if (r !== "granted") { error("lvl", textoPermiso(r)); return; }
  const or = (e) => { if (e.beta == null) return; nivel.b = e.beta; nivel.g = e.gamma; nivel.hay = true; };
  const mo = (e) => {
    const g = e.accelerationIncludingGravity;
    if (!g || g.x == null) return;
    nivel.gx = nivel.gx * 0.85 + g.x * 0.15; nivel.gy = nivel.gy * 0.85 + g.y * 0.15; nivel.hay = true;
  };
  window.addEventListener("deviceorientation", or);
  window.addEventListener("devicemotion", mo);
  alSalir(() => { window.removeEventListener("deviceorientation", or); window.removeEventListener("devicemotion", mo); });
  pantallaEncendida();
  const gota = $("#lvl-gota"), burbuja = $("#lvl-burbuja");
  bucle(() => {
    if (!nivel.hay) return;
    const lim = (v) => Math.max(-1, Math.min(1, v / 5));
    let ok;
    if (estado.lvlmodo === "sup") {
      const b = nivel.b - nivel.cero.b, g = nivel.g - nivel.cero.g;
      ok = Math.abs(b) < 0.2 && Math.abs(g) < 0.2;
      // la burbuja va hacia el lado más alto, como en un nivel de verdad
      gota.style.left = 50 - lim(g) * 41 + "%";
      gota.style.top = 50 - lim(b) * 41 + "%";
      burbuja.classList.toggle("ok", ok);
      $("#lvl-a1").textContent = fmt(b) + "°";
      $("#lvl-a2").textContent = fmt(g) + "°";
    } else {
      const c = normal90((Math.atan2(nivel.gy, nivel.gx) * 180) / Math.PI) - nivel.cero.c;
      ok = Math.abs(c) < 0.2;
      $("#lvl-linea").setAttribute("transform", `rotate(${(-c).toFixed(2)} 100 100)`);
      $("#lvl-grados").textContent = fmt(Math.abs(c)) + "°";
      $("#lvl-a1").textContent = fmt(Math.abs(c)) + "°";
      $("#lvl-a2").textContent = nivel.cero.c ? "tu cero" : "horizontal";
    }
    if (ok && !nivel.ok) vibrar(60);
    nivel.ok = ok;
    const est = $("#lvl-estado");
    est.textContent = ok ? "Nivelado" : "Inclinado";
    est.style.color = ok ? "#3fb67f" : "";
  });
}

/* ------------------------------- Movimiento ------------------------------- */
async function medirMovimiento() {
  error("mov-prep", "");
  const r = await requestMotion({ kind: "motion", title: "Sensores de movimiento", message: "Para registrar el movimiento usamos el acelerómetro y el giróscopo del celular. Todo se procesa en tu celular." });
  if (r !== "granted") { error("mov-prep", textoPermiso(r)); return; }
  mostrar("mov-align", "none");
  pantallaEncendida();
  alinearMov(0);
}

function alinearMov(intento) {
  const lect = [];
  $("#mov-eje").textContent = intento ? "Se movió: dejalo quieto 3 segundos más…" : "Buscando hacia dónde está el piso…";
  alSalir(Mov.alinear((l) => lect.push(l)));
  const sinDatos = setTimeout(() => {
    if (lect.length) return;
    mostrar("mov-prep", "none");
    error("mov-prep", "No llegan datos del sensor de movimiento. Si estás en una computadora, abrí esta página en tu celular.");
  }, 2000);
  alSalir(() => clearTimeout(sinDatos));
  cuentaRegresiva("mov-align", 3, () => {
    detener();
    const al = Mov.resultadoAlineacion(lect);
    if (!al.quieto) { pantallaEncendida(); alinearMov(intento + 1); return; }
    $("#mov-eje").textContent = `Listo: ${al.texto}.`;
    vibrar(60);
    setTimeout(() => { if (estado.actual === "mov-align") registrarMov(al); }, 600);
  });
}

function registrarMov(al) {
  mostrar("mov-run", "none");
  pantallaEncendida();
  const d = { t: [], x: [], y: [], z: [], gx: [], gy: [], gz: [], t0: null, conGiro: false };
  alSalir(Mov.registrar(al.g, d));
  const lienzo = $("#mov-vivo"), prog = $("#mov-prog"), reloj = $("#mov-t");
  const ids = ["ax", "ay", "az", "gx", "gy", "gz"].map((k) => $(`#mov-${k}`));
  const t0 = performance.now();
  bucle(() => {
    const s = (performance.now() - t0) / 1000;
    reloj.textContent = `${mmss(Math.min(s, Mov.MAX_S))} / 1:00`;
    prog.style.width = Math.min(100, (s / Mov.MAX_S) * 100) + "%";
    const n = d.t.length;
    if (n > 1) {
      const fs = n / Math.max(0.5, d.t[n - 1]);
      G.tresEjes(lienzo, [d.x, d.y, d.z], { desde: Math.max(0, n - Math.round(fs * 4)) });
      [d.x, d.y, d.z].forEach((a, i) => (ids[i].textContent = fmt(a[n - 1], 2)));
      [d.gx, d.gy, d.gz].forEach((a, i) => (ids[i + 3].textContent = d.conGiro ? fmt(a[n - 1], 0) : "—"));
    }
    if (s >= Mov.MAX_S) terminarMov(d, al);
  });
  estado.terminarMov = () => terminarMov(d, al);
}

function terminarMov(d, al) {
  detener();
  const m = Mov.analizar(d, al);
  if (m.error) { mostrar("mov-prep", "none"); error("mov-prep", m.error); return; }
  terminar(m);
}

/* ------------------------------ Informe y consulta ------------------------- */
const INCLUYE = {
  vib: ["Nivel de vibración, frecuencia dominante y aceleración máxima", "Espectro y comparativo con el instrumental VANTAR", "Interpretación según lo que mediste", "Calidad de la medición"],
  snd: ["Nivel promedio y máximo, y tono dominante", "Espectro del sonido", "Interpretación según lo que escuchaste", "Calidad de la medición"],
  mov: ["Duración, aceleración y giro máximos y típicos", "Gráficos de aceleración y de giro en los 3 ejes", "Eje con más movimiento y con más giro", "Cómo se alineó con la gravedad"],
};

function filas(m) {
  if (m.tipo === "vib") return [
    ["Qué se midió", CTX[m.ctx]], ["Duración", `${m.dur} s`], ["Nivel de vibración", `${fmt(m.nivel)} mm/s`],
    ["Frecuencia dominante", m.fDom ? `${fmt(m.fDom)} Hz (${Vib.rpm(m.fDom)} rpm)` : "—"], ["Aceleración máxima", `${fmt(m.aMax, 2)} m/s²`],
    ["Lecturas del sensor", `${m.fs} por segundo (ve hasta ${m.fMax} Hz)`],
  ];
  if (m.tipo === "snd") return [
    ["Qué se escuchó", CTX_SND[m.ctx]], ["Duración", `${m.dur} s`], ["Nivel promedio", `${fmt(m.prom, 0)} dB aprox.`],
    ["Nivel máximo", `${fmt(m.max, 0)} dB aprox.`], ["Tono dominante", m.marcado ? `${Math.round(m.tono).toLocaleString("es-AR")} Hz (${Snd.claseTono(m.tono)})` : "Sin un tono marcado"],
  ];
  return [
    ["Duración", mmss(m.dur)], ["Alineación", m.alineacion], ["Aceleración máxima", `${fmt(m.aMax, 2)} m/s² (eje ${m.aEje})`],
    ["Aceleración típica (RMS)", `${fmt(m.aRms, 2)} m/s²`], ["Giro máximo", m.conGiro ? `${fmt(m.gMax, 0)} °/s (eje ${m.gEje})` : "El celular no tiene giróscopo"],
    ["Giro típico (RMS)", m.conGiro ? `${fmt(m.gRms, 0)} °/s` : "—"], ["Muestras", `${m.n.toLocaleString("es-AR")} (a ${m.fs} por segundo)`],
  ];
}
const resumen = (m) => `${NOMBRE[m.tipo]} · ${fechaLarga(m.fecha)}\n` + filas(m).map(([k, v]) => `${k}: ${v}`).join("\n");
const sinEtiquetas = (h) => { const d = document.createElement("div"); d.innerHTML = h; return d.textContent; };

function graficosParaMail(m) {
  const lienzo = (h) => { const c = document.createElement("canvas"); c.width = 680; c.height = h; return c; };
  const png = (c) => c.toDataURL("image/png");
  if (m.tipo === "vib") {
    const a = lienzo(240), b = lienzo(200);
    dibujarVib(m, a, b);
    return [{ titulo: "Espectro: en qué frecuencias se concentra la vibración", png: png(a) }, { titulo: `Lo que ve tu celular (hasta ${m.fMax} Hz) frente al rango del instrumental VANTAR (hasta 800 Hz)`, png: png(b) }];
  }
  if (m.tipo === "snd") { const a = lienzo(240); dibujarSnd(m, a); return [{ titulo: "Espectro: qué tonos tiene el sonido", png: png(a) }]; }
  const a = lienzo(280); dibujarMov(m, a, "acc");
  const out = [{ titulo: "Aceleración en los 3 ejes (m/s²) · X amarillo, Y blanco, Z azul", png: png(a) }];
  if (m.conGiro) { const b = lienzo(280); dibujarMov(m, b, "gir"); out.push({ titulo: "Giro en los 3 ejes (°/s) · X amarillo, Y blanco, Z azul", png: png(b) }); }
  return out;
}

const K_PERSONA = "vantar.toolbox.persona";
function abrirMail() {
  const m = estado.medicion;
  if (!m) { mostrar("tb-inicio"); return; }
  $("#mail-titulo").textContent = `Informe de ${NOMBRE[m.tipo]} · ${fechaLarga(m.fecha)}`;
  $("#mail-incluye").innerHTML = INCLUYE[m.tipo].map((t) => `<li>${IC.si}<span>${t}</span></li>`).join("")
    + `<li class="no">${IC.menos}<span>Los datos completos de la medición no se entregan. Si los necesitás, consultanos.</span></li>`;
  try {
    const p = JSON.parse(localStorage.getItem(K_PERSONA) || "null");
    if (p) { $("#tm-nombre").value = p.nombre || ""; $("#tm-empresa").value = p.empresa || ""; $("#tm-email").value = p.email || ""; $("#tm-rubro").value = p.rubro || ""; $("#tm-tel").value = p.telefono || ""; }
  } catch { /* sin datos guardados */ }
  $("#tm-error").hidden = true;
  estado.mailDesde = Date.now();
  mostrar("tb-mail");
  prepararTurnstile();
}

let tsToken = "", tsWidget = null;
function prepararTurnstile() {
  const clave = (datos.TOOLBOX || {}).turnstile;
  if (!clave) return;
  const pintar = () => {
    if (tsWidget != null) { try { window.turnstile.reset(tsWidget); } catch { /* sigue */ } return; }
    tsWidget = window.turnstile.render("#tm-turnstile", { sitekey: clave, appearance: "interaction-only", language: "es", callback: (t) => (tsToken = t), "expired-callback": () => (tsToken = "") });
  };
  if (window.turnstile) { pintar(); return; }
  window.vantarTurnstile = pintar;
  const s = document.createElement("script");
  s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=vantarTurnstile";
  s.async = true;
  document.head.appendChild(s);
}

async function enviarInforme(e) {
  e.preventDefault();
  const m = estado.medicion, err = $("#tm-error"), boton = $("#tm-enviar");
  const campos = ["#tm-nombre", "#tm-empresa", "#tm-email", "#tm-rubro"].map((s) => $(s));
  let mal = null;
  campos.forEach((c) => {
    const v = c.value.trim();
    const bien = c.id === "tm-email" ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) : v.length > 1;
    c.setAttribute("aria-invalid", String(!bien));
    if (!bien && !mal) mal = c;
  });
  if (mal) {
    err.textContent = mal.id === "tm-email" ? "Revisá el mail: ahí te llega el informe." : "Completá tu nombre, empresa y rubro.";
    err.hidden = false; mal.focus(); return;
  }
  const persona = { nombre: $("#tm-nombre").value.trim(), empresa: $("#tm-empresa").value.trim(), email: $("#tm-email").value.trim(), rubro: $("#tm-rubro").value, telefono: $("#tm-tel").value.trim(), contacto: $("#tm-contacto").checked };
  try { localStorage.setItem(K_PERSONA, JSON.stringify({ ...persona, contacto: undefined })); } catch { /* sin guardar */ }
  if ((datos.TOOLBOX || {}).turnstile && !tsToken) { err.textContent = "Esperá un segundo: estamos verificando que no seas un robot."; err.hidden = false; return; }
  const it = m.tipo === "mov" ? null : interpretacion(m);
  const pedido = {
    version: 1, tipo: m.tipo, trampa: $("#tm-sitio").value, ms: Date.now() - estado.mailDesde, turnstile: tsToken,
    persona,
    medicion: {
      titulo: NOMBRE[m.tipo], fecha: fechaLarga(m.fecha), filas: filas(m),
      calidad: m.calidad.items.length ? { nota: m.calidad.nota, items: m.calidad.items.map((i) => ({ ok: i.ok, txt: i.txt })) } : null,
      interpretacion: it ? { titulo: it.chip, txt: sinEtiquetas(it.txt) } : null,
      notas: [m.tipo === "snd" ? "El micrófono del celular no está calibrado: los dB son aproximados y sirven para comparar, no para certificar." : "Medición orientativa con los sensores del celular. Para resultados confiables medimos con instrumental calibrado."],
      resumen: resumen(m),
    },
    graficos: graficosParaMail(m),
  };
  err.hidden = true;
  boton.disabled = true; boton.textContent = "Enviando…";
  const r = await enviar(pedido);
  boton.disabled = false; boton.textContent = "Enviar el informe";
  tsToken = "";
  if (r === "limite") { err.textContent = "Ya pediste varios informes hoy con este mail. Probá mañana o escribinos por Contacto."; err.hidden = false; return; }
  if (r === "datos") { err.textContent = "Revisá los datos del formulario y probá de nuevo."; err.hidden = false; return; }
  if (r === "error") { err.textContent = `No se pudo enviar. Probá de nuevo en un rato o escribinos a ${datos.EMAIL}.`; err.hidden = false; return; }
  evento(`toolbox-informe-${m.tipo}`);
  A.borrarUltima();
  const b = document.createElement("b"); b.style.color = "var(--ink)"; b.textContent = persona.email;
  const espera = r === "en-espera";
  $("#env-ic").classList.toggle("espera", espera);
  $("#env-ic").innerHTML = espera ? IC.reloj : IC.si;
  $("#env-titulo").textContent = espera ? "Sin señal: queda en espera" : r === "recibido" ? "Recibimos tu pedido" : "Listo, revisá tu mail";
  $("#env-txt").replaceChildren(espera ? "El informe sale solo apenas vuelva la conexión, a " : r === "recibido" ? "Te mandamos el informe en el día a " : "Enviamos el informe a ", b, ".");
  $("#env-nota").textContent = espera ? "No cierres esta página del todo: al volver la señal, el envío sale solo. Si cerrás el navegador, sale la próxima vez que entres." : "Si no llega en unos minutos, revisá la carpeta de spam.";
  mostrar("tb-enviado", "replace");
}

function consultar(k) {
  const m = estado.medicion;
  const msg = k === "tope"
    ? `Llegué al límite de mediciones gratis de ${NOMBRE[estado.tope] || "un instrumento"} en el Toolbox y necesito medir más.\n\nQué estoy midiendo: `
    : `Hice una medición con el Toolbox:\n${m ? resumen(m) : ""}\n\nQué estoy midiendo y qué me preocupa: `;
  evento("toolbox-consulta");
  detener();
  irA("contact");
  setTimeout(() => {
    const tipo = document.getElementById("cf-type"), txt = document.getElementById("cf-msg");
    if (tipo) tipo.value = "Vibraciones y diagnóstico";
    if (txt) { txt.value = msg; txt.scrollIntoView({ block: "center" }); txt.focus({ preventScroll: true }); txt.setSelectionRange(msg.length, msg.length); }
  }, 400);
}

/* --------------------------------- arranque -------------------------------- */
export function initToolbox({ irA: ir, caps: c }) {
  raiz = document.getElementById("toolbox-mount");
  if (!raiz) return;
  irA = ir; caps = c;
  $ = (s) => raiz.querySelector(s);
  $$ = (s) => raiz.querySelectorAll(s);
  raiz.innerHTML = HTML;
  if (!caps.likelyMobile) $("#tb-qr-inicio").hidden = false;
  if (!caps.motion) {
    raiz.classList.add("tb-compu");
    $('[data-abrir="lvl"] em').textContent = "en el celular";
  }
  $("#cel-copiar").addEventListener("click", async (e) => {
    const b = e.currentTarget;
    try { await navigator.clipboard.writeText(b.dataset.url); b.textContent = "¡Enlace copiado!"; }
    catch { b.textContent = "Copialo de arriba"; }
    setTimeout(() => (b.textContent = "Copiar el enlace"), 2200);
  });

  raiz.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b || !raiz.contains(b)) return;
    const d = b.dataset;
    if (d.ir) mostrar(d.ir);
    else if (d.abrir) abrir(d.abrir);
    else if (d.cancelar) mostrar(d.cancelar, "none");
    else if (d.medir === "vib") medirVibraciones();
    else if (d.medir === "snd") medirSonido();
    else if (d.medir === "mov") medirMovimiento();
    else if (d.mail) abrirMail();
    else if (d.consulta) consultar(d.consulta);
    else if ("alResultado" in d) estado.medicion ? mostrarResultado(estado.medicion) : mostrar("tb-inicio");
    else if ("productos" in d) { detener(); irA("products"); }
    else if (d.graf && estado.medicion) {
      estado.graf = d.graf;
      $$("[data-graf]").forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
      dibujarMov(estado.medicion, $("#mov-graf"), d.graf);
    } else if (d.v && b.parentElement.dataset.grupo) elegir(b.parentElement.dataset.grupo, d.v);
  });
  $("#tb-retomar-ver").addEventListener("click", () => { const u = A.ultima(); if (u) mostrarResultado(u); });
  $("#mov-detener").addEventListener("click", () => estado.terminarMov && estado.terminarMov());
  $("#lvl-cero").addEventListener("click", (e) => {
    nivel.cero = estado.lvlmodo === "sup" ? { ...nivel.cero, b: nivel.b, g: nivel.g } : { ...nivel.cero, c: normal90((Math.atan2(nivel.gy, nivel.gx) * 180) / Math.PI) };
    const b = e.currentTarget; b.textContent = "Cero fijado"; setTimeout(() => (b.textContent = "Fijar cero aquí"), 1500);
  });
  $("#lvl-guardar").addEventListener("click", () => {
    nivel.lecturas++;
    const li = document.createElement("li"), b = document.createElement("b"), s = document.createElement("span");
    b.textContent = `Punto ${nivel.lecturas}`;
    s.textContent = estado.lvlmodo === "sup" ? `${$("#lvl-a1").textContent} · ${$("#lvl-a2").textContent}` : `${$("#lvl-a1").textContent} de canto`;
    li.append(b, s);
    $("#lvl-lista").prepend(li);
  });
  $("#tb-form").addEventListener("submit", enviarInforme);

  window.addEventListener("popstate", (e) => {
    if (document.body.dataset.vista !== "tools") return;
    let id = e.state && e.state.tb ? e.state.tb : "tb-inicio";
    if (RES_VISTAS.includes(id) && !estado.medicion) id = "tb-inicio";
    if (RES_VISTAS.includes(id)) { mostrarResultado(estado.medicion, "none"); return; }
    mostrar(id, "none");
  });
  vigilarPendiente();
  refrescarInicio();
}

/** Enlace directo (vantardynamics.com/#vibraciones, etc.): abre ese instrumento. */
export function abrirInstrumento(nombre) {
  const k = Object.keys(ENLACE).find((x) => ENLACE[x] === nombre);
  if (raiz && k) abrir(k);
}

/** Al entrar a la pestaña Toolbox: siempre arranca en la lista de instrumentos. */
export function entrarToolbox() { if (raiz) mostrar("tb-inicio", "none"); }
/** Al ir a otra pestaña: se apagan sensores, micrófono y temporizadores. */
export function salirToolbox() { if (raiz) detener(); }
