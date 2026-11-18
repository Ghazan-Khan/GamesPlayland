/**
 * Parking Fury 2 — original night-shift sequel.
 */
export const PARKING_FURY_2 = {
  slug: 'parking-fury-2',
  name: 'Parking Fury 2',
  h1: 'Parking Fury 2 – Play Online Free',
  title: 'Parking Fury 2 – Play the Night Parking Game Free',
  description:
    'Parking Fury 2 turns the lot lights off. Ten harder night levels, tighter bays and lower par times. Play free in your browser on desktop or mobile.',
  kicker: 'Night shift sequel',
  cardBlurb:
    'Ten night levels with tighter bays, lower par times and headlights that only show you what you already suspected.',
  category: 'car',
  categoryLabel: 'Car parking',
  engine: 'parking',
  mode: 'levels',
  theme: 'night',
  motif: 'car',
  badge: 'Sequel',
  featured: false,
  order: 2,
  published: '2026-11-13',
  updated: '2026-11-13',
  difficulty: 'Medium to hard',
  duration: '1–5 minutes per level',
  players: '1 player',
  levelsCount: 10,
  intro: `Parking Fury 2 is the night shift. The same precise top-down handling returns, but the lots are darker, the bays are tighter and the par times assume you already know how to reverse. Ten levels, no tutorial, no second chances on the damage bar.`,
  about: `<p>The sequel keeps the physics that made the first game work and changes the questions it asks. Bays sit closer to walls, corridors narrow, and several levels give you a single clean approach that disappears if you overshoot the turn.</p>
<p>Night changes more than the colour palette. Headlight beams make the far edge of the lot harder to read, so you plan the whole route before you move instead of reacting to what appears. Par times are five to ten seconds lower than the first game, which means a clean line matters as much as a clean park.</p>
<p>All ten levels are unlocked from the start. If a layout frustrates you, skip it and come back — the level strip below the game remembers your best stars for each bay.</p>`,
  howTo: [
    'Press play and pick any level from the strip below the frame. Nothing is locked.',
    'Read the lot before you move: find the bay, find the lane that reaches it and find the turn you cannot undo.',
    'Approach the bay at walking pace. Night levels punish a late brake more than a slow approach.',
    'Stop fully inside the lines and parallel to the bay. The marker turns solid green when the car is accepted.',
    'Beat par with zero damage for three stars. Two light knocks still leave you with two.',
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
    'Touch controls appear automatically on phones and tablets. Steering sits on the left thumb, pedals on the right, and the game frame prevents the page from scrolling while you hold a pedal.',
  features: [
    {
      title: 'Ten night layouts',
      text: 'Every level is rebuilt for the sequel: tighter slots, longer approaches and fewer forgiving angles.',
    },
    {
      title: 'Headlight-limited visibility',
      text: 'The far side of the lot is dimmer, so route planning becomes part of the challenge.',
    },
    {
      title: 'Lower par times',
      text: 'Targets are five to ten seconds tighter than the first game. Three stars demand a clean line, not just a clean park.',
    },
    {
      title: 'The same honest handling',
      text: 'No drifting, no boost, no arcade snap. The car behaves exactly as it did in the original.',
    },
    {
      title: 'All levels open',
      text: 'No grinding required. Jump straight to the layout you want to master.',
    },
  ],
  tips: [
    {
      title: 'Plan in the dark',
      text: 'Pause for two seconds at the start of each level and trace the route with your eyes. Reacting at speed is what fills the damage bar.',
    },
    {
      title: 'Brake earlier than feels right',
      text: 'The night palette hides kerbs. If you are unsure where the edge is, assume it is one metre closer than it looks.',
    },
    {
      title: 'Use the bay lines as a mirror',
      text: 'You cannot see the rear bumper, but you can see the bay line beside the car. When the line is parallel to the body, stop turning.',
    },
    {
      title: 'One correction per approach',
      text: 'A single deliberate reverse beats three small steering corrections. Each correction adds time and risk.',
    },
    {
      title: 'Chase two stars first',
      text: 'Learn the route for a safe finish, then replay it for par. Trying to be fast and clean at once usually produces neither.',
    },
  ],
  faq: [
    {
      q: 'Do I need to finish Parking Fury before playing the sequel?',
      a: 'No. Parking Fury 2 is standalone and every level is unlocked. The handling is identical, so the first game is good practice but not a requirement.',
    },
    {
      q: 'How many levels does Parking Fury 2 have?',
      a: 'Ten, all set at night. They range from a straightforward first shift to a final run with a barrier, cones and a tight bay.',
    },
    {
      q: 'Is Parking Fury 2 harder than the first game?',
      a: 'Yes, by design. Bays are narrower, approach lanes are shorter and par times are lower. The damage system is unchanged.',
    },
    {
      q: 'Can I play on a phone?',
      a: 'Yes. Touch controls are built in, and the layout scales to small screens. Landscape gives the clearest view of the lot.',
    },
    {
      q: 'Is this the official Parking Fury 2?',
      a: 'No. This is GamesPlayLand’s own original sequel to our Parking Fury game. It is not connected to any other title with a similar name.',
    },
  ],
  levelFocus: [
    { n: 1, name: 'Clock In', focus: 'A gentle reintroduction at night', par: '32s' },
    { n: 2, name: 'Rain Lane', focus: 'A long corridor and a far bay', par: '40s' },
    { n: 3, name: 'Reverse Only', focus: 'Backing into a slot between cars', par: '48s' },
    { n: 4, name: 'Lot Full', focus: 'One free space in a packed middle row', par: '50s' },
    { n: 5, name: 'Pillar Maze', focus: 'Threading six concrete pillars', par: '52s' },
    { n: 6, name: 'Cone Slalom', focus: 'Weaving without losing the approach angle', par: '50s' },
    { n: 7, name: 'Tight Turn', focus: 'A short U-turn in a small lot', par: '45s' },
    { n: 8, name: 'Loading Bay', focus: 'Finding the gap in a long barrier', par: '55s' },
    { n: 9, name: 'Blind Corner', focus: 'Two L-shaped walls', par: '55s' },
    { n: 10, name: 'Night Final', focus: 'Barrier, cones, pillars and a tight bay', par: '62s' },
  ],
  related: ['parking-fury', 'parking-fury-3', 'truck-parking', 'bus-parking', 'free-drive', 'parking-jam'],
};
