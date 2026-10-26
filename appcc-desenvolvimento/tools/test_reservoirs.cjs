const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
const root=path.join(__dirname,'..'),config=fs.readFileSync(path.join(root,'config.js'),'utf8'),cfg=JSON.parse(config.trim().slice(10,-1));
const texts=Object.values(cfg.itens).filter(c=>c.proc==='4.3').flatMap(c=>c.frases).filter(f=>f.ref.includes('CP 1365/25')).map(f=>f.texto);
assert.equal(crypto.createHash('sha256').update(texts.join('\n')).digest('hex'),'47048838dc3959d52745f924644eb57b0ed8124c01f6e43f7d9b823544b9c79c');
for(let page=3;page<=6;page++)for(let col=1;col<=4;col++){
 const f=cfg.itens['q_p'+page+'c'+col+'_14'],h=cfg.itens['q_p'+page+'c'+col+'_16'],o=cfg.itens['q_p'+page+'c'+col+'_96'];
 assert.equal(f.frases.length,5);assert.equal(h.frases.length,6);assert.equal(o.frases.length,5);
 assert([...f.frases.slice(4),...h.frases.slice(3),...o.frases].every(f=>f.P===5));
 assert(o.frases[1].ref.includes('DOU'));assert(o.frases[1].ref.includes('equivalência'));
}
const ctx=vm.createContext({window:{APPCC_PAPER:true},localStorage:{getItem:()=>null,setItem:()=>{}},console});
vm.runInContext(config+'\n'+fs.readFileSync(path.join(root,'app.js'),'utf8'),ctx);
vm.runInContext(`
const input={meta:{},a:{q_p3c1_14:{0:{a:'S',obs:'Extravasor'},3:{a:'N',obs:'Sem registro de filtro'}},q_p3c1_16:{0:{a:'S'},2:{a:'S'},3:{a:'N',obs:'Registro antigo'}},q_p2c1_10:{0:{a:'S',obs:'Condução mantida'}}},fields:{obs_p7_18:'Recepção'},notes:{2:'Nota reservatório'},units:{},indicatorVersion:CFG.version,qualityReviewVersion:CFG.qualityVersion,responsibilityReviewVersion:CFG.responsibilityVersion,numberingVersion:CFG.numberingVersion,captureMergeVersion:CFG.captureMergeVersion,conductionReviewVersion:CFG.conductionReviewVersion,hygienePCCVersion:'pcc-higienizacao-20261025-v2'};
const after=migrateCurrentState(JSON.parse(JSON.stringify(input)));
if(after.a.q_p3c1_14[0].obs!=='Extravasor'||after.a.q_p3c1_16[2].a!=='S')throw Error('Perdeu resposta mantida');
if(after.a.q_p3c1_14[3]||after.a.q_p3c1_14[4]||after.a.q_p3c1_16[3]||after.a.q_p3c1_96)throw Error('Nova avaliação herdou resposta');
if(after.legacyReservoirReview.q_p3c1_14[3].obs!=='Sem registro de filtro'||after.legacyReservoirReview.q_p3c1_16[3].obs!=='Registro antigo')throw Error('Histórico perdido');
if(after.a.q_p2c1_10[0].obs!=='Condução mantida'||after.notes[2]!=='Nota reservatório'||after.fields.obs_p7_20!=='Recepção')throw Error('Dados não relacionados alterados');
if(JSON.stringify(migrateCurrentState(JSON.parse(JSON.stringify(after))))!==JSON.stringify(after))throw Error('Migração não idempotente');
S=after;if(processResult('4.3')!==null)throw Error('Novos devem ficar pendentes');
for(const [k,c]of Object.entries(CFG.itens))if(c.proc==='4.3')S.a[k]=Object.fromEntries(c.frases.map((f,i)=>[i,{a:'S',cat:f.cat}]));
if(processResult('4.3')!==100)throw Error('Todos Sim devem atingir 100%');
S.a.q_p3c1_96[1].a='N';if(!(processResult('4.3')<100))throw Error('Origem inadequada deve reduzir atendimento');
`,ctx);
console.log('PASS: CP intacta nas quatro páginas, P5, origens/DOU, migração com histórico, numeração e cálculo.');
