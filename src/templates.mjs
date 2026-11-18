import {
  SITE,
  NAV,
  FOOTER_LINKS,
} from './site.config.mjs';
import {
  layout,
  esc,
  abs,
  ICONS,
  breadcrumbs,
  breadcrumbJsonLd,
  faqJsonLd,
  gameCard,
} from './layout.mjs';
import { GAMES, GAME_BY_SLUG, gamesByCategory, FEATURED } from './data/games/index.mjs';
import { CATEGORIES, CATEGORY_BY_SLUG } from './data/categories.mjs';
import { GUIDES, GUIDE_BY_SLUG } from './data/guides.mjs';
import { LEVEL_PACKS, VEHICLE_SPECS } from './data/levels.mjs';

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: SITE.url,
  logo: abs('/assets/icons/icon-512.png'),
  description: SITE.description,
  email: SITE.email,
  foundingDate: SITE.launchDate,
  sameAs: [],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  inLanguage: 'en',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE.url}/search/?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

const gameListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Parking and driving games on GamesPlayLand',
  itemListElement: GAMES.map((game, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: game.name,
    url: abs(`/${game.slug}/`),
  })),
};

/* ------------------------------------------------------------------ */
/* Shared partials                                                     */
/* ------------------------------------------------------------------ */

function faqBlock(faq, heading = 'Frequently asked questions') {
  if (!faq || !faq.length) return '';
  return `<section class="section section--line" aria-labelledby="faq-heading">
  <div class="container">
    <p class="eyebrow">Answers</p>
    <h2 id="faq-heading" class="mb-2">${esc(heading)}</h2>
    <div class="faq-list">
      ${faq
        .map(
          (item) => `<details class="faq-item">
        <summary>${esc(item.q)}</summary>
        <p>${esc(item.a)}</p>
      </details>`,
        )
        .join('')}
    </div>
  </div>
</section>`;
}

function relatedGamesBlock(slugs, heading = 'Play next') {
  const games = (slugs || []).map((slug) => GAME_BY_SLUG[slug]).filter(Boolean);
  if (!games.length) return '';
  return `<section class="section section--line" aria-labelledby="related-heading">
  <div class="container">
    <div class="section-head">
      <div>
        <p class="eyebrow">Keep playing</p>
        <h2 id="related-heading">${esc(heading)}</h2>
      </div>
      <a class="link-more" href="/car-parking-games/">All parking games ${ICONS.arrow}</a>
    </div>
    <div class="related-grid">
      ${games
        .map(
          (game) => `<a class="related-card" href="/${game.slug}/">
        <img src="/assets/thumbs/${game.slug}.png" alt="" width="640" height="400" loading="lazy" decoding="async">
        <span><b>${esc(game.name)}</b><span>${esc(game.categoryLabel)} · ${game.levelsCount} ${game.mode === 'puzzle' ? 'puzzles' : 'levels'}</span></span>
      </a>`,
        )
        .join('')}
    </div>
  </div>
</section>`;
}

function disclaimerBlock() {
  return `<div class="container">
  <p class="footer-note" style="max-width: 78ch; margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--line);">
    <strong>Original game notice:</strong> every game on GamesPlayLand is built in-house by our own team. They are not copies, ports or reuploads of any other game, and we are not affiliated with any developer or publisher behind a similarly named title, including the 2016 browser game <em>Parking Fury</em>. Artwork is generated procedurally and no third-party game files are used.
  </p>
</div>`;
}

function starsRulePanel() {
  return `<div class="panel">
  <h2>Star scoring</h2>
  <ul class="aside-links">
    <li><span style="display:flex;justify-content:space-between;gap:8px;padding:8px 0;font-size:.86rem;"><span style="color:var(--lime);font-weight:800;">★★★</span><span style="color:var(--text-soft);">No damage + under par</span></span></li>
    <li><span style="display:flex;justify-content:space-between;gap:8px;padding:8px 0;font-size:.86rem;"><span style="color:var(--lime);font-weight:800;">★★☆</span><span style="color:var(--text-soft);">Up to 2 impacts</span></span></li>
    <li><span style="display:flex;justify-content:space-between;gap:8px;padding:8px 0;font-size:.86rem;"><span style="color:var(--lime);font-weight:800;">★☆☆</span><span style="color:var(--text-soft);">Any clean finish</span></span></li>
  </ul>
  <p style="margin:12px 0 0;color:var(--muted-dim);font-size:.78rem;line-height:1.5;">Each impact adds 15 damage. At 100 the run ends. Stars are saved in this browser.</p>
</div>`;
}

function keyCaps(keys) {
  return String(keys)
    .split(/\s+or\s+|\s*\/\s*|\s*,\s*/i)
    .filter(Boolean)
    .map((key) => {
      const label =
        key === 'Arrow Up' ? '↑' : key === 'Arrow Down' ? '↓' : key === 'Arrow Left' ? '←' : key === 'Arrow Right' ? '→' : key;
      return `<kbd>${esc(label)}</kbd>`;
    })
    .join(' ');
}

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */

