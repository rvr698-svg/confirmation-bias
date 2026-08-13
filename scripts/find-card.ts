/**
 * Temporary. Finds a real playthrough whose share card carries the "record
 * intake" verdict, so the social asset shows numbers the game actually produced.
 */

import { runPlaythrough } from '../src/sim/playthrough'
import { allStrategies } from '../src/sim/strategies'
import { shareText } from '../src/components/ShareCard'

const WANT = 'Estates have started a group chat'

const hits: unknown[] = []

for (let seed = 1; seed <= 600 && hits.length < 6; seed++) {
  for (const strategy of allStrategies(seed)) {
    const { debrief } = runPlaythrough(seed, strategy)
    const { card, position } = debrief
    if (!card.verdict.includes(WANT)) continue

    const keys = card.measures.map((m) => m.band.key)
    const good = keys.filter((b) => b === 'strong' || b === 'holding').length
    const bad = keys.filter((b) => b === 'pressure' || b === 'exposed').length
    // Want a card that argues "you cannot win all five" at a glance.
    if (bad < 2 || good < 2) continue

    hits.push({
      seed,
      strategy: strategy.name,
      intake: Math.round(position.pipeline.enrolled),
      target: Math.round(position.measures.target),
      breaches: position.breaches.map((b) => `${b.kind} +${Math.round(b.over)}`),
      measures: card.measures.map((m) => ({
        name: m.name,
        band: m.band.label,
        key: m.band.key,
        of5: m.of5,
      })),
      verdict: card.verdict,
      text: shareText(card, position),
    })
  }
}

console.log(JSON.stringify(hits, null, 2))
console.log(`\n${hits.length} candidates`)
