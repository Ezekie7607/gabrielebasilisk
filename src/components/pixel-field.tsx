import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { BEATS, flow, phase, smoothstep, tickPhase } from "@/lib/flow";
import type { SphereBeat } from "./woven-sphere";

const WovenSphere = lazy(() => import("./woven-sphere"));
const TwinGalaxyRings = lazy(() => import("./twin-galaxy-rings"));

/**
 * Fraction of the WovenSphere canvas its silhouette actually covers at scale 67. Derived from the
 * component's own framing solve — the ball's half-angle in NDC is focal·R/√(d²−R²), which at the
 * shipped Bands/Depth/Thickness works out to 0.62 of the canvas height. The layout needs it to
 * size the canvas from the ball rather than the other way round.
 */
const BALL_IN_BOX = 0.62;
/** Vertical room kept clear for the nav, px. */
const NAV_CLEAR = 78;
/** Breathing room between the bottom of the ball and the top of the copy, px. */
const COPY_CLEAR = 18;
const MAX_BALL = 560;
/** Absolute floor. Below this the weave stops reading as a weave, so the layer is better hidden. */
const MIN_BALL = 108;

/** Camera-distance multiplier the galaxy is born at — far away, so it grows into the frame. */
const DOLLY_BORN = 2.6;
/**
 * Where the galaxy settles once the blast is spent. At the old 0.84 (≈4100 world units) the disc
 * spanned only y 330–620 of a 900px viewport with ~240px of dead black down both sides — a lozenge
 * in a black frame, not a hero. Pulled in here the arms run off all four edges.
 */
const DOLLY_REST = 0.56;
/**
 * The camera keeps creeping in across the rest of the pinned hero. Without it the last ~1200px of
 * the pin showed one frozen picture. TwinGalaxyRings clamps distance at RMAX·cos(pitch)+400, so
 * the tail cannot push the camera through the disc however low this goes.
 */
const DOLLY_TAIL = 0.46;
/**
 * How far the galaxy dims a viewport past the hero. Cut from 0.1 once the camera came in: at the
 * new framing the bulge sits dead centre of the viewport and 10% of it printed a 20/255 smudge
 * across the Doctrine, Arsenal and Contact body copy against a 1.6/255 corner. At 0.025 the same
 * patch reads within a few levels of the corner and the disc survives only as a suggestion.
 */
const BG_FLOOR = 0.025;
/** Residual core glow held after the blast, so the imploded point survives as the galactic bulge. */
const CORE_HOLD = 0.7;
/** How far that residual shrinks from the blast flash. The bulge is a nucleus, not a wash. */
const CORE_SHRINK = 0.78;
/**
 * Ceiling on the galaxy under `prefers-reduced-motion`. There the hero copy never fades (see the
 * reduced-motion block in styles.css), so the dot field and the headline are permanently
 * superimposed. At the old 0.42 the background under the kicker measured 100/255 and the line was
 * unreadable; this keeps it under 25/255 and the brightest dot beside the mobile lead under
 * rgb(35), which holds the muted text above 4.5:1.
 */
const RM_GALAXY = 0.07;
/**
 * Past this many viewports beyond the hero the galaxy is a static 2.5% texture behind body copy —
 * 61k additive points a frame buys nothing there, so the loop parks on its last drawn frame.
 */
const GALAXY_PARK = 0.9;

type Geometry = { ball: number; box: number; centerY: number; fits: boolean };

/**
 * Drag-to-spin is a mouse affordance. On touch the ball owns most of the hero, and `touchAction:
 * none` on its host would eat the very scroll the whole narrative is driven by.
 */
const FINE_POINTER = "(hover: hover) and (pointer: fine)";

