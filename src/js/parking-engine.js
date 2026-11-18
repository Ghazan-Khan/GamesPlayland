/**
 * GamesPlayLand parking engine.
 * Top-down bicycle-model driving with SAT collision, parking detection,
 * damage, par times and touch/keyboard input. No dependencies.
 */
import { obb, obbFromRect, pointInOBB, angleDiff, clamp, lerp } from './geometry.js';

const DEG = Math.PI / 180;
const TAU = Math.PI * 2;

const THEME = {
  day: {
    ground: '#1d2833',
    groundAlt: '#22303d',
    edge: '#2c3c4c',
    line: 'rgba(255,255,255,0.20)',
    wall: '#38434f',
    wallTop: '#4b5a69',
    pillar: '#4a5158',
    fog: null,
    accent: '#c6ff2e',
  },
  night: {
    ground: '#131b27',
    groundAlt: '#16202e',
    edge: '#1f2c3e',
    line: 'rgba(190,215,255,0.16)',
    wall: '#232e3d',
    wallTop: '#314054',
    pillar: '#333d4a',
    fog: 'rgba(4,7,12,0.52)',
    accent: '#c6ff2e',
  },
  garage: {
    ground: '#1f2327',
    groundAlt: '#23282d',
    edge: '#2c3339',
    line: 'rgba(255,255,255,0.15)',
    wall: '#363c42',
    wallTop: '#4a525a',
    pillar: '#454c53',
    fog: 'rgba(3,5,8,0.28)',
    accent: '#c6ff2e',
  },
  sandbox: {
    ground: '#1a2634',
    groundAlt: '#1e2d3d',
    edge: '#26384b',
    line: 'rgba(255,255,255,0.16)',
    wall: '#33424f',
    wallTop: '#465868',
    pillar: '#3c4a58',
    fog: null,
    accent: '#c6ff2e',
  },
};

const PARKED_COLORS = ['#8fa3b8', '#3d6ea8', '#b8483f', '#2f3b46', '#c9a227', '#5c8f6a', '#d9e2ec'];

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function corners(o) {
  const pts = [];
  for (const [sx, sy] of [
    [1, 1],
    [1, -1],
    [-1, -1],
    [-1, 1],
  ]) {
    const lx = sx * o.hx;
    const ly = sy * o.hy;
    pts.push([o.cx + lx * o.cos - ly * o.sin, o.cy + lx * o.sin + ly * o.cos]);
  }
  return pts;
}

function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage may be disabled */
  }
}

