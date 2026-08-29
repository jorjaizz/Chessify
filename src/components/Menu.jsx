import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { MENU_LINES, pickLine } from '../game/messages.js'
import { POWERS } from '../game/powers.js'
import { sfx } from '../game/sound.js'

export default function Menu({ onPlay }) {
  const tagline = useMemo(() => pickLine(MENU_LINES), [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <motion.h1
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="title-neon text-7xl font-black tracking-tighter text-neon md:text-9xl"
      >
        CHESSIFY
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="max-w-md text-lg text-bone/80"
      >
        {tagline}
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          sfx.click()
          onPlay()
        }}
        className="rounded-xl border-2 border-neon bg-neon/10 px-10 py-4 text-2xl font-black tracking-widest text-neon shadow-[0_0_30px_-5px_rgba(34,211,238,0.8)] transition-colors hover:bg-neon hover:text-ink"
      >
        ▶ PLAY
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center gap-3 text-sm text-bone/50"
      >
        <p>Hot-seat · capture the King. Every piece kills its own way.</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {POWERS.map((p) => (
            <span key={p.id} title={p.blurb} className="rounded-full border border-bone/15 px-3 py-1 text-bone/70">
              {p.icon} {p.name}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}