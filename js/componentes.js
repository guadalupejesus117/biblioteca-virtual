/* ============================================================
   Biblioteca Virtual · Componentes reutilizables
   ============================================================ */
(function () {
  "use strict";
  const BV = window.BV;
  const { esc, $, $$, normalizar } = BV.util;
  const icono = BV.icono;
  const estado = () => BV.store.estado;

  const COLORES_GENERO = {
    narrativo: "#6b4de6", lirico: "#e85d87", dramatico: "#e26059", otros: "#168d82"
  };
  const COLORES_JUEGO = ["#7c5cff", "#2fb49a", "#e85d87", "#f2b134", "#e26059", "#4fa3dc", "#8bbf3f", "#9b8ce8"];

  function nivelCorto(recurso) {
    const niveles = recurso.niveles || [];
    if (!niveles.length) return "Todos";
    const nombres = niveles.map((n) => BV.datos.nivelNombre(n));
    return nombres.length > 1 ? `${nombres[0]} +${nombres.length - 1}` : nombres[0];
  }

  function miniatura(recurso) {
    return `<div class="resultado-busqueda__portada">${BV.portadaHTML(recurso, { mini: true })}</div>`;
  }

  function libroCard(recurso, opciones = {}) {
    if (!recurso) return "";
    const fav = BV.favoritos.es(recurso.id);
    const lectura = estado().lectura[recurso.id];
    const nivel = nivelCorto(recurso);
    const accesoClase = recurso.acceso === "abierto" ? "abierto" : "ficha";
    const accesoTexto = recurso.acceso === "abierto" ? (recurso.tipo === "pdf" ? "Clásico" : "Versión propia") : "Ficha";
    const indice = opciones.indice || 0;
    let progreso = "";
    if (lectura && lectura.percent > 0) {
      progreso = `<div class="progreso-mini"><span style="width:${lectura.percent}%"></span></div><small>${lectura.completed ? "Completado" : `${lectura.percent}% leído`}</small>`;
    }
    return `
      <article class="tarjeta-libro" style="--i:${indice}">
        <a class="tarjeta-libro__enlace" href="#/recurso/${esc(recurso.id)}" aria-label="${esc(recurso.titulo)}. ${esc(recurso.autor || "")}. ${esc(accesoTexto)}. ${esc(nivel)}.">
          ${BV.portadaHTML(recurso)}
          <div class="tarjeta-libro__info">
            <h3>${esc(recurso.titulo)}</h3>
            <p>${esc(recurso.autor || "Biblioteca Virtual")}</p>
            <div class="tarjeta-libro__meta">
              <span class="${accesoClase}">${icono(recurso.tipo === "pdf" ? "archivo" : recurso.acceso === "abierto" ? "libro" : "candado", "icono--xs")} ${accesoTexto}</span>
              <span>${esc(nivel)}</span>
            </div>
            ${progreso}
          </div>
        </a>
        <button type="button" class="boton-favorito" data-favorito="${esc(recurso.id)}" aria-pressed="${fav}" aria-label="${fav ? "Quitar de favoritos" : "Guardar en favoritos"}: ${esc(recurso.titulo)}">
          ${icono("corazon", "icono--sm")}
        </button>
      </article>`;
  }

  function rejillaLibros(lista, opciones = {}) {
    if (!lista.length) return estadoVacio("libro", "No encontramos lecturas", "Prueba con otros filtros o busca otra historia.");
    return `<div class="rejilla-libros">${lista.map((r, i) => libroCard(r, { ...opciones, indice: i })).join("")}</div>`;
  }

  function tarjetaJuego(juego, completado = false) {
    return `
      <a class="tarjeta-juego${completado ? " tarjeta-juego--completado" : ""}" href="${juego.ruta}" style="--j-color:${juego.color}">
        <div class="tarjeta-juego__icono">${icono(juego.icono, "icono--lg")}</div>
        <h3>${esc(juego.nombre)}</h3>
        <p>${esc(juego.descripcion)}</p>
        <div class="tarjeta-juego__pie">
          <span>${esc(juego.nivel || "Todos")}</span>
          <span class="tarjeta-juego__estado">${completado ? `${icono("checkCirculo")} Completado` : `${icono("reproducir")} Jugar`}</span>
        </div>
      </a>`;
  }

  function tarjetaGenero(genero, cantidad) {
    const color = COLORES_GENERO[genero.id] || "#6b4de6";
    const sub = (genero.subgeneros || []).slice(0, 3).map((s) => s.nombre).join(" · ");
    return `
      <a class="tarjeta-genero" href="#/genero/${esc(genero.id)}" style="--g-color:${color}">
        <span class="tarjeta-genero__numero" aria-hidden="true">${String(cantidad).padStart(2, "0")}</span>
        <span class="tarjeta-genero__icono">${icono(genero.icono, "icono--lg")}</span>
        <h3>${esc(genero.nombre)}</h3>
        <p>${esc(genero.descripcion)}</p>
        <span class="tarjeta-genero__pie"><span>${esc(sub)}</span>${icono("flecha")}</span>
      </a>`;
  }

  function tarjetaNivel(nivel) {
    const colores = {
      preescolar: ["#e85d87", "#ffe7ee"],
      primaria: ["#168d82", "#dff7f2"],
      secundaria: ["#6b4de6", "#eee9ff"]
    };
    const [color, suave] = colores[nivel.id] || ["#6b4de6", "#eee9ff"];
    return `
      <article class="tarjeta-nivel" style="--nivel-color:${color};--nivel-suave:${suave}">
        <span class="tarjeta-nivel__icono">${icono(nivel.icono, "icono--lg")}</span>
        <div>
          <span class="tarjeta-nivel__edad">${esc(nivel.edad)}</span>
          <h3>${esc(nivel.nombre)}</h3>
          <p>${esc(nivel.descripcion)}</p>
        </div>
      </article>`;
  }

  function estadoVacio(iconoNombre = "libro", titulo = "Nada por aquí todavía", texto = "", accion = "") {
    return `
      <div class="estado-vacio">
        <div class="estado-vacio__icono">${icono(iconoNombre, "icono--lg")}</div>
        <h2>${esc(titulo)}</h2>
        <p>${esc(texto)}</p>
        ${accion || ""}
      </div>`;
  }

  function breadcrumbs(items) {
    return `<nav class="migas" aria-label="Ruta de navegación">${items.map((item, i) => {
      if (i === items.length - 1) return `<span aria-current="page">${esc(item.texto)}</span>`;
      return `<a href="${item.url}">${esc(item.texto)}</a>${icono("siguiente", "icono--xs")}`;
    }).join("")}</nav>`;
  }

  function etiquetaNivel(id) {
    const nivel = BV.datos.nivelInfo(id);
    return `<span class="nivel-pildora nivel-pildora--${id === "dificil" ? "dificil" : id === "medio" ? "medio" : "facil"}">${esc(nivel.nombre)}</span>`;
  }

  function botonVoz(texto, etiqueta = "Escuchar") {
    return `<button type="button" class="boton boton--suave boton--pequeno" data-voz="${esc(texto)}">${icono("volumen")} ${esc(etiqueta)}</button>`;
  }

  function estrellas(cantidad, maximo = 3, clase = "") {
    let html = "";
    for (let i = 0; i < maximo; i += 1) {
      html += `<svg class="icono ${clase}${i < cantidad ? " activa" : ""}" aria-hidden="true"><use href="assets/svg/iconos.svg#star"></use></svg>`;
    }
    return html;
  }

  function barraProgreso(porcentaje, etiqueta = "") {
    return `<div class="juego-progreso">
      <div class="juego-progreso__barra" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${porcentaje}" aria-label="${esc(etiqueta || "Progreso")}"><span style="width:${porcentaje}%"></span></div>
      <span class="juego-progreso__texto">${porcentaje}%</span>
    </div>`;
  }

  function cajaLicencia(recurso) {
    if (recurso.acceso === "restringido") {
      return `<div class="caja-licencia caja-licencia--restriccion">
        <h2>Ficha informativa · No redistribuible</h2>
        <p>${esc(recurso.licencia || "Obra protegida por derechos de autor.")}</p>
        <p>Este archivo no se publica en la biblioteca. Conservamos la ficha para orientar la búsqueda y respetar los derechos de autor. Consulta la fuente original o pide el material a tu biblioteca o escuela.</p>
      </div>`;
    }
    return `<div class="caja-licencia">
      <h2>Licencia y uso</h2>
      <p>${esc(recurso.licencia || "Contenido abierto para uso educativo.")}</p>
      ${recurso.nota ? `<p>${esc(recurso.nota)}</p>` : ""}
      ${recurso.fuente ? `<p><strong>Fuente:</strong> ${recurso.fuenteUrl ? `<a href="${esc(recurso.fuenteUrl)}" target="_blank" rel="noopener noreferrer">${esc(recurso.fuente)}</a>` : esc(recurso.fuente)}</p>` : ""}
    </div>`;
  }

  function recursosExternos() {
    return window.BV_RECURSOS.map((r) => `
      <a class="tarjeta-recurso" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">
        <strong>${esc(r.nombre)} ${icono("enlace", "icono--xs")}</strong>
        <p>${esc(r.descripcion)}</p>
        <small>${esc(r.tipo)} · ${esc(r.edad)} · ${esc(r.licencia)}</small>
      </a>`).join("");
  }

  function jsJuegoBarra() {
    return `<span class="texto-ayuda">Elige una opción para comenzar.</span>`;
  }

  function jsJuegoProgreso(porcentaje) {
    return `<div class="juego-progreso" style="max-width:150px;min-width:110px">
      <div class="juego-progreso__barra" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${porcentaje}" aria-label="Progreso del juego"><span style="width:${porcentaje}%"></span></div>
      <span class="juego-progreso__texto">${porcentaje}%</span>
    </div>`;
  }

  function estrellasHeader() {
    const total = estado().stats.starsEarned || 0;
    const el = $("#contador-estrellas");
    if (el) el.textContent = total.toLocaleString("es-MX");
    const fav = $("#contador-favoritos");
    if (fav) {
      const n = estado().favoritos.length;
      fav.textContent = n;
      fav.hidden = n === 0;
    }
  }

  function actualizarBotonFavorito(boton) {
    const id = boton.dataset.favorito;
    const activo = BV.favoritos.es(id);
    boton.setAttribute("aria-pressed", String(activo));
    const nombre = BV.datos.buscarRecurso(id)?.titulo || "este recurso";
    boton.setAttribute("aria-label", `${activo ? "Quitar de favoritos" : "Guardar en favoritos"}: ${nombre}`);
  }

  BV.componentes = {
    libroCard, rejillaLibros, tarjetaJuego, tarjetaGenero, tarjetaNivel,
    estadoVacio, breadcrumbs, etiquetaNivel, botonVoz, estrellas,
    barraProgreso, cajaLicencia, recursosExternos, estrellasHeader,
    actualizarBotonFavorito, miniatura, nivelCorto, COLORES_GENERO, COLORES_JUEGO,
    jsJuegoBarra, jsJuegoProgreso
  };
})();
