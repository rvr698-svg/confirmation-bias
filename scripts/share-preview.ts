/** What lands in somebody's clipboard. */
import { computePosition } from '../src/sim/engine'
import { scorecard } from '../src/sim/scoring'
import { shareText } from '../src/components/ShareCard'

const p = computePosition([], 10)
console.log(shareText(scorecard(p, 7), p))
console.log('')
console.log('Fancy a go at it yourself? https://admissionsgame.netlify.app')
