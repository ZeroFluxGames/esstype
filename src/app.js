/* ============ TEMPLATES ============ */
const today=()=>new Date().toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
const TPLS=[
 {id:'blank',n:'Boş sayfa',d:'Temiz bir başlangıç',p:{},c:'#fbf8f1',html:''},
 {id:'journal',n:'Günlük',d:'Gününü yaz, düşüncelerini topla',p:{type:'lined',tone:'krem',font:'Patrick Hand',fsize:21,titleFont:'Caveat'},c:'#fbf8f1',title:()=>today(),
  html:`<h2>Bugün nasıl hissediyorum?</h2><div><br></div><h2>Bugün neler oldu?</h2><div><br></div><h2>Minnettar olduğum 3 şey</h2><ol><li><br></li><li><br></li><li><br></li></ol><h2>Yarın için</h2><ul class="check"><li><br></li></ul>`},
 {id:'meeting',n:'Toplantı notu',d:'Gündem, kararlar, görevler',p:{type:'plain',tone:'beyaz',font:'Inter',fsize:16,titleFont:'Inter'},c:'#ffffff',title:()=>'Toplantı — '+new Date().toLocaleDateString('tr-TR'),
  html:`<h3>Tarih · Katılımcılar</h3><div>${new Date().toLocaleDateString('tr-TR')} · </div><div><br></div><h2>Gündem</h2><ol><li><br></li></ol><h2>Notlar</h2><div><br></div><div class="callout tip"><div>Alınan kararlar: </div></div><h2>Görevler</h2><table class="headrow"><tr><td>Görev</td><td>Kim</td><td>Ne zamana</td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></table><div><br></div>`},
 {id:'cornell',n:'Ders notu (Cornell)',d:'Sınavlara hazırlanmak için',p:{type:'cornell',tone:'beyaz',font:'Lora',margin:false},c:'#ffffff',title:()=>'Ders: ',
  html:`<h3>Konu · ${new Date().toLocaleDateString('tr-TR')}</h3><h2>Ana fikirler</h2><ul><li><br></li></ul><h2>Önemli kavramlar</h2><div><b>Kavram:</b> açıklama</div><div><br></div><h2>Sorular</h2><ul><li>?</li></ul><div class="callout info"><div>Özet: bu dersi 2-3 cümlede anlat.</div></div>`},
 {id:'todo',n:'Yapılacaklar',d:'Bugün, bu hafta, bir gün',p:{type:'dots',tone:'fildisi',font:'Nunito',fsize:18,titleFont:'Poppins'},c:'#fffbea',title:()=>'Yapılacaklar',
  html:`<h2>🔥 Bugün</h2><ul class="check"><li><br></li></ul><h2>📅 Bu hafta</h2><ul class="check"><li><br></li></ul><h2>🌙 Bir gün</h2><ul class="check"><li><br></li></ul>`},
 {id:'week',n:'Haftalık plan',d:'7 günlük tablo',p:{type:'grid',tone:'beyaz',size:'wide',font:'Nunito',fsize:16,titleFont:'Poppins'},c:'#ffffff',title:()=>'Haftalık plan',
  html:`<table class="headrow zebra"><tr><td>Gün</td><td>Görevler</td><td>Notlar</td></tr>${['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'].map(g=>`<tr><td><b>${g}</b></td><td><br></td><td><br></td></tr>`).join('')}</table><div><br></div><h2>Haftanın hedefi</h2><div class="callout idea"><div><br></div></div>`},
 {id:'gdd',n:'Oyun tasarım dokümanı',d:'GDD — oyun fikrini netleştir',p:{type:'grid',tone:'murekkep',font:'Space Grotesk',fsize:17,titleFont:'Press Start 2P'},c:'#16181d',title:()=>'Oyun adı',
  html:`<div class="subtitle">Tek cümlelik tanıtım (pitch): …</div><h2>1. Özet</h2><table class="headrow"><tr><td>Tür</td><td>Platform</td><td>Motor</td><td>Hedef kitle</td></tr><tr><td>2D platform</td><td>PC / Mobil</td><td>Unity</td><td><br></td></tr></table><h2>2. Temel döngü</h2><ol><li>Oyuncu …</li><li>…</li><li>…</li></ol><h2>3. Mekanikler</h2><ul><li><b>Hareket:</b> </li><li><b>Etkileşim:</b> </li></ul><h2>4. Karakterler</h2><div><br></div><h2>5. Seviye tasarımı</h2><div><br></div><h2>6. Sanat & ses</h2><div><br></div><h2>7. Yol haritası</h2><ul class="check"><li>Prototip</li><li>Dikey dilim (vertical slice)</li><li>Demo</li><li>Çıkış</li></ul>`},
 {id:'level',n:'Seviye tasarımı',d:'Kareli plan + yapışkan notlar',p:{type:'biggrid',tone:'blueprint',font:'JetBrains Mono',fsize:15,titleFont:'Silkscreen',margin:false},c:'#1f4e8c',title:()=>'Seviye 1',
  html:`<h3>Hedef</h3><div><br></div><h3>Engeller</h3><ul><li><br></li></ul><h3>Ödüller / toplanabilirler</h3><ul><li><br></li></ul>`,
  objects:[{type:'sticky',x:470,y:120,w:220,h:170,rot:2,color:'#fff3a3',html:'Başlangıç noktası →'},{type:'sticky',x:520,y:330,w:200,h:150,rot:-3,color:'#ffc4d0',html:'Boss odası burada!'}]},
 {id:'char',n:'Karakter kartı',d:'Oyun ya da hikâye karakteri',p:{type:'plain',tone:'parsomen',font:'Lora',titleFont:'Cinzel'},c:'#f2e6c9',title:()=>'Karakter adı',
  html:`<div class="subtitle">Rol / unvan</div><h2>Görünüş</h2><div><br></div><h2>Kişilik</h2><div><br></div><h2>Özellikler</h2><table class="headrow"><tr><td>Güç</td><td>Hız</td><td>Zekâ</td><td>Can</td></tr><tr><td>★★★☆☆</td><td>★★★★☆</td><td>★★☆☆☆</td><td>100</td></tr></table><h2>Hikâyesi</h2><div><br></div>`},
 {id:'board',n:'Fikir panosu',d:'Yapışkan notlarla beyin fırtınası',p:{type:'dots',tone:'beyaz',size:'wide',titleFont:'Caveat'},c:'#ffffff',title:()=>'Fikir panosu',html:`<div class="subtitle">Aklına geleni yapışkan nota yaz, sürükle, grupla.</div>`,
  objects:[['#fff3a3',60,210,-3,'Fikir 1'],['#bde0fe',330,230,2,'Fikir 2'],['#ffc4d0',600,200,-1,'Fikir 3'],['#c3f0ca',180,470,3,'Fikir 4'],['#d7c4ff',470,490,-2,'Fikir 5']].map(([c,x,y,r,t])=>({type:'sticky',x,y,w:210,h:180,rot:r,color:c,html:t}))},
 {id:'project',n:'Proje planı',d:'Hedef, kilometre taşları, riskler',p:{type:'plain',tone:'beyaz',font:'Inter',fsize:16,titleFont:'Montserrat'},c:'#ffffff',title:()=>'Proje adı',
  html:`<h2>Amaç</h2><div><br></div><h2>Kapsam</h2><ul><li><br></li></ul><h2>Kilometre taşları</h2><table class="headrow"><tr><td>Aşama</td><td>Tarih</td><td>Durum</td></tr><tr><td><br></td><td><br></td><td>⏳</td></tr><tr><td><br></td><td><br></td><td>⏳</td></tr></table><div class="callout warn"><div>Riskler: </div></div><h2>Görevler</h2><ul class="check"><li><br></li></ul>`},
 {id:'book',n:'Kitap / film notu',d:'Özet, alıntılar, puan',p:{type:'lined',tone:'sari',font:'Lora',titleFont:'Playfair Display'},c:'#fdf3c4',title:()=>'Eser adı',
  html:`<table><tr><td><b>Yazar / Yönetmen</b></td><td><br></td></tr><tr><td><b>Tür</b></td><td><br></td></tr><tr><td><b>Puanım</b></td><td>★★★★☆</td></tr></table><h2>Özet</h2><div><br></div><h2>Sevdiğim alıntılar</h2><blockquote>“…”</blockquote><h2>Düşüncelerim</h2><div><br></div>`},
 {id:'story',n:'Hikâye panosu',d:'Sahne sahne storyboard',p:{type:'story',tone:'beyaz',size:'a4l',font:'Patrick Hand',margin:false},c:'#ffffff',title:()=>'Storyboard',html:`<div>Kutuların içine çiz ya da görsel bırak, altına sahneyi yaz.</div>`},
 {id:'letter',n:'Mektup',d:'Zarif el yazısıyla',p:{type:'plain',tone:'parsomen',font:'Dancing Script',fsize:24,titleFont:'Great Vibes',margin:false},c:'#f2e6c9',title:()=>'',
  html:`<div style="text-align:right">${new Date().toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})}</div><div><br></div><div>Sevgili …,</div><div><br></div><div><br></div><div style="text-align:right">Sevgiyle,</div><div style="text-align:right">Eren</div>`},
];
function tplPreview(t){const tone=TONES[t.p.tone||S.set.tone]||TONES.krem;const dark=DARKTONES.includes(t.p.tone);
  return `<div class="pv" style="${paperTile(t.p.type||'lined',t.p.tone||'krem',14)};color:${tone[4]}"><div class="tt" style="font-family:'${t.p.titleFont||'Playfair Display'}'">${esc((t.title&&t.title())||t.n).slice(0,24)}</div><i style="width:70%"></i><i></i><i style="width:85%"></i><i style="width:50%"></i>${t.objects?`<span style="position:absolute;right:14px;bottom:14px;width:34px;height:30px;background:#fff3a3;transform:rotate(4deg);box-shadow:0 3px 6px rgba(0,0,0,.2)"></span>`:''}</div>`}
