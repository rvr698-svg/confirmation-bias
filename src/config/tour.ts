/**
 * CONFIRMATION BIAS - the three things you need to know.
 *
 * Testers were missing the rail entirely: they never opened the team panel and
 * never noticed the tray of decisions they had already taken. Three steps, no
 * more, shown once at the start of the first turn.
 *
 * Nothing is stored, so it is once per session rather than once per person.
 * Anyone who skips it can find everything again by looking at the screen.
 */

export interface TourStep {
  /** What to put the ring around. First match wins. */
  target: string
  title: string
  body: string
}

export const TOUR: TourStep[] = [
  {
    target: '.rail',
    title: 'Everything true right now',
    body: 'Your projected intake, the five measures, and three panels that are folded up: your team, the decisions still in the post, and how the intake splits across departments. Open them. People miss the team one and then wonder where Gemma went.',
  },
  {
    target: '.deck',
    title: 'One card at a time',
    body: 'News first, then your decisions. Answering one moves you to the next, and the tabs underneath let you go back and change your mind until you advance the turn.',
  },
  {
    target: '.actionbar',
    title: 'The way out',
    body: 'This tells you how many cards are still waiting and takes you to the next month. Nothing you decide will show up for another three to five turns, so press it with confidence and find out in August.',
  },
]
