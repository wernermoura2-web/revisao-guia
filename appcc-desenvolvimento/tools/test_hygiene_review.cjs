const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..'),config=fs.readFileSync(path.join(root,'config.js'),'utf8'),cfg=JSON.parse(config.trim().slice(10,-1));
const ctx=vm.createContext({window:{APPCC_PAPER:true},localStorage:{getItem:()=>null,setItem:()=>{}},console});vm.runInContext(config+'\n'+fs.readFileSync(path.join(root,'app.js'),'utf8'),ctx);
vm.runInContext(`
const seed=migrateCurrentState({meta:{empresa:'Teste'},a:{},units:{},names:{},notes:{7:'Nota dos retornáveis',8:'Nota dos descartáveis'},fields:{consideracoes_finais:'Conclusão mantida'}});delete seed.hygieneReviewVersion;
seed.a.q_p8c1_32={0:{a:'S',cat:'PCC',obs:'Operação automática'}};
seed.a.q_p8c1_33={0:{a:'S',cat:'PCC'},1:{a:'N',cat:'PCC',obs:'Conferir o teste e o registro'}};
seed.a.q_p7c2_22={0:{a:'S',obs:'Recepção mantida'}};
const out=migrateCurrentState(seed);
if(out.a.q_p8c1_32[0].a!=='S'||out.a.q_p8c1_32[0].obs!=='Operação automática')throw Error('Resposta anterior perdida');
if(out.a.q_p8c1_32[1]||out.a.q_p8c1_33[2])throw Error('Novo controle respondido automaticamente');
if(out.a.q_p8c1_33[1].a||out.a.q_p8c1_33[1].obs!=='Conferir o teste e o registro')throw Error('Desmembramento sem revisão ou nota perdida');
if(out.legacyHygieneReview.q_p8c1_33[1].a!=='N')throw Error('Histórico perdido');
if(out.notes[7]!=='Nota dos retornáveis'||out.notes[8]!=='Nota dos descartáveis'||out.fields.consideracoes_finais!=='Conclusão mantida'||out.a.q_p7c2_22[0].obs!=='Recepção mantida')throw Error('Dados não relacionados alterados');
if(JSON.stringify(migrateCurrentState(JSON.parse(JSON.stringify(out))))!==JSON.stringify(out))throw Error('Migração não idempotente');
S=out;if(processResult('4.6')!==null)throw Error('Controles novos devem estar pendentes');
for(const [k,c]of Object.entries(CFG.itens))if(c.proc==='4.6')S.a[k]=Object.fromEntries(c.frases.map((f,i)=>[i,{a:'S',cat:f.cat}]));
if(processResult('4.6')!==100)throw Error('Todos Sim devem resultar em 100%');
S.a.q_p9c1_44[0].a='A';if(processResult('4.6')!==100)throw Error('Pré-lavagem de retornável não deve penalizar descartável quando NA');
if(!CFG.itens.q_p9c1_44.frases[0].allowNA)throw Error('Aplicabilidade não corrigida');
for(const c of Object.values(CFG.itens))if(c.proc==='4.6')for(const f of c.frases){if(!f.orientacao)throw Error('F sem orientação');if(f.newRequirement&&f.hygienePreviousIndex===null&&f.P!==5)throw Error('Probabilidade nova indevida');}
`,ctx);
const paper=JSON.parse(fs.readFileSync(path.join(root,'paper-data-layout-v6.js'),'utf8').split('=',2)[1].trim().slice(0,-1));
for(const page of [7,8])for(const suffix of ['','_col2'])assert(paper[page].fields.find(f=>f.n==='obs_gerais_p'+(page+1)+suffix).h>=cfg.hygieneObservationMinHeight[page]-.01);
console.log('PASS: execução, resíduos, tampas, falhas, aplicabilidade, novos pendentes, histórico, cálculo e observações +50%.');
