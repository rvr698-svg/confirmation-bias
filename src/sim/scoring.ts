/**
 * CONFIRMATION BIAS - the five measures.
 *
 * Internally each measure resolves to 0-100. The player never sees that number.
 * They see a band, because a band is what an executive summary would give you
 * and because a raw score invites optimisation, which is not the point.
 *
 * The bands are deliberately unkind at the edges and generous in the middle.
 * Nobody should feel humiliated. Everybody should feel found out.
 */

import { BANDS, MEASURE_TARGET, CAPACITY } from '../config/config'
import { BREACH_LINES, VERDICTS, VERDICT_FALLBACK, type VerdictContext } from '../config/verdicts'
import type { Band, BandKey, Position, ScoredMeasure, Scorecard } from './types'
import { ordinal, standing } from './league'
import { mostOffNumber, placementCulprit, subjectMix } from './subjects'
import { clamp } from './rng'

/** Scoring constants live here rather than in the components. PLACEHOLDER. */
export const SCORING = {
  intake: {
    /** Deviation from target forgiven entirely. */
    tolerance: MEASURE_TARGET.intakeTolerance,
    /** Points lost per percentage point under target, beyond tolerance. */
    underSlope: 3.2,
    /** Points lost per percentage point over target, beyond tolerance. */
    overSlope: 2.6,
    /** Extra points lost per capacity place breached, as a share of target. */
    breachSlope: 130,
  },
  access: { floor: 0.28, ceiling: 0.42 },
  budget: {
    /** Spend ratio at or below which the budget is fully clean. */
    clean: 0.92,
    /** Points lost per percentage point of overspend beyond clean. */
    slope: 3.2,
  },
  /**
   * Ceiling lowered from 80 once bright ideas were added. Every senior
   * colleague with an initiative costs the team a few points, and without
   * this a player who actively protected them could still never reach Strong.
   */
  team: { floor: 8, ceiling: 74 },
} as const

function bandFor(score: number): Band {
  const key: BandKey =
    score >= BANDS.strong.min
      ? 'strong'
      : score >= BANDS.holding.min
        ? 'holding'
        : score >= BANDS.pressure.min
          ? 'pressure'
          : 'exposed'
  return { key, label: BANDS[key].label, line: '' }
}

function scaled(value: number, floor: number, ceiling: number): number {
  return clamp(((value - floor) / (ceiling - floor)) * 100, 0, 100)
}

export function scoreIntake(p: Position): { score: number; detail: string } {
  const { intake, target } = p.measures
  const ratio = intake / target
  const dev = Math.abs(ratio - 1)
  const excess = Math.max(0, dev - SCORING.intake.tolerance) * 100

  let score =
    100 - excess * (ratio < 1 ? SCORING.intake.underSlope : SCORING.intake.overSlope)

  const breachTotal = p.breaches.reduce((sum, b) => sum + b.over, 0)
  score -= (breachTotal / target) * SCORING.intake.breachSlope

  const diff = Math.round(intake - target)
  const detail =
    Math.abs(diff) <= target * SCORING.intake.tolerance
      ? `You landed on the number. ${Math.round(intake).toLocaleString('en-GB')} against ${Math.round(target).toLocaleString('en-GB')}.`
      : diff > 0
        ? `You over-recruited by ${diff.toLocaleString('en-GB')}.`
        : `You under-recruited by ${Math.abs(diff).toLocaleString('en-GB')}.`

  return { score: clamp(score, 0, 100), detail }
}

/**
 * The table. Entry standards still do most of the work, but the player sees a
 * position, because a position is a thing the whole institution argues about.
 */
export function scoreLeague(p: Position): { score: number; detail: string } {
  const s = standing(p)

  // Said out loud, because a perverse incentive nobody notices is just a bug.
  if (s.finePlaces > 0) {
    return {
      score: s.score,
      detail: `You finished ${ordinal(s.position)}. ${s.finePlaces} of that came from the fine, which the table counts as spend per student.`,
    }
  }

  const detail =
    s.movement > 0
      ? `You finished ${ordinal(s.position)}, up ${s.movement} on last year. Marketing have already made a graphic.`
      : s.movement < 0
        ? `You finished ${ordinal(s.position)}, down ${Math.abs(s.movement)}. The table is described in the press release as "one of several measures".`
        : `You finished ${ordinal(s.position)}, exactly where you started, which nobody will mention at all.`
  return { score: s.score, detail }
}

