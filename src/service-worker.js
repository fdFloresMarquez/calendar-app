import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("install", async (event) => {
  const cache = await caches.open("cache-1");

  await cache.addAll([
    "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css",
    "./vite.svg",
  ]);
});

const apiRequestFallbacks = [ 
  'http://localhost:3001/api/auth/renew',
  'http://localhost:3001/api/events'
]

self.addEventListener("fetch", async (event) => {
  if (!apiRequestFallbacks.includes( event.request.url)) return;

  const resp = fetch(event.request)
    .then((response) => {
      caches.open('cache-dynamic').then( cache => {
        cache.put(event.request, response);
      })


      return response.clone()
    })
    .catch(err => {
      console.log('offline response')
      return caches.match(event.request);
    })

  event.respondWith(resp);
});

