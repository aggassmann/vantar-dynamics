// VANTAR Dynamics — Contact tab (premium form + professional links)

// Dirección prevista con el dominio propio (ver GUIA-DOMINIO.md, etapa 2).
const EMAIL = "contacto@vantardynamics.com";
const TELEFONO = "+54 9 3472 541798";
const WHATSAPP = "5493472541798";
// Formspree reenvía cada consulta al email de Alejandro (cuenta creada 2026-09-30).
const FORM_ENDPOINT = "https://formspree.io/f/xvkgydjl";
// Redes de VANTAR: cada una aparece en Contacto apenas tiene su enlace (vacío = oculta).
const REDES = [
  { id: "instagram", nombre: "Instagram", url: "https://www.instagram.com/vantardynamics/" },
  { id: "facebook", nombre: "Facebook", url: "" },
  { id: "linkedin", nombre: "LinkedIn", url: "https://www.linkedin.com/company/vantardynamics/" },
];

const ICONS = {
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95C20.4 8.75 22 11 22 14.4V21h-4v-5.8c0-1.4-.03-3.2-1.95-3.2-1.96 0-2.26 1.53-2.26 3.1V21H9z"/></svg>`,
  github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.25-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1Z"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 11.9a8 8 0 0 1-11.9 7L4 20l1.1-4A8 8 0 1 1 20 11.9Zm-8-6.4a6.4 6.4 0 0 0-5.4 9.8l.3.5-.6 2.2 2.3-.6.4.3A6.4 6.4 0 1 0 12 5.5Zm3.7 8.1c-.2.6-1.2 1.1-1.6 1.1-.4.1-.9.1-1.5-.1-.3-.1-.8-.3-1.4-.6a6.6 6.6 0 0 1-2.5-2.7c-.3-.5-.5-1-.5-1.5 0-.5.2-.8.4-1l.3-.3h.4c.1 0 .3 0 .4.3l.5 1.2c.1.1 0 .3 0 .4l-.3.4-.2.2c-.1.1-.2.2-.1.4.1.2.5.9 1.1 1.4.8.7 1.4.9 1.6 1 .2.1.3.1.4-.1l.5-.6c.1-.2.3-.1.4-.1l1.2.6c.2.1.3.2.3.3.1.1.1.4 0 .6Z"/></svg>`,
};

export function renderContact() {
  const mount = document.getElementById("contact-mount");
  if (!mount) return;
  const redesActivas = REDES.filter((r) => r.url);
  mount.innerHTML = `
    <div class="sec-head" style="margin-top:var(--s-7)">
      <span class="eyebrow">Contacto</span>
      <h2>Contanos qué le pasa<br />a tu máquina.</h2>
      <p class="lead" style="margin-top:var(--s-3);font-size:.92rem">Vibraciones, balanceo, instrumentación, simulación o un producto en desarrollo. Contame el problema y te respondo con una propuesta técnica. Todo lo que compartas se trata con confidencialidad.</p>
    </div>

    <form class="card card-pad stack" id="contact-form" novalidate>
      <div class="field">
        <label for="cf-name">Nombre / Empresa</label>
        <input id="cf-name" name="name" type="text" autocomplete="name" placeholder="Ej. Industrias del Sur S.A." required />
      </div>
      <div class="field">
        <label for="cf-email">Email</label>
        <input id="cf-email" name="email" type="email" autocomplete="email" placeholder="tu@empresa.com" required />
      </div>
      <div class="field">
        <label for="cf-type">Tipo de proyecto</label>
        <select id="cf-type" name="type">
          <option>Análisis de vibraciones / diagnóstico</option>
          <option>Balanceo dinámico</option>
          <option>Instrumentación / adquisición de datos</option>
          <option>Simulación CAE</option>
          <option>Ingeniería conceptual / básica de producto</option>
          <option>Productos: BalanSense / VibraSense</option>
          <option>Otro</option>
        </select>
      </div>
      <div class="field">
        <label for="cf-msg">Describí tu desafío</label>
        <textarea id="cf-msg" name="message" placeholder="Qué equipo, qué síntoma, desde cuándo, qué necesitás…" required></textarea>
      </div>
      <div class="hp-field" aria-hidden="true">
        <label for="cf-gotcha">No completar</label>
        <input id="cf-gotcha" name="_gotcha" type="text" tabindex="-1" autocomplete="off" />
      </div>
      <button type="submit" class="btn btn-primary btn-block" id="cf-send">Enviar consulta</button>
      <p class="note center">Te respondemos por email. Tus datos se usan solo para contestarte.</p>
      <div id="cf-ok" class="formok hidden" role="status">✓ ¡Gracias! Recibimos tu consulta y te vamos a responder a la brevedad.</div>
      <div id="cf-err" class="formerr hidden" role="alert">No se pudo enviar. Probá de nuevo o escribinos a <a href="mailto:${EMAIL}">${EMAIL}</a>.</div>
    </form>

    <h3 style="margin:var(--s-6) 0 0">Otros canales</h3>
    <div class="social">
      <a href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener">${ICONS.whatsapp}<span>WhatsApp</span></a>
      <a href="mailto:${EMAIL}">${ICONS.mail}<span>Email</span></a>
    </div>
    ${redesActivas.length ? `<div class="social social-redes">` : ""}
      ${redesActivas.map((r) => `<a href="${r.url}" target="_blank" rel="noopener">${ICONS[r.id]}<span>${r.nombre}</span></a>`).join("")}
    ${redesActivas.length ? `</div>` : ""}
    <p class="note" style="margin-top:var(--s-3)">${TELEFONO}${redesActivas.length < REDES.length ? ` · ${REDES.filter((r) => !r.url).map((r) => r.nombre).join(", ")}: próximamente.` : ""}</p>

    <footer class="foot">
      <p><b>VANTAR Dynamics</b> · Ingeniería de medición y dinámica de máquinas</p>
      <p class="foot-ar"><svg class="flag" viewBox="0 0 30 20" role="img" aria-label="Bandera argentina"><use href="#flag-ar"/></svg><span>Desarrollado y fabricado en Argentina</span></p>
    </footer>
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
    } catch {
      err.classList.remove("hidden");
    } finally {
      send.disabled = false;
      send.textContent = "Enviar consulta";
    }
  });
}
