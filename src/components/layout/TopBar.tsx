/**
 * The only fixed furniture. Wordmark, where you are, and ten pips.
 */

import { TOTAL_TURNS, TURNS } from '../../config/config'
import { DISCLAIMER_LONG, DISCLAIMER_SHORT } from './Disclaimer'

export default function TopBar({
  turn,
  phase,
}: {
  turn: number
  phase: 'confirmation' | 'clearing' | null
}) {
  return (
    <header className="topbar">
      <span className="wordmark">Admissions!</span>
      <span className="topbar-note" title={DISCLAIMER_LONG}>
        {DISCLAIMER_SHORT}
      </span>
      <span className="turn-count">
        Turn {turn} of {TOTAL_TURNS}
        {phase === 'confirmation' && ' - confirmation, 8am'}
        {phase === 'clearing' && ' - Clearing'}
      </span>
      <span className="pips">
        {TURNS.map((t) => (
          <span
            key={t.turn}
            className={`pip ${t.turn < turn ? 'done' : t.turn === turn ? 'now' : ''}`}
            title={t.label}
          />
        ))}
      </span>
    </header>
  )
}
