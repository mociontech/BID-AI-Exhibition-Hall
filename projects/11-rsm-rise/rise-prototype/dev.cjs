const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png'};
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let filename;
  try { filename = path.resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname)); }
  catch { res.writeHead(400).end(); return; }
  if (!filename.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(filename, (error, data) => {
    res.writeHead(error ? 404 : 200, {'Content-Type': mime[path.extname(filename)] || 'application/octet-stream', 'Cache-Control':'no-store'});
    res.end(error ? 'Not found' : data);
  });
});
server.listen(Number(process.env.PORT || 4192), '127.0.0.1', () => console.log(`RISE: http://127.0.0.1:${server.address().port}`));
