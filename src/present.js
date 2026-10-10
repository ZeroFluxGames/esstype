/* ============ PRESENTATION ============ */
const DECKS={
 minimal:{n:'Minimal',bg:'#ffffff',fg:'#1d1d1f',ac:'#2f6fed',hf:'Inter',bf:'Inter',ppt:{bg:'FFFFFF',fg:'1D1D1F',ac:'2F6FED',hf:'Segoe UI Semibold',bf:'Segoe UI'},
   deco:k=>`<div class="deco" style="left:140px;top:${k==='title'?'300':'84'}px;width:90px;height:8px;border-radius:4px;background:var(--sa)"></div>`},
 gece:{n:'Gece yarısı',bg:'radial-gradient(1200px 700px at 80% 0%,#2a3566 0%,#141a33 45%,#0a0d1a 100%)',fg:'#eef2ff',ac:'#8fb0ff',hf:'Space Grotesk',bf:'Inter',ppt:{bg:'111629',fg:'EEF2FF',ac:'8FB0FF',hf:'Bahnschrift',bf:'Segoe UI'},
   deco:()=>`<div class="deco" style="right:-200px;top:-200px;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,#6c8cff55,transparent 65%)"></div><div class="deco" style="left:-150px;bottom:-250px;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,#b46cff33,transparent 65%)"></div>`},
 defter:{n:'Defter',bg:'#fbf8f1 linear-gradient(to bottom,transparent 63px,#dfe6ee 63px) 0 0/100% 64px',fg:'#24303f',ac:'#b0413e',hf:'Playfair Display',bf:'Lora',ppt:{bg:'FBF8F1',fg:'24303F',ac:'B0413E',hf:'Georgia',bf:'Georgia'},
   deco:()=>`<div class="deco" style="left:96px;top:0;bottom:0;width:3px;background:#e9a3a0"></div>`},
 gunbatimi:{n:'Gün batımı',bg:'linear-gradient(135deg,#ff5f6d 0%,#ff9966 50%,#ffc371 100%)',fg:'#ffffff',ac:'#fff3d6',hf:'Poppins',bf:'Poppins',ppt:{bg:'FF7B68',fg:'FFFFFF',ac:'FFF3D6',hf:'Segoe UI Black',bf:'Segoe UI'},
   deco:()=>`<div class="deco" style="right:120px;bottom:-260px;width:620px;height:620px;border-radius:50%;background:rgba(255,255,255,.16)"></div><div class="deco" style="right:300px;top:90px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.18)"></div>`},
 okyanus:{n:'Okyanus',bg:'linear-gradient(160deg,#0f2027 0%,#203a43 50%,#2c5364 100%)',fg:'#e6fbff',ac:'#4dd0e1',hf:'Montserrat',bf:'Nunito',ppt:{bg:'1B3540',fg:'E6FBFF',ac:'4DD0E1',hf:'Segoe UI Semibold',bf:'Segoe UI'},
   deco:()=>`<svg class="deco" style="left:0;bottom:0;width:1600px;height:220px" viewBox="0 0 1600 220" preserveAspectRatio="none"><path d="M0 120C200 60 400 180 800 110S1400 60 1600 120V220H0z" fill="#4dd0e122"/><path d="M0 160C300 110 500 210 900 150S1400 120 1600 160V220H0z" fill="#4dd0e133"/></svg>`},
 neon:{n:'Neon',bg:'linear-gradient(180deg,#12002b 0%,#2a0845 55%,#3d0a5c 100%)',fg:'#ffffff',ac:'#ff4fd8',hf:'Righteous',bf:'Space Grotesk',glow:1,ppt:{bg:'1E0438',fg:'FFFFFF',ac:'FF4FD8',hf:'Bahnschrift',bf:'Segoe UI'},
   deco:()=>`<div class="deco" style="left:0;right:0;bottom:0;height:330px;background:linear-gradient(transparent,#ff4fd822),repeating-linear-gradient(90deg,#ff4fd855 0 2px,transparent 2px 100px),repeating-linear-gradient(0deg,#ff4fd855 0 2px,transparent 2px 46px);transform:perspective(500px) rotateX(60deg);transform-origin:bottom;opacity:.7"></div><div class="deco" style="right:180px;top:110px;width:260px;height:260px;border-radius:50%;background:linear-gradient(#ffd36e,#ff4fd8);opacity:.85;mask:repeating-linear-gradient(transparent 0 150px,#000 150px 162px,transparent 162px 170px),linear-gradient(#000 0 55%,transparent 55%);-webkit-mask:linear-gradient(#000 0 58%,transparent 58% 62%,#000 62% 70%,transparent 70% 74%,#000 74% 80%,transparent 80%)"></div>`},
 retro:{n:'Retro piksel',bg:'#0d0f0b repeating-linear-gradient(0deg,rgba(124,255,79,.05) 0 2px,transparent 2px 4px)',fg:'#d8f5c4',ac:'#7cff4f',hf:'Press Start 2P',bf:'VT323',hs:.62,bs:1.35,ppt:{bg:'0D0F0B',fg:'D8F5C4',ac:'7CFF4F',hf:'Consolas',bf:'Consolas'},
   deco:()=>`<div class="deco" style="inset:40px;border:6px solid #7cff4f;box-shadow:0 0 0 6px #0d0f0b,0 0 0 12px #7cff4f55"></div>`},
 kurumsal:{n:'Kurumsal',bg:'linear-gradient(90deg,#1b2a4a 0 26px,#ffffff 26px)',fg:'#1b2a4a',ac:'#e8a33d',hf:'Montserrat',bf:'Inter',ppt:{bg:'FFFFFF',fg:'1B2A4A',ac:'E8A33D',hf:'Segoe UI Semibold',bf:'Segoe UI'},
   deco:k=>k==='title'||k==='section'?`<div class="deco" style="inset:0;background:#1b2a4a"></div><div class="deco" style="left:140px;bottom:120px;width:160px;height:10px;background:#e8a33d"></div>`:`<div class="deco" style="right:60px;top:60px;width:60px;height:60px;border:8px solid #e8a33d;border-radius:50%"></div>`,
   dark:k=>k==='title'||k==='section'},
 orman:{n:'Orman',bg:'#f1f5ec',fg:'#1f3a2b',ac:'#4f8a5b',hf:'DM Serif Display',bf:'Nunito',ppt:{bg:'F1F5EC',fg:'1F3A2B',ac:'4F8A5B',hf:'Georgia',bf:'Segoe UI'},
   deco:()=>`<svg class="deco" style="right:-60px;top:-40px;width:520px;height:520px" viewBox="0 0 200 200"><path d="M100 10C150 10 190 50 190 100c0 40-30 80-90 90C40 180 10 140 10 100 10 50 50 10 100 10z" fill="#4f8a5b18"/><path d="M60 150C80 90 120 60 170 40" stroke="#4f8a5b55" stroke-width="3" fill="none"/></svg>`},
 brutal:{n:'Brütal',bg:'#f4f1ea',fg:'#0a0a0a',ac:'#ff3b30',hf:'Bebas Neue',bf:'Space Grotesk',hs:1.35,up:1,ppt:{bg:'F4F1EA',fg:'0A0A0A',ac:'FF3B30',hf:'Bahnschrift SemiBold Condensed',bf:'Segoe UI'},
   deco:()=>`<div class="deco" style="inset:36px;border:6px solid #0a0a0a"></div><div class="deco" style="right:36px;top:36px;width:200px;height:60px;background:#ff3b30"></div>`},
 pastel:{n:'Pastel',bg:'linear-gradient(135deg,#fdf2f8 0%,#eef2ff 50%,#e0f2fe 100%)',fg:'#3b3355',ac:'#a78bfa',hf:'Quicksand',bf:'Nunito',ppt:{bg:'F3F0FD',fg:'3B3355',ac:'A78BFA',hf:'Segoe UI Semibold',bf:'Segoe UI'},
   deco:()=>`<div class="deco" style="right:-120px;top:-120px;width:520px;height:520px;border-radius:42% 58% 63% 37%/42% 45% 55% 58%;background:#f9a8d455"></div><div class="deco" style="left:-100px;bottom:-160px;width:460px;height:460px;border-radius:58% 42% 37% 63%/45% 55% 45% 55%;background:#93c5fd55"></div>`},
 tahta:{n:'Kara tahta',bg:'radial-gradient(ellipse at 50% 40%,#2e3f35,#1d2822)',fg:'#f1f3ea',ac:'#ffd166',hf:'Caveat',bf:'Patrick Hand',hs:1.3,bs:1.05,ppt:{bg:'25332B',fg:'F1F3EA',ac:'FFD166',hf:'Segoe Print',bf:'Segoe Print'},
   deco:()=>`<div class="deco" style="inset:0;box-shadow:inset 0 0 0 28px #6b4a2f,inset 0 0 0 34px #4e341f,inset 0 0 120px rgba(0,0,0,.5)"></div><div class="deco" style="right:260px;bottom:34px;width:120px;height:14px;border-radius:4px;background:#f1f3ea;opacity:.85"></div>`},
 altin:{n:'Altın',bg:'radial-gradient(ellipse at 50% 0%,#1d1a14,#0b0a08)',fg:'#f3efe6',ac:'#d4af37',hf:'Cinzel',bf:'Lora',ppt:{bg:'0F0E0B',fg:'F3EFE6',ac:'D4AF37',hf:'Georgia',bf:'Georgia'},
   deco:()=>`<div class="deco" style="inset:44px;border:1.5px solid #d4af3799"></div><div class="deco" style="inset:54px;border:1px solid #d4af3744"></div>`},
};
const TRANS=[['none','Yok'],['fade','Solma'],['slide','Kaydır'],['up','Yukarı'],['zoom','Yakınlaş'],['zoomout','Uzaklaş'],['flip','Çevir'],['cube','Küp'],['rotate','Döndür'],['blur','Bulanık'],['wipe','Silme'],['circle','Daire'],['cards','Kart'],['random','Rastgele']];
const ANIMS=[['none','Yok'],['up','Yukarı süzül'],['fade','Belir'],['left','Soldan gel'],['zoom','Büyüyerek'],['blur','Bulanıktan net'],['bounce','Zıpla'],['type','Daktilo başlık']];
const deckOf=n=>Object.assign({},S.set.deck,n?.deck||{});

