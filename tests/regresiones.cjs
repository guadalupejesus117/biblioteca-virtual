const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
global.window = {};
require('../js/texto-voz.js');
assert.equal(window.BV_TEXTO_VOZ('* * *'), '');
assert.equal(window.BV_TEXTO_VOZ('**Hola**, _Margarita_. [Leer](https://example.com)'), 'Hola , Margarita . Leer');
assert.equal(window.BV_TEXTO_VOZ('¿Cómo estás? ¡Bien!'), '¿Cómo estás? ¡Bien!');
const largo = 'Una historia sin puntos ni comas que continúa '.repeat(100);
const partes = window.BV_FRAGMENTOS_VOZ(largo.trim());
assert(partes.every(p=>p.texto.length<=220));
assert.equal(partes.map(p=>p.texto).join(' '), largo.trim());
for(const p of partes) assert.equal(largo.slice(p.inicio,p.inicio+p.texto.length),p.texto);
const cargar=id=>JSON.parse(fs.readFileSync(path.join(__dirname,'../data/clasicos',id+'.json'),'utf8'));
const texto=id=>cargar(id).flatMap(c=>c.parrafos.map(p=>p.texto)).join(' ');
assert.equal(cargar('pinocho').length,36);
assert.equal(cargar('espejo').length,12);
assert(texto('pinocho').includes('transformado en un chico como es debido'));
assert(texto('ruisenor').includes('correteando cerca de él con su cola levantada'));
for(const verso of ['lleva esencia sutil de azahar','en el alma una alondra cantar','cuatrocientos elefantes','guarda, niña, un gentil pensamiento']) assert(texto('margarita').includes(verso));
const fuentes=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/fuentes.json'),'utf8'));
assert.equal(Object.keys(fuentes).length,13);
for(const [id,m] of Object.entries(fuentes)) {
 assert(!texto(id).includes('\ufffd'),id);
 assert(!texto(id).includes('Material autorizado'),id);
 assert(fs.existsSync(path.join(__dirname,'..',m.portada)),id);
 assert(m.url.startsWith('https://bibliotecadigital.ilce.edu.mx/'),id);
}
console.log('Regresiones de voz, integridad y portadas: OK');
