import { getMoves, applyMove } from './engine.js'
import { rcOf } from './constants.js'

const VALUES = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }

export const BOT_LEVELS = {
  baby: 'Baby',
  regular: 'Regular',
  chainsaw: 'Chainsaw',
}

const noise = (n) => (Math.random() - 0.5) * n

function candidateMoves(state) {
  const out = []
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = state.board[r][c]
      if (!p || p.color !== state.turn) continue
      for (const m of getMoves(state, `${'abcdefgh'[c]}${'87654321'[r]}`)) {
        out.push({ from: `${'abcdefgh'[c]}${'87654321'[r]}`, to: m.to, move: m })
      }
    }
  }
  return out
}

function kingCaptureAvailable(state, defenderColor) {
  const attacker = defenderColor === 'w' ? 'b' : 'w'
  const probe = { ...state, turn: attacker }
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = state.board[r][c]
      if (!p || p.color !== attacker) continue
      const sq = `${'abcdefgh'[c]}${'87654321'[r]}`
      for (const m of getMoves(probe, sq)) {
        if (m.capture && state.board[rcOf(m.to).r]?.[rcOf(m.to).c]?.type === 'k') return true
      }
    }
  }
  return false
}

function evaluate(state, forColor) {
  let score = 0
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = state.board[r][c]
      if (p) score += (p.color === forColor ? 1 : -1) * VALUES[p.type]
    }
  }
  return score
}

function negamax(state, depth, alpha, beta) {
  const mover = state.turn
  if (state.winner) return (state.winner === mover ? 1 : -1) * (1e7 + depth)
  if (depth <= 0) return evaluate(state, mover)
  const moves = candidateMoves(state)
  if (moves.length === 0) return -1e7

  moves.sort((a, b) => (a.move.capture ? -1 : 1) - (b.move.capture ? -1 : 1))

  let best = -Infinity
  for (const cm of moves) {
    const { state: ns } = applyMove(state, cm.from, cm.to, cm.move)
    const v = -negamax(ns, depth - 1, -beta, -alpha)
    if (v > best) best = v
    if (best > alpha) alpha = best
    if (alpha >= beta) break
  }
  return best
}

function greedyScore(state, cm, me) {
  const { state: ns } = applyMove(state, cm.from, cm.to, cm.move)
  const mover = me ? me : state.turn
  if (ns.winner === mover) return 1e9
  if (ns.winner && ns.winner !== mover) return -1e9

  let sc = 0
  const target = state.board[rcOf(cm.to).r]?.[rcOf(cm.to).c]
  const merge = cm.move.isPower && cm.move.merge === true
  if (target && !merge) sc += VALUES[target.type] * 10
  if (merge) sc += 8

  const after = ns.board[rcOf(cm.to).r]?.[rcOf(cm.to).c]
  const wasPawn = state.board[rcOf(cm.from).r]?.[rcOf(cm.from).c]?.type === 'p'
  if (wasPawn && after && after.type === 'q') sc += 80

  if (state.gem && cm.to === state.gem.square) sc += 40
  if (ns.locked && ns.locked.owner === mover) sc += 25
  if (kingCaptureAvailable(ns, mover)) sc -= 400

  return sc + noise(3)
}

export function chooseBotMove(state, level = 'regular') {
  if (state.winner) return null
  const moves = candidateMoves(state)
  if (moves.length === 0) return null

  if (level === 'baby') {
    return moves[Math.floor(Math.random() * moves.length)]
  }

  if (level === 'chainsaw') {
    moves.sort((a, b) => (a.move.capture ? -1 : 1) - (b.move.capture ? -1 : 1))
    let best = null
    let bestScore = -Infinity
    for (const cm of moves) {
      const { state: ns } = applyMove(state, cm.from, cm.to, cm.move)
      const v = -negamax(ns, 1, -Infinity, Infinity) + Math.random() * 0.3
      if (best === null || v > bestScore) {
        bestScore = v
        best = cm
      }
    }
    return best
  }

  let best = null
  let bestScore = -Infinity
  for (const cm of moves) {
    const sc = greedyScore(state, cm, state.turn)
    if (best === null || sc > bestScore) {
      bestScore = sc
      best = cm
    }
  }
  return best
}