function tplModal(){const B=document.createElement('div');B.innerHTML=`<div class="tplnote">${icon('slides')} Sunum mu hazırlayacaksın? <button class="btn" id="tplDeck">Sunum şablonları</button></div><div class="tplgrid">${TPLS.map(t=>`<div class="tpl" data-t="${t.id}">${tplPreview(t)}<div class="nm">${esc(t.n)}</div><div class="ds">${esc(t.d)}</div></div>`).join('')}</div>`;
  const m=modal({title:'Şablondan yeni sayfa',body:B,wide:true});$('tplDeck').onclick=()=>{m.close();newDeckDialog()};qsa('.tpl',B).forEach(e=>e.onclick=()=>{m.close();fromTpl(e.dataset.t)})}
async function fromTpl(id){const t=TPLS.find(x=>x.id===id);const n=await newNote({title:t.title?t.title():'',html:t.html,paper:{...t.p},objects:(t.objects||[]).map((o,i)=>({...o,id:uid(),z:i+1}))});
  if(t.deck){n.deck={...S.set.deck,...t.deck};persist(n)}renderObjects()}

/* ============ COMMAND PALETTE ============ */
function cmds(){return[['Yeni sayfa','Ctrl+Alt+N',()=>newNote()],['Şablondan yeni sayfa','',tplModal],['Yeni sunum (PowerPoint gibi)','',()=>newDeckDialog()],['Slayt gösterisini başlat','F5',()=>startShow()],['Sunucu görünümüyle prova','',()=>beginShow('rehearse')],['Çıktı al (PDF, Word, PowerPoint…)','Ctrl+E',exportDialog],
  ['Arayüz modu / tema','',themeModal],['Gece/gündüz değiştir','Ctrl+Shift+L',toggleDark],['Kağıt türünü değiştir','',()=>{qs('.tab[data-tab="design"]').click();paperPicker($('dzPaper'))}],['Odak modu','',()=>$('vwFocus').click()],
  ['Görsel ekle','',()=>$('fImg').click()],['Çizim yap','',()=>openDraw()],['Yapışkan not ekle','',addSticky],['Tablo ekle','',()=>insTable(3,3,'headrow')],['Bul ve değiştir','Ctrl+H',findReplace],
  ['Sürüm geçmişi','',()=>toggleRP('hist')],['Anahat','',()=>toggleRP('outline')],['Tüm notları yedekle','',backupAll],['Ayarlar','',settingsModal],['Kısayollar','F1',helpModal],['Yeni defter','',newBook],['Çöp kutusu','',()=>setView('trash')]]}
