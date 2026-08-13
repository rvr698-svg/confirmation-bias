/**
 * ADMISSIONS! - bright ideas.
 *
 * A senior colleague appears at your desk with an initiative. They are not
 * malicious and the idea is not always stupid. It is simply arriving in
 * February with no resource attached and your name on the delivery line.
 *
 * Unlike events, these always demand an answer, and every answer costs
 * something. Giving them what they want costs money or capacity. Fending them
 * off costs goodwill, and goodwill is a thing you spend later without noticing.
 *
 * All magnitudes are PLACEHOLDER and require sign-off.
 */

import type { EffectSpec } from '../sim/types'

export interface IdeaOption {
  id: string
  label: string
  /** Shown under the label. Keep it to one dry line. */
  aside: string
  effects: EffectSpec[]
}

export interface BrightIdea {
  id: string
  who: string
  role: string
  idea: string
  copy: string
  window: [number, number]
  weight: number
  options: IdeaOption[]
}

export const BRIGHT_IDEAS: BrightIdea[] = [
  {
    id: 'i-pathway',
    who: 'Professor Alan Vance',
    role: 'PVC Education',
    idea: 'A new Level 3 pathway with guaranteed progression',
    copy: 'He has seen one at a conference. He would like it live for this cycle. It has not been validated, costed, or mentioned to anyone in Quality.',
    window: [2, 5],
    weight: 9,
    options: [
      {
        id: 'build',
        label: 'Build it properly',
        aside: 'Two of your staff, eight weeks, and a validation panel.',
        effects: [
          { lever: 'spend', op: 'add', value: 55, delay: 0, note: 'you resourced the new progression pathway' },
          { lever: 'team', op: 'add', value: -6, delay: 0, note: 'the pathway build took two of your staff' },
          { lever: 'access', op: 'add', value: 0.014, delay: 4, note: 'the progression pathway brought in access applicants' },
          { lever: 'entryProfile', op: 'add', value: -0.8, delay: 5, note: 'the pathway cohort entered below your standard profile' },
        ],
      },
      {
        id: 'pilot',
        label: 'Give him a pilot',
        aside: 'One subject, forty places, quietly capped.',
        effects: [
          { lever: 'spend', op: 'add', value: 18, delay: 0, note: 'you funded a small pathway pilot' },
          { lever: 'team', op: 'add', value: -2, delay: 0, note: 'the pilot still needed running' },
          { lever: 'access', op: 'add', value: 0.005, delay: 4, note: 'the pathway pilot brought in a few access applicants' },
        ],
      },
      {
        id: 'defer',
        label: 'Defer it to next cycle',
        aside: 'Correct. He will remember this in July.',
        effects: [
          { lever: 'team', op: 'add', value: -2, delay: 0, note: 'three meetings to say no to the pathway' },
          { lever: 'target', op: 'add', value: 45, delay: 3, note: 'having said no once, you had less room to push back on the target' },
        ],
      },
    ],
  },
  {
    id: 'i-discovery-days',
    who: 'Nadia Oyelaran',
    role: 'Director of Marketing',
    idea: 'Rebrand open days as Discovery Days',
    copy: 'New name, new visual identity, new booking journey. The current booking journey works. That is not the point being made.',
    window: [1, 4],
    weight: 8,
    options: [
      {
        id: 'yes',
        label: 'Let her run it',
        aside: 'It will look good. It will also cost you a booking system.',
        effects: [
          { lever: 'spend', op: 'add', value: 48, delay: 0, note: 'you funded the Discovery Days rebrand' },
          { lever: 'applications', op: 'mul', value: 1.012, delay: 3, note: 'the rebranded open days lifted applications slightly' },
          { lever: 'team', op: 'add', value: -3, delay: 1, note: 'the new booking journey broke twice' },
        ],
      },
      {
        id: 'name-only',
        label: 'Change the name, keep the system',
        aside: 'The cheapest possible yes.',
        effects: [
          { lever: 'spend', op: 'add', value: 12, delay: 0, note: 'you agreed to the new name and nothing else' },
          { lever: 'team', op: 'add', value: -1, delay: 0, note: 'renaming everything took an afternoon' },
        ],
      },
      {
        id: 'no',
        label: 'Not in cycle',
        aside: 'She will raise it at the away day. Repeatedly.',
        effects: [
          { lever: 'team', op: 'add', value: -2, delay: 0, note: 'defending the open day format cost you a fortnight of email' },
          { lever: 'spend', op: 'add', value: 30, delay: 4, note: 'marketing later spent the money anyway' },
        ],
      },
    ],
  },
  {
    id: 'i-transcripts',
    who: 'Derek Mbatha',
    role: 'Academic Registrar',
    idea: 'Admissions should take on transcript verification',
    copy: 'It sits with Student Records at the moment. He describes the move as a natural fit. It is a natural fit for Student Records.',
    window: [2, 6],
    weight: 9,
    options: [
      {
        id: 'take',
        label: 'Take it on',
        aside: 'No extra staff. There is never extra staff.',
        effects: [
          { lever: 'team', op: 'add', value: -7, delay: 0, note: 'you absorbed transcript verification with no extra staff' },
          { lever: 'offerRate', op: 'add', value: -0.012, delay: 1, note: 'transcript work slowed your decision making' },
        ],
      },
      {
        id: 'trade',
        label: 'Take it, and trade for a post',
        aside: 'Negotiate. It will take six weeks and you will get half a post.',
        effects: [
          { lever: 'spend', op: 'add', value: 38, delay: 0, note: 'you traded transcript verification for half a post' },
          { lever: 'team', op: 'add', value: -3, delay: 0, note: 'the transcript negotiation dragged on' },
        ],
      },
      {
        id: 'refuse',
        label: 'Refuse',
        aside: 'It goes to a working group. Working groups are eternal.',
        effects: [
          { lever: 'team', op: 'add', value: -3, delay: 0, note: 'you sat on a working group about transcripts' },
        ],
      },
    ],
  },
  {
    id: 'i-dean-criteria',
    who: 'Dr Helen Prosser',
    role: 'Dean of Health and Social Care',
    idea: 'Bespoke offer criteria for her faculty',
    copy: 'Different grades, a different personal statement weighting, and an interview for everyone. She has already told her admissions tutors it is happening.',
    window: [3, 6],
    weight: 8,
    options: [
      {
        id: 'agree',
        label: 'Agree to it',
        aside: 'One faculty, one exception, one precedent.',
        effects: [
          { lever: 'team', op: 'add', value: -5, delay: 0, note: 'running bespoke criteria for one faculty cost the team' },
          { lever: 'offerRate', op: 'add', value: -0.014, delay: 1, note: 'the bespoke criteria slowed offers in a large faculty' },
          { lever: 'entryProfile', op: 'add', value: 1.1, delay: 4, note: 'the tighter faculty criteria lifted your profile' },
        ],
      },
      {
        id: 'partial',
        label: 'Give her the interviews only',
        aside: 'Half a yes buys you most of the peace.',
        effects: [
          { lever: 'team', op: 'add', value: -3, delay: 0, note: 'the extra faculty interviews cost the team' },
          { lever: 'firmRate', op: 'add', value: 0.003, delay: 3, note: 'the extra interviews helped conversion in one faculty' },
        ],
      },
      {
        id: 'hold',
        label: 'Hold the line on one policy',
        aside: 'You are right. It will not feel like it in the meeting.',
        effects: [
          { lever: 'team', op: 'add', value: -2, delay: 0, note: 'the faculty argument took a whole afternoon' },
          { lever: 'firmRate', op: 'add', value: -0.003, delay: 3, note: 'a faculty that felt overruled stopped helping with conversion' },
        ],
      },
    ],
  },
  {
    id: 'i-trade-fair',
    who: 'Professor Ines Karim',
    role: 'PVC International',
    idea: 'A stand at a recruitment fair in Almaty',
    copy: 'Three staff, four days. You have had two applications from Kazakhstan in six years and one of them was a mistake.',
    window: [2, 5],
    weight: 7,
    options: [
      {
        id: 'go',
        label: 'Send the stand',
        aside: 'Three of your people, out of the country, in November.',
        effects: [
          { lever: 'spend', op: 'add', value: 62, delay: 0, note: 'you funded the Almaty recruitment fair' },
          { lever: 'team', op: 'add', value: -4, delay: 0, note: 'three staff went abroad in the middle of the offer season' },
          { lever: 'applications', op: 'mul', value: 1.006, delay: 4, note: 'the international fair produced a handful of applications' },
        ],
      },
      {
        id: 'agent',
        label: 'Send an agent instead',
        aside: 'Cheaper, and nobody loses a week.',
        effects: [
          { lever: 'spend', op: 'add', value: 22, delay: 0, note: 'you sent an agent to the fair rather than your own staff' },
          { lever: 'applications', op: 'mul', value: 1.004, delay: 4, note: 'the agent brought back a few applications' },
        ],
      },
      {
        id: 'decline',
        label: 'Decline',
        aside: 'She will mention the missed market in a paper.',
        effects: [
          { lever: 'team', op: 'add', value: -2, delay: 0, note: 'you wrote a paper explaining why not' },
        ],
      },
    ],
  },
  {
    id: 'i-single-front-door',
    who: 'Gwen Ashby',
    role: 'Chief Operating Officer',
    idea: 'A single front door for all student enquiries',
    copy: 'One team, one inbox, one phone number, for admissions, finance, accommodation and IT. Hosted in your service. Staffed at current levels.',
    window: [4, 7],
    weight: 8,
    options: [
      {
        id: 'host',
        label: 'Host it',
        aside: 'You now answer questions about car parking.',
        effects: [
          { lever: 'team', op: 'add', value: -8, delay: 0, note: 'you took on every enquiry the institution receives' },
          { lever: 'offerRate', op: 'add', value: -0.015, delay: 1, note: 'the enquiry service pulled staff off decisions' },
          { lever: 'melt', op: 'add', value: -0.006, delay: 4, note: 'applicants got answers faster, which held some of them' },
        ],
      },
      {
        id: 'funded',
        label: 'Host it, fully funded',
        aside: 'Say yes and put a number on it. She will pay some of it.',
        effects: [
          { lever: 'spend', op: 'add', value: 72, delay: 0, note: 'you insisted the enquiry service came funded' },
          { lever: 'team', op: 'add', value: -3, delay: 0, note: 'the funded enquiry service still needed setting up' },
          { lever: 'melt', op: 'add', value: -0.006, delay: 4, note: 'faster answers held some applicants' },
        ],
      },
      {
        id: 'later',
        label: 'After Clearing',
        aside: 'The only honest answer. Also the least popular.',
        effects: [
          { lever: 'team', op: 'add', value: -2, delay: 0, note: 'you spent a week explaining the admissions calendar to the COO' },
        ],
      },
    ],
  },
  {
    id: 'i-hourly-dashboard',
    who: "Marcus Lidell",
    role: "Chief of Staff to the Vice-Chancellor",
    idea: 'A live intake dashboard, refreshed hourly',
    copy: 'For the VC. On a screen in her office. She will look at it during the day and ring you about the dips.',
    window: [5, 9],
    weight: 9,
    options: [
      {
        id: 'build',
        label: 'Build it',
        aside: 'A day of your analyst, then every day of your analyst.',
        effects: [
          { lever: 'spend', op: 'add', value: 26, delay: 0, note: 'you built the live intake dashboard' },
          { lever: 'team', op: 'add', value: -6, delay: 0, note: 'the hourly dashboard absorbed your analyst' },
        ],
      },
      {
        id: 'weekly',
        label: 'Offer a weekly one',
        aside: 'Slower, calmer, and just as accurate.',
        effects: [
          { lever: 'team', op: 'add', value: -2, delay: 0, note: 'the weekly report was manageable' },
        ],
      },
      {
        id: 'explain',
        label: 'Explain why hourly is meaningless',
        aside: 'You are correct, and it does not help.',
        effects: [
          { lever: 'team', op: 'add', value: -3, delay: 0, note: 'explaining statistical noise to the executive took two meetings' },
          { lever: 'target', op: 'add', value: 40, delay: 2, note: 'the executive stopped taking your numbers at face value' },
        ],
      },
    ],
  },
  {
    id: 'i-ai-screening',
    who: 'Sanjay Rehill',
    role: 'Director of Digital',
    idea: 'An AI tool to screen personal statements',
    copy: 'A vendor has demonstrated it to him. It scores applicants out of a hundred. Nobody in the room asked what it was trained on.',
    window: [3, 7],
    weight: 8,
    options: [
      {
        id: 'pilot',
        label: 'Pilot it on one subject',
        aside: 'Faster decisions. Also an equality impact assessment.',
        effects: [
          { lever: 'spend', op: 'add', value: 44, delay: 0, note: 'you piloted the screening tool' },
          { lever: 'offerRate', op: 'add', value: 0.016, delay: 1, note: 'automated screening sped your decisions up' },
          { lever: 'access', op: 'add', value: -0.012, delay: 4, note: 'the screening tool quietly marked down your access applicants' },
          { lever: 'team', op: 'add', value: -2, delay: 0, note: 'the pilot needed monitoring' },
        ],
      },
      {
        id: 'assist',
        label: 'Use it to triage, not to decide',
        aside: 'A human still makes every decision.',
        effects: [
          { lever: 'spend', op: 'add', value: 30, delay: 0, note: 'you used the screening tool for triage only' },
          { lever: 'offerRate', op: 'add', value: 0.008, delay: 1, note: 'triage sped your decisions up a little' },
          { lever: 'team', op: 'add', value: -1, delay: 0, note: 'the triage tool needed checking' },
        ],
      },
      {
        id: 'no',
        label: 'Not on selection decisions',
        aside: 'Defensible. Write it down, you will need it.',
        effects: [
          { lever: 'team', op: 'add', value: -3, delay: 0, note: 'you wrote the paper explaining why not, twice' },
        ],
      },
    ],
  },
  {
    id: 'i-summer-school',
    who: 'Bea Nkemelu',
    role: 'Head of Widening Participation',
    idea: 'A residential summer school, second week of August',
    copy: 'The idea is good. The week is Clearing. She has already told sixty schools.',
    window: [7, 9],
    weight: 8,
    options: [
      {
        id: 'run',
        label: 'Run it as planned',
        aside: 'Your team will be doing two jobs in the worst week of the year.',
        effects: [
          { lever: 'spend', op: 'add', value: 46, delay: 0, note: 'you funded the summer school' },
          { lever: 'team', op: 'add', value: -8, delay: 0, note: 'the summer school ran straight into Clearing' },
          { lever: 'access', op: 'add', value: 0.02, delay: 1, note: 'the summer school lifted your access intake' },
        ],
      },
      {
        id: 'move',
        label: 'Move it to July',
        aside: 'Fewer schools can come. It still happens.',
        effects: [
          { lever: 'spend', op: 'add', value: 38, delay: 0, note: 'you moved and funded the summer school' },
          { lever: 'team', op: 'add', value: -4, delay: 0, note: 'the July summer school still cost the team' },
          { lever: 'access', op: 'add', value: 0.011, delay: 1, note: 'the July summer school lifted access a little' },
        ],
      },
      {
        id: 'cancel',
        label: 'Cancel it',
        aside: 'Sixty schools have it in their calendars.',
        effects: [
          { lever: 'team', op: 'add', value: -3, delay: 0, note: 'cancelling the summer school meant sixty phone calls' },
          { lever: 'access', op: 'add', value: -0.008, delay: 2, note: 'cancelling the summer school cost you access applicants' },
        ],
      },
    ],
  },
  {
    id: 'i-personal-interviews',
    who: 'Professor Roy Ellington',
    role: 'Head of School, Creative Arts',
    idea: 'He would like to interview every applicant personally',
    copy: 'All eleven hundred of them. He has done it before, in 1998, when there were ninety.',
    window: [3, 6],
    weight: 7,
    options: [
      {
        id: 'let',
        label: 'Let him try',
        aside: 'He will stop in week three. The backlog will not.',
        effects: [
          { lever: 'offerRate', op: 'add', value: -0.02, delay: 1, note: 'the personal interview experiment stalled a thousand decisions' },
          { lever: 'team', op: 'add', value: -5, delay: 1, note: 'the team cleared the backlog he left behind' },
          { lever: 'entryProfile', op: 'add', value: 0.6, delay: 4, note: 'the interviews he did complete sharpened selection' },
        ],
      },
      {
        id: 'sample',
        label: 'Give him a sample',
        aside: 'Fifty interviews. Enough to feel heard.',
        effects: [
          { lever: 'team', op: 'add', value: -2, delay: 0, note: 'arranging his fifty interviews took a week' },
        ],
      },
      {
        id: 'no',
        label: 'Absolutely not',
        aside: 'He will bring it up at every meeting until March.',
        effects: [
          { lever: 'team', op: 'add', value: -3, delay: 0, note: 'the interview argument ran for months' },
          { lever: 'firmRate', op: 'add', value: -0.002, delay: 3, note: 'a school that felt ignored stopped helping at conversion' },
        ],
      },
    ],
  },
  {
    id: 'i-halls-offices',
    who: 'Tom Brackley',
    role: 'Director of Estates',
    idea: 'Convert a hall of residence into offices',
    copy: 'Professional services need the space and the hall is old. He needs an answer this month. Your intake number is a projection with a wide error bar.',
    window: [5, 8],
    weight: 8,
    options: [
      {
        // The beds are not yours to give. What you are being asked for is
        // whether you will object, and Estates then take a term to do it.
        id: 'agree',
        label: 'Raise no objection',
        aside: 'It solves his problem, and the beds go over the summer.',
        effects: [
          { lever: 'accommodationBeds', op: 'add', value: -190, delay: 2, note: 'the office conversion went ahead unopposed and took 190 beds' },
          { lever: 'spend', op: 'add', value: -25, delay: 0, note: 'the estates deal came with a small budget transfer' },
        ],
      },
      {
        id: 'half',
        label: 'Object to all but one floor',
        aside: 'Splitting the difference, which nobody enjoys.',
        effects: [
          { lever: 'accommodationBeds', op: 'add', value: -70, delay: 2, note: 'one floor of a hall went to offices while you were not looking' },
        ],
      },
      {
        id: 'refuse',
        label: 'Refuse until August',
        aside: 'Right, but you have just made an enemy in Estates.',
        effects: [
          { lever: 'team', op: 'add', value: -2, delay: 0, note: 'the estates disagreement escalated twice' },
          { lever: 'spend', op: 'add', value: 34, delay: 4, note: 'Estates were slower to help when you needed overflow beds' },
        ],
      },
    ],
  },
  {
    id: 'i-tiktok-strategy',
    who: 'Priya Raghavan',
    role: 'Head of Student Recruitment',
    idea: 'A TikTok strategy, run by admissions',
    copy: 'Three posts a week. She has the ideas. She would like your team to have the time.',
    window: [1, 5],
    weight: 7,
    options: [
      {
        id: 'resource',
        label: 'Fund a content post',
        aside: 'Do it properly or do not do it.',
        effects: [
          { lever: 'spend', op: 'add', value: 40, delay: 0, note: 'you funded a content post for social recruitment' },
          { lever: 'applications', op: 'mul', value: 1.011, delay: 3, note: 'the social campaign lifted applications' },
          { lever: 'access', op: 'add', value: 0.006, delay: 4, note: 'the social campaign reached a wider audience' },
        ],
      },
      {
        id: 'absorb',
        label: 'Ask the team to fit it in',
        aside: 'They will. That is the problem.',
        effects: [
          { lever: 'team', op: 'add', value: -5, delay: 0, note: 'the social content landed on staff who already had a job' },
          { lever: 'applications', op: 'mul', value: 1.006, delay: 3, note: 'the social posts lifted applications a little' },
        ],
      },
      {
        id: 'marketing',
        label: 'Send it back to marketing',
        aside: 'Where it belongs. She knows that too.',
        effects: [
          { lever: 'team', op: 'add', value: -1, delay: 0, note: 'a short conversation about whose job it was' },
        ],
      },
    ],
  },
]
