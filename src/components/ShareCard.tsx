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

/** Plain text has no soft wrap you can rely on, so the verdict wraps itself. */
function wrap(sentence: string, width = 68): string {
  const out: string[] = []
  let line = ''

  for (const word of sentence.split(' ')) {
    if (line && `${line} ${word}`.length > width) {
      out.push(line)
      line = word
    } else {
      line = line ? `${line} ${word}` : word
    }
  }
  if (line) out.push(line)
  return out.join('\n')
}

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
    wrap(card.verdict),
  ].join('\n')
}

/**
 * The invitation, added on the way to the clipboard and never shown on screen.
 * Somebody pasting their score into a group chat should be pasting a way in
 * with it, without the box on the page looking like an advert.
 */
export function shareInvitation(): string {
  const here = typeof window === 'undefined' ? '' : window.location.origin
  return here ? `Fancy a go at it yourself? ${here}` : ''
}

/** What actually lands in the clipboard: the result, then the invitation. */
export function shareForClipboard(card: Scorecard, position: Position): string {
  const invite = shareInvitation()
  return invite ? `${shareText(card, position)}

${invite}` : shareText(card, position)
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
      await navigator.clipboard.writeText(shareForClipboard(card, position))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      // Clipboard permission refused. The text is on screen and selectable.
      setCopied(false)
    }
  }

  // One box, not two. The pasteable block is the one people actually use, and a
  // pretty card beside it that nobody can copy is just furniture.
  return (
    <div className="share-block">
      <div className="copy-block">{text}</div>
      <button type="button" className="btn ghost" style={{ marginTop: 12 }} onClick={copy}>
        {copied ? 'Copied' : 'Copy for posting'}
      </button>
    </div>
  )
}
