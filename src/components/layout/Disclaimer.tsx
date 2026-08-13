/**
 * The disclaimer. Shown on the intro, and again at the end, because the game
 * is going out to people who work in the sector it is cheerfully libelling.
 *
 * `compact` is the one-line version for the board and the debrief.
 */

export const DISCLAIMER_LONG =
  'This is for fun. It is in no way a commentary on the UK higher and further education sector, in the same way that nobody would run a hospital the way you play Theme Hospital. Every number in it is invented.'

export const DISCLAIMER_SHORT = 'For fun. Not a commentary on the sector. Every number is invented.'

export default function Disclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return <p className="disclaimer compact">{DISCLAIMER_SHORT}</p>
  }

  return (
    <p className="disclaimer">
      <strong>A note before you start.</strong> {DISCLAIMER_LONG}
    </p>
  )
}
