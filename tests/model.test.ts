/**
 * The brief's acceptance criteria, as tests.
 *
 * These are deliberately about the shape of the model, not about exact
 * numbers. Tuning the config should not break them. If it does, the tuning has
 * changed the design rather than the balance.
 */

import { describe, expect, it } from 'vitest'
import { BASELINE, MEASURE_BASE, TOTAL_TURNS } from '../src/config/config'
import { DECISIONS, DECISION_NAMES } from '../src/config/decisions'
import { EVENT_LIBRARY } from '../src/config/events'
import { BRIGHT_IDEAS } from '../src/config/interruptions'
import {
  computePosition,
  levelsAt,
  computePipeline,
  baseLevels,
  startGame,
  turnDecisions,
  turnIsAnswerable,
} from '../src/sim/engine'
import { runPlaythrough } from '../src/sim/playthrough'
import { allStrategies } from '../src/sim/strategies'
import { buildDebrief } from '../src/sim/debrief'
import { scorecard } from '../src/sim/scoring'

const SEEDS = Array.from({ length: 60 }, (_, i) => 1000 + i * 7919)

function allRuns() {
  return SEEDS.flatMap((seed) =>
    allStrategies(seed).map((s) => ({ seed, strategy: s.name, ...runPlaythrough(seed, s) })),
  )
}

const RUNS = allRuns()

describe('config integrity', () => {
  it('every decision option is unique within its decision', () => {
    for (const d of DECISIONS) {
      const ids = d.options.map((o) => o.id)
      expect(new Set(ids).size, `${d.id} has duplicate option ids`).toBe(ids.length)
    }
  })

  it('every decision has a short name for the debrief', () => {
    for (const d of DECISIONS) {
      expect(DECISION_NAMES[d.id], `${d.id} has no entry in DECISION_NAMES`).toBeTruthy()
    }
  })

  it('covers all ten turns with two or three decisions each', () => {
    for (let t = 1; t <= TOTAL_TURNS; t++) {
      const n = DECISIONS.filter((d) => d.turn === t).length
      expect(n, `turn ${t} has ${n} decisions`).toBeGreaterThanOrEqual(2)
      expect(n, `turn ${t} has ${n} decisions`).toBeLessThanOrEqual(3)
    }
  })

  it('runs turn 10 in two phases', () => {
    const t10 = DECISIONS.filter((d) => d.turn === TOTAL_TURNS)
    expect(t10.some((d) => d.phase === 'confirmation')).toBe(true)
    expect(t10.some((d) => d.phase === 'clearing')).toBe(true)
  })

  it('has between twenty and thirty events, all with a turn window and weight', () => {
    expect(EVENT_LIBRARY.length).toBeGreaterThanOrEqual(20)
    expect(EVENT_LIBRARY.length).toBeLessThanOrEqual(30)
    for (const e of EVENT_LIBRARY) {
      expect(e.window[0]).toBeLessThanOrEqual(e.window[1])
      expect(e.weight).toBeGreaterThan(0)
      expect(e.copy.length).toBeGreaterThan(20)
    }
  })

  it('gives every effect an explicit delay, so the lag is data not logic', () => {
    const effects = [
      ...DECISIONS.flatMap((d) => d.options.flatMap((o) => o.effects)),
      ...EVENT_LIBRARY.flatMap((e) => [
        ...e.effects,
        ...(e.response?.options.flatMap((o) => o.effects) ?? []),
      ]),
    ]
    expect(effects.length).toBeGreaterThan(100)
    for (const e of effects) {
      expect(Number.isInteger(e.delay)).toBe(true)
      expect(e.delay).toBeGreaterThanOrEqual(0)
      expect(e.note.length, `effect on ${e.lever} has no debrief note`).toBeGreaterThan(5)
    }
  })

  it('carries at least one effect that lands three or more turns later', () => {
    const delays = DECISIONS.flatMap((d) => d.options.flatMap((o) => o.effects.map((e) => e.delay)))
    expect(Math.max(...delays)).toBeGreaterThanOrEqual(3)
  })
})

