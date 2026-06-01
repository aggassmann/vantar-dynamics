// VANTAR Dynamics — Portfolio data
// Each project carries an inline SVG "cover" so the app stays asset-light and
// works fully offline. Replace covers/photos with real renders any time.

const cover = (a, b, paths) => `
<svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cg-${a.replace('#','')}" x1="0" y1="0" x2="400" y2="200" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="200" fill="url(#cg-${a.replace('#','')})"/>
  <g fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</g>
</svg>`;

export const PROJECTS = [
  {
    id: "daq-vibration",
    tag: "Adquisición de datos",
    title: "Sistema DAQ multicanal",
    desc: "Plataforma de adquisición a 10 kHz para monitoreo de vibración en maquinaria rotativa.",
    cover: cover("#ff6b35", "#b5379b",
      `<polyline points="20,150 60,90 100,130 140,60 180,110 220,40 260,120 300,70 340,140 380,100"/>
       <line x1="20" y1="170" x2="380" y2="170" stroke-opacity="0.5"/>`),
    year: "2025",
    role: "Diseño electrónico + firmware",
    stack: ["STM32", "ADS1256", "Python", "InfluxDB"],
    overview: "Diseño de un nodo de adquisición de 8 canales sincronizados con timestamping por hardware para análisis modal y mantenimiento predictivo. Captura simultánea de acelerómetros IEPE y termopares con streaming a un dashboard en tiempo real.",
    specs: [
      ["Canales", "8 simultáneos (24-bit)"],
      ["Tasa de muestreo", "Hasta 10 kS/s por canal"],
      ["Sincronía", "Timestamp por hardware (±5 µs)"],
      ["Transporte", "MQTT sobre WiFi/4G"],
      ["Resultado", "Detección de desbalance 3 semanas antes de la falla"],
    ],
  },
  {
    id: "agri-vision",
    tag: "Visión artificial · AgTech",
    title: "Conteo y clasificación de frutos",
    desc: "Visión embebida para estimación de rendimiento y detección de plagas en cultivo.",
    cover: cover("#6d28d9", "#ff6b35",
      `<circle cx="120" cy="90" r="26"/><circle cx="200" cy="120" r="20"/>
       <circle cx="270" cy="70" r="30"/><rect x="40" y="40" width="320" height="120" rx="10" stroke-opacity="0.5"/>`),
    year: "2025",
    role: "Pipeline de visión + edge AI",
    stack: ["Jetson", "YOLOv8", "OpenCV", "TensorRT"],
    overview: "Modelo de detección optimizado con TensorRT corriendo en el borde sobre un vehículo agrícola. Estima rendimiento por hilera y marca focos de plaga geolocalizados, generando mapas de prescripción para aplicación variable.",
    specs: [
      ["Inferencia", "38 FPS en Jetson Orin Nano"],
      ["Precisión (mAP)", "0.91 en condiciones de campo"],
      ["Geolocalización", "RTK-GPS, error < 3 cm"],
      ["Salida", "Mapas de prescripción ISOXML"],
      ["Impacto", "−22% de agroquímico aplicado"],
    ],
  },
  {
    id: "cae-harvester",
    tag: "Diseño CAD/CAE",
    title: "Cabezal cosechador optimizado",
    desc: "Rediseño estructural y análisis FEA de un cabezal para reducir masa manteniendo rigidez.",
    cover: cover("#3b0d6b", "#8b5cf6",
      `<path d="M40,150 L120,60 L200,60 L280,150 Z"/><line x1="120" y1="60" x2="200" y2="150"/>
       <line x1="200" y1="60" x2="120" y2="150"/><line x1="40" y1="150" x2="280" y2="150"/>`),
    year: "2024",
    role: "Análisis estructural (FEA)",
    stack: ["SolidWorks", "Ansys", "Topology Opt."],
    overview: "Optimización topológica y análisis de fatiga de un cabezal cosechador. Se redujo la masa de la estructura conservando los márgenes de seguridad bajo cargas dinámicas de operación en terreno irregular.",
    specs: [
      ["Reducción de masa", "−18% (−47 kg)"],
      ["Factor de seguridad", "≥ 2.4 (fatiga)"],
      ["Cargas", "Espectro dinámico medido en campo"],
      ["Validación", "Strain gauges en prototipo"],
      ["Resultado", "Menor consumo y mayor maniobrabilidad"],
    ],
  },
  {
    id: "automation-cell",
    tag: "Automatización",
    title: "Celda de automatización industrial",
    desc: "Línea de clasificación automatizada con PLC, visión y robótica colaborativa.",
    cover: cover("#ff9a52", "#6d28d9",
      `<rect x="40" y="120" width="320" height="20" rx="4"/><circle cx="90" cy="160" r="14"/>
       <circle cx="170" cy="160" r="14"/><circle cx="250" cy="160" r="14"/><circle cx="330" cy="160" r="14"/>
       <rect x="150" y="50" width="100" height="50" rx="6"/>`),
    year: "2024",
    role: "Integración & control",
    stack: ["Siemens S7", "UR Cobot", "SCADA", "OPC-UA"],
    overview: "Celda llave en mano que integra un PLC Siemens, un cobot UR y un sistema de visión para clasificar producto por calidad. Trazabilidad completa vía OPC-UA hacia el MES de planta.",
    specs: [
      ["Throughput", "1.200 piezas/hora"],
      ["Disponibilidad", "OEE 94%"],
      ["Seguridad", "Categoría PLd (ISO 13849)"],
      ["Trazabilidad", "OPC-UA → MES"],
      ["ROI", "< 14 meses"],
    ],
  },
  {
    id: "telemetry-fleet",
    tag: "IoT · Edge",
    title: "Telemetría de flota agrícola",
    desc: "Red de nodos LoRa/4G para telemetría y mantenimiento predictivo de maquinaria.",
    cover: cover("#b5379b", "#ff6b35",
      `<circle cx="200" cy="100" r="10"/><circle cx="200" cy="100" r="40" stroke-opacity="0.6"/>
       <circle cx="200" cy="100" r="70" stroke-opacity="0.35"/><line x1="200" y1="100" x2="300" y2="50"/>
       <line x1="200" y1="100" x2="120" y2="150"/>`),
    year: "2023",
    role: "Arquitectura IoT",
    stack: ["LoRaWAN", "ESP32", "Node-RED", "Grafana"],
    overview: "Arquitectura de telemetría híbrida LoRa/4G que reporta horas-motor, consumo y eventos de falla de una flota distribuida. Tableros Grafana con alertas tempranas de mantenimiento.",
    specs: [
      ["Cobertura", "Hasta 12 km (LoRa rural)"],
      ["Autonomía", "> 2 años por nodo"],
      ["Métricas", "Horas, RPM, presión, geocerca"],
      ["Alertas", "Predictivas vía umbrales adaptativos"],
      ["Flota", "+30 equipos monitoreados"],
    ],
  },
  {
    id: "dynamic-testbench",
    tag: "Análisis dinámico",
    title: "Banco de ensayo dinámico",
    desc: "Banco instrumentado para caracterizar respuesta en frecuencia y amortiguamiento.",
    cover: cover("#6d28d9", "#ffb86b",
      `<path d="M20,100 C60,40 100,160 140,100 S220,40 260,100 S340,160 380,100"/>
       <line x1="20" y1="100" x2="380" y2="100" stroke-opacity="0.4"/>`),
    year: "2023",
    role: "Instrumentación & análisis",
    stack: ["LabVIEW", "Shaker", "FFT", "Matlab"],
    overview: "Banco con excitador electrodinámico para obtener funciones de respuesta en frecuencia (FRF), identificar modos y ajustar modelos. Base experimental para validar simulaciones CAE.",
    specs: [
      ["Rango", "5 Hz – 2 kHz"],
      ["Identificación", "Modos, frecuencias y ζ"],
      ["Método", "FRF + ajuste modal"],
      ["Correlación", "MAC > 0.9 vs. FEA"],
      ["Uso", "Validación de modelos numéricos"],
    ],
  },
];
