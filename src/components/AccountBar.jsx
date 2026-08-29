import { useEffect, useState } from 'react'
import { useConvexAuth, useAuthActions } from '@convex-dev/auth/react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { sfx } from '../game/sound.js'

const DEFAULT_NICK = 'pawnslinger'

export default function AccountBar() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { signIn, signOut } = useAuthActions()
  const me = useQuery(api.users.getMe)
  const saveNickname = useMutation(api.users.setNickname)
  const [nick, setNick] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (me?.nickname) setNick(me.nickname)
  }, [me?.nickname])

  if (isLoading) {
    return (
      <div className="px-3 py-2 text-center font-mono text-xs uppercase tracking-widest text-muted">
        connecting…
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center">
        <button
          onClick={() => {
            sfx.click()
            signIn('anonymous')
          }}
          className="rounded-sm border border-volt bg-ink-2 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-volt transition-colors hover:bg-volt hover:text-ink"
        >
          Sign in (anonymous)
        </button>
      </div>
    )
  }

  async function onSave(e) {
    e.preventDefault()
    if (!nick.trim()) return
    setSaving(true)
    try {
      await saveNickname({ nickname: nick })
      sfx.click()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <form onSubmit={onSave} className="flex items-center gap-1.5">
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted">
          nick
        </label>
        <input
          value={nick}
          maxLength={20}
          onChange={(e) => setNick(e.target.value)}
          placeholder={DEFAULT_NICK}
          className="w-36 rounded-sm border border-ink-2 bg-ink-2 px-2 py-1 font-mono text-xs uppercase tracking-wide text-paper outline-none transition-colors focus:border-volt"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-sm border border-volt bg-volt px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink transition-colors hover:bg-ink hover:text-volt disabled:opacity-40"
        >
          save
        </button>
      </form>
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
        <span>
          {me?.wins ?? 0}W · {me?.losses ?? 0}L
        </span>
        <button
          onClick={() => {
            sfx.click()
            signOut()
          }}
          className="text-riot transition-colors hover:text-paper"
        >
          sign out
        </button>
      </div>
    </div>
  )
}