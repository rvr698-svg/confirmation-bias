/**
 * CONFIRMATION BIAS - simulation constants.
 *
 * Every displayed figure in the game derives from this file. Nothing numeric is
 * hard-coded in a component. Expect to tune these repeatedly.
 *
 * =====================================================================
 * SIGN-OFF REQUIRED
 * =====================================================================
 * All values marked PLACEHOLDER are unsigned. They are plausible for a
 * mid-tariff UK provider but they are not sourced. Do not show this
 * build to a client audience until the block below is agreed.
 *
 * SECTOR AND NATION, NOT YET DECIDED
 * ---------------------------------------------------------------------
 * The wording is UK-wide and reads for a university or a college, but the
 * model is still a UCAS undergraduate pipeline: offers, firm and insurance
 * acceptances, conditions met, melt, Clearing. FE recruitment does not work
 * that way, and the four nations differ on qualifications and funding. Both
 * are open scope decisions, not oversights. See README, Known gaps.
 *
 * ONE KNOWN INCONSISTENCY IN THE BRIEF, AND WHAT WAS DONE ABOUT IT
 * ---------------------------------------------------------------------
 * The brief gives 18,000 applications alongside a 3,800 intake target. Run
 * the briefed rates end to end and you get roughly 2,490 enrolments:
 *
 *   18,000 x 0.72 offer rate                    = 12,960 offers
 *   12,960 x 0.19 firm rate                     =  2,462 firms
 *   firms surviving conditions (blended ~0.82)  =  2,018
 *   plus insurance pick-up, less 5% melt        =  2,242
 *   plus Clearing at 10% of intake              =  2,491
 *
 * That starts the player 1,300 under target on turn 1 with no route back,
 * which is not a game. Every rate in the brief is defensible on its own. The
 * application volume is the figure that does not fit: a provider enrolling
 * 3,800 at these conversion rates receives closer to 27,000 applications.
 *
 * So all seven briefed rates are used verbatim and BASELINE.applications is
 * set to 27,000, the volume they imply. The briefed figure is preserved below
 * in BRIEFED_AS_WRITTEN for comparison. If the brief would rather hold 18,000,
 * the fix is to raise firmRate to about 0.29, and this note should be revisited.
 *
 * 27,000 rather than 27,500 is deliberate. It lands a do-nothing cycle about
 * four per cent under target, so the target is a stretch rather than a gift.
 * =====================================================================
 */

import type { BandKey } from '../sim/types'

/** The brief's numbers, kept verbatim for the sign-off conversation. */
export const BRIEFED_AS_WRITTEN = {
  applications: 18_000,
  offerRate: 0.72,
  firmRate: 0.19,
  insuranceRate: 0.12,
  conditionsMet: 0.78,
  melt: 0.05,
  target: 3_800,
  clearingShareOfIntake: [0.08, 0.12] as [number, number],
} as const

export const BASELINE = {
  /**
   * ADJUSTED, see the header note. Briefed as 18,000. PLACEHOLDER.
   *
   * Set so that a player who makes no meaningful moves lands about four per
   * cent under target. A target you hit by doing nothing is not a target.
   */
  applications: 27_000,
  /** Briefed. Share of applications receiving an offer. PLACEHOLDER. */
  offerRate: 0.72,
  /** Briefed. Share of offers taken as firm. PLACEHOLDER. */
  firmRate: 0.19,
  /** Briefed. Share of offers taken as insurance. PLACEHOLDER. */
  insuranceRate: 0.12,
  /** Briefed. Share of conditional firms meeting conditions. PLACEHOLDER. */
  conditionsMet: 0.78,
  /** Briefed. Melt between confirmation and enrolment. PLACEHOLDER. */
  melt: 0.05,

  /** NOT BRIEFED, assumed. Share of firm holders on unconditional offers. */
  unconditionalShare: 0.18,
  /** NOT BRIEFED, assumed. Unconditional firms who still walk away. */
  unconditionalLapse: 0.03,
  /** NOT BRIEFED, assumed. Insurance holders who convert after a missed firm. */
  insuranceConversion: 0.22,
  /** Briefed as 8-12% of intake. Midpoint used as the base. PLACEHOLDER. */
  clearingShare: 0.10,

  /** Briefed. PLACEHOLDER. */
  target: 3_800,
  /** Share of intake retained to census. NOT BRIEFED, assumed. */
  retention: 0.94,
} as const

/**
 * CALIBRATION
 * ---------------------------------------------------------------------
 * Decision and event magnitudes are authored as intent strength. This block
 * converts intent into model units.
 *
 * Why it exists. Around twenty decisions touch the same handful of pipeline
 * levers. Authored at face value they stack linearly, and a player who picks
 * every growth option finishes 138 per cent over target, which is not a cycle,
 * it is a farce. The first harness run said exactly that.
 *
 * A value of 0.35 means "an authored offer rate effect of 5 points moves the
 * model by 1.75 points". Tune these, not the authored numbers, when the spread
 * is wrong. PLACEHOLDER.
 */