function measure(): Geometry {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // flow.copyTop is the resting top of the hero copy, measured by ScrollRoot. Sizing the ball
  // from it is what keeps the sphere clear of the headline at every breakpoint without a stack
  // of media queries.
  const top = NAV_CLEAR;
  // The band is whatever the copy leaves, never more, and it is NOT floored. Clamping it up to
  // MIN_BALL is what drove the ball straight through the headline on a 360×640 phone, where the
  // stacked copy starts 77px down and leaves no band at all.
  const bottom = flow.copyTop * vh - COPY_CLEAR;
  const band = bottom - top;
  const ball = Math.min(band * 0.96, vw * 0.86, MAX_BALL);
  // MIN_BALL is a hide threshold, not a floor: below it the weave stops reading as a weave, and
  // the only honest move is to drop the layer rather than park it on top of the copy.
  const fits = Number.isFinite(ball) && ball >= MIN_BALL;
  const safe = fits ? ball : MIN_BALL;
  // With no band there is no ball to travel, so the flash simply starts where the galaxy's core
  // will be. A band/2 off a negative band would put it above the nav.
  const centerY = fits ? top + band / 2 : vh * 0.5;
  return { ball: safe, box: safe / BALL_IN_BOX, centerY, fits };
}

/**
 * Orchestrator for the two supplied WebGL looks. It owns no geometry of its own: it sizes and
 * centres the sphere against the hero copy, drives both components from `flow`/`phase`, and paints
 * the single core flash that bridges them — sphere, implosion, detonation, galaxy.
 *
 * There is deliberately no shockwave ring and no expanding outline of any kind. The blast reads
 * only through that flash and the ejected weave itself, whose paths curl into the galaxy's arms.
 */
