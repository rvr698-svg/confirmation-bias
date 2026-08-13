/**
 * The debrief. The most important screen in the game.
 *
 * Everything here is derived. The three named decisions come from rerunning
 * the cycle without them, so the cause and effect is real rather than a
 * plausible sentence attached to a choice.
 */

import { buildDebrief } from '../sim/debrief'
import { breachSummary } from '../sim/scoring'
import { turnLabel } from '../sim/engine'
import { TOTAL_TURNS } from '../config/config'
import type { BandKey, GameState } from '../sim/types'
import { subjectMix } from '../sim/subjects'
import SubjectTable from './SubjectTable'
import ShareCard from './ShareCard'
import Disclaimer from './layout/Disclaimer'
import MascotBar, { moodAtEnd } from './MascotBar'

const fmt = (n: number) => Math.round(n).toLocaleString('en-GB')

const BAND_CLASS: Record<BandKey, string> = {
  strong: 'band-strong',
  holding: 'band-holding',
  pressure: 'band-pressure',
  exposed: 'band-exposed',
}

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

  // One row per turn. The comparison is against what was true at the time,
  // not against the final number, because decisions taken later genuinely
  // changed the outcome and that is not forecast error.
  const forecastRows = state.history
    .filter((h, i) => state.history.findIndex((x) => x.turn === h.turn) === i)
    .map((h) => ({
      turn: h.turn,
      label: turnLabel(h.turn),
      shown: h.shownForecast,
      truth: h.trueProjection,
      error: h.shownForecast / h.trueProjection - 1,
    }))

  const meanError =
    forecastRows.reduce((s, r) => s + r.error, 0) / Math.max(1, forecastRows.length)
  const optimistic = forecastRows.filter((r) => r.error > 0).length
  const biasLine =
    meanError > 0.015
      ? 'Your projection ran hot all cycle. Every month it told you that you were doing better than you were.'
      : meanError < -0.015
        ? 'Your projection ran cold all cycle. Every month it told you that you were further behind than you were.'
        : optimistic > forecastRows.length * 0.7 || optimistic < forecastRows.length * 0.3
          ? 'Your projection leaned the same way most months, which is the kind of error that is hardest to spot from the inside.'
          : 'Your projection was unbiased and still wrong every month, which is the normal state of affairs.'

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

      <div className="bands">
        {card.measures.map((m) => (
          <div className="band-row" key={m.id}>
            <span className="band-name">{m.name}</span>
            <span className={`band-tag ${BAND_CLASS[m.band.key]}`}>{m.band.label}</span>
            <span className="band-detail">{m.detail}</span>
          </div>
        ))}
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
          <h2 className="h2">Three decisions that decided it</h2>
        </div>
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
      </div>

      <div className="section">
        <div className="section-head">
          <h2 className="h2">What your forecast told you</h2>
        </div>
        <p className="lede" style={{ marginBottom: 18 }}>
          You finished on {fmt(position.pipeline.enrolled)}. This is what the projection showed you
          each turn, against what you were actually on course for at that moment.
        </p>
        <table className="forecast-table">
          <thead>
            <tr>
              <th>Turn</th>
              <th>What you were shown</th>
              <th>What was true</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>
            {forecastRows.map((r) => {
              const err = r.shown - r.truth
              const pctErr = r.error * 100
              return (
                <tr key={r.turn}>
                  <td>{r.label}</td>
                  <td>{fmt(r.shown)}</td>
                  <td>{fmt(r.truth)}</td>
                  <td className={Math.abs(pctErr) < 1 ? '' : pctErr > 0 ? 'err-pos' : 'err-neg'}>
                    {Math.abs(pctErr) < 0.05
                      ? 'exact'
                      : `${err > 0 ? '+' : ''}${fmt(err)}  (${pctErr > 0 ? '+' : ''}${pctErr.toFixed(1)}%)`}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="muted" style={{ fontSize: 13.5, marginTop: 14 }}>
          {biasLine} It only stopped being wrong on results day, by which point the only lever left
          was Clearing.
        </p>
      </div>

      <div className="section">
        <div className="section-head">
          <h2 className="h2">Share it</h2>
        </div>
        <ShareCard card={card} position={position} />
      </div>

      <div className="actions">
        <button type="button" className="btn" onClick={onRestart}>
          Run another cycle
        </button>
        <span className="action-note">
          A new cycle draws different events. {TOTAL_TURNS} turns, eight to twelve minutes.
        </span>
      </div>

      <Disclaimer compact />
    </div>
  )
}
