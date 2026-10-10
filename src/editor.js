/* ============ OPEN / SAVE ============ */
let saveT=null,savedRange=null,verT=0;
const ED=()=>$('ed');
function showEmpty(){ED().innerHTML='';$('title').value='';$('objs').innerHTML='';$('meta').innerHTML='';deselect();updateCrumb();
  $('sheet').style.visibility='hidden'}
function openNote(id,fresh){
  if(S.active&&S.active!==id)flushSave();
  const n=S.notes.find(x=>x.id===id);if(!n)return;S.active=id;
  const sb=$('showBtn');
  if(isDeck(n)){deselect();hideTbls();if(!$('rpanel').classList.contains('hide'))$('rpanel').classList.add('hide');enterDeck(n);updateCrumb();syncTop();renderList();kvSet('last',id);sb.innerHTML=icon('play')+' Slayt gösterisi';
    if(n.trashed)toast('Bu sunum çöp kutusunda','Geri yükle',()=>restoreNote(id));return}
  if(DK.n)leaveDeck();sb.innerHTML=icon('slides')+' Yeni sunum';
  $('sheet').style.visibility='';deselect();hideTbls();
  $('title').value=n.title;ED().innerHTML=n.html;ED().contentEditable=!n.trashed;$('title').disabled=n.trashed;
  applyPaper(n);renderObjects();renderMeta();updateCrumb();syncTop();stats();markEmpty();renderList();
  if(!$('rpanel').classList.contains('hide'))renderRP();
  $('scroll').scrollTop=0;kvSet('last',id);document.title=(n.title||'Başlıksız')+' — ESSTYPE';
  if(n.trashed)toast('Bu sayfa çöp kutusunda','Geri yükle',()=>restoreNote(id));
}
function markDirty(now){const n=cur();if(!n)return;setSaved(true);schedulePaginate();requestAnimationFrame(()=>requestAnimationFrame(ensureCaret));clearTimeout(saveT);saveT=setTimeout(flushSave,now?10:500)}
function flushSave(){clearTimeout(saveT);saveT=null;const n=cur();if(!n||n.trashed){setSaved(false);return}
  if(isDeck(n)){endTextEdit();n.text=deckText(n);persist(n).then(()=>setSaved(false));return}
  const html=cleanHTML(ED().innerHTML),title=$('title').value;
  const changed=html!==n.html||title!==n.title;
  n.html=html;n.title=title;n.text=ED().innerText;
  if(changed)n.updated=Date.now();
  persist(n).then(()=>setSaved(false));
  if(changed){updateCrumb();renderList();stats();maybeVersion(n)}}
