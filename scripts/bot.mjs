import { createInitialState, applyMove, spawnGem } from '../src/game/engine.js'
import { chooseBotMove } from '../src/game/bot.js'
import { GEM_INTERVAL_MS } from '../src/game/constants.js'

let failures = 0
const check = (label, ok) => {
  if (!ok) failures += 1
  console.log(`${ok ? '✅' : '❌'} ${label}`)
}

const level = process.argv[2] || 'regular'

let state = createInitialState()
let plies = 0
const started = Date.now()
let stalled = false
let from, to, move

while (!state.winner && plies < 400) {
  const cm = chooseBotMove(state, level)
  if (!cm) {
    stalled = true
    break
  }
  from = cm.from
  to = cm.to
  move = cm.move
  const { state: ns } = applyMove(state, from, to, move)
  state = ns
  if (!state.gem && plies % Math.floor(GEM_INTERVAL_MS / 100) === 0 && plies < 380) {
    state = spawnGem(state)
  }
  plies += 1
}

const elapsed = Date.now() - started
check(`game ran ${plies} plies (winner: ${state.winner ?? 'none'}, stalled: ${stalled}) without crash`, !stalled)

let probe = createInitialState()
const first = chooseBotMove(probe, level)
check(`first move legal pickup: ${first ? first.from + '->' + first.to : 'none'}`, !!first)

const speedState = createInitialState()
const speedStart = Date.now()
for (let i = 0; i < 3; i++) chooseBotMove(speedState, level)
const perMove = (Date.now() - speedStart) / 3
check(`avg move time ${perMove.toFixed(1)}ms`, perMove < 2000)

console.log(failures === 0 ? '\nAll bot checks passed ✅' : `\n${failures} failure(s) ❌`)
process.exit(failures === 0 ? 0 : 1)