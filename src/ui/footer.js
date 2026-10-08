// VANTAR Dynamics — pie de página único, igual en todas las secciones

import { EMAIL, WHATSAPP, TELEFONO, CIUDAD, REDES, ICONS } from "./datos.js";

export function renderFooter() {
  const app = document.querySelector("main.app");
  if (!app || app.querySelector(".sitefoot")) return;
  // WhatsApp, mail y redes: todos como íconos en una sola fila
  const iconos = [
    { href: `https://wa.me/${WHATSAPP}`, ic: "whatsapp", txt: `WhatsApp: ${TELEFONO}`, afuera: true },
    { href: `mailto:${EMAIL}`, ic: "mail", txt: `Mail: ${EMAIL}` },
    ...REDES.filter((r) => r.url).map((r) => ({ href: r.url, ic: r.id, txt: r.nombre, afuera: true })),
  ];
  app.insertAdjacentHTML("beforeend", `
    <footer class="sitefoot">
      <div class="sf-row">
        <div class="sf-marca">
          <img src="assets/isotype.svg" alt="" width="30" height="32" />
          <p><b>VANTAR Dynamics</b><span>Ingeniería del movimiento.</span></p>
        </div>
        <ul class="sf-redes">${iconos.map((i) => `<li><a href="${i.href}"${i.afuera ? ` target="_blank" rel="noopener"` : ""} aria-label="${i.txt}" title="${i.txt}">${ICONS[i.ic]}</a></li>`).join("")}</ul>
      </div>
      <p class="sf-legal">© ${new Date().getFullYear()} VANTAR Dynamics · ${CIUDAD}</p>
    </footer>
  `);
}
