const CACHE='guia-appcc-desenvolvimento-github-v1';
const CORE=["./html.appc.html", "./html.appcc.int.html", "./html.appcc.pdf.html", "./html.appcc.cel.html", "./Guia_APPCC_22_Paginas.pdf", "./manifest-appcc.webmanifest", "./icon-appcc-192.png", "./icon-appcc-512.png"];
const ALLOWED_PATHS=new Set(CORE.map(path=>new URL(path,self.location.href).pathname));
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('guia-appcc-desenvolvimento-github-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const req=event.request,url=new URL(req.url);if(req.method!=='GET'||url.origin!==self.location.origin||!ALLOWED_PATHS.has(url.pathname))return;event.respondWith(fetch(req).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));}return response;}).catch(()=>caches.match(req,{ignoreSearch:true}).then(cached=>cached||(req.mode==='navigate'?caches.match('./html.appc.html'):Response.error()))));});
