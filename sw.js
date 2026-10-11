const V="atico-v1";
const BASE=["./","index.html","manifest.json","icon-192.png","icon-512.png","logo.png"];
self.addEventListener("install",e=>{
  e.waitUntil(caches.open(V).then(c=>Promise.all(BASE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET"||!e.request.url.startsWith("http"))return;
  e.respondWith(
    fetch(e.request).then(r=>{
      if(r.ok||r.type==="opaque"){const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp))}
      return r;
    }).catch(()=>caches.match(e.request).then(m=>m||caches.match("index.html")))
  );
});
