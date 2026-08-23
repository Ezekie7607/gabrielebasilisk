import { useI18n } from "@/lib/locale";
import { cn } from "@/lib/utils";

export function Arsenal() {
  const { t } = useI18n();
  return (
    <section id="arsenal">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <p className="flow-in font-pixel text-micro tracking-widest text-muted">
          {t.arsenal.kicker}
        </p>
        <h2 className="flow-in mt-4 max-w-2xl leading-tight text-fg">
          <span className="block font-display text-section">{t.arsenal.titleA}</span>
          <span className="font-script mt-2 block text-[clamp(1.6rem,3.4vw,2.6rem)]">
            {t.arsenal.titleB}
          </span>
        </h2>
        <p className="flow-in-late mt-5 max-w-xl text-base leading-normal text-muted">
          {t.arsenal.body}
        </p>
        <ul className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-border/60 bg-border/40 sm:grid-cols-2 lg:grid-cols-3">
          {t.arsenal.items.map((item, i) => (
            <li
              key={item.num}
              className={cn(
                "group bg-bg p-6 transition-colors duration-200 hover:bg-surface sm:p-8",
                i % 2 === 0 ? "flow-in" : "flow-in-late",
              )}
            >
              <p className="ghost-num text-3xl transition-colors duration-200 group-hover:text-fg/25">
                {item.num}
              </p>
              <h3 className="mt-4 inline-block font-display text-xl text-fg">
                {item.title}
                <span className="block h-px max-w-0 bg-fg transition-[max-width] duration-300 ease-out-expo group-hover:max-w-full" />
              </h3>
              <p className="mt-3 max-w-md text-sm leading-normal text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
