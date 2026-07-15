// ═══════════════════════════════════════════
// SERVICE WORKER - hayaxxdev-bit Portfolio
// Maple Bofuri Theme v4.0
// ═══════════════════════════════════════════

const CACHE_NAME = 'maple-portfolio-v4';
const OFFLINE_URL = '/offline.html';
const ERROR_URL = '/error.html';
const PAGE_404 = '/404.html';

// Assets to precache
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/404.html',
  '/error.html',
  '/offline.html',
  '/css/style.css',
  '/js/script.js',
  '/public/image/character/Maple_Character.webp',
  '/public/image/character/bofuri.jpeg',
  '/public/image/character/sally-full-body.webp',
  '/public/image/character/sally.jpg',
  '/public/image/favicon.svg',
];

// ═══════════════ INSTALL ═══════════════
self.addEventListener('install', (event) => {
  console.log('🍁 Service Worker: Installing v4...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('🍁 Service Worker: Caching assets...');
        return Promise.allSettled(
          PRECACHE_ASSETS.map(url => 
            cache.add(url).catch(err => {
              console.warn(`⚠️ Failed to cache: ${url}`, err);
            })
          )
        );
      })
      .then(() => {
        console.log('🍁 Service Worker: Install complete');
        return self.skipWaiting();
      })
  );
});

// ═══════════════ ACTIVATE ═══════════════
self.addEventListener('activate', (event) => {
  console.log('🍁 Service Worker: Activating...');
  
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('🍁 Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// ═══════════════ FETCH (Network First) ═══════════════
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip chrome-extension and other non-http(s) requests
  if (!request.url.startsWith('http')) return;
  
  // Skip analytics and tracking
  if (request.url.includes('google-analytics') || 
      request.url.includes('googletagmanager') ||
      request.url.includes('cloudflareinsights')) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200) {
          return response;
        }
        
        // Don't cache API responses for too long
        if (request.url.includes('/api/')) {
          return response;
        }
        
        // Cache successful responses
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone).catch(() => {
            // Cache put failed (probably quota exceeded)
          });
        });
        
        return response;
      })
      .catch(async () => {
        // Network failed - try cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // If HTML request, return offline page
        if (request.headers.get('accept')?.includes('text/html')) {
          const offlinePage = await caches.match(OFFLINE_URL);
          if (offlinePage) return offlinePage;
          
          // Return simple offline message if no cached page
          return new Response(
            `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Offline</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#0a0a14;color:#e2e8f0;text-align:center;padding:20px}h1{color:#a78bfa}</style></head><body><div><h1>📡 Offline</h1><p>Koneksi terputus. Periksa internetmu ya~ 🍁</p></div></body></html>`,
            { status: 200, headers: { 'Content-Type': 'text/html' } }
          );
        }

        // For other resources, return empty response
        return new Response('', { 
          status: 408, 
          statusText: 'Network timeout' 
        });
      })
  );
});

// ═══════════════ ERROR HANDLING ═══════════════
self.addEventListener('error', (event) => {
  console.error('🍁 Service Worker Error:', event.error?.message || event.message);
});

// ═══════════════ MESSAGE HANDLING ═══════════════
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      console.log('🗑️ Cache cleared by user');
      // Notify client
      event.ports[0]?.postMessage({ type: 'CACHE_CLEARED' });
    });
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0]?.postMessage({ 
      type: 'VERSION', 
      version: CACHE_NAME 
    });
  }
});