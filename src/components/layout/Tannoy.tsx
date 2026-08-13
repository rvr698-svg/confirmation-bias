/**
 * The tannoy. One announcement per turn, from an institution that has decided
 * everything is going well.
 *
 * It sits above the card because it is the first thing you hear when you walk
 * in, and it never says anything the dashboard has not already said. It is
 * only the spin.
 *
 * Clicking the horn gets you the car park announcement. Every institution has
 * one and it is always about a silver estate.
 */

import { useState } from 'react'
import { TANNOY_EGGS, pickEgg } from '../../config/eggs'
import { PALETTE } from '../../config/palette'

export default function Tannoy({ line }: { line: string }) {
  const [taps, setTaps] = useState(0)

  return (
    <div className="tannoy" role="status">
      <button
        type="button"
        className="tannoy-horn"
        aria-label="Tannoy"
        onClick={() => setTaps((n) => n + 1)}
      >
        <svg viewBox="0 0 24 20" width="20" height="17">
          <path
            d="M 3 7 h 4 l 7 -5 v 16 l -7 -5 h -4 z"
            fill={PALETTE.gold}
            stroke={PALETTE.ink}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M 17 6 q 3 4 0 8 M 20 3 q 5 7 0 14"
            fill="none"
            stroke={PALETTE.ink}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <p className="tannoy-line">{taps > 0 ? pickEgg(TANNOY_EGGS, taps - 1) : line}</p>
    </div>
  )
}
