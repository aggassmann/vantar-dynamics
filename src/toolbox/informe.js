// VANTAR Dynamics — Toolbox: envío del informe por mail
// Camino principal: un script de Google en la cuenta de VANTAR (ver servicios/informe-toolbox.gs)
// que arma el mail y lo manda a la persona, con copia a VANTAR. No guarda nada.
// Si el script todavía no está configurado o falla, el pedido llega igual a VANTAR por Formspree
// (el mismo servicio del formulario de Contacto), para no perder a nadie.
// Sin señal: el pedido queda guardado en el celular y sale solo cuando vuelve la conexión.

import * as datos from "../ui/datos.js";
import { guardarPendiente, pendiente, borrarPendiente } from "./almacen.js";

const FORMSPREE = "https://formspree.io/f/xvkgydjl";

const conf = () => datos.TOOLBOX || {};

async function alScript(pedido) {
  const url = conf().informeUrl;
  if (!url) throw new Error("sin-script");
  // text/plain evita la consulta previa de CORS; el script responde JSON
  const r = await fetch(url, { method: "POST", body: JSON.stringify(pedido), headers: { "Content-Type": "text/plain;charset=utf-8" }, redirect: "follow" });
  const j = await r.json().catch(() => ({}));
  if (j.ok) return "enviado";
  if (j.error === "limite") return "limite";
  if (j.error === "datos") return "datos";
  throw new Error(j.error || `HTTP ${r.status}`);
}

async function aFormspree(pedido) {
  const p = pedido.persona;
  const fd = new FormData();
  fd.append("_subject", `[VANTAR Toolbox] Pedido de informe de ${pedido.medicion.titulo} — ${p.nombre}`);
  fd.append("name", p.nombre);
  fd.append("email", p.email);
  fd.append("empresa", p.empresa);
  fd.append("rubro", p.rubro);
  fd.append("telefono", p.telefono || "-");
  fd.append("contacto", p.contacto ? "Sí, quiere que lo contacten" : "No");
  fd.append("message", `${pedido.medicion.resumen}\n\nEl script del informe no respondió: mandale el informe a mano.`);
  const r = await fetch(FORMSPREE, { method: "POST", body: fd, headers: { Accept: "application/json" } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return "recibido";
}

/**
 * Envía el pedido. Resultados: "enviado" (mail en camino), "recibido" (llegó a VANTAR, el informe
 * sale a mano), "en-espera" (sin señal, sale solo), "limite", "datos" o "error".
 */
export async function enviar(pedido) {
  if (!navigator.onLine) { guardarPendiente(pedido); return "en-espera"; }
  try {
    return await alScript(pedido);
  } catch (e) {
    if (!navigator.onLine) { guardarPendiente(pedido); return "en-espera"; }
    try { return await aFormspree(pedido); }
    catch { if (!navigator.onLine) { guardarPendiente(pedido); return "en-espera"; } return "error"; }
  }
}

/** Reintenta el pedido guardado sin señal (al cargar la página y al volver la conexión). */
export function vigilarPendiente(alSalir) {
  const intentar = async () => {
    const p = pendiente();
    if (!p || !navigator.onLine) return;
    const r = await enviar(p);
    if (r !== "en-espera") { borrarPendiente(); alSalir && alSalir(r); }
  };
  window.addEventListener("online", intentar);
  setTimeout(intentar, 1500);
}