export function scoreAccess(p: Position): { score: number; detail: string } {
  const v = p.measures.access
  const score = scaled(v, SCORING.access.floor, SCORING.access.ceiling)
  const pct = (v * 100).toFixed(1)
  const targetPct = (MEASURE_TARGET.access * 100).toFixed(0)
  const detail =
    v >= MEASURE_TARGET.access
      ? `${pct} per cent of your intake came from target groups, against a ${targetPct} per cent commitment.`
      : `${pct} per cent of your intake came from target groups. You committed to ${targetPct}.`
  return { score, detail }
}

export function scoreBudget(p: Position): { score: number; detail: string } {
  const { spend, budget } = p.measures
  const ratio = spend / budget
  const over = Math.max(0, ratio - SCORING.budget.clean) * 100
  const score = clamp(100 - over * SCORING.budget.slope, 0, 100)
  const diff = Math.round(spend - budget)
  const detail =
    diff > 0
      ? `You finished £${diff.toLocaleString('en-GB')}k over budget.`
      : `You finished £${Math.abs(diff).toLocaleString('en-GB')}k under budget.`
  return { score, detail }
}

export function scoreTeam(p: Position): { score: number; detail: string } {
  const v = p.measures.team
  const score = scaled(v, SCORING.team.floor, SCORING.team.ceiling)
  const detail =
    v >= MEASURE_TARGET.team
      ? 'Your team finished the cycle in a state they can come back from.'
      : v >= 35
        ? 'Your team finished the cycle depleted. Expect resignations in October.'
        : 'Your team is done. You will rebuild this function before you run another cycle.'
  return { score, detail }
}

export function breachSummary(p: Position): string[] {
  const culprit = placementCulprit(subjectMix(p)).short

  return p.breaches.map((b) => {
    const over = Math.round(b.over).toLocaleString('en-GB')
    if (b.kind === 'teaching') return BREACH_LINES.teaching(over)
    if (b.kind === 'accommodation') return BREACH_LINES.accommodation(over)
    return BREACH_LINES.placement(over, culprit)
  })
}

export function scorecard(p: Position): Scorecard {
  const parts: Array<[string, string, { score: number; detail: string }]> = [
    ['intake', 'Intake against target', scoreIntake(p)],
    ['league', 'League table position', scoreLeague(p)],
    ['access', 'Access and participation', scoreAccess(p)],
    ['budget', 'Budget position', scoreBudget(p)],
    ['team', 'Team capacity and wellbeing', scoreTeam(p)],
  ]

  const measures: ScoredMeasure[] = parts.map(([id, name, r]) => ({
    id,
    name,
    band: bandFor(r.score),
    score: r.score,
    detail: r.detail,
  }))

  const overall = measures.reduce((s, m) => s + m.score, 0) / measures.length

  return { measures, overall, verdict: verdictFor(p, measures, overall) }
}

/**
 * One line, in the institution's own voice. The copy lives in
 * `config/verdicts.ts`; this only assembles the situation and picks the first
 * line that fits.
 */
export function verdictFor(p: Position, measures: ScoredMeasure[], overall: number): string {
  const rows = subjectMix(p)
  const off = mostOffNumber(rows)
  const s = standing(p)

  const context: VerdictContext = {
    ratio: p.measures.intake / p.measures.target,
    fine: p.measures.penalties,
    finePlaces: s.finePlaces,
    bandOf: (id) => measures.find((m) => m.id === id)?.band.key ?? 'holding',
    strongCount: measures.filter((m) => m.band.key === 'strong').length,
    exposedCount: measures.filter((m) => m.band.key === 'exposed').length,
    overall,
    breach: {
      teaching: p.breaches.some((b) => b.kind === 'teaching'),
      beds: p.breaches.some((b) => b.kind === 'accommodation'),
      placement: p.breaches.some((b) => b.kind === 'placement'),
    },
    offNumber: off ? off.short : null,
    placementCulprit: placementCulprit(rows).short,
    league: { position: s.position, movement: s.movement, ordinal: ordinal(s.position) },
  }

  const hit = VERDICTS.find((v) => v.when(context))
  return hit ? hit.line(context) : VERDICT_FALLBACK
}

/** Used by the share card. Kept here so the copy stays with the scoring. */
export const BAND_MARK: Record<BandKey, string> = {
  strong: '●●●●',
  holding: '●●●○',
  pressure: '●●○○',
  exposed: '●○○○',
}

export const CAPACITY_LABELS = {
  teaching: `Teaching capacity: ${CAPACITY.teaching.toLocaleString('en-GB')} places`,
  accommodation: `Accommodation: ${CAPACITY.accommodation.toLocaleString('en-GB')} beds`,
  placement: `Placements: ${CAPACITY.placement.toLocaleString('en-GB')} available`,
}
