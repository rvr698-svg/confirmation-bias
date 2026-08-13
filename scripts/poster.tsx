/**
 * The social poster.
 *
 * Marge as the hero with a flavour of the game around her, rather than a
 * screenshot of it. She is rendered from the real component, so the poster can
 * never drift from the game: change her face in `Mascot.tsx` and the advert
 * changes with it.
 *
 *   npx vite-node scripts/poster.tsx
 *
 * Output goes to assets/social, which is deliberately not in the repository.
 * Needs sharp, which is not a dependency: npm i --no-save sharp
 */

import { renderToStaticMarkup } from 'react-dom/server'
import sharp from 'sharp'
import { PALETTE } from '../src/config/palette'
import Mascot from '../src/components/Mascot'
import type { Mood } from '../src/config/mascot'

const OUT = 'assets/social'

/** Marge, drawn by the game, with the wrapper and the cups stripped off. */
function marge(mood: Mood, size: number): string {
  const html = renderToStaticMarkup(<Mascot mood={mood} size={size} />)
  const svg = html.match(/<svg[\s\S]*?<\/svg>/)
  if (!svg) throw new Error('could not find Marge in the rendered markup')
  return svg[0]
}

/** Her coffee, drawn at poster scale. */
function cups(n: number, x: number, y: number, scale: number): string {
  return Array.from({ length: n })
    .map((_, i) => {
      const cx = x + i * 34 * scale
      return `<g transform="translate(${cx} ${y}) scale(${scale * 2})">
        <path d="M 3 5 h 8 v 6 a 3 3 0 0 1 -8 0 z" fill="#fff" stroke="${PALETTE.ink}" stroke-width="1.6"/>
        <path d="M 11 6.5 q 3 0 3 2.5 q 0 2.5 -3 2.5" fill="none" stroke="${PALETTE.ink}" stroke-width="1.6"/>
      </g>`
    })
    .join('')
}

/** The ten pips from the top bar, as texture rather than as a readout. */
function pips(done: number, x: number, y: number, w: number, gap: number): string {
  return Array.from({ length: 10 })
    .map((_, i) => {
      const fill = i < done ? PALETTE.gold : i === done ? '#fff' : 'rgba(255,255,255,0.25)'
      return `<rect x="${x + i * (w + gap)}" y="${y}" width="${w}" height="14" rx="5"
        fill="${fill}" stroke="${PALETTE.ink}" stroke-width="3"/>`
    })
    .join('')
}

const TITLE = 'CONFIRMATION BIAS'
const FONT = "Segoe UI, Segoe UI Semibold, Arial, sans-serif"

interface Poster {
  name: string
  w: number
  h: number
  build: () => string
}

/** Which Marge fronts the advert. Clearing week suggests the frazzled one. */
const SQUARE_MOODS: { mood: Mood; cups: number; name: string }[] = [
  { mood: 'frazzled', cups: 3, name: 'poster-square' },
  { mood: 'worried', cups: 2, name: 'poster-square-calm' },
]

const bubble = (x: number, y: number, w: number, h: number) => `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="34"
      fill="#fff" stroke="${PALETTE.ink}" stroke-width="7"/>
    <path d="M ${x} ${y + h - 70} l -34 26 l 34 12 z" fill="#fff" stroke="${PALETTE.ink}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M ${x - 2} ${y + h - 68} l 0 34" stroke="#fff" stroke-width="8"/>
  </g>`

const square = (mood: Mood, cupCount: number, name: string): Poster => ({
  name,
  w: 1200,
  h: 1200,
  build: () => `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
  <rect width="1200" height="1200" fill="${PALETTE.brand}"/>

  <text x="90" y="132" font-family="${FONT}" font-size="27" letter-spacing="7"
    fill="rgba(255,255,255,0.85)" font-weight="600">TEN TURNS. ONE ADMISSIONS CYCLE.</text>
  <text x="90" y="228" font-family="${FONT}" font-size="80" letter-spacing="5"
    fill="#fff" font-weight="700">${TITLE}</text>

  ${bubble(500, 322, 620, 300)}
  <text x="550" y="410" font-family="${FONT}" font-size="43" font-weight="700" fill="${PALETTE.ink}">Somebody needs to tell</text>
  <text x="550" y="468" font-family="${FONT}" font-size="43" font-weight="700" fill="${PALETTE.ink}">the Deans and it is not</text>
  <text x="550" y="526" font-family="${FONT}" font-size="43" font-weight="700" fill="${PALETTE.ink}">going to be me.</text>
  <text x="550" y="584" font-family="${FONT}" font-size="23" letter-spacing="3"
    fill="${PALETTE.brandDark}" font-weight="700">MARGE, DEPUTY HEAD OF ADMISSIONS</text>

  <g transform="translate(45 300)">${marge(mood, 480)}</g>
  ${cups(cupCount, 118, 800, 1.6)}

  <rect x="90" y="880" width="1020" height="4" fill="rgba(255,255,255,0.25)"/>

  <text x="90" y="962" font-family="${FONT}" font-size="40" fill="#fff" font-weight="600">Every decision lands three months late.</text>
  <text x="90" y="1018" font-family="${FONT}" font-size="40" fill="rgba(255,255,255,0.88)">The forecast lies to you until August.</text>

  ${pips(6, 90, 1074, 74, 14)}

  <text x="90" y="1152" font-family="${FONT}" font-size="31" fill="#fff" font-weight="700">confirmationbias.netlify.app</text>
</svg>`,
})

const POSTERS: Poster[] = [
  ...SQUARE_MOODS.map((m) => square(m.mood, m.cups, m.name)),
  {
    // LinkedIn link-preview landscape.
    name: 'poster-landscape',
    w: 1200,
    h: 627,
    build: () => `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="627" viewBox="0 0 1200 627">
  <rect width="1200" height="627" fill="${PALETTE.brand}"/>

  <g transform="translate(40 175)">${marge('frazzled', 330)}</g>
  ${cups(3, 108, 520, 1.2)}

  <text x="415" y="132" font-family="${FONT}" font-size="22" letter-spacing="6"
    fill="rgba(255,255,255,0.85)" font-weight="600">TEN TURNS. ONE ADMISSIONS CYCLE.</text>
  <text x="415" y="212" font-family="${FONT}" font-size="66" letter-spacing="4"
    fill="#fff" font-weight="700">${TITLE}</text>

  <text x="415" y="300" font-family="${FONT}" font-size="34" fill="#fff" font-weight="600">Every decision lands three months late.</text>
  <text x="415" y="350" font-family="${FONT}" font-size="34" fill="rgba(255,255,255,0.88)">The forecast lies to you until August.</text>

  ${pips(6, 415, 410, 58, 11)}

  <text x="415" y="520" font-family="${FONT}" font-size="28" fill="#fff" font-weight="700">confirmationbias.netlify.app</text>
</svg>`,
  },
]

for (const poster of POSTERS) {
  const svg = poster.build()
  await sharp(Buffer.from(svg)).png().toFile(`${OUT}/${poster.name}.png`)
  console.log(`${OUT}/${poster.name}.png  ${poster.w}x${poster.h}`)
}
