/* ============ PRESENTATION DOCUMENTS — PowerPoint-style slide editor ============ */
const DK={n:null,cur:0,sel:[],editing:null,hist:[],fut:[],clip:null,tab:'dhome',thumbT:0,k:1,drag:null};
const isDeck=n=>!!n&&n.kind==='deck';
const dd=()=>DK.n.deck;
const dH=()=>DK.n&&DK.n.deck&&DK.n.deck.ratio==='4:3'?1200:900;
const curSlide=()=>DK.n.slides[DK.cur];
const elById=id=>curSlide()?.els.find(e=>e.id===id);
const PH={title:'Başlık eklemek için tıklayın',sub:'Alt başlık eklemek için tıklayın',body:'Metin eklemek için tıklayın'};
const BUL='<ul><li><br></li></ul>';
function T_(d){return DECKS[(d||dd()).theme]||DECKS.minimal}
function stx(role,x,y,w,h,o={}){return Object.assign({id:uid(),type:'text',role,x,y,w,h,rot:0,html:'',ph:PH[role]||PH.body,align:'left',valign:role==='body'?'top':'middle',anim:null},o)}
const LAYOUTS=[
 ['title','Başlık slaytı',H=>[stx('title',140,H*.5-170,1320,190,{fs:96,valign:'bottom'}),stx('sub',140,H*.5+40,1320,90,{fs:36,valign:'top'})]],
 ['content','Başlık ve içerik',H=>[stx('title',140,70,1320,130,{fs:62}),stx('body',140,230,1320,H-330,{fs:34,html:BUL})]],
 ['section','Bölüm başlığı',H=>[stx('title',140,H*.5-150,1320,190,{fs:100,valign:'bottom'}),stx('sub',140,H*.5+60,1320,80,{fs:32,valign:'top'})]],
 ['two','İki içerik',H=>[stx('title',140,70,1320,130,{fs:62}),stx('body',140,230,630,H-330,{fs:32,html:BUL}),stx('body',830,230,630,H-330,{fs:32,html:BUL})]],
 ['compare','Karşılaştırma',H=>[stx('title',140,70,1320,130,{fs:62}),stx('sub',140,220,630,70,{fs:36,ph:'Sol başlık',valign:'middle'}),stx('body',140,300,630,H-400,{fs:30,html:BUL}),stx('sub',830,220,630,70,{fs:36,ph:'Sağ başlık',valign:'middle'}),stx('body',830,300,630,H-400,{fs:30,html:BUL})]],
 ['imagetext','Görsel ve metin',H=>[stx('title',140,70,700,130,{fs:58}),stx('body',140,230,640,H-330,{fs:30,html:BUL}),{id:uid(),type:'img',src:null,x:860,y:120,w:600,h:H-240,rot:0,fit:'cover',radius:18}]],
 ['quote','Alıntı',H=>[stx('body',220,H*.5-200,1160,300,{fs:58,ph:'“Alıntı metni”',align:'center',valign:'middle',italic:1}),stx('sub',220,H*.5+130,1160,70,{fs:28,ph:'— Kaynak',align:'center'})]],
 ['number','Büyük sayı',H=>[stx('title',140,H*.5-260,1320,300,{fs:220,ph:'%87',align:'center',valign:'bottom'}),stx('sub',240,H*.5+60,1120,120,{fs:38,ph:'Bu sayının anlamını yaz',align:'center',valign:'top'})]],
 ['titleonly','Yalnızca başlık',H=>[stx('title',140,70,1320,130,{fs:62})]],
 ['blank','Boş',H=>[]]];
const ANIMS2=[['none','Yok'],['fade','Belir'],['up','Yukarı süzül'],['down','Aşağı in'],['left','Soldan gel'],['right','Sağdan gel'],['zoom','Yakınlaş'],['blur','Bulanıktan net'],['bounce','Zıpla'],['spin','Dönerek gel'],['wipe','Silerek aç']];
const ANIMKF={fade:[{opacity:0},{opacity:1}],up:[{opacity:0,transform:'translateY(60px)'},{opacity:1,transform:'none'}],down:[{opacity:0,transform:'translateY(-60px)'},{opacity:1,transform:'none'}],
 left:[{opacity:0,transform:'translateX(-120px)'},{opacity:1,transform:'none'}],right:[{opacity:0,transform:'translateX(120px)'},{opacity:1,transform:'none'}],
 zoom:[{opacity:0,transform:'scale(.55)'},{opacity:1,transform:'none'}],blur:[{opacity:0,filter:'blur(22px)',transform:'scale(1.06)'},{opacity:1,filter:'blur(0)',transform:'none'}],
 bounce:[{opacity:0,transform:'translateY(-90px)',offset:0},{opacity:1,transform:'translateY(14px)',offset:.55},{transform:'translateY(-6px)',offset:.78},{opacity:1,transform:'none',offset:1}],
 spin:[{opacity:0,transform:'rotate(-200deg) scale(.4)'},{opacity:1,transform:'none'}],wipe:[{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}]};
function slideKind(s){return s.layout==='title'||s.layout==='section'?s.layout:'content'}
function isEmptyHTML(h){const d=document.createElement('div');d.innerHTML=h||'';return!d.textContent.trim()&&!d.querySelector('img,table')}

/* ---------- rendering (shared by editor, thumbnails, show, export) ---------- */
function elHTML(e,T,o){
  const base=`left:${e.x}px;top:${e.y}px;width:${e.w}px;height:${e.h}px;transform:rotate(${e.rot||0}deg);z-index:${(e.z||1)+5};opacity:${e.op??1}`;
  const an=o.show&&e.anim&&e.anim.type&&e.anim.type!=='none'?` data-anim="${e.anim.type}" data-tr="${e.anim.trig||'click'}" data-dur="${e.anim.dur||650}" data-dl="${e.anim.delay||0}" data-ord="${e.anim.ord||0}"`:'';
  const badge=o.badges&&e.anim&&e.anim.type!=='none'?`<span class="abadge">${e.anim.ord||''}</span>`:'';
  if(e.type==='text'){const isT=e.role==='title';const fs=(e.fs||(isT?62:34))*(isT?(T.hs||1):(T.bs||1));const ff=e.font||(isT||e.role==='sub'&&false?T.hf:T.bf);
    const st=`font-family:'${isT?(e.font||T.hf):ff}';font-size:${fs}px;color:${e.color||'inherit'};text-align:${e.align||'left'};justify-content:${{top:'flex-start',middle:'center',bottom:'flex-end'}[e.valign||'top']};font-weight:${e.bold??(isT?700:400)};font-style:${e.italic?'italic':'normal'};line-height:${isT?1.08:1.35};${isT&&T.up?'text-transform:uppercase;letter-spacing:1px;':''}${isT&&T.glow?'text-shadow:0 0 18px var(--sa),0 0 40px var(--sa);':''}${e.fill?`background:${e.fill};border-radius:${e.radius||12}px;padding:18px 26px;`:''}`;
    return `<div class="se se-text" data-id="${e.id}"${an} style="${base};${st}">${badge}<div class="tx${isEmptyHTML(e.html)?' empty':''}" data-ph="${esc(e.ph||'')}">${e.html||''}</div></div>`}
  if(e.type==='img'){const fr=`border-radius:${e.radius||0}px;${e.shadow?'box-shadow:0 30px 60px -20px rgba(0,0,0,.55);':''}${e.border?`outline:${e.border}px solid ${e.bcolor||'#fff'};outline-offset:-${e.border}px;`:''}`;
    return `<div class="se se-img" data-id="${e.id}"${an} style="${base}">${badge}${e.src?`<img src="${e.src}" style="object-fit:${e.fit||'cover'};${fr};filter:${e.filter||'none'}">`:o.edit?`<div class="imgph">${icon('image')}<span>Görsel eklemek için çift tıklayın</span></div>`:''}</div>`}
  if(e.type==='shape'){const T2=T;return `<div class="se se-shape" data-id="${e.id}"${an} style="${base}">${badge}${shapeSVG({shape:e.shape,fill:e.fill||T2.ac,stroke:e.stroke||'none',sw:e.sw||0})}<div class="tx${isEmptyHTML(e.html)?' empty':''}" data-ph="" style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;text-align:center;padding:12px;font-family:'${e.font||T.bf}';font-size:${e.fs||30}px;color:${e.color||'#fff'};font-weight:600;line-height:1.25">${e.html||''}</div></div>`}
  return ''}
function deckSlideHTML(s,o={}){const d=o.deck||dd(),T=DECKS[d.theme]||DECKS.minimal,H=o.H||(d.ratio==='4:3'?1200:900);
  const kind=slideKind(s),dark=T.dark&&T.dark(kind);
  const bg=s.bg?(s.bg.img?`#000 center/cover no-repeat url(${s.bg.img})`:s.bg.color):(dark?'#1b2a4a':T.bg),fg=dark?'#ffffff':T.fg;
  const els=[...s.els].sort((a,b)=>(a.z||0)-(b.z||0)).map(e=>elHTML(e,T,o)).join('');
  const num=o.num!=null&&kind!=='title'&&d.nums!==false?`<div class="snum">${o.num}</div>`:'';
  return `<div class="slide dslide l-${kind}" style="width:1600px;height:${H}px;background:${bg};color:${fg};--sa:${T.ac};font-family:'${T.bf}'">${s.bg&&s.bg.img?'':(T.deco?T.deco(kind):'')}${els}${num}</div>`}
