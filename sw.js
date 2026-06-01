/* VANTAR Dynamics — Service Worker
   Offline-first cache for the static app shell. Sensor APIs still require
   HTTPS + user gesture at runtime; this only handles asset delivery. */

const CACHE = "vantar-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/favicon.svg",
  "./assets/og-image.svg",
  "./styles/tokens.css",
  "./styles/base.css",
  "./styles/components.css",
  "./styles/hero.css",
  "./src/app.js",
  "./src/data/projects.js",
  "./src/ui/portfolio.js",
  "./src/ui/contact.js",
  "./src/ui/permissions.js",
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
  // Network-first for navigations, cache-first for assets.
  if (request.mode === "navigate") {
    e.respondWith(fetch(request).catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(
    caches.match(request).then((hit) =>
      hit || fetch(request).then((res) => {
        const copy = res.clone();
        if (res.ok && new URL(request.url).origin === location.origin) {
          caches.open(CACHE).then((c) => c.put(request, copy));
        }
        return res;
      }).catch(() => hit)
    )
  );
});
