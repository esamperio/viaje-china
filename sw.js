const C="viajechina-v45";
const ASSETS=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-180.png","robots.txt"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.map(k=>k!==C&&caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);
  if(u.hostname.indexOf("autonavi.com")>=0||u.hostname.indexOf("amap.com")>=0){e.respondWith(fetch(e.request).catch(()=>new Response("",{status:504})));return;}
  if(u.hostname.indexOf("supabase.co")>=0){e.respondWith(fetch(e.request));return;}
  // version.txt SIEMPRE de la red: es justo lo que sirve para detectar que hay versión nueva
  if(u.pathname.indexOf("version.txt")>=0){e.respondWith(fetch(e.request));return;}
  // La app (HTML): red primero, para que una versión nueva entre a la PRIMERA cuando hay
  // conexión. Sin cobertura cae a la caché y sigue funcionando igual.
  const esApp=e.request.mode==="navigate"||u.pathname.endsWith("/")||u.pathname.endsWith("index.html");
  if(esApp){e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(k=>k.put("index.html",c));return r;})
    .catch(()=>caches.match("index.html")));return;}
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match("index.html"))));});
