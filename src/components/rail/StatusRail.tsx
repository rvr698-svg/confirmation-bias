/**
 * The left rail: everything that is true right now.
 *
 * It never changes what it shows and it never moves, so the player can read the
 * state of the cycle without leaving the card they are answering. Marge sits at
 * the top of it because her face is the fastest read on the screen.
 */

import { computePosition, forecastIntake } from '../../sim/engine'
import { standing } from '../../sim/league'
import { subjectMix } from '../../sim/subjects'
import { roster } from '../../sim/team'
import TeamStrip from './TeamStrip'
import { useTallViewport } from '../../hooks/useTallViewport'
import type { GameState } from '../../sim/types'
import MascotBar, { moodInPlay } from '../MascotBar'
import ProjectionPanel from './ProjectionPanel'
import PipelinePanel from './PipelinePanel'
import MeasureChips from './MeasureChips'
import SubjectStrip from './SubjectStrip'

export default function StatusRail({ state }: { state: GameState }) {
  const roomy = useTallViewport()
  const landed = computePosition(state.queue, state.turn)
  const projected = forecastIntake(state, state.turn)
  const isClearing = state.turnPhase === 'clearing'
  const pending = state.queue.filter((m) => m.landsTurn > state.turn).length

  return (
    <aside className="rail">
      <MascotBar
        compact
        mood={isClearing ? 'panic' : moodInPlay(state.turn, landed, projected)}
        seed={state.seed}
        turn={state.turn}
        line={isClearing ? 'Phones are going. Do not let anyone put the kettle on yet.' : undefined}
      />

      <ProjectionPanel
        turn={state.turn}
        projected={projected}
        target={landed.measures.target}
        pending={pending}
      />

      <MeasureChips measures={landed.measures} league={standing(landed)} />

      <PipelinePanel pipeline={landed.pipeline} turn={state.turn} open={roomy} />

      <TeamStrip entries={roster(landed.measures.team, state.queue, state.turn)} />

      <SubjectStrip rows={subjectMix(landed)} />

    </aside>
  )
}
