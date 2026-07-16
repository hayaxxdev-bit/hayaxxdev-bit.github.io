// ═══════════════════════════════════════════
// SERVICE WORKER - hayaxxdev-bit Portfolio
// Maple Bofuri Theme v4.0
// ═══════════════════════════════════════════

const CACHE_NAME = 'hayaxxdev-v4.0.0';
const OFFLINE_PAGE = '/offline.html';
const ERROR_PAGE = '/500.html';
const PAGE_404 = '/404.html';

// ═══════════════ PRECACHE ASSETS ═══════════════
const PRECACHE_ASSETS = [
  // Core pages
  '/',
  '/index.html',
  '/offline.html',
  '/404.html',
  '/500.html',
  '/maintenance.html',
  
  // Critical CSS
  '/public/css/main.css',
  '/public/css/all.css',
  '/public/css/reset.css',
  '/public/css/variables.css',
  '/public/css/layout.css',
  '/public/css/hero.css',
  '/public/css/navbar.css',
  '/public/css/loader.css',
  '/public/css/responsive.css',
  
  // Critical JS
  '/public/js/script.js',
  '/public/js/config.js',
  '/public/js/utils.js',
  
  // Character images (critical)
  '/public/image/character/bofuri.jpeg',
  '/public/image/character/sally.jpg',
  '/public/image/character/Syrup.webp',
  
  // Icons & Favicon
  '/public/image/favicon.svg',
  '/favicon.ico',
  '/public/icons/icon-192.png',
  '/public/icons/icon-512.png',
];

// ═══════════════ NON-CRITICAL ASSETS (cache on demand) ═══════════════
const RUNTIME_CACHE_PATTERNS = [
  /\/public\/css\/.*\.css$/,
  /\/public\/js\/.*\.js$/,
  /\/public\/image\/.*\.(png|jpg|jpeg|webp|gif|svg)$/,
  /\/public\/icons\/.*\.png$/,
  /\/public\/music\/.*\.mp3$/,
  /\/fonts\.googleapis\.com/,
  /\/fonts\.gstatic\.com/,
];

// ═══════════════ API PATTERNS (Network only, no cache) ═══════════════
const API_PATTERNS = [
  /\/api\//,
  /api\.github\.com/,
  /hayaxxdev-bit-github-io\.vercel\.app\/api/,
];

// ═══════════════ ANALYTICS (Skip caching) ═══════════════
const ANALYTICS_PATTERNS = [
  /google-analytics\.com/,
  /googletagmanager\.com/,
  /cloudflareinsights\.com/,
];

// ═══════════════ HELPER FUNCTIONS ═══════════════

/**
 * Check if URL matches any pattern in the list
 */
function matchesAnyPattern(url, patterns) {
  return patterns.some(pattern => {
    if (pattern instanceof RegExp) {
      return pattern.test(url);
    }
    return url.includes(pattern);
  });
}

/**
 * Check if request should be skipped
 */
function shouldSkipCache(request) {
  const url = request.url;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return true;
  
  // Skip non-http(s)
  if (!url.startsWith('http')) return true;
  
  // Skip API calls
  if (matchesAnyPattern(url, API_PATTERNS)) return true;
  
  // Skip analytics
  if (matchesAnyPattern(url, ANALYTICS_PATTERNS)) return true;
  
  // Skip browser extensions
  if (url.startsWith('chrome-extension://') || url.startsWith('moz-extension://')) return true;
  
  return false;
}

/**
 * Check if asset should be runtime cached
 */
function shouldRuntimeCache(url) {
  return matchesAnyPattern(url, RUNTIME_CACHE_PATTERNS);
}

/**
 * Create offline HTML response
 */
