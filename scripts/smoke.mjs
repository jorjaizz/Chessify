import assert from 'node:assert/strict'
import { createInitialState, getMoves, applyMove } from '../src/game/engine.js'

let state = createInitialState()

{
  const e2 = getMoves(state, 'e2')
  const base = e2.filter((m) => !m.isPower)
  const power = e2.filter((m) => m.isPower)
  assert.equal(base.length, 2, 'e2 pawn should have 2 standard moves')
  assert.ok(base.some((m) => m.to === 'e4'), 'double step to e4')
  assert.ok(power.length > 0, 'e2 is adjacent to the g1 knight, so HORSE RIDE applies')
  assert.ok(power.some((m) => m.to === 'c3') && power.some((m) => m.to === 'g3'), 'knight jumps from e2')
}

{
  const g1 = getMoves(state, 'g1')
  assert.ok(g1.some((m) => m.to === 'f3') && g1.some((m) => m.to === 'h3'), 'knight jumps')
}

{
  let res = applyMove(state, 'e2', 'e4', getMoves(state, 'e2').find((m) => m.to === 'e4'))
  state = res.state
  assert.equal(state.turn, 'b', 'turn flips to black')
  assert.equal(res.state.board[4][4].type, 'p')
}

{
  state = createInitialState()
  state.board[4][3] = { type: 'p', color: 'w' }
  state.board[2][2] = { type: 'n', color: 'w' }
  const moves = getMoves(state, 'd4')
  const knightMoves = moves.filter((m) => m.isPower)
  assert.ok(knightMoves.length > 0, `horse ride should enable knight moves, got ${moves.length}`)
  assert.ok(knightMoves.some((m) => m.to === 'e6'), 'd4 pawn rides to e6')
}

{
  const res = applyMove(state, 'd4', 'e6', getMoves(state, 'd4').find((m) => m.to === 'e6'))
  state = res.state
  assert.ok(state.mounted.has('e6'), 'pawn is now mounted on e6')
  assert.equal(state.turn, 'b', 'turn flips after power')
  const again = getMoves(state, 'e6')
  assert.equal(again.length, 0, 'black to move: white pawn must not move')
}

{
  assert.ok(state.mounted.has('e6'), 'setup for black turn')
  state = { ...state, turn: 'w' }
  const moves = getMoves(state, 'e6')
  assert.ok(moves.some((m) => m.isPower), 'mounted pawn keeps knight moves')
}

{
  const mk = createInitialState()
  mk.board[4][4] = { type: 'k', color: 'b' }
  mk.board[4][0] = null
  mk.board[4][3] = { type: 'r', color: 'w' }
  mk.turn = 'w'
  const moves = getMoves(mk, 'd4')
  const kill = moves.find((m) => m.to === 'e4')
  assert.ok(kill, 'rook can capture the king')
  const { state: ns } = applyMove(mk, 'd4', 'e4', kill)
  assert.equal(ns.winner, 'w', 'capturing king wins the game')
  assert.equal(ns.killer.type, 'r')
}

{
  const pr = createInitialState()
  pr.board[0][4] = null
  pr.board[1][4] = { type: 'p', color: 'w' }
  pr.turn = 'w'
  const moves = getMoves(pr, 'e7')
  const prom = moves.find((m) => m.to === 'e8')
  assert.ok(prom, 'white pawn at e7 can move to e8')
  const { state: ns } = applyMove(pr, 'e7', 'e8', prom)
  assert.equal(ns.board[0][4].type, 'q', 'pawn auto-promotes to queen')
}

console.log('All engine smoke tests passed ✅')