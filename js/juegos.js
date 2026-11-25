/* ============================================================
   Biblioteca Virtual · Juegos educativos (8 actividades)
   Cada juego genera una ficha imprimible / PDF diseñado.
   ============================================================ */
(function () {
  "use strict";
  const BV = window.BV;
  const U = BV.util;
  const { esc } = U;
  const icono = BV.icono;
  const J = window.BV_JUEGOS || {};
  const D = BV.datos;
  const C = BV.componentes;
  const estado = () => BV.store.estado;

  const ICONOS_MEMORAMA = {
    dragon: "dragon", castillo: "castillo", libro: "libro", estrella: "estrella",
    buho: "buho", llave: "llave", rosa: "flor", corona: "corona", luna: "lunaEstrella", barco: "barco"
  };

  const NOMBRES_NIVEL = { facil: "Fácil", medio: "Medio", dificil: "Difícil", preescolar: "Preescolar", primaria: "Primaria", secundaria: "Secundaria" };

 function estrellasHTML(cantidad) {
    let s = "";
    for (let i = 0; i < 3; i += 1) s += `<svg class="icono ${i < cantidad ? "activa" : ""}" aria-hidden="true"><use href="assets/svg/iconos.svg#star"></use></svg>`;
    return `<div class="resultado-juego__estrellas" aria-label="${cantidad} de 3 estrellas">${s}</div>`;
  }

  function resultado({ titulo, mensaje, estrellas, datos = [], acciones = [], nota = "" }) {
    return `<div class="resultado-juego">
      <div class="resultado-juego__icono">${icono(estrellas === 3 ? "corona" : estrellas === 2 ? "medalla" : "estrella")}</div>
      <h2>${esc(titulo)}</h2>
      <p class="resultado-juego__mensaje">${esc(mensaje)}</p>
      ${estrellasHTML(estrellas)}
      ${datos.length ? `<div class="resultado-juego__datos">${datos.map(([valor, etiqueta]) => `<div><strong>${esc(valor)}</strong><span>${esc(etiqueta)}</span></div>`).join("")}</div>` : ""}
      <div class="resultado-juego__acciones">${acciones.join("")}</div>
      ${nota ? `<p class="resultado-juego__nota">${esc(nota)}</p>` : ""}
    </div>`;
  }

  function hojaBase(titulo, instrucciones, cuerpo, clave, pie = "") {
    return `<div class="hoja-juego__cabecera">
        <div class="hoja-juego__marca">${icono("libroAbierto")}</div>
        <div><span>Biblioteca Virtual · Ficha educativa</span><h1>${esc(titulo)}</h1></div>
      </div>
      <div class="hoja-juego__datos">
        <span>Nombre: <i></i></span><span>Fecha: <i></i></span><span>Grupo: <i></i></span>
      </div>
      <p class="hoja-juego__instrucciones">${esc(instrucciones)}</p>
      ${cuerpo}
      ${pie ? `<div class="hoja-juego__pie">${pie}</div>` : `<div class="hoja-juego__pie">Biblioteca Virtual · Uso educativo gratuito · ${esc(clave)}</div>`}`;
  }

  function cabecera(clave, titulo, descripcion, acciones = "") {
    return `<section class="pagina-juego">
      <div class="contenedor">
        <div class="juego-cabecera">
          <a class="boton boton--pequeno juego-cabecera__volver" href="#/juegos">${icono("atras")} Volver</a>
          <div class="juego-cabecera__titulo"><span class="etiqueta">Juego educativo</span><h1>${esc(titulo)}</h1><p>${esc(descripcion)}</p></div>
          <div class="juego-cabecera__acciones">
            <button type="button" class="boton boton--pequeno" data-imprimir-juego>${icono("descargar")} Descargar PDF</button>
            ${acciones}
          </div>
        </div>
        <div class="juego-panel">
          <div class="juego-panel__barra" id="barra-juego"></div>
          <div class="juego-panel__cuerpo" id="cuerpo-juego"></div>
        </div>
        <section class="hoja-juego" id="hoja-juego" aria-hidden="true"></section>
      </div>
    </section>`;
  }

  function pagina(clave, titulo, descripcion, init, acciones = "") {
    const ctx = { temporizadores: [], hoja: "" };
    const obj = {
      titulo: `${titulo} · Juegos · Biblioteca Virtual`,
      html: cabecera(clave, titulo, descripcion, acciones),
      init() {
        const cuerpo = document.getElementById("cuerpo-juego");
        const barra = document.getElementById("barra-juego");
        const hoja = document.getElementById("hoja-juego");
        ctx.cuerpo = cuerpo;
        ctx.barra = barra;
        ctx.hojaEl = hoja;
        ctx.establecerBarra = (html) => { barra.innerHTML = html; };
        ctx.pintarHoja = (html) => { ctx.hoja = html; hoja.innerHTML = html; };
        ctx.after = (ms, fn) => {
          const id = window.setTimeout(() => {
            ctx.temporizadores = ctx.temporizadores.filter((x) => x !== id);
            fn();
          }, ms);
          ctx.temporizadores.push(id);
          return id;
        };
        const botonImprimir = document.querySelector("[data-imprimir-juego]");
        if (botonImprimir) botonImprimir.addEventListener("click", async () => { if(!hoja.querySelector("h1")||/Tablero disponible|Elige un|Genera la ficha/.test(hoja.textContent)){BV.ui.dialogo("Elige una actividad","<p>Selecciona un tablero o ejercicio para descargar su ficha individual.</p>");return;} try{await window.BVPDF.descargar(hoja,hoja.querySelector("h1").textContent,true);}catch(e){BV.ui.dialogo("No se pudo descargar","<p>Intenta nuevamente.</p>");} });
        init(ctx);
      },
      destruir() {
        ctx.temporizadores.forEach((id) => window.clearTimeout(id));
        document.body.classList.remove("imprimir-juego");
      }
    };
    return obj;
  }

  function selector(titulo, descripcion, tarjetas) {
    return `<div class="seccion__cabecera" style="margin-bottom:18px"><div><span class="etiqueta">Elige una opción</span><h2>${esc(titulo)}</h2><p>${esc(descripcion)}</p></div></div>
      <div class="rejilla-seleccion">${tarjetas.join("")}</div>`;
  }

  function tarjetaSeleccion(href, titulo, descripcion,pill, iconoNombre) {
    return `<a class="tarjeta-seleccion" href="${href}">
      <div class="tarjeta-seleccion__top"><span class="tarjeta-seleccion__icono">${icono(iconoNombre, "icono--lg")}</span><span class="pildora-dificultad pildora-dificultad--${pill === "Difícil" ? "dificil" : pill === "Medio" ? "medio" : "facil"}">${esc(pill)}</span></div>
      <h3>${esc(titulo)}</h3><p>${esc(descripcion)}</p>
      <span class="tarjeta-seleccion__pie">Empezar ${icono("flecha", "icono--sm")}</span>
    </a>`;
  }

  /* ============================================================
     1. Sopa de letras
     ============================================================ */
  function generarSopa(config) {
    const n = config.tamano;
    const dirs = {
      H: [0, 1], V: [1, 0], HINV: [0, -1], VINV: [-1, 0],
      DIAG: [1, 1], DIAGINV: [-1, -1], DIAGARRIBA: [-1, 1], DIAGATRAS: [1, -1]
    };
    const direcciones = (config.direcciones || ["H", "V"]).map((d) => dirs[d] || dirs.H);
    const palabras = config.palabras.slice().sort((a, b) => b.length - a.length);
    for (let intento = 0; intento < 40; intento += 1) {
      const grid = Array.from({ length: n }, () => Array(n).fill(""));
      const colocadas = [];
      let ok = true;
      palabras.forEach((palabra) => {
        if (!ok) return;
        let puesta = false;
        for (let t = 0; t < 500 && !puesta; t += 1) {
          const [dr, dc] = U.barajar(direcciones)[0];
          const r = U.aleatorio(0, n - 1);
          const c = U.aleatorio(0, n - 1);
          const celdas = [];
          for (let i = 0; i < palabra.length; i += 1) {
            const rr = r + dr * i;
            const cc = c + dc * i;
            if (rr < 0 || rr >= n || cc < 0 || cc >= n) break;
            if (grid[rr][cc] && grid[rr][cc] !== palabra[i]) break;
            celdas.push([rr, cc]);
          }
          if (celdas.length !== palabra.length) continue;
          celdas.forEach(([rr, cc], i) => { grid[rr][cc] = palabra[i]; });
          colocadas.push({ palabra, celdas });
          puesta = true;
        }
        if (!puesta) ok = false;
      });
      if (!ok) continue;
      for (let r = 0; r < n; r += 1) for (let c = 0; c < n; c += 1) if (!grid[r][c]) grid[r][c] = String.fromCharCode(65 + U.aleatorio(0, 25));
      return { grid, colocadas, n };
    }
    // Respaldo: palabras en horizontal sobre un fondo aleatorio.
    const grid = Array.from({ length: n }, () => Array(n).fill(""));
    palabras.forEach((palabra, i) => {
      for (let k = 0; k < palabra.length && k < n; k += 1) grid[i % n][k] = palabra[k];
    });
    const colocadas = palabras.map((palabra, i) => ({
      palabra,
      celdas: Array.from({ length: Math.min(palabra.length, n) }, (_, k) => [i % n, k])
    }));
    for (let r = 0; r < n; r += 1) for (let c = 0; c < n; c += 1) if (!grid[r][c]) grid[r][c] = String.fromCharCode(65 + U.aleatorio(0, 25));
    return { grid, colocadas, n };
  }

  function juegoSopa(ctx, params) {
    const configs = J.sopas || [];
    const config = configs.find((s) => s.id === params.p) || null;
    if (!config) {
      ctx.establecerBarra(`<p>Selecciona un tablero para empezar.</p>${C.jsJuegoBarra()}`);
      ctx.cuerpo.innerHTML = selector("Sopas de letras", "Cada tablero esconde ocho palabras. Arrastra desde la primera letra hasta la última, o haz clic en los dos extremos.",
        configs.map((s) => tarjetaSeleccion(`#/juego/sopa?p=${s.id}`, s.titulo, s.descripcion, NOMBRES_NIVEL[s.nivel] || "Fácil", "rompecabezas")));
      ctx.pintarHoja(hojaBase("Sopa de letras", "Encuentra las ocho palabras escondidas. Puedes unir letras en horizontal, vertical o diagonal.", "<p>Tablero disponible en la versión digital.</p>", "sopa"));
      return;
    }
    const { grid, colocadas, n } = generarSopa(config);
    const encontradas = new Set();
    let errores = 0;
    let ancla = null;
    let seleccion = [];
    let arrastreInicio = null;
    let arrastrando = false;
    let ignorarClicHasta = 0;

    ctx.establecerBarra(`<p><strong>${esc(config.titulo)}</strong> · ${colocadas.length} palabras</p><span class="juego-puntos">${icono("estrella")}<span class="juego-puntos__numero" id="sopa-encontradas">0</span>/${colocadas.length}</span>`);
    ctx.cuerpo.innerHTML = `<div class="juego-instruccion">${icono("info")}<p>Arrastra el dedo o el cursor sobre las letras para formar cada palabra. También puedes hacer clic en la primera y en la última letra.</p></div>
      <div class="sopa-layout">
        <div class="sopa-tablero-marco"><div class="sopa-tablero" id="sopa-tablero" style="--n:${n}" role="grid" aria-label="Sopa de letras de ${esc(config.titulo)}">
          ${grid.map((fila, r) => fila.map((letra, c) => `<button type="button" class="celda" data-r="${r}" data-c="${c}" role="gridcell" aria-label="Fila ${r + 1}, columna ${c + 1}, letra ${letra}">${letra}</button>`).join("")).join("")}
        </div></div>
        <aside class="sopa-palabras"><h2>Palabras</h2><ul id="sopa-lista">${colocadas.map((x) => `<li data-palabra="${x.palabra}">${esc(x.palabra)}${icono("check")}</li>`).join("")}</ul>
          <p class="sopa-leyenda">${esc(config.direcciones.includes("DIAG") ? "Pueden ir en diagonal." : "Van en horizontal y vertical.")} Si te equivocas, no pasa nada: intenta de nuevo.</p>
          <div class="fila" style="margin-top:14px"><button type="button" class="boton boton--pequeno" id="sopa-reiniciar">${icono("reiniciar")} Reiniciar</button><a class="boton boton--pequeno" href="#/juego/sopa">Otro tablero</a></div>
        </aside>
      </div>`;

    const tablero = document.getElementById("sopa-tablero");
    const lista = document.getElementById("sopa-lista");
    const contador = document.getElementById("sopa-encontradas");

    const celda = (r, c) => tablero.querySelector(`[data-r="${r}"][data-c="${c}"]`);
    const linea = (a, b) => {
      const dr = Math.sign(b.r - a.r);
      const dc = Math.sign(b.c - a.c);
      if (dr && dc && Math.abs(b.r - a.r) !== Math.abs(b.c - a.c)) return [];
      if (!dr && !dc) return [a];
      const pasos = Math.max(Math.abs(b.r - a.r), Math.abs(b.c - a.c));
      const salida = [];
      for (let i = 0; i <= pasos; i += 1) salida.push({ r: a.r + dr * i, c: a.c + dc * i });
      return salida;
    };
    const pintarSeleccion = () => {
      tablero.querySelectorAll(".celda.seleccion").forEach((x) => x.classList.remove("seleccion"));
      seleccion.forEach(({ r, c }) => celda(r, c)?.classList.add("seleccion"));
    };
    const confirmar = (celdas) => {
      if (!celdas.length) return;
      const texto = celdas.map(({ r, c }) => grid[r][c]).join("");
      const invertido = texto.split("").reverse().join("");
      const encontrada = colocadas.find((x) => !encontradas.has(x.palabra) && (x.palabra === texto || x.palabra === invertido));
      if (encontrada) {
        const celdasFinales = texto === encontrada.palabra ? celdas : celdas.slice().reverse();
        celdasFinales.forEach(({ r, c }) => celda(r, c)?.classList.add("encontrada"));
        encontradas.add(encontrada.palabra);
        const li = lista.querySelector(`[data-palabra="${encontrada.palabra}"]`);
        if (li) li.classList.add("encontrada");
        contador.textContent = String(encontradas.size);
        BV.sonido("correcto");
        if (encontradas.size === colocadas.length) terminar();
      } else {
        errores += 1;
        celdas.forEach(({ r, c }) => celda(r, c)?.classList.add("error"));
        ctx.after(300, () => celdas.forEach(({ r, c }) => celda(r, c)?.classList.remove("error")));
        BV.sonido("error");
      }
      ancla = null;
      seleccion = [];
      pintarSeleccion();
    };
    const terminar = () => {
      const pct = U.pct(colocadas.length, colocadas.length + errores);
      const estrellas = U.estrellasPara(pct);
      BV.progreso.registrarJuego("sopa", { estrellas, perfecto: errores === 0 });
      ctx.pintarHoja(hojaBase(`Sopa de letras · ${config.titulo}`, config.descripcion,
        `<div class="sopa-tablero-impreso" style="--n:${n}">${grid.map((fila) => fila.map((letra) => `<span>${letra}</span>`).join("")).join("")}</div>
         <div class="hoja-lista-palabras">${colocadas.map((x) => `<span>${esc(x.palabra)}</span>`).join("")}</div>
         <div class="hoja-solucion"><h2>Solución</h2><p>${colocadas.map((x) => esc(x.palabra)).join(" · ")}</p></div>`, "sopa"));
      ctx.cuerpo.innerHTML = resultado({
        titulo: "¡Tablero resuelto!",
        mensaje: `Encontraste las ${colocadas.length} palabras${errores ? ` con ${errores} intentos fallidos` : " sin equivocarte"}.`,
        estrellas,
        datos: [[colocadas.length, "palabras"], [errores, "errores"]],
        acciones: [`<button type="button" class="boton boton--primario" id="sopa-otra">Jugar otra sopa</button>`, `<a class="boton" href="#/juegos">Volver a juegos</a>`]
      });
      document.getElementById("sopa-otra").addEventListener("click", () => { location.hash = "#/juego/sopa"; });
      BV.ui.confeti();
    };

    tablero.addEventListener("pointerdown", (e) => {
      const boton = e.target.closest(".celda");
      if (!boton || Date.now() < ignorarClicHasta) return;
      arrastreInicio = { r: Number(boton.dataset.r), c: Number(boton.dataset.c) };
      arrastrando = false;
    });
    tablero.addEventListener("pointermove", (e) => {
      if (!arrastreInicio) return;
      const destino = document.elementFromPoint(e.clientX, e.clientY)?.closest(".celda");
      if (!destino || !tablero.contains(destino)) return;
      const final = { r: Number(destino.dataset.r), c: Number(destino.dataset.c) };
      if (final.r === arrastreInicio.r && final.c === arrastreInicio.c && !arrastrando) return;
      arrastrando = true;
      ancla = arrastreInicio;
      const candidata = linea(ancla, final);
      if (candidata.length !== seleccion.length || candidata.some((x, i) => x.r !== seleccion[i].r || x.c !== seleccion[i].c)) {
        seleccion = candidata;
        pintarSeleccion();
      }
    });
    tablero.addEventListener("pointerup", () => {
      arrastreInicio = null;
      if (!arrastrando) return;
      arrastrando = false;
      if (seleccion.length > 1) {
        confirmar(seleccion);
        ignorarClicHasta = Date.now() + 350;
      }
    });
    tablero.addEventListener("click", (e) => {
      const boton = e.target.closest(".celda");
      if (!boton || Date.now() < ignorarClicHasta) return;
      const actual = { r: Number(boton.dataset.r), c: Number(boton.dataset.c) };
      if (!ancla) { ancla = actual; seleccion = [actual]; pintarSeleccion(); return; }
      if (ancla.r === actual.r && ancla.c === actual.c) return;
      confirmar(linea(ancla, actual));
    });
    document.getElementById("sopa-reiniciar").addEventListener("click", () => { location.hash = `#/juego/sopa?p=${config.id}&r=${Date.now()}`; });
    ctx.pintarHoja(hojaBase(`Sopa de letras · ${config.titulo}`, config.descripcion,
      `<div class="sopa-tablero-impreso" style="--n:${n}">${grid.map((fila) => fila.map((letra) => `<span>${letra}</span>`).join("")).join("")}</div>
       <div class="hoja-lista-palabras">${colocadas.map((x) => `<span>${esc(x.palabra)}</span>`).join("")}</div>
       <div class="hoja-solucion"><h2>Solución para el docente</h2><p>${colocadas.map((x) => esc(x.palabra)).join(" · ")}</p></div>`, "sopa"));
  }

  /* ============================================================
     2. Crucigrama
     ============================================================ */
  function juegoCrucigrama(ctx, params) {
    const configs = J.crucigramas || [];
    const config = configs.find((c) => c.id === params.p) || null;
    if (!config) {
      ctx.establecerBarra(`<p>Elige un crucigrama.</p>${C.jsJuegoBarra()}`);
      ctx.cuerpo.innerHTML = selector("Crucigramas", "Lee cada pista y escribe la respuesta en las casillas cruzadas.",
        configs.map((c) => tarjetaSeleccion(`#/juego/crucigrama?p=${c.id}`, c.titulo, `${c.palabras.length} pistas · ${c.filas} × ${c.columnas}`, NOMBRES_NIVEL[c.nivel] || "Fácil", "cuadricula")));
      ctx.pintarHoja(hojaBase("Crucigrama", "Completa las palabras usando las pistas.", "<p>Elige un crucigrama en la versión digital para generar su ficha.</p>", "crucigrama"));
      return;
    }
    const celdas = {};
    config.palabras.forEach((p) => {
      for (let i = 0; i < p.answer.length; i += 1) {
        const r = p.row + (p.dir === "V" ? i : 0);
        const c = p.col + (p.dir === "H" ? i : 0);
        celdas[`${r},${c}`] = celdas[`${r},${c}`] || { r, c, letra: p.answer[i], nums: [] };
        if (i === 0) celdas[`${r},${c}`].nums.push(p.num);
      }
    });
    const lista = Object.values(celdas).sort((a, b) => a.r - b.r || a.c - b.c);
    const porClave = {};
    lista.forEach((celda) => { porClave[`${celda.r},${celda.c}`] = celda; });
    let errores = 0;
    let pistas = 0;
    let terminado = false;

    ctx.establecerBarra(`<p><strong>${esc(config.titulo)}</strong> · ${config.palabras.length} pistas</p><span class="juego-puntos">${icono("estrella")} <span id="cruci-estado">Sin comprobar</span></span>`);
    ctx.cuerpo.innerHTML = `<div class="juego-instruccion">${icono("info")}<p>Escribe una letra por casilla. Usa Tab o las flechas para moverte. Comprueba cuando termines: puedes corregir sin límite de intentos.</p></div>
      <div class="crucigrama-layout">
        <div class="crucigrama-marco"><div class="crucigrama-tablero" id="cruci-tablero" style="--rows:${config.filas};--cols:${config.columnas}">
          ${Array.from({ length: config.filas }, (_, r) => Array.from({ length: config.columnas }, (_, c) => {
            const celda = porClave[`${r},${c}`];
            if (!celda) return `<div class="crucigrama-celda crucigrama-celda--bloque"></div>`;
            return `<div class="crucigrama-celda crucigrama-celda--letra" data-rc="${r},${c}">
              ${celda.nums.length ? `<span class="num">${celda.nums[0]}</span>` : ""}
              <input type="text" maxlength="1" inputmode="text" autocomplete="off" aria-label="Fila ${r + 1}, columna ${c + 1}" data-rc="${r},${c}">
            </div>`;
          }).join("")).join("")}
        </div></div>
        <aside class="crucigrama-pistas"><h2>Pistas</h2><ol>${config.palabras.map((p) => `<li data-pista="${p.num}"><strong>${p.num}.</strong> ${esc(p.clue)}</li>`).join("")}</ol>
          <div class="fila" style="margin-top:16px">
            <button type="button" class="boton boton--primario boton--pequeno" id="cruci-comprobar">${icono("check")} Comprobar</button>
            <button type="button" class="boton boton--pequeno" id="cruci-pista">${icono("idea")} Pista</button>
            <button type="button" class="boton boton--pequeno" id="cruci-reiniciar">${icono("reiniciar")}</button>
          </div>
        </aside>
      </div>`;

    const tablero = document.getElementById("cruci-tablero");
    const inputs = Array.from(tablero.querySelectorAll("input"));
    const comprobar = () => {
      let correctas = 0;
      inputs.forEach((input) => {
        const celda = porClave[input.dataset.rc];
        const bien = U.normalizar(input.value) === U.normalizar(celda.letra);
        input.parentElement.classList.toggle("correcta", bien);
        input.parentElement.classList.toggle("incorrecta", !bien && Boolean(input.value));
        if (bien) correctas += 1;
      });
      config.palabras.forEach((p) => {
        const completa = Array.from({ length: p.answer.length }).every((_, i) => {
          const r = p.row + (p.dir === "V" ? i : 0);
          const c = p.col + (p.dir === "H" ? i : 0);
          return U.normalizar(inputs.find((x) => x.dataset.rc === `${r},${c}`)?.value || "") === p.answer[i].toLowerCase();
        });
        document.querySelector(`[data-pista="${p.num}"]`)?.classList.toggle("resuelta", completa);
      });
      document.getElementById("cruci-estado").textContent = `${correctas}/${inputs.length} letras`;
      if (correctas === inputs.length && !terminado) {
        terminado = true;
        const estrellas = errores === 0 && pistas === 0 ? 3 : errores + pistas <= 3 ? 2 : 1;
        BV.progreso.registrarJuego("crucigrama", { estrellas, perfecto: estrellas === 3 });
        ctx.pintarHoja(hojaBase(`Crucigrama · ${config.titulo}`, "Resuelve el crucigrama con las pistas. Una letra por casilla.",
          `<div class="crucigrama-impreso" style="--rows:${config.filas};--cols:${config.columnas}">${Array.from({ length: config.filas }, (_, r) => Array.from({ length: config.columnas }, (_, c) => {
            const celda = porClave[`${r},${c}`];
            return celda ? `<div><small>${celda.nums[0] || ""}</small></div>` : `<div class="vacio"></div>`;
          }).join("")).join("")}</div>
          <ol class="hoja-pistas">${config.palabras.map((p) => `<li><strong>${p.num}.</strong> ${esc(p.clue)}</li>`).join("")}</ol>
          <div class="hoja-solucion"><h2>Solución para el docente</h2><p>${config.palabras.map((p) => `${p.num}. ${esc(p.answer)}`).join(" · ")}</p></div>`, "crucigrama"));
        ctx.cuerpo.innerHTML = resultado({
          titulo: "¡Crucigrama completo!", mensaje: "Todas las palabras encajan correctamente.",
          estrellas, datos: [[config.palabras.length, "palabras"], [errores + pistas, "ayudas y errores"]],
          acciones: [`<button type="button" class="boton boton--primario" id="cruci-otro">Otro crucigrama</button>`, `<a class="boton" href="#/juegos">Volver a juegos</a>`]
        });
        document.getElementById("cruci-otro").addEventListener("click", () => { location.hash = "#/juego/crucigrama"; });
        BV.ui.confeti();
      }
    };
    document.getElementById("cruci-comprobar").addEventListener("click", () => {
      let vacias = 0;
      inputs.forEach((input) => {
        const celda = porClave[input.dataset.rc];
        const bien = U.normalizar(input.value) === U.normalizar(celda.letra);
        if (!input.value) vacias += 1;
        if (input.value && !bien) errores += 1;
      });
      if (vacias) { BV.sonido("error"); BV.ui.toast({ titulo: "Aún hay casillas vacías", texto: `Te faltan ${vacias} letras.`, iconoNombre: "info" }); }
      comprobar();
    });
    document.getElementById("cruci-pista").addEventListener("click", () => {
      const destino = inputs.find((x) => !x.value);
      if (!destino) { BV.ui.toast({ titulo: "No hay casillas vacías", texto: "Comprueba tus respuestas.", iconoNombre: "info" }); return; }
      destino.value = porClave[destino.dataset.rc].letra;
      pistas += 1;
      BV.sonido("clic");
      comprobar();
    });
    document.getElementById("cruci-reiniciar").addEventListener("click", () => { location.hash = `#/juego/crucigrama?p=${config.id}&r=${Date.now()}`; });
    tablero.addEventListener("input", (e) => {
      if (!e.target.matches("input")) return;
      e.target.value = e.target.value.toUpperCase().replace(/[^A-ZÁÉÍÓÚÑ]/g, "");
      const idx = inputs.indexOf(e.target);
      if (e.target.value && idx < inputs.length - 1) inputs[idx + 1].focus();
    });
    tablero.addEventListener("keydown", (e) => {
      if (!e.target.matches("input")) return;
      const idx = inputs.indexOf(e.target);
      const movimientos = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 0, ArrowUp: 0 };
      if (e.key.startsWith("Arrow")) {
        e.preventDefault();
        let siguiente = idx;
        if (e.key === "ArrowRight") siguiente += 1;
        else if (e.key === "ArrowLeft") siguiente -= 1;
        else {
          const actual = porClave[e.target.dataset.rc];
          const encontrado = inputs.findIndex((x) => {
            const c = porClave[x.dataset.rc];
            return e.key === "ArrowDown" ? c.c === actual.c && c.r > actual.r : c.c === actual.c && c.r < actual.r;
          });
          if (encontrado >= 0) siguiente = encontrado;
        }
        inputs[U.limitar(siguiente, 0, inputs.length - 1)]?.focus();
      }
    });
    ctx.pintarHoja(hojaBase(`Crucigrama · ${config.titulo}`, "Resuelve el crucigrama con las pistas. Una letra por casilla.",
      `<div class="crucigrama-impreso" style="--rows:${config.filas};--cols:${config.columnas}">${Array.from({ length: config.filas }, (_, r) => Array.from({ length: config.columnas }, (_, c) => {
        const celda = porClave[`${r},${c}`];
        return celda ? `<div><small>${celda.nums[0] || ""}</small></div>` : `<div class="vacio"></div>`;
      }).join("")).join("")}</div>
      <ol class="hoja-pistas">${config.palabras.map((p) => `<li><strong>${p.num}.</strong> ${esc(p.clue)}</li>`).join("")}</ol>
      <div class="hoja-solucion"><h2>Solución para el docente</h2><p>${config.palabras.map((p) => `${p.num}. ${esc(p.answer)}`).join(" · ")}</p></div>`, "crucigrama"));
  }

  /* ============================================================
     3. Memorama
     ============================================================ */
  function juegoMemorama(ctx, params) {
    const total = U.limitar(Number(params.n) || 6, 4, 10);
    const pares = U.barajar((J.memorama?.pares || []).slice(0, total));
    const baraja = U.barajar(pares.flatMap((p) => [
      { id: p.id, nombre: p.nombre, icono: p.icono, lado: "a" },
      { id: p.id, nombre: p.nombre, icono: p.icono, lado: "b" }
    ]));
    let abiertas = [];
    let emparejadas = new Set();
    let movimientos = 0;
    let bloqueado = false;
    let terminado = false;

    ctx.establecerBarra(`<p><strong>Memorama</strong> · ${pares.length} parejas</p><span class="juego-puntos">${icono("reiniciar")} <span id="memo-mov">0</span> movimientos</span>`);
    ctx.cuerpo.innerHTML = `<div class="juego-instruccion">${icono("info")}<p>Voltea dos cartas. Si los dibujos coinciden, se quedan descubiertas; si no, vuelven a girar. Recuerda su posición.</p></div>
      <div class="memorama-barra"><p>${pares.length} parejas por encontrar</p><div class="selector-dificultad" role="group" aria-label="Número de parejas">
        ${[6, 8, 10].map((n) => `<button type="button" data-memo-n="${n}" aria-pressed="${n === total}">${n} pares</button>`).join("")}
      </div></div>
      <div class="memorama-tablero" id="memo-tablero" style="--cols:${total <= 6 ? 4 : total <= 8 ? 4 : 5}">
        ${baraja.map((carta, i) => `<button type="button" class="carta-memoria" data-i="${i}" data-id="${carta.id}" aria-pressed="false" aria-label="Carta ${i + 1}, sin descubrir">
          <span class="carta-memoria__interior">
            <span class="carta-memoria__cara carta-memoria__dorso">${icono("chispas")}</span>
            <span class="carta-memoria__cara carta-memoria__frente">${icono(ICONOS_MEMORAMA[carta.icono] || "estrella")}<span class="carta-memoria__nombre">${esc(carta.nombre)}</span></span>
          </span>
        </button>`).join("")}
      </div>`;
    const tablero = document.getElementById("memo-tablero");
    const contador = document.getElementById("memo-mov");
    const terminar = () => {
      const pct = U.pct(pares.length, movimientos);
      const estrellas = U.estrellasPara(pct);
      BV.progreso.registrarJuego("memorama", { estrellas, perfecto: estrellas === 3 });
      ctx.pintarHoja(hojaBase("Memorama · Pares de la biblioteca", "Recorta las tarjetas, voltéalas boca abajo y empareja los dibujos iguales.",
        `<div class="hoja-memorama">${pares.map((p) => `<div><span>${icono(ICONOS_MEMORAMA[p.icono] || "estrella")}</span><strong>${esc(p.nombre)}</strong></div>`).join("")}</div>
         <div class="hoja-solucion"><h2>Respuesta</h2><p>${pares.map((p) => esc(p.nombre)).join(" · ")}</p></div>`, "memorama"));
      ctx.cuerpo.innerHTML = resultado({
        titulo: "¡Memoria de elefante!", mensaje: `Encontraste las ${pares.length} parejas en ${movimientos} movimientos.`,
        estrellas, datos: [[movimientos, "movimientos"], [pares.length, "parejas"]],
        acciones: [`<button type="button" class="boton boton--primario" id="memo-otra">Jugar de nuevo</button>`, `<a class="boton" href="#/juegos">Volver a juegos</a>`]
      });
      document.getElementById("memo-otra").addEventListener("click", () => { location.hash = `#/juego/memorama?n=${total}&r=${Date.now()}`; });
      BV.ui.confeti();
    };
    tablero.addEventListener("click", (e) => {
      const boton = e.target.closest(".carta-memoria");
      if (!boton || bloqueado || boton.classList.contains("emparejada") || boton.getAttribute("aria-pressed") === "true") return;
      boton.setAttribute("aria-pressed", "true");
      abiertas.push(boton);
      if (abiertas.length < 2) return;
      movimientos += 1;
      contador.textContent = String(movimientos);
      const [a, b] = abiertas;
      if (a.dataset.id === b.dataset.id) {
        a.classList.add("carta-memoria--emparejada");
        b.classList.add("carta-memoria--emparejada");
        emparejadas.add(a.dataset.id);
        abiertas = [];
        BV.sonido("correcto");
        if (emparejadas.size === pares.length && !terminado) {
        terminado = true;
        terminar();
      }
      } else {
        bloqueado = true;
        BV.sonido("error");
        ctx.after(900, () => {
          [a, b].forEach((x) => x.setAttribute("aria-pressed", "false"));
          abiertas = [];
          bloqueado = false;
        });
      }
    });
    document.querySelectorAll("[data-memo-n]").forEach((b) => b.addEventListener("click", () => {
      location.hash = `#/juego/memorama?n=${b.dataset.memoN}`;
    }));
    ctx.pintarHoja(hojaBase("Memorama · Pares de la biblioteca", "Recorta las tarjetas, voltéalas boca abajo y empareja los dibujos iguales.",
      `<div class="hoja-memorama">${pares.map((p) => `<div><span>${icono(ICONOS_MEMORAMA[p.icono] || "estrella")}</span><strong>${esc(p.nombre)}</strong></div>`).join("")}</div>
       <div class="hoja-solucion"><h2>Respuesta</h2><p>${pares.map((p) => esc(p.nombre)).join(" · ")}</p></div>`, "memorama"));
  }

  /* ============================================================
     4. Adivinanzas
     ============================================================ */
  function juegoAdivinanzas(ctx) {
    const preguntas = U.barajar((J.adivinanzas || []).slice()).slice(0, 8);
    let indice = 0;
    let aciertos = 0;
    let respondido = false;
    let pistaVista = false;

    const pintar = () => {
      if (indice >= preguntas.length) {
        const pct = U.pct(aciertos, preguntas.length);
        const estrellas = U.estrellasPara(pct);
        BV.progreso.registrarJuego("adivinanzas", { estrellas, aciertos, perfecto: aciertos === preguntas.length });
        ctx.pintarHoja(hojaBase("Adivinanzas con pistas", "Lee cada adivinanza y escribe tu respuesta en la línea. Después compara con la solución.",
          `<ol class="hoja-preguntas">${preguntas.map((a) => `<li>${esc(a.pregunta)}<div class="hoja-linea"></div><div class="hoja-linea corta"></div></li>`).join("")}</ol>
           <div class="hoja-solucion"><h2>Soluciones</h2><ol>${preguntas.map((a) => `<li>${esc(a.respuesta)} — ${esc(a.explicacion)}</li>`).join("")}</ol></div>`, "adivinanzas"));
        ctx.cuerpo.innerHTML = resultado({
          titulo: "¡Mente afilada!", mensaje: `Acertaste ${aciertos} de ${preguntas.length} adivinanzas.`,
          estrellas, datos: [[aciertos, "aciertos"], [preguntas.length, "adivinanzas"]],
          acciones: [`<button type="button" class="boton boton--primario" id="adi-otra">Jugar de nuevo</button>`, `<a class="boton" href="#/adivinanzas">Ver la colección</a>`]
        });
        document.getElementById("adi-otra").addEventListener("click", () => { location.hash = `#/juego/adivinanzas?r=${Date.now()}`; });
        BV.ui.confeti();
        return;
      }
      const a = preguntas[indice];
      const opciones = U.barajar(a.alternativas.slice());
      respondido = false;
      pistaVista = false;
      ctx.establecerBarra(`<p><strong>Adivinanza ${indice + 1}</strong> de ${preguntas.length}</p><span class="juego-puntos">${icono("estrella")} ${aciertos}</span>${C.jsJuegoProgreso(U.pct(indice, preguntas.length))}`);
      ctx.cuerpo.innerHTML = `<div class="adivinanza-juego">
        <div class="adivinanza-juego__cabecera"><span>Nivel ${esc(NOMBRES_NIVEL[a.nivel] || a.nivel)}</span><button type="button" class="boton boton--suave boton--pequeno" id="adi-voz">${icono("volumen")} Escuchar</button></div>
        <div class="adivinanza-juego__pregunta"><p>${esc(a.pregunta)}</p></div>
        <div class="opciones-adivinanza" id="adi-opciones">${opciones.map((op, i) => `<button type="button" class="opcion-adivinanza" data-op="${esc(op)}"><span class="opcion-adivinanza__letra">${String.fromCharCode(65 + i)}</span>${esc(op)}</button>`).join("")}</div>
        <div class="juego-instruccion" id="adi-pista" hidden style="margin-top:16px">${icono("idea")}<p><strong>Pista:</strong> ${esc(a.pista)}</p></div>
        <div id="adi-retro"></div>
        <div class="adivinanza-juego__pie">
          <button type="button" class="boton boton--pequeno" id="adi-pista-btn">${icono("ojo")} Ver pista</button>
          <button type="button" class="boton boton--primario boton--pequeno" id="adi-siguiente" hidden>Siguiente ${icono("flecha")}</button>
        </div>
      </div>`;
      document.getElementById("adi-voz").addEventListener("click", (e) => BV.voz.hablar(`${a.pregunta} ${a.pista}`, e.currentTarget));
      document.getElementById("adi-pista-btn").addEventListener("click", (e) => {
        const caja = document.getElementById("adi-pista");
        caja.hidden = !pistaVista;
        pistaVista = !pistaVista;
        e.currentTarget.innerHTML = pistaVista ? `${icono("ojoOff")} Ocultar pista` : `${icono("ojo")} Ver pista`;
      });
      document.getElementById("adi-opciones").addEventListener("click", (e) => {
        const b = e.target.closest("[data-op]");
        if (!b || respondido) return;
        respondido = true;
        const correcto = U.normalizar(b.dataset.op) === U.normalizar(a.respuesta);
        if (correcto) aciertos += 1;
        document.querySelectorAll("#adi-opciones button").forEach((boton) => {
          boton.disabled = true;
          if (U.normalizar(boton.dataset.op) === U.normalizar(a.respuesta)) boton.classList.add("correcta");
        });
        if (!correcto) b.classList.add("incorrecta");
        document.getElementById("adi-retro").innerHTML = `<div class="retroalimentacion ${correcto ? "" : "retroalimentacion--error"}">${icono(correcto ? "checkCirculo" : "info")}<p><strong>${correcto ? "¡Correcto!" : "Respuesta: " + esc(a.respuesta)}</strong> ${esc(a.explicacion)}</p></div>`;
        document.getElementById("adi-siguiente").hidden = false;
        BV.sonido(correcto ? "correcto" : "error");
      });
      document.getElementById("adi-siguiente").addEventListener("click", () => { indice += 1; pintar(); });
    };
    ctx.pintarHoja(hojaBase("Adivinanzas con pistas", "Lee cada adivinanza y escribe tu respuesta en la línea.", `<ol class="hoja-preguntas">${preguntas.map(a=>`<li>${esc(a.pregunta)}<div class="hoja-linea"></div></li>`).join("")}</ol>`, "adivinanzas"));
    pintar();
  }

  /* ============================================================
     5. Trabalenguas
     ============================================================ */
  function juegoTrabalenguas(ctx) {
    const lista = U.barajar((J.trabalenguas || []).slice()).slice(0, 5);
    let indice = 0;
    let logrados = 0;
    const inicio = Date.now();

    const pintar = () => {
      if (indice >= lista.length) {
        const pct = U.pct(logrados, lista.length);
        const estrellas = U.estrellasPara(pct);
        BV.progreso.registrarJuego("trabalenguas", { estrellas, perfecto: logrados === lista.length });
        ctx.pintarHoja(hojaBase("Reto de trabalenguas", "Lee cada trabalenguas en voz alta, primero despacio y luego más rápido. Marca los que logres.",
          `<ol class="hoja-preguntas">${lista.map((t) => `<li>${esc(t.texto)}<div class="hoja-linea corta"></div><small>${esc(t.reto)}</small></li>`).join("")}</ol>`, "trabalenguas"));
        ctx.cuerpo.innerHTML = resultado({
          titulo: "¡Lengua suelta!", mensaje: `Superaste ${logrados} de ${lista.length} trabalenguas en ${Math.round((Date.now() - inicio) / 1000)} segundos.`,
          estrellas, datos: [[logrados, "retos"], [Math.round((Date.now() - inicio) / 1000), "segundos"]],
          acciones: [`<button type="button" class="boton boton--primario" id="tra-otra">Otro reto</button>`, `<a class="boton" href="#/trabalenguas">Ver colección</a>`]
        });
        document.getElementById("tra-otra").addEventListener("click", () => { location.hash = `#/juego/trabalenguas?r=${Date.now()}`; });
        BV.ui.confeti();
        return;
      }
      const t = lista[indice];
      ctx.establecerBarra(`<p><strong>Reto ${indice + 1}</strong> de ${lista.length}</p><span class="cronometro">${icono("cronometro")} ${Math.round((Date.now() - inicio) / 1000)} s</span>${C.jsJuegoProgreso(U.pct(indice, lista.length))}`);
      ctx.cuerpo.innerHTML = `<div class="traba-juego">
        <div class="traba-juego__tarjeta">
          <div class="traba-juego__nivel"><span class="pildora-dificultad pildora-dificultad--${t.nivel === "dificil" ? "dificil" : t.nivel === "medio" ? "medio" : "facil"}">${esc(NOMBRES_NIVEL[t.nivel])}</span></div>
          <p class="traba-juego__texto">${esc(t.texto)}</p>
          <span class="traba-juego__reto">${icono("diana")} ${esc(t.reto)}</span>
          <div class="traba-juego__acciones">
            <button type="button" class="boton boton--primario" id="tra-voz">${icono("volumen")} Escuchar</button>
            <button type="button" class="boton boton--suave" id="tra-lento">${icono("relojArena")} Más despacio</button>
          </div>
        </div>
        <div class="traba-juego__pie"><span>Fuente: ${esc(t.fuente)}</span><span class="fila"><button type="button" class="boton boton--pequeno" id="tra-saltar">Saltar</button><button type="button" class="boton boton--primario boton--pequeno" id="tra-logre">${icono("check")} Lo logré</button></span></div>
      </div>`;
      document.getElementById("tra-voz").addEventListener("click", (e) => BV.voz.hablar(t.texto, e.currentTarget));
      document.getElementById("tra-lento").addEventListener("click", () => {
        const anterior = estado().velocidadVoz;
        BV.prefs.velocidad(0.7);
        BV.voz.hablar(t.texto);
        ctx.after(2500, () => BV.prefs.velocidad(anterior));
      });
      const siguiente = (suma) => { if (suma) logrados += 1; indice += 1; pintar(); };
      document.getElementById("tra-logre").addEventListener("click", () => { BV.sonido("correcto"); siguiente(true); });
      document.getElementById("tra-saltar").addEventListener("click", () => siguiente(false));
    };
    ctx.pintarHoja(hojaBase("Reto de trabalenguas", "Lee cada trabalenguas en voz alta, primero despacio y luego más rápido.", `<ol class="hoja-preguntas">${lista.map(t=>`<li>${esc(t.texto)}<div class="hoja-linea"></div></li>`).join("")}</ol>`, "trabalenguas"));
    pintar();
  }

  /* ============================================================
     6. Rompecabezas
     ============================================================ */
  function juegoRompecabezas(ctx, params) {
    const escenas = J.rompecabezas || [];
    const escena = escenas.find((s) => s.id === params.escena) || escenas[0];
    const n = U.limitar(Number(params.n) || 3, 3, 5);
    if (!escena) return;

    let orden = Array.from({ length: n * n }, (_, i) => i);
    let vacio = n * n - 1;
    let movimientos = 0;
    let terminado = false;

    const mezclar = () => {
      orden = Array.from({ length: n * n }, (_, i) => i);
      vacio = n * n - 1;
      for (let paso = 0; paso < n * n * 24; paso += 1) {
        const vecinos = [];
        const vr = Math.floor(vacio / n);
        const vc = vacio % n;
        [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => {
          const r = vr + dr;
          const c = vc + dc;
          if (r >= 0 && r < n && c >= 0 && c < n) vecinos.push(r * n + c);
        });
        const elegido = vecinos[U.aleatorio(0, vecinos.length - 1)];
        orden[vacio] = orden[elegido];
        orden[elegido] = n * n - 1;
        vacio = elegido;
      }
      if (orden.every((v, i) => v === i)) mezclar();
      movimientos = 0;
      terminado = false;
    };
    const resuelto = () => orden.every((v, i) => v === i);

    const pintar = () => {
      ctx.establecerBarra(`<p><strong>${esc(escena.titulo)}</strong> · ${n} × ${n}</p><span class="juego-puntos">${icono("move")} <span id="pz-mov">${movimientos}</span> movimientos</span>`);
      ctx.cuerpo.innerHTML = `<div class="juego-instruccion">${icono("info")}<p>Toca una pieza junto al espacio vacío para moverla. También puedes usar las flechas del teclado. Ordena la escena completa.</p></div>
        <div class="puzzle-layout">
          <div class="puzzle-marco"><div class="puzzle-tablero" id="pz-tablero" style="--n:${n}" role="group" aria-label="Rompecabezas de ${esc(escena.titulo)}"></div></div>
          <aside class="puzzle-lado">
            <h2>Vista completa</h2><div class="puzzle-preview"><img src="assets/svg/escena-${esc(escena.escena)}.svg" alt="Escena completa: ${esc(escena.descripcion)}"></div>
            <div class="puzzle-datos"><div class="puzzle-dato"><strong>${n * n - 1}</strong><span>piezas</span></div><div class="puzzle-dato"><strong id="pz-lado-mov">${movimientos}</strong><span>movimientos</span></div></div>
            <h2>Tamaño</h2><div class="selector-dificultad" role="group" aria-label="Dificultad del rompecabezas">
              ${escena.niveles.map((t) => `<button type="button" data-pz-n="${t}" aria-pressed="${t === n}">${t} × ${t}</button>`).join("")}
            </div>
            <div class="fila" style="margin-top:6px"><button type="button" class="boton boton--pequeno" id="pz-mezclar">${icono("mezclar")} Mezclar</button><a class="boton boton--pequeno" href="#/juego/rompecabezas">Otra escena</a></div>
          </aside>
        </div>`;
      const tablero = document.getElementById("pz-tablero");
      const dibujar = () => {
        tablero.innerHTML = orden.map((valor, pos) => {
          if (valor === n * n - 1) return `<button type="button" class="pieza pieza--vacia" aria-label="Espacio vacío" tabindex="-1"></button>`;
          const fila = Math.floor(valor / n);
          const col = valor % n;
          return `<button type="button" class="pieza" data-pos="${pos}" aria-label="Pieza ${valor + 1}. Fila ${fila + 1}, columna ${col + 1}"
            style="background-image:url('assets/svg/escena-${esc(escena.escena)}.svg');background-size:${n * 100}% ${n * 100}%;background-position:${(col / (n - 1)) * 100}% ${(fila / (n - 1)) * 100}%"><span class="pieza__num">${valor + 1}</span></button>`;
        }).join("");
      };
      dibujar();
      const mover = (pos) => {
        if (terminado) return;
        const vr = Math.floor(vacio / n);
        const vc = vacio % n;
        const pr = Math.floor(pos / n);
        const pc = pos % n;
        if (Math.abs(vr - pr) + Math.abs(vc - pc) !== 1) return;
        orden[vacio] = orden[pos];
        orden[pos] = n * n - 1;
        vacio = pos;
        movimientos += 1;
        document.getElementById("pz-mov").textContent = String(movimientos);
        document.getElementById("pz-lado-mov").textContent = String(movimientos);
        dibujar();
        BV.sonido("clic");
        if (resuelto()) terminar();
      };
      tablero.addEventListener("click", (e) => {
        const pieza = e.target.closest("[data-pos]");
        if (pieza) mover(Number(pieza.dataset.pos));
      });
      tablero.addEventListener("keydown", (e) => {
        const mapa = { ArrowUp: n, ArrowDown: -n, ArrowLeft: 1, ArrowRight: -1 };
        if (!(e.key in mapa)) return;
        e.preventDefault();
        const destino = vacio + mapa[e.key];
        if (destino >= 0 && destino < n * n) mover(destino);
      });
      document.getElementById("pz-mezclar").addEventListener("click", () => { mezclar(); movimientos = 0; pintar(); });
      document.querySelectorAll("[data-pz-n]").forEach((b) => b.addEventListener("click", () => {
        location.hash = `#/juego/rompecabezas?escena=${escena.id}&n=${b.dataset.pzN}`;
      }));
    };
    const terminar = () => {
      const ideal = n * n * 4;
      const estrellas = movimientos <= ideal ? 3 : movimientos <= ideal * 1.8 ? 2 : 1;
      BV.progreso.registrarJuego("rompecabezas", { estrellas, perfecto: estrellas === 3 });
      ctx.pintarHoja(hojaBase(`Rompecabezas · ${escena.titulo}`, "Recorta las piezas y ordénalas para reconstruir la escena.",
        `<div class="puzzle-impreso"><img src="assets/svg/escena-${esc(escena.escena)}.svg" alt="Escena del rompecabezas"><div class="puzzle-rejilla" style="--n:${n}">${Array.from({ length: n * n }, () => "<span></span>").join("")}</div></div>`, "rompecabezas"));
      ctx.cuerpo.innerHTML = resultado({
        titulo: "¡Escena reconstruida!", mensaje: `Ordenaste ${n * n - 1} piezas en ${movimientos} movimientos.`,
        estrellas, datos: [[n * n - 1, "piezas"], [movimientos, "movimientos"]],
        acciones: [`<button type="button" class="boton boton--primario" id="pz-otra">Otro rompecabezas</button>`, `<a class="boton" href="#/juegos">Volver a juegos</a>`]
      });
      document.getElementById("pz-otra").addEventListener("click", () => { location.hash = "#/juego/rompecabezas"; });
      BV.ui.confeti();
    };
    mezclar();
    ctx.pintarHoja(hojaBase(`Rompecabezas · ${escena.titulo}`, "Recorta las piezas y ordénalas para reconstruir la escena.",
      `<div class="puzzle-impreso"><img src="assets/svg/escena-${esc(escena.escena)}.svg" alt="Escena del rompecabezas"><div class="puzzle-rejilla" style="--n:${n}">${Array.from({ length: n * n }, () => "<span></span>").join("")}</div></div>`, "rompecabezas"));
    pintar();
  }

  /* ============================================================
     7. Comprensión lectora
     ============================================================ */
  function juegoComprension(ctx, params) {
    const configs = J.comprension || [];
    const config = configs.find((c) => c.id === params.p) || null;
    if (!config) {
      ctx.establecerBarra(`<p>Elige un texto para leer y responder.</p>${C.jsJuegoBarra()}`);
      ctx.cuerpo.innerHTML = selector("Comprensión lectora", "Lee con atención y elige la mejor respuesta. Después verás la explicación.",
        configs.map((c) => tarjetaSeleccion(`#/juego/comprension?p=${c.id}`, c.titulo, `${c.preguntas.length} preguntas · ${c.nivel}`, NOMBRES_NIVEL[c.nivel] || "Primaria", "cerebro")));
      ctx.pintarHoja(hojaBase("Comprensión lectora", "Lee el texto y responde las preguntas.", "<p>Elige un texto en la versión digital para generar su ficha.</p>", "comprension"));
      return;
    }
    let aciertos = 0;
    ctx.establecerBarra(`<p><strong>${esc(config.titulo)}</strong> · ${config.preguntas.length} preguntas</p><span class="juego-puntos">${icono("cerebro")} Lectura activa</span>`);
    ctx.cuerpo.innerHTML = `<div class="juego-instruccion">${icono("info")}<p>Lee el texto una vez y luego responde. Puedes volver a leerlo cuantas veces necesites; no hay límite de tiempo.</p></div>
      <div class="comprension-layout">
        <article class="texto-actividad" data-texto-voz="${esc(config.texto)}">
          <h2>${esc(config.titulo)}</h2>
          <p>${esc(config.texto)}</p>
          <button type="button" class="boton boton--suave boton--pequeno" id="comp-voz">${icono("volumen")} Escuchar el texto</button>
        </article>
        <div>
          <div class="comprension-preguntas" id="comp-preguntas">
            ${config.preguntas.map((p, i) => `<fieldset class="pregunta-comprension" data-pregunta="${i}">
              <legend class="pregunta-comprension__titulo">${i + 1}. ${esc(p.pregunta)}</legend>
              ${p.opciones.map((op, j) => `<label><input type="radio" name="p${i}" value="${j}"><span>${esc(op)}</span></label>`).join("")}
              <div class="explicacion-pregunta" hidden></div>
            </fieldset>`).join("")}
          </div>
          <div class="fila" style="margin-top:16px"><button type="button" class="boton boton--primario" id="comp-comprobar">${icono("check")} Comprobar respuestas</button><button type="button" class="boton boton--pequeno" id="comp-reiniciar">${icono("reiniciar")}</button></div>
        </div>
      </div>`;
    document.getElementById("comp-voz").addEventListener("click", (e) => BV.voz.hablar(config.texto, e.currentTarget));
    document.getElementById("comp-comprobar").addEventListener("click", () => {
      let respondidas = 0;
      aciertos = 0;
      config.preguntas.forEach((p, i) => {
        const fieldset = document.querySelector(`[data-pregunta="${i}"]`);
        const seleccion = fieldset.querySelector("input:checked");
        if (!seleccion) { fieldset.classList.remove("correcta", "incorrecta"); return; }
        respondidas += 1;
        const bien = Number(seleccion.value) === p.correcta;
        if (bien) aciertos += 1;
        fieldset.classList.toggle("correcta", bien);
        fieldset.classList.toggle("incorrecta", !bien);
        fieldset.querySelectorAll("label").forEach((label, j) => {
          label.classList.toggle("elegida-bien", j === p.correcta);
          label.classList.toggle("elegida-mal", j === Number(seleccion.value) && !bien);
        });
        const explicacion = fieldset.querySelector(".explicacion-pregunta");
        explicacion.hidden = false;
        explicacion.innerHTML = `${icono(bien ? "checkCirculo" : "info", "icono--sm")} ${esc(p.explicacion)}`;
      });
      if (respondidas < config.preguntas.length) {
        BV.ui.toast({ titulo: "Respuestas incompletas", texto: `Respondiste ${respondidas} de ${config.preguntas.length}.`, iconoNombre: "info" });
        return;
      }
      const estrellas = U.estrellasPara(U.pct(aciertos, config.preguntas.length));
      BV.progreso.registrarJuego("comprension", { estrellas, perfecto: aciertos === config.preguntas.length });
      ctx.pintarHoja(hojaBase(`Comprensión lectora · ${config.titulo}`, "Lee el texto y responde las preguntas sin mirar las soluciones.",
        `<div class="hoja-texto">${esc(config.texto)}</div>
         <ol class="hoja-preguntas">${config.preguntas.map((p) => `<li>${esc(p.pregunta)}<div class="hoja-linea"></div><div class="hoja-linea"></div></li>`).join("")}</ol>
         <div class="hoja-solucion"><h2>Soluciones y explicaciones</h2><ol>${config.preguntas.map((p) => `<li>${esc(p.opciones[p.correcta])}. ${esc(p.explicacion)}</li>`).join("")}</ol></div>`, "comprension"));
      ctx.after(600, () => {
        ctx.cuerpo.insertAdjacentHTML("beforeend", resultado({
          titulo: aciertos === config.preguntas.length ? "¡Lectura comprendida!" : "Buen intento",
          mensaje: `Respondiste correctamente ${aciertos} de ${config.preguntas.length} preguntas.`,
          estrellas, datos: [[aciertos, "aciertos"], [config.preguntas.length, "preguntas"]],
          acciones: [`<button type="button" class="boton boton--primario" id="comp-otro">Otro texto</button>`, `<a class="boton" href="#/juegos">Volver a juegos</a>`],
          nota: "Revisa las explicaciones: leer también es aprender de los errores."
        }));
        document.getElementById("comp-otro").addEventListener("click", () => { location.hash = "#/juego/comprension"; });
        BV.ui.confeti();
      });
    });
    document.getElementById("comp-reiniciar").addEventListener("click", () => { location.hash = `#/juego/comprension?p=${config.id}&r=${Date.now()}`; });
    ctx.pintarHoja(hojaBase(`Comprensión lectora · ${config.titulo}`, "Lee el texto y responde las preguntas.",
      `<div class="hoja-texto">${esc(config.texto)}</div>
       <ol class="hoja-preguntas">${config.preguntas.map((p) => `<li>${esc(p.pregunta)}<div class="hoja-linea"></div><div class="hoja-linea"></div></li>`).join("")}</ol>
       <div class="hoja-solucion"><h2>Soluciones y explicaciones</h2><ol>${config.preguntas.map((p) => `<li>${esc(p.opciones[p.correcta])}. ${esc(p.explicacion)}</li>`).join("")}</ol></div>`, "comprension"));
  }

  /* ============================================================
     8. Completa la palabra
     ============================================================ */
  function juegoCompleta(ctx) {
    const palabras = U.barajar((J.completa || []).slice()).slice(0, 8);
    let indice = 0;
    let aciertos = 0;
    let errores = 0;
    const inicio = Date.now();

    const pintar = () => {
      if (indice >= palabras.length) {
        const pct = U.pct(aciertos, palabras.length);
        const estrellas = U.estrellasPara(pct);
        BV.progreso.registrarJuego("completa", { estrellas, perfecto: aciertos === palabras.length });
        ctx.pintarHoja(hojaBase("Completa la palabra", "Usa las letras del banco para completar cada palabra. Escribe tu nombre y fecha.",
          `<ol class="hoja-preguntas">${palabras.map((p) => `<li>${esc(p.pista)}<div class="hoja-linea"></div><small>${esc(p.categoria)} · ${esc(NOMBRES_NIVEL[p.nivel])}</small></li>`).join("")}</ol>
           <div class="hoja-solucion"><h2>Soluciones</h2><p>${palabras.map((p) => esc(p.palabra)).join(" · ")}</p></div>`, "completa"));
        ctx.cuerpo.innerHTML = resultado({
          titulo: "¡Palabras construidas!", mensaje: `Completaste ${aciertos} de ${palabras.length} palabras en ${Math.round((Date.now() - inicio) / 1000)} s.`,
          estrellas, datos: [[aciertos, "palabras"], [errores, "errores"]],
          acciones: [`<button type="button" class="boton boton--primario" id="com-otra">Jugar de nuevo</button>`, `<a class="boton" href="#/juegos">Volver a juegos</a>`]
        });
        document.getElementById("com-otra").addEventListener("click", () => { location.hash = `#/juego/completa?r=${Date.now()}`; });
        BV.ui.confeti();
        return;
      }
      const item = palabras[indice];
      const letras = item.palabra.split("");
      const reveladas = new Set(Array.from({ length: Math.max(1, Math.floor(letras.length / 3)) }, (_, i) => i === 0 ? 0 : U.aleatorio(1, letras.length - 1)));
      const faltan = letras.filter((_, i) => !reveladas.has(i));
      const banco = U.barajar(faltan);
      ctx.establecerBarra(`<p><strong>Palabra ${indice + 1}</strong> de ${palabras.length}</p><span class="juego-puntos">${icono("estrella")} ${aciertos}</span>${C.jsJuegoProgreso(U.pct(indice, palabras.length))}`);
      ctx.cuerpo.innerHTML = `<div class="completa-juego">
        <div class="completa-pista">${icono("idea")} ${esc(item.pista)}</div>
        <div class="completa-palabra" id="com-palabra">
          ${letras.map((letra, i) => reveladas.has(i)
            ? `<span class="letra-fija">${esc(letra)}</span>`
            : `<label class="letra-slot" aria-label="Letra ${i + 1}"><input type="text" maxlength="1" inputmode="text" autocomplete="off" data-slot="${i}" aria-label="Letra ${i + 1} de ${letras.length}"></label>`).join("")}
        </div>
        <div class="banco-letras" id="com-banco">${banco.map((letra, i) => `<button type="button" class="letra-banco" data-letra="${esc(letra)}" data-banco="${i}" aria-label="Letra ${esc(letra)}">${esc(letra)}</button>`).join("")}</div>
        <div class="completa-acciones">
          <button type="button" class="boton boton--primario" id="com-comprobar">${icono("check")} Comprobar</button>
          <button type="button" class="boton boton--pequeno" id="com-borrar">${icono("reiniciar")} Borrar</button>
        </div>
        <div id="com-retro"></div>
      </div>`;
      const slots = Array.from(document.getElementById("com-palabra").querySelectorAll("input"));
      const usados = new Set();
      document.getElementById("com-banco").addEventListener("click", (e) => {
        const boton = e.target.closest(".letra-banco");
        if (!boton || boton.classList.contains("usada")) return;
        const libre = slots.find((s) => !s.value);
        if (!libre) return;
        libre.value = boton.dataset.letra;
        boton.classList.add("usada");
        usados.add(boton.dataset.banco);
        libre.focus();
      });
      document.getElementById("com-borrar").addEventListener("click", () => {
        slots.forEach((s) => { s.value = ""; });
        document.querySelectorAll(".letra-banco").forEach((b) => b.classList.remove("usada"));
        usados.clear();
      });
      document.getElementById("com-comprobar").addEventListener("click", () => {
        if (slots.some((s) => !s.value)) {
          BV.ui.toast({ titulo: "Faltan letras", texto: "Completa todos los espacios antes de comprobar.", iconoNombre: "info" });
          return;
        }
        const bien = slots.every((s) => U.normalizar(s.value) === U.normalizar(letras[Number(s.dataset.slot)]));
        if (bien) {
          aciertos += 1;
          BV.sonido("correcto");
          slots.forEach((s) => s.parentElement.classList.add("correcta"));
          document.getElementById("com-retro").innerHTML = `<div class="retroalimentacion">${icono("checkCirculo")}<p><strong>¡Correcto!</strong> ${esc(item.palabra)}</p></div>`;
          ctx.after(1100, () => { indice += 1; pintar(); });
        } else {
          errores += 1;
          BV.sonido("error");
          slots.forEach((s) => s.parentElement.classList.toggle("incorrecta", U.normalizar(s.value) !== U.normalizar(letras[Number(s.dataset.slot)])));
          document.getElementById("com-retro").innerHTML = `<div class="retroalimentacion retroalimentacion--error">${icono("info")}<p>Revisa las letras marcadas. Puedes borrar y volver a intentarlo.</p></div>`;
        }
      });
    };
    ctx.pintarHoja(hojaBase("Completa la palabra", "Usa las letras del banco para completar cada palabra.", `<ol class="hoja-preguntas">${palabras.map(p=>`<li>${esc(p.pista)}<div class="hoja-linea"></div></li>`).join("")}</ol>`, "completa"));
    pintar();
  }

  const JUEGOS = {
    sopa: (ctx, params) => juegoSopa(ctx, params),
    crucigrama: (ctx, params) => juegoCrucigrama(ctx, params),
    memorama: (ctx, params) => juegoMemorama(ctx, params),
    adivinanzas: (ctx) => juegoAdivinanzas(ctx),
    trabalenguas: (ctx) => juegoTrabalenguas(ctx),
    rompecabezas: (ctx, params) => juegoRompecabezas(ctx, params),
    comprension: (ctx, params) => juegoComprension(ctx, params),
    completa: (ctx) => juegoCompleta(ctx)
  };

  BV.juegos = {
    render(clave, params = {}) {
      const fn = JUEGOS[clave];
      if (!fn) return null;
      const juego = D.juegosLista().find((j) => j.clave === clave) || { nombre: clave };
      return pagina(clave, juego.nombre, juego.descripcion || "", (ctx) => fn(ctx, params));
    }
  };
})();
