// Pontuação: afinidade = correlação de perfil (traços) + sinal direto das escolhas ligadas a cada docente.
(function(root){
const mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
function corr(a,b){const ma=mean(a),mb=mean(b);let n=0,da=0,db=0;a.forEach((x,i)=>{n+=(x-ma)*(b[i]-mb);da+=(x-ma)**2;db+=(b[i]-mb)**2;});return da&&db?n/Math.sqrt(da*db):0;}
// Vetores dos docentes recentrados pela média de cada traço: o que destaca um docente do grupo pesa mais do que o que é comum a todos.
function zProfiles(profiles){
 const cm=Array.from({length:8},(_,k)=>mean(profiles.map(p=>p.t[k])));
 return profiles.map(p=>p.t.map((x,k)=>x-cm[k]));
}
let W_DIRECT=2.5;
function rank(user,direct,profiles,poss){
 const Z=zProfiles(profiles);
 poss=poss||{};
 // docentes sem nenhuma opção ligada a eles recebem o sinal direto médio dos demais (nem prêmio, nem punição)
 const dd=profiles.map(p=>(direct[p.id]||0)/((poss[p.id]||0)+3));
 const withTag=profiles.map((p,i)=>poss[p.id]>0?dd[i]:null).filter(x=>x!==null);
 const base=withTag.length?mean(withTag):0;
 return profiles.map((p,i)=>{
  const r=corr(user,Z[i]),rRaw=corr(user,p.t);
  const d=poss[p.id]>0?dd[i]:base;
  return {p,r:rRaw,z:r,d,s:r+W_DIRECT*d};
 }).sort((a,b)=>b.s-a.s);
}
function possible(questions){const o={};questions.forEach(q=>{const m={};for(const k in (q.p||{}))m[k]=2*q.p[k];for(const k in m)o[k]=(o[k]||0)+m[k];});return o;}
root.Score={mean,corr,zProfiles,rank,possible,W(v){W_DIRECT=v;}};
if(typeof module!=="undefined")module.exports=root.Score;
})(typeof window!=="undefined"?window:globalThis);
