const CACHE_NAME = 'super-copa-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
            .catch(() => {
                // Fallback for offline
                return caches.match('/index.html');
            })
    );
});

// Push notification event
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Nova atualização disponível!',
        icon: '/icon.svg',
        badge: '/icon.svg',
        vibrate: [200, 100, 200],
        tag: 'super-copa-notification',
        requireInteraction: false,
    };

    event.waitUntil(
        self.registration.showNotification('SUPER COPA FF', options)
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
