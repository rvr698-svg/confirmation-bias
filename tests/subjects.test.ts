/**
 * The subject mix is derived, so the one thing it must never do is invent or
 * lose students.
 */

import { describe, expect, it } from 'vitest'
import { SUBJECTS } from '../src/config/subjects'
import { computePosition } from '../src/sim/engine'
import { mostOffNumber, placementCulprit, subjectMix } from '../src/sim/subjects'
import type { ModifierEntry } from '../src/sim/types'

const empty: ModifierEntry[] = []

/** A cycle pushed hard on volume, so the subjects have something to react to. */
function overCooked(): ModifierEntry[] {
  return [
    {
      id: 'test:apps',
      lever: 'applications',
      op: 'mul',
      value: 1.25,
      delay: 0,
      appliedTurn: 1,
      landsTurn: 1,
      sourceKind: 'decision',
      sourceId: 'test',
      sourceLabel: 'test',
      choiceLabel: 'test',
      note: 'test',
    },
  ]
}

describe('subject mix', () => {
  it('shares sum to the whole intake', () => {
    expect(SUBJECTS.reduce((s, x) => s + x.share, 0)).toBeCloseTo(1, 6)
  })

  it('adds up to the intake it was given', () => {
    for (const queue of [empty, overCooked()]) {
      const p = computePosition(queue, 10)
      const total = subjectMix(p).reduce((s, r) => s + r.actual, 0)
      expect(total).toBeCloseTo(p.pipeline.enrolled, 4)
    }
  })

  it('lets subjects move differently from the total', () => {
    const rows = subjectMix(computePosition(overCooked(), 10))
    const health = rows.find((r) => r.id === 'health')!
    const arts = rows.find((r) => r.id === 'arts')!

    // A strong cycle overshoots in Nursing and still does not save Creative Arts.
    expect(health.delta).toBeGreaterThan(0)
    expect(arts.delta).toBeLessThan(0)
  })

  it('names the area that ate the placements', () => {
    const rows = subjectMix(computePosition(empty, 10))
    expect(placementCulprit(rows).id).toBe('health')
    expect(rows.reduce((s, r) => s + r.placementShare, 0)).toBeCloseTo(1, 6)
  })

  it('has a line for every area that is off its number', () => {
    const rows = subjectMix(computePosition(overCooked(), 10))
    for (const r of rows) {
      if (r.state === 'level') expect(r.note).toBeNull()
      else expect(r.note).toBeTruthy()
    }
    expect(mostOffNumber(rows)).not.toBeNull()
  })
})
