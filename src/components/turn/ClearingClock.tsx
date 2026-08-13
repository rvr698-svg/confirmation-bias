/**
 * The Clearing clock. The only thing in the game that moves on its own.
 *
 * It shows the time left, how many calls are still ringing, and it goes red
 * and starts flashing when there is nearly none. When it hits zero the
 * remaining callers ring somebody else.
 */

import { CLEARING } from '../../config/clearing'
import { RIVAL } from '../../config/rival'
import type { Countdown } from '../../hooks/useCountdown'

function clock(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function ClearingClock({
  countdown,
  waiting,
}: {
  countdown: Countdown
  /** Calls still unanswered. */
  waiting: number
}) {
  const panic = countdown.left <= CLEARING.panicSeconds && !countdown.expired
  const state = countdown.expired ? 'done' : panic ? 'panic' : ''

  return (
    <div className={`clearing-clock ${state}`} role="status">
      <span className="clock-face">{clock(countdown.left)}</span>

      <div className="clock-body">
        <span className="clock-label">
          {countdown.expired
            ? `Phones off. ${waiting > 0 ? RIVAL.lostLine(`${waiting} of them`) : 'You got to all of them.'}`
            : waiting > 0
              ? `${waiting} still holding`
              : 'Nobody waiting. Yet.'}
        </span>
        <div className="clock-bar">
          <div className="clock-fill" style={{ width: `${Math.max(0, countdown.fraction) * 100}%` }} />
        </div>
        {!countdown.expired && (
          <span className="clock-rule">
            Every call sets the line the team follows for the rest of the day.
          </span>
        )}
      </div>
    </div>
  )
}
