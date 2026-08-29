import { useEffect, useRef, useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { AnimatePresence, motion } from 'framer-motion'
import { createInitialState, getMoves, applyMove, boardPosition } from '../game/engine.js'
import { POWERS } from '../game/powers.js'
import { sfx } from '../game/sound.js'
import GameOver from './GameOver.jsx'

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

function buildSquareStyles(game, selected) {
  const styles = {}
  if (!selected) return styles
  styles[selected] = { backgroundColor: 'rgba(34,211,238,0.28)' }
  const moves = getMoves(game, selected)
  for (const m of moves) {
    if (m.isPower) {
      styles[m.to] = {
        background: 'radial-gradient(circle, rgba(34,211,238,0.45), transparent 65%)',
        boxShadow: 'inset 0 0 0 3px rgba(34,211,238,0.9)',
      }
    } else if (m.capture) {
      styles[m.to] = { boxShadow: 'inset 0 0 0 3px rgba(251,77,109,0.9)', background: 'transparent' }
    } else {
      styles[m.to] = { boxShadow: 'inset 0 0 0 3px rgba(129,140,248,0.7)', background: 'transparent' }
    }
  }
  return styles
}

export default function GameScreen({ onMenu }) {
  const [game, setGame] = useState(createInitialState)
  const [selected, setSelected] = useState(null)
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

  function onPieceDrop(sourceSquare, targetSquare) {
    if (game.winner) return false
    const move = getMoves(game, sourceSquare).find((m) => m.to === targetSquare)
    if (!move) return false
    const { state, events } = applyMove(game, sourceSquare, targetSquare, move)
    setGame(state)
    announce(events)
    setSelected(null)
    return true
  }

  function reset() {
    setGame(createInitialState())
    setSelected(null)
    setToast(null)
    sfx.click()
  }

  const styles = buildSquareStyles(game, selected)
  const turnName = game.winner ? null : game.turn === 'w' ? 'WHITE' : 'BLACK'

  return (
    <div className="relative flex min-h-screen flex-col items-center gap-4 px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex w-full max-w-[560px] items-center justify-between"
      >
        <button
          onClick={() => {
            sfx.click()
            onMenu()
          }}
          className="text-sm font-bold tracking-widest text-bone/40 transition-colors hover:text-bone/80"
        >
          ← CHESSIFY
        </button>

        <div className="flex items-center gap-2">
          {POWERS.map((p) => (
            <span key={p.id} title={p.blurb} className="rounded-full border border-neon/30 px-2.5 py-1 text-xs text-neon/80">
              {p.icon} {p.name}
            </span>
          ))}
        </div>

        <button
          onClick={reset}
          className="text-sm font-bold tracking-widest text-bone/40 transition-colors hover:text-bone/80"
        >
          NEW GAME ↺
        </button>
      </motion.div>

      <div
        className={`flex items-center gap-3 rounded-full border px-4 py-1.5 text-sm font-bold tracking-[0.25em] ${
          game.turn === 'w' ? 'border-bone/30 text-bone/80' : 'border-crimson/50 text-crimson'
        }`}
      >
        {turnName ? (
          <>
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${game.turn === 'w' ? 'bg-bone' : 'bg-crimson'}`} />
            {turnName} TO MOVE
          </>
        ) : (
          <span className="text-crimson">GAME OVER</span>
        )}
      </div>

      <div ref={boardWrapRef} className="relative w-full max-w-[560px]">
        <div className="overflow-hidden rounded-2xl bg-black/40 p-1 shadow-[0_0_60px_-15px_rgba(34,211,238,0.4)] ring-1 ring-white/10">
          <Chessboard
            id="chessify-board"
            position={boardPosition(game)}
            boardOrientation="white"
            boardWidth={boardWidth}
            onPieceDrop={onPieceDrop}
            onPieceDragBegin={(sourceSquare) => setSelected(sourceSquare)}
            onPieceDragEnd={() => setSelected(null)}
            customSquareStyles={styles}
            customDarkSquareStyle={{ backgroundColor: '#1e1e2e' }}
            customLightSquareStyle={{ backgroundColor: '#e7e5e4' }}
            customDropSquareStyle={{ boxShadow: 'inset 0 0 0 3px rgba(34,211,238,0.9)' }}
            animationDuration={160}
            autoPromoteToQueen
          />
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

      <div className="relative mt-2 flex h-10 w-full max-w-[560px] items-center justify-center">
        <AnimatePresence mode="wait">
          {toast && (
            <motion.div
              key={toast.key}
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className={`rounded-full border px-5 py-1.5 text-sm font-bold tracking-wide ${
                toast.kind === 'power'
                  ? 'border-neon/60 bg-neon/10 text-neon'
                  : toast.kind === 'capture'
                    ? 'border-crimson/60 bg-crimson/10 text-crimson'
                    : 'border-bone/20 bg-bone/5 text-bone/80'
              }`}
            >
              {toast.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}