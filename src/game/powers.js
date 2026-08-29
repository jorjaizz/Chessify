import { KNIGHT_DELTAS, isInBoard, squareName, rcOf, hasAllyKnightAdjacent, pick } from './constants.js'
import { HORSE_LINES } from './messages.js'

export const POWERS = [
  {
    id: 'horseride',
    name: 'HORSE RIDE',
    icon: '🤠',
    blurb:
      'A pawn touching an allied knight mounts it and moves like a knight forever (shown riding the horse).',
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
      for (const [dr, dc] of KNIGHT_DELTAS) {
        const nr = r + dr
        const nc = c + dc
        if (!isInBoard(nr, nc)) continue
        const target = state.board[nr][nc]
        if (target && target.color === me.color) continue
        out.push({
          from: square,
          to: squareName(nr, nc),
          capture: !!target,
          isPower: true,
          powerId: this.id,
        })
      }
      return out
    },
    afterMove(state, from, to, events) {
      events.messages.push({ text: pick(HORSE_LINES), kind: 'power' })
      return events
    },
  },
]

export function getPowerByName(id) {
  return POWERS.find((p) => p.id === id)
}