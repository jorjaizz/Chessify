import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import { authTables } from '@convex-dev/auth/server'

const players = defineTable({
  userId: v.id('users'),
  nickname: v.string(),
  wins: v.number(),
  losses: v.number(),
  games: v.number(),
})
  .index('by_userId', ['userId'])
  .index('by_wins', ['wins'])

export default defineSchema({
  ...authTables,
  players,
})