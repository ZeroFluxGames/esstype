/* ============ PAGE LAYOUT ENGINE ============
   - Paper is drawn as separate sheets (pages) with real gaps between them.
   - Every block is snapped to the line grid, so text never drifts off the rules.
   - A block that would cross a page edge is pushed to the top of the next page.  */
const PG={key:'',count:0,metrics:{},raf:0,printing:false};
function pageGeom(n=cur()){
  const p=n.paper,lh=p.lh;const ps=PAGESIZES.find(x=>x[0]===p.size)||PAGESIZES[2];
  const W=ps[2],paged=!!ps[3];const H=paged?Math.round(ps[3]/lh)*lh:0;
  const PT=lh*2,PB=lh*2,G=PG.printing?0:40;
  const margin=p.margin&&p.type!=='cornell';
  const ML=Math.round(Math.min(84,Math.max(44,W*.095)));
  const PL=p.type==='cornell'?Math.round(W*.06):margin?ML+24:Math.round(Math.min(72,Math.max(40,W*.08)));
  const PR=Math.round(Math.min(64,Math.max(32,W*.07)));
  const CUE=p.type==='cornell'?Math.round(W*.27):0;
  return{W,H,paged,PT,PB,G,lh,step:H+G,ML,PL,PR,margin,CUE,header:lh*3}}
/* where the baseline falls inside one line band → rules sit exactly under the letters */
function fontMetrics(font,fs,lh){const k=font+'|'+fs+'|'+lh;if(PG.metrics[k])return PG.metrics[k];
  const d=document.createElement('div');d.style.cssText=`position:absolute;visibility:hidden;left:0;top:0;font-family:'${font}',Georgia,serif;font-size:${fs}px;line-height:${lh}px;white-space:nowrap`;
  d.innerHTML='Hxg<span style="display:inline-block;width:1px;height:0;vertical-align:baseline"></span><span style="display:inline-block;width:1px;height:0;vertical-align:text-top"></span>';
  document.body.appendChild(d);const [b,t]=qsa('span',d);const base=b.offsetTop+b.offsetHeight,top=t.offsetTop;d.remove();
  const m={base:Math.max(lh*.5,Math.min(lh-2,base)),cap:fs*.7,x:fs*.47};
  if(document.fonts.check(`${fs}px '${font}'`))PG.metrics[k]=m;return m}
