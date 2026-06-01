// VANTAR Dynamics — Portfolio grid + project modal
import { PROJECTS } from "../data/projects.js";

const $ = (s, r = document) => r.querySelector(s);

export function renderPortfolio() {
  const grid = $("#portfolio-grid");
  if (!grid) return;
  grid.innerHTML = PROJECTS.map((p) => `
    <button class="card proj" data-proj="${p.id}" aria-label="${p.title}">
      <div class="proj-cover">${p.cover}</div>
      <div class="proj-body">
        <span class="proj-tag">${p.tag}</span>
        <span class="proj-title">${p.title}</span>
        <span class="proj-desc">${p.desc}</span>
        <span class="proj-foot">${p.year} · Ver detalle →</span>
      </div>
    </button>`).join("");

  grid.querySelectorAll("[data-proj]").forEach((btn) =>
    btn.addEventListener("click", () => openProject(btn.dataset.proj))
  );
}

function openProject(id) {
  const p = PROJECTS.find((x) => x.id === id);
  if (!p) return;
  $("#modal-content").innerHTML = `
    <div class="modal-cover">${p.cover}</div>
    <span class="proj-tag">${p.tag} · ${p.year}</span>
    <h2 style="margin:6px 0 4px">${p.title}</h2>
    <p class="lead" style="font-size:.92rem">${p.overview}</p>
    <h3 style="margin-top:var(--s-5);margin-bottom:var(--s-3)">Especificaciones</h3>
    <ul class="spec-list">
      ${p.specs.map(([k, v]) => `<li><span class="k">${k}</span><span class="v">${v}</span></li>`).join("")}
    </ul>
    <h3 style="margin-top:var(--s-5);margin-bottom:var(--s-2)">Rol &amp; stack</h3>
    <p class="note" style="margin-bottom:var(--s-2)">${p.role}</p>
    <div class="chiprow">${p.stack.map((s) => `<span class="chip">${s}</span>`).join("")}</div>
  `;
  openModal();
}

export function openModal() {
  const m = $("#modal");
  m.classList.add("is-open");
  document.body.style.overflow = "hidden";
}
export function closeModal() {
  const m = $("#modal");
  m.classList.remove("is-open");
  document.body.style.overflow = "";
}

export function initModal() {
  const m = $("#modal");
  m.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
}
