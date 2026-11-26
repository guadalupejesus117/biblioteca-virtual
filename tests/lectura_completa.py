import os
import json
from pathlib import Path
from playwright.sync_api import sync_playwright
Path('work').mkdir(exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('BV_BROWSER','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'),headless=True)
 ctx=b.new_context(viewport={'width':390,'height':844},reduced_motion='reduce')
 pg=ctx.new_page();errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
 pg.goto(os.environ.get('BV_BASE_URL','http://127.0.0.1:8001')+'/#/leer/pinocho');pg.wait_for_selector('.hoja-libro')
 report=pg.evaluate('''() => {
   const paragraphs=[];let pages=0;
   while(true){
     paragraphs.push(...Array.from(document.querySelectorAll('.hoja-libro p')).filter(n=>!n.closest('.hoja-relleno')).map(n=>n.textContent));
     pages++;
     const next=document.querySelector('.hoja-siguiente');
     if(next.textContent.includes('Finalizar'))break;
     next.click();if(pages>1000)throw Error('Infinite pagination');
   }
   const clean=s=>s.replace(/\\s+/g,' ').trim();
   const expected=clean(BV_CLASICOS.pinocho.flatMap(c=>c.parrafos.map(p=>p.texto)).join(' '));
   const actual=clean(paragraphs.join(' '));
   return {pages,exact:expected===actual,expected:expected.length,actual:actual.length};
 }''')
 assert report['exact'],report
 pg.reload();pg.wait_for_selector('.hoja-libro');assert 'Finalizar' in pg.locator('.hoja-siguiente').inner_text()
 pg.get_by_role('button',name='☰ Opciones').click();pg.locator('#selector-capitulo').select_option('0')
 pg.screenshot(path='work/lector-mobile-clean.png')
 pg.goto(os.environ.get('BV_BASE_URL','http://127.0.0.1:8001')+'/#/leer/margarita');pg.wait_for_selector('.hoja-libro')
 pg.get_by_role('button',name='☰ Opciones').click()
 with pg.expect_download() as download:pg.locator('#descargar-libro').click()
 download.value.save_as('work/lectura-prueba.pdf')
 pg.wait_for_function('Boolean(navigator.serviceWorker.controller)')
 # Wait for this opened book to be committed to the cache before going offline.
 pg.wait_for_function('''async()=>Boolean(await caches.match(new URL('data/clasicos/margarita.json',location.href)))''')
 ctx.set_offline(True);pg.reload();pg.wait_for_selector('.hoja-libro')
 assert 'Margarita' in pg.locator('.lector-barra__titulo').inner_text()
 print(json.dumps({'pagination':report,'pdfBytes':Path('work/lectura-prueba.pdf').stat().st_size,'offline':True,'errors':errors}))
 assert not errors
 b.close()
