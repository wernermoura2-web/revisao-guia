const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..'),config=fs.readFileSync(path.join(root,'config.js'),'utf8');
const ctx=vm.createContext({window:{APPCC_PAPER:true},localStorage:{getItem:()=>null,setItem:()=>{}},console});
vm.runInContext(config+'\n'+fs.readFileSync(path.join(root,'app.js'),'utf8'),ctx);
vm.runInContext(`
const seed=migrateCurrentState({meta:{},a:{},units:{},names:{},notes:{6:'Nota geral preservada'}});
delete seed.receptionReviewVersion;
seed.a.q_p7c2_22={0:{a:'S',obs:'Inspeção'},1:{a:'N',cat:'PCC',obs:'Lote reprovado'}};
seed.a.q_p7c1_20={0:{a:'S',obs:'Registro agregado antigo'}};
const out=migrateCurrentState(seed);
if(out.a.q_p7c2_22[1].cat!=='PPRO'||out.a.q_p7c2_22[1].a!=='N'||out.a.q_p7c2_22[1].obs!=='Lote reprovado')throw Error('Categoria ou resposta perdida');
if(out.a.q_p7c1_20[1])throw Error('Registro desmembrado deve aguardar avaliação');
if(out.legacyReceptionReview.q_p7c1_20[0].obs!=='Registro agregado antigo'||out.notes[6]!=='Nota geral preservada')throw Error('Histórico perdido');
if(JSON.stringify(migrateCurrentState(JSON.parse(JSON.stringify(out))))!==JSON.stringify(out))throw Error('Migração não idempotente');
for(const [k,c]of Object.entries(CFG.itens))if(c.proc==='4.5'){
 if(!c.inspectorGuidanceEnabled||c.frases.some(f=>!f.orientacao))throw Error('F sem orientação');
 if(c.code==='21'&&c.frases.some(f=>f.cat!=='PPRO'))throw Error('Recepção geral deve ser PPRO');
}
`,ctx);
const paper=JSON.parse(fs.readFileSync(path.join(root,'paper-data-layout-v6.js'),'utf8').split('=',2)[1].trim().slice(0,-1));
const cfg=JSON.parse(config.trim().slice(10,-1));
for(const suffix of ['', '_col2'])assert(paper[6].fields.find(f=>f.n==='obs_gerais_p7'+suffix).h>=cfg.receptionObservationMinHeight-.01);
assert(paper[6].fields.some(f=>f.n==='b_q_p7c1_18_F'));
console.log('PASS: PPRO, orientações no F, migração idempotente, histórico e área das observações preservados.');
