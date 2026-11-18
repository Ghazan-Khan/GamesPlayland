/**
 * Parking Fury 3 — original underground garage game.
 */
export const PARKING_FURY_3 = {
  slug: 'parking-fury-3',
  name: 'Parking Fury 3',
  h1: 'Parking Fury 3 – Play Online Free',
  title: 'Parking Fury 3 – Free Underground Parking Game',
  description:
    'Parking Fury 3 takes the series underground. Eight concrete garage levels with pillars, service corridors and tight decks. Play free in your browser.',
  kicker: 'Underground garage',
  cardBlurb:
    'Eight concrete decks, six pillars and nowhere to swing wide. The series goes underground.',
  category: 'car',
  categoryLabel: 'Car parking',
  engine: 'parking',
  mode: 'levels',
  theme: 'garage',
  motif: 'garage',
  badge: 'Garage',
  featured: false,
  order: 3,
  published: '2026-11-13',
  updated: '2026-11-13',
  difficulty: 'Medium to hard',
  duration: '1–5 minutes per level',
  players: '1 player',
  levelsCount: 8,
  intro: `Parking Fury 3 moves the series into a multi-storey car park. The lots are smaller, the walls are concrete and the pillars are exactly where you do not want them. Eight levels, one sedan, and far less space to correct a mistake.`,
  about: `<p>An underground garage removes the two things that make outdoor parking forgiving: long approach lanes and open space to reset your angle. Every level in Parking Fury 3 is built around a pillar, a service corridor or a deck edge, and the clean line usually requires one deliberate reverse.</p>
<p>The handling model is unchanged from the first two games. What changes is the margin. Bays are often flanked on three sides, and a late turn that would cost you a scratch outdoors will cost you a wing mirror here. The damage meter is the same, but you will feel it more.</p>
<p>Eight levels is a deliberate choice. Each one is a distinct garage problem — ramp column, reverse bay, squeeze corridor, spiral — rather than a variation on the same open lot. Clear all eight and you have genuinely learned to park in a tight structure.</p>`,
  howTo: [
    'Press play and choose a deck from the level strip. All eight are available immediately.',
    'Identify the pillars first. They define the route more than the walls do.',
    'Keep one car width from the concrete on the outside of every turn.',
    'Enter the bay slowly enough to stop within half a metre. The green marker confirms the position.',
    'Finish without damage for a clean run, then replay for the par time and three stars.',
  ],
  controls: [
    { action: 'Accelerate', keys: 'W or Arrow Up' },
    { action: 'Brake / reverse', keys: 'S or Arrow Down' },
    { action: 'Steer left / right', keys: 'A / D or Arrow Left / Arrow Right' },
    { action: 'Handbrake', keys: 'Space' },
    { action: 'Restart level', keys: 'R' },
    { action: 'Pause', keys: 'P or Escape' },
    { action: 'Fullscreen', keys: 'F' },
  ],
  touchNote:
    'On touch devices the garage view scales to fit, and the controls become two pedals plus a steering pair. Pillars stay visible because the camera always frames the whole deck.',
  features: [
    {
      title: 'Eight garage decks',
      text: 'Ramp columns, reverse bays, service corridors and a spiral exit, each with its own layout.',
    },
    {
      title: 'Pillars that matter',
      text: 'Concrete columns sit inside the driving line, not at the edges, so your route has to bend around them.',
    },
    {
      title: 'Three-sided bays',
      text: 'Several slots are enclosed on three sides, turning every park into a controlled reverse.',
    },
    {
      title: 'Concrete palette',
      text: 'A cooler, darker look that makes the bay markings and your own car easier to read.',
    },
    {
      title: 'Clean-run scoring',
      text: 'The same three-star system: no damage and under par is the only perfect result.',
    },
  ],
  tips: [
    {
      title: 'Pillars are the route',
      text: 'Do not aim at the bay until you have cleared the last pillar. Plan the path between columns first.',
    },
    {
      title: 'Reverse into three-sided bays',
      text: 'If a bay is closed at the far end, driving in nose-first leaves you unable to straighten. Back in instead.',
    },
    {
      title: 'Watch the rear quarter',
      text: 'The back corner of the car cuts inside the front wheels. In a garage, that corner is usually nearest the concrete.',
    },
    {
      title: 'Straighten before you enter',
      text: 'A car that is still turning when it crosses the bay line will not fit. Complete the turn, pause, then move straight.',
    },
    {
      title: 'Use the handbrake to settle',
      text: 'A tap of the handbrake at walking pace stops the car without a nose dip, which keeps your aim steady.',
    },
  ],
  faq: [
    {
      q: 'Is Parking Fury 3 a 3D game?',
      a: 'No. It is a top-down 2D game with a garage theme. We do not use the “3D” label because the game is not rendered in 3D.',
    },
    {
      q: 'How many levels are in Parking Fury 3?',
      a: 'Eight. Each deck is a distinct layout, and all of them are unlocked from the start.',
    },
    {
      q: 'Can I play without finishing the first two games?',
      a: 'Yes. The controls are identical, but the layouts are standalone. If you are new to the series, the first game is the gentler introduction.',
    },
    {
      q: 'Does it work on mobile?',
      a: 'Yes, with on-screen controls. The whole deck is framed on screen, so the tighter view does not hide obstacles.',
    },
    {
      q: 'Is this connected to other games called Parking Fury 3?',
      a: 'No. This is GamesPlayLand’s own original garage game. Other titles with similar names are made by different developers and are not affiliated with us.',
    },
  ],
  levelFocus: [
    { n: 1, name: 'Level B1', focus: 'A first garage bay with one central pillar', par: '35s' },
    { n: 2, name: 'Level B1 — Ramp', focus: 'A ramp column narrows the lane', par: '42s' },
    { n: 3, name: 'Level B2 — Pillars', focus: 'Four columns around a side bay', par: '48s' },
    { n: 4, name: 'Level B2 — Reverse', focus: 'Backing into a bay against the wall', par: '50s' },
    { n: 5, name: 'Level B3 — Squeeze', focus: 'A service corridor with two corners', par: '55s' },
    { n: 6, name: 'Level B3 — Full Deck', focus: 'One lit bay in a full row', par: '50s' },
    { n: 7, name: 'Level B4 — Spiral', focus: 'A looping route with a late exit', par: '58s' },
    { n: 8, name: 'Level B5 — Exam', focus: 'Narrow bay, two neighbours and a pillar', par: '65s' },
  ],
  related: ['parking-fury', 'parking-fury-2', 'truck-parking', 'bus-parking', 'parking-jam', 'free-drive'],
};
