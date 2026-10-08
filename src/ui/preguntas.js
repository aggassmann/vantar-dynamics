// VANTAR Dynamics — Preguntas que rotan en el botón "Contanos" de la portada.
const PREGUNTAS = [
  "¿Estás por desarrollar un producto nuevo?",
  "¿Querés validar un diseño antes de fabricarlo?",
  "¿Tus máquinas se rompen y no sabés por qué?",
  "¿Tenés vibraciones en tu planta que no lográs resolver?",
  "¿Necesitás balancear un rotor sin desmontarlo?",
  "¿Buscás instrumental para ensayar tu propia maquinaria?",
];
const CADA_MS = 4000;

export function initPreguntas() {
  const el = document.getElementById("cta-q");
  if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let i = 0;
  setInterval(() => {
    el.classList.add("oculta");
    setTimeout(() => {
      i = (i + 1) % PREGUNTAS.length;
      el.textContent = PREGUNTAS[i];
      el.classList.remove("oculta");
    }, 350);
  }, CADA_MS);
}
