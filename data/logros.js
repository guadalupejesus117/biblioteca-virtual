/* ============================================================
   Biblioteca Virtual · Logros, insignias y diplomas
   ============================================================ */
window.BV_LOGROS = [
  {
    id: "primer-paso",
    nombre: "Primer paso",
    descripcion: "Abre tu primer libro o empieza tu primera actividad.",
    icono: "huella",
    recompensa: 5,
    meta: 1,
    valor: (s) => (s.stats.booksStarted || 0) + (s.stats.gamesPlayed || 0)
  },
  {
    id: "primer-libro",
    nombre: "Lector curioso",
    descripcion: "Termina tu primer libro.",
    icono: "libro",
    recompensa: 10,
    meta: 1,
    valor: (s) => s.stats.booksCompleted || 0
  },
  {
    id: "raton-biblioteca",
    nombre: "Ratón de biblioteca",
    descripcion: "Termina 3 libros de la biblioteca.",
    icono: "buho",
    recompensa: 20,
    meta: 3,
    valor: (s) => s.stats.booksCompleted || 0
  },
  {
    id: "cuentacuentos",
    nombre: "Cuentacuentos",
    descripcion: "Termina 5 libros y comparte sus historias.",
    icono: "corona",
    recompensa: 30,
    meta: 5,
    valor: (s) => s.stats.booksCompleted || 0
  },
  {
    id: "explorador",
    nombre: "Explorador de géneros",
    descripcion: "Lee al menos un libro de 3 géneros distintos.",
    icono: "brujula",
    recompensa: 25,
    meta: 3,
    valor: (s) => (s.stats.genresRead || []).length
  },
  {
    id: "coleccionista",
    nombre: "Coleccionista de historias",
    descripcion: "Guarda 5 libros en tus favoritos.",
    icono: "corazon",
    recompensa: 15,
    meta: 5,
    valor: (s) => (s.favorites || []).length
  },
  {
    id: "adivino",
    nombre: "Detective de adivinanzas",
    descripcion: "Acierta 10 adivinanzas.",
    icono: "pregunta",
    recompensa: 20,
    meta: 10,
    valor: (s) => s.stats.riddlesCorrect || 0
  },
  {
    id: "lengua-suelta",
    nombre: "Lengua suelta",
    descripcion: "Completa 3 retos de trabalenguas.",
    icono: "boca",
    recompensa: 20,
    meta: 3,
    valor: (s) => s.stats.tongueCompleted || 0
  },
  {
    id: "sopa-maestra",
    nombre: "Sopa maestra",
    descripcion: "Resuelve 3 sopas de letras.",
    icono: "rompecabezas",
    recompensa: 25,
    meta: 3,
    valor: (s) => s.stats.wordsearchCompleted || 0
  },
  {
    id: "crucigramista",
    nombre: "Crucigramista",
    descripcion: "Completa un crucigrama sin rendirte.",
    icono: "cuadricula",
    recompensa: 20,
    meta: 1,
    valor: (s) => s.stats.crosswordCompleted || 0
  },
  {
    id: "memoria-elefante",
    nombre: "Memoria de elefante",
    descripcion: "Completa 2 partidas de memorama.",
    icono: "cartas",
    recompensa: 20,
    meta: 2,
    valor: (s) => s.stats.memoryCompleted || 0
  },
  {
    id: "puzzle-perfecto",
    nombre: "Puzzle perfecto",
    descripcion: "Completa 3 rompecabezas.",
    icono: "rompecabezas",
    recompensa: 25,
    meta: 3,
    valor: (s) => s.stats.puzzleCompleted || 0
  },
  {
    id: "comprendedor",
    nombre: "Comprendedor",
    descripcion: "Completa 3 lecturas de comprensión.",
    icono: "cerebro",
    recompensa: 25,
    meta: 3,
    valor: (s) => s.stats.comprehensionCompleted || 0
  },
  {
    id: "constancia",
    nombre: "Constancia mágica",
    descripcion: "Visita la biblioteca 3 días seguidos.",
    icono: "estrella",
    recompensa: 30,
    meta: 3,
    valor: (s) => s.streak?.count || 0
  },
  {
    id: "perfeccionista",
    nombre: "Puntería perfecta",
    descripcion: "Consigue 3 actividades con puntuación perfecta.",
    icono: "diana",
    recompensa: 30,
    meta: 3,
    valor: (s) => s.stats.perfectGames || 0
  },
  {
    id: "gran-lector",
    nombre: "Gran lector",
    descripcion: "Termina 10 libros. ¡Toda una aventura!",
    icono: "medalla",
    recompensa: 50,
    meta: 10,
    valor: (s) => s.stats.booksCompleted || 0
  },
  {
    id: "cien-estrellas",
    nombre: "Cien estrellas",
    descripcion: "Reúne 100 estrellas educativas.",
    icono: "estrella",
    recompensa: 50,
    meta: 100,
    valor: (s) => s.stats.starsEarned || 0
  },
  {
    id: "diploma",
    nombre: "Diploma al mérito",
    descripcion: "Desbloquea tu primer diploma imprimible.",
    icono: "medalla",
    recompensa: 0,
    meta: 1,
    valor: (s) => (s.diplomas || []).length
  }
];

