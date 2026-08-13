# Social assets

Nothing in here is part of the build; the folder is not served and Vite does not touch it.

| File | What it is |
|---|---|
| `ad-square.png` | 2400 x 2400. **The post image.** One turn of the game, in flight |
| `ad-portrait.png` | 2400 x 3000. The 4:5 crop, which takes more of the feed on a phone |
| `share-card-square.png` / `share-card-portrait.png` | The scorecard off the debrief. Secondary — good as slide two of a carousel, or for a follow-up post about what people scored |
| `*.html`, `ad.css`, `card.css` | The source of each PNG |

Everything is rendered at a device scale factor of 2, so the files are twice their nominal size and
downsample cleanly. Do not crop any of it to 1.91:1 landscape — the type is sized for a square or a
4:5 and it goes to mush at feed width on a phone.

## The advertisement

A composite, not a screenshot, but built the way the board is built: rail on the left, the turn on
the right. It is one real turn — **seed 31, the "Access first" strategy, stopped at the top of turn
6, February**, five months in and five to go.

Every figure on it came out of the engine at that moment, and none of it was written for the poster:

- **4,037 against a target of 3,800**, in amber because the game calls that ratio `warn` — over the
  number, not yet over a ceiling.
- **Limited confidence**, two bars of five, which is exactly what `FORECAST_NOISE` gives you in
  February. This is the whole premise of the game in one line: the forecast leans the same way all
  year and never tells you which way.
- **8 effects of decisions already taken have not landed yet.** Sixteen queue entries, grouped.
- The **announcement** is the tannoy's, chosen by the same rules the game uses — it fired the
  `off-number` situation because Creative Arts was the subject furthest from its own number.
- **61st ▲3, 34.9%, £408k, Coping** are the four measure chips, with the same up / mid / down
  colouring the rail gives them.
- **The pipeline** is what had landed by turn 6, not the projection above it. Different readings,
  deliberately.
- **Yusuf's leg** is a real absence sitting on the queue that turn. So is the capacity reading.

Marge is not a redraw either: the SVG is `src/components/Mascot.tsx` at the **worried** mood — wide
eyes, brow 5, wavy mouth, one bead of sweat, two coffees deep — transcribed to static markup and
cropped to her, because the component's 120-square is mostly air above her head. Her line is hers,
from `config/mascot.ts`. If she is ever redrawn in the game, redraw her here from the same file.

The **Take the meeting** button and the note beside it are off the intro screen; the disclaimer is
`DISCLAIMER_SHORT`.

**Alt text**, which should carry the joke rather than describe pixels:

> A turn of the game Confirmation Bias, six months into a ten-month admissions cycle. The dashboard
> projects an intake of 4,037 against a target of 3,800, at limited confidence, with eight decisions
> already taken that have not landed yet. Marge, the Deputy Head of Admissions, is saying: I am not
> panicking, I have simply made a list, and the list is upsetting.

## The scorecard, if you use it

Same run, played out to the end: hit the number, led the sector on access, paid for both out of the
budget and the team. It breached teaching capacity by 118 places and the accommodation guarantee by
396 beds, which is what earns the verdict about Estates.
`runPlaythrough(31, allStrategies(31)[4])` from `src/sim/playthrough.ts` returns the debrief it was
built from.

**The target on the scorecard reads 3,930, not the 3,800 on the ad.** Both are correct: a decision
later in that same run moved the target. Please do not helpfully fix either one.

## Re-rendering

Edit the HTML, then rasterise with headless Chrome. From this folder:

```bash
chrome --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 --window-size=1200,1200 --screenshot=ad-square.png ad-square.html
```

`ad-portrait.html` is `ad-square.html` with the body class changed, so edit the square and copy it
across. Sizes are all multiples of `--s`, and the 4:5 is the square at `--s: 1.12` — held close
deliberately, because the taller frame is no wider and a bigger step squeezes the right-hand column
into a ribbon. The one other difference: the capacity panel only appears in the 4:5, which has the
height for it, and the square carries the same reading as a line beside Yusuf.

Poppins comes from Google Fonts, so the render needs a network connection. Without one it falls
back to Montserrat and then Arial, and nothing will match the game.

## Three things deliberately left out

- **No URL burned into any image.** Put it in the post text, so it stays clickable and the artwork
  does not go stale when the address changes.
- **No institution, real or invented, anywhere in the frame.** The game's own disclaimer line is on
  every asset instead, because this is going out to people who work in the sector it is cheerfully
  libelling.
- **No score.** The ad is a turn in the middle, where nothing has resolved yet. That is the point of
  it, and it is why the scorecard is a separate asset.

One knowing deviation from the game: the **Take the meeting** button carries an indigo drop shadow
rather than the ink one in `styles/base.css`, because ink on ink disappears at poster size.