function createOfflineResponse() {
  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="theme-color" content="#030108">
  <title>Offline | hayaxxdev</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #030108;
      color: #e2e8f0;
      text-align: center;
      padding: 20px;
      line-height: 1.6;
    }
    .offline-card {
      background: rgba(15, 7, 32, 0.8);
      border: 1px solid rgba(34, 211, 238, 0.3);
      border-radius: 24px;
      padding: 40px 30px;
      max-width: 480px;
      backdrop-filter: blur(20px);
      box-shadow: 0 25px 50px -10px rgba(0,0,0,0.7);
    }
    .offline-icon { font-size: 4rem; margin-bottom: 16px; }
    .offline-title { 
      font-size: 1.8rem; 
      font-weight: 700; 
      color: #22d3ee;
      margin-bottom: 12px;
    }
    .offline-text { 
      color: #94a3b8;
      font-size: 0.95rem;
      margin-bottom: 24px;
    }
    .offline-btn {
      display: inline-block;
      padding: 12px 28px;
      background: linear-gradient(135deg, #0e7490, #22d3ee);
      color: #0a0a1a;
      text-decoration: none;
      border-radius: 30px;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.3s;
      border: none;
      cursor: pointer;
    }
    .offline-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(34,211,238,0.4);
    }
    .offline-hint {
      margin-top: 16px;
      font-size: 0.75rem;
      color: #475569;
    }
  </style>
</head>
<body>
  <div class="offline-card">
    <div class="offline-icon">📡🍁</div>
    <h1 class="offline-title">Koneksi Terputus</h1>
    <p class="offline-text">
      Sepertinya kamu sedang offline nih~<br>
      Jangan khawatir, Maple tetap di sini!<br>
      Coba cek koneksi internetmu ya.
    </p>
    <button class="offline-btn" onclick="window.location.reload()">
      🔄 Coba Lagi
    </button>
    <p class="offline-hint">
      Halaman yang sudah dikunjungi tetap bisa diakses offline.
    </p>
  </div>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}

// ═══════════════ INSTALL EVENT ═══════════════
self.addEventListener('install', (event) => {
  console.log('🍁 Service Worker: Installing v4.0.0...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log(`🍁 Caching ${PRECACHE_ASSETS.length} assets...`);
        
        // Cache assets individually with error handling
        return Promise.allSettled(
          PRECACHE_ASSETS.map(async (url) => {
            try {
              const response = await fetch(url, { 
                method: 'GET',
                cache: 'no-cache',
              });
              
              if (response.ok) {
                await cache.put(url, response);
                console.log(`  ✅ Cached: ${url}`);
              } else {
                console.warn(`  ⚠️ Failed to fetch (${response.status}): ${url}`);
              }
            } catch (error) {
              console.warn(`  ❌ Error caching: ${url}`, error.message);
            }
          })
        );
      })
      .then((results) => {
        const succeeded = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        console.log(`🍁 Precache complete: ${succeeded} succeeded, ${failed} failed`);
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('🍁 Service Worker install failed:', error);
      })
  );
});

