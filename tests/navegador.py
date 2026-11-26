import os
import json,time
from pathlib import Path
from playwright.sync_api import sync_playwright
Path('work').mkdir(exist_ok=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=os.environ.get('BV_BROWSER','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'),headless=True)
 page=browser.new_page(viewport={'width':1280,'height':900},service_workers='block')
 errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
 page.goto(os.environ.get('BV_BASE_URL','http://127.0.0.1:8001')+'');page.wait_for_selector('.libro3d',state='attached')
 assert not page.evaluate('Boolean(window.BV_CLASICOS)'), 'Classics loaded on home'
 results=[]
 for id in json.loads(Path('data/fuentes.json').read_text(encoding='utf-8')):
  t=time.perf_counter();page.goto(os.environ.get('BV_BASE_URL','http://127.0.0.1:8001')+'/#/leer/'+id)
  page.wait_for_selector('.hoja-libro');elapsed=round((time.perf_counter()-t)*1000)
  assert page.locator('.hoja-libro').inner_text().strip(),id
  count=page.locator('.hoja-nav output').inner_text()
  page.locator('.hoja-siguiente').click()
  print(id,elapsed,flush=True); results.append({'id':id,'ms':elapsed,'pages':count})
 page.evaluate("localStorage.removeItem('bv:pagina:v2:margarita'); BV.store.estado.lectura.margarita={percent:0};")
 page.goto(os.environ.get('BV_BASE_URL','http://127.0.0.1:8001')+'/#/leer/margarita');page.wait_for_selector('.hoja-libro')
 page.evaluate('''() => {
  window.spoken=[]; window.lastUtterance=null;
  speechSynthesis.cancel=()=>{};
  speechSynthesis.speak=u=>{spoken.push({text:u.text,rate:u.rate});window.lastUtterance=u;};
  BV.store.estado.velocidadVoz=0.8;
 }''')
 page.get_by_role('button',name='▶ Escuchar',exact=True).click()
 for i in range(500):
  if not page.evaluate('''() => {let u=lastUtterance;lastUtterance=null;if(u?.onend){u.onend();return true;}return false;}'''):break
 spoken=page.evaluate('spoken')
 assert spoken and all('*' not in u['text'] and abs(u['rate']-0.8)<0.001 for u in spoken)
 assert any('lleva esencia sutil de azahar' in u['text'] for u in spoken)
 page.goto(os.environ.get('BV_BASE_URL','http://127.0.0.1:8001')+'/#/leer/pinocho');page.wait_for_selector('.hoja-libro')
 page.get_by_role('button',name='☰ Opciones').click();page.locator('#selector-capitulo').select_option('35')
 assert 'Capítulo 36' in page.locator('.hoja-libro').inner_text()
 page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(400)
 assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1')
 page.screenshot(path='work/lector-mobile.png',full_page=True)
 page.goto(os.environ.get('BV_BASE_URL','http://127.0.0.1:8001')+'/#/biblioteca');page.wait_for_selector('.portada--edicion img')
 page.locator('.portada--edicion img').first.scroll_into_view_if_needed()
 page.wait_for_function('document.querySelector(".portada--edicion img").naturalWidth>0')
 page.screenshot(path='work/catalogo-mobile.png',full_page=True)
 print(json.dumps({'results':results,'utterances':len(spoken),'errors':errors},ensure_ascii=True,indent=2))
 assert not errors,errors
 browser.close()




