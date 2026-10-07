// VANTAR Dynamics — Toolbox: pantallas (HTML estático; los datos se cargan después con textContent
// o con números calculados acá, nunca con texto escrito por la persona)

export const IC = {
  vib: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 12h3l2-6 3 12 3-9 2 5 2-2h5"/></svg>`,
  snd: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>`,
  lvl: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="9" width="20" height="6" rx="3"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></svg>`,
  mov: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20V4M4 20h16M8 14l3-4 3 2 5-6"/></svg>`,
  atras: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>`,
  cerrar: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
  si: `<svg class="si" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>`,
  aviso: `<svg class="no" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 8v5M12 16.5v.5"/><circle cx="12" cy="12" r="9"/></svg>`,
  menos: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`,
  candado: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`,
  sol: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/></svg>`,
  reloj: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
};

const volver = (destino, texto = "Instrumentos") => `<button class="tb-volver" data-ir="${destino}">${IC.atras}${texto}</button>`;
const cancelar = (destino) => `<button class="tb-volver" data-cancelar="${destino}">${IC.cerrar}Cancelar</button>`;
const anillo = (n, rot) => `<div class="tb-anillo"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" fill="none" stroke="#1d1d21" stroke-width="6"/><circle class="arco" cx="50" cy="50" r="44" fill="none" stroke="#D49A17" stroke-width="6" stroke-linecap="round" stroke-dasharray="276.5" stroke-dashoffset="276.5"/></svg><div class="n"><div><b class="seg">${n}</b><span>${rot}</span></div></div></div>`;
const chips = (grupo, etiqueta, ops, activo) => `<div class="tb-chips" data-grupo="${grupo}" role="group" aria-label="${etiqueta}">${ops.map(([v, t]) => `<button type="button" aria-pressed="${v === activo}" data-v="${v}">${t}</button>`).join("")}</div>`;
const CTX_VIB = [["maq", "Máquina"], ["est", "Estructura"], ["veh", "Vehículo"], ["otro", "Otro"]];
const CTX_SND = [["maq", "Una máquina"], ["amb", "El ambiente"], ["otro", "Otro"]];
const DUR = [["5", "5 s"], ["10", "10 s"], ["30", "30 s"]];
const acciones = (k, otraVez = "Medir de nuevo") => `
  <div class="tb-acciones">
    <button class="tb-btn pri" data-mail="${k}">${IC.mail}Recibir el informe por mail</button>
    <button class="tb-btn sec" data-consulta="${k}">Consultar con un especialista</button>
    <button class="tb-btn sec" data-abrir="${k}">${otraVez}</button>
  </div>
  <p class="tb-guardado">${IC.si}Queda en este celular hasta que pidas el informe.</p>`;
const ejes = `<div class="tb-leyenda"><span><i style="background:#D49A17"></i>X</span><span><i style="background:#fff"></i>Y</span><span><i style="background:#6fa8dc"></i>Z</span></div>`;

export const HTML = `
<div class="tb">
  <!-- ============ INICIO ============ -->
  <section class="tb-vista on" id="tb-inicio">
    <div class="sec-head">
      <span class="eyebrow">Toolbox</span>
      <h2>Instrumentos de medición en tu celular.</h2>
      <p class="lead" style="margin-top:var(--s-3);font-size:.92rem">Medí vibraciones, sonido, inclinación o movimiento de cualquier cosa: una máquina, una estructura, un vehículo. Sin instalar nada.</p>
    </div>
    <div class="tb-retomar" id="tb-retomar" hidden><span id="tb-retomar-txt"></span><button type="button" id="tb-retomar-ver">Ver</button></div>
    <div class="tb-qr" id="tb-qr-inicio" hidden><img src="./assets/qr-toolbox.svg" alt="Código QR a vantardynamics.com" width="104" height="104"><div><b>Mejor desde tu celular</b><span>Escaneá el código y medí en segundos: Vibraciones, Nivel y Movimiento usan los sensores del teléfono. Sonido también funciona en esta computadora, con su micrófono.</span></div></div>
    <div class="tb-lista">
      <button class="tb-inst" data-abrir="vib"><span class="tb-ic">${IC.vib}</span><span><b>Vibraciones</b><span>Cuánto vibra y a qué frecuencia.</span></span><span class="tb-meta">mm/s · Hz<em data-quedan="vib"></em></span></button>
      <button class="tb-inst" data-abrir="snd"><span class="tb-ic">${IC.snd}</span><span><b>Sonido</b><span>Nivel de ruido y tonos que dominan.</span></span><span class="tb-meta">dB · Hz<em data-quedan="snd"></em></span></button>
      <button class="tb-inst" data-abrir="lvl"><span class="tb-ic">${IC.lvl}</span><span><b>Nivel e inclinación</b><span>Ángulos en dos ejes, con burbuja.</span></span><span class="tb-meta">grados<em>libre</em></span></button>
      <button class="tb-inst" data-abrir="mov"><span class="tb-ic">${IC.mov}</span><span><b>Movimiento</b><span>Aceleración y giro en 3 ejes, hasta 1 minuto.</span></span><span class="tb-meta">m/s² · °/s<em data-quedan="mov"></em></span></button>
    </div>
    <div class="tb-como" aria-label="Cómo funciona">
      <div><b>1</b><span>Elegí un instrumento</span></div>
      <div><b>2</b><span>Apoyá el celular y medí</span></div>
      <div><b>3</b><span>Recibí el informe por mail</span></div>
    </div>
    <button class="tb-link" data-ir="tb-faq">¿Qué tan preciso es? Preguntas frecuentes</button>
    <p class="tb-confianza">${IC.candado}Las mediciones se procesan en tu celular. Solo salen de él cuando pedís el informe por mail.</p>
  </section>

  <!-- ============ PREGUNTAS ============ -->
  <section class="tb-vista" id="tb-faq">
    <div class="tb-barra">${volver("tb-inicio")}</div>
    <h2>Preguntas frecuentes</h2>
    <div class="tb-faq">
      <details open><summary>¿Qué tan precisa es una medición con el celular?</summary><p>Sirve para orientarse y comparar: antes y después de un arreglo, una máquina contra otra igual. Los sensores del celular no están calibrados y muchos navegadores leen unas 60 veces por segundo, así que solo ven vibraciones de hasta unos 30 Hz. Para un diagnóstico o un informe con validez técnica medimos con instrumental calibrado.</p></details>
      <details><summary>¿Qué mide cada instrumento?</summary><p>Vibraciones: cuánto vibra algo (mm/s) y a qué frecuencia (Hz). Sonido: el nivel de ruido (dB aproximados) y los tonos que dominan. Nivel e inclinación: ángulos en grados. Movimiento: la aceleración y la velocidad de giro en los tres ejes del celular, durante hasta 1 minuto.</p></details>
      <details><summary>¿Qué significan mm/s y Hz?</summary><p>mm/s es la velocidad de vibración: cuanto más alta, más fuerte vibra. Es la unidad que usan las normas de máquinas. Hz es cuántas veces por segundo se repite: 25 Hz son 1.500 vueltas por minuto. Si la frecuencia coincide con la velocidad de giro de algo, ahí suele estar la causa.</p></details>
      <details><summary>¿Se guardan o se envían mis datos?</summary><p>Todo se procesa en tu celular y no hay ninguna base de datos. La última medición queda en tu celular hasta que pedís el informe, para que no se pierda si se recarga la página. Al pedir el informe, se envía por mail a vos y a VANTAR, junto con los datos que cargues.</p></details>
      <details><summary>¿Puedo descargar los datos de la medición?</summary><p>No desde la web: lo que recibís es el informe detallado por mail. Si necesitás los datos completos para un análisis, consultanos y lo vemos con vos.</p></details>
      <details><summary>¿Por qué pide permiso?</summary><p>Los celulares protegen los sensores de movimiento y el micrófono. El permiso es solo para esta página y para medir; el audio no se graba.</p></details>
      <details><summary>¿Cuántas mediciones puedo hacer?</summary><p>Tres por instrumento cada 30 días, en cada celular. Cada medición se libera 30 días después de hecha. Nivel e inclinación es libre. Si necesitás medir más, escribinos.</p></details>
      <details><summary>¿Qué celular necesito?</summary><p>Cualquier celular con un navegador actualizado (Chrome, Safari o Firefox). En computadora, escaneá el código QR para abrirlo en el celular.</p></details>
    </div>
    <button class="tb-btn pri" data-ir="tb-inicio">Empezar a medir</button>
  </section>

  <!-- ============ VIBRACIONES ============ -->
  <section class="tb-vista" id="vib-prep">
    <div class="tb-barra">${volver("tb-inicio")}</div>
    <h2>Vibraciones</h2>
    <div class="tb-dibujo" aria-hidden="true"><svg viewBox="0 0 320 120"><rect width="320" height="120" fill="#161619"/><rect x="30" y="74" width="260" height="26" rx="6" fill="#26262b" stroke="#3a3a40"/><rect x="122" y="54" width="76" height="20" rx="5" fill="#0d0d0f" stroke="#D49A17" stroke-width="2"/><circle cx="190" cy="64" r="2" fill="#D49A17"/><path d="M136 40c4-5 8-5 12 0s8 5 12 0 8-5 12 0 8-5 12 0" stroke="#D49A17" stroke-width="2" fill="none" stroke-linecap="round"/><text x="160" y="22" fill="#a1a1a6" font-size="11" text-anchor="middle" font-family="Space Grotesk, sans-serif">celular acostado y firme sobre lo que medís</text></svg></div>
    <p class="tb-rot">Qué estás midiendo</p>
    ${chips("vibctx", "Qué estás midiendo", CTX_VIB, "maq")}
    <p class="tb-rot">Duración</p>
    ${chips("vibdur", "Duración", DUR, "10")}
    <ol class="tb-pasos">
      <li><span><b>Apoyá el celular acostado</b> sobre lo que querés medir. Mejor si queda sujeto con una banda elástica o cinta.</span></li>
      <li><span><b>Soltalo.</b> Si lo sostenés con la mano, medís tu pulso.</span></li>
    </ol>
    <p class="tb-error" data-error hidden></p>
    <div data-solo-celular></div>
    <button class="tb-btn pri" data-medir="vib">Medir 10 segundos</button>
    <p class="tb-cupo" data-cupo="vib"></p>
    <p class="tb-fino">El celular te va a pedir permiso para usar el sensor de movimiento. La pantalla queda encendida mientras mide.</p>
  </section>

  <section class="tb-vista" id="vib-run">
    <div class="tb-barra">${cancelar("vib-prep")}<span class="tb-pill vivo"><i></i>Midiendo</span></div>
    ${anillo(10, "segundos")}
    <canvas id="vib-onda" width="680" height="200" aria-label="Señal de vibración en vivo"></canvas>
    <p class="tb-ayuda">No toques el celular hasta que termine. La pantalla queda encendida y el celular vibra cuando está listo.</p>
  </section>

  <section class="tb-vista" id="vib-res">
    <div class="tb-barra">${volver("tb-inicio")}<span class="tb-pill" data-listo><i></i>Listo</span></div>
    <div class="tb-datos">
      <div class="tb-dato"><small>Nivel de vibración</small><b id="vib-nivel">—</b><span>mm/s</span></div>
      <div class="tb-dato"><small>Frecuencia dominante</small><b id="vib-fdom">—</b><span id="vib-rpm">Hz</span></div>
      <div class="tb-dato"><small>Aceleración máxima</small><b id="vib-amax">—</b><span>m/s²</span></div>
    </div>
    <div class="tb-caja tb-cal" data-calidad aria-label="Calidad de la medición"></div>
    <canvas id="vib-esp" width="680" height="240" aria-label="Espectro: en qué frecuencias se concentra la vibración"></canvas>
    <p class="tb-rot">Interpretar como</p>
    ${chips("vibctx", "Interpretar como", CTX_VIB, "maq")}
    <div class="tb-caja" data-interp aria-live="polite"></div>
    <div class="tb-caja">
      <h3>Lo que ve tu celular y lo que ve VANTAR</h3>
      <canvas id="vib-vs" width="680" height="200" aria-label="Comparativo: rango de frecuencias que ve el celular y el del instrumental VANTAR"></canvas>
      <p class="tb-por" id="vib-vs-txt"></p>
      <button class="tb-link" data-productos>Conocer los instrumentos</button>
    </div>
    ${acciones("vib")}
    <p class="tb-fino">Medición orientativa con el sensor del celular. Para resultados confiables medimos con instrumental calibrado.</p>
  </section>

  <!-- ============ SONIDO ============ -->
  <section class="tb-vista" id="snd-prep">
    <div class="tb-barra">${volver("tb-inicio")}</div>
    <h2>Sonido</h2>
    <div class="tb-dibujo" aria-hidden="true"><svg viewBox="0 0 320 120"><rect width="320" height="120" fill="#161619"/><rect x="34" y="40" width="86" height="56" rx="8" fill="#26262b" stroke="#3a3a40"/><circle cx="77" cy="68" r="14" fill="none" stroke="#3a3a40" stroke-width="2"/><path d="M134 50c8 8 8 28 0 36M146 42c13 13 13 39 0 52" stroke="#D49A17" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="220" y="30" width="30" height="62" rx="6" fill="#0d0d0f" stroke="#D49A17" stroke-width="2" transform="rotate(-90 235 61)"/><circle cx="206" cy="61" r="2.5" fill="#D49A17"/><line x1="160" y1="104" x2="205" y2="104" stroke="#8a8a90" stroke-dasharray="3 3"/><text x="182" y="116" fill="#8a8a90" font-size="10" text-anchor="middle" font-family="Space Grotesk, sans-serif">30 cm</text><text x="160" y="20" fill="#a1a1a6" font-size="11" text-anchor="middle" font-family="Space Grotesk, sans-serif">micrófono (abajo del celular) hacia la fuente</text></svg></div>
    <p class="tb-rot">Qué estás escuchando</p>
    ${chips("sndctx", "Qué estás escuchando", CTX_SND, "maq")}
    <p class="tb-rot">Duración</p>
    ${chips("snddur", "Duración", DUR, "10")}
    <ol class="tb-pasos">
      <li><span><b>Apuntá la parte de abajo del celular</b> (donde está el micrófono) hacia lo que hace ruido, a unos 30 cm.</span></li>
      <li><span><b>Quedate en silencio</b> mientras mide, y que no haya otras fuentes de ruido cerca.</span></li>
    </ol>
    <p class="tb-error" data-error hidden></p>
    <button class="tb-btn pri" data-medir="snd">Medir 10 segundos</button>
    <p class="tb-cupo" data-cupo="snd"></p>
    <p class="tb-fino">El celular te va a pedir permiso para usar el micrófono. El audio no se graba ni se guarda.</p>
  </section>

  <section class="tb-vista" id="snd-run">
    <div class="tb-barra">${cancelar("snd-prep")}<span class="tb-pill vivo"><i></i>Escuchando · <span class="seg">10</span> s</span></div>
    <div class="tb-medidor"><b><span id="snd-db">—</span><small>dB aprox.</small></b><div class="tb-nivelbar"><i id="snd-barra"></i></div></div>
    <canvas id="snd-vivo" width="680" height="240" aria-label="Espectro de sonido en vivo"></canvas>
    <p class="tb-ayuda">Silencio, por favor. Termina sola y el celular vibra al final.</p>
  </section>

  <section class="tb-vista" id="snd-res">
    <div class="tb-barra">${volver("tb-inicio")}<span class="tb-pill" data-listo><i></i>Listo</span></div>
    <div class="tb-datos">
      <div class="tb-dato"><small>Nivel promedio</small><b id="snd-prom">—</b><span>dB aprox.</span></div>
      <div class="tb-dato"><small>Nivel máximo</small><b id="snd-max">—</b><span>dB aprox.</span></div>
      <div class="tb-dato"><small>Tono dominante</small><b id="snd-tono">—</b><span id="snd-clase">Hz</span></div>
    </div>
    <div class="tb-caja tb-cal" data-calidad aria-label="Calidad de la medición"></div>
    <canvas id="snd-esp" width="680" height="240" aria-label="Espectro: qué tonos tiene el sonido"></canvas>
    <p class="tb-rot">Interpretar como</p>
    ${chips("sndctx", "Interpretar como", CTX_SND, "maq")}
    <div class="tb-caja" data-interp aria-live="polite"></div>
    ${acciones("snd")}
    <p class="tb-fino">El micrófono del celular no está calibrado: los dB son aproximados y sirven para comparar, no para certificar.</p>
  </section>

  <!-- ============ NIVEL ============ -->
  <section class="tb-vista" id="lvl">
    <div class="tb-barra">${volver("tb-inicio")}<span class="tb-pill vivo" id="lvl-vivo"><i></i>En vivo</span></div>
    <h2>Nivel e inclinación</h2>
    ${chips("lvlmodo", "Cómo apoyás el celular", [["sup", "Acostado: superficie"], ["canto", "De canto: ángulo"]], "sup")}
    <p class="tb-error" data-error hidden></p>
    <div data-solo-celular></div>
    <div id="lvl-sup"><div class="tb-burbuja" id="lvl-burbuja"><span class="blanco"></span><span class="gota" id="lvl-gota"></span></div></div>
    <div id="lvl-canto" hidden>
      <div class="tb-canto">
        <svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="88" fill="#161619" stroke="rgba(255,255,255,.09)"/><g stroke="rgba(255,255,255,.18)"><line x1="12" y1="100" x2="30" y2="100"/><line x1="170" y1="100" x2="188" y2="100"/><line x1="100" y1="12" x2="100" y2="24"/></g><line x1="20" y1="100" x2="180" y2="100" stroke="rgba(255,255,255,.12)" stroke-dasharray="4 4"/><g id="lvl-linea"><line x1="22" y1="100" x2="178" y2="100" stroke="#D49A17" stroke-width="4" stroke-linecap="round"/><circle cx="100" cy="100" r="5" fill="#D49A17"/></g></svg>
        <span class="grados" id="lvl-grados">0,0°</span>
      </div>
      <p class="tb-fino tb-centro">Apoyá el lado largo del celular sobre la superficie.</p>
    </div>
    <div class="tb-datos">
      <div class="tb-dato"><small id="lvl-r1">Adelante / atrás</small><b id="lvl-a1">—</b></div>
      <div class="tb-dato"><small id="lvl-r2">Izquierda / derecha</small><b id="lvl-a2">—</b></div>
      <div class="tb-dato"><small>Estado</small><b id="lvl-estado" style="font-size:1rem">—</b></div>
    </div>
    <div class="tb-acciones">
      <button class="tb-btn sec medio" id="lvl-cero">Fijar cero aquí</button>
      <button class="tb-btn sec medio" id="lvl-guardar">Guardar lectura</button>
    </div>
    <ul class="tb-lecturas" id="lvl-lista" aria-live="polite"></ul>
    <p class="tb-fino">El celular vibra al quedar nivelado (±0,2°). «Fijar cero» toma la posición actual como referencia. Las lecturas guardadas se borran al salir.</p>
  </section>

  <!-- ============ MOVIMIENTO ============ -->
  <section class="tb-vista" id="mov-prep">
    <div class="tb-barra">${volver("tb-inicio")}</div>
    <h2>Movimiento</h2>
    <p class="tb-sub">Registra la aceleración y la velocidad de giro en los tres ejes del celular, durante hasta 1 minuto.</p>
    <div class="tb-dibujo" aria-hidden="true"><svg viewBox="0 0 320 130"><rect width="320" height="130" fill="#161619"/><g transform="translate(160 70)"><rect x="-26" y="-44" width="52" height="88" rx="9" fill="#0d0d0f" stroke="#3a3a40" stroke-width="2"/><line x1="0" y1="0" x2="70" y2="0" stroke="#D49A17" stroke-width="2.5"/><path d="M70 -5 80 0 70 5Z" fill="#D49A17"/><text x="86" y="4" fill="#D49A17" font-size="12" font-family="Space Grotesk, sans-serif">X</text><line x1="0" y1="0" x2="0" y2="-58" stroke="#ffffff" stroke-width="2.5"/><path d="M-5 -58 0 -66 5 -58Z" fill="#ffffff"/><text x="8" y="-56" fill="#ffffff" font-size="12" font-family="Space Grotesk, sans-serif">Y</text><line x1="0" y1="0" x2="-48" y2="30" stroke="#6fa8dc" stroke-width="2.5"/><path d="M-46 24 -56 35 -41 33Z" fill="#6fa8dc"/><text x="-72" y="44" fill="#6fa8dc" font-size="12" font-family="Space Grotesk, sans-serif">Z</text></g></svg></div>
    <ol class="tb-pasos">
      <li><span><b>Sujetá el celular</b> a lo que querés registrar: una puerta, una herramienta, un vehículo.</span></li>
      <li><span><b>Dejalo quieto 3 segundos.</b> Medimos hacia dónde está la gravedad y la restamos, para que solo quede el movimiento.</span></li>
      <li><span><b>Registrá hasta 1 minuto.</b> Podés detenerlo antes; al minuto termina solo.</span></li>
    </ol>
    <p class="tb-error" data-error hidden></p>
    <div data-solo-celular></div>
    <button class="tb-btn pri" data-medir="mov">Alinear y empezar</button>
    <p class="tb-cupo" data-cupo="mov"></p>
    <p class="tb-fino">El celular te va a pedir permiso para usar los sensores de movimiento. La pantalla queda encendida mientras registra.</p>
  </section>

  <section class="tb-vista" id="mov-align">
    <div class="tb-barra">${cancelar("mov-prep")}<span class="tb-pill vivo"><i></i>Alineando</span></div>
    ${anillo(3, "quieto")}
    <div class="tb-caja tb-cal" aria-live="polite">
      <h3>Alineando con la gravedad</h3>
      <ul>
        <li>${IC.si}<span id="mov-eje">Buscando hacia dónde está el piso…</span></li>
        <li>${IC.si}<span>Después de alinear, la gravedad se resta y los gráficos arrancan en cero.</span></li>
      </ul>
    </div>
    <p class="tb-ayuda" id="mov-align-ayuda">No lo muevas hasta que empiece a registrar.</p>
  </section>

  <section class="tb-vista" id="mov-run">
    <div class="tb-barra"><span class="tb-pill rec"><i></i>Registrando</span><span class="tb-pill" id="mov-t">0:00 / 1:00</span></div>
    <div class="tb-progreso" aria-hidden="true"><i id="mov-prog"></i></div>
    <canvas id="mov-vivo" width="680" height="300" aria-label="Aceleración en vivo en los tres ejes"></canvas>
    ${ejes}
    <div class="tb-datos">
      <div class="tb-dato x"><small>Aceleración X</small><b id="mov-ax">0,00</b><span>m/s²</span></div>
      <div class="tb-dato"><small>Aceleración Y</small><b id="mov-ay">0,00</b><span>m/s²</span></div>
      <div class="tb-dato z"><small>Aceleración Z</small><b id="mov-az">0,00</b><span>m/s²</span></div>
      <div class="tb-dato x"><small>Giro X</small><b id="mov-gx">0</b><span>°/s</span></div>
      <div class="tb-dato"><small>Giro Y</small><b id="mov-gy">0</b><span>°/s</span></div>
      <div class="tb-dato z"><small>Giro Z</small><b id="mov-gz">0</b><span>°/s</span></div>
    </div>
    <button class="tb-btn alto" id="mov-detener">Detener</button>
  </section>

  <section class="tb-vista" id="mov-res">
    <div class="tb-barra">${volver("tb-inicio")}<span class="tb-pill"><i></i>Registro listo</span></div>
    <div class="tb-datos">
      <div class="tb-dato"><small>Duración</small><b id="mov-dur">—</b><span>de 1:00 máx.</span></div>
      <div class="tb-dato"><small>Aceleración máxima</small><b id="mov-amax">—</b><span id="mov-aeje">m/s²</span></div>
      <div class="tb-dato"><small>Aceleración típica</small><b id="mov-arms">—</b><span>m/s² · RMS</span></div>
      <div class="tb-dato"><small>Muestras</small><b id="mov-n">—</b><span id="mov-fs">por segundo</span></div>
      <div class="tb-dato"><small>Giro máximo</small><b id="mov-gmax">—</b><span id="mov-geje">°/s</span></div>
      <div class="tb-dato"><small>Giro típico</small><b id="mov-grms">—</b><span>°/s · RMS</span></div>
    </div>
    <div class="tb-seg" role="group" aria-label="Qué gráfico ver"><button type="button" aria-pressed="true" data-graf="acc">Aceleración</button><button type="button" aria-pressed="false" data-graf="gir">Giro</button></div>
    <canvas id="mov-graf" width="680" height="280" aria-label="Registro completo"></canvas>
    ${ejes}
    ${acciones("mov", "Registrar de nuevo")}
    <p class="tb-fino" id="mov-fino">Alineado con la gravedad al empezar: la aceleración muestra solo el movimiento. Medición orientativa con los sensores del celular.</p>
  </section>

  <!-- ============ INFORME POR MAIL ============ -->
  <section class="tb-vista" id="tb-mail">
    <div class="tb-barra"><button class="tb-volver" data-al-resultado>${IC.atras}Resultado</button></div>
    <h2>Recibí el informe detallado</h2>
    <p class="tb-sub">Te lo mandamos a tu mail. Una copia llega a VANTAR, por si querés que te ayudemos a interpretarlo.</p>
    <div class="tb-caja tb-incl"><h3 id="mail-titulo">Informe</h3><ul id="mail-incluye"></ul></div>
    <form id="tb-form" class="tb-form" novalidate>
      <div class="tb-campo"><label for="tm-nombre">Nombre y apellido</label><input id="tm-nombre" name="nombre" autocomplete="name" maxlength="80" required></div>
      <div class="tb-campo"><label for="tm-empresa">Empresa</label><input id="tm-empresa" name="empresa" autocomplete="organization" maxlength="100" required></div>
      <div class="tb-campo"><label for="tm-email">Email</label><input id="tm-email" name="email" type="email" autocomplete="email" maxlength="120" inputmode="email" required></div>
      <div class="tb-campo"><label for="tm-rubro">Rubro</label>
        <select id="tm-rubro" name="rubro" required><option value="">Elegí una opción</option><option>Maquinaria agrícola</option><option>Metalmecánica</option><option>Alimentos y bebidas</option><option>Minería y energía</option><option>Construcción</option><option>Otro</option></select></div>
      <div class="tb-campo"><label for="tm-tel">Teléfono <small>(opcional)</small></label><input id="tm-tel" name="telefono" type="tel" autocomplete="tel" maxlength="40" placeholder="+54 9 …"></div>
      <label class="tb-check"><input type="checkbox" id="tm-contacto" checked><span>Quiero que VANTAR me contacte por esta medición.</span></label>
      <input type="text" name="sitio" id="tm-sitio" class="tb-trampa" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div id="tm-turnstile"></div>
      <p class="tb-error" id="tm-error" role="alert" hidden></p>
      <button class="tb-btn pri" type="submit" id="tm-enviar">Enviar el informe</button>
      <p class="tb-fino">Usamos tus datos solo para enviarte el informe y, si lo marcaste, para contactarte.</p>
    </form>
  </section>

  <section class="tb-vista" id="tb-enviado">
    <div class="tb-gran-ok" id="env-ic">${IC.si}</div>
    <h2 class="tb-centro" id="env-titulo">Listo, revisá tu mail</h2>
    <p class="tb-sub tb-centro" id="env-txt"></p>
    <div class="tb-caja"><span class="tb-fino" id="env-nota">Si no llega en unos minutos, revisá la carpeta de spam. Sin señal, el envío queda en espera y sale solo cuando vuelve la conexión.</span></div>
    <button class="tb-btn sec" data-al-resultado>Volver al resultado</button>
    <button class="tb-btn sec" data-ir="tb-inicio">Instrumentos</button>
  </section>

  <!-- ============ LÍMITE ============ -->
  <section class="tb-vista" id="tb-tope">
    <div class="tb-barra">${volver("tb-inicio")}</div>
    <p class="tb-cupo-num">3 / 3</p>
    <h2 class="tb-centro" id="tope-titulo">Usaste tus 3 mediciones gratis</h2>
    <p class="tb-sub tb-centro" id="tope-txt"></p>
    <button class="tb-btn pri" data-consulta="tope">Hablar con VANTAR</button>
    <button class="tb-btn sec" data-abrir="lvl">Usar Nivel e inclinación (libre)</button>
    <p class="tb-fino tb-centro">Cada medición se libera 30 días después de hecha, en este celular.</p>
  </section>
</div>`;

export const SOLO_CELULAR = `<div class="tb-qr"><img src="./assets/qr-toolbox.svg" alt="Código QR a vantardynamics.com" width="104" height="104"><div><b>Este instrumento usa el celular</b><span>Necesita los sensores de movimiento del teléfono. Escaneá el código para abrirlo ahí.</span></div></div>`;
