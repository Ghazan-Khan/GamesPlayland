/**
 * Bus Parking — original night depot game.
 */
export const BUS_PARKING = {
  slug: 'bus-parking',
  name: 'Bus Parking',
  h1: 'Bus Parking – Play Online Free',
  title: 'Bus Parking – Play a Free Bus Parking Game Online',
  description:
    'Play Bus Parking free online. Five night depot levels with an 11-metre bus, terminal bays and cone-lined lanes. Works on desktop and mobile.',
  kicker: 'Night depot challenge',
  cardBlurb:
    'Eleven metres of bus, five night depots and a terminal bay that was clearly designed by an optimist.',
  category: 'truck',
  categoryLabel: 'Truck & bus',
  engine: 'parking',
  mode: 'levels',
  theme: 'night',
  motif: 'bus',
  badge: 'Night',
  featured: false,
  order: 5,
  published: '2026-11-13',
  updated: '2026-11-13',
  difficulty: 'Hard',
  duration: '1–6 minutes per level',
  players: '1 player',
  levelsCount: 5,
  intro: `Bus Parking hands you the longest vehicle on the site: eleven metres of bus, a night depot and a bay that leaves very little room for imagination. Five levels, cone-lined lanes and a turning circle best described as a rumour.`,
  about: `<p>The bus is the hardest vehicle in the GamesPlayLand garage. It is longer than the truck, slower to steer and unforgiving of a late turn. In a night depot, that combination turns every approach into a small planning exercise.</p>
<p>Each level has a distinct job: an open terminal bay, a depot U-turn, a cone-marked pick-up lane, a slot between two parked buses and a final run with a barrier and a tight dock. The cones are there to show the lane, not to add decoration — clipping them costs you damage and time.</p>
<p>If you have played the truck game, the skills transfer, but the bus rewards even earlier planning. If you have only played the car games, expect the first level to feel strange for about thirty seconds. Then it clicks.</p>`,
  howTo: [
    'Press play and choose a depot level. All five are unlocked.',
    'Before moving, find the bay and the widest lane that reaches it. In a bus, the widest lane is usually the correct one.',
    'Turn early and let the rear of the bus follow. Late steering is what puts the tail into a wall.',
    'Approach the bay at walking pace, stop fully inside the lines and let the marker confirm the park.',
    'Aim for zero damage and a sub-par time. The bus makes both genuinely difficult.',
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
    'Touch controls scale to the screen and the lower speeds make thumb steering practical. The whole depot is framed, so you can always see where the rear of the bus is going.',
  features: [
    {
      title: 'An 11-metre vehicle',
      text: 'The longest and least forgiving vehicle in the collection, with a turning circle to match.',
    },
    {
      title: 'Five night depots',
      text: 'Terminal bay, depot turn, school run, night row and a city terminal finale.',
    },
    {
      title: 'Cone-lined lanes',
      text: 'Cones mark the intended route. They knock over harmlessly, but cutting inside them usually puts the rear of the bus into a wall.',
    },
    {
      title: 'Tight neighbour bays',
      text: 'Two levels park you between other buses, where a half-metre error is the difference between a star and a scratch.',
    },
    {
      title: 'Full damage model',
      text: 'The entire bus body collides. A clean cab does not mean a clean trailer.',
    },
  ],
  tips: [
    {
      title: 'Think in bus lengths',
      text: 'Every gap is measured against eleven metres, not against the cab. If the space does not fit a bus, it does not fit you.',
    },
    {
      title: 'Steer before you need to',
      text: 'Start the turn a full bus length earlier than feels natural. The rear axle will thank you.',
    },
    {
      title: 'Do not fight the cone line',
      text: 'The cones show the designed route. Cutting inside them usually ends in a wall.',
    },
    {
      title: 'Reverse straight',
      text: 'When backing into a bay, keep the wheel centred. A bus cannot correct a crooked reverse in a short slot.',
    },
    {
      title: 'Take the two-star win',
      text: 'A safe finish is worth more than a failed attempt at par. Replay for the third star once the route is memorised.',
    },
  ],
  faq: [
    {
      q: 'How many levels does Bus Parking have?',
      a: 'Five, all set in night depots. They range from an open terminal bay to a tight final dock with a barrier and cones.',
    },
    {
      q: 'Is the bus harder than the truck?',
      a: 'Yes. It is longer, slower to steer and less forgiving of a late turn. The truck is the better stepping stone.',
    },
    {
      q: 'Can I play on a phone?',
      a: 'Yes. Touch controls are built in, and the lower speeds make the bus manageable with thumbs.',
    },
    {
      q: 'Why do the cones matter?',
      a: 'They mark the intended lane. They are soft props and do not add damage, but cutting inside them usually puts the rear of the bus into a wall.',
    },
    {
      q: 'Is this based on a real bus company or game?',
      a: 'No. It is an original GamesPlayLand game with fictional depots and no connection to any real operator or other bus parking title.',
    },
  ],
  levelFocus: [
    { n: 1, name: 'Terminal Bay', focus: 'A first wide turn and an open bay', par: '70s' },
    { n: 2, name: 'Depot Turn', focus: 'A full U-turn around a depot building', par: '80s' },
    { n: 3, name: 'School Run', focus: 'A cone-marked pick-up lane', par: '85s' },
    { n: 4, name: 'Night Depot', focus: 'Parking between two buses', par: '90s' },
    { n: 5, name: 'City Terminal', focus: 'Barrier, cones and a tight final bay', par: '100s' },
  ],
  related: ['truck-parking', 'parking-fury-2', 'parking-fury-3', 'parking-fury', 'free-drive', 'parking-jam'],
};
