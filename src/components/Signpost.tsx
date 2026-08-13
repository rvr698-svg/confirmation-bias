/**
 * The end of the game, in its own voice.
 *
 * A grade screen, so the primary action is always "again". The three actions
 * are identical on every ending and only the words around them change: going
 * again, passing it on, and talking to Think Bold.
 *
 * The Think Bold button carries their actual mark from `public/think-bold.png`
 * and sits on white, because the script half of the logo is black.
 */

import { useState } from 'react'
import { signpostFor, THINK_BOLD_LABEL, THINK_BOLD_URL } from '../config/signpost'

export default function Signpost({
  overallOf5,
  onRestart,
  onShare,
}: {
  overallOf5: number
  onRestart: () => void
  /** Copies the result and the link. Returns false if the clipboard refused. */
  onShare: () => Promise<boolean>
}) {
  const s = signpostFor(overallOf5)
  const [shared, setShared] = useState<'no' | 'yes' | 'failed'>('no')

  async function share() {
    const ok = await onShare()
    setShared(ok ? 'yes' : 'failed')
    window.setTimeout(() => setShared('no'), 2600)
  }

  return (
    <aside className={`signpost tier-${s.min}`}>
      <h2 className="signpost-headline">{s.headline}</h2>
      <p className="signpost-body">{s.body}</p>

      <div className="signpost-choice">
        <button type="button" className="btn" onClick={onRestart}>
          Run another cycle
        </button>

        <button type="button" className="btn ghost" onClick={share}>
          {shared === 'yes'
            ? 'Copied. Go on then'
            : shared === 'failed'
              ? 'Copy it from the box above'
              : 'Send it to your team'}
        </button>
      </div>

      <div className="signpost-brand">
        <span className="signpost-or">{s.brandLead}</span>
        <a
          className="btn tb"
          href={THINK_BOLD_URL}
          target="_blank"
          rel="noreferrer noopener"
        >
          <img className="tb-logo" src="/think-bold.png" alt="Think Bold" />
          {THINK_BOLD_LABEL}
        </a>
      </div>

      {s.foot && <p className="signpost-foot">{s.foot}</p>}
    </aside>
  )
}
