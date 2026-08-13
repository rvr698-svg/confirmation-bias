/**
 * CYCLE - the tuning harness.
 *
 * Build order step 2. Run every strategy across a hundred cycles and look at
 * the spread before any interface work happens.
 *
 * What we are checking:
 *   1. A range of play styles produces a range of plausible outcomes.
 *   2. No single strategy sweeps all five measures.
 *   3. Both over-recruitment and under-recruitment actually happen.
 *   4. Forecast error is real but not absurd.
 *
 *   npm run harness
 */

import { runPlaythrough } from '../src/sim/playthrough'
import { allStrategies } from '../src/sim/strategies'
import { BASELINE, TOTAL_TURNS } from '../src/config/config'

const RUNS = Number(process.argv[2] ?? 100)

interface Row {
  strategy: string
  seed: number
  intake: number
  target: number
  ratio: number
  scores: Record<string, number>
  bands: Record<string, string>
  strongCount: number
  exposedCount: number
  overall: number
  breaches: string[]
  verdict: string
  forecastErrors: number[]
}

const rows: Row[] = []

for (let i = 0; i < RUNS; i++) {
  const seed = 1000 + i * 7919
  for (const strategy of allStrategies(seed)) {
    const { state, debrief } = runPlaythrough(seed, strategy)
    const scores: Record<string, number> = {}
    const bands: Record<string, string> = {}
    for (const m of debrief.card.measures) {
      scores[m.id] = m.score
      bands[m.id] = m.band.key
    }
    rows.push({
      strategy: strategy.name,
      seed,
      intake: debrief.position.pipeline.enrolled,
      target: debrief.position.measures.target,
      ratio: debrief.position.pipeline.enrolled / debrief.position.measures.target,
      scores,
      bands,
      strongCount: debrief.card.measures.filter((m) => m.band.key === 'strong').length,
      exposedCount: debrief.card.measures.filter((m) => m.band.key === 'exposed').length,
      overall: debrief.card.overall,
      breaches: debrief.position.breaches.map((b) => b.kind),
      verdict: debrief.card.verdict,
      forecastErrors: state.history.map((h) => h.shownForecast / h.trueProjection - 1),
    })
  }
}

// ------------------------------------------------------------------ reporting

function pct(n: number) {
  return `${(n * 100).toFixed(1)}%`
}
function fmt(n: number, dp = 0) {
  return n.toLocaleString('en-GB', { minimumFractionDigits: dp, maximumFractionDigits: dp })
}
function quantile(values: number[], q: number) {
  const s = [...values].sort((a, b) => a - b)
  const pos = (s.length - 1) * q
  const lo = Math.floor(pos)
  const hi = Math.ceil(pos)
  return s[lo] + (s[hi] - s[lo]) * (pos - lo)
}

const MEASURES = ['intake', 'league', 'access', 'budget', 'team'] as const

console.log(`\nCYCLE harness  |  ${RUNS} seeds x ${allStrategies(0).length} strategies = ${rows.length} playthroughs`)
console.log(`Baseline applications ${fmt(BASELINE.applications)}, target ${fmt(BASELINE.target)}, ${TOTAL_TURNS} turns\n`)

console.log('INTAKE AND SCORE BY STRATEGY')
console.log(
  ['strategy'.padEnd(21), 'intake p10'.padStart(11), 'median'.padStart(8), 'p90'.padStart(8), 'vs target'.padStart(10), 'overall'.padStart(8), 'strong'.padStart(7), 'exposed'.padStart(8)].join(''),
)
for (const name of [...new Set(rows.map((r) => r.strategy))]) {
  const rs = rows.filter((r) => r.strategy === name)
  const intakes = rs.map((r) => r.intake)
  console.log(
    [
      name.padEnd(21),
      fmt(quantile(intakes, 0.1)).padStart(11),
      fmt(quantile(intakes, 0.5)).padStart(8),
      fmt(quantile(intakes, 0.9)).padStart(8),
      pct(rs.reduce((s, r) => s + r.ratio, 0) / rs.length - 1).padStart(10),
      fmt(rs.reduce((s, r) => s + r.overall, 0) / rs.length, 1).padStart(8),
      fmt(rs.reduce((s, r) => s + r.strongCount, 0) / rs.length, 2).padStart(7),
      fmt(rs.reduce((s, r) => s + r.exposedCount, 0) / rs.length, 2).padStart(8),
    ].join(''),
  )
}

