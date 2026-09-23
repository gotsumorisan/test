const CACHE='hall-scan-v3.15-r98';
const IMAGE_CACHE='hall-scan-images-v3.15-r8';
const CORE=['./','./index.html','./search.html','./stores.html','./visual-guide.html','./abashiri.html','./kitami.html','./offline.html','./app-v2.css','./app-v3.css','./hallscan-v315.css','./hallscan-v315.js','./machine-strategy-v315.js','./hallscan-monkey-main.webp','./hallscan-monkey-side.webp','./hallscan-otome-main.webp','./hallscan-otome-side.webp','./manifest.webmanifest','./apple-touch-icon.png','./icon-192.png','./icon-512.png','./aurora-kitami.webp','./daigoro-x.webp','./daigoro-z.webp','./dynam-kitami.webp','./hero-hall.webp','./himawari-kitami.webp','./machine-god-kiseki.webp','./machine-godeater.webp','./machine-hokuto-tensho2.webp','./machine-hokuto.webp','./machine-kabaneri.webp','./machine-kaguya.webp','./machine-karakuri.webp','./machine-karakuri2.webp','./machine-monkey5.webp','./machine-otome4.webp','./machine-otome5.webp','./machine-seed.webp','./machine-tokyo-ghoul.webp','./machine-tokyorev.webp','./machine-vvv2.webp','./machine-yoshimune.webp','./maruhan-abashiri.webp','./maruhan-kitami.webp','./maruhan-tanno.webp','./royal-abashiri.webp','./royal-kitami.webp','./taiyo-abashiri.webp','./towa-abashiri.webp','./aurora_kitami_integrated_factchecked.html','./daigoro_x_integrated_factchecked.html','./daigoro_z_integrated_factchecked.html','./daiman_integrated_factchecked.html','./dynam_kitami_integrated_factchecked.html','./kitami_himawari_integrated_factchecked.html','./maruhan_kitami_integrated_factchecked.html','./maruhan_tanno_integrated_factchecked.html','./royal_kitami_integrated_factchecked.html','./towa_kitami_integrated_factchecked.html',
 './fullrate-data-v314.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>![CACHE,IMAGE_CACHE].includes(k)).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin!==self.location.origin){
    if(e.request.destination==='image'){
      e.respondWith(caches.open(IMAGE_CACHE).then(async c=>{
        const hit=await c.match(e.request);
        if(hit)return hit;
        try{const r=await fetch(e.request);if(r&&(r.ok||r.type==='opaque'))await c.put(e.request,r.clone());return r}catch(_){return new Response('',{status:504,statusText:'Offline'})}
      }));
    }
    return;
  }
  if(e.request.mode==='navigate'){
    const canonical=new URL(e.request.url);canonical.search='';canonical.hash='';
    const cachePromise=caches.open(CACHE);
    const network=fetch(e.request).then(async r=>{if(r&&r.ok){const c=await cachePromise;await c.put(canonical.href,r.clone())}return r});
    e.waitUntil(network.catch(()=>{}));
    e.respondWith((async()=>{
      const c=await cachePromise,hit=await c.match(canonical.href);
      if(hit)return hit;
      try{return await network}catch(_){return (await c.match('./offline.html'))||new Response('Offline',{status:503})}
    })());
    return;
  }
  e.respondWith(caches.open(CACHE).then(async c=>{
    const hit=await c.match(e.request);if(hit)return hit;
    try{const r=await fetch(e.request);if(r&&r.ok)await c.put(e.request,r.clone());return r}catch(_){return new Response('',{status:504,statusText:'Offline'})}
  }));
});