export function initParkingGame({ data, stage, canvas }) {
  const ctx = canvas.getContext('2d');
  const isSandbox = data.mode === 'sandbox';
  const theme = THEME[data.theme] || THEME.day;
  const levels = data.levels;
  const storeKey = `gpl:stars:${data.slug}`;
  const bestKey = `gpl:best:${data.slug}`;

  const hudLevel = stage.querySelector('#hud-level');
  const hudTime = stage.querySelector('#hud-time');
  const hudDamage = stage.querySelector('#hud-damage');
  const levelStrip = document.getElementById('level-strip');

  let levelIndex = 0;
  let level = null;
  let spec = null;
  let car = null;
  let bayObb = null;
  let obstacles = [];
  let parked = [];
  let coneList = [];
  let bounds = null;
  let camera = { scale: 1, cx: 0, cy: 0 };
  let damage = 0;
  let time = 0;
  let lastDamage = -10;
  let shake = 0;
  let flash = 0;
  let running = false;
  let paused = false;
  let finished = false;
  let raf = 0;
  let lastFrame = 0;
  let lastHud = 0;
  let overlay = null;
  let stars = readStore(storeKey, {});
  let bests = readStore(bestKey, {});
  let viewW = 0;
  let viewH = 0;

  const keys = { up: false, down: false, left: false, right: false, brake: false };
  const touch = { accelerate: false, brake: false, left: false, right: false, handbrake: false };

  const isTouch =
    window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
  if (isTouch) stage.classList.add('touch-device');

  /* ---------------------------------------------------------------- */
  /* Setup                                                            */
  /* ---------------------------------------------------------------- */

  function buildLevel(index) {
    levelIndex = clamp(index, 0, levels.length - 1);
    level = levels[levelIndex];
    spec = data.vehicles[level.vehicle] || data.vehicles.sedan;
    car = {
      x: level.start.x,
      y: level.start.y,
      a: level.start.a * DEG,
      speed: 0,
      steer: 0,
    };
    bayObb = level.bay
      ? obb(level.bay.x, level.bay.y, level.bay.l / 2, level.bay.w / 2, level.bay.a * DEG)
      : null;

    obstacles = (level.walls || []).map((w) => ({ ...obbFromRect(w), kind: 'wall' }));
    for (const p of level.pillars || []) {
      obstacles.push({ ...obbFromRect(p), kind: 'pillar' });
    }
    parked = (level.cars || []).map((c) => {
      const s = data.vehicles[c.type] || data.vehicles.car;
      return {
        x: c.x,
        y: c.y,
        a: (c.a || 0) * DEG,
        L: s.length,
        W: s.width,
        color: c.color || PARKED_COLORS[0],
        type: c.type || 'car',
        obb: obb(c.x, c.y, s.length / 2, s.width / 2, (c.a || 0) * DEG),
      };
    });
    for (const p of parked) obstacles.push(p.obb);

    coneList = (level.cones || []).map((c) => ({ x: c.x, y: c.y, knocked: 0, rot: Math.random() * TAU }));

    damage = 0;
    time = 0;
    lastDamage = -10;
    shake = 0;
    flash = 0;
    paused = false;
    finished = false;
    running = true;

    bounds = computeBounds();
    removeOverlay();
    updateLevelStrip();
    updateHud(true);
  }

  function computeBounds() {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    const add = (x, y) => {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    };
    for (const o of obstacles) {
      const pts = corners(o);
      for (const [x, y] of pts) add(x, y);
    }
    if (bayObb) for (const [x, y] of corners(bayObb)) add(x, y);
    for (const c of coneList) add(c.x, c.y);
    add(car.x, car.y);
    if (!Number.isFinite(minX)) {
      minX = 0;
      minY = 0;
      maxX = 40;
      maxY = 30;
    }
    const pad = 3;
    return { minX: minX - pad, minY: minY - pad, maxX: maxX + pad, maxY: maxY + pad };
  }

  function resize() {
    const rect = stage.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    viewW = Math.max(1, rect.width);
    viewH = Math.max(1, rect.height);
    canvas.width = Math.round(viewW * dpr);
    canvas.height = Math.round(viewH * dpr);
    updateCamera();
  }

  function updateCamera() {
    if (!bounds) return;
    const bw = bounds.maxX - bounds.minX;
    const bh = bounds.maxY - bounds.minY;
    const scale = Math.min(viewW / bw, viewH / bh) * 0.98;
    camera = {
      scale,
      cx: (bounds.minX + bounds.maxX) / 2,
      cy: (bounds.minY + bounds.maxY) / 2,
    };
  }

  /* ---------------------------------------------------------------- */
  /* Input                                                            */
  /* ---------------------------------------------------------------- */

  function keyMap(e) {
    switch (e.key) {
      case 'w':
      case 'W':
      case 'ArrowUp':
        return 'up';
      case 's':
      case 'S':
      case 'ArrowDown':
        return 'down';
      case 'a':
      case 'A':
      case 'ArrowLeft':
        return 'left';
      case 'd':
      case 'D':
      case 'ArrowRight':
        return 'right';
      case ' ':
        return 'brake';
      default:
        return null;
    }
  }

  function onKeyDown(e) {
    const mapped = keyMap(e);
    if (mapped) {
      if (running && !paused && !finished) e.preventDefault();
      keys[mapped] = true;
      return;
    }
    if (e.key === 'r' || e.key === 'R') {
      if (!finished || isSandbox) restart();
      else restart();
    } else if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
      if (running && !finished) togglePause();
    } else if (e.key === 'f' || e.key === 'F') {
      toggleFullscreen();
    }
  }

  function onKeyUp(e) {
    const mapped = keyMap(e);
    if (mapped) keys[mapped] = false;
  }

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  for (const btn of stage.querySelectorAll('[data-control]')) {
    const control = btn.dataset.control;
    const on = (e) => {
      e.preventDefault();
      touch[control] = true;
      btn.classList.add('is-active');
      if (control === 'accelerate' || control === 'brake') {
        // keep the page from scrolling under a held pedal
        if (document.activeElement !== btn) btn.focus({ preventScroll: true });
      }
    };
    const off = (e) => {
      if (e) e.preventDefault();
      touch[control] = false;
      btn.classList.remove('is-active');
    };
    btn.addEventListener('pointerdown', on);
    btn.addEventListener('pointerup', off);
    btn.addEventListener('pointercancel', off);
    btn.addEventListener('pointerleave', off);
    btn.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  /* ---------------------------------------------------------------- */
  /* Gameplay                                                         */
  /* ---------------------------------------------------------------- */

  function restart() {
    if (!level) return;
    buildLevel(levelIndex);
    lastFrame = performance.now();
  }

  function respawn() {
    if (!level) return;
    car.x = level.start.x;
    car.y = level.start.y;
    car.a = level.start.a * DEG;
    car.speed = 0;
    car.steer = 0;
    damage = 0;
    time = 0;
    finished = false;
    running = true;
    removeOverlay();
    updateHud(true);
  }

  function togglePause() {
    if (!running || finished) return;
    paused = !paused;
    if (paused) showPause();
    else removeOverlay();
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      if (stage.requestFullscreen) stage.requestFullscreen().catch(() => {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }

  function addDamage(amount = 15) {
    if (isSandbox) return;
    const now = performance.now() / 1000;
    if (now - lastDamage < 0.65) return;
    lastDamage = now;
    damage = Math.min(100, damage + amount);
    shake = 1;
    flash = 0.55;
    if (damage >= 100) fail();
  }

  function update(dt) {
    if (!running || paused || finished) return;
    time += dt;

    const throttle =
      (keys.up || touch.accelerate ? 1 : 0) - (keys.down || touch.brake ? 1 : 0);
    const steerInput =
      (keys.right || touch.right ? 1 : 0) - (keys.left || touch.left ? 1 : 0);
    const handbrake = keys.brake || touch.handbrake;

    const targetSteer = steerInput * spec.maxSteer;
    car.steer = lerp(car.steer, targetSteer, 1 - Math.exp(-9 * dt));

    if (throttle > 0) {
      car.speed += spec.accel * dt;
    } else if (throttle < 0) {
      if (car.speed > 0.2) car.speed -= spec.brake * dt;
      else car.speed -= spec.accel * 0.65 * dt;
    } else {
      car.speed -= Math.sign(car.speed) * Math.min(Math.abs(car.speed), 2.6 * dt);
    }
    if (handbrake) {
      car.speed -= Math.sign(car.speed) * Math.min(Math.abs(car.speed), 11 * dt);
    }

    car.speed = clamp(car.speed, -spec.reverseSpeed, spec.maxSpeed);
    if (Math.abs(car.speed) < 0.015) car.speed = 0;

    const oldX = car.x;
    const oldY = car.y;
    const oldA = car.a;

    car.a += (car.speed / spec.wheelbase) * Math.tan(car.steer) * dt;
    car.x += Math.cos(car.a) * car.speed * dt;
    car.y += Math.sin(car.a) * car.speed * dt;

    const body = obb(car.x, car.y, spec.length / 2, spec.width / 2, car.a);
    let hit = false;
    for (const o of obstacles) {
      if (Math.abs(o.cx - car.x) > 14 || Math.abs(o.cy - car.y) > 14) continue;
      // quick circle reject before SAT
      const dx = o.cx - car.x;
      const dy = o.cy - car.y;
      const reach = spec.length / 2 + Math.hypot(o.hx, o.hy) + 1;
      if (dx * dx + dy * dy > reach * reach) continue;
      if (overlap(body, o)) {
        hit = true;
        break;
      }
    }

    if (hit) {
      car.x = oldX;
      car.y = oldY;
      car.a = oldA;
      const wasMoving = Math.abs(car.speed);
      car.speed = -car.speed * 0.28;
      if (wasMoving > 0.55) addDamage(15);
    }

    // cones are soft props: knock them over, no damage
    for (const cone of coneList) {
      if (cone.knocked) continue;
      if (Math.abs(cone.x - car.x) < 5 && Math.abs(cone.y - car.y) < 5) {
        if (pointInOBB(cone.x, cone.y, body, -0.15)) {
          cone.knocked = 1;
          cone.rot = car.a + Math.PI / 2;
          car.speed *= 0.92;
        }
      }
    }

    if (bayObb && !finished) {
      const stopped = Math.abs(car.speed) < 0.25;
      if (stopped) {
        const pts = corners(body);
        const inside = pts.every(([x, y]) => pointInOBB(x, y, bayObb, -0.06));
        const diff = Math.abs(angleDiff(car.a, bayObb.angle));
        const aligned = diff < 0.11 || Math.abs(Math.PI - diff) < 0.11;
        if (inside && aligned) win();
      }
    }

    shake = Math.max(0, shake - dt * 2.4);
    flash = Math.max(0, flash - dt * 1.8);
  }

  function overlap(a, b) {
    // SAT, inlined to avoid allocating arrays every frame
    for (const o of [a, b]) {
      const axes = [
        [o.cos, o.sin],
        [-o.sin, o.cos],
      ];
      for (const [ax, ay] of axes) {
        const ac = a.cos * ax + a.sin * ay;
        const as = -a.sin * ax + a.cos * ay;
        const ar = a.hx * Math.abs(ac) + a.hy * Math.abs(as);
        const ap = a.cx * ax + a.cy * ay;
        const bc = b.cos * ax + b.sin * ay;
        const bs = -b.sin * ax + b.cos * ay;
        const br = b.hx * Math.abs(bc) + b.hy * Math.abs(bs);
        const bp = b.cx * ax + b.cy * ay;
        if (ap + ar < bp - br || bp + br < ap - ar) return false;
      }
    }
    return true;
  }

  function starCount() {
    if (damage === 0 && time <= level.par) return 3;
    if (damage <= 30) return 2;
    return 1;
  }

  function win() {
    finished = true;
    running = false;
    car.speed = 0;
    const starsEarned = starCount();
    const prev = stars[levelIndex] || 0;
    if (starsEarned > prev) {
      stars[levelIndex] = starsEarned;
      writeStore(storeKey, stars);
    }
    const best = bests[levelIndex];
    if (best == null || time < best) {
      bests[levelIndex] = time;
      writeStore(bestKey, bests);
    }
    updateLevelStrip();
    showWin(starsEarned);
  }

  function fail() {
    finished = true;
    running = false;
    showFail();
  }

  /* ---------------------------------------------------------------- */
  /* Overlays                                                         */
  /* ---------------------------------------------------------------- */

  function removeOverlay() {
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
  }

  function makeOverlay(html, className = '') {
    removeOverlay();
    overlay = document.createElement('div');
    overlay.className = `game-overlay ${className}`.trim();
    overlay.innerHTML = `<div class="overlay-card">${html}</div>`;
    stage.appendChild(overlay);
    return overlay;
  }

  function showWin(earned) {
    const nextIndex = levelIndex + 1;
    const hasNext = nextIndex < levels.length;
    const starRow = [1, 2, 3]
      .map((n) => `<span class="${n <= earned ? 'is-on' : ''}">★</span>`)
      .join('');
    const title =
      earned === 3 ? 'Clean park.' : earned === 2 ? 'Parked, with a scratch.' : 'It counts. Barely.';
    const el = makeOverlay(`
      <p class="overlay-kicker">${level.name} complete</p>
      <div class="overlay-stars" aria-label="${earned} out of 3 stars">${starRow}</div>
      <h2>${title}</h2>
      <p class="overlay-sub">Time ${formatTime(time)} · Par ${formatTime(level.par)} · Damage ${damage}%</p>
      <div class="overlay-actions">
        ${hasNext ? '<button class="btn btn--sm" type="button" data-next>Next level</button>' : ''}
        <button class="btn btn--ghost btn--sm" type="button" data-retry>Retry</button>
        <a class="btn btn--ghost btn--sm" href="/${data.slug}/">Back to game page</a>
      </div>
    `);
    el.querySelector('[data-retry]').addEventListener('click', restart);
    const next = el.querySelector('[data-next]');
    if (next) next.addEventListener('click', () => buildLevel(nextIndex));
    el.querySelector('[data-next]')?.focus({ preventScroll: true });
  }

  function showFail() {
    const el = makeOverlay(`
      <p class="overlay-kicker">Run ended</p>
      <div class="overlay-stars overlay-stars--fail" aria-hidden="true"><span>★</span><span>★</span><span>★</span></div>
      <h2>Too much damage.</h2>
      <p class="overlay-sub">The damage bar reached 100%. Every impact costs 15%. Seven knocks ends a run.</p>
      <div class="overlay-actions">
        <button class="btn btn--sm" type="button" data-retry>Try again</button>
        <a class="btn btn--ghost btn--sm" href="/parking-fury-tips/">Read the tips</a>
      </div>
    `, 'game-overlay--fail');
    el.querySelector('[data-retry]').addEventListener('click', restart);
    el.querySelector('[data-retry]').focus({ preventScroll: true });
  }

  function showPause() {
    const el = makeOverlay(`
      <p class="overlay-kicker">Paused</p>
      <h2>Take a breath.</h2>
      <p class="overlay-sub">Level ${levelIndex + 1} · ${level.name}</p>
      <div class="overlay-actions">
        <button class="btn btn--sm" type="button" data-resume>Resume</button>
        <button class="btn btn--ghost btn--sm" type="button" data-retry>Restart</button>
      </div>
    `);
    el.querySelector('[data-resume]').addEventListener('click', togglePause);
    el.querySelector('[data-retry]').addEventListener('click', restart);
    el.querySelector('[data-resume]').focus({ preventScroll: true });
  }

  /* ---------------------------------------------------------------- */
  /* HUD + level strip                                                */
  /* ---------------------------------------------------------------- */

  function updateHud(force = false) {
    if (!force && performance.now() - lastHud < 80) return;
    lastHud = performance.now();
    if (hudLevel) hudLevel.textContent = isSandbox ? '∞' : String(levelIndex + 1);
    if (hudTime) hudTime.textContent = formatTime(time);
    if (hudDamage) {
      hudDamage.style.width = `${damage}%`;
      hudDamage.classList.toggle('is-warn', damage >= 45 && damage < 75);
      hudDamage.classList.toggle('is-danger', damage >= 75);
    }
  }

  function updateLevelStrip() {
    if (!levelStrip) return;
    for (const btn of levelStrip.querySelectorAll('[data-level]')) {
      const i = Number(btn.dataset.level);
      const active = i === levelIndex;
      btn.setAttribute('aria-current', active ? 'true' : 'false');
      const starEl = btn.querySelector('[data-stars]');
      if (starEl) {
        const earned = stars[i] || 0;
        starEl.textContent = '★★★';
        starEl.classList.toggle('stars--empty', earned === 0);
        starEl.style.opacity = earned === 0 ? '' : String(0.35 + earned * 0.216);
      }
    }
  }

  if (levelStrip) {
    levelStrip.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-level]');
      if (!btn) return;
      buildLevel(Number(btn.dataset.level));
      lastFrame = performance.now();
    });
  }

  for (const btn of stage.querySelectorAll('[data-action]')) {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'pause') togglePause();
      else if (action === 'restart') (isSandbox ? respawn() : restart());
      else if (action === 'fullscreen') toggleFullscreen();
    });
  }

  /* ---------------------------------------------------------------- */
  /* Rendering                                                        */
  /* ---------------------------------------------------------------- */

  function drawGround() {
    const b = bounds;
    ctx.fillStyle = theme.ground;
    ctx.fillRect(b.minX, b.minY, b.maxX - b.minX, b.maxY - b.minY);

    // subtle asphalt bands
    ctx.fillStyle = theme.groundAlt;
    const step = 4;
    for (let y = Math.ceil(b.minY / step) * step; y < b.maxY; y += step) {
      if (Math.round(y / step) % 2 === 0) {
        ctx.globalAlpha = 0.35;
        ctx.fillRect(b.minX, y, b.maxX - b.minX, step * 0.5);
      }
    }
    ctx.globalAlpha = 1;

    // grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 0.08;
    ctx.beginPath();
    for (let x = Math.ceil(b.minX / 4) * 4; x < b.maxX; x += 4) {
      ctx.moveTo(x, b.minY);
      ctx.lineTo(x, b.maxY);
    }
    for (let y = Math.ceil(b.minY / 4) * 4; y < b.maxY; y += 4) {
      ctx.moveTo(b.minX, y);
      ctx.lineTo(b.maxX, y);
    }
    ctx.stroke();

    // lane arrows on the ground for orientation
    ctx.strokeStyle = 'rgba(255,255,255,0.10)';
    ctx.lineWidth = 0.16;
    const ax = b.minX + (b.maxX - b.minX) * 0.5;
    const ay = b.minY + (b.maxY - b.minY) * 0.5;
    ctx.beginPath();
    ctx.moveTo(ax - 2, ay);
    ctx.lineTo(ax + 2, ay);
    ctx.moveTo(ax + 0.8, ay - 0.8);
    ctx.lineTo(ax + 2, ay);
    ctx.lineTo(ax + 0.8, ay + 0.8);
    ctx.stroke();
  }

  function drawWalls() {
    for (const o of obstacles) {
      if (o.kind === 'pillar') {
        ctx.save();
        ctx.translate(o.cx, o.cy);
        ctx.rotate(o.angle);
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        roundRect(ctx, -o.hx + 0.35, -o.hy + 0.45, o.hx * 2, o.hy * 2, 0.12);
        ctx.fill();
        ctx.fillStyle = theme.pillar;
        roundRect(ctx, -o.hx, -o.hy, o.hx * 2, o.hy * 2, 0.1);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fillRect(-o.hx, -o.hy, o.hx * 2, 0.22);
        // hazard band
        ctx.fillStyle = 'rgba(198,255,46,0.5)';
        ctx.fillRect(-o.hx, o.hy - 0.3, o.hx * 2, 0.16);
        ctx.restore();
        continue;
      }
      ctx.save();
      ctx.translate(o.cx, o.cy);
      ctx.rotate(o.angle);
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      roundRect(ctx, -o.hx + 0.3, -o.hy + 0.4, o.hx * 2, o.hy * 2, 0.12);
      ctx.fill();
      ctx.fillStyle = theme.wall;
      roundRect(ctx, -o.hx, -o.hy, o.hx * 2, o.hy * 2, 0.1);
      ctx.fill();
      ctx.fillStyle = theme.wallTop;
      ctx.fillRect(-o.hx, -o.hy, o.hx * 2, Math.min(0.22, o.hy * 0.35));
      ctx.restore();
    }
  }

  function drawBay(t) {
    if (!bayObb) return;
    ctx.save();
    ctx.translate(bayObb.cx, bayObb.cy);
    ctx.rotate(bayObb.angle);
    const pulse = 0.5 + Math.sin(t * 3) * 0.16;
    ctx.fillStyle = `rgba(198,255,46,${0.1 + pulse * 0.08})`;
    ctx.fillRect(-bayObb.hx, -bayObb.hy, bayObb.hx * 2, bayObb.hy * 2);
    ctx.setLineDash([0.55, 0.4]);
    ctx.lineWidth = 0.12;
    ctx.strokeStyle = `rgba(198,255,46,${0.6 + pulse * 0.3})`;
    ctx.strokeRect(-bayObb.hx, -bayObb.hy, bayObb.hx * 2, bayObb.hy * 2);
    ctx.setLineDash([]);

    // corner ticks
    ctx.strokeStyle = '#c6ff2e';
    ctx.lineWidth = 0.16;
    const tick = 0.7;
    for (const [sx, sy] of [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ]) {
      ctx.beginPath();
      ctx.moveTo(sx * bayObb.hx, sy * bayObb.hy - sy * tick);
      ctx.lineTo(sx * bayObb.hx, sy * bayObb.hy);
      ctx.lineTo(sx * bayObb.hx - sx * tick, sy * bayObb.hy);
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(198,255,46,0.75)';
    ctx.font = '700 1.5px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('P', 0, 0);
    ctx.restore();
  }

  function drawCones() {
    for (const cone of coneList) {
      ctx.save();
      ctx.translate(cone.x, cone.y);
      if (cone.knocked) {
        ctx.rotate(cone.rot);
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = '#ff7a45';
        roundRect(ctx, -0.4, -0.16, 0.8, 0.32, 0.1);
        ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.beginPath();
        ctx.ellipse(0.08, 0.12, 0.34, 0.22, 0, 0, TAU);
        ctx.fill();
        ctx.fillStyle = '#ff7a45';
        ctx.beginPath();
        ctx.moveTo(0, -0.42);
        ctx.lineTo(0.3, 0.3);
        ctx.lineTo(-0.3, 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.fillRect(-0.19, -0.02, 0.38, 0.1);
        ctx.fillStyle = 'rgba(255,255,255,0.28)';
        ctx.fillRect(-0.1, -0.3, 0.07, 0.55);
      }
      ctx.restore();
    }
  }

  function drawVehicle(x, y, a, L, W, color, opts = {}) {
    const { player = false, headlights = false } = opts;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a);

    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    roundRect(ctx, -L / 2 + 0.22, -W / 2 + 0.32, L, W, W * 0.28);
    ctx.fill();

    // wheels
    ctx.fillStyle = '#080b10';
    const wheelL = Math.min(0.72, L * 0.15);
    for (const wx of [-L * 0.3, L * 0.22]) {
      ctx.fillRect(wx, -W / 2 - 0.07, wheelL, 0.16);
      ctx.fillRect(wx, W / 2 - 0.09, wheelL, 0.16);
    }

    // body
    ctx.fillStyle = color;
    roundRect(ctx, -L / 2, -W / 2, L, W, W * 0.3);
    ctx.fill();

    // body shading
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    roundRect(ctx, -L / 2 + 0.08, W * 0.12, L - 0.16, W * 0.32, W * 0.15);
    ctx.fill();

    // greenhouse
    ctx.fillStyle = '#101922';
    roundRect(ctx, -L * 0.18, -W * 0.34, L * 0.42, W * 0.68, W * 0.16);
    ctx.fill();
    ctx.fillStyle = 'rgba(150,205,255,0.18)';
    roundRect(ctx, -L * 0.12, -W * 0.27, L * 0.16, W * 0.54, W * 0.09);
    ctx.fill();

    if (player) {
      ctx.fillStyle = theme.accent;
      ctx.fillRect(-L * 0.33, -W * 0.47, L * 0.66, 0.07);
      ctx.fillRect(-L * 0.33, W * 0.4, L * 0.66, 0.07);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.fillRect(L * 0.05, -W * 0.3, 0.12, W * 0.6);
    }

    // lamps
    ctx.fillStyle = '#fff6c2';
    ctx.fillRect(L / 2 - 0.14, -W * 0.38, 0.12, W * 0.2);
    ctx.fillRect(L / 2 - 0.14, W * 0.18, 0.12, W * 0.2);
    ctx.fillStyle = '#ff5b4d';
    ctx.fillRect(-L / 2 + 0.04, -W * 0.38, 0.1, W * 0.2);
    ctx.fillRect(-L / 2 + 0.04, W * 0.18, 0.1, W * 0.2);

    if (headlights) {
      const grad = ctx.createLinearGradient(L / 2, 0, L / 2 + 9, 0);
      grad.addColorStop(0, 'rgba(255,244,190,0.22)');
      grad.addColorStop(1, 'rgba(255,244,190,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(L / 2, -W * 0.42);
      ctx.lineTo(L / 2 + 10, -4.4);
      ctx.lineTo(L / 2 + 10, 4.4);
      ctx.lineTo(L / 2, W * 0.42);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  function drawNight(t) {
    if (!theme.fog) return;
    ctx.fillStyle = theme.fog;
    ctx.fillRect(bounds.minX, bounds.minY, bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);

    // lamp pools
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const lamps = [
      [bounds.minX + 6, bounds.minY + 6],
      [bounds.maxX - 6, bounds.minY + 6],
      [bounds.minX + 6, bounds.maxY - 6],
      [bounds.maxX - 6, bounds.maxY - 6],
    ];
    for (const [lx, ly] of lamps) {
      const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 14);
      g.addColorStop(0, 'rgba(255,240,180,0.16)');
      g.addColorStop(1, 'rgba(255,240,180,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(lx, ly, 14, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  function render(t) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#05080c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const shakeX = shake > 0 ? (Math.random() - 0.5) * shake * 0.55 : 0;
    const shakeY = shake > 0 ? (Math.random() - 0.5) * shake * 0.55 : 0;

    ctx.setTransform(
      dpr * camera.scale,
      0,
      0,
      dpr * camera.scale,
      dpr * (viewW / 2 - camera.cx * camera.scale + shakeX),
      dpr * (viewH / 2 - camera.cy * camera.scale + shakeY),
    );

    drawGround();
    drawWalls();
    drawBay(t);
    drawCones();

    for (const p of parked) {
      drawVehicle(p.x, p.y, p.a, p.L, p.W, p.color, { headlights: false });
    }
    if (car) {
      drawVehicle(car.x, car.y, car.a, spec.length, spec.width, '#eef3f9', {
        player: true,
        headlights: data.theme === 'night',
      });
    }

    drawNight(t);

    // damage flash
    if (flash > 0) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const g = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.25,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.7,
      );
      g.addColorStop(0, 'rgba(255,60,50,0)');
      g.addColorStop(1, `rgba(255,60,50,${flash * 0.35})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!lastFrame) lastFrame = now;
    const dt = Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;
    update(dt);
    updateHud();
    render(now / 1000);
  }

  /* ---------------------------------------------------------------- */
  /* Boot                                                             */
  /* ---------------------------------------------------------------- */

  const ro = new ResizeObserver(resize);
  ro.observe(stage);
  document.addEventListener('fullscreenchange', resize);

  buildLevel(0);
  resize();
  lastFrame = performance.now();
  raf = requestAnimationFrame(frame);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('fullscreenchange', resize);
    },
  };
}
