/**
 * CONFIRMATION BIAS - the simulation engine.
 *
 * The whole model is a pure function of the modifier queue. Nothing is
 * incrementally mutated, so there is no drift and no hidden state. To know the
 * position at any turn you ask what has landed by that turn and recompute.
 *
 *   levelsAt(queue, turn)  -> the levers as they stand
 *   computePipeline(levels) -> the seven stages
 *   computeMeasures(...)    -> the five measures plus capacity breaches
 *
 * The forecast is the same computation run with the entire queue, including
 * entries that have not landed yet, then deliberately corrupted with noise.
 */

import {
  BASELINE,
  CALIBRATION,
  SATURATION,
  CAPACITY,
  BREACH,
  MEASURE_BASE,
  FORECAST_NOISE,
  FORECAST_BIAS,
  EVENTS,
  IDEAS,
  TOTAL_TURNS,
  TURNS,
} from '../config/config'
import { BRIGHT_IDEAS, type BrightIdea } from '../config/interruptions'
import { DECISIONS, DECISION_NAMES, decisionsForTurn } from '../config/decisions'
import { EVENT_LIBRARY, MUTUALLY_EXCLUSIVE } from '../config/events'
import type {
  CapacityBreach,
  Decision,
  EffectSpec,
  GameEvent,
  GameState,
  Lever,
  Levels,
  Measures,
  ModifierEntry,
  Pipeline,
  Position,
} from './types'
import { clearingCalls } from './clearing'
import { clamp, draw, drawNormal } from './rng'

export type { Levels, Position }

/** Sensible bounds. A pile of modifiers must never produce a 140% offer rate. */
const BOUNDS: Record<Lever, [number, number]> = {
  applications: [5_000, 60_000],
  offerRate: [0.3, 0.98],
  firmRate: [0.06, 0.45],
  insuranceRate: [0.03, 0.3],
  unconditionalShare: [0, 0.8],
  conditionsMet: [0.35, 0.99],
  insuranceConversion: [0, 0.65],
  melt: [0, 0.28],
  clearingShare: [0, 0.35],
  entryProfile: [70, 130],
  access: [0.1, 0.75],
  spend: [0, 10_000],
  team: [0, 100],
  reputation: [0, 100],
  penalties: [0, 5_000],
  target: [1_000, 8_000],
  teachingCapacity: [500, 12_000],
  accommodationBeds: [200, 12_000],
  placementSupply: [50, 5_000],
}

export function baseLevels(): Levels {
  return {
    applications: BASELINE.applications,
    offerRate: BASELINE.offerRate,
    firmRate: BASELINE.firmRate,
    insuranceRate: BASELINE.insuranceRate,
    unconditionalShare: BASELINE.unconditionalShare,
    conditionsMet: BASELINE.conditionsMet,
    insuranceConversion: BASELINE.insuranceConversion,
    melt: BASELINE.melt,
    clearingShare: BASELINE.clearingShare,
    entryProfile: MEASURE_BASE.entryProfile,
    access: MEASURE_BASE.access,
    spend: MEASURE_BASE.spendCommitted,
    team: MEASURE_BASE.team,
    reputation: MEASURE_BASE.reputation,
    penalties: MEASURE_BASE.penalties,
    target: BASELINE.target,
    teachingCapacity: CAPACITY.teaching,
    accommodationBeds: CAPACITY.accommodation,
    placementSupply: CAPACITY.placement,
  }
}

/**
 * Diminishing returns. Approaches `max` asymptotically and behaves like the
 * identity while the total is small, so a first decision on a lever lands with
 * close to its full authored weight and the seventh barely registers.
 */
function soften(raw: number, max: number | undefined): number {
  if (!max) return raw
  return (max * raw) / (max + Math.abs(raw))
}

/**
 * Apply every queue entry that has landed by `asOfTurn`.
 * Pass Infinity to see the full projection, which is what the forecast does.
 *
 * Totals are accumulated per lever first, then calibrated and softened, then
 * applied. Doing it in that order is what stops twenty small decisions adding
 * up to an impossible offer rate.
 */
