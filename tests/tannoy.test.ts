/**
 * The tannoy is cosmetic, but it must never be silent and it must never
 * announce something that is not happening.
 */

import { describe, expect, it } from 'vitest'
import { TANNOY, type TannoyContext } from '../src/config/tannoy'
import { tannoyLine } from '../src/sim/tannoy'

const calm: TannoyContext = {
  turn: 1,
  ratio: 1,
  team: 72,
  budgetLeft: 500,
  overCapacity: false,
  bedsTight: false,
  placementsTight: false,
  offNumber: null,
  placementCulprit: 'Nursing',
  underInvestigation: false,
  isClearing: false,
}

describe('the tannoy', () => {
  it('always has something to say', () => {
    for (let turn = 1; turn <= 10; turn += 1) {
      const line = tannoyLine({ ...calm, turn }, 12345)
      expect(line.length).toBeGreaterThan(10)
    }
  })

  it('announces the situation it was given', () => {
    expect(tannoyLine({ ...calm, isClearing: true }, 1)).toMatch(/Clearing/)
    expect(tannoyLine({ ...calm, bedsTight: true, ratio: 1.05 }, 1)).toMatch(/room|Premier Inn/)
    expect(tannoyLine({ ...calm, team: 30 }, 1)).toMatch(/wellbeing/)
    expect(tannoyLine({ ...calm, budgetLeft: -120 }, 1)).toMatch(/Finance/)
  })

  it('asks the department that actually eats placements, not the one that is off number', () => {
    const line = tannoyLine(
      { ...calm, placementsTight: true, placementCulprit: 'Nursing', offNumber: 'Creative Arts' },
      1,
    )
    expect(line).toMatch(/Nursing/)
    expect(line).not.toMatch(/Creative Arts/)
  })

  it('does not repeat itself through a quiet cycle', () => {
    const lines = new Set<string>()
    for (let turn = 1; turn <= 10; turn += 1) lines.add(tannoyLine({ ...calm, turn }, 7))
    expect(lines.size).toBeGreaterThan(2)
  })

  it('is the same line every time for the same cycle', () => {
    expect(tannoyLine({ ...calm, turn: 6 }, 99)).toBe(tannoyLine({ ...calm, turn: 6 }, 99))
  })

  it('has a line that always matches, so nothing falls through', () => {
    expect(TANNOY.some((l) => l.when(calm))).toBe(true)
  })
})