function buildSlides(n){
  const E=ED(),P=$('paper').getBoundingClientRect(),z=Z();const kids=[...E.children];
  const hasBreak=kids.some(k=>k.classList.contains('slide-break'));
  const secs=[];let curS=null;
  const start=(h,y)=>{curS={h:h?h.innerHTML:'',lvl:h?+h.tagName[1]:0,items:[],y};secs.push(curS)};
  for(const k of kids){const y=(k.getBoundingClientRect().top-P.top)/z;
    if(k.classList.contains('slide-break')){start(null,y);continue}
    if(!hasBreak&&/^H[12]$/.test(k.tagName)){start(k,y);continue}
    if(hasBreak&&/^H[12]$/.test(k.tagName)&&curS&&!curS.h&&!curS.items.some(i=>i.textContent.trim()||i.querySelector('img'))){curS.h=k.innerHTML;curS.lvl=+k.tagName[1];continue}
    if(!curS)start(null,y);
    if(!k.textContent.trim()&&!k.querySelector('img,table,hr')&&k.tagName!=='IMG')continue;
    curS.items.push(k)}
  // floating objects
  const objs=[...n.objects].sort((a,b)=>a.y-b.y);
  for(const o of objs){const cy=o.y+o.h/2;let s=null;for(const x of secs)if(x.y<=cy)s=x;if(!s)s=secs[0];if(!s){start(null,0);s=secs[0]}(s.obj=s.obj||[]).push(o)}
  const slides=[{kind:'title',title:n.title||'Başlıksız',sub:bookOf(n)?.name||'',date:new Date().toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})}];
  for(const s of secs){const box=document.createElement('div');s.items.forEach(i=>box.appendChild(i.cloneNode(true)));
    qsa('.isel,.curblk',box).forEach(x=>x.classList.remove('isel','curblk'));
    qsa('[data-pg]',box).forEach(x=>{x.removeAttribute('data-pg');x.style.marginTop=''});
    const notes=qsa('.callout.notes',box).map(x=>{const h=x.innerHTML;x.remove();return h}).join('<br>');
    qsa('[style*="font-size"]',box).forEach(x=>{const v=parseFloat(x.style.fontSize);if(/px/.test(x.style.fontSize)&&v)x.style.fontSize=(v/(n.paper.fsize||18)).toFixed(2)+'em'});
    const imgs=qsa('img',box).map(i=>{const src=i.src;const p=i.parentElement;i.remove();if(p&&p!==box&&!p.textContent.trim()&&!p.querySelector('img'))p.remove();return src});
    (s.obj||[]).forEach(o=>{if(o.type==='img')imgs.push(o.src);else if(o.type==='sticky'||o.type==='text'){const d=document.createElement('div');d.className='callout idea';d.innerHTML=o.html||'';if(d.textContent.trim())box.appendChild(d)}});
    qsa('.slide-break,.pagebreak',box).forEach(x=>x.remove());
    const hasText=!!box.textContent.trim()||!!box.querySelector('table,hr');
    let kind='content';if(!hasText&&!imgs.length&&s.h)kind='section';if(!hasText&&!imgs.length&&!s.h&&notes&&slides.length){slides[slides.length-1].notes=(slides[slides.length-1].notes?slides[slides.length-1].notes+'<br>':'')+notes;continue}else if(!hasText&&imgs.length)kind='image';else if(!hasText&&!imgs.length&&!s.h)continue;
    slides.push({kind,h:s.h,lvl:s.lvl,body:box.innerHTML,imgs,y:s.y,notes})}
  return slides}
