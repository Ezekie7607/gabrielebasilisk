import { useI18n } from "@/lib/locale";

/**
 * Section 02. This used to be a works gallery; the owner removed the work items and asked for
 * scroll-driven SVG compositions in their place, so the section demonstrates the craft directly
 * instead of pointing at past projects. Reference source was meant to be Mobbin, which is gated
 * behind a login (verified HTTP 403 anonymously), so the compositions follow the researched
 * scroll-animation catalogue instead: staggered line draws, scrubbed by the viewport.
 *
 * All strokes carry pathLength={1} so the .svg-draw dash math works in normalised units, and the
 * three .draw-* classes only vary the animation-range, which is what staggers the choreography.
 * Everything degrades to finished, static line art without view-timeline support or with reduced
 * motion, exactly like the rest of the page.
 */

/** Deterministic pseudo-scatter for the weave stagger; no Math.random so SSR and client agree. */
const scatter = (i: number) => ((i * 7) % 5) + 1;

function Weave() {
  const verticals = Array.from({ length: 11 }, (_, i) => (i + 1) * 8);
  const horizontals = Array.from({ length: 5 }, (_, i) => (i + 1) * 15);
  return (
    <svg
      viewBox="0 0 96 90"
      preserveAspectRatio="xMidYMid slice"
      className="block h-full w-full"
      fill="none"
    >
      {verticals.map((x, i) => (
        <line
          key={`v${x}`}
          x1={x}
          y1="0"
          x2={x}
          y2="90"
          stroke="currentColor"
          strokeWidth="0.5"
          pathLength={1}
          className={`svg-draw draw-${(i % 3) + 1} text-border`}
        />
      ))}
      {horizontals.map((y, i) => (
        <line
          key={`h${y}`}
          x1="0"
          y1={y}
          x2="96"
          y2={y}
          stroke="currentColor"
          strokeWidth="0.5"
          pathLength={1}
          className={`svg-draw draw-${((i + scatter(i)) % 3) + 1} text-muted`}
        />
      ))}
      <line
        x1="0"
        y1="90"
        x2="96"
        y2="0"
        stroke="currentColor"
        strokeWidth="1.1"
        pathLength={1}
        className="svg-draw draw-3 text-primary"
      />
    </svg>
  );
}

function Orbits() {
  const rings = [10, 18, 26, 34, 42];
  return (
    <svg
      viewBox="0 0 96 90"
      preserveAspectRatio="xMidYMid slice"
      className="block h-full w-full"
      fill="none"
    >
      {rings.map((r, i) => (
        <circle
          key={r}
          cx="48"
          cy="45"
          r={r}
          stroke="currentColor"
          strokeWidth="0.5"
          pathLength={1}
          className={`svg-draw draw-${(i % 3) + 1} ${i === 2 ? "text-muted" : "text-border"}`}
        />
      ))}
      <circle cx="48" cy="45" r="1.6" fill="currentColor" className="text-primary" />
      <line
        x1="48"
        y1="45"
        x2="90"
        y2="12"
        stroke="currentColor"
        strokeWidth="0.8"
        pathLength={1}
        className="svg-draw draw-3 text-primary"
      />
    </svg>
  );
}

function Signal() {
  const wave = Array.from({ length: 25 }, (_, i) => {
    const x = i * 4;
    const y = 45 + Math.sin(i / 2.2) * (((i * 11) % 17) / 10) * 16;
    return `${x},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg
      viewBox="0 0 96 90"
      preserveAspectRatio="xMidYMid slice"
      className="block h-full w-full"
      fill="none"
    >
      <line
        x1="0"
        y1="45"
        x2="96"
        y2="45"
        stroke="currentColor"
        strokeWidth="0.4"
        pathLength={1}
        className="svg-draw draw-1 text-border"
      />
      <polyline
        points={wave}
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinejoin="round"
        pathLength={1}
        className="svg-draw draw-2 text-fg"
      />
      <line
        x1="72"
        y1="0"
        x2="72"
        y2="90"
        stroke="currentColor"
        strokeWidth="0.6"
        pathLength={1}
        className="svg-draw draw-3 text-primary"
      />
    </svg>
  );
}

const PANELS = [Weave, Orbits, Signal];

export function MotionGallery() {
  const { t } = useI18n();
  return (
    <section id="work" tabIndex={-1} className="outline-none" aria-labelledby="work-title">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <p className="flow-in font-pixel text-micro tracking-widest text-muted">
          {t.motion.kicker}
        </p>
        <h2 id="work-title" className="flow-in mt-4 max-w-3xl leading-tight text-fg">
          <span className="reveal-slot block">
            <span className="reveal-line block font-display text-section text-muted">
              {t.motion.titleA}
            </span>
          </span>
          <span className="reveal-slot block">
            <span className="reveal-line block font-display text-section">{t.motion.titleB}</span>
          </span>
        </h2>
        <p className="flow-in-late mt-5 max-w-xl text-base leading-normal text-muted">
          {t.motion.body}
        </p>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-grid bg-grid lg:grid-cols-3">
          {PANELS.map((Panel, i) => (
            <div
              key={i}
              aria-hidden="true"
              className={`aspect-[16/10] bg-bg p-2 ${i % 2 === 0 ? "flow-in" : "flow-in-late"}`}
            >
              <Panel />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
