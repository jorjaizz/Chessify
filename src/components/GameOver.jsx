import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { TYPE_UNICODE, pick } from '../game/constants.js'
import { killLineFor, WIN_LINES } from '../game/messages.js'
import { sfx } from '../game/sound.js'

export default function GameOver({ winner, killer, onRestart, onMenu }) {
  useEffect(() => {
    sfx.victory()
  }, [])

  const killLine = useMemo(() => killLineFor(killer?.type), [killer])
  const winLine = useMemo(() => pick(WIN_LINES), [])
  const winnerName = winner === 'w' ? 'WHITE' : 'BLACK'
  const glyph = killer ? TYPE_UNICODE[killer.type] : '☠️'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex items-center justify-center bg-ink/80 p-6 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.6, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="kill-pulse flex flex-col items-center gap-5 rounded-3xl border-2 border-crimson/60 bg-[#12121c] px-10 py-8 text-center shadow-[0_0_60px_-10px_rgba(251,77,109,0.6)]"
      >
        <div className="text-8xl leading-none">{glyph}</div>
        <div className="text-sm font-bold tracking-[0.3em] text-crimson">KING DOWN</div>
        <h2 className="text-5xl font-black text-bone">THE KING IS DEAD</h2>
        <p className="max-w-sm text-lg text-bone/80">{killLine}</p>
        <p className="text-2xl font-bold text-neon">
          {winnerName} WINS · {winLine}
        </p>
        <div className="mt-2 flex gap-3">
          <button
            onClick={() => {
              sfx.click()
              onRestart()
            }}
            className="rounded-lg border-2 border-neon bg-neon/10 px-6 py-2 font-bold text-neon transition-colors hover:bg-neon hover:text-ink"
          >
            REMATCH
          </button>
          <button
            onClick={() => {
              sfx.click()
              onMenu()
            }}
            className="rounded-lg border-2 border-bone/30 px-6 py-2 font-bold text-bone/70 transition-colors hover:border-bone hover:text-bone"
          >
            MENU
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}