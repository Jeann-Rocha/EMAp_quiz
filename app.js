const $=s=>document.querySelector(s);
const screens=["intro","quiz","result"].map(x=>$("#"+x));
// Traços: T A D I M C O V (mesma ordem dos vetores dos professores)
const TRAITS=[
 {n:"Abstração e rigor",low:"rigor formal",style:"Você quer entender por que algo é verdade: procura definições limpas, hipóteses explícitas e argumentos que não deixem brechas.",blind:"Vale lembrar que nem todo problema espera por uma formulação perfeita; às vezes é preciso agir com o que já se tem."},
 {n:"Impacto aplicado",low:"foco em aplicações",style:"Uma ideia só está completa, para você, quando ajuda alguém em um problema real; o contexto importa tanto quanto a técnica.",blind:"Dar espaço a perguntas sem utilidade imediata costuma render as melhores ideias aplicadas de amanhã."},
 {n:"Dados e padrões",low:"análise de dados",style:"Você confia no que os dados mostram e tem faro para regularidades escondidas em grandes volumes de informação.",blind:"Cuidado com padrões sem explicação: um mecanismo ou uma teoria ajudam a separar achado de coincidência."},
 {n:"Incerteza",low:"pensamento probabilístico",style:"Você pensa em termos de probabilidade e confiança: pergunta o quanto pode estar errado antes de afirmar algo.",blind:"Nem tudo precisa virar probabilidade; algumas estruturas são exatas e merecem ser tratadas como tais."},
 {n:"Dinâmica e mecanismos",low:"modelagem de mecanismos",style:"Você enxerga o mundo como sistemas que evoluem: quer saber quais engrenagens produzem o comportamento observado.",blind:"Modelos mecanicistas só valem se confrontados com dados; evite se apaixonar pela própria engrenagem."},
 {n:"Construção e computação",low:"computação",style:"Você pensa construindo: prototipa, programa, testa e aprende com o que roda. Um algoritmo é, para você, uma forma de compreender.",blind:"Antes de implementar, vale parar e perguntar se o problema está bem formulado."},
 {n:"Decisão e otimização",low:"otimização",style:"Você enxerga escolhas, custos e compromissos: quer saber qual é a melhor decisão possível e quais garantias existem.",blind:"Nem toda boa pergunta é uma decisão; explorar sem a pressão de escolher também tem valor."},
 {n:"Comunicação e visualização",low:"comunicação visual",style:"Você acredita que entender é conseguir mostrar: busca a representação, a imagem ou a explicação que torna o difícil legível.",blind:"Uma boa imagem pode esconder hipóteses frágeis; vale checar o que está por baixo do gráfico."}
];
const LEVELS={10:{name:"Rápido",cap:88,prec:"visão geral"},20:{name:"Equilibrado",cap:93,prec:"boa precisão"},30:{name:"Profundo",cap:97,prec:"alta precisão"}};
let current=0,total=10,order=[],user=[],answered=0;
function show(n){screens.forEach((s,i)=>s.classList.toggle("active",i===n));window.scrollTo({top:0,behavior:"smooth"});}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function parse(w){const v=Array(8).fill(0);for(const m of w.matchAll(/([TADIMCOV])(\d)/g))v["TADIMCOV".indexOf(m[1])]+=+m[2];return v;}
// As perguntas foram escritas em blocos de 10 equilibrados entre os traços; cada nível usa o início do banco.
function start(n){total=n;current=0;answered=0;user=Array(8).fill(0);order=QUIZ_DATA.questions.slice(0,n);show(1);renderQuestion();}
function renderQuestion(){
 const q=order[current];
 $("#count").innerHTML=`QUESTÃO ${String(current+1).padStart(2,"0")} <span>/ ${total}</span>`;
 $("#q-index").textContent=String(current+1).padStart(2,"0");
 $("#progress-fill").style.width=`${current/total*100}%`;
 $("#prompt").textContent=q.prompt;$("#answers").innerHTML="";
 shuffle(q.options).forEach((o,i)=>{const b=document.createElement("button");b.className="answer";b.innerHTML=`<span class="letter">${String.fromCharCode(65+i)}</span><span></span>`;b.querySelector("span:last-child").textContent=o.label;b.addEventListener("click",()=>choose(o));$("#answers").appendChild(b);});
}
function choose(o){parse(o.w).forEach((x,k)=>user[k]+=x);answered++;current++;current<total?renderQuestion():finish();}
const mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
function corr(a,b){const ma=mean(a),mb=mean(b);let n=0,da=0,db=0;a.forEach((x,i)=>{n+=(x-ma)*(b[i]-mb);da+=(x-ma)**2;db+=(b[i]-mb)**2;});return da&&db?n/Math.sqrt(da*db):0;}
function contrib(u,p){const mu=mean(u),mp=mean(p);return u.map((x,k)=>(x-mu)*(p[k]-mp));}
function p(text,cls){const e=document.createElement("p");if(cls)e.className=cls;e.textContent=text;return e;}
function list(a){return a.length>1?a.slice(0,-1).join(", ")+" e "+a[a.length-1]:a[0]||"";}
function finish(){
 const ranked=QUIZ_DATA.profiles.map(pr=>({p:pr,r:corr(user,pr.t)})).sort((a,b)=>b.r-a.r);
 const top=ranked[0],anti=ranked[ranked.length-1],L=LEVELS[total];
 const sorted=user.map((v,k)=>[v,k]).sort((a,b)=>b[0]-a[0]),k1=sorted[0][1],k2=sorted[1][1],kl=sorted[7][1];
 const pct=Math.min(L.cap,Math.max(60,Math.round(50+50*top.r)));
 $("#winner").textContent=top.p.name;
 $("#field").textContent=top.p.role.toUpperCase()+"  ·  "+top.p.field.toUpperCase();
 $("#match-value").textContent=pct+"%";$("#match-fill").style.width=pct+"%";
 $("#level-tag").textContent=`· NÍVEL ${L.name.toUpperCase()} (${total})`;
 // descrição detalhada
 const d=$("#description");d.innerHTML="";
 d.appendChild(p(`O seu jeito de pensar: ${TRAITS[k1].style} Logo em seguida vem ${TRAITS[k2].n.toLowerCase()}: ${TRAITS[k2].style.charAt(0).toLowerCase()+TRAITS[k2].style.slice(1)}`));
 const c=contrib(user,top.p.t).map((v,k)=>[v,k]).sort((a,b)=>b[0]-a[0]);
 const shared=c.slice(0,2).map(x=>TRAITS[x[1]].n.toLowerCase()),gap=TRAITS[c[7][1]].n.toLowerCase();
 d.appendChild(p(`Por que ${top.p.name}? Suas respostas se alinham a este perfil sobretudo em ${list(shared)}. ${top.p.description} Onde vocês mais se afastam é ${gap}, um território em que o seu olhar e o dessa área provavelmente se complementam.`));
 if(top.p.note){const n=p("","note");n.innerHTML='<span class="tag">NA PESQUISA PÚBLICA</span>';n.appendChild(document.createTextNode(top.p.note));d.appendChild(n);}
 d.appendChild(p(`Ponto cego a observar: ${TRAITS[kl].blind}`));
 d.appendChild(p(total<30?`Este resultado usa ${total} respostas (${L.prec}). Refaça no nível Profundo para um retrato mais fiel.`:`Resultado do nível Profundo, calculado com ${total} respostas.`,"note"));
 // barras de traços
 const max=Math.max(...user,1);$("#traits").innerHTML="";
 user.forEach((v,k)=>{const r=document.createElement("div");r.className="trait-row";r.innerHTML='<span></span><div class="trait-track"><i></i></div>';r.firstChild.textContent=TRAITS[k].n.toUpperCase();r.querySelector("i").style.width=Math.round(v/max*100)+"%";$("#traits").appendChild(r);});
 // pódio
 $("#podium").innerHTML="";
 ranked.slice(1,4).forEach((x,j)=>{const el=document.createElement("div");el.className="podium-item";el.innerHTML=`<div><div class="podium-name"></div><div class="podium-meta"></div></div><div class="podium-score"></div>`;el.querySelector(".podium-name").textContent=x.p.name;el.querySelector(".podium-meta").textContent=x.p.field;el.querySelector(".podium-score").textContent=`#${j+2}`;$("#podium").appendChild(el);});
 // antagonista
 const ac=contrib(user,anti.p.t).map((v,k)=>[v,k]).sort((a,b)=>a[0]-b[0]).slice(0,2);
 const mu=mean(user),mp=mean(anti.p.t);
 const lines=ac.map(([,k])=>user[k]>mu?`você valoriza ${TRAITS[k].n.toLowerCase()}, que pesa pouco nesse perfil`:`este perfil se apoia em ${TRAITS[k].n.toLowerCase()}, que pesa pouco no seu jeito de pensar`);
 $("#anta-name").textContent=anti.p.name;$("#anta-field").textContent=anti.p.field;
 $("#anta-contrast").textContent=`CONTRASTE ${Math.min(L.cap,Math.round(50-50*anti.r))}%`;
 $("#anta-text").textContent=`É o perfil mais distante do seu no teste: ${lines.join("; e ")}. Não é rivalidade, é o contraponto ideal: uma conversa entre vocês cobriria exatamente o que cada um costuma deixar de lado.`;
 $("#result-date").textContent=new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"long",year:"numeric"}).format(new Date());
 show(2);
}
document.querySelectorAll(".level").forEach(b=>b.addEventListener("click",()=>start(+b.dataset.n)));
$("#quit").addEventListener("click",()=>show(0));
$("#restart").addEventListener("click",()=>show(0));
$("#again").addEventListener("click",()=>start(total));
$("#share").addEventListener("click",async()=>{
 const name=$("#winner").textContent,field=$("#field").textContent,anta=$("#anta-name").textContent;
 const text=`Minha maior afinidade intelectual na EMAp é com ${name}!\n${field}\nMeu antagonista: ${anta}\nFaça o teste: ${location.href}`;
 try{if(navigator.share)await navigator.share({title:"Qual mente da EMAp é a sua?",text});else{await navigator.clipboard.writeText(text);$("#share").textContent="Resultado copiado ✓";setTimeout(()=>$("#share").textContent="Compartilhar resultado ↗",2200);}}catch(e){}
});
