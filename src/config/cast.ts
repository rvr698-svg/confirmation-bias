/**
 * CONFIRMATION BIAS - the cast.
 *
 * Who the twelve interrupting colleagues are, and how they are drawn. Kept
 * apart from `interruptions.ts` so the words and the people can be reviewed
 * separately, and so changing a depiction never means touching the copy.
 *
 * PRONOUNS are read from each character's own authored copy and are not a
 * proposal: Priya's idea says "she", so every line the game writes about her
 * says "she". Marcus Lidell's copy never states any, so they is used until it
 * is signed off. See `docs/cast-sheet.md`.
 *
 * LOOKS are signed off. They are deliberately not a guess from anybody's
 * surname. Change any one of them in a word.
 */

import type { Look } from './looks'
import type { PronounKey } from './pronouns'

export interface CastMember {
  pronoun: PronounKey
  look: Look
}

/** Falls back to a neutral figure if an idea is ever added without a cast entry. */
export const DEFAULT_CAST: CastMember = {
  pronoun: 'they',
  look: { skin: 'olive', hair: 'short', hairColour: 'dark', glasses: false, jacket: 'navy', collar: 'open' },
}

export const CAST: Record<string, CastMember> = {
  // Professor Alan Vance, PVC Education
  'i-pathway': {
    pronoun: 'he',
    look: { skin: 'fair', hair: 'receding', hairColour: 'grey', glasses: true, jacket: 'charcoal', collar: 'tie' },
  },

  // Nadia Oyelaran, Director of Marketing
  'i-discovery-days': {
    pronoun: 'she',
    look: { skin: 'brown', hair: 'bob', hairColour: 'black', glasses: false, jacket: 'teal', collar: 'open' },
  },

  // Derek Mbatha, Academic Registrar
  'i-transcripts': {
    pronoun: 'he',
    look: { skin: 'light', hair: 'cropped', hairColour: 'brown', glasses: true, jacket: 'navy', collar: 'tie' },
  },

  // Dr Helen Prosser, Dean of Health and Social Care
  'i-dean-criteria': {
    pronoun: 'she',
    look: { skin: 'tan', hair: 'bun', hairColour: 'dark', glasses: true, jacket: 'plum', collar: 'open' },
  },

  // Professor Ines Karim, PVC International
  'i-trade-fair': {
    pronoun: 'she',
    look: { skin: 'light', hair: 'short', hairColour: 'auburn', glasses: false, jacket: 'navy', collar: 'open' },
  },

  // Gwen Ashby, Chief Operating Officer
  'i-single-front-door': {
    pronoun: 'she',
    look: { skin: 'deep', hair: 'coils', hairColour: 'black', glasses: true, jacket: 'charcoal', collar: 'open' },
  },

  // Marcus Lidell, Chief of Staff to the Vice-Chancellor.
  // Pronouns never stated in the copy. They until signed off.
  'i-hourly-dashboard': {
    pronoun: 'they',
    look: { skin: 'olive', hair: 'locs', hairColour: 'dark', glasses: false, jacket: 'navy', collar: 'tie' },
  },

  // Sanjay Rehill, Director of Digital
  'i-ai-screening': {
    pronoun: 'he',
    look: { skin: 'tan', hair: 'short', hairColour: 'black', glasses: true, jacket: 'teal', collar: 'open' },
  },

  // Bea Nkemelu, Head of Widening Participation
  'i-summer-school': {
    pronoun: 'she',
    look: { skin: 'brown', hair: 'locs', hairColour: 'black', glasses: false, jacket: 'sand', collar: 'open' },
  },

  // Professor Roy Ellington, Head of School, Creative Arts
  'i-personal-interviews': {
    pronoun: 'he',
    look: { skin: 'fair', hair: 'short', hairColour: 'grey', glasses: false, jacket: 'olive', collar: 'open' },
  },

  // Tom Brackley, Director of Estates
  'i-halls-offices': {
    pronoun: 'he',
    look: { skin: 'olive', hair: 'shaved', hairColour: 'black', glasses: false, jacket: 'sand', collar: 'open' },
  },

  // Priya Raghavan, Head of Student Recruitment
  'i-tiktok-strategy': {
    pronoun: 'she',
    look: { skin: 'tan', hair: 'long', hairColour: 'dark', glasses: true, jacket: 'teal', collar: 'open' },
  },
}

export function castFor(ideaId: string): CastMember {
  return CAST[ideaId] ?? DEFAULT_CAST
}
