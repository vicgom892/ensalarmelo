const CACHE_NAME = 'ensalarmelo-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/menu-ensalarmelo.html',
  '/qr-ensalarmelo.html',
  '/offline.html',
  '/css/ensalarmelo.css',
  '/css/menu-ensalarmelo.css',
  '/css/header.css',
  '/manifest.json',
  '/js/app.js',
  '/js/script.js',
  '/js/ensalarmelo.js',
  '/js/instalar.js',
  '/icons/icon-1-192x192.png',
  '/icons/icon-2-512x512.png',
  '/images/icon-menu.png',
  '/images/close-menu.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting()) // fuerza la activación inmediata
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim(); // toma control inmediato
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(resp => resp || fetch(event.request))
      .catch(() => caches.match('/offline-1.html'))
  );
});
