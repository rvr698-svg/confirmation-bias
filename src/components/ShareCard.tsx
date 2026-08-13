/**
 * The share card.
 *
 * Two forms of the same thing. A card that reads as a screenshot, and a plain
 * text block that survives being pasted into a LinkedIn box.
 *
 * No score is humiliating. The bands are named so that the worst one still
 * sounds like something that happened to you rather than something you are.
 */

import { useState } from 'react'
import { BAND_MARK } from '../sim/scoring'
import type { Position, Scorecard } from '../sim/types'

const fmt = (n: number) => Math.round(n).toLocaleString('en-GB')

export function shareText(card: Scorecard, position: Position): string {
  const width = Math.max(...card.measures.map((m) => m.name.length))
  const rows = card.measures
    .map((m) => `${m.name.padEnd(width + 2)}${BAND_MARK[m.band.key]}  ${m.band.label}`)
    .join('\n')

  const intake = fmt(position.pipeline.enrolled)
  const target = fmt(position.measures.target)

  return [
    'CONFIRMATION BIAS  |  one admissions cycle, ten turns',
    '',
    rows,
    '',
    `Finished on ${intake} against a target of ${target}.`,
    '',
    card.verdict,
  ].join('\n')
}

export default function ShareCard({
  card,
  position,
}: {
  card: Scorecard
  position: Position
}) {
  const [copied, setCopied] = useState(false)
  const text = shareText(card, position)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      // Clipboard permission refused. The text is on screen and selectable.
      setCopied(false)
    }
  }

  return (
    <div className="share-wrap">
      <div className="share-card">
        <div className="share-title">Confirmation Bias</div>
        <div className="share-sub">One admissions cycle. Ten turns. September to Clearing.</div>

        <div className="share-rows">
          {card.measures.map((m) => (
            <div className="share-row" key={m.id}>
              <span>{m.name}</span>
              <span className="share-dots">{BAND_MARK[m.band.key]}</span>
              <span className="share-band">{m.band.label}</span>
            </div>
          ))}
        </div>

        <div className="share-verdict">{card.verdict}</div>
        <div className="share-foot">
          Finished on {fmt(position.pipeline.enrolled)} against {fmt(position.measures.target)}
        </div>
      </div>

      <div>
        <div className="copy-block">{text}</div>
        <button type="button" className="btn ghost" style={{ marginTop: 12 }} onClick={copy}>
          {copied ? 'Copied' : 'Copy for posting'}
        </button>
      </div>
    </div>
  )
}
