self.addEventListener('install', (event) => {
  console.log('Service Worker instalándose.');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activado.');
});

self.addEventListener('fetch', (event) => {
  // Estrategia de red básica para PWA: Network falling back to cache (o simplemente network only para el sensor en vivo)
  event.respondWith(fetch(event.request));
});