export function homePage() {
  const featured = FEATURED;
  const guides = GUIDES.slice(0, 3);
  const catKey = { 'car-parking-games': 'car', 'truck-parking-games': 'truck', 'parking-puzzle-games': 'puzzle', 'driving-games': 'driving' };
  const catCount = (slug) => gamesByCategory(catKey[slug]).length;
  const faq = [
    {
      q: 'Are the games on GamesPlayLand free?',
      a: 'Yes. Every game is free to play in full. There is no download, no account and no paywall.',
    },
    {
      q: 'Do I need to install anything?',
      a: 'No. All games run in your browser using HTML canvas. Nothing is installed on your device.',
    },
    {
      q: 'Can I play on a phone or tablet?',
      a: 'Yes. The games detect touch devices and show on-screen steering and pedals. Parking Jam uses tap and drag, so it works particularly well on a phone.',
    },
    {
      q: 'Is this the same Parking Fury as the 2016 browser game?',
      a: 'No. That game was made by a different developer. Our Parking Fury is an original game with its own levels, physics and artwork, and we are not affiliated with the 2016 title.',
    },
    {
      q: 'How many levels are there in total?',
      a: 'Forty-nine across seven games at launch: 12 in Parking Fury, 10 in Parking Fury 2, 8 in Parking Fury 3, 5 each in Truck Parking and Bus Parking, 8 puzzles in Parking Jam and one open sandbox.',
    },
    {
      q: 'Do the games save my progress?',
      a: 'Stars and best times are stored in your browser’s local storage on the device you are using. There is no account and nothing is sent to a server.',
    },
  ];

  const body = `${breadcrumbs([{ label: 'Home', href: '/' }])}
<section class="hero">
  <div class="container hero-grid">
    <div class="hero-copy">
      <p class="eyebrow">Original games · Free to play</p>
      <h1>Parking games worth the <em>squeeze</em>.</h1>
      <p class="lead">Seven original browser games built around tight bays, honest handling and levels you can finish. No downloads, no sign-up, no fake player counts.</p>
      <div class="hero-actions">
        <a class="btn" href="/${featured.slug}/">${ICONS.play} Play Parking Fury</a>
        <a class="btn btn--ghost" href="#all-games">Browse all games ${ICONS.arrow}</a>
      </div>
      <ul class="hero-stats">
        <li><b>7</b><span>Original games</span></li>
        <li><b>49</b><span>Levels &amp; puzzles</span></li>
        <li><b>0</b><span>Downloads</span></li>
      </ul>
    </div>
    <div class="hero-art">
      <a class="game-art" href="/${featured.slug}/" aria-label="Play ${esc(featured.name)}">
        <img src="/assets/thumbs/${featured.slug}.png" alt="Parking Fury gameplay artwork showing a car in a tight parking bay" width="640" height="400" fetchpriority="high" decoding="async">
        <span class="play-orb" aria-hidden="true">${ICONS.play}</span>
      </a>
      <div class="float-chip"><span class="dot" aria-hidden="true"></span> 12 hand-built levels</div>
    </div>
  </div>
</section>

<section class="section" id="all-games">
  <div class="container">
    <div class="section-head">
      <div>
        <p class="eyebrow">The collection</p>
        <h2>Seven games. One honest garage.</h2>
        <p>Start with the car lots, graduate to the truck and bus, or switch off the clock and just drive.</p>
      </div>
      <a class="link-more" href="/best-parking-games/">How we pick games ${ICONS.arrow}</a>
    </div>
    <div class="game-grid">
      ${GAMES.map((game, i) => gameCard(game, { badgeLime: i === 0 })).join('')}
    </div>
  </div>
</section>

<section class="section section--line">
  <div class="container">
    <div class="section-head">
      <div>
        <p class="eyebrow">Browse by type</p>
        <h2>Find the parking game you actually want</h2>
      </div>
    </div>
    <div class="cat-grid">
      ${CATEGORIES.map(
        (cat, i) => `<a class="cat-card" href="/${cat.slug}/">
        <span class="cat-index">0${i + 1}</span>
        <h3>${esc(cat.name)}</h3>
        <p>${esc(cat.short)}</p>
        <span class="cat-arrow">${catCount(cat.slug)} game${catCount(cat.slug) === 1 ? '' : 's'} →</span>
      </a>`,
      ).join('')}
    </div>
  </div>
</section>

<section class="section section--line">
  <div class="container">
    <div class="section-head">
      <div>
        <p class="eyebrow">Why play here</p>
        <h2>Small site. Real games.</h2>
        <p>We would rather publish seven games that work than seventy embeds that might not load next month.</p>
      </div>
    </div>
    <div class="trust-strip">
      <div class="trust-item">
        ${ICONS.shield}
        <div><h3>Built in-house</h3><p>Every level, vehicle and pixel is ours. No third-party game frames, no reuploads, no licensing guesswork.</p></div>
      </div>
      <div class="trust-item">
        ${ICONS.bolt}
        <div><h3>Fast by default</h3><p>A lightweight canvas engine, no external fonts and no trackers. The game loads when you press play, not before.</p></div>
      </div>
      <div class="trust-item">
        ${ICONS.gamepad}
        <div><h3>Keyboard and touch</h3><p>WASD or arrows on desktop, large thumb controls on mobile. Every game is playable on a 320px screen.</p></div>
      </div>
    </div>
  </div>
</section>

<section class="section section--line">
  <div class="container">
    <div class="section-head">
      <div>
        <p class="eyebrow">Guides</p>
        <h2>Get better, not just busy</h2>
        <p>Control references, level breakdowns and the habits that separate a three-star park from a scratched bumper.</p>
      </div>
      <a class="link-more" href="/parking-fury-controls/">All guides ${ICONS.arrow}</a>
    </div>
    <div class="feature-grid">
      ${guides
        .map(
          (guide) => `<a class="feature-card" href="/${guide.slug}/" style="text-decoration:none;">
        <span class="feature-num">${esc(guide.readingTime)}</span>
        <h3>${esc(guide.name)}</h3>
        <p>${esc(guide.description.split('.')[0])}.</p>
      </a>`,
        )
        .join('')}
    </div>
  </div>
</section>

${faqBlock(faq, 'Parking games, answered')}
${disclaimerBlock()}`;

  return layout({
    title: 'Free Online Parking Games – Play Parking Fury',
    description:
      'Play free original parking games in your browser. Parking Fury, night lots, truck and bus parking, car-jam puzzles and an open driving sandbox. No downloads, no sign-up.',
    canonical: '/',
    active: '/',
    preloadImage: '/assets/thumbs/parking-fury.png',
    ogImage: '/assets/og/home.png',
    jsonLd: [orgJsonLd, websiteJsonLd, gameListJsonLd, faqJsonLd(faq)],
    children: body,
  });
}

