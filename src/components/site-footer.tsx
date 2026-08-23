import { profile } from "@/lib/content";
import { useI18n } from "@/lib/locale";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="relative z-10 text-fg">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-pixel text-micro tracking-widest text-muted">
          © 2026 {profile.name} · {profile.brand}
        </p>
        <p className="font-pixel text-micro tracking-widest text-muted">{t.location}</p>
      </div>
    </footer>
  );
}
