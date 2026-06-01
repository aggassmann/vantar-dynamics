// VANTAR Dynamics — Shared tool view scaffold
export function toolShell(meta, bodyHTML) {
  return `
  <div class="toolview is-active">
    <button class="tool-back" data-tool-back aria-label="Volver al toolbox">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      Toolbox
    </button>
    <div class="tool-head">
      <div class="ic">${meta.icon}</div>
      <div><h2>${meta.name}</h2><p>${meta.sub}</p></div>
    </div>
    ${bodyHTML}
  </div>`;
}

// Friendly fallback block when a sensor/API is unavailable.
export function fallback(message) {
  return `<div class="warnbox" style="margin-top:var(--s-4)">⚠️ ${message}</div>`;
}
