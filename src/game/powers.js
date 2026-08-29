import { ROOK_DIRS, KING_DIRS, KNIGHT_DELTAS, isInBoard, squareName, rcOf, hasAllyKnightAdjacent, pick } from './constants.js'
import { HORSE_LINES, KICK_LINES } from './messages.js'

const KICK_AREA = [...KING_DIRS, ...KNIGHT_DELTAS]

function lungeStep(dr, dc) {
  const sr = dr === 0 ? 0 : dr / Math.abs(dr)
  const sc = dc === 0 ? 0 : dc / Math.abs(dc)
  return [sr, sc]
}

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
  {
    id: 'kick',
    name: 'KICK',
    icon: '🦵',
    pieceTypes: ['n'],
    blurb:
      'A knight rears up and kicks any enemy piece inside its circle — even ones it can never reach with an L — destroying it and lunging one square toward the impact.',
    details:
      'Click an eligible knight, grab the KICK pill and drop it onto an enemy piece in the knight circle (the 8 jump squares plus the 8 inner squares). The enemy is destroyed with a relincho, then the knight lunges one square toward the middle between itself and the victim.',
    canUse(state, square, me) {
      if (!me || me.type !== 'n') return false
      if (me.color !== state.turn) return false
      return this.getMoves(state, square, me).length > 0
    },
    getMoves(state, square, me) {
      if (!me || me.type !== 'n') return []
      if (me.color !== state.turn) return []
      const { r, c } = rcOf(square)
      const out = []
      for (const [dr, dc] of KICK_AREA) {
        const nr = r + dr
        const nc = c + dc
        if (!isInBoard(nr, nc)) continue
        const target = state.board[nr][nc]
        if (!target || target.color === me.color) continue
        const [lr, lc] = lungeStep(dr, dc)
        const ar = r + lr
        const ac = c + lc
        if (!isInBoard(ar, ac)) continue
        const landingTarget = state.board[ar][ac]
        if (landingTarget && (ar !== nr || ac !== nc)) continue
        out.push({
          from: square,
          to: squareName(ar, ac),
          capture: true,
          isPower: true,
          powerId: this.id,
          kickTarget: squareName(nr, nc),
        })
      }
      return out
    },
    afterMove(state, from, to, events) {
      events.sounds.push('neigh')
      events.messages.push({ text: pick(KICK_LINES), kind: 'power' })
      return events
    },
  },
]

export function getPowerByName(id) {
  return POWERS.find((p) => p.id === id)
}