'use strict';
/* ============ UTIL ============ */
const $=id=>document.getElementById(id);
const qs=(s,r=document)=>r.querySelector(s), qsa=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const trLower=s=>String(s||'').toLocaleLowerCase('tr');
function fmtDate(ts,long){const d=new Date(ts),n=new Date();
  if(!long&&d.toDateString()===n.toDateString())return 'bugün '+d.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
  const y=new Date(n);y.setDate(n.getDate()-1);
  if(!long&&d.toDateString()===y.toDateString())return 'dün '+d.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
  return d.toLocaleDateString('tr-TR',{day:'numeric',month:'short',year:d.getFullYear()===n.getFullYear()&&!long?undefined:'numeric'})+(long?' '+d.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'}):'')}

/* ============ ICONS ============ */
const IC={
notes:'<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h5"/>',
star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.6l6.2-.9z"/>',
books:'<path d="M4 4h5v16H4zM9 4h5v16H9z"/><path d="m14 5 4.5-1 3 15.5-4.5 1z"/>',
trash:'<path d="M4 7h16M10 11v6M14 11v6M9 7V4h6v3M6 7l1 13h10l1-13"/>',
template:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 9v12"/>',
command:'<path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3z"/>',
palette:'<path d="M12 3a9 9 0 1 0 0 18c1.2 0 2-.8 2-1.8 0-.5-.2-.9-.5-1.3-.3-.3-.5-.8-.5-1.3 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4c0-4.4-4-7.8-9-7.8z"/><circle cx="7.5" cy="11.5" r="1"/><circle cx="10" cy="7.5" r="1"/><circle cx="15" cy="7.5" r="1"/>',
settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17h.01"/>',
plus:'<path d="M12 5v14M5 12h14"/>',search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
sidebar:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
pin:'<path d="M9 4h6l-1 6 3 3H7l3-3zM12 13v8"/>',panel:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16M17.5 8h1M17.5 11h1"/>',
play:'<path d="M7 4v16l13-8z"/>',playhere:'<path d="M4 4v16M9 5v14l11-7z"/>',
export:'<path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>',
more:'<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>',
undo:'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',redo:'<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
brush:'<path d="M18.4 2.6a2 2 0 0 1 2.9 2.9L12 14.8 9.2 12z"/><path d="M9 13c-2 0-4 1.5-4 4 0 1.5-1 2.5-2 3 4 1 9 0 9-4.5"/>',
eraser:'<path d="m7 21-4-4 11-11 7 7-8 8zM21 21H7M9.5 10.5l7 7"/>',chev:'<path d="m6 9 6 6 6-6"/>',
marker:'<path d="m9 15 7.5-11.5 3.5 2.3L12.5 17.3z"/><path d="M9 15v3h3.5M4 21h16"/>',
sparkle:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
aleft:'<path d="M4 6h16M4 10h10M4 14h16M4 18h10"/>',acenter:'<path d="M4 6h16M7 10h10M4 14h16M7 18h10"/>',aright:'<path d="M4 6h16M10 10h10M4 14h16M10 18h10"/>',ajust:'<path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>',
ul:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
ol:'<path d="M10 6h10M10 12h10M10 18h10M4 6h1v4M4 10h2M4 14.5c.5-1 2-1 2 0s-2 2-2 3.5h2"/>',
check:'<rect x="3" y="4" width="6" height="6" rx="1.2"/><path d="m4.5 7 1 1 2-2"/><rect x="3" y="14" width="6" height="6" rx="1.2"/><path d="M12 7h9M12 17h9"/>',
outdent:'<path d="M4 6h16M10 10h10M10 14h10M4 18h16M7 9l-3 3 3 3"/>',indent:'<path d="M4 6h16M10 10h10M10 14h10M4 18h16M4 9l3 3-3 3"/>',
image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
pen:'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
sticky:'<path d="M5 3h14v11l-5 7H5z"/><path d="M14 21v-7h5"/>',textbox:'<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M8 9h8M12 9v7"/>',
shapes:'<rect x="3" y="12" width="8" height="8" rx="1"/><circle cx="17" cy="16" r="4"/><path d="m11 3 4.5 7h-9z"/>',
table:'<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 10h18M3 15h18M9 4v16M15 4v16"/>',
callout:'<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 18v3l3-3M7 9h2M11 9h6M7 13h10"/>',
code:'<path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 4l-4 16"/>',toggle:'<path d="m6 8 4 4-4 4M13 9h8M13 15h8"/>',
link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
smile:'<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01"/>',
calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
hr:'<path d="M3 12h18"/><path d="M7 7h10M7 17h10" opacity=".4"/>',slides:'<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M12 16v4M8 20h8"/>',
mic:'<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
paper:'<path d="M6 3h12v18H6z"/><path d="M9 8h6M9 12h6M9 16h6"/>',drop:'<path d="M12 3s7 7.5 7 12a7 7 0 0 1-14 0c0-4.5 7-12 7-12z"/>',
page:'<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M5 7h14" opacity=".4"/>',lh:'<path d="M11 6h10M11 12h10M11 18h10M4 8l2-3 2 3M4 16l2 3 2-3M6 5v14"/>',
margin:'<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 3v18"/>',holes:'<rect x="6" y="3" width="14" height="18" rx="1"/><circle cx="3.5" cy="7" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="17" r="1"/>',
heading:'<path d="M6 4v16M18 4v16M6 12h12"/>',type:'<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',pinmark:'<path d="M5 12l5 5L20 7"/>',
moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>',
focus:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/><circle cx="12" cy="12" r="2"/>',para:'<path d="M13 4v16M17 4v16M19 4H9.5a4.5 4.5 0 0 0 0 9H13"/>',
typewriter:'<rect x="3" y="10" width="18" height="10" rx="2"/><path d="M7 10V4h10v6M7 14h.01M11 14h.01M15 14h.01M8 17h8"/>',
expand:'<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',list:'<path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
history:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',replace:'<path d="M4 7h11M11 3l4 4-4 4M20 17H9M13 13l-4 4 4 4"/>',
speaker:'<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',spell:'<path d="m4 15 4-11 4 11M5.5 11h5M14 16l3 3 5-6"/>',
target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',keys:'<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
ppt:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h3.5a3 3 0 0 1 0 6H9"/>',left:'<path d="m15 18-6-6 6-6"/>',right:'<path d="m9 18 6-6-6-6"/>',
grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
laser:'<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',auto:'<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/>',
x:'<path d="M18 6 6 18M6 6l12 12"/>',copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',unlock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/>',
front:'<rect x="8" y="8" width="12" height="12" rx="1.5" fill="currentColor" fill-opacity=".25"/><path d="M4 16V5a1 1 0 0 1 1-1h11"/>',back:'<rect x="4" y="4" width="12" height="12" rx="1.5" fill="currentColor" fill-opacity=".25"/><path d="M20 8v11a1 1 0 0 1-1 1H8"/>',
flip:'<path d="M12 3v18M8 7 3 12l5 5zM16 7l5 5-5 5z"/>',folder:'<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
restore:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',download:'<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',upload:'<path d="M12 15V3M7 8l5-5 5 5M5 21h14"/>',
frame:'<rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="10" height="10" rx="1"/>',filter:'<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>',
wrap:'<path d="M3 6h18M3 12h12a3 3 0 0 1 0 6h-4M13 16l-2 2 2 2M3 18h4"/>',free:'<path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>',
edit:'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',rotate:'<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
book:'<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>',
tag:'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
info:'<circle cx="12" cy="12" r="9"/><path d="M12 16v-5M12 8h.01"/>',crop:'<path d="M6 2v14a2 2 0 0 0 2 2h14M18 22V8a2 2 0 0 0-2-2H2"/>',
};
const icon=(n,cls='i')=>`<svg class="${cls}" viewBox="0 0 24 24">${IC[n]||''}</svg>`;
function hydrate(root=document){qsa('i[data-i]',root).forEach(el=>{const t=document.createElement('template');t.innerHTML=icon(el.dataset.i);const s=t.content.firstChild;if(el.getAttribute('style'))s.setAttribute('style',el.getAttribute('style'));if(el.className)s.classList.add(...el.className.split(' ').filter(Boolean));el.replaceWith(s)})}

/* ============ CATALOGS ============ */
const THEMES={
 kagit:{n:'Kağıt',bg:'#e9e4da',surface:'#f4f0e8',surface2:'#ebe5da',raise:'#fffdf8',line:'#dcd4c5',text:'#23272f',text2:'#5a6070',muted:'#9a9488',accent:'#b0413e'},
 temiz:{n:'Temiz',bg:'#eceef2',surface:'#f8f9fb',surface2:'#eceff3',raise:'#ffffff',line:'#e0e3e8',text:'#1d2129',text2:'#555d6b',muted:'#949aa6',accent:'#2f6fed'},
 sepya:{n:'Sepya',bg:'#e5d8c0',surface:'#f1e7d4',surface2:'#e6d9c0',raise:'#f9f2e4',line:'#d6c6a6',text:'#3b2f22',text2:'#6b5a45',muted:'#9a8a72',accent:'#9c5a2c'},
 lavanta:{n:'Lavanta',bg:'#e7e2f2',surface:'#f4f1fa',surface2:'#e9e4f4',raise:'#fdfcff',line:'#dcd5ec',text:'#2a2540',text2:'#5e5778',muted:'#9a93b2',accent:'#7a5cc4'},
 gul:{n:'Gül',bg:'#f1e2e4',surface:'#faf0f1',surface2:'#f2e2e5',raise:'#fffafb',line:'#ecd3d8',text:'#3a2328',text2:'#74545b',muted:'#a98990',accent:'#c4456a'},
 nane:{n:'Nane',bg:'#dfece5',surface:'#eef6f1',surface2:'#e0ede6',raise:'#fbfffd',line:'#cfe0d6',text:'#1f3329',text2:'#4e6a5b',muted:'#86a092',accent:'#2e8b66'},
 murekkep:{n:'Mürekkep',bg:'#eeeeee',surface:'#ffffff',surface2:'#f1f1f1',raise:'#ffffff',line:'#e0e0e0',text:'#111111',text2:'#505050',muted:'#959595',accent:'#111111'},
 gece:{n:'Gece',dark:1,bg:'#121110',surface:'#1a1917',surface2:'#262420',raise:'#22201d',line:'#302d29',text:'#ece6da',text2:'#b3aa9b',muted:'#7a7366',accent:'#e07a6e'},
 gecemavi:{n:'Gece mavisi',dark:1,bg:'#0d1321',surface:'#141b2c',surface2:'#1d2639',raise:'#1a2235',line:'#263149',text:'#e3e9f5',text2:'#a6b1c8',muted:'#6c7891',accent:'#6c9cff'},
 orman:{n:'Orman',dark:1,bg:'#0e1611',surface:'#15201a',surface2:'#1e2c24',raise:'#1a271f',line:'#27382e',text:'#e1ecdf',text2:'#a5b9a8',muted:'#6c8272',accent:'#7cc48a'},
 okyanus:{n:'Okyanus',dark:1,bg:'#0a181d',surface:'#0f2328',surface2:'#173038',raise:'#132b32',line:'#1f3d46',text:'#dff1f3',text2:'#a0c4c8',muted:'#62868b',accent:'#36c2c9'},
 neon:{n:'Neon',dark:1,bg:'#110a1e',surface:'#190f2e',surface2:'#25173f',raise:'#201438',line:'#35235b',text:'#f5ebff',text2:'#c6abe8',muted:'#8a74ad',accent:'#ff4fd8',brand:"'Righteous'"},
 retro:{n:'Retro piksel',dark:1,bg:'#0b0d09',surface:'#12150e',surface2:'#1b2015',raise:'#171b12',line:'#2a3220',text:'#d8f5c4',text2:'#9cc489',muted:'#66805a',accent:'#7cff4f',accentInk:'#0b0d09',ui:"'JetBrains Mono'",brand:"'Press Start 2P'"},
 kontrast:{n:'Yüksek kontrast',dark:1,bg:'#000000',surface:'#000000',surface2:'#1c1c1c',raise:'#0b0b0b',line:'#8a8a8a',text:'#ffffff',text2:'#e0e0e0',muted:'#bdbdbd',accent:'#ffd400',accentInk:'#000'},
};
const ACCENTS=['#b0413e','#e07a6e','#d9822b','#c9a227','#2e8b66','#36c2c9','#2f6fed','#6c9cff','#7a5cc4','#c4456a','#ff4fd8','#7cff4f','#111111'];
const FONTS=[
 ['Klasik',['Lora','Merriweather','Playfair Display','IBM Plex Serif','DM Serif Display','Abril Fatface','Cinzel','Roboto Slab','Georgia','Constantia','Cambria','Times New Roman','Garamond','Palatino Linotype','Book Antiqua']],
 ['Modern',['Inter','Poppins','Montserrat','Nunito','Rubik','Space Grotesk','Quicksand','Comfortaa','Fredoka','Oswald','Bebas Neue','Righteous','Segoe UI','Calibri','Arial','Verdana','Century Gothic','Bahnschrift','Trebuchet MS']],
 ['El yazısı',['Caveat','Patrick Hand','Kalam','Indie Flower','Shadows Into Light','Architects Daughter','Amatic SC','Dancing Script','Pacifico','Great Vibes','Sacramento','Lobster','Ink Free','Segoe Print','Segoe Script']],
 ['Daktilo & kod',['JetBrains Mono','Courier Prime','Special Elite','Consolas','Courier New']],
 ['Oyun & piksel',['Press Start 2P','Silkscreen','VT323']],
];
const ALLFONTS=FONTS.flatMap(f=>f[1]);
const SIZES=[8,9,10,11,12,13,14,16,18,20,22,24,28,32,36,42,48,56,64,72,96];
const PAPERS=[['plain','Boş'],['lined','Çizgili'],['grid','Kareli'],['biggrid','Büyük kareli'],['dots','Noktalı'],['graph','Milimetrik'],['iso','İzometrik'],['hex','Altıgen'],['music','Nota (porte)'],['cornell','Cornell'],['school','Okul defteri'],['callig','Kaligrafi'],['story','Hikâye panosu']];
const TONES={beyaz:['Beyaz','#ffffff','#e2e7ee','#f0a8a4','#1f2328'],krem:['Krem','#fbf8f1','#dfe6ee','#e9a3a0','#24303f'],
 fildisi:['Fildişi','#fffbea','#ece4c6','#e3a092','#2d2a1f'],sari:['Sarı','#fdf3c4','#e4d9a6','#e0948a','#2d2a1f'],
 pembe:['Pembe','#fdeef0','#efd5da','#d98a9a','#3a2328'],mavi:['Buz mavisi','#eef4fa','#d2deec','#e3a0a0','#1f2a3a'],
 yesil:['Adaçayı','#eef3e8','#d3dcc6','#d79b8f','#25301f'],gri:['Taş gri','#f0f0ee','#dcdcd8','#d9a19c','#262626'],
 kraft:['Kraft','#ddc9a6','#c7b088','#9e3b36','#3a2c1a'],parsomen:['Parşömen','#f2e6c9','#dccba2','#a85a3a','#3d2e1a'],
 blueprint:['Mavi kopya','#1f4e8c','#3d6eb0','#f0d04a','#eef5ff'],gece:['Gece','#1e1d1a','#302e29','#5a2f2d','#e7e0d2'],
 karatahta:['Kara tahta','#25332b','#33463b','#7b5a48','#eef2e6'],murekkep:['Mürekkep','#16181d','#262a33','#5e3a46','#dfe4ee']};
const DARKTONES=['blueprint','gece','karatahta','murekkep'];
const PAGESIZES=[['a5','A5',559,794],['a4','A4 dikey',794,1123],['normal','Defter',820,1160],['letter','Letter',816,1056],['wide','Geniş',1000,1414],['a4l','A4 yatay',1123,794],['full','Kesintisiz (sayfasız)',880,0]];
const LHS=[[24,'Çok sık'],[28,'Sık'],[32,'Normal'],[36,'Rahat'],[42,'Geniş']];

/* ============ STATE & STORAGE ============ */
let db;const S={notes:[],books:[],view:'all',book:null,active:null,set:{},dirty:false};
const DEFSET={theme:'kagit',accent:null,lastLight:'kagit',lastDark:'gece',paper:'lined',tone:'krem',lh:32,size:'normal',margin:true,holes:false,font:'Lora',fsize:18,titleFont:'Playfair Display',spell:true,sound:false,sort:'updated',zoom:100,deck:{theme:'minimal',trans:'slide',anim:'up',ratio:'16:9'},goal:0};
function idb(){return new Promise((res,rej)=>{const r=indexedDB.open('esstype',1);
  r.onupgradeneeded=()=>{const d=r.result;d.createObjectStore('notes',{keyPath:'id'});d.createObjectStore('books',{keyPath:'id'});
    const v=d.createObjectStore('versions',{keyPath:'id'});v.createIndex('note','note');d.createObjectStore('kv',{keyPath:'k'})};
  r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
const tx=(st,mode='readonly')=>db.transaction(st,mode).objectStore(st);
const dbAll=st=>new Promise(r=>{const q=tx(st).getAll();q.onsuccess=()=>r(q.result||[]);q.onerror=()=>r([])});
const dbPut=(st,o)=>new Promise(r=>{const t=db.transaction(st,'readwrite');t.objectStore(st).put(o);t.oncomplete=()=>r(true);t.onerror=()=>{toast('Kaydedilemedi! Depolama dolu olabilir.');r(false)}});
const dbDel=(st,id)=>new Promise(r=>{const t=db.transaction(st,'readwrite');t.objectStore(st).delete(id);t.oncomplete=()=>r(true);t.onerror=()=>r(false)});
const kvGet=k=>new Promise(r=>{const q=tx('kv').get(k);q.onsuccess=()=>r(q.result?q.result.v:undefined);q.onerror=()=>r(undefined)});
const kvSet=(k,v)=>dbPut('kv',{k,v});
function saveSet(){kvSet('settings',S.set);try{localStorage.setItem('esstype-theme',JSON.stringify({t:S.set.theme,a:S.set.accent}))}catch(e){}}

function defPaper(){const s=S.set;return{type:s.paper,tone:s.tone,lh:s.lh,size:s.size,margin:s.margin,holes:s.holes,font:s.font,fsize:s.fsize,titleFont:s.titleFont}}
function normNote(n){
  n.html=n.html??(n.body!=null?String(n.body).split('\n').map(l=>l.trim()?`<div>${esc(l)}</div>`:'<div><br></div>').join(''):'');
  n.text=n.text??(n.body||'');delete n.body;
  n.title=n.title||'';n.objects=n.objects||[];n.tags=n.tags||[];n.color=n.color&&n.color!=='transparent'?n.color:null;
  const p=n.paper||{};const dp=defPaper();
  if(p.font&&!ALLFONTS.includes(p.font)&&!['Constantia'].includes(p.font))p.font=dp.font;
  n.paper=Object.assign(dp,p);if(!TONES[n.paper.tone])n.paper.tone='krem';if(!PAPERS.some(x=>x[0]===n.paper.type))n.paper.type='lined';
  if(typeof n.paper.size==='number'||!PAGESIZES.some(x=>x[0]===n.paper.size))n.paper.size='normal';
  n.book=n.book||null;n.created=n.created||Date.now();n.updated=n.updated||Date.now();n.trashed=!!n.trashed;
  n.deck=n.deck||null;return n}
const cur=()=>S.notes.find(n=>n.id===S.active);
const bookOf=n=>S.books.find(b=>b.id===n?.book);

/* ============ UI PRIMITIVES ============ */
function toast(m,action,fn,ms){const t=$('toast');t.innerHTML=esc(m)+(action?`<button>${esc(action)}</button>`:'');t.classList.add('on');
  if(action)t.querySelector('button').onclick=()=>{t.classList.remove('on');fn()};
  clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('on'),ms||(action?6000:2000))}
let popEl=null;
function closePop(){if(popEl){popEl.remove();popEl=null}}
function pop(anchor,content,o={}){
  closePop();const p=document.createElement('div');p.className='pop '+(o.cls||'');
  if(typeof content==='string')p.innerHTML=content;else p.appendChild(content);
  document.body.appendChild(p);hydrate(p);
  const r=anchor.getBoundingClientRect(),W=innerWidth,H=innerHeight,pw=p.offsetWidth,ph=p.offsetHeight;
  let x=o.right?r.right-pw:r.left,y=r.bottom+6;
  if(x+pw>W-8)x=W-pw-8;if(x<8)x=8;if(y+ph>H-8)y=Math.max(8,r.top-ph-6);
  p.style.left=x+'px';p.style.top=y+'px';popEl=p;
  p.addEventListener('mousedown',e=>{if(!e.target.closest('input,textarea,select'))e.preventDefault()});
  return p}
document.addEventListener('mousedown',e=>{if(popEl&&!popEl.contains(e.target)&&!e.target.closest('[data-popanchor]'))closePop()},true);
function menu(anchor,items,o={}){
  const d=document.createElement('div');
  items.forEach(it=>{
    if(it==='-'){d.insertAdjacentHTML('beforeend','<div class="msep"></div>');return}
    if(it.h){d.insertAdjacentHTML('beforeend',`<div class="mh">${esc(it.h)}</div>`);return}
    const b=document.createElement('button');b.className='mi'+(it.danger?' danger':'');
    b.innerHTML=(it.i?icon(it.i):'')+`<span style="${it.style||''}">${it.html||esc(it.l)}</span>`+(it.k?`<span class="k">${esc(it.k)}</span>`:'');
    b.onclick=()=>{closePop();it.fn&&it.fn()};d.appendChild(b)});
  return pop(anchor,d,o)}
function modal({title,body,wide,cls,foot,onClose,noHead}){
  const sc=document.createElement('div');sc.className='scrim';
  const m=document.createElement('div');m.className='modal'+(wide?' wide':'')+(cls?' '+cls:'');
  m.innerHTML=(noHead?'':`<div class="mh2"><h3>${esc(title||'')}</h3><button class="ib" data-close>${icon('x')}</button></div>`)+'<div class="mb"></div>'+(foot?'<div class="mf"></div>':'');
  const mb=qs('.mb',m);if(typeof body==='string')mb.innerHTML=body;else if(body)mb.appendChild(body);
  const close=()=>{sc.remove();document.removeEventListener('keydown',kd,true);onClose&&onClose()};
  const kd=e=>{if(e.key==='Escape'){e.stopPropagation();close()}};document.addEventListener('keydown',kd,true);
  if(foot)foot.forEach(f=>{const b=document.createElement('button');b.className='btn '+(f.cls||'');b.innerHTML=f.html||esc(f.l);b.onclick=()=>f.fn(close);qs('.mf',m).appendChild(b)});
  sc.appendChild(m);document.body.appendChild(sc);hydrate(m);
  sc.addEventListener('mousedown',e=>{if(e.target===sc)close()});qsa('[data-close]',m).forEach(b=>b.onclick=close);
  return{el:m,body:mb,close}}
function confirmBox(msg,ok='Evet',danger){return new Promise(res=>{let done=false;
  const m=modal({title:'Emin misin?',body:`<p style="font-size:14px;color:var(--text2)">${esc(msg)}</p>`,
    foot:[{l:'Vazgeç',cls:'ghost',fn:c=>{done=true;c();res(false)}},{l:ok,cls:danger?'pri danger':'pri',fn:c=>{done=true;c();res(true)}}],
    onClose:()=>{if(!done)res(false)}});m.el.style.width='420px'})}
function promptBox(title,val='',ph=''){return new Promise(res=>{let done=false;
  const m=modal({title,body:`<div class="field"><input type="text" value="${esc(val)}" placeholder="${esc(ph)}"></div>`,
    foot:[{l:'Vazgeç',cls:'ghost',fn:c=>{done=true;c();res(null)}},{l:'Tamam',cls:'pri',fn:c=>{done=true;const v=qs('input',m.el).value;c();res(v)}}],
    onClose:()=>{if(!done)res(null)}});m.el.style.width='440px';const i=qs('input',m.el);i.focus();i.select();
  i.onkeydown=e=>{if(e.key==='Enter'){done=true;const v=i.value;m.close();res(v)}}})}
function download(name,data,type){const a=document.createElement('a');a.href=URL.createObjectURL(data instanceof Blob?data:new Blob([data],{type}));
  a.download=String(name).replace(/[\\/:*?"<>|]/g,'_');document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000)}

/* ============ THEME ============ */
function applyTheme(){
  const t=THEMES[S.set.theme]||THEMES.kagit,r=document.documentElement.style;
  const acc=S.set.accent||t.accent;
  for(const k of['bg','surface','surface2','raise','line','text','text2','muted'])r.setProperty('--'+k,t[k]);
  r.setProperty('--accent',acc);
  const ink=t.accentInk&&!S.set.accent?t.accentInk:(lum(acc)>.6?'#111':'#fff');r.setProperty('--accent-ink',ink);
  r.setProperty('--ui',(t.ui?t.ui+',':'')+"'Inter','Segoe UI',system-ui,sans-serif");
  r.setProperty('--brand',(t.brand?t.brand+',':'')+"'Space Grotesk','Inter',sans-serif");
  r.setProperty('--shadow',t.dark?'0 22px 60px -20px rgba(0,0,0,.8)':'0 18px 50px -20px rgba(30,20,0,.35)');
  document.documentElement.dataset.dark=t.dark?'1':'';
  if(t.dark)S.set.lastDark=S.set.theme;else S.set.lastLight=S.set.theme;
  const v=$('vwDark');if(v)v.innerHTML=icon(t.dark?'sun':'moon')+(t.dark?'Gündüz':'Gece');
}
function lum(hex){const c=hex.replace('#','');const n=c.length===3?c.split('').map(x=>x+x).join(''):c;const [r,g,b]=[0,2,4].map(i=>parseInt(n.substr(i,2),16)/255);return .2126*r+.7152*g+.0722*b}
function toggleDark(){const t=THEMES[S.set.theme];S.set.theme=t.dark?(S.set.lastLight||'kagit'):(S.set.lastDark||'gece');applyTheme();saveSet()}
function themeModal(){
  const b=document.createElement('div');
  const draw=()=>{b.innerHTML=`<div class="themegrid">${Object.entries(THEMES).map(([k,t])=>`<div class="th ${S.set.theme===k?'on':''}" data-k="${k}">
      <div class="pv" style="background:${t.bg}"><div class="r" style="background:${t.surface};border-right:1px solid ${t.line}"></div>
      <div class="s" style="background:${t.surface};border-right:1px solid ${t.line}"><i style="background:${t.accent};opacity:1"></i><i style="background:${t.text}"></i><i style="background:${t.text}"></i><i style="background:${t.text}"></i></div>
      <div class="c"><div style="background:${t.dark?'#24221f':'#fbf8f1'}"><i style="background:${t.dark?'#eee':'#222'};opacity:.7;width:60%"></i><i style="background:${t.dark?'#eee':'#222'}"></i><i style="background:${t.dark?'#eee':'#222'}"></i><i style="background:${t.accent};opacity:.8;width:40%"></i></div></div></div>
      <div class="nm" style="font-family:${t.brand||'var(--ui)'};${t.brand&&/Press/.test(t.brand)?'font-size:10px':''}">${t.n}</div></div>`).join('')}</div>
    <div class="field" style="margin-top:18px"><label>Vurgu rengi</label><div class="accents"><i data-a="" class="${!S.set.accent?'on':''}" style="background:conic-gradient(#b0413e,#2f6fed,#2e8b66,#c9a227,#b0413e)" title="Temanın kendi rengi"></i>${ACCENTS.map(a=>`<i data-a="${a}" class="${S.set.accent===a?'on':''}" style="background:${a}"></i>`).join('')}</div></div>`;
    qsa('.th',b).forEach(e=>e.onclick=()=>{S.set.theme=e.dataset.k;applyTheme();saveSet();draw()});
    qsa('[data-a]',b).forEach(e=>e.onclick=()=>{S.set.accent=e.dataset.a||null;applyTheme();saveSet();draw()});};
  draw();modal({title:'Arayüz modu',body:b,wide:true})}

/* ============ PAPER ============ */
function svgUri(s){return `url("data:image/svg+xml,${encodeURIComponent(s).replace(/'/g,'%27')}")`}
function paperPicker(anchor){const n=cur();if(!n)return;
  const d=document.createElement('div');d.style.width='460px';
  const draw=()=>{d.innerHTML=`<div class="mh">Kağıt türü</div><div class="tiles" style="grid-template-columns:repeat(4,1fr);padding:4px">${PAPERS.map(([k,l])=>`<div class="tile ${n.paper.type===k?'on':''}" data-k="${k}"><div class="pv" style="${paperTile(k,n.paper.tone)}"></div><div class="nm">${l}</div></div>`).join('')}</div>`;
    qsa('[data-k]',d).forEach(e=>e.onclick=()=>{n.paper.type=e.dataset.k;if(e.dataset.k==='cornell'&&n.paper.margin)n.paper.margin=false;applyPaper();markDirty(true);draw()})};
  draw();pop(anchor,d)}
function tonePicker(anchor){const n=cur();if(!n)return;const d=document.createElement('div');d.style.width='440px';
  const draw=()=>{d.innerHTML=`<div class="mh">Kağıt rengi</div><div class="tiles" style="grid-template-columns:repeat(5,1fr);padding:4px">${Object.entries(TONES).map(([k,t])=>`<div class="tile ${n.paper.tone===k?'on':''}" data-k="${k}"><div class="pv" style="${paperTile(n.paper.type==='plain'?'lined':n.paper.type,k)};height:44px"></div><div class="nm">${t[0]}</div></div>`).join('')}</div>`;
    qsa('[data-k]',d).forEach(e=>e.onclick=()=>{n.paper.tone=e.dataset.k;applyPaper();markDirty(true);draw()})};draw();pop(anchor,d)}
function sizePicker(anchor){const n=cur();menu(anchor,PAGESIZES.map(([k,l,w,h])=>({l:l+(h?`  ·  ${w}×${h}`:'  ·  tek uzun sayfa'),i:n.paper.size===k?'pinmark':'page',fn:()=>{n.paper.size=k;applyPaper();markDirty(true)}})))}
function lhPicker(anchor){const n=cur();menu(anchor,LHS.map(([v,l])=>({l:`${l} (${v}px)`,i:n.paper.lh===v?'pinmark':'lh',fn:()=>{n.paper.lh=v;applyPaper();markDirty(true)}})))}

/* ============ SIDEBAR / LIST ============ */
function visibleNotes(){
  const q=trLower($('search').value.trim());let a=S.notes.filter(n=>S.view==='trash'?n.trashed:!n.trashed);
  if(S.view==='fav')a=a.filter(n=>n.fav);if(S.view==='decks')a=a.filter(n=>isDeck(n));
  if(S.view==='books'&&S.book)a=a.filter(n=>(n.book||'genel')===S.book);
  if(q)a=a.filter(n=>trLower(n.title+' '+n.text+' '+n.tags.join(' ')).includes(q));
  const so=S.set.sort;a.sort(so==='title'?(x,y)=>(x.title||'').localeCompare(y.title||'','tr'):so==='created'?(x,y)=>y.created-x.created:(x,y)=>y.updated-x.updated);
  return a}
function deckRow(n){const T=DECKS[n.deck?.theme]||DECKS.minimal;const bk=bookOf(n);
  return `<div class="it ${n.id===S.active?'on':''} hasthumb" data-id="${n.id}"><span class="thumb dk-th" style="background:${T.bg};color:${T.fg}"><b style="background:${T.ac}"></b></span>
   <div class="t">${n.pinned?icon('pin','i" style="width:13px;height:13px;color:var(--accent)'):''}${esc(n.title||'Başlıksız sunum')}</div><div class="x">${icon('slides','i" style="width:12px;height:12px;display:inline-block;vertical-align:-2px')} Sunum · ${(n.slides||[]).length} slayt · ${esc(T.n)}</div>
   <div class="m"><span>${fmtDate(n.updated)}</span>${bk?`<span class="bk">${esc(bk.name)}</span>`:''}${n.fav?icon('star','i" style="width:12px;height:12px;color:#d9a520;fill:#d9a520'):''}</div></div>`}
function firstImg(n){const im=n.objects.find(o=>o.type==='img'&&o.src);if(im)return im.src;const m=n.html.match(/<img[^>]+src="([^"]+)"/);return m?m[1]:null}
function renderList(){
  const a=visibleNotes(),L=$('list'),q=$('search').value.trim();
  const titles={decks:'Sunumlar',all:'Tüm notlar',fav:'Favoriler',books:S.book?(S.books.find(b=>b.id===S.book)?.name||'Genel'):'Defterler',trash:'Çöp kutusu'};
  $('viewTitle').textContent=titles[S.view];$('emptyTrash').style.display=S.view==='trash'&&a.length?'':'none';
  $('count').textContent=a.length+' sayfa';
  const row=n=>{if(isDeck(n))return deckRow(n);const ex=(n.text||'').split('\n').find(l=>l.trim()&&l.trim()!==n.title)||'';const th=firstImg(n);const bk=bookOf(n);
    return `<div class="it ${n.id===S.active?'on':''} ${th?'hasthumb':''}" data-id="${n.id}">
     ${th?`<img class="thumb" src="${th}">`:''}
     <div class="t">${n.color?`<span class="dot" style="background:${n.color}"></span>`:''}${n.pinned?icon('pin','i" style="width:13px;height:13px;color:var(--accent)'):''}${esc(n.title||'Başlıksız')}</div>
     ${ex?`<div class="x">${esc(ex.slice(0,120))}</div>`:''}
     <div class="m"><span>${fmtDate(n.updated)}</span>${bk?`<span class="bk">${esc(bk.name)}</span>`:''}${n.fav?icon('star','i" style="width:12px;height:12px;color:#d9a520;fill:#d9a520'):''}${n.tags.slice(0,2).map(t=>`<span>#${esc(t)}</span>`).join('')}</div></div>`};
  let h='';
  if(S.view!=='trash'){const pin=a.filter(n=>n.pinned),rest=a.filter(n=>!n.pinned);
    if(pin.length)h+='<div class="grp-lbl">Sabitlenenler</div>'+pin.map(row).join('');
    if(rest.length)h+=(pin.length?'<div class="grp-lbl">Sayfalar</div>':'')+rest.map(row).join('')}
  else h=a.map(row).join('');
  if(!a.length)h=`<div class="empty-list">${icon(S.view==='trash'?'trash':S.view==='decks'?'slides':'notes')}${q?'Sonuç bulunamadı':S.view==='trash'?'Çöp kutusu boş':S.view==='fav'?'Henüz favori yok — ☆ ile ekle':S.view==='decks'?'Henüz sunum yok<br><button class="btn pri" style="margin:14px auto 0" onclick="newDeckDialog()">Yeni sunum</button>':'Burada henüz sayfa yok'}</div>`;
  L.innerHTML=h;
  qsa('.it',L).forEach(el=>{el.onclick=()=>openNote(el.dataset.id);el.oncontextmenu=e=>{e.preventDefault();noteMenu(el,el.dataset.id)}});
  const tc=S.notes.filter(n=>n.trashed).length;$('trashBadge').textContent=tc;$('trashBadge').classList.toggle('hide',!tc);
  renderBooks();}
function renderBooks(){
  const B=$('books');B.classList.toggle('hide',S.view!=='books');if(S.view!=='books')return;
  const cnt=id=>S.notes.filter(n=>!n.trashed&&(n.book||'genel')===id).length;
  const all=[{id:'genel',name:'Genel',color:'#9a9488'},...S.books];
  B.innerHTML=all.map(b=>`<div class="bk-it ${S.book===b.id?'on':''}" data-b="${b.id}"><span class="sq" style="background:${b.color}"></span><span class="n">${esc(b.name)}</span><span class="c">${cnt(b.id)}</span>${b.id!=='genel'?`<button class="ed" data-ed="${b.id}">${icon('more','i" style="width:14px;height:14px')}</button>`:''}</div>`).join('')+`<button class="bk-add" id="bkAdd">${icon('plus','i" style="width:14px;height:14px')} Yeni defter</button>`;
  qsa('.bk-it',B).forEach(e=>e.onclick=ev=>{if(ev.target.closest('[data-ed]'))return;S.book=S.book===e.dataset.b?null:e.dataset.b;renderList()});
  qsa('[data-ed]',B).forEach(e=>e.onclick=()=>bookMenu(e,e.dataset.ed));
  $('bkAdd').onclick=newBook;}
const BOOKCOLORS=['#b0413e','#d9822b','#c9a227','#2e8b66','#36c2c9','#2f6fed','#7a5cc4','#c4456a','#5a6070'];
async function newBook(){const name=await promptBox('Yeni defter','', 'Örn. Oyun fikirleri, Okul, Günlük');if(!name)return;
  const b={id:uid(),name:name.trim(),color:BOOKCOLORS[S.books.length%BOOKCOLORS.length],created:Date.now()};S.books.push(b);await dbPut('books',b);S.view='books';S.book=b.id;setRail();renderList();toast('Defter oluşturuldu')}
function bookMenu(anchor,id){const b=S.books.find(x=>x.id===id);menu(anchor,[
  {l:'Yeniden adlandır',i:'edit',fn:async()=>{const v=await promptBox('Defter adı',b.name);if(v){b.name=v;await dbPut('books',b);renderList();updateCrumb()}}},
  {h:'Renk'},{html:`<span style="display:flex;gap:6px">${BOOKCOLORS.map(c=>`<i data-c="${c}" style="width:18px;height:18px;border-radius:5px;background:${c};display:block"></i>`).join('')}</span>`,fn:()=>{}},
  '-',{l:'Defteri sil (sayfalar Genel\'e taşınır)',i:'trash',danger:1,fn:async()=>{if(!await confirmBox(`"${b.name}" defteri silinsin mi?`,'Sil',1))return;
    S.notes.filter(n=>n.book===id).forEach(n=>{n.book=null;dbPut('notes',n)});S.books=S.books.filter(x=>x.id!==id);await dbDel('books',id);S.book=null;renderList();updateCrumb()}}]);
  qsa('[data-c]',popEl).forEach(i=>i.onmousedown=async e=>{e.stopPropagation();b.color=i.dataset.c;await dbPut('books',b);closePop();renderList();updateCrumb()})}
function setRail(){qsa('#rail [data-view]').forEach(b=>b.classList.toggle('on',b.dataset.view===S.view))}
function setView(v){S.view=v;if(v!=='books')S.book=null;setRail();renderList();if(document.body.classList.contains('noside'))toggleSide()}
function noteMenu(anchor,id){const n=S.notes.find(x=>x.id===id);if(!n)return;
  if(n.trashed)return menu(anchor,[{l:'Geri yükle',i:'restore',fn:()=>restoreNote(id)},{l:'Kalıcı olarak sil',i:'trash',danger:1,fn:()=>purgeNote(id)}]);
  menu(anchor,[{l:n.pinned?'Sabitlemeyi kaldır':'Sabitle',i:'pin',fn:()=>{n.pinned=!n.pinned;persist(n);renderList();syncTop()}},
   {l:n.fav?'Favorilerden çıkar':'Favorilere ekle',i:'star',fn:()=>{n.fav=!n.fav;persist(n);renderList();syncTop()}},
   {l:'Deftere taşı…',i:'folder',fn:()=>moveMenu(anchor,n)},
   {h:'Renk etiketi'},{html:`<span style="display:flex;gap:6px"><i data-c="" style="width:18px;height:18px;border-radius:50%;border:1.5px solid var(--muted);display:block"></i>${BOOKCOLORS.map(c=>`<i data-c="${c}" style="width:18px;height:18px;border-radius:50%;background:${c};display:block"></i>`).join('')}</span>`},
   '-',{l:'Çoğalt',i:'copy',fn:()=>duplicateNote(id)},{l:'Çıktı al…',i:'export',fn:()=>{openNote(id);exportDialog()}},
   '-',{l:'Çöp kutusuna taşı',i:'trash',danger:1,fn:()=>trashNote(id)}]);
  qsa('[data-c]',popEl).forEach(i=>i.onmousedown=e=>{e.stopPropagation();n.color=i.dataset.c||null;persist(n);closePop();renderList()})}
function moveMenu(anchor,n){menu(anchor,[{l:'Genel',i:!n.book?'pinmark':'book',fn:()=>{n.book=null;persist(n);renderList();updateCrumb()}},...S.books.map(b=>({html:`<span style="display:inline-block;width:9px;height:9px;border-radius:3px;background:${b.color};margin-right:6px"></span>${esc(b.name)}`,i:n.book===b.id?'pinmark':null,fn:()=>{n.book=b.id;persist(n);renderList();updateCrumb()}})),'-',{l:'Yeni defter…',i:'plus',fn:async()=>{await newBook();const b=S.books[S.books.length-1];if(b){n.book=b.id;persist(n);renderList();updateCrumb()}}}])}

/* ============ NOTES ============ */
async function persist(n){n=n||cur();if(!n)return;await dbPut('notes',n)}
async function newNote(o={}){
  if(typeof flushSave==='function')flushSave();
  const n=normNote({id:uid(),title:o.title||'',html:o.html||'',text:'',objects:o.objects||[],tags:o.tags||[],book:o.book!==undefined?o.book:(S.view==='books'&&S.book&&S.book!=='genel'?S.book:null),
    paper:Object.assign(defPaper(),o.paper||{}),created:Date.now(),updated:Date.now()});
  S.notes.unshift(n);await persist(n);
  if(S.view==='trash'||S.view==='fav')setView('all');
  openNote(n.id,true);if(!o.title)setTimeout(()=>{if(document.activeElement!==ED())$('title').focus()},30);return n}
async function duplicateNote(id){const s=S.notes.find(n=>n.id===id);if(!s)return;if(typeof flushSave==='function')flushSave();
  const c=normNote(JSON.parse(JSON.stringify(s)));c.id=uid();c.title=(s.title||'Başlıksız')+' (kopya)';c.created=c.updated=Date.now();c.pinned=false;
  S.notes.unshift(c);await persist(c);openNote(c.id);toast('Sayfa çoğaltıldı')}
async function trashNote(id){const n=S.notes.find(x=>x.id===id);if(!n)return;if(id===S.active&&typeof flushSave==='function')flushSave();
  n.trashed=true;n.deletedAt=Date.now();await persist(n);
  if(S.active===id){const nx=visibleNotes()[0];S.active=null;nx?openNote(nx.id):showEmpty()}
  renderList();toast('Sayfa çöp kutusuna taşındı','Geri al',()=>restoreNote(id))}
async function restoreNote(id){const n=S.notes.find(x=>x.id===id);if(!n)return;n.trashed=false;delete n.deletedAt;await persist(n);renderList();if(S.view!=='trash')openNote(id);toast('Geri yüklendi')}
async function purgeNote(id){if(!await confirmBox('Bu sayfa kalıcı olarak silinecek. Geri alınamaz.','Kalıcı sil',1))return;
  S.notes=S.notes.filter(n=>n.id!==id);await dbDel('notes',id);if(S.active===id){S.active=null;showEmpty()}renderList()}
async function emptyTrash(){const t=S.notes.filter(n=>n.trashed);if(!t.length)return;if(!await confirmBox(`${t.length} sayfa kalıcı olarak silinecek.`,'Çöpü boşalt',1))return;
  for(const n of t)await dbDel('notes',n.id);S.notes=S.notes.filter(n=>!n.trashed);if(!cur()){S.active=null;showEmpty()}renderList()}
function updateCrumb(){const n=cur();const b=bookOf(n);const bk=$('bkBtn');
  qs('i',bk).style.background=b?b.color:'#9a9488';qs('span',bk).textContent=b?b.name:'Genel';$('crumbT').textContent=n?(n.title||'Başlıksız'):''}
function syncTop(){const n=cur();$('favBtn').classList.toggle('on',!!n?.fav);$('pinBtn').classList.toggle('on',!!n?.pinned);
  const fs=qs('#favBtn svg');if(fs)fs.style.fill=n?.fav?'currentColor':'none'}
function setSaved(busy){const s=$('savest');s.classList.toggle('busy',busy);qs('span',s).textContent=busy?'kaydediliyor…':'kaydedildi'}
function toggleSide(){document.body.classList.toggle('noside');S.set.noside=document.body.classList.contains('noside');saveSet()}

/* ============ STORAGE INFO ============ */
async function storeInfo(){try{const e=await navigator.storage.estimate();const mb=(e.usage/1048576);$('storeTxt').textContent=(mb<1?Math.round(e.usage/1024)+' KB':mb.toFixed(1)+' MB')+' kullanılıyor';
  $('storeBar').style.width=Math.max(2,Math.min(100,e.usage/e.quota*100*20))+'%'}catch(e){}}

/* ============ MIGRATION ============ */
async function migrateOld(){
  let got=0;const have=new Set(S.notes.map(n=>n.id));
  try{const old=await new Promise((res)=>{const r=indexedDB.open('defter');r.onupgradeneeded=()=>{r.transaction.abort();res([])};
      r.onsuccess=()=>{const d=r.result;if(!d.objectStoreNames.contains('notes')){d.close();return res([])}const q=d.transaction('notes').objectStore('notes').getAll();q.onsuccess=()=>{res(q.result||[]);d.close()};q.onerror=()=>res([])};r.onerror=()=>res([])});
    for(const o of old){if(have.has(o.id)||o.title==='İlk sayfa'&&/Hoş geldin Eren/.test(o.html||''))continue;
      const p=o.paper||{};const n=normNote({...o,paper:{type:p.type,tone:TONES[p.tone]?p.tone:p.tone==='sari'?'sari':'krem',lh:p.lh,margin:p.margin,fsize:p.size,font:p.font==='Constantia'?'Constantia':p.font}});
      S.notes.push(n);await persist(n);got++}}catch(e){}
  try{const old=JSON.parse(localStorage.getItem('eren-notdefteri-v1')||'null');if(Array.isArray(old))for(const o of old){if(have.has(o.id)||S.notes.some(n=>n.id===o.id)||/Hoş geldin|İlk sayfa/.test(o.title))continue;const n=normNote({...o,paper:null});S.notes.push(n);await persist(n);got++}}catch(e){}
  return got}

const LOGO_SVG=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="100%" height="100%"><defs><linearGradient id="bg" x1="0.1" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="#FF7A50"/><stop offset=".48" stop-color="#E93A6A"/><stop offset="1" stop-color="#6A2BD9"/></linearGradient><radialGradient id="hl" cx=".28" cy=".12" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></radialGradient><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFDF8"/><stop offset="1" stop-color="#F6EEE4"/></linearGradient><linearGradient id="ac" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FF6A55"/><stop offset="1" stop-color="#E93A6A"/></linearGradient><filter id="sh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="30" stdDeviation="34" flood-color="#2a0730" flood-opacity=".42"/></filter><clipPath id="sq"><path d="M982.0 512.0 L981.9 621.5 L981.7 656.4 L981.4 681.8 L981.0 702.5 L980.4 720.2 L979.7 735.8 L978.8 749.9 L977.9 762.8 L976.8 774.6 L975.5 785.7 L974.2 796.1 L972.7 805.8 L971.0 815.0 L969.3 823.8 L967.3 832.1 L965.3 840.0 L963.1 847.5 L960.8 854.7 L958.3 861.6 L955.7 868.2 L953.0 874.5 L950.1 880.6 L947.0 886.4 L943.8 892.0 L940.4 897.4 L936.9 902.5 L933.2 907.5 L929.4 912.2 L925.4 916.8 L921.2 921.2 L916.8 925.4 L912.2 929.4 L907.5 933.2 L902.5 936.9 L897.4 940.4 L892.0 943.8 L886.4 947.0 L880.6 950.1 L874.5 953.0 L868.2 955.7 L861.6 958.3 L854.7 960.8 L847.5 963.1 L840.0 965.3 L832.1 967.3 L823.8 969.3 L815.0 971.0 L805.8 972.7 L796.1 974.2 L785.7 975.5 L774.6 976.8 L762.8 977.9 L749.9 978.8 L735.8 979.7 L720.2 980.4 L702.5 981.0 L681.8 981.4 L656.4 981.7 L621.5 981.9 L512.0 982.0 L402.5 981.9 L367.6 981.7 L342.2 981.4 L321.5 981.0 L303.8 980.4 L288.2 979.7 L274.1 978.8 L261.2 977.9 L249.4 976.8 L238.3 975.5 L227.9 974.2 L218.2 972.7 L209.0 971.0 L200.2 969.3 L191.9 967.3 L184.0 965.3 L176.5 963.1 L169.3 960.8 L162.4 958.3 L155.8 955.7 L149.5 953.0 L143.4 950.1 L137.6 947.0 L132.0 943.8 L126.6 940.4 L121.5 936.9 L116.5 933.2 L111.8 929.4 L107.2 925.4 L102.8 921.2 L98.6 916.8 L94.6 912.2 L90.8 907.5 L87.1 902.5 L83.6 897.4 L80.2 892.0 L77.0 886.4 L73.9 880.6 L71.0 874.5 L68.3 868.2 L65.7 861.6 L63.2 854.7 L60.9 847.5 L58.7 840.0 L56.7 832.1 L54.7 823.8 L53.0 815.0 L51.3 805.8 L49.8 796.1 L48.5 785.7 L47.2 774.6 L46.1 762.8 L45.2 749.9 L44.3 735.8 L43.6 720.2 L43.0 702.5 L42.6 681.8 L42.3 656.4 L42.1 621.5 L42.0 512.0 L42.1 402.5 L42.3 367.6 L42.6 342.2 L43.0 321.5 L43.6 303.8 L44.3 288.2 L45.2 274.1 L46.1 261.2 L47.2 249.4 L48.5 238.3 L49.8 227.9 L51.3 218.2 L53.0 209.0 L54.7 200.2 L56.7 191.9 L58.7 184.0 L60.9 176.5 L63.2 169.3 L65.7 162.4 L68.3 155.8 L71.0 149.5 L73.9 143.4 L77.0 137.6 L80.2 132.0 L83.6 126.6 L87.1 121.5 L90.8 116.5 L94.6 111.8 L98.6 107.2 L102.8 102.8 L107.2 98.6 L111.8 94.6 L116.5 90.8 L121.5 87.1 L126.6 83.6 L132.0 80.2 L137.6 77.0 L143.4 73.9 L149.5 71.0 L155.8 68.3 L162.4 65.7 L169.3 63.2 L176.5 60.9 L184.0 58.7 L191.9 56.7 L200.2 54.7 L209.0 53.0 L218.2 51.3 L227.9 49.8 L238.3 48.5 L249.4 47.2 L261.2 46.1 L274.1 45.2 L288.2 44.3 L303.8 43.6 L321.5 43.0 L342.2 42.6 L367.6 42.3 L402.5 42.1 L512.0 42.0 L621.5 42.1 L656.4 42.3 L681.8 42.6 L702.5 43.0 L720.2 43.6 L735.8 44.3 L749.9 45.2 L762.8 46.1 L774.6 47.2 L785.7 48.5 L796.1 49.8 L805.8 51.3 L815.0 53.0 L823.8 54.7 L832.1 56.7 L840.0 58.7 L847.5 60.9 L854.7 63.2 L861.6 65.7 L868.2 68.3 L874.5 71.0 L880.6 73.9 L886.4 77.0 L892.0 80.2 L897.4 83.6 L902.5 87.1 L907.5 90.8 L912.2 94.6 L916.8 98.6 L921.2 102.8 L925.4 107.2 L929.4 111.8 L933.2 116.5 L936.9 121.5 L940.4 126.6 L943.8 132.0 L947.0 137.6 L950.1 143.4 L953.0 149.5 L955.7 155.8 L958.3 162.4 L960.8 169.3 L963.1 176.5 L965.3 184.0 L967.3 191.9 L969.3 200.2 L971.0 209.0 L972.7 218.2 L974.2 227.9 L975.5 238.3 L976.8 249.4 L977.9 261.2 L978.8 274.1 L979.7 288.2 L980.4 303.8 L981.0 321.5 L981.4 342.2 L981.7 367.6 L981.9 402.5Z"/></clipPath></defs><path d="M982.0 512.0 L981.9 621.5 L981.7 656.4 L981.4 681.8 L981.0 702.5 L980.4 720.2 L979.7 735.8 L978.8 749.9 L977.9 762.8 L976.8 774.6 L975.5 785.7 L974.2 796.1 L972.7 805.8 L971.0 815.0 L969.3 823.8 L967.3 832.1 L965.3 840.0 L963.1 847.5 L960.8 854.7 L958.3 861.6 L955.7 868.2 L953.0 874.5 L950.1 880.6 L947.0 886.4 L943.8 892.0 L940.4 897.4 L936.9 902.5 L933.2 907.5 L929.4 912.2 L925.4 916.8 L921.2 921.2 L916.8 925.4 L912.2 929.4 L907.5 933.2 L902.5 936.9 L897.4 940.4 L892.0 943.8 L886.4 947.0 L880.6 950.1 L874.5 953.0 L868.2 955.7 L861.6 958.3 L854.7 960.8 L847.5 963.1 L840.0 965.3 L832.1 967.3 L823.8 969.3 L815.0 971.0 L805.8 972.7 L796.1 974.2 L785.7 975.5 L774.6 976.8 L762.8 977.9 L749.9 978.8 L735.8 979.7 L720.2 980.4 L702.5 981.0 L681.8 981.4 L656.4 981.7 L621.5 981.9 L512.0 982.0 L402.5 981.9 L367.6 981.7 L342.2 981.4 L321.5 981.0 L303.8 980.4 L288.2 979.7 L274.1 978.8 L261.2 977.9 L249.4 976.8 L238.3 975.5 L227.9 974.2 L218.2 972.7 L209.0 971.0 L200.2 969.3 L191.9 967.3 L184.0 965.3 L176.5 963.1 L169.3 960.8 L162.4 958.3 L155.8 955.7 L149.5 953.0 L143.4 950.1 L137.6 947.0 L132.0 943.8 L126.6 940.4 L121.5 936.9 L116.5 933.2 L111.8 929.4 L107.2 925.4 L102.8 921.2 L98.6 916.8 L94.6 912.2 L90.8 907.5 L87.1 902.5 L83.6 897.4 L80.2 892.0 L77.0 886.4 L73.9 880.6 L71.0 874.5 L68.3 868.2 L65.7 861.6 L63.2 854.7 L60.9 847.5 L58.7 840.0 L56.7 832.1 L54.7 823.8 L53.0 815.0 L51.3 805.8 L49.8 796.1 L48.5 785.7 L47.2 774.6 L46.1 762.8 L45.2 749.9 L44.3 735.8 L43.6 720.2 L43.0 702.5 L42.6 681.8 L42.3 656.4 L42.1 621.5 L42.0 512.0 L42.1 402.5 L42.3 367.6 L42.6 342.2 L43.0 321.5 L43.6 303.8 L44.3 288.2 L45.2 274.1 L46.1 261.2 L47.2 249.4 L48.5 238.3 L49.8 227.9 L51.3 218.2 L53.0 209.0 L54.7 200.2 L56.7 191.9 L58.7 184.0 L60.9 176.5 L63.2 169.3 L65.7 162.4 L68.3 155.8 L71.0 149.5 L73.9 143.4 L77.0 137.6 L80.2 132.0 L83.6 126.6 L87.1 121.5 L90.8 116.5 L94.6 111.8 L98.6 107.2 L102.8 102.8 L107.2 98.6 L111.8 94.6 L116.5 90.8 L121.5 87.1 L126.6 83.6 L132.0 80.2 L137.6 77.0 L143.4 73.9 L149.5 71.0 L155.8 68.3 L162.4 65.7 L169.3 63.2 L176.5 60.9 L184.0 58.7 L191.9 56.7 L200.2 54.7 L209.0 53.0 L218.2 51.3 L227.9 49.8 L238.3 48.5 L249.4 47.2 L261.2 46.1 L274.1 45.2 L288.2 44.3 L303.8 43.6 L321.5 43.0 L342.2 42.6 L367.6 42.3 L402.5 42.1 L512.0 42.0 L621.5 42.1 L656.4 42.3 L681.8 42.6 L702.5 43.0 L720.2 43.6 L735.8 44.3 L749.9 45.2 L762.8 46.1 L774.6 47.2 L785.7 48.5 L796.1 49.8 L805.8 51.3 L815.0 53.0 L823.8 54.7 L832.1 56.7 L840.0 58.7 L847.5 60.9 L854.7 63.2 L861.6 65.7 L868.2 68.3 L874.5 71.0 L880.6 73.9 L886.4 77.0 L892.0 80.2 L897.4 83.6 L902.5 87.1 L907.5 90.8 L912.2 94.6 L916.8 98.6 L921.2 102.8 L925.4 107.2 L929.4 111.8 L933.2 116.5 L936.9 121.5 L940.4 126.6 L943.8 132.0 L947.0 137.6 L950.1 143.4 L953.0 149.5 L955.7 155.8 L958.3 162.4 L960.8 169.3 L963.1 176.5 L965.3 184.0 L967.3 191.9 L969.3 200.2 L971.0 209.0 L972.7 218.2 L974.2 227.9 L975.5 238.3 L976.8 249.4 L977.9 261.2 L978.8 274.1 L979.7 288.2 L980.4 303.8 L981.0 321.5 L981.4 342.2 L981.7 367.6 L981.9 402.5Z" fill="url(#bg)"/><path d="M982.0 512.0 L981.9 621.5 L981.7 656.4 L981.4 681.8 L981.0 702.5 L980.4 720.2 L979.7 735.8 L978.8 749.9 L977.9 762.8 L976.8 774.6 L975.5 785.7 L974.2 796.1 L972.7 805.8 L971.0 815.0 L969.3 823.8 L967.3 832.1 L965.3 840.0 L963.1 847.5 L960.8 854.7 L958.3 861.6 L955.7 868.2 L953.0 874.5 L950.1 880.6 L947.0 886.4 L943.8 892.0 L940.4 897.4 L936.9 902.5 L933.2 907.5 L929.4 912.2 L925.4 916.8 L921.2 921.2 L916.8 925.4 L912.2 929.4 L907.5 933.2 L902.5 936.9 L897.4 940.4 L892.0 943.8 L886.4 947.0 L880.6 950.1 L874.5 953.0 L868.2 955.7 L861.6 958.3 L854.7 960.8 L847.5 963.1 L840.0 965.3 L832.1 967.3 L823.8 969.3 L815.0 971.0 L805.8 972.7 L796.1 974.2 L785.7 975.5 L774.6 976.8 L762.8 977.9 L749.9 978.8 L735.8 979.7 L720.2 980.4 L702.5 981.0 L681.8 981.4 L656.4 981.7 L621.5 981.9 L512.0 982.0 L402.5 981.9 L367.6 981.7 L342.2 981.4 L321.5 981.0 L303.8 980.4 L288.2 979.7 L274.1 978.8 L261.2 977.9 L249.4 976.8 L238.3 975.5 L227.9 974.2 L218.2 972.7 L209.0 971.0 L200.2 969.3 L191.9 967.3 L184.0 965.3 L176.5 963.1 L169.3 960.8 L162.4 958.3 L155.8 955.7 L149.5 953.0 L143.4 950.1 L137.6 947.0 L132.0 943.8 L126.6 940.4 L121.5 936.9 L116.5 933.2 L111.8 929.4 L107.2 925.4 L102.8 921.2 L98.6 916.8 L94.6 912.2 L90.8 907.5 L87.1 902.5 L83.6 897.4 L80.2 892.0 L77.0 886.4 L73.9 880.6 L71.0 874.5 L68.3 868.2 L65.7 861.6 L63.2 854.7 L60.9 847.5 L58.7 840.0 L56.7 832.1 L54.7 823.8 L53.0 815.0 L51.3 805.8 L49.8 796.1 L48.5 785.7 L47.2 774.6 L46.1 762.8 L45.2 749.9 L44.3 735.8 L43.6 720.2 L43.0 702.5 L42.6 681.8 L42.3 656.4 L42.1 621.5 L42.0 512.0 L42.1 402.5 L42.3 367.6 L42.6 342.2 L43.0 321.5 L43.6 303.8 L44.3 288.2 L45.2 274.1 L46.1 261.2 L47.2 249.4 L48.5 238.3 L49.8 227.9 L51.3 218.2 L53.0 209.0 L54.7 200.2 L56.7 191.9 L58.7 184.0 L60.9 176.5 L63.2 169.3 L65.7 162.4 L68.3 155.8 L71.0 149.5 L73.9 143.4 L77.0 137.6 L80.2 132.0 L83.6 126.6 L87.1 121.5 L90.8 116.5 L94.6 111.8 L98.6 107.2 L102.8 102.8 L107.2 98.6 L111.8 94.6 L116.5 90.8 L121.5 87.1 L126.6 83.6 L132.0 80.2 L137.6 77.0 L143.4 73.9 L149.5 71.0 L155.8 68.3 L162.4 65.7 L169.3 63.2 L176.5 60.9 L184.0 58.7 L191.9 56.7 L200.2 54.7 L209.0 53.0 L218.2 51.3 L227.9 49.8 L238.3 48.5 L249.4 47.2 L261.2 46.1 L274.1 45.2 L288.2 44.3 L303.8 43.6 L321.5 43.0 L342.2 42.6 L367.6 42.3 L402.5 42.1 L512.0 42.0 L621.5 42.1 L656.4 42.3 L681.8 42.6 L702.5 43.0 L720.2 43.6 L735.8 44.3 L749.9 45.2 L762.8 46.1 L774.6 47.2 L785.7 48.5 L796.1 49.8 L805.8 51.3 L815.0 53.0 L823.8 54.7 L832.1 56.7 L840.0 58.7 L847.5 60.9 L854.7 63.2 L861.6 65.7 L868.2 68.3 L874.5 71.0 L880.6 73.9 L886.4 77.0 L892.0 80.2 L897.4 83.6 L902.5 87.1 L907.5 90.8 L912.2 94.6 L916.8 98.6 L921.2 102.8 L925.4 107.2 L929.4 111.8 L933.2 116.5 L936.9 121.5 L940.4 126.6 L943.8 132.0 L947.0 137.6 L950.1 143.4 L953.0 149.5 L955.7 155.8 L958.3 162.4 L960.8 169.3 L963.1 176.5 L965.3 184.0 L967.3 191.9 L969.3 200.2 L971.0 209.0 L972.7 218.2 L974.2 227.9 L975.5 238.3 L976.8 249.4 L977.9 261.2 L978.8 274.1 L979.7 288.2 L980.4 303.8 L981.0 321.5 L981.4 342.2 L981.7 367.6 L981.9 402.5Z" fill="url(#hl)"/><g filter="url(#sh)"> <path d="M318 196h312l162 162v438a52 52 0 0 1-52 52H318a52 52 0 0 1-52-52V248a52 52 0 0 1 52-52z" fill="url(#pg)"/> <path d="M630 196v110a52 52 0 0 0 52 52h110z" fill="#F1D7CC"/></g><g fill="#1E1B2E"> <rect x="364" y="404" width="62" height="300" rx="31"/> <rect x="364" y="404" width="300" height="62" rx="31"/> <rect x="364" y="642" width="300" height="62" rx="31"/></g><rect x="364" y="523" width="222" height="62" rx="31" fill="url(#ac)"/><rect x="612" y="504" width="20" height="100" rx="10" fill="#E93A6A" opacity=".9"/></svg>`;
function applyLogo(){qsa('#rail .logo,.bmark').forEach(e=>e.innerHTML=LOGO_SVG)}
