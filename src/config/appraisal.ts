/**
 * ADMISSIONS! - two lines for your appraisal.
 *
 * Banded by thirds like the signpost, and drawn from a pool inside the band so
 * that two people who both scored 3 out of 5 do not read each other's line and
 * find it word for word identical.
 *
 * Which line you get is not random. It is drawn from the seed and from the
 * shape of the cycle you actually ran, so the same run always produces the
 * same appraisal, and a different set of choices produces a different one.
 *
 * Every line is true. That is the joke and it is also the constraint: nothing
 * in here may claim anything the scorecard does not already say.
 */

export interface AppraisalContext {
  intake: string
  target: string
  /**
   * The best and worst measures by score. Two forms of each: the scorecard
   * name for the start of a sentence, and the phrase that reads correctly in
   * the middle of one.
   */
  best: string
  bestPhrase: string
  worst: string
  worstPhrase: string
  worstDetail: string
  onNumber: boolean
  fined: boolean
}

type Line = (c: AppraisalContext) => string

export interface AppraisalBand {
  /** Lowest overall score out of five this band covers. Checked high to low. */
  min: number
  achievements: Line[]
  developments: Line[]
}

export const APPRAISAL_BANDS: AppraisalBand[] = [
  {
    // 4 and 5 out of 5. Quietly pleased with itself, as it should be.
    min: 4,
    achievements: [
      (c) =>
        `Delivered ${c.intake} enrolments against a target of ${c.target}, sustaining performance on ${c.bestPhrase} through a cycle in which most of the sector moved.`,
      (c) =>
        `Led the recruitment cycle end to end to ${c.intake} against ${c.target}, protecting ${c.bestPhrase} at the points in the year where it would have been easiest not to.`,
      (c) =>
        `Managed five competing measures to an intake of ${c.intake} against ${c.target}, with ${c.bestPhrase} the standout and no escalation to the executive at any point.`,
      (c) =>
        `Achieved ${c.intake} enrolments against ${c.target}. Strength on ${c.bestPhrase} is evidenced in the cycle debrief and was the result of decisions taken in the autumn.`,
    ],
    developments: [
      (c) => `Development area for the coming cycle: ${c.worstPhrase}. ${c.worstDetail}`,
      (c) =>
        `Objective for next year: strengthen ${c.worstPhrase}, which closed less well than the rest. ${c.worstDetail}`,
      (c) =>
        `One area to build on: ${c.worstPhrase}. ${c.worstDetail} Worth an early conversation rather than a late one.`,
      (c) =>
        `With hindsight, ${c.worstPhrase} was the trade-off that paid for the rest. ${c.worstDetail}`,
    ],
  },
  {
    // 3 out of 5. The most common outcome, and the most quietly damning.
    min: 3,
    achievements: [
      (c) =>
        c.onNumber
          ? `Delivered ${c.intake} enrolments against a target of ${c.target}, landing on the number in a competitive market.`
          : `Delivered ${c.intake} enrolments against a target of ${c.target} in a competitive market, with ${c.bestPhrase} the strongest of the five measures.`,
      (c) =>
        `Maintained recruitment at ${c.intake} against ${c.target} across a full cycle, holding ${c.bestPhrase} while managing competing institutional priorities.`,
      (c) =>
        `Ran the cycle to ${c.intake} against ${c.target}, balancing five measures that cannot all be met and prioritising ${c.bestPhrase}.`,
      (c) =>
        `Completed the recruitment cycle at ${c.intake} against a target of ${c.target}, with performance on ${c.bestPhrase} maintained throughout.`,
    ],
    developments: [
      (c) => `Development area: ${c.worstPhrase}. ${c.worstDetail}`,
      (c) =>
        `Area for attention next cycle: ${c.worstPhrase}, which did not close where it needed to. ${c.worstDetail}`,
      (c) =>
        `Priority for the coming year: ${c.worstPhrase}. ${c.worstDetail} A plan for this will be brought forward.`,
      (c) =>
        `Learning point: ${c.worstPhrase} was visible by the spring and was not recovered. ${c.worstDetail}`,
    ],
  },
  {
    // 1 and 2 out of 5. Still true, and still something you could hand in.
    min: 0,
    achievements: [
      (c) =>
        `Held the recruitment operation together through an exceptionally difficult cycle, finishing on ${c.intake} against a target of ${c.target}.`,
      (c) =>
        `Completed a full recruitment cycle to ${c.intake} against ${c.target} under sustained pressure across every measure, retaining ${c.bestPhrase} as the least affected.`,
      (c) =>
        `Delivered ${c.intake} enrolments against a target of ${c.target} in circumstances where several of the levers involved sat outside the department.`,
      (c) =>
        c.fined
          ? `Delivered ${c.intake} enrolments against ${c.target} and led the institutional response to the regulatory enquiry that followed.`
          : `Managed the cycle to ${c.intake} against ${c.target} while absorbing significant in-year disruption.`,
    ],
    developments: [
      (c) =>
        `Development areas: ${c.worstPhrase} and, candidly, most of the others. ${c.worstDetail}`,
      (c) =>
        `Substantial development required on ${c.worstPhrase}. ${c.worstDetail} Support has been offered.`,
      (c) =>
        `${c.worst} is the immediate priority and will be the subject of a formal plan. ${c.worstDetail}`,
      (c) =>
        `Reflection for next cycle: ${c.worstPhrase} needed intervention earlier than it got one. ${c.worstDetail}`,
    ],
  },
]

export function appraisalBandFor(overallOf5: number): AppraisalBand {
  return (
    APPRAISAL_BANDS.find((b) => overallOf5 >= b.min) ?? APPRAISAL_BANDS[APPRAISAL_BANDS.length - 1]
  )
}
