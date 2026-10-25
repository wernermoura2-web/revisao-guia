"""Native phrase page and checkbox appearances matching the original PDF."""
from pathlib import Path
import fitz
from pypdf import PdfReader
from pypdf.generic import NameObject,TextStringObject,DictionaryObject,ArrayObject,NumberObject,FloatObject,DecodedStreamObject

def make_editor(path):
 d=fitz.open();p=d.new_page(width=595,height=842)
 p.draw_rect((20,20,575,61),fill=(.85,.92,.95),color=None)
 def field(name,rect,value='',ro=False,multi=False,combo=False,button=False,script='',check=False):
  w=fitz.Widget();w.field_name='I_ED_'+name;w.rect=fitz.Rect(rect);w.field_type=fitz.PDF_WIDGET_TYPE_CHECKBOX if check else fitz.PDF_WIDGET_TYPE_BUTTON if button else fitz.PDF_WIDGET_TYPE_COMBOBOX if combo else fitz.PDF_WIDGET_TYPE_TEXT
  w.field_value='Off' if check else value;w.field_label=value if check else name;w.text_font='Helv';w.text_fontsize=9;w.fill_color=(1,1,1);w.text_color=(0,0,0);w.border_color=(.5,.55,.58);w.border_width=.5
  if button:w.field_flags=fitz.PDF_BTN_FIELD_IS_PUSHBUTTON;w.button_caption=value;w.script=script;w.text_fontsize=8
  elif check:w.script=script
  else:
   w.field_flags=(1 if ro else 0)|(4096 if multi else 0)
   if combo:w.choice_values=['PPR','PPHO','PC','PPRO','PCC'];w.script_change=script
   elif script:w.script_change=script
  p.add_widget(w)
 field('title',(28,28,567,54),ro=True)
 field('context',(25,70,570,106),'NC: PPR=1; PPHO=2; PC=3; PPRO=4; PCC=5. P: 1 a 5. Índice = 100 x soma(NC x P das frases Sim) / soma(NC x P de todas as frases aplicáveis).',ro=True,multi=True)
 for slot in range(3):
  y=118+180*slot;field('panel_'+str(slot),(23,y,572,y+174),ro=True)
  field('text_'+str(slot),(28,y+5,566,y+92),ro=True,multi=True)
  for name,label,x,x2 in [('APPCC','APPCC',28,110),('NC','NC',130,175),('P','P',190,235),('NCxP','NC x P',251,316)]:field('label'+name+'_'+str(slot),(x,y+96,x2,y+106),label,ro=True)
  field('cat_'+str(slot),(28,y+108,110,y+124),'PPR',combo=True,script=f'ieClass.call(this,{slot},event.value);')
  for name,x,x2 in [('nc',130,175),('p',190,235),('score',251,316)]:field(name+'_'+str(slot),(x,y+108,x2,y+124),ro=True)
  for a,label,x,x2 in [('S','Sim',347,407),('N','Não',412,472),('A','NA',477,537)]:field('b_'+a+'_'+str(slot),(x,y+108,x2,y+124),label,check=True,script=f"ieAnswer.call(this,{slot},'{a}');")
  field('obs_'+str(slot),(28,y+131,566,y+169),multi=True,script=f'ieNote.call(this,{slot},event.value);')
 field('range',(25,670,570,694),ro=True)
 field('prev',(25,700,230,724),'Frases anteriores',button=True,script='ieMove.call(this,-1);')
 field('next',(359,700,570,724),'Próximas frases',button=True,script='ieMove.call(this,1);')
 field('summary',(25,752,570,781),'Indicador pendente: avalie todas as frases aplicáveis.',ro=True)
 field('save',(25,798,230,824),'Guardar alterações',button=True,script='ieSave.call(this);ieShow.call(this);')
 field('close',(359,798,570,824),'Salvar e voltar ao processo',button=True,script='ieClose.call(this);')
 d.save(path);d.close()

def checkbox(writer,obj,label,readonly=False):
 r=obj['/Rect'];w=float(r[2])-float(r[0]);h=float(r[3])-float(r[1]);size=min(6,h*.47);y=(h-size)/2;font=5.3 if h<13 else 8
 fontobj=DictionaryObject({NameObject('/Type'):NameObject('/Font'),NameObject('/Subtype'):NameObject('/Type1'),NameObject('/BaseFont'):NameObject('/Helvetica'),NameObject('/Encoding'):NameObject('/WinAnsiEncoding')})
 fontref=writer._add_object(fontobj);states=DictionaryObject()
 for selected in [False,True]:
  commands=f'q {"0.68 0.68 0.68" if selected else "1 1 1"} rg 0 0 {w} {h} re f 0 0 0 RG 0.5 w .25 .25 {w-.5} {h-.5} re S 1 1 1 rg 2 {y} {size} {size} re f 0 0 0 RG 2 {y} {size} {size} re S '
  if selected:commands+=f'1 w 3 {y+1} m {size+1} {y+size-1} l S 3 {y+size-1} m {size+1} {y+1} l S '
  commands+=f'BT /Helv {font} Tf 0 0 0 rg 1 0 0 1 {size+4} {h*.4} Tm ({label}) Tj ET Q'
  stream=DecodedStreamObject();stream.set_data(commands.encode('cp1252'));stream.update({NameObject('/Type'):NameObject('/XObject'),NameObject('/Subtype'):NameObject('/Form'),NameObject('/BBox'):ArrayObject([FloatObject(v) for v in [0,0,w,h]]),NameObject('/Resources'):DictionaryObject({NameObject('/Font'):DictionaryObject({NameObject('/Helv'):fontref})})})
  states[NameObject('/Yes' if selected else '/Off')]=writer._add_object(stream)
 obj[NameObject('/FT')]=NameObject('/Btn');obj[NameObject('/Ff')]=NumberObject(1 if readonly else 0);obj[NameObject('/AP')]=DictionaryObject({NameObject('/N'):states});obj[NameObject('/V')]=NameObject('/Off');obj[NameObject('/AS')]=NameObject('/Off');obj.pop('/MK',None)

def attach_editor(writer,path,cfg):
 reader=PdfReader(path);page=reader.pages[0].clone(writer);page[NameObject('/Type')]=NameObject('/Template');page.pop('/Parent',None);ref=writer._add_object(page)
 for ann in page['/Annots']:
  obj=ann.get_object();obj[NameObject('/P')]=ref;writer.root_object['/AcroForm']['/Fields'].append(ann)
  if '_b_' in str(obj.get('/T','')):checkbox(writer,obj,{'S':'Sim','N':'Não','A':'NA'}[str(obj['/T']).split('_')[-2]])
 writer.root_object['/Names'][NameObject('/Templates')]=DictionaryObject({NameObject('/Names'):ArrayObject([TextStringObject('APPCC_Indicador_Frases'),ref])})
 for pg in writer.pages:
  for ann in pg.get('/Annots',[]):
   obj=ann.get_object();name=str(obj.get('/T',''))
   if name.startswith('b_q_') and name[-2:] in ['_S','_N','_A']:
    key=name[2:-2];checkbox(writer,obj,{'S':'Sim','N':'Não','A':'NA'}[name[-1]],len(cfg['itens'][key]['frases'])>1)
