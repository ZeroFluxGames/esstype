/* ============ EXPORT ============ */
const FMTS=[['pdf','PDF','Yazdır / PDF kaydet','#d63b3b'],['docx','Word','.docx belge','#2b579a'],['pptx','PowerPoint','.pptx sunum','#d24726'],['png','Görsel','.png resim','#2f9e44'],
 ['jpg','JPEG','.jpg resim','#e67700'],['md','Markdown','.md metin','#495057'],['html','Web sayfası','.html','#7048e8'],['txt','Düz metin','.txt','#868e96'],['esst','ESSTYPE','.esst (paylaş/aç)','#b0413e']];
let expSel='pdf';
function exportDialog(){const n=cur();if(!n)return toast('Önce bir sayfa aç');flushSave();if(isDeck(n))return deckExportDialog();
  const B=document.createElement('div');
  const draw=()=>{B.innerHTML=`<div class="fmtgrid">${FMTS.map(([k,l,s,c])=>`<div class="fmt ${expSel===k?'on':''}" data-k="${k}"><div class="ic" style="background:${c}">${k.toUpperCase().slice(0,4)}</div><b>${l}</b><small>${s}</small></div>`).join('')}</div><div class="expopts" id="expOpts"></div>`;
    qsa('.fmt',B).forEach(f=>f.onclick=()=>{expSel=f.dataset.k;draw()});opts()};
  const O={bg:true,title:true,num:true,page:'A4',orient:'portrait',scale:2,imgs:true,margins:'normal'};
  const opts=()=>{const E=$('expOpts');const k=expSel;let h='';
    const ck=(key,l)=>`<label class="chk"><input type="checkbox" data-o="${key}" ${O[key]?'checked':''}> ${l}</label>`;
    const sg=(key,l,arr)=>`<div class="field"><label>${l}</label><div class="seg" data-s="${key}">${arr.map(([v,t])=>`<button data-v="${v}" class="${O[key]==v?'on':''}">${t}</button>`).join('')}</div></div>`;
    if(k==='pdf'){const g=pageGeom(n);const ps=PAGESIZES.find(x=>x[0]===n.paper.size)||[];h=`<div style="grid-column:1/-1;font-size:13px;color:var(--text2);margin-bottom:6px">Sayfa boyutu: <b>${ps[1]}</b> · ${g.paged?`<b>${PG.count}</b> sayfa — ekranda gördüğün sayfalar birebir basılır.`:'kesintisiz sayfa, yazıcı otomatik böler.'} <button class="btn" id="expSize" style="display:inline-flex;height:28px;margin-left:6px">Boyutu değiştir</button></div>`+ck('bg','Kağıt deseni ve rengi dahil')+ck('title','Başlığı yazdır')+ck('num','Sayfa numaraları')+`<div style="grid-column:1/-1;font-size:12px;color:var(--muted)">Açılan pencerede hedef olarak <b>“PDF olarak kaydet”</b>i seç. Kağıt deseni için “Diğer ayarlar → Arka plan grafikleri” işaretli olsun.</div>`;}
    if(k==='docx')h=sg('page','Sayfa',[['A4','A4'],['A5','A5'],['Letter','Letter']])+sg('margins','Kenar boşluğu',[['narrow','Dar'],['normal','Normal'],['wide','Geniş']])+ck('imgs','Görselleri ve notları dahil et')+ck('title','Başlığı ekle')+`<div style="grid-column:1/-1;font-size:12px;color:var(--muted)">Biçimler (kalın, renk, vurgu, yazı tipi, liste, tablo) Word’e aktarılır.</div>`;
    if(k==='pptx')h=`<div style="grid-column:1/-1;font-size:13px;color:var(--text2)">Sunum teması: <b>${DECKS[deckOf(n).theme]?.n}</b> · ${buildSlides(n).length} slayt. <button class="btn" id="expDeck" style="display:inline-flex;height:28px;margin-left:8px">Temayı değiştir</button><div style="font-size:12px;color:var(--muted);margin-top:6px">Not: Geçiş animasyonları PowerPoint dosyasına taşınmaz; ESSTYPE içinde sunarken çalışır.</div></div>`;
    if(k==='png'||k==='jpg')h=sg('scale','Çözünürlük',[[1,'Normal'],[2,'Yüksek (2x)'],[3,'Çok yüksek (3x)']])+ck('bg','Kağıt deseni dahil');
    if(k==='html')h=ck('bg','Kağıt deseni ve görünümü koru')+`<div style="font-size:12px;color:var(--muted)">Tek dosyalık, her tarayıcıda açılan sayfa.</div>`;
    if(k==='md'||k==='txt')h=ck('title','Başlığı ekle');
    if(k==='esst')h=`<div style="grid-column:1/-1;font-size:12.5px;color:var(--text2)">Sayfanın tam kopyası (görseller, kağıt, sunum ayarları dahil). Başka bir ESSTYPE’ta <b>Ayarlar → İçe aktar</b> ile açılır.</div>`;
    E.innerHTML=h;qsa('[data-o]',E).forEach(c=>c.onchange=()=>O[c.dataset.o]=c.checked);
    qsa('[data-s]',E).forEach(s=>qsa('button',s).forEach(b=>b.onclick=()=>{O[s.dataset.s]=isNaN(+b.dataset.v)?b.dataset.v:+b.dataset.v;opts()}));
    const ed=$('expDeck');if(ed)ed.onclick=()=>{m.close();deckModal()};const es=$('expSize');if(es)es.onclick=()=>{sizePicker(es);const t=setInterval(()=>{if(!popEl){clearInterval(t);opts()}},300)}};
  const m=modal({title:'Çıktı al',body:B,wide:true,foot:[{l:'Vazgeç',cls:'ghost',fn:c=>c()},{html:icon('download')+' Çıktı al',cls:'pri',fn:async c=>{c();await doExport(expSel,O)}}]});
  m.el.style.width='min(820px,94vw)';draw()}
