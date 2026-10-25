const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..');const all=[],ids={};
class Element{
 constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.style={};this.dataset={};this.value='';this.textContent='';this.hidden=false;this.clientWidth=1000;this.complete=true;this.naturalWidth=1;this.classes=new Set();all.push(this);this.classList={add:(...c)=>c.forEach(x=>this.classes.add(x)),remove:(...c)=>c.forEach(x=>this.classes.delete(x)),toggle:(c,v)=>{v??=!this.classes.has(c);v?this.classes.add(c):this.classes.delete(c)}};}
 set className(v){this.classes=new Set(v.split(/\s+/))}get className(){return [...this.classes].join(' ')}
 appendChild(e){this.children.push(e);return e}setAttribute(n,v){this[n]=v}removeAttribute(n){delete this[n]}
 querySelector(s){return this.children.find(e=>s[0]==='.'?e.classes.has(s.slice(1)):e.tagName===s.toUpperCase())||null}
 getContext(){return {font:'',measureText:t=>({width:t.length*3})}}
}
const document={activeElement:null,createElement:t=>new Element(t),getElementById:id=>ids[id]||(ids[id]=new Element()),querySelectorAll:s=>all.filter(e=>s[0]==='.'&&e.classes.has(s.slice(1))),querySelector:()=>new Element(),fonts:{ready:Promise.resolve()}};
document.getElementById('paper-zoom').value='1';
const window={APPCC_PAPER:true,addEventListener(){},LegalDocuments:null};
const ctx=vm.createContext({window,document,localStorage:{getItem:()=>null,setItem:()=>{}},console,URLSearchParams,location:{search:''},confirm:()=>false,setTimeout:()=>{},URL,Blob});
for(const n of ['config.js','app.js','legal-documents.js','pcc-final.js'])vm.runInContext(fs.readFileSync(path.join(root,n),'utf8'),ctx);
vm.runInContext(fs.readFileSync(path.join(root,'paper-data-layout-v6.js'),'utf8'),ctx);
// A stale field on page 12 used to abort the DOM build at page 11.
vm.runInContext(`PAPER[11].fields.push({n:'b_q_p12c1_obsolete_S',type:'/Btn',x:0,y:0,w:20,h:12,font:6,push:true,label:'Sim'});PAPER[11].fields.push({n:'classe_p12_obsolete',type:'/Tx',x:0,y:0,w:20,h:12,font:6,ro:true});`,ctx);
vm.runInContext(fs.readFileSync(path.join(root,'paper.js'),'utf8'),ctx);
assert.equal(document.querySelectorAll('.paper-sheet').length,22);
assert.equal(ids['paper-page'].children.length,22);
const visible=()=>document.querySelectorAll('.paper-sheet').filter(e=>!e.hidden);
for(let page=1;page<=21;page++){ids['paper-next'].onclick();assert.equal(visible().length,1);assert.equal(visible()[0].dataset.pageIndex,page);assert(ids['paper-title'].textContent.startsWith('Página '+(page+1)+' de 22'));}
assert(ids['paper-next'].disabled);
for(let page=20;page>=0;page--){ids['paper-prev'].onclick();assert.equal(visible()[0].dataset.pageIndex,page);}
assert(ids['paper-prev'].disabled);
ids['paper-page'].onchange({target:{value:'11'}});assert.equal(visible()[0].dataset.pageIndex,11);
assert(all.filter(e=>e.tagName==='BUTTON'&&e['aria-label']==='F').every(e=>e.textContent==='F'));
assert(all.filter(e=>e.tagName==='BUTTON'&&e['aria-label']==='Sim').every(e=>e.textContent.includes('Sim')));
console.log('PASS: 22 páginas, Próxima/Anterior/seletor, rótulos visíveis e tolerância a campos antigos na página 12.');
