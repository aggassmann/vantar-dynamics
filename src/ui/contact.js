// VANTAR Dynamics — Contact tab (premium form + professional links)

import { EMAIL, WHATSAPP, TELEFONO, REDES, ICONS } from "./datos.js";
import { evento } from "./estadisticas.js";

// Formspree reenvía cada consulta al email de Alejandro (cuenta creada 2026-09-30).
const FORM_ENDPOINT = "https://formspree.io/f/xvkgydjl";


export function renderContact() {
  const mount = document.getElementById("contact-mount");
  if (!mount) return;
  const redesActivas = REDES.filter((r) => r.url);
  mount.innerHTML = `
    <div class="sec-head" style="margin-top:var(--s-7)">
      <span class="eyebrow">Contacto</span>
      <h2>Contanos qué necesitás<br />resolver.</h2>
      <p class="lead" style="margin-top:var(--s-3);font-size:.92rem">Vibraciones, balanceo, instrumentación, simulación o un producto en desarrollo. Te respondemos con una propuesta técnica, y todo lo que compartas es confidencial.</p>
    </div>

    <form class="card card-pad stack" id="contact-form" novalidate>
      <div class="field">
        <label for="cf-name">Nombre y empresa</label>
        <input id="cf-name" name="name" type="text" autocomplete="name" placeholder="Ej. Industrias del Sur S.A." required />
      </div>
      <div class="field">
        <label for="cf-email">Mail</label>
        <input id="cf-email" name="email" type="email" autocomplete="email" placeholder="tu@empresa.com" required />
      </div>
      <div class="field">
        <label for="cf-type">Tema</label>
        <select id="cf-type" name="type">
          <option>Vibraciones y diagnóstico</option>
          <option>Balanceo dinámico</option>
          <option>Instrumentación / adquisición de datos</option>
          <option>Simulación CAE</option>
          <option>Ingeniería conceptual / básica de producto</option>
          <option>Consulta sobre BalanSense o VibraSense</option>
          <option>Demostración de BalanSense</option>
          <option>Demostración de VibraSense</option>
          <option>Otro</option>
        </select>
      </div>
      <div class="field">
        <label for="cf-msg">Tu caso</label>
        <textarea id="cf-msg" name="message" placeholder="Qué equipo, qué síntoma, desde cuándo, qué necesitás…" required></textarea>
      </div>
      <div class="hp-field" aria-hidden="true">
        <label for="cf-gotcha">No completar</label>
        <input id="cf-gotcha" name="_gotcha" type="text" tabindex="-1" autocomplete="off" />
      </div>
      <button type="submit" class="btn btn-primary btn-block" id="cf-send">Enviar consulta</button>
      <p class="note center">Te respondemos por mail. Usamos tus datos solo para contestarte.</p>
      <div id="cf-ok" class="formok hidden" role="status">✓ ¡Gracias! Recibimos tu consulta y te respondemos pronto por mail.</div>
      <div id="cf-err" class="formerr hidden" role="alert">No se pudo enviar. Probá de nuevo o escribinos a <a href="mailto:${EMAIL}">${EMAIL}</a>.</div>
    </form>

    <h3 style="margin:var(--s-6) 0 0">Otros canales</h3>
    <div class="social">
      <a href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener">${ICONS.whatsapp}<span>WhatsApp</span></a>
      <a href="mailto:${EMAIL}">${ICONS.mail}<span>Mail</span></a>
    </div>
    ${redesActivas.length ? `<div class="social social-redes">` : ""}
      ${redesActivas.map((r) => `<a href="${r.url}" target="_blank" rel="noopener">${ICONS[r.id]}<span>${r.nombre}</span></a>`).join("")}
    ${redesActivas.length ? `</div>` : ""}
    <p class="note" style="margin-top:var(--s-3)">${TELEFONO}${redesActivas.length < REDES.length ? ` · ${REDES.filter((r) => !r.url).map((r) => r.nombre).join(", ")}: próximamente.` : ""}</p>
  `;

  const form = document.getElementById("contact-form");
  const send = document.getElementById("cf-send");
  const ok = document.getElementById("cf-ok");
  const err = document.getElementById("cf-err");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    data.append("_subject", `[VANTAR] ${data.get("type")} — ${data.get("name")}`);
    ok.classList.add("hidden");
    err.classList.add("hidden");
    send.disabled = true;
    send.textContent = "Enviando…";
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      ok.classList.remove("hidden");
      evento("consulta-enviada");
    } catch {
      err.classList.remove("hidden");
    } finally {
      send.disabled = false;
      send.textContent = "Enviar consulta";
    }
  });
}
