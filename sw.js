/* Biblioteca Virtual · Service Worker (caché local, sin rastreo) */
const VERSION = "bv-v1";
const NUCLEO = [
  "./", "./index.html", "./manifest.webmanifest",
  "./css/base.css", "./css/paginas.css", "./css/juegos.css", "./css/lector.css", "./css/adaptable.css",
  "./assets/fuentes/google-fonts.css", "./assets/fuentes/baloo-2-latin.woff2", "./assets/fuentes/nunito-latin.woff2",
  "./assets/svg/hero-biblioteca.svg", "./assets/svg/mascota-draco.svg", "./assets/svg/iconos.svg",
  "./assets/img/icono-biblioteca.svg",
  "./data/catalogo.js", "./data/generos.js", "./data/logros.js", "./data/textos.js", "./data/juegos.js", "./data/clasicos.js",
  "./js/nucleo.js", "./js/componentes.js", "./js/secciones.js", "./js/lector.js", "./js/juegos.js", "./js/app.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(NUCLEO)).then(() => self.skipWaiting()).catch(() => undefined));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((claves) => Promise.all(claves.filter((c) => c !== VERSION).map((c) => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    event.respondWith(fetch(req).then((res) => {
      const copia = res.clone();
      caches.open(VERSION).then((cache) => cache.put("./index.html", copia));
      return res;
    }).catch(() => caches.match("./index.html")));
    return;
  }

  event.respondWith(
    caches.match(req).then((guardado) => {
      if (guardado) return guardado;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
          const copia = res.clone();
          caches.open(VERSION).then((cache) => cache.put(req, copia));
        }
        return res;
      });
    })
  );
});