export const CALIBRATION: Partial<Record<import('../sim/types').Lever, number>> = {
  applications: 0.45,
  offerRate: 0.35,
  firmRate: 0.35,
  insuranceRate: 0.4,
  unconditionalShare: 0.4,
  conditionsMet: 0.35,
  insuranceConversion: 0.4,
  melt: 0.4,
  clearingShare: 0.4,
  entryProfile: 0.55,
  access: 0.62,
  team: 0.75,
  // spend, target and the capacity ceilings are authored in real units.
}

/**
 * SATURATION
 * ---------------------------------------------------------------------
 * A guard rail, not the main tuning tool. Stacking aligned decisions on one
 * lever gives diminishing returns, because in a real cycle you cannot buy the
 * same conversion twice.
 *
 * The value is the asymptote: the total swing a lever can reach however many
 * decisions push at it. Half of it is reached when the raw total equals it.
 * `null` means no ceiling, which is right for money and for stated targets.
 */
export const SATURATION: Partial<Record<import('../sim/types').Lever, number>> = {
  applications: 0.12, // in log space
  offerRate: 0.1,
  firmRate: 0.03,
  insuranceRate: 0.05,
  unconditionalShare: 0.3,
  conditionsMet: 0.14,
  insuranceConversion: 0.18,
  melt: 0.06,
  clearingShare: 0.09,
  entryProfile: 16,
  access: 0.14,
  team: 60,
}

/**
 * Hard numbers. Exceeding these does not cap intake, it causes a crisis.
 * All PLACEHOLDER.
 */
export const CAPACITY = {
  /** Timetabled teaching capacity in first-year places. Breaches at +9%. */
  teaching: 4_150,
  /** Beds in the accommodation guarantee. Breaches at +9%. */
  accommodation: 2_560,
  /** Placement partnerships available to health and education. Breaches at +12%. */
  placement: 940,
  /** Share of intake taking up the accommodation guarantee. */
  accommodationTakeUp: 0.62,
  /** Share of intake on placement-bearing courses. */
  placementShare: 0.22,
} as const

/**
 * Cost and pain of breaching a ceiling, per student over. All PLACEHOLDER.
 *
 * spendPerHead is the share that falls on the admissions and recruitment
 * budget, not the full institutional cost of the student. The first harness
 * run charged the whole marginal teaching cost here and the budget measure
 * collapsed to zero for anyone who over-recruited at all.
 */
export const BREACH = {
  teaching: {
    /** Additional cost landing on this budget, £k per student over. */
    spendPerHead: 0.55,
    /** Team index points lost per 100 students over. */
    teamPer100: 5.5,
    /** Retention lost per 100 over, in percentage points. */
    retentionPer100: 0.9,
  },
  accommodation: {
    /** Hotel and headleasing, £k per bed short. */
    spendPerHead: 1.4,
    teamPer100: 4.0,
    retentionPer100: 1.4,
  },
  placement: {
    /** Emergency placement brokering, £k per student over. */
    spendPerHead: 1.1,
    teamPer100: 6.5,
    retentionPer100: 2.2,
  },
} as const

/** Starting values for the four non-intake measures. All PLACEHOLDER. */
export const MEASURE_BASE = {
  /** Index, 100 = last year's entry profile. */
  entryProfile: 100,
  /** Share of intake from access and participation target groups. */
  access: 0.34,
  /** Recruitment and admissions budget, £k. */
  budget: 2_600,
  /** Committed spend before any decision, £k. */
  spendCommitted: 1_780,
  /** Team capacity and wellbeing index, 0-100. */
  team: 72,
  /** Standing with the regulator and the press. 100 is untroubled. */
  reputation: 100,
  /** Fines and regulatory costs, £k. Nobody starts the cycle with one. */
  penalties: 0,
} as const

/** Where each measure needs to land. All PLACEHOLDER. */
export const MEASURE_TARGET = {
  /** Intake within this share of target counts as on the number. */
  intakeTolerance: 0.02,
  entryProfile: 99,
  access: 0.38,
  team: 60,
} as const

/**
 * The table. PLACEHOLDER, and deliberately a proxy rather than any real
 * published ranking.
 *
 * Nobody outside admissions knows what an entry profile is. Everybody knows
 * what 64th means, and everybody knows which way is good. So the entry profile
 * lever still does the work underneath, and what the player sees is a position.
 *
 * Three inputs, roughly the ones a real table uses:
 *
 *   entry       entry standards. The old entry profile lever, unchanged.
 *   completion  the share who stay. Over-recruiting into a breach costs you
 *               here, which is how a bad August turns into a bad table.
 *   resource    spend per student. Yes, this means spending money moves you up
 *               the table while it moves you down the budget measure. That is
 *               not a bug in the game, it is the sector.
 */
export const REGULATOR = {
  /** The fine, £k. PLACEHOLDER. */
  fine: 260,
  /** Points off your standing. Reputation runs 0-100 and starts untroubled. */
  reputationHit: 32,
  /** What the team spends the autumn doing instead of their jobs. */
  teamCost: 7,
} as const

