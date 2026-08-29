import {
  isInBoard,
  squareName,
  rcOf,
  pieceCode,
  pick,
  findNearestEmptySquare,
  KNIGHT_DELTAS,
  BISHOP_DIRS,
  ROOK_DIRS,
  KING_DIRS,
} from './constants.js'
import { POWERS } from './powers.js'
import { CAPTURE_LINES, DISMOUNT_LINES, MOVE_LINES } from './messages.js'

const BACK_RANK = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']

function buildInitialBoard() {
  const board = Array.from({ length: 8 }, () => Array(8).fill(null))
  for (let c = 0; c < 8; c++) {
    board[0][c] = { type: BACK_RANK[c], color: 'b' }
    board[1][c] = { type: 'p', color: 'b' }
    board[6][c] = { type: 'p', color: 'w' }
    board[7][c] = { type: BACK_RANK[c], color: 'w' }
  }
  return board
}

function cloneBoard(board) {
  return board.map((row) => row.map((cell) => (cell ? { ...cell } : null)))
}

export function createInitialState() {
  return {
    board: buildInitialBoard(),
    turn: 'w',
    winner: null,
    killer: null,
    mounted: new Set(),
    mountedLeft: {},
    history: [],
    powerUsed: new Map(), // Track which pieces have used which powers: square -> powerId
  }
}

export function boardPosition(state) {
  const pos = {}
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = state.board[r][c]
      if (p) {
        const sq = squareName(r, c)
        pos[sq] =
          p.type === 'p' && state.mounted.has(sq)
            ? p.color === 'w'
              ? 'wC'
              : 'bC'
            : pieceCode(p)
      }
    }
  }
  return pos
}

export function getMoves(state, square) {
  const { r, c } = rcOf(square)
  if (!isInBoard(r, c)) return []
  const me = state.board[r][c]
  if (!me || me.color !== state.turn) return []

  const moves = []

  const pushFromDeltas = (paths, power) => {
    for (const [dr, dc] of paths) {
      const nr = r + dr
      const nc = c + dc
      if (!isInBoard(nr, nc)) continue
      const target = state.board[nr][nc]
      if (target && target.color === me.color) continue
      moves.push({
        from: square,
        to: squareName(nr, nc),
        capture: !!target,
        isPower: !!power,
        powerId: power ? power.id : null,
      })
    }
  }

  const pushSlides = (dirs, power) => {
    for (const [dr, dc] of dirs) {
      let nr = r + dr
      let nc = c + dc
      while (isInBoard(nr, nc)) {
        const target = state.board[nr][nc]
        if (target && target.color === me.color) break
        moves.push({
          from: square,
          to: squareName(nr, nc),
          capture: !!target,
          isPower: !!power,
          powerId: power ? power.id : null,
        })
        if (target) break
        nr += dr
        nc += dc
      }
    }
  }

  if (me.type === 'p') {
    const dir = me.color === 'w' ? -1 : 1
    const startRow = me.color === 'w' ? 6 : 1
    const oneAhead = state.board[r + dir] && state.board[r + dir][c]
    if (isInBoard(r + dir, c) && !oneAhead) {
      moves.push({ from: square, to: squareName(r + dir, c), capture: false })
      const twoAhead = state.board[r + 2 * dir] && state.board[r + 2 * dir][c]
      if (r === startRow && !twoAhead) {
        moves.push({ from: square, to: squareName(r + 2 * dir, c), capture: false })
      }
    }
    for (const dc of [-1, 1]) {
      const nr = r + dir
      const nc = c + dc
      if (!isInBoard(nr, nc)) continue
      const target = state.board[nr][nc]
      if (target && target.color !== me.color) {
        moves.push({ from: square, to: squareName(nr, nc), capture: true })
      }
    }
    if (state.mounted.has(square)) {
      for (const [dr, dc] of KNIGHT_DELTAS) {
        const nr = r + dr
        const nc = c + dc
        if (!isInBoard(nr, nc)) continue
        const target = state.board[nr][nc]
        if (target && target.color === me.color) continue
        moves.push({
          from: square,
          to: squareName(nr, nc),
          capture: !!target,
          isPower: false,
          powerId: null,
        })
      }
    }
  } else if (me.type === 'n') {
    pushFromDeltas(KNIGHT_DELTAS)
  } else if (me.type === 'b') {
    pushSlides(BISHOP_DIRS)
  } else if (me.type === 'r') {
    pushSlides(ROOK_DIRS)
  } else if (me.type === 'q') {
    pushSlides(KING_DIRS)
  } else if (me.type === 'k') {
    pushFromDeltas(KING_DIRS)
  }

  for (const power of POWERS) {
    for (const extra of power.getMoves(state, square, me)) {
      moves.push(extra)
    }
  }

  return moves
}

