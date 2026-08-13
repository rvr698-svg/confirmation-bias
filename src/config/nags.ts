/**
 * CONFIRMATION BIAS - what they say while you stall.
 *
 * The interruption cannot be dismissed, closed, or waited out. Trying to get
 * past it escalates through these, and so does simply sitting there.
 *
 * Every line is built from the character's pronoun set, because the line under
 * the card and the copy inside it are about the same person. Nothing here
 * touches the model.
 */

import { cap, type PronounSet } from './pronouns'

/** How long they wait before saying the next one, unprompted. */
export const NAG_INTERVAL_MS = 9_000

type NagLine = (p: PronounSet) => string

export const NAG_LINES: NagLine[] = [
  (p) => `${cap(p.subject)} ${p.is} not going anywhere.`,
  (p) => `${cap(p.subject)} ${p.has} pulled up a chair.`,
  (p) => `${cap(p.subject)} ${p.has} ten minutes, and ${p.subject} mean${p.s} yours.`,
  (p) => `${cap(p.subject)} ${p.is} telling you about the conference again.`,
  (p) => `${cap(p.subject)} ${p.has} started drawing it on your whiteboard.`,
  (p) => `${cap(p.subject)} will keep going. ${cap(p.subject)} ${p.has} done this for twenty years.`,
]

export function nagLine(step: number, p: PronounSet): string {
  return NAG_LINES[Math.min(step, NAG_LINES.length - 1)](p)
}

/** Said once you have given them an answer, whatever the answer was. */
export function pleasedLine(p: PronounSet): string {
  return `${cap(p.subject)} ${p.is} delighted. ${cap(p.subject)} will be back.`
}
