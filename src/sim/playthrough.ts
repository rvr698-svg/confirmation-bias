/**
 * Headless playthrough. Used by the harness and the tests.
 *
 * A Strategy is just a pair of pickers. Everything else runs through exactly
 * the same engine calls the interface uses, so if the harness says a strategy
 * dominates, it dominates in the real game too.
 */

import { beginTurn, commitTurn, startGame, turnDecisions } from './engine'
import { buildDebrief, type Debrief } from './debrief'
import type { BrightIdea } from '../config/interruptions'
import type { Decision, GameEvent, GameState } from './types'

export interface Strategy {
  name: string
  pickDecision: (d: Decision, state: GameState) => string
  pickEventResponse: (e: GameEvent, state: GameState) => string
  pickIdeaResponse: (i: BrightIdea, state: GameState) => string
}

export function runPlaythrough(seed: number, strategy: Strategy): { state: GameState; debrief: Debrief } {
  let state = startGame(seed)
  let guard = 0

  while (state.phase === 'playing' && guard++ < 40) {
    const decisionChoices: Record<string, string> = {}
    for (const d of turnDecisions(state)) {
      decisionChoices[d.id] = strategy.pickDecision(d, state)
    }

    const eventChoices: Record<string, string> = {}
    for (const e of state.pendingEvents) {
      eventChoices[e.id] = strategy.pickEventResponse(e, state)
    }

    const ideaChoice = state.pendingIdea
      ? strategy.pickIdeaResponse(state.pendingIdea, state)
      : undefined

    state = commitTurn(state, decisionChoices, eventChoices, ideaChoice)
    if (state.phase === 'playing') state = beginTurn(state)
  }

  return { state, debrief: buildDebrief(state) }
}

/** Pick the option whose id appears earliest in the preference list. */
export function preferring(preferences: string[], options: Array<{ id: string }>): string {
  for (const p of preferences) {
    const hit = options.find((o) => o.id === p)
    if (hit) return hit.id
  }
  return options[Math.floor(options.length / 2)].id
}