function palette(){const sc=document.createElement('div');sc.className='scrim';sc.innerHTML=`<div class="modal cmdk"><input placeholder="Komut ya da sayfa ara…"><div class="res"></div></div>`;document.body.appendChild(sc);
  const inp=qs('input',sc),res=qs('.res',sc);let idx=0,items=[];
  const close=()=>sc.remove();sc.onmousedown=e=>{if(e.target===sc)close()};
  const draw=()=>{const q=trLower(inp.value.trim());
    const cs=cmds().filter(c=>!q||trLower(c[0]).includes(q)).map(c=>({l:c[0],k:c[1],i:'command',fn:c[2]}));
    const ns=S.notes.filter(n=>!n.trashed&&(!q||trLower(n.title+' '+n.text).includes(q))).slice(0,q?12:6).map(n=>({l:n.title||'Başlıksız',k:fmtDate(n.updated),i:'notes',fn:()=>openNote(n.id)}));
    items=q?[...ns,...cs]:[...cs.slice(0,8),...ns];idx=clamp(idx,0,items.length-1);
    res.innerHTML=items.map((it,i)=>`<button class="mi ${i===idx?'kb':''}" data-i="${i}">${icon(it.i)}<span>${esc(it.l)}</span><span class="k">${esc(it.k||'')}</span></button>`).join('')||'<div class="mi" style="color:var(--muted)">Sonuç yok</div>';
    qsa('[data-i]',res).forEach(b=>b.onclick=()=>{close();items[+b.dataset.i].fn()});const k=qs('.kb',res);if(k)k.scrollIntoView({block:'nearest'})};
  inp.oninput=()=>{idx=0;draw()};inp.onkeydown=e=>{if(e.key==='ArrowDown'){e.preventDefault();idx++;draw()}if(e.key==='ArrowUp'){e.preventDefault();idx--;draw()}if(e.key==='Enter'){e.preventDefault();const it=items[idx];close();it&&it.fn()}if(e.key==='Escape')close()};
  draw();inp.focus()}

