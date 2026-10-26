"""Hygiene overview with complete requirements in F and larger observation columns."""
import fitz

def render_filling_page(pg,cfg,text,cell,widget,inset):
 page=pg.number;pnum=page+1;blue=(.86,.91,.94);pale=(.94,.96,.97)
 entries={k:c for k,c in cfg['itens'].items()if c['page']==page};codes=sorted({int(c['code'])for c in entries.values()})
 pg.add_redact_annot(fitz.Rect(14,71,582,88),fill=blue);pg.apply_redactions(images=0,graphics=1)
 text(pg,(14,71,582,88),'Envase de '+('retornáveis'if page==9 else 'descartáveis')+' - requisitos e orientações no F',7.6,True,1)
 xs=[14,60,98,126,155,174,258,342,426,510,581];y=90
 labels=['INDIC.','APPCC','NC','P','NC x P','LINHA 1','LINHA 2','LINHA 3','LINHA 4','RESULTADO']
 for a,b,v in zip(xs,xs[1:],labels):cell(pg,(a,y,b,y+22),v,5.8,True,blue,1)
 y+=22
 for code in codes:
  cs=[c for c in entries.values()if int(c['code'])==code];fs=cs[0]['frases'];rh=15
  cats='/'.join(dict.fromkeys(f['cat']for f in fs));ns='/'.join(str(x)for x in dict.fromkeys(cfg['pesos'][f['cat']]for f in fs));ps='/'.join(str(x)for x in dict.fromkeys(f['P']for f in fs));values=[cats,ns,ps,str(sum(cfg['pesos'][f['cat']]*f['P']for f in fs))]
  cell(pg,(14,y,60,y+rh),str(code),6,True,blue,1)
  for name,a,b,v in zip(['classe','criticidade_classe','prob_classe','pontuacao'],xs[1:5],xs[2:6],values):
   cell(pg,(a,y,b,y+rh));widget(pg,f'{name}_p{pnum}_{code}',inset((a,y,b,y+rh)),v if len(v)<11 else 'Ver F',ro=True,font=5.4)
  for col in range(1,5):
   a,b=xs[4+col],xs[5+col];cell(pg,(a,y,b,y+rh));pair=next(((k,c)for k,c in entries.items()if int(c['code'])==code and c['col']==col),None)
   if pair is None:text(pg,(a,y,b,y+rh),'NÃO APLICÁVEL',5.1,False,1);continue
   key,c=pair;na=any(f.get('allowNA',c['allowNA'])for f in c['frases']);choices=['S','N']+(['A']if na else [])+['F'];cw=(b-a)/len(choices)
   for j,ch in enumerate(choices):
    widget(pg,f'b_{key}_{ch}',inset((a+j*cw,y+1.5,a+(j+1)*cw,y+13.5)),label={'S':'Sim','N':'Não','A':'NA','F':'F'}[ch],button=True,script=f'abrirFrases.call(this,"{key}");'if ch=='F'else f'marcarItem.call(this,"{key}","{ch}");',font=5.1)
  cell(pg,(510,y,581,y+rh));widget(pg,f'res_p{pnum}_{code}',inset((510,y,581,y+rh)),ro=True,font=6);y+=rh
 for mode,label in [('pct','% ATENDIDO'),('risk','RISCO')]:
  cell(pg,(14,y,174,y+14),label,6.5,True,blue,1)
  for col in range(1,5):
   a,b=xs[4+col],xs[5+col];cell(pg,(a,y,b,y+14));widget(pg,f'{mode}_p{pnum}c{col}',inset((a,y,b,y+14)),ro=True,font=6)
  cell(pg,(510,y,581,y+14));widget(pg,f'{"pct_resultado"if mode=="pct"else"risco_resultado"}_p{pnum}',inset((510,y,581,y+14)),ro=True,font=6);y+=14
 for label,vals,fills in [('AVALIAÇÃO',['100%','76 - 99%','51 - 75%','0 - 50%'],[None]*4),('RISCO',['1 BAIXO','1 BAIXO','2 MÉDIO','3 ALTO'],[(.57,.82,.31),(.57,.82,.31),(1,1,0),(1,.14,.14)])]:
  cell(pg,(14,y,126,y+12),label,6.1,True,None,1)
  for j,(v,fill)in enumerate(zip(vals,fills)):a=126+j*455/4;cell(pg,(a,y,a+455/4,y+12),v,6.1,True,fill,1)
  y+=12
 y+=3;cell(pg,(14,y,581,y+14),'SÍNTESE - TEXTOS COMPLETOS, REFERÊNCIAS E ORIENTAÇÕES AO INSPETOR NO F',6.2,True,pale,1);y+=14
 for code in codes:
  c=next(c for c in entries.values()if int(c['code'])==code);count='/'.join(dict.fromkeys(str(len(i['frases']))for i in entries.values()if int(i['code'])==code));cell(pg,(14,y,60,y+13),c['processId']+' / '+str(code),6,True,pale,1);cell(pg,(60,y,581,y+13),c['title']+f' - {count} '+('frase'if count=='1'else'frases')+'; consultar F.',6.5);y+=13
 note_top=788.3-cfg['fillingObservationMinHeight'][str(page)]-.7
 assert y+19<=note_top,(page,y,note_top)
 cell(pg,(14,note_top-16,581,note_top-2),'OBSERVAÇÕES GERAIS - EXECUÇÃO, RESULTADOS E PROVIDÊNCIAS',6.5,True,pale,1)
 for suffix,a,b in [('',14,294),('_col2',301,581)]:rect=(a,note_top,b,789);cell(pg,rect);widget(pg,f'obs_gerais_p{pnum}{suffix}',inset(rect),multi=True)
 for key,c in entries.items():
  for j,f in enumerate(c['frases']):
   for prefix,value in [('ans',''),('cat',f['cat']),('note','')]:widget(pg,f'{prefix}_{key}_{j}',(-30,-30,-20,-20),value)
 print(f'Page {pnum}: filling, {len(codes)} indicators, full F; observations height >= {cfg["fillingObservationMinHeight"][str(page)]:.2f}')
