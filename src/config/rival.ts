/**
 * CONFIRMATION BIAS - the provider down the road.
 *
 * Recruitment is zero-sum and everybody knows who they are losing to. The
 * rival exists so the world pushes back rather than only raining on you: they
 * take the calls you are too slow to answer, and they move first when it suits
 * them.
 *
 * The name is invented and signed off. If a real provider ever turns out to
 * be called this, it changes in one line here.
 */

export const RIVAL = {
  name: 'Northgate Met',
  formal: 'Northgate Metropolitan',
  /** What the tannoy says when they beat you to something. */
  lostLine: (what: string) => `${what} went to Northgate Met.`,
} as const
