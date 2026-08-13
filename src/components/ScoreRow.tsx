/**
 * One measure, out of five.
 *
 * The band name is the joke and the number is the meaning. Testers kept asking
 * whether "Broadly on track" was good, so the number goes first and the band
 * sits behind it.
 */

import { STARS_MAX } from '../config/config'
import type { ScoredMeasure } from '../sim/types'

const BAND_CLASS: Record<string, string> = {
  strong: 'band-strong',
  holding: 'band-holding',
  pressure: 'band-pressure',
  exposed: 'band-exposed',
}

export default function ScoreRow({ measure }: { measure: ScoredMeasure }) {
  return (
    <div className="score-row">
      <div className="score-head">
        <span className="score-name">{measure.name}</span>
        <span className="score-outof" aria-label={`${measure.of5} out of ${STARS_MAX}`}>
          <strong>{measure.of5}</strong>
          <span className="score-max">/{STARS_MAX}</span>
        </span>
      </div>

      <div className="score-pips" aria-hidden="true">
        {Array.from({ length: STARS_MAX }).map((_, i) => (
          <span key={i} className={`score-pip ${i < measure.of5 ? `on ${BAND_CLASS[measure.band.key]}` : ''}`} />
        ))}
      </div>

      <span className={`band-tag ${BAND_CLASS[measure.band.key]}`}>{measure.band.label}</span>
      <span className="score-detail">{measure.detail}</span>
    </div>
  )
}
