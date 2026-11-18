/**
 * Parking Jam — original sliding-block car puzzle.
 */
export const PARKING_JAM = {
  slug: 'parking-jam',
  name: 'Parking Jam',
  h1: 'Parking Jam – Play Online Free',
  title: 'Parking Jam – Free Car Puzzle Game Online',
  description:
    'Play Parking Jam free online. Eight sliding-block car puzzles on a 6x6 lot. Tap, drag or use the keyboard to clear the exit. No timer, no download.',
  kicker: 'Car park logic puzzle',
  cardBlurb:
    'A 6x6 lot, a blocked exit and eight puzzles that reward patience over speed.',
  category: 'puzzle',
  categoryLabel: 'Parking puzzle',
  engine: 'jam',
  mode: 'puzzle',
  theme: 'puzzle',
  motif: 'jam',
  badge: 'Puzzle',
  featured: false,
  order: 6,
  published: '2026-11-13',
  updated: '2026-11-13',
  difficulty: 'Easy to hard',
  duration: '1–5 minutes per puzzle',
  players: '1 player',
  levelsCount: 8,
  intro: `Parking Jam is the thinking player’s parking game. There is no steering wheel and no timer: just a crowded 6x6 lot, a red car that needs the exit and a limited number of slides to get it there.`,
  about: `<p>The idea is simple. Every car in the lot can only move along its own axis — horizontal cars slide left and right, vertical cars slide up and down. Your job is to clear a path from the red car to the exit on the right-hand side of the third row.</p>
<p>What makes it a puzzle rather than a chore is the order. A car that looks like the obvious blocker is often not the real one, and moving the wrong vehicle first can trap you in a state that needs a reset. Every puzzle can be solved, and the par score tells you how many single-space slides a tidy solution takes.</p>
<p>There is no timer, so you can sit and think. Use the undo button when you want to test an idea without committing, and use the reset button when a tangle has gone too far.</p>`,
  howTo: [
    'Press play and choose a puzzle from the strip below the board.',
    'Tap a car to slide it one space in its allowed direction. Drag further to slide it several spaces at once.',
    'Use the arrow keys after focusing a car with Tab if you prefer keyboard control.',
    'Clear the third row and slide the red car to the right-hand edge. It drives out automatically.',
    'Finish within par slides for a perfect solve, or use undo and reset freely while you learn the layout.',
  ],
  controls: [
    { action: 'Move a car one space', keys: 'Click or tap the car' },
    { action: 'Slide a car several spaces', keys: 'Drag along its axis' },
    { action: 'Keyboard play', keys: 'Tab to a car, then Arrow keys' },
    { action: 'Undo last move', keys: 'Z or Undo button' },
    { action: 'Reset puzzle', keys: 'R or Reset button' },
    { action: 'Pause', keys: 'P or Escape' },
    { action: 'Fullscreen', keys: 'F' },
  ],
  touchNote:
    'Tap-to-slide is the default on touch devices, and dragging a car moves it as far as your finger travels. The board scales to fit the screen, so all six rows stay visible in portrait.',
  features: [
    {
      title: 'Eight hand-built puzzles',
      text: 'Each layout introduces a new kind of blockage, from a single column to a full grid.',
    },
    {
      title: 'Par move scoring',
      text: 'Every puzzle has a target number of single-space slides. Beating it is the difference between solved and solved well.',
    },
    {
      title: 'Undo and reset',
      text: 'Experiment without consequence. Undo steps back one move; reset returns the lot to its starting layout.',
    },
    {
      title: 'Mouse, touch and keyboard',
      text: 'Tap, drag or use Tab and the arrow keys. The puzzle is fully playable without a mouse.',
    },
    {
      title: 'No timer',
      text: 'Think as long as you like. The only pressure is the move counter.',
    },
  ],
  tips: [
    {
      title: 'Count the exit row first',
      text: 'Look at row three from the red car to the exit. Every car in that line has to move, and each one needs somewhere to go.',
    },
    {
      title: 'Find the car with no options',
      text: 'A car that cannot move in either direction is usually the one holding the whole puzzle together. Free it first.',
    },
    {
      title: 'Work backwards',
      text: 'Start at the exit and trace the path the red car needs. The last blocker is often easier to identify than the first.',
    },
    {
      title: 'Do not shuffle for the sake of it',
      text: 'Every move that does not create space for the red car is probably wasted. Par rewards intention.',
    },
    {
      title: 'Use undo as a notebook',
      text: 'Test a move, see what opens, then undo. You lose nothing and learn the layout faster.',
    },
  ],
  faq: [
    {
      q: 'How many puzzles are in Parking Jam?',
      a: 'Eight. They start with a single blocker and finish with a full grid that needs a carefully ordered sequence.',
    },
    {
      q: 'Is there a time limit?',
      a: 'No. The only score is the number of slides you use. You can think for as long as you like.',
    },
    {
      q: 'Can I play with a keyboard?',
      a: 'Yes. Press Tab to move focus between cars, then use the arrow keys to slide the focused car along its axis.',
    },
    {
      q: 'What happens when I run out of moves?',
      a: 'Nothing — there is no move limit. If you get stuck, use undo to step back or reset to start the puzzle again.',
    },
    {
      q: 'Is Parking Jam the same as other games with that name?',
      a: 'No. This is an original GamesPlayLand puzzle with its own layouts. Other games with similar names are made by different developers.',
    },
  ],
  levelFocus: [
    { n: 1, name: 'First Jam', focus: 'One blocker in the exit row', par: '9 moves' },
    { n: 2, name: 'Two Deep', focus: 'Two columns to clear', par: '8 moves' },
    { n: 3, name: 'Wrong Order', focus: 'A horizontal car blocks the drop', par: '15 moves' },
    { n: 4, name: 'Column Lock', focus: 'Three locked columns', par: '13 moves' },
    { n: 5, name: 'Car Park Tangle', focus: 'A car that must move aside first', par: '13 moves' },
    { n: 6, name: 'Rush Hour', focus: 'The bottom row limits every drop', par: '13 moves' },
    { n: 7, name: 'Gridlock', focus: 'A hidden blocker below the exit row', par: '14 moves' },
    { n: 8, name: 'Full Grid', focus: 'A complete sequence with no slack', par: '14 moves' },
  ],
  related: ['parking-fury', 'parking-fury-2', 'parking-fury-3', 'free-drive', 'truck-parking', 'bus-parking'],
};
