/**
 * One turn, on one screen.
 *
 * The board is fixed to the viewport: bar at the top, state down the left, the
 * card you are answering in the middle, the way out along the bottom. Nothing
 * here scrolls, so nothing can hide below the fold, which is what used to make
 * the interruption feel like a bug rather than a person.
 *
 * The per-turn answers live here rather than in App. The screen is keyed on the
 * turn, so a new turn is a new component and the answers reset themselves.
 */

import { useEffect, useMemo, useState } from 'react'
import { CLEARING } from '../config/clearing'
import { MEASURE_BASE, TOTAL_TURNS, TURNS } from '../config/config'
import { isClearingCall } from '../sim/clearing'
import { useCountdown } from '../hooks/useCountdown'
import ClearingClock from '../components/turn/ClearingClock'
import { computePosition, forecastIntake, turnIsAnswerable, turnLabel } from '../sim/engine'
import { tannoyContext, tannoyLine } from '../sim/tannoy'
import type { GameState } from '../sim/types'
import { buildDeck, useTurnDeck } from '../hooks/useTurnDeck'
import TopBar from '../components/layout/TopBar'
import Tannoy from '../components/layout/Tannoy'
import Tour from '../components/layout/Tour'
import ActionBar from '../components/layout/ActionBar'
import StatusRail from '../components/rail/StatusRail'
import TurnDeck from '../components/turn/TurnDeck'
import ExecModal from '../components/turn/ExecModal'

const fmt = (n: number) => Math.round(n).toLocaleString('en-GB')

export interface TurnAnswers {
  choices: Record<string, string>
  eventChoices: Record<string, string>
  ideaChoice?: string
}

export default function TurnScreen({
  state,
  onCommit,
  showTour = false,
  onTourDone,
}: {
  state: GameState
  onCommit: (answers: TurnAnswers) => void
  /** Three steps on the first turn, so the rail is not missed. */
  showTour?: boolean
  onTourDone?: () => void
}) {
  const [choices, setChoices] = useState<Record<string, string>>({})
  const [eventChoices, setEventChoices] = useState<Record<string, string>>({})
  const [ideaChoice, setIdeaChoice] = useState<string | undefined>(undefined)
  const [execGone, setExecGone] = useState(false)

  const isClearing = state.turnPhase === 'clearing'
  const isConfirmation = state.turnPhase === 'confirmation'
  const turnInfo = TURNS.find((t) => t.turn === state.turn)!

  const notes = useMemo(
    () =>
      isClearing
        ? [
            {
              id: 'clearing-note',
              title: 'Everything except Clearing is now fixed',
              body: `Your budget stands at £${fmt(MEASURE_BASE.budget)}k and what you do in the next eight hours is the last thing that will move any of your five measures.`,
            },
          ]
        : [],
    [isClearing],
  )

  const items = useMemo(
    () => buildDeck(state, choices, eventChoices, notes),
    [state, choices, eventChoices, notes],
  )
  const deck = useTurnDeck(items)

  const announcement = useMemo(() => {
    const landed = computePosition(state.queue, state.turn)
    return tannoyLine(tannoyContext(state, landed, forecastIntake(state, state.turn)), state.seed)
  }, [state])

  // The tour goes first. A senior colleague barging in before the player has
  // been shown the board is a bad first thirty seconds, and he will keep.
  const interrupting = Boolean(state.pendingIdea) && !execGone && !showTour

  // ------------------------------------------------------------- the phones
  //
  // Clearing is the only part of the cycle that runs in real time. The clock
  // starts the moment the first call is in front of the player and does not
  // stop. Anything still ringing when it hits zero rings somebody else.
  const calls = useMemo(() => items.filter((i) => i.kind === 'decision' && isClearingCall(i.id)), [items])
  const waiting = calls.filter((c) => !c.answered).length
  const onACall = deck.current?.kind === 'decision' && isClearingCall(deck.current.id)
  const [phonesOn, setPhonesOn] = useState(false)

  useEffect(() => {
    if (onACall) setPhonesOn(true)
  }, [onACall])

  const countdown = useCountdown(CLEARING.seconds, phonesOn && !isConfirmation)

  useEffect(() => {
    if (!countdown.expired || waiting === 0) return
    setChoices((c) => {
      const next = { ...c }
      for (const call of calls) if (!next[call.id]) next[call.id] = 'pass'
      return next
    })
  }, [countdown.expired, waiting, calls])

  const ready = turnIsAnswerable(state, choices, eventChoices, ideaChoice)

  const nextLabel = isConfirmation
    ? 'Open Clearing'
    : state.turn === TOTAL_TURNS
      ? 'Close the cycle'
      : `Advance to ${turnLabel(state.turn + 1)}`

  const readyNote = isClearing
    ? 'That is the cycle. Nothing else can move now.'
    : isConfirmation
      ? 'The number is what it is. Clearing is the only thing left.'
      : 'You will not see most of this land for another three or four turns.'

  function chooseDecision(decisionId: string, optionId: string) {
    setChoices((c) => ({ ...c, [decisionId]: optionId }))
    deck.advanceSoon()
  }

  function chooseEvent(eventId: string, optionId: string) {
    setEventChoices((c) => ({ ...c, [eventId]: optionId }))
    deck.advanceSoon()
  }

  return (
    <div className="play">
      <TopBar turn={state.turn} phase={state.turnPhase} />

      <main className="play-main" inert={interrupting || undefined}>
        <StatusRail state={state} />

        <section className="work">
          <div className="work-head">
            <h1 className="month">{turnInfo.label}</h1>
            {isConfirmation && <span className="turn-count">Results day, 8am</span>}
            {isClearing && <span className="turn-count">Clearing, through the day</span>}
            <p className="strap">
              {isClearing
                ? 'Confirmation is done. What is left of the day is yours to spend.'
                : turnInfo.strap}
            </p>
          </div>

          {phonesOn ? (
            <ClearingClock countdown={countdown} waiting={waiting} />
          ) : (
            <Tannoy line={announcement} />
          )}

          <TurnDeck
            deck={deck}
            choices={choices}
            eventChoices={eventChoices}
            onChooseDecision={chooseDecision}
            onChooseEvent={chooseEvent}
          />
        </section>
      </main>

      <ActionBar
        label={nextLabel}
        ready={ready}
        blocked={interrupting}
        outstanding={deck.outstanding}
        blockedNote={`${state.pendingIdea?.who ?? 'Somebody'} is still standing there. Nothing else moves until you deal with it.`}
        readyNote={readyNote}
        onAdvance={() => onCommit({ choices, eventChoices, ideaChoice })}
      />

      {showTour && !interrupting && <Tour onDone={() => onTourDone?.()} />}

      {interrupting && state.pendingIdea && (
        <ExecModal
          idea={state.pendingIdea}
          chosen={ideaChoice}
          onChoose={setIdeaChoice}
          onLeave={() => setExecGone(true)}
        />
      )}
    </div>
  )
}
