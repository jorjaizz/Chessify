import { useEffect, useRef } from 'react'
import { TYPE_UNICODE } from '../game/constants.js'
import { getPowerByName } from '../game/powers.js'

export default function HistoryPanel({ entries }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (el) el.scrollTop = el.scrollHeight
  }, [entries.length])

  return (
    <div className="w-full max-w-[560px] rounded-sm border-2 border-ink-2 bg-ink-2">
      <div className="flex items-center justify-between border-b-2 border-ink px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-volt">
        <span>Moves</span>
        <span className="text-muted">{entries.length}</span>
      </div>
      <div ref={ref} className="history-scroll max-h-40 overflow-y-auto px-3 py-2">
        {entries.length === 0 ? (
          <p className="font-mono text-[11px] uppercase tracking-wide text-muted">no blood yet</p>
        ) : (
          entries.map((e, i) => {
            const power = e.power ? getPowerByName(e.power) : null
            return (
              <div
                key={i}
                className={`mb-1.5 border-l-2 pl-2 ${e.power ? 'border-volt' : e.captured ? 'border-riot' : 'border-muted'}`}
              >
                <div className="font-mono text-[11px] uppercase tracking-wide text-paper">
                  <span className="text-muted">#{i + 1}</span>{' '}
                  {e.piece && TYPE_UNICODE[e.piece.type]} {e.from} → {e.to}
                  {power && <span className="text-volt"> · {power.name}</span>}
                </div>
                {e.comment && <div className="font-mono text-[10px] text-muted">{e.comment}</div>}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}