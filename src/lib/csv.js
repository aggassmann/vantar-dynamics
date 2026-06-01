// VANTAR Dynamics — CSV export helper
// Triggers a client-side download with precise timestamps and raw readings.

/**
 * Build a CSV string from a header row and array-of-arrays rows.
 * @param {string[]} header
 * @param {Array<Array<string|number>>} rows
 */
export function toCSV(header, rows) {
  const esc = (v) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [header.map(esc).join(",")];
  for (const r of rows) lines.push(r.map(esc).join(","));
  return lines.join("\r\n");
}

/** Download text as a file (revokes the object URL after the click). */
export function downloadText(filename, text, mime = "text/csv;charset=utf-8") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/** Timestamped filename like `vantar_accel_2026-06-01T14-22-08.csv`. */
export function stampedName(prefix, ext = "csv") {
  const iso = new Date().toISOString().replace(/:/g, "-").replace(/\..+/, "");
  return `${prefix}_${iso}.${ext}`;
}
