/**
 * CONFIRMATION BIAS - how people are drawn.
 *
 * A small palette, combined per character in `cast.ts`. Nothing in here is
 * coded to a gender: any hair goes with any pronoun, any collar with any role.
 * The joke is always the behaviour, never the person's appearance.
 *
 * Every value is PROPOSED and needs sign-off. Changing a character's
 * appearance is one word in `cast.ts`.
 */

export type SkinTone = 'light' | 'fair' | 'olive' | 'tan' | 'brown' | 'deep'

export const SKIN: Record<SkinTone, string> = {
  light: '#f2d3b8',
  fair: '#e8b98f',
  olive: '#cfa07a',
  tan: '#b97f52',
  brown: '#8d5524',
  deep: '#5c3317',
}

export type HairColour = 'black' | 'dark' | 'brown' | 'auburn' | 'blonde' | 'grey' | 'white'

export const HAIR: Record<HairColour, string> = {
  black: '#1e1b1a',
  dark: '#3b2a20',
  brown: '#6b4a2f',
  auburn: '#8a3b1e',
  blonde: '#c9a24a',
  grey: '#8d8d8d',
  white: '#dcdcdc',
}

/** Silhouettes only. None of these is a gender marker on its own. */
export type HairStyle =
  | 'short'
  | 'cropped'
  | 'coils'
  | 'locs'
  | 'bob'
  | 'long'
  | 'bun'
  | 'receding'
  | 'shaved'

export type JacketColour = 'navy' | 'charcoal' | 'teal' | 'plum' | 'sand' | 'olive'

export const JACKET: Record<JacketColour, string> = {
  navy: '#3b4a6b',
  charcoal: '#3f4448',
  teal: '#2f6f66',
  plum: '#5a3a52',
  sand: '#a98d63',
  olive: '#4f5b3a',
}

export interface Look {
  skin: SkinTone
  hair: HairStyle
  hairColour: HairColour
  glasses: boolean
  jacket: JacketColour
  /** A tie or an open collar. Not a gender marker either. */
  collar: 'tie' | 'open'
}
