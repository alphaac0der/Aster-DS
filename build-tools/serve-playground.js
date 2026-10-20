import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '127.0.0.1'; // Strictly local-only binding

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

export function createPlaygroundServer() {
  const server = http.createServer((req, res) => {
    // Only accept GET and HEAD
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Method Not Allowed');
      return;
    }

    try {
      const parsedUrl = new URL(req.url, `http://${HOST}:${PORT}`);
      let reqPath = decodeURIComponent(parsedUrl.pathname);

      // Serve the Aster website directly at / and /index.html (Phase 15 requirement: Home at /)
      if (reqPath === '/' || reqPath === '' || reqPath === '/index.html') {
        const rootIndex = path.resolve(rootDir, 'index.html');
        const fallbackIndex = path.resolve(rootDir, 'playground', 'index.html');
        const entryFile = fs.existsSync(rootIndex) ? rootIndex : fallbackIndex;
        if (!fs.existsSync(entryFile)) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found: Portal entry point has not been built yet.');
          return;
        }
        res.writeHead(200, {
          'Content-Type': MIME_TYPES['.html'],
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'no-cache'
        });
        if (req.method === 'HEAD') {
          res.end();
          return;
        }
        fs.createReadStream(entryFile).pipe(res);
        return;
      }

      // Security: Disallow null bytes
      if (reqPath.includes('\0') || req.url.includes('\0')) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request: Invalid path');
        return;
      }

      // Security: Prevent path traversal dots in request path
      if (req.url.includes('..') || reqPath.includes('..')) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden: Path traversal not permitted');
        return;
      }

      // Normalize and construct absolute file path
      const normalizedReqPath = path.normalize(reqPath);
      let filePath = path.resolve(rootDir, '.' + normalizedReqPath);

      // Security: Strict confinement to repository root
      if (!filePath.startsWith(rootDir)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden: Access outside repository root is denied');
        return;
      }

      // Security: Restrict serving to intended public directories (/playground/, /dist/, /examples/, and /assets/)
      const allowedPlaygroundDir = path.resolve(rootDir, 'playground');
      const allowedDistDir = path.resolve(rootDir, 'dist');
      const allowedExamplesDir = path.resolve(rootDir, 'examples');
      const allowedAssetsDir = path.resolve(rootDir, 'assets');
      const isAllowedArea =
        filePath.startsWith(allowedPlaygroundDir) ||
        filePath.startsWith(allowedDistDir) ||
        filePath.startsWith(allowedExamplesDir) ||
        filePath.startsWith(allowedAssetsDir);

      if (!isAllowedArea) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden: Access is restricted to /, /playground/, /dist/, /examples/, and /assets/');
        return;
      }

      // Check existence
      if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`Not Found: ${reqPath}`);
        return;
      }

      // If directory, look for index.html
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
        if (!fs.existsSync(filePath)) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end(`Not Found: No index.html in directory ${reqPath}`);
          return;
        }
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-cache'
      });

      if (req.method === 'HEAD') {
        res.end();
        return;
      }

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Server Error: ${err.message}`);
    }
  });

  return server;
}

// CLI Execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = createPlaygroundServer();
  server.listen(PORT, HOST, () => {
    console.log('========================================================================================');
    console.log('                 ASTER DESIGN SYSTEM — LOCAL DOCUMENTATION & PLAYGROUND                 ');
    console.log('========================================================================================');
    console.log(`✓ Local server running at: http://${HOST}:${PORT}/`);
    console.log(`✓ Playground route available at: http://${HOST}:${PORT}/#/playground`);
    console.log(`✓ Serving files strictly from: ${rootDir}`);
    console.log(`✓ Bound strictly to ${HOST} (local-only, zero public exposure).`);
    console.log('Press Ctrl+C to terminate the server.\n');
  });
}
