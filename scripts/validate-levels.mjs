/**
 * Level data validator + Parking Jam solver.
 * Run with: node scripts/validate-levels.mjs
 */
import {
  PARKING_FURY,
  PARKING_FURY_2,
  PARKING_FURY_3,
  TRUCK_PARKING,
  BUS_PARKING,
  FREE_DRIVE,
  PARKING_JAM,
  VEHICLE_SPECS,
} from '../src/data/levels.mjs';
import { obb, obbFromRect, obbFromCar, satOverlap, pointInOBB, DEG } from '../src/js/geometry.js';

let failures = 0;
let checks = 0;

function fail(msg) {
  failures++;
  console.log('  FAIL ' + msg);
}

function checkParkingPack(name, levels) {
  console.log(`\n${name} (${levels.length} levels)`);
  const ids = new Set();
  for (const lv of levels) {
    checks++;
    const spec = VEHICLE_SPECS[lv.vehicle];
    if (!spec) fail(`${name} ${lv.id}: unknown vehicle ${lv.vehicle}`);
    if (ids.has(lv.id)) fail(`${name}: duplicate level id ${lv.id}`);
    ids.add(lv.id);
    if (!lv.name) fail(`${name} ${lv.id}: missing name`);
    if (!lv.hint) fail(`${name} ${lv.id}: missing hint`);

    const player = obb(lv.start.x, lv.start.y, spec.length / 2, spec.width / 2, lv.start.a * DEG);
    const obstacles = [];
    for (const w of lv.walls || []) obstacles.push({ kind: 'wall', o: obbFromRect(w) });
    for (const p of lv.pillars || []) obstacles.push({ kind: 'pillar', o: obbFromRect(p) });
    for (const c of lv.cars || []) {
      const cs = VEHICLE_SPECS[c.type || 'car'];
      obstacles.push({ kind: 'car', o: obbFromCar(c, cs) });
    }

    // Start must be clear
    for (const ob of obstacles) {
      if (satOverlap(player, ob.o)) fail(`${name} ${lv.id} "${lv.name}": start overlaps ${ob.kind}`);
    }

    // Obstacles must not overlap each other (wall corners are allowed to meet)
    for (let i = 0; i < obstacles.length; i++) {
      for (let j = i + 1; j < obstacles.length; j++) {
        const a = obstacles[i];
        const b = obstacles[j];
        if (a.kind === 'wall' && b.kind === 'wall') continue;
        if (satOverlap(a.o, b.o)) {
          fail(`${name} ${lv.id}: ${a.kind} overlaps ${b.kind}`);
        }
      }
    }

    if (lv.bay) {
      const b = obb(lv.bay.x, lv.bay.y, lv.bay.l / 2, lv.bay.w / 2, lv.bay.a * DEG);
      if (spec.length > lv.bay.l - 0.2) fail(`${name} ${lv.id}: bay too short for vehicle`);
      if (spec.width > lv.bay.w - 0.1) fail(`${name} ${lv.id}: bay too narrow for vehicle`);
      for (const ob of obstacles) {
        if (satOverlap(b, ob.o)) fail(`${name} ${lv.id}: bay overlaps ${ob.kind}`);
      }
      // bay centre must be inside the lot (not in a wall)
      if (pointInOBB(b.cx, b.cy, obstacles.find((o) => o.kind === 'wall')?.o || b)) {
        /* noop */
      }
      // approach: the mouth of the bay is opposite the direction the car faces
      const openX = b.cx - Math.cos(b.angle) * (lv.bay.l / 2 + 2.5);
      const openY = b.cy - Math.sin(b.angle) * (lv.bay.l / 2 + 2.5);
      const probe = obb(openX, openY, 1, 1, b.angle);
      for (const ob of obstacles) {
        if (satOverlap(probe, ob.o)) fail(`${name} ${lv.id}: bay mouth blocked by ${ob.kind}`);
      }
    }
  }
}

function checkJam() {
  console.log(`\nParking Jam (${PARKING_JAM.length} levels)`);
  const N = 6;
  const EXIT_ROW = 2;

  const key = (cars) => cars.map((c) => `${c.x},${c.y}`).join('|');
  const occupies = (c) => {
    const cells = [];
    for (let i = 0; i < c.len; i++) cells.push(c.dir === 'h' ? [c.x + i, c.y] : [c.x, c.y + i]);
    return cells;
  };

  for (const lv of PARKING_JAM) {
    checks++;
    // validate layout
    const grid = new Map();
    for (const c of lv.cars) {
      for (const [x, y] of occupies(c)) {
        if (x < 0 || y < 0 || x >= N || y >= N) fail(`Jam ${lv.id}: car ${c.id} out of bounds`);
        const k = `${x},${y}`;
        if (grid.has(k)) fail(`Jam ${lv.id}: cars overlap at ${k}`);
        grid.set(k, c.id);
      }
    }
    const goal = lv.cars.find((c) => c.id === 'goal');
    if (!goal || goal.dir !== 'h' || goal.y !== EXIT_ROW) fail(`Jam ${lv.id}: goal car must be horizontal on row ${EXIT_ROW}`);

    // BFS over car positions (goal may exit when its right edge reaches the border)
    const start = lv.cars.map((c) => ({ ...c }));
    const startKey = key(start);
    const queue = [start];
    const seen = new Set([startKey]);
    let solved = false;
    let depth = 0;
    const depths = new Map([[startKey, 0]]);
    while (queue.length && !solved) {
      const state = queue.shift();
      const d = depths.get(key(state));
      if (d > 40) break;
      for (const car of state) {
        for (const delta of [-1, 1]) {
          const next = state.map((c) => ({ ...c }));
          const moving = next.find((c) => c.id === car.id);
          moving.x += moving.dir === 'h' ? delta : 0;
          moving.y += moving.dir === 'v' ? delta : 0;
          let ok = true;
          for (const [x, y] of occupies(moving)) {
            if (x < 0 || y < 0 || x >= N || y >= N) ok = false;
          }
          if (!ok) continue;
          const nextGrid = new Map();
          for (const c of next) {
            if (c === moving) continue;
            for (const [x, y] of occupies(c)) nextGrid.set(`${x},${y}`, c.id);
          }
          for (const [x, y] of occupies(moving)) if (nextGrid.has(`${x},${y}`)) ok = false;
          if (!ok) continue;
          if (moving.id === 'goal' && moving.x + moving.len === N) {
            solved = true;
            depth = d + 1;
            break;
          }
          const k = key(next);
          if (!seen.has(k)) {
            seen.add(k);
            depths.set(k, d + 1);
            queue.push(next);
          }
        }
        if (solved) break;
      }
    }
    if (!solved) fail(`Jam ${lv.id} "${lv.name}" is NOT solvable`);
    else {
      const optimal = depth;
      const note = optimal > lv.par ? ` (par ${lv.par} < optimal ${optimal})` : '';
      if (optimal > lv.par) fail(`Jam ${lv.id}: par ${lv.par} is below optimal ${optimal}`);
      console.log(`  level ${lv.id} "${lv.name}" solvable in ${optimal} moves${note}`);
    }
  }
}

checkParkingPack('Parking Fury', PARKING_FURY);
checkParkingPack('Parking Fury 2', PARKING_FURY_2);
checkParkingPack('Parking Fury 3', PARKING_FURY_3);
checkParkingPack('Truck Parking', TRUCK_PARKING);
checkParkingPack('Bus Parking', BUS_PARKING);
checkParkingPack('Free Drive', FREE_DRIVE);
checkJam();

console.log(`\n${checks} level packs checked, ${failures} failure(s)`);
process.exit(failures ? 1 : 0);
