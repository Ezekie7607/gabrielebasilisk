import { useI18n } from "@/lib/locale";

export function Arsenal() {
  const { t } = useI18n();
  return (
    <section id="arsenal">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <p className="flow-in font-pixel text-micro tracking-widest text-muted">{t.arsenal.kicker}</p>
        <h2 className="flow-in mt-4 max-w-2xl leading-tight text-fg">
          <span className="block font-display text-section">{t.arsenal.titleA}</span>
          <span className="font-script mt-1 block text-[clamp(1.4rem,3vw,2.1rem)]">{t.arsenal.titleB}</span>
        </h2>
        <p className="flow-in-late mt-5 max-w-xl text-base leading-normal text-muted">{t.arsenal.body}</p>
        <ul className="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-14">
          {t.arsenal.items.map((item, i) => (
            <li key={item.num} className={i % 2 === 0 ? "flow-in" : "flow-in-late"}>
              <p className="font-pixel text-micro tracking-widest text-muted">{item.num}</p>
              <h3 className="mt-3 font-display text-xl text-fg">{item.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-normal text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
