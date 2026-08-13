/**
 * CONFIRMATION BIAS - the tannoy.
 *
 * One announcement at the top of every turn, from an institution that has
 * decided everything is going well. It reacts to the real position, so it is
 * never random noise, and it never tells the player anything the dashboard has
 * not already told them. It is only ever the spin.
 *
 * Cosmetic. Nothing here touches the model.
 */

export interface TannoyContext {
  turn: number
  /** Projected intake over target. The player's own noisy figure. */
  ratio: number
  team: number
  budgetLeft: number
  overCapacity: boolean
  bedsTight: boolean
  placementsTight: boolean
  /** Named subject furthest from its own number, if any. */
  offNumber: string | null
  /** The area that actually consumes the placements. Not the same thing. */
  placementCulprit: string
  /** True once the regulator has taken an interest. */
  underInvestigation: boolean
  isClearing: boolean
}

export interface TannoyLine {
  id: string
  when: (c: TannoyContext) => boolean
  say: (c: TannoyContext) => string
}

/** Checked in order. The first few are the loudest situations. */
export const TANNOY: TannoyLine[] = [
  {
    id: 'regulator',
    when: (c) => c.underInvestigation,
    say: () =>
      'Colleagues may see a letter from the regulator described in the press. It is a routine information request and there is no need to say anything to anybody about it at all.',
  },
  {
    id: 'clearing',
    when: (c) => c.isClearing,
    say: () =>
      'Clearing is now open. Please do not ask colleagues how it is going. They are also asking how it is going.',
  },
  {
    id: 'beds',
    when: (c) => c.bedsTight && c.ratio > 1.02,
    say: () =>
      'Would students without a room please make their way to the Premier Inn, where a distinctive city-centre living experience is waiting for them.',
  },
  {
    id: 'rooms',
    when: (c) => c.overCapacity,
    say: () =>
      'A reminder that seminar rooms hold fifteen students, and that the fire regulations are a guide to intent.',
  },
  {
    id: 'placements',
    when: (c) => c.placementsTight,
    say: (c) =>
      `Placement colleagues are asking anyone with a spare placement, particularly in ${c.placementCulprit}, to come forward. No questions will be asked.`,
  },
  {
    id: 'team-gone',
    when: (c) => c.team < 34,
    say: () =>
      'The wellbeing webinar has been rescheduled to the only slot everybody was free, which is 7pm on Friday.',
  },
  {
    id: 'team-low',
    when: (c) => c.team < 50,
    say: () =>
      'There are biscuits in the staff room. There were biscuits in the staff room. Thank you.',
  },
  {
    id: 'broke',
    when: (c) => c.budgetLeft < 0,
    say: () =>
      'Finance would like to remind colleagues that the recruitment budget is an annual figure, not a monthly one.',
  },
  {
    id: 'well-under',
    when: (c) => c.ratio < 0.9,
    say: () =>
      'The Vice-Chancellor has asked for a short paper on the pipeline. The paper is due Monday. It is Friday.',
  },
  {
    id: 'well-over',
    when: (c) => c.ratio > 1.08,
    say: () =>
      'Congratulations on a record year. Estates have asked what a record year means for them, and are awaiting a reply.',
  },
  {
    id: 'off-number',
    when: (c) => Boolean(c.offNumber) && c.turn >= 4,
    say: (c) =>
      `${c.offNumber} would like it noted that ${c.offNumber} is not where anybody expected ${c.offNumber} to be.`,
  },
  {
    id: 'late',
    when: (c) => c.turn >= 8,
    say: () =>
      'Results day preparations are complete. The kettle has been descaled. Nothing else has been done.',
  },
  {
    id: 'mid',
    when: (c) => c.turn >= 5,
    say: () =>
      'The new brand guidelines are now live. The old prospectus remains correct in every respect except the colours.',
  },
  {
    id: 'early',
    when: () => true,
    say: () =>
      'Welcome back. The strategic plan has been refreshed and now runs to sixty pages, of which four are about students.',
  },
]

/** Extra lines, used to keep a long cycle from repeating itself. */
export const TANNOY_FILLER: string[] = [
  'The lift is out. Colleagues on the fourth floor are asked to think of it as a wellbeing initiative.',
  'The CRM will be down for scheduled maintenance during the busiest week of the year, as scheduled.',
  'A reminder that the car park barrier is not a decision-making tool and cannot be reasoned with.',
  'Somebody has moved the printer. Nobody has moved the printer. The printer has moved.',
  'The photographs on the new website were taken in June, in the sunshine, by a drone.',
]
