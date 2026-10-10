/* ============ FLOATING OBJECTS ============ */
let selObj=null,selInline=null,editingObj=null;
const Z=()=>(S.set.zoom||100)/100;
const objById=id=>cur()?.objects.find(o=>o.id===id);
const STICKY=['#fff3a3','#ffd6a5','#ffc4d0','#d7c4ff','#bde0fe','#c3f0ca','#f1f1f1'];
const SHAPES=[['rect','Dikdörtgen'],['round','Yuvarlak köşe'],['ellipse','Daire / elips'],['triangle','Üçgen'],['diamond','Baklava'],['star','Yıldız'],['heart','Kalp'],['arrow','Ok'],['bubble','Konuşma balonu'],['line','Çizgi'],['cloud','Bulut']];
function shapeSVG(o){const f=o.fill||'none',s=o.stroke||'#24303f',w=o.sw||3;const a=`fill="${f}" stroke="${s}" stroke-width="${w}" vector-effect="non-scaling-stroke" stroke-linejoin="round"`;
  const P={rect:`<rect x="1" y="1" width="98" height="98" ${a}/>`,round:`<rect x="1" y="1" width="98" height="98" rx="14" ${a}/>`,ellipse:`<ellipse cx="50" cy="50" rx="49" ry="49" ${a}/>`,
   triangle:`<path d="M50 2 98 98H2z" ${a}/>`,diamond:`<path d="M50 1 99 50 50 99 1 50z" ${a}/>`,
   star:`<path d="M50 3 62 37 98 38 69 59 80 95 50 74 20 95 31 59 2 38 38 37z" ${a}/>`,
   heart:`<path d="M50 92S4 64 4 32C4 14 18 4 31 4c9 0 15 5 19 12 4-7 10-12 19-12 13 0 27 10 27 28 0 32-46 60-46 60z" ${a}/>`,
   arrow:`<path d="M2 35h60V8l36 42-36 42V65H2z" ${a}/>`,bubble:`<path d="M10 4h80a8 8 0 0 1 8 8v52a8 8 0 0 1-8 8H40L18 96l4-24H10a8 8 0 0 1-8-8V12a8 8 0 0 1 8-8z" ${a}/>`,
   line:`<path d="M2 50H96" ${a} fill="none"/><path d="M84 40 97 50 84 60" ${a} fill="none"/>`,
   cloud:`<path d="M26 86C12 86 2 76 2 63c0-12 9-21 20-22 2-17 15-30 32-30 14 0 26 9 30 22 9 2 14 10 14 19v2c0 18-12 32-28 32z" ${a}/>`};
  return `<svg viewBox="0 0 100 100" preserveAspectRatio="none">${P[o.shape]||P.rect}</svg>`}
function objHTML(o){const cls=['obj',o.type==='img'?'image':o.type,o.locked?'locked':'',o.frame?'f-'+o.frame:''].join(' ');
  let inner='';
  if(o.type==='img')inner=`<img src="${o.src}" style="${o.filter?'filter:'+o.filter:''}">${o.frame==='polaroid'&&o.caption?`<div style="position:absolute;left:0;right:0;bottom:8px;text-align:center;font:18px Caveat,cursive;color:#333">${esc(o.caption)}</div>`:''}`;
  if(o.type==='sticky')inner=`<div class="ce" style="font-family:${o.font?`'${o.font}'`:'inherit'}">${o.html||''}</div>`;
  if(o.type==='text')inner=`<div class="ce" style="font-family:${o.font?`'${o.font}'`:'inherit'};font-size:${o.fs||18}px;color:${o.color||'inherit'}">${o.html||''}</div>`;
  if(o.type==='shape')inner=shapeSVG(o)+`<div class="lbl ce" style="color:${o.tcolor||'#24303f'}">${o.html||''}</div>`;
  return `<div class="${cls}" data-id="${o.id}" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;z-index:${o.z||1};opacity:${o.op??1};transform:rotate(${o.rot||0}deg) scaleX(${o.flip?-1:1})"><div class="in" style="${o.type==='sticky'?'background:'+(o.color||STICKY[0]):''}">${inner}</div></div>`}
