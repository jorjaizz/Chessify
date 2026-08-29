import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { MENU_LINES, pickLine } from '../game/messages.js'
import { sfx } from '../game/sound.js'
import PowerCatalog from './PowerCatalog.jsx'

export default function Menu({ onPlay }) {
  const tagline = useMemo(() => pickLine(MENU_LINES), [])

  return (
    <div className="grain-bg flex min-h-screen flex-col items-center justify-center gap-8 bg-ink px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        <h1 className="font-display text-7xl uppercase tracking-tight text-paper md:text-9xl">
          CHESS<span className="text-volt">IFY</span>
        </h1>
        <span className="absolute -right-3 -top-3 rotate-12 rounded-sm border-2 border-riot px-2 py-0.5 font-mono text-[10px] uppercase text-riot">
          no rules
        </span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-md font-mono text-sm uppercase tracking-wide text-muted"
      >
        {tagline}
      </motion.p>

      <motion.button
        initial={{ opacity: 0, rotate: -2 }}
        animate={{ opacity: 1, rotate: -2 }}
        whileHover={{ rotate: 0, scale: 1.03 }}
        transition={{ delay: 0.2 }}
        onClick={() => {
          sfx.click()
          onPlay()
        }}
        className="rounded-sm border-[3px] border-volt bg-volt px-12 py-3 font-display text-2xl uppercase tracking-wide text-ink shadow-[6px_6px_0_rgba(198,255,61,0.25)] transition-colors hover:bg-ink hover:text-volt"
      >
        Play
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="mb-2 text-center font-mono text-xs uppercase tracking-widest text-muted">
          Hot-seat · capture the King. Every piece has its own way.
        </div>
        <div className="mb-3 text-center font-mono text-sm uppercase tracking-widest text-volt">
          Abilities
        </div>
        <PowerCatalog />
      </motion.div>
    </div>
  )
}