export const LEAGUE = {
  /**
   * Fines count towards spend per student, so paying one nudges you UP the
   * table while it wrecks your budget and your standing.
   *
   * This is a joke and it is also the arithmetic: a table that measures what
   * you spent does not ask what you spent it on. The game says so out loud in
   * the debrief rather than leaving it as a perverse incentive nobody notices.
   * Set false and a fine simply costs you.
   */
  finesCountAsSpend: true,
  /** Institutions in the table. */
  field: 130,
  /** Where you start, before anything you do. */
  startPosition: 64,
  /**
   * Places moved per point of composite score. At 0.85 a very good cycle is
   * worth about twenty places and a disaster costs about thirty: dramatic but
   * not silly. Signed off at this value.
   */
  sensitivity: 0.85,
  weights: { entry: 0.42, completion: 0.24, resource: 0.16, reputation: 0.18 },
  entry: { floor: 88, ceiling: 108 },
  completion: { floor: 0.8, ceiling: 0.96 },
  /** Recruitment spend per student, £k. */
  resource: { floor: 0.3, ceiling: 0.8 },
  /** Standing with the regulator and the press. */
  reputation: { floor: 55, ceiling: 100 },
} as const

/**
 * Forecast noise by turn, as a standard deviation on projected intake.
 * Wide in September, narrowing, never zero before turn 9. Turn 10 is zero
 * because on results day the number is the number.
 */
export const FORECAST_NOISE: Record<number, number> = {
  1: 0.092,
  2: 0.081,
  3: 0.071,
  4: 0.061,
  5: 0.051,
  6: 0.042,
  7: 0.033,
  8: 0.025,
  9: 0.015,
  10: 0,
}

/**
 * A per-run bias the player cannot detect, drawn once at the start. This is
 * what stops a player learning that the forecast is unbiased and simply
 * trusting the midpoint. It decays but does not vanish until results day.
 */
export const FORECAST_BIAS = {
  sd: 0.045,
  decayByTurn: {
    1: 1.0, 2: 0.96, 3: 0.9, 4: 0.84, 5: 0.76,
    6: 0.66, 7: 0.54, 8: 0.4, 9: 0.22, 10: 0,
  } as Record<number, number>,
}

export const TURNS = [
  { turn: 1, label: 'September', strap: 'The cycle opens. Nothing has happened yet, which is the problem.' },
  { turn: 2, label: 'October', strap: 'Applications are arriving. Too early to read them.' },
  { turn: 3, label: 'November', strap: 'The offer engine starts. Every choice here lands in March.' },
  { turn: 4, label: 'December', strap: 'Interviews, portfolios, and the contextual offer conversation.' },
  { turn: 5, label: 'January', strap: 'The equal consideration deadline passes. Now you can count.' },
  { turn: 6, label: 'February', strap: 'The executive has been reading the sector press.' },
  { turn: 7, label: 'March', strap: 'Conversion season. Applicants are deciding, and not telling you.' },
  { turn: 8, label: 'May', strap: 'Firm and insurance decisions land. The shape of the year is set.' },
  { turn: 9, label: 'July', strap: 'Confirmation is four weeks away. Count the beds.' },
  { turn: 10, label: 'August', strap: 'Results day. Then Clearing.' },
] as const

export const TOTAL_TURNS = TURNS.length

/** Bands. No raw scores are ever shown to the player. */
/**
 * The bands, in the words the sector actually uses when it is being polite
 * about a disaster. Nobody has ever written "we failed" in a board paper.
 */
export const BANDS: Record<BandKey, { label: string; min: number }> = {
  strong: { label: 'Sector-leading', min: 78 },
  holding: { label: 'Broadly on track', min: 56 },
  pressure: { label: 'A watching brief', min: 32 },
  exposed: { label: 'An action plan', min: 0 },
}

/** How many events may fire in a single turn. */
export const EVENTS = {
  maxPerTurn: 2,
  /** Chance a second event fires once one already has. */
  secondEventChance: 0.34,
  /** Chance any event fires at all on a given turn. */
  baseChance: 0.9,
  /**
   * Events are dialled separately from decisions. Without this, calibration
   * flattened them and two playthroughs of the same strategy finished within
   * three per cent of each other, which is not a cycle anybody recognises.
   * PLACEHOLDER.
   */
  impact: 1.6,
  /**
   * Team damage from events is dialled down again on top of `impact`. Ten
   * turns of events each costing the team a few points stacked past the
   * saturation ceiling on their own, so every playthrough finished with the
   * same wrecked team whatever the player chose. That makes team a tax rather
   * than a lever. PLACEHOLDER.
   */
  teamImpact: 0.42,
} as const

/**
 * Bright ideas. A senior colleague turns up and stands in front of your work
 * until you deal with them. Deliberately frequent: about one turn in two.
 * PLACEHOLDER.
 */
export const IDEAS = {
  chance: 0.5,
  /** Nobody has a bright idea on results day. They are all on annual leave. */
  minTurn: 1,
  maxTurn: 9,
} as const

/** The colourway lives in `config/palette.ts`. This is the re-export. */
export { PALETTE } from './palette'
