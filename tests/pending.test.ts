/**
 * The tray tells you what you have coming. It must never tell you what it will
 * do, because that is the whole game.
 */

import { describe, expect, it } from 'vitest'
import { pendingItems, whenItLands } from '../src/sim/pending'
import type { ModifierEntry } from '../src/sim/types'

function entry(over: Partial<ModifierEntry>): ModifierEntry {
  return {
    id: 'x',
    lever: 'applications',
    op: 'mul',
    value: 1.02,
    delay: 3,
    appliedTurn: 2,
    landsTurn: 5,
    sourceKind: 'decision',
    sourceId: 'd2-entry',
    sourceLabel: 'October: Entry requirement positioning',
    choiceLabel: 'Hold your standard offer',
    note: 'something happened',
    ...over,
  }
}

describe('in the post', () => {
  it('groups a decision into one line however many effects it has', () => {
    const queue = [
      entry({ id: 'a', lever: 'applications' }),
      entry({ id: 'b', lever: 'entryProfile', landsTurn: 6 }),
      entry({ id: 'c', lever: 'team', landsTurn: 7 }),
    ]
    const items = pendingItems(queue, 3)

    expect(items).toHaveLength(1)
    expect(items[0].count).toBe(3)
    expect(items[0].landsTurn).toBe(5)
    expect(items[0].turnsAway).toBe(2)
  })

  it('keeps decisions from different turns apart', () => {
    const items = pendingItems(
      [entry({ id: 'a' }), entry({ id: 'b', appliedTurn: 4, landsTurn: 8 })],
      3,
    )
    expect(items).toHaveLength(2)
  })

  it('leaves out anything that has already landed', () => {
    expect(pendingItems([entry({ landsTurn: 3 })], 3)).toHaveLength(0)
    expect(pendingItems([entry({ landsTurn: 4 })], 3)).toHaveLength(1)
  })

  it('leaves out things that were done to you', () => {
    const items = pendingItems([entry({ sourceKind: 'event', sourceId: 'e-rail-strike' })], 3)
    expect(items).toHaveLength(0)
  })

  it('never reveals what an effect will do', () => {
    const items = pendingItems([entry({})], 3)
    const shown = JSON.stringify(items)

    expect(shown).not.toMatch(/something happened/)
    expect(shown).not.toMatch(/applications/)
    expect(shown).toMatch(/Entry requirement positioning/)
    expect(shown).toMatch(/Hold your standard offer/)
  })

  it('counts in turns, not numbers', () => {
    expect(whenItLands(1)).toBe('lands next turn')
    expect(whenItLands(3)).toBe('lands in 3 turns')
  })

  it('puts the next thing to land first', () => {
    const items = pendingItems(
      [
        entry({ id: 'a', sourceId: 'late', landsTurn: 9 }),
        entry({ id: 'b', sourceId: 'soon', landsTurn: 4 }),
      ],
      3,
    )
    expect(items[0].key).toContain('soon')
  })
})
