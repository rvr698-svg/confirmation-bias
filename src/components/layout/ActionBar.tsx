/**
 * The bottom bar. Always on screen, which is the point: the way out of a turn
 * is never something you have to go looking for.
 */

export default function ActionBar({
  label,
  ready,
  blocked,
  outstanding,
  blockedNote,
  readyNote,
  onAdvance,
}: {
  label: string
  ready: boolean
  blocked: boolean
  outstanding: number
  blockedNote: string
  readyNote: string
  onAdvance: () => void
}) {
  const note = blocked
    ? blockedNote
    : ready
      ? readyNote
      : `${outstanding} card${outstanding === 1 ? '' : 's'} still waiting on you.`

  return (
    <footer className="actionbar">
      <span className={`action-note ${blocked ? 'blocked-note' : ''}`}>{note}</span>
      <button
        type="button"
        className={`btn ${ready && !blocked ? 'ready' : ''}`}
        disabled={!ready || blocked}
        onClick={onAdvance}
      >
        {label}
      </button>
    </footer>
  )
}
