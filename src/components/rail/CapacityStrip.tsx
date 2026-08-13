/**
 * Capacity pressure. The wording is decided in sim/capacity.ts; this only
 * decides how loud it looks.
 *
 * The headline is always visible because a breach is not something to find by
 * scrolling. The detail folds away, so a bad cycle cannot push the rest of the
 * rail off the screen.
 */

import type { CapacityReading } from '../../sim/capacity'

export default function CapacityStrip({ reading }: { reading: CapacityReading }) {
  if (reading.warnings.length === 0) return null

  return (
    <details className={`warn-strip ${reading.severe ? 'bad' : ''}`} open={reading.warnings.length === 1}>
      <summary>
        <strong>{reading.headline}</strong>
        {reading.warnings.length > 1 && (
          <span className="warn-count">{reading.warnings.length} ceilings</span>
        )}
      </summary>
      {reading.warnings.map((w) => (
        <div className="warn-line" key={w}>
          {w}
        </div>
      ))}
    </details>
  )
}