export function applyMove(inputState, from, to, move) {
  const state = {
    ...inputState,
    board: cloneBoard(inputState.board),
    mounted: new Set(inputState.mounted),
    mountedLeft: { ...inputState.mountedLeft },
    history: [...inputState.history],
    powerUsed: new Map(inputState.powerUsed), // Clone the powerUsed map
  }

  const { r, c } = rcOf(from)
  const { r: tr, c: tc } = rcOf(to)

  const me = state.board[r][c]
  const capSq = move.kickTarget || to
  const { r: cr, c: cc } = rcOf(capSq)
  const target = state.board[cr][cc]
  const wasMounted = state.mounted.has(from)

  const events = { messages: [], sounds: [] }
  let capturedKing = false
  const isMerge = move.isPower && move.merge === true

  if (target) {
    capturedKing = target.type === 'k'
    if (capturedKing) {
      state.winner = me.color
      state.killer = { ...me, square: from }
    } else if (!isMerge) {
      events.sounds.push('capture')
      if (!move.isPower) {
        events.messages.push({ text: pick(CAPTURE_LINES), kind: 'capture' })
      }
    }
    state.board[cr][cc] = null
    state.mounted.delete(capSq)
    delete state.mountedLeft[capSq]
  }

  state.board[tr][tc] = me
  state.board[r][c] = null

  let promotedToQueen = false
  if (me.type === 'p' && (tr === 0 || tr === 7) && !wasMounted && !isMerge) {
    state.board[tr][tc] = { type: 'q', color: me.color }
    promotedToQueen = true
  }

  if (wasMounted || move.isPower) {
    state.mounted.delete(from)
    const leftover = state.mountedLeft[from]
    delete state.mountedLeft[from]
    if (!promotedToQueen && me.type === 'p') state.mounted.add(to)
    if (move.isPower) {
      const power = POWERS.find((p) => p.id === move.powerId)
      if (power && power.afterMove) {
        power.afterMove(state, from, to, events, me)
      }
      // Track that this piece used a power at its new location
      state.powerUsed.set(to, move.powerId)
      events.sounds.push('power')
    } else {
      if (leftover && !promotedToQueen) state.mountedLeft[to] = leftover
    }
  } else {
    events.sounds.push('move')
  }

  // Check if a king was captured by a power move (e.g., faithful_prayer)
  if (move.isPower && !capturedKing) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = state.board[r][c]
        if (piece && piece.type === 'k' && piece.color !== me.color) {
          // King is still on the board, no capture by power
          continue
        }
      }
    }
    // Check if enemy king is missing
    const enemyColor = me.color === 'w' ? 'b' : 'w'
    let enemyKingFound = false
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = state.board[r][c]
        if (piece && piece.type === 'k' && piece.color === enemyColor) {
          enemyKingFound = true
          break
        }
      }
      if (enemyKingFound) break
    }
    if (!enemyKingFound) {
      capturedKing = true
      state.winner = me.color
      state.killer = { ...me, square: from }
      events.sounds.push('victory')
    }
  }

  for (const sq of [...state.mounted]) {
    if (move.isPower && sq === to) continue
    const sr = rcOf(sq)
    const cell = state.board[sr.r]?.[sr.c]
    if (!cell || cell.color !== me.color) continue
    const left = (state.mountedLeft[sq] ?? 0) - 1
    if (left <= 0) {
      const color = cell.color
      state.mounted.delete(sq)
      delete state.mountedLeft[sq]
      state.board[sr.r][sr.c] = { type: 'n', color }
      const eject = findNearestEmptySquare(state.board, sr.r, sr.c)
      if (eject) {
        const er = rcOf(eject)
        state.board[er.r][er.c] =
          er.r === 0 || er.r === 7 ? { type: 'q', color } : { type: 'p', color }
      }
      events.messages.push({ text: pick(DISMOUNT_LINES), kind: 'info' })
      events.sounds.push('dismount')
    } else {
      state.mountedLeft[sq] = left
    }
  }

  if (capturedKing) {
    events.sounds.push('victory')
  }

  state.turn = me.color === 'w' ? 'b' : 'w'

  state.history.push({
    from,
    to,
    piece: { ...me },
    captured: target && !isMerge ? { ...target } : null,
    power: move.isPower ? move.powerId : null,
    capturedKing,
    comment: events.messages.length > 0 ? events.messages[events.messages.length - 1].text : pick(MOVE_LINES),
  })

  return { state, events }
}