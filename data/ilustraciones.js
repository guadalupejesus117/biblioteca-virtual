/* ============================================================
   Biblioteca Virtual · Ilustraciones originales para lecturas
   SVG creados para el proyecto, CC BY-SA 4.0. Sin uso comercial
   de obras de terceros: todo el arte es propio y reutilizable.
   ============================================================ */
(function () {
  "use strict";
  const A = (archivo, alt, titulo = "") => ({
    archivo: `assets/svg/${archivo}`,
    alt,
    titulo
  });

  const B = {
    nube: [A("ilu-nube.svg", "Ilustración de Nube, una nube rosada sonriente sobre un jardín de flores y mariposas.", "Nube aprende a llover"), A("ilu-jardin.svg", "Jardín de flores con números y una mariposa.", "El jardín cobra vida")],
    "dragon-pompas": [A("ilu-dragon.svg", "Dragón turquesa soplando pompas de colores sobre un pueblo.", "Las pompas de Timo"), A("ilu-castillo-magico.svg", "Castillo de cuento iluminado por la luna.", "Un castillo de colores")],
    "luna-papel": [A("ilu-luna.svg", "Niña colgando una luna de papel amarillo frente a una ventana nocturna.", "Una luna para el abuelo"), A("ilu-estrellas.svg", "Cielo nocturno con estrellas y un libro abierto.", "Bajo las estrellas")],
    "jardin-numeros": [A("ilu-jardin.svg", "Jardín de flores con números cantores y una mariposa.", "El jardín de los números"), A("ilu-nube.svg", "Nube rosada sobre las flores del jardín.", "Una tarde de lluvia")],
    "tortuga-liebre": [A("ilu-fabula.svg", "Tortuga y liebre descansando en un bosque.", "La tortuga y la liebre")],
    "leon-raton": [A("ilu-fabula.svg", "Escena de bosque con animales de una fábula.", "El león y el ratón")],
    "cigarra-hormiga": [A("ilu-jardin.svg", "Jardín con flores y números que simbolizan el trabajo constante.", "La cigarra y la hormiga")],
    "zorro-uvas": [A("ilu-bosque-cuento.svg", "Bosque de cuentos con un zorro junto a una casita.", "El zorro y las uvas")],
    "poema-estrella": [A("ilu-estrellas.svg", "Cielo nocturno con estrellas doradas y libros abiertos.", "Canción de la estrella viajera")],
    "poema-libro": [A("ilu-biblioteca-noche.svg", "Biblioteca mágica de noche con libros y un dragón lector.", "El libro que canta")],
    "poema-lluvia": [A("ilu-nube.svg", "Nube pequeña dejando caer gotas sobre un jardín.", "Lluvia de colores")],
    "leyenda-silbon": [A("ilu-castillo-magico.svg", "Castillo de cuento bajo la luna llena.", "El Silbón")],
    "leyenda-llorona": [A("ilu-luna.svg", "Ventana nocturna con una luna de papel amarillo.", "La Llorona")],
    "mito-maiz": [A("ilu-maiz.svg", "Plantas de maíz dorado bajo el sol.", "El regalo del maíz")],
    "teatro-asamblea": [A("ilu-biblioteca-noche.svg", "Biblioteca de noche donde los libros cobran vida.", "La asamblea de los libros")],
    "comic-draco": [A("ilu-dragon.svg", "Dragón turquesa rodeado de pompas de colores.", "Draco y la página 13")],
    colibri: [A("ilu-jardin.svg", "Jardín de flores brillantes con una mariposa.", "El colibrí y la flor de fuego")],
    luciernagas: [A("ilu-estrellas.svg", "Cielo nocturno con luces doradas como luciérnagas.", "Luces vivas")],

    /* Clásicos publicados: arte propio inspirado en la obra, sin usar cubiertas ni ediciones de terceros. */
    alicia: [A("ilu-conejo.svg", "Conejo blanco con reloj corriendo por un prado mágico.", "El Conejo Blanco"), A("ilu-jardin.svg", "Jardín de flores con números y mariposas.", "Un jardín extraño"), A("ilu-bosque-cuento.svg", "Bosque de cuentos con casita y zorro.", "El bosque de las aventuras")],
    espejo: [A("ilu-espejo.svg", "Espejo mágico con marco dorado y piezas de ajedrez.", "La casa del espejo"), A("ilu-castillo-magico.svg", "Castillo de cuento con banderas y luna.", "El reino de Alicia"), A("ilu-jardin.svg", "Jardín de flores vivas.", "Las flores que hablan")],
    pinocho: [A("ilu-marioneta.svg", "Marioneta de madera con sombrero en un taller.", "Maese Cereza y la madera"), A("ilu-bosque-cuento.svg", "Bosque con casita y animales.", "El camino de Pinocho"), A("ilu-mar.svg", "Barco navegando en un mar de aventuras.", "Viaje por el mar")],
    blancanieves: [A("ilu-bosque-cuento.svg", "Bosque profundo con casita y zorro.", "El bosque"), A("ilu-fabula.svg", "Animales del bosque en una escena de cuento.", "Los amigos del bosque")],
    "barba-azul": [A("ilu-castillo-magico.svg", "Castillo oscuro iluminado por la luna.", "La mansion de Barba Azul"), A("ilu-luna.svg", "Ventana nocturna con luna de papel.", "Una puerta prohibida")],
    camisa: [A("ilu-bosque-cuento.svg", "Bosque con casita luminosa.", "El hombre feliz"), A("ilu-nube.svg", "Nube sobre un jardín tranquilo.", "La búsqueda")],
    caperucita: [A("ilu-bosque-cuento.svg", "Bosque de cuentos con un zorro y una casita.", "El camino hacia la abuela"), A("ilu-fabula.svg", "Escena de bosque con animales.", "El lobo en el bosque")],
    durmiente: [A("ilu-castillo-magico.svg", "Castillo de cuento con torres y banderas.", "El castillo dormido"), A("ilu-estrellas.svg", "Cielo estrellado sobre un libro abierto.", "El hechizo")],
    habichuelas: [A("ilu-jardin.svg", "Jardín con plantas que crecen hacia el cielo.", "Las habichuelas mágicas"), A("ilu-castillo-magico.svg", "Castillo entre nubes y estrellas.", "El castillo del gigante")],
    "bella-bestia": [A("ilu-castillo-magico.svg", "Castillo mágico bajo la luna.", "El castillo de la Bestia"), A("ilu-jardin.svg", "Jardín de flores rosadas.", "La rosa encantada")],
    pulgarcito: [A("ilu-bosque-cuento.svg", "Bosque con casita y criaturas pequeñas.", "El bosque de Pulgarcito"), A("ilu-fabula.svg", "Animales del cuento en el bosque.", "Aventuras pequeñas")],
    ruisenor: [A("ilu-jardin.svg", "Jardín de flores con mariposas.", "El ruiseñor y la rosa"), A("ilu-estrellas.svg", "Noche estrellada con un libro abierto.", "La rosa y el canto")],
    margarita: [A("ilu-estrellas.svg", "Cielo lleno de estrellas y libros.", "A Margarita Debayle"), A("ilu-luna.svg", "Luna amarilla junto a una ventana.", "Versos de luz")]
  };

  window.BV_ILUSTRACIONES = B;
})();
