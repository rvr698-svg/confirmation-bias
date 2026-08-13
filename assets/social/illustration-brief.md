# Brief: key art for Confirmation Bias

For handing to an image model (ChatGPT / DALL·E, Midjourney, whatever the studio uses). The
typographic layout already exists in this folder — `ad-square.html` and `ad-portrait.html` — and is
built from real game data. **What is missing is the picture.** This brief asks for artwork that sits
*behind and beside* that layout, not a finished poster with words on it.

## Read this first, or the output is unusable

**Ask for no text in the image. None.** Image models cannot spell, and every version will come back
with CONFIRMATIQN BIAS or a wall planner labelled JANUARV. All type is set in the HTML afterwards,
where it is sharp, correct, and in the game's actual typeface. If the model offers to add a title,
decline.

**Do not ask it to draw Marge, or any of the twelve senior colleagues.** The cast is signed off in
`docs/cast-sheet.md` and drawn in code, and a generated version of her would be a different person
in a different style — which breaks the sign-off and looks it. Marge is already in the layout as her
real SVG. The artwork should be **the room, not the people**. Any figures in it must be small,
incidental and in the middle distance.

## What to ask for

An illustrated scene, to be used as a hero image and a background layer.

**Deliver:** two crops, 2400 × 2400 (1:1) and 2400 × 3000 (4:5), same scene reframed rather than
squashed. Flat colour, no text.

**Concept, in order of preference.** Ask for the first; the others are fallbacks if it will not come
out.

1. **The wall planner.** An open-plan admissions office wall, seen straight on. A year planner with
   ten columns, September at one end and August at the other. Sticky notes cluster thickly on the
   early columns and thin out to almost nothing on the late ones — except one or two that have
   plainly drifted, sitting months away from where anyone put them. A tannoy horn mounted high in
   one corner. A kettle and a stack of mugs on a low cabinet. A fire door propped open with a box of
   prospectuses. Nobody in shot, or one person in the far distance walking out of frame.
2. **The forecast board.** A whiteboard with a single line chart drawn on it, the line heading
   roughly flat, wrapped in a shaded confidence band so wide it runs off both edges of the board. A
   hand-drawn target line crossing it. Marker pens, one lid missing.
3. **The trays.** A wall of paper trays and pigeonholes labelled by month, one envelope posted into
   the first and the same envelope emerging, dog-eared, from one six along.

**Style.** Flat vector illustration. Uniform dark outlines of consistent weight, no sketchiness, no
texture, no gradients, no drop shadows other than a single hard offset. Think a modern flat editorial
illustration or a tidy isometric-adjacent office scene — closer to a well-drawn app illustration than
to a cartoon. Clean, warm, a bit deadpan. **Not** whimsical, not chaotic, no smoke, no fire, no
sweating cartoon executives, no clip-art lightbulbs.

**Palette — use only these:**

| Role | Hex |
|---|---|
| Outlines, darkest ink | `#1b1a2b` |
| Indigo, the house colour | `#5647d1` |
| Deep indigo | `#3f31ac` |
| Pale indigo wash | `#eceafb` |
| Amber, for attention | `#f0a92b` |
| Pale amber wash | `#fdf2df` |
| Rose, for alarm — sparingly | `#d2405a` |
| Background tint | `#f7f6fc` |
| White | `#ffffff` |

Indigo and white dominate. Amber is an accent only — the tannoy horn, a handful of sticky notes.
Rose barely appears. The background must be the flat tint `#f7f6fc` or transparent, never a scene of
its own.

**Composition.** Leave the left third (1:1) or the top half (4:5) visually quiet and low-contrast:
type goes there. Nothing important behind it. No vignette, no framing border.

## Hard constraints

- No lettering, numerals, logos, or anything that reads as a word — including on the planner, the
  spines of folders, or lanyards.
- No real or invented university branding, crests, or building that reads as a specific institution.
- Any figures are incidental and in the middle distance. No one is crying, shouting, or clutching
  their head. **The joke is the institution, never the people in it, and never the students.**
- No appearance used as shorthand for a personality or a gender — no harried-woman-with-glasses, no
  suited-man-with-briefcase.
- Nothing that reads as AI-default corporate art: no floating holograms, no glowing dashboards, no
  handshake, no rocket, no upward arrow.

## What to send back

Two flat PNGs at the sizes above, plus, if the tool can do it, one version of the winning scene with
a transparent background so it can be layered.

## Iterating

If the first pass is close but busy, ask for "the same scene with a third of the objects removed".
If the outlines come back inconsistent, ask for "uniform outline weight throughout, like a vector
icon set". If the colour drifts, restate the hex list — models forget palettes faster than they
forget composition.

## Then

Send the files back and they can be dropped into `ad-square.html` as a background layer under the
existing panels, keeping every figure on the poster real and every word correctly spelled.
