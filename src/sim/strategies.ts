/**
 * Play styles for the harness.
 *
 * These are the archetypes a real admissions professional would recognise in
 * a colleague. If any one of them sweeps all five measures, the model is wrong
 * and the game is pointless, so the harness checks exactly that.
 */

import { draw } from './rng'
import { isClearingCall } from './clearing'
import { preferring, type Strategy } from './playthrough'
import type { BrightIdea } from '../config/interruptions'
import type { Decision, GameEvent } from './types'

type Plan = Record<string, string>

function planned(
  name: string,
  plan: Plan,
  eventPrefs: string[],
  ideaPrefs: string[],
  /** How this archetype answers the phone in Clearing. */
  callPref: 'take' | 'pass' = 'pass',
): Strategy {
  return {
    name,
    pickDecision: (d: Decision) =>
      isClearingCall(d.id)
        ? callPref
        : (plan[d.id] ?? d.options[Math.floor(d.options.length / 2)].id),
    pickEventResponse: (e: GameEvent) => preferring(eventPrefs, e.response!.options),
    pickIdeaResponse: (i: BrightIdea) => preferring(ideaPrefs, i.options),
  }
}

/** How each archetype handles a senior colleague with an initiative. */
const IDEA_PREFS = {
  /** Says yes to anything that might produce a student. */
  chase: ['build', 'yes', 'resource', 'go', 'host', 'run', 'let', 'pilot', 'agree'],
  /** Protects selection, deflects everything else. */
  profile: ['agree', 'hold', 'no', 'refuse', 'sample', 'explain', 'later'],
  /** Deflects everything, politely. */
  team: ['defer', 'later', 'marketing', 'weekly', 'no', 'name-only', 'sample', 'half'],
  /** The cheapest available answer, every time. */
  budget: ['defer', 'no', 'refuse', 'marketing', 'weekly', 'name-only', 'agree', 'cancel'],
  /** Says yes to anything that widens the intake. */
  access: ['run', 'build', 'resource', 'move', 'assist', 'funded', 'pilot'],
}

/** Hit the number. Everything else is a problem for the autumn. */
const CHASE: Plan = {
  'd1-stance': 'push',
  'd1-capacity': 'processing',
  'd1-opendays': 'four-small',
  'd2-entry': 'lower',
  'd2-agents': 'grow',
  'd3-offers': 'loosen',
  'd3-turnaround': 'ten-public',
  'd4-interview': 'task',
  'd4-contextual': 'two-grades',
  'd5-volumes': 'second-wave',
  'd5-staffing': 'recruit',
  'd6-target': 'accept',
  'd6-competitor': 'match',
  'd7-conversion': 'full',
  'd7-applicantdays': 'three-plus',
  'd8-position': 'insurance',
  'd2-conditions': 'unconditional',
  'd9-prep': 'rehearsal',
  'd9-accommodation': 'overflow',
  'd10-nearmiss': 'confirm-all',
  'd10-clearing': 'wide',
  'd10-staffing': 'everyone',
}

/** Quality above all. Empty seats are survivable. A weak profile is not. */
const PROFILE: Plan = {
  'd1-stance': 'under',
  'd1-capacity': 'even',
  'd1-opendays': 'two-big',
  'd2-entry': 'higher',
  'd2-agents': 'hold',
  'd3-offers': 'tighten',
  'd3-turnaround': 'twenty-quiet',
  'd4-interview': 'everyone',
  'd4-contextual': 'as-is',
  'd5-volumes': 'pull-back',
  'd5-staffing': 'recruit',
  'd6-target': 'negotiate',
  'd6-competitor': 'differentiate',
  'd7-conversion': 'targeted',
  'd7-applicantdays': 'two',
  'd8-position': 'firms',
  'd2-conditions': 'standard',
  'd9-prep': 'rehearsal',
  'd9-accommodation': 'wait',
  'd10-nearmiss': 'hold',
  'd10-clearing': 'adjustment',
  'd10-staffing': 'admissions',
}

