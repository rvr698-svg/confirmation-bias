/**
 * CONFIRMATION BIAS - the colourway.
 *
 * One source for every colour in the game, so a recolour is one file rather
 * than a hunt through SVGs. The CSS custom properties in `styles/base.css`
 * carry the same values; anything drawn in an SVG imports them from here.
 *
 * Deliberately nothing to do with any consultancy's brand: indigo, amber and
 * rose, on a near-black indigo ink.
 */

export const PALETTE = {
  ink: '#1b1a2b',
  /** The house colour. Rules, pips, selected options, Marge's jumper. */
  brand: '#5647d1',
  brandDark: '#3f31ac',
  brandWash: '#eceafb',
  /** Attention, not alarm. The tannoy, the bulb, the interruption. */
  gold: '#f0a92b',
  goldWash: '#fdf2df',
  /** Alarm. */
  bad: '#d2405a',
  badWash: '#fbeaee',
  line: '#e4e2ef',
  wash: '#f7f6fc',
  white: '#ffffff',
  /** Drawn people. Skin and hair for Marge live in the cast palette. */
  off: '#e6e4ee',
  sweat: '#7ec8ef',
} as const

/**
 * Think Bold's own four colours, used as a small accent on their call to
 * action at the end of the debrief. Not the logo: an adjacency. If the real
 * mark is dropped into `public/`, swap it in at `components/Signpost.tsx`.
 */
export const THINK_BOLD = {
  red: '#e8402a',
  teal: '#3fb49f',
  yellow: '#f5c518',
  pink: '#e6187c',
} as const
