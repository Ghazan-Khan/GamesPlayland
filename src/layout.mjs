import { readFileSync } from 'node:fs';
import { SITE, NAV, FOOTER_LINKS } from './site.config.mjs';

const CSS = readFileSync(new URL('./styles/main.css', import.meta.url), 'utf8');

export const esc = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const abs = (path = '/') => `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`;

export const ICONS = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  levels: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 8v4.5l3 2"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.8M17.5 14.2A5 5 0 0 1 21 19"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
  gamepad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 8h10a5 5 0 0 1 4.6 7l-.9 2a2.6 2.6 0 0 1-4.3 1L14.5 16h-5L7.6 18a2.6 2.6 0 0 1-4.3-1l-.9-2A5 5 0 0 1 7 8z"/><path d="M8 11v4M6 13h4M16 12h.01M18 14h.01"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 11v5M12 8h.01"/></svg>',
  expand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5"/></svg>',
  restart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10a8 8 0 1 1 2.3 7"/><path d="M4 4v6h6"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4h4v16H7zM13 4h4v16h-4z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 6"/></svg>',
  left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg>',
};

export function breadcrumbs(items) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><div class="container"><ol>${items
    .map((item, i) =>
      i === items.length - 1
        ? `<li><span aria-current="page">${esc(item.label)}</span></li>`
        : `<li><a href="${item.href}">${esc(item.label)}</a></li>`,
    )
    .join('')}</ol></div></nav>`;
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: abs(item.href),
    })),
  };
}

export function faqJsonLd(faq = []) {
  if (!faq.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

function head({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  noindex = false,
  preloadImage,
  jsonLd = [],
}) {
  const fullTitle = title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;
  const og = ogImage ? abs(ogImage) : abs('/assets/og/home.png');
  const ld = jsonLd.filter(Boolean).map(
    (item) => `<script type="application/ld+json">${JSON.stringify(item).replace(/</g, '\\u003c')}</script>`,
  );
  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${abs(canonical)}">
<meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}">
<meta name="theme-color" content="${SITE.themeColor}">
<meta name="color-scheme" content="dark">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:type" content="${ogType}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${abs(canonical)}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${og}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
${preloadImage ? `<link rel="preload" as="image" href="${preloadImage}" fetchpriority="high">` : ''}
<style>${CSS}</style>
${ld.join('\n')}
</head>`;
}

function header(active) {
  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="/">
      <span class="brand-mark">P</span>
      <span class="brand-name"><b>GAMESPLAYLAND</b><span>Parking games</span></span>
      <span class="visually-hidden"> Home</span>
    </a>
    <nav class="site-nav" id="site-nav" aria-label="Primary">
      ${NAV.map(
        (item) =>
          `<a href="${item.href}"${active === item.href ? ' aria-current="page"' : ''}>${esc(item.label)}</a>`,
      ).join('')}
    </nav>
    <div class="header-tools">
      <form class="header-search" action="/search/" method="get" role="search">
        <label class="visually-hidden" for="site-search">Search games and guides</label>
        ${ICONS.search}
        <input id="site-search" type="search" name="q" placeholder="Search games" autocomplete="off">
      </form>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu">
        <span aria-hidden="true"></span>
      </button>
    </div>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        <a class="brand" href="/">
          <span class="brand-mark">P</span>
          <span class="brand-name"><b>GAMESPLAYLAND</b><span>Parking games</span></span>
          <span class="visually-hidden"> Home</span>
        </a>
        <p>Original browser parking games. Built in-house, tested before release, free to play without an account.</p>
        <p class="footer-note">GamesPlayLand is an independent game studio. Our games are original works and are not affiliated with, endorsed by, or connected to any other game, developer or publisher with a similar name.</p>
      </div>
      ${FOOTER_LINKS.map(
        (group) => `<div class="footer-col">
        <h2>${esc(group.title)}</h2>
        <ul>${group.links.map((link) => `<li><a href="${link.href}">${esc(link.label)}</a></li>`).join('')}</ul>
      </div>`,
      ).join('')}
    </div>
    <div class="footer-bottom">
      <p>© ${new Date().getFullYear()} ${SITE.name}. All rights reserved.</p>
      <p>Made for keyboard, touch and small screens.</p>
    </div>
  </div>
</footer>`;
}

export function layout({
  title,
  description,
  canonical,
  bodyClass = '',
  active = '',
  ogImage,
  ogType,
  noindex = false,
  preloadImage,
  jsonLd = [],
  children,
}) {
  return `<!doctype html>
<html lang="en">
${head({ title, description, canonical, ogImage, ogType, noindex, preloadImage, jsonLd })}
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
${header(active)}
<main id="main">
${children}
</main>
${footer()}
<script src="/assets/js/site.js" defer></script>
</body>
</html>`;
}

export function gameCard(game, { badgeLime = false } = {}) {
  const name = `Play ${game.name}${game.badge ? ` — ${game.badge}` : ''}`;
  return `<article class="game-card">
  <a class="game-art" href="/${game.slug}/" aria-label="${esc(name)}">
    <img src="/assets/thumbs/${game.slug}.png" alt="" width="640" height="400" loading="lazy" decoding="async">
    ${game.badge ? `<span class="card-badge${badgeLime ? ' card-badge--lime' : ''}">${esc(game.badge)}</span>` : ''}
    <span class="play-orb" aria-hidden="true">${ICONS.play}</span>
  </a>
  <div class="game-card-body">
    <h3><a href="/${game.slug}/">${esc(game.name)}</a></h3>
    <p>${esc(game.cardBlurb)}</p>
    <div class="card-meta">
      <span>${ICONS.levels}${game.levelsCount} ${game.mode === 'puzzle' ? 'puzzles' : game.mode === 'sandbox' ? 'sandbox' : 'levels'}</span>
      <span>${ICONS.clock}${esc(game.duration.split(' per')[0])}</span>
    </div>
  </div>
</article>`;
}
