import { ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/locale";

export function ContactBlock() {
  const { t } = useI18n();
  return (
    <section id="contact" className="relative overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <p className="flow-in font-pixel text-micro tracking-widest text-muted">{t.contact.kicker}</p>
        <h2 className="flow-in mt-4 max-w-3xl leading-tight text-fg">
          <span className="block font-display text-section">{t.contact.titleA}</span>
          <span className="font-script mt-1 block text-[clamp(1.4rem,3vw,2.1rem)]">{t.contact.titleB}</span>
        </h2>
        <p className="flow-in-late mt-5 max-w-lg text-base leading-normal text-muted">{t.contact.body}</p>
        <a
          href={`mailto:${profile.email}`}
          className="flow-in-later mt-10 block break-all font-display text-quote text-fg sm:text-section"
        >
          {profile.email}
        </a>
        <div className="flow-in-later mt-8 flex flex-wrap gap-3">
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
