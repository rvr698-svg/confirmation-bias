/**
 * ADMISSIONS! - Clearing.
 *
 * The one part of the cycle that happens in real time. Nine turns of decisions
 * that land three months later, and then this: a phone that will not stop, and
 * answers measured in seconds.
 *
 * The calls are the same kind of trade-off as every other decision in the game
 * — number against profile against access — except you have to make it now.
 * A call you do not answer in time rings somebody else, which is exactly what
 * happens on the day.
 *
 * All magnitudes are PLACEHOLDER and require sign-off.
 */

export const CLEARING = {
  /**
   * The whole session, in seconds, for all of the calls. Deliberately less
   * time than a careful person needs: about six seconds a call, against a
   * decision that has a real trade-off in it. Being too slow is not a
   * penalty, it is a caller ringing somebody else.
   */
  seconds: 55,
  /** How many calls come through. Drawn from the pool below. */
  callCount: 8,
  /** Under this many seconds the clock goes red and starts counting louder. */
  panicSeconds: 15,
  /** Each call taken adds this to the Clearing share of intake. */
  sharePerCall: 0.007,
  /** Each call taken costs the team this much. It is a long day. */
  teamPerCall: 0.5,
  /** Entry profile movement per grade below your standard offer. */
  profilePerGrade: -0.55,
  /** Access movement when the caller is from a target group. */
  accessPerCall: 0.004,
} as const

export interface ClearingCall {
  id: string
  /** Subject id from `config/subjects.ts`, for the line the game writes. */
  subject: string
  /** What they are holding, and what you normally ask for. */
  grades: string
  /** Grades below your standard offer. Zero is a clean call. */
  below: number
  /** From an access and participation target group. */
  target: boolean
  /** One dry line. No pronouns: a caller is always "they". */
  detail: string
}

export const CLEARING_CALLS: ClearingCall[] = [
  {
    id: 'c-nursing-clean',
    subject: 'health',
    grades: 'BBB, holding BBB',
    below: 0,
    target: false,
    detail: 'Firmed elsewhere in January and has changed their mind twice since breakfast.',
  },
  {
    id: 'c-nursing-two',
    subject: 'health',
    grades: 'BCC against BBC',
    below: 2,
    target: true,
    detail: 'First in the family to apply. Has already rung four places today and sounds tired.',
  },
  {
    id: 'c-business-clean',
    subject: 'business',
    grades: 'BBC, holding BBC',
    below: 0,
    target: false,
    detail: 'Wants to know about the placement year and the gym, in that order.',
  },
  {
    id: 'c-business-one',
    subject: 'business',
    grades: 'BCC against BBC',
    below: 1,
    target: false,
    detail: 'Very calm. Has a spreadsheet of every offer they have been made today.',
  },
  {
    id: 'c-computing-strong',
    subject: 'computing',
    grades: 'AAB against BBB',
    below: -1,
    target: false,
    detail: 'Better grades than your standard offer and three other places want them.',
  },
  {
    id: 'c-computing-three',
    subject: 'computing',
    grades: 'CCD against BBC',
    below: 3,
    target: true,
    detail: 'Came through a college access course. Missed by more than a bit.',
  },
  {
    id: 'c-arts-portfolio',
    subject: 'arts',
    grades: 'CCC against BCC',
    below: 1,
    target: true,
    detail: 'Has emailed a portfolio nobody has time to open. It is, apparently, very good.',
  },
  {
    id: 'c-arts-clean',
    subject: 'arts',
    grades: 'BCC, holding BCC',
    below: 0,
    target: false,
    detail: 'Deferred last year and would like to know if that counts against them.',
  },
  {
    id: 'c-engineering-clean',
    subject: 'engineering',
    grades: 'BBC, holding BBC',
    below: 0,
    target: false,
    detail: 'Asking whether the workshop is the one in the photographs.',
  },
  {
    id: 'c-engineering-two',
    subject: 'engineering',
    grades: 'CCC against BBC',
    below: 2,
    target: false,
    detail: 'Wants the course their sibling did. Their sibling did it in 2019, when it was easier.',
  },
  {
    id: 'c-health-mature',
    subject: 'health',
    grades: 'Access Diploma, merit',
    below: 1,
    target: true,
    detail: 'Thirty-four, two children, works nights, and has done the access course anyway.',
  },
  {
    id: 'c-business-parent',
    subject: 'business',
    grades: 'CCC against BBC',
    below: 2,
    target: false,
    detail: 'It is a parent on the phone. The applicant is in the room and has not spoken yet.',
  },
  {
    id: 'c-computing-clean',
    subject: 'computing',
    grades: 'BBB, holding BBB',
    below: 0,
    target: true,
    detail: 'Straightforward, qualified, and has been on hold for eleven minutes.',
  },
  {
    id: 'c-arts-four',
    subject: 'arts',
    grades: 'DDE against BCC',
    below: 4,
    target: true,
    detail: 'Nowhere near it. Very keen. This is the one you will think about in October.',
  },
]
