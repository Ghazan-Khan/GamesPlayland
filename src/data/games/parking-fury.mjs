/**
 * Original editorial content for the car parking games.
 */
export const PARKING_FURY = {
  slug: 'parking-fury',
  name: 'Parking Fury',
  h1: 'Parking Fury – Play Online Free',
  title: 'Parking Fury – Play Free Online Parking Game',
  description:
    'Play Parking Fury free in your browser. 12 original parking levels, keyboard and touch controls, instant loading and no sign-up. Can you park clean?',
  kicker: 'Flagship parking challenge',
  cardBlurb:
    'Twelve tight bays, one patient sedan and a damage meter that punishes every rushed turn.',
  category: 'car',
  categoryLabel: 'Car parking',
  engine: 'parking',
  mode: 'levels',
  theme: 'day',
  motif: 'car',
  badge: 'Flagship',
  featured: true,
  order: 1,
  published: '2026-11-13',
  updated: '2026-11-13',
  difficulty: 'Easy to hard',
  duration: '1–4 minutes per level',
  players: '1 player',
  levelsCount: 12,
  intro: `Parking Fury is a top-down parking challenge built for people who think they are good at reversing. You get one sedan, twelve crowded lots and a damage meter that fills every time metal meets concrete. Slot the car into the glowing bay, keep the paint clean and move on before the clock eats your star rating.`,
  about: `<p>Every level is a small, hand-built car park. There is no traffic, no timer counting down to zero and no hidden physics trickery: just a car with believable momentum, a marked bay and a lot full of parked cars, pillars, cones and walls.</p>
<p>The challenge comes from geometry. The car steers like a real front-wheel-steered vehicle, which means it pivots around a turning circle rather than rotating on the spot. A bay that looks simple from above can demand a wide approach, a pause and a short reverse. Hit something and the damage bar jumps; fill it and the run is over.</p>
<p>Each of the twelve levels introduces one idea at a time — an angled bay, a tight corridor, a pillar, a row with a single gap — and the final exam combines all of them. Your best stars and times are stored in your browser, so you can leave and come back without losing progress.</p>`,
  howTo: [
    'Click the play button on the game frame. The level loads immediately and your car appears at the entry point.',
    'Drive to the highlighted bay. Follow the painted lane, not the shortest line, and keep your speed low enough to stop on demand.',
    'Stop with the whole car inside the bay lines and the body roughly parallel to them. The bay pulses green when the position is accepted.',
    'Watch the damage bar at the top of the screen. Each solid impact adds 15 percent; at 100 percent the level restarts.',
    'Finish under par time with no damage for three stars, then use the level strip below the game to jump to the next challenge.',
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
    'On phones and tablets the same controls appear as on-screen buttons: two pedals on the right and steering on the left. The game frame locks scrolling while you drive, so you will not lose the page mid-turn.',
  features: [
    {
      title: 'Twelve hand-built levels',
      text: 'Every lot is designed around one specific parking problem, from a simple nose-in bay to a one-car gap between two neighbours.',
    },
    {
      title: 'Believable car handling',
      text: 'Steering uses a proper wheelbase model, so the nose swings wide at speed and the rear cuts the corner when you turn late.',
    },
    {
      title: 'Damage and star scoring',
      text: 'Clean runs earn three stars. Two knocks drop you to two, and a full damage bar ends the attempt.',
    },
    {
      title: 'Par times for every bay',
      text: 'Each level has a target time. Beating it is the difference between a tidy park and a gold-star park.',
    },
    {
      title: 'Keyboard and touch',
      text: 'Desktop players get WASD or arrows; mobile players get large thumb-friendly pedals that never cover the car.',
    },
    {
      title: 'Instant, offline-friendly loading',
      text: 'The game is a single lightweight canvas app. No account, no install, no third-party game frame and no waiting for an ad to finish.',
    },
  ],
  tips: [
    {
      title: 'Slow is fast',
      text: 'Most failed parks happen at 15 km/h or more. If you are still rolling when the bay arrives, you have already lost the angle.',
    },
    {
      title: 'Line up before you turn',
      text: 'Give yourself a full car width on the outside of the turn. The rear axle follows a tighter path than the nose, so a late turn clips the car beside the bay.',
    },
    {
      title: 'Use reverse deliberately',
      text: 'A short straight reverse is often cleaner than a wide forward arc. Stop, select reverse, straighten the wheel, then back in slowly.',
    },
    {
      title: 'Aim for the centre line',
      text: 'Do not aim at the bay opening; aim at the middle of the bay. Your brain corrects toward whatever point you fix on.',
    },
    {
      title: 'Restart without guilt',
      text: 'A damaged run is not worth saving. Press R the moment the angle goes wrong and the level resets instantly.',
    },
  ],
  faq: [
    {
      q: 'Is Parking Fury free to play?',
      a: 'Yes. The whole game, all twelve levels, is free in your browser. There is no download, no sign-up and no paywall.',
    },
    {
      q: 'Does Parking Fury work on mobile?',
      a: 'Yes. The game detects touch devices and shows on-screen steering and pedals. It is designed for both portrait and landscape, though landscape gives you a larger view of the lot.',
    },
    {
      q: 'How many levels are there?',
      a: 'Twelve. They run from a simple nose-in bay to a final exam with pillars, cones and a one-car gap. Every level can be replayed at any time.',
    },
    {
      q: 'Is this the same Parking Fury as the 2016 browser game?',
      a: 'No. This is GamesPlayLand’s own original parking game, built in-house. The well-known 2016 game with a similar name was made by a different developer and is hosted on other websites. We do not claim any connection to it.',
    },
    {
      q: 'Why did my car stop and reset?',
      a: 'The damage bar reached 100 percent. Seven solid impacts end a run. Press retry and the level restarts with a clean car.',
    },
    {
      q: 'Do I need an account to save progress?',
      a: 'No account is needed. Stars and best times are saved in your browser’s local storage on the device you are using.',
    },
  ],
  levelFocus: [
    { n: 1, name: 'First Day', focus: 'Straight approach and a simple nose-in bay', par: '35s' },
    { n: 2, name: 'Around the Block', focus: 'Reading a route around a central island', par: '42s' },
    { n: 3, name: 'Tight Neighbours', focus: 'A bay between two parked cars', par: '50s' },
    { n: 4, name: 'Cone Alley', focus: 'Lane discipline with cone markers', par: '45s' },
    { n: 5, name: 'Full House', focus: 'Finding the only free space in a row', par: '48s' },
    { n: 6, name: 'Tight Squeeze', focus: 'An eight-metre corridor', par: '42s' },
    { n: 7, name: 'Pillar Park', focus: 'Blind rear corners around concrete pillars', par: '45s' },
    { n: 8, name: 'S-Bend', focus: 'Two staggered walls and a late exit', par: '50s' },
    { n: 9, name: 'Tight Row', focus: 'Reversing into a packed row', par: '48s' },
    { n: 10, name: 'Double Back', focus: 'A barrier that forces the long route', par: '55s' },
    { n: 11, name: 'Narrow Entry', focus: 'A 5.5-metre gap in a wall', par: '55s' },
    { n: 12, name: 'Final Exam', focus: 'Pillars, cones and a one-car gap', par: '60s' },
  ],
  related: ['parking-fury-2', 'parking-fury-3', 'truck-parking', 'bus-parking', 'parking-jam', 'free-drive'],
};
