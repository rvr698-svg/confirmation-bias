/**
 * The roster is the team lever with names on it. An absence in the story has
 * to be an absence on the screen, for exactly as long as the story says.
 */

import { describe, expect, it } from 'vitest'
import { ABSENCES, TEAM } from '../src/config/team'
import { EVENT_LIBRARY } from '../src/config/events'
import { PRONOUNS } from '../src/config/pronouns'
import { roster, stillHere } from '../src/sim/team'
import type { ModifierEntry } from '../src/sim/types'

function eventEntry(eventId: string, appliedTurn: number): ModifierEntry {
  return {
    id: `${eventId}:0`,
    lever: 'team',
    op: 'add',
    value: -5,
    delay: 0,
    appliedTurn,
    landsTurn: appliedTurn,
    sourceKind: 'event',
    sourceId: eventId,
    sourceLabel: 'test',
    choiceLabel: '',
    note: 'test',
  }
}

describe('the roster', () => {
  it('frays in a fixed order as the team level drops', () => {
    expect(roster(90).every((r) => r.state === 'fine')).toBe(true)
    expect(roster(0).every((r) => r.state === 'gone')).toBe(true)

    const mid = roster(55)
    expect(mid.some((r) => r.state === 'fine')).toBe(true)
    expect(mid.some((r) => r.state !== 'fine')).toBe(true)
  })

  it('signs somebody off when the event that does it has fired', () => {
    const absence = ABSENCES[0]
    const queue = [eventEntry(absence.eventId, 4)]

    const during = roster(70, queue, 4).find((r) => r.member.id === absence.memberId)!
    expect(during.state).toBe('off')
    expect(during.backIn).toBe(absence.turns)
    expect(during.line).toBe(absence.line)
  })

  it('brings them back when the absence is over', () => {
    const absence = ABSENCES[0]
    const queue = [eventEntry(absence.eventId, 4)]

    const later = roster(70, queue, 4 + absence.turns).find((r) => r.member.id === absence.memberId)!
    expect(later.state).not.toBe('off')
  })

  it('does not sign off somebody who has already left', () => {
    const absence = ABSENCES[0]
    const queue = [eventEntry(absence.eventId, 4)]
    const wrecked = roster(5, queue, 4).find((r) => r.member.id === absence.memberId)!

    expect(wrecked.state).toBe('gone')
  })

  it('counts an absence as not here', () => {
    const queue = [eventEntry(ABSENCES[0].eventId, 4)]
    expect(stillHere(90, queue, 4)).toBe(TEAM.length - 1)
    expect(stillHere(90, [], 4)).toBe(TEAM.length)
  })

  it('points every absence at a real person and a real event', () => {
    for (const absence of ABSENCES) {
      expect(TEAM.some((m) => m.id === absence.memberId), absence.memberId).toBe(true)
      expect(EVENT_LIBRARY.some((e) => e.id === absence.eventId), absence.eventId).toBe(true)
    }
  })

  it('writes the sickness event in the pronouns of the person it is about', () => {
    // Yusuf is "he" in the roster, so his event has to be too. This is the same
    // rule the interrupting colleagues follow.
    const absence = ABSENCES.find((a) => a.eventId === 'e-sickness')!
    const member = TEAM.find((m) => m.id === absence.memberId)!
    const event = EVENT_LIBRARY.find((e) => e.id === absence.eventId)!
    const p = PRONOUNS[member.pronoun]
    const text = `${event.headline} ${event.copy}`

    expect(text).toContain(member.name)
    const wrong = p.subject === 'he' ? /\b(she|her)\b/i : /\b(he|him|his)\b/i
    expect(wrong.test(text), text).toBe(false)
  })
})
