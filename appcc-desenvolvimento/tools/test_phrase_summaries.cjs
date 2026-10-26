const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.join(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8');
const ctx=vm.createContext({console,window:{APPCC_PAPER:true,addEventListener(){}},localStorage:{getItem(){return null;},setItem(){},removeItem(){}}});
vm.runInContext(read('config.js')+'\n'+read('inspector-orientations.js'),ctx);
const before=JSON.stringify(ctx.window.InspectorOrientations.catalog().map(r=>r.id));
const original=vm.runInContext('JSON.stringify(CFG)',ctx);
vm.runInContext(read('phrase-summaries.js')+'\n'+read('inspector-orientations.js')+'\n'+read('app.js'),ctx);
assert.equal(JSON.stringify(ctx.window.InspectorOrientations.catalog().map(r=>r.id)),before,'Stable identities preserve saved guidance');
let revised=0;for(const row of ctx.window.InspectorOrientations.catalog())for(const instance of row.instances){ctx.key=instance.key;ctx.index=instance.index;vm.runInContext(`{const c=CFG.itens[key],f=c.frases[index],r=rows(key)[index];if(f.resumo){if(r.texto!==f.resumo||r.sourceTexto!==f.texto)throw Error('Missing concise/source text');}if(r.ref!==f.ref||r.P!==f.P||r.cat!==f.cat)throw Error('Evaluation changed');}`,ctx);if(row.sourceTexts.length)revised++;}
const current=vm.runInContext('JSON.stringify(CFG, (k,v)=>k==="resumo"?undefined:v)',ctx);assert.equal(current,original,'Source model unchanged');assert(revised>0);
const catalog=ctx.window.InspectorOrientations.catalog();assert(catalog.every(r=>r.references.length));assert.equal(new Set(catalog.filter(r=>r.sourceTexts.length).map(r=>r.proc)).size,8);
console.log('PASS concise wording in eight processes; full text, legal references, evaluation data and saved guidance identities preserved');
