
const CACHE_NAME = "tos-cache-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];
self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME && caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e=>{
  const url = new URL(e.request.url);
  if (ASSETS.includes(url.pathname.replace(/.+\//,"./"))) {
    e.respondWith(caches.match(e.request).then(r=>r || fetch(e.request)));
  } else {
    e.respondWith(fetch(e.request).catch(()=>caches.match("./index.html")));
  }
});
