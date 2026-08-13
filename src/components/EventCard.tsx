/**
 * One event, filling the deck.
 *
 * Some events are simply news and have no response. Those still take a card,
 * because being told a hall has flooded is part of the turn.
 */

import type { GameEvent } from '../sim/types'
import OptionGrid from './turn/OptionGrid'

export default function EventCard({
  event,
  chosen,
  onChoose,
}: {
  event: GameEvent
  chosen: string | undefined
  onChoose: (optionId: string) => void
}) {
  return (
    <>
      <h2 className="card-q">{event.headline}</h2>
      <p className="card-context">{event.copy}</p>

      {event.response ? (
        <>
          <div className="card-prompt">{event.response.prompt}</div>
          <OptionGrid options={event.response.options} chosen={chosen} onChoose={onChoose} />
        </>
      ) : (
        <p className="card-noted">Nothing to answer. It has already happened.</p>
      )}
    </>
  )
}
