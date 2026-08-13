/**
 * CONFIRMATION BIAS - the hidden bits.
 *
 * Three things reward a player who pokes the screen instead of reading it.
 * None of them touches the model, the scoring or the queue: they are jokes,
 * and they are all in one file so they can be read in one go.
 *
 *   Marge      click her and she raises her mug.
 *   The tannoy click the horn and it makes an announcement about a car.
 *   The idea   click the lightbulb and it goes out. He keeps talking.
 */

/** Marge, toasting you. Cosmetic; her mood is unchanged underneath. */
export const TOASTS: string[] = [
  'Cheers. To the ones who firmed.',
  'To absent colleagues, and the ones on annual leave.',
  'To whoever invented the mail merge. Not to whoever broke it.',
  'To August. May it be brief.',
  'Here is to the number. Whatever it turns out to be.',
  'To the applicant who read the entry requirements. Wherever they are.',
]

/**
 * The car park announcement. Every institution has one, it is always a silver
 * something, and it is never moved.
 */
export const TANNOY_EGGS: string[] = [
  'Would the owner of the silver estate blocking the loading bay please move it. It has been there since the open day in October.',
  'The barrier is working. The barrier has always been working. Please stop reversing into it.',
  'Somebody has parked in the Vice-Chancellor\'s space. Whoever you are, the whole institution salutes you, and please move.',
]

/** What he says when you switch his idea off. He does not notice. */
export const BULB_LINES: string[] = [
  'He has not noticed and is now describing the timeline.',
  'The bulb is out. The idea is not.',
  'Ideas do not need electricity. He has said this before, out loud, in a meeting.',
]

export function pickEgg(pool: string[], n: number): string {
  return pool[Math.abs(n) % pool.length]
}
