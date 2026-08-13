/**
 * Three steps, once, at the start of the first turn.
 *
 * It draws a ring around a real element rather than describing where things
 * are, because the thing testers missed was the panel itself, not the words.
 * The ring is measured from the live element, so it stays correct whatever the
 * layout has done to fit the viewport.
 */

import { useEffect, useLayoutEffect, useState } from 'react'
import { TOUR } from '../../config/tour'

interface Box {
  top: number
  left: number
  width: number
  height: number
}

function measure(selector: string): Box | null {
  const el = document.querySelector(selector)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { top: r.top, left: r.left, width: r.width, height: r.height }
}

export default function Tour({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const [box, setBox] = useState<Box | null>(null)
  const current = TOUR[step]

  useLayoutEffect(() => {
    const update = () => setBox(measure(current.target))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [current])

  // Learn it by using it: opening the panel is what moves the tour on.
  useEffect(() => {
    if (!current.openTarget) return
    const el = document.querySelector(current.openTarget) as HTMLDetailsElement | null
    if (!el) return

    const onToggle = () => {
      if (!el.open) return
      if (step < TOUR.length - 1) setStep(step + 1)
      else onDone()
    }
    el.addEventListener('toggle', onToggle)
    return () => el.removeEventListener('toggle', onToggle)
  }, [current, step, onDone])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onDone()
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        if (step < TOUR.length - 1) setStep(step + 1)
        else onDone()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step, onDone])

  if (!box) return null

  const pad = 6
  const ring: React.CSSProperties = {
    top: box.top - pad,
    left: box.left - pad,
    width: box.width + pad * 2,
    height: box.height + pad * 2,
  }

  // Put the caption beside the ring where there is room, and under it if not.
  const roomRight = window.innerWidth - (box.left + box.width)
  const beside = roomRight > 380
  const caption: React.CSSProperties = beside
    ? { top: Math.min(box.top, window.innerHeight - 240), left: box.left + box.width + 22 }
    : {
        top: Math.min(box.top + box.height + 16, window.innerHeight - 230),
        left: Math.max(16, Math.min(box.left, window.innerWidth - 400)),
      }

  const last = step === TOUR.length - 1

  return (
    <div className="tour" role="dialog" aria-label="How to read this screen">
      <div className="tour-ring" style={ring} />

      <div className="tour-caption" style={caption}>
        <span className="tour-count">
          {step + 1} of {TOUR.length}
        </span>
        <h2 className="tour-title">{current.title}</h2>
        <p className="tour-body">{current.body}</p>

        {current.prompt && <p className="tour-prompt">{current.prompt}</p>}

        <div className="tour-actions">
          <button
            type="button"
            className="btn small"
            onClick={() => (last ? onDone() : setStep(step + 1))}
          >
            {last ? 'Got it' : 'Next'}
          </button>
          {!last && (
            <button type="button" className="tour-skip" onClick={onDone}>
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
