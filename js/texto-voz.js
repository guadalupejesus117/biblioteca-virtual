/* Texto para narración: conserva las palabras, omite marcas editoriales. */
(function () {
  "use strict";
  window.BV_TEXTO_VOZ = function (valor) {
    return String(valor || "").normalize("NFC")
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/https?:\/\/\S+/g, " ")
      .replace(/[*_`#~|]+/g, " ")
      .replace(/[\u00ad\u200b\ufeff]/g, "")
      .replace(/\s+/g, " ").trim();
  };
  window.BV_FRAGMENTOS_VOZ = function (texto, maximo = 220) {
    const partes = [];
    let inicio = 0;
    while (inicio < texto.length) {
      while (/\s/.test(texto[inicio] || "") && inicio < texto.length) inicio++;
      if (inicio >= texto.length) break;
      let fin = Math.min(inicio + maximo, texto.length);
      if (fin < texto.length) {
        const espacio = texto.lastIndexOf(" ", fin);
        if (espacio > inicio) fin = espacio;
      }
      partes.push({ texto: texto.slice(inicio, fin), inicio });
      inicio = fin;
    }
    return partes;
  };
})();
