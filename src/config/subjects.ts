/**
 * ADMISSIONS! - the subject mix.
 *
 * Your intake is not one number, it is five departments who each think they
 * are the important one. The split is derived from the intake you already
 * have: nobody recruits a subject directly, they simply find out in August
 * which ones came.
 *
 * Two things make a subject move differently from the total:
 *
 *   drift      what the market is doing to it regardless of you. Computing is
 *              rising, Creative Arts is falling, and neither is your fault.
 *   elasticity how hard it swings when the cycle swings. Business always
 *              fills. Nursing overshoots the moment anything goes well.
 *
 * All magnitudes are PLACEHOLDER and require sign-off.
 */

export interface Subject {
  id: string
  name: string
  /** Short form, for the rail where there is no room for the truth. */
  short: string
  /** Share of the intake target this area carries. These sum to 1. */
  share: number
  /** Structural trend, applied every cycle whatever you do. */
  drift: number
  /** 1 moves with the total. Above 1 amplifies it. Below 1 is stubborn. */
  elasticity: number
  /** Placement demand per head. This is why placements run out. */
  placementLoad: number
  /** Said when this area comes in well over its number. */
  over: string
  /** Said when it comes in well under. */
  under: string
}

export const SUBJECTS: Subject[] = [
  {
    id: 'health',
    name: 'Nursing and Health',
    short: 'Nursing',
    share: 0.24,
    drift: 0.03,
    elasticity: 1.5,
    placementLoad: 0.92,
    over: 'Nursing recruited magnificently. Nursing has nowhere to put them. Both facts are in the newsletter.',
    under: 'Nursing came in light, which the region will notice roughly eighteen months from now.',
  },
  {
    id: 'business',
    name: 'Business and Law',
    short: 'Business',
    share: 0.3,
    drift: 0,
    elasticity: 0.8,
    placementLoad: 0.08,
    over: 'Business filled, then kept filling. Two seminar groups are meeting in the atrium.',
    under: 'Business missed, which has not happened since 2016 and will be discussed as though it were a bereavement.',
  },
  {
    id: 'computing',
    name: 'Computing',
    short: 'Computing',
    share: 0.18,
    drift: 0.06,
    elasticity: 1.3,
    placementLoad: 0.14,
    over: 'Computing is over by enough that the labs now run a night shift. The students prefer it.',
    under: 'Computing missed in a growth market, which is the one thing nobody can spin.',
  },
  {
    id: 'arts',
    name: 'Creative Arts',
    short: 'Creative Arts',
    share: 0.15,
    drift: -0.09,
    elasticity: 0.45,
    placementLoad: 0.05,
    over: 'Creative Arts is over. There are eleven students to a kiln. The kiln takes four.',
    under: 'Creative Arts is down again. The studios are quiet and somebody is drafting the word "portfolio review".',
  },
  {
    id: 'engineering',
    name: 'Engineering',
    short: 'Engineering',
    share: 0.13,
    drift: -0.01,
    elasticity: 0.9,
    placementLoad: 0.34,
    over: 'Engineering is over and the workshop rota now includes Saturdays. Nobody has told the technicians.',
    under: 'Engineering is under, and the employers who part-fund it have asked for a meeting.',
  },
]

/** Over or under its own number by more than this and somebody says something. */
export const SUBJECT_NOTABLE = 0.09
