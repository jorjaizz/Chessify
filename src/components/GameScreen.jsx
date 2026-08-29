import { useEffect, useRef, useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { AnimatePresence, motion } from 'framer-motion'
import { createInitialState, getMoves, applyMove, boardPosition } from '../game/engine.js'
import { rcOf, squareName } from '../game/constants.js'
import { POWERS } from '../game/powers.js'
import { sfx } from '../game/sound.js'
import Stamp from './Stamp.jsx'
import GameOver from './GameOver.jsx'
import MountedPiece from './MountedPiece.jsx'

function useBoardWidth() {
  const ref = useRef(null)
  const [width, setWidth] = useState(560)
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const update = () => setWidth(Math.min(el.clientWidth, 560))
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, width]
}

function eligibleAbilities(game) {
  const squares = new Set()
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = game.board[r][c]
      if (!p || p.color !== game.turn) continue
      const sq = squareName(r, c)
      for (const power of POWERS) {
        const usefulOnMounted = !(power.id === 'horseride' && game.mounted.has(sq))
        if (usefulOnMounted && power.canUse(game, sq, p)) {
          squares.add(sq)
          break
        }
      }
    }
  }
  return squares
}

function abilitiesFor(game, square) {
  const { r, c } = rcOf(square)
  const me = game.board[r][c]
  if (!me) return []
  return POWERS.filter((p) => {
    const usefulOnMounted = !(p.id === 'horseride' && game.mounted.has(square))
    return usefulOnMounted && p.canUse(game, square, me)
  })
}

function buildSquareStyles(game, selected, activePower) {
  const styles = {}
  if (!selected) return styles
  const moves = getMoves(game, selected)
  const armed = activePower
    ? moves.filter((m) => m.isPower && m.powerId === activePower.id)
    : null
  styles[selected] = { backgroundColor: 'rgba(198,255,61,0.16)' }
  const list = armed || moves
  for (const m of list) {
    if (armed || m.isPower) {
      styles[m.to] = {
        boxShadow: 'inset 0 0 0 2px #C6FF3D',
        backgroundColor: 'rgba(198,255,61,0.14)',
      }
    } else if (m.capture) {
      styles[m.to] = {
        boxShadow: 'inset 0 0 0 2px #FF3366',
        backgroundColor: 'rgba(255,51,102,0.10)',
      }
    } else {
      styles[m.to] = {
        boxShadow: 'inset 0 0 0 2px rgba(237,234,225,0.55)',
        backgroundColor: 'transparent',
      }
    }
  }
  return styles
}

const customPieces = {
  wC: ({ squareWidth }) => <MountedPiece color="w" squareWidth={squareWidth} />,
  bC: ({ squareWidth }) => <MountedPiece color="b" squareWidth={squareWidth} />,
}