/* ------------------------------------------------------------------ */
/* Game page                                                           */
/* ------------------------------------------------------------------ */

function gameStage(game) {
  const isJam = game.engine === 'jam';
  const isSandbox = game.mode === 'sandbox';
  const hud = isJam
    ? `<div class="hud" id="game-hud">
      <div class="hud-group">
        <span class="hud-pill">Puzzle <b id="hud-level">1</b></span>
        <span class="hud-pill">Moves <b id="hud-moves">0</b></span>
        <span class="hud-pill">Par <b id="hud-par">–</b></span>
      </div>
      <div class="hud-actions">
        <button class="icon-btn" type="button" data-action="undo" aria-label="Undo last move" title="Undo (Z)">↶</button>
        <button class="icon-btn" type="button" data-action="restart" aria-label="Reset puzzle" title="Reset (R)">${ICONS.restart}</button>
        <button class="icon-btn" type="button" data-action="fullscreen" aria-label="Toggle fullscreen" title="Fullscreen (F)">${ICONS.expand}</button>
      </div>
    </div>`
    : `<div class="hud" id="game-hud">
      <div class="hud-group">
        <span class="hud-pill">${isSandbox ? 'Sandbox' : 'Level'} <b id="hud-level">${isSandbox ? '∞' : '1'}</b></span>
        ${isSandbox ? '' : `<span class="hud-pill" id="hud-time">0:00</span><span class="hud-pill">Damage <span class="damage-track"><span class="damage-fill" id="hud-damage"></span></span></span>`}
      </div>
      <div class="hud-actions">
        <button class="icon-btn" type="button" data-action="pause" aria-label="Pause game" title="Pause (P)">${ICONS.pause}</button>
        <button class="icon-btn" type="button" data-action="restart" aria-label="Restart level" title="Restart (R)">${ICONS.restart}</button>
        <button class="icon-btn" type="button" data-action="fullscreen" aria-label="Toggle fullscreen" title="Fullscreen (F)">${ICONS.expand}</button>
      </div>
    </div>`;

  const touch = isJam
    ? ''
    : `<div class="touch-controls" aria-label="Touch controls">
      <div class="touch-group">
        <button class="touch-btn" type="button" data-control="left" aria-label="Steer left">${ICONS.left}</button>
        <button class="touch-btn" type="button" data-control="right" aria-label="Steer right">${ICONS.right}</button>
      </div>
      <div class="touch-group">
        <button class="touch-btn touch-btn--wide" type="button" data-control="handbrake" aria-label="Handbrake">HB</button>
        <button class="touch-btn touch-btn--wide" type="button" data-control="brake" aria-label="Brake and reverse">▼</button>
        <button class="touch-btn touch-btn--wide" type="button" data-control="accelerate" aria-label="Accelerate">▲</button>
      </div>
    </div>`;

  const note =
    game.mode === 'puzzle'
      ? 'Tap to slide · no timer'
      : game.mode === 'sandbox'
        ? 'No timer · no score'
        : 'Free · keyboard or touch';

  return `<div class="game-stage" id="game-stage" data-game="${game.slug}" data-engine="${game.engine}" data-mode="${game.mode}">
  <canvas id="game-canvas" width="1280" height="800" role="img" aria-label="Playable ${esc(game.name)} game area"></canvas>
  ${hud}
  ${touch}
  <div class="game-loading" id="game-loading" hidden>Loading game…</div>
  <button class="game-facade" id="game-facade" type="button" aria-label="Play ${esc(game.name)} — ${esc(note)}">
    <img src="/assets/thumbs/${game.slug}.png" alt="" width="640" height="400" fetchpriority="high" decoding="async">
    <span class="facade-inner">
      <span class="facade-play" aria-hidden="true">${ICONS.play}</span>
      <span class="facade-label">Play ${esc(game.name)}</span>
      <span class="facade-note">${esc(note)}</span>
    </span>
  </button>
</div>`;
}

function levelStrip(game) {
  if (game.mode === 'sandbox') {
    return `<p class="game-note">${ICONS.info}<span>Free Drive has no levels or timer. Use <kbd>R</kbd> to respawn, or just explore. Progress is not recorded because nothing is being scored.</span></p>`;
  }
  const levels = LEVEL_PACKS[game.slug]?.levels || [];
  const label = game.mode === 'puzzle' ? 'Puzzle' : 'Level';
  return `<div class="level-strip" id="level-strip" role="group" aria-label="Choose ${label.toLowerCase()}">
    ${levels
      .map(
        (level, i) => `<button class="level-btn" type="button" data-level="${i}" aria-label="${label} ${i + 1}: ${esc(level.name)}" aria-current="${i === 0 ? 'true' : 'false'}">
      <span>${i + 1}</span>
      <span class="stars stars--empty" data-stars="${i}" aria-hidden="true">★★★</span>
    </button>`,
      )
      .join('')}
  </div>
  <p class="game-note">${ICONS.info}<span>${game.mode === 'puzzle' ? 'Par is the number of single-space slides in a tidy solution. Undo and reset are free.' : 'Three stars require a clean run under par. Your best stars are saved in this browser.'}</span></p>`;
}

function gameJson(game) {
  const pack = LEVEL_PACKS[game.slug];
  const payload = {
    slug: game.slug,
    name: game.name,
    engine: game.engine,
    mode: game.mode,
    theme: game.theme,
    levels: pack ? pack.levels : [],
    vehicles: VEHICLE_SPECS,
  };
  return `<script type="application/json" id="game-data">${JSON.stringify(payload).replace(/</g, '\\u003c')}</script>`;
}

const CATEGORY_FOR_GAME = {
  car: 'car-parking-games',
  truck: 'truck-parking-games',
  puzzle: 'parking-puzzle-games',
  driving: 'driving-games',
};

