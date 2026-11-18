/**
 * Original artwork generation: game thumbnails, Open Graph banners, favicons.
 * Everything is drawn procedurally so the site ships no third-party imagery.
 */
import { Canvas } from './png.mjs';
import { glyph, GLYPH_W, GLYPH_H, measureText } from './font.mjs';

const BRAND = '#c6ff2e';

export const THEMES = {
  day: { bgTop: '#12202c', bgBottom: '#070b10', road: '#1b2733', roadEdge: '#26374a', accent: '#c6ff2e', secondary: '#39d0ff' },
  night: { bgTop: '#0c1424', bgBottom: '#05070d', road: '#141d2b', roadEdge: '#1e2c40', accent: '#c6ff2e', secondary: '#7b5cff' },
  garage: { bgTop: '#191d20', bgBottom: '#0a0c0e', road: '#20262a', roadEdge: '#2c343a', accent: '#c6ff2e', secondary: '#ffb02e' },
  puzzle: { bgTop: '#0f1a1c', bgBottom: '#060a0b', road: '#182325', roadEdge: '#233234', accent: '#c6ff2e', secondary: '#39d0ff' },
  sandbox: { bgTop: '#101b26', bgBottom: '#070a0f', road: '#1a2634', roadEdge: '#25364a', accent: '#c6ff2e', secondary: '#ff7a45' },
};

/* ------------------------------------------------------------------ */
/* Text helpers                                                        */
/* ------------------------------------------------------------------ */

export function drawText(c, text, x, y, scale, color, opts = {}) {
  const { tracking = 1, align = 'left', alpha = 1 } = opts;
  const str = String(text).toUpperCase();
  const w = measureText(str, scale, tracking);
  let cx = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  const col = color.startsWith('#')
    ? [parseInt(color.slice(1, 3), 16), parseInt(color.slice(3, 5), 16), parseInt(color.slice(5, 7), 16), Math.round(alpha * 255)]
    : color;
  for (const ch of str) {
    const rows = glyph(ch);
    for (let ry = 0; ry < GLYPH_H; ry++) {
      for (let rx = 0; rx < GLYPH_W; rx++) {
        if (rows[ry][rx] === '1') {
          c.rect(cx + rx * scale, y + ry * scale, scale, scale, col);
        }
      }
    }
    cx += GLYPH_W * scale + tracking * scale;
  }
  return w;
}

/** Fit text into a max width by reducing scale. */
function fitScale(text, maxWidth, preferred, min = 3, tracking = 1) {
  let s = preferred;
  while (s > min && measureText(text, s, tracking) > maxWidth) s -= 1;
  return s;
}

/* ------------------------------------------------------------------ */
/* Vehicles                                                            */
/* ------------------------------------------------------------------ */

const BODY_COLORS = ['#e8edf4', '#8fa3b8', '#3d6ea8', '#b8483f', '#2f3b46', '#c9a227', '#5c8f6a'];

