import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { MENU_LINES, pickLine } from '../game/messages.js'
import { BOT_LEVELS } from '../game/bot.js'
import { sfx } from '../game/sound.js'
import AccountBar from './AccountBar.jsx'
import Leaderboard from './Leaderboard.jsx'
import PowerCatalog from './PowerCatalog.jsx'

export default function Menu({ onPlay, onPlayBot }) {
  const tagline = useMemo(() => pickLine(MENU_LINES), [])
  const [botLevel, setBotLevel] = useState('regular')

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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center gap-3"
      >
        <div className="flex items-center gap-3">
          <motion.button
            initial={{ opacity: 0, rotate: -2 }}
            animate={{ opacity: 1, rotate: -2 }}
            whileHover={{ rotate: 0, scale: 1.03 }}
            onClick={() => {
              sfx.click()
              onPlay()
            }}
            className="rounded-sm border-[3px] border-volt bg-volt px-10 py-3 font-display text-xl uppercase tracking-wide text-ink shadow-[6px_6px_0_rgba(198,255,61,0.25)] transition-colors hover:bg-ink hover:text-volt"
          >
            Play
          </motion.button>

          <div className="flex flex-col items-center gap-1.5">
            <motion.button
              initial={{ opacity: 0, rotate: 2 }}
              animate={{ opacity: 1, rotate: 2 }}
              whileHover={{ rotate: 0, scale: 1.03 }}
              onClick={() => {
                sfx.click()
                onPlayBot(botLevel)
              }}
              className="rounded-sm border-[3px] border-riot bg-riot px-8 py-3 font-display text-xl uppercase tracking-wide text-paper shadow-[6px_6px_0_rgba(255,51,102,0.25)] transition-colors hover:bg-ink hover:text-riot"
            >
              vs Bot
            </motion.button>
            <div className="flex items-center gap-1">
              {Object.entries(BOT_LEVELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    sfx.click()
                    setBotLevel(key)
                  }}
                  className={`rounded-sm border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider transition-colors ${
                    botLevel === key
                      ? 'border-riot bg-riot text-paper'
                      : 'border-ink-2 text-muted hover:border-riot hover:text-paper'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="-mt-1 text-center font-mono text-[10px] uppercase tracking-widest text-muted">
          Play = hot-seat · vs Bot = you are White
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="max-w-md font-mono text-xs uppercase tracking-wide text-muted"
      >
        Hot-seat · capture the King. Every piece has its own way.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex w-full flex-col items-center gap-4"
      >
        <AccountBar />
        <Leaderboard />
        <div className="mb-1 text-center font-mono text-sm uppercase tracking-widest text-volt">
          Abilities
        </div>
        <PowerCatalog />
      </motion.div>
    </div>
  )
}