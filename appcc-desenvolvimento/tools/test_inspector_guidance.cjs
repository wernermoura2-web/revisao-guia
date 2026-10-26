const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..');const config=fs.readFileSync(path.join(root,'config.js'),'utf8'),cfg=JSON.parse(config.trim().slice(10,-1));
const elements={};const document={getElementById:id=>elements[id]||(elements[id]={textContent:'',innerHTML:''})};
const ctx=vm.createContext({document,window:{APPCC_PAPER:true},localStorage:{getItem:()=>null,setItem:()=>{}},console});
vm.runInContext(config+'\n'+fs.readFileSync(path.join(root,'app.js'),'utf8'),ctx);
for(const [key,c]of Object.entries(cfg.itens)){
 if(!['4.1','4.2','4.3'].includes(c.proc))continue;
 assert(c.inspectorGuidanceEnabled);assert(c.frases.every(f=>f.orientacao));
 vm.runInContext(`editing=${JSON.stringify(key)};S.a[editing]={0:{a:'N',obs:'Observação do inspetor preservada'}};renderPhrases();`,ctx);
 const body=elements['phrase-body'].innerHTML;
 for(const f of c.frases){assert(body.includes(f.orientacao));assert(body.includes(f.texto.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')));}
 assert.equal((body.match(/Orientação ao inspetor:/g)||[]).length,c.frases.length);
 assert(body.includes('Observação do inspetor preservada'));
}
const paper=JSON.parse(fs.readFileSync(path.join(root,'paper-data-layout-v6.js'),'utf8').split('=',2)[1].trim().slice(0,-1));
for(let page=0;page<6;page++){
 const min=page===0?cfg.captureObservationMinHeight:page===1?cfg.conductionObservationMinHeight:cfg.reservoirObservationMinHeight;
 for(const suffix of ['','_col2'])assert(paper[page].fields.find(f=>f.n==='obs_gerais_p'+(page+1)+suffix).h>=min-.01);
 for(const [key,c]of Object.entries(cfg.itens))if(c.page===page)assert(paper[page].fields.some(f=>f.n==='b_'+key+'_F'));
}
console.log('PASS: requisito completo e orientação no F de captação, condução e reservatórios; notas e área das observações preservadas.');
