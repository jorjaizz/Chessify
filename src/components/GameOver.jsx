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
  const winnerName = winner === 'w' ? 'White' : 'Black'
  const glyph = killer ? TYPE_UNICODE[killer.type] : '☠️'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex items-center justify-center rounded-sm bg-ink/85 p-6 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 12, opacity: 0, rotate: -4 }}
        animate={{ scale: 1, y: 0, opacity: 1, rotate: -3 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="flex flex-col items-center gap-4 rounded-sm border-[3px] border-riot bg-ink-2 px-10 py-8 text-center shadow-[8px_8px_0_rgba(0,0,0,0.4)]"
      >
        <div className="text-6xl leading-none">{glyph}</div>
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-riot">King down</div>
        <h2 className="font-display text-4xl uppercase tracking-wide text-paper">The King is dead</h2>
        <p className="max-w-sm text-sm text-muted">{killLine}</p>
        <p className="font-mono text-xs uppercase tracking-wide text-volt">
          {winnerName} wins · {winLine}
        </p>
        <div className="mt-2 flex gap-3">
          <button
            onClick={() => {
              sfx.click()
              onRestart()
            }}
            className="rounded-sm border-2 border-volt bg-volt px-6 py-2 font-mono text-xs font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-volt"
          >
            Rematch
          </button>
          <button
            onClick={() => {
              sfx.click()
              onMenu()
            }}
            className="rounded-sm border-2 border-ink px-6 py-2 font-mono text-xs uppercase tracking-wide text-muted transition-colors hover:border-muted hover:text-paper"
          >
            Menu
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}