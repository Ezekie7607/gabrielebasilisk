import { ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/locale";

/**
 * The hero is two viewports tall and pins its copy for the whole run, which is the scroll room
 * the three WebGL beats need: the sphere implodes, detonates, then settles into the galaxy while
 * the reader is still inside this section. `#top` is what scroll-root measures for flow.heroOut.
 *
 * Every vertical gap below is tighter on phones than on desktop, and `.hero-stats` drops out
 * entirely under 700px of viewport height (see styles.css). That is not cosmetic: the copy is
 * bottom-anchored in an `h-svh` box, so its height IS the free band the WebGL orchestrator sizes
 * the sphere into. At the shipped desktop spacing a 375x667 phone left an 8px band and the hero
 * lost its object completely.
 */
export function Hero() {
  const { t } = useI18n();
  return (
    <section id="top" className="relative min-h-[200svh]">
      <div className="sticky top-0 flex h-svh flex-col justify-end overflow-hidden">
        <div className="copy-veil pointer-events-none absolute inset-x-0 bottom-0 h-[62%]" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-9 pt-24 sm:px-6 sm:pb-12">
          <div id="hero-copy" className="hero-flow relative mx-auto w-full max-w-3xl text-center">
            <p className="stagger-in font-pixel text-micro tracking-widest text-muted">
              {t.hero.kicker}
            </p>
            <p className="font-script stagger-in mt-4 text-[clamp(1.4rem,3.4vw,2.15rem)] text-fg">
              {t.hero.motto}
            </p>
            <h1 className="stagger-in mt-2 text-balance font-display text-hero leading-display text-fg">
              {t.hero.h1a} {t.hero.h1b}
              <br />
              <span className="text-muted">{t.hero.h1c}</span> {t.hero.h1d}
            </h1>
            <p className="stagger-in mx-auto mt-5 max-w-xl text-base leading-normal text-muted">
              {t.hero.lead}
            </p>
            <div className="stagger-in mt-5 flex flex-wrap items-center justify-center gap-3 sm:mt-7">
              <Button asChild>
                <a href="#doctrine">
                  {t.hero.enter}
                  <ArrowDownRight className="size-4" />
                </a>
              </Button>
              <Button asChild variant="ghost">
                <a href="#contact">{t.hero.brief}</a>
              </Button>
            </div>

            <dl className="hero-stats stagger-in mx-auto mt-5 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-4 border-t border-border/60 pt-4 sm:mt-8 sm:grid-cols-4 sm:gap-x-0 sm:gap-y-5 sm:divide-x sm:divide-border/60 sm:pt-5">
              {t.stats.map((stat) => (
                <div key={stat.label} className="sm:px-4">
                  <dt className="font-pixel text-micro tracking-widest text-muted">{stat.label}</dt>
                  <dd className="mt-1.5 font-display text-lg text-fg tabular-nums">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
