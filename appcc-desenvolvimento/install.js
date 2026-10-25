window.AppccPWA=(()=>{
'use strict';let deferred=null,busy=false,installed=false,ready=false,otherInstalled=false;
const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const embedded=()=>/; wv\)|\bwv\b|FBAN|FBAV|Instagram|ChatGPT/i.test(navigator.userAgent||'');
const ios=()=>/iPhone|iPad|iPod/.test(navigator.userAgent||'');
function message(text){document.querySelectorAll('[data-pwa-status]').forEach(el=>el.textContent=text);}
function refresh(){document.querySelectorAll('[data-pwa-install]').forEach(el=>{el.disabled=busy;const label=el.querySelector('[data-pwa-install-label]')||el;label.textContent=busy?'Abrindo instalador…':installed?'Verificar APPCC instalado':standalone()&&!deferred?'Verificar instalação':'Instalar no celular';});}
const locate='No celular, abra Configurações → Aplicativos e procure Guia APPCC Revisão. Se aparecer, toque em Abrir; isso permite localizar o aplicativo mesmo quando o ícone está oculto na tela de apps.';
const conflict='Esta é a instalação independente do Guia APPCC Revisão. Se o Chrome informar “Já instalado”, confirme Guia APPCC Revisão em Configurações → Aplicativos. Não apague os dados do navegador.';
async function detect(){if(!navigator.getInstalledRelatedApps)return;try{const apps=await navigator.getInstalledRelatedApps();const own=apps.some(a=>a.platform==='webapp'&&(String(a.id||'').endsWith('/revisao-guia/appcc-desenvolvimento/')||String(a.url||'').split('?')[0].endsWith('/revisao-guia/appcc-desenvolvimento/manifest.webmanifest')));otherInstalled=false;if(own){installed=true;deferred=null;}refresh();}catch(e){}}
function help(){
if(installed)message('O Chrome confirmou que Guia APPCC Revisão está instalado. '+locate);
else if(ios())message('No Safari: Compartilhar → Adicionar à Tela de Início.');
else if(standalone()||embedded())message('Abra este endereço diretamente em uma aba do Chrome para instalar o Guia APPCC Revisão. '+conflict+' '+locate);
else message((ready?'No Chrome, toque em ⋮ → Adicionar à tela inicial → Instalar. ':'Aguarde o preparo offline e toque novamente. ')+'Se o Chrome disser “Já instalado”, '+locate+' '+conflict);
}
async function install(){if(busy)return;if(deferred&&!installed){const event=deferred;deferred=null;busy=true;refresh();try{const result=await event.prompt();const choice=event.userChoice?await event.userChoice:result;message(choice?.outcome==='accepted'?'Instalação solicitada ao Chrome. Aguarde a confirmação; o ícone se chama Guia APPCC Revisão.':'Instalação cancelada.');}catch(e){help();}finally{busy=false;refresh();}return;}await detect();help();}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;installed=false;refresh();message('Instalador disponível. Toque em Instalar no celular e confirme Guia APPCC Revisão, com o símbolo APPCC.');});
window.addEventListener('appinstalled',()=>{installed=true;deferred=null;refresh();message('O Chrome confirmou a instalação do Guia APPCC Revisão. '+locate);});
function init(){refresh();if(deferred)message('Instalador disponível. Toque em Instalar no celular.');else if(installed)message('O Chrome reconhece o Guia APPCC Revisão instalado. '+locate);else if(standalone())message('O guia está aberto em uma janela de aplicativo. Toque em Verificar instalação para identificar o Guia APPCC Revisão.');else if(otherInstalled)message(conflict);else message(ready?'Guia disponível offline. Instalação ainda não confirmada; toque em Instalar no celular.':'Preparando o guia para uso offline.');}
if('serviceWorker'in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./sw-appcc.js',{scope:'./',updateViaCache:'none'}).then(async r=>{await navigator.serviceWorker.ready;ready=true;init();r.update().catch(()=>{});}).catch(()=>message('Não foi possível preparar o modo offline. Mantenha a internet e atualize o guia.'));
async function start(){await detect();init();}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
return{install,init,isStandalone:standalone};})();
