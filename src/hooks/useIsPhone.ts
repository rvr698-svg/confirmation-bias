/**
 * Is there room for a rail at all?
 *
 * The rail is the one part of the board that cannot simply shrink. On a phone
 * it used to lie down as a strip carrying more than a metre of content past a
 * 350px window, with the projected intake somewhere off the right-hand edge.
 * Where it will not fit it becomes a summary you can open instead, and that has
 * to be a real branch in the markup rather than a CSS rule.
 *
 * Narrow or short both count. A phone held sideways is 375 points tall, and a
 * rail lying across the top of that leaves the card no height to exist in --
 * measured at zero, which is a card you cannot read or answer.
 *
 * Matches the breakpoints in the stylesheets. Change one, change both.
 */

import { useEffect, useState } from 'react'

const PHONE = '(max-width: 640px), (max-height: 560px)'

export function useIsPhone(): boolean {
  const [phone, setPhone] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(PHONE).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(PHONE)
    const onChange = () => setPhone(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return phone
}