window.BV_DIPLOMAS = [
  {
    id: "lector-estrella",
    titulo: "Lector estrella",
    descripcion: "Por leer 3 libros completos y dejarse llevar por las historias.",
    icono: "estrella",
    requisito: "3 libros completados",
    comprobar: (s) => (s.stats.booksCompleted || 0) >= 3
  },
  {
    id: "gran-lector",
    titulo: "Gran lector",
    descripcion: "Por leer 10 libros completos y demostrar una curiosidad enorme.",
    icono: "libro",
    requisito: "10 libros completados",
    comprobar: (s) => (s.stats.booksCompleted || 0) >= 10
  },
  {
    id: "explorador",
    titulo: "Explorador de mundos",
    descripcion: "Por recorrer al menos 3 géneros literarios diferentes.",
    icono: "brujula",
    requisito: "3 géneros explorados",
    comprobar: (s) => (s.stats.genresRead || []).length >= 3
  },
  {
    id: "campeon-juegos",
    titulo: "Campeón de juegos",
    descripcion: "Por completar los 8 juegos educativos de la biblioteca.",
    icono: "trofeo",
    requisito: "8 juegos completados",
    comprobar: (s) => (s.gamesCompletedList || []).length >= 8
  },
  {
    id: "coleccionista-estrellas",
    titulo: "Coleccionista de estrellas",
    descripcion: "Por reunir 150 estrellas educativas con esfuerzo y constancia.",
    icono: "estrella",
    requisito: "150 estrellas",
    comprobar: (s) => (s.stats.starsEarned || 0) >= 150
  }
];

window.BV_RECURSOS = [
  {
    id: "gutenberg",
    nombre: "Project Gutenberg · Libros en español",
    url: "https://www.gutenberg.org/browse/languages/es",
    descripcion: "Miles de libros clásicos digitalizados, con buscador por idioma y autor.",
    licencia: "Obras en dominio público (verifica la legislación de tu país)",
    tipo: "Biblioteca digital",
    edad: "Primaria y secundaria"
  },
  {
    id: "cervantes",
    nombre: "Biblioteca Virtual Miguel de Cervantes",
    url: "https://www.cervantesvirtual.com/",
    descripcion: "Biblioteca digital de referencia en lengua española: literatura, historia y materiales educativos.",
    licencia: "Dominio público y licencias indicadas en cada obra",
    tipo: "Biblioteca digital",
    edad: "Secundaria y docentes"
  },
  {
    id: "wikisource",
    nombre: "Wikisource en español",
    url: "https://es.wikisource.org/wiki/Portada",
    descripcion: "Textos libres, poemas y documentos históricos transcritos por la comunidad.",
    licencia: "CC BY-SA y dominio público según la página",
    tipo: "Textos libres",
    edad: "Secundaria"
  },
  {
    id: "storyweaver",
    nombre: "StoryWeaver",
    url: "https://storyweaver.org.in/",
    descripcion: "Cuentos infantiles ilustrados de todo el mundo, con filtros por idioma y nivel lector.",
    licencia: "Licencias abiertas (CC BY / CC BY-SA en la mayoría de las historias)",
    tipo: "Cuentos abiertos",
    edad: "Preescolar y primaria"
  },
  {
    id: "ilce",
    nombre: "Biblioteca Digital ILCE",
    url: "https://bibliotecadigital.ilce.edu.mx/",
    descripcion: "Biblioteca educativa mexicana con clásicos, materiales didácticos y lecturas para estudiantes.",
    licencia: "Consulta educativa, cultural y no lucrativa citando la fuente",
    tipo: "Biblioteca educativa",
    edad: "Primaria y secundaria"
  },
  {
    id: "icdl",
    nombre: "International Children's Digital Library",
    url: "https://childrenslibrary.org/",
    descripcion: "Biblioteca digital infantil con libros en muchos idiomas, incluido el español.",
    licencia: "Lectura en línea; revisa las condiciones de cada libro",
    tipo: "Biblioteca infantil",
    edad: "Preescolar y primaria"
  },
  {
    id: "worldstories",
    nombre: "World Stories",
    url: "https://worldstories.org.uk/",
    descripcion: "Cuentos tradicionales de distintas culturas, con versiones en varios idiomas y apoyo para docentes.",
    licencia: "Cuentos con licencias abiertas indicadas por historia",
    tipo: "Cuentos del mundo",
    edad: "Primaria"
  },
  {
    id: "argentina",
    nombre: "Ministerio de Cultura de Argentina",
    url: "https://www.argentina.gob.ar/cultura",
    descripcion: "Publicaciones culturales y programas de lectura, entre ellos la colección Libros y Casas.",
    licencia: "Publicaciones oficiales; consulta cada edición",
    tipo: "Portal oficial",
    edad: "Docentes y secundaria"
  },
  {
    id: "sep",
    nombre: "Secretaría de Educación Pública de México",
    url: "https://www.gob.mx/sep",
    descripcion: "Materiales educativos oficiales, libros de texto y programas de fomento a la lectura.",
    licencia: "Recursos oficiales; revisa las condiciones de cada material",
    tipo: "Portal educativo",
    edad: "Docentes"
  },
  {
    id: "uaem",
    nombre: "Libros UAEM",
    url: "https://libros.uaem.mx/",
    descripcion: "Catálogo editorial de la Universidad Autónoma del Estado de Morelos.",
    licencia: "Consulta las condiciones de cada publicación",
    tipo: "Editorial universitaria",
    edad: "Secundaria y docentes"
  }
];
