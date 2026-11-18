/**
 * Free Drive — original open-lot driving sandbox.
 */
export const FREE_DRIVE = {
  slug: 'free-drive',
  name: 'Free Drive',
  h1: 'Free Drive – Play the Open Lot Sandbox',
  title: 'Free Drive – Open Lot Driving Sandbox',
  description:
    'A free open-lot driving sandbox. No timer, no target bay, no pressure. Practise turns, reverses and tight gaps in your browser on desktop or mobile.',
  kicker: 'Open lot sandbox',
  cardBlurb:
    'No timer, no bay, no score. Just an open yard, a car and as long as you need to get the basics right.',
  category: 'driving',
  categoryLabel: 'Driving',
  engine: 'parking',
  mode: 'sandbox',
  theme: 'sandbox',
  motif: 'car',
  badge: 'Sandbox',
  featured: false,
  order: 7,
  published: '2026-11-13',
  updated: '2026-11-13',
  difficulty: 'Relaxed',
  duration: 'Play as long as you like',
  players: '1 player',
  levelsCount: 1,
  intro: `Free Drive is the practice room. It is the same car, the same handling and the same yard furniture as the main games, with the timer, the target bay and the damage meter switched off. Drive, reverse, park badly, try again.`,
  about: `<p>Most parking games tell you what to do and then punish you for doing it slowly. Free Drive does neither. There is one large yard, a handful of parked cars, two cone lines and a barrier, and no objective at all.</p>
<p>That makes it the best place to learn the handling model before you take on <a href="/parking-fury/">Parking Fury</a>. You can feel how the nose swings, how early the rear axle cuts in and how much space a full-lock turn actually needs, without a damage bar filling up while you work it out.</p>
<p>It is also the closest thing on the site to a pure driving toy. If you just want to cruise around a car park for five minutes, that is a perfectly good use of it.</p>`,
  howTo: [
    'Press play. The yard loads with your car already facing the open lane.',
    'There is no objective. Use the space to practise whatever you want to improve.',
    'Use the respawn button if you get wedged against a wall or want to start from a clean position.',
    'Try the three drills below: a full-lock circle, a straight reverse and a two-space park.',
    'When you are ready for a scored challenge, open Parking Fury and apply what you have practised.',
  ],
  controls: [
    { action: 'Accelerate', keys: 'W or Arrow Up' },
    { action: 'Brake / reverse', keys: 'S or Arrow Down' },
    { action: 'Steer left / right', keys: 'A / D or Arrow Left / Arrow Right' },
    { action: 'Handbrake', keys: 'Space' },
    { action: 'Respawn', keys: 'R' },
    { action: 'Pause', keys: 'P or Escape' },
    { action: 'Fullscreen', keys: 'F' },
  ],
  touchNote:
    'Touch devices get the standard on-screen pedals and steering pair. Because there is no timer, the slower thumb input is not a disadvantage here.',
  features: [
    {
      title: 'No objectives',
      text: 'No timer, no target bay, no damage meter. The yard is there to be used however you like.',
    },
    {
      title: 'The same real handling',
      text: 'Identical physics to the scored games, so practice transfers directly.',
    },
    {
      title: 'Obstacles to learn around',
      text: 'Parked cars, a barrier and two cone lines give you reference points for real manoeuvres.',
    },
    {
      title: 'Instant respawn',
      text: 'Stuck against a wall? One key puts the car back at the start without reloading anything.',
    },
    {
      title: 'Works on any screen',
      text: 'The whole yard is framed and scales down to phone width without hiding obstacles.',
    },
  ],
  tips: [
    {
      title: 'Drill one: the full-lock circle',
      text: 'Hold full steering at walking pace and drive a complete circle. Watch how much wider the nose tracks than the rear. That difference is your turning circle.',
    },
    {
      title: 'Drill two: the straight reverse',
      text: 'Pick a lane line, reverse along it for ten metres and stop. Repeat until you can hold the line without steering corrections.',
    },
    {
      title: 'Drill three: the two-space park',
      text: 'Approach a gap between two parked cars, stop alongside the front one, then reverse in with one steering input. Repeat from both sides.',
    },
    {
      title: 'Practise the pause',
      text: 'Stopping completely before a correction is the single biggest improvement most players can make. The yard is the place to build the habit.',
    },
    {
      title: 'Then add pressure',
      text: 'Once the drills feel boring, move to Parking Fury. The handling is the same; only the consequences change.',
    },
  ],
  faq: [
    {
      q: 'Is there a goal in Free Drive?',
      a: 'No. It is a sandbox. You can drive, reverse, practise parking or simply cruise around the yard.',
    },
    {
      q: 'Does Free Drive save anything?',
      a: 'No score is recorded because there is nothing to score. The page itself does not store your position between visits.',
    },
    {
      q: 'Is it good practice for Parking Fury?',
      a: 'Yes. The car, handling and collision behaviour are identical, so the habits you build here transfer directly.',
    },
    {
      q: 'Can I play it on mobile?',
      a: 'Yes. Touch controls appear automatically, and the whole yard fits on screen.',
    },
    {
      q: 'Why is the damage meter missing?',
      a: 'Because nothing is being scored. Collisions still stop the car, but they do not end the session or affect a rating.',
    },
  ],
  levelFocus: [],
  related: ['parking-fury', 'parking-fury-2', 'parking-fury-3', 'truck-parking', 'bus-parking', 'parking-jam'],
};