describe('bright ideas', () => {
  it('has a cast of senior colleagues with costed ideas', () => {
    expect(BRIGHT_IDEAS.length).toBeGreaterThanOrEqual(10)
    for (const i of BRIGHT_IDEAS) {
      expect(i.who.length).toBeGreaterThan(3)
      expect(i.role.length).toBeGreaterThan(3)
      expect(i.options.length).toBeGreaterThanOrEqual(2)
      expect(i.window[0]).toBeLessThanOrEqual(i.window[1])
      // every answer costs something, including the one that sounds free
      for (const o of i.options) {
        expect(o.effects.length, `${i.id}/${o.id} costs nothing`).toBeGreaterThan(0)
        expect(o.aside.length).toBeGreaterThan(5)
      }
    }
  })

  it('blocks the turn until the senior colleague is dealt with', () => {
    // find a seed where somebody turns up on turn 1
    let blockedState = null
    for (let seed = 1; seed < 200 && !blockedState; seed++) {
      const s = startGame(seed)
      if (s.pendingIdea) blockedState = s
    }
    expect(blockedState, 'no seed produced a bright idea on turn one').toBeTruthy()

    const decisionsAnswered: Record<string, string> = {}
    for (const d of turnDecisions(blockedState!)) decisionsAnswered[d.id] = d.options[0].id

    // everything else answered, but the turn is still not answerable
    expect(turnIsAnswerable(blockedState!, decisionsAnswered, {})).toBe(false)
    expect(
      turnIsAnswerable(blockedState!, decisionsAnswered, {}, blockedState!.pendingIdea!.options[0].id),
    ).toBe(true)
  })

  it('never sends the same colleague twice in one cycle', () => {
    for (const r of RUNS.slice(0, 30)) {
      const ids = r.state.usedIdeaIds
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it('turns up often enough to be a nuisance', () => {
    const perRun = RUNS.map((r) => r.state.usedIdeaIds.length)
    const mean = perRun.reduce((a, b) => a + b, 0) / perRun.length
    expect(mean).toBeGreaterThan(2)
    expect(mean).toBeLessThan(9)
  })

  it('puts the answer on the queue so the debrief can name it', () => {
    const withIdeas = RUNS.find((r) => r.state.usedIdeaIds.length > 0)!
    const ideaEntries = withIdeas.state.queue.filter((m) => m.sourceId.startsWith('i-'))
    expect(ideaEntries.length).toBeGreaterThan(0)
    expect(ideaEntries.every((m) => m.sourceKind === 'decision')).toBe(true)
  })
})

describe('the pipeline', () => {
  it('runs the seven stages in descending order', () => {
    const p = computePipeline(baseLevels())
    expect(p.applications).toBeGreaterThan(p.offersMade)
    expect(p.offersMade).toBeGreaterThan(p.firmAcceptances)
    expect(p.firmAcceptances).toBeGreaterThan(p.insuranceAcceptances)
    expect(p.enrolled).toBeGreaterThan(p.retained)
  })

  it('lands a do-nothing cycle just under target, so the target is a stretch', () => {
    const p = computePosition([], Number.POSITIVE_INFINITY)
    const ratio = p.pipeline.enrolled / BASELINE.target
    expect(ratio).toBeGreaterThan(0.9)
    expect(ratio).toBeLessThan(1.0)
  })

  it('draws Clearing from within the briefed 8 to 12 per cent of intake', () => {
    const p = computePipeline(baseLevels())
    const share = p.clearingIntake / p.enrolled
    expect(share).toBeGreaterThanOrEqual(0.08)
    expect(share).toBeLessThanOrEqual(0.12)
  })

  it('hides a delayed modifier until it lands', () => {
    const queue = [
      {
        id: 'x',
        lever: 'offerRate' as const,
        op: 'add' as const,
        value: 0.05,
        delay: 3,
        note: 'test',
        appliedTurn: 2,
        landsTurn: 5,
        sourceKind: 'decision' as const,
        sourceId: 'test',
        sourceLabel: 'test',
        choiceLabel: 'test',
      },
    ]
    expect(levelsAt(queue, 4).offerRate).toBe(BASELINE.offerRate)
    expect(levelsAt(queue, 5).offerRate).toBeGreaterThan(BASELINE.offerRate)
  })
})

describe('capacity ceilings', () => {
  it('does not cap intake, it charges for it', () => {
    const chase = allStrategies(1).find((s) => s.name === 'Chase the number')!
    const { state } = runPlaythrough(1, chase)
    const p = computePosition(state.queue, Number.POSITIVE_INFINITY)

    expect(p.breaches.length).toBeGreaterThan(0)
    // intake stays above every ceiling it breached rather than being clipped to it
    for (const b of p.breaches) {
      expect(b.over).toBeGreaterThan(0)
    }
    const teaching = p.breaches.find((b) => b.kind === 'teaching')
    if (teaching) expect(p.pipeline.enrolled).toBeGreaterThan(teaching.ceiling)

    // and it costs money and people
    expect(p.measures.spend).toBeGreaterThan(MEASURE_BASE.spendCommitted)
    expect(p.measures.team).toBeLessThan(MEASURE_BASE.team)
  })

  it('saturation stops one lever being pushed to an impossible value', () => {
    const push = Array.from({ length: 12 }, (_, i) => ({
      id: `p${i}`,
      lever: 'offerRate' as const,
      op: 'add' as const,
      value: 0.05,
      delay: 0,
      note: 'test',
      appliedTurn: 1,
      landsTurn: 1,
      sourceKind: 'decision' as const,
      sourceId: 'test',
      sourceLabel: 'test',
      choiceLabel: 'test',
    }))
    // twelve decisions each worth five points must not add up to sixty
    expect(levelsAt(push, 10).offerRate).toBeLessThan(BASELINE.offerRate + 0.12)
  })
})

describe('acceptance criteria', () => {
  it('no strategy scores well on all five measures', () => {
    const sweeps = RUNS.filter(
      (r) => buildDebrief(r.state).card.measures.filter((m) => m.band.key === 'strong').length === 5,
    )
    expect(sweeps.length, 'a strategy swept all five measures').toBe(0)
  })

  it('never lets any single strategy be strong on more than three measures', () => {
    const best = Math.max(
      ...RUNS.map(
        (r) => buildDebrief(r.state).card.measures.filter((m) => m.band.key === 'strong').length,
      ),
    )
    expect(best).toBeLessThanOrEqual(3)
  })

  it('makes every measure both winnable and losable', () => {
    const cards = RUNS.map((r) => buildDebrief(r.state).card)
    for (const id of ['intake', 'league', 'access', 'budget', 'team']) {
      const scores = cards.map((c) => c.measures.find((m) => m.id === id)!.score)
      expect(Math.max(...scores), `${id} is never strong`).toBeGreaterThanOrEqual(78)
      expect(Math.min(...scores), `${id} is never poor`).toBeLessThan(56)
    }
  })

  it('produces both over-recruitment and under-recruitment as real outcomes', () => {
    const ratios = RUNS.map((r) => {
      const p = computePosition(r.state.queue, Number.POSITIVE_INFINITY)
      return p.pipeline.enrolled / p.measures.target
    })
    expect(ratios.filter((x) => x > 1.04).length / ratios.length).toBeGreaterThan(0.15)
    expect(ratios.filter((x) => x < 0.96).length / ratios.length).toBeGreaterThan(0.15)
  })

  it('gives over-recruitment its own failure experience, not just a lower score', () => {
    const over = RUNS.map((r) => computePosition(r.state.queue, Number.POSITIVE_INFINITY)).filter(
      (p) => p.pipeline.enrolled / p.measures.target > 1.1,
    )
    expect(over.length).toBeGreaterThan(0)
    for (const p of over) {
      expect(p.breaches.length, 'a heavy over-recruitment caused no capacity breach').toBeGreaterThan(0)
    }
  })

  it('produces a spread of outcomes rather than one answer', () => {
    const intakes = RUNS.map(
      (r) => computePosition(r.state.queue, Number.POSITIVE_INFINITY).pipeline.enrolled,
    )
    const spread = Math.max(...intakes) / Math.min(...intakes)
    expect(spread).toBeGreaterThan(1.3)
  })

  it('varies outcomes between seeds for the same strategy', () => {
    const name = 'Balanced'
    const intakes = SEEDS.map((seed) => {
      const s = allStrategies(seed).find((x) => x.name === name)!
      return computePosition(runPlaythrough(seed, s).state.queue, Number.POSITIVE_INFINITY).pipeline
        .enrolled
    })
    const spread = Math.max(...intakes) / Math.min(...intakes)
    expect(spread, 'the same strategy always produces the same cycle').toBeGreaterThan(1.05)
  })
})

describe('the forecast', () => {
  it('starts wide, narrows, and is only exact on results day', () => {
    const errorsByTurn: number[][] = Array.from({ length: TOTAL_TURNS }, () => [])
    for (const r of RUNS) {
      r.state.history.forEach((h, i) => {
        if (i < TOTAL_TURNS) errorsByTurn[i].push(Math.abs(h.shownForecast / h.trueProjection - 1))
      })
    }
    const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length
    const early = mean(errorsByTurn[0])
    const mid = mean(errorsByTurn[4])
    const late = mean(errorsByTurn[8])

    expect(early).toBeGreaterThan(mid)
    expect(mid).toBeGreaterThan(late)
    expect(late, 'the forecast is certain before turn 9').toBeGreaterThan(0)
    expect(mean(errorsByTurn[TOTAL_TURNS - 1])).toBe(0)
  })

  it('is reproducible for a given seed', () => {
    const s = allStrategies(42).find((x) => x.name === 'Balanced')!
    const a = runPlaythrough(42, s)
    const b = runPlaythrough(42, s)
    expect(a.state.history.map((h) => h.shownForecast)).toEqual(
      b.state.history.map((h) => h.shownForecast),
    )
  })
})

describe('the debrief', () => {
  it('names decisions the player actually made and traces them', () => {
    for (const r of RUNS.slice(0, 40)) {
      const d = buildDebrief(r.state)
      expect(d.headlines.length).toBe(3)
      for (const h of d.headlines) {
        const chosen = r.state.history.some(
          (turn) =>
            Object.values(turn.choices).length > 0 &&
            h.entries.every((e) => e.appliedTurn === h.appliedTurn),
        )
        expect(chosen).toBe(true)
        expect(h.narrative.length).toBeGreaterThan(0)
        expect(h.counterfactual.length).toBeGreaterThan(10)
        expect(h.sourceLabel).toMatch(/^\w+/)
      }
    }
  })

  it('never blames the player for an event they could not respond to', () => {
    for (const r of RUNS.slice(0, 40)) {
      for (const t of buildDebrief(r.state).traced) {
        expect(t.entries.every((e) => e.sourceKind === 'decision')).toBe(true)
      }
    }
  })

  it('ranks by real effect, so the top choice matters more than the last', () => {
    for (const r of RUNS.slice(0, 20)) {
      const traced = buildDebrief(r.state).traced
      for (let i = 1; i < traced.length; i++) {
        expect(traced[i - 1].impact).toBeGreaterThanOrEqual(traced[i].impact)
      }
    }
  })
})

describe('scoring and verdicts', () => {
  it('always produces a verdict', () => {
    for (const r of RUNS.slice(0, 60)) {
      const card = scorecard(computePosition(r.state.queue, Number.POSITIVE_INFINITY))
      expect(card.verdict.length).toBeGreaterThan(20)
    }
  })

  it('uses more than one verdict across a hundred cycles', () => {
    const verdicts = new Set(
      RUNS.map((r) => scorecard(computePosition(r.state.queue, Number.POSITIVE_INFINITY)).verdict),
    )
    expect(verdicts.size).toBeGreaterThan(4)
  })

  it('completes a full playthrough in ten turns', () => {
    const s = allStrategies(7).find((x) => x.name === 'Balanced')!
    const { state } = runPlaythrough(7, s)
    expect(state.phase).toBe('debrief')
    // ten turns, with results day counted twice for its two phases
    expect(state.history.length).toBe(TOTAL_TURNS + 1)
  })
})
