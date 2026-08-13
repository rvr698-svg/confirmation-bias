/**
 * The four people. A bar going down is free; Gemma leaving is not.
 */

import type { RosterEntry } from '../../sim/team'

const MARK: Record<RosterEntry['state'], string> = {
  fine: 'Fine',
  stretched: 'Stretched',
  looking: 'Looking',
  gone: 'Gone',
  off: 'Off sick',
}

export default function TeamStrip({ entries }: { entries: RosterEntry[] }) {
  const gone = entries.filter((e) => e.state === 'gone').length
  const off = entries.filter((e) => e.state === 'off').length
  const wobbling = entries.filter((e) => e.state === 'looking').length

  const headline =
    gone > 0
      ? `${gone} gone`
      : off > 0
        ? `${off} off sick`
        : wobbling > 0
          ? `${wobbling} looking`
          : 'all here'

  return (
    <details className="panel rail-panel foldable team-strip" open={gone > 0 || off > 0}>
      <summary>
        <span className="eyebrow">The team</span>
        <span className="team-headline">{headline}</span>
      </summary>

      <div className="team-list">
        {entries.map(({ member, state, line, backIn }) => (
          <div className={`team-row is-${state}`} key={member.id}>
            <span className="team-name">
              {member.name}
              <span className="team-role"> {member.role}</span>
            </span>
            <span className={`team-state is-${state}`}>
              {MARK[state]}
              {state === 'off' && backIn ? ` · ${backIn}` : ''}
            </span>
            <span className="team-line">{line}</span>
          </div>
        ))}
      </div>
    </details>
  )
}