function cleanHTML(h){if(/data-pg/.test(h)){const t=document.createElement('div');t.innerHTML=h;qsa('[data-pg]',t).forEach(x=>{x.removeAttribute('data-pg');x.style.marginTop='';if(!x.getAttribute('style'))x.removeAttribute('style')});h=t.innerHTML}return h.replace(/ class="(isel|curblk)"/g,'').replace(/ (isel|curblk)(?=")/g,'').replace(/ class=""/g,'')}
async function maybeVersion(n,force){const now=Date.now();if(!force&&now-verT<4*60*1000)return;verT=now;
  const v={id:uid(),note:n.id,at:now,title:n.title,html:n.html,objects:JSON.parse(JSON.stringify(n.objects)),paper:{...n.paper},words:(n.text.match(/\S+/g)||[]).length};
  await dbPut('versions',v);
  const all=(await dbAll('versions')).filter(x=>x.note===n.id).sort((a,b)=>b.at-a.at);for(const old of all.slice(30))dbDel('versions',old.id)}
function pageIndicator(){const n=cur(),el=$('stPage');if(!n||!el)return;const g=pageGeom(n);if(!g.paged){el.textContent='';return}const P=$('paper').getBoundingClientRect(),sc=$('scroll').getBoundingClientRect();
  const y=(sc.top+sc.height*.4-P.top)/Z();const k=clamp(Math.floor(y/g.step)+1,1,PG.count);el.textContent=`Sayfa ${k} / ${PG.count}`}
function stats(){const n=cur(),E=ED();if(!n)return;const t=E.innerText||'';const w=(t.match(/\S+/g)||[]).length;
  $('stWords').textContent=w+' kelime';$('stChars').textContent=t.replace(/\s/g,'').length+' karakter';$('stRead').textContent='~'+Math.max(1,Math.round(w/200))+' dk okuma';pageIndicator();
  const g=n.goal||S.set.goal;const G=$('stGoal');G.classList.toggle('hide',!g);if(g){qs('.bar i',G).style.width=Math.min(100,w/g*100)+'%';qs('span:last-child',G).textContent=`${w}/${g}`;if(w>=g&&!n._goalDone){n._goalDone=1;toast('🎉 Kelime hedefine ulaştın!')}}}
function markEmpty(){const E=ED();E.classList.toggle('isempty',!E.innerText.trim()&&!E.querySelector('img,table,hr,li,.slide-break'))}
function renderMeta(){const n=cur(),M=$('meta');if(!n)return;
  M.innerHTML=`<span>${fmtDate(n.created,1)}</span>${n.tags.map(t=>`<span class="tag" data-t="${esc(t)}" title="Kaldır">#${esc(t)}</span>`).join('')}<input id="tagIn" placeholder="+ etiket">`;
  qsa('.tag',M).forEach(e=>e.onclick=()=>{n.tags=n.tags.filter(t=>t!==e.dataset.t);persist(n);renderMeta();renderList()});
  const i=$('tagIn');i.onkeydown=e=>{if(e.key==='Enter'||e.key===','){e.preventDefault();const v=i.value.trim().replace(/^#/,'');if(v&&!n.tags.includes(v)){n.tags.push(v);persist(n);renderMeta();renderList();$('tagIn').focus()}}}}

/* ============ SELECTION ============ */
function inEd(node){return node&&ED().contains(node.nodeType===3?node.parentNode:node)}
function saveSel(){const s=getSelection();if(s.rangeCount&&inEd(s.anchorNode))savedRange=s.getRangeAt(0).cloneRange()}
function restoreSel(){const E=ED();if(document.activeElement!==E)E.focus({preventScroll:true});if(savedRange&&E.contains(savedRange.startContainer)){const s=getSelection();s.removeAllRanges();s.addRange(savedRange)}}
function placeEnd(){const E=ED();E.focus();const r=document.createRange();r.selectNodeContents(E);r.collapse(false);const s=getSelection();s.removeAllRanges();s.addRange(r);saveSel()}
function selEl(){const s=getSelection();let el=s.anchorNode;if(!el)return null;if(el.nodeType===3)el=el.parentElement;return inEd(el)?el:null}
function topBlock(el){const E=ED();while(el&&el.parentElement!==E)el=el.parentElement;return el}
function ensureBlock(){const E=ED();if(!E.firstElementChild&&!E.textContent){E.innerHTML='<div><br></div>';const r=document.createRange();r.setStart(E.firstChild,0);r.collapse(true);const s=getSelection();s.removeAllRanges();s.addRange(r)}}
function exec(cmd,val=null){if(cmd==='fontName'&&val&&!/^['"]/.test(val))val=`'${val}'`;restoreSel();ensureBlock();document.execCommand(cmd,false,val);normBlocks();saveSel();markDirty();syncRibbon();markEmpty()}
const BLK=/^(UL|OL|DIV|P|H[1-6]|TABLE|BLOCKQUOTE|PRE|HR|DETAILS)$/;
function normBlocks(){const E=ED();const wraps=[...E.children].filter(d=>d.tagName==='DIV'&&!d.className&&!d.getAttribute('style')&&d.children.length&&[...d.childNodes].every(c=>c.nodeType===1?BLK.test(c.tagName)&&!(c.tagName==='DIV'&&false):!c.textContent.trim())&&[...d.children].some(c=>c.tagName!=='DIV'||c.children.length||true)&&d.children.length>=1&&[...d.children].some(c=>/^(UL|OL|TABLE|H[1-6]|BLOCKQUOTE|PRE)$/.test(c.tagName)));
  if(!wraps.length)return;const s=getSelection();const a=s.rangeCount?[s.anchorNode,s.anchorOffset]:null;
  wraps.forEach(d=>d.replaceWith(...d.childNodes));
  if(a&&a[0]&&E.contains(a[0])){const r=document.createRange();try{r.setStart(a[0],Math.min(a[1],a[0].nodeType===3?a[0].length:a[0].childNodes.length));r.collapse(true);s.removeAllRanges();s.addRange(r)}catch(e){}}}
function applyInline(css){ // wraps selection in span with css (keeps inner formatting)
  restoreSel();const sel=getSelection();if(sel.isCollapsed||!sel.rangeCount){toast('Önce metin seç');return}
  const r=sel.getRangeAt(0);const span=document.createElement('span');span.setAttribute('style',css);span.appendChild(r.cloneContents());
  qsa('div,p',span).forEach(d=>{if(d.nextSibling)d.after(document.createElement('br'));d.replaceWith(...d.childNodes)});
  r.deleteContents();r.insertNode(span);qsa('#ed span:empty,#ed font:empty').forEach(x=>x!==span&&x.remove());
  const nr=document.createRange();nr.selectNodeContents(span);sel.removeAllRanges();sel.addRange(nr);saveSel();markDirty()}
function applySize(px){px=clamp(Math.round(px),6,200);restoreSel();
  if(getSelection().isCollapsed){ // apply to current block's text or set for following typing
    const b=topBlock(selEl());if(b&&b.textContent.trim()){const r=document.createRange();r.selectNodeContents(b);const s=getSelection();s.removeAllRanges();s.addRange(r)}else{exec('fontSize','7');qsa('font[size="7"]',ED()).forEach(f=>{f.removeAttribute('size');f.style.fontSize=px+'px'});return}}
  document.execCommand('styleWithCSS',false,false);document.execCommand('fontSize',false,'7');document.execCommand('styleWithCSS',false,true);
  qsa('font[size="7"]',ED()).forEach(f=>{f.removeAttribute('size');f.style.fontSize=px+'px'});
  qsa('span[style*="xxx-large"]',ED()).forEach(s=>s.style.fontSize=px+'px');$('szIn').value=px;saveSel();markDirty()}

/* ============ RIBBON STATE ============ */
const STYLES=[['div','Normal metin',''],['h1','Başlık 1','font:700 22px var(--titlefont,Georgia)'],['h2','Başlık 2','font:700 18px Georgia'],['h3','BAŞLIK 3','font:700 12px var(--ui);letter-spacing:1.5px'],
  ['subtitle','Alt başlık','font:italic 16px Georgia;opacity:.75'],['blockquote','Alıntı','font:italic 15px Georgia;border-left:3px solid var(--accent);padding-left:8px'],['pre','Kod bloğu','font:13px var(--mono)'],
  ['c-info','ℹ️ Bilgi kutusu',''],['c-tip','💡 İpucu kutusu',''],['c-warn','⚠️ Uyarı kutusu',''],['c-idea','✨ Fikir kutusu',''],['c-danger','🔥 Önemli kutusu','']];
function syncRibbon(){
  const el=selEl();if(!el)return;
  ['bold','italic','underline','strikeThrough','superscript','subscript','insertUnorderedList','insertOrderedList','justifyLeft','justifyCenter','justifyRight','justifyFull'].forEach(c=>{const b=qs(`#ribbon [data-cmd="${c}"]`);if(b)b.classList.toggle('on',document.queryCommandState(c))});
  const cs=getComputedStyle(el);const fam=cs.fontFamily.split(',')[0].replace(/['"]/g,'').trim();
  const fc=qs('#fontCombo .v');fc.textContent=fam;fc.style.fontFamily=`'${fam}'`;
  if(document.activeElement!==$('szIn'))$('szIn').value=Math.round(parseFloat(cs.fontSize));
  const al={left:'aleft',start:'aleft',center:'acenter',right:'aright',end:'aright',justify:'ajust'}[cs.textAlign]||'aleft';const ab=qs('#alignBtn svg');if(ab&&ab.dataset.k!==al){ab.outerHTML=icon(al);qs('#alignBtn svg').dataset.k=al}
  const blk=el.closest('h1,h2,h3,blockquote,pre,.subtitle,.callout');let st='Normal metin';
  if(blk){const k=blk.classList.contains('subtitle')?'subtitle':blk.classList.contains('callout')?'c-'+[...blk.classList].find(c=>c!=='callout'):blk.tagName.toLowerCase();st=(STYLES.find(s=>s[0]===k)||[,'Normal metin'])[1]}
  qs('#styleCombo .v').textContent=st;$('chkBtn').classList.toggle('on',!!el.closest('ul.check'));
  if(S.set.paraFocus){qsa('#ed > .curblk').forEach(b=>b.classList.remove('curblk'));const tb=topBlock(el);if(tb)tb.classList.add('curblk')}
  tableTb(el)}
document.addEventListener('selectionchange',()=>{const s=getSelection();if(s.rangeCount&&inEd(s.anchorNode)){saveSel();syncRibbon();if(document.body.classList.contains('typewriter'))twScroll();selToolbar()}else hideSelTb()});

/* ============ FORMAT HELPERS ============ */
function setStyle(k){restoreSel();ensureBlock();
  const el=selEl();const tb=topBlock(el);
  if(k.startsWith('c-')){const cls=k.slice(2);if(!tb)return;
    const ex=tb.classList.contains('callout')?tb:null;
    if(ex){ex.className='callout '+cls}else{const w=document.createElement('div');w.className='callout '+cls;tb.replaceWith(w);w.appendChild(tb);if(tb.tagName!=='DIV'){const d=document.createElement('div');d.innerHTML=tb.innerHTML;tb.replaceWith(d)}}
    markDirty();syncRibbon();return}
  // unwrap callout if switching to normal
  const co=el&&el.closest('.callout');if(co&&k==='div'){const kids=[...co.childNodes];co.replaceWith(...kids);markDirty();syncRibbon();return}
  if(k==='subtitle'){document.execCommand('formatBlock',false,'div');const b=topBlock(selEl());if(b){b.className='subtitle'}markDirty();syncRibbon();return}
  document.execCommand('formatBlock',false,k);const b=topBlock(selEl());if(b&&b.classList.contains('subtitle'))b.classList.remove('subtitle');
  saveSel();markDirty();syncRibbon()}
function styleMenu(anchor){menu(anchor,STYLES.map(([k,l,css])=>({html:`<span style="${css}">${l}</span>`,fn:()=>setStyle(k)})),{cls:'stylegal'})}
function fontPop(anchor,onPick,current){
  const d=document.createElement('div');d.className='fontpop';
  d.innerHTML=`<div class="fs"><input placeholder="Yazı tipi ara…"></div><div class="fl"></div>`;
  const fl=qs('.fl',d),inp=qs('input',d);
  const draw=q=>{q=trLower(q);fl.innerHTML=FONTS.map(([cat,list])=>{const L=list.filter(f=>!q||trLower(f).includes(q));if(!L.length)return'';
      return `<div class="mh">${cat}</div>`+L.map(f=>`<button class="fo ${f===current?'on':''}" data-f="${esc(f)}" style="font-family:'${f}'">${esc(f)}<small>Aa Ğğ Şş</small></button>`).join('')}).join('');
    qsa('.fo',fl).forEach(b=>b.onclick=()=>{closePop();onPick(b.dataset.f)})};
  draw('');const p=pop(anchor,d,{cls:'fontpop'});inp.oninput=()=>draw(inp.value);setTimeout(()=>inp.focus(),10);
  const on=qs('.fo.on',fl);if(on)on.scrollIntoView({block:'center'});return p}
const PALETTE=['#000000','#434343','#666666','#999999','#b7b7b7','#d9d9d9','#efefef','#ffffff','#b0413e','#e07a6e',
  '#980000','#ff0000','#ff9900','#ffff00','#00ff00','#00ffff','#4a86e8','#0000ff','#9900ff','#ff00ff',
  '#e6b8af','#f4cccc','#fce5cd','#fff2cc','#d9ead3','#d0e0e3','#c9daf8','#cfe2f3','#d9d2e9','#ead1dc',
  '#a61c00','#cc0000','#e69138','#f1c232','#6aa84f','#45818e','#3c78d8','#3d85c6','#674ea7','#a64d79',
  '#5b0f00','#660000','#783f04','#7f6000','#274e13','#0c343d','#1c4587','#073763','#20124d','#4c1130'];
const HILITES=['#fff176','#ffe066','#ffd8a8','#ffc9c9','#fcc2d7','#eebefa','#d0bfff','#bac8ff','#a5d8ff','#99e9f2','#96f2d7','#b2f2bb','#d8f5a2','#e9ecef'];
function colorPop(anchor,list,onPick,label){
  const d=document.createElement('div');d.innerHTML=`<div class="mh">${label}</div><div class="palette">${list.map(c=>`<i data-c="${c}" style="background:${c}"></i>`).join('')}</div><div class="msep"></div><button class="mi" data-none>${icon('eraser')}Rengi kaldır</button><button class="mi" data-custom>${icon('palette')}Özel renk…</button>`;
  qsa('[data-c]',d).forEach(i=>i.onclick=()=>{closePop();onPick(i.dataset.c)});
  qs('[data-none]',d).onclick=()=>{closePop();onPick(null)};
  qs('[data-custom]',d).onclick=()=>{closePop();const f=$('fColor');f.oninput=null;f.onchange=()=>onPick(f.value);f.click()};
  pop(anchor,d)}
function setFore(c){S.set.fore=c||S.set.fore;saveSet();$('foreSw').style.background=S.set.fore||'#b0413e';restoreSel();if(c)exec('foreColor',c);else{exec('foreColor',getComputedStyle($('sheet')).getPropertyValue('--pi').trim()||'#222')}}
function setBack(c){if(c){S.set.back=c;saveSet();$('backSw').style.background=c}exec('hiliteColor',c||'transparent');
  if(!c)qsa('#ed span[style*="background-color: transparent"]').forEach(s=>s.style.backgroundColor='')}
const FX=[['Gölge','text-shadow:2px 2px 0 rgba(0,0,0,.18);'],['Yumuşak gölge','text-shadow:0 3px 10px rgba(0,0,0,.35);'],['Neon parlama','text-shadow:0 0 6px currentColor,0 0 18px currentColor;'],
  ['Kontur','-webkit-text-stroke:1.2px currentColor;color:transparent;'],['Gün batımı gradyanı','background:linear-gradient(90deg,#ff6a3d,#ff3d77,#a63dff);-webkit-background-clip:text;background-clip:text;color:transparent;'],
  ['Okyanus gradyanı','background:linear-gradient(90deg,#1fa2ff,#12d8fa,#38ef7d);-webkit-background-clip:text;background-clip:text;color:transparent;'],['Altın','background:linear-gradient(180deg,#f7e08a,#c99a2e 55%,#8a6414);-webkit-background-clip:text;background-clip:text;color:transparent;'],
  ['Fosforlu kalem altı','background:linear-gradient(transparent 55%,#ffe06699 55%);'],['Dalgalı altı çizgi','text-decoration:underline wavy;text-decoration-color:#e03131;text-underline-offset:4px;'],
  ['Geniş harf aralığı','letter-spacing:.18em;'],['Dar harf aralığı','letter-spacing:-.04em;'],['Küçük büyük harf','font-variant:small-caps;'],['Rozet','background:var(--accent);color:#fff;padding:1px 8px;border-radius:20px;font-size:.85em;']];
function fxMenu(anchor){menu(anchor,[{h:'Yazı efektleri'},...FX.map(([l,css])=>({html:`<span style="${css}">${l}</span>`,fn:()=>applyInline(css)})),'-',{l:'Efektleri temizle',i:'eraser',fn:()=>exec('removeFormat')}])}
function caseMenu(anchor){const tr=(f)=>{restoreSel();const s=getSelection();if(s.isCollapsed)return toast('Önce metin seç');const t=s.toString();document.execCommand('insertText',false,f(t));markDirty()};
  menu(anchor,[{html:'x² &nbsp;Üst simge',fn:()=>exec('superscript')},{html:'x₂ &nbsp;Alt simge',fn:()=>exec('subscript')},'-',{l:'BÜYÜK HARF',fn:()=>tr(t=>t.toLocaleUpperCase('tr'))},{l:'küçük harf',fn:()=>tr(t=>t.toLocaleLowerCase('tr'))},
    {l:'Her Kelime Büyük',fn:()=>tr(t=>t.toLocaleLowerCase('tr').replace(/(^|\s)(\S)/g,(m,a,b)=>a+b.toLocaleUpperCase('tr')))},{l:'Cümle düzeni',fn:()=>tr(t=>{const l=t.toLocaleLowerCase('tr');return l.charAt(0).toLocaleUpperCase('tr')+l.slice(1)})}])}
function toggleCheck(){restoreSel();ensureBlock();const el=selEl();const ul=el&&el.closest('ul');
  if(ul){ul.classList.toggle('check')}else{document.execCommand('insertUnorderedList');const u=selEl()?.closest('ul');if(u)u.classList.add('check')}saveSel();markDirty();syncRibbon()}
let painter=null;
function formatPainter(){const el=selEl();if(!el)return toast('Biçimini kopyalamak istediğin metne tıkla');
  const cs=getComputedStyle(el);painter={fontFamily:cs.fontFamily,fontSize:cs.fontSize,fontWeight:cs.fontWeight,fontStyle:cs.fontStyle,color:cs.color,textDecoration:cs.textDecorationLine,bg:el.closest('[style*="background-color"]')?.style.backgroundColor||''};
  $('painterBtn').classList.add('on');toast('Biçim kopyalandı — şimdi uygulamak istediğin metni seç')}
function applyPainter(){if(!painter)return;const s=getSelection();if(s.isCollapsed)return;const p=painter;painter=null;$('painterBtn').classList.remove('on');
  applyInline(`font-family:${p.fontFamily};font-size:${p.fontSize};font-weight:${p.fontWeight};font-style:${p.fontStyle};color:${p.color};${p.textDecoration!=='none'?'text-decoration:'+p.textDecoration+';':''}${p.bg?'background-color:'+p.bg+';':''}`)}

/* ============ INSERTS ============ */
function insertHTML(h){restoreSel();ensureBlock();document.execCommand('insertHTML',false,h);saveSel();markDirty();markEmpty()}
function tablePicker(anchor){const d=document.createElement('div');d.innerHTML=`<div class="mh">Tablo ekle</div><div class="gridpick">${'<i></i>'.repeat(80)}</div><div class="gplab">1 × 1</div><div class="msep"></div><button class="mi" data-st="headrow">${icon('table')}Başlık satırlı tablo</button><button class="mi" data-st="zebra">${icon('table')}Çizgili (zebra) tablo</button>`;
  const cells=qsa('.gridpick i',d);let R=1,C=1;
  cells.forEach((c,i)=>{c.onmouseenter=()=>{R=Math.floor(i/10)+1;C=i%10+1;cells.forEach((x,j)=>x.classList.toggle('h',Math.floor(j/10)<R&&j%10<C));qs('.gplab',d).textContent=`${R} × ${C}`};c.onclick=()=>{closePop();insTable(R,C,'')}});
  qsa('[data-st]',d).forEach(b=>b.onclick=()=>{closePop();insTable(4,3,b.dataset.st)});pop(anchor,d)}
function outOfList(){restoreSel();const el=selEl();const L=el&&el.closest('#ed ul,#ed ol');if(!L)return;let top=L;while(top.parentElement&&top.parentElement!==ED()&&top.parentElement.closest('ul,ol'))top=top.parentElement.closest('ul,ol');const d=document.createElement('div');d.innerHTML='<br>';top.after(d);const r=document.createRange();r.setStart(d,0);r.collapse(true);getSelection().removeAllRanges();getSelection().addRange(r);saveSel()}
function insTable(r,c,cls){outOfList();let h=`<table class="${cls}">`;for(let i=0;i<r;i++){h+='<tr>';for(let j=0;j<c;j++)h+='<td><br></td>';h+='</tr>'}insertHTML(h+'</table><div><br></div>')}
function tableTb(el){const td=el&&el.closest('td,th');const T=$('tblTb');if(!td){T.classList.remove('on');return}
  const tbl=td.closest('table');
  if(!T._b){T._b=1;T.innerHTML=`<span class="lab">Tablo</span><button class="tb" data-t="ra" data-tip="Üste satır">↥ Satır</button><button class="tb" data-t="rb" data-tip="Alta satır">↧ Satır</button><button class="tb" data-t="cl" data-tip="Sola sütun">↤ Sütun</button><button class="tb" data-t="cr" data-tip="Sağa sütun">↦ Sütun</button><span class="sep"></span>
    <button class="tb" data-t="dr">Satırı sil</button><button class="tb" data-t="dc">Sütunu sil</button><span class="sep"></span><button class="tb" data-t="hd">Başlık</button><button class="tb" data-t="zb">Zebra</button><button class="tb" data-t="bg">Hücre rengi</button><span class="sep"></span><button class="tb" data-t="del" style="color:#c43c3c">${icon('trash')}</button>`;
    T.addEventListener('mousedown',e=>e.preventDefault());
    qsa('[data-t]',T).forEach(b=>b.onclick=()=>tableOp(b.dataset.t,b))}
  T.classList.add('on');posFloat(T,tbl,true)}
function tableOp(op,btn){const el=selEl()||savedRange&&savedRange.startContainer.parentElement;const td=el&&el.closest&&el.closest('td');if(!td)return;
  const tr=td.parentElement,tbl=tr.closest('table'),ci=[...tr.children].indexOf(td);
  const mk=()=>{const c=document.createElement('td');c.innerHTML='<br>';return c};
  if(op==='ra'||op==='rb'){const n=document.createElement('tr');for(let i=0;i<tr.children.length;i++)n.appendChild(mk());op==='ra'?tr.before(n):tr.after(n)}
  if(op==='cl'||op==='cr')qsa('tr',tbl).forEach(r=>{const c=r.children[ci];if(c)op==='cl'?c.before(mk()):c.after(mk())});
  if(op==='dr'){if(qsa('tr',tbl).length>1)tr.remove();else tbl.remove()}
  if(op==='dc'){qsa('tr',tbl).forEach(r=>r.children[ci]?.remove());if(!qs('td',tbl))tbl.remove()}
  if(op==='hd')tbl.classList.toggle('headrow');if(op==='zb')tbl.classList.toggle('zebra');
  if(op==='del'){tbl.remove();$('tblTb').classList.remove('on')}
  if(op==='bg'){colorPop(btn,HILITES.concat(['#ffffff','#24303f']),c=>{td.style.background=c||'';markDirty()},'Hücre rengi');return}
  markDirty();if(document.contains(tbl))posFloat($('tblTb'),tbl,true)}
function hideTbls(){$('tblTb').classList.remove('on');hideSelTb()}
function posFloat(tb,target,above){const sc=$('scroll'),r=target.getBoundingClientRect(),sr=sc.getBoundingClientRect();
  let top=(above?r.top-sr.top-tb.offsetHeight-10:r.bottom-sr.top+10);if(top<6)top=r.bottom-sr.top+10;
  tb.style.top=(top+sc.scrollTop)+'px';tb.style.left=clamp(r.left-sr.left+r.width/2-tb.offsetWidth/2+sc.scrollLeft,8,sc.scrollWidth-tb.offsetWidth-8)+'px'}
function linkPop(anchor){saveSel();const sel=getSelection().toString();const d=document.createElement('div');d.style.width='320px';
  d.innerHTML=`<div class="mh">Bağlantı ekle</div><div style="padding:4px 8px 8px"><div class="field"><input type="text" id="lkU" placeholder="https://…"></div>${sel?'':'<div class="field"><input type="text" id="lkT" placeholder="Görünecek metin (isteğe bağlı)"></div>'}<button class="btn pri" id="lkOk" style="width:100%;justify-content:center">Ekle</button></div>`;
  pop(anchor,d);const u=$('lkU');u.focus();const go=()=>{let url=u.value.trim();if(!url)return;if(!/^[a-z]+:/i.test(url))url='https://'+url;closePop();restoreSel();
    if(getSelection().isCollapsed)insertHTML(`<a href="${esc(url)}">${esc($('lkT')?.value||url)}</a>&nbsp;`);else{document.execCommand('createLink',false,url);markDirty()}};
  $('lkOk').onclick=go;u.onkeydown=e=>{if(e.key==='Enter')go()}}
const SYMBOLS='★ ☆ ✓ ✗ ✦ ✧ ❤ ♡ ☀ ☁ ☂ ☕ ✎ ✏ ✂ ⚑ ⚐ ☎ ✉ ⌚ ⌛ ⚡ ♫ ♪ ☺ ☹ ← → ↑ ↓ ↔ ⇒ ⇐ ⇔ ↺ ↻ • ◦ ▪ ▫ ■ □ ● ○ ◆ ◇ ▲ △ ▼ ▽ ° ± × ÷ ≠ ≈ ≤ ≥ ∞ √ ∑ π Ω µ € ₺ $ £ ¥ © ® ™ § ¶ … « » „ “ ” 😀 😂 😍 🤔 😎 😴 😭 😡 👍 👎 👏 🙏 💪 🔥 ✨ 🎉 🎮 🕹️ 👾 🎨 📌 📎 📝 📚 💡 ⚠️ ✅ ❌ ⭐ 🚀 🎯 🏆 💎 🧩 🗡️ 🛡️ 🪜 🌙 ☀️ 🌈 🍀'.split(' ');
function symPop(anchor){const d=document.createElement('div');d.innerHTML=`<div class="mh">Simge & emoji</div><div class="symgrid">${SYMBOLS.map(s=>`<button>${s}</button>`).join('')}</div>`;
  qsa('button',d).forEach(b=>b.onclick=()=>{insertHTML(b.textContent)});pop(anchor,d)}
function hrMenu(anchor){menu(anchor,[{l:'Düz çizgi',i:'hr',fn:()=>insertHTML('<hr><div><br></div>')},{l:'Yıldızlı ayırıcı ✦ ✦ ✦',i:'sparkle',fn:()=>insertHTML('<hr class="dots"><div><br></div>')},{l:'Sayfa sonu (yazdırırken)',i:'page',fn:()=>insertHTML('<div class="pagebreak" contenteditable="false"></div><div><br></div>')},{l:'Sayfa sonu',i:'page',fn:()=>insertHTML('<div class="pagebreak" contenteditable="false"></div><div><br></div>')}])}
function insSlideBreak(){insertHTML('<div class="slide-break" contenteditable="false">yeni slayt</div><div><br></div>')}
function calloutMenu(anchor){menu(anchor,STYLES.filter(s=>s[0].startsWith('c-')).map(([k,l])=>({l,fn:()=>{const b=topBlock(selEl());if(b&&b.textContent.trim())setStyle(k);else insertHTML(`<div class="callout ${k.slice(2)}"><div>${esc(l.split(' ').slice(1).join(' '))}: </div></div><div><br></div>`)}})))}
function insDate(anchor){const d=new Date();menu(anchor,[
  {l:d.toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'}),fn:()=>insertHTML(esc(d.toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})))},
  {l:d.toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}),fn:()=>insertHTML(esc(d.toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})))},
  {l:d.toLocaleDateString('tr-TR'),fn:()=>insertHTML(d.toLocaleDateString('tr-TR'))},
  {l:d.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'}),fn:()=>insertHTML(d.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'}))},
  {l:'Tarih + saat',fn:()=>insertHTML(esc(d.toLocaleString('tr-TR',{dateStyle:'long',timeStyle:'short'})))}])}
let rec=null;
function dictate(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return toast('Bu tarayıcı sesle yazmayı desteklemiyor');
  if(rec){rec.stop();return}restoreSel();rec=new SR();rec.lang='tr-TR';rec.continuous=true;rec.interimResults=false;
  rec.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal){restoreSel();document.execCommand('insertText',false,e.results[i][0].transcript.trim()+' ');saveSel();markDirty()}};
  rec.onend=()=>{rec=null;$('insMic').classList.remove('on');toast('Sesle yazma durdu')};rec.onerror=e=>toast('Mikrofon hatası: '+e.error);
  rec.start();$('insMic').classList.add('on');toast('Dinliyorum… tekrar basınca durur')}
function speak(){if(speechSynthesis.speaking){speechSynthesis.cancel();$('vwSpeak').classList.remove('on');return}
  const s=getSelection().toString()||(($('title').value?$('title').value+'. ':'')+ED().innerText);const u=new SpeechSynthesisUtterance(s);u.lang='tr-TR';
  const v=speechSynthesis.getVoices().find(v=>v.lang.startsWith('tr'));if(v)u.voice=v;u.onend=()=>$('vwSpeak').classList.remove('on');speechSynthesis.speak(u);$('vwSpeak').classList.add('on')}

/* selection mini toolbar */
function selToolbar(){const s=getSelection(),T=$('selTb');if(s.isCollapsed||!s.rangeCount||!s.toString().trim()){T.classList.remove('on');return}
  if(!T._b){T._b=1;T.innerHTML=`<button class="tb" data-c="bold"><b>B</b></button><button class="tb" data-c="italic"><i style="font-family:Georgia">I</i></button><button class="tb" data-c="underline"><u>U</u></button><button class="tb" data-c="strikeThrough"><s>S</s></button><span class="sep"></span>
    <button class="tb" data-x="h">${icon('marker')}</button><button class="tb" data-x="c"><span style="font-weight:700;border-bottom:3px solid var(--accent)">A</span></button><button class="tb" data-x="fx">${icon('sparkle')}</button><button class="tb" data-x="l">${icon('link')}</button><span class="sep"></span><button class="tb" data-x="h1">H1</button><button class="tb" data-x="h2">H2</button><button class="tb" data-x="q">“ ”</button>`;
    T.addEventListener('mousedown',e=>e.preventDefault());
    qsa('[data-c]',T).forEach(b=>b.onclick=()=>exec(b.dataset.c));
    qsa('[data-x]',T).forEach(b=>b.onclick=()=>{const x=b.dataset.x;if(x==='h')setBack(S.set.back||'#fff176');if(x==='c')colorPop(b,PALETTE,setFore,'Yazı rengi');if(x==='fx')fxMenu(b);if(x==='l')linkPop(b);if(x==='h1')setStyle('h1');if(x==='h2')setStyle('h2');if(x==='q')setStyle('blockquote')})}
  const r=s.getRangeAt(0).getBoundingClientRect(),sc=$('scroll'),sr=sc.getBoundingClientRect();T.classList.add('on');
  let top=r.top-sr.top-T.offsetHeight-10;if(top<4)top=r.bottom-sr.top+10;
  T.style.top=(top+sc.scrollTop)+'px';T.style.left=clamp(r.left-sr.left+r.width/2-T.offsetWidth/2+sc.scrollLeft,6,sc.clientWidth-T.offsetWidth-6)+'px'}
function hideSelTb(){$('selTb').classList.remove('on')}

/* ============ SLASH MENU ============ */
const SLASH=[['Başlık 1','h1',()=>setStyle('h1')],['Başlık 2','h2',()=>setStyle('h2')],['Başlık 3','h3',()=>setStyle('h3')],['Madde listesi','liste',()=>exec('insertUnorderedList')],['Numaralı liste','numara',()=>exec('insertOrderedList')],
 ['Yapılacaklar','todo yapılacak',toggleCheck],['Alıntı','alinti quote',()=>setStyle('blockquote')],['Kod bloğu','kod code',()=>setStyle('pre')],['Bilgi kutusu','bilgi info',()=>setStyle('c-info')],['İpucu kutusu','ipucu tip',()=>setStyle('c-tip')],
 ['Uyarı kutusu','uyari',()=>setStyle('c-warn')],['Tablo','tablo table',()=>insTable(3,3,'headrow')],['Görsel','gorsel resim image',()=>$('fImg').click()],['Çizim','cizim draw',()=>openDraw()],['Yapışkan not','yapiskan sticky',()=>addSticky()],
 ['Metin kutusu','metin kutu',()=>addTextBox()],['Ayırıcı','ayirici hr',()=>insertHTML('<hr><div><br></div>')],['Yeni sunum','sunum slayt powerpoint',()=>newDeckDialog()],['Açılır bölüm','acilir toggle',()=>insertHTML('<details open><summary>Başlık</summary><div>İçerik…</div></details><div><br></div>')],['Bugünün tarihi','tarih bugun',()=>insertHTML(esc(new Date().toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})))]];
let slashPos=null;
function openSlash(){const s=getSelection();if(!s.rangeCount)return;const r=s.getRangeAt(0).getBoundingClientRect();slashPos={node:s.anchorNode,off:s.anchorOffset};
  const a=document.createElement('span');a.style.cssText=`position:fixed;left:${r.left}px;top:${r.top}px;width:1px;height:${r.height||20}px`;document.body.appendChild(a);
  const d=document.createElement('div');d.className='slashmenu';let q='',idx=0;
  const list=()=>SLASH.filter(x=>!q||trLower(x[0]+' '+x[1]).includes(trLower(q)));
  const draw=()=>{const L=list();idx=clamp(idx,0,L.length-1);d.innerHTML=`<div class="mh">Ekle ${q?'· '+esc(q):''}</div>`+(L.length?L.map((x,i)=>`<button class="mi ${i===idx?'kb':''}" data-i="${i}">${esc(x[0])}</button>`).join(''):'<div class="mi" style="color:var(--muted)">Sonuç yok</div>');
    qsa('[data-i]',d).forEach(b=>b.onclick=()=>run(+b.dataset.i))};
  const run=i=>{const it=list()[i];close();if(!it)return;removeSlash(q.length+1);it[2]()};
  const close=()=>{document.removeEventListener('keydown',kd,true);closePop();a.remove()};
  const kd=e=>{if(!popEl||!popEl.classList.contains('slashmenu')){document.removeEventListener('keydown',kd,true);return}
    if(e.key==='ArrowDown'){e.preventDefault();idx++;draw()}else if(e.key==='ArrowUp'){e.preventDefault();idx--;draw()}
    else if(e.key==='Enter'){e.preventDefault();run(idx)}else if(e.key==='Escape'){e.preventDefault();close()}
    else if(e.key==='Backspace'){if(!q){close();return}q=q.slice(0,-1);draw()}else if(e.key.length===1&&!e.ctrlKey){if(e.key===' '&&!list().length){close();return}q+=e.key;draw()}};
  draw();pop(a,d,{cls:'slashmenu'});document.addEventListener('keydown',kd,true)}
function removeSlash(len){const s=getSelection();if(!s.rangeCount)return;const n=s.anchorNode;if(n.nodeType!==3)return;const o=s.anchorOffset;const st=Math.max(0,o-len);
  n.textContent=n.textContent.slice(0,st)+n.textContent.slice(o);const r=document.createRange();r.setStart(n,st);r.collapse(true);s.removeAllRanges();s.addRange(r);
  if(!n.textContent){const b=n.parentElement;if(b&&b!==ED()&&!b.textContent){b.innerHTML='<br>';const r2=document.createRange();r2.setStart(b,0);r2.collapse(true);s.removeAllRanges();s.addRange(r2)}}saveSel()}

/* ============ KEYS IN EDITOR ============ */
const MD={'-':'ul','*':'ul','1.':'ol','[]':'check','#':'h1','##':'h2','###':'h3','>':'quote','```':'pre'};
function edKey(e){
  if(!e.ctrlKey&&!e.altKey&&e.key.length===1)ensureBlock();
  if(S.set.sound&&e.key.length===1)clack();
  if(e.key==='/'&&!e.ctrlKey){const s=getSelection();const n=s.anchorNode;const before=n&&n.nodeType===3?n.textContent.slice(0,s.anchorOffset):'';if(!before.trim()||/\s$/.test(before))setTimeout(openSlash,0)}
  if(e.key==='Tab'){e.preventDefault();const el=selEl();const td=el&&el.closest('td');
    if(td){const cells=qsa('td',td.closest('table'));let nx=cells[cells.indexOf(td)+(e.shiftKey?-1:1)];if(!nx&&!e.shiftKey){tableOp('rb');nx=qsa('td',td.closest('table'))[cells.indexOf(td)+1]}
      if(nx){const r=document.createRange();r.selectNodeContents(nx);r.collapse(false);const s=getSelection();s.removeAllRanges();s.addRange(r)}return}
    if(el&&el.closest('li'))document.execCommand(e.shiftKey?'outdent':'indent');else document.execCommand('insertText',false,'    ');markDirty();return}
  if(e.key===' '){const s=getSelection();if(!s.isCollapsed)return;const node=s.anchorNode;if(!node||node.nodeType!==3)return;
    const before=node.textContent.slice(0,s.anchorOffset);const blk=node.parentElement.closest('#ed div,#ed p,#ed h1,#ed h2,#ed h3')||topBlock(node.parentElement);if(blk&&blk.querySelector('div,ul,ol'))return;
    if(!blk||blk.textContent.slice(0,before.length)!==before||blk.firstChild&&blk.textContent.indexOf(before)!==0)return;
    const k=MD[before.trim()];if(!k||before!==before.trim())return;
    e.preventDefault();const rest=node.textContent.slice(s.anchorOffset);const r=document.createRange();
    if(!rest&&blk.textContent===before){blk.innerHTML='<br>';r.setStart(blk,0)}else{node.textContent=rest;r.setStart(node,0)}
    r.collapse(true);s.removeAllRanges();s.addRange(r);saveSel();
    ({ul:()=>exec('insertUnorderedList'),ol:()=>exec('insertOrderedList'),check:toggleCheck,quote:()=>setStyle('blockquote'),pre:()=>setStyle('pre')}[k]||(()=>setStyle(k)))()}
  if(e.key==='Enter'&&!e.shiftKey){const el=selEl();const co=el&&el.closest('#ed .callout,#ed pre,#ed blockquote');
    if(co&&co.tagName==='BLOCKQUOTE'&&!co.textContent.trim()&&!co.querySelector('img')){e.preventDefault();const d=document.createElement('div');d.innerHTML='<br>';co.replaceWith(d);const r=document.createRange();r.setStart(d,0);r.collapse(true);getSelection().removeAllRanges();getSelection().addRange(r);markDirty();return}
    if(co){const s=getSelection();let line=el===co?null:el.closest('#ed .callout > *,#ed blockquote > *');let empty=false,last=false;
      if(co.tagName==='PRE'){const t=co.textContent;const r=s.getRangeAt(0);const pre=document.createRange();pre.selectNodeContents(co);pre.setEnd(r.startContainer,r.startOffset);const before=pre.toString();empty=before.endsWith('\n')&&!t.slice(before.length).trim();last=empty;
        if(empty){e.preventDefault();const tn=r.startContainer;if(tn.nodeType===3&&tn.textContent.endsWith('\n'))tn.textContent=tn.textContent.replace(/\n+$/,'')}}
      else if(line){empty=!line.textContent.trim()&&!line.querySelector('img');last=!line.nextElementSibling}
      if(empty&&last){e.preventDefault();if(line)line.remove();const d=document.createElement('div');d.innerHTML='<br>';co.after(d);const r=document.createRange();r.setStart(d,0);r.collapse(true);s.removeAllRanges();s.addRange(r);markDirty()}}}
}
function edClick(e){
  const li=e.target.closest('ul.check > li');if(li&&e.offsetX<30){li.classList.toggle('done');markDirty();return}
  const a=e.target.closest('a');if(a&&(e.ctrlKey||e.metaKey)){e.preventDefault();window.open(a.href,'_blank')}
  const img=e.target.closest('img');if(img){selectInline(img);return}
  if(painter)setTimeout(applyPainter,0)}
let actx=null;function clack(){try{actx=actx||new AudioContext();const o=actx.createOscillator(),g=actx.createGain(),f=actx.createBiquadFilter();
  const b=actx.createBuffer(1,actx.sampleRate*.03,actx.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,4);
  const src=actx.createBufferSource();src.buffer=b;f.type='bandpass';f.frequency.value=1800+Math.random()*900;g.gain.value=.35;src.connect(f).connect(g).connect(actx.destination);src.start()}catch(e){}}
function twScroll(){const s=getSelection();if(!s.rangeCount)return;const r=s.getRangeAt(0).getBoundingClientRect();const sc=$('scroll'),sr=sc.getBoundingClientRect();if(!r.height)return;
  const target=sr.top+sr.height*.45;sc.scrollBy({top:r.top-target,behavior:'smooth'})}

/* ============ PASTE / DROP ============ */
function edPaste(e){const files=[...(e.clipboardData?.items||[])].filter(i=>i.kind==='file'&&i.type.startsWith('image/')).map(i=>i.getAsFile());
  if(files.length){e.preventDefault();addImages(files);return}
  const html=e.clipboardData.getData('text/html');
  if(html&&/<(script|style|meta|o:p)/i.test(html)){e.preventDefault();const t=document.createElement('template');t.innerHTML=html;
    qsa('script,style,meta,link,title,o\\:p,xml',t.content).forEach(x=>x.remove());qsa('*',t.content).forEach(x=>{[...x.attributes].forEach(a=>{if(/^on/i.test(a.name)||a.name==='class'&&/Mso/.test(a.value))x.removeAttribute(a.name)})});
    document.execCommand('insertHTML',false,t.innerHTML)}
  setTimeout(()=>{markDirty();markEmpty()},0)}

/* ============ FIND & REPLACE ============ */
function findReplace(){const n=cur();if(!n)return;
  const m=modal({title:'Bul ve değiştir',body:`<div class="field"><label>Aranan</label><input type="text" id="frF"></div><div class="field"><label>Yeni metin</label><input type="text" id="frR"></div><label class="chk"><input type="checkbox" id="frC"> Büyük/küçük harf duyarlı</label><div id="frInfo" style="font-size:12px;color:var(--muted);margin-top:8px"></div>`,
   foot:[{l:'Kapat',cls:'ghost',fn:c=>c()},{l:'Sonrakini bul',fn:()=>find()},{l:'Tümünü değiştir',cls:'pri',fn:()=>repAll()}]});m.el.style.width='460px';$('frF').focus();
  const count=()=>{const f=$('frF').value;if(!f){$('frInfo').textContent='';return 0}const t=ED().innerText;const c=$('frC').checked;const re=new RegExp(f.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),c?'g':'gi');const k=(t.match(re)||[]).length;$('frInfo').textContent=k+' eşleşme';return k};
  $('frF').oninput=count;$('frC').onchange=count;
  const find=()=>{const f=$('frF').value;if(!f)return;ED().focus();if(!window.find(f,$('frC').checked,false,true)){getSelection().removeAllRanges();placeEnd();getSelection().collapse(ED(),0);window.find(f,$('frC').checked,false,true)}};
  const repAll=()=>{const f=$('frF').value,r=$('frR').value;if(!f)return;const k=count();const c=$('frC').checked;const re=new RegExp(f.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),c?'g':'gi');
    const w=document.createTreeWalker(ED(),NodeFilter.SHOW_TEXT);const ns=[];while(w.nextNode())ns.push(w.currentNode);ns.forEach(t=>{if(re.test(t.textContent)){re.lastIndex=0;t.textContent=t.textContent.replace(re,r)}re.lastIndex=0});markDirty();toast(k+' yer değiştirildi');count()}}

