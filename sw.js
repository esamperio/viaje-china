const C="viajechina-v11";
const ASSETS=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-180.png","robots.txt"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.map(k=>k!==C&&caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);
  if(u.hostname.indexOf("autonavi.com")>=0||u.hostname.indexOf("amap.com")>=0){e.respondWith(fetch(e.request).catch(()=>new Response("",{status:504})));return;}
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match("index.html"))));});