export function levelsAt(queue: ModifierEntry[], asOfTurn: number): Levels {
  const levels = baseLevels()
  const addRaw = {} as Record<Lever, number>
  const logRaw = {} as Record<Lever, number>

  const landed = queue
    .filter((m) => m.landsTurn <= asOfTurn)
    .sort((a, b) => a.landsTurn - b.landsTurn)

  for (const m of landed) {
    const k = CALIBRATION[m.lever] ?? 1
    if (m.op === 'add') {
      addRaw[m.lever] = (addRaw[m.lever] ?? 0) + m.value * k
    } else {
      logRaw[m.lever] = (logRaw[m.lever] ?? 0) + Math.log(m.value) * k
    }
  }

  for (const key of Object.keys(levels) as Lever[]) {
    const cap = SATURATION[key]
    if (addRaw[key]) levels[key] += soften(addRaw[key], cap)
    if (logRaw[key]) levels[key] *= Math.exp(soften(logRaw[key], cap))
    const [lo, hi] = BOUNDS[key]
    levels[key] = clamp(levels[key], lo, hi)
  }
  return levels
}

/** The seven stages, in the order the brief specifies. */
export function computePipeline(levels: Levels): Pipeline {
  const applications = levels.applications
  const offersMade = applications * levels.offerRate
  const firmAcceptances = offersMade * levels.firmRate
  const insuranceAcceptances = offersMade * levels.insuranceRate

  const unconditionalFirms = firmAcceptances * levels.unconditionalShare
  const conditionalFirms = firmAcceptances - unconditionalFirms
  const confirmedFromFirms =
    unconditionalFirms * (1 - BASELINE.unconditionalLapse) + conditionalFirms * levels.conditionsMet
  const confirmedFromInsurance = insuranceAcceptances * levels.insuranceConversion
  const conditionsMet = confirmedFromFirms + confirmedFromInsurance

  const mainCycleIntake = conditionsMet * (1 - levels.melt)
  const share = clamp(levels.clearingShare, 0, 0.34)
  const clearingIntake = mainCycleIntake * (share / (1 - share))
  const enrolled = mainCycleIntake + clearingIntake

  return {
    applications,
    offersMade,
    firmAcceptances,
    insuranceAcceptances,
    conditionsMet,
    enrolled,
    retained: enrolled * BASELINE.retention,
    clearingIntake,
    mainCycleIntake,
  }
}

/**
 * Capacity ceilings do not cap intake. They break things.
 */
export function computeBreaches(enrolled: number, levels: Levels): CapacityBreach[] {
  const breaches: CapacityBreach[] = []

  const teachingOver = enrolled - levels.teachingCapacity
  if (teachingOver > 0) {
    breaches.push({ kind: 'teaching', over: teachingOver, ceiling: levels.teachingCapacity })
  }

  const bedsNeeded = enrolled * CAPACITY.accommodationTakeUp
  const bedsOver = bedsNeeded - levels.accommodationBeds
  if (bedsOver > 0) {
    breaches.push({ kind: 'accommodation', over: bedsOver, ceiling: levels.accommodationBeds })
  }

  const placementsNeeded = enrolled * CAPACITY.placementShare
  const placementOver = placementsNeeded - levels.placementSupply
  if (placementOver > 0) {
    breaches.push({ kind: 'placement', over: placementOver, ceiling: levels.placementSupply })
  }

  return breaches
}

export interface BreachCost {
  spend: number
  team: number
  retentionLoss: number
}

export function breachCost(breaches: CapacityBreach[]): BreachCost {
  let spend = 0
  let team = 0
  let retentionLoss = 0
  for (const b of breaches) {
    const rates = BREACH[b.kind]
    spend += (b.over * rates.spendPerHead) / 1 // £k per head
    team += (b.over / 100) * rates.teamPer100
    retentionLoss += (b.over / 100) * (rates.retentionPer100 / 100)
  }
  return { spend, team, retentionLoss }
}

