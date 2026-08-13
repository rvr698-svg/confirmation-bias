/**
 * ADMISSIONS! - pronouns.
 *
 * Every line the game writes about a person is built from one of these sets,
 * so a colleague cannot be "she" in her own copy and "he" in the line
 * underneath it. Where a character's pronouns have never been stated, they is
 * the default rather than a guess.
 */

export type PronounKey = 'he' | 'she' | 'they'

export interface PronounSet {
  /** he / she / they */
  subject: string
  /** him / her / them */
  object: string
  /** his / her / their */
  possessive: string
  /** is / are */
  is: string
  /** has / have */
  has: string
  /** The third person s: "he means", "they mean". */
  s: string
}

export const PRONOUNS: Record<PronounKey, PronounSet> = {
  he: { subject: 'he', object: 'him', possessive: 'his', is: 'is', has: 'has', s: 's' },
  she: { subject: 'she', object: 'her', possessive: 'her', is: 'is', has: 'has', s: 's' },
  they: { subject: 'they', object: 'them', possessive: 'their', is: 'are', has: 'have', s: '' },
}

/** Sentence-initial subject. "He", "She", "They". */
export function cap(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}
