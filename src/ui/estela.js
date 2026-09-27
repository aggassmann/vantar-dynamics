// VANTAR Dynamics — Estela mostaza que sigue el scroll con inercia.
// Al scrollear se queda atrás y se estira en la dirección del movimiento;
// al frenar alcanza la posición y vuelve al centro de la pantalla.

const SEGUIMIENTO = 0.075; // fracción de la distancia que recorre por cuadro (más bajo = más lenta)
const ESTIRAMIENTO = 1 / 260; // cuánto se alarga según la distancia pendiente
const MAX_ESTIRAMIENTO = 1.4;

export function initEstela() {
  const el = document.querySelector(".estela");
  if (!el) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let y = window.scrollY;
  let corriendo = false;

  function cuadro() {
    const destino = window.scrollY;
    const pendiente = destino - y;
    y += pendiente * SEGUIMIENTO;
    const atraso = y - destino; // negativo al bajar: la estela queda arriba, detrás del movimiento
    const estira = Math.min(Math.abs(pendiente) * ESTIRAMIENTO, MAX_ESTIRAMIENTO);
    el.style.transform =
      `translate3d(-50%, calc(-50% + ${atraso.toFixed(1)}px), 0) scale(${(1 - estira * 0.18).toFixed(3)}, ${(1 + estira).toFixed(3)})`;
    if (Math.abs(pendiente) > 0.4) {
      requestAnimationFrame(cuadro);
    } else {
      y = destino;
      el.style.transform = "";
      corriendo = false;
    }
  }

  window.addEventListener("scroll", () => {
    if (!corriendo) {
      corriendo = true;
      requestAnimationFrame(cuadro);
    }
  }, { passive: true });
}
