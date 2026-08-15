/**
 * ADMISSIONS! - the three things you need to know.
 *
 * Testers were missing the rail entirely: they never opened the team panel and
 * then wondered, in the debrief, why half the team had left. Three steps, no
 * more, shown once at the start of the first turn.
 *
 * The first step is the important one, so it does not just describe the team
 * panel: it asks the player to open it, and opening it is what moves the tour
 * on. Anybody who would rather not can press Next.
 *
 * Nothing is stored, so this is once per session rather than once per person.
 */

export interface TourStep {
  /** What to put the ring around. First match wins. */
  target: string
  title: string
  body: string
  /**
   * A `<details>` on the page. Opening it advances the tour, so the player
   * learns the panel exists by using it rather than by being told.
   */
  openTarget?: string
  /** Shown under the caption while that panel is still shut. */
  prompt?: string
  /**
   * What to say instead where the rail is a summary bar rather than a rail.
   * On a phone there is no left-hand side and the panels live behind Details,
   * so a step that says "down the left" is describing a screen that is not
   * there. Only the first step needs this; the deck and the action bar are in
   * the same place at every width.
   */
  phone?: Pick<TourStep, 'body' | 'openTarget' | 'prompt'>
}

export const TOUR: TourStep[] = [
  {
    target: '.rail',
    title: 'Where everything stands',
    body: 'Down the left is the current state of the cycle: your projected intake, the five measures you are scored on, and two panels folded away. Keep an eye on it as the months go by. Start with your team — four named people, and how each of them is getting on.',
    openTarget: '.team-strip',
    prompt: 'Open “The team” to carry on.',
    phone: {
      body: 'This line is the state of the cycle: your projected intake, against the target you were handed. Everything else is behind it — the five measures you are scored on, your pipeline, and your team of four named people. Keep an eye on it as the months go by.',
      openTarget: '.rail-fold',
      prompt: 'Tap “Details” to carry on.',
    },
  },
  {
    target: '.deck',
    title: 'One card at a time',
    body: 'News first, then your decisions. Answering one moves you to the next, and the tabs underneath let you go back and change your mind until you advance the turn.',
  },
  {
    target: '.actionbar',
    title: 'The way out',
    body: 'This says how many cards are still waiting and takes you to the next month. Nothing you decide will show up for another three to five turns, so press it with confidence and find out in August.',
  },
]
