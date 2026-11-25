/* ============================================================
   Biblioteca Virtual · Lector propio de textos y clásicos
   Muestra texto estructurado (nunca el PDF tal cual) y genera
   un PDF diseñado mediante la impresión del navegador.
   ============================================================ */
(function () {
  "use strict";
  const BV = window.BV;
  const U = BV.util;
  const D = BV.datos;
  const { esc } = U;
  const icono = BV.icono;

  const CLAVE_ESCALA = "biblioteca-virtual:escala-lector";
  const estado = () => BV.store.estado;

  function leerEscala() {
    try {
      const valor = Number(localStorage.getItem(CLAVE_ESCALA));
      return Number.isFinite(valor) && valor >= 0.9 && valor <= 1.5 ? valor : 1;
    } catch (e) { return 1; }
  }

  function guardarEscala(valor) {
    try { localStorage.setItem(CLAVE_ESCALA, String(valor)); } catch (e) { /* no crítico */ }
  }

  function bloqueHTML(b) {
    if (!b) return "";
    const texto = esc(b.texto || b.x || "");
    switch (b.tipo || b.t) {
      case "h2": return `<h2>${texto}</h2>`;
      case "verso": return `<p class="verso">${texto}</p>`;
      case "dialogo": return `<p class="dialogo"><strong>${esc(b.quien || "Personaje")}</strong>${texto}</p>`;
      case "acotacion": return `<p class="acotacion">${texto}</p>`;
      case "moral": return `<p class="moral">${texto}</p>`;
      case "dato": return `<aside class="dato">${texto}</aside>`;
      case "nota": return `<p class="nota">${texto}</p>`;
      case "lista": return `<ul class="lista-poema">${(b.items || []).map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
      case "comic": return `<div class="lector-comic">${(b.paneles || []).map((p) => `
        <figure class="vineta vineta--${esc(p.escena || "biblioteca")}">
          <svg class="vineta__icono" viewBox="0 0 24 24" aria-hidden="true"><use href="assets/svg/iconos.svg#book-open-text"></use></svg>
          <figcaption class="vineta__titulo">${esc(p.titulo || "Viñeta")}</figcaption>
          <p class="vineta__texto">${esc(p.texto)}</p>
          <span class="vineta__dialogo">${esc(p.dialogo)}</span>
        </figure>`).join("")}</div>`;
      default: return `<p>${texto}</p>`;
    }
  }

  function ilustracionHTML(recurso, indice = 0, clase = "") {
    const lista = (window.BV_ILUSTRACIONES || {})[recurso.id] || [];
    if (!lista.length) return "";
    const ilu = lista[indice % lista.length];
    return `<figure class="lector-ilustracion ${clase}">
      <img src="${esc(ilu.archivo)}" alt="${esc(ilu.alt)}" width="800" height="500" loading="lazy">
      ${ilu.titulo ? `<figcaption>${esc(ilu.titulo)}</figcaption>` : ""}
    </figure>`;
  }

  function seccionesDe(recurso) {
    const clasicos = window.BV_CLASICOS || {};
    if (clasicos[recurso.id]) {
      return clasicos[recurso.id].map((cap) => ({
        titulo: cap.titulo,
        bloques: cap.parrafos.map((p) => ({ t: p.tipo || "p", x: p.texto }))
      }));
    }
    const texto = (window.BV_TEXTOS || {})[recurso.id];
    if (texto) return [{ titulo: "La lectura", bloques: texto.bloques || [] }];
    return [];
  }

  function textoDe(secciones) {
    return secciones.map((s) => `${s.titulo}. ${s.bloques.map((b) => b.x || b.texto || "").join(" ")}`).join(" ");
  }

  function capituloActual(secciones, posicion) {
    const nodos = Array.from(document.querySelectorAll("[data-capitulo]"));
    if (!nodos.length) return 0;
    let indice = 0;
    nodos.forEach((n, i) => { if (n.getBoundingClientRect().top <= 190) indice = i; });
    return Math.min(indice, secciones.length - 1);
  }

  function barra(recurso, secciones, escala) {
    const conIndice = secciones.length > 1;
    return `
      <div class="lector-barra">
        <div class="lector-barra__interior">
          <a class="lector-boton lector-boton--volver" href="#/recurso/${esc(recurso.id)}">${icono("atras", "icono--sm")} Ficha</a>
          <div class="lector-barra__titulo">
            <strong>${esc(recurso.titulo)}</strong>
            <span>${esc(recurso.autor || "Biblioteca Virtual")} · ${secciones.length > 1 ? `${secciones.length} capítulos` : "Lectura completa"}</span>
          </div>
          <div class="lector-barra__acciones">
            ${conIndice ? `<select class="lector-boton" id="selector-capitulo" aria-label="Ir a un capítulo">${secciones.map((s, i) => `<option value="${i}">${esc(s.titulo)}</option>`).join("")}</select>` : ""}
            <button type="button" class="lector-boton" id="leer-menos" aria-label="Reducir tamaño del texto">A−</button>
            <output class="lector-progreso-texto" id="leer-escala" aria-live="polite">${Math.round(escala * 100)}%</output>
            <button type="button" class="lector-boton" id="leer-mas" aria-label="Aumentar tamaño del texto">A+</button>
            <button type="button" class="lector-boton" id="leer-en-voz">${icono("volumen", "icono--sm")} Escuchar</button>
            <button type="button" class="lector-boton" id="leer-despejar" aria-pressed="false">${icono("maximize", "icono--sm")} Despejar pantalla</button>
            <button type="button" class="lector-boton" id="descargar-libro">${icono("descargar", "icono--sm")} Descargar PDF</button>
            <button type="button" class="lector-boton" id="terminar-libro">${icono("check", "icono--sm")} Terminar</button>
          </div>
        </div>
        <div class="lector-barra__progreso" role="progressbar" aria-label="Progreso de lectura" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="lector-progreso-barra"><span style="width:0%"></span></div>
      </div>`;
  }

  function indiceHTML(secciones) {
    if (secciones.length < 2) return "";
    return `<nav class="lector-indice" aria-label="Índice de capítulos">
      <h2>Contenido</h2>
      <ol>${secciones.map((s, i) => `<li><a href="#capitulo-${i}" data-capitulo-link="${i}"><span>${String(i + 1).padStart(2, "0")}</span>${esc(s.titulo)}</a></li>`).join("")}</ol>
    </nav>`;
  }

  function sugerencias(recurso) {
    const lista = D.CATALOGO.filter((r) => r.id !== recurso.id && r.acceso === "abierto" && D.generoDe(r) === D.generoDe(recurso)).slice(0, 4);
    if (!lista.length) return "";
    return `<div class="lector-texto__sugerencias">
      <h2>Sigue leyendo</h2>
      <div class="rejilla-libros">${lista.map((r, i) => BV.componentes.libroCard(r, { indice: i })).join("")}</div>
    </div>`;
  }

  BV.lector = {
    render(id) {
      const recurso = D.buscarRecurso(id);
      if (!recurso || recurso.acceso !== "abierto" || !["pdf", "texto"].includes(recurso.tipo)) return null;
      const secciones = seccionesDe(recurso);
      if (!secciones.length) return null;
      const escala = leerEscala();
      const lectura = estado().lectura[id];
      const porcentaje = lectura?.percent || 0;
      const fav = BV.favoritos.es(id);

      const html = `
        <section class="lector">
          ${barra(recurso, secciones, escala)}
          <button type="button" class="lector-salir" id="salir-despejar" hidden>${icono("cerrar", "icono--sm")} Salir del modo lectura</button>
          <article class="lector-texto" id="lector-articulo" style="--lector-escala:${escala}">
            <header class="lector-texto__portada">
              ${BV.portadaHTML(recurso)}
              <div>
                <span class="etiqueta">${esc(D.subgeneroNombre(recurso))}</span>
                <h1>${esc(recurso.titulo)}</h1>
                <span class="lector-texto__autor">de ${esc(recurso.autor)}</span>
                <div class="lector-texto__datos">
                  <span>${esc((recurso.niveles || []).map(D.nivelNombre).join(" · "))}</span>
                  <span>${secciones.length > 1 ? `${secciones.length} capítulos` : "Lectura completa"}</span>
                  <span>${recurso.paginas || "—"} páginas en la edición de referencia</span>
                </div>
              </div>
            </header>
            <div class="lector-texto__resumen">
              <p>${esc(recurso.descripcion)}</p>
              <div class="fila">
                <button type="button" class="boton boton--suave boton--pequeno" data-voz="${esc(`${recurso.titulo}. ${recurso.descripcion}`)}">${icono("volumen")} Escuchar resumen</button>
                <button type="button" class="boton boton--pequeno" data-favorito="${recurso.id}" aria-pressed="${fav}">${icono("corazon")} ${fav ? "En favoritos" : "Guardar"}</button>
              </div>
            </div>
            ${ilustracionHTML(recurso, 0, "lector-ilustracion--portada")}
            ${indiceHTML(secciones)}
            <div class="lector-texto__cuerpo" id="lector-cuerpo">
              ${secciones.map((s, i) => `
                <section class="lector-capitulo" id="capitulo-${i}" data-capitulo="${i}" aria-labelledby="titulo-cap-${i}">
                  <h2 id="titulo-cap-${i}">${esc(s.titulo)}</h2>
                  ${ilustracionHTML(recurso, i + 1)}
                  ${s.bloques.map(bloqueHTML).join("")}
                  ${secciones.length > 1 && i < secciones.length - 1 ? `<button type="button" class="lector-boton capitulo-siguiente" data-capitulo-siguiente="${i + 1}">Siguiente capítulo ${icono("siguiente", "icono--sm")}</button>` : ""}
                </section>`).join("")}
            </div>
            <div class="lector-texto__fin">
              ${icono("libroAbierto", "icono--lg")}
              <h2>${porcentaje >= 100 ? "¡Lectura completada!" : "¿Terminaste esta lectura?"}</h2>
              <p>${porcentaje >= 100 ? "Esta historia ya forma parte de tu biblioteca personal." : "Guarda el progreso y suma 8 estrellas a tu colección."}</p>
              <div class="fila">
                <button type="button" class="boton boton--primario" id="terminar-libro-fin">${icono("check")} Marcar como terminado</button>
                <button type="button" class="boton" id="descargar-libro-fin">${icono("descargar")} Descargar PDF</button>
                <a class="boton" href="#/biblioteca">Elegir otra historia</a>
              </div>
            </div>
            ${sugerencias(recurso)}
          </article>

          <section class="libro-impresion" aria-hidden="true">
            <div class="libro-impresion__portada">
              <div class="libro-impresion__sello">Biblioteca Virtual</div>
              <h1>${esc(recurso.titulo)}</h1>
              <p>${esc(recurso.autor)}</p>
              <div class="libro-impresion__adorno">${icono("libroAbierto", "icono--xl")}</div>
              <small>Edición para lectura · ${esc(D.subgeneroNombre(recurso))}</small>
            </div>
            <div class="libro-impresion__indice">
              <h2>Contenido</h2>
              <ol>${secciones.map((s) => `<li>${esc(s.titulo)}</li>`).join("")}</ol>
            </div>
            ${secciones.map((s) => `
              <section class="libro-impresion__capitulo">
                <h2>${esc(s.titulo)}</h2>
                ${s.bloques.map((b) => {
                  if ((b.t === "verso" || b.tipo === "verso")) return `<p class="verso-impreso">${esc(b.x || b.texto)}</p>`;
                  return `<p>${esc(b.x || b.texto || "")}</p>`;
                }).join("")}
              </section>`).join("")}
            <div class="libro-impresion__colofon">
              <h2>Fuente y licencia</h2>
              <p>${esc(recurso.licencia || "Contenido propio bajo CC BY-SA 4.0.")}</p>
              ${recurso.fuente ? `<p>Fuente: ${esc(recurso.fuente)}${recurso.fuenteUrl ? ` · ${esc(recurso.fuenteUrl)}` : ""}</p>` : ""}
              <p>PDF generado por Biblioteca Virtual con diseño propio. No es una copia del archivo original.</p>
              <p>© Biblioteca Virtual · Edición educativa, gratuita y sin publicidad.</p>
            </div>
          </section>
        </section>`;

      return {
        titulo: `${recurso.titulo} · Lectura`,
        html,
        init() {
          const cuerpo = document.getElementById("lector-cuerpo");
          const barraProgreso = document.getElementById("lector-progreso-barra");
          const selector = document.getElementById("selector-capitulo");
          const escalaOut = document.getElementById("leer-escala");
          let escalaActual = escala;
          let ultimoGuardado = 0;
          let terminado = false;
          let despejado = false;

          document.body.classList.add("modo-lector");

          const botonDespejar = document.getElementById("leer-despejar");
          const botonSalir = document.getElementById("salir-despejar");
          const alternarDespeje = (activar) => {
            const progreso = calcular();
            despejado = typeof activar === "boolean" ? activar : !despejado;
            document.body.classList.toggle("lector-despejado", despejado);
            if (botonSalir) botonSalir.hidden = !despejado;
            if (botonDespejar) botonDespejar.setAttribute("aria-pressed", String(despejado));
            BV.ui.anunciar(despejado ? "Modo lectura activado. Pulsa Escape para volver." : "Modo lectura desactivado.");
            window.requestAnimationFrame(() => {
              const maximo = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
              window.scrollTo(0, (progreso / 100) * maximo);
            });
          };
          botonDespejar?.addEventListener("click", () => alternarDespeje(true));
          botonSalir?.addEventListener("click", () => alternarDespeje(false));
          const alTeclear = (e) => { if (e.key === "Escape" && despejado) alternarDespeje(false); };
          window.addEventListener("keydown", alTeclear);

          const ajustarEscala = (delta) => {
            escalaActual = U.limitar(Math.round((escalaActual + delta) * 100) / 100, 0.9, 1.5);
            cuerpo.style.setProperty("--lector-escala", escalaActual);
            escalaOut.textContent = `${Math.round(escalaActual * 100)}%`;
            guardarEscala(escalaActual);
            BV.sonido("clic");
          };
          document.getElementById("leer-menos").addEventListener("click", () => ajustarEscala(-0.1));
          document.getElementById("leer-mas").addEventListener("click", () => ajustarEscala(0.1));

          const calcular = () => {
            const maximo = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            return U.limitar(Math.round((window.scrollY / maximo) * 100), 0, 100);
          };
          const pintar = (pct) => {
            if (barraProgreso) {
              barraProgreso.setAttribute("aria-valuenow", String(pct));
              barraProgreso.firstElementChild.style.width = `${pct}%`;
            }
            if (selector) {
              const idx = capituloActual(secciones);
              if (Number(selector.value) !== idx) selector.value = String(idx);
            }
          };
          const guardarProgreso = (pct) => {
            if (pct <= ultimoGuardado && !terminado) return;
            ultimoGuardado = pct;
            BV.progreso.actualizarLectura(recurso.id, pct);
            if (pct >= 97 && !terminado && !estado().lectura[recurso.id]?.completed) {
              terminado = true;
              BV.progreso.completarLibro(recurso.id);
            }
            pintar(pct);
          };
          let temporizador = null;
          const alDesplazarse = () => {
            window.clearTimeout(temporizador);
            temporizador = window.setTimeout(() => guardarProgreso(calcular()), 260);
          };
          window.addEventListener("scroll", alDesplazarse, { passive: true });
          pintar(porcentaje);

          if (selector) selector.addEventListener("change", () => {
            const destino = document.getElementById(`capitulo-${selector.value}`);
            if (destino) destino.scrollIntoView({ behavior: estado().movimiento ? "auto" : "smooth", block: "start" });
          });
          document.querySelectorAll("[data-capitulo-link]").forEach((enlace) => {
            enlace.addEventListener("click", (e) => {
              e.preventDefault();
              const destino = document.getElementById(`capitulo-${enlace.dataset.capituloLink}`);
              if (destino) destino.scrollIntoView({ behavior: estado().movimiento ? "auto" : "smooth", block: "start" });
            });
          });
          document.querySelectorAll("[data-capitulo-siguiente]").forEach((boton) => {
            boton.addEventListener("click", () => {
              const destino = document.getElementById(`capitulo-${boton.dataset.capituloSiguiente}`);
              if (destino) destino.scrollIntoView({ behavior: estado().movimiento ? "auto" : "smooth", block: "start" });
            });
          });

          const hablar = (boton) => {
            const idx = selector ? Number(selector.value) : 0;
            const cap = secciones[U.limitar(idx, 0, secciones.length - 1)];
            const contenido = secciones.length > 1
              ? `${cap.titulo}. ${cap.bloques.map((b) => b.x || "").join(" ")}`
              : textoDe(secciones);
            BV.voz.hablar(contenido.slice(0, 18000), boton);
          };
          const botonVoz = document.getElementById("leer-en-voz");
          if (botonVoz) botonVoz.addEventListener("click", () => hablar(botonVoz));

          const imprimir = () => {
            document.body.classList.add("imprimir-libro");
            BV.sonido("clic");
            BV.ui.dialogo("Descargar PDF diseñado", "<p>Se abrirá la ventana de impresión. Elige <strong>Guardar como PDF</strong> para descargar una versión con portada, índice y capítulos, creada por la biblioteca.</p><p>El archivo original no se muestra ni se copia: el PDF se genera a partir de este texto.</p>", [
              { texto: "Cancelar", clase: "boton--fantasma", accion: () => { document.body.classList.remove("imprimir-libro"); } },
              { texto: "Abrir impresión", clase: "boton--primario", accion: () => { window.setTimeout(() => window.print(), 120); } }
            ]);
          };
          ["descargar-libro", "descargar-libro-fin"].forEach((id) => {
            const b = document.getElementById(id);
            if (b) b.addEventListener("click", imprimir);
          });

          const terminar = () => {
            if (BV.progreso.completarLibro(recurso.id)) {
              terminado = true;
              guardarProgreso(100);
              const fin = document.querySelector(".lector-texto__fin h2");
              if (fin) fin.textContent = "¡Lectura completada!";
            }
          };
          ["terminar-libro", "terminar-libro-fin"].forEach((id) => {
            const b = document.getElementById(id);
            if (b) b.addEventListener("click", terminar);
          });

          if (porcentaje > 2 && porcentaje < 96) {
            window.requestAnimationFrame(() => {
              const maximo = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
              window.scrollTo(0, (porcentaje / 100) * maximo);
              BV.ui.toast({ titulo: "Continúa donde lo dejaste", texto: `${porcentaje}% leído · ${recurso.titulo}`, tipo: "info", iconoNombre: "libroMarcado", duracion: 4200 });
            });
          }

          BV.progreso.iniciarLectura(recurso.id);
          BV.progreso.iniciarRacha();

          this.destruir = () => {
            window.removeEventListener("scroll", alDesplazarse);
            window.removeEventListener("keydown", alTeclear);
            window.clearTimeout(temporizador);
            document.body.classList.remove("modo-lector", "lector-despejado", "imprimir-libro");
          };
        },
        destruir() {}
      };
    }
  };
})();
