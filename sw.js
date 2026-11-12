const CACHE_VERSION = "iamsainto-v5";
const CACHE_PREFIX = "iamsainto-";
const STATIC_CACHE = CACHE_VERSION + "-static";
const DATA_CACHE = CACHE_VERSION + "-data";
const STATIC_ASSETS = [
  "./", "./index.html", "./offline.html", "./privacy.html", "./404.html",
  "./manifest.webmanifest", "./stats-data.js", "./photo-light.webp", "./photo-dark.webp",
  "./fonts/oswald-700-cyrillic.woff2", "./fonts/oswald-700-latin.woff2",
  "./fonts/space-mono-400-latin.woff2", "./fonts/space-mono-700-latin.woff2",
  "./fonts/pt-mono-400-cyrillic.woff2", "./icons/icon-192.png", "./icons/icon-512.png",
  "./qr/donationalerts.svg", "./qr/donatepay.svg", "./qr/trc20.svg"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && ![STATIC_CACHE, DATA_CACHE].includes(key)).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  const scopePath = new URL(self.registration.scope).pathname;
  if (!url.pathname.startsWith(scopePath)) return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).then(response => {
      if (response.ok) caches.open(STATIC_CACHE).then(cache => cache.put(event.request, response.clone()));
      return response;
    }).catch(() => caches.match(event.request).then(cached => cached || caches.match("./offline.html"))));
    return;
  }
  const liveData = url.pathname.endsWith("/status.json") || url.pathname.endsWith("/live-stats.json");
  if (liveData) {
    event.respondWith(fetch(event.request).then(response => {
      if (response.ok) caches.open(DATA_CACHE).then(cache => cache.put(event.request, response.clone()));
      return response;
    }).catch(() => caches.match(event.request)));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) caches.open(STATIC_CACHE).then(cache => cache.put(event.request, response.clone()));
    return response;
  }).catch(() => event.request.mode === "navigate" ? caches.match("./offline.html") : Response.error())));
});
