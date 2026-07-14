// sw.js - Service Worker untuk PWA
const CACHE_NAME = 'hayaxxdev-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/public/css/main.css',
  '/public/js/script.js',
  '/public/image/character/bofuri.jpeg',
  '/public/image/character/Maple_Character.webp',
  '/public/image/character/sally-full-body.webp',
  '/public/image/syrup.gif',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('All resources cached');
        return self.skipWaiting();
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - Cache First Strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Fallback untuk offline
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
            if (event.request.url.includes('.css')) {
              return new Response('', { status: 200, headers: { 'Content-Type': 'text/css' } });
            }
            if (event.request.url.includes('.js')) {
              return new Response('', { status: 200, headers: { 'Content-Type': 'application/javascript' } });
            }
            if (event.request.url.includes('.png') || event.request.url.includes('.jpg') || event.request.url.includes('.jpeg') || event.request.url.includes('.gif')) {
              return new Response('', { status: 200, headers: { 'Content-Type': 'image/png' } });
            }
            return new Response('Offline', { status: 200, headers: { 'Content-Type': 'text/plain' } });
          });
      })
  );
});

// Push Notification
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body || 'Ada update baru!',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Buka',
        icon: '/icons/icon-96.png'
      },
      {
        action: 'close',
        title: 'Tutup',
        icon: '/icons/icon-96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'hayaxxdev-bit Portfolio', options)
  );
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Sync data with server
      fetch('/api/sync', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
          console.log('Sync completed:', data);
        })
        .catch(error => {
          console.error('Sync failed:', error);
        })
    );
  }
});