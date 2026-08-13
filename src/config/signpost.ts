/**
 * ADMISSIONS! - the way out.
 *
 * The end of the debrief, chosen by how the cycle actually went. It is an
 * advert and it does not pretend otherwise: the player has just spent ten turns
 * doing a job somebody does for real, and the game has an opinion about what
 * they should do next.
 *
 *   4-5 out of 5   you are good at this
 *   3 out of 5     you are fine, and a hand would not hurt
 *   1-2 out of 5   it is only a game, go again
 *
 * The three actions are the same on every ending, in the same order, because
 * the ending is a grade screen and a grade screen's primary action is always
 * "again":
 *
 *   1. Run another cycle      the thing most people want
 *   2. Send it to your team   the thing that actually spreads it
 *   3. Talk to Think Bold     the thing that pays for it
 *
 * Only the words around them change. Cosmetic: nothing here touches the model.
 */

export const THINK_BOLD_URL = 'https://think-bold.co.uk'

/** One label everywhere, so the Think Bold button is recognisable by the end. */
export const THINK_BOLD_LABEL = 'Talk to us'

export interface Signpost {
  /** Lowest overall score out of five this applies to. Checked high to low. */
  min: number
  headline: string
  body: string
  /** The line that introduces the Think Bold button on this ending. */
  brandLead: string
  /** A closing aside under the buttons. Not every ending needs one. */
  foot?: string
}

export const SIGNPOSTS: Signpost[] = [
  {
    min: 4,
    headline: 'You are, worryingly, good at this.',
    body: 'Five measures, no way to win all of them, and you still came out with a number you could defend in a board paper and a team who would come back next year. That is a rarer skill than the sector admits.',
    brandLead: 'or, if you would rather do it with somebody in your corner',
  },
  {
    min: 3,
    headline: 'A competent cycle, and nobody will ask how.',
    body: 'In a real one nobody hands you a debrief, the counterfactual is not available, and the person who set the target has moved institution by the time it lands. If you would like some help, we know some people who can give you a hand with that.',
    brandLead: 'or',
    foot: 'Other consultancies are available. They will also tell you the number was never achievable, but they will take longer to say it.',
  },
  {
    min: 0,
    headline: 'It is fine. It is a game.',
    body: 'Nobody is in a hotel, nobody lost a place, and the regulator has not written to anyone. The forecast lied to you all year because that is exactly what it was built to do, and half the levers that would have saved you belonged to somebody in another building. You can run the whole thing again, as many times as you like, which is the single largest difference between this and the job.',
    brandLead: 'or, if this is what your real operation looks like',
    foot: 'Don’t worry, Marge won’t...',
  },
]

export function signpostFor(overallOf5: number): Signpost {
  return SIGNPOSTS.find((s) => overallOf5 >= s.min) ?? SIGNPOSTS[SIGNPOSTS.length - 1]
}