function slideHTML(sl,th,idx,total,deck,thumb){
  const T=DECKS[th]||DECKS.minimal;const dark=T.dark&&T.dark(sl.kind);
  const bg=dark?'#1b2a4a':T.bg,fg=dark?'#ffffff':T.fg;const hs=T.hs||1,bs=T.bs||1;
  const H=(t,cls,size)=>`<div class="${cls} bi" style="--d:0;font-family:'${T.hf}';font-size:${size*hs}px;${T.up?'text-transform:uppercase;letter-spacing:1px;':''}${T.glow?'text-shadow:0 0 18px var(--sa),0 0 40px var(--sa);':''}">${t}</div>`;
  let inner='';
  if(sl.kind==='title')inner=`${sl.sub?`<div class="kicker bi" style="--d:0;color:var(--sa)">${esc(sl.sub)}</div>`:''}${H(esc(sl.title),'sh1',104)}<div class="bi" style="--d:2;font-size:${30*bs}px;opacity:.7;margin-top:10px">${esc(sl.date)}</div>`;
  else if(sl.kind==='section')inner=`<div class="kicker bi" style="--d:0;color:var(--sa)">Bölüm ${idx}</div>${H(sl.h,'sh1',110)}`;
  else if(sl.kind==='image')inner=`${sl.h?H(sl.h,'sh2',60):''}<div class="full bi" style="--d:1">${sl.imgs.length>1?`<div style="display:grid;grid-template-columns:repeat(${Math.min(3,sl.imgs.length)},1fr);gap:24px;height:100%;width:100%">${sl.imgs.map(s=>`<img src="${s}" style="width:100%;height:100%;object-fit:cover">`).join('')}</div>`:`<img src="${sl.imgs[0]}">`}</div>`;
  else{const body=`<div class="body" style="font-size:${40*bs}px">${sl.body}</div>`;
    inner=(sl.h?H(sl.h,'sh2',72):'')+(sl.imgs.length?`<div class="cols">${body}<div class="media bi" style="--d:3">${sl.imgs.slice(0,2).map(s=>`<img src="${s}">`).join('')}</div></div>`:body)}
  const foot=thumb||sl.kind==='title'?'':`<div class="foot"><span>${esc(cur()?.title||'')}</span><span>${idx+1} / ${total}</span></div>`;
  return `<div class="slide l-${sl.kind}" style="background:${bg};color:${fg};--sa:${dark?T.ac:T.ac};font-family:'${T.bf}'">${T.deco?T.deco(sl.kind):''}<div class="sw" style="position:relative;display:flex;flex-direction:column;justify-content:center;flex:1;min-height:0">${inner}</div>${foot}</div>`}