const fname=n=>(n.title||'sayfa').trim().slice(0,80)||'sayfa';
async function doExport(k,O){const n=cur();deselect();hideTbls();
  try{
  if(k==='pdf')return printNote(O);
  if(k==='docx')return await exportDOCX(n,O);
  if(k==='pptx')return await exportPPTX();
  if(k==='png'||k==='jpg')return await exportImage(n,k,O);
  if(k==='md')return download(fname(n)+'.md',(O.title&&n.title?'# '+n.title+'\n\n':'')+toMD(ED()),'text/markdown;charset=utf-8');
  if(k==='txt')return download(fname(n)+'.txt',(O.title&&n.title?n.title+'\n\n':'')+ED().innerText,'text/plain;charset=utf-8');
  if(k==='html')return download(fname(n)+'.html',exportHTMLDoc(n,O),'text/html;charset=utf-8');
  if(k==='esst')return download(fname(n)+'.esst',JSON.stringify({app:'esstype',v:1,notes:[n]}),'application/json');
  }catch(e){console.error(e);toast('Çıktı alınamadı: '+e.message)}}
function printNote(O){const n=cur();if(!n)return;flushSave();deselect();hideTbls();const g=pageGeom(n);
  const st=document.createElement('style');st.id='prpage';
  st.textContent=g.paged?`@page{size:${g.W}px ${g.H}px;margin:0}`:`@page{size:${g.W+40}px auto;margin:10mm 0}`;document.head.appendChild(st);
  document.body.classList.toggle('pr-nobg',O.bg===false);document.body.classList.toggle('pr-notitle',O.title===false);document.body.classList.toggle('pr-nonum',O.num===false);document.body.classList.add('printing');
  const z=S.set.zoom;document.documentElement.style.setProperty('--zoom',1);PG.printing=true;PG.key='';paginate();
  const done=()=>{removeEventListener('afterprint',done);st.remove();document.body.classList.remove('pr-nobg','pr-notitle','pr-nonum','printing');document.documentElement.style.setProperty('--zoom',z/100);PG.printing=false;PG.key='';paginate()};
  addEventListener('afterprint',done);setTimeout(()=>window.print(),120)}
