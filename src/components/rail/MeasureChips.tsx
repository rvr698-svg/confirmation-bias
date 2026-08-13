/**
 * The four measures that are not intake, at a glance. Colour is the message;
 * the numbers are there for anyone who wants them.
 */

import { ordinal, type LeagueStanding } from '../../sim/league'
import type { Measures } from '../../sim/types'

const fmt = (n: number) => Math.round(n).toLocaleString('en-GB')

function teamWord(team: number): string {
  if (team >= 68) return 'In good order'
  if (team >= 52) return 'Coping'
  if (team >= 34) return 'Stretched'
  return 'Running on empty'
}

export default function MeasureChips({
  measures,
  league,
}: {
  measures: Measures
  league: LeagueStanding
}) {
  const budgetLeft = measures.budget - measures.spend

  return (
    <div className="chips">
      <div className={`chip ${league.movement > 1 ? 'up' : league.movement < -1 ? 'down' : 'mid'}`}>
        <span className="chip-label">League table</span>
        <span className="chip-value">
          {ordinal(league.position)}
          <span className="chip-move">
            {league.movement > 0
              ? ` ▲${league.movement}`
              : league.movement < 0
                ? ` ▼${Math.abs(league.movement)}`
                : ' –'}
          </span>
        </span>
      </div>

      <div className={`chip ${measures.access >= 0.38 ? 'up' : measures.access < 0.33 ? 'down' : 'mid'}`}>
        <span className="chip-label">Access intake</span>
        <span className="chip-value">{(measures.access * 100).toFixed(1)}%</span>
      </div>

      <div className={`chip ${budgetLeft < 0 ? 'down' : budgetLeft > 400 ? 'up' : 'mid'}`}>
        <span className="chip-label">Budget left</span>
        <span className="chip-value">
          {budgetLeft < 0 ? `-£${fmt(-budgetLeft)}k` : `£${fmt(budgetLeft)}k`}
        </span>
      </div>

      <div className={`chip ${measures.team >= 68 ? 'up' : measures.team < 40 ? 'down' : 'mid'}`}>
        <span className="chip-label">Team</span>
        <span className="chip-value">{teamWord(measures.team)}</span>
      </div>
    </div>
  )
}
