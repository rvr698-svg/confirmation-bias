/**
 * Marge. Drawn in one SVG, expression driven entirely by mood.
 *
 * She is the fastest read of the game state on the screen. Before a player has
 * parsed the projection, they have already noticed that she has grown a third
 * cup of coffee and her hair has gone.
 */

import { PALETTE } from '../config/palette'
import type { Mood } from '../config/mascot'

const SKIN = '#f6c9a8'
const HAIR = '#5b4636'
const TOP = PALETTE.brand
const INK = PALETTE.ink

interface Face {
  eyes: 'open' | 'wide' | 'happy' | 'squint' | 'dead'
  brow: number
  mouth: 'smile' | 'flat' | 'wave' | 'open' | 'grimace'
  sweat: number
  cups: number
  frizz: boolean
}

const FACES: Record<Mood, Face> = {
  keen: { eyes: 'happy', brow: -2, mouth: 'smile', sweat: 0, cups: 1, frizz: false },
  calm: { eyes: 'open', brow: 0, mouth: 'smile', sweat: 0, cups: 1, frizz: false },
  busy: { eyes: 'open', brow: 3, mouth: 'flat', sweat: 1, cups: 2, frizz: false },
  worried: { eyes: 'wide', brow: 5, mouth: 'wave', sweat: 1, cups: 2, frizz: false },
  frazzled: { eyes: 'squint', brow: 7, mouth: 'wave', sweat: 2, cups: 3, frizz: true },
  panic: { eyes: 'wide', brow: 9, mouth: 'open', sweat: 3, cups: 4, frizz: true },
  proud: { eyes: 'happy', brow: -3, mouth: 'smile', sweat: 0, cups: 1, frizz: false },
  spent: { eyes: 'squint', brow: 4, mouth: 'flat', sweat: 0, cups: 3, frizz: true },
  wrecked: { eyes: 'dead', brow: 6, mouth: 'grimace', sweat: 1, cups: 5, frizz: true },
}

function Eye({ x, kind }: { x: number; kind: Face['eyes'] }) {
  const y = 52
  if (kind === 'happy') {
    return (
      <path
        d={`M ${x - 6} ${y + 1} q 6 -7 12 0`}
        stroke={INK}
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
    )
  }
  if (kind === 'dead') {
    return (
      <g stroke={INK} strokeWidth="2.6" strokeLinecap="round">
        <line x1={x - 5} y1={y - 5} x2={x + 5} y2={y + 5} />
        <line x1={x + 5} y1={y - 5} x2={x - 5} y2={y + 5} />
      </g>
    )
  }
  if (kind === 'squint') {
    return (
      <line
        x1={x - 6}
        y1={y}
        x2={x + 6}
        y2={y}
        stroke={INK}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    )
  }
  const r = kind === 'wide' ? 6.4 : 4.4
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#fff" stroke={INK} strokeWidth="1.6" />
      <circle cx={x} cy={y + (kind === 'wide' ? 0.6 : 0)} r={kind === 'wide' ? 2.9 : 2.4} fill={INK} />
    </g>
  )
}

function Mouth({ kind }: { kind: Face['mouth'] }) {
  const common = { stroke: INK, strokeWidth: 2.6, fill: 'none', strokeLinecap: 'round' as const }
  if (kind === 'smile') return <path d="M 50 68 q 10 9 20 0" {...common} />
  if (kind === 'flat') return <path d="M 51 69 h 18" {...common} />
  if (kind === 'wave') return <path d="M 50 70 q 5 -5 10 0 q 5 5 10 0" {...common} />
  if (kind === 'grimace')
    return (
      <g>
        <rect x="50" y="65" width="20" height="9" rx="3" fill="#fff" stroke={INK} strokeWidth="2.2" />
        <line x1="57" y1="65" x2="57" y2="74" stroke={INK} strokeWidth="1.6" />
        <line x1="63" y1="65" x2="63" y2="74" stroke={INK} strokeWidth="1.6" />
      </g>
    )
  return <ellipse cx="60" cy="70" rx="7" ry="8" fill="#8c3b3b" stroke={INK} strokeWidth="2.2" />
}