function levelGuideHref(game) {
  if (game.slug === 'parking-fury') return '/parking-fury-levels/';
  if (game.slug === 'parking-jam') return '/parking-puzzle-games/';
  if (game.category === 'truck') return '/truck-parking-games/';
  if (game.category === 'driving') return '/driving-games/';
  return '/parking-fury-tips/';
}

export function gamePage(game) {
  const category = CATEGORY_BY_SLUG[CATEGORY_FOR_GAME[game.category]] || CATEGORY_BY_SLUG['car-parking-games'];
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: category.name, href: `/${category.slug}/` },
    { label: game.name, href: `/${game.slug}/` },
  ];

  const jsonLd = [
    breadcrumbJsonLd(crumbs),
    {
      '@context': 'https://schema.org',
      '@type': 'VideoGame',
      name: game.name,
      description: game.description,
      url: abs(`/${game.slug}/`),
      image: abs(`/assets/og/${game.slug}.png`),
      genre: game.mode === 'puzzle' ? ['Puzzle', 'Logic'] : ['Parking', 'Driving', 'Casual'],
      gamePlatform: ['Web browser', 'Desktop', 'Mobile'],
      operatingSystem: 'Any modern browser',
      applicationCategory: 'Game',
      playMode: 'SinglePlayer',
      numberOfPlayers: 1,
      inLanguage: 'en',
      datePublished: game.published,
      dateModified: game.updated,
      author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
      publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
    },
    faqJsonLd(game.faq),
  ];

  const body = `${breadcrumbs(crumbs)}
<section class="page-head page-head--art">
  <div class="container">
    <p class="eyebrow">${esc(game.kicker)}</p>
    <h1>${esc(game.h1)}</h1>
    <p class="lead">${esc(game.intro)}</p>
    <div class="page-meta">
      <span class="chip">${ICONS.levels}${game.levelsCount} ${game.mode === 'puzzle' ? 'puzzles' : game.mode === 'sandbox' ? 'open sandbox' : 'levels'}</span>
      <span class="chip">${ICONS.clock}${esc(game.duration)}</span>
      <span class="chip">${ICONS.users}${esc(game.players)}</span>
      <span class="chip">${ICONS.star}${esc(game.difficulty)}</span>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="container">
    <div class="game-layout">
      <div class="game-main">
        ${gameStage(game)}
        ${levelStrip(game)}
        ${gameJson(game)}
      </div>
      <aside class="game-aside" aria-label="Game information">
        <div class="panel">
          <h2>Controls</h2>
          <ul class="controls-list">
            ${game.controls
              .map((c) => `<li><span>${esc(c.action)}</span><span>${keyCaps(c.keys)}</span></li>`)
              .join('')}
          </ul>
        </div>
        ${game.mode === 'sandbox' ? '' : starsRulePanel()}
        <div class="panel">
          <h2>More games</h2>
          <ul class="aside-links">
            ${GAMES.filter((g) => g.slug !== game.slug)
              .slice(0, 5)
              .map((g) => `<li><a href="/${g.slug}/">${esc(g.name)}</a></li>`)
              .join('')}
          </ul>
        </div>
      </aside>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="prose">
      <h2>About ${esc(game.name)}</h2>
      ${game.about}
      <h2>How to play</h2>
      <ol class="steps">
        ${game.howTo.map((step) => `<li>${esc(step)}</li>`).join('')}
      </ol>
      <h2>Controls in detail</h2>
      <p>${esc(game.touchNote)}</p>
      <table>
        <thead><tr><th>Action</th><th>Keys</th></tr></thead>
        <tbody>
          ${game.controls.map((c) => `<tr><td>${esc(c.action)}</td><td>${keyCaps(c.keys)}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="section section--line">
  <div class="container">
    <p class="eyebrow">What is inside</p>
    <h2 class="mb-2">Features</h2>
    <div class="feature-grid">
      ${game.features
        .map(
          (f, i) => `<article class="feature-card">
        <span class="feature-num">0${i + 1}</span>
        <h3>${esc(f.title)}</h3>
        <p>${esc(f.text)}</p>
      </article>`,
        )
        .join('')}
    </div>
  </div>
</section>

<section class="section section--line">
  <div class="container">
    <p class="eyebrow">Play better</p>
    <h2 class="mb-2">${game.mode === 'puzzle' ? 'Solving tips' : 'Tips from the test bench'}</h2>
    <ol class="tip-list">
      ${game.tips
        .map(
          (tip) => `<li>
        <div><h3>${esc(tip.title)}</h3><p>${esc(tip.text)}</p></div>
      </li>`,
        )
        .join('')}
    </ol>
  </div>
</section>

${
  game.levelFocus && game.levelFocus.length
    ? `<section class="section section--line">
  <div class="container">
    <p class="eyebrow">Level by level</p>
    <h2 class="mb-2">${game.mode === 'puzzle' ? 'Puzzle list' : 'Level list'}</h2>
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>#</th><th>Name</th><th>Focus</th><th>${game.mode === 'puzzle' ? 'Par' : 'Par time'}</th></tr></thead>
        <tbody>
          ${game.levelFocus
            .map(
              (level) => `<tr><td>${level.n}</td><td>${esc(level.name)}</td><td>${esc(level.focus)}</td><td>${esc(level.par)}</td></tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>
    <p class="mt-2"><a href="${levelGuideHref(game)}">${game.slug === 'parking-fury' ? 'Read the full level guide' : 'See the category guide'}</a></p>
  </div>
</section>`
    : ''
}

${faqBlock(game.faq, `${game.name} questions`)}
${relatedGamesBlock(game.related, 'More original parking games')}
${disclaimerBlock()}
<script type="module" src="/assets/js/game-boot.js"></script>`;

  return layout({
    title: game.title,
    description: game.description,
    canonical: `/${game.slug}/`,
    active: `/${category.slug}/`,
    ogImage: `/assets/og/${game.slug}.png`,
    ogType: 'website',
    preloadImage: `/assets/thumbs/${game.slug}.png`,
    jsonLd,
    children: body,
  });
}

