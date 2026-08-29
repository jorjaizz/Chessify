import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

export default function Leaderboard() {
  const entries = useQuery(api.leaderboard.list)

  return (
    <div className="w-full max-w-md rounded-sm border-2 border-ink-2 bg-ink-2/60 p-3">
      <div className="mb-2 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-volt">
        <span>Leaderboard</span>
        <span className="text-muted">wins vs bot</span>
      </div>
      {!entries ? (
        <div className="py-4 text-center font-mono text-xs uppercase tracking-widest text-muted">
          loading…
        </div>
      ) : entries.length === 0 ? (
        <div className="py-4 text-center font-mono text-xs uppercase tracking-widest text-muted">
          be the first to slay the bot
        </div>
      ) : (
        <ol className="flex flex-col gap-1">
          {entries.map((e, i) => (
            <li
              key={`${e.nickname}-${i}`}
              className={`flex items-center justify-between rounded-sm px-2 py-1 font-mono text-xs uppercase tracking-wide ${
                i === 0 ? 'border border-volt bg-volt/10 text-paper' : 'text-muted'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={i === 0 ? 'text-volt' : 'text-riot'}>
                  {i === 0 ? '👑' : `#${i + 1}`}
                </span>
                <span className="truncate">{e.nickname}</span>
              </span>
              <span className="shrink-0 text-paper">
                {e.wins}W · {e.losses}L
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}