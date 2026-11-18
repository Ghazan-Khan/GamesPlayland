import { PARKING_FURY } from './parking-fury.mjs';
import { PARKING_FURY_2 } from './parking-fury-2.mjs';
import { PARKING_FURY_3 } from './parking-fury-3.mjs';
import { TRUCK_PARKING } from './truck-parking.mjs';
import { BUS_PARKING } from './bus-parking.mjs';
import { PARKING_JAM } from './parking-jam.mjs';
import { FREE_DRIVE } from './free-drive.mjs';

export const GAMES = [
  PARKING_FURY,
  PARKING_FURY_2,
  PARKING_FURY_3,
  TRUCK_PARKING,
  BUS_PARKING,
  PARKING_JAM,
  FREE_DRIVE,
].sort((a, b) => a.order - b.order);

export const GAME_BY_SLUG = Object.fromEntries(GAMES.map((g) => [g.slug, g]));

export function gamesByCategory(cat) {
  return GAMES.filter((g) => g.category === cat);
}

export const FEATURED = GAMES.find((g) => g.featured) || GAMES[0];
