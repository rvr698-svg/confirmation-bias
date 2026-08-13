/**
 * The colleague with the idea, drawn from their cast entry.
 *
 * One figure, parameterised. Skin, hair, glasses and jacket come from
 * `config/cast.ts` so no appearance is hard-coded and no two colleagues are
 * the same person. The lightbulb, the raised eyebrows and the grin are the
 * only things everyone shares, because the joke is the idea, not the person.
 */

import { HAIR, JACKET, SKIN, type Look } from '../../config/looks'
import { PALETTE } from '../../config/palette'

const INK = PALETTE.ink

/** Hair that sits behind the head: anything with length to it. */
function HairBehind({ look }: { look: Look }) {
  const fill = HAIR[look.hairColour]
  const stroke = { stroke: INK, strokeWidth: 2.4 }

  if (look.hair === 'bob') {
    return <rect x="29" y="43" width="52" height="50" rx="24" fill={fill} {...stroke} />
  }
  if (look.hair === 'long') {
    return <rect x="28" y="43" width="54" height="64" rx="25" fill={fill} {...stroke} />
  }
  if (look.hair === 'locs') {
    return (
      <g fill={fill} {...stroke}>
        <rect x="30" y="43" width="50" height="46" rx="23" />
        {[32, 41, 69, 78].map((x) => (
          <rect key={x} x={x} y="70" width="6" height="30" rx="3" />
        ))}
      </g>
    )
  }
  if (look.hair === 'coils') {
    return (
      <g fill={fill} {...stroke}>
        <circle cx="55" cy="48" r="21" />
        <circle cx="36" cy="56" r="11" />
        <circle cx="74" cy="56" r="11" />
      </g>
    )
  }
  if (look.hair === 'bun') {
    return <circle cx="55" cy="37" r="10" fill={fill} {...stroke} />
  }
  return null
}

/** Hair that sits over the head: the hairline. */
function HairFront({ look }: { look: Look }) {
  const fill = HAIR[look.hairColour]
  const stroke = { stroke: INK, strokeWidth: 2.4 }

  switch (look.hair) {
    case 'shaved':
      return null
    case 'receding':
      return (
        <path
          d="M 32 62 q 3 -20 23 -20 q 20 0 23 20 q -5 -9 -23 -9 q -18 0 -23 9 z"
          fill={fill}
          {...stroke}
        />
      )
    case 'cropped':
      return (
        <path
          d="M 32 64 q 4 -22 23 -22 q 19 0 23 22 q -7 -11 -23 -11 q -16 0 -23 11 z"
          fill={fill}
          {...stroke}
        />
      )
    case 'coils':
      return (
        <path
          d="M 32 60 q 3 -20 23 -20 q 20 0 23 20 q -6 -10 -23 -10 q -17 0 -23 10 z"
          fill={fill}
          {...stroke}
        />
      )
    default:
      return (
        <path
          d="M 31 66 q 0 -26 24 -26 q 24 0 24 26 q -6 -13 -24 -13 q -18 0 -24 13 z"
          fill={fill}
          {...stroke}
        />
      )
  }
}

export default function ExecFigure({
  look,
  excited,
  size = 118,
  bulbOut = false,
  onBulbClick,
}: {
  look: Look
  excited: boolean
  size?: number
  /** Somebody switched the idea off. It made no difference. */
  bulbOut?: boolean
  onBulbClick?: () => void
}) {
  const skin = SKIN[look.skin]
  const jacket = JACKET[look.jacket]

  return (
    <svg
      viewBox="0 0 110 130"
      width={size}
      height={size * 1.18}
      className={excited ? 'exec-idle' : ''}
      aria-hidden="true"
    >
      {/* the idea itself */}
      <g
        className={bulbOut ? 'bulb out' : 'bulb'}
        onClick={onBulbClick}
        style={onBulbClick ? { cursor: 'pointer' } : undefined}
      >
        <path
          d="M 55 6 a 13 13 0 0 1 8 23 v 4 h -16 v -4 a 13 13 0 0 1 8 -23 z"
          fill={bulbOut ? PALETTE.off : PALETTE.gold}
          stroke={INK}
          strokeWidth="2.6"
        />
        <line x1="47" y1="36" x2="63" y2="36" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
        <g stroke={bulbOut ? PALETTE.off : PALETTE.gold} strokeWidth="2.6" strokeLinecap="round">
          <line x1="33" y1="12" x2="27" y2="8" />
          <line x1="77" y1="12" x2="83" y2="8" />
          <line x1="30" y1="26" x2="23" y2="26" />
          <line x1="80" y1="26" x2="87" y2="26" />
        </g>
      </g>

      <HairBehind look={look} />

      {/* shoulders and jacket */}
      <path d="M 18 130 q 0 -28 37 -28 q 37 0 37 28 z" fill={jacket} stroke={INK} strokeWidth="3" />
      {/* collar */}
      <path d="M 46 104 L 55 118 L 64 104 z" fill="#fff" stroke={INK} strokeWidth="2.2" />
      {look.collar === 'tie' && (
        <path d="M 55 108 l 4 6 l -4 12 l -4 -12 z" fill={PALETTE.bad} stroke={INK} strokeWidth="2" />
      )}
      {/* neck */}
      <rect x="49" y="88" width="12" height="14" fill={skin} stroke={INK} strokeWidth="2.6" />
      {/* head */}
      <circle cx="55" cy="68" r="24" fill={skin} stroke={INK} strokeWidth="3" />

      <HairFront look={look} />

      {look.glasses && (
        <>
          <g fill="none" stroke={INK} strokeWidth="2.4">
            <circle cx="46" cy="66" r="7.5" fill="#fff" fillOpacity="0.55" />
            <circle cx="64" cy="66" r="7.5" fill="#fff" fillOpacity="0.55" />
            <line x1="53.5" y1="66" x2="56.5" y2="66" />
          </g>
        </>
      )}
      <circle cx="46" cy="66" r="2.6" fill={INK} />
      <circle cx="64" cy="66" r="2.6" fill={INK} />

      {/* eyebrows, raised, because they are delighted */}
      <g stroke={INK} strokeWidth="2.6" strokeLinecap="round">
        <line x1="39" y1="54" x2="52" y2="52" />
        <line x1="58" y1="52" x2="71" y2="54" />
      </g>
      {/* big grin */}
      <path d="M 44 78 q 11 11 22 0 z" fill="#fff" stroke={INK} strokeWidth="2.4" />
    </svg>
  )
}