console.log('\nMEAN MEASURE SCORE BY STRATEGY  (78+ is Strong, 56+ Holding, 32+ Under pressure)')
console.log(['strategy'.padEnd(21), ...MEASURES.map((m) => m.padStart(9))].join(''))
for (const name of [...new Set(rows.map((r) => r.strategy))]) {
  const rs = rows.filter((r) => r.strategy === name)
  console.log(
    [
      name.padEnd(21),
      ...MEASURES.map((m) => fmt(rs.reduce((s, r) => s + r.scores[m], 0) / rs.length, 1).padStart(9)),
    ].join(''),
  )
}

console.log('\nDOMINANCE CHECK')
const sweeps = rows.filter((r) => r.strongCount === 5)
const nearSweeps = rows.filter((r) => r.strongCount === 4)
console.log(`  playthroughs strong on all five : ${sweeps.length}  ${sweeps.length === 0 ? 'PASS' : 'FAIL'}`)
console.log(`  playthroughs strong on four     : ${nearSweeps.length} (${pct(nearSweeps.length / rows.length)})`)
const byStrategyBest = [...new Set(rows.map((r) => r.strategy))].map((name) => {
  const rs = rows.filter((r) => r.strategy === name)
  return `${name}: best ${Math.max(...rs.map((r) => r.strongCount))} strong`
})
console.log(`  best case per strategy          : ${byStrategyBest.join(', ')}`)

console.log('\nREACHABILITY  (every measure must be winnable by somebody, and losable)')
for (const m of MEASURES) {
  const scores = rows.map((r) => r.scores[m])
  const strongRuns = rows.filter((r) => r.bands[m] === 'strong')
  const best = [...new Set(strongRuns.map((r) => r.strategy))]
  console.log(
    `  ${m.padEnd(8)} min ${fmt(Math.min(...scores), 1).padStart(6)}  max ${fmt(Math.max(...scores), 1).padStart(6)}  strong in ${pct(strongRuns.length / rows.length).padStart(6)} of runs${best.length ? `  via ${best.join(', ')}` : '  NEVER STRONG'}`,
  )
}

console.log('\nFAILURE STATES')
const over = rows.filter((r) => r.ratio > 1.04)
const under = rows.filter((r) => r.ratio < 0.96)
const onNumber = rows.filter((r) => r.ratio >= 0.96 && r.ratio <= 1.04)
console.log(`  over-recruited  (>4% over)  : ${over.length} (${pct(over.length / rows.length)})`)
console.log(`  on the number   (+/-4%)     : ${onNumber.length} (${pct(onNumber.length / rows.length)})`)
console.log(`  under-recruited (>4% under) : ${under.length} (${pct(under.length / rows.length)})`)
const anyBreach = rows.filter((r) => r.breaches.length > 0)
console.log(`  any capacity breach         : ${anyBreach.length} (${pct(anyBreach.length / rows.length)})`)
for (const kind of ['teaching', 'accommodation', 'placement']) {
  const n = rows.filter((r) => r.breaches.includes(kind)).length
  console.log(`    ${kind.padEnd(15)}: ${n} (${pct(n / rows.length)})`)
}

console.log('\nFORECAST ERROR BY TURN  (shown forecast vs truth at the time)')
for (let t = 1; t <= TOTAL_TURNS; t++) {
  const errs = rows.map((r) => r.forecastErrors[t - 1]).filter((e) => e !== undefined && Number.isFinite(e))
  if (errs.length === 0) continue
  const abs = errs.map(Math.abs)
  console.log(
    `  turn ${String(t).padStart(2)}  mean |error| ${pct(abs.reduce((a, b) => a + b, 0) / abs.length).padStart(7)}   p90 ${pct(quantile(abs, 0.9)).padStart(7)}   max ${pct(Math.max(...abs)).padStart(7)}`,
  )
}

console.log('\nOUTCOME SPREAD (all playthroughs)')
const allIntakes = rows.map((r) => r.intake)
console.log(`  intake p05 ${fmt(quantile(allIntakes, 0.05))}  p50 ${fmt(quantile(allIntakes, 0.5))}  p95 ${fmt(quantile(allIntakes, 0.95))}`)
console.log(`  overall score p05 ${fmt(quantile(rows.map((r) => r.overall), 0.05), 1)}  p50 ${fmt(quantile(rows.map((r) => r.overall), 0.5), 1)}  p95 ${fmt(quantile(rows.map((r) => r.overall), 0.95), 1)}`)

console.log('\nVERDICT SPREAD')
const verdictCounts = new Map<string, number>()
for (const r of rows) verdictCounts.set(r.verdict, (verdictCounts.get(r.verdict) ?? 0) + 1)
for (const [v, n] of [...verdictCounts].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}  ${v.slice(0, 88)}`)
}
console.log('')
