/**
 * Waiving published conditions for firm holders is not a near miss policy. It
 * is admitting students who did not meet the terms they were offered, and the
 * regulator has views.
 *
 * The joke is that the fine counts as spend per student, so it nudges you up
 * the table. The joke only works if it is true, deliberate, and visible.
 */

import { describe, expect, it } from 'vitest'
import { LEAGUE, REGULATOR } from '../src/config/config'
import { DECISIONS } from '../src/config/decisions'
import { computePosition } from '../src/sim/engine'
import { standing } from '../src/sim/league'
import { scorecard } from '../src/sim/scoring'
import type { ModifierEntry } from '../src/sim/types'

const waive = DECISIONS.find((d) => d.id === 'd10-nearmiss')!.options.find((o) => o.id === 'waive')!

function queueFrom(optionEffects: typeof waive.effects): ModifierEntry[] {
  return optionEffects.map((e, i) => ({
    ...e,
    id: `waive:${i}`,
    appliedTurn: 10,
    landsTurn: 10,
    sourceKind: 'decision' as const,
    sourceId: 'd10-nearmiss',
    sourceLabel: 'Results day: near miss policy',
    choiceLabel: waive.label,
  }))
}

describe('the regulator', () => {
  it('fines you for waiving the conditions', () => {
    const p = computePosition(queueFrom(waive.effects), 10)
    expect(p.measures.penalties).toBeCloseTo(REGULATOR.fine, 5)
    expect(p.measures.reputation).toBeLessThan(100)
  })

  it('charges the fine to the budget', () => {
    const clean = computePosition([], 10)
    const fined = computePosition(queueFrom(waive.effects), 10)
    expect(fined.measures.spend - clean.measures.spend).toBeGreaterThanOrEqual(REGULATOR.fine - 1)
  })

  it('costs you far more table than the fine wins back', () => {
    const clean = standing(computePosition([], 10))
    const fined = standing(computePosition(queueFrom(waive.effects), 10))

    const placesLost = fined.position - clean.position
    expect(placesLost, 'being fined has to cost you table position overall').toBeGreaterThan(0)
    expect(fined.finePlaces, 'the fine still buys a couple of places back').toBeGreaterThan(0)
    expect(
      fined.finePlaces,
      'but never more than the case costs you, or the exploit is real rather than a joke',
    ).toBeLessThan(placesLost)
  })

  it('says the quiet part out loud', () => {
    const card = scorecard(computePosition(queueFrom(waive.effects), 10))
    const league = card.measures.find((m) => m.id === 'league')!

    expect(league.detail).toMatch(/spend per student/)
    expect(card.verdict).toMatch(/fined/)
    expect(card.verdict).toMatch(/spend per student/)
  })

  it('can be turned off in one line if it stops being funny', () => {
    expect(typeof LEAGUE.finesCountAsSpend).toBe('boolean')
  })
})
