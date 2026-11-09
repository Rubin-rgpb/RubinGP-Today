const CACHE='rubin-today-v53';const ASSETS=['./','./index.html','./manifest.webmanifest','./rubin-today-v6-192.png','./rubin-today-v6-512.png'];
self.addEventListener('install',event=>{self.skipWaiting();event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).catch(()=>{}))});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const key of await caches.keys())if(key!==CACHE)await caches.delete(key);await self.clients.claim()})())});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);if(url.origin!==self.location.origin)return;
if(req.mode==='navigate'||url.pathname.endsWith('/index.html')){event.respondWith(fetch(req,{cache:'no-store'}).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy))}return response}).catch(async()=>await caches.match('./index.html')||Response.error()));return}
event.respondWith(fetch(req).catch(()=>caches.match(req)))});
