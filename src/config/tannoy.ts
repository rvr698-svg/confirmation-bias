/**
 * CONFIRMATION BIAS - the tannoy.
 *
 * One announcement at the top of every turn, from an institution that has
 * decided everything is going well. It reacts to the real position, so it is
 * never random noise, and it never tells the player anything the dashboard has
 * not already told them. It is only ever the spin.
 *
 * Every situation carries several lines. A capacity problem lasts months, and
 * hearing the identical sentence five turns running makes the tannoy read as
 * broken rather than relentless, so `sim/tannoy.ts` walks the list by turn.
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
  /** Walked by turn, so a long-running situation keeps finding new words. */
  say: ((c: TannoyContext) => string)[]
}

/** Checked in order. The first few are the loudest situations. */
export const TANNOY: TannoyLine[] = [
  {
    id: 'regulator',
    when: (c) => c.underInvestigation,
    say: [
      () =>
        'Colleagues may see a letter from the regulator described in the press. It is a routine information request and there is no need to say anything to anybody about it at all.',
      () =>
        'The information request is progressing well. Colleagues are reminded not to delete anything, in the ordinary course of business, as usual.',
      () =>
        'An external adviser will be on site this week. They are not an investigator. They are here to help us tell our story.',
    ],
  },
  {
    id: 'clearing',
    when: (c) => c.isClearing,
    say: [
      () =>
        'Clearing is now open. Please do not ask colleagues how it is going. They are also asking how it is going.',
      () => 'The phones are live. The kettle is not a priority. The kettle has been unplugged.',
    ],
  },
  {
    id: 'beds',
    when: (c) => c.bedsTight && c.ratio > 1.02,
    say: [
      () =>
        'Would students without a room please make their way to the Premier Inn, where a distinctive city-centre living experience is waiting for them.',
      () =>
        'Accommodation would like to thank colleagues for their patience, and to confirm that a sofa is not a bed for the purposes of the guarantee.',
      () =>
        'The accommodation guarantee remains in place. The definition of accommodation is under review.',
      () =>
        'Colleagues asking about the halls waiting list are advised that there is now a waiting list for the waiting list.',
    ],
  },
  {
    id: 'rooms',
    when: (c) => c.overCapacity,
    say: [
      () =>
        'A reminder that seminar rooms hold fifteen students, and that the fire regulations are a guide to intent.',
      () =>
        'Timetabling have found four additional rooms. Three of them are the same room at different times.',
      () =>
        'The lecture in Sanderson has been moved to the sports hall. Bring a coat and a strong voice.',
    ],
  },
  {
    id: 'placements',
    when: (c) => c.placementsTight,
    say: [
      (c) =>
        `Placement colleagues are asking anyone with a spare placement, particularly in ${c.placementCulprit}, to come forward. No questions will be asked.`,
      (c) =>
        `${c.placementCulprit} placements remain under discussion with partners. The discussion is going in one direction.`,
      () =>
        'Would any colleague who knows somebody at the trust please make themselves known to the placements team.',
    ],
  },
  {
    id: 'team-gone',
    when: (c) => c.team < 34,
    say: [
      () =>
        'The wellbeing webinar has been rescheduled to the only slot everybody was free, which is 7pm on Friday.',
      () =>
        'Human Resources are running a session on resilience. Attendance is voluntary and will be monitored.',
      () =>
        'The staff survey closes on Friday. Colleagues are encouraged to be candid, within reason.',
    ],
  },
  {
    id: 'team-low',
    when: (c) => c.team < 50,
    say: [
      () => 'There are biscuits in the staff room. There were biscuits in the staff room. Thank you.',
      () =>
        'A reminder that annual leave must be taken within the leave year, and that the leave year ends in six weeks.',
      () => 'The 4pm meeting has been moved to 5pm to make room for the 4pm meeting.',
    ],
  },
  {
    id: 'broke',
    when: (c) => c.budgetLeft < 0,
    say: [
      () =>
        'Finance would like to remind colleagues that the recruitment budget is an annual figure, not a monthly one.',
      () =>
        'All non-essential spend is paused with immediate effect. Essential spend is being defined and we will let you know.',
      () =>
        'The budget position is described in this week’s report as dynamic. Finance have asked us to stop using that word.',
    ],
  },
  {
    id: 'well-under',
    when: (c) => c.ratio < 0.9,
    say: [
      () =>
        'The Vice-Chancellor has asked for a short paper on the pipeline. The paper is due Monday. It is Friday.',
      () =>
        'A cross-institutional recruitment working group has been established. Its first task is to agree its terms of reference.',
      () =>
        'Colleagues are reminded that applications are only one measure of interest, alongside several we have not defined.',
    ],
  },
  {
    id: 'well-over',
    when: (c) => c.ratio > 1.08,
    say: [
      () =>
        'Congratulations on a record year. Estates have asked what a record year means for them, and are awaiting a reply.',
      () =>
        'Marketing are preparing a campaign about our record intake. Admissions have been asked not to comment on the record intake.',
      () =>
        'The growth is being described upstairs as evidence that the strategy is working. Nobody has asked which part.',
    ],
  },
  {
    id: 'off-number',
    when: (c) => Boolean(c.offNumber) && c.turn >= 4,
    say: [
      (c) =>
        `${c.offNumber} would like it noted that ${c.offNumber} is not where anybody expected ${c.offNumber} to be.`,
      (c) => `A review of ${c.offNumber} has been commissioned. It will report after the decisions are made.`,
      (c) =>
        `The head of ${c.offNumber} has requested a meeting. The meeting has been booked for a date after Clearing.`,
    ],
  },
  {
    id: 'late',
    when: (c) => c.turn >= 8,
    say: [
      () =>
        'Results day preparations are complete. The kettle has been descaled. Nothing else has been done.',
      () =>
        'The confirmation rehearsal went well. The rehearsal was of the room booking, not the process.',
    ],
  },
  {
    id: 'mid',
    when: (c) => c.turn >= 5,
    say: [
      () =>
        'The new brand guidelines are now live. The old prospectus remains correct in every respect except the colours.',
    ],
  },
  {
    id: 'early',
    when: () => true,
    say: [
      () =>
        'Welcome back. The strategic plan has been refreshed and now runs to sixty pages, of which four are about students.',
    ],
  },
]

/** Extra lines, used to keep a long quiet cycle from repeating itself. */
export const TANNOY_FILLER: string[] = [
  'The lift is out. Colleagues on the fourth floor are asked to think of it as a wellbeing initiative.',
  'The CRM will be down for scheduled maintenance during the busiest week of the year, as scheduled.',
  'A reminder that the car park barrier is not a decision-making tool and cannot be reasoned with.',
  'Somebody has moved the printer. Nobody has moved the printer. The printer has moved.',
  'The photographs on the new website were taken in June, in the sunshine, by a drone.',
  'Colleagues are reminded that the fire alarm test is at eleven, and that the fire alarm test was yesterday.',
]
