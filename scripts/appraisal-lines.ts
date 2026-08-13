/**
 * Prints every appraisal line with realistic values, for sign-off.
 * Run: npx vite-node scripts/appraisal-lines.ts
 */
import { APPRAISAL_BANDS, type AppraisalContext } from '../src/config/appraisal'

const SAMPLES: Record<number, AppraisalContext> = {
  4: {
    intake: '3,842', target: '3,800',
    best: 'Intake against target',
    bestPhrase: 'the intake number',
    worst: 'Budget position',
    worstPhrase: 'the budget position',
    worstDetail: 'You finished £180k over budget.',
    onNumber: true, fined: false,
  },
  3: {
    intake: '4,162', target: '3,800',
    best: 'Access and participation',
    bestPhrase: 'access and participation',
    worst: 'Team capacity and wellbeing',
    worstPhrase: 'team capacity',
    worstDetail: 'Your team finished the cycle depleted. Expect resignations in October.',
    onNumber: false, fined: false,
  },
  0: {
    intake: '4,584', target: '4,050',
    best: 'Access and participation',
    bestPhrase: 'access and participation',
    worst: 'Team capacity and wellbeing',
    worstPhrase: 'team capacity',
    worstDetail: 'Your team is done. You will rebuild this function before you run another cycle.',
    onNumber: false, fined: false,
  },
}

const NAMES: Record<number, string> = {
  4: 'TOP THIRD  (4 and 5 out of 5)',
  3: 'MIDDLE     (3 out of 5)',
  0: 'BOTTOM     (1 and 2 out of 5)',
}

for (const band of APPRAISAL_BANDS) {
  const c = SAMPLES[band.min]
  console.log(`\n${'='.repeat(78)}\n${NAMES[band.min]}\n${'='.repeat(78)}`)
  console.log('\n-- ACHIEVEMENT LINES --')
  band.achievements.forEach((l, i) => console.log(`\nA${i + 1}. ${l(c)}`))
  console.log('\n-- DEVELOPMENT LINES --')
  band.developments.forEach((l, i) => console.log(`\nD${i + 1}. ${l(c)}`))
}
