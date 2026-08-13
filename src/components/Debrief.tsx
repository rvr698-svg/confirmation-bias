/**
 * The debrief. The most important screen in the game.
 *
 * Everything here is derived. The three named decisions come from rerunning
 * the cycle without them, so the cause and effect is real rather than a
 * plausible sentence attached to a choice.
 */

import { buildDebrief } from '../sim/debrief'
import { breachSummary } from '../sim/scoring'
import { STARS_MAX } from '../config/config'
import type { GameState } from '../sim/types'
import { subjectMix } from '../sim/subjects'
import SubjectTable from './SubjectTable'
import ScoreRow from './ScoreRow'
import Signpost from './Signpost'
import ShareCard, { shareForClipboard } from './ShareCard'
import Disclaimer from './layout/Disclaimer'
import MascotBar, { moodAtEnd } from './MascotBar'

const fmt = (n: number) => Math.round(n).toLocaleString('en-GB')

export default function Debrief({
  state,
  onRestart,
}: {
  state: GameState
  onRestart: () => void
}) {
  const { position, card, headlines } = buildDebrief(state)
  const breaches = breachSummary(position)
  const diff = position.pipeline.enrolled - position.measures.target

  return (
    <div className="shell">
      <div style={{ paddingTop: 40 }}>
        <span className="eyebrow">The cycle is over</span>
        <h1 className="title" style={{ marginTop: 10 }}>
          Debrief
        </h1>
        <hr className="rule" />
      </div>

      <MascotBar mood={moodAtEnd(card.overall)} seed={state.seed} turn={99} />

      <div className="result-hero">
        <div>
          <span className="eyebrow">Enrolled</span>
          <div className="result-number">{fmt(position.pipeline.enrolled)}</div>
          <div className="muted" style={{ fontSize: 14, marginTop: 4 }}>
            {diff === 0
              ? 'exactly on target'
              : diff > 0
                ? `${fmt(diff)} over a target of ${fmt(position.measures.target)}`
                : `${fmt(-diff)} under a target of ${fmt(position.measures.target)}`}
          </div>
          <div className="muted" style={{ fontSize: 13, marginTop: 8 }}>
            {fmt(position.retained)} still enrolled at census.
          </div>
        </div>
        <div className="verdict">{card.verdict}</div>
      </div>

      <div className="scores">
        <div className="scores-head">
          <span className="eyebrow">The five measures</span>
          <span className="scores-overall">
            <strong>{card.overallOf5}</strong>
            <span className="score-max">/{STARS_MAX}</span> overall
          </span>
        </div>
        {card.measures.map((m) => (
          <ScoreRow measure={m} key={m.id} />
        ))}
      </div>

      <div className="appraisal">
        <span className="eyebrow">For your appraisal</span>
        <p className="appraisal-line">{card.appraisal[0]}</p>
        <p className="appraisal-line development">{card.appraisal[1]}</p>
        <p className="appraisal-foot">
          Both of those are true. That is what makes them usable.
        </p>
      </div>

      <div className="section">
        <div className="section-head">
          <h2 className="h2">Who actually turned up</h2>
        </div>
        <SubjectTable rows={subjectMix(position)} />
      </div>

      {breaches.length > 0 && (
        <div className="section">
          <div className="section-head">
            <h2 className="h2">What broke</h2>
          </div>
          <div className="warn-strip bad">
            {breaches.map((b) => (
              <div key={b} style={{ marginBottom: 6 }}>
                {b}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="section">
        <div className="section-head">
          <h2 className="h2">Share it</h2>
        </div>
        <ShareCard card={card} position={position} />
      </div>

      <Signpost
        overallOf5={card.overallOf5}
        onRestart={onRestart}
        onShare={async () => {
          try {
            await navigator.clipboard.writeText(shareForClipboard(card, position))
            return true
          } catch {
            return false
          }
        }}
      />

      <details className="section traces">
        <summary className="traces-summary">Want to know which decisions decided it?</summary>
        <p className="lede" style={{ marginBottom: 18 }}>
          Chosen by rerunning the whole cycle without each one. These are the three that changed the
          most.
        </p>

        {headlines.map((h, i) => (
          <div className="trace" key={h.key}>
            <div className="trace-head">
              <span className="trace-when">
                {i + 1} &nbsp;/&nbsp; {h.sourceLabel}
              </span>
            </div>
            <div className="trace-choice">You chose: {h.choiceLabel}</div>
            <ul className="trace-steps" style={{ marginTop: 14 }}>
              {h.narrative.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <div className="trace-cf">{h.counterfactual}</div>
          </div>
        ))}
      </details>

      <Disclaimer compact />
    </div>
  )
}
