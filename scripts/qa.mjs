/**
 * Build QA. Dependency-free checks over dist/.
 * Run: node scripts/qa.mjs
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, '..', 'dist');
const SITE = 'https://gamesplayland.com';

const failures = [];
const warnings = [];
const fail = (msg) => failures.push(msg);
const warn = (msg) => warnings.push(msg);

if (!existsSync(dist)) {
  console.error('dist/ not found. Run node build.mjs first.');
  process.exit(1);
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const files = walk(dist);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const rel = (f) => '/' + relative(dist, f).replace(/\\/g, '/');

const pageCache = new Map();
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const clean = rel(file);
  const route = clean.endsWith('.html') && !clean.endsWith('/index.html')
    ? clean
    : clean.replace(/index\.html$/, '');
  pageCache.set(route === '' ? '/' : route, {
    file,
    html,
    title: (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '',
    description: (html.match(/<meta name="description" content="([\s\S]*?)">/) || [])[1] || '',
    canonical: (html.match(/<link rel="canonical" href="([^"]+)">/) || [])[1] || '',
    robots: (html.match(/<meta name="robots" content="([^"]+)">/) || [])[1] || '',
    h1s: [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => m[1].replace(/<[^>]+>/g, '').trim()),
    lang: (html.match(/<html lang="([^"]+)"/) || [])[1] || '',
    ld: [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]),
  });
}

/* ---------------- Basic head checks ---------------- */
const titles = new Map();
const descs = new Map();
const canonicals = new Map();

for (const [route, page] of pageCache) {
  const label = route === '/' ? 'home' : route;
  if (!page.title) fail(`${label}: missing <title>`);
  if (!page.description) fail(`${label}: missing meta description`);
  if (!page.canonical) fail(`${label}: missing canonical`);
  if (page.h1s.length !== 1) fail(`${label}: expected exactly one h1, found ${page.h1s.length}`);
  if (page.lang !== 'en') fail(`${label}: html lang should be "en"`);
  if (!page.html.includes('name="viewport"')) fail(`${label}: missing viewport meta`);
  if (!page.html.includes('property="og:title"')) fail(`${label}: missing og:title`);
  if (!page.html.includes('name="twitter:card"')) fail(`${label}: missing twitter card`);
  if (!page.html.includes('<main id="main">')) fail(`${label}: missing main landmark`);

  if (page.canonical && !page.canonical.startsWith(SITE)) {
    fail(`${label}: canonical does not use the production origin (${page.canonical})`);
  }
  if (page.canonical && page.canonical !== `${SITE}${route}`) {
    fail(`${label}: canonical ${page.canonical} does not match route ${route}`);
  }

  if (page.title.length > 70) warn(`${label}: title is ${page.title.length} chars (recommended <= 70)`);
  if (page.description.length < 110) warn(`${label}: description is only ${page.description.length} chars`);
  if (page.description.length > 170) warn(`${label}: description is ${page.description.length} chars (recommended <= 170)`);

  if (page.title) {
    if (titles.has(page.title)) fail(`duplicate title: ${label} and ${titles.get(page.title)}`);
    titles.set(page.title, label);
  }
  if (page.description) {
    if (descs.has(page.description)) fail(`duplicate description: ${label} and ${descs.get(page.description)}`);
    descs.set(page.description, label);
  }
  if (page.canonical && route !== '/404') {
    if (canonicals.has(page.canonical)) fail(`duplicate canonical: ${label} and ${canonicals.get(page.canonical)}`);
    canonicals.set(page.canonical, label);
  }

  for (const block of page.ld) {
    try {
      JSON.parse(block);
    } catch (err) {
      fail(`${label}: invalid JSON-LD (${err.message})`);
    }
  }

  // image alt attributes
  for (const m of page.html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt=/.test(m[0])) fail(`${label}: img without alt attribute`);
  }
}

/* ---------------- Expected structured data ---------------- */
const hasType = (route, type) => {
  const page = pageCache.get(route);
  if (!page) return false;
  return page.ld.some((block) => {
    try {
      return JSON.stringify(JSON.parse(block)).includes(`"@type":"${type}"`);
    } catch {
      return false;
    }
  });
};

const gameRoutes = ['/parking-fury/', '/parking-fury-2/', '/parking-fury-3/', '/truck-parking/', '/bus-parking/', '/parking-jam/', '/free-drive/'];
for (const route of gameRoutes) {
  if (!hasType(route, 'VideoGame')) fail(`${route}: missing VideoGame JSON-LD`);
  if (!hasType(route, 'BreadcrumbList')) fail(`${route}: missing BreadcrumbList JSON-LD`);
  if (!hasType(route, 'FAQPage')) fail(`${route}: missing FAQPage JSON-LD`);
  const page = pageCache.get(route);
  if (page && !page.html.includes('id="game-data"')) fail(`${route}: missing inline game data`);
  if (page && !page.html.includes('game-boot.js')) fail(`${route}: missing game boot script`);
}
if (!hasType('/', 'Organization')) fail('home: missing Organization JSON-LD');
if (!hasType('/', 'WebSite')) fail('home: missing WebSite JSON-LD');
if (!hasType('/parking-fury-levels/', 'Article')) fail('guide: missing Article JSON-LD');
if (!hasType('/car-parking-games/', 'CollectionPage')) fail('category: missing CollectionPage JSON-LD');

