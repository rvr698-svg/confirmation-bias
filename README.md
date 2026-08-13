# CONFIRMATION BIAS

A browser game in which you run a UK admissions office for one recruitment cycle.

A management game about a job where nothing you do shows up for three months.

Ten turns, September to Clearing. Two or three decisions a turn. Every decision resolves three to
five turns after you make it, and the forecast you are shown carries error you cannot detect.

v1 prototype. Single page React, no backend, no accounts, no storage, no analytics, no personal
data. All state is held in React for the session and is gone when you close the tab.

A turn is a fixed board, not a page. The bar is at the top, the state of the cycle is down the left,
the card you are answering is in the middle and the way out is along the bottom. Nothing scrolls, so
nothing can be waiting for you below the fold.

```bash
npm install
npm run dev        # play it
npm test           # 84 tests, including the acceptance criteria
npm run harness    # 700 headless playthroughs, tuning report
npm run build      # production build
```

The dev server runs on port 5273 because 5173 is taken by another project on this machine.

## Before this goes anywhere near a client

Read the header of `src/config/config.ts`. Every constant is marked PLACEHOLDER and needs sign-off.
One item needs a decision rather than a tick:

**The brief's application volume does not reconcile with its target.** 18,000 applications at the
briefed rates produces about 2,490 enrolments against a 3,800 target, which starts the player 1,300
under on turn one with no route back. All seven briefed rates are used verbatim and the application
volume is set to 27,000, which is what those rates imply for a 3,800 intake. The briefed figures are
preserved in `BRIEFED_AS_WRITTEN` for comparison. If you would rather hold 18,000, the alternative
fix is raising the firm acceptance rate to about 0.29.

## How the model works

Everything is a pure function of a modifier queue. Nothing is incrementally mutated.

A decision never changes a number now. It puts entries on the queue, each with an explicit `delay`.
To know the position at any turn you ask what has landed by that turn and recompute from the
baseline. The lag is data, not logic, which is what makes the debrief traceable.

```
levelsAt(queue, turn)   ->  the levers as they stand
computePipeline(levels) ->  applications, offers, firms, insurance,
                            conditions met, enrolled, retained
computeMeasures(...)    ->  the five measures plus capacity breaches
```

The forecast is that same computation run over the **entire** queue including entries that have not
landed, then deliberately corrupted. Two error sources: a per-run bias drawn once at the start, and
per-turn jitter. Both narrow as the cycle progresses and only vanish on results day. The bias is
what stops a player learning to trust the midpoint, because their forecast leans the same way all
year.

### Tuning

Three layers, all in `config.ts`:

- `CALIBRATION` converts authored intent into model units. Around twenty decisions touch the same
  handful of levers, so authored at face value they stack linearly. The first harness run had a
  player who picked every growth option finishing 138 per cent over target.
- `SATURATION` is a guard rail. Aligned decisions on one lever give diminishing returns, because in
  a real cycle you cannot buy the same conversion twice.
- `EVENTS.impact` dials events separately from decisions, and `EVENTS.teamImpact` dials their team
  cost again on top. Without the second dial, ten turns of events ground every team into the floor
  regardless of what the player chose, which makes team a tax rather than a lever.

Levers authored in real units (pounds, beds, placements, the target) bypass the event multiplier. A
hall closure of 220 beds is 220 beds.

### Capacity

Teaching capacity, accommodation beds and placement supply are hard numbers. Exceeding them does not
cap intake, it charges for it: money, team, retention, and its own events. Over-recruitment is a
distinct failure experience, not a lower score.

## Content

| File | What is in it |
|---|---|
| `config/config.ts` | Every constant. Nothing numeric is hard-coded in a component. |
| `config/decisions.ts` | 21 decisions across the ten turns, each option's effects and delays |
| `config/events.ts` | 27 authored events with turn windows and weights |
| `config/interruptions.ts` | 12 senior colleagues with bright ideas. Copy only |
| `config/cast.ts` | Who those 12 are: pronouns and how each is drawn |
| `config/looks.ts` | The drawing palette. Nothing in it is coded to a gender |
| `config/pronouns.ts` | Pronoun sets and their verb agreement |
| `config/mascot.ts` | Marge's lines, by mood |
| `config/nags.ts` | What the interrupting colleague says while you stall |
| `config/subjects.ts` | Five departments, and what each says when it misses its number |
| `config/tannoy.ts` | The announcements, and the situation each one belongs to |
| `config/verdicts.ts` | The final line and the breach lines |

**Bright ideas** are the interruption mechanic. A senior colleague barges over the whole screen with
an initiative and stays there until you deal with them. There is no close button. The scrim, the
Escape key and the button behind him all get the same answer, which is that he is still talking, and
he gets more insistent the longer you leave him. Every answer costs something. Giving them what they
want costs money or capacity. Fending them off costs goodwill, which you spend later without
noticing. They are recorded as your decisions, so the debrief can name them.

