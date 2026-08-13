/**
 * The advert, at the end, in the game's own voice. Which one you get depends
 * on how the cycle actually went, and the worst one is not an advert at all.
 */

import { signpostFor } from '../config/signpost'

export default function Signpost({
  overallOf5,
  onRestart,
}: {
  overallOf5: number
  onRestart: () => void
}) {
  const s = signpostFor(overallOf5)

  return (
    <aside className={`signpost tier-${s.min}`}>
      <span className="eyebrow">{s.eyebrow}</span>
      <h2 className="signpost-headline">{s.headline}</h2>
      <p className="signpost-body">{s.body}</p>

      {s.restart ? (
        <button type="button" className="btn signpost-link" onClick={onRestart}>
          Go round again
        </button>
      ) : (
        s.href && (
          <a className="btn signpost-link" href={s.href} target="_blank" rel="noreferrer noopener">
            {s.linkLabel}
          </a>
        )
      )}

      {s.foot && <p className="signpost-foot">{s.foot}</p>}
    </aside>
  )
}
