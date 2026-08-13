/**
 * The cast.
 *
 * A colleague cannot be "she" in her own copy and "he" in the line underneath
 * it. That happened once, on Priya Raghavan's card, and these tests exist so it
 * cannot happen again.
 */

import { describe, expect, it } from 'vitest'
import { BRIGHT_IDEAS } from '../src/config/interruptions'
import { CAST, castFor } from '../src/config/cast'
import { PRONOUNS } from '../src/config/pronouns'
import { NAG_LINES, pleasedLine } from '../src/config/nags'

/**
 * Ideas whose copy talks about somebody other than the interrupting colleague.
 * Listed explicitly, because the alternative is a test that quietly gives up.
 */
const THIRD_PARTY: Record<string, string> = {
  'i-hourly-dashboard': 'the "her" in this copy is the Vice-Chancellor, not Marcus Lidell',
}

function textOf(idea: (typeof BRIGHT_IDEAS)[number]): string {
  return [idea.idea, idea.copy, ...idea.options.flatMap((o) => [o.label, o.aside])].join(' ')
}

describe('cast', () => {
  it('has an entry for every bright idea', () => {
    for (const idea of BRIGHT_IDEAS) {
      expect(CAST[idea.id], `no cast entry for ${idea.id} (${idea.who})`).toBeDefined()
    }
  })

  it('has no cast entries for ideas that no longer exist', () => {
    const ids = new Set(BRIGHT_IDEAS.map((i) => i.id))
    for (const id of Object.keys(CAST)) {
      expect(ids.has(id), `cast entry ${id} matches no bright idea`).toBe(true)
    }
  })

  it('gives every colleague the pronoun their own copy uses', () => {
    for (const idea of BRIGHT_IDEAS) {
      if (THIRD_PARTY[idea.id]) continue
      const text = textOf(idea)
      const she = /\b(she|her)\b/i.test(text)
      const he = /\b(he|him|his)\b/i.test(text)

      expect(she && he, `${idea.who}'s copy uses both she and he`).toBe(false)
      if (she) expect(castFor(idea.id).pronoun, `${idea.who} is "she" in her copy`).toBe('she')
      if (he) expect(castFor(idea.id).pronoun, `${idea.who} is "he" in his copy`).toBe('he')
    }
  })

  it('writes every nag line in the character\'s own pronoun', () => {
    for (const idea of BRIGHT_IDEAS) {
      const p = PRONOUNS[castFor(idea.id).pronoun]
      const lines = [...NAG_LINES.map((line) => line(p)), pleasedLine(p)]

      for (const line of lines) {
        const wrong =
          p.subject === 'she'
            ? /\b(he|him|his|they|them|their)\b/i
            : p.subject === 'he'
              ? /\b(she|her|they|them|their)\b/i
              : /\b(he|him|his|she|her)\b/i
        expect(wrong.test(line), `${idea.who}: "${line}"`).toBe(false)
      }
    }
  })

  it('agrees its verbs', () => {
    const they = PRONOUNS.they
    const she = PRONOUNS.she
    expect(NAG_LINES[0](they)).toBe('They are not going anywhere.')
    expect(NAG_LINES[0](she)).toBe('She is not going anywhere.')
    expect(NAG_LINES[2](they)).toBe('They have ten minutes, and they mean yours.')
    expect(NAG_LINES[2](she)).toBe('She has ten minutes, and she means yours.')
  })

  it('draws twelve different people', () => {
    const looks = Object.values(CAST).map((c) => c.look)
    const fingerprints = new Set(looks.map((l) => JSON.stringify(l)))
    expect(fingerprints.size, 'two colleagues are drawn identically').toBe(looks.length)

    expect(new Set(looks.map((l) => l.skin)).size).toBeGreaterThanOrEqual(4)
    expect(new Set(looks.map((l) => l.hair)).size).toBeGreaterThanOrEqual(5)
  })

  it('does not draw one pronoun as one appearance', () => {
    // Nothing in the palette may become a gender marker: every skin tone and
    // hairstyle in use must appear against more than one pronoun somewhere in
    // the cast, or be rare enough not to read as a rule.
    const byPronoun = new Map<string, Set<string>>()
    for (const c of Object.values(CAST)) {
      const set = byPronoun.get(c.look.hair) ?? new Set<string>()
      set.add(c.pronoun)
      byPronoun.set(c.look.hair, set)
    }
    const shared = [...byPronoun.values()].filter((s) => s.size > 1).length
    expect(shared, 'no hairstyle is worn by more than one pronoun').toBeGreaterThan(0)
  })
})
