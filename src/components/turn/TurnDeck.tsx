/**
 * The card in front of you. Exactly one at a time, sized to the space it has,
 * so a turn is never something you scroll through.
 */

import DecisionCard from '../DecisionCard'
import EventCard from '../EventCard'
import DeckNav from './DeckNav'
import type { Deck, DeckItem } from '../../hooks/useTurnDeck'

function kicker(item: DeckItem, position: number, total: number): string {
  const of = total > 1 ? ` ${position} of ${total}` : ''
  if (item.kind === 'note') return 'Where you stand'
  if (item.kind === 'event') return `Something has happened${of}`
  return `Your decision${of}`
}

export default function TurnDeck({
  deck,
  choices,
  eventChoices,
  onChooseDecision,
  onChooseEvent,
}: {
  deck: Deck
  choices: Record<string, string>
  eventChoices: Record<string, string>
  onChooseDecision: (decisionId: string, optionId: string) => void
  onChooseEvent: (eventId: string, optionId: string) => void
}) {
  const item = deck.current
  if (!item) return null

  const last = deck.index === deck.items.length - 1
  // News and notes have nothing to click, so they get a way onwards of their
  // own rather than leaving the player hunting for the arrow.
  const readOnly = item.kind === 'note' || (item.kind === 'event' && !item.event.response)

  return (
    <div className="deck">
      <div className={`deck-card is-${item.kind} ${item.answered ? 'is-answered' : ''}`} key={item.id}>
        <div className="deck-card-head">
          <span className="deck-kicker">{kicker(item, deck.index + 1, deck.items.length)}</span>
          {item.answered && item.kind !== 'note' && <span className="deck-done">Answered</span>}
        </div>

        <div className="deck-card-body">
          {item.kind === 'note' && (
            <>
              <h2 className="card-q">{item.title}</h2>
              <p className="card-context">{item.body}</p>
            </>
          )}

          {item.kind === 'event' && (
            <EventCard
              event={item.event}
              chosen={eventChoices[item.event.id]}
              onChoose={(optionId) => onChooseEvent(item.event.id, optionId)}
            />
          )}

          {item.kind === 'decision' && (
            <DecisionCard
              decision={item.decision}
              chosen={choices[item.decision.id]}
              onChoose={(optionId) => onChooseDecision(item.decision.id, optionId)}
            />
          )}

          {readOnly && !last && (
            <div className="card-onward">
              <button type="button" className="btn small" onClick={deck.next}>
                Right. Next
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="deck-foot">
        <DeckNav items={deck.items} index={deck.index} onGoTo={deck.goTo} />
        <div className="deck-steps">
          <button
            type="button"
            className="step"
            onClick={deck.prev}
            disabled={deck.index === 0}
            aria-label="Previous card"
          >
            &#8592;
          </button>
          <button
            type="button"
            className="step"
            onClick={deck.next}
            disabled={last}
            aria-label="Next card"
          >
            &#8594;
          </button>
        </div>
      </div>
    </div>
  )
}
