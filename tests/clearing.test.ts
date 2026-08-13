/**
 * Clearing is the only part of the game that runs against a clock, so the
 * calls have to behave like ordinary decisions everywhere except the screen.
 * If they do not, the debrief, the harness and the acceptance tests all lie.
 */

import { describe, expect, it } from 'vitest'
import { CLEARING } from '../src/config/clearing'
import { TOTAL_TURNS } from '../src/config/config'
import { clearingCalls, isClearingCall } from '../src/sim/clearing'
import {
  beginTurn,
  commitTurn,
  finalPosition,
  startGame,
  turnDecisions,
  turnIsAnswerable,
} from '../src/sim/engine'
import type { GameState } from '../src/sim/types'

/** Walk a cycle to the Clearing phase, answering everything the dull way. */
function toClearing(seed: number): GameState {
  let state = startGame(seed)
  let guard = 0

  while (state.phase === 'playing' && state.turnPhase !== 'clearing' && guard++ < 40) {
    const choices: Record<string, string> = {}
    for (const d of turnDecisions(state)) choices[d.id] = d.options[0].id
    const eventChoices: Record<string, string> = {}
    for (const e of state.pendingEvents) eventChoices[e.id] = e.response!.options[0].id
    const idea = state.pendingIdea ? state.pendingIdea.options[0].id : undefined

    state = commitTurn(state, choices, eventChoices, idea)
    if (state.phase === 'playing') state = beginTurn(state)
  }
  return state
}

describe('Clearing', () => {
  it('rings a fixed number of times', () => {
    expect(clearingCalls(1234)).toHaveLength(CLEARING.callCount)
  })

  it('gives the same cycle the same calls', () => {
    const a = clearingCalls(99).map((c) => c.id)
    const b = clearingCalls(99).map((c) => c.id)
    const other = clearingCalls(100).map((c) => c.id)

    expect(a).toEqual(b)
    expect(a).not.toEqual(other)
  })

  it('puts the calls in the Clearing deck and nowhere else', () => {
    const state = toClearing(7)
    expect(state.turnPhase).toBe('clearing')

    const calls = turnDecisions(state).filter((d) => isClearingCall(d.id))
    expect(calls).toHaveLength(CLEARING.callCount)
    for (const c of calls) {
      expect(c.turn).toBe(TOTAL_TURNS)
      expect(c.phase).toBe('clearing')
      expect(c.options.map((o) => o.id)).toEqual(['take', 'pass'])
    }

    const earlier = startGame(7)
    expect(turnDecisions(earlier).some((d) => isClearingCall(d.id))).toBe(false)
  })

  it('lets the clock answer for you', () => {
    // Running out of time passes every remaining call, which has to leave the
    // turn answerable or the player is stuck on a phone that stopped ringing.
    const state = toClearing(21)
    const choices: Record<string, string> = {}
    for (const d of turnDecisions(state)) choices[d.id] = isClearingCall(d.id) ? 'pass' : d.options[0].id

    expect(turnIsAnswerable(state, choices, {}, undefined)).toBe(true)
  })

  it('costs you students to be too slow', () => {
    const state = toClearing(33)
    const decisions = turnDecisions(state)

    const answer = (call: string) => {
      const choices: Record<string, string> = {}
      for (const d of decisions) choices[d.id] = isClearingCall(d.id) ? call : d.options[0].id
      return commitTurn(state, choices, {}, undefined)
    }

    // The history record deliberately holds what the player was shown before
    // committing, so the comparison has to be against the final position.
    const intakeOf = (s: GameState) => finalPosition(s).pipeline.enrolled

    expect(intakeOf(answer('take'))).toBeGreaterThan(intakeOf(answer('pass')))
  })

  it('charges for the students it wins', () => {
    const state = toClearing(44)
    const decisions = turnDecisions(state)
    const choices: Record<string, string> = {}
    for (const d of decisions) choices[d.id] = isClearingCall(d.id) ? 'take' : d.options[0].id

    const after = commitTurn(state, choices, {}, undefined)
    const callEntries = after.queue.filter((m) => m.sourceId.startsWith('call:'))

    // Every taken call touches the number, the profile, the access share and
    // the team. None of it lands later: there is no later.
    expect(callEntries.length).toBeGreaterThan(0)
    for (const m of callEntries) expect(m.landsTurn).toBe(m.appliedTurn)
    expect(callEntries.some((m) => m.lever === 'clearingShare')).toBe(true)
    expect(callEntries.some((m) => m.lever === 'team')).toBe(true)
  })
})
