import fs from "node:fs"
import http from "node:http"
import path from "node:path"

const server = http.createServer((req, res) => {
  const filePath = path.join(process.cwd(), req.url === '/' || req.url.startsWith('/?') ? 'index.html' : decodeURIComponent(req.url));
  const extname = path.extname(filePath);
  const contentType = getContentType(extname);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('No encontrado');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

function getContentType(extname) {
  switch (extname) {
    case '.html': return 'text/html';
    case '.css': return 'text/css';
    case '.js': return 'application/javascript';
    case '.mjs': return 'text/javascript';
    case '.zip': return 'application/zip';
    case '.svg': return 'image/svg+xml';
    case '.mp4': return 'video/mp4';
    default: return 'application/octet-stream';
  }
}

server.listen(3000, () => console.log('Servidor en http://localhost:3000'));