/* ------------------------------------------------------------------ */
/* Category                                                            */
/* ------------------------------------------------------------------ */

export function categoryPage(cat) {
  const games = GAMES.filter((game) => {
    if (cat.slug === 'car-parking-games') return game.category === 'car';
    if (cat.slug === 'truck-parking-games') return game.category === 'truck';
    if (cat.slug === 'parking-puzzle-games') return game.category === 'puzzle';
    if (cat.slug === 'driving-games') return game.category === 'driving';
    return false;
  });

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: cat.name, href: `/${cat.slug}/` },
  ];

  const jsonLd = [
    breadcrumbJsonLd(crumbs),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: cat.title,
      description: cat.description,
      url: abs(`/${cat.slug}/`),
      isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE.url },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: games.map((game, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: game.name,
          url: abs(`/${game.slug}/`),
        })),
      },
    },
    faqJsonLd(cat.faq),
  ];

  const body = `${breadcrumbs(crumbs)}
<section class="page-head page-head--art">
  <div class="container">
    <p class="eyebrow">${esc(cat.kicker)}</p>
    <h1>${esc(cat.h1)}</h1>
    <p class="lead">${esc(cat.short)}. ${esc(cat.intro.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split('. ')[0])}.</p>
    <div class="page-meta">
      <span class="chip">${ICONS.gamepad}${games.length} game${games.length === 1 ? '' : 's'}</span>
      <span class="chip">${ICONS.levels}${games.reduce((sum, g) => sum + g.levelsCount, 0)} ${cat.slug === 'parking-puzzle-games' ? 'puzzles' : 'levels'}</span>
      <span class="chip">${ICONS.bolt}No download</span>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="prose">${cat.intro}</div>
  </div>
</section>

<section class="section section--tight">
  <div class="container">
    <div class="section-head">
      <div>
        <p class="eyebrow">Play now</p>
        <h2>${esc(cat.name)} on GamesPlayLand</h2>
      </div>
    </div>
    <div class="game-grid">
      ${games.map((game) => gameCard(game, { badgeLime: game.featured })).join('')}
    </div>
  </div>
</section>

<section class="section section--line">
  <div class="container">
    <p class="eyebrow">Compare</p>
    <h2 class="mb-2">At a glance</h2>
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr>${cat.comparison.columns.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead>
        <tbody>
          ${cat.comparison.rows
            .map(
              (row) => `<tr>${row.cells
                .map((cell, i) => (i === 0 ? `<td><a href="${row.href}">${esc(cell)}</a></td>` : `<td>${esc(cell)}</td>`))
                .join('')}</tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="section section--line">
  <div class="container">
    <div class="prose">${cat.whatIs}</div>
  </div>
</section>

<section class="section section--line">
  <div class="container">
    <p class="eyebrow">Choose your game</p>
    <h2 class="mb-2">Which one should you play?</h2>
    <div class="feature-grid">
      ${cat.howToChoose
        .map(
          (item, i) => `<article class="feature-card">
        <span class="feature-num">0${i + 1}</span>
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.text)}</p>
      </article>`,
        )
        .join('')}
    </div>
  </div>
</section>

${faqBlock(cat.faq, `${cat.name} questions`)}

<section class="section section--line">
  <div class="container">
    <p class="eyebrow">Keep browsing</p>
    <h2 class="mb-2">Other categories</h2>
    <div class="cat-grid">
      ${CATEGORIES.filter((c) => c.slug !== cat.slug)
        .map(
          (c, i) => `<a class="cat-card" href="/${c.slug}/">
        <span class="cat-index">0${i + 1}</span>
        <h3>${esc(c.name)}</h3>
        <p>${esc(c.short)}</p>
        <span class="cat-arrow">Browse →</span>
      </a>`,
        )
        .join('')}
    </div>
  </div>
</section>
${disclaimerBlock()}`;

  return layout({
    title: cat.title,
    description: cat.description,
    canonical: `/${cat.slug}/`,
    active: `/${cat.slug}/`,
    ogImage: games[0] ? `/assets/og/${games[0].slug}.png` : '/assets/og/home.png',
    jsonLd,
    children: body,
  });
}

/* ------------------------------------------------------------------ */
/* Guide                                                               */
/* ------------------------------------------------------------------ */

export function guidePage(guide) {
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Guides', href: '/best-parking-games/' },
    { label: guide.name, href: `/${guide.slug}/` },
  ];

  const jsonLd = [
    breadcrumbJsonLd(crumbs),
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guide.h1,
      description: guide.description,
      url: abs(`/${guide.slug}/`),
      mainEntityOfPage: abs(`/${guide.slug}/`),
      datePublished: guide.updated,
      dateModified: guide.updated,
      inLanguage: 'en',
      image: abs('/assets/og/home.png'),
      author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
      publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url, logo: { '@type': 'ImageObject', url: abs('/assets/icons/icon-512.png') } },
    },
    faqJsonLd(guide.faq),
  ];

  const body = `${breadcrumbs(crumbs)}
