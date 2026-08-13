/**
 * ADMISSIONS! - shared simulation types.
 *
 * The important idea in this file is ModifierEntry. A decision never changes a
 * number now. It puts an entry on a queue with a delay. The engine recomputes
 * the whole pipeline from base values plus whatever has landed. The lag is data,
 * not logic, which is what makes the debrief traceable.
 */

/** Every quantity a decision or event is allowed to touch. */
export type Lever =
  // pipeline
  | 'applications'
  | 'offerRate'
  | 'firmRate'
  | 'insuranceRate'
  | 'unconditionalShare'
  | 'conditionsMet'
  | 'insuranceConversion'
  | 'melt'
  | 'clearingShare'
  // measures
  | 'entryProfile'
  | 'access'
  | 'spend'
  | 'team'
  /** Standing with the regulator and the press. 100 is untroubled. */
  | 'reputation'
  /**
   * Fines and regulatory costs, £k. Kept apart from `spend` because money paid
   * to a regulator is money not spent on students: it has to hurt the budget
   * without ever improving the league table.
   */
  | 'penalties'
  // institutional
  | 'target'
  | 'teachingCapacity'
  | 'accommodationBeds'
  | 'placementSupply'

export type Op = 'add' | 'mul'

/** The authored shape of an effect, before it is placed on the queue. */
export interface EffectSpec {
  lever: Lever
  op: Op
  value: number
  /** Turns until this lands. 0 means it bites immediately. */
  delay: number
  /** Player-facing phrasing used by the debrief. British English, active voice. */
  note: string
}

/** An effect that has been committed to the queue by a real choice. */
export interface ModifierEntry extends EffectSpec {
  /** Unique per entry, so the debrief can point at one line. */
  id: string
  /** Turn the choice was made on. */
  appliedTurn: number
  /** appliedTurn + delay. Nothing before this turn sees it. */
  landsTurn: number
  sourceKind: 'decision' | 'event' | 'capacity'
  sourceId: string
  /** e.g. "November: Offer-making policy" */
  sourceLabel: string
  /** e.g. "Loosen at the margin" */
  choiceLabel: string
}

export interface DecisionOption {
  id: string
  label: string
  blurb: string
  effects: EffectSpec[]
}

export interface Decision {
  id: string
  turn: number
  /** Turn 10 splits into confirmation then Clearing. */
  phase?: 'confirmation' | 'clearing'
  question: string
  context?: string
  options: DecisionOption[]
}

export interface EventResponseOption {
  id: string
  label: string
  effects: EffectSpec[]
}

export interface GameEvent {
  id: string
  /** Inclusive turn window this event may fire in. */
  window: [number, number]
  weight: number
  headline: string
  copy: string
  /** Fires regardless of any response. */
  effects: EffectSpec[]
  /** If present, the player must answer before the turn advances. */
  response?: {
    prompt: string
    options: EventResponseOption[]
  }
  /** Only fires if this returns true. Used for the capacity-driven events. */
  requires?: (s: GameState) => boolean
}

/** Every lever, resolved to a value. The engine's working state. */
export type Levels = Record<Lever, number>

/** The seven pipeline stages, in order, as the brief specifies. */
export interface Pipeline {
  applications: number
  offersMade: number
  firmAcceptances: number
  insuranceAcceptances: number
  conditionsMet: number
  enrolled: number
  retained: number
  /** Split out for display. enrolled includes this. */
  clearingIntake: number
  mainCycleIntake: number
}

export interface Measures {
  intake: number
  target: number
  entryProfile: number
  access: number
  /** Everything charged to you: recruitment, breach costs and any fine. */
  spend: number
  budget: number
  team: number
  reputation: number
  /** The fine on its own, because it is a different kind of money. */
  penalties: number
}

export type BandKey = 'strong' | 'holding' | 'pressure' | 'exposed'

export interface Band {
  key: BandKey
  label: string
  line: string
}

export interface ScoredMeasure {
  id: string
  name: string
  band: Band
  /** 0-100, internal. Never shown as a raw number. */
  score: number
  /** What the player is shown: 1 to 5. */
  of5: number
  detail: string
}

export interface Scorecard {
  measures: ScoredMeasure[]
  overall: number
  /** Out of five, averaged and rounded. The headline. */
  overallOf5: number
  verdict: string
  /** Two lines you could paste into an appraisal without lying. */
  appraisal: [string, string]
}

export interface CapacityBreach {
  kind: 'teaching' | 'accommodation' | 'placement'
  over: number
  ceiling: number
}

/** A complete resolved snapshot of the institution at some turn. */
export interface Position {
  levels: Levels
  pipeline: Pipeline
  breaches: CapacityBreach[]
  measures: Measures
  retained: number
}

export interface TurnRecord {
  turn: number
  /** decisionId -> optionId */
  choices: Record<string, string>
  firedEventIds: string[]
  /** eventId -> optionId */
  eventChoices: Record<string, string>
  /** What the player was shown at the time, noise included. */
  shownForecast: number
  /** What was actually true at the time. Never shown during play. */
  trueProjection: number
}

export interface GameState {
  turn: number
  phase: 'intro' | 'playing' | 'debrief'
  turnPhase: 'confirmation' | 'clearing' | null
  seed: number
  queue: ModifierEntry[]
  history: TurnRecord[]
  /** Events already fired, so nothing repeats. */
  usedEventIds: string[]
  /**
   * The senior colleague currently standing in front of your desk. Nothing
   * else on the turn can be answered until they have been dealt with.
   */
  pendingIdea: import('../config/interruptions').BrightIdea | null
  usedIdeaIds: string[]
  /** The cake happens once a cycle, if it happens at all. */
  usedCake?: boolean
  /** Events fired this turn and still awaiting a response. */
  pendingEvents: GameEvent[]
  /** Events fired this turn, for display. */
  activeEvents: GameEvent[]
  choicesThisTurn: Record<string, string>
  breaches: CapacityBreach[]
}
