/**
 * Five departments, each convinced they are the important one.
 *
 * Derived from the intake, so this is a readout rather than a lever. Folded
 * away by default because the rail has to fit on one screen.
 */

import type { SubjectRow } from '../../sim/subjects'

const fmt = (n: number) => Math.round(n).toLocaleString('en-GB')

export default function SubjectStrip({ rows }: { rows: SubjectRow[] }) {
  const notable = rows.filter((r) => r.state !== 'level').length

  return (
    <details className="panel wash rail-panel subjects">
      <summary>
        <span className="eyebrow">Subject mix</span>
        <span className="subject-count">
          {notable === 0 ? 'all near number' : `${notable} off number`}
        </span>
      </summary>

      <div className="stage-list">
        {rows.map((r) => (
          <div className="stage" key={r.id}>
            <span className="stage-name">{r.short}</span>
            <span className={`stage-value subject-${r.state}`}>
              {fmt(r.actual)}
              <span className="subject-delta">
                {r.delta >= 0 ? `+${fmt(r.delta)}` : fmt(r.delta)}
              </span>
            </span>
          </div>
        ))}
      </div>
    </details>
  )
}
