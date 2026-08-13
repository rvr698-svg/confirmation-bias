/**
 * CONFIRMATION BIAS - the table.
 *
 * A proxy league position from four things: entry standards, completion, spend
 * per student, and how much trouble you are in. It is the old entry profile
 * lever wearing something the whole institution understands.
 *
 * Position is expressed as a movement from where you started rather than
 * straight off the composite, so "you were 64th" is always true and "you are
 * 71st" always means something.
 *
 * On fines: a fine is money spent, and a table that measures spend per student
 * does not ask what the money was spent on. So paying one nudges you up while
 * it wrecks your budget and your standing. That is deliberate, it is real, and
 * `LEAGUE.finesCountAsSpend` turns it off if it ever stops being funny.
 */

import { BASELINE, LEAGUE, MEASURE_BASE } from '../config/config'
import type { Position } from './types'
import { clamp } from './rng'

function scaled(value: number, floor: number, ceiling: number): number {
  return clamp(((value - floor) / (ceiling - floor)) * 100, 0, 100)
}

export interface LeagueParts {
  entry: number
  completion: number
  resource: number
  reputation: number
}

export interface LeagueStanding {
  /** 0-100 composite. Internal, never shown. */
  score: number
  position: number
  startPosition: number
  /** Positive is a climb, because up the table is down the number. */
  movement: number
  parts: LeagueParts
  /**
   * Places gained purely because a fine counts as spend per student. Zero
   * unless you have been fined, and the debrief says so out loud.
   */
  finePlaces: number
}

function parts(
  entryProfile: number,
  completion: number,
  perStudent: number,
  reputation: number,
): LeagueParts {
  return {
    entry: scaled(entryProfile, LEAGUE.entry.floor, LEAGUE.entry.ceiling),
    completion: scaled(completion, LEAGUE.completion.floor, LEAGUE.completion.ceiling),
    resource: scaled(perStudent, LEAGUE.resource.floor, LEAGUE.resource.ceiling),
    reputation: scaled(reputation, LEAGUE.reputation.floor, LEAGUE.reputation.ceiling),
  }
}

function composite(p: LeagueParts): number {
  return (
    p.entry * LEAGUE.weights.entry +
    p.completion * LEAGUE.weights.completion +
    p.resource * LEAGUE.weights.resource +
    p.reputation * LEAGUE.weights.reputation
  )
}

/** Where a provider that did nothing at all would sit. The datum for movement. */
export function baselineScore(): number {
  return composite(
    parts(
      MEASURE_BASE.entryProfile,
      BASELINE.retention,
      MEASURE_BASE.spendCommitted / BASELINE.target,
      MEASURE_BASE.reputation,
    ),
  )
}

function positionFor(score: number): number {
  return clamp(
    Math.round(LEAGUE.startPosition - (score - baselineScore()) * LEAGUE.sensitivity),
    1,
    LEAGUE.field,
  )
}

export function standing(p: Position): LeagueStanding {
  const intake = Math.max(1, p.pipeline.enrolled)
  const completion = p.retained / intake
  const fines = LEAGUE.finesCountAsSpend ? p.levels.penalties : 0

  // Recruitment spend and any fine. Breach costs are excluded: emergency hotel
  // bills are not an investment in anybody's education.
  const perStudent = (p.levels.spend + fines) / intake

  const mine = parts(p.measures.entryProfile, completion, perStudent, p.measures.reputation)
  const score = composite(mine)
  const position = positionFor(score)

  const withoutFine =
    fines > 0
      ? positionFor(
          composite(
            parts(p.measures.entryProfile, completion, p.levels.spend / intake, p.measures.reputation),
          ),
        )
      : position

  return {
    score,
    position,
    startPosition: LEAGUE.startPosition,
    movement: LEAGUE.startPosition - position,
    parts: mine,
    finePlaces: withoutFine - position,
  }
}

/** 1st, 2nd, 3rd, 64th. */
export function ordinal(n: number): string {
  const rem100 = n % 100
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`
  switch (n % 10) {
    case 1:
      return `${n}st`
    case 2:
      return `${n}nd`
    case 3:
      return `${n}rd`
    default:
      return `${n}th`
  }
}
