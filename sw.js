/* VANTAR Dynamics — Service Worker
   Offline-first cache for the static app shell. Sensor APIs still require
   HTTPS + user gesture at runtime; this only handles asset delivery. */

const CACHE = "vantar-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/favicon.svg",
  "./assets/og-image.svg",
  "./assets/isotype.svg",
  "./assets/logo-dark.svg",
  "./assets/logo-light.svg",
  "./styles/tokens.css",
  "./styles/base.css",
  "./styles/components.css",
  "./styles/hero.css",
  "./src/app.js",
  "./src/data/projects.js",
  "./src/ui/portfolio.js",
  "./src/ui/contact.js",
  "./src/ui/permissions.js",
  "./src/ui/diagnostics.js",
  "./src/ui/brand.js",
  "./src/lib/chart.js",
  "./src/lib/fft.js",
  "./src/lib/csv.js",
  "./src/tools/accelerometer.js",
  "./src/tools/vibration.js",
  "./src/tools/magnetometer.js",
  "./src/tools/luxmeter.js",
  "./src/tools/soundmeter.js",
  "./src/tools/inclinometer.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("message", (e) => {
  if (e.data === "skip") self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;

  // Network-first everywhere so code/style updates always reach the installed
  // PWA when online; the cache is only an offline fallback. This avoids the
  // classic "stale cached JS" trap with cache-first service workers.
  e.respondWith(
    fetch(request)
      .then((res) => {
        if (res && res.ok && new URL(request.url).origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(request).then((hit) => hit || caches.match("./index.html"))
      )
  );
});
