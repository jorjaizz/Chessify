const COLORS = [
  { id: 'w', label: 'White', dot: 'bg-paper' },
  { id: 'b', label: 'Black', dot: 'bg-riot' },
]

export default function PowerSidebar({ blocks = { w: 0, b: 0 }, turn = 'w', active = null, onUse }) {
  return (
    <aside className="w-full rounded-sm border-2 border-ink-2 bg-ink-2 lg:sticky lg:top-6 lg:w-56">
      <div className="flex items-center justify-between border-b-2 border-ink px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-volt">
        <span>🍲 Bonds</span>
        <span className="text-muted">{blocks.w + blocks.b}</span>
      </div>
      <div className="flex flex-col gap-2.5 px-3 py-2.5">
        {COLORS.map((c) => {
          const isTurn = turn === c.id
          const count = blocks[c.id] || 0
          return (
            <div
              key={c.id}
              className={`rounded-sm border bg-ink p-2.5 transition-colors ${
                isTurn ? 'border-volt/50' : 'border-ink'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`inline-block h-2 w-2 rounded-full ${c.dot}`} />
                  <span className="font-mono text-[11px] uppercase tracking-wide text-paper">
                    {c.label}
                  </span>
                </div>
                <span className="font-mono text-sm text-riot">×{count}</span>
              </div>
              <p className="mt-1.5 text-[10px] leading-snug text-muted">
                🍲 Bloquea piezas del rival en un bloque 2×2.
              </p>
              <button
                disabled={!isTurn || count < 1 || active !== null}
                onClick={() => onUse(c.id)}
                className={`mt-2 w-full rounded-sm border px-3 py-1 font-mono text-[11px] uppercase tracking-wide transition-colors ${
                  !isTurn || count < 1
                    ? 'cursor-not-allowed border-ink-2 text-muted/40'
                    : active === c.id
                      ? 'border-volt bg-volt text-ink'
                      : 'border-volt bg-volt/10 text-volt hover:bg-volt hover:text-ink'
                }`}
              >
                {active === c.id ? 'Seleccionando…' : 'Usar'}
              </button>
            </div>
          )
        })}
        {turn && (
          <p className="font-mono text-[10px] uppercase tracking-wide text-muted">
            → {turn === 'w' ? 'White' : 'Black'} to move
          </p>
        )}
      </div>
    </aside>
  )
}
