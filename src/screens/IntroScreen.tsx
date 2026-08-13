/**
 * The only screen that is a page rather than a fixed board. It is read once,
 * so it is allowed to scroll on a short window.
 */

import { BASELINE } from '../config/config'
import Mascot from '../components/Mascot'
import Disclaimer from '../components/layout/Disclaimer'

const fmt = (n: number) => Math.round(n).toLocaleString('en-GB')

const MEASURES = [
  'Intake against target',
  'Entry profile',
  'Access and participation',
  'Budget position',
  'Team capacity and wellbeing',
]

export default function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="shell">
      <div className="intro">
        <div className="intro-head">
          <Mascot mood="keen" size={116} />
          <div>
            <span className="eyebrow">
              A game about the thing nobody outside admissions understands
            </span>
            <h1 className="title">Cycle</h1>
          </div>
        </div>
        <hr className="rule" />

        <Disclaimer />

        <p className="lede">
          You are Head of Admissions at a mid-tariff UK university or college. You have ten turns,
          from September to Clearing, and a target of {fmt(BASELINE.target)}.
        </p>
        <p className="lede" style={{ marginTop: 14 }}>
          Every decision you make lands three to five turns later. You will get a forecast each turn
          and it will be wrong in ways you cannot see. Recruiting too many is as bad as recruiting
          too few, and considerably more expensive.
        </p>

        <div className="intro-list">
          {MEASURES.map((m, i) => (
            <div className="intro-item" key={m}>
              <span className="intro-num">{i + 1}</span>
              <span>{m}</span>
            </div>
          ))}
        </div>

        <p className="lede">
          You are scored on those five. You cannot win all five. That is not a flaw in the scoring.
        </p>

        <div className="actions">
          <button type="button" className="btn" onClick={onStart}>
            Open the cycle
          </button>
          <span className="action-note">Ten turns, eight to twelve minutes. Nothing is saved.</span>
        </div>
      </div>
    </div>
  )
}
