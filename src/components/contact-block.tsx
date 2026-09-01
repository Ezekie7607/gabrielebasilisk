import { ArrowUpRight } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { profile } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/locale";

export function ContactBlock() {
  const { t, lang } = useI18n();
  const id = useId();
  const [copied, setCopied] = useState(false);

  // Static site, no mail backend: the form posts nowhere. It composes the message in the visitor's
  // own email client, already addressed and subject-lined, and the visitor sends it from there.
  // Two failure modes are covered before the mailto fires. A machine with no registered mail
  // handler swallows the navigation without any event to catch, so the composed message is first
  // copied to the clipboard and a visible confirmation names the address to paste it to. And some
  // mailto resolvers cap the URL near ~2000 chars, so the textarea carries a maxLength that keeps
  // the encoded URL under that instead of truncating a long brief in silence.
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const subject = lang === "it" ? `Progetto — ${name}` : `Project — ${name}`;
    const body = `${message}\n\n${name} · ${email}`;
    try {
      await navigator.clipboard.writeText(`${subject}\n\n${body}`);
      setCopied(true);
    } catch {
      // Clipboard can be denied; the mailto below is then the only path, as before.
    }
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  const field =
    "rounded-sm border border-field bg-transparent px-4 py-3 text-base text-fg transition-colors duration-150 hover:border-muted";
  const labelCls = "font-pixel text-micro tracking-widest text-muted";

  return (
    <section aria-labelledby="contact-title" id="contact" className="relative overflow-hidden">
      <span
        aria-hidden="true"
        className="ghost-num pointer-events-none absolute top-10 right-4 hidden text-[clamp(6rem,14vw,13rem)] sm:block sm:right-6"
      >
        05
      </span>
      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-36 lg:py-44">
        <p className="flow-in font-pixel text-micro tracking-widest text-muted">{t.contact.kicker}</p>
        <h2 id="contact-title" className="flow-in mt-4 max-w-3xl leading-tight text-fg">
          <span className="reveal-slot block"><span className="reveal-line block font-display text-section text-muted">{t.contact.titleA}</span></span>
          <span className="reveal-slot block"><span className="reveal-line block font-display text-section">{t.contact.titleB}</span></span>
        </h2>
        <p className="flow-in-late mt-5 max-w-lg text-base leading-normal text-muted">{t.contact.body}</p>
        <svg
          aria-hidden="true"
          className="flow-in-later mt-10 h-px w-full text-border/60 sm:mt-14"
          viewBox="0 0 100 1"
          preserveAspectRatio="none"
          fill="none"
        >
          <line
            x1="0"
            y1="0.5"
            x2="100"
            y2="0.5"
            stroke="currentColor"
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            className="svg-draw"
          />
        </svg>
        {/* break-all used to cut inside the domain ("gmail.c | om" at 390px). Split at the @ instead:
            the break lands in the same place at every width, and the provider stops being the
            second-loudest word on the page. Hover lights both halves so it still reads as one link. */}
        <a
          href={`mailto:${profile.email}`}
          className="flow-in-later group mt-8 block font-display text-[clamp(1.9rem,0.9rem+4.4vw,4.75rem)] leading-[0.95] text-fg transition-colors duration-200 sm:mt-10"
        >
          <span className="block">{profile.email.split("@")[0]}</span>
          <span className="block text-muted transition-colors duration-200 group-hover:text-fg">
            @{profile.email.split("@")[1]}
          </span>
        </a>
        <form onSubmit={onSubmit} className="flow-in-later mt-10 grid max-w-lg gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor={`${id}-name`} className={labelCls}>
                {t.contact.form.name}
              </label>
              <input
                id={`${id}-name`}
                name="name"
                type="text"
                autoComplete="name"
                required
                className={field}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor={`${id}-email`} className={labelCls}>
                {t.contact.form.email}
              </label>
              <input
                id={`${id}-email`}
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                required
                className={field}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <label htmlFor={`${id}-message`} className={labelCls}>
              {t.contact.form.message}
            </label>
            <textarea
              maxLength={1500}
              id={`${id}-message`}
              name="message"
              rows={5}
              required
              className={`${field} resize-y`}
            />
          </div>
          <div className="mt-1">
            <p className="text-sm leading-normal text-muted">
              {lang === "it" ? "Tutti i campi sono obbligatori." : "All fields are required."}
            </p>
            <Button type="submit" aria-describedby={`${id}-hint`}>
              {t.contact.form.send}
              <ArrowUpRight className="size-4" />
            </Button>
            <p id={`${id}-hint`} className="mt-3 text-sm leading-normal text-muted" aria-live="polite">
              {copied
                ? lang === "it"
                  ? `Messaggio copiato. Se la posta non si apre, incollalo in una email a ${profile.email}.`
                  : `Message copied. If your email client does not open, paste it into an email to ${profile.email}.`
                : t.contact.form.hint}
            </p>
          </div>
        </form>

        <div className="flow-in-later mt-12 flex flex-wrap gap-3">
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
