/**
 * Truck Parking — original heavy-vehicle parking game.
 */
export const TRUCK_PARKING = {
  slug: 'truck-parking',
  name: 'Truck Parking',
  h1: 'Truck Parking – Play Online Free',
  title: 'Truck Parking – Free Browser Truck Parking Game',
  description:
    'Play Truck Parking free online. Five loading-dock levels with an 8.4-metre rig, wide turning circles and tight reverse bays. Keyboard and touch controls.',
  kicker: 'Heavy vehicle challenge',
  cardBlurb:
    'An 8.4-metre rig, five loading docks and a turning circle that refuses to be rushed.',
  category: 'truck',
  categoryLabel: 'Truck & bus',
  engine: 'parking',
  mode: 'levels',
  theme: 'day',
  motif: 'truck',
  badge: 'Heavy',
  featured: false,
  order: 4,
  published: '2026-11-13',
  updated: '2026-11-13',
  difficulty: 'Medium to hard',
  duration: '1–5 minutes per level',
  players: '1 player',
  levelsCount: 5,
  intro: `Truck Parking puts you behind an 8.4-metre rig in a working goods yard. The steering is slower, the turning circle is enormous and every dock has a wall somewhere near your trailer. Five levels, no shortcuts.`,
  about: `<p>A truck does not drive like a car, and this game does not pretend otherwise. The wheelbase is long, the steering lock is limited and the vehicle takes several seconds to change direction. You have to start every turn earlier than instinct suggests.</p>
<p>The five levels are built around loading docks rather than car bays. Docks are wider than a car space but often approached through a narrow lane or between two parked trailers, so the difficulty comes from the approach rather than the slot itself. A clean run is a planned run: line up, commit, and do not add steering once the trailer is inside the lines.</p>
<p>The damage meter and three-star scoring from the car games return unchanged. What changes is the cost of a mistake — a rig that clips a dock takes longer to recover, and the par times are set with that in mind.</p>`,
  howTo: [
    'Press play and select a dock from the level strip below the game.',
    'Take the widest available line into the yard. A truck needs the full lane, not the inside of it.',
    'Begin every turn early. By the time the cab reaches the corner, the trailer must already be pointing at the dock.',
    'Approach the dock at walking pace and stop with the whole rig inside the lines.',
    'Aim for zero damage and a time under par. Anything else is a two-star delivery.',
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
    'Touch controls are built for thumbs: a wide steering pair on the left and two large pedals on the right. The slower vehicle speed makes touch input noticeably easier than in the car games.',
  features: [
    {
      title: 'Long-wheelbase handling',
      text: 'The rig turns slowly and cuts corners late. Every manoeuvre has to be planned a full vehicle length ahead.',
    },
    {
      title: 'Five dock layouts',
      text: 'An open loading dock, a container shuffle, a tight depot row, a maze and a final long-haul run.',
    },
    {
      title: 'Wider bays, narrower approaches',
      text: 'The dock is not the hard part. The lane that leads to it is.',
    },
    {
      title: 'Trailer-aware collisions',
      text: 'The full 8.4-metre body collides, not just the cab, so a clean cab does not mean a clean run.',
    },
    {
      title: 'Same star system',
      text: 'No damage and under par for three stars, exactly like the car parking games.',
    },
  ],
  tips: [
    {
      title: 'Swing wide, then straighten',
      text: 'Take the outside line into every turn. A truck cannot tighten a corner once the trailer is committed.',
    },
    {
      title: 'Stop before you correct',
      text: 'At low speed, a full stop and a fresh steering input is faster than trying to adjust while rolling.',
    },
    {
      title: 'Use reverse for the final metre',
      text: 'Most docks are easier to enter backwards. Line the trailer up, then reverse straight in.',
    },
    {
      title: 'Watch the trailer, not the cab',
      text: 'The cab will clear obstacles the trailer will not. Judge the dock from the rear of the vehicle.',
    },
    {
      title: 'Accept the long route',
      text: 'A wide loop around the yard is almost always quicker than a three-point turn in a narrow lane.',
    },
  ],
  faq: [
    {
      q: 'How many levels are in Truck Parking?',
      a: 'Five. They cover an open dock, a container yard, a depot row, a maze and a final long-haul delivery.',
    },
    {
      q: 'Can I drive a trailer?',
      a: 'No. The truck is a single rigid vehicle, not an articulated rig with a separate trailer. That keeps the handling learnable while still feeling heavy.',
    },
    {
      q: 'Is Truck Parking harder than Parking Fury?',
      a: 'It is slower but less forgiving. The vehicle is longer, the steering is limited and the approach lanes are narrower relative to the vehicle size.',
    },
    {
      q: 'Does it work on mobile?',
      a: 'Yes. The slower speeds suit touch controls well, and the on-screen pedals are large enough for thumb use.',
    },
    {
      q: 'Do I need to play the car games first?',
      a: 'No. The controls are the same, but the handling is different enough that Truck Parking works as a standalone challenge.',
    },
  ],
  levelFocus: [
    { n: 1, name: 'Loading Dock', focus: 'An open dock and a first wide turn', par: '60s' },
    { n: 2, name: 'Yard Shuffle', focus: 'Routing around a container block', par: '70s' },
    { n: 3, name: 'Depot Row', focus: 'A dock between two parked trailers', par: '75s' },
    { n: 4, name: 'Container Maze', focus: 'Two staggered container walls', par: '85s' },
    { n: 5, name: 'Long Haul Final', focus: 'Barrier, tight dock and a long approach', par: '90s' },
  ],
  related: ['bus-parking', 'parking-fury', 'parking-fury-2', 'parking-fury-3', 'free-drive', 'parking-jam'],
};
