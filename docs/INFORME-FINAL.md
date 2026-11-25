# Informe final · Biblioteca Virtual

## 1. Objetivo

Crear y publicar una biblioteca educativa inmersiva, gratuita y accesible, que permita leer obras clásicas y textos originales con un diseño propio, además de ocho juegos de lectura, sin publicidad, cuentas ni rastreo.

## 2. Análisis de los archivos recibidos

Se analizaron 37 PDF con PyMuPDF, revisandometadata, páginas, texto extraíble, hashes MD5 y avisos de licencia.

| Clasificación real | Cantidad | Decisión |
|---|---:|---|
| Cuentos / narrativa | 14 | 6 clásicos publicados como texto; el resto como ficha |
| Leyendas y mitos | 10 | Ficha informativa; no se redistribuyen |
| Comedia / humor | 9 | Ficha informativa; no se redistribuyen |
| Poesía | 4 | 1 poema clásico publicado como texto; el resto como ficha |
| Textos originales propios | 18 | Publicados bajo CC BY-SA 4.0 |

No se encontraron hashes duplicados. Ningún archivo estaba dañado: todos se pudieron abrir y extraer. `El Principito` se mantuvo fuera de la publicación.

## 3. Cambio de enfoque en la lectura

A petición del usuario, **no se abre el PDF original dentro del sitio**. En su lugar:

1. Se extrajo el texto real de las 13 ediciones autorizadas.
2. Se reconstruyeron párrafos y capítulos a partir de los bloques del PDF (`data/clasicos.js`, ~703 KB).
3. Se descartaron números de página, encabezados, índices y portadas del archivo original.
4. El lector pinta su propia portada, índice, capítulos, tipografía y controles (`js/lector.js`).
5. El botón «Descargar PDF» genera una edición propia mediante la impresión del navegador: portada, índice, capítulos y colofón con la fuente y la licencia.
6. Se crearon 14 ilustraciones SVG originales (`assets/svg/ilu-*.svg`) y un mapa por obra (`data/ilustraciones.js`). Aparecen en la portada del lector y al inicio de cada capítulo, con texto alternativo. No se usan cubiertas ni imágenes de ediciones comerciales.
7. Se añadió el modo «Despejar pantalla»: oculta cabecera, barra, menú, avisos y elementos decorativos; deja únicamente el texto y las ilustraciones. Se sale con el botón flotante o con `Escape`.

Los PDF originales quedaron fuera del repositorio público, en `_analysis/libros_originales`, como fuente de verificación.

## 4. Juegos y PDF descargable

Los ocho juegos están implementados y permiten repetir, reiniciar y usar teclado o pantalla táctil. Cada uno genera una **ficha imprimible** con nombre, fecha, instrucciones, ejercicio y solución para el docente. El resultado de la partida también puede guardarse en PDF.

| Juego | Estado | Interacción verificada |
|---|---|---|
| Sopa de letras | Completo | Arrastra o clic en extremos; palabras marcadas y resultado |
| Crucigrama | Completo | Datos validados sin conflictos; comprobación y pistas |
| Memorama | Completo | Parejas, contador de movimientos y resultado |
| Adivinanzas | Completo | Opciones, pistas, explicaciones y puntuación |
| Trabalenguas | Completo | Voz, velocidad lenta, retos y cronómetro |
| Rompecabezas | Completo | Deslizamiento, mezcla, niveles 3×3 a 5×5 |
| Comprensión lectora | Completo | Texto, voz, preguntas y explicaciones |
| Completa la palabra | Completo | Banco de letras, comprobación y 8 rondas |

También se puede descargar en PDF el reporte de progreso (estrellas, logros y libros en curso) y los diplomas.

## 5. Pruebas automatizadas

Se sirvió el sitio con `python -m http.server` y se probó con Edge + Playwright a 1280×900 y 1365×900.

- 29 rutas visitadas sin errores de consola ni excepciones (`_analysis/errores_navegador.json`).
- 9 pruebas funcionales: resolución de crucigrama, sopa de letras, memorama, rompecabezas, comprensión, completa la palabra y las tres vistas de impresión (`_analysis/pruebas_juegos.json`).
- Interacción del lector: cambiar escala, marcar libro terminado y comprobar progreso.
- Las vistas de impresión muestran solo el contenido generado y ocultan menús, controles y avisos.

## 6. Privacidad y licencias

- Todo el progreso vive en `LocalStorage` del dispositivo. No hay formularios de registro, publicidad, rastreadores ni claves de API.
- La voz usa `speechSynthesis` del navegador: el texto no se envía a ningún servidor.
- Contenido propio: CC BY-SA 4.0.
- Clásicos: consulta educativa, cultural y no lucrativa citando a la Biblioteca Digital ILCE.
- Iconos Lucide: ISC. Tipografías Baloo 2 y Nunito: SIL OFL 1.1.

## 7. Limitaciones

- La voz depende de que el navegador incluya voces en español; Edge y Chrome suelen incluirlas.
- «Guardar como PDF» depende del diálogo de impresión del navegador, no de una librería de generación de PDF.
- La extracción automática de texto puede simplificar algunos poemas interiores de las novelas; se conserva el sentido y el orden de los capítulos.
- El progreso se pierde si se borran los datos del sitio en el navegador.