<section class="page-head">
  <div class="container container--narrow" style="margin-left:0;">
    <p class="eyebrow">${esc(guide.kicker)} · ${esc(guide.readingTime)}</p>
    <h1>${esc(guide.h1)}</h1>
    <p class="lead">${esc(guide.intro.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split('. ').slice(0, 2).join('. '))}.</p>
    <p class="mt-2" style="color:var(--muted-dim);font-size:.8rem;">Updated ${esc(guide.updated)}</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="article-layout">
      <article>
        <div class="prose">
          ${guide.intro}
          ${guide.sections
            .map(
              (section) => `<h2 id="${section.id}">${esc(section.heading)}</h2>
          ${section.body}`,
            )
            .join('')}
        </div>
        <div class="article-foot">
          <p style="color:var(--muted);font-size:.86rem;margin-bottom:12px;">Written and tested by the GamesPlayLand team. Every level reference matches the current build.</p>
          <a class="btn btn--ghost btn--sm" href="/parking-fury/">${ICONS.play} Practise in Parking Fury</a>
        </div>
      </article>
      <aside class="toc" aria-label="On this page">
        <h2>On this page</h2>
        <ol>
          ${guide.sections.map((section) => `<li><a href="#${section.id}">${esc(section.heading)}</a></li>`).join('')}
        </ol>
      </aside>
    </div>
  </div>
</section>

${faqBlock(guide.faq, 'Quick answers')}
${relatedGamesBlock(guide.relatedGames, 'Play the games in this guide')}

<section class="section section--line">
  <div class="container">
    <p class="eyebrow">More guides</p>
    <h2 class="mb-2">Read next</h2>
    <div class="related-grid">
      ${guide.relatedGuides
        .map((slug) => GUIDE_BY_SLUG[slug])
        .filter(Boolean)
        .map(
          (g) => `<a class="related-card" href="/${g.slug}/" style="display:block;">
        <span class="feature-num" style="margin-bottom:8px;">${esc(g.readingTime)}</span>
        <b>${esc(g.name)}</b>
        <span style="display:block;margin-top:4px;color:var(--muted);font-size:.78rem;">${esc(g.description.split('.')[0])}.</span>
      </a>`,
        )
        .join('')}
    </div>
  </div>
</section>`;

  return layout({
    title: guide.title,
    description: guide.description,
    canonical: `/${guide.slug}/`,
    active: '/best-parking-games/',
    ogImage: '/assets/og/home.png',
    ogType: 'article',
    jsonLd,
    children: body,
  });
}

/* ------------------------------------------------------------------ */
/* Search                                                              */
/* ------------------------------------------------------------------ */

export function searchPage() {
  const index = [
    ...GAMES.map((g) => ({
      title: g.name,
      url: `/${g.slug}/`,
      kind: g.mode === 'puzzle' ? 'Puzzle' : g.mode === 'sandbox' ? 'Sandbox' : 'Parking game',
      text: `${g.cardBlurb} ${g.categoryLabel}`,
      image: `/assets/thumbs/${g.slug}.png`,
    })),
    ...CATEGORIES.map((c) => ({ title: c.name, url: `/${c.slug}/`, kind: 'Category', text: c.short, image: '' })),
    ...GUIDES.map((g) => ({ title: g.name, url: `/${g.slug}/`, kind: 'Guide', text: g.description, image: '' })),
    { title: 'About us', url: '/about-us/', kind: 'Page', text: 'How GamesPlayLand builds and tests its games.', image: '' },
    { title: 'Contact', url: '/contact-us/', kind: 'Page', text: 'Get in touch with the GamesPlayLand team.', image: '' },
    { title: 'Privacy policy', url: '/privacy-policy/', kind: 'Page', text: 'What we store and what we do not.', image: '' },
    { title: 'Terms of use', url: '/terms-of-use/', kind: 'Page', text: 'The rules for using this site.', image: '' },
  ];

  const body = `${breadcrumbs([{ label: 'Home', href: '/' }, { label: 'Search', href: '/search/' }])}
<section class="page-head">
  <div class="container">
    <p class="eyebrow">Search</p>
    <h1>Find a game or guide</h1>
    <p class="lead">Search the seven games, four categories and six guides. Everything is on this site — no external results.</p>
    <div class="mt-3">
      <form class="search-box" role="search" action="/search/" method="get">
        ${ICONS.search}
        <label class="visually-hidden" for="search-input">Search games and guides</label>
        <input id="search-input" type="search" name="q" placeholder="Try “truck”, “night”, “controls”…" autocomplete="off" autofocus>
      </form>
      <p class="search-status" id="search-status" aria-live="polite">Type to filter the list below.</p>
    </div>
  </div>
</section>
<section class="section section--tight">
  <div class="container">
    <div class="game-grid" id="search-results">
      ${GAMES.map((game) => gameCard(game)).join('')}
    </div>
    <p class="search-empty" id="search-empty" hidden>No matches. Try “parking”, “truck”, “puzzle” or “tips”.</p>
  </div>
</section>
<script type="application/json" id="search-index">${JSON.stringify(index).replace(/</g, '\\u003c')}</script>`;

  return layout({
    title: 'Search Games and Guides',
    description: 'Search the GamesPlayLand collection of original parking games, truck and bus challenges, puzzle games and written guides by name, theme or control scheme.',
    canonical: '/search/',
    noindex: true,
    children: body,
  });
}

/* ------------------------------------------------------------------ */
/* Trust pages                                                         */
/* ------------------------------------------------------------------ */

const TRUST = {
  'about-us': {
    name: 'About Us',
    title: 'About GamesPlayLand – Original Browser Games',
    description:
      'GamesPlayLand is an independent studio building original browser parking games. Learn how we design, test and publish every level.',
    h1: 'About GamesPlayLand',
    kicker: 'Independent studio',
    intro:
      'We build small, deliberate browser games. No accounts, no stores, no fake numbers — just parking challenges that load fast and behave honestly.',
    sections: [
      {
        heading: 'Why parking games',
        body: `<p>Parking is a rare kind of game design problem. The rules fit in a sentence, the failure state is obvious, and the skill is genuinely transferable. It also scales: a tight bay in a quiet lot is a different challenge from an eleven-metre bus in a night depot, using the same core physics.</p>
