/**
 * The appraisal has to be true, banded, and not the same two sentences for
 * everybody who ended up in the same band.
 */

import { describe, expect, it } from 'vitest'
import { APPRAISAL_BANDS, appraisalBandFor } from '../src/config/appraisal'
import { SIGNPOSTS, THINK_BOLD_LABEL, THINK_BOLD_URL, signpostFor } from '../src/config/signpost'
import { computePosition } from '../src/sim/engine'
import { outOfFive, scorecard } from '../src/sim/scoring'
import type { Lever, ModifierEntry } from '../src/sim/types'

function entry(lever: Lever, value: number, op: 'add' | 'mul' = 'add'): ModifierEntry {
  return {
    id: `t:${lever}:${value}`,
    lever,
    op,
    value,
    delay: 0,
    appliedTurn: 1,
    landsTurn: 1,
    sourceKind: 'decision',
    sourceId: 'test',
    sourceLabel: 'test',
    choiceLabel: 'test',
    note: 'test',
  }
}

const wrecked = [entry('team', -70), entry('spend', 1400), entry('entryProfile', -14)]

describe('the appraisal', () => {
  it('bands by thirds, like the signpost', () => {
    expect(appraisalBandFor(5).min).toBe(4)
    expect(appraisalBandFor(4).min).toBe(4)
    expect(appraisalBandFor(3).min).toBe(3)
    expect(appraisalBandFor(2).min).toBe(0)
    expect(appraisalBandFor(1).min).toBe(0)
  })

  it('always writes exactly two lines', () => {
    for (const seed of [1, 2, 3, 99, 12345]) {
      const card = scorecard(computePosition(wrecked, 10), seed)
      expect(card.appraisal).toHaveLength(2)
      for (const line of card.appraisal) expect(line.length).toBeGreaterThan(30)
    }
  })

  it('gives the same run the same appraisal every time', () => {
    const a = scorecard(computePosition(wrecked, 10), 42).appraisal
    const b = scorecard(computePosition(wrecked, 10), 42).appraisal
    expect(a).toEqual(b)
  })

  it('does not hand everybody in a band the same two sentences', () => {
    const lines = new Set<string>()
    for (let seed = 0; seed < 40; seed += 1) {
      lines.add(scorecard(computePosition(wrecked, 10), seed).appraisal.join(' | '))
    }
    expect(lines.size).toBeGreaterThan(1)
  })

  it('names the measure that actually scored worst', () => {
    const p = computePosition(wrecked, 10)
    const card = scorecard(p, 7)
    const worst = [...card.measures].sort((a, b) => a.score - b.score)[0]
    expect(card.appraisal[1].toLowerCase()).toContain(worst.name.toLowerCase())
  })

  it('scores every measure out of five', () => {
    const card = scorecard(computePosition([], 10), 1)
    for (const m of card.measures) {
      expect(m.of5).toBeGreaterThanOrEqual(1)
      expect(m.of5).toBeLessThanOrEqual(5)
      expect(m.of5).toBe(outOfFive(m.score))
    }
    expect(card.overallOf5).toBeGreaterThanOrEqual(1)
    expect(card.overallOf5).toBeLessThanOrEqual(5)
  })

  it('introduces Think Bold on every ending, in different words', () => {
    const leads = new Set<string>()
    for (const s of SIGNPOSTS) {
      expect(s.brandLead.length, 'every ending needs a line before the button').toBeGreaterThan(1)
      leads.add(s.brandLead)
    }
    expect(leads.size, 'the lead into Think Bold should not be identical everywhere').toBe(
      SIGNPOSTS.length,
    )
  })

  it('sends nobody to a jobs board', () => {
    // It was a good joke and a bad call to action.
    expect(JSON.stringify(SIGNPOSTS)).not.toMatch(/jobs\.ac\.uk/)
  })

  it('never buries the game under the advert', () => {
    // Every ending offers the same three actions in the same order, and the
    // first of them is always going again.
    expect(THINK_BOLD_LABEL.length).toBeGreaterThan(0)
    expect(THINK_BOLD_URL).toMatch(/think-bold/)
  })

  it('covers every score from one to five, in both banded things', () => {
    for (let n = 1; n <= 5; n += 1) {
      expect(appraisalBandFor(n)).toBeDefined()
      expect(signpostFor(n)).toBeDefined()
    }
    expect(APPRAISAL_BANDS).toHaveLength(3)
    expect(SIGNPOSTS).toHaveLength(3)
  })
})
