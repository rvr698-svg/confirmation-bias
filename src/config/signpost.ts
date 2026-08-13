/**
 * CONFIRMATION BIAS - the way out.
 *
 * A tongue-in-cheek signpost at the end of the debrief, chosen by how the
 * player actually did. It is an advert and it does not pretend otherwise: the
 * joke is that they have just spent ten turns doing a job somebody does for
 * real, and the game has an opinion about what they should do next.
 *
 *   4-5 out of 5   you are good at this, go and get paid for it
 *   3 out of 5     you are fine, and a second opinion would not hurt
 *   1-2 out of 5   perhaps not this
 *
 * Cosmetic. Nothing here touches the model or the scoring.
 */

export interface Signpost {
  /** Lowest overall score out of five this applies to. Checked high to low. */
  min: number
  eyebrow: string
  headline: string
  body: string
  /** The bottom tier has no link. Somebody who has just had a bad cycle is
   *  not in the market for an advert. */
  linkLabel?: string
  href?: string
  /** Show the run-it-again button here rather than a link out. */
  restart?: boolean
  foot: string
}

export const SIGNPOSTS: Signpost[] = [
  {
    min: 4,
    eyebrow: 'Postscript',
    headline: 'You are, worryingly, good at this.',
    body: 'Five measures, no way to win all of them, and you still came out with a number you could defend in a board paper and a team who would come back next year. That is a rarer skill than the sector admits, and it is currently advertised at a grade eight.',
    linkLabel: 'See who is hiring',
    href: 'https://www.jobs.ac.uk/search/?keywords=admissions',
    foot: 'Your notice period is probably three months. So is everybody else’s.',
  },
  {
    min: 3,
    eyebrow: 'Postscript',
    headline: 'A competent cycle, and nobody will ask how.',
    body: 'In a real one nobody hands you a debrief, the counterfactual is not available, and the person who set the target has moved institution by the time it lands. If you would like a second opinion before you commit to the number rather than after, that is a thing you can buy.',
    linkLabel: 'think-bold.co.uk',
    href: 'https://think-bold.co.uk',
    foot: 'Other consultancies are available. None of them drew the mascot.',
  },
  {
    min: 0,
    eyebrow: 'Postscript',
    headline: 'It is fine. It is a game.',
    body: 'Nobody is in a hotel, nobody lost a place, and the regulator has not written to anyone. The forecast lied to you all year because that is exactly what it was built to do, and half the levers that would have saved you belonged to somebody in another building. You can run the whole thing again, as many times as you like, which is the single largest difference between this and the job.',
    /** No link. Somebody who has just had a bad cycle is not in the market for
     *  an advert. They get the restart button instead. */
    restart: true,
    foot: 'A different seed draws different events. Marge will not remember any of this.',
  },
]

export function signpostFor(overallOf5: number): Signpost {
  return SIGNPOSTS.find((s) => overallOf5 >= s.min) ?? SIGNPOSTS[SIGNPOSTS.length - 1]
}