/* --- markdown --- */
function toMD(root){const out=[];const inl=n=>{let s='';n.childNodes.forEach(c=>{if(c.nodeType===3){s+=c.textContent;return}if(c.nodeType!==1)return;const t=c.tagName;const x=inl(c);
    if(t==='B'||t==='STRONG'||c.style?.fontWeight>=600)s+=x.trim()?`**${x}**`:x;else if(t==='I'||t==='EM'||c.style?.fontStyle==='italic')s+=x.trim()?`*${x}*`:x;else if(t==='S'||t==='STRIKE')s+=`~~${x}~~`;
    else if(t==='CODE')s+='`'+x+'`';else if(t==='A')s+=`[${x}](${c.getAttribute('href')})`;else if(t==='BR')s+='  \n';else if(t==='IMG')s+=`![](${c.src.startsWith('data:')?'görsel':c.src})`;else s+=x});return s};
  const blk=(el,depth=0)=>{const t=el.tagName;if(!t)return;
    if(/^H[1-3]$/.test(t))out.push('#'.repeat(+t[1])+' '+inl(el).trim(),'');
    else if(t==='UL'||t==='OL'){qsa(':scope > li',el).forEach((li,i)=>{const chk=el.classList.contains('check');const pre='  '.repeat(depth)+(chk?`- [${li.classList.contains('done')?'x':' '}] `:t==='OL'?`${i+1}. `:'- ');
      const c=li.cloneNode(true);qsa('ul,ol',c).forEach(x=>x.remove());out.push(pre+inl(c).trim());qsa(':scope > ul,:scope > ol',li).forEach(s=>blk(s,depth+1))});if(!depth)out.push('')}
    else if(t==='BLOCKQUOTE')out.push('> '+inl(el).trim(),'');else if(t==='PRE')out.push('```',el.innerText,'```','');
    else if(t==='HR')out.push('---','');else if(t==='TABLE'){const rows=qsa('tr',el).map(r=>'| '+qsa('td,th',r).map(c=>inl(c).trim().replace(/\|/g,'\\|')).join(' | ')+' |');if(rows.length){out.push(rows[0],'|'+' --- |'.repeat(qsa('tr',el)[0].children.length),...rows.slice(1),'')}}
    else if(el.classList.contains('callout'))out.push('> **'+({info:'Bilgi',tip:'İpucu',warn:'Uyarı',idea:'Fikir',danger:'Önemli'}[[...el.classList].find(c=>c!=='callout')]||'Not')+':** '+inl(el).trim(),'');
    else if(el.classList.contains('slide-break'))out.push('---','');
    else if(el.tagName==='DIV'&&[...el.children].some(c=>/^(UL|OL|TABLE|H[1-3]|BLOCKQUOTE|PRE|DIV)$/.test(c.tagName))&&!el.className)[...el.children].forEach(c=>blk(c,depth));
    else{const s=inl(el).trim();out.push(s,'')}};
  [...root.children].forEach(c=>blk(c));return out.join('\n').replace(/\n{3,}/g,'\n\n')}
