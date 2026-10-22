(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.RazanePublishing=api;})(typeof window==='undefined'?globalThis:window,()=>{
'use strict';
const owner='Razanebenida', repo='razanebenida.github.io';
const base='https://api.github.com/repos/'+owner+'/'+repo;
function clean(source){
 const out={};source=source&&typeof source==='object'?source:{};
 if(source.texts&&typeof source.texts==='object'){out.texts={};for(const key of Object.keys(source.texts).sort())if(typeof source.texts[key]==='string')out.texts[key]=source.texts[key];}
 if(Array.isArray(source.publications))out.publications=source.publications.map(p=>({type:String(p.type||'Article'),title:String(p.title||''),date:String(p.date||''),description:String(p.description||''),url:String(p.url||'')}));
 for(const key of ['photo','cv','email','linkedin'])if(typeof source[key]==='string')out[key]=source[key];
 return out;
}
function canonical(source){return JSON.stringify(clean(source));}
function encode(text){const bytes=new TextEncoder().encode(text);let binary='';for(let i=0;i<bytes.length;i+=0x8000)binary+=String.fromCharCode(...bytes.subarray(i,i+0x8000));return btoa(binary);}
function decode(text){const binary=atob(text.replace(/\s/g,''));const bytes=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);return new TextDecoder().decode(bytes);}
function parse(text){const match=text.match(/^\s*window\.SITE_CONTENT\s*=\s*([\s\S]*?)\s*;?\s*$/);if(!match)throw Error('Le contenu GitHub n’est pas reconnu. Votre brouillon est conservé.');return clean(JSON.parse(match[1]));}
function create({snapshot,expectedBase,onStatus=()=>{},onPublished=()=>{},fetcher=fetch,delay=2500}){
 let token='',sha='',last='',ready=false,queued=false,running=false,timer=null,session=0;
 let lastState={kind:'disconnected',message:'Publication automatique déconnectée.'};
 const state=(kind,message)=>{lastState={kind,message};onStatus({kind,message,connected:ready,busy:running});};
 async function request(path,options={}){
  const response=await fetcher(path.startsWith('https://api.github.com/')?path:'https://api.github.com'+path,{...options,cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer',headers:{Accept:'application/vnd.github+json',Authorization:'Bearer '+token,'X-GitHub-Api-Version':'2022-11-28',...(options.body?{'Content-Type':'application/json'}:{}),...options.headers}});
  if(!response.ok){let message='GitHub n’a pas accepté l’envoi. Votre brouillon est conservé.';if(response.status===401)message='L’autorisation GitHub est invalide ou expirée. Reconnectez-vous.';if(response.status===403||response.status===404)message='Vérifiez que l’autorisation concerne ce dépôt avec Contents : Read and write.';if(response.status===409||response.status===422)message='Le dépôt a changé ailleurs. Déconnectez-vous, gardez une copie du brouillon et rechargez la version publiée avant de réessayer.';const error=Error(message);error.code=response.status;throw error;}
  return response.json();
 }
 async function remote(){
  const meta=await request(base+'/contents/site-content.js?ref=main',{headers:{Accept:'application/vnd.github.object+json'}});
  let encoded=meta.content;
  if(meta.encoding!=='base64'){const blob=await request(base+'/git/blobs/'+meta.sha);if(blob.encoding!=='base64')throw Error('Impossible de lire la version GitHub. Votre brouillon est conservé.');encoded=blob.content;}
  return {sha:meta.sha,content:canonical(parse(decode(encoded||'')))};
 }
 async function flush(){
  clearTimeout(timer);timer=null;if(!ready)return false;queued=true;if(running)return false;running=true;
  try{
   while(queued&&ready){queued=false;const currentSession=session;const content=canonical(snapshot());if(content===last)continue;
    state('sending','Envoi automatique à GitHub…');const current=await remote();if(!ready||currentSession!==session)return false;
    if(current.sha!==sha){throw Error('Une autre version a été enregistrée sur GitHub. Publication arrêtée pour protéger vos changements. Gardez une copie de votre brouillon, puis rechargez la version en ligne.');}
    const result=await request(base+'/contents/site-content.js',{method:'PUT',body:JSON.stringify({message:'Mettre à jour le site depuis l’éditeur',content:encode('window.SITE_CONTENT = '+content+';\n'),sha,branch:'main'})});
    if(currentSession!==session)return false;sha=result.content.sha;last=content;onPublished(content);state('sent','Enregistré sur GitHub. Le site public se met à jour automatiquement après le déploiement, sous quelques minutes.');
   }
   return true;
  }catch(error){ready=false;token='';queued=false;state('error',error.message||'Connexion interrompue. Votre brouillon est conservé.');return false;}
  finally{running=false;state(lastState.kind,lastState.message);}
 }
 return {
  async connect(value){if(running)throw Error('Un envoi est en cours.');token=value.trim();ready=false;session++;if(!token)throw Error('Saisissez votre autorisation GitHub.');state('connecting','Vérification du compte GitHub…');try{
   const user=await request('/user');if(String(user.login).toLowerCase()!==owner.toLowerCase())throw Error('Connectez-vous avec le compte GitHub Razanebenida.');
   const current=await remote();if(current.content!==expectedBase())throw Error('GitHub contient une version plus récente que celle de cet éditeur. Téléchargez votre brouillon puis rechargez le site avant de vous reconnecter.');
   sha=current.sha;last=current.content;ready=true;state('connected','Connectée à GitHub. Vos changements enregistrés seront publiés automatiquement.');this.schedule();return true;
  }catch(error){token='';ready=false;state('error',error.message);throw error;}},
  schedule(){if(!ready)return;clearTimeout(timer);timer=setTimeout(()=>flush(),delay);},
  flush,
  disconnect(){if(running)return false;session++;token='';ready=false;queued=false;clearTimeout(timer);timer=null;state('disconnected','Publication automatique déconnectée. Les brouillons restent sur cet appareil.');return true;},
  isConnected(){return ready;},
  isBusy(){return running;}
 };
}
return {clean,canonical,encode,decode,parse,create};
});
