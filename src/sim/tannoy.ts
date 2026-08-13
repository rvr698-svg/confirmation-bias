/**
 * CONFIRMATION BIAS - picking the announcement.
 *
 * Reads the same position the dashboard reads, picks the first line whose
 * situation is true, and falls back to filler so a quiet cycle is not the same
 * sentence ten times. Deterministic on the seed, so it does not flicker
 * between renders.
 */

import { CAPACITY } from '../config/config'
import { TANNOY, TANNOY_FILLER, type TannoyContext } from '../config/tannoy'
import { mostOffNumber, placementCulprit, subjectMix } from './subjects'
import type { GameState, Position } from './types'

export function tannoyContext(
  state: GameState,
  landed: Position,
  projected: number,
): TannoyContext {
  const rows = subjectMix(landed)
  const off = mostOffNumber(rows)

  return {
    turn: state.turn,
    ratio: projected / landed.measures.target,
    team: landed.measures.team,
    budgetLeft: landed.measures.budget - landed.measures.spend,
    overCapacity: projected > landed.levels.teachingCapacity,
    bedsTight: projected * CAPACITY.accommodationTakeUp > landed.levels.accommodationBeds * 0.98,
    placementsTight: projected * CAPACITY.placementShare > landed.levels.placementSupply * 0.98,
    offNumber: off ? off.short : null,
    placementCulprit: placementCulprit(rows).short,
    underInvestigation: landed.measures.penalties > 0,
    isClearing: state.turnPhase === 'clearing',
  }
}

/** Which situation the tannoy thinks it is in. Exported so tests can check the
 *  choice rather than the wording, which rotates. */
export function tannoySituation(c: TannoyContext): string | null {
  return TANNOY.find((line) => line.when(c))?.id ?? null
}

export function tannoyLine(c: TannoyContext, seed: number): string {
  const hit = TANNOY.find((line) => line.when(c))

  // The last two entries are the "nothing much is happening" lines. When one of
  // those wins, use the filler pool instead on later turns, so a calm cycle
  // still gets some variety.
  const generic = hit?.id === 'mid' || hit?.id === 'early'
  if (generic && c.turn > 1) {
    const i = (Math.abs(seed + c.turn * 7919) >>> 0) % TANNOY_FILLER.length
    return TANNOY_FILLER[i]
  }

  if (!hit) return TANNOY_FILLER[0]

  // Walk the situation's lines by turn, so a problem that lasts five months is
  // announced five different ways. The seed offsets where in the list a given
  // cycle starts, so two players with the same problem do not hear it in the
  // same order.
  const start = (Math.abs(seed) >>> 0) % hit.say.length
  return hit.say[(start + c.turn) % hit.say.length](c)
}
