import { useI18n } from "@/lib/locale";
import { cn } from "@/lib/utils";

export function Doctrine() {
  const { t } = useI18n();
  const loop = [...t.marquee, ...t.marquee];
  return (
    <>
      <div className="overflow-hidden" aria-hidden="true">
        <div className="marquee-track flex w-max gap-8 py-3 pr-8">
          {loop.map((item, i) => (
            <span key={`${item}-${i}`} className="flex items-center gap-8">
              <span className="font-pixel text-micro tracking-widest text-muted">{item}</span>
              <span className="size-1.5 bg-primary" />
            </span>
          ))}
        </div>
      </div>

      <section aria-labelledby="doctrine-title" id="doctrine" className="relative">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-16">
            <div className="flow-in lg:sticky lg:top-24 lg:self-start">
              <p className="font-pixel text-micro tracking-widest text-muted">
                {t.doctrine.kicker}
              </p>
              {/* Setup dim, payoff bright: the same device the hero h1 already uses, so the page
                  carries one idea four times instead of four ideas once. The script used to take
                  this second line, which put every punchline in the lightest voice on the page. */}
              <h2 id="doctrine-title" className="mt-4 leading-tight text-fg">
                <span className="reveal-slot block">
                  <span className="reveal-line block font-display text-section text-muted">
                    {t.doctrine.titleA}
                  </span>
                </span>
                <span className="block font-display text-section">{t.doctrine.titleB}</span>
              </h2>
              <p className="mt-5 max-w-md text-base leading-normal text-muted">{t.doctrine.body}</p>

              {/* Index rail. The sticky column used to end here, which at 1440x900 left ~420px of
                  empty sticky black beside the list. The rail fills it with the five titles and an
                  SVG line that draws as the section scrolls, so the column tracks the list it sits
                  beside. aria-hidden: the real content is the <ol> to the right, this is wayfinding. */}
              <div className="relative mt-12 hidden lg:block" aria-hidden="true">
                <svg
                  className="absolute left-[3px] top-2 h-[calc(100%-1rem)] w-0.5 overflow-visible text-border"
                  viewBox="0 0 2 100"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <line
                    x1="1"
                    y1="0"
                    x2="1"
                    y2="100"
                    stroke="currentColor"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    pathLength={1}
                    className="svg-draw"
                  />
                </svg>
                <ol className="flex flex-col gap-5 pl-7">
                  {t.laws.map((law) => (
                    <li key={law.num} className="relative flex items-baseline gap-3">
                      <svg
                        className="absolute -left-7 top-1/2 size-[7px] -translate-y-1/2 text-muted/70"
                        viewBox="0 0 8 8"
                      >
                        <circle cx="4" cy="4" r="3" fill="currentColor" />
                      </svg>
                      <span className="font-pixel text-micro tracking-widest text-muted/60">
                        {law.num}
                      </span>
                      <span className="font-pixel text-micro tracking-widest text-muted">
                        {law.title}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <ol className="flex flex-col">
              {t.laws.map((law, i) => (
                <li
                  key={law.num}
                  className={cn(
                    "flex items-start gap-5 border-t border-border/60 py-8 first:border-t-0 first:pt-0 sm:gap-8",
                    i % 2 === 0 ? "flow-in" : "flow-in-late",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="ghost-num shrink-0 text-[clamp(2.5rem,5vw,4.25rem)]"
                  >
                    {law.num}
                  </span>
                  <div className="pt-1 sm:pt-2">
                    <h3 className="font-display text-quote leading-snug text-fg">{law.title}</h3>
                    <p className="mt-3 max-w-xl text-base leading-normal text-muted">{law.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <div className="overflow-hidden py-10 sm:py-14" aria-hidden="true">
        <p className="flow-strip-text whitespace-nowrap font-display text-section text-fg">
          {t.strip}
        </p>
      </div>
    </>
  );
}
