/**
 * One decision, filling the deck. The frame belongs to the deck, so this is
 * only the question and its options.
 */

import type { Decision } from '../sim/types'
import OptionGrid from './turn/OptionGrid'

export default function DecisionCard({
  decision,
  chosen,
  onChoose,
}: {
  decision: Decision
  chosen: string | undefined
  onChoose: (optionId: string) => void
}) {
  return (
    <>
      <h2 className="card-q">{decision.question}</h2>
      {decision.context && <p className="card-context">{decision.context}</p>}
      <OptionGrid options={decision.options} chosen={chosen} onChoose={onChoose} />
    </>
  )
}
