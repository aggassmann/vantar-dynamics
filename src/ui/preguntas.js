// VANTAR Dynamics — Preguntas que rotan en el botón "Contanos" de la portada.
const PREGUNTAS = [
  "¿Estás por desarrollar un producto nuevo?",
  "¿Querés validar un diseño antes de fabricarlo?",
  "¿Tus máquinas se rompen y no sabés por qué?",
  "¿Tenés vibraciones en tu planta que no lográs resolver?",
  "¿Necesitás balancear un rotor sin desmontarlo?",
  "¿Buscás instrumental para ensayar tu propia maquinaria?",
];
const CADA_MS = 4500;
const FUNDIDO_MS = 500; // igual a la transición de .cta-q en hero.css

// Fija el botón al tamaño de la pregunta más larga, así no se estira ni cambia de alto al rotar
function fijarTamano(btn, el) {
  const actual = el.textContent;
  btn.style.width = btn.style.minHeight = "";
  let ancho = 0, alto = 0;
  for (const p of PREGUNTAS) {
    el.textContent = p;
    ancho = Math.max(ancho, btn.offsetWidth);
    alto = Math.max(alto, btn.offsetHeight);
  }
  el.textContent = actual;
  btn.style.width = ancho + "px";
  btn.style.minHeight = alto + "px";
}

export function initPreguntas() {
  const el = document.getElementById("cta-q");
  if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const btn = el.closest(".cta-texto");
  const medir = () => { if (btn.offsetParent) fijarTamano(btn, el); };
  medir();
  document.fonts?.ready.then(medir);
  window.addEventListener("resize", medir);
  let i = 0;
  setInterval(() => {
    if (!btn.style.width) medir(); // si se entró por otra sección, la portada estaba oculta
    el.classList.add("oculta");
    setTimeout(() => {
      i = (i + 1) % PREGUNTAS.length;
      el.textContent = PREGUNTAS[i];
      el.classList.remove("oculta");
    }, FUNDIDO_MS);
  }, CADA_MS);
}