function slideMarkup(sl,i,N,thumb){return sl.dk?deckSlideHTML(sl.dk,{deck:SH.deck,num:i+1,show:!thumb,H:stageH()}):slideHTML(sl,SH.deck.theme,i,N,SH.deck,thumb)}
function deckSlidesForShow(n){const vis=n.slides.filter(s=>!s.hidden);return vis.map(s=>({dk:s,notes:s.notes?esc(s.notes).replace(/\n/g,'<br>'):'',trans:s.trans}))}
/* animation runtime for slide show */
function deckPrep(slideEl,dir){const nodes=qsa('[data-anim]',slideEl).sort((a,b)=>(+a.dataset.ord)-(+b.dataset.ord));
  const groups=[];let g=null;nodes.forEach((n,i)=>{const tr=n.dataset.tr;if(tr==='click'||!g){g={auto:tr!=='click'&&groups.length===0,items:[]};groups.push(g)}g.items.push(n)});
  slideEl._groups=groups;slideEl._gi=0;
  if(dir<0){nodes.forEach(n=>n.style.opacity='');slideEl._gi=groups.length;return}
  nodes.forEach(n=>{n.getAnimations().forEach(a=>a.cancel());n.style.opacity='0'});
  if(groups[0]&&groups[0].auto){playGroup(groups[0],450);slideEl._gi=1}}
function playGroup(g,base=0){let t=base,last=0;g.items.forEach((n,i)=>{const tr=n.dataset.tr,dur=+n.dataset.dur||650,dl=+n.dataset.dl||0;
  if(tr==='after'&&i>0)t=last;const start=t+dl;const kf=ANIMKF[n.dataset.anim]||ANIMKF.fade;n.style.opacity='';
  n.animate(kf,{duration:dur,delay:start,easing:'cubic-bezier(.2,.75,.25,1)',fill:'backwards'});last=start+dur})}
function deckNextStep(slideEl){if(!slideEl||!slideEl._groups)return false;if(slideEl._gi<slideEl._groups.length){playGroup(slideEl._groups[slideEl._gi]);slideEl._gi++;return true}return false}
function deckPending(slideEl){return slideEl&&slideEl._groups?slideEl._groups.length-slideEl._gi:0}

/* ---------- document lifecycle ---------- */
function blankSlide(layout='content',H=900){const L=LAYOUTS.find(l=>l[0]===layout)||LAYOUTS[1];return{id:uid(),layout:L[0],els:L[2](H),notes:'',trans:null,hidden:false}}
async function newDeck(o={}){if(typeof flushSave==='function')flushSave();
  const deck=Object.assign({theme:'minimal',trans:'fade',anim:'up',ratio:'16:9',build:'click',autoSec:6},o.deck||{});
  const n=normNote({id:uid(),kind:'deck',title:o.title||'Başlıksız sunum',html:'',text:'',slides:o.slides||[blankSlide('title',deck.ratio==='4:3'?1200:900)],deck,book:S.view==='books'&&S.book&&S.book!=='genel'?S.book:null,created:Date.now(),updated:Date.now()});
  S.notes.unshift(n);await persist(n);if(S.view==='trash'||S.view==='fav')setView('all');openNote(n.id);return n}
function deckText(n){return n.slides.map(s=>s.els.map(e=>{const d=document.createElement('div');d.innerHTML=e.html||'';return d.innerText}).join('\n')+(s.notes?'\n'+s.notes:'')).join('\n')}
function deckDirty(){const n=DK.n;if(!n)return;n.updated=Date.now();n.text=deckText(n);setSaved(true);clearTimeout(DK.saveT);DK.saveT=setTimeout(()=>{persist(n).then(()=>setSaved(false));renderList()},350);
  clearTimeout(DK.thumbT);DK.thumbT=setTimeout(()=>renderThumb(DK.cur),120)}
function snap(){DK.hist.push(JSON.stringify(DK.n.slides));if(DK.hist.length>80)DK.hist.shift();DK.fut=[]}
function undoDeck(){if(!DK.hist.length)return;DK.fut.push(JSON.stringify(DK.n.slides));DK.n.slides=JSON.parse(DK.hist.pop());DK.cur=Math.min(DK.cur,DK.n.slides.length-1);DK.sel=[];renderDeck();deckDirty()}
function redoDeck(){if(!DK.fut.length)return;DK.hist.push(JSON.stringify(DK.n.slides));DK.n.slides=JSON.parse(DK.fut.pop());DK.sel=[];renderDeck();deckDirty()}
function enterDeck(n){DK.n=n;if(!n.slides||!n.slides.length)n.slides=[blankSlide('title',dH())];n.deck=Object.assign({theme:'minimal',trans:'fade',anim:'up',ratio:'16:9',build:'click',autoSec:6},n.deck||{});
  if(DK.lastId!==n.id){DK.cur=0;DK.hist=[];DK.fut=[];DK.lastId=n.id}DK.sel=[];DK.editing=null;document.body.classList.add('deckmode');$('deckApp').classList.remove('hide');renderDeck();
  document.title=(n.title||'Sunum')+' — ESSTYPE'}
function leaveDeck(){endTextEdit();document.body.classList.remove('deckmode');$('deckApp').classList.add('hide');DK.n=null}

/* ---------- editor rendering ---------- */
function renderDeck(){if(!DK.n)return;DK.cur=clamp(DK.cur,0,DK.n.slides.length-1);renderThumbs();renderStage();syncDeckRibbon();
  $('dnotesIn').value=curSlide().notes||'';dstatus()}
function dstatus(){const n=DK.n;$('dstatus').innerHTML=`<span>Slayt ${DK.cur+1} / ${n.slides.length}</span><span>${esc(T_().n)}</span><span>${n.deck.ratio}</span>${curSlide().hidden?'<span class="dwarn">Bu slayt gizli</span>':''}<span class="sp"></span><span>Geçiş: ${esc((TRANS.find(t=>t[0]===(curSlide().trans||n.deck.trans))||[])[1]||'')}</span>`}
function renderThumbs(){const L=$('dthumbs'),n=DK.n;const H=dH();
  L.innerHTML=n.slides.map((s,i)=>`<div class="dth ${i===DK.cur?'on':''} ${s.hidden?'hid':''}" data-i="${i}" draggable="true"><span class="no">${i+1}</span><div class="frm" style="aspect-ratio:1600/${H}"><div class="stg">${deckSlideHTML(s,{H})}</div></div>${s.trans||n.deck.trans!=='none'?'<i class="tri" title="Geçiş var">★</i>':''}</div>`).join('')+`<button class="dth-add" id="dthAdd">${icon('plus')} Yeni slayt</button>`;
  scaleThumbs();
  qsa('.dth',L).forEach(t=>{const i=+t.dataset.i;t.onclick=()=>gotoSlide(i);t.oncontextmenu=e=>{e.preventDefault();gotoSlide(i);slideMenu(t,i)};
    t.ondragstart=e=>{e.dataTransfer.setData('text/x-slide',i);t.classList.add('dragging')};t.ondragend=()=>t.classList.remove('dragging');
    t.ondragover=e=>{if(e.dataTransfer.types.includes('text/x-slide')){e.preventDefault();t.classList.add('dropb')}};t.ondragleave=()=>t.classList.remove('dropb');
    t.ondrop=e=>{e.preventDefault();t.classList.remove('dropb');const from=+e.dataTransfer.getData('text/x-slide');if(from===i)return;snap();const [s]=DK.n.slides.splice(from,1);DK.n.slides.splice(i,0,s);DK.cur=i;renderDeck();deckDirty()}});
  $('dthAdd').onclick=e=>layoutMenu(e.currentTarget,l=>addSlide(l))}
function scaleThumbs(){qsa('#dthumbs .frm').forEach(f=>{const s=qs('.stg',f);s.style.transform=`scale(${f.clientWidth/1600})`})}
function renderThumb(i){const t=qs(`#dthumbs .dth[data-i="${i}"] .stg`);if(t){t.innerHTML=deckSlideHTML(DK.n.slides[i],{H:dH()})}}
function gotoSlide(i){endTextEdit();DK.cur=clamp(i,0,DK.n.slides.length-1);DK.sel=[];qsa('#dthumbs .dth').forEach(t=>t.classList.toggle('on',+t.dataset.i===DK.cur));
  const a=qs('#dthumbs .dth.on');if(a)a.scrollIntoView({block:'nearest'});renderStage();syncDeckRibbon();$('dnotesIn').value=curSlide().notes||'';dstatus()}
function fitStageK(){const W=$('dcanvas'),H=dH();const k=Math.min((W.clientWidth-80)/1600,(W.clientHeight-60)/H);return Math.max(.15,k)}
function renderStage(){const box=$('dstagebox'),H=dH();DK.k=fitStageK();box.style.width=1600*DK.k+'px';box.style.height=H*DK.k+'px';
  const st=$('dstage');st.style.transform=`scale(${DK.k})`;st.style.setProperty('--hk',1/DK.k);
  st.innerHTML=deckSlideHTML(curSlide(),{edit:true,H,badges:DK.tab==='danim'})+'<div id="dguides"></div><div id="dsels"></div>';
  qsa('.se',st).forEach(bindEl);drawDSel();if(DK.tab==='danim')renderAnimPane()}
function drawDSel(){const L=$('dsels');if(!L)return;L.innerHTML=DK.sel.map(id=>{const e=elById(id);if(!e)return'';const one=DK.sel.length===1&&DK.editing!==id;
  return `<div class="dsel ${DK.editing===id?'editing':''}" style="left:${e.x}px;top:${e.y}px;width:${e.w}px;height:${e.h}px;transform:rotate(${e.rot||0}deg)">${one?'nw n ne e se s sw w'.split(' ').map(h=>`<span class="h ${h}" data-h="${h}"></span>`).join('')+'<span class="rot" data-h="rot"></span>':''}</div>`}).join('');
  qsa('[data-h]',L).forEach(h=>h.addEventListener('pointerdown',handleDown));syncDeckRibbon()}

