const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const port = Number(process.env.PORT) || 3000;
const indexPath = path.join(__dirname, 'index.html');
const assets = {
  '/': { filePath: indexPath, contentType: 'text/html; charset=utf-8' },
  '/index.html': { filePath: indexPath, contentType: 'text/html; charset=utf-8' },
  '/KakaoTalk_20261106_110738.jpg': {
    filePath: path.join(__dirname, 'KakaoTalk_20261106_110738.jpg'),
    contentType: 'image/jpeg',
  },
};

const server = http.createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end('Method Not Allowed');
    return;
  }

  let pathname;
  try {
    pathname = new URL(request.url, 'http://localhost').pathname;
  } catch {
    response.writeHead(400);
    response.end('Bad Request');
    return;
  }

  const asset = assets[pathname];
  if (!asset) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not Found');
    return;
  }

  fs.readFile(asset.filePath, (error, content) => {
    if (error) {
      console.error(`Failed to read ${asset.filePath}:`, error);
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Internal Server Error');
      return;
    }

    response.writeHead(200, {
      'Content-Type': asset.contentType,
      'Content-Length': Buffer.byteLength(content),
    });
    response.end(request.method === 'HEAD' ? undefined : content);
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Profile site running at http://localhost:${port}`);
});