/** Nobody burns out on my watch. */
const TEAM: Plan = {
  'd1-stance': 'under',
  'd1-capacity': 'even',
  'd1-opendays': 'digital',
  'd2-entry': 'hold',
  'd2-agents': 'hold',
  'd3-offers': 'standard',
  'd3-turnaround': 'none',
  'd4-interview': 'task',
  'd4-contextual': 'one-grade',
  'd5-volumes': 'nerve',
  'd5-staffing': 'recruit',
  'd6-target': 'negotiate',
  'd6-competitor': 'ignore',
  'd7-conversion': 'email',
  'd7-applicantdays': 'online',
  'd8-position': 'firms',
  'd2-conditions': 'standard',
  'd9-prep': 'agency',
  'd9-accommodation': 'wait',
  'd10-nearmiss': 'confirm-all',
  'd10-clearing': 'selective',
  'd10-staffing': 'outsource',
}

/** The budget is the only number anyone can prove. */
const BUDGET: Plan = {
  'd1-stance': 'under',
  'd1-capacity': 'even',
  'd1-opendays': 'digital',
  'd2-entry': 'hold',
  'd2-agents': 'schools',
  'd3-offers': 'standard',
  'd3-turnaround': 'none',
  'd4-interview': 'task',
  'd4-contextual': 'one-grade',
  'd5-volumes': 'nerve',
  'd5-staffing': 'absorb',
  'd6-target': 'negotiate',
  'd6-competitor': 'ignore',
  'd7-conversion': 'email',
  'd7-applicantdays': 'online',
  'd8-position': 'firms',
  'd2-conditions': 'standard',
  'd9-prep': 'light',
  'd9-accommodation': 'cap',
  'd10-nearmiss': 'confirm-all',
  'd10-clearing': 'adjustment',
  'd10-staffing': 'admissions',
}

/** The access plan is a legal commitment, not an aspiration. */
const ACCESS: Plan = {
  'd1-stance': 'hold',
  'd1-capacity': 'even',
  'd1-opendays': 'four-small',
  'd2-entry': 'lower',
  'd2-agents': 'schools',
  'd3-offers': 'standard',
  'd3-turnaround': 'twenty-quiet',
  'd4-interview': 'shortlist',
  'd4-contextual': 'two-grades',
  'd5-volumes': 'nerve',
  'd5-staffing': 'recruit',
  'd6-target': 'negotiate',
  'd6-competitor': 'differentiate',
  'd7-conversion': 'full',
  'd7-applicantdays': 'three-plus',
  'd8-position': 'balanced',
  'd2-conditions': 'unconditional',
  'd9-prep': 'rehearsal',
  'd9-accommodation': 'overflow',
  'd10-nearmiss': 'selective',
  'd10-clearing': 'wide',
  'd10-staffing': 'everyone',
}

const middle: Strategy = {
  name: 'Balanced',
  pickDecision: (d) => d.options[Math.floor(d.options.length / 2)].id,
  pickEventResponse: (e) => e.response!.options[Math.floor(e.response!.options.length / 2)].id,
  pickIdeaResponse: (i) => i.options[Math.floor(i.options.length / 2)].id,
}

function randomStrategy(seed: number): Strategy {
  const pick = <T extends { id: string }>(opts: T[], label: string) =>
    opts[Math.min(opts.length - 1, Math.floor(draw(seed, label) * opts.length))].id

  return {
    name: 'Random',
    pickDecision: (d) => pick(d.options, `choice:${d.id}`),
    pickEventResponse: (e) => pick(e.response!.options, `event-choice:${e.id}`),
    pickIdeaResponse: (i) => pick(i.options, `idea-choice:${i.id}`),
  }
}

export function allStrategies(seed: number): Strategy[] {
  return [
    planned('Chase the number', CHASE, ['honour', 'commit', 'refuse', 'transfer'], IDEA_PREFS.chase, 'take'),
    planned('Protect the profile', PROFILE, ['withdraw', 'letter', 'refuse', 'release'], IDEA_PREFS.profile, 'pass'),
    planned('Protect the team', TEAM, ['devolve', 'letter', 'refuse', 'transfer'], IDEA_PREFS.team, 'pass'),
    planned('Protect the budget', BUDGET, ['devolve', 'letter', 'marketing', 'transfer'], IDEA_PREFS.budget, 'pass'),
    planned('Access first', ACCESS, ['honour', 'commit', 'refuse', 'transfer'], IDEA_PREFS.access, 'take'),
    middle,
    randomStrategy(seed),
  ]
}

export const STRATEGY_NAMES = [
  'Chase the number',
  'Protect the profile',
  'Protect the team',
  'Protect the budget',
  'Access first',
  'Balanced',
  'Random',
]
