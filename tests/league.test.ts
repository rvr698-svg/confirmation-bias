/**
 * The table has to move in the direction a player would expect, or it is worse
 * than the entry profile number it replaced.
 */

import { describe, expect, it } from 'vitest'
import { LEAGUE } from '../src/config/config'
import { computePosition } from '../src/sim/engine'
import { ordinal, standing } from '../src/sim/league'
import type { Lever, ModifierEntry } from '../src/sim/types'

function entry(lever: Lever, value: number, op: 'add' | 'mul' = 'add'): ModifierEntry {
  return {
    id: `test:${lever}`,
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

describe('the table', () => {
  it('starts a do-nothing cycle near the stated starting position', () => {
    const p = standing(computePosition([], 10))
    expect(Math.abs(p.position - LEAGUE.startPosition)).toBeLessThanOrEqual(2)
  })

  it('climbs when entry standards rise and falls when they drop', () => {
    const up = standing(computePosition([entry('entryProfile', 6)], 10))
    const down = standing(computePosition([entry('entryProfile', -6)], 10))

    expect(up.position).toBeLessThan(LEAGUE.startPosition)
    expect(down.position).toBeGreaterThan(LEAGUE.startPosition)
    expect(up.movement).toBeGreaterThan(0)
    expect(down.movement).toBeLessThan(0)
  })

  it('never leaves the table', () => {
    const wild = [
      standing(computePosition([entry('entryProfile', 40)], 10)),
      standing(computePosition([entry('entryProfile', -40), entry('spend', 5_000)], 10)),
    ]
    for (const s of wild) {
      expect(s.position).toBeGreaterThanOrEqual(1)
      expect(s.position).toBeLessThanOrEqual(LEAGUE.field)
    }
  })

  it('counts in English', () => {
    expect(ordinal(1)).toBe('1st')
    expect(ordinal(2)).toBe('2nd')
    expect(ordinal(3)).toBe('3rd')
    expect(ordinal(4)).toBe('4th')
    expect(ordinal(11)).toBe('11th')
    expect(ordinal(12)).toBe('12th')
    expect(ordinal(13)).toBe('13th')
    expect(ordinal(21)).toBe('21st')
    expect(ordinal(64)).toBe('64th')
    expect(ordinal(112)).toBe('112th')
  })
})
