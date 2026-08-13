/**
 * The turn deck.
 *
 * A turn used to be a page you scrolled: events, then decisions, then a button
 * somewhere below the fold. It is now a deck of cards, one at a time, and the
 * screen never moves. This hook owns what is in the deck and where the player
 * is in it. Rendering is somebody else's problem.
 *
 * The bright idea is deliberately not in here. A senior colleague barging in is
 * a modal over the whole screen, not a card you can page past.
 */

import { useCallback, useMemo, useRef, useState } from 'react'
import { turnDecisions } from '../sim/engine'
import type { Decision, GameEvent, GameState } from '../sim/types'

/** How long a card sits looking answered before the deck moves on. */
const ADVANCE_MS = 420

export type DeckItem =
  | { kind: 'note'; id: string; title: string; body: string; answered: true }
  | { kind: 'event'; id: string; event: GameEvent; answered: boolean }
  | { kind: 'decision'; id: string; decision: Decision; answered: boolean }

export function buildDeck(
  state: GameState,
  choices: Record<string, string>,
  eventChoices: Record<string, string>,
  notes: { id: string; title: string; body: string }[] = [],
): DeckItem[] {
  const items: DeckItem[] = notes.map((n) => ({ ...n, kind: 'note', answered: true }))

  for (const event of state.activeEvents) {
    items.push({
      kind: 'event',
      id: event.id,
      event,
      answered: event.response ? Boolean(eventChoices[event.id]) : true,
    })
  }

  for (const decision of turnDecisions(state)) {
    items.push({
      kind: 'decision',
      id: decision.id,
      decision,
      answered: Boolean(choices[decision.id]),
    })
  }

  return items
}

export interface Deck {
  items: DeckItem[]
  index: number
  current: DeckItem | undefined
  /** Cards still waiting on an answer. Drives the advance button. */
  outstanding: number
  allAnswered: boolean
  goTo: (i: number) => void
  next: () => void
  prev: () => void
  /** Called after a choice. Moves to the next unanswered card, if there is one. */
  advanceSoon: () => void
}

export function useTurnDeck(items: DeckItem[]): Deck {
  const [index, setIndex] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // The advance fires after a beat, by which point `items` has been rebuilt
  // with the answer in it. A ref is how the timeout sees the fresh list.
  const latest = useRef(items)
  latest.current = items

  const clamped = Math.min(index, Math.max(items.length - 1, 0))

  const goTo = useCallback((i: number) => {
    clearTimeout(timer.current)
    setIndex(i)
  }, [])

  const next = useCallback(() => {
    setIndex((i) => Math.min(i + 1, latest.current.length - 1))
  }, [])

  const prev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0))
  }, [])

  const advanceSoon = useCallback(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setIndex((i) => {
        const list = latest.current
        const after = list.findIndex((it, n) => n > i && !it.answered)
        if (after !== -1) return after
        const anywhere = list.findIndex((it) => !it.answered)
        return anywhere === -1 ? i : anywhere
      })
    }, ADVANCE_MS)
  }, [])

  const outstanding = useMemo(() => items.filter((i) => !i.answered).length, [items])

  return {
    items,
    index: clamped,
    current: items[clamped],
    outstanding,
    allAnswered: outstanding === 0,
    goTo,
    next,
    prev,
    advanceSoon,
  }
}
