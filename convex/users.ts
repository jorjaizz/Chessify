import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) return null
    const profile = await ctx.db
      .query('players')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first()
    return profile
      ? { nickname: profile.nickname, wins: profile.wins, losses: profile.losses, games: profile.games }
      : null
  },
})

const NICK_MAX = 20

export const setNickname = mutation({
  args: { nickname: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) throw new Error('Not signed in')
    const nickname = args.nickname.trim().slice(0, NICK_MAX) || 'pawnslinger'
    const existing = await ctx.db
      .query('players')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first()
    if (existing) {
      await ctx.db.patch(existing._id, { nickname })
    } else {
      await ctx.db.insert('players', { userId, nickname, wins: 0, losses: 0, games: 0 })
    }
    return nickname
  },
})

/**
 * Records the outcome of a vs Bot game. Hot-seat games never call this,
 * so the leaderboard only reflects wins/losses against the bot.
 */
export const recordResult = mutation({
  args: { result: v.union(v.literal('win'), v.literal('loss')) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) throw new Error('Not signed in')
    const existing = await ctx.db
      .query('players')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first()
    if (existing) {
      await ctx.db.patch(existing._id, {
        wins: existing.wins + (args.result === 'win' ? 1 : 0),
        losses: existing.losses + (args.result === 'loss' ? 1 : 0),
        games: existing.games + 1,
      })
    } else {
      await ctx.db.insert('players', {
        userId,
        nickname: 'pawnslinger',
        wins: args.result === 'win' ? 1 : 0,
        losses: args.result === 'loss' ? 1 : 0,
        games: 1,
      })
    }
  },
})