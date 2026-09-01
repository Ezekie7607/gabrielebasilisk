import { ArrowDownRight } from "lucide-react";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/locale";

/**
 * The hero is two viewports tall and pins its copy for the whole run, which is the scroll room
 * the three WebGL beats need: the sphere implodes, detonates, then settles into the galaxy while
 * the reader is still inside this section. `#top` is what scroll-root measures for flow.heroOut.
 *
 * Every vertical gap below is tighter on phones than on desktop. That is not cosmetic: the copy is
 * bottom-anchored in an `h-svh` box, so its height IS the free band the WebGL orchestrator sizes
 * the sphere into. At desktop spacing a 375x667 phone once left an 8px band and the hero lost its
 * object completely, so anything added to this block is taken straight off the sphere.
 */
export function Hero() {
  const { t } = useI18n();
  return (
    <section id="top" className="relative min-h-[200svh]">
      <div className="sticky top-0 flex h-svh flex-col justify-end overflow-hidden">
        <div className="copy-veil pointer-events-none absolute inset-x-0 bottom-0 h-[62%]" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-9 pt-24 sm:px-6 sm:pb-12">
          <div id="hero-copy" className="hero-flow relative mx-auto w-full max-w-3xl text-center">
            {/* Each block carries .hero-fall with its own --i (drop stagger) and --r (rotation
                scatter): as --hero-fade runs 0..1 the lines detach on separate arcs instead of the
                copy leaving as one slab. Values are small on purpose; the WebGL detonation is the
                spectacle, the text just gets out of its way with intent. */}
            <p className="font-script stagger-in text-[clamp(1.4rem,3.4vw,2.15rem)] text-fg">
              <span
                className="hero-fall block"
                style={{ "--i": 0, "--r": -3 } as CSSProperties}
              >
                {t.hero.motto}
              </span>
            </p>
            <h1 className="stagger-in mt-2 text-balance font-display text-hero leading-display text-fg">
              <span
                className="hero-fall block"
                style={{ "--i": 1, "--r": 2 } as CSSProperties}
              >
                {t.hero.h1a} {t.hero.h1b}
              </span>
              <span
                className="hero-fall block"
                style={{ "--i": 2, "--r": -2 } as CSSProperties}
              >
                <span className="text-muted">{t.hero.h1c}</span> {t.hero.h1d}
              </span>
            </h1>
            <p className="stagger-in mx-auto mt-5 max-w-xl text-base leading-normal text-muted">
              <span
                className="hero-fall block"
                style={{ "--i": 3, "--r": 1 } as CSSProperties}
              >
                {t.hero.lead}
              </span>
            </p>
            <div className="stagger-in mt-5 sm:mt-7">
              <div
                className="hero-fall flex flex-wrap items-center justify-center gap-3"
                style={{ "--i": 4, "--r": -1 } as CSSProperties}
              >
                <Button asChild>
                  <a href="#work">
                    {t.hero.enter}
                    <ArrowDownRight className="size-4" />
                  </a>
                </Button>
                <Button asChild variant="ghost">
                  <a href="#contact">{t.hero.brief}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
