import { useEffect, useState } from "react";
import { flow } from "@/lib/flow";

/**
 * The `--hero-out` value the copy's fade finishes at. Kept in step with the `.hero-flow` window in
 * styles.css: past this the copy is at opacity 0 and must be unreachable.
 */
const FADE_DONE = 0.4;

export function ScrollRoot() {
  // Observed, not sampled once. Turning Reduce Motion on mid-session used to leave this effect
  // still inerting the hero copy that the reduced-motion stylesheet was simultaneously holding at
  // opacity 1 — visible text, unreachable by keyboard, until a reload.
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;

    // Strict read-then-write. Interleaved, the `--scroll` write invalidated an inherited custom
    // property for the whole document and every getBoundingClientRect() after it forced a fresh
    // recalc plus layout, twice per scrolled frame.
    const update = () => {
      /* ---- reads ---- */
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = Math.max(document.documentElement.scrollHeight - vh, 1);
      const hero = document.getElementById("top");
      const copy = document.getElementById("hero-copy");
      const heroRect = hero ? hero.getBoundingClientRect() : null;
      const copyRect = copy ? copy.getBoundingClientRect() : null;

      /* ---- compute ---- */
      const next = Math.min(Math.max(y / max, 0), 1);
      if (!reduced) flow.vel = flow.vel * 0.82 + (y - lastY) * 0.18;
      lastY = y;
      flow.y = y;
      flow.progress = next;

      // The hero is taller than the viewport and pins its copy; heroOut is the pinned travel,
      // which is the timeline the three WebGL beats are cut against.
      if (heroRect) {
        const travel = Math.max(heroRect.height - vh, 1);
        flow.heroOut = Math.min(Math.max(-heroRect.top / travel, 0), 1);
        // How far past the pinned run we are, in viewports: the scene uses it to shrink and dim
        // the galaxy behind the reading sections instead of sitting on top of the copy.
        flow.heroPast = Math.min(Math.max((-heroRect.top - travel) / vh, 0), 1);
        // While the hero is at rest the copy is untransformed, so this is its true resting top.
        // The WebGL fit solve uses it to size the sphere into the free band above the headline.
        // Floored barely off zero: a 0.28 floor reported a 640px-tall phone's copy as starting
        // 179px down when it really starts at 77, and the fit solve sized a ball for room that
        // was not there.
        if (flow.heroOut < 0.02 && copyRect) {
          // Guarded: vh 0 (zero-size iframe, some bfcache restores) makes this 0/0 = NaN, which
          // would poison the WebGL fit solve downstream and hide the sphere for good.
          const t = vh > 0 ? copyRect.top / vh : NaN;
          if (Number.isFinite(t)) flow.copyTop = Math.min(Math.max(t, 0.04), 0.95);
        }
      } else if (copyRect) {
        const start = vh * 0.72;
        const end = vh * 0.08;
        flow.heroOut = Math.min(Math.max((start - copyRect.bottom) / (start - end), 0), 1);
      } else {
        flow.heroOut = y > vh * 0.55 ? 1 : 0;
      }

      /* ---- writes ---- */
      const root = document.documentElement.style;
      root.setProperty("--scroll", next.toFixed(4));
      root.setProperty("--hero-out", flow.heroOut.toFixed(4));
      // The copy fades out under the detonation (see .hero-flow). At opacity 0 it must leave the
      // tab order and the accessibility tree too, not just the hit test — `inert` does all three
      // in one property, where pointer-events alone left both CTAs Tab-reachable and invisible.
      const gone = !reduced && flow.heroOut > FADE_DONE;
      if (copy) {
        const want = gone ? "none" : "";
        if (copy.style.pointerEvents !== want) copy.style.pointerEvents = want;
        if (copy.inert !== gone) copy.inert = gone;
      }
    };

    // A continuous rAF, not a scroll listener. The listener version drops updates — a scroll that
    // ends between two frames can leave `flow` a step behind, which freezes the whole WebGL
    // sequence in the wrong pose. The idle cost is one scrollY read per frame; the real work only
    // runs when the position actually moved or the viewport was resized.
    let dirty = true;
    let seenY = -1;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      const y = window.scrollY;
      if (!dirty && y === seenY) return;
      seenY = y;
      dirty = false;
      update();
    };

    const onResize = () => {
      dirty = true;
    };
    update();
    frame = requestAnimationFrame(loop);
    window.addEventListener("resize", onResize, { passive: true });

    // `dirty` is the only thing that re-reads the copy's box. Without these two, a cold cache
    // where hydration beats the webfont swap measured the hero against fallback metrics once and
    // never again — the sphere would stay sized to a headline that no longer exists.
    document.fonts?.ready.then(onResize).catch(() => {});
    const copy = document.getElementById("hero-copy");
    const ro = copy ? new ResizeObserver(onResize) : null;
    if (copy && ro) ro.observe(copy);

    return () => {
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <div
      className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-skip h-0.5 bg-primary"
      aria-hidden="true"
    />
  );
}
