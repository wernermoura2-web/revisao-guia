const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
const root=path.join(__dirname,'..');const config=fs.readFileSync(path.join(root,'config.js'),'utf8');
const cfg=JSON.parse(config.trim().slice(10,-1));
const texts=Object.values(cfg.itens).filter(c=>c.proc==='4.1'&&c.col===1).flatMap(c=>c.frases).filter(f=>f.ref.includes('CP 1365/25')).map(f=>f.texto);
assert.equal(crypto.createHash('sha256').update(texts.join('\n')).digest('hex'),'d71e92794f616d72e88e82fcd27b38c4283181bcccfaf9c3a30dd199d13a1d6c');
for(let col=1;col<=4;col++){
 const c=cfg.itens['q_p1c'+col+'_4'];assert.equal(c.page,0);assert.equal(c.frases.length,4);
 assert.deepEqual(c.frases.slice(1).map(f=>f.cat),['PPHO','PPRO','PC']);assert(c.frases.slice(1).every(f=>f.P===5&&!f.allowNA));
 assert(cfg.grupos['p1c'+col].includes('q_p1c'+col+'_4'));
}
const ctx=vm.createContext({window:{APPCC_PAPER:true},localStorage:{getItem:()=>null,setItem:()=>{}},console});
vm.runInContext(config+'\n'+fs.readFileSync(path.join(root,'app.js'),'utf8'),ctx);
vm.runInContext(`
S=migrateCurrentState({meta:{},a:{},units:{},notes:{},indicatorVersion:CFG.version,qualityReviewVersion:CFG.qualityVersion,responsibilityReviewVersion:CFG.responsibilityVersion});
for(const [k,c]of Object.entries(CFG.itens))if(c.proc==='4.1'&&c.sourceSerial!==4)S.a[k]=Object.fromEntries(c.frases.map((f,i)=>[i,{a:'S',cat:f.cat}]));
if(processResult('4.1')!==null)throw Error('Complemento novo deve permanecer pendente');
for(const [k,c]of Object.entries(CFG.itens))if(c.sourceSerial===4)S.a[k]=Object.fromEntries(c.frases.map((f,i)=>[i,{a:'S',cat:f.cat}]));
if(processResult('4.1')!==100)throw Error('Todos Sim devem resultar em 100%');
S.a.q_p1c1_4[2].a='N';if(!(processResult('4.1')<100))throw Error('Não deve reduzir o atendimento');
`,ctx);
console.log('PASS: textos CP intactos, três frases com P=5 nas quatro captações, novos pendentes e cálculo.');
