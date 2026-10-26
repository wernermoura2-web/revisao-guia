"""Compact, editable responsibility and food-handler overview; full wording remains in the native F editor."""
import fitz
from process_metadata import summary

def render_responsibility_page(pg,cfg,text,cell,widget,inset):
 blue=(.86,.91,.94);pale=(.94,.96,.97)
 entries={k:c for k,c in cfg['itens'].items() if c['proc']=='4.11'}
 bycode={int(c['code']):(k,c) for k,c in entries.items()}
 ordered=[bycode[n] for n in cfg['responsibilityOrder']]
 assert len(ordered)==8
 pg.add_redact_annot(fitz.Rect(14,71,582,88),fill=blue);pg.apply_redactions(images=0,graphics=1)
 text(pg,(14,71,582,88),'Responsáveis e manipuladores - 8 indicadores / frases completas no botão F',8,True,1)
 xs=[14,60,98,126,155,174,342,510,581];y=90;hh=22
 labels=['INDIC.','APPCC','NC','P','NC x P','OBSERVAÇÕES - COLUNA 1','OBSERVAÇÕES - COLUNA 2','RESULTADO']
 for a,b,label in zip(xs,xs[1:],labels):cell(pg,(a,y,b,y+hh),label,5.7,True,blue,1)
 y+=hh;rh=51
 for key,c in ordered:
  code=c['code'];fs=c['frases'];cats='/'.join(dict.fromkeys(f['cat'] for f in fs));ns='/'.join(str(x) for x in dict.fromkeys(cfg['pesos'][f['cat']] for f in fs));ps='/'.join(str(x) for x in dict.fromkeys(f['P'] for f in fs));score=str(sum(cfg['pesos'][f['cat']]*f['P'] for f in fs))
  for i,value in enumerate([code,cats,ns,ps,score]):cell(pg,(xs[i],y,xs[i+1],y+rh),value if i==0 else '',5.8,i==0,blue if i==0 else None,1)
  for n,a,b,value in [(f'classe_p13_{code}',60,98,cats),(f'criticidade_classe_p13_{code}',98,126,ns),(f'prob_classe_p13_{code}',126,155,ps),(f'pontuacao_p13_{code}',155,174,score)]:widget(pg,n,(a+.7,y+(rh-13)/2,b-.7,y+(rh+13)/2),value if len(value)<10 else 'Ver F',ro=True,font=5.8)
  for suffix,a,b in [('',174,342),('_col2',342,510)]:
   cell(pg,(a,y,b,y+rh));widget(pg,f'obs_p13_{code}{suffix}',(a+1,y+1,b-1,y+rh-1),multi=True,font=6.7)
  cell(pg,(510,y,581,y+rh))
  choices=['S','N']+(['A'] if c['allowNA'] else [])+['F'];cw=71/len(choices)
  for j,ch in enumerate(choices):
   widget(pg,f'b_{key}_{ch}',(510+j*cw+.7,y+1,510+(j+1)*cw-.7,y+12.5),label={'S':'Sim','N':'Não','A':'NA','F':'F'}[ch],button=True,script=f'abrirFrases.call(this,"{key}");' if ch=='F' else f'marcarItem.call(this,"{key}","{ch}");',font=5.3)
  widget(pg,f'res_p13_{code}',(511,y+14,580,y+25.5),ro=True,font=6)
  y+=rh
 for label,name in [('% ATENDIDO','pct_resultado_p13'),('RISCO','risco_resultado_p13')]:
  cell(pg,(14,y,174,y+14),label,7,True,blue,1);cell(pg,(174,y,510,y+14));widget(pg,{'% ATENDIDO':'pct_p13c1','RISCO':'risk_p13c1'}[label],(175,y+1,509,y+13),ro=True)
  cell(pg,(510,y,581,y+14));widget(pg,name,(511,y+1,580,y+13),ro=True);y+=14
 for label,values,fills in [('AVALIAÇÃO',['100%','76 - 99%','51 - 75%','0 - 50%'],[None]*4),('RISCO',['1 BAIXO','1 BAIXO','2 MÉDIO','3 ALTO'],[(.57,.82,.31),(.57,.82,.31),(1,1,0),(1,.14,.14)])]:
  cell(pg,(14,y,126,y+12),label,6.3,True,None,1)
  for i,(value,fill) in enumerate(zip(values,fills)):
   a=126+i*(455/4);cell(pg,(a,y,a+455/4,y+12),value,6.2,True,fill,1)
  y+=12
 y+=3
 for key,c in ordered:
  h=24
  cell(pg,(14,y,60,y+h),c['rmId']+' / '+c['code'],5.8,True,pale,1)
  cell(pg,(60,y,581,y+h),summary(c),7,False,None)
  y+=h
 text(pg,(14,y+2,581,792),'Novos requisitos: P=5. P anterior preservado nas frases mantidas. Rotulagem avaliada no CQ15. APPCC por frase no F.',6.4,False)
 # All original wording and answers remain canonical/editable in Acrobat.
 for key,c in ordered:
  for j,f in enumerate(c['frases']):
   for prefix,value in [('ans',''),('cat',f['cat']),('note','')]:widget(pg,f'{prefix}_{key}_{j}',(-30,-30,-20,-20),value)
 print(f'Page 13: 8 responsibility indicators; full phrases in native F editor; overview ends at {y:.1f}')
