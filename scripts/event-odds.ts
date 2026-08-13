/** How often a given event actually turns up. */
import { allStrategies } from '../src/sim/strategies'
import { runPlaythrough } from '../src/sim/playthrough'

const TARGET = process.argv[2] ?? 'e-sickness'
let seen = 0
let runs = 0

for (let seed = 0; seed < 300; seed += 1) {
  const strategy = allStrategies(seed)[seed % 7]
  const { state } = runPlaythrough(seed, strategy)
  runs += 1
  if (state.usedEventIds.includes(TARGET)) seen += 1
}

console.log(`${TARGET}: fired in ${seen} of ${runs} cycles (${((seen / runs) * 100).toFixed(1)}%)`)
