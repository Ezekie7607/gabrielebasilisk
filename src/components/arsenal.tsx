import { useI18n } from "@/lib/locale";
import { cn } from "@/lib/utils";

export function Arsenal() {
  const { t } = useI18n();
  return (
    <section aria-labelledby="arsenal-title" id="arsenal">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <p className="flow-in font-pixel text-micro tracking-widest text-muted">
          {t.arsenal.kicker}
        </p>
        <h2 id="arsenal-title" className="flow-in mt-4 max-w-3xl leading-tight text-fg">
          <span className="reveal-slot block"><span className="reveal-line block font-display text-section text-muted">{t.arsenal.titleA}</span></span>
          <span className="reveal-slot block"><span className="reveal-line block font-display text-section">{t.arsenal.titleB}</span></span>
        </h2>
        <p className="flow-in-late mt-5 max-w-xl text-base leading-normal text-muted">
          {t.arsenal.body}
        </p>
        <ul className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-grid bg-grid sm:grid-cols-2 lg:grid-cols-3">
          {/* Item 01 leads: 2 cols x 2 rows on lg. The arithmetic is exact, 4 cells for the lead
              plus 5 singles is 9, so the 3-col grid still closes as three full rows with no holes.
              Below lg it collapses back to a plain stack and the lead is just a taller card. */}
          {t.arsenal.items.map((item, i) => {
            const lead = i === 0
            return (
              <li
                key={item.num}
                className={cn(
                  "group flex flex-col bg-bg p-6 transition-colors duration-200 hover:bg-surface sm:p-8",
                  lead && "lg:col-span-2 lg:row-span-2 lg:p-12",
                  i % 2 === 0 ? "flow-in" : "flow-in-late",
                )}
              >
                <p
                  aria-hidden="true"
                  className={cn(
                    "ghost-num transition-colors duration-200 group-hover:text-fg/25",
                    lead ? "text-5xl lg:text-7xl" : "text-3xl",
                  )}
                >
                  {item.num}
                </p>
                {/* The lead cell is twice as tall as its content, so the copy sits at the foot of
                    it and the numeral holds the top. Empty space between them is the composition,
                    not a gap left over. */}
                <div className={cn(lead && "lg:mt-auto lg:pt-16")}>
                  <h3
                    className={cn(
                      "mt-4 inline-block font-display text-fg",
                      lead ? "text-2xl lg:text-4xl" : "text-xl",
                    )}
                  >
                    {item.title}
                    <span className="block h-px max-w-0 bg-fg transition-[max-width] duration-300 ease-out-expo group-hover:max-w-full" />
                  </h3>
                  <p
                    className={cn(
                      "mt-3 leading-normal text-muted",
                      lead ? "max-w-lg text-base" : "max-w-md text-sm",
                    )}
                  >
                    {item.body}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  );
}
