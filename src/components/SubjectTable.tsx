/**
 * Who actually turned up, by department. Debrief only, where there is room for
 * the whole story and the line each department is telling about itself.
 */

import type { SubjectRow } from '../sim/subjects'

const fmt = (n: number) => Math.round(n).toLocaleString('en-GB')

export default function SubjectTable({ rows }: { rows: SubjectRow[] }) {
  return (
    <table className="forecast-table subject-table">
      <thead>
        <tr>
          <th>Subject area</th>
          <th>Target</th>
          <th>Actual</th>
          <th>Difference</th>
          <th>What they are saying about it</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <td className="subject-name">{r.name}</td>
            <td>{fmt(r.target)}</td>
            <td>{fmt(r.actual)}</td>
            <td className={r.state === 'over' ? 'err-pos' : r.state === 'under' ? 'err-neg' : ''}>
              {r.delta >= 0 ? `+${fmt(r.delta)}` : fmt(r.delta)}
            </td>
            <td className="subject-note">{r.note ?? 'Nothing. Which is the goal.'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
