// VANTAR Dynamics — Interactive Brand Board tab controller
export function initBrandTab() {
  const $ = (s) => document.querySelector(s);
  if (!$("#view-brand")) return;

  // 1. Toggle the technical construction grid of the isotype
  const toggle = $("#btn-toggle-grid");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const lines = $("#brand-grid-lines");
      const aux = document.querySelectorAll(".brand-aux");
      const isHidden = lines.classList.toggle("hidden");
      aux.forEach((el) => el.classList.toggle("hidden", isHidden));
      toggle.textContent = isHidden ? "Mostrar retícula técnica" : "Ocultar retícula técnica";
      toggle.classList.toggle("btn-primary", !isHidden);
      toggle.classList.toggle("btn-soft", isHidden);
    });
  }

  // 2. Copy color codes to the clipboard
  const toast = $("#copy-toast");
  let toastTimer;
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const color = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(color);
        if (toast) {
          toast.textContent = `¡Código ${color} copiado!`;
          toast.classList.remove("hidden");
          clearTimeout(toastTimer);
          toastTimer = setTimeout(() => toast.classList.add("hidden"), 2000);
        }
      } catch {
        if (toast) { toast.textContent = `Copiá manualmente: ${color}`; toast.classList.remove("hidden"); }
      }
    });
  });

  // 3. Download brand SVGs from the live assets
  const triggerDownload = (filename, svgContent) => {
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  const wireDownload = (btnId, asset, outName) => {
    const btn = $(btnId);
    if (!btn) return;
    btn.addEventListener("click", () => {
      fetch(asset)
        .then((r) => r.text())
        .then((svg) => triggerDownload(outName, svg))
        .catch(() => console.error("[brand] download failed:", asset));
    });
  };

  wireDownload("#dl-isotype", "./assets/isotype.svg", "vantar_isotype.svg");
  wireDownload("#dl-logo-dark", "./assets/logo-dark.svg", "vantar_logo_dark.svg");
}