<p>We started with one question: what if the car actually behaved like a car? That decision — a front-wheel-steered bicycle model rather than an arcade rotation — shaped every level that followed.</p>`,
      },
      {
        heading: 'How the games are made',
        body: `<p>Every game on this site is an original implementation. The level layouts, vehicle physics, artwork, interface and written content are produced in-house. Artwork is generated procedurally at build time, which is why the site ships no stock photos or third-party screenshots.</p>
<p>Levels are defined as data, not hard-coded scenes. A build-time validator checks every bay for reachability, every obstacle for overlap and every sliding puzzle for solvability. If a level cannot be completed, it does not ship.</p>`,
      },
      {
        heading: 'What we do not do',
        body: `<ul>
<li>We do not reupload, mirror or embed other developers’ games.</li>
<li>We do not claim an affiliation with any similarly named title, including the 2016 browser game <em>Parking Fury</em>.</li>
<li>We do not invent player counts, review scores or download numbers.</li>
<li>We do not use fake download buttons or install prompts.</li>
<li>We do not run third-party advertising trackers inside the games.</li>
</ul>`,
      },
      {
        heading: 'How to reach us',
        body: `<p>Bug reports and corrections are genuinely useful. Email <a href="mailto:${SITE.email}">${SITE.email}</a> or use the <a href="/contact-us/">contact page</a>. We read everything, though we cannot promise a reply to every message.</p>`,
      },
    ],
    faq: [
      {
        q: 'Who makes the games on GamesPlayLand?',
        a: 'GamesPlayLand Studio, an independent team. All seven launch games are original works built and tested in-house.',
      },
      {
        q: 'Are the games connected to other games with the same names?',
        a: 'No. Our games are original. Any similarity in name to another title is coincidental, and we state clearly that we are not affiliated with those games.',
      },
      {
        q: 'Can I suggest a game?',
        a: 'Yes. Use the contact page. We cannot promise to build it, but suggestions help us decide what to work on next.',
      },
    ],
  },
  'contact-us': {
    name: 'Contact Us',
    title: 'Contact GamesPlayLand',
    description: 'Contact the GamesPlayLand team about a bug, a level correction, a game suggestion or a licensing question. One email address, read by the people who build the games.',
    h1: 'Contact GamesPlayLand',
    kicker: 'Get in touch',
    intro: 'One email address, read by the people who build the games. No ticket system and no chatbot.',
    sections: [
      {
        heading: 'Email',
        body: `<p><a href="mailto:${SITE.email}">${SITE.email}</a></p>
<p>We aim to reply within three working days. Bug reports with your browser, device and the level number are much easier to act on.</p>`,
      },
      {
        heading: 'What to include in a bug report',
        body: `<ul>
<li>The game and level number (for example, Parking Fury level 7).</li>
<li>What you expected to happen and what happened instead.</li>
<li>Your browser and device, including whether you were using touch or a keyboard.</li>
<li>A screenshot if the problem is visual.</li>
</ul>`,
      },
      {
        heading: 'Corrections and permissions',
        body: `<p>If you believe content on this site is inaccurate, or if you have a rights concern, email us with the URL and a short explanation. Rights enquiries are treated as a priority.</p>
<p>We do not accept guest posts, paid link insertions or sponsored game listings.</p>`,
      },
      {
        heading: 'What we cannot help with',
        body: `<p>We cannot provide support for games made by other developers, even if they share a name with ours. We also cannot recover local progress if you clear your browser data.</p>`,
      },
    ],
    faq: [
      {
        q: 'How quickly do you reply?',
        a: 'Usually within three working days. Rights and security reports are prioritised.',
      },
      {
        q: 'Do you accept game submissions?',
        a: 'No. We build our own games and do not embed third-party titles.',
      },
      {
        q: 'Can I use your screenshots or artwork?',
        a: 'The artwork is original and copyrighted. Email us before reusing it so we can confirm what is permitted.',
      },
    ],
  },
  'privacy-policy': {
    name: 'Privacy Policy',
    title: 'Privacy Policy – GamesPlayLand',
    description: 'A plain-language privacy policy for GamesPlayLand: what is stored in your browser, what is not collected, and how to remove local game data.',
    h1: 'Privacy Policy',
    kicker: 'Last updated 13 November 2026',
    intro: 'This policy is short because the site collects very little. There are no accounts, no advertising trackers and no third-party analytics inside the games.',
    sections: [
      {
        heading: 'What we store',
        body: `<p>The games save your best stars and times in your browser’s local storage. This data stays on your device and is not transmitted to us. It is keyed to the game’s slug and contains only level indices, star counts and times.</p>
<p>Our web server may record standard request logs (IP address, user agent, requested URL, timestamp) for security and capacity planning. These logs are not used to build profiles and are retained only as long as needed for those purposes.</p>`,
      },
      {
        heading: 'What we do not collect',
        body: `<ul>
<li>No names, email addresses or account details, because there are no accounts.</li>
<li>No advertising identifiers or cross-site tracking cookies.</li>
<li>No third-party analytics scripts inside the games.</li>
<li>No precise location data.</li>
<li>No payment information, because nothing is sold.</li>
</ul>`,
      },
      {
        heading: 'Cookies and local storage',
        body: `<p>We do not set advertising cookies. The site may use local storage for game progress and for interface preferences such as sound or reduced motion. You can clear this at any time through your browser’s site data settings; doing so removes your saved stars.</p>`,
      },
      {
        heading: 'Children',
        body: `<p>The games are suitable for a general audience and do not collect personal information from anyone, including children. There is no chat, no user-generated content and no social feature.</p>`,
      },
      {
        heading: 'Your choices and contact',
        body: `<p>Because we do not hold personal data about players, there is usually nothing to access, correct or delete on our side. If you have a privacy question, email <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
