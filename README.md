# Biblioteca Virtual

Una biblioteca mágica, gratuita y accesiva para estudiantes de preescolar, primaria y secundaria. Incluye clásicos, cuentos, poemas, leyendas, fábulas, teatro y ocho juegos educativos. Funciona sin cuentas, sin publicidad y sin rastreo.

## Cómo verla

Abre el enlace de GitHub Pages del repositorio. Para probarla en local:

```powershell
cd biblioteca-virtual
python -m http.server 8000
```

Después visita `http://localhost:8000`.

> No abras `index.html` con doble clic: los SVG externos y el service worker necesitan servirse por HTTP.

## Qué incluye

- **Lectura propia:** el texto de los clásicos se extrajo de ediciones autorizadas y se muestra con portada, capítulos, índice, progreso, tamaño de texto, lectura en voz alta e **ilustraciones originales** por capítulo. El PDF original **no se incrusta ni se abre**.
- **Modo lectura:** el botón «Despejar pantalla» oculta menús, barra y elementos decorativos para dejar solo el texto y las ilustraciones. Sal con el botón flotante o con `Escape`.
- **PDF diseñado:** el botón «Descargar PDF» abre la impresión del navegador; elige *Guardar como PDF*. Se genera una edición con portada, índice, capítulos y créditos, creada por la biblioteca.
- **8 juegos:** sopa de letras, crucigrama, memorama, adivinanzas, trabalenguas, rompecabezas, comprensión lectora y completa la palabra. Cada juego tiene ficha imprimible/descargable y guarda estrellas y logros.
- **Gamificación:** estrellas, 18 logros, 5 diplomas imprimibles, racha de visitas y progreso de lectura guardado en `LocalStorage`.
- **Accesibilidad:** tema claro/oscuro/del sistema, alto contraste, reducción de movimiento, voz en español con velocidad ajustable, teclado, lectores de pantalla y soporte táctil.
- **Sin dependencias externas en tiempo de ejecución:** tipografías, iconos y datos son locales.

## Estructura

```
index.html            Aplicación (SPA por hash)
css/                  Diseño, páginas, juegos, lector y ajustes
js/                   Núcleo, componentes, páginas, lector, juegos y router
data/                 Catálogo, textos originales, clásicos extraídos, juegos y logros
assets/               Ilustraciones SVG, iconos y tipografías con licencia
docs/                 Informe final y detalles de derechos
```

## Derechos y contenidos

- 37 PDFs fueron analizados por su contenido real. Solo 13 ediciones de dominio público o autorizadas por la Biblioteca Digital ILCE se publican como texto estructurado, con uso educativo, cultural y no lucrativo citando la fuente.
- Los otros 24 archivos están catalogados solo como ficha: no se redistribuyen ni se publican.
- Los textos, cuentos, adaptaciones, ilustraciones y juegos originales están bajo **CC BY-SA 4.0**.
- Iconos: **Lucide (ISC)**. Tipografías Baloo 2 y Nunito: **SIL OFL 1.1**. Las licencias están en `assets/fuentes/`.
- Los archivos PDF originales se conservan fuera del repositorio público como fuente de verificación.

## Pruebas

Se probaron todas las rutas y los ocho juegos con automatización de navegador (Edge/Playwright), incluyendo finalización de partidas, generación de las vistas de impresión, guardado de progreso y ausencia de errores de consola. El detalle está en `docs/INFORME-FINAL.md`.

## Despliegue

El sitio es estático. Se publica con GitHub Pages desde la rama `main`, carpeta raíz.
