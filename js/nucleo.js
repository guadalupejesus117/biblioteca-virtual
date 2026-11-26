/* ============================================================
   Biblioteca Virtual · Núcleo: utilidades, datos, estado,
   accesibilidad, voz, sonidos y avisos.
   ============================================================ */
(function () {
  "use strict";

  const BV = (window.BV = window.BV || {});

  /* ---------------- Utilidades ---------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function esc(valor) {
    return String(valor == null ? "" : valor)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizar(texto) {
    return String(texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function fechaLocal(fecha = new Date()) {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, "0");
    const d = String(fecha.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function fechaBonita(fecha = new Date()) {
    try {
      return new Intl.DateTimeFormat("es-MX", {
        day: "numeric", month: "long", year: "numeric"
      }).format(fecha);
    } catch (e) {
      return fechaLocal(fecha);
    }
  }

  function barajar(lista) {
    const copia = lista.slice();
    for (let i = copia.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function limitar(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function plurar(n, singular, plural) {
    return `${n} ${n === 1 ? singular : plural}`;
  }

  function estrellasPara(porcentaje) {
    if (porcentaje >= 95) return 3;
    if (porcentaje >= 70) return 2;
    return 1;
  }

  function promedio(lista) {
    if (!lista.length) return 0;
    return Math.round(lista.reduce((a, b) => a + b, 0) / lista.length);
  }

  function pct(parte, total) {
    if (!total) return 0;
    return Math.round((parte / total) * 100);
  }

  BV.util = {
    $, $$, esc, normalizar, fechaLocal, fechaBonita, barajar, aleatorio,
    limitar, plurar, estrellasPara, promedio, pct
  };

  /* ---------------- Iconos ---------------- */
  const MAPA_ICONOS = {
    libro: "book-open", libros: "library", libroAbierto: "book-open-text",
    estrella: "star", corazon: "heart", buscar: "search", ajustes: "settings",
    sol: "sun", luna: "moon", menu: "menu", cerrar: "x", atras: "chevron-left",
    siguiente: "chevron-right", abajo: "chevron-down", arriba: "chevron-up",
    flecha: "arrow-right", casa: "house", teatro: "theater", ayuda: "circle-help",
    info: "info", descargar: "download", pantalla: "maximize", zoom: "zoom-in",
    reproducir: "play", reiniciar: "rotate-ccw", check: "check", candado: "lock",
    enlace: "external-link", volumen: "volume-2", silencio: "volume-x",
    texto: "type", contraste: "contrast", ojo: "eye", chispas: "sparkles",
    reloj: "clock", usuario: "user", imprimir: "printer", filtros: "list-filter",
    archivo: "file-text", globo: "globe", medalla: "medal", llama: "flame",
    calendario: "calendar", diana: "target", rompecabezas: "puzzle", cerebro: "brain",
    castillo: "castle", llave: "key", corona: "crown", pluma: "feather",
    sonrisa: "smile", planeta: "orbit", brujula: "compass", nube: "cloud",
    arbol: "tree-pine", barco: "ship", lampara: "lamp", olas: "waves",
    manzana: "apple", huella: "footprints", marcador: "book-marked",
    varita: "wand-sparkles", mascara: "venetian-mask", paleta: "palette",
    accesibilidad: "accessibility", bebe: "baby", graduacion: "graduation-cap",
    escuela: "school", cohete: "rocket", insignia: "badge-check", manos: "hand-heart",
    idea: "lightbulb", hoja: "leaf", conejo: "rabbit", gato: "cat", pez: "fish",
    mariposa: "bug", flor: "flower-2", montana: "mountain", arcoiris: "rainbow",
    cita: "quote", lista: "list", premio: "award", gema: "gem",
    escudo: "shield-check", cronometro: "timer", mezclar: "shuffle",
    usuarios: "users", cuaderno: "notebook-pen", pergamino: "scroll-text",
    mensaje: "message-square-quote", lentes: "glasses", lunaEstrella: "moon-star",
    solLuna: "sun-moon", libroCorazon: "book-heart", separador: "bookmark",
    checkCirculo: "circle-check", reproducirCirculo: "circle-play",
    fiesta: "party-popper", correo: "mail", idiomas: "languages", mapa: "map-pin",
    copia: "book-copy", subtitulos: "captions", micro: "mic", teclado: "keyboard",
    mover: "move", expandir: "expand", guardar: "save", basura: "trash-2",
    lapiz: "pencil", mas: "plus", menos: "minus", puntos: "ellipsis",
    filtro: "filter", cuadricula: "grid-2x2", filas: "rows-3",
    columnas: "columns-3", auriculares: "headphones", musica: "music",
    pincel: "paintbrush", formas: "shapes", bloques: "blocks",
    dado: "dices", juego: "joystick", edificio: "building-2", pajaro: "bird",
    fuego: "flame-kindling", rayo: "zap", telescopio: "telescope",
    microscopio: "microscope", matraz: "flask-conical", adn: "dna", atomo: "atom",
    mochila: "backpack", tijeras: "scissors", portapapeles: "clipboard-check",
    archivoCheck: "file-check", listaCheck: "list-checks", indice: "table-of-contents",
    discurso: "speech", alerta: "circle-alert", wifi: "wifi-off",
    escudoAlerta: "shield-alert", relojArena: "hourglass", velocidad: "gauge",
    actividad: "activity", pausa: "circle-pause", girar: "rotate-cw",
    pantallaCompleta: "fullscreen", subir: "upload", nubeDescarga: "cloud-download",
    carpeta: "folder-open", imagen: "image", libroImagen: "book-image",
    libroAudio: "book-audio", libroUsuario: "book-user", regalo: "gift",
    liston: "ribbon", sello: "stamp", dragon: "dragon", buho: "buho",
    capucha: "capucha", marioneta: "marioneta", espejo: "espejo",
    plumaEstrella: "pluma-estrella", cartas: "blocks", boca: "speech",
    comic: "book-image", pregunta: "circle-help", nota: "music",
    mariposas: "bug", sombrero: "capucha", mago: "wand-sparkles"
  };

  function icono(nombre, clases = "") {
    const id = MAPA_ICONOS[nombre] || nombre || "book-open";
    return `<svg class="icono ${clases}" aria-hidden="true" focusable="false"><use href="assets/svg/iconos.svg#${esc(id)}"></use></svg>`;
  }
  BV.icono = icono;
  BV.MAPA_ICONOS = MAPA_ICONOS;

  /* ---------------- Datos ---------------- */
  const CATALOGO = window.BV_CATALOGO || [];
  const GENEROS = window.BV_GENEROS || {};
  const NIVELES = window.BV_NIVELES || [];
  const LOGROS = window.BV_LOGROS || [];
  const DIPLOMAS = window.BV_DIPLOMAS || [];
  const RECURSOS = window.BV_RECURSOS || [];
  const TEXTOS = window.BV_TEXTOS || {};
  const JUEGOS = window.BV_JUEGOS || {};

  const GENERO_MADRE = {
    cuento: "narrativo", novela: "narrativo", fabula: "narrativo",
    leyenda: "narrativo", mito: "narrativo", "cuento-infantil": "narrativo",
    poema: "lirico", poesia: "lirico", "poesia-infantil": "lirico",
    teatro: "dramatico", "teatro-infantil": "dramatico", guion: "dramatico",
    comic: "otros", humor: "otros", trabalenguas: "otros",
    adivinanza: "otros", lectura: "otros", texto: "otros",
    "lectura-educativa": "otros", "texto-informativo": "otros"
  };

  function generoDe(recurso) {
    if (!recurso) return "otros";
    if (GENEROS[recurso.genero]) return recurso.genero;
    return GENERO_MADRE[recurso.genero] || "otros";
  }

  function generoInfo(id) {
    return GENEROS[id] || { id, nombre: id, paleta: "violeta", icono: "libro", descripcion: "", subgeneros: [] };
  }

  function subgeneroNombre(recurso) {
    if (!recurso) return "";
    const madre = generoInfo(generoDe(recurso));
    const sub = (madre.subgeneros || []).find((s) => s.id === recurso.subgenero);
    if (sub) return sub.nombre;
    const directo = (GENEROS[recurso.genero] || {});
    if (directo.nombre) return directo.nombre;
    const limpio = String(recurso.subgenero || recurso.genero || "Lectura").replace(/-/g, " ");
    return limpio.charAt(0).toUpperCase() + limpio.slice(1);
  }

  function nivelInfo(id) {
    return NIVELES.find((n) => n.id === id) || { id, nombre: id, icono: "libro", edad: "" };
  }

  function nivelNombre(id) {
    return nivelInfo(id).nombre;
  }

  function nombreAcceso(recurso) {
    if (!recurso) return "";
    if (recurso.acceso === "abierto") return recurso.tipo === "pdf" ? "PDF abierto" : "Lectura abierta";
    return "Ficha informativa";
  }

  function buscarRecurso(id) {
    return CATALOGO.find((r) => r.id === id) || null;
  }

  function abiertos() {
    return CATALOGO.filter((r) => r.acceso === "abierto");
  }

  function juegosLista() {
    return [
      { clave: "sopa", nombre: "Sopa de letras", icono: "rompecabezas", color: "#7c5cff", descripcion: "Encuentra palabras escondidas en la cuadrícula.", ruta: "#/juego/sopa", nivel: "Todos" },
      { clave: "crucigrama", nombre: "Crucigrama", icono: "cuadricula", color: "#2fb49a", descripcion: "Completa las palabras cruzadas con las pistas.", ruta: "#/juego/crucigrama", nivel: "Todos" },
      { clave: "memorama", nombre: "Memorama", icono: "cartas", color: "#e85d87", descripcion: "Encuentra las parejas de símbolos de la biblioteca.", ruta: "#/juego/memorama", nivel: "Todos" },
      { clave: "adivinanzas", nombre: "Adivinanzas", icono: "pregunta", color: "#f2b134", descripcion: "Resuelve acertijos con pistas y explicaciones.", ruta: "#/juego/adivinanzas", nivel: "Todos" },
      { clave: "trabalenguas", nombre: "Trabalenguas", icono: "boca", color: "#e26059", descripcion: "Entrena la lengua y la dicción con retos.", ruta: "#/juego/trabalenguas", nivel: "Todos" },
      { clave: "rompecabezas", nombre: "Rompecabezas", icono: "rompecabezas", color: "#4fa3dc", descripcion: "Ordena las piezas de tres escenas mágicas.", ruta: "#/juego/rompecabezas", nivel: "Todos" },
      { clave: "comprension", nombre: "Comprensión lectora", icono: "cerebro", color: "#8bbf3f", descripcion: "Lee, responde y descubre por qué.", ruta: "#/juego/comprension", nivel: "Primaria y secundaria" },
      { clave: "completa", nombre: "Completa la palabra", icono: "pluma", color: "#9b8ce8", descripcion: "Reconstruye palabras con las letras disponibles.", ruta: "#/juego/completa", nivel: "Todos" }
    ];
  }

  BV.datos = {
    CATALOGO, GENEROS, NIVELES, LOGROS, DIPLOMAS, RECURSOS, TEXTOS, JUEGOS,
    generoDe, generoInfo, subgeneroNombre, nivelInfo, nivelNombre,
    nombreAcceso, buscarRecurso, abiertos, juegosLista
  };

  /* ---------------- Estado ---------------- */
  const CLAVE = "biblioteca-virtual:estado:v1";

  function estadoInicial() {
    return {
      version: 1,
      tema: "auto",
      escala: 1,
      contraste: false,
      movimiento: false,
      sonido: true,
      velocidadVoz: 0.95,
      favoritos: [],
      lectura: {},
      stats: {
        booksStarted: 0,
        booksCompleted: 0,
        genresRead: [],
        gamesPlayed: 0,
        starsEarned: 0,
        riddlesCorrect: 0,
        tongueCompleted: 0,
        wordsearchCompleted: 0,
        crosswordCompleted: 0,
        memoryCompleted: 0,
        puzzleCompleted: 0,
        comprehensionCompleted: 0,
        perfectGames: 0
      },
      gamesCompletedList: [],
      logros: {},
      diplomas: [],
      streak: { count: 0, last: null },
      actividad: [],
      trabasHechas: []
    };
  }

  function fusionar(base, guardado) {
    if (Array.isArray(base)) return Array.isArray(guardado) ? guardado.slice() : base.slice();
    if (base && typeof base === "object") {
      const salida = { ...base };
      if (guardado && typeof guardado === "object") {
        Object.keys(guardado).forEach((clave) => {
          if (clave in base) salida[clave] = fusionar(base[clave], guardado[clave]);
          else salida[clave] = guardado[clave];
        });
      }
      return salida;
    }
    return guardado === undefined ? base : guardado;
  }

  function cargarEstado() {
    try {
      const crudo = localStorage.getItem(CLAVE);
      if (!crudo) return estadoInicial();
      const datos = JSON.parse(crudo);
      const estado = fusionar(estadoInicial(), datos);
      estado.stats = fusionar(estadoInicial().stats, datos.stats || {});
      return estado;
    } catch (error) {
      console.warn("No se pudo leer el progreso guardado.", error);
      return estadoInicial();
    }
  }

  let estado = cargarEstado();

  function guardar() {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado));
      document.dispatchEvent(new CustomEvent("bv:estado", { detail: estado }));
    } catch (error) {
      console.warn("No se pudo guardar el progreso.", error);
    }
  }

  function reiniciar() {
    estado = estadoInicial();
    guardar();
    aplicarPreferencias();
  }

  BV.store = {
    get estado() { return estado; },
    guardar,
    reiniciar,
    CLAVE
  };

  /* ---------------- Preferencias y tema ---------------- */
  const mediaOscuro = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function temaEfectivo() {
    if (estado.tema === "auto") return mediaOscuro && mediaOscuro.matches ? "oscuro" : "claro";
    return estado.tema;
  }

  function aplicarPreferencias() {
    const raiz = document.documentElement;
    raiz.dataset.tema = temaEfectivo();
    raiz.style.fontSize = `${Math.round(estado.escala * 100)}%`;
    document.body.classList.toggle("alto-contraste", Boolean(estado.contraste));
    document.body.classList.toggle("sin-movimiento", Boolean(estado.movimiento));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", temaEfectivo() === "oscuro" ? "#0d0a22" : "#fbf7ef");
    const botones = document.querySelectorAll("[data-tema-opcion]");
    botones.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.temaOpcion === estado.tema)));
  }

  if (mediaOscuro) {
    const reaccionar = () => { if (estado.tema === "auto") aplicarPreferencias(); };
    if (mediaOscuro.addEventListener) mediaOscuro.addEventListener("change", reaccionar);
    else if (mediaOscuro.addListener) mediaOscuro.addListener(reaccionar);
  }

  BV.prefs = {
    aplicar: aplicarPreferencias,
    temaEfectivo,
    cambiarTema(tema) {
      if (!["claro", "oscuro", "auto"].includes(tema)) return;
      estado.tema = tema;
      guardar();
      aplicarPreferencias();
    },
    cambiarEscala(delta) {
      estado.escala = limitar(Math.round((estado.escala + delta) * 100) / 100, 0.9, 1.25);
      guardar();
      aplicarPreferencias();
    },
    escala(valor) {
      estado.escala = valor;
      guardar();
      aplicarPreferencias();
    },
    alternar(clave, valor) {
      estado[clave] = typeof valor === "boolean" ? valor : !estado[clave];
      guardar();
      aplicarPreferencias();
    },
    velocidad(valor) {
      estado.velocidadVoz = limitar(Number(valor) || 0.95, 0.6, 1.4);
      guardar();
    }
  };

  /* ---------------- Voz ---------------- */
  let voces = [];
  let botonActivo = null;

  function cargarVoces() {
    if (!("speechSynthesis" in window)) return;
    voces = window.speechSynthesis.getVoices();
  }
  if ("speechSynthesis" in window) {
    cargarVoces();
    window.speechSynthesis.addEventListener("voiceschanged", cargarVoces);
  }

  function elegirVoz() {
    if (!voces.length) cargarVoces();
    const es = voces.filter((v) => String(v.lang || "").toLowerCase().startsWith("es"));
    if (!es.length) return null;
    return (
      es.find((v) => /es-MX|es-US|es-419/i.test(v.lang)) ||
      es.find((v) => /es-ES/i.test(v.lang)) ||
      es[0]
    );
  }

  function partirTexto(texto, maximo = 220) {
    const limpio = String(texto || "").replace(/\s+/g, " ").trim();
    if (!limpio) return [];
    const frases = limpio.match(/[^.!?;:]+[.!?;:]*/g) || [limpio];
    const partes = [];
    let actual = "";
    frases.forEach((frase) => {
      if ((actual + frase).length > maximo && actual) {
        partes.push(actual.trim());
        actual = "";
      }
      if (frase.length > maximo) {
        frase.split(", ").forEach((trozo) => {
          if ((actual + trozo).length > maximo && actual) {
            partes.push(actual.trim());
            actual = "";
          }
          actual += trozo + ", ";
        });
      } else {
        actual += frase + " ";
      }
    });
    if (actual.trim()) partes.push(actual.trim());
    return partes;
  }

  function resetearBoton() {
    if (botonActivo) {
      botonActivo.setAttribute("aria-pressed", "false");
      botonActivo.classList.remove("leyendo");
      const etiqueta = botonActivo.dataset.etiquetaOriginal;
      if (etiqueta) botonActivo.innerHTML = etiqueta;
    }
    botonActivo = null;
  }

  function textoDeBoton(boton) {
    return boton ? (boton.dataset.textoVoz || boton.closest("[data-texto-voz]")?.dataset.textoVoz || "") : "";
  }

  const voz = {
    limpiar: window.BV_TEXTO_VOZ,
    fragmentar: window.BV_FRAGMENTOS_VOZ,
    elegir: elegirVoz,
    disponible: "speechSynthesis" in window,
    detener() {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      resetearBoton();
    },
    hablar(texto, boton = null) {
      if (!("speechSynthesis" in window)) {
        BV.ui.toast({ titulo: "Voz no disponible", texto: "Este navegador no incluye lectura en voz alta. Prueba con Edge, Chrome o Safari.", tipo: "error" });
        return;
      }
      const contenido = window.BV_TEXTO_VOZ(texto || (boton ? boton.dataset.textoVoz || textoDeBoton(boton) : ""));
      if (!contenido) return;
      if (botonActivo === boton && window.speechSynthesis.speaking) {
        voz.detener();
        return;
      }
      voz.detener();
      const partes = window.BV_FRAGMENTOS_VOZ(contenido).map(p => p.texto);
      if (!partes.length) return;
      botonActivo = boton;
      if (boton) {
        if (!boton.dataset.etiquetaOriginal) boton.dataset.etiquetaOriginal = boton.innerHTML;
        boton.setAttribute("aria-pressed", "true");
        boton.classList.add("leyendo");
        const textoOriginal = boton.dataset.etiquetaOriginal;
        boton.innerHTML = `${icono("pausa")} Detener`;
      }
      const ultima = partes.length - 1;
      partes.forEach((parte, indice) => {
        const u = new SpeechSynthesisUtterance(parte);
        u.lang = "es-MX";
        u.rate = estado.velocidadVoz;
        u.pitch = 1;
        const vozElegida = elegirVoz();
        if (vozElegida) u.voice = vozElegida;
        if (indice === ultima) {
          u.onend = resetearBoton;
          u.onerror = resetearBoton;
        }
        window.speechSynthesis.speak(u);
      });
    },
    alternar(texto, boton) {
      voz.hablar(texto, boton);
    },
    probar() {
      voz.hablar("Hola, soy Draco. Así se escuchará la lectura en voz alta de la biblioteca.");
    }
  };
  BV.voz = voz;

  /* ---------------- Sonidos ---------------- */
  let contextoAudio = null;

  function contexto() {
    if (!contextoAudio) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      contextoAudio = new AC();
    }
    if (contextoAudio.state === "suspended") contextoAudio.resume();
    return contextoAudio;
  }

  function nota(frecuencia, inicio, duracion, tipo = "sine", volumen = 0.05) {
    const ctx = contexto();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const ganancia = ctx.createGain();
    osc.type = tipo;
    osc.frequency.setValueAtTime(frecuencia, ctx.currentTime + inicio);
    ganancia.gain.setValueAtTime(0.0001, ctx.currentTime + inicio);
    ganancia.gain.exponentialRampToValueAtTime(volumen, ctx.currentTime + inicio + 0.015);
    ganancia.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + inicio + duracion);
    osc.connect(ganancia).connect(ctx.destination);
    osc.start(ctx.currentTime + inicio);
    osc.stop(ctx.currentTime + inicio + duracion + 0.03);
  }

  function sonido(tipo = "clic") {
    if (!estado.sonido) return;
    try {
      if (tipo === "clic") nota(620, 0, 0.05, "sine", 0.025);
      else if (tipo === "correcto") { nota(660, 0, 0.11); nota(880, 0.09, 0.16); }
      else if (tipo === "error") { nota(220, 0, 0.12, "triangle", 0.04); nota(170, 0.1, 0.16, "triangle", 0.035); }
      else if (tipo === "estrella") { nota(880, 0, 0.1); nota(1100, 0.08, 0.1); nota(1320, 0.16, 0.2); }
      else if (tipo === "victoria") { [523, 659, 784, 1046].forEach((f, i) => nota(f, i * 0.12, 0.35, "sine", 0.04)); }
    } catch (error) {
      /* El audio es un extra; si falla, no interrumpe la lectura. */
    }
  }
  BV.sonido = sonido;

  /* ---------------- Avisos, diálogos y confeti ---------------- */
  function toast({ titulo = "", texto = "", tipo = "info", iconoNombre = null, duracion = 6200 } = {}) {
    const contenedor = document.getElementById("toasts");
    if (!contenedor) return;
    const elem = document.createElement("div");
    elem.className = `toast toast--${tipo}`;
    const iconoFinal = iconoNombre || (tipo === "logro" ? "premio" : tipo === "error" ? "alerta" : tipo === "exito" ? "checkCirculo" : "info");
    elem.innerHTML = `
      <div class="toast__icono">${icono(iconoFinal)}</div>
      <div class="toast__texto">${titulo ? `<strong>${esc(titulo)}</strong>` : ""}${texto ? `<span>${esc(texto)}</span>` : ""}</div>
      <button type="button" class="toast__cerrar" aria-label="Cerrar aviso">${icono("cerrar", "icono--xs")}</button>`;
    const cerrar = () => {
      if (!elem.isConnected) return;
      elem.classList.add("saliendo");
      window.setTimeout(() => elem.remove(), 260);
    };
    elem.querySelector(".toast__cerrar").addEventListener("click", cerrar);
    contenedor.appendChild(elem);
    window.setTimeout(cerrar, duracion);
  }

  let cerrarDialogo = null;

  function dialogo(titulo, cuerpo, acciones = []) {
    const dlg = document.getElementById("dialogo");
    if (!dlg) return;
    const tituloEl = document.getElementById("dialogo-titulo");
    const cuerpoEl = document.getElementById("dialogo-cuerpo");
    const accionesEl = document.getElementById("dialogo-acciones");
    if (tituloEl) tituloEl.textContent = titulo;
    if (cuerpoEl) cuerpoEl.innerHTML = cuerpo;
    if (accionesEl) {
      accionesEl.innerHTML = "";
      const lista = acciones.length ? acciones : [{ texto: "Entendido", clase: "boton--primario" }];
      lista.forEach((accion) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = `boton ${accion.clase || "boton--contorno"}`;
        b.textContent = accion.texto;
        b.addEventListener("click", () => {
          const resultado = accion.accion ? accion.accion() : undefined;
          if (resultado !== false) dlg.close();
        });
        accionesEl.appendChild(b);
      });
    }
    if (!dlg.open) dlg.showModal();
    else dlg.focus();
  }

  function cerrarDialogoActual() {
    const dlg = document.getElementById("dialogo");
    if (dlg && dlg.open) dlg.close();
  }
  cerrarDialogo = cerrarDialogoActual;

  let confetiTimer = null;
  function confeti(cantidad = 44) {
    if (estado.movimiento) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const capa = document.getElementById("confeti");
    if (!capa) return;
    const colores = ["#ffd166", "#ff8fab", "#7c5cff", "#2fb49a", "#4fa3dc", "#fff3c4"];
    const fragmento = document.createDocumentFragment();
    for (let i = 0; i < cantidad; i += 1) {
      const pieza = document.createElement("span");
      pieza.className = "confeti__pieza";
      pieza.style.left = `${aleatorio(2, 98)}%`;
      pieza.style.background = colores[i % colores.length];
      pieza.style.setProperty("--dx", `${aleatorio(-120, 120)}px`);
      pieza.style.setProperty("--rot", `${aleatorio(0, 360)}deg`);
      pieza.style.setProperty("--rot-final", `${aleatorio(360, 1080)}deg`);
      pieza.style.setProperty("--duracion", `${(1.6 + Math.random() * 1.6).toFixed(2)}s`);
      pieza.style.animationDelay = `${(Math.random() * 0.4).toFixed(2)}s`;
      if (i % 3 === 0) pieza.style.borderRadius = "50%";
      fragmento.appendChild(pieza);
    }
    capa.appendChild(fragmento);
    if (confetiTimer) window.clearTimeout(confetiTimer);
    confetiTimer = window.setTimeout(() => { capa.innerHTML = ""; confetiTimer = null; }, 3800);
  }

  function anunciar(texto) {
    let region = document.getElementById("anuncio-vivo");
    if (!region) {
      region = document.createElement("div");
      region.id = "anuncio-vivo";
      region.className = "visualmente-oculto";
      region.setAttribute("aria-live", "polite");
      document.body.appendChild(region);
    }
    region.textContent = "";
    window.setTimeout(() => { region.textContent = texto; }, 30);
  }

  BV.ui = { toast, dialogo, cerrarDialogo, confeti, anunciar, cerrarDialogoActual };

  /* ---------------- Favoritos ---------------- */
  function esFavorito(id) {
    return estado.favoritos.includes(id);
  }

  function alternarFavorito(id) {
    const recurso = buscarRecurso(id);
    if (!recurso) return;
    if (esFavorito(id)) {
      estado.favoritos = estado.favoritos.filter((x) => x !== id);
      toast({ titulo: "Quitado de favoritos", texto: recurso.titulo, iconoNombre: "corazon" });
    } else {
      estado.favoritos.push(id);
      toast({ titulo: "Guardado en favoritos", texto: recurso.titulo, tipo: "exito", iconoNombre: "corazon" });
    }
    guardar();
    evaluarLogros();
    return esFavorito(id);
  }

  BV.favoritos = { es: esFavorito, alternar: alternarFavorito };

  /* ---------------- Niveles y racha ---------------- */
  const NIVELES_ESTRELLAS = [
    { min: 0, nombre: "Aprendiz", icono: "huella" },
    { min: 15, nombre: "Curioso", icono: "lentes" },
    { min: 40, nombre: "Explorador", icono: "brujula" },
    { min: 80, nombre: "Guardián de historias", icono: "escudo" },
    { min: 140, nombre: "Maestro lector", icono: "medalla" },
    { min: 220, nombre: "Leyenda de la biblioteca", icono: "corona" }
  ];

  function nivelActual() {
    const estrellas = estado.stats.starsEarned || 0;
    let indice = 0;
    NIVELES_ESTRELLAS.forEach((n, i) => { if (estrellas >= n.min) indice = i; });
    const actual = NIVELES_ESTRELLAS[indice];
    const siguiente = NIVELES_ESTRELLAS[indice + 1] || null;
    const porcentaje = siguiente
      ? pct(estrellas - actual.min, siguiente.min - actual.min)
      : 100;
    return { ...actual, indice, estrellas, siguiente, porcentaje, total: NIVELES_ESTRELLAS.length };
  }

  BV.nivelActual = nivelActual;

  function iniciarRacha() {
    const hoy = fechaLocal();
    if (estado.streak.last === hoy) return false;
    let nueva = 1;
    if (estado.streak.last) {
      const anterior = new Date(`${estado.streak.last}T12:00:00`);
      const actual = new Date(`${hoy}T12:00:00`);
      const dias = Math.round((actual - anterior) / 86400000);
      if (dias === 1) nueva = (estado.streak.count || 0) + 1;
      else if (dias <= 0) return false;
    }
    estado.streak = { count: nueva, last: hoy };
    guardar();
    return true;
  }

  /* ---------------- Logros ---------------- */
  function registrarActividad(tipo, id, estrellas = 0) {
    estado.actividad.unshift({ fecha: new Date().toISOString(), tipo, id, estrellas });
    estado.actividad = estado.actividad.slice(0, 40);
  }

  function evaluarLogros() {
    const nuevos = [];
    const nuevosDiplomas = [];

    DIPLOMAS.forEach((diploma) => {
      if (!estado.diplomas.includes(diploma.id) && diploma.comprobar(estado)) {
        estado.diplomas.push(diploma.id);
        nuevosDiplomas.push(diploma);
      }
    });

    LOGROS.forEach((logro) => {
      if (estado.logros[logro.id]) return;
      let valor = 0;
      try { valor = Number(logro.valor(estado)) || 0; } catch (e) { valor = 0; }
      if (valor >= logro.meta) {
        estado.logros[logro.id] = fechaLocal();
        if (logro.recompensa) {
          estado.stats.starsEarned += logro.recompensa;
          registrarActividad("logro", logro.id, logro.recompensa);
        }
        nuevos.push(logro);
      }
    });

    if (!nuevos.length && !nuevosDiplomas.length) return;
    guardar();
    anunciar(`Nuevos logros: ${nuevos.map((l) => l.nombre).join(", ")}`);
    if (nuevos.length || nuevosDiplomas.length) {
      confeti(46);
      sonido("victoria");
    }
    nuevos.forEach((logro, i) => {
      window.setTimeout(() => {
        toast({
          titulo: "¡Logro desbloqueado!",
          texto: `${logro.nombre}${logro.recompensa ? ` · +${logro.recompensa} estrellas` : ""}`,
          tipo: "logro", iconoNombre: logro.icono, duracion: 7000
        });
      }, 300 + i * 800);
    });
    nuevosDiplomas.forEach((diploma, i) => {
      window.setTimeout(() => {
        toast({
          titulo: "Diploma desbloqueado",
          texto: `${diploma.titulo} · Ya puedes imprimirlo en Mis logros.`,
          tipo: "logro", iconoNombre: "medalla", duracion: 7000
        });
      }, 600 + (nuevos.length + i) * 800);
    });
  }

  /* ---------------- Progreso ---------------- */
  function agregarEstrellas(n) {
    if (!n) return;
    estado.stats.starsEarned += n;
  }

  function iniciarLectura(id) {
    const recurso = buscarRecurso(id);
    if (!recurso) return;
    if (!estado.lectura[id]) {
      estado.lectura[id] = {
        percent: 0, page: 1, totalPages: recurso.paginas || 0,
        started: new Date().toISOString(), updated: new Date().toISOString(),
        completed: false
      };
      estado.stats.booksStarted += 1;
      agregarEstrellas(1);
      registrarActividad("inicio-lectura", id, 1);
      guardar();
      evaluarLogros();
    }
  }

  function actualizarLectura(id, porcentaje, extra = {}) {
    const recurso = buscarRecurso(id);
    if (!recurso) return;
    if (!estado.lectura[id]) iniciarLectura(id);
    const lectura = estado.lectura[id];
    if (!lectura) return;
    const nuevo = limitar(Math.round(porcentaje), 0, 100);
    if (nuevo > (lectura.percent || 0)) { lectura.percent = nuevo; estado.pioDias = [...new Set([...(estado.pioDias||[]),fechaLocal()])].slice(-366); }
    if (extra.page) lectura.page = extra.page;
    if (extra.totalPages) lectura.totalPages = extra.totalPages;
    lectura.updated = new Date().toISOString();
    guardar();
    if (extra.completar) completarLibro(id);
  }

  function completarLibro(id) {
    const recurso = buscarRecurso(id);
    if (!recurso) return false;
    if (!estado.lectura[id]) iniciarLectura(id);
    const lectura = estado.lectura[id];
    if (lectura.completed) {
      toast({ titulo: "Ya completaste este libro", texto: "Puedes volver a leerlo cuando quieras.", tipo: "info", iconoNombre: "checkCirculo" });
      return false;
    }
    lectura.completed = true;
    lectura.percent = 100;
    lectura.updated = new Date().toISOString();
    estado.stats.booksCompleted += 1;
    const genero = generoDe(recurso);
    if (!estado.stats.genresRead.includes(genero)) estado.stats.genresRead.push(genero);
    agregarEstrellas(8);
    registrarActividad("libro-completado", id, 8);
    guardar();
    confeti(60);
    sonido("victoria");
    toast({ titulo: "¡Libro completado!", texto: `${recurso.titulo} · +8 estrellas`, tipo: "exito", iconoNombre: "libro", duracion: 7000 });
    evaluarLogros();
    return true;
  }

  const MAPA_ESTADISTICAS_JUEGO = {
    sopa: "wordsearchCompleted",
    crucigrama: "crosswordCompleted",
    memorama: "memoryCompleted",
    trabalenguas: "tongueCompleted",
    rompecabezas: "puzzleCompleted",
    comprension: "comprehensionCompleted"
  };

  function registrarJuego(clave, datos = {}) {
    const estrellas = Number(datos.estrellas) || 0;
    estado.stats.gamesPlayed += 1;
    if (!estado.gamesCompletedList.includes(clave)) estado.gamesCompletedList.push(clave);
    const stat = MAPA_ESTADISTICAS_JUEGO[clave];
    if (stat) estado.stats[stat] = (estado.stats[stat] || 0) + 1;
    if (clave === "adivinanzas") estado.stats.riddlesCorrect += Number(datos.aciertos) || 0;
    if (datos.perfecto) estado.stats.perfectGames += 1;
    agregarEstrellas(estrellas);
    registrarActividad("juego", clave, estrellas);
    guardar();
    if (datos.silencioso !== true) {
      window.setTimeout(evaluarLogros, 400);
    }
    return estrellas;
  }

  function sumarTraba(id) {
    if (!id || estado.trabasHechas.includes(id)) return false;
    estado.trabasHechas.push(id);
    estado.stats.tongueCompleted += 1;
    agregarEstrellas(2);
    registrarActividad("traba", id, 2);
    guardar();
    toast({ titulo: "¡Reto superado!", texto: "+2 estrellas por tu trabalenguas.", tipo: "exito", iconoNombre: "boca" });
    evaluarLogros();
    return true;
  }

  BV.progreso = {
    iniciarRacha, iniciarLectura, actualizarLectura, completarLibro,
    registrarJuego, sumarTraba, evaluarLogros, agregarEstrellas, registrarActividad
  };

  /* ---------------- Portadas ---------------- */
  const PALETAS = ["violeta", "indigo", "coral", "rosa", "turquesa", "cielo", "lavanda", "lima", "dorado", "verde", "arena", "noche", "fuego"];

  function portadaHTML(recurso, opciones = {}) {
    if (!recurso) return "";
    if (recurso.portadaOriginal) return `<div class="libro3d"><div class="portada portada--edicion${opciones.mini ? " portada--mini" : ""}"><img src="${esc(recurso.portadaOriginal)}" alt="${esc(recurso.titulo)}: portada de la edición ILCE" width="420" height="596" loading="lazy" decoding="async"></div></div>`;
    const arte = recurso.portada || {};
    const paleta = PALETAS.includes(arte.paleta) ? arte.paleta : PALETAS[(recurso.id || "").length % PALETAS.length];
    const motivo = arte.motivo || "libro";
    const mini = Boolean(opciones.mini);
    const serie = recurso.serie || (recurso.acceso === "restringido" ? "Ficha de lectura" : "Biblioteca Virtual");
    const titulo = String(recurso.titulo || "");
    let claseTitulo = "";
    if (titulo.length > 56) claseTitulo = "portada__titulo--xl";
    else if (titulo.length > 34) claseTitulo = "portada__titulo--largo";
    return `
      <div class="libro3d">
        <div class="portada paleta-${paleta}${mini ? " portada--mini" : ""}" aria-hidden="true">
          <span class="portada__serie">${esc(serie)}</span>
          <span class="portada__marco"></span>
          <span class="portada__icono" style="width:90%;height:auto;aspect-ratio:8/5"><img src="assets/arte/${esc(recurso.id)}.svg" alt="" style="width:100%;height:100%;object-fit:contain;border-radius:8px"></span>
          <span class="portada__texto">
            <span class="portada__titulo ${claseTitulo}">${esc(titulo)}</span>
            <span class="portada__autor">${esc(recurso.autor || "Biblioteca Virtual")}</span>
          </span>
          <span class="portada__sello">Biblioteca Virtual</span>
        </div>
      </div>`;
  }

  BV.portadaHTML = portadaHTML;
  BV.PALETAS = PALETAS;

  /* ---------------- Arranque ---------------- */
  aplicarPreferencias();
})();