function renderObjects(){const n=cur(),L=$('objs');if(!n){L.innerHTML='';return}L.innerHTML=n.objects.map(objHTML).join('');qsa('.obj',L).forEach(bindObj);layoutObjects();if(selObj&&!objById(selObj))deselect();else if(selObj)drawSel()}
function refreshObj(o){const el=qs(`.obj[data-id="${o.id}"]`);if(!el)return;const t=document.createElement('template');t.innerHTML=objHTML(o);const ne=t.content.firstChild;el.replaceWith(ne);bindObj(ne);if(selObj===o.id)drawSel();layoutObjects()}
function layoutObjects(){schedulePaginate()}
function posObjEl(o){const el=qs(`.obj[data-id="${o.id}"]`);if(!el)return;Object.assign(el.style,{left:o.x+'px',top:o.y+'px',width:o.w+'px',height:o.h+'px',transform:`rotate(${o.rot||0}deg) scaleX(${o.flip?-1:1})`,zIndex:o.z||1,opacity:o.op??1})}
function bindObj(el){
  el.addEventListener('pointerdown',e=>{if(e.button!==0)return;const o=objById(el.dataset.id);if(!o)return;
    if(editingObj===o.id)return;e.preventDefault();e.stopPropagation();deselectInline();select(o.id);if(o.locked)return;
    const sx=e.clientX,sy=e.clientY,ox=o.x,oy=o.y,z=Z();let moved=false;el.setPointerCapture(e.pointerId);
    const mv=ev=>{const dx=(ev.clientX-sx)/z,dy=(ev.clientY-sy)/z;if(!moved&&Math.hypot(dx,dy)<3)return;moved=true;
      let nx=ox+dx,ny=oy+dy;if(!ev.altKey){const P=$('paper').offsetWidth;const cx=nx+o.w/2;if(Math.abs(cx-P/2)<6)nx=P/2-o.w/2}
      o.x=Math.round(nx);o.y=Math.round(Math.max(0,ny));posObjEl(o);drawSel(true)};
    const up=()=>{el.removeEventListener('pointermove',mv);el.removeEventListener('pointerup',up);if(moved){markDirty();layoutObjects()}drawSel()};
    el.addEventListener('pointermove',mv);el.addEventListener('pointerup',up)});
  el.addEventListener('dblclick',e=>{const o=objById(el.dataset.id);if(!o||o.locked)return;
    if(o.type==='img'&&o.draw){openDraw(o);return}
    if(o.type==='img'){cropOrCaption(o);return}
    startEdit(o)});
}
function startEdit(o){const el=qs(`.obj[data-id="${o.id}"]`);const ce=qs('.ce',el);if(!ce)return;editingObj=o.id;el.classList.add('editing');ce.contentEditable=true;ce.focus();
  const r=document.createRange();r.selectNodeContents(ce);r.collapse(false);getSelection().removeAllRanges();getSelection().addRange(r);
  ce.oninput=()=>{o.html=ce.innerHTML;markDirty()};ce.onblur=()=>{endEdit()};ce.onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();ce.blur()}e.stopPropagation()}}
function endEdit(){if(!editingObj)return;const el=qs(`.obj[data-id="${editingObj}"]`);if(el){el.classList.remove('editing');const ce=qs('.ce',el);if(ce)ce.contentEditable=false}editingObj=null;markDirty()}
function select(id){if(editingObj&&editingObj!==id)endEdit();selObj=id;drawSel();hideTbls()}
function deselect(){selObj=null;$('selbox').classList.remove('on');$('objTb').classList.remove('on');$('sizetip').style.display='none';deselectInline()}
function drawSel(moving){const B=$('selbox'),T=$('objTb');
  if(selInline){const im=selInline,P=$('paper').getBoundingClientRect(),r=im.getBoundingClientRect(),z=Z();
    Object.assign(B.style,{left:(r.left-P.left)/z+'px',top:(r.top-P.top)/z+'px',width:r.width/z+'px',height:r.height/z+'px',transform:'none'});B.className='on inline';
    if(!moving){objToolbar(null);}else T.classList.remove('on');return}
  const o=objById(selObj);if(!o){deselect();return}
  Object.assign(B.style,{left:o.x+'px',top:o.y+'px',width:o.w+'px',height:o.h+'px',transform:`rotate(${o.rot||0}deg)`});B.className='on'+(o.locked?' locked':'');
  if(moving){T.classList.remove('on');return}objToolbar(o)}
function selectInline(img){deselect();selInline=img;img.classList.add('isel');drawSel()}
function deselectInline(){if(selInline){selInline.classList.remove('isel');selInline=null;$('selbox').classList.remove('on');$('objTb').classList.remove('on')}}