/* ============ RIGHT PANEL ============ */
let rpTab='outline';
function toggleRP(tab){const R=$('rpanel');if(tab&&R.classList.contains('hide')){R.classList.remove('hide');rpTab=tab}else if(tab&&rpTab!==tab){rpTab=tab}else R.classList.toggle('hide');
  qsa('#rpTabs button').forEach(b=>b.classList.toggle('on',b.dataset.rp===rpTab));if(!R.classList.contains('hide'))renderRP()}
async function renderRP(){const B=$('rpBody'),n=cur();if(!n){B.innerHTML='';return}
  qsa('#rpTabs button').forEach(b=>b.classList.toggle('on',b.dataset.rp===rpTab));
  if(rpTab==='outline'){const hs=qsa('h1,h2,h3',ED());B.innerHTML=hs.length?hs.map((h,i)=>`<div class="ol-it l${h.tagName[1]}" data-i="${i}">${esc(h.textContent||'—')}</div>`).join(''):'<div style="color:var(--muted);font-size:12.5px;padding:10px 4px">Başlık ekledikçe burada anahat oluşur. (Giriş → stil → Başlık 1/2/3)</div>';
    qsa('.ol-it',B).forEach(e=>e.onclick=()=>hs[+e.dataset.i].scrollIntoView({behavior:'smooth',block:'center'}))}
  if(rpTab==='hist'){const vs=(await dbAll('versions')).filter(v=>v.note===n.id).sort((a,b)=>b.at-a.at);
    B.innerHTML=`<button class="btn" id="verNow" style="width:100%;justify-content:center;margin-bottom:10px">${icon('history')} Şimdi sürüm kaydet</button>`+(vs.length?vs.map(v=>`<div class="ver-it"><div class="d">${fmtDate(v.at,1)}</div><div class="s">${esc(v.title||'Başlıksız')} · ${v.words} kelime</div><button class="btn" data-v="${v.id}" style="height:28px;font-size:12px">${icon('restore')} Bu sürüme dön</button></div>`).join(''):'<div style="color:var(--muted);font-size:12.5px">Henüz sürüm yok. Yazdıkça birkaç dakikada bir otomatik kaydedilir.</div>');
    $('verNow').onclick=async()=>{flushSave();await maybeVersion(n,true);toast('Sürüm kaydedildi');renderRP()};
    qsa('[data-v]',B).forEach(b=>b.onclick=async()=>{const v=vs.find(x=>x.id===b.dataset.v);if(!await confirmBox('Sayfa bu sürüme dönsün mü? (Şu anki hali de sürüm olarak saklanır)','Geri dön'))return;
      flushSave();await maybeVersion(n,true);n.html=v.html;n.title=v.title;n.objects=v.objects||[];if(v.paper)n.paper={...n.paper,...v.paper};await persist(n);openNote(n.id);toast('Sürüm geri yüklendi')})}
  if(rpTab==='info'){const t=ED().innerText;const w=(t.match(/\S+/g)||[]).length;const sent=(t.match(/[.!?…]+/g)||[]).length;
    B.innerHTML=[['Oluşturuldu',fmtDate(n.created,1)],['Son düzenleme',fmtDate(n.updated,1)],['Defter',bookOf(n)?.name||'Genel'],['Kelime',w],['Karakter',t.length],['Cümle',sent],['Paragraf',ED().children.length],['Görsel/nesne',n.objects.length+qsa('img',ED()).length],['Okuma süresi','~'+Math.max(1,Math.round(w/200))+' dk'],['Konuşma süresi','~'+Math.max(1,Math.round(w/130))+' dk']].map(([k,v])=>`<div class="kv"><span>${k}</span><span>${esc(v)}</span></div>`).join('')+
    `<div class="field" style="margin-top:14px"><label>Bu sayfa için kelime hedefi</label><input type="text" id="goalIn" value="${n.goal||''}" placeholder="örn. 500"></div>`;
    $('goalIn').onchange=e=>{n.goal=parseInt(e.target.value)||0;n._goalDone=0;persist(n);stats()}}}

