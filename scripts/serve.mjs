/**
 * Zero-dependency static preview server for dist/.
 * Serves clean URLs (/parking-fury/ -> dist/parking-fury/index.html),
 * correct MIME types, and dist/404.html for unknown paths.
 *
 * Usage: node scripts/serve.mjs [port]
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'dist');
const port = Number(process.argv[2] || process.env.PORT || 4173);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};

async function tryFile(path) {
  try {
    const info = await stat(path);
    if (info.isFile()) return path;
    if (info.isDirectory()) {
      const index = join(path, 'index.html');
      const inner = await stat(index).catch(() => null);
      if (inner && inner.isFile()) return index;
    }
  } catch {
    /* not found */
  }
  return null;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${port}`);
  let pathname = decodeURIComponent(url.pathname);

  // Prevent path traversal.
  pathname = normalize(pathname).replace(/^(\.\.[/\\])+/, '');

  const candidates = [];
  const clean = pathname.replace(/\/+$/, '');
  if (clean === '' || pathname === '/') {
    candidates.push(join(root, 'index.html'));
  } else {
    candidates.push(join(root, clean));
    candidates.push(join(root, clean + '.html'));
    candidates.push(join(root, clean, 'index.html'));
  }

  let file = null;
  for (const candidate of candidates) {
    if (!candidate.startsWith(root)) continue;
    file = await tryFile(candidate);
    if (file) break;
  }

  let status = 200;
  if (!file) {
    file = join(root, '404.html');
    status = 404;
  }

  try {
    const body = await readFile(file);
    res.writeHead(status, {
      'Content-Type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(body);
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Internal server error');
  }
});

server.listen(port, () => {
  console.log(`GamesPlayLand preview: http://localhost:${port}/`);
  console.log(`Serving: ${root}`);
});
