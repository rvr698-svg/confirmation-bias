/**
 * The left rail: everything that is true right now.
 *
 * On a desktop it never changes what it shows and it never moves, so the player
 * can read the state of the cycle without leaving the card they are answering.
 * Marge sits at the top of it because her face is the fastest read on screen.
 *
 * On a phone there is no left, and laying the rail down as a strip was worse
 * than useless: better than a metre of panels dragged past a 350px window, with
 * Marge taking the first screenful and the projected intake -- the number the
 * whole game is about -- parked somewhere off the right-hand edge, behind a
 * sideways scroll nothing advertised. So at phone widths the rail becomes one
 * line that always shows the number and the target, and everything else waits
 * behind a tap. Same panels, same order, no horizontal scrolling anywhere.
 */

import { computePosition, forecastIntake } from '../../sim/engine'
import { standing } from '../../sim/league'
import { subjectMix } from '../../sim/subjects'
import { roster } from '../../sim/team'
import TeamStrip from './TeamStrip'
import { useTallViewport } from '../../hooks/useTallViewport'
import { useIsPhone } from '../../hooks/useIsPhone'
import type { GameState } from '../../sim/types'
import MascotBar, { moodInPlay } from '../MascotBar'
import ProjectionPanel, { projectionTone } from './ProjectionPanel'
import PipelinePanel from './PipelinePanel'
import MeasureChips from './MeasureChips'
import SubjectStrip from './SubjectStrip'

const fmt = (n: number) => Math.round(n).toLocaleString('en-GB')

export default function StatusRail({ state }: { state: GameState }) {
  const roomy = useTallViewport()
  const phone = useIsPhone()
  const landed = computePosition(state.queue, state.turn)
  const projected = forecastIntake(state, state.turn)
  const isClearing = state.turnPhase === 'clearing'
  const pending = state.queue.filter((m) => m.landsTurn > state.turn).length

  const panels = (
    <>
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

      <PipelinePanel pipeline={landed.pipeline} turn={state.turn} open={roomy || phone} />

      <TeamStrip entries={roster(landed.measures.team, state.queue, state.turn)} />

      <SubjectStrip rows={subjectMix(landed)} />
    </>
  )

  if (!phone) return <aside className="rail">{panels}</aside>

  // The headline stays on screen; the rest is a sheet that opens over the board
  // rather than pushing it, because the board is not allowed to grow.
  return (
    <aside className="rail is-phone">
      <details className="rail-fold">
        <summary className="rail-summary">
          <span className="rail-sum-label">
            {isClearing ? 'Confirmed' : 'Projected'}
          </span>
          <strong className={`rail-sum-value ${projectionTone(projected, landed.measures.target)}`}>
            {fmt(projected)}
          </strong>
          <span className="rail-sum-target">of {fmt(landed.measures.target)}</span>
          <span className="rail-sum-more">Details</span>
        </summary>
        <div className="rail-sheet">{panels}</div>
      </details>
    </aside>
  )
}