export function computePosition(queue: ModifierEntry[], asOfTurn: number): Position {
  const levels = levelsAt(queue, asOfTurn)
  const pipeline = computePipeline(levels)
  const breaches = computeBreaches(pipeline.enrolled, levels)
  const cost = breachCost(breaches)

  const measures: Measures = {
    intake: pipeline.enrolled,
    target: levels.target,
    entryProfile: levels.entryProfile,
    access: levels.access,
    // The fine is charged here with everything else, because Finance does not
    // care what the money was for.
    spend: levels.spend + cost.spend + levels.penalties,
    budget: MEASURE_BASE.budget,
    team: clamp(levels.team - cost.team, 0, 100),
    reputation: levels.reputation,
    penalties: levels.penalties,
  }

  const retained = pipeline.enrolled * clamp(BASELINE.retention - cost.retentionLoss, 0.6, 1)

  return { levels, pipeline, breaches, measures, retained }
}

/** The final, true outcome. No noise. This is what the scorecard reads. */
export function finalPosition(state: GameState): Position {
  return computePosition(state.queue, Number.POSITIVE_INFINITY)
}

/**
 * What the player is shown. The full projection, corrupted.
 *
 * Two sources of error. A per-run bias drawn once, which is why a player who
 * learns to "trust the forecast" is wrong in a consistent direction all cycle.
 * And per-turn jitter on top. Both vanish only on results day.
 */
export function forecastIntake(state: GameState, turn: number): number {
  const truth = computePosition(state.queue, Number.POSITIVE_INFINITY).pipeline.enrolled
  const noiseSd = FORECAST_NOISE[turn] ?? 0
  const biasDecay = FORECAST_BIAS.decayByTurn[turn] ?? 0

  const bias = drawNormal(state.seed, 'bias') * FORECAST_BIAS.sd * biasDecay
  const jitter = drawNormal(state.seed, `jitter:${turn}`) * noiseSd

  return truth * (1 + bias + jitter)
}

// ---------------------------------------------------------------- queue writes

let entryCounter = 0

export function makeEntries(
  effects: EffectSpec[],
  turn: number,
  sourceKind: ModifierEntry['sourceKind'],
  sourceId: string,
  sourceLabel: string,
  choiceLabel: string,
  scale = 1,
): ModifierEntry[] {
  return effects.map((e) => ({
    ...e,
    value: e.op === 'add' ? e.value * scale : Math.exp(Math.log(e.value) * scale),
    id: `${sourceId}:${e.lever}:${entryCounter++}`,
    appliedTurn: turn,
    landsTurn: turn + e.delay,
    sourceKind,
    sourceId,
    sourceLabel,
    choiceLabel,
  }))
}

// ---------------------------------------------------------------------- events

/**
 * Levers authored in units that mean something on their own. A hall closure of
 * 220 beds is 220 beds. Multiplying those by the event dial produced a
 * placement shortfall in nearly two thirds of playthroughs, which made the
 * ceiling feel arbitrary rather than earned.
 */
const REAL_UNIT_LEVERS: Lever[] = [
  'spend',
  'target',
  'teachingCapacity',
  'accommodationBeds',
  'placementSupply',
]

/** Applies the event dials. Real-unit levers pass through untouched. */
function scaleEventEffects(effects: EffectSpec[]): EffectSpec[] {
  return effects.map((e) => {
    if (REAL_UNIT_LEVERS.includes(e.lever)) return e
    const k = EVENTS.impact * (e.lever === 'team' ? EVENTS.teamImpact : 1)
    return {
      ...e,
      value: e.op === 'add' ? e.value * k : Math.exp(Math.log(e.value) * k),
    }
  })
}

/** Which events may fire this turn, given the window and what has been used. */
export function eligibleEvents(state: GameState, turn: number): GameEvent[] {
  const blocked = new Set<string>()
  for (const group of MUTUALLY_EXCLUSIVE) {
    if (group.some((id) => state.usedEventIds.includes(id))) {
      group.forEach((id) => blocked.add(id))
    }
  }
  return EVENT_LIBRARY.filter(
    (e) =>
      turn >= e.window[0] &&
      turn <= e.window[1] &&
      !state.usedEventIds.includes(e.id) &&
      !blocked.has(e.id) &&
      (e.requires ? e.requires(state) : true),
  )
}

function weightedPick(pool: GameEvent[], roll: number): GameEvent | null {
  if (pool.length === 0) return null
  const total = pool.reduce((sum, e) => sum + e.weight, 0)
  let cursor = roll * total
  for (const e of pool) {
    cursor -= e.weight
    if (cursor <= 0) return e
  }
  return pool[pool.length - 1]
}

