/**
 * Marge, Deputy Head of Admissions.
 *
 * She has done fourteen cycles. She has opinions. She is the only person in
 * the building who knows where the paper offer letters are kept.
 *
 * Her lines are authored per mood so the copy lives with the rest of the
 * content rather than inside a component.
 */

export type Mood =
  | 'keen'
  | 'calm'
  | 'busy'
  | 'worried'
  | 'frazzled'
  | 'panic'
  // The three below are end of cycle only. Do not use them mid-play, the
  // lines are written in the past tense.
  | 'proud'
  | 'spent'
  | 'wrecked'

export const MASCOT_NAME = 'Marge'
export const MASCOT_ROLE = 'Deputy Head of Admissions, fourteenth cycle'

export const MASCOT_LINES: Record<Mood, string[]> = {
  keen: [
    'Fresh cycle. Nobody has ruined anything yet.',
    'I have printed the plan. I have laminated the plan.',
    'New year, same spreadsheet.',
    'Everything is fine. It is September, so everything is always fine.',
    'I have a new lanyard and a good feeling. One of those will last.',
    'Day one. The kettle works, the CRM works, and I am choosing to enjoy it.',
  ],
  calm: [
    'We are roughly where we should be, which is suspicious.',
    'Nothing on fire. I do not trust it.',
    'This is the good bit. It lasts about a fortnight.',
    'On track. I have said that out loud and now I regret it.',
    'Quiet week. Somewhere, something is quietly going wrong and enjoying itself.',
    'I have had a lunch break. An actual one. Sitting down.',
  ],
  busy: [
    'Four hundred in the queue and the printer has views.',
    'I have not seen daylight since the deadline.',
    'If one more academic asks me to make an exception.',
    'The inbox is a living thing now. It has opinions and a routine.',
    'Three meetings about a meeting, and the meeting was cancelled.',
    'I have answered the same question eleven times and I got better at it.',
  ],
  worried: [
    'That number is lower than I would like. Considerably.',
    'We are behind. I can feel it in my knees.',
    'Somebody is going to ask me about this in a meeting, and it will be a big meeting.',
    'I have run it three times. It says the same thing three times.',
    'The competitor down the road has gone unconditional. Of course they have.',
    'I am not panicking. I have simply made a list, and the list is upsetting.',
  ],
  frazzled: [
    'Two people off, one system down, and it is not even May.',
    'I have stopped counting the hours. It helps.',
    'Do not ask me about annual leave.',
    'I am fine. The team is fine. Everything is fine. The kettle is broken.',
    'I dreamt about the applicant portal. It was not a good dream.',
    'Somebody put a wellbeing poster up. I have read it while eating at my desk.',
  ],
  panic: [
    'We do not have the beds. We genuinely do not have the beds.',
    'Estates are on line one and they are not happy.',
    'This is how it happens. This is exactly how it happens.',
    'Somebody needs to tell the Deans and it is not going to be me.',
    'The switchboard has given up and started apologising on our behalf.',
    'I have been asked whether students can sleep in the library. I said no. I said it twice.',
  ],
  proud: [
    'We got there. I am not going to make a fuss about it.',
    'Fourteen cycles and that one was near enough right.',
    'Put the kettle on. We have earned the good biscuits.',
    'Somebody upstairs will take the credit. Let them. I know who did it.',
  ],
  spent: [
    'That will do. It will have to.',
    'Not our best. Not our worst. I have seen 2019.',
    'We got through it. Nobody writes a case study about getting through it.',
    'Right. Who is telling the Deans?',
    'I am going to sit in the car for ten minutes and then drive home.',
  ],
  wrecked: [
    'I am putting in for a job at the Open University.',
    'Next year we do it differently. We say that every year.',
    'Somebody write this down so we do not do it again.',
    'There is a lessons learned meeting in the diary. There is always a lessons learned meeting.',
  ],
}

/** Deterministic so the line does not flicker on every re-render. */
export function pickLine(mood: Mood, seed: number, turn: number): string {
  const lines = MASCOT_LINES[mood]
  return lines[(Math.abs(seed + turn * 977) >>> 0) % lines.length]
}