/* ---------------- Link and asset checks ---------------- */
const assetExists = (urlPath) => {
  const clean = urlPath.split('#')[0].split('?')[0];
  if (clean === '/' || clean === '') return true;
  const candidate = join(dist, clean.replace(/^\//, ''));
  if (existsSync(candidate)) return true;
  if (existsSync(join(candidate, 'index.html'))) return true;
  return false;
};

for (const [route, page] of pageCache) {
  const label = route === '/' ? 'home' : route;

  for (const m of page.html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const href = m[1];
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) continue;
    if (href.startsWith('#')) {
      const id = href.slice(1);
      if (id && !page.html.includes(`id="${id}"`)) fail(`${label}: missing anchor target #${id}`);
      continue;
    }
    if (!href.startsWith('/')) continue;
    if (!assetExists(href)) fail(`${label}: broken internal link ${href}`);
  }

  for (const m of page.html.matchAll(/<(?:img|script|link)\b[^>]*(?:src|href)="([^"]+)"/g)) {
    const url = m[1];
    if (!url.startsWith('/')) continue;
    if (url.endsWith('.html')) continue;
    if (url === '/favicon.svg' || url.startsWith('/assets/') || url === '/site.webmanifest') {
      if (!assetExists(url)) fail(`${label}: missing asset ${url}`);
    }
  }

  // no empty headings or duplicate ids
  if (/<h[23][^>]*>\s*<\/h[23]>/.test(page.html)) fail(`${label}: empty heading`);
  const ids = [...page.html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) fail(`${label}: duplicate id "${id}"`);
    seen.add(id);
  }
}

/* ---------------- Sitemap ---------------- */
const sitemapPath = join(dist, 'sitemap.xml');
if (!existsSync(sitemapPath)) {
  fail('sitemap.xml missing');
} else {
  const sitemap = readFileSync(sitemapPath, 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!urls.length) fail('sitemap.xml has no URLs');
  for (const url of urls) {
    if (!url.startsWith(SITE)) {
      fail(`sitemap: non-production URL ${url}`);
      continue;
    }
    const route = url.slice(SITE.length) || '/';
    const page = pageCache.get(route);
    if (!page) fail(`sitemap: URL has no built page: ${url}`);
    else if (page.robots.includes('noindex')) fail(`sitemap: noindex page listed: ${url}`);
  }
  for (const route of pageCache.keys()) {
    if (route === '/404.html' || route === '/search/') continue;
    if (!urls.includes(`${SITE}${route}`)) {
      fail(`sitemap: missing indexable page ${route}`);
    }
  }
  if (!sitemap.includes('<urlset')) fail('sitemap: missing urlset');
}

/* ---------------- robots + manifest ---------------- */
const robots = existsSync(join(dist, 'robots.txt')) ? readFileSync(join(dist, 'robots.txt'), 'utf8') : '';
if (!robots.includes('Sitemap:')) fail('robots.txt missing Sitemap line');
if (!robots.includes('Disallow: /search/')) warn('robots.txt does not disallow /search/');

const manifest = existsSync(join(dist, 'site.webmanifest')) ? JSON.parse(readFileSync(join(dist, 'site.webmanifest'), 'utf8')) : null;
if (!manifest) fail('site.webmanifest missing');
else {
  for (const icon of manifest.icons || []) {
    if (!existsSync(join(dist, icon.src.replace(/^\//, '')))) fail(`manifest: missing icon ${icon.src}`);
  }
}

/* ---------------- Copy checks ---------------- */
for (const [route, page] of pageCache) {
  if (route === '/404') continue;
  if (/lorem ipsum/i.test(page.html)) fail(`${route}: contains lorem ipsum`);
  if (/players? (online|playing) now/i.test(page.html)) fail(`${route}: contains unverified live player claim`);
}

/* ---------------- Output ---------------- */
console.log('');
console.log('GamesPlayLand QA');
console.log(`  pages checked: ${pageCache.size}`);
console.log(`  sitemap URLs:  ${existsSync(sitemapPath) ? [...readFileSync(sitemapPath, 'utf8').matchAll(/<loc>/g)].length : 0}`);
console.log(`  failures:      ${failures.length}`);
console.log(`  warnings:      ${warnings.length}`);

if (warnings.length) {
  console.log('\nWarnings');
  for (const w of warnings) console.log(`  - ${w}`);
}

if (failures.length) {
  console.log('\nFailures');
  for (const f of failures) console.log(`  ✗ ${f}`);
  process.exit(1);
}

console.log('\nAll checks passed.');
