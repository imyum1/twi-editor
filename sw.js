// Only cache the app shell. Never cache Supabase API responses or private photos.
const CACHE='thread-editor-shell-20261126-1';
const shell=new URL('index.html',self.registration.scope).href;
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.add(new Request(shell,{cache:'reload'})))));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith('thread-editor-shell-')&&name!==CACHE)await caches.delete(name);await self.clients.claim()})()));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.mode!=='navigate'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
 event.respondWith((async()=>{try{const response=await fetch(event.request);if(response.ok){const cache=await caches.open(CACHE);await cache.put(shell,response.clone())}return response}catch(e){const saved=await caches.match(shell);if(saved)return saved;throw e}})());
});
