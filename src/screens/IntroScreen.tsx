/**
 * The one screen that is a document rather than a board, so it may scroll.
 *
 * It has one job: put somebody in the chair before they press the button. It
 * opens on the moment the job actually starts — a number on a slide, handed to
 * you, with nobody asking whether it is possible — rather than on a paragraph
 * explaining what a recruitment cycle is.
 */

import { BASELINE, TOTAL_TURNS } from '../config/config'
import Mascot from '../components/Mascot'
import Disclaimer from '../components/layout/Disclaimer'

const fmt = (n: number) => Math.round(n).toLocaleString('en-GB')

const MEASURES: { name: string; line: string }[] = [
  { name: 'Intake against target', line: 'Too few is a crisis. Too many is a more expensive crisis.' },
  { name: 'League table position', line: 'Everybody reads it. Nobody agrees with it.' },
  { name: 'Access and participation', line: 'You signed up to this in a document with your name on it.' },
  { name: 'Budget position', line: 'Finance have a long memory and a longer spreadsheet.' },
  { name: 'Team capacity', line: 'Four people. They are not a number, though they are scored like one.' },
]

export default function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="shell">
      <div className="intro">
        <div className="intro-head">
          <Mascot mood="keen" size={116} />
          <div>
            <span className="eyebrow">
              A management game about a job where nothing you do shows up for three months
            </span>
            <h1 className="title">Confirmation Bias</h1>
          </div>
        </div>
        <hr className="rule" />

        <div className="scene">
          <p className="scene-line">
            It is the first week of September. The slide says <strong>{fmt(BASELINE.target)}</strong>.
          </p>
          <p className="scene-line">
            Nobody in the room asked whether {fmt(BASELINE.target)} was possible, because the person
            who put it on the slide has moved to another institution and the person who has to
            deliver it is you.
          </p>
          <p className="scene-line last">
            You are Head of Recruitment and Admissions at a mid-tariff UK university or college. You
            have {TOTAL_TURNS} months.
          </p>
        </div>

        <div className="intro-rules">
          <div className="intro-rule">
            <span className="intro-rule-num">1</span>
            <div>
              <strong>Everything lands late.</strong> A decision you take in October bites in
              February, or in August. By the time you can see whether it worked, you have made nine
              more.
            </div>
          </div>
          <div className="intro-rule">
            <span className="intro-rule-num">2</span>
            <div>
              <strong>The forecast lies, politely.</strong> You get a projection every month. It
              leans the same way all year, it never tells you which way, and it only stops lying on
              results day.
            </div>
          </div>
          <div className="intro-rule">
            <span className="intro-rule-num">3</span>
            <div>
              <strong>Five measures. You cannot win all five.</strong> That is not a flaw in the
              scoring. It is the job.
            </div>
          </div>
        </div>

        <div className="measure-cards">
          {MEASURES.map((m) => (
            <div className="measure-card" key={m.name}>
              <span className="measure-name">{m.name}</span>
              <span className="measure-line">{m.line}</span>
            </div>
          ))}
        </div>

        <div className="actions">
          <button type="button" className="btn" onClick={onStart}>
            Take the meeting
          </button>
          <span className="action-note">
            Ten turns, eight to twelve minutes. Nothing is saved, so nobody will ever know.
          </span>
        </div>

        <Disclaimer />
      </div>
    </div>
  )
}