/* handles */
function wireHandles(){qsa('#selbox [data-h]').forEach(h=>h.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();const kind=h.dataset.h;
  if(selInline){inlineResize(e);return}
  const o=objById(selObj);if(!o||o.locked)return;h.setPointerCapture(e.pointerId);
  const z=Z(),sx=e.clientX,sy=e.clientY,o0={...o};const tip=$('sizetip');
  const el=qs(`.obj[data-id="${o.id}"]`),er=el.getBoundingClientRect();const cxs=er.left+er.width/2,cys=er.top+er.height/2;
  const keep=o.type==='img'||o.type==='shape'&&['ellipse','star','heart'].includes(o.shape)&&false;
  const D={nw:[-1,-1],n:[0,-1],ne:[1,-1],e:[1,0],se:[1,1],s:[0,1],sw:[-1,1],w:[-1,0]};
  const mv=ev=>{
    if(kind==='rot'){let a=Math.atan2(ev.clientY-cys,ev.clientX-cxs)*180/Math.PI+90;if(!ev.altKey){const sn=Math.round(a/15)*15;if(Math.abs(a-sn)<5||ev.shiftKey)a=sn}o.rot=Math.round(((a%360)+360)%360);if(o.rot>180)o.rot-=360;
      posObjEl(o);drawSel(true);tip.style.display='block';tip.textContent=o.rot+'°';tip.style.left=(o.x+o.w/2+20)+'px';tip.style.top=(o.y-50)+'px';return}
    const [dx,dy]=D[kind];const th=(o0.rot||0)*Math.PI/180;const gx=(ev.clientX-sx)/z,gy=(ev.clientY-sy)/z;
    const lx=gx*Math.cos(th)+gy*Math.sin(th),ly=-gx*Math.sin(th)+gy*Math.cos(th);
    let w=o0.w+dx*lx,h=o0.h+dy*ly;
    const ratio=o0.w/o0.h;const corner=dx&&dy;
    if((keep&&!ev.shiftKey&&corner)||(!keep&&ev.shiftKey&&corner)){const s=Math.max(w/o0.w,h/o0.h);w=o0.w*s;h=o0.h*s}
    else if(keep&&!ev.shiftKey&&!corner){if(dx)h=w/ratio;else w=h*ratio}
    w=Math.max(16,w);h=Math.max(16,h);
    const ddx=dx?dx*(w-o0.w)/2:0,ddy=dy?dy*(h-o0.h)/2:0;
    const shx=ddx*Math.cos(th)-ddy*Math.sin(th),shy=ddx*Math.sin(th)+ddy*Math.cos(th);
    const cx=o0.x+o0.w/2+shx,cy=o0.y+o0.h/2+shy;
    if(keep&&!corner&&!ev.shiftKey){ /* center perpendicular */ }
    o.w=Math.round(w);o.h=Math.round(h);o.x=Math.round(cx-w/2);o.y=Math.round(cy-h/2);posObjEl(o);drawSel(true);
    tip.style.display='block';tip.textContent=`${o.w} × ${o.h}`;tip.style.left=(o.x+o.w+8)+'px';tip.style.top=(o.y+o.h+8)+'px'};
  const up=()=>{h.removeEventListener('pointermove',mv);h.removeEventListener('pointerup',up);tip.style.display='none';markDirty();layoutObjects();drawSel()};
  h.addEventListener('pointermove',mv);h.addEventListener('pointerup',up)}))}
