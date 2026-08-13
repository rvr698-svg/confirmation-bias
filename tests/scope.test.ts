/**
 * What the job actually is.
 *
 * A Head of Recruitment and Admissions does not own beds, lecture theatres or
 * placements. Accommodation Services, Timetabling and the placement teams do.
 * You influence those numbers by the forecast you give and the fights you pick,
 * and you find out about the rest when it lands on you.
 *
 * So: no decision may set capacity directly, and anything that moves capacity
 * has to arrive late, because somebody else has to act on it first.
 */

import { describe, expect, it } from 'vitest'
import { DECISIONS } from '../src/config/decisions'
import { BRIGHT_IDEAS } from '../src/config/interruptions'
import { EVENT_LIBRARY } from '../src/config/events'
import type { EffectSpec, Lever } from '../src/sim/types'

/** Levers that belong to somebody else's department. */
const NOT_YOURS: Lever[] = ['teachingCapacity', 'placementSupply']

function playerEffects(): { where: string; effect: EffectSpec }[] {
  const out: { where: string; effect: EffectSpec }[] = []

  for (const d of DECISIONS) {
    for (const o of d.options) {
      for (const e of o.effects) out.push({ where: `${d.id}/${o.id}`, effect: e })
    }
  }
  // A bright idea is a decision the player makes, so it plays by the same rules.
  for (const i of BRIGHT_IDEAS) {
    for (const o of i.options) {
      for (const e of o.effects) out.push({ where: `${i.id}/${o.id}`, effect: e })
    }
  }
  return out
}

describe('what you can and cannot decide', () => {
  it('never lets you set teaching capacity or placement supply', () => {
    for (const { where, effect } of playerEffects()) {
      expect(
        NOT_YOURS.includes(effect.lever),
        `${where} sets ${effect.lever}, which is not yours to set`,
      ).toBe(false)
    }
  })

  it('only moves beds after somebody else has acted on your number', () => {
    for (const { where, effect } of playerEffects()) {
      if (effect.lever !== 'accommodationBeds') continue
      expect(
        effect.delay,
        `${where} changes beds on the spot. Accommodation have to do it, so it lands later`,
      ).toBeGreaterThanOrEqual(1)
    }
  })

  it('still lets capacity be done to you', () => {
    // The constraint is on decisions, not on the world. Events must still be
    // able to take a hall away at ten minutes' notice.
    const eventCapacity = EVENT_LIBRARY.flatMap((e) => e.effects).filter((e) =>
      ['teachingCapacity', 'accommodationBeds', 'placementSupply'].includes(e.lever),
    )
    expect(eventCapacity.length).toBeGreaterThan(0)
  })

  it('lets you argue about the target but never set it', () => {
    // Every target write is a negotiation, so it comes with a note explaining
    // who moved it. None of them is you deciding the number.
    for (const { where, effect } of playerEffects()) {
      if (effect.lever !== 'target') continue
      expect(effect.note, `${where} moves the target with no explanation`).toBeTruthy()
    }
  })
})
