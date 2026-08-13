/**
 * CONFIRMATION BIAS - the decision library.
 *
 * Every option writes to the modifier queue with an explicit delay. Nothing
 * here changes a number on the turn it is chosen unless the delay is 0, and
 * even then the player only sees the effect through a noisy forecast.
 *
 * Delays are the design. Read down the delay column of any turn and you are
 * reading when the player finds out.
 *
 * All magnitudes are PLACEHOLDER and require sign-off.
 */

import type { Decision } from '../sim/types'
import { REGULATOR } from './config'

export const DECISIONS: Decision[] = [
  // ---------------------------------------------------------------- TURN 1
  {
    id: 'd1-stance',
    turn: 1,
    question: 'What is your stance on the intake target?',
    context: 'The number is 3,800. Nobody has asked you whether it is achievable.',
    options: [
      {
        id: 'hold',
        label: 'Hold the number',
        blurb: 'Plan to the target as set. No heroics, no hedging.',
        effects: [],
      },
      {
        id: 'push',
        label: 'Push for growth',
        blurb: 'Brief the team to beat it. Extra marketing goes out this week.',
        effects: [
          { lever: 'spend', op: 'add', value: 90, delay: 0, note: 'you funded an early growth push' },
          { lever: 'team', op: 'add', value: -4, delay: 0, note: 'you asked the team for more from the first week' },
          { lever: 'applications', op: 'mul', value: 1.03, delay: 3, note: 'the early push lifted application volume' },
          { lever: 'entryProfile', op: 'add', value: -1, delay: 5, note: 'chasing volume softened the profile' },
        ],
      },
      {
        id: 'under',
        label: 'Quietly plan under',
        blurb: 'You think 3,800 is fiction. You do not say so out loud.',
        effects: [
          { lever: 'spend', op: 'add', value: -40, delay: 0, note: 'you held money back' },
          { lever: 'team', op: 'add', value: 3, delay: 0, note: 'you protected the team from an unrealistic number' },
          { lever: 'applications', op: 'mul', value: 0.985, delay: 3, note: 'a quieter start cost you applications' },
          { lever: 'entryProfile', op: 'add', value: 1, delay: 5, note: 'planning under protected the profile' },
        ],
      },
    ],
  },
  {
    id: 'd1-capacity',
    turn: 1,
    question: 'Where does team capacity go this term?',
    context: 'You have the same establishment as last year and eleven per cent more applications forecast.',
    options: [
      {
        id: 'processing',
        label: 'Front-load on processing',
        blurb: 'Get decisions out fast. Conversion can wait until the spring.',
        effects: [
          { lever: 'offerRate', op: 'add', value: 0.015, delay: 1, note: 'faster processing got more offers out' },
          { lever: 'firmRate', op: 'add', value: 0.005, delay: 4, note: 'early decisions earned goodwill at firm stage' },
          { lever: 'team', op: 'add', value: -3, delay: 0, note: 'the processing push cost the team' },
        ],
      },
      {
        id: 'even',
        label: 'Split evenly',
        blurb: 'Half on decisions, half on applicant contact. Nobody is happy.',
        effects: [],
      },
      {
        id: 'conversion',
        label: 'Front-load on conversion',
        blurb: 'Build the contact programme now. Decisions will take longer.',
        effects: [
          { lever: 'offerRate', op: 'add', value: -0.012, delay: 1, note: 'decisions slowed while you built conversion' },
          { lever: 'firmRate', op: 'add', value: 0.009, delay: 5, note: 'the early conversion work paid off at firm stage' },
          { lever: 'team', op: 'add', value: -3, delay: 0, note: 'the conversion build cost the team' },
        ],
      },
    ],
  },
  {
    id: 'd1-opendays',
    turn: 1,
    question: 'How are you investing in open days?',
    options: [
      {
        id: 'two-big',
        label: 'Two large days',
        blurb: 'Big set pieces. Impressive photographs. Enormous car park problem.',
        effects: [
          { lever: 'spend', op: 'add', value: 120, delay: 0, note: 'you funded two large open days' },
          { lever: 'applications', op: 'mul', value: 1.025, delay: 3, note: 'open days lifted applications' },
          { lever: 'team', op: 'add', value: -4, delay: 1, note: 'two large open days ran the team down' },
        ],
      },
      {
        id: 'four-small',
        label: 'Four modest days',
        blurb: 'More dates, smaller crowds, better conversations.',
        effects: [
          { lever: 'spend', op: 'add', value: 140, delay: 0, note: 'you funded four open days' },
          { lever: 'applications', op: 'mul', value: 1.03, delay: 3, note: 'four open days lifted applications' },
          { lever: 'access', op: 'add', value: 0.01, delay: 4, note: 'more dates reached applicants who could not travel midweek' },
          { lever: 'team', op: 'add', value: -7, delay: 1, note: 'four open days took four weekends' },
        ],
      },
      {
        id: 'digital',
        label: 'One day, rest into digital',
        blurb: 'One campus day. The budget goes to paid social and a virtual tour.',
        effects: [
          { lever: 'spend', op: 'add', value: 70, delay: 0, note: 'you shifted open day money into digital' },
          { lever: 'applications', op: 'mul', value: 1.015, delay: 3, note: 'digital activity lifted applications modestly' },
          { lever: 'access', op: 'add', value: -0.005, delay: 4, note: 'fewer campus visits weakened the access pipeline' },
          { lever: 'team', op: 'add', value: -1, delay: 0, note: 'one open day was manageable' },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- TURN 2
  {
    id: 'd2-entry',
    turn: 2,
    question: 'Where do you position entry requirements for next year?',
    context: 'This goes in the prospectus and on the website. Changing it later is possible but humiliating.',
    options: [
      {
        id: 'hold',
        label: "Hold last year's grades",
        blurb: 'Consistency. Defensible at any meeting.',
        effects: [],
      },
      {
        id: 'lower',
        label: 'Advertise one grade lower',
        blurb: 'BBC becomes BCC. Marketing are delighted. Two heads of school are not.',
        effects: [
          { lever: 'offerRate', op: 'add', value: 0.035, delay: 1, note: 'lower advertised grades raised the offer rate' },
          { lever: 'firmRate', op: 'add', value: 0.006, delay: 2, note: 'lower grades raised firm acceptances two turns on' },
          { lever: 'access', op: 'add', value: 0.008, delay: 5, note: 'lower grades widened the intake' },
          { lever: 'entryProfile', op: 'add', value: -3, delay: 5, note: 'lower advertised grades cut the entry profile' },
          { lever: 'conditionsMet', op: 'add', value: 0.04, delay: 6, note: 'more of your conditional firms met their conditions' },
        ],
      },
      {
        id: 'higher',
        label: 'Advertise one grade higher',
        blurb: 'A statement about quality. Also a statement about volume.',
        effects: [
          { lever: 'applications', op: 'mul', value: 0.97, delay: 2, note: 'higher grades cost you applications' },
          { lever: 'offerRate', op: 'add', value: -0.04, delay: 1, note: 'higher advertised grades cut the offer rate' },
          { lever: 'firmRate', op: 'add', value: -0.005, delay: 2, note: 'higher grades cost firm acceptances' },
          { lever: 'access', op: 'add', value: -0.012, delay: 5, note: 'higher grades narrowed the intake' },
          { lever: 'entryProfile', op: 'add', value: 3.5, delay: 5, note: 'higher advertised grades lifted the entry profile' },
          { lever: 'conditionsMet', op: 'add', value: -0.03, delay: 6, note: 'more of your firm holders missed their conditions' },
        ],
      },
    ],
  },
  {
    id: 'd2-agents',
    turn: 2,
    question: 'What happens to agent and partner spend?',
    options: [
      {
        id: 'grow',
        label: 'Grow the network',
        blurb: 'Six new partners. Commission on enrolment. Nobody has read all six contracts.',
        effects: [
          { lever: 'spend', op: 'add', value: 185, delay: 0, note: 'you grew the agent network' },
          { lever: 'applications', op: 'mul', value: 1.035, delay: 3, note: 'new partners raised application volume' },
          { lever: 'access', op: 'add', value: -0.01, delay: 5, note: 'agent-sourced applicants were not your access cohort' },
          { lever: 'entryProfile', op: 'add', value: -1.5, delay: 5, note: 'agent recruitment softened the profile' },
          { lever: 'melt', op: 'add', value: 0.008, delay: 7, note: 'agent-sourced applicants melted at a higher rate' },
        ],
      },
      {
        id: 'hold',
        label: 'Hold the current network',
        blurb: 'Same partners, same terms, same results.',
        effects: [{ lever: 'spend', op: 'add', value: 95, delay: 0, note: 'you held agent spend flat' }],
      },
      {
        id: 'schools',
        label: 'Cut it, reinvest in schools outreach',
        blurb: 'Sustained work with twelve local schools. Results in about four years.',
        effects: [
          { lever: 'spend', op: 'add', value: 85, delay: 0, note: 'you moved agent money into schools outreach' },
          { lever: 'applications', op: 'mul', value: 0.985, delay: 3, note: 'dropping partners cost you applications' },
          { lever: 'access', op: 'add', value: 0.022, delay: 5, note: 'schools outreach lifted your access intake' },
          { lever: 'entryProfile', op: 'add', value: -0.5, delay: 5, note: 'the outreach cohort applied with slightly lower grades' },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- TURN 3
  {
    id: 'd3-offers',
    turn: 3,
    question: 'What is your offer-making policy?',
    context: 'This is the single biggest lever you will touch all year. You will not see most of it until March.',
    options: [
      {
        id: 'standard',
        label: 'Standard offers only',
        blurb: 'Published criteria, applied consistently.',
        effects: [],
      },
      {
        id: 'loosen',
        label: 'Loosen at the margin',
        blurb: 'Admissions tutors get discretion on near misses. Discretion travels.',
        effects: [
          { lever: 'offerRate', op: 'add', value: 0.05, delay: 0, note: 'loosening raised the offer rate immediately' },
          { lever: 'firmRate', op: 'add', value: 0.008, delay: 2, note: 'the looser offers converted to firms two turns later' },
          { lever: 'entryProfile', op: 'add', value: -2.5, delay: 5, note: 'marginal offers cut the entry profile' },
          { lever: 'conditionsMet', op: 'add', value: 0.045, delay: 6, note: 'the looser conditions were easier to meet at confirmation' },
        ],
      },
      {
        id: 'tighten',
        label: 'Tighten and protect the profile',
        blurb: 'Criteria applied strictly. Two admissions tutors will phone you.',
        effects: [
          { lever: 'offerRate', op: 'add', value: -0.055, delay: 0, note: 'tightening cut the offer rate immediately' },
          { lever: 'firmRate', op: 'add', value: -0.007, delay: 2, note: 'fewer offers meant fewer firms two turns later' },
          { lever: 'entryProfile', op: 'add', value: 3, delay: 5, note: 'strict criteria lifted the entry profile' },
          { lever: 'conditionsMet', op: 'add', value: -0.035, delay: 6, note: 'tighter conditions were harder to meet at confirmation' },
        ],
      },
    ],
  },
  {
    id: 'd3-turnaround',
    turn: 3,
    question: 'What do you commit to on turnaround time?',
    options: [
      {
        id: 'ten-public',
        label: 'Ten working days, published',
        blurb: 'On the website. In the prospectus. Quoted back at you in April.',
        effects: [
          { lever: 'spend', op: 'add', value: 45, delay: 0, note: 'you resourced the ten day commitment' },
          { lever: 'firmRate', op: 'add', value: 0.011, delay: 3, note: 'fast decisions won firm acceptances' },
          { lever: 'team', op: 'add', value: -9, delay: 1, note: 'the published turnaround commitment ground the team down' },
        ],
      },
      {
        id: 'twenty-quiet',
        label: 'Twenty working days, unpublished',
        blurb: 'An internal aim. Achievable. Invisible to applicants.',
        effects: [
          { lever: 'firmRate', op: 'add', value: 0.002, delay: 3, note: 'a quiet target moved firm acceptances slightly' },
          { lever: 'team', op: 'add', value: -2, delay: 1, note: 'the internal target was manageable' },
        ],
      },
      {
        id: 'none',
        label: 'No commitment',
        blurb: 'Decisions when decisions are ready. Honest, at least.',
        effects: [
          { lever: 'applications', op: 'mul', value: 0.99, delay: 4, note: 'slow decisions cost you late applications' },
          { lever: 'firmRate', op: 'add', value: -0.008, delay: 3, note: 'slow decisions cost you firm acceptances' },
          { lever: 'team', op: 'add', value: 4, delay: 1, note: 'no turnaround commitment protected the team' },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- TURN 4
  {
    id: 'd4-interview',
    turn: 4,
    question: 'How much interview and portfolio capacity do you run?',
    context: 'Eleven courses interview. Three of them insist it is non-negotiable.',
    options: [
      {
        id: 'everyone',
        label: 'Interview everyone who applies',
        blurb: 'Thorough. Fair. Four hundred and twelve hours of academic time.',
        effects: [
          { lever: 'spend', op: 'add', value: 75, delay: 0, note: 'you funded a full interview programme' },
          { lever: 'offerRate', op: 'add', value: -0.02, delay: 1, note: 'interviewing everyone slowed offers down' },
          { lever: 'firmRate', op: 'add', value: 0.009, delay: 3, note: 'interviewed applicants were more likely to firm' },
          { lever: 'entryProfile', op: 'add', value: 1, delay: 5, note: 'interviewing sharpened selection' },
          { lever: 'melt', op: 'add', value: -0.012, delay: 6, note: 'interviewed applicants melted less' },
          { lever: 'team', op: 'add', value: -11, delay: 0, note: 'the full interview programme flattened the team' },
        ],
      },
      {
        id: 'shortlist',
        label: 'Interview a shortlist only',
        blurb: 'Interview where it changes the decision. Nowhere else.',
        effects: [
          { lever: 'firmRate', op: 'add', value: 0.003, delay: 3, note: 'shortlist interviews helped conversion a little' },
          { lever: 'team', op: 'add', value: -4, delay: 0, note: 'shortlist interviews took some capacity' },
        ],
      },
      {
        id: 'task',
        label: 'Replace interviews with a set task',
        blurb: 'A submitted piece of work. Faster. Colder.',
        effects: [
          { lever: 'offerRate', op: 'add', value: 0.02, delay: 1, note: 'dropping interviews sped offers up' },
          { lever: 'firmRate', op: 'add', value: -0.004, delay: 3, note: 'losing the interview contact cost you firms' },
          { lever: 'entryProfile', op: 'add', value: -1, delay: 5, note: 'the set task selected less sharply than interviews' },
          { lever: 'team', op: 'add', value: 2, delay: 0, note: 'dropping interviews gave the team time back' },
        ],
      },
    ],
  },
  {
    id: 'd4-contextual',
    turn: 4,
    question: 'What is your contextual offer policy?',
    context: 'Your access and participation plan commits you to a number. The number is not going well.',
    options: [
      {
        id: 'two-grades',
        label: 'Two grades to widened cohorts',
        blurb: 'A serious commitment. Serious consequences for the profile.',
        effects: [
          { lever: 'offerRate', op: 'add', value: 0.025, delay: 1, note: 'contextual offers raised the offer rate' },
          { lever: 'access', op: 'add', value: 0.045, delay: 5, note: 'two grade contextual offers lifted your access intake' },
          { lever: 'entryProfile', op: 'add', value: -3, delay: 5, note: 'two grade contextual offers cut the entry profile' },
          { lever: 'conditionsMet', op: 'add', value: 0.02, delay: 6, note: 'contextual conditions were met more often' },
          { lever: 'melt', op: 'add', value: 0.006, delay: 7, note: 'part of the contextual cohort melted before enrolment' },
        ],
      },
      {
        id: 'one-grade',
        label: 'One grade',
        blurb: 'The sector standard. Nobody will praise it or criticise it.',
        effects: [
          { lever: 'offerRate', op: 'add', value: 0.013, delay: 1, note: 'contextual offers raised the offer rate slightly' },
          { lever: 'access', op: 'add', value: 0.024, delay: 5, note: 'one grade contextual offers lifted your access intake' },
          { lever: 'entryProfile', op: 'add', value: -1.4, delay: 5, note: 'contextual offers cut the entry profile slightly' },
          { lever: 'conditionsMet', op: 'add', value: 0.01, delay: 6, note: 'contextual conditions were met slightly more often' },
        ],
      },
      {
        id: 'as-is',
        label: 'Leave it as it is',
        blurb: 'The policy exists. It is on page 14. It is rarely used.',
        effects: [
          { lever: 'access', op: 'add', value: -0.005, delay: 5, note: 'an unused contextual policy let access drift' },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- TURN 5
  {
    id: 'd5-volumes',
    turn: 5,
    question: 'Applications are in. How do you respond to the volumes?',
    context: 'The equal consideration deadline has passed. This is the first number you can half believe.',
    options: [
      {
        id: 'nerve',
        label: 'Hold your nerve',
        blurb: 'The plan was the plan. It is January. Nothing has actually happened yet.',
        effects: [],
      },
      {
        id: 'second-wave',
        label: 'Open a second offer wave',
        blurb: 'Go back through the declines. Somebody in there will do.',
        effects: [
          { lever: 'spend', op: 'add', value: 35, delay: 0, note: 'you ran a second offer wave' },
          { lever: 'offerRate', op: 'add', value: 0.045, delay: 0, note: 'the second wave raised the offer rate' },
          { lever: 'entryProfile', op: 'add', value: -1.8, delay: 4, note: 'the second wave came from a weaker pool' },
          { lever: 'team', op: 'add', value: -5, delay: 0, note: 'the second wave meant reworking decisions already made' },
        ],
      },
      {
        id: 'pull-back',
        label: 'Pull back in oversubscribed subjects',
        blurb: 'Three courses are already full. Stop offering on them.',
        effects: [
          { lever: 'offerRate', op: 'add', value: -0.05, delay: 0, note: 'pulling back cut the offer rate' },
          { lever: 'firmRate', op: 'add', value: -0.004, delay: 2, note: 'pulling back cost firms two turns later' },
          { lever: 'entryProfile', op: 'add', value: 1.6, delay: 4, note: 'pulling back protected the profile' },
          { lever: 'team', op: 'add', value: -3, delay: 0, note: 'changing course by course took time' },
        ],
      },
    ],
  },
  {
    id: 'd5-staffing',
    turn: 5,
    question: 'The team is behind. What do you do about staffing?',
    options: [
      {
        id: 'recruit',
        label: 'Recruit two fixed-term officers',
        blurb: 'Six weeks to advertise, shortlist, interview and onboard. Start date March.',
        effects: [
          { lever: 'spend', op: 'add', value: 115, delay: 0, note: 'you funded two fixed-term posts' },
          { lever: 'team', op: 'add', value: 12, delay: 1, note: 'the fixed-term officers relieved the team' },
          { lever: 'offerRate', op: 'add', value: 0.015, delay: 2, note: 'extra hands cleared the decision backlog' },
        ],
      },
      {
        id: 'overtime',
        label: 'Pay overtime',
        blurb: 'Immediate. Cheaper. Everyone is already tired.',
        effects: [
          { lever: 'spend', op: 'add', value: 55, delay: 0, note: 'you paid overtime' },
          { lever: 'offerRate', op: 'add', value: 0.012, delay: 1, note: 'overtime cleared decisions quickly' },
          { lever: 'team', op: 'add', value: -6, delay: 2, note: 'the overtime caught up with the team later' },
        ],
      },
      {
        id: 'absorb',
        label: 'Absorb it',
        blurb: 'The team will cope. The team always copes.',
        effects: [
          { lever: 'offerRate', op: 'add', value: -0.015, delay: 1, note: 'the backlog slowed your offer rate' },
          { lever: 'team', op: 'add', value: -10, delay: 2, note: 'absorbing the backlog broke something in the team' },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- TURN 6
  {
    id: 'd6-target',
    turn: 6,
    question: 'The executive want the target revised upwards. What do you agree to?',
    context: 'A neighbouring provider has announced growth. Your Vice-Chancellor read about it on a Sunday.',
    options: [
      {
        id: 'accept',
        label: 'Accept the new number',
        blurb: 'Four thousand. Said out loud, in a room, with minutes.',
        effects: [
          { lever: 'target', op: 'add', value: 200, delay: 0, note: 'you accepted a higher target' },
          { lever: 'team', op: 'add', value: -5, delay: 0, note: 'the raised target landed on the same team' },
        ],
      },
      {
        id: 'negotiate',
        label: 'Negotiate it down',
        blurb: 'You bring the modelling. They bring the ambition. You meet nearer them.',
        effects: [
          { lever: 'target', op: 'add', value: 70, delay: 0, note: 'you negotiated the target increase down' },
          { lever: 'team', op: 'add', value: -2, delay: 0, note: 'the negotiation cost you a fortnight' },
        ],
      },
      {
        id: 'two-books',
        label: 'Accept publicly, plan privately',
        blurb: 'Agree to 4,000 in the meeting. Keep planning to 3,800. Two sets of numbers.',
        effects: [
          { lever: 'target', op: 'add', value: 200, delay: 0, note: 'you accepted a higher target in public' },
          { lever: 'spend', op: 'add', value: 25, delay: 0, note: 'running two plans cost you' },
          { lever: 'team', op: 'add', value: -8, delay: 0, note: 'running two sets of numbers exhausted the team' },
        ],
      },
    ],
  },
  {
    id: 'd6-competitor',
    turn: 6,
    question: 'A competitor has moved. How do you respond?',
    context: 'They have gone to unconditional offers on twelve courses. Nine of them are yours too.',
    options: [
      {
        id: 'match',
        label: 'Match their offer',
        blurb: 'If they are doing it, you have to. That is how this always starts.',
        effects: [
          { lever: 'offerRate', op: 'add', value: 0.03, delay: 0, note: 'matching the competitor raised your offer rate' },
          { lever: 'firmRate', op: 'add', value: 0.006, delay: 2, note: 'matching won you firms two turns later' },
          { lever: 'entryProfile', op: 'add', value: -2.2, delay: 4, note: 'matching unconditional offers cut the entry profile' },
        ],
      },
      {
        id: 'ignore',
        label: 'Ignore it',
        blurb: 'Hold your position. Let them explain themselves to the regulator.',
        effects: [
          { lever: 'firmRate', op: 'add', value: -0.006, delay: 2, note: 'ignoring the competitor cost you firms' },
        ],
      },
      {
        id: 'differentiate',
        label: 'Differentiate on turnaround and contact',
        blurb: 'Do not match the offer. Beat them on how it feels to be an applicant.',
        effects: [
          { lever: 'spend', op: 'add', value: 70, delay: 0, note: 'you funded a differentiation response' },
          { lever: 'firmRate', op: 'add', value: 0.007, delay: 2, note: 'better applicant contact won firms' },
          { lever: 'melt', op: 'add', value: -0.008, delay: 5, note: 'the contact programme reduced melt' },
          { lever: 'team', op: 'add', value: -6, delay: 0, note: 'the differentiation response cost the team' },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- TURN 7
  {
    id: 'd7-conversion',
    turn: 7,
    question: 'What conversion activity do you run?',
    context: 'Offer holders are choosing now. Most of them will not tell you until May.',
    options: [
      {
        id: 'full',
        label: 'Full contact programme',
        blurb: 'Calls, texts, personalised email, academic contact. Everything.',
        effects: [
          { lever: 'spend', op: 'add', value: 165, delay: 0, note: 'you funded a full conversion programme' },
          { lever: 'firmRate', op: 'add', value: 0.014, delay: 1, note: 'the full contact programme won firm acceptances' },
          { lever: 'melt', op: 'add', value: -0.015, delay: 4, note: 'sustained contact cut melt' },
          { lever: 'team', op: 'add', value: -10, delay: 0, note: 'the full contact programme consumed the team' },
        ],
      },
      {
        id: 'targeted',
        label: 'Targeted to firm-likely applicants',
        blurb: 'Model who is winnable. Contact them. Ignore the rest.',
        effects: [
          { lever: 'spend', op: 'add', value: 80, delay: 0, note: 'you funded targeted conversion' },
          { lever: 'firmRate', op: 'add', value: 0.008, delay: 1, note: 'targeted contact won firm acceptances' },
          { lever: 'melt', op: 'add', value: -0.007, delay: 4, note: 'targeted contact cut melt' },
          { lever: 'access', op: 'add', value: -0.008, delay: 4, note: 'your targeting model quietly deprioritised access applicants' },
          { lever: 'team', op: 'add', value: -4, delay: 0, note: 'targeted conversion was manageable' },
        ],
      },
      {
        id: 'email',
        label: 'Email only',
        blurb: 'Four sends. Good open rate. No idea if it works.',
        effects: [
          { lever: 'spend', op: 'add', value: 20, delay: 0, note: 'you ran conversion by email only' },
          { lever: 'firmRate', op: 'add', value: -0.003, delay: 1, note: 'email only conversion lost you firms' },
          { lever: 'melt', op: 'add', value: 0.006, delay: 4, note: 'thin contact raised melt' },
        ],
      },
    ],
  },
  {
    id: 'd7-applicantdays',
    turn: 7,
    question: 'How much goes into applicant days?',
    options: [
      {
        id: 'three-plus',
        label: 'Three days plus travel bursaries',
        blurb: 'Pay the train fare for anyone who asks. It works and it costs.',
        effects: [
          { lever: 'spend', op: 'add', value: 150, delay: 0, note: 'you funded three applicant days with travel bursaries' },
          { lever: 'firmRate', op: 'add', value: 0.012, delay: 1, note: 'applicant days converted offer holders to firms' },
          { lever: 'access', op: 'add', value: 0.018, delay: 4, note: 'travel bursaries brought access applicants onto campus' },
          { lever: 'team', op: 'add', value: -8, delay: 0, note: 'three applicant days took three weekends' },
        ],
      },
      {
        id: 'two',
        label: 'Two standard days',
        blurb: 'What you did last year. It was fine last year.',
        effects: [
          { lever: 'spend', op: 'add', value: 85, delay: 0, note: 'you ran two applicant days' },
          { lever: 'firmRate', op: 'add', value: 0.007, delay: 1, note: 'applicant days converted offer holders to firms' },
          { lever: 'team', op: 'add', value: -4, delay: 0, note: 'two applicant days cost some capacity' },
        ],
      },
      {
        id: 'online',
        label: 'One online event',
        blurb: 'Cheap, well attended, and nobody remembers it.',
        effects: [
          { lever: 'spend', op: 'add', value: 25, delay: 0, note: 'you ran one online applicant event' },
          { lever: 'firmRate', op: 'add', value: 0.001, delay: 1, note: 'the online event barely moved conversion' },
          { lever: 'access', op: 'add', value: -0.006, delay: 4, note: 'no campus visit weakened your access conversion' },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- TURN 8
  {
    id: 'd8-position',
    turn: 8,
    question: 'Firm and insurance decisions are in. Where do you put your effort?',
    options: [
      {
        id: 'insurance',
        label: 'Chase insurance holders hard',
        blurb: 'They chose someone else first. Some of them will miss.',
        effects: [
          { lever: 'spend', op: 'add', value: 45, delay: 0, note: 'you funded an insurance campaign' },
          { lever: 'insuranceConversion', op: 'add', value: 0.07, delay: 1, note: 'chasing insurance holders converted more of them' },
          { lever: 'entryProfile', op: 'add', value: -0.8, delay: 2, note: 'insurance holders arrived with lower grades' },
          { lever: 'team', op: 'add', value: -7, delay: 0, note: 'the insurance campaign cost the team' },
        ],
      },
      {
        id: 'firms',
        label: 'Focus on firm holders',
        blurb: 'Protect what you have. Keep them warm through results.',
        effects: [
          { lever: 'spend', op: 'add', value: 40, delay: 0, note: 'you funded firm holder retention' },
          { lever: 'conditionsMet', op: 'add', value: 0.012, delay: 1, note: 'firm holder support helped them meet conditions' },
          { lever: 'melt', op: 'add', value: -0.012, delay: 2, note: 'firm holder contact cut melt' },
          { lever: 'team', op: 'add', value: -4, delay: 0, note: 'firm holder work was contained' },
        ],
      },
      {
        id: 'balanced',
        label: 'Balanced',
        blurb: 'Half the effort to each. Half the effect from each.',
        effects: [
          { lever: 'spend', op: 'add', value: 42, delay: 0, note: 'you split effort across firms and insurance' },
          { lever: 'insuranceConversion', op: 'add', value: 0.03, delay: 1, note: 'some insurance holders converted' },
          { lever: 'melt', op: 'add', value: -0.005, delay: 2, note: 'the balanced approach cut melt slightly' },
          { lever: 'team', op: 'add', value: -5, delay: 0, note: 'covering both cost the team' },
        ],
      },
    ],
  },
  {
    id: 'd8-conditions',
    turn: 8,
    question: 'How do you set conditions?',
    context: 'What you set now decides how many people you can legitimately confirm in August.',
    options: [
      {
        id: 'standard',
        label: 'Standard conditions',
        blurb: 'As offered. As published. As expected.',
        effects: [],
      },
      {
        id: 'reduce',
        label: 'Reduce conditions for firm holders',
        blurb: 'One grade off, quietly, for anyone who has firmed you.',
        effects: [
          { lever: 'conditionsMet', op: 'add', value: 0.06, delay: 1, note: 'reduced conditions meant far more firms confirmed' },
          { lever: 'entryProfile', op: 'add', value: -2, delay: 2, note: 'reduced conditions cut the entry profile' },
        ],
      },
      {
        id: 'unconditional',
        label: 'Convert some offers to unconditional',
        blurb: 'Certainty for them. Certainty for you. A paragraph in a sector newsletter.',
        effects: [
          { lever: 'unconditionalShare', op: 'add', value: 0.14, delay: 1, note: 'unconditional offers guaranteed those places' },
          { lever: 'firmRate', op: 'add', value: 0.006, delay: 0, note: 'unconditional offers pulled in extra firms' },
          { lever: 'access', op: 'add', value: 0.006, delay: 2, note: 'unconditional offers helped some access applicants commit' },
          { lever: 'entryProfile', op: 'add', value: -3.5, delay: 2, note: 'unconditional offers cut the entry profile sharply' },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- TURN 9
  {
    id: 'd9-prep',
    turn: 9,
    question: 'How do you prepare for confirmation?',
    options: [
      {
        id: 'rehearsal',
        label: 'Full rehearsal, everyone on site',
        blurb: 'Two dry runs on real data. Every scenario walked through.',
        effects: [
          { lever: 'spend', op: 'add', value: 55, delay: 0, note: 'you funded a full confirmation rehearsal' },
          { lever: 'conditionsMet', op: 'add', value: 0.012, delay: 1, note: 'the rehearsal caught decisions that would have been missed' },
          { lever: 'melt', op: 'add', value: -0.014, delay: 1, note: 'a rehearsed confirmation held people through the day' },
          { lever: 'team', op: 'add', value: -9, delay: 0, note: 'the rehearsal took the team into July evenings' },
        ],
      },
      {
        id: 'light',
        label: 'Light touch',
        blurb: 'A briefing and a shared document. Everyone has done this before.',
        effects: [
          { lever: 'melt', op: 'add', value: 0.008, delay: 1, note: 'a light touch confirmation lost people on the day' },
          { lever: 'team', op: 'add', value: -2, delay: 0, note: 'light preparation preserved the team' },
        ],
      },
      {
        id: 'agency',
        label: 'Buy in agency staff',
        blurb: 'Twelve temps and a script. They will be fine on the easy calls.',
        effects: [
          { lever: 'spend', op: 'add', value: 130, delay: 0, note: 'you bought in agency staff for confirmation' },
          { lever: 'conditionsMet', op: 'add', value: 0.004, delay: 1, note: 'extra hands processed more confirmations' },
          { lever: 'melt', op: 'add', value: -0.008, delay: 1, note: 'more phone lines held some applicants' },
          { lever: 'team', op: 'add', value: 4, delay: 0, note: 'agency staff took pressure off your own team' },
        ],
      },
    ],
  },
  {
    id: 'd9-accommodation',
    turn: 9,
    /**
     * You do not own a bed, a lecture theatre or a placement. Accommodation
     * Services, Timetabling and the placement teams do. What you own is the
     * number they plan against, so the decision is what number you give them
     * and how hard you stand behind it. They act on it, in their own time,
     * which is why every effect here has a delay.
     */
    question: 'Accommodation want a number from you. What do you give them?',
    context: `You do not control a single bed. You control the forecast they will plan against, and you will own it either way.`,
    options: [
      {
        id: 'top',
        label: 'Give them the top of your range',
        blurb: 'They will hold overflow against it. If it does not come in, it was your number.',
        effects: [
          { lever: 'spend', op: 'add', value: 90, delay: 0, note: 'you funded the accommodation guarantee campaign against your own high number' },
          { lever: 'accommodationBeds', op: 'add', value: 260, delay: 1, note: 'Accommodation held overflow against the number you gave them' },
          { lever: 'team', op: 'add', value: -3, delay: 0, note: 'defending the high number took a fortnight of meetings' },
        ],
      },
      {
        id: 'mid',
        label: 'Give them the midpoint, labelled as a forecast',
        blurb: 'Honest, unhelpful, and exactly what the model says.',
        effects: [
          { lever: 'accommodationBeds', op: 'add', value: 80, delay: 1, note: 'Accommodation planned cautiously against your midpoint' },
        ],
      },
      {
        id: 'escalate',
        label: 'Put the risk in writing and escalate it',
        blurb: 'No number until somebody says who is carrying the risk. There is now an email.',
        effects: [
          { lever: 'team', op: 'add', value: 3, delay: 0, note: 'escalating the accommodation risk kept it off your team' },
          { lever: 'melt', op: 'add', value: 0.006, delay: 1, note: 'applicants heard nothing definite about accommodation and some drifted' },
        ],
      },
    ],
  },

  // -------------------------------------------------- TURN 10, CONFIRMATION
  {
    id: 'd10-nearmiss',
    turn: 10,
    phase: 'confirmation',
    question: 'It is 8am on results day. What is your near miss policy?',
    context: 'The list is on the screen. Six hundred and forty applicants missed by one grade.',
    options: [
      {
        id: 'confirm-all',
        label: 'Confirm every near miss',
        blurb: 'One grade below, every course, no exceptions. Decided in four minutes.',
        effects: [
          { lever: 'conditionsMet', op: 'add', value: 0.075, delay: 0, note: 'confirming every near miss pulled in a large number of extra students' },
          { lever: 'entryProfile', op: 'add', value: -2.6, delay: 0, note: 'confirming every near miss cut the entry profile' },
        ],
      },
      {
        id: 'selective',
        label: 'Confirm near misses in undersubscribed subjects only',
        blurb: 'Course by course, against the position on the screen.',
        effects: [
          { lever: 'conditionsMet', op: 'add', value: 0.035, delay: 0, note: 'selective near miss confirmation topped up the weak subjects' },
          { lever: 'entryProfile', op: 'add', value: -1.2, delay: 0, note: 'selective confirmation cost some profile' },
          { lever: 'team', op: 'add', value: -3, delay: 0, note: 'deciding course by course took the morning' },
        ],
      },
      {
        id: 'hold',
        label: 'Hold the line',
        blurb: 'Conditions were conditions. Consistency has a price and today you pay it.',
        effects: [
          { lever: 'conditionsMet', op: 'add', value: -0.02, delay: 0, note: 'holding the line rejected applicants you could have taken' },
          { lever: 'entryProfile', op: 'add', value: 1.4, delay: 0, note: 'holding the line protected the entry profile' },
        ],
      },
      {
        /**
         * The one that fills the number and puts the institution in front of
         * the regulator. Waiving published conditions wholesale for firm
         * holders is not a near miss policy, it is admitting students who did
         * not meet the terms they were offered, and it is the institution that
         * carries it, not you.
         */
        id: 'waive',
        label: 'Drop the conditions for all firm holders',
        blurb: 'Everyone who firmed, whatever they got. Fills the number by lunchtime.',
        effects: [
          { lever: 'conditionsMet', op: 'add', value: 0.16, delay: 0, note: 'waiving the conditions confirmed every firm holder regardless of grades' },
          { lever: 'entryProfile', op: 'add', value: -6.5, delay: 0, note: 'waiving the conditions collapsed the entry profile' },
          { lever: 'reputation', op: 'add', value: -REGULATOR.reputationHit, delay: 0, note: 'the regulator opened a case into your confirmation decisions' },
          { lever: 'penalties', op: 'add', value: REGULATOR.fine, delay: 0, note: 'the regulator fined the institution over the waived conditions' },
          { lever: 'team', op: 'add', value: -REGULATOR.teamCost, delay: 0, note: 'your team spent the autumn on the regulator\'s information request' },
        ],
      },
    ],
  },

  // ------------------------------------------------------ TURN 10, CLEARING
  {
    id: 'd10-clearing',
    turn: 10,
    phase: 'clearing',
    question: 'What is your Clearing stance?',
    context: 'You now know your confirmed position. Clearing is the only lever left.',
    options: [
      {
        id: 'wide',
        label: 'Open wide, every subject',
        blurb: 'All courses in Clearing. Take the number. Ask questions in October.',
        effects: [
          { lever: 'spend', op: 'add', value: 95, delay: 0, note: 'you ran a full Clearing operation' },
          { lever: 'clearingShare', op: 'add', value: 0.075, delay: 0, note: 'opening Clearing wide brought in a large late intake' },
          { lever: 'access', op: 'add', value: 0.02, delay: 0, note: 'Clearing brought in access students' },
          { lever: 'entryProfile', op: 'add', value: -3.4, delay: 0, note: 'a wide Clearing cut the entry profile' },
          { lever: 'team', op: 'add', value: -12, delay: 0, note: 'a wide Clearing finished the team off' },
        ],
      },
      {
        id: 'selective',
        label: 'Selective, capacity-led',
        blurb: 'Only the courses with room. Only the applicants who fit.',
        effects: [
          { lever: 'spend', op: 'add', value: 60, delay: 0, note: 'you ran a selective Clearing' },
          { lever: 'clearingShare', op: 'add', value: 0.02, delay: 0, note: 'selective Clearing topped up where you had room' },
          { lever: 'entryProfile', op: 'add', value: -1.1, delay: 0, note: 'selective Clearing cost a little profile' },
          { lever: 'team', op: 'add', value: -7, delay: 0, note: 'Clearing cost the team even when selective' },
        ],
      },
      {
        id: 'adjustment',
        label: 'Clearing plus adjustment, tight',
        blurb: 'Small Clearing. Actively recruit students who exceeded their conditions elsewhere.',
        effects: [
          { lever: 'spend', op: 'add', value: 55, delay: 0, note: 'you ran a tight Clearing with adjustment' },
          { lever: 'clearingShare', op: 'add', value: -0.015, delay: 0, note: 'a tight Clearing brought in very few late students' },
          { lever: 'entryProfile', op: 'add', value: 1.6, delay: 0, note: 'adjustment recruits lifted the entry profile' },
          { lever: 'team', op: 'add', value: -6, delay: 0, note: 'Clearing cost the team even when tight' },
        ],
      },
    ],
  },
  {
    id: 'd10-staffing',
    turn: 10,
    phase: 'clearing',
    question: 'Who is answering the phones?',
    options: [
      {
        id: 'everyone',
        label: 'The whole institution',
        blurb: 'Academics, finance, the library. Two hours of training on Tuesday.',
        effects: [
          { lever: 'spend', op: 'add', value: 70, delay: 0, note: 'you staffed Clearing across the institution' },
          { lever: 'clearingShare', op: 'add', value: 0.02, delay: 0, note: 'more phone lines answered more Clearing calls' },
          { lever: 'melt', op: 'add', value: -0.01, delay: 0, note: 'answered calls became enrolments' },
          { lever: 'team', op: 'add', value: -10, delay: 0, note: 'running an institution-wide Clearing fell on your team' },
        ],
      },
      {
        id: 'admissions',
        label: 'The admissions team only',
        blurb: 'The people who know what they are doing. There are not enough of them.',
        effects: [
          { lever: 'spend', op: 'add', value: 25, delay: 0, note: 'you kept Clearing in house' },
          { lever: 'team', op: 'add', value: -8, delay: 0, note: 'a small team carried the whole of Clearing' },
        ],
      },
      {
        id: 'outsource',
        label: 'Outsourced call handling',
        blurb: 'A contact centre in another city. They have a script and a decision tree.',
        effects: [
          { lever: 'spend', op: 'add', value: 110, delay: 0, note: 'you outsourced Clearing call handling' },
          { lever: 'clearingShare', op: 'add', value: 0.012, delay: 0, note: 'the contact centre handled volume you could not' },
          { lever: 'melt', op: 'add', value: 0.01, delay: 0, note: 'outsourced calls converted less well into enrolments' },
          { lever: 'entryProfile', op: 'add', value: -0.6, delay: 0, note: 'the contact centre applied criteria loosely' },
          { lever: 'team', op: 'add', value: -2, delay: 0, note: 'outsourcing protected the team' },
        ],
      },
    ],
  },
]

export function decisionsForTurn(turn: number, phase: 'confirmation' | 'clearing' | null): Decision[] {
  return DECISIONS.filter((d) => d.turn === turn && (d.phase ?? null) === phase)
}

/**
 * Short names, used by the debrief so it can say "November: Offer-making
 * policy" rather than quoting the whole question back at the player.
 */
export const DECISION_NAMES: Record<string, string> = {
  'd1-stance': 'Intake target stance',
  'd1-capacity': 'Team capacity allocation',
  'd1-opendays': 'Open day investment',
  'd2-entry': 'Entry requirement positioning',
  'd2-agents': 'Agent and partner spend',
  'd3-offers': 'Offer-making policy',
  'd3-turnaround': 'Turnaround time commitment',
  'd4-interview': 'Interview and portfolio capacity',
  'd4-contextual': 'Contextual offer policy',
  'd5-volumes': 'Response to mid-cycle volumes',
  'd5-staffing': 'Staffing decision',
  'd6-target': 'Executive target revision',
  'd6-competitor': 'Competitor response',
  'd7-conversion': 'Offer conversion activity',
  'd7-applicantdays': 'Applicant day investment',
  'd8-position': 'Firm and insurance position',
  'd8-conditions': 'Condition setting',
  'd9-prep': 'Confirmation preparation',
  'd9-accommodation': 'Accommodation and capacity planning',
  'd10-nearmiss': 'Near miss policy',
  'd10-clearing': 'Clearing stance',
  'd10-staffing': 'Clearing staffing',
}
