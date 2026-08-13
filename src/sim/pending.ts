/**
 * ADMISSIONS! - what is still in the post.
 *
 * Everything you decide lands three to five turns later, and until now the
 * game told you only how many things were coming, not what they were. This
 * groups the queue back into the decisions the player actually made.
 *
 * It reports what you chose and when it lands. It never reports what it will
 * do, because not knowing that is the game.
 */

import type { ModifierEntry } from './types'

export interface PendingItem {
  key: string
  /** "October: Offer-making policy" */
  sourceLabel: string
  choiceLabel: string
  appliedTurn: number
  landsTurn: number
  turnsAway: number
  /** How many separate effects this decision still has coming. */
  count: number
}

/**
 * Your own decisions only. Events happening to you are not something you are
 * waiting on, they are something you are living with.
 */
export function pendingItems(queue: ModifierEntry[], turn: number): PendingItem[] {
  const groups = new Map<string, PendingItem>()

  for (const m of queue) {
    if (m.landsTurn <= turn) continue
    if (m.sourceKind !== 'decision') continue

    const key = `${m.sourceId}:${m.appliedTurn}`
    const found = groups.get(key)

    if (found) {
      found.count += 1
      found.landsTurn = Math.min(found.landsTurn, m.landsTurn)
      found.turnsAway = found.landsTurn - turn
    } else {
      groups.set(key, {
        key,
        sourceLabel: m.sourceLabel,
        choiceLabel: m.choiceLabel,
        appliedTurn: m.appliedTurn,
        landsTurn: m.landsTurn,
        turnsAway: m.landsTurn - turn,
        count: 1,
      })
    }
  }

  return [...groups.values()].sort((a, b) => a.landsTurn - b.landsTurn || a.appliedTurn - b.appliedTurn)
}

export function whenItLands(turnsAway: number): string {
  if (turnsAway <= 1) return 'lands next turn'
  return `lands in ${turnsAway} turns`
}
