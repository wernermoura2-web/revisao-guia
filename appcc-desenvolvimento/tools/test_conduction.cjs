const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
const root=path.join(__dirname,'..'),config=fs.readFileSync(path.join(root,'config.js'),'utf8'),cfg=JSON.parse(config.trim().slice(10,-1));
const texts=Object.values(cfg.itens).filter(c=>c.proc==='4.2'&&c.col===1).flatMap(c=>c.frases).filter(f=>f.ref.includes('CP 1365/25')).map(f=>f.texto);
assert.equal(crypto.createHash('sha256').update(texts.join('\n')).digest('hex'),'e0825be48dc7ab9ab8807b57ce83cce0c74e19b402ff3975b2bca4358dd1d563');
for(let col=1;col<=4;col++){
 const c=cfg.itens['q_p2c'+col+'_10'];assert.equal(c.frases.length,5);assert.deepEqual(c.frases.slice(2).map(f=>f.cat),['PPHO','PPRO','PC']);assert(c.frases.slice(2).every(f=>f.P===5));
}
const ctx=vm.createContext({window:{APPCC_PAPER:true},localStorage:{getItem:()=>null,setItem:()=>{}},console});
vm.runInContext(config+'\n'+fs.readFileSync(path.join(root,'app.js'),'utf8'),ctx);
vm.runInContext(`
const input={meta:{},a:{q_p2c1_10:{0:{a:'S',obs:'Higienização'},1:{a:'N',obs:'Capacitação'},2:{a:'S',obs:'Registro antigo'}},q_p2c1_7:{0:{a:'N',obs:'Material'}}},notes:{1:'Nota da condução'},fields:{},units:{},indicatorVersion:CFG.version,qualityReviewVersion:CFG.qualityVersion,responsibilityReviewVersion:CFG.responsibilityVersion,numberingVersion:CFG.numberingVersion,captureMergeVersion:CFG.captureMergeVersion,hygienePCCVersion:'pcc-higienizacao-20261025-v2'};
const after=migrateCurrentState(JSON.parse(JSON.stringify(input)));
if(after.a.q_p2c1_10[0].obs!=='Higienização'||after.a.q_p2c1_10[1].a!=='N')throw Error('Respostas mantidas perdidas');
if(after.a.q_p2c1_10[2]||after.a.q_p2c1_10[3]||after.a.q_p2c1_10[4])throw Error('Respostas inventadas em requisitos ampliados');
if(after.legacyConductionReview.q_p2c1_10[2].obs!=='Registro antigo'||after.notes[1]!=='Nota da condução'||after.a.q_p2c1_7[0].obs!=='Material')throw Error('Histórico ou outros dados perdidos');
if(JSON.stringify(migrateCurrentState(JSON.parse(JSON.stringify(after))))!==JSON.stringify(after))throw Error('Migração não idempotente');
S=after;if(processResult('4.2')!==null)throw Error('Novos deveriam estar pendentes');
for(const [k,c]of Object.entries(CFG.itens))if(c.proc==='4.2')S.a[k]=Object.fromEntries(c.frases.map((f,i)=>[i,{a:'S',cat:f.cat}]));
if(processResult('4.2')!==100)throw Error('Todos Sim devem atingir 100%');
S.a.q_p2c1_10[3].a='N';if(!(processResult('4.2')<100))throw Error('Liberação Não deve reduzir atendimento');
`,ctx);
console.log('PASS: textos CP preservados, P5 nos complementos, migração com histórico e cálculo.');
