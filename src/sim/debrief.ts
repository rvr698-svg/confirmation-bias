/**
 * CONFIRMATION BIAS - the debrief.
 *
 * The most important screen in the game, so it does not guess. For every
 * choice the player made, it lifts that choice's entries out of the modifier
 * queue, reruns the whole cycle without them, and reports the difference.
 *
 * That is why the debrief can say "without this you would have finished 174
 * lower" and be exactly right. The modifier queue is the source, as briefed.
 */

import { TURNS } from '../config/config'
import { computePosition, turnLabel } from './engine'
import { scorecard } from './scoring'
import type { GameState, ModifierEntry, Position, Scorecard } from './types'

/** "In November" or "At confirmation", for the narrative lines. */
function whenPhrase(landsTurn: number): string {
  return landsTurn > TURNS.length ? 'At confirmation' : `In ${turnLabel(landsTurn)}`
}

export interface MeasureDelta {
  id: string
  name: string
  delta: number
}

export interface TracedChoice {
  key: string
  sourceLabel: string
  choiceLabel: string
  appliedTurn: number
  entries: ModifierEntry[]
  /** Intake with the choice minus intake without it. */
  deltaIntake: number
  deltaMeasures: MeasureDelta[]
  impact: number
  /** One line per landing turn, in the order the player felt them. */
  narrative: string[]
  counterfactual: string
}

function groupKey(m: ModifierEntry): string {
  return `${m.sourceId}::${m.choiceLabel}`
}

/**
 * Rank every player choice by how much it actually changed the outcome.
 * Events the player had no say in are excluded. You cannot be debriefed on a
 * rail strike.
 */
export function traceChoices(state: GameState): TracedChoice[] {
  const actual = computePosition(state.queue, Number.POSITIVE_INFINITY)
  const actualCard = scorecard(actual)

  const groups = new Map<string, ModifierEntry[]>()
  for (const m of state.queue) {
    if (m.sourceKind !== 'decision') continue
    const key = groupKey(m)
    const list = groups.get(key)
    if (list) list.push(m)
    else groups.set(key, [m])
  }

  const traced: TracedChoice[] = []

  for (const [key, entries] of groups) {
    const without = state.queue.filter((m) => groupKey(m) !== key)
    const cf = computePosition(without, Number.POSITIVE_INFINITY)
    const cfCard = scorecard(cf)

    const deltaIntake = actual.pipeline.enrolled - cf.pipeline.enrolled
    const deltaMeasures: MeasureDelta[] = actualCard.measures.map((m, i) => ({
      id: m.id,
      name: m.name,
      delta: m.score - cfCard.measures[i].score,
    }))

    const impact =
      Math.abs(deltaIntake) / 10 +
      deltaMeasures.reduce((s, d) => s + Math.abs(d.delta), 0)

    traced.push({
      key,
      sourceLabel: entries[0].sourceLabel,
      choiceLabel: entries[0].choiceLabel,
      appliedTurn: entries[0].appliedTurn,
      entries,
      deltaIntake,
      deltaMeasures,
      impact,
      narrative: buildNarrative(entries),
      counterfactual: buildCounterfactual(deltaIntake, actual, cf),
    })
  }

  return traced.sort((a, b) => b.impact - a.impact)
}

/**
 * One line per landing turn, not per effect. A Clearing decision whose five
 * effects all land the same day should read as one moment, and a November
 * decision that pays out in January and again in July should read as three.
 */
function buildNarrative(entries: ModifierEntry[]): string[] {
  const byTurn = new Map<number, string[]>()
  for (const e of [...entries].sort((a, b) => a.landsTurn - b.landsTurn)) {
    const notes = byTurn.get(e.landsTurn) ?? []
    if (!notes.includes(e.note)) notes.push(e.note)
    byTurn.set(e.landsTurn, notes)
  }

  const applied = entries[0].appliedTurn
  const sentence = (n: string) => n[0].toUpperCase() + n.slice(1)

  return [...byTurn].map(([landsTurn, notes]) => {
    const when = landsTurn === applied ? 'Straight away' : whenPhrase(landsTurn)
    return `${when}: ${notes.map(sentence).join('. ')}.`
  })
}

function buildCounterfactual(deltaIntake: number, actual: Position, cf: Position): string {
  const bits: string[] = []
  const n = Math.round(Math.abs(deltaIntake))

  if (n >= 8) {
    bits.push(
      deltaIntake > 0
        ? `you would have finished ${n.toLocaleString('en-GB')} lower`
        : `you would have finished ${n.toLocaleString('en-GB')} higher`,
    )
  }

  const profileDelta = actual.measures.entryProfile - cf.measures.entryProfile
  if (Math.abs(profileDelta) >= 0.4) {
    bits.push(
      profileDelta < 0
        ? `your entry profile would have been ${Math.abs(profileDelta).toFixed(1)} points higher`
        : `your entry profile would have been ${profileDelta.toFixed(1)} points lower`,
    )
  }

  const accessDelta = (actual.measures.access - cf.measures.access) * 100
  if (Math.abs(accessDelta) >= 0.4) {
    bits.push(
      accessDelta > 0
        ? `your access intake would have been ${accessDelta.toFixed(1)} points lower`
        : `your access intake would have been ${Math.abs(accessDelta).toFixed(1)} points higher`,
    )
  }

  const spendDelta = actual.measures.spend - cf.measures.spend
  if (Math.abs(spendDelta) >= 15) {
    bits.push(
      spendDelta > 0
        ? `you would have spent £${Math.round(spendDelta).toLocaleString('en-GB')}k less`
        : `you would have spent £${Math.round(Math.abs(spendDelta)).toLocaleString('en-GB')}k more`,
    )
  }

  const teamDelta = actual.measures.team - cf.measures.team
  if (Math.abs(teamDelta) >= 2) {
    bits.push(
      teamDelta < 0
        ? `your team would have finished in better shape`
        : `your team would have finished in worse shape`,
    )
  }

  if (bits.length === 0) return 'Removing it would have changed almost nothing. Not every decision matters.'

  const joined =
    bits.length === 1
      ? bits[0]
      : `${bits.slice(0, -1).join(', ')} and ${bits[bits.length - 1]}`

  return `Without it, ${joined}.`
}

export interface Debrief {
  position: Position
  card: Scorecard
  traced: TracedChoice[]
  headlines: TracedChoice[]
}

export function buildDebrief(state: GameState): Debrief {
  const position = computePosition(state.queue, Number.POSITIVE_INFINITY)
  const card = scorecard(position, state.seed)
  const traced = traceChoices(state)
  return { position, card, traced, headlines: traced.slice(0, 3) }
}
