import { useI18n } from "@/lib/locale";

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

      <section id="doctrine" className="relative">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-16">
            <div className="flow-in lg:sticky lg:top-24 lg:self-start">
              <p className="font-pixel text-micro tracking-widest text-muted">{t.doctrine.kicker}</p>
              <h2 className="mt-4 leading-tight text-fg">
                <span className="block font-display text-section">{t.doctrine.titleA}</span>
                <span className="font-script mt-1 block text-[clamp(1.4rem,3vw,2.1rem)]">{t.doctrine.titleB}</span>
              </h2>
              <p className="mt-5 max-w-md text-base leading-normal text-muted">{t.doctrine.body}</p>
            </div>
            <ol className="flex flex-col gap-8">
              {t.laws.map((law, i) => (
                <li key={law.num} className={i % 2 === 0 ? "flow-in" : "flow-in-late"}>
                  <p className="font-pixel text-micro tracking-widest text-muted">{law.num}</p>
                  <h3 className="mt-2 font-display text-quote leading-snug text-fg">{law.title}</h3>
                  <p className="mt-3 max-w-xl text-base leading-normal text-muted">{law.body}</p>
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