function inlineResize(e){const im=selInline,z=Z(),sx=e.clientX,w0=im.getBoundingClientRect().width/z,EW=ED().clientWidth;const tip=$('sizetip');
  const mv=ev=>{const w=clamp(w0+(ev.clientX-sx)/z,30,EW);im.style.width=Math.round(w/EW*100)+'%';im.style.height='auto';drawSel(true);tip.style.display='block';tip.textContent=Math.round(w/EW*100)+'%';
    const P=$('paper').getBoundingClientRect(),r=im.getBoundingClientRect();tip.style.left=(r.right-P.left)/z+8+'px';tip.style.top=(r.bottom-P.top)/z+8+'px'};
  const up=()=>{document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',up);tip.style.display='none';markDirty();drawSel()};
  document.addEventListener('pointermove',mv);document.addEventListener('pointerup',up)}

/* toolbar */
const FRAMES=[['','Yok'],['shadow','Gölge'],['round','Yuvarlak köşe'],['circle','Daire'],['border','Çerçeve'],['polaroid','Polaroid'],['tape','Bant'],['tape2','Köşe bantları']];
const FILTERS=[['','Normal'],['grayscale(1)','Siyah-beyaz'],['sepia(.85)','Sepya'],['saturate(1.7) contrast(1.08)','Canlı'],['saturate(.5) brightness(1.08)','Soluk'],['contrast(1.35)','Kontrast'],['brightness(1.2)','Parlak'],['hue-rotate(180deg)','Ters renk tonu'],['blur(2px)','Bulanık'],['invert(1)','Negatif']];
function objToolbar(o){const T=$('objTb');T.innerHTML='';T.onmousedown=e=>{if(!e.target.closest('input'))e.preventDefault()};
  const B=(html,fn,tip,cls='')=>{const b=document.createElement('button');b.className='tb '+cls;b.innerHTML=html;if(tip)b.dataset.tip=tip;b.onclick=e=>fn(b,e);T.appendChild(b);return b};
  const sep=()=>T.insertAdjacentHTML('beforeend','<span class="sep"></span>');
  if(!o){const im=selInline;
    [25,50,75,100].forEach(p=>B('%'+p,()=>{im.style.width=p+'%';im.style.height='auto';markDirty();drawSel()}));sep();
    [['left','aleft','Sola'],['center','acenter','Ortala'],['right','aright','Sağa'],['floatl','wrap','Metin sağından aksın'],['floatr','wrap','Metin solundan aksın']].forEach(([a,i,t])=>B(icon(i),()=>{im.dataset.align=a;markDirty();drawSel()},t,im.dataset.align===a?'on':''));sep();
    B(icon('free')+' Serbest yap',()=>inlineToFloat(im),'Sürükle-bırak taşınabilir yap');B(icon('trash'),()=>{im.remove();deselect();markDirty()},'Sil');
  }else{
    if(o.type==='img'){
      B(icon('frame')+icon('chev','i dd'),b=>menu(b,FRAMES.map(([k,l])=>({l,i:(o.frame||'')===k?'pinmark':null,fn:()=>{o.frame=k||null;if(k==='polaroid'&&!o.caption){}refreshObj(o);markDirty()}}))),'Çerçeve');
      B(icon('filter')+icon('chev','i dd'),b=>menu(b,FILTERS.map(([k,l])=>({l,i:(o.filter||'')===k?'pinmark':null,fn:()=>{o.filter=k||null;refreshObj(o);markDirty()}}))),'Filtre');
      if(o.draw)B(icon('pen'),()=>openDraw(o),'Çizimi düzenle');
      sep();B(icon('wrap')+' Metne yerleştir',()=>floatToInline(o),'Metnin içine al');}
    if(o.type==='sticky'){STICKY.forEach(c=>{const b=B(`<i style="display:block;width:16px;height:16px;border-radius:4px;background:${c};border:1px solid rgba(0,0,0,.15)"></i>`,()=>{o.color=c;refreshObj(o);markDirty()});b.style.minWidth='26px'});sep();
      B(icon('type'),b=>fontPop(b,f=>{o.font=f;refreshObj(o);markDirty()},o.font),'Yazı tipi');B(icon('edit'),()=>startEdit(o),'Yaz')}
    if(o.type==='text'){B(icon('type'),b=>fontPop(b,f=>{o.font=f;refreshObj(o);markDirty()},o.font),'Yazı tipi');
      B('A−',()=>{o.fs=Math.max(8,(o.fs||18)-2);refreshObj(o);markDirty()},'Küçült');B('A+',()=>{o.fs=(o.fs||18)+2;refreshObj(o);markDirty()},'Büyüt');
      B(`<span style="font-weight:700;border-bottom:3px solid ${o.color||'currentColor'}">A</span>`,b=>colorPop(b,PALETTE,c=>{o.color=c;refreshObj(o);markDirty()},'Yazı rengi'),'Renk');B(icon('edit'),()=>startEdit(o),'Yaz')}
    if(o.type==='shape'){B(`<i style="display:block;width:16px;height:16px;border-radius:4px;background:${o.fill&&o.fill!=='none'?o.fill:'transparent'};border:1.5px dashed var(--muted)"></i>`,b=>colorPop(b,PALETTE.concat(HILITES),c=>{o.fill=c||'none';refreshObj(o);markDirty()},'Dolgu'),'Dolgu rengi');
      B(`<i style="display:block;width:16px;height:16px;border-radius:4px;border:3px solid ${o.stroke||'#24303f'}"></i>`,b=>colorPop(b,PALETTE,c=>{o.stroke=c||'transparent';refreshObj(o);markDirty()},'Çizgi'),'Çizgi rengi');
      B('━',b=>menu(b,[0,1,2,3,5,8,12].map(w=>({l:w?w+' px':'Çizgisiz',fn:()=>{o.sw=w;refreshObj(o);markDirty()}}))),'Çizgi kalınlığı');B(icon('edit'),()=>startEdit(o),'Şeklin içine yaz')}
    sep();
    const r=document.createElement('input');r.type='range';r.min=10;r.max=100;r.value=Math.round((o.op??1)*100);r.title='Opaklık';r.oninput=()=>{o.op=r.value/100;posObjEl(o)};r.onchange=()=>markDirty();T.insertAdjacentHTML('beforeend','<span class="lab">opaklık</span>');T.appendChild(r);sep();
    B(icon('front'),()=>{const m=Math.max(0,...cur().objects.map(x=>x.z||1));o.z=m+1;posObjEl(o);markDirty()},'Öne getir');
    B(icon('back'),()=>{const m=Math.min(...cur().objects.map(x=>x.z||1));o.z=m-1;posObjEl(o);markDirty()},'Arkaya gönder');
    B(icon('rotate'),()=>{o.rot=((o.rot||0)+90)%360;posObjEl(o);drawSel();markDirty()},'90° döndür');
    B(icon('flip'),()=>{o.flip=!o.flip;posObjEl(o);markDirty()},'Aynala');sep();
    B(icon('copy'),()=>dupObj(o),'Çoğalt (Ctrl+D)');B(icon(o.locked?'lock':'unlock'),()=>{o.locked=!o.locked;refreshObj(o);markDirty()},o.locked?'Kilidi aç':'Kilitle',o.locked?'on':'');
    B(icon('trash'),()=>delObj(o),'Sil (Delete)')}
  hydrate(T);T.classList.add('on');
  const el=selInline||qs(`.obj[data-id="${o.id}"]`);if(el)posFloat(T,el,false)}
function dupObj(o){const c={...JSON.parse(JSON.stringify(o)),id:uid(),x:o.x+24,y:o.y+24,z:(o.z||1)+1};cur().objects.push(c);renderObjects();select(c.id);markDirty()}
function delObj(o){const n=cur();n.objects=n.objects.filter(x=>x.id!==o.id);deselect();renderObjects();markDirty();toast('Nesne silindi','Geri al',()=>{n.objects.push(o);renderObjects();markDirty()})}
function viewCenter(w,h){const sc=$('scroll'),P=$('paper'),pr=P.getBoundingClientRect(),sr=sc.getBoundingClientRect(),z=Z();
  const cy=(sr.top+sr.height/2-pr.top)/z,cx=P.offsetWidth/2;return{x:Math.round(cx-w/2+(Math.random()*40-20)),y:Math.round(Math.max(20,cy-h/2+(Math.random()*40-20)))}}
function addObj(o){const n=cur();if(!n)return;o.id=uid();o.z=Math.max(0,...n.objects.map(x=>x.z||1))+1;n.objects.push(o);renderObjects();select(o.id);markDirty();return o}
function addSticky(){const p=viewCenter(220,200);const o=addObj({type:'sticky',...p,w:220,h:200,rot:Math.round(Math.random()*6-3),color:STICKY[Math.floor(Math.random()*6)],html:''});setTimeout(()=>startEdit(o),30)}
function addTextBox(){const p=viewCenter(300,90);const o=addObj({type:'text',...p,w:300,h:90,html:'Metin kutusu',fs:22});setTimeout(()=>startEdit(o),30)}
function shapeMenu(anchor){const d=document.createElement('div');d.innerHTML=`<div class="mh">Şekil ekle</div><div class="tiles" style="grid-template-columns:repeat(4,64px);padding:4px">${SHAPES.map(([k,l])=>`<div class="tile" data-k="${k}" title="${l}" style="padding:8px"><div style="height:34px">${shapeSVG({shape:k,fill:'color-mix(in srgb,var(--accent) 22%,transparent)',stroke:'var(--accent)',sw:2})}</div></div>`).join('')}</div>`;
  qsa('[data-k]',d).forEach(t=>t.onclick=()=>{closePop();const k=t.dataset.k;const w=k==='line'?240:k==='arrow'?200:160,h=k==='line'?40:k==='arrow'?110:k==='bubble'?120:160;const p=viewCenter(w,h);
    addObj({type:'shape',shape:k,...p,w,h,fill:k==='line'?'none':'#ffe9a8',stroke:'#24303f',sw:3,html:''})});pop(anchor,d)}

/* images */
function readImg(file,max=2000){return new Promise(res=>{const fr=new FileReader();fr.onload=()=>{
  if(/gif|svg/.test(file.type)){const im=new Image();im.onload=()=>res({src:fr.result,w:im.naturalWidth||400,h:im.naturalHeight||300});im.onerror=()=>res(null);im.src=fr.result;return}
  const im=new Image();im.onload=()=>{let w=im.naturalWidth,h=im.naturalHeight;if(w<=max&&h<=max&&file.size<900000)return res({src:fr.result,w,h});
    const k=Math.min(1,max/Math.max(w,h));w=Math.round(w*k);h=Math.round(h*k);const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(im,0,0,w,h);
    res({src:file.type==='image/png'?c.toDataURL('image/png'):c.toDataURL('image/jpeg',.88),w,h})};im.onerror=()=>res(null);im.src=fr.result};fr.readAsDataURL(file)})}
async function addImages(files,at){const n=cur();if(!n)return;toast('Görsel ekleniyor…');let i=0,last;
  for(const f of files){const r=await readImg(f);if(!r)continue;const maxW=Math.min(360,$('paper').offsetWidth*.5);let w=Math.min(r.w,maxW),h=w*r.h/r.w;if(h>360){h=360;w=h*r.w/r.h}
    const p=at?{x:Math.round(at.x-w/2+i*24),y:Math.round(at.y-h/2+i*24)}:viewCenter(w,h);last=addObj({type:'img',src:r.src,x:p.x,y:Math.max(0,p.y),w:Math.round(w),h:Math.round(h),rot:0});i++}
  if(last)toast('Görsel eklendi — sürükle, köşelerden boyutlandır, üstteki tutamaçla döndür',null,null,4500);else toast('Görsel okunamadı')}
function inlineToFloat(im){const P=$('paper').getBoundingClientRect(),r=im.getBoundingClientRect(),z=Z();
  const o={type:'img',src:im.src,x:Math.round((r.left-P.left)/z),y:Math.round((r.top-P.top)/z),w:Math.round(r.width/z),h:Math.round(r.height/z)};im.remove();deselect();addObj(o);toast('Artık serbestçe taşıyabilirsin')}
function floatToInline(o){const n=cur();n.objects=n.objects.filter(x=>x.id!==o.id);deselect();renderObjects();
  const pct=Math.min(100,Math.round(o.w/ED().clientWidth*100));const h=`<img src="${o.src}" data-align="center" style="width:${pct}%${o.filter?';filter:'+o.filter:''}">`;
  // insert at the block nearest to object's y
  const E=ED(),P=$('paper').getBoundingClientRect(),z=Z();let target=null;for(const b of E.children){const r=b.getBoundingClientRect();if((r.top-P.top)/z<=o.y)target=b}
  const d=document.createElement('div');d.innerHTML=h;if(target)target.after(d);else E.prepend(d);markDirty();toast('Görsel metnin içine yerleşti')}
function cropOrCaption(o){if(o.frame==='polaroid'){promptBox('Polaroid alt yazısı',o.caption||'').then(v=>{if(v!==null){o.caption=v;refreshObj(o);markDirty()}})}else{toast('İpucu: çerçeve menüsünden Polaroid, bant, daire seçebilirsin')}}

/* global object keys/clicks */
function wireObjects(){wireHandles();
  $('paper').addEventListener('pointerdown',e=>{if(!e.target.closest('.obj,#selbox')&&!e.target.closest('#ed img')){if(selObj||selInline)deselect()}},true);
  document.addEventListener('keydown',e=>{if(!selObj&&!selInline)return;if(editingObj||e.target.closest&&e.target.closest('input,textarea,[contenteditable="true"]')&&!selObj)return;
    if(selInline&&(e.key==='Delete'||e.key==='Backspace')){e.preventDefault();selInline.remove();deselect();markDirty();return}
    const o=objById(selObj);if(!o)return;
    if(e.key==='Delete'||e.key==='Backspace'){if(document.activeElement===ED()||document.activeElement===$('title'))return;e.preventDefault();delObj(o)}
    if(e.key==='Escape')deselect();
    if(e.ctrlKey&&e.key.toLowerCase()==='d'){e.preventDefault();dupObj(o)}
    const st=e.shiftKey?10:1;const mv={ArrowLeft:[-st,0],ArrowRight:[st,0],ArrowUp:[0,-st],ArrowDown:[0,st]}[e.key];
    if(mv&&document.activeElement!==ED()){e.preventDefault();o.x+=mv[0];o.y=Math.max(0,o.y+mv[1]);posObjEl(o);drawSel();markDirty()}});
  $('fImg').onchange=e=>{const f=[...e.target.files];e.target.value='';if(f.length)addImages(f)};
  const sc=$('scroll');let dc=0;
  sc.addEventListener('dragenter',e=>{if([...e.dataTransfer.types].includes('Files')){dc++;$('dropzone').classList.add('on')}});
  sc.addEventListener('dragleave',()=>{if(--dc<=0){dc=0;$('dropzone').classList.remove('on')}});
  sc.addEventListener('dragover',e=>{if([...e.dataTransfer.types].includes('Files'))e.preventDefault()});
  sc.addEventListener('drop',e=>{const fs=[...e.dataTransfer.files].filter(f=>f.type.startsWith('image/'));dc=0;$('dropzone').classList.remove('on');if(!fs.length)return;e.preventDefault();
    const P=$('paper').getBoundingClientRect(),z=Z();addImages(fs,{x:(e.clientX-P.left)/z,y:(e.clientY-P.top)/z})});
  sc.addEventListener('scroll',()=>{if(selObj||selInline){const T=$('objTb');if(T.classList.contains('on')){const el=selInline||qs(`.obj[data-id="${selObj}"]`);if(el)posFloat(T,el,false)}}});
}

/* ============ DRAWING ============ */
function openDraw(editObj){
  const body=document.createElement('div');body.className='drawwrap';
  const COLS=['#1f2328','#ffffff','#b0413e','#e8590c','#f59f00','#2f9e44','#1c7ed6','#7048e8','#d6336c','#868e96','#8d6e63','#00b5ad'];
  body.innerHTML=`<div class="drawbar">
    <div class="seg" id="dTools"><button data-t="pen" class="on">Kalem</button><button data-t="marker">Keçeli</button><button data-t="hl">Fosforlu</button><button data-t="line">Çizgi</button><button data-t="rect">Kutu</button><button data-t="circle">Daire</button><button data-t="arrow">Ok</button><button data-t="erase">Silgi</button></div>
    <span style="width:10px"></span>${COLS.map((c,i)=>`<i class="sw ${i?'':'on'}" data-c="${c}" style="background:${c}"></i>`).join('')}<input type="color" id="dCol" style="width:26px;height:26px;border:0;background:none">
    <span style="width:10px"></span><span style="font-size:12px;color:var(--muted)">kalınlık</span><input type="range" id="dSize" min="1" max="40" value="4" style="width:100px">
    <span style="flex:1"></span><button class="tb" id="dUndo">${icon('undo')}</button><button class="tb" id="dRedo">${icon('redo')}</button><button class="btn ghost" id="dClear">Temizle</button></div>
    <div class="drawarea" id="dArea"><canvas id="dCv"></canvas><canvas id="dTmp"></canvas></div>`;
  const m=modal({title:editObj?'Çizimi düzenle':'Çizim yap',body,wide:true,foot:[{l:'Vazgeç',cls:'ghost',fn:c=>c()},{l:editObj?'Güncelle':'Sayfaya ekle',cls:'pri',fn:c=>{save();c()}}]});
  m.el.style.width='min(1100px,95vw)';
  const A=$('dArea'),cv=$('dCv'),tmp=$('dTmp'),dpr=devicePixelRatio||1;let W,H,ctx,tctx;
  const fit=()=>{W=A.clientWidth;H=A.clientHeight;[cv,tmp].forEach(c=>{c.width=W*dpr;c.height=H*dpr});ctx=cv.getContext('2d');tctx=tmp.getContext('2d');ctx.scale(dpr,dpr);tctx.scale(dpr,dpr);ctx.lineCap=tctx.lineCap='round';ctx.lineJoin=tctx.lineJoin='round'};
  fit();
  let tool='pen',color=COLS[0],size=4;const hist=[],redo=[];
  const snap=()=>{hist.push(ctx.getImageData(0,0,cv.width,cv.height));if(hist.length>40)hist.shift();redo.length=0};
  if(editObj){const im=new Image();im.onload=()=>{const k=Math.min(1,(W-40)/im.width,(H-40)/im.height);const w=im.width*k,h=im.height*k;ctx.drawImage(im,(W-w)/2,(H-h)/2,w,h)};im.src=editObj.src}
  qsa('#dTools button',body).forEach(b=>b.onclick=()=>{tool=b.dataset.t;qsa('#dTools button',body).forEach(x=>x.classList.toggle('on',x===b))});
  qsa('.sw',body).forEach(s=>s.onclick=()=>{color=s.dataset.c;qsa('.sw',body).forEach(x=>x.classList.toggle('on',x===s))});
  $('dCol').oninput=e=>{color=e.target.value;qsa('.sw',body).forEach(x=>x.classList.remove('on'))};$('dSize').oninput=e=>size=+e.target.value;
  $('dUndo').onclick=()=>{if(!hist.length)return;redo.push(ctx.getImageData(0,0,cv.width,cv.height));ctx.putImageData(hist.pop(),0,0)};
  $('dRedo').onclick=()=>{if(!redo.length)return;hist.push(ctx.getImageData(0,0,cv.width,cv.height));ctx.putImageData(redo.pop(),0,0)};
  $('dClear').onclick=()=>{snap();ctx.clearRect(0,0,W,H)};
  const style=(c,pr=1)=>{c.globalCompositeOperation=tool==='erase'?'destination-out':'source-over';c.strokeStyle=color;c.fillStyle=color;
    c.globalAlpha=tool==='hl'?.35:tool==='marker'?.85:1;c.lineWidth=(tool==='hl'?size*4:tool==='marker'?size*2:tool==='erase'?size*3:size)*pr};
  let pts=[],start=null,drawing=false;
  tmp.onpointerdown=e=>{tmp.setPointerCapture(e.pointerId);drawing=true;snap();const r=tmp.getBoundingClientRect();start={x:e.clientX-r.left,y:e.clientY-r.top};pts=[start]};
  tmp.onpointermove=e=>{if(!drawing)return;const r=tmp.getBoundingClientRect();const p={x:e.clientX-r.left,y:e.clientY-r.top,pr:e.pointerType==='pen'?(e.pressure||.5)*2:1};
    if(['pen','marker','hl','erase'].includes(tool)){pts.push(p);const c=tool==='hl'||tool==='marker'?tctx:ctx;
      if(c===tctx){tctx.clearRect(0,0,W,H);style(tctx);tctx.globalAlpha=1;tctx.beginPath();tctx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length-1;i++){const mx=(pts[i].x+pts[i+1].x)/2,my=(pts[i].y+pts[i+1].y)/2;tctx.quadraticCurveTo(pts[i].x,pts[i].y,mx,my)}tctx.lineTo(p.x,p.y);tctx.stroke();tmp.style.opacity=tool==='hl'?.35:.85}
      else{const a=pts[pts.length-2];style(ctx,p.pr);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(p.x,p.y);ctx.stroke()}}
    else{tctx.clearRect(0,0,W,H);style(tctx);tmp.style.opacity=1;shapeOn(tctx,start,p)}};
  tmp.onpointerup=e=>{if(!drawing)return;drawing=false;const r=tmp.getBoundingClientRect();const p={x:e.clientX-r.left,y:e.clientY-r.top};
    if(tool==='hl'||tool==='marker'){ctx.save();ctx.globalAlpha=tool==='hl'?.35:.85;ctx.drawImage(tmp,0,0,W,H);ctx.restore()}
    else if(!['pen','erase'].includes(tool)){style(ctx);shapeOn(ctx,start,p)}
    tctx.clearRect(0,0,W,H);tmp.style.opacity=1};
  function shapeOn(c,a,b){c.beginPath();if(tool==='line'||tool==='arrow'){c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);if(tool==='arrow'){const an=Math.atan2(b.y-a.y,b.x-a.x),L=12+size*2;c.moveTo(b.x,b.y);c.lineTo(b.x-L*Math.cos(an-.45),b.y-L*Math.sin(an-.45));c.moveTo(b.x,b.y);c.lineTo(b.x-L*Math.cos(an+.45),b.y-L*Math.sin(an+.45))}}
    if(tool==='rect')c.rect(a.x,a.y,b.x-a.x,b.y-a.y);if(tool==='circle')c.ellipse((a.x+b.x)/2,(a.y+b.y)/2,Math.abs(b.x-a.x)/2,Math.abs(b.y-a.y)/2,0,0,Math.PI*2);c.stroke()}
  function save(){const d=ctx.getImageData(0,0,cv.width,cv.height).data;let x0=cv.width,y0=cv.height,x1=0,y1=0;
    for(let y=0;y<cv.height;y++)for(let x=0;x<cv.width;x++)if(d[(y*cv.width+x)*4+3]>8){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
    if(x1<=x0){if(editObj)delObj(editObj);return}const pad=8*dpr;x0=Math.max(0,x0-pad);y0=Math.max(0,y0-pad);x1=Math.min(cv.width,x1+pad);y1=Math.min(cv.height,y1+pad);
    const out=document.createElement('canvas');out.width=x1-x0;out.height=y1-y0;out.getContext('2d').drawImage(cv,x0,y0,x1-x0,y1-y0,0,0,x1-x0,y1-y0);
    const src=out.toDataURL('image/png');let w=(x1-x0)/dpr,h=(y1-y0)/dpr;
    if(editObj){const k=editObj.w/(editObj.w0||w);editObj.src=src;const cx=editObj.x+editObj.w/2,cy=editObj.y+editObj.h/2;const s=Math.min(1,600/w);editObj.w=Math.round(w*s);editObj.h=Math.round(h*s);editObj.x=Math.round(cx-editObj.w/2);editObj.y=Math.round(cy-editObj.h/2);refreshObj(editObj);markDirty()}
    else{const s=Math.min(1,600/w);w*=s;h*=s;const p=viewCenter(w,h);addObj({type:'img',draw:true,src,...p,w:Math.round(w),h:Math.round(h)})}}
}
