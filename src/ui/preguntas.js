// VANTAR Dynamics — Preguntas que rotan en el botón "Contanos" de la portada.
const PREGUNTAS = [
  "¿Necesitás definir y desarrollar un nuevo producto?",
  "¿Necesitás hacer un desarrollo y no podés dar un paso en falso desde el diseño?",
  "¿Necesitás proyectar un equipo nuevo o evaluar cómo se comportará antes de fabricarlo?",
  "¿Tus máquinas sufren roturas y necesitás medir qué está pasando realmente?",
  "¿Necesitás diagnosticar y solucionar problemas de vibración en tu planta?",
  "¿Buscás instrumental de precisión para diagnosticar o ensayar tu propia maquinaria?",
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
