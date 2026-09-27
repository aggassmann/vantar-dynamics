// VANTAR Dynamics — Shared modal (bottom sheet on mobile, dialog on desktop)

const $ = (s, r = document) => r.querySelector(s);

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
