export const FILES = 'abcdefgh'
export const RANKS = '87654321'

// Cada cuántos milisegundos aparece el cuadrado especial (la OLLA) en el tablero.
export const GEM_INTERVAL_MS = 30000

export const KNIGHT_DELTAS = [
  [-2, -1],
  [-2, 1],
  [-1, -2],
  [-1, 2],
  [1, -2],
  [1, 2],
  [2, -1],
  [2, 1],
]

export const BISHOP_DIRS = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
]

export const ROOK_DIRS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
]

export const KING_DIRS = [...BISHOP_DIRS, ...ROOK_DIRS]

export const TYPE_CODE = { p: 'P', n: 'N', b: 'B', r: 'R', q: 'Q', k: 'K' }

export const TYPE_UNICODE = { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚' }

export function isInBoard(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8
}

export function squareName(r, c) {
  return FILES[c] + RANKS[r]
}

export function rcOf(square) {
  return { r: RANKS.indexOf(square[1]), c: FILES.indexOf(square[0]) }
}

export function pieceCode(piece) {
  return (piece.color === 'w' ? 'w' : 'b') + TYPE_CODE[piece.type]
}

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function findByCode(board, code) {
  const wanted = code.slice(1).toLowerCase()
  const color = code[0]
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c]
      if (p && p.type === wanted && p.color === (color === 'w' ? 'w' : 'b')) {
        return squareName(r, c)
      }
    }
  }
  return null
}

export function hasAllyKnightAdjacent(board, r, c, color) {
  for (const [dr, dc] of ROOK_DIRS) {
    const nr = r + dr
    const nc = c + dc
    if (!isInBoard(nr, nc)) continue
    const target = board[nr][nc]
    if (target && target.color === color && target.type === 'n') return true
  }
  return false
}