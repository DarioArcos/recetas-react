/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */

// Precarga la app
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// App Shell
workbox.routing.registerNavigationRoute("/index.html");

workbox.googleAnalytics.initialize({
  parameterOverrides: {
    cd1: "offline"
  }
});

// La API usa Stale While Revalidate para mayor velocidad
workbox.routing.registerRoute(
  /^https?:\/\/www.themealdb.com\/api\/.*/,
  workbox.strategies.staleWhileRevalidate(),
  "GET"
);

// Last fuentes van con Cache First y vencen al mes
workbox.routing.registerRoute(
  /^https:\/\/fonts.(?:googleapis|gstatic).com\/(.*)/,
  workbox.strategies.cacheFirst({
    cacheName: "google-fonts-cache",
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 30 * 24 * 60 * 60
      })
    ]
  }),
  "GET"
);

workbox.routing.registerRoute(
  /^https?:\/\/www.themealdb.com\/images\/.*/,
  new workbox.strategies.CacheFirst({
    cacheName: "image-cache",
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 7 * 24 * 60 * 60,
        maxEntries: 20
      })
    ]
  })
);

// Todo lo demás usa Network First
workbox.routing.setDefaultHandler(new workbox.strategies.NetworkFirst());

// Es posible usar este codigo para mantener asincrona un envio de informacion
//dentro del serviceWorker, cuando haya informacion el envio se hará
// self.addEventListener("sync", function(event) {
//   if (event.tag == "myFirstSync") {
//     event.waitUntil(doSomeStuff());
//   }
// });

// async function doSomeStuff() {
//   workbox.routing.registerRoute(
//     /^https?:\/\/www.themealdb.com\/api\/.*/,
//     await workbox.strategies.staleWhileRevalidate(),
//     "GET"
//   );
// }
