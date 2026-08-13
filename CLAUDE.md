# CLAUDE.md

The map of this repo. Read it before changing anything; update it in the same commit as any
change that makes a line here untrue.

## What this is

**Admissions!** — a browser game about running a UK admissions office for one recruitment cycle.
Ten turns, September to Clearing. Single page React 19 + TypeScript + Vite. No backend, no accounts,
no storage, no analytics, no personal data. All state lives in React for the session.

```bash
npm run dev        # port 5273 (5173 is taken by another project on this machine)
npm test           # 92 tests, including the acceptance criteria
npm run harness    # 700 headless playthroughs, tuning report
npm run build      # tsc -b && vite build
```

Run `npm test` and `npm run harness` after any change to `src/config/*` or `src/sim/*`.
Run `npx tsc -b` after any change to `src/components/*` or `src/screens/*`.

## Architecture in one page

Everything is a pure function of a **modifier queue**. Nothing is incrementally mutated.

A decision never changes a number now. It puts entries on the queue, each with an explicit `delay`.
To know the position at any turn you ask what has landed by that turn and recompute from baseline.

```
levelsAt(queue, turn)    -> the levers as they stand
computePipeline(levels)  -> applications ... enrolled, retained
computeMeasures(...)     -> the five measures plus capacity breaches
```

The forecast is that same computation over the **entire** queue, including entries that have not
landed, then corrupted by a per-run bias plus per-turn jitter. Both narrow through the cycle and
only vanish on results day.

Three turn phases: normal turns 1–9, then turn 10 runs `confirmation` and then `clearing`.

## File map

One clear job per file. If a file starts doing two things, split it.

### Simulation — `src/sim/` (pure, no React)

| File | Job |
|---|---|
| `engine.ts` | Queue maths, pipeline, breaches, forecast, turn flow (`beginTurn`, `commitTurn`) |
| `types.ts` | Every shared type. Levers, entries, state |
| `capacity.ts` | Turns capacity pressure into the sentences the rail shows |
| `clearing.ts` | Draws the phone calls for Clearing and turns them into ordinary decisions |
| `pending.ts` | Groups the queue back into the decisions you are still waiting on |
| `team.ts` | The four named colleagues, derived from the team lever and the queue |
| `league.ts` | The proxy league position: entry standards, completion, spend per student |
| `subjects.ts` | Splits the intake across five departments. Derived, never a lever |
| `tannoy.ts` | Picks the announcement for the turn |
| `scoring.ts` | The five measures into scores out of five, a verdict and an appraisal |
| `debrief.ts` | Counterfactual rerun per choice |
| `playthrough.ts` | Headless runner used by tests and the harness |
| `strategies.ts` | Named bot strategies for the harness |
| `rng.ts` | Seeded draws. Same seed, same cycle |

### Content — `src/config/` (all authored values, all PLACEHOLDER until signed off)

| File | Job |
|---|---|
| `config.ts` | Every constant. Baseline, calibration, saturation, capacity, noise, dials |
| `decisions.ts` | 21 decisions across the ten turns |
| `events.ts` | 27 events with turn windows and weights |
| `interruptions.ts` | 12 senior colleagues with bright ideas. Copy only |
| `cast.ts` | Who those 12 are and how they are drawn. Pronouns and looks |
| `looks.ts` | The drawing palette: skin tones, hair, jackets |
| `pronouns.ts` | Pronoun sets and their verb agreement |
| `mascot.ts` | Marge's lines, by mood |
| `nags.ts` | What the interrupting colleague says while you stall |
| `subjects.ts` | The five departments: shares, drift, elasticity, and their lines |
| `tannoy.ts` | The announcements, and the situation each one belongs to |
| `verdicts.ts` | The final line and the breach lines, in the institution's own voice |
| `clearing.ts` | The clock, and the pool of Clearing calls |
| `team.ts` | The four people, their thresholds, and who an event signs off |
| `rival.ts` | The provider down the road. Name signed off |
| `eggs.ts` | The three hidden jokes |
| `palette.ts` | The colourway. Every colour in the game, including the SVGs |
| `appraisal.ts` | Two appraisal lines, banded by thirds, pooled so they vary |
| `signpost.ts` | The end-of-game signpost, by score band |
| `tour.ts` | The three steps a new player is shown |

### Screens — `src/screens/`

| File | Job |
|---|---|
| `IntroScreen.tsx` | The one screen that is a document and may scroll |
| `TurnScreen.tsx` | One turn. Owns this turn's answers; keyed on turn so they reset by unmounting |

`App.tsx` routes between intro, turn and debrief. It holds `GameState` and nothing else.

### Components — `src/components/`

| Path | Job |
|---|---|
| `layout/TopBar.tsx` | Wordmark, turn counter, ten pips |
| `layout/ActionBar.tsx` | The always-visible way out of a turn |
| `layout/Tannoy.tsx` | The announcement. Click the horn |
| `layout/Disclaimer.tsx` | For fun, not a commentary. Intro, top bar and debrief |
| `layout/Tour.tsx` | Three rings round three real elements, once per session |
| `rail/StatusRail.tsx` | Composes the left rail |
| `rail/ProjectionPanel.tsx` | Projected intake and confidence bars |
| `rail/PipelinePanel.tsx` | The pipeline as it stands |
| `rail/MeasureChips.tsx` | Profile, access, budget, team |
| `rail/CapacityStrip.tsx` | Capacity headline, detail folds away |
| `rail/TeamStrip.tsx` | Who is fine, stretched, looking, off sick or gone |
| `rail/PendingTray.tsx` | What you have already decided and not yet felt |
| `rail/SubjectStrip.tsx` | The five departments, folded away |
| `turn/TurnDeck.tsx` | The single card in front of you |
| `turn/DeckNav.tsx` | One tab per card in the turn |
| `turn/OptionGrid.tsx` | The only way this game asks a question |
| `turn/ExecModal.tsx` | The interruption. Covers the board, cannot be dismissed |
| `turn/ClearingClock.tsx` | The countdown. The only thing that moves on its own |
| `SubjectTable.tsx` | Who actually turned up, for the debrief |
| `ScoreRow.tsx` | One measure, out of five |
| `Signpost.tsx` | The way out, chosen by how the cycle went |
| `DecisionCard.tsx` / `EventCard.tsx` | Card contents only. The frame belongs to the deck |
| `Mascot.tsx` / `MascotBar.tsx` | Marge. `compact` is the rail version |
| `art/ExecFigure.tsx` | The man with the idea, drawn once |
| `Debrief.tsx` / `ShareCard.tsx` | The end screen. A document, so it scrolls |

