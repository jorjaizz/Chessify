import { pick } from './constants.js'

export const CAPTURE_LINES = [
  'YEET 💀',
  'Nap time 💤',
  'Bye bye 👋',
  'BEGONE 🫳',
  'CRUNCH 🥜',
  'Sacked! 📦',
  'No survivors 😤',
  'Piece of cake 🍰',
]

export const HORSE_LINES = [
  'YEEHAW 🤠',
  'Fast & Furious 🐴',
  'Never skip leg day 💪',
  'Galloping into battle 🐎',
  'TRAIL RIDE! 🔥',
  'Hooves of justice 🐴⚡',
]

export const KILL_LINES = {
  p: [
    'A PAWN did it. The most humble piece. 💀',
    'The pawn went full main character. 🎬🔪',
  ],
  n: [
    'The horse YEETED the King. 🤠💨',
    'L + horse, get rekt. 🐴',
  ],
  b: [
    'The priest smote the King. Amen. 🙏',
    'God answered. ⛪⚡',
  ],
  r: [
    'The tower flattened the throne room. 🏗️',
    'Heavy metal. 🎸💥',
  ],
  q: [
    'The Queen said "you". 💅',
    'Queen energy. Zero effort. 👑',
  ],
  k: [
    'Suicide King. Pure chaos. 🔥',
    'The Kings went 1v1. What a mess. 🤝',
  ],
  generic: ['THE KING IS DEAD ☠️'],
}

export const WIN_LINES = [
  'Take the crown 👑',
  'Long live the King... wait. 🤔',
  'Critical hit. Critical hit. ✨',
  'The court applauds. 👏',
]

export const MENU_LINES = [
  'Chess. The f*ck up edition.',
  'Every piece has a personal beef with the King.',
  'Legal chess? Never heard of her.',
  'No check. No mate. Just violence.',
  'The King wants to see you. Not like that.',
  'Strategy. Tactics. Absurdity.',
]

export function killLineFor(type) {
  const lines = KILL_LINES[type] || KILL_LINES.generic
  return pick(lines)
}

export function pickLine(arr) {
  return pick(arr)
}