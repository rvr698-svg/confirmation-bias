/**
 * The pipeline as it actually stands, which is a different thing from the
 * projection above it. Only what has landed by this turn is in here.
 *
 * Folds away on a short window, because the board never scrolls and the
 * projection is the reading that has to stay visible.
 */

import { TOTAL_TURNS } from '../../config/config'
import type { Pipeline } from '../../sim/types'

const fmt = (n: number) => Math.round(n).toLocaleString('en-GB')

export default function PipelinePanel({
  pipeline,
  turn,
  open,
}: {
  pipeline: Pipeline
  turn: number
  open: boolean
}) {
  const rows: [string, number][] = [
    ['Applications', pipeline.applications],
    ['Offers made', pipeline.offersMade],
    ['Firm acceptances', pipeline.firmAcceptances],
    ['Insurance acceptances', pipeline.insuranceAcceptances],
    [turn === TOTAL_TURNS ? 'Conditions met' : 'Conditions met, modelled', pipeline.conditionsMet],
  ]

  return (
    <details className="panel wash rail-panel pipeline foldable" open={open}>
      <summary>
        <span className="eyebrow">The pipeline as it stands</span>
      </summary>
      <div className="stage-list">
        {rows.map(([name, value]) => (
          <div className="stage" key={name}>
            <span className="stage-name">{name}</span>
            <span className="stage-value">{fmt(value)}</span>
          </div>
        ))}
      </div>
    </details>
  )
}
