/**
 * Frame-shared scroll state. Written once per frame by ScrollRoot, read by the WebGL
 * orchestrator. Module scope on purpose: no React state, no re-render, no allocation per frame.
 */
export const flow = {
  /** Whole-document scroll, 0..1. */
  progress: 0,
  y: 0,
  vel: 0,
  /** Pinned-hero travel, 0..1 — the timeline the three WebGL beats are cut against. */
  heroOut: 0,
  /** Viewports scrolled past the end of the hero, 0..1. */
  heroPast: 0,
  /** Top of the hero copy block as a fraction of viewport height, measured while pinned at rest. */
  copyTop: 0.52,
};

/**
 * The three scroll-driven beats of the hero. Each is an independently eased 0..1 value so the
 * scene can overlap them (the galaxy starts fading up while the blast front is still expanding)
 * instead of hard-cutting between states.
 */
export const phase = {
  /** Beat B — the woven shell accelerates its spin and compresses to a point. */
  implode: 0,
  /** Beat C — the compressed point detonates outward. */
  explode: 0,
  /** Beat D — the galaxy takes the frame. */
  galaxy: 0,
  /** Flash spike at the instant of detonation, between implode and explode. */
  flash: 0,
};

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

export function clamp01(x: number) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

/**
 * Scroll windows for the three beats, as fractions of `flow.heroOut`. They overlap on purpose:
 * the galaxy begins gathering while the blast front is still travelling outward.
 */
export const BEATS = {
  implodeEnd: 0.38,
  // Deliberately BEFORE implodeEnd. Cut end-to-end, the two beats left a stretch of scroll with
  // nothing on screen but a 40px dot; overlapped, the shell is already tearing open while the
  // last of it is still falling in and the frame is never empty.
  explodeStart: 0.33,
  // Stretched from 0.62. The hero pins 200svh — one full viewport of travel — and ending the
  // ejection at 0.62 left the last 1240px of that pin showing one frozen picture. The blast now
  // runs to 0.72 and the camera keeps pushing in past it (see DOLLY_TAIL), so the pinned scroll
  // pays all the way down.
  explodeEnd: 0.72,
  galaxyStart: 0.56,
  galaxyEnd: 1,
} as const;

/**
 * Advances the three beats toward their scroll targets. Not a straight assignment: the damped
 * follow is what turns a jittery wheel into a continuous collapse, and it is also what gives the
 * detonation a beat of its own instead of snapping with the scrollbar. Under
 * `prefers-reduced-motion` the follow is dropped for a hard cut, so the reader gets the sphere or
 * the galaxy and never the animation between them.
 */
export function tickPhase(delta: number, reduced: boolean) {
  const d = Math.min(delta, 0.1);
  const h = flow.heroOut;
  const targetImplode = clamp01(h / BEATS.implodeEnd);
  const targetExplode = clamp01((h - BEATS.explodeStart) / (BEATS.explodeEnd - BEATS.explodeStart));
  const targetGalaxy = clamp01((h - BEATS.galaxyStart) / (BEATS.galaxyEnd - BEATS.galaxyStart));
  if (reduced) {
    phase.implode = 0;
    phase.explode = h > BEATS.explodeStart ? 1 : 0;
    phase.galaxy = h > BEATS.explodeStart ? 1 : 0;
    phase.flash = 0;
    return;
  }
  const k = 1 - Math.exp(-7.5 * d);
  phase.implode += (targetImplode - phase.implode) * k;
  phase.explode += (targetExplode - phase.explode) * k;
  phase.galaxy += (targetGalaxy - phase.galaxy) * k;
  // Ramps across the back half of the collapse rather than spiking at the very end: that stretch
  // is where the shell is already too small to read, and a point brightening into a star is what
  // carries the frame there instead of a black field with a dot in it. Dies as the front leaves.
  phase.flash = smoothstep(0.52, 1, phase.implode) * (1 - smoothstep(0.04, 0.24, phase.explode));
}
