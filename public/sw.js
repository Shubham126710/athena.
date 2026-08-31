const CACHE_NAME = 'athena-pdf-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Cache Supabase Storage PDF files to prevent excessive egress
  if (url.hostname.includes('supabase.co') && url.pathname.includes('/storage/v1/object/public/notes/')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse; // Return from local browser cache
        }
        
        return fetch(event.request).then((networkResponse) => {
          // Cache the successful network response
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
    );
  }
});