export default function GameScreen({ onMenu }) {
  const [game, setGame] = useState(createInitialState)
  const [selected, setSelected] = useState(null)
  const [activePower, setActivePower] = useState(null)
  const [toast, setToast] = useState(null)
  const toastKey = useRef(0)
  const [boardWrapRef, boardWidth] = useBoardWidth()

  function announce(events) {
    if (!events) return
    for (const s of events.sounds) {
      const fn = sfx[s]
      if (fn) fn()
    }
    const msg = events.messages[events.messages.length - 1]
    if (msg) {
      toastKey.current += 1
      setToast({ ...msg, key: toastKey.current })
    }
  }

  function execute(move) {
    if (!move) return false
    const { state, events } = applyMove(game, move.from, move.to, move)
    setGame(state)
    announce(events)
    setSelected(null)
    setActivePower(null)
    return true
  }

  function onPieceDrop(sourceSquare, targetSquare) {
    if (game.winner) return false
    const all = getMoves(game, sourceSquare)
    const move = activePower && activePower.square === sourceSquare
      ? all.filter((m) => m.isPower && m.powerId === activePower.id).find((m) => m.to === targetSquare)
      : all.find((m) => m.to === targetSquare)
    if (!move) return false
    return execute(move)
  }

  function onSquareClick(square) {
    if (game.winner) return
    if (activePower) {
      const m = getMoves(game, activePower.square).find(
        (x) => x.isPower && x.powerId === activePower.id && x.to === square
      )
      if (m) {
        execute(m)
        return
      }
      setActivePower(null)
    }
    if (selected && selected !== square) {
      const m = getMoves(game, selected).find((x) => x.to === square)
      if (m && !m.isPower) {
        execute(m)
        return
      }
    }
    const cell = game.board[rcOf(square).r]?.[rcOf(square).c]
    setSelected(cell && cell.color === game.turn ? square : null)
  }

  function armPower(id) {
    if (!selected) return
    sfx.click()
    setActivePower({ id, square: selected })
  }

  function reset() {
    setGame(createInitialState())
    setSelected(null)
    setActivePower(null)
    setToast(null)
    sfx.click()
  }

  const flashSquares = eligibleAbilities(game)
  const selectedAbilities = selected ? abilitiesFor(game, selected) : []
  const styles = buildSquareStyles(game, selected, activePower)
  const turnName = game.winner ? null : game.turn === 'w' ? 'WHITE' : 'BLACK'
  const armedPower = activePower ? POWERS.find((p) => p.id === activePower.id) : null

  return (
    <div className="grain-bg relative flex min-h-screen flex-col items-center gap-4 bg-ink px-4 py-6">
      <div className="flex w-full max-w-[560px] items-center justify-between font-mono text-xs uppercase tracking-widest">
        <button
          onClick={() => {
            sfx.click()
            onMenu()
          }}
          className="text-muted transition-colors hover:text-volt"
        >
          Chessify
        </button>
        <button
          onClick={reset}
          className="text-muted transition-colors hover:text-riot"
        >
          New game
        </button>
      </div>

      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
        {turnName ? (
          <>
            <span className={`inline-block h-2 w-2 rounded-full ${game.turn === 'w' ? 'bg-paper' : 'bg-riot'}`} />
            {turnName} to move
          </>
        ) : (
          <span className="text-paper">game over</span>
        )}
      </div>

      <div ref={boardWrapRef} className="relative w-full max-w-[560px]">
        <div className="relative rounded-sm border-2 border-ink-2 bg-ink-2 p-2">
          {['-left-[3px] -top-[3px] border-l-2 border-t-2', '-right-[3px] -top-[3px] border-r-2 border-t-2', '-left-[3px] -bottom-[3px] border-l-2 border-b-2', '-right-[3px] -bottom-[3px] border-r-2 border-b-2'].map((pos) => (
            <span key={pos} className={`pointer-events-none absolute h-4 w-4 border-volt ${pos}`} />
          ))}
          <Chessboard
            id="chessify-board"
            position={boardPosition(game)}
            boardOrientation="white"
            boardWidth={boardWidth}
            onPieceDrop={onPieceDrop}
            onPieceDragBegin={(piece, sourceSquare) => {
              setSelected(sourceSquare)
              setActivePower(null)
            }}
            onPieceDragEnd={() => setSelected(null)}
            onSquareClick={onSquareClick}
            customDndBackend={HTML5Backend}
            customSquareStyles={styles}
            customPieces={customPieces}
            customDarkSquareStyle={{ backgroundColor: '#2B2D33' }}
            customLightSquareStyle={{ backgroundColor: '#EDEAE1' }}
            customDropSquareStyle={{ boxShadow: 'inset 0 0 0 2px rgba(198,255,61,0.8)' }}
            animationDuration={160}
            autoPromoteToQueen
          />
        </div>

        <div
          className="pointer-events-none absolute"
          style={{ left: 10, top: 10, width: boardWidth, height: boardWidth }}
        >
          {[...flashSquares].map((sq) => {
            const { r, c } = rcOf(sq)
            return (
              <span
                key={sq}
                className="ability-cell"
                style={{ left: `${c * 12.5}%`, top: `${r * 12.5}%`, width: '12.5%', height: '12.5%' }}
              >
                <span className="ability-ring" />
              </span>
            )
          })}
        </div>

        <AnimatePresence>
          {game.winner && (
            <GameOver
              key="gameover"
              winner={game.winner}
              killer={game.killer}
              onRestart={reset}
              onMenu={onMenu}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="relative mt-1 flex h-12 w-full max-w-[560px] items-center justify-center">
        <AnimatePresence mode="wait">
          {toast && <Stamp key={toast.key} text={toast.text} kind={toast.kind} />}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {(armedPower || selectedAbilities.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute left-1/2 top-24 z-20 w-72 -translate-x-1/2"
          >
            {armedPower ? (
              <div className="flex items-center justify-between rounded-sm border-2 border-volt bg-ink-2 px-4 py-2.5">
                <span className="font-mono text-xs uppercase tracking-wide text-paper">
                  {armedPower.icon} {armedPower.name} — pick a highlighted square
                </span>
                <button
                  onClick={() => setActivePower(null)}
                  className="ml-3 font-mono text-xs uppercase text-muted hover:text-riot"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="rounded-sm border-2 border-ink-2 bg-ink-2 p-3">
                <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-volt">
                  Abilities
                </div>
                {selectedAbilities.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => armPower(p.id)}
                    className="mt-2 flex w-full items-start gap-3 rounded-sm border border-ink bg-ink px-3 py-2 text-left transition-colors hover:border-volt"
                  >
                    <span className="text-lg leading-none">{p.icon}</span>
                    <span className="min-w-0">
                      <span className="block font-mono text-sm uppercase tracking-wide text-paper">{p.name}</span>
                      <span className="block text-xs leading-relaxed text-muted">{p.blurb}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}