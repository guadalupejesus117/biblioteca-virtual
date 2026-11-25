/* Biblioteca Virtual · Service Worker (caché local, sin rastreo) */
const VERSION = "bv-v6-4-arte";
const NUCLEO = [
"./assets/arte/alicia.svg","./assets/arte/espejo.svg","./assets/arte/pinocho.svg","./assets/arte/blancanieves.svg","./assets/arte/barba-azul.svg","./assets/arte/camisa.svg","./assets/arte/caperucita.svg","./assets/arte/durmiente.svg","./assets/arte/habichuelas.svg","./assets/arte/bella-bestia.svg","./assets/arte/pulgarcito.svg","./assets/arte/ruisenor.svg","./assets/arte/margarita.svg","./assets/arte/principito.svg","./assets/arte/leyendas-urbanas.svg","./assets/arte/de-dioses.svg","./assets/arte/cuentos-mundo.svg","./assets/arte/fabulas-ciro.svg","./assets/arte/hubo-vez.svg","./assets/arte/leyendas-guatemala.svg","./assets/arte/leyendas-amazonia.svg","./assets/arte/leyendas-ecuador.svg","./assets/arte/mitos-mexico.svg","./assets/arte/silbon.svg","./assets/arte/trabalenguas-150.svg","./assets/arte/adivinanzas-50.svg","./assets/arte/fichas-trabalenguas.svg","./assets/arte/pack-adivinanzas.svg","./assets/arte/chistes-cortos.svg","./assets/arte/colmos-inicial.svg","./assets/arte/me-parto-risa.svg","./assets/arte/trabalenguas-asun.svg","./assets/arte/colmos-villegas.svg","./assets/arte/poesia-ninos.svg","./assets/arte/poesia-con-ninos.svg","./assets/arte/poemario-cassi.svg","./assets/arte/poesia-chicos-grandes.svg","./assets/arte/nube.svg","./assets/arte/dragon-pompas.svg","./assets/arte/luna-papel.svg","./assets/arte/jardin-numeros.svg","./assets/arte/tortuga-liebre.svg","./assets/arte/leon-raton.svg","./assets/arte/cigarra-hormiga.svg","./assets/arte/zorro-uvas.svg","./assets/arte/poema-estrella.svg","./assets/arte/poema-libro.svg","./assets/arte/poema-lluvia.svg","./assets/arte/leyenda-silbon.svg","./assets/arte/leyenda-llorona.svg","./assets/arte/mito-maiz.svg","./assets/arte/teatro-asamblea.svg","./assets/arte/comic-draco.svg","./assets/arte/colibri.svg","./assets/arte/luciernagas.svg","./assets/arte/semilla-valiente.svg","./assets/arte/gatito-colores.svg","./assets/arte/tren-numeros.svg","./assets/arte/robot-jardin.svg","./assets/arte/mapa-rio.svg","./assets/arte/misterio-biblioteca.svg","./assets/arte/estacion-orbita.svg","./assets/arte/ciudad-memoria.svg","./assets/arte/pio-luna.svg","./assets/arte/tortuga-puente.svg","./assets/arte/huerto-escuela.svg","./assets/arte/puente-papel.svg","./assets/arte/archivo-futuro.svg","./assets/arte/isla-energia.svg",
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
