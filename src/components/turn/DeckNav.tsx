/**
 * Where you are in the turn. One tab per card, so the whole turn is legible
 * without moving the screen, and any card is one click away.
 */

import type { DeckItem } from '../../hooks/useTurnDeck'

const KICKER: Record<DeckItem['kind'], string> = {
  note: 'Note',
  event: 'Happened',
  decision: 'Decision',
}

export default function DeckNav({
  items,
  index,
  onGoTo,
}: {
  items: DeckItem[]
  index: number
  onGoTo: (i: number) => void
}) {
  if (items.length < 2) return null

  return (
    <nav className="deck-nav" aria-label="Cards in this turn">
      {items.map((item, i) => (
        <button
          key={item.id}
          type="button"
          className={`deck-tab ${i === index ? 'now' : ''} ${item.answered ? 'done' : 'open'}`}
          aria-current={i === index}
          onClick={() => onGoTo(i)}
        >
          <span className="deck-tab-kicker">{KICKER[item.kind]}</span>
          <span className="deck-tab-mark" aria-hidden="true" />
        </button>
      ))}
    </nav>
  )
}