/**
 * Roll for a senior colleague with an initiative. At most one at a time,
 * because two would be unfair and one is already how it feels.
 */
export function rollIdea(state: GameState, turn: number): BrightIdea | null {
  if (turn < IDEAS.minTurn || turn > IDEAS.maxTurn) return null
  if (draw(state.seed, `idea-gate:${turn}`) > IDEAS.chance) return null

  const pool = BRIGHT_IDEAS.filter(
    (i) => turn >= i.window[0] && turn <= i.window[1] && !state.usedIdeaIds.includes(i.id),
  )
  if (pool.length === 0) return null

  const total = pool.reduce((sum, i) => sum + i.weight, 0)
  let cursor = draw(state.seed, `idea-pick:${turn}`) * total
  for (const i of pool) {
    cursor -= i.weight
    if (cursor <= 0) return i
  }
  return pool[pool.length - 1]
}

export function rollEvents(state: GameState, turn: number): GameEvent[] {
  const fired: GameEvent[] = []
  const pool = eligibleEvents(state, turn)
  if (pool.length === 0) return fired

  if (draw(state.seed, `event-gate:${turn}`) > EVENTS.baseChance) return fired

  const first = weightedPick(pool, draw(state.seed, `event-pick:${turn}:0`))
  if (first) fired.push(first)

  if (
    fired.length > 0 &&
    EVENTS.maxPerTurn > 1 &&
    draw(state.seed, `event-second:${turn}`) < EVENTS.secondEventChance
  ) {
    const remaining = pool.filter((e) => e.id !== fired[0].id)
    const second = weightedPick(remaining, draw(state.seed, `event-pick:${turn}:1`))
    if (second) fired.push(second)
  }

  return fired
}

// ------------------------------------------------------------------ turn flow

export function createInitialState(seed: number): GameState {
  return {
    turn: 1,
    phase: 'intro',
    turnPhase: null,
    seed,
    queue: [],
    history: [],
    usedEventIds: [],
    pendingEvents: [],
    activeEvents: [],
    pendingIdea: null,
    usedIdeaIds: [],
    choicesThisTurn: {},
    breaches: [],
  }
}

/** Turn 10 is the only turn with two phases. */
export function phaseForTurn(turn: number): 'confirmation' | 'clearing' | null {
  return turn === TOTAL_TURNS ? 'confirmation' : null
}

/**
 * Clearing is the only phase whose decisions are not authored per turn: the
 * phone calls are drawn from the pool on the seed. They are ordinary decisions
 * once drawn, so the engine, the debrief and the harness need no special case.
 */
export function turnDecisions(state: GameState): Decision[] {
  const authored = decisionsForTurn(state.turn, state.turnPhase)
  if (state.turnPhase !== 'clearing') return authored
  return [...authored, ...clearingCalls(state.seed)]
}

export function decisionById(id: string): Decision | undefined {
  return DECISIONS.find((d) => d.id === id)
}

export function turnLabel(turn: number): string {
  return TURNS.find((t) => t.turn === turn)?.label ?? 'confirmation'
}

/**
 * Start of turn. Roll events, apply the effects the player has no say in, and
 * park any event that needs an answer. Events fire once per cycle.
 *
 * Turn 10's Clearing phase does not roll a second time. Results day gets one
 * set of events, which is already plenty.
 */
export function beginTurn(state: GameState): GameState {
  if (state.turnPhase === 'clearing') {
    return {
      ...state,
      activeEvents: [],
      pendingEvents: [],
      pendingIdea: null,
      choicesThisTurn: {},
    }
  }

  const idea = rollIdea(state, state.turn)

  const events = rollEvents(state, state.turn)
  const autoEntries = events.flatMap((e) =>
    makeEntries(
      scaleEventEffects(e.effects),
      state.turn,
      'event',
      e.id,
      `${turnLabel(state.turn)}: ${e.headline}`,
      '',
    ),
  )

  return {
    ...state,
    queue: [...state.queue, ...autoEntries],
    activeEvents: events,
    pendingEvents: events.filter((e) => e.response),
    usedEventIds: [...state.usedEventIds, ...events.map((e) => e.id)],
    pendingIdea: idea,
    usedIdeaIds: idea ? [...state.usedIdeaIds, idea.id] : state.usedIdeaIds,
    choicesThisTurn: {},
  }
}

