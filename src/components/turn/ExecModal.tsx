/**
 * A senior colleague, standing between you and your desk.
 *
 * This used to be a card at the top of the page, which meant a player who had
 * scrolled down simply found that nothing worked. It is now what it always
 * described itself as: a person in the way. It covers the screen, it takes
 * focus, and it does not accept being closed. Escape, the scrim and the button
 * behind it all get the same answer, which is that they are still talking.
 *
 * Who that person is comes from `config/cast.ts`, so the pronoun in the line
 * under the card is always the pronoun in the copy inside it.
 */

import { useEffect, useRef, useState } from 'react'
import { NAG_INTERVAL_MS, nagLine, pleasedLine } from '../../config/nags'
import { BULB_LINES, pickEgg } from '../../config/eggs'
import { castFor } from '../../config/cast'
import { PRONOUNS } from '../../config/pronouns'
import type { BrightIdea } from '../../config/interruptions'
import ExecFigure from '../art/ExecFigure'
import OptionGrid from './OptionGrid'

/** How long he stays after you have given him an answer. */
const LEAVE_MS = 950
/** How long the card rattles when you try to get past him. */
const REFUSE_MS = 480

export default function ExecModal({
  idea,
  chosen,
  onChoose,
  onLeave,
}: {
  idea: BrightIdea
  chosen: string | undefined
  onChoose: (optionId: string) => void
  onLeave: () => void
}) {
  const cast = castFor(idea.id)
  const p = PRONOUNS[cast.pronoun]

  const [nag, setNag] = useState(0)
  const [refused, setRefused] = useState(false)
  // Switch the idea off. He carries on regardless, which is the joke.
  const [bulbOut, setBulbOut] = useState(false)
  const refuseTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // He gets more insistent on his own, whether or not you touch anything.
  useEffect(() => {
    if (chosen) return
    const t = setInterval(() => setNag((n) => n + 1), NAG_INTERVAL_MS)
    return () => clearInterval(t)
  }, [chosen])

  // Answered. He takes a beat to look pleased, then goes.
  useEffect(() => {
    if (!chosen) return
    const t = setTimeout(onLeave, LEAVE_MS)
    return () => clearTimeout(t)
  }, [chosen, onLeave])

  function refuse() {
    if (chosen) return
    setNag((n) => n + 1)
    setRefused(true)
    clearTimeout(refuseTimer.current)
    refuseTimer.current = setTimeout(() => setRefused(false), REFUSE_MS)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        refuse()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  useEffect(() => () => clearTimeout(refuseTimer.current), [])

  return (
    <div className="exec-scrim" onMouseDown={refuse}>
      <div
        className={`exec ${chosen ? 'settled' : ''} ${refused ? 'refusing' : ''}`}
        role="alertdialog"
        aria-modal="true"
        aria-label={`${idea.who} has an idea`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="exec-figure">
          <ExecFigure
            look={cast.look}
            excited={!chosen}
            bulbOut={bulbOut}
            onBulbClick={() => setBulbOut(true)}
          />
        </div>

        <div className="exec-body">
          <span className="exec-tag">{chosen ? 'Dealt with' : 'Have you got a minute?'}</span>
          <div className="exec-who">
            {idea.who} <span className="exec-role">{idea.role}</span>
          </div>
          <div className="exec-idea">{idea.idea}</div>
          <p className="exec-copy">{idea.copy}</p>

          <OptionGrid
            options={idea.options.map((o) => ({ id: o.id, label: o.label, blurb: o.aside }))}
            chosen={chosen}
            onChoose={onChoose}
            autoFocus
          />

          <p className={`exec-nag ${nag > 0 || chosen || bulbOut ? 'on' : ''}`} aria-live="polite">
            {chosen
              ? pleasedLine(p)
              : bulbOut && nag === 0
                ? pickEgg(BULB_LINES, idea.id.length)
                : nag > 0
                  ? nagLine(nag - 1, p)
                  : ''}
          </p>
        </div>
      </div>
    </div>
  )
}
