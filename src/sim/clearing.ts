/**
 * CONFIRMATION BIAS - the Clearing calls.
 *
 * Turns the authored call pool into ordinary decisions, so the engine, the
 * debrief, the harness and the acceptance tests all treat a phone call exactly
 * like any other choice. The only thing the interface adds is the clock.
 *
 * Deterministic on the seed: the same cycle always gets the same calls in the
 * same order.
 */

import { CLEARING, CLEARING_CALLS, type ClearingCall } from '../config/clearing'
import { RIVAL } from '../config/rival'
import { SUBJECTS } from '../config/subjects'
import { TOTAL_TURNS } from '../config/config'
import type { Decision } from './types'
import { draw } from './rng'

const subjectName = (id: string) => SUBJECTS.find((s) => s.id === id)?.name ?? id

/** Ids are prefixed so everything downstream can tell a call from a decision. */
export const CALL_PREFIX = 'call:'

export function isClearingCall(decisionId: string): boolean {
  return decisionId.startsWith(CALL_PREFIX)
}

function toDecision(call: ClearingCall): Decision {
  const name = subjectName(call.subject)

  return {
    id: `${CALL_PREFIX}${call.id}`,
    turn: TOTAL_TURNS,
    phase: 'clearing',
    question: `${name}. ${call.grades}.`,
    context: call.detail,
    options: [
      {
        id: 'take',
        label: 'Make them an offer',
        blurb: call.below > 0 ? `${call.below} below your standard offer.` : 'Qualified, on the number.',
        effects: [
          {
            lever: 'clearingShare',
            op: 'add',
            value: CLEARING.sharePerCall,
            delay: 0,
            note: `you took a Clearing call for ${name}`,
          },
          {
            lever: 'entryProfile',
            op: 'add',
            value: call.below * CLEARING.profilePerGrade,
            delay: 0,
            note:
              call.below > 0
                ? `the ${name} Clearing offer came in below your standard`
                : `the ${name} Clearing offer held your standard`,
          },
          {
            lever: 'access',
            op: 'add',
            value: call.target ? CLEARING.accessPerCall : -CLEARING.accessPerCall * 0.3,
            delay: 0,
            note: call.target
              ? 'the Clearing offer went to an applicant from a target group'
              : 'the Clearing offer diluted your access share a little',
          },
          {
            lever: 'team',
            op: 'add',
            value: -CLEARING.teamPerCall,
            delay: 0,
            note: 'another hour on the phones',
          },
        ],
      },
      {
        id: 'pass',
        label: 'Not for us',
        blurb: RIVAL.lostLine('They'),
        effects: [],
      },
    ],
  }
}

/** The calls for this cycle, in the order they ring. */
export function clearingCalls(seed: number): Decision[] {
  return [...CLEARING_CALLS]
    .map((call) => ({ call, roll: draw(seed, `clearing:${call.id}`) }))
    .sort((a, b) => a.roll - b.roll)
    .slice(0, CLEARING.callCount)
    .map(({ call }) => toDecision(call))
}
