// Minimal local server: npm start → http://localhost:5173
import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const file=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist/esstype.html');
http.createServer((q,r)=>{r.writeHead(200,{'content-type':'text/html; charset=utf-8'});fs.createReadStream(file).pipe(r)}).listen(5173,()=>console.log('ESSTYPE → http://localhost:5173'));
