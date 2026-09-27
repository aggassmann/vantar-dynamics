// VANTAR Dynamics — Estela mostaza centrada en el logo que sigue el scroll con inercia.
// En reposo queda centrada sobre el logo de la portada (isotipo + VANTAR DYNAMICS).
// Al scrollear se queda atrás y se estira en la dirección del movimiento; al frenar
// alcanza la posición. Cuando el logo sale de pantalla, la estela se queda a la misma
// altura donde estaba el logo y acompaña al lector.

const SEGUIMIENTO = 0.075;    // fracción de la distancia que recorre por cuadro (más bajo = más lenta)
const ESTIRAMIENTO = 1 / 260; // cuánto se alarga según la distancia pendiente
const MAX_ESTIRAMIENTO = 1.4;

export function initEstela() {
  const el = document.querySelector(".estela");
  if (!el) return;
  const logo = document.querySelector(".hero .brandmark");
  const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let logoY = null;           // centro del logo, en coordenadas del documento
  let y = null;               // posición actual de la estela, en coordenadas del documento
  let corriendo = false;

  function medirLogo() {
    if (!logo) return;
    const r = logo.getBoundingClientRect();
    if (r.height > 0) logoY = r.top + window.scrollY + r.height / 2;
  }

  // Altura en pantalla a la que tiene que estar la estela
  function destinoEnPantalla() {
    const reposo = logoY == null ? window.innerHeight * 0.4 : Math.min(logoY, window.innerHeight * 0.5);
    const visible = logo && logo.getBoundingClientRect().height > 0;
    return visible && logoY != null ? Math.max(logoY - window.scrollY, reposo) : reposo;
  }

  function pintar(pendiente) {
    const enPantalla = y - window.scrollY;
    const estira = sinMovimiento ? 0 : Math.min(Math.abs(pendiente) * ESTIRAMIENTO, MAX_ESTIRAMIENTO);
    el.style.transform =
      `translate3d(-50%, calc(${enPantalla.toFixed(1)}px - 50%), 0) ` +
      `scale(${(1 - estira * 0.18).toFixed(3)}, ${(1 + estira).toFixed(3)})`;
  }

  function cuadro() {
    medirLogo();
    const destino = window.scrollY + destinoEnPantalla();
    if (y == null || sinMovimiento) y = destino;
    const pendiente = destino - y;
    y += pendiente * SEGUIMIENTO;
    pintar(pendiente);
    if (Math.abs(pendiente) > 0.4) {
      requestAnimationFrame(cuadro);
    } else {
      y = destino;
      pintar(0);
      corriendo = false;
    }
  }

  function arrancar() {
    if (corriendo) return;
    corriendo = true;
    requestAnimationFrame(cuadro);
  }

  window.addEventListener("scroll", arrancar, { passive: true });
  window.addEventListener("resize", arrancar);
  window.addEventListener("load", arrancar);
  document.addEventListener("click", () => setTimeout(arrancar, 60)); // cambio de pestaña
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(arrancar);
  arrancar();
}
