/* ============ SHOW RUNTIME — audience screen + presenter view ============ */
const SH={active:false,slides:[],i:0,deck:null,A:null,PV:null,mode:'here',t0:0,acc:0,paused:false,tick:null,auto:null,tool:null,strokes:[],cur:null,popup:null,pvWin:null,poll:null,sd:null,notesFs:22,shown:0};
const stageH=()=>SH.deck&&SH.deck.ratio==='4:3'?1200:900;
const fmtT=ms=>{const s=Math.max(0,Math.floor(ms/1000));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return(h?h+':':'')+String(m).padStart(2,'0')+':'+String(x).padStart(2,'0')};
function showFonts(){const f=new Set(['Inter','JetBrains Mono','Space Grotesk']);const T=DECKS[SH.deck?.theme]||{};if(T.hf)f.add(T.hf);if(T.bf)f.add(T.bf);
  SH.slides.forEach(s=>{(String(s.body||'')+String(s.h||'')).replace(/font-family:\s*(?:&quot;|['"])?([^;'"&]+)/g,(m,a)=>f.add(a.trim()))});return f}
function copyStyles(doc){const fams=showFonts();qsa('style',document.head).forEach(st=>{const n=doc.createElement('style');
    n.textContent=st.id==='fontcss'?st.textContent.split('\n').filter(l=>{const m=l.match(/font-family:'([^']+)'/);return m&&fams.has(m[1])}).join('\n'):st.textContent;doc.head.appendChild(n)});
  const rs=document.documentElement.getAttribute('style');if(rs)doc.documentElement.setAttribute('style',rs);doc.documentElement.dataset.dark=document.documentElement.dataset.dark||''}
function blankWin(name,feat,title){const w=window.open('',name,feat);if(!w)return null;
  w.document.open();w.document.write(`<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>${esc(title)}</title><link rel="icon" href="${qs('link[rel=icon]')?.href||''}"></head><body class="ready" style="margin:0;overflow:hidden;background:#000"></body></html>`);w.document.close();copyStyles(w.document);return w}

/* ---------- audience ---------- */
function mountAudience(doc,controls,gate){
  let root=doc.getElementById('show');if(!root){root=doc.createElement('div');root.id='show';doc.body.appendChild(root)}
  root.className='on'+(controls?'':' noctl');
  root.innerHTML=`<div id="stage"></div><div id="blackout"></div><div id="overview"></div><div id="showui"><div id="showbar"></div>
   ${controls?`<div id="showctl"><button data-a="prev" title="Önceki (←)">${icon('left')}</button><span class="cnt" id="scCnt">1 / 1</span><button data-a="next" title="Sonraki (→)">${icon('right')}</button><span class="tm" id="scTime">00:00</span>
   <button data-a="grid" title="Genel bakış (O)">${icon('grid')}</button><button data-a="laser" title="Lazer (L)">${icon('laser')}</button><button data-a="pen" title="Kalem (P)">${icon('pen')}</button><button data-a="auto" title="Otomatik (A)">${icon('auto')}</button><button data-a="full" title="Tam ekran (F)">${icon('expand')}</button><button data-a="end" title="Bitir (Esc)">${icon('x')}</button></div>`:''}</div>
   ${gate?`<div id="showgate"><div class="g-card"><div class="g-ic">${icon('slides')}</div><h2>Sunum penceresi hazır</h2><p>Bu pencereyi <b>projeksiyon / ikinci ekrana</b> sürükle,<br>sonra tam ekran için aşağıya tıkla.</p><button data-a="gofull">${icon('expand')} Tam ekran yap ve başla</button><small>Sunumu yönetmek için diğer ekrandaki <b>sunucu görünümünü</b> kullan.</small></div></div>`:''}`;
  const A={doc,win:doc.defaultView,root,stage:qs('#stage',root),blk:qs('#blackout',root),ov:qs('#overview',root),bar:qs('#showbar',root),els:[],ink:null,laser:null,gate:qs('#showgate',root)};
  qsa('[data-a]',root).forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();showAction(b.dataset.a)}));
  root.addEventListener('click',e=>{if(e.target.closest('#showctl,#overview,#showgate')||SH.tool==='pen')return;if(e.clientX<A.win.innerWidth*.22)prev();else next()});
  root.addEventListener('mousemove',e=>{if(SH.tool==='laser')laserAt(stagePt(A.stage,e));root.classList.remove('hidecur');clearTimeout(A.hideT);A.hideT=setTimeout(()=>{if(SH.tool!=='pen')root.classList.add('hidecur')},2200)});
  doc.addEventListener('keydown',showKey,true);A.onResize=()=>fitStage(A);A.win.addEventListener('resize',A.onResize);
  return A}
function renderAudience(){const A=SH.A;if(!A)return;const st=A.stage;st.style.width='1600px';st.style.height=stageH()+'px';
  st.innerHTML=SH.slides.map((s,i)=>slideMarkup(s,i,SH.slides.length,false)).join('')+`<canvas class="ink" width="1600" height="${stageH()}"></canvas><div class="laser"></div>`;
  A.els=qsa('.slide',st);A.ink=qs('.ink',st);A.laser=qs('.laser',st);bindInk(A.ink,st);
  A.els.forEach(e=>{if(SH.isDeck){e.classList.add('hidden');return}prepBuild(e);e.classList.add('hidden');e.style.setProperty('--an','an-'+(SH.deck.anim==='none'?'fade':SH.deck.anim));if(SH.deck.anim==='none')e.classList.add('noanim');if(SH.deck.build==='click')e.classList.add('clickb');
    if(SH.deck.anim==='type')qsa('.bi',e).forEach(b=>{if(!b.matches('.sh1,.sh2'))b.style.setProperty('--an','an-up')})});
  fitStage(A);refitAll();A.doc.fonts&&A.doc.fonts.ready.then(refitAll)}
function refitAll(){const A=SH.A;if(!A)return;A.els.forEach(e=>{const h=e.classList.contains('hidden');e.classList.remove('hidden');fitSlide(e);if(h)e.classList.add('hidden')})}
function fitStage(A){const st=A.stage;const k=Math.min(A.win.innerWidth/1600,A.win.innerHeight/stageH());st.style.transform=`scale(${k}) translate(-50%,-50%)`}
function stagePt(stage,e){const r=stage.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*1600,y:(e.clientY-r.top)/r.height*stageH()}}

/* ---------- ink & laser (shared between audience and presenter) ---------- */
function bindInk(cv,host){let dr=null;
  const down=e=>{if(SH.tool!=='pen')return;e.preventDefault();e.stopPropagation();dr=[stagePt(host,e)];SH.strokes.push(dr)};
  const move=e=>{if(SH.tool==='laser'){laserAt(stagePt(host,e));return}if(!dr)return;const p=stagePt(host,e);dr.push(p);drawSeg(dr[dr.length-2],p)};
  const up=()=>{dr=null};
  host.addEventListener('pointerdown',down);host.addEventListener('pointermove',move);host.addEventListener('pointerup',up);host.addEventListener('pointerleave',()=>{up();if(SH.tool==='laser')laserAt(null)})}
function inkCanvases(){return[SH.A?.ink,SH.PV?.ink].filter(Boolean)}
function inkColor(){const el=SH.A?.els[SH.i];return el?getComputedStyle(el).getPropertyValue('--sa').trim()||'#ff3b30':'#ff3b30'}
function drawSeg(a,b){inkCanvases().forEach(c=>{const x=c.getContext('2d');x.strokeStyle=inkColor();x.lineWidth=7;x.lineCap='round';x.lineJoin='round';x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()})}
function redrawInk(){inkCanvases().forEach(c=>c.getContext('2d').clearRect(0,0,c.width,c.height));SH.strokes.forEach(s=>{for(let i=1;i<s.length;i++)drawSeg(s[i-1],s[i])})}
function clearInk(){SH.strokes=[];redrawInk()}
function laserAt(p){[SH.A?.laser,SH.PV?.laser].filter(Boolean).forEach(l=>{if(!p){l.style.display='none';return}l.style.display='block';l.style.left=p.x+'px';l.style.top=p.y+'px'})}
function setTool(t){SH.tool=SH.tool===t?null:t;if(SH.tool!=='laser')laserAt(null);
  const pe=SH.tool==='pen';[SH.A?.stage,SH.PV?.curStage].filter(Boolean).forEach(s=>s.style.cursor=pe?'crosshair':SH.tool==='laser'?'none':'');
  syncUI()}

/* ---------- presenter view ---------- */
function mountPresenter(doc){
  let root=doc.getElementById('presenter');if(root)root.remove();root=doc.createElement('div');root.id='presenter';
  const n=cur();const ar=SH.deck.ratio==='4:3'?'4/3':'16/9';root.style.setProperty('--ar',ar);
  root.innerHTML=`<header class="pv-top"><div class="pv-brand">ESS<b>TYPE</b><span>Sunucu görünümü</span></div><div class="pv-title">${esc(n.title||'Sunum')}</div>
    <div class="pv-timer"><span id="pvTime">00:00</span><button data-a="pause" title="Duraklat / devam">${icon('play')}</button><button data-a="reset" title="Süreyi sıfırla">${icon('restore')}</button></div>
    <div class="pv-clock" id="pvClock"></div><button class="pv-end" data-a="end">${icon('x')} Sunumu bitir</button></header>
   <div class="pv-main"><section class="pv-cur"><div class="pv-lbl"><span>Şu an</span><b id="pvCnt"></b><span id="pvBuild" class="pv-pill"></span><span id="pvState" class="pv-pill warn"></span></div>
     <div class="frame" id="pvCur"></div>
     <div class="pv-ctl"><button class="big" data-a="prev">${icon('left')} Önceki</button><button class="big pri" data-a="next">Sonraki ${icon('right')}</button><span class="sep"></span>
      <button data-a="black" data-k="B">${icon('moon')}<span>Karart</span></button><button data-a="white" data-k="W">${icon('sun')}<span>Beyaz</span></button><button data-a="laser" data-k="L">${icon('laser')}<span>Lazer</span></button><button data-a="pen" data-k="P">${icon('pen')}<span>Kalem</span></button><button data-a="clear" data-k="C">${icon('eraser')}<span>Temizle</span></button><button data-a="auto" data-k="A">${icon('auto')}<span>Otomatik</span></button>${SH.mode==='window'?`<button data-a="fullA">${icon('expand')}<span>Tam ekran</span></button>`:''}</div></section>
    <aside class="pv-side"><div class="pv-lbl"><span>Sıradaki</span></div><div class="frame small" id="pvNext"></div>
     <div class="pv-lbl"><span>Konuşmacı notları</span><span class="sp"></span><button class="mini" data-a="fs-">A−</button><button class="mini" data-a="fs+">A+</button></div><div class="pv-notes" id="pvNotes"></div></aside></div>
   <footer class="pv-strip" id="pvStrip">${SH.slides.map((s,i)=>`<div class="th" data-i="${i}"><div class="stg">${slideMarkup(s,i,SH.slides.length,true)}</div><span>${i+1}</span></div>`).join('')}</footer>`;
  doc.body.appendChild(root);
  const PV={doc,win:doc.defaultView,root,cur:qs('#pvCur',root),next:qs('#pvNext',root),notes:qs('#pvNotes',root),strip:qs('#pvStrip',root)};
  qsa('[data-a]',root).forEach(b=>b.addEventListener('click',()=>showAction(b.dataset.a)));
  qsa('.th',PV.strip).forEach(t=>{qsa('.bi',t).forEach(b=>b.style.opacity=1);t.onclick=()=>{const i=+t.dataset.i;go(i,i>SH.i?1:-1)}});
  doc.addEventListener('keydown',showKey,true);
  PV.ro=new PV.win.ResizeObserver(()=>scaleFrames());PV.ro.observe(root);
  return PV}
function frameSlide(frame,i,end){const h=stageH();
  if(end)frame.innerHTML=`<div class="stg" style="height:${h}px"><div class="pv-endcard"><div>${icon('pinmark')}</div>Sunumun sonu</div></div>`;
  else frame.innerHTML=`<div class="stg" style="height:${h}px">${slideMarkup(SH.slides[i],i,SH.slides.length,true)}</div>`;
  const sl=qs('.slide',frame);if(sl){sl.classList.add('noanim');}return qs('.stg',frame)}
function updatePresenter(){const PV=SH.PV;if(!PV)return;const i=SH.i,N=SH.slides.length;
  PV.curStage=frameSlide(PV.cur,i);PV.curStage.insertAdjacentHTML('beforeend',`<canvas class="ink" width="1600" height="${stageH()}"></canvas><div class="laser"></div>`);
  PV.ink=qs('.ink',PV.curStage);PV.laser=qs('.laser',PV.curStage);bindInk(PV.ink,PV.curStage);
  frameSlide(PV.next,i+1,i+1>=N);
  const nt=SH.slides[i].notes;PV.notes.innerHTML=nt?`<div style="font-size:${SH.notesFs}px">${nt}</div>`:`<div class="pv-nonote">Bu slayt için konuşmacı notu yok.<br><small>Notları sunum düzenleyicide slaytın altındaki <b>konuşmacı notları</b> alanına yazabilirsin; izleyiciler görmez.</small></div>`;
  qs('#pvCnt',PV.root).textContent=`${i+1} / ${N}`;
  qsa('.th',PV.strip).forEach(t=>t.classList.toggle('on',+t.dataset.i===i));const a=qs('.th.on',PV.strip);if(a)a.scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'});
  scaleFrames();redrawInk();syncUI()}
function scaleFrames(){const PV=SH.PV;if(!PV)return;qsa('.frame,.th',PV.root).forEach(f=>{const s=qs('.stg',f);if(s)s.style.transform=`scale(${f.clientWidth/1600})`})}
function syncUI(){const PV=SH.PV;const el=SH.A?.els[SH.i];
  if(PV){const tot=el?qsa('.bi',el).length:0,sh=el?qsa('.bi.shown',el).length:0;const b=qs('#pvBuild',PV.root);const pend=SH.isDeck?deckPending(el):(SH.deck.build==='click'&&el?tot-sh:0);
    if(pend>0){b.textContent=`${pend} animasyon daha`;b.style.display=''}else b.style.display='none';
    const blk=SH.A?.blk.style.display==='block';const st=qs('#pvState',PV.root);st.textContent=blk?'Ekran karartıldı':'';st.style.display=blk?'':'none';
    qsa('[data-a]',PV.root).forEach(x=>{const a=x.dataset.a;x.classList.toggle('on',(a==='laser'&&SH.tool==='laser')||(a==='pen'&&SH.tool==='pen')||(a==='auto'&&!!SH.auto)||(a==='black'&&blk&&SH.A.blk.style.background==='rgb(0, 0, 0)')||(a==='white'&&blk&&SH.A.blk.style.background==='rgb(255, 255, 255)'))});
    const pz=qs('[data-a="pause"]',PV.root);if(pz)pz.innerHTML=SH.paused?icon('play'):'<svg class="i" viewBox="0 0 24 24"><path d="M8 5v14M16 5v14"/></svg>'}
  if(SH.A){const r=SH.A.root;const c=qs('#scCnt',r);if(c)c.textContent=`${SH.i+1} / ${SH.slides.length}`;qsa('#showctl [data-a]',r).forEach(x=>x.classList.toggle('on',(x.dataset.a===SH.tool)||(x.dataset.a==='auto'&&!!SH.auto)))}}
function tickTimer(){const ms=SH.acc+(SH.paused?0:Date.now()-SH.t0);const t=fmtT(ms);
  if(SH.PV){qs('#pvTime',SH.PV.root).textContent=t;qs('#pvClock',SH.PV.root).textContent=new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'})}
  const st=SH.A&&qs('#scTime',SH.A.root);if(st)st.textContent=t;
  if(SH.popup&&SH.popup.closed&&SH.active)endShow();if(SH.pvWin&&SH.pvWin.closed&&SH.active)endShow()}

/* ---------- navigation ---------- */
function go(i,dir,instant){const N=SH.slides.length;if(i<0||i>=N||(i===SH.i&&!instant))return;
  const A=SH.A;if(A){const prevEl=A.els[SH.i],nextEl=A.els[i];
    nextEl.classList.remove('hidden','play');qsa('.bi.shown',nextEl).forEach(b=>b.classList.remove('shown'));void nextEl.offsetWidth;nextEl.classList.add('play');
    if(SH.isDeck)deckPrep(nextEl,dir);
    else if(SH.deck.build==='click'){if(dir<0)qsa('.bi',nextEl).forEach(b=>b.classList.add('shown'));else qsa('.sh1,.sh2,.kicker',nextEl).forEach(b=>b.classList.add('shown'))}
    const tr=(SH.isDeck&&dir>0?SH.slides[i].trans:SH.isDeck&&dir<0?SH.slides[SH.i]?.trans:null)||SH.deck.trans;
    if(prevEl&&prevEl!==nextEl&&!instant){prevEl.classList.remove('play');runTrans(nextEl,prevEl,tr,dir)}else if(prevEl&&prevEl!==nextEl)prevEl.classList.add('hidden');
    A.bar.style.width=((i+1)/N*100)+'%';A.bar.style.background=getComputedStyle(nextEl).getPropertyValue('--sa')}
  SH.i=i;SH.strokes=[];redrawInk();updatePresenter();syncUI()}
function next(){const el=SH.A?.els[SH.i];if(SH.isDeck){if(deckNextStep(el)){syncUI();return}}else if(SH.deck.build==='click'&&el){const h=qsa('.bi:not(.shown)',el);if(h.length){h[0].classList.add('shown');syncUI();return}}
  if(SH.i<SH.slides.length-1)go(SH.i+1,1);else if(SH.auto)toggleAuto();else flashEnd()}
function prev(){go(SH.i-1,-1)}
function flashEnd(){const r=SH.PV?.root||SH.A?.root;if(!r)return;const d=r.ownerDocument.createElement('div');d.className='show-toast';d.textContent='Son slayt — çıkmak için Esc';r.appendChild(d);setTimeout(()=>d.remove(),1800)}
function toggleAuto(){if(SH.auto){clearInterval(SH.auto);SH.auto=null}else SH.auto=setInterval(next,(SH.deck.autoSec||6)*1000);syncUI()}
function blackout(c){const b=SH.A?.blk;if(!b)return;if(b.style.display==='block'&&b.style.background===c){b.style.display='none'}else{b.style.background=c;b.style.display='block'}syncUI()}
function overview(){const A=SH.A;if(!A)return;const O=A.ov;if(O.classList.contains('on')){O.classList.remove('on');return}
  O.innerHTML=SH.slides.map((s,i)=>`<div class="ov ${i===SH.i?'on':''}" data-i="${i}">${slideMarkup(s,i,SH.slides.length,true)}<span>${i+1}</span></div>`).join('');O.classList.add('on');
  qsa('.ov',O).forEach(e=>{qsa('.bi',e).forEach(b=>b.style.opacity=1);qs('.slide',e).style.transform=`scale(${e.offsetWidth/1600})`;e.onclick=ev=>{ev.stopPropagation();O.classList.remove('on');go(+e.dataset.i,+e.dataset.i>SH.i?1:-1)}})}
function toggleFull(doc){doc=doc||SH.A?.doc||document;if(doc.fullscreenElement)doc.exitFullscreen().catch(()=>{});else doc.documentElement.requestFullscreen().catch(()=>{})}
function showAction(a){({prev,next,end:endShow,grid:overview,laser:()=>setTool('laser'),pen:()=>setTool('pen'),clear:clearInk,auto:toggleAuto,full:()=>toggleFull(),fullA:()=>toggleFull(SH.A?.doc),
  black:()=>blackout('rgb(0, 0, 0)'),white:()=>blackout('rgb(255, 255, 255)'),
  pause:()=>{if(SH.paused){SH.t0=Date.now();SH.paused=false}else{SH.acc+=Date.now()-SH.t0;SH.paused=true}tickTimer();syncUI()},reset:()=>{SH.acc=0;SH.t0=Date.now();tickTimer()},
  'fs-':()=>{SH.notesFs=Math.max(14,SH.notesFs-2);updatePresenter()},'fs+':()=>{SH.notesFs=Math.min(44,SH.notesFs+2);updatePresenter()},
  gofull:()=>{const A=SH.A;A.doc.documentElement.requestFullscreen().catch(()=>{});A.gate?.remove();A.gate=null;setTimeout(()=>{fitStage(A);refitAll()},300)}}[a]||(()=>{}))()}
function showKey(e){if(!SH.active)return;const k=e.key;if(e.target&&e.target.closest&&e.target.closest('input,textarea'))return;
  if(k==='Escape'){e.preventDefault();e.stopPropagation();if(SH.A?.ov.classList.contains('on'))return SH.A.ov.classList.remove('on');if(SH.tool)return setTool(SH.tool);return endShow()}
  if(SH.A?.ov.classList.contains('on')&&!/^[oO]$/.test(k))return;
  const map={ArrowRight:next,ArrowDown:next,' ':next,PageDown:next,Enter:next,ArrowLeft:prev,ArrowUp:prev,PageUp:prev,Backspace:prev,Home:()=>go(0,-1),End:()=>go(SH.slides.length-1,1)};
  if(map[k]){e.preventDefault();e.stopPropagation();map[k]();return}
  const L=k.toLowerCase();const m2={o:overview,b:()=>blackout('rgb(0, 0, 0)'),'.':()=>blackout('rgb(0, 0, 0)'),w:()=>blackout('rgb(255, 255, 255)'),l:()=>setTool('laser'),p:()=>setTool('pen'),c:clearInk,a:toggleAuto,f:()=>toggleFull(SH.A?.doc)};
  if(m2[L]&&!e.ctrlKey){e.preventDefault();m2[L]()}}

/* ---------- start / end ---------- */
function startIndexFrom(fromHere,sl){let start=0;if(fromHere){const sc=$('scroll').getBoundingClientRect(),P=$('paper').getBoundingClientRect();const cy=(sc.top+sc.height/3-P.top)/Z();sl.forEach((x,i)=>{if(x.y!=null&&x.y<=cy)start=i})}return start}
function otherScreen(){const sd=SH.sd;if(!sd)return null;return sd.screens.find(s=>s!==sd.currentScreen&&!s.isPrimary)||sd.screens.find(s=>s!==sd.currentScreen)||null}
function beginShow(mode,fromHere){
  const n=cur();if(!n)return;if(SH.active)endShow();flushSave();deselect();
  SH.isDeck=isDeck(n);let sl;
  if(SH.isDeck){endTextEdit();sl=deckSlidesForShow(n);if(!sl.length){toast('Gösterilecek slayt yok (hepsi gizli)');return}}
  else{toast('Slayt gösterisi sunum belgeleri içindir — yeni bir sunum oluştur');newDeckDialog();return}
  SH.slides=sl;SH.deck=deckOf(n);SH.mode=mode;SH.i=-1;SH.strokes=[];SH.tool=null;SH.paused=false;SH.acc=0;SH.A=null;SH.PV=null;SH.popup=null;SH.pvWin=null;
  const start=SH.isDeck?(fromHere?Math.max(0,n.slides.filter(x=>!x.hidden).indexOf(curSlide())):0):startIndexFrom(fromHere,sl);const title=(n.title||'Sunum')+' — ESSTYPE';
  // 1) things that need the click's user activation come first
  if(mode==='screen'){const other=otherScreen();if(!other){toast('İkinci ekran bulunamadı — bu ekranda başlatılıyor');mode=SH.mode='here'}
    else{document.documentElement.requestFullscreen({screen:other}).catch(()=>{});
      const cs=SH.sd.currentScreen;SH.pvWin=blankWin('esstype_presenter',`popup,left=${cs.availLeft},top=${cs.availTop},width=${cs.availWidth},height=${cs.availHeight}`,'Sunucu görünümü — ESSTYPE');
      if(!SH.pvWin)toast('Sunucu görünümü penceresi engellendi — sadece slaytlar gösteriliyor',null,null,5000)}}
  if(mode==='window'){const o=otherScreen();const f=o?`popup,left=${o.availLeft},top=${o.availTop},width=${o.availWidth},height=${o.availHeight}`:`popup,width=1280,height=760,left=${screenX+60},top=${screenY+60}`;
    SH.popup=blankWin('esstype_audience',f,title);if(!SH.popup){toast('Açılır pencere engellendi — bu ekranda başlatılıyor');mode=SH.mode='here'}}
  if(mode==='here'||mode==='rehearse')document.documentElement.requestFullscreen().catch(()=>{});
  // 2) mount
  if(mode==='here')SH.A=mountAudience(document,true);
  if(mode==='screen'){SH.A=mountAudience(document,false);if(SH.pvWin)SH.PV=mountPresenter(SH.pvWin.document)}
  if(mode==='window'){SH.A=mountAudience(SH.popup.document,false,true);SH.PV=mountPresenter(document)}
  if(mode==='rehearse')SH.PV=mountPresenter(document);
  SH.active=true;renderAudience();go(start,1,true);
  SH.t0=Date.now();clearInterval(SH.tick);SH.tick=setInterval(tickTimer,500);tickTimer();
  if(SH.PV)setTimeout(scaleFrames,60);
  if(SH.isDeck&&n.deck.autoAdvance){SH.auto=setInterval(next,(n.deck.autoSec||6)*1000)}
  S.set.showMode=SH.mode;saveSet()}
function endShow(){if(!SH.active)return;SH.active=false;clearInterval(SH.tick);if(SH.auto){clearInterval(SH.auto);SH.auto=null}
  for(const d of [document,SH.popup?.document,SH.pvWin?.document].filter(Boolean)){try{d.removeEventListener('keydown',showKey,true)}catch(e){}}
  try{if(document.fullscreenElement)document.exitFullscreen().catch(()=>{})}catch(e){}
  try{SH.popup&&!SH.popup.closed&&SH.popup.close()}catch(e){}try{SH.pvWin&&!SH.pvWin.closed&&SH.pvWin.close()}catch(e){}
  const sh=$('show');if(sh){sh.className='';sh.innerHTML=''}const pv=$('presenter');if(pv)pv.remove();
  if(SH.A&&SH.A.win===window)removeEventListener('resize',SH.A.onResize);
  SH.A=null;SH.PV=null;SH.popup=null;SH.pvWin=null;toast('Sunum bitti')}
function startShow(fromHere){const m=S.set.showMode||'here';if(m==='screen'&&!SH.sd)return startDialog(fromHere);beginShow(m,fromHere)}

/* ---------- start dialog ---------- */
function startDialog(fromHere){const n=cur();if(!n)return;if(!isDeck(n)){newDeckDialog();return}flushSave();const d=n.deck;const N=n.slides.filter(x=>!x.hidden).length;
  const ext=!!(window.screen&&screen.isExtended);const wm='getScreenDetails' in window;
  let mode=S.set.showMode||'here',from=fromHere?'here':'start';
  const B=document.createElement('div');
  const card=(k,ic,t,desc,extra='')=>`<div class="mode ${mode===k?'on':''}" data-m="${k}"><div class="mi-ic">${ic}</div><div class="mt"><b>${t}</b><small>${desc}</small>${extra}</div><i class="radio"></i></div>`;
  const draw=()=>{B.innerHTML=`<div class="startsum"><div><b>${N} slayt</b> · tema <b>${esc(DECKS[d.theme]?.n||'')}</b> · geçiş <b>${esc((TRANS.find(t=>t[0]===d.trans)||[])[1]||'')}</b> · oran <b>${d.ratio}</b></div><button class="btn" id="sdDeck">${icon('palette')} Tema ve geçişler</button></div>
    <div class="modes">${card('here',icon('expand'),'Bu ekranda sun','Slaytlar tam ekran açılır. Fareyi alta götürünce kontrol çubuğu çıkar.')}
    ${card('screen','<svg class="i" viewBox="0 0 24 24"><rect x="2" y="4" width="9" height="7" rx="1"/><rect x="13" y="8" width="9" height="7" rx="1"/><path d="M5 14h3M17 18h3"/></svg>','Sunum ekranına gönder','Slaytlar projeksiyona / ikinci ekrana tam ekran gider; bu ekranda <b>sunucu görünümü</b> kalır: sıradaki slayt, notlar, süre.',
      `<span class="st ${ext?'ok':''}" id="sdScr">${!wm?'Bu sürüm desteklemiyor — “Ayrı pencerede”yi kullan':SH.sd?`Hazır: ${SH.sd.screens.length} ekran bulundu`:ext?'İkinci ekran algılandı · seçince izin istenir':'İkinci ekran algılanmadı — HDMI/kablo ile bağla'}</span>`)}
    ${card('window','<svg class="i" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M7 7h.01M10 7h.01"/><path d="m14 14 3 3M17 14v3h-3"/></svg>','Ayrı pencerede sun','Slaytlar ayrı bir pencerede açılır; onu istediğin ekrana sürükleyip tam ekran yaparsın. Sunucu görünümü burada.')}
    ${card('rehearse',icon('history'),'Prova modu','Tek ekranda sunucu görünümüyle çalış: süre tut, notlarına bak, akışı dene.')}</div>
    <div class="startfrom"><span>Nereden başlasın?</span><div class="seg"><button data-f="start" class="${from==='start'?'on':''}">Baştan</button><button data-f="here" class="${from==='here'?'on':''}">Bulunduğum yerden</button></div><span class="hint">Kısayol: <b>F5</b> baştan · <b>Shift+F5</b> buradan</span></div>`;
    qsa('.mode',B).forEach(c=>c.onclick=async()=>{mode=c.dataset.m;draw();
      if(mode==='screen'&&wm&&!SH.sd){const s=$('sdScr');s.textContent='Ekran izni bekleniyor… (açılan izin kutusunda “İzin ver”)';
        try{SH.sd=await window.getScreenDetails();SH.sd.addEventListener('screenschange',()=>{});const o=otherScreen();$('sdScr').textContent=o?`Hazır: slaytlar “${o.label||'ikinci ekran'}” ekranına gidecek`:'Tek ekran var — ikinci ekranı bağlayıp tekrar dene';$('sdScr').classList.toggle('ok',!!o)}
        catch(e){$('sdScr').textContent='İzin verilmedi — “Ayrı pencerede” seçeneğini kullanabilirsin';$('sdScr').classList.remove('ok')}}});
    qsa('[data-f]',B).forEach(b=>b.onclick=()=>{from=b.dataset.f;draw()});$('sdDeck').onclick=()=>{m.close();deckTab('ddes')}};
  const m=modal({title:'Sunumu başlat',body:B,foot:[{l:'Vazgeç',cls:'ghost',fn:c=>c()},{html:icon('play')+' Başlat',cls:'pri',fn:c=>{c();beginShow(mode,from==='here')}}]});m.el.style.width='min(760px,94vw)';draw()}
function wireShow(){const st=document.createElement('style');st.textContent=PRESCSS;document.head.appendChild(st)}
