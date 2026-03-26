const CACHE_NAME = 'cafeteria-cache-v1';
const urlsToCache = [
  './',
  // Aquí podrías agregar los nombres de tus fotos para que se guarden sin internet
  // 'Chocolate.png', 'Crepas.png'
];

// Instala el Service Worker y guarda en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Sirve los archivos desde caché si no hay internet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) { return response; }
        return fetch(event.request);
      })
  );
});