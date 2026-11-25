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
    if (indice === 0 || !lista.length) return `<figure class="lector-ilustracion ${clase}"><img src="assets/arte/${esc(recurso.id)}.svg" alt="${esc(recurso.titulo)}" width="800" height="500"></figure>`;
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
              <div class="libro-impresion__adorno">${ilustracionHTML(recurso,0) || `<img src="assets/svg/mascota-draco.svg" alt="Pío">`}</div>
              <small>Edición para lectura · ${esc(D.subgeneroNombre(recurso))}</small>
            </div>
            <div class="libro-impresion__indice">
              <h2>Contenido</h2>
              <ol>${secciones.map((s) => `<li>${esc(s.titulo)}</li>`).join("")}</ol>
            </div>
            ${secciones.map((s,i) => `
              <section class="libro-impresion__capitulo">
                <div class="impreso-etiqueta">Biblioteca Virtual · ${i+1} / ${secciones.length}</div><h2>${esc(s.titulo)}</h2>
                ${ilustracionHTML(recurso,i+1)}
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
          const articulo = document.getElementById("lector-articulo");
          const barraProgreso = document.getElementById("lector-progreso-barra");
          const selector = document.getElementById("selector-capitulo");
          const escalaOut = document.getElementById("leer-escala");
          let escalaActual = escala, terminado = false, paginas = [], actual = 0;
          const clave = "bv:pagina:" + recurso.id;
          let guardado = null;
          try { guardado = JSON.parse(localStorage.getItem(clave)); } catch(e) {}
          document.body.classList.add("modo-lector", "lector-paginado");
          const estilo = document.createElement("style"); estilo.textContent = "\n@media screen {\nbody.lector-paginado .cabecera,body.lector-paginado .pie,body.lector-paginado .mascota-flotante,body.lector-paginado .burbuja-mascota,body.lector-paginado .lector-texto__portada,body.lector-paginado .lector-texto__resumen,body.lector-paginado .lector-indice,body.lector-paginado .lector-ilustracion--portada,body.lector-paginado .lector-texto__fin,body.lector-paginado .lector-texto__sugerencias,body.lector-paginado .lector-salir{display:none!important}\nbody.lector-paginado #vista{padding:0!important}\nbody.lector-paginado .lector{padding:0!important}\nbody.lector-paginado .lector-barra{position:relative;top:auto;z-index:5}\nbody.lector-paginado .lector-barra__interior{display:flex;flex-wrap:wrap;gap:6px;padding:6px 0}\nbody.lector-paginado .lector-barra__titulo{flex:1;min-width:0;order:0}\nbody.lector-paginado .lector-barra__titulo strong{font-size:.8rem}\nbody.lector-paginado .lector-barra__titulo span{display:none}\nbody.lector-paginado .lector-barra__acciones{position:absolute;top:100%;right:8px;width:min(340px,95vw);padding:12px;background:var(--superficie-solida);border:1px solid var(--borde);border-radius:14px;display:flex;flex-wrap:wrap;box-shadow:0 12px 30px #0005}\nbody.lector-paginado [hidden]{display:none!important}\nbody.lector-paginado .lector-texto{width:min(96%,760px);padding:10px 0;margin:auto}\nbody.lector-paginado .lector-texto__cuerpo{font-size:calc(1rem * var(--lector-escala,1));line-height:1.55}\n.hoja-marco{position:relative;perspective:1200px;padding:0 5px 5px}\n.hoja-libro{height:calc(100dvh - 120px);min-height:180px;overflow:auto;box-sizing:border-box;padding:52px clamp(15px,4vw,38px) 18px;background:#faf0dc;color:#392b22;border-radius:5px 12px 12px 5px;box-shadow:4px 4px #c6b89f,8px 8px #95846e,0 14px 35px #0005;transform-origin:left center;font-family:Georgia,serif;touch-action:pan-y;overflow-wrap:anywhere}\n.hoja-libro h2{color:#62472f!important;font-size:1.25em;margin:0 0 12px}\n.hoja-libro p{color:inherit!important;margin:0 0 .65em;text-align:left}\n.hoja-libro img{max-height:30vh;object-fit:contain}\n.hoja-nav{display:flex;align-items:center;justify-content:space-between;gap:5px;margin:12px 4px 0;font:600 .75rem system-ui}\n.hoja-nav button{min-height:38px}\n.hoja-nav output{text-align:center}\n}\n"; document.head.append(estilo);
          const barra = document.querySelector(".lector-barra");
          const acciones = barra.querySelector(".lector-barra__acciones");
          const menu = document.createElement("button");
          menu.className = "lector-boton"; menu.textContent = "☰ Opciones";
          menu.setAttribute("aria-expanded","false");
          acciones.before(menu);
          acciones.hidden = true;
          const abrir = (v) => { acciones.hidden = !v; menu.setAttribute("aria-expanded", String(v)); };
          menu.onclick = () => abrir(acciones.hidden);
          document.getElementById("leer-despejar").hidden = true;
          const fuentes = Array.from(cuerpo.querySelectorAll(".lector-capitulo")).map(n => Array.from(n.children).filter(x=>!x.matches(".capitulo-siguiente")));
          cuerpo.innerHTML = '<div class="hoja-marco"><div class="hoja-libro" tabindex="0" aria-label="Página de lectura"></div></div><nav class="hoja-nav" aria-label="Navegación de páginas"><button type="button" class="lector-boton hoja-anterior">‹ Anterior</button><output aria-live="polite"></output><button type="button" class="lector-boton hoja-siguiente">Siguiente ›</button></nav>';
          const hoja = cuerpo.querySelector(".hoja-libro"), salida = cuerpo.querySelector("output");
          const anterior = cuerpo.querySelector(".hoja-anterior"), siguiente = cuerpo.querySelector(".hoja-siguiente");
          const guardarProgreso = pct => { BV.progreso.actualizarLectura(recurso.id, Math.max(porcentaje, estado().lectura[recurso.id]?.percent || 0, pct), {page:actual+1,totalPages:paginas.length}); if(pct>=50) BV.progreso.evaluarLogros(); };
          let vozLista=false;
          function mostrar(n, animar = false, desdeVoz = false) {
            if (vozLista && !desdeVoz && narrando) detenerVoz();
            actual = Math.max(0, Math.min(paginas.length-1,n));
            const p = paginas[actual]; if(!p) return;
            hoja.replaceChildren(...p.nodos.map(x=>x.cloneNode(true)));
            hoja.scrollTop = 0;
            
            const arte=(window.BV_ILUSTRACIONES||{})[recurso.id]||[];
            if(arte.length && !hoja.querySelector("img")){
              const ultimo=hoja.lastElementChild;
              const libre=ultimo?hoja.getBoundingClientRect().bottom-ultimo.getBoundingClientRect().bottom-24:0;
              if(libre>105){
                const figura=document.createElement("figure");figura.className="hoja-relleno";
                figura.style.cssText="margin:8px auto 0;text-align:center";
                const img=document.createElement("img");const ilu=arte[p.cap%arte.length];
                img.src=ilu.archivo;img.alt=ilu.alt;img.style.cssText="display:block;margin:auto;width:auto;max-width:100%;height:"+Math.min(180,libre-16)+"px;object-fit:contain;border-radius:10px";
                figura.append(img);hoja.append(figura);
              }
            }
            if(animar && !estado().movimiento && !matchMedia("(prefers-reduced-motion: reduce)").matches && hoja.animate) hoja.animate([{transform:"rotateY(12deg)",opacity:.65},{transform:"rotateY(0)",opacity:1}],{duration:300,easing:"ease-out"});
            salida.textContent = "Página "+(actual+1)+" / "+paginas.length+" · Cap. "+(p.cap+1);
            anterior.disabled = actual===0; siguiente.textContent = actual===paginas.length-1 ? "Finalizar ✓" : "Siguiente ›";
            if(selector) selector.value=String(p.cap);
            const pct = Math.floor(actual / Math.max(1,paginas.length)*100);
            barraProgreso.setAttribute("aria-valuenow",String(pct)); barraProgreso.firstElementChild.style.width=pct+"%";
            guardarProgreso(pct);
            salida.textContent += " · "+pct+"%";
            try {localStorage.setItem(clave,JSON.stringify({cap:p.cap,offset:p.offset}));}catch(e){}
          }
          function paginar(pos) {
            paginas=[]; hoja.replaceChildren();
            fuentes.forEach((nodos,cap)=>{
              let lote=[], offset=0, inicio=0;
              function cerrar(){if(lote.length) paginas.push({cap,offset:inicio,nodos:lote}); lote=[]; hoja.replaceChildren(); inicio=offset;}
              function agregar(n){
                const copia=n.cloneNode(true); hoja.append(copia);
                if(hoja.scrollHeight>hoja.clientHeight+2 && lote.length){copia.remove();cerrar();hoja.append(copia);}
                lote.push(n);offset++;
              }
              nodos.forEach(n=>{
                if(n.matches("p") && n.textContent.length>240 && !n.children.length){
                  const partes=n.textContent.match(/\S+\s*/g)||[];
                  let texto="";
                  partes.forEach(w=>{if(texto.length+w.length>240 && texto){const q=n.cloneNode(false);q.textContent=texto;agregar(q);texto="";}texto+=w;});
                  if(texto){const q=n.cloneNode(false);q.textContent=texto;agregar(q);}
                }else agregar(n);
              });cerrar();
            });
            let destino=0;
            if(pos) paginas.forEach((p,i)=>{if(p.cap===pos.cap && p.offset<=pos.offset) destino=i;});
            else if(porcentaje>0 && porcentaje<100) destino=Math.floor(paginas.length*porcentaje/100);
            mostrar(destino);
          }
          const ajustarEscala = delta => {
            const pos=paginas[actual]; escalaActual=U.limitar(Math.round((escalaActual+delta)*100)/100,.9,1.5);
            articulo.style.setProperty("--lector-escala",escalaActual); escalaOut.textContent=Math.round(escalaActual*100)+"%"; guardarEscala(escalaActual); paginar(pos);
          };
          document.getElementById("leer-menos").onclick=()=>ajustarEscala(-.1);
          document.getElementById("leer-mas").onclick=()=>ajustarEscala(.1);
          const avanzar=()=>{if(actual===paginas.length-1){terminar();}else mostrar(actual+1,true);};
          anterior.onclick=()=>mostrar(actual-1,true); siguiente.onclick=avanzar;
          if(selector) selector.onchange=()=>{const i=paginas.findIndex(p=>p.cap===Number(selector.value));if(i>=0)mostrar(i,true);abrir(false);};
          let x=0,y=0;
          hoja.addEventListener("touchstart",e=>{x=e.changedTouches[0].clientX;y=e.changedTouches[0].clientY;},{passive:true});
          hoja.addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-x,dy=e.changedTouches[0].clientY-y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5){if(dx<0 && actual<paginas.length-1)mostrar(actual+1,true);else if(dx>0)mostrar(actual-1,true);}},{passive:true});
          hoja.addEventListener("click",()=>abrir(false));
          const alTeclear=e=>{if(e.key==="Escape")abrir(false);if(e.target.closest("button,select,input,textarea"))return;if(e.key==="ArrowRight"&&actual<paginas.length-1)mostrar(actual+1,true);if(e.key==="ArrowLeft")mostrar(actual-1,true);};
          window.addEventListener("keydown",alTeclear);
          let temporizador;
          const redimensionar=()=>{clearTimeout(temporizador);temporizador=setTimeout(()=>paginar(paginas[actual]),150);};
          window.addEventListener("resize",redimensionar);
          paginar(guardado);
          const botonVoz = document.getElementById("leer-en-voz");
          const controlVoz = document.createElement("button");
          controlVoz.type="button"; controlVoz.className="lector-boton"; controlVoz.textContent="▶ Escuchar";
          cuerpo.querySelector(".hoja-marco").append(controlVoz);
          controlVoz.style.cssText="position:absolute;top:8px;right:12px;z-index:2;min-height:34px;background:#f8e6c4;color:#392b22;border:1px solid #c8a875;border-radius:20px;padding:0 12px";
          let narrando=false, turno=0;
          const motor=window.speechSynthesis;
          function detenerVoz(){
            turno++; narrando=false;
            if(motor) motor.cancel();
            hoja.querySelectorAll(".voz-activa").forEach(n=>n.classList.remove("voz-activa"));
            controlVoz.textContent="▶ Escuchar"; botonVoz.textContent="Escuchar";
          }
          function narrarPagina(){
            const token=turno;
            const bloques=Array.from(hoja.querySelectorAll("h2,p,li,figcaption,aside")).filter(n=>n.textContent.trim()&&!n.closest(".hoja-relleno"));
            let i=0;
            function paso(){
              if(!narrando||token!==turno)return;
              hoja.querySelectorAll(".voz-activa").forEach(n=>n.classList.remove("voz-activa"));
              hoja.querySelectorAll(".voz-palabra").forEach(m=>m.replaceWith(document.createTextNode(m.textContent)));
              if(i>=bloques.length){
                if(actual+1<paginas.length){mostrar(actual+1,true,true);narrarPagina();}
                else {detenerVoz();terminar();}
                return;
              }
              const n=bloques[i++]; n.classList.add("voz-activa");
              n.scrollIntoView({block:"nearest",inline:"nearest"});
              const texto=n.textContent.trim();
              const u=new SpeechSynthesisUtterance(texto);u.lang="es-MX";
              const voces=motor.getVoices(); const voz=voces.find(v=>v.lang==="es-MX")||voces.find(v=>v.lang.startsWith("es"));
              if(voz)u.voice=voz;
              u.onboundary=e=>{
                if(token!==turno||!narrando||e.name!=="word")return;
                if(n.children.length && !n.querySelector(".voz-palabra"))return;
                const inicio=e.charIndex, fin=inicio+(e.charLength||((texto.slice(inicio).match(/^\S+/)||[""])[0].length));
                const marca=document.createElement("mark");marca.className="voz-palabra";marca.textContent=texto.slice(inicio,fin);
                n.replaceChildren(document.createTextNode(texto.slice(0,inicio)),marca,document.createTextNode(texto.slice(fin)));
              };
              u.onend=()=>{if(token===turno&&narrando){paso();}};
              u.onerror=()=>{if(token===turno){detenerVoz();BV.ui.anunciar("No se pudo continuar el audio.");}};
              motor.speak(u);
            }
            paso();
          }
          function alternarVoz(){
            if(!motor||!window.SpeechSynthesisUtterance){BV.ui.anunciar("Este navegador no admite narración.");return;}
            if(narrando){detenerVoz();return;}
            motor.cancel(); turno++; narrando=true;
            controlVoz.textContent="■ Detener audio";botonVoz.textContent="Detener audio";abrir(false);narrarPagina();
          }
          estilo.textContent += '\n.voz-activa{background:#f4dfaa!important;border-radius:5px;outline:2px solid #d7a84a;outline-offset:2px}.voz-palabra{background:#f6b84c;color:#302010;border-radius:3px}';
          estilo.textContent += "\n@media screen and (max-width:600px){body.lector-paginado .lector-barra__interior{flex-wrap:nowrap;width:calc(100% - 12px)}body.lector-paginado .lector-barra__titulo{flex-basis:0;overflow:hidden}body.lector-paginado .lector-barra__titulo strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}body.lector-paginado .hoja-nav button{padding:0 7px}.hoja-nav output{font-size:.65rem}} @media screen and (min-width:900px){body.lector-paginado .lector-texto{width:min(92%,850px)}.hoja-libro{padding-inline:65px}.hoja-nav{font-size:.9rem}}";
          vozLista=true;
          botonVoz.addEventListener("click",alternarVoz);controlVoz.addEventListener("click",alternarVoz);
          const imprimir = async () => { try { await window.BVPDF.descargar(document.querySelector(".libro-impresion"),recurso.titulo); } catch(e){BV.ui.dialogo("No se pudo descargar","<p>Intenta nuevamente.</p>");} };
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


          BV.progreso.iniciarLectura(recurso.id);
          BV.progreso.iniciarRacha();
          this.destruir = () => {
            window.removeEventListener("resize",redimensionar);
            window.removeEventListener("keydown",alTeclear);
            detenerVoz(); clearTimeout(temporizador); estilo.remove();
            document.body.classList.remove("modo-lector","lector-paginado","imprimir-libro");
          };
        },
        destruir() {}
      };
    }
  };
})();
