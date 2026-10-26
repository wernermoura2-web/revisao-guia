/* Phrase page follows the original guide, with three phrases per screen. */
var IND_EDITOR=null,IND_EDITOR_BUSY=false,IND_EDITOR_CLOSE=null;
function ieField(name){return this.getField('I_ED_'+name);}
function iePut(name,value){var f=ieField.call(this,name);if(f)f.value=value;}
function ieRecover(){if(IND_EDITOR)return true;try{IND_EDITOR=JSON.parse(indGet.call(this,'editor_ativo')||'null');}catch(e){}return !!IND_EDITOR;}
function ieStore(){indSet.call(this,'editor_ativo',JSON.stringify(IND_EDITOR));}
function ieShow(){
 if(!ieRecover.call(this)||IND_EDITOR_BUSY)return;IND_EDITOR_BUSY=true;
 try{var c=IND_CFG.itens[IND_EDITOR.key],start=IND_EDITOR.offset;
  iePut.call(this,'title','Indicador '+c.code+((c.cqId||c.rmId)?' - '+(c.cqId||c.rmId)+' - '+c.title:'')+' - '+ieUnit(c));
  var previous=ieField.call(this,'prev'),next=ieField.call(this,'next');if(previous)previous.display=start>0?display.visible:display.hidden;if(next)next.display=start+3<c.frases.length?display.visible:display.hidden;
  iePut.call(this,'range','Frases '+(start+1)+' a '+Math.min(start+3,c.frases.length)+' de '+c.frases.length+' | Use Guardar alterações ou Salvar e voltar ao processo.');
  for(var slot=0;slot<3;slot++){
   var j=start+slot,p=c.frases[j],visible=!!p;
   var names=['panel','labelAPPCC','labelNC','labelP','labelNCxP','text','cat','nc','p','score','obs','b_S','b_N','b_A'];
   for(var n=0;n<names.length;n++){var f=ieField.call(this,names[n]+'_'+slot);if(f)f.display=visible?display.visible:display.hidden;}
   if(!p)continue;
   var cat=indGet.call(this,'cat_'+IND_EDITOR.key+'_'+j)||p.cat,a=indGet.call(this,'ans_'+IND_EDITOR.key+'_'+j);
   var textField=ieField.call(this,'text_'+slot);if(textField)textField.textSize=p.orientacao?7.5:9;
   iePut.call(this,'text_'+slot,'F'+(j+1)+' - '+p.texto+'\n'+(p.ref||'')+(p.orientacao?'\nOrientação ao inspetor: '+p.orientacao:'')+(p.probabilityAssigned?' | P=5: critério adotado na revisão.':''));iePut.call(this,'cat_'+slot,cat);iePut.call(this,'nc_'+slot,IND_CFG.pesos[cat]);iePut.call(this,'p_'+slot,p.P);iePut.call(this,'score_'+slot,IND_CFG.pesos[cat]*p.P);iePut.call(this,'obs_'+slot,indGet.call(this,'note_'+IND_EDITOR.key+'_'+j));
   for(var ai=0;ai<3;ai++){var ch=['S','N','A'][ai],f=ieField.call(this,'b_'+ch+'_'+slot);if(f){f.display=ch==='A'&&!(c.frases[j].allowNA===undefined?c.allowNA:c.frases[j].allowNA)?display.hidden:display.visible;f.value=a===ch?'Yes':'Off';}}
  }
  var pending=false,earned=0,total=0;
  for(var i=0;i<c.frases.length;i++){var a=indGet.call(this,'ans_'+IND_EDITOR.key+'_'+i),cat=indGet.call(this,'cat_'+IND_EDITOR.key+'_'+i)||c.frases[i].cat,w=IND_CFG.pesos[cat]*c.frases[i].P;if(!a)pending=true;if(a!=='A')total+=w;if(a==='S')earned+=w;}
  iePut.call(this,'summary',pending?'Indicador pendente: avalie todas as frases aplicáveis.':'NC x P satisfatório = '+earned+' / '+total);
 }finally{IND_EDITOR_BUSY=false;}
}
function ieUnit(c){return c.page>=2&&c.page<=5?'Reservatório '+c.col:c.page===6?['Retornáveis','Descartáveis','Rótulos','Saneantes'][c.col-1]:c.page===7||c.page===8?(c.page===7?'Retornáveis':'Descartáveis')+' - '+(c.col===4?'Tampas':'Linha '+c.col):c.page===9||c.page===10?'Envase - Linha '+c.col:c.page>=11?'Avaliação':'Captação '+c.col;}
function ieSave(){
 if(!ieRecover.call(this)||IND_EDITOR_BUSY)return;
 var c=IND_CFG.itens[IND_EDITOR.key];
 for(var slot=0;slot<3;slot++){var j=IND_EDITOR.offset+slot;if(j>=c.frases.length)break;var f=ieField.call(this,'cat_'+slot);if(f&&IND_CFG.pesos[f.valueAsString])indSet.call(this,'cat_'+IND_EDITOR.key+'_'+j,f.valueAsString);f=ieField.call(this,'obs_'+slot);if(f)indSet.call(this,'note_'+IND_EDITOR.key+'_'+j,f.valueAsString);}
 indCalc.call(this);
}
function ieAnswer(slot,a){if(!ieRecover.call(this))return;var c=IND_CFG.itens[IND_EDITOR.key],j=IND_EDITOR.offset+slot;if(j>=c.frases.length||a==='A'&&!(c.frases[j].allowNA===undefined?c.allowNA:c.frases[j].allowNA))return;ieSave.call(this);indSet.call(this,'ans_'+IND_EDITOR.key+'_'+j,a);indCalc.call(this);ieShow.call(this);}
function ieClass(slot,value){if(IND_EDITOR_BUSY||!ieRecover.call(this)||!IND_CFG.pesos[value])return;var j=IND_EDITOR.offset+slot;indSet.call(this,'cat_'+IND_EDITOR.key+'_'+j,value);iePut.call(this,'nc_'+slot,IND_CFG.pesos[value]);iePut.call(this,'score_'+slot,IND_CFG.pesos[value]*IND_CFG.itens[IND_EDITOR.key].frases[j].P);indCalc.call(this);}
function ieNote(slot,value){if(IND_EDITOR_BUSY||!ieRecover.call(this))return;indSet.call(this,'note_'+IND_EDITOR.key+'_'+(IND_EDITOR.offset+slot),value);indCalc.call(this);}
function ieMove(delta){if(!ieRecover.call(this))return;ieSave.call(this);var count=IND_CFG.itens[IND_EDITOR.key].frases.length;IND_EDITOR.offset=Math.max(0,Math.min(Math.floor((count-1)/3)*3,IND_EDITOR.offset+delta*3));ieStore.call(this);ieShow.call(this);}
function ieDeleteClosed(){if(!IND_EDITOR_CLOSE)return;var q=IND_EDITOR_CLOSE;IND_EDITOR_CLOSE=null;try{q.doc.deletePages(q.page,q.page);}catch(e){app.alert('As respostas foram salvas. O leitor manteve a página auxiliar aberta.');}}
function ieClose(){if(!ieRecover.call(this))return;ieSave.call(this);var e=IND_EDITOR;IND_EDITOR=null;indSet.call(this,'editor_ativo','');this.pageNum=e.returnPage;IND_EDITOR_CLOSE={doc:this,page:e.page};app.setTimeOut('ieDeleteClosed();',200);}
function abrirFrases(k){
 var c=IND_CFG.itens[k];if(!c||(c.frases.length<2&&!c.cqId&&!c.rmId&&!c.inspectorGuidanceEnabled))return;
 if(ieRecover.call(this)){if(IND_EDITOR.key===k){this.pageNum=IND_EDITOR.page;ieShow.call(this);return;}app.alert('Salve e volte ao processo antes de abrir outro indicador.');return;}
 try{var f=this.getField(c.classField),page=f&&typeof f.page==='number'?f.page:c.page;var template=this.getTemplate('APPCC_Indicador_Frases');if(!template)throw Error('Página de frases indisponível.');template.spawn(page+1,false,false);IND_EDITOR={key:k,page:page+1,returnPage:page,offset:0};ieStore.call(this);ieShow.call(this);this.pageNum=page+1;}catch(e){IND_EDITOR=null;app.alert('Abra o PDF no Adobe Acrobat para usar a página de frases. '+e);}
}
if(ieRecover.call(this))ieShow.call(this);
