/**
 * Deterministic randomness.
 *
 * Everything stochastic in CYCLE is derived from the run seed plus a label, so
 * a React re-render never resamples anything. Same seed, same choices, same
 * cycle, every time. That also makes the headless harness reproducible.
 */

export function mulberry32(a: number): () => number {
  let t = a >>> 0
  return function () {
    t = (t + 0x6d2b79f5) >>> 0
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

/** Stable string hash, so we can derive a stream from seed plus a label. */
export function hashLabel(seed: number, label: string): number {
  let h = seed >>> 0
  for (let i = 0; i < label.length; i++) {
    h = Math.imul(h ^ label.charCodeAt(i), 0x01000193) >>> 0
  }
  return h >>> 0
}

/** A single reproducible uniform draw for a given seed and label. */
export function draw(seed: number, label: string): number {
  return mulberry32(hashLabel(seed, label))()
}

/** A single reproducible standard normal draw, via Box-Muller. */
export function drawNormal(seed: number, label: string): number {
  const r = mulberry32(hashLabel(seed, label))
  const u = Math.max(r(), 1e-9)
  const v = r()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
