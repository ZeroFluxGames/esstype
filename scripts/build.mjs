// ESSTYPE build: bundles src/, libraries and embedded fonts into one offline HTML file.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');const nm=p=>path.join(root,'node_modules',p);
const read=p=>fs.readFileSync(path.join(root,p),'utf8');const lib=p=>fs.readFileSync(nm(p),'utf8').replace(/<\/script/g,'<\\/script');
// fonts: latin + latin-ext subsets (Turkish), weights 400/700, as data URIs
const fonts=JSON.parse(read('scripts/fonts.json'));const faces=[];
for(const f of fonts){for(const w of ['400','700']){const css=nm(`@fontsource/${f}/${w}.css`);if(!fs.existsSync(css))continue;const txt=fs.readFileSync(css,'utf8');
  for(const m of txt.matchAll(/\/\*\s*([^*]+?)\s*\*\/\s*@font-face\s*{([^}]*)}/g)){if(!/-(latin|latin-ext)-\d+-normal$/.test(m[1].trim()))continue;const b=m[2];
    const fam=b.match(/font-family:\s*'([^']+)'/)[1];const file=b.match(/url\(\.\/files\/([^)]+\.woff2)\)/)[1];const ur=b.match(/unicode-range:\s*([^;]+);/)[1];
    const data=fs.readFileSync(nm(`@fontsource/${f}/files/${file}`)).toString('base64');
    faces.push(`@font-face{font-family:'${fam}';font-style:normal;font-display:swap;font-weight:${w};src:url(data:font/woff2;base64,${data}) format('woff2');unicode-range:${ur}}`)}}}
const icon=fs.readFileSync(path.join(root,'assets/icon-128.png')).toString('base64');
const mods=['core','layout','editor','objects','present','show','deck','export','app'].map(m=>read(`src/${m}.js`)).join('\n');
const html=`<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ESSTYPE</title><meta name="description" content="ESSTYPE — çevrimdışı kişisel defter ve sunum uygulaması"><link rel="icon" href="data:image/png;base64,${icon}">
<style id="fontcss">${faces.join('\n')}</style>
<style>${read('src/style.css')}
body{opacity:0}body.ready{opacity:1;transition:opacity .25s}</style>
</head><body>
${read('src/body.html')}
<script>${lib('docx/build/index.iife.js')}</script>
<script>${lib('pptxgenjs/dist/pptxgen.bundle.js')}</script>
<script>${lib('html-to-image/dist/html-to-image.js')}</script>
<script>
${mods}
</script></body></html>`;
fs.mkdirSync(path.join(root,'dist'),{recursive:true});fs.writeFileSync(path.join(root,'dist/esstype.html'),html);
fs.copyFileSync(path.join(root,'dist/esstype.html'),path.join(root,'dist/index.html'));
console.log(`dist/esstype.html  ${(html.length/1024/1024).toFixed(2)} MB  · ${faces.length} font faces`);
