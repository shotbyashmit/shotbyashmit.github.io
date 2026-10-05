const $ = s => document.querySelector(s);
const GEN = {all:"Portfolio",wildlife:"Wildlife",cinematic:"Cinematic",street:"Street",night:"Night"};
const NOTE = {
  all:"Selected frames, newest first. Tap any image to view it full screen.",
  wildlife:"Animals on their own terms, mostly at first and last light.",
  cinematic:"Frames that feel lifted from a film.",
  street:"Everyday moments, caught as they happen.",
  night:"Long exposures, artificial light and dark skies."
};
const BLURB = {wildlife:"Patience and long glass",cinematic:"Colour as mood",street:"Strangers and timing",night:"After the sun goes down"};
const S = (typeof SITE!=="undefined"&&SITE)||{};
const okG = g => ["wildlife","cinematic","street","night"].includes(String(g).toLowerCase()) ? String(g).toLowerCase() : "cinematic";
const ytId = u => { if(!u) return ""; const m=String(u).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/); return m?m[1]:(/^[\w-]{11}$/.test(u)?u:""); };
let n=0;
const items = [
  ...((typeof PHOTOS!=="undefined"&&PHOTOS)||[]).filter(p=>p&&p.file).map(p=>({...p,id:"p"+(n++),kind:"image",genre:okG(p.genre),featured:!!p.cover,src:p.file})),
  ...((typeof FILMS!=="undefined"&&FILMS)||[]).filter(f=>f&&(f.file||f.youtube)).map(f=>({...f,id:"f"+(n++),kind:"video",genre:okG(f.genre),yt:ytId(f.youtube),src:f.file||""}))
];
let genre="all", lbList=[], lbI=0, heroI=0, heroT=null;
$("#yr").textContent = new Date().getFullYear();