`hooks/useTurnDeck.ts` builds the deck for a turn and owns which card is showing.
`hooks/useCountdown.ts` is the Clearing clock. `hooks/useTallViewport.ts` decides which rail panels
start folded on a short window.

### Styles — `src/styles/`, one file per part of the screen

`base.css` (tokens, type, buttons) · `layout.css` (the fixed board) · `mascot.css` · `rail.css` ·
`deck.css` · `exec.css` · `debrief.css`. `src/index.css` contains imports and nothing else.

## Rules

1. **A turn never scrolls, at any width.** `.play` is fixed to the viewport and capped to it: bar,
   rail, card, action bar. If something new does not fit, compress it in the `max-height: 820px`
   block or fold it away. On phones the rail lies down as a swipeable strip and the pips go — check
   375px before shipping a layout change. The intro and the debrief are documents and may scroll.
2. **No numeric literals in components.** Every displayed figure derives from `src/config/`. This is
   an acceptance criterion with a test behind it.
3. **The interruption blocks.** It is a modal over everything, it takes focus, and Escape, the scrim
   and the button behind it all refuse. Never give it a close button.
4. **Never write a pronoun into a sentence.** Every line the game writes about a person is built
   from that character's `PronounSet`. A colleague who is "she" in her copy is "she" in the line
   underneath it. `tests/cast.test.ts` enforces this. Where pronouns have never been stated, they is
   the default, not a guess.
5. **No appearance is a gender marker.** Hair, glasses and collars are authored per character in
   `cast.ts` and no style may belong to one pronoun alone — there is a test for that too. The joke is
   always the behaviour, never how somebody looks. The cast is signed off in `docs/cast-sheet.md`;
   change a depiction there and in `cast.ts` together, never one without the other.
6. **UK-wide, HE and FE in the wording.** No "English", no assumption of a university. The model is
   still a UCAS undergraduate pipeline and FE is an open scope decision, not an oversight.
7. **The situation is real, the spin is absurd.** Theme Hospital's rule. Verdicts, breach lines, band
   names and the tannoy are written in the institution's own voice, cheerfully describing a
   disaster. The decisions and events stay dry — that is what makes the jokes land. Never invent a
   number for a joke: the tannoy only ever says what the dashboard already knows.
8. **The subject mix and the roster are derived.** Five departments split the intake the player
   already has; the four named colleagues are the team lever plus any absence sitting on the queue.
   Neither feeds back into the pipeline, the scoring or the acceptance tests.
9. **You are Head of Recruitment and Admissions, not Estates.** Beds, lecture theatres and placements
   belong to other departments. A decision may never set `teachingCapacity` or `placementSupply`, and
   anything that moves `accommodationBeds` lands with a delay, because somebody else has to act on
   your forecast first. Events may still do any of it to you. `tests/scope.test.ts` enforces this.
10. **Waiving published conditions is a regulatory matter.** The fine is a `penalties` lever, kept
    apart from `spend` so it wrecks the budget without ever flattering the table. Standing is a
    `reputation` lever. The fine does count towards spend per student, deliberately, and the game
    says so out loud — `LEAGUE.finesCountAsSpend` turns it off.
11. **Colour carries meaning and still has to pass.** The palette lives in `config/palette.ts` and
    `styles/base.css` and nowhere else. Every text colour sits above 4.5:1 on its background; check
    it before adding a new surface.
12. **The simulation stays pure.** No React imports under `src/sim/`. Nothing there reads the DOM.
13. **Delays are data.** A decision writes queue entries with a `delay`; it does not change a number
    directly.
14. **Event responses are recorded as decisions**, so the debrief can name them. Events you had no
    say in are excluded from the debrief.
15. **Levers in real units** (`spend`, `target`, `teachingCapacity`, `accommodationBeds`,
    `placementSupply`) bypass the event multiplier. 220 beds is 220 beds.
16. Config values are PLACEHOLDER and need sign-off, with four exceptions already agreed: the cast
    and their looks (`docs/cast-sheet.md`), the rival's name, and `LEAGUE.sensitivity`. See the
    header of `config.ts` and the application-volume note in `README.md` for the rest.

## Open scope decisions, not oversights

- **FE.** The wording works for a college, the model does not. FE recruitment has no firm and
  insurance acceptances and no Clearing in the UCAS sense. A second pipeline is the honest fix and
  has not been agreed.
- **The four nations.** Qualifications, funding and Clearing behaviour differ across the UK. The
  content is currently nation-neutral rather than nation-aware.

## Acceptance criteria, locked in `tests/model.test.ts` and `tests/cast.test.ts`

Under twelve minutes a playthrough · no strategy scores well on all five measures · over and
under-recruitment both produce a distinct failure · the debrief names actual decisions and traces
their effect · the share card is legible and pasteable · every displayed figure derives from config.
