/**
 * The tannoy is cosmetic, but it must never be silent and it must never
 * announce something that is not happening.
 */

import { describe, expect, it } from 'vitest'
import { TANNOY, type TannoyContext } from '../src/config/tannoy'
import { tannoyLine, tannoySituation } from '../src/sim/tannoy'

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
    // The wording rotates by turn, so the check is on which situation won.
    expect(tannoySituation({ ...calm, isClearing: true })).toBe('clearing')
    expect(tannoySituation({ ...calm, bedsTight: true, ratio: 1.05 })).toBe('beds')
    expect(tannoySituation({ ...calm, team: 30 })).toBe('team-gone')
    expect(tannoySituation({ ...calm, budgetLeft: -120 })).toBe('broke')
    expect(tannoySituation({ ...calm, underInvestigation: true })).toBe('regulator')
  })

  it('finds new words for a situation that lasts months', () => {
    const stuck = { ...calm, bedsTight: true, ratio: 1.05 }
    const heard = new Set<string>()
    for (let turn = 1; turn <= 6; turn += 1) heard.add(tannoyLine({ ...stuck, turn }, 4))
    expect(heard.size, 'the same sentence five turns running reads as broken').toBeGreaterThan(2)
  })

  it('asks the department that actually eats placements, not the one that is off number', () => {
    const c = { ...calm, placementsTight: true, placementCulprit: 'Nursing', offNumber: 'Creative Arts' }
    const lines = [1, 2, 3, 4, 5, 6].map((turn) => tannoyLine({ ...c, turn }, 1))

    expect(lines.some((l) => /Nursing/.test(l))).toBe(true)
    for (const line of lines) expect(line).not.toMatch(/Creative Arts/)
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
