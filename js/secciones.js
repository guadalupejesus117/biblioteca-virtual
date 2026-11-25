/* ============================================================
   Biblioteca Virtual · Páginas de la biblioteca
   ============================================================ */
(function () {
  "use strict";
  const BV = window.BV;
  const U = BV.util;
  const D = BV.datos;
  const C = BV.componentes;
  const { esc, $, $$, normalizar, barajar } = U;
  const icono = BV.icono;
  const estado = () => BV.store.estado;

  const cont = (html, clase = "") => `<div class="contenedor ${clase}">${html}</div>`;
  const rutaLectura = (r) => `#/leer/${r.id}`;

  function diasDesde(inicio) {
    if (!inicio) return 0;
    const hoy = new Date(`${U.fechaLocal()}T12:00:00`);
    const antes = new Date(`${inicio}T12:00:00`);
    return Math.max(0, Math.round((hoy - antes) / 86400000));
  }

  function lecturaEnCurso() {
    return Object.entries(estado().lectura)
      .map(([id, datos]) => ({ recurso: D.buscarRecurso(id), datos }))
      .filter((x) => x.recurso && !x.datos.completed && x.datos.percent > 0)
      .sort((a, b) => String(b.datos.updated).localeCompare(String(a.datos.updated)));
  }


  const retosPio=[["Patrones","preescolar","🟡","Completa la serie: rojo, azul, rojo, azul…",["Rojo","Verde","Amarillo"],0,"Se alternan rojo y azul."],["Cuenta objetos","preescolar","🍎","Tienes 3 manzanas y recibes 2. ¿Cuántas tienes?",["4","5","6"],1,"Tres más dos son cinco."],["Sonidos iniciales","preescolar","🔤","¿Qué palabra comienza como sol?",["Luna","Mesa","Sapo"],2,"Sol y sapo comienzan con S."],["Clasifica","preescolar","🐾","¿Cuál no es un animal?",["Perro","Silla","Gato"],1,"La silla es un objeto."],["Orden temporal","primaria","⏳","¿Qué sucede primero al cultivar una planta?",["Cosechar","Sembrar","Recoger frutos"],1,"Primero se siembra."],["Detective lógico","primaria","🔎","Ana es mayor que Luis y Luis mayor que Eva. ¿Quién es menor?",["Ana","Luis","Eva"],2,"Eva es menor que Luis y Ana."],["Fracciones","primaria","🍕","Una pizza tiene 8 partes. Comes 2. ¿Qué fracción queda?",["1/4","3/4","1/2"],1,"Quedan seis octavos, equivalentes a tres cuartos."],["Sinónimos","primaria","💬","¿Qué palabra significa algo parecido a veloz?",["Rápido","Lento","Pesado"],0,"Rápido y veloz tienen significados similares."],["Ciencia cotidiana","primaria","💧","¿Por qué desaparece agua de un charco al sol?",["Se evapora","Se convierte en tierra","Se congela"],0,"El calor favorece la evaporación."],["Código secreto","secundaria","🔐","Si A=1, B=2, C=3, ¿qué suma da CAB?",["5","6","7"],1,"3+1+2=6."],["Probabilidad","secundaria","🎲","Una bolsa tiene 3 bolas rojas y 1 azul. ¿Probabilidad de azul?",["25%","50%","75%"],0,"Una de cuatro posibilidades."],["Pensamiento crítico","secundaria","🧠","Una noticia sorprendente no cita fuentes. ¿Qué haces primero?",["Compartir","Verificar fuentes independientes","Creerla por sus likes"],1,"La evidencia importa más que la popularidad."]];
  function panelPio(){const st=estado();const dias=st.pioDias||[];const hoy=U.fechaLocal();return '<section class="pio-panel"><h2>🐥 Tu aventura lectora</h2><p>'+ (dias.includes(hoy)?'¡Ya avanzaste hoy!':'¿Leemos unas páginas hoy?')+'</p><div class="pio-dias">'+Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);const k=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");return '<span>'+ (dias.includes(k)?'🔥':'○')+' '+d.toLocaleDateString("es",{weekday:"short"})+'</span>';}).join("")+'</div><p>⭐ '+st.stats.starsEarned+' estrellas · 📚 '+st.stats.booksCompleted+' libros terminados</p></section>';}
  function retosHTML(){return '<section class="pio-panel"><h2>Laboratorio de ideas</h2><p>12 retos de razonamiento, separados de la comprensión de libros.</p><div class="pio-retos">'+retosPio.map((r,i)=>'<button class="pio-reto" data-reto-pio="'+i+'" data-nivel-pio="'+r[1]+'"><strong>'+r[2]+' '+r[0]+'</strong>'+({preescolar:"Fácil",primaria:"Medio",secundaria:"Avanzado"}[r[1]])+(estado().gamesCompletedList.includes("pio-"+i)?" · ✓":"")+'</button>').join("")+'</div><div id="pio-jugar" hidden></div></section>';}
  function activarRetos(){document.querySelectorAll("[data-reto-pio]").forEach(b=>b.onclick=()=>{const i=Number(b.dataset.retoPio),r=retosPio[i],p=document.getElementById("pio-jugar");p.hidden=false;p.innerHTML='<h3>'+r[0]+'</h3><p>'+r[3]+'</p><div class="pio-opciones">'+r[4].map((x,j)=>'<button class="boton" data-respuesta="'+j+'">'+x+'</button>').join("")+'</div><p role="status"></p>';p.scrollIntoView({block:"nearest"});p.querySelectorAll("[data-respuesta]").forEach(a=>a.onclick=()=>{const out=p.querySelector("[role=status]");if(Number(a.dataset.respuesta)!==r[5]){out.textContent="Inténtalo otra vez. "+r[6];return;}out.textContent="¡Bien hecho! "+r[6];p.querySelectorAll("button").forEach(x=>x.disabled=true);if(!estado().gamesCompletedList.includes("pio-"+i)){BV.progreso.registrarJuego("pio-"+i,{estrellas:2,aciertos:1});b.textContent=r[2]+" "+r[0]+" ✓";}});});}

  function hero() {
    const abiertos = D.abiertos();
    const flotantes = [D.buscarRecurso("alicia"), D.buscarRecurso("nube"), D.buscarRecurso("poema-estrella")].filter(Boolean);
    return `
      <section class="hero">
        ${cont(`
          <div class="hero__grid">
            <div class="hero__contenido">
              <span class="hero__saludo"><span class="punto" aria-hidden="true"></span> Biblioteca abierta · sin registro · gratis</span>
              <h1>Entra a la <span class="palabra">biblioteca</span> donde las historias cobran vida.</h1>
              <p class="hero__entrada">Lee clásicos, cuentos y poemas; escucha en voz alta, resuelve retos y gana estrellas. Un espacio hecho para preescolar, primaria y secundaria.</p>
              <div class="hero__acciones">
                <a class="boton boton--primario boton--grande" href="#/biblioteca">${icono("libro")} Explorar la biblioteca</a>
                <a class="boton boton--grande" href="#/juegos">${icono("juego")} Jugar y aprender</a>
              </div>
              <div class="hero__datos">
                <span>${icono("checkCirculo")} ${abiertos.length} lecturas abiertas</span>
                <span>${icono("juego")} 20 actividades educativas</span>
                <span>${icono("accesibilidad")} Accesible para todos</span>
              </div>
            </div>
            <div class="hero__escena" id="hero-escena">
              ${flotantes.map((r, i) => `<div class="hero__libro-flotante hero__libro-flotante--${i + 1}">${BV.portadaHTML(r, { mini: true })}</div>`).join("")}
              <div class="hero__marco">
                <img src="assets/svg/hero-biblioteca.svg" alt="Ilustración de una biblioteca mágica de noche: estanterías, libros flotantes, una ventana con castillo y un búho que acompaña." width="800" height="670" fetchpriority="high">
              </div>
              <img class="hero__mascota" src="assets/svg/mascota-draco.svg" alt="Pío, el pollito lector de la biblioteca" width="148" height="148">
              <div class="hero__burbuja">¡Hola! Soy Pío. ¿Busco una historia para ti?</div>
              <div class="hero__placa"><span>${icono("libroAbierto")}</span> Abierto las 24 horas</div>
            </div>
          </div>`)}
      </section>`;
  }

  function tiraDatos() {
    const abiertos = D.abiertos().length;
    const logros = window.BV_LOGROS.length;
    return `
      <div class="contenedor">
        <div class="tira-datos" aria-label="Datos de la biblioteca">
          <div class="tira-datos__item">${icono("libroAbierto")}<div><strong>${abiertos}</strong><span>lecturas abiertas</span></div></div>
          <div class="tira-datos__item">${icono("juego")}<div><strong>20</strong><span>juegos para aprender</span></div></div>
          <div class="tira-datos__item">${icono("premio")}<div><strong>${logros}</strong><span>logros por descubrir</span></div></div>
          <div class="tira-datos__item">${icono("graduacion")}<div><strong>3</strong><span>niveles educativos</span></div></div>
        </div>
      </div>`;
  }

  function continuarSeccion() {
    const lista = lecturaEnCurso().slice(0, 3);
    if (!lista.length) return "";
    return `
      <section class="seccion seccion--compacta">
        ${cont(`
          <div class="seccion__cabecera">
            <div><span class="etiqueta">Tu lectura</span><h2>Sigue donde lo dejaste</h2></div>
            <div class="seccion__acciones"><a class="boton boton--pequeno" href="#/biblioteca">Ver biblioteca ${icono("flecha")}</a></div>
          </div>
          <div class="lista-resultados">
            ${lista.map(({ recurso, datos }) => `
              <div class="continuar">
                <div class="continuar__portada">${BV.portadaHTML(recurso, { mini: true })}</div>
                <div class="continuar__texto">
                  <h3>${esc(recurso.titulo)}</h3>
                  <p>${esc(recurso.autor)} · ${datos.completed ? "Completado" : `${datos.percent}% leído`}</p>
                  <div class="continuar__progreso"><span style="width:${datos.percent}%"></span></div>
                </div>
                <a class="boton boton--primario boton--pequeno continuar__btn" href="${rutaLectura(recurso)}">Continuar ${icono("reproduir")}</a>
              </div>`).join("")}
          </div>`)}
      </section>`;
  }

  function destacados() {
    const lista = D.abiertos().filter((r) => r.acceso === "abierto").sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0)).slice(0, 6);
    return `
      <section class="seccion">
        ${cont(`
          <div class="seccion__cabecera">
            <div><span class="etiqueta etiqueta--dorada">Selección de la casa</span><h2>Historias para empezar</h2><p>Clásicos universales y textos originales listos para leer aquí mismo.</p></div>
            <div class="seccion__acciones"><a class="boton" href="#/biblioteca">Ver todas las lecturas ${icono("flecha")}</a></div>
          </div>
          ${C.rejillaLibros(lista)}`)}
      </section>`;
  }

  function generosSeccion() {
    const generos = Object.values(window.BV_GENEROS);
    const cantidades = {};
    D.CATALOGO.forEach((r) => { const g = D.generoDe(r); cantidades[g] = (cantidades[g] || 0) + 1; });
    return `
      <section class="seccion seccion--alterna">
        ${cont(`
          <div class="seccion__cabecera">
            <div><span class="etiqueta">Explora por género</span><h2>¿Qué te apetece leer hoy?</h2><p>Cada género es una puerta distinta. Elige una y descubre sus historias, personajes y formas de contar.</p></div>
            <div class="seccion__acciones"><a class="boton boton--pequeno" href="#/generos">Conocer los géneros ${icono("flecha")}</a></div>
          </div>
          <div class="rejilla-generos">${generos.map((g) => C.tarjetaGenero(g, cantidades[g.id] || 0)).join("")}</div>`)}
      </section>`;
  }

  function nivelesSeccion() {
    return `
      <section class="seccion">
        ${cont(`
          <div class="seccion__cabecera">
            <div><span class="etiqueta etiqueta--turquesa">Para cada etapa</span><h2>Un nivel para cada lector</h2><p>Las lecturas están clasificadas por etapa educativa, no por edad exacta: cada niño y niña avanza a su propio ritmo.</p></div>
          </div>
          <div class="rejilla-niveles">${window.BV_NIVELES.map(C.tarjetaNivel).join("")}</div>`)}
      </section>`;
  }

  function juegosSeccion() {
    const juegos = D.juegosLista();
    const completados = estado().gamesCompletedList;
    return `
      <section class="seccion seccion--alterna">
        ${cont(`
          <div class="seccion__cabecera">
            <div><span class="etiqueta etiqueta--coral">Leer también es jugar</span><h2>Veinte actividades para entrenar la lectura</h2><p>Sopas de letras, crucigramas, memorama y más. Cada juego completado suma estrellas y acerca nuevos logros.</p></div>
            <div class="seccion__acciones"><a class="boton" href="#/juegos">Ver todos los juegos ${icono("flecha")}</a></div>
          </div>
          <div class="rejilla-juegos">${juegos.slice(0, 4).map((j) => C.tarjetaJuego(j, completados.includes(j.clave))).join("")}</div>`)}
      </section>`;
  }

  function citaSeccion() {
    return `
      <section class="seccion">
        ${cont(`
          <div class="cita">
            <p class="cita__texto">Leer es abrir una puerta que solo se cierra cuando tú decides. Del otro lado, siempre hay alguien esperando: un personaje, una idea o una versión de ti que aún no conocías.</p>
            <div class="cita__pie">
              <div class="cita__autor"><span>${icono("plumaEstrella")}</span> Equipo de Biblioteca Virtual</div>
              <a class="boton boton--dorado" href="#/cuentos">Encontrar mi próxima historia ${icono("flecha")}</a>
            </div>
          </div>
          <div class="rejilla-niveles" style="margin-top:22px">
            <article class="tarjeta-nivel"><span class="tarjeta-nivel__icono">${icono("accesibilidad", "icono--lg")}</span><div><h3>A tu manera</h3><p>Cambia el tamaño del texto, el contraste, el tema o la velocidad de la voz.</p></div></article>
            <article class="tarjeta-nivel"><span class="tarjeta-nivel__icono">${icono("escudo", "icono--lg")}</span><div><h3>Sin datos personales</h3><p>No hay cuentas ni rastreo. Tu progreso vive solo en este dispositivo.</p></div></article>
            <article class="tarjeta-nivel"><span class="tarjeta-nivel__icono">${icono("corazon", "icono--lg")}</span><div><h3>Hecha para compartir</h3><p>Contenido propio con licencia CC BY-SA y clásicos con uso educativo.</p></div></article>
          </div>`)}
      </section>`;
  }

  const secciones = {};

  secciones.inicio = () => ({
    titulo: "Biblioteca Virtual · Un mundo de historias para leer y jugar",
    html: `${hero()}${panelPio()}${tiraDatos()}${continuarSeccion()}${destacados()}${generosSeccion()}${nivelesSeccion()}${juegosSeccion()}${citaSeccion()}`,
    init() {
      const escena = $("#hero-escena");
      if (!escena || estado().movimiento) return;
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const marco = $(".hero__marco", escena);
      const libros = $$(".hero__libro-flotante", escena);
      escena.addEventListener("pointermove", (e) => {
        const rect = escena.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        if (marco) marco.style.transform = `rotateY(${(-4 + x * 6).toFixed(2)}deg) rotateX(${(2 - y * 5).toFixed(2)}deg)`;
        libros.forEach((libro, i) => {
          libro.style.translate = `${x * (10 + i * 5)}px ${y * (8 + i * 3)}px`;
        });
      });
      escena.addEventListener("pointerleave", () => {
        if (marco) marco.style.transform = "";
        libros.forEach((libro) => { libro.style.translate = ""; });
      });
    }
  });

  /* ---------------- Biblioteca ---------------- */
  function filtrosDesde(params) {
    return {
      genero: params.genero || "",
      nivel: params.nivel || "",
      tipo: params.tipo || "",
      acceso: params.acceso || "",
      q: params.q || "",
      orden: params.orden || "relevancia"
    };
  }

  function filtrarCatalogo(f) {
    let lista = D.CATALOGO.slice();
    if (f.genero) lista = lista.filter((r) => D.generoDe(r) === f.genero);
    if (f.nivel) lista = lista.filter((r) => (r.niveles || []).includes(f.nivel));
    if (f.tipo) lista = lista.filter((r) => r.tipo === f.tipo);
    if (f.acceso) lista = lista.filter((r) => r.acceso === f.acceso);
    if (f.q) {
      const q = normalizar(f.q);
      lista = lista.filter((r) => normalizar(`${r.titulo} ${r.autor} ${r.descripcion} ${(r.etiquetas || []).join(" ")} ${r.subgenero} ${r.genero} ${r.serie || ""}`).includes(q));
    }
    const orden = f.orden;
    if (orden === "titulo") lista.sort((a, b) => a.titulo.localeCompare(b.titulo, "es"));
    else if (orden === "autor") lista.sort((a, b) => String(a.autor).localeCompare(String(b.autor), "es"));
    else if (orden === "reciente") lista.sort((a, b) => Number(b.anio || 0) - Number(a.anio || 0));
    else if (orden === "antiguo") lista.sort((a, b) => Number(a.anio || 0) - Number(b.anio || 0));
    else lista.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0) || (a.acceso === "abierto" ? 0 : 1) - (b.acceso === "abierto" ? 0 : 1) || a.titulo.localeCompare(b.titulo, "es"));
    return lista;
  }

  secciones.biblioteca = (params) => {
    const f = filtrosDesde(params);
    const generos = Object.values(window.BV_GENEROS);
    const opciones = (nombre, valor, etiqueta, conteo, actual) => `
      <label class="filtro-opcion"><input type="radio" name="${nombre}" value="${valor}" ${actual === valor ? "checked" : ""}> ${esc(etiqueta)}${conteo !== undefined ? `<span class="conteo">${conteo}</span>` : ""}</label>`;
    const conteoGenero = (id) => id ? D.CATALOGO.filter((r) => D.generoDe(r) === id).length : D.CATALOGO.length;
    const filtrosHTML = `
      <aside class="panel-filtros" id="panel-filtros" aria-label="Filtros de la biblioteca">
        <div class="panel-filtros__cabecera"><h2>Filtros</h2><button type="button" class="boton-enlace" id="limpiar-filtros">Limpiar</button></div>
        <div class="filtro-grupo">
          <h3>Buscar</h3>
          <div class="barra-busqueda">${icono("buscar")}<input type="search" id="filtro-q" value="${esc(f.q)}" placeholder="Título, autor, tema…" aria-label="Buscar dentro de la biblioteca"></div>
        </div>
        <div class="filtro-grupo">
          <h3>Género</h3>
          ${opciones("genero", "", "Todos", D.CATALOGO.length, f.genero)}
          ${generos.map((g) => opciones("genero", g.id, g.nombre, conteoGenero(g.id), f.genero)).join("")}
        </div>
        <div class="filtro-grupo">
          <h3>Nivel</h3>
          ${opciones("nivel", "", "Todos", undefined, f.nivel)}
          ${window.BV_NIVELES.map((n) => opciones("nivel", n.id, n.nombre, D.CATALOGO.filter((r) => (r.niveles || []).includes(n.id)).length, f.nivel)).join("")}
        </div>
        <div class="filtro-grupo">
          <h3>Tipo de recurso</h3>
          ${opciones("tipo", "", "Todos", undefined, f.tipo)}
          ${opciones("tipo", "pdf", "Clásicos", 13, f.tipo)}
          ${opciones("tipo", "texto", "Texto", 18, f.tipo)}
          ${opciones("tipo", "ficha", "Ficha", 24, f.tipo)}
        </div>
        <div class="filtro-grupo">
          <h3>Disponibilidad</h3>
          ${opciones("acceso", "", "Todo el catálogo", undefined, f.acceso)}
          ${opciones("acceso", "abierto", "Abierto para leer", 31, f.acceso)}
          ${opciones("acceso", "restringido", "Solo ficha", 24, f.acceso)}
        </div>
        <div class="filtro-grupo">
          <h3>Ordenar por</h3>
          <select id="filtro-orden" class="filtro-select" aria-label="Ordenar resultados">
            <option value="relevancia" ${f.orden === "relevancia" ? "selected" : ""}>Recomendados</option>
            <option value="titulo" ${f.orden === "titulo" ? "selected" : ""}>Título (A-Z)</option>
            <option value="autor" ${f.orden === "autor" ? "selected" : ""}>Autor (A-Z)</option>
            <option value="reciente" ${f.orden === "reciente" ? "selected" : ""}>Más recientes</option>
            <option value="antiguo" ${f.orden === "antiguo" ? "selected" : ""}>Más antiguos</option>
          </select>
        </div>
      </aside>`;

    return {
      titulo: "Biblioteca · Biblioteca Virtual",
      html: `
        <section class="portada-pagina">${cont(`
          <div class="portada-pagina__interior">
            <div>
              ${C.breadcrumbs([{ texto: "Inicio", url: "#/inicio" }, { texto: "Biblioteca" }])}
              <h1>La biblioteca completa</h1>
              <p>Encuentra clásicos, cuentos, poemas, leyendas, teatro y fichas informativas. Filtra por género, nivel o disponibilidad; los recursos con candado solo muestran su ficha por derechos de autor.</p>
            </div>
            <button type="button" class="boton filtros-movil" id="btn-filtros-movil" aria-expanded="false" aria-controls="panel-filtros">${icono("filtro")} Filtros</button>
          </div>`)}
        </section>
        <section class="seccion seccion--compacta" style="padding-top:0">
          ${cont(`<div class="biblioteca-layout">
            ${filtrosHTML}
            <div class="biblioteca-resultados">
              <div class="biblioteca-resultados__barra">
                <p id="resultado-conteo" aria-live="polite"></p>
                <div class="chips-activos" id="chips-filtros"></div>
              </div>
              <div id="resultados-biblioteca"></div>
            </div>
          </div>`)}
        </section>`,
      init() {
        const resultados = $("#resultados-biblioteca");
        const conteo = $("#resultado-conteo");
        const chips = $("#chips-filtros");
        const panel = $("#panel-filtros");
        const filtroQ = $("#filtro-q");
        let temporizador = null;

        const leer = () => ({
          genero: $('input[name="genero"]:checked')?.value || "",
          nivel: $('input[name="nivel"]:checked')?.value || "",
          tipo: $('input[name="tipo"]:checked')?.value || "",
          acceso: $('input[name="acceso"]:checked')?.value || "",
          q: filtroQ.value.trim(),
          orden: $("#filtro-orden").value
        });

        const actualizarURL = (f) => {
          const p = new URLSearchParams();
          ["genero", "nivel", "tipo", "acceso", "q", "orden"].forEach((k) => {
            if (f[k] && !(k === "orden" && f[k] === "relevancia")) p.set(k, f[k]);
          });
          const query = p.toString();
          history.replaceState(null, "", `#/biblioteca${query ? `?${query}` : ""}`);
        };

        const etiquetasFiltro = (f) => {
          const items = [];
          if (f.genero) items.push({ clave: "genero", texto: D.generoInfo(f.genero).nombre });
          if (f.nivel) items.push({ clave: "nivel", texto: D.nivelNombre(f.nivel) });
          if (f.tipo) items.push({ clave: "tipo", texto: f.tipo === "pdf" ? "PDF" : f.tipo === "texto" ? "Texto" : "Ficha" });
          if (f.acceso) items.push({ clave: "acceso", texto: f.acceso === "abierto" ? "Abiertos" : "Solo ficha" });
          if (f.q) items.push({ clave: "q", texto: `“${f.q}”` });
          if (!items.length) return "";
          return items.map((i) => `<span class="chip-filtro">${esc(i.texto)}<button type="button" data-quitar="${i.clave}" aria-label="Quitar filtro ${esc(i.texto)}">${icono("cerrar", "icono--xs")}</button></span>`).join("") +
            `<button type="button" class="boton-enlace" id="quitar-todos">Quitar todos</button>`;
        };

        const aplicar = () => {
          const f = leer();
          const lista = filtrarCatalogo(f);
          resultados.innerHTML = C.rejillaLibros(lista);
          conteo.innerHTML = `<strong>${lista.length}</strong> ${lista.length === 1 ? "recurso encontrado" : "recursos encontrados"}`;
          chips.innerHTML = etiquetasFiltro(f);
          actualizarURL(f);
        };

        const limpiar = () => {
          $$('input[name="genero"], input[name="nivel"], input[name="tipo"], input[name="acceso"]', panel).forEach((i) => { i.checked = i.value === ""; });
          filtroQ.value = "";
          $("#filtro-orden").value = "relevancia";
          aplicar();
        };

        panel.addEventListener("change", (e) => {
          if (e.target.matches('input[type="radio"], #filtro-orden')) aplicar();
        });
        filtroQ.addEventListener("input", () => {
          window.clearTimeout(temporizador);
          temporizador = window.setTimeout(aplicar, 220);
        });
        $("#limpiar-filtros").addEventListener("click", limpiar);
        chips.addEventListener("click", (e) => {
          const quitar = e.target.closest("[data-quitar]");
          const todos = e.target.closest("#quitar-todos");
          if (todos) { limpiar(); return; }
          if (!quitar) return;
          const clave = quitar.dataset.quitar;
          if (clave === "q") filtroQ.value = "";
          else {
            $$(`input[name="${clave}"]`, panel).forEach((i) => { i.checked = i.value === ""; });
          }
          aplicar();
          document.activeElement?.blur();
        });
        const btnMovil = $("#btn-filtros-movil");
        if (btnMovil) btnMovil.addEventListener("click", () => {
          const abierto = panel.classList.toggle("abierto");
          btnMovil.setAttribute("aria-expanded", String(abierto));
        });
        aplicar();
      }
    };
  };

  /* ---------------- Búsqueda ---------------- */
  secciones.buscar = (params) => {
    const q = (params.q || "").trim();
    const resultados = q ? filtrarCatalogo({ q, orden: "relevancia" }) : [];
    const sugerencias = ["clásicos", "poesía", "misterio", "animales", "teatro", "preescolar", "leyendas", "valores"];
    const juegos = q ? D.juegosLista().filter((j) => normalizar(j.nombre + " " + j.descripcion).includes(normalizar(q))) : [];
    return {
      titulo: `Buscar${q ? `: ${q}` : ""} · Biblioteca Virtual`,
      html: `
        <section class="portada-pagina">${cont(`
          ${C.breadcrumbs([{ texto: "Inicio", url: "#/inicio" }, { texto: "Buscar" }])}
          <h1>Buscar en la biblioteca</h1>
          <p>Busca por título, autor, tema o palabra clave. También puedes encontrar juegos por su nombre.</p>
          <form class="barra-busqueda" id="form-busqueda-pagina" role="search" style="max-width:620px;margin-top:20px">
            ${icono("buscar")}
            <input type="search" name="q" value="${esc(q)}" placeholder="Ejemplo: dragón, poesía, Alicia…" aria-label="Término de búsqueda" autofocus>
          </form>
          <div class="chips-activos" style="margin-top:14px">${sugerencias.map((s) => `<a class="chip-filtro" href="#/buscar?q=${encodeURIComponent(s)}" style="text-decoration:none">${esc(s)}</a>`).join("")}</div>`)}
        </section>
        <section class="seccion seccion--compacta" style="padding-top:0">
          ${cont(q ? `
            <p style="color:var(--tinta-suave)"><strong>${resultados.length}</strong> ${resultados.length === 1 ? "resultado" : "resultados"} para “${esc(q)}”</p>
            ${resultados.length ? C.rejillaLibros(resultados) : C.estadoVacio("buscar", "No encontramos esa historia", "Revisa la ortografía o prueba una palabra más general.", `<a class="boton" href="#/biblioteca">Ver toda la biblioteca</a>`)}
            ${juegos.length ? `<h2 style="margin-top:40px">Juegos relacionados</h2><div class="rejilla-juegos">${juegos.map((j) => C.tarjetaJuego(j, estado().gamesCompletedList.includes(j.clave))).join("")}</div>` : ""}
          ` : C.estadoVacio("buscar", "¿Qué historia buscas?", "Escribe un título, un autor o un tema. Prueba con las sugerencias de arriba."))}
        </section>`,
      init() {
        const form = $("#form-busqueda-pagina");
        if (form) form.addEventListener("submit", (e) => {
          e.preventDefault();
          const valor = new FormData(form).get("q").toString().trim();
          location.hash = valor ? `#/buscar?q=${encodeURIComponent(valor)}` : "#/buscar";
        });
      }
    };
  };

  /* ---------------- Géneros ---------------- */
  secciones.generos = () => {
    const generos = Object.values(window.BV_GENEROS);
    const cantidades = {};
    D.CATALOGO.forEach((r) => { const g = D.generoDe(r); cantidades[g] = (cantidades[g] || 0) + 1; });
    return {
      titulo: "Géneros literarios · Biblioteca Virtual",
      html: `
        <section class="portada-pagina">${cont(`
          ${C.breadcrumbs([{ texto: "Inicio", url: "#/inicio" }, { texto: "Géneros" }])}
          <span class="etiqueta">Cuatro formas de contar</span>
          <h1>Géneros literarios</h1>
          <p>La literatura se organiza en grandes familias. Conocerlas te ayuda a elegir lo que quieres leer y a entender cómo está construida una historia.</p>`)}
        </section>
        <section class="seccion seccion--compacta" style="padding-top:0">
          ${cont(`<div class="rejilla-generos">${generos.map((g) => C.tarjetaGenero(g, cantidades[g.id] || 0)).join("")}</div>`)}
        </section>
        <section class="seccion seccion--alterna">
          ${cont(`
            <div class="seccion__cabecera"><div><span class="etiqueta etiqueta--turquesa">Subgéneros</span><h2>Dentro de cada familia</h2><p>Un mismo género puede vestirse de muchas maneras.</p></div></div>
            <div class="rejilla-niveles">${generos.map((g) => `
              <article class="tarjeta-nivel">
                <span class="tarjeta-nivel__icono">${icono(g.icono, "icono--lg")}</span>
                <div><h3>${esc(g.nombre)}</h3><p>${g.subgeneros.map((s) => `<strong>${esc(s.nombre)}:</strong> ${esc(s.descripcion)}`).join("<br>")}</p></div>
              </article>`).join("")}</div>`)}
        </section>
        <section class="seccion">${cont(nivelesSeccion().replace(/^[\s\S]*?<div class="contenedor">/, "").replace(/<\/div>$/, ""))}</section>`
    };
  };

  secciones.genero = (id) => {
    const genero = D.generoInfo(id);
    if (!D.GENEROS[id]) return secciones.noEncontrado();
    const lista = D.CATALOGO.filter((r) => D.generoDe(r) === id);
    const color = { narrativo: "#6b4de6", lirico: "#e85d87", dramatico: "#e26059", otros: "#168d82" }[id] || "#6b4de6";
    return {
      titulo: `${genero.nombre} · Biblioteca Virtual`,
      html: `
        <section class="portada-pagina">${cont(`
          ${C.breadcrumbs([{ texto: "Inicio", url: "#/inicio" }, { texto: "Géneros", url: "#/generos" }, { texto: genero.nombre }])}
          <div class="hero-genero" style="--g-color:${color}">
            <span class="hero-genero__icono">${icono(genero.icono, "icono--xl")}</span>
            <h1>${esc(genero.nombre)}</h1>
            <p>${esc(genero.descripcion)}</p>
            <div class="subgeneros">${genero.subgeneros.map((s) => `<span>${icono(s.icono, "icono--xs")} ${esc(s.nombre)}</span>`).join("")}</div>
          </div>`)}
        </section>
        <section class="seccion seccion--compacta">
          ${cont(`
            <div class="seccion__cabecera"><div><span class="etiqueta">${lista.length} recursos</span><h2>Lecturas de ${esc(genero.nombre.toLowerCase())}</h2><p>${esc(genero.eslogan)}</p></div><a class="boton" href="#/biblioteca?genero=${id}">Filtrar en la biblioteca ${icono("flecha")}</a></div>
            ${C.rejillaLibros(lista)}`)}
        </section>`
    };
  };

  /* ---------------- Cuentos ---------------- */
  secciones.cuentos = () => {
    const lista = D.abiertos().filter((r) => D.generoDe(r) === "narrativo");
    const destacado = D.buscarRecurso("nube") || lista[0];
    return {
      titulo: "Cuentos y narraciones · Biblioteca Virtual",
      html: `
        <section class="portada-pagina">${cont(`
          ${C.breadcrumbs([{ texto: "Inicio", url: "#/inicio" }, { texto: "Cuentos" }])}
          <span class="etiqueta etiqueta--coral">Para leer en voz alta</span>
          <h1>Cuentos y narraciones</h1>
          <p>Historias breves para los primeros lectores, clásicos para soñar despiertos y relatos que invitan a preguntar “¿y después qué pasó?”.</p>`)}
        </section>
        <section class="seccion seccion--compacta" style="padding-top:0">
          ${cont(`
            ${destacado ? `<div class="cuento-destacado">
              <div>${BV.portadaHTML(destacado)}</div>
              <div class="cuento-destacado__texto">
                <span class="etiqueta etiqueta--dorada">Cuento original</span>
                <h2>${esc(destacado.titulo)}</h2>
                <p>${esc(destacado.descripcion)}</p>
                <div class="fila">
                  <a class="boton boton--primario" href="${rutaLectura(destacado)}">${icono("libroAbierto")} Leer ahora</a>
                  ${C.botonVoz(`${destacado.titulo}. ${destacado.descripcion}`, "Escuchar resumen")}
                  <span class="nivel-pildora nivel-pildora--facil">${esc(D.nivelNombre(destacado.niveles[0]))}</span>
                </div>
              </div>
            </div>` : ""}
            <div class="franja-cuentos">
              <a href="#/biblioteca?genero=narrativo&nivel=preescolar"><span class="etiqueta etiqueta--coral">Preescolar</span><strong>Cuentos cortos y acumulativos</strong><span>Para leer juntos, señalar dibujos y repetir palabras.</span></a>
              <a href="#/biblioteca?genero=narrativo&nivel=primaria"><span class="etiqueta">Primaria</span><strong>Clásicos y fábulas</strong><span>Aventuras con personajes que aprenden algo en el camino.</span></a>
              <a href="#/biblioteca?genero=narrativo&nivel=secundaria"><span class="etiqueta etiqueta--turquesa">Secundaria</span><strong>Leyendas y novelas</strong><span>Misterio, tradición oral e historias para pensar.</span></a>
            </div>
            <div class="seccion__cabecera"><div><span class="etiqueta">Antología abierta</span><h2>Elige un cuento</h2><p>Filtra por etapa educativa sin salir de esta página.</p></div>
              <div class="fila" role="group" aria-label="Filtrar cuentos por nivel">
                <button type="button" class="boton boton--pequeno" data-filtro-cuento="todos" aria-pressed="true">Todos</button>
                ${window.BV_NIVELES.map((n) => `<button type="button" class="boton boton--pequeno" data-filtro-cuento="${n.id}" aria-pressed="false">${esc(n.nombre)}</button>`).join("")}
              </div>
            </div>
            <div id="lista-cuentos">${C.rejillaLibros(lista)}</div>`)}
        </section>`,
      init() {
        const contenedor = $("#lista-cuentos");
        if (!contenedor) return;
        $$("[data-filtro-cuento]").forEach((boton) => {
          boton.addEventListener("click", () => {
            const filtro = boton.dataset.filtroCuento;
            $$("[data-filtro-cuento]").forEach((b) => b.setAttribute("aria-pressed", String(b === boton)));
            const filtrados = filtro === "todos" ? lista : lista.filter((r) => (r.niveles || []).includes(filtro));
            contenedor.innerHTML = C.rejillaLibros(filtrados);
            BV.sonido("clic");
          });
        });
      }
    };
  };

  /* ---------------- Juegos ---------------- */
  secciones.juegos = () => {
    const juegos = D.juegosLista();
    const completados = estado().gamesCompletedList;
    const estrellasJuegos = estado().stats.starsEarned;
    return {
      titulo: "Juegos educativos · Biblioteca Virtual",
      html: `
        <section class="portada-pagina">${cont(`
          ${C.breadcrumbs([{ texto: "Inicio", url: "#/inicio" }, { texto: "Juegos" }])}
          <span class="etiqueta etiqueta--coral">Leer también es jugar</span>
          <h1>Juegos para entrenar la lectura</h1>
          <p>Ocho retos para reconocer palabras, comprender textos, memorizar, deletrear y pensar. Cada juego completado suma estrellas; los logros se desbloquean solos.</p>
          <div class="fila" style="margin-top:16px">
            <span class="etiqueta etiqueta--dorada">${icono("estrella", "icono--xs")} ${estrellasJuegos} estrellas</span>
            <span class="etiqueta etiqueta--turquesa">${completados.length} de 20 actividades completadas</span>
            <a class="boton boton--pequeno" href="#/logros">Ver mis logros ${icono("flecha")}</a>
          </div>`)}
        </section>
        <section class="seccion seccion--compacta" style="padding-top:0">
          ${cont(`<div class="fila" role="group" aria-label="Nivel de juegos" style="margin-bottom:18px">${[["todos","Todos"],["preescolar","Kínder · Fácil"],["primaria","Primaria · Medio"],["secundaria","Secundaria · Difícil"]].map(([id,n])=>`<button type="button" class="boton boton--pequeno" data-nivel-juego="${id}" aria-pressed="${id==="todos"}">${n}</button>`).join("")}</div><div class="rejilla-juegos" id="juegos-por-nivel">${juegos.map((j) => `<div data-clave-juego="${esc(j.clave)}">${C.tarjetaJuego(j, completados.includes(j.clave))}</div>`).join("")}</div>${retosHTML()}`)}
        </section>
        <section class="seccion seccion--alterna">
          ${cont(`
            <div class="seccion__cabecera"><div><span class="etiqueta">Cómo funciona</span><h2>Jugar, aprender y volver a intentarlo</h2></div></div>
            <div class="rejilla-niveles">
              <article class="tarjeta-nivel"><span class="tarjeta-nivel__icono">${icono("dado", "icono--lg")}</span><div><h3>Elige un reto</h3><p>Puedes empezar por el que más te guste. No hay orden obligatorio ni tiempo límite.</p></div></article>
              <article class="tarjeta-nivel"><span class="tarjeta-nivel__icono">${icono("estrella", "icono--lg")}</span><div><h3>Gana estrellas</h3><p>Las estrellas miden tu esfuerzo, no tu velocidad. Repetir un juego también cuenta.</p></div></article>
              <article class="tarjeta-nivel"><span class="tarjeta-nivel__icono">${icono("medalla", "icono--lg")}</span><div><h3>Desbloquea logros</h3><p>Cada logro se guarda en este dispositivo. Algunos desbloquean diplomas imprimibles.</p></div></article>
            </div>`)}
        </section>`,
      init(){activarRetos();const grupos={preescolar:["memorama","rompecabezas","adivinanzas"],primaria:["sopa","memorama","rompecabezas","adivinanzas","trabalenguas","comprension"],secundaria:["sopa","crucigrama","trabalenguas","comprension"]};document.querySelectorAll("[data-nivel-juego]").forEach(b=>b.onclick=()=>{const n=b.dataset.nivelJuego;document.querySelectorAll("[data-nivel-juego]").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));document.querySelectorAll("[data-clave-juego]").forEach(x=>x.hidden=n!=="todos"&&!grupos[n].includes(x.dataset.claveJuego));document.querySelectorAll("[data-nivel-pio]").forEach(x=>x.hidden=n!=="todos"&&x.dataset.nivelPio!==n);});}
    };
  };

  /* ---------------- Trabalenguas ---------------- */
  secciones.trabalenguas = () => {
    const lista = window.BV_JUEGOS.trabalenguas || [];
    const hechas = estado().trabasHechas || [];
    return {
      titulo: "Trabalenguas · Biblioteca Virtual",
      html: `
        <section class="portada-pagina">${cont(`
          ${C.breadcrumbs([{ texto: "Inicio", url: "#/inicio" }, { texto: "Trabalenguas" }])}
          <span class="etiqueta etiqueta--coral">Lengua suelta</span>
          <h1>Trabalenguas para jugar con la voz</h1>
          <p>Escucha, repite y marca el ritmo. Los trabalenguas entrenan la pronunciación, la memoria y el oído. No hay prisa: primero despacio, después más rápido.</p>
          <div class="fila" style="margin-top:16px">
            <a class="boton boton--primario" href="#/juego/trabalenguas">${icono("juego")} Jugar el reto</a>
            <span class="etiqueta etiqueta--turquesa">${hechas.length} de ${lista.length} superados</span>
          </div>`)}
        </section>
        <section class="seccion seccion--compacta" style="padding-top:0">
          ${cont(`
            <div class="seccion__cabecera"><div><h2>La colección</h2><p>Filtra por dificultad y practica con calma.</p></div>
              <div class="fila" role="group" aria-label="Filtrar trabalenguas">
                <button type="button" class="boton boton--pequeno" data-filtro-traba="todos" aria-pressed="true">Todos</button>
                <button type="button" class="boton boton--pequeno" data-filtro-traba="facil" aria-pressed="false">Fácil</button>
                <button type="button" class="boton boton--pequeno" data-filtro-traba="medio" aria-pressed="false">Medio</button>
                <button type="button" class="boton boton--pequeno" data-filtro-traba="dificil" aria-pressed="false">Difícil</button>
              </div>
            </div>
            <div class="lista-trabalenguas" id="lista-trabas">
              ${lista.map((t, i) => `
                <article class="tarjeta-traba" data-nivel="${t.nivel}" data-id="${t.id}">
                  <div class="fila"><span class="nivel-pildora nivel-pildora--${t.nivel === "dificil" ? "dificil" : t.nivel === "medio" ? "medio" : "facil"}">${t.nivel === "dificil" ? "Difícil" : t.nivel === "medio" ? "Medio" : "Fácil"}</span><span class="tarjeta-traba__fuente">${esc(t.fuente)}</span></div>
                  <p class="tarjeta-traba__texto">${esc(t.texto)}</p>
                  <p style="margin:0;color:var(--tinta-suave);font-size:.8rem">${esc(t.reto)}</p>
                  <div class="tarjeta-traba__acciones">
                    <button type="button" class="boton boton--suave boton--pequeno" data-voz="${esc(t.texto)}">${icono("volumen")} Escuchar</button>
                    <button type="button" class="boton boton--pequeno" data-traba="${t.id}">${hechas.includes(t.id) ? `${icono("check")} Superado` : "Lo logré"}</button>
                  </div>
                </article>`).join("")}
            </div>`)}
        </section>`,
      init() {
        const listaEl = $("#lista-trabas");
        $$("[data-filtro-traba]").forEach((b) => b.addEventListener("click", () => {
          const nivel = b.dataset.filtroTraba;
          $$("[data-filtro-traba]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
          $$(".tarjeta-traba", listaEl).forEach((t) => { t.hidden = nivel !== "todos" && t.dataset.nivel !== nivel; });
        }));
        listaEl.addEventListener("click", (e) => {
          const boton = e.target.closest("[data-traba]");
          if (!boton) return;
          const id = boton.dataset.traba;
          if ((estado().trabasHechas || []).includes(id)) {
            BV.ui.toast({ titulo: "Ya lo superaste", texto: "Puedes repetirlo todas las veces que quieras.", iconoNombre: "checkCirculo" });
            return;
          }
          BV.progreso.sumarTraba(id);
          boton.innerHTML = `${icono("check")} Superado`;
          BV.sonido("correcto");
        });
      }
    };
  };

  /* ---------------- Adivinanzas ---------------- */
  secciones.adivinanzas = () => {
    const lista = window.BV_JUEGOS.adivinanzas || [];
    return {
      titulo: "Adivinanzas · Biblioteca Virtual",
      html: `
        <section class="portada-pagina">${cont(`
          ${C.breadcrumbs([{ texto: "Inicio", url: "#/inicio" }, { texto: "Adivinanzas" }])}
          <span class="etiqueta etiqueta--dorada">Piensa, imagina, descubre</span>
          <h1>Adivinanzas con pistas</h1>
          <p>Lee la pregunta, piensa un momento y revela la respuesta. Cada adivinanza explica por qué la solución tiene sentido: así se aprende a leer con atención.</p>
          <div class="fila" style="margin-top:16px"><a class="boton boton--primario" href="#/juego/adivinanzas">${icono("juego")} Jugar con puntuación</a></div>`)}
        </section>
        <section class="seccion seccion--compacta" style="padding-top:0">
          ${cont(`<div class="lista-adivinanzas">${lista.map((a, i) => `
            <article class="tarjeta-adivinanza" data-adivinanza="${a.id}">
              <span class="tarjeta-adivinanza__num">${String(i + 1).padStart(2, "0")}</span>
              <p class="tarjeta-adivinanza__pregunta">${esc(a.pregunta)}</p>
              <p style="margin:0;color:var(--tinta-suave);font-size:.8rem"><strong>Pista:</strong> ${esc(a.pista)}</p>
              <div class="tarjeta-adivinanza__respuesta" hidden><strong>Respuesta:</strong> ${esc(a.respuesta)}. ${esc(a.explicacion)}</div>
              <div class="tarjeta-adivinanza__pie">
                <button type="button" class="boton boton--suave boton--pequeno" data-revelar="${a.id}" aria-expanded="false">${icono("ojo")} Ver respuesta</button>
                <button type="button" class="boton boton--fantasma boton--pequeno" data-voz="${esc(a.pregunta + " " + a.pista)}">${icono("volumen")} Escuchar</button>
                ${C.etiquetaNivel(a.nivel)}
              </div>
            </article>`).join("")}</div>`)}
        </section>`,
      init() {
        $("#vista").addEventListener("click", (e) => {
          const b = e.target.closest("[data-revelar]");
          if (!b) return;
          const tarjeta = b.closest(".tarjeta-adivinanza");
          const respuesta = $(".tarjeta-adivinanza__respuesta", tarjeta);
          const oculta = respuesta.hidden;
          respuesta.hidden = !oculta;
          b.setAttribute("aria-expanded", String(oculta));
          b.innerHTML = oculta ? `${icono("ojoOff")} Ocultar` : `${icono("ojo")} Ver respuesta`;
          if (oculta) BV.sonido("correcto");
        });
      }
    };
  };

  /* ---------------- Favoritos ---------------- */
  secciones.favoritos = () => {
    const lista = estado().favoritos.map((id) => D.buscarRecurso(id)).filter(Boolean);
    return {
      titulo: "Favoritos · Biblioteca Virtual",
      html: `
        <section class="portada-pagina">${cont(`
          ${C.breadcrumbs([{ texto: "Inicio", url: "#/inicio" }, { texto: "Favoritos" }])}
          <span class="etiqueta etiqueta--coral">Tu colección personal</span>
          <h1>Mis favoritos</h1>
          <p>Los libros y las fichas que guardaste. Esta lista se queda en tu navegador; nadie más puede verla.</p>`)}
        </section>
        <section class="seccion seccion--compacta" style="padding-top:0">
          ${cont(lista.length ? `<div id="favoritos-lista">${C.rejillaLibros(lista)}</div>` : C.estadoVacio("corazon", "Tu estantería está esperando", "Pulsa el corazón de cualquier libro para guardarlo aquí.", `<a class="boton boton--primario" href="#/biblioteca">Explorar la biblioteca ${icono("flecha")}</a>`))}
        </section>`,
      init() {
        document.addEventListener("bv:favorito", (e) => {
          if (e.detail && e.detail.activo === false) {
            const boton = document.querySelector(`[data-favorito="${e.detail.id}"]`);
            const tarjeta = boton?.closest(".tarjeta-libro");
            if (tarjeta && location.hash.startsWith("#/favoritos")) {
              tarjeta.remove();
              if (!$("#favoritos-lista .tarjeta-libro")) {
                $("#vista").innerHTML = `<section class="seccion">${cont(C.estadoVacio("corazon", "Tu estantería está esperando", "Pulsa el corazón de cualquier libro para guardarlo aquí.", `<a class="boton boton--primario" href="#/biblioteca">Explorar la biblioteca ${icono("flecha")}</a>`))}</section>`;
              }
            }
          }
        });
      }
    };
  };

  /* ---------------- Logros ---------------- */
  secciones.logros = () => {
    const e = estado();
    const nivel = BV.nivelActual();
    const logros = window.BV_LOGROS;
    const diplomas = window.BV_DIPLOMAS;
    const desbloqueados = logros.filter((l) => e.logros[l.id]).length;
    const valorLogro = (l) => { try { return Math.min(Number(l.valor(e)) || 0, l.meta); } catch (err) { return 0; } };
    const stats = [
      ["booksCompleted", "Libros terminados", "libro"],
      ["booksStarted", "Libros abiertos", "libroAbierto"],
      ["gamesPlayed", "Juegos jugados", "juego"],
      ["starsEarned", "Estrellas", "estrella"],
      ["perfectGames", "Puntuaciones perfectas", "diana"],
      ["genresRead", "Géneros explorados", "brujula"]
    ];
    const valorStat = (clave) => (Array.isArray(e.stats[clave]) ? e.stats[clave].length : e.stats[clave] || 0);
    return {
      titulo: "Mis logros · Biblioteca Virtual",
      html: `
        <section class="seccion seccion--compacta">
          ${cont(`
            ${C.breadcrumbs([{ texto: "Inicio", url: "#/inicio" }, { texto: "Mis logros" }])}
            <div class="perfil-logros" style="margin-top:14px">
              <div class="anillo-nivel" style="--pct:${nivel.porcentaje}" role="img" aria-label="Nivel ${nivel.indice + 1} de ${nivel.total}: ${nivel.nombre}">
                <div class="anillo-nivel__centro"><strong>${nivel.indice + 1}</strong><span>nivel</span></div>
              </div>
              <div class="perfil-logros__info">
                <span class="etiqueta etiqueta--dorada">${icono(nivel.icono, "icono--xs")} ${esc(nivel.nombre)}</span>
                <h1>Mis logros</h1>
                <p>${desbloqueados} de ${logros.length} logros · ${diplomas.filter((d) => e.diplomas.includes(d.id)).length} de ${diplomas.length} diplomas.</p>
                <div class="perfil-logros__progreso">
                  <div class="barra"><span style="width:${nivel.porcentaje}%"></span></div>
                  <small>${nivel.siguiente ? `${nivel.siguiente.min - nivel.estrellas} estrellas para ${nivel.siguiente.nombre}` : "¡Nivel máximo alcanzado!"} · Racha: ${e.streak.count} ${e.streak.count === 1 ? "día" : "días"}</small>
                </div>
              </div>
              <div class="perfil-logros__estrellas"><strong>${icono("estrella")} ${e.stats.starsEarned}</strong><span>estrellas educativas</span></div>
            </div>
            <div class="rejilla-estadisticas">
              ${stats.map(([clave, etiqueta, ic]) => `<div class="estadistica">${icono(ic, "icono--sm")}<strong>${valorStat(clave)}</strong><span>${etiqueta}</span></div>`).join("")}
              <div style="margin-top:16px"><button type="button" class="boton boton--pequeno" id="descargar-progreso">${icono("descargar")} Descargar mi progreso en PDF</button></div>
            </div>`)}
        </section>
        <section class="hoja-progreso" id="hoja-progreso" aria-hidden="true">
          <div class="hoja-juego__cabecera"><div class="hoja-juego__marca">${icono("libroAbierto")}</div><div><span>Biblioteca Virtual · Reporte personal</span><h1>Mi progreso de lectura</h1></div></div>
          <div class="hoja-juego__datos"><span>Nombre: <i></i></span><span>Fecha: <i></i></span><span>Grupo: <i></i></span></div>
          <p class="hoja-juego__instrucciones">Este resumen se genera en tu dispositivo. No se envía a ningún servidor y puedes imprimirlo o guardarlo como PDF.</p>
          <div class="rejilla-estadisticas" style="color:#19123b">
            ${stats.map(([clave, etiqueta, ic]) => `<div class="estadistica"><strong>${valorStat(clave)}</strong><span>${etiqueta}</span></div>`).join("")}
          </div>
          <h2 style="color:#19123b;margin-top:20px">Nivel ${nivel.indice + 1}: ${esc(nivel.nombre)} · ${e.stats.starsEarned} estrellas</h2>
          <h3 style="color:#19123b">Logros desbloqueados (${desbloqueados} de ${logros.length})</h3>
          <ul style="columns:2;font-size:10pt;color:#19123b">${logros.map((l) => `<li>${e.logros[l.id] ? "★" : "☆"} ${esc(l.nombre)}</li>`).join("")}</ul>
          <h3 style="color:#19123b">Libros en curso</h3>
          <ul style="font-size:10pt;color:#19123b">${(lecturaEnCurso().length ? lecturaEnCurso() : []).slice(0, 12).map(({ recurso, datos }) => `<li>${esc(recurso.titulo)} — ${datos.percent}%</li>`).join("") || "<li>Aún no hay lecturas iniciadas.</li>"}</ul>
          <div class="hoja-juego__pie">Biblioteca Virtual · Progreso guardado solo en este dispositivo</div>
        </section>
        <section class="seccion seccion--compacta" style="padding-top:0">
          ${cont(`
            <div class="seccion__cabecera"><div><span class="etiqueta">Insignias</span><h2>Logros por descubrir</h2><p>Los logros se desbloquean al leer, jugar y explorar. No se pierden si cierras la página.</p></div></div>
            <div class="rejilla-logros">
              ${logros.map((l) => {
                const activo = Boolean(e.logros[l.id]);
                const valor = valorLogro(l);
                return `<article class="tarjeta-logro ${activo ? "" : "tarjeta-logro--bloqueado"}">
                  <span class="tarjeta-logro__icono">${icono(l.icono, "icono--lg")}</span>
                  <div style="min-width:0">
                    <h3>${esc(l.nombre)}</h3>
                    <p>${esc(l.descripcion)}</p>
                    <div class="tarjeta-logro__progreso"><span style="width:${U.pct(valor, l.meta)}%"></span></div>
                    <small style="font-size:.66rem;color:var(--tinta-tenue);font-weight:800">${activo ? "Desbloqueado" : `${valor} / ${l.meta}`}</small>
                  </div>
                  ${l.recompensa ? `<span class="tarjeta-logro__recompensa">${icono("estrella", "icono--xs")} ${l.recompensa}</span>` : ""}
                </article>`;
              }).join("")}
            </div>`)}
        </section>
        <section class="seccion seccion--alterna">
          ${cont(`
            <div class="seccion__cabecera"><div><span class="etiqueta etiqueta--dorada">Para imprimir</span><h2>Mis diplomas</h2><p>Cuando cumplas un requisito, el diploma se desbloquea. Puedes escribir tu nombre e imprimirlo; no se guarda en ningún servidor.</p></div></div>
            <div class="rejilla-diplomas">
              ${diplomas.map((d) => {
                const activo = e.diplomas.includes(d.id);
                return `<article class="tarjeta-diploma ${activo ? "" : "tarjeta-diploma--bloqueado"}">
                  <span class="tarjeta-diploma__sello">${icono(d.icono, "icono--lg")}</span>
                  <div><h3>${esc(d.titulo)}</h3><p>${esc(d.descripcion)}</p><small>${activo ? "Disponible para imprimir" : `Requisito: ${esc(d.requisito)}`}</small></div>
                  ${activo ? `<a class="boton boton--dorado boton--pequeno" href="#/diploma/${d.id}">${icono("imprimir")} Ver</a>` : `<span class="boton boton--pequeno" aria-disabled="true" style="opacity:.5;pointer-events:none">${icono("candado")} Bloqueado</span>`}
                </article>`;
              }).join("")}
            </div>`)}
        </section>`,
      init() {}
    };
  };

  secciones.diploma = (id) => {
    const diploma = window.BV_DIPLOMAS.find((d) => d.id === id);
    const e = estado();
    if (!diploma) return secciones.noEncontrado();
    if (!e.diplomas.includes(id)) {
      return {
        titulo: "Diploma bloqueado · Biblioteca Virtual",
        html: `<section class="seccion">${cont(C.estadoVacio("candado", "Este diploma aún está bloqueado", `Requisito: ${diploma.requisito}. Sigue leyendo y jugando; el diploma se desbloqueará solo.`, `<a class="boton boton--primario" href="#/logros">Volver a mis logros</a>`))}</section>`
      };
    }
    return {
      titulo: `${diploma.titulo} · Diploma`,
      html: `
        <section class="pagina-diploma">
          <div class="contenedor">
            <div class="diploma-controles">
              <a class="boton boton--pequeno" href="#/logros">${icono("atras")} Volver a mis logros</a>
              <div class="diploma-campo">
                <label for="nombre-diploma">Tu nombre (no se guarda):</label>
                <input id="nombre-diploma" type="text" maxlength="60" placeholder="Escribe tu nombre aquí" autocomplete="off">
                <button type="button" class="boton boton--primario boton--pequeno" id="imprimir-diploma">${icono("imprimir")} Imprimir</button>
              </div>
            </div>
            <div class="diploma" id="diploma">
              <div class="diploma__marca">${icono("plumaEstrella", "icono--xl")}</div>
              <span class="diploma__etiqueta">Biblioteca Virtual · Diploma</span>
              <h1 class="diploma__titulo">${esc(diploma.titulo)}</h1>
              <p class="diploma__texto">Se otorga con orgullo a</p>
              <div class="diploma__nombre" id="nombre-en-diploma">Nombre del estudiante</div>
              <p class="diploma__motivo">${esc(diploma.descripcion)}</p>
              <div class="diploma__estrellas" aria-hidden="true">★ ★ ★</div>
              <div class="diploma__pie">
                <div class="diploma__firma">Fecha<span>${U.fechaBonita(new Date())}</span></div>
                <div class="diploma__sello" aria-hidden="true">${icono("estrella", "icono--lg")}</div>
                <div class="diploma__firma">Biblioteca Virtual<span>Equipo educativo</span></div>
              </div>
            </div>
            <p class="texto-ayuda" style="text-align:center;margin-top:16px">Consejo: elige “Guardar como PDF” en la ventana de impresión para conservar una copia digital.</p>
          </div>
        </section>`,
      init() {
        const entrada = $("#nombre-diploma");
        const nombre = $("#nombre-en-diploma");
        const imprimir = $("#imprimir-diploma");
        if (entrada && nombre) entrada.addEventListener("input", () => {
          nombre.textContent = entrada.value.trim() || "Nombre del estudiante";
        });
        if (imprimir) imprimir.addEventListener("click", () => { BV.sonido("clic"); window.print(); });
      }
    };
  };

  /* ---------------- Ficha de recurso ---------------- */
  secciones.recurso = (id) => {
    const r = D.buscarRecurso(id);
    if (!r) return secciones.noEncontrado();
    const lectura = estado().lectura[id];
    const fav = BV.favoritos.es(id);
    const similares = D.CATALOGO.filter((x) => x.id !== id && D.generoDe(x) === D.generoDe(r)).slice(0, 4);
    const niveles = (r.niveles || []).map((n) => D.nivelNombre(n)).join(" · ");
    let acciones = "";
    if (r.acceso === "abierto" && (r.tipo === "pdf" || r.tipo === "texto")) {
      acciones = `
        <a class="boton boton--primario boton--grande" href="${rutaLectura(r)}">${icono("libroAbierto")} ${lectura && lectura.percent ? "Continuar leyendo" : "Leer aquí"}</a>
        <button type="button" class="boton boton--grande" data-descargar-libro="${r.id}">${icono("descargar")} Descargar PDF diseñado</button>
        <span class="texto-ayuda">El PDF se genera con el diseño de la biblioteca, capítulos y portada.</span>`;
    } else {
      acciones = `<div class="aviso">${icono("candado")}<div><p><strong>Este recurso no se distribuye en la biblioteca.</strong></p><p>La ficha conserva los datos para que puedas buscarlo en una biblioteca o escuela. Los derechos pertenecen a sus autores y editoriales.</p></div></div>`;
    }
    return {
      titulo: `${r.titulo} · Biblioteca Virtual`,
      html: `
        <section class="seccion" style="padding-top:26px">
          ${cont(`
            ${C.breadcrumbs([{ texto: "Inicio", url: "#/inicio" }, { texto: "Biblioteca", url: "#/biblioteca" }, { texto: r.titulo }])}
            <div class="ficha-recurso" style="margin-top:22px">
              <div class="ficha-recurso__arte">
                ${BV.portadaHTML(r)}
                <div class="ficha-recurso__acciones-arte">
                  <button type="button" class="boton ${fav ? "boton--suave" : ""}" data-favorito="${r.id}" aria-pressed="${fav}">${icono("corazon")} ${fav ? "En favoritos" : "Guardar en favoritos"}</button>
                  ${C.botonVoz(`${r.titulo}. ${r.descripcion}`, "Escuchar ficha")}
                </div>
                ${lectura && lectura.percent ? `<div style="margin-top:14px"><div class="progreso-mini"><span style="width:${lectura.percent}%"></span></div><small style="font-size:.7rem;color:var(--tinta-suave);font-weight:700">${lectura.completed ? "Completado" : `${lectura.percent}% leído`}</small></div>` : ""}
              </div>
              <div class="ficha-recurso__info">
                <div class="fila"><span class="etiqueta">${esc(D.subgeneroNombre(r))}</span><span class="etiqueta etiqueta--turquesa">${esc(niveles)}</span>${r.acceso === "restringido" ? `<span class="etiqueta etiqueta--coral">${icono("candado", "icono--xs")} No redistribuible</span>` : ""}</div>
                <h1>${esc(r.titulo)}</h1>
                <p class="ficha-recurso__autor">de <strong>${esc(r.autor)}</strong>${r.anio ? ` · ${esc(r.anio)}` : ""}</p>
                <p class="ficha-recurso__descripcion">${esc(r.descripcion)}</p>
                <div class="ficha-meta">
                  <div><span>Tipo</span><strong>${r.tipo === "pdf" ? "PDF" : r.tipo === "texto" ? "Texto" : "Ficha"}</strong></div>
                  <div><span>Páginas</span><strong>${r.paginas || "—"}</strong></div>
                  <div><span>Tiempo</span><strong>${esc(r.tiempo || "—")}</strong></div>
                  <div><span>Acceso</span><strong>${r.acceso === "abierto" ? "Abierto" : "Solo ficha"}</strong></div>
                </div>
                <div class="ficha-recurso__botones">${acciones}</div>
                ${C.cajaLicencia(r)}
                ${(r.etiquetas || []).length ? `<div class="etiquetas-recurso">${r.etiquetas.map((t) => `<span>${esc(t)}</span>`).join("")}</div>` : ""}
                <div class="fila" style="margin-top:18px">
                  <button type="button" class="boton boton--pequeno" data-favorito="${r.id}" aria-pressed="${fav}">${icono("corazon")} ${fav ? "En favoritos" : "Favorito"}</button>
                  <a class="boton boton--fantasma boton--pequeno" href="#/biblioteca?genero=${D.generoDe(r)}">Más de ${esc(D.generoInfo(D.generoDe(r)).nombre)} ${icono("flecha")}</a>
                </div>
              </div>
            </div>`)}
        </section>
        ${similares.length ? `<section class="seccion seccion--alterna">${cont(`<div class="seccion__cabecera"><div><span class="etiqueta">También te puede gustar</span><h2>Otras historias parecidas</h2></div></div>${C.rejillaLibros(similares)}`)}</section>` : ""}`
    };
  };

  /* ---------------- Información ---------------- */
  secciones.informacion = () => {
    const restringidos = D.CATALOGO.filter((r) => r.acceso === "restringido");
    const propios = D.CATALOGO.filter((r) => r.tipo === "texto");
    return {
      titulo: "Información, licencias y accesibilidad · Biblioteca Virtual",
      html: `
        <section class="portada-pagina">${cont(`
          ${C.breadcrumbs([{ texto: "Inicio", url: "#/inicio" }, { texto: "Información" }])}
          <span class="etiqueta">Transparencia</span>
          <h1>Información y créditos</h1>
          <p>Esta biblioteca es un proyecto educativo sin fines de lucro. Aquí explicamos cómo usarla, qué licencias tienen sus contenidos, cómo cuidamos la privacidad y qué limitaciones tiene.</p>`)}
        </section>
        <section class="seccion seccion--compacta" style="padding-top:0">
          ${cont(`
            <div class="info-layout">
              <nav class="info-indice" aria-label="Índice de información">
                <h2>En esta página</h2>
                <a href="#/informacion#como-usar">Cómo usar</a>
                <a href="#/informacion#accesibilidad">Accesibilidad</a>
                <a href="#/informacion#licencias">Licencias</a>
                <a href="#/informacion#catalogo">Catálogo y derechos</a>
                <a href="#/informacion#privacidad">Privacidad</a>
                <a href="#/informacion#creditos">Créditos</a>
                <a href="#/informacion#fuentes">Fuentes</a>
                <a href="#/informacion#faq">Preguntas frecuentes</a>
              </nav>
              <article class="info-articulo">
                <section id="como-usar"><h2>Cómo usar la biblioteca</h2>
                  <p>No necesitas crear una cuenta. Elige una lectura, ábrela y el progreso se guardará automáticamente en este navegador. En el catálogo verás dos tipos de recursos:</p>
                  <div class="info-tarjetas">
                    <div class="info-tarjeta"><h3>${icono("libroAbierto")} Abiertos para leer</h3><p>PDF y textos que podemos mostrar completos por su licencia o por ser contenido propio. Se leen dentro de la web o se descargan.</p></div>
                    <div class="info-tarjeta"><h3>${icono("candado")} Solo ficha</h3><p>Obras protegidas que no redistribuimos. Conservamos los datos para orientar la búsqueda y respetar los derechos de autor.</p></div>
                  </div>
                  <p>Puedes escuchar una lectura con el botón «Escuchar»; la voz la genera tu navegador y no se envía a internet. También puedes cambiar el tamaño del texto y el tema desde el botón de ajustes.</p>
                </section>
                <section id="accesibilidad"><h2>Accesibilidad</h2>
                  <p>La biblioteca se diseñó para usarse con teclado, lector de pantalla, pantallas táctiles y distintos niveles de visión. Estas funciones están disponibles:</p>
                  <ul>
                    <li><strong>Lectura en voz alta</strong> en español con velocidad ajustable.</li>
                    <li><strong>Tamaño del texto</strong> de 90 % a 125 %, sin romper la navegación.</li>
                    <li><strong>Tema claro, oscuro o del sistema</strong> y modo de alto contraste.</li>
                    <li><strong>Reducción de movimiento</strong> para detener animaciones y paralaje.</li>
                    <li><strong>Navegación por teclado</strong> con foco visible y enlaces de salto.</li>
                    <li><strong>Etiquetas y textos alternativos</strong> en ilustraciones y controles.</li>
                    <li><strong>Sin límites de tiempo</strong> en las actividades y opción de repetirlas.</li>
                  </ul>
                  <p>Si encuentras una barrera de accesibilidad, anótala y repórtala en el repositorio del proyecto para que podamos corregirla.</p>
                </section>
                <section id="licencias"><h2>Licencias de los contenidos</h2>
                  <table class="tabla-licencias">
                    <thead><tr><th>Contenido</th><th>Cantidad</th><th>Licencia y uso</th></tr></thead>
                    <tbody>
                      <tr><td>Clásicos en PDF de la Biblioteca Digital ILCE</td><td>13</td><td>Consulta educativa, cultural y no lucrativa citando la fuente. No se venden ni se relicencian.</td></tr>
                      <tr><td>Textos, cuentos, poemas y adaptaciones propias</td><td>${propios.length}</td><td>CC BY-SA 4.0 · Biblioteca Virtual. Puedes compartir y adaptar citando la fuente y manteniendo la misma licencia.</td></tr>
                      <tr><td>Fichas de obras protegidas</td><td>${restringidos.length}</td><td>Solo metadatos y descripción original. No se incluye el archivo ni fragmentos protegidos.</td></tr>
                      <tr><td>Ilustraciones SVG, portadas y mascota</td><td>—</td><td>Diseño original del proyecto, CC BY-SA 4.0, salvo iconos de terceros indicados en créditos.</td></tr>
                    </tbody>
                  </table>
                  <p>Las obras de dominio público pueden consultarse y compartirse según la legislación de cada país. Aun así, una edición concreta puede tener derechos de traducción, ilustración o digitalización; por eso revisamos cada archivo antes de publicarlo.</p>
                </section>
                <section id="catalogo"><h2>Catálogo y derechos de autor</h2>
                  <p>Analizamos 37 archivos PDF proporcionados. Solo publicamos los 13 que autorizan expresamente la consulta educativa no lucrativa o que son de dominio público. Los otros 24 se catalogan como fichas y sus archivos permanecen fuera de este sitio.</p>
                  <details class="acordeon">
                    <summary>Ver títulos que no se redistribuyen ${icono("abajo", "icono--xs")}</summary>
                    <div class="acordeon__cuerpo">
                      <ul>${restringidos.map((r) => `<li><strong>${esc(r.titulo)}</strong> · ${esc(r.autor)} (${esc(r.anio)}): ${esc(r.licencia)}</li>`).join("")}</ul>
                    </div>
                  </details>
                  <p>Si eres titular de derechos y consideras que algún material debe retirarse, contacta al responsable del repositorio. Retiraremos el contenido tras verificar la solicitud.</p>
                </section>
                <section id="privacidad"><h2>Privacidad</h2>
                  <p>No hay cuentas, formularios de registro, publicidad, rastreadores ni claves de API. Las estrellas, los favoritos, los logros y el progreso se guardan en <strong>LocalStorage</strong>, dentro de este dispositivo. Si borras los datos del navegador, se pierden.</p>
                  <p>Las búsquedas y la lectura en voz alta ocurren en tu equipo. La web no envía tu progreso a ningún servidor. Los enlaces a bibliotecas externas abren sitios de terceros con sus propias políticas.</p>
                  <p>El nombre que escribas en un diploma no se guarda: solo se usa para dibujarlo en pantalla mientras imprimes.</p>
                </section>
                <section id="creditos"><h2>Créditos y tecnologías</h2>
                  <div class="info-tarjetas">
                    <div class="info-tarjeta"><h3>${icono("archivo")} PDF generado</h3><p>El botón «Descargar PDF» abre la impresión del navegador. El archivo se crea con portada, índice, capítulos y tipografía propia; no es una copia del PDF original.</p></div>
                    <div class="info-tarjeta"><h3>${icono("formas")} Lucide</h3><p>Familia de iconos de código abierto, licencia ISC. Los iconos se distribuyen como sprite SVG local.</p></div>
                    <div class="info-tarjeta"><h3>${icono("texto")} Baloo 2 y Nunito</h3><p>Tipografías de Google Fonts bajo SIL Open Font License 1.1, incluidas localmente con sus licencias.</p></div>
                    <div class="info-tarjeta"><h3>${icono("paleta")} Ilustraciones</h3><p>Escenas, portadas, mascota e iconos personalizados creados para este proyecto como SVG originales.</p></div>
                  </div>
                  <p>El catálogo y los textos se basan en los archivos proporcionados; no se inventaron autores, fechas ni datos editoriales. Las descripciones y adaptaciones son redacción propia.</p>
                </section>
                <section id="fuentes"><h2>Fuentes y recursos externos</h2>
                  <p>Enlaces a bibliotecas y proyectos con licencias verificables. Revisa siempre las condiciones de cada obra concreta.</p>
                  <div class="rejilla-recursos">${C.recursosExternos()}</div>
                </section>
                <section id="faq"><h2>Preguntas frecuentes</h2>
                  <details class="acordeon"><summary>¿Necesito una cuenta? ${icono("abajo", "icono--xs")}</summary><div class="acordeon__cuerpo"><p>No. Todo el sitio funciona sin registro. El progreso se guarda en el navegador y puedes borrarlo desde Ajustes → Reiniciar mi progreso.</p></div></details>
                  <details class="acordeon"><summary>¿Por qué algunos libros no se pueden leer? ${icono("abajo", "icono--xs")}</summary><div class="acordeon__cuerpo"><p>Porque sus derechos de autor no permiten redistribuirlos. Mostramos una ficha con los datos para que puedas buscarlos legalmente en una biblioteca o en la fuente original.</p></div></details>
                  <details class="acordeon"><summary>¿Puedo usar la biblioteca sin internet? ${icono("abajo", "icono--xs")}</summary><div class="acordeon__cuerpo"><p>La web guarda en caché los archivos principales después de la primera visita, incluidos los textos de los clásicos. Aun así, la primera carga necesita conexión.</p></div></details>
                  <details class="acordeon"><summary>¿Los juegos tienen límite de tiempo? ${icono("abajo", "icono--xs")}</summary><div class="acordeon__cuerpo"><p>No. Puedes tomarte el tiempo que necesites, repetir y consultar las explicaciones. Las estrellas premian el esfuerzo y la constancia.</p></div></details>
                  <details class="acordeon"><summary>¿Cómo se calculan las estrellas? ${icono("abajo", "icono--xs")}</summary><div class="acordeon__cuerpo"><p>Completar una lectura suma 8 estrellas; abrirla por primera vez suma 1; los juegos suman entre 3 y 5; cada logro añade su recompensa. No hay compras ni canjes.</p></div></details>
                </section>
                <section id="aviso"><h2>Aviso educativo</h2>
                  <p>Biblioteca Virtual es un recurso de apoyo a la lectura. No sustituye la mediación docente ni el criterio de madres, padres y cuidadores. Algunas leyendas y relatos tradicionales incluyen temas de misterio o muerte; recomendamos acompañar la lectura según la edad y el contexto.</p>
                  <p>Los enlaces externos se verificaron al crear el proyecto, pero pueden cambiar. No alojamos contenido de terceros fuera de las obras autorizadas.</p>
                </section>
              </article>
            </div>`)}
        </section>`
    };
  };

  secciones.noEncontrado = () => ({
    titulo: "Página no encontrada · Biblioteca Virtual",
    html: `<section class="pagina-error">${cont(`<div class="pagina-error__codigo">404</div><h1>Esta página se perdió entre los libros</h1><p class="texto-suave" style="max-width:46ch;margin-inline:auto">Puede que el enlace esté mal escrito o que la historia haya cambiado de estante.</p><div class="fila" style="justify-content:center;margin-top:16px"><a class="boton boton--primario" href="#/inicio">Volver al inicio</a><a class="boton" href="#/biblioteca">Ir a la biblioteca</a></div>`)}</section>`
  });

  BV.secciones = secciones;
})();