// ═══════════════ ACTIVATE EVENT ═══════════════
self.addEventListener('activate', (event) => {
  console.log('🍁 Service Worker: Activating...');
  
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log(`🗑️ Deleting old cache: ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('🍁 Service Worker: Activated & ready!');
        // Take control of all clients
        return self.clients.claim();
      })
      .then(() => {
        // Notify all clients that SW is ready
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'SW_ACTIVATED',
              version: CACHE_NAME,
            });
          });
        });
      })
  );
});

// ═══════════════ FETCH EVENT (Network First with Cache Fallback) ═══════════════
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip unwanted requests
  if (shouldSkipCache(request)) return;
  
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Don't cache error responses
        if (!response || !response.ok) {
          return response;
        }
        
        // Don't cache non-cacheable responses
        const cacheControl = response.headers.get('Cache-Control');
        if (cacheControl && cacheControl.includes('no-store')) {
          return response;
        }
        
        // Cache the response if it matches runtime patterns
        if (shouldRuntimeCache(request.url)) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone).catch((err) => {
              // Silently handle quota exceeded
              if (err.name === 'QuotaExceededError') {
                console.warn('⚠️ Cache quota exceeded, clearing old entries...');
                // Clear some old cache entries
                caches.open(CACHE_NAME).then((cache) => {
                  cache.keys().then((keys) => {
                    // Delete oldest 10 entries
                    keys.slice(0, 10).forEach((key) => {
                      cache.delete(key);
                    });
                  });
                });
              }
            });
          });
        }
        
        return response;
      })
      .catch(async () => {
        // Network failed - try cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          console.log(`📦 Serving from cache: ${request.url}`);
          return cachedResponse;
        }

        // For HTML requests, return appropriate error page
        const acceptHeader = request.headers.get('accept') || '';
        if (acceptHeader.includes('text/html')) {
          // Try to return offline page first
          const offlinePage = await caches.match(OFFLINE_PAGE);
          if (offlinePage) return offlinePage;
          
          // Fallback to inline offline page
          return createOfflineResponse();
        }

        // For images, return a placeholder
        if (acceptHeader.includes('image/') || request.url.match(/\.(png|jpg|jpeg|webp|gif|svg)$/)) {
          return new Response(
            `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
              <rect fill="#1e103a" width="100" height="100"/>
              <text fill="#a855f7" x="50" y="55" text-anchor="middle" font-size="40" font-family="sans-serif">🍁</text>
            </svg>`,
            { 
              status: 200, 
              headers: { 
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'public, max-age=3600',
              } 
            }
          );
        }

        // Return empty response for other resources
        return new Response('', { 
          status: 408, 
          statusText: 'Request timeout' 
        });
      })
  );
});

// ═══════════════ BACKGROUND SYNC ═══════════════
self.addEventListener('sync', (event) => {
  console.log('🍁 Background Sync:', event.tag);
  
  if (event.tag === 'sync-stats') {
    event.waitUntil(
      // Attempt to sync stats when back online
      fetch('/api/github/stats')
        .then((response) => response.json())
        .then((data) => {
          // Notify clients with updated stats
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({
                type: 'STATS_UPDATED',
                data: data,
              });
            });
          });
        })
        .catch((error) => {
          console.warn('⚠️ Background sync failed:', error);
        })
    );
  }
});

// ═══════════════ PUSH NOTIFICATION ═══════════════
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Ada update baru nih! 🍁',
      icon: '/public/icons/icon-192.png',
      badge: '/public/icons/icon-96.png',
      data: {
        url: data.url || '/',
      },
      vibrate: [200, 100, 200],
      tag: 'hayaxxdev-update',
      renotify: true,
    };
    
    event.waitUntil(
      self.registration.showNotification(
        data.title || 'hayaxxdev-bit',
        options
      )
    );
  } catch (error) {
    console.warn('⚠️ Push notification error:', error);
  }
});

// ═══════════════ NOTIFICATION CLICK ═══════════════
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // If a window is already open, focus it
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// ═══════════════ MESSAGE HANDLING ═══════════════
self.addEventListener('message', (event) => {
  if (!event.data) return;
  
  const { type } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CLEAR_CACHE':
      caches.delete(CACHE_NAME).then(() => {
        console.log('🗑️ Cache cleared by user request');
        // Re-cache critical assets
        caches.open(CACHE_NAME).then((cache) => {
          return cache.addAll(PRECACHE_ASSETS);
        });
        // Notify client
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({ 
            type: 'CACHE_CLEARED',
            version: CACHE_NAME,
          });
        }
      });
      break;
      
    case 'GET_VERSION':
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ 
          type: 'VERSION', 
          version: CACHE_NAME,
          precacheCount: PRECACHE_ASSETS.length,
        });
      }
      break;
      
    case 'GET_STATS':
      // Return cache stats
      caches.open(CACHE_NAME).then((cache) => {
        cache.keys().then((keys) => {
          if (event.ports && event.ports[0]) {
            event.ports[0].postMessage({
              type: 'CACHE_STATS',
              cacheName: CACHE_NAME,
              cachedItems: keys.length,
            });
          }
        });
      });
      break;
      
    default:
      console.log('🍁 Unknown message type:', type);
  }
});

// ═══════════════ ERROR HANDLING ═══════════════
self.addEventListener('error', (event) => {
  console.error('🍁 Service Worker Error:', {
    message: event.error?.message || event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('🍁 Unhandled Promise Rejection:', event.reason);
});

// ═══════════════ LOGGING ═══════════════
console.log('🍁 Service Worker v4.0.0 loaded!');
console.log(`📦 Precache: ${PRECACHE_ASSETS.length} assets`);
console.log('🎯 Strategy: Network First with Cache Fallback');
console.log('📡 Offline Page: Ready');
console.log('🛡️ Absolute Defense: Active');