/* ============ SETTINGS / BACKUP ============ */
async function backupAll(){flushSave();const data={app:'esstype',v:1,at:Date.now(),notes:S.notes,books:S.books,settings:S.set};
  download('esstype-yedek-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(data),'application/json');S.set.lastBackup=Date.now();saveSet();toast('Tüm notlar yedeklendi')}
function importFile(){$('fJson').click()}
async function doImport(file){try{const d=JSON.parse(await file.text());const arr=Array.isArray(d)?d:d.notes;if(!Array.isArray(arr))throw 0;
  let c=0;const ids=new Set(S.notes.map(n=>n.id));
  for(const b of d.books||[])if(!S.books.some(x=>x.id===b.id)){S.books.push(b);await dbPut('books',b)}
  for(const raw of arr){if(!raw||!raw.id)continue;let n=normNote({...raw});if(ids.has(n.id)){const ex=S.notes.find(x=>x.id===n.id);if(ex.updated>=n.updated)continue;S.notes=S.notes.filter(x=>x.id!==n.id)}S.notes.push(n);await persist(n);c++}
  renderList();if(arr.length===1&&c)openNote(arr[0].id);toast(c+' sayfa içe aktarıldı')}catch(e){toast('Dosya okunamadı — geçerli bir ESSTYPE/Defter yedeği değil')}}
function settingsModal(){const B=document.createElement('div');
  B.innerHTML=`<div class="field"><label>Yedekleme</label><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn pri" id="stBk">${icon('download')} Tüm notları yedekle</button><button class="btn" id="stIm">${icon('upload')} Yedekten / dosyadan içe aktar</button><button class="btn" id="stMig">${icon('restore')} Eski Defter notlarını tekrar ara</button></div>
   <div style="font-size:12px;color:var(--muted);margin-top:6px">Son yedek: ${S.set.lastBackup?fmtDate(S.set.lastBackup,1):'hiç alınmadı'} · Notlar bu bilgisayarda, uygulamanın içinde saklanır. Ara sıra yedek almak iyi fikir.</div></div>
   <div class="field"><label>Yeni sayfa varsayılanları</label><div style="font-size:13px;color:var(--text2)">${(PAPERS.find(p=>p[0]===S.set.paper)||[])[1]} kağıt · ${TONES[S.set.tone]?.[0]} · ${esc(S.set.font)} ${S.set.fsize}px — değiştirmek için bir sayfayı ayarla ve <b>Kağıt & Sayfa → Varsayılan yap</b>’a bas.</div></div>
   <div class="field"><label>Tercihler</label>
    <label class="chk"><input type="checkbox" id="stSp" ${S.set.spell!==false?'checked':''}> Yazım denetimi</label>
    <label class="chk"><input type="checkbox" id="stSo" ${S.set.sound?'checked':''}> Daktilo sesi</label>
    <label class="chk"><input type="checkbox" id="stRem" ${S.set.noRemind?'':'checked'}> İki haftada bir yedek hatırlat</label></div>
   <div class="field"><label>Depolama</label><div id="stStore" style="font-size:13px;color:var(--text2)">hesaplanıyor…</div></div>
   <div style="font-size:12px;color:var(--muted);border-top:1px solid var(--line);padding-top:12px">ESSTYPE 1.0 · ZeroFlux Games · ${S.notes.filter(n=>!n.trashed).length} sayfa, ${S.books.length} defter</div>`;
  modal({title:'Ayarlar ve yedek',body:B});
  $('stBk').onclick=backupAll;$('stIm').onclick=importFile;$('stMig').onclick=async()=>{const g=await migrateOld();renderList();toast(g?g+' eski sayfa bulundu ve eklendi':'Taşınacak yeni sayfa bulunamadı')};
  $('stSp').onchange=e=>{S.set.spell=e.target.checked;ED().spellcheck=S.set.spell;saveSet()};$('stSo').onchange=e=>{S.set.sound=e.target.checked;saveSet()};$('stRem').onchange=e=>{S.set.noRemind=!e.target.checked;saveSet()};
  navigator.storage?.estimate?.().then(e=>{$('stStore').textContent=`${(e.usage/1048576).toFixed(1)} MB kullanılıyor · yaklaşık ${(e.quota/1073741824).toFixed(0)} GB alan var`})}
function helpModal(){const K=[['Genel',[['Ctrl+Alt+N','Yeni sayfa'],['Ctrl+K','Komut paleti'],['Ctrl+E','Çıktı al'],['Ctrl+P','Yazdır / PDF'],['Ctrl+S','Kaydet'],['Ctrl+\\','Kenar çubuğu'],['Ctrl+Shift+L','Gece/gündüz'],['F5','Sunumu başlat'],['Shift+F5','Buradan başlat'],['Esc','Odak modundan çık']]],
  ['Yazarken',[['/','Hızlı ekleme menüsü'],['Ctrl+B / I / U','Kalın / italik / altı çizili'],['Ctrl+H','Bul ve değiştir'],['- boşluk','Madde listesi'],['1. boşluk','Numaralı liste'],['[] boşluk','Yapılacak'],['# / ## / ###','Başlıklar'],['> boşluk','Alıntı'],['Tab / Shift+Tab','Girinti / tablo hücresi']]],
  ['Nesneler',[['Sürükle','Taşı (ortaya yaklaşınca hizalanır)'],['Köşeler','Boyutlandır (Shift: serbest oran)'],['Üst tutamaç','Döndür (15° adımlı)'],['Çift tık','Yapışkan nota yaz / çizimi düzenle'],['Ok tuşları','1px taşı (Shift: 10px)'],['Ctrl+D','Çoğalt'],['Delete','Sil']]],
  ['Sunumda',[['→ / boşluk / tık','Sonraki'],['←','Önceki'],['Home / End','İlk / son slayt'],['O','Genel bakış'],['L','Lazer işaretçi'],['P / C','Kalem / temizle'],['B / W','Siyah / beyaz ekran'],['A','Otomatik oynat'],['F','Tam ekran'],['Esc','Aracı kapat / sunumu bitir']]]];
  modal({title:'Klavye kısayolları',wide:true,body:`<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 30px">${K.map(([h,l])=>`<div><div class="mh" style="padding-left:0">${h}</div>${l.map(([k,d])=>`<div class="kv"><span style="font-family:var(--mono);color:var(--accent)">${esc(k)}</span><span>${esc(d)}</span></div>`).join('')}</div>`).join('')}</div>`})}

/* ============ WELCOME ============ */
const WELCOME=`<div class="subtitle">ZeroFlux Games’in kişisel defteri. Yaz, çiz, sun, paylaş.</div>
<h2>Hızlı tur</h2>
<ul class="check"><li class="done">ESSTYPE’ı aç</li><li>Üstteki <b>Giriş</b> şeridinden <span style="font-family:'Caveat';font-size:24px">yazı tipini</span>, <span style="font-size:24px">boyutunu</span>, <span style="color:#b0413e">rengini</span> ve <span style="background-color:#fff176">vurgusunu</span> değiştir</li><li>Metni seç → çıkan mini araç çubuğundan <span style="background:linear-gradient(90deg,#ff6a3d,#ff3d77,#a63dff);-webkit-background-clip:text;background-clip:text;color:transparent;font-weight:700">efekt</span> ekle</li><li><b>Kağıt &amp; Sayfa</b> sekmesinden boş, çizgili, kareli, noktalı, milimetrik, nota… 13 kağıt türü ve 14 kağıt rengi</li><li>Bir görseli sayfaya sürükle: serbestçe taşı, köşelerden büyüt, üstten döndür</li><li>Satır başında <code>/</code> yaz: hızlı ekleme menüsü</li><li>Sağ üstteki <b>Yeni sunum</b> ile ayrı bir slayt sunumu hazırla</li><li><b>Çıktı al</b> ile PDF, Word, PowerPoint, PNG… seç</li></ul>
<div class="callout tip"><div>Arayüzü değiştirmek için soldaki palet simgesine tıkla: Gece, Neon, Retro piksel, Okyanus ve daha fazlası.</div></div>
<h2>Sunumlar ayrı bir dünya</h2>
<div>Notların slayta dönüşmez. Sunum için soldaki <b>Yeni sunum</b> düğmesine bas: PowerPoint gibi slayt düzenleyici açılır.</div>
<ul><li>Slayt düzenleri, 13 tema, 13 geçiş ve öğe animasyonları</li><li>Metin, görsel, şekil, tablo; sürükle, hizala, döndür</li><li><b>Sunucu görünümü</b>: slaytlar projeksiyonda, notların ve süren sende</li><li>PowerPoint (.pptx) ve PDF olarak kaydet</li></ul>
<h2>Gerçek sayfalar</h2>
<div>Yazdıkça sayfa dolar ve yazı kendiliğinden yeni kağıda geçer; sayfa aralarında “Sayfa 2” etiketi görürsün. Çıktı aldığında ekrandaki sayfalar birebir basılır.</div>
<h2>Kısayollar</h2><div><code>Ctrl+K</code> komut paleti · <code>Ctrl+Alt+N</code> yeni sayfa · <code>F1</code> tüm kısayollar</div>`;

/* ============ BOOT ============ */
async function boot(){
  try{db=await idb()}catch(e){document.body.innerHTML='<div style="padding:40px;font:16px sans-serif">Depolama açılamadı: '+e+'</div>';return}
  S.set=Object.assign({},DEFSET,await kvGet('settings')||{});S.set.deck=Object.assign({},DEFSET.deck,S.set.deck||{});
  applyTheme();hydrate();document.body.classList.add('ready');
  if(S.set.noside)document.body.classList.add('noside');
  S.notes=(await dbAll('notes')).map(normNote);S.books=await dbAll('books');
  if(!(await kvGet('migrated'))){const g=await migrateOld();await kvSet('migrated',1);if(g)setTimeout(()=>toast(`Eski Defter’den ${g} sayfa taşındı 🎉`),800)}
  const old=Date.now()-30*864e5;for(const n of S.notes.filter(n=>n.trashed&&n.deletedAt<old)){await dbDel('notes',n.id)}S.notes=S.notes.filter(n=>!(n.trashed&&n.deletedAt<old));
  if(!S.notes.length){const n=normNote({id:uid(),title:'ESSTYPE’a hoş geldin',html:WELCOME,pinned:true,paper:{...defPaper(),titleFont:'Playfair Display'},
     objects:[{id:uid(),type:'sticky',x:575,y:14,w:180,h:130,rot:4,z:1,color:'#fff3a3',html:'Beni sürükle!<br>Çift tıkla, yaz ✏️'}],created:Date.now(),updated:Date.now()});S.notes.push(n);await persist(n)}
  try{navigator.storage?.persist?.()}catch(e){}
  wireEditor();wireObjects();wireShow();wireDeck();wireApp();applyLogo();
  $('today').textContent=new Date().toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long'});
  $('sort').value=S.set.sort;ED().spellcheck=S.set.spell!==false;
  const last=await kvGet('last');const first=S.notes.find(n=>n.id===last&&!n.trashed)||visibleNotes()[0];
  renderList();if(first)openNote(first.id);else showEmpty();storeInfo();
  if(!S.set.noRemind&&S.notes.length>3&&Date.now()-(S.set.lastBackup||S.set.firstRun||0)>14*864e5)setTimeout(()=>toast('Bir süredir yedek almadın','Şimdi yedekle',backupAll,9000),3000);
  if(!S.set.firstRun){S.set.firstRun=Date.now();saveSet()}
}
function wireApp(){
  qsa('#rail [data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));
  $('railTpl').onclick=tplModal;$('railCmd').onclick=palette;$('railTheme').onclick=themeModal;$('railSettings').onclick=settingsModal;$('railHelp').onclick=helpModal;
  $('newBtn').onclick=()=>newNote();$('tplBtn').onclick=tplModal;$('emptyTrash').onclick=emptyTrash;
  $('search').oninput=renderList;$('sort').onchange=e=>{S.set.sort=e.target.value;saveSet();renderList()};
  $('sideBtn').onclick=toggleSide;$('bkBtn').onclick=e=>{const n=cur();if(n)moveMenu(e.currentTarget,n)};
  $('favBtn').onclick=()=>{const n=cur();if(!n)return;n.fav=!n.fav;persist(n);syncTop();renderList();toast(n.fav?'Favorilere eklendi':'Favorilerden çıkarıldı')};
  $('pinBtn').onclick=()=>{const n=cur();if(!n)return;n.pinned=!n.pinned;persist(n);syncTop();renderList()};
  $('olBtn').onclick=()=>toggleRP();
  $('showBtn').onclick=()=>isDeck(cur())?startDialog():newDeckDialog();$('deckBtn').onclick=()=>newDeckDialog();$('expBtn').onclick=exportDialog;
  $('moreBtn').onclick=e=>{const n=cur();if(!n)return;menu(e.currentTarget,[{l:'Çoğalt',i:'copy',fn:()=>duplicateNote(n.id)},{l:'Deftere taşı…',i:'folder',fn:()=>moveMenu($('moreBtn'),n)},{l:'Şablondan yeni sayfa',i:'template',fn:tplModal},
    '-',{l:'Bul ve değiştir',i:'replace',k:'Ctrl+H',fn:findReplace},{l:'Sürüm geçmişi',i:'history',fn:()=>toggleRP('hist')},{l:'Sayfa bilgisi',i:'info',fn:()=>toggleRP('info')},
    '-',{l:'Hemen yazdır',i:'page',k:'Ctrl+P',fn:()=>printNote({page:'A4',orient:'portrait',bg:true,title:true})},{l:'Sayfayı .esst olarak paylaş',i:'export',fn:()=>doExport('esst',{})},
    '-',{l:'Çöp kutusuna taşı',i:'trash',danger:1,fn:()=>trashNote(n.id)}],{right:1})};
  $('fJson').onchange=e=>{const f=e.target.files[0];e.target.value='';if(f)doImport(f)};
  document.addEventListener('keydown',e=>{if(SH.active)return;const k=e.key.toLowerCase(),c=e.ctrlKey||e.metaKey;
    if(c&&e.altKey&&k==='n'){e.preventDefault();newNote()}
    else if(c&&k==='k'){e.preventDefault();palette()}
    else if(c&&k==='s'){e.preventDefault();flushSave();toast('Kaydedildi')}
    else if(c&&k==='e'){e.preventDefault();exportDialog()}
    else if(c&&k==='p'){e.preventDefault();isDeck(cur())?printDeck():printNote({page:'A4',orient:'portrait',bg:true,title:true})}
    else if(c&&k==='h'){e.preventDefault();findReplace()}
    else if(c&&e.shiftKey&&k==='l'){e.preventDefault();toggleDark()}
    else if(c&&e.key==='\\'){e.preventDefault();toggleSide()}
    else if(e.key==='F5'){e.preventDefault();isDeck(cur())?startShow(e.shiftKey):toast('Slayt gösterisi için bir sunum aç ya da oluştur','Yeni sunum',newDeckDialog)}
    else if(e.key==='F1'){e.preventDefault();helpModal()}
    else if(e.key==='Escape'&&document.body.classList.contains('focus')&&!qs('.scrim')){document.body.classList.remove('focus')}});
  addEventListener('beforeunload',flushSave);document.addEventListener('visibilitychange',()=>{if(document.hidden)flushSave()});
  setInterval(storeInfo,60000);
}
boot();
