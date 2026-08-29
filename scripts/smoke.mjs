import assert from 'node:assert/strict'
import { createInitialState, getMoves, applyMove, boardPosition } from '../src/game/engine.js'
import { rcOf } from '../src/game/constants.js'

let state = createInitialState()

{
  const e2 = getMoves(state, 'e2')
  assert.ok(!e2.some((m) => m.isPower), 'center pawn e2 has no knight touching it at start')
  const b2 = getMoves(state, 'b2')
  const base = b2.filter((m) => !m.isPower)
  const power = b2.filter((m) => m.isPower)
  assert.equal(base.length, 2, 'b2 pawn should have 2 standard moves')
  assert.ok(base.some((m) => m.to === 'b4'), 'double step to b4')
  assert.equal(power.length, 1, 'b2 touches the b1 knight, so HORSE RIDE offers one merge target')
  assert.equal(power[0].to, 'b1', 'the merge target is the allied knight square')
  assert.equal(power[0].merge, true, 'the move is a literal merge, not a knight jump')
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
  state.board[5][3] = { type: 'n', color: 'w' }
  const moves = getMoves(state, 'd4')
  const knightMoves = moves.filter((m) => m.isPower)
  assert.equal(knightMoves.length, 1, `exactly one merge target, got ${knightMoves.length}`)
  assert.equal(knightMoves[0].to, 'd3', 'pawn merges onto the adjacent knight')
  const res = applyMove(state, 'd4', 'd3', knightMoves[0])
  state = res.state
  assert.ok(state.mounted.has('d3'), 'pawn is now mounted')
  assert.equal(state.mountedLeft['d3'], 2, 'ride starts with 2 turns remaining')
  assert.equal(boardPosition(state)['d3'], 'wC', 'board shows a single centaur while mounted')
  assert.equal(state.board[5][3].type, 'p', 'the pawn sits on the knight square')
  assert.equal(state.board[4][3], null, 'the pawn left its origin square')
  let whiteKnights = 0
  for (const row of state.board) {
    for (const cell of row) {
      if (cell && cell.type === 'n' && cell.color === 'w') whiteKnights++
    }
  }
  assert.equal(whiteKnights, 2, 'the mount knight is absorbed, only the b1/g1 knights remain')
  assert.equal(state.turn, 'b', 'turn flips after power')
}

{
  const mountedSquare = [...state.mounted][0]
  assert.equal(state.mountedLeft[mountedSquare], 2, 'setup: 2 turns left')
  state = { ...state, turn: 'w' }
  const safeRide = (sq) =>
    getMoves(state, sq).find(
      (m) => !m.isPower && !m.capture && rcOf(m.to).r > 0 && rcOf(m.to).r < 7
    )
  const ride1 = safeRide(mountedSquare)
  assert.ok(ride1, 'mounted pawn gets normal knight moves')
  let r = applyMove(state, mountedSquare, ride1.to, ride1)
  state = r.state
  const sq1 = [...state.mounted][0]
  assert.equal(state.mountedLeft[sq1], 1, 'countdown ticks to 1 on 1st owned turn')
  const blackMove = getMoves(state, 'e7').find((m) => m.to === 'e5')
  assert.ok(blackMove, 'black can reply e7-e5')
  r = applyMove(state, 'e7', 'e5', blackMove)
  state = r.state
  assert.equal(Object.values(state.mountedLeft)[0], 1, 'enemy turn does not consume the ride')
  const sq2 = [...state.mounted][0]
  const ride2 = safeRide(sq2)
  assert.ok(ride2, 'still rides on the 2nd turn')
  r = applyMove(state, sq2, ride2.to, ride2)
  state = r.state
  assert.equal(state.mounted.size, 0, 'pawn dismounts after its 2nd carried turn')
  assert.equal(Object.keys(state.mountedLeft).length, 0, 'no ride countdown left')
  const { r: sr, c: sc } = rcOf(ride2.to)
  assert.equal(state.board[sr][sc].type, 'n', 'the knight stays where the rider stopped')
  assert.equal(state.board[sr][sc].color, 'w', 'knight keeps the rider color')
  let wP = 0
  let wN = 0
  for (const row of state.board) {
    for (const cell of row) {
      if (!cell || cell.color !== 'w') continue
      if (cell.type === 'p') wP++
      if (cell.type === 'n') wN++
    }
  }
  assert.equal(wP, 9, 'the pawn hops off to a free square and stays a pawn')
  assert.equal(wN, 3, 'the mount knight rejoins the board after the split')
  assert.ok(r.events.messages.length > 0, 'dismount reports a message')
}

