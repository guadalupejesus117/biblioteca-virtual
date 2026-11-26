import json,re,unicodedata,html,hashlib,sys
from urllib.request import urlopen
from pathlib import Path
import pymupdf
root=Path(__file__).resolve().parents[1]
cache=Path(sys.argv[1]) if len(sys.argv)>1 else root/'work/fuentes'
cache.mkdir(parents=True,exist_ok=True)
known=json.loads((root/'data/fuentes.json').read_text(encoding='utf-8'))
sources={id:m['url'] for id,m in known.items()}
out=root/'data/clasicos';out.mkdir(exist_ok=True)
covers=root/'assets/portadas';covers.mkdir(exist_ok=True)
manifest={}
def clean(t):
 t=unicodedata.normalize('NFC',html.unescape(t))
 t=t.replace('\xad\n','').replace('\xad','')
 return re.sub(r'\s+',' ',t).strip()
for id,url in sources.items():
 path=cache/(id+'.pdf')
 if not path.exists():
  with urlopen(url,timeout=60) as response:path.write_bytes(response.read())
 assert hashlib.sha256(path.read_bytes()).hexdigest()==known[id]['sha256'], 'La edición fuente ha cambiado: '+id
 d=pymupdf.open(path)
 d[0].get_pixmap(matrix=pymupdf.Matrix(1.5,1.5)).pil_save(str(covers/(id+'.webp')),format='WEBP',quality=85)
 sections=[];current={'titulo':'La historia' if id!='margarita' else 'A Margarita Debayle','parrafos':[]}
 start={'alicia':2,'espejo':2,'pinocho':5}.get(id,1)
 if id=='alicia':current['titulo']='Poema inicial'
 stopped=False
 for page in list(d)[start:]:
  for b in page.get_text('blocks'):
   if b[6]!=0:continue
   raw=b[4]; t=clean(raw)
   if not t or re.fullmatch(r'\d+',t) or 'http://bibliotecadigital.ilce.edu.mx' in t:continue
   if 'Material autorizado' in t:
    raw=raw.split('Material autorizado')[0];t=clean(raw);stopped=True
   if t:
    match=re.match(r'^(?:Cap[ií]?tulo)\s+([IVXLCDM]+|\d+)\b',t,re.I)
    if match and id in ['alicia','espejo','pinocho']:
     if current['parrafos'] and not (id=='espejo' and not sections and current['titulo']=='La historia'):sections.append(current)
     title=t
     if id=='pinocho':title='Capítulo '+str(len(sections)+1)
     current={'titulo':title,'parrafos':[]}
     # Preserve the chapter synopsis when it shares the title block.
     if id=='pinocho':
      rest=t[match.end():].strip()
      if rest:current['parrafos'].append({'tipo':'p','texto':rest})
     continue
    if id=='alicia' and t=='HISTORIA' and current['titulo'].endswith('LARGA'):
     current['titulo']+=' HISTORIA';continue
    if id=='margarita':
     for line in raw.splitlines():
      line=clean(line)
      if line and not re.fullmatch(r'[\d\s*]+',line) and not line.startswith('A  MARGARITA'):
       current['parrafos'].append({'tipo':'verso','texto':line})
    elif not re.fullmatch(r'[\s*]+',t):
     ps=current['parrafos']
     # Join continuations across PDF page/block boundaries without losing words.
     if ps and not re.search(r'[.!?…:;»”\"]$',ps[-1]['texto']) and re.match(r'^[a-záéíóúñ]',t):
      ps[-1]['texto']+=' '+t
     else:ps.append({'tipo':'verso' if id=='alicia' and current['titulo']=='Poema inicial' else 'p','texto':'\n'.join(clean(line) for line in raw.splitlines() if clean(line)) if id=='alicia' and current['titulo']=='Poema inicial' else t})
   if stopped:break
  if stopped:break
 if current['parrafos']:sections.append(current)
 text=' '.join(p['texto'] for c in sections for p in c['parrafos'])
 assert '\ufffd' not in text,id
 (out/(id+'.json')).write_text(json.dumps(sections,ensure_ascii=False,indent=2),encoding='utf-8')
 manifest[id]={'url':url,'paginas':len(d),'capitulos':len(sections),'palabras':len(text.split()),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'portada':'assets/portadas/'+id+'.webp'}
 print(id,len(sections),len(text.split()))
(root/'data/fuentes.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
