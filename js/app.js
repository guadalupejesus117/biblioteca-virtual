/* ============================================================
   Biblioteca Virtual · Aplicación: rutas, navegación, ajustes
   y eventos globales.
   ============================================================ */
(function () {
  "use strict";
  const BV = window.BV;
  const U = BV.util;
  const { $, $$, esc } = U;
  const icono = BV.icono;
  const estado = () => BV.store.estado;
  let paginaActual = null;
  let imprimirTrasCargar = false;

  /* ---------------- Enrutador ---------------- */
  function parsearHash() {
    const crudo = location.hash || "#/inicio";
    const sinHash = crudo.replace(/^#\/?/, "");
    const partes = sinHash.split("#");
    const [ruta, query = ""] = partes[0].split("?");
    const segmentos = ruta.split("/").filter(Boolean).map(decodeURIComponent);
    const params = Object.fromEntries(new URLSearchParams(query));
    return { segmentos, params, ancla: partes[1] || "" };
  }

  function limpiarPagina() {
    if (paginaActual && typeof paginaActual.destruir === "function") {
      try { paginaActual.destruir(); } catch (error) { console.warn("Error al limpiar la página anterior.", error); }
    }
    paginaActual = null;
    BV.voz.detener();
    document.body.classList.remove("imprimir-libro", "imprimir-juego", "imprimir-progreso", "modo-lector", "lector-despejado", "menu-abierto");
  }

  function navActiva(segmentos) {
    const clave = segmentos[0] || "inicio";
    $$("[data-nav]").forEach((enlace) => {
      enlace.setAttribute("aria-current", enlace.dataset.nav === clave ? "page" : "false");
    });
    const sub = ["trabalenguas", "adivinanzas", "favoritos", "informacion"].includes(clave);
    const boton = $("#btn-nav-mas");
    if (boton) boton.setAttribute("aria-expanded", String(sub));
    const lista = $("#nav-mas-lista");
    if (lista) lista.hidden = !sub;
  }

  function renderizar() {
    const { segmentos, params, ancla } = parsearHash();
    limpiarPagina();
    const vista = $("#vista");
    const [seccion, id, extra] = segmentos;
    let pagina = null;

    switch (seccion) {
      case undefined:
      case "inicio": pagina = BV.secciones.inicio(); break;
      case "biblioteca": pagina = BV.secciones.biblioteca(params); break;
      case "buscar": pagina = BV.secciones.buscar(params); break;
      case "generos": pagina = BV.secciones.generos(); break;
      case "genero": pagina = BV.secciones.genero(id || ""); break;
      case "cuentos": pagina = BV.secciones.cuentos(); break;
      case "juegos": pagina = BV.secciones.juegos(); break;
      case "juego": pagina = BV.juegos.render(id || "", params); break;
      case "trabalenguas": pagina = BV.secciones.trabalenguas(); break;
      case "adivinanzas": pagina = BV.secciones.adivinanzas(); break;
      case "favoritos": pagina = BV.secciones.favoritos(); break;
      case "logros": pagina = BV.secciones.logros(); break;
      case "diploma": pagina = BV.secciones.diploma(id || ""); break;
      case "recurso": pagina = BV.secciones.recurso(id || ""); break;
      case "leer":
      case "pdf": pagina = BV.lector.render(id || ""); break;
      case "informacion": pagina = BV.secciones.informacion(); break;
      default: pagina = BV.secciones.noEncontrado();
    }

    if (!pagina) pagina = BV.secciones.noEncontrado();
    paginaActual = pagina;
    vista.innerHTML = pagina.html || "";
    document.title = pagina.titulo || "Biblioteca Virtual";
    navActiva(segmentos);
    BV.componentes.estrellasHeader();

    if (typeof pagina.init === "function") {
      try { pagina.init(); } catch (error) {
        console.error("Error al iniciar la página.", error);
        BV.ui.toast({ titulo: "Algo salió mal", texto: "Recarga la página para volver a intentarlo.", tipo: "error" });
      }
    }

    if (ancla) {
      window.requestAnimationFrame(() => {
        const destino = document.getElementById(ancla);
        if (destino) destino.scrollIntoView({ block: "start", behavior: "auto" });
      });
    } else if (seccion !== "leer" && seccion !== "pdf") {
      window.scrollTo(0, 0);
    }

    if (imprimirTrasCargar && (seccion === "leer" || seccion === "pdf")) {
      imprimirTrasCargar = false;
      window.setTimeout(() => document.getElementById("descargar-libro")?.click(), 350);
    }

    if (seccion === "logros") BV.progreso.iniciarRacha();
    if (seccion !== "inicio") cerrarMenuMovil();
    vista.focus({ preventScroll: true });
  }

  /* ---------------- Menú y navegación ---------------- */
  function cerrarMenuMovil() {
    const nav = $("#nav-principal");
    const boton = $("#btn-menu");
    if (nav?.classList.contains("abierto")) {
      nav.classList.remove("abierto");
      boton?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-abierto");
    }
  }

  function inicializarNavegacion() {
    const botonMenu = $("#btn-menu");
    const nav = $("#nav-principal");
    botonMenu?.addEventListener("click", () => {
      const abierto = nav.classList.toggle("abierto");
      botonMenu.setAttribute("aria-expanded", String(abierto));
      document.body.classList.toggle("menu-abierto", abierto);
    });
    const botonMas = $("#btn-nav-mas");
    const listaMas = $("#nav-mas-lista");
    botonMas?.addEventListener("click", (e) => {
      e.stopPropagation();
      const abierto = listaMas.hidden;
      listaMas.hidden = !abierto;
      botonMas.setAttribute("aria-expanded", String(abierto));
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#nav-mas")) {
        listaMas.hidden = true;
        botonMas?.setAttribute("aria-expanded", "false");
      }
    });
    const form = $("#form-buscar-cabecera");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = new FormData(form).get("q").toString().trim();
      location.hash = q ? `#/buscar?q=${encodeURIComponent(q)}` : "#/buscar";
      form.reset();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        cerrarMenuMovil();
        BV.ui.cerrarDialogoActual();
      }
      const esCampo = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || "");
      if (e.key === "/" && !esCampo) {
        e.preventDefault();
        $("#busqueda-cabecera")?.focus();
      }
    });
    const anio = $("#anio-actual");
    if (anio) anio.textContent = String(new Date().getFullYear());
  }

  /* ---------------- Ajustes ---------------- */
  function sincronizarAjustes() {
    const e = estado();
    $("#texto-valor") && ($("#texto-valor").textContent = `${Math.round(e.escala * 100)} %`);
    const contraste = $("#ajuste-contraste");
    if (contraste) contraste.checked = Boolean(e.contraste);
    const movimiento = $("#ajuste-movimiento");
    if (movimiento) movimiento.checked = Boolean(e.movimiento);
    const sonido = $("#ajuste-sonido");
    if (sonido) sonido.checked = Boolean(e.sonido);
    const velocidad = $("#ajuste-velocidad");
    if (velocidad) velocidad.value = String(e.velocidadVoz);
    $$("[data-tema-opcion]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.temaOpcion === e.tema)));
  }

  function inicializarAjustes() {
    const dlg = $("#dialogo-ajustes");
    const abrir = () => { sincronizarAjustes(); if (dlg && !dlg.open) dlg.showModal(); };
    $("#btn-ajustes")?.addEventListener("click", abrir);
    $("#cerrar-ajustes")?.addEventListener("click", () => dlg?.close());
    dlg?.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
    $$("[data-tema-opcion]").forEach((b) => b.addEventListener("click", () => {
      BV.prefs.cambiarTema(b.dataset.temaOpcion);
      sincronizarAjustes();
      BV.sonido("clic");
    }));
    $("#texto-menos")?.addEventListener("click", () => { BV.prefs.cambiarEscala(-0.05); sincronizarAjustes(); });
    $("#texto-mas")?.addEventListener("click", () => { BV.prefs.cambiarEscala(0.05); sincronizarAjustes(); });
    $("#texto-reset")?.addEventListener("click", () => { BV.prefs.escala(1); sincronizarAjustes(); });
    $("#ajuste-contraste")?.addEventListener("change", (e) => BV.prefs.alternar("contraste", e.target.checked));
    $("#ajuste-movimiento")?.addEventListener("change", (e) => BV.prefs.alternar("movimiento", e.target.checked));
    $("#ajuste-sonido")?.addEventListener("change", (e) => BV.prefs.alternar("sonido", e.target.checked));
    $("#ajuste-velocidad")?.addEventListener("input", (e) => BV.prefs.velocidad(e.target.value));
    $("#probar-voz")?.addEventListener("click", (e) => BV.voz.probar());
    $("#reiniciar-progreso")?.addEventListener("click", () => {
      BV.ui.dialogo("Reiniciar progreso", "<p>Esto borrará favoritos, logros, diplomas y estrellas guardados en este navegador. No se puede deshacer.</p>", [
        { texto: "Cancelar", clase: "boton--fantasma" },
        { texto: "Sí, reiniciar", clase: "boton--peligro", accion: () => {
          BV.store.reiniciar();
          sincronizarAjustes();
          BV.ui.toast({ titulo: "Progreso reiniciado", texto: "La biblioteca vuelve a empezar contigo." });
          renderizar();
        } }
      ]);
    });
    document.addEventListener("bv:estado", sincronizarAjustes);
    sincronizarAjustes();
  }

  /* ---------------- Mascota ---------------- */
  const CONSEJOS = [
    { titulo: "Empieza por un cuento", texto: "Si no sabes qué leer, abre la biblioteca y filtra por tu nivel. ¡Siempre hay algo para ti!", accion: { texto: "Ver biblioteca", href: "#/biblioteca" } },
    { titulo: "Escucha mientras lees", texto: "Pulsa «Escuchar» y la voz de tu navegador te acompañará. Puedes cambiar la velocidad en ajustes.", accion: { texto: "Abrir ajustes", id: "btn-ajustes" } },
    { titulo: "Las estrellas suman", texto: "Terminar un libro da 8 estrellas y cada juego también. Con ellas se desbloquean logros y diplomas.", accion: { texto: "Mis logros", href: "#/logros" } },
    { titulo: "Prueba un trabalenguas", texto: "Leer en voz alta entrenar tu lengua. Empieza despacio y luego intenta más rápido.", accion: { texto: "Ir a trabalenguas", href: "#/trabalenguas" } },
    { titulo: "Tú decides cómo ver", texto: "Cambia el tamaño del texto, el tema o el contraste desde el botón de ajustes. Tu lectura, a tu manera.", accion: { texto: "Abrir ajustes", id: "btn-ajustes" } },
    { titulo: "Guarda tus favoritos", texto: "Toca el corazón de un libro y aparecerá en tu estantería personal. Solo tú la ves.", accion: { texto: "Mis favoritos", href: "#/favoritos" } }
  ];
  let consejoIndice = 0;

  function mostrarConsejo(indice) {
    const consejo = CONSEJOS[U.limitar(indice, 0, CONSEJOS.length - 1)];
    const burbuja = $("#burbuja-mascota");
    const boton = $("#mascota-flotante");
    const acciones = $("#burbuja-acciones");
    if (!burbuja || !boton) return;
    $("#burbuja-titulo").textContent = consejo.titulo;
    $("#burbuja-texto").textContent = consejo.texto;
    acciones.innerHTML = "";
    if (consejo.accion) {
      const a = document.createElement(consejo.accion.href ? "a" : "button");
      a.className = "boton boton--primario boton--pequeno";
      if (consejo.accion.href) a.href = consejo.accion.href;
      else a.type = "button";
      a.textContent = consejo.accion.texto;
      if (!consejo.accion.href) a.addEventListener("click", () => { document.getElementById(consejo.accion.id)?.click(); burbuja.hidden = true; });
      else a.addEventListener("click", () => { burbuja.hidden = true; });
      acciones.appendChild(a);
    }
    burbuja.hidden = false;
    boton.setAttribute("aria-expanded", "true");
  }

  function inicializarMascota() {
    $("#mascota-flotante")?.addEventListener("click", () => {
      const burbuja = $("#burbuja-mascota");
      if (!burbuja.hidden) {
        burbuja.hidden = true;
        $("#mascota-flotante").setAttribute("aria-expanded", "false");
        return;
      }
      mostrarConsejo(consejoIndice);
      consejoIndice = (consejoIndice + 1) % CONSEJOS.length;
    });
    $("#cerrar-burbuja")?.addEventListener("click", () => {
      $("#burbuja-mascota").hidden = true;
      $("#mascota-flotante").setAttribute("aria-expanded", "false");
    });
    const bienvenida = "biblioteca-virtual:bienvenida-draco";
    try {
      if (!localStorage.getItem(bienvenida)) {
        window.setTimeout(() => mostrarConsejo(0), 2600);
        localStorage.setItem(bienvenida, "1");
      }
    } catch (e) { /* almacenamiento opcional */ }
  }

  /* ---------------- Delegados globales ---------------- */
  function inicializarDelegados() {
    document.addEventListener("click", (e) => {
      const favorito = e.target.closest("[data-favorito]");
      if (favorito) {
        e.preventDefault();
        const id = favorito.dataset.favorito;
        const activo = BV.favoritos.alternar(id);
        document.querySelectorAll(`[data-favorito="${CSS.escape(id)}"]`).forEach((b) => {
          b.setAttribute("aria-pressed", String(activo));
          const nombre = BV.datos.buscarRecurso(id)?.titulo || "este recurso";
          b.setAttribute("aria-label", `${activo ? "Quitar de favoritos" : "Guardar en favoritos"}: ${nombre}`);
          const iconoEl = b.querySelector(".icono");
          if (iconoEl) iconoEl.style.fill = activo ? "currentColor" : "none";
          if (b.classList.contains("boton")) b.innerHTML = `${icono("corazon")} ${activo ? "En favoritos" : "Favorito"}`;
        });
        document.dispatchEvent(new CustomEvent("bv:favorito", { detail: { id, activo } }));
        BV.componentes.estrellasHeader();
        BV.sonido("clic");
        return;
      }
      const voz = e.target.closest("[data-voz]");
      if (voz) {
        e.preventDefault();
        BV.voz.alternar(voz.dataset.textoVoz || voz.getAttribute("data-voz"), voz);
        return;
      }
      const descargar = e.target.closest("[data-descargar-libro]");
      if (descargar) {
        e.preventDefault();
        imprimirTrasCargar = true;
        location.hash = `#/leer/${descargar.dataset.descargarLibro}`;
        return;
      }
      const progreso = e.target.closest("#descargar-progreso");
      if (progreso) {
        e.preventDefault();
        document.body.classList.add("imprimir-progreso");
        BV.ui.dialogo("Descargar mi progreso en PDF", "<p>Se abrirá la ventana de impresión. Elige <strong>Guardar como PDF</strong> para conservar tu reporte de lectura, logros y libros en curso.</p>", [
          { texto: "Cancelar", clase: "boton--fantasma", accion: () => { document.body.classList.remove("imprimir-progreso"); } },
          { texto: "Abrir impresión", clase: "boton--primario", accion: () => { window.setTimeout(() => window.print(), 120); } }
        ]);
      }
    });

    $("#cerrar-dialogo")?.addEventListener("click", () => BV.ui.cerrarDialogoActual());
    window.addEventListener("hashchange", renderizar);
  }

  /* ---------------- Arranque ---------------- */
  function iniciar() {
    BV.prefs.aplicar();
    inicializarNavegacion();
    inicializarAjustes();
    inicializarDelegados();
    inicializarMascota();
    renderizar();

    if ("serviceWorker" in navigator && (location.protocol === "https:" || ["localhost", "127.0.0.1"].includes(location.hostname))) {
      navigator.serviceWorker.register("sw.js").catch(() => { /* Sin caché offline: la web sigue funcionando. */ });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();

(function(){
 let promptEvent=null, installed=matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
 const status=()=>document.getElementById("bv-estado-app");
 const say=t=>{if(status())status().textContent=t;};
 function refresh(){document.querySelectorAll("[data-bv-instalar]").forEach(b=>{b.disabled=installed;b.textContent=installed?"Biblioteca instalada":"Instalar biblioteca";});const f=document.getElementById("bv-instalar-franja");if(f)f.hidden=installed;say((installed?"Aplicación instalada. ":"Instalación disponible según tu navegador. ")+(navigator.onLine?"Con conexión.":"Sin conexión."));}
 window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();promptEvent=e;refresh();});
 window.addEventListener("appinstalled",()=>{installed=true;promptEvent=null;refresh();});
 window.addEventListener("online",()=>{refresh();navigator.serviceWorker?.getRegistration().then(r=>r?.update()).catch(()=>{});});
 window.addEventListener("offline",refresh);
 document.querySelectorAll("[data-bv-instalar]").forEach(b=>b.addEventListener("click",async()=>{if(promptEvent){const p=promptEvent;promptEvent=null;try{await p.prompt();await p.userChoice;}catch(e){say("No se pudo abrir la instalación.");}}else{window.BV.ui.dialogo("Instalar Biblioteca Virtual","<p>En Android o computadora, abre esta página en Chrome o Edge y busca Instalar aplicación o Añadir a pantalla de inicio en el menú. En iPhone, abre Safari, pulsa Compartir y Añadir a pantalla de inicio.</p><p>Si estás dentro de otra aplicación, abre primero el enlace en tu navegador. No se puede instalar sin tu autorización.</p>",[{texto:"Entendido",clase:"boton--primario"}]);}}));
 document.getElementById("bv-actualizar")?.addEventListener("click",async()=>{try{if(!navigator.onLine)throw Error();const r=await navigator.serviceWorker.getRegistration();if(!r)throw Error();await r.update();say(r.installing||r.waiting?"Descargando actualización. Abre de nuevo la biblioteca cuando termine.":"Comprobación terminada. Si hay una versión nueva, se aplicará automáticamente.");}catch(e){say("No se pudo comprobar. Revisa tu conexión y navegador.");}});
 document.getElementById("bv-offline")?.addEventListener("click",async e=>{const b=e.currentTarget;b.disabled=true;try{if(!navigator.onLine||!navigator.serviceWorker?.controller)throw Error();const urls=[...new Set((window.BV_CATALOGO||[]).filter(x=>x.tipo==="pdf"&&x.archivo&&x.acceso==="abierto").map(x=>x.archivo))];const cache=await caches.open("bv-libros-offline");let ok=0;for(const url of urls){try{await cache.add(url);ok++;}catch(e){}say("Libros descargados: "+ok+" de "+urls.length);}say(ok+" de "+urls.length+" PDF guardados. Los cuentos de texto se incluyen en la aplicación.");}catch(e){say("Conéctate a internet y vuelve a abrir la biblioteca antes de descargar.");}finally{b.disabled=false;}});
 document.getElementById("bv-respaldo")?.addEventListener("click",()=>{const blob=new Blob([JSON.stringify(window.BV.store.estado,null,2)],{type:"application/json"});const u=URL.createObjectURL(blob);const a=document.createElement("a");a.href=u;a.download="biblioteca-progreso.json";a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);});
 refresh();
})();

(function(){function nav(){const r=location.hash.split("?")[0];document.querySelectorAll(".pio-nav a").forEach(a=>{const h=a.getAttribute("href");if(r===h||h==="#/juegos"&&r.startsWith("#/juego/")||h==="#/biblioteca"&&r.startsWith("#/leer/")||!r&&h==="#/inicio")a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");});}window.addEventListener("hashchange",nav);nav();})();