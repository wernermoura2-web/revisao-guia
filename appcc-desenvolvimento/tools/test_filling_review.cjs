const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..'),config=fs.readFileSync(path.join(root,'config.js'),'utf8'),cfg=JSON.parse(config.trim().slice(10,-1));const elements={};
const ctx=vm.createContext({document:{getElementById:id=>elements[id]||(elements[id]={})},window:{APPCC_PAPER:true},localStorage:{getItem:()=>null,setItem:()=>{}},console});vm.runInContext(config+'\n'+fs.readFileSync(path.join(root,'app.js'),'utf8'),ctx);
vm.runInContext(`
const seed=migrateCurrentState({meta:{empresa:'Teste'},a:{},names:{},units:{},notes:{9:'Nota retornável',10:'Nota descartável'},fields:{consideracoes_finais:'Conclusão mantida'}});delete seed.fillingReviewVersion;
seed.a.q_p10c1_54={0:{a:'S',cat:'PCC',obs:'Automático'},1:{a:'N',cat:'PCC',obs:'Vedação'}};
seed.a.q_p11c1_61={0:{a:'N',cat:'PCC',obs:'Linha descartável'}};
seed.a.q_p8c1_32={0:{a:'S',obs:'Higienização mantida'}};
const out=migrateCurrentState(seed);
if(out.a.q_p10c1_54[1].a!=='N'||out.a.q_p10c1_54[1].obs!=='Vedação'||out.a.q_p11c1_61[0].obs!=='Linha descartável')throw Error('Resposta anterior perdida');
if(out.a.q_p10c1_54[2])throw Error('Complemento não pode herdar resposta');
if(out.legacyFillingReview.q_p10c1_54[0].obs!=='Automático'||out.notes[9]!=='Nota retornável'||out.notes[10]!=='Nota descartável'||out.fields.consideracoes_finais!=='Conclusão mantida'||out.a.q_p8c1_32[0].obs!=='Higienização mantida')throw Error('Histórico ou dados não relacionados alterados');
if(JSON.stringify(migrateCurrentState(JSON.parse(JSON.stringify(out))))!==JSON.stringify(out))throw Error('Migração não idempotente');
S=out;if(processResult('4.7')!==null)throw Error('Novos controles devem estar pendentes');
for(const [k,c]of Object.entries(CFG.itens))if(c.proc==='4.7')S.a[k]=Object.fromEntries(c.frases.map((f,i)=>[i,{a:'S',cat:f.cat}]));
if(processResult('4.7')!==100)throw Error('Todos Sim diferentes de 100%');
for(const [k,c]of Object.entries(CFG.itens))if(c.code==='54'){if(!c.frases.every(f=>f.allowNA??c.allowNA))throw Error('Gasificação deve permitir NA');S.a[k]=Object.fromEntries(c.frases.map((f,i)=>[i,{a:'A',cat:f.cat}]));}
if(processResult('4.7')!==100)throw Error('Ausência de gasificação penalizou avaliação');
for(const c of Object.values(CFG.itens)){
 if(!c.frases.every(f=>f.orientacao))throw Error('Processo sem orientação');
 if(['50','58'].includes(c.code)&&!c.frases.some(f=>f.texto.includes('POP de higienização da enchedora')))throw Error('POP ausente');
 if(['50','58'].includes(c.code)&&!c.frases.some(f=>f.texto.includes('sem vazamentos')))throw Error('Vazamentos ausentes');
 if(['50','58'].includes(c.code)&&!c.frases.some(f=>f.texto.includes('reservatório pulmão da enchedora')))throw Error('Pulmão ausente');
 if(c.code==='54'&&!c.frases.some(f=>f.texto.includes('trocador de placas')))throw Error('Trocador ausente');
}
`,ctx);
for(const [key,c]of Object.entries(cfg.itens)){
 vm.runInContext(`editing=${JSON.stringify(key)};renderPhrases();`,ctx);
 assert.equal((elements['phrase-body'].innerHTML.match(/Orientação ao inspetor:/g)||[]).length,c.frases.length);
}
const paper=JSON.parse(fs.readFileSync(path.join(root,'paper-data-layout-v6.js'),'utf8').split('=',2)[1].trim().slice(0,-1));
for(const page of [9,10])for(const suffix of ['','_col2'])assert(paper[page].fields.find(f=>f.n==='obs_gerais_p'+(page+1)+suffix).h>=cfg.fillingObservationMinHeight[page]-.01);
console.log('PASS: envases, enchedora, bicos, pulmão, POP, vazamentos, registros, trocador, orientação em todos os processos, preservação, NA, cálculo e observações +50%.');
