self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("v1").then(cache => {
      return cache.addAll([
        "/frontend/login.html",
        "/frontend/dashboard.html",
        "/frontend/fatura.html",
        "/frontend/ai.html",
        "/frontend/lang.js"
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});