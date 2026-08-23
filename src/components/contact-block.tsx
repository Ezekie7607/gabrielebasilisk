import { ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/locale";

export function ContactBlock() {
  const { t } = useI18n();
  return (
    <section id="contact" className="relative overflow-hidden">
      <span
        aria-hidden="true"
        className="ghost-num pointer-events-none absolute -top-4 right-4 hidden text-[clamp(6rem,14vw,13rem)] sm:block sm:right-6"
      >
        04
      </span>
      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-36 lg:py-44">
        <p className="flow-in font-pixel text-micro tracking-widest text-muted">{t.contact.kicker}</p>
        <h2 className="flow-in mt-4 max-w-3xl leading-tight text-fg">
          <span className="block font-display text-section">{t.contact.titleA}</span>
          <span className="font-script mt-2 block text-[clamp(1.6rem,3.4vw,2.6rem)]">{t.contact.titleB}</span>
        </h2>
        <p className="flow-in-late mt-5 max-w-lg text-base leading-normal text-muted">{t.contact.body}</p>
        <div className="flow-in-later mt-10 h-px w-full max-w-2xl bg-border/60 sm:mt-14" />
        <a
          href={`mailto:${profile.email}`}
          className="flow-in-later mt-8 block break-all font-display text-[clamp(1.9rem,5.5vw,5.25rem)] leading-[0.95] text-fg transition-colors duration-200 hover:text-muted sm:mt-10"
        >
          {profile.email}
        </a>
        <div className="flow-in-later mt-10 flex flex-wrap gap-3 sm:mt-12">
          <Button asChild>
            <a href={`mailto:${profile.email}`}>
              {t.contact.write}
              <ArrowUpRight className="size-4" />
            </a>
          </Button>
          <Button asChild variant="ghost">
            <a href={profile.githubUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </Button>
          <Button asChild variant="ghost">
            <a href={profile.xUrl} target="_blank" rel="noreferrer">
              X / @{profile.x}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
