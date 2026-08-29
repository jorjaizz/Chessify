import { POWERS } from '../game/powers.js'

export default function PowerCatalog() {
  return (
    <div className="flex w-full flex-col gap-3">
      {POWERS.map((p) => (
        <div key={p.id} className="flex items-start gap-3 rounded-sm border-2 border-ink-2 bg-ink-2 p-3">
          <span className="text-2xl leading-none">{p.icon}</span>
          <div className="min-w-0">
            <div className="font-mono text-sm uppercase tracking-wide text-volt">{p.name}</div>
            <div className="mt-0.5 text-xs leading-relaxed text-paper">{p.blurb}</div>
            {p.details && <div className="mt-1 text-xs leading-relaxed text-muted">{p.details}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}