export function drawVehicle(c, cx, cy, L, W, type = 'car', color = '#e8edf4', opts = {}) {
  const { accent = null, lights = false } = opts;
  const shadow = 'rgba(0,0,0,0.45)';
  const glass = '#16202b';
  const tire = '#0b0f14';

  if (type === 'truck') {
    c.roundRect(cx - L / 2 + 4, cy - W / 2 + 8, L, W, W * 0.14, shadow);
    // trailer
    const trailerL = L * 0.68;
    const tx = cx + L / 2 - trailerL;
    c.roundRect(tx, cy - W / 2, trailerL, W, W * 0.1, '#c9d3de');
    c.rect(tx + 6, cy - W / 2 + 6, trailerL - 12, W - 12, '#e8eef5');
    for (let i = 1; i < 6; i++) {
      c.rect(tx + (trailerL / 6) * i, cy - W / 2 + 6, 3, W - 12, 'rgba(0,0,0,0.08)');
    }
    // cab
    const cabL = L * 0.3;
    const cabX = cx - L / 2;
    c.roundRect(cabX, cy - W / 2, cabL, W, W * 0.18, color);
    c.roundRect(cabX + cabL * 0.32, cy - W * 0.36, cabL * 0.44, W * 0.72, W * 0.12, glass);
    c.rect(cabX + cabL - 10, cy - W * 0.38, 8, W * 0.2, '#fff8c9');
    c.rect(cabX + cabL - 10, cy + W * 0.18, 8, W * 0.2, '#fff8c9');
    for (const wx of [cabX + cabL * 0.12, cabX + cabL * 0.72, tx + trailerL * 0.2, tx + trailerL * 0.55, tx + trailerL * 0.85]) {
      c.rect(wx, cy - W / 2 - 3, L * 0.1, 7, tire);
      c.rect(wx, cy + W / 2 - 4, L * 0.1, 7, tire);
    }
    if (accent) c.rect(cabX, cy + W / 2 - 10, cabL, 8, accent);
    return;
  }

  if (type === 'bus') {
    c.roundRect(cx - L / 2 + 4, cy - W / 2 + 8, L, W, W * 0.18, shadow);
    c.roundRect(cx - L / 2, cy - W / 2, L, W, W * 0.2, color);
    c.roundRect(cx - L / 2 + 12, cy - W * 0.32, L - 24, W * 0.64, W * 0.1, glass);
    for (let i = 1; i < 7; i++) {
      c.rect(cx - L / 2 + 12 + ((L - 24) / 7) * i, cy - W * 0.32, 4, W * 0.64, 'rgba(255,255,255,0.16)');
    }
    c.rect(cx + L / 2 - 14, cy - W * 0.36, 9, W * 0.24, '#fff8c9');
    c.rect(cx + L / 2 - 14, cy + W * 0.12, 9, W * 0.24, '#fff8c9');
    c.rect(cx - L / 2 + L * 0.32, cy - W / 2 - 3, L * 0.12, 7, tire);
    c.rect(cx - L / 2 + L * 0.32, cy + W / 2 - 4, L * 0.12, 7, tire);
    c.rect(cx + L / 2 - L * 0.26, cy - W / 2 - 3, L * 0.12, 7, tire);
    c.rect(cx + L / 2 - L * 0.26, cy + W / 2 - 4, L * 0.12, 7, tire);
    if (accent) c.rect(cx - L / 2, cy + W / 2 - 9, L, 7, accent);
    return;
  }

  // car / suv
  const body = type === 'suv' ? color : color;
  c.roundRect(cx - L / 2 + 4, cy - W / 2 + 9, L, W, W * 0.3, shadow);
  c.roundRect(cx - L / 2, cy - W / 2, L, W, W * 0.3, body);
  // body shading
  c.roundRect(cx - L / 2 + 3, cy + W * 0.16, L - 6, W * 0.28, W * 0.14, 'rgba(0,0,0,0.16)');
  // greenhouse
  c.roundRect(cx - L * 0.2, cy - W * 0.36, L * 0.44, W * 0.72, W * 0.18, glass);
  c.roundRect(cx - L * 0.14, cy - W * 0.3, L * 0.16, W * 0.6, W * 0.1, 'rgba(140,200,255,0.22)');
  c.rect(cx - L * 0.02, cy - W * 0.34, 3, W * 0.68, 'rgba(255,255,255,0.14)');
  // wheels
  c.rect(cx - L * 0.33, cy - W / 2 - 3, L * 0.17, 8, tire);
  c.rect(cx - L * 0.33, cy + W / 2 - 5, L * 0.17, 8, tire);
  c.rect(cx + L * 0.18, cy - W / 2 - 3, L * 0.17, 8, tire);
  c.rect(cx + L * 0.18, cy + W / 2 - 5, L * 0.17, 8, tire);
  // lamps
  c.rect(cx + L / 2 - 9, cy - W * 0.4, 7, W * 0.22, '#fff6c2');
  c.rect(cx + L / 2 - 9, cy + W * 0.18, 7, W * 0.22, '#fff6c2');
  c.rect(cx - L / 2 + 2, cy - W * 0.4, 5, W * 0.22, '#ff5b4d');
  c.rect(cx - L / 2 + 2, cy + W * 0.18, 5, W * 0.22, '#ff5b4d');
  if (accent) {
    c.rect(cx - L * 0.34, cy - W * 0.47, L * 0.68, 5, accent);
    c.rect(cx - L * 0.34, cy + W * 0.42, L * 0.68, 5, accent);
  }
  if (lights) {
    c.glow(cx + L / 2 + 60, cy, 150, '#fff3b0', 0.35);
  }
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

function drawScene(c, w, h, theme, motif) {
  const t = THEMES[theme] || THEMES.day;

  c.vgrad(0, 0, w, h, [
    [0, t.bgTop],
    [1, t.bgBottom],
  ]);

  // ambient glows
  c.glow(w * 0.78, h * 0.12, w * 0.5, t.accent, 0.1);
  c.glow(w * 0.12, h * 0.9, w * 0.45, t.secondary, 0.1);

  // fine grid
  const step = Math.round(h / 16);
  for (let x = 0; x < w; x += step) c.rect(x, 0, 1, h, 'rgba(255,255,255,0.022)');
  for (let y = 0; y < h; y += step) c.rect(0, y, w, 1, 'rgba(255,255,255,0.022)');

  const horizon = h * 0.42;
  // ground plane
  c.poly(
    [
      [w * 0.36, horizon],
      [w * 0.64, horizon],
      [w * 1.25, h * 1.05],
      [-w * 0.25, h * 1.05],
    ],
    t.road,
  );
  // ground edge lines
  c.line(w * 0.36, horizon, -w * 0.25, h * 1.05, 3, 'rgba(255,255,255,0.06)');
  c.line(w * 0.64, horizon, w * 1.25, h * 1.05, 3, 'rgba(255,255,255,0.06)');

  // perspective lane dashes
  for (let i = 1; i <= 5; i++) {
    const p = i / 6;
    const y = horizon + (h - horizon) * Math.pow(p, 1.9);
    const halfW = (w * 0.14) + (w * 0.75 - w * 0.14) * Math.pow(p, 1.9);
    const cx = w * 0.5;
    c.rect(cx - 4, y, 8, Math.max(6, 26 * p), 'rgba(255,255,255,0.09)');
    c.rect(cx - halfW, y, halfW * 2, 2, 'rgba(255,255,255,0.04)');
  }

  // parking bays in perspective (bottom left)
  for (let b = 0; b < 3; b++) {
    const bx = w * (0.02 + b * 0.12);
    const bw = w * 0.1;
    const topY = h * 0.62 + b * h * 0.012;
    const pts = [
      [bx, topY + h * 0.02],
      [bx + bw, topY],
      [bx + bw * 1.22, h * 1.02],
      [bx - bw * 0.22, h * 1.02],
    ];
    if (b === 1) c.poly(pts, 'rgba(198,255,46,0.12)');
    for (let i = 0; i < 4; i++) {
      const a = pts[i];
      const bb = pts[(i + 1) % 4];
      c.line(a[0], a[1], bb[0], bb[1], b === 1 ? 4 : 2, b === 1 ? 'rgba(198,255,46,0.75)' : 'rgba(255,255,255,0.14)');
    }
  }

  if (motif === 'garage') {
    // concrete pillars
    for (const px of [0.08, 0.5, 0.92]) {
      c.rect(w * px - w * 0.035, h * 0.06, w * 0.07, h * 0.5, 'rgba(255,255,255,0.05)');
      c.rect(w * px - w * 0.035, h * 0.06, w * 0.07, 6, 'rgba(255,255,255,0.09)');
      c.rect(w * px - w * 0.045, h * 0.52, w * 0.09, 10, 'rgba(255,255,255,0.08)');
    }
    for (let i = 0; i < 4; i++) c.rect(0, h * (0.12 + i * 0.11), w, 3, 'rgba(255,255,255,0.03)');
  }

  if (motif === 'jam') {
    // grid of parked cars seen from above
    for (let r = 0; r < 2; r++) {
      for (let col = 0; col < 4; col++) {
        const bx = w * (0.06 + col * 0.115);
        const by = h * (0.06 + r * 0.15);
        drawVehicle(c, bx, by, w * 0.1, h * 0.055, 'car', BODY_COLORS[(r * 4 + col) % BODY_COLORS.length]);
      }
    }
  }
}

/* ------------------------------------------------------------------ */
/* Thumbnail                                                           */
/* ------------------------------------------------------------------ */

export function renderThumb(game) {
  const W = 1280;
  const H = 800;
  const c = new Canvas(W, H, null);
  const t = THEMES[game.theme] || THEMES.day;
  drawScene(c, W, H, game.theme, game.motif);

  // hero vehicle
  const L = game.motif === 'bus' ? W * 0.52 : game.motif === 'truck' ? W * 0.5 : W * 0.44;
  const VW = game.motif === 'bus' ? L * 0.22 : game.motif === 'truck' ? L * 0.28 : L * 0.42;
  drawVehicle(c, W * 0.62, H * 0.5, L, VW, game.motif === 'bus' ? 'bus' : game.motif === 'truck' ? 'truck' : 'car', '#dfe7ef', {
    accent: t.accent,
    lights: game.theme === 'night',
  });

  // bottom scrim
  c.vgrad(0, H * 0.52, W, H * 0.48, [
    [0, 'rgba(4,7,11,0)'],
    [1, 'rgba(4,7,11,0.92)'],
  ]);

  // brand mark
  c.roundRect(W * 0.055, H * 0.075, 14, 14, 3, t.accent);
  drawText(c, 'GAMESPLAYLAND', W * 0.055 + 26, H * 0.075 - 4, 3, 'rgba(255,255,255,0.55)', { tracking: 2 });

  // category kicker
  const kicker = (game.kicker || 'PARKING GAME').toUpperCase();
  drawText(c, kicker, W * 0.058, H * 0.735, 3, t.accent, { tracking: 3 });

  // title (wrap up to 2 lines)
  const words = String(game.title).toUpperCase().split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (measureText(test, 8, 1) > W * 0.86 && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  const scale = lines.length > 1 ? 7 : 8;
  let ty = H * 0.775;
  for (const l of lines.slice(0, 2)) {
    const s = fitScale(l, W * 0.88, scale, 5, 1);
    drawText(c, l, W * 0.055, ty, s, '#ffffff', { tracking: 1 });
    ty += s * 10;
  }

  // accent rule
  c.rect(W * 0.055, H * 0.955, W * 0.12, 6, t.accent);

  return c.downsample(2);
}

/* ------------------------------------------------------------------ */
/* OG banner                                                           */
/* ------------------------------------------------------------------ */

export function renderBanner({ title, kicker, subtitle, theme = 'day', motif = 'car' }) {
  const W = 2400;
  const H = 1260;
  const c = new Canvas(W, H, null);
  const t = THEMES[theme] || THEMES.day;
  drawScene(c, W, H, theme, motif);

  // left panel scrim
  c.vgrad(0, 0, W * 0.72, H, [
    [0, 'rgba(4,7,11,0.94)'],
    [1, 'rgba(4,7,11,0.72)'],
  ]);

  const L = motif === 'bus' ? W * 0.4 : motif === 'truck' ? W * 0.38 : W * 0.34;
  const VW = motif === 'bus' ? L * 0.22 : motif === 'truck' ? L * 0.28 : L * 0.42;
  drawVehicle(c, W * 0.7, H * 0.5, L, VW, motif === 'bus' ? 'bus' : motif === 'truck' ? 'truck' : 'car', '#dfe7ef', {
    accent: t.accent,
    lights: theme === 'night',
  });

  c.roundRect(W * 0.06, H * 0.11, 22, 22, 5, t.accent);
  drawText(c, 'GAMESPLAYLAND', W * 0.06 + 40, H * 0.105, 5, 'rgba(255,255,255,0.6)', { tracking: 3 });

  if (kicker) drawText(c, kicker.toUpperCase(), W * 0.06, H * 0.33, 5, t.accent, { tracking: 4 });

  const words = String(title).toUpperCase().split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (measureText(test, 12, 1) > W * 0.56 && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  let ty = H * 0.4;
  for (const l of lines.slice(0, 3)) {
    const s = fitScale(l, W * 0.58, 12, 6, 1);
    drawText(c, l, W * 0.06, ty, s, '#ffffff', { tracking: 1 });
    ty += s * 10;
  }

  if (subtitle) {
    drawText(c, subtitle.toUpperCase(), W * 0.06, H * 0.86, 4, 'rgba(255,255,255,0.62)', { tracking: 2 });
  }
  c.rect(W * 0.06, H * 0.93, W * 0.1, 8, t.accent);

  return c.downsample(2);
}

/* ------------------------------------------------------------------ */
/* Favicon + app icons                                                 */
/* ------------------------------------------------------------------ */

export function renderIcon(size = 512) {
  const S = size * 2;
  const c = new Canvas(S, S, null);
  c.roundRect(0, 0, S, S, S * 0.22, BRAND);
  // speed stripes
  c.poly(
    [
      [S * 0.1, S * 0.72],
      [S * 0.38, S * 0.72],
      [S * 0.52, S * 0.28],
      [S * 0.24, S * 0.28],
    ],
    'rgba(10,14,20,0.18)',
  );
  // bold P
  drawText(c, 'P', S * 0.3, S * 0.24, Math.round(S / 7), '#0a0e14', { tracking: 0 });
  return c.downsample(2);
}

export const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#c6ff2e"/>
  <path d="M22 46V18h13a10 10 0 0 1 0 20h-7v8z" fill="#0a0e14"/>
  <path d="M28 24h6a4 4 0 0 1 0 8h-6z" fill="#c6ff2e"/>
</svg>`;
