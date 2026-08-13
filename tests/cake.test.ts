/**
 * The cake is the one moment in the cycle where the answer is not a resourcing
 * decision. It has to appear when the roster says so, once, and never after
 * somebody has already left.
 */

import { describe, expect, it } from 'vitest'
import { CAKE } from '../src/config/team'
import { CAKE_DECISION_ID, cakeDecision } from '../src/config/cake'
import { cakeMoment, roster } from '../src/sim/team'
import { computePosition, turnDecisions } from '../src/sim/engine'
import { createInitialState } from '../src/sim/engine'
import type { GameState, Lever, ModifierEntry } from '../src/sim/types'

function entry(lever: Lever, value: number): ModifierEntry {
  return {
    id: `t:${lever}:${value}`,
    lever,
    op: 'add',
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

/** A team level where somebody is looking and the rest are stretched. */
function teamAt(level: number): number {
  return computePosition([entry('team', level - 72)], 5).measures.team
}

describe('the cake', () => {
  it('does not turn up while everybody is fine', () => {
    expect(cakeMoment(90, [], 5)).toBeNull()
  })

  it('turns up when somebody has started looking and the rest are stretched', () => {
    // Find the level where the roster is fraying but nobody has gone.
    const level = [46, 44, 42, 40, 38, 36].find((n) => cakeMoment(n, [], 5) !== null)
    expect(level, 'no team level produces a cake moment').toBeDefined()

    const moment = cakeMoment(level!, [], 5)!
    const seen = roster(level!, [], 5)
    expect(seen.some((r) => r.member.name === moment.looking)).toBe(true)
    expect(seen.some((r) => r.state === 'gone')).toBe(false)
  })

  it('does not turn up once somebody has already left', () => {
    expect(cakeMoment(10, [], 5)).toBeNull()
  })

  it('buys back more team than it costs in budget', () => {
    const cake = cakeDecision(5, 'Yusuf', 2).options.find((o) => o.id === 'cake')!
    const team = cake.effects.find((e) => e.lever === 'team')!
    const spend = cake.effects.find((e) => e.lever === 'spend')!

    expect(team.value).toBe(CAKE.team)
    expect(spend.value).toBe(CAKE.spend)
    expect(spend.value).toBeLessThan(1)
  })

  it('offers three answers, and the empty promise costs you', () => {
    const options = cakeDecision(5, 'Yusuf', 2).options
    expect(options).toHaveLength(3)

    const later = options.find((o) => o.id === 'later')!
    expect(later.effects.some((e) => e.lever === 'team' && e.value < 0)).toBe(true)
  })

  it('is not in the deck on a healthy first turn', () => {
    const state: GameState = { ...createInitialState(1), phase: 'playing', turnPhase: null }
    expect(turnDecisions(state).some((d) => d.id === CAKE_DECISION_ID)).toBe(false)
  })

  it('names the person who is looking, not a generic colleague', () => {
    const d = cakeDecision(5, 'Gemma', 2)
    expect(d.context).toContain('Gemma')
    expect(teamAt(72)).toBeGreaterThan(0)
  })
})
