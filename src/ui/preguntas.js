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
const FUNDIDO_MS = 600; // igual a la transición de .cta-q en hero.css

export function initPreguntas() {
  const el = document.getElementById("cta-q");
  if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const btn = el.closest(".cta-texto");
  let i = 0;
  setInterval(() => {
    el.classList.add("oculta");
    setTimeout(() => {
      i = (i + 1) % PREGUNTAS.length;
      // El botón pasa de un ancho al otro animado, en vez de saltar
      const antes = btn.offsetWidth;
      el.textContent = PREGUNTAS[i];
      btn.style.width = "";
      const despues = btn.offsetWidth;
      btn.style.width = antes + "px";
      void btn.offsetWidth;
      btn.style.width = despues + "px";
      el.classList.remove("oculta");
      setTimeout(() => { btn.style.width = ""; }, FUNDIDO_MS);
    }, FUNDIDO_MS);
  }, CADA_MS);
}
