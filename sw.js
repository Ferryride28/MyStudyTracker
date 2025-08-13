const cacheName = 'study-tracker-cache-v1';
const assets = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    // Make sure to add your icon file paths here
    // e.g., '/icon-192x192.png',
    // e.g., '/icon-512x512.png'
];

// Call Install Event
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                console.log('Service Worker: Caching Files');
                return cache.addAll(assets);
            })
    );
});

// Call Activate Event
self.addEventListener('activate', (e) => {
    console.log('Service Worker: Activated');
    // Remove old caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Call Fetch Event
self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    );
});
