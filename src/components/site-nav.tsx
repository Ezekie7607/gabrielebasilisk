import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { profile, type Lang } from "@/lib/content";
import { useI18n } from "@/lib/locale";
import { cn } from "@/lib/utils";

function LangSwitch() {
  const { lang, setLang } = useI18n();
  const btn = (code: Lang, label: string) => (
    <button
      type="button"
      onClick={() => setLang(code)}
      aria-pressed={lang === code}
      className={cn(
        "font-pixel text-micro tracking-widest transition-colors duration-150",
        lang === code ? "text-fg" : "text-muted hover:text-fg",
      )}
    >
      {label}
    </button>
  );
  return (
    <div className="flex items-center gap-2" role="group" aria-label="Language">
      {btn("en", "EN")}
      <span className="text-muted">/</span>
      {btn("it", "IT")}
    </div>
  );
}

export function SiteNav() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a
        href="#doctrine"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-skip focus:bg-primary focus:px-4 focus:py-2 focus:text-ink"
      >
        {t.skip}
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled || open
            ? "border-border/60 bg-gradient-to-b from-bg/95 via-bg/85 to-bg/70 backdrop-blur-md"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <a href="#top" className="flex items-baseline gap-2">
            <span className="font-pixel text-micro tracking-widest text-fg">{profile.brand}</span>
            <span className="hidden font-script text-2xl text-muted sm:inline">{profile.name}</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {t.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-pixel text-micro tracking-widest text-muted transition-colors duration-150 hover:text-fg"
              >
                {item.label}
              </a>
            ))}
            <a
              href={`mailto:${profile.email}`}
              className="font-pixel text-micro tracking-widest text-fg"
            >
              {t.hire}
            </a>
            <LangSwitch />
          </nav>
          <div className="flex items-center gap-3 md:hidden">
            <LangSwitch />
            <button
              type="button"
              className="relative flex size-11 items-center justify-center text-fg"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">{open ? t.closeMenu : t.openMenu}</span>
              <span className="relative size-5">
                <Menu
                  className={cn(
                    "absolute inset-0 size-5 transition-[opacity,transform,filter] duration-300 ease-icon",
                    open ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none",
                  )}
                />
                <X
                  className={cn(
                    "absolute inset-0 size-5 transition-[opacity,transform,filter] duration-300 ease-icon",
                    open ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-40 bg-bg/95 px-6 pt-24 backdrop-blur-sm transition-[opacity,transform] duration-200 ease-out-expo md:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        inert={!open}
      >
        <nav className="flex flex-col gap-2" aria-label="Mobile">
          {t.nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-baseline justify-between border-b border-border py-4"
            >
              <span className="font-display text-section text-fg">{item.label}</span>
              <span className="font-pixel text-micro tracking-widest text-muted">0{i + 1}</span>
            </a>
          ))}
          <a
            href={`mailto:${profile.email}`}
            className="mt-6 font-pixel text-sm tracking-widest text-primary"
            onClick={() => setOpen(false)}
          >
            {profile.email}
          </a>
        </nav>
      </div>
    </>
  );
}
