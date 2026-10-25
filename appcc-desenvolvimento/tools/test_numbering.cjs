const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..'),config=fs.readFileSync(path.join(root,'config.js'),'utf8'),cfg=JSON.parse(config.trim().slice(10,-1));
const codes=[...new Set(Object.values(cfg.itens).map(c=>Number(c.code)))].sort((a,b)=>a-b);
assert.deepEqual(codes,Array.from({length:81},(_,i)=>i+1));
let last=0;for(let page=0;page<13;page++)for(const n of cfg.pageIndicatorOrder[page]){if(page>=3&&page<=5)continue;assert(n>last);last=n;}
for(const[k,c]of Object.entries(cfg.itens))assert.equal(c.classField,`classe_p${c.page+1}_${c.code}`);
const ctx=vm.createContext({window:{APPCC_PAPER:true},localStorage:{getItem:()=>null,setItem:()=>{}},console});
vm.runInContext(config+'\n'+fs.readFileSync(path.join(root,'app.js'),'utf8'),ctx);
vm.runInContext(`
const input={meta:{empresa:'Teste'},a:{q_p1c1_2:{0:{a:'N',obs:'Manter texto'}},q_p13c1_81:{0:{a:'S',cat:'PPR'}}},notes:{0:'Nota de captação'},fields:{obs_p13_81:'Nota item',obs_p13_82:'Outra nota',consideracoes_finais:'Conclusão'},units:{},indicatorVersion:CFG.version,qualityReviewVersion:CFG.qualityVersion,responsibilityReviewVersion:CFG.responsibilityVersion,hygienePCCVersion:'pcc-higienizacao-20261025-v2'};
const output=migrateCurrentState(JSON.parse(JSON.stringify(input)));
if(JSON.stringify(input.a)!==JSON.stringify(output.a))throw Error('Respostas alteradas pela renumeração');
if(output.fields.obs_p13_76!=='Nota item'||output.fields.obs_p13_77!=='Outra nota')throw Error('Notas migradas para indicador incorreto');
if(output.fields.consideracoes_finais!=='Conclusão'||output.notes[0]!=='Nota de captação')throw Error('Texto manual alterado');
if(JSON.stringify(migrateCurrentState(JSON.parse(JSON.stringify(output))))!==JSON.stringify(output))throw Error('Migração não idempotente');
`,ctx);
console.log('PASS: numeração contínua 1–81, ordem física, vínculos, notas e respostas preservados.');
