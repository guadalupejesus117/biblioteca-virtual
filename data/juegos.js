/* ============================================================
   Biblioteca Virtual · Contenido de los juegos
   Adivinanzas y trabalenguas: material original y de tradición
   oral. Las adaptaciones y textos nuevos son CC BY-SA 4.0.
   ============================================================ */
window.BV_JUEGOS = {
  /* ---------------- SOPAS DE LETRAS ---------------- */
  sopas: [
    {
      id: "animales",
      titulo: "Animales del bosque",
      tema: "animales",
      nivel: "facil",
      tamano: 8,
      direcciones: ["H", "V"],
      palabras: ["DRAGON", "BUHO", "ZORRO", "RANA", "GATO", "LOBO", "OSO", "PATO"],
      descripcion: "Busca ocho animales que viven en los cuentos y en el bosque."
    },
    {
      id: "libros",
      titulo: "Palabras de biblioteca",
      tema: "libros",
      nivel: "medio",
      tamano: 10,
      direcciones: ["H", "V", "HINV", "VINV"],
      palabras: ["LIBRO", "CUENTO", "POEMA", "AUTOR", "PAGINA", "TAPA", "LECTOR", "BIBLIOTECA"],
      descripcion: "Ocho palabras que encontrarás en cualquier biblioteca."
    },
    {
      id: "magia",
      titulo: "Hechizos y castillos",
      tema: "magia",
      nivel: "medio",
      tamano: 10,
      direcciones: ["H", "V", "HINV", "VINV"],
      palabras: ["MAGIA", "HADA", "DRAGON", "CASTILLO", "ESTRELLA", "VARITA", "HECHIZO", "REINO"],
      descripcion: "Un tablero lleno de fantasía para pequeños magos."
    },
    {
      id: "naturaleza",
      titulo: "Naturaleza viva",
      tema: "naturaleza",
      nivel: "facil",
      tamano: 8,
      direcciones: ["H", "V"],
      palabras: ["ARBOL", "FLOR", "RIO", "NUBE", "SOL", "LUNA", "MAR", "MONTE"],
      descripcion: "Ocho palabras del mundo natural."
    },
    {
      id: "valores",
      titulo: "Palabras que construyen",
      tema: "valores",
      nivel: "dificil",
      tamano: 12,
      direcciones: ["H", "V", "HINV", "VINV", "DIAG", "DIAGINV"],
      palabras: ["AMISTAD", "RESPETO", "BONDAD", "EMPATIA", "GRATITUD", "PACIENCIA", "VALENTIA", "HONESTIDAD"],
      descripcion: "Un reto para encontrar valores que nos hacen mejores."
    },
    {
      id: "latinoamerica",
      titulo: "Voces de Latinoamérica",
      tema: "latinoamerica",
      nivel: "dificil",
      tamano: 12,
      direcciones: ["H", "V", "HINV", "VINV", "DIAG", "DIAGINV"],
      palabras: ["ANDES", "AMAZONAS", "QUETZAL", "MAIZ", "CONDOR", "SELVA", "RIO", "SOL"],
      descripcion: "Paisajes, animales y palabras de nuestra región."
    }
  ],

  /* ---------------- CRUCIGRAMAS ---------------- */
  crucigramas: [
    {
      id: "cielo",
      titulo: "Palabras del cielo",
      nivel: "facil",
      filas: 5,
      columnas: 10,
      palabras: [
        { answer: "NUBE", row: 0, col: 4, dir: "V", num: 1, clue: "Flota en el cielo y puede llover." },
        { answer: "FLOR", row: 1, col: 2, dir: "V", num: 2, clue: "Nace en el jardín y perfuma." },
        { answer: "SOL", row: 1, col: 6, dir: "V", num: 3, clue: "Estrella que ilumina el día." },
        { answer: "LIBRO", row: 2, col: 2, dir: "H", num: 4, clue: "Tiene páginas e historias." },
        { answer: "LUNA", row: 3, col: 6, dir: "H", num: 5, clue: "Satélite natural de la Tierra." },
        { answer: "MAR", row: 4, col: 0, dir: "H", num: 6, clue: "Inmensa masa de agua salada." }
      ]
    },
    {
      id: "fantasia",
      titulo: "Reino de fantasía",
      nivel: "medio",
      filas: 12,
      columnas: 11,
      palabras: [
        { answer: "BOSQUE", row: 0, col: 0, dir: "V", num: 1, clue: "Lugar lleno de árboles." },
        { answer: "DRAGON", row: 4, col: 3, dir: "V", num: 2, clue: "Animal fantástico que echa fuego." },
        { answer: "CASTILLO", row: 4, col: 7, dir: "V", num: 3, clue: "Fortaleza de reyes y princesas." },
        { answer: "ESTRELLA", row: 5, col: 0, dir: "H", num: 4, clue: "Brilla en el cielo nocturno." },
        { answer: "MAGIA", row: 7, col: 1, dir: "H", num: 5, clue: "Hechizos y trucos fantásticos." },
        { answer: "LIBRO", row: 8, col: 6, dir: "H", num: 6, clue: "Tiene páginas e historias." },
        { answer: "RATON", row: 11, col: 4, dir: "H", num: 7, clue: "Roedor pequeño de cola larga." }
      ]
    },
    {
      id: "biblioteca",
      titulo: "El gran crucigrama literario",
      nivel: "dificil",
      filas: 14,
      columnas: 14,
      palabras: [
        { answer: "MISTERIO", row: 0, col: 5, dir: "V", num: 1, clue: "Algo que aún no tiene explicación." },
        { answer: "IMAGINACION", row: 3, col: 1, dir: "V", num: 2, clue: "Capacidad de crear mundos en la mente." },
        { answer: "BIBLIOTECA", row: 7, col: 0, dir: "H", num: 3, clue: "Lugar donde viven muchos libros." },
        { answer: "LEYENDA", row: 7, col: 3, dir: "V", num: 4, clue: "Relato tradicional con algo de misterio." },
        { answer: "TEATRO", row: 7, col: 6, dir: "V", num: 5, clue: "Arte de representar historias en escena." },
        { answer: "AVENTURA", row: 9, col: 6, dir: "H", num: 6, clue: "Viaje lleno de riesgos y descubrimientos." },
        { answer: "POESIA", row: 12, col: 5, dir: "H", num: 7, clue: "Texto que juega con el ritmo y las imágenes." }
      ]
    }
  ],

  /* ---------------- MEMORAMA ---------------- */
  memorama: {
    pares: [
      { id: "dragon", nombre: "Dragón", icono: "dragon" },
      { id: "castillo", nombre: "Castillo", icono: "castillo" },
      { id: "libro", nombre: "Libro", icono: "libro" },
      { id: "estrella", nombre: "Estrella", icono: "estrella" },
      { id: "buho", nombre: "Búho", icono: "buho" },
      { id: "llave", nombre: "Llave", icono: "llave" },
      { id: "rosa", nombre: "Rosa", icono: "rosa" },
      { id: "corona", nombre: "Corona", icono: "corona" },
      { id: "luna", nombre: "Luna", icono: "luna" },
      { id: "barco", nombre: "Barco", icono: "barco" }
    ]
  },

  /* ---------------- ADIVINANZAS ---------------- */
  adivinanzas: [
    {
      id: "ad1", nivel: "preescolar", tema: "biblioteca",
      pregunta: "Tengo hojas y no soy árbol; tengo historias y no soy abuela. ¿Qué soy?",
      respuesta: "libro", alternativas: ["libro", "cuaderno", "ventana", "árbol"],
      pista: "Lo abres para leer y lo cierras para guardarlo.",
      explicacion: "El libro tiene hojas de papel y guarda historias, pero no es un árbol ni una persona."
    },
    {
      id: "ad2", nivel: "preescolar", tema: "cielo",
      pregunta: "Salgo de noche, brillo sin bombilla y a veces parezco un plátano. ¿Quién soy?",
      respuesta: "luna", alternativas: ["luna", "sol", "estrella", "nube"],
      pista: "Cambia de forma durante el mes.",
      explicacion: "La Luna refleja la luz del Sol y desde la Tierra vemos sus fases."
    },
    {
      id: "ad3", nivel: "preescolar", tema: "animales",
      pregunta: "Soy pequeño, llevo mi casa a cuestas y camino muy despacio. ¿Quién soy?",
      respuesta: "caracol", alternativas: ["caracol", "tortuga", "hormiga", "araña"],
      pista: "Mi casa es una concha en espiral.",
      explicacion: "El caracol lleva su concha sobre el cuerpo y se desplaza lentamente."
    },
    {
      id: "ad4", nivel: "preescolar", tema: "frutas",
      pregunta: "Verde por fuera, roja por dentro y con muchas semillas negras. ¿Qué fruta soy?",
      respuesta: "sandía", alternativas: ["sandía", "manzana", "fresa", "uva"],
      pista: "Soy grande y refrescante en verano.",
      explicacion: "La sandía es verde por fuera y roja por dentro, con semillas negras o blancas."
    },
    {
      id: "ad5", nivel: "primaria", tema: "objetos",
      pregunta: "Tengo agujas y no coso; tengo números y no cuento. ¿Qué soy?",
      respuesta: "reloj", alternativas: ["reloj", "brújula", "libro", "ventana"],
      pista: "Sirve para saber la hora.",
      explicacion: "El reloj tiene agujas y números, pero no cose ni cuenta historias."
    },
    {
      id: "ad6", nivel: "primaria", tema: "naturaleza",
      pregunta: "Vuelo sin alas, lloro sin ojos y riego los campos. ¿Qué soy?",
      respuesta: "nube", alternativas: ["nube", "viento", "pájaro", "río"],
      pista: "Cuando me pongo gris, puede caer lluvia.",
      explicacion: "Las nubes están formadas por gotas de agua y pueden producir lluvia."
    },
    {
      id: "ad7", nivel: "primaria", tema: "frutas",
      pregunta: "Tengo corona y no soy rey; tengo escamas y no soy pez. ¿Qué soy?",
      respuesta: "piña", alternativas: ["piña", "naranja", "alcachofa", "dragón"],
      pista: "Soy amarilla por dentro y tengo hojas puntiagudas.",
      explicacion: "La piña tiene una corona de hojas y una piel con escamas."
    },
    {
      id: "ad8", nivel: "primaria", tema: "biblioteca",
      pregunta: "Cuanto más grande, menos se ve. ¿Qué es?",
      respuesta: "la oscuridad", alternativas: ["la oscuridad", "la luna", "el silencio", "la sombra"],
      pista: "Aparece cuando apagas la luz.",
      explicacion: "La oscuridad ocupa más espacio cuanto menos luz hay."
    },
    {
      id: "ad9", nivel: "primaria", tema: "animales",
      pregunta: "Soy el animal más grande del planeta y vivo en el mar. ¿Quién soy?",
      respuesta: "ballena azul", alternativas: ["ballena azul", "delfín", "tiburón", "elefante"],
      pista: "No soy un pez; respiro aire.",
      explicacion: "La ballena azul es un mamífero marino y el animal más grande conocido."
    },
    {
      id: "ad10", nivel: "primaria", tema: "objetos",
      pregunta: "Tengo dientes pero no muerdo; sirvo para peinar. ¿Qué soy?",
      respuesta: "peine", alternativas: ["peine", "tenedor", "cepillo", "sierra"],
      pista: "Lo usas por la mañana.",
      explicacion: "El peine tiene dientes que ordenan el cabello, pero no muerde."
    },
    {
      id: "ad11", nivel: "primaria", tema: "naturaleza",
      pregunta: "Soy transparente, no tengo color ni sabor y soy necesaria para vivir. ¿Qué soy?",
      respuesta: "el agua", alternativas: ["el agua", "el aire", "el vidrio", "la sal"],
      pista: "La bebes todos los días.",
      explicacion: "El agua es transparente, no tiene sabor y es esencial para la vida."
    },
    {
      id: "ad12", nivel: "secundaria", tema: "lengua",
      pregunta: "Soy una palabra que une ideas y también un tren que engancha vagones. ¿Qué soy?",
      respuesta: "conjunción", alternativas: ["conjunción", "preposición", "sustantivo", "adjetivo"],
      pista: "En gramática, une palabras o frases.",
      explicacion: "La conjunción es una palabra que enlaza ideas, como 'y', 'pero' o 'aunque'."
    },
    {
      id: "ad13", nivel: "secundaria", tema: "ciencia",
      pregunta: "No se ve, no se toca, pero ocupa espacio y tiene masa. ¿Qué es?",
      respuesta: "la materia", alternativas: ["la materia", "la energía", "la luz", "el tiempo"],
      pista: "Todo lo que nos rodea está hecho de ella.",
      explicacion: "La materia es todo lo que tiene masa y volumen."
    },
    {
      id: "ad14", nivel: "secundaria", tema: "biblioteca",
      pregunta: "Nací antes que el papel, viajé de boca en boca y puedo cambiar en cada versión. ¿Qué soy?",
      respuesta: "la tradición oral", alternativas: ["la tradición oral", "la imprenta", "la novela", "la biblioteca"],
      pista: "Los cuentos y leyendas antiguos se transmitían así.",
      explicacion: "La tradición oral transmite relatos de generación en generación sin necesidad de escritura."
    },
    {
      id: "ad15", nivel: "secundaria", tema: "ciencia",
      pregunta: "Tengo forma de espiral y guardo la información de los seres vivos. ¿Qué soy?",
      respuesta: "el ADN", alternativas: ["el ADN", "el corazón", "la neurona", "la célula"],
      pista: "Se parece a una escalera retorcida.",
      explicacion: "El ADN tiene una estructura de doble hélice y contiene la información genética."
    },
    {
      id: "ad16", nivel: "primaria", tema: "cielo",
      pregunta: "Aparezco después de la lluvia, con muchos colores y forma de arco. ¿Qué soy?",
      respuesta: "el arcoíris", alternativas: ["el arcoíris", "el relámpago", "la nube", "el amanecer"],
      pista: "Necesito sol y gotas de agua.",
      explicacion: "El arcoíris se forma cuando la luz del Sol se refracta en las gotas de agua."
    }
  ],

  /* ---------------- TRABALENGUAS ---------------- */
  trabalenguas: [
    { id: "t1", nivel: "facil", texto: "Tres tristes tigres tragaban trigo en un trigal.", fuente: "Tradicional", reto: "Dilo tres veces sin equivocarte." },
    { id: "t2", nivel: "facil", texto: "El perro de San Roque no tiene rabo porque Ramón Ramírez se lo ha cortado.", fuente: "Tradicional", reto: "Inténtalo cada vez más rápido." },
    { id: "t3", nivel: "facil", texto: "Pepe Peña pela papa, pica piña, pita un pito, pica pan.", fuente: "Tradicional", reto: "Marca el ritmo con palmadas." },
    { id: "t4", nivel: "facil", texto: "Pablito clavó un clavito en la calva de un calvito.", fuente: "Tradicional", reto: "Pronuncia bien la V y la B." },
    { id: "t5", nivel: "medio", texto: "Cuando cuentes cuentos, cuenta cuántos cuentos cuentas, porque si no cuentas cuántos cuentos cuentas, nunca sabrás cuántos cuentos contaste.", fuente: "Tradicional", reto: "Cuenta con los dedos mientras lo dices." },
    { id: "t6", nivel: "medio", texto: "El cielo está enladrillado. ¿Quién lo desenladrillará? El desenladrillador que lo desenladrille buen desenladrillador será.", fuente: "Tradicional", reto: "Haz una pausa en cada signo de puntuación." },
    { id: "t7", nivel: "medio", texto: "María Chucena techaba su choza y un techador que pasaba le dijo: «María Chucena, ¿techas tu choza o techas la ajena?».", fuente: "Tradicional", reto: "No confundas choza con ajenas." },
    { id: "t8", nivel: "medio", texto: "Si seis sillas son sillas, seis sillas son las que sillas son; si las sillas no son sillas, no son sillas las seis que son.", fuente: "Original", reto: "Separa muy bien la S de la C." },
    { id: "t9", nivel: "medio", texto: "Dragón Dragomiro dragonea con su dragona: drago, drogo, droguen, droguen, ¡que el dragón se desengruñe!", fuente: "Original", reto: "Juega con el sonido DR." },
    { id: "t10", nivel: "dificil", texto: "El volcán de Parangaricutirimícuaro se quiere desparangaricutirimicuarizar; el desparangaricutirimicuarizador que lo desparangaricutirimicuarice, buen desparangaricutirimicuarizador será.", fuente: "Tradicional", reto: "El reto clásico de las palabras largas." },
    { id: "t11", nivel: "dificil", texto: "Compré pocas copas, pocas copas compré; como compré pocas copas, pocas copas pagaré.", fuente: "Tradicional", reto: "Mantén el ritmo sin perder la P." },
    { id: "t12", nivel: "dificil", texto: "El arzobispo de Constantinopla se quiere desconstantinopolizar; el desconstantinopolizador que lo desconstantinopolice, buen desconstantinopolizador será.", fuente: "Tradicional", reto: "Dilo primero despacio y luego rápido." },
    { id: "t13", nivel: "dificil", texto: "Un buey bebía en el río y una abeja vio al buey; la abeja dijo: «Buey, bebe, que la bebida es buena y el brebaje no es de brea».", fuente: "Original", reto: "Distingue la B de la V." },
    { id: "t14", nivel: "medio", texto: "La llave de la biblioteca abre la ventana que ventila la sala donde la luna ilumina la lámpara.", fuente: "Original", reto: "Repite la L sin enredarte." },
    { id: "t15", nivel: "facil", texto: "Rosa Rizo riza rosas; rosas riza Rosa Rizo.", fuente: "Original", reto: "Suena la R suave y fuerte." }
  ],

  /* ---------------- ROMPECABEZAS ---------------- */
  rompecabezas: [
    { id: "castillo", titulo: "El castillo de los libros", escena: "castillo", niveles: [3, 4, 5], descripcion: "Un castillo con torres, banderas y una luna curiosa." },
    { id: "bosque", titulo: "Bosque de cuentos", escena: "bosque", niveles: [3, 4, 5], descripcion: "Árboles, setas y una luz que guía el camino." },
    { id: "mar", titulo: "Mar de aventuras", escena: "mar", niveles: [3, 4, 5], descripcion: "Un barco, olas y un sol que se asoma." }
  ],

  /* ---------------- COMPRENSIÓN LECTORA ---------------- */
  comprension: [
    {
      id: "colibri-juego",
      titulo: "El colibrí y la flor de fuego",
      nivel: "primaria",
      textoId: "colibri",
      texto: "Cada mañana, el colibrí Timo visita las flores del jardín. Un día encuentra una flor roja que brilla como una brasa. «Si te acercas, te quemarás», le advierte la mariposa. Timo no huye: se queda quieto y observa. Descubre que la flor no quema; lo que brilla son miles de gotitas de rocío que reflejan el sol. Con cuidado, mete el pico y toma el néctar. Al volar, lleva polen en las plumas y ayuda a que nazcan nuevas flores. Desde entonces, Timo visita la flor de fuego todas las mañanas y comparte el secreto con sus amigos: no todo lo que brilla es peligroso; a veces solo pide ser mirado con calma.",
      preguntas: [
        { pregunta: "¿Qué creía la mariposa sobre la flor?", opciones: ["Que era peligrosa", "Que era de plástico", "Que no tenía néctar", "Que estaba marchita"], correcta: 0, explicacion: "La mariposa le advierte que si se acerca se quemará; por eso cree que es peligrosa." },
        { pregunta: "¿Qué era en realidad el brillo de la flor?", opciones: ["Fuego", "Rocío reflejando el sol", "Pintura", "Una lámpara"], correcta: 1, explicacion: "Timo observa con calma y descubre que el brillo viene de las gotitas de rocío." },
        { pregunta: "¿Qué hace Timo al volar?", opciones: ["Lleva polen y ayuda a las flores", "Canta una canción", "Se lleva la flor", "Apaga el sol"], correcta: 0, explicacion: "El texto dice que lleva polen en las plumas y ayuda a que nazcan nuevas flores." },
        { pregunta: "¿Cuál es la enseñanza principal?", opciones: ["No acercarse a las flores", "Observar antes de juzgar", "Volar muy rápido", "Evitar a las mariposas"], correcta: 1, explicacion: "Timo descubre que no todo lo que brilla es peligroso; a veces solo pide ser mirado con calma." }
      ]
    },
    {
      id: "luciernagas-juego",
      titulo: "¿Por qué brillan las luciérnagas?",
      nivel: "primaria",
      textoId: "luciernagas",
      texto: "En una noche de verano, junto al río, cientos de luciérnagas encienden y apagan sus luces. Ese brillo se llama bioluminiscencia. Ocurre cuando una sustancia llamada luciferina se combina con oxígeno dentro del cuerpo del insecto, con ayuda de una enzima. La energía se transforma en luz, casi sin calor. Las luciérnagas usan esa luz para comunicarse: los machos y las hembras se buscan, y algunas especies advierten que no saben bien. También les sirve para defenderse de depredadores. La luz no contamina y es muy eficiente: por eso los científicos la estudian para crear lámparas más ahorradoras. La próxima vez que veas una luciérnaga, recuerda que estás viendo una pequeña central de luz viva.",
      preguntas: [
        { pregunta: "¿Cómo se llama el fenómeno de la luz de las luciérnagas?", opciones: ["Fotosíntesis", "Bioluminiscencia", "Reflexión", "Electricidad"], correcta: 1, explicacion: "El texto lo llama bioluminiscencia." },
        { pregunta: "¿Qué sustancia se combina con oxígeno?", opciones: ["Clorofila", "Luciferina", "Melanina", "Glucosa"], correcta: 1, explicacion: "La luciferina se combina con oxígeno gracias a una enzima." },
        { pregunta: "¿Para qué usan la luz las luciérnagas?", opciones: ["Para comunicarse y defenderse", "Para leer de noche", "Para calentar el agua", "Para hacer fotos"], correcta: 0, explicacion: "Les sirve para buscar pareja y advertir a los depredadores." },
        { pregunta: "¿Por qué los científicos las estudian?", opciones: ["Para crear lámparas eficientes", "Para hacer fuego", "Para pintar el río", "Para alimentar peces"], correcta: 0, explicacion: "Su luz es muy eficiente y podría inspirar lámparas más ahorradoras." }
      ]
    },
    {
      id: "faro-juego",
      titulo: "El faro y la tormenta",
      nivel: "secundaria",
      textoId: null,
      texto: "Durante años, el faro de Punta Serena guió a los barcos con su luz intermitente. Una noche de tormenta, el viento rompió el mecanismo y el faro quedó a oscuras. El viejo farero subió las escaleras con una lámpara de aceite, pero la llama era demasiado pequeña para verse desde el mar. Entonces tuvo una idea: pidió a los habitantes del pueblo que encendieran una luz en cada ventana. Esa noche, cien puntos de luz dibujaron un camino en la costa. Los barcos encontraron el puerto y nadie naufragó. Al día siguiente, el farero escribió en su cuaderno: «Un faro no es solo una torre; es una comunidad que decide no dejar a nadie en la oscuridad».",
      preguntas: [
        { pregunta: "¿Qué avería sufrió el faro?", opciones: ["Se rompió el mecanismo de luz", "Se inundó el puerto", "Se cayó la torre", "Se quedó sin pintura"], correcta: 0, explicacion: "El viento rompió el mecanismo y el faro quedó a oscuras." },
        { pregunta: "¿Qué hizo el farero para ayudar a los barcos?", opciones: ["Encender una fogata en la playa", "Pedir luces en las ventanas del pueblo", "Tocar una campana", "Llamar a otro faro"], correcta: 1, explicacion: "Pidió a los habitantes que encendieran una luz en cada ventana." },
        { pregunta: "¿Qué significa la frase final del farero?", opciones: ["Que el faro es una torre alta", "Que la comunidad también guía y protege", "Que la luz eléctrica es mejor", "Que los barcos deben navegar de día"], correcta: 1, explicacion: "La frase destaca que la unión de la comunidad puede salvar vidas." },
        { pregunta: "¿Cuál es el tema central del relato?", opciones: ["La solidaridad", "La velocidad de los barcos", "La historia de la electricidad", "La pesca"], correcta: 0, explicacion: "El pueblo se organiza para ayudar; el tema es la solidaridad." }
      ]
    }
  ],

  /* ---------------- COMPLETA LA PALABRA ---------------- */
  completa: [
    { palabra: "SOL", pista: "Estrella que ilumina el día.", nivel: "preescolar", categoria: "cielo" },
    { palabra: "LUNA", pista: "Satélite natural de la Tierra.", nivel: "preescolar", categoria: "cielo" },
    { palabra: "GATO", pista: "Animal doméstico que dice miau.", nivel: "preescolar", categoria: "animales" },
    { palabra: "FLOR", pista: "Nace en el jardín y perfuma.", nivel: "preescolar", categoria: "naturaleza" },
    { palabra: "MAR", pista: "Gran masa de agua salada.", nivel: "preescolar", categoria: "naturaleza" },
    { palabra: "OSO", pista: "Animal grande y peludo que come miel.", nivel: "preescolar", categoria: "animales" },
    { palabra: "PATO", pista: "Ave que nada y hace cuac.", nivel: "preescolar", categoria: "animales" },
    { palabra: "NUBE", pista: "Flota en el cielo y puede llover.", nivel: "preescolar", categoria: "cielo" },
    { palabra: "LIBRO", pista: "Tiene páginas e historias.", nivel: "primaria", categoria: "biblioteca" },
    { palabra: "DRAGON", pista: "Animal fantástico que echa fuego.", nivel: "primaria", categoria: "fantasía" },
    { palabra: "CASTILLO", pista: "Fortaleza de reyes y princesas.", nivel: "primaria", categoria: "fantasía" },
    { palabra: "AMIGO", pista: "Persona con quien compartes juegos y risas.", nivel: "primaria", categoria: "valores" },
    { palabra: "ESCUELA", pista: "Lugar donde aprendes y compartes.", nivel: "primaria", categoria: "escuela" },
    { palabra: "JARDIN", pista: "Lugar con plantas y flores.", nivel: "primaria", categoria: "naturaleza" },
    { palabra: "PLANETA", pista: "Cuerpo celeste que gira alrededor de una estrella.", nivel: "primaria", categoria: "ciencia" },
    { palabra: "ESTRELLA", pista: "Brilla en el cielo nocturno.", nivel: "primaria", categoria: "cielo" },
    { palabra: "BIBLIOTECA", pista: "Lugar donde viven muchos libros.", nivel: "secundaria", categoria: "biblioteca" },
    { palabra: "AVENTURA", pista: "Viaje lleno de riesgos y descubrimientos.", nivel: "secundaria", categoria: "literatura" },
    { palabra: "IMAGINACION", pista: "Capacidad de crear mundos en la mente.", nivel: "secundaria", categoria: "literatura" },
    { palabra: "MISTERIO", pista: "Algo que aún no tiene explicación.", nivel: "secundaria", categoria: "literatura" },
    { palabra: "LEYENDA", pista: "Relato tradicional con algo de misterio.", nivel: "secundaria", categoria: "literatura" },
    { palabra: "POESIA", pista: "Texto que juega con el ritmo y las imágenes.", nivel: "secundaria", categoria: "literatura" },
    { palabra: "HONESTIDAD", pista: "Decir la verdad y actuar con rectitud.", nivel: "secundaria", categoria: "valores" },
    { palabra: "VALENTIA", pista: "Fuerza para enfrentar el miedo.", nivel: "secundaria", categoria: "valores" }
  ]
};

window.BV_JUEGOS.sopas.push(...[{"id":"primeras-letras","titulo":"Mis primeras palabras","tema":"letras","nivel":"facil","tamano":5,"direcciones":["H","V"],"palabras":["SOL","PAN","OSO","MAR"],"descripcion":"Cuatro palabras cortas para empezar a leer."},{"id":"ciencia","titulo":"Exploradores de ciencia","tema":"ciencia","nivel":"medio","tamano":10,"direcciones":["H","V","DIAG"],"palabras":["AGUA","ENERGIA","PLANETA","CELULA","LUZ","ATOMO"],"descripcion":"Encuentra palabras de ciencia."},{"id":"tecnologia","titulo":"Desafío tecnológico","tema":"tecnologia","nivel":"dificil","tamano":14,"direcciones":["H","V","HINV","VINV","DIAG","DIAGINV"],"palabras":["ALGORITMO","PROGRAMACION","ROBOTICA","INTERNET","SISTEMA","DATOS","PRIVACIDAD"],"descripcion":"Un desafío de vocabulario tecnológico."}]);