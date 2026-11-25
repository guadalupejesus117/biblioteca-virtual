/* Biblioteca Virtual · Service Worker (caché local, sin rastreo) */
const VERSION = "bv-v6-3-2-legibilidad";
const NUCLEO = [
  "./", "./index.html", "./manifest.webmanifest",
  "./css/base.css", "./css/paginas.css", "./css/juegos.css", "./css/lector.css", "./css/adaptable.css",
  "./assets/fuentes/google-fonts.css", "./assets/fuentes/baloo-2-latin.woff2", "./assets/fuentes/nunito-latin.woff2",
  "./assets/svg/hero-biblioteca.svg", "./assets/svg/mascota-draco.svg", "./assets/svg/iconos.svg",
  "./assets/img/icono-biblioteca.svg",
  "./data/catalogo.js", "./data/generos.js", "./data/logros.js", "./data/textos.js", "./data/juegos.js", "./data/clasicos.js", "./data/ilustraciones.js",
  "./assets/svg/ilu-nube.svg", "./assets/svg/ilu-dragon.svg", "./assets/svg/ilu-luna.svg", "./assets/svg/ilu-jardin.svg", "./assets/svg/ilu-fabula.svg",
  "./assets/svg/ilu-bosque-cuento.svg", "./assets/svg/ilu-castillo-magico.svg", "./assets/svg/ilu-mar.svg", "./assets/svg/ilu-conejo.svg",
  "./assets/svg/ilu-espejo.svg", "./assets/svg/ilu-marioneta.svg", "./assets/svg/ilu-estrellas.svg", "./assets/svg/ilu-maiz.svg", "./assets/svg/ilu-biblioteca-noche.svg",
  "./js/pdf-local.js", "./js/nucleo.js", "./js/componentes.js", "./js/secciones.js", "./js/lector.js", "./js/juegos.js", "./js/app.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(NUCLEO)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((claves) => Promise.all(claves.filter((c) => c.startsWith("bv-v") && c !== VERSION).map((c) => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;

  if (req.mode === "navigate") {
    event.respondWith(fetch(req).then((res) => {
      if (!res.ok) throw new Error("Navigation failed");
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