/* ============ WIRE RIBBON ============ */
function wireEditor(){
  const E=ED();try{document.execCommand('styleWithCSS',false,true)}catch(e){}
  E.addEventListener('input',()=>{normBlocks();markEmpty();markDirty()});E.addEventListener('keydown',edKey);E.addEventListener('click',edClick);E.addEventListener('paste',edPaste);
  E.addEventListener('focus',()=>{ensureBlock();markEmpty()});
  E.addEventListener('mouseup',()=>{if(painter)setTimeout(applyPainter,0)});
  $('title').oninput=()=>{updateCrumb();markDirty();document.title=($('title').value||'Başlıksız')+' — ESSTYPE'};$('title').onkeydown=e=>{if(e.key==='Enter'||e.key==='ArrowDown'){e.preventDefault();E.focus();const r=document.createRange();r.setStart(E,0);r.collapse(true);getSelection().removeAllRanges();getSelection().addRange(r)}};
  const R=$('ribbon');R.addEventListener('mousedown',e=>{if(e.target.closest('button,.combo'))e.preventDefault()});
  qsa('.tab',R).forEach(t=>t.onclick=()=>{qsa('.tab',R).forEach(x=>x.classList.toggle('on',x===t));qsa('.panel',R).forEach(p=>p.classList.toggle('on',p.dataset.panel===t.dataset.tab));S.set.tab=t.dataset.tab;saveSet()});
  qsa('[data-cmd]',R).forEach(b=>b.onclick=()=>exec(b.dataset.cmd));
  $('styleCombo').onclick=e=>styleMenu(e.currentTarget);
  $('fontCombo').onclick=e=>fontPop(e.currentTarget,f=>{exec('fontName',`'${f}'`);qs('#fontCombo .v').textContent=f},qs('#fontCombo .v').textContent);
  $('szDown').onclick=()=>{const v=+$('szIn').value||18;applySize(SIZES.slice().reverse().find(s=>s<v)||v-1)};
  $('szUp').onclick=()=>{const v=+$('szIn').value||18;applySize(SIZES.find(s=>s>v)||v+4)};
  $('szIn').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();applySize(+$('szIn').value);ED().focus()}};
  $('szIn').onfocus=()=>{const i=$('szIn');i.dataset.pop='1';const d=document.createElement('div');d.innerHTML=SIZES.map(s=>`<button class="mi" data-s="${s}">${s}</button>`).join('');d.style.width='80px';qsa('[data-s]',d).forEach(b=>b.onclick=()=>{closePop();applySize(+b.dataset.s)});pop(i,d).style.minWidth='80px'};
  $('caseBtn').onclick=e=>caseMenu(e.currentTarget);
  $('alignBtn').onclick=e=>menu(e.currentTarget,[['justifyLeft','aleft','Sola hizala'],['justifyCenter','acenter','Ortala'],['justifyRight','aright','Sağa hizala'],['justifyFull','ajust','İki yana yasla']].map(([c,i,l])=>({l,i,fn:()=>{exec(c);qs('#alignBtn svg').outerHTML=icon(i)}})));
  $('foreBtn').onclick=e=>colorPop(e.currentTarget,PALETTE,setFore,'Yazı rengi');
  $('backBtn').onclick=e=>colorPop(e.currentTarget,HILITES,setBack,'Vurgulayıcı');
  $('foreSw').style.background=S.set.fore||'#b0413e';$('backSw').style.background=S.set.back||'#fff176';
  $('fxBtn').onclick=e=>fxMenu(e.currentTarget);$('chkBtn').onclick=toggleCheck;$('painterBtn').onclick=formatPainter;
  // insert
  $('insImg').onclick=()=>$('fImg').click();$('insDraw').onclick=()=>openDraw();$('insSticky').onclick=()=>addSticky();$('insText').onclick=()=>addTextBox();
  $('insShape').onclick=e=>shapeMenu(e.currentTarget);$('insTable').onclick=e=>tablePicker(e.currentTarget);$('insCallout').onclick=e=>calloutMenu(e.currentTarget);
  $('insCode').onclick=()=>setStyle('pre');$('insToggle').onclick=()=>insertHTML('<details open><summary>Başlık</summary><div>İçerik…</div></details><div><br></div>');
  $('insLink').onclick=e=>linkPop(e.currentTarget);$('insSym').onclick=e=>symPop(e.currentTarget);$('insDate').onclick=e=>insDate(e.currentTarget);$('insHr').onclick=e=>hrMenu(e.currentTarget);
  $('insMic').onclick=dictate;
  // design
  $('dzPaper').onclick=e=>paperPicker(e.currentTarget);$('dzTone').onclick=e=>tonePicker(e.currentTarget);$('dzSize').onclick=e=>sizePicker(e.currentTarget);$('dzLh').onclick=e=>lhPicker(e.currentTarget);
  $('dzMargin').onclick=()=>{const n=cur();n.paper.margin=!n.paper.margin;applyPaper();markDirty(true)};$('dzHoles').onclick=()=>{const n=cur();n.paper.holes=!n.paper.holes;applyPaper();markDirty(true)};
  $('dzTitleFont').onclick=e=>fontPop(e.currentTarget,f=>{cur().paper.titleFont=f;applyPaper();markDirty(true)},cur()?.paper.titleFont);
  $('dzBodyFont').onclick=e=>{const d=fontPop(e.currentTarget,f=>{cur().paper.font=f;applyPaper();markDirty(true)},cur()?.paper.font)};
  $('dzDefault').onclick=()=>{const p=cur().paper;Object.assign(S.set,{paper:p.type,tone:p.tone,lh:p.lh,size:p.size,margin:p.margin,holes:p.holes,font:p.font,fsize:p.fsize,titleFont:p.titleFont});saveSet();toast('Yeni sayfalar artık bu kağıt ve yazıyla açılacak')};
  // view
  $('vwTheme').onclick=themeModal;$('vwDark').onclick=toggleDark;
  $('vwFocus').onclick=()=>{document.body.classList.toggle('focus');toast(document.body.classList.contains('focus')?'Odak modu — çıkmak için Esc':'Odak modu kapandı')};
  $('vwPara').onclick=()=>{S.set.paraFocus=!S.set.paraFocus;$('sheet').classList.toggle('focusp',S.set.paraFocus);$('vwPara').classList.toggle('on',S.set.paraFocus);saveSet();syncRibbon()};
  $('vwType').onclick=()=>{document.body.classList.toggle('typewriter');$('vwType').classList.toggle('on')};
  $('vwFull').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
  $('vwOutline').onclick=()=>toggleRP('outline');$('vwHist').onclick=()=>toggleRP('hist');$('vwFind').onclick=findReplace;
  $('vwSpeak').onclick=speak;$('vwSpell').onclick=()=>{S.set.spell=!S.set.spell;ED().spellcheck=S.set.spell;$('vwSpell').classList.toggle('on',S.set.spell);saveSet();toast('Yazım denetimi '+(S.set.spell?'açık':'kapalı'))};
  $('vwGoal').onclick=async()=>{const v=await promptBox('Günlük/varsayılan kelime hedefi (0 = kapalı)',S.set.goal||'');if(v!==null){S.set.goal=parseInt(v)||0;saveSet();stats()}};
  $('vwSound').onclick=()=>{S.set.sound=!S.set.sound;$('vwSound').classList.toggle('on',S.set.sound);saveSet();if(S.set.sound)clack()};
  $('vwSpell').classList.toggle('on',S.set.spell!==false);$('vwSound').classList.toggle('on',!!S.set.sound);if(S.set.paraFocus){$('vwPara').classList.add('on');$('sheet').classList.add('focusp')}
  $('rpClose').onclick=()=>$('rpanel').classList.add('hide');qsa('#rpTabs button').forEach(b=>b.onclick=()=>{rpTab=b.dataset.rp;renderRP()});
  // zoom
  const z=v=>{S.set.zoom=clamp(v,50,200);document.documentElement.style.setProperty('--zoom',S.set.zoom/100);$('zoomR').value=S.set.zoom;$('zoomV').textContent='%'+S.set.zoom;saveSet();if(selObj)drawSel()};
  $('zoomR').oninput=e=>z(+e.target.value);$('zIn').onclick=()=>z(S.set.zoom+10);$('zOut').onclick=()=>z(S.set.zoom-10);z(S.set.zoom||100);
  $('stGoal').onclick=()=>toggleRP('info');
  $('scroll').addEventListener('wheel',ev=>{if(!ev.ctrlKey)return;ev.preventDefault();z(S.set.zoom+(ev.deltaY<0?10:-10))},{passive:false});
  $('scroll').addEventListener('scroll',pageIndicator,{passive:true});
  E.addEventListener('load',()=>schedulePaginate(),true);
  document.fonts.ready.then(()=>{PG.key='';schedulePaginate()});
  if(S.set.tab){const t=qs(`.tab[data-tab="${S.set.tab}"]`);if(t)t.click()}
}
