import { query } from './_generated/server'

export const list = query({
  args: {},
  handler: async (ctx) => {
    const entries = await ctx.db
      .query('players')
      .withIndex('by_wins', (q) => q.gt('wins', 0))
      .order('desc')
      .take(20)
    return entries.map((p) => ({ nickname: p.nickname, wins: p.wins, losses: p.losses, games: p.games }))
  },
})

export const top = list