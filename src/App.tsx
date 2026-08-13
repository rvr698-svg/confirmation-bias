/**
 * CONFIRMATION BIAS
 *
 * Routing between the three screens and nothing else. All state is held here
 * for the session. Nothing is written to storage, nothing leaves the browser,
 * and no personal data is collected at any point.
 */

import { useState } from 'react'
import { beginTurn, commitTurn, createInitialState, startGame } from './sim/engine'
import type { GameState } from './sim/types'
import IntroScreen from './screens/IntroScreen'
import TurnScreen, { type TurnAnswers } from './screens/TurnScreen'
import Debrief from './components/Debrief'

const newSeed = () => Math.floor(Math.random() * 2 ** 31)

export default function App() {
  const [state, setState] = useState<GameState>(() => createInitialState(newSeed()))

  function commit({ choices, eventChoices, ideaChoice }: TurnAnswers) {
    const committed = commitTurn(state, choices, eventChoices, ideaChoice)
    setState(committed.phase === 'playing' ? beginTurn(committed) : committed)
  }

  if (state.phase === 'intro') {
    return <IntroScreen onStart={() => setState(startGame(state.seed))} />
  }

  if (state.phase === 'debrief') {
    return <Debrief state={state} onRestart={() => setState(createInitialState(newSeed()))} />
  }

  // Keyed on the turn so each turn gets a fresh screen, and this turn's answers
  // are cleared by unmounting rather than by remembering to clear them.
  return <TurnScreen key={`${state.turn}-${state.turnPhase}`} state={state} onCommit={commit} />
}
