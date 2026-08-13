/**
 * ADMISSIONS! - the event library.
 *
 * Authored, not random. The randomness is in which of these fire and when,
 * inside their window. Every one of them has happened to somebody.
 *
 * Most events simply happen. A minority ask for a response, which is closer to
 * the truth than a game where you always get a say.
 *
 * All magnitudes are PLACEHOLDER and require sign-off.
 */

import type { GameEvent } from '../sim/types'

export const EVENT_LIBRARY: GameEvent[] = [
  {
    id: 'e-website-grades',
    window: [2, 5],
    weight: 10,
    headline: 'A course director has changed the entry requirements',
    copy: 'On the website. Three weeks ago. Nobody was told. Forty-one offers have already gone out against the new grades.',
    effects: [
      { lever: 'team', op: 'add', value: -3, delay: 0, note: 'unpicking the website change cost the team' },
    ],
    response: {
      prompt: 'What do you do?',
      options: [
        {
          id: 'honour',
          label: 'Honour the offers, change the site back',
          effects: [
            { lever: 'offerRate', op: 'add', value: 0.012, delay: 0, note: 'you honoured offers made against altered requirements' },
            { lever: 'entryProfile', op: 'add', value: -0.9, delay: 4, note: 'the honoured offers cost you profile' },
          ],
        },
        {
          id: 'withdraw',
          label: 'Withdraw the offers and apologise',
          effects: [
            { lever: 'applications', op: 'mul', value: 0.994, delay: 2, note: 'withdrawing offers made the sector press' },
            { lever: 'firmRate', op: 'add', value: -0.004, delay: 2, note: 'the withdrawal damaged conversion' },
            { lever: 'entryProfile', op: 'add', value: 0.4, delay: 4, note: 'withdrawing the offers protected the profile' },
          ],
        },
        {
          id: 'devolve',
          label: 'Let the course director own it',
          effects: [
            { lever: 'offerRate', op: 'add', value: 0.018, delay: 0, note: 'you let the altered requirements stand' },
            { lever: 'entryProfile', op: 'add', value: -1.4, delay: 4, note: 'the altered requirements cost you profile' },
            { lever: 'team', op: 'add', value: -2, delay: 1, note: 'the team noticed that the rules bend for some people' },
          ],
        },
      ],
    },
  },
  {
    id: 'e-crm-delay',
    window: [2, 4],
    weight: 9,
    headline: 'The CRM migration has slipped',
    copy: 'Go live moves from October to February. The interim process involves a spreadsheet called FINAL_v4_USE_THIS.',
    effects: [
      { lever: 'offerRate', op: 'add', value: -0.02, delay: 1, note: 'the CRM delay slowed your decision making' },
      { lever: 'team', op: 'add', value: -6, delay: 0, note: 'the CRM delay landed on the admissions team' },
    ],
  },
  {
    id: 'e-tiktok',
    window: [2, 5],
    weight: 7,
    headline: 'A student video about your campus has gone viral',
    copy: 'Four hundred thousand views. It is mostly about the ducks. Enquiries are up.',
    effects: [
      { lever: 'applications', op: 'mul', value: 1.02, delay: 2, note: 'the viral video lifted applications' },
    ],
  },
  {
    id: 'e-visa-policy',
    window: [3, 6],
    weight: 7,
    headline: 'A policy announcement lands mid-cycle',
    copy: 'Changes to the post-study route, announced on a Thursday afternoon, effective for the current cycle. Your international enquiries fall off a cliff by Monday.',
    effects: [
      { lever: 'applications', op: 'mul', value: 0.978, delay: 2, note: 'the policy announcement cost you applications' },
      { lever: 'team', op: 'add', value: -2, delay: 0, note: 'the policy change generated a fortnight of enquiries' },
    ],
  },
  {
    /**
     * Named, because an absence you can see in the roster costs more than a
     * number going down. `config/team.ts` maps this event to the person and
     * the length of the absence, and the rail shows them off sick until they
     * are back.
     */
    id: 'e-sickness',
    window: [3, 7],
    weight: 9,
    headline: 'Yusuf has broken his leg',
    copy: 'He tripped over his cat on the stairs. He is signed off for a month, he is very sorry, and he has apologised roughly forty times from the sofa.',
    effects: [
      { lever: 'offerRate', op: 'add', value: -0.011, delay: 1, note: 'losing an officer for a month slowed decisions' },
      { lever: 'team', op: 'add', value: -5, delay: 0, note: 'the rest of the team covered a month of absence' },
    ],
  },
  {
    id: 'e-partner-school',
    window: [3, 6],
    weight: 6,
    headline: 'A partner school has left your outreach programme',
    copy: 'Six years of work. A new head teacher with a different view of who the school partners with.',
    effects: [
      { lever: 'access', op: 'add', value: -0.009, delay: 3, note: 'losing the partner school cost you access applicants' },
    ],
  },
  {
    id: 'e-rebrand',
    window: [3, 5],
    weight: 6,
    headline: 'Marketing are rebranding mid-cycle',
    copy: 'New palette, new tone of voice, new prospectus. The old one had 8,000 copies left.',
    effects: [
      { lever: 'spend', op: 'add', value: 60, delay: 0, note: 'the mid-cycle rebrand took recruitment budget' },
      { lever: 'applications', op: 'mul', value: 1.008, delay: 3, note: 'the rebrand lifted applications slightly' },
      { lever: 'team', op: 'add', value: -3, delay: 0, note: 'the rebrand meant reissuing every applicant communication' },
    ],
  },
  {
    id: 'e-safeguarding',
    window: [4, 6],
    weight: 5,
    headline: 'A disclosure process has stalled two hundred decisions',
    copy: 'Correctly, and necessarily. Also for eleven weeks.',
    effects: [
      { lever: 'offerRate', op: 'add', value: -0.016, delay: 1, note: 'the stalled disclosure process held up decisions' },
      { lever: 'team', op: 'add', value: -3, delay: 0, note: 'the disclosure backlog took senior time' },
    ],
  },
  {
    id: 'e-offer-error',
    window: [4, 6],
    weight: 7,
    headline: 'An admissions tutor has made four hundred offers in error',
    copy: 'A filter was applied to the wrong column. The offers are out. They are, legally, offers.',
    effects: [
      { lever: 'team', op: 'add', value: -5, delay: 0, note: 'the offer error consumed a week' },
    ],
    response: {
      prompt: 'The offers are already with applicants. What now?',
      options: [
        {
          id: 'honour',
          label: 'Honour every one of them',
          effects: [
            { lever: 'offerRate', op: 'add', value: 0.03, delay: 0, note: 'you honoured four hundred offers made in error' },
            { lever: 'entryProfile', op: 'add', value: -1.7, delay: 4, note: 'the erroneous offers cut your entry profile' },
            { lever: 'conditionsMet', op: 'add', value: 0.015, delay: 5, note: 'the erroneous offers carried lower conditions' },
          ],
        },
        {
          id: 'withdraw',
          label: 'Withdraw them with a full explanation',
          effects: [
            { lever: 'applications', op: 'mul', value: 0.99, delay: 2, note: 'withdrawing four hundred offers reached the press' },
            { lever: 'firmRate', op: 'add', value: -0.005, delay: 2, note: 'the withdrawal damaged your conversion' },
            { lever: 'team', op: 'add', value: -4, delay: 1, note: 'the team made four hundred difficult phone calls' },
          ],
        },
      ],
    },
  },
  {
    id: 'e-regulator-app',
    window: [4, 7],
    weight: 7,
    headline: 'A letter about your access and participation plan',
    copy: 'Your gap has widened for the second year. The letter uses the phrase "we would welcome an update".',
    effects: [],
    response: {
      prompt: 'How do you respond?',
      options: [
        {
          id: 'commit',
          label: 'Commit to deeper contextual offers',
          effects: [
            { lever: 'offerRate', op: 'add', value: 0.018, delay: 1, note: 'the access commitment raised your offer rate' },
            { lever: 'access', op: 'add', value: 0.025, delay: 3, note: 'the deeper contextual commitment lifted access intake' },
            { lever: 'entryProfile', op: 'add', value: -1.8, delay: 4, note: 'the access commitment cost entry profile' },
          ],
        },
        {
          id: 'invest',
          label: 'Fund a new outreach post',
          effects: [
            { lever: 'spend', op: 'add', value: 78, delay: 0, note: 'you funded a new outreach post' },
            { lever: 'access', op: 'add', value: 0.014, delay: 4, note: 'the outreach post lifted access intake' },
          ],
        },
        {
          id: 'letter',
          label: 'Write a careful letter',
          effects: [
            { lever: 'team', op: 'add', value: -3, delay: 0, note: 'the careful letter took three drafts and a legal read' },
            { lever: 'access', op: 'add', value: -0.004, delay: 4, note: 'nothing changed, so access drifted further' },
          ],
        },
      ],
    },
  },
  {
    id: 'e-consultant',
    window: [5, 7],
    weight: 6,
    headline: 'The modelling consultants have reported',
    copy: 'Their model says you will miss by four hundred. Their model also said that last year, when you finished ninety over.',
    effects: [
      { lever: 'spend', op: 'add', value: 32, delay: 0, note: 'you paid for external intake modelling' },
      { lever: 'team', op: 'add', value: -2, delay: 0, note: 'the consultants needed a data extract every week' },
    ],
  },
  {
    id: 'e-finance-saving',
    window: [5, 8],
    weight: 8,
    headline: 'Finance want an in-year saving',
    copy: 'Five per cent, across all professional services, by the end of the month. Recruitment is not exempt.',
    effects: [],
    response: {
      prompt: 'Where does it come from?',
      options: [
        {
          id: 'marketing',
          label: 'Take it from marketing',
          effects: [
            { lever: 'spend', op: 'add', value: -110, delay: 0, note: 'you took the saving from marketing' },
            { lever: 'firmRate', op: 'add', value: -0.007, delay: 2, note: 'cutting marketing cost you conversion' },
            { lever: 'applications', op: 'mul', value: 0.993, delay: 3, note: 'the marketing cut reached late applications' },
          ],
        },
        {
          id: 'staffing',
          label: 'Freeze the vacant posts',
          effects: [
            { lever: 'spend', op: 'add', value: -95, delay: 0, note: 'you froze vacant posts to find the saving' },
            { lever: 'team', op: 'add', value: -9, delay: 1, note: 'the recruitment freeze fell on the people still there' },
            { lever: 'offerRate', op: 'add', value: -0.01, delay: 1, note: 'fewer staff meant slower decisions' },
          ],
        },
        {
          id: 'refuse',
          label: 'Refuse, and put it in writing',
          effects: [
            { lever: 'team', op: 'add', value: 3, delay: 0, note: 'the team saw you refuse a cut on their behalf' },
            { lever: 'spend', op: 'add', value: 35, delay: 1, note: 'refusing the saving cost you goodwill and a contingency' },
          ],
        },
      ],
    },
  },
  {
    id: 'e-vc-radio',
    window: [6, 8],
    weight: 6,
    headline: 'The Vice-Chancellor gave an interview',
    copy: 'Local radio, Tuesday morning. The phrase used was "significant growth this September". Nobody asked admissions whether that was a number anybody could deliver, and on your current projection it is not.',
    effects: [
      { lever: 'target', op: 'add', value: 90, delay: 0, note: 'a public growth commitment raised your effective target' },
      { lever: 'team', op: 'add', value: -3, delay: 0, note: 'the interview generated a week of internal questions' },
    ],
  },
  {
    id: 'e-competitor-unconditional',
    // March only. The copy names the month, and the turn 6 decision already
    // covers a competitor move in February.
    window: [7, 7],
    weight: 9,
    headline: 'A competitor has gone unconditional',
    copy: 'Every course, every applicant, announced in March. Your offer holders received the email at 4pm.',
    effects: [
      { lever: 'firmRate', op: 'add', value: -0.009, delay: 1, note: "the competitor's unconditional move cost you firm acceptances" },
      { lever: 'melt', op: 'add', value: 0.006, delay: 3, note: "the competitor's move raised your melt" },
    ],
  },
  {
    id: 'e-newspaper',
    window: [6, 8],
    weight: 6,
    headline: 'A national newspaper is running a story on unconditional offers',
    copy: 'You are named. You are not the worst example in the article, which is the best available outcome.',
    effects: [
      { lever: 'applications', op: 'mul', value: 0.992, delay: 2, note: 'the press coverage cost you late applications' },
      { lever: 'team', op: 'add', value: -2, delay: 0, note: 'the press enquiry took two days of senior time' },
    ],
  },
  {
    id: 'e-rail-strike',
    window: [7, 7],
    weight: 7,
    headline: 'A rail strike has been called for your largest applicant day',
    copy: 'Announced eleven days out. Nine hundred and forty confirmed attendees, most of them travelling.',
    effects: [
      { lever: 'firmRate', op: 'add', value: -0.006, delay: 1, note: 'the rail strike cost you applicant day conversion' },
      { lever: 'access', op: 'add', value: -0.009, delay: 3, note: 'the applicants who could not travel were your access cohort' },
      { lever: 'team', op: 'add', value: -3, delay: 0, note: 'rearranging the applicant day cost the team' },
    ],
  },
  {
    id: 'e-course-withdrawn',
    window: [5, 8],
    weight: 7,
    headline: 'A course has been withdrawn after offers were made',
    copy: 'A validation issue. Ninety-two offer holders. The decision was taken at a committee you do not sit on.',
    effects: [
      { lever: 'team', op: 'add', value: -6, delay: 0, note: 'the course withdrawal fell to admissions to communicate' },
    ],
    response: {
      prompt: 'What happens to the offer holders?',
      options: [
        {
          id: 'transfer',
          label: 'Transfer them to a related course',
          effects: [
            { lever: 'firmRate', op: 'add', value: -0.003, delay: 1, note: 'some transferred applicants walked away' },
            { lever: 'melt', op: 'add', value: 0.007, delay: 3, note: 'transferred applicants melted at a higher rate' },
          ],
        },
        {
          id: 'release',
          label: 'Release them with a bursary',
          effects: [
            { lever: 'spend', op: 'add', value: 65, delay: 0, note: 'you funded release bursaries for the withdrawn course' },
            { lever: 'firmRate', op: 'add', value: -0.008, delay: 1, note: 'releasing the cohort cost you firm acceptances' },
          ],
        },
      ],
    },
  },
  {
    id: 'e-placement-cut',
    window: [7, 9],
    weight: 7,
    headline: 'A placement partner has cut its numbers',
    copy: 'The trust can take forty per cent fewer students this year. The letter arrived this week. Offers were made in January.',
    effects: [
      { lever: 'placementSupply', op: 'add', value: -150, delay: 0, note: 'the partner cut reduced your placement supply' },
      { lever: 'team', op: 'add', value: -4, delay: 0, note: 'rebrokering placements took the whole team' },
    ],
  },
  {
    id: 'e-award',
    window: [6, 9],
    weight: 5,
    headline: 'Someone in your team has won a national award',
    copy: 'Admissions Team of the Year, regional category. There is a photograph. Everyone is briefly delighted.',
    effects: [
      { lever: 'team', op: 'add', value: 6, delay: 0, note: 'the award lifted the team' },
    ],
  },
  {
    id: 'e-fee-assessor',
    // July only. Four weeks notice has to land inside confirmation.
    window: [9, 9],
    weight: 9,
    headline: 'Your most experienced fee assessor has resigned',
    copy: 'Twelve years. Four weeks notice, which takes them to the second week of August. Nobody else has done a full confirmation.',
    effects: [
      { lever: 'spend', op: 'add', value: 30, delay: 0, note: 'you covered the fee assessment gap' },
      { lever: 'conditionsMet', op: 'add', value: -0.012, delay: 1, note: 'losing the fee assessor cost you confirmations' },
      { lever: 'team', op: 'add', value: -8, delay: 0, note: 'losing your most experienced assessor hit the team hard' },
    ],
  },
  {
    id: 'e-halls-flood',
    window: [9, 10],
    weight: 6,
    headline: 'A hall of residence will not be ready',
    copy: 'A water ingress issue found during the summer works. Two hundred and twenty beds, unavailable until November.',
    effects: [
      { lever: 'accommodationBeds', op: 'add', value: -220, delay: 0, note: 'the hall closure cut your bed capacity' },
      { lever: 'team', op: 'add', value: -3, delay: 0, note: 'the accommodation problem became an admissions problem' },
    ],
  },
  {
    id: 'e-oversubscribed',
    window: [9, 9],
    weight: 7,
    headline: 'Three subject areas are already oversubscribed',
    copy: 'Before results. Before Clearing. The Dean has used the word "untenable" in an email with a large distribution list.',
    effects: [
      { lever: 'teachingCapacity', op: 'add', value: -110, delay: 0, note: 'the oversubscribed subjects cut your usable teaching capacity' },
      { lever: 'team', op: 'add', value: -4, delay: 0, note: 'the capacity argument took the whole of July' },
    ],
  },
  {
    id: 'e-double-book',
    window: [10, 10],
    weight: 5,
    headline: 'Accommodation have double-booked ninety rooms',
    copy: 'Found at 11am on results day. The allocation system and the manual override disagree, and both were used.',
    effects: [
      { lever: 'accommodationBeds', op: 'add', value: -90, delay: 0, note: 'the double booking cut your available beds' },
      { lever: 'spend', op: 'add', value: 40, delay: 0, note: 'you paid for emergency accommodation' },
      { lever: 'team', op: 'add', value: -4, delay: 0, note: 'the double booking landed in the middle of Clearing' },
    ],
  },
  {
    id: 'e-grades-up',
    window: [10, 10],
    weight: 9,
    headline: 'The awarding body has shifted the grade distribution',
    copy: 'Upwards. Two percentage points more at A and A star than modelled. Every firm holder you had is now a firm holder who met their conditions.',
    effects: [
      { lever: 'conditionsMet', op: 'add', value: 0.055, delay: 0, note: 'the grade shift meant far more firm holders met their conditions' },
      { lever: 'entryProfile', op: 'add', value: 0.8, delay: 0, note: 'the grade shift lifted your entry profile' },
    ],
  },
  {
    id: 'e-grades-down',
    window: [10, 10],
    weight: 9,
    headline: 'The awarding body has shifted the grade distribution',
    copy: 'Downwards. A correction year, announced as a return to pre-pandemic standards. Your near miss list is twice as long as modelled.',
    effects: [
      { lever: 'conditionsMet', op: 'add', value: -0.055, delay: 0, note: 'the grade shift meant many more firm holders missed their conditions' },
      { lever: 'entryProfile', op: 'add', value: -0.5, delay: 0, note: 'the grade correction pulled your entry profile down' },
    ],
  },
  {
    id: 'e-clearing-undercut',
    window: [10, 10],
    weight: 7,
    headline: 'A higher tariff provider has opened wide in Clearing',
    copy: 'Courses that have never been in Clearing are in Clearing, at grades below your standard offer. Your call volume halves at 10am.',
    effects: [
      { lever: 'clearingShare', op: 'add', value: -0.022, delay: 0, note: 'a competitor took the Clearing applicants you were expecting' },
    ],
  },
  {
    id: 'e-exec-report',
    window: [7, 9],
    weight: 6,
    headline: 'The executive want a daily intake report',
    copy: 'Daily. With commentary. Starting tomorrow. The forecast has not changed since Tuesday and will not change until August.',
    effects: [
      { lever: 'team', op: 'add', value: -5, delay: 0, note: 'the daily reporting took a person off the work' },
      { lever: 'offerRate', op: 'add', value: -0.006, delay: 1, note: 'daily reporting pulled capacity away from decisions' },
    ],
  },
]

/** Events that must not both fire in one playthrough. */
export const MUTUALLY_EXCLUSIVE: string[][] = [['e-grades-up', 'e-grades-down']]
