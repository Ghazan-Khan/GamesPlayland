/**
 * Parking Jam — original 6x6 sliding-block car puzzle.
 * Canvas rendering with an accessible DOM button layer for pointer, touch
 * and keyboard input.
 */
const COLORS = {
  goal: '#e0473f',
  blue: '#3d6ea8',
  grey: '#8fa3b8',
  green: '#5c8f6a',
  orange: '#e08a3c',
  purple: '#8b6fd6',
  teal: '#3fb5b0',
};

const NAMES = {
  goal: 'red',
  blue: 'blue',
  grey: 'grey',
  green: 'green',
  orange: 'orange',
  purple: 'purple',
  teal: 'teal',
};

function rr(ctx, x, y, w, h, r) {
  const rad = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
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
    /* ignore */
  }
}

export function initParkingJam({ data, stage, canvas }) {
  const ctx = canvas.getContext('2d');
  const levels = data.levels;
  const storeKey = `gpl:stars:${data.slug}`;
  const bestKey = `gpl:best:${data.slug}`;
  const hudLevel = stage.querySelector('#hud-level');
  const hudMoves = stage.querySelector('#hud-moves');
  const hudPar = stage.querySelector('#hud-par');
  const levelStrip = document.getElementById('level-strip');

  let levelIndex = 0;
  let level = null;
  let cars = [];
  let moves = 0;
  let history = [];
  let selected = 'goal';
  let solved = false;
  let exitOffset = 0;
  let exiting = false;
  let overlay = null;
  let stars = readStore(storeKey, {});
  let bests = readStore(bestKey, {});
  let viewW = 0;
  let viewH = 0;
  let board = { size: 0, left: 0, top: 0, cell: 0 };
  let raf = 0;
  let lastFrame = 0;
  let buttons = new Map();
  let drag = null;

  const live = document.createElement('p');
  live.className = 'visually-hidden';
  live.setAttribute('aria-live', 'polite');
  stage.appendChild(live);

  /* ---------------------------------------------------------------- */
  /* Level state                                                      */
  /* ---------------------------------------------------------------- */

  function buildLevel(index) {
    levelIndex = Math.max(0, Math.min(index, levels.length - 1));
    level = levels[levelIndex];
    cars = level.cars.map((c) => ({ ...c }));
    moves = 0;
    history = [];
    solved = false;
    exiting = false;
    exitOffset = 0;
    selected = 'goal';
    removeOverlay();
    buildButtons();
    layoutButtons();
    updateHud();
    updateStrip();
    live.textContent = `Puzzle ${levelIndex + 1}, ${level.name}. ${moves} moves.`;
  }

  function carById(id) {
    return cars.find((c) => c.id === id);
  }

  function occupies(car, x = car.x, y = car.y) {
    const cells = [];
    for (let i = 0; i < car.len; i++) {
      cells.push(car.dir === 'h' ? [x + i, y] : [x, y + i]);
    }
    return cells;
  }

  function canPlace(car, dx, dy) {
    const nx = car.x + dx;
    const ny = car.y + dy;
    if (car.dir === 'h') {
      if (nx < 0 || nx + car.len > 6 || ny < 0 || ny > 5) return false;
    } else {
      if (ny < 0 || ny + car.len > 6 || nx < 0 || nx > 5) return false;
    }
    for (const other of cars) {
      if (other.id === car.id) continue;
      const taken = new Set(occupies(other).map(([x, y]) => `${x},${y}`));
      for (const [x, y] of occupies(car, nx, ny)) {
        if (taken.has(`${x},${y}`)) return false;
      }
    }
    return true;
  }

  function range(car) {
    let min = 0;
    let max = 0;
    const axis = car.dir === 'h' ? [1, 0] : [0, 1];
    while (canPlace(car, axis[0] * (min - 1), axis[1] * (min - 1))) min -= 1;
    while (canPlace(car, axis[0] * (max + 1), axis[1] * (max + 1))) max += 1;
    return { min, max };
  }

  function applyMove(car, delta, { record = true } = {}) {
    if (!delta || solved) return;
    const axis = car.dir === 'h' ? [1, 0] : [0, 1];
    const dx = axis[0] * delta;
    const dy = axis[1] * delta;
    if (!canPlace(car, dx, dy)) {
      // find the furthest legal step in that direction
      const step = Math.sign(delta);
      let moved = 0;
      while (canPlace(car, axis[0] * (moved + step), axis[1] * (moved + step))) moved += step;
      if (!moved) return;
      car.x += axis[0] * moved;
      car.y += axis[1] * moved;
      if (record) history.push({ id: car.id, delta: moved });
      moves += Math.abs(moved);
    } else {
      car.x += dx;
      car.y += dy;
      if (record) history.push({ id: car.id, delta });
      moves += Math.abs(delta);
    }
    selected = car.id;
    layoutButtons();
    updateHud();
    live.textContent = `${NAMES[car.color] || car.color} car moved. ${moves} moves.`;
    checkWin();
  }

  function checkWin() {
    const goal = carById('goal');
    if (!goal) return;
    if (goal.x + goal.len >= 6 && !exiting) {
      exiting = true;
      solved = true;
      const earned = moves <= level.par ? 3 : moves <= level.par + 5 ? 2 : 1;
      const prev = stars[levelIndex] || 0;
      if (earned > prev) {
        stars[levelIndex] = earned;
        writeStore(storeKey, stars);
      }
      if (bests[levelIndex] == null || moves < bests[levelIndex]) {
        bests[levelIndex] = moves;
        writeStore(bestKey, bests);
      }
      updateStrip();
      live.textContent = `Solved in ${moves} moves. Par ${level.par}.`;
      setTimeout(() => showWin(earned), 620);
    }
  }

  function undo() {
    if (solved) return;
    const last = history.pop();
    if (!last) return;
    const car = carById(last.id);
    if (!car) return;
    const axis = car.dir === 'h' ? [1, 0] : [0, 1];
    car.x -= axis[0] * last.delta;
    car.y -= axis[1] * last.delta;
    moves = Math.max(0, moves - Math.abs(last.delta));
    selected = car.id;
    layoutButtons();
    updateHud();
    live.textContent = `Undone. ${moves} moves.`;
  }

  function reset() {
    buildLevel(levelIndex);
  }

  /* ---------------------------------------------------------------- */
  /* DOM buttons                                                      */
  /* ---------------------------------------------------------------- */

  function buildButtons() {
    for (const btn of buttons.values()) btn.remove();
    buttons = new Map();
    for (const car of cars) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'jam-car-btn';
      btn.dataset.car = car.id;
      btn.setAttribute(
        'aria-label',
        `${NAMES[car.color] || car.color} car, row ${car.y + 1}, column ${car.x + 1}, ${
          car.dir === 'h' ? 'horizontal' : 'vertical'
        }, ${car.len} long. Use arrow keys to slide.`,
      );
      btn.addEventListener('focus', () => {
        selected = car.id;
      });
      btn.addEventListener('keydown', (e) => onCarKey(e, car));
      btn.addEventListener('pointerdown', (e) => onPointerDown(e, car));
      stage.appendChild(btn);
      buttons.set(car.id, btn);
    }
  }

  function layoutButtons() {
    if (!board.size) return;
    for (const car of cars) {
      const btn = buttons.get(car.id);
      if (!btn) continue;
      const x = board.left + car.x * board.cell;
      const y = board.top + car.y * board.cell;
      const w = (car.dir === 'h' ? car.len : 1) * board.cell;
      const h = (car.dir === 'v' ? car.len : 1) * board.cell;
      btn.style.left = `${x}px`;
      btn.style.top = `${y}px`;
      btn.style.width = `${w}px`;
      btn.style.height = `${h}px`;
    }
  }

  function onCarKey(e, car) {
    const forward = car.dir === 'h' ? 'ArrowRight' : 'ArrowDown';
    const back = car.dir === 'h' ? 'ArrowLeft' : 'ArrowUp';
    if (e.key === forward) {
      e.preventDefault();
      applyMove(car, 1);
    } else if (e.key === back) {
      e.preventDefault();
      applyMove(car, -1);
    } else if (e.key === 'z' || e.key === 'Z') {
      e.preventDefault();
      undo();
    } else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      reset();
    }
  }

  function onPointerDown(e, car) {
    e.preventDefault();
    selected = car.id;
    drag = {
      car,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
      pointerId: e.pointerId,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const up = (ev) => {
      if (!drag) return;
      const dx = ev.clientX - drag.startX;
      const dy = ev.clientY - drag.startY;
      const cell = board.cell || 1;
      const along = car.dir === 'h' ? dx : dy;
      const cross = car.dir === 'h' ? dy : dx;
      const steps = Math.round(along / cell);
      if (Math.abs(along) > cell * 0.35 && Math.abs(along) > Math.abs(cross) * 0.7) {
        applyMove(car, steps);
      } else {
        // tap: move toward the tapped half of the car
        const rect = ev.currentTarget.getBoundingClientRect();
        const local = car.dir === 'h' ? ev.clientX - rect.left : ev.clientY - rect.top;
        const half = (car.dir === 'h' ? rect.width : rect.height) / 2;
        const dir = local >= half ? 1 : -1;
        const r = range(car);
        if (dir > 0 && r.max > 0) applyMove(car, 1);
        else if (dir < 0 && r.min < 0) applyMove(car, -1);
        else if (r.max > 0) applyMove(car, 1);
        else if (r.min < 0) applyMove(car, -1);
      }
      drag = null;
      ev.currentTarget.releasePointerCapture?.(ev.pointerId);
    };
    const cancel = () => {
      drag = null;
    };
    e.currentTarget.addEventListener('pointerup', up, { once: true });
    e.currentTarget.addEventListener('pointercancel', cancel, { once: true });
  }

  /* ---------------------------------------------------------------- */
  /* Overlays + HUD                                                   */
  /* ---------------------------------------------------------------- */

  function removeOverlay() {
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
  }

  function showWin(earned) {
    const hasNext = levelIndex + 1 < levels.length;
    const starRow = [1, 2, 3]
      .map((n) => `<span class="${n <= earned ? 'is-on' : ''}">★</span>`)
      .join('');
    overlay = document.createElement('div');
    overlay.className = 'game-overlay';
    overlay.innerHTML = `<div class="overlay-card">
      <p class="overlay-kicker">${level.name} solved</p>
      <div class="overlay-stars" aria-label="${earned} out of 3 stars">${starRow}</div>
      <h2>${earned === 3 ? 'Par. Nothing wasted.' : earned === 2 ? 'Solved, with slack.' : 'Solved.'}</h2>
      <p class="overlay-sub">${moves} moves · Par ${level.par} · Best ${Math.min(bests[levelIndex] ?? moves, moves)}</p>
      <div class="overlay-actions">
        ${hasNext ? '<button class="btn btn--sm" type="button" data-next>Next puzzle</button>' : ''}
        <button class="btn btn--ghost btn--sm" type="button" data-retry>Play again</button>
        <a class="btn btn--ghost btn--sm" href="/parking-puzzle-games/">More puzzles</a>
      </div>
    </div>`;
    stage.appendChild(overlay);
    overlay.querySelector('[data-retry]').addEventListener('click', reset);
    const next = overlay.querySelector('[data-next]');
    if (next) next.addEventListener('click', () => buildLevel(levelIndex + 1));
    (next || overlay.querySelector('[data-retry]')).focus({ preventScroll: true });
  }

  function updateHud() {
    if (hudLevel) hudLevel.textContent = String(levelIndex + 1);
    if (hudMoves) hudMoves.textContent = String(moves);
    if (hudPar) hudPar.textContent = String(level.par);
  }

  function updateStrip() {
    if (!levelStrip) return;
    for (const btn of levelStrip.querySelectorAll('[data-level]')) {
      const i = Number(btn.dataset.level);
      btn.setAttribute('aria-current', i === levelIndex ? 'true' : 'false');
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
    });
  }

  for (const btn of stage.querySelectorAll('[data-action]')) {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'undo') undo();
      else if (action === 'restart') reset();
      else if (action === 'fullscreen') {
        if (!document.fullscreenElement) stage.requestFullscreen?.().catch(() => {});
        else document.exitFullscreen?.().catch(() => {});
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.target && e.target.classList && e.target.classList.contains('jam-car-btn')) return;
    if (e.key === 'z' || e.key === 'Z') {
      e.preventDefault();
      undo();
    } else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      reset();
    }
  });

  /* ---------------------------------------------------------------- */
  /* Rendering                                                        */
  /* ---------------------------------------------------------------- */

  function resize() {
    const rect = stage.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    viewW = Math.max(1, rect.width);
    viewH = Math.max(1, rect.height);
    canvas.width = Math.round(viewW * dpr);
    canvas.height = Math.round(viewH * dpr);
    const size = Math.min(viewW, viewH) * 0.9;
    board = {
      size,
      cell: size / 6,
      left: (viewW - size) / 2,
      top: (viewH - size) / 2,
    };
    layoutButtons();
  }

  function drawBoard(t) {
    const { size, left, top, cell } = board;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#05080c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // board shadow
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    rr(ctx, left + 8, top + 12, size, size, 18);
    ctx.fill();

    ctx.fillStyle = '#182325';
    rr(ctx, left, top, size, size, 16);
    ctx.fill();

    // subtle tile check
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 6; x++) {
        if ((x + y) % 2 === 0) {
          ctx.fillStyle = 'rgba(255,255,255,0.018)';
          ctx.fillRect(left + x * cell, top + y * cell, cell, cell);
        }
      }
    }

    // grid
    ctx.strokeStyle = 'rgba(255,255,255,0.055)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(left + i * cell, top);
      ctx.lineTo(left + i * cell, top + size);
      ctx.moveTo(left, top + i * cell);
      ctx.lineTo(left + size, top + i * cell);
      ctx.stroke();
    }

    // exit gap on the right, row 2
    const exitY = top + 2 * cell;
    ctx.fillStyle = 'rgba(198,255,46,0.14)';
    ctx.fillRect(left + size - 2, exitY + cell * 0.08, 8, cell * 0.84);
    ctx.strokeStyle = 'rgba(198,255,46,0.65)';
    ctx.lineWidth = 2;
    ctx.strokeRect(left + size - 2, exitY + cell * 0.08, 8, cell * 0.84);

    // exit arrow
    ctx.fillStyle = 'rgba(198,255,46,0.75)';
    ctx.beginPath();
    ctx.moveTo(left + size - 26, exitY + cell * 0.5);
    ctx.lineTo(left + size - 36, exitY + cell * 0.5 - 7);
    ctx.lineTo(left + size - 36, exitY + cell * 0.5 + 7);
    ctx.closePath();
    ctx.fill();

    // board border
    ctx.strokeStyle = 'rgba(255,255,255,0.10)';
    ctx.lineWidth = 2;
    rr(ctx, left, top, size, size, 16);
    ctx.stroke();

    // corner label
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.font = '600 10px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('PARKING JAM · 6 × 6', left + 2, top - 10);

    for (const car of cars) {
      const offset = car.id === 'goal' ? exitOffset : 0;
      const x = left + (car.x + offset) * cell;
      const y = top + car.y * cell;
      const w = (car.dir === 'h' ? car.len : 1) * cell;
      const h = (car.dir === 'v' ? car.len : 1) * cell;
      const pad = Math.max(2, cell * 0.055);
      const color = COLORS[car.color] || car.color;

      ctx.fillStyle = 'rgba(0,0,0,0.42)';
      rr(ctx, x + pad + 2, y + pad + 3, w - pad * 2, h - pad * 2, cell * 0.16);
      ctx.fill();

      ctx.fillStyle = color;
      rr(ctx, x + pad, y + pad, w - pad * 2, h - pad * 2, cell * 0.16);
      ctx.fill();

      // roof / glass
      const inset = Math.max(3, cell * 0.14);
      ctx.fillStyle = 'rgba(8,14,20,0.72)';
      if (car.dir === 'h') {
        rr(ctx, x + pad + inset, y + h * 0.28, w - pad * 2 - inset * 2, h * 0.44, cell * 0.1);
      } else {
        rr(ctx, x + w * 0.28, y + pad + inset, w * 0.44, h - pad * 2 - inset * 2, cell * 0.1);
      }
      ctx.fill();

      // highlight
      ctx.fillStyle = 'rgba(255,255,255,0.14)';
      if (car.dir === 'h') {
        ctx.fillRect(x + pad + inset, y + pad + 2, w - pad * 2 - inset * 2, 2);
      } else {
        ctx.fillRect(x + pad + 2, y + pad + inset, 2, h - pad * 2 - inset * 2);
      }

      if (car.id === 'goal') {
        ctx.strokeStyle = 'rgba(255,255,255,0.75)';
        ctx.lineWidth = 2;
        rr(ctx, x + pad + 1, y + pad + 1, w - pad * 2 - 2, h - pad * 2 - 2, cell * 0.15);
        ctx.stroke();
      }

      if (car.id === selected) {
        ctx.strokeStyle = 'rgba(198,255,46,0.85)';
        ctx.lineWidth = 2;
        rr(ctx, x + pad - 1.5, y + pad - 1.5, w - pad * 2 + 3, h - pad * 2 + 3, cell * 0.17);
        ctx.stroke();
      }
    }

    // pulse on goal when it can exit
    const goal = carById('goal');
    if (goal && goal.x + goal.len >= 6) {
      const a = 0.35 + Math.sin(t * 6) * 0.2;
      ctx.fillStyle = `rgba(198,255,46,${a})`;
      ctx.beginPath();
      ctx.arc(left + size + 2, exitY + cell * 0.5, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - (lastFrame || now)) / 1000);
    lastFrame = now;
    if (exiting && exitOffset < 3.4) {
      exitOffset = Math.min(3.4, exitOffset + dt * 5);
      const goal = carById('goal');
      if (goal) {
        const btn = buttons.get(goal.id);
        if (btn) btn.style.opacity = '0';
      }
    }
    drawBoard(now / 1000);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(stage);
  document.addEventListener('fullscreenchange', resize);

  buildLevel(0);
  resize();
  raf = requestAnimationFrame(frame);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('fullscreenchange', resize);
    },
  };
}
