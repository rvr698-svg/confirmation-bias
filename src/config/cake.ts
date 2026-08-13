/**
 * ADMISSIONS! - the cake.
 *
 * The one moment in the cycle where the answer is not a resourcing decision.
 * Somebody has started looking for another job, the rest are stretched, and
 * you have a Friday afternoon and forty pounds.
 *
 * It is written as an ordinary decision so the engine, the debrief and the
 * harness treat it like everything else. What makes it different is when it
 * appears: only when the roster says it should.
 */

import { CAKE } from './team'
import type { Decision } from '../sim/types'

export const CAKE_DECISION_ID = 'team-cake'

export function cakeDecision(turn: number, whoIsLooking: string, stretched: number): Decision {
  return {
    id: CAKE_DECISION_ID,
    turn,
    question: 'It is Friday and the team are on their knees.',
    context: `${whoIsLooking} has started looking. ${stretched} of the others are stretched to the point where they have stopped volunteering for things. Nobody has asked you for anything, which is the part that should worry you.`,
    options: [
      {
        id: 'cake',
        label: 'Buy them cake and say thank you properly',
        blurb: 'Forty pounds and an hour. Say what they actually did, by name.',
        effects: [
          { lever: 'spend', op: 'add', value: CAKE.spend, delay: 0, note: 'you bought the team cake' },
          {
            lever: 'team',
            op: 'add',
            value: CAKE.team,
            delay: 0,
            note: 'the team were thanked properly, by name, and it landed',
          },
        ],
      },
      {
        id: 'thanks',
        label: 'Send a thank you email to the whole team',
        blurb: 'Free, sincere, and read on a phone at a bus stop.',
        effects: [
          {
            lever: 'team',
            op: 'add',
            value: Math.round(CAKE.team / 3),
            delay: 0,
            note: 'the thank you email was noticed, briefly',
          },
        ],
      },
      {
        id: 'later',
        label: 'Do something properly once Clearing is over',
        blurb: 'You mean it. Everybody in the room has heard it before.',
        effects: [
          {
            lever: 'team',
            op: 'add',
            value: -2,
            delay: 1,
            note: 'the promise of something after Clearing was heard, and counted',
          },
        ],
      },
    ],
  }
}

/** What Marge says when the cake works. Shown on the card once answered. */
export const CAKE_RESULT: Record<string, string> = {
  cake: 'They have agreed, unprompted, to see Clearing through. Nobody wrote it down, which is how you know it was meant.',
  thanks: 'Two of them replied. One of them replied to all.',
  later: 'Everybody said that was fine. Everybody has heard it before.',
}
