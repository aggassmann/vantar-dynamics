// VANTAR Dynamics — pie de página único, igual en todas las secciones

import { EMAIL, WHATSAPP, TELEFONO, CIUDAD, REDES, ICONS } from "./datos.js";

export function renderFooter() {
  const app = document.querySelector("main.app");
  if (!app || app.querySelector(".sitefoot")) return;
  const redes = REDES.filter((r) => r.url);
  app.insertAdjacentHTML("beforeend", `
    <footer class="sitefoot">
      <div class="sf-row">
        <div class="sf-marca">
          <img src="assets/isotype.svg" alt="" width="30" height="32" />
          <p><b>VANTAR Dynamics</b><span>Ingeniería del movimiento.</span></p>
        </div>
        <ul class="sf-contacto">
          <li><a href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener">${ICONS.whatsapp}<span>${TELEFONO}</span></a></li>
          <li><a href="mailto:${EMAIL}">${ICONS.mail}<span>${EMAIL}</span></a></li>
        </ul>
        ${redes.length ? `<ul class="sf-redes">${redes.map((r) => `<li><a href="${r.url}" target="_blank" rel="noopener" aria-label="${r.nombre}">${ICONS[r.id]}</a></li>`).join("")}</ul>` : ""}
      </div>
      <p class="sf-legal">© ${new Date().getFullYear()} VANTAR Dynamics · ${CIUDAD}</p>
    </footer>
  `);
}
