/**
 * The share text.
 *
 * The invitation is added on the way to the clipboard and never rendered, so
 * the box on the page is a result and the thing somebody pastes into a group
 * chat is a result plus a way in.
 */

import { describe, expect, it, vi, afterEach } from 'vitest'
import { shareForClipboard, shareInvitation, shareText } from '../src/components/ShareCard'
import { computePosition } from '../src/sim/engine'
import { scorecard } from '../src/sim/scoring'

const position = computePosition([], 10)
const card = scorecard(position, 7)

function withOrigin(origin: string, run: () => void) {
  vi.stubGlobal('window', { location: { origin } })
  try {
    run()
  } finally {
    vi.unstubAllGlobals()
  }
}

afterEach(() => vi.unstubAllGlobals())

describe('sharing', () => {
  it('shows the result on screen without an advert in it', () => {
    withOrigin('https://admissionsgame.netlify.app', () => {
      const onScreen = shareText(card, position)
      expect(onScreen).toContain('ADMISSIONS!')
      expect(onScreen).not.toMatch(/netlify|Fancy a go/)
    })
  })

  it('adds the invitation on the way to the clipboard', () => {
    withOrigin('https://admissionsgame.netlify.app', () => {
      const pasted = shareForClipboard(card, position)
      expect(pasted.startsWith(shareText(card, position))).toBe(true)
      expect(pasted).toContain('Fancy a go at it yourself?')
      expect(pasted).toContain('https://admissionsgame.netlify.app')
    })
  })

  it('uses wherever the game is actually running', () => {
    withOrigin('http://localhost:5273', () => {
      expect(shareInvitation()).toContain('http://localhost:5273')
    })
  })

  it('says nothing rather than something broken when there is no page', () => {
    // Rendered on a server, or in a test with no window: no link, no invitation.
    expect(shareInvitation()).toBe('')
    expect(shareForClipboard(card, position)).toBe(shareText(card, position))
  })

  it('keeps the result readable when pasted as plain text', () => {
    withOrigin('https://admissionsgame.netlify.app', () => {
      const lines = shareForClipboard(card, position).split('\n')
      expect(lines.length).toBeGreaterThan(6)
      for (const line of lines) expect(line.length).toBeLessThan(80)
    })
  })
})
