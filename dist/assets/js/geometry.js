/**
 * Shared 2D geometry helpers (oriented bounding boxes).
 * Loaded by the browser game engine and by the Node test harness.
 */

export const DEG = Math.PI / 180;

export function obb(cx, cy, hx, hy, angle) {
  return { cx, cy, hx, hy, angle, cos: Math.cos(angle), sin: Math.sin(angle) };
}

export function obbFromRect(r, angleDeg = 0) {
  return obb(r.x, r.y, r.w / 2, r.h / 2, angleDeg * DEG);
}

export function obbFromCar(car, spec) {
  return obb(car.x, car.y, spec.length / 2, spec.width / 2, (car.a || 0) * DEG);
}

const AXES = [
  [1, 0],
  [0, 1],
];

function project(o, ax, ay) {
  const c = o.cos * ax + o.sin * ay;
  const s = -o.sin * ax + o.cos * ay;
  const r = o.hx * Math.abs(c) + o.hy * Math.abs(s);
  const p = o.cx * ax + o.cy * ay;
  return [p - r, p + r];
}

/** Separating Axis Theorem for two oriented boxes. */
export function satOverlap(a, b) {
  for (const o of [a, b]) {
    const axes = [
      [o.cos, o.sin],
      [-o.sin, o.cos],
    ];
    for (const [ax, ay] of axes) {
      const [amin, amax] = project(a, ax, ay);
      const [bmin, bmax] = project(b, ax, ay);
      if (amax < bmin || bmax < amin) return false;
    }
  }
  return true;
}

export function toLocal(o, px, py) {
  const dx = px - o.cx;
  const dy = py - o.cy;
  return {
    x: dx * o.cos + dy * o.sin,
    y: -dx * o.sin + dy * o.cos,
  };
}

export function pointInOBB(px, py, o, shrink = 0) {
  const l = toLocal(o, px, py);
  return Math.abs(l.x) <= o.hx - shrink && Math.abs(l.y) <= o.hy - shrink;
}

export function angleDiff(a, b) {
  let d = a - b;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

/** Closest distance from a point to an OBB (0 when inside). */
export function distanceToOBB(px, py, o) {
  const l = toLocal(o, px, py);
  const dx = Math.max(Math.abs(l.x) - o.hx, 0);
  const dy = Math.max(Math.abs(l.y) - o.hy, 0);
  return Math.hypot(dx, dy);
}

export function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}
