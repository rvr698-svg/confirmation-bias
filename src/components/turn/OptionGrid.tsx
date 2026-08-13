/**
 * The one way this game asks a question. Decisions, event responses and bright
 * ideas all render through here so a choice looks identical wherever it is made.
 */

export interface GridOption {
  id: string
  label: string
  /** Optional second line. Event responses generally do not carry one. */
  blurb?: string
}

export default function OptionGrid({
  options,
  chosen,
  onChoose,
  autoFocus = false,
}: {
  options: GridOption[]
  chosen: string | undefined
  onChoose: (optionId: string) => void
  autoFocus?: boolean
}) {
  const cols = options.length === 2 ? 'two' : options.length === 3 ? 'three' : 'one'

  return (
    <div className={`options ${cols}`}>
      {options.map((o, i) => (
        <button
          key={o.id}
          type="button"
          className={`option ${chosen === o.id ? 'on' : ''}`}
          aria-pressed={chosen === o.id}
          autoFocus={autoFocus && i === 0}
          onClick={() => onChoose(o.id)}
        >
          <span className="option-label">{o.label}</span>
          {o.blurb && <span className="option-blurb">{o.blurb}</span>}
        </button>
      ))}
    </div>
  )
}
