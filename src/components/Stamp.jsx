      import { motion } from 'framer-motion'

const VARIANTS = {
  power: { border: 'border-volt', text: 'text-volt' },
  capture: { border: 'border-riot', text: 'text-riot' },
}

export default function Stamp({ text, kind = 'power', rotate = -6 }) {
  const v = VARIANTS[kind] || VARIANTS.power
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.5, rotate: rotate * 2.5 }}
      animate={{ opacity: 1, scale: 1, rotate }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 420, damping: 18 }}
      className={`pointer-events-none select-none rounded-sm border-[3px] bg-ink-2 px-5 py-2 font-display text-lg uppercase tracking-wider shadow-[5px_5px_0_rgba(0,0,0,0.4)] ${v.border} ${v.text}`}
    >
      {text}
    </motion.div>
  )
}