/* --- html --- */
function exportHTMLDoc(n,O){deselect();const sh=$('sheet').cloneNode(true);
  qsa('#selbox,.sizetip,.pgcut',sh).forEach(x=>x.remove());qsa('[contenteditable]',sh).forEach(x=>x.removeAttribute('contenteditable'));
  const ti=qs('#title',sh);const d=document.createElement('div');d.id='title';d.textContent=n.title;ti.replaceWith(d);qs('#meta',sh).innerHTML=`<span>${fmtDate(n.created,1)}</span>`;
  if(!O.bg){qsa('.rules,.ml,.ml2,.holes,.tex,.cue,.hdr',sh).forEach(x=>x.remove())}
  sh.style.zoom='1';
  const rules=[...document.styleSheets].flatMap(s=>{try{return[...s.cssRules]}catch(e){return[]}}).map(r=>r.cssText).filter(c=>/#sheet|#paper|#pages|\.pg|#ed|\.obj|#title|#meta|#objs/.test(c)&&!/@font-face|@media print/.test(c)).join('\n');
  const root=getComputedStyle(document.documentElement);const vars=['--accent','--ui','--mono','--bg','--muted'].map(v=>`${v}:${root.getPropertyValue(v)}`).join(';');
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(n.title||'Sayfa')}</title>
<style>${usedFontCSS($('sheet'))}</style><style>:root{${vars}}body{margin:0;background:${O.bg?'#e9e4da':'#fff'};font-family:'Inter','Segoe UI',sans-serif}.wrap{display:flex;justify-content:center;padding:40px 20px}
${rules}</style></head><body><div class="wrap">${sh.outerHTML}</div></body></html>`}
/* --- image --- */
function usedFontCSS(root){const fams=new Set();[root,...qsa('*',root)].forEach(e=>{const f=getComputedStyle(e).fontFamily.split(',')[0].replace(/['"]/g,'').trim();fams.add(f)});
  const css=$('fontcss')?.textContent||'';return css.split('\n').filter(l=>{const m=l.match(/font-family:'([^']+)'/);return m&&fams.has(m[1])}).join('\n')}
async function exportImage(n,k,O){toast('Görsel hazırlanıyor…');const sh=$('sheet');const z=S.set.zoom;document.documentElement.style.setProperty('--zoom',1);
  const sp=$('paper').style.backgroundImage;if(!O.bg)$('paper').style.backgroundImage='none';await sleep(60);
  try{const opt={pixelRatio:O.scale||2,fontEmbedCSS:usedFontCSS(sh),cacheBust:false,backgroundColor:getComputedStyle(sh).backgroundColor,filter:el=>!(el.id==='selbox'||el.id==='sizetip'||el.classList?.contains('mline')&&!O.bg)};
    const url=k==='png'?await htmlToImage.toPng(sh,opt):await htmlToImage.toJpeg(sh,{...opt,quality:.93});
    const b=await (await fetch(url)).blob();download(fname(n)+'.'+k,b);toast('Görsel kaydedildi')}
  finally{document.documentElement.style.setProperty('--zoom',z/100);$('paper').style.backgroundImage=sp;applyPaper()}}
/* --- docx --- */
function rgbHex(c){if(!c)return null;if(c.startsWith('#'))return c.slice(1,7).toUpperCase();const m=c.match(/\d+(\.\d+)?/g);if(!m)return null;if(m.length>3&&+m[3]===0)return null;return m.slice(0,3).map(x=>(+x).toString(16).padStart(2,'0')).join('').toUpperCase()}
function dataBuf(src){const b=atob(src.split(',')[1]);const a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a.buffer}
async function imgDims(src){return new Promise(r=>{const i=new Image();i.onload=()=>r([i.naturalWidth,i.naturalHeight]);i.onerror=()=>r([400,300]);i.src=src})}
async function toPngData(src){if(/^data:image\/(png|jpe?g|gif)/.test(src))return src;return new Promise(r=>{const i=new Image();i.crossOrigin='anonymous';i.onload=()=>{const c=document.createElement('canvas');c.width=i.naturalWidth;c.height=i.naturalHeight;c.getContext('2d').drawImage(i,0,0);try{r(c.toDataURL('image/png'))}catch(e){r(null)}};i.onerror=()=>r(null);i.src=src})}
async function exportDOCX(n,O){toast('Word belgesi hazırlanıyor…');const D=docx;const p=n.paper;const maxW=O.page==='A5'?400:600;
  const baseFont=p.font,baseSize=Math.round(p.fsize*0.75*2);
  async function runs(node,f){const out=[];for(const c of node.childNodes){
    if(c.nodeType===3){if(c.textContent)out.push(new D.TextRun({text:c.textContent,...f}));continue}if(c.nodeType!==1)continue;
    const t=c.tagName,g={...f};
    if(t==='BR'){out.push(new D.TextRun({text:'',break:1,...f}));continue}
    if(t==='IMG'){const src=await toPngData(c.src);if(src){let [w,h]=await imgDims(src);const k=Math.min(1,maxW/w);out.push(new D.ImageRun({data:dataBuf(src),transformation:{width:Math.round(w*k),height:Math.round(h*k)}}))}continue}
    if(t==='B'||t==='STRONG')g.bold=true;if(t==='I'||t==='EM')g.italics=true;if(t==='U')g.underline={};if(t==='S'||t==='STRIKE'||t==='DEL')g.strike=true;
    if(t==='SUP')g.superScript=true;if(t==='SUB')g.subScript=true;if(t==='CODE')g.font='Consolas';
    const st=c.style;if(st){if(+st.fontWeight>=600||st.fontWeight==='bold')g.bold=true;if(st.fontStyle==='italic')g.italics=true;
      if(/underline/.test(st.textDecoration||st.textDecorationLine))g.underline={};if(/line-through/.test(st.textDecoration||st.textDecorationLine))g.strike=true;
      if(st.color&&st.color!=='transparent'){const h=rgbHex(st.color);if(h)g.color=h}if(st.backgroundColor){const h=rgbHex(st.backgroundColor);if(h)g.shading={type:D.ShadingType.CLEAR,fill:h,color:'auto'}}
      if(st.fontSize&&/px/.test(st.fontSize))g.size=Math.round(parseFloat(st.fontSize)*1.5);if(st.fontFamily)g.font=st.fontFamily.split(',')[0].replace(/['"]/g,'').trim()}
    if(t==='FONT'&&c.getAttribute('face'))g.font=c.getAttribute('face');if(t==='FONT'&&c.getAttribute('color'))g.color=rgbHex(c.getAttribute('color'));
    if(t==='A'){out.push(new D.ExternalHyperlink({link:c.href,children:[new D.TextRun({text:c.textContent,style:'Hyperlink',...g})]}));continue}
    out.push(...await runs(c,g))}return out}
  const align=el=>{const a=(el.style?.textAlign)||getComputedStyle(el).textAlign;return{center:D.AlignmentType.CENTER,right:D.AlignmentType.RIGHT,justify:D.AlignmentType.JUSTIFIED}[a]};
  const kids=[];
  async function block(el,lvl=0,listRef){const t=el.tagName;if(!t)return;
    if(el.classList.contains('slide-break')||el.classList.contains('notes'))return;
    if(el.classList.contains('pagebreak')){kids.push(new D.Paragraph({children:[new D.PageBreak()]}));return}
    if(/^H[1-3]$/.test(t)){kids.push(new D.Paragraph({heading:[D.HeadingLevel.HEADING_1,D.HeadingLevel.HEADING_2,D.HeadingLevel.HEADING_3][+t[1]-1],alignment:align(el),children:await runs(el,{})}));return}
    if(t==='UL'||t==='OL'){const chk=el.classList.contains('check');for(const li of qsa(':scope > li',el)){const c=li.cloneNode(true);qsa('ul,ol',c).forEach(x=>x.remove());
        const r=await runs(c,li.classList.contains('done')?{strike:true}:{});if(chk)r.unshift(new D.TextRun({text:li.classList.contains('done')?'☑ ':'☐ '}));
        kids.push(new D.Paragraph(chk?{children:r,indent:{left:360*(lvl+1)}}:t==='OL'?{children:r,numbering:{reference:'num',level:lvl}}:{children:r,bullet:{level:lvl}}));
        for(const s of qsa(':scope > ul,:scope > ol',li))await block(s,lvl+1)}return}
    if(t==='BLOCKQUOTE'){kids.push(new D.Paragraph({children:await runs(el,{italics:true}),indent:{left:500},border:{left:{style:D.BorderStyle.SINGLE,size:12,color:'E9A3A0',space:12}}}));return}
    if(t==='PRE'){el.innerText.split('\n').forEach(l=>kids.push(new D.Paragraph({children:[new D.TextRun({text:l||' ',font:'Consolas',size:19})],shading:{type:D.ShadingType.CLEAR,fill:'F1F1F1',color:'auto'}})));return}
    if(t==='HR'){kids.push(new D.Paragraph({border:{bottom:{style:D.BorderStyle.SINGLE,size:6,color:'BBBBBB',space:4}},children:[]}));return}
    if(t==='TABLE'){const rows=[];for(const tr of qsa('tr',el)){const cells=[];for(const td of qsa('td,th',tr)){const bg=rgbHex(td.style.background||td.style.backgroundColor);cells.push(new D.TableCell({children:[new D.Paragraph({children:await runs(td,el.classList.contains('headrow')&&tr===qs('tr',el)?{bold:true}:{})})],shading:bg?{type:D.ShadingType.CLEAR,fill:bg,color:'auto'}:undefined,margins:{top:60,bottom:60,left:100,right:100}}))}rows.push(new D.TableRow({children:cells}))}
      kids.push(new D.Table({rows,width:{size:100,type:D.WidthType.PERCENTAGE}}));kids.push(new D.Paragraph({children:[]}));return}
    if(el.classList.contains('callout')){const k=[...el.classList].find(c=>c!=='callout');const ic={info:'ℹ️',tip:'💡',warn:'⚠️',idea:'✨',danger:'🔥'}[k]||'•';const fill={info:'E8F0FB',tip:'E8F5EA',warn:'FDF3DC',idea:'F1EAFB',danger:'FBE7E7'}[k]||'F1F1F1';
      const r=await runs(el,{});r.unshift(new D.TextRun({text:ic+'  '}));kids.push(new D.Paragraph({children:r,shading:{type:D.ShadingType.CLEAR,fill,color:'auto'},spacing:{before:80,after:80}}));return}
    if(t==='DETAILS'){for(const c of el.children)await block(c.tagName==='SUMMARY'?Object.assign(document.createElement('h3'),{innerHTML:c.innerHTML}):c,lvl);return}
    if(t==='DIV'&&el.children.length&&[...el.children].every(c=>/^(DIV|P|UL|OL|TABLE|H[1-3]|BLOCKQUOTE|PRE)$/.test(c.tagName))){for(const c of el.children)await block(c,lvl);return}
    const ia=el.tagName==='IMG'?el:null;if(ia){kids.push(new D.Paragraph({alignment:D.AlignmentType.CENTER,children:await runs({childNodes:[ia]},{})}));return}
    kids.push(new D.Paragraph({alignment:align(el)||(el.querySelector('img[data-align="center"]')?D.AlignmentType.CENTER:undefined),children:await runs(el,{})}))}
  if(O.title&&n.title)kids.push(new D.Paragraph({heading:D.HeadingLevel.TITLE,children:[new D.TextRun({text:n.title})]}));
  // interleave floating objects by y
  const P=$('paper').getBoundingClientRect(),z=Z();const objs=O.imgs?[...n.objects].sort((a,b)=>a.y-b.y):[];let oi=0;
  const flushObjs=async y=>{while(oi<objs.length&&objs[oi].y<=y){const o=objs[oi++];
    if(o.type==='img'){const src=await toPngData(o.src);if(src){const k=Math.min(1,maxW/o.w);kids.push(new D.Paragraph({alignment:D.AlignmentType.CENTER,children:[new D.ImageRun({data:dataBuf(src),transformation:{width:Math.round(o.w*k),height:Math.round(o.h*k)}})]}))}}
    else if((o.type==='sticky'||o.type==='text'||o.type==='shape')&&o.html){const d=document.createElement('div');d.innerHTML=o.html;const tx=d.innerText.trim();if(tx)kids.push(new D.Paragraph({children:[new D.TextRun({text:tx,font:o.type==='sticky'?'Segoe Print':undefined})],shading:o.type==='sticky'?{type:D.ShadingType.CLEAR,fill:rgbHex(o.color||'#fff3a3'),color:'auto'}:undefined,spacing:{before:120,after:120}}))}}};
  for(const el of ED().children){const y=(el.getBoundingClientRect().top-P.top)/z;await flushObjs(y);await block(el)}await flushObjs(1e9);
  const sz={A4:[11906,16838],A5:[8391,11906],Letter:[12240,15840]}[O.page];const mg={narrow:720,normal:1134,wide:1700}[O.margins];
  const doc=new D.Document({creator:'ESSTYPE',title:n.title,styles:{default:{document:{run:{font:baseFont,size:baseSize}}}},
    numbering:{config:[{reference:'num',levels:[0,1,2,3].map(l=>({level:l,format:[D.LevelFormat.DECIMAL,D.LevelFormat.LOWER_LETTER,D.LevelFormat.LOWER_ROMAN,D.LevelFormat.DECIMAL][l],text:`%${l+1}.`,alignment:D.AlignmentType.START,style:{paragraph:{indent:{left:720*(l+1),hanging:360}}}}))}]},
    sections:[{properties:{page:{size:{width:sz[0],height:sz[1]},margin:{top:mg,bottom:mg,left:mg,right:mg}}},children:kids.length?kids:[new D.Paragraph('')]}]});
  const blob=await D.Packer.toBlob(doc);download(fname(n)+'.docx',blob);toast('Word belgesi indirildi')}
/* --- pptx --- */
async function exportPPTX(){const n=cur();if(!n)return;flushSave();toast('PowerPoint hazırlanıyor…');const d=deckOf(n);const T=(DECKS[d.theme]||DECKS.minimal);const C=T.ppt;
  const pp=new PptxGenJS();pp.layout=d.ratio==='4:3'?'LAYOUT_4x3':'LAYOUT_WIDE';const W=d.ratio==='4:3'?10:13.333,H=7.5;pp.title=n.title||'Sunum';
  const slides=buildSlides(n);
  for(const [i,sl] of slides.entries()){const s=pp.addSlide();const dark=T.dark&&T.dark(sl.kind);s.background={color:dark?'1B2A4A':C.bg};const fg=dark?'FFFFFF':C.fg;
    s.addShape(pp.ShapeType.rect,{x:0.6,y:sl.kind==='title'?2.55:0.45,w:0.9,h:0.08,fill:{color:C.ac},line:{color:C.ac}});
    const txt=h=>{const d=document.createElement('div');d.innerHTML=h||'';return d.innerText.trim()};
    if(sl.kind==='title'){if(sl.sub)s.addText(sl.sub.toUpperCase(),{x:.6,y:2,w:W-1.2,h:.5,fontFace:C.bf,fontSize:16,color:C.ac,bold:true,charSpacing:4});
      s.addText(sl.title,{x:.6,y:2.8,w:W-1.2,h:1.8,fontFace:C.hf,fontSize:48,color:fg,bold:true,valign:'top'});s.addText(sl.date,{x:.6,y:4.7,w:W-1.2,h:.5,fontFace:C.bf,fontSize:18,color:fg,transparency:30})}
    else if(sl.kind==='section'){s.addText('BÖLÜM '+i,{x:.6,y:2.4,w:W-1.2,h:.5,fontFace:C.bf,fontSize:16,color:C.ac,bold:true,charSpacing:4});s.addText(txt(sl.h),{x:.6,y:3,w:W-1.2,h:1.6,fontFace:C.hf,fontSize:52,color:fg,bold:true})}
    else{if(sl.h)s.addText(txt(sl.h),{x:.6,y:.65,w:W-1.2,h:1,fontFace:C.hf,fontSize:34,color:fg,bold:true});
      const box=document.createElement('div');box.innerHTML=sl.body||'';const items=[];
      for(const el of box.children){if(/^(UL|OL)$/.test(el.tagName))qsa('li',el).forEach(li=>{const c=li.cloneNode(true);qsa('ul,ol',c).forEach(x=>x.remove());items.push({text:(el.classList.contains('check')?(li.classList.contains('done')?'☑ ':'☐ '):'')+c.innerText.trim(),options:{bullet:el.classList.contains('check')?false:el.tagName==='OL'?{type:'number'}:{code:'2022'},indentLevel:qsa('ul,ol',li.parentElement).length&&li.parentElement!==el?1:0,breakLine:true}})});
        else if(el.tagName==='TABLE'){continue}else{const t=el.innerText.trim();if(t)items.push({text:t,options:{bold:/^H/.test(el.tagName),italic:el.tagName==='BLOCKQUOTE',breakLine:true}})}}
      const hasImg=sl.imgs.length,tw=hasImg?W*.52:W-1.2;
      if(items.length)s.addText(items,{x:.6,y:sl.h?1.75:.8,w:tw,h:H-(sl.h?2.4:1.5),fontFace:C.bf,fontSize:20,color:fg,valign:'top',paraSpaceAfter:8});
      const tb=qs('table',box);if(tb&&!hasImg)s.addTable(qsa('tr',tb).map(r=>qsa('td,th',r).map(c=>({text:c.innerText.trim(),options:{color:fg,fontFace:C.bf,fontSize:14}}))),{x:.6,y:items.length?4.6:1.8,w:W-1.2,border:{type:'solid',color:C.ac,pt:1}});
      if(hasImg||sl.kind==='image'){const imgs=sl.imgs.slice(0,sl.kind==='image'?3:2);const area=sl.kind==='image'?{x:.6,y:sl.h?1.7:.6,w:W-1.2,h:H-(sl.h?2.3:1.2)}:{x:W*.58,y:1.6,w:W*.38,h:H-2.2};
        for(const [j,src0] of imgs.entries()){const src=await toPngData(src0);if(!src)continue;const [iw,ih]=await imgDims(src);const cw=area.w/(sl.kind==='image'?imgs.length:1),ch=sl.kind==='image'?area.h:area.h/imgs.length;
          const k=Math.min(cw/iw,ch/ih)*.95;const w=iw*k,h=ih*k;const x=area.x+(sl.kind==='image'?j*cw:0)+(cw-w)/2,y=area.y+(sl.kind==='image'?0:j*ch)+(ch-h)/2;s.addImage({data:src,x,y,w,h})}}}
    if(sl.notes){const t=document.createElement('div');t.innerHTML=sl.notes.replace(/<br\s*\/?>/g,'\n');s.addNotes(t.innerText)}
    if(sl.kind!=='title')s.addText(`${i} / ${slides.length-1}`,{x:W-1.6,y:H-.55,w:1.2,h:.3,fontSize:10,color:fg,align:'right',fontFace:C.bf,transparency:50})}
  const blob=await pp.write({outputType:'blob'});download(fname(n)+'.pptx',blob);toast('PowerPoint indirildi')}

function deckExportDialog(){const n=cur();const F=[['pptx','PowerPoint','.pptx — düzenlenebilir','#d24726'],['pdf','PDF','her slayt bir sayfa','#d63b3b'],['png','Görsel','bu slayt .png','#2f9e44'],['esst','ESSTYPE','.esst (paylaş/aç)','#b0413e']];let sel='pptx';
  const B=document.createElement('div');const draw=()=>{B.innerHTML=`<div class="fmtgrid">${F.map(([k,l,s,c])=>`<div class="fmt ${sel===k?'on':''}" data-k="${k}"><div class="ic" style="background:${c}">${k.toUpperCase().slice(0,4)}</div><b>${l}</b><small>${s}</small></div>`).join('')}</div>
   <div style="font-size:12.5px;color:var(--text2)">${sel==='pptx'?'Metinler, görseller, şekiller ve konuşmacı notları düzenlenebilir olarak aktarılır. Tema arka planı görsel olarak eklenir. Geçiş ve animasyonlar PowerPoint dosyasına taşınmaz.':sel==='pdf'?'Açılan pencerede “PDF olarak kaydet”i seç; “Arka plan grafikleri” işaretli olsun. Gizli slaytlar dahil edilmez.':sel==='png'?'Şu an açık olan slayt yüksek çözünürlüklü görsel olarak kaydedilir.':'Sunumun tam kopyası; başka bir ESSTYPE’ta içe aktarılabilir.'}</div>`;qsa('.fmt',B).forEach(f=>f.onclick=()=>{sel=f.dataset.k;draw()})};
  modal({title:'Sunumu dışa aktar',body:B,foot:[{l:'Vazgeç',cls:'ghost',fn:c=>c()},{html:icon('download')+' Çıktı al',cls:'pri',fn:c=>{c();({pptx:exportDeckPPTX,pdf:printDeck,png:exportSlidePNG,esst:()=>doExport('esst',{})})[sel]()}}]}).el.style.width='min(720px,94vw)';draw()}