(function(){ let seen=false; try{ seen=sessionStorage.getItem("introSeen"); sessionStorage.setItem("introSeen","1"); }catch(e){} if(seen) $("#intro").remove(); else setTimeout(()=>$("#intro")?.remove(),2400); })();
const nav=$("#nav"); const onScroll=()=>nav.classList.toggle("solid", scrollY>innerHeight*0.6); addEventListener("scroll",onScroll,{passive:true}); onScroll();
(function(){ let t=null; try{t=localStorage.getItem("theme")}catch(e){} if(t) document.documentElement.dataset.theme=t;
  $("#themeBtn").onclick=()=>{ const cur=document.documentElement.dataset.theme||(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"); const nx=cur==="light"?"dark":"light"; document.documentElement.dataset.theme=nx; try{localStorage.setItem("theme",nx)}catch(e){} };
})();

const photos=()=>items.filter(i=>i.kind==="image");
const films=()=>items.filter(i=>i.kind==="video");
const inGenre=l=>genre==="all"?l:l.filter(i=>i.genre===genre);
const metaOf=it=>[it.cam,it.settings,it.place].filter(Boolean).join("  ·  ");
document.addEventListener("contextmenu",e=>{ if(e.target.closest(".tile,.lb-stage,.gcard,.hero")) e.preventDefault(); });

document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>setGenre(b.dataset.g));
function setGenre(g,scroll){ genre=g; document.body.dataset.genre=g; document.querySelectorAll(".filter").forEach(b=>b.setAttribute("aria-pressed",b.dataset.g===g)); renderAll(); startHero(); if(scroll) $("#work").scrollIntoView(); }

function renderShow(){
  const box=$("#gshow"); box.innerHTML="";
  ["wildlife","cinematic","street","night"].forEach(g=>{
    const ph=photos().filter(i=>i.genre===g), cov=ph.find(i=>i.featured)||ph[0];
    const b=document.createElement("button"); b.className="gcard"; b.style.setProperty("--c",`var(--${g})`); b.setAttribute("aria-label",`Show ${GEN[g]} work`);
    if(cov){ const im=document.createElement("img"); im.className="cov"; im.src=cov.src; im.alt=""; im.loading="lazy"; b.append(im); } else { const f=document.createElement("div"); f.className="fb"; b.append(f); }
    const bar=document.createElement("span"); bar.className="bar-c";
    const l=document.createElement("span"); l.className="lbl"; const t=document.createElement("b"); t.textContent=GEN[g];
    const s=document.createElement("small"); s.textContent=ph.length?`${BLURB[g]}  ·  ${ph.length} frame${ph.length>1?"s":""}`:BLURB[g];
    l.append(t,s); b.append(bar,l); b.onclick=()=>setGenre(g,true); box.append(b);
  });
}
function renderGrid(){
  const list=inGenre(photos()), grid=$("#grid"); grid.innerHTML="";
  $("#galleryTitle").textContent=GEN[genre]; $("#galleryNote").textContent=NOTE[genre];
  $("#count").textContent=list.length?`${list.length} frame${list.length>1?"s":""}`:"";
  $("#empty").hidden=list.length>0;
  if(!list.length){ $("#emptyTitle").textContent=photos().length?`No ${GEN[genre].toLowerCase()} frames yet`:"New work coming soon"; $("#emptyText").textContent="Follow @"+ig()+" for the latest."; }
  list.forEach((it,i)=>{
    const f=document.createElement("figure"); f.className="tile"; f.tabIndex=0; f.style.setProperty("--c",`var(--${it.genre})`);
    const im=document.createElement("img"); im.src=it.src; im.loading="lazy"; im.alt=it.title||"Photograph"; im.draggable=false; im.onerror=()=>f.remove();
    const dot=document.createElement("span"); dot.className="dot";
    const cap=document.createElement("figcaption"); const st=document.createElement("strong"); st.textContent=it.title||"Untitled";
    const sp=document.createElement("span"); sp.textContent=[it.place,it.cam].filter(Boolean).join("  ·  "); cap.append(st,sp);
    f.append(im,dot,cap); f.onclick=()=>openLb(list,i); f.onkeydown=e=>{if(e.key==="Enter")openLb(list,i)}; grid.append(f);
  });
}
function renderFilms(){
  const list=inGenre(films()), all=films();
  $("#films").hidden=!all.length; $("#filmsLink").hidden=!all.length;
  $("#filmCount").textContent=list.length?`${list.length} film${list.length>1?"s":""}`:"";
  const reel=$("#reel"); reel.innerHTML="";
  (list.length?list:all).forEach((it,i,arr)=>{
    const b=document.createElement("button"); b.className="film"; b.setAttribute("aria-label",`Play ${it.title||"film"}`);
    if(it.yt){ const im=document.createElement("img"); im.className="yt"; im.src=`https://i.ytimg.com/vi/${it.yt}/hqdefault.jpg`; im.alt=""; im.loading="lazy"; b.append(im); }
    else { const v=document.createElement("video"); v.src=it.src+"#t=0.5"; v.muted=true; v.loop=true; v.playsInline=true; v.preload="metadata"; b.onmouseenter=()=>v.play().catch(()=>{}); b.onmouseleave=()=>v.pause(); b.append(v); }
    const p=document.createElement("span"); p.className="play"; p.innerHTML="<span>▶</span>";
    const c=document.createElement("span"); c.className="cap"; const t=document.createElement("b"); t.textContent=it.title||"Untitled";
    const s=document.createElement("small"); s.textContent=[GEN[it.genre],it.cam,it.place].filter(Boolean).join("  ·  "); c.append(t,s);
    b.append(p,c); b.onclick=()=>openLb(arr,i); reel.append(b);
  });
}
function heroPool(){ const p=inGenre(photos()); const f=p.filter(i=>i.featured); return f.length?f:p.slice(0,6); }
function startHero(){ clearInterval(heroT); heroI=0; const pool=heroPool(), dots=$("#heroDots"); dots.innerHTML="";
  if(pool.length>1) pool.forEach((_,i)=>{ const d=document.createElement("button"); d.setAttribute("aria-label",`Cover image ${i+1}`); d.onclick=()=>{heroI=i;showHero();startTimer()}; dots.append(d); });
  showHero(); startTimer(); }
function startTimer(){ clearInterval(heroT); if(heroPool().length>1&&!matchMedia("(prefers-reduced-motion: reduce)").matches) heroT=setInterval(()=>{heroI++;showHero()},7000); }
function showHero(){
  const pool=heroPool(), layer=$("#heroLayer");
  if(!pool.length){ layer.innerHTML=""; $("#hudR").textContent=""; $("#hudL").textContent="REC · "+(genre==="all"?"MOJO":GEN[genre]); return; }
  heroI=((heroI%pool.length)+pool.length)%pool.length; const it=pool[heroI];
  [...$("#heroDots").children].forEach((d,i)=>d.setAttribute("aria-current",i===heroI));
  const img=new Image(); img.className="hero-media"; img.alt=it.title||""; img.draggable=false;
  img.onload=()=>{ layer.append(img); requestAnimationFrame(()=>requestAnimationFrame(()=>img.classList.add("on"))); setTimeout(()=>{ while(layer.children.length>1) layer.firstChild.remove(); },1700); };
  img.src=it.src;
  $("#hudL").textContent="REC · "+[GEN[it.genre],it.cam].filter(Boolean).join(" · ");
  $("#hudR").textContent=[it.title,it.place,it.settings].filter(Boolean).join("\n");
}
function openLb(list,i){ lbList=list; lbI=i; $("#lb").hidden=false; document.body.style.overflow="hidden"; drawLb(); $("#lbClose").focus(); }
function closeLb(){ $("#lb").hidden=true; document.body.style.overflow=""; $("#lbStage .lbm")?.remove(); }
function drawLb(){
  lbI=(lbI+lbList.length)%lbList.length; const it=lbList[lbI], st=$("#lbStage"); st.querySelector(".lbm")?.remove();
  let m;
  if(it.kind==="video"&&it.yt){ m=document.createElement("iframe"); m.src=`https://www.youtube-nocookie.com/embed/${it.yt}?autoplay=1&rel=0`; m.allow="autoplay; encrypted-media; picture-in-picture; fullscreen"; m.allowFullscreen=true; m.title=it.title||"Film"; }
  else if(it.kind==="video"){ m=document.createElement("video"); m.controls=true; m.autoplay=true; m.playsInline=true; m.controlsList="nodownload"; m.src=it.src; }
  else { m=document.createElement("img"); m.alt=it.title||"Photograph"; m.draggable=false; m.src=it.src; }
  m.className="lbm"; st.prepend(m);
  $("#lbIdx").textContent=`${String(lbI+1).padStart(2,"0")} / ${String(lbList.length).padStart(2,"0")}`;
  $("#lbTitle").textContent=it.title||"Untitled";
  const meta=$("#lbMeta"); meta.innerHTML=""; const g=document.createElement("span"); g.className="g"; g.style.setProperty("--c",`var(--${it.genre})`); g.innerHTML="<i></i>"; g.append(GEN[it.genre]); meta.append(g);
  const rest=metaOf(it); if(rest) meta.append("  ·  "+rest);
  if(it.kind==="image"&&!it.settings&&!it._tried){ it._tried=true; readExif(it.src).then(ex=>{ if(ex&&ex.settings){ it.settings=ex.settings; if(!it.cam&&ex.cam) it.cam=ex.cam; if(lbList[lbI]===it&&!$("#lb").hidden) drawLb(); } }); }
}
$("#lbClose").onclick=closeLb; $("#lbPrev").onclick=()=>{lbI--;drawLb()}; $("#lbNext").onclick=()=>{lbI++;drawLb()};
document.addEventListener("keydown",e=>{ if($("#lb").hidden) return; if(e.key==="Escape")closeLb(); if(e.key==="ArrowLeft"){lbI--;drawLb()} if(e.key==="ArrowRight"){lbI++;drawLb()} });
let tx=0; $("#lbStage").addEventListener("touchstart",e=>tx=e.touches[0].clientX,{passive:true});
$("#lbStage").addEventListener("touchend",e=>{ const d=e.changedTouches[0].clientX-tx; if(Math.abs(d)>50){ lbI+=d<0?1:-1; drawLb(); } });

async function readExif(url){
  try{ if(!/\.jpe?g$/i.test(url)) return null; const buf=await (await fetch(url)).arrayBuffer(); const v=new DataView(buf); if(v.getUint16(0)!==0xFFD8) return null;
    let o=2; while(o<Math.min(v.byteLength,262144)-4){ const mk=v.getUint16(o), len=v.getUint16(o+2); if(mk===0xFFE1&&v.getUint32(o+4)===0x45786966) return parseTiff(v,o+10); o+=2+len; }
  }catch(e){} return null;
}
function parseTiff(v,t){
  const le=v.getUint16(t)===0x4949, u16=p=>v.getUint16(p,le), u32=p=>v.getUint32(p,le);
  const str=(p,c)=>{let s="";for(let i=0;i<c;i++){const ch=v.getUint8(p+i);if(!ch)break;s+=String.fromCharCode(ch)}return s.trim()};
  const read=ifd=>{ const out={}, c=u16(t+ifd); for(let i=0;i<c;i++){ const e=t+ifd+2+i*12, tag=u16(e), type=u16(e+2), cnt=u32(e+4), vo=e+8, ptr=(type===2&&cnt>4)||type===5?t+u32(vo):vo;
    if(type===2) out[tag]=str(ptr,cnt); else if(type===3) out[tag]=u16(vo); else if(type===4) out[tag]=u32(vo); else if(type===5) out[tag]=[u32(ptr),u32(ptr+4)]; } return out; };
  const i0=read(u32(t+4)), ex=i0[0x8769]?read(i0[0x8769]):{}, r=a=>a&&a[1]?a[0]/a[1]:0, parts=[];
  const fl=r(ex[0x920A]); if(fl) parts.push(Math.round(fl)+"mm");
  const fn=r(ex[0x829D]); if(fn) parts.push("f/"+(Math.round(fn*10)/10));
  const et=ex[0x829A]; if(et&&et[1]){ const s=et[0]/et[1]; parts.push(s>=1?(Math.round(s*10)/10)+"s":"1/"+Math.round(et[1]/et[0])+"s"); }
  if(ex[0x8827]) parts.push("ISO "+ex[0x8827]);
  const mk=(i0[0x010F]||"").toLowerCase(), md=(i0[0x0110]||"").toLowerCase();
  return {settings:parts.join(" · "), cam:mk.includes("canon")?"Canon":(mk.includes("dji")||md.includes("dji"))?"DJI":(mk.includes("gopro")||md.includes("hero"))?"GoPro":""};
}

const ig=()=>String(S.instagram||"shot_by_ashmit").replace(/^@/,"").trim();
function renderAbout(){
  const url="https://instagram.com/"+encodeURIComponent(ig());
  ["#igBig","#igBtn","#heroIg"].forEach(s=>$(s).href=url); $("#igBig").textContent="@"+ig(); $("#heroIg").textContent="@"+ig();
  if(S.tagline) $("#tagline").textContent=S.tagline;
  if(Array.isArray(S.bio)&&S.bio.length){ const b=$("#bio"); b.innerHTML=""; S.bio.forEach(t=>{ const p=document.createElement("p"); p.textContent=t; b.append(p); }); }
  const m=$("#mailBtn"); if(S.email){ m.hidden=false; m.href="mailto:"+S.email; m.textContent="Email "+S.email; }
  if(S.portrait){ const im=document.createElement("img"); im.src=S.portrait; im.alt="Ashmit Singh"; im.onerror=()=>{im.remove();$("#portraitPh").hidden=false}; $("#portrait").prepend(im); $("#portraitPh").hidden=true; }
  $("#fFrames").textContent=photos().length; $("#fFilms").textContent=films().length;
}
function renderAll(){ renderShow(); renderGrid(); renderFilms(); }
renderAll(); renderAbout(); startHero();
