/* ============================================================
   Biblioteca Virtual · Géneros literarios
   ============================================================ */
window.BV_GENEROS = {
  narrativo: {
    id: "narrativo",
    nombre: "Narrativo",
    eslogan: "Historias que nos llevan a otros mundos",
    descripcion: "Cuentos, novelas, fábulas, leyendas y mitos. Aquí viven los personajes que nos acompañan mucho después de cerrar el libro.",
    icono: "castillo",
    paleta: "violeta",
    subgeneros: [
      { id: "cuento", nombre: "Cuentos infantiles", icono: "estrella", descripcion: "Relatos breves con personajes, magia y una enseñanza." },
      { id: "novela", nombre: "Novelas", icono: "libro", descripcion: "Aventuras largas para lectores que quieren más." },
      { id: "fabula", nombre: "Fábulas", icono: "hoja", descripcion: "Animales que hablan y una moraleja al final." },
      { id: "leyenda", nombre: "Leyendas", icono: "luna", descripcion: "Historias de tradición oral que explican misterios." },
      { id: "mito", nombre: "Mitos", icono: "sol", descripcion: "Relatos sobre el origen del mundo y de los pueblos." }
    ]
  },
  lirico: {
    id: "lirico",
    nombre: "Lírico",
    eslogan: "Palabras que cantan y emocionan",
    descripcion: "Poemas, rimas y canciones. El género de la voz, el ritmo y las imágenes que se quedan en el oído.",
    icono: "nota",
    paleta: "rosa",
    subgeneros: [
      { id: "poema", nombre: "Poemas", icono: "pluma", descripcion: "Textos breves que juegan con el ritmo y las imágenes." },
      { id: "poesia-infantil", nombre: "Poesía infantil", icono: "nota", descripcion: "Poesía pensada para los primeros lectores y para leer en voz alta." }
    ]
  },
  dramatico: {
    id: "dramatico",
    nombre: "Dramático",
    eslogan: "Historias que cobran vida en escena",
    descripcion: "Obras de teatro, guiones y representaciones escolares. Aquí los diálogos se convierten en voces y movimientos.",
    icono: "teatro",
    paleta: "coral",
    subgeneros: [
      { id: "teatro-infantil", nombre: "Teatro infantil", icono: "mascara", descripcion: "Obras breves para representar en el aula o en el patio." },
      { id: "guion", nombre: "Guiones", icono: "pluma", descripcion: "Textos con personajes, diálogos y acotaciones." }
    ]
  },
  otros: {
    id: "otros",
    nombre: "Otros recursos",
    eslogan: "Juegos, retos y lecturas para aprender",
    descripcion: "Adivinanzas, trabalenguas, cómics, textos informativos y lecturas de comprensión. La lectura también se juega.",
    icono: "rompecabezas",
    paleta: "turquesa",
    subgeneros: [
      { id: "adivinanza", nombre: "Adivinanzas", icono: "pregunta", descripcion: "Preguntas con pistas para descubrir respuestas." },
      { id: "trabalenguas", nombre: "Trabalenguas", icono: "boca", descripcion: "Frases divertidas para soltar la lengua." },
      { id: "humor", nombre: "Humor", icono: "sonrisa", descripcion: "Chistes y colmos para leer en grupo." },
      { id: "comic", nombre: "Cómics", icono: "comic", descripcion: "Historias contadas con viñetas y diálogos." },
      { id: "lectura-educativa", nombre: "Lecturas educativas", icono: "cerebro", descripcion: "Textos breves con actividades de comprensión." },
      { id: "texto-informativo", nombre: "Textos informativos", icono: "lampara", descripcion: "Textos que explican el mundo con claridad." }
    ]
  }
};

window.BV_NIVELES = [
  {
    id: "preescolar",
    nombre: "Preescolar",
    lema: "Pequeños exploradores",
    descripcion: "Cuentos cortos, colores, canciones y juegos para dar los primeros pasos en la lectura.",
    icono: "cohete",
    paleta: "rosa",
    edad: "3 a 5 años"
  },
  {
    id: "primaria",
    nombre: "Primaria",
    lema: "Grandes aventuras",
    descripcion: "Clásicos, fábulas, poemas y retos para lectores que ya descubrieron el poder de las historias.",
    icono: "castillo",
    paleta: "turquesa",
    edad: "6 a 11 años"
  },
  {
    id: "secundaria",
    nombre: "Secundaria",
    lema: "Descubre nuevos mundos",
    descripcion: "Novelas, leyendas, teatro y lecturas que invitan a pensar, debatir y crear.",
    icono: "planeta",
    paleta: "indigo",
    edad: "12 a 17 años"
  }
];