/* ---------- element interaction ---------- */
function bindEl(node){
  node.addEventListener('pointerdown',ev=>{if(ev.button!==0)return;const id=node.dataset.id;if(DK.editing===id)return;
    ev.preventDefault();endTextEdit();
    if(ev.shiftKey||ev.ctrlKey){DK.sel=DK.sel.includes(id)?DK.sel.filter(x=>x!==id):[...DK.sel,id];drawDSel();return}
    if(!DK.sel.includes(id))DK.sel=[id];drawDSel();
    const sx=ev.clientX,sy=ev.clientY,k=DK.k;const starts=DK.sel.map(i=>{const e=elById(i);return{e,x:e.x,y:e.y}});let moved=false;node.setPointerCapture(ev.pointerId);
    const mv=e=>{let dx=(e.clientX-sx)/k,dy=(e.clientY-sy)/k;if(!moved&&Math.hypot(dx,dy)<3)return;if(!moved){snap();moved=true}
      if(!e.altKey){const s=snapMove(starts[0].e,starts[0].x+dx,starts[0].y+dy);dx=s.x-starts[0].x;dy=s.y-starts[0].y}
      starts.forEach(o=>{o.e.x=Math.round(o.x+dx);o.e.y=Math.round(o.y+dy);posEl(o.e)});drawDSel()};
    const up=()=>{node.removeEventListener('pointermove',mv);node.removeEventListener('pointerup',up);$('dguides').innerHTML='';if(moved)deckDirty()};
    node.addEventListener('pointermove',mv);node.addEventListener('pointerup',up)});
  node.addEventListener('dblclick',ev=>{const e=elById(node.dataset.id);if(!e)return;if(e.type==='img'){pickSlideImage(e);return}startTextEdit(e.id,ev)});
  node.addEventListener('contextmenu',ev=>{ev.preventDefault();const id=node.dataset.id;if(!DK.sel.includes(id))DK.sel=[id];drawDSel();elMenu(node)})}
function posEl(e){const n=qs(`#dstage .se[data-id="${e.id}"]`);if(!n)return;Object.assign(n.style,{left:e.x+'px',top:e.y+'px',width:e.w+'px',height:e.h+'px',transform:`rotate(${e.rot||0}deg)`})}
function snapMove(e,x,y){const H=dH(),th=8;const others=curSlide().els.filter(o=>!DK.sel.includes(o.id));
  const vx=[0,800,1600,...others.flatMap(o=>[o.x,o.x+o.w/2,o.x+o.w])],vy=[0,H/2,H,...others.flatMap(o=>[o.y,o.y+o.h/2,o.y+o.h])];
  let gx=null,gy=null;for(const [off,c] of [[0,'l'],[e.w/2,'c'],[e.w,'r']])for(const v of vx)if(gx===null&&Math.abs(x+off-v)<th){x=v-off;gx=v}
  for(const [off] of [[0],[e.h/2],[e.h]])for(const v of vy)if(gy===null&&Math.abs(y+off-v)<th){y=v-off;gy=v}
  $('dguides').innerHTML=(gx!==null?`<i class="gv" style="left:${gx}px"></i>`:'')+(gy!==null?`<i class="gh" style="top:${gy}px"></i>`:'');return{x,y}}
