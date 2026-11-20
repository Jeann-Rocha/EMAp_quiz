// Uso (na sua máquina, com internet, Node 18+):  node baixar-fotos.js
// Baixa as fotos de https://emap.fgv.br/pessoas para ./fotos/<id>.jpg
// ATENÇÃO: escrito sem acesso ao site; a heurística pode errar. Confira a lista impressa no final
// e corrija na mão (basta salvar a foto como fotos/<id>.jpg) o que ficar de fora.
const fs=require("fs"),path=require("path");
global.window={};require("./data.js");
const profiles=window.QUIZ_DATA.profiles;
const base="https://emap.fgv.br";
const norm=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
(async()=>{
 fs.mkdirSync("fotos",{recursive:true});
 let html="";
 for(const u of [base+"/pessoas",base+"/pessoas?page=1",base+"/pessoas?page=2"]){try{const r=await fetch(u);if(r.ok)html+=await r.text();}catch(e){}}
 if(!html){console.log("Não consegui abrir o site.");return;}
 const H=norm(html);
 const imgs=[...html.matchAll(/<img[^>]+(?:data-src|src)=["']([^"']+)["'][^>]*>/gi)].map(m=>({i:m.index,src:m[1]}));
 const miss=[];
 for(const p of profiles){
  const parts=norm(p.name).split(" ").filter(w=>w.length>2);
  const key=parts[0]+" "+parts[parts.length-1];
  let pos=H.indexOf(norm(p.name));if(pos<0)pos=H.indexOf(key);
  if(pos<0){miss.push(p.id);continue;}
  const cand=imgs.filter(x=>!/logo|icon|sprite|\.svg/i.test(x.src)).sort((a,b)=>Math.abs(a.i-pos)-Math.abs(b.i-pos))[0];
  if(!cand){miss.push(p.id);continue;}
  try{const url=new URL(cand.src,base).href;const r=await fetch(url);if(!r.ok)throw 0;fs.writeFileSync(path.join("fotos",p.id+".jpg"),Buffer.from(await r.arrayBuffer()));console.log("ok  ",p.id,"<-",url);}
  catch(e){miss.push(p.id);}
 }
 console.log("\nSem foto (salve manualmente em fotos/<id>.jpg):",miss.join(", ")||"nenhum");
})();
