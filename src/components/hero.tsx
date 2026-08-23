import { ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/locale";

export function Hero() {
  const { t } = useI18n();
  return (
    <section id="top" className="relative min-h-svh overflow-hidden">
      <div className="copy-veil pointer-events-none absolute inset-x-0 bottom-0 h-[70%]" />
      <div className="relative z-10 mx-auto flex min-h-svh max-w-6xl flex-col justify-end px-4 pb-20 pt-24 sm:px-6 sm:pb-14">
        <div id="hero-copy" className="hero-flow relative lg:max-w-[55%]">
          <p className="stagger-in font-pixel text-micro tracking-widest text-muted">
            {t.hero.kicker}
          </p>
          <p className="font-script stagger-in mt-5 text-[clamp(1.55rem,4vw,2.5rem)] text-fg">
            {t.hero.motto}
          </p>
          <h1 className="stagger-in -mt-1 font-display text-display leading-display text-fg sm:-mt-2">
            {t.hero.h1a}
            <br />
            {t.hero.h1b}
            <br />
            <span className="text-muted">{t.hero.h1c}</span>
            <br />
            {t.hero.h1d}
          </h1>
          <p className="stagger-in mt-6 max-w-xl text-base leading-normal text-muted sm:text-lg">
            {t.hero.lead}
          </p>
          <div className="stagger-in mt-8 flex flex-wrap items-center gap-3">
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

          <dl className="stagger-in mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-border/60 pt-6 sm:mt-14 sm:grid-cols-4 sm:gap-x-0 sm:divide-x sm:divide-border/60">
            {t.stats.map((stat) => (
              <div key={stat.label} className="py-1 sm:px-6 sm:first:pl-0">
                <dt className="font-pixel text-micro tracking-widest text-muted">{stat.label}</dt>
                <dd className="mt-2 font-display text-lg text-fg tabular-nums">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
