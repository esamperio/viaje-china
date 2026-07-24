const C="viajechina-v55";
const ASSETS=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-180.png","robots.txt"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.map(k=>k!==C&&caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);
  if(u.hostname.indexOf("autonavi.com")>=0||u.hostname.indexOf("amap.com")>=0){e.respondWith(fetch(e.request).catch(()=>new Response("",{status:504})));return;}
  if(u.hostname.indexOf("supabase.co")>=0){e.respondWith(fetch(e.request));return;}
  // version.txt SIEMPRE de la red: es justo lo que sirve para detectar que hay versión nueva
  if(u.pathname.indexOf("version.txt")>=0){e.respondWith(fetch(e.request).catch(()=>new Response("",{status:504})));return;}
  // La app (HTML): CACHÉ PRIMERO. Abrir sin conexión era un problema: con "red primero" iOS se
  // quedaba varios minutos en blanco esperando a que la petición fallara antes de caer a la caché.
  // Ahora se sirve al instante desde la caché y la versión nueva SOLO entra cuando el usuario pulsa
  // "Buscar actualización" (que reinstala el SW y recachea este index.html).
  const esApp=e.request.mode==="navigate"||u.pathname.endsWith("/")||u.pathname.endsWith("index.html");
  if(esApp){e.respondWith(caches.match("index.html").then(r=>r||fetch(e.request).then(res=>{const c=res.clone();caches.open(C).then(k=>k.put("index.html",c));return res;})));return;}
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match("index.html"))));});
