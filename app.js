const $=s=>document.querySelector(s);
const screens=["intro","quiz","result"].map(x=>$("#"+x));
// Traços: T A D I M C O V (mesma ordem dos vetores dos professores)
const TRAITS=[
 {n:"Abstração e rigor",short:"Rigor",style:"Você quer entender por que algo é verdade: procura definições limpas, hipóteses explícitas e argumentos que não deixem brechas.",blind:"Vale lembrar que nem todo problema espera por uma formulação perfeita; às vezes é preciso agir com o que já se tem."},
 {n:"Impacto aplicado",short:"Aplicação",style:"Uma ideia só está completa, para você, quando ajuda alguém em um problema real; o contexto importa tanto quanto a técnica.",blind:"Dar espaço a perguntas sem utilidade imediata costuma render as melhores ideias aplicadas de amanhã."},
 {n:"Dados e padrões",short:"Dados",style:"Você confia no que os dados mostram e tem faro para regularidades escondidas em grandes volumes de informação.",blind:"Cuidado com padrões sem explicação: um mecanismo ou uma teoria ajudam a separar achado de coincidência."},
 {n:"Incerteza",short:"Incerteza",style:"Você pensa em termos de probabilidade e confiança: pergunta o quanto pode estar errado antes de afirmar algo.",blind:"Nem tudo precisa virar probabilidade; algumas estruturas são exatas e merecem ser tratadas como tais."},
 {n:"Dinâmica e mecanismos",short:"Dinâmica",style:"Você enxerga o mundo como sistemas que evoluem: quer saber quais engrenagens produzem o comportamento observado.",blind:"Modelos mecanicistas só valem se confrontados com dados; evite se apaixonar pela própria engrenagem."},
 {n:"Construção e computação",short:"Computação",style:"Você pensa construindo: prototipa, programa, testa e aprende com o que roda. Um algoritmo é, para você, uma forma de compreender.",blind:"Antes de implementar, vale parar e perguntar se o problema está bem formulado."},
 {n:"Decisão e otimização",short:"Decisão",style:"Você enxerga escolhas, custos e compromissos: quer saber qual é a melhor decisão possível e quais garantias existem.",blind:"Nem toda boa pergunta é uma decisão; explorar sem a pressão de escolher também tem valor."},
 {n:"Comunicação e visualização",short:"Visual",style:"Você acredita que entender é conseguir mostrar: busca a representação, a imagem ou a explicação que torna o difícil legível.",blind:"Uma boa imagem pode esconder hipóteses frágeis; vale checar o que está por baixo do gráfico."}
];
const LEVELS={10:{name:"Rápido",cap:88,prec:"visão geral"},20:{name:"Equilibrado",cap:93,prec:"boa precisão"},30:{name:"Profundo",cap:97,prec:"alta precisão"}};
let current=0,total=10,order=[],user=[],direct={},picks=[];
function show(n){screens.forEach((s,i)=>s.classList.toggle("active",i===n));document.body.dataset.screen=["intro","quiz","result"][n];window.scrollTo({top:0,behavior:"smooth"});}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function parse(w){const v=Array(8).fill(0);for(const m of w.matchAll(/([TADIMCOV])(\d)/g))v["TADIMCOV".indexOf(m[1])]+=+m[2];return v;}
// As perguntas foram escritas em blocos de 10; cada nível usa o início do banco.
function start(n){total=n;current=0;user=Array(8).fill(0);direct={};picks=[];order=QUIZ_DATA.questions.slice(0,n);buildSegments();show(1);renderQuestion();}
function buildSegments(){const s=$("#segments");s.innerHTML="";for(let i=0;i<total;i++){s.appendChild(document.createElement("i"));}}
const SCALE=[{a:2,t:"Concordo totalmente"},{a:1,t:"Concordo parcialmente"},{a:0,t:"Indiferente"},{a:-1,t:"Discordo parcialmente"},{a:-2,t:"Discordo totalmente"}];
const dFac=a=>a>0?a:0.4*a; // discordar pesa menos que concordar como evidência de afinidade com um docente
function renderQuestion(){
 const q=order[current];
 $("#count").innerHTML=`AFIRMAÇÃO ${String(current+1).padStart(2,"0")} <span>/ ${total}</span>`;
 $("#q-index").textContent=String(current+1).padStart(2,"0");
 [...$("#segments").children].forEach((e,i)=>e.className=i<current?"done":i===current?"now":"");
 $("#back").style.visibility=current?"visible":"hidden";
 $("#prompt").textContent="“"+q.prompt+"”";$("#answers").innerHTML="";
 const card=$(".question-content");card.classList.remove("swap");void card.offsetWidth;card.classList.add("swap");
 SCALE.forEach((o,i)=>{const b=document.createElement("button");b.className="likert l"+(i+1);b.innerHTML=`<i class="dot"></i><span class="txt"></span><span class="key">${i+1}</span>`;b.querySelector(".txt").textContent=o.t;b.addEventListener("click",()=>choose(o.a));$("#answers").appendChild(b);});
}
function apply(q,a,sign){parse(q.w).forEach((x,k)=>user[k]+=sign*a*x);for(const k in (q.p||{}))direct[k]=(direct[k]||0)+sign*dFac(a)*q.p[k];}
function choose(a){const q=order[current];apply(q,a,1);picks.push({q,a});current++;current<total?renderQuestion():finish();}
function undo(){if(!current)return;const x=picks.pop();apply(x.q,x.a,-1);current--;renderQuestion();}
const {mean}=Score;
function contrib(u,t,Z){const mu=mean(u),mp=mean(Z);return u.map((x,k)=>(x-mu)*(Z[k]-mp));}
function p(text,cls){const e=document.createElement("p");if(cls)e.className=cls;e.textContent=text;return e;}
function list(a){return a.length>1?a.slice(0,-1).join(", ")+" e "+a[a.length-1]:a[0]||"";}
const initials=n=>n.split(" ").filter(w=>/^[A-ZÀ-Ú]/.test(w)&&w.length>2).map(w=>w[0]);
function avatar(pr,cls){
 const d=document.createElement("div");d.className="avatar "+(cls||"");
 const ini=initials(pr.name),mono=ini[0]+(ini[ini.length-1]||"");
 d.innerHTML=`<span class="mono"></span>`;d.firstChild.textContent=mono;
 // tenta fotos/<id>.jpg, .jpeg, .png, .webp (nome em minúsculas, igual ao id em data.js)
 const exts=["jpg","jpeg","png","webp","JPG","PNG"];let i=0;
 const img=new Image();img.alt=pr.name;img.decoding="async";
 img.onload=()=>{if(img.naturalWidth<40){next();return;}d.classList.add("has-photo");d.appendChild(img);};
 img.onerror=()=>next();
 function next(){if(i<exts.length)img.src="fotos/"+pr.id+"."+exts[i++];else console.warn("sem foto para",pr.id);}
 next();
 return d;
}
function radar(el,u,prof){
 const N=8,R=110,C=150,lo=Math.min(...u),hi=Math.max(...u),nu=u.map(v=>hi>lo?.12+.88*(v-lo)/(hi-lo):.5);
 const pt=(k,v)=>{const a=-Math.PI/2+k*2*Math.PI/N;return[C+Math.cos(a)*R*v,C+Math.sin(a)*R*v];};
 const poly=vals=>vals.map((v,k)=>pt(k,v).join(",")).join(" ");
 let g="";[.25,.5,.75,1].forEach(l=>g+=`<polygon class="ring" points="${poly(Array(N).fill(l))}"/>`);
 for(let k=0;k<N;k++){const[x,y]=pt(k,1);g+=`<line class="spoke" x1="${C}" y1="${C}" x2="${x}" y2="${y}"/>`;}
 g+=`<polygon class="shape prof" points="${poly(prof.t.map(v=>v/5))}"/><polygon class="shape you" points="${poly(nu)}"/>`;
 u.forEach((v,k)=>{const[x,y]=pt(k,nu[k]);g+=`<circle class="dot" cx="${x}" cy="${y}" r="3"/>`;});
 for(let k=0;k<N;k++){const[x,y]=pt(k,1.2);g+=`<text class="lab" x="${x}" y="${y}" text-anchor="${x<C-8?"end":x>C+8?"start":"middle"}" dominant-baseline="middle">${TRAITS[k].short.toUpperCase()}</text>`;}
 el.innerHTML=`<svg viewBox="-30 -5 360 310" role="img" aria-label="Radar dos seus traços comparado ao do docente">${g}</svg>`;
}
function finish(){
 const ranked=Score.rank(user,direct,QUIZ_DATA.profiles,Score.possible(order));
 const top=ranked[0],pr=top.p,L=LEVELS[total];
 // o antagonista é o perfil mais distante em traços, sem influência do sinal direto
 const byTraits=ranked.slice().sort((a,b)=>(a.r+a.z)-(b.r+b.z)),anti=byTraits[0];
 const sorted=user.map((v,k)=>[v,k]).sort((a,b)=>b[0]-a[0]),k1=sorted[0][1],k2=sorted[1][1],kl=sorted[7][1];
 const x=top.r*0.5+Math.min(1,top.d)*0.5;
 const pct=Math.min(L.cap,Math.max(60,Math.round(56+42*x)));
 $("#winner").textContent=pr.name;
 $("#field").textContent=pr.role.toUpperCase()+"  ·  "+pr.field.toUpperCase();
 $("#portrait").innerHTML="";$("#portrait").appendChild(avatar(pr,"xl"));
 $("#match-value").textContent="0%";$("#match-fill").style.width="0";
 requestAnimationFrame(()=>setTimeout(()=>{$("#match-fill").style.width=pct+"%";let c=0;const t=setInterval(()=>{c+=2;if(c>=pct){c=pct;clearInterval(t);}$("#match-value").textContent=c+"%";},14);},120));
 $("#level-tag").textContent=`· NÍVEL ${L.name.toUpperCase()} (${total})`;
 const d=$("#description");d.innerHTML="";
 d.appendChild(p(`O seu jeito de pensar. ${TRAITS[k1].style} Logo em seguida vem ${TRAITS[k2].n.toLowerCase()}: ${TRAITS[k2].style.charAt(0).toLowerCase()+TRAITS[k2].style.slice(1)}`));
 const Zp=Score.zProfiles(QUIZ_DATA.profiles)[QUIZ_DATA.profiles.indexOf(pr)];
 const c=contrib(user,pr.t,Zp).map((v,k)=>[v,k]).sort((a,b)=>b[0]-a[0]);
 const shared=c.slice(0,2).map(x=>TRAITS[x[1]].n.toLowerCase()),gap=TRAITS[c[7][1]].n.toLowerCase();
 d.appendChild(p(`Por que ${pr.name}? Suas respostas se alinham a este perfil sobretudo em ${list(shared)}. ${pr.description} Onde vocês mais se afastam é ${gap}, um território em que o seu olhar e o dessa área provavelmente se complementam.`));
 const ev=picks.filter(x=>x.a>0&&x.q.p&&x.q.p[pr.id]).sort((a,b)=>b.a*b.q.p[pr.id]-a.a*a.q.p[pr.id]).slice(0,3).map(x=>x.q);
 if(ev.length){const b=document.createElement("div");b.className="evidence";b.innerHTML='<span class="tag">AFIRMAÇÕES COM AS QUAIS VOCÊ CONCORDOU E QUE REMETEM A '+pr.name.split(" ")[0].toUpperCase()+'</span>';const ul=document.createElement("ul");ev.forEach(o=>{const li=document.createElement("li");li.textContent="“"+o.prompt+"”";ul.appendChild(li);});b.appendChild(ul);d.appendChild(b);}
 if(pr.note){const n=p("","note");n.innerHTML='<span class="tag">NA PESQUISA PÚBLICA</span>';n.appendChild(document.createTextNode(pr.note));d.appendChild(n);}
 d.appendChild(p(`Ponto cego a observar: ${TRAITS[kl].blind}`));
 d.appendChild(p(total<30?`Este resultado usa ${total} respostas (${L.prec}). Refaça no nível Profundo para um retrato mais fiel.`:`Resultado do nível Profundo, calculado com ${total} respostas.`,"note"));
 radar($("#radar"),user,pr);
 $("#podium").innerHTML="";
 ranked.slice(1,4).forEach((r,j)=>{const el=document.createElement("div");el.className="podium-item";el.appendChild(avatar(r.p,"sm"));const w=document.createElement("div");w.className="podium-txt";w.innerHTML='<div class="podium-name"></div><div class="podium-meta"></div>';w.querySelector(".podium-name").textContent=r.p.name;w.querySelector(".podium-meta").textContent=r.p.field;el.appendChild(w);const s=document.createElement("div");s.className="podium-score";s.textContent="#"+(j+2);el.appendChild(s);$("#podium").appendChild(el);});
 const ac=contrib(user,anti.p.t,Score.zProfiles(QUIZ_DATA.profiles)[QUIZ_DATA.profiles.indexOf(anti.p)]).map((v,k)=>[v,k]).sort((a,b)=>a[0]-b[0]).slice(0,2);
 const mu=mean(user);
 const lines=ac.map(([,k])=>user[k]>mu?`você valoriza ${TRAITS[k].n.toLowerCase()}, que pesa pouco nesse perfil`:`este perfil se apoia em ${TRAITS[k].n.toLowerCase()}, que pesa pouco no seu jeito de pensar`);
 $("#anta-avatar").innerHTML="";$("#anta-avatar").appendChild(avatar(anti.p,"md"));
 $("#anta-name").textContent=anti.p.name;$("#anta-field").textContent=anti.p.field;
 $("#anta-contrast").textContent=`CONTRASTE ${Math.min(L.cap,Math.max(50,Math.round(50-50*anti.r)))}%`;
 $("#anta-text").textContent=`É o perfil mais distante do seu no teste: ${lines.join("; e ")}. Não é rivalidade, é o contraponto ideal: uma conversa entre vocês cobriria exatamente o que cada um costuma deixar de lado.`;
 $("#result-date").textContent=new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"long",year:"numeric"}).format(new Date());
 show(2);
}
// letreiro com o corpo docente na abertura
(function(){const t=$("#ticker");if(!t)return;const names=QUIZ_DATA.profiles.map(x=>x.name);const row=names.map(n=>`<span>${n}</span>`).join("");t.innerHTML=`<div class="ticker-in">${row}${row}</div>`;})();
document.querySelectorAll(".level").forEach(b=>b.addEventListener("click",()=>start(+b.dataset.n)));
$("#quit").addEventListener("click",()=>show(0));
$("#back").addEventListener("click",undo);
$("#restart").addEventListener("click",()=>show(0));
$("#again").addEventListener("click",()=>start(total));
document.addEventListener("keydown",e=>{if(!screens[1].classList.contains("active"))return;const i=+e.key-1;if(i>=0&&i<5)choose(SCALE[i].a);else if(e.key==="Backspace")undo();});
$("#share").addEventListener("click",async()=>{
 const name=$("#winner").textContent,field=$("#field").textContent,anta=$("#anta-name").textContent;
 const text=`Minha maior afinidade intelectual na EMAp é com ${name}!\n${field}\nMeu antagonista: ${anta}\nFaça o teste: ${location.href}`;
 try{if(navigator.share)await navigator.share({title:"Qual mente da EMAp é a sua?",text});else{await navigator.clipboard.writeText(text);$("#share").textContent="Resultado copiado ✓";setTimeout(()=>$("#share").textContent="Compartilhar resultado ↗",2200);}}catch(e){}
});
