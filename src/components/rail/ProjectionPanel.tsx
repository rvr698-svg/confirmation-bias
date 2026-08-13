/**
 * The projected intake, and how much of it to believe.
 *
 * This is the whole projection including decisions that have not landed, and it
 * carries error the player cannot see. The confidence bars are the only hint
 * they get, and they are honest about being vague.
 */

import { FORECAST_NOISE, TOTAL_TURNS } from '../../config/config'

const fmt = (n: number) => Math.round(n).toLocaleString('en-GB')

function confidence(turn: number): { bars: number; word: string } {
  const sd = FORECAST_NOISE[turn] ?? 0
  if (sd === 0) return { bars: 5, word: 'Actual. Results are in.' }
  if (sd >= 0.06) return { bars: 1, word: 'Low confidence. It is early.' }
  if (sd >= 0.04) return { bars: 2, word: 'Limited confidence.' }
  if (sd >= 0.02) return { bars: 3, word: 'Moderate confidence.' }
  return { bars: 4, word: 'Firming up, but not settled.' }
}

export default function ProjectionPanel({
  turn,
  projected,
  target,
  pending,
}: {
  turn: number
  projected: number
  target: number
  pending: number
}) {
  const ratio = projected / target
  const tone = ratio > 1.09 || ratio < 0.91 ? 'bad' : ratio > 1.04 || ratio < 0.96 ? 'warn' : ''
  const conf = confidence(turn)

  return (
    <div className="panel rail-panel projection">
      <span className="eyebrow">
        {turn === TOTAL_TURNS ? 'Confirmed position' : 'Projected intake'}
      </span>
      <div className={`forecast-value ${tone}`} key={Math.round(projected)}>
        {fmt(projected)}
      </div>
      <div className="against">against a target of {fmt(target)}</div>
      <div className="confidence">
        <span className="conf-bars">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={`conf-bar ${i < conf.bars ? 'on' : ''}`} />
          ))}
        </span>
        <span>{conf.word}</span>
      </div>
      {pending > 0 && (
        <div className="pending">
          {pending} effect{pending === 1 ? '' : 's'} of decisions you have already taken have not
          landed yet.
        </div>
      )}
    </div>
  )
}