/**
 * End of turn. Commit every choice to the queue and move on.
 *
 * Event responses are recorded as decisions, not events, because the player
 * made them. That is what makes them eligible for the debrief.
 */
export function commitTurn(
  state: GameState,
  decisionChoices: Record<string, string>,
  eventChoices: Record<string, string>,
  ideaChoice?: string,
): GameState {
  const entries: ModifierEntry[] = []

  if (state.pendingIdea && ideaChoice) {
    const idea = state.pendingIdea
    const option = idea.options.find((o) => o.id === ideaChoice)
    if (option) {
      entries.push(
        ...makeEntries(
          option.effects,
          state.turn,
          'decision',
          `${idea.id}:response`,
          `${turnLabel(state.turn)}: ${idea.who}, ${idea.role}`,
          option.label,
        ),
      )
    }
  }

  for (const decision of turnDecisions(state)) {
    const optionId = decisionChoices[decision.id]
    const option = decision.options.find((o) => o.id === optionId)
    if (!option) continue
    entries.push(
      ...makeEntries(
        option.effects,
        state.turn,
        'decision',
        decision.id,
        // Clearing calls are generated rather than authored, so they have no
        // entry in DECISION_NAMES. The question is the best label they have.
        `${turnLabel(state.turn)}: ${DECISION_NAMES[decision.id] ?? decision.question}`,
        option.label,
      ),
    )
  }

  for (const event of state.pendingEvents) {
    const optionId = eventChoices[event.id]
    const option = event.response?.options.find((o) => o.id === optionId)
    if (!option) continue
    entries.push(
      ...makeEntries(
        scaleEventEffects(option.effects),
        state.turn,
        'decision',
        `${event.id}:response`,
        `${turnLabel(state.turn)}: ${event.headline}`,
        option.label,
      ),
    )
  }

  const queue = [...state.queue, ...entries]

  // Both figures are taken from the queue as it stood while the player was
  // looking at the screen, not after this turn's choices were added. The
  // debrief must replay what they were actually shown.
  const record = {
    turn: state.turn,
    choices: { ...decisionChoices },
    firedEventIds: state.activeEvents.map((e) => e.id),
    eventChoices: { ...eventChoices },
    shownForecast: forecastIntake(state, state.turn),
    trueProjection: computePosition(state.queue, Number.POSITIVE_INFINITY).pipeline.enrolled,
  }

  const next: GameState = {
    ...state,
    queue,
    history: [...state.history, record],
    activeEvents: [],
    pendingEvents: [],
    pendingIdea: null,
    choicesThisTurn: {},
  }

  // Turn 10 runs confirmation at 8am, then Clearing through the day.
  if (state.turn === TOTAL_TURNS && state.turnPhase === 'confirmation') {
    return { ...next, turnPhase: 'clearing' }
  }
  if (state.turn === TOTAL_TURNS && state.turnPhase === 'clearing') {
    return { ...next, phase: 'debrief' }
  }

  const nextTurn = state.turn + 1
  return { ...next, turn: nextTurn, turnPhase: phaseForTurn(nextTurn) }
}

/** True once every decision and event response for the phase has an answer. */
export function turnIsAnswerable(
  state: GameState,
  decisionChoices: Record<string, string>,
  eventChoices: Record<string, string>,
  ideaChoice?: string,
): boolean {
  const decisionsDone = turnDecisions(state).every((d) => Boolean(decisionChoices[d.id]))
  const eventsDone = state.pendingEvents.every((e) => Boolean(eventChoices[e.id]))
  const ideaDone = !state.pendingIdea || Boolean(ideaChoice)
  return decisionsDone && eventsDone && ideaDone
}

export function startGame(seed: number): GameState {
  const s = createInitialState(seed)
  return beginTurn({ ...s, phase: 'playing', turnPhase: phaseForTurn(1) })
}
