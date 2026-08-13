/**
 * In the post.
 *
 * The decisions you have already taken that have not bitten yet. It tells you
 * what you chose and when it arrives, and nothing at all about what it will do.
 */

import { whenItLands, type PendingItem } from '../../sim/pending'

export default function PendingTray({ items }: { items: PendingItem[] }) {
  if (items.length === 0) return null

  const next = items[0]

  return (
    <details className="panel rail-panel foldable pending-tray">
      <summary>
        <span className="eyebrow">In the post</span>
        <span className="pending-count">{items.length}</span>
      </summary>

      <p className="pending-lede">
        Already decided, not yet landed. You will not find out what they did until they do it.
      </p>

      <div className="pending-list">
        {items.map((item) => (
          <div className={`pending-item ${item === next ? 'next' : ''}`} key={item.key}>
            <span className="pending-source">{item.sourceLabel}</span>
            <span className="pending-choice">{item.choiceLabel}</span>
            <span className="pending-when">{whenItLands(item.turnsAway)}</span>
          </div>
        ))}
      </div>
    </details>
  )
}
