// offline cache: app files are stored on install, fonts the first time they load; every hit is refreshed in the background
const CACHE = 'dream-room-98098559da', FILES = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png", "vendor/addons/controls/OrbitControls.js", "vendor/addons/environments/RoomEnvironment.js", "vendor/addons/geometries/RoundedBoxGeometry.js", "vendor/es-module-shims.js", "vendor/three.module.min.js"];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const net = fetch(e.request).then(res => {
    if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return res;
  });
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || net));
  e.waitUntil(net.catch(() => {}));
});