{
  const pro = createInitialState()
  pro.board[0][2] = null
  pro.board[1][2] = { type: 'p', color: 'w' }
  pro.mounted = new Set(['c7'])
  pro.mountedLeft = { c7: 1 }
  const m = getMoves(pro, 'c7').find((x) => x.to === 'c8')
  assert.ok(m, 'mounted pawn at c7 can jump to c8')
  const r = applyMove(pro, 'c7', 'c8', m)
  assert.equal(r.state.board[0][2].type, 'n', 'no promotion while riding: the knight ends the ride on c8')
  assert.equal(r.state.mounted.size, 0, 'the single carried turn spent the ride and it dismounted')
  assert.equal(Object.keys(r.state.mountedLeft).length, 0, 'no stale countdown after promotion')
  assert.equal(r.state.board[1][2].type, 'p', 'the pawn hops back off to the free square')
}

{
  const cap = createInitialState()
  cap.board[3][3] = { type: 'p', color: 'w' }
  cap.board[2][1] = { type: 'n', color: 'b' }
  cap.mounted = new Set(['d5'])
  cap.mountedLeft = { d5: 2 }
  cap.turn = 'b'
  const moves = getMoves(cap, 'b6')
  const hit = moves.find((m) => m.to === 'd5' && m.capture)
  assert.ok(hit, 'black knight can capture the mounted pawn')
  const r = applyMove(cap, 'b6', 'd5', hit)
  assert.equal(r.state.board[3][3].type, 'n', 'knight lands on d5')
  assert.equal(r.state.mounted.size, 0, 'captured pawn leaves no mount state behind')
  assert.equal(Object.keys(r.state.mountedLeft).length, 0, 'no countdown left after capture')
  assert.equal(boardPosition(r.state).d5, 'bN', 'capturer is not rendered as a centaur')
  let whiteKnights = 0
  for (const row of r.state.board) {
    for (const cell of row) {
      if (cell && cell.type === 'n' && cell.color === 'w') whiteKnights++
    }
  }
  assert.equal(whiteKnights, 2, 'a captured centaur splits forever: no knight respawns')
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

{
  const rk = createInitialState()
  rk.board[6][0] = null
  const a1 = getMoves(rk, 'a1')
  assert.ok(a1.some((m) => m.to === 'a3'), 'rook slides past a cleared a2')
  assert.ok(!a1.some((m) => m.to === 'b1'), 'rook ray stops at its own knight on b1')
  assert.ok(!a1.some((m) => m.to === 'b2'), 'rook never lands on or beyond the own piece')
}

{
  const q = createInitialState()
  q.board[6][3] = null
  const d1 = getMoves(q, 'd1')
  assert.ok(!d1.some((m) => m.to === 'c1'), 'queen cannot eat its own bishop')
  assert.ok(!d1.some((m) => m.to === 'e1'), 'queen cannot eat its own king')
  assert.ok(d1.some((m) => m.to === 'd3'), 'queen still slides over empty squares')
}

{
  const bi = createInitialState()
  bi.board[6][3] = null
  const c1 = getMoves(bi, 'c1')
  assert.ok(c1.some((m) => m.to === 'e3'), 'bishop slides when the path is clear')
  assert.ok(!c1.some((m) => m.to === 'b2'), 'bishop stops at its own pawn on b2')
}

{
  const kg = createInitialState()
  assert.ok(!getMoves(kg, 'e1').some((m) => m.to === 'e2'), 'king cannot capture its own pawn')
}

{
  const kk = createInitialState()
  kk.board[4][3] = { type: 'n', color: 'w' }
  kk.board[3][5] = { type: 'r', color: 'b' }
  kk.turn = 'w'
  const kick = getMoves(kk, 'd4').filter((m) => m.isPower && m.powerId === 'kick')
  assert.equal(kick.length, 1, `knight at d4 kicks the rook at f5, got ${kick.length}`)
  assert.equal(kick[0].to, 'e5', 'the lunge lands on the middle square e5 (diagonal toward f5)')
  assert.equal(kick[0].kickTarget, 'f5', 'the victim square is recorded')
  assert.equal(kick[0].capture, true, 'a kick is a capture')
  const r = applyMove(kk, 'd4', 'e5', kick[0])
  assert.equal(r.state.board[3][5], null, 'the rook at f5 is destroyed by the kick')
  assert.equal(r.state.board[3][4].type, 'n', 'the knight lunged to e5')
  assert.equal(r.state.board[3][4].color, 'w', 'knight keeps its color')
  assert.equal(r.state.board[4][3], null, 'knight left d4')
  assert.equal(r.state.turn, 'b', 'turn flips after the kick')
  const nestedKick = r.state.board[3][4]
  assert.ok(r.state.mountedLeft[nestedKick] === undefined, 'a kicking knight is never mounted')
  assert.ok(r.events.sounds.includes('neigh'), 'kick plays the placeholder relincho')
}

{
  const inner = createInitialState()
  inner.board[4][3] = { type: 'n', color: 'w' }
  inner.board[3][4] = { type: 'b', color: 'b' }
  inner.turn = 'w'
  const kick = getMoves(inner, 'd4').filter((m) => m.powerId === 'kick')
  assert.equal(kick.length, 1, `internal enemy on e5 (right side) is kickable, got ${kick.length}`)
  assert.equal(kick[0].to, 'e5', 'single-axis kick lands on the victim square itself')
  assert.equal(kick[0].kickTarget, 'e5', 'single-axis victim is its own target')
  const r = applyMove(inner, 'd4', 'e5', kick[0])
  assert.equal(r.state.board[3][4].type, 'n', 'knight occupies the vacated e5')
}

{
  const diag = createInitialState()
  diag.board[4][3] = { type: 'n', color: 'w' }
  diag.board[3][4] = { type: 'p', color: 'b' }
  diag.turn = 'w'
  const kick = getMoves(diag, 'd4').filter((m) => m.powerId === 'kick')
  assert.equal(kick.length, 1, `internal diagonal enemy on e5 is kickable, got ${kick.length}`)
  assert.equal(kick[0].to, 'e5', 'diagonal internal kick lands on the victim square')
  assert.equal(kick[0].kickTarget, 'e5', 'diagonal internal victim is its own target')
}

{
  const blocked = createInitialState()
  blocked.board[4][3] = { type: 'n', color: 'w' }
  blocked.board[3][5] = { type: 'r', color: 'b' }
  blocked.board[3][4] = { type: 'p', color: 'w' }
  blocked.turn = 'w'
  const kicks = getMoves(blocked, 'd4')
    .filter((m) => m.isPower && m.powerId === 'kick')
    .map((m) => m.kickTarget)
  assert.ok(!kicks.includes('f5'), 'a victim whose middle square is occupied cannot be kicked')
}

{
  const mountedKick = createInitialState()
  mountedKick.board[4][3] = { type: 'n', color: 'w' }
  mountedKick.board[3][4] = { type: 'p', color: 'b' }
  mountedKick.mounted = new Set(['e5'])
  mountedKick.mountedLeft = { e5: 1 }
  mountedKick.turn = 'w'
  const kick = getMoves(mountedKick, 'd4').filter((m) => m.powerId === 'kick')
  assert.ok(kick.length === 1, 'a mounted enemy pawn can be kicked')
  const r = applyMove(mountedKick, 'd4', 'e5', kick[0])
  assert.equal(r.state.board[3][4].type, 'n', 'knight lands on the kicked mount square')
  assert.equal(r.state.mounted.size, 0, 'kicked mount leaves no mount state behind')
  assert.equal(Object.keys(r.state.mountedLeft).length, 0, 'no countdown left for the kicked mount')
}

{
  const kingKick = createInitialState()
  kingKick.board[4][3] = { type: 'n', color: 'w' }
  kingKick.board[3][4] = { type: 'k', color: 'b' }
  kingKick.turn = 'w'
  const kick = getMoves(kingKick, 'd4').filter((m) => m.powerId === 'kick')
  assert.ok(kick.length === 1, 'the enemy king inside the circle can be kicked')
  const { state: ns } = applyMove(kingKick, 'd4', 'e5', kick[0])
  assert.equal(ns.winner, 'w', 'kicking the king wins the game')
  assert.equal(ns.killer.type, 'n', 'the killer is the knight')
  assert.equal(ns.killer.square, 'd4', 'the kill is credited to the knight origin square')
}

{
  const neighbors = createInitialState()
  neighbors.board[3][4] = { type: 'n', color: 'w' }
  neighbors.board[3][5] = { type: 'p', color: 'w' }
  neighbors.board[7][7] = { type: 'r', color: 'b' }
  for (let c = 2; c <= 6; c++) {
    neighbors.board[0][c] = null
    neighbors.board[1][c] = null
  }
  neighbors.turn = 'w'
  const kick = getMoves(neighbors, 'e5').filter((m) => m.powerId === 'kick')
  assert.equal(kick.length, 0, 'a knight cannot kick its own pieces')
}

console.log('All engine smoke tests passed ✅')