/**
 * CONFIRMATION BIAS - who is still here.
 *
 * Turns the team level into four people. Derived: the roster reads the lever
 * and the queue, and never writes to either, so the pipeline, the scoring and
 * the acceptance tests do not know this file exists.
 *
 * Absences come off the queue rather than off a flag, so somebody who is off
 * sick in the story is off sick on the screen, for exactly as long.
 */

import { ABSENCES, TEAM, type TeamMember } from '../config/team'
import type { ModifierEntry } from './types'

export type TeamState = 'fine' | 'stretched' | 'looking' | 'gone' | 'off'

export interface RosterEntry {
  member: TeamMember
  state: TeamState
  line: string
  /** Turns until they are back. Only set while they are off. */
  backIn?: number
}

/** The four states that come from the team level. Off sick comes from an event. */
export type StrainState = Exclude<TeamState, 'off'>

export function stateOf(member: TeamMember, team: number): StrainState {
  if (team <= member.leaves) return 'gone'
  if (team <= member.leaves + 12) return 'looking'
  if (team <= member.strains) return 'stretched'
  return 'fine'
}

/** The turn an absence-causing event fired, if it has. */
function firedOn(queue: ModifierEntry[], eventId: string): number | null {
  const entry = queue.find((m) => m.sourceKind === 'event' && m.sourceId === eventId)
  return entry ? entry.appliedTurn : null
}

export function roster(team: number, queue: ModifierEntry[] = [], turn = 0): RosterEntry[] {
  return TEAM.map((member) => {
    for (const absence of ABSENCES) {
      if (absence.memberId !== member.id) continue
      const started = firedOn(queue, absence.eventId)
      if (started === null) continue

      const backIn = started + absence.turns - turn
      // Somebody who has left does not come back from sick leave.
      if (backIn > 0 && stateOf(member, team) !== 'gone') {
        return { member, state: 'off', line: absence.line, backIn }
      }
    }

    const state = stateOf(member, team)
    return { member, state, line: member[state] }
  })
}

export function stillHere(team: number, queue: ModifierEntry[] = [], turn = 0): number {
  return roster(team, queue, turn).filter((r) => r.state !== 'gone' && r.state !== 'off').length
}