function handleDown(ev){ev.preventDefault();ev.stopPropagation();const kind=ev.currentTarget.dataset.h;const e=elById(DK.sel[0]);if(!e)return;snap();
  const k=DK.k,sx=ev.clientX,sy=ev.clientY,o0={...e};const node=qs(`#dstage .se[data-id="${e.id}"]`),r=node.getBoundingClientRect();const cxs=r.left+r.width/2,cys=r.top+r.height/2;
  const D={nw:[-1,-1],n:[0,-1],ne:[1,-1],e:[1,0],se:[1,1],s:[0,1],sw:[-1,1],w:[-1,0]};const keep=e.type==='img';
  const mv=v=>{if(kind==='rot'){let a=Math.atan2(v.clientY-cys,v.clientX-cxs)*180/Math.PI+90;const sn=Math.round(a/15)*15;if(Math.abs(a-sn)<5||v.shiftKey)a=sn;e.rot=Math.round(((a+540)%360)-180);posEl(e);drawDSel();return}
    const [dx,dy]=D[kind];const th=(o0.rot||0)*Math.PI/180;const gx=(v.clientX-sx)/k,gy=(v.clientY-sy)/k;const lx=gx*Math.cos(th)+gy*Math.sin(th),ly=-gx*Math.sin(th)+gy*Math.cos(th);
    let w=o0.w+dx*lx,h=o0.h+dy*ly;const corner=dx&&dy;if((keep!==v.shiftKey)&&corner){const s=Math.max(w/o0.w,h/o0.h);w=o0.w*s;h=o0.h*s}
    w=Math.max(20,w);h=Math.max(20,h);const ddx=dx?dx*(w-o0.w)/2:0,ddy=dy?dy*(h-o0.h)/2:0;const shx=ddx*Math.cos(th)-ddy*Math.sin(th),shy=ddx*Math.sin(th)+ddy*Math.cos(th);
    e.w=Math.round(w);e.h=Math.round(h);e.x=Math.round(o0.x+o0.w/2+shx-w/2);e.y=Math.round(o0.y+o0.h/2+shy-h/2);posEl(e);drawDSel()};
  const up=()=>{document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',up);deckDirty()};
  document.addEventListener('pointermove',mv);document.addEventListener('pointerup',up)}
function startTextEdit(id,ev){const e=elById(id);if(!e||e.type==='img')return;DK.sel=[id];DK.editing=id;drawDSel();
  const node=qs(`#dstage .se[data-id="${id}"]`),t=qs('.tx',node);t.contentEditable=true;t.spellcheck=true;t.focus();
  let r=null;if(ev&&document.caretRangeFromPoint){r=document.caretRangeFromPoint(ev.clientX,ev.clientY);if(r&&!t.contains(r.startContainer))r=null}
  if(!r){r=document.createRange();r.selectNodeContents(t);r.collapse(false)}getSelection().removeAllRanges();getSelection().addRange(r);
  t.oninput=()=>{e.html=t.innerHTML.replace(/ contenteditable="[^"]*"/g,'');t.classList.toggle('empty',isEmptyHTML(e.html));deckDirty()};
  t.onkeydown=k=>{if(k.key==='Escape'){k.preventDefault();endTextEdit();drawDSel()}k.stopPropagation()};snap()}
function endTextEdit(){if(!DK.editing)return;const node=qs(`#dstage .se[data-id="${DK.editing}"] .tx`);if(node){node.contentEditable=false;const e=elById(DK.editing);if(e){e.html=node.innerHTML;if(isEmptyHTML(e.html)&&e.html.length<40&&!/<li/.test(e.html))e.html=''}}DK.editing=null;deckDirty()}
/* apply a text command either to the edited selection or to the whole selected element(s) */
function txCmd(fn,wholeProp){const ids=DK.editing?[DK.editing]:DK.sel.filter(id=>{const e=elById(id);return e&&e.type!=='img'});if(!ids.length)return toast('Önce bir metin kutusu seç');
  if(DK.editing){const t=qs(`#dstage .se[data-id="${DK.editing}"] .tx`);fn(t,true);const e=elById(DK.editing);e.html=t.innerHTML;deckDirty();return}
  snap();ids.forEach(id=>{const e=elById(id);if(wholeProp){wholeProp(e);return}const t=qs(`#dstage .se[data-id="${id}"] .tx`);if(!t)return;t.contentEditable=true;const r=document.createRange();r.selectNodeContents(t);getSelection().removeAllRanges();getSelection().addRange(r);
    fn(t,false);e.html=t.innerHTML;t.contentEditable=false});getSelection().removeAllRanges();renderStage();deckDirty()}
function dExec(cmd,val){txCmd(()=>{document.execCommand('styleWithCSS',false,true);document.execCommand(cmd,false,val)})}
function dSize(px){txCmd(t=>{document.execCommand('styleWithCSS',false,false);document.execCommand('fontSize',false,'7');document.execCommand('styleWithCSS',false,true);qsa('font[size="7"]',t).forEach(f=>{f.removeAttribute('size');f.style.fontSize=px+'px'});qsa('span[style*="xxx-large"]',t).forEach(s=>s.style.fontSize=px+'px')},e=>{e.fs=px;e.html=(e.html||'').replace(/font-size:[^;"]+;?/g,'')})}

/* ---------- slide ops ---------- */
function addSlide(layout,after=DK.cur){snap();const s=blankSlide(layout,dH());DK.n.slides.splice(after+1,0,s);DK.cur=after+1;DK.sel=[];renderDeck();deckDirty()}
function dupSlide(i=DK.cur){snap();const c=JSON.parse(JSON.stringify(DK.n.slides[i]));c.id=uid();c.els.forEach(e=>e.id=uid());DK.n.slides.splice(i+1,0,c);DK.cur=i+1;renderDeck();deckDirty()}
function delSlide(i=DK.cur){if(DK.n.slides.length<=1)return toast('Sunumda en az bir slayt kalmalı');snap();DK.n.slides.splice(i,1);DK.cur=Math.min(i,DK.n.slides.length-1);DK.sel=[];renderDeck();deckDirty();toast('Slayt silindi','Geri al',undoDeck)}
function applyLayout(layout){snap();const s=curSlide();const fresh=(LAYOUTS.find(l=>l[0]===layout)||LAYOUTS[1])[2](dH());
  // keep existing text by role order
  const old=s.els.filter(e=>e.type==='text');fresh.forEach(f=>{if(f.type!=='text')return;const i=old.findIndex(o=>o.role===f.role&&!isEmptyHTML(o.html));if(i>=0){f.html=old[i].html;old.splice(i,1)}});
  s.els=[...fresh,...s.els.filter(e=>e.type!=='text'&&!fresh.some(f=>f.type===e.type&&f.src===null)),...old.filter(o=>!isEmptyHTML(o.html))];s.layout=layout;DK.sel=[];renderStage();renderThumb(DK.cur);deckDirty()}
function layoutGallery(onPick){const d=document.createElement('div');d.className='lgal';const H=dH();
  d.innerHTML=`<div class="mh">Slayt düzeni</div><div class="lgrid">${LAYOUTS.map(([k,l,f])=>`<div class="lt" data-k="${k}"><div class="frm" style="aspect-ratio:1600/${H}"><div class="stg">${deckSlideHTML({layout:k,els:f(H),bg:null},{edit:true,H})}</div></div><span>${l}</span></div>`).join('')}</div>`;
  qsa('.lt',d).forEach(t=>t.onclick=()=>{closePop();onPick(t.dataset.k)});return d}
function layoutMenu(anchor,onPick){const p=pop(anchor,layoutGallery(onPick));qsa('.frm',p).forEach(f=>qs('.stg',f).style.transform=`scale(${f.clientWidth/1600})`)}
function slideMenu(anchor,i){const s=DK.n.slides[i];menu(anchor,[{l:'Yeni slayt',i:'plus',k:'Ctrl+M',fn:()=>layoutMenu(anchor,l=>addSlide(l,i))},{l:'Slaytı çoğalt',i:'copy',fn:()=>dupSlide(i)},{l:s.hidden?'Slaytı göster':'Slaytı gizle',i:'focus',fn:()=>{snap();s.hidden=!s.hidden;renderThumbs();dstatus();deckDirty()}},'-',{l:'Slaytı sil',i:'trash',danger:1,fn:()=>delSlide(i)}])}
function elMenu(anchor){menu(anchor,[{l:'Kes',k:'Ctrl+X',fn:()=>clipEls(true)},{l:'Kopyala',i:'copy',k:'Ctrl+C',fn:()=>clipEls(false)},{l:'Yapıştır',k:'Ctrl+V',fn:pasteEls},{l:'Çoğalt',k:'Ctrl+D',fn:dupEls},'-',
  {l:'Öne getir',i:'front',fn:()=>zEls(1)},{l:'Arkaya gönder',i:'back',fn:()=>zEls(-1)},{l:'Animasyon ekle…',i:'sparkle',fn:()=>deckTab('danim')},'-',{l:'Sil',i:'trash',danger:1,k:'Del',fn:delEls}])}
function delEls(){if(!DK.sel.length)return;snap();curSlide().els=curSlide().els.filter(e=>!DK.sel.includes(e.id));DK.sel=[];renderStage();deckDirty()}
function dupEls(){if(!DK.sel.length)return;snap();const n=[];DK.sel.forEach(id=>{const c=JSON.parse(JSON.stringify(elById(id)));c.id=uid();c.x+=30;c.y+=30;curSlide().els.push(c);n.push(c.id)});DK.sel=n;renderStage();deckDirty()}
function clipEls(cut){if(!DK.sel.length)return;DK.clip=DK.sel.map(id=>JSON.parse(JSON.stringify(elById(id))));if(cut)delEls();toast(cut?'Kesildi':'Kopyalandı')}
function pasteEls(){if(!DK.clip)return;snap();const n=[];DK.clip.forEach(c0=>{const c=JSON.parse(JSON.stringify(c0));c.id=uid();c.x+=24;c.y+=24;curSlide().els.push(c);n.push(c.id)});DK.sel=n;renderStage();deckDirty()}
function zEls(d){snap();const els=curSlide().els;const zs=els.map(e=>e.z||0);DK.sel.forEach(id=>{elById(id).z=d>0?Math.max(...zs)+1:Math.min(...zs)-1});renderStage();deckDirty()}
function alignEls(how){snap();const H=dH();DK.sel.forEach(id=>{const e=elById(id);if(how==='l')e.x=0;if(how==='c')e.x=Math.round(800-e.w/2);if(how==='r')e.x=1600-e.w;if(how==='t')e.y=0;if(how==='m')e.y=Math.round(H/2-e.h/2);if(how==='b')e.y=H-e.h});renderStage();deckDirty()}

/* ---------- inserts ---------- */
function insertEl(e){snap();e.id=uid();e.z=Math.max(0,...curSlide().els.map(x=>x.z||0))+1;curSlide().els.push(e);DK.sel=[e.id];renderStage();deckDirty();return e}
function addSlideText(){const H=dH();const e=insertEl(stx('body',500,H/2-60,600,120,{fs:34,ph:'Metin',valign:'top'}));setTimeout(()=>startTextEdit(e.id),20)}
function pickSlideImage(target){const f=$('fImg');const old=f.onchange;f.onchange=async ev=>{const files=[...ev.target.files];ev.target.value='';f.onchange=old;if(!files.length)return;const r=await readImg(files[0],2400);if(!r)return toast('Görsel okunamadı');
    if(target){snap();target.src=r.src;renderStage();deckDirty();return}
    const H=dH();let w=Math.min(900,r.w),h=w*r.h/r.w;if(h>H*.75){h=H*.75;w=h*r.w/r.h}insertEl({type:'img',src:r.src,x:Math.round(800-w/2),y:Math.round(H/2-h/2),w:Math.round(w),h:Math.round(h),rot:0,fit:'cover',radius:12})};f.click()}
function addShape(shape){const H=dH();const w=shape==='line'?400:shape==='arrow'?340:300,h=shape==='line'?40:shape==='arrow'?180:300;insertEl({type:'shape',shape,x:Math.round(800-w/2),y:Math.round(H/2-h/2),w,h,rot:0,html:''})}
function addTableEl(r,c){const H=dH();let h='<table style="width:100%;border-collapse:collapse">';for(let i=0;i<r;i++){h+='<tr>';for(let j=0;j<c;j++)h+=`<td style="border:2px solid rgba(127,127,127,.45);padding:10px 16px;${i===0?'font-weight:700;background:rgba(127,127,127,.12)':''}">${i===0?'Başlık '+(j+1):'<br>'}</td>`;h+='</tr>'}
  insertEl(stx('body',200,H/2-40*r,1200,80*r,{fs:28,html:h+'</table>'}))}

/* ---------- ribbon ---------- */
function deckRibbonHTML(){const B=(id,ic,l,tip='')=>`<button class="tb big" id="${id}" ${tip?`data-tip="${tip}"`:''}>${icon(ic)}${l}</button>`;
 return `<div class="tabs"><button class="tab on" data-dt="dhome">Giriş</button><button class="tab" data-dt="dins">Ekle</button><button class="tab" data-dt="ddes">Tasarım</button><button class="tab" data-dt="dtr">Geçişler</button><button class="tab" data-dt="danim">Animasyonlar</button><button class="tab" data-dt="dshow">Slayt Gösterisi</button><span class="sp"></span><span class="hint">Çift tık: düzenle · Ctrl+M: yeni slayt · F5: sun</span></div>
 <div class="panel on" data-dp="dhome"><div class="g"><button class="tb big split" id="dNew">${icon('plus')}Yeni slayt</button><button class="tb big" id="dLayout">${icon('template')}Düzen</button><button class="tb big" id="dDup">${icon('copy')}Çoğalt</button><button class="tb big" id="dDel">${icon('trash')}Sil</button></div>
  <div class="g col"><div style="display:flex;gap:4px"><div class="combo" id="dFont" style="width:150px"><span class="v">Yazı tipi</span>${icon('chev','i dd')}</div><div class="sizebox"><button id="dSzD">−</button><input id="dSz" value="34"><button id="dSzU">+</button></div></div>
   <div style="display:flex;gap:2px"><button class="tb" data-dx="bold"><b>B</b></button><button class="tb" data-dx="italic"><i style="font-family:Georgia">I</i></button><button class="tb" data-dx="underline"><u>U</u></button><button class="tb" data-dx="strikeThrough"><s>S</s></button><button class="tb col-btn" id="dColor"><span class="gl" style="font-size:15px">A</span><span class="sw" id="dColorSw" style="background:#e93a6a"></span></button><button class="tb" id="dHi">${icon('marker')}</button><button class="tb" id="dFx">${icon('sparkle')}</button></div></div>
  <div class="g col"><div style="display:flex;gap:2px"><button class="tb" data-al="left">${icon('aleft')}</button><button class="tb" data-al="center">${icon('acenter')}</button><button class="tb" data-al="right">${icon('aright')}</button><button class="tb" data-al="justify">${icon('ajust')}</button></div>
   <div style="display:flex;gap:2px"><button class="tb" data-dx="insertUnorderedList">${icon('ul')}</button><button class="tb" data-dx="insertOrderedList">${icon('ol')}</button><button class="tb" data-va="top" data-tip="Üste yasla">⤒</button><button class="tb" data-va="middle" data-tip="Ortaya yasla">↕</button><button class="tb" data-va="bottom" data-tip="Alta yasla">⤓</button></div></div>
  <div class="g">${B('dArr','front','Yerleştir')}${B('dFill','drop','Dolgu')}${B('dClear','eraser','Temizle')}</div></div>
 <div class="panel" data-dp="dins"><div class="g">${B('dText','textbox','Metin kutusu')}${B('dImg','image','Görsel')}${B('dShape','shapes','Şekil')}${B('dTable','table','Tablo')}${B('dSym','smile','Simge')}</div>
  <div class="g">${B('dNewL','slides','Yeni slayt')}</div></div>
 <div class="panel" data-dp="ddes"><div class="g dgal" id="dThemes"></div><div class="g col"><div class="seg" id="dRatio"><button data-r="16:9">16:9</button><button data-r="4:3">4:3</button></div><button class="tb" id="dBg" style="justify-content:flex-start">${icon('drop')} Arka plan</button><label class="chk" style="font-size:12px"><input type="checkbox" id="dNums"> Slayt numaraları</label></div></div>
 <div class="panel" data-dp="dtr"><div class="g dgal" id="dTrans"></div><div class="g col"><button class="tb" id="dTrPrev" style="justify-content:flex-start">${icon('play')} Önizle</button><button class="tb" id="dTrAll" style="justify-content:flex-start">${icon('copy')} Tümüne uygula</button></div></div>
 <div class="panel" data-dp="danim"><div class="g dgal" id="dAnims"></div><div class="g col"><select id="dTrig"><option value="click">Tıklayınca</option><option value="with">Öncekiyle birlikte</option><option value="after">Öncekinden sonra</option></select><select id="dDur"><option value="400">Hızlı</option><option value="650">Normal</option><option value="1100">Yavaş</option></select></div>
  <div class="g col"><button class="tb" id="dAnPane" style="justify-content:flex-start">${icon('list')} Animasyon bölmesi</button><button class="tb" id="dAnPrev" style="justify-content:flex-start">${icon('play')} Önizle</button></div></div>
 <div class="panel" data-dp="dshow"><div class="g">${B('dsStart','play','Baştan başlat','F5')}${B('dsHere','playhere','Geçerli slayttan','Shift+F5')}${B('dsMode','slides','Ekran ve sunucu görünümü')}${B('dsRe','history','Prova')}</div>
  <div class="g">${B('dsPptx','ppt','PowerPoint olarak indir')}${B('dsPdf','page','PDF olarak kaydet')}</div><div class="g"><label class="chk" style="font-size:12px"><input type="checkbox" id="dsAuto"> Otomatik ilerle</label><select id="dsSec"><option value="4">4 sn</option><option value="6">6 sn</option><option value="10">10 sn</option><option value="15">15 sn</option></select></div></div>`}
function deckTab(t){DK.tab=t;qsa('#dribbon .tab').forEach(x=>x.classList.toggle('on',x.dataset.dt===t));qsa('#dribbon .panel').forEach(p=>p.classList.toggle('on',p.dataset.dp===t));
  if(t==='ddes')renderThemeGal();if(t==='dtr')renderTransGal();if(t==='danim')renderAnimGal();$('danimPane').classList.toggle('hide',!(t==='danim'&&DK.animPane!==false));renderStage();setTimeout(scaleThumbs,0)}
function renderThemeGal(){const G=$('dThemes'),H=dH();const s=DK.n.slides[0];
  G.innerHTML=Object.entries(DECKS).map(([k,t])=>`<div class="dgi ${dd().theme===k?'on':''}" data-k="${k}" title="${esc(t.n)}"><div class="frm" style="aspect-ratio:1600/${H}"><div class="stg">${deckSlideHTML({layout:'title',els:[stx('title',140,H*.5-170,1320,190,{fs:120,html:'Aa',valign:'bottom'}),stx('sub',140,H*.5+40,1320,90,{fs:44,html:t.n})],bg:null},{deck:{...dd(),theme:k},H})}</div></div></div>`).join('');
  qsa('.dgi',G).forEach(d=>{qs('.stg',d).style.transform=`scale(${qs('.frm',d).clientWidth/1600||0.075})`;d.onclick=()=>{snap();dd().theme=d.dataset.k;renderDeck();renderThemeGal();deckDirty()}});
  qsa('#dRatio button').forEach(b=>b.classList.toggle('on',b.dataset.r===dd().ratio));$('dNums').checked=dd().nums!==false}
function renderTransGal(){const G=$('dTrans');const cur=curSlide().trans||dd().trans;
  G.innerHTML=TRANS.filter(t=>t[0]!=='random').map(([k,l])=>`<div class="tr ${cur===k?'on':''}" data-k="${k}"><div class="demo"><i class="b"></i><i></i></div>${l}</div>`).join('');
  qsa('.tr',G).forEach(e=>{e.onclick=()=>{snap();curSlide().trans=e.dataset.k;renderTransGal();renderThumbs();dstatus();deckDirty();previewTrans()};
    e.onmouseenter=()=>{const [b,a]=qsa('.demo i',e);const df=animDefs(e.dataset.k,1);if(df){a.animate(df[0],{duration:650,easing:'cubic-bezier(.65,0,.35,1)'});b.animate(df[1],{duration:650,easing:'cubic-bezier(.65,0,.35,1)'})}}})}
function renderAnimGal(){const G=$('dAnims');const e=DK.sel.length===1?elById(DK.sel[0]):null;const cur=e?.anim?.type||'none';
  G.innerHTML=ANIMS2.map(([k,l])=>`<div class="tr ${cur===k?'on':''} ${e?'':'dis'}" data-k="${k}"><div class="demo"><i></i></div>${l}</div>`).join('');
  qsa('.tr',G).forEach(t=>{t.onclick=()=>{if(!DK.sel.length)return toast('Önce slayttan bir öğe seç');snap();const s=curSlide();let ord=Math.max(0,...s.els.map(x=>x.anim?.ord||0));
      DK.sel.forEach(id=>{const el=elById(id);if(t.dataset.k==='none'){el.anim=null;return}el.anim=Object.assign({ord:el.anim?.ord||++ord,trig:$('dTrig').value,dur:+$('dDur').value},el.anim||{},{type:t.dataset.k})});
      renumberAnims();renderAnimGal();renderStage();deckDirty();previewAnim(DK.sel)};
    t.onmouseenter=()=>{const i=qs('.demo i',t);const kf=ANIMKF[t.dataset.k];if(kf)i.animate(kf,{duration:600,easing:'cubic-bezier(.2,.75,.25,1)'})}});
  if(e&&e.anim){$('dTrig').value=e.anim.trig||'click';$('dDur').value=String(e.anim.dur||650)}}
function renumberAnims(){const els=curSlide().els.filter(e=>e.anim&&e.anim.type!=='none').sort((a,b)=>(a.anim.ord||0)-(b.anim.ord||0));els.forEach((e,i)=>e.anim.ord=i+1)}
function renderAnimPane(){const P=$('danimList');if(!P)return;const els=curSlide().els.filter(e=>e.anim&&e.anim.type!=='none').sort((a,b)=>a.anim.ord-b.anim.ord);
  const name=e=>{const d=document.createElement('div');d.innerHTML=e.html||'';return(d.textContent.trim()||({img:'Görsel',shape:'Şekil'}[e.type])||e.ph||'Metin').slice(0,28)};
  P.innerHTML=els.length?els.map((e,i)=>`<div class="ap ${DK.sel.includes(e.id)?'on':''}" data-id="${e.id}"><b>${i+1}</b><span class="nm">${esc(name(e))}<small>${(ANIMS2.find(a=>a[0]===e.anim.type)||[])[1]} · ${{click:'tıklayınca',with:'öncekiyle',after:'öncekinden sonra'}[e.anim.trig||'click']}</small></span><button data-mv="-1">▲</button><button data-mv="1">▼</button><button data-rm="1">✕</button></div>`).join(''):'<div class="apempty">Bu slaytta animasyon yok. Bir öğe seçip üstten animasyon seç.</div>';
  qsa('.ap',P).forEach(r=>{const id=r.dataset.id;r.onclick=ev=>{if(ev.target.closest('button'))return;DK.sel=[id];drawDSel();renderAnimGal();renderAnimPane()};
    qsa('[data-mv]',r).forEach(b=>b.onclick=()=>{snap();const i=els.findIndex(e=>e.id===id),j=i+(+b.dataset.mv);if(j<0||j>=els.length)return;const t=els[i].anim.ord;els[i].anim.ord=els[j].anim.ord;els[j].anim.ord=t;renderStage();deckDirty()});
    qs('[data-rm]',r).onclick=()=>{snap();elById(id).anim=null;renumberAnims();renderStage();deckDirty()}})}
function previewAnim(ids){const nodes=(ids&&ids.length?ids:curSlide().els.filter(e=>e.anim&&e.anim.type!=='none').sort((a,b)=>a.anim.ord-b.anim.ord).map(e=>e.id)).map(id=>[qs(`#dstage .se[data-id="${id}"]`),elById(id)]).filter(x=>x[0]&&x[1].anim);
  let t=0;nodes.forEach(([n,e],i)=>{if(e.anim.trig!=='with'&&i>0)t+=Math.min(e.anim.dur||650,500);n.animate(ANIMKF[e.anim.type]||ANIMKF.fade,{duration:e.anim.dur||650,delay:t+(e.anim.delay||0),easing:'cubic-bezier(.2,.75,.25,1)',fill:'backwards'})})}
function previewTrans(){const box=$('dstagebox');const prevI=Math.max(0,DK.cur-1);const H=dH();if(DK.cur===0)return;
  const ov=document.createElement('div');ov.className='trprev';ov.innerHTML=`<div class="stg" style="width:1600px;height:${H}px;transform:scale(${DK.k});transform-origin:0 0;position:absolute;perspective:2400px">${deckSlideHTML(DK.n.slides[prevI],{H})}${deckSlideHTML(curSlide(),{H})}</div>`;box.appendChild(ov);
  const [a,b]=qsa('.slide',ov);a.style.position=b.style.position='absolute';runTrans(b,a,curSlide().trans||dd().trans,1).then(()=>setTimeout(()=>ov.remove(),250))}
function syncDeckRibbon(){if(!DK.n)return;const e=DK.sel.length?elById(DK.sel[0]):null;const T=T_();
  const fc=qs('#dFont .v');if(fc){const f=e&&e.type!=='img'?(e.font||(e.role==='title'?T.hf:T.bf)):'Yazı tipi';fc.textContent=f;fc.style.fontFamily=`'${f}'`}
  if(e&&e.fs&&document.activeElement!==$('dSz'))$('dSz').value=e.fs;
  qsa('[data-al]').forEach(b=>b.classList.toggle('on',!!e&&(e.align||'left')===b.dataset.al));qsa('[data-va]').forEach(b=>b.classList.toggle('on',!!e&&(e.valign||'top')===b.dataset.va));
  if(DK.tab==='danim'){renderAnimGal();renderAnimPane()}}
function wireDeck(){
  $('dribbon').innerHTML=deckRibbonHTML();hydrate($('dribbon'));
  const R=$('dribbon');R.addEventListener('mousedown',e=>{if(e.target.closest('button,.combo,.dgi,.tr'))e.preventDefault()});
  qsa('#dribbon .tab').forEach(t=>t.onclick=()=>deckTab(t.dataset.dt));
  $('dNew').onclick=e=>layoutMenu(e.currentTarget,l=>addSlide(l));$('dNewL').onclick=e=>layoutMenu(e.currentTarget,l=>addSlide(l));$('dLayout').onclick=e=>layoutMenu(e.currentTarget,applyLayout);
  $('dDup').onclick=()=>dupSlide();$('dDel').onclick=()=>DK.sel.length?delEls():delSlide();
  $('dFont').onclick=e=>fontPop(e.currentTarget,f=>{txCmd(()=>{document.execCommand('styleWithCSS',false,true);document.execCommand('fontName',false,`'${f}'`)},el=>{el.font=f;el.html=(el.html||'').replace(/font-family:[^;"]+;?/g,'')});syncDeckRibbon()},qs('#dFont .v').textContent);
  const sz=v=>{v=clamp(Math.round(v),8,400);$('dSz').value=v;dSize(v)};
  $('dSzD').onclick=()=>sz((+$('dSz').value||34)-4);$('dSzU').onclick=()=>sz((+$('dSz').value||34)+4);$('dSz').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();sz(+$('dSz').value)}e.stopPropagation()};
  qsa('[data-dx]',R).forEach(b=>b.onclick=()=>dExec(b.dataset.dx));
  qsa('[data-al]',R).forEach(b=>b.onclick=()=>{if(!DK.sel.length)return;snap();DK.sel.forEach(id=>{const e=elById(id);if(e)e.align=b.dataset.al});const keep=DK.editing;renderStage();if(keep)startTextEdit(keep);deckDirty()});
  qsa('[data-va]',R).forEach(b=>b.onclick=()=>{if(!DK.sel.length)return;snap();DK.sel.forEach(id=>{const e=elById(id);if(e)e.valign=b.dataset.va});renderStage();deckDirty()});
  $('dColor').onclick=e=>colorPop(e.currentTarget,PALETTE,c=>{$('dColorSw').style.background=c||'#e93a6a';txCmd(()=>{document.execCommand('styleWithCSS',false,true);document.execCommand('foreColor',false,c||'inherit')},el=>{el.color=c;el.html=(el.html||'').replace(/color:[^;"]+;?/g,'')})},'Yazı rengi');
  $('dHi').onclick=e=>colorPop(e.currentTarget,HILITES,c=>txCmd(()=>{document.execCommand('styleWithCSS',false,true);document.execCommand('hiliteColor',false,c||'transparent')}),'Vurgulayıcı');
  $('dFx').onclick=e=>menu(e.currentTarget,FX.map(([l,css])=>({html:`<span style="${css}">${l}</span>`,fn:()=>txCmd(t=>{const s=getSelection();if(!s.rangeCount)return;const r=s.getRangeAt(0);const sp=document.createElement('span');sp.setAttribute('style',css);sp.appendChild(r.extractContents());r.insertNode(sp)})})));
  $('dArr').onclick=e=>menu(e.currentTarget,[{l:'Öne getir',i:'front',fn:()=>zEls(1)},{l:'Arkaya gönder',i:'back',fn:()=>zEls(-1)},'-',{h:'Slayta hizala'},{l:'Sola',i:'aleft',fn:()=>alignEls('l')},{l:'Ortala (yatay)',i:'acenter',fn:()=>alignEls('c')},{l:'Sağa',i:'aright',fn:()=>alignEls('r')},{l:'Üste',fn:()=>alignEls('t')},{l:'Ortala (dikey)',fn:()=>alignEls('m')},{l:'Alta',fn:()=>alignEls('b')}]);
  $('dFill').onclick=e=>{const el=DK.sel.length?elById(DK.sel[0]):null;if(!el)return toast('Önce bir öğe seç');colorPop(e.currentTarget,PALETTE.concat(HILITES),c=>{snap();DK.sel.forEach(id=>{const x=elById(id);if(x.type==='shape')x.fill=c||'none';else if(x.type==='text')x.fill=c;else{x.border=c?6:0;x.bcolor=c}});renderStage();deckDirty()},el.type==='img'?'Çerçeve rengi':'Dolgu rengi')};
  $('dClear').onclick=()=>txCmd(()=>document.execCommand('removeFormat'),el=>{el.font=null;el.color=null;el.fill=null;const d=document.createElement('div');d.innerHTML=el.html||'';qsa('[style]',d).forEach(x=>x.removeAttribute('style'));el.html=d.innerHTML});
  $('dText').onclick=addSlideText;$('dImg').onclick=()=>pickSlideImage(null);
  $('dShape').onclick=e=>{const d=document.createElement('div');d.innerHTML=`<div class="mh">Şekil ekle</div><div class="tiles" style="grid-template-columns:repeat(4,64px);padding:4px">${SHAPES.map(([k,l])=>`<div class="tile" data-k="${k}" title="${l}" style="padding:8px"><div style="height:34px">${shapeSVG({shape:k,fill:'color-mix(in srgb,var(--accent) 22%,transparent)',stroke:'var(--accent)',sw:2})}</div></div>`).join('')}</div>`;qsa('[data-k]',d).forEach(t=>t.onclick=()=>{closePop();addShape(t.dataset.k)});pop(e.currentTarget,d)};
  $('dTable').onclick=e=>{const d=document.createElement('div');d.innerHTML=`<div class="mh">Tablo</div><div class="gridpick">${'<i></i>'.repeat(60)}</div><div class="gplab">1 × 1</div>`;const cs=qsa('.gridpick i',d);let R2=1,C=1;
    cs.forEach((c,i)=>{c.onmouseenter=()=>{R2=Math.floor(i/10)+1;C=i%10+1;cs.forEach((x,j)=>x.classList.toggle('h',Math.floor(j/10)<R2&&j%10<C));qs('.gplab',d).textContent=`${R2} × ${C}`};c.onclick=()=>{closePop();addTableEl(R2,C)}});pop(e.currentTarget,d)};
  $('dSym').onclick=e=>{const d=document.createElement('div');d.innerHTML=`<div class="mh">Simge & emoji</div><div class="symgrid">${SYMBOLS.map(s=>`<button>${s}</button>`).join('')}</div>`;qsa('button',d).forEach(b=>b.onclick=()=>{closePop();if(DK.editing){document.execCommand('insertText',false,b.textContent);const el=elById(DK.editing);el.html=qs(`#dstage .se[data-id="${DK.editing}"] .tx`).innerHTML;deckDirty()}else{const H=dH();insertEl(stx('body',700,H/2-100,200,200,{fs:140,html:b.textContent,align:'center',valign:'middle'}))}});pop(e.currentTarget,d)};
  qsa('#dRatio button').forEach(b=>b.onclick=()=>{if(dd().ratio===b.dataset.r)return;snap();const old=dH();dd().ratio=b.dataset.r;const nw=dH();DK.n.slides.forEach(s=>s.els.forEach(e=>{e.y=Math.round(e.y*nw/old);e.h=Math.round(e.h*nw/old)}));renderDeck();renderThemeGal();deckDirty()});
  $('dNums').onchange=e=>{dd().nums=e.target.checked;renderStage();deckDirty()};
  $('dBg').onclick=e=>menu(e.currentTarget,[{l:'Düz renk…',i:'drop',fn:()=>colorPop($('dBg'),PALETTE,c=>{snap();curSlide().bg=c?{color:c}:null;renderStage();renderThumb(DK.cur);deckDirty()},'Arka plan rengi')},
    {l:'Görsel…',i:'image',fn:()=>{const f=$('fImg');const old=f.onchange;f.onchange=async ev=>{const fl=ev.target.files[0];ev.target.value='';f.onchange=old;if(!fl)return;const r=await readImg(fl,2400);snap();curSlide().bg={img:r.src};renderStage();renderThumb(DK.cur);deckDirty()};f.click()}},
    {l:'Tema arka planına dön',i:'restore',fn:()=>{snap();curSlide().bg=null;renderStage();renderThumb(DK.cur);deckDirty()}},{l:'Bu arka planı tüm slaytlara uygula',i:'copy',fn:()=>{snap();const b=curSlide().bg;DK.n.slides.forEach(s=>s.bg=b?{...b}:null);renderDeck();deckDirty()}}]);
  $('dTrPrev').onclick=previewTrans;$('dTrAll').onclick=()=>{snap();const t=curSlide().trans||dd().trans;dd().trans=t;DK.n.slides.forEach(s=>s.trans=null);renderTransGal();renderThumbs();deckDirty();toast('Geçiş tüm slaytlara uygulandı')};
  $('dTrig').onchange=()=>{snap();DK.sel.forEach(id=>{const e=elById(id);if(e&&e.anim)e.anim.trig=$('dTrig').value});renderAnimPane();deckDirty()};
  $('dDur').onchange=()=>{snap();DK.sel.forEach(id=>{const e=elById(id);if(e&&e.anim)e.anim.dur=+$('dDur').value});deckDirty()};
  $('dAnPane').onclick=()=>{DK.animPane=DK.animPane===false;$('danimPane').classList.toggle('hide',DK.animPane===false)};$('dAnPrev').onclick=()=>previewAnim();$('danimPlay').onclick=()=>previewAnim();
  $('dsStart').onclick=()=>startShow(false);$('dsHere').onclick=()=>startShow(true);$('dsMode').onclick=()=>startDialog(false);$('dsRe').onclick=()=>beginShow('rehearse');
  $('dsPptx').onclick=()=>exportDeckPPTX();$('dsPdf').onclick=()=>printDeck();
  $('dsAuto').onchange=e=>{dd().autoAdvance=e.target.checked;deckDirty()};$('dsSec').onchange=e=>{dd().autoSec=+e.target.value;deckDirty()};
  $('dnotesIn').oninput=e=>{curSlide().notes=e.target.value;deckDirty()};$('dnotesIn').onkeydown=e=>e.stopPropagation();
  $('dcanvas').addEventListener('pointerdown',e=>{if(e.target.closest('.se,.dsel'))return;endTextEdit();if(DK.sel.length){DK.sel=[];drawDSel()}});
  new ResizeObserver(()=>{if(DK.n){const k=fitStageK();if(Math.abs(k-DK.k)>.001)renderStage();scaleThumbs()}}).observe($('dcanvas'));
  document.addEventListener('keydown',deckKey,true);
  // drop images onto slide
  const C=$('dcanvas');C.addEventListener('dragover',e=>{if([...e.dataTransfer.types].includes('Files'))e.preventDefault()});
  C.addEventListener('drop',async e=>{const f=[...e.dataTransfer.files].filter(x=>x.type.startsWith('image/'));if(!f.length)return;e.preventDefault();for(const fl of f){const r=await readImg(fl,2400);const H=dH();let w=Math.min(800,r.w),h=w*r.h/r.w;if(h>H*.7){h=H*.7;w=h*r.w/r.h}insertEl({type:'img',src:r.src,x:Math.round(800-w/2),y:Math.round(H/2-h/2),w:Math.round(w),h:Math.round(h),rot:0,fit:'cover',radius:12})}});
  C.addEventListener('paste',e=>{});document.addEventListener('paste',async e=>{if(!isDeck(cur())||DK.editing)return;const f=[...(e.clipboardData?.items||[])].filter(i=>i.kind==='file'&&i.type.startsWith('image/')).map(i=>i.getAsFile());if(!f.length)return;e.preventDefault();const r=await readImg(f[0],2400);const H=dH();let w=Math.min(800,r.w),h=w*r.h/r.w;if(h>H*.7){h=H*.7;w=h*r.w/r.h}insertEl({type:'img',src:r.src,x:Math.round(800-w/2),y:Math.round(H/2-h/2),w:Math.round(w),h:Math.round(h),rot:0,fit:'cover',radius:12})});
}
function deckKey(e){if(!isDeck(cur())||SH.active||qs('.scrim'))return;if(e.target.closest&&e.target.closest('input,textarea,select'))return;const k=e.key,c=e.ctrlKey||e.metaKey;
  if(DK.editing){if(k==='Escape'){e.preventDefault();endTextEdit();drawDSel()}return}
  const h=()=>{e.preventDefault();e.stopPropagation()};
  if(c&&k.toLowerCase()==='z'){h();e.shiftKey?redoDeck():undoDeck()}else if(c&&k.toLowerCase()==='y'){h();redoDeck()}
  else if(c&&k.toLowerCase()==='m'){h();addSlide(curSlide().layout==='title'?'content':curSlide().layout)}
  else if(c&&k.toLowerCase()==='d'){h();DK.sel.length?dupEls():dupSlide()}else if(c&&k.toLowerCase()==='c'&&DK.sel.length){h();clipEls(false)}else if(c&&k.toLowerCase()==='x'&&DK.sel.length){h();clipEls(true)}else if(c&&k.toLowerCase()==='v'&&DK.clip){h();pasteEls()}
  else if(c&&k.toLowerCase()==='a'){h();DK.sel=curSlide().els.map(x=>x.id);drawDSel()}
  else if((k==='Delete'||k==='Backspace')){h();DK.sel.length?delEls():delSlide()}
  else if(k==='Enter'||k==='F2'){if(DK.sel.length===1){h();startTextEdit(DK.sel[0])}}
  else if(k==='Escape'){if(DK.sel.length){h();DK.sel=[];drawDSel()}}
  else if(k==='PageDown'||(k==='ArrowDown'&&!DK.sel.length)){h();gotoSlide(DK.cur+1)}else if(k==='PageUp'||(k==='ArrowUp'&&!DK.sel.length)){h();gotoSlide(DK.cur-1)}
  else if(k.startsWith('Arrow')&&DK.sel.length){h();const st=e.shiftKey?10:1;const d={ArrowLeft:[-st,0],ArrowRight:[st,0],ArrowUp:[0,-st],ArrowDown:[0,st]}[k];snap();DK.sel.forEach(id=>{const x=elById(id);x.x+=d[0];x.y+=d[1];posEl(x)});drawDSel();deckDirty()}}

/* ---------- new presentation dialog & templates ---------- */
function tS(layout,map,o={}){const H=900;const s=blankSlide(layout,H);const els=s.els;Object.entries(map).forEach(([i,v])=>{if(els[i])els[i].html=v});Object.assign(s,o);return s}
const ul=a=>'<ul>'+a.map(x=>`<li>${x}</li>`).join('')+'</ul>';
const DECK_TPLS=[
 {id:'blank',n:'Boş sunum',d:'Temiz bir başlangıç',deck:{theme:'minimal'},slides:()=>[blankSlide('title')]},
 {id:'project',n:'Proje sunumu',d:'Problem, çözüm, plan',deck:{theme:'gece',trans:'slide'},slides:()=>[
   tS('title',{0:'Proje Adı',1:'Ekip · Tarih'}),tS('content',{0:'Gündem',1:ul(['Problem','Çözümümüz','Nasıl çalışır?','Yol haritası'])}),
   tS('content',{0:'Problem',1:ul(['Kullanıcılar neyle zorlanıyor?','Bugün nasıl çözülüyor?','Neden yetersiz?'])}),
   tS('two',{0:'Çözümümüz',1:ul(['Basit','Hızlı','Erişilebilir']),2:ul(['Ölçülebilir sonuç','Düşük maliyet','Kolay kurulum'])}),
   tS('number',{0:'%40',1:'daha hızlı sonuç — ilk testlerimizde'}),tS('content',{0:'Yol haritası',1:ul(['Ekim — prototip','Kasım — test','Aralık — yayın'])}),tS('section',{0:'Teşekkürler',1:'Sorular?'})]},
 {id:'lesson',n:'Ders sunumu',d:'Konu anlatımı ve özet',deck:{theme:'pastel',trans:'fade'},slides:()=>[
   tS('title',{0:'Konu Başlığı',1:'Ders · Sınıf · Tarih'}),tS('content',{0:'Bugün öğreneceklerimiz',1:ul(['Temel kavramlar','Bir örnek','Kısa özet'])}),
   tS('compare',{0:'Karşılaştırma',1:'Önce',2:ul(['Eski yöntem','Yavaş']),3:'Sonra',4:ul(['Yeni yöntem','Hızlı'])}),tS('quote',{0:'“Öğrenmek, merakla başlar.”',1:'— Anonim'}),tS('content',{0:'Özet',1:ul(['Kavram 1','Kavram 2','Kavram 3'])})]},
 {id:'product',n:'Ürün tanıtımı',d:'Etkileyici bir lansman',deck:{theme:'gunbatimi',trans:'zoom'},slides:()=>[
   tS('title',{0:'Lumen',1:'Işığı yeniden tasarladık.'}),tS('number',{0:'10×',1:'daha uzun pil ömrü'}),tS('two',{0:'Öne çıkanlar',1:ul(['Tek dokunuş','Akıllı zamanlayıcı']),2:ul(['Sessiz çalışma','Geri dönüştürülmüş malzeme'])}),
   tS('quote',{0:'“Masamdaki en güzel şey.”',1:'— İlk kullanıcı'}),tS('section',{0:'Şimdi ön siparişte',1:'lumen.example'})]},
 {id:'report',n:'Kurumsal rapor',d:'Sade ve net',deck:{theme:'kurumsal',trans:'wipe'},slides:()=>[
   tS('title',{0:'Çeyrek Raporu',1:'Q3 · Özet'}),tS('content',{0:'Öne çıkanlar',1:ul(['Gelir hedefin üzerinde','Yeni iki pazar','Müşteri memnuniyeti arttı'])}),tS('number',{0:'%92',1:'müşteri memnuniyeti'}),tS('content',{0:'Sonraki adımlar',1:ul(['Ürün yol haritası','İşe alım planı'])})]},
 {id:'story',n:'Fotoğraf hikâyesi',d:'Görsellerle anlat',deck:{theme:'altin',trans:'cube'},slides:()=>[tS('title',{0:'Bir Yolculuk',1:'Fotoğraflarla'}),tS('imagetext',{0:'İlk gün',1:ul(['Nereden başladık','Kimlerle tanıştık'])}),tS('imagetext',{0:'Yolda',1:ul(['En güzel an','En zor an'])}),tS('section',{0:'Son',1:'Bir sonraki yolculukta görüşmek üzere'})]}];
function newDeckDialog(){const B=document.createElement('div');
  B.innerHTML=`<div class="tplgrid dtpl">${DECK_TPLS.map(t=>`<div class="tpl" data-t="${t.id}"><div class="pv frm" style="padding:0;aspect-ratio:16/9;height:auto"><div class="stg">${deckSlideHTML(t.slides()[0],{deck:Object.assign({theme:'minimal',ratio:'16:9'},t.deck),H:900})}</div></div><div class="nm">${t.n}</div><div class="ds">${t.d}</div></div>`).join('')}</div>
   <div class="fromnote"><span>${icon('notes')} İstersen bir notun <b>başlıklarından</b> taslak da çıkarabilirsin (notun kendisi değişmez).</span><select id="fnSel"><option value="">Not seç…</option>${S.notes.filter(n=>!n.trashed&&!isDeck(n)).map(n=>`<option value="${n.id}">${esc(n.title||'Başlıksız')}</option>`).join('')}</select></div>`;
  const m=modal({title:'Yeni sunum',body:B,wide:true});
  qsa('.tpl',B).forEach(e=>{const f=qs('.frm',e);requestAnimationFrame(()=>qs('.stg',f).style.transform=`scale(${f.clientWidth/1600})`);e.onclick=()=>{m.close();const t=DECK_TPLS.find(x=>x.id===e.dataset.t);newDeck({title:t.id==='blank'?'Başlıksız sunum':t.n,deck:t.deck,slides:t.slides()})}});
  $('fnSel').onchange=e=>{const n=S.notes.find(x=>x.id===e.target.value);if(!n)return;m.close();newDeck({title:(n.title||'Başlıksız')+' — sunum',slides:draftFromNote(n)})}}
function draftFromNote(n){const d=document.createElement('div');d.innerHTML=n.html;const slides=[tS('title',{0:esc(n.title||'Başlıksız'),1:new Date().toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})})];let cur=null;
  for(const k of d.children){if(/^H[12]$/.test(k.tagName)){cur=tS('content',{0:k.innerHTML,1:''});cur.els[1].html='';slides.push(cur);continue}if(!cur)continue;
    const t=k.textContent.trim();if(!t)continue;if(/^(UL|OL)$/.test(k.tagName)){cur.els[1].html+=k.outerHTML}else if(k.classList.contains('notes')||k.classList.contains('callout')&&k.classList.contains('notes'))cur.notes+=t+'\n';else cur.els[1].html+=`<ul><li>${esc(t.slice(0,140))}</li></ul>`}
  slides.forEach(s=>{if(s.els[1]&&!s.els[1].html)s.els[1].html=''});return slides}

/* ---------- export: PDF & PPTX ---------- */
function printDeck(){const n=cur();if(!isDeck(n))return;endTextEdit();const H=dH();let box=$('deckPrint');if(!box){box=document.createElement('div');box.id='deckPrint';document.body.appendChild(box)}
  box.innerHTML=n.slides.filter(s=>!s.hidden).map((s,i)=>`<div class="dpp">${deckSlideHTML(s,{H,num:i+1})}</div>`).join('');
  const st=document.createElement('style');st.textContent=`@page{size:1600px ${H}px;margin:0}`;document.head.appendChild(st);document.body.classList.add('printdeck');
  const done=()=>{removeEventListener('afterprint',done);st.remove();document.body.classList.remove('printdeck');box.innerHTML=''};addEventListener('afterprint',done);setTimeout(()=>window.print(),150)}
const BGCACHE={};
async function slideBgPNG(s,deck){const T=DECKS[deck.theme]||DECKS.minimal;const kind=slideKind(s);const key=deck.theme+'|'+kind+'|'+JSON.stringify(s.bg||null)+'|'+deck.ratio;if(BGCACHE[key])return BGCACHE[key];
  const H=deck.ratio==='4:3'?1200:900;const w=document.createElement('div');w.style.cssText='position:fixed;left:-20000px;top:0;width:1600px;height:'+H+'px';w.innerHTML=deckSlideHTML({...s,els:[]},{deck,H});document.body.appendChild(w);
  try{await document.fonts.ready;const url=await htmlToImage.toJpeg(w.firstElementChild,{pixelRatio:1,quality:.92,cacheBust:false,fontEmbedCSS:''});BGCACHE[key]=url;return url}catch(e){return null}finally{w.remove()}}
function htmlRuns(html,base){const out=[];const d=document.createElement('div');d.innerHTML=html||'';
  const walk=(node,f,para)=>{node.childNodes.forEach(c=>{if(c.nodeType===3){if(c.textContent)para.push({text:c.textContent,options:{...f}});return}if(c.nodeType!==1)return;const t=c.tagName,g={...f};
      if(t==='BR'){para.push({text:'',options:{...f,breakLine:true}});return}
      if(t==='B'||t==='STRONG')g.bold=true;if(t==='I'||t==='EM')g.italic=true;if(t==='U')g.underline={style:'sng'};if(t==='S'||t==='STRIKE')g.strike='sngStrike';
      const st=c.style;if(st){if(+st.fontWeight>=600||st.fontWeight==='bold')g.bold=true;if(st.fontStyle==='italic')g.italic=true;if(st.color){const h=rgbHex(st.color);if(h)g.color=h}if(st.fontSize&&/px/.test(st.fontSize))g.fontSize=Math.round(parseFloat(st.fontSize)*base.k)}
      walk(c,g,para)})};
  const blocks=[];const push=(node,bullet)=>{const p=[];walk(node,{},p);if(!p.length)p.push({text:'',options:{}});p[p.length-1].options.breakLine=true;if(bullet)p[0].options.bullet=bullet;blocks.push(...p)};
  let inline=document.createElement('div');const flush=()=>{if(inline.childNodes.length){push(inline);inline=document.createElement('div')}};
  d.childNodes.forEach(c=>{if(c.nodeType===1&&(c.tagName==='UL'||c.tagName==='OL')){flush();qsa(':scope > li',c).forEach(li=>push(li,c.tagName==='OL'?{type:'number'}:true))}else if(c.nodeType===1&&/^(DIV|P|H\d|BLOCKQUOTE)$/.test(c.tagName)){flush();push(c)}else if(c.nodeType===1&&c.tagName==='TABLE'){flush();qsa('tr',c).forEach(r=>{const x=document.createElement('div');x.textContent=qsa('td,th',r).map(t=>t.textContent).join('   |   ');push(x)})}else inline.appendChild(c.cloneNode(true))});flush();
  if(blocks.length)delete blocks[blocks.length-1].options.breakLine;return blocks}
const PPTSHAPE={rect:'rect',round:'roundRect',ellipse:'ellipse',triangle:'triangle',diamond:'diamond',star:'star5',heart:'heart',arrow:'rightArrow',bubble:'wedgeRoundRectCallout',line:'line',cloud:'cloud'};
async function exportDeckPPTX(){const n=cur();if(!isDeck(n))return;endTextEdit();flushSave();toast('PowerPoint hazırlanıyor…');const d=n.deck,T=DECKS[d.theme]||DECKS.minimal;
  const pp=new PptxGenJS();const W=d.ratio==='4:3'?10:13.333,Hin=7.5,H=d.ratio==='4:3'?1200:900;pp.layout=d.ratio==='4:3'?'LAYOUT_4x3':'LAYOUT_WIDE';pp.title=n.title||'Sunum';pp.company='ESSTYPE';
  const pi=W/1600,pt=W*72/1600;const C=T.ppt;
  for(const [si,s] of n.slides.entries()){if(s.hidden)continue;const sl=pp.addSlide();const bg=await slideBgPNG(s,d);if(bg)sl.background={data:bg};else sl.background={color:C.bg};
    const kind=slideKind(s),dark=T.dark&&T.dark(kind),fg=(dark?'FFFFFF':C.fg);
    for(const e of [...s.els].sort((a,b)=>(a.z||0)-(b.z||0))){const box={x:e.x*pi,y:e.y*pi,w:e.w*pi,h:e.h*pi,rotate:e.rot||0};
      if(e.type==='text'){if(isEmptyHTML(e.html))continue;const isT=e.role==='title';const fs=(e.fs||(isT?62:34))*(isT?(T.hs||1):(T.bs||1));
        const runs=htmlRuns(e.html,{k:pt});sl.addText(runs,{...box,fontFace:e.font||(isT?C.hf:C.bf),fontSize:Math.round(fs*pt),color:e.color?rgbHex(e.color)||fg:fg,bold:e.bold??isT,italic:!!e.italic,align:e.align==='justify'?'justify':(e.align||'left'),valign:e.valign||'top',fill:e.fill?{color:rgbHex(e.fill)}:undefined,margin:4,paraSpaceAfter:isT?0:6})}
      else if(e.type==='img'&&e.src){const src=await toPngData(e.src);if(src)sl.addImage({data:src,...box,sizing:{type:e.fit==='contain'?'contain':'cover',w:box.w,h:box.h},rounding:false})}
      else if(e.type==='shape'){const opt={...box,fill:{color:rgbHex(e.fill||('#'+C.ac))||C.ac},line:e.stroke&&e.stroke!=='none'?{color:rgbHex(e.stroke),width:(e.sw||2)*pt}:{type:'none'}};
        if(e.html&&!isEmptyHTML(e.html))sl.addText(htmlRuns(e.html,{k:pt}),{...opt,shape:PPTSHAPE[e.shape]||'rect',fontFace:e.font||C.bf,fontSize:Math.round((e.fs||30)*pt),color:rgbHex(e.color||'#fff'),align:'center',valign:'middle',bold:true});
        else sl.addShape(PPTSHAPE[e.shape]||'rect',opt)}}
    if(s.notes)sl.addNotes(s.notes)}
  const blob=await pp.write({outputType:'blob'});download((n.title||'sunum')+'.pptx',blob);toast('PowerPoint indirildi')}
async function exportSlidePNG(){const n=cur();const H=dH();const w=document.createElement('div');w.style.cssText='position:fixed;left:-20000px;top:0';w.innerHTML=deckSlideHTML(curSlide(),{H,num:DK.cur+1});document.body.appendChild(w);
  try{const url=await htmlToImage.toPng(w.firstElementChild,{pixelRatio:1.2,fontEmbedCSS:usedFontCSS(w)});download((n.title||'slayt')+'-'+(DK.cur+1)+'.png',await (await fetch(url)).blob());toast('Slayt görseli kaydedildi')}finally{w.remove()}}
