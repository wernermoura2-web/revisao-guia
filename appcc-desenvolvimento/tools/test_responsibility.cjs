const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.join(__dirname,'..');
const ctx=vm.createContext({window:{APPCC_PAPER:true},localStorage:{getItem:()=>null,setItem:()=>{}},console});
vm.runInContext(fs.readFileSync(path.join(root,'config.js'),'utf8')+'\n'+fs.readFileSync(path.join(root,'app.js'),'utf8'),ctx);
vm.runInContext(`
const input={meta:{},a:{q_p13c1_79:{0:{a:'S',obs:'Registro mantido'}},q_p13c1_80:{0:{a:'S'},2:{a:'N',obs:'Rótulo antigo'}},q_p13c1_81:{0:{a:'S'},1:{a:'N'}},q_p13c1_82:{0:{a:'S'}}},notes:{12:'Nota manual'},units:{},indicatorVersion:CFG.version,qualityReviewVersion:CFG.qualityVersion,hygienePCCVersion:'pcc-higienizacao-20261025-v2'};
const after=migrateCurrentState(JSON.parse(JSON.stringify(input)));
if(after.a.q_p13c1_79[0].obs!=='Registro mantido'||after.a.q_p13c1_81[1].a!=='N')throw Error('Respostas mantidas perdidas');
if(after.a.q_p13c1_80||after.a.q_p13c1_91||after.a.q_p13c1_79[1])throw Error('Novos requisitos herdaram respostas');
if(after.a.q_p13c1_81[0].cat!=='PPR'||after.a.q_p13c1_82[0].cat!=='PC')throw Error('Classificação não atualizada');
if(after.legacyResponsibilityReview.answers.q_p13c1_80[2].obs!=='Rótulo antigo'||after.notes[12]!=='Nota manual')throw Error('Arquivo histórico perdido');
if(JSON.stringify(migrateCurrentState(JSON.parse(JSON.stringify(after))))!==JSON.stringify(after))throw Error('Migração não idempotente');
S=after;if(processResult('4.11')!==null)throw Error('Deveria aguardar requisitos novos');
for(const [k,c]of Object.entries(CFG.itens))if(c.proc==='4.11')S.a[k]=Object.fromEntries(c.frases.map((f,i)=>[i,{a:'S',cat:f.cat}]));
if(processResult('4.11')!==100)throw Error('Todos Sim devem atingir 100%');
S.a.q_p13c1_80[1].a='A';if(processResult('4.11')!==100)throw Error('NA do RT deve excluir somente essa frase');
S.a.q_p13c1_81[0].a='N';if(!(processResult('4.11')<100))throw Error('Não deve reduzir atendimento');
`,ctx);
console.log('PASS: respostas antigas, arquivo histórico, idempotência, novos pendentes e cálculo com NA na revisão de responsáveis.');
