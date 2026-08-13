/**
 * CONFIRMATION BIAS - the four people who actually do it.
 *
 * Team capacity used to be a bar that went down, which meant spending it cost
 * the player nothing they could feel. It is the same lever underneath; what
 * changed is that it now has names on it.
 *
 * Derived, like the subject mix: the roster reads the team level, it never
 * feeds back into it. Nothing here touches the pipeline or the scoring.
 *
 * Pronouns are authored, never inferred, and every line about a person is
 * built from their set. See `docs/cast-sheet.md`.
 */

import type { PronounKey } from './pronouns'

export interface TeamMember {
  id: string
  name: string
  role: string
  pronoun: PronounKey
  /**
   * Team level at which this person starts to struggle, and the level at which
   * they go. Different for each of them, so the team frays in a fixed order
   * that the player learns.
   */
  strains: number
  leaves: number
  /** What is happening to them, in their own right. */
  fine: string
  stretched: string
  looking: string
  gone: string
}

/**
 * Events that take a named person out for a while. The roster reads these
 * straight off the queue, so an absence in the story is an absence on screen
 * and neither can drift from the other.
 */
export interface Absence {
  /** The event that did it. */
  eventId: string
  memberId: string
  /** Turns they are away, counting from the turn the event fired. */
  turns: number
  /** Shown against their name while they are off. */
  line: string
}

export const ABSENCES: Absence[] = [
  {
    eventId: 'e-sickness',
    memberId: 'yusuf',
    turns: 3,
    line: 'Signed off with a broken leg. The cat is unrepentant.',
  },
]

export const TEAM: TeamMember[] = [
  {
    id: 'gemma',
    name: 'Gemma',
    role: 'Senior Admissions Officer',
    pronoun: 'she',
    strains: 58,
    leaves: 22,
    fine: 'Has the whole cycle in her head and a spreadsheet she does not need.',
    stretched: 'Still has it in her head. Has stopped offering to help with anything else.',
    looking: 'Has been asked to be a reference for somebody, which is how it starts.',
    gone: 'Left in June. Took fourteen years of context with her and nobody wrote it down.',
  },
  {
    id: 'yusuf',
    name: 'Yusuf',
    role: 'Admissions Officer',
    pronoun: 'he',
    strains: 50,
    leaves: 30,
    fine: 'Fast, cheerful, and the only one who likes Clearing.',
    stretched: 'Working through lunch and calling it flexible working.',
    looking: 'Has a phone interview booked for a Tuesday afternoon and a dentist appointment in the diary.',
    gone: 'Went to a competitor for two grades more. Everybody understood.',
  },
  {
    id: 'ravi',
    name: 'Ravi',
    role: 'Admissions Data and CRM',
    pronoun: 'they',
    strains: 44,
    leaves: 18,
    fine: 'Quietly holding the CRM together with rules nobody else can read.',
    stretched: 'Firefighting the CRM instead of fixing it, which they have mentioned.',
    looking: 'Has started saying "if I am still here in September".',
    gone: 'Gone. Nobody knows what half the automations do and the documentation is a screenshot.',
  },
  {
    id: 'claire',
    name: 'Claire',
    role: 'Applicant Experience Coordinator',
    pronoun: 'she',
    strains: 64,
    leaves: 26,
    fine: 'Running open days and answering the phone in a voice that makes people want to come.',
    stretched: 'Doing the open days and the enquiries and the complaints, and one of those is winning.',
    looking: 'Has gone part-time on paper and full-time in practice.',
    gone: 'Resigned after results day. The exit interview was three pages long.',
  },
]
