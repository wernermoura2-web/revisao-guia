const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..'),config=fs.readFileSync(path.join(root,'config.js'),'utf8'),cfg=JSON.parse(config.trim().slice(10,-1));
for(let col=1;col<=4;col++){
 const c=cfg.itens['q_p1c'+col+'_97'];assert.equal(c.code,'6');assert.equal(c.frases.length,3);assert.deepEqual(c.frases.map(f=>f.cat),['PC','PPRO','PC']);assert(c.frases.every(f=>f.P===5));assert(c.frases[2].texto.includes('DOU'));
}
const ctx=vm.createContext({window:{APPCC_PAPER:true},localStorage:{getItem:()=>null,setItem:()=>{}},console});
vm.runInContext(config+'\n'+fs.readFileSync(path.join(root,'app.js'),'utf8'),ctx);
vm.runInContext(`
const input={meta:{},a:{q_p1c1_4:{0:{a:'S',obs:'Higienização mantida'}},q_p3c1_96:{0:{a:'N',obs:'Fluxo antigo'}}},fields:{obs_p7_19:'Nota recepção',obs_p13_81:'Último item'},notes:{0:'Nota geral'},units:{},indicatorVersion:CFG.version,qualityReviewVersion:CFG.qualityVersion,responsibilityReviewVersion:CFG.responsibilityVersion,numberingVersion:CFG.numberingVersion,captureMergeVersion:CFG.captureMergeVersion,conductionReviewVersion:CFG.conductionReviewVersion,reservoirReviewVersion:CFG.reservoirReviewVersion,hygienePCCVersion:'pcc-higienizacao-20261025-v2'};
const after=migrateCurrentState(JSON.parse(JSON.stringify(input)));
if(JSON.stringify(after.a)!==JSON.stringify(input.a))throw Error('Respostas antigas alteradas');
if(after.a.q_p1c1_97)throw Error('Requisito novo respondido sem avaliação');
if(after.fields.obs_p7_20!=='Nota recepção'||after.fields.obs_p13_82!=='Último item'||after.notes[0]!=='Nota geral')throw Error('Notas ou renumeração incorretas');
if(JSON.stringify(migrateCurrentState(JSON.parse(JSON.stringify(after))))!==JSON.stringify(after))throw Error('Migração não idempotente');
S=after;for(const [k,c]of Object.entries(CFG.itens))if(c.proc==='4.1'&&c.sourceSerial!==97)S.a[k]=Object.fromEntries(c.frases.map((f,i)=>[i,{a:'S',cat:f.cat}]));
if(processResult('4.1')!==null)throw Error('Classificação nova deveria estar pendente');
for(const [k,c]of Object.entries(CFG.itens))if(c.sourceSerial===97)S.a[k]=Object.fromEntries(c.frases.map((f,i)=>[i,{a:'S',cat:f.cat}]));
if(processResult('4.1')!==100)throw Error('Todos Sim diferentes de 100%');
S.a.q_p1c1_97[1].a='N';if(!(processResult('4.1')<100))throw Error('Fonte não autorizada deve reduzir atendimento');
`,ctx);
console.log('PASS: indicador 6, PC/PPRO/PC, P5, pendência inicial, renumeração, preservação e cálculo.');
