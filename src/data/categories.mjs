/**
 * Category hub content. Each hub is a real landing page with original editorial,
 * a comparison table built from live game data and a short buying-guide section.
 */
export const CATEGORIES = [
  {
    slug: 'car-parking-games',
    name: 'Car Parking Games',
    h1: 'Car Parking Games – Play Free Online',
    title: 'Car Parking Games – Free Online Car Parking Games',
    description:
      'Play free car parking games in your browser. Three original GamesPlayLand car games, 30 hand-built levels, keyboard and touch controls, no download or sign-up.',
    kicker: 'Three games · 30 levels',
    short: 'Precision parking with a believable car',
    intro: `<p>Car parking games work when the car feels like a car. Ours use a front-wheel-steered handling model with a real wheelbase, so the nose swings wide and the rear axle cuts the corner. That single decision is what turns a bay from a target into a puzzle.</p>
<p>There are three games in this category. <a href="/parking-fury/">Parking Fury</a> is the place to start: twelve daylight levels that introduce one parking problem at a time. <a href="/parking-fury-2/">Parking Fury 2</a> moves the same handling into a night lot with tighter bays and lower par times. <a href="/parking-fury-3/">Parking Fury 3</a> takes it underground, where concrete pillars replace open space.</p>
<p>All three are free, need no account, and run on desktop and mobile. Progress is stored in your browser, so you can close the tab and come back to the same stars.</p>`,
    whatIs: `<h2>What makes a good car parking game?</h2>
<p>A good parking game has three things: a car with weight, a bay that is genuinely tight, and a camera that lets you judge both. Add a damage meter and you have tension without a countdown clock. Add a par time and you have a reason to replay a level you have already solved.</p>
<p>What a good parking game does <em>not</em> need is a fake 3D camera, a currency system or a garage full of locked cars. Our games are deliberately plain: one vehicle, a marked bay and the geometry between them. If you can judge a gap and control your speed, you can play.</p>`,
    comparison: {
      columns: ['Game', 'Levels', 'Setting', 'Best for'],
      rows: [
        { cells: ['Parking Fury', '12', 'Daylight car park', 'Learning the handling'], href: '/parking-fury/' },
        { cells: ['Parking Fury 2', '10', 'Night car park', 'Tighter bays and par times'], href: '/parking-fury-2/' },
        { cells: ['Parking Fury 3', '8', 'Underground garage', 'Pillars and three-sided bays'], href: '/parking-fury-3/' },
      ],
    },
    howToChoose: [
      {
        title: 'New to parking games?',
        text: 'Start with Parking Fury. The first four levels teach the turning circle, the damage meter and the bay marker without punishing you for being curious.',
      },
      {
        title: 'Already comfortable reversing?',
        text: 'Go straight to Parking Fury 2. The night palette hides kerbs and the par times are five to ten seconds tighter, which makes route planning matter.',
      },
      {
        title: 'Want the hardest car challenge?',
        text: 'Parking Fury 3. Eight garage decks with pillars inside the driving line and several bays closed on three sides. It is the shortest game and the least forgiving.',
      },
      {
        title: 'Just want to practise?',
        text: 'Open Free Drive, our untimed sandbox. The handling is identical to the scored games, so the habits transfer when you switch back.',
      },
    ],
    faq: [
      {
        q: 'Are these car parking games free?',
        a: 'Yes. Every game and every level is free to play in your browser. There is no download, no sign-up and no paywall.',
      },
      {
        q: 'Can I play car parking games on a phone?',
        a: 'Yes. All three games detect touch devices and show on-screen steering and pedals. Landscape orientation gives you the clearest view of the lot.',
      },
      {
        q: 'Do I need to install anything?',
        a: 'No. The games run on HTML canvas in your browser. Nothing is installed and no account is created.',
      },
      {
        q: 'Which car parking game should I play first?',
        a: 'Parking Fury. It is the gentlest introduction to the handling model and the damage system, and the later games assume you are comfortable with both.',
      },
      {
        q: 'Is progress saved?',
        a: 'Stars and best times are saved in your browser’s local storage on the device you are using. Clearing site data will remove them.',
      },
    ],
    related: ['truck-parking-games', 'parking-puzzle-games', 'driving-games'],
  },
  {
    slug: 'truck-parking-games',
    name: 'Truck & Bus Parking Games',
    h1: 'Truck & Bus Parking Games – Play Free',
    title: 'Truck & Bus Parking Games – Play Free Online',
    description:
      'Play free truck and bus parking games online. An 8.4-metre rig and an 11-metre bus, ten loading-dock and depot levels, no download. Desktop and mobile.',
    kicker: 'Two games · 10 levels',
    short: 'Heavy vehicles, wide turns, narrow approaches',
    intro: `<p>Parking a truck is not parking a car slowly. The wheelbase is longer, the steering lock is smaller and the vehicle takes several seconds to change direction. Our heavy-vehicle games are built around that difference rather than a bigger sprite.</p>
<p><a href="/truck-parking/">Truck Parking</a> puts you in an 8.4-metre rigid rig across five goods-yard levels. <a href="/bus-parking/">Bus Parking</a> goes one step further with an 11-metre bus in five night depots. Both use the same damage and star system as the car games, so a clean run means the same thing.</p>
<p>These are the hardest games on the site, but they are also the most satisfying to finish cleanly. If you can put the bus between two neighbours without a scratch, you have earned it.</p>`,
    whatIs: `<h2>Why heavy vehicle parking is different</h2>
<p>A car can hide a bad approach with a late steering correction. A truck cannot. By the time the cab reaches a corner, the trailer is already committed, and the rear of an 11-metre bus sweeps a path that is nothing like the front.</p>
<p>That is why our truck and bus levels are designed around the approach lane rather than the bay. The dock is usually wide enough. The corridor that leads to it is not. Learning to take the outside line, turn early and stop before correcting is the whole skill.</p>`,
    comparison: {
      columns: ['Game', 'Vehicle', 'Levels', 'Setting'],
      rows: [
        { cells: ['Truck Parking', '8.4 m rigid rig', '5', 'Daylight goods yard'], href: '/truck-parking/' },
        { cells: ['Bus Parking', '11 m bus', '5', 'Night depot'], href: '/bus-parking/' },
      ],
    },
    howToChoose: [
      {
        title: 'First time in a heavy vehicle?',
        text: 'Start with Truck Parking. The rig is shorter, the yard is open and the first dock gives you room to feel the steering lag.',
      },
      {
        title: 'Want maximum difficulty?',
        text: 'Bus Parking. Eleven metres, night visibility and cone-lined lanes. It is the longest vehicle on the site and the least forgiving.',
      },
      {
        title: 'Struggling with the turning circle?',
        text: 'Spend five minutes in Free Drive doing full-lock circles. The same instinct — turn earlier than feels natural — is what heavy vehicles demand.',
      },
      {
        title: 'Playing on a phone?',
        text: 'Both games work with touch controls, and the lower speeds actually suit thumb input. Use landscape and keep the whole vehicle framed.',
      },
    ],
    faq: [
      {
        q: 'Are the trucks and buses articulated?',
        a: 'No. Both are rigid vehicles. That keeps the handling learnable while still feeling heavy. There is no separate trailer to jackknife.',
      },
      {
        q: 'Which is harder, truck or bus?',
        a: 'The bus. It is longer, slower to steer and less forgiving of a late turn. Truck Parking is the better stepping stone.',
      },
      {
        q: 'Can I play these games on mobile?',
        a: 'Yes. Touch controls appear automatically and the whole yard or depot is framed on screen so the rear of the vehicle stays visible.',
      },
      {
        q: 'Do the cones cause damage?',
        a: 'No. Cones are soft props and knock over harmlessly. They mark the intended lane, so cutting inside them usually ends with the rear of the bus against a wall anyway.',
      },
      {
        q: 'Are these based on real companies or vehicles?',
        a: 'No. The vehicles, yards and depots are fictional. There is no connection to any real operator, manufacturer or other game.',
      },
    ],
    related: ['car-parking-games', 'driving-games', 'parking-puzzle-games'],
  },
  {
    slug: 'parking-puzzle-games',
    name: 'Parking Puzzle Games',
    h1: 'Parking Puzzle Games – Free Car Park Logic Puzzles',
    title: 'Parking Puzzle Games – Free Car Park Logic Puzzles',
    description:
      'Play free parking puzzle games online. Eight sliding-block car puzzles on a 6x6 lot, with undo, reset and keyboard controls. No timer, no download.',
    kicker: 'Eight puzzles · no timer',
    short: 'Sliding-block logic with a car park theme',
    intro: `<p>Not every parking game needs a steering wheel. Parking puzzles take the same crowded-lot anxiety and turn it into a logic problem: cars can only move along their own axis, and one red car needs a clear route to the exit.</p>
<p><a href="/parking-jam/">Parking Jam</a> is our take on the idea. Eight hand-built layouts on a 6x6 grid, each with a par score measured in single-space slides. There is no timer, so you can think, undo and experiment without losing anything.</p>
<p>If you like Rush Hour-style puzzles, this is the same pleasure with a different coat of paint. If you have never tried one, the first puzzle takes about a minute and teaches the whole ruleset.</p>`,
    whatIs: `<h2>How sliding car puzzles work</h2>
<p>The board is a grid. Each vehicle occupies a run of cells and can only slide forwards or backwards along its own axis — horizontal cars left and right, vertical cars up and down. Nothing rotates and nothing leaves the board except the goal car.</p>
<p>The goal car is horizontal and sits on the exit row. Your job is to clear every blocker between it and the right-hand edge. The difficulty comes from the order of moves: freeing one lane often closes another, and a car that looks irrelevant can be the one holding the whole layout together.</p>
<p>Par is the number of single-cell slides in a tidy solution. You do not need to hit par to finish, but it is the difference between solving a puzzle and solving it well.</p>`,
    comparison: {
      columns: ['Game', 'Type', 'Puzzles', 'Pressure'],
      rows: [{ cells: ['Parking Jam', 'Sliding-block puzzle', '8', 'Move count only'], href: '/parking-jam/' }],
    },
    howToChoose: [
      {
        title: 'New to sliding puzzles?',
        text: 'Start at puzzle one. It has a single blocker and teaches the tap-to-slide interaction in about thirty seconds.',
      },
      {
        title: 'Want a keyboard-only option?',
        text: 'Parking Jam is fully playable with Tab and the arrow keys. Focus a car, then slide it along its axis.',
      },
      {
        title: 'Looking for a timed challenge?',
        text: 'This category is deliberately untimed. If you want pressure, the car parking games use par times instead.',
      },
      {
        title: 'Playing with a child?',
        text: 'The first three puzzles are gentle enough for younger players, and undo means a wrong move never ruins the board.',
      },
    ],
    faq: [
      {
        q: 'Is Parking Jam a timed game?',
        a: 'No. There is no clock. The only score is the number of slides you use, and you can undo or reset at any time.',
      },
      {
        q: 'How many puzzles are there?',
        a: 'Eight, ranging from a single blocker to a full grid that requires a carefully ordered sequence.',
      },
      {
        q: 'Can I play without a mouse?',
        a: 'Yes. Press Tab to move focus between cars and use the arrow keys to slide the focused car along its axis.',
      },
      {
        q: 'Are the puzzles always solvable?',
        a: 'Yes. Every layout is checked by an automated solver before publication, and the par score is based on an optimal solution.',
      },
      {
        q: 'Does the game save my progress?',
        a: 'Your best move count per puzzle is stored in your browser’s local storage. No account is needed.',
      },
    ],
    related: ['car-parking-games', 'driving-games', 'truck-parking-games'],
  },
  {
    slug: 'driving-games',
    name: 'Driving Games',
    h1: 'Driving Games – Free Open Lot Sandbox',
    title: 'Driving Games – Free Open Lot Driving Sandbox',
    description:
      'A free driving sandbox with no timer and no objectives. Practise turns, reverses and tight gaps in an open lot. Runs in your browser on desktop and mobile.',
    kicker: 'One sandbox · no pressure',
    short: 'An open yard with nothing to prove',
    intro: `<p>Sometimes you do not want a score. You want a car, an open yard and ten minutes to find out how the handling actually works. That is what <a href="/free-drive/">Free Drive</a> is for.</p>
<p>It uses the same car and the same physics as our parking games, but the timer, target bay and damage meter are switched off. There are parked cars, a barrier and cone lines to drive around, and a respawn key for when you wedge yourself against a wall.</p>
<p>It is a practice room, a driving toy and the best possible first step before Parking Fury. Nothing is recorded and nothing is judged.</p>`,
    whatIs: `<h2>What to do in a driving sandbox</h2>
<p>A sandbox is only useful if you give it a purpose. Three drills cover most of what the scored games ask of you:</p>
<ul>
<li><strong>The full-lock circle.</strong> Hold full steering at walking pace and drive a complete circle. Watch how much wider the nose tracks than the rear — that gap is your turning circle.</li>
<li><strong>The straight reverse.</strong> Pick a lane line, reverse along it for ten metres and stop. Repeat until you can hold the line without correcting.</li>
<li><strong>The two-space park.</strong> Approach a gap between two parked cars, stop alongside the front one, then reverse in with a single steering input. Do it from both sides.</li>
</ul>
<p>Once those feel boring, move to Parking Fury. The handling is identical; only the consequences change.</p>`,
    comparison: {
      columns: ['Game', 'Mode', 'Timer', 'Best for'],
      rows: [{ cells: ['Free Drive', 'Open sandbox', 'None', 'Learning the handling'], href: '/free-drive/' }],
    },
    howToChoose: [
      {
        title: 'Brand new to the controls?',
        text: 'Spend ten minutes in Free Drive before touching a scored level. You will skip most of the frustration that comes from learning under a damage meter.',
      },
      {
        title: 'Warming up before a hard level?',
        text: 'Do two full-lock circles and one straight reverse. It recalibrates your sense of speed faster than jumping straight in.',
      },
      {
        title: 'Want a scored challenge?',
        text: 'Free Drive has no score by design. Move to Parking Fury or Truck Parking when you want a target and a star rating.',
      },
      {
        title: 'Playing on a phone?',
        text: 'The sandbox is the most forgiving place to learn touch steering, because a wrong input costs nothing.',
      },
    ],
    faq: [
      {
        q: 'Is there any objective in Free Drive?',
        a: 'No. It is an open sandbox. You can drive, reverse, practise parking or simply cruise around the yard.',
      },
      {
        q: 'Does Free Drive save my position?',
        a: 'No. Nothing is recorded between visits. The page does not store your location or score.',
      },
      {
        q: 'Is it useful practice for the parking games?',
        a: 'Yes. The car, handling and collision behaviour are identical, so the habits transfer directly.',
      },
      {
        q: 'Can I use it on mobile?',
        a: 'Yes. Touch controls appear automatically and the whole yard fits on screen.',
      },
      {
        q: 'Why is there no damage meter?',
        a: 'Because nothing is being scored. Collisions still stop the car, but they do not end the session or affect a rating.',
      },
    ],
    related: ['car-parking-games', 'truck-parking-games', 'parking-puzzle-games'],
  },
];

export const CATEGORY_BY_SLUG = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]));
