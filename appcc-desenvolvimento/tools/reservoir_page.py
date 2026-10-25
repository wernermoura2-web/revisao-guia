"""Reservoir overview, preserving all full CP clauses in the native F editor."""
import fitz

def render_reservoir_page(pg,cfg,text,cell,widget,inset):
 page=pg.number;pnum=page+1;blue=(.86,.91,.94);pale=(.94,.96,.97)
 entries={k:c for k,c in cfg['itens'].items() if c['page']==page}
 pg.add_redact_annot(fitz.Rect(14,71,582,88),fill=blue);pg.apply_redactions(images=0,graphics=1)
 text(pg,(14,71,582,88),f'Reservatórios - Captação {page-1} / origens e manobras no botão F',8,True,1)
 codes=cfg['pageIndicatorOrder'][str(page)];xs=[14,60,98,126,155,174,258,342,426,510,581];y=90
 labels=['INDIC.','APPCC','NC','P','NC x P','RESERV. 1','RESERV. 2','RESERV. 3','RESERV. 4','RESULTADO']
 for a,b,label in zip(xs,xs[1:],labels):cell(pg,(a,y,b,y+22),label,6,True,blue,1)
 y+=22;cell(pg,(14,y,174,y+17),'IDENTIFICAÇÃO DO RESERVATÓRIO',6,True,pale)
 for col in range(1,5):
  a,b=xs[4+col],xs[5+col];cell(pg,(a,y,b,y+17));widget(pg,f'reservatorio_id_p{pnum}c{col}',inset((a,y,b,y+17)),font=7)
 cell(pg,(510,y,581,y+17));y+=17
 for code in codes:
  cs=[c for c in entries.values() if int(c['code'])==code];fs=cs[0]['frases'];rh=22
  cats='/'.join(dict.fromkeys(f['cat'] for f in fs));ns='/'.join(str(x) for x in dict.fromkeys(cfg['pesos'][f['cat']] for f in fs));ps='/'.join(str(x) for x in dict.fromkeys(f['P'] for f in fs));score=str(sum(cfg['pesos'][f['cat']]*f['P'] for f in fs))
  for i,v in enumerate([str(code),cats,ns,ps,score]):cell(pg,(xs[i],y,xs[i+1],y+rh),v if i==0 else '',6,i==0,blue if i==0 else None,1)
  for name,a,b,v in [(f'classe_p{pnum}_{code}',60,98,cats),(f'criticidade_classe_p{pnum}_{code}',98,126,ns),(f'prob_classe_p{pnum}_{code}',126,155,ps),(f'pontuacao_p{pnum}_{code}',155,174,score)]:
   widget(pg,name,(a+.7,y+4,b-.7,y+18),v if len(v)<10 else 'Ver F',ro=True,font=5.8)
  for col in range(1,5):
   a,b=xs[4+col],xs[5+col];cell(pg,(a,y,b,y+rh));key,c=next((k,c) for k,c in entries.items() if int(c['code'])==code and c['col']==col)
   choices=['S','N']+(['A'] if c['allowNA'] else [])+['F'];cw=(b-a)/len(choices)
   for j,ch in enumerate(choices):
    widget(pg,f'b_{key}_{ch}',inset((a+j*cw,y+5,a+(j+1)*cw,y+17)),label={'S':'Sim','N':'Não','A':'NA','F':'F'}[ch],button=True,script=f'abrirFrases.call(this,"{key}");' if ch=='F' else f'marcarItem.call(this,"{key}","{ch}");',font=5.7)
  cell(pg,(510,y,581,y+rh));widget(pg,f'res_p{pnum}_{code}',inset((510,y+3,581,y+19)),ro=True,font=6)
  y+=rh
 for mode,label in [('pct','% ATENDIDO'),('risk','RISCO')]:
  cell(pg,(14,y,174,y+14),label,7,True,blue,1)
  for col in range(1,5):
   a,b=xs[4+col],xs[5+col];cell(pg,(a,y,b,y+14));widget(pg,f'{mode}_p{pnum}c{col}',inset((a,y,b,y+14)),ro=True,font=6.5)
  cell(pg,(510,y,581,y+14));widget(pg,f'{"pct_resultado" if mode=="pct" else "risco_resultado"}_p{pnum}',inset((510,y,581,y+14)),ro=True,font=6.5);y+=14
 for label,vals,fills in [('AVALIAÇÃO',['100%','76 - 99%','51 - 75%','0 - 50%'],[None]*4),('RISCO',['1 BAIXO','1 BAIXO','2 MÉDIO','3 ALTO'],[(.57,.82,.31),(.57,.82,.31),(1,1,0),(1,.14,.14)])]:
  cell(pg,(14,y,126,y+12),label,6.3,True,None,1)
  for j,(val,fill) in enumerate(zip(vals,fills)):
   a=126+j*(455/4);cell(pg,(a,y,a+455/4,y+12),val,6.2,True,fill,1)
  y+=12
 y+=3;cell(pg,(14,y,581,y+14),'SÍNTESE DOS INDICADORES - TEXTOS INTEGRAIS DA CP E REFERÊNCIAS NO BOTÃO F',6.4,True,pale,1);y+=14
 for code in codes:
  c=next(c for c in entries.values() if int(c['code'])==code)
  cell(pg,(14,y,60,y+15),str(code),6.3,True,pale,1);cell(pg,(60,y,581,y+15),c['title']+f" - {len(c['frases'])} frases; consultar F.",7);y+=15
 text(pg,(14,y+2,581,y+13),'Registrar fontes, modo de operação e manobras no F do indicador 18. Complementos do guia com P=5.',6.2);y+=14
 note_top=788.3-cfg['reservoirObservationMinHeight']-.7
 assert y+16<=note_top,(y,note_top)
 cell(pg,(14,note_top-16,581,note_top-2),'OBSERVAÇÕES GERAIS - OPERAÇÃO, EVIDÊNCIAS E DOCUMENTOS',6.7,True,pale,1)
 for suffix,a,b in [('',14,294),('_col2',301,581)]:
  rect=(a,note_top,b,789);cell(pg,rect);widget(pg,f'obs_gerais_p{pnum}{suffix}',inset(rect),multi=True)
 for key,c in entries.items():
  for j,f in enumerate(c['frases']):
   for prefix,v in [('ans',''),('cat',f['cat']),('note','')]:widget(pg,f'{prefix}_{key}_{j}',(-30,-30,-20,-20),v)
 print(f'Page {pnum}: 6 reservoir indicators; CP full text in F; note height >= {cfg["reservoirObservationMinHeight"]:.1f}')
