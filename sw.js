/* Last Gate service worker.
 * Keep VERSION in step with the ?v= cache-bust in index.html.
 * - Pages, JS, CSS, manifest: network-first (updates show without a force-refresh),
 *   falling back to the cache when offline or the network is slow.
 * - Images, fonts, other assets: cache-first in a versioned cache (dropped on each new version).
 * - Sound effects (assets/sfx/): small files fetched whole, so cache-first like images and
 *   precached on install. SFX_REV is their own cache-bust (matches the ?v= in game.js).
 * - Music: audio elements send Range requests. We never cache a partial 206 response;
 *   instead the full file is fetched once in the background and later Range requests
 *   are answered by slicing that cached copy.
 */
const VERSION = "34";
const SHELL = "lastgate-shell-v" + VERSION;
const ASSETS = "lastgate-assets-v" + VERSION;
const MUSIC = "lastgate-music-1"; // music files rarely change; kept across versions
const KEEP = [SHELL, ASSETS, MUSIC];

const PRECACHE_SHELL = [
  "./",
  "./css/style.css?v=" + VERSION,
  "./js/game.js?v=" + VERSION,
  "./js/pwa.js?v=" + VERSION,
  "./manifest.webmanifest",
];
const SFX_REV = "31";
const SFX = ["gunshot", "fire", "magic", "upgrade", "explosion", "spawn-1", "spawn-2", "spawn-3"].map((n) => "./assets/sfx/" + n + ".mp3?v=" + SFX_REV);
const PRECACHE_ASSETS = [
  "./assets/title-art.jpg",
  "./assets/PassionOne-Bold.ttf",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/apple-touch-icon.png",
].concat(SFX);

async function precache(name, urls) {
  const cache = await caches.open(name);
  await Promise.all(urls.map(async (u) => {
    try {
      const res = await fetch(new Request(u, { cache: "reload" }));
      if (res.ok && res.status === 200) await cache.put(u, res);
    } catch (e) { /* offline during install: fill on demand later */ }
  }));
}

self.addEventListener("install", (event) => {
  event.waitUntil(Promise.all([precache(SHELL, PRECACHE_SHELL), precache(ASSETS, PRECACHE_ASSETS)]).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((n) => n.startsWith("lastgate-") && !KEEP.includes(n)).map((n) => caches.delete(n)));
    if (self.registration.navigationPreload) { try { await self.registration.navigationPreload.disable(); } catch (e) {} }
    await self.clients.claim();
  })());
});

function cacheable(res) {
  return res && res.status === 200 && (res.type === "basic" || res.type === "default");
}

async function networkFirst(event, req) {
  const cache = await caches.open(SHELL);
  const isNav = req.mode === "navigate";
  const network = fetch(req).then((res) => {
    if (cacheable(res)) cache.put(req, res.clone()).catch(() => {});
    return res;
  });
  const fromCache = () => cache.match(req).then((hit) => hit || cache.match(req, { ignoreSearch: true }))
    .then((hit) => hit || (isNav ? null : caches.match(req, { ignoreSearch: true })));
  event.waitUntil(network.catch(() => {}));
  // If the network stalls for a while and we have a copy, use the copy (fast start on bad signal).
  const cached = await fromCache();
  if (!cached) return network.catch(() => (isNav ? cache.match("./") : undefined)).then((r) => r || Response.error());
  const timeout = new Promise((resolve) => setTimeout(() => resolve(null), 4000));
  try {
    const res = await Promise.race([network, timeout]);
    return res || cached;
  } catch (e) {
    return cached;
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(ASSETS);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (cacheable(res)) cache.put(req, res.clone()).catch(() => {});
  return res;
}

async function music(event, req) {
  const url = req.url.split("#")[0];
  const cache = await caches.open(MUSIC);
  const full = await cache.match(url, { ignoreSearch: true });
  if (!full) {
    // Stream from the network as normal; grab a complete copy in the background for next time.
    event.waitUntil(fetch(url).then((res) => (res.status === 200 ? cache.put(url, res) : null)).catch(() => {}));
    return fetch(req);
  }
  const range = req.headers.get("range");
  if (!range) return full;
  const blob = await full.blob();
  const m = /bytes=(\d*)-(\d*)/.exec(range);
  const size = blob.size;
  let start = m && m[1] !== "" ? parseInt(m[1], 10) : 0;
  let end = m && m[2] !== "" ? parseInt(m[2], 10) : size - 1;
  if (m && m[1] === "" && m[2] !== "") { start = Math.max(0, size - parseInt(m[2], 10)); end = size - 1; }
  if (start >= size) return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + size } });
  end = Math.min(end, size - 1);
  const part = blob.slice(start, end + 1);
  return new Response(part, {
    status: 206,
    statusText: "Partial Content",
    headers: {
      "Content-Type": full.headers.get("Content-Type") || "audio/mpeg",
      "Content-Range": "bytes " + start + "-" + end + "/" + size,
      "Content-Length": String(part.size),
      "Accept-Ranges": "bytes",
    },
  });
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const scope = new URL(self.registration.scope);
  if (!url.pathname.startsWith(scope.pathname)) return;
  const path = url.pathname;

  if (path.includes("/assets/sfx/") && !req.headers.has("range")) { event.respondWith(cacheFirst(req).catch(() => fetch(req))); return; }
  if (/\.(mp3|ogg|m4a|wav)$/i.test(path)) { event.respondWith(music(event, req).catch(() => fetch(req))); return; }
  if (req.headers.has("range")) return; // any other partial request: leave to the browser
  if (path.endsWith("/sw.js")) return;

  if (req.mode === "navigate" || /\.(html|js|css|webmanifest|json)$/i.test(path) || path.endsWith("/")) {
    event.respondWith(networkFirst(event, req));
    return;
  }
  event.respondWith(cacheFirst(req));
});
