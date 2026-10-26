const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..'),ctx=vm.createContext({window:{APPCC_PAPER:true},localStorage:{getItem:()=>null,setItem:()=>{}},console});
vm.runInContext(fs.readFileSync(path.join(root,'config.js'),'utf8')+'\n'+fs.readFileSync(path.join(root,'app.js'),'utf8'),ctx);
vm.runInContext(`
const input={meta:{},a:{q_p1c1_4:{0:{a:'S',obs:'Monitoramento'}},q_p1c1_95:{0:{a:'S',obs:'Concentração'},1:{a:'N',obs:'Resíduo'},2:{a:'N',obs:'Registro'}},q_p2c1_6:{0:{a:'S',obs:'Condução'}}},fields:{obs_p13_76:'Nota formação'},notes:{0:'Nota geral'},units:{},indicatorVersion:CFG.version,qualityReviewVersion:CFG.qualityVersion,responsibilityReviewVersion:CFG.responsibilityVersion,numberingVersion:CFG.numberingVersion,hygienePCCVersion:'pcc-higienizacao-20261025-v2'};
const after=migrateCurrentState(JSON.parse(JSON.stringify(input)));
if(after.a.q_p1c1_4[0].obs!=='Monitoramento'||after.a.q_p1c1_4[1].obs!=='Concentração'||after.a.q_p1c1_4[2].a!=='N'||after.a.q_p1c1_4[3].obs!=='Registro')throw Error('Respostas da unificação perdidas');
if(after.a.q_p1c1_95)throw Error('Item duplicado');
if(after.a.q_p2c1_6[0].obs!=='Condução'||after.notes[0]!=='Nota geral'||after.fields.obs_p13_77!=='Nota formação')throw Error('Dados de outros campos alterados');
if(after.legacyCaptureSupplement.q_p1c1_95[1].obs!=='Resíduo')throw Error('Histórico perdido');
if(JSON.stringify(migrateCurrentState(JSON.parse(JSON.stringify(after))))!==JSON.stringify(after))throw Error('Migração não idempotente');
`,ctx);
console.log('PASS: unificação transfere as três respostas e preserva frase ANM, observações e histórico.');
