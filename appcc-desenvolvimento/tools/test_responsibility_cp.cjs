const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.join(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8');
const ctx=vm.createContext({window:{APPCC_PAPER:true,addEventListener(){}},localStorage:{getItem(){return null;},setItem(){},removeItem(){}},console});
vm.runInContext(read('config.js'),ctx);const before=JSON.parse(vm.runInContext('JSON.stringify(CFG)',ctx));
vm.runInContext(read('process-display.js'),ctx);const after=JSON.parse(vm.runInContext('JSON.stringify(CFG)',ctx));
let additions=0;for(const [key,c]of Object.entries(after.itens)){
 const old=before.itens[key];assert.equal(c.code,old.code);
 if(c.proc!=='4.11'){assert.deepEqual(c.frases,old.frases);continue;}
 assert(/CP 1362\/2025 \(proposta\), arts?\./.test(c.overviewRef));
 assert.equal(c.cpReviewVersion,'responsaveis-cp1362-20261027');
 for(let i=0;i<old.frases.length;i++)for(const prop of ['texto','cat','P','orientacao','allowNA'])assert.equal(c.frases[i][prop],old.frases[i][prop]);
 for(const f of c.frases.slice(old.frases.length)){assert.equal(f.P,5);assert(f.ref.includes('1362/2025 (proposta)'));assert(f.orientacao&&f.resumo);assert.equal(f.allowNA,false);additions++;}
}
assert.equal(additions,15);const once=vm.runInContext('JSON.stringify(CFG)',ctx);vm.runInContext(read('process-display.js'),ctx);assert.equal(vm.runInContext('JSON.stringify(CFG)',ctx),once);
vm.runInContext(read('inspector-orientations.js')+'\n'+read('app.js'),ctx);
ctx.saved={meta:{},a:{},units:{},names:{},notes:{12:'Observação preservada'},indicatorVersion:before.version,qualityReviewVersion:before.qualityVersion,hygienePCCVersion:'pcc-higienizacao-20261025-v2',configurationVersion:'captacao-soma-20261024'};
// Start from a migrated current inspection, then inject all pre-CP answers.
vm.runInContext('saved=migrateCurrentState(saved)',ctx);
for(const [key,c]of Object.entries(before.itens))if(c.proc==='4.11')ctx.saved.a[key]=Object.fromEntries(c.frases.map((f,i)=>[i,{a:i%2?'N':'S',cat:f.cat,obs:'Manter '+i}]));
const prior=JSON.parse(JSON.stringify(ctx.saved));vm.runInContext('saved=migrateCurrentState(saved);S=saved',ctx);
assert.deepEqual(JSON.parse(vm.runInContext('JSON.stringify(saved)',ctx)),prior);
assert.equal(vm.runInContext("processResult('4.11')",ctx),null);
for(const [key,c]of Object.entries(before.itens))if(c.proc==='4.11')for(let i=c.frases.length;i<after.itens[key].frases.length;i++)assert.equal(ctx.saved.a[key][i],undefined);
vm.runInContext("for(const [k,c]of Object.entries(CFG.itens))if(c.proc==='4.11')S.a[k]=Object.fromEntries(c.frases.map((f,i)=>[i,{a:'S',cat:f.cat}]))",ctx);assert.equal(vm.runInContext("processResult('4.11')",ctx),100);
assert.equal(ctx.window.InspectorOrientations.catalog().length,258);
console.log('PASS CP1362: 15 new pending checks, 8 codes, old answers and guidance IDs preserved, idempotent model, all-Sim=100%');
