/**
 * CONFIRMATION BIAS - splitting the intake across five departments.
 *
 * Derived, not managed. The player never recruits a subject directly; the
 * subjects respond to the cycle they were given. Nothing here feeds back into
 * the model, so the pipeline, the scoring and the acceptance tests are
 * untouched by it. It is what the numbers look like from the corridor.
 */

import { SUBJECTS, SUBJECT_NOTABLE, type Subject } from '../config/subjects'
import type { Position } from './types'

export interface SubjectRow {
  id: string
  name: string
  short: string
  target: number
  actual: number
  delta: number
  /** Share of the placement demand this area is responsible for. */
  placementShare: number
  state: 'over' | 'under' | 'level'
  /** The line for this area's state, or null when it is behaving. */
  note: string | null
}

function weight(s: Subject, ratio: number): number {
  return s.share * (1 + s.drift) * (1 + (ratio - 1) * s.elasticity)
}

export function subjectMix(p: Position): SubjectRow[] {
  const total = p.pipeline.enrolled
  const target = p.measures.target
  const ratio = target > 0 ? total / target : 1

  const weights = SUBJECTS.map((s) => Math.max(0, weight(s, ratio)))
  const weightSum = weights.reduce((a, b) => a + b, 0) || 1

  const loads = SUBJECTS.map((s, i) => (weights[i] / weightSum) * total * s.placementLoad)
  const loadSum = loads.reduce((a, b) => a + b, 0) || 1

  return SUBJECTS.map((s, i) => {
    const actual = (weights[i] / weightSum) * total
    const subjectTarget = s.share * target
    const delta = actual - subjectTarget
    const off = subjectTarget > 0 ? delta / subjectTarget : 0
    const state = off > SUBJECT_NOTABLE ? 'over' : off < -SUBJECT_NOTABLE ? 'under' : 'level'

    return {
      id: s.id,
      name: s.name,
      short: s.short,
      target: subjectTarget,
      actual,
      delta,
      placementShare: loads[i] / loadSum,
      state,
      note: state === 'over' ? s.over : state === 'under' ? s.under : null,
    }
  })
}

/** The area most responsible for a placement shortfall. Nursing, usually. */
export function placementCulprit(rows: SubjectRow[]): SubjectRow {
  return rows.reduce((worst, r) => (r.placementShare > worst.placementShare ? r : worst), rows[0])
}

/** The area furthest from its own number, in either direction. */
export function mostOffNumber(rows: SubjectRow[]): SubjectRow | null {
  const notable = rows.filter((r) => r.state !== 'level')
  if (notable.length === 0) return null
  return notable.reduce((worst, r) =>
    Math.abs(r.delta / r.target) > Math.abs(worst.delta / worst.target) ? r : worst,
  )
}