<p>If we add a feature that changes this policy, we will update the date at the top of the page before the feature goes live.</p>`,
      },
    ],
    faq: [
      {
        q: 'Do you use cookies to track me?',
        a: 'No advertising or cross-site tracking cookies are used. Local storage is used only to remember game progress and interface preferences.',
      },
      {
        q: 'Is my progress sent to a server?',
        a: 'No. Stars and times stay in your browser’s local storage on your device.',
      },
      {
        q: 'How do I delete my saved progress?',
        a: 'Clear site data for gamesplayland.com in your browser settings. That removes all locally stored game progress.',
      },
    ],
  },
  'terms-of-use': {
    name: 'Terms of Use',
    title: 'Terms of Use – GamesPlayLand',
    description: 'The terms for using GamesPlayLand: personal play licence, acceptable use, intellectual property, availability and liability.',
    h1: 'Terms of Use',
    kicker: 'Last updated 13 November 2026',
    intro: 'These terms cover your use of GamesPlayLand. They are written to be readable, but they are still a legal agreement.',
    sections: [
      {
        heading: 'Using the site',
        body: `<p>You may play the games for personal, non-commercial entertainment. You may link to any page. You may not copy, redistribute, frame or resell the games, their artwork or their code without written permission.</p>`,
      },
      {
        heading: 'Acceptable use',
        body: `<ul>
<li>Do not attempt to disrupt the site or other players’ access.</li>
<li>Do not scrape the site at a rate that affects availability.</li>
<li>Do not remove or obscure copyright notices.</li>
<li>Do not present the games as your own work.</li>
<li>Do not use the site for unlawful purposes.</li>
</ul>`,
      },
      {
        heading: 'Intellectual property',
        body: `<p>All games, level layouts, artwork, text and code on this site are owned by GamesPlayLand unless stated otherwise. The names of our games are our marks. Other product and game names mentioned on the site belong to their respective owners and are used only for identification.</p>
<p>Our games are original and are not affiliated with, endorsed by or connected to any other game, developer or publisher with a similar name.</p>`,
      },
      {
        heading: 'Availability and changes',
        body: `<p>The site is provided free of charge. We may change, suspend or remove games or pages at any time, and we do not guarantee uninterrupted availability. Saved progress is stored in your browser and may be lost if you clear site data or change device.</p>`,
      },
      {
        heading: 'Liability',
        body: `<p>The games are provided “as is”, without warranties of any kind. To the extent permitted by law, GamesPlayLand is not liable for indirect or consequential loss arising from use of the site. Nothing in these terms limits liability that cannot legally be limited.</p>`,
      },
      {
        heading: 'Contact',
        body: `<p>Questions about these terms: <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>`,
      },
    ],
    faq: [
      {
        q: 'Can I embed your games on my site?',
        a: 'Not without written permission. The games and their code are copyrighted, and we do not offer an embed programme.',
      },
      {
        q: 'Can I use a screenshot in a review?',
        a: 'A short review with one or two screenshots is usually fine. Email us first if you are unsure, and always link back to the game page.',
      },
      {
        q: 'Are the games guaranteed to stay online?',
        a: 'No. The site is free and we may change it over time. We aim to keep every published game available, but we cannot guarantee it.',
      },
    ],
  },
};

export function trustPage(slug) {
  const page = TRUST[slug];
  if (!page) throw new Error(`Unknown trust page: ${slug}`);
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: page.name, href: `/${slug}/` },
  ];
  const body = `${breadcrumbs(crumbs)}
<section class="page-head">
  <div class="container container--narrow" style="margin-left:0;">
    <p class="eyebrow">${esc(page.kicker)}</p>
    <h1>${esc(page.h1)}</h1>
    <p class="lead">${esc(page.intro)}</p>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="article-layout">
      <article class="prose">
        ${page.sections.map((s) => `<h2>${esc(s.heading)}</h2>${s.body}`).join('')}
      </article>
      <aside class="toc" aria-label="On this page">
        <h2>On this page</h2>
        <ol>${page.sections.map((s) => `<li><a href="#">${esc(s.heading)}</a></li>`).join('')}</ol>
      </aside>
    </div>
  </div>
</section>
${faqBlock(page.faq, 'Quick answers')}`;

  return layout({
    title: page.title,
    description: page.description,
    canonical: `/${slug}/`,
    jsonLd: [breadcrumbJsonLd(crumbs), faqJsonLd(page.faq)],
    children: body,
  });
}

/* ------------------------------------------------------------------ */
/* 404                                                                 */
/* ------------------------------------------------------------------ */

export function notFoundPage() {
  const body = `<section class="error-page">
  <div class="container">
    <p class="error-code">404</p>
    <h1>This bay is empty.</h1>
    <p>The page you were looking for does not exist, or it moved. Try the game collection or search instead.</p>
    <div class="hero-actions" style="justify-content:center;">
      <a class="btn" href="/">Back to home</a>
      <a class="btn btn--ghost" href="/search/">Search the site</a>
    </div>
    <div class="mt-4">
      <p class="eyebrow" style="justify-content:center;">Popular games</p>
      <div class="related-grid" style="text-align:left;">
        ${GAMES.slice(0, 3)
          .map(
            (game) => `<a class="related-card" href="/${game.slug}/">
          <img src="/assets/thumbs/${game.slug}.png" alt="" width="640" height="400" loading="lazy">
          <span><b>${esc(game.name)}</b><span>${esc(game.categoryLabel)}</span></span>
        </a>`,
          )
          .join('')}
      </div>
    </div>
  </div>
</section>`;

  return layout({
    title: 'Page Not Found',
    description: 'The page you were looking for could not be found. Browse the GamesPlayLand collection of original parking games, puzzle challenges and written guides instead.',
    canonical: '/404.html',
    noindex: true,
    children: body,
  });
}

export const PAGE_COUNT = {
  home: 1,
  games: GAMES.length,
  categories: CATEGORIES.length,
  guides: GUIDES.length,
  trust: Object.keys(TRUST).length,
  search: 1,
  notFound: 1,
};