export default function PixelField() {
  const [client, setClient] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [galaxyOn, setGalaxyOn] = useState(false);

  const geoRef = useRef<Geometry>({ ball: 320, box: 516, centerY: 300, fits: true });
  const stageRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const galaxyRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  // One mutable sample object, handed to the sphere every frame — no per-frame allocation.
  const beat = useRef<SphereBeat>({ implode: 0, explode: 0, active: true }).current;
  const gates = useRef({ sphere: true, galaxy: false, dolly: DOLLY_BORN });

  const sampleBeat = useCallback(() => {
    beat.implode = phase.implode;
    beat.explode = phase.explode;
    beat.active = gates.current.sphere;
    return beat;
  }, [beat]);
  const galaxyActive = useCallback(() => gates.current.galaxy, []);
  const galaxyDolly = useCallback(() => gates.current.dolly, []);
  // Whole-page scroll, not the host rect: the host is a fixed full-screen layer, so its rect
  // never moves and the component's own reading would sit frozen at 0.5 forever.
  const galaxyProgress = useCallback(() => flow.progress, []);

  // Sampled AND observed. A reader who turns Reduce Motion on mid-session — the usual response to
  // an effect making them feel unwell — used to keep the full implode/detonate run until reload.
  useEffect(() => {
    setClient(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // The galaxy costs ~40k points to build. Defer it past first paint so the hero's LCP is not
  // paying for a layer that is invisible until the blast, but build it well before it is needed.
  useEffect(() => {
    if (!client) return;
    let cancelled = false;
    const arm = () => {
      if (!cancelled) setGalaxyOn(true);
    };
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(arm, { timeout: 1800 })
      : window.setTimeout(arm, 900);
    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [client]);

  useEffect(() => {
    if (!client) return;
    const stage = stageRef.current;
    const sphere = sphereRef.current;
    const galaxy = galaxyRef.current;
    const flash = flashRef.current;
    if (!stage) return;

    // Declared above `layout` on purpose: every caller of layout() has to re-arm the reduced-motion
    // park, not just the resize listener. layout() rewrites the stage box, which trips both
    // canvases' ResizeObservers, and reassigning canvas.width reallocates and CLEARS the WebGL
    // drawing buffer. With the loops already parked the frame never came back and the sphere was
    // gone for good — the ordinary cold-load path, since `document.fonts.ready` resolves well past
    // the 500ms park on six font-display:swap faces.
    let lastChange = performance.now();

    // The copyTop/viewport this geometry was built from, plus per-frame caches so tick never
    // reads window.inner* right after ScrollRoot's style writes (that forced a full style+layout
    // flush every frame). tick re-runs layout() whenever ScrollRoot publishes a fresh copyTop —
    // that closes the resize race where our synchronous resize handler measured against the
    // PREVIOUS viewport's copyTop and drew the ball through the headline.
    let builtCopyTop = -1;
    let vhCache = window.innerHeight;
    let narrowCache = window.innerWidth < 640;

    const layout = () => {
      lastChange = performance.now();
      vhCache = window.innerHeight;
      narrowCache = window.innerWidth < 640;
      builtCopyTop = flow.copyTop;
      const geo = measure();
      geoRef.current = geo;
      stage.style.width = `${geo.box}px`;
      stage.style.height = `${geo.box}px`;
      if (flash) {
        // A compact star, not a fog. Sized off the ball so it reads as the ball's own core going
        // critical; anything wider washes the whole frame grey.
        flash.style.width = `${geo.ball * 0.8}px`;
        flash.style.height = `${geo.ball * 0.8}px`;
      }
    };
    layout();
    // The copy is measured by ScrollRoot on its own first pass; re-read once the fonts and the
    // entry animation have settled so the ball is sized against the real headline. ScrollRoot
    // re-measures on the same signals, so by the time these fire flow.copyTop is current.
    const settle = window.setTimeout(layout, 700);
    document.fonts?.ready.then(() => window.setTimeout(layout, 60)).catch(() => {});

    const fineMq = window.matchMedia(FINE_POINTER);
    let fine = fineMq.matches;
    const onPointerKind = () => {
      fine = fineMq.matches;
    };
    fineMq.addEventListener("change", onPointerKind);
    let raf = 0;
    let last = performance.now();
    let prevGalaxyOn = false;
    let seenImplode = -1;
    let seenExplode = -1;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      tickPhase(dt, reduced);

      const ex = phase.explode;
      // The dots burn out in the shader across the ejection; the layer opacity only closes the
      // tail so nothing lingers on top of the galaxy. Closed at 0.9 rather than 0.99: `explode` is
      // a damped follow that settles just short of 1, so the last percent of the sphere never went
      // away — and the sphere blends source-over, so its dark trailing dots OCCLUDED the galaxy
      // and left a ragged black clump sitting in the middle of the bulge.
      const sphereAlpha = 1 - smoothstep(0.72, 0.9, ex);
      // Lit early and overlapped generously: the galaxy is already under the streaks while they
      // are still flying, so the eye never sees a cross-fade through black.
      // Held off the first sliver of the ejection so the debris is visibly out of the core before
      // the arms light — lit from frame zero, the burst read as rings materialising around an
      // intact ball. Then it comes up fast, well before the streaks have burned out.
      const born = smoothstep(0.06, 0.34, ex);
      // Reduced motion is not just "no tween": the copy also never fades there, so whatever the
      // galaxy is lit at is lit BEHIND live body text for the whole hero. Capped hard (see
      // RM_GALAXY) instead of the animated path's full strength.
      const galaxyAlpha = reduced ? (ex > 0.5 ? RM_GALAXY : 0) : born;
      // Dimmed behind the reading sections in BOTH paths. Skipping this under reduced motion left
      // body copy printed on a full-strength dot field, which is a contrast failure aimed squarely
      // at the readers who asked for less motion.
      const bg = 1 - (1 - BG_FLOOR) * flow.heroPast;

      // The blast has to go off exactly where the galaxy's core will be, or the two canvases read
      // as two objects. The travel is gated on the copy's own fade window (see .hero-flow) rather
      // than on implode: driven from the first frame, the ball rode down THROUGH the motto and the
      // headline while both were still legible.
      // ScrollRoot refreshes flow.copyTop on its own rAF after a resize/font swap; the moment it
      // lands, rebuild the geometry so the ball is never sized against a stale viewport.
      if (flow.copyTop !== builtCopyTop) layout();
      const geo = geoRef.current;
      const vh = vhCache;
      // Later and shorter on phones. There the copy owns the middle of the frame, and the desktop
      // 0.16→0.40 window sent the collapsing star down across a kicker that was still at 79%
      // opacity. Started at 0.30 the ball holds its band until the copy is more than half gone.
      const narrow = narrowCache;
      const drift = reduced
        ? 0
        : narrow
          ? smoothstep(0.3, 0.46, flow.heroOut)
          : smoothstep(0.16, 0.4, flow.heroOut);
      stage.style.top = `${geo.centerY + (vh * 0.5 - geo.centerY) * drift}px`;

      if (sphere) {
        sphere.style.opacity = (geo.fits ? sphereAlpha : 0).toFixed(3);
        // Draggable only while the ball is at rest, and only under a mouse: on touch the hit area
        // would swallow the scroll that drives the whole sequence.
        const grabbable = geo.fits && fine && phase.implode < 0.12 && sphereAlpha > 0.9;
        sphere.style.pointerEvents = grabbable ? "auto" : "none";
      }
      if (galaxy) galaxy.style.opacity = (galaxyAlpha * bg).toFixed(3);
      // The residual core has to DIE with the hero, not floor with `bg`. Floored, the flash div
      // rode the fixed layer at viewport centre for the whole page and printed a 28/255 smudge
      // across the Doctrine, Arsenal and Contact body copy against a 1/255 corner. Past the hero
      // the galaxy's own bulge is the only nucleus.
      const alive = 1 - smoothstep(0, 0.35, flow.heroPast);
      if (flash) {
        // Two lives. First the collapse going critical, then — once the ejecta has burned out — a
        // low residual that stays as the galaxy's bulge, so the imploded point becomes the core
        // instead of evaporating and leaving a hole where it used to be.
        const coreK = smoothstep(0.55, 0.95, ex);
        // Zero under reduced motion. There the stage never drifts (the copy is still in the
        // frame), so a lit core parked a bright disc alone in mid-hero ~200px above the galaxy —
        // exactly the stranded halo this scene is not allowed to have.
        const core = reduced ? 0 : coreK * CORE_HOLD * bg * alive;
        const lit = reduced ? 0 : Math.max(phase.flash, core);
        flash.style.opacity = lit.toFixed(3);
        // The detonation flash is the whole core going critical, at full size. What survives is
        // a nucleus: same gradient, pulled in hard so it reads as a dense bulge and not a wash.
        // The `scale` property, never `transform`: Tailwind v4 centres this element with the
        // separate `translate` property, and a transform of translate(-50%,-50%) composes with
        // it instead of replacing it — which pushed the core a full radius up and to the left.
        flash.style.scale = (1 - coreK * CORE_SHRINK).toFixed(3);
      }

      // A camera dolly, not a CSS scale: scaling the layer would clip the canvas and expose its
      // rectangle. Eased out so the galaxy decelerates into its resting framing.
      const settleK = 1 - Math.pow(1 - smoothstep(0, 0.8, ex), 2.2);
      // Two legs. The blast pulls the camera in from far away; then it keeps creeping across the
      // rest of the pinned hero so the last viewport of scroll is not one frozen picture.
      const tailK = reduced ? 1 : smoothstep(BEATS.explodeEnd, 1, flow.heroOut);
      const rest = DOLLY_REST + (DOLLY_TAIL - DOLLY_REST) * tailK;
      gates.current.dolly = reduced ? DOLLY_TAIL : DOLLY_BORN + (rest - DOLLY_BORN) * settleK;

      gates.current.sphere = geo.fits && sphereAlpha > 0.004;
      // Parked past the hero as well as on alpha. `bg` floors at BG_FLOOR, so the alpha test alone
      // was permanently true and every scroll position in every reading section below the hero was
      // paying a full 61k-point additive draw for a texture nobody can see. Skipping the frame
      // leaves the last one on the canvas, so the layer looks identical — it just stops costing.
      gates.current.galaxy = galaxyAlpha * bg > 0.004 && flow.heroPast < GALAXY_PARK;
      if (reduced) {
        // Nothing is animating, so the two loops only need to run long enough to redraw after a
        // scroll or a resize changes something. Then they park.
        if (phase.implode !== seenImplode || phase.explode !== seenExplode) {
          seenImplode = phase.implode;
          seenExplode = phase.explode;
          lastChange = now;
        }
        const settling = now - lastChange < 500;
        gates.current.sphere = gates.current.sphere && settling;
        gates.current.galaxy = gates.current.galaxy && settling;
      }

      // The sphere is never unmounted. It used to be dropped past the blast, which destroyed its
      // <canvas> without calling loseContext(), so every scroll down-and-back-up stranded another
      // WebGL context waiting on GC of a detached canvas — and Chrome force-loses the oldest live
      // context past ~16 per page, the galaxy's included. `gates.current.sphere` already does zero
      // GL work when it is dark, which is all the saving the mount gate was ever buying.
      if (!prevGalaxyOn && flow.heroOut > 0.15) {
        prevGalaxyOn = true;
        setGalaxyOn(true);
      }
    };
    raf = requestAnimationFrame(tick);

    const onResize = () => {
      layout();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      window.removeEventListener("resize", onResize);
      fineMq.removeEventListener("change", onPointerKind);
    };
  }, [client, reduced]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-bg" aria-hidden="true">
      <div ref={galaxyRef} className="absolute inset-0 opacity-0 will-change-[opacity]">
        {client && galaxyOn ? (
          <Suspense fallback={null}>
            <TwinGalaxyRings
              background="transparent"
              colors={["#F8F8F8"]}
              // Sample count per arm; the component draws armCount x density x 8 x 8 points, so
              // 240 is 61,440 points on desktop and 210 is 53,760 on a phone. Both are deliberate: the
              // camera now sits close enough that the arms cover the whole frame, and below this
              // the outer turns resolve as separately countable dots rather than a disc.
              density={typeof window !== "undefined" && window.innerWidth < 768 ? 210 : 240}
              dotSize={1.9}
              speed={reduced ? 0 : 42}
              armCount={4}
              // The scatter each arm gets across its own path. Fat enough that consecutive turns
              // bleed into one another rather than reading as a stack of closed rings, thin
              // enough that the four arms stay separable now the camera sits close.
              armThickness={72}
              // The spiral's inner terminus, as a percentage of the outer radius — in other
              // words the radius of the hole at dead centre. It was 3 when the camera sat far
              // back and the hole was a couple of pixels; at the new framing the same 3 punched
              // a ~60px black bite out of the middle of the bulge. What is left here is covered
              // by the blast's residual core (CORE_HOLD), which is exactly the imploded point
              // the whole sequence is supposed to leave behind.
              innerVoid={1.5}
              distance={4900}
              // Screen height of the disc is RMAX x sin(tilt); at the shipped 23 degrees it was
              // foreshortened to a third of the viewport however close the camera came. Opened up
              // so the arms run off the top and bottom edges as well as the sides.
              tilt={{ tilt: 34, sideTilt: -7, tiltEnd: 46, sideTiltEnd: -2 }}
              progress={galaxyProgress}
              active={galaxyActive}
              dolly={galaxyDolly}
              style={{ position: "absolute", inset: 0 }}
            />
          </Suspense>
        ) : null}
      </div>

      <div ref={stageRef} className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          ref={flashRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 will-change-[opacity]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 8%, rgba(255,255,255,0.22) 24%, rgba(255,255,255,0.05) 44%, rgba(255,255,255,0) 68%)",
          }}
        />
        <div ref={sphereRef} className="absolute inset-0">
          {client ? (
            <Suspense fallback={null}>
              <WovenSphere
                background="transparent"
                baseColor="#ffffff"
                density={5}
                dotSize={34}
                scale={67}
                speed={reduced ? 0 : 100}
                drag={reduced ? 0 : 200}
                beat={sampleBeat}
                style={{ position: "absolute", inset: 0 }}
              />
            </Suspense>
          ) : null}
        </div>
      </div>
    </div>
  );
}
