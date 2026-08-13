/**
 * Capacity pressure, as sentences.
 *
 * Judged against the projection rather than the landed position, because the
 * projection is the only thing the player could still act on in time.
 *
 * Kept out of the components so the wording is testable and the rail is only
 * responsible for showing it.
 */

import { CAPACITY } from '../config/config'
import type { Levels } from './types'

const fmt = (n: number) => Math.round(n).toLocaleString('en-GB')

export interface CapacityReading {
  /** One line per ceiling under pressure. Empty when everything is comfortable. */
  warnings: string[]
  /** True once any ceiling is actually breached rather than merely close. */
  severe: boolean
  headline: string | null
}

export function capacityReading(projected: number, levels: Levels): CapacityReading {
  const warnings: string[] = []

  const teaching = projected / levels.teachingCapacity
  const beds = (projected * CAPACITY.accommodationTakeUp) / levels.accommodationBeds
  const places = (projected * CAPACITY.placementShare) / levels.placementSupply

  if (teaching > 1) {
    warnings.push(
      `Teaching capacity is ${fmt(levels.teachingCapacity)} places. You are projected ${fmt(projected - levels.teachingCapacity)} over.`,
    )
  } else if (teaching > 0.95) {
    warnings.push('Teaching capacity is close. Deans have started asking.')
  }

  if (beds > 1) {
    warnings.push(
      `You are projected ${fmt(projected * CAPACITY.accommodationTakeUp - levels.accommodationBeds)} beds short of the accommodation guarantee.`,
    )
  } else if (beds > 0.95) {
    warnings.push('Accommodation is nearly full on the current projection.')
  }

  if (places > 1) {
    warnings.push(
      `Placement supply is ${fmt(levels.placementSupply)}. You are projected ${fmt(projected * CAPACITY.placementShare - levels.placementSupply)} short.`,
    )
  } else if (places > 0.95) {
    warnings.push('Placement supply is nearly committed.')
  }

  const severe = teaching > 1 || beds > 1 || places > 1

  return {
    warnings,
    severe,
    headline: warnings.length === 0
      ? null
      : severe
        ? 'Capacity breached on the current projection'
        : 'Capacity is tightening',
  }
}
