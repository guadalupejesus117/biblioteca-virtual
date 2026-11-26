# Revisión de lecturas, voz y rendimiento

## Contenido

Se reconstruyeron los 13 clásicos abiertos a partir de las ediciones de Biblioteca
Digital ILCE enlazadas en `data/fuentes.json`. Ese manifiesto incluye las huellas
SHA-256 de los PDF utilizados y el número de páginas de cada edición.
Se recuperaron líneas y pasajes omitidos por la extracción anterior, sin redactar
continuaciones ni sustituirlos por resúmenes. Se retiraron cabeceras, números de
página, separadores de asteriscos y avisos legales del cuerpo narrado; la atribución
se conserva en la ficha y en el colofón del PDF generado.

- Pinocho: 36 secciones narrativas, con numeración consecutiva. El PDF fuente
  repite algunos números y contiene la errata «CAPTULO»; el índice de navegación
  corrige esos encabezados sin cambiar la narración.
- Alicia: 12 capítulos y el poema inicial. Se reunió el título partido del capítulo 3.
- A través del espejo: 12 capítulos.
- A Margarita Debayle: recuperación de versos como «lleva esencia sutil de azahar»
  y «en el alma una alondra cantar», ausentes en la extracción previa.
- Los demás cuentos conservan el texto de la edición consultada, incluidas
  moralejas y notas editoriales. No se afirma que estas ediciones sean críticas,
  primeras ediciones o traducciones definitivas.

Se incorporaron 13 portadas tomadas de la primera página de esas mismas ediciones,
comprimidas en WebP. No son portadas inventadas ni se etiquetan como primeras
ediciones. Los cuentos y adaptaciones propios mantienen sus ilustraciones y se
identifican como «Versión propia». Las 24 fichas restringidas siguen siendo fichas.

## Funcionamiento

- Limpieza compartida del texto narrado: separadores y marcas Markdown no se leen.
- Voz en español según disponibilidad del dispositivo, velocidad configurada y
  fragmentos de hasta 220 caracteres para evitar locuciones excesivamente largas.
- Se cancela la locución al salir, cambiar de página o volver a paginar.
- Cada clásico se carga por separado; la portada y el texto visitados se guardan
  en la caché. Un libro nunca abierto requiere conexión para su primera descarga.
- Paginación sin mediciones de layout por cada párrafo. Se conserva todo el texto;
  cada página admite desplazamiento vertical si el contenido supera la pantalla.
- Impresión preparada al solicitarla; las páginas terminadas del exportador se
  comprimen antes de continuar, evitando conservar cientos de lienzos completos.
- El PDF descargado sigue siendo una edición diseñada con páginas rasterizadas,
  como en el exportador existente; no es el PDF original ni texto seleccionable.
- La versión de caché se actualizó. No se borran favoritos, logros ni lecturas;
  el nuevo paginador utiliza posiciones propias y toma el porcentaje anterior
  como aproximación cuando no existe una posición de la nueva versión.

## Verificación realizada

Edge/Chromium sin interfaz, escritorio 1280 × 900 y móvil 390 × 844:

- Apertura y navegación de los 13 clásicos sin errores de JavaScript.
- Inicio sin descargar el agregado antiguo de todos los clásicos.
- Narración simulada de principio a fin de Margarita: 88 locuciones, sin
  asteriscos y respetando velocidad 0.8. Se verifica lo que recibe el sintetizador;
  no constituye una evaluación auditiva de todas las voces del sistema.
- Recorrido de las 317 páginas móviles de Pinocho: igualdad exacta de los 223 930
  caracteres normalizados de sus párrafos, sin omisiones ni duplicados.
- Reapertura en la posición guardada, selección del último capítulo y reajuste móvil.
- Descarga de Margarita: PDF de 5 páginas; reapertura offline del libro visitado.
- Descarga de Pinocho: PDF de 160 páginas generado en aproximadamente 14 segundos
  en este equipo. No es una garantía de tiempo para otros dispositivos.
- Revisión visual de las 13 portadas, lector móvil y páginas del PDF.
- Comprobación de sintaxis de JavaScript, `git diff --check` y regresiones de voz,
  versos recuperados, finales, número de capítulos y existencia de portadas.

## Repetir las pruebas

```sh
node tests/regresiones.cjs
python -m http.server 8001
```

En otra terminal, con el paquete Python `playwright` instalado:

```sh
python tests/navegador.py
python tests/lectura_completa.py
```

`BV_BASE_URL` permite indicar otro servidor y `BV_BROWSER` la ruta del navegador.
Las pruebas guardan capturas y el PDF de muestra en `work/`, excluido de Git.
