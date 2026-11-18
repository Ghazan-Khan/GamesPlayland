/**
 * GamesPlayLand static site generator.
 * Zero dependencies. Run with: node build.mjs
 */
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SITE } from './src/site.config.mjs';
import { GAMES } from './src/data/games/index.mjs';
import { CATEGORIES } from './src/data/categories.mjs';
import { GUIDES } from './src/data/guides.mjs';
import { renderThumb, renderBanner, renderIcon, FAVICON_SVG } from './src/lib/art.mjs';
import {
  homePage,
  gamePage,
  categoryPage,
  guidePage,
  searchPage,
  trustPage,
  notFoundPage,
} from './src/templates.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');
const started = Date.now();

if (existsSync(dist)) rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const pages = [];

function write(rel, contents) {
  const file = join(dist, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, contents);
}

function writePage(route, html) {
  const rel = route === '/' ? 'index.html' : `${route.replace(/^\//, '')}index.html`;
  write(rel, html);
  pages.push(route);
}

function png(rel, canvas) {
  write(rel, canvas.toPNG());
}

/* ------------------------------------------------------------------ */
/* Images                                                              */
/* ------------------------------------------------------------------ */

const assetDir = 'assets';
mkdirSync(join(dist, assetDir, 'thumbs'), { recursive: true });
mkdirSync(join(dist, assetDir, 'og'), { recursive: true });
mkdirSync(join(dist, assetDir, 'icons'), { recursive: true });

for (const game of GAMES) {
  png(`${assetDir}/thumbs/${game.slug}.png`, renderThumb(game));
  png(
    `${assetDir}/og/${game.slug}.png`,
    renderBanner({
      title: game.name,
      kicker: game.kicker,
      subtitle: `${game.levelsCount} ${game.mode === 'puzzle' ? 'puzzles' : 'levels'} · Free browser game`,
      theme: game.theme,
      motif: game.motif,
    }),
  );
}

png(
  `${assetDir}/og/home.png`,
  renderBanner({
    title: 'Parking Fury',
    kicker: 'Original parking games',
    subtitle: '7 games · 49 levels · no downloads',
    theme: 'day',
    motif: 'car',
  }),
);

png(`${assetDir}/icons/icon-192.png`, renderIcon(192));
png(`${assetDir}/icons/icon-512.png`, renderIcon(512));
png(`${assetDir}/icons/apple-touch-icon.png`, renderIcon(180));
write('favicon.svg', FAVICON_SVG);

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */

writePage('/', homePage());
for (const game of GAMES) writePage(`/${game.slug}/`, gamePage(game));
for (const cat of CATEGORIES) writePage(`/${cat.slug}/`, categoryPage(cat));
for (const guide of GUIDES) writePage(`/${guide.slug}/`, guidePage(guide));
for (const slug of ['about-us', 'contact-us', 'privacy-policy', 'terms-of-use']) {
  writePage(`/${slug}/`, trustPage(slug));
}
writePage('/search/', searchPage());
write('404.html', notFoundPage());

/* ------------------------------------------------------------------ */
/* Static assets                                                       */
/* ------------------------------------------------------------------ */

const jsFiles = ['site.js', 'game-boot.js', 'parking-engine.js', 'parking-jam.js', 'geometry.js'];
mkdirSync(join(dist, assetDir, 'js'), { recursive: true });
for (const file of jsFiles) {
  writeFileSync(join(dist, assetDir, 'js', file), readFileSync(join(root, 'src', 'js', file)));
}

write(
  'robots.txt',
  `User-agent: *\nAllow: /\nDisallow: /search/\n\nSitemap: ${SITE.url}/sitemap.xml\n`,
);

write(
  'site.webmanifest',
  JSON.stringify(
    {
      name: `${SITE.name} – Parking Games`,
      short_name: SITE.name,
      description: SITE.description,
      start_url: '/',
      display: 'standalone',
      background_color: SITE.themeColor,
      theme_color: SITE.themeColor,
      icons: [
        { src: '/assets/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/assets/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ],
    },
    null,
    2,
  ),
);

/* ------------------------------------------------------------------ */
/* Sitemap                                                             */
/* ------------------------------------------------------------------ */

const priority = (route) => {
  if (route === '/') return '1.0';
  if (GAMES.some((g) => `/${g.slug}/` === route)) return '0.9';
  if (CATEGORIES.some((c) => `/${c.slug}/` === route)) return '0.8';
  if (GUIDES.some((g) => `/${g.slug}/` === route)) return '0.7';
  return '0.3';
};

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .filter((route) => route !== '/search/')
  .map(
    (route) => `  <url>
    <loc>${SITE.url}${route === '/' ? '/' : route}</loc>
    <lastmod>${SITE.launchDate}</lastmod>
    <changefreq>${route === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${priority(route)}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;
write('sitemap.xml', sitemap);

/* ------------------------------------------------------------------ */
/* Report                                                              */
/* ------------------------------------------------------------------ */

const elapsed = ((Date.now() - started) / 1000).toFixed(2);
console.log('');
console.log('GamesPlayLand build complete');
console.log(`  pages:    ${pages.length} + 404`);
console.log(`  games:    ${GAMES.length}`);
console.log(`  thumbs:   ${GAMES.length}`);
console.log(`  og images:${GAMES.length + 1}`);
console.log(`  sitemap:  ${pages.length - 1} URLs`);
console.log(`  time:     ${elapsed}s`);
console.log(`  output:   ${dist}`);
