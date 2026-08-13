/**
 * Is there room in the rail for the reference panels to sit open?
 *
 * The board never scrolls, so on a short window something has to fold away.
 * This decides which readouts start open rather than letting the rail spill.
 */

import { useEffect, useState } from 'react'

/** Below this, the pipeline detail starts folded. */
const TALL = '(min-height: 880px)'

export function useTallViewport(): boolean {
  const [tall, setTall] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(TALL).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(TALL)
    const onChange = () => setTall(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return tall
}
