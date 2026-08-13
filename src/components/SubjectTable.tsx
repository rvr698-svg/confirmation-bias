/**
 * Who actually turned up, by department. Debrief only, where there is room for
 * the whole story and the line each department is telling about itself.
 */

import type { SubjectRow } from '../sim/subjects'

const fmt = (n: number) => Math.round(n).toLocaleString('en-GB')

/**
 * The line about the worst-affected area is already the verdict at the top of
 * the debrief. Repeating it in every row, and then again underneath, made the
 * page read like it was stuck, so the table gives one line to the single area
 * furthest from its number and a word to everybody else.
 */
export default function SubjectTable({ rows }: { rows: SubjectRow[] }) {
  const notable = rows
    .filter((r) => r.state !== 'level')
    .sort((a, b) => Math.abs(b.delta / b.target) - Math.abs(a.delta / a.target))[0]

  const STATE_WORD: Record<SubjectRow['state'], string> = {
    over: 'Over its number',
    under: 'Under its number',
    level: 'About right',
  }

  return (
    <table className="forecast-table subject-table">
      <thead>
        <tr>
          <th>Subject area</th>
          <th>Target</th>
          <th>Actual</th>
          <th>Difference</th>
          <th>How it landed</th>
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
            <td className="subject-note">
              {notable && r.id === notable.id && r.note ? r.note : STATE_WORD[r.state]}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
