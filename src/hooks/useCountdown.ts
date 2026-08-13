/**
 * A clock that runs down in front of you.
 *
 * Used once, for Clearing. It starts when the phones start and it does not
 * stop, because that is the whole point of the day.
 */

import { useEffect, useRef, useState } from 'react'

export interface Countdown {
  /** Whole seconds remaining. */
  left: number
  /** 1 at the start, 0 at the end. For the draining bar. */
  fraction: number
  expired: boolean
  running: boolean
}

export function useCountdown(seconds: number, running: boolean): Countdown {
  const [left, setLeft] = useState(seconds)
  const startedAt = useRef<number | null>(null)

  useEffect(() => {
    if (!running) return
    if (startedAt.current === null) startedAt.current = performance.now()

    const tick = () => {
      const elapsed = (performance.now() - (startedAt.current ?? 0)) / 1000
      setLeft(Math.max(0, Math.ceil(seconds - elapsed)))
    }

    tick()
    const id = setInterval(tick, 250)
    return () => clearInterval(id)
  }, [running, seconds])

  return {
    left,
    fraction: seconds > 0 ? left / seconds : 0,
    expired: left <= 0,
    running,
  }
}