function rulesCSS(type,t,lh,m){const c=t[2],r=Math.round(m.base)+1;
  const line=(y,w=1)=>`linear-gradient(to bottom,transparent ${y}px,${c} ${y}px,${c} ${y+w}px,transparent ${y+w}px)`;
  switch(type){
   case 'plain':return null;
   case 'lined':case 'cornell':return{region:'text',bi:line(r),bs:`100% ${lh}px`};
   case 'callig':return{region:'text',bi:line(r)+`,repeating-linear-gradient(55deg,transparent 0 24px,color-mix(in srgb,${c} 55%,transparent) 24px 25px)`,bs:`100% ${lh}px,auto`};
   case 'school':{const a=Math.max(1,r-Math.round(m.cap)),x=Math.max(1,r-Math.round(m.x));
     return{region:'text',bi:svgUri(`<svg xmlns='http://www.w3.org/2000/svg' width='100' height='${lh}' preserveAspectRatio='none'><path d='M0 ${a}.5H100' stroke='${c}' stroke-width='.8'/><path d='M0 ${x}.5H100' stroke='${c}' stroke-width='.8' stroke-dasharray='3 3'/><path d='M0 ${r}.5H100' stroke='${c}' stroke-width='1.5'/></svg>`),bs:`100% ${lh}px`}}
   case 'music':{const gap=Math.max(5,Math.round(lh/4.5)),blk=lh*3;let d='';for(let i=0;i<5;i++)d+=`M0 ${lh+4+i*gap}.5H100`;
     return{region:'text',bi:svgUri(`<svg xmlns='http://www.w3.org/2000/svg' width='100' height='${blk}' preserveAspectRatio='none'><path d='${d}' stroke='${c}' stroke-width='1'/></svg>`),bs:`100% ${blk}px`}}
   case 'grid':case 'biggrid':case 'dots':{const cell=type==='biggrid'?lh:lh/2;const off=((r%cell)+cell)%cell;
     if(type==='dots'){const dc=`color-mix(in srgb,${t[4]} 30%,transparent)`;return{region:'full',bi:`radial-gradient(circle,${dc} 1.2px,transparent 1.6px)`,bs:`${cell}px ${cell}px`,bp:`${-cell/2}px ${off-cell/2}px`}}
     return{region:'full',bi:`linear-gradient(${c} 1px,transparent 1px),linear-gradient(90deg,${c} 1px,transparent 1px)`,bs:`${cell}px ${cell}px`,bp:`0 ${off}px`}}
   case 'graph':{const mn=lh/4,mj=lh;const off=((r%mj)+mj)%mj;const f=`color-mix(in srgb,${c} 45%,transparent)`;
     return{region:'full',bi:`linear-gradient(${c} 1px,transparent 1px),linear-gradient(90deg,${c} 1px,transparent 1px),linear-gradient(${f} .6px,transparent .6px),linear-gradient(90deg,${f} .6px,transparent .6px)`,bs:`${mj}px ${mj}px,${mj}px ${mj}px,${mn}px ${mn}px,${mn}px ${mn}px`,bp:`0 ${off}px,0 0,0 ${off}px,0 0`}}
   case 'iso':{const w=28,h=w*Math.sqrt(3);return{region:'full',bi:svgUri(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h.toFixed(2)}'><g stroke='${c}' stroke-width='.8' fill='none'><path d='M0 0L${w} ${h.toFixed(2)}M${w} 0L0 ${h.toFixed(2)}M0 ${(h/2).toFixed(2)}H${w}'/></g></svg>`),bs:`${w}px ${h.toFixed(2)}px`}}
   case 'hex':{const R=16,w=R*3,h=R*Math.sqrt(3);const p=(cx,cy)=>{let d='';for(let i=0;i<6;i++){const a=Math.PI/3*i;d+=(i?'L':'M')+(cx+R*Math.cos(a)).toFixed(2)+' '+(cy+R*Math.sin(a)).toFixed(2)}return d+'Z'};
     return{region:'full',bi:svgUri(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h.toFixed(2)}'><g stroke='${c}' stroke-width='1' fill='none'><path d='${p(R,h/2)}'/><path d='${p(R*2.5,0)}'/><path d='${p(R*2.5,h)}'/></g></svg>`),bs:`${w}px ${h.toFixed(2)}px`}}
   case 'story':return{region:'text',bi:svgUri(`<svg xmlns='http://www.w3.org/2000/svg' width='300' height='${lh*8}'><rect x='6' y='${lh*.5}' width='288' height='${lh*5}' rx='6' fill='none' stroke='${c}' stroke-width='1.6'/><path d='M6 ${lh*6+r}.5H294M6 ${lh*7+r}.5H294' stroke='${c}' stroke-width='1'/></svg>`),bs:`300px ${lh*8}px`};
  }return null}
/* tile previews for pickers */
function paperTile(type,tone='krem',lh=18){const t=TONES[tone];const c=rulesCSS(type,t,lh,{base:lh*.72,cap:lh*.42,x:lh*.3});
  return `background-color:${t[1]};${c?`background-image:${c.bi.replace(/"/g,"'")};background-size:${c.bs};background-position:${c.bp||'0 0'}`:''}`}

function applyPaper(n=cur()){
  if(!n)return;const p=n.paper,t=TONES[p.tone]||TONES.krem,sh=$('sheet'),pa=$('paper'),g=pageGeom(n);
  sh.style.setProperty('--pp',t[1]);sh.style.setProperty('--pr',t[2]);sh.style.setProperty('--pm',t[3]);sh.style.setProperty('--pi',t[4]);sh.style.setProperty('--lh',p.lh+'px');
  sh.style.setProperty('--pw',g.W+'px');sh.classList.toggle('dark-paper',DARKTONES.includes(p.tone));
  pa.style.setProperty('--pt',g.PT+'px');pa.style.setProperty('--pl',g.PL+'px');pa.style.setProperty('--prt',g.PR+'px');
  $('ed').style.setProperty('--edl',g.CUE?(g.CUE-g.PL+18)+'px':'0px');
  const ed=$('ed');ed.style.fontFamily=`'${p.font}',Georgia,serif`;ed.style.fontSize=p.fsize+'px';
  sh.style.setProperty('--titlefont',`'${p.titleFont}'`);
  const ps=PAGESIZES.find(x=>x[0]===p.size)||PAGESIZES[2];
  $('stPaper').textContent=`${(PAPERS.find(x=>x[0]===p.type)||[])[1]} · ${t[0]} · ${ps[1]}`;
  qsa('#dzMargin,#dzHoles').forEach(b=>b.classList.remove('on'));if(p.margin)$('dzMargin').classList.add('on');if(p.holes)$('dzHoles').classList.add('on');
  PG.key='';paginate();
  document.fonts.load(`${p.fsize}px '${p.font}'`).then(()=>{PG.key='';schedulePaginate()}).catch(()=>{});
}
function schedulePaginate(){if(PG.raf)return;PG.raf=requestAnimationFrame(()=>{PG.raf=0;paginate()})}
function leafBlocks(){const out=[];for(const c of ED().children){if((c.tagName==='UL'||c.tagName==='OL')&&c.children.length){for(const li of c.children)out.push(li)}else out.push(c)}return out}
function paginate(){
  const n=cur();if(!n||!$('paper')||isDeck(n))return;const g=pageGeom(n),E=ED(),P=$('paper'),z=Z();
  qsa('[data-pg]',E).forEach(e=>{e.style.marginTop='';e.removeAttribute('data-pg');if(e.getAttribute('style')==='')e.removeAttribute('style')});
  const pr=P.getBoundingClientRect();const top0=(E.getBoundingClientRect().top-pr.top)/z;
  const L=leafBlocks().filter(e=>getComputedStyle(e).display!=='none'&&getComputedStyle(e).float==='none');
  const M=L.map(e=>{const r=e.getBoundingClientRect();return[(r.top-pr.top)/z,r.height/z]});
  const lh=g.lh,contentH=g.H-g.PT-g.PB;let y=top0,prevEnd=top0,prevSnap=0;const info=[];
  const setOff=(i,off)=>{if(off>0.5){L[i].setAttribute('data-pg','');L[i].style.marginTop=off+'px'}else if(L[i].hasAttribute('data-pg')){L[i].removeAttribute('data-pg');L[i].style.marginTop=''}};
  for(let i=0;i<L.length;i++){const [nt,h]=M[i];
    const gap=Math.max(0,nt-prevEnd);let off=prevSnap;let yy=y+gap+prevSnap;
    if(g.paged&&h>0){const k=Math.floor(yy/g.step),pageTop=k*g.step,cBottom=pageTop+g.H-g.PB,cTop=pageTop+g.PT;
      if(yy>=cBottom-0.5||(yy+h>cBottom+0.5&&h<=contentH)){
        const pv=info[i-1];
        // keep a heading together with the block that follows it
        if(pv&&/^H[1-3]$/.test(L[i-1].tagName)&&!pv.moved&&pv.yy>cTop+0.5&&Math.floor(pv.yy/g.step)===k&&pv.h+h<=contentH){
          const hy=(k+1)*g.step+g.PT;pv.off+=hy-pv.yy;pv.yy=hy;pv.moved=1;setOff(i-1,pv.off);
          const hs=Math.ceil(pv.h/lh-0.02)*lh;off=0;yy=hy+hs;}
        else{const ny=(k+1)*g.step+g.PT;off+=ny-yy;yy=ny}}
      else if(yy<cTop-0.5){off+=cTop-yy;yy=cTop}}
    setOff(i,off);info.push({yy,h,off,moved:off>prevSnap+0.5});
    const hs=h>0?Math.ceil(h/lh-0.02)*lh:0;prevSnap=hs-h;prevEnd=nt+h;y=yy+h}
  const contentEnd=y+prevSnap;
  let objEnd=0;n.objects.forEach(o=>objEnd=Math.max(objEnd,o.y+o.h));
  let count,height;
  if(g.paged){count=Math.max(1,Math.floor(Math.max(contentEnd-1,objEnd-1)/g.step)+1);height=count*g.step-g.G}
  else{count=1;height=Math.max(1123,Math.ceil((Math.max(contentEnd,objEnd)+g.PB+lh*6)/lh)*lh)}
  P.style.minHeight=height+'px';P.style.height=height+'px';
  renderPages(n,g,count,height);PG.count=count;if(typeof pageIndicator==='function')pageIndicator();
}
function renderPages(n,g,count,height){
  const p=n.paper,t=TONES[p.tone]||TONES.krem,m=fontMetrics(p.font,p.fsize,p.lh);
  const key=[count,height,g.W,g.H,g.G,p.type,p.tone,p.lh,p.margin,p.holes,p.font,p.fsize,Math.round(m.base)].join('|');if(key===PG.key)return;PG.key=key;
  const rc=rulesCSS(p.type,t,p.lh,m);const H=g.paged?g.H:height;let h='';
  for(let i=0;i<count;i++){const top=i*g.step;const rTop=i===0?g.PT+g.header:g.PT;
    const rules=rc?(rc.region==='full'?`<div class="rules" style="top:0;bottom:0;background-image:${rc.bi.replace(/"/g,"'")};background-size:${rc.bs};background-position:${rc.bp||'0 0'}"></div>`
      :`<div class="rules" style="top:${rTop}px;bottom:${g.paged?g.PB:p.lh*3}px;background-image:${rc.bi.replace(/"/g,"'")};background-size:${rc.bs};background-position:${rc.bp||'0 0'}"></div>`):'';
    h+=`<div class="pg" style="top:${top}px;height:${H}px">${p.tone==='parsomen'?'<i class="tex"></i>':''}${rules}`+
      (g.margin?`<i class="ml" style="left:${g.ML}px"></i><i class="ml2" style="left:${g.ML+4}px"></i>`:'')+
      (g.CUE?`<i class="cue" style="left:${g.CUE}px;top:${rTop}px"></i><i class="hdr" style="top:${rTop-2}px;left:${g.PL}px;right:${g.PR}px"></i>`:'')+
      (p.holes?'<i class="holes"></i>':'')+
      (g.paged?`<span class="pnum" style="bottom:${Math.round(g.PB/2-7)}px">${i+1}${count>1?` / ${count}`:''}</span>`:'')+`</div>`;
    if(g.paged&&i>0&&!PG.printing)h+=`<div class="pgcut" style="top:${top-g.G/2}px"><span>Sayfa ${i+1}</span></div>`}
  $('pages').innerHTML=h}
/* keep caret on screen when a block jumps to the next page */
function ensureCaret(){const s=getSelection();if(!s.rangeCount||!inEd(s.anchorNode))return;let r=s.getRangeAt(0).getBoundingClientRect();
  if(!r.height){const el=selEl();if(!el)return;r=el.getBoundingClientRect()}
  const sc=$('scroll'),sr=sc.getBoundingClientRect();if(r.bottom>sr.bottom-60)sc.scrollTop+=r.bottom-sr.bottom+120;else if(r.top<sr.top+20)sc.scrollTop-=sr.top-r.top+80}