function fitSlide(el){const w=qs('.sw',el);if(!w||!w.clientHeight)return;const b=qs('.body',el);let guard=0;
  while(w.scrollHeight>w.clientHeight+4&&guard++<14){if(b){const f=parseFloat(b.style.fontSize)||40;if(f>18){b.style.fontSize=(f*.9)+'px';continue}}
    const h=qs('.sh1,.sh2',el);if(h){h.style.fontSize=(parseFloat(h.style.fontSize)*.88)+'px'}else break}}
function prepBuild(el){let d=1;qsa('.body > *',el).forEach(c=>{if(/^(UL|OL)$/.test(c.tagName)){qsa(':scope > li',c).forEach(li=>{li.classList.add('bi');li.style.setProperty('--d',d++)})}else{c.classList.add('bi');c.style.setProperty('--d',d++)}})}
const PRESCSS=`
.slide .bi{opacity:0}
.slide.play .bi{animation:var(--an,an-up) .75s cubic-bezier(.2,.75,.2,1) both;animation-delay:calc(var(--d,0)*130ms + 200ms)}
.slide.play.clickb .bi:not(.shown){animation:none;opacity:0}
.slide.play.clickb .bi.shown{animation-delay:0ms}
.slide.noanim .bi{opacity:1;animation:none!important}
@keyframes an-up{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:none}}
@keyframes an-fade{from{opacity:0}to{opacity:1}}
@keyframes an-left{from{opacity:0;transform:translateX(-80px)}to{opacity:1;transform:none}}
@keyframes an-zoom{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}
@keyframes an-blur{from{opacity:0;filter:blur(18px);transform:scale(1.06)}to{opacity:1;filter:none;transform:none}}
@keyframes an-bounce{0%{opacity:0;transform:translateY(-60px)}55%{opacity:1;transform:translateY(12px)}75%{transform:translateY(-5px)}100%{opacity:1;transform:none}}
@keyframes an-type{from{opacity:1;clip-path:inset(0 100% 0 0)}to{opacity:1;clip-path:inset(0 0 0 0)}}
`;
function animDefs(trans,dir){const D=dir||1;const T={
  fade:[[{opacity:0},{opacity:1}],[{opacity:1},{opacity:0}]],
  slide:[[{transform:`translateX(${100*D}%)`},{transform:'none'}],[{transform:'none'},{transform:`translateX(${-100*D}%)`}]],
  up:[[{transform:`translateY(${100*D}%)`},{transform:'none'}],[{transform:'none'},{transform:`translateY(${-100*D}%)`}]],
  zoom:[[{opacity:0,transform:'scale(.75)'},{opacity:1,transform:'none'}],[{opacity:1,transform:'none'},{opacity:0,transform:'scale(1.25)'}]],
  zoomout:[[{opacity:0,transform:'scale(1.3)'},{opacity:1,transform:'none'}],[{opacity:1,transform:'none'},{opacity:0,transform:'scale(.8)'}]],
  flip:[[{transform:`rotateY(${-180*D}deg)`,offset:0},{transform:`rotateY(${-90*D}deg)`,offset:.5},{transform:'none'}],[{transform:'none'},{transform:`rotateY(${90*D}deg)`,offset:.5},{transform:`rotateY(${90*D}deg)`}]],
  cube:[[{transform:`translateZ(-800px) rotateY(${90*D}deg) translateZ(800px)`},{transform:'translateZ(-800px) rotateY(0) translateZ(800px)'}],[{transform:'translateZ(-800px) rotateY(0) translateZ(800px)'},{transform:`translateZ(-800px) rotateY(${-90*D}deg) translateZ(800px)`}]],
  rotate:[[{opacity:0,transform:`rotate(${-10*D}deg) scale(.6)`},{opacity:1,transform:'none'}],[{opacity:1,transform:'none'},{opacity:0,transform:`rotate(${10*D}deg) scale(.6)`}]],
  blur:[[{opacity:0,filter:'blur(30px)'},{opacity:1,filter:'blur(0)'}],[{opacity:1,filter:'blur(0)'},{opacity:0,filter:'blur(30px)'}]],
  wipe:[[{clipPath:D>0?'inset(0 0 0 100%)':'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}],[{opacity:1},{opacity:1}]],
  circle:[[{clipPath:'circle(0% at 50% 50%)'},{clipPath:'circle(75% at 50% 50%)'}],[{opacity:1},{opacity:1}]],
  cards:[[{transform:'translateY(110%) rotate(4deg)'},{transform:'none'}],[{transform:'none',opacity:1},{transform:'scale(.88) translateY(-4%)',opacity:0}]]};return T[trans]}
function runTrans(inEl,outEl,trans,dir){if(trans==='random')trans=TRANS[1+Math.floor(Math.random()*(TRANS.length-2))][0];
  const d=animDefs(trans,dir);if(!d||!outEl){if(outEl)outEl.classList.add('hidden');return Promise.resolve()}
  inEl.style.zIndex=2;outEl.style.zIndex=1;const o={duration:trans==='cube'||trans==='flip'?900:720,easing:'cubic-bezier(.65,0,.35,1)',fill:'both'};
  const a=inEl.animate(d[0],o),b=outEl.animate(d[1],o);
  return a.finished.then(()=>{outEl.classList.add('hidden');a.cancel();b.cancel();inEl.style.zIndex=''})}

/* --- deck settings modal --- */
function deckModal(){const n=cur();if(!n)return;flushSave();const d=deckOf(n);const slides=buildSlides(n);const sample=slides[1]||{kind:'content',h:'Örnek slayt',body:'<ul><li>Birinci madde</li><li>İkinci madde</li><li>Üçüncü madde</li></ul>',imgs:[]};
  const B=document.createElement('div');
  B.innerHTML=`<div style="display:grid;grid-template-columns:1.15fr 1fr;gap:22px">
   <div><div class="deckprev" id="dpv"><div class="stg" id="dpStage"></div></div>
     <div style="display:flex;gap:8px;align-items:center;margin-bottom:16px"><button class="btn" id="dpPlay">${icon('play')} Geçişi önizle</button><span style="font-size:12px;color:var(--muted)">${slides.length} slayt oluşacak</span></div>
     <div class="field"><label>Geçiş efekti</label><div class="trgrid" id="dpTr">${TRANS.map(([k,l])=>`<div class="tr ${d.trans===k?'on':''}" data-k="${k}"><div class="demo"><i class="b"></i><i></i></div>${l}</div>`).join('')}</div></div>
     <div class="field"><label>Yazı animasyonu</label><div class="seg" id="dpAn" style="flex-wrap:wrap">${ANIMS.map(([k,l])=>`<button data-k="${k}" class="${d.anim===k?'on':''}">${l}</button>`).join('')}</div></div>
     <div style="display:flex;gap:18px;flex-wrap:wrap">
      <div class="field"><label>Maddeler</label><div class="seg" id="dpBuild"><button data-k="auto" class="${d.build!=='click'?'on':''}">Otomatik sırayla</button><button data-k="click" class="${d.build==='click'?'on':''}">Tıkladıkça</button></div></div>
      <div class="field"><label>Oran</label><div class="seg" id="dpRatio"><button data-k="16:9" class="${d.ratio!=='4:3'?'on':''}">16:9</button><button data-k="4:3" class="${d.ratio==='4:3'?'on':''}">4:3</button></div></div>
      <div class="field"><label>Otomatik oynatma</label><div class="seg" id="dpAuto">${[4,6,10,15].map(s=>`<button data-k="${s}" class="${(d.autoSec||6)===s?'on':''}">${s} sn</button>`).join('')}</div></div></div>
   </div>
   <div><div class="field"><label>Tema şablonu</label><div class="deckgrid" id="dpTh" style="grid-template-columns:repeat(2,1fr)">${Object.entries(DECKS).map(([k,t])=>`<div class="dk ${d.theme===k?'on':''}" data-k="${k}">${slideHTML(slides[0]||{kind:'title',title:n.title,sub:'',date:''},k,0,2,d,1)}<div class="nm">${t.n}</div></div>`).join('')}</div></div></div></div>
   <div style="font-size:12px;color:var(--muted);margin-top:4px">Sunum sırasında: ←/→ gezin · O genel bakış · L lazer · P kalem · B karart · A otomatik · F tam ekran · Esc çık</div>`;
  const m=modal({title:'Sunum: tema, geçiş ve animasyon',body:B,wide:true,foot:[{html:icon('ppt')+' PowerPoint indir',fn:()=>{save();exportPPTX()}},{l:'Kaydet',fn:c=>{save();c();toast('Sunum ayarları kaydedildi')}},{html:icon('play')+' Sunumu başlat',cls:'pri',fn:c=>{save();c();startDialog()}}]});
  m.el.style.width='min(1180px,96vw)';
  qsa('.dk',B).forEach(e=>{qsa('.bi',e).forEach(b=>b.style.opacity=1);const k=(e.offsetWidth||250)/1600;qs('.slide',e).style.transform=`scale(${k})`});
  const save=()=>{n.deck={...d};persist(n);S.set.deck={...d};saveSet()};
  const prev=()=>{const st=$('dpStage');st.style.height=(d.ratio==='4:3'?1200:900)+'px';const W=$('dpv').offsetWidth;$('dpv').style.aspectRatio=d.ratio==='4:3'?'4/3':'16/9';st.style.transform=`scale(${W/1600})`;
    st.innerHTML=slideHTML(slides[0]||{kind:'title',title:n.title,sub:'',date:''},d.theme,0,3,d)+slideHTML(sample,d.theme,1,3,d);
    qsa('.slide',st).forEach(e=>{prepBuild(e);e.style.setProperty('--an','an-'+(d.anim==='none'?'fade':d.anim));if(d.anim==='none')e.classList.add('noanim')});
    const [a,b]=qsa('.slide',st);b.classList.add('hidden');a.classList.add('play')};
  const play=()=>{const [a,b]=qsa('#dpStage .slide');if(!a)return;const fwd=b.classList.contains('hidden');const inE=fwd?b:a,outE=fwd?a:b;inE.classList.remove('hidden','play');void inE.offsetWidth;inE.classList.add('play');runTrans(inE,outE,d.trans,fwd?1:-1)};
  prev();$('dpPlay').onclick=play;
  qsa('#dpTh .dk',B).forEach(e=>e.onclick=()=>{d.theme=e.dataset.k;qsa('#dpTh .dk',B).forEach(x=>x.classList.toggle('on',x===e));prev()});
  qsa('#dpTr .tr',B).forEach(e=>{e.onclick=()=>{d.trans=e.dataset.k;qsa('#dpTr .tr',B).forEach(x=>x.classList.toggle('on',x===e));prev();setTimeout(play,60)};
    e.onmouseenter=()=>{const [b,a]=qsa('.demo i',e);const df=animDefs(e.dataset.k==='random'?'cube':e.dataset.k,1);if(df){a.animate(df[0],{duration:700,easing:'cubic-bezier(.65,0,.35,1)'});b.animate(df[1],{duration:700,easing:'cubic-bezier(.65,0,.35,1)'})}}});
  const seg=(id,key,num)=>qsa(`#${id} button`,B).forEach(b=>b.onclick=()=>{d[key]=num?+b.dataset.k:b.dataset.k;qsa(`#${id} button`,B).forEach(x=>x.classList.toggle('on',x===b));prev();if(key==='anim')setTimeout(play,60)});
  seg('dpAn','anim');seg('dpBuild','build');seg('dpRatio','ratio');seg('dpAuto','autoSec',1)}
