/**
 * ADMISSIONS! - the last thing you read.
 *
 * Written in the institution's own voice: the newsletter, the press office and
 * the board paper, all of which have already decided this was a success. The
 * situation is always exactly what happened. Only the spin is absurd.
 *
 * Ordered most specific first, so the striking failures get named rather than
 * averaged into something polite.
 *
 * Copy, not logic. `sim/scoring.ts` picks the first line whose `when` is true.
 */

import type { BandKey } from '../sim/types'

export interface VerdictContext {
  /** Intake over target. 1.1 is ten per cent over. */
  ratio: number
  /** The fine, £k. Zero unless the regulator got involved. */
  fine: number
  /** Places the fine won you, because it counts as spend per student. */
  finePlaces: number
  bandOf: (measureId: string) => BandKey
  strongCount: number
  exposedCount: number
  overall: number
  breach: { teaching: boolean; beds: boolean; placement: boolean }
  /** The area furthest from its own number, named. */
  offNumber: string | null
  /** Whoever ate the placements. Nursing, usually. */
  placementCulprit: string
  league: { position: number; movement: number; ordinal: string }
}

export interface Verdict {
  id: string
  when: (c: VerdictContext) => boolean
  line: (c: VerdictContext) => string
}

export const VERDICTS: Verdict[] = [
  {
    // Nothing outranks being fined. Not even breaking the campus.
    id: 'regulator',
    when: (c) => c.fine > 0,
    line: (c) =>
      c.finePlaces > 0
        ? `You were fined £${c.fine.toLocaleString('en-GB')}k for confirming applicants who did not meet their conditions. The good news, per the planning office, is that the fine counts towards spend per student, so you went up ${c.finePlaces} place${c.finePlaces === 1 ? '' : 's'} in the table for it.`
        : `You were fined £${c.fine.toLocaleString('en-GB')}k for confirming applicants who did not meet their conditions. The press office is calling it a routine information request. It is on page four of the local paper.`,
  },
  {
    id: 'broke-the-campus',
    when: (c) => c.ratio > 1.12 && c.breach.teaching && c.breach.beds,
    line: () =>
      'Whoops. You have more students than campus. The newsletter is calling it a record year and pointing out, correctly, that they do not all come to every lecture.',
  },
  {
    id: 'no-placements',
    when: (c) => c.breach.placement && c.ratio > 1.05,
    line: (c) =>
      `${c.placementCulprit} recruited magnificently. ${c.placementCulprit} has nowhere to put them. Both facts are in the newsletter, two paragraphs apart.`,
  },
  {
    id: 'over',
    when: (c) => c.ratio > 1.08,
    line: () =>
      'A record intake, celebrated in September by everyone, and in January by nobody. Estates have started a group chat.',
  },
  {
    id: 'under-badly',
    when: (c) => c.ratio < 0.86,
    line: () =>
      'The shortfall has been described as a realignment to market conditions. You know this because you are the one writing that sentence, on a Sunday, for the board.',
  },
  {
    id: 'quality-empty-seats',
    when: (c) => c.ratio < 0.95 && c.bandOf('league') === 'strong',
    line: (c) =>
      `You climbed to ${c.league.ordinal} with beautifully qualified students and a worrying number of empty chairs. Marketing want the table on a banner. Finance want a word.`,
  },
  {
    id: 'team-gone',
    when: (c) => c.bandOf('team') === 'exposed',
    line: () =>
      'You made the number. Your team made the number. Three of them have made other plans, and the exit interviews are going to be quite specific.',
  },
  {
    id: 'bought-it',
    when: (c) => c.bandOf('budget') === 'exposed',
    line: () =>
      'You bought this intake. Finance noticed. There is now a spreadsheet with your name on the tab and it is not a friendly tab.',
  },
  {
    id: 'safe-students',
    when: (c) => c.bandOf('access') === 'exposed' && c.bandOf('league') === 'strong',
    line: (c) =>
      `Up to ${c.league.ordinal}, achieved by recruiting the students who were always coming anyway. The word "strategy" appears four times in the write-up.`,
  },
  {
    id: 'good-cycle',
    when: (c) => c.strongCount >= 3 && c.exposedCount === 0,
    line: () =>
      'A genuinely good cycle. The newsletter has credited the new brand, the new website and a photograph of a building. You know what you did.',
  },
  {
    id: 'competent',
    when: (c) => c.overall >= 62,
    line: (c) =>
      c.offNumber
        ? `A competent cycle with one thing nobody has looked at closely, and that thing is ${c.offNumber}. Please keep it that way.`
        : 'A competent cycle with one thing nobody has looked at closely. Please keep it that way.',
  },
  {
    id: 'two-failures',
    when: (c) => c.exposedCount >= 2,
    line: () =>
      'Two things went badly, and they were the two things that always go badly together. The review will call this a systemic issue and commission a working group.',
  },
]

export const VERDICT_FALLBACK =
  'You got through it, which is what most cycles are. The newsletter will describe it as a strong and confident year.'

/**
 * The breach lines. Same voice: what happened, then what it is being called.
 */
export const BREACH_LINES = {
  teaching: (over: string) =>
    `${over} students beyond timetabled teaching capacity. Seminar groups are at 28. The prospectus says 15. Both are true, at different times of day.`,
  accommodation: (over: string) =>
    `${over} beds short of your accommodation guarantee. Some of them started university in a Premier Inn, which the newsletter is calling a distinctive city-centre living experience.`,
  placement: (over: string, culprit: string) =>
    `${over} placements short, most of it ${culprit}. Those students cannot progress until you find one. The word being used in meetings is "sequencing".`,
}
