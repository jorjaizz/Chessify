import { POWERS } from '../game/powers.js'
import { TYPE_UNICODE } from '../game/constants.js'

const PIECE_NAMES = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' }

export default function SpecialMovesPanel() {
  return (
    <aside className="w-full rounded-sm border-2 border-ink-2 bg-ink-2 lg:w-56">
      <div className="flex items-center justify-between border-b-2 border-ink px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-volt">
        <span>Special moves</span>
        <span className="text-muted">{POWERS.length}</span>
      </div>
      <div className="flex flex-col gap-2.5 overflow-y-auto px-3 py-2.5 lg:max-h-[calc(100vh-150px)]">
        {POWERS.length === 0 && (
          <p className="font-mono text-[11px] uppercase tracking-wide text-muted">
            no special moves yet
          </p>
        )}
        {POWERS.map((p) => (
          <div key={p.id} className="rounded-sm border border-ink bg-ink p-2.5">
            <div className="flex items-center gap-2">
              <span className="text-lg leading-none">{p.icon}</span>
              <span className="font-mono text-[11px] uppercase tracking-wide text-volt">
                {p.name}
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {(p.pieceTypes || []).length === 0 ? (
                <span className="rounded-sm border border-ink-2 bg-ink-2 px-1.5 py-0.5 font-mono text-[10px] uppercase text-paper">
                  any piece
                </span>
              ) : (
                p.pieceTypes.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-sm border border-ink-2 bg-ink-2 px-1.5 py-0.5 font-mono text-[10px] uppercase text-paper"
                  >
                    <span className="text-sm leading-none">{TYPE_UNICODE[t]}</span>
                    {PIECE_NAMES[t] || t}
                  </span>
                ))
              )}
            </div>
            <p className="mt-1.5 text-[11px] leading-snug text-muted">{p.blurb}</p>
          </div>
        ))}
      </div>
    </aside>
  )
}
