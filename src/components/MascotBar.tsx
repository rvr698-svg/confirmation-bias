/**
 * Marge plus a speech bubble. Her mood is derived from the same numbers the
 * dashboard shows, so she is a shortcut rather than a separate opinion.
 */

import { useEffect, useRef, useState } from 'react'
import { CAPACITY } from '../config/config'
import { TOASTS, pickEgg } from '../config/eggs'
import { MASCOT_NAME, MASCOT_ROLE, pickLine, type Mood } from '../config/mascot'
import type { Position } from '../sim/types'
import Mascot from './Mascot'

/** How long she holds the mug up. */
const TOAST_MS = 2600

export function moodInPlay(turn: number, landed: Position, projected: number): Mood {
  const ratio = projected / landed.measures.target
  const team = landed.measures.team

  const breach =
    projected > landed.levels.teachingCapacity ||
    projected * CAPACITY.accommodationTakeUp > landed.levels.accommodationBeds ||
    projected * CAPACITY.placementShare > landed.levels.placementSupply

  if (breach && ratio > 1.04) return 'panic'
  if (team < 38) return 'frazzled'
  if (ratio < 0.93) return 'worried'
  if (turn === 1) return 'keen'
  if (turn >= 7 || team < 56) return 'busy'
  return 'calm'
}

export function moodAtEnd(overall: number): Mood {
  if (overall >= 68) return 'proud'
  if (overall >= 45) return 'spent'
  return 'wrecked'
}

export default function MascotBar({
  mood,
  seed,
  turn,
  line,
  compact = false,
}: {
  mood: Mood
  seed: number
  turn: number
  line?: string
  /** Rail version: she is smaller and the bubble sits beside her. */
  compact?: boolean
}) {
  // Click her and she raises her mug. It changes nothing, which is the point.
  const [toast, setToast] = useState(0)
  const toasting = toast > 0
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  function raiseAMug() {
    setToast((n) => n + 1)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(0), TOAST_MS)
  }

  return (
    <div className={`mascot-bar ${compact ? 'compact' : ''}`}>
      <button
        type="button"
        className="mascot-button"
        onClick={raiseAMug}
        aria-label={`${MASCOT_NAME}. Click for a toast.`}
      >
        <Mascot mood={mood} size={compact ? 78 : 132} toasting={toasting} />
      </button>
      <div className="bubble">
        <p className="bubble-text">
          {toasting ? pickEgg(TOASTS, seed + toast) : (line ?? pickLine(mood, seed, turn))}
        </p>
        <span className="bubble-who">
          {MASCOT_NAME} <span className="muted">/ {MASCOT_ROLE}</span>
        </span>
      </div>
    </div>
  )
}
