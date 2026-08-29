import { ROOK_DIRS, isInBoard, squareName, rcOf, hasAllyKnightAdjacent, pick } from './constants.js'
import { HORSE_LINES } from './messages.js'

export const POWERS = [
  {
    id: 'horseride',
    name: 'HORSE RIDE',
    icon: '🤠',
    pieceTypes: ['p'],
    blurb:
      'A pawn touching an allied knight jumps on — they merge into one centaur that rides like a knight for 2 of your turns, then split apart.',
    details:
      'Click an eligible pawn (it flashes), grab the HORSE RIDE pill and drop it onto the allied knight. The pair fuses into a single mounted piece that moves like a knight for your next 2 turns. When the ride ends they split: the knight stays put and the pawn hops off to the nearest free square.',
    canUse(state, square, me) {
      if (!me || me.type !== 'p') return false
      if (me.color !== state.turn) return false
      if (state.mounted.has(square)) return false
      const { r, c } = rcOf(square)
      return hasAllyKnightAdjacent(state.board, r, c, me.color)
    },
    getMoves(state, square, me) {
      if (!this.canUse(state, square, me)) return []
      const { r, c } = rcOf(square)
      const out = []
      for (const [dr, dc] of ROOK_DIRS) {
        const nr = r + dr
        const nc = c + dc
        if (!isInBoard(nr, nc)) continue
        const knight = state.board[nr][nc]
        if (knight && knight.color === me.color && knight.type === 'n') {
          out.push({
            from: square,
            to: squareName(nr, nc),
            capture: false,
            isPower: true,
            powerId: this.id,
            merge: true,
          })
        }
      }
      return out
    },
    afterMove(state, from, to, events) {
      state.mountedLeft[to] = 2
      events.sounds.push('neigh')
      events.messages.push({ text: pick(HORSE_LINES), kind: 'power' })
      return events
    },
  },
]

export function getPowerByName(id) {
  return POWERS.find((p) => p.id === id)
}