export default function Mascot({
  mood,
  size = 132,
  toasting = false,
}: {
  mood: Mood
  size?: number
  /** She has raised her mug at you. Cosmetic, and it does not change her mood. */
  toasting?: boolean
}) {
  const f = FACES[mood]
  const shake = mood === 'panic' ? 'shake' : mood === 'frazzled' ? 'jitter' : 'breathe'

  return (
    <div className={`mascot ${toasting ? 'toasting' : ''}`} style={{ width: size }}>
      <svg viewBox="0 0 120 120" width={size} height={size} className={`mascot-svg ${shake}`}>
        {/* shoulders */}
        <path d="M 24 120 q 0 -26 36 -26 q 36 0 36 26 z" fill={TOP} stroke={INK} strokeWidth="3" />
        {/* lanyard */}
        <path d="M 48 96 L 60 112 L 72 96" fill="none" stroke={PALETTE.gold} strokeWidth="3.4" />
        <rect x="53" y="108" width="14" height="10" rx="2" fill="#fff" stroke={INK} strokeWidth="2.2" />
        {/* neck */}
        <rect x="53" y="80" width="14" height="14" fill={SKIN} stroke={INK} strokeWidth="2.6" />
        {/* head */}
        <circle cx="60" cy="58" r="27" fill={SKIN} stroke={INK} strokeWidth="3" />
        {/* hair */}
        <path
          d="M 33 55 q 2 -30 27 -30 q 25 0 27 30 q -6 -13 -27 -13 q -21 0 -27 13 z"
          fill={HAIR}
          stroke={INK}
          strokeWidth="2.6"
        />
        {f.frizz && (
          <g stroke={HAIR} strokeWidth="3" strokeLinecap="round">
            <line x1="38" y1="34" x2="31" y2="24" />
            <line x1="52" y1="27" x2="49" y2="15" />
            <line x1="68" y1="27" x2="72" y2="15" />
            <line x1="82" y1="34" x2="90" y2="25" />
          </g>
        )}
        {/* brows */}
        <g stroke={INK} strokeWidth="2.8" strokeLinecap="round">
          <line x1="42" y1={42 + f.brow * 0.35} x2="54" y2={44 - f.brow * 0.45} />
          <line x1="66" y1={44 - f.brow * 0.45} x2="78" y2={42 + f.brow * 0.35} />
        </g>
        <Eye x={48} kind={f.eyes} />
        <Eye x={72} kind={f.eyes} />
        <Mouth kind={f.mouth} />
        {/* sweat */}
        {Array.from({ length: f.sweat }).map((_, i) => (
          <path
            key={i}
            className="drip"
            style={{ animationDelay: `${i * 0.45}s` }}
            d={`M ${88 + i * 3} ${38 + i * 13} q 4 6 0 9 q -4 -3 0 -9 z`}
            fill={PALETTE.sweat}
            stroke={INK}
            strokeWidth="1.5"
          />
        ))}
        {/* the raised mug, for when somebody clicks her */}
        {toasting && (
          <g className="toast-mug">
            <path d="M 88 62 h 14 v 10 a 5 5 0 0 1 -14 0 z" fill="#fff" stroke={INK} strokeWidth="2.2" />
            <path d="M 102 64 q 5 0 5 4 q 0 4 -5 4" fill="none" stroke={INK} strokeWidth="2.2" />
            <path d="M 90 58 q 3 -5 0 -9 M 96 58 q 3 -5 0 -9" fill="none" stroke={PALETTE.line} strokeWidth="1.8" strokeLinecap="round" />
          </g>
        )}
      </svg>

      <div className="cups" title={`${f.cups} coffees deep`}>
        {Array.from({ length: f.cups }).map((_, i) => (
          <span key={i} className="cup" style={{ animationDelay: `${i * 0.18}s` }}>
            <svg viewBox="0 0 16 16" width="15" height="15">
              <path d="M 3 5 h 8 v 6 a 3 3 0 0 1 -8 0 z" fill="#fff" stroke={INK} strokeWidth="1.6" />
              <path d="M 11 6.5 q 3 0 3 2.5 q 0 2.5 -3 2.5" fill="none" stroke={INK} strokeWidth="1.6" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  )
}