**The people.** The copy and the casting are separate files, so a depiction can be changed without
touching a word of writing. Every line the game writes about a colleague is built from that
character's pronoun set rather than typed out, and no hairstyle, collar or pair of glasses belongs to
one pronoun alone. `tests/cast.test.ts` fails if either of those stops being true.
`docs/cast-sheet.md` is the signed-off cast: twelve people, their pronouns, their looks, and the
three questions that were raised and settled.

## Tone

Theme Hospital's rule: the situation is real, only the spin is absurd. The tannoy announces that
students without a room should make their way to the Premier Inn, "where a distinctive city-centre
living experience is waiting for them", because that is genuinely what happens and genuinely how it
gets written up. The bands are the words the sector uses when it is being polite about a disaster:
Sector-leading, Broadly on track, A watching brief, An action plan.

The decisions and the events stay dry. That is what makes the rest of it land, and it is the part a
Head of Admissions has to recognise as their actual job.

The tannoy never invents anything. It reads the same position the dashboard reads and says only what
the player could already see, in the institution's own words.

## Five departments

Your intake is not one number. It splits across Nursing and Health, Business and Law, Computing,
Creative Arts and Engineering, each with its own structural drift and its own appetite for a good
year. Nursing overshoots the moment anything goes well and then eats every placement you have.
Creative Arts declines whatever you do. Business always fills, which is why nobody thanks you for it.

The split is derived from the intake you already have, so nothing about it touches the pipeline, the
scoring or the acceptance tests. It is what the numbers look like from the corridor.

## The table

Entry profile was a number only admissions understood. It is now a league table position, which the
entire institution understands and argues about. Position moves on entry standards, completion and
spend per student, so protecting quality climbs, over-recruiting into a breach falls, and buying your
way up the table costs you the budget measure. That trade-off is not a bug.

## The turn deck

A turn is dealt one card at a time: news first, then your decisions, with a tab per card underneath
so the whole turn is legible without moving the screen. Answering a card moves you on by itself.
The advance button is always on screen and tells you how many cards are still waiting.

**Marge**, Deputy Head of Admissions, reacts to the same numbers the dashboard shows. Her mood is
the fastest read of the game state on the screen. She grows extra coffee cups.

## The debrief

The most important screen, so it does not guess. For every choice you made it lifts that choice's
entries out of the queue, reruns the whole cycle without them, and reports the difference. That is
how it can say "without it you would have finished 94 lower" and be exactly right.

It also replays what your forecast told you each turn against what was true at that moment, which is
usually where the lag lands. The comparison is against the truth at the time, not the final number,
because decisions taken later genuinely changed the outcome and that is not forecast error.

Events you had no say in are excluded from the debrief. You cannot be debriefed on a rail strike.

## Acceptance criteria

Locked in as tests in `tests/model.test.ts`, so tuning cannot silently break them.

| Criterion | Status |
|---|---|
| A full playthrough takes under twelve minutes | 10 turns, 2 to 3 decisions each |
| No strategy scores well on all five measures | Verified across 420 playthroughs. Best case is 3 of 5 |
| Over and under-recruitment both produce a distinct failure | 44% over, 43% under, heavy overshoot always breaches capacity |
| The debrief names actual decisions and traces their effect | Counterfactual rerun per choice |
| The share card is legible and pasteable | Card plus a plain text block with a copy button |
| Every displayed figure derives from the config file | No numeric literals in components |

`npm run harness` prints the current spread, per-measure reachability, failure state rates and
forecast error by turn. Run it after any config change.

## Known gaps

- The board fits without scrolling down to a window about 700px tall. Below that the left rail
  scrolls inside itself, which is the least bad thing to give up: the card and the action bar stay
  put. On a phone the card body scrolls. The brief calls mobile a nice-to-have.
- The share card is a DOM element, not an exported image. Screenshot it, or use the text block.
- Balanced play sits slightly over target because most options lean towards growth. Real, but worth
  a look during tuning.
- **FE is wording only.** The copy is UK-wide and reads for a university or a college, but the model
  underneath is a UCAS undergraduate pipeline: offers, firm and insurance acceptances, conditions
  met, melt, Clearing. FE recruitment does not work that way. Covering it properly means a second
  pipeline, which is an open decision rather than an oversight.
- **The four nations.** Qualifications, funding and Clearing behaviour differ across the UK. The
  content is nation-neutral, not nation-aware.
- Out of scope for v1 and deliberately not built towards: multi-year play, institution types,
  leaderboards, postgraduate and international as separate pipelines, facilitator mode.
